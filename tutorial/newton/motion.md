---
id: '1.6'
title: 'Motion: energy, momentum, rigid bodies, rotating frames'
question: 'Two planets of the same mass and size pull alike on everything outside them: what does the way they turn reveal that their pull hides, and why must the pixel that reads it not turn?'
part: '1'
requires: ['1.1', '1.2', '1.3', '1.4', '1.5']
paper: [sec:pixel, sec:near-field, eq:split, sec:one-pixel, sec:second-order]
figures: []
live: [shell-theorem, turning-pixel]
depth: A
---

Two planets have the same mass and the same radius. One is rock all the way through, and the other has an iron core
inside a lighter mantle. By the shell theorem of section 1.3, they pull alike on everything outside them, at every
distance and at any sensitivity. Set them spinning at the same rate, though, and they differ: the planet with the core
is easier to set turning, and when it turns it carries less angular momentum.

A pixel on the ground of the turning Earth reads this difference. A small part of the tide it measures depends on how
the Earth's mass is spread from the centre outward, through one number that this section defines, and that number
tells a planet with a core from one without.[^p-pixel] The pixel can read it only if it does not turn itself. The
answer to our question needs the parts of Newton's mechanics that go beyond his law of gravity.

::: plain
Forces inside a body come in equal and opposite pairs, so they cannot move the body as a whole. A body that nothing
pushes or twists keeps its momentum and its angular momentum, the amount of turning it carries.

A hollow ball is harder to set spinning than a solid ball of the same mass and size, by a factor of five thirds,
although the two pull identically on everything outside them. So the way a planet spins shows whether its mass is
gathered toward the centre, which its pull never shows.

A room that turns adds two false accelerations to everything in it. One pushes things away from the axis, and it
stretches a ring of free balls across the axis, as a real tide would: for the Earth's turning, about half the tide of
a person one metre away. Gyroscopes remove it by holding the pixel's axes still.
:::

## Force changes momentum, and forces inside a body cancel

The **momentum** of a body of mass $\matter m$ moving with velocity $\vect v$, in metres per second, is
$\sym{momentum}{\vect p} = \matter m\vect v$, in kilogram metres per second. Newton's second law (section 1.2) says
that a **force** $\sym{force}{\vect F}$, in newtons, gives the body the acceleration $\vect F/\matter m$. For a body
whose mass does not change, the force is therefore the rate of change of the momentum:

$$\vect F = \frac{\dd\vect p}{\dd t}.$$

**Newton's third law** says that the force of one body on another is equal in size and opposite in direction to the
force of the second on the first: the Earth pulls a person of 70 kg down with 687 N, and the person pulls the Earth up
with 687 N.

Now take a body of parts $a = 1, 2, \dots$, with masses $\matter m_a$ and positions $\vect x_a$. Part $a$ feels outside
forces with the sum $\vect F_a^{\rm out}$, and a force $\vect F_{ab}$ from each other part $b$. Adding the second law
over all parts, the total momentum $\vect P = \sum_a \vect p_a$ changes at the rate

$$\frac{\dd\vect P}{\dd t} = \sum_a \vect F_a^{\rm out} + \sum_a\sum_{b \ne a}\vect F_{ab}.$$

The double sum contains every pair twice, as $\vect F_{ab}$ and as $\vect F_{ba}$, and by the third law each pair adds
to zero. So only the outside forces change the total momentum.

The **centre of mass** of the body is the average of the positions of its parts, each weighted by its mass:

$$\sym{centre-of-mass}{\vect x_{\rm cm}} = \frac{1}{\matter M}\sum_a \matter m_a\vect x_a, \qquad \matter M = \sum_a \matter m_a .$$

We differentiate once with respect to time, which gives $\matter M\dot{\vect x}_{\rm cm} = \sum_a \matter m_a\vect v_a
= \vect P$, and once more, using the last result:[^dot]

$$\boxed{\;\matter M\,\ddot{\vect x}_{\rm cm} = \sum_a \vect F_a^{\rm out}.\;}$$

