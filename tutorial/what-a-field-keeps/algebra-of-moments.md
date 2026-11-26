---
id: '13.6'
title: "The algebra of moments to order 1/c², and Marolf's argument"
question: 'An instrument that reads two components of a top''s angular momentum cannot learn the third, although the third is their bracket. If the moments of a body and its energy generate everything that can be known of it, why can an observer who only watches the field not learn the body''s interior, and what changes when the observer can push?'
part: '13'
requires: ['1.3', '1.7', '2.1', '2.3', '2.4', '2.8', '4.2', '4.5', '4.6', '6.1', '6.4', '8.2', '8.7', '13.2', '13.4']
paper: [sec:second-order, eq:moment-bracket, eq:push, eq:hair-commutator, eq:flow-bracket, eq:hidden-spin, eq:thermal-moment, eq:sum-rule, fig:hidden-flow, app:proofs, sec:status]
figures: [fig:hidden-flow]
live: [phase-space, marolf-top]
depth: A
---

Imagine an instrument that reads two components of a spinning top's angular momentum, $L_x$ and $L_y$, and nothing
else. Two tops stand behind a wall, one with $\vect L = (1, 2, 0.5)\unit{J\,s}$ and the other with
$\vect L = (1, 2, -3)\unit{J\,s}$. No torque acts on either, so the instrument reads $L_x = 1$ and $L_y = 2$ for both,
to any precision and for as long as it watches. Now turn each top, stand and all, rigidly through a small angle about
the $x$ axis. The first top's $L_y$ falls by $0.5\unit{J\,s}$ per radian of the turn, and the second's rises by
$3\unit{J\,s}$ per radian. One turn reads what no amount of watching can.

Donald Marolf met this puzzle in quantum gravity. If the moments and the energy generate everything that can be known
of a body, why can an observer who only watches the field not learn the body's interior, and what changes when the
observer can push?[^first]

::: plain
You can learn about a body from outside by looking, which gives values, or by pushing it a little in a way set by one
quantity and seeing how much a second quantity changes. That change, per unit of push, is the bracket of the two. An
instrument that reads two parts of a top's spin cannot learn the third, however long it looks, but a small turn about
one axis changes the second part by an amount set by the third.


Because energy has weight, two moments of a body fail to commute: a push made by one changes the other, by an amount
set by how the matter inside flows. A warm body pushes itself, because its heat makes its moments jiggle, and the
jiggles that the field shows measure the brackets. In quantum mechanics this holds even at absolute zero.
:::

## Looking gives values; pushing gives brackets

Section 1.7 read the Poisson bracket two ways. As a rate, $\dot F = \{F, H\}$. And as a motion: any quantity $A$
**generates** a motion of the state, along which every quantity $B$ changes at the rate $\dd B/\dd\lambda = \{B, A\}$.
Run that motion for a small amount $\epsilon$, and

$$\delta B = \epsilon\,\{B, A\} + O(\epsilon^2) . \label{eq:response}$$

This is the **bracket as a response**: $\{B, A\}$ is the change of $B$ per unit of the push that $A$ generates. It is
measured by an operation followed by a reading: apply the push, read $B$, and compare with a copy left alone. We write the bracket in the order of section 1.7.[^order]

 Section 1.7 found that $L_z$ generates a turn about the $z$ axis. Relabelling
