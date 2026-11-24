---
id: '9.2'
title: 'Complex symmetric matrices: invariants and Jordan forms'
question: 'A tide of Part 1 is a real symmetric table, with real eigenvalues and axes at right angles. The paper''s $\mathcal W = \mathcal E + i\mathcal B$ is symmetric but complex, and its eigenvalues, "and with them $I = \mathrm{tr}\,\mathcal W^2$, $J = \mathrm{tr}\,\mathcal W^3$", are what no observer can change. What survives of the spectral theorem when a symmetric table is complex?'
part: '9'
requires: ['1.1', '1.4', '1.5', '1.5b', '6.6', '9.1']
paper: [sec:one-pixel, eq:W, eq:invariants, eq:polar, eq:pencil, eq:ranging-instant, fig:stars]
figures: []
live: [jordan-explorer]
depth: A
---

The paper's paragraph [*One complex matrix*](/paper/#par:one-complex-matrix), in its Section VIII, joins the tide
$\curv\tE$ and the magnetic part $\curv\tB$ into one table, $\curv{\mathcal W} = \curv\tE + i\curv\tB$, whose
eigenvalues, and with them

{{paper eq:invariants}}

"are therefore the same for every observer at that point". A few lines later it warns that "the invariants alone are
not quite enough".

A tide of Part 1 is a real symmetric table, and chapter 3.4 proved that such a table has real eigenvalues and axes at
right angles. The table $\curv{\mathcal W}$ is symmetric but complex. What survives of the spectral theorem when a
symmetric table is complex? We shall build two pairs of scenes that the invariants cannot tell apart, and the
test that can. We use the complex vectors of chapter
[1.5b](/tutorial/newton/complex-numbers/), the complex rotations of chapter [6.6](/tutorial/relativity/maxwell-complex/)
and the squares of [chapter 9.1](/tutorial/one-point/spin-two/), and we restate what we use of chapter
[3.4](/tutorial/noise/symmetric-matrices/). Several theorems are stated with a source, and each place says so.[^letters]

::: plain
A table of numbers is symmetric when it equals its mirror image across the diagonal. When its numbers are real, it has
three special directions at right angles, along which it only stretches or squeezes, by real amounts.

The paper's reading of one pixel is a symmetric table of complex numbers. The amounts, called eigenvalues, can be
complex. A special direction can be a complex arrow whose square is zero, and such an arrow cannot be scaled so that
its square is one. And some tables have too few special directions to be described by them.

For the paper's tables two complex numbers fix the three eigenvalues, and one combination of them shows when two
eigenvalues are equal. These two numbers cannot tell a wave from empty space, or one mass from a mass with a wave along
its line. What the powers of the table do can, and it sorts every reading into one of six shapes.
:::

## A complex symmetric table keeps orthogonality without conjugates, and loses the rest

Chapter [3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes) proved
the **spectral theorem**: a real symmetric table $T$ with $n$ rows has $n$ real eigenvalues $\lambda_i$ and $n$
eigenvectors $\mathbf u_i$ of length one at right angles, so that $T = \sum_i\lambda_i\mathbf u_i\mathbf u_i^{\mathsf
T}$. We ask which of it needs real numbers.

A **complex symmetric table** has complex entries and $T^{\mathsf T} = T$. Complex vectors have two products (chapter
[1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero)): the **unconjugated
product** $\mathbf u\cdot\mathbf v = \mathbf u^{\mathsf T}\mathbf v$, and the Hermitian product $\mathbf u\cdot\mathbf
v^*$, which gives lengths. A symmetric table moves across the first, $(T\mathbf u)\cdot\mathbf v = \mathbf u^{\mathsf
T}T^{\mathsf T}\mathbf v = \mathbf u\cdot(T\mathbf v)$, but not across the second. Two vectors are **orthogonal in the
unconjugated sense** when $\mathbf u\cdot\mathbf v = 0$. The tables that keep this product are those
with $P^{\mathsf T}P = 1$, the **complex orthogonal tables**; those of determinant 1 are chapter
[6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer)'s complex rotations, the
turns and boosts.

**What survives.** If $T\mathbf u = \lambda\mathbf u$ and $T\mathbf v = \mu\mathbf v$, then

$$\lambda\,\mathbf u\cdot\mathbf v = (T\mathbf u)\cdot\mathbf v = \mathbf u\cdot(T\mathbf v) = \mu\,\mathbf
u\cdot\mathbf v ,$$

so for $\lambda \neq \mu$, $\mathbf u\cdot\mathbf v = 0$: eigenvectors of different eigenvalues are orthogonal in the
unconjugated sense.

**What is lost.** The eigenvalues may be complex: $\bigl(\begin{smallmatrix}1 & i\\ i & 1\end{smallmatrix}\bigr)$ has
the eigenvalues $1 \pm i$. An eigenvector may be a **null eigenvector**, with $\mathbf v\cdot\mathbf v = 0$, which no
factor can scale to $\mathbf v\cdot\mathbf v = 1$. And a table may fail to be **diagonalizable**, that is, to equal
$V\,\mathrm{diag}(\lambda_1, \lambda_2, \lambda_3)\,V^{-1}$ with $V$ invertible. The symmetric table

$$N = \begin{pmatrix}1 & i & 0\\ i & -1 & 0\\ 0 & 0 & 0\end{pmatrix} = 2\,\vect m\vect m^{\mathsf T} ,$$

