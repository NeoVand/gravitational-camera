---
id: '1.5b'
title: "Complex numbers: the shear as one number, rotations you can multiply, Euler's formula"
question: 'Why do the two polarizations of a gravitational wave differ by a turn of 45°, when those of light differ by 90°?'
part: '1'
requires: ['1.1', '1.4', '1.5']
paper: [fig:tidal, sec:regimes, sec:pixel, eq:shear-zeros, fig:buried-ruler, eq:rotor-amplitudes, eq:circular, eq:W, eq:square, sec:one-pixel]
figures: [fig:tidal, fig:buried-ruler]
live: [spin-two-dial]
depth: A
---

A ring of free balls in a gravitational wave that travels toward the reader is stretched along one axis and
squeezed along the other, as in panel (b) of Figure [](/paper/#fig:tidal). In panel (c) the same pattern has its axes on the
diagonals. These are the wave's two **polarizations**, its two independent patterns of stretch and squeeze, and they
differ by a turn of 45°. The polarization of light is the direction of its electric field across the beam, and light's
two polarizations are two such directions, 90° apart. Why do the two polarizations of a gravitational wave differ by a
turn of 45°, when those of light differ by 90°?

{{paper fig:tidal}}

The reason is that an arrow turned by half a circle points the other way, but a pattern of stretch and squeeze turned
by half a circle looks exactly as it did before. This section turns that remark into arithmetic with complex numbers,
which also find buried masses, tell which way a distant rotor turns, and write the ten numbers of a pixel as one
complex table.[^p-spin]

::: plain
A complex number is a point of a plane that can also be multiplied by another such point: distances from the centre
multiply and angles add, so multiplying by a number at distance one turns the plane.

An arrow in a plane is one complex number, and so is a pattern of stretch and squeeze, called the shear. When the axes
turn by some angle, the arrow's number turns back by that angle, but the shear turns back by twice the angle. Two
polarizations must not overlap, which for complex numbers means pointing 90° apart. An arrow gets there by turning
90°, but a shear when its pattern turns by only 45°.
:::

## A complex number is a point of the plane that can be multiplied

A point of a plane with two axes at right angles is a pair of numbers $(x, y)$, and two points add as arrows do. The
plane lacks a product that gives a third point of the plane: the dot product of two arrows is a single number, and
their cross product points out of the plane. The complex numbers supply the missing rule.

We write the point $(x, y)$ as

$$u = x + iy ,$$

and we multiply such expressions by the ordinary rules of algebra, with one extra rule: $\sym{imaginary-unit}{i}$ is a
number with $i^2 = -1$.[^u] No ordinary number has a negative square, so $i$ is a new kind of number. In the plane,
multiplying by $i$ is a quarter turn, and two quarter turns take 1 to $-1$.

An expression $u = x + iy$ is a **complex number**. The ordinary number $x$ is its **real part**, written
$\mathrm{Re}\,u$, and $y$ is its **imaginary part**, $\mathrm{Im}\,u$. In the **complex plane** the number 1 is one
step along the first axis and $i$ one step along the second. The number $i$ has no unit, so $u$ has the unit of $x$
and $y$. To multiply, we multiply out the four terms and replace $i^2$ by $-1$:

$$\begin{aligned}
(x_1 + iy_1)(x_2 + iy_2) &= x_1x_2 + ix_1y_2 + iy_1x_2 + i^2y_1y_2\\
&= (x_1x_2 - y_1y_2) + i\,(x_1y_2 + y_1x_2).
\end{aligned}$$

The distance of $u$ from the centre is its **modulus** $|u| = \sqrt{x^2 + y^2}$. Its angle, measured anticlockwise
from the positive real axis, is its **argument** $\arg u$, fixed only up to whole turns: $-90°$ and $270°$ name the
same point. For $u = 3 + 4i$ the modulus is $\sqrt{9 + 16} = 5$, and the argument is the
angle whose tangent is $4/3$, which is $53.1°$.

Each complex number has a mirror image in the real axis, its **complex conjugate** $u^* = x - iy$.[^bar] A number
times its conjugate is the square of its modulus, because the cross terms cancel:

$$u\,u^* = (x + iy)(x - iy) = x^2 + y^2 = |u|^2 .$$

This also gives division, $1/u = u^*/|u|^2$; for example $1/(3 + 4i) = (3 - 4i)/25 = 0.12 - 0.16i$.

## Multiplying multiplies lengths and adds angles

A number with modulus $r$ and argument $\theta$ has the components $x = r\cos\theta$ and $y = r\sin\theta$, so
$u = r\,(\cos\theta + i\sin\theta)$. We multiply two such numbers with the rule above:

$$\begin{aligned}
u_1u_2 = r_1r_2\bigl[&(\cos\theta_1\cos\theta_2 - \sin\theta_1\sin\theta_2)\\
&+ i\,(\sin\theta_1\cos\theta_2 + \cos\theta_1\sin\theta_2)\bigr].
\end{aligned}$$

The brackets are the addition formulas of trigonometry for $\cos(\theta_1 + \theta_2)$ and
$\sin(\theta_1 + \theta_2)$, which we use without proof, so

$$\boxed{\;|u_1u_2| = |u_1|\,|u_2|, \qquad \arg(u_1u_2) = \arg u_1 + \arg u_2 .\;} \label{eq:product}$$

![The numbers $u_1$ (modulus 2, argument 20°) and $u_2$ (modulus 1.5, argument 50°), and their product, of modulus
$2 \times 1.5 = 3$ and argument $20° + 50° = 70°$.](tut-cx-product){#fig:product}

Figure [](#fig:product) draws one product, and the square of $3 + 4i$ checks the rule: $9 - 16 + 24i = -7 + 24i$ has
modulus 25, the square of 5, and argument $106.3°$, twice $53.1°$.

So multiplication by a number of modulus 1 is a turn: if $|u_1| = 1$, then $u_1u_2$ is as far from the centre as $u_2$
and its angle is larger by $\arg u_1$. Two turns in a row are two multiplications, so these are rotations that can be
multiplied. The number $i$ has modulus 1 and argument $90°$, so two quarter turns take 1 to $-1$, which is what
$i \cdot i = -1$ means in the plane.

## Euler's formula: a turn is an exponential

We want a compact formula for the number of modulus 1 and argument $\theta$,
$f(\theta) = \cos\theta + i\sin\theta$. By [](#eq:product), $f(\theta_1)\,f(\theta_2) = f(\theta_1 +
\theta_2)$. Exponentials obey the same rule, $e^ae^b = e^{a+b}$, which suggests that $f$ is an exponential. We
differentiate $f$ with respect to $\theta$, treating $i$ as a constant, and take out a factor $i$, using $i^2 = -1$:

$$f'(\theta) = -\sin\theta + i\cos\theta = i\,(\cos\theta + i\sin\theta) = i\,f(\theta).$$

Also $f(0) = 1$. For an ordinary constant $a$, the function $e^{a\theta}$ is the one function whose derivative is $a$
times itself and whose value at $\theta = 0$ is 1. We take the same two properties, with $a = i$, as the meaning of
$e^{i\theta}$. The box below shows that only one function has them, and that the power series of the exponential
gives the same function. So $f(\theta) = e^{i\theta}$, which is **Euler's formula**:

$$\boxed{\;e^{i\theta} = \cos\theta + i\sin\theta .\;} \label{eq:euler}$$

The equation $f' = if$ has a picture (Figure [](#fig:unit-circle)): the point $f(\theta)$ on the circle of radius 1
has velocity $i$ times its position, a quarter turn from it with length 1, so it moves round the circle at unit speed
and after an arc of length $\theta$ stands at the angle $\theta$.

![The point $e^{i\theta}$ on the circle of radius 1 at $\theta = 40°$, and its derivative $ie^{i\theta}$ (orange),
drawn from its tip; the heavy arc from 1 has the length $\theta$.](tut-cx-euler){#fig:unit-circle}

::: derivation
### Only one function, and the power series

Suppose that $g(\theta)$ also has $g' = ig$ and $g(0) = 1$. The conjugate $f^*(\theta) = \cos\theta - i\sin\theta$ has
the derivative $-\sin\theta - i\cos\theta = -i\,f^*$. We differentiate the product $p = g\,f^*$ with the product rule:

$$p' = g'f^* + g\,(f^*)' = i\,g f^* - i\,g f^* = 0 .$$

So $p$ is constant and equal to its value at $\theta = 0$, which is 1. We multiply $gf^* = 1$ by $f$ and use
$f^*f = |f|^2 = \cos^2\theta + \sin^2\theta = 1$, which gives $g = f$.

The power series of the exponential is $e^x = 1 + x + x^2/2! + x^3/3! + \dots$. We put $x = i\theta$ and use the powers
$i^2 = -1$, $i^3 = -i$, $i^4 = 1$, which then repeat:

$$e^{i\theta} = \Bigl(1 - \frac{\theta^2}{2!} + \frac{\theta^4}{4!} - \dots\Bigr) + i\Bigl(\theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \dots\Bigr).$$

The two brackets are the Taylor series of $\cos\theta$ and $\sin\theta$. Differentiating the series term by term
gives $i$ times the same series, so it has both defining properties.
:::

A half turn is $e^{i\pi} = \cos\pi + i\sin\pi = -1$, a quarter turn is $e^{i\pi/2} = i$, and a whole turn is
$e^{2\pi i} = 1$. Every complex number can now be written in **polar form**, $u = r\,e^{i\theta}$ with $r = |u|$ and
$\theta = \arg u$; for example $3 + 4i = 5\,e^{0.927i}$, since $53.1°$ is 0.927 radians. Raising $e^{i\theta}$ to a
whole power $n$ multiplies its angle by $n$, $(e^{i\theta})^n = e^{in\theta}$. For $n = 2$ we expand the left side and
compare real and imaginary parts:

$$\begin{aligned}
(\cos\theta + i\sin\theta)^2 &= (\cos^2\theta - \sin^2\theta) + 2i\sin\theta\cos\theta\\
&= \cos2\theta + i\sin2\theta .
\end{aligned}$$

These are the double-angle formulas, $\cos2\theta = \cos^2\theta - \sin^2\theta$ and $\sin2\theta =
2\sin\theta\cos\theta$.

For a small angle, $\cos\theta \approx 1$ and $\sin\theta \approx \theta$, so $e^{i\theta} \approx 1 + i\theta$.
Multiplying $u$ by $1 + i\theta$ adds $i\theta u$, which is $u$ turned by a quarter turn and shortened by the factor
$\theta$: the small turn $\delta\vect a = \vect\theta\times\vect a$ of section 1.1, in the plane. For
$\theta = 0.1$ the exact value is $0.9950 + 0.0998i$, which differs from $1 + 0.1i$ by 0.0050, about $\theta^2/2$.

## An arrow is one complex number, and turning the axes turns it back by the same angle

An arrow $\vect v$ that lies in the plane of the axes $x$ and $y$ becomes the complex number $v = v_x + iv_y$. The
third axis $z$ points out of the page, toward us. We turn the axes by the angle $\theta$ about $z$, anticlockwise as we
see them, which is a turn by the right-hand rule about $z$, as in section 1.1. The new axes are
$\vect e'_1 = (\cos\theta, \sin\theta)$ and $\vect e'_2 = (-\sin\theta, \cos\theta)$, and the new components are the
shadows $\vect e'_1\cdot\vect v$ and $\vect e'_2\cdot\vect v$ of the arrow on them:

$$v'_x = v_x\cos\theta + v_y\sin\theta, \qquad v'_y = -v_x\sin\theta + v_y\cos\theta .$$

We multiply $v$ by $\cos\theta - i\sin\theta$, using $i^2 = -1$:

$$\begin{aligned}
(v_x + iv_y)(\cos\theta - i\sin\theta) &= (v_x\cos\theta + v_y\sin\theta)\\
&\quad + i\,(-v_x\sin\theta + v_y\cos\theta)\\
&= v'_x + iv'_y .
\end{aligned}$$

The left side is $e^{-i\theta}v$, by Euler's formula, so

$$\boxed{\;v' = e^{-i\theta}\,v .\;} \label{eq:arrow-turn}$$

The arrow does not move, but the axes turn anticlockwise by $\theta$, so the arrow's angle measured from the new axes
is smaller by $\theta$: turning the axes by $\theta$ is turning the arrow by $-\theta$. We keep this sign from here on.
Section 1.1 checked it on a step of 1 cm to the east, seen from axes turned by 45°: $v = 1$ gives
$v' = e^{-i\pi/4} = 0.707 - 0.707i$, the components found there. A half turn of the axes gives $e^{-i\pi} = -1$, so
the arrow points the other way, and only a whole turn brings it back.

A quantity that is multiplied by $e^{-in\theta}$ when the axes turn by $\theta$ about an axis pointing toward us has
**spin** $n$. An arrow has spin one, and a number that does not change, such as a mass, has spin zero.[^spin]

## A tide across a direction is one complex number, and turning the axes turns it back by twice the angle

Now we look at a ring of free balls in the $x$, $y$ plane, with $z$ pointing toward us. By
[section 1.4](/tutorial/newton/tides/), each ball, at a small separation $\vect\xi$ from the centre, has the acceleration
$\ddot\xi_i = -\sym{tidal-tensor}{\curv{\tE}}_{ij}\,\xi_j$, where $\curv{\tE}_{ij}$ is the tidal tensor, in
$\mathrm{s^{-2}}$. A positive entry along a direction is a squeeze and a negative one a stretch. Within the plane only
three entries act: $\curv{\tE}_{xx}$, $\curv{\tE}_{yy}$ and $\curv{\tE}_{xy} = \curv{\tE}_{yx}$.

We want the pattern of stretch and squeeze around the ring. Take the ball in the direction
$\hat\xi = (\cos\varphi, \sin\varphi)$, at the angle $\varphi$ from the $x$ axis. Its acceleration, per metre of its
distance from the centre, is $-\curv{\tE}\hat\xi$, so its acceleration toward the centre, per metre, is the dot product
$\hat\xi_i\curv{\tE}_{ij}\hat\xi_j$. We write it out and use the double-angle formulas in the forms
$\cos^2\varphi = \tfrac12(1 + \cos2\varphi)$ and $\sin^2\varphi = \tfrac12(1 - \cos2\varphi)$:

$$\begin{aligned}
\hat\xi_i\curv{\tE}_{ij}\hat\xi_j &= \curv{\tE}_{xx}\cos^2\varphi + 2\curv{\tE}_{xy}\sin\varphi\cos\varphi\\
&\quad + \curv{\tE}_{yy}\sin^2\varphi\\
&= \tfrac12(\curv{\tE}_{xx} + \curv{\tE}_{yy}) + \tfrac12(\curv{\tE}_{xx} - \curv{\tE}_{yy})\cos2\varphi\\
&\quad + \curv{\tE}_{xy}\sin2\varphi .
\end{aligned}$$

The first term is the mean of the two diagonal entries. The table in the plane is this mean times the unit table plus
the trace-free table $\bigl(\begin{smallmatrix}a & b\\ b & -a\end{smallmatrix}\bigr)$ of
[section 1.5](/tutorial/newton/five-numbers/), with $a = \tfrac12(\curv{\tE}_{xx} - \curv{\tE}_{yy})$ and
$b = \curv{\tE}_{xy}$, and these are the coefficients of the two terms that depend on the direction. We put $a$ and
$b$ into one complex number and double it, so that its size is the gap between the two eigenvalues. The **shear** of
the tide in the plane is

$$\boxed{\;\sym{shear}{\curv{s}} = (\curv{\tE}_{xx} - \curv{\tE}_{yy}) + 2i\,\curv{\tE}_{xy} = 2(a + ib) ,\;} \label{eq:shear}$$

measured in $\mathrm{s^{-2}}$, like the tide.[^s-ratio][^p-shear] Multiplying out shows that the real part of
$\curv{s}\,e^{-2i\varphi}$ is $(\curv{\tE}_{xx} - \curv{\tE}_{yy})\cos2\varphi + 2\curv{\tE}_{xy}\sin2\varphi$. We
write $\curv{s} = |\curv{s}|\,e^{i\arg\curv{s}}$, so that this real part is $|\curv{s}|\cos(2\varphi - \arg\curv{s})$,
and the pattern around the ring is

$$\hat\xi_i\curv{\tE}_{ij}\hat\xi_j = \tfrac12(\curv{\tE}_{xx} + \curv{\tE}_{yy}) + \tfrac12|\curv{s}|\cos(2\varphi - \arg\curv{s}). \label{eq:ring}$$

The first term shrinks or swells the whole ring. The second changes its shape and depends on $2\varphi$, so two
opposite balls always move alike. The squeeze is strongest where the cosine is 1, at $\varphi = \tfrac12\arg\curv{s}$
and opposite it, and the stretch at right angles to that. These are the principal axes, and the values there are the
eigenvalues: the formula for a symmetric $2\times2$ table gives the mean plus or minus $\sqrt{a^2 + b^2} =
\tfrac12|\curv{s}|$. So

$$\boxed{\;\begin{aligned}
&\text{squeeze axis at } \tfrac12\arg\curv{s},\\
&\text{stretch axis at } \tfrac12\arg\curv{s} + 90°,\\
&\text{eigenvalues } \tfrac12(\curv{\tE}_{xx} + \curv{\tE}_{yy}) \pm \tfrac12|\curv{s}| .
\end{aligned}\;}$$

The person of section 1.4, 70 kg at 1 m along the $x$ axis, checks the sign. In a plane that contains the line to
the person, the table is $\mathrm{diag}(-2, 1)$ in units of $G\matter M/r^3$, so $\curv{s} = (-2 - 1)\,G\matter
M/r^3 = -3G\matter M/r^3$. Its size is $|\curv{s}| = 3 \times 6.674 \times 10^{-11} \times 70\unit{s^{-2}} = 1.40
\times 10^{-8}\unit{s^{-2}}$, three times the squeeze of $4.7 \times 10^{-9}\unit{s^{-2}}$. Its argument is $180°$,
so the squeeze axis is at $90°$, along $y$, and the stretch lies along $x$, toward the person, as it must. The mean is
$-\tfrac12$, so the eigenvalues are $-\tfrac12 \pm \tfrac32 = +1$ and $-2$.

### Turning the axes turns the shear twice as fast

We want the shear in axes turned anticlockwise by $\theta$ about $z$. Such a turn leaves the trace in the plane
alone, and section 1.5 found how it turns the trace-free part:

$$a' = a\cos2\theta + b\sin2\theta, \qquad b' = -a\sin2\theta + b\cos2\theta .$$

Multiplying out shows that these are the real and imaginary parts of $(a + ib)(\cos2\theta - i\sin2\theta)$, and
$\cos2\theta - i\sin2\theta = e^{-2i\theta}$ by Euler's formula. So the turning rule of section 1.5 for $(a, b)$ is
multiplication by $e^{-2i\theta}$, and since $\curv{s} = 2(a + ib)$,

$$\boxed{\;\curv{s}' = e^{-2i\theta}\,\curv{s} .\;} \label{eq:shear-turn}$$

For the person to the north-east of section 1.1, before turning the axes by 45°, the first two rows and columns were $\curv{\tE}_{xx} = \curv{\tE}_{yy} = -\tfrac12$ and $\curv{\tE}_{xy} = -\tfrac32$, in
units of $G\matter M/r^3$, so $\curv{s} = -3i$. Equation [](#eq:shear-turn) gives $\curv{s}' = e^{-i\pi/2}(-3i) =
(-i)(-3i) = -3$, the shear of $\mathrm{diag}(-2, 1)$ found there after the turn.

The factor $e^{-2i\theta}$ makes the shear a quantity of **spin two**. A half turn gives $e^{-2\pi i} = 1$, so the
pattern looks exactly as it did before; a quarter turn gives $-1$, so the stretch and the squeeze change places; a
turn of 45° gives $-i$.

### Why the two polarizations are 45° apart

In a gravitational wave that travels along $z$, toward us, the tide acts only across the direction of travel, and there
it has no trace (section 1.5; [section 7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)
derives it). The table in the plane is then

$$\begin{pmatrix}\curv{\tE}_+ & \curv{\tE}_\times\\ \curv{\tE}_\times & -\curv{\tE}_+\end{pmatrix}, \qquad \curv{s} = 2(\curv{\tE}_+ + i\curv{\tE}_\times),$$

where $\sym{wave-polarizations}{\curv{\tE}_+}$ and $\curv{\tE}_\times$ are the tides of the wave's two
polarizations, in $\mathrm{s^{-2}}$.[^plus] Two polarizations must share nothing, so that a wave can carry any amount of one with none of the other: the two
tables must be **orthogonal**, with contraction $T_{ij}U_{ij}$ of section 1.5 equal to zero. For two trace-free tables in the plane, with shears
$\curv{s}_1 = 2(a_1 + ib_1)$ and $\curv{s}_2 = 2(a_2 + ib_2)$, multiplying out shows that the contraction
$2(a_1a_2 + b_1b_2)$ equals $\tfrac12\mathrm{Re}(\curv{s}_1\curv{s}_2^*)$. It is zero when the two shears point 90°
apart in the complex plane. The plus pattern has a real shear and the cross pattern an imaginary one, so they are
orthogonal.

This answers the question of this section. Turning a pattern by $\beta$ is turning the axes by $-\beta$, so it multiplies the shear by $e^{2i\beta}$. The turned pattern is orthogonal to the
first when $2\beta = 90°$, so $\beta = 45°$. The electric field of light across its beam is an arrow $v$. Two arrows
have the dot product $\mathrm{Re}(v_1v_2^*)$, which is zero when they point 90° apart, and turning an arrow by $\beta$
multiplies $v$ by $e^{i\beta}$, so light needs $\beta = 90°$. Light's two polarizations are arrows 90° apart, and
gravity's are patterns of spin two, 45° apart (Figure [](#fig:spin-two)).

![Left, a ring under the shear $\curv{s} = 2$, squeezed along $x$ (blue) and stretched along $y$ (orange).
Middle, the same ring with the axes turned by $\theta = 45°$ (old axes grey). Right, the turn carries the shear from 2
to $-2i$, while an arrow $v = 1$ turns back by only 45°.](tut-cx-spin){#fig:spin-two}

::: try {#spin-two-dial}
Panel (a) shows a ring of twelve free balls under the shear $\curv{s} = 2$, with an arrow $v$ drawn at 30°, and panel
(b) shows both numbers in the complex plane. Drag the axes, or use the slider or the arrow keys, to turn them by
$\theta$.

Before you turn anything, predict: if you turn the axes by 180°, does the ring's pattern look the same, and does the
arrow? Then check. Next stop at 45°: the arrow's number has turned back by 45°, and the shear's by 90°, to $-2i$. Last,
turn on the rotor's wave, described below, and move the inclination from face on, where the shear goes round a circle,
to edge on, where it swings along a line. (The figure writes the time at the camera as $u$,
where this section writes $t$.)
:::

## The shear of one mass is a square

Put a point mass $\sym{mass}{\matter{M}}$ at the depth $Z$ below the origin of a horizontal plane, with $z$ pointing
up. A pixel on the plane stands at the place $(x, y)$, which we write as one complex number,
$\sym{complex-place}{w} = x + iy$, in metres. Its distance from the mass is $r = \sqrt{x^2 + y^2 + Z^2}$. We want the
shear in the horizontal plane at the pixel. The tide of a point mass, from section 1.4, is $\curv{\tE}_{ij} =
(G\matter M/r^3)(\delta_{ij} - 3\hat n_i\hat n_j)$, with the unit vector from the pixel toward the mass
$\hat n = (-x, -y, -Z)/r$. The deltas cancel in the difference of the diagonal entries and are absent from $\curv{\tE}_{xy}$:

$$\curv{\tE}_{xx} - \curv{\tE}_{yy} = -\frac{3G\matter M}{r^5}\,(x^2 - y^2), \qquad \curv{\tE}_{xy} = -\frac{3G\matter M}{r^5}\,xy .$$

We put these into equation [](#eq:shear) and recognize $w^2 = (x + iy)^2 = x^2 - y^2 + 2ixy$:

$$\boxed{\;\curv{s} = -\frac{3G\matter M\,w^2}{r^5} .\;} \label{eq:point-shear}$$

The units are $\mathrm{m^3\,s^{-2}}$ times $\mathrm{m^2}$ over $\mathrm{m^5}$, which is $\mathrm{s^{-2}}$. By equation
[](#eq:product), $\arg\curv{s} = 2\arg w + 180°$, so the squeeze axis lies at $\arg w + 90°$ and the stretch axis at
$\arg w$, along the horizontal line through the pixel and the point above the mass. Directly above the mass $w = 0$
and the shear vanishes, because no horizontal direction is singled out. For a mass in the plane itself, $|w| = r$ and
$|\curv{s}| = 3G\matter M/r^3$, the person's value. Turning the axes multiplies $w^2$ by $e^{-2i\theta}$, as equation
[](#eq:shear-turn) requires.

## Where the shear vanishes, its axes make half a turn round the zero

Put two equal masses $\matter M$ at the places $w = \pm d/2$ on the $x$ axis,
both at the depth $Z$ below the camera's plane. Seen from the pixel at $w$, the horizontal step to each mass is
$\pm d/2 - w$, and its square is $(w \mp d/2)^2$, so by equation [](#eq:point-shear)

$$\curv{s}(w) = -3G\matter M\left[\frac{(w - \tfrac d2)^2}{r_1^5} + \frac{(w + \tfrac d2)^2}{r_2^5}\right],$$

where $r_1$ and $r_2$ are the distances to the two masses. On the perpendicular bisector, $w = iy$, the two distances
are equal, $r^2 = d^2/4 + y^2 + Z^2$, and the two squares add to $(iy - d/2)^2 + (iy + d/2)^2 = 2(d^2/4 - y^2)$. So

$$\curv{s}(iy) = \frac{6G\matter M}{r^5}\Bigl(y^2 - \frac{d^2}{4}\Bigr),$$

which is zero at $y = \pm d/2$ whatever the depth. A **zero** of a field is a point where it vanishes. These two
zeros are exactly $d$ apart, so they measure the distance between two buried masses with no reconstruction. Solving
$\curv{s}(w) = 0$ numerically over the whole plane gives only these two at the depths $d$ and $0.9d$, and four more,
at $(\pm0.269d, \pm0.422d)$, at the depth $0.8d$. The extra zeros appear below the depth
$\tfrac{\sqrt3}{2}d = 0.866d$, for a reason found in the next section.[^p-zeros]

The argument of a complex number is also called its **phase**. Walk once anticlockwise round a small circle about one
of the zeros on the bisector. Near the zero the shear changes in proportion to the step from the zero, so it traces a small loop round the origin
of the complex plane. At the depths $d$ and $0.9d$ this loop goes once round, anticlockwise, so the phase grows by a
whole turn and the squeeze axis, at half the phase, turns by half a turn. This is the **phase winding** of the zero.
An axis has no head, so a half turn brings it back onto itself and the pattern of axes is smooth except at the zero;
a field of arrows could not do this, because an arrow must come back after whole turns. The lower panels of the
figure below colour each place by the phase of the shear, and all the colours meet at each zero.

{{paper fig:buried-ruler}}

## Below a depth of 0.87 times their separation, four more zeros appear

We want every zero of the pair's shear, and the depth at which their number changes. The shear vanishes where its
two terms cancel, that is where

$$\frac{(w - \tfrac d2)^2}{r_1^5} = -\frac{(w + \tfrac d2)^2}{r_2^5} .$$

The distances $r_1$ and $r_2$ are positive, so the two squares must point in opposite directions in the complex
plane. Squaring doubles an argument, by equation [](#eq:product), so $2\arg(w - \tfrac d2)$ and
$2\arg(w + \tfrac d2)$ differ by 180°, and the two arguments themselves differ by 90°. The numbers $w - \tfrac d2$
and $w + \tfrac d2$ are the horizontal steps to the pixel from the two points directly above the masses, so these two
steps meet at a right angle at the pixel. By Thales's theorem, a point from which a segment is seen at a right angle
lies on the circle that has the segment as its diameter. So every zero lies on the circle

$$|w| = \frac d2 ,$$

whatever the depth. The two zeros on the bisector, at $w = \pm i\,d/2$, are its top and its bottom.

The sizes of the two sides must also agree. We write $D_1 = |w - \tfrac d2|$ and $D_2 = |w + \tfrac d2|$ for the
horizontal distances, in metres, from the pixel to the two points above the masses. The two steps meet at a right
angle, so $D_1^2 + D_2^2 = d^2$ by Pythagoras, and the moduli of the two sides are equal when

$$F(D_1) = F(D_2), \qquad F(D) = \frac{D^2}{(D^2 + Z^2)^{5/2}} .$$

By equation [](#eq:point-shear), $3G\matter M\,F(D)$ is the size of the shear of one mass at the horizontal distance
$D$, so $F$ is in $\mathrm{m^{-3}}$. The first stretch exercise of this section shows that $F$ rises from zero above
the mass to its largest value at $D^2 = \tfrac23Z^2$, on a ring of radius $0.816Z$, and falls beyond it.

The zeros on the bisector have $D_1 = D_2 = d/\sqrt2$, so they satisfy this condition at every depth. Any other zero
needs two different distances with the same value of $F$, one inside the ring of largest shear and one outside it.
When the masses are deep, the ring is wide, and the distances near $d/\sqrt2$ all lie inside it, where $F$ rises.
As the masses rise, the ring shrinks. New zeros can branch off the two on the bisector when the ring passes through
them, at $\tfrac23Z^2 = \tfrac12d^2$:

$$\boxed{\;Z = \frac{\sqrt3}{2}\,d = 0.866\,d .\;}$$

The box below shows that this depth is exact. Deeper, there is no other zero; shallower, there is exactly one more on
each quarter of the circle, four in all. At the depth $0.8d$ the box gives $D_1 = 0.481d$ and $D_2 = 0.877d$, which
puts the zero on the circle at $(0.269d, 0.422d)$, the place found numerically above. As the masses rise toward the
camera's plane, the four new zeros slide down the circle toward the points directly above the masses: at the depth
$0.2d$ they stand at $(\pm0.4997d, \pm0.017d)$. The threshold depends only on the ratio $Z/d$, as it must, because the
masses and $G$ only multiply the shear.

::: derivation
### Exactly four more zeros, and only below 0.866 d

We write $X_1 = D_1^2/Z^2$ and $X_2 = D_2^2/Z^2$, which are pure numbers. Dividing $F$ by $Z^{-3}$, the two
conditions on a zero become

$$\frac{X_1}{(1 + X_1)^{5/2}} = \frac{X_2}{(1 + X_2)^{5/2}}, \qquad X_1 + X_2 = \frac{d^2}{Z^2} .$$

A zero off the bisector has $X_1 \ne X_2$. We define the number $m = [(1 + X_2)/(1 + X_1)]^{1/2}$, which is then not
1. The first condition says $X_2/X_1 = m^5$, and the definition of $m$ says $1 + X_2 = m^2(1 + X_1)$. We put
$X_2 = m^5X_1$ into the second, solve for $X_1$, and cancel the factor $m - 1$ from $m^2 - 1 = (m - 1)(m + 1)$ and
$m^3 - 1 = (m - 1)(m^2 + m + 1)$:

$$X_1 = \frac{m^2 - 1}{m^5 - m^2} = \frac{m + 1}{m^2(m^2 + m + 1)}, \qquad X_2 = m^5X_1 = \frac{m^3(m + 1)}{m^2 + m + 1} .$$

Adding the two gives the depth at which this value of $m$ occurs:

$$\frac{d^2}{Z^2} = S(m) = \frac{(m + 1)(m^5 + 1)}{m^2(m^2 + m + 1)} .$$

Replacing $m$ by $1/m$ and multiplying the numerator and the denominator by $m^6$ gives $S(m)$ back. That replacement
swaps $X_1$ and $X_2$, which is the mirror image of the zero across the bisector, so we may take $m > 1$. At $m = 1$
the formula gives $S = 2 \times 2/3 = \tfrac43$, and for large $m$ it grows as $m^2$. The numerator of the derivative
$S'(m)$ is $m$ times

$$2(m^8 - 1) + 4(m^7 - m) + 6(m^6 - m^2) + 3(m^5 - m^3),$$

and each bracket is positive for $m > 1$. So $S$ rises steadily from $\tfrac43$ to infinity and takes each value above
$\tfrac43$ exactly once. A zero off the bisector therefore exists only when $d^2/Z^2 > \tfrac43$, that is when
$Z < \tfrac{\sqrt3}{2}d$, and then a single $m > 1$ fixes $D_1 < D_2$. Two points of the circle $|w| = d/2$ lie at the
distance $D_1$ from $w = d/2$, one above the $x$ axis and one below it, and their mirror images across the bisector
have the two distances swapped. That makes four zeros.

At the depth $0.8d$, $d^2/Z^2 = 1.5625$ gives $m = 1.272$, $X_1 = 0.361$ and $X_2 = 1.201$, so $D_1 = 0.481d$ and
$D_2 = 0.877d$; their squares add to $d^2$, as they must.
:::

The windings change at the same depth. Round any closed loop on which the shear is not zero, its phase changes by a
whole number of turns, because the shear comes back to its starting value. That number cannot jump while the loop is
moved slowly, because the phase changes continuously, so it stays the same as long as the loop crosses no zero. A
large circle round the pair can therefore be shrunk, without crossing a zero, onto small circles round each zero,
joined by paths that are walked once in each direction and cancel. So the winding of the large circle is the sum of
the windings of the zeros. Far away the pair looks like one mass $2\matter M$, whose shear goes as $w^2$, so the large
circle winds twice. Near a simple zero the shear changes in proportion to the step from it, so a small circle becomes
an ellipse traced once, and each winding is $+1$ or $-1$; at the threshold depth the ellipse flattens to a line.

Reflecting the scene across either axis turns the shear into its complex conjugate, which mirrors both the loop and
the phase and so leaves each winding as it was. The two zeros on the bisector therefore have one winding $n$, and the
four new zeros, which are mirror images of one another, another winding $k$. Deeper than $0.866d$ only the first two
exist, so $2n = 2$ and $n = +1$, as found above. Shallower, $2n + 4k = 2$ with each of $n$ and $k$ equal to $\pm1$,
which leaves only $n = -1$ and $k = +1$. At the depth $0.866d$, then, each zero on the bisector reverses its winding
and sheds two zeros of winding $+1$, so its share of the two turns stays $-1 + 1 + 1 = 1$.
[Section 3.9](/tutorial/noise/positivity/#the-zeros-of-the-shear-survive-the-blur) finds the zeros above any thin
layer of matter, and how noise moves them.


## A steady oscillation is a turning complex number

A steady oscillation $q(t) = A\cos(\omega t - \alpha)$ has an amplitude $A$, an angular frequency $\omega$ in radians
per second, and a phase $\alpha$. Euler's formula holds all three in one turning number:

$$q(t) = \mathrm{Re}\bigl[\tilde q\,e^{-i\omega t}\bigr], \qquad \tilde q = A\,e^{i\alpha}, \label{eq:phasor}$$

because $\mathrm{Re}\,e^{-i(\omega t - \alpha)} = \cos(\omega t - \alpha)$. The fixed complex number $\tilde q$ is the
**phasor** of the oscillation: its modulus is the amplitude and its argument the phase $\alpha$. The point $\tilde q\,e^{-i\omega t}$ turns clockwise round the complex plane at the rate
$\omega$, and $q$ is its shadow on the real axis. This book writes every time dependence as $e^{-i\omega t}$, with the
minus sign ([section 2.6](/tutorial/outside/fourier/)). Books on circuits often use $e^{+i\omega t}$, which changes the sign of every imaginary
part; the two conventions must not be mixed.

Differentiating $\tilde q\,e^{-i\omega t}$ with respect to time multiplies it by $-i\omega$, so a differential
equation for a steady oscillation becomes algebra. Section 1.4 found the arm of a detector beside a swaying person
from $\dd^2\,\delta L/\dd t^2 = -\delta\curv{\tE}_{xx}\,L\cos\omega t$. With phasors the second derivative is
$(-i\omega)^2 = -\omega^2$, so $-\omega^2\,\delta\tilde L = -\delta\curv{\tE}_{xx}L$ and
$\delta\tilde L/L = \delta\curv{\tE}_{xx}/\omega^2$, the result of section 1.4 in one line.

A shear that oscillates is a complex number that moves. A rotor, a pair of masses spinning at the angular velocity
$\Omega$, looks the same after half a turn, so its wave repeats at $2\Omega$. Seen along its axis of spin, its two
polarizations have the same size and are a quarter period apart ([section 5.4](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor)
derives how they depend on the direction of view, and section 7.7 their size): $\curv{\tE}_+ = \curv{\tE}_0\cos2\Omega
t$ and $\curv{\tE}_\times = \curv{\tE}_0\sin2\Omega t$, with the amplitude $\curv{\tE}_0$ in $\mathrm{s^{-2}}$ and $t$
the time at the camera. The shear $2\curv{\tE}_0\,e^{2i\Omega t}$ keeps its size while its phase grows at $2\Omega$, so
its axes, at half the phase, turn at $\Omega$, with the rotor. Seen edge on, only the plus pattern is left, and the
shear swings along the real axis. The circular fraction of
[section 5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)
measures the motion in between.[^p-rotor]

## Complex vectors: a direction whose square is zero

The tide of a plane wave, together with a second, magnetic part, can be written as one table built from a single
vector with complex components. A **complex vector** has three complex
components. For a wave travelling along $\hat k$, let $\vect e_1$ and $\vect e_2$ be unit vectors across the travel,
with $\vect e_1\times\vect e_2 = \hat k$. We use

$$\sym{null-vector}{\vect m} = \frac{\vect e_1 + i\,\vect e_2}{\sqrt2} = \frac{1}{\sqrt2}\,(1, i, 0),$$

with the components written in the axes $\vect e_1$, $\vect e_2$, $\hat k$. Its dot product with itself, taken as for
real vectors with no conjugate, is $\vect m\cdot\vect m = \tfrac12(1 + i^2) = 0$. A nonzero complex vector whose dot product with itself is zero is a **null vector**, so this dot product is not a
length. The length comes from the **Hermitian product** $\vect a\cdot\vect b^* = a_lb_l^*$, because
$\vect a\cdot\vect a^* = |a_1|^2 + |a_2|^2 + |a_3|^2$ is positive for every nonzero $\vect a$. For $\vect m$ it is
$\tfrac12(1 + 1) = 1$.

The cross product with $\hat k$ (section 1.1) turns a real arrow across the travel by a quarter turn, and it only
multiplies $\vect m$ by $-i$: with $\hat k$ along the third axis, $\hat k\times\vect m = (-i, 1, 0)/\sqrt2 = -i\,\vect
m$. When $\vect e_1$ and $\vect e_2$ are turned by $\theta$ about $\hat k$, their new versions are
$\vect e'_1 = \cos\theta\,\vect e_1 + \sin\theta\,\vect e_2$ and $\vect e'_2 = -\sin\theta\,\vect e_1 +
\cos\theta\,\vect e_2$, and we collect the terms of each:

$$\begin{aligned}
\vect e'_1 + i\,\vect e'_2 &= (\cos\theta - i\sin\theta)\,\vect e_1 + i\,(\cos\theta - i\sin\theta)\,\vect e_2\\
&= e^{-i\theta}(\vect e_1 + i\,\vect e_2).
\end{aligned}$$

So $\vect m$ has spin one. The table $\vect m\vect m^{\mathsf T}$, with the entries $m_im_j$, is called
the square of $\vect m$, and it has spin two:

$$\vect m\vect m^{\mathsf T} = \frac12\begin{pmatrix} 1 & i & 0\\ i & -1 & 0\\ 0 & 0 & 0\end{pmatrix}.$$

It is symmetric and its trace is $\tfrac12(1 - 1) = 0$, the shape of a wave's tide. The table $\sym{weyl-complex}{\curv{\mathcal W}}$ (a curly W) holds the tide and the magnetic part
of the field as one symmetric trace-free table of complex numbers, in $\mathrm{s^{-2}}$. For a plane wave it is

$$\curv{\mathcal W} = 2\bigl(\curv{\tE}_+ - i\curv{\tE}_\times\bigr)\,\vect m\vect m^{\mathsf T}, \label{eq:plane-wave-W}$$

so that the $\curv{\mathcal W}$ of a plane wave is a single table of rank one.[^p-W]

Multiplying out the first two rows and columns,
$2(\curv{\tE}_+ - i\curv{\tE}_\times)\cdot\tfrac12\bigl(\begin{smallmatrix}1 & i\\ i & -1\end{smallmatrix}\bigr)$,
gives the real and imaginary parts:

$$\mathrm{Re}\,\curv{\mathcal W} = \begin{pmatrix}\curv{\tE}_+ & \curv{\tE}_\times\\ \curv{\tE}_\times & -\curv{\tE}_+\end{pmatrix}, \qquad \mathrm{Im}\,\curv{\mathcal W} = \begin{pmatrix}-\curv{\tE}_\times & \curv{\tE}_+\\ \curv{\tE}_+ & \curv{\tE}_\times\end{pmatrix}.$$

The minus sign in front of $\curv{\tE}_\times$ cancels the $i$ inside $\vect m\vect m^{\mathsf T}$, so the real part is
the wave's table of plus and cross, with shear $\curv{s} = 2(\curv{\tE}_+ + i\curv{\tE}_\times)$. The shear of the
imaginary part is $-2\curv{\tE}_\times + 2i\curv{\tE}_+ = i\curv{s}$, so it is the same pattern turned by 45°: with
$\curv{\tE}_+ = 0.6$ and $\curv{\tE}_\times = 0.25$, in any unit of tide, the two shears are $1.2 + 0.5i$ and
$-0.5 + 1.2i = i(1.2 + 0.5i)$.

We state here, without proof, that this imaginary part is the wave's magnetic tide $\curv{\tB}$, which twists gyroscopes
rather than moving free balls, so that $\curv{\mathcal W} = \curv{\tE} + i\curv{\tB}$ and, in a wave, $\curv{\tB}$ is $\curv{\tE}$ turned by
45°.[^magnetic] The field of light in a plane wave is a complex multiple of $\vect m$ itself ([section 6.6](/tutorial/relativity/maxwell-complex/#in-a-light-wave-the-complex-field-is-a-multiple-of-one-null-vector)).
Light's field is the vector and gravity's is its square, which is the difference between spin one and spin two
(section 9.1).

**The idea to keep: a complex number is an arrow that can be multiplied, and a turn is multiplication by
$e^{i\theta}$. When the axes turn, an arrow is multiplied by $e^{-i\theta}$ and a pattern of stretch and squeeze by
$e^{-2i\theta}$, which is why gravity's two polarizations are 45° apart and why a tide looks the same after half a
turn.**

::: problems
### Practice

**[1.5b]** Compute $(1 + i)^2$, and say what squaring did to the length and the angle.

::: solution
Multiplying out gives $(1 + i)^2 = 1 + 2i + i^2 = 2i$. The length $\sqrt2$ became its square, 2, and the angle
$45°$ doubled to $90°$.
:::

**[1.5b]** The axes turn by 30°. By what factor is the shear multiplied, and by what factor an arrow?

::: solution
The shear by $e^{-2i\theta} = e^{-i\pi/3} = 0.5 - 0.866i$, and an arrow by $e^{-i\pi/6} = 0.866 - 0.5i$.
:::

**[1.5b]** A tide in a plane has the shear $\curv{s} = 2i$ in units of $G\matter M/r^3$. Along which direction is it a stretch?

::: solution
The squeeze axis is at $\tfrac12\arg\curv{s} = 45°$, so the stretch axis is at $135°$, the line at $-45°$.
:::

**[1.5b]** Show that $\vect m\cdot\vect m = 0$ for $\vect m = (1, i, 0)/\sqrt2$, and find its length.

::: solution
$\vect m\cdot\vect m = \tfrac12(1 + i^2) = 0$, and the Hermitian product gives $\vect m\cdot\vect m^* = 1$.
:::

**[1.5b]** Find every complex number $u$ with $u^2 = i$, and say why there are two.

::: solution
Write $u = re^{i\theta}$. Then $r = 1$ and $2\theta = 90°$ or $90° + 360°$, so $u = \pm e^{i\pi/4} = \pm(1 + i)/\sqrt2$.
There are two because the argument of $i$ is fixed only up to whole turns, and halving a whole turn gives a half turn.
:::

### Stretch

**[1.5b]** A point mass $\matter M$ lies at the depth $Z$ below a horizontal camera's plane. At what horizontal distance from the
point directly above it is the size of the shear in that plane largest, and how does that largest value compare with
the vertical stretch $2G\matter M/Z^3$ directly above the mass ([section 1.4](/tutorial/newton/tides/))?

::: solution
By equation [](#eq:point-shear), $|\curv{s}| = 3G\matter M|w|^2/(|w|^2 + Z^2)^{5/2}$. Its derivative with respect to
$|w|$ vanishes when $2(|w|^2 + Z^2) = 5|w|^2$, so $|w|^2 = \tfrac23Z^2$, $|w| = 0.816Z$, and

$$|\curv{s}| = \frac{3G\matter M\cdot\tfrac23Z^2}{(\tfrac53)^{5/2}Z^5} = 2\Bigl(\frac35\Bigr)^{5/2}\frac{G\matter M}{Z^3} = 0.558\,\frac{G\matter M}{Z^3},$$

0.28 of the vertical stretch directly above. The shear is zero above the mass and peaks on a ring of radius $0.816Z$.
:::

**[1.5b]** Two equal masses 2 m apart lie 1.5 m below a camera's plane. How many zeros does the shear in that plane
have, on what curve do they all lie, and what is the winding of each?

::: solution
The threshold depth is $\tfrac{\sqrt3}{2} \times 2\unit{m} = 1.73\unit{m}$, and the masses are shallower, so the shear
has six zeros. All lie on the circle of radius 1 m centred directly above the midpoint of the pair, because at a zero
the horizontal steps from the two points above the masses meet at a right angle. The two on the bisector, 2 m apart,
have winding $-1$, and the four others winding $+1$; together they make the large circle's 2.
:::

**[1.5b]** At what depth $Z$ would the four extra zeros stand on the circle at $45°$ from the $x$ axis, so that the
horizontal step from one point above a mass is $D_1 = d\sin22.5°$?

::: solution
On the circle $|w| = d/2$ the right angle at the pixel gives $D_1 = d\sin22.5° = 0.383d$ and
$D_2 = d\cos22.5° = 0.924d$, so $D_1^2 = 0.146d^2$ and $D_2^2 = 0.854d^2$. With $x = d^2/Z^2$, the condition
$F(D_1) = F(D_2)$ reads $0.146/(1 + 0.146x)^{5/2} = 0.854/(1 + 0.854x)^{5/2}$, so
$(1 + 0.854x)/(1 + 0.146x) = (0.854/0.146)^{2/5} = 2.024$. Solving, $x = 1.024/0.557 = 1.84$, and $Z = 0.74d$. This
is shallower than $0.8d$, where the zero stands $57°$ from the axis, as it must be, because the zeros slide toward the
axis as the masses rise.
:::

### The camera

**[1.5b]** Suppose that, above a thin layer of matter seen from a height $Z$ much greater than its width $R$, the two zeros of the shear stand at $w = w_{\mathrm{cm}} \pm i\sqrt{Q_c/\matter M}$, with
$Q_c = \int\matter\sigma\,(w' - w_{\mathrm{cm}})^2\,\dd^2w'$. Here $\matter\sigma$ is the mass per unit area of the
layer, $\matter M$ its whole mass and $w_{\mathrm{cm}}$ its centre of mass, and the rule carries an error of order
$(R/Z)^2$. Apply it to two equal masses $\matter m$ at $w' = \pm d/2$, and compare with the zeros on the bisector found
in this section.

::: solution
Here $w_{\mathrm{cm}} = 0$ and the whole mass is $2\matter m$. The integral becomes a sum,
$Q_c = \matter m(d/2)^2 + \matter m(-d/2)^2 = \matter md^2/2$, so $Q_c/\matter M = d^2/4$ and the zeros stand at
$w = \pm i\,d/2$, on the bisector at $y = \pm d/2$, as in this section. For two equal masses the rule is exact, with
no error of order $(R/Z)^2$.
:::
:::

::: paper
- Figure [](/paper/#fig:tidal) draws the two polarizations; [Section II](/paper/#sec:pixel) says that in a wave
  $\curv{\tB}$ is $\curv{\tE}$ turned by 45°, and [Section III](/paper/#sec:regimes) that gravity has spin two.
- [Section IV](/paper/#sec:near-field) defines the shear and finds the zeros, equation [](/paper/#eq:shear-zeros) and
  Figure [](/paper/#fig:buried-ruler); [Section V](/paper/#sec:waves) gives the rotor, equations
  [](/paper/#eq:rotor-amplitudes) and [](/paper/#eq:circular).
- [Section VIII](/paper/#sec:one-pixel) defines $\curv{\mathcal W}$, equation [](/paper/#eq:W), and a plane wave as
  equation [](/paper/#eq:square).
:::

::: deeper
- The [GR course, section 18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten)
  explains why a gravitational wave has two polarizations, and its
  [wave scene](https://neovand.github.io/general-relativity/chapter-18.html#scene-wave) animates them.
- Tristan Needham, *Visual Complex Analysis* (Oxford, 1997), chapter 1, draws multiplication as a turn and a stretch.
:::

::: history
### Square roots of negative numbers, and the plane

Gerolamo Cardano met square roots of negative numbers in *Ars Magna* (1545), in a problem about splitting 10 into two
parts whose product is 40, and treated them as useless. Rafael Bombelli showed in 1572 how to calculate with them.
Leonhard Euler published $e^{i\theta} = \cos\theta + i\sin\theta$ in 1748. The picture of complex numbers as points
of a plane came from Caspar Wessel (1799) and Jean-Robert Argand (1806), and became standard after Gauss adopted it in
1831 (Paul Nahin, *An Imaginary Tale*, Princeton, 1998).
:::

[^u]: Most books write $z$ for a complex number; here $z$ is the third axis.

[^bar]: Many books write the conjugate as $\bar u$; this book writes $u^*$.

[^spin]: In quantum mechanics spin is an angular momentum; sections 8.4 and 9.1 show that it is the same number.

[^s-ratio]: Section 3.7 uses $s$ for a different quantity, the ratio of one ripple of a picture to its noise.

[^plus]: The tides $\curv{\tE}_+$ and $\curv{\tE}_\times$ are not the strains $h_+$ and $h_\times$, which are pure
    numbers, but are proportional to them in a steady wave
    ([section 7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)).

[^magnetic]: [Section 7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index)
    defines $\curv{\tB}$, and
    [section 7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45) shows
    that in a wave $\curv{\tB}_{ij} = \epsilon_{ipq}\hat k_p\curv{\tE}_{qj}$, which with $\hat k\times\vect m =
    -i\vect m$ gives equation [](#eq:plane-wave-W). Section 9.3 studies $\curv{\mathcal W}$.

[^p-spin]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. III](/paper/#sec:regimes).

[^p-shear]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. IV](/paper/#sec:near-field).

[^p-zeros]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:shear-zeros) and Fig. [](/paper/#fig:buried-ruler).

[^p-rotor]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. V](/paper/#sec:waves).

[^p-W]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. VIII](/paper/#sec:one-pixel), as its
    equations [](/paper/#eq:W) and [](/paper/#eq:square).
