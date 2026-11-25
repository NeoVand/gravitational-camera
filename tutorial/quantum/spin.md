---
id: '8.4'
title: 'Spin and the Majorana picture'
question: 'Section VIII says that "a state of spin two is also a state of four spins one half that is unchanged when they are exchanged", and gives the state of one of the four. What is a spin, and how can a reading''s five complex numbers be four arrows on a sphere?'
part: '8'
requires: ['1.1', '1.5', '1.5b', '1.7', '2.2', '8.1', '8.2']
paper: [sec:one-pixel, eq:one-spin, eq:stars, eq:square, sec:first-image]
figures: []
live: [stars, majorana-stars]
depth: A
---

The paper's paragraph [*Principal null directions*](/paper/#par:principal-null-directions), in its Section VIII, ends
with a sentence about quantum states: "A state of spin two is also a state of four spins one half that is unchanged
when they are exchanged, and the Petrov types are then its classes of entanglement." It then gives what one of the
four holds when the other three are ignored:

{{paper eq:one-spin}}

This state "is pure for one plane wave, where the four are not entangled, and it is unpolarized in the field's own
rest frame". Chapter [0.4](/tutorial/evening/one-pixel/#four-special-directions-sort-every-reading) met the four
special directions of a reading, and chapter 1.5b showed that a pattern of stretch has spin two. What is a spin, and
how can a reading's five complex numbers be four arrows on a sphere? We answer with the states of
[chapter 8.1](/tutorial/quantum/states/) and the operators of [chapter 8.2](/tutorial/quantum/operators/).

