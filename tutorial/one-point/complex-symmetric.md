---
id: '9.2'
title: 'Complex symmetric matrices: invariants and Jordan forms'
question: 'A tide of Part 1 is a real symmetric table, with real eigenvalues and axes at right angles. The reading $\mathcal W = \mathcal E + i\mathcal B$ of one pixel is symmetric but complex, and its eigenvalues, and with them $I = \mathrm{tr}\,\mathcal W^2$ and $J = \mathrm{tr}\,\mathcal W^3$, are what no observer can change. What survives of the spectral theorem when a symmetric table is complex?'
part: '9'
requires: ['1.1', '1.4', '1.5', '1.5b', '6.6', '9.1']
paper: [sec:one-pixel, eq:W, eq:invariants, eq:polar, eq:pencil, eq:ranging-instant, fig:stars]
figures: []
live: [jordan-explorer]
depth: A
---

The tide $\curv\tE$ and the magnetic part $\curv\tB$ of a pixel join into one table, $\curv{\mathcal W} = \curv\tE +
i\curv\tB$ (section 9.3). Its eigenvalues, and with them $I = \mathrm{tr}\,\curv{\mathcal W}^2$ and $J =
\mathrm{tr}\,\curv{\mathcal W}^3$, are the same for every observer at the point.[^invariants] But the invariants alone
are not quite enough to describe the field.

A tide of Part 1 is a real symmetric table, and section 3.4 proved that such a table has real eigenvalues and axes at
right angles. The table $\curv{\mathcal W}$ is symmetric but complex. What survives of the spectral theorem when a
symmetric table is complex? We build two pairs of scenes that the invariants cannot tell apart, and the test that can. We use the complex vectors of section
[1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero), the complex rotations of
section [6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer) and the squares of
[section 9.1](/tutorial/one-point/spin-two/). Stated theorems carry their source.[^letters]

::: plain
A symmetric table with real numbers has three special directions at right angles, along which it only stretches or
squeezes, by real amounts.

The reading of one pixel is a symmetric table of complex numbers. Its eigenvalues, the stretching amounts, can be
complex; a special direction can be a complex arrow whose square is zero; and some tables have too few special
directions. Two complex numbers fix the three eigenvalues, but they cannot tell a wave from empty space, or one mass from
a mass with a wave along its line. What the powers of the table do can, and it sorts every reading into one of six
shapes.
:::

## A complex symmetric table keeps orthogonality without conjugates, and loses the rest

Section [3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes) proved
the **spectral theorem**: a real symmetric table $T$ with $n$ rows has $n$ real eigenvalues $\lambda_i$ and $n$
eigenvectors $\mathbf u_i$ of length one at right angles, so that $T = \sum_i\lambda_i\mathbf u_i\mathbf u_i^{\mathsf
T}$. We ask which of it needs real numbers.

A **complex symmetric table** has complex entries and $T^{\mathsf T} = T$. Complex vectors have two products (section 1.5b):
the **unconjugated product** $\mathbf u\cdot\mathbf v = \mathbf u^{\mathsf T}\mathbf v$, and the Hermitian product
$\mathbf u\cdot\mathbf v^*$, which gives lengths. A symmetric table moves across the first, $(T\mathbf u)\cdot\mathbf v =
\mathbf u^{\mathsf T}T^{\mathsf T}\mathbf v = \mathbf u\cdot(T\mathbf v)$, but not across the second. Two vectors are
**orthogonal in the unconjugated sense** when $\mathbf u\cdot\mathbf v = 0$. The tables that keep this product are those
with $P^{\mathsf T}P = 1$, the **complex orthogonal tables**; those of determinant 1 are the complex rotations of section
6.6, the turns and boosts.

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

with $\vect m = (1, i, 0)/\sqrt2$, is twice the null vector squared of section 1.5b, the reading of a plane wave along
$\hat z$ with $\curv\tE_+ = 1$ and $\curv\tE_\times = 0$ (section 9.1). On any vector it gives $N\mathbf v = 2\vect
m\,(\vect m\cdot\mathbf v)$, so $N^2\mathbf v = 4\vect m\,(\vect m\cdot\vect m)(\vect m\cdot\mathbf v) = 0$. Then $N\mathbf
v = \lambda\mathbf v$ gives $0 = N^2\mathbf v = \lambda^2\mathbf v$, and every eigenvalue is zero. A table equal to
$V\,\mathrm{diag}(0, 0, 0)\,V^{-1}$ would be zero, and $N$ is not, so $N$ cannot be diagonalized. Its eigenvectors, the
$\mathbf v$ with $\vect m\cdot\mathbf v = 0$, fill only a plane, and they include the null vector $\vect m$. A table some
power of which is zero is **nilpotent**.

## Two complex numbers fix the eigenvalues of a trace-free three-by-three table

We want the eigenvalues of a reading from numbers that every observer computes alike. They are the roots of the
**characteristic polynomial** $\det(\lambda - \curv{\mathcal W})$, in which $\lambda$ is a complex number in
$\mathrm{s^{-2}}$ and $\lambda - \curv{\mathcal W}$ means $\lambda$ times the identity minus $\curv{\mathcal W}$. We
assume that **$\curv{\mathcal W}$ is trace-free**, as every reading in empty space is (section
[1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left)). The eigenvalues add
up to the trace, so this cubic has no $\lambda^2$ term, and its three roots, the eigenvalues
$\sym{weyl-eigenvalue}{\curv w_a}$, give