with $\vect m = (1, i, 0)/\sqrt2$, is twice chapter 1.5b's null vector squared, the reading of a plane wave along
$\hat z$ with $\curv\tE_+ = 1$ and $\curv\tE_\times = 0$ (chapter 9.1). On any vector it gives $N\mathbf v = 2\vect
m\,(\vect m\cdot\mathbf v)$, so $N^2\mathbf v = 4\vect m\,(\vect m\cdot\vect m)(\vect m\cdot\mathbf v) = 0$. Then
$N\mathbf v = \lambda\mathbf v$ gives $0 = N^2\mathbf v = \lambda^2\mathbf v$, and every eigenvalue is zero. A table
equal to $V\,\mathrm{diag}(0, 0, 0)\,V^{-1}$ would be zero, and $N$ is not, so $N$ cannot be diagonalized. Its
eigenvectors, the $\mathbf v$ with $\vect m\cdot\mathbf v = 0$, fill only a plane, and they include the null vector
$\vect m$. A table some power of which is zero is **nilpotent**.

**A non-example.** A Hermitian table, $T^\dagger = T$, keeps the whole theorem, since chapter 3.4's proof works with
$\mathbf x^\dagger$ and $T^\dagger$ for $\mathbf x^{\mathsf T}$ and $T^{\mathsf T}$ and with complex small steps. The
table $N$ is not Hermitian: $N^\dagger$ has $-i$ where $N$ has $i$.

## Two complex numbers fix the eigenvalues of a trace-free three-by-three table

We want the eigenvalues of a reading from numbers that every observer computes alike. They are the roots of the
**characteristic polynomial** $\det(\lambda - \curv{\mathcal W})$, in which $\lambda$ is a complex number in
$\mathrm{s^{-2}}$ and $\lambda - \curv{\mathcal W}$ means $\lambda$ times the identity minus $\curv{\mathcal W}$. We
assume that **$\curv{\mathcal W}$ is trace-free**, as every reading in empty space is (chapter
[1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left)). The eigenvalues add
up to the trace, so this cubic has no $\lambda^2$ term, and its three roots, the paper's eigenvalues
$\sym{weyl-eigenvalue}{\curv w_a}$, give

$$\begin{aligned}
\det(\lambda - \curv{\mathcal W}) &= (\lambda - \curv w_1)(\lambda - \curv w_2)(\lambda - \curv w_3)\\
&= \lambda^3 + e_2\lambda - \curv w_1\curv w_2\curv w_3 ,
\end{aligned}$$

with $e_2 = \curv w_1\curv w_2 + \curv w_2\curv w_3 + \curv w_3\curv w_1$. The eigenvalues of $\curv{\mathcal W}^k$
are the $k$th powers of those of $\curv{\mathcal W}$,[^powers] so the invariants are sums of powers,
$\sym{invariant-i}{I} = \sum_a\curv w_a^2$ and $\sym{invariant-j}{J} = \sum_a\curv w_a^3$. **Newton's identities** turn
them into the coefficients. Squaring the sum of the eigenvalues gives $0 = I + 2e_2$, so $e_2 = -\tfrac12I$. Each
eigenvalue is a root, $\curv w_a^3 - \tfrac12I\curv w_a - \curv w_1\curv w_2\curv w_3 = 0$, and adding the three
equations gives $J - 3\,\curv w_1\curv w_2\curv w_3 = 0$. So

$$\boxed{\;\begin{gathered}\det(\lambda - \curv{\mathcal W}) = \lambda^3 - \tfrac12I\lambda - \tfrac13J,\\
\det\curv{\mathcal W} = \tfrac13J .\end{gathered}\;} \label{eq:cubic}$$

With $\curv{\mathcal W}$ in $\mathrm{s^{-2}}$, $I$ is in $\mathrm{s^{-4}}$ and $J$ in $\mathrm{s^{-6}}$, so every
term is in $\mathrm{s^{-6}}$. An observer turned or moving reads $P\curv{\mathcal W}P^{\mathsf T}$ with $P$ a complex
rotation (chapter 9.3 derives the rule), and since $P^{\mathsf T} = P^{-1}$, $\det\bigl(P(\lambda - \curv{\mathcal
W})P^{-1}\bigr) = \det(\lambda - \curv{\mathcal W})$. The cubic, and with it $I$ and $J$, is the same for every
observer: each is an **invariant**, in chapter 6.6's sense. Both are complex, so together they hold four real
numbers, the paper's "four numbers no observer can change".