The centre of mass moves as one particle that carries the whole mass and feels only the outside forces, so no force
inside a body can move it (Figure [](#fig:parts)). A body with no outside force on it keeps its total momentum: the
**conservation of momentum**.

![A body of five parts joined by springs, drawn at three equal intervals of time. Each spring pulls on its two parts
with forces of equal size in opposite directions, drawn in orange beside the spring at the first instant, such as
$\vect F_{ab}$ and $\vect F_{ba}$; the parts move on the wavy pale paths, while the centre of mass, the quartered
circle, moves along the dotted straight line by equal steps. The masses,
springs and arrow scale are chosen for the drawing.](tut-motion-parts){#fig:parts}

## Work changes kinetic energy, and a steady field keeps the energy fixed

The **kinetic energy** is $\sym{kinetic-energy}{K} = \tfrac12\matter m v^2$ in joules, and the **work** of a force
along a small step $\dd\vect x$ is $\vect F\cdot\dd\vect x$ (section 1.2). We differentiate $K$ with respect to time
and use the second law, $\matter m\,\dd\vect v/\dd t = \vect F$:

$$\frac{\dd K}{\dd t} = \matter m\,\vect v\cdot\frac{\dd\vect v}{\dd t} = \vect F\cdot\vect v .$$

In a time $\dd t$ the body moves by $\vect v\,\dd t$, so the work done is the change of kinetic energy.

Now let gravity be the only force, $\vect F = -\matter m\nabla\field\Phi$, with $\field\Phi$ the potential in joules per
kilogram. We assume that **the field is steady**: the masses that make $\field\Phi$ do not move. Along the body's path,
$\field\Phi(\vect x(t))$ then changes at the rate $\nabla\field\Phi\cdot\vect v$, by the chain rule, and

$$\frac{\dd}{\dd t}\bigl(K + \matter m\field\Phi\bigr) = \vect F\cdot\vect v + \matter m\,\nabla\field\Phi\cdot\vect v = 0 .$$

So $K + \matter m\field\Phi$ stays the same for one body in a steady field: the **conservation of energy**. A ball
dropped from rest falls through $9.8\unit{J\,kg^{-1}}$ of potential in its first metre, so it reaches
$\sqrt{2 \times 9.8}\unit{m\,s^{-1}} = 4.4\unit{m\,s^{-1}}$. If the sources moved, a body could gain energy, as a
spacecraft does when it swings past a moving planet.

A system of many parts needs more, because the two parts of a pair can do work on each other, as friction does when it
turns kinetic energy into heat. The total energy is kept when every inner force comes from a potential energy that
depends only on the places of the parts, as gravity's $-G\matter m_a\matter m_b/|\vect x_a - \vect x_b|$ does
(section 1.7 gives the general rule).

The **impulse** of a force, $\sym{impulse}{\vect J} = \int\vect F\,\dd t$ in newton seconds, is the change of
momentum it gives, by the second law.

## Angular momentum stays fixed when the force points at a centre

The **angular momentum** of a body about the origin is

$$\sym{angular-momentum}{\vect L} = \vect x\times\vect p,$$

where $\times$ is the cross product of section 1.1, in $\mathrm{kg\,m^2\,s^{-1}}$. The **torque** of a force about the origin is $\vect x\times\vect F$, in newton metres. We differentiate $\vect L$ with
the product rule:

$$\begin{aligned}
\frac{\dd\vect L}{\dd t} &= \dot{\vect x}\times\vect p + \vect x\times\dot{\vect p}\\
&= \vect v\times\matter m\vect v + \vect x\times\vect F.
\end{aligned}$$

The cross product of a vector with itself is zero, so the first term vanishes, and

$$\boxed{\;\frac{\dd\vect L}{\dd t} = \vect x\times\vect F.\;}$$

A **central force** points along the line from the body to the origin, toward it or away from it. The pull of a mass
fixed at the origin is one. Then $\vect F$ is parallel to $\vect x$, the torque is zero, and $\vect L$ is fixed. The
body stays in the plane at right angles to $\vect L$, because $\vect x\cdot(\vect x\times\vect p) = 0$, which is why
orbits are flat (section 1.8).

For a body of many parts we add the angular momenta of the parts. The third law is not enough here, so we assume that
**the inner forces are central**, acting along the line joining the two parts, as gravity and the pull of a stretched
string do. The torques of each pair then add to $(\vect x_a - \vect x_b)\times\vect F_{ab} = 0$, because the force is
parallel to $\vect x_a - \vect x_b$. Only outside torques change the total angular momentum: a body that nothing twists
keeps its angular momentum, fixed in size and direction.

A **gyroscope** is a wheel spun fast about its axis of symmetry on bearings that twist it as little as possible. Its
angular momentum lies along its axis, so the axis keeps its direction relative to the distant stars, however the mount
is turned. The pixel needs this property at the end of the section.[^gyro]

## A turning body keeps the spread of its mass in a table of inertia

A **rigid body** is one whose parts keep their distances from one another. We let it turn about its centre of mass,
which we take as the origin, with the **angular velocity** $\sym{angular-velocity}{\vect\Omega}$ of section 1.1, a
vector along the axis whose length is the angle turned per second, in radians per second. Each point then moves with
velocity $\vect v = \vect\Omega\times\vect x$ (Figure [](#fig:spin)).

![A slab turning about a vertical axis with the angular velocity $\vect\Omega$. Each marked point, on one radius
of the top face, moves on a circle about the axis with the velocity $\vect v = \vect\Omega\times\vect x$, along the
circle and in proportion to the distance from the axis; the point on the axis does not move. The slab's shape and
the arrow scale are chosen for the drawing.](tut-motion-spin){#fig:spin}

For one part of mass $\matter m$ the angular momentum is $\matter m\,\vect x\times(\vect\Omega\times\vect x)$. The rule
of section 1.1, $\vect a\times(\vect b\times\vect c) = \vect b\,(\vect a\cdot\vect c) - \vect c\,(\vect a\cdot\vect b)$,
with $\vect a = \vect c = \vect x$ and $\vect b = \vect\Omega$, gives

$$\vect x\times(\vect\Omega\times\vect x) = \vect\Omega\,r^2 - \vect x\,(\vect x\cdot\vect\Omega),$$

where $r = |\vect x|$. In components, the $i$th entry is $\Omega_i r^2 - x_ix_j\Omega_j$, which is
$(r^2\delta_{ij} - x_ix_j)\Omega_j$ because $\delta_{ij}\Omega_j = \Omega_i$. We add over all the parts, as an integral
over the volume with the density $\matter\rho$ of section 1.3, in kilograms per cubic metre, and find
$L_i = I_{ij}\Omega_j$ with

$$\boxed{\;\sym{inertia-tensor}{I_{ij}} = \int\matter\rho\,\bigl(r^2\delta_{ij} - x_ix_j\bigr)\,\dd V.\;} \label{eq:inertia}$$

This table is the **inertia tensor**, in $\mathrm{kg\,m^2}$. It depends only on how the mass is spread, not on how fast
the body turns. It is symmetric, $I_{ij} = I_{ji}$, so it has three perpendicular eigenvectors with real
eigenvalues (section 1.5). These are the **principal axes** of the body: about one of them $\vect L$ lies along
$\vect\Omega$, and about any other axis it does not.

Now let the body turn about a single axis along the unit vector $\hat u$, at the rate $\Omega$. A point at the
distance $s$ from the axis moves on a circle at the speed $\Omega s$, so the kinetic energy is
$\tfrac12\int\matter\rho\,\Omega^2s^2\,\dd V$, and

$$K = \tfrac12 I\Omega^2, \qquad \sym{moment-of-inertia}{I} = \int\matter\rho\,s^2\,\dd V = \hat u_iI_{ij}\hat u_j .$$

This number is the **moment of inertia** about the axis, how hard it is to set the body spinning,[^s] and it plays
the part that the mass plays in $\tfrac12\matter mv^2$.

### A round body has the same moment about every axis

For a **spherically symmetric** body, whose density depends only on the distance from the centre, symmetry fixes
$\int\matter\rho\,x_ix_j\,\dd V$, the part of equation [](#eq:inertia) that needs work.
Reflecting the body in the plane $x = 0$ leaves it unchanged but reverses the sign of $xy$, so
$\int\matter\rho\,xy\,\dd V = -\int\matter\rho\,xy\,\dd V = 0$, and every entry off the diagonal is zero. Turning the
body so that any one axis goes to any other also leaves it unchanged, so the three diagonal entries are equal. They
add up to $\int\matter\rho\,r^2\,\dd V$, so each is a third of it:

$$\int\matter\rho\,x_ix_j\,\dd V = \tfrac13\,\delta_{ij}\int\matter\rho\,r^2\,\dd V .$$

Equation [](#eq:inertia) then loses a third of its first term:

$$\boxed{\;I_{ij} = I\,\delta_{ij}, \qquad I = \frac23\int\matter\rho\,r^2\,\dd V.\;} \label{eq:round}$$

Every axis through the centre is a principal axis. For a uniform ball of radius $R$ we take thin shells of radius $r$ and volume $4\pi r^2\,\dd r$, so that
$\int\matter\rho\,r^2\,\dd V = 4\pi\matter\rho\int_0^R r^4\,\dd r = \tfrac45\pi\matter\rho R^5$. The mass is
$\matter M = \tfrac43\pi\matter\rho R^3$, so this is $\tfrac35\matter MR^2$, and

$$I_{\rm ball} = \tfrac25\,\matter MR^2 .$$

For a thin shell of radius $R$ all the mass lies at $r = R$, so $\int\matter\rho\,r^2\,\dd V = \matter MR^2$ and
$I_{\rm shell} = \tfrac23\matter MR^2$. The shell's moment is larger by the factor $5/3$, although the two have the
same mass and, by the shell theorem, the same field outside. A point mass at the centre is the other limit, with
$I = 0$. A round body of mass $\matter M$ and radius $R$ therefore has a **moment-of-inertia factor** $I/\matter MR^2$
between 0 and $\tfrac23$, smaller the more its mass lies near the centre.

The real Earth has $I/\matter MR^2 = 0.3307$. With $\matter M = 5.97 \times 10^{24}\unit{kg}$ and
$R = 6371\unit{km}$, its moment of inertia is $8.0 \times 10^{37}\unit{kg\,m^2}$. Turning at
$\Omega = 7.29 \times 10^{-5}\unit{s^{-1}}$, it carries the angular momentum
$I\Omega = 5.8 \times 10^{33}\unit{kg\,m^2\,s^{-1}}$, 17 per cent less than a uniform Earth turning at the same rate.

::: try {#shell-theorem}
Predict first: which has the larger moment of inertia, a uniform ball or a thin shell of the same mass and radius,
and by what factor? Press Ball and Shell in turn and read the moment in the last readout. Then press Ball and drag the
slider left, which gathers the mass toward the centre: the moment falls past the Earth's $0.331\,\matter MR^2$, and
the pull at $2R$ does not change.
:::

## The moment of inertia tells a cored planet from a uniform one

Section 1.3 built two Earths that no reading of the steady field outside can tell apart: a uniform ball of density
$5513\unit{kg\,m^{-3}}$, and a core of radius $R_{\rm c} = 3480\unit{km}$ and density $\matter\rho_{\rm c}$ inside a
mantle of density $\matter\rho_{\rm m}$ (Figure [](#fig:earths)). The mass and the moment of inertia fix the two
densities. The radius of the core comes from a third channel, the glow of heat, the faint gravitational waves that the
warm interior gives off: their brightness seen from the ground has a kink, a sudden change of slope, in the direction
whose line of sight grazes the core, 33° from straight down.[^p-core]

![The two Earths of section 1.3, cut through the centre and drawn to scale: on the left, a core of radius 3480 km
inside a mantle out to 6371 km, with the densities that this section finds; on the right, the uniform Earth. The
arrows outside are the pull at one distance; at every distance outside, it is the same for both. The stone and the
metal are pictures, and their shades show only which layer is denser.](tut-motion-earths){#fig:earths}

We write $q = R_{\rm c}/R = 0.5462$ and $\matter{\bar\rho} = 5513\unit{kg\,m^{-3}}$ for the mean density. The mass is
$\tfrac43\pi$ times $\matter\rho_{\rm c}R_{\rm c}^3 + \matter\rho_{\rm m}(R^3 - R_{\rm c}^3)$, and it must equal
$\tfrac43\pi R^3\matter{\bar\rho}$. The integral $\int\matter\rho\,r^2\,\dd V$ is $\tfrac45\pi$ times
$\matter\rho_{\rm c}R_{\rm c}^5 + \matter\rho_{\rm m}(R^5 - R_{\rm c}^5)$, by the shells above, and by equation
[](#eq:round) two thirds of it must be $0.3307\,\matter MR^2$. We divide the first condition by
$\tfrac43\pi R^3$ and the second by $\tfrac{8\pi}{15}R^5$:

$$\begin{aligned}
\matter\rho_{\rm c}\,q^3 + \matter\rho_{\rm m}\,(1 - q^3) &= \matter{\bar\rho},\\
\matter\rho_{\rm c}\,q^5 + \matter\rho_{\rm m}\,(1 - q^5) &= \frac{0.3307}{0.4}\,\matter{\bar\rho}.
\end{aligned}$$

With $q^3 = 0.1630$ and $q^5 = 0.0486$, and right-hand sides of 5513 and $4558\unit{kg\,m^{-3}}$, they give

$$\boxed{\;\matter\rho_{\rm c} = 12{,}500\unit{kg\,m^{-3}}, \qquad \matter\rho_{\rm m} = 4150\unit{kg\,m^{-3}}.\;}$$

The exact solution is 12,505 and 4152. As a check, with 0.4 in place of 0.3307 both right-hand sides equal
$\matter{\bar\rho}$, and the solution is the uniform ball. The standard model of the Earth's interior, built from earthquake waves, puts the core's average near
$11{,}000\unit{kg\,m^{-3}}$ [@DziewonskiAnderson1981]; the difference comes from the mantle, which its own weight
squeezes denser with depth, and two numbers cannot describe that. The second stretch exercise of this section lets the
mantle's density rise with depth as the earthquake waves show, and the core falls to $11{,}300\unit{kg\,m^{-3}}$.

The outside cannot see $\int\matter\rho\,r^2\,\dd V$, for a precise reason. A function $h$ with $\nabla^2h = 0$ is
**harmonic** (section 1.3). The potential at a point $\vect y$ outside the body is
$-G\int\matter\rho(\vect x)/|\vect y - \vect x|\,\dd V$, and $1/|\vect y - \vect x|$ is harmonic in $\vect x$ away from
$\vect y$, so the field outside is built only from integrals $\int\matter\rho\,h\,\dd V$ with $h$ harmonic. The reverse
also holds, and we state it without proof: bodies with the same field outside share these integrals for every harmonic
$h$ (sections 2.3 and 2.5).[^p-split] The function $r^2$ is not harmonic, because $\nabla^2 r^2 = 6$, and indeed the
ball and the shell have different integrals of $r^2$ and the same outside.

The moment of inertia splits into a part the outside sees and a part it cannot. About the $x$ axis the squared distance
from the axis is $s^2 = y^2 + z^2 = r^2 - x^2$, and we write it as two thirds of $r^2$ plus the rest:

$$\begin{aligned}
I_x &= \int\matter\rho\,(r^2 - x^2)\,\dd V\\
&= \frac23\int\matter\rho\,r^2\,\dd V + \int\matter\rho\,\Bigl(\frac{r^2}{3} - x^2\Bigr)\,\dd V .
\end{aligned}$$

The second integrand is harmonic, because $\nabla^2(r^2/3) = 2$ and $\nabla^2x^2 = 2$. So the second integral is fixed
by the outside and shared by all bodies with the same outside field, and only the first part can differ. For a round
body the second part is zero, by the symmetry argument above. Spin a body at a known rate, and its angular momentum
gives $I$, and with it the hidden $\int\matter\rho\,r^2\,\dd V$.

A pixel can read $I$ from the small magnetic part of the tide, a second kind of tide made by moving masses (section
7.5). A pixel at rest on the equator moves at $\Omega R = 465\unit{m\,s^{-1}}$ through the field of a planet that is
itself spinning. The pixel's motion and the planet's spin each make a magnetic part, with opposite signs. With $c$ the
speed of light, their sum has the size

$$\frac{3G\matter M\Omega}{cR^2}\Bigl(1 - \frac{I}{\matter MR^2}\Bigr) = 4.8 \times 10^{-12}\unit{s^{-2}},$$

where the pixel's motion gives the 1 and the planet's spin gives $I/\matter MR^2$. It is about a two-thousandth of the
person's tide at a metre. The mass, the rate and the radius are known, so one pixel on the ground reads
$I/\matter MR^2$.

## The slow turning of the Earth's axis measures its moment of inertia

The number 0.3307 cannot come from the field outside, as the last section showed, and no one can stop the Earth to
learn how much angular momentum it carries. It comes instead from two slow motions, one of satellites and one of the
Earth's own axis. The Earth's spin flattens it a little, so it is not quite round. We write $C$ for its moment of
inertia about the axis of spin and $A$ for the moment about any axis in the equator, both in $\mathrm{kg\,m^2}$, with
$C$ larger. With $z$ along the axis of spin, the difference is

$$C - A = I_z - I_x = \int\matter\rho\,(x^2 - z^2)\,\dd V ,$$

and $x^2 - z^2$ is harmonic. So by the split above, $C - A$ is fixed by the field outside: it is the size of the
Earth's quadrupole, whose potential is $+G(C - A)P_2(\cos\vartheta)/r^3$, with $\vartheta$ measured from the axis
([section 2.3](/tutorial/outside/multipoles/)). Geodesists write it as
$J_2 = (C - A)/\matter Ma^2$, with $a = 6378\unit{km}$ the equatorial radius. The quadrupole makes the plane of a
satellite's orbit turn slowly about the Earth's axis, and the turning of many orbits gives
$J_2 = 1.0826 \times 10^{-3}$.[^iers] The field outside fixes the difference of the two moments and not their sizes.

The sizes come from a tide. The Sun and the Moon pull harder on the near side of the Earth's bulge than on the far
side, and so they twist the Earth. We want that twist. We expand the potential $\field\Phi$ of an outside mass about
the Earth's centre of mass, as in section 1.4: $\partial_k\field\Phi(\vect x) \approx \partial_k\field\Phi(0) +
\curv{\tE}_{kl}x_l$, with $\curv{\tE}_{kl}$ the tide of the outside mass at the centre. The torque about the centre is
$\int\matter\rho\,\vect x\times(-\nabla\field\Phi)\,\dd V$, so in components

$$\tau_i = -\epsilon_{ijk}\,\partial_k\field\Phi(0)\int\matter\rho\,x_j\,\dd V - \epsilon_{ijk}\,\curv{\tE}_{kl}\int\matter\rho\,x_jx_l\,\dd V .$$

The first integral is zero, because the origin is the centre of mass. For the second we solve equation
[](#eq:inertia) for the integral: its trace gives $\int\matter\rho\,r^2\,\dd V = \tfrac12I_{mm}$, so
$\int\matter\rho\,x_jx_l\,\dd V = \tfrac12I_{mm}\delta_{jl} - I_{jl}$. The part with $\delta_{jl}$ gives
$\epsilon_{ijk}\curv{\tE}_{kj}$, which is zero because $\curv{\tE}$ is symmetric and $\epsilon$ antisymmetric in $j$
and $k$, so $\tau_i = \epsilon_{ijk}\,I_{jl}\,\curv{\tE}_{lk}$. For a mass $\matter M'$ at the distance $r$ in the
direction $\hat n$, the tide is $(G\matter M'/r^3)(\delta_{lk} - 3\hat n_l\hat n_k)$ (section 1.4). Its $\delta_{lk}$
part gives $\epsilon_{ijk}I_{jk} = 0$ for the same reason, and the rest is

$$\boxed{\;\vect\tau = \frac{3G\matter M'}{r^3}\,\hat n\times\bigl(I\hat n\bigr) .\;} \label{eq:tide-torque}$$

The units are $\mathrm{m^3\,s^{-2}}$ over $\mathrm{m^3}$ times $\mathrm{kg\,m^2}$, which is a newton metre. A round body
has $I_{ij} = I\delta_{ij}$, so $I\hat n$ lies along $\hat n$ and the body feels no torque, as it must. For the flattened Earth
$I\hat n = A\hat n + (C - A)(\hat n\cdot\hat z)\hat z$, so the torque is $(3G\matter M'/r^3)(C - A)(\hat n\cdot\hat z)
(\hat n\times\hat z)$: it vanishes when the Sun stands over the equator or over a pole, and between them it turns the
bulge toward the line to the Sun.

Over a year the Sun goes round the Earth's sky. We take axes with the third along $\hat k$, the pole of the Earth's
orbit, so that the Earth's axis is $\hat z = (0, \sin\varepsilon, \cos\varepsilon)$, with the tilt
$\varepsilon = 23.44°$, and the Sun is in the direction $\hat n = (\cos\lambda, \sin\lambda, 0)$, with $\lambda$
growing through the year. Then $\hat n\cdot\hat z = \sin\lambda\sin\varepsilon$ and
$\hat n\times\hat z = (\sin\lambda\cos\varepsilon, -\cos\lambda\cos\varepsilon, \cos\lambda\sin\varepsilon)$. Over a
year $\sin^2\lambda$ averages to $\tfrac12$ and $\sin\lambda\cos\lambda$ to zero, so the mean torque is

$$\langle\vect\tau\rangle = \frac{3G\matter M'}{2r^3}\,(C - A)\sin\varepsilon\cos\varepsilon\;(1, 0, 0).$$

This torque is at right angles both to the angular momentum $\vect L = C\Omega\hat z$ and to $\hat k$. So it changes
neither the size of $\vect L$ nor its part along $\hat k$: the axis keeps its tilt and turns about $\hat k$ on a cone.
The part of $\vect L$ across $\hat k$ has the length $C\Omega\sin\varepsilon$, and the torque moves its tip at the rate
$\langle\tau\rangle$, from the second axis toward the first, the opposite way to the Sun's yearly motion. The axis
therefore turns backward about $\hat k$ at the angular rate

$$\Omega_{\rm p} = \frac{\langle\tau\rangle}{C\Omega\sin\varepsilon} = \frac{3}{2\Omega}\,\frac{C - A}{C}\cos\varepsilon\,\frac{G\matter M'}{r^3} .$$

This is the **precession of the equinoxes**. The units are $\mathrm{s^{-2}}$ over $\mathrm{s^{-1}}$, a rate. A round
Earth, with $C = A$, would not precess, and a faster spin would precess more slowly, as a fast top does.

The Moon adds its own term. The factors $G\matter M'/r^3$ are half the tidal stretches of section 1.4:
$3.96 \times 10^{-14}\unit{s^{-2}}$ for the Sun and $8.63 \times 10^{-14}\unit{s^{-2}}$ for the Moon, so

$$\Omega_{\rm p} = \frac{3\cos\varepsilon}{2\Omega}\,\frac{C - A}{C}\,\bigl(1.26 \times 10^{-13}\unit{s^{-2}}\bigr).$$

The Earth's axis is observed to turn by 50.3″ a year,[^precession] once round in 25,800 years, which is
$\Omega_{\rm p} = 7.73 \times 10^{-12}\unit{s^{-1}}$. With $\Omega = 7.292 \times 10^{-5}\unit{s^{-1}}$ and
$\cos\varepsilon = 0.9175$, solving gives $(C - A)/C = 3.25 \times 10^{-3}$. The full theory, with the Moon's orbit
tilted and slightly elliptical, gives $3.2738 \times 10^{-3}$, about one per cent more.[^iers] The ratio of the two
measurements is the moment we wanted:

$$\boxed{\;\frac{C}{\matter Ma^2} = \frac{J_2}{(C - A)/C} = \frac{1.0826 \times 10^{-3}}{3.2738 \times 10^{-3}} = 0.3307 .\;}$$

The estimate $3.25 \times 10^{-3}$ would give 0.333. The round models of this section need the mean of the three
moments, $(2A + C)/3$, which is smaller than $C$ by the factor $1 - \tfrac23(C - A)/C = 0.99782$, measured against the
mean radius of 6371 km, which is smaller than $a$; the two corrections cancel to four figures, and the mean moment is
$0.3307\,\matter MR^2$ as well.

## In a turning frame, two extra accelerations appear

A frame is **inertial** when a body that nothing pushes or pulls keeps its speed and direction in it (section 1.2);
here gravity counts as one of the forces, as in Newton's mechanics. A **turning frame** has axes that turn at a steady
angular velocity $\obs{\vect\Omega}$ relative to an inertial frame. A laboratory on the ground is one, turning with
the Earth.[^colour]

Let $\vect e'_1$, $\vect e'_2$ and $\vect e'_3$ be the turning axes. Each is an arrow fixed in the frame, and an arrow
turned by the small angle $\obs{\vect\Omega}\,\dd t$ changes by $(\obs{\vect\Omega}\,\dd t)\times\vect e'_i$
(section 1.1), so

$$\frac{\dd\vect e'_i}{\dd t} = \obs{\vect\Omega}\times\vect e'_i .$$

A vector $\vect A = A'_i\vect e'_i$ has components $A'_i$ in the turning axes. Its rate of change in the inertial frame
follows from the product rule:

$$\begin{aligned}
\frac{\dd\vect A}{\dd t} &= \frac{\dd A'_i}{\dd t}\,\vect e'_i + A'_i\,\obs{\vect\Omega}\times\vect e'_i\\
&= \Bigl(\frac{\dd\vect A}{\dd t}\Bigr)_{\rm turn} + \obs{\vect\Omega}\times\vect A .
\end{aligned}$$

The first term is the rate the turning observer measures, who sees the axes as fixed. Applied to the position
$\vect x$, whose rate in the turning frame is the velocity $\vect v$ measured there, the rule gives

$$\vect v_{\rm in} = \vect v + \obs{\vect\Omega}\times\vect x .$$

We apply the rule again to $\vect v_{\rm in}$, with $\obs{\vect\Omega}$ constant. In the turning frame $\vect v$
changes at the rate $\vect a$, the acceleration measured there, and $\vect x$ at the rate $\vect v$, so the first term
of the rule is $\vect a + \obs{\vect\Omega}\times\vect v$, and the second is $\obs{\vect\Omega}\times\vect v_{\rm in}$:

$$\vect a_{\rm in} = \bigl(\vect a + \obs{\vect\Omega}\times\vect v\bigr) + \obs{\vect\Omega}\times\bigl(\vect v + \obs{\vect\Omega}\times\vect x\bigr).$$

We collect the two terms in $\obs{\vect\Omega}\times\vect v$ and solve for $\vect a$:

$$\boxed{\;\vect a = \vect a_{\rm in} - 2\,\obs{\vect\Omega}\times\vect v - \obs{\vect\Omega}\times\bigl(\obs{\vect\Omega}\times\vect x\bigr).\;} \label{eq:turning}$$

Here $\vect a_{\rm in} = \vect F/\matter m$ is the acceleration that the true forces give. The term
$-2\obs{\vect\Omega}\times\vect v$ is the **Coriolis acceleration**: it acts only on a body that moves in the turning
frame, and pushes it sideways, at right angles to its velocity. The last term is the **centrifugal acceleration**. By
the rule for a cross product inside a cross product (section 1.1),

$$\begin{aligned}
-\obs{\vect\Omega}\times\bigl(\obs{\vect\Omega}\times\vect x\bigr) &= \obs\Omega^2\,\vect x - \obs{\vect\Omega}\,(\obs{\vect\Omega}\cdot\vect x)\\
&= \obs\Omega^2\,\vect x_\perp ,
\end{aligned}$$

where $\vect x_\perp$ is the part of $\vect x$ at right angles to the axis: the centrifugal acceleration points
straight away from the axis and grows with the distance from it. The units agree, since $\mathrm{s^{-2}}$ times metres
and $\mathrm{s^{-1}}$ times metres per second are both $\mathrm{m\,s^{-2}}$. As $\obs{\vect\Omega} \to 0$ both extra
terms vanish, and a body at rest on the axis feels neither.

::: gap
The derivation assumed that the frame turns at a steady rate about a fixed origin. If $\obs{\vect\Omega}$ changes in
time, differentiating $\obs{\vect\Omega}\times\vect x$ adds a third term, $-\dot{\obs{\vect\Omega}}\times\vect x$, the
Euler acceleration. If the origin itself accelerates, every body in the frame feels that acceleration with its sign
reversed; a frame that falls freely, as in section 1.4, cancels gravity in this way.
:::

On the equator, at the distance $s = 6378\unit{km}$ from the axis, the centrifugal acceleration is
$\obs\Omega^2 s = (7.29 \times 10^{-5})^2 \times 6.378 \times 10^6\unit{m\,s^{-2}} = 0.034\unit{m\,s^{-2}}$,
0.35 per cent of the $9.8\unit{m\,s^{-2}}$ of gravity. A body moving at $1\unit{m\,s^{-1}}$ at right angles to the axis
feels a Coriolis acceleration of $2\obs\Omega v = 1.5 \times 10^{-4}\unit{m\,s^{-2}}$, which over a minute would push
it about a quarter of a metre sideways.[^foucault]

## A turning pixel feels a pseudo-tide

Put the pixel in the turning frame. Two free balls are at rest in it, at $\vect x$ and $\vect x + \vect\xi$, as in
section 1.4. We subtract equation [](#eq:turning) for the first ball from the same equation for the second. The true
forces give the tide of section 1.4, $-\curv{\tE}_{ij}\xi_j$. The balls are at rest at this instant, so the Coriolis
terms are zero, and the centrifugal accelerations differ by $\obs\Omega^2\vect\xi_\perp$, where $\vect\xi_\perp$ is
the part of the separation across the axis. With $\hat\Omega$ the unit vector along the axis, its $i$th component is
$(\delta_{ij} - \hat\Omega_i\hat\Omega_j)\xi_j$, the projector of section 1.1. So

$$\begin{aligned}
\ddot\xi_i = &-\curv{\tE}_{ij}\,\xi_j\\
&+ \obs\Omega^2\bigl(\delta_{ij} - \hat\Omega_i\hat\Omega_j\bigr)\xi_j .
\end{aligned}$$

Balls separated across the axis drift apart, and balls separated along it do not (Figure [](#fig:frame)): a stretch
across the axis, which by the sign rule of section 1.4 is a negative entry. Writing the extra term in the form of the
tide, $-\obs{\tE}^{\rm pseudo}_{ij}\xi_j$, gives

$$\boxed{\;\obs{\tE}^{\rm pseudo}_{ij} = -\obs\Omega^2\bigl(\delta_{ij} - \hat\Omega_i\hat\Omega_j\bigr).\;}$$

This is the **pseudo-tide**, an apparent tide that comes from the turning of the frame and not from any mass. Its
eigenvalues are $-\obs\Omega^2$ twice, across the axis, and 0 along it.

No arrangement of mass can make this table. Its trace is $-2\obs\Omega^2$, and the trace of a real tide is
$4\pi G\matter\rho$, zero in empty space (section 1.4). The pixel would have to sit in matter of density
$-\obs\Omega^2/2\pi G = -12.7\unit{kg\,m^{-3}}$ for the Earth's rate: a negative density, ten times the density of
air. When the balls move, the Coriolis term adds $-2\obs{\vect\Omega}\times\dot{\vect\xi}$, which turns the ring
rather than stretching it.

![Four free balls let go at rest on a turning table, seen from outside (left) and from the table (right); open
circles mark where the balls were let go, and filled balls where they are later. The painted arrow shows how far the
table has turned. From outside, the two balls off the axis move on straight lines while the table turns beneath them;
from the table they drift apart across the axis on curves, and the two balls on the axis stay where they are. The
orange arrows are each ball's initial acceleration as the turning observer measures it, $\obs\Omega^2\vect x_\perp$
away from the axis; their length is schematic.](tut-motion-frame){#fig:frame}

For the Earth's turning, $\obs\Omega^2 = (7.29 \times 10^{-5}\unit{s^{-1}})^2 = 5.3 \times 10^{-9}\unit{s^{-2}}$. That
is 31,000 times the Moon's tide at the Earth, $1.7 \times 10^{-13}\unit{s^{-2}}$, and 57 per cent of the person's
stretch at one metre, $9.3 \times 10^{-9}\unit{s^{-2}}$. A pixel that turned with the ground would read this stretch,
steady and across the Earth's axis, added to the tide of every scene.

::: try {#turning-pixel}
Predict first: seen from inside the turning frame, does the ring of free balls stretch along the axis of turning?
Twelve balls are let go at rest on a turning table, and the figure shows them from outside, where each moves in a
straight line, and from the turning frame. Press Play, then switch on the person's tide and compare the two sets of
eigenvalues and traces. Last, press the Earth's rate and read the pseudo-tide in $\mathrm{s^{-2}}$.
:::

## The pixel reads the tide in axes that gyroscopes hold still

The Earth's own tide, 330 times the person's, is steady and known from the Earth, so section 1.4 subtracts it. The
pseudo-tide is steady too, but it comes from the pixel's own turning, and a turning pixel could subtract it only by
measuring that turning to two parts in a thousand, with a gyroscope. So a pixel needs gyroscopes either way: to
measure its turning, or to hold its axes still, so that there is nothing to subtract and no Coriolis term. The camera
takes the second way: it reads the tide in axes that gyroscopes hold fixed relative to the stars, because only there
is the reading the tide of the masses alone.

**The idea to keep: forces inside a body cancel in pairs, so only outside forces change its momentum and only outside
torques its angular momentum. How a body turns holds $\int\matter\rho\,r^2\,\dd V$, a number its steady pull cannot
show, and a frame that turns feels a stretch $\obs\Omega^2$ across its axis that no mass could make, which is why the
pixel reads the tide in axes that gyroscopes hold still.**

::: problems
### Practice

**[1.6]** Why can no force inside a body move its centre of mass?

::: solution
The inner forces come in equal and opposite pairs, so they add to zero in $\matter M\ddot{\vect x}_{\rm cm}$.
:::

**[1.6]** Which has the larger moment of inertia about its centre, a uniform ball or a thin shell of the same mass and
radius, and by what factor?

::: solution
The shell, by $5/3$: $\tfrac23\matter MR^2$ against $\tfrac25\matter MR^2$.
:::

**[1.6]** A pixel turns with the Earth. Is the pseudo-tide it feels larger or smaller than the person's stretch at one
metre, and by how much?

::: solution
Smaller: $5.3 \times 10^{-9}\unit{s^{-2}}$ against $9.3 \times 10^{-9}\unit{s^{-2}}$, which is 0.57 of it.
:::

**[1.6]** Why can the pseudo-tide not be made by any arrangement of mass in empty space?

::: solution
Its trace is $-2\obs\Omega^2$, but the trace of a real tide is $4\pi G\matter\rho = 0$ in empty space.
:::

**[1.6]** The Earth's own tide is subtracted from every reading. Why does the camera not subtract the pseudo-tide too?

::: solution
It would need the pixel's own rate and axis of turning to about two parts in a thousand, which only a gyroscope
measures. Gyroscopes are needed either way, so they hold the pixel's axes still.
:::

**[1.6]** A round body of mass $\matter M$ and radius $R$ has a density that falls in a straight line from
$\matter\rho_0$ at the centre to zero at the surface, $\matter\rho = \matter\rho_0(1 - r/R)$. Find $I/\matter MR^2$,
and say whether this body gathers its mass toward the centre more or less than the Earth, with its 0.331.

::: solution
The mass is $4\pi\matter\rho_0R^3(\tfrac13 - \tfrac14) = \tfrac13\pi\matter\rho_0R^3$, and
$\int\matter\rho\,r^2\,\dd V = 4\pi\matter\rho_0R^5(\tfrac15 - \tfrac16) = \tfrac{2}{15}\pi\matter\rho_0R^5$. Their ratio
is $\tfrac25R^2$, and equation [](#eq:round) multiplies it by $\tfrac23$, so $I/\matter MR^2 = \tfrac4{15} = 0.267$:
less than the Earth's 0.331, so this body gathers its mass toward the centre more.
:::

**[1.6]** A uniform Earth with the same $J_2$ would have $C/\matter Ma^2 = 0.4$. How fast would its axis precess, by
the formula of this section, and how long would one turn take?

::: solution
Its $(C - A)/C$ is $J_2/0.4 = 2.71 \times 10^{-3}$, so
$\Omega_{\rm p} = (3 \times 0.9175/2 \times 7.292 \times 10^{-5}) \times 2.71 \times 10^{-3} \times 1.26 \times
10^{-13}\unit{s^{-1}} = 6.43 \times 10^{-12}\unit{s^{-1}}$, which is 41.9″ a year, one turn in 30,900 years. The
observed 50.3″ a year is a fifth faster, because the real Earth's mass is gathered toward its centre, which makes $C$
smaller for the same bulge.
:::

### Stretch

**[1.6]** A uniform ball of radius $a$ turns one way inside a shell of the same density that fills the rest of the
sphere out to $R$ and turns the other way at the same rate. Find $a$ for which the whole has no angular momentum, and
say what the pull outside is.

::: solution
A layer from $r_1$ to $r_2$ has $I = \tfrac{8\pi}{15}\matter\rho\,(r_2^5 - r_1^5)$, so the angular momenta cancel when
$a^5 = R^5 - a^5$: $a = 2^{-1/5}R = 0.871\,R$. The whole has uniform density, so it pulls outside as a point mass at
its centre, although all of it moves.
:::

**[1.6]** Earthquake waves show that the mantle's density rises with depth, from about 3400 at its top to about
$5600\unit{kg\,m^{-3}}$ at the core, because the rock above squeezes it. Let the mantle's density rise in a straight
line with depth, $\matter\rho_{\rm m}(r) = \matter\rho_{\rm t} + \Delta\,(R - r)/(R - R_{\rm c})$, with
$\Delta = 2200\unit{kg\,m^{-3}}$. Find the core's density $\matter\rho_{\rm c}$ and the density
$\matter\rho_{\rm t}$ at the top of the mantle from the mass and from $I/\matter MR^2 = 0.3307$, with
$q = R_{\rm c}/R = 0.5462$.

::: solution
With $x = r/R$, the two conditions of this section become $\matter\rho_{\rm c}q^3 + 3\int_q^1\matter\rho_{\rm m}x^2
\,\dd x = \matter{\bar\rho}$ and $\matter\rho_{\rm c}q^5 + 5\int_q^1\matter\rho_{\rm m}x^4\,\dd x =
(0.3307/0.4)\,\matter{\bar\rho}$. The rising part of the mantle, $\Delta(1 - x)/(1 - q)$, contributes
$3\int_q^1x^2(1 - x)\,\dd x/(1 - q) = (\tfrac14 - q^3 + \tfrac34q^4)/(1 - q) = 0.3389$ and
$5\int_q^1x^4(1 - x)\,\dd x/(1 - q) = (\tfrac16 - q^5 + \tfrac56q^6)/(1 - q) = 0.3089$, times $\Delta$. So

$$\begin{aligned}
0.1630\,\matter\rho_{\rm c} + 0.8370\,\matter\rho_{\rm t} &= 5513 - 0.3389 \times 2200 = 4767,\\
0.0486\,\matter\rho_{\rm c} + 0.9514\,\matter\rho_{\rm t} &= 4558 - 0.3089 \times 2200 = 3878,
\end{aligned}$$

in $\mathrm{kg\,m^{-3}}$. Solving gives $\matter\rho_{\rm c} = 11{,}300$ and $\matter\rho_{\rm t} = 3500$, so the
mantle runs from 3500 to $5700\unit{kg\,m^{-3}}$, close to what the earthquake waves find. With $\Delta = 0$ the
equations are those of the two-layer Earth, and the core is $12{,}500\unit{kg\,m^{-3}}$. A mantle denser at the
bottom puts more of the moment of inertia deep down, so less is left for the core, which comes out lighter, most of
the way to the $11{,}000\unit{kg\,m^{-3}}$ of the standard model. The rest lies in finer layering, of the mantle
and of the core itself, which two conditions cannot fix.
:::

### The camera

**[1.6]** A steel ball of radius $R$ holds a gold nugget of mass $\matter m$ at the distance $d = R/2$ from its centre.
Two other bodies have the same field outside as the nugget: its harmonic flush (a smooth density inside the ball) and
its skin (the nugget's mass spread over the surface). Their integrals $\int\matter\rho\,r^2\,\dd V$ for the gold are
$\matter md^2$, $\tfrac35\matter mR^2$ and $\matter mR^2$. Spun about an axis across the line to the nugget, the
gold's shares of the moment of inertia are $0.25$, $0.48$ and $0.75\,\matter mR^2$. Reproduce them from the split of
$I_x$. (The distance from an axis is $s$, as in this section.)

::: solution
With the nugget on the $z$ axis and the spin about $x$, $x = 0$ for the nugget, so the harmonic part is
$\int\matter\rho\,(r^2/3 - x^2)\,\dd V = \matter md^2/3 = \matter mR^2/12$, and the three bodies share it, because it
is fixed by the outside. The nugget's moment is $\tfrac23\matter md^2 + \matter md^2/3 = \matter md^2 = 0.25\,\matter
mR^2$. The flush has $\tfrac23 \times \tfrac35\matter mR^2 + \tfrac1{12}\matter mR^2 = 0.483\,\matter mR^2$, and the
skin $\tfrac23\matter mR^2 + \tfrac1{12}\matter mR^2 = 0.75\,\matter mR^2$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) requires that the pixel not rotate, gives the pseudo-tide, and reads
  $C/\matter MR^2$ from a pixel on the ground.
- [Section IV](/paper/#sec:near-field), *The magnetic picture*, compares the ball and the shell by their moments of
  inertia, and builds the counter-turning ball of the stretch problem; *What breaks the tie* splits $I_x$ and solves
  the two-layer Earth.
- [Section VIII](/paper/#sec:one-pixel), *Ten numbers*, reads the speed $(1 - C/\matter MR^2)\,\Omega R =
  311\unit{m\,s^{-1}}$ from a pixel on the equator.
- [Section XIII](/paper/#sec:second-order) finds that a ball and a shell gain energy from an impulsive tide in the
  ratio 3 : 5 of their $\int\matter\rho\,r^2\,\dd V$ (section 1.7).
:::

::: deeper
- The [GR course, section 0.5](https://neovand.github.io/general-relativity/chapter-0.html#0-5-the-mechanics-we-will-use)
  collects the mechanics used here, and its
  [lab on a cart and a spring](https://neovand.github.io/general-relativity/chapter-0.html#spring-energy-exchange)
  lets you watch kinetic and potential energy change places.
- The [GR course, section 5.1](https://neovand.github.io/general-relativity/chapter-5.html#5-1-ask-the-accelerometer-not-the-window)
  separates the accelerations an instrument feels from those that come from the choice of frame, and
  [section 16.9](https://neovand.github.io/general-relativity/chapter-16.html#16-9-gyroscopes-and-a-compact-experimental-map)
  shows how relativity makes a gyroscope's axis drift.
- Kleppner and Kolenkow, *An Introduction to Mechanics* (2nd ed., Cambridge, 2014), treat rigid bodies and
  non-inertial frames.
:::

[^p-pixel]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. II](/paper/#sec:pixel), which writes
    $C$ for this moment of inertia; [Sec. VIII](/paper/#sec:one-pixel) gives the numbers.

[^p-core]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. IV](/paper/#sec:near-field); its
    [figure of the Earth's glow](/paper/#fig:earth-glow) draws the kink.

[^p-split]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. IV](/paper/#sec:near-field), as its
    equation [](/paper/#eq:split).

[^iers]: The values of $J_2$ and of $(C - A)/C$ are those of the IERS Conventions (Petit and Luzum 2010, IERS
    Technical Note 36), from satellite orbits and from the theory of precession and nutation.

[^precession]: The rate of 5029″ a century is that of Capitaine, Wallace and Chapront (2003, *Astronomy and
    Astrophysics* 412, 567). Hipparchus found the precession about 130 BC, from the drift of the stars against the
    equinoxes.

[^dot]: A dot over a symbol is a derivative with respect to time, as in section 1.4.

[^gyro]: In general relativity a gyroscope's axis drifts slowly even with no torque on it, as the satellite Gravity
    Probe B measured; section
    [7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)
    states the drift.



[^s]: The distance from the axis is given by $s^2 = r^2 - (\hat u\cdot\vect x)^2$, so
    $\hat u_i(r^2\delta_{ij} - x_ix_j)\hat u_j = s^2$.

[^colour]: The frame's angular velocity and the pseudo-tide below take the observer's colour, because they come from
    the observer's frame and not from any mass; the spin of a body stays plain.

[^foucault]: A Foucault pendulum shows the Coriolis acceleration: its plane of swing turns once in
    $23.93\unit{h}/\sin\lambda$ at the latitude $\lambda$, 33.8 h at 45°.
