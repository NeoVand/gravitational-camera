---
id: '1.5'
title: 'Five numbers: symmetric trace-free tables'
question: 'The tide at a point is a table of nine numbers. Why does a pixel in empty space record only five of them, and ten when it also reads the twist?'
part: '1'
requires: ['1.1', '1.3', '1.4']
paper: [sec:pixel, sec:regimes, sec:near-field, eq:tidal-column, fig:sky-integral, fig:tidal, eq:magnetic-point, eq:speedometer, eq:thermometer, eq:hole-noise, fig:hair, sec:one-pixel]
figures: [fig:sky-integral, fig:tidal]
live: [five-numbers]
depth: A
---

Chapter 1.4 found that the tide at a point is a table with three rows and three columns, the tidal tensor
$\curv{\tE}_{ij}$, whose nine entries say how two free balls separated along one direction accelerate relative to
each other along another. The summary in plain words that opens the paper's [Section II](/paper/#sec:pixel) says
that "only five of them are independent", and that an ideal pixel, which also reads a second kind of tide that
twists, records ten.

The tide at a point is a table of nine numbers. Why does a pixel in empty space record only five of them, and ten
when it also reads the twist? The answer comes from two rules that every tide in empty space obeys. The paper uses the
five numbers that are left for the image that one pixel makes of the whole sky, for the noise on its readings, and
for the two polarizations of a gravitational wave.

::: plain
A tide is a pattern of stretch and squeeze. Chapter 1.4 wrote it as a table of nine numbers, but the nine are not
free. The table is symmetric: the entry in the east row and the north column equals the entry in the north row and
the east column, so six numbers are enough. In empty space the three entries on the diagonal add up to zero, so
every squeeze is paid for by a stretch. That leaves five numbers.

The five can be counted another way. Every tide has three axes at right angles. Along each one it only stretches,
only squeezes, or does nothing, as a gravitational wave does along its direction of travel. Three angles fix the
axes, and two strengths fix the pattern, because the third must make the sum zero.

The five numbers behave like the components of an arrow in five dimensions, with a length of its own. A pattern
turned by 45° becomes the second polarization of a gravitational wave, and turned by half a circle it looks as before.
:::

## A tidal table is symmetric, so six numbers are enough

A table $T_{ij}$ is **symmetric** when $T_{ij} = T_{ji}$ for every pair of indices, so that it equals its own
transpose (chapter 1.1). We want to know how many numbers fix such a table, because that is how many a pixel must
measure.

The tidal tensor is symmetric because it is a table of second derivatives, $\sym{tidal-tensor}{\curv{\tE}}_{ij} =
\partial_i\partial_j\field\Phi$, taken in either order (chapter 1.4). Here $\sym{potential}{\field\Phi}$ is the
gravitational potential, in joules per kilogram, and the tide is measured in $\mathrm{s^{-2}}$.

For the person of 70 kg one metre to the east of the ring, along the $x$ axis, chapter 1.4 found

$$\curv{\tE} = \frac{G\matter M}{r^3}\begin{pmatrix} -2 & 0 & 0\\ 0 & 1 & 0\\ 0 & 0 & 1\end{pmatrix}, \qquad \frac{G\matter M}{r^3} = 4.67\times10^{-9}\unit{s^{-2}},$$

where $\sym{mass}{\matter M}$ is the person's mass and $r$ the distance. Each entry below the diagonal of a symmetric
table repeats an entry above it, so the table is fixed by the three entries on its diagonal and the three above it.
These six are its **independent components**: numbers that can each be chosen freely and that together fix the table.

A non-example shows what the symmetry rules out. The antisymmetric table $\epsilon_{ijk}w_k$ of chapter 1.1, built
from a vector $\vect w$, changes sign when its two indices are exchanged. Put into the rule of chapter 1.4,
$\ddot\xi_i = -\epsilon_{ijk}w_k\,\xi_j$, it gives each ball the acceleration $\vect w\times\vect\xi$, at right
angles to the line from the centre, so it would set the ring turning instead of stretching it. A tide has no such
part.

## In empty space the trace vanishes, and five numbers are left

The **trace** of a table is the sum of its diagonal entries, $T_{kk} = T_{11} + T_{22} + T_{33}$. Chapter 1.4 showed
that the trace of the tide is the Laplacian of the potential, which Poisson's equation fixes:

$$\curv{\tE}_{kk} = \nabla^2\field\Phi = 4\pi G\matter\rho .$$

Here $\sym{density}{\matter\rho}$ is the density of mass at the point, in kilograms per cubic metre. In empty space
$\matter\rho = 0$, so the trace is zero, and a table whose trace is zero is called **trace-free**. This is one
condition on the six independent components, since it fixes $\curv{\tE}_{zz} = -\curv{\tE}_{xx} -
\curv{\tE}_{yy}$. So a tide in empty space has $6 - 1 = 5$ independent components. The person's table passes the
check, because $-2 + 1 + 1 = 0$.

A second example comes from a gravitational wave, whose tide we use here only in its simplest form.[^wave] A wave
travelling along the $z$ axis, in the polarization called plus, has the table

$$\curv{\tE} = \begin{pmatrix} \curv{\tE}_+ & 0 & 0\\ 0 & -\curv{\tE}_+ & 0\\ 0 & 0 & 0\end{pmatrix},$$

where $\curv{\tE}_+$ is a number in $\mathrm{s^{-2}}$ that oscillates as the wave passes. The trace is zero. When
$\curv{\tE}_+$ is negative the wave stretches the ring along $x$ and squeezes it equally along $y$, and it never
acts along its own direction of travel.

The non-example is a pixel inside water, where the trace is
$4\pi G \times 1000\unit{kg\,m^{-3}} = 8.4\times10^{-7}\unit{s^{-2}}$, about ninety times the person's stretch. A
pixel there would need all six numbers, but the sixth reports only the density at the pixel's own place: in the
words of the paper's Section II, "local information that a pixel in vacuum does not see".

