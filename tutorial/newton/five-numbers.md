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

The tide at a point is a table of nine numbers, the entries of the tidal tensor $\curv{\tE}_{ij}$ that the tide of one
mass produced in [section 1.4](/tutorial/newton/tides/). Why does a pixel in empty space record only five of them, and
ten when it also reads the twist?[^p-count] The answer comes from two rules that every tide in empty space obeys. The
five numbers that remain describe the image that one pixel makes of the whole sky, the noise on its readings, and the
two polarizations of a gravitational wave.

::: plain
The nine numbers of a tide are not free. The table is symmetric: the entry in the east row and the north column
equals the entry in the north row and the east column, so six numbers are enough. In empty space the three entries on
the diagonal add up to zero, so every squeeze is paid for by a stretch, and five numbers are left. They can also be
counted as three angles that fix the tide's axes and two strengths, and they behave like the components of an arrow
in five dimensions, with a length of its own.
:::

## A tidal table is symmetric, so six numbers are enough

A table $T_{ij}$ is **symmetric** when $T_{ij} = T_{ji}$ for every pair of indices, so that it equals its own
transpose ([section 1.1](/tutorial/newton/vectors-and-indices/), indices and tables). A pixel must measure as many
numbers as fix its table, so we count them.

The tidal tensor is symmetric because it is a table of second derivatives, $\sym{tidal-tensor}{\curv{\tE}}_{ij} =
\partial_i\partial_j\field\Phi$, taken in either order. Here $\sym{potential}{\field\Phi}$ is the gravitational
potential, in joules per kilogram, and the tide is measured in $\mathrm{s^{-2}}$.

For the person of 70 kg one metre to the east of the ring, along the $x$ axis, section 1.4 found

$$\curv{\tE} = \frac{G\matter M}{r^3}\begin{pmatrix} -2 & 0 & 0\\ 0 & 1 & 0\\ 0 & 0 & 1\end{pmatrix}, \qquad \frac{G\matter M}{r^3} = 4.67\times10^{-9}\unit{s^{-2}},$$

where $\sym{mass}{\matter M}$ is the person's mass and $r$ the distance. Each entry below the diagonal of a symmetric
table repeats an entry above it, so the table is fixed by the three entries on its diagonal and the three above it.
These six are its **independent components**, numbers that can each be chosen freely.

The antisymmetric table $\epsilon_{ijk}w_k$ of section 1.1 would give each ball the acceleration
$\vect w\times\vect\xi$, at right angles to the line from the centre, and set the ring turning instead of stretching
it. A tide has no such part.

## In empty space the trace vanishes, and five numbers are left

The **trace** of a table is the sum of its diagonal entries, $T_{kk} = T_{11} + T_{22} + T_{33}$. The trace of the
tide is the Laplacian of the potential, which Poisson's equation ([section 1.3](/tutorial/newton/gauss-and-poisson/))
fixes:

$$\curv{\tE}_{kk} = \nabla^2\field\Phi = 4\pi G\matter\rho .$$

Here $\sym{density}{\matter\rho}$ is the density of mass at the point, in kilograms per cubic metre. In empty space
$\matter\rho = 0$, so the trace is zero, and a table whose trace is zero is called **trace-free**. This is one
condition on the six independent components, since it fixes $\curv{\tE}_{zz} = -\curv{\tE}_{xx} -
\curv{\tE}_{yy}$. So a tide in empty space has $6 - 1 = 5$ independent components. The person's table passes the
check, because $-2 + 1 + 1 = 0$.

A gravitational wave gives a second example.[^wave] A wave travelling along the $z$ axis, in the polarization called
plus, has the table

$$\curv{\tE} = \begin{pmatrix} \curv{\tE}_+ & 0 & 0\\ 0 & -\curv{\tE}_+ & 0\\ 0 & 0 & 0\end{pmatrix},$$

where $\curv{\tE}_+$ is a number in $\mathrm{s^{-2}}$ that oscillates as the wave passes. The trace is zero. When
$\curv{\tE}_+$ is negative the wave stretches the ring along $x$ and squeezes it equally along $y$, and it never acts
along its direction of travel.

A pixel inside water is the non-example: the trace there is
$4\pi G \times 1000\unit{kg\,m^{-3}} = 8.4\times10^{-7}\unit{s^{-2}}$, about ninety times the person's stretch. Such a
pixel needs all six numbers, but the sixth reports only the density at the pixel's own place.

### The same five numbers, counted by axes and strengths

A symmetric table always has three real eigenvalues and three eigenvectors at right angles to one another.[^spectral]
We call their directions the table's **eigen-axes**. Along each the tide is a pure stretch or squeeze, and in these
axes the table is diagonal, as the person's is, with eigenvalues $-2$, $1$ and $1$ in units of $G\matter M/r^3$.

