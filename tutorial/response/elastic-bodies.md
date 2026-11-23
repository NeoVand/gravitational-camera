---
id: '4.3'
title: 'Elastic bodies: stress, strain, moduli, normal modes'
question: 'How do stiffness and mass decide the note at which a solid rings, and why can a guessed shape give it?'
part: '4'
requires: ['1.1', '1.3', '1.4', '1.5', '1.6', '2.2', '2.3', '3.4', '4.1', '4.2']
paper: [sec:near-field, app:benchmarks, fig:tremor, sec:thermal, eq:surface-glow, eq:wave-zone, eq:optics-bound]
figures: []
live: []
depth: A
---

The paper's [Appendix A](/paper/#par:the-trembling-lattice) builds a ball out of springs. Its masses sit at "the sites
of a simple cubic lattice", the corners of a stack of equal cubes, "each site joined to its six nearest neighbours by
springs of unit stiffness and to its twelve next-nearest by springs half as stiff, which makes a stable elastic
solid".[^sites] The paper reads the ball's trembling from the ways in which this lattice can vibrate. For a real steel
ball ten centimetres in radius it then estimates the lowest quadrupole note, near 15 kHz, by "Rayleigh's method with the
displacement $\vect u = (q/R)(-x/2, -y/2, z)$", and it adds that "these are estimates, not the exact modes of a steel
sphere". A **note** is a frequency at which a body rings, and a quadrupole note is one whose ringing changes the body's
quadrupole moment, the measure of how far its mass is drawn out along an axis (chapter
[2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)).

So we ask how stiffness and mass decide the note at which a solid rings, and why a guessed shape can give it. The
answer needs a language for a deformed solid, the normal modes that chapter 4.1 used without proof, and one inequality
from chapter 3.4. With them we derive every number of the appendix's steel ball.[^letters]

::: plain
When a solid is bent or squeezed, each bit of it moves a little from its place. What matters is not the movement
itself but how much it changes the distances between neighbouring bits, because only a change of distance stretches
the bonds between the atoms. This change of distance is the strain. The bonds pull back, and the force that each bit
then exerts on its neighbours, per square metre, is the stress.

In a material that is the same in every direction, the stress answers a strain with only two numbers: one for a change
of volume and one for a change of shape. The second number also sets the speed of the sound that shakes a solid
sideways.

A body made of masses and springs can ring in many ways, its normal modes, each with its own frequency. The lowest
can be estimated by guessing its shape and dividing the stiffness of that shape by its mass. Every guess gives a
frequency that is too high, and a good guess comes close. For the paper's steel ball the guess gives 15 kHz. The exact
answer, for the lowest way of ringing that draws the ball's mass out along an axis, is 12.6 kHz. A twisting motion
rings lower, at 11.9 kHz, but it moves no mass inward or outward, so it does not change the ball's gravity outside.
:::

## A deformation is a displacement field, and its strain is the part that changes lengths

We want to describe how a solid is deformed, ignoring the motions that deform nothing. Let the bit of the solid that
sat at the position $\vect x$ move to $\vect x + \vect u(\vect x)$. The vector $\sym{displacement}{\vect u}$ is the
**displacement**, in metres, and because it has a value at every point it is called a **displacement field**. We
assume that **the displacement changes slowly from point to point**, $|\partial_ju_i| \ll 1$, so that we keep only
first powers of its derivatives.

Take two neighbouring bits a small step $\dd\vect x$ apart. The displacement of the second differs from that of the
first by $(\partial_ju_i)\,\dd x_j$, so the step becomes $\dd\vect x'$, with the components $\dd x_i' = \dd x_i +
(\partial_ju_i)\,\dd x_j$. We square its length and drop the term with two derivatives:

$$|\dd\vect x'|^2 = |\dd\vect x|^2 + 2\,\dd x_i\,(\partial_ju_i)\,\dd x_j .$$

If the table $\partial_ju_i$ were antisymmetric, swapping the names $i$ and $j$ would turn the last term into its own
negative, so it would be zero. Only the symmetric part of the table changes lengths, and that part is the **strain**,

$$\boxed{\;\sym{strain-tensor}{u_{ij}} = \tfrac12\bigl(\partial_iu_j + \partial_ju_i\bigr) ,\;} \label{eq:strain}$$

a symmetric table of pure numbers. Taking the square root to first order, a step along the unit vector $\hat n$ grows
by the fraction $u_{ij}\hat n_i\hat n_j$. This is the strain of
[chapter 1.4](/tutorial/newton/tides/#a-swaying-person-makes-the-signal-that-ligo-must-keep-out), a change of length
over the length, now given for every direction at once.[^gw]

The antisymmetric part acts on $\dd\vect x$ as a cross product with a fixed vector (chapter
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise)), which is a small turn of
the neighbourhood as a whole. A body turned rigidly through the small angle $\vect\theta$ has $\vect u =
\vect\theta\times\vect x$, whose table $\partial_ju_i = \epsilon_{ikj}\theta_k$ is antisymmetric, so a rigid turn has no
strain, as it must.

The strain is symmetric, so by chapter
[3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes) it has three
perpendicular eigen-axes. A small box with its edges along them has each edge stretched by its eigenvalue, so its
volume becomes $V(1 + u_{11})(1 + u_{22})(1 + u_{33})$, which is $V(1 + u_{kk})$ to first order. The trace is the
fractional change of volume:

$$\frac{\delta V}{V} = u_{kk} = \nabla\cdot\vect u .$$

