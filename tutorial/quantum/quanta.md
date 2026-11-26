---
id: '8.3'
title: "The oscillator's quanta; photons and gravitons"
question: 'A steel ball of radius ten centimetres rings in its lowest quadrupole mode at about 15 kHz with $4\times10^8$ quanta in it at room temperature, while a spinning pair of masses sends out about one graviton every fifteen years. What is a quantum of a ringing body or of a wave, and when does counting quanta matter?'
part: '8'
requires: ['1.7', '4.1', '4.2', '4.3', '8.2']
paper: [sec:near-field, sec:waves, eq:dumbbell, sec:regimes, sec:thermal, sec:first-image, sec:vistas]
figures: []
live: [ladder-oscillator]
depth: A
---

A steel ball ten centimetres in radius rings in its lowest quadrupole mode at about 15 kHz, and at room temperature the
ringing holds $4\times10^8$ quanta. Two spinning masses, by contrast, send out about one graviton every fifteen years.
A graviton is the smallest packet of energy that a gravitational wave of a given frequency can carry, as a photon is for
light.[^packet] The condition under which a body's tremor is classical is that the modes carrying it have
$\hbar\omega \ll \kB T$.[^heat]

What is a quantum of a ringing body or of a wave, and when does counting quanta matter? We apply the operators of
[section 8.2](/tutorial/quantum/operators/) to one oscillator, then carry the answer to a wave.

