---
id: '6.6'
title: "Maxwell's field as one complex vector F = E + icB; boosts as complex rotations"
question: 'An observer who moves past an electric charge measures a magnetic field as well as an electric one. How can a change of velocity be a rotation by an imaginary angle, and what does it leave unchanged?'
part: '6'
requires: ['1.1', '1.3', '1.5b', '1.7', '6.1', '6.2', '6.3']
paper: [sec:one-pixel, eq:W, eq:square, eq:one-wave, eq:stars, eq:polar, eq:star-velocity, fig:stars, fig:speedometer, sec:regimes]
figures: [fig:stars, fig:speedometer]
live: [stars, complex-field]
depth: A
---

An observer who moves past an electric charge measures a magnetic field as well as an electric one, and how the field is
shared between the two depends on how the observer moves. For light the exact statement is that a change of velocity is
a rotation by an imaginary angle, and that light's field is one complex vector. Light also has two special directions at
every point, drawn in the bottom row of Figure [](/paper/#fig:stars).

{{paper fig:stars}}

How can a change of velocity be a rotation, and what does it leave unchanged? Light is the simplest place to see it,
because its six numbers are three complex ones, and a boost acts on them as a turn acts on an arrow, with an imaginary
angle. Section 9.3 does the same for gravity's ten numbers.[^p-one]

::: plain
Light at one point is described by two arrows, the electric field and the magnetic field, defined by the push that
light gives a small electric charge: the electric field pushes on any charge, and the magnetic field pushes only on a
moving one.

The two arrows can be joined into one arrow with complex components: the electric field plus $i$ times the speed of
light times the magnetic field. With this arrow, Maxwell's four laws become two, and a light wave becomes a single
complex number times a fixed direction.

An observer who moves reads a different electric and magnetic field. In the joined arrow the change is a turn of the
axes by an imaginary angle. A turn keeps the "square" of an arrow, so one complex number made from the two fields is the
same for every observer. That number limits what a sensor of light can learn: it can never find more than two of the
three parts of its own velocity.
:::

## The electric and magnetic fields are defined by the force on a test charge

Two quantities describe light at one point, and we define them by what they do to a charge. A body can
carry an electric **charge** $q$, measured in coulombs (C), which may be positive or negative. A **test charge** is a
charge so small that it does not move the other charges near it, so that it measures the field around it without
changing it, as the test mass of section
[1.2](/tutorial/newton/field-and-potential/#the-field-is-the-pull-per-unit-mass-and-fields-add) measured gravity without
disturbing the masses. A test charge at rest at a point feels a force proportional to its charge, and the **electric
field** $\sym{electric-field}{\light{\vect E}}$ is that force per unit charge:

$$\text{force on a charge at rest} = q\,\light{\vect E} .$$

So $\light{\vect E}$ is measured in newtons per coulomb, which is the same unit as volts per metre,
$\mathrm{V\,m^{-1}}$. When the test charge moves with a velocity $\vect v$, in metres per second, it feels a second
force as well, at right angles to its velocity and proportional to its speed. That second part defines the **magnetic
field** $\sym{magnetic-field}{\light{\vect B}}$: the force on a test charge moving with the velocity $\vect v$ is

$$q\,\bigl(\light{\vect E} + \vect v\times\light{\vect B}\bigr) . \label{eq:lorentz-force}$$

This whole force is the **Lorentz force**.[^lorentz] To measure both fields at a point, we hold the test charge still
and read $\light{\vect E}$, then send it through the point in two directions and read $\light{\vect B}$ from the extra
force. A large charge is a non-example: it moves the charges that made the field.

**Units.** The term $\vect v\times\light{\vect B}$ must have the unit of $\light{\vect E}$, so $\light{\vect B}$ is
measured in $\mathrm{V\,s\,m^{-2}}$, a unit called the tesla (T). Then $c\light{\vect B}$, with $c$ the speed of light,
is in $\mathrm{V\,m^{-1}}$. So $\light{\vect E}$ and $c\light{\vect B}$ can be added, while $\light{\vect E}$ and
$\light{\vect B}$ cannot.

A **sensor of light** is an instrument small enough to read the two fields at one point. Its six numbers, the components
of $\light{\vect E}$ and $\light{\vect B}$, are the six numbers of one reading, and
[the section on the moving sensor](#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle) arranges them in one
table.

## Maxwell's four equations are two equations for one complex vector

The two fields obey laws that we write in a form that shows how they belong together. We need one new operation first.
The **curl** of a vector field $\vect A$ is the vector field $\nabla\times\vect A$ with the components

$$(\nabla\times\vect A)_i = \epsilon_{ijk}\,\partial_jA_k ,$$

the cross product of section 1.1 with the gradient $\nabla$ of section
[1.2](/tutorial/newton/field-and-potential/#the-gradient-points-uphill) in place of the first arrow. It measures how
the field swirls round each point. For the velocity of a turntable, $\vect v = \Omega\,\hat z\times\vect x = \Omega(-y,
x, 0)$, the third component is $\partial_xv_y - \partial_yv_x = 2\Omega$: the curl of a rigid turning points along its
axis, with twice its rate of turning. A non-example is a gradient, $\vect A = \nabla f$, which has no curl, because
$\epsilon_{ijk}\partial_j\partial_kf$ pairs each term with an equal term of the opposite sign. Section
[2.8](/tutorial/outside/flows/#a-flow-has-a-potential-of-its-own-built-like-the-gravitational-one) uses the curl for
flows of mass.

We take Maxwell's equations as given, a result of experiment stated without proof, as section 6.1 took the speed of
light. Here $\sym{charge-density}{\rho_q}$ is the charge per unit volume, in $\mathrm{C\,m^{-3}}$, and $\vect J_q$ is
the current density, the charge that crosses a unit area per second, in $\mathrm{A\,m^{-2}}$ (an ampere is a coulomb per
second). The two constants are the **electric constant** $\sym{electric-constant}{\varepsilon_0} = 8.854 \times
10^{-12}\unit{C\,V^{-1}\,m^{-1}}$ and the **magnetic constant** $\sym{magnetic-constant}{\mu_0} = 1.257 \times
10^{-6}\unit{V\,s\,A^{-1}\,m^{-1}}$, and they obey $\varepsilon_0\mu_0c^2 = 1$. The four equations are

$$\begin{aligned}
\nabla\cdot\light{\vect E} &= \frac{\rho_q}{\varepsilon_0},\\
\nabla\cdot\light{\vect B} &= 0,\\
\nabla\times\light{\vect E} &= -\frac{\partial\light{\vect B}}{\partial t},\\
\nabla\times\light{\vect B} &= \mu_0\vect J_q + \frac{1}{c^2}\frac{\partial\light{\vect E}}{\partial t} .
\end{aligned} \label{eq:maxwell}$$

Together they are **Maxwell's equations**, and each says one thing.

- The first is **Gauss's law** for electricity. It has the shape of the law for gravity in section
  [1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point),
  $\nabla\cdot\vect g = -4\pi G\matter\rho$, with $-4\pi G$ replaced by $1/\varepsilon_0$. The sign is opposite because
  like charges repel, while masses attract.
- The second says that no magnetic charge exists, so lines of $\light{\vect B}$ never begin or end.
- The third is **Faraday's law**: a magnetic field that changes in time makes an electric field that swirls round it.
- The fourth is the **Ampère–Maxwell law**: a current, or an electric field that changes in time, makes a magnetic
  field that swirls round it.

The equations treat the two fields almost alike, which suggests joining them. We define the complex vector

$$\boxed{\;\sym{complex-field}{\light{\vect F}} = \light{\vect E} + ic\light{\vect B}\;} \label{eq:F}$$

with three complex components, each in $\mathrm{V\,m^{-1}}$. It is called the **Riemann–Silberstein vector**.[^letters] We multiply the second and the fourth equations of
[](#eq:maxwell) by $ic$ and add them to the first and the third. The divergences give

$$\nabla\cdot\light{\vect F} = \frac{\rho_q}{\varepsilon_0} + ic \cdot 0 = \frac{\rho_q}{\varepsilon_0} .$$

The curls give $\nabla\times\light{\vect F} = -\partial_t\light{\vect B} + ic\mu_0\vect J_q + (i/c)\,\partial_t
\light{\vect E}$. The right side holds the time derivative of $(i/c)(\light{\vect E} + ic\light{\vect B})$, which is
$(i/c)\partial_t\light{\vect E} - \partial_t\light{\vect B}$, so

$$\boxed{\;\begin{aligned}\nabla\cdot\light{\vect F} &= \frac{\rho_q}{\varepsilon_0},\\ \nabla\times\light{\vect F}
&= \frac ic\,\frac{\partial\light{\vect F}}{\partial t} + i\mu_0c\,\vect J_q\end{aligned}\;} \label{eq:maxwell-F}$$

Every term is in $\mathrm{V\,m^{-2}}$; for the last, $\mathrm{V\,s\,A^{-1}\,m^{-1}} \times \mathrm{m\,s^{-1}} \times
\mathrm{A\,m^{-2}}$. Because $\rho_q$, $\vect J_q$ and the two fields are real, the real parts of [](#eq:maxwell-F)
give back the first and third of Maxwell's equations, and the imaginary parts, divided by $c$, the second and fourth.
The two complex equations hold exactly what the four real ones hold. The non-example $\light{\vect E} + i\light{\vect
B}$ would add volts per metre to teslas.

## In a light wave the complex field is a multiple of one null vector

A sensor of starlight or sunlight reads the field of light far from any charge. We assume **empty space**, $\rho_q = 0$ and $\vect J_q = 0$. Then [](#eq:maxwell-F) reads $\nabla\cdot\light{\vect F} =
0$ and $\nabla\times\light{\vect F} = (i/c)\partial_t\light{\vect F}$.

**The wave equation.** We take the curl of the second equation. On the left, the curl of a curl follows from the
identity $\epsilon_{kij}\epsilon_{klm} = \delta_{il}\delta_{jm} - \delta_{im}\delta_{jl}$ of section
[1.1](/tutorial/newton/vectors-and-indices/#two-levi-civita-symbols-make-two-kronecker-deltas), as $\vect a\times(\vect
b\times\vect c)$ did there:

$$\nabla\times(\nabla\times\light{\vect F}) = \nabla(\nabla\cdot\light{\vect F}) - \nabla^2\light{\vect F} =
-\nabla^2\light{\vect F} ,$$

since the divergence is zero. On the right, the curl passes through the time derivative, and we use the second equation
again: $(i/c)\partial_t(\nabla\times\light{\vect F}) = (i/c)^2\partial_t^2\light{\vect F} = -c^{-2}\partial_t^2
\light{\vect F}$. So

$$\nabla^2\light{\vect F} = \frac{1}{c^2}\frac{\partial^2\light{\vect F}}{\partial t^2} ,$$

the wave equation for waves that travel at $c$, which is $\Box\light{\vect F} = 0$ with the operator of section
[6.2](/tutorial/relativity/spacetime-vectors/#the-gradient-is-a-lower-index-vector-and-the-wave-operator-is-its-square).[^wave] Maxwell's equations predict waves at the speed of light, and light is such a wave.

**A plane wave.** We take a wave that travels along $\hat k = \hat z$ without changing its shape, so that the field
depends on $z$ and $t$ only through $z - ct$:

$$\light{\vect F}(z, t) = \vect G(z - ct) ,$$

with $\vect G$ a complex vector function of one variable $s = z - ct$, and $\vect G'$ its derivative. Such a field
solves the wave equation; we put it into the two first-order equations, which say more. Only the derivative along $z$
survives in the curl, so $(\nabla\times\light{\vect F})_i = \epsilon_{i3k}G'_k = (\hat z\times\vect G')_i$, and the
time derivative gives $(i/c)(-c)\,\vect G' = -i\vect G'$. The divergence gives $G'_z = 0$. So

$$\hat k\times\vect G' = -i\,\vect G', \qquad \hat k\cdot\vect G' = 0 .$$

The vector $\vect G'$ lies across the travel, and the cross product with $\hat k$, a quarter turn, multiplies it by
$-i$. Section [1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) found exactly
this property for the null vector $\sym{null-vector}{\vect m} = (\vect e_1 + i\vect e_2)/\sqrt2$, with $\vect e_1$ and
$\vect e_2$ unit vectors across the travel and $\vect e_1\times\vect e_2 = \hat k$: there $\hat k\times\vect m = -i\vect
m$. For $\vect G' = (G'_1, G'_2, 0)$ the condition reads $-G'_2 = -iG'_1$ and $G'_1 = -iG'_2$, so $G'_2 = iG'_1$ and
$\vect G'$ is a complex multiple of $\vect m$. Integrating along $s$, and leaving out a constant field, which is not
part of the wave, gives

$$\boxed{\;\light{\vect F} = a\,\vect m, \qquad a = \sqrt2\,(\light E_1 - i\light E_2)\;} \label{eq:wave-F}$$

where $\sym{light-amplitude}{a}(z - ct)$ is the wave's **complex amplitude**, in $\mathrm{V\,m^{-1}}$, and $\light E_1$,
$\light E_2$ are the components of $\light{\vect E}$ along $\vect e_1$ and $\vect e_2$. The value of $a$ follows from
multiplying out, $a\vect m = \light E_1\vect e_1 + \light E_2\vect e_2 + i(\light E_1\vect e_2 - \light E_2\vect e_1)$,
whose real part is $\light{\vect E}$. This keeps the promise of section 1.5b.

**What it means.** The imaginary part gives $c\light{\vect B} = \hat k\times\light{\vect E}$. In a light wave both
fields lie across the direction of travel, at right angles to each other, with $|\light{\vect E}| = c|\light{\vect B}|$.
A light wave is circularly polarized when its electric field keeps its length and turns round $\hat k$ as the wave
passes, and linearly polarized when the field swings to and fro along one line (section
[5.4](/tutorial/waves/polarization/#two-oscillations-a-quarter-cycle-apart-make-a-pattern-that-turns) describes both
kinds for gravity's waves). In both, the direction $\vect m$ is fixed, and only the number $a$ moves in the complex
plane, round a circle or along a line through zero (Figure [](#fig:wave-amplitude)). A wave that travels the other way,
along $-\hat k$, has $\vect m^*$ in place of $\vect m$, because for $-\hat k$ the pair $\vect e_1$, $-\vect e_2$ takes
the place of $\vect e_1$, $\vect e_2$.

![Look first at the two arrows of one instant of a wave: in a light wave the electric field $\light{\vect E}$ and $c$ times the magnetic
field, $c\light{\vect B}$, are equal in length, at right angles, and both across the direction of travel $\hat k$.
In the complex plane, the one complex number $a = \sqrt2\,(\light E_1 - i\light E_2)$ holds the whole wave: it goes round a circle for
circular polarization, the other way from the electric field because it is $\sqrt2$ times the conjugate of $\light E_1 +
i\light E_2$, and to and fro on a line for linear polarization.](tut-maxwell-wave){#fig:wave-amplitude}

**Gravity's wave, for comparison.** Section 1.5b read gravity's wave in the same way:

$$\curv{\mathcal W} = 2\bigl(\curv\tE_+ - i\curv\tE_\times\bigr)\,\vect m\vect m^{\mathsf T} ,$$

where $\curv\tE_+$ and $\curv\tE_\times$ are the wave's two polarizations.[^p-square] Light's field is $\vect m$ times a
number, and gravity's curvature is the square $\vect m\vect m^{\mathsf T}$ times a number, so a turn of the axes about
$\hat k$ changes light's amplitude by one power of a phase and gravity's by two: spin one against spin two (section
9.1).

## The energy of the field and its flow are two products of the complex field

We want the energy that light carries and the rate at which it flows. We state two results of electromagnetism without
proof (the GR course derives them, as *Go deeper* below says). The field holds the energy per unit volume, or **energy density**,

$$\sym{em-energy-density}{u} = \tfrac12\varepsilon_0\bigl(\light E^2 + c^2\light B^2\bigr) ,$$

in $\mathrm{J\,m^{-3}}$, and that energy flows across a unit area, per second, along the **Poynting vector**

$$\sym{poynting-vector}{\vect S} = \frac{\light{\vect E}\times\light{\vect B}}{\mu_0} ,$$

in $\mathrm{W\,m^{-2}}$. The units check: $\varepsilon_0\light E^2$ is $\mathrm{C\,V\,m^{-3}}$, and a coulomb times a volt is a joule.

Both are products of $\light{\vect F}$. The **Hermitian product** of section 1.5b, $\vect a\cdot\vect b^* = a_lb_l^*$,
conjugates the second factor. For $\light{\vect F}$ with itself the cross terms cancel,
$\light{\vect F}^*\cdot\light{\vect F} = (\light{\vect E} - ic\light{\vect B})\cdot(\light{\vect E} + ic\light{\vect
B}) = \light E^2 + c^2\light B^2$. For the cross product, $\light{\vect F}\times\light{\vect F}^* = -ic\,\light{\vect
E}\times\light{\vect B} + ic\,\light{\vect B}\times\light{\vect E} = -2ic\,\light{\vect E}\times\light{\vect B}$, so
$i\,\light{\vect F}\times\light{\vect F}^* = 2c\,\light{\vect E}\times\light{\vect B}$. With $1/\mu_0 =
\varepsilon_0c^2$,

$$\boxed{\;u = \tfrac12\varepsilon_0\,\light{\vect F}^*\cdot\light{\vect F}, \qquad \vect S =
\tfrac12\varepsilon_0c\;i\,\light{\vect F}\times\light{\vect F}^*\;} \label{eq:energy-F}$$

**A plane wave.** For $\light{\vect F} = a\vect m$, the Hermitian product gives $\vect m^*\cdot\vect m = 1$, so $u =
\tfrac12\varepsilon_0|a|^2$. In the axes $\vect e_1$, $\vect e_2$, $\hat k$, the cross product is $\vect m\times\vect
m^* = \tfrac12(1, i, 0)\times(1, -i, 0) = \tfrac12(0, 0, -2i)$, so $i\,\vect m\times\vect m^* = \hat k$. Then $\vect S =
\tfrac12\varepsilon_0c|a|^2\,\hat k$, and

$$\vect S = c\,u\,\hat k :$$

the energy of a light wave moves along the wave at the speed of light. The direction of travel of a gravitational wave
is built from the same product of $\vect m$ (section
[9.1](/tutorial/one-point/spin-two/#the-square-holds-four-numbers-a-direction-and-one-complex-amplitude)).[^p-dir]

**Sunlight.** At the Earth sunlight carries $|\vect S| = 1361\unit{W\,m^{-2}}$, so $u = |\vect S|/c =
1361/(2.998\times10^8)\unit{J\,m^{-3}} = 4.54\times10^{-6}\unit{J\,m^{-3}}$. In light $|\light{\vect E}| =
c|\light{\vect B}|$ at every instant, so the two halves of $u$ are equal and $u = \varepsilon_0\light E^2$. Averaged
over many cycles, which the angle brackets mark, $\varepsilon_0\langle\light E^2\rangle = u$, and the root mean square
field is $\light E_{\rm rms} = \sqrt{u/\varepsilon_0} = \sqrt{4.54\times10^{-6}/8.854\times10^{-12}}\unit{V\,m^{-1}} =
716\unit{V\,m^{-1}}$. The magnetic field, $\light B_{\rm rms} = \light E_{\rm rms}/c = 2.39\unit{\mu T}$, is a twentieth
of the Earth's steady field of $50\unit{\mu T}$, yet it carries half the energy, because $c\light B_{\rm rms}$ is
$716\unit{V\,m^{-1}}$ too.

## A moving sensor reads the field turned by an imaginary angle

We want the six numbers that a moving sensor reads, given the six that a sensor at rest reads at the same event. We
take it in three steps: the table that changes as a tensor, the rule it gives for $\light{\vect F}$, and that rule as
an exponential.

**Step 1: the six numbers make one table.** We state, without proof here, that the two fields form the antisymmetric
table

$$\sym{field-tensor}{\light F^{\mu\nu}} = \begin{pmatrix} 0 & \light E_x/c & \light E_y/c & \light E_z/c\\ -\light
E_x/c & 0 & \light B_z & -\light B_y\\ -\light E_y/c & -\light B_z & 0 & \light B_x\\ -\light E_z/c & \light B_y &
-\light B_x & 0\end{pmatrix} ,$$

the **field tensor**, in teslas, and that it is a tensor of spacetime in the sense of section
[6.2](/tutorial/relativity/spacetime-vectors/#a-tensor-is-a-table-whose-every-index-changes-with-the-boost): a sensor
moving with the boost $\Lambda^\mu{}_\nu$ reads $\light F'^{\mu\nu} = \Lambda^\mu{}_\alpha\Lambda^\nu{}_\beta\light
F^{\alpha\beta}$. In index form, $\light F^{0i} = \light E_i/c$ and $\light F^{ij} = \epsilon_{ijk}\light B_k$. Lowering
both indices with the metric of section 6.2 flips the sign of the entries with one index 0, so $\light F_{0i} = -\light
E_i/c$ and $\light F_{ij} = \epsilon_{ijk}\light B_k$, the convention of the GR course.

::: gap
This sketch does not prove that $\light F^{\mu\nu}$ changes as a tensor. The proof uses the fact, found in experiment,
that Maxwell's equations hold in every inertial frame; the GR course gives it in section 11.6, linked below. Everything
after the tensor rule is derived.
:::

We boost along $x$ with the table of section 6.2, whose entries are $\Lambda^0{}_0 = \Lambda^1{}_1 = \obs\gamma$ and
$\Lambda^0{}_1 = \Lambda^1{}_0 = -\obs\gamma\obs\beta$, and write them with the rapidity of section
[6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not), $\obs\gamma = \cosh\obs\eta$ and
$\obs\gamma\obs\beta = \sinh\obs\eta$. Each new entry is a sum over the old ones (the box below):

$$\begin{aligned}
\light E'_x &= \light E_x, \qquad c\light B'_x = c\light B_x,\\
\light E'_y &= \cosh\obs\eta\,\light E_y - \sinh\obs\eta\,c\light B_z,\\
c\light B'_z &= \cosh\obs\eta\,c\light B_z - \sinh\obs\eta\,\light E_y,\\
\light E'_z &= \cosh\obs\eta\,\light E_z + \sinh\obs\eta\,c\light B_y,\\
c\light B'_y &= \cosh\obs\eta\,c\light B_y + \sinh\obs\eta\,\light E_z .
\end{aligned} \label{eq:boost-EB}$$

::: derivation
### The boost of the field tensor along the x axis

The boost along $x$ has only four entries that differ from the identity, all in rows and columns 0 and 1. In
$\light F'^{\mu\nu} = \Lambda^\mu{}_\alpha\Lambda^\nu{}_\beta\light F^{\alpha\beta}$, an index 2 or 3 is therefore
carried over unchanged, $\Lambda^2{}_\beta = \delta^2{}_\beta$, while an index 0 or 1 becomes a sum of two terms.

For $\light F'^{02}$ the sum over $\alpha$ keeps $\alpha = 0, 1$ and the second index stays 2:

$$\light F'^{02} = \Lambda^0{}_0\light F^{02} + \Lambda^0{}_1\light F^{12} = \obs\gamma\,\frac{\light E_y}{c} -
\obs\gamma\obs\beta\,\light B_z .$$

Multiplying by $c$ gives $\light E'_y = \obs\gamma(\light E_y - \obs\beta c\light B_z)$. In the same way,

$$\light F'^{12} = \Lambda^1{}_0\light F^{02} + \Lambda^1{}_1\light F^{12} = -\obs\gamma\obs\beta\,\frac{\light
E_y}{c} + \obs\gamma\light B_z ,$$

so $c\light B'_z = \obs\gamma(c\light B_z - \obs\beta\light E_y)$. For the index 3, $\light F^{13} = \epsilon_{132}
\light B_2 = -\light B_y$ and $\light F^{31} = \light B_y$:

$$\begin{aligned}
\light F'^{03} &= \obs\gamma\,\frac{\light E_z}{c} - \obs\gamma\obs\beta\,(-\light B_y),\\
\light F'^{31} &= \Lambda^1{}_0\light F^{30} + \Lambda^1{}_1\light F^{31}\\
&= -\obs\gamma\obs\beta\Bigl(-\frac{\light E_z}{c}\Bigr) + \obs\gamma\light B_y ,
\end{aligned}$$

which give $\light E'_z = \obs\gamma(\light E_z + \obs\beta c\light B_y)$ and $c\light B'_y = \obs\gamma(c\light B_y +
\obs\beta\light E_z)$. For $\light F'^{01}$ both indices are summed over 0 and 1, and only the two entries $\light
F^{01}$ and $\light F^{10} = -\light F^{01}$ are not zero:

$$\begin{aligned}\light F'^{01} &= \bigl(\Lambda^0{}_0\Lambda^1{}_1 - \Lambda^0{}_1\Lambda^1{}_0\bigr)\light F^{01}\\
&= \obs\gamma^2(1 - \obs\beta^2)\,\light F^{01} = \light F^{01} ,\end{aligned}$$

so $\light E'_x = \light E_x$. The entry $\light F^{23}$ has no index 0 or 1, so $\light B'_x = \light B_x$. These are
the textbook transformations of the fields for a sensor moving at $\obs\beta c$ along $x$.
:::

**Step 2: in the complex field the six rules are one.** For each component we add $i$ times the rule for $c\light B'$ in
[](#eq:boost-EB) to the rule for $\light E'$. The $x$ components give $\light F'_x = \light F_x$. The $y$ components
give

$$\begin{aligned}\light F'_y &= \cosh\obs\eta\,(\light E_y + ic\light B_y)\\
&\quad + i\sinh\obs\eta\,(\light E_z + ic\light B_z)\\
&= \cosh\obs\eta\,\light F_y + i\sinh\obs\eta\,\light F_z ,\end{aligned}$$

because $-\sinh\obs\eta\,c\light B_z = i\sinh\obs\eta \cdot ic\light B_z$. In the same way $\light F'_z =
\cosh\obs\eta\,\light F_z - i\sinh\obs\eta\,\light F_y$. With $\hat u = \hat x$, the cross product is $\hat
u\times\light{\vect F} = (0, -\light F_z, \light F_y)$, so the two lines are one rule. For a sensor moving with
rapidity $\obs\eta$ along any unit vector $\hat u$, with $\light F_\parallel = \hat u\cdot\light{\vect F}$ the part
along the motion and $\light{\vect F}_\perp$ the part across it,

$$\begin{aligned}\light F'_\parallel &= \light F_\parallel,\\ \light{\vect F}'_\perp &= \cosh\obs\eta\,\light{\vect
F}_\perp - i\sinh\obs\eta\,\hat u\times\light{\vect F} .\end{aligned} \label{eq:boost-F}$$

Six real rules have become three complex ones, and they have a familiar shape. When the sensor's axes turn by an angle
$\theta$ about $\hat z$, anticlockwise as seen with $\hat z$ pointing at us, section
[1.5b](/tutorial/newton/complex-numbers/#an-arrow-is-one-complex-number-and-turning-the-axes-turns-it-back-by-the-same-angle)
found the new components of an arrow, $v'_x = v_x\cos\theta + v_y\sin\theta$ and $v'_y = -v_x\sin\theta +
v_y\cos\theta$. Renaming the axes in a cycle, $x$ as $y$, $y$ as $z$ and $z$ as $x$, gives the same turn about $\hat x$:
$v'_y = v_y\cos\theta + v_z\sin\theta$ and $v'_z = -v_y\sin\theta + v_z\cos\theta$. In vector form, for a turn about any
unit vector $\hat u$, this is

$$\vect v'_\parallel = \vect v_\parallel, \qquad \vect v'_\perp = \cos\theta\,\vect v_\perp - \sin\theta\,\hat
u\times\vect v .$$

The boost [](#eq:boost-F) has the same form, with $\cosh\obs\eta$ in place of $\cos\theta$ and $i\sinh\obs\eta$ in place
of $\sin\theta$ (Figure [](#fig:imaginary-turn)). Euler's formula of section
[1.5b](/tutorial/newton/complex-numbers/#eulers-formula-a-turn-is-an-exponential) gives $\cos\theta = (e^{i\theta} +
e^{-i\theta})/2$ and $\sin\theta = (e^{i\theta} - e^{-i\theta})/2i$, and we use these two formulas to define the cosine
and the sine of any complex $\theta$. At an **imaginary angle**, $\theta = i\obs\eta$ with $\obs\eta$ real, they are

$$\begin{aligned}\cos(i\obs\eta) &= \frac{e^{-\obs\eta} + e^{\obs\eta}}{2} = \cosh\obs\eta,\\ \sin(i\obs\eta) &=
\frac{e^{-\obs\eta} - e^{\obs\eta}}{2i} = i\sinh\obs\eta .\end{aligned}$$

So **a sensor that moves with rapidity $\obs\eta$ along $\hat u$ reads $\light{\vect F}$ as a sensor reads it whose axes
are turned about $\hat u$ by the imaginary angle $i\obs\eta$.**

![Look first at the two rules under the panels: they are the same rule, with the cosine and sine of the circle
and the hyperbolic cosine and sine of the hyperbola, and with $i$ in front of $\sinh\obs\eta$. Putting $\theta =
i\obs\eta$ turns one into the other, because $\cos(i\obs\eta) = \cosh\obs\eta$ and $\sin(i\obs\eta) =
i\sinh\obs\eta$. The dot on the hyperbola is the pixel's $0.6c$, $\obs\eta = \ln2$.](tut-maxwell-turn){#fig:imaginary-turn}

**Step 3: the exponential.** Section
[1.7](/tutorial/newton/hamilton/#every-quantity-generates-a-motion-and-a-symmetry-gives-a-constant) built a turn by the
angle $\theta$ about $\hat u$ from the three fixed tables $\sym{generators}{(L_k)_{ij}} = -\epsilon_{kij}$, as the
exponential $\exp(\theta\,\hat u\cdot\mathbf L)$, where $\hat u\cdot\mathbf L = \hat u_kL_k$ and $\mathbf L$ stands for
the list of the three tables. That table turns arrows anticlockwise by $\theta$; turning the axes by $\theta$ is turning
the arrow by $-\theta$, so the table that gives the new components is $\exp(-\theta\,\hat u\cdot\mathbf L)$. Its power
series converges for complex angles too, and term by term it gives the cosines and sines above.[^series] We put $\theta
= i\obs\eta$:

$$\boxed{\;\light{\vect F}' = \Lambda\,\light{\vect F}, \qquad \sym{complex-boost}{\Lambda} =
\exp\bigl(-i\obs\eta\,\hat u\cdot\mathbf L\bigr)\;} \label{eq:Lambda}$$

for a sensor moving with the velocity $\obs{\vect v} = c\tanh\obs\eta\,\hat u$. It says that **moving is turning by an
imaginary angle.**[^p-matrix] This table describes the same change of observer as the $4\times4$ boost $\Lambda^\mu{}_\nu$ of section 6.2 acting on
both indices of the field tensor. A scene moving along $\hat u$ past a sensor at rest is seen through $\Lambda^{-1}$.

**The pixel's speed.** A sensor moves at $0.6c$, with $\obs\eta = \ln2$, along $z$ across a static field $\light{\vect
E} = (\light E, 0, 0)$ with no magnetic field. Section 6.1 found $\cosh\ln2 = 1.25$ and $\sinh\ln2 = 0.75$. By
[](#eq:boost-F), $\hat z\times\light{\vect F} = (0, \light E, 0)$, so $\light{\vect F}' = (1.25\,\light E,
-0.75i\,\light E, 0)$: the sensor reads $\light E'_x = 1.25\,\light E$ and $c\light B'_y = -0.75\,\light E$. Its
electric field is a quarter stronger than at rest, and it reads a magnetic field that was not there at rest.

**A slow sensor.** For $\obs\eta \ll 1$, $\cosh\obs\eta \approx 1$ and $\sinh\obs\eta \approx \obs\beta$, so
$\light{\vect F}' \approx \light{\vect F} - i\obs\beta\,\hat u\times\light{\vect F}$. The imaginary part of this, for a
field that is purely electric, is $c\light{\vect B}' = -\obs\beta\,\hat u\times\light{\vect E}$, or

$$\light{\vect B}' = -\frac{\obs{\vect v}\times\light{\vect E}}{c^2} .$$

This is the magnetic field that a moving observer measures past a charge, the derivation that section
[0.4](/tutorial/evening/one-pixel/#the-ten-numbers-regroup-into-four-invariants-three-angles-and-a-velocity) promised. A
sensor that crosses the fair-weather electric field near the ground, about $100\unit{V\,m^{-1}}$, at
$30\unit{km\,s^{-1}}$, the Earth's speed round the Sun, reads $\obs vE/c^2 = 3\times10^4 \times 100 /
(2.998\times10^8)^2\unit{T} = 3.3\times10^{-11}\unit{T}$, less than a millionth of the Earth's own magnetic field.

**A moving charge points to where it is now.** A charge moves steadily with the velocity $\vect v$ past a sensor at
rest. In the charge's own frame its field $\light{\vect E}_0$ is purely electric and lies along the separation, which by
section
[6.1](/tutorial/relativity/lorentz/#a-moving-ruler-is-shorter-along-its-motion-and-distances-in-a-bodys-own-frame-are-longer)
has the parts $\obs\gamma r_\parallel$ along the motion and $r_\perp$ across it, with $\vect r$ the vector from the
sensor to where the charge is now. Seen from the charge, the sensor moves with $-\vect v$, so its boost is along $\hat u
= -\hat v$, with $\obs\gamma = \cosh\obs\eta$. By [](#eq:boost-F) it keeps the part of the field along the motion and
multiplies the part across by $\obs\gamma$, so it reads a field along $\obs\gamma\vect r$: the field points from where
the charge is now, the present position of section
[6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now).[^present] The imaginary part of [](#eq:boost-F) is $c\light{\vect B} = -\sinh\obs\eta\,(-\hat
v)\times\light{\vect E}_0 = \obs\gamma(\vect v/c)\times\light{\vect E}_0$, and $\light{\vect E}$ has $\obs\gamma$ times
the part of $\light{\vect E}_0$ across $\vect v$, so

$$c\light{\vect B} = \frac{\vect v}{c}\times\light{\vect E} .$$

The sign is opposite to the slow sensor's because there the velocity was the sensor's, and here it is the charge's.

## A sensor that runs with a wave reads it weaker by the Doppler factor

A light wave is the simplest case of the imaginary turn. Take the wave
$\light{\vect F} = a\vect m$ travelling along $\hat k$, and a sensor moving along $\hat k$ with rapidity $\obs\eta$. By
[](#eq:boost-F), with $\hat k\times\vect m = -i\vect m$,

$$\begin{aligned}\light{\vect F}' &= \cosh\obs\eta\,a\vect m - i\sinh\obs\eta\,a\,(-i\vect m)\\ &= (\cosh\obs\eta -
\sinh\obs\eta)\,a\vect m ,\end{aligned}$$

so

$$\boxed{\;a' = e^{-\obs\eta}\,a\;} \label{eq:doppler}$$

for a sensor that runs with the wave, and $a' = e^{\obs\eta}a$ for one that runs against it. The same follows from the
turn. A turn of the axes by $\theta$ about $\hat k$ gives $\light{\vect F}' = \cos\theta\,\light{\vect F} -
\sin\theta\,\hat k\times\light{\vect F} = e^{i\theta}\light{\vect F}$ for $\light{\vect F} = a\vect m$, a change of
phase only. At the imaginary angle $\theta = i\obs\eta$ the phase $e^{i\theta}$ becomes the real factor $e^{-\obs\eta}$:
a turn changes the phase of a wave, and a boost changes its size.

The factor is the Doppler factor of section
[6.3](/tutorial/relativity/aberration/#light-from-ahead-is-bluer-and-light-from-behind-is-redder), by
which the frequency of the wave falls for a sensor that runs with it, $\obs\gamma(1 - \obs\beta) = \cosh\obs\eta -
\sinh\obs\eta = e^{-\obs\eta}$. So the field's amplitude falls by the same factor as its frequency, and the energy
density $u = \tfrac12\varepsilon_0|a|^2$ by its square, $e^{-2\obs\eta} = (1 - \obs\beta)/(1 + \obs\beta)$. The
direction $\vect m$ does not change, so the polarization, the path of $a$ in the complex plane, keeps its shape and only
shrinks.

**A number.** At $0.6c$ along the wave, $e^{-\ln2} = \tfrac12$: the sensor reads half the field and a quarter of the
energy density. Against the wave it reads twice the field and four times the energy density, and $(1 + 0.6)/(1 - 0.6) =
4$ agrees.

## One complex number is the same for every observer

What do all observers agree on? A **complex rotation** is a $3\times3$ table $P$ of complex numbers with
$P^{\mathsf T}P = 1$ and determinant 1. A real turn is one, and so is $\Lambda$, since $(\hat u\cdot\mathbf L)^{\mathsf
T} = -\hat u\cdot\mathbf L$, because each $L_k$ is antisymmetric, so $\Lambda^{\mathsf T} = \exp(i\obs\eta\,\hat
u\cdot\mathbf L) = \Lambda^{-1}$. A complex rotation keeps the dot product without conjugates:
$(P\vect a)\cdot(P\vect b) = \vect a^{\mathsf T}P^{\mathsf T}P\,\vect b = \vect a\cdot\vect b$. Applied to
$\light{\vect F}$ with itself,

$$\boxed{\;\light{\vect F}\cdot\light{\vect F} = \light E^2 - c^2\light B^2 + 2ic\,\light{\vect E}\cdot\light{\vect
B}\;} \label{eq:invariant}$$

is the same for every observer at that point, however turned and however moving. Its real and imaginary parts are the two invariants of light, $\light E^2 - c^2\light B^2$ and $2c\,\light{\vect
E}\cdot\light{\vect B}$.[^FF] An **invariant**
here is a combination of the field's components that every observer at the same point finds the same.

The Hermitian product is not kept by a boost. It would be kept only if $\Lambda^\dagger\Lambda = 1$, where the
**conjugate transpose** $\Lambda^\dagger$ swaps rows and columns and conjugates every entry. A
boost has $\Lambda^\dagger = \Lambda$, because its real part is symmetric and its imaginary part antisymmetric, so
$\Lambda^\dagger\Lambda = \Lambda^2$, the boost by $2\obs\eta$. So the energy density $u$ changes from one observer to
another, as an energy must. For the sensor at $0.6c$ above, $\light E^2 + c^2\light B^2$ grows from $\light E^2$ to
$(1.5625 + 0.5625)\,\light E^2 = 2.125\,\light E^2$, while $\light E^2 - c^2\light B^2$ stays $(1.5625 - 0.5625)\,\light
E^2$.

**Examples.** A charge at rest has $\light{\vect B} = 0$, so $\light{\vect F}\cdot\light{\vect F} = \light E^2$,
positive. A plane wave has $\light{\vect F}\cdot\light{\vect F} = a^2\,\vect m\cdot\vect m = 0$. A field with
$\light{\vect F}\cdot\light{\vect F} = 0$ is a **null field**: $|\light{\vect E}| = c|\light{\vect B}|$ and
$\light{\vect E}\perp \light{\vect B}$, and both stay so for every observer. No observer can make a light wave look like
the field of a charge.

**The frame where the two fields are parallel.** If $\light{\vect F}\cdot\light{\vect F} \neq 0$ and the two fields are
not already parallel, a boost makes them so. We take $\hat z$ along $\light{\vect E}\times\light{\vect
B}$, so that both fields, and $\light{\vect F}$, lie in the plane across $\hat z$. In that plane we split $\light{\vect
F}$ along $\vect m = (1, i, 0)/\sqrt2$ and its conjugate:

$$\light{\vect F} = f\,\vect m + g\,\vect m^*, \qquad f = \light{\vect F}\cdot\vect m^*, \quad g = \light{\vect F}\cdot
\vect m ,$$

since $\vect m\cdot\vect m^* = 1$ and $\vect m\cdot\vect m = 0$. Then $\light{\vect F}\cdot\light{\vect F} = 2fg$. A
boost along $\hat z$ multiplies $\vect m$ by $e^{-\obs\eta}$, as it multiplied the wave in [the section on the Doppler
factor](#a-sensor-that-runs-with-a-wave-reads-it-weaker-by-the-doppler-factor), and $\vect m^*$ by $e^{\obs\eta}$,
because $\hat z\times\vect m^* = i\vect m^*$:

$$\light{\vect F}' = e^{-\obs\eta}f\,\vect m + e^{\obs\eta}g\,\vect m^* .$$

The two circular parts change by opposite factors, and their product $fg$ does not change, as [](#eq:invariant)
requires. The fields are parallel when $\light{\vect F}'$ is one complex number times a real vector, and in the plane
that happens exactly when its two parts have equal sizes.[^parallel] So $e^{-\obs\eta}|f| = e^{\obs\eta}|g|$, which
gives

$$\boxed{\;e^{2\obs\eta} = \frac{|f|}{|g|}\;} \label{eq:aligned}$$

Because $2fg$ is not zero, neither $f$ nor $g$ is zero, and this rapidity is finite. For a null field one of them is
zero, and no boost makes the fields parallel. The cross product $i\,\light{\vect
F}\times\light{\vect F}^*$ is $(|f|^2 - |g|^2)\,\hat z$, and [the section on
energy](#the-energy-of-the-field-and-its-flow-are-two-products-of-the-complex-field) found it to be $2\light{\vect
E}\times c\light{\vect B}$, so $|f| > |g|$ and the boost is along $\light{\vect E}\times\light{\vect B}$, the direction
in which the energy flows. For $\light{\vect E} = (1, 0, 0)$ and $c\light{\vect B} = (0, \tfrac12, 0)$, in any unit, $f
= 1.5/\sqrt2$ and $g = 0.5/\sqrt2$, so $e^{2\obs\eta} = 3$ and $\obs\beta = \tanh\obs\eta = (3 - 1)/(3 + 1) = \tfrac12$
exactly. The boosted field is $\light{\vect F}' = (0.866, 0, 0)$, purely electric, with the square $\tfrac34$ that the
invariant $1 - \tfrac14$ requires. When $\light{\vect E}\cdot\light{\vect B} \neq 0$ the parallel frame sees both
fields, along one line.

**What the parallel frame hides.** In that frame $\light{\vect F}' = w\,\hat n$, with $w$ a complex number and $\hat n$
a real unit vector, the field's axis. A boost along $\hat n$ leaves the part along the motion alone, and there is no
part across, so by [](#eq:boost-F) it changes nothing. A turn about $\hat n$ changes nothing either. So two sensors that
move relative to each other along the axis read the same six numbers (Figure [](#fig:parallel-frame)). When the
scene's charges are at rest, their own frame is one of these parallel frames, since there $\light{\vect B} = 0$. From
one reading a sensor finds the boost along $\light{\vect E}\times\light{\vect B}$, across the axis, but never a motion
along the axis: **a sensor of light reads at most two of the three parts of its own velocity**, as section
[0.4](/tutorial/evening/one-pixel/#the-ten-numbers-regroup-into-four-invariants-three-angles-and-a-velocity)
promised.[^p-ten]

The count shows why. Of light's six numbers, two are the invariant $\light{\vect F}\cdot\light{\vect F}$, which fixes
$w$ up to its sign, two are the direction of the axis $\hat n$, and two are the velocity across it: $6 = 2 + 2 + 2$. A
pixel's ten numbers split as $10 = 4 + 3 + 3$, four invariants, three angles and a whole velocity, when the curvature's
complex table has three different eigenvalues, as in a room of four masses (section 9.3); then the pixel of Figure [](/paper/#fig:speedometer) reads all three parts of its own velocity. A single round body gives two
equal eigenvalues, and then the pixel has light's blind spot.

![Look first at the two moves in the observer colour along and about the axis $\hat n$: in the frame where the
electric and magnetic fields lie along one line, a boost along that line and a turn about it leave all six numbers as
they are. Only a boost across the line changes them. This is why a sensor of light can read at most two of the three
parts of its own velocity.](tut-maxwell-parallel){#fig:parallel-frame}

{{paper fig:speedometer}}

## Light has two special directions where gravity has four

We want the special directions that light's field has at a point, and why there are two.
A direction on the sky around the sensor can be labelled by one complex number $z$, its **stereographic coordinate**:
the unit vector of the direction is

$$\hat n(z) = \frac{\bigl(2\,\mathrm{Re}\,z,\ 2\,\mathrm{Im}\,z,\ 1 - |z|^2\bigr)}{1 + |z|^2} ,$$

so $z = 0$ is the direction $+\hat z$, the circle $|z| = 1$ is the equator, and $z \to \infty$ is $-\hat z$. For that
direction we take the null vector

$$\sym{null-vector-z}{\vect m(z)} = \bigl(1 - z^2,\ i(1 + z^2),\ -2z\bigr) ,$$

which is $\sqrt2\,(1 + |z|^2)$ times the null vector $\vect m$ of a wave travelling along $\hat n(z)$, up to a phase.
The vector is null, $\vect m(z)\cdot\vect m(z) = (1 - z^2)^2 - (1 +
z^2)^2 + 4z^2 = 0$, and its Hermitian length is $|\vect m(z)|^2 = |1 - z^2|^2 + |1 + z^2|^2 + 4|z|^2 = 2(1 + |z|^2)^2$,
because the cross terms of the first two cancel. We state that this wave travels along $\hat n(z)$ (the footnote gives a check). The phase is free because the axes $\vect e_1$, $\vect e_2$ can be turned about $\hat n(z)$. At $z = 0$, $\vect m(z)$ is $(1, i, 0)$, $\sqrt2$ times the $\vect m$ of a wave along $+\hat z$.[^stereo]

The **principal null directions** of light's field at a point are the directions $\hat n(z)$ with

$$\vect m(z)\cdot\light{\vect F} = 0 .$$

In the axes $\vect e_1$, $\vect e_2$, $\hat n$ of such a direction, we split $\light{\vect F}$ as for the parallel
frame, $\light{\vect F} = f\,\vect m + g\,\vect m^* + h\,\hat n$, and the part along $\vect m^*$ is $g = \light{\vect
F}\cdot\vect m$. Because $\vect m(z)$ is a multiple of $\vect m$, the condition says $g = 0$: $\light{\vect F}$ has no
part along $\vect m^*$, the part that would belong to a wave travelling the other way, and the field looks like a part
along $\hat n$ plus a wave along $\hat n$. This is light's form of gravity's quartic equation $\vect m(z)^{\mathsf T}\,\curv{\mathcal W}\,\vect m(z) = 0$.[^p-stars] Light's condition has one $\vect m(z)$ where gravity's has two, so it is a quadratic in $z$, not a quartic. Collecting
powers of $z$,

$$(i\light F_y - \light F_x)\,z^2 - 2\light F_z\,z + (\light F_x + i\light F_y) = 0 .$$

A quadratic has two roots, so light has two principal null directions. The two coincide when the discriminant vanishes,
and a quarter of the discriminant is $\light F_z^2 - (i\light F_y - \light F_x)(\light F_x + i\light F_y) = \light F_x^2
+ \light F_y^2 + \light F_z^2 = \light{\vect F}\cdot\light{\vect F}$. So **the two directions coincide exactly when the
field is null**: light has two principal null directions, not four, because $\light{\vect F}$ has only one complex
invariant.

- **A charge at rest**, with the field along $\hat z$: the equation is $-2\light F_z\,z = 0$, with one root at $z = 0$
  and the other at infinity, the two directions $\pm\hat z$ along the line through the charge.
- **A plane wave** along $\hat z$, $\light{\vect F} = a(1, i, 0)/\sqrt2$: the coefficients are $-\sqrt2a$, 0 and 0, so
  $z^2 = 0$, a double root on $+\hat z$, the direction of travel.
- **A charge moving at $0.9c$** along $y$, seen at the moment it is directly along $+x$ from the sensor. Its field
  points from where it is now, $\light{\vect E} = (-\light E, 0, 0)$, and $c\light{\vect B} = (\vect v/c)\times
  \light{\vect E} = (0, 0, 0.9\,\light E)$, so $\light{\vect F} = \light E\,(-1, 0, 0.9i)$. The quadratic becomes $z^2 -
  1.8iz - 1 = 0$, with roots $z = 0.9i \pm 0.436$, both with $|z| = 1$. Their directions are $\hat n = (\pm0.436, 0.9,
  0)$. Both are folded from $\pm\hat x$ toward the motion, their half sum is $(0, 0.9, 0)$, the charge's velocity across
  the line over $c$, and their half difference, $(0.436, 0, 0)$, points along the line to where it is now, with the
  length $\sqrt{1 - 0.9^2}$ (Figure [](#fig:light-directions)). This is the relation proved for gravity in section 9.4, now for light.[^fold]

Whatever its sources, light has only these two directions at a point, so one point of light cannot tell one source from
several. Two masses generally give gravity four separate directions, and section 9.4 shows that one round body never
does.

![Look first at the two dots on the moving charge's sphere: a charge moving across the line of sight at 0.9 of the speed of light folds
light's two special directions toward its motion, from their places at rest (open circles), and their half sum is its
velocity across the line over $c$, here 0.9. The directions are the roots $z = 0.9i \pm 0.436$ of $\vect
m(z)\cdot\light{\vect F} = 0$.](tut-maxwell-sky){#fig:light-directions}

## Two boosts make a boost and a turn

What do two boosts in different directions do together? Section
[6.1](/tutorial/relativity/lorentz/#a-boost-can-point-in-any-direction) stated that they make a boost and a turn. A
product of complex rotations is a complex rotation, since $(PQ)^{\mathsf T}(PQ) = Q^{\mathsf T}P^{\mathsf T}PQ = 1$, so
turns and boosts together form a **group**: a set of operations that contains the product of any two of them, the
operation that does nothing, and the undoing of each. The boosts and turns that keep the direction of time form the
**restricted Lorentz group**, and it is the same group as the complex rotations, $SO(3,\mathbb C)$: each of its
elements acts on $\light{\vect F}$ as exactly one complex rotation, with products matching products ([the next
section](#the-turns-and-boosts-are-the-complex-rotations-one-for-one) proves it), and three complex angles are six
real numbers, three for a turn and three for a velocity.

Every complex rotation $P$ splits into a pure boost followed by a real turn, its **polar decomposition**
$P = R_0\,e^{iK_0}$.[^p-polar] Here $R_0$ is a real turn and $e^{iK_0}$, with $K_0$ a real antisymmetric table, is a boost $\exp(-i\obs\eta\,\hat
n\cdot\mathbf L)$, equal to its own conjugate transpose, so $P^\dagger P = (e^{iK_0})^\dagger R_0^{\mathsf
T}R_0\,e^{iK_0} = e^{2iK_0}$. Section 9.2 proves that every complex rotation splits in this way.

**A computed case.** A first sensor moves at $0.6c$ along the room's $x$ axis, and a second moves at $0.6c$ along the
first sensor's $y$ axis. Each boost has $\obs\eta = \ln2$, with $\cosh\obs\eta = 1.25$ and $\sinh\obs\eta = 0.75$, and
[](#eq:boost-F) gives their tables, as in the practice problem below:

$$\begin{aligned}
\Lambda_x &= \begin{pmatrix} 1 & 0 & 0\\ 0 & 1.25 & 0.75i\\ 0 & -0.75i & 1.25\end{pmatrix},\\
\Lambda_y &= \begin{pmatrix} 1.25 & 0 & -0.75i\\ 0 & 1 & 0\\ 0.75i & 0 & 1.25\end{pmatrix} .
\end{aligned}$$

The second sensor reads $P\,\light{\vect F}$ with $P = \Lambda_y\Lambda_x$, because the first boost acts first.
Multiplying row by column,

$$P = \begin{pmatrix} 1.25 & -0.5625 & -0.9375i\\ 0 & 1.25 & 0.75i\\ 0.75i & -0.9375i & 1.5625\end{pmatrix} .$$

We split it as above, $P = R_0H$, with $H = e^{iK_0}$ a boost along a unit vector $\hat n
= (n_1, n_2, 0)$ in the plane of the two boosts, and $R_0$ a turn about $z$ by an angle $\theta$. By [](#eq:boost-F),
the last row and the last column of a boost along $\hat n$ are

$$H = \begin{pmatrix} \cdot & \cdot & -i\sinh\obs\eta\,n_2\\ \cdot & \cdot & i\sinh\obs\eta\,n_1\\
i\sinh\obs\eta\,n_2 & -i\sinh\obs\eta\,n_1 & \cosh\obs\eta\end{pmatrix},$$

and the turn $R_0$, with the rows $(\cos\theta, -\sin\theta, 0)$, $(\sin\theta, \cos\theta, 0)$ and $(0, 0, 1)$, leaves
the last row of $H$ as it is and turns its last column about $z$.

*The boost.* The last row of $P$ is the last row of $H$, so $\cosh\obs\eta = 1.5625$, $\sinh\obs\eta\,n_1 = 0.9375$ and
$\sinh\obs\eta\,n_2 = 0.75$. The velocity $c\tanh\obs\eta\,\hat n$ is $(0.9375, 0.75, 0)\,c/1.5625 = (0.6, 0.48, 0)\,c$,
of speed $0.768c$. The second component is $0.6c/1.25$, because the room sees the first sensor's clocks run slow by
$\obs\gamma = 1.25$ while lengths along $y$ are unchanged.

*The turn.* The last column of $P$ is $R_0$ times the last column of $H$. Leaving out the common factor $i$, the turn
carries $(-0.75, 0.9375)$ to $(-0.9375, 0.75)$. Both arrows have the squared length $1.4414$, and their dot product and
the third component of their cross product give

$$\begin{aligned}
\cos\theta &= \frac{0.7031 + 0.7031}{1.4414} = 0.9756,\\
\sin\theta &= \frac{-0.5625 + 0.8789}{1.4414} = 0.2195,
\end{aligned}$$

so $\theta = 12.7°$. Multiplying out $R_0H$ gives back the other entries of $P$ as well.

So the second sensor reads what a sensor boosted straight from the room to the same velocity reads, turned anticlockwise
about $z$ by $12.7°$. Turning the components anticlockwise is turning the axes clockwise (Step 3), so the second
sensor's axes are turned by $12.7°$, clockwise as seen from $+z$, from the direct sensor's: the sense of the Thomas
precession (Jackson, section 11.8).

The turn is the **Wigner rotation**, which section 6.1 promised. The same steps with letters (the box below) give, for
two boosts at right angles with the factors $\obs\gamma_1$ and $\obs\gamma_2$ and the speeds $\obs\beta_1c$ and
$\obs\beta_2c$,

$$\boxed{\;\begin{aligned}\cos\theta &= \frac{\obs\gamma_1 + \obs\gamma_2}{1 + \obs\gamma_1\obs\gamma_2},\\
\sin\theta &= \frac{\obs\gamma_1\obs\beta_1\,\obs\gamma_2\obs\beta_2}{1 + \obs\gamma_1\obs\gamma_2}\end{aligned}\;}
\label{eq:wigner}$$

here $2.5/2.5625 = 0.9756$ and $0.5625/2.5625 = 0.2195$. The sine is positive for any two boosts, so the sense of the turn never changes. For slow boosts $\theta \approx \obs\beta_1\obs\beta_2/2$, of second order, which is why Newton's
mechanics never sees it.[^wigner]

::: derivation
### The Wigner angle for any two boosts at right angles

We write $C_k = \cosh\obs\eta_k = \obs\gamma_k$ and $S_k = \sinh\obs\eta_k = \obs\gamma_k\obs\beta_k$, with $S_k^2 =
C_k^2 - 1$. The product $\Lambda_y\Lambda_x$ has the last row $(iS_2,\ -iS_1C_2,\ C_1C_2)$ and the last column
$(-iS_2C_1,\ iS_1,\ C_1C_2)$, so $\cosh\obs\eta = C_1C_2$ and the turn carries $(-S_2, S_1C_2)$ to $(-S_2C_1, S_1)$.
Both arrows have the squared length $C_1^2C_2^2 - 1 = (C_1C_2 - 1)(C_1C_2 + 1)$, their dot product is $S_2^2C_1 +
S_1^2C_2 = (C_1 + C_2)(C_1C_2 - 1)$, and their cross product is $S_1S_2(C_1C_2 - 1)$. Dividing by the squared length
gives [](#eq:wigner).
:::

::: try {#stars}
The special directions, with gravity's sky above and light's sky below, for the same sources. The buttons choose one
body, two bodies, a wave or a body with a wave; the slider sets the speed of the first body, which moves along $y$.

Predict first: when the single body moves faster, what happens to light's two directions, and what to their half sum?
Then choose *One body* and move the speed from 0 to $0.9c$: both directions fold toward the motion, and their half sum
grows to the speed across the line, as [the section on the special
directions](#light-has-two-special-directions-where-gravity-has-four) computed. Afterwards choose *Two*: gravity's sky
splits into four directions, while light's keeps two.
:::

::: try {#complex-field}
The fields $\light{\vect E}$ and $c\light{\vect B}$ at one point, with the complex components of $\light{\vect F}$,
the two invariants and the Hermitian length beside them, and a small sky that marks light's two special directions. The
slider boosts the sensor by a rapidity $\obs\eta$ along a direction you choose, and a second control turns its axes. A
second mode, *Plane wave*, shows the amplitude $a$ of a wave in the complex plane.

Answer the predictions at the top of the figure first. Afterwards, turn the sensor's axes instead of boosting it, and
see which numbers a turn changes.
:::

## The turns and boosts are the complex rotations, one for one

We want to prove that the restricted Lorentz group and $SO(3,\mathbb C)$ are one group. That needs a map that sends
each change of observer to a complex rotation, sends a product to the product of the images, reaches every complex
rotation, and sends no two changes of observer to the same one. Such a map is an **isomorphism**. A Lorentz
transformation $\Lambda^\mu{}_\nu$ (section 6.2) is **restricted** when it keeps the direction of time, carrying the
time axis $e_0 = (1, 0, 0, 0)$ to a vector $u^\mu$ with $u^0 > 0$, and keeps the handedness of space.

**Every change of observer is a turn followed by a boost.** The vector $u = \Lambda e_0$ has the same length as $e_0$,
since $\Lambda$ keeps the metric, so $u$ is the four-velocity of some observer. Let $B$ be the boost of section 6.2 to
that observer's velocity, which carries $e_0$ to $u$. Then $B^{-1}\Lambda$ carries $e_0$ to itself. It keeps the metric,
so it keeps the lengths of the vectors perpendicular to $e_0$, which are the arrows of space, and it keeps their
handedness: it is a turn $R$. So $\Lambda = BR$.

**The map.** For each $\Lambda$, the rule $\light F'^{\mu\nu} = \Lambda^\mu{}_\alpha\Lambda^\nu{}_\beta\light
F^{\alpha\beta}$ gives the six new numbers from the six old ones. A turn of the axes gives the new components of every
arrow by a real rotation table, and $\light{\vect E}$ and $\light{\vect B}$ are both arrows, so a turn acts on
$\light{\vect F}$ as that real table; a boost acts as the complex table [](#eq:Lambda). So $\Lambda = BR$ acts on
$\light{\vect F}$ as a product of two complex rotations, itself a complex rotation, which we call $\rho(\Lambda)$.
Applying $\Lambda_1$ to both indices of the field tensor and then $\Lambda_2$ is applying $\Lambda_2\Lambda_1$, so
products match: $\rho(\Lambda_2\Lambda_1) = \rho(\Lambda_2)\,\rho(\Lambda_1)$.

**Every complex rotation is reached.** The polar decomposition of the last section writes any complex rotation as
$P = R_0\,e^{iK_0}$, a boost followed by a real turn. Both are images of changes of observer, so $P$ is the image of
their product.

**Only the identity acts as the identity.** Suppose that $\rho(\Lambda) = 1$, so that $\Lambda$ leaves every
antisymmetric table unchanged. Take the table $F^{\mu\nu} = a^\mu b^\nu - a^\nu b^\mu$ built from two vectors $a$ and
$b$. Contracted with any vector $w$, it gives $F^{\mu\nu}w_\nu = (b\cdot w)\,a^\mu - (a\cdot w)\,b^\mu$, a vector in the
plane of $a$ and $b$, and every vector of that plane arises so. The boosted table is built in the same way from
$\Lambda a$ and $\Lambda b$, and it is the same table, so the plane of $\Lambda a$ and $\Lambda b$ is the plane of $a$
and $b$. Every plane through the origin is therefore kept, and so is every line, the meeting of two planes:
$\Lambda a = \lambda_a a$ for every $a$. Applying this to $a + b$ shows that all the $\lambda_a$ are one number
$\lambda$, so $\Lambda = \lambda\cdot1$. The table then becomes $\lambda^2F$, so $\lambda^2 = 1$, and $\lambda = -1$
reverses time. So $\Lambda = 1$. If two changes of observer had the same image, $\rho(\Lambda_2^{-1}\Lambda_1) = 1$, and
they would be equal. Together,

$$\boxed{\;\text{restricted Lorentz group} \;\cong\; SO(3,\mathbb C)\;} .$$

The set of elements that a map of groups sends to the identity is its **kernel**. Here it holds the identity alone.
For the full Lorentz group it would hold the inversion $x^\mu \to -x^\mu$ as well, which reverses both indices of every
field tensor and so changes no field: that is why the restriction to a fixed direction of time is needed. The
isomorphism is classical, and it underlies the classifications of curvature by Petrov and Penrose that section 9.4
uses [@Petrov2000; @Penrose1960].

**The generators.** A small turn of the axes by $\theta$ about axis $k$ acts on $\light{\vect F}$ as $1 + \theta J_k$,
and a small boost by $\obs\eta$ as $1 + \obs\eta K_k$, with $J_k = -L_k$ and $K_k = -iL_k = iJ_k$ by [](#eq:Lambda).
Multiplying the tables, $L_xL_y - L_yL_x = L_z$, so the turns obey $[J_x, J_y] = -J_z$ and the boosts
$[K_x, K_y] = i^2[J_x, J_y] = J_z$: two boosts in different directions fail to commute by a turn, with the opposite sign
to two turns. This is the Wigner rotation in the small. Expanding both sides to second order shows $e^Ae^B =
e^{A + B + \frac12[A,B] + \dots}$, and for $\Lambda_y\Lambda_x$ with small rapidities, $A = -i\obs\eta_2L_y$ and $B =
-i\obs\eta_1L_x$, the extra term is $\tfrac12[A, B] = \tfrac12\obs\eta_1\obs\eta_2L_z$: a turn of the components about
$z$ by $\obs\beta_1\obs\beta_2/2$, the slow limit of [](#eq:wigner).

## A sensor moving fast enough reads every field as a wave coming at it

We want the reading of a sensor that moves at nearly the speed of light. For a large rapidity, $\cosh\obs\eta \approx
\sinh\obs\eta \approx e^{\obs\eta}/2$, and [](#eq:boost-F) gives

$$\light{\vect F}'_\perp \approx \frac{e^{\obs\eta}}{2}\,\vect w, \qquad \vect w = \light{\vect F}_\perp - i\,\hat
u\times\light{\vect F}_\perp .$$

The vector $\vect w$ is null: $\hat u\times\light{\vect F}_\perp$ is $\light{\vect F}_\perp$ turned by a right angle
across $\hat u$, so $(\hat u\times\light{\vect F}_\perp)\cdot(\hat u\times\light{\vect F}_\perp) = \light{\vect
F}_\perp\cdot\light{\vect F}_\perp$ and $\light{\vect F}_\perp\cdot(\hat u\times\light{\vect F}_\perp) = 0$, and the
two terms of $\vect w\cdot\vect w$ cancel. It also obeys $\hat u\times\vect w = i\vect w$, which is the rule $\hat
k\times\vect m = -i\vect m$ of a light wave with $\hat k = -\hat u$. So the part of the field across the motion grows
without limit and takes the form of a light wave travelling along $-\hat u$, toward the sensor from ahead, while the
part along the motion stays as it was. The invariant does not change, since $\light{\vect F}'_\perp\cdot\light{\vect
F}'_\perp = (\cosh^2\obs\eta - \sinh^2\obs\eta)\,\light{\vect F}_\perp\cdot\light{\vect F}_\perp$ exactly: the electric
and magnetic parts both grow, and become equal and perpendicular. **The exception** is $\vect w = 0$, when
$\light{\vect F}_\perp$ is itself a wave along $+\hat u$. Then $\vect m(z)\cdot\light{\vect F} = 0$ for the direction
$\hat u$, so the sensor moves along one of the field's principal null directions, and the boost shrinks the wave part
by the Doppler factor instead.

**A number.** A sensor crosses the field $\light{\vect E} = (\light E, 0, 0)$ of a charge at rest, moving along $z$ at
$0.99c$, so that $\obs\gamma = \cosh\obs\eta = 7.09$. It reads $\light E'_x = 7.09\,\light E$ and $c\light B'_y =
-7.02\,\light E$: the ratio $|c\light{\vect B}'|/|\light{\vect E}'|$ is $\tanh\obs\eta = 0.99$, and it goes to 1 as the
speed goes to $c$, while $\light E'^2 - c^2\light B'^2 = \light E^2$ stays fixed.

A pixel of gravity reads $\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$, the same table on both indices (section 9.3).
Each factor grows as $e^{\obs\eta}/2$ and turns its index toward the null vector of the wave along $-\hat u$, so both
parts of the tide grow in proportion to $e^{2\obs\eta}$ and $|\curv{\tB}'|/|\curv{\tE}'| \to 1$, while the invariants
stay fixed. A pixel flown through a still room at nearly the speed of light reads the room as a strong gravitational
wave coming at it, and only its invariants show that the scene is still.[^p-fast]

**The idea to keep: light's six numbers are three complex ones, $\light{\vect F} = \light{\vect E} + ic\light{\vect B}$.
A turn and a boost both act on $\light{\vect F}$ as a rotation, real for the turn and imaginary for the boost, so
$\light{\vect F}\cdot\light{\vect F}$ is the same for every observer. A light wave is a complex multiple of the null
vector $\vect m$, where gravity's wave is its square.**

::: problems
### Practice

**[6.6]** Why can $\light{\vect E}$ and $c\light{\vect B}$ be added, but not $\light{\vect E}$ and $\light{\vect B}$?

::: solution
The electric field is in volts per metre and the magnetic field in teslas, $\mathrm{V\,s\,m^{-2}}$. Multiplying the
magnetic field by $c$, in metres per second, gives volts per metre.
:::

**[6.6]** A sensor at rest reads $\light{\vect E} = (3, 0, 0)$ and $c\light{\vect B} = 0$, in some unit. What is $\light
E^2 - c^2\light B^2$ for a sensor moving at $0.8c$ along $y$, and what does it read?

::: solution
The invariant is 9 for both. At $0.8c$, $\cosh\obs\eta = 5/3$ and $\sinh\obs\eta = 4/3$, and with $\hat u = \hat y$,
$\hat y\times\light{\vect F} = (0, 0, -3)$, so [](#eq:boost-F) gives $\light{\vect F}' = (5, 0, 4i)$: the sensor reads
$\light E'_x = 5$ and $c\light B'_z = 4$, and $25 - 16 = 9$.
:::

**[6.6]** Why does a sensor moving along a plane wave read a weaker field?

::: solution
A boost along the direction of travel acts on $\vect m$ as a turn about that direction by the imaginary angle
$i\obs\eta$. A real turn would change only the phase of $a$, by $e^{i\theta}$; the imaginary angle makes the factor
real, $e^{-\obs\eta}$, the Doppler factor.
:::

**[6.6]** How many parts of its own velocity can a sensor of light find from one reading of a charge at rest, and why?

::: solution
Two. A boost along the line to the charge leaves its field, which lies along that line, unchanged, and creates no
magnetic field, so motion along the line cannot be read.
:::

**[6.6]** Expand $\exp(-i\obs\eta\,\hat z\cdot\mathbf L)$ with the series of section 1.7 and show that it is the table with the
rows $(\cosh\obs\eta,\ i\sinh\obs\eta,\ 0)$, $(-i\sinh\obs\eta,\ \cosh\obs\eta,\ 0)$ and $(0, 0, 1)$. Check it on
$\light{\vect F} = (1, 0, 0)$ at $0.6c$.

::: solution
The table $K = \hat z\cdot\mathbf L = L_3$ has $(L_3)_{12} = -1$, $(L_3)_{21} = 1$ and zeros elsewhere, so $K^2 =
\mathrm{diag}(-1, -1, 0)$ and $K^3 = -K$. With $x = -i\obs\eta$, the even powers of $xK$ give $1 + (\cos x - 1)
\,\mathrm{diag}(1, 1, 0)$ and the odd powers give $\sin x\,K$, as for a real angle. Since $\cos(-i\obs\eta) =
\cosh\obs\eta$ and $\sin(-i\obs\eta) = -i\sinh\obs\eta$, the table is $\cosh\obs\eta$ on the first two diagonal places,
1 on the third, and $-i\sinh\obs\eta\,K$, which puts $i\sinh\obs\eta$ at row 1, column 2 and $-i\sinh\obs\eta$ at row 2,
column 1. At $0.6c$, on $(1, 0, 0)$ it gives the first column, $(1.25, -0.75i, 0)$: $\light E'_x = 1.25$ and $c\light
B'_y = -0.75$, as [the section on the moving sensor](#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle)
found.
:::

**[6.6]** A sensor moves at $0.99c$ straight toward a charge at rest, along the line between them. What does it read,
and why does it not see a strong wave as the sensor that crosses the line does?

::: solution
The field $\light{\vect F} = \light E\,\hat u$ lies along the motion, so by [](#eq:boost-F) it is unchanged: the sensor
reads $\light{\vect E}' = \light{\vect E}$ and no magnetic field. The line through the charge holds both of light's
principal null directions, $\pm\hat u$, and a sensor moving along one of them is the exception of the section on fast
sensors: the part across the motion, which would grow, is zero.
:::

### Stretch

**[6.6]** Combine this section with section [6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now). Show that a sensor moving at $\obs\beta$
against a circularly polarized wave reads its amplitude larger by $e^{\obs\eta}$, and its energy density larger by $(1 +
\obs\beta)/(1 - \obs\beta)$, and compare the second factor with 6.3's Doppler factor. Evaluate both at $0.6c$.

::: solution
Against the wave the boost is along $-\hat k$, and $(-\hat k)\times\vect m = i\vect m$, so [](#eq:boost-F) gives
$(\cosh\obs\eta + \sinh\obs\eta)\,a\vect m = e^{\obs\eta}a\vect m$. The energy density $\tfrac12\varepsilon_0|a|^2$
grows by $e^{2\obs\eta}$, and section 6.1 found $e^{2\obs\eta} = (1 + \obs\beta)/(1 - \obs\beta)$. The Doppler factor of
the frequency against the wave is $\obs\gamma(1 + \obs\beta) = e^{\obs\eta}$, so the energy density grows by the square
of the frequency's factor. At $0.6c$: twice the field, twice the frequency, four times the energy density. Nothing
depends on the polarization, because a boost along $\hat k$ multiplies $\vect m$ and leaves $a$'s path the same shape.
:::

**[6.6]** Show that the inversion $x^\mu \to -x^\mu$ is a Lorentz transformation that leaves every field tensor
unchanged, and that it is not a turn followed by a boost. Then check $[K_x, K_y] = J_z$ by multiplying the tables
$L_x$ and $L_y$.

::: solution
The table $\Lambda = -1$ keeps the metric, since $(-1)^2 = 1$, and $\Lambda^\mu{}_\alpha\Lambda^\nu{}_\beta\light
F^{\alpha\beta} = (-1)^2\light F^{\mu\nu}$. It carries $e_0$ to $-e_0$, which reverses the direction of time, while a
turn keeps $e_0$ and a boost carries it to a vector with $u^0 > 0$. With $L_x$ the rows $(0, 0, 0)$, $(0, 0, -1)$,
$(0, 1, 0)$ and $L_y$ the rows $(0, 0, 1)$, $(0, 0, 0)$, $(-1, 0, 0)$, the product $L_xL_y$ has a single entry 1 in
row 2, column 1, and $L_yL_x$ a single entry 1 in row 1, column 2, so $[L_x, L_y]$ has $-1$ in row 1, column 2 and 1 in
row 2, column 1: it is $L_z$. Then $[K_x, K_y] = (-i)^2[L_x, L_y] = -L_z = J_z$.
:::

### The camera

**[6.6]** In the frame where $\light{\vect E}$ is parallel to $\light{\vect B}$, a boost along their common axis and a
turn about it change nothing. Prove it, and show with the invariants that a sensor moving along a
plane wave cannot read its speed from the wave alone either.

::: solution
In the parallel frame $\light{\vect F} = w\hat n$ with $w$ complex and $\hat n$ real. For a boost along $\hat n$,
[](#eq:boost-F) keeps $\light F_\parallel = w$ and has $\light{\vect F}_\perp = 0$ and $\hat n\times\light{\vect F} =
0$, so nothing changes. A turn about $\hat n$ moves only the part across $\hat n$, which is zero. For a plane wave the
invariant is zero for every observer, so the parallel frame does not exist, and a boost along $\hat k$ only multiplies
$a$ by $e^{-\obs\eta}$. Without knowing the size of $a$ in advance, the sensor cannot tell a boosted wave from a weaker
wave at rest, so the wave gives no speed along $\hat k$.
:::
:::

::: paper
- [Section VIII](/paper/#sec:one-pixel): the moving observer who measures a magnetic field past a charge, derived in
  [the section on the moving sensor](#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle).
- [*One complex matrix*](/paper/#par:one-complex-matrix), beside [](/paper/#eq:W): $\Lambda$ here is [](#eq:Lambda), and
  the wave $a\,\vect m$ is [](#eq:wave-F), against [](/paper/#eq:square) and [](/paper/#eq:one-wave).
- [*Principal null directions*](/paper/#par:principal-null-directions), [](/paper/#eq:stars), and Figure
  [](/paper/#fig:stars), bottom row.
- [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity), [](/paper/#eq:polar), and the
  blind spot of [](#eq:aligned).
- [*Spin, speed and compactness*](/paper/#par:spin-speed-and-compactness), in Section III.
:::

::: deeper
- The GR course,
  [section 11.6](https://neovand.github.io/general-relativity/chapter-11.html#11-6-two-field-examples-scalar-waves-and-electromagnetism),
  writes the field tensor and Maxwell's equations as tensor equations, and its lesson
  [*Fields carry energy*](https://neovand.github.io/general-relativity/chapter-11.html#fields-carry-energy) derives the
  energy density and the Poynting vector stated here.
- I. Bialynicki-Birula and Z. Bialynicka-Birula, "The role of the Riemann–Silberstein vector in classical and quantum
  theories of electromagnetism", *Journal of Physics A* 46, 053001 (2013).
- R. Penrose and W. Rindler, *Spinors and Space-Time*, vol. 1 (Cambridge, 1984), chapter 1: the Lorentz group as
  $SO(3,\mathbb C)$ and the null directions of a field.
- J. D. Jackson, *Classical Electrodynamics* (3rd edition, Wiley, 1999), sections 11.10 and 11.8: the transformation of
  the fields, and the Thomas precession.
:::

::: history
### Riemann, Weber, Silberstein and the complex field

H. Weber wrote Maxwell's equations with the combination $\light{\vect E} + ic\light{\vect B}$ in 1901, in a book on the
partial differential equations of physics that presented Riemann's lectures, and L. Silberstein found it again in 1907.
L. H. Thomas met the turn of two boosts in 1926 (*Nature* 117, 514), in the precession of the electron's spin, and E. P.
Wigner placed it in the theory of the Lorentz group in 1939 (*Annals of Mathematics* 40, 149).
:::

[^lorentz]: Named for H. A. Lorentz (1895). The $\vect v$ here is the velocity of the test charge, not of an observer.

[^letters]: The subscript $q$ on $\rho_q$ and $\vect J_q$ keeps them apart from the mass density $\matter\rho$. The vector
    $\light{\vect F}$ is not a force, nor the energy flux $F$ of section 6.5.

[^wave]: Section [5.1](/tutorial/waves/wave-equation/#a-shear-in-a-solid-travels-and-its-law-is-the-wave-equation)
    derives the same equation for a shear in a solid.

[^series]: The sum of section 1.7 holds for complex $\theta$, because the series of the cosine and the sine converge
    for every complex number; the first practice problem does it at $\theta = -i\obs\eta$.

[^present]: Section [6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now): the light a moving body sends shows where it was, its
    steady field where it is now.

[^FF]: In the notation of section 6.2, $\light F_{\mu\nu}\light F^{\mu\nu} = 2(\light B^2 - \light E^2/c^2)$, so
    $\light E^2 - c^2\light B^2 = -\tfrac12c^2\light F_{\mu\nu}\light F^{\mu\nu}$.

[^parallel]: For a real vector $\vect r$ in the plane, $\vect r\cdot\vect m^*$ is the conjugate of $\vect r\cdot\vect m$,
    so the two parts have equal sizes. Conversely, if $f' = \rho e^{i(\phi + \psi)}$ and $g' = \rho e^{i(\phi -
    \psi)}$, then $\light{\vect F}' = \rho e^{i\phi}(e^{i\psi}\vect m + e^{-i\psi}\vect m^*)$, and the bracket is
    twice the real part of $e^{i\psi}\vect m$, a real vector.

[^stereo]: The formula for $\hat n(z)$ is the stereographic projection of the sphere onto the plane from its south pole.
    That a wave along $\vect m(z)$ travels along $\hat n(z)$ follows from $\hat n(z) = i\,\vect m(z)\times\vect
    m(z)^*/|\vect m(z)|^2$, whose third component is $2(1 - |z|^4)/[2(1 + |z|^2)^2] = (1 - |z|^2)/(1 + |z|^2)$.

[^fold]: The directions of a moving body are its directions at rest carried by the aberration of light (section
    [6.3](/tutorial/relativity/aberration/#one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated)):
    for light, the two directions along the line to the charge in its own frame, aberrated.

[^wigner]: The product of the two $4\times4$ boosts of section 6.2 gives the same velocity, $(0.6, 0.48, 0)\,c$, and the
    same turn, $12.680°$.

[^p-fast]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, in the paragraph
    [*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light).

[^p-one]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, in the paragraphs *What every observer agrees on* and
    [*One complex matrix*](/paper/#par:one-complex-matrix).

[^p-square]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:square).

[^p-dir]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:one-wave).

[^p-matrix]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation [](/paper/#eq:W).

[^p-ten]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, in [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity).

[^p-stars]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, [*Principal null directions*](/paper/#par:principal-null-directions), as its equation
    [](/paper/#eq:stars), with Fig. [](/paper/#fig:stars), bottom row, for light.

[^p-polar]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:polar).