Three axes at right angles take three angles: two point the first axis at a place on the sky, as a latitude and a
longitude do, and one says how far the second axis is turned about the first, which fixes the third. The three
eigenvalues add up to the trace, so in empty space only two are free. Three angles and two strengths make five, the
same five numbers counted in the tide's own axes.

When two eigenvalues are equal, as the person's two squeezes are, any pair of axes at right angles across the line to
the person will do, so the third angle means nothing. The tide of a single point mass therefore uses only three of the
five numbers: two angles for the line to the mass, which fix the line and not the side, and one strength,
$G\matter M/r^3$. A tide whose eigenvalues do not stand in the ratio $-2 : 1 : 1$ cannot come from one mass alone.

## Every symmetric table splits into a part that changes size and a part that changes shape

The Kronecker delta $\delta_{ij}$ of section 1.1 treats every direction alike, so we let a multiple of it carry the
trace of a symmetric table and write

$$T_{ij} = \tau\,\delta_{ij} + U_{ij},$$

with $\tau$ a number and $U_{ij}$ symmetric and trace-free. We take the trace of both sides. The trace of
$\delta_{ij}$ is $\delta_{kk} = 3$ and the trace of $U_{ij}$ is zero, so $T_{kk} = 3\tau$ and $\tau = \tfrac13 T_{kk}$.
Then $U_{ij}$ is whatever remains:

$$\boxed{\;T_{ij} = \tfrac13\,\delta_{ij}\,T_{kk} + \Bigl(T_{ij} - \tfrac13\,\delta_{ij}\,T_{kk}\Bigr).\;} \label{eq:split}$$

The first term is the **trace part** of $T$ and the bracket its **trace-free part**. The split is unique, because the
trace fixed $\tau$.

### What each part does to a ball of dust

Consider a cloud of free grains of dust. We assume that **the grains are at rest** relative to one another at the
instant we look, and that **the cloud is small enough that the tide is the same across it**. Take a box of grains with its edges along the eigen-axes, of lengths $L_1$, $L_2$ and $L_3$. Along an eigen-axis
the rule of section 1.4 becomes $\ddot L_k = -\lambda_k L_k$, with no sum over $k$, where $\lambda_k$ is the
eigenvalue along that edge. We differentiate the volume $V = L_1L_2L_3$ twice with the product rule. Every term with
a first derivative $\dot L_k$ vanishes, because the grains are at rest, and three terms remain:

$$\begin{aligned}
\ddot V &= \ddot L_1L_2L_3 + L_1\ddot L_2L_3 + L_1L_2\ddot L_3\\
&= -(\lambda_1 + \lambda_2 + \lambda_3)\,V .
\end{aligned}$$

The sum of the eigenvalues is the trace, so, for grains at rest,

$$\boxed{\;\frac{\ddot V}{V} = -\curv{\tE}_{kk} = -4\pi G\matter\rho .\;}$$

