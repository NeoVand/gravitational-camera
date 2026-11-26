---
id: '8.2'
title: 'Operators and commutators, from Poisson brackets'
question: 'A moment of a body and the rate of change of another do not commute, and their commutator has the form of a classical Poisson bracket. What does it mean that two quantities do not commute, and why does quantum mechanics copy the classical bracket?'
part: '8'
requires: ['1.7', '3.1', '3.3', '8.1']
paper: [sec:second-order, eq:hair-commutator, eq:push, app:proofs, sec:one-pixel]
figures: []
live: [uncertainty-packet]
depth: A
---

Take a moment $\matter Q_h$ of a body and the rate of change $\matter{\dot Q}_g$ of another. The two do not commute:

$$[\matter Q_h, \matter{\dot Q}_g] = i\hbar\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V ,$$

and the right-hand side is the same integral as the Poisson bracket of classical mechanics, which section
[1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside) derived, without the factor $i\hbar$.[^commutator] What does it mean that two quantities do not commute, and why does quantum mechanics
copy the classical bracket? The answer is built from the states of [section 8.1](/tutorial/quantum/states/).

::: plain
In quantum mechanics every measurable quantity is represented by a table of numbers, its operator. The possible
results are the eigenvalues of the table, and the states in which the quantity has a definite value are its
eigenvectors.

Two tables multiplied in the two possible orders usually give different answers, and the difference is their
commutator. When it is not zero, no state gives both quantities a definite value, as for a position and a momentum.

The average of a quantum quantity changes in time by Hamilton's rule of classical mechanics, with the commutator
divided by $i\hbar$ in the place of the Poisson bracket. That is why the commutator of two moments of a body is
$i\hbar$ times the bracket of section 1.7.
:::

## A measurable quantity is a Hermitian table

Take the
[two paths](/tutorial/quantum/states/#a-quantum-state-is-a-list-of-complex-amplitudes) of section 8.1 and the quantity "which path", scored $+1$ for $L$ and $-1$ for $R$. The detectors give $+1$ with the probability $|\psi_L|^2$ and $-1$ with
$|\psi_R|^2$, so the mean over many runs is $\psi_L^*\psi_L - \psi_R^*\psi_R$: the state's bra, times the table
$\mathrm{diag}(1, -1)$, times its ket.

The same works for any quantity $A$. Let its outcomes be the real numbers $a_k$, and let $|k\rangle$ be the orthonormal
states in which it gives $a_k$ for certain. The Born rule gives $a_k$ with the probability $|\langle k|\psi\rangle|^2 =
\langle\psi|k\rangle\langle k|\psi\rangle$, so the mean, the sum of outcomes weighted by their probabilities
([section 3.1](/tutorial/noise/probability/)), is

$$\begin{gathered}
\sym{quantum-mean}{\langle A\rangle} = \sum_k a_k\langle\psi|k\rangle\langle k|\psi\rangle = \langle\psi|A|\psi\rangle,\\
A = \sum_k a_k\,|k\rangle\langle k| .
\end{gathered}$$

Here $|k\rangle\langle k|$, a column times a row, is a square table. The table $\sym{operator}{A}$ is the **operator**
of the quantity, and $\langle A\rangle$ is its **expectation value**, its mean in the state $|\psi\rangle$.[^hats]
Since $\langle j|k\rangle$ is one for $j = k$ and zero otherwise, $A|k\rangle = a_k|k\rangle$: the outcomes are the
eigenvalues of the operator and the states of definite value its eigenvectors.

Such a table equals its conjugate transpose ([$U^\dagger$](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel) of section 8.1), $A^\dagger = A$,
because each $a_k$ is real. A table with this property is **Hermitian**, and every Hermitian table has this form, by the complex version of the
[spectral theorem](/tutorial/noise/symmetric-matrices/) of section 3.4, by which a real symmetric table has real
eigenvalues and a full set of perpendicular eigenvectors.

::: derivation
### Every Hermitian table has real eigenvalues and orthonormal eigenvectors

Let $A^\dagger = A$ and $A|v\rangle = \lambda|v\rangle$ with $\langle v|v\rangle = 1$. Conjugating a bracket swaps its
two states and turns $A$ into $A^\dagger$, so $\lambda^* = \langle v|A^\dagger|v\rangle = \langle v|A|v\rangle =
\lambda$, and $\lambda$ is real. The bra of $A|v\rangle = \lambda|v\rangle$ is then $\langle v|A^\dagger =
\lambda^*\langle v|$, that is $\langle v|A = \lambda\langle v|$. If also $A|v'\rangle = \mu|v'\rangle$, the number
$\langle v|A|v'\rangle$ is $\mu\langle v|v'\rangle$ with $A$ acting to the right and $\lambda\langle v|v'\rangle$ with
it acting to the left, so eigenvectors of different eigenvalues are orthogonal. A full set exists by the argument of section 3.4, with
conjugates in the place of transposes (stated).
:::

The variance is $\sigma_A^2 = \langle A^2\rangle - \langle A\rangle^2$, since $A^2 = \sum_k
a_k^2|k\rangle\langle k|$ is the operator of the squared outcome. Its square root $\sym{standard-deviation}{\sigma_A}$
is the standard deviation of $A$,[^sigma] zero exactly when the state is an eigenvector of $A$.

The three **Pauli matrices**, which section 8.4 uses, are

$$\begin{gathered}
\sym{pauli}{\sigma_1} = \begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}, \quad
\sigma_2 = \begin{pmatrix}0 & -i\\ i & 0\end{pmatrix},\\
\sigma_3 = \begin{pmatrix}1 & 0\\ 0 & -1\end{pmatrix} .
\end{gathered}$$

