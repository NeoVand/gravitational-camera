---
id: '8.4'
title: 'Spin and the Majorana picture'
question: 'A state of spin two is also a state of four spins one half that is unchanged when they are exchanged. What is a spin, and how can a reading''s five complex numbers be four arrows on a sphere?'
part: '8'
requires: ['1.1', '1.5', '1.5b', '1.7', '2.2', '8.1', '8.2']
paper: [sec:one-pixel, eq:one-spin, eq:stars, eq:square, sec:first-image]
figures: []
live: [stars, majorana-stars]
depth: A
---

A state of spin two is also a state of four spins one half that is unchanged when they are exchanged, and the Petrov
types of a reading are then its classes of entanglement.[^first] The four spins are the four special directions of a
reading met in [section 0.4](/tutorial/evening/one-pixel/), and the spin two is the pattern of stretch of section 1.5b.
What is a spin, and how can a reading's five complex numbers be four arrows on a sphere? We use the states of
[section 8.1](/tutorial/quantum/states/) and the operators of [section 8.2](/tutorial/quantum/operators/).

::: plain
Some particles, such as electrons and atoms of silver, carry a small amount of turning, called spin. Measured along any
direction, their spin gives one of only two answers, up or down. The quantum state of such a spin is two complex
numbers, and every such state is "up" along exactly one direction, so it can be drawn as an arrow to a point on a
sphere. The arrow is shorter when we do not know which state was prepared, or when the spin is one of two particles
whose joint state is known exactly, called entangled.

A larger spin can be built from several small ones and drawn as their points on the sphere, called its stars. A
reading at a point, five complex numbers, is such a spin, with four stars. For a single passing wave the four stars sit
together and each small spin points along the wave; for a single body at rest each small spin points nowhere.
:::

## A spin one half is a state of two components

In 1922 Stern and Gerlach sent a beam of silver atoms
through a magnet whose field grew strongly across the beam, which pushes each atom one way or the other according to the
way it points. The beam did not spread into a smear but split into two spots, whichever way the magnet was
turned. Such a magnet makes a **Stern–Gerlach measurement** of the angular momentum of each atom along its axis,
and it finds only $+\tfrac12\hbar$ or $-\tfrac12\hbar$. This angular momentum belongs to the atom's outermost electron
itself, not to an orbit, and is called **spin**. A particle whose spin gives these two outcomes
along every axis has **spin one half**.