![Look first at the two ladders: the same ball holds hundreds of millions of quanta in its ringing at room
temperature and almost none when cold. The camera's objects are quantum, and nearly always behave classically. The
levels are schematic, and broken where hundreds of millions of them are left out. The levels are derived in this section.](tut-quantum-hero){#fig:quantum-hero}

::: plain
In quantum mechanics a thing that swings or rings, such as a cart on a spring or a steel ball, holds energy only in
equal steps of size $\hbar\omega$, where $\omega$ says how fast it swings. One step is a quantum. Even with no quanta
at all, the oscillator keeps half a step of energy and a tiny trembling, its zero point.

Heat fills the steps. Boltzmann's constant times the temperature, $k_BT$, is the typical energy that heat gives each way
of moving, and when each step is much smaller than $k_BT$ an oscillator holds about $k_BT/\hbar\omega$ quanta: the steel
ball holds 400 million at room temperature, and behaves classically.

A wave is a set of such oscillators, one for each pattern that fits in space. Its quanta are photons for light and
gravitons for gravity, and the gravitational waves of anything we can build carry so few that none has been counted.
:::

## The oscillator's energy factorizes into two ladder operators

The steel ball's ringing is an oscillator, and so is every pattern of a
wave. The cart of [section 4.1](/tutorial/response/oscillator/) has a mass
$\matter m$, a spring of stiffness $k = \matter m\omega^2$ and the angular frequency $\omega$, in $\mathrm{s^{-1}}$. Its
energy is

$$H = \frac{p^2}{2\matter m} + \tfrac12\matter m\omega^2x^2 .$$

Classically, the cart's state is a point on the
[phase plane](/tutorial/newton/hamilton/) of section 1.7, going round an ellipse that is a
circle when drawn with $\matter m\omega x$ across and $p$ up. So the point is one complex number, $\matter m\omega x +
ip$. Its rate of change, $\omega p - i\matter m\omega^2x$, is $-i\omega$ times itself, so it turns as $e^{-i\omega t}$,
and its squared size is $\matter m^2\omega^2x^2 + p^2 = 2\matter mH$. Divided by $\sqrt{2\matter m\hbar\omega}$, also a
momentum (kilograms times joule seconds per second are a squared momentum), it becomes a pure number whose squared
size is $H/\hbar\omega$.

Quantum mechanics keeps this number but makes $x$ and $p$ operators. We assume only the
[commutator](/tutorial/quantum/operators/#momentum-is-a-derivative-and-x-p-ihbar) $[x, p] = i\hbar$ of section 8.2, under which the order of a product
matters. We define the **lowering operator** $a$ and the **raising operator** $a^\dagger$, named
in the next section,[^a]

$$\begin{aligned}
\sym{lowering-operator}{a} &= \frac{\matter m\omega x + ip}{\sqrt{2\matter m\hbar\omega}} ,\\
\sym{raising-operator}{a^\dagger} &= \frac{\matter m\omega x - ip}{\sqrt{2\matter m\hbar\omega}} .
\end{aligned}$$

Because $x$ and $p$ are Hermitian, $a^\dagger$ is the conjugate transpose of $a$; $a$ itself is not Hermitian and
measures nothing. Only the cross terms survive in the commutator:

$$\begin{aligned}
[a, a^\dagger] &= \frac{-i\matter m\omega\,[x, p] + i\matter m\omega\,[p, x]}{2\matter m\hbar\omega}\\
&= \frac{\matter m\omega\hbar + \matter m\omega\hbar}{2\matter m\hbar\omega} = 1 .
\end{aligned}$$

Multiplying $a^\dagger$ by $a$ in that order, the squares give $\matter m^2\omega^2x^2 +
p^2 = 2\matter mH$, and the cross terms give $i\matter m\omega\,(xp - px)$:

$$\begin{aligned}
a^\dagger a &= \frac{\matter m^2\omega^2x^2 + p^2 + i\matter m\omega\,(xp - px)}{2\matter m\hbar\omega}\\
&= \frac{H}{\hbar\omega} - \frac12 ,
\end{aligned}$$

because $i\matter m\omega\,(xp - px) = i\matter m\omega \cdot i\hbar = -\matter m\hbar\omega$. So

$$\boxed{H = \hbar\omega\bigl(a^\dagger a + \tfrac12\bigr)} , \qquad [a, a^\dagger] = 1 .$$

The classical energy has gained a $\tfrac12$ from $[x, p] = i\hbar$. The Hermitian product $a^\dagger a$ is the
**number operator**, whose eigenvalues, found next, count quanta.

## Its energies are evenly spaced, and the lowest is not zero

By the box, the eigenvalues of $a^\dagger a$ give the energies. Let $\psi$ be a state of length one
with $a^\dagger a\,\psi = n\psi$, where $\sym{quantum-number}{n}$ is a real number with no unit.[^n] Two facts do the
work. The first is a commutator, found with $[a, a^\dagger] = 1$:

$$\begin{aligned}
[a^\dagger a, a] &= a^\dagger aa - aa^\dagger a\\
&= [a^\dagger, a]\,a = -a ,
\end{aligned}$$

and in the same way $[a^\dagger a, a^\dagger] = a^\dagger$. The second is that $n$ cannot be negative. The bra of
$a\psi$ is $\langle\psi|a^\dagger$ (section 8.2), so $n$ is the squared length of the state $a\psi$:

$$n = \langle\psi|a^\dagger a|\psi\rangle = \langle a\psi|a\psi\rangle \ge 0 .$$

Now we apply $a^\dagger a$ to $a\psi$. The first fact says $a^\dagger aa = aa^\dagger a - a$, so

$$a^\dagger a\,(a\psi) = a\,(a^\dagger a\,\psi) - a\psi = (n - 1)\,a\psi .$$

Unless it is zero, $a\psi$ is again an eigenvector, with $n$ lowered by one, and in the same way $a^\dagger\psi$ has $n$
raised by one. This is why $a$ and $a^\dagger$ are called **ladder operators**.

Suppose that $n$ were not a whole number, say $n = 2.3$. Two steps down give $n = 0.3$, which is allowed.
One more step gives a state of squared length 0.3 times the last, so not zero, with $n = -0.7$, which the second fact forbids. A descent can stop only at a state $\psi_0$ with
$a\psi_0 = 0$, which has $n = \langle a\psi_0|a\psi_0\rangle = 0$. So the steps down must land
exactly on zero, $n$ is a whole number, and the oscillator's **energy levels** are

$$\boxed{\sym{level-energy}{E_n} = \bigl(n + \tfrac12\bigr)\hbar\omega , \qquad n = 0, 1, 2, \dots}$$

One step, $\hbar\omega$, is a **quantum** of the oscillator, and $n$ counts the quanta. We write $|n\rangle$ for the
level of length one. By the second fact $a|n\rangle$ has the squared length $n$, and $a^\dagger|n\rangle$ has
$\langle n|aa^\dagger|n\rangle = n + 1$, so, with phases chosen to be one,

$$a|n\rangle = \sqrt n\,|n - 1\rangle , \qquad a^\dagger|n\rangle = \sqrt{n + 1}\,|n + 1\rangle .$$

The **ground state**, the level $n = 0$, solves $a\psi_0 = 0$. On wave functions $ip = \hbar\,\dd/\dd x$ (section 8.2),
so the condition is an equation of first order,

$$\matter m\omega x\,\psi_0 + \hbar\,\frac{\dd\psi_0}{\dd x} = 0 .$$

Its solution of length one is $\psi_0(x) = (2\pi x_{\rm zp}^2)^{-1/4}\,e^{-x^2/4x_{\rm zp}^2}$, with

$$\boxed{\sym{zero-point-width}{x_{\rm zp}} = \sqrt{\frac{\hbar}{2\matter m\omega}}} ,$$

a length, since $\mathrm{J\,s}/(\mathrm{kg\,s^{-1}})$ is $\mathrm{m^2}$. The bell curve $|\psi_0|^2$, of standard
deviation $x_{\rm zp}$, is the **zero-point motion**, a trembling that no cooling removes, and $E_0 = \tfrac12\hbar\omega$
is the **zero-point energy** (Figure [](#fig:levels)). This is the Gaussian of section 8.2 that reaches $\sigma_x\sigma_p =
\hbar/2$, so the ground state is as still as quantum mechanics allows.

**A number.** Section [4.3](/tutorial/response/elastic-bodies/#a-guessed-shape-overestimates-the-lowest-note-and-a-good-guess-comes-close)
made the steel ball's lowest quadrupole shape an oscillator, the swing $q$ of its poles in the place of $x$, with the
effective mass $3\matter M/10 = 9.86\unit{kg}$ and the stiffness $8.9\times10^{10}\unit{N\,m^{-1}}$. So $\omega =
9.49\times10^4\unit{s^{-1}}$ (15.1 kHz), $\hbar\omega = 1.0\times10^{-29}\unit J$, and $x_{\rm zp} = 7.5\times10^{-21}$
m, about $10^{-5}$ of a proton's radius. Heat at 300 K swings the poles by the $q_{\rm rms} = 2.2\times10^{-16}$ m of section 4.3, $2.9\times10^4$ times more
([a later section](#in-a-warm-mode-the-order-of-a-product-hardly-matters) gives the ratio).

**A limit.** As $\hbar \to 0$, $x_{\rm zp} \to 0$: the classical ball can rest exactly
at the bottom.

![Look first at the bottom: the lowest level sits half a step above the floor of the well, and its bell curve, the
zero-point motion, has the width $x_{\rm zp}$. Every step above it is $\hbar\omega$.](tut-oscillator-levels){#fig:levels}

## One state fills an area $2\pi\hbar$ of phase space

Counting states closes a gap left in section [4.2](/tutorial/response/temperature/#the-chance-of-a-state-falls-exponentially-with-its-energy). On the phase plane of
section 1.7 the orbit of energy $E$ is an ellipse of area $2\pi E/\omega$, so the ellipse of level $n$ encloses
$2\pi E_n/\omega = 2\pi\hbar(n + \tfrac12)$. Each level therefore owns a band of area $2\pi\hbar$, between the
ellipses that enclose $2\pi\hbar n$ and $2\pi\hbar(n + 1)$, with its own ellipse down the middle. The ground state's
band is the central disc (Figure [](#fig:bands)). So counting states is measuring area in units of $2\pi\hbar$,
which is the cell of section 4.2 for a coordinate and its momentum. For other systems the rule holds at large $n$ (stated).

**A number.** The cart of section 1.7, 2 kg on $50\unit{N\,m^{-1}}$ and swinging 0.1 m to each side, has $E = 0.25$ J
and an ellipse of area $0.314\unit{J\,s}$, which holds $0.314/6.63\times10^{-34} = 4.7\times10^{32}$ bands, quanta of
$5.3\times10^{-34}$ J.

![Look first at the shaded bands: every band has the same area, $2\pi\hbar$, and belongs to one level. The ink circles
are the classical orbits at the energies $(n + \tfrac12)\hbar\omega$, each dividing its band's area in half; the
axes are scaled so that the ellipses are round.](tut-phase-rings){#fig:bands}

## A warm mode holds about $\kB T/\hbar\omega$ quanta

We assume that **the oscillator is in thermal
equilibrium with a heat bath**, so that the Boltzmann distribution of section 4.2 gives the level $n$ the probability $P(n)
\propto e^{-E_n/\kB T}$, with $\kB T = 4.14\times10^{-21}$ J at 300 K. The mode is then a
[mixture](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel) in the sense of section 8.1, in level $n$ a
fraction $P(n)$ of the time, so the mean of any quantity $A$ is

$$\langle A\rangle = \sum_nP(n)\,\langle n|A|n\rangle .$$

Let $z = \hbar\omega/\kB T$, the step over the thermal energy, and $y = e^{-z}$, a pure number between 0 and 1. The
weights are $e^{-z/2}\,y^n$, the common factor cancels when the probabilities are made to add up to one, and the
geometric series $\sum_ny^n = 1/(1 - y)$ gives

$$P(n) = (1 - y)\,y^n .$$

With $A = a^\dagger a$, the mean is $\bar n = \sum_n n\,P(n)$. Differentiating the geometric series by $y$ gives
$\sum_nny^{n-1} = 1/(1 - y)^2$, so $\bar n = y/(1 - y)$. Dividing above and below by $y$,

$$\boxed{\sym{occupation}{\bar n} = \frac{1}{e^{\hbar\omega/\kB T} - 1}} .$$

This mean is the **occupation number**, or **Bose–Einstein occupation** (1924). The
**mean energy**, zero point included, is $\langle E\rangle = \hbar\omega(\bar n + \tfrac12)$, and over a common
denominator (the box below) it is

$$\langle E\rangle = \frac{\hbar\omega}{2}\,\sym{coth}{\coth}\frac{\hbar\omega}{2\kB T} ,$$

where $\coth u = \cosh u/\sinh u$ is the hyperbolic cotangent. So $2\bar n + 1 = \coth(\hbar\omega/2\kB T)$. Above its
zero point the mode holds $\bar n\hbar\omega$, the heat quoted in section [4.2](/tutorial/response/temperature/#the-chance-of-a-state-falls-exponentially-with-its-energy).

::: derivation
### The mean energy as a hyperbolic cotangent

With $\bar n = y/(1 - y)$, the mean energy is $\hbar\omega\,(\bar n + \tfrac12) = \tfrac12\hbar\omega\,(1 + y)/(1 - y)$.
Put $u = z/2 = \hbar\omega/2\kB T$, so that $y = e^{-2u}$, and multiply above and below by $e^u$:

$$\langle E\rangle = \frac{\hbar\omega}{2}\,\frac{e^u + e^{-u}}{e^u - e^{-u}} = \frac{\hbar\omega}{2}\,\frac{\cosh u}{\sinh u} .$$
:::

**Two limits.** When $\hbar\omega \ll \kB T$, $z$ is small, and $e^z - 1 \approx z + \tfrac12z^2$ gives $\bar n \approx
1/z - \tfrac12 = \kB T/\hbar\omega - \tfrac12$. With $u = z/2$, $\coth u \approx 1/u + u/3$ gives

$$\langle E\rangle \approx \kB T\Bigl[1 + \frac{1}{12}\Bigl(\frac{\hbar\omega}{\kB T}\Bigr)^2\Bigr] .$$

This is the equipartition of section 4.2, $\kB T$ per mode, and the first correction is $(\hbar\omega)^2/12\kB T$: the zero point's
half quantum almost cancels the half quantum missing from $\bar n$. The regime $\hbar\omega \ll \kB T$ is the
**classical limit**. When $\hbar\omega \gg \kB T$, $\bar n \approx e^{-\hbar\omega/\kB T}$ and $\langle E\rangle \to
\tfrac12\hbar\omega$: the mode is a **frozen mode**, nearly always in its ground state (Figure [](#fig:occupation)).

**Numbers.** For the steel ball at 15.1 kHz and 300 K, $\hbar\omega/\kB T = 1.0\times10^{-29}/4.14\times10^{-21} =
2.4\times10^{-9}$, and $\bar n = 4.1\times10^8$ quanta. Silicon's Raman line (section 4.1)
has the frequency $f = 15.6$ THz, so with Planck's constant $h = 2\pi\hbar$ its quantum is $\hbar\omega = hf =
1.03\times10^{-20}$ J. Then $\hbar\omega/\kB T = 2.5$ and $\bar n = 0.090$: a quantum mode, the start of Part 10's glow.
Between the two, at $\kB T = \hbar\omega$, the ground state holds $1 - 1/e = 63\%$ of the probability.

![Look first where the dashed curve leaves the grey line: below $\kB T \approx \hbar\omega$ a mode keeps only its zero
point and its quanta die away exponentially. The steel ball sits far up the classical line, silicon's Raman line near
the knee.](tut-occupation){#fig:occupation}

## In a warm mode the order of a product hardly matters

A mode with many quanta behaves classically although its $x$ and $p$ do not commute. The commutator rearranges to $aa^\dagger = a^\dagger a + 1$, so in the level $|n\rangle$

$$\langle n|a^\dagger a|n\rangle = n , \qquad \langle n|aa^\dagger|n\rangle = n + 1 ,$$

and the thermal means are $\bar n$ and $\bar n + 1$. For position and momentum, we add and subtract the definitions
of $a$ and $a^\dagger$:

$$x = x_{\rm zp}\,(a + a^\dagger) , \qquad p = -i\matter m\omega x_{\rm zp}\,(a - a^\dagger) .$$

In a level, $a$ and $a^\dagger$ move the state to its neighbours, which are orthogonal to it, so $\langle a^2\rangle =
\langle a^{\dagger2}\rangle = 0$ and $\langle x\rangle = \langle p\rangle = 0$. Squaring $x$ gives $x_{\rm zp}^2(a^2 +
a^{\dagger2} + aa^\dagger + a^\dagger a)$, and $aa^\dagger + a^\dagger a = 2a^\dagger a + 1$, so, with the last
section's $2\bar n + 1 = \coth(\hbar\omega/2\kB T)$,

$$\boxed{\begin{aligned}\langle x^2\rangle &= x_{\rm zp}^2\,\bigl(2\bar n + 1\bigr)\\ &= \frac{\hbar}{2\matter m\omega}
\coth\frac{\hbar\omega}{2\kB T} .\end{aligned}}$$

In the same way, $\langle p^2\rangle = (\matter m\omega x_{\rm zp})^2(2\bar n + 1)$. **Two limits.** When $\hbar\omega
\ll \kB T$ the first is $\kB T/\matter m\omega^2 = \kB T/k$, the static jitter of section 4.2, and at $T = 0$ it is $x_{\rm
zp}^2$. For the ball, $\sqrt{2\bar n + 1} = 2.9\times10^4$ is the ratio of the thermal swing to the zero point's.

In $2\bar n + 1$, the 1 is the commutator's share and the $2\bar n$ is the heat's. Each reordering of a product of $a$ and $a^\dagger$
adds or removes a term of the commutator's size, 1, beside terms
of size $\bar n$, so the order changes the mode's means by a fraction of about

$$\frac{1}{\bar n + \tfrac12} \approx \frac{\hbar\omega}{\kB T} ,$$

$2.4\times10^{-9}$ for the ball. This is the precise meaning of "classical, $\hbar\omega \ll \kB T$": with $4\times10^8$ quanta, the commutators
change the tremor by parts in a billion.

## A classical oscillation is a state of many quanta in step

The quantum state of the swinging cart of section 1.7 is not a level, since in a level $\langle x\rangle = 0$ at
every time, while the cart swings. So we move the ground state in phase space to $(x_0, p_0)$ with the
[shift and kick](/tutorial/quantum/operators/#a-shift-and-a-kick-do-not-commute) of section 8.2: a shift by $s = x_0$, then a kick by $b
= p_0$, the ripple $e^{ip_0x/\hbar}$. The result,

$$\psi_\alpha(x) = e^{ip_0x/\hbar}\,\psi_0(x - x_0) ,$$

is a **coherent state**. We apply $a$ in the form $(\matter m\omega x + \hbar\,\dd/\dd x)/\sqrt{2\matter
m\hbar\omega}$. The derivative of the ripple gives $ip_0$, and $\hbar\psi_0'(x - x_0) = -\matter m\omega(x -
x_0)\,\psi_0(x - x_0)$, so

$$\begin{gathered}
a\,\psi_\alpha = \alpha\,\psi_\alpha ,\\
\sym{coherent-eigenvalue}{\alpha} = \frac{\matter m\omega x_0 + ip_0}{\sqrt{2\matter m\hbar\omega}} .
\end{gathered}$$

A coherent state, written $|\alpha\rangle$, is an eigenvector of the lowering operator. Its eigenvalue $\alpha$, a
complex number with no unit,[^alpha] is the classical point $(x_0, p_0)$ written as in the first section. Its mean
number of quanta is $\langle a^\dagger a\rangle = \langle a\psi_\alpha|a\psi_\alpha\rangle = |\alpha|^2$, so

$$\bar n = |\alpha|^2 = \frac{p_0^2/2\matter m + \tfrac12\matter m\omega^2x_0^2}{\hbar\omega} = \frac{E}{\hbar\omega} ,$$

the classical energy $E$ of a cart at $(x_0, p_0)$, counted in quanta.

It moves without changing its shape. With $[H, a] = -\hbar\omega a$ (from the second section), the Heisenberg equation of section 8.2 gives $\dd\langle a\rangle/\dd t = -i\omega\langle a\rangle$, so $\langle a\rangle =
\alpha e^{-i\omega t}$, the classical number's turning, and $(\langle x\rangle, \langle p\rangle)$ goes round the
ellipse. The state stays an eigenvector of $a$, with the eigenvalue $\alpha e^{-i\omega t}$,[^stays] so it keeps the
ground state's widths, $x_{\rm zp}$ and $\matter m\omega x_{\rm zp}$: it is a blob of fixed size circling the ellipse.

**An example.** The cart holds $4.7\times10^{32}$ quanta, and its blob has the standard deviation $2.3\times10^{-18}$
m against a swing of 0.1 m.

**A non-example.** A thermal state with the same $\bar n$ has the same mean energy, but $\langle a\rangle = 0$, as in
every level: its mean position stays at zero, and its spread $x_{\rm zp}\sqrt{2\bar n + 1}$ fills the ellipse. It has
no phase. A classical swing is many quanta in step, and heat is as many quanta with no common phase.

## Each mode of a wave is an oscillator, and its quanta are photons or gravitons

This is a sketch, and the box below names what it skips.

Take a wave $\phi$ of [section 5.1](/tutorial/waves/wave-equation/), with
$\ddot\phi = c^2\nabla^2\phi$, in a cube of side $D$ whose opposite faces are joined, as the patch of
[section 2.6](/tutorial/outside/fourier/) was made to repeat. The patterns
that fit are $\cos(\vect k\cdot\vect x)$ and $\sin(\vect k\cdot\vect x)$ on the grid of 2.6, $\vect k = (2\pi/D)(n_1, n_2,
n_3)$. Since $-\vect k$ gives the same two patterns as $\vect k$, we keep half of the grid, and a range $\dd^3k$ holds
$D^3\,\dd^3k/(2\pi)^3$ patterns for each polarization. For one pattern, $\phi = q(t)\cos(\vect k\cdot\vect x)$, the
wave equation gives $\ddot q = -c^2|\vect k|^2q$: an oscillator of angular frequency $\omega = c|\vect k|$. For the shear wave of 5.1 the [energy](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed) per cubic metre is $\tfrac12\matter\rho(\dot\phi^2 + c^2|\nabla\phi|^2)$, and $\cos^2$ and $\sin^2$ average to $\tfrac12$ over
the cube, so the pattern's energy is

$$E = \tfrac12\matter m_D\bigl(\dot q^2 + \omega^2q^2\bigr) , \qquad \matter m_D = \tfrac12\matter\rho D^3 .$$

This is the cart's energy, with $q$ in the place of $x$ and the **mode's mass** $\matter m_D$ in the place of $\matter
m$, so the momentum is $\matter m_D\dot q$. Each pattern is a **mode of the field**, and the field is a set of
independent oscillators, one per mode. Light and $\field h_+$, $\field h_\times$ have energy densities of the same form
(sections 6.6 and [7.8](/tutorial/geometry/wave-energy/#the-heat-comes-from-the-wave-so-the-wave-carries-energy); stated).

We postulate that each mode's $q$ and its momentum obey the commutator of section 8.2. The first two sections then give
every mode the levels $(n + \tfrac12)\hbar\omega$, whose steps are the field's **quanta**. Joining $\cos$ and $\sin$
into the travelling wave $e^{i(\vect k\cdot\vect x - \omega t)}$, the ripple of section 8.1, gives each quantum the energy
$\hbar\omega$ and the momentum $\hbar\vect k$ (stated). With the
wave four-vector $k^\mu = (\omega/c, \vect k)$ of [section 6.3](/tutorial/relativity/aberration/), its four-momentum is
$p^\mu = \hbar k^\mu$, null because $k^\mu$ is: $E = |\vect p|c$, the light of
[section 6.4](/tutorial/relativity/energy-and-momentum/). A
quantum of light is a **photon**.

Section [5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)
split a gravitational wave into two circular parts, which a turn by $\theta$ about the direction of travel multiplies
by $e^{\pm2i\theta}$. The angular momentum $J$ along that direction
[generates](/tutorial/newton/hamilton/#every-quantity-generates-a-motion-and-a-symmetry-gives-a-constant) the turn, so
by the [rule](/tutorial/quantum/operators/#a-generator-is-the-exponent-of-a-unitary-table) of section 8.2 the turn acts as
$e^{-i\theta J/\hbar}$, and a quantum of either part has $J = 2\hbar$ or $-2\hbar$. Its **helicity** is $\pm2$
(section 9.1 shows that this is the spin two of 1.5b). Light's parts turn by $e^{\pm i\theta}$, so a photon's helicity is
$\pm1$.

The **graviton** is the quantum of a mode of gravitational waves, with the energy $\hbar\omega$, the momentum
$\hbar\vect k$ and the helicity $\pm2$. It is the smallest packet of energy that a gravitational wave of frequency
$\omega$ can carry, the "smallest packet" of
[section 0.3](/tutorial/evening/waves-and-heat/), now one step of an oscillator. That gravitational waves are quantized is stated; no experiment has detected a graviton. Freeman Dyson argued that no detector we could build would register one
[@Dyson2013], and an estimate of the absorption agrees:[^absorb] a cubic metre of a solid with $30\unit{GPa}$ of relaxing stiffness, crossed each second by one graviton from the band of room-temperature
heat, would wait $2\times10^{29}$ years for its first count.

**Numbers.** A spinning pair (two 1 kg masses a metre apart, turning sixteen times a second, so that $\Omega
= 100.5\unit{s^{-1}}$) radiates $4.55\times10^{-41}$ W ([section 7.7](/tutorial/geometry/quadrupole-formula/)) at twice its
angular frequency, $2\Omega$, or 32 Hz. Each graviton carries $2\hbar\Omega = 2.12\times10^{-32}$ J, so one leaves every
$4.66\times10^8$ s, or 14.8 years. A wave that LIGO detects, by contrast, carries
$2.4\times10^{28}$ gravitons through each square metre each second (section 7.8's $1.6\times10^{-3}\unit{W\,m^{-2}}$ at
100 Hz), and is as classical as the cart. The steel ball's ringing radiates $4.9\times10^{-55}$ W (chapter
[R4](/tutorial/response/reading-section-iv-3/#the-tremor-lies-in-a-few-classical-notes-and-the-camera-reads-it-without-one-graviton)), one graviton in $6.5\times10^{17}$ years. Yet the camera detects the
ringing without receiving any of its radiation: the near field is the pull of the ball's present shape, so no quanta need arrive.

::: gap
This sketch skips the quantization of a field itself, which shows that its modes are independent oscillators, each
with its own commutator, and, for light and gravity, the gauge that leaves only two polarizations as modes (section
7.6). The zero points of all the modes add up to an infinite energy; only differences are used here. Gravity
as a quantum field works only at low energies, which is all the camera needs.
:::

::: try {#ladder-oscillator}
On the left, the well of Figure [](#fig:levels) with its first twenty levels, each carrying a bar for its thermal
probability; on the right, the phase plane of Figure [](#fig:bands). A slider sets $\kB T/\hbar\omega$ from 0.05 to 50,
and the right panel shows the thermal spread as a disc. A switch replaces the thermal mode by a coherent state with a
mean number of quanta you choose, a small blob circling the origin. The readouts give $\bar n$, the mean energy over
$\kB T$ and the share in the ground state. Answer the predictions first; afterwards, raise the
temperature to 50 and say why the bars now fall smoothly rather than in a few steps.
:::

**The idea to keep: an oscillator's energy comes in steps of $\hbar\omega$ above a zero point of $\tfrac12\hbar\omega$,
and a warm mode holds about $\kB T/\hbar\omega$ steps. Every slow mode of a body holds hundreds of millions, so its near
field is classical. Each mode of a wave is such an oscillator, and its quanta, photons and gravitons, carry
$\hbar\omega$ and $\hbar\vect k$; the gravitational waves of anything we can make hold so few that none is ever
counted.**

::: problems
### Practice

**[8.3]** What is the energy of the oscillator's ground state, and why is it not zero?

::: solution
It is $\tfrac12\hbar\omega$. A state with no energy would rest at the bottom, with $\sigma_x = \sigma_p = 0$, below the
bound $\sigma_x\sigma_p \ge \hbar/2$ of section 8.2.
:::

**[8.3]** Why may the ball's tremor be treated classically but not silicon's Raman line?

::: solution
The order of a product changes a mode's means by a fraction of about $1/(\bar n + \tfrac12)$. That is $2\times10^{-9}$
for the ball, but 1.7 for the Raman line, which holds only 0.09 quanta.
:::

**[8.3]** Find $\bar n$ and the mean energy over $\kB T$ for a mode at 1 THz at 300 K.

::: solution
With $\hbar\omega = hf$, $\hbar\omega/\kB T = 6.63\times10^{-34}\times10^{12}/4.14\times10^{-21} = 0.160$, so $\bar n
= 1/(e^{0.160} - 1) = 5.8$, and $\langle E\rangle/\kB T = 1 + 0.160^2/12 = 1.002$. The mode is classical to two parts in a thousand.
:::

### Stretch

**[8.3]** Using sections 4.2 and 4.3, find the steel ball's root-mean-square quadrupole swing $q$ at 300 K
and at absolute zero, and the tide that each makes a metre away on its axis.

::: solution
With $q$ for $x$ in the boxed $\langle x^2\rangle$: at 300 K, $\langle q^2\rangle \approx \kB T/k$, so $q_{\rm rms} =
2.2\times10^{-16}$ m, and 4.3's tide $36G\matter MRq/5r^5$ ($\matter M = 32.9$ kg, $R = 0.1$ m) is
$3.4\times10^{-25}\unit{s^{-2}}$. At absolute zero $q_{\rm rms} = x_{\rm zp} = 7.5\times10^{-21}$ m and
the tide is $1.2\times10^{-29}\unit{s^{-2}}$, $2.9\times10^4$ times weaker.
:::

### The camera

**[8.3]** Check that the steel ball's ringing holds $4\times10^8$ quanta and emits one graviton in a time of order
$10^{18}$ years, from the frequencies of section 4.3 and the power of a ringing quadrupole of section 7.7.

::: solution
At 15.1 kHz, $\bar n = 4.1\times10^8$. The power is $P = (G/5c^5)\langle\dddot
I_{ij}\dddot I_{ij}\rangle$ with $I_{ij} = \tfrac15\matter MRq\,\mathrm{diag}(-1, -1, 2)$ (R4), so $\langle\dddot
I_{ij}\dddot I_{ij}\rangle = 6\,\omega^6(\matter MR/5)^2\langle q^2\rangle$ with $\langle q^2\rangle = \kB T/k$. That
gives $P = 4.9\times10^{-55}$ W, and $\hbar\omega/P = 2.1\times10^{25}$ s, or $6.5\times10^{17}$ years. At fixed
temperature and shape the time per graviton goes as $\omega^{-3}$: at the exact 12.6 kHz
it is $(15.1/12.6)^3 = 1.72$ times longer, $1.1\times10^{18}$ years. Both are of order $10^{18}$ years.
:::
:::

::: paper
- Section IV's [*What heat reveals*](/paper/#par:what-heat-reveals): the condition "$\hbar\omega \ll k_BT$", the ball's
  "$4\times10^8$ quanta" and its "one graviton in a time of order $10^{18}$ years".
- [Section V](/paper/#sec:waves): the graviton in its plain words, and the paper's [](/paper/#eq:dumbbell) with "one
  graviton every fifteen years".
- [Section III](/paper/#sec:regimes) and [Section VI](/paper/#sec:thermal): the thermal glow, peaking at $\hbar\omega =
  2.82\,k_BT$, and the occupations of its modes (Part 10).
- Section IX's [*Counting or recording*](/paper/#par:counting-or-recording): "$10^{-30}$ gravitons or fewer on average"
  in each mode, and half a quantum of added noise (sections 8.5 and 8.6).
- [Section XI](/paper/#sec:vistas): the occupations $n_H$ and $n_{\rm bg}$ (section 11.3).
:::

::: deeper
- Dyson, "Is a graviton detectable?" [@Dyson2013].
- Griffiths and Schroeter, *Introduction to Quantum Mechanics* (3rd ed., 2018), section 2.3: the ladder argument.
:::

[^a]: This $a$ is a pure number, not the Kerr parameter, a shell's radius, the semi-major axis of section 1.8 or the
    chirp coefficient of section 8.2.

[^packet]: Waves of a lower frequency come in smaller packets. First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. V](/paper/#sec:waves), which
    gives the spinning pair's rate of one graviton every fifteen years (its equation [](/paper/#eq:dumbbell)).

[^heat]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV,
    [*What heat reveals*](/paper/#par:what-heat-reveals), with the ball's $4\times10^8$ quanta and its one graviton in a
    time of order $10^{18}$ years.

[^absorb]: From *The gravitational camera* (Mohsenvand 2026), Sec. IX,
    [*Arrival and absorption*](/paper/#par:arrival-and-absorption).

[^n]: This $n$ counts quanta. It is not the refractive index of section 5.1 or a number of particles per cubic metre.

[^alpha]: This $\alpha$ is neither an absorption coefficient nor the overall phase of section 8.1.

[^stays]: A check. Let $\chi = (a - \alpha e^{-i\omega t})\,\psi(t)$. Schrödinger's equation and $aH = Ha + \hbar\omega a$
    give $i\hbar\,\dd\chi/\dd t = (H + \hbar\omega)\,\chi$, an equation of Schrödinger's form, so $\chi$, which starts
    at zero, stays zero.
