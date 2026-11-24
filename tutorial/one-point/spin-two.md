---
id: '9.1'
title: 'Spin two: a wave is the square of a vector; spin weight'
question: 'Section III says that "curvature at a point is a symmetric trace-free tensor, and in a wave it is the square $\mathbf m\mathbf m^T$ of a complex null vector $\mathbf m$, where the field of light is the vector itself". Why does gravity''s wave come as a square, and what does the square decide?'
part: '9'
requires: ['1.1', '1.5', '1.5b', '1.7', '6.6', '7.6', '8.4']
paper: [sec:regimes, sec:one-pixel, eq:W, eq:square, eq:one-wave, eq:invariants, eq:pencil, eq:pixel-kernel, eq:sky-count, eq:ranging-instant, sec:first-image]
figures: []
live: []
depth: A
---

The paper's paragraph [*One complex matrix*](/paper/#par:one-complex-matrix), in its Section VIII, writes the reading
of one pixel in a plane gravitational wave as one table:

{{paper eq:square}}

It then turns to light: "The same construction for light gives $\mathbf E + ic\mathbf B = a\,\mathbf m$, a vector rather
than a square; the difference between the two, a square against a single power, is the difference between spin two and
spin one." Section III's [*Spin, speed and compactness*](/paper/#par:spin-speed-and-compactness) puts this fact first
among the reasons for what the camera can and cannot do. Why does gravity's wave come as a square, and what does the
square decide?

We answer with the tables of chapters [1.5](/tutorial/newton/five-numbers/) and
[1.5b](/tutorial/newton/complex-numbers/), the waves of chapters [6.6](/tutorial/relativity/maxwell-complex/) and
[7.6](/tutorial/geometry/gravitational-waves/), and the spin of chapter [8.4](/tutorial/quantum/spin/).