$$\begin{aligned}
\det(\lambda - \curv{\mathcal W}) &= (\lambda - \curv w_1)(\lambda - \curv w_2)(\lambda - \curv w_3)\\
&= \lambda^3 + e_2\lambda - \curv w_1\curv w_2\curv w_3 ,
\end{aligned}$$

with $e_2 = \curv w_1\curv w_2 + \curv w_2\curv w_3 + \curv w_3\curv w_1$. The eigenvalues of $\curv{\mathcal W}^k$ are
the $k$th powers of those of $\curv{\mathcal W}$,[^powers] so the invariants are sums of powers, $\sym{invariant-i}{I} =
\sum_a\curv w_a^2$ and $\sym{invariant-j}{J} = \sum_a\curv w_a^3$. **Newton's identities** turn them into the
coefficients. Squaring the sum of the eigenvalues gives $0 = I + 2e_2$, so $e_2 = -\tfrac12I$. Each eigenvalue is a
root, $\curv w_a^3 - \tfrac12I\curv w_a - \curv w_1\curv w_2\curv w_3 = 0$, and adding the three equations gives $J - 3\,\curv
w_1\curv w_2\curv w_3 = 0$. So

$$\boxed{\;\begin{gathered}\det(\lambda - \curv{\mathcal W}) = \lambda^3 - \tfrac12I\lambda - \tfrac13J,\\
\det\curv{\mathcal W} = \tfrac13J .\end{gathered}\;} \label{eq:cubic}$$

With $\curv{\mathcal W}$ in $\mathrm{s^{-2}}$, $I$ is in $\mathrm{s^{-4}}$ and $J$ in $\mathrm{s^{-6}}$, so every term is in
$\mathrm{s^{-6}}$. An observer turned or moving reads $P\curv{\mathcal W}P^{\mathsf T}$ with $P$ a complex rotation
(section 9.3 derives the rule), and since $P^{\mathsf T} = P^{-1}$, $\det\bigl(P(\lambda - \curv{\mathcal
W})P^{-1}\bigr) = \det(\lambda - \curv{\mathcal W})$. The cubic, and with it $I$ and $J$, is the same for every observer:
each is an **invariant**, in the sense of section 6.6. Both are complex, so together they hold four real numbers that no
observer can change.

**A number.** One mass $\matter M$ at the distance $r$ has $\curv{\mathcal W} = (G\matter M/r^3)\,\mathrm{diag}(1, 1,
-2)$, so $I = 6(G\matter M/r^3)^2$, $J = -6(G\matter M/r^3)^3$ and $\det\curv{\mathcal W} = -2(G\matter M/r^3)^3$. In units
of $G\matter M/r^3$ the cubic is $\lambda^3 - 3\lambda + 2 = (\lambda - 1)^2(\lambda + 2)$. For the person of 70 kg a
metre away, $G\matter M/r^3 = 4.67\times10^{-9}\unit{s^{-2}}$, $I = 1.31\times10^{-16}\unit{s^{-4}}$ and $J =
-6.12\times10^{-25}\unit{s^{-6}}$.

## One combination of the two numbers marks a repeated eigenvalue

Two equal eigenvalues mark a single round body (section 1.5). To test for them without solving the cubic
$f(\lambda) = \lambda^3 - \tfrac12I\lambda - \tfrac13J$, we use that a polynomial has a repeated root $\lambda_0$ exactly when
$f(\lambda_0) = 0$ and $f'(\lambda_0) = 0$: if $f = (\lambda - \lambda_0)g$, then $f'(\lambda_0) = g(\lambda_0)$. The
derivative vanishes where $3\lambda_0^2 = \tfrac12I$, so $\lambda_0^2 = I/6$ and $\lambda_0^3 = \lambda_0I/6$. Then

$$\begin{aligned}f(\lambda_0) &= \tfrac16I\lambda_0 - \tfrac12I\lambda_0 - \tfrac13J\\ &= -\tfrac13\bigl(I\lambda_0 + J\bigr) = 0
.\end{aligned}$$

If $I \neq 0$, $\lambda_0 = -J/I$, and its square must be $I/6$, so $J^2/I^2 = I/6$. Conversely, if $I^3 = 6J^2$, the
number $-J/I$ meets both conditions. So, for $I \neq 0$, an eigenvalue repeats exactly when

$$\boxed{\;1 - \frac{6J^2}{I^3} = 0, \qquad \curv w = -\frac JI ,\;} \label{eq:repeated}$$

and $\curv w$ is then the repeated eigenvalue. If $I = 0$, then $\lambda_0 = 0$, which needs $J = 0$ too, and all three
eigenvalues are zero; if $I = 0$ and $J \neq 0$, they are the three different cube roots of $J/3$.

The number $1 - 6J^2/I^3$ is pure ($I^3$ and $J^2$ are both in $\mathrm{s^{-12}}$), so it measures the shape of the
eigenvalues, not their size. It is $2/I^3$ times the cubic's **discriminant**, the product $(\curv w_1 - \curv
w_2)^2(\curv w_2 - \curv w_3)^2(\curv w_3 - \curv w_1)^2$, which equals $\tfrac12I^3 - 3J^2$.[^disc] For a scene
at rest the eigenvalues are real, so the number lies between 0, for a repeated eigenvalue, and 1, for eigenvalues in the
proportion $1 : 0 : -1$.

