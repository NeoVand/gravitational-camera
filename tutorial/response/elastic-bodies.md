---
id: '4.3'
title: 'Elastic bodies: stress, strain, moduli, normal modes'
question: 'How do stiffness and mass decide the note at which a solid rings, and why can a guessed shape give it?'
part: '4'
requires: ['1.1', '1.3', '1.4', '1.5', '1.6', '2.2', '2.3', '3.4', '4.1', '4.2']
paper: [sec:near-field, sec:pixel, app:benchmarks, fig:tremor, sec:thermal, eq:surface-glow, eq:wave-zone, eq:optics-bound]
figures: []
live: [normal-modes]
depth: A
---

A ball can be built out of springs: masses at the sites of a simple cubic lattice, each joined to its six nearest
neighbours by springs of unit stiffness and to its twelve next-nearest by springs half as stiff, which makes a stable
elastic solid.[^sites] The ways in which this lattice can vibrate give the ball's trembling. For a real steel ball ten centimetres in radius, Rayleigh's method, with the displacement
$\vect u = (q/R)(-x/2, -y/2, z)$, estimates the lowest quadrupole note, near 15 kHz. A **note** is a frequency at
which a body rings, and a quadrupole note is one whose ringing changes the body's quadrupole moment
([section 2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)).

So how do stiffness and mass decide the note at which a solid rings, and why can a guessed shape give it? The answer
needs a language for a deformed solid, the normal modes that section 4.1 used without proof, and an inequality from
section 3.4.[^letters]

::: plain
When a solid is bent or squeezed, what matters is how much the movement changes the distances between neighbouring
bits, because only a change of distance stretches the bonds between the atoms. This is the strain. The bonds pull back,
and the force that each bit exerts on its neighbours, per square metre, is the stress. In a material that is the same
in every direction, the stress answers a strain with two numbers: one for a change of volume and one for a change of
shape, which also sets the speed of sound that shakes a solid sideways.

A body made of masses and springs rings in many ways, its normal modes, each with its own frequency. The lowest can be
estimated by guessing its shape and dividing the stiffness of that shape by its mass. Every guess gives a frequency
that is too high, and a good guess comes close: for the steel ball, 15 kHz against an exact 12.6 kHz. A twisting motion
rings lower, at 11.9 kHz, but it moves no mass inward or outward, so it does not change the ball's gravity outside.
:::

## A deformation is a displacement field, and its strain is the part that changes lengths

Let the bit of the solid that
sat at the position $\vect x$ move to $\vect x + \vect u(\vect x)$. The vector $\sym{displacement}{\vect u}$ is the
**displacement** in metres, and because it has a value at every point it is a **displacement field**. We
assume that **the displacement changes slowly from point to point**, $|\partial_ju_i| \ll 1$, so that we keep only
first powers of its derivatives.

Take two neighbouring bits a small step $\dd\vect x$ apart. The displacement of the second differs from the first's by
$(\partial_ju_i)\,\dd x_j$, so the step becomes $\dd x_i' = \dd x_i + (\partial_ju_i)\,\dd x_j$. We square its length and
drop the term with two derivatives:

$$|\dd\vect x'|^2 = |\dd\vect x|^2 + 2\,\dd x_i\,(\partial_ju_i)\,\dd x_j .$$

If the table $\partial_ju_i$ were antisymmetric, swapping $i$ and $j$ would turn the last term into its own negative,
so it would be zero. Only the symmetric part changes lengths, and that part is the **strain**,

$$\boxed{\;\sym{strain-tensor}{u_{ij}} = \tfrac12\bigl(\partial_iu_j + \partial_ju_i\bigr) ,\;} \label{eq:strain}$$

a symmetric table of pure numbers. Taking the square root to first order, a step along the unit vector $\hat n$ grows
by the fraction $u_{ij}\hat n_i\hat n_j$. This is the strain of
[section 1.4](/tutorial/newton/tides/#a-swaying-person-makes-the-signal-that-ligo-must-keep-out), a change of length
over the length, now given for every direction at once.[^gw]

The antisymmetric part acts on $\dd\vect x$ as a cross product with a fixed vector (section
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise)), a small turn of the
neighbourhood. A body turned rigidly through the small angle $\vect\theta$ has $\vect u = \vect\theta\times\vect x$,
whose table $\partial_ju_i = \epsilon_{ikj}\theta_k$ is antisymmetric, so a rigid turn has no strain, as it must.

The strain is symmetric, so it has three perpendicular eigen-axes
([section 3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes)). A
small box with its edges along them has each edge stretched by its eigenvalue, so its volume becomes $V(1 + u_{11})(1 + u_{22})(1 + u_{33})$, which is $V(1 + u_{kk})$ to first order. The trace is the
fractional change of volume:

$$\frac{\delta V}{V} = u_{kk} = \nabla\cdot\vect u .$$

