---
id: '7.3'
title: "Einstein's equation; Ricci and Weyl"
question: 'Inside water a pixel reads a trace of the tide of $8.4\times10^{-7}\,\mathrm{s^{-2}}$; in empty space the trace is zero. What ties the curvature at a point to the matter there, and which part of the curvature reaches across empty space?'
part: '7'
requires: ['1.3', '1.5', '6.5', '7.1', '7.2']
paper: [sec:pixel, eq:tidal, eq:magnetic, sec:introduction, sec:one-pixel, sec:vistas, sec:near-field, fig:sky-integral]
figures: []
live: []
depth: B
---

The paper's [Section II](/paper/#sec:pixel) says: "Inside matter the Ricci part of the curvature adds local
information that a pixel in vacuum does not see: the trace $\mathrm{tr}\,\tE = c^2R_{00} = 4\pi G\rho$ in the
Newtonian limit". In water, as chapter
[R1](/tutorial/newton/reading-section-ii/#an-ideal-pixel-reads-ten-numbers-and-must-not-turn) found, the trace is
$8.4\times10^{-7}\unit{s^{-2}}$, ninety times the stretch a metre from the paper's person; in empty space it is zero.
Section VIII's [*Matter at the pixel*](/paper/#par:matter-at-the-pixel) adds that "the pixel reads the density
locally, whatever the matter is".

So we ask what ties the curvature at a point to the matter there, and which part of the curvature reaches across empty
space. Einstein's equation fixes ten of the curvature's twenty numbers at each event from the energy and stress there,
and leaves the other ten, the Weyl curvature, to matter elsewhere. Those ten are what the pixel reads in empty space.

::: plain
Imagine a small ball of dust whose grains the water does not push, inside a large ball of water far from other masses.
The ball shrinks evenly and stays round, because the water's mass pulls every grain inward. A ball of dust in empty
space beside a heavy body keeps its volume and changes its shape: it is stretched toward the body and squeezed across.
The part of the curvature of spacetime that changes the volume is called the Ricci curvature, and the part that changes
only the shape is called the Weyl curvature.

Einstein's equation says that the Ricci curvature at each place is set by the energy and the pressures at that same
place. So a pixel inside matter reads the local density of energy, with the pressures added, whatever the matter is.
Where there is no matter only the Weyl curvature is left. It is made by matter elsewhere, reaches across empty space,
and holds the ten numbers that the paper's pixel records.
:::

## The trace of the tide is the Ricci curvature along the observer's time

We want the part of the curvature that changes the volume of a ball of free dust. By chapter
[1.5](/tutorial/newton/five-numbers/#every-symmetric-table-splits-into-a-part-that-changes-size-and-a-part-that-changes-shape),
a ball of free grains at rest relative to one another changes its volume $V$ at the rate $\ddot V/V =
-\mathrm{tr}\,\curv\tE$, where $\curv\tE_{ij}$ is the tide in $\mathrm{s^{-2}}$ and $\mathrm{tr}\,\curv\tE =
\curv\tE_{kk}$ its trace; the trace-free part changes only the shape. By chapter
[7.2](/tutorial/geometry/curvature-and-tides/#for-an-observer-at-rest-the-drift-is-the-papers-tide), for an observer at rest $\curv\tE_{ij} = c^2\curv R_{0i0j}$, with
$\sym{riemann-lowered}{\curv R}_{\alpha\beta\gamma\delta}$ the Riemann tensor in $\mathrm{m^{-2}}$ and $x^0 = ct$.

Summing the Riemann tensor over its first and third indices leaves a table with two. The **Ricci tensor** is

$$\sym{ricci-tensor}{\curv R}_{\mu\nu} = \curv R^\alpha{}_{\mu\alpha\nu} ,$$

with $\alpha$ summed over its four values, in $\mathrm{m^{-2}}$. By 7.2's pair symmetry $\curv R_{\mu\nu} = \curv
R_{\nu\mu}$, so it holds ten numbers.

**The derivation.** We work at the observer's event in 7.2's falling frame, where the metric is $\field\eta_{\mu\nu}$.
In $\curv R_{00} = \curv R^\alpha{}_{0\alpha0}$ the term $\alpha = 0$ is zero, because the Riemann tensor vanishes when
its last two indices are equal. Raising a spatial index changes no sign (chapter
[6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time)), so $\curv R^i{}_{0i0} =
\curv R_{i0i0}$, and the two antisymmetries, a swap within each pair of indices, give $\curv R_{i0i0} = \curv R_{0i0i}$.
So $\curv R_{00} = \curv R_{0i0i}$, summed over $i$, and

$$\boxed{\;\mathrm{tr}\,\curv\tE = c^2\curv R_{00}\;} \label{eq:trace-ricci}$$

It uses only definitions and holds in any field. By chapter
[1.5](/tutorial/newton/five-numbers/#what-each-part-does-to-a-ball-of-dust), then, $c^2\curv R_{00}$ is the part of the
tide that changes a ball's volume. Beside the person, in empty space, it is zero, though the Riemann tensor is not.

**Newton's law as curvature.** In a static weak field
[7.2](/tutorial/geometry/curvature-and-tides/#near-slow-matter-the-curvature-is-newtons-tide) found $\curv\tE_{ij} = \partial_i\partial_j\field\Phi$, with
$\field\Phi$ the potential in $\mathrm{J\,kg^{-1}}$. Its trace is $\nabla^2\field\Phi = 4\pi G\matter\rho$ by chapter
[1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point)'s Poisson equation, with
$\sym{density}{\matter\rho}$ the density in $\mathrm{kg\,m^{-3}}$. So Newton's law of gravity says

$$c^2\curv R_{00} = 4\pi G\matter\rho . \label{eq:newton-ricci}$$

Both sides are in $\mathrm{s^{-2}}$. In water $4\pi G\matter\rho = 8.4\times10^{-7}\unit{s^{-2}}$, so $\curv R_{00} =
9.3\times10^{-24}\unit{m^{-2}}$. At the Earth's mean density, $5513\unit{kg\,m^{-3}}$, the trace is
$4.6\times10^{-6}\unit{s^{-2}}$.

**What it means.** The trace of the tide is the Ricci curvature along the observer's time, and Newton's law ties it to
the density at the same point.

## Einstein's equation ties the curvature to the energy and stress at each point

We want a law for every observer that gives [](#eq:newton-ricci) when the field is weak and the matter slow. Einstein's
equation is that law. We state it without proof (the GR course's chapter 14 derives it from an action, a number built
from the metric over a region of spacetime that the true field leaves unchanged when varied a little), but we show why
it has its form and derive its factor. Three requirements fix it.

**A tensor equation.** The density in [](#eq:newton-ricci) is $\matter T^{00}/c^2$, one entry of chapter 6.5's
stress–energy tensor $\sym{stress-energy-tensor}{\matter T}^{\mu\nu}$, in $\mathrm{J\,m^{-3}}$. A moving observer mixes
the entries, so to hold in every frame (chapter
[6.2](/tutorial/relativity/spacetime-vectors/#a-tensor-is-a-table-whose-every-index-changes-with-the-boost)) the law
must link a whole curvature table with two indices to the whole of $\matter T_{\mu\nu}$. Here $\matter T_{\mu\nu}$ has
both indices lowered by the metric $\field g_{\mu\nu}$, so at the observer's event $\matter T_{00} = \matter T^{00}$,
$\matter T_{0i} = -\matter T^{0i}$ and $\matter T_{ij} = \matter T^{ij}$, the momentum flux
([6.5](/tutorial/relativity/stress-energy/#in-the-stresses-the-sign-is-that-of-a-flow-of-momentum)'s sign: a pressure is
positive).

**Energy and momentum conserved.** In curved spacetime 6.5's law becomes $\nabla_\mu\matter T^{\mu\nu} = 0$, with 7.2's
covariant derivative (one Christoffel term for each index). So the left side must have zero divergence for every metric,
as an identity, or the equation would add a condition on the matter's motion beyond its own law.

**Newton's law in the limit**, [](#eq:newton-ricci).

The guess $\curv R_{\mu\nu} = k\matter T_{\mu\nu}$, with a constant $k$, fails the second requirement, because the
curvature obeys the **contracted Bianchi identity** (the box below),

$$\nabla^\mu\curv R_{\mu\nu} = \tfrac12\,\partial_\nu\curv R ,$$

where $\nabla^\mu = \field g^{\mu\alpha}\nabla_\alpha$ and the **Ricci scalar** $\sym{ricci-scalar}{\curv R} = \field
g^{\mu\nu}\curv R_{\mu\nu}$, in $\mathrm{m^{-2}}$, is the trace of the Ricci tensor. The guess would need $\partial_\nu\curv R = 0$, and since $\curv R = k\matter T$, the
trace $\sym{stress-energy-trace}{\matter T} = \field g_{\mu\nu}\matter T^{\mu\nu}$ of the stress–energy tensor[^T]
would be the same everywhere. It is not: $\matter T = -\matter\rho c^2$ inside a ball of dust and zero outside.

Every other sum of the Riemann tensor over two of its indices is zero or $\pm\curv R_{\mu\nu}$, so the tables with two
indices that are linear in the curvature, as [](#eq:newton-ricci) is, are $\curv R_{\mu\nu}$ and $\curv R\,\field
g_{\mu\nu}$. The covariant derivative of the metric is zero, so by the identity $a\curv R_{\mu\nu} + b\curv R\,\field
g_{\mu\nu}$ has the divergence $(a/2 + b)\,\partial_\nu\curv R$, which vanishes for every metric only if $b = -a/2$. So
the left side is a multiple of the **Einstein tensor**

$$\sym{einstein-tensor}{\curv G}_{\mu\nu} = \curv R_{\mu\nu} - \tfrac12\curv R\,\field g_{\mu\nu} ,\qquad
\nabla^\mu\curv G_{\mu\nu} = 0 ,$$

in $\mathrm{m^{-2}}$.[^G] **Einstein's equation** sets it in proportion to the energy and stress at the same event:

$$\boxed{\;\curv G_{\mu\nu} = \frac{8\pi G}{c^4}\,\matter T_{\mu\nu}\;} \label{eq:einstein}$$

Both sides are symmetric, so these are ten equations.

::: gap
**The contracted Bianchi identity.** Chapter 7.2 stated the second Bianchi identity in a falling frame, with partial
derivatives. In any coordinates they become covariant ones (stated), $\nabla_\sigma\curv R_{\alpha\beta\gamma\delta} +
\nabla_\gamma\curv R_{\alpha\beta\delta\sigma} + \nabla_\delta\curv R_{\alpha\beta\sigma\gamma} = 0$. We multiply by
$\field g^{\alpha\gamma}$ and sum, which passes through $\nabla$ because $\nabla\field g = 0$. The terms become
$\nabla_\sigma\curv R_{\beta\delta}$, $\nabla^\alpha\curv R_{\alpha\beta\delta\sigma}$ and, after exchanging the last
two indices, $-\nabla_\delta\curv R_{\beta\sigma}$. We multiply by $\field g^{\beta\delta}$ and sum; by the antisymmetry
in the first pair the middle term gives $-\nabla^\alpha\curv R_{\alpha\sigma}$. So $\partial_\sigma\curv R -
2\nabla^\mu\curv R_{\mu\sigma} = 0$, which is $\nabla^\mu\curv G_{\mu\sigma} = 0$.

The box proves neither the second Bianchi identity, nor $\nabla\field g = 0$, nor Lovelock's theorem (1971). That
theorem takes a symmetric table with two indices and zero divergence, built from the metric and its first two
derivatives in four dimensions, and shows that it can only be $a\curv G_{\mu\nu} + b\field g_{\mu\nu}$ with constants
$a$ and $b$.
:::

**Trace reversal.** We multiply [](#eq:einstein) by $\field g^{\mu\nu}$ and sum. Since $\field g^{\mu\nu}\field
g_{\mu\nu} = 4$, the left side gives $\curv R - 2\curv R$, so $-\curv R = (8\pi G/c^4)\matter T$. We put this into
$\curv R_{\mu\nu} = \curv G_{\mu\nu} + \tfrac12\curv R\,\field g_{\mu\nu}$:

$$\boxed{\;\curv R_{\mu\nu} = \frac{8\pi G}{c^4}\Bigl(\matter T_{\mu\nu} - \tfrac12\matter T\,\field
g_{\mu\nu}\Bigr)\;} \label{eq:trace-reversed}$$

This is **trace reversal**: the same ten equations, solved for the Ricci tensor. The bracket is $\matter T_{\mu\nu}$
with its trace reversed, since its trace is $\matter T - 2\matter T = -\matter T$.

**The factor.** Suppose the constant were an unknown $k$. For dust at rest, $\matter T_{00} = \matter\rho c^2$, $\matter
T = -\matter\rho c^2$ (6.5's trace of a fluid, with no pressure) and $\field g_{00} = -1$ to lowest order, so

$$\curv R_{00} = k\bigl(\matter\rho c^2 - \tfrac12\matter\rho c^2\bigr) = \tfrac12 k\matter\rho c^2 .$$

Newton's [](#eq:newton-ricci) needs $\tfrac12k\matter\rho c^4 = 4\pi G\matter\rho$, so $k = 8\pi G/c^4$: the $4\pi$ of
Gauss's law times the 2 that undoes the half.

**A number.** The factor $8\pi G/c^4 = 2.1\times10^{-43}\unit{N^{-1}}$ turns an energy density, in $\mathrm{J\,m^{-3}} =
\mathrm{N\,m^{-2}}$, into a curvature in $\mathrm{m^{-2}}$.[^stiff] Water's rest energy density is $\matter\rho c^2 =
9.0\times10^{19}\unit{J\,m^{-3}}$, and trace reversal keeps half of it, as above:

$$\begin{aligned}\curv R_{00} &= \frac{8\pi G}{c^4}\bigl(\matter T_{00} - \tfrac12\field g_{00}\matter T\bigr)\\
&= \frac12\,\frac{8\pi G}{c^4}\,\matter\rho c^2 = 9.3\times10^{-24}\unit{m^{-2}} ,\end{aligned}$$

half the product of the two numbers, and the last section's value. **A limit:** with no energy or stress, $\curv
R_{\mu\nu} = 0$, the vacuum equation.

::: history
### November 1915

Einstein presented the final equation to the Prussian Academy of Sciences on 25 November 1915, the last of four weekly
talks. David Hilbert had presented a theory derived from an action in Göttingen five days earlier; his paper was revised
before it was printed on 31 March 1916. Einstein added the cosmological constant in 1917.
:::

## Pressure and stress gravitate

We want the trace of the tide for any matter, because the paper's *Matter at the pixel* gives it "in full". We work at
the pixel's event in its frame, where the metric is $\field\eta_{\mu\nu}$, and assume nothing about the strength of the
field. As in Section II, **the pixel's frame does not turn**. Then $\field g_{00} = -1$ and $\matter T = -\matter
T^{00} + \matter T^{11} + \matter T^{22} + \matter T^{33}$, so [](#eq:trace-reversed) gives

$$\begin{aligned}\curv R_{00} &= \frac{8\pi G}{c^4}\Bigl(\matter T^{00} + \tfrac12\matter T\Bigr)\\
&= \frac{4\pi G}{c^4}\bigl(\matter T^{00} + \matter T^{11} + \matter T^{22} + \matter T^{33}\bigr) .\end{aligned}$$

We write the energy density as $\matter T^{00} = \matter\rho c^2$, so that $\matter\rho$ is the mass density that the
pixel measures (chapter [6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight)).
For matter at rest relative to the pixel, the diagonal of the momentum flux adds up to the sum of its eigenvalues, the
**principal stresses** $\sym{principal-stresses}{\matter p_a}$, positive for a pressure and negative for a tension. With
[](#eq:trace-ricci),

$$\boxed{\;\mathrm{tr}\,\curv\tE = 4\pi G\Bigl(\matter\rho + \frac{\matter p_1 + \matter p_2 + \matter
p_3}{c^2}\Bigr)\;} \label{eq:active}$$

the paper's formula, with $3\matter p$ for a fluid. The paper adds "less $2\Omega^2$ if the pixel's frame turns" at the
angular rate $\Omega$, in $\mathrm{rad\,s^{-1}}$. We call $\matter\rho + \Sigma\matter p/c^2$ the **active density**,
the density that a pixel inside the matter reads. For dust it is [](#eq:newton-ricci).

**Chapter 6.5's source, derived.** In a static weak field the first section gives $c^2\curv R_{00} =
\mathrm{tr}\,\curv\tE = \nabla^2\field\Phi$, so the display above becomes 6.5's
[source](/tutorial/relativity/stress-energy/#what-gravitates-is-the-energy-plus-the-sum-of-the-stresses),
$\nabla^2\field\Phi = (4\pi G/c^2)(\matter T^{00} + \matter T^{11} + \matter T^{22} + \matter T^{33})$. The trace
[](#eq:active) itself holds in any field.

**Numbers.** The pressure raises the active density by $3\matter p/\matter\rho c^2 = 3.4\times10^{-15}$ in water at
one atmosphere, $9.3\times10^{-10}$ at the Earth's centre ($\matter p = 364\unit{GPa}$, $\matter\rho =
13\,100\unit{kg\,m^{-3}}$) and $5.6\times10^{-6}$ at the Sun's, as in 6.5. A gas of light of energy density
$\matter{\mathcal U}$ has $\Sigma\matter p = \matter{\mathcal U}$, so $\mathrm{tr}\,\curv\tE = 8\pi G\matter{\mathcal
U}/c^2$, twice what its energy alone gives. A beam of energy flux $F$, in $\mathrm{W\,m^{-2}}$, is 6.5's **null
dust**, with $\matter T^{00} = \matter T^{zz} = F/c$ along $z$, so it gives $8\pi GF/c^3$, the paper's trace "where
radiation streams through": $8.5\times10^{-32}\unit{s^{-2}}$ in sunlight at the Earth, $1361\unit{W\,m^{-2}}$.

Yet a sealed hot box, seen from far away, weighs only its energy over $c^2$, because its walls' tension cancels the
gas's pressure over the whole box (chapter
[6.5](/tutorial/relativity/stress-energy/#the-stresses-of-a-body-at-rest-add-up-to-zero)'s von Laue theorem).

**Dark matter and the Casimir gap.** The dark matter round the Sun, $0.4\unit{GeV\,cm^{-3}} =
6.4\times10^{-5}\unit{J\,m^{-3}}$, is a mass density of $7.1\times10^{-22}\unit{kg\,m^{-3}}$ with negligible pressure,
so $\mathrm{tr}\,\curv\tE = 6.0\times10^{-31}\unit{s^{-2}}$, "by its mass alone". Between plates a micrometre apart,
6.5's Casimir energy density is $\sym{casimir-energy-density}{u} = -4.3\times10^{-4}\unit{J\,m^{-3}}$, with the
momentum flux $3u$ across the plates and $-u$ along each of the other two directions. So $\Sigma\matter p = u$, and
$\mathrm{tr}\,\curv\tE = 8\pi Gu/c^2 = -8.1\times10^{-30}\unit{s^{-2}}$: negative, so a ball of free dust there would
swell.

**The cosmological constant.** Since $\nabla\field g = 0$, adding $\Lambda\field g_{\mu\nu}$ to the left side keeps
the first two requirements, and the third while $\Lambda$ is small:

$$\curv G_{\mu\nu} + \Lambda\field g_{\mu\nu} = \frac{8\pi G}{c^4}\matter T_{\mu\nu} .$$

Here $\sym{cosmological-constant}{\Lambda}$ is the **cosmological constant**, about $1.1\times10^{-52}\unit{m^{-2}}$
from the expansion of the universe (stated).[^Lambda] The trace now gives $\curv R = 4\Lambda - (8\pi G/c^4)\matter
T$, so the trace-reversed form gains $+\Lambda\field g_{\mu\nu}$, and with $\field g_{00} = -1$ the trace of the tide
gains $-\Lambda c^2 = -1.0\times10^{-35}\unit{s^{-2}}$ everywhere, the paper's number.

<!-- diagram: tut-einstein-traces — One panel, about 640 × 360 px at 1440 (full width on a phone, labels then above
each bar). A horizontal bar chart of |tr 𝓔| on a logarithmic axis from 10⁻³⁶ to 10⁻⁵ s⁻², one bar per row, in this
order, values to two figures: "the Earth's mean density" 4.6 × 10⁻⁶; "water" 8.4 × 10⁻⁷; "Casimir gap, 1 µm"
−8.1 × 10⁻³⁰; "dark matter round the Sun" 6.0 × 10⁻³¹; "sunlight at the Earth" 8.5 × 10⁻³²; "cosmological constant"
−1.0 × 10⁻³⁵. Positive traces as solid bars in the matter colour (sunlight in the light colour); the two negative ones
as outlined, thinly hatched bars, the value printed with its minus sign, and a small legend "outlined: negative trace
(a ball of dust swells)". A thin vertical dotted line at 9.3 × 10⁻⁹ s⁻² labelled at its top "the person's stretch at
1 m". Labels left of the bars, values right of them, never on the bars. Caption: "Look first at the two outlined bars:
the negative energy between the Casimir plates and the cosmological constant make the trace of the tide negative.
Every bar is tr 𝓔 = 4πG(ρ + Σp/c²) − Λc² for its matter; the scale is logarithmic and spans thirty orders of
magnitude." -->

## Inside matter the tide has a part fixed by the matter at that point

We want the whole tide inside matter, because the paper's neutrinos squeeze the camera across their direction only,
which changes its shape as well as its volume.

The Riemann tensor splits in one way into the **Ricci part** of the curvature, built from the Ricci tensor and the
metric, and a remainder, the **Weyl tensor** $\sym{weyl-tensor}{\curv C}_{\alpha\beta\gamma\delta}$, in
$\mathrm{m^{-2}}$, which has every symmetry of the Riemann tensor and whose every sum over a pair of indices vanishes
(the box below).[^C] Einstein's equation fixes the Ricci part from the energy and stress at the same event, and not the
Weyl tensor.

::: gap
**The Weyl tensor.** In four dimensions

$$\begin{aligned}\curv C_{\alpha\beta\gamma\delta} &= \curv R_{\alpha\beta\gamma\delta} - \tfrac12\bigl(\field
g_{\alpha\gamma}\curv R_{\beta\delta} - \field g_{\alpha\delta}\curv R_{\beta\gamma}\\
&\qquad - \field g_{\beta\gamma}\curv R_{\alpha\delta} + \field g_{\beta\delta}\curv R_{\alpha\gamma}\bigr)\\
&\quad + \tfrac16\curv R\bigl(\field g_{\alpha\gamma}\field g_{\beta\delta} - \field g_{\alpha\delta}\field
g_{\beta\gamma}\bigr) .\end{aligned}$$

Each term has the symmetries of the Riemann tensor. Multiplying by $\field g^{\alpha\gamma}$ and summing, the three
terms give $\curv R_{\beta\delta}$, then $-\curv R_{\beta\delta} - \tfrac12\field g_{\beta\delta}\curv R$, then
$+\tfrac12\field g_{\beta\delta}\curv R$: zero. The coefficients $\tfrac12$ and $\tfrac16$ are the only ones that do
this, so the split is unique.
:::

**The tide splits the same way.** We solve the box's formula for the Riemann tensor and set $\alpha = \gamma = 0$,
$\beta = i$ and $\delta = j$, with $\field g_{00} = -1$, $\field g_{0i} = 0$ and $\field g_{ij} = \delta_{ij}$.
Multiplied by $c^2$, this splits the tide into a Weyl part and a Ricci part:

$$\begin{aligned}\curv\tE_{ij} = c^2\curv R_{0i0j} &= c^2\curv C_{0i0j}\\ &\quad + c^2\Bigl[\tfrac12\bigl(\delta_{ij}\curv
R_{00} - \curv R_{ij}\bigr) + \tfrac16\curv R\,\delta_{ij}\Bigr] .\end{aligned}$$

The second line is the Ricci part, $\curv\tE^{\rm Ricci}_{ij}$. The Weyl part has no trace, for the reason of the first
section: its sum over $i$ is $c^2\curv C^\alpha{}_{0\alpha0}$, because the term $\alpha = 0$ is zero, and every such sum
of the Weyl tensor vanishes. So the Ricci part carries the whole trace, $c^2\curv R_{00}$. We put in $\curv R_{00}$,
$\curv R_{ij}$ and $\curv R$ from [](#eq:trace-reversed) (the *Derivation in full* below) and find

$$\boxed{\;\begin{aligned}\curv\tE^{\rm Ricci}_{ij} &= \frac{4\pi G}{3}\Bigl(\matter\rho + \frac{\Sigma\matter
p}{c^2}\Bigr)\delta_{ij}\\ &\quad - \frac{4\pi G}{c^2}\Bigl(\matter T_{ij} - \tfrac13\delta_{ij}\matter
T_{kk}\Bigr) ,\end{aligned}\;} \label{eq:ricci-tide}$$

with $\Sigma\matter p = \matter T_{kk}$. The first term is an even squeeze, a third of the trace in every direction.
The second is the trace-free part of the stress, which changes the shape.

::: derivation
### The Ricci part of the tide, term by term

At the pixel's event, with $\matter T_{00} = \matter\rho c^2$ and $\matter T = -\matter\rho c^2 + \matter T_{kk}$,
[](#eq:trace-reversed) and $\curv R = -(8\pi G/c^4)\matter T$ give

$$\begin{aligned}
\curv R_{00} &= \frac{4\pi G}{c^4}\bigl(\matter\rho c^2 + \matter T_{kk}\bigr) ,\\
\curv R_{ij} &= \frac{8\pi G}{c^4}\Bigl[\matter T_{ij} + \tfrac12\bigl(\matter\rho c^2 - \matter T_{kk}\bigr)\delta_{ij}\Bigr] ,\\
\curv R &= \frac{8\pi G}{c^4}\bigl(\matter\rho c^2 - \matter T_{kk}\bigr) .
\end{aligned}$$

In the bracket of the Ricci part, the terms in $\delta_{ij}$ collect to $(4\pi G/c^4)\,\delta_{ij}$ times

$$\begin{aligned}&\tfrac12(\matter\rho c^2 + \matter T_{kk}) - \tfrac12(\matter\rho c^2 - \matter T_{kk}) +
\tfrac13(\matter\rho c^2 - \matter T_{kk})\\ &\quad = \tfrac13\matter\rho c^2 + \tfrac23\matter T_{kk} ,\end{aligned}$$

and the remaining term is $-(4\pi G/c^4)\matter T_{ij}$. Writing $\matter T_{ij} = (\matter T_{ij} -
\tfrac13\delta_{ij}\matter T_{kk}) + \tfrac13\delta_{ij}\matter T_{kk}$ turns the $\delta_{ij}$ terms into
$\tfrac13(\matter\rho c^2 + \matter T_{kk})$. Multiplying by $c^2$ gives [](#eq:ricci-tide).
:::

**A check: a uniform ball.** For dust $\matter T_{ij} = 0$, so $\curv\tE^{\rm Ricci}_{ij} = \tfrac{4\pi
G}3\matter\rho\,\delta_{ij}$. That is the whole tide inside a uniform ball, the second derivatives of chapter
[1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)'s interior potential
$\tfrac{2\pi}3G\matter\rho\,r^2$, so there the Weyl part is zero.

**A check: a beam.** Null dust along $\hat n$ with the energy flux $F$ has, in the pixel's frame, $\matter\rho c^2 =
\matter T_{kk} = F/c$ and $\matter T_{ij} = (F/c)\hat n_i\hat n_j$. Then [](#eq:ricci-tide) gives

$$\begin{aligned}\curv\tE^{\rm Ricci}_{ij} &= \frac{4\pi GF}{c^3}\Bigl[\tfrac23\delta_{ij} - \bigl(\hat n_i\hat n_j -
\tfrac13\delta_{ij}\bigr)\Bigr]\\ &= \frac{4\pi GF}{c^3}\bigl(\delta_{ij} - \hat n_i\hat n_j\bigr) ,\end{aligned}$$

an even squeeze across the beam and none along it. Neutrinos from a star of luminosity $L$, in watts, at the distance
$r$ have $F = L/4\pi r^2$, so $\curv\tE^{\rm Ricci}_{ij} = (GL/c^3r^2)(\delta_{ij} - \hat n_i\hat n_j)$, the tide of
the paper's [*An exploding star*](/paper/#par:an-exploding-star) that chapter 6.5 promised. A core collapse sending
$3\times10^{46}\unit{J}$ over about ten seconds has $L = 3\times10^{45}\unit{W}$. From ten kiloparsecs
($3.09\times10^{20}\unit{m}$) its flux, $2500\unit{W\,m^{-2}}$, is about twice sunlight's, and its squeeze is
$7.8\times10^{-32}\unit{s^{-2}}$.

**What it means.** Through the Ricci part, a pixel inside matter reads the energy and stress at its own place: the
"local information that a pixel in vacuum does not see". In the words of the paper's [*What breaks the
tie*](/paper/#par:what-breaks-the-tie), it "reads the density where the pixel is".

## In empty space only the Weyl curvature is left, and it holds ten numbers

Where there is no energy or stress, $\curv R_{\mu\nu} = 0$ and $\curv R = 0$, so the Riemann tensor is the Weyl
tensor. We read these ten equations for the observer at rest, sorted by time indices as in
[7.2](/tutorial/geometry/curvature-and-tides/#the-pixel-reads-six-of-the-twenty-numbers-and-the-magnetic-part-eight-more).

- The condition $\curv R_{00} = 0$ is $\mathrm{tr}\,\curv\tE = 0$, by [](#eq:trace-ricci): the tide is trace-free, as R1 read in
  Section II's "In vacuum both are symmetric and trace-free". One condition.
- The conditions $\curv R_{0k} = 0$ are three. With $\epsilon_{ijk}\epsilon_{ipq} = \delta_{jp}\delta_{kq} -
  \delta_{jq}\delta_{kp}$ and the pair symmetry, the paper's [](/paper/#eq:magnetic) gives
  $\epsilon_{kij}\curv\tB_{ij} = c^2\curv R_{0k}$. The left side holds the antisymmetric part of $\curv\tB$, so in
  vacuum $\curv\tB$ is symmetric. Its trace is zero in any case, by 7.2's cyclic identity.
- The conditions $\curv R_{ij} = 0$ are six. Since $\curv R_{ij} = -\curv R_{0i0j} + \curv R_{kikj}$, they fix
  $\curv R_{kikj} = \curv\tE_{ij}/c^2$. The six numbers $\curv R_{ijkl}$ have the symmetries of a curvature in three
  dimensions, and there such a table is fixed by its six sums $\curv R_{kikj}$ (stated: in three dimensions a Weyl
  tensor has $6 - 6 = 0$ numbers). So the tide sets the curvature of space.

Of 7.2's $6 + 8 + 6 = 20$ numbers these remove $1 + 3 + 6$, and $5 + 5 + 0 = 10$ remain, the Weyl tensor's: the five
of a symmetric trace-free $\curv\tE$ and the five of a symmetric trace-free $\curv\tB$, each one of chapter 1.5's
tables of five. They are Section II's "ten numbers".

<!-- diagram: tut-einstein-twenty — One panel, about 560 × 260 px at 1440 (full width on a phone). Chapter 7.2's row of
twenty small squares in three blocks (6, 8, 6), outlined in thin ink and labelled below "R₀ᵢ₀ⱼ: 𝓔 (6)", "R₀ᵢⱼₖ: 𝓑
(8)", "Rᵢⱼₖₗ (6)". Recoloured: in the first block 1 square filled in the matter colour and 5 in the curvature colour;
in the second, 3 in the matter colour and 5 in the curvature colour; in the third, all 6 in the matter colour. Above
the row two brackets: a dotted one that jumps the gaps over the ten matter-coloured squares, labelled "Ricci: fixed by
the matter at the point (10)", and one over the ten curvature-coloured squares, labelled "Weyl: from matter elsewhere
(10)". Under the matter-coloured squares of each block, small labels "tr 𝓔", "𝓑's antisymmetric part", "fixed by 𝓔
in vacuum". Below the row: "empty space: the Ricci squares are zero, and 5 + 5 = 10 are left". Labels never on the
squares. Caption: "Look first at the colours: Einstein's equation fixes ten of the twenty curvature numbers from the
energy and stress at the point (the trace of the tide, the antisymmetric part of the magnetic part, and the six of the
curvature of space), and leaves the Weyl tensor's ten, five in 𝓔 and five in 𝓑." -->

**What it means.** The Ricci part changes the volume of a ball of free dust and is set by the matter at that point,
as chapter 1.5's margin promised. The Weyl part changes the shape and not the volume. Nothing at the point sets it: it
comes from matter elsewhere, and from gravitational waves (chapter 7.6).

So a pixel in empty space images the matter around it through the Weyl part. In a weak static field that part sums
distant matter with the weight of the paper's Figure [](/paper/#fig:sky-integral), which averages to zero over the sky
([1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes)), so a uniform shell round the
pixel gives none.

<!-- diagram: tut-einstein-three-balls — Three panels side by side, each about 300 × 280 px at 1440 (stacked on a
phone), each a ball of free dust drawn as a dashed ink circle (the start) and a solid ink outline (a little later,
deformation exaggerated by the same stated factor in all three, about 30 per cent), with a few dots on the outline.
(a) "inside water, far from other masses": a faint blue-grey wash fills the panel; the solid outline is a smaller circle, with short inward
arrows in the curvature colour, all of equal length; under it "volume shrinks, shape kept: Ricci". (b) "beside a mass
in empty space": a stone sphere at the panel's left edge; the solid outline is an ellipse longer along the line to the
sphere (orange tint at its two ends) and narrower across (blue tint at the sides), of the same area as the dashed
circle; under it "shape changes, volume kept: Weyl". (c) "inside a neutrino beam": three thin parallel lines in the
light colour crossing the panel horizontally, with an arrowhead and the label "beam"; the solid outline an ellipse
narrower across the beam (blue tint) and unchanged along it; under it "squeezed across the beam only: Ricci, from
stress". Labels beside the geometry, never on lines. Caption: "Look first at the outlines against the dashed circles:
inside water far from other masses the ball shrinks and stays round, beside a mass it keeps its volume and changes shape, and inside a beam
it is squeezed across the beam alone. The first and third are the Ricci part, set by the matter at the ball; the
second is the Weyl part, set by the mass elsewhere. The deformations are exaggerated." -->

## A single mass stretches twice as hard as it squeezes, in Einstein's theory too

We want the tide of one round mass from Einstein's equation, as chapters R1 and 7.2 promised.

**The ratio, exactly.** For an observer at rest outside a round body that does not turn, the tide is trace-free by the
last section, and the same in every direction across the line to the body. So its eigenvalues are $-2a$ along the line
and $a$ twice across it, for some $a$: the ratio $-2 : 1 : 1$ follows from the vacuum equation and the symmetry alone,
in any field.

**The size, to first order.** In a weak static field $\nabla^2\field\Phi = c^2\curv R_{00} = 0$ outside the mass, and
the round solution that vanishes far away is chapter 1.3's $\field\Phi = -G\matter M/r$, so $a = G\matter M/r^3$
([1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)). A metre
from the paper's 70 kg person the eigenvalues are $-9.3\times10^{-9}\unit{s^{-2}}$ along the line and
$4.7\times10^{-9}\unit{s^{-2}}$ twice across it.

**The size, exactly (stated).** Schwarzschild's exact solution of 1916 (chapter 11.1) gives an observer at rest $a =
G\matter M/r^3$ exactly, with $r$ the circumference of the circle through the observer, centred on the body, over
$2\pi$.

## The ten equations are not ten laws of motion

The ten equations do not each move the field forward in time. Four of them, $\curv G^{0\nu} = (8\pi G/c^4)\matter
T^{0\nu}$, hold no second derivative of the metric in time; they are **constraints**, which tie the field at one time to
the energy and momentum then, as Gauss's law does for the mass (stated without proof). Chapter 7.4 takes up the rest of
the equation for a weak field, where it becomes a wave equation.

<!-- try: ricci-weyl (a new interactive figure, RicciWeyl, not yet built; a port of the GR course's
curvature-cloud-explorer, chapter-9.html#curvature-cloud-explorer, Ricci against Weyl) — One panel, about 640 × 460 px
at 1440 (full width on a phone, controls below the drawing). Left: a ball of 200 free test masses (small dots in the
observer colour) in a slice through its centre, the starting circle dashed and the ball drawn after a fixed time, its
deformation exaggerated by a stated factor ("drawn ×N"). Each grain moves by ξ(t) = ξ₀ − ½𝓔ξ₀t² with
𝓔 = 𝓔^Ricci + 𝓔^Weyl. Controls: a slider "density of the medium" from 0 to 20 000 kg m⁻³ with stops at 0 (empty),
1000 (water) and 5513 (the Earth's mean); a slider "pressure" from 0 to 0.3ρc² (its effect drawn ×10¹⁴ when below
10⁻¹⁰ρc², stated beside it; the readout gives the true value); a slider "beam flux F" from 0 to 10⁴ W m⁻² with a stop
at 1361 (sunlight) and a dial for the beam's direction in the slice; a slider "mass outside" from 0 to 10⁴ kg and a
slider "its distance" from 0.5 to 5 m, the mass drawn as a stone disc at the slice's edge. The medium's, the beam's
and the mass's tides are drawn on one stated display scale. Readouts to two figures: tr 𝓔 in s⁻²
(4πG(ρ + Σp/c²) + 8πGF/c³); "volume changes at V̈/V = −tr 𝓔"; the size of the trace-free part in s⁻², split into
"Weyl (from the mass outside)" and "Ricci (from the beam and the pressure)". Opens inside water with a 1000 kg mass at
2 m: the ball shrinks and is drawn slightly elongated toward the mass. Predict first: "Put the ball inside water with
nothing else nearby. Does it change its shape, its size, or both?" (Answer: only its size; the trace is
8.4 × 10⁻⁷ s⁻² and the trace-free part is zero.) Then: "Take it out of the water and bring a mass near. What changes
now?" (Answer: only its shape; the trace is zero and the trace-free part is the Weyl part, −2 : 1 : 1.) Then: "Turn on
a beam of light through it. Along which directions is it squeezed?" (Answer: across the beam only, by 4πGF/c³ in each
direction; nothing along it.) Keyboard: Tab reaches every slider and the dial, arrows step them, shift for larger
steps; both themes; phone; static on reduced motion (the ball drawn at its final shape). -->

::: check
### Q

What trace of the tide does a pixel read inside water, and how does it compare with the person's stretch a metre away?

### A

The trace is $4\pi G\matter\rho = 8.4\times10^{-7}\unit{s^{-2}}$, ninety times the person's $9.3\times10^{-9}\unit{s^{-2}}$.

### Q

Why can a pixel in empty space not read, in its trace, the density of the matter around it?

### A

The trace is the Ricci part, which is set by the energy and stress at the pixel's own place, and there they are zero.
The matter around the pixel still reaches it through the Weyl part, which has no trace and changes only the shape.

### Q

By what fraction does the pressure at the Sun's centre raise its active density?

### A

By $3\matter p/\matter\rho c^2 = 7.5\times10^{16}/(1.35\times10^{22}) = 5.6\times10^{-6}$.

### Q

A sealed box of hot gas has a pressure inside. Why does it not weigh more than its energy over $c^2$?

### A

Its walls' tension, a negative momentum flux, cancels the gas's pressure over the whole box (von Laue's theorem).
:::

**The idea to keep: Einstein's equation ties the Ricci curvature at each point to the energy and stress there, so a
pixel inside matter reads the active density $\matter\rho + \Sigma\matter p/c^2$ in the trace of the tide. In empty
space only the Weyl curvature is left: the five numbers of $\curv\tE$ and the five of $\curv\tB$.**

::: problems
### Practice

The neutrinos of a core collapse leave as a shell with a luminosity of $3\times10^{45}\unit{W}$. The supernova of
1987 was 50 kiloparsecs away, in the Large Magellanic Cloud. Find the Ricci part of $\curv\tE_{ij}$ inside the shell
there, its trace, and the direction of the squeeze.

::: solution
By the beam check, $\curv\tE^{\rm Ricci}_{ij} = (GL/c^3r^2)(\delta_{ij} - \hat n_i\hat n_j)$. With $r =
1.54\times10^{21}\unit{m}$, $GL/c^3r^2 = 6.674\times10^{-11} \times 3\times10^{45}/[(2.998\times10^8)^3 \times
(1.54\times10^{21})^2] = 3.1\times10^{-33}\unit{s^{-2}}$, 25 times less than at ten kiloparsecs: a squeeze in both
directions across the line to the star, and none along it. The trace is twice that, $6.2\times10^{-33}\unit{s^{-2}}$.
:::

### Stretch

Combine this chapter with chapters 1.3 and 1.4. A uniform ball of radius $R$ and density $\matter\rho$ has a tide
that is Ricci only inside (the uniform-ball check). Show that it is Weyl only outside, and find what jumps at the
surface.

::: solution
Outside, the Ricci part is zero and $(G\matter M/r^3)(\delta_{ij} - 3\hat n_i\hat n_j)$ is all Weyl. At $r = R$,
$G\matter M/R^3 = \tfrac{4\pi G}3\matter\rho$, so the entries across the radius are continuous, and the radial entry
goes from $\tfrac{4\pi G}3\matter\rho$ to $-\tfrac{8\pi G}3\matter\rho$. The jump, $4\pi G\matter\rho$, is all in
the trace, the part set by the matter.
:::

### The paper

In the paper's *Matter at the pixel*, radiation with energy flux $\mathbf F$ gives $\curv\tB$ the antisymmetric part
$-(4\pi G/c^3)\epsilon_{ijk}F_k$, so that "one reading inside the passing shell points back to the star". Derive it from
trace reversal and $\epsilon_{kij}\curv\tB_{ij} = c^2\curv R_{0k}$ (the section on empty space), and find its size and
direction for the beam check's burst at ten kiloparsecs.

::: solution
Null dust has $\matter T^{0k} = F_k/c$, so $\matter T_{0k} = -F_k/c$, and since $\field g_{0k} = 0$ trace reversal gives
$c^2\curv R_{0k} = -8\pi GF_k/c^3$. We write the antisymmetric part of $\curv\tB_{ij}$ as $\epsilon_{ijm}w_m$. Then
$\epsilon_{kij}\curv\tB_{ij} = \epsilon_{kij}\epsilon_{ijm}w_m = 2w_k$, so $w_k = \tfrac12c^2\curv R_{0k} = -(4\pi
G/c^3)F_k$, the paper's. The vector $\mathbf w$ points against the flux, back to the star. At ten kiloparsecs, where $F
= 2.5\times10^3\unit{W\,m^{-2}}$, its size $4\pi GF/c^3 = 7.8\times10^{-32}\unit{s^{-2}}$ equals the squeeze.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel): the trace $c^2R_{00} = 4\pi G\matter\rho$ ([](#eq:trace-ricci),
  [](#eq:newton-ricci)), and the "ten numbers" in vacuum.
- [Section I](/paper/#sec:introduction): gravity "in proportion to its energy (and, for fast motion and for light, its
  momentum and stress too)", [](#eq:active).
- [Section VIII](/paper/#sec:one-pixel), [*Matter at the pixel*](/paper/#par:matter-at-the-pixel): the trace in full
  and its numbers.
- [Section XI](/paper/#sec:vistas), [*An exploding star*](/paper/#par:an-exploding-star): the neutrinos' squeeze,
  [](#eq:ricci-tide).
- [Section IV](/paper/#sec:near-field), [*What breaks the tie*](/paper/#par:what-breaks-the-tie): a pixel inside
  matter reads the density there.
:::

::: deeper
- The GR course reads the Ricci tensor as an average of tides in
  [section 9.2](https://neovand.github.io/general-relativity/chapter-9.html#9-2-ricci-curvature-as-a-directional-average-of-tidal-effects),
  takes out the Weyl tensor in
  [section 9.3](https://neovand.github.io/general-relativity/chapter-9.html#9-3-extracting-the-trace-free-remainder-the-weyl-tensor)
  with its [cloud explorer](https://neovand.github.io/general-relativity/chapter-9.html#curvature-cloud-explorer), and
  derives the Newtonian limit with its factor of two in
  [section 12.4](https://neovand.github.io/general-relativity/chapter-12.html#12-4-deriving-the-newtonian-limit-including-the-factor-of-two).
- S. Carroll, *Spacetime and Geometry* (Addison-Wesley, 2004), chapter 4: Einstein's equation from the same
  requirements and from an action.
:::

[^T]: A bare $\matter T$ in this chapter is the trace of the stress–energy tensor, in $\mathrm{J\,m^{-3}}$; in chapter
    4.2 a bare $T$ is a temperature.

[^G]: With two indices, $\curv G_{\mu\nu}$ is the Einstein tensor; a bare $G$ is Newton's constant.

[^stiff]: The inverse factor, $c^4/G = 1.2\times10^{44}\unit{N}$, is a force: the stiffness of spacetime, in the GR
    course's [section 12.7](https://neovand.github.io/general-relativity/chapter-12.html#12-7-why-the-coupling-has-units-of-inverse-force).

[^Lambda]: A bare $\Lambda$ is the cosmological constant, in $\mathrm{m^{-2}}$. With indices the letter is chapter
    5.2's projector $\Lambda_{ij,kl}$ or a boost $\Lambda^\mu{}_\nu$. The constant acts as an energy density
    $\Lambda c^4/8\pi G$ with an equal tension in every direction, for which $\matter\rho + 3\matter p/c^2$ is minus
    twice the density.

[^C]: Not the paper's $\curv{\mathcal W} = \curv\tE + i\curv\tB$, though in empty space $\curv{\mathcal W}$ is built from
    it (chapter 9.3).