**The discriminant from the coefficients.** We write the cubic as $f(\lambda) = \lambda^3 + p\lambda + q$, with $p =
-\tfrac12I$ and $q = -\tfrac13J$. Differentiating the product $f(\lambda) = \prod_b(\lambda - \curv w_b)$ and setting
$\lambda = \curv w_a$ leaves only the term without the factor $\lambda - \curv w_a$, so $f'(\curv w_a) = \prod_{b \neq
a}(\curv w_a - \curv w_b)$. The product of the three such numbers holds each difference twice, once with each sign, and
there are three pairs, so

$$\prod_a f'(\curv w_a) = -\prod_{a < b}(\curv w_a - \curv w_b)^2 .$$

Now we compute the left side from $p$ and $q$. Each eigenvalue obeys $\curv w_a^3 = -p\curv w_a - q$, so, if no
eigenvalue is zero, $f'(\curv w_a) = 3\curv w_a^2 + p = -(2p\curv w_a + 3q)/\curv w_a$. The constant term of $f$ gives
$\curv w_1\curv w_2\curv w_3 = -q$. With $x = -3q/2p$,

$$\begin{aligned}\prod_a(2p\curv w_a + 3q) &= (2p)^3\prod_a(\curv w_a - x) = -(2p)^3f(x)\\ &= 27q^3 + 4p^3q ,\end{aligned}$$

because $f(x) = -27q^3/8p^3 - \tfrac12q$. Dividing by $-\prod_a\curv w_a = q$ gives $\prod_af'(\curv w_a) = 27q^2 + 4p^3$,
and so

$$\boxed{\;\prod_{a < b}(\curv w_a - \curv w_b)^2 = -4p^3 - 27q^2 = \tfrac12I^3 - 3J^2 .\;}$$

