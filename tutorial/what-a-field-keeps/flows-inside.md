---
id: '13.4'
title: 'Flows inside: brackets of moments'
question: 'A sphere whose inner ball and outer shell turn opposite ways has no angular momentum and no magnetic field outside, though all of it moves. What reading made from outside sees such a flow, and why does it take two tides applied in either order, and tides finer than the quadrupole?'
part: '13'
requires: ['1.1', '1.4', '1.5b', '1.6', '1.7', '1.8', '2.1', '2.3', '2.5', '2.6', '2.8', '4.3', '4.5', '7.5', '13.2', '13.3']
paper: [sec:second-order, eq:flow-bracket, eq:hidden-spin, fig:hidden-flow, eq:calderon, eq:sum-rule, tab:hair, tab:null, sec:near-field]
figures: [fig:hidden-flow]
live: [tides-in-turn]
depth: A
---

Section [2.8](/tutorial/outside/flows/#a-flow-of-mass-is-a-mass-flux-and-mass-is-conserved) built a sphere that hides its
motion. Its inner ball, out to 0.871 of the radius, turns one way, and the rest turns the other way at the same rate, so
that the sphere has no angular momentum and no magnetic part of the field outside, though all of it moves. Panel (a) of
Figure [](/paper/#fig:hidden-flow) draws it.

{{paper fig:hidden-flow}}

No reading at one time tells this sphere from the same sphere at rest. What reading made from outside sees such a flow,
and why does it take two tides applied in either order, and tides finer than the quadrupole?[^first]

::: plain
A brief tide gives every part of a body a kick, and the kick has a shape across the body. A moment later a camera
takes a reading: the body's mass added up with a second shape as the weights. Then the two shapes swap roles. At first
the two readings change alike, because both depend only on where the mass is. Later they part, by an amount that grows
as the square of the waiting time and comes from the motion of the mass.

A flow is a sum of waves of many wavelengths and directions. The right pairs of shapes give every one of them, even
when the field outside is that of a body at rest. Distant masses make the simplest tides, which see only the body's
total spin; the sphere in the picture has none, so it takes a nearer mass to see it turn.
:::

## The order of two short tides matters first at the second power of the time

We want what a reading made a short time after a tide holds, and which part depends on the order. We assume that **the forces inside do not depend on the velocities of the parts**, that **the tide acts for an instant**
(section [1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside)), and that **the tide is weak**,
so that we keep only the first power of its strength.

A body has parts $a$ with masses $\matter m_a$ in kilograms, places $\vect x_a$ in metres and momenta $\vect p_a$ in
$\mathrm{kg\,m\,s^{-1}}$. At $t = 0$ the impulsive tide of section 1.7, of profile $g$ and strength
$\sym{impulse-strength}{\epsilon}$, changes every momentum and no place:

$$\vect p_a \to \vect p_a + \epsilon\,\matter m_a\nabla g(\vect x_a) .$$

A short time $\tau$ later, in seconds, we read the moment
$\sym{mass-moment}{\matter{Q_h}} = \sum_a\matter m_ah(\vect x_a)$ of a second profile $h$. We write
$\delta_g\matter{Q_h}$ for its change caused by the tide $g$, against the same body left alone. Taylor's theorem gives

$$\matter{Q_h}(\tau) = \matter{Q_h} + \tau\,\matter{\dot Q_h} + \tfrac12\tau^2\,\matter{\ddot Q_h} + O(\tau^3) ,$$

with every term taken immediately after the tide. The series is in powers of $\tau$ times the body's own rates, such as $\Omega\tau$ for a body turning at the rate
$\Omega$, and fails when $\tau$ approaches a period of the motion. The first term does not change, because the places do not. The rate
$\matter{\dot Q_h} = \sum_a\vect p_a\cdot\nabla h(\vect x_a)$ changes by
$\epsilon\int\sym{density}{\matter\rho}\,\nabla g\cdot\nabla h\,\dd V$, the bracket of two moments of section 1.7. With
Newton's $\dot{\vect p}_a = \vect F_a$, where $\vect F_a$ is the force on the part $a$ from the rest of the body, and
$\dot{\vect x}_a = \vect p_a/\matter m_a$, the product rule gives

$$\matter{\ddot Q_h} = \sum_a\vect F_a\cdot\nabla h + \sum_a\vect p_a\cdot(\nabla\nabla h)\,\frac{\vect p_a}{\matter m_a} ,$$

where $\nabla\nabla h$ is the Hessian of $h$ at $\vect x_a$ (section
[1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives)). The forces depend on the
places alone, so the first sum does not change. In the second, the kicked momenta give two equal cross terms,
$2\epsilon\sum_a\vect p_a\cdot(\nabla\nabla h)\nabla g$, and a term in $\epsilon^2$, which the third assumption drops.
Half of the cross terms, times $\tau^2$, is the next term of the change:

$$\boxed{\;\frac{\delta_g\matter{Q_h}}{\epsilon} = \tau\int\matter\rho\,\nabla g\cdot\nabla h\,\dd V + \tau^2\sum_a\vect p_a\cdot(\nabla\nabla h)\,\nabla g + O(\tau^3) .\;}$$

Both terms have the unit of the left side.[^units]

Now we exchange the roles: apply the tide $h$ and read $\matter{Q_g}$, which changes only the second term. A
**response** is the change of a reading per unit of the push that caused it (section 4.5), here to a push that lasts
an instant. Half the sum of the two responses is their **symmetric part**, which stays the same when the profile
applied and the moment read are exchanged; half their difference is their **antisymmetric part**, which changes sign.
The stretch problem of section 1.7 found that $\sum_a\vect p_a\cdot[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h]$
is the Poisson bracket of the two rates $\matter{\dot Q_h}$ and $\matter{\dot Q_g}$. We call it the **bracket of two
rates**, $\sym{bracket-of-rates}{\{\matter{\dot Q_h}, \matter{\dot Q_g}\}}$. So

$$\boxed{\;\frac{\delta_g\matter{Q_h} - \delta_h\matter{Q_g}}{\epsilon} = \tau^2\,\{\matter{\dot Q_h}, \matter{\dot Q_g}\} + O(\tau^3) ,\;}$$

the change of $Q_h$ per unit of a weak impulse of profile $g$, less the change of $Q_g$ per unit of one of profile $h$
(Figure [](#fig:tides-in-turn)). Differentiated once, the series makes the two orders of a reading of the rate differ by
$2\tau\{\matter{\dot Q_h}, \matter{\dot Q_g}\}$.

In the symmetric part the terms in $\tau^2$ add up, and by the product rule

$$\frac{\dd}{\dd t}\sum_a\matter m_a\nabla h\cdot\nabla g = \sum_a\vect p_a\cdot\bigl[(\nabla\nabla h)\nabla g + (\nabla\nabla g)\nabla h\bigr] ,$$

so the symmetric part is $\tau$ times $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ taken halfway through the wait.

**A number.** For twelve parts on springs in a trap, the difference over $\tau^2$ is 5.043 at $\tau = 0.02$ and 5.268
at $\tau = 0.004$, against the bracket's 5.323.[^sim] The gap shrinks as $\tau$, as $O(\tau^3)$ says.

**A picture.** For $h = \tfrac12(x^2 - y^2)$ and $g = xy$ the gradients, $(x, -y, 0)$ and $(y, x, 0)$, are at right
angles, so the first term vanishes, and $(\nabla\nabla h)\nabla g = (y, -x, 0)$. With
$L_z = \sum_a(x_ap_{a,y} - y_ap_{a,x})$ the angular momentum about the $z$ axis (section 1.6), a kick with $g$ changes
the reading of $h$ by $-\epsilon\tau^2L_z$, and the other order gives $+\epsilon\tau^2L_z$. The kick
$g$ stretches the body along the diagonal $x = y$, which leaves $\matter{Q_h}$, a comparison of its extents along $x$
and $y$, unchanged; a body turning anticlockwise carries the stretch round towards the $y$ axis, and $\matter{Q_h}$
falls. Turning rigidly at $\Omega$, it has $L_z = \Omega\int\matter\rho\,\varpi^2\,\dd V$, with $\varpi$ the
distance from the axis, and $\varpi^2 = |\nabla h|^2$. So the turning's change is $\Omega\tau$ times the first-order
change $\epsilon\tau\int\matter\rho\,|\nabla h|^2\,\dd V$ that $h$ makes in its own reading: 0.0044 times for the
Earth, read a minute after the tide.

The symmetric part appears at the first power of $\tau$ and weighs the density (section 13.2); the antisymmetric part
appears first at the second power and weighs the momenta: the flow.

![Look first at the shaded gap: the two orders start along the same straight line, which weighs the density, and part
as the square of the time, by the bracket of the two rates, which weighs the flow. The lower panel is the upper one
less that straight line, drawn forty times higher. The curves are the series of the text for the twelve parts of the
margin note, without its higher terms.](tut-tides-in-turn){#fig:tides-in-turn}

## The bracket of two rates is an integral of the flow

Spread over the body, the momentum per unit volume is the **mass flux** $\sym{mass-flux}{\matter{\vect J}} = \matter\rho\,\vect v$
of section 2.8, in $\mathrm{kg\,m^{-2}\,s^{-1}}$.[^J] The bracket of two rates, the Poisson bracket of the rates of
change of two moments,[^moment] becomes

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = \int\matter{\vect J}\cdot\bigl[(\nabla\nabla h)\,\nabla g - (\nabla\nabla g)\,\nabla h\bigr]\,\dd V . \label{eq:flow-bracket}$$

**Units.** For quadratic profiles, in square metres, the Hessians are pure numbers and each
gradient is in metres, so the bracket is in $\mathrm{kg\,m^2\,s^{-1}}$, the unit of an angular momentum. Each degree
added to either profile adds a metre.

**Checks.** The bracket is antisymmetric in $h$ and $g$, so it is zero for $h = g$, and zero when both profiles are
linear, because both Hessians vanish. It is linear in $\matter{\vect J}$, so it changes sign when every velocity is
reversed and vanishes for a body at rest.

## Calderón's pair reads the flow's Fourier transform

We want the bracket for the pair of harmonic exponentials of section
[13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple). Here $\vect\xi$ is a
real wavevector in $\mathrm{m^{-1}}$, $\vect\eta$ a real vector at right angles to it and as long, and

$$\sym{calderon-vectors}{\vect\zeta_\pm} = \tfrac12\,(i\vect\xi \pm \vect\eta), \qquad h_\pm = e^{\vect\zeta_\pm\cdot\vect x} ,$$

both harmonic because $\vect\zeta_\pm\cdot\vect\zeta_\pm = 0$. Each derivative of $h_\pm$ brings down a
component of $\vect\zeta_\pm$, so the gradient is $\vect\zeta_\pm h_\pm$, and the Hessian is the table with the entries
$\zeta_{\pm i}\zeta_{\pm j}h_\pm$. A table with the entries $\zeta_i\zeta_j$ sends a vector $\vect b$ to
$\vect\zeta\,(\vect\zeta\cdot\vect b)$, so

$$(\nabla\nabla h_+)\,\nabla h_- = \vect\zeta_+\,(\vect\zeta_+\cdot\vect\zeta_-)\,h_+h_- ,$$

and the same holds with $+$ and $-$ exchanged. We subtract, and use section 13.2's
$\vect\zeta_+\cdot\vect\zeta_- = -\tfrac12|\vect\xi|^2$ and $h_+h_- = e^{i\vect\xi\cdot\vect x}$, with
$\vect\zeta_+ - \vect\zeta_- = \vect\eta$:

$$\begin{aligned}
(\nabla\nabla h_+)\,\nabla h_- - (\nabla\nabla h_-)\,\nabla h_+ &= (\vect\zeta_+\cdot\vect\zeta_-)(\vect\zeta_+ - \vect\zeta_-)\,e^{i\vect\xi\cdot\vect x}\\
&= -\tfrac12|\vect\xi|^2\,\vect\eta\,e^{i\vect\xi\cdot\vect x} .
\end{aligned}$$

We take the dot product with $\matter{\vect J}$ and integrate over the body:

$$\boxed{\;\{\matter{\dot Q_{h_+}}, \matter{\dot Q_{h_-}}\} = -\tfrac12|\vect\xi|^2\,\vect\eta\cdot\sym{flow-transform}{\matter{\tilde{\vect J}}}(\vect\xi), \qquad \matter{\tilde{\vect J}}(\vect\xi) = \int\matter{\vect J}\,e^{i\vect\xi\cdot\vect x}\,\dd V .\;}$$

Here $\matter{\tilde{\vect J}}$ is the **Fourier transform of the flow**, each component transformed with the plus sign
in space (section 2.6), in $\mathrm{kg\,m\,s^{-1}}$. The profiles $h_\pm$ are pure numbers, so both sides are in
$\mathrm{kg\,m^{-2}\,s^{-1}}$. A tide is real, but the bracket is linear in each profile, so the real and imaginary
parts of section 13.2, $h_\pm = u_\pm + iv_\pm$, split it into four brackets of real tides.

**Turning $\vect\eta$.** The bracket gives the component of $\matter{\tilde{\vect J}}$ along $\vect\eta$, and
$\vect\eta$ may be any vector at right angles to $\vect\xi$ and as long. Turning it a right angle about $\vect\xi$
gives a second component, and the two make the **transverse part** of the transform, its part at right angles to
$\vect\xi$ (Figure [](#fig:flow-transverse)).

**The third component.** The part along $\vect\xi$, the **longitudinal part**, comes from the continuity equation of
section 2.8, $\partial\matter\rho/\partial t + \nabla\cdot\matter{\vect J} = 0$. We multiply it by
$e^{i\vect\xi\cdot\vect x}$ and integrate by parts, which moves the divergence onto the exponential with a change of
sign:

$$\frac{\dd\matter{\tilde\rho}}{\dd t} = i\vect\xi\cdot\matter{\tilde{\vect J}}(\vect\xi), \qquad \matter{\tilde\rho}(\vect\xi) = \int\matter\rho\,e^{i\vect\xi\cdot\vect x}\,\dd V .$$

Section 13.2 reads $\matter{\tilde\rho}$ from the symmetric part, and two such readings a moment apart give its rate.

A round body turning steadily keeps its density, so $\vect\xi\cdot\matter{\tilde{\vect J}} = 0$, and the bracket
reads all its flow.

**What it means.** With the transform known at every wavevector, the inverse transform of section
[2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time), whose sign is
opposite to the forward one's,
$\matter{\vect J}(\vect x) = \int\matter{\tilde{\vect J}}(\vect\xi)\,e^{-i\vect\xi\cdot\vect x}\,\dd^3\xi/(2\pi)^3$,
gives $\matter{\vect J}$ itself. So a flow with no magnetic field outside is read from outside as the density is.

![Look first at the two dashed arrows: the bracket of Calderón's pair reads the part of the flow's transform at right
angles to $\vect\xi$, one component for each position of $\vect\eta$, and the rate of change of the density reads the
part along $\vect\xi$. The lengths are chosen for the drawing.](tut-flow-transverse){#fig:flow-transverse}

## Every silent flow is read by Calderón's pair

Section 2.8 set up two scenes that no reading at one time tells apart: a uniform ball at rest, and the same ball with
rolls inside it, $\matter{\vect J} = \nabla\times\nabla\times\vect V$, with $\vect V$ and its first derivatives zero
outside.

We transform the rolls. Because $\vect V$ is confined, integration by parts moves each derivative $\partial_j$ onto
$e^{i\vect\xi\cdot\vect x}$, where it becomes $-i\xi_j$. The curl of a curl becomes two cross products with
$-i\vect\xi$, and section 1.1's rule for a double cross product gives

$$\matter{\tilde{\vect J}} = (-i)^2\,\vect\xi\times(\vect\xi\times\tilde{\vect V}) = |\vect\xi|^2\,\tilde{\vect V}_\perp ,$$

with $\tilde{\vect V}_\perp$ the part of $\tilde{\vect V}$ at right angles to $\vect\xi$. The longitudinal part is
zero, so the density never changes, as section 2.8 found. The transverse part is read, as
$-\tfrac12|\vect\xi|^4\,\vect\eta\cdot\tilde{\vect V}$, while the resting ball gives zero. Rolls that gave zero for
every $\vect\xi$ and $\vect\eta$ would have no transform, and so no flow: Calderón's pair sees every roll. So it does
the swirls whose moments of the flow (section 2.8) all vanish, such as the hidden swirl: their transform is transverse
and not zero.

**Which polynomial tides read the rolls.** Take the rolls of the stretch problem of section 2.8,
$\vect V = K(1 - r^2/R^2)^2\,\hat z$ inside a ball of radius $R$, with $K$ in $\mathrm{kg\,s^{-1}}$. Their flow is
unchanged by the reflection $\vect x \to -\vect x$. For homogeneous tides of degrees $m$ and $n$ the
bracket's vector is homogeneous of degree $m + n - 3$, so it changes sign under the reflection when $m + n$ is even,
and its integral against the rolls vanishes. So every pair of equal degree, about any axis, misses these rolls.

A quadrupole with an octupole reads them. For $h = z^2 - \tfrac12(x^2 + y^2)$ and $g = z^3 - \tfrac32z(x^2 + y^2)$,
integration by parts moves both curls from $\vect V$ onto the vector, whose curl of a curl is $36\,\hat z$, so

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = 36\int V_z\,\dd V = \tfrac{384\pi}{35}KR^3 ,$$

in $\mathrm{kg\,m^3\,s^{-1}}$: the integral that sets the rolls' potential outside in section 2.8.

The table of the two null spaces in section 2.8 can now name what reveals each ($\field\psi$ is the confined function
of section 2.5):

| Channel | What it cannot see | What reveals it |
|---|---|---|
| Electric part, $\curv{\tE}$ | $\nabla^2\field\psi/4\pi G$: a nugget against its flush | the symmetric part, $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ (13.2) |
| Magnetic part, $\curv{\tB}$ | rolls $\nabla\times\nabla\times\vect V$; swirls whose moments all vanish | the antisymmetric part, $\{\matter{\dot Q_h}, \matter{\dot Q_g}\}$ (here) |

For a stone the antisymmetric part is the flow; for a black hole, nothing is read beyond the seven numbers of its mass,
place and spin.

## Two quadrupolar tides read only the angular momentum

We want the bracket for the tides that distant masses make. We assume that **$h$ and $g$ are homogeneous
quadratics**.[^P] Each Hessian is then a constant symmetric table, and each gradient is that table acting on the
place, $\nabla h = (\nabla\nabla h)\,\vect x$. So the vector inside the bracket is

$$(\nabla\nabla h)(\nabla\nabla g)\,\vect x - (\nabla\nabla g)(\nabla\nabla h)\,\vect x = [\nabla\nabla h, \nabla\nabla g]\,\vect x ,$$

where the **commutator** of two tables $A$ and $B$, $[A, B] = AB - BA$, is the amount by which their two products
differ. Transposing a product reverses its order, and both tables are symmetric, so the transpose of $AB$ is $BA$: the
commutator of two symmetric tables is antisymmetric. By section
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise) it is a vector in disguise,
$[\nabla\nabla h, \nabla\nabla g]_{ij} = \epsilon_{ijk}c_k$, with $\epsilon_{ijk}$ the Levi-Civita symbol, which acts on
$\vect x$ as $\vect x\times\vect c$.

A cyclic move of the triple product turns the integrand $\matter{\vect J}\cdot(\vect x\times\vect c)$ into
$\vect c\cdot(\matter{\vect J}\times\vect x)$, and swapping the two factors gives
$-\vect c\cdot(\vect x\times\matter{\vect J})$. The integral of $\vect x\times\matter{\vect J}$ is the angular
momentum $\sym{angular-momentum}{\vect L}$ (section 2.8). So

$$\boxed{\;\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -\vect c\cdot\vect L .\;}$$

**An example.** For the pair of the first section, $h + ig = \tfrac12(x + iy)^2$, the Hessian of $h$ has the diagonal
$(1, -1, 0)$, and that of $g$ has 1 in the places $xy$ and $yx$. Their product in one order has $1$ in the place $xy$
and $-1$ in $yx$, and in the other order the reverse. So the commutator has $2$ in the place $xy$ and $-2$ in $yx$,
$\vect c = (0, 0, 2)$, and, as the first section found,

$$\boxed{\;\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -2L_z .\;}$$

**A number.** The Earth, of mass $\sym{mass}{\matter M}$ and radius $R$, turning at
$\sym{angular-velocity}{\vect\Omega}$, has the angular momentum of section 1.6,
$\vect L = 0.3307\,\matter MR^2\vect\Omega = 5.85 \times 10^{33}\unit{kg\,m^2\,s^{-1}}$. For this pair about its axis
the bracket is $-1.17 \times 10^{34}\unit{kg\,m^2\,s^{-1}}$, and a kick with $g$ read a minute later changes
$\matter{Q_h}$ by $-\epsilon \times 2.1 \times 10^{37}\unit{kg\,m^2\,s}$. For the hidden swirl it is zero.

Two quadrupolar tides see the flow only through $\vect L$, the spin dipole of the magnetic part outside (section 2.8),
and miss the hidden swirl and the rolls.

## Octupolar tides read the hidden swirl

We want the bracket for finer tides on a body whose layers turn about one axis. Assume that **the density depends
only on the distance $r$ from the centre**, and that **each spherical layer turns rigidly about the $z$ axis at its own
rate $\sym{layer-rate}{\Omega(r)}$**, in $\mathrm{s^{-1}}$, so that
$\matter{\vect J} = \matter\rho\,\Omega(r)\,(-y, x, 0)$.

For the profiles we take the harmonic functions in the plane of section 2.1, $h + ig = f(w)$, with $f$ a polynomial in
the complex place $\sym{complex-place}{w} = x + iy$ of the body's equatorial plane, and $f'$ its derivative with respect
to $w$. They do not depend on $z$, and the box of section 2.1 shows that they are harmonic and that
$f' = \partial_xh + i\,\partial_xg$. The Cauchy–Riemann equations turn $\partial_xg$ into $-\partial_yh$, so

$$\nabla h = (\mathrm{Re}\,f', -\mathrm{Im}\,f', 0), \qquad \nabla g = (\mathrm{Im}\,f', \mathrm{Re}\,f', 0) ,$$

and the Hessians come in the same way from $f''$. The box below multiplies them out, and the integrand collapses to

$$\matter{\vect J}\cdot\bigl[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h\bigr] = -2\matter\rho\,\Omega(r)\,\mathrm{Re}\bigl[w\,f''(w)\,f'(w)^*\bigr] ,$$

with $^*$ the complex conjugate. For the pair $f = w^n/n$, of degree $n$, $f' = w^{n-1}$ and $f'' = (n - 1)\,w^{n-2}$,
so $wf''f'^* = (n - 1)\,\varpi^{2n-2}$, with $\varpi = |w|$, and

$$\boxed{\;\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -2(n - 1)\int\matter\rho\,\Omega(r)\,\varpi^{2n-2}\,\dd V .\;}$$

::: derivation
### The integrand as complex numbers

Section 1.5b writes an arrow $(u_1, u_2)$ as the complex number $u_1 + iu_2$. The dot product of two arrows $a$ and $b$
is then $\mathrm{Re}(ab^*)$, and turning an arrow a right angle anticlockwise multiplies it by $i$. Let
$f' = \alpha + i\beta$ and $f'' = \gamma + i\kappa$. The gradients are $(\alpha, -\beta)$, which is $f'^*$, and
$(\beta, \alpha)$, which is $if'^*$. By the box of section 2.1 applied to $f'$, $\partial_xf' = f''$ and
$\partial_yf' = if''$, so the Hessian of $h$ sends $(u_1, u_2)$ to $(\gamma u_1 - \kappa u_2, -\kappa u_1 - \gamma u_2)$,
which is $(f''u)^*$, and that of $g$ sends it to $(\kappa u_1 + \gamma u_2, \gamma u_1 - \kappa u_2)$, which is
$i(f''u)^*$. So

$$(\nabla\nabla h)\nabla g \;\to\; (f''\,if'^*)^* = -if''^*f', \qquad (\nabla\nabla g)\nabla h \;\to\; i\,(f''f'^*)^* = if''^*f' ,$$

whose difference is $-2if''^*f'$. The flow $(-y, x)$ is $w$ turned a right angle, $iw$, times $\matter\rho\,\Omega$, so
the dot product is

$$\mathrm{Re}\bigl[\matter\rho\,\Omega\,iw\,(-2if''^*f')^*\bigr] = \mathrm{Re}\bigl[\matter\rho\,\Omega\,iw\cdot 2if''f'^*\bigr] = -2\matter\rho\,\Omega\,\mathrm{Re}\bigl[wf''f'^*\bigr] .$$
:::

**Checks.** For $n = 2$ the bracket is $-2L_z$, as in the last section. For $n = 3$ the integrand is
$-4\matter\rho\,\Omega\,\varpi^4$, as the problem of section 2.8 found term by term. For a uniform ball turning
rigidly, $\varpi = r\sin\theta$ with $\theta$ the angle from the axis, and the average over directions of section 1.8,
$\langle\sin^4\theta\rangle = \tfrac{8}{15}$, with $\int\matter\rho\,r^4\,\dd V = \tfrac37\matter MR^4$, gives at $n = 3$

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -4\Omega\cdot\tfrac{8}{15}\cdot\tfrac37\,\matter MR^4 = -\tfrac{32}{35}\,\matter M\Omega R^4 .$$

**The share of each radius.** For a round body we average over directions one layer at a time. The layer between $r$
and $r + \dd r$ has the volume $4\pi r^2\,\dd r$, and in it $\varpi^{2n-2}$ averages to
$\langle\sin^{2n-2}\theta\rangle\,r^{2n-2}$. So the layer's **share** of the bracket goes as
$\matter\rho\,\Omega(r)\,r^{2n}\,\dd r$, as the figure's panel (b) draws it: a finer tide gives the outer
layers more weight (Figure [](#fig:shares-by-degree)).

**The hidden swirl.** Let a uniform sphere's inner ball, out to the radius $a$, turn at $+\Omega$ and the rest at
$-\Omega$. The shares add up to $\int_0^ar^{2n}\,\dd r - \int_a^Rr^{2n}\,\dd r = (2a^{2n+1} - R^{2n+1})/(2n + 1)$, so
the bracket is the rigid ball's times $2a^{2n+1}/R^{2n+1} - 1$. For $n = 3$,

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = \tfrac{32}{35}\Bigl(1 - \frac{2a^7}{R^7}\Bigr)\matter M\Omega R^4 .$$

At the radius $a = 2^{-1/5}R$ of section 2.8, where $\vect L = 0$, the factor $2a^7/R^7$ is $2^{-2/5}$, and

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = \tfrac{32}{35}\bigl(1 - 2^{-2/5}\bigr)\,\matter M\Omega R^4 = 0.221\,\matter M\Omega R^4 ,$$

in $\mathrm{kg\,m^4\,s^{-1}}$, with $\Omega$ the inner ball's rate: about a quarter of the rigid ball's size, with the
opposite sign. For $n = 2$ the factor is $2a^5/R^5 - 1$, zero at the same radius, so the two areas of panel (b) are
equal.

**The zero.** The octupolar bracket vanishes where $2a^7 = R^7$:

$$\boxed{\;a = 2^{-1/7}R = 0.906\,R ,\;}$$

outside the radius $0.871R$ of section 2.8. At degree three each radius counts as $r^6$, against $r^4$ in the angular
momentum, so the inner ball must grow to balance the outer layers: at $0.906R$ it holds 74 per cent of the mass, not
66.

**A number.** The pair of degree four gives $\tfrac{32}{35}(1 - 2^{-4/5}) = 0.389\,\matter M\Omega R^6$ on the hidden
swirl, in $\mathrm{kg\,m^6\,s^{-1}}$. Its rigid value is again $-\tfrac{32}{35}\matter M\Omega R^6$, from
$\langle\sin^6\theta\rangle = \tfrac{16}{35}$ and $\int\matter\rho\,r^6\,\dd V = \tfrac13\matter MR^6$, a coincidence of
degrees three and four.

![Look first at the areas above the line: with each degree the outer layers count for more, so at degree two the areas
balance and at degrees three and four the outer part wins. The ticks under the axis mark where the inner ball would
have to end for each sum to vanish.](tut-shares-by-degree){#fig:shares-by-degree}

## At a known rate of turning, the field outside holds the first rung of the ladder

At a known rate of turning, the field outside reaches $\int\matter\rho\,r^2g'\,\dd V$ with $g'$ harmonic: the first
rung of the ladder of section 13.3, which a tide of degree two also reaches. Section 7.5 stated this; we derive it. We
assume that **the body turns rigidly**, $\vect v = \vect\Omega\times\vect x$, at a known $\vect\Omega$, and that **$g$
is a homogeneous harmonic polynomial of degree $\ell$**.

The magnetic moment of section 7.5 is $m[g] = \int(\vect x\times\matter\rho\vect v)\cdot\nabla g\,\dd V$. The rule for a
double cross product gives
$\vect x\times(\vect\Omega\times\vect x) = \vect\Omega\,r^2 - \vect x\,(\vect\Omega\cdot \vect x)$, and Euler's relation
of section 13.3, $\vect x\cdot\nabla g = \ell g$, then gives

$$m[g] = \int\matter\rho\,r^2\,\vect\Omega\cdot\nabla g\,\dd V - \ell\int\matter\rho\,(\vect\Omega\cdot\vect x)\,g\,\dd V .$$

The polynomial $(\vect\Omega\cdot\vect x)\,g$ has the degree $\ell + 1$. Both factors are harmonic, so the product rule
of section 2.1 leaves only the cross term: $\nabla^2[(\vect\Omega\cdot\vect x)g] = 2\,\vect\Omega\cdot\nabla g$. A
derivative of a harmonic function is harmonic, so a second Laplacian gives zero: the polynomial is biharmonic, and the
split of section 13.3 writes it as

$$(\vect\Omega\cdot\vect x)\,g = H_{\ell+1} + r^2H_{\ell-1} ,$$

with $\sym{harmonic-polynomial}{H_{\ell+1}}$ and $H_{\ell-1}$ harmonic polynomials of those degrees. We take the
Laplacian of both sides. The first term gives zero, and the formula
$\nabla^2(r^{2j}H_\ell) = 2j(2\ell + 2j + 1)\,r^{2j-2}H_\ell$ of section 13.3, with $j = 1$ and $\ell - 1$ in place of
$\ell$, gives $2(2\ell + 1)H_{\ell-1}$. So

$$H_{\ell-1} = \frac{\vect\Omega\cdot\nabla g}{2\ell + 1} .$$

We put the split into $m[g]$ and collect the terms in $r^2\,\vect\Omega\cdot\nabla g$, with
$1 - \ell/(2\ell + 1) = (\ell + 1)/(2\ell + 1)$:

$$\boxed{\;m[g] = \frac{\ell + 1}{2\ell + 1}\int\matter\rho\,r^2\,(\vect\Omega\cdot\nabla g)\,\dd V - \ell\int\matter\rho\,H_{\ell+1}\,\dd V .\;}$$

This is the statement of section 7.5, with $g' = \vect\Omega\cdot\nabla g$. The last integral is a harmonic mass moment,
which the electric part outside fixes (section 2.5). With $g$ in $\mathrm m^\ell$, every term is in
$\mathrm{kg\,m^{\ell+1}\,s^{-1}}$.

**A check and a number.** For $\ell = 1$ and $g = x_k$, the moment is $L_k$ and
$H_2 = (\vect\Omega\cdot\vect x)\,x_k - \tfrac13r^2\Omega_k$, so the box gives
$L_k = \tfrac23\Omega_k\int\matter\rho\,r^2\,\dd V - \int\matter\rho\,H_2\,\dd V$, which is the check of section 7.5.
For the Earth, with $\vect\Omega$ along its axis and $k = z$, $H_2 = \tfrac13\Omega\,(3z^2 - r^2)$, and its integral is
$\tfrac13\Omega$ times $\matter Q_{zz} = -2J_2\matter MR^2$ of section 2.3, with $J_2 = 1.08 \times 10^{-3}$. So the
electric part's term, $\tfrac23J_2\matter MR^2\Omega = 1.3 \times 10^{31}\unit{kg\,m^2\,s^{-1}}$, is 0.22 per cent
of $L$.

As $g$ runs over the harmonics of degree $\ell$, $g'$ runs over all those of degree $\ell - 1$.[^onto] For a round body
every such integral vanishes except for $g' = 1$, so only $\ell = 1$, the angular momentum, survives, as section 7.5
says.

## A vortex splits the quadrupole modes of a trapped gas

A trapped cloud of cold atoms can hold a **vortex**, a line about which the gas turns, each atom carrying the angular
momentum $\hbar$. Its **quadrupole modes** are normal modes (section 4.3) in which its cross-section oscillates as an
ellipse; without the vortex, the two whose ellipses turn in opposite senses ring at one frequency. We want the
splitting that the vortex makes, and we find it from the two orders of the first section.

We use the pair of the first section, $h = \tfrac12(x^2 - y^2)$ and $g = xy$, and the complex profile
$h + ig = \tfrac12w^2$, with $w = x + iy$. We assume that **the cloud is round about the $z$ axis**, and that **a kick
with $h$ or $g$ excites only the two quadrupole modes**, as it does in a harmonic trap, where a flow along $\nabla h$
or $\nabla g$ is a normal mode. Call the frequencies $\omega_+$, of the mode whose ellipse turns anticlockwise, and
$\omega_-$, of the one that turns clockwise, both positive, in $\mathrm{s^{-1}}$. We combine the two readings into one
complex number, $\delta\matter{Q_h} + i\,\delta\matter{Q_g}$, the change of the moment of $\tfrac12w^2$. Turning the
cloud by an angle $\alpha$ multiplies $w^2$ by $e^{2i\alpha}$, and an ellipse looks the same after half a turn. So in one
period of its mode an ellipse turns by half a turn, and the anticlockwise mode makes the complex reading turn as
$e^{i\omega_+t}$, the clockwise one as $e^{-i\omega_-t}$.

A kick of strength $\epsilon$ with the profile $h$ at $t = 0$ therefore leaves, a time $\tau$ later,

$$\delta\matter{Q_h} + i\,\delta\matter{Q_g} = A_+e^{i\omega_+\tau} + A_-e^{-i\omega_-\tau} ,$$

with complex amplitudes $A_\pm$. The kick moves no place, so the change is zero at $\tau = 0$ and $A_- = -A_+$. Its
rate at $\tau = 0$ is the first-order term of the first section: $\epsilon\int\matter\rho\,|\nabla h|^2\,\dd V$ for
$\matter{Q_h}$, and $\epsilon\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V = 0$ for $\matter{Q_g}$, because $\nabla h =
(x, -y, 0)$ and $\nabla g = (y, x, 0)$ are at right angles everywhere. We write
$S = \int\matter\rho\,|\nabla h|^2\,\dd V = \int\matter\rho\,\varpi^2\,\dd V$, the sum rule of section 13.1, with
$\varpi$ the distance from the axis. Differentiating at $\tau = 0$ gives $iA_+(\omega_+ + \omega_-) = \epsilon S$. We
expand both exponentials to the second power of $\tau$:

$$\begin{aligned}
\delta\matter{Q_h} + i\,\delta\matter{Q_g} &= \frac{\epsilon S}{i(\omega_+ + \omega_-)}\Bigl[i(\omega_+ + \omega_-)\tau - \tfrac12(\omega_+^2 - \omega_-^2)\tau^2\Bigr] + O(\tau^3)\\
&= \epsilon S\tau + \tfrac i2\,\epsilon S(\omega_+ - \omega_-)\tau^2 + O(\tau^3) .
\end{aligned}$$

The imaginary part is $\delta_h\matter{Q_g} = \tfrac12\epsilon S(\omega_+ - \omega_-)\tau^2$. The first section gives the
same quantity from the flow. Its symmetric part is $\tau$ times $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$, which
is zero, so $\delta_h\matter{Q_g} = -\delta_g\matter{Q_h}$, and their difference is $\epsilon\tau^2$ times the bracket
of two rates. So $\delta_h\matter{Q_g} = -\tfrac12\epsilon\tau^2\{\matter{\dot Q_h}, \matter{\dot Q_g}\}$. We equate the
two, and use the bracket $-2L_z$ of this pair:

$$\boxed{\;\omega_+ - \omega_- = -\frac{\{\matter{\dot Q_h}, \matter{\dot Q_g}\}}{\int\matter\rho\,|\nabla h|^2\,\dd V} = \frac{2L_z}{\int\matter\rho\,\varpi^2\,\dd V} .\;}$$

The bracket divided by the sum rule is the splitting. Zambelli and Stringari found it with the sum rules of quantum
mechanics, in which the bracket is a commutator [@ZambelliStringari1998]. Both sides are in $\mathrm{s^{-1}}$: an angular
momentum in $\mathrm{kg\,m^2\,s^{-1}}$ over $\mathrm{kg\,m^2}$. The derivation needs no assumption that the splitting is
small.

**Checks.** With no flow, $L_z = 0$ and the modes ring together. Reversing every velocity reverses $L_z$ and exchanges
the modes. A cloud turning rigidly at $\Omega$ has $L_z = \Omega\int\matter\rho\,\varpi^2\,\dd V$, and the splitting is
$2\Omega$. **What it means.** The two parts of the kicked ellipse have equal amplitudes, and
$e^{i\omega_+\tau} - e^{-i\omega_-\tau} = 2i\sin\bigl(\tfrac12(\omega_+ + \omega_-)\tau\bigr)\,e^{i(\omega_+ - \omega_-)\tau/2}$:
the ellipse pulses at the mean frequency while the complex reading turns at $\tfrac12(\omega_+ - \omega_-)$, so the
ellipse's axes turn at a quarter of the splitting, in the sense of the flow. The turning gas carries each ellipse round,
as in the first section's picture, and this slow turn of the axes is how the splitting is measured (F. Chevy,
K. W. Madison and J. Dalibard, *Phys. Rev. Lett.* **85** (2000) 2223).

**A number.** For a vortex each atom of mass $m_1$ carries $\hbar$, so $L_z = N\hbar$ and
$\int\matter\rho\,\varpi^2\,\dd V = Nm_1\langle\varpi^2\rangle$ for $N$ atoms, and the splitting is
$2\hbar/m_1\langle\varpi^2\rangle$: twice the angular momentum per atom divided by the mass of one atom times the
average of $\varpi^2$ (the sum of section
[4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust)). With assumed inputs,
rubidium-87 atoms of $1.44 \times 10^{-25}\unit{kg}$, $\varpi$ of $5\unit{\mu m}$ in root mean square and $\hbar$ per
atom give

$$\omega_+ - \omega_- = \frac{2 \times 1.055 \times 10^{-34}}{1.44 \times 10^{-25} \times 2.5 \times 10^{-11}}\unit{s^{-1}} = 58\unit{s^{-1}} ,$$

about 9 Hz. The ellipse's axes then turn at $15\unit{rad\,s^{-1}}$, $0.84°$ in a millisecond, so a few milliseconds of
ringing show the vortex's sense and its quantum of angular momentum.

::: try {#tides-in-turn}
Predict first: halve the wait $\tau$ between the kick and the reading. By what factor does the gap between the two
orders shrink? The figure draws a ball of 400 particles in the chosen flow and, below it, the two readings
$\delta Q/\epsilon$ against $\tau$, one for each order, with half their sum and half their difference in a second
plot. Beside them it reads out the bracket $\{\matter{\dot Q_h}, \matter{\dot Q_g}\}$ and the measured difference
over $\tau^2$. Start with "Turning rigidly" and "Quadrupolar", press "Both", and move "The wait, τ". Then choose
"The hidden swirl", find a pair whose two readings part at "no angular momentum", and move "Radius of the inner ball"
to "octupolar zero". Last, choose "Rolls" and try each pair in turn.
:::

**The idea to keep: a bracket is a response. Kick with one profile and read another, then exchange them, and the part
that changes sign, at the second power of the time, is the bracket of two rates, an integral of the flow that
Calderón's pair turns into its Fourier transform; quadrupolar tides see only the angular momentum, octupolar
ones the hidden swirl, and a quadrupole with an octupole the rolls.**

::: problems
### Practice

**[13.4]** At what power of the time does the order of two short tides first change a reading, and why not at the
first?

::: solution
At the second. The change at the first power, $\epsilon\tau\int\matter\rho\,\nabla g\cdot\nabla h\,\dd V$, is the same
whichever profile kicked.
:::

**[13.4]** What does the field outside a round body turning rigidly at a known rate hold beyond its angular momentum?

::: solution
Nothing: every term of the box vanishes except the one with $\ell = 1$.
:::

**[13.4]** For a uniform ball with the Earth's mass, radius and rate ($5.97 \times 10^{24}\unit{kg}$, $6371\unit{km}$,
$7.29 \times 10^{-5}\unit{s^{-1}}$), find the brackets of the pairs $h + ig = \tfrac12(x + iy)^2$ and
$\tfrac13(x + iy)^3$ about its axis, and compare the first with the real Earth's, which is not uniform.

::: solution
$-2 \times \tfrac25\matter M\Omega R^2 = -1.41 \times 10^{34}\unit{kg\,m^2\,s^{-1}}$, of which the real Earth's
$-1.17 \times 10^{34}$ is $0.3307/0.4$; and
$-\tfrac{32}{35}\matter M\Omega R^4 = -6.6 \times 10^{47}\unit{kg\,m^4\,s^{-1}}$.
:::

**[13.4]** A cloud turns rigidly at $\Omega$. By how much are its two quadrupole modes split, and how fast do the axes
of a kicked ellipse turn? Which mode rings higher?

::: solution
$L_z = \Omega\int\matter\rho\,\varpi^2\,\dd V$, so $\omega_+ - \omega_- = 2\Omega$, and the axes turn at a quarter of
that, $\Omega/2$, in the sense of the turning. The mode whose ellipse turns with the gas rings higher.
:::

### Stretch

**[13.4]** With the average $\langle\sin^{2k}\theta\rangle = \tfrac12\int_0^\pi\sin^{2k+1}\theta\,\dd\theta$ of section
1.8, find the bracket of the pair $h + ig = (x + iy)^n/n$ for a uniform ball turning rigidly, as a multiple of
$\matter M\Omega R^{2n-2}$, and show that the equal values at $n = 3$ and $4$ do not continue to $n = 5$.

::: solution
The bracket is $-2(n - 1)\,\langle\sin^{2n-2}\theta\rangle\,\Omega\int\matter\rho\,r^{2n-2}\,\dd V$, with
$\int\matter\rho\,r^k\,\dd V = 3\matter MR^k/(k + 3)$ for a uniform ball and
$\langle\sin^{2k}\theta\rangle = \tfrac23, \tfrac{8}{15}, \tfrac{16}{35}, \tfrac{128}{315}$ for $k = 1$ to 4. The
multiples are $-\tfrac45$, $-\tfrac{32}{35}$, $-\tfrac{32}{35}$ and
$-8 \times \tfrac{128}{315} \times \tfrac{3}{11} = -0.887$.
:::

**[13.4]** A rubidium-87 cloud with one vortex has $\varpi$ of $3\unit{\mu m}$ in root mean square. Find the splitting of
its quadrupole modes in hertz and the angle by which a kicked ellipse's axes turn in 10 ms. By how much do
$\delta_h\matter{Q_g}$ and $\delta_g\matter{Q_h}$ differ at $\tau = 1\unit{ms}$, as a fraction of $\epsilon S\tau$?

::: solution
$2\hbar/m_1\langle\varpi^2\rangle = 2.11 \times 10^{-34}/(1.44 \times 10^{-25} \times 9 \times 10^{-12}) =
163\unit{s^{-1}}$, or 26 Hz. The axes turn at $41\unit{rad\,s^{-1}}$, so by 0.41 rad, or $23°$, in 10 ms. The two
readings are $\pm\tfrac12\epsilon S(\omega_+ - \omega_-)\tau^2$, so they differ by
$(\omega_+ - \omega_-)\tau = 0.16$ of $\epsilon S\tau$.
:::

### The camera

**[13.4]** Show that for the pair of profiles $x^2 - y^2$ and $2xy$ the bracket is $-8L_z$, that the bracket of the pair
$h + ig = \tfrac13(x + iy)^3$ changes sign with the sense of the turning, and that it tells apart a uniform ball and a
thin shell of the same mass, radius and angular momentum, which the magnetic part outside cannot.

::: solution
Each profile is twice the example's, so the bracket is four times $-2L_z$. The bracket is linear in $\matter{\vect J}$.
With equal $\vect L$ the shell turns at $\tfrac35$ of the ball's rate $\Omega$. The ball gives
$-\tfrac{32}{35}\matter M\Omega R^4 = -0.914\,\matter M\Omega R^4$; the shell, with
$\int\matter\rho\,\varpi^4\,\dd V = \tfrac{8}{15}\matter MR^4$, gives
$-4 \times \tfrac{8}{15} \times \tfrac35\,\matter M\Omega R^4 = -1.28\,\matter M\Omega R^4$.
:::
:::

::: paper
- [*The flow*](/paper/#par:the-flow) (Section XIII): the equations [](/paper/#eq:flow-bracket) and
  [](/paper/#eq:hidden-spin), the pair $h_\pm$, the silent flows, Figure [](/paper/#fig:hidden-flow) and the trapped gas.
- [*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy).
- [*What breaks the tie*](/paper/#par:what-breaks-the-tie) (Section IV): a body turning at a known rate.
- Tables [](/paper/#tab:null) and [](/paper/#tab:hair): the rows of two tides in either order.
:::

::: deeper
- F. Zambelli and S. Stringari (1998) [@ZambelliStringari1998]: the trapped gas's splitting.
- The GR course's [section 6.6](https://neovand.github.io/general-relativity/chapter-6.html#6-6-when-the-order-of-two-flows-matters):
  two motions that part by the square of the step.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equations
    [](/paper/#eq:flow-bracket) and [](/paper/#eq:hidden-spin), with Tables [](/paper/#tab:null) and [](/paper/#tab:hair).

[^units]: Since $\epsilon\nabla g$ is a velocity, with $[h]$ the unit of $h$ the first term is in
    $\mathrm s\cdot\mathrm{kg}\cdot(\mathrm{m\,s^{-1}}/\epsilon)\cdot[h]/\mathrm m$ and the second in
    $\mathrm s^2\cdot\mathrm{kg\,m\,s^{-1}}\cdot[h]/\mathrm m^2\cdot(\mathrm{m\,s^{-1}}/\epsilon)$: both are
    $\mathrm{kg}\,[h]/\epsilon$.

[^sim]: The profiles are $h = \tfrac12(x^2 - y^2) + xyz$ and $g = \tfrac13(x^3 - 3xy^2) + 0.4\,yz$. The parts have
    masses from 0.5 to 2, random places and momenta (spreads 0.5 and 1), a spring of stiffness 0.7 between every two,
    and a trap force $-0.3\,\matter m_a\vect x_a$, in units near one; $\epsilon = 10^{-6}$.

[^J]: The $\vect J$ of section 1.7 was an impulse; here it is the mass flux.

[^moment]: The moments' own brackets, at order $1/c^2$, are the subject of section
    [13.6](/tutorial/what-a-field-keeps/algebra-of-moments/#to-order-1c²-the-moments-of-the-energy-do-not-commute).

[^P]: Linear parts $\vect b_h\cdot\vect x$ and $\vect b_g\cdot\vect x$ add the total momentum's dot product with
    $(\nabla\nabla h)\vect b_g - (\nabla\nabla g)\vect b_h$, zero in the frame of the centre of mass.

[^onto]: Take $\vect\Omega$ along $z$. The Laplacian in the plane is $4\,\partial^2/\partial w\,\partial w^*$, so
    only the two harmonics of degree $\ell$ made from $w^\ell$ and $w^{*\ell}$ have $\partial_zg = 0$, and by counting
    dimensions $\partial_z$ sends the other $2\ell - 1$ onto all $2\ell - 1$ harmonics of degree $\ell - 1$.