<!-- diagram: tut-one-point-hero — The hero of Part 9, in the stone pipeline (design/FIGURE_WORKFLOW.md; image-model
candidates in two runs as style references, final marks from code). One small pixel, a stone ring of free balls with a
gyroscope at its centre, sits at the centre of a clear glass sphere, the sky around one point. On the glass, four small
stars (ink dots with a faint glow) mark the four principal null directions of the reading of two stone masses outside
the sphere (Petrov type I: four separate points, computed from eq:stars for the two masses of the paper's fig:stars).
A passing plane wave, drawn as a few faint parallel crests crossing the sphere from the upper right, carries a second
set of four stars, drawn as touching dots, all on its direction of travel where the crests leave the glass. No orange
or blue on the stars; orange and blue only on the ring, for its stretch and squeeze under the wave. No text in the
image. Caption: "Look first at the two sets of stars on the glass: the reading of two masses puts its four special
directions at four separate places on the sky, and a single passing wave puts all four of its own on its direction of
travel. The marks are computed; the stone is schematic." 9.4 reuses it. -->

::: plain
A reading of the paper's pixel is five complex numbers. When the field is turned about any line through the pixel,
five suitable combinations of them are multiplied by factors that turn at −2, −1, 0, 1 and 2 times the angle. These
multiples are their spin weights.

A single gravitational wave, seen along its own direction of travel, holds only the combination whose factor turns at
twice the angle. That makes its reading the square of one complex arrow, a table built from the arrow times itself.
Light's wave is the arrow itself, whose factor turns at the angle. So a gravitational wave's pattern comes back after
half a turn, and light's only after a whole turn.

The square holds four numbers: a direction, and the strengths of two polarizations. It also makes two waves from
nearby directions look more different to a gravitational pixel than to a sensor of light.
:::

## A reading's five numbers carry spin weights from $-2$ to $2$ about any axis

We want to sort the numbers of a reading by how they change when the field is turned about one line, because a wave
singles out a line, its direction of travel. The reading is the paper's $\sym{weyl-complex}{\curv{\mathcal W}} =
\curv\tE + i\curv\tB$, its equation [](/paper/#eq:W): a symmetric trace-free table of complex numbers, in
$\mathrm{s^{-2}}$, whose real part is the tide $\curv\tE$ and whose imaginary part is the magnetic part $\curv\tB$.

We choose an axis, a unit vector $\hat k$, and two unit vectors $\vect e_1$ and $\vect e_2$ across it with $\vect
e_1\times\vect e_2 = \hat k$. Chapter 1.5b's null vector is $\sym{null-vector}{\vect m} = (\vect e_1 + i\vect
e_2)/\sqrt2$, with $\vect m\cdot\vect m = 0$ and $\vect m\cdot\vect m^* = 1$. From $\vect m$, $\hat k$ and the
conjugate $\vect m^*$ we build three tables,

$$\begin{gathered}
T_2 = \vect m\vect m^{\mathsf T}, \qquad T_1 = \vect m\hat k^{\mathsf T} + \hat k\vect m^{\mathsf T},\\
T_0 = 3\hat k\hat k^{\mathsf T} - 1,
\end{gathered}$$

and two more as their conjugates, $T_{-1} = T_1^*$ and $T_{-2} = T_2^*$. All five are symmetric. All five have no
trace, because the trace of a table $\vect a\vect b^{\mathsf T}$ is $\vect a\cdot\vect b$, and $\vect m\cdot\vect m =
\vect m\cdot\hat k = 0$, while $3\hat k\cdot\hat k - 3 = 0$. With $\hat k$ along $z$, $T_0 = \mathrm{diag}(-1, -1,
2)$.

**The turn.** Chapter 1.7's table $R = \exp(\psi\,\hat k\cdot L)$ turns arrows by the angle $\sym{turn-angle}{\psi}$,
in radians, about $\hat k$, anticlockwise as seen from the side toward which $\hat k$ points (this $\psi$ is not
chapter 8.1's state). It turns a table $T$ to $RTR^{\mathsf T}$ (chapter
[8.4](/tutorial/quantum/spin/#a-reading-turns-as-a-spin-two)). It leaves $\hat k$ alone and turns $\vect e_1$ toward
$\vect e_2$, so, as in 1.5b's
[computation](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero),

$$\begin{aligned}R\vect e_1 + iR\vect e_2 &= (\cos\psi\,\vect e_1 + \sin\psi\,\vect e_2) + i(-\sin\psi\,\vect e_1 +
\cos\psi\,\vect e_2)\\ &= e^{-i\psi}(\vect e_1 + i\vect e_2) .\end{aligned}$$

The factor is $e^{-i\psi}$, not $e^{+i\psi}$, because $\vect m$ puts its $i$ on $\vect e_2$, the axis toward which the
turn carries $\vect e_1$; 8.4's turn of a spin has the same sign. So $R\vect m = e^{-i\psi}\vect m$ and $R\vect m^* =
e^{i\psi}\vect m^*$. A table $\vect a\vect b^{\mathsf T}$ turns to $(R\vect a)(R\vect b)^{\mathsf
T}$, so each factor $\vect m$ brings $e^{-i\psi}$ and each $\vect m^*$ brings $e^{i\psi}$:

$$\boxed{\;\begin{gathered}RT_mR^{\mathsf T} = e^{-im\psi}\,T_m,\\ m = 2, 1, 0, -1, -2 .\end{gathered}\;}
\label{eq:weights}$$

The whole number $\sym{spin-weight}{m}$ is the table's **spin weight** about $\hat k$: the power of $e^{-i\psi}$ by
which a turn about $\hat k$ multiplies it. It is chapter 8.4's spin component, with the same factor, and neither a
mass nor the bold null vector.

**Five components.** We use 8.4's bracket of two tables, $\langle T|U\rangle = \mathrm{tr}(T^\dagger U) =
T^*_{ij}U_{ij}$, chapter 1.5's contraction with the first table conjugated. A turn keeps the bracket, because $R$ is
real and orthogonal, but by [](#eq:weights) it multiplies $\langle T_m|T_n\rangle$ by $e^{i(m - n)\psi}$, so the bracket
is zero unless $m = n$. The five tables are therefore orthogonal, with the squared lengths 1, 2, 6, 2 and 1, and they
are a basis, with complex coefficients, of chapter 1.5's five-dimensional space. Every reading is

$$\curv{\mathcal W} = \sum_{m=-2}^{2}\curv c_m\,T_m, \qquad \curv c_m = \frac{\langle T_m|\curv{\mathcal
W}\rangle}{\langle T_m|T_m\rangle},$$

with five complex components $\curv c_m$, in $\mathrm{s^{-2}}$.

**Two ways to turn.** Turning the axes by $\psi$ and keeping the field looks, from the axes, like turning the field by
$-\psi$, so the two turns give opposite factors:

| What is turned by $\psi$ about $\hat k$ | Each component $\curv c_m$ is multiplied by |
|---|---|
| the field, in fixed axes (this chapter and 8.4) | $e^{-im\psi}$ |
| the axes, with the field fixed (chapter 1.5b) | $e^{+im\psi}$ |

Chapter 1.5b turned the axes, so its shear, which such a turn multiplies by $e^{-2i\psi}$, has the weight $-2$: it is
$2\curv c_{-2}$ of the tide. Books that follow Newman and Penrose give a spin weight to the number in front of a table
instead, and the number in front of $\vect m\vect m^{\mathsf T}$ then has the spin weight $-2$, the opposite of the
table's.

**A mass on the axis.** A mass $\matter M$ at the distance $r$ along $\hat k$ has, by chapter 1.4, the tide $(G\matter
M/r^3)(1 - 3\hat k\hat k^{\mathsf T})$ and no magnetic part, so $\curv{\mathcal W} = -(G\matter M/r^3)\,T_0$: weight 0
alone. It must be so, because a turn about the line to the mass changes nothing, and $e^{-im\psi} = 1$ for every $\psi$
only when $m = 0$. The same mass along $\vect e_1$, across the axis, gives $1 - 3\vect e_1\vect e_1^{\mathsf T} =
\tfrac12T_0 - \tfrac32(T_2 + T_{-2})$, since $\vect e_1 = (\vect m + \vect m^*)/\sqrt2$: weights 2, 0 and $-2$. The
weights belong to a reading and an axis together.

## A plane wave fills only the extreme weight, so its reading is a square

We want the components of a plane wave about its own direction of travel, which we take as the axis
$\sym{travel-direction}{\hat k}$. A weight $\pm2$, the largest or smallest a spin two can hold, is an **extreme
weight**. By chapter
[7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical), the wave's tide
lies across $\hat k$ and has no trace, $\curv\tE = \curv\tE_+e^+ + \curv\tE_\times e^\times$, with the polarization
amplitudes $\sym{wave-polarizations}{\curv\tE_+}$ and $\curv\tE_\times$ in $\mathrm{s^{-2}}$ and the polarization
tables $\sym{polarization-tensors}{e^+} = \vect e_1\vect e_1^{\mathsf T} - \vect e_2\vect e_2^{\mathsf T}$ and $e^\times
= \vect e_1\vect e_2^{\mathsf T} + \vect e_2\vect e_1^{\mathsf T}$. Multiplying out gives $e^+ + ie^\times = 2\vect
m\vect m^{\mathsf T}$ and, by conjugation, $e^+ - ie^\times = 2\vect m^*\vect m^{*\mathsf T}$, so

$$\curv\tE = (\curv\tE_+ - i\curv\tE_\times)\,T_2 + (\curv\tE_+ + i\curv\tE_\times)\,T_{-2} .$$

The tide fills both extreme weights and no others. Its magnetic part is 7.6's $\curv\tB_{ij} = \epsilon_{ipq}\hat
k_p\curv\tE_{qj}$, the cross product with $\hat k$ applied to the first index, which turns a table $\vect a\vect
b^{\mathsf T}$ into $(\hat k\times\vect a)\vect b^{\mathsf T}$. With 1.5b's $\hat k\times\vect m = -i\vect m$ and its
conjugate $\hat k\times\vect m^* = i\vect m^*$,

$$\curv\tB = -i(\curv\tE_+ - i\curv\tE_\times)\,T_2 + i(\curv\tE_+ + i\curv\tE_\times)\,T_{-2} .$$

Adding $i$ times this to $\curv\tE$ doubles the first term and cancels the second:

$$\boxed{\;\curv{\mathcal W} = 2(\curv\tE_+ - i\curv\tE_\times)\,\vect m\vect m^{\mathsf T},\;}$$

the paper's [](/paper/#eq:square), derived in 7.6 and read here as a statement about weights. The magnetic
part removes the weight $-2$ that the tide carries, and the wave fills only the weight 2, with $\curv c_2 =
2(\curv\tE_+ - i\curv\tE_\times)$.

**Rank one.** The **rank** of a table is the number of independent directions among its columns. Since $\vect m\vect
m^{\mathsf T}\vect v = \vect m\,(\vect m\cdot\vect v)$ for every vector $\vect v$, every column is a multiple of
$\vect m$, and a wave's reading has rank one. It is a **square of a vector**: one vector's table with itself, $\vect
m\vect m^{\mathsf T}$, times a number. Its own square vanishes, $\vect m\vect m^{\mathsf T}\vect m\vect m^{\mathsf
T} = \vect m\,(\vect m\cdot\vect m)\,\vect m^{\mathsf T} = 0$, so $\curv{\mathcal W}^2 = 0$, and with it both of the
paper's invariants [](/paper/#eq:invariants), $I = \mathrm{tr}\,\curv{\mathcal W}^2$ and $J =
\mathrm{tr}\,\curv{\mathcal W}^3$, which chapter 9.2 studies.

Rank does not depend on the axis, but weights do. About an axis at 60° to the wave the same reading fills all five
weights, and it still has rank one. A weight's share is the length $|\curv c_m|\sqrt{\langle T_m|T_m\rangle}$ of its
part $\curv c_mT_m$ over the reading's length $|\curv{\mathcal W}| = \sqrt{\langle\curv{\mathcal W}|\curv{\mathcal
W}\rangle}$, and the squares of the five shares add to one, because the tables are orthogonal. The section on overlaps
finds the share of the weight 2, $\cos^4(30°) = 0.56$.

<!-- diagram: tut-spin-weight-bars — Three small panels side by side at 1440 (stacked on a phone), each a row of five
vertical bars at m = −2, −1, 0, 1, 2 (ticks labelled −2 … 2, axis label "spin weight m about ẑ"), bar height |c_m|
times the square root of ⟨T_m|T_m⟩ over the reading's length (so the squares add to one), from 0 to 1, thin ink
outlines filled in ink at 30% opacity; above each panel a small sketch of the axis ẑ (thin ink arrow) and the source.
(a) "a mass on the axis": only m = 0, height 1. (b) "a wave along the axis": only m = 2, height 1 (W ∝ mm^T, k̂ = ẑ).
(c) "the same wave tilted by 60°": heights 0.0625 (m = −2), 0.2165 (−1), 0.4593 (0), 0.6495 (1), 0.5625 (2, which is
cos⁴30°, the share the text computes), with the label "rank 1" under it, as under (b); under (a) "rank 3". All heights
from nums.py in the 9.1 scratch folder (Wigner's d² of 60°), rechecked in 9.1-revise/check.py. No orange or blue.
Caption: "Look first at the middle panel: a wave seen along its own direction fills one extreme bar. Tilted, the same wave fills all five, yet its reading is still a square of rank one; a mass on
the axis fills only the middle bar. Heights computed." -->

## Light's wave is the vector itself: spin one against spin two

Chapter [6.6](/tutorial/relativity/maxwell-complex/#in-a-light-wave-the-complex-field-is-a-multiple-of-one-null-vector)
wrote light's electric field $\light{\vect E}$ and magnetic field $\light{\vect B}$, with $c$ the speed of light, as one
complex vector $\sym{complex-field}{\light{\vect F}} = \light{\vect E} + ic\light{\vect B}$, in $\mathrm{V\,m^{-1}}$,
and found that in a plane wave it is $\light{\vect F} = a\,\vect m$, with a complex amplitude $a$. An arrow has three
components about $\hat k$, along $\vect m$, $\hat k$ and $\vect m^*$, of weights 1, 0 and $-1$, as 8.4's spin one has.
Light's wave fills only the extreme weight 1, as gravity's fills only the extreme weight 2. We state without proof that
a plane wave of any spin $s$ is, at a point, a number times $\vect m^{\otimes s}$, the table of $s$ indices with the
entries $m_{i_1}\cdots m_{i_s}$.

So a turn by $\psi$ about the direction of travel multiplies light's wave by $e^{-i\psi}$ and gravity's by
$e^{-2i\psi}$. A half turn, $\psi = \pi$, gives $-1$ for light and $+1$ for gravity. This is Section III's sentence
written in algebra: "An arrow turned by half a circle points the other way, but a pattern of stretch and squeeze
turned by half a circle looks exactly as it did before."

<!-- diagram: tut-half-turn — After 1.5b's tut-cx-spin. Two rows, three columns, about 560 × 360 px at 1440 (full width
on a phone). Columns: turned by 0°, 90°, 180° about k̂ (k̂ out of the page toward the viewer, drawn as a small circled
dot at the centre). Top row, gravity: a ring of twelve free balls under the plus pattern of Re(mm^T), squeezed along
e₁ (blue arrows) and stretched along e₂ (orange arrows), movement exaggerated; at 90° stretch and squeeze have changed
places; at 180° the ring is exactly as at 0°. Under each, the factor e^{−2iψ}: 1, −1, 1. Bottom row, light: one ink
arrow, light's E, along e₁ at 0°, along e₂ at 90°, along −e₁ at 180°; under each e^{−iψ}: 1, −i, −1. Thin grey axes
e₁, e₂ in each cell, labels beside the axes, never on the ring. Orange and blue only for stretch and squeeze.
Caption: "Look first at the right-hand column: half a turn gives gravity's pattern back and reverses light's arrow,
because gravity's wave is multiplied by e^{−2iψ} and light's by e^{−iψ}. Movements exaggerated." -->

## The square holds four numbers: a direction and one complex amplitude

We want to read a single wave's direction from its reading. A square $\curv c_2\,\vect m\vect m^{\mathsf T}$ is fixed
by two things. The complex number $\curv c_2 = 2(\curv\tE_+ - i\curv\tE_\times)$ is two real numbers, the strengths of
the two polarizations. The null vector $\vect m$ matters only up to a complex factor, which $\curv c_2$ can absorb, and
up to that factor it is fixed by its direction of travel (chapter 6.6), which is two angles, as a latitude and a
longitude are. These are the paper's four numbers of a wave.

**From $\vect m$ to $\hat k$.** Chapter
[6.6](/tutorial/relativity/maxwell-complex/#the-energy-of-the-field-and-its-flow-are-two-products-of-the-complex-field)
found $i\,\vect m\times\vect m^* = \hat k$. A factor $\lambda$ in front of $\vect m$ multiplies $\vect m\times\vect m^*$
and $|\vect m|^2 = \vect m\cdot\vect m^*$ alike, by $|\lambda|^2$, so the paper's formula

$$\hat k = \frac{\mathrm{Re}(i\,\vect m\times\vect m^*)}{|\vect m|^2}$$

holds for every multiple ($\vect m\times\vect m^*$ is purely imaginary, so the real part changes nothing).

**From the pixel's own numbers.** A pixel reads $\curv\tE$ and $\curv\tB$, not $\vect m$. The paper uses 8.4's
**super-Poynting vector** $\sym{super-poynting}{\mathbf P}$, a real vector in $\mathrm{s^{-4}}$ with the components
$P_i = \epsilon_{ijk}\curv\tE_{jl}\curv\tB_{kl}$, which is 8.4's $\epsilon_{kij}(\curv\tE\curv\tB)_{ij}$ because
$\curv\tB$ is symmetric. We put in $\curv\tB_{kl} = \epsilon_{kpq}\hat k_p\curv\tE_{ql}$ and use chapter 1.1's
[identity](/tutorial/newton/vectors-and-indices/#two-levi-civita-symbols-make-two-kronecker-deltas)
$\epsilon_{kij}\epsilon_{kpq} = \delta_{ip}\delta_{jq} - \delta_{iq}\delta_{jp}$, with $\epsilon_{ijk} =
\epsilon_{kij}$:

$$\begin{aligned}
P_i &= \epsilon_{kij}\epsilon_{kpq}\,\hat k_p\,\curv\tE_{jl}\curv\tE_{ql}\\
&= \hat k_i\,\curv\tE_{jl}\curv\tE_{jl} - \hat k_j\,\curv\tE_{jl}\curv\tE_{il} .
\end{aligned}$$

The second term vanishes, because the wave's tide has no entry along its direction of travel, $\hat k_j\curv\tE_{jl}
= 0$. So $\mathbf P = |\curv\tE|^2\,\hat k$. Dividing by $|\curv\tE|^2$, with the paper's $\hat n = -\hat k$ pointing
from the pixel back to the source, gives

$$\boxed{\;\hat n_i = -\frac{\epsilon_{ijk}\curv\tE_{jl}\curv\tB_{kl}}{\curv\tE_{ab}\curv\tE_{ab}} = -\hat k_i ,\;}$$

the paper's equation:

{{paper eq:one-wave}}

**A number.** For a wave along $z$ with $\curv\tE_+ = 1$ and $\curv\tE_\times = 0$, in any unit of tide, $\curv\tE =
\mathrm{diag}(1, -1, 0)$ and $\curv\tB$ has 1 in the places $12$ and $21$ (chapter 7.6). Then $P_3 =
\curv\tE_{11}\curv\tB_{21} - \curv\tE_{22}\curv\tB_{12} = 2 = |\curv\tE|^2$, the other two components vanish,
and $\hat n = -\hat z$. Nothing in the derivation used $\curv\tE_+$ or $\curv\tE_\times$, so one reading of one pixel
points back to a single wave's source for every polarization and at every instant.

## The sign of the frequency gives the helicity

We want to tell apart the two senses in which a wave's pattern can turn. A wave of one angular frequency $\omega$, in
$\mathrm{s^{-1}}$, has the real tide

$$\curv\tE(t) = \tfrac12\tilde{\curv\tE}\,e^{-i\omega t} + \tfrac12\tilde{\curv\tE}^*e^{i\omega t},$$

with a constant complex table $\sym{frequency-parts}{\tilde{\curv\tE}}$ in $\mathrm{s^{-2}}$, as chapter 5.4 wrote the
strain. The first term is the tide's **positive-frequency part**, and its conjugate is the negative-frequency part. The
magnetic part's $\tilde{\curv\tB}$ comes from $\tilde{\curv\tE}$ by 7.6's cross product with $\hat k$. Since
$\tilde{\curv\tE}$ lies across $\hat k$ and has no trace, it is a multiple of $\vect m\vect m^{\mathsf T}$ plus a
multiple of $\vect m^*\vect m^{*\mathsf T}$. If it is a multiple of $\vect m\vect m^{\mathsf T}$ alone, $\hat k\times\vect
m = -i\vect m$ gives

$$\tilde{\curv\tB} = -i\,\tilde{\curv\tE},$$

and if it is a multiple of $\vect m^*\vect m^{*\mathsf T}$ alone, $\tilde{\curv\tB} = i\tilde{\curv\tE}$.

The two kinds turn in opposite senses. By [](#eq:weights), $e^{-i\omega t}\,\vect m\vect m^{\mathsf T}$ is $\vect
m\vect m^{\mathsf T}$ turned by $\psi = \omega t/2$ about $\hat k$, so its pattern turns at the rate $\omega/2$,
anticlockwise as seen from the side toward which $\hat k$ points, which is the camera's side. The table $\vect
m^*\vect m^{*\mathsf T}$ has the weight $-2$, so $e^{-i\omega t}\,\vect m^*\vect m^{*\mathsf T}$ is that table turned
by $-\omega t/2$, clockwise. **A check.** At $t = 0$ the tide $\mathrm{Re}(e^{-i\omega t}\,\vect m\vect m^{\mathsf
T})$ is $\tfrac12(\vect e_1\vect e_1^{\mathsf T} - \vect e_2\vect e_2^{\mathsf T})$, a squeeze along $\vect e_1$,
because a positive entry of the tide squeezes (the acceleration is $-\curv\tE\,\vect x$, chapter 1.4). A quarter of a
period later it is $\tfrac12(\vect e_1\vect e_2^{\mathsf T} + \vect e_2\vect e_1^{\mathsf T})$, a squeeze along the
diagonal at 45°.

Chapter
[5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)
gave the part that turns anticlockwise, as the camera sees it, the helicity $+2$. So the **helicity** of a wave is the
spin weight, about its direction of travel, of its positive-frequency part: $+2$ for $\vect m\vect m^{\mathsf T}$ and
$-2$ for $\vect m^*\vect m^{*\mathsf T}$. It is 1.5b's spin two counted along the direction of travel, the helicity of
chapter
[8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)'s
graviton.

## Two squares overlap less than two vectors

We want to know how different two waves from nearby directions look to one pixel. For two tables $U$ and $V$ of length
one, their **overlap** is $|\langle U|V\rangle|^2$, which is 1 when they agree up to a phase and 0 when they are
orthogonal. We take two directions of travel in the $xz$ plane, the angle $\vartheta$ apart, $\hat k_1 = \hat z$ and
$\hat k_2 = (\sin\vartheta, 0, \cos\vartheta)$, with $\vect m_1 = (1, i, 0)/\sqrt2$ and $\vect m_2 = (\cos\vartheta, i,
-\sin\vartheta)/\sqrt2$, whose axes $\vect e_1 = (\cos\vartheta, 0, -\sin\vartheta)$ and $\vect e_2 = \hat y$ have
$\vect e_1\times\vect e_2 = \hat k_2$. Their product, 1.5b's Hermitian product of $\vect m_2$ with $\vect m_1$, is

$$\vect m_1^*\cdot\vect m_2 = \tfrac12(\cos\vartheta + 1) = \cos^2\frac\vartheta2 .$$

Light's wave is a multiple of $\vect m$, so two waves of light overlap by $|\vect m_1^*\cdot\vect m_2|^2 =
\cos^4(\vartheta/2)$. For gravity the bracket is $\mathrm{tr}(\vect m_1^*\vect m_1^{*\mathsf T}\vect m_2\vect
m_2^{\mathsf T}) = (\vect m_1^*\cdot\vect m_2)^2$, so two waves of the same helicity overlap by

$$\boxed{\;|\langle\vect m_1\vect m_1^{\mathsf T}|\vect m_2\vect m_2^{\mathsf T}\rangle|^2 = \cos^8\frac\vartheta2 .\;}$$

These are chapter 8.4's [spin coherent states](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky), whose overlap
is $\cos^{4s}(\vartheta/2)$, with $s = 1$ for light and $s = 2$ for gravity. **Numbers.** At 60° the readings of two
gravitational waves overlap by 0.32, and the fields of two light waves by 0.56.
**Limits.** At $\vartheta = 0$ both overlaps are 1. At $\vartheta = 180°$ both are 0, because a wave from behind
carries $\vect m^*$ instead of $\vect m$, the opposite weight.

The same bracket gives the second section's share of the weight 2 in a tilted wave. About $\hat z$, where $T_2 =
\vect m_1\vect m_1^{\mathsf T}$ has length one, the wave $\vect m_2\vect m_2^{\mathsf T}$ has $\curv c_2 = (\vect
m_1^*\cdot\vect m_2)^2$, so its share is $\cos^4(\vartheta/2)$, or 0.56 at 60°.

This higher power is Section III's "spin-two envelope of a sparse array": in the paper's
[*One pixel and many*](/paper/#par:one-pixel-and-many), two pixels far apart weight each false direction of their
pattern by $\cos^8(\vartheta/2)$.

<!-- diagram: tut-two-overlaps — One panel, about 560 × 320 px at 1440 (full width on a phone). Across, the angle ϑ
between two directions of travel from 0° to 180°, ticks every 30°, labelled "angle between the two waves, ϑ"; up, the
overlap from 0 to 1, ticks at 0, 0.25, 0.5, 0.75, 1. Two curves, thin single strokes: light, cos⁴(ϑ/2), dashed ink,
labelled "light, spin one" beside its right half; gravity, cos⁸(ϑ/2), solid ink, labelled "gravity, spin two", the
narrower curve. Small ink dots with values beside them, never on the curves: at 30°, 0.87 and 0.76; at 60°, 0.56 and
0.32; at 90°, 0.25 and 0.063. Widths at half height marked by thin grey ticks on the axis: light 2·arccos(2^{−1/4}) =
65.5°, gravity 2·arccos(2^{−1/8}) = 47.0°. No orange or blue. Caption: "Look first at the half heights: two
gravitational waves stop resembling each other at a smaller angle than two light waves do, because a square overlaps
as the square of a vector's overlap. Curves exact." -->

## On the sky, a quantity of spin weight $s$ begins at degree $|s|$

This section is a sketch, at depth B. We want a wave's two helicities over the sky around its source, for chapter
[5.4](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor)'s
rotor: two masses on a rod turning about $z$ at the angular velocity $\Omega$, in $\mathrm{rad\,s^{-1}}$, whose wave
has the angular frequency $\omega = 2\Omega$. The wave travels along $\hat k = (\sin\iota\cos\varphi,
\sin\iota\sin\varphi, \cos\iota)$, where the **inclination** $\sym{inclination}{\iota}$ is the angle from the rod's
axis $z$ and the **azimuth** $\sym{azimuth}{\varphi}$ is the angle round that axis.[^khat] Across each line of sight we
use 5.4's axes, $\vect e_1 = (\cos\iota\cos\varphi, \cos\iota\sin\varphi, -\sin\iota)$ toward larger $\iota$ and
$\vect e_2 = (-\sin\varphi, \cos\varphi, 0)$ toward larger $\varphi$, so they change from one line of sight to the
next.

**The rotor's two amplitudes.** The paper writes the reading of a wave of one frequency as $\curv{\mathcal W}(t) =
\curv{\mathcal W}_+e^{-i\omega t} + \curv{\mathcal W}_-e^{i\omega t}$. For one wave both parts are multiples of the
same square, $\curv{\mathcal W}_\pm = \sym{helicity-amplitudes}{\curv\alpha^\pm}\,\vect m\vect m^{\mathsf T}$, with
the **helicity amplitudes** $\curv\alpha^\pm$, in $\mathrm{s^{-2}}$, of the helicities $\pm2$: a wave of helicity $+2$
has $\curv{\mathcal W}_+ = \tilde{\curv\tE}$ and $\curv{\mathcal W}_- = 0$. By 7.6 the tide is $-\tfrac12$ times the
second time derivative of the strain, so $\curv c_2 = 2(\curv\tE_+ - i\curv\tE_\times)$ is $\omega^2$ times $\field
h_+ - i\field h_\times$. Chapter 5.4 found, seen from $\varphi = 0$, the part $\field A\cos^4(\iota/2)$ of $\field
h_+ - i\field h_\times$ at $e^{-i\omega t}$ and the part $\field A\sin^4(\iota/2)$ at $e^{i\omega t}$, with its amplitude
$\field A$, a pure number. The rod turns, so the view from the azimuth $\varphi$ at the time $t$ is the view from
$\varphi = 0$ at the time $t - \varphi/\Omega$, and $e^{\mp i\omega t}$ gains the factor $e^{\pm2i\varphi}$:

$$\boxed{\;\begin{aligned}
\curv\alpha^+ &= \omega^2\field A\cos^4\tfrac\iota2\;e^{2i\varphi},\\
\curv\alpha^- &= \omega^2\field A\sin^4\tfrac\iota2\;e^{-2i\varphi},
\end{aligned}\;} \label{eq:rotor-sky}$$

in $\mathrm{s^{-2}}$. Face-on only $\curv\alpha^+$ is left, 5.4's anticlockwise helicity. The ratio
$|\curv\alpha^+/\curv\alpha^-| = \cot^4(\iota/2)$ is 194 at 30° and 9 at 60°, and it returns in the paper's
[](/paper/#eq:pencil), whose roots for a circular binary are $|\lambda| = \tan^{\pm4}(\iota/2)$.[^rotor]

**Spin weight on the sky.** Here the field stays fixed and the axes turn, as in the second row of the first section's
table: turning the axes across a line of sight by $\psi$ multiplies the number in front of $\vect m\vect m^{\mathsf
T}$ by $e^{2i\psi}$. A function on the sky that such a turn multiplies by $e^{\pm is\psi}$ has a spin weight of size
$s$ on the sky, so both $\curv\alpha^\pm$ have size 2. Chapter
[2.2](/tutorial/outside/spherical-harmonics/#there-are-2ell-1-patterns-of-each-degree)'s spherical harmonics, the
basic patterns on the sky, sorted by a degree $\ell$ that counts how finely they vary, have spin weight 0. We state,
after Newman and Penrose, that each spin weight $s$ has its own **spin-weighted spherical harmonics**, $2\ell + 1$ for
each degree, which exist only for $\ell \ge |s|$.

The bound is plausible. A pattern of degree $\ell$ comes from a symmetric trace-free table of $\ell$ indices (chapter
2.2). To make from it a number of spin weight $s$, we contract $|s|$ of its indices with copies of $\vect m^*$, each of
which a turn of the axes multiplies by $e^{i\psi}$, and the rest with $\hat k$, which no turn changes, so $\ell$
cannot be less than $|s|$. The rotor's $\curv c_2 = 2\,m^*_im^*_j\curv\tE_{ij}$ follows the recipe with $\ell = s =
2$, since its tide comes from the rod's turning second moment, a table of two indices. So the two functions of
[](#eq:rotor-sky) have degree two, the lowest that spin weight two allows.

::: gap
This sketch skips the proof that the recipe gives every function of spin weight $s$, and the formulas of the
harmonics (Newman and Penrose; Goldberg and coworkers).
:::

Chapter 9.6 uses the bound for the sky's linear polarization, which has spin weight four. A pixel sees only patterns
up to degree four, so it receives that polarization at degree four alone. Chapter 9.7 uses spin weight for Rainer
Sachs's result that a source's field **peels** [@Sachs1962]: about the line of sight its weights 2, 1 and 0 fall as
$1/r$, $1/r^2$ and $1/r^3$ with the distance $r$.

## The square decides what one pixel can read of a wave

One pixel reads a single wave's direction from its own $\curv\tE$ and $\curv\tB$, by the paper's
[](/paper/#eq:one-wave), for every polarization. Both invariants vanish for a wave, $I = J = 0$, while a mass has $I =
6(G\matter M/r^3)^2$, so a lone wave's reading cannot be taken for a body's. Half a turn about the direction of travel
gives the same pattern back, where light's arrow is reversed. And two waves from nearby directions overlap by
$\cos^8(\vartheta/2)$ against light's $\cos^4(\vartheta/2)$, 0.32 against 0.56 at 60°, so one pixel tells them apart
more sharply than a sensor of light does.

<!-- try: square-of-vector (a new interactive figure, SquareOfVector) — Left: a sky disc (the hemisphere toward the
reader, as 6.6's stereographic map, with the far side shown faint), on which the reader drags the wave's direction of
travel k̂ (a filled ink dot), and a second, hollow dot for the axis about which the weights are counted (default ẑ, the
disc's centre). Beside the disc, the two arrows e₁ and e₂ of the wave's m drawn in a small 3D inset, and a ring of free
balls under the tide Re[(α⁺e^{−iωt} + α⁻e^{iωt}) mm^T] seen along k̂ (orange stretch, blue squeeze), animated
slowly, with a switch "helicity +2 / −2 / linear" (α⁻ = 0, α⁺ = 0, α⁺ = α⁻). Right: two rows of bars. Gravity: five
bars at m = −2 … 2, each of height |c_m| times the
square root of ⟨T_m|T_m⟩ over |W| (the squares add to one) with a small dial for its phase. Light: three bars at
m = −1, 0, 1 for F = a m from the same direction, scaled the same way. Readouts: the rank of W (singular values above
10⁻⁹ of the largest), tr W² and tr W³ (both 0 for a wave), the direction read back by −P/|E|² as a second small ring on
the disc (it must sit on −k̂, the source), and the angle between k̂ and the axis. A second mode, "two waves", adds a
second dragged direction and shows the overlap cos⁸(ϑ/2) against light's cos⁴(ϑ/2), the rank (2) and the direction
−P/|E|² falling between the two sources. Checks: k̂ on the axis gives one bar, at m = 2 for gravity and at m = 1 for
light; at 60° the gravity bars are 0.0625, 0.2165, 0.4593, 0.6495, 0.5625 (m = −2 … 2) and light's 0.25, 0.612, 0.75
(m = −1, 0, 1); k̂ opposite the axis gives one bar at m = −2 and at m = −1; two waves 60° apart overlap 0.316 and
0.5625; the two waves of the paper problem (along ẑ and x̂, plus polarization, equal strength) give −P/|E|² =
−(0.5, 0, 0.5). Predict first: "Point the wave along the axis. Which bars are not zero?" (One extreme bar for gravity,
m = 2, and one for light, m = 1.) Then: "Tilt the wave by 60°. How many bars fill, and what is the rank?" (All five,
and all three for light; the rank is still one.) Keyboard: arrow keys move the selected dot by 1°, Tab switches between
the wave and the axis, H cycles the helicity. Both themes; on a phone the bars sit under the disc. -->

::: check
### Q

Why is a single wave's $\curv{\mathcal W}$ of rank one?

### A

It is a number times $\vect m\vect m^{\mathsf T}$, the table of one vector with itself, so every column is a multiple
of $\vect m$.

### Q

Two waves of the same helicity arrive 60° apart. How much do their readings overlap, and how much would two waves of
light?

### A

For gravity they overlap by $\cos^8(30°) = 0.32$, and for light by $\cos^4(30°) = 0.56$.
:::

**The idea to keep: about any axis a reading's five complex numbers carry spin weights from $-2$ to 2. A single wave
fills only one extreme weight, so its reading is the square $\curv c_2\,\vect m\vect m^{\mathsf T}$ of a null vector,
holding a direction and one complex amplitude, while light's wave is the vector itself. The square is what spin two
means, and it makes two nearby waves look more different to a pixel, $\cos^8(\vartheta/2)$ against
$\cos^4(\vartheta/2)$.**

::: problems
### Practice

A wave travels along $\hat x$, with the axes $\vect e_1 = \hat y$ and $\vect e_2 = \hat z$ across it, $\curv\tE_+ = 0$
and $\curv\tE_\times = 1$ in any unit of tide. Write $\curv\tE$, $\curv\tB$ and $\curv{\mathcal W}$, and check the
paper's [](/paper/#eq:one-wave).

::: solution
The tide $\curv\tE$ has 1 in the places $23$ and $32$. By $\curv\tB_{ij} = \epsilon_{ipq}\hat k_p\curv\tE_{qj}$ with $\hat k =
\hat x$, the $y$ row of $\curv\tB$ is minus the $z$ row of $\curv\tE$ and its $z$ row is the $y$ row of $\curv\tE$, so
$\curv\tB = \mathrm{diag}(0, -1, 1)$. Then

$$\curv{\mathcal W} = \begin{pmatrix}0 & 0 & 0\\ 0 & -i & 1\\ 0 & 1 & i\end{pmatrix} = -2i\,\vect m\vect m^{\mathsf
T}, \qquad \vect m = \frac{\hat y + i\hat z}{\sqrt2},$$

which is $2(\curv\tE_+ - i\curv\tE_\times)\,\vect m\vect m^{\mathsf T}$. The only nonzero component of $\mathbf P$ is
$P_1 = \curv\tE_{23}\curv\tB_{33} - \curv\tE_{32}\curv\tB_{22} = 2 = |\curv\tE|^2$, so $\hat n = -\hat x$.
:::

### Stretch

Combine with chapter 5.4. The anticlockwise helicity's power minus the clockwise one's, over their sum, is
$(|\curv\alpha^+|^2 - |\curv\alpha^-|^2)/(|\curv\alpha^+|^2 + |\curv\alpha^-|^2)$. Show from [](#eq:rotor-sky) that
it is the paper's circular fraction [](/paper/#eq:circular), and evaluate it at $\iota = 60°$.

::: solution
Chapter 5.4's rotor has $\field h_+ = \tfrac12\field A(1 + \cos^2\iota)$ and $\field h_\times = \field A\cos\iota$.
Then $\field h_+ + \field h_\times = \tfrac12\field A(1 + \cos\iota)^2 = 2\field A\cos^4\tfrac\iota2$ and $\field
h_+ - \field h_\times = 2\field A\sin^4\tfrac\iota2$, so $|\curv\alpha^\pm|$ is $\tfrac12\omega^2$ times $\field h_+
\pm \field h_\times$, and the fraction is

$$\frac{(\field h_+ + \field h_\times)^2 - (\field h_+ - \field h_\times)^2}{(\field h_+ + \field h_\times)^2 +
(\field h_+ - \field h_\times)^2} = \frac{2\field h_+\field h_\times}{\field h_+^2 + \field h_\times^2} .$$

At 60°, $\field h_+ = 0.625\,\field A$ and $\field h_\times = 0.5\,\field A$, so the fraction is $0.625/0.641 =
0.98$.
:::

### The paper

Prove the paper's [](/paper/#eq:one-wave) for one wave of any polarization, and show that for two waves from
different directions it gives neither.

::: solution
The fourth section proves it, using only $\curv\tB_{ij} = \epsilon_{ipq}\hat k_p\curv\tE_{qj}$ and $\hat
k_j\curv\tE_{jl} = 0$. For two waves the products mix. Take a wave along $\hat z$ with
$\curv\tE = \mathrm{diag}(1, -1, 0)$ and a wave along $\hat x$ with the axes $\hat y$, $\hat z$ and $\curv\tE =
\mathrm{diag}(0, 1, -1)$. Together $\curv\tE = \mathrm{diag}(1, 0, -1)$, and $\curv\tB$ has 1 in the places $12$, $21$,
$23$ and $32$. Then $\mathbf P = (1, 0, 1)$ and $|\curv\tE|^2 = 2$, so the formula returns $-(\tfrac12, 0, \tfrac12)$,
of length 0.71: a direction between the two sources, and not a unit vector.
:::
:::

::: paper
- Section VIII's [*One complex matrix*](/paper/#par:one-complex-matrix): the paper's [](/paper/#eq:square), rank one,
  the paper's [](/paper/#eq:one-wave) and "a square against a single power", derived here.
- Section VIII's [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point): the two helicities
  $\curv{\mathcal W}_\pm = \curv\alpha^\pm\,\vect m\vect m^{\mathsf T}$ of one wave.
- Section VIII's [*What one pixel sees of the sky*](/paper/#par:what-one-pixel-sees-of-the-sky) and
  [*Ranging a wave source*](/paper/#par:ranging-a-wave-source): spin weight four, and peeling (chapters 9.6 and 9.7).
- Section VIII's [*One pixel and many*](/paper/#par:one-pixel-and-many): the factor $\cos^8(\vartheta/2)$.
:::

::: deeper
- The GR course's [section 18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten)
  and its [lab](https://neovand.github.io/general-relativity/chapter-18.html#scene-wave) draw a wave's two
  patterns, $\curv\tE_+$ and $\curv\tE_\times$, on rings of free particles.
- E. T. Newman and R. Penrose, "Note on the Bondi–Metzner–Sachs group", *Journal of Mathematical Physics* 7, 863
  (1966), introduce spin weight and its harmonics, which J. N. Goldberg and coworkers work out in the same journal, 8,
  2155 (1967).
- R. Penrose and W. Rindler, *Spinors and Space-Time*, vol. 1 (Cambridge, 1984), chapter 3: a null vector, its square
  and the spinors behind both.
:::

[^rotor]: A computed rotor gives [](#eq:rotor-sky) to six decimals.

[^khat]: Chapter 5.4 called this direction $\hat n$; the paper's $\hat n = -\hat k$ points back to the rotor.