Only the trace part changes the volume. The trace-free part changes only the shape: a ball of dust beside the person
becomes a cigar that points at the person, with the same volume (Figure [](#fig:split)). At the density of water a cloud starting at rest loses 1 per cent of its volume in about
two and a half minutes, since
$\tfrac12 \times 8.4\times10^{-7}\unit{s^{-2}} \times (154\unit{s})^2 = 0.01$. Beside the person in empty space $\ddot V = 0$ at the start.[^ricci]

![Two small balls of free dust at rest, each with its starting outline dashed. The trace part alone (left) shrinks
the ball and keeps it a ball. The person's table (right) stretches it along $x$ (orange) and squeezes it across
(blue) into a cigar of the same volume. Movements are exaggerated equally.](tut-five-split){#fig:split}

## The five numbers are the components of a vector with its own length

Symmetric trace-free tables add and scale as arrows do, so we can describe them, as section 1.1 described arrows, by
components along unit directions at right angles. We first need a dot product of tables. For two tables $D$ and $T$ it
is the sum of the nine products of their matching entries, $D\!:\!T = D_{ij}\,T_{ij}$, which is called their **contraction**. The **Frobenius norm** of a table is the
square root of its contraction with itself, $\sym{frobenius-norm}{|T|} = \sqrt{T_{ij}T_{ij}}$. It is the length of the
table, in the units of its entries.[^frob]

We choose five tables as the five unit directions and label them with a capital index $A$ from 1 to 5, which counts
tables, not directions in space, and is a label, not a power: $b^2$ is the second table, not $b$ times $b$. We write
$\sym{stf-basis}{b^A_{ij}}$ for the entry in row $i$ and column $j$ of table $A$. Their entries are pure numbers:

$$\begin{aligned}
b^1 &= \tfrac{1}{\sqrt2}\begin{pmatrix} 0&1&0\\ 1&0&0\\ 0&0&0\end{pmatrix}, &
b^2 &= \tfrac{1}{\sqrt2}\begin{pmatrix} 0&0&0\\ 0&0&1\\ 0&1&0\end{pmatrix},\\
b^3 &= \tfrac{1}{\sqrt2}\begin{pmatrix} 0&0&1\\ 0&0&0\\ 1&0&0\end{pmatrix}, &
b^4 &= \tfrac{1}{\sqrt2}\begin{pmatrix} 1&0&0\\ 0&-1&0\\ 0&0&0\end{pmatrix},\\
b^5 &= \tfrac{1}{\sqrt6}\begin{pmatrix} -1&0&0\\ 0&-1&0\\ 0&0&2\end{pmatrix}.
\end{aligned}$$

The first three each fill one pair of places off the diagonal, and the fourth sets $x$ against $y$. The fifth must be
diagonal, trace-free and at right angles to $b^4$. A diagonal table $T$ has $b^4\!:\!T = (T_{xx} - T_{yy})/\sqrt2$,
so the fifth needs $T_{xx} = T_{yy}$, and with the trace zero its diagonal is $(t, t, -2t)$; $t = -1$ sets $z$ against
$x$ and $y$ together.

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
$\tfrac12(\curv{\tE}_{xx} - \curv{\tE}_{yy}) - \tfrac12\curv{\tE}_{zz} = \curv{\tE}_{xx}$ because the trace is
zero, and the $yy$ place likewise. Tables of length one, at right angles to one another, that build
every table of their kind form an **orthonormal basis**. Each of the five, drawn as a ring of free balls, is a basic
pattern of stretch and squeeze (Figure [](#fig:basis)).

![The five basis tables, each drawn as a ring of twelve free balls pushed by that table alone. Each of $b^1$, $b^2$
and $b^3$ squeezes its ring along one diagonal of its plane and stretches it along the other, $b^4$ squeezes along $x$
and stretches along $y$, and $b^5$ squeezes along $z$ twice as hard as it stretches along $x$ and $y$. Orange marks a
stretch and blue a squeeze, at one scale, exaggerated.](tut-five-basis){#fig:basis}

We write the sum as $\curv{\tE}_{ij} = c_B\,b^B_{ij}$, summed over $B$. The number $\sym{stf-coefficient}{c_B}$ is
the **coefficient** of the table along $b^B$, in the units of the table. We contract both sides with $b^A$ and use
[](#eq:basis), which keeps only the term $B = A$:

$$b^A_{ij}\,\curv{\tE}_{ij} = c_B\,b^A_{ij}b^B_{ij} = c_B\,\delta^{AB} = c_A .$$

So each coefficient is the contraction with its basis table. The square of the length follows from
[](#eq:basis) again:

$$\begin{aligned}
|\curv{\tE}|^2 = \curv{\tE}_{ij}\curv{\tE}_{ij} &= c_Ac_B\,b^A_{ij}b^B_{ij}\\
&= c_1^2 + c_2^2 + c_3^2 + c_4^2 + c_5^2 .
\end{aligned}$$

This is the theorem of Pythagoras in five dimensions.

::: example
### The person to the north-east, in five coefficients

Section 1.1 placed the person to the north-east, with $x$ east and $y$ north, and found, in units of
$G\matter M/r^3$,

$$\curv{\tE} = \begin{pmatrix} -\tfrac12 & -\tfrac32 & 0\\ -\tfrac32 & -\tfrac12 & 0\\ 0 & 0 & 1\end{pmatrix}.$$

By [](#eq:general), $c_1 = \sqrt2 \times (-\tfrac32) = -\tfrac{3}{\sqrt2} = -2.12$. The entries $\curv{\tE}_{yz}$ and
$\curv{\tE}_{zx}$ are zero, so $c_2 = c_3 = 0$. Next, $c_4 = \tfrac{1}{\sqrt2}(-\tfrac12 + \tfrac12) = 0$ and
$c_5 = \tfrac{3}{\sqrt6} \times 1 = 1.22$. The sum of squares is $\tfrac92 + \tfrac32 = 6$, and the squares of the
nine entries give $\tfrac14 + \tfrac14 + \tfrac94 + \tfrac94 + 1 = 6$, the same.

The entry $\curv{\tE}_{xy} = -\tfrac32$ and $c_1$ differ by $\sqrt2$, because $b^1$ spreads its coefficient over two
entries. If a random error of the same size $\sigma$ falls on each coefficient, an entry off the diagonal carries
$\sigma/\sqrt2$.[^p-noise] The person due east, $\mathrm{diag}(-2, 1, 1)$, has $c_4 = -3/\sqrt2$ and
$c_5 = 3/\sqrt6$. The move of 45° round the vertical carried $-3/\sqrt2$ from $b^4$ to $b^1$, as the last section
shows.
:::

The length did not change when the person moved, and it never changes when the axes turn. We turn them with the rule
$T' = RTR^{\mathsf T}$ of section 1.1 and use $R_{ik}R_{im} = \delta_{km}$ twice:

$$\begin{aligned}
T'_{ij}T'_{ij} &= R_{ik}R_{jl}T_{kl}\,R_{im}R_{jn}T_{mn}\\
&= \delta_{km}\delta_{ln}\,T_{kl}T_{mn} = T_{kl}T_{kl} .
\end{aligned}$$

The same steps show that $D\!:\!T$ does not change either. So the person's tide has the length
$|\curv{\tE}| = \sqrt6\,G\matter M/r^3 = 1.14\times10^{-8}\unit{s^{-2}}$, 1.22 times its largest stretch. The
Earth's tide at the ground has the length $3.8\times10^{-6}\unit{s^{-2}}$, 330 times the person's.

The contraction with a fixed table $D$ gives one number, as a dot product gives one component. A detector like LIGO, with arms along $x$ and $y$ much shorter than the distance over
which the tide changes, reads (section 1.4) the changing part of $\curv{\tE}_{xx} - \curv{\tE}_{yy}$,
integrated twice in time. This is $D\!:\!\curv{\tE}$ for $D = \mathrm{diag}(1, -1, 0) = \sqrt2\,b^4$, so LIGO reads
one of the five coefficients, $\sqrt2\,c_4$, and nothing of the other four. The thermometer of
[section 13.7](/tutorial/what-a-field-keeps/thermometer/) reads a body's temperature from one such
contraction.[^p-thermo]

::: derivation
### The projector that makes the split in one step, stated in part without proof

The trace-free part of a table can be written with one table of four indices, with $3^4 = 81$ entries, all pure
numbers:

$$\sym{stf-projector}{\Pi_{ijkl}} = \tfrac12\bigl(\delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk}\bigr) - \tfrac13\,\delta_{ij}\delta_{kl} .$$

Applied to any table $T_{kl}$, each delta replaces one index by another:

$$\Pi_{ijkl}\,T_{kl} = \tfrac12\bigl(T_{ij} + T_{ji}\bigr) - \tfrac13\,\delta_{ij}\,T_{kk} .$$

This is the trace-free part, by [](#eq:split), of the symmetric part of $T$, so a second application of $\Pi$
changes nothing and $\Pi$ sends $\delta_{kl}$ to zero: $\Pi$ is a **projector**, as in section 1.1.

We state without proof that $\Pi$ is also the sum $\Pi_{ijkl} = b^A_{ij}\,b^A_{kl}$ over the five basis tables. Two
checks can be done by hand. Applied to a symmetric trace-free table, the right side gives $b^A_{ij}c_A$, the table
itself, as the left side does. The trace over both pairs of indices, with $k = i$ and $l = j$, agrees. On the
left, $\delta_{ii} = 3$ and $\delta_{ij}\delta_{ij} = 3$ give $\Pi_{ijij} = \tfrac12(3\times3 + 3) - \tfrac13\times3 =
5$. On the right, each of the five terms is $b^A_{ij}b^A_{ij} = 1$. The trace counts the five dimensions that $\Pi$ keeps.

The projector appears in the jitter of a black hole. Its quadrupole $Q_{ij}$ is a symmetric trace-free table, in
$\mathrm{kg\,m^2}$, defined so that its energy in a tide is the contraction $Q_{ij}\curv{\tE}_{ij}$ (sections
[11.4](/tutorial/black-holes/under-tides/) and [13.7](/tutorial/what-a-field-keeps/thermometer/)). The quadrupole
jitters, and the average of $Q_{ij}(t)\,Q_{kl}(0)$ is $\Pi_{ijkl}$ times one function of time, built from a spectrum
$S_Q$ in $\mathrm{kg^2\,m^4\,s}$.[^p-hole] With $Q_{ij} = q_A\,b^A_{ij}$, the averaged product of two coefficients is
$b^A_{ij}\Pi_{ijkl}b^B_{kl} = \delta^{AB}$ times that function: the five coefficients jitter with the same spectrum
and any two different ones are uncorrelated.
:::

## Averaged over the sky, the tidal weight vanishes

We now add up the tide of all the matter around a pixel, direction by direction. A unit vector
$\sym{unit-vector}{\hat n}$ points from the pixel toward the matter. The matter in a thin cone of solid angle
$\sym{solid-angle}{\dd\Omega}$ about $\hat n$, between $r$ and $r + \dd r$, has the volume
$r^2\,\dd r\,\dd\Omega$ ([section 1.3](/tutorial/newton/gauss-and-poisson/)). Its mass is
$\dd m = \matter\rho\,r^2\,\dd r\,\dd\Omega$, and by the point-mass table of section 1.4 it adds
$G\,\dd m\,(\delta_{ij} - 3\hat n_i\hat n_j)/r^3$ to the tide, and the $r^2$ cancels two of the three powers of $1/r$.
We assume that **the matter stays clear of the pixel**, beyond a small distance $r_{\min}$, say a quarter of a metre.
Matter at the pixel would add the trace $4\pi G\matter\rho$, which the trace-free weight below cannot give, and the
integral over $r$ would grow like $\ln(1/r_{\min})$ as $r_{\min}$ shrinks. Summing over the whole sky gives

$$\begin{aligned}
\curv{\tE}_{ij} &= G\int\dd\Omega\,\bigl(\delta_{ij} - 3\,\hat n_i\hat n_j\bigr)\,S(\hat n),\\
S(\hat n) &= \int\matter\rho(r\hat n)\,\frac{\dd r}{r} .
\end{aligned} \label{eq:tidal-column-sum}$$

Here $S(\hat n)$ is the **tidal column** in the direction $\hat n$: the mass along that line of sight, each part
weighted by the inverse of its distance. It is measured in $\mathrm{kg\,m^{-3}}$, so $GS$ is in
$\mathrm{s^{-2}}$.[^column] The table $\delta_{ij} - 3\hat n_i\hat n_j$ is the **tidal weight**: it says how matter in
the direction $\hat n$ adds to each entry of the tide.[^p-column] We want its average over the sky.

### The average over the sky, by symmetry and in full

We want $\int \hat n_i\hat n_j\,\dd\Omega$, assuming that **the integral covers the whole sky**, the unit sphere of
section 1.3. The entries off the diagonal vanish. For every direction $(\hat n_x, \hat n_y, \hat n_z)$ the sky holds its mirror
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

Each axis receives one third of the sky, and the tidal weight averages to zero.

So a tidal column that is the same in every direction gives no tide, and a uniform shell of matter around the pixel
is invisible to it. The shell theorem of section 1.3 agrees: inside a hollow uniform shell the pull is zero
everywhere, so its difference between two points, the tide, is zero too.

{{paper fig:sky-integral}}

Panel (b) of the figure colours the sky by the sign of the weight with which matter in each direction enters
$\curv{\tE}_{zz}$, which is $1 - 3\cos^2\vartheta$. The weight is zero where $\cos^2\vartheta = \tfrac13$, at
$\vartheta = 54.7°$. Matter in the two caps within 54.7° of the $z$ axis, 42 per cent of the sky, stretches the ring along $z$; matter in
the band between them squeezes it, and the two balance exactly.

### Patterns of higher degree hold 7, 9 and more numbers

A symmetric table with $\ell$ indices makes the pattern $T_{i_1\cdots i_\ell}\,\hat n_{i_1}\cdots\hat n_{i_\ell}$ on
the sky, and the whole number $\sym{degree}{\ell}$ is its **degree**. Degree 0 is a constant, degree 1 a **dipole**,
larger on one side of the sky than on the other, and degree 2 a **quadrupole**, the same in opposite directions, as
the tidal weight is. Such a table has $(\ell + 1)(\ell + 2)/2$ independent entries. Its traces, which hide patterns
of lower degree (as $\tau\,\delta_{ij}$ makes the constant pattern $\tau$), form a table of degree $\ell - 2$ with
$(\ell - 1)\ell/2$ entries, and removing them leaves $\tfrac12\bigl[(\ell^2 + 3\ell + 2) - (\ell^2 - \ell)\bigr] =
2\ell + 1$ numbers: 1, 3, 5, 7, 9 for $\ell = 0$ to 4. [Section 2.2](/tutorial/outside/spherical-harmonics/) proves
that these conditions are independent and turns the patterns into the spherical harmonics.

A resonant sphere, a ball of metal that rings when a tide squashes it, has
five ways of ringing in its lowest tone, one for each number of $\curv{\tE}$ [@MerkowitzJohnson1995]. A pixel that
records a sky of many independent sources weighs each direction by a pattern of degree four, so it learns the sky's
brightness up to degree four, $1 + 3 + 5 + 7 + 9 = 25$ numbers.[^p-sky] A body's moments, the numbers that describe
how its mass is spread, up to degree twelve number $1 + 3 + \dots + 25 = 13^2 = 169$.

## Across a wave two numbers are left, and a turn of 45° swaps them

A gravitational wave travelling along $z$ acts only across its direction of travel, so its table has zeros in the
third row and column. The rest is a $2\times2$ table in the $xy$ plane, symmetric and trace-free:

$$\curv{\tE} = \begin{pmatrix} \curv{\tE}_+ & \curv{\tE}_\times\\ \curv{\tE}_\times & -\curv{\tE}_+\end{pmatrix}.$$

Two numbers are left, in $\mathrm{s^{-2}}$. The pattern with $\curv{\tE}_\times = 0$ is the plus polarization,
and the pattern with $\curv{\tE}_+ = 0$ is the cross polarization. A **polarization** of a wave is one of these two
basic patterns of stretch and squeeze across its direction.[^lambda]

{{paper fig:tidal}}

Panels (b) and (c) of the figure draw the two patterns on a ring.[^strain] The eigen-axes of the cross table are the
diagonals, so the cross pattern looks like the plus pattern turned by 45°. To see how the two numbers change when the
axes turn, we turn the axes about $z$ by the angle $\theta$, anticlockwise as seen from the side toward which $z$
points. By section 1.1, the rows of $R$ are the new axes, so in the plane $R = \begin{pmatrix}\cos\theta & \sin\theta\\ -\sin\theta & \cos\theta\end{pmatrix}$, and the new table is
$RTR^{\mathsf T}$. Multiplying out the three matrices gives the two entries of the first row:

$$\begin{aligned}
\curv{\tE}'_+ &= \curv{\tE}_+(\cos^2\theta - \sin^2\theta) + 2\curv{\tE}_\times\sin\theta\cos\theta,\\
\curv{\tE}'_\times &= -2\curv{\tE}_+\sin\theta\cos\theta + \curv{\tE}_\times(\cos^2\theta - \sin^2\theta),
\end{aligned}$$

and the second diagonal entry is $-\curv{\tE}'_+$, because the trace stays zero. The double-angle formulas,
$\cos 2\theta = \cos^2\theta - \sin^2\theta$ and $\sin 2\theta = 2\sin\theta\cos\theta$, turn this into

$$\boxed{\;\begin{pmatrix} \curv{\tE}'_+\\ \curv{\tE}'_\times\end{pmatrix} = \begin{pmatrix}\cos 2\theta & \sin 2\theta\\ -\sin 2\theta & \cos 2\theta\end{pmatrix}\begin{pmatrix} \curv{\tE}_+\\ \curv{\tE}_\times\end{pmatrix}.\;} \label{eq:twice}$$

The point $(\curv{\tE}_+, \curv{\tE}_\times)$ turns by $2\theta$ when the axes turn by $\theta$, in the opposite sense
(Figure [](#fig:twice)), while an arrow $(v_x, v_y)$ becomes $R\,\vect v$ and turns by $\theta$ only. In
[section 1.5b](/tutorial/newton/complex-numbers/) the pair becomes one complex number, the shear
$\curv{s} = 2(\curv{\tE}_+ + i\curv{\tE}_\times)$, and [](#eq:twice) is its rule $\curv{s}' = e^{-2i\theta}\curv{s}$.

At $\theta = 45°$, $(\curv{\tE}_+, 0)$ becomes $(0, -\curv{\tE}_+)$: the plus table becomes the cross table with the
opposite sign. At $\theta = 90°$ the point changes sign, because $x$ and $y$ have changed places, and at
$\theta = 180°$ it comes back to itself, while an arrow points the other way and needs 360°. So a pattern of stretch and squeeze
turned by half a circle looks exactly as it did before. Physicists say that gravity has **spin two**, because its
tide turns by twice the angle of the axes, and that light, whose field is an arrow, has spin one.[^spin]

The same rule moves the person. In the $xy$ plane the person due east has the block $\mathrm{diag}(-2, 1)$, in units
of $G\matter M/r^3$, with trace $-1$. In two dimensions $\delta_{kk} = 2$, so the trace part is $\tfrac12$ of the
trace times the identity, here $-\tfrac12$, and the trace-free part is $\mathrm{diag}(-\tfrac32, \tfrac32)$, with
$\curv{\tE}_+ = -\tfrac32$ and $\curv{\tE}_\times = 0$. The identity does not change under a turn, since $RR^{\mathsf T} = 1$. Moving the person anticlockwise to the north-east is the same as turning
the axes by $\theta = -45°$, and [](#eq:twice) gives $\curv{\tE}'_+ = 0$ and $\curv{\tE}'_\times = -\tfrac32$. With
the $-\tfrac12$ put back on the diagonal, this is the table of the worked example. Since $c_4 = \sqrt2\,\curv{\tE}_+$
and $c_1 = \sqrt2\,\curv{\tE}_\times$, the coefficient moved from $b^4$ to $b^1$.

![Left, a ring under the plus table with $\curv{\tE}_+ > 0$, and its axes beside the same axes turned anticlockwise
by $\theta = 30°$. Right, the point $(\curv{\tE}_+, \curv{\tE}_\times)$ in a plane: each marked point is where it
stands after the axes have turned by the angle written beside it.](tut-five-turn){#fig:twice}

### A pixel that also reads the twist records ten numbers

Moving masses add a second kind of tide, the **magnetic part** $\curv{\tB}_{ij}$, in $\mathrm{s^{-2}}$, which
describes how gyroscopes at nearby points turn relative to one another. In empty space it is also symmetric and
trace-free, which [section 7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index)
derives, so it holds five more numbers, and a pixel that reads both parts records ten. In a gravitational wave the
two parts are equal in size, and $\curv{\tB}$ is $\curv{\tE}$ turned by 45° about the direction of travel. Near slowly
moving matter $\curv{\tB}$ is small: for one mass crossing the line of sight at the speed $v_\perp$,
$|\curv{\tB}|/|\curv{\tE}| = \sqrt3\,v_\perp/c$, with $c$ the speed of light (an exercise below), which is
$5.8\times10^{-9}$ for a person walking at $1\unit{m\,s^{-1}}$.[^p-mag]

::: try {#five-numbers}
The figure builds a table from the five coefficients $c_1$ to $c_5$, set with sliders in units of $G\matter M/r^3$,
and shows its push on three rings of free balls, one in each of the planes $xy$, $yz$ and $zx$. It opens on the person
along $x$. Before you move anything, predict whether some setting of the five sliders can make all three rings shrink
at once. Then try it, watching the three eigenvalues and their sum.

Next, load the plus wave along $z$ and turn it into the cross wave with two sliders, $c_4$ down to zero and $c_1$ up
to 2. Last, load the person, move $c_2$ a little, and watch the line "One mass?" change its answer.
:::

**The idea to keep: a symmetric table with no trace holds five numbers, three angles and two strengths. They can be
handled as one vector with its own length, and a pattern of stretch and squeeze turned by 45° becomes the other
polarization, while turned by 180° it becomes itself.**

::: problems
### Practice

**[1.5]** In units of $10^{-9}\unit{s^{-2}}$, a tide has the table
$\begin{pmatrix} 1 & 2 & 0\\ 2 & -3 & 1\\ 0 & 1 & 2\end{pmatrix}$. Check that it is trace-free, find its five
coefficients, and check that their squares add up to the sum of the squares of the nine entries.

::: solution
The trace is $1 - 3 + 2 = 0$. By [](#eq:general), $c_1 = 2\sqrt2 = 2.83$, $c_2 = \sqrt2 = 1.41$, $c_3 = 0$,
$c_4 = (1 + 3)/\sqrt2 = 2.83$ and $c_5 = 3 \times 2/\sqrt6 = 2.45$. Their squares add up to $8 + 2 + 0 + 8 + 6 = 24$,
and the nine entries give $1 + 4 + 0 + 4 + 9 + 1 + 0 + 1 + 4 = 24$, so $|\curv{\tE}| = 4.9\times10^{-9}\unit{s^{-2}}$.
:::

**[1.5]** Write $\mathrm{diag}(1, 2, 3)$ as a trace part plus a trace-free part.

::: solution
The trace is 6, so the trace part is $2\,\delta_{ij}$ and the trace-free part is $\mathrm{diag}(-1, 0, 1)$.
:::

**[1.5]** The person's largest stretch is $9.3\times10^{-9}\unit{s^{-2}}$. What is the length $|\curv{\tE}|$ of the
person's tide?

::: solution
$|\curv{\tE}| = \sqrt6\,G\matter M/r^3 = 1.14\times10^{-8}\unit{s^{-2}}$, which is $\sqrt6/2 = 1.22$ times the
largest stretch.
:::

**[1.5]** By what angle must the axes turn to change a plus pattern into a cross pattern, and by what angle to bring
it back to itself?

::: solution
By 45°, which turns the point $(\curv{\tE}_+, \curv{\tE}_\times)$ by 90°, and by 180°, which turns it by 360°.
:::

### Stretch

**[1.5]** A mass $\matter M$ in the direction $\hat n$ at the distance $r$, moving with velocity $\vect v$, has the
magnetic tide $\curv{\tB}_{ij} = (3G\matter M/cr^3)(\hat n_iu_j + \hat n_ju_i)$, where $\vect u = \hat n\times\vect v$
([section 7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)
derives it). Show that $|\curv{\tB}|/|\curv{\tE}| = \sqrt3\,v_\perp/c$, where $v_\perp = |\vect u|$ is the speed
across the line of sight.

::: solution
Since $\hat n\cdot\vect u = 0$, the tables $\hat n_iu_j$ and $u_i\hat n_j$ have contraction
$(\hat n\cdot\vect u)^2 = 0$, so they are at right angles, and each has length $v_\perp$. Then
$|\curv{\tB}|^2 = 2v_\perp^2\times9\,(G\matter M/cr^3)^2$, while $|\curv{\tE}|^2 = 6\,(G\matter M/r^3)^2$. The
ratio of the squares is $3v_\perp^2/c^2$.
:::

### The camera

**[1.5]** Show that the tidal weight in equation [](#eq:tidal-column-sum) averages to zero over the sky and that the
weight of $\curv{\tE}_{zz}$ changes sign at 54.7°. Then explain why a pixel that sees a tidal column $S(\hat n)$ of
the form $s_0 + \vect s\cdot\hat n$, a constant plus a dipole, reads no tide, and why a single pixel therefore
measures only five numbers, the quadrupole of $S$ over the whole sky.

::: solution
The average is equation [](#eq:sky). The weight $1 - 3\cos^2\vartheta$ vanishes at $\cos\vartheta = 1/\sqrt3$,
$\vartheta = 54.7°$.

The constant gives $Gs_0$ times the average weight, which is zero. The dipole gives
$Gs_k\int(\delta_{ij} - 3\hat n_i\hat n_j)\hat n_k\,\dd\Omega$, whose terms have an odd number of factors of
$\hat n$ and cancel in pairs between $\hat n$ and $-\hat n$.

The weight is $-3$ times the trace-free table $\hat n_i\hat n_j - \tfrac13\delta_{ij}$, so the pixel reads
$\curv{\tE}_{ij} = -3G\int(\hat n_i\hat n_j - \tfrac13\delta_{ij})\,S\,\dd\Omega$, five numbers, the quadrupole
moments of $S$. Patterns of degree 3 and higher give zero ([section 2.2](/tutorial/outside/spherical-harmonics/)).
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) counts the five numbers, and the ten with $\curv{\tB}$; [Section III](/paper/#sec:regimes)
  says that a pattern turned by half a circle looks as it did before.
- Equation [](/paper/#eq:tidal-column) and Figure [](/paper/#fig:sky-integral) are the sky integral; equation
  [](/paper/#eq:magnetic-point) compares $|\curv{\tB}|$ with $|\curv{\tE}|$.
- Equations [](/paper/#eq:thermometer), [](/paper/#eq:speedometer) and [](/paper/#eq:hole-noise) use one contraction,
  noise on the five coefficients, and $\Pi_{ijkl}$.
- [Section VIII](/paper/#sec:one-pixel) and Figure [](/paper/#fig:hair) count 25 sky numbers and 169 moments.
:::

::: deeper
- The GR course on [tidal instruments](https://neovand.github.io/general-relativity/chapter-10.html#what-a-tidal-instrument-measures),
  its [curvature cloud explorer](https://neovand.github.io/general-relativity/chapter-9.html#curvature-cloud-explorer)
  and [section 18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten)
  on why a wave has two polarizations.
- Thorne's review of multipole expansions [@Thorne1980], in its second section, proves the count $2\ell + 1$ in
  general.
:::

[^p-count]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. II](/paper/#sec:pixel).

[^p-noise]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, after its equation
    [](/paper/#eq:speedometer).

[^p-thermo]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equation [](/paper/#eq:thermometer).

[^p-hole]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equation [](/paper/#eq:hole-noise).

[^p-column]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:tidal-column), drawn in its Fig. [](/paper/#fig:sky-integral).

[^p-sky]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:sky-count); its Fig. [](/paper/#fig:hair) counts the 169 moments.

[^p-mag]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:magnetic-point).

[^wave]: [Section 7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)
    derives the tide of a gravitational wave.

[^spectral]: A theorem of linear algebra, used without proof; section 3.4 returns to it.

[^ricci]: The part of the curvature that changes volume is the Ricci curvature, and the part that changes shape is the
    Weyl curvature ([section 7.3](/tutorial/geometry/einstein-equation/)).

[^frob]: After Ferdinand Georg Frobenius; it is the ordinary length of the nine entries as one list.

[^column]: Section 2.3 returns to the tidal column.

[^lambda]: A projector $\Lambda_{ij,kl}(\hat n)$ keeps this symmetric trace-free part across the direction of travel
    ([section 7.6](/tutorial/geometry/gravitational-waves/#one-projector-keeps-what-a-wave-can-carry)). First shown in
    *The gravitational camera* (Mohsenvand 2026), as its equation [](/paper/#eq:wave-zone).

[^strain]: The strains $h_+$ and $h_\times$ in the figure's caption are pure numbers, proportional to the tides in a
    steady wave ([section 7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)).

[^spin]: Section 9.1 returns to spin. First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. III](/paper/#sec:regimes).
