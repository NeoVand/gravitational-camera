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

**What you need:** chapters
[1.7](/tutorial/newton/hamilton/#every-quantity-generates-a-motion-and-a-symmetry-gives-a-constant) (brackets and
tides),
[4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)
(the tremor of a warm body),
[6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight) (energy has
weight), [8.2](/tutorial/quantum/operators/#two-moments-of-a-body-do-not-commute) (commutators),
[8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-bodys-correlations-still-contain-its-commutators) (the zero point)
and [13.4](/tutorial/what-a-field-keeps/flows-inside/#octupolar-tides-read-the-hidden-swirl) (the hidden swirl).

Imagine an instrument that reads two components of a spinning top's angular momentum, $L_x$ and $L_y$, and nothing
else. Two tops stand behind a wall, one with $\vect L = (1, 2, 0.5)\unit{J\,s}$ and the other with
$\vect L = (1, 2, -3)\unit{J\,s}$. No torque acts on either, so the instrument reads $L_x = 1$ and $L_y = 2$ for both,
to any precision and for as long as it watches. Now turn each top, stand and all, rigidly through a small angle about
the $x$ axis. The first top's $L_y$ falls by $0.5\unit{J\,s}$ per radian of the turn, and the second's rises by
$3\unit{J\,s}$ per radian. One turn reads what no amount of watching can.

The paper's [*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy) meets
this puzzle at its end, where it recalls that Donald Marolf "noted that it does not by itself let a classical
observer determine the interior from the boundary". So we ask: if the moments and the energy generate everything that
can be known of a body, why can an observer who only watches the field not learn the body's interior, and what changes
when the observer can push?

::: plain
You can learn about a body from outside in two ways. You can look, and read the numbers its field shows. Or you can
push the body a little, in a way set by one quantity, and see how much a second quantity changes. That change, per
unit of push, is the bracket of the two quantities.

An instrument that reads two parts of a top's spin cannot learn the third part, however long it looks. A small turn
about one axis changes the second part by an amount set by the third. Donald Marolf used this example.

A body's moments are sums of its masses, each weighted by a function of its place. Pushes made by the moments and the
energy can reveal the whole inside. Because energy has weight, two moments fail to commute: a push made by one changes
the other, by an amount set by how the matter inside flows.

A warm body pushes itself: its heat makes its moments jiggle, and the jiggles that the field shows measure the
brackets. In quantum mechanics this holds even at absolute zero, because no body is ever perfectly still.
:::

## Looking gives values; pushing gives brackets

Chapter 1.7 read the Poisson bracket two ways. As a rate, $\dot F = \{F, H\}$. And as a motion: any quantity $A$
**generates** a motion of the state, along which every quantity $B$ changes at the rate $\dd B/\dd\lambda = \{B, A\}$.
Run that motion for a small amount $\epsilon$, and

$$\delta B = \epsilon\,\{B, A\} + O(\epsilon^2) . \label{eq:response}$$

We call this the **bracket as a response**: $\{B, A\}$ is the change of $B$ per unit of the push that $A$ generates,
to first order. It is measured by an operation followed by a reading: apply the push, read $B$, and compare with a
copy left alone. We write the bracket in the same order as chapter 1.7 and the paper.[^order]

**The example.** Chapter 1.7 found that $L_z$ generates a turn about the $z$ axis by the angle $\lambda$. Relabelling
the axes, $L_x$ generates a turn about $x$: every position and every momentum moves as
$(y, z) \to (y - \epsilon z,\ z + \epsilon y)$, which is what turning the whole top by the angle $\epsilon$ does. The
angular momentum is built from them, so it turns in the same way, and its $y$ component changes by
$\delta L_y = -\epsilon L_z$. By [](#eq:response),

$$\boxed{\;\{L_y, L_x\} = -L_z ,\qquad \{L_x, L_y\} = L_z .\;}$$

Here $L_x$, $L_y$, $L_z$ are the components of $\sym{angular-momentum}{\vect L}$, in joule seconds.[^L] The unit checks:
each term of a bracket divides by a place times a momentum, a joule second. For the two tops and $\epsilon = 0.01$ rad,
to first order in $\epsilon$, $L_y$ becomes $1.995$ and $2.030\unit{J\,s}$, so $\delta L_y/\epsilon$ gives $-L_z$
(Figure [](#fig:bracket-response)).

**The non-example.** Without the turn, every function $f(L_x, L_y)$ of the readings is the same for the two tops, and
watching longer adds nothing: no torque acts, so $\{L_x, H\} = \{L_y, H\} = 0$.

**What it means.** The quantity $L_z$ is built from $L_x$ and $L_y$ by one bracket, but their values do not give it;
their response does. The paper's tides are pushes of the same kind: chapter
[1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside) found that a tide of profile $g$
changes the rate of another moment, $\matter{\dot Q_h}$, by
$\epsilon\int\sym{density}{\matter\rho}\,\nabla g\cdot\nabla h\,\dd V$, which, beyond linear profiles, the field
outside does not hold at any one time.

![Look first at the two short arrows on the right: the same turn moves the two tops' $L_y$ in opposite directions, by
$-L_z$ times the angle, although the camera on the left reads the same two numbers for both. The turn is drawn as 0.1
rad, ten times larger than the text's 0.01 rad, and the turned arrows are exact; the short arrows are the change of
$L_y$ per radian, to the scale of $\vect L$.](tut-bracket-response){#fig:bracket-response}

## The moments and the energy generate everything that can be known of a body

We want the paper's Appendix C, [*The moments and the weight*](/paper/#par:the-moments-and-the-weight): a quantity whose
bracket with every harmonic moment and with the energy vanishes is a constant. This is what "generate everything"
means: every other quantity changes under some push. We assume that **the body is $N$ masses
$\matter m_a$ at different places $\vect x_a$**, with momenta $\vect p_a$, and that **the forces come from a
potential energy $V$ of the places alone**, so that $\sym{hamiltonian}{H} = \sum_a|\vect p_a|^2/2\matter m_a + V$.[^H]
The moments are Newton's, $\sym{mass-moment}{\matter{Q_h}} = \sum_a\matter m_ah(\vect x_a)$, with $h$ harmonic in
the body.

**Step 1: the gradients of harmonic functions at the $N$ places take every value.** We need this because the push
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

**A number and a limit.** For five random places the 15 harmonic polynomials of degrees one to three give gradient
lists of rank $15 = 3N$.[^rank] For $N = 1$ the linear function $h = \vect k_1\cdot\vect x$ does it alone.

**Step 2: a quantity that commutes with every moment does not depend on the momenta.** A moment has no momenta, so by
chapter 1.7's bracket

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

**Step 4: the impulses give every momentum.** The paper's [](/paper/#eq:push), derived in
[the next section](#an-impulsive-tide-and-a-weighing-read-a-bracket-taken-twice), gives the energy that a tide leaves.
Its odd part, half the difference of the gains of two copies kicked by $\pm\epsilon$, divided by $\epsilon$, is
$\matter{\dot Q_g} = \sum_a\vect p_a\cdot\nabla g(\vect x_a)$. For the $3N$ profiles of step 1 these fix the $3N$
components of the momenta, once the places are known, and pairs of tides read the places through the density (chapter
[13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple)).

**What it means.** The moments kick every momentum, and their rates $\matter{\dot Q_h} = \{\matter{Q_h}, H\}$ move
every place, both in any direction. In the paper's words, "the moments and the weight, all of them measured outside,
generate all that can be determined of the body; the moments alone leave every function of position undetermined".

## An impulsive tide and a weighing read a bracket taken twice

Chapter 1.7 found that an impulsive tide of profile $g$ and strength $\sym{impulse-strength}{\epsilon}$ is the motion
generated by $\matter{Q_g}$, run backward by $\epsilon$. Running it backward flips the order of the bracket in
[](#eq:response), so that any quantity changes by

$$\Delta F = \epsilon\{\matter{Q_g}, F\} + \frac{\epsilon^2}{2}\{\matter{Q_g}, \{\matter{Q_g}, F\}\} + \dots$$

For $F = H$ the first bracket is the energy's response, $\{\matter{Q_g}, H\} = \matter{\dot Q_g}$. The second is the
response of that response, $\{\matter{Q_g}, \matter{\dot Q_g}\} = \int\matter\rho\,|\nabla g|^2\,\dd V$.
It depends on the places alone, so its bracket with $\matter{Q_g}$ is zero, and the series stops:

{{paper eq:push}}

This is the paper's "response taken twice", exact in Newton's mechanics for that reason. Chapter
[4.5](/tutorial/response/causality/#a-blow-holds-every-frequency-and-the-energy-it-leaves-is-the-same-total) found the
same integral as the response added up over all frequencies, the paper's [](/paper/#eq:sum-rule), which its
[](/paper/#eq:push) gives "in time instead of frequency". A weighing reads the gain, because the energy gained raises
the mass by $\Delta E/c^2$, and in the average of the gains of two copies kicked by $+\epsilon$ and $-\epsilon$ the
first term cancels.

**A number.** For the steel ball a metre across, of 4110 kg and radius $R = 0.5\unit{m}$, and
$g = \tfrac12(x^2 - y^2)$, the second bracket is the moment of inertia about $z$, three fifths of a thin shell's
$\tfrac23\matter MR^2$: $411\unit{kg\,m^2}$ against $685\unit{kg\,m^2}$. Chapter 1.7's tonne, passing 1.5 m from the
ball's centre at $44\unit{km\,s^{-1}}$, makes a tide of about this shape with
$\epsilon = 1.35\times10^{-12}\unit{s^{-1}}$. The ball at rest gains $\tfrac12\epsilon^2\times411\unit{kg\,m^2} =
3.7\times10^{-22}\unit{J}$, and the scale reads $4\times10^{-39}\unit{kg}$ more.

**The quantum body.** With chapter 8.2's commutator, $i\hbar$ times the bracket (the paper's
[](/paper/#eq:hair-commutator)), the impulse $U = e^{i\epsilon\matter{Q_g}/\hbar}$ gives the paper's
[](/paper/#eq:push) line for line.

::: try {#phase-space}
The figure is chapter 1.7's cart on a spring. Use this prediction, not the figure's own: at the end of its swing the
cart is at rest, so the first response, $\epsilon\matter{\dot Q_g}$, is zero there. Does a kick at that instant still
leave energy? Press *Pause* and drag the point round its ellipse to where $p = 0$, or reach it with Tab and the arrow
keys. Choose *Tidal, g = ½x²* under *The tide*, press *Kick*, and read *The last kick*.
:::

## Heat and the zero point push a body themselves

A watcher who cannot push can still read brackets if the body pushes itself. In a warm body every part jiggles, so
its moments and their rates jiggle, and the field outside shows the jiggles. For any quantity $A$ of the body, the
average over the Boltzmann weight $e^{-H/\kB T}$ of chapter 4.2, written $\langle\cdot\rangle$, obeys

$$\langle A\,\{\matter{Q_g}, H\}\rangle = \kB T\,\langle\{\matter{Q_g}, A\}\rangle ,$$

with $\kB$ Boltzmann's constant and $T$ the temperature. The box below proves it. With $A = \matter{\dot Q_h}$ the left
side is the mean product of two rates, which watching alone measures, and the bracket on the right is 1.7's:

$$\boxed{\;\langle\matter{\dot Q_h}\matter{\dot Q_g}\rangle = \kB T\,\langle\{\matter{Q_g}, \matter{\dot Q_h}\}\rangle = \kB T\,\Bigl\langle\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V\Bigr\rangle .\;}$$

This is the paper's [](/paper/#eq:thermal-moment), which chapter 4.2 found by averaging the velocities. In the paper's
words, "the temperature stands where $\hbar$ stands".

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

With $A = \matter{Q_h}$ and $B = \matter{\dot Q_g}$, the paper's [](/paper/#eq:hair-commutator) gives
$\mathrm{Im}\langle\matter{Q_h}\matter{\dot Q_g}\rangle = \tfrac12\hbar\,\langle\int\matter\rho\,\nabla h\cdot\nabla
g\,\dd V\rangle$ in every state, the ground state included: chapter 8.7's zero point. A watcher reads this part too,
since chapter
[8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give) found the
commutator in the difference between the body's power to absorb energy and to emit it. A cold classical body is at
rest and its correlations hold nothing. In the paper's words, "the correlations of a quantum state contain its
commutators, and a cold classical body's do not".

**What it means.** This is half of the answer to the chapter's question: an observer who only watches a warm body, or
any quantum body, still measures brackets, because the body pushes itself.

## To order 1/c², the moments of the energy do not commute

In Newton's theory every moment is a function of the places alone, and any two functions of the places have the
bracket zero. Energy has weight (chapter 6.4), so to a first approximation the field reports the moments of the
energy, which have brackets among themselves that weigh the flow:

$$\sym{energy-moment}{\matter{Q_h}} = \frac{1}{c^2}\sum_aE_a\,h(\vect x_a), \qquad E_a = \sqrt{\matter m_a^2c^4 + |\vect p_a|^2c^2} ,$$

with $\sym{energy}{E_a}$ the energy of part $a$ in joules, so that $\matter{Q_h}$ is in kilograms times the unit of
$h$.[^QE] From here on $\matter{Q_h}$ means this moment of the energy; the earlier sections used Newton's. We want
their bracket, and assume first that **the parts are free**.

For one particle, $E$ depends on the momentum alone. So the derivatives of $Eh$ are $E\nabla h$ with respect to the
place and $h\,\partial E/\partial\vect p$ with respect to the momentum, and chapter 1.7's bracket gives

$$\{Eh, Eg\} = E\nabla h\cdot g\frac{\partial E}{\partial\vect p} - h\frac{\partial E}{\partial\vect p}\cdot E\nabla g = E\,\frac{\partial E}{\partial\vect p}\cdot(g\nabla h - h\nabla g) .$$

Differentiating $E^2 = |\vect p|^2c^2 + \matter m^2c^4$ gives $E\,\partial E/\partial\vect p = c^2\vect p$, which is
6.4's $\vect p = E\vect v/c^2$. Parts that differ have the bracket zero. We sum and divide by $c^4$:

$$\boxed{\;\{\matter{Q_h}, \matter{Q_g}\} = \frac{1}{c^2}\sum_a\vect p_a\cdot(g\nabla h - h\nabla g)(\vect x_a) .\;}$$

With the density of momentum $\sym{mass-flux}{\matter{\vect J}}$ in place of the sum over parts,[^J] this is the
paper's equation, exact for free particles:

{{paper eq:moment-bracket}}

As $c$ grows the bracket falls as $1/c^2$, and Newton's moments commute again. **Units:** for $h$ and $g$ in square
metres the bracket is in $\mathrm{kg\,m^2\,s}$, which is $(\mathrm{kg\,m^2})^2$ divided by a joule second.

**Forces.** Let the forces not depend on velocity, and add to each $E_a$ a share $V_a$ of the potential energy (half
of each spring's energy to each end, say). The shares depend on the places alone, so they commute with one another. A
cross term of a share with a kinetic part keeps the $1/c^4$ of the two moments, since a share has no momentum to
supply $E\,\partial E/\partial\vect p = c^2\vect p$: it is smaller than the box by about
$V_a/\matter m_ac^2$.[^numcheck]

**What the field reports.** At this order the field reports more than the moments of the energy. Luc Blanchet and
Thibault Damour found that to order $1/c^2$ a body's mass moments are those of $\sigma = (T^{00} + T^{ii})/c^2$, plus
terms built from time derivatives (*Ann. Inst. Henri Poincaré A* 50, 377, 1989), with $T^{00}$ the density of energy
and $T^{ii}$ the sum of the three normal stresses, in joules per cubic metre. So the moments weigh the stresses too,
and only the mass is spared, because in a body in equilibrium the stresses add up to zero (von Laue's theorem). A
tide weighs a part in the same way: in its potential $\Phi$ a moving part's energy changes by
$\Phi(E_a + \vect p_a\cdot\vect v_a)/c^2$, its share of $\sigma$. The paper's [](/paper/#eq:moment-bracket) holds
for the moments of the energy; what the field reports, and what a tide generates, differ from them at the same order.
We state this without proof.

**Check 1: two dipoles.** For $h = x$ and $g = y$, $g\nabla h - h\nabla g = (y, -x, 0)$, and $\vect p\cdot(y, -x, 0) =
-(xp_y - yp_x)$, so

$$\{\matter{Q_x}, \matter{Q_y}\} = -\frac{L_z}{c^2} ,$$

the bracket of the mass dipoles that the paper credits to Maurice Pryce [@Pryce1948]. For a body at rest with spin
$S_z$ about its centre it is $-S_z/c^2$, in kilogram seconds, and it makes the body's centre of energy depend on the
frame. Run for the amount $v$, the motion generated by $\matter{Q_x}$ kicks each momentum by $-vE_a/c^2$ along $x$,
as a change to a frame moving at the small speed $v$ along $x$ does (chapter 6.1). So the centre of energy,
$\matter{Q_y}/\matter M$, moves by $v\{\matter{Q_y}, \matter{Q_x}\}/\matter M = vS_z/\matter Mc^2$.[^moller]

**Check 2: two quadrupoles.** For $h = x^2 - y^2$ and $g = 2xy$, the gradients are $(2x, -2y, 0)$ and $(2y, 2x, 0)$,
and

$$g\nabla h - h\nabla g = 2(x^2 + y^2)\,(y, -x, 0) .$$

With the **density of angular momentum** about $z$, $\sym{angular-momentum-density}{\ell_z} = xJ_y - yJ_x$, in
$\mathrm{kg\,m^{-1}\,s^{-1}}$, whose integral is $L_z$,

$$\boxed{\;\{\matter{Q_{x^2-y^2}}, \matter{Q_{2xy}}\} = -\frac{2}{c^2}\int(x^2 + y^2)\,\ell_z\,\dd V .\;}$$

This is, in the paper's words, "a moment of the flow that the exterior field does not hold".

**A number.** Take chapter 13.4's hidden swirl: a uniform sphere of mass $\sym{mass}{\matter M}$ and radius $R$, whose
inner ball, out to $a = 2^{-1/5}R$, turns about $z$ at the rate $\Omega$ and the rest at $-\Omega$, so that $L_z = 0$.
In a layer turning at $\sym{layer-rate}{\Omega(r)}$, $\ell_z = \matter\rho\,\Omega(r)\,\varpi^2$, with $\varpi$ the
distance from the axis. With 13.4's $\int\matter\rho\,\varpi^4\,\dd V = \tfrac{8}{35}\matter MR^4$, the rigid ball
gives $-2\Omega\int\matter\rho\,\varpi^4\,\dd V/c^2 = -\tfrac{16}{35}\matter M\Omega R^4/c^2$, and 13.4's split into
the two parts multiplies this by $2a^7/R^7 - 1 = 2^{-2/5} - 1$:

$$\{\matter{Q_{x^2-y^2}}, \matter{Q_{2xy}}\} = \tfrac{16}{35}\bigl(1 - 2^{-2/5}\bigr)\frac{\matter M\Omega R^4}{c^2} = 0.111\,\frac{\matter M\Omega R^4}{c^2} ,$$

not zero, although $L_z$ is. For the 4110 kg ball turning at $\Omega = 100\unit{s^{-1}}$ it is
$3.2\times10^{-14}\unit{kg\,m^2\,s}$, so a push of the tonne's strength generated by $\tfrac12\matter{Q_{x^2-y^2}}$
would change $\matter{Q_{2xy}}$ by $2\times10^{-26}\unit{kg\,m^2}$, two parts in $10^{29}$ of $\matter MR^2$. The
bracket is half of 13.4's octupolar bracket of two rates, the paper's [](/paper/#eq:hidden-spin), divided by $c^2$:
for every flow, 13.4's integrand $\matter{\vect J}\cdot[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h]$, with
$h + ig = (x + iy)^3/3$, has the vector $-4\varpi^2(-y, x, 0)$, twice the one here.

{{paper fig:hidden-flow}}

**What it means.** To the same first approximation an impulsive tide is the motion generated by this $\matter{Q_g}$,
run backward. It kicks each part, changing its weight, and delays its clock by $\epsilon g/c^2$;[^clock] both changes
go with the momenta, so the bracket weighs the flow.

## In general relativity the moments are charges of motions that do not close

This section asks whether the moments are charges of motions of spacetime, and whether matter's bracket supplies the
algebra those motions lack. We measure time in metres here, so that $c = 1$.[^c1] A
**vector field** is a direction of motion given at every event: the operator $a\,\partial_t + \vect b\cdot\nabla$,
with $a$ and $\vect b$ functions of $(t, \vect x)$, moves each event by $(\lambda a, \lambda\vect b)$. The paper's
fields, with $f$ harmonic, are

$$\sym{moment-field}{X_f} = f\,\partial_t + t\,\nabla f\cdot\nabla .$$

For $f = 1$, $X_1 = \partial_t$ is the shift in time. For $f = x$, $X_x = x\,\partial_t + t\,\partial_x$ is the boost
along $x$ of chapter 6.1, which by a small rapidity $\lambda$ moves $t$ by $\lambda x$ and $x$ by $\lambda t$.

The **commutator of two vector fields**, $[X, Y] = XY - YX$, measures how two small motions fail to undo each other:
an event moved by $X$, then $Y$, then $X$ backward and $Y$ backward, each for a small $\lambda$, misses its start by
an amount of order $\lambda^2$ along $[X, Y]$. On a function $\phi(t, \vect x)$ the second derivatives cancel, and
what is left is again a vector field. We write $\phi_t$ for $\partial_t\phi$, so that $X_g\phi =
g\,\phi_t + t\,\nabla g\cdot\nabla\phi$, and apply $X_f$ to this with the product rule:

$$\begin{aligned}
X_fX_g\phi ={}& fg\,\phi_{tt} + f\,\nabla g\cdot\nabla\phi + t\,(f\nabla g + g\nabla f)\cdot\nabla\phi_t\\
&+ t\,(\nabla f\cdot\nabla g)\,\phi_t + t^2\,\partial_if\,\partial_jg\,\partial_i\partial_j\phi + t^2\,\partial_if\,\partial_i\partial_jg\,\partial_j\phi .
\end{aligned}$$

The first, third, fourth and fifth terms do not change when $f$ and $g$ are exchanged, so they cancel in $X_fX_g\phi -
X_gX_f\phi$, which leaves

$$\boxed{\;[X_f, X_g] = (f\nabla g - g\nabla f)\cdot\nabla + t^2\bigl[(\nabla\nabla g)\nabla f - (\nabla\nabla f)\nabla g\bigr]\cdot\nabla ,\;}$$

with $\nabla\nabla g$ the table of second derivatives of $g$, 13.4's Hessian. A family of vector fields **closes** if
the commutator of any two of its members is again a combination of members.

**Checks.** For $f = x$, $g = y$ the Hessians vanish and $[X_x, X_y] = x\,\partial_y - y\,\partial_x$, chapter 1.7's
turn about $z$: two boosts combine into a turn, as chapter
[6.1](/tutorial/relativity/lorentz/#a-boost-can-point-in-any-direction) found. For $f = 1$,
$[\partial_t, X_g] = \nabla g\cdot\nabla$, a translation when $g$ is linear.

**Higher degrees.** For $f = x^2 - y^2$ and $g = 2xy$ the box gives $[2(x^2 + y^2) + 8t^2]\,(x\,\partial_y -
y\,\partial_x)$. It has no part along $\partial_t$, so it is no $X_k$ except $X_0 = 0$, and its components are cubic
in the place, so it is no rotation either. In the paper's words, "those of higher degree do not close under
the bracket of vector fields".

**Stated.** Geoffrey Compère, Roberto Oliveri and Ali Seraj define a gravitating body's mass moments as the
**charges** of these transformations, the quantities that Noether's construction attaches to them, read on a sphere
outside the body, which match Kip Thorne's mass moments [@CompereOliveriSeraj2018]. They leave open
whether the fields of degree two and higher close under some modified bracket. We state this without proof.

**The link.** For a field $\vect\xi\cdot\nabla$ in space, the charge is the momentum carried along it,[^xi]
$P[\vect\xi] = \int\matter{\vect J}\cdot\vect\xi\,\dd V$, which is $L_z$ for the turn $(-y, x, 0)$. At $t = 0$ the
charge of $X_f$ is the moment $\matter{Q_f}$. In the **Poincaré group** (the shifts in time and space, the turns and
the boosts), $[X_x, X_y]$ is the turn, whose charge is $L_z$, while $\{\matter{Q_x}, \matter{Q_y}\} = -L_z$. The
boxed brackets show that the same rule holds at every degree:

$$\{\matter{Q_h}, \matter{Q_g}\} = -P\bigl[h\nabla g - g\nabla h\bigr] ,$$

minus the charge of $[X_h, X_g]$ at $t = 0$, where the $t^2$ term vanishes. So the bracket of two moments is not a
moment but a moment of the flow: matter supplies, to order $1/c^2$, a bracket for charges whose fields do not close
(Figure [](#fig:moment-algebra)).
Paul Dirac and Julian Schwinger found the bracket of the energy density $T^{00}$ at two points that Poincaré
invariance requires [@Dirac1962; @Schwinger1963]. In this chapter's order it is

$$\{T^{00}(\vect x), T^{00}(\vect y)\} = -\bigl[\matter{\vect J}(\vect x) + \matter{\vect J}(\vect y)\bigr]\cdot\nabla_{\vect x}\,\delta(\vect x - \vect y) ,$$

with $\delta$ Dirac's delta function. Multiplied by $h(\vect x)g(\vect y)$ and integrated over both points, it gives
the paper's [](/paper/#eq:moment-bracket) after one integration by parts. We state it without proof. The paper's
[*Open problems*](/paper/#sec:status) lists the full theory's algebra as open.

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

**The algebra holds the interior.** Donald Marolf made the argument in perturbative quantum gravity, the quantum
theory of small ripples of spacetime, and noted that it recasts in classical terms [@Marolf2009]. Whatever happens
inside sends signals that reach the boundary, so the boundary readings over all time hold the interior. The energy $H$
is a boundary observable, so the rate $\{A, H\}$ of any boundary observable $A$ is in the algebra, and so, formally
(without asking whether the series converges), are its later values:

$$A(t) = A + t\{A, H\} + \frac{t^2}{2}\{\{A, H\}, H\} + \dots$$

He states that the Poisson algebra generated by the fields on future null infinity (the far sphere where outgoing
light arrives) near its earliest part, spatial infinity, contains a **complete set of observables**, enough to fix the
state. He requires it to be closed under the finite motions that its members generate: pushes. In Newton's
mechanics the corresponding statement, as the paper calls it, is the
[second section's theorem](#the-moments-and-the-energy-generate-everything-that-can-be-known-of-a-body).

**Values do not give brackets.** Marolf named this gap himself, with the generators of turns, his $J_x$, $J_y$,
$J_z$, which the tops picture. The third is the bracket of the other two, yet at the classical level "the ability to
measure $J_x$ and $J_y$ imparts no knowledge of $J_z$". Only in quantum theory, he wrote, can alternating measurements
of the two give information about the third, and chapter
[8.2](/tutorial/quantum/operators/#two-quantities-that-do-not-commute-cannot-both-be-sharp)'s
$\Delta L_x\,\Delta L_y \ge \tfrac12\hbar\,|\langle L_z\rangle|$ says why: a sharp reading of $L_x$ spreads $L_y$ by
an amount set by $L_z$, so a quantum measurement is itself a push. A later paper finds
the same **holography of information**, the boundary at one time holding everything inside, in a model in anti-de
Sitter space, a curved spacetime with a boundary, and traces it to Gauss's law together with the entanglement of the
quantum vacuum (the Reeh–Schlieder theorem), so that it is purely quantum [@Marolf2014].

**The series misses histories that are not analytic.** Ted Jacobson and Phuc Nguyen traced the classical failure to a
lack of analyticity in time [@JacobsonNguyen2019]. A function of time is **analytic** if, round every time, it equals
its Taylor series, and a history need not be. Let a reading be

$$A(t) = e^{-1/t^2} \text{ for } t > 0, \qquad A(t) = 0 \text{ for } t \le 0 .$$

Its derivatives for $t > 0$ are $A' = (2/t^3)\,e^{-1/t^2}$, $A'' = (4/t^6 - 6/t^4)\,e^{-1/t^2}$, and so on: each is a
polynomial in $s = 1/t$ times $e^{-s^2}$, which falls faster than any power of $s$ grows. Every derivative at $t = 0$
is therefore zero, and so is the series for all time, while $A(1) = e^{-1} = 0.37$ (Figure [](#fig:analytic-pulse)).
Their own example is a bump on a
wave that has not yet reached the place read, where the series gives zero. In quantum mechanics, they show,
expectation values in states whose energies lie below some bound are analytic in time, so the derivatives at one time
fix the values at all times. We state this without proof.

![Look first at the dashed line: the Taylor series at $t = 0$ of $e^{-1/t^2}$ is zero, yet the function rises. A
reading whose every bracket with the energy vanishes at one time may still change later. The curve is exact; the strip
below is schematic.](tut-analytic-pulse){#fig:analytic-pulse}

**The paper's answer.** Marolf's limit, in the paper's words, "holds for an observer who only measures the field. An
observer who can apply a tide measures brackets, since the bracket of two quantities is the response of the first to
an impulse generated by the second." That closes the first gap: one turn of 0.01 rad reads the hidden $L_z$ of the two
tops, and a warm body or a quantum state pushes itself
([*Heat and the zero point*](#heat-and-the-zero-point-push-a-body-themselves)). This chapter adds a remark of its own
on the second gap: a push followed by a weighing needs no series, because the energy gained at the push is conserved
and can be read at any later time.

**What it means.** Classical physics keeps one part of the holography of information: an operation followed by a
reading.[^h138]

::: try {#marolf-top}
Predict first: two tops have the same $L_x$ and $L_y$ and different $L_z$. You may watch them for as long as you like,
or give each a small turn about $x$. Which tells you $L_z$? And does the exact turn's $\delta L_y/\epsilon$ approach
$-L_z$ from above or from below as $\epsilon$ shrinks? In *A top*, set the slider $L_z$ to 0.5 J s, press *Watch for ten
seconds* and read *What the field reads*. Then press *Turn by ε about x* and compare the two readouts beside it. Set the
slider $L_z$ to −3, turn again, and step *The angle of the turn, ε* down. Last, choose *The hidden swirl* and move
*Radius of the inner ball* from "no angular momentum" to "zero bracket", watching the angular momentum and the bracket.
:::

::: check
### Q

Why does a warm body need no push?

### A

Its heat jiggles its moments, and the mean product of two rates, which watching measures, is $\kB T$ times their
bracket.

### Q

What does an instrument that reads only $L_x$ and $L_y$ learn about $L_z$, however long it watches?

### A

Nothing: it needs the response of one to a turn generated by the other, $\delta L_y = -\epsilon L_z$.

### Q

For two dipole moments of the energy, what is the bracket of a body at rest with spin $S_z$? And for the 4110 kg ball's
hidden swirl at $100\unit{s^{-1}}$, what is the quadrupoles' bracket?

### A

$-S_z/c^2$, in kilogram seconds, and $3.2\times10^{-14}\unit{kg\,m^2\,s}$.
:::

**The idea to keep: a bracket is the response of one quantity to a push generated by another, so watching gives
values and pushing gives brackets. The moments and the energy generate everything that can be known of a body, so an
observer reads its interior by pushing, or by watching a body whose heat or zero point pushes itself.**

::: problems
### Practice

Find $\{\matter{Q_{x^2-y^2}}, \matter{Q_{2xy}}\}$ for a thin ring of mass $\matter M$ and radius $a$ in the plane
$z = 0$, turning about $z$ at the rate $\Omega$, and evaluate it for 1 kg, 10 cm and $100\unit{s^{-1}}$.

::: solution
On the ring $x^2 + y^2 = a^2$, so the integral is $a^2L_z$ and the bracket is $-(2/c^2)a^2L_z$. With $L_z = \matter
Ma^2\Omega$ it is $-2\matter Ma^4\Omega/c^2$, here $-2.2\times10^{-19}\unit{kg\,m^2\,s}$.
:::

### Stretch

With chapters 6.1 and 6.4: a ring of mass $\matter M$ spins about $z$ with angular momentum $S$. Show that in a frame
moving at a small speed $v$ along $x$ its centre of energy at one time is displaced along $y$ by $Sv/\matter Mc^2$.
Evaluate this for the Earth ($S = 5.86\times10^{33}\unit{J\,s}$, $\matter M = 5.97\times10^{24}$ kg) at
$30\unit{km\,s^{-1}}$, and Møller's largest displacement, $S/\matter Mc$.

::: solution
Two effects give half each. The moving frame weights a part by $E_a - vp_{a,x}$, so, divided by the total energy
$\matter Mc^2$, the centre moves by $v\sum_a(-y_ap_{a,x})/\matter Mc^2 = vS/2\matter Mc^2$, since on a ring
$\sum(-yp_x) = \sum xp_y = S/2$. And the moving frame's instant $t' = 0$ is, at the place $x$, the rest frame's time
$t = vx/c^2$ (chapter 6.1), by which a part at $x$ has moved along $y$ by $\Omega x\cdot vx/c^2$; the average of $x^2$
on the ring is $a^2/2$, which gives another $vS/2\matter Mc^2$. The bracket checks the sum:
$v\{\matter{Q_y}, \matter{Q_x}\}/\matter M = vS/\matter Mc^2$. For a closed body, stresses included, the shift is
exactly $Sv/\matter Mc^2$ at every speed, so $S/\matter Mc$ is approached as $v \to c$; a bare ring of particles
falls short at high speed. For the Earth $S/\matter Mc = 3.27$ m, and at
$30\unit{km\,s^{-1}}$ the shift is $0.328$ mm.
:::

### The paper

Take the moments of the energy, $\matter{Q_h} = \sum_aE_ah(\vect x_a)/c^2$, for free particles. Show that
$\matter{\dot Q_g} = \{\matter{Q_g}, H\} = \sum_a\vect p_a\cdot\nabla g(\vect x_a)$ exactly, find
$\{\matter{Q_h}, \matter{\dot Q_g}\}$, and show that as $c$ grows it becomes the paper's
[](/paper/#eq:hair-commutator) divided by $i\hbar$, $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$.

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
  the paper's [](/paper/#eq:moment-bracket) and its two cases, the charges, Marolf, Jacobson and Nguyen, and the
  thermal and quantum forms.
- Appendix C, [*The moments and the weight*](/paper/#par:the-moments-and-the-weight): the proof of
  [the second section](#the-moments-and-the-energy-generate-everything-that-can-be-known-of-a-body).
- [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing): the paper's
  [](/paper/#eq:push) as the sum rule in time.
- [*Open problems*](/paper/#sec:status): the full theory's algebra.
:::

::: deeper
- The [GR course, section 13.7](https://neovand.github.io/general-relativity/chapter-13.html#13-7-from-a-history-to-a-state-hamilton-s-equations)
  builds brackets from a history, and its
  [section 15.5](https://neovand.github.io/general-relativity/chapter-15.html#15-5-where-gravitational-energy-lives) and
  [section 20.4](https://neovand.github.io/general-relativity/chapter-20.html#20-4-four-equations-your-initial-photograph-must-already-obey)
  show why the energy of gravity lives at the boundary.
- M. H. L. Pryce (1948) [@Pryce1948] compares the candidates for a relativistic body's centre.
:::

[^order]: $\{F, G\} = \sum_a(\partial F/\partial\vect x_a\cdot\partial G/\partial\vect p_a - \partial F/\partial\vect
    p_a\cdot\partial G/\partial\vect x_a)$, the order of the paper's Appendix C. Books that use the other order flip
    every sign below.

[^L]: Here $L$ is never Section XII's $L = \ln\SNR$, and $\ell_z$ below is a density, not a degree $\ell$.

[^H]: This $H$ is never 13.5's profile, Section XII's bits or 3.5's Wiener filter.

[^u]: The paper's Appendix C writes $\vect w_a$; this chapter keeps $w$ for 13.4's complex place.

[^rank]: Computed numerically; with degrees one and two only, the rank is 8.

[^QE]: This $\matter{Q_h}$ is Newton's moment plus $\sum_a(E_a - \matter m_ac^2)\,h(\vect x_a)/c^2$, which vanishes as
    $c$ grows.

[^J]: As in 13.4, $\matter{\vect J}$ is $\sum_a\vect p_a$ per unit volume, for slow matter 2.8's mass flux
    $\matter\rho\vect v$: not 1.7's impulse, nor Section IV's current column.

[^numcheck]: Checked with five random particles, masses and places near one: brackets by finite differences agree
    with the box within one part in $10^9$, and with springs the difference times $c^4$ is 37.9 at $c = 30$ and 38.0
    at $c = 300$.

[^moller]: Christian Møller showed that a spinning body's centres of energy, over all frames, fill a disc of radius
    $S/\matter Mc$: 3.27 m for the Earth (the stretch problem).

[^clock]: The motion generated by $\matter{Q_g}$ moves a part by $\dd\vect x_a/\dd\lambda = g\,\partial E_a/\partial
    \vect p_a/c^2 = g\vect v_a/c^2$, the delay that a potential gives a clock
    ([chapter 7.1](/tutorial/geometry/metric/#clocks-higher-up-run-faster-clocks-read-the-potential)).

[^c1]: Restoring $c$ turns $X_f$ into $(f/c)\,\partial_t + ct\,\nabla f\cdot\nabla$, and the commutator's $t^2$ into
    $c^2t^2$.

[^xi]: Here $\vect\xi$, a field of directions, and the letter $P$ are local to this section; $\vect\xi$ is not 13.2's
    wavevector.

[^h138]: Chapter 13.8 takes up the holography of information.
