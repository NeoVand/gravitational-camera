---
id: '8.1'
title: 'States, amplitudes and superposition'
question: 'Section IV holds a mass behind a wall "in a superposition of two places a distance $d$ apart" and concludes that "a perfect camera is therefore a perfect source of decoherence". What is a superposition of two places, and why does a camera that learns the place end it?'
part: '8'
requires: ['1.5b', '1.7', '2.3', '3.1']
paper: [sec:near-field, sec:holography, sec:second-order, sec:first-image]
figures: []
live: []
depth: A
---

The paper's paragraph [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity), in its Section IV, ends with a
scene that no classical camera meets: "Hold a mass $m$ behind a wall in a superposition of two places a distance $d$
apart." It concludes: "A perfect camera is therefore a perfect source of decoherence: its picture of
a quantum object through a wall ends the object's superposition." Chapter
[R3](/tutorial/noise/reading-section-iv-2/#physics-outside-part-3-caps-the-sensitivity-near-1070) read the first
sentence as a quantum state that holds both places at once, and left its meaning to this chapter.

Recall the locked safe of Part 3: two identical steel safes, with a bar of gold of 324 kg in the right-hand one. Now
imagine a bar that is in both safes at once, which is not the same as a bar in one safe that nobody has found yet. What
is a superposition of two places, and why does a camera that learns the place end it? We build the answer from a
particle that can go two ways.

<!-- diagram: tut-quantum-hero — The hero of Part 8 as a whole, drawn once for the part and shown at the head of each of
its chapters (8.2 to 8.7 show it too). It tells the part's story, that the camera's objects are quantum and nearly
always behave classically, not this chapter's; this chapter's own scene is diagram tut-mass-two-places. In the stone
pipeline of the paper's 3D figures (FIGURE_WORKFLOW.md), about 680 × 380 px at 1440 and full width on a phone. Left:
the steel ball of radius 10 cm of chapter 4.1, in polished stone, beside a second copy of itself drawn cold and
frosted. Right of each ball, its lowest quadrupole mode drawn as a ladder of evenly spaced thin horizontal levels
(spacing ħω, a few dozen drawn, the ladder fading upward to show that it continues). On the warm ball's ladder the
levels are filled up to a soft band labelled "about 4 × 10⁸ quanta at 300 K" (chapter 4.1's k_BT/ħω = 4.2 × 10⁸ at
15 kHz); on the cold ball's ladder only the lowest level is filled, labelled "zero point, ½ħω". No orange or blue
(they mean stretch and squeeze). Labels beside the ladders, never on a level. Caption: "Look first at the two ladders:
the same ball holds hundreds of millions of quanta in its ringing at room temperature and almost none when cold. The
camera's objects are quantum, and nearly always behave classically. The ladder's levels are schematic; chapter 8.3
derives them." -->

::: plain
In quantum mechanics the state of a thing is a list of complex numbers, one for each way a measurement of it could come
out. These numbers are amplitudes, and the probability of each outcome is the square of the size of its
amplitude.

When a particle can reach the same detector along two paths, the amplitudes of the two paths are added first and only
then squared. Two amplitudes that point in opposite directions in the complex plane cancel, so the particle may never
arrive at a place where either path alone would send it half the time. This cancellation, interference, is what makes
a particle on both paths different from a particle on one path that we do not know.

If anything outside keeps a record of which path the particle took, the cancellation weakens by as much as the two
possible records differ. A camera sensitive enough to see where a mass is would be such a record, so it would end the
mass's being in two places.
:::

## A quantum state is a list of complex amplitudes

We want a description of a particle that can go two ways, because the paper's mass in two places is one. The simplest
device that offers two ways is a **half-silvered mirror**, or **beam splitter**: a plate that lets half of the light
falling on it through and reflects the other half. A single particle of light sent at it leaves along one of two
paths, which we name $L$ and $R$ (names, not directions), and a crystal does the same for a neutron.

Two such mirrors, with the paths brought together between them, show a fact that probabilities cannot describe. A
particle that took one path or the other, each half the time, would reach each exit half the time. Yet with paths of
the right lengths no particle leaves by one of the exits. Probabilities of two ways to the same outcome add, and
because none is negative they cannot cancel. So quantum mechanics describes the particle by numbers that can cancel, a
column of two complex numbers,

$$\sym{quantum-state}{|\psi\rangle} = \begin{pmatrix}\psi_L\\ \psi_R\end{pmatrix}, \qquad |\psi_L|^2 + |\psi_R|^2 = 1 .$$

This column is the particle's **quantum state**, and its entries $\sym{amplitude}{\psi_L}$ and $\psi_R$, complex
numbers with no unit, are the **amplitudes** of the two paths. The condition says that the column has length one,
measured with chapter 1.5b's
[Hermitian product](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero). The sign
$|\psi\rangle$, read "ket psi", is Paul Dirac's name for a column, a **ket**. The paths are the kets $|L\rangle = (1, 0)$
and $|R\rangle = (0, 1)$, so $|\psi\rangle = \psi_L|L\rangle + \psi_R|R\rangle$.

For a second state $|\chi\rangle$, the row of its conjugated entries is written $\sym{bra}{\langle\chi|}$ and called a
**bra**. A bra times a ket is a **bracket**, a single complex number:[^bracket]

$$\sym{bracket}{\langle\chi|\psi\rangle} = \chi_L^*\psi_L + \chi_R^*\psi_R .$$

A state's bracket with itself is its squared length, $\langle\psi|\psi\rangle = 1$, and two states whose bracket is
zero are **orthogonal**, as $|L\rangle$ and $|R\rangle$ are.

An example is $(1, i)/\sqrt2$, with $|1/\sqrt2|^2 + |i/\sqrt2|^2 = \tfrac12 + \tfrac12 = 1$. A non-example is $(1, 1)$,
whose squared length is 2; it describes nothing until it is divided by $\sqrt2$. Chapter 1.7's classical
[state](/tutorial/newton/hamilton/#a-state-is-a-position-and-a-momentum) was a point $(q, p)$, the values of a
position and a momentum. A quantum state gives no values: it gives an amplitude for each outcome of a measurement.

This description, the Born rule and the rule for time below are not derived from anything earlier. They are
postulates of quantum mechanics, tested by experiment for a century.[^tested] The wave function of a particle of
definite momentum and the rule for two things, later on, are further postulates, and the rest of the chapter is derived
from them.

## Probabilities are the squared sizes of amplitudes

A measurement can ask of the particle, "are you in the state $|\chi\rangle$?". The **Born rule**, the second postulate,
says that the answer is yes with the probability

$$\boxed{P = |\langle\chi|\psi\rangle|^2} .$$

Detectors on the two paths ask "$L$?" and "$R$?", and since $\langle L|\psi\rangle = \psi_L$ they click with the
probabilities $|\psi_L|^2$ and $|\psi_R|^2$. Their two states are **orthonormal**: each has length one and they are
orthogonal. Exactly one clicks each time, and the probabilities add to one because the state has length one, as chapter
3.1's [probabilities](/tutorial/noise/probability/#a-reading-is-a-signal-plus-a-random-number) must.
A probability is measured by sending many particles, one at a time, and counting the fraction that click.

For $(1, i)/\sqrt2$ the two probabilities are $\tfrac12$ each, and for $(\sqrt3, 1)/2$ they are $\tfrac34$ and
$\tfrac14$.

Multiplying every amplitude by the same factor $e^{i\alpha}$, with $\alpha$ an angle in radians, multiplies every
bracket by a number of modulus one, so no probability changes: an **overall phase** has no effect, and
$e^{i\alpha}|\psi\rangle$ is the same physical state as $|\psi\rangle$. A **relative phase**, a factor on one amplitude
only, is different. The states $(1, 1)/\sqrt2$ and $(1, -1)/\sqrt2$ differ only by the sign of one amplitude, and the
detectors on the paths cannot tell them apart. But the question "are you in $(|L\rangle + |R\rangle)/\sqrt2$?" gets
yes every time from the first (the bracket is $\tfrac12(1 + 1) = 1$) and never from the second ($\tfrac12(1 - 1) =
0$). The next section builds a device that tells them apart, sending the first state out of one exit every time and the
second out of the other.

## Amplitudes add, so two paths can cancel

We want the probability that a particle leaves each exit of an instrument with two mirrors, because it is the simplest
place to measure a relative phase. We assume that **each mirror sends half of the particles each way** and
that **no particle is lost**.

A particle arriving along $L$ leaves the mirror along $L$ (through) with the amplitude $1/\sqrt2$, or along $R$
(reflected) with the amplitude $i/\sqrt2$, and one arriving along $R$ does the same with the roles exchanged. Written as
a table that multiplies the state, the mirror is

$$\sym{unitary-table}{U} = \frac{1}{\sqrt2}\begin{pmatrix} 1 & i\\ i & 1\end{pmatrix} .$$

Its first column is the state the mirror makes from $|L\rangle$, its second the one it makes from $|R\rangle$.[^U]
Some phase on reflection is needed, because with 1 in place of $i$ both columns would be $(1, 1)/\sqrt2$ and two
different arrivals would leave in the same state. The real table with rows $(1, 1)$ and $(1, -1)$, over $\sqrt2$,
would also work. We choose $i$ because it treats the two arrivals alike, as a plate with two equal faces does.

The **conjugate transpose** $U^\dagger$, the table with rows and columns swapped and every entry conjugated, satisfies

$$U^\dagger U = \frac12\begin{pmatrix} 1 & -i\\ -i & 1\end{pmatrix}\begin{pmatrix} 1 & i\\ i & 1\end{pmatrix} = \begin{pmatrix} 1 & 0\\ 0 & 1\end{pmatrix} .$$

A table with this property is **unitary**. It keeps every bracket, because the bra of $U|\chi\rangle$ is
$\langle\chi|U^\dagger$, so the bracket of $U|\chi\rangle$ with $U|\psi\rangle$ is $\langle\chi|U^\dagger
U|\psi\rangle = \langle\chi|\psi\rangle$. So it keeps lengths, and the probabilities still add to one.

Making path $L$ longer multiplies its amplitude by $e^{i\phi}$, where the phase $\sym{path-phase}{\phi}$, in radians,
grows with the extra length ([the wave function](#a-particle-on-a-line-is-described-by-a-wave-function) gives the rule).
This is the unitary table $D = \mathrm{diag}(e^{i\phi}, 1)$, and because $e^{i\phi}$ is real only for a whole or a half
turn, it is one reason that amplitudes must be complex, whichever table the mirror is given. A mirror, a delay on path
$L$ and a second mirror make a **Mach–Zehnder interferometer**, an **interferometer** being any instrument that splits a
wave and brings the parts together again.

<!-- diagram: tut-mach-zehnder — One panel, about 560 × 300 px at 1440 (full width on a phone). A thin ink arrow enters
from the left along a horizontal line labelled "L in". It meets the first half-silvered mirror (a short thick grey line
at 45°), from which two paths leave: path L straight on, then turned down by a full mirror (short black line), and
path R reflected upward, then turned right by a second full mirror, forming a rectangle. On path L a small light-grey
plate labelled "delay φ". The two paths meet at the second half-silvered mirror at the far corner, from which two exits
leave, labelled "exit L" and "exit R", each ending at a small detector glyph. Beside the panel, a small plot of
P_R = cos²(φ/2) for φ from 0 to 2π (ink line, pure numbers on the axes, ticks at 0, π, 2π), with P_L = sin²(φ/2) as a
dashed line. No orange or blue. Labels beside the paths, never on them. Caption: "Look first at the second mirror,
where the two paths meet. A particle sent in along L leaves along R with the probability cos²(φ/2): every time when
the delay is zero, never when it is half a turn." -->

A particle enters along $L$. The first mirror makes $U|L\rangle$, the delay turns the amplitude on $L$, and the second
mirror mixes the two amplitudes again:

$$\begin{aligned}
U|L\rangle &= \frac{1}{\sqrt2}\begin{pmatrix} 1\\ i\end{pmatrix},\\
DU|L\rangle &= \frac{1}{\sqrt2}\begin{pmatrix} e^{i\phi}\\ i\end{pmatrix},\\
UDU|L\rangle &= \frac12\begin{pmatrix} e^{i\phi} - 1\\ i\,(e^{i\phi} + 1)\end{pmatrix} .
\end{aligned}$$

The last line used the rows of $U$: the first gives $(e^{i\phi} + i\cdot i)/2$, the second $(i e^{i\phi} + i)/2$. By the
Born rule the particle leaves along $R$ with the probability

$$\begin{aligned}
P_R &= \frac{|e^{i\phi} + 1|^2}{4} = \frac{(e^{i\phi} + 1)(e^{-i\phi} + 1)}{4}\\
&= \frac{2 + 2\cos\phi}{4} ,
\end{aligned}$$

and with $1 + \cos\phi = 2\cos^2(\phi/2)$,

$$\boxed{P_R = \cos^2\frac{\phi}{2}, \qquad P_L = \sin^2\frac{\phi}{2}} .$$

With no delay every particle leaves along $R$, at $\phi = \pi/2$ half of them do, and at $\phi = \pi$ none does. The
delay and the second mirror on their own are the device promised in the last section. With $\phi = \pi/2$ they turn
$(1, 1)/\sqrt2$ into $(i, 0)$, which always leaves along $L$, and $(1, -1)/\sqrt2$ into $(0, -1)$, which always leaves
along $R$.

The amplitude at exit $R$ is a sum of two terms, one for each path: $ie^{i\phi}/2$ by way of $L$ and $i/2$ by way of
$R$. For any two complex numbers, $|a + b|^2 = |a|^2 + |b|^2 + 2\,\mathrm{Re}(a^*b)$, as multiplying out
$(a + b)^*(a + b)$ shows. Here it gives

$$P_R = \frac14 + \frac14 + \frac12\cos\phi .$$

Each path alone contributes $\tfrac14$. The last term, the **interference term**, comes from adding amplitudes before
squaring, and it holds the whole dependence on $\phi$. It can be negative, and at $\phi = \pi$ it cancels the two
quarters: this is the dark exit that no list of probabilities could give.

<!-- diagram: tut-amplitude-arrows — Two small panels side by side, about 560 × 260 px at 1440 (stacked on a phone),
each a complex plane with thin grey axes. Left, "φ = 0": two equal ink arrows of length ½, both pointing straight up
(each is i/2), drawn head to tail, reaching i; a thicker arrow from the origin to i, labelled "sum, length 1". Right,
"φ = π": the first arrow i e^{iπ}/2 = −i/2 points down, the second i/2 points up from its head, and the sum returns to
the origin, marked with a small open circle labelled "sum 0". Below each panel the probability as a squared length:
"P_R = 1" and "P_R = 0", and in smaller type "each arrow alone: ¼". No orange or blue. Caption: "Look first at the
right panel: the amplitudes of the two paths point opposite ways and cancel, although each alone would give a
probability of a quarter. Amplitudes add; their squared lengths are the probabilities." -->

**A limit.** Block path $R$ with an absorber. The particle then reaches the second mirror only along $L$, with the
amplitude $e^{i\phi}/\sqrt2$, and leaves along each exit with an amplitude of size $\tfrac12$, so with the probability
$\tfrac14$ at every $\phi$; the other half of the particles are absorbed. With one term left, nothing interferes.

**What it means.** A particle that is "on one path, but we do not know which" is a **mixture**: half the time in
$|L\rangle$ and half in $|R\rangle$, each of which gives $\tfrac12$ at each exit, so $\tfrac12$ at every $\phi$. The
particle in $(e^{i\phi}, i)/\sqrt2$ gives anything from 0 to 1, so it is not on one path. A state that is a sum of other
states with amplitudes is a **superposition of states**,[^superposition] and a superposition is not ignorance about
which of them holds.

## A state of definite energy turns at a rate set by its energy

A **state of definite energy** is one in which a measurement of the energy gives the same value every time. The third
postulate says that such a state, of energy $E$ in joules, evolves as

$$|\psi(t)\rangle = e^{-iEt/\hbar}\,|\psi(0)\rangle ,$$

where $t$ is the time in seconds and $\sym{hbar}{\hbar} = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck
constant of chapter
[0.6](/tutorial/evening/how-to-read/#every-number-says-what-it-measures-in-what-unit-and-against-what). The exponent
has no unit, since joules times seconds over joule seconds is a pure number. Writing $E = \hbar\omega$, the factor is
chapter 1.5b's [phasor](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number)
$e^{-i\omega t}$, with the paper's minus sign: a state's energy is $\hbar$ times the angular frequency at which its
amplitudes turn.

**A check.** For one energy the factor is an overall phase, so no probability changes. Two orthonormal states of
definite energy $E_1$ and $E_2$, added as $(|E_1\rangle + |E_2\rangle)/\sqrt2$, gain the relative phase
$\phi = (E_1 - E_2)t/\hbar$. By the interferometer's algebra the question "are you in that state still?" then gets yes
with the probability $\cos^2(\phi/2)$, which beats at $|E_1 - E_2|/\hbar$. The rule for any state, Schrödinger's
equation, is chapter 8.2's.

## A particle on a line is described by a wave function

For a particle on a line, the outcomes of "where is it?" are the positions $x$, in metres, and the list of amplitudes
becomes a complex function $\sym{wave-function}{\psi(x)}$, the **wave function**.[^psi] The probability of finding the
particle between $x$ and $x + \dd x$ is $|\psi(x)|^2\,\dd x$, so $|\psi|^2$ is chapter 3.1's probability density, with
$\int|\psi|^2\,\dd x = 1$, and $\psi$ is measured in $\mathrm{m^{-1/2}}$. The bracket becomes an integral,
$\langle\chi|\psi\rangle = \int\chi^*(x)\,\psi(x)\,\dd x$, the column's sum of products taken over every position.

Louis de Broglie proposed in 1924 that a particle of momentum $p$, in $\mathrm{kg\,m\,s^{-1}}$, has a wavelength, and
in Erwin Schrödinger's wave mechanics of 1926 a particle of definite momentum $p$ and energy $E$ has the wave function
$e^{i(px - Et)/\hbar}$. We state this. It is chapter 2.6's
[ripple](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time)
$e^{i(kx - \omega t)}$, with $E = \hbar\omega$ as before and $p = \hbar k$ for the wavenumber $k$. Its crests are
$2\pi/k$ apart, so the particle's **de Broglie wavelength** is

$$\boxed{\lambda = \frac{2\pi\hbar}{p}} ,$$

in metres, since joule seconds over $\mathrm{kg\,m\,s^{-1}}$ leave a length. Over an extra length $\ell$ of path the
ripple gains the factor $e^{ip\ell/\hbar}$, which is the interferometer's delay with $\phi = 2\pi\ell/\lambda$.

**Numbers.** With $2\pi\hbar = 6.63\times10^{-34}\unit{J\,s}$ and $p = \matter m v$:

- a neutron, $1.67\times10^{-27}$ kg, at $2200\unit{m\,s^{-1}}$, its typical speed at room temperature: $\lambda =
  6.63\times10^{-34}/(1.67\times10^{-27}\times2200) = 1.8\times10^{-10}$ m, or 0.18 nm. That is about the spacing of
  the atoms in a crystal, which is why a crystal of silicon can split and recombine neutrons;
- a gram at $1\unit{mm\,s^{-1}}$: $6.63\times10^{-34}/10^{-6} = 6.6\times10^{-28}$ m, about a trillionth of the radius
  of a proton, $0.84\times10^{-15}$ m;
- a person of 70 kg walking at $1.4\unit{m\,s^{-1}}$: $6.63\times10^{-34}/98 = 6.8\times10^{-36}$ m, about
  $10^{-20}$ of a proton's radius.

**What it means.** The ripple has $|e^{i(px - Et)/\hbar}|^2 = 1$ everywhere: a particle of exactly known momentum is
equally likely to be anywhere, and its wave function cannot be given length one. A **wave packet**, chapter 2.6's
[sum of ripples](/tutorial/outside/fourier/#on-an-endless-line-the-sum-becomes-an-integral) with nearby wavenumbers,
is a particle that is somewhere; chapter 8.2 shows the trade between its width and its spread of momenta. The paper's
mass in two places is a wave function made of two packets $d$ apart, $[\psi_L(x) + \psi_R(x)]/\sqrt2$. Each packet is
much narrower than $d$, so the two do not overlap, their bracket is zero, and the sum has length one: it is the state
$(|L\rangle + |R\rangle)/\sqrt2$.

## A record of the place multiplies the interference by the overlap of the records

We build the paper's scene as two arrangements for a camera to tell apart. We assume that **the mass $\matter m$ and
the body that moved it are an isolated system**, with the camera outside, and that **the body that recoils is centred
on the mass where it starts**, as a trap or holder around the mass would be.[^centred] When the mass moves by $d$, the
body, of mass $\matter M$, recoils by $\matter md/\matter M$, because forces inside an isolated system cannot move its
[centre of mass](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel) (chapter 1.6). So
the two arrangements have the same mass and the same dipole, and they pull alike to first order. Their second moments,
the sums $\sum\matter mx^2$ of each mass times the square of its distance along the split, differ by
$\matter md^2(1 + \matter m/\matter M) \approx \matter md^2$. This is the paper's "about $md^2$", the scale of the
difference in chapter 2.3's
[quadrupole](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole).

A camera a metre away on the line of the split sees the two arrangements' tides differ by $12G\matter md^2/r^5$ (the
box below derives it). For a gram split by a micrometre, $\matter md^2 = 10^{-15}\unit{kg\,m^2}$, and

$$\begin{aligned}
\frac{12G\matter md^2}{r^5} &= 12\times6.67\times10^{-11}\times10^{-15}\unit{s^{-2}}\\ &= 8\times10^{-25}\unit{s^{-2}} .
\end{aligned}$$

That is $10^{-11}$ of the $6.5\times10^{-14}\unit{s^{-2}}$
that two grams a centimetre apart resolve in a second at
[the standard quantum limit](/tutorial/newton/reading-section-ii/#what-the-premise-asks-existing-instruments-nearly-supply)
(chapter R1). The difference is far beyond any instrument, but not beyond the paper's premise of arbitrary
sensitivity.

::: derivation
### The tides of the two arrangements

We want the difference of the tides that the two arrangements make at a camera, to see that the dipole's part cancels.
Take the $x$ axis along the split, with the origin at the centre of mass and the camera at $x = r$. In branch $L$ the
mass and the body's centre are both at the origin. In branch $R$ the mass is at $d$ and the body at
$-\matter md/\matter M$. The dipole is $\matter md - \matter M(\matter md/\matter M) = 0$, and the second moment is
larger by $\matter md^2 + \matter M(\matter md/\matter M)^2 = \matter md^2(1 + \matter m/\matter M)$.

The tide along the line from a point mass $\matter m$ at the distance $\rho$ is $-2G\matter m/\rho^3$ (chapter
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)). In branch $R$
the mass is at $\rho = r - d$ and the body at $\rho = r + \matter md/\matter M$. We expand both with
$(1 + \epsilon)^{-3} \approx 1 - 3\epsilon + 6\epsilon^2$ and subtract branch $L$:

$$\begin{aligned}
\Delta\curv\tE_{xx} &= -\frac{2G}{r^3}\Bigl[\matter m\Bigl(\frac{3d}{r} + \frac{6d^2}{r^2}\Bigr)\\
&\qquad\quad - \frac{3\matter md}{r} + \frac{6\matter m^2d^2}{\matter Mr^2}\Bigr]\\
&= \boxed{-\frac{12G\matter md^2}{r^5}\Bigl(1 + \frac{\matter m}{\matter M}\Bigr)} .
\end{aligned}$$

The terms in $d$, the dipole's, cancel exactly, and the terms in $d^2$, the quadrupole's, are left. The unit is a
tide's, since $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\mathrm{kg\,m^2}$ over $\mathrm{m^5}$ is $\mathrm{s^{-2}}$.
For a body much heavier than the mass, $\matter m/\matter M \to 0$, the body stays put and the difference is
$12G\matter md^2/r^5$.
:::

<!-- diagram: tut-mass-two-places — One panel, about 560 × 340 px at 1440 (full width on a phone). Left: a grey wall
(light hatching). Behind it a small ball (matter colour) drawn twice, solid and outlined, a distance d apart along a
horizontal line, each inside a thin ring (the trap that holds it), with a bracket "d"; one line of type beneath:
"(|L⟩ + |R⟩)/√2". Right, outside the wall at a marked distance "r", a pixel: a ring of free balls drawn twice,
overlaid, as two very slightly different ellipses labelled "|e_L⟩" and "|e_R⟩" (the difference hugely exaggerated).
Below the scene, a strip of three small fringe plots, P_R against φ: overlap 1 (full swing from 0 to 1), overlap 0.5
(from 0.25 to 0.75) and overlap 0 (flat at ½), each labelled with its overlap ⟨e_R|e_L⟩. Ink lines; no orange or blue.
Caption: "Look first at the two rings, the pixel's two possible readings. The more they differ, the smaller their
overlap and the shallower the fringes when the mass's two places are brought together. A ring that tells the places
apart leaves no fringes. The rings' difference is hugely exaggerated." -->

Now let anything outside the wall, such as a pixel's masses, end in the state $\sym{record-state}{|e_L\rangle}$ if
the mass is at $L$ and $|e_R\rangle$ if it is at $R$, each of length one. The rule for two things, a further
postulate, is that the state of the mass and the record is a column with one amplitude for each pair of outcomes. When
each is in a state of its own, the amplitude of a pair is the product of their two amplitudes, and we write the product
as $|L\rangle|e_L\rangle$. The bracket of two products is then the product of the brackets,
$\langle L\,e|R\,e'\rangle = \langle L|R\rangle\langle e|e'\rangle$, because each term of the sum over pairs is a term of
the one bracket times a term of the other.

Take first a record with two outcomes, $|0\rangle = (1, 0)$ and $|1\rangle = (0, 1)$, and let $|e_L\rangle = (1, 0)$ and
$|e_R\rangle = (\cos\theta, \sin\theta)$, where the angle $\theta$ sets how different the two records are. With the
pairs in the order $(L0, L1, R0, R1)$, the rule gives $|L\rangle|e_L\rangle = (1, 0, 0, 0)$ and
$|R\rangle|e_R\rangle = (0, 0, \cos\theta, \sin\theta)$. We treat the splitting of the mass and its later
recombination as the two mirrors of the interferometer, with the record made while the mass is in its two places, so
that between them the state is

$$\frac{1}{\sqrt2}\Bigl(e^{i\phi}|L\rangle|e_L\rangle + i\,|R\rangle|e_R\rangle\Bigr) = \frac{1}{\sqrt2}\begin{pmatrix} e^{i\phi}\\ 0\\ i\cos\theta\\ i\sin\theta\end{pmatrix} ,$$

the paper's $(|L\rangle + |R\rangle)/\sqrt2$ with a relative phase. The second mirror acts on the mass alone: for each
outcome of the record it mixes the amplitudes of $L$ and $R$ with the table $U$. Its second row, $(i, 1)/\sqrt2$, gives
the pairs $R0$ and $R1$ the amplitudes

$$\tfrac12\,i\,(e^{i\phi} + \cos\theta) \qquad\text{and}\qquad \tfrac12\,i\sin\theta .$$

By the Born rule each is the amplitude for "$R$ and 0" or "$R$ and 1", since the bracket with $(0, 0, 1, 0)$ or
$(0, 0, 0, 1)$ picks out one entry. Adding the two probabilities, with $|e^{i\phi} + \cos\theta|^2 = 1 +
2\cos\theta\cos\phi + \cos^2\theta$,

$$\begin{aligned}
P_R &= \frac{1 + 2\cos\theta\cos\phi + \cos^2\theta + \sin^2\theta}{4}\\
&= \frac12\bigl(1 + \cos\theta\cos\phi\bigr) .
\end{aligned}$$

The interference term $\tfrac12\cos\phi$ is multiplied by $\cos\theta$, the overlap $\langle e_R|e_L\rangle$ of the
records. With $\theta = 0$ the records agree and the fringes are the interferometer's; at $\theta = 60^\circ$ they swing
only between 0.25 and 0.75; at $\theta = 90^\circ$ the records are orthogonal and $P_R = \tfrac12$ at every $\phi$.

The same steps work for any record. The part of the state that leaves along $R$ is $|R\rangle|a\rangle$, with the
record in

$$|a\rangle = \tfrac12\bigl(ie^{i\phi}|e_L\rangle + i\,|e_R\rangle\bigr) ,$$

whose two entries in the example are the two amplitudes above. Let the states $|k\rangle$ be a **complete orthonormal
set** of the record, one for each of its outcomes, so that every state of the record is a sum of them, as $|0\rangle$
and $|1\rangle$ are. Then $|a\rangle = \sum_kc_k|k\rangle$, and the bracket with $|k\rangle$ gives $c_k = \langle
k|a\rangle$, the amplitude for "$R$ and $k$". Because $\langle k|k'\rangle$ is one for $k = k'$ and zero otherwise, the
probabilities add up to

$$\sum_k|\langle k|a\rangle|^2 = \sum_{k,k'}c_k^*c_{k'}\langle k|k'\rangle = \langle a|a\rangle .$$

The bracket conjugates its first factor, so a cross term carries $(-i)(i) = 1$, and $z + z^* = 2\,\mathrm{Re}\,z$:

$$\begin{aligned}
P_R = \langle a|a\rangle &= \tfrac14\bigl[1 + 1 + e^{i\phi}\langle e_R|e_L\rangle\\
&\qquad + e^{-i\phi}\langle e_L|e_R\rangle\bigr]\\
&= \boxed{\tfrac12\Bigl[1 + \mathrm{Re}\bigl(\langle e_R|e_L\rangle\,e^{i\phi}\bigr)\Bigr]} .
\end{aligned}$$

**Checks.** If the records are the same, the overlap $\langle e_R|e_L\rangle$ is one and $P_R = \tfrac12(1 + \cos\phi)
= \cos^2(\phi/2)$, the interferometer's fringes. If the records are orthogonal, $P_R = \tfrac12$ at every $\phi$, the
mixture.

**What it means.** A record that tells the paths apart is **which-path information**, and it multiplies the interference
term by the overlap of the records. When the records are carried by the **environment**, the many things outside that
touch the mass (air, light, the field itself), the overlaps of its many parts multiply and the product falls quickly to
zero. This loss of interference is **decoherence**. A camera whose two possible readings differ by many times its noise
makes records with almost no overlap. If each reading is a wave packet of the camera's pointer (the part whose position
shows the reading) of standard deviation $\sigma$, two readings $\Delta$ apart overlap by $e^{-\Delta^2/8\sigma^2}$:
0.88 when $\Delta = \sigma$ and 0.04 when $\Delta = 5\sigma$.[^gauss] So the camera's picture leaves the mass behaving
as if it were in one place: "a perfect camera is therefore a perfect source of decoherence".  The paper adds a puzzle: a
camera that read the quadrupole before light from the recombination could reach it would learn which way the mass went
sooner than **causality** allows, causality being the rule that no effect travels faster than light. Its sources answer
it, and we state the answer without proof [@Belenchia2018; @DanielsonSatishchandranWald2022]. The quantum jitter of the
field in empty space limits what a camera can learn in the time available. Whenever a camera could learn enough,
recombining the mass radiates the record away, so the fringes are lost whether or not it looks.[^slow] Chapter 13.8
returns to decoherence by gravity.

<!-- try: two-paths (a new interactive figure, TwoPaths, on an engine that multiplies the tables U, diag(e^{iφ}, 1), U
of the interferometer section for a particle entering along L, with the record |e_L⟩ = (1, 0), |e_R⟩ = (cos θ, sin θ)
of the record section's four-entry example, and is checked against P_R = ½(1 + cos θ cos φ),
P_L = ½(1 − cos θ cos φ): with cos θ = 1 and φ = 0, π/2, π it gives P_R = 1, 0.5, 0; with cos θ = 0.5, 0.75, 0.5,
0.25; with cos θ = 0, 0.5 at every φ; with path R blocked, 0.25 at each exit at every φ) — Left, about 420 × 300 px:
the interferometer of diagram tut-mach-zehnder, the delay on path L drawn as a plate whose thickness follows φ, and a
bar at each exit showing P_L and P_R. Right, about 300 × 300 px: the complex plane with the two amplitudes that reach
exit R, ie^{iφ}/2 by way of L and i/2 by way of R, drawn head to tail with their sum; below it one line, "interference
term ½ cos φ × overlap = …". Under both, a small plot of P_R against φ from 0 to 2π for the current overlap, with the
current φ marked. Controls: a slider for φ from 0 to 2π (steps of π/12); a slider "record of the path" setting the
overlap cos θ from 1 (no record) to 0 (perfect record); a button "block path R". Readouts: P_L and P_R to two
decimals, the overlap, the swing of the fringes. Opens at φ = π/3 with overlap 1 (P_R = 0.75). Predict first: "With a
perfect record of the path, what is the probability at exit L when φ = 0, where without a record it is zero?"
(Answer: ½, and ½ at every delay.) Then: "Set the record half-way, overlap 0.5. How deep are the fringes?" (Answer:
P_R swings between 0.25 and 0.75, a swing of 0.5, the overlap.) Then: "Block path R. What is left?" (Answer: ¼ at each
exit at every delay; half of the particles are absorbed.) Keyboard: Tab reaches the sliders and the button, arrows
step them, shift for larger steps; both themes; on a phone the panels stack. -->

::: check
### Q

A state is $(3, 4i)/5$. What are the probabilities of its two outcomes?

### A

They are $|3/5|^2 = \tfrac{9}{25}$ and $|4i/5|^2 = \tfrac{16}{25}$, which add to one.

### Q

What is the de Broglie wavelength of a gram moving at a millimetre a second, and why do we never see a gram interfere?

### A

It is $6.6\times10^{-28}$ m, far smaller than any gap a gram could be sent through. And the air, the light and the
support that touch a gram keep records of where it is, so the overlap of the records, and with it the interference, is
gone.

### Q

Why does a camera that could tell the two places apart end the superposition?

### A

It ends in different states for the two places, and the interference term is multiplied by their overlap, which is
zero for a camera that tells them apart.
:::

**The idea to keep: a quantum state is a list of complex amplitudes whose squared sizes are probabilities. Amplitudes
of different paths add before they are squared, so they can cancel, and any record of which path was taken multiplies
that cancellation by the overlap of the records. A camera good enough to see where a quantum mass is would therefore
end its being in two places.**

::: problems
### Practice

Multiply the three tables of the interferometer and find both exit probabilities at $\phi = \pi/3$.

::: solution
The product is $UDU|L\rangle = \tfrac12(e^{i\pi/3} - 1,\ i(e^{i\pi/3} + 1))$. With $e^{i\pi/3} = \tfrac12 + \tfrac{\sqrt3}{2}i$,
$|e^{i\pi/3} + 1|^2 = \tfrac94 + \tfrac34 = 3$ and $|e^{i\pi/3} - 1|^2 = \tfrac14 + \tfrac34 = 1$, so $P_R =
\tfrac34$ and $P_L = \tfrac14$, which are $\cos^2(\pi/6)$ and $\sin^2(\pi/6)$.
:::

### Stretch

Combine with chapter 3.1. A detector at exit $R$ counts $n$ of $N$ particles. How many particles are
needed to measure $\phi$ near $\pi/2$ to 0.01 rad?

::: solution
Each particle counts 1 with probability $p = \cos^2(\phi/2)$ and 0 otherwise, with mean $p$ and variance $p - p^2$.
Variances of independent counts add (3.1), so $n/N$ has the standard deviation $\sqrt{p(1 - p)/N} =
|\sin\phi|/2\sqrt N$, while $p$ changes by $\tfrac12|\sin\phi|$ per radian. So $\sigma_\phi = 1/\sqrt N$ away from 0 and
$\pi$, and 0.01 rad needs $N = 10^4$.
:::

### The paper

Check the paper's "the centre of mass of an isolated system cannot move, so the two branches differ in their
quadrupole, about $md^2$" when the body that recoils is not centred on the mass. Let the mass start a distance $s$ along
$x$ from that body's centre, and find the change of the second moment between the two branches.

::: solution
With the origin at the centre of mass, let the mass start at $x_1$ and the body at $x_2$, with $x_1 - x_2 = s$. In
branch $R$ the mass moves by $d$ and the body by $-\matter md/\matter M$, so the dipole changes by $\matter md -
\matter md = 0$, and the second moment by $\matter m(2x_1d + d^2) + \matter M(-2x_2\matter md/\matter M +
\matter m^2d^2/\matter M^2) = 2\matter mds + \matter md^2(1 + \matter m/\matter M)$. The paper's "about $md^2$" holds
when $s$ is at most of order $d$, which needs the body that recoils to be centred on the mass, as a trap around it is.
A separate body pushing a gram of gold from beside it has its centre at least the gram's radius, 2.3 mm, away, so at
$d = 1\unit{\mu m}$ the change is $(2s/d + 1)\,\matter md^2 \approx 5\times10^3\,\matter md^2$.
:::
:::

::: paper
- [Section IV's *Limits on sensitivity*](/paper/#par:limits-on-sensitivity), second paragraph: the mass in two places,
  its quadrupole, the paradox and its resolution, and "a perfect source of decoherence".
- [Section XIII](/paper/#sec:second-order): "the impulse is $e^{i\epsilon Q_g/\hbar}$", a phase turned by a quantity
  of the body (chapter 8.2).
- [Section IX's *Counting or recording*](/paper/#par:counting-or-recording): the states of a mode and their quanta
  (chapters 8.3 and 8.6).
:::

::: deeper
- The GR course's
  [section on quantum states](https://neovand.github.io/general-relativity/chapter-22.html#quantum-states-and-reduced-information)
  shows how ignoring part of a definite quantum whole leaves an uncertain part, the decoherence of the last section.
- R. P. Feynman, R. B. Leighton and M. Sands, *The Feynman Lectures on Physics*, vol. III (Addison-Wesley, 1965),
  chapters 1 and 3: amplitudes, two paths and which-path information.
- The paper's sources for the which-way puzzle and its resolution: [@Belenchia2018] and
  [@DanielsonSatishchandranWald2022].
:::

[^bracket]: Chapter 1.5b wrote the Hermitian product with the conjugate on the second factor, $\vect a\cdot\vect b^*$.
    Physics books put it on the first, so $\langle\chi|\psi\rangle$ is 1.5b's $\psi\cdot\chi^*$. From here on the
    tutorial uses the bracket.

[^tested]: Davisson and Germer diffracted electrons from a nickel crystal in 1927, Rauch and colleagues split and
    recombined neutrons in a silicon crystal in 1974, and molecules of sixty carbon atoms interfered in Zeilinger's
    laboratory in 1999.

[^U]: This $U$ is not chapter 1.2's potential energy.

[^superposition]: Chapter 1.2's
    [superposition](/tutorial/newton/field-and-potential/#the-field-is-the-pull-per-unit-mass-and-fields-add) was the
    adding of the fields of several bodies. Here what is added is amplitudes, and the sum is one state.

[^psi]: This $\psi$ is not chapter 2.5's null-space potential.

[^centred]: The paper's "about $md^2$" assumes this. For a separate body pushing a gram of gold from beside it, the
    change is about $5\times10^3\,\matter md^2$ at $d = 1\unit{\mu m}$ (the paper problem below). The conclusion does
    not depend on it, because the two arrangements differ in their quadrupole either way, and the argument of the
    paper's sources holds for whatever that quadrupole is.

[^gauss]: The packet $\psi(x) = (2\pi\sigma^2)^{-1/4}e^{-x^2/4\sigma^2}$ has for $|\psi|^2$ a bell curve of standard
    deviation $\sigma$ (chapter 3.1). In the bracket $\int\psi(x)\,\psi(x - \Delta)\,\dd x$, completing the square in the
    exponent leaves $e^{-\Delta^2/8\sigma^2}$ times the integral of a bell curve, which is one.

[^slow]: This is for the puzzle's quick recombination, before light can reach the camera. When the recombination is
    slower, Danielson, Satishchandran and Wald find the camera's measurement to be "the true cause" of the
    decoherence, the paper's "perfect source".