the axes, $L_x$ generates a turn about $x$: every position and every momentum moves as
$(y, z) \to (y - \epsilon z,\ z + \epsilon y)$, which is what turning the whole top by the angle $\epsilon$ does. The
angular momentum is built from them, so it turns in the same way, and its $y$ component changes by
$\delta L_y = -\epsilon L_z$. By [](#eq:response),

$$\boxed{\;\{L_y, L_x\} = -L_z ,\qquad \{L_x, L_y\} = L_z .\;}$$

Here $L_x$, $L_y$, $L_z$ are the components of $\sym{angular-momentum}{\vect L}$, in joule seconds.[^L] For the two tops and $\epsilon = 0.01$ rad,
to first order in $\epsilon$, $L_y$ becomes $1.995$ and $2.030\unit{J\,s}$, so $\delta L_y/\epsilon$ gives $-L_z$
(Figure [](#fig:bracket-response)).

Without the turn, every function of $L_x$ and $L_y$ is the same for the two tops, and watching longer adds nothing:
no torque acts, so $\{L_x, H\} = \{L_y, H\} = 0$.

**What it means.** Their values do not give $L_z$; their response does. Tides are pushes of the same kind: chapter
[1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside) found that a tide of profile $g$
changes the rate of another moment, $\matter{\dot Q_h}$, by
$\epsilon\int\sym{density}{\matter\rho}\,\nabla g\cdot\nabla h\,\dd V$, which, beyond linear profiles, the field
outside does not hold at any one time.

![Look first at the two short arrows on the right: the same turn moves the two tops' $L_y$ in opposite directions, by
$-L_z$ times the angle, although the camera on the left reads the same two numbers for both. The turn is drawn as 0.1
rad, ten times larger than the text's 0.01 rad, and the turned arrows are exact; the short arrows are the change of
$L_y$ per radian, to the scale of $\vect L$.](tut-bracket-response){#fig:bracket-response}

## The moments and the energy generate everything that can be known of a body

We show that a quantity whose bracket with every harmonic moment and with the energy vanishes is a constant. This is
what "generate everything" means: every other quantity changes under some push.[^app] We assume that **the body is $N$ masses
$\matter m_a$ at different places $\vect x_a$**, with momenta $\vect p_a$, and that **the forces come from a
potential energy $V$ of the places alone**, so that $\sym{hamiltonian}{H} = \sum_a|\vect p_a|^2/2\matter m_a + V$.[^H]
The moments are Newton's, $\sym{mass-moment}{\matter{Q_h}} = \sum_a\matter m_ah(\vect x_a)$, with $h$ harmonic in
the body.

**Step 1: the gradients of harmonic functions at the $N$ places take every value.** The push
generated by $\matter{Q_h}$ kicks part $a$ by $\matter m_a\nabla h(\vect x_a)$. Each harmonic $h$ gives a list of $3N$
numbers, $(\nabla h(\vect x_1), \dots, \nabla h(\vect x_N))$, and the list depends linearly on $h$. Suppose these
lists did not fill all $3N$ dimensions. Then some list of vectors $\vect u_a$, not all zero, would stand at right
angles to every one of them:[^u]

$$\sum_a\vect u_a\cdot\nabla g(\vect x_a) = 0 \quad\text{for every } g \text{ harmonic in the body.}$$

Take $g(\vect x) = 1/|\vect x - \vect y|$ with $\vect y$ outside the body, which is harmonic in $\vect x$ everywhere
except at $\vect y$ (chapter
[2.4](/tutorial/outside/greens-functions/#the-potential-of-one-point-builds-every-potential)). Its gradient is
$(\vect y - \vect x)/|\vect y - \vect x|^3$, so

$$D(\vect y) = \sum_a\frac{\vect u_a\cdot(\vect y - \vect x_a)}{|\vect y - \vect x_a|^3} = 0 \quad\text{for every } \vect y \text{ outside the body.}$$

Each term, a derivative of $1/|\vect y - \vect x_a|$ with respect to $\vect x_a$, is the potential of a point dipole
$\vect u_a$ at $\vect x_a$, harmonic in $\vect y$ except at $\vect x_a$. Space without $N$ points is all in one piece,
so chapter
[2.1](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball)'s unique continuation
makes $D$ zero everywhere except at the $N$ places. But near $\vect x_1$ the first term, at the distance $d$ along
$\vect u_1$, is $|\vect u_1|/d^2$, which grows without bound, while the others stay bounded. So $\vect u_1 = 0$, and in
the same way every $\vect u_a = 0$:

$$\boxed{\;\text{for any vectors } \vect k_a \text{ there is a harmonic } h \text{ with } \nabla h(\vect x_a) = \vect k_a \text{ for every } a .\;}$$

For five random places the 15 harmonic polynomials of degrees one to three give gradient lists of rank
$15 = 3N$.[^rank] For $N = 1$ the linear function $h = \vect k_1\cdot\vect x$ does it alone.

**Step 2: a quantity that commutes with every moment does not depend on the momenta.** A moment has no momenta, so by
section 1.7's bracket

$$\{F, \matter{Q_h}\} = -\sum_a\matter m_a\nabla h(\vect x_a)\cdot\frac{\partial F}{\partial\vect p_a} .$$

Suppose this vanishes for every harmonic $h$. By step 1 we may choose $h$ with $\matter m_a\nabla h(\vect x_a) =
\partial F/\partial\vect p_a$ at the state in question, and the sum becomes $-\sum_a|\partial F/\partial\vect p_a|^2$,
which is zero only if every $\partial F/\partial\vect p_a$ is zero. So $F$ depends on the places alone.

**Step 3: if it also commutes with the energy, it is a constant.** With no momenta in $F$, only the kinetic energy
contributes, and $\{F, H\} = \sum_a(\vect p_a/\matter m_a)\cdot\partial F/\partial\vect x_a$. The condition
$\{F, H\} = 0$ holds in every state, so at fixed places it holds for every choice of the momenta, and the choice
$\vect p_a = \matter m_a\,\partial F/\partial\vect x_a$ turns it into $\sum_a|\partial F/\partial\vect x_a|^2$. So
every derivative of $F$ vanishes:

$$\boxed{\;\{F, \matter{Q_h}\} = 0 \text{ for every harmonic } h \text{ and } \{F, H\} = 0 \;\Rightarrow\; F \text{ is a constant.}\;}$$

**Step 4: the impulses give every momentum.** The energy that a tide leaves, derived in
[the next section](#an-impulsive-tide-and-a-weighing-read-a-bracket-taken-twice), has an odd part: half the difference of the gains of two copies kicked by $\pm\epsilon$, divided by $\epsilon$, is
$\matter{\dot Q_g} = \sum_a\vect p_a\cdot\nabla g(\vect x_a)$. For the $3N$ profiles of step 1 these fix the $3N$
components of the momenta, once the places are known, and pairs of tides read the places through the density (chapter
[13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple)).

**What it means.** The moments kick every momentum, and their rates $\matter{\dot Q_h} = \{\matter{Q_h}, H\}$ move
every place, so together they generate all that can be determined of the body; the moments alone leave every function
of position undetermined.

## An impulsive tide and a weighing read a bracket taken twice

An impulsive tide of profile $g$ and strength $\sym{impulse-strength}{\epsilon}$ (section 1.7) is the motion
generated by $\matter{Q_g}$, run backward by $\epsilon$. Backward flips the order of the bracket in
[](#eq:response), so that any quantity changes by

$$\Delta F = \epsilon\{\matter{Q_g}, F\} + \frac{\epsilon^2}{2}\{\matter{Q_g}, \{\matter{Q_g}, F\}\} + \dots$$

For $F = H$ the first bracket is the energy's response, $\{\matter{Q_g}, H\} = \matter{\dot Q_g}$. The second is the
response of that response, $\{\matter{Q_g}, \matter{\dot Q_g}\} = \int\matter\rho\,|\nabla g|^2\,\dd V$. It depends on the places
alone, so its bracket with $\matter{Q_g}$ is zero, and the series stops:

$$\Delta E = \epsilon\,\matter{\dot Q_g} + \frac{\epsilon^2}{2}\int\matter\rho\,|\nabla g|^2\,\dd V ,\label{eq:push}$$

the response taken twice, exact in Newton's mechanics for that reason.[^push] Chapter
[4.5](/tutorial/response/causality/#a-blow-holds-every-frequency-and-the-energy-it-leaves-is-the-same-total) found the
same integral as the response added up over all frequencies: [](#eq:push) is that sum rule in time instead of
frequency. A weighing reads the gain, because the energy gained raises
the mass by $\Delta E/c^2$, and in the average of the gains of two copies kicked by $+\epsilon$ and $-\epsilon$ the
first term cancels.

**A number.** For the steel ball of 4110 kg and radius $R = 0.5\unit{m}$, and
$g = \tfrac12(x^2 - y^2)$, the second bracket is the moment of inertia about $z$, three fifths of a thin shell's
$\tfrac23\matter MR^2$: $411\unit{kg\,m^2}$ against $685\unit{kg\,m^2}$. Section 1.7's tonne, passing 1.5 m from the
ball's centre at $44\unit{km\,s^{-1}}$, makes a tide of about this shape with
$\epsilon = 1.35\times10^{-12}\unit{s^{-1}}$. The ball at rest gains $\tfrac12\epsilon^2\times411\unit{kg\,m^2} =
3.7\times10^{-22}\unit{J}$, and the scale reads $4\times10^{-39}\unit{kg}$ more.

**The quantum body.** With section 8.2's commutator, $i\hbar$ times the bracket, the impulse $U = e^{i\epsilon\matter{Q_g}/\hbar}$ gives
[](#eq:push) line for line.

::: try {#phase-space}
The figure is section 1.7's cart on a spring. At the end of its swing the cart is at rest, so the first response,
$\epsilon\matter{\dot Q_g}$, is zero there. Does a kick at that instant still
leave energy? Press *Pause* and drag the point round its ellipse to where $p = 0$, or reach it with Tab and the arrow
keys. Choose *Tidal, g = ½x²* under *The tide*, press *Kick*, and read *The last kick*.
:::

## Heat and the zero point push a body themselves

A watcher who cannot push can still read brackets if the body pushes itself. In a warm body every part jiggles, so its moments jiggle, and the field outside shows it. For any quantity $A$ of the body, the
average over the Boltzmann weight $e^{-H/\kB T}$ of section 4.2, written $\langle\cdot\rangle$, obeys

$$\langle A\,\{\matter{Q_g}, H\}\rangle = \kB T\,\langle\{\matter{Q_g}, A\}\rangle ,$$

with $\kB$ Boltzmann's constant and $T$ the temperature. With $A = \matter{\dot Q_h}$ the left side is the mean product of two rates, which watching alone measures:

$$\boxed{\;\langle\matter{\dot Q_h}\matter{\dot Q_g}\rangle = \kB T\,\langle\{\matter{Q_g}, \matter{\dot Q_h}\}\rangle = \kB T\,\Bigl\langle\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V\Bigr\rangle .\;}$$

Section 4.2 found this by averaging the velocities. The temperature stands where $\hbar$ stands.[^thermal]

::: derivation
### Heat supplies the push

The chain rule gives $e^{-H/\kB T}\{\matter{Q_g}, H\} = -\kB T\,\{\matter{Q_g}, e^{-H/\kB T}\}$. The moment has no
momenta, so $\{\matter{Q_g}, K\} = \sum_a\matter m_a\nabla g(\vect x_a)\cdot\partial K/\partial\vect p_a$ for any $K$: a
derivative with respect to the momenta. We integrate $A$ times this over every momentum and move the derivative from
the weight onto $A$, which changes the sign; the weight vanishes at large momenta, so nothing is left at the ends:

$$\int A\,\{\matter{Q_g}, e^{-H/\kB T}\}\,\dd^{3N}p = -\int e^{-H/\kB T}\,\{\matter{Q_g}, A\}\,\dd^{3N}p .$$

Together the two lines give $\langle A\{\matter{Q_g}, H\}\rangle = \kB T\langle\{\matter{Q_g}, A\}\rangle$.
:::

**The quantum body at absolute zero.** For any two Hermitian operators $(AB)^\dagger = BA$, so $\langle BA\rangle =
\langle AB\rangle^*$ and

$$\langle[A, B]\rangle = 2i\,\mathrm{Im}\,\langle AB\rangle .$$

With $A = \matter{Q_h}$ and $B = \matter{\dot Q_g}$, the commutator of section 8.2 gives
$\mathrm{Im}\langle\matter{Q_h}\matter{\dot Q_g}\rangle = \tfrac12\hbar\,\langle\int\matter\rho\,\nabla h\cdot\nabla
g\,\dd V\rangle$ in every state, the ground state included: section 8.7's zero point. A watcher reads this part too,
since chapter
[8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give) found the
commutator in the difference between the body's power to absorb energy and to emit it. A cold classical body is at
rest and its correlations hold nothing: the correlations of a quantum state contain its commutators, and a cold
classical body's do not.

**What it means.** An observer who only watches a warm body, or any quantum body, still measures brackets, because the
body pushes itself.

## To order 1/c², the moments of the energy do not commute

In Newton's theory every moment is a function of the places alone, and any two functions of the places have the
bracket zero. Energy has weight (section 6.4), so to a first approximation the field reports the moments of the
energy, whose brackets weigh the flow:

$$\sym{energy-moment}{\matter{Q_h}} = \frac{1}{c^2}\sum_aE_a\,h(\vect x_a), \qquad E_a = \sqrt{\matter m_a^2c^4 + |\vect p_a|^2c^2} ,$$

with $\sym{energy}{E_a}$ the energy of part $a$ in joules, so that $\matter{Q_h}$ is in kilograms times the unit of
$h$.[^QE] From here on $\matter{Q_h}$ means this moment of the energy; the earlier sections used Newton's. We want their bracket, assuming first that **the parts are free**.

For one particle, $E$ depends on the momentum alone. So the derivatives of $Eh$ are $E\nabla h$ with respect to the
place and $h\,\partial E/\partial\vect p$ with respect to the momentum, and section 1.7's bracket gives

$$\{Eh, Eg\} = E\nabla h\cdot g\frac{\partial E}{\partial\vect p} - h\frac{\partial E}{\partial\vect p}\cdot E\nabla g = E\,\frac{\partial E}{\partial\vect p}\cdot(g\nabla h - h\nabla g) .$$

Differentiating $E^2 = |\vect p|^2c^2 + \matter m^2c^4$ gives $E\,\partial E/\partial\vect p = c^2\vect p$, which is
6.4's $\vect p = E\vect v/c^2$. Parts that differ have the bracket zero. We sum and divide by $c^4$:

$$\boxed{\;\{\matter{Q_h}, \matter{Q_g}\} = \frac{1}{c^2}\sum_a\vect p_a\cdot(g\nabla h - h\nabla g)(\vect x_a) .\;}$$

With the density of momentum $\sym{mass-flux}{\matter{\vect J}}$ in place of the sum over parts,[^J] this is,
exactly for free particles,[^mb]

$$\{\matter{Q_h}, \matter{Q_g}\} = \frac{1}{c^2}\int\matter{\vect J}\cdot(g\,\nabla h - h\,\nabla g)\,\dd V .\label{eq:moment-bracket}$$

As $c$ grows the bracket falls as $1/c^2$, and Newton's moments commute again. For $h$ and $g$ in square metres it is
in $\mathrm{kg\,m^2\,s}$, which is $(\mathrm{kg\,m^2})^2$ divided by a joule second.

**Forces.** Let the forces not depend on velocity, and add to each $E_a$ a share $V_a$ of the potential energy (half
of each spring's energy to each end, say). The shares depend on the places alone, so they commute with one another. A
cross term of a share with a kinetic part lacks the momentum that supplies $E\,\partial E/\partial\vect p =
c^2\vect p$, so it is smaller than the box by about $V_a/\matter m_ac^2$.

**What the field reports.** At this order the field reports more than the moments of the energy. Blanchet and
Damour found that to order $1/c^2$ a body's mass moments are those of $\sigma = (T^{00} + T^{ii})/c^2$, plus
terms built from time derivatives (*Ann. Inst. Henri Poincaré A* 50, 377, 1989), with $T^{00}$ the density of energy
and $T^{ii}$ the sum of the three normal stresses, in joules per cubic metre. So the moments weigh the stresses too,
and only the mass is spared, because in a body in equilibrium the stresses add up to zero (von Laue's theorem). A
tide weighs a part in the same way: in its potential $\Phi$ a moving part's energy changes by
$\Phi(E_a + \vect p_a\cdot\vect v_a)/c^2$, its share of $\sigma$. Equation [](#eq:moment-bracket) holds
for the moments of the energy; what the field reports, and what a tide generates, differ from them at the same order.
We state this without proof.

**Check 1: two dipoles.** For $h = x$ and $g = y$, $g\nabla h - h\nabla g = (y, -x, 0)$, and $\vect p\cdot(y, -x, 0) =
-(xp_y - yp_x)$, so

$$\{\matter{Q_x}, \matter{Q_y}\} = -\frac{L_z}{c^2} ,$$

the bracket of the mass dipoles that Maurice Pryce found [@Pryce1948]. For a body at rest with spin
$S_z$ about its centre it is $-S_z/c^2$, in kilogram seconds, and it makes the body's centre of energy depend on the
frame. Run for the amount $v$, the motion generated by $\matter{Q_x}$ kicks each momentum by $-vE_a/c^2$ along $x$,
as a change to a frame moving at the small speed $v$ along $x$ does (section 6.1). So the centre of energy,
$\matter{Q_y}/\matter M$, moves by $v\{\matter{Q_y}, \matter{Q_x}\}/\matter M = vS_z/\matter Mc^2$.[^moller]

**Check 2: two quadrupoles.** For $h = x^2 - y^2$ and $g = 2xy$, the gradients are $(2x, -2y, 0)$ and $(2y, 2x, 0)$,
and

$$g\nabla h - h\nabla g = 2(x^2 + y^2)\,(y, -x, 0) .$$

With the **density of angular momentum** about $z$, $\sym{angular-momentum-density}{\ell_z} = xJ_y - yJ_x$, in
$\mathrm{kg\,m^{-1}\,s^{-1}}$, whose integral is $L_z$,

$$\boxed{\;\{\matter{Q_{x^2-y^2}}, \matter{Q_{2xy}}\} = -\frac{2}{c^2}\int(x^2 + y^2)\,\ell_z\,\dd V .\;}$$

a moment of the flow that the exterior field does not hold.

**A number.** In 13.4's hidden swirl, a uniform sphere of mass $\sym{mass}{\matter M}$ and radius $R$, whose
inner ball, out to $a = 2^{-1/5}R$, turns about $z$ at the rate $\Omega$ and the rest at $-\Omega$, so that $L_z = 0$.
In a layer turning at $\sym{layer-rate}{\Omega(r)}$, $\ell_z = \matter\rho\,\Omega(r)\,\varpi^2$, with $\varpi$ the
distance from the axis. With 13.4's $\int\matter\rho\,\varpi^4\,\dd V = \tfrac{8}{35}\matter MR^4$, the rigid ball
gives $-2\Omega\int\matter\rho\,\varpi^4\,\dd V/c^2 = -\tfrac{16}{35}\matter M\Omega R^4/c^2$, and 13.4's split into
the two parts multiplies this by $2a^7/R^7 - 1 = 2^{-2/5} - 1$:

$$\{\matter{Q_{x^2-y^2}}, \matter{Q_{2xy}}\} = \tfrac{16}{35}\bigl(1 - 2^{-2/5}\bigr)\frac{\matter M\Omega R^4}{c^2} = 0.111\,\frac{\matter M\Omega R^4}{c^2} ,$$

not zero, although $L_z$ is. For the 4110 kg ball turning at $\Omega = 100\unit{s^{-1}}$ it is
$3.2\times10^{-14}\unit{kg\,m^2\,s}$, so a push of the tonne's strength generated by $\tfrac12\matter{Q_{x^2-y^2}}$
would change $\matter{Q_{2xy}}$ by $2\times10^{-26}\unit{kg\,m^2}$, two parts in $10^{29}$ of $\matter MR^2$. The
bracket is half of 13.4's octupolar bracket of two rates divided by $c^2$:
for every flow, 13.4's integrand $\matter{\vect J}\cdot[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h]$, with
$h + ig = (x + iy)^3/3$, has the vector $-4\varpi^2(-y, x, 0)$, twice the one here.[^hs]

{{paper fig:hidden-flow}}

**What it means.** To the same approximation an impulsive tide is the motion generated by this $\matter{Q_g}$,
run backward. It kicks each part, changing its weight, and delays its clock by $\epsilon g/c^2$;[^clock] both changes
go with the momenta, so the bracket weighs the flow.

## In general relativity the moments are charges of motions that do not close

Are the moments charges of motions of spacetime, and does matter's bracket supply the algebra those motions lack? We
measure time in metres here, so that $c = 1$.[^c1] A
**vector field** is a direction of motion given at every event: the operator $a\,\partial_t + \vect b\cdot\nabla$,
with $a$ and $\vect b$ functions of $(t, \vect x)$, moves each event by $(\lambda a, \lambda\vect b)$. The fields of
interest, with $f$ harmonic, are

$$\sym{moment-field}{X_f} = f\,\partial_t + t\,\nabla f\cdot\nabla .$$

For $f = 1$, $X_1 = \partial_t$ is the shift in time. For $f = x$, $X_x = x\,\partial_t + t\,\partial_x$ is the boost
along $x$ of section 6.1, which by a small rapidity $\lambda$ moves $t$ by $\lambda x$ and $x$ by $\lambda t$.

The **commutator of two vector fields**, $[X, Y] = XY - YX$, measures how two small motions fail to undo each other:
an event moved by $X$, then $Y$, then $X$ backward and $Y$ backward, each for a small $\lambda$, misses its start by
an amount of order $\lambda^2$ along $[X, Y]$. On a function $\phi(t, \vect x)$ the second derivatives cancel, and
what is left is again a vector field. With $\phi_t = \partial_t\phi$, $X_g\phi = g\,\phi_t + t\,\nabla g\cdot\nabla\phi$, and the product rule gives

$$\begin{aligned}
X_fX_g\phi ={}& fg\,\phi_{tt} + f\,\nabla g\cdot\nabla\phi + t\,(f\nabla g + g\nabla f)\cdot\nabla\phi_t\\
&+ t\,(\nabla f\cdot\nabla g)\,\phi_t + t^2\,\partial_if\,\partial_jg\,\partial_i\partial_j\phi + t^2\,\partial_if\,\partial_i\partial_jg\,\partial_j\phi .
\end{aligned}$$

The first, third, fourth and fifth terms do not change when $f$ and $g$ are exchanged, so they cancel in $X_fX_g\phi -
X_gX_f\phi$, which leaves

$$\boxed{\;[X_f, X_g] = (f\nabla g - g\nabla f)\cdot\nabla + t^2\bigl[(\nabla\nabla g)\nabla f - (\nabla\nabla f)\nabla g\bigr]\cdot\nabla ,\;}$$

with $\nabla\nabla g$ the table of second derivatives of $g$, 13.4's Hessian. A family of vector fields **closes** if
the commutator of any two of its members is again a combination of members.

**Checks.** For $f = x$, $g = y$ the Hessians vanish and $[X_x, X_y] = x\,\partial_y - y\,\partial_x$, section 1.7's
turn about $z$: two boosts combine into a turn, as chapter
[6.1](/tutorial/relativity/lorentz/#a-boost-can-point-in-any-direction) found. For $f = 1$,
$[\partial_t, X_g] = \nabla g\cdot\nabla$, a translation when $g$ is linear.

For $f = x^2 - y^2$ and $g = 2xy$ the box gives $[2(x^2 + y^2) + 8t^2]\,(x\,\partial_y -
y\,\partial_x)$. It has no part along $\partial_t$, so it is no $X_k$ except $X_0 = 0$, and its components are cubic
in the place, so it is no rotation either: the fields of higher degree do not close under
the bracket of vector fields.

Compère, Oliveri and Seraj define a gravitating body's mass moments as the
**charges** of these transformations, the quantities that Noether's construction attaches to them, read on a sphere
outside the body, which match Kip Thorne's mass moments [@CompereOliveriSeraj2018]. They leave open
whether the fields of degree two and higher close under some modified bracket. The linear theory of
[section 7.4](/tutorial/geometry/linearized-gravity/#relabelling-the-coordinates-changes-the-table-not-the-curvature)
already shows the two facts that make this definition work: $X_f$ moves no part of the field that matter makes, and
its charge is the moment.

**The motions change no curvature.** A small change of coordinates by the gauge shift $\zeta^\mu$ changes the
metric's small part by $\field h_{\mu\nu} \to \field h_{\mu\nu} - \partial_\mu\zeta_\nu - \partial_\nu\zeta_\mu$ and
leaves the curvature alone (section 7.4). We take the shift along $X_f$, $\zeta^\mu = \lambda\,(f, t\nabla f)$, with
$\lambda$ small and $f$ independent of time. Lowering the index with $\field\eta$, whose time entry is $-1$, gives
$\zeta_0 = -\lambda f$ and $\zeta_i = \lambda t\,\partial_if$, so

$$\partial_0\zeta_0 = 0 ,\qquad \partial_0\zeta_i + \partial_i\zeta_0 = \lambda(\partial_if - \partial_if) = 0
,\qquad \partial_i\zeta_j + \partial_j\zeta_i = 2\lambda t\,\partial_i\partial_jf .$$

The shift leaves $\field h_{00} = -2\field\Phi$, which carries Newton's potential, and $\field h_{0i}$, which carries
the flow, as they were, and adds $-2\lambda t\,\partial_i\partial_jf$ to the spatial entries. That addition has no
trace, because $\nabla^2f = 0$. The shift also obeys $\Box\zeta_\nu = 0$, since $\Box\zeta_0 = -\lambda\nabla^2f$ and
$\Box\zeta_i = \lambda t\,\partial_i\nabla^2f$ both vanish, so it keeps the harmonic gauge: it is part of the
leftover freedom of section 7.4. For $f = 1$ and for linear $f$ the Hessian is zero, nothing changes, and $X_f$ is a
symmetry of flat spacetime, the shift in time or a boost. For degree $\ell \ge 2$ it is no symmetry: it adds to
$\field h_{ij}$ a pure-gauge strain that grows with $t$ and, far away, as $r^{\ell-2}$, a relabelling of the events
that no free ball can feel.

**Its charge is the moment.** For a shift $\zeta$, Noether's current of matter is
$j^\mu = \matter T^{\mu\nu}\zeta_\nu$. Conservation, $\partial_\mu\matter T^{\mu\nu} = 0$ (section 6.5), and the
symmetry of $\matter T^{\mu\nu}$ leave $\partial_\mu j^\mu = \tfrac12\matter T^{\mu\nu}(\partial_\mu\zeta_\nu +
\partial_\nu\zeta_\mu)$, which by the display above is $\lambda t\,\matter T^{ij}\partial_i\partial_jf$. Its density
$j^0 = \matter T^{00}\zeta_0 + \matter T^{0i}\zeta_i$, divided by $-\lambda$ so that the shift in time has the energy
for its charge, gives the charge of $X_f$,[^sign]

$$C_f(t) = \int\bigl(\matter T^{00}f - t\,\matter{\vect J}\cdot\nabla f\bigr)\,\dd V =
\matter{Q_f} - t\,\matter{\dot Q_f} ,$$

in kilograms times the unit of $f$, with $\matter{\vect J}$ the density of momentum, $\matter T^{0i}$ at $c = 1$. At
$t = 0$ it is the moment $\matter{Q_f}$. For $f = x$ it is $\matter{Q_x} - tP_x$, which is constant because the centre
of energy moves uniformly: the charge of a boost. Its rate is minus the divergence integrated over space,

$$\frac{\dd C_f}{\dd t} = -t\int\matter T^{ij}\,\partial_i\partial_jf\,\dd V = -t\,\matter{\ddot Q_f} ,$$

the second form by the two integrations by parts of section 7.7's virial identity, done with $f$ in place of
$x_kx_l$, which give $\matter{\ddot Q_f} = \int\matter T^{ij}\partial_i\partial_jf\,\dd V$. The charge is
constant when $X_f$ is a symmetry, or when the stresses integrated against the Hessian of $f$ give zero. For degree two the Hessian is a constant table, and a body in equilibrium has
$\int\matter T^{ij}\,\dd V = 0$ (von Laue's theorem, section 7.7), so its quadrupolar charges are constant too.

**It is read outside.** Restoring $c$, a slow body has $\matter T^{00} = \matter\rho c^2$ and Poisson's
$\nabla^2\field\Phi = 4\pi G\matter\rho$ (section 7.4). With $f$ harmonic, Green's second identity
([section 2.1](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other)) moves
the Laplacian from $\field\Phi$ onto $f$, where it gives zero, and leaves only the boundary:

$$\matter{Q_f} = \int\matter\rho f\,\dd V = \frac{1}{4\pi G}\oint_S\bigl(f\nabla\field\Phi - \field\Phi\nabla
f\bigr)\cdot\dd\vect A ,$$

for every closed surface $S$ around the body, with $f$ harmonic inside it. **Units:** $f\nabla\field\Phi\,\dd A$ is in the unit of $f$ times
$\mathrm{m^3\,s^{-2}}$, and dividing by $G$ in $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ leaves kilograms times the unit of $f$.
For $f = 1$ the second term vanishes and this is Gauss's law of section 1.3. **A number:** with
$f = z^2 - \tfrac12(x^2 + y^2)$, harmonic, a sphere round the Earth reads the flattening of section 2.3,
$-J_2\matter MR^2 = -1.0826\times10^{-3}\times5.972\times10^{24}\unit{kg}\times(6.378\times10^6\unit m)^2 =
-2.63\times10^{35}\unit{kg\,m^2}$, which satellites measure from their orbits; the Earth is in equilibrium, so this
charge does not change. Away from the slow limit, the field's own change in time adds terms of order $1/c^2$;
the charges of Compère, Oliveri and Seraj are surface integrals of the full linear theory and include them.

**The link.** For a field $\vect\xi\cdot\nabla$ in space, the charge is the momentum carried along it,[^xi]
$P[\vect\xi] = \int\matter{\vect J}\cdot\vect\xi\,\dd V$, which is $L_z$ for the turn $(-y, x, 0)$. At $t = 0$ the
charge of $X_f$ is the moment $\matter{Q_f}$. In the **Poincaré group** (the shifts in time and space, the turns and
the boosts), $[X_x, X_y]$ is the turn, whose charge is $L_z$, while $\{\matter{Q_x}, \matter{Q_y}\} = -L_z$. The same
rule holds at every degree:

$$\{\matter{Q_h}, \matter{Q_g}\} = -P\bigl[h\nabla g - g\nabla h\bigr] ,$$

minus the charge of $[X_h, X_g]$ at $t = 0$, where the $t^2$ term vanishes. So the bracket of two moments is not a
moment but a moment of the flow: matter supplies, to order $1/c^2$, a bracket for charges whose fields do not close
(Figure [](#fig:moment-algebra)).
Dirac and Schwinger found the bracket of the energy density $T^{00}$ at two points that Poincaré
invariance requires [@Dirac1962; @Schwinger1963]. In this section's order it is

$$\{T^{00}(\vect x), T^{00}(\vect y)\} = -\bigl[\matter{\vect J}(\vect x) + \matter{\vect J}(\vect y)\bigr]\cdot\nabla_{\vect x}\,\delta(\vect x - \vect y) ,$$

with $\delta$ Dirac's delta function. Multiplied by $h(\vect x)g(\vect y)$ and integrated over both points, it gives
[](#eq:moment-bracket) after one integration by parts in each term. With $c = 1$ the moments are
$\matter{Q_h} = \int\matter T^{00}h\,\dd V$, so

$$\{\matter{Q_h}, \matter{Q_g}\} = -\iint h(\vect x)\,g(\vect y)\bigl[\matter{\vect J}(\vect x) + \matter{\vect
J}(\vect y)\bigr]\cdot\nabla_{\vect x}\,\delta(\vect x - \vect y)\,\dd^3x\,\dd^3y .$$

In the term with $\matter{\vect J}(\vect y)$ only $h(\vect x)$ depends on $\vect x$, and moving the gradient onto it
changes the sign: the term is $\iint g(\vect y)\,\matter{\vect J}(\vect y)\cdot\nabla h(\vect x)\,\delta(\vect x -
\vect y) = \int g\,\matter{\vect J}\cdot\nabla h\,\dd V$. In the term with $\matter{\vect J}(\vect x)$ we write
$\nabla_{\vect x}\delta(\vect x - \vect y) = -\nabla_{\vect y}\delta(\vect x - \vect y)$ and move the gradient onto
$g(\vect y)$, which gives $-\int h\,\matter{\vect J}\cdot\nabla g\,\dd V$. Together,

$$\{\matter{Q_h}, \matter{Q_g}\} = \int\matter{\vect J}\cdot(g\,\nabla h - h\,\nabla g)\,\dd V ,$$

which is [](#eq:moment-bracket) at $c = 1$. **A check:** for $h = 1$ the moment is the energy $H$, and the result
is $\{H, \matter{Q_g}\} = -\int\matter{\vect J}\cdot\nabla g\,\dd V = -\matter{\dot Q_g}$, the rate of
section 1.7 with the order of the bracket reversed. For free particles, $\matter T^{00}(\vect x) =
\sum_aE_a\,\delta(\vect x - \vect x_a)$ and $\matter{\vect J}(\vect x) = \sum_a\vect p_a\,\delta(\vect x - \vect
x_a)$, and the boxed sum over parts found above gives the same smeared bracket for every $h$ and $g$; a distribution
is fixed by its integrals against all smooth functions, so for free particles the bracket of the energy density is
exactly this form. That interacting matter has it too, whatever its stresses, is Dirac's and Schwinger's result
for theories that are invariant under the Poincaré group, and we state it without proof. The full theory's algebra
is open.

![Look first at the bands: the bracket of a moment with a rate weighs the density, the bracket of two rates and, at
order $1/c^2$, the bracket of two moments of the energy weigh the flow, and the energy turns each moment into its rate.
Cells below the diagonal, drawn pale, follow by antisymmetry, $\{B, A\} = -\{A, B\}$. The tag in each corner is the
order of the leading term.](tut-moment-algebra){#fig:moment-algebra}

## Marolf's boundary algebra holds the interior, but watching cannot read it

**The energy is a boundary term.** Chapter
[1.3](/tutorial/newton/gauss-and-poisson/#the-flux-out-of-a-closed-surface-counts-the-mass-inside)'s Gauss law,
$\matter M = -(1/4\pi G)\oint\field{\vect g}\cdot\dd\vect A$, with $\field{\vect g}$ the field of gravity (not a
profile), reads the mass, and so the energy $\matter Mc^2$, on any sphere far outside. In general relativity the
energy is likewise an integral over a surface at the boundary; we state this. A **boundary observable** is built from
the fields near the boundary of space at one time, and their **algebra of observables** is everything built from them
by sums, products and brackets. Marolf's argument makes one claim, and two gaps separate it from what an observer
learns.

**The algebra holds the interior.** Marolf made the argument in perturbative quantum gravity, the quantum
theory of small ripples of spacetime, and noted that it recasts in classical terms [@Marolf2009]. Whatever happens
inside sends signals that reach the boundary, so the boundary readings over all time hold the interior. The energy $H$
is a boundary observable, so the rate $\{A, H\}$ of any boundary observable $A$ is in the algebra, and so, formally
(without asking whether the series converges), are its later values:

$$A(t) = A + t\{A, H\} + \frac{t^2}{2}\{\{A, H\}, H\} + \dots$$

He states that the Poisson algebra generated by the fields on future null infinity (the far sphere where outgoing
light arrives) near its earliest part, spatial infinity, contains a **complete set of observables**, enough to fix the
state. He requires it to be closed under the finite motions that its members generate: pushes. We state Marolf's results as he
made them (Marolf 2009, 2014), without proof, and use them only to locate the two gaps below. In Newton's
mechanics the corresponding statement is the
[second section's theorem](#the-moments-and-the-energy-generate-everything-that-can-be-known-of-a-body).

**Values do not give brackets.** Marolf named this gap himself with the generators of turns $J_x$, $J_y$, $J_z$, which the tops picture: classically,
measuring the first two gives no knowledge of the third, their bracket. Only in quantum theory, he wrote, can alternating measurements
of the two give information about the third, and chapter
[8.2](/tutorial/quantum/operators/#two-quantities-that-do-not-commute-cannot-both-be-sharp)'s
$\Delta L_x\,\Delta L_y \ge \tfrac12\hbar\,|\langle L_z\rangle|$ says why: a sharp reading of $L_x$ spreads $L_y$ by
an amount set by $L_z$, so a quantum measurement is itself a push. A later paper finds
the same **holography of information**, the boundary at one time holding everything inside, in anti-de Sitter space, a
curved spacetime with a boundary, and traces it to Gauss's law together with the entanglement of the quantum vacuum
(the Reeh–Schlieder theorem), so that it is purely quantum [@Marolf2014].

**The series misses histories that are not analytic.** Ted Jacobson and Phuc Nguyen traced the classical failure to a
lack of analyticity in time [@JacobsonNguyen2019]. A function of time is **analytic** if, round every time, it equals
its Taylor series, and a history need not be. Take

$$A(t) = e^{-1/t^2} \text{ for } t > 0, \qquad A(t) = 0 \text{ for } t \le 0 .$$

Each derivative for $t > 0$ ($A' = (2/t^3)\,e^{-1/t^2}$, $A'' = (4/t^6 - 6/t^4)\,e^{-1/t^2}$, and so on) is a
polynomial in $s = 1/t$ times $e^{-s^2}$, which falls faster than any power of $s$ grows. Every derivative at $t = 0$
is therefore zero, and so is the series for all time, while $A(1) = e^{-1} = 0.37$ (Figure [](#fig:analytic-pulse)).
Their example is a bump on a
wave that has not yet reached the place read, where the series gives zero. In quantum mechanics, they show,
expectation values in states whose energies lie below some bound are analytic in time, so the derivatives at one time
fix the values at all times.

**Why a bounded energy makes a history analytic.** We assume that **the state's energies lie in a band** from $E_0$
to $E_1$: its expansion in states of definite energy (section 8.2) has no part outside it. The floor $E_0$ is there
for any stable body; the ceiling is the assumption. For a quantity $B$ we write $\|B\|$ for the largest value of
$|\langle\phi|B|\chi\rangle|$ over states $\phi$ and $\chi$ of unit length, which for a Hermitian $B$ is the largest
size of an eigenvalue; then $|\langle B\rangle| \le \|B\|$ and $\|BC\| \le \|B\|\,\|C\|$. The Heisenberg equation of
[section 8.2](/tutorial/quantum/operators/#the-quantum-equation-of-motion-is-the-classical-one-with-ihbar-times-the-bracket),
applied $k$ times, gives

$$\frac{\dd^k\langle A\rangle}{\dd t^k} = \Bigl(\frac{i}{\hbar}\Bigr)^k\bigl\langle[H, [H, \dots[H, A]\dots]]\bigr\rangle ,$$

with $k$ commutators. Adding a constant to $H$ changes no commutator, so we may use $H - \bar E$, with $\bar E$ the
middle of the band. The state stays in the band, since $H$ never takes it out, so only the part of $A$ between states
of the band enters, and there $H - \bar E$ has no eigenvalue larger in size than $\tfrac12(E_1 - E_0)$. Each
commutator $(H - \bar E)B - B(H - \bar E)$ is therefore at most $(E_1 - E_0)\|B\|$ in size, and

$$\Bigl|\frac{\dd^k\langle A\rangle}{\dd t^k}\Bigr| \le \Omega^k\,\|A\| ,\qquad \Omega = \frac{E_1 - E_0}{\hbar} ,$$

at every time, with $\Omega$ in $\mathrm{s^{-1}}$, the largest angular frequency $(E_m - E_n)/\hbar$ the state holds.
Taylor's theorem with Lagrange's remainder bounds the error of the series at $t = 0$, taken to the power $t^n$, by the
next derivative at some time between 0 and $t$:

$$\Bigl|\langle A\rangle(t) - \sum_{k=0}^{n}\frac{t^k}{k!}\,\frac{\dd^k\langle A\rangle}{\dd t^k}(0)\Bigr| \le
\|A\|\,\frac{(\Omega|t|)^{n+1}}{(n + 1)!} .$$

A factorial outgrows any power, so for every $t$ the error tends to zero as $n$ grows: the series converges to the
history at all times, and

$$\boxed{\;\text{energies in a band of width } \hbar\Omega \;\Rightarrow\; \langle A\rangle(t) = \sum_{k=0}^{\infty}\frac{t^k}{k!}\,\frac{\dd^k\langle A\rangle}{\dd t^k}(0) \text{ for every } t .\;}$$

A reading whose every derivative vanishes at one time vanishes for ever. This is the simplest case of a theorem of
Paley and Wiener: a function whose frequencies lie within $\pm\Omega$ extends to an analytic function of complex time.
**A number:** for a spin whose two levels lie $1\unit{\mu eV}$ apart, $\Omega = 1.5\times10^9\unit{s^{-1}}$,
and at $t = 6.6$ ns, where $\Omega t = 10$, the series to $t^{40}$ is within $10^{41}/41! = 3\times10^{-9}$ of
$\|A\|$. **The
limit:** at a fixed spread of energy, $\Omega$ grows without bound as $\hbar \to 0$ and the bound is lost. A classical
field has no such ceiling on its frequencies, so it can switch on from exactly zero, as $e^{-1/t^2}$ does, which a
function equal everywhere to its series cannot. With the floor alone the conclusion is weaker: an amplitude
$\langle\phi|e^{-iHt/\hbar}|\psi\rangle$ extends to complex times with negative imaginary part, where
$e^{-iHt/\hbar}$ stays bounded because no energy lies below $E_0$, and Schwarz's reflection principle then forbids it to vanish over an interval of real time
unless it vanishes at all times.

![Look first at the dashed line: the Taylor series at $t = 0$ of $e^{-1/t^2}$ is zero, yet the function rises. A
reading whose every bracket with the energy vanishes at one time may still change later. The curve is exact; the strip
below is schematic.](tut-analytic-pulse){#fig:analytic-pulse}

**Pushing.** Marolf's limit holds for an observer who only measures the field. An
observer who can apply a tide measures brackets, since the bracket of two quantities is the response of the first to
an impulse generated by the second. That closes the first gap: one turn of 0.01 rad reads the hidden $L_z$ of the two
tops, and a warm body or a quantum state pushes itself
([*Heat and the zero point*](#heat-and-the-zero-point-push-a-body-themselves)). For the second gap, a push followed by a weighing needs no series, because the energy gained at the push is conserved
and can be read at any later time.

**What it means.** Classical physics keeps one part of the holography of information: an operation followed by a
reading (section 13.8).

::: try {#marolf-top}
Predict first: two tops have the same $L_x$ and $L_y$ and different $L_z$. Does watching them or turning them tell you
$L_z$? And does the exact turn's $\delta L_y/\epsilon$ approach $-L_z$ from above or from below as $\epsilon$
shrinks? In *A top*, set the slider $L_z$ to 0.5 J s, press *Watch for ten
seconds* and read *What the field reads*. Then press *Turn by ε about x* and compare the two readouts beside it. Set the
slider $L_z$ to −3, turn again, and step *The angle of the turn, ε* down. Last, choose *The hidden swirl* and move
*Radius of the inner ball* from "no angular momentum" to "zero bracket", watching the angular momentum and the bracket.
:::

**The idea to keep: a bracket is the response of one quantity to a push generated by another, so watching gives
values and pushing gives brackets. The moments and the energy generate everything that can be known of a body, so an
observer reads its interior by pushing, or by watching a body whose heat or zero point pushes itself.**

::: problems
### Practice

**[13.6]** Why does a warm body need no push, and what does an instrument that reads only $L_x$ and $L_y$ learn about
$L_z$, however long it watches?

::: solution
Heat jiggles its moments, and the mean product of two rates, which watching measures, is $\kB T$ times their bracket.
The instrument learns nothing: it needs the response of one reading to a turn generated by the other, $\delta L_y =
-\epsilon L_z$.
:::

**[13.6]** Find $\{\matter{Q_{x^2-y^2}}, \matter{Q_{2xy}}\}$ for a thin ring of mass $\matter M$ and radius $a$ in the plane
$z = 0$, turning about $z$ at the rate $\Omega$, and evaluate it for 1 kg, 10 cm and $100\unit{s^{-1}}$.

::: solution
On the ring $x^2 + y^2 = a^2$, so the integral is $a^2L_z$ and the bracket is $-(2/c^2)a^2L_z$. With $L_z = \matter
Ma^2\Omega$ it is $-2\matter Ma^4\Omega/c^2$, here $-2.2\times10^{-19}\unit{kg\,m^2\,s}$.
:::

**[13.6]** Take $f = x^2 - y^2$. What does the shift along $X_f$ add to the spatial entries $\field h_{ij}$, and why
does no free ball feel it? Show that the charge $C_f$ of a body in equilibrium does not change.

::: solution
It adds $-2\lambda t\,\partial_i\partial_jf$, which is $-4\lambda t$ in the $xx$ entry, $+4\lambda t$ in the $yy$ entry
and zero elsewhere: a strain with no trace that grows with time. It is pure gauge, so the curvature, and with it every
tide, is unchanged (section 7.4). The rate is $\dd C_f/\dd t = -t\int\matter T^{ij}\partial_i\partial_jf\,\dd V =
-2t\int(\matter T^{xx} - \matter T^{yy})\,\dd V$, and von Laue's theorem makes each integral zero.
:::

**[13.6]** A state has energies in a band with $\Omega t = 1$. Through which power of $t$ must the series at $t = 0$
be taken to give $\langle A\rangle(t)$ within $10^{-6}\|A\|$? For two levels, write the history and say why it is
analytic.

::: solution
The error is at most $\|A\|/(n + 1)!$. Since $9! = 3.6\times10^5$ and $10! = 3.6\times10^6$, $n + 1 = 10$: the
series through $t^9$. With two levels, $\langle A\rangle(t) = a + b\cos(\Omega t + \varphi)$ for numbers $a$, $b$ and
$\varphi$, and a cosine equals its Taylor series at every time.
:::

### Stretch

**[13.6]** With sections 6.1 and 6.4: a ring of mass $\matter M$ spins about $z$ with angular momentum $S$. Show that in a frame
moving at a small speed $v$ along $x$ its centre of energy at one time is displaced along $y$ by $Sv/\matter Mc^2$.
Evaluate this for the Earth ($S = 5.86\times10^{33}\unit{J\,s}$, $\matter M = 5.97\times10^{24}$ kg) at
$30\unit{km\,s^{-1}}$, and Møller's largest displacement, $S/\matter Mc$.

::: solution
Two effects give half each. The moving frame weights a part by $E_a - vp_{a,x}$, so the centre moves by
$v\sum_a(-y_ap_{a,x})/\matter Mc^2 = vS/2\matter Mc^2$, since on a ring $\sum(-yp_x) = \sum xp_y = S/2$. And the moving
frame's instant $t' = 0$ is, at the place $x$, the rest frame's time $t = vx/c^2$ (section 6.1), by which a part at $x$
has moved along $y$ by $\Omega x\cdot vx/c^2$; the average of $x^2$ on the ring is $a^2/2$, which gives another
$vS/2\matter Mc^2$. The bracket checks the sum: $v\{\matter{Q_y}, \matter{Q_x}\}/\matter M = vS/\matter Mc^2$. For a
closed body, stresses included, the shift is exactly this at every speed, so $S/\matter Mc$ is approached as
$v \to c$. For the Earth $S/\matter Mc = 3.27$ m, and at
$30\unit{km\,s^{-1}}$ the shift is $0.328$ mm.
:::

**[13.6]** Put $h = x$ and $g = y$ into the bracket of the energy density of Dirac and Schwinger, at $c = 1$, and
carry out the two integrations by parts. Which bracket of two dipoles do you find?

::: solution
The term with $\matter{\vect J}(\vect y)$ gives $\int y\,J_x\,\dd V$ and the term with $\matter{\vect J}(\vect x)$
gives $-\int x\,J_y\,\dd V$, so $\{\matter{Q_x}, \matter{Q_y}\} = -\int(xJ_y - yJ_x)\,\dd V = -L_z$, Pryce's bracket
of the mass dipoles with $c = 1$.
:::

### The camera

**[13.6]** Take the moments of the energy, $\matter{Q_h} = \sum_aE_ah(\vect x_a)/c^2$, for free particles. Show that
$\matter{\dot Q_g} = \{\matter{Q_g}, H\} = \sum_a\vect p_a\cdot\nabla g(\vect x_a)$ exactly, find
$\{\matter{Q_h}, \matter{\dot Q_g}\}$, and show that as $c$ grows it becomes the commutator of section 8.2 divided by $i\hbar$,
$\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$.

::: solution
With $H = \sum_aE_a$ and $E\,\partial E/\partial\vect p = c^2\vect p$, the bracket of $E_ag/c^2$ with $E_a$ is
$(E_a/c^2)\nabla g\cdot\vect v_a = \vect p_a\cdot\nabla g$, with $\vect v_a = \partial E_a/\partial\vect p_a$. Each
derivative of the moment then gives one term: $\{\matter{Q_h}, \matter{\dot Q_g}\} = \sum_a[(E_a/c^2)\nabla
h\cdot\nabla g - (h/c^2)\,\vect v_a\cdot(\nabla\nabla g)\,\vect p_a]$ at the places $\vect x_a$. As $c$ grows,
$E_a/c^2$ tends to $\matter m_a$ and the second term falls as $1/c^2$, which leaves
$\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$.
:::
:::

::: paper
- [*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy) (Section XIII):
  the bracket of two moments and its two cases, the charges, Marolf, Jacobson and Nguyen, and the thermal and quantum
  forms.
- Appendix C, [*The moments and the weight*](/paper/#par:the-moments-and-the-weight): the proof of
  [the second section](#the-moments-and-the-energy-generate-everything-that-can-be-known-of-a-body).
- [*Open problems*](/paper/#sec:status): the full theory's algebra.
:::

::: deeper
- The [GR course, section 13.7](https://neovand.github.io/general-relativity/chapter-13.html#13-7-from-a-history-to-a-state-hamilton-s-equations)
  builds brackets from a history, and its
  [section 15.5](https://neovand.github.io/general-relativity/chapter-15.html#15-5-where-gravitational-energy-lives) and
  [section 20.4](https://neovand.github.io/general-relativity/chapter-20.html#20-4-four-equations-your-initial-photograph-must-already-obey)
  show why gravity's energy lives at the boundary.
- M. H. L. Pryce (1948) [@Pryce1948] compares the candidates for a relativistic body's centre.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, where the question is Marolf's
    ([*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy)).

[^order]: $\{F, G\} = \sum_a(\partial F/\partial\vect x_a\cdot\partial G/\partial\vect p_a - \partial F/\partial\vect
    p_a\cdot\partial G/\partial\vect x_a)$. Books that use the other order flip every sign below.

[^L]: Here $L$ is never 13.8's $L = \ln\SNR$, and $\ell_z$ below is a density, not a degree $\ell$.

[^H]: This $H$ is never 13.5's profile or 3.5's Wiener filter.

[^u]: 13.4's complex place keeps the letter $w$.

[^rank]: Computed numerically; with degrees one and two only, the rank is 8.

[^app]: First shown in *The gravitational camera* (Mohsenvand 2026), App. C
    ([*The moments and the weight*](/paper/#par:the-moments-and-the-weight)).

[^push]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equation
    [](/paper/#eq:push); the sum rule is [](/paper/#eq:sum-rule).

[^thermal]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equation
    [](/paper/#eq:thermal-moment); the quantum commutator is [](/paper/#eq:hair-commutator).

[^mb]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equation
    [](/paper/#eq:moment-bracket).

[^hs]: The octupolar bracket is [](/paper/#eq:hidden-spin) of *The gravitational camera* (Mohsenvand 2026).

[^QE]: This $\matter{Q_h}$ is Newton's moment plus $\sum_a(E_a - \matter m_ac^2)\,h(\vect x_a)/c^2$.

[^J]: As in 13.4, $\matter{\vect J}$ is $\sum_a\vect p_a$ per unit volume, for slow matter 2.8's mass flux
    $\matter\rho\vect v$: not 1.7's impulse.



[^moller]: Møller showed that a spinning body's centres of energy, over all frames, fill a disc of radius
    $S/\matter Mc$.

[^clock]: The motion generated by $\matter{Q_g}$ moves a part by $\dd\vect x_a/\dd\lambda = g\,\partial E_a/\partial
    \vect p_a/c^2 = g\vect v_a/c^2$, the delay that a potential gives a clock
    ([section 7.1](/tutorial/geometry/metric/#clocks-higher-up-run-faster-clocks-read-the-potential)).

[^c1]: Restoring $c$ turns $X_f$ into $(f/c)\,\partial_t + ct\,\nabla f\cdot\nabla$, and the commutator's $t^2$ into
    $c^2t^2$.

[^xi]: Here $\vect\xi$ is not 13.2's wavevector.

[^sign]: The same rule gives a motion $\vect\xi\cdot\nabla$ in space the charge $-P[\vect\xi]$. The next
    paragraph counts $P[\vect\xi]$ positive; with the sign used here, $\{\matter{Q_h}, \matter{Q_g}\}$ is the charge of
    $[X_h, X_g]$ itself, as in the Poincaré group. The overall sign of a charge is a convention.