Each is Hermitian with the outcomes $\pm1$, and the third is "which path". The eigenvectors of $\sigma_1$ are $(1,
\pm1)/\sqrt2$, which the delay and second mirror of section 8.1 send out of
[different exits](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel), and those of $\sigma_2$ are $(1,
\pm i)/\sqrt2$. In the state $(1, i)/\sqrt2$, $\langle\sigma_3\rangle = \tfrac12 - \tfrac12 = 0$, while
$\sigma_2(1, i) = (1, i)$, so $\langle\sigma_2\rangle = 1$ with no spread.

## Two quantities that do not commute cannot both be sharp

A product of tables depends on the order of
its factors, and the difference of the two orders is the **commutator**,

$$\sym{commutator}{[A, B]} = AB - BA ,$$

in the unit of the product. Two quantities whose commutator is zero **commute**. For the Pauli matrices,
$\sigma_1\sigma_2 = \mathrm{diag}(i, -i) = i\sigma_3$ and $\sigma_2\sigma_1 = -i\sigma_3$, so $[\sigma_1, \sigma_2] =
2i\sigma_3$.

If a state $|v\rangle$ gives $A$ the definite value $a$ and $B$ the value $b$, then $AB|v\rangle = ab|v\rangle =
BA|v\rangle$, so $[A, B]|v\rangle = 0$. Since $2i\sigma_3$ turns no state into zero, no state gives $\sigma_1$ and
$\sigma_2$ definite values together. Conversely, commuting quantities share their eigenvectors: when the outcomes of $A$ do not repeat, $A(B|k\rangle) =
BA|k\rangle = a_kB|k\rangle$ makes $B|k\rangle$ a multiple of $|k\rangle$.

To bound how sharp both can be, let $\delta A = A - \langle A\rangle$, the departure from the mean, and $|u\rangle
= \delta A|\psi\rangle$, $|w\rangle = \delta B|\psi\rangle$. Because $\delta A$ is Hermitian, the bra of $|u\rangle$ is $\langle\psi|\delta A$, so $\langle u|u\rangle = \sigma_A^2$, and likewise $\langle w|w\rangle = \sigma_B^2$. The argument for the Cauchy–Schwarz inequality in section
[3.3](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks) carries over to states. As there, $c = \langle w|u\rangle/\langle w|w\rangle$
removes from $|u\rangle$ its part along $|w\rangle$, and what is left has a length that cannot be negative:

$$0 \le \langle u - cw|u - cw\rangle = \langle u|u\rangle - \frac{|\langle w|u\rangle|^2}{\langle w|w\rangle} .$$

Multiplying by $\langle w|w\rangle$ gives $\sigma_A^2\sigma_B^2 \ge |\langle w|u\rangle|^2$. Swapping the two states of
a bracket conjugates it, so $\langle w|u\rangle$ has the size of $\langle u|w\rangle$. A complex number is at least as large as its imaginary part, and a number minus its conjugate is $2i$ times that part:
$\langle u|w\rangle - \langle w|u\rangle = \langle\psi|[\delta A, \delta B]|\psi\rangle = 2i\,\mathrm{Im}\langle
u|w\rangle$. The means are numbers, which commute with every table, so $[\delta A, \delta B] = [A, B]$. In all,

$$\sigma_A^2\sigma_B^2 \ge |\langle u|w\rangle|^2 \ge (\mathrm{Im}\langle u|w\rangle)^2 = \tfrac14|\langle[A, B]\rangle|^2 ,$$

and the square root is **Robertson's inequality**:

$$\boxed{\sigma_A\sigma_B \ge \tfrac12\,|\langle[A, B]\rangle|} .$$

**When equality holds.** The first step is an equality when $|u\rangle = c|w\rangle$, and the second when $\langle
u|w\rangle = c^*\langle w|w\rangle$ has no real part, so equality needs $\delta A|\psi\rangle$ to be an imaginary
multiple of $\delta B|\psi\rangle$. In $|L\rangle = (1, 0)$ the means of $\sigma_1$ and $\sigma_2$ are zero and
$\sigma_2|L\rangle = (0, i) = i\,\sigma_1|L\rangle$. Both standard deviations are 1, and $\langle[\sigma_1,
\sigma_2]\rangle = 2i\langle\sigma_3\rangle = 2i$, so both sides are 1.

## Momentum is a derivative, and $[x, p] = i\hbar$

The moments of a body are built from the operators of position and momentum of the
[particle on a line](/tutorial/quantum/states/#a-particle-on-a-line-is-described-by-a-wave-function) of section 8.1. The
position operator multiplies a wave function by $x$, so its mean
$\int\psi^*x\,\psi\,\dd x = \int x\,|\psi|^2\,\dd x$ is the mean of section 3.1 with the density $|\psi|^2$.

The ripple of section 8.1, $e^{ipx/\hbar}$, is a state of definite momentum, in which the letter $p$ is a number, in
$\mathrm{kg\,m\,s^{-1}}$. The operator, written with the same letter, acts on wave functions, and it must turn the
ripple into the number $p$ times the ripple. A derivative does: $-i\hbar\,\dd e^{ipx/\hbar}/\dd x = p\,e^{ipx/\hbar}$.
Every wave function is a sum of ripples $e^{ikx}$, in amounts given by its Fourier transform $\tilde\psi(k)$ ([section
2.6](/tutorial/outside/fourier/)), and the operator acts on each, so
for every $\psi$ the **momentum operator** is

$$\sym{momentum-operator}{p}\,\psi = -i\hbar\,\frac{\dd\psi}{\dd x} .$$

It is Hermitian: integrating by parts, with $\psi$ and $\chi$ vanishing far away, $\int\chi^*(-i\hbar\psi')\,\dd x =
\int(-i\hbar\chi')^*\psi\,\dd x$.

For the moments we need the commutator of $p$ with a function $f(x)$. By the product rule,

$$\begin{aligned}
[f, p]\,\psi &= f\,(-i\hbar\psi') + i\hbar\,(f\psi)'\\
&= -i\hbar f\psi' + i\hbar(f'\psi + f\psi') = i\hbar f'\psi .
\end{aligned}$$

So $[f(x), p] = i\hbar f'(x)$, and $f = x$ gives

$$\boxed{[x, p] = i\hbar} .$$

In three directions, $[f(\vect x), p_j] = i\hbar\,\partial_jf$ and $[x_i, p_j] = i\hbar\,\delta_{ij}$, with the Kronecker delta of
[section 1.1](/tutorial/newton/vectors-and-indices/), and quantities of different particles commute.

::: gap
No finite table can have $[x, p] = i\hbar$. The trace of a table, the sum of its diagonal entries, obeys
$\mathrm{tr}(AB) = \mathrm{tr}(BA)$, so every commutator has trace zero, while $i\hbar$ times the identity of $N$ rows
has trace $i\hbar N$. The oscillator of section 8.3, cut to its 30 lowest states, shows it: its $x$ and $p$ give a
commutator of $i\hbar$ on the first 29 diagonal entries and $-29\,i\hbar$ on the last. Position and momentum need the
infinitely many dimensions of wave functions.
:::

## The uncertainty relation is Robertson's inequality for position and momentum

With $A = x$ and $B = p$, Robertson's inequality has the commutator $i\hbar$, a number, in every state, so

$$\boxed{\sigma_x\sigma_p \ge \frac{\hbar}{2}} .$$

This is **Heisenberg's uncertainty relation**. The
[uncertainty relation](/tutorial/outside/fourier/#on-an-endless-line-the-sum-becomes-an-integral) of section 2.6 stated that a pattern and its transform, read as
distributions, have standard deviations whose product is at least $\tfrac12$. In a
wave function the distribution of $k$ has the density $|\tilde\psi(k)|^2/2\pi$ (stated: the Born rule applied to the
ripples), so $\sigma_x\sigma_k \ge \tfrac12$, and $p = \hbar k$ gives the boxed relation.

**Equality and far from it.** The Gaussian packet $\psi \propto e^{-x^2/4\sigma_x^2}$ of section 8.1, whose $|\psi|^2$ has
the standard deviation $\sigma_x$, reaches the bound: its transform is the bell $e^{-\sigma_x^2k^2}$ of section 2.6, whose
square has the standard deviation $1/2\sigma_x$, so $\sigma_p = \hbar/2\sigma_x$ (Figure [](#fig:widths)). A **chirp**, a phase $e^{iax^2}$ with $a$ in $\mathrm{m^{-2}}$, leaves $|\psi|^2$ alone but spreads the momenta.
Differentiating gives $p\,\psi = \hbar(2a + i/2\sigma_x^2)\,x\psi$, with both means zero, so $\sigma_p^2 =
\hbar^2|2a + i/2\sigma_x^2|^2\sigma_x^2$:

$$\sigma_p = \frac{\hbar}{2\sigma_x}\sqrt{1 + 16a^2\sigma_x^4} ,$$

far from equality when $a\sigma_x^2$ is large. Here $\delta p\,\psi$ is a multiple of $\delta x\,\psi$, but not an
imaginary one, so the chirp loses only in the second step of Robertson's derivation, by the real part of $\langle
u|w\rangle$: the covariance $\tfrac12\langle xp + px\rangle - \langle x\rangle\langle p\rangle =
2a\hbar\sigma_x^2$, the term in $t$ of the practice problem below.

**Numbers.** An electron, of mass $\matter m = 9.11\times10^{-31}$ kg, held within the Bohr radius of hydrogen,
$\sigma_x = 5.29\times10^{-11}$ m, has a spread of velocities of at least

$$\frac{\hbar}{2\matter m\sigma_x} = \frac{1.055\times10^{-34}\unit{J\,s}}{9.64\times10^{-41}\unit{kg\,m}} = 1.09\times10^6\unit{m\,s^{-1}} .$$

That is half the electron's speed in Bohr's model of hydrogen, $2.19\times10^6\unit{m\,s^{-1}}$, in which the
momentum times the radius is $\hbar$. A gram held within a micrometre has at least $5.3\times10^{-26}\unit{m\,s^{-1}}$,
against the $2.0\times10^{-9}\unit{m\,s^{-1}}$ its warmth gives it at room temperature (section
[4.2](/tutorial/response/temperature/#the-first-case-is-brownian-motion-and-the-next-ones-see-inside)).

![Look first at the bottom row: halving the packet's width doubles the spread of its momenta, and the product stays at
$\hbar/2$, the least value, which a Gaussian reaches. The unit of length, $\ell$, is
arbitrary.](tut-uncertainty-widths){#fig:widths}

::: try {#uncertainty-packet}
A wave packet on a line, in units with $\hbar = 1$: above, $|\psi(x)|^2$ with the real part of $\psi$ beneath it;
below, its distribution of momenta. Sliders set the packet's width and a chirp, and a switch splits it into two copies a
distance $d$ apart, the mass in two places of section 8.1. The readouts give $\sigma_x$, $\sigma_p$ and their product
over $\hbar/2$. Answer the predictions first; afterwards, split the packet with $d$ several times
its width and say where the fine fringes in the distribution of momenta come from.
:::

## The quantum equation of motion is the classical one with $i\hbar$ times the bracket

The [states of definite energy](/tutorial/quantum/states/#a-state-of-definite-energy-turns-at-a-rate-set-by-its-energy)
$E$ of section 8.1 turn as $e^{-iEt/\hbar}$. Let $\sym{hamiltonian}{H}$ be the operator of the energy, the Hamiltonian of
section 1.7 with $x$ and $p$ made operators. Any state is a sum of eigenvectors of $H$, each turning at its own rate.
Since $i\hbar\,\dd e^{-iEt/\hbar}/\dd t = E\,e^{-iEt/\hbar}$ for each, the sum obeys **Schrödinger's equation**,

$$i\hbar\,\frac{\dd|\psi\rangle}{\dd t} = H|\psi\rangle .$$

We now follow a mean. Because $H$ is Hermitian, the bra of the equation is $-i\hbar\,
\dd\langle\psi|/\dd t = \langle\psi|H$. For a quantity $A$ that does not depend on the time by itself, the product rule gives

$$\begin{aligned}
\frac{\dd\langle A\rangle}{\dd t} &= \frac{\dd\langle\psi|}{\dd t}A|\psi\rangle + \langle\psi|A\frac{\dd|\psi\rangle}{\dd t}\\
&= \frac{i}{\hbar}\langle\psi|HA|\psi\rangle - \frac{i}{\hbar}\langle\psi|AH|\psi\rangle ,
\end{aligned}$$

which is the **Heisenberg equation**:

$$\boxed{\frac{\dd\langle A\rangle}{\dd t} = \frac{i}{\hbar}\,\langle[H, A]\rangle} .$$

It holds in every state, so $\dot A = (i/\hbar)[H, A]$ is the operator of the rate of change of $A$, while the rule of section 1.7
was $\dot A = \{A, H\} = -\{H, A\}$. The two agree if every commutator is $i\hbar$ times the bracket,

$$[A, B] = i\hbar\,\sym{poisson-bracket}{\{A, B\}} ,$$

which is **Dirac's rule**. The [momentum section](#momentum-is-a-derivative-and-x-p-ihbar) checked it: $[x, p] = i\hbar$ against $\{x, p\} = 1$, and $[f(x), p] = i\hbar f'$ against $\{f, p\} = f'$. The rule carries an $i$ because $[A, B]^\dagger = BA - AB = -[A, B]$, so the commutator of two Hermitian tables is $i$
times a Hermitian table. It carries an $\hbar$ because a bracket is in the unit of the product divided by an action, while a
commutator is in the unit of the product, and quantum mechanics has one constant of action.

The **degree** of a quantity is the largest number of positions and momenta multiplied together in one of its terms,
two for the kinetic energy $p^2/2\matter m$. Dirac's rule is exact in two cases, if each product of positions and
momenta is written in the symmetric order, the average of its two orders:[^order] when one quantity has degree at most
two, and when one depends on the positions alone and the other has degree at most two in the momenta. These are the
cases of a moment against the kinetic energy and of a moment against such a rate; the [last section](#two-moments-of-a-body-do-not-commute) computes them directly. For higher powers the rule fails by terms of order $\hbar^2$ (Groenewold, 1946; stated without proof).

**A check.** For the oscillator, $H = p^2/2\matter m + \tfrac12\matter m\omega^2x^2$, the cart on a spring of section 1.7, of
stiffness $\matter m\omega^2$. From $[x, p] = i\hbar$, $[p^2, x] = p[p, x] + [p, x]p = -2i\hbar p$, and the rule $[f,
p] = i\hbar f'$ gives $[x^2, p] = 2i\hbar x$. So

$$\frac{\dd\langle x\rangle}{\dd t} = \frac{\langle p\rangle}{\matter m}, \qquad \frac{\dd\langle p\rangle}{\dd t} = -\matter m\omega^2\langle x\rangle :$$

the equations of section 1.7, obeyed by the means. Classical motion returns as the motion of the means.

## A generator is the exponent of a unitary table

The [generator](/tutorial/newton/hamilton/#every-quantity-generates-a-motion-and-a-symmetry-gives-a-constant)
$G$ of section 1.7 moved every quantity as $\dd F/\dd\lambda = \{F, G\}$.[^G] Putting $G$ in the place of $H$ in Schrödinger's
equation, $i\hbar\,\dd|\psi\rangle/\dd\lambda = G|\psi\rangle$, gives $|\psi(\lambda)\rangle = U|\psi(0)\rangle$ with

$$\sym{generated-unitary}{U} = e^{-i\lambda G/\hbar} = 1 - \frac{i\lambda G}{\hbar} + \frac{1}{2!}\Bigl(\frac{-i\lambda G}{\hbar}\Bigr)^2 + \dots ,$$

the exponential of a table defined by its series, as in the box on turns of section 1.7 (differentiating term by term gives
$\dd U/\dd\lambda = -(i/\hbar)GU$). Because $G$ is Hermitian, $U^\dagger = e^{i\lambda G/\hbar}$ and
$U^\dagger U = 1$: $U$ is unitary. Every mean becomes $\langle\psi|U^\dagger
FU|\psi\rangle$. With $X = i\lambda G/\hbar$, expanding both exponentials gives $(1 + X + \dots)F(1 - X + \dots) = F +
[X, F] + \dots$, and the whole series is (stated)

$$U^\dagger FU = F + [X, F] + \frac{1}{2!}[X, [X, F]] + \dots .$$

Where Dirac's rule is exact, $[X, F] = \lambda\{F, G\}$, and term by term this is the motion of section 1.7, each
commutator in the place of a bracket.

An impulsive tide of shape $g$, a function of position, adds
$-\epsilon\,\delta(t)\,\matter Q_g$ to $H$ for an instant, with $\sym{mass-moment}{\matter Q_g} = \sum_a\matter
m_a\,g(\vect x_a)$, and during that instant this term outweighs the rest (section 1.7). Schrödinger's equation,
$i\hbar\,\dd|\psi\rangle/\dd t = -\epsilon\,\delta(t)\,\matter Q_g|\psi\rangle$, with $\int\delta\,\dd t = 1$, then
gives

$$|\psi\rangle \to e^{i\epsilon\matter Q_g/\hbar}\,|\psi\rangle ,$$

the impulse, generated by $\matter Q_g$ with $\lambda = -\epsilon$ as in section 1.7. On a momentum the first
term of the series is $(-i\epsilon/\hbar)[\matter Q_g, \vect p_a] = (-i\epsilon/\hbar)(i\hbar\,\matter
m_a\nabla g)$, and the next is zero because $\nabla g$ commutes with $\matter Q_g$:

$$U^\dagger\vect p_aU = \vect p_a + \epsilon\,\matter m_a\nabla g(\vect x_a) ,$$

with every position unchanged, the kick of section 1.7.

## A shift and a kick do not commute

Two moves made in turn show what $[x, p] = i\hbar$ means. The first is a shift, generated by the momentum. With
$G = p$ and $\lambda = s$, a length, the exponent is $-s\,\dd/\dd x$, and the
series is Taylor's: $e^{-isp/\hbar}\psi(x) = \psi(x) - s\psi'(x) + \tfrac12s^2\psi''(x) - \dots = \psi(x - s)$, the
packet moved by $s$.

The second is a kick, the [impulse](#a-generator-is-the-exponent-of-a-unitary-table) for one particle of mass
$\matter m$ with $g = x$. Then $\matter Q_g = \matter
mx$, the momentum rises by $b = \epsilon\matter m$, and the impulse is $e^{ibx/\hbar}$. A shift by $s$ and then a kick
by $b$ give $e^{ibx/\hbar}\psi(x - s)$; the kick first gives $e^{ib(x - s)/\hbar}\psi(x - s)$, because the shift
carries the kick's phase with the packet. The two orders differ by the factor $e^{isb/\hbar}$, with $sb$ the area of
the rectangle that they trace in the phase plane (Figure [](#fig:orders)).

On its own the factor is an overall phase, which has
[no effect](/tutorial/quantum/states/#probabilities-are-the-squared-sizes-of-amplitudes); it is seen when the two paths
of the [interferometer](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel) of section 8.1 receive the moves in opposite orders. It is then a relative phase, $\phi =
sb/\hbar$, and it moves the fringes. Classical moves reach the same point in either order, so this phase is what $[x, p] = i\hbar$ adds.

![Look first at the shaded rectangle. A shift and a kick reach the same point in either order, but in quantum mechanics
the two orders differ by a phase, the rectangle's area divided by $\hbar$, which is what $[x, p] = i\hbar$ means. The
sizes of $s$ and $b$ are schematic.](tut-shift-kick-orders){#fig:orders}

## Two moments of a body do not commute

We assume that **the forces come from a potential energy $V$ of the
positions alone**, so that $H = \sum_a\vect p_a\cdot\vect p_a/2\matter m_a + V$. The moment $\matter Q_h =
\sum_a\matter m_a\,h(\vect x_a)$ commutes with every position and with $V$.

By the [Heisenberg equation](#the-quantum-equation-of-motion-is-the-classical-one-with-ihbar-times-the-bracket) the
operator of the rate of change of $\matter Q_g$ is $\matter{\dot Q}_g = (i/\hbar)[H, \matter Q_g]$, and only the
kinetic energy contributes. For each part and direction, the rule $[p_j, g] = -i\hbar\,\partial_jg$ of the
[momentum section](#momentum-is-a-derivative-and-x-p-ihbar) gives $[p_jp_j, g] =
p_j[p_j, g] + [p_j, g]\,p_j = -i\hbar(p_j\,\partial_jg + \partial_jg\,p_j)$, so

$$\begin{aligned}
\matter{\dot Q}_g &= \frac{i}{\hbar}\sum_a\frac{\matter m_a}{2\matter m_a}(-i\hbar)\bigl(\vect p_a\cdot\nabla g + \nabla g\cdot\vect p_a\bigr)\\
&= \tfrac12\sum_a\bigl(\vect p_a\cdot\nabla g + \nabla g\cdot\vect p_a\bigr),
\end{aligned}$$

with $\nabla g$ taken at $\vect x_a$. This is a **symmetrized product**: both orders appear because
$\vect p_a$ and $\nabla g(\vect x_a)$ do not commute. The conjugate transpose of a product reverses its order,
$(p_j\,\partial_jg)^\dagger = \partial_jg\,p_j$, so the sum is Hermitian, while each order alone is not for a general $g$,
since $[p_j, \partial_jg] = -i\hbar\,\nabla^2g$ is not zero. **A check:** for a harmonic $g$, such as a tide's, $\nabla^2g = 0$ and the two orders agree.

The same rule gives $[\matter Q_h, p_{a,j}] = i\hbar\,\matter m_a\,\partial_jh(\vect x_a)$, which commutes with
$\partial_jg$, so each order contributes half and

$$\boxed{\begin{aligned}[\matter Q_h, \matter{\dot Q}_g] &= i\hbar\sum_a\matter m_a\,\nabla h\cdot\nabla g\,(\vect x_a)\\ &= i\hbar\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V ,\end{aligned}}$$

$i\hbar$ times the bracket of section 1.7, as Dirac's rule says.

**A check.** For $h = g = x$, $\matter Q_h = \matter MX$, with $X$ the centre of mass, and $\matter{\dot Q}_g = P$, the
total momentum along $x$. The commutator is $i\hbar\matter M$, so $[X, P] = i\hbar$, as for one particle.

**A number.** For the steel ball of section 1.7, of 32.9 kg and radius 10 cm, and $h = g = \tfrac12(x^2 - y^2)$, the integral
is the moment of inertia, $0.13\unit{kg\,m^2}$, so no state gives this moment and its rate a product of spreads below
$\tfrac12\hbar\times0.13\unit{kg\,m^2} = 6.9\times10^{-36}\unit{kg^2\,m^4\,s^{-1}}$. At room temperature, where $\kB T =
4.14\times10^{-21}$ J, the tremor alone spreads the rate by $\sqrt{\kB T\times0.13\unit{kg\,m^2}} =
2.3\times10^{-11}\unit{kg\,m^2\,s^{-1}}$ (section 4.2), so the bound then asks only for a spread of
$3\times10^{-25}\unit{kg\,m^2}$ in the moment.

The energy a sudden tide leaves follows for operators. In the
[generator's series](#a-generator-is-the-exponent-of-a-unitary-table) with $G = \matter Q_g$ and $\lambda =
-\epsilon$, the first term on $H$ is $(-i\epsilon/\hbar)[\matter Q_g, H] = \epsilon\matter{\dot Q}_g$. The second is
$\tfrac12(-i\epsilon/\hbar)[\matter Q_g, \epsilon\matter{\dot Q}_g] = \tfrac12\epsilon^2\sum_a\matter m_a|\nabla g|^2$,
a function of the positions, so the series stops:

$$U^\dagger HU = H + \epsilon\,\matter{\dot Q}_g + \frac{\epsilon^2}{2}\sum_a\matter m_a\,|\nabla g(\vect x_a)|^2 ,$$

the algebra of section 1.7, line for line.

![Look first at the box in the centre: one integral of the density, the moment of inertia when $h = g = \tfrac12(x^2 -
y^2)$, is a classical bracket, a quantum commutator, a thermal average and the total of a response.](tut-one-integral-ledger){#fig:ledger}

The same integral, times $\kB T$, is the mean of $\matter{\dot Q}_h\matter{\dot Q}_g$ in a warm body
([section 4.2](/tutorial/response/temperature/)), and the whole weight of the response to an applied tide
([section 4.5](/tutorial/response/causality/)). Here it is the price of reading two moments at once (Figure
[](#fig:ledger)).

**The idea to keep: every measurable quantity is a Hermitian table whose eigenvalues are the outcomes, and two
quantities whose tables do not commute cannot both be sharp, by as much as half their commutator. Quantum means move
by Hamilton's rule with the commutator over $i\hbar$ in the place of the Poisson bracket, so the commutator of
two moments is $i\hbar$ times the bracket of section 1.7.**

::: problems
### Practice

**[8.2]** Compute $[\sigma_2, \sigma_3]$.

::: solution
$\sigma_2\sigma_3 = i\sigma_1$ and $\sigma_3\sigma_2 = -i\sigma_1$, so $[\sigma_2, \sigma_3] = 2i\sigma_1$.
:::

**[8.2]** Show from the Heisenberg equation that a free particle's $\langle x\rangle$ moves at $\langle p\rangle/\matter m$, and
that for a packet that starts unchirped, with $\tfrac12\langle xp + px\rangle = \langle x\rangle\langle p\rangle$ at
$t = 0$, the spread grows as $\sigma_x^2 = \sigma_{x,0}^2 + (\sigma_pt/\matter m)^2$. (Section 8.6 uses the growth.)

::: solution
With $H = p^2/2\matter m$, $[H, x] = -i\hbar p/\matter m$ gives $\dd\langle x\rangle/\dd t = \langle p\rangle/\matter
m$, and $[H, p] = 0$ keeps $\langle p\rangle$ and $\langle p^2\rangle$ fixed. Next, $[p^2, x^2] = -2i\hbar(xp + px)$
and $[p^2, xp + px] = -4i\hbar p^2$, so $\dd\langle x^2\rangle/\dd t = \langle xp + px\rangle/\matter m$ and
$\dd\langle xp + px\rangle/\dd t = 2\langle p^2\rangle/\matter m$. Integrating twice and subtracting $\langle
x\rangle^2$ leaves $\sigma_x^2 = \sigma_{x,0}^2 + \sigma_p^2t^2/\matter m^2$ plus a term in $t$ proportional to
$\tfrac12\langle xp + px\rangle_0 - \langle x\rangle_0\langle p\rangle$, which vanishes for an unchirped start.
:::

### Stretch

**[8.2]** Compute $[L_x, L_y]$ for $\vect L = \vect x\times\vect p$ from $[x_i, p_j] =
i\hbar\,\delta_{ij}$, and compare with the Poisson bracket $\{L_x, L_y\}$ of section 1.7. (Section 8.4 uses the
result.)

::: solution
With $L_x = yp_z - zp_y$ and $L_y = zp_x - xp_z$, only $z$ and $p_z$ fail to commute: $[L_x, L_y] = [yp_z, zp_x] +
[zp_y, xp_z] = y[p_z, z]p_x + x[z, p_z]p_y = i\hbar(xp_y - yp_x) = i\hbar L_z$. The bracket gives $\{L_x,
L_y\} = xp_y - yp_x = L_z$: Dirac's rule holds exactly, as for every pair of degree two.
:::

### The camera

**[8.2]** Two masses $\matter m_1$ and $\matter m_2$ are joined by a spring. Derive $[\matter Q_h, \matter{\dot Q}_g]$
for them, first with $h = g = x^2 - y^2$, then with $h = x^2 - y^2$ and $g = xy$, and check each against $i\hbar$ times the
bracket of section 1.7.

::: solution
The spring's energy depends only on the positions, so $\matter{\dot Q}_g$ is the
[last section](#two-moments-of-a-body-do-not-commute)'s symmetrized sum and the commutator is
$i\hbar\sum_a\matter m_a\nabla h\cdot\nabla g$. For $g = h$, $\nabla h = (2x, -2y, 0)$ and $|\nabla h|^2 = 4(x^2 +
y^2)$, so $[\matter Q_h, \matter{\dot Q}_h] = 4i\hbar\sum_a\matter m_a(x_a^2 + y_a^2)$. For $g = xy$, $\nabla g = (y,
x, 0)$ and $\nabla h\cdot\nabla g = 2xy - 2xy = 0$ everywhere, so the commutator vanishes and these two can be sharp
together. The bracket of section 1.7 gives the same sums without $i\hbar$.
:::
:::

::: paper
- Section XIII's [*The field at two times*](/paper/#par:the-field-at-two-times): the symmetrized $\dot Q_g$ and the
  commutator [](/paper/#eq:hair-commutator), derived here; its
  [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing): the energy [](/paper/#eq:push)
  for operators ([generators](#a-generator-is-the-exponent-of-a-unitary-table) and
  [the last section](#two-moments-of-a-body-do-not-commute)).
- [*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy) and
  [Appendix C](/paper/#app:proofs): brackets of moments, and the commutators in a quantum state's correlations
  (section 8.7).
- [Section VIII](/paper/#sec:one-pixel): the Pauli matrices of [](/paper/#eq:one-spin) (section 8.4).
:::

::: deeper
- Dirac, *The Principles of Quantum Mechanics* (4th ed., 1958), §21: the analogy between the commutator and the
  Poisson bracket.
- Sakurai and Napolitano, *Modern Quantum Mechanics* (2nd ed., 2011), chapter 1: operators, commutators and the
  uncertainty relation.
:::

[^hats]: Hats mark unit vectors here, so an operator carries no hat. This
    $\langle A\rangle$ is the mean over runs of section 3.1, not the average over time of 3.2.

[^G]: This $G$ is a generator, as in section 1.7, not the gravitational constant.

[^sigma]: A standard deviation carries its quantity as subscript, the Pauli matrices carry numbers, and a bare
    $\sigma$ is a surface density.

[^commutator]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII,
    [*The field at two times*](/paper/#par:the-field-at-two-times), equation [](/paper/#eq:hair-commutator); the
    impulse and the energy are in
    [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing), equation [](/paper/#eq:push).

[^order]: For example $[x^2, p^2] = 2i\hbar(xp + px)$, while $i\hbar\{x^2, p^2\} = 4i\hbar\,xp$. The two agree when
    $xp$ is read in the symmetric order, $\tfrac12(xp + px)$.