A quantity with two outcomes has a state of two amplitudes, as the
[two paths](/tutorial/quantum/states/#a-quantum-state-is-a-list-of-complex-amplitudes) of section 8.1 had. Along an axis $z$ we write
$\sym{spin-up-down}{|{\uparrow}\rangle} = (1, 0)$ for $+\tfrac12\hbar$ and $|{\downarrow}\rangle = (0, 1)$ for
$-\tfrac12\hbar$, so by the [rule](/tutorial/quantum/operators/#a-measurable-quantity-is-a-hermitian-table) of section 8.2 for building an operator from its outcomes and their
states, the spin along $z$ is $\tfrac12\hbar\,\mathrm{diag}(1, -1) = \tfrac12\hbar\,\sym{pauli}{\sigma_3}$. We define
the spin along the three axes by the three Pauli matrices of 8.2,

$$\sym{spin-vector}{\mathbf S} = \tfrac12\hbar\,\boldsymbol\sigma, \qquad S_k = \tfrac12\hbar\,\sigma_k ,$$

in joule seconds, with $\boldsymbol\sigma$ standing for the three matrices together. The reason for this choice is the
rule that the three obey:

$$\boxed{\sigma_i\sigma_j = \delta_{ij} + i\epsilon_{ijk}\sigma_k} ,$$

with the Kronecker delta $\delta_{ij}$ and Levi-Civita symbol $\epsilon_{ijk}$ of section 1.1, and with the unit table
written as 1. Multiplying out the tables checks all nine; for example $\sigma_1\sigma_2 = i\sigma_3$ (section 8.2),
and $\epsilon_{123} = 1$. Subtracting the equation with $i$ and $j$ swapped removes the delta and doubles the rest, so $[\sigma_i, \sigma_j] = 2i\epsilon_{ijk}\sigma_k$ and

$$[S_x, S_y] = \tfrac14\hbar^2\cdot2i\sigma_3 = i\hbar\,S_z .$$

This is the rule $[L_x, L_y] = i\hbar L_z$ that a problem of section 8.2 derived for the angular momentum $\vect
x\times\vect p$ of an orbit, so the three tables are an angular momentum. From here on we measure spin in units of
$\hbar$: $\mathbf S = \tfrac12\boldsymbol\sigma$, with the outcomes $\pm\tfrac12$ along every axis.

## Every state of a spin one half points somewhere

Take a direction, the unit vector $\hat n =
(\sin\vartheta\cos\varphi, \sin\vartheta\sin\varphi, \cos\vartheta)$ with the
[polar angle $\vartheta$ and azimuth $\varphi$](/tutorial/outside/spherical-harmonics/#a-direction-is-two-angles-and-a-small-patch-of-sky-has-the-solid-angle-sinvarthetamathrmdvarthetamathrmdvarphi) of section 2.2.
The spin along $\hat n$ is $\hat n\cdot\mathbf S = \tfrac12\,\hat n\cdot\boldsymbol\sigma$, with

$$\hat n\cdot\boldsymbol\sigma = \begin{pmatrix}\cos\vartheta & \sin\vartheta\,e^{-i\varphi}\\ \sin\vartheta\,e^{i\varphi} & -\cos\vartheta\end{pmatrix} .$$

By the rule above, $(\hat n\cdot\boldsymbol\sigma)^2 = \hat n_i\hat n_j(\delta_{ij} + i\epsilon_{ijk}\sigma_k) = 1$,
because $\epsilon_{ijk}$ changes sign when $i$ and $j$ are swapped and $\hat n_i\hat n_j$ does not. So the outcomes
are again $\pm1$. The state

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
$|\langle{\uparrow}|\hat n_2\rangle|^2 = \cos^2\tfrac\vartheta2$, where $\vartheta$ is the angle between them. Turning both directions together keeps the bracket, because turns are unitary (below), so for any two directions an
angle $\vartheta_{12}$ apart

$$\boxed{|\langle\hat n_1|\hat n_2\rangle|^2 = \cos^2\frac{\vartheta_{12}}{2} = \tfrac12\bigl(1 + \hat n_1\cdot\hat n_2\bigr)} .$$

For directions 60° apart it is $\cos^230° = 0.75$: a spin prepared up along one is found up along the other three times
in four. At 90° it is $\tfrac12$, and at 180° it is zero, so opposite points of the sphere are orthogonal states (Figure
[](#fig:bloch-sphere)).

![Look first at the two arrows on the sphere: two states 60° apart answer alike three times in four. A mixture,
inside, has a shorter arrow.](tut-bloch-sphere){#fig:bloch-sphere}

Section 8.2 made a unitary table $e^{-i\lambda G/\hbar}$ from a
[generator](/tutorial/quantum/operators/#a-generator-is-the-exponent-of-a-unitary-table) $G$. With $G$ the spin along
$\hat n$ and $\lambda$ the angle $\theta$, a turn by $\theta$ about $\hat n$ is $e^{-i\theta\,\hat n\cdot\mathbf S}$,
in units of $\hbar$. Because $(\hat n\cdot\boldsymbol\sigma)^2 = 1$, the even powers in its series are 1 and the odd
ones are $\hat n\cdot\boldsymbol\sigma$, and the two sums are the series of the cosine and the sine:

$$\boxed{e^{-i\theta\,\hat n\cdot\boldsymbol\sigma/2} = \cos\frac\theta2 - i\sin\frac\theta2\;\hat n\cdot\boldsymbol\sigma} .$$

**A check.** About $y$, $\sigma_2|{\uparrow}\rangle = i|{\downarrow}\rangle$, so the turn makes
$\cos\tfrac\theta2|{\uparrow}\rangle + \sin\tfrac\theta2|{\downarrow}\rangle = |\hat n\rangle$ with $\vartheta = \theta$ and
$\varphi = 0$: the arrow has turned by $\theta$ from $\hat z$ toward $\hat x$. About $z$ the
table is $\mathrm{diag}(e^{-i\theta/2}, e^{i\theta/2})$, half powers of the kind that
[defined a spin](/tutorial/newton/complex-numbers/) in section 1.5b.
At $\theta = 2\pi$ both factors are $-1$: **a full turn multiplies the state of a spin one half by $-1$**, an overall
phase, and only two full turns bring it back.

## A mixture is described by a density matrix, and its arrow is shorter

One spin of a reading has its partners ignored, so we need one object
that gives every mean of a [mixture](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel), a spin prepared in the state
$|\psi_a\rangle$ with the probability $p_a$. Its mean of a quantity $A$ is
$\sum_ap_a\langle\psi_a|A|\psi_a\rangle$, and a bracket $\langle\psi|A|\psi\rangle$ is the trace of the table
$A|\psi\rangle\langle\psi|$, since both are the sum of $\psi_i^*A_{ij}\psi_j$, so

$$\langle A\rangle = \mathrm{tr}(\varrho A), \qquad \sym{density-matrix}{\varrho} = \sum_ap_a\,|\psi_a\rangle\langle\psi_a| ,$$

where the **trace** $\mathrm{tr}$ is the sum of the diagonal entries (section 1.4). The table $\varrho$, whose entries
are pure numbers, is the **density matrix**.[^varrho] Mixtures with the same $\varrho$ cannot be told apart: half
$|{\uparrow}\rangle$ and half $|{\downarrow}\rangle$, and half up and half down along $x$, both give $\varrho =
\tfrac12$.

A density matrix is Hermitian with trace one, and it gives no negative probability. A Hermitian table of two rows
holds four real numbers, so it is a real combination of $1$, $\sigma_1$, $\sigma_2$ and $\sigma_3$, and the trace fixes the part along 1,
because each $\sigma_k$ has trace zero:

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

What one of four spins holds when the other three are ignored is the state of a part of a whole, and we start with one of
two spins. By the [rule for two things](/tutorial/quantum/states/#a-record-of-the-place-multiplies-the-interference-by-the-overlap-of-the-records) of section 8.1, a state of two spins one half has four amplitudes $c_{ij}$, one for each pair of outcomes, and $|\Psi\rangle =
\sum_{ij}c_{ij}|i\rangle|j\rangle$, with $i$ and $j$ each $\uparrow$ or $\downarrow$. A quantity $A$ of the first spin
acts on the first factor alone. The bracket of two products is the product of the brackets, and $\langle j|j'\rangle$
is one for $j = j'$ and zero otherwise, so

$$\langle A\rangle = \sum_{i,i',j}c_{ij}^*A_{ii'}c_{i'j} = \mathrm{tr}(\varrho_1A), \qquad \varrho_1 = CC^\dagger ,$$

where $C$ is the table of the amplitudes $c_{ij}$. The entries $(\varrho_1)_{i'i} = \sum_jc_{i'j}c_{ij}^*$ are a sum
over the outcomes of the second spin, the **partial trace**, and $\varrho_1$ is the **reduced state** of the first
spin.

A **product state**, $|\hat n\rangle|\hat n'\rangle$, has $c_{ij} = a_ia'_j$, so $C = \vect a\vect a'^{\mathsf T}$ and
$CC^\dagger = \vect a\vect a^\dagger$: the first spin alone is in the pure state $|\hat n\rangle$. The **singlet** is

$$\begin{gathered}\frac{|{\uparrow}\rangle|{\downarrow}\rangle - |{\downarrow}\rangle|{\uparrow}\rangle}{\sqrt2},\\ C = \frac{1}{\sqrt2}\begin{pmatrix}0 & 1\\ -1 & 0\end{pmatrix}, \qquad CC^\dagger = \tfrac12 .\end{gathered}$$

The whole is pure, yet each half has $\mathbf b = 0$. Two things whose pure joint state is not a product are
**entangled**, and a pure state of two is a product exactly when the reduced state is pure, because both say that $C$
has rank one. A spin that leaves a record in a second system becomes a mixture in this way, as in the decoherence of section 8.1 (the stretch problem below).

## A spin $s$ is a symmetric state of $2s$ spins one half

A state of $N$ spins one half is **symmetric** if it is unchanged
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
$|s, m\rangle$, is its **spin component** along $z$.[^m] A spin $s$ has $2s + 1$ components, one for each $m$ from $-s$ to $s$, so its spin is the largest $m$ it can hold. The factor $e^{-im\theta}$ is the one of section 1.5b, whose spin is this $m$ up to its sign.[^turned] Its null vector $\vect m$, turned with its axes, is the component $m = 1$ of a
spin one, and $\vect m\vect m^{\mathsf T}$ is the component $m = 2$ of a spin two, while its arrow and its shear are the
components $m = -1$ and $m = -2$. A spin one has three components, as light's
$\sym{complex-field}{\light{\vect F}} = \light{\vect E} + ic\light{\vect B}$ at a point has (section [6.6](/tutorial/relativity/maxwell-complex/#maxwells-four-equations-are-two-equations-for-one-complex-vector)).

The total spin is $\mathbf S = \tfrac12\sum_a\boldsymbol\sigma^{(a)}$, where $\boldsymbol\sigma^{(a)}$ acts on the
spin numbered $a$. In a symmetric state every spin has the same mean, because exchanging two spins changes nothing, so
$\langle\mathbf S\rangle = \tfrac12N\langle\boldsymbol\sigma^{(1)}\rangle$, and the Bloch vector of any one of them is

$$\boxed{\langle\boldsymbol\sigma^{(1)}\rangle = \frac{\langle\mathbf S\rangle}{s}} ,$$

in units of $\hbar$. With every spin up, $\langle\mathbf S\rangle = s\hat z$ and each spin has $\hat z$, a pure state.

## A reading turns as a spin two

One reading, $\sym{weyl-complex}{\curv{\mathcal W}} = \curv{\tE} + i\curv{\tB}$, is a spin two. It
is the symmetric trace-free table of tide and magnetic part of section 1.5b, in $\mathrm{s^{-2}}$, and it has five
complex components. We treat it as the state of a spin,[^conj] with the bracket

$$\langle\curv{\mathcal W}_1|\curv{\mathcal W}_2\rangle = \mathrm{tr}(\curv{\mathcal W}_1^\dagger\curv{\mathcal W}_2) ,$$

whose squared length is $|\curv{\tE}|^2 + |\curv{\tB}|^2$, with the
[Frobenius norm](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length) of section 1.5. Nothing quantum is assumed; the language of states only organizes five complex numbers.

The table $R = \exp(\theta\,\hat u\cdot L)$ of section 1.7, built from the
[generators](/tutorial/newton/hamilton/#every-quantity-generates-a-motion-and-a-symmetry-gives-a-constant) $\sym{generators}{(L_k)_{ij}} = -\epsilon_{kij}$, turns arrows by $\theta$
about $\hat u$, and it turns the field to $R\curv{\mathcal W}R^{\mathsf T}$. Section 1.5 turned the axes instead, as
$RTR^{\mathsf T}$ with the new axes as the rows of $R$, so 1.5's $R$ is 1.7's $R^{\mathsf T}$. For a small angle $R \approx 1 + \theta\,\hat u\cdot L$ and
$R^{\mathsf T} \approx 1 - \theta\,\hat u\cdot L$, because each $L_k$ is antisymmetric, so $R\curv{\mathcal
W}R^{\mathsf T} \approx \curv{\mathcal W} + \theta\,[\hat u\cdot L, \curv{\mathcal W}]$. Matching this with a quantum
turn, $1 - i\theta\,\hat u\cdot\mathbf S$ for a small angle, gives the spin

$$S_k\curv{\mathcal W} = [iL_k, \curv{\mathcal W}] ,$$

which is Hermitian, because turns keep lengths. **A check.** For a wave along $\hat k$, $\curv{\mathcal W} \propto
\vect m\vect m^{\mathsf T}$, and $(\hat k\cdot L)\vect a = \hat k\times\vect a$ (section 1.7) with $\hat k\times\vect m =
-i\vect m$ (section 1.5b) gives

$$\begin{aligned}[i\hat k\cdot L, \vect m\vect m^{\mathsf T}] &= i(-i\vect m)\vect m^{\mathsf T} + i\vect m(-i\vect m)^{\mathsf T}\\ &= 2\,\vect m\vect m^{\mathsf T} .\end{aligned}$$

So a wave is the component $m = 2$ along its direction of travel, the largest a spin two can hold, for every
polarization, linear included. This is not the wave's helicity (section 9.1). The same steps give $m = 1$, 0, $-1$ and $-2$ for four other tables, and a reading's five complex
components $c_m$ are its parts along these five. A reading turns as a spin two about every axis, and we state without
proof that any five such numbers are a symmetric state of four spins one half.

## A spin $s$ is $2s$ stars on the sky

Ettore Majorana showed in 1932 that every symmetric state of $2s$ spins one half
is, up to a factor, one product $|\hat n_1\rangle\cdots|\hat n_{2s}\rangle$ summed over every order of its factors.
The $2s$ directions are the state's **Majorana stars**. They are found from the state's components $c_m$ as the roots
of the polynomial of degree $2s$ in a complex variable $z$,

$$p(z) = \sum_{m=-s}^{s}(-1)^{s-m}\sqrt{\binom{2s}{s+m}}\;c_m\,z^{s+m} .$$

The
[stereographic map](/tutorial/relativity/maxwell-complex/#light-has-two-special-directions-where-gravity-has-four) of section 6.6,
$\hat n(z) = (2\,\mathrm{Re}\,z,\ 2\,\mathrm{Im}\,z,\ 1 - |z|^2)/(1 + |z|^2)$ carries its $2s$ roots to directions,
and a root missing because the top coefficient vanishes is a star at $-\hat z$. For a spin one half, $p(z) =
c_{1/2}z - c_{-1/2}$, whose root $b/a = \tan\tfrac\vartheta2\,e^{i\varphi}$ the map sends to $\hat n$: the one star is
the Bloch vector.

::: derivation
### Majorana's polynomial is an overlap with the opposite coherent state

We want the binomial factors and signs of $p(z)$, and the fact that its roots are the stars. The spin one half
$|u(z)\rangle = (-z^*, 1)/\sqrt{1 + |z|^2}$ has the bracket $(-z + z)/(1 + |z|^2) = 0$ with $(1, z)/\sqrt{1 + |z|^2}$,
the state up along $\hat n(z)$, since $\tan\tfrac\vartheta2\,e^{i\varphi} = z$ there. So $|u(z)\rangle$ is up along
the opposite direction, $-\hat n(z)$. For one spin $(a, b)$, $\langle u(z)|\psi\rangle = (b - az)/\sqrt{1 + |z|^2}$,
which vanishes at the star $z = b/a$.

**Many spins.** Let every one of $2s$ spins be in $|u(z)\rangle$. The bracket of this product with one arrangement of
$k$ spins up and $2s - k$ down is the product of the single brackets, $(-z)^k/(1 + |z|^2)^s$, the same for every
arrangement. The basis state $|s, m\rangle$, with $k = s + m$, is the sum of $\binom{2s}{k}$ arrangements divided by
$\sqrt{\binom{2s}{k}}$, so its bracket is $\sqrt{\binom{2s}{s+m}}\,(-z)^{s+m}/(1 + |z|^2)^s$. Summing over the
components $c_m$ of a symmetric state, and writing $(-1)^{s+m} = (-1)^{2s}(-1)^{s-m}$,

$$(1 + |z|^2)^s\,\langle u(z)|^{\otimes2s}|\psi\rangle = (-1)^{2s}\sum_m(-1)^{s-m}\sqrt{\binom{2s}{s+m}}\,c_m\,z^{s+m}
= (-1)^{2s}\,p(z) .$$

So Majorana's polynomial is, up to a sign and a positive factor, the amplitude of the state along the product of spins
all pointing away from $\hat n(z)$, and **it vanishes exactly where the state has no part along that product**.

**The factors.** Now let the state be a product of spins $(a_j, b_j)$, $j = 1, \dots, 2s$, summed over every order of
its factors. Every order has the same bracket with the product of $|u(z)\rangle$'s, which is the same in every factor,
so $p(z)$ is a constant times $\prod_j(a_jz - b_j)$, whose roots $b_j/a_j$ are the directions of the factors, and a
factor with $a_j = 0$ is a missing root, a star at $-\hat z$. Conversely, any polynomial of degree $2s$ has $2s$ roots,
counted with their multiplicity and with missing ones at $-\hat z$, so it factors in this way. The symmetrized product
built from those factors has a polynomial in proportion to the state's, and the $2s + 1$ coefficients of $p$ fix the
$c_m$, so the two states are the same up to a factor: every symmetric state is one symmetrized product, as Majorana
found. **A check.** For a spin two the factors are $\sqrt1, \sqrt4, \sqrt6, \sqrt4, \sqrt1$. A state with only $c_0$
has $p = \sqrt6\,c_0z^2$, two stars at the north pole and, from the two missing roots, two at the south pole: the
pattern of the body below.
:::

For a reading, with the null vector $\vect m(z) = (1 - z^2,\ i(1 + z^2),\ -2z)$ of section 6.6, the quartic
$\vect m(z)^{\mathsf T}\curv{\mathcal W}\,\vect m(z)$ is twice Majorana's polynomial, so its coefficients give the
$c_m$ (stated; section 9.4 reads it in full):

$$\vect m(z)^{\mathsf T}\curv{\mathcal W}\,\vect m(z) = 2\,p(z) .$$

So a reading's four stars are its principal null directions, as light's two are those of section 6.6. For a wave along $\hat z$, $\curv{\mathcal W} \propto \vect m\vect m^{\mathsf T}$, and $\vect m(z)^{\mathsf T}\vect m\vect
m^{\mathsf T}\vect m(z) = (\vect m\cdot\vect m(z))^2 = 2z^4$, whose four roots are $z = 0$: the north pole, the
direction of travel. For a body on the $z$ axis, $\curv{\mathcal W} \propto \mathrm{diag}(1, 1, -2)$ gives $(1 -
z^2)^2 - (1 + z^2)^2 - 8z^2 = -12z^2$: two stars at the north pole, and two missing roots, which are stars at the
south pole (Figure [](#fig:majorana-three)).

A **spin coherent state** $|\hat n\rangle_s = |\hat n\rangle\cdots|\hat n\rangle$ has all $2s$ spins up along $\hat n$,
so all its stars sit there. Like the [coherent state](/tutorial/quantum/quanta/#a-classical-oscillation-is-a-state-of-many-quanta-in-step) of an oscillator in section 8.3, it is the state closest to a classical arrow. The bracket of two products is the product of the brackets, so by the
overlap of a spin one half

$$\boxed{|\langle\hat n_1|\hat n_2\rangle_s|^2 = \cos^{4s}\frac{\vartheta_{12}}{2}} .$$

For a spin two 60° apart it is $\cos^830° = 0.32$, against 0.75 for a spin one half: larger spins point more sharply. We state that the coherent states of all directions are **complete**,

$$\frac{2s + 1}{4\pi}\int|\hat n\rangle_s\langle\hat n|_s\;\dd\Omega = 1 ,$$

with the solid angle $\dd\Omega$ of section 2.2, so $(2s + 1)/4\pi$ times $|{}_s\langle\hat n|\psi\rangle|^2$ is a
probability density over the sky, which section 8.6 uses to measure a direction.

![Look first at the arrows, the Bloch vector $\mathbf b = \mathbf P/u$: one spin of a reading is pure for a wave,
unpolarized for a body at rest, and in between for a body and a wave together. Each dot is one of the reading's four
spins one half, a star of Majorana and a principal null direction.](tut-majorana-three){#fig:majorana-three}

## One of the four spins of a reading points along its super-Poynting vector

The Bloch vector of one of a reading's four spins[^onespin] follows from the
[rule for one spin of a symmetric state](#a-spin-s-is-a-symmetric-state-of-2s-spins-one-half) with $s = 2$: it is
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

The **super-Poynting vector** $\mathbf P$ has the components
$\sym{super-poynting}{P_k} = \epsilon_{kij}(\curv{\tE}\curv{\tB})_{ij}$, and the **super-energy** is
$\sym{super-energy}{u} = \tfrac12(|\curv{\tE}|^2 + |\curv{\tB}|^2)$, both in $\mathrm{s^{-4}}$. The mean spin is
$\langle\mathbf S\rangle = 2\mathbf P/u$, so one spin has the Bloch vector $\mathbf b =
\mathbf P/u$, a pure number, and the
[density matrix](#a-mixture-is-described-by-a-density-matrix-and-its-arrow-is-shorter)

$$\boxed{\varrho_1 = \tfrac12\Bigl(1 + \frac{\mathbf P\cdot\boldsymbol\sigma}{u}\Bigr)} ,$$

The names come from light: the same steps for light's $\light{\vect F}$ give a mean spin equal to its Poynting vector
divided by $c$ and by its energy density, by the [products](/tutorial/relativity/maxwell-complex/#the-energy-of-the-field-and-its-flow-are-two-products-of-the-complex-field) of section 6.6.
Since no Bloch vector is longer than one, $|\mathbf P| \le u$ for every reading.

**One wave.** By the check of the [last section but one](#a-reading-turns-as-a-spin-two), $\langle\mathbf S\rangle =
2\hat k$, so $\mathbf b = \hat k$ and $|\mathbf P| = u$: one spin is pure, the four are a coherent state and not
entangled, and the stars coincide on the direction of travel.

**One body at rest.** Then $\curv{\tB} = 0$, so $\mathbf P = 0$ and each spin is unpolarized. The four together are
pure while one of them is mixed, so they are entangled, and their stars sit in two pairs. More generally $\mathbf P$ is built from $[\curv{\tE}, \curv{\tB}]$, which is zero when the
two tables share their axes, as they do in the
[rest frame](/tutorial/evening/one-pixel/#the-ten-numbers-regroup-into-four-invariants-three-angles-and-a-velocity) of the field (section 0.4). So one spin is unpolarized in the field's own rest frame.

**In between.** Take a body and a wave running along the line to it, a field of Petrov type II. Let the body, of
mass $\matter M$, lie a distance $r$ away on the $z$ axis, so that $\curv{\mathcal W}_{\rm
body} = \curv w\,\mathrm{diag}(1, 1, -2)$ with $\curv w = G\matter M/r^3$ in $\mathrm{s^{-2}}$. Let the wave travel
along $+\hat z$ with the tide $\curv{\tE}_+ = \curv w$, so that $\curv{\tE}_{\rm wave} = \curv w\,\mathrm{diag}(1, -1,
0)$ and $\curv{\tB}_{\rm wave} = \curv w(\hat x\hat y^{\mathsf T} + \hat y\hat x^{\mathsf T})$. The wave alone gives
$\mathbf P = 2\curv w^2\hat z$, and the body adds nothing, because its table is the same along $x$ and $y$. The super-energy is $u = 3\curv w^2$ from the body plus
$2\curv w^2$ from the wave, with no cross term, so $|\mathbf P|/u = 2/5 = 0.4$. Two stars stay on the
wave's direction, and the other two move to 120° from it.

The Petrov types of section 0.4, the patterns of coincident stars, are the four spins' families of entanglement,
as the [section after the two figures](#the-petrov-types-are-the-families-of-entanglement-of-the-four-spins) shows.

::: try {#stars}
The special directions, with gravity's sky above and light's below. Each of gravity's four dots is a Majorana star of
the reading, and touching dots coincide. The buttons choose the sources, the slider sets the speed of the first body, and
the skies can be turned. Predict first: is one spin of a single body's reading still unpolarized when the body moves? Choose *One body*, set the speed to zero, and look at how the four stars are
arranged; then raise the speed and watch what the pairs do. Afterwards, say why a moving body's pairs need not be
opposite, using the field's rest frame.
:::

::: try {#majorana-stars}
A sphere you can turn, carrying the four Majorana stars of a spin two, or with a switch the two of light. Drag the stars
anywhere, or choose a preset reading. The arrow from the centre is one spin's Bloch vector $\mathbf b = \mathbf P/u$;
the bars show the five components $c_m$; and a ring that you place on the sphere reads the overlap of the state with the
coherent state there.

Answer the predictions first; afterwards, place the ring on a star of the wave's reading and
then at the opposite pole, and say why the overlap falls from one to zero.
:::

## The Petrov types are the families of entanglement of the four spins

We want to know which states of the four spins hold the same kind of entanglement. Two states of several spins are
**equivalent under SLOCC**, stochastic local operations and classical communication, when each can be made from the
other, with a probability above zero, by acting on each spin separately and comparing notes (Dür, Vidal and Cirac,
2000).[^slocc] On one spin one half such an operation is any invertible table $A$ of two rows: a turn always succeeds, and any
other $A$ is one outcome of a measurement on that spin, which succeeds only sometimes. For symmetric states we take the
same $A$ on every spin, which keeps a symmetric state symmetric; that nothing is lost by this choice was proved by
Mathonet and colleagues (2010), and we state it.

**A Möbius map of the stars.** The table $A = \begin{pmatrix}\alpha & \beta\\ \gamma & \delta\end{pmatrix}$ turns a
spin $(a, b)$ into $(\alpha a + \beta b,\ \gamma a + \delta b)$, so it moves the star $z = b/a$ to

$$z' = \frac{\gamma + \delta z}{\alpha + \beta z} ,$$

a **Möbius map**, a ratio of two linear functions of $z$. On a symmetrized product (the box on Majorana's polynomial)
the same $A$ on every spin moves every star by this one map. The map has an inverse, the map of $A^{-1}$, so it carries
distinct points to distinct points and coincident ones to coincident ones: **the pattern of coincident stars is kept**.
Conversely, a Möbius map carries any three distinct points $z_1$, $z_2$, $z_3$ to 0, $\infty$ and 1, namely

$$z' = \frac{(z - z_1)(z_3 - z_2)}{(z - z_2)(z_3 - z_1)} ,$$

whose table has the determinant $(z_3 - z_2)(z_3 - z_1)(z_1 - z_2) \ne 0$. So two states whose stars fall in the same
pattern with at most three distinct points can be carried into each other and form one class. Four distinct stars keep
one number, their **cross-ratio**

$$\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)} .$$

Each difference becomes $z'_i - z'_j = (\alpha\delta - \beta\gamma)(z_i - z_j)/(\alpha + \beta z_i)(\alpha + \beta
z_j)$, and in the cross-ratio every factor $\alpha + \beta z_i$, and the determinant, appear as often above as below
and cancel. So states with four distinct stars form a family of classes labelled by one complex number.

**The five patterns.** The Petrov types are these patterns of the four stars, and each holds a state well known in
quantum information. In the basis $|2, m\rangle$, a state with only the component $m$ has $p \propto z^{2+m}$, so
$2 + m$ stars at the north pole and the rest at the south pole.

- **Type N**, all four together: $|2, 2\rangle = |{\uparrow}{\uparrow}{\uparrow}{\uparrow}\rangle$, a product, with no
  entanglement; one wave.
- **Type III**, three together and one apart: $|2, 1\rangle$, the **W state**, the symmetric sum with one spin down.
- **Type D**, two pairs: $|2, 0\rangle$, the symmetric sum with two spins down; one body at rest.
- **Type II**, a pair and two single stars: the body with a wave along its line, of the last section.
- **Type I**, four distinct stars: a family that includes the **GHZ state** $(|{\uparrow}{\uparrow}{\uparrow}{\uparrow}\rangle
  + |{\downarrow}{\downarrow}{\downarrow}{\downarrow}\rangle)/\sqrt2$, whose polynomial is in proportion to $z^4 + 1$,
  with its stars at the corners of a square on the equator.

So **under SLOCC the Petrov types N, III, D and II are one class each, and type I is a family with one complex
number**. Bastin and colleagues (2009) sorted the symmetric states of any number of spins in this way, and Bengtsson
and Życzkowski, and Kam, draw the families for spin two [@BengtssonZyczkowski2017; @Kam2026]. **A number.** The GHZ
state's stars $e^{i\pi/4}$, $e^{3i\pi/4}$, $e^{5i\pi/4}$ and $e^{7i\pi/4}$ have the cross-ratio $(2e^{i\pi/4})(2e^{3i\pi/4})/(i\sqrt2)^2 =
(-4)/(-2) = 2$. **What it means.** Section [9.4](/tutorial/one-point/petrov/#moving-the-pixel-moves-the-four-directions-as-rays-of-light)
finds that turns and boosts move the four directions by Möbius maps too, so a change of observer acts on the four
spins as one invertible table on each: the Petrov type, which no observer changes, is a family of entanglement.

## Two spins two combine into spins from zero to four

We want the spins held by a pair of spins two, because a pixel's averages over its sky are built from products of a
reading's components with their conjugates. A pair has $5\times5 = 25$ states $|2, m_1\rangle|2, m_2\rangle$, and a turn
by $\theta$ about $z$ multiplies each by $e^{-im_1\theta}e^{-im_2\theta} = e^{-iM\theta}$, with the **total component**
$M = m_1 + m_2$ from $-4$ to 4. Counting the pairs for each $M$ gives

| $M$ | $\pm4$ | $\pm3$ | $\pm2$ | $\pm1$ | 0 |
|---|---|---|---|---|---|
| pairs $(m_1, m_2)$ | 1 | 2 | 3 | 4 | 5 |

We state one fact: any set of states that every turn carries into itself splits into spins, and a spin $j$ gives one
state to each $M$ from $-j$ to $j$, its $2j + 1$ components. The largest $M$, 4, occurs once, so the pair holds exactly
one spin 4, which takes one state from each $M$ from $-4$ to 4. What is left has 1, 2, 3 and 4 states at $|M| = 3$, 2,
1 and 0, so its largest $M$ is 3, once: one spin 3. Repeating the step,

$$\boxed{2\otimes2 = 0\oplus1\oplus2\oplus3\oplus4}, \qquad 1 + 3 + 5 + 7 + 9 = 25 .$$

**A check.** The same count for two spins one half gives $M = 1$ once, 0 twice and $-1$ once: one spin 1 and one spin 0,
the three symmetric states and the singlet of the [section on many spins](#a-spin-s-is-a-symmetric-state-of-2s-spins-one-half).

**A reading and its conjugate.** A component that turns as $e^{-im\theta}$ has a conjugate that turns as $e^{im\theta}$,
a component $-m$, so the 25 products $c_{m_1}c_{m_2}^*$ have $M = m_1 - m_2$, with the same counts, and split into the
same spins 0 to 4. The spherical harmonics of degree $\ell$ turn among themselves as a spin $\ell$
([section 2.2](/tutorial/outside/spherical-harmonics/#the-addition-theorem-turns-a-sum-over-m-into-one-legendre-polynomial)),
so an average built from these products reaches no harmonic of the sky above degree four. Section
[9.6](/tutorial/one-point/the-sky-at-one-point/#the-pixel-sees-the-sky-only-up-to-degree-four-68-numbers) finds the same
limit from the degree of a polynomial.

**The idea to keep: a spin one half is two complex numbers, which always point somewhere on a sphere, and a spin $s$
is a symmetric state of $2s$ of them, drawn as $2s$ stars. A gravitational reading is a spin two with four stars, and
one of its four spins one half has the Bloch vector $\mathbf P/u$: pure for a single wave, unpolarized
for a single body at rest.**

::: problems
### Practice

**[8.4]** What is $|\langle\hat n_1|\hat n_2\rangle|^2$ for two directions at right angles, for a spin one half and for the
coherent states of a spin two?

::: solution
$\cos^245° = \tfrac12$ for a spin one half, and $\cos^845° = \tfrac1{16}$ for a spin two.
:::

**[8.4]** Why is one of the four spins of a single body's reading unpolarized, and is it still unpolarized when the body
moves?

::: solution
At rest $\curv{\tB} = 0$, so $\mathbf P = 0$ and $\varrho_1 = \tfrac12$. When the
body moves, a pixel that it passes is not in the field's rest frame, so $\curv{\tB} \ne 0$ with axes unlike
$\curv{\tE}$'s, and $\mathbf P \ne 0$. The stars stay in two pairs, no longer opposite, and one spin's Bloch
vector points midway between the pairs.
:::

**[8.4]** Find the Bloch vector of the state $(\cos\tfrac\pi8,\ e^{i\pi/4}\sin\tfrac\pi8)$ and check its length.

::: solution
It is $|\hat n\rangle$ with $\vartheta = \pi/4$ and $\varphi = \pi/4$, so $\mathbf b = (\sin\tfrac\pi4\cos\tfrac\pi4,\
\sin\tfrac\pi4\sin\tfrac\pi4,\ \cos\tfrac\pi4) = (\tfrac12, \tfrac12, \tfrac1{\sqrt2})$. Its squared length is
$\tfrac14 + \tfrac14 + \tfrac12 = 1$: a pure state.
:::

**[8.4]** Can any invertible table acting alike on each of four spins turn the W state $|2, 1\rangle$ into the state
$|2, 0\rangle$ of a body at rest?

::: solution
No. The W state's stars are three at the north pole and one at the south, the body's two and two. A Möbius map keeps
coincident stars together and distinct ones apart, so it cannot turn a pattern of three and one into two pairs.
:::

**[8.4]** Count the spins in $1\otimes1$, the products of light's $\light{\vect F}$ with its conjugate at one point,
and say up to which degree of the sky such averages reach.

::: solution
$M$ runs from $-2$ to 2 with the counts 1, 2, 3, 2, 1, so $1\otimes1 = 0\oplus1\oplus2$, with $1 + 3 + 5 = 9$ states.
The averages reach the sky only up to degree two.
:::

### Stretch

**[8.4]** Find the Majorana polynomial and the stars of the state $(|2, 2\rangle + |2, -2\rangle)/\sqrt2$ by the
coherent-state overlap, and check that the overlap of this state with $|\hat z\rangle_2$ and with $|-\hat z\rangle_2$ is
not zero, while it vanishes for the coherent state opposite each star.

::: solution
Only $c_2 = c_{-2} = 1/\sqrt2$, with the factors $(-1)^0\sqrt1$ and $(-1)^4\sqrt1$, so $p = (z^4 + 1)/\sqrt2$, whose roots
$e^{i\pi/4}, e^{3i\pi/4}, \dots$ lie on the equator at the azimuths 45°, 135°, 225° and 315°. The overlap with
$|\hat z\rangle_2 = |2, 2\rangle$ is $1/\sqrt2$, and with $|-\hat z\rangle_2 = |2, -2\rangle$ also $1/\sqrt2$. By the box, the
overlap with the coherent state opposite $\hat n(z)$ is $p(z)/(1 + |z|^2)^2$, zero exactly at the four roots.
:::

**[8.4]** A spin one half prepared up along $z$ passes a magnet that leaves a record in a second
system, $|{\uparrow}\rangle|0\rangle \to \cos\alpha\,|{\uparrow}\rangle|0\rangle + \sin\alpha\,|{\downarrow}\rangle|1\rangle$.
Find the first spin's Bloch vector (section 8.1).

::: solution
The table of amplitudes is $C = \mathrm{diag}(\cos\alpha, \sin\alpha)$, so $\varrho_1 = CC^\dagger =
\mathrm{diag}(\cos^2\alpha, \sin^2\alpha)$ and $\mathbf b = (0, 0, \cos^2\alpha - \sin^2\alpha) = (0, 0, \cos2\alpha)$.
The records are orthogonal, so they remove the sideways part $(\sin2\alpha, 0, \cdot)$ that the
unrecorded state $\cos\alpha|{\uparrow}\rangle + \sin\alpha|{\downarrow}\rangle$ would have. At $\alpha = 45°$ the spin is unpolarized.
:::

### The camera

**[8.4]** Derive $\varrho_1 = \tfrac12(1 + \mathbf P\cdot\boldsymbol\sigma/u)$ from $S_k\curv{\mathcal W} = [iL_k,
\curv{\mathcal W}]$, and evaluate $|\mathbf P|/u$ for a plane wave and for two masses at rest.

::: solution
The [box](#one-of-the-four-spins-of-a-reading-points-along-its-super-poynting-vector) gives $\langle\mathbf S\rangle =
2\mathbf P/u$, so the Bloch vector is $\mathbf P/u$. A
plane wave has $\langle\mathbf S\rangle = 2\hat k$, so $|\mathbf P|/u = 1$. Masses at rest have
$\curv{\tB} = 0$ in their frame, so $|\mathbf P|/u = 0$ there, whatever their number.
:::
:::

::: paper
- Section VIII's [*Principal null directions*](/paper/#par:principal-null-directions): the Majorana stars of a spin
  two [@Bruno2019], the four spins one half, and the state [](/paper/#eq:one-spin) of one of them, derived here.
- Section IX's [*Counting or recording*](/paper/#par:counting-or-recording): one graviton excites its five modes in "a
  coherent state of spin two", and clicks with the density $(5/4\pi)\cos^8(\vartheta/2)$, the completeness of this
  chapter's coherent states (section 8.6).
- Section VIII's [*One pixel and many*](/paper/#par:one-pixel-and-many): two pixels' responses to directions
  $\vartheta$ apart are weighted by $\cos^8(\vartheta/2)$, the overlap of two spin-two coherent states.
:::

::: deeper

- Bengtsson and Życzkowski, *Geometry of Quantum States* (2nd ed., 2017), chapters 5 to 7: the Bloch ball, coherent
  states and Majorana's stars.
- Majorana (1932), *Il Nuovo Cimento* 9, 43: the stars' first
  appearance; [@Bruno2019] and [@Kam2026] draw them for spin-two fields.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII,
    [*Principal null directions*](/paper/#par:principal-null-directions), which also gives the Majorana stars of a spin two.

[^onespin]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:one-spin); the state is pure for one plane wave, where the four spins are not entangled, and
    unpolarized in the field's own rest frame.

[^slocc]: W. Dür, G. Vidal and J. I. Cirac, *Physical Review A* 62, 062314 (2000); T. Bastin and colleagues,
    *Physical Review Letters* 103, 070503 (2009); P. Mathonet and colleagues, *Physical Review A* 81, 052315 (2010).

[^varrho]: The density matrix is written with a curly rho, since $\rho$ is kept for a density of mass.

[^m]: This $m$ is not a mass, and not the null vector $\vect m$, which is always bold.

[^turned]: Section 1.5b turned the axes, and here the state itself is turned. Turning the axes by $\theta$ multiplies
    the component $m$ by $e^{+im\theta}$, so 1.5b's arrow and shear, multiplied by
    $e^{-i\theta}$ and $e^{-2i\theta}$ when the axes turn, are the components $m = -1$ and $-2$.

[^conj]: Taking $\curv{\mathcal W}$ itself as the state, not its conjugate, fixes the signs below: with
    $\curv{\mathcal W}^*$ the Bloch vector would be $-\mathbf P/u$. By
    this choice a graviton arriving from $\hat n$ is in the coherent state at $\hat k = -\hat n$.

[^b]: Bold $\mathbf b$, b for Bloch, is not the second amplitude $b$ of a state $(a, b)$, which is never bold,
    or the kick $b$ of section 8.2.
