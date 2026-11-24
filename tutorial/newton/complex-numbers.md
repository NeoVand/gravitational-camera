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

Panels (b) and (c) of the figure below, from the paper, show a ring of free balls in a gravitational wave that travels
toward the reader. In (b) the ring is stretched along one axis and squeezed along the other, and in (c) the same
pattern has its axes on the diagonals. These are the wave's two **polarizations**, its two independent patterns of
stretch and squeeze, and the caption says that they "differ by a turn of 45°". The polarization of light is the
direction of its electric field across the beam, and light's two polarizations are two such directions, 90° apart.
Why do the two polarizations of a gravitational wave differ by a turn of 45°, when those of light differ by 90°?

{{paper fig:tidal}}

The paper's [Section III](/paper/#sec:regimes) gives the reason in one sentence: an arrow turned by half a circle
points the other way, but a pattern of stretch and squeeze turned by half a circle looks exactly as it did before.
This chapter turns that sentence into arithmetic with complex numbers, the tool the paper also uses to find buried
masses ([Section IV](/paper/#sec:near-field)), to tell which way a distant rotor turns
([Section V](/paper/#sec:waves)), and to write the ten numbers of a pixel as one complex table
([Section VIII](/paper/#sec:one-pixel)).

::: plain
A complex number is a point of a flat plane, written with two ordinary numbers, that can also be multiplied by another
such point. When two of them are multiplied, their distances from the centre multiply and their angles add. So
multiplying by a number at distance one from the centre is the same as turning the plane by that number's angle.

An arrow that lies in a plane can be written as one complex number. A pattern of stretch and squeeze in a plane can
also be written as one complex number, which the paper calls the shear. When we turn our axes by some angle, the
arrow's number turns back by that angle, but the shear turns back by twice the angle. Physicists say that light has
spin one and gravity has spin two, and this is what they mean. Two polarizations must not overlap at all, and for
complex numbers that means pointing 90° apart. An arrow gets there by turning 90°, but a shear gets there when its
pattern turns by only 45°.
:::

## A complex number is a point of the plane that can be multiplied

Draw a flat plane with two axes at right angles. A point of the plane is a pair of ordinary numbers $(x, y)$, and two
points add as arrows do, component by component. What the plane lacks is a way to multiply two points so that the
answer is a third point of the same plane. The dot product of two arrows is a single number, and their cross product
points out of the plane. The complex numbers supply this missing rule.

We write the point $(x, y)$ as

$$u = x + iy ,$$

and we multiply such expressions by the ordinary rules of algebra, with one extra rule: $\sym{imaginary-unit}{i}$ is a
number with $i^2 = -1$.[^u] No ordinary number has a negative square, so $i$ is a new kind of number. The next section
shows its meaning in the plane: multiplying by $i$ is a quarter turn, and two quarter turns take 1 to $-1$.

An expression $u = x + iy$ is a **complex number**. The ordinary number $x$ is its **real part**, written
$\mathrm{Re}\,u$, and $y$ is its **imaginary part**, $\mathrm{Im}\,u$. In the **complex plane** the number 1 is one
step along the first axis and $i$ one step along the second. The number $i$ has no unit, so $u$ has the unit of $x$
and $y$. To multiply, we multiply out the four terms and replace $i^2$ by $-1$:

$$\begin{aligned}
(x_1 + iy_1)(x_2 + iy_2) &= x_1x_2 + ix_1y_2 + iy_1x_2 + i^2y_1y_2\\
&= (x_1x_2 - y_1y_2) + i\,(x_1y_2 + y_1x_2).
\end{aligned}$$

A point of the plane has a distance from the centre and an angle. The distance is the **modulus**
$|u| = \sqrt{x^2 + y^2}$. The angle, measured anticlockwise from the positive real axis, is the **argument** $\arg u$.
It is fixed only up to whole turns, because adding 360° to an angle gives the same direction: an argument of $-90°$
and one of $270°$ name the same point. For $u = 3 + 4i$ the modulus is $\sqrt{9 + 16} = 5$, and the argument is the
angle whose tangent is $4/3$, which is $53.1°$.

Each complex number has a mirror image in the real axis, its **complex conjugate** $u^* = x - iy$.[^bar] A number
times its conjugate is the square of its modulus, because the cross terms cancel:

$$u\,u^* = (x + iy)(x - iy) = x^2 + y^2 = |u|^2 .$$

This also gives division, $1/u = u^*/|u|^2$; for example $1/(3 + 4i) = (3 - 4i)/25 = 0.12 - 0.16i$. A position on a
map, by contrast, is a pair of numbers with no product: two steps on the map add, but the product of two positions
means nothing.

## Multiplying multiplies lengths and adds angles

We want to see what the product does to the modulus and the argument. A number with modulus $r$ and argument $\theta$
has the components $x = r\cos\theta$ and $y = r\sin\theta$, so $u = r\,(\cos\theta + i\sin\theta)$. We multiply two
such numbers with the rule of the last section:

$$\begin{aligned}
u_1u_2 = r_1r_2\bigl[&(\cos\theta_1\cos\theta_2 - \sin\theta_1\sin\theta_2)\\
&+ i\,(\sin\theta_1\cos\theta_2 + \cos\theta_1\sin\theta_2)\bigr].
\end{aligned}$$

The two brackets are the addition formulas of trigonometry for $\cos(\theta_1 + \theta_2)$ and
$\sin(\theta_1 + \theta_2)$, which we use without proof. So
$u_1u_2 = r_1r_2\bigl[\cos(\theta_1 + \theta_2) + i\sin(\theta_1 + \theta_2)\bigr]$, and

$$\boxed{\;|u_1u_2| = |u_1|\,|u_2|, \qquad \arg(u_1u_2) = \arg u_1 + \arg u_2 .\;} \label{eq:product}$$

![Two complex numbers drawn as arrows from 0 at their true values: $u_1$, with modulus 2 and argument 20°, and $u_2$,
with modulus 1.5 and argument 50°. Their product $u_1u_2$ has the modulus $2 \times 1.5 = 3$ and the argument
$20° + 50° = 70°$.](tut-cx-product){#fig:product}

Figure [](#fig:product) draws one product in the complex plane, and the square of $3 + 4i$ checks the rule in
numbers. Multiplying out gives $9 - 16 + 24i = -7 + 24i$, whose modulus is 25, the square
of 5, and whose argument is $106.3°$, twice $53.1°$.

So multiplication by a number of modulus 1 is a turn. If $|u_1| = 1$, then $u_1u_2$ has the same distance from the
centre as $u_2$, and its angle is larger by $\arg u_1$. Two turns in a row are two such multiplications: these are
rotations that can be multiplied. The number $i$ has modulus 1 and argument $90°$, so multiplying by $i$ is a quarter
turn. Two quarter turns make a half turn, which takes 1 to $-1$, and this is what $i \cdot i = -1$ means in the plane.

## Euler's formula: a turn is an exponential

We want a compact formula for the number of modulus 1 and argument $\theta$,
$f(\theta) = \cos\theta + i\sin\theta$. The last section showed that $f(\theta_1)\,f(\theta_2) = f(\theta_1 +
\theta_2)$. Exponentials obey the same rule, $e^ae^b = e^{a+b}$, which suggests that $f$ is an exponential. We
differentiate $f$ with respect to $\theta$, treating $i$ as a constant, and take out a factor $i$, using $i^2 = -1$:

$$f'(\theta) = -\sin\theta + i\cos\theta = i\,(\cos\theta + i\sin\theta) = i\,f(\theta).$$

Also $f(0) = 1$. For an ordinary constant $a$, the function $e^{a\theta}$ is the one function whose derivative is $a$
times itself and whose value at $\theta = 0$ is 1. We take the same two properties, with $a = i$, as the meaning of
$e^{i\theta}$. The box below shows that only one function has them, and that the power series of the exponential gives
the same function. So $f(\theta)$ is $e^{i\theta}$, which is **Euler's formula**:

$$\boxed{\;e^{i\theta} = \cos\theta + i\sin\theta .\;} \label{eq:euler}$$

The equation $f' = if$ also has a picture (Figure [](#fig:unit-circle)). The point $f(\theta)$ lies on the circle of radius 1. Its velocity, as
$\theta$ grows, is $i$ times its position: the position turned by a quarter turn, with length 1. So the point moves
round the circle at unit speed, and after an arc of length $\theta$ it stands at the angle $\theta$.

![The point $e^{i\theta}$ on the circle of radius 1, at $\theta = 40°$, and its derivative $ie^{i\theta}$ (orange),
drawn from its tip. The derivative has length 1 and stands at right angles to the position, so it is tangent to the
circle, and the heavy arc from 1 to $e^{i\theta}$ has the length $\theta$.](tut-cx-euler){#fig:unit-circle}

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
2\sin\theta\cos\theta$, which we use for the tide below.

For a small angle, $\cos\theta \approx 1$ and $\sin\theta \approx \theta$, so $e^{i\theta} \approx 1 + i\theta$.
Multiplying $u$ by $1 + i\theta$ adds $i\theta u$, which is $u$ turned by a quarter turn and shortened by the factor
$\theta$: the small turn $\delta\vect a = \vect\theta\times\vect a$ of chapter 1.1, in the plane. For
$\theta = 0.1$ the exact value is $0.9950 + 0.0998i$, which differs from $1 + 0.1i$ by 0.0050, about $\theta^2/2$.

## An arrow is one complex number, and turning the axes turns it back by the same angle

An arrow $\vect v$ that lies in the plane of the axes $x$ and $y$ becomes the complex number $v = v_x + iv_y$. The
third axis $z$ points out of the page, toward us. We turn the axes by the angle $\theta$ about $z$, anticlockwise as we
see them, which is a turn by the right-hand rule about $z$, as in chapter 1.1. The new axes are
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

The sign is easy to get wrong, and we keep it fixed from here on. The arrow does not move, but the axes turn
anticlockwise by $\theta$, so the arrow's angle measured from the new axes is smaller by $\theta$. Turning the axes by
$\theta$ is the same as turning the arrow by $-\theta$ with the axes held still.

Chapter 1.1 checked this on a step of 1 cm to the east, seen from axes turned by 45° to point north-east and
north-west: $v = 1$ gives $v' = e^{-i\pi/4} = 0.707 - 0.707i$, the components $(0.707, -0.707)$ found there. A half
turn of the axes gives $e^{-i\pi} = -1$, so the arrow points the other way, and only a whole turn brings it back.

A quantity that is multiplied by $e^{-in\theta}$ when the axes turn by $\theta$ about an axis that points toward us,
anticlockwise as we see them, has **spin** $n$. An arrow has spin one. A number that does not change at all, such as a
mass, has spin zero.[^spin]

## A tide across a direction is one complex number, and turning the axes turns it back by twice the angle

Now we look at a ring of free balls in the $x$, $y$ plane, with $z$ pointing toward us. By chapter 1.4 each ball, at a
small separation $\vect\xi$ from the centre, has the acceleration
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
the trace-free table $\bigl(\begin{smallmatrix}a & b\\ b & -a\end{smallmatrix}\bigr)$ of chapter 1.5, with
$a = \tfrac12(\curv{\tE}_{xx} - \curv{\tE}_{yy})$ and $b = \curv{\tE}_{xy}$, and these are the coefficients of the two
terms that depend on the direction. We put $a$ and $b$ into one complex number and, as the paper does, double it, so
that its size is the gap between the two eigenvalues. The **shear** of the tide in the plane is

$$\boxed{\;\sym{shear}{\curv{s}} = (\curv{\tE}_{xx} - \curv{\tE}_{yy}) + 2i\,\curv{\tE}_{xy} = 2(a + ib) ,\;} \label{eq:shear}$$

measured in $\mathrm{s^{-2}}$, like the tide.[^s-ratio] This is the paper's shear, in its paragraph on the zeros of
the shear in [Section IV](/paper/#sec:near-field). Multiplying out shows that the real part of
$\curv{s}\,e^{-2i\varphi}$ is $(\curv{\tE}_{xx} - \curv{\tE}_{yy})\cos2\varphi + 2\curv{\tE}_{xy}\sin2\varphi$. We
write $\curv{s} = |\curv{s}|\,e^{i\arg\curv{s}}$, so that this real part is $|\curv{s}|\cos(2\varphi - \arg\curv{s})$,
and the pattern around the ring is

$$\hat\xi_i\curv{\tE}_{ij}\hat\xi_j = \tfrac12(\curv{\tE}_{xx} + \curv{\tE}_{yy}) + \tfrac12|\curv{s}|\cos(2\varphi - \arg\curv{s}). \label{eq:ring}$$

The first term shrinks or swells the whole ring. The second changes its shape, and it depends on the angle through
$2\varphi$, so two opposite balls always move alike. The squeeze is strongest where the cosine is 1, at the angle
$\varphi = \tfrac12\arg\curv{s}$ and opposite it, and the stretch is strongest at right angles to that. These are the
principal axes of the table, and the values there, the mean plus or minus $\tfrac12|\curv{s}|$, are its eigenvalues:
the eigenvalue formula for a symmetric $2\times2$ table gives the mean plus or minus $\sqrt{a^2 + b^2}$, which is
$\tfrac12|\curv{s}|$. So

$$\boxed{\;\begin{aligned}
&\text{squeeze axis at } \tfrac12\arg\curv{s},\\
&\text{stretch axis at } \tfrac12\arg\curv{s} + 90°,\\
&\text{eigenvalues } \tfrac12(\curv{\tE}_{xx} + \curv{\tE}_{yy}) \pm \tfrac12|\curv{s}| .
\end{aligned}\;}$$

The person of chapter 1.4, 70 kg at 1 m along the $x$ axis, checks the sign. In a plane that contains the line to
the person, the table is $\mathrm{diag}(-2, 1)$ in units of $G\matter M/r^3$, so $\curv{s} = (-2 - 1)\,G\matter
M/r^3 = -3G\matter M/r^3$. Its size is $|\curv{s}| = 3 \times 6.674 \times 10^{-11} \times 70\unit{s^{-2}} = 1.40
\times 10^{-8}\unit{s^{-2}}$, three times the squeeze of $4.7 \times 10^{-9}\unit{s^{-2}}$. Its argument is $180°$,
so the squeeze axis is at $90°$, along $y$, and the stretch lies along $x$, toward the person, as it must. The mean is
$-\tfrac12$, and $-\tfrac12 \pm \tfrac32$ gives the eigenvalues $+1$ and $-2$ of chapter 1.4.

### Turning the axes turns the shear twice as fast

We want the shear in axes turned anticlockwise by $\theta$ about $z$. Such a turn leaves the trace in the plane
alone, and chapter 1.5 found how it turns the trace-free part:

$$a' = a\cos2\theta + b\sin2\theta, \qquad b' = -a\sin2\theta + b\cos2\theta .$$

Multiplying out shows that these are the real and imaginary parts of $(a + ib)(\cos2\theta - i\sin2\theta)$, and
$\cos2\theta - i\sin2\theta = e^{-2i\theta}$ by Euler's formula. So chapter 1.5's turning rule for $(a, b)$ is
multiplication by $e^{-2i\theta}$, and since $\curv{s} = 2(a + ib)$,

$$\boxed{\;\curv{s}' = e^{-2i\theta}\,\curv{s} .\;} \label{eq:shear-turn}$$

Chapter 1.1 turned the axes by 45° to face a person standing to the north-east. Before the turn, the first two rows
and columns of the table were $\curv{\tE}_{xx} = \curv{\tE}_{yy} = -\tfrac12$ and $\curv{\tE}_{xy} = -\tfrac32$, in
units of $G\matter M/r^3$, so $\curv{s} = -3i$. Equation [](#eq:shear-turn) gives $\curv{s}' = e^{-i\pi/2}(-3i) =
(-i)(-3i) = -3$, which is the shear of $\mathrm{diag}(-2, 1)$, the table that chapter 1.1 found after the turn.

The factor $e^{-2i\theta}$ makes the shear a quantity of **spin two**, and the special turns follow from it. A half turn
gives $e^{-2\pi i} = 1$, so the pattern looks exactly as it did before. A quarter turn gives $e^{-i\pi} = -1$, so the
stretch and the squeeze change places. A turn of 45° gives $e^{-i\pi/2} = -i$.

### Why the two polarizations are 45° apart

In a gravitational wave that travels along $z$, toward us, the tide acts only across the direction of travel, and there
it has no trace (chapter 1.5; chapter
[7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain) derives
it). The table in the plane is then

$$\begin{pmatrix}\curv{\tE}_+ & \curv{\tE}_\times\\ \curv{\tE}_\times & -\curv{\tE}_+\end{pmatrix}, \qquad \curv{s} = 2(\curv{\tE}_+ + i\curv{\tE}_\times),$$

where $\sym{wave-polarizations}{\curv{\tE}_+}$ and $\curv{\tE}_\times$ are the tides of the wave's two
polarizations, in $\mathrm{s^{-2}}$.[^plus] Two polarizations must share nothing, so that a wave can carry any amount
of one with none of the other. Two tables share nothing when they are **orthogonal**, which means that their
contraction $T_{ij}U_{ij}$ of chapter 1.5 is zero. For two trace-free tables in the plane, with shears
$\curv{s}_1 = 2(a_1 + ib_1)$ and $\curv{s}_2 = 2(a_2 + ib_2)$, multiplying out shows that the contraction
$2(a_1a_2 + b_1b_2)$ equals $\tfrac12\mathrm{Re}(\curv{s}_1\curv{s}_2^*)$. It is zero when the two shears point 90°
apart in the complex plane. The plus pattern has a real shear and the cross pattern an imaginary one, so they are
orthogonal.

This answers the chapter's question. Turning a pattern by an angle $\beta$, with the axes held still, is the same as
turning the axes by $-\beta$, so it multiplies the shear by $e^{2i\beta}$. The turned pattern is orthogonal to the
first when $2\beta = 90°$, so $\beta = 45°$. The electric field of light across its beam is an arrow $v$. Two arrows
have the dot product $\mathrm{Re}(v_1v_2^*)$, which is zero when they point 90° apart, and turning an arrow by $\beta$
multiplies $v$ by $e^{i\beta}$, so light needs $\beta = 90°$. Light's two polarizations are arrows 90° apart, and
gravity's are patterns of spin two, 45° apart. Figure [](#fig:spin-two) shows both rules for a turn of 45°.

![Left, a ring of free balls under the shear $\curv{s} = 2$, squeezed along $x$ (blue) and stretched along $y$
(orange), its movement exaggerated. Middle, the same ring with the axes turned anticlockwise by $\theta = 45°$ (the old
axes grey). Right, the complex plane: the turn multiplies the shear by $e^{-2i\theta} = -i$, which carries it from 2
to $\curv{s}' = -2i$, while the number $v = 1$ of an arrow along $x$ is multiplied by $e^{-i\theta}$ and turns back
by only 45°.](tut-cx-spin){#fig:spin-two}

::: try {#spin-two-dial}
Panel (a) shows a ring of twelve free balls under the shear $\curv{s} = 2$, squeezed along $x$ and stretched along
$y$, with an arrow $v$ drawn at 30°. Panel (b) shows both numbers in the complex plane, as seen from the turned axes.
Drag the axes, or use the slider or the arrow keys, to turn them by $\theta$.

Before you turn anything, predict: if you turn the axes by 180°, does the ring's pattern look the same from the new
axes, and does the arrow? Then turn them and check. The point $\curv{s}'$ comes back to 2, but $v'$ stands opposite
$v$. Next stop at 45°: the arrow's number has turned back by 45°, and the shear's by 90°, to $-2i$, a cross pattern.
Last, turn on the rotor's wave, which a section below describes, and move the inclination from face on, where the shear goes round
a circle, to edge on, where it swings along a line. (The figure writes the time at the camera as $u$, as the paper
does, where this chapter writes $t$.)
:::

## The shear of one mass is a square

Put a point mass $\sym{mass}{\matter{M}}$ at the depth $Z$ below the origin of a horizontal plane, with $z$ pointing
up. A pixel on the plane stands at the place $(x, y)$, which the paper writes as one complex number,
$\sym{complex-place}{w} = x + iy$, in metres. Its distance from the mass is $r = \sqrt{x^2 + y^2 + Z^2}$. We want the
shear in the horizontal plane at the pixel. The tide of a point mass, from chapter 1.4, is $\curv{\tE}_{ij} =
(G\matter M/r^3)(\delta_{ij} - 3\hat n_i\hat n_j)$, with the unit vector from the pixel toward the mass
$\hat n = (-x, -y, -Z)/r$. In the difference of the two diagonal entries the deltas cancel, and the entry off the
diagonal has no delta:

$$\curv{\tE}_{xx} - \curv{\tE}_{yy} = -\frac{3G\matter M}{r^5}\,(x^2 - y^2), \qquad \curv{\tE}_{xy} = -\frac{3G\matter M}{r^5}\,xy .$$

We put these into equation [](#eq:shear) and recognize $w^2 = (x + iy)^2 = x^2 - y^2 + 2ixy$:

$$\boxed{\;\curv{s} = -\frac{3G\matter M\,w^2}{r^5} .\;} \label{eq:point-shear}$$

The units are $\mathrm{m^3\,s^{-2}}$ times $\mathrm{m^2}$ over $\mathrm{m^5}$, which is $\mathrm{s^{-2}}$. By equation
[](#eq:product), $\arg\curv{s} = 2\arg w + 180°$, so the squeeze axis lies at $\arg w + 90°$ and the stretch axis at
$\arg w$, along the horizontal line through the pixel and the point above the mass. Directly above the mass $w = 0$
and the shear vanishes, because no horizontal direction is singled out. For a mass in the plane itself, $Z = 0$ and
$|w| = r$, so $|\curv{s}| = 3G\matter M/r^3$, the person's value. Turning the axes multiplies $w$ by $e^{-i\theta}$ and
its square by $e^{-2i\theta}$, as equation [](#eq:shear-turn) requires.

## Where the shear vanishes, its axes make half a turn round the zero

This section is a sketch, at depth B. Put two equal masses $\matter M$ at the places $w = \pm d/2$ on the $x$ axis,
both at the depth $Z$ below the camera's plane. Seen from the pixel at $w$, the horizontal step to each mass is
$\pm d/2 - w$, and its square is $(w \mp d/2)^2$, so by equation [](#eq:point-shear)

$$\curv{s}(w) = -3G\matter M\left[\frac{(w - \tfrac d2)^2}{r_1^5} + \frac{(w + \tfrac d2)^2}{r_2^5}\right],$$

where $r_1$ and $r_2$ are the distances to the two masses. On the perpendicular bisector, $w = iy$, the two distances
are equal, $r^2 = d^2/4 + y^2 + Z^2$, and the two squares add to $(iy - d/2)^2 + (iy + d/2)^2 = 2(d^2/4 - y^2)$. So

$$\curv{s}(iy) = \frac{6G\matter M}{r^5}\Bigl(y^2 - \frac{d^2}{4}\Bigr),$$

which is zero at $y = \pm d/2$ whatever the depth. A **zero** of a field is a point where it vanishes. These two
zeros are exactly $d$ apart, so they measure the distance between two buried masses with no reconstruction. Solving
$\curv{s}(w) = 0$ numerically over the whole plane gives only these two at the depths $d$ and $0.9d$, and four more,
at $(\pm0.269d, \pm0.422d)$, at the depth $0.8d$.[^roots] The extra zeros appear below the paper's depth of
$\tfrac{\sqrt3}{2}d = 0.866d$.

The argument of a complex number is also called its **phase**. Walk once anticlockwise round a small circle about one
of the zeros on the bisector. Near the zero the shear changes in proportion to the step from the zero, so it traces
a small loop round the origin of the complex plane. At the depths $d$ and $0.9d$ the computation shows that this loop
goes once round, anticlockwise, so the phase grows by a whole turn and the squeeze axis, at half the phase, turns by
half a turn. This is the **phase winding** of the zero. An axis has no head, so a half turn brings it back onto
itself, and the pattern of axes is smooth everywhere except at the zero. A field of arrows could not do this, because
an arrow carried round a point must come back to itself after whole turns. The lower panels of the paper's figure
colour each place by the phase of the shear, and all the colours meet at each zero.

{{paper fig:buried-ruler}}

::: gap
This sketch does not show why the phase must change by a whole number of turns round any small circle, or why that
number can be $-1$ as well as $+1$. Round a large circle it is 2, because far away the pair looks like one mass and
the shear goes as $w^2$. Nor does it show why the four extra zeros appear at exactly $\tfrac{\sqrt3}{2}d$: there each
zero on the bisector reverses its winding and sheds two new zeros, which keeps the total at 2. The paper's rule for
any thin layer, equation [](/paper/#eq:shear-zeros), is left to chapter 3.9.
:::

## A steady oscillation is a turning complex number

A quantity that oscillates steadily, $q(t) = A\cos(\omega t - \alpha)$, has an amplitude $A$, an angular frequency
$\omega$ in radians per second, and a phase $\alpha$. Euler's formula holds all three in one turning number. The real
part of $e^{-i\omega t}$ is $\cos\omega t$, and

$$q(t) = \mathrm{Re}\bigl[\tilde q\,e^{-i\omega t}\bigr], \qquad \tilde q = A\,e^{i\alpha}, \label{eq:phasor}$$

because $\mathrm{Re}\,e^{-i(\omega t - \alpha)} = \cos(\omega t - \alpha)$. The fixed complex number $\tilde q$ is the
**phasor** of the oscillation: its modulus is the amplitude, and its argument is the phase $\alpha$, in the same sense
of the word as for the shear. The point $\tilde q\,e^{-i\omega t}$ turns clockwise round the complex plane at the rate
$\omega$, and $q$ is its shadow on the real axis. The paper writes every time dependence as $e^{-i\omega t}$, with the
minus sign (chapter 2.6). Books on circuits often use $e^{+i\omega t}$, which changes the sign of every imaginary
part, so the two conventions must never be mixed.

Differentiating $\tilde q\,e^{-i\omega t}$ with respect to time multiplies it by $-i\omega$, so a differential
equation for a steady oscillation becomes algebra. Chapter 1.4 found the arm of a detector beside a swaying person
from $\dd^2\,\delta L/\dd t^2 = -\delta\curv{\tE}_{xx}\,L\cos\omega t$. With phasors the second derivative is
$(-i\omega)^2 = -\omega^2$, so $-\omega^2\,\delta\tilde L = -\delta\curv{\tE}_{xx}L$ and
$\delta\tilde L/L = \delta\curv{\tE}_{xx}/\omega^2$, the result of chapter 1.4 in one line.

A shear that oscillates is a complex number that moves. The paper's rotor, a pair of masses spinning at the angular
velocity $\Omega$, looks the same after half a turn, so its wave repeats at $2\Omega$. Seen along its axis of spin, its
two polarizations have the same size and are a quarter period apart (the paper's equation
[](/paper/#eq:rotor-amplitudes); chapter
[5.4](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor)
derives how they depend on the direction of view, and chapter 7.7 their size): $\curv{\tE}_+ = \curv{\tE}_0\cos2\Omega
t$ and $\curv{\tE}_\times = \curv{\tE}_0\sin2\Omega t$, with the amplitude $\curv{\tE}_0$ in $\mathrm{s^{-2}}$ and $t$
the time at the camera. The shear $2\curv{\tE}_0\,e^{2i\Omega t}$ keeps its size while its phase grows at $2\Omega$, so
its axes, at half the phase, turn at $\Omega$, with the rotor. Seen edge on, only the plus pattern is left, and the
shear swings along the real axis. The paper's circular fraction, equation [](/paper/#eq:circular), measures the motion
in between, and chapter
[5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)
works it out.

## Complex vectors: a direction whose square is zero

The paper writes the tide of a plane wave, together with a second, magnetic part, as one table built from a single
vector with complex components, and we want to read that equation. A **complex vector** has three complex
components. For a wave travelling along $\hat k$, let $\vect e_1$ and $\vect e_2$ be unit vectors across the travel,
with $\vect e_1\times\vect e_2 = \hat k$. The paper uses

$$\sym{null-vector}{\vect m} = \frac{\vect e_1 + i\,\vect e_2}{\sqrt2} = \frac{1}{\sqrt2}\,(1, i, 0),$$

with the components written in the axes $\vect e_1$, $\vect e_2$, $\hat k$. Its dot product with itself, taken as for
real vectors with no conjugate, is $\vect m\cdot\vect m = \tfrac12(1 + i^2) = 0$. A complex vector that is not zero
but whose dot product with itself is zero is a **null vector**, so this dot product is not a length. The length comes
from the **Hermitian product** $\vect a\cdot\vect b^* = a_lb_l^*$, with the second vector
conjugated, because $\vect a\cdot\vect a^* = |a_1|^2 + |a_2|^2 + |a_3|^2$ is positive for every $\vect a$ that is not
zero. For $\vect m$ it is $\tfrac12(1 + 1) = 1$.

The cross product with $\hat k$ (chapter 1.1) turns a real arrow across the travel by a quarter turn, and it only
multiplies $\vect m$ by $-i$: with $\hat k$ along the third axis, $\hat k\times\vect m = (-i, 1, 0)/\sqrt2 = -i\,\vect
m$. When $\vect e_1$ and $\vect e_2$ are turned by $\theta$ about $\hat k$, their new versions are
$\vect e'_1 = \cos\theta\,\vect e_1 + \sin\theta\,\vect e_2$ and $\vect e'_2 = -\sin\theta\,\vect e_1 +
\cos\theta\,\vect e_2$, and we collect the terms of each:

$$\begin{aligned}
\vect e'_1 + i\,\vect e'_2 &= (\cos\theta - i\sin\theta)\,\vect e_1 + i\,(\cos\theta - i\sin\theta)\,\vect e_2\\
&= e^{-i\theta}(\vect e_1 + i\,\vect e_2).
\end{aligned}$$

So $\vect m$ has spin one. The table $\vect m\vect m^{\mathsf T}$, with the entries $m_im_j$, is what the paper calls
the square of $\vect m$, and it has spin two:

$$\vect m\vect m^{\mathsf T} = \frac12\begin{pmatrix} 1 & i & 0\\ i & -1 & 0\\ 0 & 0 & 0\end{pmatrix}.$$

It is symmetric, and its trace is $\tfrac12(1 - 1) = 0$, which is $\vect m\cdot\vect m$ again: it has the shape of a
wave's tide. The paper's table $\sym{weyl-complex}{\curv{\mathcal W}}$ (a curly W) holds the tide and the magnetic part
of the field as one symmetric trace-free table of complex numbers, in $\mathrm{s^{-2}}$. For a plane wave it is

{{paper eq:square}}

We multiply out the first two rows and columns,
$2(\curv{\tE}_+ - i\curv{\tE}_\times)\cdot\tfrac12\bigl(\begin{smallmatrix}1 & i\\ i & -1\end{smallmatrix}\bigr)$, and
collect the real and imaginary parts:

$$\mathrm{Re}\,\curv{\mathcal W} = \begin{pmatrix}\curv{\tE}_+ & \curv{\tE}_\times\\ \curv{\tE}_\times & -\curv{\tE}_+\end{pmatrix}, \qquad \mathrm{Im}\,\curv{\mathcal W} = \begin{pmatrix}-\curv{\tE}_\times & \curv{\tE}_+\\ \curv{\tE}_+ & \curv{\tE}_\times\end{pmatrix}.$$

The minus sign in front of $\curv{\tE}_\times$ cancels the $i$ inside $\vect m\vect m^{\mathsf T}$, so the real part is
the wave's table of plus and cross, with shear $\curv{s} = 2(\curv{\tE}_+ + i\curv{\tE}_\times)$. The shear of the
imaginary part is $-2\curv{\tE}_\times + 2i\curv{\tE}_+ = i\curv{s}$, so it is the same pattern turned by 45°: with
$\curv{\tE}_+ = 0.6$ and $\curv{\tE}_\times = 0.25$, in any unit of tide, the two shears are $1.2 + 0.5i$ and
$-0.5 + 1.2i = i(1.2 + 0.5i)$.

We state here, without proof, that this imaginary part is the wave's magnetic tide $\curv{\tB}$, which twists gyroscopes
rather than moving free balls, so that $\curv{\mathcal W} = \curv{\tE} + i\curv{\tB}$, the paper's equation
[](/paper/#eq:W).[^magnetic] This is the sense of the paper's remark that in a wave $\curv{\tB}$ is $\curv{\tE}$ turned
by 45°. We also state that the field of light in a plane wave is a complex multiple of $\vect m$ itself (chapter
[6.6](/tutorial/relativity/maxwell-complex/#in-a-light-wave-the-complex-field-is-a-multiple-of-one-null-vector)).
Light's field is the vector and gravity's is its square, and chapter 9.1 shows that this is the difference between spin
one and spin two.

::: check
### Q

Compute $(1 + i)^2$, and say what squaring did to the length and the angle.

### A

Multiplying out gives $(1 + i)^2 = 1 + 2i + i^2 = 2i$. The length $\sqrt2$ became its square, 2, and the angle
$45°$ doubled to $90°$.

### Q

The axes turn by 30°. By what factor is the shear multiplied, and by what factor an arrow?

### A

The shear by $e^{-2i\theta} = e^{-i\pi/3} = 0.5 - 0.866i$, and an arrow by $e^{-i\pi/6} = 0.866 - 0.5i$.

### Q

Why does a pattern of stretch and squeeze look the same after half a turn, when an arrow does not?

### A

A half turn multiplies the shear by $e^{-2\pi i} = 1$ and an arrow by $e^{-i\pi} = -1$. In equation [](#eq:ring) the
pattern depends on $2\varphi$, so the balls at $\varphi$ and $\varphi + 180°$ always move alike.

### Q

A tide in a plane has the shear $\curv{s} = 2i$ in units of $G\matter M/r^3$. Along which direction is it a stretch?

### A

The squeeze axis is at $\tfrac12\arg\curv{s} = 45°$, so the stretch axis is at $135°$, which is the same line as
$-45°$. The two eigenvalues are the mean plus and minus 1.

### Q

Show that $\vect m\cdot\vect m = 0$ for $\vect m = (1, i, 0)/\sqrt2$, and find its length.

### A

The dot product is $\vect m\cdot\vect m = \tfrac12(1 + i^2 + 0) = 0$. The length comes from the Hermitian product,
$\vect m\cdot\vect m^* = \tfrac12(1 + 1) = 1$.
:::

**The idea to keep: a complex number is an arrow that can be multiplied, and a turn is multiplication by
$e^{i\theta}$. When the axes turn, an arrow is multiplied by $e^{-i\theta}$ and a pattern of stretch and squeeze by
$e^{-2i\theta}$, which is why gravity's two polarizations are 45° apart and why a tide looks the same after half a
turn.**

::: problems
### Practice

Find every complex number $u$ with $u^2 = i$, and say why there are two.

::: solution
Write $u = re^{i\theta}$. Then $u^2 = r^2e^{2i\theta}$ must equal $i = e^{i\pi/2}$, so $r = 1$ and $2\theta = 90°$ or
$90° + 360°$. So $\theta = 45°$ or $225°$, and $u = \pm e^{i\pi/4} = \pm(1 + i)/\sqrt2$. There are two because the
argument of $i$ is fixed only up to whole turns, and halving a whole turn gives a half turn. This is also why the axes
of a shear, at half its phase, are lines and not arrows.
:::

### Stretch

A point mass $\matter M$ lies at the depth $Z$ below a horizontal camera's plane. At what horizontal distance from the
point directly above it is the size of the shear in that plane largest, and how does that largest value compare with
the vertical stretch $2G\matter M/Z^3$ directly above the mass (chapter 1.4)?

::: solution
By equation [](#eq:point-shear), with $|w|$ the horizontal distance, $|\curv{s}| = 3G\matter M|w|^2/(|w|^2 +
Z^2)^{5/2}$. Its derivative with respect to $|w|$ is zero when $2|w|(|w|^2 + Z^2) = 5|w|^3$, that is
$|w|^2 = \tfrac23Z^2$, so $|w| = 0.816Z$. There $|w|^2 + Z^2 = \tfrac53Z^2$, and

$$|\curv{s}| = \frac{3G\matter M\cdot\tfrac23Z^2}{(\tfrac53)^{5/2}Z^5} = 2\Bigl(\frac35\Bigr)^{5/2}\frac{G\matter M}{Z^3} = 0.558\,\frac{G\matter M}{Z^3},$$

0.28 of the vertical stretch directly above. The shear is zero directly above the mass, peaks on a ring of radius
$0.816Z$, and falls off beyond it.
:::

### The paper

The paper's equation [](/paper/#eq:shear-zeros) says that above a thin layer of matter, seen from a height $Z$ much
greater than its width $R$, the two zeros of the shear stand at $w = w_{\mathrm{cm}} \pm i\sqrt{Q_c/\matter M}$, with
$Q_c = \int\matter\sigma\,(w' - w_{\mathrm{cm}})^2\,\dd^2w'$. Here $\matter\sigma$ is the mass per unit area of the
layer, $\matter M$ its whole mass and $w_{\mathrm{cm}}$ its centre of mass, and the rule carries an error of order
$(R/Z)^2$. Apply it to two equal masses $\matter m$ at $w' = \pm d/2$, and compare with the zeros on the bisector found
in this chapter.

::: solution
The centre of mass is $w_{\mathrm{cm}} = 0$ and the whole mass is $2\matter m$. For point masses the integral becomes
a sum, $Q_c = \matter m(d/2)^2 + \matter m(-d/2)^2 = \matter md^2/2$, a positive real number. So $Q_c/\matter M =
d^2/4$, and the zeros stand at $w = \pm i\,d/2$: on the bisector, at $y = \pm d/2$, exactly $d$ apart, as in this
chapter. For two equal masses the rule is exact, as the paper says: these two zeros stand at $\pm i\,d/2$ at every
depth, with no error of order $(R/Z)^2$. Only below the depth $\tfrac{\sqrt3}{2}d$ do four more zeros join them.
:::
:::

::: paper
- Figure [](/paper/#fig:tidal), panels (b) and (c), draws the two polarizations of a wave, a turn of 45° apart, and
  [Section II](/paper/#sec:pixel) says that in a wave $\curv{\tB}$ is $\curv{\tE}$ turned by 45°.
- [Section III](/paper/#sec:regimes) says that gravity has spin two and, in *Spin, speed and compactness*, that a
  wave's curvature is the square $\vect m\vect m^{\mathsf T}$ where light's field is $\vect m$ itself.
- *The zeros of the shear*, in [Section IV](/paper/#sec:near-field), defines the shear $(\curv{\tE}_{xx} -
  \curv{\tE}_{yy}) + 2i\,\curv{\tE}_{xy}$, finds its two zeros above two masses, and gives equation
  [](/paper/#eq:shear-zeros); Figure [](/paper/#fig:buried-ruler) shows the phase winding round them.
- *The sense of turning*, in [Section V](/paper/#sec:waves), gives equations [](/paper/#eq:rotor-amplitudes) and
  [](/paper/#eq:circular); seen face on, this chapter reads the rotor's wave as a shear whose axes turn with the
  rotor.
- *One complex matrix*, in [Section VIII](/paper/#sec:one-pixel), defines $\curv{\mathcal W} = \curv{\tE} +
  i\curv{\tB}$, equation [](/paper/#eq:W), and writes a plane wave as equation [](/paper/#eq:square).
:::

::: deeper
- The [GR course, section 18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten)
  explains why a gravitational wave has two polarizations, and its
  [wave scene](https://neovand.github.io/general-relativity/chapter-18.html#scene-wave) animates rings in the plus and
  cross patterns.
- The GR course's lesson on
  [waves, modes and Green functions](https://neovand.github.io/general-relativity/chapter-18.html#waves-modes-and-green-functions)
  uses complex exponentials for waves, and its lesson on
  [initial data and oscillations](https://neovand.github.io/general-relativity/chapter-0.html#initial-data-and-oscillations)
  builds an oscillation from its starting state.
- Tristan Needham, *Visual Complex Analysis* (Oxford, 1997), chapter 1, draws multiplication as a turn and a stretch,
  and Euler's formula as motion round the circle.
:::

::: history
### Square roots of negative numbers, and the plane

Gerolamo Cardano met square roots of negative numbers in *Ars Magna* (1545), in a problem beside his solution of the
cubic: to split 10 into two parts whose product is 40. He treated them as useless. Rafael Bombelli showed in 1572 how
to calculate with them, in the case of the cubic where they cannot be avoided. Leonhard Euler published
$e^{i\theta} = \cos\theta + i\sin\theta$ in his *Introductio in analysin infinitorum* (1748). The picture of complex
numbers as points of a plane, with multiplication as turning and stretching, came later: from the surveyor Caspar
Wessel in 1799 and from Jean-Robert Argand in 1806, and it became standard after Gauss adopted it in 1831. Paul Nahin
tells the story in *An Imaginary Tale* (Princeton, 1998).
:::

[^u]: Most books write a complex number as $z$. This chapter keeps $z$ for the third axis, as the paper does, and
    writes $u$.

[^bar]: Many books write the conjugate as $\bar u$. The paper writes $u^*$, for example in $\vect m^*$, and so does
    this tutorial.

[^spin]: In quantum mechanics spin is an angular momentum. Chapters 8.4 and 9.1 show that it is the same number as
    the power of $e^{-i\theta}$ used here.

[^s-ratio]: Chapter 3.7 uses $s$ for a different quantity, the ratio of one ripple of a picture to its noise. The two
    never appear together.

[^plus]: The tides $\curv{\tE}_+$ and $\curv{\tE}_\times$, in $\mathrm{s^{-2}}$, are not the strains $h_+$ and
    $h_\times$, which are pure numbers. For a steady wave the two are proportional (chapter
    [7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)).

[^roots]: The zeros were found with a standard root-finder from a grid of starting points, to a tolerance of
    $10^{-10}$ in $|\curv{s}|$ relative to $G\matter M/d^3$. The paper's code checks the two zeros on the bisector at the
    depths $0.9d$, $2d$ and $7d$ (`reference/tests/test_shearzeros.py`).

[^magnetic]: Chapter [7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index)
    defines the magnetic tide $\curv{\tB}$, and chapter
    [7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45) shows that in a
    wave it is $\curv{\tB}_{ij} = \epsilon_{ipq}\hat k_p\curv{\tE}_{qj}$, which with $\hat k\times\vect m = -i\vect m$
    gives the paper's equation [](/paper/#eq:square). Chapter 9.3 studies $\curv{\mathcal W}$ itself.
