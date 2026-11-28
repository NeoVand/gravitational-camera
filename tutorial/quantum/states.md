---
id: '8.1'
title: 'States, amplitudes and superposition'
question: 'A mass behind a wall is held in a superposition of two places a distance $d$ apart. What is a superposition of two places, and why does a camera that learns the place end it?'
part: '8'
requires: ['1.5b', '1.7', '2.3', '3.1']
paper: [sec:near-field, sec:holography, sec:second-order, sec:first-image]
figures: []
live: [two-paths]
depth: A
---

The locked safe of section [3.3](/tutorial/noise/measuring-a-number/) holds a bar of gold in one of two safes. Now
imagine a bar that is in both safes at once, which is not the same as a bar in one safe that nobody has found yet. Hold
a mass $\matter m$ behind a wall in such a state, in two places a distance $d$ apart, and aim a perfect camera at it.
What is a superposition of two places, and why does a camera that learns the place end it?[^limits]

![Look first at the two ladders: the same ball holds hundreds of millions of quanta in its ringing at room
temperature and almost none when cold. The camera's objects are quantum, and nearly always behave classically. The levels are
schematic, broken where hundreds of millions are left out; section 8.3 derives them.](tut-quantum-hero){#fig:quantum-hero}

::: plain
In quantum mechanics the state of a thing is a list of complex numbers, one for each way a measurement of it could come
out. These numbers are amplitudes, and the probability of each outcome is the square of the size of its amplitude.

When a particle can reach a detector along two paths, the two amplitudes are added first and only then squared. If they
point in opposite directions in the complex plane they cancel, so the particle never arrives where either path alone
would send it half the time. This interference makes a particle on both paths different from one on a path we do not know.

If anything outside keeps a record of the path, the cancellation weakens by as much as the possible records differ. A
camera sensitive enough to see where a mass is would be such a record, so it would end the mass's being in two places.
:::

## A quantum state is a list of complex amplitudes

A mass in two places is a particle that can go two ways, and the simplest device that offers two ways is a
**half-silvered mirror**, or **beam splitter**: a plate that lets half of the light falling on it through and reflects
the other half. A single particle of light sent at it leaves along one of two paths, which we name $L$ and $R$ (names,
not directions), and a crystal does the same for a neutron.

Two such mirrors, with the paths brought together between them, show a fact that probabilities cannot describe. A
particle that took one path or the other, each half the time, would reach each exit half the time. Yet with paths of
the right lengths no particle leaves by one of the exits. Probabilities of two ways to one outcome add and cannot cancel, since none is negative. So quantum mechanics
describes the particle by numbers that can cancel, a column of two complex numbers,

$$\sym{quantum-state}{|\psi\rangle} = \begin{pmatrix}\psi_L\\ \psi_R\end{pmatrix}, \qquad |\psi_L|^2 + |\psi_R|^2 = 1 .$$

This column is the particle's **quantum state**, and its entries $\sym{amplitude}{\psi_L}$ and $\psi_R$, complex
numbers with no unit, are the **amplitudes** of the two paths. The condition says that the column has length one,
measured with the
[Hermitian product](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) of section 1.5b. Dirac called a column such as $|\psi\rangle$
(read "ket psi") a **ket**. The paths are the kets $|L\rangle = (1, 0)$
and $|R\rangle = (0, 1)$, so $|\psi\rangle = \psi_L|L\rangle + \psi_R|R\rangle$.

For a second state $|\chi\rangle$, the row of its conjugated entries is written $\sym{bra}{\langle\chi|}$ and called a
**bra**. A bra times a ket is a **bracket**, a single complex number:[^bracket]

$$\sym{bracket}{\langle\chi|\psi\rangle} = \chi_L^*\psi_L + \chi_R^*\psi_R .$$

A state's bracket with itself is its squared length, $\langle\psi|\psi\rangle = 1$, and two states whose bracket is
zero are **orthogonal**, as $|L\rangle$ and $|R\rangle$ are.

An example is $(1, i)/\sqrt2$, with $|1/\sqrt2|^2 + |i/\sqrt2|^2 = \tfrac12 + \tfrac12 = 1$. A non-example is $(1, 1)$,
whose squared length is 2, so it must be divided by $\sqrt2$. The classical
[state](/tutorial/newton/hamilton/#a-state-is-a-position-and-a-momentum) of section 1.7 was a point $(q, p)$; a
quantum state gives an amplitude for each outcome of a measurement.

This description, the Born rule below, the rule for time and the rule for two things are postulates of quantum
mechanics, tested by experiment for a century. The wave function of a
particle of definite momentum is a further postulate.

## Probabilities are the squared sizes of amplitudes

A measurement can ask of the particle, "are you in the state $|\chi\rangle$?". The **Born rule**, the second postulate,
says that the answer is yes with the probability

$$\boxed{P = |\langle\chi|\psi\rangle|^2} .$$

Detectors on the two paths ask "$L$?" and "$R$?", and since $\langle L|\psi\rangle = \psi_L$ they click with the
probabilities $|\psi_L|^2$ and $|\psi_R|^2$. Their two states are **orthonormal**: each has length one and they are
orthogonal. Exactly one clicks each time, and the probabilities add to one because the state has length one, as
[probabilities](/tutorial/noise/probability/#a-reading-is-a-signal-plus-a-random-number) (section 3.1) must.

For $(1, i)/\sqrt2$ the probabilities are $\tfrac12$ each, and for $(\sqrt3, 1)/2$ they are $\tfrac34$ and $\tfrac14$.


Multiplying every amplitude by the same factor $e^{i\alpha}$, with $\alpha$ an angle in radians, multiplies every
bracket by a number of modulus one, so no probability changes: an **overall phase** has no effect, and
$e^{i\alpha}|\psi\rangle$ is the same physical state as $|\psi\rangle$. A **relative phase**, a factor on one amplitude
only, is different. The states $(1, 1)/\sqrt2$ and $(1, -1)/\sqrt2$ differ only by a sign, and the detectors on the
paths cannot tell them apart. But the question "are you in $(|L\rangle + |R\rangle)/\sqrt2$?" gets
yes every time from the first (the bracket is $\tfrac12(1 + 1) = 1$) and never from the second ($\tfrac12(1 - 1) =
0$). The next section builds a device that sends them out of different exits.

## Amplitudes add, so two paths can cancel

The simplest place to measure a relative phase is an instrument with two mirrors, and we want the probability that a
particle leaves each exit. We assume that **each mirror sends half of the particles each way** and
that **no particle is lost**.

A particle arriving along $L$ leaves the mirror along $L$ (through) with the amplitude $1/\sqrt2$, or along $R$
(reflected) with the amplitude $i/\sqrt2$, and one arriving along $R$ does the same with the roles exchanged. Written as
a table that multiplies the state, the mirror is

$$\sym{unitary-table}{U} = \frac{1}{\sqrt2}\begin{pmatrix} 1 & i\\ i & 1\end{pmatrix} .$$

Its first column is the state the mirror makes from $|L\rangle$, its second the one it makes from $|R\rangle$.[^U]
Some phase on reflection is needed, because with 1 in place of $i$ both columns would be $(1, 1)/\sqrt2$; we choose $i$
because it treats the two arrivals alike.

The **conjugate transpose** $U^\dagger$, the table with rows and columns swapped and every entry conjugated, satisfies

$$U^\dagger U = \frac12\begin{pmatrix} 1 & -i\\ -i & 1\end{pmatrix}\begin{pmatrix} 1 & i\\ i & 1\end{pmatrix} = \begin{pmatrix} 1 & 0\\ 0 & 1\end{pmatrix} .$$

A table with this property is **unitary**. It keeps every bracket, because the bra of $U|\chi\rangle$ is
$\langle\chi|U^\dagger$, so the bracket of $U|\chi\rangle$ with $U|\psi\rangle$ is $\langle\chi|U^\dagger
U|\psi\rangle = \langle\chi|\psi\rangle$. It keeps lengths too, so the probabilities still add to one.

Making path $L$ longer multiplies its amplitude by $e^{i\phi}$, where the phase $\sym{path-phase}{\phi}$, in radians,
grows with the extra length ([the wave function](#a-particle-on-a-line-is-described-by-a-wave-function) gives the rule).
This is the unitary table $D = \mathrm{diag}(e^{i\phi}, 1)$; since $e^{i\phi}$ is real only for a whole or a half turn,
amplitudes must be complex. A mirror, a delay on path
$L$ and a second mirror make a **Mach–Zehnder interferometer** (Figure [](#fig:mach-zehnder)), an **interferometer**
being any instrument that splits a wave and brings the parts together again.

![Look first at the second mirror, where the two paths meet. A particle sent in along $L$ leaves along $R$ with the
probability $\cos^2(\phi/2)$: every time when the delay is zero, never when it is half a turn. The dashed line is
$P_L = \sin^2(\phi/2)$.](tut-mach-zehnder){#fig:mach-zehnder}

A particle enters along $L$. The first mirror makes $U|L\rangle$, the delay turns the amplitude on $L$, and the second
mirror mixes the two amplitudes again:

$$\begin{aligned}
U|L\rangle &= \frac{1}{\sqrt2}\begin{pmatrix} 1\\ i\end{pmatrix},\\
DU|L\rangle &= \frac{1}{\sqrt2}\begin{pmatrix} e^{i\phi}\\ i\end{pmatrix},\\
UDU|L\rangle &= \frac12\begin{pmatrix} e^{i\phi} - 1\\ i\,(e^{i\phi} + 1)\end{pmatrix} .
\end{aligned}$$

The last line used the rows of $U$. By the Born rule the particle leaves along $R$ with the probability

$$\begin{aligned}
P_R &= \frac{|e^{i\phi} + 1|^2}{4} = \frac{(e^{i\phi} + 1)(e^{-i\phi} + 1)}{4}\\
&= \frac{2 + 2\cos\phi}{4} ,
\end{aligned}$$

and with $1 + \cos\phi = 2\cos^2(\phi/2)$,

$$\boxed{P_R = \cos^2\frac{\phi}{2}, \qquad P_L = \sin^2\frac{\phi}{2}} .$$

With no delay every particle leaves along $R$, at $\phi = \pi/2$ half of them do, and at $\phi = \pi$ none does. At
$\phi = \pi/2$ the delay and the second mirror are the device promised above: they turn
$(1, 1)/\sqrt2$ into $(i, 0)$, which always leaves along $L$, and $(1, -1)/\sqrt2$ into $(0, -1)$, which always leaves
along $R$.

The amplitude at exit $R$ is a sum of two terms, one for each path: $ie^{i\phi}/2$ by way of $L$ and $i/2$ by way of
$R$. Multiplying out $(a + b)^*(a + b)$ gives $|a + b|^2 = |a|^2 + |b|^2 + 2\,\mathrm{Re}(a^*b)$, so here

$$P_R = \frac14 + \frac14 + \frac12\cos\phi .$$

Each path alone contributes $\tfrac14$. The last term, the **interference term**, comes from adding amplitudes before
squaring and holds the whole dependence on $\phi$. At $\phi = \pi$ it cancels the two
quarters: this is the dark exit (Figure [](#fig:amplitude-arrows)).

![Look first at the right panel: the amplitudes of the two paths point opposite ways and cancel, although each alone
would give a probability of a quarter. Arrows that would lie on one another are drawn side by side.](tut-amplitude-arrows){#fig:amplitude-arrows}

**A limit.** Block path $R$ with an absorber. The particle reaches the second mirror only along $L$, with the
amplitude $e^{i\phi}/\sqrt2$, and leaves along each exit with the probability $\tfrac14$ at every $\phi$; the other
half of the particles are absorbed.

**What it means.** A particle "on one path, but we do not know which" is a **mixture**: half the time in $|L\rangle$
and half in $|R\rangle$, which gives $\tfrac12$ at every $\phi$. The particle in $(e^{i\phi}, i)/\sqrt2$ gives
anything from 0 to 1, so it is not on one path. A state that is a sum of other states with amplitudes is a
**superposition of states**,[^superposition] and a superposition is not ignorance about which of them holds.

## A state of definite energy turns at a rate set by its energy

A **state of definite energy** is one in which a measurement of the energy gives the same value every time. The third
postulate says that such a state, of energy $E$ in joules, evolves as

$$|\psi(t)\rangle = e^{-iEt/\hbar}\,|\psi(0)\rangle ,$$

where $t$ is the time in seconds and $\sym{hbar}{\hbar} = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck
constant of section
[0.6](/tutorial/evening/how-to-read/#every-number-says-what-it-measures-in-what-unit-and-against-what). The exponent
has no unit, since joules times seconds over joule seconds is a pure number. Writing $E = \hbar\omega$, the factor is the
[phasor](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number) $e^{-i\omega t}$ of
section 1.5b, with its minus sign: a state's energy is $\hbar$ times the angular frequency at which its amplitudes
turn.

**A check.** For one energy the factor is an overall phase, so no probability changes. Two orthonormal states of
definite energy $E_1$ and $E_2$, added as $(|E_1\rangle + |E_2\rangle)/\sqrt2$, gain the relative phase
$\phi = (E_1 - E_2)t/\hbar$, so the question "are you in that state still?" gets yes with the probability
$\cos^2(\phi/2)$, which beats at $|E_1 - E_2|/\hbar$. The rule for any state, Schrödinger's equation, is section
8.2's.

## A particle on a line is described by a wave function

For a particle on a line, the outcomes of "where is it?" are the positions $x$, in metres, and the list of amplitudes
becomes a complex function $\sym{wave-function}{\psi(x)}$, the **wave function**.[^psi] The probability of finding the
particle between $x$ and $x + \dd x$ is $|\psi(x)|^2\,\dd x$, so $|\psi|^2$ is a probability density (section 3.1), with
$\int|\psi|^2\,\dd x = 1$, and $\psi$ is measured in $\mathrm{m^{-1/2}}$. The bracket becomes the integral
$\langle\chi|\psi\rangle = \int\chi^*(x)\,\psi(x)\,\dd x$.

In the wave mechanics of de Broglie (1924) and Schrödinger (1926), a particle of definite momentum $p$, in
$\mathrm{kg\,m\,s^{-1}}$, and energy $E$ has the wave function $e^{i(px - Et)/\hbar}$. We state this. It is the
[ripple](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time)
$e^{i(kx - \omega t)}$ of section 2.6, with $E = \hbar\omega$ as before and $p = \hbar k$ for the wavenumber $k$. Its crests are
$2\pi/k$ apart, so the particle's **de Broglie wavelength** is

$$\boxed{\lambda = \frac{2\pi\hbar}{p}} ,$$

in metres, since joule seconds over $\mathrm{kg\,m\,s^{-1}}$ leave a length. Over an extra length $\ell$ of path the
ripple gains the factor $e^{ip\ell/\hbar}$, which is the interferometer's delay with $\phi = 2\pi\ell/\lambda$.

**Numbers.** With $2\pi\hbar = 6.63\times10^{-34}\unit{J\,s}$ and $p = \matter m v$:

- a neutron, $1.67\times10^{-27}$ kg, at $2200\unit{m\,s^{-1}}$, its typical speed at room temperature: $\lambda =
  6.63\times10^{-34}/(1.67\times10^{-27}\times2200) = 1.8\times10^{-10}$ m, about the spacing of the atoms in a
  crystal, which is why a crystal of silicon can split and recombine neutrons;
- a gram at $1\unit{mm\,s^{-1}}$: $6.63\times10^{-34}/10^{-6} = 6.6\times10^{-28}$ m, about a trillionth of the radius
  of a proton, $0.84\times10^{-15}$ m.

**What it means.** The ripple has $|e^{i(px - Et)/\hbar}|^2 = 1$ everywhere, so a particle of exactly known momentum is
equally likely to be anywhere and cannot be given length one. A **wave packet**, a
[sum of ripples](/tutorial/outside/fourier/#on-an-endless-line-the-sum-becomes-an-integral) with nearby wavenumbers
(section 2.6), is a particle that is somewhere; section 8.2 shows the trade between its width and its spread of
momenta. A mass in two places is two packets $d$ apart, $[\psi_L(x) + \psi_R(x)]/\sqrt2$. Each is much narrower than $d$, so
they do not overlap, their bracket is zero, and the sum is the state $(|L\rangle + |R\rangle)/\sqrt2$ of length one.

## A record of the place multiplies the interference by the overlap of the records

We compare two arrangements for a camera to tell apart. We assume that **the mass $\matter m$ and the body that moved it are an isolated system**, with the camera outside, and
that **the body that recoils is centred on the mass where it starts**, as a trap around the mass would be.[^centred] When the mass moves by $d$, the
body, of mass $\matter M$, recoils by $\matter md/\matter M$, because forces inside an isolated system cannot move its
[centre of mass](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel) (section 1.6). So
the two arrangements have the same mass and dipole and pull alike to first order. Their second moments,
the sums $\sum\matter mx^2$ of each mass times the square of its distance along the split, differ by
$\matter md^2(1 + \matter m/\matter M) \approx \matter md^2$, the scale of the difference in the
[quadrupole](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)
of section 2.3.

A camera at the distance $r$ on the line of the split sees the two tides differ by $12G\matter md^2/r^5$ (the box
below derives it). For a gram split by a micrometre, seen from $r = 1$ m, $\matter md^2 = 10^{-15}\unit{kg\,m^2}$, and

$$\begin{aligned}
\frac{12G\matter md^2}{r^5} &= 12\times6.67\times10^{-11}\times10^{-15}\unit{s^{-2}}\\ &= 8\times10^{-25}\unit{s^{-2}} .
\end{aligned}$$

That is $10^{-11}$ of the $6.5\times10^{-14}\unit{s^{-2}}$
that two grams a centimetre apart resolve in a second at
[the standard quantum limit](/tutorial/newton/reading-section-ii/#what-the-premise-asks-existing-instruments-nearly-supply)
(section R1). That is beyond any real instrument, but not a camera of arbitrary sensitivity.

::: derivation
### The tides of the two arrangements

Take the $x$ axis along the split, with the origin at the centre of mass and the camera at $x = r$. In branch $L$ the
mass and the body's centre are both at the origin. In branch $R$ the mass is at $d$ and the body at
$-\matter md/\matter M$. The dipole is $\matter md - \matter M(\matter md/\matter M) = 0$, and the second moment is
larger by $\matter md^2 + \matter M(\matter md/\matter M)^2 = \matter md^2(1 + \matter m/\matter M)$.

The tide along the line from a point mass $\matter m$ at the distance $\rho$ is $-2G\matter m/\rho^3$ ([section
1.4](/tutorial/newton/tides/)). In branch $R$ the mass is at $\rho = r - d$ and the body at $\rho = r + \matter md/\matter M$. We expand both with
$(1 + \epsilon)^{-3} \approx 1 - 3\epsilon + 6\epsilon^2$ and subtract branch $L$:

$$\begin{aligned}
\Delta\curv\tE_{xx} &= -\frac{2G}{r^3}\Bigl[\matter m\Bigl(\frac{3d}{r} + \frac{6d^2}{r^2}\Bigr)\\
&\qquad\quad - \frac{3\matter md}{r} + \frac{6\matter m^2d^2}{\matter Mr^2}\Bigr]\\
&= \boxed{-\frac{12G\matter md^2}{r^5}\Bigl(1 + \frac{\matter m}{\matter M}\Bigr)} .
\end{aligned}$$

The terms in $d$, the dipole's, cancel exactly, and the terms in $d^2$, the quadrupole's, are left. The unit is a
tide's, since $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\mathrm{kg\,m^2}$ over $\mathrm{m^5}$ is $\mathrm{s^{-2}}$.
:::

![Look first at the two rings, the pixel's two possible readings outside the wall: solid with the mass at $L$, dashed
with it at $R$. The more they differ, the smaller their overlap $\langle e_R|e_L\rangle$ and the shallower the fringes.
The difference is hugely exaggerated.](tut-mass-two-places){#fig:mass-two-places}

Now let anything outside the wall, such as a pixel's masses, end in the state $\sym{record-state}{|e_L\rangle}$ if the
mass is at $L$ and $|e_R\rangle$ if it is at $R$, each of length one (Figure [](#fig:mass-two-places)). The rule for two
things, a further postulate, is that the state of the mass and the record is a column with one amplitude for each pair
of outcomes. When each is in a state of its own, the amplitude of a pair is the product of the two amplitudes, written
$|L\rangle|e_L\rangle$, and the bracket of two products is the product of the brackets, $\langle
L\,e|R\,e'\rangle = \langle L|R\rangle\langle e|e'\rangle$, because each term of the sum over pairs is a term of one
bracket times a term of the other.

Treat the splitting and the later recombination of the mass as the two mirrors of the interferometer, with the record
made between them. The state there is
$(e^{i\phi}|L\rangle|e_L\rangle + i\,|R\rangle|e_R\rangle)/\sqrt2$, the state $(|L\rangle + |R\rangle)/\sqrt2$ with a
relative phase and a record attached. The second mirror acts on the mass alone: for each state of the record it mixes
the amplitudes of $L$ and $R$ with the table $U$. Its second row, $(i, 1)/\sqrt2$, shows that the part of the state that
leaves along $R$ is $|R\rangle|a\rangle$, with the record in

$$|a\rangle = \tfrac12\bigl(ie^{i\phi}|e_L\rangle + i\,|e_R\rangle\bigr) .$$

Let the states $|k\rangle$ be a **complete orthonormal set** of the record, one for each of its outcomes, so that every
state of the record is a sum of them. Then $|a\rangle = \sum_kc_k|k\rangle$, and the bracket with $|k\rangle$ gives
$c_k = \langle k|a\rangle$, the amplitude for "$R$ and $k$". Because $\langle k|k'\rangle$ is one for $k = k'$ and zero
otherwise, the Born rule gives the probabilities, added over $k$,

$$\sum_k|\langle k|a\rangle|^2 = \sum_{k,k'}c_k^*c_{k'}\langle k|k'\rangle = \langle a|a\rangle .$$

A cross term carries $(-i)(i) = 1$, and $z + z^* = 2\,\mathrm{Re}\,z$:

$$\begin{aligned}
P_R = \langle a|a\rangle &= \tfrac14\bigl[1 + 1 + e^{i\phi}\langle e_R|e_L\rangle\\
&\qquad + e^{-i\phi}\langle e_L|e_R\rangle\bigr]\\
&= \boxed{\tfrac12\Bigl[1 + \mathrm{Re}\bigl(\langle e_R|e_L\rangle\,e^{i\phi}\bigr)\Bigr]} .
\end{aligned}$$

**Checks.** If the records are the same, the overlap $\langle e_R|e_L\rangle$ is one and $P_R = \tfrac12(1 + \cos\phi)
= \cos^2(\phi/2)$, the interferometer's fringes. If the records are orthogonal, $P_R = \tfrac12$ at every $\phi$, the
mixture. For a record with two outcomes, $|e_L\rangle = (1, 0)$ and $|e_R\rangle = (\cos\theta, \sin\theta)$, the
overlap is $\cos\theta$ and $P_R = \tfrac12(1 + \cos\theta\cos\phi)$: at $\theta = 60^\circ$ the fringes swing only
between 0.25 and 0.75, and at $\theta = 90^\circ$ they vanish.

**What it means.** A record that tells the paths apart is **which-path information**, and it multiplies the interference
term by the overlap of the records. When the records are carried by the **environment**, the many things outside that
touch the mass (air, light, the field itself), the overlaps of its many parts multiply and the product falls quickly to
zero. This loss of interference is **decoherence**. A camera whose two readings differ by many times its noise makes
records with almost no overlap. If each reading is a wave packet of the camera's pointer (the part whose position
shows the reading) of standard deviation $\sigma$, two readings $\Delta$ apart overlap by $e^{-\Delta^2/8\sigma^2}$:
0.88 when $\Delta = \sigma$ and 0.04 when $\Delta = 5\sigma$.[^gauss] So a camera's picture leaves the mass behaving
as if it were in one place: a perfect camera is a perfect source of decoherence.

A puzzle remains. A camera that read the quadrupole before light from the recombination could reach it would learn
which way the mass went sooner than **causality**, the rule that no effect travels faster than light, allows. We state
the resolution without proof [@Belenchia2018; @DanielsonSatishchandranWald2022]: the quantum jitter of the field in empty
space limits what a camera can learn in the time available, and whenever a camera could learn enough, recombining the
mass radiates the record away, so the fringes are lost whether or not it looks.[^slow] Section
[13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell) returns to decoherence by gravity.
The box below estimates why the two halves of this resolution meet.

::: derivation
### An estimate: the camera learns the place only when the mass radiates it

We want the size of quadrupole at which a camera could learn the place in time, and the number of gravitons that
recombining the mass then radiates. Let the camera stand at the distance $r$, and let the recombination take the time
$T$. We assume that **the camera must finish within $T \le r/c$**, before light from the recombination arrives, and
we keep only orders of magnitude, with $Q \approx \matter md^2$ the difference of the quadrupoles in
$\mathrm{kg\,m^2}$.

**What the camera can learn.** In the time $T$, two free masses of a pixel $\xi$ apart move under the difference of the
tides, $12GQ/r^5$, by $\tfrac12(12GQ/r^5)\,\xi T^2$. The pixel stands outside the wall, so $\xi < r$, and $T \le r/c$,
so this displacement is less than $6GQ/c^2r^2 \le 6GQ/c^4T^2$. Belenchia and colleagues (2018) argue from the vacuum
fluctuations of the field that no probe can be localized to better than about the **Planck length**
[@Belenchia2018],

$$\ell_P = \sqrt{\frac{\hbar G}{c^3}} = 1.6\times10^{-35}\unit m .$$

A plausibility argument: to locate a body within $\Delta x$ takes a quantum of momentum $\hbar/\Delta x$, so of energy
about $\hbar c/\Delta x$, inside $\Delta x$; once $\Delta x$ is smaller than the Schwarzschild radius $2GE/c^4$ of that
energy ([section 11.1](/tutorial/black-holes/schwarzschild/)), the region is a black hole and hides the answer, so
$\Delta x^2 \gtrsim 2G\hbar/c^3$. The camera can therefore tell the places apart only if $6GQ/c^4T^2 > \ell_P$, that is,
if

$$Q \gtrsim \frac{\ell_Pc^4T^2}{6G} = \frac{\matter m_P(cT)^2}{6} ,$$

where $\matter m_P = \sqrt{\hbar c/G} = 2.18\times10^{-8}$ kg is the **Planck mass**, since $\ell_Pc^2/G = \matter m_P$.

**What recombining radiates.** The quadrupole changes by about $Q$ in the time $T$, so its third derivative is about
$Q/T^3$, and the quadrupole formula of
[section 7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole),
$(G/5c^5)\langle\dddot{\matter I}_{ij}\dddot{\matter I}_{ij}\rangle$, gives a power of order $GQ^2/c^5T^6$ for a time
$T$, an energy of order $GQ^2/c^5T^5$. Its gravitons have angular frequencies of order $1/T$, so each carries about
$\hbar/T$, and their number is about

$$N_g \approx \frac{GQ^2}{\hbar c^5T^4} = \Bigl(\frac{Q}{\matter m_Pc^2T^2}\Bigr)^2 ,$$

using $G/\hbar c^5 = 1/\matter m_P^2c^4$. Both conditions are set by the one ratio $Q/\matter m_P(cT)^2$, a pure number:
when it is large enough for the camera to read the place, $N_g$ is at least about $(\tfrac16)^2$, of order one by the
standards of an estimate that drops such factors, and the gravitons carry a record of the place away whether or not the
camera looks. So the camera never learns what the field has not already
recorded, and causality is safe, up to the factors of order one that an estimate leaves open.

**A number.** For a gram split by a micrometre, $Q = 10^{-15}\unit{kg\,m^2}$, read from $r = 1$ m in $T = r/c =
3.3$ ns, $\matter m_P(cT)^2 = 2.2\times10^{-8}\unit{kg\,m^2}$ and the ratio is $4.6\times10^{-8}$. The pixel's masses
move by less than $4.5\times10^{-42}$ m, $3\times10^{-7}$ of the Planck length, and the recombination radiates about
$2\times10^{-15}$ gravitons. Neither the camera nor the field keeps a record, and the gram keeps its fringes. **A
limit.** A slower recombination radiates less, as $1/T^4$, and for $T$ much longer than $r/c$ it radiates nothing that
matters; but then light from the recombination reaches the camera before it has finished, causality is not at stake,
and the camera's own reading ends the superposition.
:::

::: try {#two-paths}
The interferometer of Figure [](#fig:mach-zehnder) with a bar at each exit for its probability, the two amplitudes that
reach exit $R$ drawn head to tail with their sum, and the fringes of $P_R$ against the delay. Sliders set the delay
$\phi$ and the quality of the record, from none (overlap 1) to perfect (overlap 0); a button blocks path
$R$. Answer the predictions first. Then set the overlap to 0.5 and say which part of the
amplitude at exit $R$ no longer adds to the other path's.
:::

**The idea to keep: a quantum state is a list of complex amplitudes whose squared sizes are probabilities. Amplitudes
of different paths add before they are squared, so they can cancel, and any record of which path was taken multiplies
that cancellation by the overlap of the records. A camera good enough to see where a quantum mass is would therefore
end its being in two places.**

::: problems
### Practice

**[8.1]** A state is $(3, 4i)/5$. What are the probabilities of its two outcomes?

::: solution
They are $|3/5|^2 = \tfrac{9}{25}$ and $|4i/5|^2 = \tfrac{16}{25}$, which add to one.
:::

**[8.1]** Multiply the three tables of the interferometer and find both exit probabilities at $\phi = \pi/3$.

::: solution
The product is $UDU|L\rangle = \tfrac12(e^{i\pi/3} - 1,\ i(e^{i\pi/3} + 1))$. With $e^{i\pi/3} = \tfrac12 + \tfrac{\sqrt3}{2}i$,
$|e^{i\pi/3} + 1|^2 = 3$ and $|e^{i\pi/3} - 1|^2 = 1$, so $P_R = \tfrac34$ and $P_L = \tfrac14$, which are
$\cos^2(\pi/6)$ and $\sin^2(\pi/6)$.
:::

**[8.1]** What is the de Broglie wavelength of a gram moving at a millimetre a second, and why do we never see a gram
interfere?

::: solution
It is $6.6\times10^{-28}$ m, far smaller than any gap. And the air, the light and the
support that touch a gram keep records of where it is, so the interference is gone.
:::



### Stretch

**[8.1]** A detector at exit $R$ counts $n$ of $N$ particles. How many particles are needed to measure $\phi$ near
$\pi/2$ to 0.01 rad (section 3.1)?

::: solution
Each particle counts 1 with probability $p = \cos^2(\phi/2)$, with variance $p - p^2$.
Variances add, so $n/N$ has the standard deviation $\sqrt{p(1 - p)/N} =
|\sin\phi|/2\sqrt N$, while $p$ changes by $\tfrac12|\sin\phi|$ per radian. So $\sigma_\phi = 1/\sqrt N$ away from 0 and
$\pi$, and 0.01 rad needs $N = 10^4$.
:::

**[8.1]** A mass split by a millimetre is brought back together in a nanosecond, and a camera watches from $r = cT$.
How large must the mass be for the camera to read the place, by the estimate of the box, and how many gravitons does
the recombination then radiate?

::: solution
The threshold is $Q \approx \matter m_P(cT)^2/6 = 2.18\times10^{-8}\times0.300^2/6 = 3.3\times10^{-10}\unit{kg\,m^2}$,
so $\matter m = Q/d^2 = 3.3\times10^{-4}$ kg, a third of a gram. There $Q/\matter m_P(cT)^2 = \tfrac16$ and $N_g \approx
(\tfrac16)^2 = 0.03$. The factor 6 enters squared, and an estimate cannot fix it; what the estimate shows is that both
thresholds are set by the same ratio.
:::

### The camera

**[8.1]** The two branches differ in their quadrupole by about $\matter md^2$ when the body that recoils is centred on
the mass. Let the mass instead start a distance $s$ along $x$ from that body's centre, and find the change of the second
moment between the two branches.

::: solution
With the origin at the centre of mass, let the mass start at $x_1$ and the body at $x_2$, with $x_1 - x_2 = s$. In
branch $R$ the mass moves by $d$ and the body by $-\matter md/\matter M$, so the dipole changes by $\matter md -
\matter md = 0$, and the second moment by $\matter m(2x_1d + d^2) + \matter M(-2x_2\matter md/\matter M +
\matter m^2d^2/\matter M^2) = 2\matter mds + \matter md^2(1 + \matter m/\matter M)$. It is about $\matter md^2$ only
when $s$ is at most of order $d$. A separate body beside a gram of gold has its centre at least the
gram's radius, 2.3 mm, away, so at $d = 1\unit{\mu m}$ the change is $(2s/d + 1)\,\matter md^2 \approx 5\times10^3\,\matter md^2$.
:::
:::

::: paper
- [Section IV's *Limits on sensitivity*](/paper/#par:limits-on-sensitivity), second paragraph: the mass in two places,
  its quadrupole, the paradox and its resolution, and "a perfect source of decoherence".
- [Section XIII](/paper/#sec:second-order): "the impulse is $e^{i\epsilon Q_g/\hbar}$", a phase turned by a quantity
  of the body (section 8.2).
- [Section IX's *Counting or recording*](/paper/#par:counting-or-recording): the states of a mode and their quanta
  (sections 8.3 and 8.6).
:::

::: deeper
- Feynman, Leighton and Sands, *The Feynman Lectures on Physics*, vol. III (1965), chapters 1 and 3: amplitudes, two
  paths and which-path information.
:::

[^bracket]: Section 1.5b put the conjugate on the second factor, $\vect a\cdot\vect b^*$; physics books put it on the
    first, so $\langle\chi|\psi\rangle$ is 1.5b's $\psi\cdot\chi^*$.

[^U]: This $U$ is not the potential energy of section 1.2.

[^superposition]: Not the
    [superposition](/tutorial/newton/field-and-potential/#the-field-is-the-pull-per-unit-mass-and-fields-add) of fields in section 1.2: here amplitudes are added.

[^psi]: This $\psi$ is not the null-space potential of section 2.5.

[^centred]: For a separate body the change can be far larger (the last problem).

[^limits]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV,
    [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity).

[^gauss]: The packet $\psi(x) = (2\pi\sigma^2)^{-1/4}e^{-x^2/4\sigma^2}$ has $|\psi|^2$ a bell curve of standard
    deviation $\sigma$. In $\int\psi(x)\,\psi(x - \Delta)\,\dd x$, completing the square leaves
    $e^{-\Delta^2/8\sigma^2}$ times the integral of a bell curve, which is one.

[^slow]: This is for a quick recombination. For a slower one Danielson,
    Satishchandran and Wald find the camera's measurement to be the cause.