**A number.** One mass $\matter M$ at the distance $r$ has, in the paper's axes, $\curv{\mathcal W} = (G\matter
M/r^3)\,\mathrm{diag}(1, 1, -2)$, so $I = 6(G\matter M/r^3)^2$, $J = -6(G\matter M/r^3)^3$ and $\det\curv{\mathcal W} =
-2(G\matter M/r^3)^3$, the paper's value in [*Separating waves at one
point*](/paper/#par:separating-waves-at-one-point). In units of $G\matter M/r^3$ the cubic is $\lambda^3 - 3\lambda + 2
= (\lambda - 1)^2(\lambda + 2)$. For the person of 70 kg a metre away, $G\matter M/r^3 =
4.67\times10^{-9}\unit{s^{-2}}$, $I = 1.31\times10^{-16}\unit{s^{-4}}$ and $J =
-6.12\times10^{-25}\unit{s^{-6}}$, small because the tide is small.

## One combination of the two numbers marks a repeated eigenvalue

We want a test for two equal eigenvalues, the mark of a single round body (chapter 1.5), without solving the cubic
$f(\lambda) = \lambda^3 - \tfrac12I\lambda - \tfrac13J$. A polynomial has a repeated root $\lambda_0$ exactly when
$f(\lambda_0) = 0$ and $f'(\lambda_0) = 0$: if $f = (\lambda - \lambda_0)g$, then $f'(\lambda_0) = g(\lambda_0)$. The
derivative vanishes where $3\lambda_0^2 = \tfrac12I$, so $\lambda_0^2 = I/6$ and $\lambda_0^3 = \lambda_0I/6$. Then

$$\begin{aligned}f(\lambda_0) &= \tfrac16I\lambda_0 - \tfrac12I\lambda_0 - \tfrac13J\\ &= -\tfrac13\bigl(I\lambda_0 + J\bigr) = 0
.\end{aligned}$$

If $I \neq 0$, $\lambda_0 = -J/I$, and its square must be $I/6$, so $J^2/I^2 = I/6$. Conversely, if $I^3 = 6J^2$, the
number $-J/I$ meets both conditions. So, for $I \neq 0$, an eigenvalue repeats exactly when

$$\boxed{\;1 - \frac{6J^2}{I^3} = 0, \qquad \curv w = -\frac JI ,\;} \label{eq:repeated}$$

and $\curv w$ is then the repeated eigenvalue.

If $I = 0$, then $\lambda_0 = 0$, which needs $J = 0$ too, and all three eigenvalues are zero; if $I = 0$ and $J \neq
0$, they are the three different cube roots of $J/3$.

The number $1 - 6J^2/I^3$ is pure ($I^3$ and $J^2$ are both in $\mathrm{s^{-12}}$), so it measures the shape of the
eigenvalues, not their size. It is $2/I^3$ times the cubic's **discriminant**, the product $(\curv w_1 - \curv
w_2)^2(\curv w_2 - \curv w_3)^2(\curv w_3 - \curv w_1)^2$, which equals $\tfrac12I^3 - 3J^2$ (stated, and checked in the
margin).[^disc] For a scene at rest the eigenvalues are real, so the number lies between 0, for a repeated eigenvalue,
and 1, for eigenvalues in the proportion $1 : 0 : -1$.

