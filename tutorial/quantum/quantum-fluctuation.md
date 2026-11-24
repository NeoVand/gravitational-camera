---
id: '8.7'
title: 'Fluctuation and dissipation in quantum mechanics'
question: 'Appendix A says that "for a quantum system the jitter is no longer $k_BT\chi_0$", and that the quantum fluctuation–dissipation theorem "gives the jitter as its average of $\tfrac12\hbar\chi_0\,\omega\coth(\hbar\omega/2k_BT)$". What does quantum mechanics change in the link between trembling and friction, and why does a body still tremble at absolute zero?'
part: '8'
requires: ['3.1', '3.2', '4.1', '4.5', '4.6', '8.2', '8.3']
paper: [app:benchmarks, eq:jitter-bounds, sec:near-field, sec:second-order, eq:hair-commutator, sec:hole, eq:hole-noise, eq:hole-thermometer, sec:thermal]
figures: []
live: [quantum-tremor]
depth: A
---

Chapter [4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number) closed
its account of a body's static jitter with an inequality from the paper's Appendix A,
[*The trembling lattice*](/paper/#par:the-trembling-lattice):

{{paper eq:jitter-bounds}}

The inequality rests on 4.6's remark that in quantum mechanics the classical factor $2\kB T/\omega$ "becomes
$\hbar\coth(\hbar\omega/2\kB T)$, stated here and derived in chapter 8.7".

So we ask what quantum mechanics changes in the link between trembling and friction, and why a body still trembles at
absolute zero. We answer with the commutators of [chapter 8.2](/tutorial/quantum/operators/) and the oscillator of
[chapter 8.3](/tutorial/quantum/quanta/), applied to the response of chapters 4.1 and 4.5.[^letters]

![Look first at the cold ball's ladder: only its lowest level is filled, and that level, the zero point at
$\hbar\omega/2$, is the tremor left at absolute zero. The levels are schematic.](tut-quantum-hero){#fig:quantum-hero}

::: plain
A warm body trembles by itself, and it resists a push with friction. Chapter 4.6 showed that at each frequency the
trembling is the temperature times the friction there, divided by the frequency. That rule
is classical, and it says that a body at absolute zero would not tremble at all.

Quantum mechanics keeps this link and changes its factor. A body's motion is made of oscillators, and an oscillator
never comes fully to rest: with no heat at all it keeps its zero-point motion. So where one quantum carries more energy
than heat supplies, the trembling stops falling with the temperature and stays at a floor set by Planck's constant.

Quantum mechanics also makes order matter: when two readings taken at different times are multiplied, the result
depends on which comes first. The part of the trembling that depends on this order is the same at every temperature,
and it is exactly the body's answer to a push. So even a cold body's trembling tells how it would answer a push.
:::

## A cold oscillator still trembles

We want the mean square swing of an oscillator at any temperature, because for one mode it is 4.6's static
jitter, the spread of a reading about its mean. Chapter 8.3 found it for 4.1's cart of mass $\matter m$ and angular
frequency $\omega$, in thermal equilibrium at the temperature $T$, from the
[occupation](/tutorial/quantum/quanta/#a-warm-mode-holds-about-k_bthbaromega-quanta)
$\bar n = 1/(e^{\hbar\omega/\kB T} - 1)$ and the zero-point width $x_{\rm zp} = \sqrt{\hbar/2\matter m\omega}$
([8.3](/tutorial/quantum/quanta/#in-a-warm-mode-the-order-of-a-product-hardly-matters)):

$$\boxed{\begin{aligned}\langle x^2\rangle &= x_{\rm zp}^2\,(2\bar n + 1)\\ &= \frac{\hbar}{2\matter m\omega}
\coth\frac{\hbar\omega}{2\kB T}\end{aligned}} \label{eq:x2}$$

Here $\coth u = \cosh u/\sinh u$, and in $2\bar n + 1$ the $2\bar n$ is the share of heat and the 1 the share of the
commutator $[x, p] = i\hbar$.

**Two limits.** When $\hbar\omega \ll \kB T$, $\coth u \approx 1/u$, and [](#eq:x2) becomes $\kB T/\matter m\omega^2 =
\kB T/k$, chapter 4.2's equipartition for a spring of stiffness $k$. As $T \to 0$, $\coth \to 1$ and $\langle
x^2\rangle \to x_{\rm zp}^2$. This floor is the **zero-point tremor**, the trembling that no cooling removes.

**A number.** Appendix A's steel ball, in chapter 4.3's trial shape, rings at 15.1 kHz as an oscillator whose swing $q$
at the poles takes the place of $x$, with $\hbar\omega = 1.0\times10^{-29}$ J. At 300 K its swing is $q_{\rm rms} =
2.2\times10^{-16}\unit m$; at absolute zero it is $x_{\rm zp} = 7.5\times10^{-21}\unit m$, a hundred-thousandth of a
proton's radius. Their squares are in the ratio $\coth(\hbar\omega/2\kB T) \approx 2\kB T/\hbar\omega = 8.3\times10^8$.

## The response to a push is a commutator

We want a body's answer to a push in quantum mechanics. Chapter 4.6's **conjugate push** $f(t)$ on a reading $y$ adds
$-f(t)\,y$ to $H$, the body's own energy operator (chapter 8.2).

A **blow** is a push so brief, lasting $\dd t'$, that the body's own motion during it can be neglected. The energy
during the blow is then $-fy$ alone, so by 8.2's [generator
rule](/tutorial/quantum/operators/#a-generator-is-the-exponent-of-a-unitary-table) the blow acts on the state as $U =
e^{-i(-fy)\dd t'/\hbar} = e^{i\epsilon y/\hbar}$, with the impulse $\epsilon = f\,\dd t'$. We write $y(t) =
e^{iHt/\hbar}\,y\,e^{-iHt/\hbar}$ for the reading at the time $t$ of a body left alone, with $y(0) = y$. A blow at $t =
0$ turns the state $|\psi\rangle$ into $U|\psi\rangle$, which then moves freely, so the mean reading at $t$ is
$\langle\psi|U^\dagger y(t)\,U|\psi\rangle$. Expanding both exponentials to first order in $\epsilon$ (8.2's series)
gives

$$\begin{aligned}U^\dagger y(t)\,U &= \Bigl(1 - \frac{i\epsilon y}{\hbar}\Bigr)\,y(t)\,\Bigl(1 + \frac{i\epsilon
y}{\hbar}\Bigr) + \dots\\ &= y(t) + \frac{i\epsilon}{\hbar}\,[y(t), y(0)] + \dots .\end{aligned}$$

So the blow moves the mean reading by $(i\epsilon/\hbar)\langle[y(t), y(0)]\rangle$, and the answer to a unit impulse is

$$\boxed{\sym{reading-response}{\chi_{yy}}(t) = \frac i\hbar\,\sym{step-function}{\theta(t)}\,\langle[y(t),
y(0)]\rangle} , \label{eq:kubo}$$

where the **step function** $\theta(t)$ is 1 for $t > 0$ and 0 for $t < 0$, and the mean is taken in the state before
the blow: for a body in equilibrium, its thermal state. This is the **Kubo formula** (R. Kubo, 1957). A push is a
sequence of blows whose answers add, so [](#eq:kubo) fixes chapter
[4.5](/tutorial/response/causality/#a-linear-response-adds-up-the-answers-to-every-earlier-push)'s whole **linear
response**, the sum of the answers to every earlier part of a push.

**A check.** For 4.1's cart without friction, $H = p^2/2\matter m + \tfrac12\matter m\omega_0^2x^2$. The
[Heisenberg equation](/tutorial/quantum/operators/#the-quantum-equation-of-motion-is-the-classical-one-with-ihbar-times-the-bracket)
gives $\dot x = p/\matter m$ and $\dot p = -\matter m\omega_0^2x$, so $x(t) =
x\cos\omega_0t + (p/\matter m\omega_0)\sin\omega_0t$. With $[p, x] = -i\hbar$,

$$[x(t), x(0)] = -\frac{i\hbar\sin\omega_0t}{\matter m\omega_0} ,$$

a number, the same in every state. So [](#eq:kubo) gives $\theta(t)\sin\omega_0t/\matter m\omega_0$, 4.1's
[impulse response](/tutorial/response/oscillator/#the-answer-to-a-single-blow-comes-after-the-blow) without friction:
an oscillator answers a push exactly as in Newton's mechanics.

::: gap
This sketch drops the terms of order $\epsilon^2$, which "linear" leaves out, and the body's own motion during a blow,
which vanishes with $\dd t'$. Kubo's review of 1966 derives [](#eq:kubo) for a push of any shape.
:::

**What it means.** Any correlation of two readings splits into a symmetric part and a commutator,

$$\begin{aligned}\langle y(t)\,y(0)\rangle &= \tfrac12\langle y(t)\,y(0) + y(0)\,y(t)\rangle\\ &\quad +
\tfrac12\langle[y(t), y(0)]\rangle .\end{aligned}$$

The symmetric part is the tremor that a classical record shows; the commutator, by [](#eq:kubo), is the response. For
4.1's cart (2 kg, $\omega_0 = 5\unit{s^{-1}}$) the commutator's part is at most $\hbar/2\matter m\omega_0 =
5.3\times10^{-36}\unit{m^2}$, $6.4\times10^{-14}$ of the thermal $\langle x^2\rangle$ at 300 K: a negligible part of the
tremor, and the whole of the response.

## The tremor at each frequency is $\hbar\coth(\hbar\omega/2\kB T)$ times the friction there

We want the link between the two parts at each frequency. A classical record shows the average of the two orders, so we
define the **symmetrized spectrum** as chapter
[3.2](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies)'s transform of that
average,

$$\sym{symmetrized-spectrum}{\bar S_{yy}}(\omega) = \int\tfrac12\langle y(t)\,y(0) + y(0)\,y(t)\rangle\,e^{i\omega t}\,
\dd t .$$

It is two-sided, as in 3.2, so that $\langle y^2\rangle = \int\bar S_{yy}\,\dd\omega/2\pi$, in the square of the unit of
$y$ times a second.[^means]

**The oscillator.** We take 4.1's cart of mass $\matter m$ on a spring of angular frequency $\omega_0$, with its damping
rate $\Gamma$ shrunk to zero. Chapter 8.3 wrote $x = x_{\rm zp}(a + a^\dagger)$ and found $[H, a] = -\hbar\omega_0a$, so
the Heisenberg equation gives $a(t) = a\,e^{-i\omega_0t}$. In a thermal state $\langle a^2\rangle = \langle
a^{\dagger2}\rangle = 0$, $\langle a^\dagger a\rangle = \bar n$ and $\langle aa^\dagger\rangle = \bar n + 1$, so

$$\langle x(t)\,x(0)\rangle = x_{\rm zp}^2\bigl[(\bar n + 1)\,e^{-i\omega_0t} + \bar n\,e^{i\omega_0t}\bigr] .
\label{eq:corr}$$

The other order is its complex conjugate, since $(x(t)x)^\dagger = x\,x(t)$. Their average is the real part, $x_{\rm
zp}^2(2\bar n + 1)\cos\omega_0t$, and 3.2's $\int e^{i(\omega\mp\omega_0)t}\,\dd t = 2\pi\delta(\omega \mp \omega_0)$
turns it into two lines:

$$\begin{aligned}\bar S_{xx}(\omega) = \pi x_{\rm zp}^2\coth\frac{\hbar\omega_0}{2\kB T}\,\bigl[&\delta(\omega -
\omega_0)\\ &+ \delta(\omega + \omega_0)\bigr] .\end{aligned}$$

The friction becomes two lines too, because 4.1's peak of $\mathrm{Im}\,\chi$ at $\omega_0$ has the width
$\Gamma$, now zero. Chapter 4.5's
[slow-end sum](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums), $1/k =
(2/\pi)\int_0^\infty\mathrm{Im}\,\chi\,\dd\omega/\omega$, with $1/\omega \approx 1/\omega_0$ across the peak, fixes its
area at $\pi\omega_0/2k = \pi/2\matter m\omega_0$. Since $\mathrm{Im}\,\chi$ is odd,

$$\mathrm{Im}\,\chi(\omega) = \frac{\pi}{2\matter m\omega_0}\,\bigl[\delta(\omega - \omega_0) - \delta(\omega +
\omega_0)\bigr] .$$

We divide the tremor by the friction, line by line. At $+\omega_0$ the ratio is $2\matter m\omega_0x_{\rm
zp}^2\coth(\hbar\omega_0/2\kB T) = \hbar\coth(\hbar\omega_0/2\kB T)$. At $-\omega_0$ it is minus this, which is
$\hbar\coth(\hbar\omega/2\kB T)$ at $\omega = -\omega_0$ because $\coth$ is odd. So the ratio is
$\hbar\coth(\hbar\omega/2\kB T)$ at both lines, and since $\omega_0$ is any frequency,

$$\boxed{\bar S_{yy}(\omega) = \hbar\coth\frac{\hbar\omega}{2\kB T}\,\mathrm{Im}\,\chi_{yy}(\omega)} . \label{eq:qfdt}$$

This is the **quantum fluctuation–dissipation theorem**, for any reading and its conjugate push; [the general
proof](#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give) below holds for any body. For the cart both sides
are in $\mathrm{m^2\,s}$, since $\mathrm{J\,s}\times\mathrm{m\,N^{-1}} = \mathrm{m^2\,s}$. A body of many modes is a set
of such carts, mode $n$ weighed in the reading by $\sym{mode-coupling}{c_n}^2$ in both its tremor and its response, so
their spectra add as in
[4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency).

**The classical limit.** When $\hbar\omega \ll \kB T$, $\hbar\coth(\hbar\omega/2\kB T) \to 2\kB T/\omega$, and
[](#eq:qfdt) is 4.6's theorem. The quantum factor is the classical one times $u\coth u \approx 1 + u^2/3$, with $u =
\hbar\omega/2\kB T$. For the steel ball's trial mode at 15.1 kHz and 300 K, $u = 1.2\times10^{-9}$ and the correction is
$4.9\times10^{-19}$ ($3.4\times10^{-19}$ at Lamb's exact note of 12.6 kHz, which 4.6 uses). For silicon's 15.6 THz
Raman line (8.3) at 300 K, $u = 1.25$ and the quantum tremor is 1.47 times the classical one (Figure
[](#fig:qfd-factor)). As $T \to 0$, $\coth \to 1$ at positive frequencies, and there a body keeps the tremor
$\hbar\,\mathrm{Im}\,\chi_{yy}$ wherever it has friction.

![Look first at the knee: below $\hbar\omega \approx 2\kB T$ a body trembles as classical physics says, and above it
the tremor stops falling with the temperature and keeps the zero point. The steel ball's ringing lies far to the left,
silicon's Raman line near the knee. Curve exact.](tut-qfd-factor){#fig:qfd-factor}

## A cold body can take energy from a push but has none to give

We want the meaning of the two orders taken apart. Their separate transforms are the **unsymmetrized spectra**,
$\sym{unsymmetrized-spectrum}{S_{yy}(\omega)} = \int\langle y(t)\,y(0)\rangle\,e^{i\omega t}\,\dd t$ for the first
order. In a steady state $\langle y(0)\,y(t)\rangle = \langle y(-t)\,y(0)\rangle$, so the other order has the transform
$S_{yy}(-\omega)$, and the average of the two is $\bar S_{yy}(\omega)$. We find the two unknowns $S_{yy}(\pm\omega)$
from two equations: their difference, which holds in every steady state, and their ratio, which holds in a thermal one.

**In every steady state**, the difference of the two orders is the commutator $\langle[y(t), y(0)]\rangle$, which
[](#eq:kubo) gives as $-i\hbar\chi(t)$ for $t > 0$. A shift of time gives $\langle[y(-t), y(0)]\rangle =
\langle[y(0), y(t)]\rangle = -\langle[y(t), y(0)]\rangle$, so for $t < 0$ the commutator is $i\hbar\chi(-t)$. The
half with $t > 0$ has the transform $-i\hbar\chi(\omega)$. Changing $t$ to $-t$ in the other half gives
$i\hbar\chi(-\omega)$, which is $i\hbar\chi(\omega)^*$ by 4.5's $\chi(-\omega) = \chi(\omega)^*$. Adding the halves,

$$\begin{aligned}S_{yy}(\omega) - S_{yy}(-\omega) &= -i\hbar\bigl[\chi_{yy}(\omega) - \chi_{yy}(\omega)^*\bigr]\\
&= 2\hbar\,\mathrm{Im}\,\chi_{yy}(\omega) .\end{aligned}$$

**In a thermal state**, the cart's [](#eq:corr) already shows the ratio: its line at $-\omega_0$ is weaker than the one
at $+\omega_0$ by $\bar n/(\bar n + 1) = e^{-\hbar\omega_0/\kB T}$. For any body we use its energy levels $|m\rangle$,
of energy $E_m$, with 4.2's [Boltzmann
weights](/tutorial/response/temperature/#the-chance-of-a-state-falls-exponentially-with-its-energy) $P_m$. The reading
at a time has the entries $\langle m|y(t)|n\rangle = y_{mn}\,e^{i(E_m - E_n)t/\hbar}$, so

$$\langle y(t)\,y(0)\rangle = \sum_{m,n}P_m\,|y_{mn}|^2\,e^{-i(E_n - E_m)t/\hbar} .$$

Each pair of levels gives a line at $\omega = (E_n - E_m)/\hbar$ of weight $2\pi P_m|y_{mn}|^2$. Its mirror at
$-\omega$ is the same pair with $m$ and $n$ swapped, of weight $2\pi P_n|y_{nm}|^2$. Because $y$ is Hermitian, $y_{nm} =
y_{mn}^*$, so $|y_{nm}| = |y_{mn}|$, and the two weights differ only by $P_n/P_m = e^{-\hbar\omega/\kB T}$. So, line
by line,

$$S_{yy}(-\omega) = e^{-\hbar\omega/\kB T}\,S_{yy}(\omega) ,$$

which is **detailed balance**. Putting it into the difference above gives

$$\boxed{\begin{aligned}S_{yy}(\omega) &= \frac{2\hbar\,\mathrm{Im}\,\chi_{yy}(\omega)}{1 - e^{-\hbar\omega/\kB T}}\\
&= 2\hbar\,(\bar n + 1)\,\mathrm{Im}\,\chi_{yy}(\omega) ,\\ S_{yy}(-\omega) &= 2\hbar\,\bar n\,\mathrm{Im}\,\chi_{yy}(\omega)
,\end{aligned}}$$

with $\bar n$ taken at the frequency $\omega$. Their average, $\hbar(2\bar n + 1)\,\mathrm{Im}\,\chi_{yy}$, is
[](#eq:qfdt), now for any body in equilibrium.

::: gap
This sketch assumes separate levels; a large body's lines merge into smooth friction, for which the theorem holds as a
limit. It also assumes that the thermal state is 4.2's Boltzmann mixture of levels, which does not change in time.
:::

**What the signs mean.** A line at a positive $\omega$ carries the chance $P_m$ of the lower of its two levels, and a
push at that frequency lifts the body by a quantum $\hbar\omega$: positive frequencies are **absorption**, negative
ones **emission**. The friction, their difference $2\hbar\,\mathrm{Im}\,\chi_{yy}$, is the **net absorption**, the net
energy taken from the push. At absolute zero only the ground state has weight, so
$S_{yy}(-\omega) = 0$: a cold body can take energy from a push but has none to give. Yet $\bar S_{yy} =
\hbar\,\mathrm{Im}\,\chi_{yy}$ is not zero, because the zero point still trembles (Figure [](#fig:qfd-two-orders)).

![Look first at the two solid peaks: a warm cart absorbs more than it emits, in the ratio $e^{\hbar\omega_0/\kB T}$,
and their average is the symmetrized tremor. Near absolute zero the emission vanishes and the tremor keeps half the
absorption. Curves exact for a cart with $Q = 12.5$.](tut-qfd-two-orders){#fig:qfd-two-orders}

## The static jitter lies between two bounds

We want the paper's bounds on the **quantum jitter** $\langle\delta y^2\rangle$, the mean square departure of a
reading from its mean. We assume that **the static compliance $\chi_0 = \chi_{yy}(0)$ and
4.5's fast-end sum $\sym{response-sum}{A}$ are finite**. By 3.2's rule and [](#eq:qfdt), folding the negative
frequencies onto the positive ones,

$$\begin{aligned}\langle\delta y^2\rangle &= \int\bar S_{yy}\,\frac{\dd\omega}{2\pi}\\ &= \frac\hbar\pi\int_0^\infty
\coth\frac{\hbar\omega}{2\kB T}\,\mathrm{Im}\,\chi_{yy}\,\dd\omega .\end{aligned}$$

**A weight of total one.** Friction takes energy, so $\mathrm{Im}\,\chi_{yy} > 0$ at positive frequencies, and the
weight

$$\sym{frequency-weight}{\mu(\dd\omega)} = \frac{2}{\pi\chi_0}\,\mathrm{Im}\,\chi_{yy}(\omega)\,\frac{\dd\omega}{\omega}$$

is positive. Chapter 4.5's paper problem showed from its
[two sums](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums) that this weight
adds up to one over $0 < \omega < \infty$, and that its mean of $\omega^2$ is $A/\chi_0$, the paper's "mean square
frequency". So $\mu$ is a probability distribution of frequency (3.1): the share of the static compliance held
near each frequency. Putting $\mathrm{Im}\,\chi_{yy}\,\dd\omega = \tfrac12\pi\chi_0\,\omega\,\mu(\dd\omega)$ into the
jitter gives Appendix A's average,

$$\langle\delta y^2\rangle = \int\tfrac12\hbar\chi_0\,\omega\coth\frac{\hbar\omega}{2\kB T}\,\mu(\dd\omega) .$$

**The lower bound.** Since $\tanh u \le u$, $u\coth u \ge 1$, so $\omega\coth(\hbar\omega/2\kB T) \ge 2\kB T/\hbar$, and
the average is at least $\kB T\chi_0$, 4.6's classical jitter.

**The upper bound.** A function $F$ is **concave** when its graph lies below each of its tangent lines, $F(X) \le
F(\bar X) + F'(\bar X)(X - \bar X)$ for every $X$ and $\bar X$, as $\sqrt X$ does. Averaging over a distribution of $X$
whose mean is $\bar X$ removes the second term, since $X - \bar X$ averages to zero, so $\langle F(X)\rangle \le
F(\langle X\rangle)$, which is **Jensen's inequality**. We take $X = \omega^2$ and $s = \hbar/2\kB T$, in seconds, so
that $\omega\coth(s\omega) = F(X) = \sqrt X\coth(s\sqrt X)$, which is concave for every $s > 0$.[^concave] Its average
over $\mu$ is at most its value at the mean, $X = A/\chi_0$. For the moment $\matter Q_h$, with $\chi_0 = \chi_h(0)$
and $A = \int\matter\rho|\nabla h|^2\,\dd V$,

$$\boxed{\begin{aligned}\kB T\chi_0 &\le \langle\delta\matter Q_h^2\rangle\\ &\le \frac\hbar2\sqrt{A\chi_0}\,
\coth\Bigl(\frac{\hbar}{2\kB T}\sqrt{\frac{A}{\chi_0}}\Bigr) ,\end{aligned}}$$

which is the paper's equation [](/paper/#eq:jitter-bounds).

**When equality holds.** Jensen's inequality is an equality when the distribution sits at one value. One mode,
$\chi = c^2/(\omega_0^2 - \omega^2 - i\Gamma\omega)$, has $\chi_0 = c^2/\omega_0^2$ and $A = c^2$, so
$\sqrt{A/\chi_0} = \omega_0$, and the upper bound is $(\hbar c^2/2\omega_0)\coth(\hbar\omega_0/2\kB T)$: [](#eq:x2) for
a unit mass, times the mode's weight. This is the paper's "upper bound reached by a single mode", and a damped mode,
whose weight is spread across its line, falls a little short of it.[^damped] Far from equality, five modes an octave
apart, each holding a fifth of $\chi_0$, reach at absolute zero 0.75 of the upper bound (Figure [](#fig:qfd-bounds)).
When $\hbar\omega \ll \kB T$ wherever the friction lies, both bounds meet at $\kB T\chi_0$, R4's check.

**What it means.** At absolute zero the lower bound vanishes but the jitter does not: it is the zero point of every mode,
at most $\tfrac12\hbar\sqrt{A\chi_0}$, set by the same compliance and sum that fix the classical jitter and the
response. For the steel ball as one trial mode, its root mean square, in the swing $q$ at the poles, is the
$7.5\times10^{-21}\unit m$ of [the first section](#a-cold-oscillator-still-trembles).

![Look first at the left end: cooled to absolute zero, the body keeps a jitter below the one-mode bound, while the
classical value falls to nothing. At high temperature all three meet. Curves exact.](tut-qfd-bounds){#fig:qfd-bounds}

## The thermometer still needs no model

We want chapter 4.6's thermometer with the quantum factor. Solving [](#eq:qfdt) for the temperature, with
$\sym{artanh}{\mathrm{artanh}}$ the inverse of $\tanh$, gives

$$\boxed{T = \frac{\hbar\omega}{2\kB\,\mathrm{artanh}\bigl(\hbar\,\mathrm{Im}\,\chi_{yy}/\bar S_{yy}\bigr)}} .$$

The body's modes, shapes and weights still cancel between $\bar S_{yy}$ and $\mathrm{Im}\,\chi_{yy}$, and Levin's push
of
[4.6](/tutorial/response/fluctuation-dissipation/#a-push-shaped-like-the-reading-makes-a-thermometer-that-needs-no-model-of-the-body)
is conjugate to the reading for operators too, so this **quantum thermometer** needs no model of the body either. **A
limit:** $\mathrm{artanh}\,z \approx z$ for small $z$, which gives $\omega\bar S_{yy}/2\kB\,\mathrm{Im}\,\chi_{yy}$, the
paper's [](/paper/#eq:thermometer). **A number:** at silicon's Raman line at 300 K, $\hbar\,\mathrm{Im}\,\chi/\bar S =
\tanh u = 0.848$, and the formula returns 300 K, where the classical one would read 442 K.

## A cold body's correlations still contain its commutators

Section XIII's paragraph
[*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy) makes
[the split](#the-response-to-a-push-is-a-commutator) for the moments of a body. There
$\matter Q_h = \sum_a\matter m_a h(\vect x_a)$ is 8.2's moment, the masses weighted by a harmonic function $h$. Mode
$n$, an oscillator of unit mass (4.6), moves $\matter Q_h$ by $c_n$ times its swing, and each swing fails to commute
with its own rate by $i\hbar$. So the paper's [](/paper/#eq:hair-commutator) with $g = h$ is $[\matter Q_h,
\matter{\dot Q}_h] = i\hbar A$, with $A = \sum_nc_n^2$. Classically, equipartition gives each rate the mean square
$\kB T$, so the rate $\matter{\dot Q}_h$ trembles with $\langle\matter{\dot Q}_h^2\rangle = \kB TA$: the same sum,
and, in the paper's words, "the temperature stands where $\hbar$ stands".

In quantum mechanics 8.3's $\langle p^2\rangle$ for unit mass gives instead $\langle\matter{\dot Q}_h^2\rangle =
\sum_nc_n^2\,\tfrac12\hbar\omega_n\coth(\hbar\omega_n/2\kB T)$, which keeps the zero point $\sum_nc_n^2\hbar\omega_n/2$
at absolute zero. In equilibrium the symmetric part of $\langle\matter Q_h\matter{\dot Q}_h\rangle$ is half the rate of
change of $\langle\matter Q_h^2\rangle$, which is zero, so what is left of it is the commutator's part $\tfrac12i\hbar
A$ at every temperature. In a cold classical body both vanish. The paragraph ends: "the
correlations of a quantum state contain its commutators, and a cold classical body's do not".

::: try {#quantum-tremor}
A body of up to five modes, each with a narrow line of friction, chosen from five presets: the steel ball, one mode,
4.1's two coupled carts, five modes an octave apart and five random ones. You set the temperature, down to absolute
zero. The left panel draws the symmetrized tremor against the classical one, and a switch shows the two orders apart,
absorption and emission. The right panel draws the static jitter between the paper's two bounds, against temperature;
the readouts give the jitter over each bound and what the quantum and the classical thermometers read from the
strongest line.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, choose
the two carts, set $\kB T = \hbar\times5\unit{s^{-1}}$, and say why the jitter lies so close to the upper bound.
:::

::: check
### Q

What is $\langle x^2\rangle$ of an oscillator at $\kB T = \hbar\omega$, in units of its zero point $x_{\rm zp}^2$?

### A

By [](#eq:x2) it is $\coth\tfrac12 = 2.16$ times $x_{\rm zp}^2$, against the classical 2.

### Q

At absolute zero, which of $S_{yy}(\omega)$ and $S_{yy}(-\omega)$ vanishes for $\omega > 0$, and what does that mean?

### A

The emission, $S_{yy}(-\omega)$, vanishes. A body in its ground state can take energy from a push but has none to give.

### Q

When is the upper bound of the paper's [](/paper/#eq:jitter-bounds) reached?

### A

For a body of a single undamped mode, whose weight $\mu$ sits at one frequency. A single mode with a narrow line comes
close.
:::

**The idea to keep: a body's response is the commutator of its readings, and its tremor their symmetric product. The
tremor at each frequency is $\hbar\coth(\hbar\omega/2\kB T)$ times the friction there, which is $2\kB T/\omega$ while
quanta are small and the zero point when the body is cold, so the static jitter lies between its classical value and
that of one mode, and is never zero.**

::: problems
### Practice

A mode at 1 THz sits in a body at 4 K. Find $u = \hbar\omega/2\kB T$ and the ratio $u\coth u$ of the mode's jitter
to the classical $\kB T\chi_0$.

::: solution
Here $\hbar\omega = hf = 6.63\times10^{-22}$ J and $2\kB T = 1.10\times10^{-22}$ J, so $u = 6.0$. Since $\coth 6 =
1.00001$, $u\coth u = 6.0$, and the jitter is six times the classical value: the mode is frozen, and its jitter is its
zero point.
:::

### Stretch

Combine [the first section](#a-cold-oscillator-still-trembles) with chapter 4.3's
[tide of the steel ball](/tutorial/response/elastic-bodies/#a-ringing-quadrupole-makes-a-tide), $36G\matter MRq/5r^5$
on its axis ($\matter M = 32.9$ kg, $R = 0.1$ m). Find the tide a metre away at absolute zero, against 4.3's
$3.4\times10^{-25}\unit{s^{-2}}$ at 300 K, and the temperature below which the classical rule would put the swing under
its zero point.

::: solution
At absolute zero the swing is $x_{\rm zp} = 7.5\times10^{-21}\unit m$, so the tide is $1.2\times10^{-29}\unit{s^{-2}}$,
smaller than at 300 K by $q_{\rm rms}/x_{\rm zp} = 2.9\times10^4$. The classical
mean square $\kB T/\matter m\omega^2$ equals $x_{\rm zp}^2$ when $\kB T = \hbar\omega/2$, at $T = 3.6\times10^{-7}$ K.
:::

### The paper

The paper's paragraph
[*The fluctuations of a black hole's quadrupole*](/paper/#par:the-fluctuations-of-a-black-holes-quadrupole) says that
"at these frequencies the chance of emitting a quantum and the chance of absorbing one are both the classical absorption
times $k_BT/\hbar\omega$", where its classical absorption is our
[net absorption](#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give) $2\hbar\,\mathrm{Im}\,\chi$. Show
that this holds when $\hbar\omega \ll \kB T$. With the Hawking temperature $\kB T_H = \hbar
c^3/8\pi G\matter M$ and $r_s = 2G\matter M/c^2$, write $\hbar\omega/\kB T_H$ in terms of $\omega r_s/c$, and find how
far each chance and their average are from the paper's form at $\omega = 0.01\,c/r_s$.

::: solution
The absorption is $2\hbar\,\mathrm{Im}\,\chi\,(\bar n + 1)$ and the emission $2\hbar\,\mathrm{Im}\,\chi\,\bar n$. When
$\hbar\omega \ll \kB T$, $\bar n \approx \kB T/\hbar\omega \gg 1$, so both are $2\hbar\,\mathrm{Im}\,\chi$ times $\kB
T/\hbar\omega$, 4.6's classical spectrum. Since $\kB T_H = \hbar c/4\pi r_s$, $\hbar\omega/\kB T_H = 4\pi\omega r_s/c$,
which is 0.126 at $\omega = 0.01\,c/r_s$. There the emission is 0.938 of the paper's form and the absorption 1.064, 6%
low and 6% high. Their average, which the thermometer reads, is off only by $u^2/3 = 1.3\times10^{-3}$, with $u =
0.063$, so the paper's [](/paper/#eq:hole-thermometer) holds far below $c/r_s$.
:::
:::

::: paper
- Appendix A's [*The trembling lattice*](/paper/#par:the-trembling-lattice): the measure of unit weight, its average and
  the paper's [](/paper/#eq:jitter-bounds), derived here.
- Section IV's [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) ("Quantum mechanics bounds the
  jitter") and [*What heat reveals*](/paper/#par:what-heat-reveals) (its condition $\hbar\omega \ll k_BT$).
- Section XIII's [*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy):
  the commutators in a quantum state's correlations.
- Section XIV's [*The fluctuations of a black hole's quadrupole*](/paper/#par:the-fluctuations-of-a-black-holes-quadrupole):
  the paper's [](/paper/#eq:hole-noise) and [](/paper/#eq:hole-thermometer) (chapter 13.7).
- [Section VI](/paper/#sec:thermal): the theorem behind the emission and absorption of the thermal glow (Part 10).
:::

::: deeper
- The GR course's lesson
  [*Temperature and quantum input*](https://neovand.github.io/general-relativity/chapter-22.html#temperature-and-quantum-input)
  separates what geometry fixes of a black hole's temperature from what needs $\hbar$.
- H. B. Callen and T. A. Welton, "Irreversibility and generalized noise", *Physical Review* 83, 34 (1951), first proved
  the quantum theorem; R. Kubo, "The fluctuation–dissipation theorem", *Reports on Progress in Physics* 29, 255 (1966),
  gives the response as a commutator and the general proofs.
:::

[^letters]: Here $\mu(\dd\omega)$ is a weight of frequencies, not the
    shear modulus $\matter\mu$; $c_n$ is a mode's weight in a reading, as in
    4.6, not 8.5's amplitudes. Local letters: $s$, $u$, $X$, $F$.

[^means]: Chapter 3.2 averaged over many records, and 8.3's thermal mean is a sum over levels weighted by their
    Boltzmann chances. For a symmetrized product the two agree when the record is classical, so $\bar S_{yy}$ becomes
    4.6's $S_{yy}$.

[^concave]: Euler's expansion of $\coth$ in simple fractions (stated without proof) gives $u\coth u = 1 +
    \sum_{k\ge1}2u^2/(u^2 + k^2\pi^2)$. With $u^2 = s^2X$ each term is $2 - 2k^2\pi^2/(s^2X + k^2\pi^2)$, whose second
    derivative in $X$ is negative, so $F = (u\coth u)/s$ is concave.

[^damped]: The paper's phrase holds exactly for a mode with no line width. At $\Gamma/\omega_0 = 0.01$, 0.1 and 0.5 a
    mode reaches 0.997, 0.969 and 0.867 of the bound at absolute zero, and closer when warm.