### The same five numbers, counted by axes and strengths

A symmetric table always has three real eigenvalues and three eigenvectors at right angles to one another.[^spectral]
We call the directions of these eigenvectors the table's **eigen-axes**. Along each of them the tide is a pure
stretch or a pure squeeze, and in axes along them the table is diagonal, as the person's already is, with
eigenvalues $-2$, $1$ and $1$ in units of $G\matter M/r^3$.

To fix three axes at right angles takes three angles. Two angles point the first axis at a place on the sky, as a
latitude and a longitude do. One more angle says how far the second axis is turned about the first, and the third
axis is then fixed, because it must be at right angles to both. The three eigenvalues add up to the trace (chapter
1.1), so in empty space only two of them are free. Three angles and two strengths make five, the same five numbers
counted in the tide's own axes instead of in fixed ones.

When two eigenvalues are equal, as the person's two squeezes are, any pair of axes at right angles across the line
to the person will do, so the third angle means nothing. The tide of a single point mass
therefore uses only three of the five numbers: two angles for the line to the mass and one strength,
$G\matter M/r^3$. (The angles fix the line, not the side, because a mass at the same distance on the opposite side
makes the same tide.) A tide whose eigenvalues do not stand in the ratio $-2 : 1 : 1$ cannot come from one mass
alone.

## Every symmetric table splits into a part that changes size and a part that changes shape

We want to separate the part of a symmetric table that the trace carries. The Kronecker delta $\delta_{ij}$ of
chapter 1.1 treats every direction alike, so we let a multiple of it carry the trace and write

$$T_{ij} = \tau\,\delta_{ij} + U_{ij},$$

with $\tau$ a number and $U_{ij}$ symmetric and trace-free. We take the trace of both sides. The trace of
$\delta_{ij}$ is $\delta_{kk} = 3$ and the trace of $U_{ij}$ is zero, so $T_{kk} = 3\tau$ and $\tau = \tfrac13 T_{kk}$.
Then $U_{ij}$ is whatever remains:

$$\boxed{\;T_{ij} = \tfrac13\,\delta_{ij}\,T_{kk} + \Bigl(T_{ij} - \tfrac13\,\delta_{ij}\,T_{kk}\Bigr).\;} \label{eq:split}$$

The first term is the **trace part** of $T$ and the bracket its **trace-free part**. The split is unique, because the
trace fixed $\tau$ with no choice left. A table that is already trace-free has no trace part.

### What each part does to a ball of dust

We want to know what each part does to a cloud of free grains of dust. We assume that **the grains are at rest**
relative to one another at the instant we look, and that **the cloud is small enough that the tide is the same across
it**. Take a box of grains with its edges along the eigen-axes, of lengths $L_1$, $L_2$ and $L_3$. Along an eigen-axis
the rule of chapter 1.4 becomes $\ddot L_k = -\lambda_k L_k$, with no sum over $k$, where $\lambda_k$ is the
eigenvalue along that edge. We differentiate the volume $V = L_1L_2L_3$ twice with the product rule. Every term with
a first derivative $\dot L_k$ vanishes, because the grains are at rest, and three terms remain:

$$\begin{aligned}
\ddot V &= \ddot L_1L_2L_3 + L_1\ddot L_2L_3 + L_1L_2\ddot L_3\\
&= -(\lambda_1 + \lambda_2 + \lambda_3)\,V .
\end{aligned}$$

The sum of the eigenvalues is the trace, so, for grains at rest,

$$\boxed{\;\frac{\ddot V}{V} = -\curv{\tE}_{kk} = -4\pi G\matter\rho .\;}$$

Only the trace part changes the volume. The trace-free part changes only the shape: a ball of dust beside the person
becomes a cigar that points at the person, with the same volume. The trace part alone, as inside the ball of dust of
chapter 1.4, shrinks every edge at the same rate. At the density of water a cloud starting at rest loses 1 per cent of
its volume in about two and a half minutes, since
$\tfrac12 \times 8.4\times10^{-7}\unit{s^{-2}} \times (154\unit{s})^2 = 0.01$. Beside the person in empty space
$\ddot V = 0$ at the start, and the volume changes later only through the products $\dot L_1\dot L_2$ and their like,
which grow from zero as the grains begin to move.[^ricci]

<!-- diagram: a sphere of free particles under the trace part alone (it shrinks, keeping its shape) beside the same
sphere under a trace-free part (it becomes an ellipsoid of the same volume); dashed sphere for the start, orange
stretch and blue squeeze, theme-aware -->

## The five numbers are the components of a vector with its own length

Symmetric trace-free tables add and scale as arrows do, so we can describe them as chapter 1.1 described arrows: by
components along a set of unit directions at right angles.

We first need a dot product of tables. For two tables $D$ and $T$ it is the sum of the nine products of their matching
entries, $D\!:\!T = D_{ij}\,T_{ij}$, which is called their **contraction**. The **Frobenius norm** of a table is the
square root of its contraction with itself, $\sym{frobenius-norm}{|T|} = \sqrt{T_{ij}T_{ij}}$. It is the length of the
table, in the units of its entries.[^frob]

We choose five tables as the five unit directions and label them with a capital index $A$ from 1 to 5, raised as the
paper writes it. It counts tables, not directions in space, and it is a label, not a power: $b^2$ is the second
table, not $b$ times $b$. We write $\sym{stf-basis}{b^A_{ij}}$ for the entry in row $i$
and column $j$ of table $A$. Their entries are pure numbers:

$$\begin{aligned}
b^1 &= \tfrac{1}{\sqrt2}\begin{pmatrix} 0&1&0\\ 1&0&0\\ 0&0&0\end{pmatrix}, &
b^2 &= \tfrac{1}{\sqrt2}\begin{pmatrix} 0&0&0\\ 0&0&1\\ 0&1&0\end{pmatrix},\\
b^3 &= \tfrac{1}{\sqrt2}\begin{pmatrix} 0&0&1\\ 0&0&0\\ 1&0&0\end{pmatrix}, &
b^4 &= \tfrac{1}{\sqrt2}\begin{pmatrix} 1&0&0\\ 0&-1&0\\ 0&0&0\end{pmatrix},\\
b^5 &= \tfrac{1}{\sqrt6}\begin{pmatrix} -1&0&0\\ 0&-1&0\\ 0&0&2\end{pmatrix}.
\end{aligned}$$

The first three each fill one pair of places off the diagonal, and the fourth sets $x$ against $y$. The fifth must be
diagonal, trace-free and at right angles to $b^4$. A diagonal table $T$ has $b^4\!:\!T = (T_{xx} - T_{yy})/\sqrt2$,
so the fifth needs $T_{xx} = T_{yy}$, and with the trace zero its diagonal is $(t, t, -2t)$. With $t = -1$, $b^5$
sets $z$ against $x$ and $y$ together.

The factors $1/\sqrt2$ and $1/\sqrt6$ give each table a length of one: $b^1\!:\!b^1 = \tfrac12 + \tfrac12 = 1$, and
$b^5\!:\!b^5 = (1 + 1 + 4)/6 = 1$. Any two different tables have contraction zero, because the off-diagonal ones
share no entries with any other, and $b^4\!:\!b^5 = (-1 + 1 + 0)/\sqrt{12} = 0$. So

$$\boxed{\;b^A_{ij}\,b^B_{ij} = \delta^{AB}\;} \label{eq:basis}$$

where $\delta^{AB}$ is 1 when $A = B$ and 0 otherwise.

The five also build every symmetric trace-free table, with each off-diagonal entry in its own table, the difference
$\curv{\tE}_{xx} - \curv{\tE}_{yy}$ in $b^4$ and $\curv{\tE}_{zz}$ in $b^5$:

$$\begin{aligned}
\curv{\tE}_{ij} = {}&\sqrt2\,\curv{\tE}_{xy}\,b^1_{ij} + \sqrt2\,\curv{\tE}_{yz}\,b^2_{ij}\\
&+ \sqrt2\,\curv{\tE}_{zx}\,b^3_{ij} + \tfrac{1}{\sqrt2}\bigl(\curv{\tE}_{xx} - \curv{\tE}_{yy}\bigr)\,b^4_{ij}\\
&+ \tfrac{3}{\sqrt6}\,\curv{\tE}_{zz}\,b^5_{ij} .
\end{aligned} \label{eq:general}$$

Each place checks. Off the diagonal $\sqrt2 \times 1/\sqrt2 = 1$, and the $zz$ place receives
$\tfrac{3}{\sqrt6}\times\tfrac{2}{\sqrt6}\,\curv{\tE}_{zz} = \curv{\tE}_{zz}$. The $xx$ place receives
$\tfrac12(\curv{\tE}_{xx} - \curv{\tE}_{yy}) - \tfrac12\curv{\tE}_{zz}$, which is $\curv{\tE}_{xx}$ because the
trace is zero; the $yy$ place works in the same way. A set of tables of length one, at right angles to one another,
that builds every table of its kind is an **orthonormal basis**. Each of the five, drawn as a ring of free balls, is
a basic pattern of stretch and squeeze.

<!-- diagram: the five basis tables b^1 ... b^5 drawn as five small rings of twelve free particles, each deformed by
one table (b^1, b^4 in the xy plane, b^2 in yz, b^3 in zx, b^5 as a ring in the xz plane stretched along x and
squeezed along z, or two rings), orange stretch and blue squeeze, theme-aware -->