**Checks.** One mass gives $1 - 6\cdot36/216 = 0$ and $\curv w = +G\matter M/r^3$, the eigenvalue of the two squeezes
across the line: the paper's "positive for a single body". A single wave has $\curv{\mathcal W}^2 = 0$ (chapter 9.1),
so $I = J = 0$, the test cannot be applied, and all its eigenvalues are zero. **A number.** The paper's Figure
[](/paper/#fig:stars) has two masses in the ratio $1 : 0.45$, at $(-1.5, 0.3, 0)$ and $(0.9, 1.1, 0.6)$ in the
figure's units, from the pixel. They give the eigenvalues $-0.537$, $0.135$ and $0.402$ in the figure's
units, $I = 0.468$ and $J = -0.0874$, so $1 - 6J^2/I^3 = 0.553$: the paper's 0.55 (Figure
[](#fig:cx-eigen-plane)).

![Look first at the bottom strip: only a scene in which something moves or turns puts the eigenvalues off the real
axis. Two equal eigenvalues, as for one mass, make $1 - 6J^2/I^3$ vanish. Points computed; the spin is
exaggerated.](tut-cx-eigen-plane){#fig:cx-eigen-plane}

## Six shapes, told apart by what the table's powers do

We want to know what the two invariants miss. A polynomial of a table, such as $(\curv{\mathcal W} - \curv
w)(\curv{\mathcal W} + 2\curv w)$, is built from powers of the table, with each number standing for that number times
the identity.

**A test for a diagonal form.** Suppose a reading with the eigenvalues $\curv w$, $\curv w$ and $-2\curv w$ were
diagonalizable, $\curv{\mathcal W} = V\,\mathrm{diag}(\curv w, \curv w, -2\curv w)\,V^{-1}$. Then $\curv{\mathcal W} -
\curv w = V\,\mathrm{diag}(0, 0, -3\curv w)\,V^{-1}$ and $\curv{\mathcal W} + 2\curv w = V\,\mathrm{diag}(3\curv w,
3\curv w, 0)\,V^{-1}$, and their product is $V\,\mathrm{diag}(0, 0, 0)\,V^{-1} = 0$. So

$$\boxed{\;\begin{gathered}(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) \neq 0\\ \Longrightarrow\;
\curv{\mathcal W} \text{ is not diagonalizable.}\end{gathered}\;} \label{eq:test}$$

The converse also holds (stated; Axler, result 5.62): a table is diagonalizable exactly when some product of factors
$\curv{\mathcal W} - \lambda$, with different numbers $\lambda$, is zero. The vanishing product of lowest degree is the
table's **minimal polynomial**. For one mass it is $(\lambda - \curv w)(\lambda + 2\curv w)$, and not $\lambda - \curv
w$ alone, because $\curv{\mathcal W} = \curv w$ times the identity would have the trace $3\curv w \neq 0$.

Every square table satisfies its own characteristic polynomial, the **Cayley–Hamilton theorem**
(stated), so by [](#eq:cubic) every reading obeys

$$\curv{\mathcal W}^3 - \tfrac12I\,\curv{\mathcal W} - \tfrac13J = 0 . \label{eq:cayley}$$

For a trace-free complex symmetric $3\times3$ table this leaves six shapes, each labelled here with the Petrov letter
that chapter 9.4 explains:

- **Three different eigenvalues** (I): the table is diagonalizable. Example: the two masses of the paper's Figure
  [](/paper/#fig:stars).
- **A repeated eigenvalue $\curv w \neq 0$, diagonalizable** (D): $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} +
  2\curv w) = 0$. Example: one mass along $\hat n$, $\curv{\mathcal W} = \curv w(1 - 3\hat n\hat n^{\mathsf T})$, whose
  two factors $-3\curv w\,\hat n\hat n^{\mathsf T}$ and $3\curv w(1 - \hat n\hat n^{\mathsf T})$ multiply to zero
  because $\hat n\cdot\hat n = 1$.
- **A repeated eigenvalue, not diagonalizable** (II): that product is not zero, and [](#eq:cayley) reads $(\curv{\mathcal W} -
  \curv w)^2(\curv{\mathcal W} + 2\curv w) = 0$. Example: a mass with a weak wave
  along the line to it, below.
- **All eigenvalues zero and $\curv{\mathcal W}^2 \neq 0$** (III): with $I = J = 0$, [](#eq:cayley) gives
  $\curv{\mathcal W}^3 = 0$. Example: the paper's table, below.
- **$\curv{\mathcal W} \neq 0$ and $\curv{\mathcal W}^2 = 0$** (N): one plane wave, of rank one, like $N$ above.
- **$\curv{\mathcal W} = 0$** (O): no field.

The list is complete: either the eigenvalues all differ, or two coincide and are not zero, or, because the trace is
zero, all three are zero, and then $\curv{\mathcal W}^3 = 0$ leaves three cases for the lowest power that vanishes. A
real symmetric table, the reading of a scene at rest, always has the shape I, D or O, because chapter 3.4 diagonalizes
it.

**A mass with a wave along its line.** We put the mass on the $z$ axis, with $\curv w = G\matter M/r^3$, and add a weak
wave travelling along $\hat z$, with chapter 9.1's component $\curv c_2$ of weight 2 about $\hat z$, in
$\mathrm{s^{-2}}$:

$$\curv{\mathcal W} = \curv w(1 - 3\hat z\hat z^{\mathsf T}) + \curv c_2\,\vect m\vect m^{\mathsf T},$$

with the same $\vect m$ as $N$. Because $\vect m\cdot\hat z = \vect m\cdot\vect m = 0$, the wave's term adds nothing
to the traces: $\curv{\mathcal W}^2 = \curv w^2(1 - 3\hat z\hat z^{\mathsf T})^2 + 2\curv w\curv c_2\,\vect m\vect
m^{\mathsf T}$ has the trace $6\curv w^2$, and $J = -6\curv w^3$ in the same way, so the eigenvalues stay $\curv w$,
$\curv w$ and $-2\curv w$. But the two factors of the mass's test each gain $\curv c_2\,\vect m\vect m^{\mathsf T}$,
and of the four products only the one of that term with $3\curv w(1 - \hat z\hat z^{\mathsf T})$ survives:

$$(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) = 3\curv w\curv c_2\,\vect m\vect m^{\mathsf T} \neq 0
.$$

With $\curv w = 0.125$ and $\curv c_2 = 0.05$, in any unit of tide, the product has entries of size $0.0094$. By
[](#eq:test) the weak wave leaves the eigenvalues where they were and makes the table impossible to diagonalize.

**The paper's type III table**, with rows $(0, 0, 1)$, $(0, 0, i)$, $(1, i, 0)$, has $\curv{\mathcal W}^2 = 2\vect
m\vect m^{\mathsf T}$ and $\curv{\mathcal W}\vect m = 0$, so $\curv{\mathcal W}^3 = 2(\curv{\mathcal W}\vect m)\vect
m^{\mathsf T} = 0$. Both traces vanish, as for a wave, but the rank is two. The
table is $\sqrt2$ times chapter 9.1's table of spin weight one about $\hat z$, $\vect m\hat z^{\mathsf
T} + \hat z\vect m^{\mathsf T}$.

**What the two numbers cannot tell.** Two pairs of scenes show why the invariants are "not quite enough". In the
first, a plane wave along $\hat z$, $\curv{\mathcal W} = N$, stands beside empty space: both have $I = J = 0$ and three
zero eigenvalues. In the second, one mass alone (type D) stands beside the same mass with the weak wave along its line
(type II): both have $I = 6\curv w^2$, $J = -6\curv w^3$ and the eigenvalues $\curv w$, $\curv w$, $-2\curv w$. Only
the table's powers tell each pair apart (Figure [](#fig:cx-shape-tree)). The wave has $N \neq 0$, and
$\curv{\mathcal W}^2 = 0$ marks it as one wave,
since the type III table also has both invariants zero. The product $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} +
2\curv w)$ is zero for the mass alone and $3\curv w\curv c_2\,\vect m\vect m^{\mathsf T}$ with the wave.

**The Jordan form**, stated without proof, is the general picture: in suitable axes every square table is a row of
**Jordan blocks** down the diagonal, each with one eigenvalue on its diagonal and 1 on the line above it (Figure
[](#fig:cx-jordan-block)). The six shapes have blocks of sizes $1, 1, 1$ (I, D, O), $2, 1$ (II, N) and $3$ (III),
and a change of observer, $P\curv{\mathcal
W}P^{-1}$, keeps the blocks, so no observer can change the shape of a reading. Gantmacher proved, and we state, that
every Jordan form belongs to some complex symmetric table, and that two with the same Jordan form are carried into each
other by a complex orthogonal table. So the eigenvalues and the shape are all that a change of axes or of velocity
leaves fixed.

![Look first at the first two questions: the invariants alone send a reading to three places, and only the powers
of the table finish the sorting. Each shape has an example and, under it, its minimal polynomial. The Petrov letters
are explained in chapter 9.4.](tut-cx-shape-tree){#fig:cx-shape-tree}

![Look first at the 1 above the diagonal: it joins two equal eigenvalues into one block with a single eigenvector, so
the table cannot be diagonalized. Both tables have the same eigenvalues and the same $I$ and
$J$.](tut-cx-jordan-block){#fig:cx-jordan-block}

## Every complex rotation is a boost followed by a turn

**Diagonalizing a reading.** Let $\curv{\mathcal W}$ have three different eigenvalues, with eigenvectors $\mathbf
v_a$. They are independent, and orthogonal in the unconjugated sense. None is null: a null $\mathbf v_1$ would be
orthogonal in that sense to all three, hence to every vector, and would be zero. Dividing each by a square root of
$\mathbf v_a\cdot\mathbf v_a$ gives the columns of a table $P$ with $P^{\mathsf T}P = 1$ and $\curv{\mathcal W}P =
P\,\mathrm{diag}(\curv w_a)$. Multiplying on the right by $P^{\mathsf T}$ gives

$$\curv{\mathcal W} = P\,\mathrm{diag}(\curv w_1, \curv w_2, \curv w_3)\,P^{\mathsf T} ,$$

and changing the sign of one column, if $\det P = -1$, makes $P$ a complex rotation. Chapter
[6.6](/tutorial/relativity/maxwell-complex/#two-boosts-make-a-boost-and-a-turn) stated what kind of table $P$ is,
and we now prove it. We assume that **$P$ is complex orthogonal**, $P^{\mathsf T}P = 1$, and write $P^*$ for its
conjugate, so that $P^\dagger = P^{*\mathsf T}$.

**Step 1: $P^\dagger P$ is Hermitian and positive.** It is its own conjugate transpose, and $\mathbf x^\dagger
P^\dagger P\mathbf x = |P\mathbf x|^2 > 0$ for $\mathbf x \neq 0$, since $P$ has the inverse $P^{\mathsf T}$. By the
Hermitian form of chapter 3.4's theorem its eigenvalues are positive, so it is $e^X$ for exactly one Hermitian $X$,
with the same eigenvectors and the logarithms of the eigenvalues.[^log]

**Step 2: $P^\dagger P$ is complex orthogonal.** From $P^{\mathsf T} = P^{-1}$ also $PP^{\mathsf T} = 1$, whose
conjugate is $P^*P^\dagger = 1$, so

$$(P^\dagger P)^{\mathsf T}(P^\dagger P) = P^{\mathsf T}(P^*P^\dagger)P = 1 .$$

**Step 3: its logarithm is imaginary and antisymmetric.** The conjugate of $P^\dagger P$ is its transpose (step 1),
which is its inverse (step 2): $e^{X^*} = e^{-X}$. Both $X^*$ and $-X$ are Hermitian, and the Hermitian logarithm
is unique, so $X^* = -X$, and $X = iY$ with $Y$ real. Then $X^\dagger = X$ reads $-iY^{\mathsf T} = iY$, so $Y$ is
antisymmetric. We write $Y = 2K_0$, with $\sym{polar-boost}{K_0}$ real, antisymmetric and a pure number.

**Step 4: the rest is a real turn.** Let $\sym{polar-turn}{R_0} = Pe^{-iK_0}$. With $K_0^{\mathsf T} = -K_0$ and
$(e^{-iK_0})^\dagger = e^{-iK_0}$,

$$\begin{aligned}
R_0^{\mathsf T}R_0 &= e^{iK_0}P^{\mathsf T}P\,e^{-iK_0} = 1,\\
R_0^\dagger R_0 &= e^{-iK_0}e^{2iK_0}e^{-iK_0} = 1 .
\end{aligned}$$

So $R_0^{\mathsf T} = R_0^{-1} = R_0^\dagger$, and $R_0^\dagger = R_0^{\mathsf T}$ says that $R_0^* = R_0$: $R_0$ is a
real orthogonal table, with the determinant of $P$ because $\det e^{-iK_0} = e^{-i\,\mathrm{tr}K_0} = 1$. Hence the
**polar decomposition**

$$\boxed{\;\sym{complex-rotation}{P} = R_0\,e^{iK_0}, \qquad e^{2iK_0} = P^\dagger P .\;} \label{eq:polar-split}$$

A real antisymmetric table is a vector in disguise (chapter
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise)), so $K_0 =
-\obs\eta\,\hat u\cdot\mathbf L$ for a unit vector $\hat u$ and $\obs\eta \ge 0$, and $e^{iK_0} = \exp(-i\obs\eta\,\hat
u\cdot\mathbf L)$ is chapter 6.6's boost $\Lambda$ of rapidity $\obs\eta$ along $\hat u$. Every complex rotation is a
boost followed by a turn, both fixed by $P$. A real turn gives $P^\dagger P = 1$ and no boost.

**A check: 6.6's Wigner turn.** For boosts of $0.6c$ along $x$ and then $y$, $P = \Lambda_y\Lambda_x$, and $P^\dagger
P = \Lambda_x\Lambda_y^2\Lambda_x$ because each boost is its own conjugate transpose. Its eigenvalues $7.635$, 1 and
$0.131$ are $e^{2\obs\eta}$, 1 and $e^{-2\obs\eta}$, so $\cosh\obs\eta = 1.5625$, a speed of $0.768c$ along $\hat u =
(0.781, 0.625, 0)$, and $R_0$ is a turn about $z$ by $12.68°$: chapter 6.6's velocity $(0.6, 0.48, 0)\,c$ and its
$12.7°$.

The diagonal form of a reading and the polar decomposition of its $P$ together make the paper's equation

{{paper eq:polar}}

Chapter 9.3 reads its ten numbers: four in the eigenvalues, three angles in $R_0$ and a velocity in $K_0$. A
reading of type D can be treated in the same way (stated); types II, III and N cannot be diagonalized at all.

## Singular values are not the sizes of the eigenvalues

Chapter [3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots) wrote
a real table as $A = U\Sigma V^{\mathsf T}$, its **singular value decomposition**, with the singular values
$\sym{singular-value}{s_i} \ge 0$ the square roots of the eigenvalues of $A^{\mathsf T}A$ and the columns of $U$ and $V$
unit vectors at right angles. The same steps with $\dagger$ for $\mathsf T$ give, for a complex table, $\curv{\mathcal
W} = U\Sigma V^\dagger$, with $\Sigma = \mathrm{diag}(s_1, s_2, s_3)$, $s_1 \ge s_2 \ge s_3$ the square roots of the
eigenvalues of $\curv{\mathcal W}^\dagger\curv{\mathcal W}$, and $U$, $V$ **unitary**, $U^\dagger U = V^\dagger V = 1$.
The columns $\mathbf u_i$ of $U$ and $\mathbf v_i$ of $V$ are the **singular vectors**, with $\curv{\mathcal W}\mathbf
v_i = s_i\mathbf u_i$, so a $\mathbf v_i$ with $s_i = 0$ is sent to zero. The number of nonzero singular values is the
rank. For a symmetric table one can take $V = U^*$,

$$\boxed{\;\curv{\mathcal W} = U\Sigma\,U^{\mathsf T},\;} \label{eq:takagi}$$

the **Takagi decomposition** (the box derives it when the singular values differ).

::: derivation
### The Takagi decomposition when the singular values differ

We need unit vectors $\mathbf u_a$, orthogonal in the Hermitian sense, with $\curv{\mathcal W}\mathbf u_a^* =
s_a\mathbf u_a$, because then $\curv{\mathcal W}U^* = U\Sigma$ and $(U^*)^{-1} = U^{\mathsf T}$. The Hermitian
table $\curv{\mathcal W}\curv{\mathcal W}^\dagger = \curv{\mathcal W}\curv{\mathcal W}^*$ has such eigenvectors
$\mathbf v_a$, with the eigenvalues $s_a^2$. For one with $s > 0$, $\mathbf y = \curv{\mathcal W}\mathbf v^*$ obeys

$$\curv{\mathcal W}\curv{\mathcal W}^*\mathbf y = \curv{\mathcal W}\bigl(\curv{\mathcal W}\curv{\mathcal W}^*\mathbf
v\bigr)^* = s^2\mathbf y ,$$

so, as $s^2$ is not repeated, $\mathbf y = \kappa\mathbf v$ for some number $\kappa$. The conjugate of $\curv{\mathcal
W}\mathbf v^* = \kappa\mathbf v$ is $\curv{\mathcal W}^*\mathbf v = \kappa^*\mathbf v^*$, so $s^2\mathbf v =
\curv{\mathcal W}\curv{\mathcal W}^*\mathbf v = \kappa^*\curv{\mathcal W}\mathbf v^* = |\kappa|^2\mathbf v$. Then
$\kappa = s\,e^{i\varphi}$, and $\mathbf u = e^{i\varphi/2}\mathbf v$ has $\curv{\mathcal W}\mathbf u^* = s\mathbf u$.
For $s = 0$, $|\curv{\mathcal W}^*\mathbf v|^2 = \mathbf v^\dagger\curv{\mathcal W}\curv{\mathcal W}^*\mathbf v = 0$,
so $\mathbf u = \mathbf v$ will do.
:::

A turn is real and orthogonal, hence unitary, and leaves the singular values alone; a boost is not unitary (chapter 6.6
found $\Lambda^\dagger\Lambda = \Lambda^2$), so they change with the observer's speed, while the eigenvalues do not.
For a scene at rest $\curv{\mathcal W}$ is real and symmetric, and its singular values are the sizes of its eigenvalues:
2, 1 and 1 in units of $G\matter M/r^3$ for one mass. A pixel moving at $0.6c$ across the line to that mass reads
$\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$, with $\Lambda$ chapter 6.6's boost.[^boost] It still finds the
eigenvalues $-2$, 1 and 1, but the singular values 6.04, 1 and 0.331. A single wave, $\curv{\mathcal W} = \curv
c_2\,\vect m\vect m^{\mathsf T}$, has $\curv{\mathcal W}^\dagger\curv{\mathcal W} = |\curv c_2|^2\,\vect m^*\vect
m^{\mathsf T}$, whose only nonzero eigenvalue is $|\curv c_2|^2$. So its singular values are $|\curv{\mathcal W}|$, 0
and 0, with $|\curv{\mathcal W}| = \sqrt{\langle\curv{\mathcal W}|\curv{\mathcal W}\rangle} = |\curv c_2|$ chapter
9.1's length of a reading, while every eigenvalue is zero. The type III table has $\sqrt2$, $\sqrt2$ and 0.

This is why the paper's [*Ranging a wave source*](/paper/#par:ranging-a-wave-source) measures how far a reading is from
one plane wave by "the ratio of its second singular value to its first", "not the eigenvalues of $\mathcal W$, which
all vanish for a wave". For one plane wave $s_2/s_1 = 0$; the paper's [](/paper/#eq:ranging-instant) gives its size for
a source at a finite distance (chapter 9.7).

## A pencil of two tables has generalized eigenvalues

Chapter 9.5 separates three waves of one frequency with the algebra of this section. For two square tables $A$ and $B$
(local letters) the **pencil** is the family $A - \lambda B$, and its **generalized eigenvalues**, met in chapter
[3.4](/tutorial/noise/symmetric-matrices/#whitening-turns-shared-noise-into-independent-noise-of-unit-size), are the
roots of $\det(A - \lambda B)$, the $\lambda$ for which some $\mathbf x \neq 0$ has $A\mathbf x = \lambda B\mathbf x$.
Let $A = \sum_a\alpha_a\mathbf m_a\mathbf m_a^{\mathsf T}$ and $B = \sum_a\beta_a\mathbf m_a\mathbf m_a^{\mathsf T}$
be built from the same three squares $\mathbf m_a\mathbf m_a^{\mathsf T}$, with any vectors $\mathbf m_a$, complex
$\alpha_a$, $\beta_a$, and $M$ the table with the $\mathbf m_a$ as columns. For a diagonal $D$, column $a$ of $M$ times
row $a$ of $M^{\mathsf T}$ gives $MDM^{\mathsf T} = \sum_aD_{aa}\mathbf m_a\mathbf m_a^{\mathsf T}$, so $A - \lambda B
= M\,\mathrm{diag}(\alpha_a - \lambda\beta_a)\,M^{\mathsf T}$, and with $\det M^{\mathsf T} = \det M$

$$\boxed{\;\begin{aligned}\det(A - \lambda B) &= \det[\mathbf m_1, \mathbf m_2, \mathbf m_3]^2\\ &\quad\times\prod_{a=1}^3(\alpha_a -
\lambda\beta_a) .\end{aligned}\;} \label{eq:pencil-identity}$$

For independent $\mathbf m_a$ and every $\beta_a \neq 0$ the roots are $\lambda_a = \alpha_a/\beta_a$, and at each
root one square drops out of $A - \lambda B$.[^pencil] Each wave puts the same square into both of the paper's parts
$\curv{\mathcal W}_\pm$, with its helicity amplitudes $\curv\alpha^\pm$ (chapter 9.1), so with $A = \curv{\mathcal
W}_+$, $B = \curv{\mathcal W}_-$, $\alpha_a = \curv\alpha^+_a$ and $\beta_a = \curv\alpha^-_a$ this is the paper's
[](/paper/#eq:pencil).

::: try {#jordan-explorer}
A trace-free complex symmetric table, shown entry by entry, chosen from five readings: one mass, the two masses of the
paper's Figure [](/paper/#fig:stars), one wave, a mass with a wave along its line, and the paper's type III table.
Sliders add a wave along the line, a wave across it and a second mass. On the left, the eigenvalues in the complex
plane, as in Figure [](#fig:cx-eigen-plane); on the right, $I$, $J$, $1 - 6J^2/I^3$, the rank, the singular values,
which of the table's powers vanish, and the shape it reaches in Figure [](#fig:cx-shape-tree).

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, choose
one mass and raise the second mass until it is as heavy as the first, and say why the shape comes back to D.
:::

::: check
### Q

Find $I$, $J$ and $1 - 6J^2/I^3$ for $\curv{\mathcal W} = \mathrm{diag}(1, 2, -3)$, in any unit of tide.

### A

$I = 1 + 4 + 9 = 14$ and $J = 1 + 8 - 27 = -18$, so $1 - 6\cdot324/2744 = 0.29$.

### Q

Why can $\vect m\vect m^{\mathsf T}$ not be diagonalized?

### A

Its square is zero, so all its eigenvalues are zero, and a diagonal form would be zero. But $\vect m\vect m^{\mathsf
T}$ is not zero.

### Q

A reading has $I = J = 0$. What else must be checked before calling it a single wave?

### A

That $\curv{\mathcal W}^2 = 0$. Otherwise it may be the type III shape, with only $\curv{\mathcal W}^3 = 0$.
:::

**The idea to keep: a complex symmetric table keeps orthogonality without conjugates, but its eigenvalues may be
complex, its eigenvectors null, and its axes too few. For a trace-free $3\times3$ table, $I = \mathrm{tr}\,\mathcal W^2$
and $J = \mathrm{tr}\,\mathcal W^3$ fix the eigenvalues and $1 - 6J^2/I^3$ marks a repeated one, but only the table's
powers sort a reading into its six shapes, which chapter 9.4 names Petrov's types.**

::: problems
### Practice

Show that the paper's type III table, with rows $(0, 0, 1)$, $(0, 0, i)$, $(1, i, 0)$, has rank two, compute its square
and its cube, and find the vector it sends to zero.

::: solution
The second row is $i$ times the first, and the third is not a multiple of it: rank two. The square has rows $(1, i,
0)$, $(i, -1, 0)$, $(0, 0, 0)$. A vector sent to zero needs $v_3 = 0$ and $v_1 + iv_2 = 0$, so it is $(1, i, 0)$. Every
column of the square is a multiple of that vector, so the cube is zero.
:::

### Stretch

Combine with chapter 3.4, which diagonalizes every real symmetric table. The table $\mathrm{diag}(a, -a)$, with $a \ge
0$, has the eigenvalues $\pm a$, which coincide at $a = 0$. Give it a small imaginary part, $T =
\bigl(\begin{smallmatrix}a & i\epsilon\\ i\epsilon & -a\end{smallmatrix}\bigr)$ with $\epsilon > 0$ in the same unit.
Find its eigenvalues. For which $a$ can $T$ not be diagonalized, and what happens at $a = 0$?

::: solution
The table has no trace and the determinant $-a^2 - (i\epsilon)^2 = \epsilon^2 - a^2$, so its eigenvalues are
$\pm\sqrt{a^2 - \epsilon^2}$. Where they differ, $T$ is diagonalizable. At $a = 0$, where the real table's
eigenvalues coincide, the imaginary part splits them into $\pm i\epsilon$. Only at $a = \epsilon$ do both vanish, and
there $T = \epsilon\bigl(\begin{smallmatrix}1 & i\\ i & -1\end{smallmatrix}\bigr)$ is $\epsilon$ times the upper-left
corner of $N$, whose square is zero: $T$ is not zero, so it cannot be diagonalized. The axes are lost near a
coincidence, at the gap $2a = 2\epsilon$, not at one. For a larger table $T_0 + i\epsilon S$, with $T_0$ and $S$ real
and symmetric, this happens only where two eigenvalues of $T_0$ lie within about $\epsilon|S_{ab}|$ of each other,
$S_{ab}$ being the entry of $S$ between their eigenvectors.
:::

### The paper

Check [](#eq:pencil-identity), the paper's [](/paper/#eq:pencil) without its physics, and show that at the root
$\lambda_1$ the vector that $A - \lambda_1B$ sends to zero is $\mathbf m_2\times\mathbf m_3$.

::: solution
At $\lambda_1 = \alpha_1/\beta_1$ the first term drops out, so $A - \lambda_1B = \sum_{a=2,3}(\alpha_a -
\lambda_1\beta_a)\mathbf m_a\mathbf m_a^{\mathsf T}$. On $\mathbf m_2\times\mathbf m_3$ each term gives $\mathbf
m_a\,\mathbf m_a\cdot(\mathbf m_2\times\mathbf m_3) = 0$, since a triple product with a repeated vector vanishes.
Chapter 9.5 uses both facts.
:::
:::

::: paper
- Section VIII's [*One complex matrix*](/paper/#par:one-complex-matrix): $I$, $J$ and why every observer finds the same
  eigenvalues.
- Section VIII's [*Principal null directions*](/paper/#par:principal-null-directions): $1 - 6J^2/I^3$, $w = -J/I$,
  types II and III, and the 0.55 of two masses.
- Section VIII's [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity): the paper's
  [](/paper/#eq:polar) and $e^{2iK_0} = P^\dagger P$, proved here.
- Section VIII's [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point): $\det\mathcal W$ of one
  mass and the paper's [](/paper/#eq:pencil).
- Section VIII's [*Ranging a wave source*](/paper/#par:ranging-a-wave-source): singular values and the paper's
  [](/paper/#eq:ranging-instant).
- Section VIII's [*What no reading can tell*](/paper/#par:what-no-reading-can-tell): the type III table.
:::

::: deeper
- F. R. Gantmacher, *The Theory of Matrices*, vol. 2 (Chelsea, 1959), chapter XI: complex symmetric matrices, their
  normal forms, and the polar decomposition of a complex orthogonal matrix.
- R. A. Horn and C. R. Johnson, *Matrix Analysis* (2nd edition, Cambridge, 2013), section 4.4: Takagi's factorization
  in general.
- S. Axler, *Linear Algebra Done Right* (4th edition, Springer, 2024, free online), sections 5B and 5D: the minimal
  polynomial and the test for a diagonal form (result 5.62); chapter 8: the Cayley–Hamilton theorem (8.29) and the
  Jordan form (section 8C).
:::

[^letters]: The letters $I$ and $J$ are the paper's invariants, not Stokes $I$, the current $\mathbf J$ or a moment of
    inertia. The eigenvalues $\curv w_a$ are not chapter 3.9's place $w$. $P$ is a complex rotation, not a power or the
    super-Poynting vector $\mathbf P$.

[^powers]: For a diagonalizable table $\mathcal W^k = VD^kV^{-1}$. For every square table it follows from the fact,
    stated here, that some invertible $V$ makes $V^{-1}\mathcal WV$ triangular, with the eigenvalues on its diagonal.

[^disc]: For $\mathrm{diag}(1, 2, -3)$ the product is $1\cdot25\cdot16 = 400$, and $\tfrac12I^3 - 3J^2 = 1372 - 972 =
    400$; for the two masses below both are 0.0284.

[^log]: A Hermitian $X$ with $e^X = H$ commutes with $H$, so it keeps each eigenspace of $H$. On the one of the
    eigenvalue $h$, $e^X = h$, so $X$ is $\ln h$ there, the real logarithm of a positive number being unique.

[^boost]: We use the rule $\curv{\mathcal W}' = \Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$ now; chapter 9.3 derives
    it. With the mass on $\hat z$ and the motion along $\hat x$, $\Lambda = \exp(-i\obs\eta\,\hat x\cdot\mathbf L)$ with
    $\tanh\obs\eta = 0.6$, so $\obs\eta = \ln 2$.

[^pencil]: For three random null vectors and random complex $\alpha_a$, $\beta_a$, the two sides agree to 15 figures
    at $\lambda = 0.3 + 0.1i$ and $-1.2i$, and at each root $A - \lambda B$ has rank two.
