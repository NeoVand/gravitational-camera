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
inside a lighter mantle. By the shell theorem of chapter 1.3, the two pull alike on everything outside them, at
every distance and at any sensitivity. Set them spinning at the same rate, though, and they differ. The planet with the
core is easier to set turning, and when it turns it carries less angular momentum.

The paper's [Section II](/paper/#sec:pixel) uses this difference. A pixel on the ground of the turning Earth reads a
small part of the tide whose size depends on how the Earth's mass is spread from the centre outward. That size
depends on one number, which this chapter defines, and which in the paper's words "tells a planet with a core from
one without". Earlier, Section II adds a warning: the pixel itself must not turn. This chapter asks what the way a
planet turns reveals that its pull hides, and why the pixel that reads it must not turn. The answer needs the parts of
Newton's mechanics that go beyond his law of gravity.

::: plain
Forces inside a body come in equal and opposite pairs, so they cannot move the body as a whole. A body that nothing
outside pushes or pulls keeps its momentum, and one that nothing twists keeps its angular momentum, the amount of
turning it carries.

How hard it is to set a body spinning depends on how far its mass lies from the axis. A hollow ball is harder to spin
than a solid ball of the same mass and size, by a factor of five thirds, although the two pull identically on
everything outside them. So the way a planet spins shows something about its inside that its pull can never show:
whether its mass is gathered toward the centre.

A room that turns, such as a laboratory on the turning Earth, adds two false accelerations to everything in it. One
pushes things away from the axis, and the other pushes moving things sideways. The first one stretches a ring of free
balls across the axis, as a real tide would. For the Earth's turning this false tide is about half the tide of a
person standing one metre away. Removing it needs gyroscopes, so the paper uses them to hold its pixel still.
:::

## Force changes momentum, and forces inside a body cancel

The **momentum** of a body of mass $\matter m$ moving with velocity $\vect v$, in metres per second, is
$\sym{momentum}{\vect p} = \matter m\vect v$, measured in kilogram metres per second. Newton's second law (chapter
1.2) says that a **force** $\sym{force}{\vect F}$, in newtons, gives the body the acceleration $\vect F/\matter m$.
For a body whose mass does not change, this says that the force is the rate of change of the momentum:

$$\vect F = \frac{\dd\vect p}{\dd t}.$$

**Newton's third law** says that when two bodies act on each other, the force of the first on the second is equal in
size and opposite in direction to the force of the second on the first. The Earth pulls a person of 70 kg down with
687 N, and the person pulls the Earth up with 687 N.

Now take a body made of many parts, labelled by $a = 1, 2, \dots$, with masses $\matter m_a$ and positions $\vect x_a$.
Each part feels outside forces, whose sum on part $a$ we call $\vect F_a^{\rm out}$, and a force $\vect F_{ab}$ from
each other part $b$. We add the second law over all the parts. The total momentum $\vect P = \sum_a \vect p_a$ changes
at the rate

$$\frac{\dd\vect P}{\dd t} = \sum_a \vect F_a^{\rm out} + \sum_a\sum_{b \ne a}\vect F_{ab}.$$

The double sum contains every pair twice, once as $\vect F_{ab}$ and once as $\vect F_{ba}$, and by the third law
each pair adds to zero. So only the outside forces change the total momentum.

The **centre of mass** of the body is the average of the positions of its parts, each weighted by its mass:

$$\sym{centre-of-mass}{\vect x_{\rm cm}} = \frac{1}{\matter M}\sum_a \matter m_a\vect x_a, \qquad \matter M = \sum_a \matter m_a .$$

We differentiate once with respect to time, which gives $\matter M\dot{\vect x}_{\rm cm} = \sum_a \matter m_a\vect v_a
= \vect P$, and once more, using the last result:[^dot]

$$\boxed{\;\matter M\,\ddot{\vect x}_{\rm cm} = \sum_a \vect F_a^{\rm out}.\;}$$