Both sides are polynomials in the eigenvalues, so the identity, found where $p$, $q$ and every eigenvalue differ from
zero, holds everywhere. Hence $1 - 6J^2/I^3 = (2/I^3)(\tfrac12I^3 - 3J^2)$ vanishes exactly when two eigenvalues
coincide, which is [](#eq:repeated) again. **A limit.** For one mass, $I^3 = 216(G\matter M/r^3)^6$ and $J^2 =
36(G\matter M/r^3)^6$, so $\tfrac12I^3 - 3J^2 = 0$, the double eigenvalue.

**Checks.** One mass gives $1 - 6\cdot36/216 = 0$ and $\curv w = +G\matter M/r^3$, the eigenvalue of the two squeezes
across the line. A single wave has $I = J = 0$ (section 9.1), so the test cannot be applied. **A number.** Two masses in the ratio $1 : 0.45$, at
$(-1.5, 0.3, 0)$ and $(0.9, 1.1, 0.6)$ in the scene's units, from the pixel, give the eigenvalues $-0.537$, $0.135$ and
$0.402$ in those units, $I = 0.468$ and $J = -0.0874$, so $1 - 6J^2/I^3 = 0.553$ (Figure
[](#fig:cx-eigen-plane)).[^scene]

![Look first at the bottom strip: only a scene in which something moves or turns puts the eigenvalues off the real
axis. Two equal eigenvalues, as for one mass, make $1 - 6J^2/I^3$ vanish. Points computed; the spin is
exaggerated.](tut-cx-eigen-plane){#fig:cx-eigen-plane}

## Six shapes, told apart by what the table's powers do

What do the two invariants miss? A polynomial of a table, such as $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv
w)$, is built from powers of the table, with each number standing for that number times the identity.

**A test for a diagonal form.** Suppose a reading with the eigenvalues $\curv w$, $\curv w$ and $-2\curv w$ were
diagonalizable, $\curv{\mathcal W} = V\,\mathrm{diag}(\curv w, \curv w, -2\curv w)\,V^{-1}$. Then $\curv{\mathcal W} -
\curv w = V\,\mathrm{diag}(0, 0, -3\curv w)\,V^{-1}$ and $\curv{\mathcal W} + 2\curv w = V\,\mathrm{diag}(3\curv w, 3\curv
w, 0)\,V^{-1}$, and their product is $V\,\mathrm{diag}(0, 0, 0)\,V^{-1} = 0$. So

$$\boxed{\;\begin{gathered}(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) \neq 0\\ \Longrightarrow\;
\curv{\mathcal W} \text{ is not diagonalizable.}\end{gathered}\;} \label{eq:test}$$

The converse also holds (stated; Axler, result 5.62): a table is diagonalizable exactly when some product of factors
$\curv{\mathcal W} - \lambda$, with different numbers $\lambda$, is zero. The vanishing product of lowest degree is the
table's **minimal polynomial**. For one mass it is $(\lambda - \curv w)(\lambda + 2\curv w)$, and not $\lambda - \curv w$
alone, because $\curv{\mathcal W} = \curv w$ times the identity would have the trace $3\curv w \neq 0$.

Every square table satisfies its own characteristic polynomial, the **Cayley–Hamilton theorem** (stated), so by
[](#eq:cubic) every reading obeys

$$\curv{\mathcal W}^3 - \tfrac12I\,\curv{\mathcal W} - \tfrac13J = 0 . \label{eq:cayley}$$

For a trace-free complex symmetric $3\times3$ table this leaves six shapes, each labelled here with the Petrov letter
that section 9.4 explains:

- **Three different eigenvalues** (I): diagonalizable. Example: the two masses above.
- **A repeated eigenvalue $\curv w \neq 0$, diagonalizable** (D): $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv
  w) = 0$. Example: one mass along $\hat n$, $\curv{\mathcal W} = \curv w(1 - 3\hat n\hat n^{\mathsf T})$, whose two
  factors $-3\curv w\,\hat n\hat n^{\mathsf T}$ and $3\curv w(1 - \hat n\hat n^{\mathsf T})$ multiply to zero because
  $\hat n\cdot\hat n = 1$.
- **A repeated eigenvalue, not diagonalizable** (II): that product is not zero, and [](#eq:cayley) reads $(\curv{\mathcal
  W} - \curv w)^2(\curv{\mathcal W} + 2\curv w) = 0$. Example: a mass with a weak wave along the line to it, below.
- **All eigenvalues zero and $\curv{\mathcal W}^2 \neq 0$** (III): with $I = J = 0$, [](#eq:cayley) gives $\curv{\mathcal
  W}^3 = 0$. Example: the type III table, below.
- **$\curv{\mathcal W} \neq 0$ and $\curv{\mathcal W}^2 = 0$** (N): one plane wave, of rank one, like $N$ above.
- **$\curv{\mathcal W} = 0$** (O): no field.

The list is complete: the eigenvalues all differ, or two coincide and are not zero, or, because the trace is zero, all
three are zero, and then $\curv{\mathcal W}^3 = 0$ leaves three cases for the lowest power that vanishes. A real
symmetric table, the reading of a scene at rest, always has the shape I, D or O, because section 3.4 diagonalizes it.

**A mass with a wave along its line.** We put the mass on the $z$ axis, with $\curv w = G\matter M/r^3$, and add a weak
wave travelling along $\hat z$, with the component $\curv c_2$ of weight 2 about $\hat z$ (section 9.1), in
$\mathrm{s^{-2}}$:

$$\curv{\mathcal W} = \curv w(1 - 3\hat z\hat z^{\mathsf T}) + \curv c_2\,\vect m\vect m^{\mathsf T},$$

with the same $\vect m$ as $N$. Because $\vect m\cdot\hat z = \vect m\cdot\vect m = 0$, the wave's term adds nothing to the
traces: $\curv{\mathcal W}^2 = \curv w^2(1 - 3\hat z\hat z^{\mathsf T})^2 + 2\curv w\curv c_2\,\vect m\vect m^{\mathsf T}$
has the trace $6\curv w^2$, and $J = -6\curv w^3$ in the same way, so the eigenvalues stay $\curv w$, $\curv w$ and $-2\curv
w$. But the two factors of the mass's test each gain $\curv c_2\,\vect m\vect m^{\mathsf T}$, and of the four products
only the one of that term with $3\curv w(1 - \hat z\hat z^{\mathsf T})$ survives:

$$(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) = 3\curv w\curv c_2\,\vect m\vect m^{\mathsf T} \neq 0 .$$

With $\curv w = 0.125$ and $\curv c_2 = 0.05$, in any unit of tide, the product has entries of size $0.0094$. By
[](#eq:test) the weak wave leaves the eigenvalues where they were and makes the table impossible to diagonalize.

**The type III table**, with rows $(0, 0, 1)$, $(0, 0, i)$, $(1, i, 0)$, has $\curv{\mathcal W}^2 = 2\vect m\vect
m^{\mathsf T}$ and $\curv{\mathcal W}\vect m = 0$, so $\curv{\mathcal W}^3 = 2(\curv{\mathcal W}\vect m)\vect m^{\mathsf T} =
0$. Both traces vanish, as for a wave, but the rank is two. The table is $\sqrt2$ times the table $\vect m\hat z^{\mathsf T} + \hat z\vect m^{\mathsf T}$ of spin weight one
(section 9.1).

**What the two numbers cannot tell.** A plane wave along $\hat z$, $\curv{\mathcal W} = N$, and empty space both have $I = J =
0$ and three zero eigenvalues; one mass alone (type D) and the same mass with the weak wave along its line (type II) both
have $I = 6\curv w^2$, $J = -6\curv w^3$ and the eigenvalues $\curv w$, $\curv w$, $-2\curv w$. Only the table's powers
tell each pair apart (Figure [](#fig:cx-shape-tree)): $N \neq 0$ separates the wave from empty space, $\curv{\mathcal W}^2
= 0$ separates it from the type III table, and the product above vanishes for the mass alone but not with the wave.

**The Jordan form**, stated without proof, is the general picture: in suitable axes every square table is a row of
**Jordan blocks** down the diagonal, each with one eigenvalue on its diagonal and 1 on the line above it (Figure
[](#fig:cx-jordan-block)). The six shapes have blocks of sizes $1, 1, 1$ (I, D, O), $2, 1$ (II, N) and $3$ (III), and a
change of observer, $P\curv{\mathcal W}P^{-1}$, keeps the blocks, so no observer can change the shape of a reading.
Gantmacher proved, and we state, that every Jordan form belongs to some complex symmetric table, and that two with the
same Jordan form differ by a complex orthogonal table: the eigenvalues and the shape are all that a change of axes or of
velocity leaves fixed.

![Look first at the first two questions: the invariants alone send a reading to three places, and only the powers
of the table finish the sorting. Each shape has an example and, under it, its minimal polynomial. The Petrov letters
are explained in section 9.4.](tut-cx-shape-tree){#fig:cx-shape-tree}

![Look first at the 1 above the diagonal: it joins two equal eigenvalues into one block with a single eigenvector, so
the table cannot be diagonalized. Both tables have the same eigenvalues and the same $I$ and
$J$.](tut-cx-jordan-block){#fig:cx-jordan-block}

## Every complex rotation is a boost followed by a turn

**Diagonalizing a reading.** Let $\curv{\mathcal W}$ have three different eigenvalues, with eigenvectors $\mathbf v_a$,
independent and orthogonal in the unconjugated sense. None is null: a null $\mathbf v_1$ would be orthogonal in that
sense to all three, hence to every vector, and would be zero. Dividing each by a square root of $\mathbf
v_a\cdot\mathbf v_a$ gives the columns of a table $P$ with $P^{\mathsf T}P = 1$ and $\curv{\mathcal W}P =
P\,\mathrm{diag}(\curv w_a)$. Multiplying on the right by $P^{\mathsf T}$ gives

$$\curv{\mathcal W} = P\,\mathrm{diag}(\curv w_1, \curv w_2, \curv w_3)\,P^{\mathsf T} ,$$

and changing the sign of one column, if $\det P = -1$, makes $P$ a complex rotation. Section
[6.6](/tutorial/relativity/maxwell-complex/#two-boosts-make-a-boost-and-a-turn) stated what kind of table $P$ is, and we
now prove it. We assume that **$P$ is complex orthogonal**, $P^{\mathsf T}P = 1$, and write $P^*$ for its conjugate, so
that $P^\dagger = P^{*\mathsf T}$.

**Step 1: $P^\dagger P$ is Hermitian and positive.** It is its own conjugate transpose, and $\mathbf x^\dagger
P^\dagger P\mathbf x = |P\mathbf x|^2 > 0$ for $\mathbf x \neq 0$, since $P$ has the inverse $P^{\mathsf T}$. By the
Hermitian form of the theorem of section 3.4 its eigenvalues are positive, so it is $e^X$ for exactly one Hermitian $X$,
with the same eigenvectors and the logarithms of the eigenvalues.[^log]

**Step 2: $P^\dagger P$ is complex orthogonal.** From $P^{\mathsf T} = P^{-1}$ also $PP^{\mathsf T} = 1$, whose conjugate
is $P^*P^\dagger = 1$, so

$$(P^\dagger P)^{\mathsf T}(P^\dagger P) = P^{\mathsf T}(P^*P^\dagger)P = 1 .$$

**Step 3: its logarithm is imaginary and antisymmetric.** The conjugate of $P^\dagger P$ is its transpose (step 1), which
is its inverse (step 2): $e^{X^*} = e^{-X}$. Both $X^*$ and $-X$ are Hermitian, and the Hermitian logarithm is unique, so
$X^* = -X$, and $X = iY$ with $Y$ real. Then $X^\dagger = X$ reads $-iY^{\mathsf T} = iY$, so $Y$ is antisymmetric. We write
$Y = 2K_0$, with $\sym{polar-boost}{K_0}$ real, antisymmetric and a pure number.

**Step 4: the rest is a real turn.** Let $\sym{polar-turn}{R_0} = Pe^{-iK_0}$. With $K_0^{\mathsf T} = -K_0$ and
$(e^{-iK_0})^\dagger = e^{-iK_0}$,

$$\begin{aligned}
R_0^{\mathsf T}R_0 &= e^{iK_0}P^{\mathsf T}P\,e^{-iK_0} = 1,\\
R_0^\dagger R_0 &= e^{-iK_0}e^{2iK_0}e^{-iK_0} = 1 .
\end{aligned}$$

So $R_0^{\mathsf T} = R_0^{-1} = R_0^\dagger$, and $R_0^\dagger = R_0^{\mathsf T}$ says that $R_0^* = R_0$: $R_0$ is a real
orthogonal table, with the determinant of $P$ because $\det e^{-iK_0} = e^{-i\,\mathrm{tr}K_0} = 1$. Hence the **polar
decomposition**

$$\boxed{\;\sym{complex-rotation}{P} = R_0\,e^{iK_0}, \qquad e^{2iK_0} = P^\dagger P .\;} \label{eq:polar-split}$$

A real antisymmetric table is a vector in disguise (section
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise)), so $K_0 = -\obs\eta\,\hat
u\cdot\mathbf L$ for a unit vector $\hat u$ and $\obs\eta \ge 0$, and $e^{iK_0} = \exp(-i\obs\eta\,\hat u\cdot\mathbf L)$ is
the boost $\Lambda$ of rapidity $\obs\eta$ along $\hat u$ of section 6.6. Every complex rotation is a boost followed by a
turn, both fixed by $P$. A real turn gives $P^\dagger P = 1$ and no boost.

**A check: the Wigner turn of section 6.6.** For boosts of $0.6c$ along $x$ and then $y$, $P = \Lambda_y\Lambda_x$ and
$P^\dagger P = \Lambda_x\Lambda_y^2\Lambda_x$. Its eigenvalues $7.635$, 1
and $0.131$ are $e^{2\obs\eta}$, 1 and $e^{-2\obs\eta}$, so $\cosh\obs\eta = 1.5625$, a speed of $0.768c$ along $\hat u =
(0.781, 0.625, 0)$, and $R_0$ is a turn about $z$ by $12.68°$: the velocity $(0.6, 0.48, 0)\,c$ and the $12.7°$ of section
6.6.

Together, the diagonal form and the polar decomposition give $\curv{\mathcal W} = P\,\mathrm{diag}(\curv w_1, \curv w_2,
\curv w_3)\,P^{\mathsf T}$ with $P = R_0\,e^{iK_0}$: ten numbers, four in the eigenvalues, three angles in $R_0$ and a
velocity in $K_0$, which section 9.3 reads.[^polar] A reading of type D can be treated in the same way
(stated); types II, III and N cannot be diagonalized at all.

## Singular values are not the sizes of the eigenvalues

Section [3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots) wrote a
real table as $A = U\Sigma V^{\mathsf T}$, its **singular value decomposition**, with the singular values
$\sym{singular-value}{s_i} \ge 0$ the square roots of the eigenvalues of $A^{\mathsf T}A$. The same steps with $\dagger$
for $\mathsf T$ give, for a complex table, $\curv{\mathcal W} =
U\Sigma V^\dagger$, with $\Sigma = \mathrm{diag}(s_1, s_2, s_3)$, $s_1 \ge s_2 \ge s_3$ the square roots of the eigenvalues
of $\curv{\mathcal W}^\dagger\curv{\mathcal W}$, and $U$, $V$ **unitary**, $U^\dagger U = V^\dagger V = 1$. The columns
$\mathbf u_i$ of $U$ and $\mathbf v_i$ of $V$ are the **singular vectors**, with $\curv{\mathcal W}\mathbf v_i = s_i\mathbf
u_i$; the number of nonzero singular values is the rank. For a symmetric table one can take $V = U^*$,

$$\boxed{\;\curv{\mathcal W} = U\Sigma\,U^{\mathsf T},\;} \label{eq:takagi}$$

the **Takagi decomposition** (the box derives it when the singular values differ).

::: derivation
### The Takagi decomposition when the singular values differ

We need unit vectors $\mathbf u_a$, orthogonal in the Hermitian sense, with $\curv{\mathcal W}\mathbf u_a^* =
s_a\mathbf u_a$, because then $\curv{\mathcal W}U^* = U\Sigma$ and $(U^*)^{-1} = U^{\mathsf T}$. The Hermitian table
$\curv{\mathcal W}\curv{\mathcal W}^*$ has eigenvectors $\mathbf v_a$ with the eigenvalues $s_a^2$. For one with $s >
0$, $\mathbf y = \curv{\mathcal W}\mathbf v^*$ obeys $\curv{\mathcal W}\curv{\mathcal W}^*\mathbf y = s^2\mathbf y$, so,
as $s^2$ is not repeated, $\mathbf y = \kappa\mathbf v$. Conjugating gives $\curv{\mathcal W}^*\mathbf v =
\kappa^*\mathbf v^*$, so $s^2\mathbf v = \curv{\mathcal W}\curv{\mathcal W}^*\mathbf v = |\kappa|^2\mathbf v$. Then
$\kappa = s\,e^{i\varphi}$, and $\mathbf u = e^{i\varphi/2}\mathbf v$ has $\curv{\mathcal W}\mathbf u^* = s\mathbf u$.
For $s = 0$, $\curv{\mathcal W}^*\mathbf v = 0$, so $\mathbf u = \mathbf v$ will do.
:::

A turn is real and orthogonal, hence unitary, and leaves the singular values alone; a boost is not unitary (section 6.6
found $\Lambda^\dagger\Lambda = \Lambda^2$), so they change with the observer's speed, while the eigenvalues do not. For a
scene at rest $\curv{\mathcal W}$ is real and symmetric, and its singular values are the sizes of its eigenvalues: 2, 1
and 1 in units of $G\matter M/r^3$ for one mass. A pixel moving at $0.6c$ across the line to that mass reads
$\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$, with $\Lambda$ the boost of section 6.6.[^boost] It still finds the
eigenvalues $-2$, 1 and 1, but the singular values 6.04, 1 and 0.331. A single wave, $\curv{\mathcal W} = \curv
c_2\,\vect m\vect m^{\mathsf T}$, has $\curv{\mathcal W}^\dagger\curv{\mathcal W} = |\curv c_2|^2\,\vect m^*\vect
m^{\mathsf T}$, whose only nonzero eigenvalue is $|\curv c_2|^2$. So its singular values are $|\curv{\mathcal W}|$, 0 and
0, with $|\curv{\mathcal W}| = \sqrt{\langle\curv{\mathcal W}|\curv{\mathcal W}\rangle} = |\curv c_2|$ the length of a
reading of section 9.1, while every eigenvalue is zero.

So the distance to a wave source is read from the ratio of a reading's second singular value to its first, not from
the eigenvalues, which all vanish for a wave: for one plane wave $s_2/s_1 = 0$, and section 9.7 computes the ratio for a
source at a finite distance.[^ranging]

## A pencil of two tables has generalized eigenvalues

Section 9.5 separates three waves of one frequency with this algebra. For two square tables $A$ and $B$
the **pencil** is the family $A - \lambda B$, and its **generalized eigenvalues**, met in section
[3.4](/tutorial/noise/symmetric-matrices/#whitening-turns-shared-noise-into-independent-noise-of-unit-size), are the
roots of $\det(A - \lambda B)$, the $\lambda$ for which some $\mathbf x \neq 0$ has $A\mathbf x = \lambda B\mathbf x$. Let
$A = \sum_a\alpha_a\mathbf m_a\mathbf m_a^{\mathsf T}$ and $B = \sum_a\beta_a\mathbf m_a\mathbf m_a^{\mathsf T}$ be built
from the same three squares $\mathbf m_a\mathbf m_a^{\mathsf T}$, with any vectors $\mathbf m_a$, complex $\alpha_a$,
$\beta_a$, and $M$ the table with the $\mathbf m_a$ as columns. For a diagonal $D$, $MDM^{\mathsf T} = \sum_aD_{aa}\mathbf m_a\mathbf m_a^{\mathsf T}$ (column $a$ of $M$ times row $a$ of
$M^{\mathsf T}$), so $A - \lambda B =
M\,\mathrm{diag}(\alpha_a - \lambda\beta_a)\,M^{\mathsf T}$, and with $\det M^{\mathsf T} = \det M$

$$\boxed{\;\begin{aligned}\det(A - \lambda B) &= \det[\mathbf m_1, \mathbf m_2, \mathbf m_3]^2\\ &\quad\times\prod_{a=1}^3(\alpha_a -
\lambda\beta_a) .\end{aligned}\;} \label{eq:pencil-identity}$$

For independent $\mathbf m_a$ and every $\beta_a \neq 0$ the roots are $\lambda_a = \alpha_a/\beta_a$, and at each root one
square drops out of $A - \lambda B$.[^pencil] Each wave puts the same square into the parts $\curv{\mathcal W}_\pm$ of a
reading, with its helicity amplitudes $\curv\alpha^\pm$ (section 9.1), so with $A = \curv{\mathcal W}_+$, $B = \curv{\mathcal
W}_-$, $\alpha_a = \curv\alpha^+_a$ and $\beta_a = \curv\alpha^-_a$ the roots are the ratios of each wave's two helicity
amplitudes.

::: try {#jordan-explorer}
A trace-free complex symmetric table, shown entry by entry, chosen from five readings: one mass, two masses, one wave, a
mass with a wave along its line, and the type III table. Sliders add a wave along the line, a wave across it and a second
mass. Beside it, the eigenvalues in the complex plane (Figure [](#fig:cx-eigen-plane)), $I$, $J$, $1 - 6J^2/I^3$, the
rank, the singular values, which of the table's powers vanish, and the shape it reaches (Figure
[](#fig:cx-shape-tree)).

Answer the predictions at the top of the figure first. Afterwards, raise the second mass until it is as heavy as the
first, and say why the shape comes back to D.
:::

**The idea to keep: a complex symmetric table keeps orthogonality without conjugates, but its eigenvalues may be complex,
its eigenvectors null, and its axes too few. For a trace-free $3\times3$ table, $I = \mathrm{tr}\,\mathcal W^2$ and $J =
\mathrm{tr}\,\mathcal W^3$ fix the eigenvalues and $1 - 6J^2/I^3$ marks a repeated one, but only the table's powers sort
a reading into its six shapes, which section 9.4 names Petrov's types.**

::: problems
### Practice

**[9.2]** Find $I$, $J$ and $1 - 6J^2/I^3$ for $\curv{\mathcal W} = \mathrm{diag}(1, 2, -3)$, in any unit of tide.

::: solution
$I = 1 + 4 + 9 = 14$ and $J = 1 + 8 - 27 = -18$, so $1 - 6\cdot324/2744 = 0.29$.
:::

**[9.2]** Find the vector that the type III table, with rows $(0, 0, 1)$, $(0, 0, i)$, $(1, i, 0)$, sends to zero.

::: solution
A vector sent to zero needs $v_3 = 0$ and $v_1 + iv_2 = 0$, so it is $(1, i, 0)$, the null vector $\vect m$.
:::

**[9.2]** A reading has the eigenvalues $1 + i$, $1 - i$ and $-2$, in any unit of tide. Find $I$ and $J$, check that
$\tfrac12I^3 - 3J^2$ is the product of the squared differences of the eigenvalues, and say why $1 - 6J^2/I^3$ falls
outside the range from 0 to 1.

::: solution
$I = 2i - 2i + 4 = 4$ and $J = (-2 + 2i) + (-2 - 2i) - 8 = -12$, so $\tfrac12I^3 - 3J^2 = 32 - 432 = -400$. The squared
differences are $(2i)^2 = -4$, $(3 - i)^2 = 8 - 6i$ and $(-3 - i)^2 = 8 + 6i$, whose product is $-4 \times 100 = -400$.
Then $1 - 6J^2/I^3 = 1 - 864/64 = -12.5$. The range from 0 to 1 holds for real eigenvalues, whose squared differences
are positive; complex ones, from a scene in which something moves, can make the product negative.
:::

### Stretch

Combine with section 3.4, which diagonalizes every real symmetric table. The table $\mathrm{diag}(a, -a)$, with $a \ge 0$,
has the eigenvalues $\pm a$, which coincide at $a = 0$. Give it a small imaginary part, $T = \bigl(\begin{smallmatrix}a &
i\epsilon\\ i\epsilon & -a\end{smallmatrix}\bigr)$ with $\epsilon > 0$ in the same unit. Find its eigenvalues. For which
$a$ can $T$ not be diagonalized, and what happens at $a = 0$?

::: solution
The table has no trace and the determinant $-a^2 - (i\epsilon)^2 = \epsilon^2 - a^2$, so its eigenvalues are
$\pm\sqrt{a^2 - \epsilon^2}$. Where they differ, $T$ is diagonalizable. At $a = 0$, where the real table's eigenvalues
coincide, the imaginary part splits them into $\pm i\epsilon$. Only at $a = \epsilon$ do both vanish, and there $T =
\epsilon\bigl(\begin{smallmatrix}1 & i\\ i & -1\end{smallmatrix}\bigr)$ is $\epsilon$ times the upper-left corner of $N$,
whose square is zero: $T$ is not zero, so it cannot be diagonalized.
:::

### The camera

Check [](#eq:pencil-identity), the algebra behind the separation of waves of one frequency, and show that at the root
$\lambda_1$ the vector that $A - \lambda_1B$ sends to zero is $\mathbf m_2\times\mathbf m_3$.

::: solution
At $\lambda_1 = \alpha_1/\beta_1$ the first term drops out, so $A - \lambda_1B = \sum_{a=2,3}(\alpha_a -
\lambda_1\beta_a)\mathbf m_a\mathbf m_a^{\mathsf T}$. On $\mathbf m_2\times\mathbf m_3$ each term gives $\mathbf
m_a\,\mathbf m_a\cdot(\mathbf m_2\times\mathbf m_3) = 0$, since a triple product with a repeated vector vanishes. Section
9.5 uses both facts.
:::
:::

::: paper
- Section VIII's [*One complex matrix*](/paper/#par:one-complex-matrix): $I$, $J$ and why every observer finds the same
  eigenvalues.
- Section VIII's [*Principal null directions*](/paper/#par:principal-null-directions): $1 - 6J^2/I^3$, $w = -J/I$, types
  II and III, and the 0.55 of two masses.
- Section VIII's [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity): the polar
  decomposition.
- Section VIII's [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point) and
  [*Ranging a wave source*](/paper/#par:ranging-a-wave-source): the pencil, and singular values.
- Section VIII's [*What no reading can tell*](/paper/#par:what-no-reading-can-tell): the type III table.
:::

::: deeper
- F. R. Gantmacher, *The Theory of Matrices*, vol. 2 (Chelsea, 1959), chapter XI: complex symmetric matrices, their
  normal forms, and the polar decomposition of a complex orthogonal matrix.
- S. Axler, *Linear Algebra Done Right* (4th edition, Springer, 2024, free online): the minimal polynomial and the test
  for a diagonal form (result 5.62), the Cayley–Hamilton theorem (8.29) and the Jordan form (section 8C).
:::

[^invariants]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:invariants).

[^letters]: $I$ and $J$ are not Stokes $I$ or the current $\mathbf J$; $\curv w_a$ is not the place $w$ of section 3.9; $P$
    is a complex rotation, not the super-Poynting vector $\mathbf P$.

[^powers]: For a diagonalizable table $\mathcal W^k = VD^kV^{-1}$. For every square table it follows from Schur's
    theorem, proved in [section 3.4](/tutorial/noise/symmetric-matrices/#every-square-matrix-is-triangular-in-some-set-of-perpendicular-complex-axes),
    that some unitary $U$ makes $U^\dagger\mathcal WU$ triangular, with the eigenvalues on its diagonal; the powers of a
    triangular table are triangular, with the powers of the eigenvalues on their diagonals.

[^disc]: For $\mathrm{diag}(1, 2, -3)$ the product is $1\cdot25\cdot16 = 400$, and $\tfrac12I^3 - 3J^2 = 1372 - 972 = 400$.

[^scene]: This is the two-mass scene drawn in the paper's [](/paper/#fig:stars), where its 0.55 appears.

[^log]: A Hermitian $X$ with $e^X = H$ commutes with $H$, so it keeps each eigenspace of $H$. On the one of the
    eigenvalue $h$, $e^X = h$, so $X$ is $\ln h$ there, the real logarithm of a positive number being unique.

[^polar]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:polar).

[^boost]: We use the rule $\curv{\mathcal W}' = \Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$ now; section 9.3 derives it.
    With the mass on $\hat z$ and the motion along $\hat x$, $\Lambda = \exp(-i\obs\eta\,\hat x\cdot\mathbf L)$ with
    $\tanh\obs\eta = 0.6$, so $\obs\eta = \ln 2$.

[^ranging]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:ranging-instant).

[^pencil]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:pencil).