![Look first at the two ladders: the same ball holds hundreds of millions of quanta in its ringing at room
temperature and almost none when cold. The camera's objects are quantum, and nearly always behave classically. The
ladder's levels are schematic, and broken where hundreds of millions of them are left out; chapter 8.3 derives
them.](tut-quantum-hero){#fig:quantum-hero}

::: plain
Some particles, such as electrons and atoms of silver, carry a small amount of turning, called spin. Measured along any
direction, their spin gives one of only two answers, up or down. The quantum state of such a spin is two complex
numbers, and every such state is "up" along exactly one direction, so it can be drawn as an arrow to a point on a
sphere. The arrow is shorter when we do not know which state was prepared, or when the spin is one of two particles
whose joint state is known exactly, which are then called entangled.

A larger spin can be built from several small ones and drawn as their points on the sphere, called its stars. The
paper's reading at a point, five complex numbers, is such a spin, with four stars. For a single passing wave the four
stars sit together and each small spin points along the wave; for a single body at rest each small spin points
nowhere.
:::

## A spin one half is a state of two components

We want a description of the simplest quantity that turns. In 1922 Otto Stern and Walther Gerlach sent a beam of
silver atoms through a magnet whose field grew strongly across the beam, which pushes each atom one way or the other
according to the way it points. The beam did not spread into a smear but split into two spots, whichever way the
magnet was turned.[^sg] Such a magnet makes a **Stern–Gerlach measurement** of the angular momentum of each atom
along its axis, and it finds only $+\tfrac12\hbar$ or $-\tfrac12\hbar$. This angular momentum belongs to the atom's
outermost electron itself, not to any orbit, and it is called **spin**. A particle whose spin gives these two outcomes
along every axis has **spin one half**.

A quantity with two outcomes has a state of two amplitudes, as chapter 8.1's
[two paths](/tutorial/quantum/states/#a-quantum-state-is-a-list-of-complex-amplitudes) had. Along an axis $z$ we write
$\sym{spin-up-down}{|{\uparrow}\rangle} = (1, 0)$ for $+\tfrac12\hbar$ and $|{\downarrow}\rangle = (0, 1)$ for
$-\tfrac12\hbar$, so by chapter 8.2's [rule](/tutorial/quantum/operators/#a-measurable-quantity-is-a-hermitian-table)
for building an operator from its outcomes and their states, the spin along $z$ is $\tfrac12\hbar\,\mathrm{diag}(1,
-1) = \tfrac12\hbar\,\sym{pauli}{\sigma_3}$. We define the spin along the three axes by 8.2's three Pauli matrices,

$$\sym{spin-vector}{\mathbf S} = \tfrac12\hbar\,\boldsymbol\sigma, \qquad S_k = \tfrac12\hbar\,\sigma_k ,$$

in joule seconds, with $\boldsymbol\sigma$ standing for the three matrices together, each with the outcomes $\pm1$.
The reason for this choice is the rule that the three obey:

$$\boxed{\sigma_i\sigma_j = \delta_{ij} + i\epsilon_{ijk}\sigma_k} ,$$

with chapter 1.1's Kronecker delta $\delta_{ij}$ and Levi-Civita symbol $\epsilon_{ijk}$, and with the unit table
written as 1. Multiplying out the tables checks all nine; for example chapter 8.2 found $\sigma_1\sigma_2 =
i\sigma_3$, and $\epsilon_{123} = 1$. Subtracting the equation with $i$ and $j$ swapped removes the delta and doubles
the rest, since $\epsilon_{jik} = -\epsilon_{ijk}$, so $[\sigma_i, \sigma_j] = 2i\epsilon_{ijk}\sigma_k$ and

$$[S_x, S_y] = \tfrac14\hbar^2\cdot2i\sigma_3 = i\hbar\,S_z .$$

This is the rule $[L_x, L_y] = i\hbar L_z$ that chapter 8.2's stretch problem derived for the angular momentum $\vect
x\times\vect p$ of an orbit, so the three tables are an angular momentum. From here on we measure spin in units of
$\hbar$: $\mathbf S = \tfrac12\boldsymbol\sigma$, with the outcomes $\pm\tfrac12$ along every axis.

## Every state of a spin one half points somewhere

We want the states that have a definite spin along a given direction, the unit vector $\hat n =
(\sin\vartheta\cos\varphi, \sin\vartheta\sin\varphi, \cos\vartheta)$ with chapter 2.2's
[polar angle $\vartheta$ and azimuth $\varphi$](/tutorial/outside/spherical-harmonics/#a-direction-is-two-angles-and-a-small-patch-of-sky-has-the-solid-angle-sinvarthetamathrmdvarthetamathrmdvarphi).
The spin along $\hat n$ is $\hat n\cdot\mathbf S = \tfrac12\,\hat n\cdot\boldsymbol\sigma$, with

$$\hat n\cdot\boldsymbol\sigma = \begin{pmatrix}\cos\vartheta & \sin\vartheta\,e^{-i\varphi}\\ \sin\vartheta\,e^{i\varphi} & -\cos\vartheta\end{pmatrix} .$$

By the rule above, $(\hat n\cdot\boldsymbol\sigma)^2 = \hat n_i\hat n_j(\delta_{ij} + i\epsilon_{ijk}\sigma_k) = 1$,
because $\epsilon_{ijk}$ changes sign when $i$ and $j$ are swapped and $\hat n_i\hat n_j$ does not. So the outcomes
are again $\pm1$, and a magnet turned along $\hat n$ again makes two spots. The state

$$\sym{spin-direction-state}{|\hat n\rangle} = \begin{pmatrix}\cos\tfrac\vartheta2\\ e^{i\varphi}\sin\tfrac\vartheta2\end{pmatrix}$$

is the eigenvector with the outcome $+1$: by the formula for the cosine of a difference, the first row of $\hat
n\cdot\boldsymbol\sigma\,|\hat n\rangle$ is $\cos\vartheta\cos\tfrac\vartheta2 + \sin\vartheta\sin\tfrac\vartheta2 =
\cos\tfrac\vartheta2$, and the second row follows in the same way from the sine. This state is **spin up along $\hat
n$**. At $\vartheta = 0$ it is $|{\uparrow}\rangle$, and at $\vartheta = \pi$ it is $|{\downarrow}\rangle$.

Every state is one of these. A state $(a, b)$ has $|a|^2 + |b|^2 = 1$, and since an overall phase
[has no effect](/tutorial/quantum/states/#probabilities-are-the-squared-sizes-of-amplitudes) we may make $a$ real and
not negative. Then $a = \cos\tfrac\vartheta2$ and $b = e^{i\varphi}\sin\tfrac\vartheta2$ for one $\vartheta$ between 0
and $\pi$ and one $\varphi$: two angles, which fix a direction. The sphere of these directions is the **Bloch
sphere**. The mean spin points along the state's own direction, since $\langle\sigma_3\rangle = |a|^2 - |b|^2 =
\cos\vartheta$ and $\langle\sigma_1\rangle + i\langle\sigma_2\rangle = 2a^*b = \sin\vartheta\,e^{i\varphi}$, so
$\langle\boldsymbol\sigma\rangle = \hat n$.

A spin up along $\hat n_1 = \hat z$ is measured along $\hat n_2$. The Born rule gives yes with the probability
$|\langle{\uparrow}|\hat n_2\rangle|^2 = \cos^2\tfrac\vartheta2$, where $\vartheta$ is the angle between them. Turning
both directions together keeps the bracket, because turns are unitary (below), so for any two directions an angle
$\vartheta_{12}$ apart

$$\boxed{|\langle\hat n_1|\hat n_2\rangle|^2 = \cos^2\frac{\vartheta_{12}}{2} = \tfrac12\bigl(1 + \hat n_1\cdot\hat n_2\bigr)} .$$

For directions 60° apart it is $\cos^230° = 0.75$: a spin prepared up along one is found up along the other three times
in four. At 90° it is $\tfrac12$, and at 180° it is zero, so opposite points of the sphere are orthogonal states,
which never answer alike (Figure [](#fig:bloch-sphere)).

![Look first at the two arrows on the sphere: every state of a spin one half is up along one direction, and two
states 60° apart answer alike three times in four. A mixture, inside, has a shorter
arrow.](tut-bloch-sphere){#fig:bloch-sphere}

Chapter 8.2 made a unitary table $e^{-i\lambda G/\hbar}$ from a
[generator](/tutorial/quantum/operators/#a-generator-is-the-exponent-of-a-unitary-table) $G$. With $G$ the spin along
$\hat n$ and $\lambda$ the angle $\theta$, a turn by $\theta$ about $\hat n$ is $e^{-i\theta\,\hat n\cdot\mathbf S}$,
in units of $\hbar$. Because $(\hat n\cdot\boldsymbol\sigma)^2 = 1$, the even powers in its series are 1 and the odd
ones are $\hat n\cdot\boldsymbol\sigma$, and the two sums are the series of the cosine and the sine:

$$\boxed{e^{-i\theta\,\hat n\cdot\boldsymbol\sigma/2} = \cos\frac\theta2 - i\sin\frac\theta2\;\hat n\cdot\boldsymbol\sigma} .$$

**A check.** About $y$, $\sigma_2|{\uparrow}\rangle = i|{\downarrow}\rangle$, so the turn makes
$\cos\tfrac\theta2|{\uparrow}\rangle + \sin\tfrac\theta2|{\downarrow}\rangle$, which is $|\hat n\rangle$ with
$\vartheta = \theta$ and $\varphi = 0$: the arrow has turned by $\theta$ from $\hat z$ toward $\hat x$. About $z$ the
table is $\mathrm{diag}(e^{-i\theta/2}, e^{i\theta/2})$, half powers of the kind that chapter 1.5b
[used to define a spin](/tutorial/newton/complex-numbers/#an-arrow-is-one-complex-number-and-turning-the-axes-turns-it-back-by-the-same-angle).
At $\theta = 2\pi$ both factors are $-1$: **a full turn multiplies the state of a spin one half by $-1$**, an overall
phase, and only two full turns bring it back.

## A mixture is described by a density matrix, and its arrow is shorter

The paper's $\varrho_1$ belongs to one spin whose partners are ignored, so we need a state that allows for not
knowing. We want one object that gives every mean of a
[mixture](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel), a spin prepared in the state
$|\psi_a\rangle$ with the probability $p_a$. Its mean of a quantity $A$ is
$\sum_ap_a\langle\psi_a|A|\psi_a\rangle$, and a bracket $\langle\psi|A|\psi\rangle$ is the trace of the table
$A|\psi\rangle\langle\psi|$, since both are the sum of $\psi_i^*A_{ij}\psi_j$, so

$$\langle A\rangle = \mathrm{tr}(\varrho A), \qquad \sym{density-matrix}{\varrho} = \sum_ap_a\,|\psi_a\rangle\langle\psi_a| ,$$

where the **trace** $\mathrm{tr}$ is the sum of the diagonal entries (chapter 1.4). The table $\varrho$, whose entries
are pure numbers, is the **density matrix**.[^varrho] Mixtures with the same $\varrho$ cannot be told apart: half
$|{\uparrow}\rangle$ and half $|{\downarrow}\rangle$, and half up and half down along $x$, both give $\varrho =
\tfrac12$.

A density matrix is Hermitian with trace one, and it gives no negative probability. A Hermitian table of two rows
holds four real numbers, so it is a real combination of $1$, $\sigma_1$, $\sigma_2$ and $\sigma_3$, and the trace fixes
the part along 1, because each $\sigma_k$ has trace zero:

$$\boxed{\varrho = \tfrac12\bigl(1 + \mathbf b\cdot\boldsymbol\sigma\bigr)} .$$

Since $\mathrm{tr}(\sigma_j\sigma_k) = 2\delta_{jk}$, $\mathrm{tr}(\varrho\,\sigma_k) = b_k$, and the **Bloch vector**
$\sym{bloch-vector}{\mathbf b} = \langle\boldsymbol\sigma\rangle$ is the mean spin, doubled.[^b] Because $(\mathbf
b\cdot\boldsymbol\sigma)^2 = |\mathbf b|^2$, the eigenvalues of $\varrho$ are $\tfrac12(1 \pm |\mathbf b|)$, the
probabilities of the two outcomes along $\mathbf b$, and neither may be negative, so $|\mathbf b| \le 1$.

A **pure state**, $\varrho = |\psi\rangle\langle\psi|$ for one state, has the eigenvalues 1 and 0, so $|\mathbf b| = 1$
and $\mathbf b$ is the state's direction $\hat n$, on the sphere. A **mixed state** of different states has $|\mathbf
b| < 1$, inside the sphere, and $\mathbf b = 0$ is a spin that is **unpolarized**: every axis gives $\pm\tfrac12$
equally often. Half $|{\uparrow}\rangle$ and half spin up along $x$ give $\mathbf b = \tfrac12(\hat z + \hat x)$, of
length $1/\sqrt2 = 0.71$, because mixing averages the arrows.

## Part of a pure whole can be a mixture

The paper's $\varrho_1$ is what one of four spins holds when the other three are ignored, so we need the state of a
part of a whole, here one of two spins. By chapter 8.1's
[rule for two things](/tutorial/quantum/states/#a-record-of-the-place-multiplies-the-interference-by-the-overlap-of-the-records),
a state of two spins one half has four amplitudes $c_{ij}$, one for each pair of outcomes, and $|\Psi\rangle =
\sum_{ij}c_{ij}|i\rangle|j\rangle$, with $i$ and $j$ each $\uparrow$ or $\downarrow$. A quantity $A$ of the first spin
acts on the first factor alone. The bracket of two products is the product of the brackets, and $\langle j|j'\rangle$
is one for $j = j'$ and zero otherwise, so

$$\langle A\rangle = \sum_{i,i',j}c_{ij}^*A_{ii'}c_{i'j} = \mathrm{tr}(\varrho_1A), \qquad \varrho_1 = CC^\dagger ,$$

where $C$ is the table of the amplitudes $c_{ij}$. The entries $(\varrho_1)_{i'i} = \sum_jc_{i'j}c_{ij}^*$ are a sum
over the outcomes of the second spin, the **partial trace**, and $\varrho_1$ is the **reduced state** of the first
spin.

A **product state**, $|\hat n\rangle|\hat n'\rangle$, has $c_{ij} = a_ia'_j$ with $\vect a$ and $\vect a'$ of length
one, so $C = \vect a\vect a'^{\mathsf T}$ and $CC^\dagger = \vect a\vect a^\dagger$: the first spin alone is in the pure
state $|\hat n\rangle$. The **singlet** is

$$\begin{gathered}\frac{|{\uparrow}\rangle|{\downarrow}\rangle - |{\downarrow}\rangle|{\uparrow}\rangle}{\sqrt2},\\ C = \frac{1}{\sqrt2}\begin{pmatrix}0 & 1\\ -1 & 0\end{pmatrix}, \qquad CC^\dagger = \tfrac12 .\end{gathered}$$

The whole is pure, yet each half has $\mathbf b = 0$. Two things whose pure joint state is not a product are
**entangled**, and a pure state of two is a product exactly when the reduced state is pure, because both say that $C$
has rank one. A spin that leaves a record in a second system becomes a mixture in this way, as in chapter 8.1's
decoherence (the stretch problem below).

## A spin $s$ is a symmetric state of $2s$ spins one half

We want to build larger spins from spins one half. A state of $N$ spins one half is **symmetric** if it is unchanged
when any two of the spins are exchanged. For two spins, $|{\uparrow}\rangle|{\uparrow}\rangle$,
$(|{\uparrow}\rangle|{\downarrow}\rangle + |{\downarrow}\rangle|{\uparrow}\rangle)/\sqrt2$ and
$|{\downarrow}\rangle|{\downarrow}\rangle$ are symmetric, while the singlet changes sign. The amplitude of a symmetric
state can depend only on how many of the spins are up, a count $k$ from 0 to $N$, so the symmetric states form a space
of $N + 1$ dimensions. Its basis states, the equal sums of all arrangements with $k$ spins up scaled to length one,
are written $|s, m\rangle$, with two numbers named next.

A turn by $\theta$ about $z$ multiplies each spin up by $e^{-i\theta/2}$ and each spin down by $e^{i\theta/2}$, so it
multiplies $|s, m\rangle$ by

$$\begin{gathered}e^{-i[k - (N - k)]\theta/2} = e^{-im\theta},\\ m = k - \tfrac N2 = -s, \dots, s, \qquad s = \tfrac N2 .\end{gathered}$$

The number $\sym{spin-number}{s}$ is the **spin** of the state, and $\sym{spin-component}{m}$, the outcome of $S_z$ on
$|s, m\rangle$, is its **spin component** along $z$.[^m] A spin $s$ has $2s + 1$ components, one for each $m$ from
$-s$ to $s$, so its spin is the largest $m$ it can hold. The factor $e^{-im\theta}$ is chapter 1.5b's, and 1.5b's spin
is this $m$ up to its sign.[^turned] Its null vector $\vect m$, turned with its axes, is the component $m = 1$ of a
spin one, and $\vect m\vect m^{\mathsf T}$ is the component $m = 2$ of a spin two, while its arrow and its shear,
numbers read in turned axes, are the components $m = -1$ and $m = -2$. A spin one has three components, as light's
$\sym{complex-field}{\light{\vect F}} = \light{\vect E} + ic\light{\vect B}$ at a point has (chapter
[6.6](/tutorial/relativity/maxwell-complex/#maxwells-four-equations-are-two-equations-for-one-complex-vector)).

The total spin is $\mathbf S = \tfrac12\sum_a\boldsymbol\sigma^{(a)}$, where $\boldsymbol\sigma^{(a)}$ acts on the
spin numbered $a$. In a symmetric state every spin has the same mean, because exchanging two spins changes nothing, so
$\langle\mathbf S\rangle = \tfrac12N\langle\boldsymbol\sigma^{(1)}\rangle$, and the Bloch vector of any one of them is

$$\boxed{\langle\boldsymbol\sigma^{(1)}\rangle = \frac{\langle\mathbf S\rangle}{s}} ,$$

in units of $\hbar$. With every spin up, $\langle\mathbf S\rangle = s\hat z$ and each spin has $\hat z$, a pure state.

## A reading turns as a spin two

We want to show that one reading, the paper's $\sym{weyl-complex}{\curv{\mathcal W}} = \curv{\tE} + i\curv{\tB}$, is a
spin two. It is chapter 1.5b's symmetric trace-free table of tide and magnetic part, in $\mathrm{s^{-2}}$, and it has
five complex components. We treat it as the state of a spin,[^conj] with the bracket

$$\langle\curv{\mathcal W}_1|\curv{\mathcal W}_2\rangle = \mathrm{tr}(\curv{\mathcal W}_1^\dagger\curv{\mathcal W}_2) ,$$

whose squared length is $|\curv{\tE}|^2 + |\curv{\tB}|^2$, with chapter 1.5's
[Frobenius norm](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length).
Nothing quantum is assumed: the language of states only organizes five complex numbers.

Chapter 1.7's table $R = \exp(\theta\,\hat u\cdot L)$, built from the
[generators](/tutorial/newton/hamilton/#every-quantity-generates-a-motion-and-a-symmetry-gives-a-constant)
$\sym{generators}{(L_k)_{ij}} = -\epsilon_{kij}$, turns arrows by $\theta$ about $\hat u$, and it turns the field to
$R\curv{\mathcal W}R^{\mathsf T}$. Chapter 1.5 turned the axes instead, as $RTR^{\mathsf T}$ with the new axes as the
rows of $R$, so 1.5's $R$ is 1.7's $R^{\mathsf T}$. For a small angle $R \approx 1 + \theta\,\hat u\cdot L$ and
$R^{\mathsf T} \approx 1 - \theta\,\hat u\cdot L$, because each $L_k$ is antisymmetric, so $R\curv{\mathcal
W}R^{\mathsf T} \approx \curv{\mathcal W} + \theta\,[\hat u\cdot L, \curv{\mathcal W}]$. Matching this with a quantum
turn, $1 - i\theta\,\hat u\cdot\mathbf S$ for a small angle, gives the spin

$$S_k\curv{\mathcal W} = [iL_k, \curv{\mathcal W}] ,$$

which is Hermitian, because turns keep lengths. **A check.** For a wave along $\hat k$, $\curv{\mathcal W} \propto
\vect m\vect m^{\mathsf T}$ (the paper's [](/paper/#eq:square)), and chapter 1.7's $(\hat k\cdot L)\vect a = \hat
k\times\vect a$ with 1.5b's $\hat k\times\vect m = -i\vect m$ gives

$$\begin{aligned}[i\hat k\cdot L, \vect m\vect m^{\mathsf T}] &= i(-i\vect m)\vect m^{\mathsf T} + i\vect m(-i\vect m)^{\mathsf T}\\ &= 2\,\vect m\vect m^{\mathsf T} .\end{aligned}$$

So a wave is the component $m = 2$ along its direction of travel, the largest a spin two can hold, for every
polarization, linear included. This is not the wave's helicity, which chapter 9.1 reads from how $\curv{\mathcal W}$
changes in time. The same steps give $m = 1$, 0, $-1$ and $-2$ for four other tables, and a reading's five complex
components $c_m$ are its parts along these five. A reading turns as a spin two about every axis, and we state without
proof that any five such numbers are a symmetric state of four spins one half, the paper's four.

## A spin $s$ is $2s$ stars on the sky

We want a picture of any spin state. Ettore Majorana showed in 1932 that every symmetric state of $2s$ spins one half
is, up to a factor, one product $|\hat n_1\rangle\cdots|\hat n_{2s}\rangle$ summed over every order of its factors.
The $2s$ directions are the state's **Majorana stars**. They are found from the state's components $c_m$ as the roots
of the polynomial of degree $2s$ in a complex variable $z$,

$$p(z) = \sum_{m=-s}^{s}(-1)^{s-m}\sqrt{\binom{2s}{s+m}}\;c_m\,z^{s+m} .$$

Chapter 6.6's
[stereographic map](/tutorial/relativity/maxwell-complex/#light-has-two-special-directions-where-gravity-has-four)
$\hat n(z) = (2\,\mathrm{Re}\,z,\ 2\,\mathrm{Im}\,z,\ 1 - |z|^2)/(1 + |z|^2)$ carries its $2s$ roots to directions,
and a root missing because the top coefficient vanishes is a star at $-\hat z$. For a spin one half, $p(z) =
c_{1/2}z - c_{-1/2}$, whose root $b/a = \tan\tfrac\vartheta2\,e^{i\varphi}$ the map sends to $\hat n$: the one star is
the Bloch vector.

::: gap
This sketch states Majorana's polynomial and does not derive its binomial factors. They come from multiplying the
$2s$ polynomials $a_jz - b_j$ of the single spins and matching the coefficients with the components of the symmetric
sum, since the roots of a product are the roots of its factors.
:::

For a reading, with chapter 6.6's null vector $\vect m(z) = (1 - z^2,\ i(1 + z^2),\ -2z)$, Section VIII's quartic
is twice Majorana's polynomial, so its coefficients give the $c_m$ (stated; chapter 9.4 reads [](/paper/#eq:stars) in
full):

$$\vect m(z)^{\mathsf T}\curv{\mathcal W}\,\vect m(z) = 2\,p(z) .$$

So a reading's four stars are its principal null directions, as light's two are chapter 6.6's. For a wave along
$\hat z$, $\curv{\mathcal W} \propto \vect m\vect m^{\mathsf T}$, and $\vect m(z)^{\mathsf T}\vect m\vect
m^{\mathsf T}\vect m(z) = (\vect m\cdot\vect m(z))^2 = 2z^4$, whose four roots are $z = 0$: the north pole, the
direction of travel. For a body on the $z$ axis, $\curv{\mathcal W} \propto \mathrm{diag}(1, 1, -2)$ gives $(1 -
z^2)^2 - (1 + z^2)^2 - 8z^2 = -12z^2$: two stars at the north pole, and two missing roots, which are stars at the
south pole (Figure [](#fig:majorana-three)).

A **spin coherent state** $|\hat n\rangle_s = |\hat n\rangle\cdots|\hat n\rangle$ has all $2s$ spins up along $\hat n$,
so all its stars sit there. Like chapter 8.3's
[coherent state](/tutorial/quantum/quanta/#a-classical-oscillation-is-a-state-of-many-quanta-in-step) of an
oscillator, it is the state closest to a classical arrow. The bracket of two products is the product of the
brackets, so by the overlap of a spin one half

$$\boxed{|\langle\hat n_1|\hat n_2\rangle_s|^2 = \cos^{4s}\frac{\vartheta_{12}}{2}} .$$

For a spin two 60° apart it is $\cos^830° = 0.32$, against 0.75 for a spin one half: larger spins point more
sharply. We state that the coherent states of all directions are **complete**,

$$\frac{2s + 1}{4\pi}\int|\hat n\rangle_s\langle\hat n|_s\;\dd\Omega = 1 ,$$

with chapter 2.2's solid angle $\dd\Omega$, so $(2s + 1)/4\pi$ times $|{}_s\langle\hat n|\psi\rangle|^2$ is a
probability density over the sky, which chapter 8.6 uses to measure a direction.

![Look first at the arrows, the Bloch vector $\mathbf b = \mathbf P/u$: one spin of a reading is pure for a wave,
unpolarized for a body at rest, and in between for a body and a wave together. Each dot is one of the reading's four
spins one half, a star of Majorana and a principal null direction of the paper. The stars are
computed.](tut-majorana-three){#fig:majorana-three}

<!-- diagram: tut-light-gravity-stars — dropped in revision: it repeated chapter 6.6's figure of light's two directions
and the paper's fig:stars, which the try block below shows live. -->

## One of the four spins of a reading points along its super-Poynting vector

We want the Bloch vector of one of a reading's four spins, the paper's [](/paper/#eq:one-spin). By the
[rule for one spin of a symmetric state](#a-spin-s-is-a-symmetric-state-of-2s-spins-one-half) with $s = 2$ it is
$\langle\mathbf S\rangle/2$, so we need the mean spin of the reading under the spin of the
[last section but one](#a-reading-turns-as-a-spin-two), $\langle S_k\rangle = \mathrm{tr}(\curv{\mathcal
W}^\dagger[iL_k, \curv{\mathcal W}])/\mathrm{tr}(\curv{\mathcal W}^\dagger\curv{\mathcal W})$. The box below finds

$$\begin{aligned}\mathrm{tr}\bigl(\curv{\mathcal W}^\dagger[iL_k, \curv{\mathcal W}]\bigr) &= 4\epsilon_{kij}(\curv{\tE}\curv{\tB})_{ij},\\ \mathrm{tr}(\curv{\mathcal W}^\dagger\curv{\mathcal W}) &= |\curv{\tE}|^2 + |\curv{\tB}|^2 .\end{aligned}$$

::: derivation
### The mean spin of a reading

Since $\mathrm{tr}(XY) = \mathrm{tr}(YX)$,

$$\mathrm{tr}(\curv{\mathcal W}^\dagger L_k\curv{\mathcal W} - \curv{\mathcal W}^\dagger\curv{\mathcal W}L_k) = \mathrm{tr}\bigl(L_k[\curv{\mathcal W}, \curv{\mathcal W}^\dagger]\bigr) .$$

The tables $\curv{\tE}$ and $\curv{\tB}$ are real and symmetric, so $\curv{\mathcal W}^\dagger = \curv{\tE} -
i\curv{\tB}$, and multiplying out gives

$$\begin{aligned}
\curv{\mathcal W}\curv{\mathcal W}^\dagger &= \curv{\tE}^2 + \curv{\tB}^2 - i(\curv{\tE}\curv{\tB} - \curv{\tB}\curv{\tE}),\\
\curv{\mathcal W}^\dagger\curv{\mathcal W} &= \curv{\tE}^2 + \curv{\tB}^2 + i(\curv{\tE}\curv{\tB} - \curv{\tB}\curv{\tE}),
\end{aligned}$$

so $[\curv{\mathcal W}, \curv{\mathcal W}^\dagger] = -2i[\curv{\tE}, \curv{\tB}]$, and the trace of the second line is
$|\curv{\tE}|^2 + |\curv{\tB}|^2$, since a commutator has trace zero. For any table $M$, $\mathrm{tr}(L_kM) =
-\epsilon_{kij}M_{ji} = \epsilon_{kij}M_{ij}$. The transpose of $\curv{\tE}\curv{\tB}$ is $\curv{\tB}\curv{\tE}$, so
$\epsilon_{kij}(\curv{\tB}\curv{\tE})_{ij} = -\epsilon_{kij}(\curv{\tE}\curv{\tB})_{ij}$ and
$\epsilon_{kij}[\curv{\tE}, \curv{\tB}]_{ij} = 2\epsilon_{kij}(\curv{\tE}\curv{\tB})_{ij}$. Together,
$\mathrm{tr}(\curv{\mathcal W}^\dagger[iL_k, \curv{\mathcal W}]) = i\cdot(-2i)\cdot2\epsilon_{kij}(\curv{\tE}\curv{\tB})_{ij}
= 4\epsilon_{kij}(\curv{\tE}\curv{\tB})_{ij}$.
:::

We name the results as the paper does. The **super-Poynting vector** $\mathbf P$ has the components
$\sym{super-poynting}{P_k} = \epsilon_{kij}(\curv{\tE}\curv{\tB})_{ij}$, and the **super-energy** is
$\sym{super-energy}{u} = \tfrac12(|\curv{\tE}|^2 + |\curv{\tB}|^2)$, both in $\mathrm{s^{-4}}$. The mean spin is
$\langle\mathbf S\rangle = 2\mathbf P/u$, so one spin has the Bloch vector $\mathbf b =
\mathbf P/u$, a pure number, and the
[density matrix](#a-mixture-is-described-by-a-density-matrix-and-its-arrow-is-shorter)

$$\boxed{\varrho_1 = \tfrac12\Bigl(1 + \frac{\mathbf P\cdot\boldsymbol\sigma}{u}\Bigr)} ,$$

the paper's [](/paper/#eq:one-spin). The names come from light: the same steps for light's $\light{\vect F}$ give a
mean spin equal to its Poynting vector divided by $c$ and by its energy density, by chapter 6.6's
[products](/tutorial/relativity/maxwell-complex/#the-energy-of-the-field-and-its-flow-are-two-products-of-the-complex-field).
Since no Bloch vector is longer than one, $|\mathbf P| \le u$ for every reading.

**One wave.** By the check of the [last section but one](#a-reading-turns-as-a-spin-two), $\langle\mathbf S\rangle =
2\hat k$, so $\mathbf b = \hat k$ and $|\mathbf P| = u$: one spin is pure, the four are a coherent state,
they are not entangled, and the stars coincide on the direction of travel.

**One body at rest.** Then $\curv{\tB} = 0$, so $\mathbf P = 0$ and each spin is unpolarized. The four
together are pure while one of them is mixed, so they are not a product: they are entangled, and their stars sit in
two pairs. More generally $\mathbf P$ is built from $[\curv{\tE}, \curv{\tB}]$, which is zero when the
two tables share their axes. Chapter 0.4's
[rest frame](/tutorial/evening/one-pixel/#the-ten-numbers-regroup-into-four-invariants-three-angles-and-a-velocity) of
the field is the one frame in which they do, and for bodies at rest it is theirs. So one spin is unpolarized in the
field's own rest frame, as the paper says.

**In between.** Take a body and a wave running along the line to it, which the paper calls type II. Let the body, of
mass $\matter M$, lie a distance $r$ away on the $z$ axis, so that $\curv{\mathcal W}_{\rm
body} = \curv w\,\mathrm{diag}(1, 1, -2)$ with $\curv w = G\matter M/r^3$ in $\mathrm{s^{-2}}$. Let the wave travel
along $+\hat z$ with the tide $\curv{\tE}_+ = \curv w$, so that $\curv{\tE}_{\rm wave} = \curv w\,\mathrm{diag}(1, -1,
0)$ and $\curv{\tB}_{\rm wave} = \curv w(\hat x\hat y^{\mathsf T} + \hat y\hat x^{\mathsf T})$. The wave alone gives
$\mathbf P = 2\curv w^2\hat z$, and the body adds nothing, because its table is the same along $x$ and
$y$, so its product with the wave's magnetic part is symmetric. The super-energy is $u = 3\curv w^2$ from the body plus
$2\curv w^2$ from the wave, with no cross term, so $|\mathbf P|/u = 2/5 = 0.4$. Two stars stay on the
wave's direction, and the other two move to 120° from it.

We state without proof the paper's other claim, that chapter 0.4's Petrov types, the patterns of coincident stars, are
the four spins' classes of entanglement [@BengtssonZyczkowski2017; @Kam2026].

::: try {#stars}
The paper's figure of the special directions, with gravity's sky above and light's below. Each of gravity's four dots
is a Majorana star of the reading, and touching dots coincide. The buttons choose the sources, the slider sets the
speed of the first body, and the skies can be turned.

Before you touch anything, predict: one spin of a single body's reading is unpolarized when the body is at rest; is
it still unpolarized when the body moves? Choose *One body*, set the speed to zero, and look at how the four stars are
arranged; then raise the speed and watch what the pairs do. Afterwards, say why a moving body's pairs need not be
opposite, using the field's rest frame.
:::

::: try {#majorana-stars}
A sphere you can turn, carrying the four Majorana stars of a spin two, or with a switch the two of light. Drag the stars
anywhere, or choose a reading from the presets: a wave, a body at rest, a body with a wave along its line, two bodies.
The arrow from the centre is one spin's Bloch vector $\mathbf b = \mathbf P/u$; the bars beside the sphere show the
sizes and phases of the five components $c_m$; and a ring that you place on the sphere reads the overlap of the state
with the coherent state there.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, place
the ring on a star of the wave's reading and then at the opposite pole, and say why the overlap falls from one to zero.
:::

::: check
### Q

What is $|\langle\hat n_1|\hat n_2\rangle|^2$ for two directions at right angles, for a spin one half and for the
coherent states of a spin two?

### A

$\cos^245° = \tfrac12$ for a spin one half, and $\cos^845° = \tfrac1{16}$ for a spin two.

### Q

Why does a spin one half change sign when it is turned once round?

### A

Its turns are $e^{-i\theta\,\hat n\cdot\boldsymbol\sigma/2} = \cos\tfrac\theta2 - i\sin\tfrac\theta2\,\hat
n\cdot\boldsymbol\sigma$, which is $-1$ at $\theta = 2\pi$: each component turns by half the angle.

### Q

Why is one of the four spins of a single body's reading unpolarized?

### A

At rest $\curv{\tB} = 0$, so $P_k = \epsilon_{kij}(\curv{\tE}\curv{\tB})_{ij} = 0$ and $\varrho_1 = \tfrac12$.

### Q

Is one spin of a moving body's reading still unpolarized?

### A

No. A pixel that the body passes is not in the field's rest frame, so $\curv{\tB} \ne 0$ and its axes differ from
$\curv{\tE}$'s, and $\mathbf P \ne 0$. The stars stay in two pairs, which are no longer opposite, and one spin's Bloch
vector points along the line midway between the pairs.
:::

**The idea to keep: a spin one half is two complex numbers, which always point somewhere on a sphere, and a spin $s$
is a symmetric state of $2s$ of them, drawn as $2s$ stars. A gravitational reading is a spin two with four stars, and
one of its four spins one half has the Bloch vector $\mathbf P/u$: pure for a single wave, unpolarized
for a single body at rest.**

::: problems
### Practice

Find the Bloch vector of the state $(\cos\tfrac\pi8,\ e^{i\pi/4}\sin\tfrac\pi8)$ and check its length.

::: solution
It is $|\hat n\rangle$ with $\vartheta = \pi/4$ and $\varphi = \pi/4$, so $\mathbf b = (\sin\tfrac\pi4\cos\tfrac\pi4,\
\sin\tfrac\pi4\sin\tfrac\pi4,\ \cos\tfrac\pi4) = (\tfrac12, \tfrac12, \tfrac1{\sqrt2})$. Its squared length is
$\tfrac14 + \tfrac14 + \tfrac12 = 1$: a pure state.
:::

### Stretch

Combine with chapter 8.1. A spin one half prepared up along $z$ passes a magnet that leaves a record in a second
system, $|{\uparrow}\rangle|0\rangle \to \cos\alpha\,|{\uparrow}\rangle|0\rangle + \sin\alpha\,|{\downarrow}\rangle|1\rangle$.
Find the first spin's Bloch vector.

::: solution
The table of amplitudes is $C = \mathrm{diag}(\cos\alpha, \sin\alpha)$, so $\varrho_1 = CC^\dagger =
\mathrm{diag}(\cos^2\alpha, \sin^2\alpha)$ and $\mathbf b = (0, 0, \cos^2\alpha - \sin^2\alpha) = (0, 0, \cos2\alpha)$.
The records $|0\rangle$ and $|1\rangle$ are orthogonal for every $\alpha$, so the record removes the sideways part
$(\sin2\alpha, 0, \cdot)$ that the unrecorded state $\cos\alpha|{\uparrow}\rangle + \sin\alpha|{\downarrow}\rangle$
would have, and the arrow is shorter. At $\alpha = 45°$ the two branches weigh the same, and the spin is unpolarized.
:::

### The paper

Derive the paper's [](/paper/#eq:one-spin) from $S_k\curv{\mathcal W} = [iL_k, \curv{\mathcal W}]$, and evaluate
$|\mathbf P|/u$ for a plane wave and for the two masses at rest of the paper's Figure
[](/paper/#fig:stars).

::: solution
The [box](#one-of-the-four-spins-of-a-reading-points-along-its-super-poynting-vector) gives $\langle\mathbf S\rangle =
2\mathbf P/u$, and the symmetric rule with $s = 2$ gives the Bloch vector $\mathbf P/u$. A
plane wave has $\langle\mathbf S\rangle = 2\hat k$, so $|\mathbf P|/u = 1$. Masses at rest have
$\curv{\tB} = 0$ in their frame, so $|\mathbf P|/u = 0$ there, whatever their number.
:::
:::

::: paper
- Section VIII's [*Principal null directions*](/paper/#par:principal-null-directions): the Majorana stars of a spin
  two [@Bruno2019], the four spins one half, and the paper's [](/paper/#eq:one-spin), derived here.
- Section IX's [*Counting or recording*](/paper/#par:counting-or-recording): one graviton excites its five modes in "a
  coherent state of spin two", and clicks with the density $(5/4\pi)\cos^8(\vartheta/2)$, the completeness of this
  chapter's coherent states (chapter 8.6).
- Section VIII's [*One pixel and many*](/paper/#par:one-pixel-and-many): two pixels' responses to directions
  $\vartheta$ apart are weighted by $\cos^8(\vartheta/2)$, the overlap of two spin-two coherent states.
:::

::: deeper
- The GR course's
  [section on quantum states](https://neovand.github.io/general-relativity/chapter-22.html#quantum-states-and-reduced-information)
  works a pure whole with an uncertain part, this chapter's partial trace.
- I. Bengtsson and K. Życzkowski, *Geometry of Quantum States* (2nd ed., Cambridge, 2017), chapters 5 to 7: the Bloch
  ball, coherent states and Majorana's stars, with pictures.
- E. Majorana, "Atomi orientati in campo magnetico variabile", *Il Nuovo Cimento* 9, 43 (1932): the stars' first
  appearance; the paper's [@Bruno2019] and [@Kam2026] draw them for spin-two fields.
:::

[^sg]: A silver atom's magnetism comes from one electron. Samuel Goudsmit and George Uhlenbeck proposed the
    electron's spin in 1925, and Wolfgang Pauli wrote its matrices in 1927.

[^varrho]: The paper writes the density matrix $\varrho$, a curly rho. The tutorial keeps $\rho$ for a density of
    mass, and Section VIII's $\rho$ for the signal-to-noise ratio of one reading.

[^m]: This $m$ is not a mass, and not the null vector $\vect m$, which is always bold.

[^turned]: Chapter 1.5b turned the axes, and here the state itself is turned. Turning the axes by $\theta$ multiplies
    the component $m$ by $e^{+im\theta}$, the opposite factor, so 1.5b's arrow and shear, multiplied by
    $e^{-i\theta}$ and $e^{-2i\theta}$ when the axes turn, are the components $m = -1$ and $-2$. Its null vector
    $\vect m$ was built from the turned axes themselves, so it turned as a state does.

[^conj]: The paper takes $\curv{\mathcal W}$ itself as the state, not its conjugate, and this fixes the signs below:
    with $\curv{\mathcal W}^*$ the Bloch vector would be $-\mathbf P/u$, and every star would move to the opposite
    point. By the same choice, Section IX's graviton "from $\hat n$" is in the coherent state at $\hat k = -\hat n$,
    which is why the paper labels "each click by the direction opposite to that of its coherent state".

[^b]: Bold $\mathbf b$, b for Bloch, is not the second amplitude $b$ of a state $(a, b)$, which is never bold,
    or chapter 8.2's kick $b$.