We write the sum as $\curv{\tE}_{ij} = c_B\,b^B_{ij}$, summed over $B$. The number $\sym{stf-coefficient}{c_B}$ is
the **coefficient** of the table along $b^B$, in the units of the table. We contract both sides with $b^A$ and use
[](#eq:basis), which keeps only the term $B = A$:

$$b^A_{ij}\,\curv{\tE}_{ij} = c_B\,b^A_{ij}b^B_{ij} = c_B\,\delta^{AB} = c_A .$$

So each coefficient is read off by contraction with its basis table, and [](#eq:general) lists all five. The square
of the length follows from [](#eq:basis) again:

$$\begin{aligned}
|\curv{\tE}|^2 = \curv{\tE}_{ij}\curv{\tE}_{ij} &= c_Ac_B\,b^A_{ij}b^B_{ij}\\
&= c_1^2 + c_2^2 + c_3^2 + c_4^2 + c_5^2 .
\end{aligned}$$

This is the theorem of Pythagoras in five dimensions: the Frobenius norm is the length of the arrow that the five
coefficients make.

::: example
### The person to the north-east, in five coefficients

Chapter 1.1 placed the person to the north-east, with $x$ east and $y$ north, and found, in units of
$G\matter M/r^3$,

$$\curv{\tE} = \begin{pmatrix} -\tfrac12 & -\tfrac32 & 0\\ -\tfrac32 & -\tfrac12 & 0\\ 0 & 0 & 1\end{pmatrix}.$$

By [](#eq:general), $c_1 = \sqrt2 \times (-\tfrac32) = -\tfrac{3}{\sqrt2} = -2.12$. The entries $\curv{\tE}_{yz}$ and
$\curv{\tE}_{zx}$ are zero, so $c_2 = c_3 = 0$. Next, $c_4 = \tfrac{1}{\sqrt2}(-\tfrac12 + \tfrac12) = 0$ and
$c_5 = \tfrac{3}{\sqrt6} \times 1 = 1.22$. The sum of squares is $\tfrac92 + \tfrac32 = 6$, and the squares of the
nine entries give $\tfrac14 + \tfrac14 + \tfrac94 + \tfrac94 + 1 = 6$, the same.

The entry $\curv{\tE}_{xy} = -\tfrac32$ and the coefficient $c_1$ differ by the factor $\sqrt2$, because $b^1$
spreads its coefficient over two entries. The factor matters for noise: the paper's speedometer, after its equation
[](/paper/#eq:speedometer), puts a random error of the same size $\sigma$ on each coefficient, so an entry off the
diagonal carries $\sigma/\sqrt2$.

The person due east, $\mathrm{diag}(-2, 1, 1)$, has $c_4 = -3/\sqrt2$ and $c_5 = 3/\sqrt6$, and again
$\tfrac92 + \tfrac32 = 6$. The move of 45° round the vertical carried $-3/\sqrt2$ from $b^4$ to $b^1$, and the last
section shows why.
:::

The length stayed 6 when the person moved, and it never changes when the axes turn. We turn them with the rule
$T' = RTR^{\mathsf T}$ of chapter 1.1 and use $R_{ik}R_{im} = \delta_{km}$ twice:

$$\begin{aligned}
T'_{ij}T'_{ij} &= R_{ik}R_{jl}T_{kl}\,R_{im}R_{jn}T_{mn}\\
&= \delta_{km}\delta_{ln}\,T_{kl}T_{mn} = T_{kl}T_{kl} .
\end{aligned}$$

The same steps show that $D\!:\!T$ does not change either. So the person's tide has the length
$|\curv{\tE}| = \sqrt6\,G\matter M/r^3 = 1.14\times10^{-8}\unit{s^{-2}}$, 1.22 times its largest stretch. The
Earth's tide at the ground has the length $3.8\times10^{-6}\unit{s^{-2}}$, 330 times the person's.

The contraction of the tide with a fixed table $D$ gives one number, as the dot product of an arrow with a fixed
direction gives one component. By chapter 1.4, a detector like LIGO, with arms along $x$ and $y$ much shorter than
the distance over which the tide changes, reads the changing part of $\curv{\tE}_{xx} - \curv{\tE}_{yy}$,
integrated twice in time. This is $D\!:\!\curv{\tE}$ for $D = \mathrm{diag}(1, -1, 0) = \sqrt2\,b^4$, so LIGO reads
one of the five coefficients, $\sqrt2\,c_4$, and nothing of the other four. The paper's thermometer, equation
[](/paper/#eq:thermometer), reads a body's temperature from one such contraction.

::: derivation
### The projector that makes the split in one step, stated in part without proof

The paper writes the trace-free part of a table with one table of four indices, each running over $x$, $y$ and $z$,
so that it has $3^4 = 81$ entries, all pure numbers:

$$\sym{stf-projector}{\Pi_{ijkl}} = \tfrac12\bigl(\delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk}\bigr) - \tfrac13\,\delta_{ij}\delta_{kl} .$$

Applied to any table $T_{kl}$, each delta replaces one index by another:

$$\Pi_{ijkl}\,T_{kl} = \tfrac12\bigl(T_{ij} + T_{ji}\bigr) - \tfrac13\,\delta_{ij}\,T_{kk} .$$

This is the trace-free part, by [](#eq:split), of the symmetric part of $T$. It is symmetric and trace-free for any
$T$, symmetric or not, so a second application of $\Pi$ changes nothing, and $\Pi$ sends $\delta_{kl}$ to zero. A
table that acts in this way is a **projector**, as in chapter 1.1.

We state without proof that $\Pi$ is also the sum $\Pi_{ijkl} = b^A_{ij}\,b^A_{kl}$ over the five basis tables. Two
checks can be done by hand. Applied to a symmetric trace-free table, the right side gives $b^A_{ij}c_A$, the table
itself, as the left side does. And the trace over both pairs of indices, with $k = i$ and $l = j$, agrees. On the
left, $\delta_{ii} = 3$ and $\delta_{ij}\delta_{ij} = 3$ give $\Pi_{ijij} = \tfrac12(3\times3 + 3) - \tfrac13\times3 =
5$. On the right, each of the five terms is $b^A_{ij}b^A_{ij} = 1$. The trace counts the five dimensions that $\Pi$
keeps, as the trace 2 of the projector across a direction did in chapter 1.1.

The paper's equation [](/paper/#eq:hole-noise) uses $\Pi$ for a black hole. Its quadrupole $Q_{ij}$ is a symmetric
trace-free table, in $\mathrm{kg\,m^2}$, defined so that its energy in a tide is the contraction
$Q_{ij}\curv{\tE}_{ij}$ (chapter 13.7). The quadrupole jitters. The equation writes the average of the product
$Q_{ij}(t)\,Q_{kl}(0)$ as $\Pi_{ijkl}$ times one function of time, built from a spectrum $S_Q$, the strength of the
jitter at each frequency, in $\mathrm{kg^2\,m^4\,s}$. With $Q_{ij} = q_A\,b^A_{ij}$, the averaged product of two
coefficients is $b^A_{ij}\Pi_{ijkl}b^B_{kl} = \delta^{AB}$ times that function. So the five coefficients jitter with
the same spectrum, and any two different ones are uncorrelated, which means that the average of their product is
zero.
:::

## Averaged over the sky, the tidal weight vanishes

The paper adds up the tide of all the matter around a pixel, direction by direction. A unit vector
$\sym{unit-vector}{\hat n}$ points from the pixel toward the matter. The matter in a thin cone of solid angle
$\sym{solid-angle}{\dd\Omega}$ about $\hat n$, between the distances $r$ and $r + \dd r$, has the volume
$r^2\,\dd r\,\dd\Omega$ (chapter 1.3). Its mass is $\dd m = \matter\rho\,r^2\,\dd r\,\dd\Omega$, and by the point-mass
table of chapter 1.4 it adds $G\,\dd m\,(\delta_{ij} - 3\hat n_i\hat n_j)/r^3$ to the tide. The $r^2$ cancels two of
the three powers of $1/r$.

We assume that **the matter stays clear of the pixel**, beyond a small distance $r_{\min}$, a quarter of a metre in the
paper's scenes. Matter at the pixel would add the trace $4\pi G\matter\rho$, which the trace-free weight below cannot
give, and the integral over $r$ would grow like $\ln(1/r_{\min})$ as $r_{\min}$ shrinks. Summing over the whole sky then
gives the paper's equation [](/paper/#eq:tidal-column):

{{paper eq:tidal-column}}

Here $S(\hat n) = \int\matter\rho\,\dd r/r$ is the **tidal column** in the direction $\hat n$: the mass along that
line of sight, each part weighted by the inverse of its distance. It is measured in $\mathrm{kg\,m^{-3}}$, so $GS$ is
in $\mathrm{s^{-2}}$.[^column] The table $\delta_{ij} - 3\hat n_i\hat n_j$ is the **tidal weight**: it says how
matter in the direction $\hat n$ adds to each entry of the tide. We want its average over the sky.

### The average over the sky, by symmetry and in full

We want the integral $\int \hat n_i\hat n_j\,\dd\Omega$, taken over all directions. The only assumption is that
**the integral covers the whole sky**, the unit sphere of chapter 1.3.

The entries off the diagonal vanish. For every direction $(\hat n_x, \hat n_y, \hat n_z)$ the sky holds its mirror
image $(-\hat n_x, \hat n_y, \hat n_z)$, and $\hat n_x\hat n_y$ has opposite signs at the two, so their
contributions to the $xy$ entry cancel, and likewise for $yz$ and $zx$. The diagonal entries are equal, because
exchanging two axes maps the sky onto itself. A table whose entries are the same in every set of turned axes is
called **isotropic**, as $\delta_{ij}$ is, and this integral is one too. So it is
$\kappa\,\delta_{ij}$ for some number $\kappa$. We take the trace, and use $\hat n_i\hat n_i = 1$ and the $4\pi$
steradians of the whole sky:

$$3\kappa = \int \hat n_i\hat n_i\,\dd\Omega = \int \dd\Omega = 4\pi, \qquad \kappa = \frac{4\pi}{3}.$$

We check one entry in full. Let $\vartheta$ be the angle between $\hat n$ and the $z$ axis, so that $\hat n_z =
\cos\vartheta$. The directions between $\vartheta$ and $\vartheta + \dd\vartheta$ form a band of radius $\sin\vartheta$
and width $\dd\vartheta$, with solid angle $2\pi\sin\vartheta\,\dd\vartheta$. We substitute $u = \cos\vartheta$, with
$\dd u = -\sin\vartheta\,\dd\vartheta$:

$$\int \hat n_z^2\,\dd\Omega = \int_0^\pi \cos^2\vartheta\;2\pi\sin\vartheta\,\dd\vartheta = 2\pi\int_{-1}^{1} u^2\,\dd u = \frac{4\pi}{3}.$$

So

$$\boxed{\;\begin{aligned}
\int \hat n_i\hat n_j\,\dd\Omega &= \frac{4\pi}{3}\,\delta_{ij},\\
\int\bigl(\delta_{ij} - 3\hat n_i\hat n_j\bigr)\,\dd\Omega &= 4\pi\,\delta_{ij} - 4\pi\,\delta_{ij} = 0 .
\end{aligned}\;} \label{eq:sky}$$

In words, each axis receives one third of the sky, and the tidal weight averages to zero.

So a tidal column that is the same in every direction gives no tide, and a uniform shell of matter around the pixel
is invisible to it. The shell theorem of chapter 1.3 agrees: inside a hollow uniform shell the pull is zero
everywhere, so the difference of the pull between two points, the tide, is zero too.

{{paper fig:sky-integral}}

Panel (b) of the figure colours the sky by the sign of the weight with which matter in each direction enters
$\curv{\tE}_{zz}$, which is $1 - 3\cos^2\vartheta$. The weight is zero where $\cos^2\vartheta = \tfrac13$, at
$\vartheta = 54.7°$. Matter in the two caps within 54.7° of the $z$ axis has a negative weight and stretches the ring
along $z$; matter in the band between them squeezes it. The caps cover 42 per cent of the sky, and their weight
balances the band's exactly.

### Patterns of higher degree hold 7, 9 and more numbers

A symmetric table with $\ell$ indices makes the pattern $T_{i_1\cdots i_\ell}\,\hat n_{i_1}\cdots\hat n_{i_\ell}$ on
the sky, and the whole number $\sym{degree}{\ell}$ is its **degree**. Degree 0 is a constant, degree 1 a **dipole**,
larger on one side of the sky than on the other, and degree 2 a **quadrupole**, the same in opposite directions, as
the tidal weight is. Such a table has $(\ell + 1)(\ell + 2)/2$ independent entries. Its traces, which hide patterns
of lower degree (as $\tau\,\delta_{ij}$ makes the constant pattern $\tau$), form a table of degree $\ell - 2$ with
$(\ell - 1)\ell/2$ entries, and removing them leaves $\tfrac12\bigl[(\ell^2 + 3\ell + 2) - (\ell^2 - \ell)\bigr] =
2\ell + 1$ numbers: 1, 3, 5, 7, 9 for $\ell = 0$ to 4. Chapter 2.2 proves that these conditions are independent and
turns the patterns into the spherical harmonics. A
resonant sphere, a ball of metal that rings when a tide squashes it, has five ways of ringing in its lowest tone, one
for each number of $\curv{\tE}$ [@MerkowitzJohnson1995]. A pixel that records a sky of many independent sources
weighs each direction by a pattern of degree four, so it learns the sky's brightness up to degree four,
$1 + 3 + 5 + 7 + 9 = 25$ numbers ([Section VIII](/paper/#sec:one-pixel)). The beads of the paper's Figure
[](/paper/#fig:hair) are a body's moments, the numbers that describe how its mass is spread, up to degree twelve:
$1 + 3 + \dots + 25 = 13^2 = 169$.

## Across a wave two numbers are left, and a turn of 45° swaps them

A gravitational wave travelling along $z$ acts only across its direction of travel, so its table has zeros in the
third row and column. The rest is a $2\times2$ table in the $xy$ plane, symmetric and trace-free:

$$\curv{\tE} = \begin{pmatrix} \curv{\tE}_+ & \curv{\tE}_\times\\ \curv{\tE}_\times & -\curv{\tE}_+\end{pmatrix}.$$

Two numbers are left, both in $\mathrm{s^{-2}}$. The pattern with $\curv{\tE}_\times = 0$ is the plus polarization
of the second section, and the pattern with $\curv{\tE}_+ = 0$ is the cross polarization. A **polarization** of a
wave is one of these two basic patterns of stretch and squeeze across its direction.[^lambda]

{{paper fig:tidal}}

Panels (b) and (c) of the figure draw the two patterns on a ring.[^strain] The eigen-axes of the cross table are the
diagonals, so the cross pattern looks like the plus pattern turned by 45°. We want to see how the two numbers change
when the axes turn.

We turn the axes about $z$ by the angle $\theta$, anticlockwise as seen from the side toward which $z$ points, as in
chapters 1.1 and 1.5b. By chapter 1.1, the rows of $R$ are the new axes, so in the plane
$R = \begin{pmatrix}\cos\theta & \sin\theta\\ -\sin\theta & \cos\theta\end{pmatrix}$, and the new table is
$RTR^{\mathsf T}$. Multiplying out the three matrices gives the two entries of the first row:

$$\begin{aligned}
\curv{\tE}'_+ &= \curv{\tE}_+(\cos^2\theta - \sin^2\theta) + 2\curv{\tE}_\times\sin\theta\cos\theta,\\
\curv{\tE}'_\times &= -2\curv{\tE}_+\sin\theta\cos\theta + \curv{\tE}_\times(\cos^2\theta - \sin^2\theta),
\end{aligned}$$

and the second diagonal entry is $-\curv{\tE}'_+$, because the trace stays zero. The double-angle formulas,
$\cos 2\theta = \cos^2\theta - \sin^2\theta$ and $\sin 2\theta = 2\sin\theta\cos\theta$, turn this into

$$\boxed{\;\begin{pmatrix} \curv{\tE}'_+\\ \curv{\tE}'_\times\end{pmatrix} = \begin{pmatrix}\cos 2\theta & \sin 2\theta\\ -\sin 2\theta & \cos 2\theta\end{pmatrix}\begin{pmatrix} \curv{\tE}_+\\ \curv{\tE}_\times\end{pmatrix}.\;} \label{eq:twice}$$

The point $(\curv{\tE}_+, \curv{\tE}_\times)$ turns by $2\theta$ when the axes turn by $\theta$, in the opposite sense,
while an arrow $(v_x, v_y)$ becomes $R\,\vect v$ and turns by $\theta$ only. Chapter 1.5b writes the pair as one complex
number, the shear $\curv{s} = 2(\curv{\tE}_+ + i\curv{\tE}_\times)$, and [](#eq:twice) is then its rule $\curv{s}' =
e^{-2i\theta}\curv{s}$ for the same turn, so the two chapters agree.

At $\theta = 45°$, $(\curv{\tE}_+, 0)$ becomes $(0, -\curv{\tE}_+)$: the plus table becomes the cross table with the
opposite sign. At $\theta = 90°$ the point changes sign, because $x$ and $y$ have changed places. At $\theta = 180°$ the
point comes back to itself, while an arrow points the other way and needs 360°. This is the paper's line in
[Section III](/paper/#sec:regimes): a pattern "turned by half a circle looks exactly as it did before". Physicists say that
gravity has **spin two**, because its tide turns by twice the angle of the axes, and that light, whose field is an
arrow, has spin one.[^spin]

The same rule moves the person. In the $xy$ plane the person due east has the block $\mathrm{diag}(-2, 1)$, in units
of $G\matter M/r^3$, with trace $-1$. In two dimensions $\delta_{kk} = 2$, so the trace part is $\tfrac12$ of the
trace times the identity, here $-\tfrac12$, and the trace-free part is $\mathrm{diag}(-\tfrac32, \tfrac32)$, with
$\curv{\tE}_+ = -\tfrac32$ and $\curv{\tE}_\times = 0$. The identity does not change under a turn about $z$,
because $RR^{\mathsf T}$ is the identity. Moving the person anticlockwise to the north-east is the same as turning
the axes by $\theta = -45°$, and [](#eq:twice) gives $\curv{\tE}'_+ = 0$ and $\curv{\tE}'_\times = -\tfrac32$. With
the $-\tfrac12$ put back on the diagonal, this is the table of the worked example. Since $c_4 = \sqrt2\,\curv{\tE}_+$
and $c_1 = \sqrt2\,\curv{\tE}_\times$, the coefficient moved from $b^4$ to $b^1$.

<!-- diagram: the 2x2 trace-free table drawn as a point (E+, Ex) on its own plane, beside a ring under that table;
turning the ring's axes anticlockwise by theta moves the point round a circle by 2 theta in the opposite sense;
marks at 45° (plus to minus cross), 90° and 180° -->

### A pixel that also reads the twist records ten numbers

Moving masses add a second kind of tide, the **magnetic part** $\curv{\tB}_{ij}$ of the paper's equation
[](/paper/#eq:magnetic), in $\mathrm{s^{-2}}$. It describes how gyroscopes at nearby points turn relative to one
another. In empty space it is also symmetric and trace-free, which chapter 7.5 derives, so it holds five more
numbers, and a pixel that reads both parts records ten. In a gravitational wave the two parts are equal in size, and
$\curv{\tB}$ is $\curv{\tE}$ turned by 45° about the direction of travel. Near slowly moving matter $\curv{\tB}$ is small: for one mass crossing the line of sight at the
speed $v_\perp$, $|\curv{\tB}|/|\curv{\tE}| = \sqrt3\,v_\perp/c$, with $c$ the speed of light (the second problem
below), which is $5.8\times10^{-9}$ for a person walking at $1\unit{m\,s^{-1}}$.

::: try {#five-numbers}
The figure builds a table from the five coefficients $c_1$ to $c_5$, which you set with the sliders in units of
$G\matter M/r^3$, and shows its push on three rings of free balls, one in each of the planes $xy$, $yz$ and $zx$. It
opens on the person along $x$. Before you move anything, predict whether some setting of the five sliders can make
all three rings shrink at once, with every ball moving inward.

Then try it, and watch the three eigenvalues and their sum as you go. Next, load the plus wave along $z$ and turn it
into the cross wave with two sliders, $c_4$ down to zero and $c_1$ up to 2: compare the axes of the $xy$ ring before
and after. Last, load the person, move $c_2$ a little, and watch the line "One mass?" change its answer.
:::

::: check
### Q

How many independent numbers has a symmetric $3\times3$ table, and how many if its trace is zero?

### A

Six, the three on the diagonal and the three above it. A zero trace fixes one diagonal entry from the other two, so
five are left.

### Q

Write $\mathrm{diag}(1, 2, 3)$ as a trace part plus a trace-free part.

### A

The trace is 6, so the trace part is $\tfrac13 \times 6\,\delta_{ij} = 2\,\delta_{ij}$, and the trace-free part is
$\mathrm{diag}(1, 2, 3) - \mathrm{diag}(2, 2, 2) = \mathrm{diag}(-1, 0, 1)$.

### Q

The person's largest stretch is $9.3\times10^{-9}\unit{s^{-2}}$. What is the length $|\curv{\tE}|$ of the person's
tide?

### A

The eigenvalues are $-2$, $1$ and $1$ in units of $G\matter M/r^3$, so $|\curv{\tE}|^2 = 6\,(G\matter M/r^3)^2$. The
length is $\sqrt6\,G\matter M/r^3$, which is $\sqrt6/2 = 1.22$ times the largest stretch:
$1.14\times10^{-8}\unit{s^{-2}}$.

### Q

Why does a uniform shell of matter round the pixel add no tide?

### A

Each direction of the sky adds its tidal column times the weight $\delta_{ij} - 3\hat n_i\hat n_j$. For a uniform
shell the column is the same in every direction, and the weight averages to zero over the sky, because each axis
receives a third of the sky: $\int\hat n_i\hat n_j\,\dd\Omega = \tfrac{4\pi}{3}\delta_{ij}$.

### Q

By what angle must the axes turn to change a plus pattern into a cross pattern, and by what angle to bring it back to
itself?

### A

By 45°, which turns the point $(\curv{\tE}_+, \curv{\tE}_\times)$ by 90°. By 180°, which turns the point by 360°.
:::

**The idea to keep: a symmetric table with no trace holds five numbers, three angles and two strengths. They can be
handled as one vector with its own length, and a pattern of stretch and squeeze turned by 45° becomes the other
polarization, while turned by 180° it becomes itself.**

::: problems
### Practice

In units of $10^{-9}\unit{s^{-2}}$, a tide has the table
$\begin{pmatrix} 1 & 2 & 0\\ 2 & -3 & 1\\ 0 & 1 & 2\end{pmatrix}$. Check that it is trace-free, find its five
coefficients, and check that their squares add up to the sum of the squares of the nine entries.

::: solution
The trace is $1 - 3 + 2 = 0$. By [](#eq:general), $c_1 = 2\sqrt2 = 2.83$, $c_2 = \sqrt2 = 1.41$, $c_3 = 0$,
$c_4 = (1 + 3)/\sqrt2 = 2\sqrt2 = 2.83$ and $c_5 = 3 \times 2/\sqrt6 = \sqrt6 = 2.45$, all in units of
$10^{-9}\unit{s^{-2}}$. Their squares add up to $8 + 2 + 0 + 8 + 6 = 24$. The nine entries give
$1 + 4 + 0 + 4 + 9 + 1 + 0 + 1 + 4 = 24$, the same, so $|\curv{\tE}| = \sqrt{24} = 4.9\times10^{-9}\unit{s^{-2}}$.
:::

### Stretch

The paper's equation [](/paper/#eq:magnetic-point), which chapter 7.5 derives and we take as given, says that a mass
$\matter M$ in the direction $\hat n$ at the distance $r$, moving with velocity $\vect v$, has the magnetic tide
$\curv{\tB}_{ij} = (3G\matter M/cr^3)(\hat n_iu_j + \hat n_ju_i)$, where $\vect u = \hat n\times\vect v$. Show that
$|\curv{\tB}|/|\curv{\tE}| = \sqrt3\,v_\perp/c$, where $v_\perp = |\vect u|$ is the speed across the line of sight.

::: solution
The vector $\vect u$ is at right angles to $\hat n$, so $\hat n\cdot\vect u = 0$, and $|\vect u| = v_\perp$. The two
tables $\hat n_iu_j$ and $u_i\hat n_j$ have the contraction $\hat n_iu_ju_i\hat n_j = (\hat n\cdot\vect u)^2 = 0$, so
they are at right angles, and each has length $v_\perp$. Their sum therefore has $|\cdot|^2 = 2v_\perp^2$, and
$|\curv{\tB}|^2 = 18\,(G\matter Mv_\perp/cr^3)^2$. The point-mass tide has $|\curv{\tE}|^2 = 6\,(G\matter M/r^3)^2$.
The ratio of the squares is $3v_\perp^2/c^2$. The trace of $\curv{\tB}$ is $2\hat n\cdot\vect u = 0$, as it must be
in empty space.
:::

### The paper

Show that the weight in the paper's equation [](/paper/#eq:tidal-column) averages to zero over the sky and that the
weight of $\curv{\tE}_{zz}$ changes sign at 54.7°. Then explain why a pixel that sees a tidal column $S(\hat n)$ of
the form $s_0 + \vect s\cdot\hat n$, a constant plus a dipole, reads no tide, and why the paper's
[Section IV](/paper/#sec:near-field) can say that a single pixel "measures only five numbers, the quadrupole of $S$
over the whole sky".

::: solution
The average is equation [](#eq:sky). The weight of $\curv{\tE}_{zz}$ is $1 - 3\hat n_z^2 = 1 - 3\cos^2\vartheta$,
which vanishes where $\cos\vartheta = 1/\sqrt3$, at $\vartheta = 54.7°$.

The constant $s_0$ gives $Gs_0$ times the average of the weight, which is zero. The dipole gives
$Gs_k\int(\delta_{ij} - 3\hat n_i\hat n_j)\hat n_k\,\dd\Omega$. Each term has an odd number of factors of $\hat n$,
and the sky holds every direction together with its opposite, $-\hat n$, so the contributions cancel in pairs.

The weight is $-3$ times the trace-free table $\hat n_i\hat n_j - \tfrac13\delta_{ij}$, so the pixel reads
$\curv{\tE}_{ij} = -3G\int(\hat n_i\hat n_j - \tfrac13\delta_{ij})\,S\,\dd\Omega$, a symmetric trace-free table: five
numbers, the quadrupole moments of $S$. Patterns of degree 3 and higher also give zero, which chapter 2.2 shows, so
those five numbers are all that one pixel learns of $S$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) counts the five numbers of $\curv{\tE}$ in its summary in plain words, names the
  resonant spheres that read them, and states that $\curv{\tB}$ is also symmetric and trace-free in empty space, so
  that a pixel records ten numbers, with $\curv{\tB}$ equal to $\curv{\tE}$ turned by 45° in a plane wave.
- [Section III](/paper/#sec:regimes) says that a pattern turned by half a circle looks as it did before, and in
  *Spin, speed and compactness* that curvature at a point is a symmetric trace-free tensor.
- Equation [](/paper/#eq:tidal-column) and Figure [](/paper/#fig:sky-integral) are the sky integral, whose weight
  averages to zero and changes sign at 54.7°.
- *The magnetic picture* in [Section IV](/paper/#sec:near-field) compares $|\curv{\tB}|$ with $|\curv{\tE}|$ in
  Frobenius norms, from equation [](/paper/#eq:magnetic-point).
- Equation [](/paper/#eq:thermometer) reads one contraction $D\!:\!\curv{\tE}$, and the precision stated after
  equation [](/paper/#eq:speedometer) puts noise on each coefficient of the orthonormal basis.
- Equation [](/paper/#eq:hole-noise) writes the jitter of a black hole's quadrupole with the projector
  $\Pi_{ijkl}$.
- *What one pixel sees of the sky*, in [Section VIII](/paper/#sec:one-pixel), counts 25 numbers of the sky's
  brightness up to degree four, in equation [](/paper/#eq:sky-count), and Figure [](/paper/#fig:hair) counts 169
  moments up to degree twelve.
:::

::: deeper
- The [GR course's lesson on tidal instruments](https://neovand.github.io/general-relativity/chapter-10.html#what-a-tidal-instrument-measures)
  reads the tidal matrix and its eigenvalues near the Earth, and its
  [figure of tidal eigenvalues](https://neovand.github.io/general-relativity/chapter-10.html#figure-tidal-eigenvalues)
  plots them.
- The GR course's [curvature cloud explorer](https://neovand.github.io/general-relativity/chapter-9.html#curvature-cloud-explorer)
  lets a cloud of particles evolve under a trace part or a trace-free part, the Ricci and Weyl curvature of
  relativity.
- The [GR course, section 18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten)
  explains why a gravitational wave has two polarizations and not more, and
  [section 10.10](https://neovand.github.io/general-relativity/chapter-10.html#10-10-why-twenty-curvature-numbers-survive-local-flattening)
  counts the twenty numbers of the full curvature.
- Kip Thorne's review of multipole expansions [@Thorne1980], in its second section, develops symmetric trace-free
  tables of every degree and proves the count $2\ell + 1$ in general.
:::

[^wave]: Chapter 7.6 derives the tide of a gravitational wave from relativity. Here we need only the form of its
    table.

[^spectral]: This is a theorem of linear algebra, which we use without proof. Chapter 3.4 returns to it.

[^ricci]: In relativity the part of the curvature that changes volume is the Ricci curvature, fixed by the matter
    at the point, and the part that changes shape is the Weyl curvature, which reaches through empty space. Chapter
    7.3 defines both.

[^frob]: The name is that of the mathematician Ferdinand Georg Frobenius. The norm is the ordinary length of the
    nine entries written out as one list.

[^column]: Chapter 2.3 returns to the tidal column and to what an array of pixels learns of it.

[^lambda]: The paper's equation [](/paper/#eq:wave-zone) writes the wave far from its source with a projector
    $\Lambda_{ij,kl}(\hat n)$, which keeps from any table exactly this symmetric trace-free part across the
    direction of travel, as $\Pi_{ijkl}$ keeps the symmetric trace-free part in three dimensions. Chapter 7.6
    builds it.

[^strain]: The figure's caption names the polarizations by the strains $h_+$ and $h_\times$, which are pure numbers.
    The tides $\curv{\tE}_+$ and $\curv{\tE}_\times$, in $\mathrm{s^{-2}}$, are proportional to them in a steady
    wave (chapter 7.6).

[^spin]: Chapter 9.1 returns to spin.