So chapter 1.5's
[split](/tutorial/newton/five-numbers/#every-symmetric-table-splits-into-a-part-that-changes-size-and-a-part-that-changes-shape)
applies to the strain as it did to the tide. The trace part $\tfrac13u_{kk}\delta_{ij}$ changes the volume, and so the
density. The trace-free part $\tilde u_{ij} = u_{ij} - \tfrac13\delta_{ij}u_{kk}$ changes only the shape, and a
deformation that has only this part is a **shear**.

**An example.** Appendix A's displacement in a ball of radius $R$ is $\vect u = (q/R)(-x/2, -y/2, z)$, where the
amplitude $q$ is in metres. Its table $\partial_ju_i$ is $(q/R)\,\mathrm{diag}(-\tfrac12, -\tfrac12, 1)$, already
symmetric, so this is the strain. Its trace is zero, so it is a pure shear. The poles at $z = \pm R$ move outward by
$q$ and the equator moves inward by $q/2$: the ball becomes slightly longer along $z$ with the same volume, which is why
the paper says that it "changes the density nowhere". **A non-example** is the rigid turn above, which moves every bit
and strains none.

<!-- diagram: tut-elastic-strain — Three small squares of material side by side, each with its rest outline dashed
and its deformed outline solid, the deformation exaggerated. Left: a shear, the square stretched along one diagonal
(orange) and squeezed along the other (blue) with the same area, its strain table (0, s; s, 0) below it. Middle: a
change of volume, the square grown equally in every direction, its table (e, 0; 0, e) below. Right: a small rigid turn,
the square turned by a few degrees and not deformed, its table of ∂_j u_i (0, −θ; θ, 0) below with the label "no
strain". Caption: "Look first at the right-hand square: it has moved, but no distance within it has changed, so its
strain is zero. The shear changes the shape at fixed area, the middle square the area at fixed shape. Deformations
exaggerated." -->

## Stress is force per area, and it too is a symmetric table

We want the forces that the bits of a deformed solid exert on one another. Imagine a small flat face of area $\dd A$
inside the solid, with the unit normal $\hat n$. The material on the side to which $\hat n$ points pulls on the face
with a force proportional to the area,

$$\dd F_i = \matter T_{ij}\,\hat n_j\,\dd A .$$

The table $\sym{stress-tensor}{\matter T_{ij}}$ is the **stress**, in pascals ($1\unit{Pa} = 1\unit{N\,m^{-2}}$). Its
entry $\matter T_{ij}$ is the component $i$ of the force per area on a face whose normal points along $j$. A positive
diagonal entry pulls the face outward, a tension; a negative one pushes it inward, a compression.

The stress is symmetric. Take a small cube of side $a$ and density $\matter\rho$. The sideways forces on its four
faces parallel to the $z$ axis give it a torque $(\matter T_{yx} - \matter T_{xy})\,a^3$ about that axis, while its
[moment of inertia](/tutorial/newton/motion/#a-turning-body-keeps-the-spread-of-its-mass-in-a-table-of-inertia) about
it is $\matter\rho a^5/6$.[^cube] It would turn with the angular acceleration, torque over moment of inertia,
$6(\matter T_{yx} - \matter T_{xy})/\matter\rho a^2$, which grows without limit as the cube shrinks. Small bits of a
solid do not spin up in this way, so $\matter T_{xy} = \matter T_{yx}$.

A fluid at rest pushes straight inward on every face, equally in every direction, so its stress is
$\matter T_{ij} = -p\,\delta_{ij}$, with $p$ the **pressure**. For any stress we define the pressure as the average push,
$p = -\tfrac13\matter T_{kk}$. The air presses on us with $10^5\unit{Pa}$.

On a small box of volume $\dd V$ the net force along $i$ is the difference of the pulls on opposite faces,
$\partial_j\matter T_{ij}\,\dd V$. So Newton's law for each bit, with no other force acting, is

$$\matter\rho\,\ddot u_i = \partial_j\matter T_{ij} . \label{eq:newton-solid}$$

The units agree: a pascal per metre is a newton per cubic metre.

<!-- diagram: tut-elastic-stress — A small cube in perspective with axes x, y, z. On the visible face normal to x,
three arrows from its centre: T_xx along x (outward, labelled "tension"), T_yx along y and T_zx along z, the last two
lying in the face. On the face normal to y, the arrow T_xy along x, drawn the same length as T_yx, with a small mark
"T_xy = T_yx". Caption: "Look first at the face normal to x: the force on it per area is the column T_ix, one
component along its normal and two along the face. The equal lengths of T_xy and T_yx keep the cube from spinning.
Arrow lengths schematic." -->

## In a uniform solid the stress answers each part of the strain with its own modulus

We want the rule that gives the stress of a strain. We assume that **the strains are small**, so that the stress is
proportional to the strain (**Hooke's law**), and that the stress depends on the strain alone, so that a rigid turn
makes none. We assume too that **the material is isotropic**: it has no preferred direction, so turning a strain turns
its stress in the same way. Steel is made of small crystal grains pointing every way, so it is isotropic over many
grains. Glass is **amorphous**, with its atoms in no regular order, and it is isotropic too. A single crystal is not.

Choose axes along the eigen-axes of the strain, in which it is diagonal. A turn of the axes is a matrix $O$, and by
[chapter 1.1](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow) it turns a
table $u$ into $OuO^{\mathsf T}$. Isotropy says that the stress of a turned strain is the turned stress,
$\matter T(OuO^{\mathsf T}) = O\,\matter T(u)\,O^{\mathsf T}$. The half turn about axis 1 is
$O = \mathrm{diag}(1, -1, -1)$, and it leaves a diagonal strain unchanged, $OuO^{\mathsf T} = u$. So the stress obeys
$\matter T = O\matter TO^{\mathsf T}$. But this turn reverses the signs of $\matter T_{12}$ and $\matter T_{13}$, so both
are zero, and a half turn about axis 2 makes $\matter T_{23}$ zero. The stress is diagonal in the axes of the strain.

A strain $u_{11}$ alone gives some stress $C_1u_{11}$ along axis 1. A quarter turn about axis 1 exchanges axes 2 and 3
and leaves this strain alone, so the stresses along 2 and 3 are equal, $C_2u_{11}$. A quarter turn can carry any axis to
any other, so the same two numbers serve every axis. Adding the effects of the three strains,

$$\matter T_{11} = C_1u_{11} + C_2\,(u_{22} + u_{33}) = (C_1 - C_2)\,u_{11} + C_2\,u_{kk} ,$$

and the same for the other axes. As tables, $\matter T_{ij} = (C_1 - C_2)\,u_{ij} + C_2\,u_{kk}\,\delta_{ij}$, and since
both sides turn by the same rule, this holds in every set of axes. We put in $u_{ij} = \tilde u_{ij} +
\tfrac13u_{kk}\delta_{ij}$ and name the two numbers that appear, $2\matter\mu = C_1 - C_2$ and $\matter K = C_2 +
\tfrac13(C_1 - C_2)$:

$$\boxed{\;\matter T_{ij} = \matter K\,u_{kk}\,\delta_{ij} + 2\matter\mu\,\tilde u_{ij} .\;} \label{eq:hooke}$$

The number $\sym{bulk-modulus}{\matter K}$ is the **bulk modulus** and $\sym{shear-modulus}{\matter\mu}$ the **shear
modulus**, or rigidity, both in pascals because the strain has no unit. The trace of [](#eq:hooke) gives
$p = -\matter K\,\delta V/V$, so $\matter K$ is the pressure needed for each unit of fractional loss of volume. The
trace-free part of the stress is $2\matter\mu\tilde u_{ij}$, so $\matter\mu$ resists a change of shape. An isotropic
solid answers the part of the strain that changes size and the part that changes shape separately, each with one
number, and it has no other freedom.[^young]

**A number.** The tutorial's steel has $\matter\mu = 7.1 \times 10^{10}\unit{Pa}$, or 71 GPa; the section [*A solid
carries two kinds of sound*](#a-solid-carries-two-kinds-of-sound) shows where this comes from. Let a shear stress $\tau$
as large as the pressure of the air act along the sides of a small square of it. By [](#eq:hooke) its strain is $\tilde
u_{xy} = \tau/2\matter\mu$, and in a pure shear each side turns by $u_{xy}$.[^angle] So each side turns by $7 \times
10^{-7}$ radians, and the angle between the sides changes by $\tau/\matter\mu = 10^5\unit{Pa}/\matter\mu = 1.4 \times
10^{-6}$ radians. **A limit.** A liquid at rest has $\matter\mu = 0$ (chapter 4.4), and [](#eq:hooke) becomes a pure
pressure.

## A strain stores energy, half the stress times the strain

We want the energy stored in each cubic metre of a strained solid. When the displacement of a piece of solid changes by
a small $\delta\vect u$, its neighbours do the work $\oint\matter T_{ij}\hat n_j\,\delta u_i\,\dd A$ on it through its
surface. The [divergence theorem](/tutorial/newton/gauss-and-poisson/#the-divergence-theorem-adds-up-the-boxes) of
chapter 1.3 turns this into a volume integral, and the product rule splits it in two:

$$\int\partial_j\bigl(\matter T_{ij}\,\delta u_i\bigr)\,\dd V = \int(\partial_j\matter T_{ij})\,\delta u_i\,\dd V +
\int\matter T_{ij}\,\partial_j\delta u_i\,\dd V .$$

By [](#eq:newton-solid) the first term is $\int\matter\rho\ddot u_i\,\delta u_i\,\dd V$, the work that speeds the bits
up. The second is stored. Since $\matter T_{ij}$ is symmetric, it meets only the symmetric part of $\partial_j\delta
u_i$, so the stored work per volume is $\matter T_{ij}\,\delta u_{ij}$. We let the strain grow in proportion, as
$s\,u_{ij}$ with $s$ from 0 to 1, so that the stress is $s\matter T_{ij}$, and add up the work:
$\int_0^1s\,\matter T_{ij}u_{ij}\,\dd s = \tfrac12\matter T_{ij}u_{ij}$. With [](#eq:hooke), and because
$\delta_{ij}\tilde u_{ij} = 0$ makes $\tilde u_{ij}u_{ij} = \tilde u_{ij}\tilde u_{ij}$,

$$\boxed{\;\sym{elastic-energy-density}{\varepsilon_{\rm el}} = \tfrac12\matter K\,u_{kk}^2 + \matter\mu\,\tilde
u_{ij}\tilde u_{ij} ,\;}$$

in joules per cubic metre, which is the same as pascals. **A check.** Both terms are positive for every strain when
$\matter K > 0$ and $\matter\mu > 0$, so every deformation costs energy and the solid springs back. That is what the
paper's "stable elastic solid" means.

For Appendix A's shape, $u_{kk} = 0$ and $\tilde u_{ij}\tilde u_{ij} = (\tfrac14 + \tfrac14 + 1)(q/R)^2 =
\tfrac32(q/R)^2$, the same at every point. The energy of a ball of volume $V$ is then

$$\tfrac32\matter\mu\,V\,\frac{q^2}{R^2} = \frac12\cdot\frac{3\matter\mu V}{R^2}\,q^2 ,$$

so the ball resists this shape as 4.1's spring resists a stretch, with the stiffness $3\matter\mu V/R^2$ that the paper
gives. For the steel ball, $V = 4.19 \times 10^{-3}\unit{m^3}$ and the stiffness is $8.9 \times 10^{10}\unit{N\,m^{-1}}$,
nearly two billion times that of chapter 4.1's spring of $50\unit{N\,m^{-1}}$.

## A solid carries two kinds of sound

We want to know how a disturbance moves through a uniform solid. We put Hooke's law [](#eq:hooke) into
[](#eq:newton-solid). The trace part gives $\matter K\,\partial_i(\nabla\cdot\vect u)$, and the shear part gives
$2\matter\mu\,\partial_j\tilde u_{ij} = \matter\mu\nabla^2u_i + \tfrac13\matter\mu\,\partial_i(\nabla\cdot\vect
u)$,[^shear-term] so

$$\matter\rho\,\ddot u_i = \matter\mu\,\nabla^2u_i + \bigl(\matter K + \tfrac13\matter\mu\bigr)\,\partial_i(\nabla\cdot\vect u) .
\label{eq:navier}$$

Take first a displacement across the direction of travel, $\vect u = u(x, t)\,\hat y$. It has no divergence, so
$\matter\rho\,\partial_t^2u = \matter\mu\,\partial_x^2u$. Take next a displacement along it, $\vect u = u(x, t)\,\hat
x$. Then $\nabla\cdot\vect u = \partial_xu$, both terms of [](#eq:navier) contribute, and $\matter\rho\,\partial_t^2u =
(\matter K + \tfrac43\matter\mu)\,\partial_x^2u$. Each has the form $\partial_t^2u = c^2\partial_x^2u$, and any shape
$u = f(x - ct)$ solves it, since both sides are then $c^2f''$. So a disturbance of either kind travels without changing
its shape, at the speed

$$\boxed{\;\sym{shear-speed}{c_T} = \sqrt{\frac{\matter\mu}{\matter\rho}}, \qquad
\sym{compressional-speed}{c_L} = \sqrt{\frac{\matter K + \tfrac43\matter\mu}{\matter\rho}} .\;}$$

The first is the speed of **shear sound** (transverse, hence $T$), the second that of **compressional sound**
(longitudinal, hence $L$). The units agree: a pascal over kilograms per cubic metre is a square metre per square
second. Chapter 5.1
solves such wave equations in full.

**Numbers.** The paper prints no constants for its steel. The tutorial takes $c_T = 3000\unit{m\,s^{-1}}$, the value
behind the paper's numbers, and a density $\matter\rho = 7850\unit{kg\,m^{-3}}$, so $\matter\mu = \matter\rho c_T^2 =
7.1 \times 10^{10}\unit{Pa}$. In steel, compressional sound is measured to travel 1.84 times as fast as shear sound. The
square of the ratio of the two speeds is $(c_L/c_T)^2 = \matter K/\matter\mu + \tfrac43$, so $\matter K = (1.84^2 -
\tfrac43)\,\matter\mu = 2.05\,\matter\mu = 145\unit{GPa}$, about twice the shear modulus, and $c_L =
5520\unit{m\,s^{-1}}$.[^steel] A gravitational wave travels at $c$, and $c_T/c = 1.0 \times 10^{-5}$.[^wavenumber] Shear
sound at 15 kHz is $3000/15{,}100 = 0.20\unit{m}$ long, the diameter of the steel ball: a body's lowest note is about
the one whose wave fits across it.

**A limit.** A liquid has $\matter\mu = 0$, so $c_T = 0$ and it carries no shear sound. Its compressional sound is
ordinary sound, $c_L = \sqrt{\matter K/\matter\rho}$, which for water ($\matter K = 2.2\unit{GPa}$) is
$1480\unit{m\,s^{-1}}$, as measured.

## Masses on springs move in normal modes

We want every small motion of $N$ masses joined by springs, such as the paper's lattice of 924. We collect the $3N$
displacements in one list of numbers $\mathbf q$, in metres. We assume that **each spring is unstretched when the body
is at rest**, as in Appendix A's lattice. Then for small displacements the stretch of each spring is linear in
$\mathbf q$, and the stored energy, a sum of terms $\tfrac12k\,(\text{stretch})^2$, is a quadratic form
$\tfrac12\mathbf q^{\mathsf T}\sym{stiffness-matrix}{\mathbf K}\mathbf q$ that is never negative, with $\mathbf K$ a
symmetric $3N\times3N$ **stiffness matrix** in newtons per metre. The kinetic energy is $\tfrac12\dot{\mathbf
q}^{\mathsf T}\sym{mass-matrix}{\mathbf M}\dot{\mathbf q}$, with the diagonal **mass matrix** $\mathbf M$ holding each
mass three times.[^bold] The force is minus the gradient of the stored energy, $-\mathbf K\mathbf q$, so Newton's law is

$$\mathbf M\ddot{\mathbf q} = -\mathbf K\mathbf q .$$

We multiply each coordinate by the square root of its mass, $\mathbf y = \mathbf M^{1/2}\mathbf q$, and put
$\mathbf q = \mathbf M^{-1/2}\mathbf y$ into the law. Multiplying it on the left by $\mathbf M^{-1/2}$ gives
$\ddot{\mathbf y} = -D\mathbf y$, with $D = \mathbf M^{-1/2}\mathbf K\mathbf M^{-1/2}$ a symmetric matrix. Chapter
3.4's [spectral theorem](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes)
gives it $3N$ perpendicular unit eigenvectors $\mathbf e_n$. The eigenvalue of each is $\mathbf e_n^{\mathsf
T}D\mathbf e_n$, twice the energy stored when $\mathbf q = \mathbf M^{-1/2}\mathbf e_n$, which is never negative, so
we write it as $\omega_n^2$. Writing $\mathbf y =
\sum_na_n(t)\,\mathbf e_n$ and multiplying by $\mathbf e_n^{\mathsf T}$ separates the law of motion into $3N$
independent ones:

$$\boxed{\;\ddot a_n = -\omega_n^2\,a_n, \qquad \mathbf q(t) = \mathbf M^{-1/2}\sum_na_n(t)\,\mathbf e_n .\;}$$

Each $a_n$ is an oscillator of [chapter 4.1](/tutorial/response/oscillator/#a-mass-on-a-spring-swings-at-one-frequency)
with the frequency $\omega_n$. Each pattern $\mathbf v_n = \mathbf M^{-1/2}\mathbf e_n$ is a **normal mode**, a motion in
which every mass swings in step at one frequency, and every small motion is a sum of them. The amplitude $a_n$ is
mass-weighted, in $\mathrm{kg^{1/2}\,m}$. We call $\mathbf v^{\mathsf T}\mathbf M\mathbf w$ the **mass-weighted
product** of two motions. The modes are perpendicular in it, since $\mathbf v_m^{\mathsf T}\mathbf M\mathbf v_n =
\mathbf e_m^{\mathsf T}\mathbf e_n$ is 1 when $m = n$ and 0 otherwise.

A displacement that stretches no spring stores no energy, so it is a mode with $\omega_n = 0$, a **zero mode**. It does
not ring: its amplitude grows steadily, and the body drifts or turns. A free body has six, the three translations and the
three small turns of the first section, and a body held firmly together has no others (the stretch problem proves this
for a solid). **Numbers.** Appendix A's ball of 924 masses has 2772 modes, six of them zero. The paper compares it with
a shell, the 668 masses of the same lattice that lie more than four spacings from the centre, which has 2004.[^lattice]

**The sum of oscillators, proved.** We add friction and a push. We assume that **the friction damps each mode on its
own**: it is a force $-\Gamma_n\dot a_n$ on each mode, with 4.1's [damping
rate](/tutorial/response/oscillator/#friction-makes-the-swing-die-away-and-the-quality-factor-counts-how-slowly)
$\Gamma_n$, and it couples no two modes. A friction on each mass in proportion to its mass, $-\Gamma\mathbf
M\dot{\mathbf q}$, does this, because it becomes $-\Gamma\dot{\mathbf y}$.[^damping] We take the friction so because a
body's friction is measured mode by mode, as the width of each line, and a weak friction that couples two modes changes
the answer only slightly (4.1's gap box). With a force $F$ on one coordinate $a$ of mass $m_a$, the same steps give
$\ddot a_n + \Gamma_n\dot a_n + \omega_n^2a_n = e_{n,a}F/\sqrt{m_a}$, where $e_{n,a}$ is the entry of $\mathbf e_n$ at
that coordinate. Each mode is a driven oscillator of unit mass, and coordinate $a$ moves by
$\sum_na_ne_{n,a}/\sqrt{m_a}$. So its response is

$$\chi_{aa}(\omega) = \sum_n\frac{c_n^2}{\omega_n^2 - \omega^2 - i\Gamma_n\omega}, \qquad c_n = \frac{e_{n,a}}{\sqrt{m_a}} ,$$

the [sum of oscillators](/tutorial/response/oscillator/#a-body-with-many-modes-answers-as-a-sum-of-oscillators) that
chapter 4.1 stated, now proved for every body of masses and springs whose friction damps each mode on its own. The
number $c_n$ is how far mode $n$ moves the pushed coordinate per unit of its mass-weighted amplitude, as Appendix A
words it, and its square $c_n^2$ is 4.1's weight. The weights add up to $1/m_a$, because the $\mathbf e_n$ are the
columns of an orthogonal matrix, whose rows have length one, so $\sum_ne_{n,a}^2 = 1$. The same steps work for any push
and any reading; chapter 4.6 reads the $c_n$ of a body's moments off its mode shapes.

::: gap
A solid is the limit of such a lattice as the spacing shrinks. Its modes are displacement fields $\vect u_n(\vect x)$,
perpendicular in the mass-weighted product, which becomes $\int\matter\rho\,\vect u_m\cdot\vect u_n\,\dd V = 0$ for
$m \ne n$, and every small motion is a sum of them. This chapter states the limit without proof, which needs the theory
of symmetric operators on functions rather than on lists.
:::

## A guessed shape overestimates the lowest note, and a good guess comes close

We want the lowest frequency without solving an eigenproblem of 2772 rows. Take any trial shape $\mathbf q$ and write
$\mathbf M^{1/2}\mathbf q = \sum_na_n\mathbf e_n$. Then $\mathbf q^{\mathsf T}\mathbf K\mathbf q = \sum_n\omega_n^2a_n^2$
and $\mathbf q^{\mathsf T}\mathbf M\mathbf q = \sum_na_n^2$, so their ratio is chapter 3.4's
[Rayleigh quotient](/tutorial/noise/symmetric-matrices/#the-rayleigh-quotient-finds-the-strongest-and-weakest-directions)
of $D$: an average of the $\omega_n^2$, weighted by the shares $a_n^2/\sum_ma_m^2$ of the modes in the shape. An
average is never below the smallest thing it averages. We assume that **the trial shape has no part along the zero
modes**, and call $\omega_1$ the lowest frequency among the modes it contains. Then

$$\boxed{\;\omega_1^2 \le \frac{\mathbf q^{\mathsf T}\mathbf K\mathbf q}{\mathbf q^{\mathsf T}\mathbf M\mathbf q} ,\;}$$

with equality only when the shape is that mode. The numerator is twice the energy stored at unit amplitude and the
denominator twice the kinetic energy at unit speed: stiffness over mass, as $\omega_0^2 = k/\matter m$ was for one cart.
This is **Rayleigh's method**. Because the quotient changes only in second order near an eigenvector (3.4), an error in
the shape enters the frequency only through its square, so a good guess comes close.

For a solid the numerator becomes $2\int\varepsilon_{\rm el}\,\dd V$ and the denominator $\int\matter\rho|\vect
u|^2\,\dd V$. Appendix A's shape has no part along the zero modes, because its mean displacement and its angular
momentum vanish by the ball's symmetry (the stretch problem below). Its kinetic energy is
$\tfrac12\dot q^2(\matter\rho/R^2)\int(\tfrac14x^2 + \tfrac14y^2 + z^2)\,\dd V$. This needs the **second moment**
$\int\matter\rho\,x_ix_j\,\dd V$, in $\mathrm{kg\,m^2}$, the table of how the mass is spread along each pair of
directions. For a [round body](/tutorial/newton/motion/#a-round-body-has-the-same-moment-about-every-axis) chapter 1.6
found it to be
$\tfrac13\delta_{ij}\int\matter\rho r^2\,\dd V$, which for a uniform ball of mass $\matter M$ is
$\tfrac15\matter MR^2\delta_{ij}$. So the kinetic energy is $\tfrac12\cdot\tfrac{3\matter M}{10}\dot q^2$: the shape
carries an **effective mass** of $3\matter M/10$, less than $\matter M$ because the bits near the centre hardly move. With
the **effective stiffness** $3\matter\mu V/R^2$ of the energy section and $\matter M = \matter\rho V$,

$$\boxed{\;\omega_1 \le \sqrt{\frac{3\matter\mu V/R^2}{3\matter M/10}} = \sqrt{10}\,\frac{c_T}{R} .\;}
\label{eq:ball-note}$$

**A number.** For $R = 0.10\unit{m}$ and $c_T = 3000\unit{m\,s^{-1}}$ the bound is $9.49 \times
10^4\unit{s^{-1}}$, a frequency $f = \omega/2\pi$ of 15.1 kHz. This is the paper's "near 15 kHz".

**The exact note** (stated, not derived). Lamb solved the free elastic sphere exactly (see *Go deeper*), with functions
that generalize the Bessel functions of [chapter
3.6](/tutorial/noise/bessel-and-airy/#the-circular-ripple-obeys-bessels-equation) from a circle to a sphere. The lowest
mode that changes the ball's mass quadrupole has $\omega R/c_T = 2.645$ when $c_L/c_T = 1.84$. For the steel ball that
is 12.6 kHz. One mode is lower: a twist at 11.9 kHz, in which the two hemispheres turn against each other. The twist
moves no mass toward or away from the centre, so it leaves the quadrupole unchanged, and Appendix A's shape contains
none of it.[^twist] So [](#eq:ball-note) bounds the 12.6 kHz mode, and the paper's "lowest quadrupole mode" is the
lowest mode that changes the mass quadrupole. Rayleigh's $\sqrt{10} = 3.16$ lies 20% above 2.645, on the side the bound
requires, because the true mode is not a uniform shear. **A check** the reader can make: [](#eq:ball-note) and Lamb's
value both scale as $c_T/R$, so a ball of half the radius rings an octave higher.

<!-- diagram: tut-elastic-trial — Left: a meridian section of the ball (circle of radius R, z up), with short arrows
of u = (q/R)(−x/2, z) on a square grid of about 9 × 9 points inside the circle (orange where the arrow points away from
the equatorial plane, blue where it points toward the axis), and the outlines r = R(1 ± 0.15 P₂(cos θ)) dashed, the
taller labelled "+q" and the flatter "−q". Right: a vertical frequency axis from 0 to 16 kHz with three ticks, "Rayleigh's
bound 15.1 kHz", "Lamb, exact 12.6 kHz" and, in grey, "twist 11.9 kHz (moves no mass)", and a small down arrow between
the first two labelled "the true note lies below". Caption: "Look first at the arrows: the shape pulls the ball out along
its axis and in round its equator, most at the surface. The outlines are exaggerated; the frequencies are exact, for
c_T = 3000 m/s and R = 10 cm." -->

<!-- try: normal-modes — A disc of 19 equal masses on a triangular lattice (a hexagon of side two spacings), each joined
to its nearest neighbours by 42 equal springs, unstretched at rest, in the plane; 38 coordinates, 3 zero modes (two
slides and a turn), 35 ringing modes. Exact frequencies in units of √(k/m): 0.603 (twice: two squashes 45° apart, the
disc's quadrupole), 0.680 (twice), 0.806, 0.915 (twice), 0.917, 0.937, ... up to 2.295 (twice). Left panel: the disc,
animated in the chosen mode, or holding a shape the reader drags (select a mass with the mouse or Tab, move it with the
arrow keys; "release" lets the shape swing as the sum of its modes). A "squash" button sets the shape u = (x, −y).
Right panel: bars of the shares a_n²/Σa² of the current shape in each mode, ordered by frequency, and two readouts: the
Rayleigh quotient of the shape with its zero-mode parts removed (as the bound assumes), as a frequency, and the lowest
ringing frequency 0.603. A list picks a mode (the three zero modes first, then by frequency). Opens on the lowest
ringing mode. Prediction above it: "Can any shape you make give a quotient below the lowest note?" (No.) Then: "Press
squash. How far above the lowest note is it, and how much of the shape lies in that mode?" (0.661, 9.6% above, with 89%
of the shape in the lowest pair; compare the lattice ball, whose quotient lies 14% above its mode, with 85% of the shape
at that frequency.) "Now pull one edge mass outward alone." (2.09 times the lowest note, with the zero-mode parts
removed: a jagged shape mixes in high modes.) Both themes, phone width. -->

## A ringing quadrupole makes a tide

We want the tide that the ringing ball makes at a distance. Each bit of mass is carried from $\vect x$ to $\vect x +
\vect u$, so the second moment $\int\matter\rho\,x_ix_j\,\dd V$ changes by $\int\matter\rho\,(u_ix_j + x_iu_j)\,\dd V$ to
first order. For Appendix A's shape, with $\int\matter\rho\,x_ix_j\,\dd V = \tfrac15\matter MR^2\delta_{ij}$, the change is

$$\frac{2q}{R}\cdot\frac{\matter MR^2}{5}\,\mathrm{diag}\bigl(-\tfrac12, -\tfrac12, 1\bigr) = \tfrac15\matter
MRq\,\mathrm{diag}(-1, -1, 2) ,$$

the paper's quadrupole, trace-free because the shape keeps the volume. Chapter 2.3's [quadrupole
tensor](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)
$\matter Q_{ij} = \int\matter\rho\,(3x_ix_j - r^2\delta_{ij})\,\dd V$ changes by three times as much, so $\matter Q_{zz}
= \tfrac65\matter MRq$. On the axis, at the distance $r$, chapter 2.3's potential is then $\field\Phi =
-\tfrac12G\matter Q_{zz}/r^3 = -\tfrac35G\matter MRq/r^3$. Along the axis, $\partial_z^2$ is the second derivative with
respect to $r$, so the tide of [chapter
1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it) is

$$\curv{\tE}_{zz} = -\frac{36\,G\matter MRq}{5\,r^5}, \qquad
\boxed{\;|\curv{\tE}_{zz}| = \frac{36\,G\matter MRq}{5\,r^5} ,\;} \label{eq:axis-tide}$$

the paper's "tide $36GMRq/5r^5$ on its axis". The units agree: $G\matter MRq/r^5$ is in
$\mathrm{m^3\,kg^{-1}\,s^{-2}}\cdot\mathrm{kg}\cdot\mathrm{m^2}/\mathrm{m^5} = \mathrm{s^{-2}}$. When $q > 0$ the
ball is longer along the axis, $\curv{\tE}_{zz}$ is negative, and a ring on the axis is stretched along it.

**A number.** Heat sets $q$. Chapter 4.2's
[equal share](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share) gives each
term $\tfrac12\kappa\,y^2$ of the energy the average $\tfrac12\kB T$, when $y$ appears in no other term. We treat the trial
shape as if it were a mode, so that $\tfrac12(3\matter\mu V/R^2)\,q^2$ is such a term, and $\langle q^2\rangle =
\kB T/(3\matter\mu V/R^2)$. At 300 K, with $\kB T = 4.14 \times 10^{-21}\unit{J}$, the root-mean-square amplitude is
$q_{\rm rms} = 2.2 \times 10^{-16}\unit{m}$, a quarter of the radius of a proton. The steel ball has $\matter M =
32.9\unit{kg}$, and a metre away [](#eq:axis-tide) gives $3.4 \times 10^{-25}\unit{s^{-2}}$, the paper's $3 \times
10^{-25}\unit{s^{-2}}$. That is $3 \times 10^{16}$ times weaker than the tide of a person at the same distance. It
treats the trial shape as a mode, so it is an estimate of the same quality as the 15 kHz. **A limit.** The tide falls as
$r^{-5}$, so at 20 cm it is $5^5 = 3125$ times stronger, which is why the paper says "the cost is distance" (reading
chapter R4).

::: check
### Q

Which part of the strain changes a body's density, and which changes only its shape?

### A

The trace $u_{kk}$ is the fractional change of volume, so it changes the density. The trace-free part $\tilde u_{ij}$
changes only the shape.

### Q

Why can Hooke's law for an isotropic solid have only two moduli?

### A

In the eigen-axes of the strain, half turns force the stress to be diagonal, and quarter turns leave two numbers: the
answer along a strain and the answer across it. Rearranged, one multiplies the trace of the strain and the other its
trace-free part.

### Q

How many normal modes does a free body of 924 masses have, and how many of them do not ring?

### A

Three per mass, so 2772. Six do not ring: the three translations and the three turns, which stretch no spring.

### Q

Rayleigh's method gives 15.1 kHz for the steel ball. Is the true lowest quadrupole note higher or lower, and what is
the note of a steel ball of radius 5 cm?

### A

Lower, because the quotient of a trial shape is an average of the squared frequencies it contains. Lamb's exact note is
12.6 kHz. Both scale as $1/R$, so the 5 cm ball rings at 25 kHz (30 kHz by Rayleigh's estimate).
:::

**The idea to keep: a solid stores energy in its strain through two moduli, one for volume and one for shape, and rings
in normal modes whose squared frequencies are stiffness over mass; any guessed shape bounds the lowest note from above,
which gives the paper's steel ball 15 kHz against an exact 12.6 kHz, and a tide of $3 \times 10^{-25}\unit{s^{-2}}$ a
metre away.**

::: problems
### Practice

Aluminium has $\matter\mu = 26\unit{GPa}$ and $\matter\rho = 2700\unit{kg\,m^{-3}}$. Find its speed of shear sound and
Rayleigh's estimate of the lowest quadrupole note of an aluminium ball 10 cm in radius.

::: solution
$c_T = \sqrt{2.6 \times 10^{10}/2700} = 3100\unit{m\,s^{-1}}$, so $\omega = \sqrt{10}\,c_T/R = 9.81 \times
10^4\unit{s^{-1}}$ and $f = 15.6\unit{kHz}$, a little above steel, because aluminium is lighter in proportion to its
stiffness.
:::

### Stretch

Show that a displacement field has no strain anywhere exactly when it is a rigid motion, a uniform translation and a
small turn, $\vect u = \vect a + \vect\theta\times\vect x$, so that a free solid's six zero modes are its rigid motions.
(For the second half, write the second derivatives $\partial_k\partial_ju_i$ in terms of derivatives of the strain.)
Then show that Appendix A's shape has no part along them: its mass-weighted product $\int\matter\rho\,\vect u\cdot\vect
v\,\dd V$ with each rigid motion $\vect v$ is zero.

::: solution
A rigid motion has $\partial_ju_i = \epsilon_{ikj}\theta_k$, which is antisymmetric, so its strain is zero. For the
converse, each derivative of the strain is half a sum of two second derivatives, $\partial_ju_{ik} =
\tfrac12(\partial_i\partial_ju_k + \partial_j\partial_ku_i)$. Writing out three of them, the terms
$\partial_i\partial_ju_k$ and $\partial_i\partial_ku_j$ cancel and $\partial_j\partial_ku_i$ appears twice:

$$\partial_k\partial_ju_i = \partial_ju_{ik} + \partial_ku_{ij} - \partial_iu_{jk} .$$

If the strain is zero everywhere, every second derivative of $\vect u$ is zero, so the table $\partial_ju_i$ is the same
at every point. It is antisymmetric, so by chapter 1.1 it is $\epsilon_{ikj}\theta_k$ for one fixed $\vect\theta$, and
$\vect u = \vect a + \vect\theta\times\vect x$.

For Appendix A's shape, the product with a translation $\vect a$ is $\int\matter\rho\,\vect u\cdot\vect a\,\dd V = 0$,
because each component of $\vect u$ is odd in one coordinate. With a turn it is $\int\matter\rho\,\vect
u\cdot(\vect\theta\times\vect x)\,\dd V = \vect\theta\cdot\int\matter\rho\,\vect x\times\vect u\,\dd V$. The $z$ part of
$\vect x\times\vect u$ is $(q/R)(-xy/2 + yx/2) = 0$, and the $x$ part, $(3q/2R)\,yz$, integrates to zero under the
reflection $y \to -y$; the $y$ part does the same.
:::

### The paper

Appendix A says that its displacement "moves mass only at the surface". Show that the surface of the displaced ball is
$r = R + q\,P_2(\cos\vartheta)$, where $\vartheta$ is the angle from the $z$ axis and $P_2$ the Legendre polynomial of
[chapter
2.2](/tutorial/outside/spherical-harmonics/#the-patterns-symmetric-about-an-axis-are-the-legendre-polynomials-and-the-inverse-distance-generates-them).
Treat the bulge as a thin layer of surface density $\matter\rho\,q\,P_2$, and recover $\matter Q_{zz} = \tfrac65\matter
MRq$.

::: solution
On the surface the outward part of $\vect u$ is $\vect u\cdot\vect x/R = (q/R^2)(z^2 - \tfrac12x^2 - \tfrac12y^2) =
q\,P_2(\cos\vartheta)$, since $z = R\cos\vartheta$. Inside, $\nabla\cdot\vect u = 0$, so no density changes. On the
surface $3z^2 - R^2 = 2R^2P_2$, so the layer has $\matter Q_{zz} = \int\matter\rho\,q\,P_2\cdot2R^2P_2\,R^2\,\dd\Omega =
2\matter\rho qR^4\cdot4\pi/5$. With $\matter\rho R^3 = 3\matter M/4\pi$ this is $\tfrac65\matter MRq$.
:::
:::

::: paper
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) uses "a lattice ball of 924 masses joined by
  springs" and its modes, and gives the steel ball's note, tremor and tide of $3 \times 10^{-25}\unit{s^{-2}}$; its
  Figure [](/paper/#fig:tremor) adds the modes up (chapter 4.6).
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A) builds the lattice, defines the weights
  $c_n$, and gives the trial shape with its effective mass, stiffness, quadrupole and tide.
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) puts the rigidity $\matter\mu$ into the
  Love number of a ball (chapter 4.6).
- [Section VI](/paper/#sec:thermal) compares a wave with "a sound wave of the same frequency" and uses $c_T$ and $c_L$
  in [](/paper/#eq:surface-glow); [Section VII](/paper/#sec:no-lens) uses $c_T$ in [](/paper/#eq:optics-bound)
  (chapter 5.5); [Section V](/paper/#sec:waves) writes the stress $\matter T_{kl}$ in [](/paper/#eq:wave-zone)
  (chapter 5.2).
:::

::: deeper
- The GR course's section
  [11.1](https://neovand.github.io/general-relativity/chapter-11.html#11-1-a-tensor-is-a-shipping-manifest-for-energy-and-momentum)
  places the stress inside the stress–energy tensor of relativity, and
  [11.4](https://neovand.github.io/general-relativity/chapter-11.html#11-4-perfect-fluids-derived-from-isotropy) uses
  this chapter's isotropy argument for a fluid, which keeps only the pressure.
- L. D. Landau and E. M. Lifshitz, *Theory of Elasticity* (3rd ed., Pergamon, 1986), sections 1 to 5 and 22, derive
  strain, stress, Hooke's law and the two sounds. They write the strain $u_{ik}$, as here, but the stress $\sigma_{ik}$
  and the two speeds $c_t$ and $c_l$.
- H. Lamb, "On the vibrations of an elastic sphere", *Proceedings of the London Mathematical Society* 13 (1882),
  189–212, finds the exact modes quoted here.
:::

[^letters]: Several letters return with new meanings. Here $\vect u$ is a displacement, not the paper's retarded time
    $u = t - r/c$; $\matter K$ is the bulk modulus, not chapter 1.6's kinetic energy; $\matter\mu$ is the shear modulus,
    not chapter 1.8's passing mass; and $\matter T_{ij}$ with indices is the stress, while a temperature $T$ never has
    indices. The strain is $u_{ij}$, Landau and Lifshitz's letter, so that $\epsilon_{ijk}$ keeps its meaning. Chapter
    1.1 writes a turn of a table as $RTR^{\mathsf T}$; here $R$ is the ball's radius and $T$ the stress, so the turn is
    $O$.

[^gw]: A gravitational wave of strain $\field h_{ij}$ moves free masses by $\tfrac12\field h_{ij}x_j$, so its strain in
    the sense of [](#eq:strain) is $\tfrac12\field h_{ij}$ (reading chapter
    [R1](/tutorial/newton/reading-section-ii/#near-slow-matter-the-tide-is-the-hessian-and-in-a-wave-it-is-the-strains-acceleration)
    shows where the half comes from). This is why the paper says that a wave "shears" a medium "at the rate
    $\tfrac12\dot h_{ij}$" (chapter
    5.1).

[^sites]: The nearest neighbours of a site lie one edge of a cube away, along the axes, and the twelve next-nearest
    across the diagonal of a face of a cube, $\sqrt2$ edges away.

[^cube]: Centre the cube on the origin. Its face at $x = a/2$ has the area $a^2$ and feels the force $\matter
    T_{yx}a^2$ along $y$, with the lever arm $a/2$, so its torque about the $z$ axis is $\tfrac12\matter T_{yx}a^3$. The
    opposite face adds the same, and the two faces normal to $y$ give $-\matter T_{xy}a^3$ together. The moment of
    inertia is $\int\matter\rho\,(x^2 + y^2)\,\dd V$, and each of its two terms is $\matter\rho\,a^2\cdot a^3/12$.

[^angle]: A pure shear $\vect u = s\,(y, x, 0)$ has $u_{xy} = s$. It turns the side along $x$ by $s$ toward $y$ and the
    side along $y$ by $s$ toward $x$, so the right angle closes by $2s$. The factor 2 in [](#eq:hooke) makes
    $\matter\mu$ the stress for each radian of change in the angle.

[^damping]: A friction $-(\alpha\mathbf M + \beta\mathbf K)\dot{\mathbf q}$ also damps each mode on its own, with
    $\Gamma_n = \alpha + \beta\omega_n^2$, because it becomes $-(\alpha + \beta D)\dot{\mathbf y}$ and the $\mathbf e_n$
    are eigenvectors of $D$.

[^young]: Readers who know Young's modulus $E_{\rm Y}$ and Poisson's ratio $\nu$ can recover them as
    $E_{\rm Y} = 9\matter K\matter\mu/(3\matter K + \matter\mu)$ and $\nu = (3\matter K - 2\matter\mu)/2(3\matter K +
    \matter\mu)$. For the steel of this tutorial, $E_{\rm Y} = 182\unit{GPa}$ and $\nu = 0.29$.

[^shear-term]: With $\tilde u_{ij} = \tfrac12(\partial_iu_j + \partial_ju_i) - \tfrac13\delta_{ij}\partial_ku_k$, the
    shear part is $2\matter\mu\,\partial_j\tilde u_{ij} = \matter\mu\,\partial_i\partial_ju_j + \matter\mu\,\partial_j
    \partial_ju_i - \tfrac23\matter\mu\,\partial_i\partial_ku_k$. The first term is $\matter\mu\,\partial_i(\nabla\cdot
    \vect u)$, because the order of two derivatives does not matter, and the second is $\matter\mu\nabla^2u_i$. The first
    and the third together leave $\tfrac13\matter\mu\,\partial_i(\nabla\cdot\vect u)$.

[^steel]: Handbook steels have $c_T \approx 3200$ and $c_L \approx 5900\unit{m\,s^{-1}}$, in nearly the same ratio, and
    so $\matter\mu$ near 80 GPa and $\matter K$ near 160 GPa. The paper's numbers for its steel wall in Section VII use
    such a value; those for the steel ball use the round $c_T = 3000\unit{m\,s^{-1}}$, and so does this tutorial.

[^wavenumber]: So at the same frequency a gravitational wave is a hundred thousand times longer than shear sound, which
    is the paper's "a wave's wavenumber is about $10^{-5}$ of that of a sound wave of the same frequency" (chapter
    5.1).

[^bold]: The matrices are bold so that $\mathbf M$ is not the ball's mass $\matter M$ and $\mathbf K$ is not the bulk
    modulus $\matter K$, to which it is related in idea: each is a stiffness.

[^lattice]: These counts hold on a rebuild of Appendix A's lattice (924 sites within six spacings of the centre, less
    the centre, and 668 beyond four), whose stiffness matrix has exactly six zero eigenvalues. On it Appendix A's trial
    shape lies 85% at one frequency (a pair of modes of equal frequency), the paper's "85% of the quadrupole's tremor
    lies at one frequency", and its quotient is 14% above that frequency.

[^twist]: For $c_L/c_T = \sqrt3$ the quadrupole mode has $\omega R/c_T = 2.640$, so the ratio of the sounds hardly
    matters. In the twist $\omega R/c_T = 2.50$. It changes the density nowhere and moves the surface only along itself,
    so it makes no Newtonian tide; it carries only a current quadrupole, whose gravitomagnetic field (chapter 7.5) is
    weaker by about $v/c$, the speed of the motion over the speed of light. Appendix A's shape is the gradient of
    $r^2P_2$, and its mass-weighted product with the twist is zero.
