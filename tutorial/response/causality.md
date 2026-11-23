---
id: '4.5'
title: 'Response, causality and sum rules'
question: 'How can the rule that an effect cannot come before its cause fix a total, the friction of a body added up over all frequencies?'
part: '4'
requires: ['1.7', '2.3', '2.6', '4.1', '4.4']
paper: [sec:near-field, eq:sum-rule, sec:second-order, eq:dust, sec:thermal, eq:friction-sum, eq:glow-bound, eq:push, sec:hole, eq:hole-sum-rule, eq:jitter-bounds]
figures: [fig:hole-response]
live: []
depth: B
---

The paper's plain words on heat, in Section VI, name a principle: "an effect cannot come before its cause". It "fixes
the total friction of a material, added up over all frequencies", so that the friction "can be spread out or bunched
together, but its total cannot exceed this fixed amount". Section IV, in
[*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals), adds up a body's answer to a tide in the
same way,

{{paper eq:sum-rule}}

and says that "the friction and the stiffness of the body spread the response over frequency but cannot change its
total". Chapter 4.1 drew this answer for a cart as a
[line of power](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push), and
chapter 4.4 called the total friction of a liquid its
[weight](/tutorial/response/viscosity/#maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast).

So we ask how a rule about the order of events in time can fix a total over frequencies. The answer matters twice in
the paper: the total friction of a material caps its glow, and the total answer to a tide lets a tide applied from
outside weigh how far out a body's mass lies.[^letters]

::: plain
Push a body gently and it answers in proportion to the push. When the push rises and falls, the answer has two parts.
One part stores the work of the push and gives it back, like a spring. The other part turns the work into heat, and
that part is the friction. The answer can never come before the push. This rule, causality, ties the two parts
together: if you know the friction at every frequency, you can work out the springiness at every frequency.

At the two ends of the range of frequencies, the tie becomes two totals. A very slow push meets the body's springs. A
very fast push meets only its mass, because the springs have no time to act, so any body that is shaken fast enough
moves like a cloud of loose dust. So the friction, added up over all frequencies with the right weights, is fixed by
the springs at one end and by where the mass lies at the other. Friction and stiffness can move the friction from one
frequency to another, but they cannot change these totals.
:::

## A linear response adds up the answers to every earlier push

We want the general form of a response, of which 4.1's cart is one example. A push $F(t)$ acts on a body, and we watch
one quantity $y(t)$ that it moves: the cart's place, a moment of the body's mass, or a stress in a material. We assume
that **the response is linear** (the answer to a sum of pushes is the sum of their answers, as for any body in
equilibrium under a small enough push) and that **the body does not change with time** (a blow given an hour later
gives the same answer an hour later).

As chapter 4.1 did, we cut the push into small blows. The blow between $t'$ and $t' + \dd t'$
has the impulse $F(t')\,\dd t'$. By the second assumption its answer depends only on the time since the blow, so it is
$\chi(t - t')\,F(t')\,\dd t'$, where $\chi(t)$ is the
[impulse response](/tutorial/response/oscillator/#the-answer-to-a-single-blow-comes-after-the-blow), the answer to a
blow of unit impulse at $t = 0$. By the first assumption the answers add:

$$y(t) = \int_{-\infty}^{\infty}\chi(t - t')\,F(t')\,\dd t' . \label{eq:linear}$$

An answer of this form is a **linear response**, and $\chi(t)$ is its kernel, in the unit of $y$ per unit of impulse.
**Causality** is the rule that nothing answers before it is pushed: $\chi(t) = 0$ for $t < 0$. So the transform in
time, in the paper's convention of
[chapter 2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time),
starts at zero:

$$\chi(\omega) = \int_0^\infty\chi(t)\,e^{i\omega t}\,\dd t . \label{eq:transform}$$

By the [convolution theorem](/tutorial/outside/fourier/#a-blur-multiplies-each-ripple-by-a-number) each frequency of
the push comes out of [](#eq:linear) multiplied by $\chi(\omega)$, the
[response function](/tutorial/response/oscillator/#a-steady-push-gets-a-steady-answer-the-response-function-times-the-push).

A real push gives a real answer, so $\chi(t)$ is real, and replacing $\omega$ by $-\omega$ in [](#eq:transform) gives
the complex conjugate: $\chi(-\omega) = \chi(\omega)^*$. So $\mathrm{Re}\,\chi$ is an even function of $\omega$ and
$\mathrm{Im}\,\chi$ an odd one, with $\mathrm{Im}\,\chi(0) = 0$. The cart's $\mathrm{Re}\,\chi$, with $\omega_0^2 -
\omega^2$ on top, is even, and its $\mathrm{Im}\,\chi$, with $\Gamma\omega$ on top, is odd.

**A non-example.** A kernel that is the same forwards and backwards in time, such as $e^{-|t|/\tau}$, starts before
the blow. The imaginary part of its transform is $\int\chi(t)\sin\omega t\,\dd t$, whose integrand is odd, so it
vanishes, and the transform, $2\tau/(1 + \omega^2\tau^2)$, is real. By 4.1's power $\tfrac12\omega\,\mathrm{Im}\,\chi
\,|\tilde F|^2$, such a body could never take energy from a push. Friction needs an answer that differs forwards and
backwards in time, and causality guarantees one.

<!-- diagram: tut-caus-kernels — Two panels side by side, the same axes: time t from −3 to 8 (in units of 1/ω₀),
vertical axis χ(t) in units of 1/mω₀. Left, "causal": a blow drawn as a short vertical arrow at t = 0, and 4.1's
impulse response for Q = 5, e^{−Γt/2} sin(ω_d t)/mω_d, zero (a flat line on the axis) for t < 0 and a decaying sine
after; the region t < 0 lightly shaded and labelled "before the blow". Right, "not a response": the even kernel
e^{−|t|} (τ = 1), the same arrow at t = 0, the curve rising before it and symmetric about it. Caption: "Look first at
the shaded time before the blow: a response is zero there, and the even kernel on the right is not. Curves exact." -->

## Causality ties the stiffness of a response to its friction

We want to see what causality does to $\chi(\omega)$. Let $\omega = \omega_r + i\omega_i$ be complex, with $\omega_i >
0$. Then $e^{i\omega t} = e^{i\omega_rt}\,e^{-\omega_it}$ dies away as $t$ grows, and since [](#eq:transform) runs over
positive times only, it converges even better than for real $\omega$. So $\chi(\omega)$ is defined throughout the
**upper half plane**, the complex numbers with a positive imaginary part. There it can be differentiated with respect to
the complex $\omega$ under the integral sign, so it is
[holomorphic](/tutorial/outside/laplace/#the-harmonic-quadratics-are-the-trace-free-tables) in chapter 2.1's word.[^analytic]
A kernel that did not vanish before the blow would spoil this, because $e^{-\omega_it}$ grows without bound as $t$ runs
back to $-\infty$.

A **pole** of a function is a point where it grows without bound, as $1/(\omega - \omega_1)$ does at $\omega_1$. The
cart's $\chi = 1/\matter m(\omega_0^2 - \omega^2 - i\Gamma\omega)$ has poles at the roots of 4.1's quadratic for the
[free motion](/tutorial/response/oscillator/#friction-makes-the-swing-die-away-and-the-quality-factor-counts-how-slowly).
When $Q > \tfrac12$ they are $\omega = \pm\omega_d - i\Gamma/2$. When $Q < \tfrac12$, as for a door closer, both lie on
the negative imaginary axis.[^overdamped] Either way they lie below the real axis. The free motion dies away because
the poles lie in the lower half, and the cart answers only after it is pushed because none lies in the upper half.

A holomorphic function is fixed inside a region by its values on the region's edge, much as a harmonic function is
fixed inside by its [values on a closed surface](/tutorial/outside/laplace/#the-values-on-a-closed-surface-fix-the-potential-inside).
The reason, which we state without proof, is Cauchy's integral formula: it writes the value at any point inside as an
integral of the values round the edge. The edge of the upper half plane is the real axis. We assume that
**$\chi(\omega)$ tends to zero at large $|\omega|$**, as the cart's does. A theorem of complex analysis, sketched in
the box below, then gives the **Kramers–Kronig relation**:

$$\boxed{\;\mathrm{Re}\,\chi(\omega) = \frac2\pi\,\mathrm P\int_0^\infty\frac{\omega'\,\mathrm{Im}\,\chi(\omega')}
{\omega'^2 - \omega^2}\,\dd\omega'\;} . \label{eq:kk}$$

Here $\omega'$ is a frequency, in $\mathrm{s^{-1}}$, over which we integrate, and $\sym{principal-value}{\mathrm P}$ asks
for the **principal value**. The integrand grows without bound at $\omega' = \omega$, with opposite signs on the two
sides, so we leave out the interval from $\omega - \delta$ to $\omega + \delta$, integrate over the rest, and let
$\delta$ shrink to zero; the large parts on the two sides cancel.[^kk-units]

<!-- diagram: tut-caus-contour — The complex ω plane, real axis horizontal (labelled "Re ω"), imaginary axis vertical
("Im ω"). The cart's two poles for Q = 3 as crosses at ±ω_d − iΓ/2 below the real axis (ω₀ = 1, Γ = 1/3, ω_d =
0.986). The upper half plane lightly shaded, labelled "χ holomorphic". The contour: along the real axis from −R to R
(R = 2.5), with a small half-circle of radius 0.15 bulging upward over a dot at ω (= 0.6) on the real axis, closed by
the large half-circle |ω'| = R in the upper half, arrows anticlockwise. Labels: "ω" at the dot, "R" on the big arc.
Caption: "Look first at the poles: causality keeps them below the real axis, so the loop above encloses none. The
poles are exact for Q = 3; the radii of the loop are chosen for the drawing." Exact geometry: the real axis from −2.8
to 2.8, the imaginary axis from −0.5 to 2.8, one scale on both; poles at (±0.986, −0.167); the loop runs from −2.5 to
0.45 along the axis, over the dot at 0.6 by the half-circle 0.6 + 0.15e^{iθ} with θ from π to 0 (it passes through
0.6 + 0.15i), on from 0.75 to 2.5, and back by 2.5e^{iθ} with θ from 0 to π; one arrowhead on each of the four pieces;
"δ" beside the small half-circle. Place it as ![caption](tut-caus-contour){#fig:contour} just before the gap box, and
then change the box's "The loop runs" to "The loop, drawn in Figure [](#fig:contour), runs". -->

::: gap
This box uses two tools that the tutorial has not taught. One is the integral of a complex function along a path in
the complex plane: cut the path into small steps, multiply the function at each step by the step $\dd\omega'$, a
complex number, and add. The other is **Cauchy's theorem**, stated here without proof: the integral of a holomorphic
function round a closed loop, inside the region where it is holomorphic, is zero. Both fill the first weeks of a
course in complex analysis, such as the first three chapters of E. M. Stein and R. Shakarchi, *Complex Analysis*
(Princeton, 2003).

Fix a real $\omega$ and take $\chi(\omega')/(\omega' - \omega)$, which is holomorphic in the upper half plane but grows
without bound at $\omega' = \omega$ on its edge. The loop runs along the real axis from $-R$ to $R$, steps over the
point $\omega$ by a small half-circle of radius $\delta$ so that it never touches it, and comes back from $R$ to $-R$
by a large half-circle of radius $R$. By Cauchy's theorem its three pieces add to zero.

On the large half-circle the integrand falls faster than $1/R$, because $\chi$ tends to zero, while the path is $\pi R$
long, so that piece vanishes as $R$ grows. On the small one $\omega' = \omega + \delta e^{i\theta}$, with
$\theta$ running from $\pi$ to 0, so $\dd\omega' = i\delta e^{i\theta}\,\dd\theta$. There $\chi(\omega') \approx
\chi(\omega)$, and that piece is

$$\int_\pi^0\chi(\omega)\,\frac{i\delta e^{i\theta}\,\dd\theta}{\delta e^{i\theta}} = -i\pi\chi(\omega) .$$

The two stretches of the real axis become the principal value as $\delta$ shrinks and $R$ grows. So the principal value,
plus $-i\pi\chi(\omega)$, plus zero, is zero:

$$\chi(\omega) = \frac1{i\pi}\,\mathrm P\int_{-\infty}^{\infty}\frac{\chi(\omega')}{\omega' - \omega}\,\dd\omega' .$$

Its real part gives $\mathrm{Re}\,\chi$ as $(1/\pi)\,\mathrm P\int\mathrm{Im}\,\chi(\omega')\,\dd\omega'/(\omega' -
\omega)$. Since $\mathrm{Im}\,\chi$ is odd, the negative frequencies fold onto the positive ones, and $1/(\omega' -
\omega) + 1/(\omega' + \omega) = 2\omega'/(\omega'^2 - \omega^2)$ gives [](#eq:kk). Its imaginary part gives the
companion relation, $\mathrm{Im}\,\chi$ from $\mathrm{Re}\,\chi$. The sketch also skips the care needed when $\chi$
falls slowly.
:::

**A check.** We take 4.1's cart with $Q = 10$ ($\matter m = 2\unit{kg}$, $k = 50\unit{N\,m^{-1}}$, $\Gamma =
0.5\unit{s^{-1}}$), put its $\mathrm{Im}\,\chi$ into [](#eq:kk) at $\omega = 3\unit{s^{-1}}$, and integrate
numerically with the principal value.[^quad] The relation gives $\mathrm{Re}\,\chi = 0.0310\unit{m\,N^{-1}}$, which
is the formula's own value, $16/516.5\unit{m\,N^{-1}}$, to fifteen figures: the in-step part of the swing that 4.1
drew at $3\unit{s^{-1}}$.

So a response has no freedom left once its friction is known: the friction at every frequency fixes the stiffness at
every frequency.

## At the two ends of the spectrum the relation becomes two sums

We want what [](#eq:kk) says about a very slow push and a very fast one, where a response has simple forms.

**The slow end.** At $\omega = 0$ the imaginary part vanishes, so the left side is the
[static compliance](/tutorial/response/oscillator/#a-steady-push-gets-a-steady-answer-the-response-function-times-the-push)
$\chi(0)$. The denominator becomes $\omega'^2$, and nothing is singular, because $\mathrm{Im}\,\chi$ is odd: near zero
it grows in proportion to $\omega'$, as the cart's $\Gamma\omega$ does, so $\mathrm{Im}\,\chi(\omega')/\omega'$ stays
finite. So

$$\boxed{\;\chi(0) = \frac2\pi\int_0^\infty\frac{\mathrm{Im}\,\chi(\omega)}{\omega}\,\dd\omega\;} . \label{eq:static-sum}$$

The stiffness against a steady push is a total of the friction, weighted by $1/\omega$. The paper calls this "the
dispersion relation that holds for matter", and a **dispersion relation** of a response is any relation of this kind
between its two parts.[^dispersion]

**The fast end.** Let $\omega$ lie far above every frequency at which the friction is appreciable. Over the range that
matters $\omega'^2 - \omega^2 \approx -\omega^2$, and [](#eq:kk) becomes

$$\mathrm{Re}\,\chi(\omega) \approx -\frac1{\omega^2}\,\frac2\pi\int_0^\infty\omega'\,\mathrm{Im}\,\chi(\omega')\,
\dd\omega' .$$

Suppose the body answers a fast push as $\chi \to -\sym{response-sum}{A}/\omega^2$, where the constant $A$ is in the
unit of $\chi$ times $\mathrm{s^{-2}}$; 4.1's cart does so with $A = 1/\matter m$. Comparing the two forms gives

$$\boxed{\;\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi(\omega)\,\dd\omega = A\;} . \label{eq:high-sum}$$

A **sum rule** is an exact statement of this kind about the dissipative part of a response added up over all
frequencies.[^tail]

**A check on the cart.** With $\matter m = 2\unit{kg}$ and $k = 50\unit{N\,m^{-1}}$ the two sums predict $\chi(0) = 1/k
= 0.02\unit{m\,N^{-1}}$ and $A = 1/\matter m = 0.5\unit{kg^{-1}}$. Numerical integrals of 4.1's $\mathrm{Im}\,\chi$ give
both to ten figures for $Q = 0.3$, 1, 10 and 100, a door closer as well as a bell.[^cart-units] The second integral is
the area under 4.1's line of power, $\pi/2\matter m = 0.785\unit{kg^{-1}}$ at every $Q$: more friction makes the line
lower and wider by the same factor.

**Two carts.** Chapter 4.1's [two coupled carts](/tutorial/response/oscillator/#a-body-with-many-modes-answers-as-a-sum-of-oscillators)
have lines at $\omega_1 = 5$ and $\omega_2 = 8.7\unit{s^{-1}}$, each of weight $1/2\matter m$, and each line obeys both
sums on its own. The slow end gives $(1/2\matter m)(1/\omega_1^2 + 1/\omega_2^2) = 0.0133\unit{m\,N^{-1}}$, 4.1's
answer to a slow push, and the fast end $1/2\matter m + 1/2\matter m = 1/\matter m$, the free mass of the pushed cart.

So friction and stiffness can move a body's lines and change their widths, but not the totals. The slow end counts
each line's weight over the square of its frequency, and the fast end counts each weight once, wherever its line lies.

## Driven faster than its bonds, every body answers as dust

We want the constant $A$ for a whole body under a tide. Masses far away make, across the body, the potential
$\field\Phi = -F(t)\,h(\vect x)$, with $h$ a harmonic function that fixes the tide's shape (chapters
[1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass) and
[2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics)). The number
$\sym{tide-strength}{F}$ is the tide's strength, in the unit that makes $Fh$ an energy per kilogram: for $h = x$ it is
an acceleration, a uniform pull, and for $h = xy$ it is in $\mathrm{s^{-2}}$, the unit of a tide in chapter 1.4.

The body's energy in the tide is $\sum_a\matter m_a\field\Phi(\vect x_a) = -F\matter Q_h$, with $\matter Q_h =
\sum_a\matter m_ah(\vect x_a)$ the [moment of the mass](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass)
against $h$. So the tide pushes on $\matter Q_h$ as the hand pushed on the cart's $q$, whose energy in a steady force is
$-Fq$. The paper's $\sym{tide-response}{\chi_h}$ is the response of $\matter Q_h$ to this tide, $\tilde{\matter Q}_h =
\chi_h\tilde F$ in phasors, and $\chi_{gh}$ is the response of a second moment, $\matter Q_g$, to the same tide.[^order]

We assume that **the tide is weak**, so that $\nabla h$ may be taken at each particle's place at rest, and that **the
tide rises and falls far faster than every normal mode of the body**, above every mode's frequency $\omega_n$ and
damping rate $\Gamma_n$.

The tide pulls particle $a$, of mass $\matter m_a$, with the force $-\matter m_a\nabla\field\Phi = F\matter m_a\nabla
h(\vect x_a)$, so $\matter m_a\ddot{\vect x}_a = F\matter m_a\nabla h(\vect x_a) + \vect f_a$, where $\vect f_a$ is the
force of the rest of the body. As for 4.1's fast push, that force grows with the displacements, which shrink as
$1/\omega^2$, while $\matter m_a\ddot{\vect x}_a$ must stay equal to the push. So the bonds are weaker than the push by
about $\omega_n^2/\omega^2$, and we drop them: each particle moves as if it were free. In phasors each time derivative
is a factor $-i\omega$, so

$$\delta\tilde{\vect x}_a = -\frac{\tilde F}{\omega^2}\,\nabla h(\vect x_a) .$$

The mass has cancelled: in a given place every particle moves alike, as in free fall. The moment $\matter Q_g$ changes,
to first order, by $\sum_a\matter m_a\nabla g(\vect x_a)\cdot\delta\vect x_a$. We put in the displacements and turn the
sum into an integral over the density:

$$\boxed{\;\chi_{gh}(\omega) \to -\frac1{\omega^2}\int\matter\rho\,\nabla g\cdot\nabla h\,\dd V\;} .
\label{eq:dust-limit}$$

This is the paper's equation of [*The field at two times*](/paper/#par:the-field-at-two-times), with the letters the
other way round, which changes nothing because the right side is symmetric in $g$ and $h$:

{{paper eq:dust}}

The paper calls it "the response of dust", and **dust** is its word for matter whose particles exert no forces on one
another. So every body driven fast enough answers as dust, as every atom answers an X-ray as a cloud of free
electrons.

Now take $g = h$. Then $\chi_h \to -A/\omega^2$ with $A = \int\matter\rho\,|\nabla h|^2\,\dd V$, and the fast end's sum
[](#eq:high-sum) gives

$$\boxed{\;\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi_h(\omega)\,\dd\omega = \int\matter\rho\,|\nabla h|^2\,\dd
V\;} , \label{eq:sum}$$

the paper's [](/paper/#eq:sum-rule), at the head of this chapter; its Appendix A calls the sum $A$. Nuclear physicists
call such a sum an **energy-weighted sum rule**, because each frequency is weighted by $\omega$, which in quantum
mechanics is in proportion to the energy of one quantum of that frequency. The units agree: both sides are in
kilograms times the unit of $h^2$ per square metre.[^units]

**A limit: the uniform pull.** For $h = x$, $|\nabla h|^2 = 1$ and the sum is the mass $\matter M$, because a uniform
pull moves the centre of mass, $\matter Q_x = \matter Mx_{\rm cm}$, as a free body. A body that floats free answers as a
free mass at every frequency, $\chi_x = -\matter M/\omega^2$, not only far above its lines. That response has a pole at
$\omega = 0$, so $\chi_x(0)$ is infinite and the slow end's sum [](#eq:static-sum) diverges: the whole weight $\matter
M$ sits in a line at zero frequency, the free drift of the centre of mass. The cart, which its spring holds, keeps its
line at $\omega_0$ and both sums finite. There $\matter Q_x = \matter mq$, and the pull is the force $\matter mF$ on the
cart, so $\chi_x = \matter m^2\chi$ and its sum is $\matter m^2 \times 1/\matter m = \matter m$.

**A number: the steel ball.** For $h = xy$, $\nabla h = (y, x, 0)$ and $|\nabla h|^2 = x^2 + y^2$, so the sum is the
moment of inertia about the $z$ axis, $\tfrac23\int\matter\rho\,r^2\,\dd V$ for a round body
([chapter 4.2](/tutorial/response/temperature/#the-first-case-is-brownian-motion-and-the-next-ones-see-inside)). For
the paper's uniform steel ball of 32.9 kg and radius 10 cm it is $\tfrac25\matter MR^2 = 0.13\unit{kg\,m^2}$, whatever
its springs and friction. A thin shell of the same mass and radius has $\tfrac23\matter MR^2$, so the two stand as
$3 : 5$, the ratio that 1.7 found for a kick and 4.2 for the tremor.

So $\int\matter\rho\,|\nabla h|^2\,\dd V$ is the inertia that the tide has to move. The body's springs and friction
decide where in frequency it answers, but not how much in all.

::: history
### Sums that count electrons

In 1925 W. Kuhn (*Zeitschrift für Physik* 33, 408) and, separately, F. Reiche and W. Thomas (*Zeitschrift für Physik*
34, 510) found that the strengths with which an atom absorbs light add up to the number of its electrons. The total
counts every line and also the absorption into the continuum above them, where the light frees an electron. The reason
is this chapter's: light far above an atom's lines shakes its electrons as if they were free. R. Kronig (1926) and
H. A. Kramers (1927) derived the relation [](#eq:kk) for the refraction of light by matter.
:::

<!-- try: sum-rule — A plot of ω Im χ_h(ω) (vertical, in units of ∫ρ|∇h|² per ω₀) against ω/ω₀ from 0 to 4, for a body
with up to three lines, each the damped oscillator c_n²·Γ_nω²/[(ω_n² − ω²)² + Γ_n²ω²] (whose area times 2/π is c_n²).
Each line has a draggable peak handle: horizontal sets ω_n (0.3–3.5 ω₀), vertical sets the width Γ_n (Q_n from 1 to
100, the height following as c_n²/Γ_n). A third control, a segmented bar above the plot, moves weight between the lines
(the c_n² always add to the total A = ∫ρ|∇h|², by default the uniform ball's (2/5)MR² for h = xy). Readouts: the
shaded area times 2/π (always A, shown to three figures); the static compliance χ(0) = Σc_n²/ω_n² from eq:static-sum
(changes as lines move); and −ω²χ computed far above the highest line, at ω = 40ω₀ (beyond the plot, more than ten
times the highest line's frequency), where it equals A to within 1%, labelled "−ω²χ far above every line". A switch "ball / shell of the same
mass and radius" multiplies every weight by 5/3 and the area readout follows. Opens with one line at ω₀ (Q = 10) holding all
the weight; buttons "add a line", "reset". Predictions before use: "Move every line to twice its frequency. Does the
total change? Does the static compliance?" (The total does not; the static compliance falls to a quarter.) Then "Make
one line very broad. Where does its weight go?" (It spreads over frequency; the area is unchanged.) Keyboard: Tab to a
handle, arrows move it; both themes; at 390 px the bar sits below the plot. -->

## A blow holds every frequency, and the energy it leaves is the same total

We want the sum rule once more, with no complex analysis: we count the energy that a tide gives a body, once in time
and once in frequency.

The tide pushes particle $a$ with $F\matter m_a\nabla h(\vect x_a)$, and a force does work at the rate of force times
velocity. Adding over the particles with the chain rule, as
[chapter 4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)
did for $\matter{\dot Q}_h$, gives the rate $F\matter{\dot Q}_h$, so a tide that comes and goes does the work $W =
\int F(t)\,\matter{\dot Q}_h(t)\,\dd t$. We write both factors as transforms in time; here a tilde marks a transform, in
the unit of $F$ times a second, not a phasor. By [](#eq:linear), $\matter Q_h$ has the transform $\chi_h\tilde F$, and
the time derivative multiplies it by $-i\omega$. Chapter 2.6's
[Parseval's theorem](/tutorial/outside/fourier/#the-power-of-a-pattern-is-the-same-counted-point-by-point-or-ripple-by-ripple),
$\int|f|^2\,\dd x = \int|\tilde f|^2\,\dd k/2\pi$, was for one pattern in space. Its steps, taken with two real
functions of time $a$ and $b$ and 2.6's convention in time, give $\int ab\,\dd t = \int\tilde a^*\tilde b\,
\dd\omega/2\pi$, so

$$W = \int_{-\infty}^{\infty}|\tilde F|^2\,(-i\omega\chi_h)\,\frac{\dd\omega}{2\pi} .$$

We split $-i\omega\chi_h = \omega\,\mathrm{Im}\,\chi_h - i\omega\,\mathrm{Re}\,\chi_h$. The second term is odd in
$\omega$, and $|\tilde F|^2$ is even, so its integral vanishes. The first is even, so the negative frequencies give as
much as the positive ones:

$$\boxed{\;W = \frac1\pi\int_0^\infty|\tilde F(\omega)|^2\,\omega\,\mathrm{Im}\,\chi_h(\omega)\,\dd\omega\;} .
\label{eq:work}$$

Each band of frequencies takes energy in proportion to $\omega\,\mathrm{Im}\,\chi_h$, 4.1's line of power.

Now let the tide be 1.7's
[impulsive tide](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass),
$F(t) = \epsilon\,\delta(t)$, a blow of strength $\epsilon$ (in the unit of $F$ times a second) at $t = 0$. Its
transform is $\epsilon$ at every frequency: a blow holds every frequency in equal amount. Then [](#eq:work) gives $W =
(\epsilon^2/\pi)\int_0^\infty\omega\,\mathrm{Im}\,\chi_h\,\dd\omega$. Chapter 1.7 found the same energy exactly, in
time: the blow gives each particle the velocity $\epsilon\nabla h$ before any bond can act, and the body gains

{{paper eq:push}}

in the paper's letters, with $g$ for our $h$. For a body at rest $\dot Q_g = 0$, so $W = \tfrac12\epsilon^2A$, with
$A = \int\matter\rho\,|\nabla h|^2\,\dd V$. With the sum rule [](#eq:sum) the count in frequency is
$(\epsilon^2/\pi)(\pi/2)A = \tfrac12\epsilon^2A$, the count in time, and the two agree only if the rule holds. A blow
is too short for the bonds, as a tide far above the body's frequencies is too fast for them, so the two routes rest on
one fact. The paper calls its equation "the sum rule of [](/paper/#eq:sum-rule) in time instead of frequency". This is
chapter 0.5's
[promise](/tutorial/evening/what-the-outside-keeps/#a-black-hole-replies-with-friction-and-a-temperature): "the total
depends only on how far out its mass lies". Chapter 4.6 reaches the same sum a third way, from the trembling of a warm
body.

**A number.** Chapter 1.7's tonne passes a larger steel ball than the paper's ball of 32.9 kg: one of radius
$0.5\unit{m}$ and mass 4110 kg, at the speed $V = 44\unit{km\,s^{-1}}$ and $b = 1.5\unit{m}$ from its centre.
Treating the pass as a blow, 1.7 estimated $\tfrac12\epsilon^2 \times \tfrac25\matter MR^2 = 3.7 \times
10^{-22}\unit{J}$. But the pass's tide lasts about $b/V = 34\unit{\mu s}$, so it is a blow only for lines well below
$V/b \approx 3 \times 10^4\unit{s^{-1}}$, and by [](#eq:work) each line takes energy in proportion to its weight
times $|\tilde F|^2$ at its frequency. The ball's lowest quadrupole line lies near $1.9 \times
10^4\unit{s^{-1}}$,[^rayleigh] where $\omega b/V \approx 0.65$ and $|\tilde F|^2$ is about 1.14 times its value at
zero frequency. Lines far above $V/b$ receive exponentially less. So 1.7's number holds, within about 15%, for the
weight in the lowest line, and overstates what the higher lines take.

**Read now.** The paper weighs a black hole's answer to a tide in the same way, in
[*The weight of a black hole's response*](/paper/#par:the-weight-of-a-black-holes-response). Its quadrupole
$\matter Q_{ij}$ is defined so that its energy in the tide $\sym{tidal-tensor}{\curv{\tE}}_{ij}$ is $\matter
Q_{ij}\curv{\tE}_{ij}$, which makes it half of Newton's moment $\int\matter\rho\,(x_ix_j - \tfrac13r^2\delta_{ij})\,
\dd V$. For $h = xy$ our $\matter Q_h$ is Newton's $xy$ entry, so the paper's moment, response and sum are half of ours,
and a round body's sum is $\tfrac12 \times \tfrac23 = \tfrac13\int\matter\rho\,r^2\,\dd V$. The hole's sum is
$0.345\,\matter Mr_s^2$, with $r_s$ the radius of the horizon, so it answers like a thin shell of its own mass at
$\sqrt{3 \times 0.345}\,r_s = 1.02\,r_s$.

The paper takes the same sum for tides of degree three and four, which for a round body give $\int\matter\rho\,r^4\,
\dd V$ and $\int\matter\rho\,r^6\,\dd V$. For a density that is nowhere negative, $\int\matter\rho\,r^2(r^2 -
a)^2\,\dd V$ cannot be negative, whatever the number $a$. This integral combines the three totals, and the hole's
totals make it $-2.04\,\matter Mr_s^6$ at $a = 4.34\,r_s^2$. So no arrangement of positive mass has the hole's sums:
a shell can stand in for the hole under one tide, but nothing can under three. A body's Love number is its tidal
deformability, the moment that a steady tide raises on it, as a pure number (chapter 4.6 derives it). Put into the slow
end's relation [](#eq:static-sum), the hole's friction would give a Love number of 1.35, and the hole's is zero.
Chapters 11.4 and 13.7 derive these results.[^greybody]

{{paper fig:hole-response}}

## Causality fixes a material's total friction

We want the paper's friction sum, and so the reason why 4.4's weight $\tfrac2\pi\int_0^\infty\mathrm{Re}\,\matter\eta
\,\dd\omega$ came out as $\matter\mu_\infty$. The
[dynamic viscosity](/tutorial/response/viscosity/#maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast)
$\sym{dynamic-viscosity}{\matter\eta(\omega)}$ is a response function: a shear $U$ that rises and falls at $\omega$
meets the stress $2\matter\eta(\omega)$ times its rate, $-i\omega U$. So the stress is $2\matter\mu(\omega)$ times the
shear, with 4.4's complex modulus $\sym{complex-modulus}{\matter\mu(\omega)} = -i\omega\matter\eta(\omega)$, whose
value for a slow shear is the relaxed rigidity $\sym{relaxed-modulus}{\matter\mu_0}$, in pascals.

The modulus's imaginary part, $\mathrm{Im}\,\matter\mu = -\omega\,\mathrm{Re}\,\matter\eta$, is negative, where 4.1's
friction $\mathrm{Im}\,\chi$ was positive, yet the material does not give energy back. The sign flips because
$\matter\mu$ is a force per displacement, the inverse of 4.1's displacement per force. The sums need only that a
response is causal and falls to zero at high frequency, not the sign of its imaginary part.

We assume that **a shear too fast for anything inside to relax meets the unrelaxed rigidity**
$\sym{unrelaxed-modulus}{\matter\mu_\infty}$, so that $\matter\mu(\omega) \to \matter\mu_\infty$ at high frequency. The
stress then has two parts: $2\matter\mu_\infty$ times the shear, which follows the shear at once, and
$2[\matter\mu(\omega) - \matter\mu_\infty]$ times the shear, which comes later and relaxes. The second is a causal
response that tends to zero at high frequency, so the slow end's sum [](#eq:static-sum) applies to it:

$$2(\matter\mu_0 - \matter\mu_\infty) = \frac2\pi\int_0^\infty\frac{2(-\omega\,\mathrm{Re}\,\matter\eta)}{\omega}\,
\dd\omega .$$

The factors 2 and $\omega$ cancel, and changing the sign of both sides gives

$$\boxed{\;\frac2\pi\int_0^\infty\mathrm{Re}\,\matter\eta(\omega)\,\dd\omega = \matter\mu_\infty - \matter\mu_0\;} ,
\label{eq:friction}$$

the paper's equation:

{{paper eq:friction-sum}}

The units agree, since pascal seconds per second are pascals. The total friction of a material is the part of its
stiffness that relaxes, which the paper calls the weight of the source of friction.

**Maxwell's liquid.** Here $\matter\mu(\omega) - \matter\mu_\infty = -\matter\mu_\infty/(1 - i\omega\tau)$, the
transform of the kernel $-(\matter\mu_\infty/\tau)\,e^{-t/\tau}$ after the shear and zero before it. At $\omega = 0$ it
is $-\matter\mu_\infty$, so $\matter\mu_0 = 0$, and [](#eq:friction) gives $\matter\mu_\infty$ whatever $\matter\eta_0$,
the integral that 4.4's stretch problem did with the substitution $x = \omega\tau$.

**A solid that keeps some rigidity.** Take 4.4's model for silicon, a damped line with $\mathrm{Re}\,\matter\eta =
\Delta\matter\mu\,\omega_0^2\Gamma/[(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2]$. Its modulus, $\matter\mu_\infty -
\Delta\matter\mu\,\omega_0^2/(\omega_0^2 - \omega^2 - i\Gamma\omega)$, keeps $\matter\mu_0 = \matter\mu_\infty -
\Delta\matter\mu$ for a slow shear, and numerical integrals give $\tfrac2\pi\int_0^\infty\mathrm{Re}\,\matter\eta\,
\dd\omega = \Delta\matter\mu$ to fourteen figures for quality factors from 1 to $10^4$, silicon's 173 among them.

**Copper's electrons.** Their friction has Maxwell's form with $\matter\mu_\infty = \tfrac25\matter nE_F$
([chapter 4.4](/tutorial/response/viscosity/#a-metals-electrons-relax-like-a-maxwell-liquid-and-their-friction-has-a-ceiling)),
so their total friction is $0.4 \times 8.47 \times 10^{28}\unit{m^{-3}} \times 1.12 \times 10^{-18}\unit{J} = 3.8 \times
10^{10}\unit{Pa}$, with $E_F = 7.0\unit{eV}$: the paper's 38 GPa, about half of steel's rigidity.

Suppose that a part $\Delta\matter\mu$ of a material's stiffness relaxes over a band of frequencies of width
$\Delta\omega$, with its friction spread roughly evenly there. Then [](#eq:friction) gives $\tfrac2\pi\,\mathrm{Re}\,
\matter\eta\,\Delta\omega \approx \Delta\matter\mu$, so $\mathrm{Re}\,\matter\eta \approx (\pi/2)\,\Delta\matter\mu/
\Delta\omega$. In the paper's words, at the frequencies of heat "the friction is roughly the stiffness that relaxes
there divided by the band over which it does so". The friction is never negative and its total is fixed, so a material
glows the most when its whole weight sits where the glow of heat is strongest: the paper's bound on every glow,
[](/paper/#eq:glow-bound), which chapter 10.3 derives. Panel (a) of the paper's Figure [](/paper/#fig:materials) draws
each material's friction on logarithmic axes, where the area one sees is not the weight; the sum fixes the weight,
$\tfrac2\pi\int\mathrm{Re}\,\matter\eta\,\dd\omega$ on ordinary axes.

::: check
### Q

Why can a kernel that is the same forwards and backwards in time not describe a body with friction?

### A

The imaginary part of its transform is $\int\chi(t)\sin\omega t\,\dd t$, which vanishes when $\chi$ is even, and the
friction is $\mathrm{Im}\,\chi$. A causal kernel is zero before the push and cannot be even.

### Q

A body's lines all move to three times their frequencies, with their weights unchanged. What happens to its static
compliance, and to $\tfrac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi\,\dd\omega$?

### A

The static compliance counts each weight over the square of its line's frequency, so it falls to a ninth. The second
sum counts each weight once, so it does not change.

### Q

What is $\tfrac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi_h\,\dd\omega$ for $h = x$, and why?

### A

The mass $\matter M$: far above its frequencies a uniform pull moves the body as a free mass, $\chi_x \to
-\matter M/\omega^2$. (A body that floats free answers so at every frequency, with its whole weight in a line at zero
frequency.)

### Q

What is $\tfrac2\pi\int_0^\infty\mathrm{Re}\,\matter\eta\,\dd\omega$ for copper's free electrons, in pascals?

### A

Their weight, $\tfrac25\matter nE_F = 3.8 \times 10^{10}\unit{Pa}$, because their friction is Maxwell's, with
$\matter\mu_0 = 0$.
:::

**The idea to keep: because a body cannot answer before it is pushed, its friction at every frequency is tied to its
stiffness at every frequency. At the two ends this fixes two totals: the static compliance, and, through the free motion
of its mass far above its own frequencies, the sum $\tfrac2\pi\int\omega\,\mathrm{Im}\,\chi_h\,\dd\omega =
\int\matter\rho\,|\nabla h|^2\,\dd V$, which friction and stiffness can spread but not change.**

::: problems
### Practice

For 4.1's cart ($\matter m = 2\unit{kg}$, $k = 50\unit{N\,m^{-1}}$) at $Q = 1$ and at $Q = 100$, write down
$\tfrac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi\,\dd\omega$ and $\chi(0)$ without integrating, and say why neither
depends on $Q$.

::: solution
Both times they are $1/\matter m = 0.5\unit{kg^{-1}}$ and $1/k = 0.02\unit{m\,N^{-1}}$. A push far faster than the cart
meets only its mass, $\chi \to -1/\matter m\omega^2$, and a steady push meets only its spring. The friction enters
neither limit, so it only makes the line lower and wider, or higher and narrower.
:::

### Stretch

Combine this chapter with chapters 2.2 and 2.5. The gold nugget of 2.5 makes its steel ball not quite round, so add the
sums for the five quadrupolar tides $h_m = r^2Y_{2m}$, reading $|\nabla h|^2$ as $\nabla h\cdot\nabla h^*$. By 2.2's
paper problem, $\sum_m|\nabla h_m|^2 = (25/2\pi)\,r^2$ at every point. Evaluate the total for the gold of a nugget of
mass $\matter m$ at $s = R/2$, for its flush and for its skin, which pull alike everywhere outside the ball.

::: solution
The total is $(25/2\pi)\int\matter\rho\,r^2\,\dd V$ for any body, round or not. The steel adds one part shared by all
three, and the gold adds $\tfrac{25}{2\pi}$ times $\matter ms^2 = 0.25\,\matter mR^2$, $\tfrac35\matter mR^2$ and
$\matter mR^2$ ([chapter 2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)),
which are 0.99, 2.4 and 4.0 times $\matter mR^2$. Five applied tides tell apart bodies that the steady field cannot.
:::

### The paper

The paper's Appendix A says that the measure $(2/\pi\chi_0)\,\mathrm{Im}\,\chi(\omega)\,\dd\omega/\omega$, with
$\chi_0 = \chi(0)$, "has unit weight and mean square frequency $A/\chi_0$", which enters its bounds
[](/paper/#eq:jitter-bounds). Show both from this chapter's two sums, and evaluate $\sqrt{A/\chi_0}$ for 4.1's cart and
for its two coupled carts.

::: solution
Its total weight is $(1/\chi_0)\,\tfrac2\pi\int_0^\infty\mathrm{Im}\,\chi\,\dd\omega/\omega = 1$ by [](#eq:static-sum),
and its mean of $\omega^2$ is $(1/\chi_0)\,\tfrac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi\,\dd\omega = A/\chi_0$ by
[](#eq:high-sum). For the cart, $\sqrt{0.5/0.02} = 5\unit{s^{-1}} = \omega_0$, its one line. For the two carts,
$\sqrt{0.5/0.0133} = 6.1\unit{s^{-1}}$, between the lines at 5 and $8.7\unit{s^{-1}}$.
:::
:::

::: paper
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) (Section IV) states the sum rule
  [](/paper/#eq:sum-rule), derived here from causality and the free-mass limit, and in time from a blow.
- [*The field at two times*](/paper/#par:the-field-at-two-times) (Section XIII) gives the response of dust,
  [](/paper/#eq:dust).
- [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing) (Section XIII) gives the energy
  of a blow, [](/paper/#eq:push), and calls it the sum rule in time.
- [Section VI](/paper/#sec:thermal) states the friction sum [](/paper/#eq:friction-sum); its
  [*A bound on the glow*](/paper/#par:a-bound-on-the-glow) puts the whole weight at the peak of the Planck spectrum.
- [Section XIV](/paper/#sec:hole) weighs a black hole's response, [](/paper/#eq:hole-sum-rule), and finds that the
  dispersion relation for matter fails for a hole.
- Appendix A uses the sum $A$ and the static compliance in its bounds on the jitter, [](/paper/#eq:jitter-bounds).
:::

::: deeper
- The GR course's lesson
  [*Waves, modes and Green functions*](https://neovand.github.io/general-relativity/chapter-18.html#waves-modes-and-green-functions)
  builds a retarded kernel, which vanishes before its source acts: this chapter's causality, for a wave.
- J. S. Toll, "Causality and the dispersion relation: logical foundations", *Physical Review* 104, 1760 (1956), shows
  that causality and the Kramers–Kronig relation are the same statement.
- J. D. Jackson, *Classical Electrodynamics* (3rd ed., Wiley, 1999), section 7.10, derives the relation for the
  dielectric constant, with the loop drawn.
- E. Lipparini and S. Stringari, "Sum rules and giant resonances in nuclei", *Physics Reports* 175, 103 (1989), treats
  energy-weighted sums in their home.
:::

[^letters]: Some letters return with new meanings. The letter $A$ is the sum of the fast end, not the amplitude of
    4.1's swing, 2.6's area of a patch, 3.4's design matrix, 2.8's vector potential $\vect A$ or 5.4's amplitude. The
    letter $F$ is the strength of a tide when it multiplies $h$, not a force in newtons; $\mathrm P$ marks a principal
    value, not a power or a projector.

[^quad]: To repeat it, write the integrand as $[\omega'\,\mathrm{Im}\,\chi(\omega')/(\omega' + \omega)]/(\omega' -
    \omega)$. From 0 to $100\unit{s^{-1}}$ an adaptive quadrature with the factor $1/(\omega' - \omega)$ built into its
    rule takes the principal value: QUADPACK's QAWC routine, which SciPy offers as `quad` with `weight='cauchy'`. Above
    $100\unit{s^{-1}}$ the integrand falls as $\omega'^{-4}$, and an ordinary quadrature adds the rest.

[^analytic]: A holomorphic function also equals the sum of its Taylor series in $\omega$ round every point of its region
    (a theorem of complex analysis, stated here without proof), so it is
    [analytic](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball) in chapter 2.1's
    sense too. Physicists therefore often say that a causal response is "analytic in the upper half plane".

[^dispersion]: The name comes from optics, where the real part of a material's response sets how a prism disperses
    light of different colours. Chapter 5.1 uses the name for a different thing, the rule that ties a wave's frequency
    to its wavenumber.

[^tail]: The fast end needs the friction to fall off fast enough above the body's lines for the integral to converge.
    For the cart, $\omega\,\mathrm{Im}\,\chi$ falls as $\Gamma/\matter m\omega^2$.

[^order]: The paper writes $\chi_{hg}$ for the response of $\matter Q_h$ to the tide of shape $g$. In the limit below
    the two orders give the same function.

[^units]: The response $\chi_h$ is a moment, in kilograms times the unit of $h$, per unit of $F$, whose unit is
    $\mathrm{m^2\,s^{-2}}$ over the unit of $h$. So $\omega\,\mathrm{Im}\,\chi_h\,\dd\omega$, with its
    $\mathrm{s^{-2}}$, is in kilograms times the unit of $h^2$ per square metre, as is $\matter\rho|\nabla h|^2\,\dd V$.

[^rayleigh]: The paper's Appendix A estimates this mode by Rayleigh's method, which gives the frequency
    $\sqrt{10\matter\mu/\matter\rho}/R$. With steel's rigidity $\matter\mu = 7.1 \times 10^{10}\unit{Pa}$ (a
    rigidity here, not the tonne's mass) and its density, $7850\unit{kg\,m^{-3}}$, it is $1.9 \times
    10^4\unit{s^{-1}}$ for this ball of radius $0.5\unit{m}$, a slight overestimate. (The paper's ball of 10 cm rings
    five times higher, near 15 kHz.) The factor 1.14 is the square of the transform in time of the tonne's
    trace-free tide along its straight path, summed over the table's entries, at $\omega b/V = 0.65$, divided by the
    same at zero frequency; at $\omega b/V = 3$ the ratio is 0.28.

[^kk-units]: The units agree, because the fraction is $\mathrm{Im}\,\chi$ over a frequency, and $\dd\omega'$ restores
    it.

[^overdamped]: They are $\omega = -i\bigl[\Gamma \pm (\Gamma^2 - 4\omega_0^2)^{1/2}\bigr]/2$, and both have a negative
    imaginary part because the square root is smaller than $\Gamma$.

[^cart-units]: The units agree: $\mathrm{Im}\,\chi\,\dd\omega/\omega$ is in $\mathrm{m\,N^{-1}}$, and
    $\omega\,\mathrm{Im}\,\chi\,\dd\omega$ in $\mathrm{s^{-2}\,m\,N^{-1}} = \mathrm{kg^{-1}}$.

[^greybody]: The $\Gamma_2$ of the paper's figure below is the hole's **greybody factor**, the fraction of a quadrupole wave
    falling on the hole that it absorbs, and not a damping rate.
