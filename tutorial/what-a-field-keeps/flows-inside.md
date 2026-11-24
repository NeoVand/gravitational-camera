---
id: '13.4'
title: 'Flows inside: brackets of moments'
question: 'A sphere whose inner ball and outer shell turn opposite ways has no angular momentum and no magnetic field outside, though all of it moves. What reading made from outside sees such a flow, and why does it take two tides applied in either order, and tides finer than the quadrupole?'
part: '13'
requires: ['1.1', '1.4', '1.5b', '1.6', '1.7', '1.8', '2.1', '2.3', '2.5', '2.6', '2.8', '4.3', '4.5', '7.5', '13.2', '13.3']
paper: [sec:second-order, eq:flow-bracket, eq:hidden-spin, fig:hidden-flow, eq:calderon, eq:sum-rule, tab:hair, tab:null, sec:near-field]
figures: [fig:hidden-flow]
live: [hidden-flow]
depth: A
---

**What you need:** chapters [1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside) (impulsive
tides and brackets), [2.8](/tutorial/outside/flows/#a-flow-of-mass-is-a-mass-flux-and-mass-is-conserved) (mass flux and
silent flows), [13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple)
(Calderón's pair),
[13.3](/tutorial/what-a-field-keeps/ladder/#polynomials-killed-by-repeated-laplacians-are-harmonic-ones-times-even-powers-of-the-radius)
(the split into $r^{2j}H_\ell$) and
[7.5](/tutorial/geometry/gravitomagnetism/#a-body-turning-at-a-known-rate-shows-one-hidden-integral-for-each-harmonic-function)
(the magnetic moments), with 1.1 (cross products), 1.4 (the Hessian), 1.5b (complex arrows), 1.6 (angular momentum),
1.8 (averages over directions), 2.1 (harmonic functions), 2.3 (the quadrupole), 2.5 (the electric part), 2.6 (Fourier
transforms), 4.3 (normal modes) and 4.5 (responses).

Chapter 2.8 built a sphere that hides its motion. Its inner ball, out to 0.871 of the radius, turns one way, and the
rest turns the other way at the same rate, so that the sphere has no angular momentum and no magnetic part of the field
outside, "though all of it moves". Panel (a) of the paper's Figure [](/paper/#fig:hidden-flow) draws it.

{{paper fig:hidden-flow}}

No reading at one time tells this sphere from the same sphere at rest. Chapter 2.8's table of what such readings cannot
see gives the remedy: "two tides in either order". The paper's [*The flow*](/paper/#par:the-flow) explains: "The same
measurements, carried one order further in the time between the tide and the reading, give the motion inside the
body." So we ask: what reading made from outside sees such a flow, and why does it take two tides applied in either
order, and tides finer than the quadrupole?

::: plain
A brief tide gives every part of a body a kick, and the kick has a shape across the body. A moment later a camera
takes a reading: the body's mass added up with a second shape as the weights. Then the two shapes swap roles.

At first the two readings change alike, because both changes depend only on where the mass is. Later they part, by
an amount that grows as the square of the waiting time and comes from the motion of the mass.

A flow is a sum of waves of many wavelengths and directions. The right pairs of shapes, with the way the density
changes, give every one of them, even when the field outside is that of a body at rest. Distant masses make the
simplest tides, which see only the body's total spin. The sphere in the picture has none, so it takes the finer tides
of a nearer mass to see it turn.
:::

## The order of two short tides matters first at the second power of the time

We want what a reading made a short time after a tide holds, and which part of it depends on the order. We assume
that **the forces inside do not depend on the velocities of the parts**, that **the tide acts for an instant**
(chapter 1.7), and that **the tide is weak**, so that we keep only the first power of its strength. Readings from
outside need harmonic profiles (chapter 13.2); the derivation does not.

A body has parts $a$ with masses $\matter m_a$ in kilograms, places $\vect x_a$ in metres and momenta $\vect p_a$ in
$\mathrm{kg\,m\,s^{-1}}$. At $t = 0$ chapter 1.7's impulsive tide of profile $g$ and strength
$\sym{impulse-strength}{\epsilon}$ changes every momentum and no place:

$$\vect p_a \to \vect p_a + \epsilon\,\matter m_a\nabla g(\vect x_a) .$$

A short time $\tau$ later, in seconds,[^tau] we read the moment
$\sym{mass-moment}{\matter{Q_h}} = \sum_a\matter m_ah(\vect x_a)$ of a second profile $h$. We write
$\delta_g\matter{Q_h}$ for its change caused by the tide $g$, against the same body left alone. Taylor's theorem gives

$$\matter{Q_h}(\tau) = \matter{Q_h} + \tau\,\matter{\dot Q_h} + \tfrac12\tau^2\,\matter{\ddot Q_h} + O(\tau^3) ,$$

with every term taken immediately after the tide. The series is in powers of $\tau$ times the body's own
rates, such as $\Omega\tau$ for a body turning at the rate $\Omega$, and it fails when $\tau$ approaches a period of
the motion. The first term does not change, because the places do not. The rate
$\matter{\dot Q_h} = \sum_a\vect p_a\cdot\nabla h(\vect x_a)$ changes by
$\epsilon\int\sym{density}{\matter\rho}\,\nabla g\cdot\nabla h\,\dd V$, chapter 1.7's bracket of two moments. With
Newton's $\dot{\vect p}_a = \vect F_a$, where $\vect F_a$ is the force on the part $a$ from the rest of the body, and
$\dot{\vect x}_a = \vect p_a/\matter m_a$, the product rule gives

$$\matter{\ddot Q_h} = \sum_a\vect F_a\cdot\nabla h + \sum_a\vect p_a\cdot(\nabla\nabla h)\,\frac{\vect p_a}{\matter m_a} ,$$

where $\nabla\nabla h$ is the Hessian of $h$ at $\vect x_a$ (chapter
[1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives)). The forces depend on the
places alone, so the first sum does not change. In the second, the kicked momenta give two equal cross terms,
$2\epsilon\sum_a\vect p_a\cdot(\nabla\nabla h)\nabla g$, and a term in $\epsilon^2$, which the third assumption drops.
Half of the cross terms, times $\tau^2$, is the next term of the change:

$$\boxed{\;\frac{\delta_g\matter{Q_h}}{\epsilon} = \tau\int\matter\rho\,\nabla g\cdot\nabla h\,\dd V + \tau^2\sum_a\vect p_a\cdot(\nabla\nabla h)\,\nabla g + O(\tau^3) .\;}$$

Both terms have the unit of the left side.[^units]

Now we exchange the roles: apply the tide $h$ and read $\matter{Q_g}$, which changes only the second term. A
**response** is the change of a reading per unit of the push that caused it, as in
chapter 4.5, here to a push that lasts an instant. Half the sum of the two responses is
their **symmetric part**, which stays the same when the profile applied and the moment read are exchanged; half their
difference is their **antisymmetric part**, which changes sign. Chapter 1.7's stretch problem found that
$\sum_a\vect p_a\cdot[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h]$ is the Poisson bracket of the two rates
$\matter{\dot Q_h}$ and $\matter{\dot Q_g}$. We call it the **bracket of two rates**,
$\sym{bracket-of-rates}{\{\matter{\dot Q_h}, \matter{\dot Q_g}\}}$. So

$$\boxed{\;\frac{\delta_g\matter{Q_h} - \delta_h\matter{Q_g}}{\epsilon} = \tau^2\,\{\matter{\dot Q_h}, \matter{\dot Q_g}\} + O(\tau^3) ,\;}$$

the paper's "the change of $Q_h$ per unit of a weak impulse of profile $g$, less the change of $Q_g$ per unit of one of
profile $h$, is $\tau^2\{\dot Q_h, \dot Q_g\}$". Chapter 2.8 read instead how fast the moment changes; differentiated
once, the series makes the two orders of that reading differ by $2\tau\{\matter{\dot Q_h}, \matter{\dot Q_g}\}$.

In the symmetric part the terms in $\tau^2$ add up, and by the product rule

$$\frac{\dd}{\dd t}\sum_a\matter m_a\nabla h\cdot\nabla g = \sum_a\vect p_a\cdot\bigl[(\nabla\nabla h)\nabla g + (\nabla\nabla g)\nabla h\bigr] ,$$

so the symmetric part is $\tau$ times $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ taken halfway through the wait.

**A number.** For twelve parts on springs in a trap, the difference over $\tau^2$ is 5.043 at $\tau = 0.02$ and 5.268
at $\tau = 0.004$, against the bracket's 5.323.[^sim] The gap shrinks in proportion to $\tau$, as $O(\tau^3)$ says.

**A picture.** For $h = \tfrac12(x^2 - y^2)$ and $g = xy$ the gradients, $(x, -y, 0)$ and $(y, x, 0)$, are at right
angles everywhere, so the first term vanishes, and $(\nabla\nabla h)\nabla g = (y, -x, 0)$. With
$L_z = \sum_a(x_ap_{a,y} - y_ap_{a,x})$ the angular momentum about the $z$ axis (chapter 1.6), a kick with $g$ changes
the reading of $h$ by $-\epsilon\tau^2L_z$, and the other order gives $+\epsilon\tau^2L_z$. The kick
$g$ stretches the body along the diagonal $x = y$, which leaves $\matter{Q_h}$, a comparison of its extents along $x$
and $y$, unchanged. A body turning anticlockwise carries the stretch round towards the $y$ axis, and $\matter{Q_h}$
falls. Turning rigidly at $\Omega$, it has $L_z = \Omega\int\matter\rho\,\varpi^2\,\dd V$, with $\varpi$ the
distance from the axis, and $\varpi^2 = |\nabla h|^2$. So the turning's change is $\Omega\tau$ times the first-order
change $\epsilon\tau\int\matter\rho\,|\nabla h|^2\,\dd V$ that a kick with $h$ makes in its own reading: 0.0044
times for the Earth, read a minute after the tide.

**What it means.** The symmetric part appears at the first power of $\tau$ and weighs the density (chapter 13.2). The
antisymmetric part appears first at the second power and weighs the momenta: the flow.

<!-- diagram: tut-tides-in-turn — spec: two timelines stacked on the left, each a short horizontal arrow of time from
t = 0 to τ: above, a kick icon labelled "kick g" at t = 0 and an eye icon "read h" at τ; below, "kick h" and "read g".
On the right, one plot: horizontal τ from 0 to 0.02 (the twelve-particle model's units), vertical the response δQ/ε.
Two exact curves from the boxed series for that model (S = −5.80, Ṡ/2 = 0.80, bracket 5.32): the response "kick g, read
h" = τS + τ²(Ṡ/2 + 5.32/2) and "kick h, read g" = τS + τ²(Ṡ/2 − 5.32/2), thin single strokes, orange and blue; their
half sum as a dashed neutral line (nearly straight: the density); the gap between the two curves shaded faint, with
"τ² { Q̇_h, Q̇_g }" labelled beside the shading, off the curves. Caption: "Look first at the shaded gap: the two orders
start along the same straight line, which weighs the density, and part as the square of the time, by the bracket of
the two rates, which weighs the flow. The curves are the series of the text for the twelve parts of the margin note,
without its higher terms." -->

## The bracket of two rates is an integral of the flow

Spread over the body, the momentum per unit volume is chapter 2.8's **mass flux**
$\sym{mass-flux}{\matter{\vect J}} = \matter\rho\,\vect v$, in $\mathrm{kg\,m^{-2}\,s^{-1}}$, which the paper calls the
density of momentum.[^J] The bracket of two rates, the Poisson bracket of the rates of change of two moments,[^moment]
becomes the paper's

{{paper eq:flow-bracket}}

**Units.** A profile may carry a unit. For quadratic profiles, in square metres, the Hessians are pure numbers and each
gradient is in metres, so the bracket is in $\mathrm{kg\,m^2\,s^{-1}}$, the unit of an angular momentum. Each degree
added to either profile adds a metre.

**Checks.** The bracket is antisymmetric in $h$ and $g$, so it is zero for $h = g$. It is zero when both profiles are
linear, because both Hessians vanish. It is linear in $\matter{\vect J}$, so it
changes sign when every velocity is reversed, and it vanishes for a body at rest, whatever its density.

## Calderón's pair reads the flow's Fourier transform

We want the bracket for chapter 13.2's pair of harmonic exponentials. Here $\vect\xi$ is a real wavevector in
$\mathrm{m^{-1}}$, $\vect\eta$ a real vector at right angles to it and as long, and

$$\sym{calderon-vectors}{\vect\zeta_\pm} = \tfrac12\,(i\vect\xi \pm \vect\eta), \qquad h_\pm = e^{\vect\zeta_\pm\cdot\vect x} ,$$

both harmonic because $\vect\zeta_\pm\cdot\vect\zeta_\pm = 0$.[^letters] Each derivative of $h_\pm$ brings down a
component of $\vect\zeta_\pm$, so the gradient is $\vect\zeta_\pm h_\pm$, and the Hessian is the table with the entries
$\zeta_{\pm i}\zeta_{\pm j}h_\pm$. A table with the entries $\zeta_i\zeta_j$ sends a vector $\vect b$ to
$\vect\zeta\,(\vect\zeta\cdot\vect b)$, so

$$(\nabla\nabla h_+)\,\nabla h_- = \vect\zeta_+\,(\vect\zeta_+\cdot\vect\zeta_-)\,h_+h_- ,$$

and the same holds with $+$ and $-$ exchanged. We subtract, and use 13.2's
$\vect\zeta_+\cdot\vect\zeta_- = -\tfrac12|\vect\xi|^2$ and $h_+h_- = e^{i\vect\xi\cdot\vect x}$, with
$\vect\zeta_+ - \vect\zeta_- = \vect\eta$:

$$\begin{aligned}
(\nabla\nabla h_+)\,\nabla h_- - (\nabla\nabla h_-)\,\nabla h_+ &= (\vect\zeta_+\cdot\vect\zeta_-)(\vect\zeta_+ - \vect\zeta_-)\,e^{i\vect\xi\cdot\vect x}\\
&= -\tfrac12|\vect\xi|^2\,\vect\eta\,e^{i\vect\xi\cdot\vect x} .
\end{aligned}$$

We take the dot product with $\matter{\vect J}$ and integrate over the body:

$$\boxed{\;\{\matter{\dot Q_{h_+}}, \matter{\dot Q_{h_-}}\} = -\tfrac12|\vect\xi|^2\,\vect\eta\cdot\sym{flow-transform}{\matter{\tilde{\vect J}}}(\vect\xi), \qquad \matter{\tilde{\vect J}}(\vect\xi) = \int\matter{\vect J}\,e^{i\vect\xi\cdot\vect x}\,\dd V ,\;}$$

the paper's result. Here $\matter{\tilde{\vect J}}$ is the **Fourier transform of the flow**, each component
transformed with the paper's plus sign (chapter 2.6), in $\mathrm{kg\,m\,s^{-1}}$, the unit of a momentum. The
profiles $h_\pm$ are pure numbers, so both sides are in $\mathrm{kg\,m^{-2}\,s^{-1}}$. A tide is real, but the bracket
is linear in each profile, so 13.2's real and imaginary parts, $h_\pm = u_\pm + iv_\pm$, split it into four brackets
of real tides.

**Turning $\vect\eta$.** The bracket gives the component of $\matter{\tilde{\vect J}}$ along $\vect\eta$, and
$\vect\eta$ may be any vector at right angles to $\vect\xi$ and as long. Turning it a right angle about $\vect\xi$
gives a second component, and the two make the **transverse part** of the transform, its part at right angles to
$\vect\xi$.

**The third component.** The part along $\vect\xi$, the **longitudinal part**, comes from chapter 2.8's continuity
equation, $\partial\matter\rho/\partial t + \nabla\cdot\matter{\vect J} = 0$. We multiply it by
$e^{i\vect\xi\cdot\vect x}$ and integrate. Chapter 2.8's integration by parts moves the divergence onto the
exponential, whose gradient is $i\vect\xi\,e^{i\vect\xi\cdot\vect x}$, with a change of sign:

$$\frac{\dd\matter{\tilde\rho}}{\dd t} = i\vect\xi\cdot\matter{\tilde{\vect J}}(\vect\xi), \qquad \matter{\tilde\rho}(\vect\xi) = \int\matter\rho\,e^{i\vect\xi\cdot\vect x}\,\dd V .$$

Chapter 13.2 reads $\matter{\tilde\rho}$ from the symmetric part, and two such readings a moment apart give its rate.

**A check.** A round body turning steadily keeps its density, so $\vect\xi\cdot\matter{\tilde{\vect J}} = 0$, and the
bracket reads all its flow.

**What it means.** With the transform known at every wavevector, chapter
[2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time)'s inverse
transform, whose sign is opposite to the forward one's,
$\matter{\vect J}(\vect x) = \int\matter{\tilde{\vect J}}(\vect\xi)\,e^{-i\vect\xi\cdot\vect x}\,\dd^3\xi/(2\pi)^3$,
gives $\matter{\vect J}$ itself. In the paper's words, "The flows that have no magnetic field outside … are therefore
read from outside as the density is."

<!-- diagram: tut-flow-transverse — spec: one wavevector ξ drawn as a long arrow from a point, upward and to the right;
the plane at right angles to ξ drawn as a faint parallelogram through the same point. In that plane, η in two positions
at a right angle to each other (η and ξ̂ × η), of the same length as ξ, solid and pale. A flow's transform J̃ drawn from
the same point (a neutral arrow, not in any plane), with its two projections: onto the plane (the transverse part, a
dashed arrow, labelled "read by the bracket of h₊ and h₋") and onto ξ (the longitudinal part, a dashed arrow along ξ,
labelled "read by dρ̃/dt"), with thin dotted drop lines. Labels never on the arrows. Caption: "Look first at the two
dashed arrows: the bracket of Calderón's pair reads the part of the flow's transform at right angles to ξ, one
component for each position of η, and the rate of change of the density reads the part along ξ. The lengths are
chosen for the drawing." -->

## Every silent flow is read by Calderón's pair

Chapter 2.8 set up two scenes that no reading at one time tells apart: a uniform ball at rest, and the same ball with
rolls inside it, $\matter{\vect J} = \nabla\times\nabla\times\vect V$, with $\vect V$ and its first derivatives zero
outside.

We transform the rolls. Because $\vect V$ is confined, integration by parts moves each derivative $\partial_j$ onto
$e^{i\vect\xi\cdot\vect x}$, where it becomes $-i\xi_j$. The curl of a curl becomes two cross products with
$-i\vect\xi$, and chapter 1.1's rule for a double cross product gives

$$\matter{\tilde{\vect J}} = (-i)^2\,\vect\xi\times(\vect\xi\times\tilde{\vect V}) = |\vect\xi|^2\,\tilde{\vect V}_\perp ,$$

with $\tilde{\vect V}_\perp$ the part of $\tilde{\vect V}$ at right angles to $\vect\xi$. The longitudinal part is
zero, so the density never changes, as 2.8 found. The transverse part is read, as
$-\tfrac12|\vect\xi|^4\,\vect\eta\cdot\tilde{\vect V}$, while the resting ball gives zero. Rolls that gave zero for
every $\vect\xi$ and $\vect\eta$ would have no transform, and so no flow: Calderón's pair sees every roll. The swirls
whose moments of the flow (2.8) all vanish, such as the hidden swirl, are read in the same way: their transform is
transverse and not zero.

**Which polynomial tides read the rolls.** Take the rolls of 2.8's stretch problem,
$\vect V = K(1 - r^2/R^2)^2\,\hat z$ inside a ball of radius $R$, with $K$ in $\mathrm{kg\,s^{-1}}$. Their flow is
unchanged by the reflection $\vect x \to -\vect x$ through the centre. For homogeneous tides of degrees $m$ and $n$ the
bracket's vector is homogeneous of degree $m + n - 3$, so it changes sign under the reflection when $m + n$ is even,
and its integral against the rolls vanishes. So every pair of equal degree, about any axis, misses these rolls.

A quadrupole with an octupole reads them. For $h = z^2 - \tfrac12(x^2 + y^2)$ and $g = z^3 - \tfrac32z(x^2 + y^2)$,
integration by parts moves both curls from $\vect V$ onto the vector, whose curl of a curl is $36\,\hat z$, so

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = 36\int V_z\,\dd V = \tfrac{384\pi}{35}KR^3 ,$$

in $\mathrm{kg\,m^3\,s^{-1}}$: the integral that sets the rolls' potential outside in chapter 2.8.

The last column of chapter 2.8's table of the two null spaces can now name its integrals ($\field\psi$ is 2.5's
confined function):

| Channel | What it cannot see | What reveals it |
|---|---|---|
| Electric part, $\curv{\tE}$ | $\nabla^2\field\psi/4\pi G$: a nugget against its flush | the symmetric part, $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ (13.2) |
| Magnetic part, $\curv{\tB}$ | rolls $\nabla\times\nabla\times\vect V$; swirls whose moments all vanish | the antisymmetric part, $\{\matter{\dot Q_h}, \matter{\dot Q_g}\}$ (here) |

The paper's Table [](/paper/#tab:hair) says the same in its row "Two tides, in either order": for a stone
"$\{\dot Q_h, \dot Q_g\}$: the flow", and for a black hole "nothing more" than the seven numbers of its mass, place and
spin.

## Two quadrupolar tides read only the angular momentum

We want the bracket for the tides that distant masses make. We assume that **$h$ and $g$ are homogeneous
quadratics**.[^P] Each Hessian is then a constant symmetric table, and each gradient is that table acting on the
place, $\nabla h = (\nabla\nabla h)\,\vect x$. So the vector inside the bracket is

$$(\nabla\nabla h)(\nabla\nabla g)\,\vect x - (\nabla\nabla g)(\nabla\nabla h)\,\vect x = [\nabla\nabla h, \nabla\nabla g]\,\vect x ,$$

where the **commutator** of two tables $A$ and $B$, $[A, B] = AB - BA$, is the amount by which their two products
differ. Transposing a product reverses its order, and both tables are symmetric, so the transpose of $AB$ is $BA$: the
commutator of two symmetric tables is antisymmetric. By chapter
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise) it is a vector in disguise,
$[\nabla\nabla h, \nabla\nabla g]_{ij} = \epsilon_{ijk}c_k$, which acts on $\vect x$ as $\vect x\times\vect c$.[^c]

A cyclic move of the triple product turns the integrand $\matter{\vect J}\cdot(\vect x\times\vect c)$ into
$\vect c\cdot(\matter{\vect J}\times\vect x)$, and swapping the two factors gives
$-\vect c\cdot(\vect x\times\matter{\vect J})$. The integral of $\vect x\times\matter{\vect J}$ is the angular
momentum $\sym{angular-momentum}{\vect L}$ (chapter 2.8). So

$$\boxed{\;\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -\vect c\cdot\vect L .\;}$$

**An example.** For the first section's pair, $h + ig = \tfrac12(x + iy)^2$, the Hessian of $h$ has the diagonal
$(1, -1, 0)$, and that of $g$ has 1 in the places $xy$ and $yx$. Their product in one order has $1$ in the place $xy$
and $-1$ in $yx$, and in the other order the reverse. So the commutator has $2$ in the place $xy$ and $-2$ in $yx$,
$\vect c = (0, 0, 2)$, and, as the first section found,

$$\boxed{\;\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -2L_z .\;}$$

**A number.** The Earth, of mass $\sym{mass}{\matter M}$ and radius $R$, turning at
$\sym{angular-velocity}{\vect\Omega}$, has 1.6's
$\vect L = 0.3307\,\matter MR^2\vect\Omega = 5.85 \times 10^{33}\unit{kg\,m^2\,s^{-1}}$. For this pair about its axis
the bracket is $-1.17 \times 10^{34}\unit{kg\,m^2\,s^{-1}}$, and a kick with $g$ read a minute later changes
$\matter{Q_h}$ by $-\epsilon \times 2.1 \times 10^{37}\unit{kg\,m^2\,s}$. For the hidden swirl it is zero.

**What it means.** Two quadrupolar tides see the flow only through $\vect L$, the spin dipole of the magnetic part
outside (2.8), and miss the hidden swirl and the rolls.

## Octupolar tides read the hidden swirl

We want the bracket for finer tides on a body whose layers turn about one axis. We assume that **the density depends
only on the distance $r$ from the centre**, and that **each spherical layer turns rigidly about the $z$ axis at its own
rate $\sym{layer-rate}{\Omega(r)}$**, in $\mathrm{s^{-1}}$, so that
$\matter{\vect J} = \matter\rho\,\Omega(r)\,(-y, x, 0)$.

For the profiles we take chapter 2.1's harmonic functions in the plane, $h + ig = f(w)$, with $f$ a polynomial in the
complex place $\sym{complex-place}{w} = x + iy$ of the body's equatorial plane, and $f'$ its derivative with respect to
$w$. They do not depend on $z$, and 2.1's box shows that they are harmonic and that
$f' = \partial_xh + i\,\partial_xg$. The Cauchy–Riemann equations turn $\partial_xg$ into $-\partial_yh$, so

$$\nabla h = (\mathrm{Re}\,f', -\mathrm{Im}\,f', 0), \qquad \nabla g = (\mathrm{Im}\,f', \mathrm{Re}\,f', 0) ,$$

and the Hessians come in the same way from $f''$. The box below multiplies them out, and the integrand collapses to

$$\matter{\vect J}\cdot\bigl[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h\bigr] = -2\matter\rho\,\Omega(r)\,\mathrm{Re}\bigl[w\,f''(w)\,f'(w)^*\bigr] ,$$

with $^*$ the complex conjugate. For the pair $f = w^n/n$, of degree $n$, $f' = w^{n-1}$ and $f'' = (n - 1)\,w^{n-2}$,
so $wf''f'^* = (n - 1)\,\varpi^{2n-2}$, with $\varpi = |w|$, and

$$\boxed{\;\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -2(n - 1)\int\matter\rho\,\Omega(r)\,\varpi^{2n-2}\,\dd V .\;}$$

::: derivation
### The integrand as complex numbers

Chapter 1.5b writes an arrow $(u_1, u_2)$ as the complex number $u_1 + iu_2$. The dot product of two arrows $a$ and $b$
is then $\mathrm{Re}(ab^*)$, and turning an arrow a right angle anticlockwise multiplies it by $i$. Let
$f' = \alpha + i\beta$ and $f'' = \gamma + i\kappa$. The gradients are $(\alpha, -\beta)$, which is $f'^*$, and
$(\beta, \alpha)$, which is $if'^*$. By 2.1's box applied to $f'$, $\partial_xf' = f''$ and $\partial_yf' = if''$, so
the Hessian of $h$ sends $(u_1, u_2)$ to $(\gamma u_1 - \kappa u_2, -\kappa u_1 - \gamma u_2)$, which is $(f''u)^*$,
and that of $g$ sends it to $(\kappa u_1 + \gamma u_2, \gamma u_1 - \kappa u_2)$, which is $i(f''u)^*$. So

$$(\nabla\nabla h)\nabla g \;\to\; (f''\,if'^*)^* = -if''^*f', \qquad (\nabla\nabla g)\nabla h \;\to\; i\,(f''f'^*)^* = if''^*f' ,$$

whose difference is $-2if''^*f'$. The flow $(-y, x)$ is $w$ turned a right angle, $iw$, times $\matter\rho\,\Omega$, so
the dot product is

$$\mathrm{Re}\bigl[\matter\rho\,\Omega\,iw\,(-2if''^*f')^*\bigr] = \mathrm{Re}\bigl[\matter\rho\,\Omega\,iw\cdot 2if''f'^*\bigr] = -2\matter\rho\,\Omega\,\mathrm{Re}\bigl[wf''f'^*\bigr] .$$
:::

**Checks.** For $n = 2$ the bracket is $-2L_z$, as in the last section. For $n = 3$ the
integrand is $-4\matter\rho\,\Omega\,\varpi^4$, as chapter 2.8's paper problem found term by term. For a uniform ball
turning rigidly, $\varpi = r\sin\theta$ with $\theta$ the angle from the axis, and chapter 1.8's average over
directions, $\langle\sin^4\theta\rangle = \tfrac{8}{15}$, with $\int\matter\rho\,r^4\,\dd V = \tfrac37\matter MR^4$,
gives at $n = 3$

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -4\Omega\cdot\tfrac{8}{15}\cdot\tfrac37\,\matter MR^4 = -\tfrac{32}{35}\,\matter M\Omega R^4 .$$

**The share of each radius.** For a round body we average over directions one layer at a time. The layer between $r$
and $r + \dd r$ has the volume $4\pi r^2\,\dd r$, and in it $\varpi^{2n-2}$ averages to
$\langle\sin^{2n-2}\theta\rangle\,r^{2n-2}$. So the layer's **share** of the bracket goes as
$\matter\rho\,\Omega(r)\,r^{2n}\,\dd r$, as the figure's panel (b) draws it: a finer tide gives the outer layers more
weight.

**The hidden swirl.** Let a uniform sphere's inner ball, out to the radius $a$, turn at $+\Omega$ and the rest at
$-\Omega$. The shares add up to $\int_0^ar^{2n}\,\dd r - \int_a^Rr^{2n}\,\dd r = (2a^{2n+1} - R^{2n+1})/(2n + 1)$, so
the bracket is the rigid ball's times $2a^{2n+1}/R^{2n+1} - 1$. For $n = 3$,

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = \tfrac{32}{35}\Bigl(1 - \frac{2a^7}{R^7}\Bigr)\matter M\Omega R^4 .$$

At chapter 2.8's $a = 2^{-1/5}R$, where $\vect L = 0$, the factor $2a^7/R^7$ is $2^{-2/5}$, and this is the paper's

{{paper eq:hidden-spin}}

in $\mathrm{kg\,m^4\,s^{-1}}$, with $\Omega$ the inner ball's rate: about a quarter of the rigid ball's size, with the
opposite sign. For $n = 2$ the factor is $2a^5/R^5 - 1$, zero at the same radius, so the two areas of panel (b) are
equal.

**The zero.** The octupolar bracket vanishes where $2a^7 = R^7$:

$$\boxed{\;a = 2^{-1/7}R = 0.906\,R ,\;}$$

outside 2.8's $0.871R$, which answers 2.8's try box. At degree three each radius counts as $r^6$, against $r^4$ in the
angular momentum, so the inner ball must grow to balance the outer layers: at $0.906R$ it holds 74 per cent of the
mass, against 66.

**A number.** The pair of degree four gives $\tfrac{32}{35}(1 - 2^{-4/5}) = 0.389\,\matter M\Omega R^6$ on the hidden
swirl, in $\mathrm{kg\,m^6\,s^{-1}}$. Its rigid value is again $-\tfrac{32}{35}\matter M\Omega R^6$, from
$\langle\sin^6\theta\rangle = \tfrac{16}{35}$ and a uniform ball's
$\int\matter\rho\,r^6\,\dd V = \tfrac13\matter MR^6$, by a coincidence of the degrees three and four.

<!-- diagram: tut-shares-by-degree — spec: three small plots stacked, for n = 2, 3 and 4, each with the radius r/R from
0 to 1 across and its own vertical scale (each drawn to its own greatest value, as fig:hidden-flow(b) does). In each,
the share of each radius for the hidden swirl at a = 2^{-1/5}R, with the inner ball turning at +Ω: −r^{2n} inside a
(orange area below the line) and +r^{2n} outside it (blue area above the line), exact, as the live figure hidden-flow
draws them. Under the common radius axis, three small ticks at the zeros of the sums, 2^{-1/5} = 0.871,
2^{-1/7} = 0.906 and 2^{-1/9} = 0.926, labelled "n = 2", "n = 3", "n = 4" below them; a thin vertical line at 0.871
through all three plots. Beside each plot its sum, 0, +0.221 and +0.389 (in M Ω R^{2n−2}), outside the areas. Caption:
"Look first at the blue areas: with each degree the outer layers count for more, so at degree two the areas balance
and at degrees three and four the outer part wins. The ticks under the axis mark where the inner ball would have to end
for each sum to vanish." -->

## At a known rate of turning, the field outside holds the first rung of the ladder

At a known rate of turning, the field outside reaches $\int\matter\rho\,r^2g'\,\dd V$ with $g'$ harmonic: the first
rung of 13.3's ladder, which a tide of degree two also reaches. Chapter 7.5 stated this; we derive it. We assume that
**the body turns rigidly**, $\vect v = \vect\Omega\times\vect x$, at a known $\vect\Omega$, and that **$g$ is a
homogeneous harmonic polynomial of degree $\ell$**.

Chapter 7.5's magnetic moment is $m[g] = \int(\vect x\times\matter\rho\vect v)\cdot\nabla g\,\dd V$. The rule for a
double cross product gives
$\vect x\times(\vect\Omega\times\vect x) = \vect\Omega\,r^2 - \vect x\,(\vect\Omega\cdot \vect x)$, and chapter 13.3's
Euler's relation, $\vect x\cdot\nabla g = \ell g$, then gives

$$m[g] = \int\matter\rho\,r^2\,\vect\Omega\cdot\nabla g\,\dd V - \ell\int\matter\rho\,(\vect\Omega\cdot\vect x)\,g\,\dd V .$$

The polynomial $(\vect\Omega\cdot\vect x)\,g$ has the degree $\ell + 1$. Both factors are harmonic, so chapter 2.1's
product rule leaves only the cross term: $\nabla^2[(\vect\Omega\cdot\vect x)g] = 2\,\vect\Omega\cdot\nabla g$. A
derivative of a harmonic function is harmonic, so a second Laplacian gives zero: the polynomial is biharmonic, and
13.3's split writes it as

$$(\vect\Omega\cdot\vect x)\,g = H_{\ell+1} + r^2H_{\ell-1} ,$$

with $\sym{harmonic-polynomial}{H_{\ell+1}}$ and $H_{\ell-1}$ harmonic polynomials of those degrees.[^H] We take the
Laplacian of both sides. The first term gives zero, and 13.3's formula
$\nabla^2(r^{2j}H_\ell) = 2j(2\ell + 2j + 1)\,r^{2j-2}H_\ell$, with $j = 1$ and $\ell - 1$ in place of $\ell$, gives
$2(2\ell + 1)H_{\ell-1}$. So

$$H_{\ell-1} = \frac{\vect\Omega\cdot\nabla g}{2\ell + 1} .$$

We put the split into $m[g]$ and collect the terms in $r^2\,\vect\Omega\cdot\nabla g$, with
$1 - \ell/(2\ell + 1) = (\ell + 1)/(2\ell + 1)$:

$$\boxed{\;m[g] = \frac{\ell + 1}{2\ell + 1}\int\matter\rho\,r^2\,(\vect\Omega\cdot\nabla g)\,\dd V - \ell\int\matter\rho\,H_{\ell+1}\,\dd V .\;}$$

This is 7.5's statement, with $g' = \vect\Omega\cdot\nabla g$. The last integral is a harmonic mass moment, which the
electric part outside fixes (chapter 2.5). With $g$ in $\mathrm m^\ell$, every term is in
$\mathrm{kg\,m^{\ell+1}\,s^{-1}}$. What carries the split is that
$H_{\ell+1} = (\vect\Omega\cdot\vect x)g - r^2\,\vect\Omega\cdot\nabla g/(2\ell + 1)$ has zero Laplacian, as the two
Laplacians above show.

**A check and a number.** For $\ell = 1$ and $g = x_k$, the moment is $L_k$ and
$H_2 = (\vect\Omega\cdot\vect x)\,x_k - \tfrac13r^2\Omega_k$, so the box gives
$L_k = \tfrac23\Omega_k\int\matter\rho\,r^2\,\dd V - \int\matter\rho\,H_2\,\dd V$, which is 7.5's check. For the
Earth, with $\vect\Omega$ along its axis and $k = z$, $H_2 = \tfrac13\Omega\,(3z^2 - r^2)$, and its integral is
$\tfrac13\Omega$ times chapter 2.3's $\matter Q_{zz} = -2J_2\matter MR^2$, with $J_2 = 1.08 \times 10^{-3}$. So the
electric part's term, $\tfrac23J_2\matter MR^2\Omega = 1.3 \times 10^{31}\unit{kg\,m^2\,s^{-1}}$, is 0.22 per cent
of $L$.

**What it means.** As $g$ runs over the harmonics of degree $\ell$, $g'$ runs over all those of degree
$\ell - 1$.[^onto] For a round body every such integral vanishes except for $g' = 1$, so only $\ell = 1$, the angular
momentum, survives, as 7.5 says.

## A vortex splits the quadrupole modes of a trapped gas

This result is stated without proof. A trapped cloud of cold atoms can hold a **vortex**, a line about which the gas
turns, each atom carrying the angular momentum $\hbar$, the reduced Planck constant, about it. Its **quadrupole modes**
are normal modes (chapter 4.3) in which its cross-section oscillates as an ellipse; without the vortex, the two whose
ellipses turn in opposite senses ring at one frequency. In the paper's words, the bracket divided by the sum rule of
its equation [](/paper/#eq:sum-rule), $\int\matter\rho\,|\nabla h|^2\,\dd V$, "is the splitting of the quadrupole modes
by a vortex" [@ZambelliStringari1998]. For the first section's pair, this angular frequency is twice the angular
momentum per atom divided by the mass of one atom times the average of $\varpi^2$ (chapter
[4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust)'s sum). It is plausible:
the turning gas carries each ellipse round, as in the first section's picture. With assumed inputs, rubidium-87 atoms
of $1.44 \times 10^{-25}\unit{kg}$, $\varpi$ of $5\unit{\mu m}$ in root mean square and $\hbar$ per atom give
$58\unit{s^{-1}}$, about 9 Hz.

<!-- try: tides-in-turn — new (P7a-DECISIONS item 9). Predict first: "A sphere's inner ball and outer shell turn
opposite ways with no angular momentum. Kick it with a quadrupolar tide and read the other quadrupolar moment, then do
it the other way round. Do the two readings differ? With octupolar tides?" (Answer, revealed after: not with
quadrupolar tides; yes with octupolar ones.)
Left panel: a body of 400 particles drawn in section through its equator, in the paper's stone palette, each particle
with a short velocity tick. Menu "The flow": "At rest"; "Turning rigidly"; "The hidden swirl" (with a slider "Radius of
the inner ball", 0.5 to 0.98 R, default 2^(−1/5) = 0.871 R, marked "no angular momentum" there and "octupolar zero" at
2^(−1/7) = 0.906 R); "Rolls" (2.8's stretch problem's flow, V = K(1 − r²/R²)² ẑ). Menu "The pair of tides":
"Quadrupolar" ((x + iy)²/2), "Octupolar" ((x + iy)³/3), "Degree four" ((x + iy)⁴/4), "Quadrupole with octupole"
(h = z² − (x² + y²)/2, g = z³ − (3/2) z (x² + y²)). Two buttons, "Kick g, read h" and "Kick h, read g", each running
the response; "Both" runs both.
Right panel: the responses δQ/ε against τ from 0 to 0.05 of the turning period (both orders, orange and blue), their
half sum (dashed neutral: straight, the density) and half difference (a parabola: the flow), from the particles
integrated with velocity Verlet over the short time (a worker). Readouts: the bracket {Q̇_h, Q̇_g}, exact, in units of
M Ω R^(2n−2) for the three pairs (x + iy)ⁿ/n on the turning flows (lib/hair/flow.ts, bracket), and in units of K R³ for
the rolls (36 ∫V_z dV for the mixed pair, zero for the others); and the measured difference of the two responses over
τ².
Checks: at rest the two curves coincide; turning rigidly, quadrupolar, the difference over τ² tends to −0.8 = −2 × 2/5;
the hidden swirl at 0.871 R gives coinciding quadrupolar curves and octupolar ones that part, with the readout 0.221;
at 0.906 R the octupolar curves coincide again; degree four at 0.871 R reads 0.389; the mixed pair gives coinciding
curves on every turning flow (the swirl is odd under x → −x, and the mixed pair's vector is even); rolls give coinciding
curves for all three pairs of equal degree (zero by parity) and parting curves for the mixed pair, with the readout
384π/35 = 34.5 in units of K R³.
Both themes; keyboard: Tab through menus, slider and buttons, arrow keys on the slider; phone: the two panels stacked.
Stand-in until it is built: the registered hidden-flow, below. -->

::: try {#hidden-flow}
Predict first: between which two radii of the inner ball do the sums of degree two and three have opposite signs,
and which is positive there? Each sum is the bracket $\{\matter{\dot Q_h}, \matter{\dot Q_g}\}$ of the two tides of
its degree, in units of $\matter M\Omega R^{2n-2}$, with the inner ball turning at $+\Omega$. The figure opens at
$0.871R$. Drag the slider "Radius of the inner ball", or use the arrow keys, and find the two radii. On the way, check
that the sum of degree two is always $-2$ times the angular momentum printed at the foot of the figure.
:::


::: check
### Q

At what power of the time does the order of two short tides first change a reading, and why not at the first?

### A

At the second. The change at the first power, $\epsilon\tau\int\matter\rho\,\nabla g\cdot\nabla h\,\dd V$, is the same
whichever profile kicked.

### Q

Where does the octupolar bracket of the hidden swirl vanish, and why outside $0.871R$?

### A

At $2^{-1/7}R = 0.906R$: at degree three each radius counts as $r^6$, so the outer layers weigh more.

### Q

What does the field outside a round body turning rigidly at a known rate hold beyond its angular momentum?

### A

Nothing: $\int\matter\rho\,r^2g'\,\dd V$ vanishes for every harmonic $g'$ of degree one or more, and so do the mass
moments $\int\matter\rho\,H_{\ell+1}\,\dd V$.
:::

**The idea to keep: a bracket is a response. Kick with one profile and read another, then exchange them, and the part
that changes sign, at the second power of the time, is the bracket of two rates, an integral of the flow that
Calderón's pair turns into its Fourier transform; quadrupolar tides see only the angular momentum, octupolar
ones the hidden swirl, and a quadrupole with an octupole the rolls.**

::: problems
### Practice

For a uniform ball with the Earth's mass, radius and rate ($5.97 \times 10^{24}\unit{kg}$, $6371\unit{km}$,
$7.29 \times 10^{-5}\unit{s^{-1}}$), find the brackets of the pairs $h + ig = \tfrac12(x + iy)^2$ and
$\tfrac13(x + iy)^3$ about its axis, and compare the first with the real Earth's, which is not uniform.

::: solution
$-2 \times \tfrac25\matter M\Omega R^2 = -1.41 \times 10^{34}\unit{kg\,m^2\,s^{-1}}$, of which the real Earth's
$-1.17 \times 10^{34}$ is $0.3307/0.4$; and
$-\tfrac{32}{35}\matter M\Omega R^4 = -6.6 \times 10^{47}\unit{kg\,m^4\,s^{-1}}$.
:::

### Stretch

With chapter 1.8's $\langle\sin^{2k}\theta\rangle = \tfrac12\int_0^\pi\sin^{2k+1}\theta\,\dd\theta$, find the
bracket of the pair $h + ig = (x + iy)^n/n$ for a uniform ball turning rigidly, as a multiple of
$\matter M\Omega R^{2n-2}$, and show that the equal values at $n = 3$ and $4$ do not continue to $n = 5$.

::: solution
The bracket is $-2(n - 1)\,\langle\sin^{2n-2}\theta\rangle\,\Omega\int\matter\rho\,r^{2n-2}\,\dd V$, with
$\int\matter\rho\,r^k\,\dd V = 3\matter MR^k/(k + 3)$ for a uniform ball and
$\langle\sin^{2k}\theta\rangle = \tfrac23, \tfrac{8}{15}, \tfrac{16}{35}, \tfrac{128}{315}$ for $k = 1$ to 4. The
multiples are $-\tfrac45$, $-\tfrac{32}{35}$, $-\tfrac{32}{35}$ and
$-8 \times \tfrac{128}{315} \times \tfrac{3}{11} = -0.887$.
:::

### The paper

Show that for the paper's own pair $x^2 - y^2$ and $2xy$ the bracket is $-8L_z$, that the bracket of the pair
$h + ig = \tfrac13(x + iy)^3$ "changes sign with the sense of the turning", and that it tells apart a uniform ball and
a thin shell of the same mass, radius and angular momentum, which the paper's Table [](/paper/#tab:null) lists among
the magnetic part's blind spots.

::: solution
Each profile is twice the example's, so the bracket is four times $-2L_z$. The bracket is linear in $\matter{\vect J}$.
With equal $\vect L$ the shell turns at $\tfrac35$ of the ball's rate $\Omega$. The ball gives
$-\tfrac{32}{35}\matter M\Omega R^4 = -0.914\,\matter M\Omega R^4$; the shell, with
$\int\matter\rho\,\varpi^4\,\dd V = \tfrac{8}{15}\matter MR^4$, gives
$-4 \times \tfrac{8}{15} \times \tfrac35\,\matter M\Omega R^4 = -1.28\,\matter M\Omega R^4$.
:::
:::

::: paper
- [*The flow*](/paper/#par:the-flow) (Section XIII): the paper's equations [](/paper/#eq:flow-bracket) and
  [](/paper/#eq:hidden-spin), the order exchange, the pair $h_\pm$, the silent flows, Figure
  [](/paper/#fig:hidden-flow) and the trapped gas.
- [*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy): a bracket as
  "the response of the first to an impulse generated by the second"
  ([the order of two short tides](#the-order-of-two-short-tides-matters-first-at-the-second-power-of-the-time)); the
  rest is chapter 13.6's.
- [*What breaks the tie*](/paper/#par:what-breaks-the-tie) (Section IV): a body turning at a known rate
  ([a known rate of turning](#at-a-known-rate-of-turning-the-field-outside-holds-the-first-rung-of-the-ladder)).
- Tables [](/paper/#tab:null) and [](/paper/#tab:hair): the rows of two tides in either order.
:::

::: deeper
- F. Zambelli and S. Stringari (1998) [@ZambelliStringari1998]: the trapped gas's splitting from the same bracket and
  sum. F. Chevy, K. W. Madison and J. Dalibard, *Phys. Rev. Lett.* **85** (2000) 2223, used it to measure the angular
  momentum of a stirred gas.
- The GR course's [section 6.6](https://neovand.github.io/general-relativity/chapter-6.html#6-6-when-the-order-of-two-flows-matters)
  and its lab [*Try the other order*](https://neovand.github.io/general-relativity/chapter-6.html#flow-order): two
  motions that part by the square of the step.
:::

[^tau]: Not the relaxation time of chapter 4.4.

[^units]: A kick changes a momentum by $\epsilon\matter m_a\nabla g$, so $\epsilon\nabla g$ is a velocity. With $[h]$
    the unit of $h$, the first term is in
    $\mathrm s\cdot\mathrm{kg}\cdot(\mathrm{m\,s^{-1}}/\epsilon)\cdot[h]/\mathrm m$ and the second in
    $\mathrm s^2\cdot\mathrm{kg\,m\,s^{-1}}\cdot[h]/\mathrm m^2\cdot(\mathrm{m\,s^{-1}}/\epsilon)$: both are
    $\mathrm{kg}\,[h]/\epsilon$, like the left side.

[^sim]: The profiles are $h = \tfrac12(x^2 - y^2) + xyz$ and $g = \tfrac13(x^3 - 3xy^2) + 0.4\,yz$. The parts have
    masses from 0.5 to 2, random places and momenta (spreads 0.5 and 1), a spring of stiffness 0.7 between every two,
    and a trap force $-0.3\,\matter m_a\vect x_a$, in units near one; $\epsilon = 10^{-6}$. The forces are linear, so
    the motion is solved exactly. The bracket is `rate_bracket` in `reference/gravcam/readings.py`.

[^J]: Chapter 1.7's $\vect J$ was an impulse; here, as in the paper and chapter 2.8, it is the mass flux.

[^moment]: The moments' own brackets, at order $1/c^2$, are the paper's [](/paper/#eq:moment-bracket), which chapter
    13.6 takes up.

[^letters]: As in 13.2, $\vect\xi$ is not 1.4's separation $\xi^i$, $\vect\eta$ not the rapidity or the viscosity,
    and $\vect\zeta_\pm$ not 7.4's $\zeta^\mu$.

[^P]: Linear parts $\vect b_h\cdot\vect x$ and $\vect b_g\cdot\vect x$ add the total momentum's dot product with
    $(\nabla\nabla h)\vect b_g - (\nabla\nabla g)\vect b_h$, zero in the frame of the centre of mass.

[^c]: The local vector $\vect c$ is not the speed of light, and $\epsilon_{ijk}$ is chapter 1.1's Levi-Civita symbol,
    not a tide's strength.

[^H]: As in chapter 13.3, $H_\ell$ is a harmonic polynomial of degree $\ell$, and it always carries its subscript.

[^onto]: Take $\vect\Omega$ along $z$. The Laplacian in the plane is $4\,\partial^2/\partial w\,\partial w^*$, so
    only the two harmonics of degree $\ell$ made from $w^\ell$ and $w^{*\ell}$ have $\partial_zg = 0$, and by counting
    dimensions $\partial_z$ sends the other $2\ell - 1$ onto all $2\ell - 1$ harmonics of degree $\ell - 1$.