So the
[split of section 1.5](/tutorial/newton/five-numbers/#every-symmetric-table-splits-into-a-part-that-changes-size-and-a-part-that-changes-shape)
applies to the strain as to the tide. The trace part $\tfrac13u_{kk}\delta_{ij}$ changes the volume, and so the
density. The trace-free part $\tilde u_{ij} = u_{ij} - \tfrac13\delta_{ij}u_{kk}$ changes only the shape, and a
deformation that has only this part is a **shear**. Figure [](#fig:strain) sets the three side by side.

**An example.** The displacement in a ball of radius $R$ is $\vect u = (q/R)(-x/2, -y/2, z)$, where the amplitude $q$
is in metres. Its table $\partial_ju_i$ is $(q/R)\,\mathrm{diag}(-\tfrac12, -\tfrac12, 1)$, already
symmetric, so this is the strain, and its trace is zero: a pure shear. The poles at $z = \pm R$ move outward by $q$
and the equator inward by $q/2$, so the ball becomes slightly longer along $z$ at the same volume and the density
changes nowhere. **A non-example** is the rigid turn, which moves every bit and strains none.

![Look first at the right-hand square: it has turned, but no distance within it has changed, so its strain is
zero. The shear on the left stretches the square along one diagonal (orange) and squeezes it along the other
(blue) at fixed area; the middle square changes its area at fixed shape. The deformations are exaggerated.](tut-elastic-strain){#fig:strain}

## Stress is force per area, and it too is a symmetric table

Imagine a small flat face of area $\dd A$ inside the solid, with the unit normal $\hat n$. The material on the side
to which $\hat n$ points pulls on the face with a force proportional to the area,

$$\dd F_i = \matter T_{ij}\,\hat n_j\,\dd A .$$

The table $\sym{stress-tensor}{\matter T_{ij}}$ is the **stress**, in pascals ($1\unit{Pa} = 1\unit{N\,m^{-2}}$): its
entry $\matter T_{ij}$ is component $i$ of the force per area on a face whose normal points along $j$. A positive
diagonal entry is a tension, a negative one a compression.

The stress is symmetric. Take a small cube of side $a$ and density $\matter\rho$. The sideways forces on its four
faces parallel to the $z$ axis give it a torque $(\matter T_{yx} - \matter T_{xy})\,a^3$ about that axis, while its
[moment of inertia](/tutorial/newton/motion/#a-turning-body-keeps-the-spread-of-its-mass-in-a-table-of-inertia) about
it is $\matter\rho a^5/6$.[^cube] Its angular acceleration, $6(\matter T_{yx} - \matter T_{xy})/\matter\rho a^2$, would
grow without limit as the cube shrinks, but small bits of a solid do not spin up in this way, so $\matter T_{xy} =
\matter T_{yx}$. Figure [](#fig:stress) shows these entries on
two faces of a cube.

A fluid at rest pushes straight inward on every face, equally in every direction, so its stress is
$\matter T_{ij} = -p\,\delta_{ij}$, with $p$ the **pressure**; for any stress we define $p = -\tfrac13\matter T_{kk}$.
The air presses on us with $10^5\unit{Pa}$.

On a small box of volume $\dd V$ the net force along $i$ is the difference of the pulls on opposite faces,
$\partial_j\matter T_{ij}\,\dd V$, so Newton's law for each bit is

$$\matter\rho\,\ddot u_i = \partial_j\matter T_{ij} . \label{eq:newton-solid}$$

The units agree: a pascal per metre is a newton per cubic metre.

![Look first at the face normal to $x$: the force on it per area is the column $\matter T_{ix}$, one component along
its normal and two along the face. The ticks mark the equal lengths of $\matter T_{xy}$ and $\matter T_{yx}$, which keep
the cube from spinning.](tut-elastic-stress){#fig:stress}

## In a uniform solid the stress answers each part of the strain with its own modulus

We assume that **the strains are small**, so that the stress is
proportional to the strain (**Hooke's law**) and depends on it alone, and that **the material is isotropic**: it has no
preferred direction, so turning a strain turns its stress in the same way. Steel, made of small crystal grains pointing
every way, is isotropic over many grains; so is glass, whose atoms are in no regular order. A single crystal is not.

Choose axes along the eigen-axes of the strain, in which it is diagonal. A turn of the axes is a matrix $O$, which
turns a table $u$ into $OuO^{\mathsf T}$ ([section 1.1](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow)).
Isotropy says that the stress of a turned strain is the turned stress,
$\matter T(OuO^{\mathsf T}) = O\,\matter T(u)\,O^{\mathsf T}$. The half turn about axis 1 is
$O = \mathrm{diag}(1, -1, -1)$, and it leaves a diagonal strain unchanged, $OuO^{\mathsf T} = u$. So the stress obeys
$\matter T = O\matter TO^{\mathsf T}$. But this turn reverses the signs of $\matter T_{12}$ and $\matter T_{13}$, so both
are zero, and a half turn about axis 2 makes $\matter T_{23}$ zero: the stress is diagonal in the axes of the strain.

A strain $u_{11}$ alone gives some stress $C_1u_{11}$ along axis 1. A quarter turn about axis 1 exchanges axes 2 and 3
and leaves this strain alone, so the stresses along 2 and 3 are equal, $C_2u_{11}$. Quarter turns carry any axis to any
other, so the same two numbers serve every axis. Adding the effects of the three strains,

$$\matter T_{11} = C_1u_{11} + C_2\,(u_{22} + u_{33}) = (C_1 - C_2)\,u_{11} + C_2\,u_{kk} ,$$

and the same for the other axes. As tables, $\matter T_{ij} = (C_1 - C_2)\,u_{ij} + C_2\,u_{kk}\,\delta_{ij}$, which
holds in every set of axes because both sides turn by the same rule. We put in $u_{ij} = \tilde u_{ij} +
\tfrac13u_{kk}\delta_{ij}$ and name the two numbers that appear, $2\matter\mu = C_1 - C_2$ and $\matter K = C_2 +
\tfrac13(C_1 - C_2)$:

$$\boxed{\;\matter T_{ij} = \matter K\,u_{kk}\,\delta_{ij} + 2\matter\mu\,\tilde u_{ij} .\;} \label{eq:hooke}$$

The number $\sym{bulk-modulus}{\matter K}$ is the **bulk modulus** and $\sym{shear-modulus}{\matter\mu}$ the **shear
modulus**, or rigidity, both in pascals because the strain has no unit. The trace of [](#eq:hooke) gives
$p = -\matter K\,\delta V/V$, so $\matter K$ is the pressure needed for each unit of fractional loss of volume, and
$\matter\mu$ resists a change of shape. An isotropic solid answers the part of the strain that changes size and the
part that changes shape separately, each with one number.[^young]

**A number.** Steel has $\matter\mu = 71\unit{GPa}$
([*A solid carries two kinds of sound*](#a-solid-carries-two-kinds-of-sound) below). Let a shear stress $\tau$ as large
as the pressure of the air act along the sides of a small square of it. By [](#eq:hooke) its strain is $\tilde
u_{xy} = \tau/2\matter\mu$, and in a pure shear each side turns by $u_{xy}$,[^angle] $7 \times 10^{-7}$ radians. The
angle between the sides changes by $\tau/\matter\mu = 1.4 \times 10^{-6}$ radians. **A limit.** A liquid at rest has
$\matter\mu = 0$ (section 4.4), and [](#eq:hooke) becomes a pure pressure.

## A strain stores energy, half the stress times the strain

We want the energy stored in each cubic metre of a strained solid. When the displacement of a piece of solid changes by
a small $\delta\vect u$, its neighbours do the work $\oint\matter T_{ij}\hat n_j\,\delta u_i\,\dd A$ on it through its
surface. The [divergence theorem](/tutorial/newton/gauss-and-poisson/#the-divergence-theorem-adds-up-the-boxes) turns
this into a volume integral, and the product rule splits it in two:

$$\int\partial_j\bigl(\matter T_{ij}\,\delta u_i\bigr)\,\dd V = \int(\partial_j\matter T_{ij})\,\delta u_i\,\dd V +
\int\matter T_{ij}\,\partial_j\delta u_i\,\dd V .$$

By [](#eq:newton-solid) the first term is $\int\matter\rho\ddot u_i\,\delta u_i\,\dd V$, the work that speeds the bits
up; the second is stored. Since $\matter T_{ij}$ is symmetric, it meets only the symmetric part of $\partial_j\delta
u_i$, so the stored work per volume is $\matter T_{ij}\,\delta u_{ij}$. We let the strain grow as $s\,u_{ij}$ with $s$
from 0 to 1, so that the stress is $s\matter T_{ij}$, and add up the work:
$\int_0^1s\,\matter T_{ij}u_{ij}\,\dd s = \tfrac12\matter T_{ij}u_{ij}$. With [](#eq:hooke), and because
$\delta_{ij}\tilde u_{ij} = 0$ makes $\tilde u_{ij}u_{ij} = \tilde u_{ij}\tilde u_{ij}$,

$$\boxed{\;\sym{elastic-energy-density}{\varepsilon_{\rm el}} = \tfrac12\matter K\,u_{kk}^2 + \matter\mu\,\tilde
u_{ij}\tilde u_{ij} ,\;}$$

in joules per cubic metre, the same as pascals. Both terms are positive for every strain when $\matter K > 0$ and $\matter\mu > 0$, so every deformation costs energy
and the solid springs back.

For the shape above, $u_{kk} = 0$ and $\tilde u_{ij}\tilde u_{ij} = (\tfrac14 + \tfrac14 + 1)(q/R)^2 =
\tfrac32(q/R)^2$, the same at every point. The energy of a ball of volume $V$ is then

$$\tfrac32\matter\mu\,V\,\frac{q^2}{R^2} = \frac12\cdot\frac{3\matter\mu V}{R^2}\,q^2 ,$$

so the ball resists this shape as a spring resists a stretch, with the stiffness $3\matter\mu V/R^2$. For the steel
ball, $V = 4.19 \times 10^{-3}\unit{m^3}$ and the stiffness is $8.9 \times 10^{10}\unit{N\,m^{-1}}$.

## A solid carries two kinds of sound

We put Hooke's law [](#eq:hooke) into [](#eq:newton-solid). The trace part gives $\matter K\,\partial_i(\nabla\cdot\vect u)$, and the shear part gives
$2\matter\mu\,\partial_j\tilde u_{ij} = \matter\mu\nabla^2u_i + \tfrac13\matter\mu\,\partial_i(\nabla\cdot\vect
u)$,[^shear-term] so

$$\matter\rho\,\ddot u_i = \matter\mu\,\nabla^2u_i + \bigl(\matter K + \tfrac13\matter\mu\bigr)\,\partial_i(\nabla\cdot\vect u) .
\label{eq:navier}$$

A displacement across the direction of travel, $\vect u = u(x, t)\,\hat y$, has no divergence, so
$\matter\rho\,\partial_t^2u = \matter\mu\,\partial_x^2u$. For a displacement along it, $\vect u = u(x, t)\,\hat
x$, we have $\nabla\cdot\vect u = \partial_xu$, both terms of [](#eq:navier) contribute, and $\matter\rho\,\partial_t^2u =
(\matter K + \tfrac43\matter\mu)\,\partial_x^2u$. Each has the form $\partial_t^2u = c^2\partial_x^2u$, which any shape $u = f(x - ct)$ solves, since both sides are
then $c^2f''$. So a disturbance of either kind travels without changing its shape, at the speed

$$\boxed{\;\sym{shear-speed}{c_T} = \sqrt{\frac{\matter\mu}{\matter\rho}}, \qquad
\sym{compressional-speed}{c_L} = \sqrt{\frac{\matter K + \tfrac43\matter\mu}{\matter\rho}} .\;}$$

The first is the speed of **shear sound** (transverse), the second of **compressional sound** (longitudinal). The units agree: a pascal over kilograms per cubic metre is a square metre per square second
(section [5.1](/tutorial/waves/wave-equation/#a-shear-in-a-solid-travels-and-its-law-is-the-wave-equation) solves such
wave equations in full).

**Numbers.** We take for steel $c_T = 3000\unit{m\,s^{-1}}$ and $\matter\rho = 7850\unit{kg\,m^{-3}}$, so
$\matter\mu = \matter\rho c_T^2 = 7.1 \times 10^{10}\unit{Pa}$. Compressional sound in steel is measured to travel 1.84
times as fast as shear sound, and $(c_L/c_T)^2 = \matter K/\matter\mu + \tfrac43$, so $\matter K = (1.84^2 -
\tfrac43)\,\matter\mu = 2.05\,\matter\mu = 145\unit{GPa}$ and $c_L = 5520\unit{m\,s^{-1}}$.[^steel] A gravitational wave travels at $c$, and $c_T/c = 1.0 \times 10^{-5}$.[^wavenumber] Shear
sound at 15 kHz is $3000/15{,}100 = 0.20\unit{m}$ long, the diameter of the steel ball: a body's lowest note is about
the one whose wave fits across it.

**A limit.** A liquid has $\matter\mu = 0$, so $c_T = 0$, and its compressional sound is ordinary sound,
$c_L = \sqrt{\matter K/\matter\rho} = 1480\unit{m\,s^{-1}}$ for water ($\matter K = 2.2\unit{GPa}$), as measured.

## Masses on springs move in normal modes

We want every small motion of $N$ masses joined by springs. We collect the $3N$ displacements in one list
$\mathbf q$, in metres, and assume that **each spring is unstretched when the body is at rest**. Then for small
displacements the stretch of each spring is linear in $\mathbf q$, and the stored energy, a sum of terms
$\tfrac12k\,(\text{stretch})^2$, is a quadratic form $\tfrac12\mathbf q^{\mathsf T}\sym{stiffness-matrix}{\mathbf K}\mathbf q$
that is never negative, with $\mathbf K$ a symmetric $3N\times3N$ **stiffness matrix** in newtons per metre. The kinetic energy is $\tfrac12\dot{\mathbf
q}^{\mathsf T}\sym{mass-matrix}{\mathbf M}\dot{\mathbf q}$, with the diagonal **mass matrix** $\mathbf M$ holding each
mass three times.[^bold] The force is minus the gradient of the stored energy, $-\mathbf K\mathbf q$, so Newton's law is

$$\mathbf M\ddot{\mathbf q} = -\mathbf K\mathbf q .$$

We put $\mathbf q = \mathbf M^{-1/2}\mathbf y$, so that each coordinate is multiplied by the square root of its mass,
into the law, and multiply on the left by $\mathbf M^{-1/2}$. This gives $\ddot{\mathbf y} = -D\mathbf y$, with
$D = \mathbf M^{-1/2}\mathbf K\mathbf M^{-1/2}$ a symmetric matrix. By the
[spectral theorem](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes) of
section 3.4 it has $3N$ perpendicular unit eigenvectors $\mathbf e_n$. The eigenvalue of each is $\mathbf e_n^{\mathsf
T}D\mathbf e_n$, twice the energy stored when $\mathbf q = \mathbf M^{-1/2}\mathbf e_n$, which is never negative, so
we write it as $\omega_n^2$. Writing $\mathbf y = \sum_na_n(t)\,\mathbf e_n$ and multiplying by $\mathbf e_n^{\mathsf T}$ separates the law of
motion into $3N$ independent ones:

$$\boxed{\;\ddot a_n = -\omega_n^2\,a_n, \qquad \mathbf q(t) = \mathbf M^{-1/2}\sum_na_n(t)\,\mathbf e_n .\;}$$

Each $a_n$ is an [oscillator](/tutorial/response/oscillator/#a-mass-on-a-spring-swings-at-one-frequency) of frequency
$\omega_n$. Each pattern $\mathbf v_n = \mathbf M^{-1/2}\mathbf e_n$ is a **normal mode**, a motion in
which every mass swings in step at one frequency, and every small motion is a sum of them. The amplitude $a_n$ is mass-weighted, in $\mathrm{kg^{1/2}\,m}$. We call $\mathbf v^{\mathsf T}\mathbf M\mathbf w$ the **mass-weighted
product** of two motions. The modes are perpendicular in it, since $\mathbf v_m^{\mathsf T}\mathbf M\mathbf v_n =
\mathbf e_m^{\mathsf T}\mathbf e_n$ is 1 when $m = n$ and 0 otherwise.

A displacement that stretches no spring stores no energy, so it is a mode with $\omega_n = 0$, a **zero mode**. It does
not ring: the body drifts or turns. A free body has six, the three translations and the three small turns of the first
section, and no others (the stretch problem proves this for a solid). **Numbers.** A ball of 924 masses has 2772 modes, six of them zero; a shell of the same lattice, the 668 masses more
than four spacings from the centre, has 2004.[^lattice]

**The sum of oscillators, proved.** We add friction and a push. We assume that **the friction damps each mode on its
own**: it is a force $-\Gamma_n\dot a_n$ on each mode, with the [damping
rate](/tutorial/response/oscillator/#friction-makes-the-swing-die-away-and-the-quality-factor-counts-how-slowly)
$\Gamma_n$ of section 4.1, and it couples no two modes. A friction on each mass in proportion to its mass,
$-\Gamma\mathbf M\dot{\mathbf q}$, does this, because it becomes $-\Gamma\dot{\mathbf y}$.[^damping] A body's friction
is measured mode by mode, as the width of each line, and a weak friction that couples two modes changes the answer only
slightly. With a force $F$ on one coordinate $a$ of mass $m_a$, the same steps give
$\ddot a_n + \Gamma_n\dot a_n + \omega_n^2a_n = e_{n,a}F/\sqrt{m_a}$, where $e_{n,a}$ is the entry of $\mathbf e_n$ at
that coordinate. Each mode is a driven oscillator of unit mass, and coordinate $a$ moves by $\sum_na_ne_{n,a}/\sqrt{m_a}$, so its
response is

$$\chi_{aa}(\omega) = \sum_n\frac{c_n^2}{\omega_n^2 - \omega^2 - i\Gamma_n\omega}, \qquad c_n = \frac{e_{n,a}}{\sqrt{m_a}} ,$$

the [sum of oscillators](/tutorial/response/oscillator/#a-body-with-many-modes-answers-as-a-sum-of-oscillators) stated
in section 4.1, now proved for every body of masses and springs whose friction damps each mode on its own. The number
$c_n$ is how far mode $n$ moves the pushed coordinate per unit of its mass-weighted amplitude, and $c_n^2$ is the weight
of section 4.1. The weights add up to $1/m_a$, because the $\mathbf e_n$ are the columns of an orthogonal matrix, whose
rows have length one, so $\sum_ne_{n,a}^2 = 1$. The same steps work for any push and any reading; section
[4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density) reads the
$c_n$ of a body's moments off its mode shapes.

::: gap
A solid is the limit of such a lattice as the spacing shrinks. Its modes are displacement fields $\vect u_n(\vect x)$,
perpendicular in the mass-weighted product, which becomes $\int\matter\rho\,\vect u_m\cdot\vect u_n\,\dd V = 0$ for
$m \ne n$, and every small motion is a sum of them. The limit needs symmetric operators on functions and is stated
without proof.
:::

## A guessed shape overestimates the lowest note, and a good guess comes close

To find the lowest frequency without solving an eigenproblem of 2772 rows, take any trial shape $\mathbf q$ and write
$\mathbf M^{1/2}\mathbf q = \sum_na_n\mathbf e_n$. Then $\mathbf q^{\mathsf T}\mathbf K\mathbf q = \sum_n\omega_n^2a_n^2$
and $\mathbf q^{\mathsf T}\mathbf M\mathbf q = \sum_na_n^2$, so their ratio is the
[Rayleigh quotient](/tutorial/noise/symmetric-matrices/#the-rayleigh-quotient-finds-the-strongest-and-weakest-directions)
of $D$ (section 3.4): an average of the $\omega_n^2$, weighted by the shares $a_n^2/\sum_ma_m^2$ of the modes in the
shape, and never below the smallest of them. We assume that **the trial shape has no part along the zero modes**, and
call $\omega_1$ the lowest frequency among the modes it contains. Then

$$\boxed{\;\omega_1^2 \le \frac{\mathbf q^{\mathsf T}\mathbf K\mathbf q}{\mathbf q^{\mathsf T}\mathbf M\mathbf q} ,\;}$$

with equality only when the shape is that mode. The numerator is twice the energy stored at unit amplitude and the
denominator twice the kinetic energy at unit speed: stiffness over mass, as for one cart. This is **Rayleigh's
method**. The quotient changes only in second order near an eigenvector, so an error in the shape enters the frequency
only through its square, and a good guess comes close.

For a solid the numerator becomes $2\int\varepsilon_{\rm el}\,\dd V$ and the denominator $\int\matter\rho|\vect
u|^2\,\dd V$. The trial shape has no part along the zero modes, because its mean displacement and angular momentum
vanish by the ball's symmetry (the stretch problem below). Its kinetic energy is
$\tfrac12\dot q^2(\matter\rho/R^2)\int(\tfrac14x^2 + \tfrac14y^2 + z^2)\,\dd V$. This needs the **second moment**
$\int\matter\rho\,x_ix_j\,\dd V$, in $\mathrm{kg\,m^2}$, the table of how the mass is spread along each pair of
directions. For a [round body](/tutorial/newton/motion/#a-round-body-has-the-same-moment-about-every-axis) it is
$\tfrac13\delta_{ij}\int\matter\rho r^2\,\dd V$ (section 1.6), which for a uniform ball of mass $\matter M$ is
$\tfrac15\matter MR^2\delta_{ij}$. So the kinetic energy is $\tfrac12\cdot\tfrac{3\matter M}{10}\dot q^2$: the shape
carries an **effective mass** of $3\matter M/10$, less than $\matter M$ because the bits near the centre hardly move.
With the **effective stiffness** $3\matter\mu V/R^2$ and $\matter M = \matter\rho V$,

$$\boxed{\;\omega_1 \le \sqrt{\frac{3\matter\mu V/R^2}{3\matter M/10}} = \sqrt{10}\,\frac{c_T}{R} .\;}
\label{eq:ball-note}$$

**A number.** For $R = 0.10\unit{m}$ and $c_T = 3000\unit{m\,s^{-1}}$ the bound is $9.49 \times
10^4\unit{s^{-1}}$, a frequency $f = \omega/2\pi$ of 15.1 kHz.

**The exact note** (stated, not derived). Lamb (1882) solved the free elastic sphere exactly, with functions that
generalize the Bessel functions of
[section 3.6](/tutorial/noise/bessel-and-airy/#the-circular-ripple-obeys-bessels-equation) from a circle to a sphere.
The lowest mode that changes the ball's mass quadrupole has $\omega R/c_T = 2.645$ when $c_L/c_T = 1.84$: for the steel
ball, 12.6 kHz. One mode is lower, a twist at 11.9 kHz in which the two hemispheres turn against each other. The twist
moves no mass toward or away from the centre, so it leaves the quadrupole unchanged, and the trial shape contains none
of it.[^twist] Modes that move each part only around the centre are **torsional**, and modes that move mass toward or
away from the centre are **spheroidal**. So [](#eq:ball-note) bounds the 12.6 kHz mode, the lowest spheroidal
quadrupole mode: Rayleigh's $\sqrt{10} = 3.16$ lies 20% above 2.645, on the side the bound requires, because the true
mode is not a uniform shear. Both values scale as $c_T/R$, so a ball of half the radius rings an octave higher. Figure
[](#fig:trial) shows the shape and the three notes.

![Look first at the arrows, the trial displacement in a section through the axis: the shape pulls the ball out
along its axis (orange, away from the centre) and in round its equator (blue, toward it), most at the surface. The
dashed outlines are the surface $r = R + q\,P_2(\cos\vartheta)$ at the two ends of a swing, with $q = \pm0.15R$; they
and the arrows are exaggerated, and the frequencies are exact, for $c_T = 3000\unit{m\,s^{-1}}$ and
$R = 10\unit{cm}$.](tut-elastic-trial){#fig:trial}

::: try {#normal-modes}
A disc of nineteen equal masses on a triangular lattice, joined by equal springs, lies in a plane: thirty-eight
coordinates, three zero modes and thirty-five modes that ring. On the left the disc rings in the mode you pick, or holds
a shape you make by dragging its masses; a stretched spring is orange and a squeezed one blue. *Release* lets the shape
swing as the sum of its modes, and *Squash* sets the shape $\vect u = (x, -y)$. On the right, bars show the share of the
shape in each mode, and the readouts give the shape's Rayleigh quotient, with its parts along the zero modes removed,
beside the lowest note.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, pick
the two modes of the lowest note and compare them with the squash.
:::

## A ringing quadrupole makes a tide

Each bit of mass is carried from $\vect x$ to $\vect x +
\vect u$, so the second moment $\int\matter\rho\,x_ix_j\,\dd V$ changes by $\int\matter\rho\,(u_ix_j + x_iu_j)\,\dd V$ to
first order. For this shape, with $\int\matter\rho\,x_ix_j\,\dd V = \tfrac15\matter MR^2\delta_{ij}$, the change is

$$\frac{2q}{R}\cdot\frac{\matter MR^2}{5}\,\mathrm{diag}\bigl(-\tfrac12, -\tfrac12, 1\bigr) = \tfrac15\matter
MRq\,\mathrm{diag}(-1, -1, 2) ,$$

a quadrupole that is trace-free because the shape keeps the volume. Section 2.3's [quadrupole
tensor](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)
$\matter Q_{ij} = \int\matter\rho\,(3x_ix_j - r^2\delta_{ij})\,\dd V$ changes by three times as much, so $\matter Q_{zz}
= \tfrac65\matter MRq$. On the axis, at the distance $r$, section 2.3's potential is then $\field\Phi =
-\tfrac12G\matter Q_{zz}/r^3 = -\tfrac35G\matter MRq/r^3$. Along the axis, $\partial_z^2$ is the second derivative with
respect to $r$, so the tide of [section
1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it) is

$$\curv{\tE}_{zz} = -\frac{36\,G\matter MRq}{5\,r^5}, \qquad
\boxed{\;|\curv{\tE}_{zz}| = \frac{36\,G\matter MRq}{5\,r^5} ,\;} \label{eq:axis-tide}$$

the tide on the axis. The units agree: $G\matter MRq/r^5$ is in
$\mathrm{m^3\,kg^{-1}\,s^{-2}}\cdot\mathrm{kg}\cdot\mathrm{m^2}/\mathrm{m^5} = \mathrm{s^{-2}}$. For $q > 0$ a ring on
the axis is stretched along it.

**A number.** Heat sets $q$. By the
[equal share](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share) of section
4.2, each term of the energy of the form $\tfrac12\kappa\,y^2$ holds $\tfrac12\kB T$. We treat the trial shape as if it
were a mode, so that $\tfrac12(3\matter\mu V/R^2)\,q^2$ is such a term, and $\langle q^2\rangle =
\kB T/(3\matter\mu V/R^2)$. At 300 K, with $\kB T = 4.14 \times 10^{-21}\unit{J}$, the root-mean-square amplitude is
$q_{\rm rms} = 2.2 \times 10^{-16}\unit{m}$, a quarter of the radius of a proton. The steel ball has $\matter M =
32.9\unit{kg}$, and a metre away [](#eq:axis-tide) gives $3.4 \times 10^{-25}\unit{s^{-2}}$.[^tide] That is $3 \times 10^{16}$ times weaker than the tide of a person at the same distance, and an estimate of the same
quality as the 15 kHz. **A limit.** The tide falls as $r^{-5}$, so at 20 cm it is $5^5 = 3125$ times stronger: the cost
of reading the tremor is distance.

## A tide drives the five quadrupole shapes, one for each of its numbers

The coupling also runs the other way: a tide from outside drives the ball's quadrupole shapes. We generalize the trial
shape to $u_i = q_{ij}x_j/R$, where $q_{ij}$ is a symmetric trace-free table in metres. The axis shape is
$q_{ij} = q\,\mathrm{diag}(-\tfrac12, -\tfrac12, 1)$, and the five numbers of a trace-free table
([section 1.5](/tutorial/newton/five-numbers/)) give five such shapes. We assume that **the tide $\curv{\tE}_{ij}$ of
distant masses is uniform across the ball**, and that it is trace-free there, because those masses lie outside it.

In the frame that falls with the ball's centre, a bit of mass at $\vect x$ has the potential energy
$\tfrac12\curv{\tE}_{ij}x_ix_j$ per kilogram in the tide, since its gradient gives the tidal acceleration
$-\curv{\tE}_{ij}x_j$ of [section 1.4](/tutorial/newton/tides/). When the bit moves to $\vect x + \vect u$, this energy
changes by $\curv{\tE}_{ij}x_iu_j$ to first order. We add over the ball and use the second moment
$\int\matter\rho\,x_ix_k\,\dd V = \tfrac15\matter MR^2\delta_{ik}$:

$$U = \frac{1}{R}\,\curv{\tE}_{ij}\,q_{jk}\int\matter\rho\,x_ix_k\,\dd V = \frac{\matter MR}{5}\,\curv{\tE}_{ij}\,q_{ij} .$$

For the axis shape, $\curv{\tE}_{ij}q_{ij} = q\,(\curv{\tE}_{zz} - \tfrac12\curv{\tE}_{xx} - \tfrac12\curv{\tE}_{yy})
= \tfrac32\,q\,\curv{\tE}_{zz}$, because the trace is zero. The force on the coordinate $q$ is minus the derivative of
the energy, $-\tfrac{3}{10}\matter MR\,\curv{\tE}_{zz}$. We add it to the stiffness and divide by the effective mass
$3\matter M/10$:

$$\ddot q + \omega_1^2\,q = -R\,\curv{\tE}_{zz}, \qquad \omega_1^2 = \frac{10\,c_T^2}{R^2} .$$

Both sides are accelerations. The same steps for a general table $q_{ij}$, with the kinetic energy
$\tfrac12(\matter M/5)\,\dot q_{ij}\dot q_{ij}$ and the stored energy $(\matter\mu V/R^2)\,q_{ij}q_{ij}$, give one
equation for each entry,

$$\boxed{\;\ddot q_{ij} + \omega_1^2\,q_{ij} = -R\,\curv{\tE}_{ij} .\;} \label{eq:sphere-antenna}$$

Each of the five shapes is an oscillator of the same frequency, because the ball is round, and each is driven by its
own entry of the tide. Reading the five amplitudes reads the five numbers of $\curv{\tE}_{ij}$ at one place. **A
limit.** A tide that changes slowly compared with $\omega_1$ holds the ball at $q_{ij} = -R\,\curv{\tE}_{ij}/\omega_1^2$:
a stretch along $z$ ($\curv{\tE}_{zz} < 0$) lengthens the ball along $z$, as it lengthens a ring of free balls.

The same coupling holds for the exact modes. For any mode the energy is
$\int\matter\rho\,\curv{\tE}_{ij}x_iu_j\,\dd V = \tfrac12\curv{\tE}_{ij}\,\delta I_{ij}$, where $\delta I_{ij}$ is the
change of the second moment, $\int\matter\rho\,(u_ix_j + x_iu_j)\,\dd V$, computed in the previous section. So a tide drives a mode exactly in proportion to the
quadrupole the mode makes when it rings. The twist at 11.9 kHz makes none and feels nothing; the five spheroidal
quadrupole modes at 12.6 kHz feel it all.

**A number.** The person a metre away makes a tide of $9.3 \times 10^{-9}\unit{s^{-2}}$ along the line to them. It
holds the steel ball out by $R|\curv{\tE}_{zz}|/\omega_1^2 = 0.10 \times 9.3 \times 10^{-9}/(9.49 \times 10^4)^2 = 1.0
\times 10^{-19}\unit{m}$, two thousand times less than the thermal tremor's $2.2 \times 10^{-16}\unit{m}$. A single ball
therefore reads a steady tide only after long averaging. For a wave at the ball's own note, the quality factor of
[section 4.1](/tutorial/response/oscillator/) multiplies the answer.

Forward (1971) [@Forward1971] proposed such a sphere as a detector for gravitational waves of every direction and polarization, and
Wagoner and Paik (1977) [@WagonerPaik1977] worked out how its five quadrupole modes read the five numbers. Merkowitz and Johnson (1995)
[@MerkowitzJohnson1995] showed that six transducers on the faces of a truncated icosahedron read the five modes with equal sensitivity.

**The idea to keep: a solid stores energy in its strain through two moduli, one for volume and one for shape, and rings
in normal modes whose squared frequencies are stiffness over mass; any guessed shape bounds the lowest note from above,
which gives the steel ball 15 kHz against an exact 12.6 kHz.**

::: problems
### Practice

**[4.3]** Why can Hooke's law for an isotropic solid have only two moduli?

::: solution
Half turns force the stress to be diagonal in the eigen-axes of the strain, and quarter turns leave two numbers, the
answer along a strain and across it; rearranged, they multiply the trace and the trace-free part.
:::

**[4.3]** Rayleigh's method gives 15.1 kHz for the steel ball. Is the true lowest quadrupole note higher or lower, and
what is the note of a steel ball of radius 5 cm?

::: solution
Lower, because the quotient is an average of the squared frequencies in the shape. Lamb's exact note is 12.6 kHz; both
scale as $1/R$, so the 5 cm ball rings at 25 kHz (30 kHz by Rayleigh's estimate).
:::

**[4.3]** Aluminium has $\matter\mu = 26\unit{GPa}$ and $\matter\rho = 2700\unit{kg\,m^{-3}}$. Find its speed of shear
sound and Rayleigh's estimate of the lowest quadrupole note of an aluminium ball 10 cm in radius.

::: solution
$c_T = \sqrt{2.6 \times 10^{10}/2700} = 3100\unit{m\,s^{-1}}$, so $\omega = \sqrt{10}\,c_T/R = 9.81 \times
10^4\unit{s^{-1}}$ and $f = 15.6\unit{kHz}$, a little above steel.
:::

**[4.3]** A tide with only the entries $\curv{\tE}_{xy} = \curv{\tE}_{yx}$ acts slowly on a ball. Which shape does it
drive, and how does the ball deform?

::: solution
By [](#eq:sphere-antenna) only $q_{xy} = q_{yx} = -R\,\curv{\tE}_{xy}/\omega_1^2$ responds, so $\vect u =
(q_{xy}/R)(y, x, 0)$. This is a pure shear that lengthens the ball along one diagonal of the $x$-$y$ plane and shortens
it along the other, in the same way as the tide itself stretches and squeezes along the two diagonals.
:::

### Stretch

**[4.3]** The Moon makes a tide of about $1.7 \times 10^{-13}\unit{s^{-2}}$ at the Earth. By how much does it hold the
steel ball out of round, and what would a ball 1 m in radius of the same steel do?

::: solution
$q = R|\curv{\tE}|/\omega_1^2 = R^3|\curv{\tE}|/10c_T^2$. For $R = 0.10\unit{m}$ this is $1.7 \times
10^{-16}/(9 \times 10^7) = 1.9 \times 10^{-24}\unit{m}$; for $R = 1\unit{m}$ it is a thousand times more,
$1.9 \times 10^{-21}\unit{m}$, because the stiffness falls as $1/R^2$ while the tidal force grows as $R$. The response
grows as the cube of the size.
:::

**[4.3]** Show that a displacement field has no strain anywhere exactly when it is a rigid motion, a uniform translation
and a small turn, $\vect u = \vect a + \vect\theta\times\vect x$, so that a free solid's six zero modes are its rigid
motions. (For the second half, write $\partial_k\partial_ju_i$ in terms of derivatives of the strain.) Then show that
the trial shape has no part along them: its mass-weighted product $\int\matter\rho\,\vect u\cdot\vect v\,\dd V$ with
each rigid motion $\vect v$ is zero.

::: solution
A rigid motion has an antisymmetric $\partial_ju_i$, so its strain is zero. For the converse, each derivative of the strain is half a sum of two second derivatives, $\partial_ju_{ik} =
\tfrac12(\partial_i\partial_ju_k + \partial_j\partial_ku_i)$. Writing out three of them, two
terms cancel and $\partial_j\partial_ku_i$ appears twice:

$$\partial_k\partial_ju_i = \partial_ju_{ik} + \partial_ku_{ij} - \partial_iu_{jk} .$$

If the strain is zero everywhere, every second derivative of $\vect u$ is zero, so the table $\partial_ju_i$ is the same
at every point and antisymmetric, hence $\epsilon_{ikj}\theta_k$ for one fixed $\vect\theta$, and
$\vect u = \vect a + \vect\theta\times\vect x$.

For the trial shape, the product with a translation $\vect a$ is $\int\matter\rho\,\vect u\cdot\vect a\,\dd V = 0$,
because each component of $\vect u$ is odd in one coordinate. With a turn it is $\int\matter\rho\,\vect
u\cdot(\vect\theta\times\vect x)\,\dd V = \vect\theta\cdot\int\matter\rho\,\vect x\times\vect u\,\dd V$. The $z$ part of
$\vect x\times\vect u$ is $(q/R)(-xy/2 + yx/2) = 0$, and the $x$ part, $(3q/2R)\,yz$, integrates to zero under the
reflection $y \to -y$; the $y$ part does the same.
:::

### The camera

**[4.3]** The trial displacement moves mass only at the surface. Show that the surface of the displaced ball is
$r = R + q\,P_2(\cos\vartheta)$, where $\vartheta$ is the angle from the $z$ axis and $P_2$ the Legendre polynomial of
[section
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
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV): the lattice ball of 924 masses, the steel ball's
  note, tremor and tide of $3 \times 10^{-25}\unit{s^{-2}}$, and Figure [](/paper/#fig:tremor).
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A) builds the lattice, defines the weights
  $c_n$, and gives the trial shape with its effective mass, stiffness, quadrupole and tide.
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) puts the rigidity $\matter\mu$ into the
  Love number of a ball (section 4.6).
- [Section VI](/paper/#sec:thermal) uses $c_T$ and $c_L$ in [](/paper/#eq:surface-glow); [Section VII](/paper/#sec:no-lens)
  uses $c_T$ in [](/paper/#eq:optics-bound) (section 5.5); [Section V](/paper/#sec:waves) writes the stress
  $\matter T_{kl}$ in [](/paper/#eq:wave-zone) (section
  [5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source)).
:::

::: deeper
- L. D. Landau and E. M. Lifshitz, *Theory of Elasticity* (3rd ed., Pergamon, 1986), sections 1 to 5 and 22, derive
  strain, stress, Hooke's law and the two sounds.
- H. Lamb, "On the vibrations of an elastic sphere", *Proceedings of the London Mathematical Society* 13 (1882),
  189–212, finds the exact modes quoted here.
:::

[^letters]: Several letters return with new meanings: $\vect u$ is a displacement, $\matter K$ the bulk modulus,
    $\matter\mu$ the shear modulus, and $\matter T_{ij}$ with indices the stress, while a temperature $T$ never has
    indices. The strain is $u_{ij}$, Landau and Lifshitz's letter. A turn of a table is $O$ here, because $R$ is the
    ball's radius.

[^gw]: A gravitational wave of strain $\field h_{ij}$ moves free masses by $\tfrac12\field h_{ij}x_j$, so its strain in
    the sense of [](#eq:strain) is $\tfrac12\field h_{ij}$.

[^sites]: The nearest neighbours of a site lie one cube edge away, along the axes, and the twelve next-nearest
    $\sqrt2$ edges away, across a face diagonal. First shown in *The gravitational camera*
    (Mohsenvand 2026), Appendix A.

[^cube]: Centre the cube on the origin. Its face at $x = a/2$ feels the force $\matter T_{yx}a^2$ along $y$ with the
    lever arm $a/2$, a torque $\tfrac12\matter T_{yx}a^3$ about the $z$ axis; the opposite face adds the same, and the
    two faces normal to $y$ give $-\matter T_{xy}a^3$. The moment of inertia is $\int\matter\rho\,(x^2 + y^2)\,\dd V$,
    and each term is $\matter\rho\,a^2\cdot a^3/12$.

[^angle]: A pure shear $\vect u = s\,(y, x, 0)$ has $u_{xy} = s$. It turns each of the two sides by $s$ toward the
    other, so the right angle closes by $2s$; the factor 2 in [](#eq:hooke) makes $\matter\mu$ the stress for each
    radian of change in the angle.

[^damping]: A friction $-(\alpha\mathbf M + \beta\mathbf K)\dot{\mathbf q}$ also damps each mode on its own, with
    $\Gamma_n = \alpha + \beta\omega_n^2$, because it becomes $-(\alpha + \beta D)\dot{\mathbf y}$ and the $\mathbf e_n$
    are eigenvectors of $D$.

[^young]: Young's modulus is $E_{\rm Y} = 9\matter K\matter\mu/(3\matter K + \matter\mu)$.

[^shear-term]: With $\tilde u_{ij} = \tfrac12(\partial_iu_j + \partial_ju_i) - \tfrac13\delta_{ij}\partial_ku_k$, the
    shear part is $2\matter\mu\,\partial_j\tilde u_{ij} = \matter\mu\,\partial_i\partial_ju_j + \matter\mu\,\partial_j
    \partial_ju_i - \tfrac23\matter\mu\,\partial_i\partial_ku_k$. The first term is $\matter\mu\,\partial_i(\nabla\cdot
    \vect u)$, the second is $\matter\mu\nabla^2u_i$, and the first and third leave
    $\tfrac13\matter\mu\,\partial_i(\nabla\cdot\vect u)$.

[^steel]: Handbook steels have $c_T \approx 3200$ and $c_L \approx 5900\unit{m\,s^{-1}}$, in nearly the same ratio.

[^wavenumber]: So at the same frequency a gravitational wave is a hundred thousand times longer than shear sound
    (section 5.1).

[^bold]: The matrices are bold so that $\mathbf M$ is not the ball's mass and $\mathbf K$ not the bulk modulus.

[^lattice]: The lattice has 924 sites within six spacings of the centre, less the centre, and 668 beyond four; its
    stiffness matrix has exactly six zero eigenvalues. On it the trial shape lies 85% at one frequency (a pair of modes
    of equal frequency), and its quotient is 14% above that frequency. First shown in
    *The gravitational camera* (Mohsenvand 2026), Sec. IV and Appendix A.

[^tide]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV.

[^twist]: For $c_L/c_T = \sqrt3$ the quadrupole mode has $\omega R/c_T = 2.640$, so the ratio of the sounds hardly
    matters; in the twist $\omega R/c_T = 2.50$. The twist makes no Newtonian tide; it carries only a current
    quadrupole, whose gravitomagnetic field (section
    [7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight))
    is weaker by about $v/c$.