The centre of mass moves as one particle that carries the whole mass and feels only the outside forces. No force
inside a body can move it (Figure [](#fig:parts)). A body with no outside force on it keeps its total momentum, which
is the **conservation of momentum**.

![A body of five parts joined by springs, drawn at three equal intervals of time. At the first, each spring pulls on
its two parts with forces of equal size in opposite directions, such as $\vect F_{ab}$ and $\vect F_{ba}$; the parts
then move on wavy paths, while the centre of mass, the quartered circle, moves along the dotted straight line by equal
steps. The masses, the springs and the scale of the arrows are chosen for the drawing, and the motion is
computed from them.](tut-motion-parts){#fig:parts}

## Work changes kinetic energy, and a steady field keeps the energy fixed

Chapter 1.2 defined the **kinetic energy**, the energy of motion, $\sym{kinetic-energy}{K} = \tfrac12\matter m v^2$ in
joules, and the **work** that a force does, $\vect F\cdot\dd\vect x$ along a small step $\dd\vect x$. We differentiate
$K$ with respect to time and use the second law, $\matter m\,\dd\vect v/\dd t = \vect F$:

$$\frac{\dd K}{\dd t} = \matter m\,\vect v\cdot\frac{\dd\vect v}{\dd t} = \vect F\cdot\vect v .$$

In a time $\dd t$ the body moves by $\dd\vect x = \vect v\,\dd t$, so the work done in that time is the change of
kinetic energy.

Now let gravity be the only force, $\vect F = -\matter m\nabla\field\Phi$, where $\field\Phi$ is the gravitational
potential of chapter 1.2, in joules per kilogram. We assume that **the field is steady**: the masses that make
$\field\Phi$ do not move, so $\field\Phi$ depends on the place but not on the time. Along the body's path,
$\field\Phi(\vect x(t))$ then changes at the rate $\nabla\field\Phi\cdot\vect v$, by the chain rule, and

$$\frac{\dd}{\dd t}\bigl(K + \matter m\field\Phi\bigr) = \vect F\cdot\vect v + \matter m\,\nabla\field\Phi\cdot\vect v = 0 .$$

So $K + \matter m\field\Phi$ stays the same for one body in a steady field. That is the **conservation of energy**. A
ball dropped from rest falls through $9.8\unit{J\,kg^{-1}}$ of potential in its first metre, so it reaches
$\sqrt{2 \times 9.8}\unit{m\,s^{-1}} = 4.4\unit{m\,s^{-1}}$. If the sources moved, a body could gain energy, as a
spacecraft does when it swings past a moving planet.

An isolated system of many parts needs more, because the two parts of a pair can move differently, so the pair can
do work: friction turns kinetic energy into heat. Its total energy is kept when every inner force, down to the forces
between atoms, comes from a potential energy that depends only on the places of the parts, as gravity's
$-G\matter m_a\matter m_b/|\vect x_a - \vect x_b|$ does. Chapter 1.7 gives the general rule.

The **impulse** of a force, $\sym{impulse}{\vect J} = \int\vect F\,\dd t$ in newton seconds, is the change of
momentum it gives, by the second law. Chapter 1.7 works out the energy that a short, sudden kick gives, which the
paper's Section XIII needs.

## Angular momentum stays fixed when the force points at a centre

The **angular momentum** of a body about the origin is

$$\sym{angular-momentum}{\vect L} = \vect x\times\vect p,$$

where $\times$ is the cross product of chapter 1.1. Its unit is $\mathrm{kg\,m^2\,s^{-1}}$. The **torque** of a force
about the origin is $\vect x\times\vect F$, in newton metres; it measures how strongly the force twists the body about
the origin. We differentiate $\vect L$ with the product rule:

$$\begin{aligned}
\frac{\dd\vect L}{\dd t} &= \dot{\vect x}\times\vect p + \vect x\times\dot{\vect p}\\
&= \vect v\times\matter m\vect v + \vect x\times\vect F.
\end{aligned}$$

The cross product of a vector with itself is zero, so the first term vanishes, and

$$\boxed{\;\frac{\dd\vect L}{\dd t} = \vect x\times\vect F.\;}$$

A **central force** points along the line from the body to the origin, toward it or away from it. The pull of a mass
fixed at the origin is one. Then $\vect F$ is parallel to $\vect x$, the torque is zero, and $\vect L$ is fixed. The
body then stays in the plane at right angles to $\vect L$, because $\vect x\cdot(\vect x\times\vect p) = 0$, and
chapter 1.8 uses this for orbits.

For a body of many parts we add the angular momenta of the parts. Here we need more than the third law, which says
only that the two forces of a pair are equal and opposite. We assume that **the inner forces are central**: the two
forces of each pair act along the line joining the two parts, as gravity and the pull of a stretched string do. The
torques of each pair then add to $(\vect x_a - \vect x_b)\times\vect F_{ab}$, which is zero because the force is
parallel to $\vect x_a - \vect x_b$. So only outside torques change the total angular momentum, and a body that nothing
twists keeps its angular momentum, fixed in size and direction. That is the **conservation of angular momentum**.

A **gyroscope** is a wheel spun fast about its axis of symmetry and mounted on bearings that twist it as little as
possible. Its angular momentum lies along its axis, so the axis keeps its direction relative to the distant stars,
however the mount around it is turned. That is the property the paper's pixel needs at the end of this
chapter.[^gyro]

## A turning body keeps the spread of its mass in a table of inertia

A **rigid body** is one whose parts keep their distances from one another. We let it turn about its centre of mass,
which we take as the origin, with the **angular velocity** $\sym{angular-velocity}{\vect\Omega}$ of chapter 1.1, a
vector along the axis whose length is the angle turned per second, in radians per second. Chapter 1.1 showed that each
point then moves with velocity $\vect v = \vect\Omega\times\vect x$ (Figure [](#fig:spin)).

![A slab turning about a vertical axis with the angular velocity $\vect\Omega$. Each marked point moves on a circle
about the axis, and its velocity $\vect v = \vect\Omega\times\vect x$ points along that circle, with a length in
proportion to the point's distance from the axis; the point on the axis does not move. The slab's shape and the scale
of the arrows are chosen for the drawing.](tut-motion-spin){#fig:spin}

We want the angular momentum of the turning body. For one part of mass $\matter m$ it is
$\matter m\,\vect x\times(\vect\Omega\times\vect x)$. Chapter 1.1 proved the rule
$\vect a\times(\vect b\times\vect c) = \vect b\,(\vect a\cdot\vect c) - \vect c\,(\vect a\cdot\vect b)$. With
$\vect a = \vect c = \vect x$ and $\vect b = \vect\Omega$ it gives

$$\vect x\times(\vect\Omega\times\vect x) = \vect\Omega\,r^2 - \vect x\,(\vect x\cdot\vect\Omega),$$

where $r = |\vect x|$. In components, the $i$th entry is $\Omega_i r^2 - x_ix_j\Omega_j$, which is
$(r^2\delta_{ij} - x_ix_j)\Omega_j$ because $\delta_{ij}\Omega_j = \Omega_i$. We add over all the parts, as an integral
over the volume with the density $\matter\rho$ of chapter 1.3, in kilograms per cubic metre, and find
$L_i = I_{ij}\Omega_j$ with

$$\boxed{\;\sym{inertia-tensor}{I_{ij}} = \int\matter\rho\,\bigl(r^2\delta_{ij} - x_ix_j\bigr)\,\dd V.\;} \label{eq:inertia}$$

This table is the **inertia tensor**, measured in $\mathrm{kg\,m^2}$.[^letters] It depends only on how the mass is
spread, not on how fast the body turns. It is symmetric, $I_{ij} = I_{ji}$, so it has three perpendicular
eigenvectors with real eigenvalues.[^eigen] These are the **principal axes** of the body. When a body spins about a
principal axis, its angular momentum lies along that axis. About any other axis, $\vect L$ and $\vect\Omega$ point in
different directions.

Now let the body turn about a single axis along the unit vector $\hat u$, at the rate $\Omega$. A point at the
distance $s$ from the axis moves on a circle at the speed $\Omega s$, so the kinetic energy is
$\tfrac12\int\matter\rho\,\Omega^2s^2\,\dd V$, and

$$K = \tfrac12 I\Omega^2, \qquad \sym{moment-of-inertia}{I} = \int\matter\rho\,s^2\,\dd V = \hat u_iI_{ij}\hat u_j .$$

This number is the **moment of inertia** about the axis, the measure chapter 1.3 named: how hard it is to set a body
spinning.[^s] It plays the part that the mass plays in $\tfrac12\matter mv^2$.

### A round body has the same moment about every axis

We want $I_{ij}$ for a **spherically symmetric** body, one whose density depends only on the distance from the centre.
The part of equation [](#eq:inertia) that needs work is the table $\int\matter\rho\,x_ix_j\,\dd V$, and symmetry fixes it.
Reflecting the body in the plane $x = 0$ leaves it unchanged but reverses the sign of $xy$, so
$\int\matter\rho\,xy\,\dd V = -\int\matter\rho\,xy\,\dd V = 0$, and every entry off the diagonal is zero. Turning the
body so that any one axis goes to any other also leaves it unchanged, so the three diagonal entries are equal. They
add up to $\int\matter\rho\,r^2\,\dd V$, so each is a third of it:

$$\int\matter\rho\,x_ix_j\,\dd V = \tfrac13\,\delta_{ij}\int\matter\rho\,r^2\,\dd V .$$

We put this into equation [](#eq:inertia), where it subtracts a third from the first term:

$$\boxed{\;I_{ij} = I\,\delta_{ij}, \qquad I = \frac23\int\matter\rho\,r^2\,\dd V.\;} \label{eq:round}$$

Every axis through the centre is a principal axis, and the moment is the same about all of them. For a uniform ball
of radius $R$ we take thin shells of radius $r$ and volume $4\pi r^2\,\dd r$, so that
$\int\matter\rho\,r^2\,\dd V = 4\pi\matter\rho\int_0^R r^4\,\dd r = \tfrac45\pi\matter\rho R^5$. The mass is
$\matter M = \tfrac43\pi\matter\rho R^3$, so this is $\tfrac35\matter MR^2$, and

$$I_{\rm ball} = \tfrac25\,\matter MR^2 .$$

For a thin shell of radius $R$ all the mass lies at $r = R$, so $\int\matter\rho\,r^2\,\dd V = \matter MR^2$ and
$I_{\rm shell} = \tfrac23\matter MR^2$. The shell's moment is larger by the factor $5/3$, although the two have the
same mass and, by the shell theorem, the same field outside. A point mass at the centre is the other limit, with
$I = 0$. A round body of mass $\matter M$ and radius $R$ therefore has a **moment-of-inertia factor** $I/\matter MR^2$
between 0 and $\tfrac23$, and the smaller it is, the more of the mass lies near the centre.

The real Earth has $I/\matter MR^2 = 0.3307$, which the paper rounds to 0.331. With
$\matter M = 5.97 \times 10^{24}\unit{kg}$ and $R = 6371\unit{km}$, its moment of inertia is
$8.0 \times 10^{37}\unit{kg\,m^2}$. Turning at $\Omega = 7.29 \times 10^{-5}\unit{s^{-1}}$, it carries the angular
momentum $I\Omega = 5.8 \times 10^{33}\unit{kg\,m^2\,s^{-1}}$, 17 per cent less than a uniform Earth turning at the same
rate.

::: try {#shell-theorem}
Predict first: which has the larger moment of inertia, a uniform ball or a thin shell of the same mass and radius,
and by what factor? Press the buttons Ball and Shell in turn and read the moment of inertia in the last readout. Then
press Ball and drag the slider to the left, which gathers the mass toward the centre: the moment falls past the
Earth's $0.331\,\matter MR^2$, and the pull at $2R$ does not change. The two predictions at the top of the figure
belong to chapter 1.3.
:::

## The moment of inertia tells a cored planet from a uniform one

Chapter 1.3 built two Earths that no reading of the steady field outside can tell apart. The first is a uniform ball of
density $5513\unit{kg\,m^{-3}}$. The second has a core of radius $R_{\rm c} = 3480\unit{km}$ and density
$\matter\rho_{\rm c}$ inside a mantle of density $\matter\rho_{\rm m}$ (Figure [](#fig:earths)). We now find the two
densities from what the outside of the Earth and its turning tell us: the mass and the moment of inertia. The radius of
the core comes from a third channel, the glow of heat, the faint gravitational waves that the warm interior gives off.
Seen from the ground, its brightness has a kink, a sudden change of slope, at the direction whose line of sight grazes
the core, 33° from straight down (the paper's [Section IV](/paper/#sec:near-field) and Figure
[](/paper/#fig:earth-glow)).

![The two Earths of chapter 1.3, cut through the centre and drawn to scale: on the left, a core of radius 3480 km
inside a mantle out to 6371 km, with the densities that this section finds; on the right, the uniform Earth. The
arrows outside are the pull, the same for both at every distance. The stone and the metal are pictures, and their
shades show only which layer is denser.](tut-motion-earths){#fig:earths}

We write $q = R_{\rm c}/R = 0.5462$ and $\matter{\bar\rho} = 5513\unit{kg\,m^{-3}}$ for the mean density. The mass is
$\tfrac43\pi$ times $\matter\rho_{\rm c}R_{\rm c}^3 + \matter\rho_{\rm m}(R^3 - R_{\rm c}^3)$, and it must equal
$\tfrac43\pi R^3\matter{\bar\rho}$. The integral $\int\matter\rho\,r^2\,\dd V$ is $\tfrac45\pi$ times
$\matter\rho_{\rm c}R_{\rm c}^5 + \matter\rho_{\rm m}(R^5 - R_{\rm c}^5)$, by the shells of the last section, and by equation
[](#eq:round) two thirds of it must be $0.3307\,\matter MR^2$. We divide the first condition by
$\tfrac43\pi R^3$ and the second by $\tfrac{8\pi}{15}R^5$:

$$\begin{aligned}
\matter\rho_{\rm c}\,q^3 + \matter\rho_{\rm m}\,(1 - q^3) &= \matter{\bar\rho},\\
\matter\rho_{\rm c}\,q^5 + \matter\rho_{\rm m}\,(1 - q^5) &= \frac{0.3307}{0.4}\,\matter{\bar\rho}.
\end{aligned}$$

With $q^3 = 0.1630$ and $q^5 = 0.0486$, and right-hand sides of
5513 and $4558\unit{kg\,m^{-3}}$, they give

$$\boxed{\;\matter\rho_{\rm c} = 12{,}500\unit{kg\,m^{-3}}, \qquad \matter\rho_{\rm m} = 4150\unit{kg\,m^{-3}},\;}$$

the paper's numbers.[^round] A check: with 0.4 in place of 0.3307, both right-hand sides equal $\matter{\bar\rho}$, and
the solution is the uniform ball. The standard model of the Earth's interior, built from earthquake waves, puts the
core's average near $11{,}000\unit{kg\,m^{-3}}$. The difference comes from the mantle, which its own weight squeezes
denser with depth, and two numbers cannot describe that.

The outside cannot see $\int\matter\rho\,r^2\,\dd V$, and the reason has a precise form. A function $h$ with
$\nabla^2h = 0$ satisfies Laplace's equation of chapter 1.3, and it is called **harmonic**. The potential at a point
$\vect y$ outside the body is $-G\int\matter\rho(\vect x)/|\vect y - \vect x|\,\dd V$. As a function of $\vect x$,
$1/|\vect y - \vect x|$ is the potential of a point at $\vect y$ up to a constant factor, which chapter 1.3 showed is
harmonic away from $\vect y$. So the field outside is built only from integrals $\int\matter\rho\,h\,\dd V$ with $h$
harmonic. The reverse also holds, and we state it without proof: bodies with the same field outside share these
integrals for every harmonic $h$ (chapters 2.3 and 2.5, and the paper's equation [](/paper/#eq:split)). The function
$r^2$ is not harmonic, because $\nabla^2 r^2 = 6$, and the ball and the shell show what that means: their integrals of
$r^2$ differ, and their outsides agree.

The paper splits the moment of inertia into a part the outside sees and a part it cannot. About the $x$ axis the
distance from the axis is given by $s^2 = y^2 + z^2 = r^2 - x^2$, and we write this as two thirds of $r^2$ plus the rest:

$$\begin{aligned}
I_x &= \int\matter\rho\,(r^2 - x^2)\,\dd V\\
&= \frac23\int\matter\rho\,r^2\,\dd V + \int\matter\rho\,\Bigl(\frac{r^2}{3} - x^2\Bigr)\,\dd V .
\end{aligned}$$

The second integrand is harmonic, because $\nabla^2(r^2/3) = 2$ and $\nabla^2x^2 = 2$. So the second integral is fixed
by the outside and shared by all bodies with the same outside field, and only the first part can differ. For a round
body the second part is zero, by the symmetry argument above. Spin a body at a known rate, and its angular momentum
gives $I$, and with it the hidden $\int\matter\rho\,r^2\,\dd V$.

The paper's Section II reads $I$ from the small magnetic part of the tide, a second kind of tide made by moving masses,
which chapter [7.5](/tutorial/geometry/gravitomagnetism/#the-earths-magnetic-part-weighs-its-core) derives. A pixel at
rest on the equator moves with the ground at $\Omega R = 465\unit{m\,s^{-1}}$ through the field of a planet that is
itself spinning. The pixel's motion and the planet's spin each make a magnetic part, and the two have opposite signs.
With $c$ the speed of light, their sum has the size

$$\frac{3G\matter M\Omega}{cR^2}\Bigl(1 - \frac{I}{\matter MR^2}\Bigr) = 4.8 \times 10^{-12}\unit{s^{-2}},$$

where the pixel's motion gives the 1 and the planet's spin gives $I/\matter MR^2$. It is about a two-thousandth of
the person's tide at a metre. The mass, the rate and the radius are known, so one pixel on the ground reads
$I/\matter MR^2$.

## In a turning frame, two extra accelerations appear

A **frame** is a set of axes and clocks against which positions and times are measured (chapter 1.2). A frame is
**inertial** when a body that nothing pushes or pulls keeps its speed and its direction in it. In this section gravity
counts as one of the forces, as in Newton's mechanics. A **turning frame** is one whose axes turn at a steady angular
velocity $\obs{\vect\Omega}$ relative to an inertial frame. A laboratory on the ground is one, turning with the
Earth.[^colour]

We want the acceleration that an observer in the turning frame measures. Let $\vect e'_1$, $\vect e'_2$ and
$\vect e'_3$ be the turning axes. Each is an arrow fixed in the frame, and by chapter 1.1 an arrow turned by the small
angle $\obs{\vect\Omega}\,\dd t$ changes by $(\obs{\vect\Omega}\,\dd t)\times\vect e'_i$, so

$$\frac{\dd\vect e'_i}{\dd t} = \obs{\vect\Omega}\times\vect e'_i .$$

A vector $\vect A = A'_i\vect e'_i$ has components $A'_i$ in the turning axes. Its rate of change in the inertial frame
follows from the product rule:

$$\begin{aligned}
\frac{\dd\vect A}{\dd t} &= \frac{\dd A'_i}{\dd t}\,\vect e'_i + A'_i\,\obs{\vect\Omega}\times\vect e'_i\\
&= \Bigl(\frac{\dd\vect A}{\dd t}\Bigr)_{\rm turn} + \obs{\vect\Omega}\times\vect A .
\end{aligned}$$

The first term is the rate the turning observer measures, because that observer sees the axes as fixed. We apply this
rule to the position $\vect x$. Its rate of change in the turning frame is the velocity $\vect v$ measured there, so the
velocity in the inertial frame is

$$\vect v_{\rm in} = \vect v + \obs{\vect\Omega}\times\vect x .$$

We apply the rule again, now to $\vect v_{\rm in}$, with $\obs{\vect\Omega}$ constant. In the turning frame $\vect v$
changes at the rate $\vect a$, the acceleration measured there, and $\vect x$ changes at the rate $\vect v$, so the
first term of the rule is $\vect a + \obs{\vect\Omega}\times\vect v$. The second term is
$\obs{\vect\Omega}\times\vect v_{\rm in}$. Together they give the inertial acceleration,

$$\vect a_{\rm in} = \bigl(\vect a + \obs{\vect\Omega}\times\vect v\bigr) + \obs{\vect\Omega}\times\bigl(\vect v + \obs{\vect\Omega}\times\vect x\bigr).$$

We collect the two terms in $\obs{\vect\Omega}\times\vect v$ and solve for $\vect a$:

$$\boxed{\;\vect a = \vect a_{\rm in} - 2\,\obs{\vect\Omega}\times\vect v - \obs{\vect\Omega}\times\bigl(\obs{\vect\Omega}\times\vect x\bigr).\;} \label{eq:turning}$$

Here $\vect a_{\rm in} = \vect F/\matter m$ is the acceleration that the true forces give. The term
$-2\obs{\vect\Omega}\times\vect v$ is the **Coriolis acceleration**. It acts only on a body that moves in the turning
frame, and it pushes the body sideways, at right angles to its velocity. The last term is the **centrifugal
acceleration**. By the rule of chapter 1.1 for a cross product inside a cross product,

$$\begin{aligned}
-\obs{\vect\Omega}\times\bigl(\obs{\vect\Omega}\times\vect x\bigr) &= \obs\Omega^2\,\vect x - \obs{\vect\Omega}\,(\obs{\vect\Omega}\cdot\vect x)\\
&= \obs\Omega^2\,\vect x_\perp ,
\end{aligned}$$

where $\vect x_\perp$ is the part of $\vect x$ at right angles to the axis. The centrifugal acceleration points straight
away from the axis and grows with the distance from it. The units agree, since $\mathrm{s^{-2}}$ times metres and
$\mathrm{s^{-1}}$ times metres per second are both $\mathrm{m\,s^{-2}}$. In the limit $\obs{\vect\Omega} \to 0$ both
extra terms vanish, and a body at rest on the axis feels neither.

::: gap
The derivation assumed that the frame turns at a steady rate about a fixed origin. If $\obs{\vect\Omega}$ changes in
time, differentiating $\obs{\vect\Omega}\times\vect x$ adds a third term, $-\dot{\obs{\vect\Omega}}\times\vect x$, the
Euler acceleration. If the origin itself accelerates, every body in the frame feels that acceleration with its sign
reversed; a frame that falls freely, as in chapter 1.4, cancels gravity in this way.
:::

On the equator, at the distance $s = 6378\unit{km}$ from the axis (the Earth is a little wider there than its mean
radius), the centrifugal acceleration is
$\obs\Omega^2 s = (7.29 \times 10^{-5})^2 \times 6.378 \times 10^6\unit{m\,s^{-2}} = 0.034\unit{m\,s^{-2}}$,
0.35 per cent of the $9.8\unit{m\,s^{-2}}$ of gravity. A body moving at $1\unit{m\,s^{-1}}$ at right angles to the axis
feels a Coriolis acceleration of $2\obs\Omega v = 1.5 \times 10^{-4}\unit{m\,s^{-2}}$, which over a minute would push
it about a quarter of a metre sideways.[^foucault]

## A turning pixel feels a pseudo-tide

We now put the paper's pixel in the turning frame. Two free balls are at rest in it, at $\vect x$ and
$\vect x + \vect\xi$, where $\vect\xi$ is their separation, as in chapter 1.4. We want their relative acceleration, as
the turning observer measures it. We subtract equation [](#eq:turning) for the first ball from the same equation for
the second. The true forces give the tide of chapter 1.4, $-\curv{\tE}_{ij}\xi_j$, where $\curv{\tE}_{ij}$ is the tidal
tensor in $\mathrm{s^{-2}}$. The balls are at rest at this instant, so the Coriolis terms are zero. The centrifugal
accelerations differ by $\obs\Omega^2\vect\xi_\perp$, where $\vect\xi_\perp$ is the part of the separation across the
axis. With $\hat\Omega$ the unit vector along the axis, the $i$th component of $\vect\xi_\perp$ is
$(\delta_{ij} - \hat\Omega_i\hat\Omega_j)\xi_j$, where the table in brackets is the projector of chapter 1.1. So

$$\begin{aligned}
\ddot\xi_i = &-\curv{\tE}_{ij}\,\xi_j\\
&+ \obs\Omega^2\bigl(\delta_{ij} - \hat\Omega_i\hat\Omega_j\bigr)\xi_j .
\end{aligned}$$

Two balls separated across the axis drift apart, and two balls separated along it do not (Figure [](#fig:frame)).
That is a stretch across the axis, and by the sign rule of chapter 1.4 a stretch is a negative entry. We write the
extra term in the same form as the tide, $-\obs{\tE}^{\rm pseudo}_{ij}\xi_j$, which gives

$$\boxed{\;\obs{\tE}^{\rm pseudo}_{ij} = -\obs\Omega^2\bigl(\delta_{ij} - \hat\Omega_i\hat\Omega_j\bigr).\;}$$

This is the **pseudo-tide** of chapter 1.4: an apparent tide that comes from the turning of the frame, not from any
mass. Its eigenvalues are $-\obs\Omega^2$ twice, for the two directions across the axis, and 0 along it.

No arrangement of mass can make this table. Its trace is $-2\obs\Omega^2$, and chapter 1.3 showed that the trace of a
real tide is $4\pi G\matter\rho$, which is zero in empty space. To make the pseudo-tide, the pixel would have to sit in
matter of density $-\obs\Omega^2/2\pi G$, which for the Earth's rate is $-12.7\unit{kg\,m^{-3}}$: a negative density, ten
times as large as the density of air. When the balls move, the Coriolis term adds
$-2\obs{\vect\Omega}\times\dot{\vect\xi}$, which turns the ring rather than stretching it.

![Four free balls let go at rest on a turning table, seen from outside (left) and from the table (right); the painted
arrow shows how far the table has turned. From outside, the two balls on either side of the axis move on straight
lines while the table turns beneath them, and from the table the same two balls drift apart across the axis on
curves, while the two balls on the axis stay where they are. The orange arrows are the acceleration of each ball at the
start, as the turning observer measures it, $\obs\Omega^2\vect x_\perp$ away from the axis; their length is
schematic.](tut-motion-frame){#fig:frame}

For the Earth's turning, $\obs\Omega^2 = (7.29 \times 10^{-5}\unit{s^{-1}})^2 = 5.3 \times 10^{-9}\unit{s^{-2}}$. That
is 31,000 times the Moon's tide at the Earth, $1.7 \times 10^{-13}\unit{s^{-2}}$, and 57 per cent of the person's
stretch at one metre, $9.3 \times 10^{-9}\unit{s^{-2}}$. A pixel that turned with the ground would read this stretch, steady and across the Earth's axis, added to
the tide of every scene.

::: try {#turning-pixel}
Predict first: seen from inside the turning frame, does the ring of free balls stretch along the axis of turning?
The figure lets twelve balls go at rest on a turning table and shows them from outside, where each moves in a straight
line, and from the turning frame. Press Play and watch the side view. Then switch on the person's tide and compare the
two sets of eigenvalues and their traces. Last, press the Earth's rate and read the pseudo-tide in $\mathrm{s^{-2}}$.
:::

## The pixel reads the tide in axes that gyroscopes hold still

Chapter 1.4 subtracted the Earth's own tide, 330 times the person's, because it is steady and known from the Earth.
The pseudo-tide is steady too, but it comes from the pixel's own turning, not from any scene. A turning pixel could
subtract it only by measuring its own turning, to two parts in a thousand for the best laboratory instrument, which
resolves $2 \times 10^{-11}\unit{s^{-2}}$ in a second (the paper's Section II). The instrument that measures turning
is a gyroscope.

So a pixel needs gyroscopes either way: to measure its turning, or to hold its axes still, so that there is nothing to
subtract and no Coriolis term. The paper takes the second way. That is what "must not turn" means: the pixel reads the
tide in axes that gyroscopes hold fixed relative to the stars, because only there is the reading the tide of the
masses alone.

::: check
### Q

Why can no force inside a body move its centre of mass?

### A

The inner forces come in pairs that are equal and opposite, by Newton's third law, so they add to zero in the total
momentum. The centre of mass moves as $\matter M\ddot{\vect x}_{\rm cm} = \sum\vect F^{\rm out}$, and only outside
forces appear there.

### Q

Which has the larger moment of inertia about its centre, a uniform ball or a thin shell of the same mass and radius,
and by what factor?

### A

The shell, by $5/3$: $\tfrac23\matter MR^2$ against $\tfrac25\matter MR^2$. All of the shell's mass lies at the
largest distance $R$, so its $\int\matter\rho\,r^2\,\dd V$ is $\matter MR^2$, against $\tfrac35\matter MR^2$ for the
ball.

### Q

A pixel turns with the Earth. Is the pseudo-tide it feels larger or smaller than the person's stretch at one metre,
and by how much?

### A

Smaller: $5.3 \times 10^{-9}\unit{s^{-2}}$ against $9.3 \times 10^{-9}\unit{s^{-2}}$, which is 0.57 of it.

### Q

Why can the pseudo-tide not be made by any arrangement of mass in empty space?

### A

Its trace is $-2\obs\Omega^2$. The trace of a real tide is $4\pi G\matter\rho$, which is zero in empty space, and it
could equal $-2\obs\Omega^2$ only inside matter of negative density.

### Q

The Earth's own tide is subtracted from every reading. Why does the paper not subtract the pseudo-tide in the same way?

### A

It could be, but only by a pixel that knows its own rate and axis of turning to about two parts in a thousand, and
the instrument that measures turning is a gyroscope. The Earth's tide is known from the Earth; the pseudo-tide depends
only on how the pixel turns. Since gyroscopes are needed either way, the paper uses them to hold the pixel's axes
still.
:::

**The idea to keep: forces inside a body cancel in pairs, so only outside forces change its momentum and only outside
torques its angular momentum. How a body turns holds $\int\matter\rho\,r^2\,\dd V$, a number its steady pull cannot
show, and a frame that turns feels a stretch $\obs\Omega^2$ across its axis that no mass could make, which is why the
paper's pixel reads the tide in axes that gyroscopes hold still.**

::: problems
### Practice

A round body of mass $\matter M$ and radius $R$ has a density that falls in a straight line from $\matter\rho_0$ at
the centre to zero at the surface, $\matter\rho = \matter\rho_0(1 - r/R)$. Find $I/\matter MR^2$, and say whether this
body gathers its mass toward the centre more or less than the Earth, with its 0.331.

::: solution
The mass is $\int_0^R\matter\rho_0(1 - r/R)\,4\pi r^2\,\dd r = 4\pi\matter\rho_0R^3(\tfrac13 - \tfrac14) =
\tfrac13\pi\matter\rho_0R^3$, and $\int\matter\rho\,r^2\,\dd V = 4\pi\matter\rho_0R^5(\tfrac15 - \tfrac16) =
\tfrac{2}{15}\pi\matter\rho_0R^5$. Their ratio is $\tfrac25R^2$, and equation [](#eq:round) multiplies it by
$\tfrac23$, so $I/\matter MR^2 = \tfrac4{15} = 0.267$. That is less than the Earth's 0.331, so this body gathers its
mass toward the centre more than the Earth does. A check on the method: for a uniform density the same steps give
$\tfrac23 \times \tfrac35 = \tfrac25$.
:::

### Stretch

A uniform ball of radius $a$ turns one way inside a shell of the same density that fills the rest of the sphere out to
$R$ and turns the other way at the same rate. Find $a$ for which the whole has no angular momentum, and say what the
pull outside is.

::: solution
By equation [](#eq:round) and the shells of the uniform ball, a layer from $r_1$ to $r_2$ has
$I = \tfrac{8\pi}{15}\matter\rho\,(r_2^5 - r_1^5)$. The two angular momenta cancel when $a^5 = R^5 - a^5$, so
$a = 2^{-1/5}R = 0.871\,R$. The whole has uniform density, so by the shell theorem of chapter 1.3 it pulls outside as a
point mass at its centre, like any uniform ball. The paper's Section IV notes that this body has no magnetic field
outside either, "though all of it moves".
:::

### The paper

The paper's [Section IV](/paper/#sec:near-field), *What breaks the tie*, takes a steel ball of radius $R$ with a gold
nugget of mass $\matter m$ at the distance $d = R/2$ from its centre (the paper writes $s$, which this chapter uses for
the distance from an axis). It compares two other bodies with the same field outside: the nugget's harmonic flush (a
smooth density inside the ball with the same field outside) and its skin (the nugget's mass spread over the surface),
drawn in Figure [](/paper/#fig:same-outside). Their integrals $\int\matter\rho\,r^2\,\dd V$ for the gold are
$\matter md^2$, $\tfrac35\matter mR^2$ and $\matter mR^2$. Spun about an axis across the line to the nugget, the paper
says, the gold's shares of the moment of inertia are $0.25$, $0.48$ and $0.75\,\matter mR^2$. Reproduce them from the
split of $I_x$.

::: solution
Put the nugget on the $z$ axis and spin about the $x$ axis. For the nugget, $x = 0$, so the harmonic part is
$\int\matter\rho\,(r^2/3 - x^2)\,\dd V = \matter md^2/3 = \matter mR^2/12$, and the three bodies share it, because it
is fixed by the outside. The nugget's moment is $\tfrac23\matter md^2 + \matter md^2/3 = \matter md^2 = 0.25\,\matter
mR^2$. The flush has $\tfrac23 \times \tfrac35\matter mR^2 + \tfrac1{12}\matter mR^2 = 0.483\,\matter mR^2$, and the
skin $\tfrac23\matter mR^2 + \tfrac1{12}\matter mR^2 = 0.75\,\matter mR^2$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) assumes that the pixel does not rotate, gives the pseudo-tide of the Earth's
  turning, holds the frame still with gyroscopes, and says that a pixel on the ground reads $I/\matter MR^2$.
- [Section IV](/paper/#sec:near-field), *The magnetic picture*, compares the ball and the shell by their moments of
  inertia, $5/3$, and builds the counter-turning ball of the stretch problem. *What breaks the tie* splits $I_x$, as
  in this chapter, and solves the two-layer Earth.
- [Section VIII](/paper/#sec:one-pixel), *Ten numbers*, reads the speed $(1 - C/\matter MR^2)\,\Omega R =
  311\unit{m\,s^{-1}}$ from a pixel on the equator, with $C$ for the moment of inertia and $\Omega$ for the Earth's
  spin.
- [Section XIII](/paper/#sec:second-order) kicks bodies with impulsive tides, whose energy, equation
  [](/paper/#eq:push), chapter 1.7 derives. It finds that a ball and a shell gain energy in the ratio 3 : 5 of their
  $\int\matter\rho\,r^2\,\dd V$, the number that this chapter shows the outside cannot see.
:::

::: deeper
- The [GR course, section 0.5](https://neovand.github.io/general-relativity/chapter-0.html#0-5-the-mechanics-we-will-use)
  collects the mechanics used here, and its
  [lab on a cart and a spring](https://neovand.github.io/general-relativity/chapter-0.html#spring-energy-exchange)
  lets you watch kinetic and potential energy change places.
- The [GR course, section 5.1](https://neovand.github.io/general-relativity/chapter-5.html#5-1-ask-the-accelerometer-not-the-window)
  separates the accelerations an instrument feels from those that come from the choice of frame.
- The [GR course, section 15.9](https://neovand.github.io/general-relativity/chapter-15.html#15-9-mach-s-question-what-fixes-an-inertial-frame)
  asks what fixes an inertial frame, and
  [section 16.9](https://neovand.github.io/general-relativity/chapter-16.html#16-9-gyroscopes-and-a-compact-experimental-map)
  shows how relativity makes a gyroscope's axis drift.
- Daniel Kleppner and Robert Kolenkow, *An Introduction to Mechanics* (2nd ed., Cambridge, 2014), treat rigid bodies,
  Euler's equations and precession, and non-inertial frames, all at the level of this chapter and beyond it.
:::

[^dot]: A dot over a symbol means a derivative with respect to time, as in chapter 1.4: $\dot{\vect x}$ is a velocity
    and $\ddot{\vect x}$ an acceleration.

[^gyro]: In general relativity a gyroscope's axis drifts slowly even with no torque on it, by an amount the satellite
    Gravity Probe B measured; chapter
    [7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)
    states it, and the GR course derives it (see *Go deeper*).

[^eigen]: Chapter 1.5 counts the numbers in a symmetric table and its axes, and the figure of chapter 1.1 draws the
    principal axes of a symmetric table of two rows.

[^s]: The distance from the axis is given by $s^2 = r^2 - (\hat u\cdot\vect x)^2$, so
    $\hat u_i(r^2\delta_{ij} - x_ix_j)\hat u_j = s^2$.

[^round]: The measured 0.3307 gives $12{,}505$ and $4152\unit{kg\,m^{-3}}$, which match the paper's 12,500 and 4150.
    The paper's rounded 0.331 gives $12{,}474$ and $4158\unit{kg\,m^{-3}}$.

[^colour]: The frame's angular velocity is coloured as the observer's, because it describes the turning of the one
    who measures. The spin of a body, as in the sections above, stays plain, although for a laboratory on the ground
    the two are the same number. The pseudo-tide below takes the observer's colour too, because it comes from the
    frame and not from any mass.

[^foucault]: A Foucault pendulum shows the Coriolis acceleration. Only the part of $\obs{\vect\Omega}$ along the local
    vertical, $\obs\Omega\sin\lambda$ at the latitude $\lambda$, turns the ground under its swing, so its plane of
    swing turns once in $23.93\unit{h}/\sin\lambda$: 33.8 h at a latitude of 45°.

[^letters]: The paper uses some of this chapter's letters for other things. It writes the moment of inertia $C$ in
    Section VIII, where $I$ is an invariant of the curvature; $I_{ij}$ in Section V is the second moment
    $\int\matter\rho\,x_ix_j\,\dd V$, not the inertia tensor. It writes $\vect J$ for the current column of Section
    IV and for a density of momentum in Section XIII, not for an impulse.
