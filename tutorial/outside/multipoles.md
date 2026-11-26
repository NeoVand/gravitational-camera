---
id: '2.3'
title: 'Multipole moments, and the tidal column'
question: "A camera three of a stone's radii away reads the stone's field. Which numbers of the stone does that field carry, in what order, and how much weaker is each than the one before?"
part: '2'
requires: ['1.2', '1.3', '1.4', '1.5', '1.6', '2.1', '2.2']
paper: [sec:hair, eq:hair-bits, fig:hair, sec:near-field, eq:tidal-column, eq:handheld, eq:split, eq:multipole, sec:pixel]
figures: [fig:hair]
live: [multipoles]
depth: A
---

How much of a body's inside does its gravity show from outside? The answer is a list of numbers that ends in noise. A
camera three of a stone's radii away reads the stone's field. Which numbers of the stone does that field carry, in what
order, and how much weaker is each than the one before? The answer also settles a point that section 1.5 left open:
what happens when matter touches the camera itself.

::: plain
Outside a body, its gravity depends on its mass only through a list of totals, the multipole moments. Each adds up the
mass with a weight that depends on where each piece lies. The first is the mass; the next three give the centre of
mass; the next five say how far the mass is drawn out along some direction, like a rugby ball; then come seven, nine,
and more. Each step has a ceiling, the largest share of the field it could give, and from one step to the next the
ceiling falls by the body's size over its distance: threefold from three radii away. A camera that reads the mass to
one part in a million reads at most thirteen steps, 169 numbers, before the rest sink into its noise.
:::

## Outside a body, the potential is a list of moments

We want the potential outside a body in a form that separates the body from the camera's place. Section 1.2 wrote it as a [sum over the body's
pieces](/tutorial/newton/field-and-potential/#a-potential-is-one-number-per-point-whose-downhill-slope-is-the-field),

$$\field\Phi(\vect x) = -G\int\frac{\matter\rho(\vect y)}{|\vect x - \vect y|}\,\dd V ,$$

where $\matter\rho$ is the density, in kilograms per cubic metre, at the point $\vect y$ of the body. We put the origin
inside the body and write $r = |\vect x|$ and $r' = |\vect y|$, in metres. We assume that **every piece of the body is
closer to the origin than the point $\vect x$**, so that $r' < r$ throughout the integral.

The generating function of section 2.2 ([its second
line](/tutorial/outside/spherical-harmonics/#the-patterns-symmetric-about-an-axis-are-the-legendre-polynomials-and-the-inverse-distance-generates-them))
expands the inverse distance in powers of $r'/r$, with $\gamma$ the angle between $\vect x$ and $\vect y$:

$$\frac{1}{|\vect x - \vect y|} = \sum_{\ell=0}^{\infty}\frac{r'^{\,\ell}}{r^{\ell+1}}\,P_\ell(\cos\gamma).$$

The [addition theorem](/tutorial/outside/spherical-harmonics/#the-addition-theorem-turns-a-sum-over-m-into-one-legendre-polynomial)
splits each Legendre polynomial into parts that depend only on the direction $\hat x$ of the camera or only on the
direction $\hat y$ of the piece of mass:

$$P_\ell(\cos\gamma) = \frac{4\pi}{2\ell + 1}\sum_{m=-\ell}^{\ell}Y_{\ell m}^*(\hat y)\,Y_{\ell m}(\hat x).$$

Substituting both, everything that depends on $\vect x$ comes out of the integral, and what stays inside depends on the
body alone:

$$\boxed{\;\begin{aligned}
\field\Phi(\vect x) &= -G\sum_{\ell=0}^{\infty}\sum_{m=-\ell}^{\ell}\frac{4\pi}{2\ell + 1}\,
\frac{\sym{multipole-moment}{\matter Q_{\ell m}}\,Y_{\ell m}(\hat x)}{r^{\ell+1}},\\
\matter Q_{\ell m} &= \int\matter\rho\,r'^{\,\ell}\,Y_{\ell m}^*(\hat y)\,\dd V .
\end{aligned}\;} \label{eq:exterior}$$

This is the **multipole expansion** of the potential outside a body, and the $\matter Q_{\ell m}$ are its **multipole
moments**. Each is a weighted total of the body's mass, in which each piece counts in proportion to
$r'^{\,\ell}Y_{\ell m}^*(\hat y)$, a solid harmonic of section 2.2 and so a harmonic function. In general the total of
the mass against a harmonic function $h$, $\matter Q_h = \int\matter\rho\,h\,\dd V$, is a **moment** of the body, and
each multipole moment is the moment for $h = r^\ell Y_{\ell m}^*$.[^conjugate][^hamilton] It is measured in
$\mathrm{kg\,m^\ell}$, because $Y_{\ell m}$ has no unit, so each term of the potential is in joules per kilogram.

The moments of degree $\ell$ form a group of $2\ell + 1$: degree 0 is the **monopole**, degree 1 the dipole, degree 2
the quadrupole (as in section 1.5) and degree 3 the **octupole**. The monopole is the
mass, because $Y_{00} = 1/\sqrt{4\pi}$ makes $\matter Q_{00} = \matter M/\sqrt{4\pi}$, and its term is
$-G\matter M/r$.

**A check.** For a point mass $\matter M$ on the $z$ axis at the height $a$, every $Y_{\ell m}$ with $m \neq 0$ vanishes
on the axis, so only $\matter Q_{\ell 0} = \matter M a^\ell\sqrt{(2\ell + 1)/4\pi}$ survives. With $Y_{\ell0} =
\sqrt{(2\ell + 1)/4\pi}\,P_\ell(\cos\vartheta)$, the expansion becomes $-G\matter M\sum_\ell a^\ell
P_\ell(\cos\vartheta)/r^{\ell+1}$, the generating function for $-G\matter M/|\vect x - a\hat z|$.

**What it means.** Two bodies with the same $\matter Q_{\ell m}$ have the same potential outside every sphere about
the origin that holds both, and if **the region outside the bodies is connected**,
[unique continuation](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball)
(section 2.1) carries the agreement to every point outside both. The reverse holds too, because by orthonormality the
potential on one such sphere gives each $\matter Q_{\ell m}$ back. A non-example is the $\int\matter\rho\,r'^2\,\dd V$
of section 1.6, whose weight is not harmonic: it tells a uniform ball from a uniform shell of the same mass, which
share every $\matter Q_{\ell m}$ (the last problem), so it never appears in the field outside.

::: gap
The expansion converges outside the smallest sphere about the origin that holds all the mass, because there each degree
lies below a ceiling that falls by a fixed factor ([see
below](#each-degree-has-a-ceiling-lower-than-the-last-by-the-size-over-the-distance)). Inside that sphere we do not
prove where it does.
:::

## The first three degrees are the mass, the centre of mass and a trace-free quadrupole

We want the first terms of [](#eq:exterior) in Cartesian components. Taylor's formula expands $1/|\vect x - \vect y|$
in powers of the components of $\vect y$. The first derivative of $1/r$ is $-x_i/r^3$ (section 1.2), and the second is
the table of [section 1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it).
A step $-\vect y$ from $\vect x$ gives

$$\frac{1}{|\vect x - \vect y|} = \frac{1}{r} + \frac{y_ix_i}{r^3} + \frac12\,y_iy_j\,\frac{3x_ix_j - r^2\delta_{ij}}{r^5} + \dots$$

The table $(3x_ix_j - r^2\delta_{ij})/r^5$ is the tide of a point mass of one kilogram at the origin, up to the factor
$-G$. It is trace-free, because its trace is $\nabla^2(1/r) = 0$ away from the origin (section 1.3). So the part
$\tfrac13r'^2\delta_{ij}$ of $y_iy_j$ multiplies a zero trace and drops out, and we may replace $y_iy_j$ by

$$y_iy_j - \tfrac13r'^2\delta_{ij} = \tfrac13\bigl(3y_iy_j - r'^2\delta_{ij}\bigr).$$

That is where $\int\matter\rho\,r'^2\,\dd V$ leaves the field. The new table is trace-free too, so it cancels the part
$-r^2\delta_{ij}$ of the other table in the same way, and only $3x_ix_j$ is left. Its 3 cancels the $\tfrac13$, and the
quadratic term becomes $\tfrac12(3y_iy_j - r'^2\delta_{ij})\,x_ix_j/r^5$. Multiplying by $-G\matter\rho$ and integrating over the body,

$$\boxed{\;\begin{aligned}
\field\Phi(\vect x) &= -\frac{G\matter M}{r} - \frac{G\matter M\,x_{{\rm cm},i}\,x_i}{r^3}\\
&\qquad - \frac{G}{2}\,\frac{\sym{quadrupole-tensor}{\matter Q_{ij}}\,x_ix_j}{r^5} - \dots,\\
\matter Q_{ij} &= \int\matter\rho\,\bigl(3y_iy_j - r'^2\delta_{ij}\bigr)\,\dd V .
\end{aligned}\;} \label{eq:cartesian}$$

The second term uses $\int\matter\rho\,\vect y\,\dd V = \matter M\vect x_{\rm cm}$, the mass times the
[centre of mass](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel) of section 1.6,
which is the dipole. With the origin at the centre of mass the dipole is zero, and the field outside has no term in
$1/r^2$. The table $\matter Q_{ij}$ is the **quadrupole tensor**, in $\mathrm{kg\,m^2}$.[^letters] It is symmetric and
trace-free, so it holds the five numbers of degree two.

For a body unchanged when turned about the $z$ axis, a half turn changes the signs of $xz$ and $yz$, and a quarter turn
exchanges $x^2$ and $y^2$ and changes the sign of $xy$. So the off-diagonal entries are zero and
$\matter Q_{xx} = \matter Q_{yy}$, and the zero trace makes each of these $-\tfrac12\matter Q_{zz}$. The table is
$\matter Q_{zz}\,\mathrm{diag}(-\tfrac12, -\tfrac12, 1)$, and the term of [](#eq:cartesian) becomes
$-\tfrac14G\matter Q_{zz}(3\cos^2\vartheta - 1)/r^3$. This is the term $\ell = 2$, $m = 0$ of [](#eq:exterior),
because $Y_{20} = \sqrt{5/16\pi}\,(3\cos^2\vartheta - 1)$ gives
$\matter Q_{20} = \sqrt{5/16\pi}\int\matter\rho\,(3z^2 - r'^2)\,\dd V = \sqrt{5/16\pi}\,\matter Q_{zz}$.

The [inertia tensor](/tutorial/newton/motion/#a-turning-body-keeps-the-spread-of-its-mass-in-a-table-of-inertia)
$I_{ij}$ of section 1.6 gives $\matter Q_{ij} = I_{kk}\,\delta_{ij} - 3I_{ij}$, so the field outside sees only the
differences between the principal moments of inertia.

**A number.** Take two masses $\matter m$ at $x = \pm d/2$, with $d$ their separation in metres, against one mass
$2\matter m$ at the middle. The scenes share mass and centre of mass; they differ first in the quadrupole of the pair,
$\matter m\,d^2\,\mathrm{diag}(1, -\tfrac12, -\tfrac12)$, against zero. On the $x$ axis at the distance $r$ it
changes the potential by $-G\matter m\,d^2/2r^3$, a fraction $d^2/4r^2$ of the monopole's $2G\matter m/r$. For two
masses of 1 kg, 10 cm apart, $\matter Q_{xx} = 0.01\unit{kg\,m^2}$, and at 1 m the fraction is $2.5 \times 10^{-3}$.
The same size, about $\matter m d^2$, separates the two versions of a scene in which one mass $\matter m$ sits in a
superposition of two places a distance $d$ apart, once the rest of the system recoils so that the centre of mass stays
put.[^quantum]

## Each degree has a ceiling, lower than the last by the size over the distance

How fast do the degrees fade with distance? Let the body lie inside a sphere of radius $R$, in metres, about the
origin. Before the addition theorem split it, the term of degree $\ell$ of the potential was

$$\field\Phi_\ell(\vect x) = -\frac{G}{r^{\ell+1}}\int\matter\rho\,r'^{\,\ell}\,P_\ell(\cos\gamma)\,\dd V .$$

We use one fact about the Legendre polynomials: $|P_\ell(\mu)| \le 1$ for $-1 \le \mu \le 1$. It follows from the
addition theorem, because the size of a sum $\sum_m a_m^*b_m$ is at most the product of the lengths of the two lists
(the Cauchy–Schwarz inequality), and both lists $Y_{\ell m}(\hat x)$ and $Y_{\ell m}(\hat y)$ have the squared length
$(2\ell + 1)/4\pi$. The density is positive and $r' \le R$, so

$$\boxed{\;|\field\Phi_\ell| \le \frac{G\matter M}{r}\Bigl(\frac{R}{r}\Bigr)^\ell .\;} \label{eq:fade}$$

So the potential of degree $\ell$ is at least $(r/R)^\ell$ times weaker than the monopole's. What falls by the factor
$R/r$ from one degree to the next is this ceiling, not each degree itself: a real degree can lie far below its
ceiling, and a body can have no quadrupole and still have an octupole. Equality holds for a point mass on the sphere, on the line to the camera, where $P_\ell = 1$; a round body is as far
from it as possible, with every degree after the monopole zero.

The ceiling is on the potential. The tide's two derivatives bring a factor that grows with the degree: for the point
mass at the height $R$ on the axis, the potential of degree $\ell$ is $-G\matter MR^\ell/r^{\ell+1}$, and two
derivatives give the tide $-(\ell + 1)(\ell + 2)\,G\matter MR^\ell/r^{\ell+3}$, which is
$\tfrac12(\ell + 1)(\ell + 2)(R/r)^\ell$ of the monopole's tide $-2G\matter M/r^3$: at degree 12, 91 times the
potential's share.

**A number.** From three radii away the ceiling of degree $\ell$ is $3^{-\ell}$ of the monopole. Suppose that the
camera reads the monopole with a signal-to-noise ratio $\SNR$, the signal divided by the typical size of the noise
(section 0.2).[^snr] Degree $\ell$ can stand above the noise only while $3^\ell < \SNR$, that is, while
$\ell < \ln\SNR/\ln 3$. For $\SNR = 10^6$ this is $13.8/1.10 = 12.6$, so at most degrees 0 to 12 stand above the noise
(Figure [](#fig:ceilings)), and they hold $1 + 3 + \dots + 25 = 13^2 = 169$ numbers, the rows of Figure [](/paper/#fig:hair).
This is a ceiling on what the camera reads, which section 3.8 turns into about 1200 bits. At $\SNR = 10^{70}$, the
rough quantum limit of [section 0.2](/tutorial/evening/through-walls/#the-blur-shrinks-only-with-the-number-of-digits-of-the-sensitivity),
the same rule reaches degree 146. A count made on the tide, with its factor $\tfrac12(\ell + 1)(\ell + 2)$, runs a few
degrees further: for the point mass at $\SNR = 10^6$, to degree 17.

{{paper fig:hair}}

![The ceiling $(1/3)^\ell$ of each degree for a camera three radii away, on a logarithmic scale, with the count
$2\ell + 1$ of its moments below. The noise of $\SNR = 10^6$ passes between degrees 12 and 13; the faded bars lie below
it.](tut-mul-ceiling){#fig:ceilings}

## A body that is not round has a tide that the ball model misses

Section 1.4 treated the person one metre away as a ball. A person is closer to a rod. We assume **a uniform thin rod**
of mass $\matter M = 70\unit{kg}$ and length $L = 1.7\unit{m}$, upright along $z$. We put the origin at the rod's
centre and the ring at the distance $r$ along the $x$ axis, and we want the stretch $\curv{\tE}_{xx}$ along the line
from the ring to the rod.

The rod holds $\matter M/L$ kilograms per metre at heights $z$ from $-L/2$ to $L/2$. The quadrupole of
[](#eq:cartesian) is then

$$\matter Q_{zz} = \frac{\matter M}{L}\int_{-L/2}^{L/2}\bigl(3z^2 - z^2\bigr)\,\dd z = \frac{\matter ML^2}{6}, \qquad
\matter Q_{xx} = \matter Q_{yy} = -\frac{\matter ML^2}{12} .$$

So $\matter Q_{ij}x_ix_j = (\matter ML^2/12)(3z^2 - r^2)$, and the quadrupole term of the potential is
$-(G\matter ML^2/24)(3z^2 - r^2)/r^5$. The fraction is the $\partial_z^2(1/r)$ of section 1.4, so the term is
$-(G\matter ML^2/24)\,\partial_z^2(1/r)$. We differentiate twice along $x$ and evaluate on the $x$ axis. There
$\partial_z^2(1/r) = -1/r^3 + 3z^2/r^5$, and the second part keeps its factor $z^2$ through both derivatives, so it
vanishes at $z = 0$. For the first, $\partial_x^2(r^{-3}) = -3r^{-5} + 15x^2r^{-7} = 12/r^5$ on the axis. The quadrupole adds $+G\matter ML^2/2r^5$ to the monopole's $-2G\matter M/r^3$:

$$\boxed{\;\curv{\tE}_{xx} \approx -\frac{2G\matter M}{r^3}\Bigl(1 - \frac{L^2}{4r^2}\Bigr).\;} \label{eq:rod}$$

The rod stretches the ring less than a ball of the same mass, because much of its mass lies farther away and off the
line (Figure [](#fig:rod)).

**A number.** We add up the point-mass tide of section 1.4 over the rod's pieces, by numerical integration to a
relative accuracy of $10^{-13}$. At 1 m the three diagonal entries are $-5.63$, $+3.56$ and
$+2.07 \times 10^{-9}\unit{s^{-2}}$, and they add to zero. The stretch is 0.60 of the ball's
$-9.34 \times 10^{-9}\unit{s^{-2}}$, so 5.6 eötvös instead of 9.3. Equation [](#eq:rod) gives the fraction 0.82 at 2 m,
against the exact 0.85, and 0.955 at 4 m, against 0.957.

At 1 m it gives 0.28, far from 0.60. The rod's ends lie 0.85 m from its centre, almost as far as the ring, so by
[](#eq:fade) the ceiling falls by a factor of only 0.85 from one degree to the next. The moments of odd degree cancel
between the two halves, because a solid harmonic of odd degree changes sign when $\vect y$ becomes $-\vect y$. The sums after degrees 0, 2, 4, 6 and 8 swing about the answer, as 1, 0.28,
0.86, 0.39 and 0.77, and they stay within 0.01 of 0.60 only from degree 30 on. So the nine eötvös of the ball is an
order of magnitude for a real person: a rod gives 5.6, and a real body, wider at the shoulders and hips, lies between
the two.[^person]

![The person of 70 kg one metre from a ring of free balls, drawn to one scale as a ball of water of radius 0.256 m
and as an upright rod 1.7 m long. The orange bars are the stretches, 9.3 and
$5.6\times10^{-9}\unit{s^{-2}}$. The dashed circle is the smallest sphere about the rod's centre that holds
it.](tut-mul-rod){#fig:rod}

## Round the camera, distant matter makes a sum of growing harmonics

Now we turn the expansion round. We want the potential near a camera whose sources are all far from it. We put the
origin at the camera and assume that **every piece of matter is farther from the camera than the point $\vect x$**,
so that now $r < r'$. The generating function with the two distances exchanged, split by the addition theorem as before, gives

$$\boxed{\;\begin{aligned}
\field\Phi(\vect x) &= -G\sum_{\ell=0}^{\infty}\sum_{m=-\ell}^{\ell}\frac{4\pi}{2\ell + 1}\,r^\ell\,Y_{\ell m}(\hat x)\\
&\qquad\times\int\matter\rho\,\frac{Y_{\ell m}^*(\hat y)}{r'^{\,\ell+1}}\,\dd V .
\end{aligned}\;} \label{eq:interior}$$

This is the **interior expansion**, and [](#eq:exterior) is the **exterior expansion**. Figure
[](#fig:two-expansions) shows where each one holds. Near the camera the potential is a sum of the growing solid
harmonics $r^\ell Y_{\ell m}$, as section 2.2 found [for an empty
ball](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them),
and their coefficients are moments of the scene against the fading ones, $Y_{\ell m}^*/r^{\ell+1}$.

Degree 0 is a constant, degree 1 a uniform pull that a freely falling camera cannot feel (section 1.4), and degree 2
the $\tfrac12\curv{\tE}_{ij}x_ix_j$ of section 2.1, the uniform tide. Degree $\ell \ge 3$ gives a tide that changes
across the camera as the power $\ell - 2$ of the distance from its centre.

Grouping the coefficient by direction, as section 1.5 grouped the tide, with $\dd V = r'^2\,\dd r'\,\dd\Omega$ (section
2.2) and $\hat n = \hat y$ the direction from the camera toward the matter, the coefficient of degree $\ell$ becomes

$$\int\matter\rho\,\frac{Y_{\ell m}^*(\hat y)}{r'^{\,\ell+1}}\,\dd V = \oint Y_{\ell m}^*(\hat n)\left[\int\matter\rho\,\frac{\dd r'}{r'^{\,\ell-1}}\right]\dd\Omega .$$

For $\ell = 2$ the bracket is $\int\matter\rho\,\dd r'/r'$, the tidal column $S(\hat n)$ of section 1.5, which writes
the distance along the line of sight as $r$. So the uniform tide reads the degree-two part of $S$, the [result for a
pixel](/tutorial/outside/spherical-harmonics/#a-pixel-reads-only-degree-two-of-its-sky) of section 2.2, reached again.
For $\ell = 3$ the bracket weighs the matter by $1/r'^2$, and for higher degrees more steeply still, so a camera that
compares its pixels reads other columns, weighted more toward the camera, and never $S$ itself.

**A number.** Take a camera of width $D$, in metres, and a source at the distance $r$. By the stretch problem of
section 2.2, at the camera's edge the tide of degree $\ell$ is about $(D/2r)^{\ell-2}$ of the uniform tide. Let $\SNR$
here be the signal-to-noise ratio of that uniform tide. Degree $\ell$ stands above the noise while
$(2r/D)^{\ell-2} < \SNR$. We take logarithms and solve for $\ell$:

$$(\ell - 2)\ln\frac{2r}{D} < \ln\SNR, \qquad \ell_{\max} = 2 + \frac{\ln\SNR}{\ln(2r/D)} .$$

A pattern of degree $\ell$ has [features about $\pi/\ell$
wide](/tutorial/outside/spherical-harmonics/#a-pattern-of-degree-ell-has-features-about-piell-wide), so the blur
$\Delta\theta$, the width of the finest detail, is about $\pi/\ell_{\max}$ radians.[^handheld] The locked safe's array is
1 m across and 3.5 m from the gold, so $2r/D = 7$. At $\SNR = 10^3$ the array reaches $\ell_{\max} = 2 + 6.91/1.95 =
5.55$, and its blur is $\pi/5.55 = 0.566$ radians, or 32.4°, about 2.0 m at the distance of the safes. A pixel alone,
with $D \to 0$, reads degree two and nothing else.

![Left: the exterior expansion in the fading harmonics holds outside the dashed sphere of radius $R$ that holds the
body. Right: the interior expansion in the growing harmonics holds inside the dashed sphere about the camera that
reaches the nearest body.](tut-mul-regions){#fig:two-expansions}

## At the camera's own place, the tide stays finite while the tidal column grows without limit

Section 1.5 derived the sky integral for the tide, assuming that all matter lies farther from the pixel than a small
distance $r_{\min}$. A real pixel sits in air, and matter at the camera would make $S$ diverge logarithmically, though
not the tide $\curv{\tE}_{ij}$ of a smooth density. We assume that **the density is smooth near the pixel**, and we split
the matter round the pixel into a small ball of radius $r_{\min}$ and the rest.

Section 1.4 found [the tide inside a ball of
dust](/tutorial/newton/tides/#in-empty-space-the-stretch-and-the-squeezes-balance) of uniform density:
$\tfrac{4\pi}{3}G\matter\rho\,\delta_{ij}$ at every point inside, whatever the ball's radius. Over a small ball the
density is nearly its value $\matter\rho_0$ at the pixel, and its changes add terms that shrink with $r_{\min}$, so the
ball gives $\tfrac{4\pi}{3}G\matter\rho_0\,\delta_{ij}$, however small.

The rest is the sky integral of section 1.5, cut off at $r_{\min}$. We expand the density along each line of sight,
$\matter\rho(r\hat n) = \matter\rho_0 + r\,\hat n\cdot\nabla\matter\rho + O(r^2)$. The constant part gives
$G\matter\rho_0\,\dd r/r$ times the integral of the tidal weight $\delta_{ij} - 3\hat n_i\hat n_j$ over the sky, which
is [zero](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes). The linear part is the
weight times $\hat n\cdot\nabla\matter\rho$, which changes sign between opposite directions while the weight does not,
so it integrates to zero as well. What is left starts at $r^2\,\dd r/r = r\,\dd r$, whose integral from 0 is finite.
So the sky integral tends to a finite limit as $r_{\min}$ shrinks, and

$$\boxed{\;\begin{aligned}
\curv{\tE}_{ij} &= \lim_{r_{\min}\to0}\,G\int_{r>r_{\min}}\bigl(\delta_{ij} - 3\hat n_i\hat
n_j\bigr)\,\frac{\matter\rho}{r^3}\,\dd V\\ &\qquad + \frac{4\pi}{3}\,G\matter\rho_0\,\delta_{ij} . \end{aligned}\;}
\label{eq:contact}$$

Both terms are in $\mathrm{s^{-2}}$; the last is the **contact term** (Figure [](#fig:contact)). The delta function of
section 1.3 writes the result compactly: at every point, the origin included,

$$\partial_i\partial_j\frac1r = \frac{3\hat x_i\hat x_j - \delta_{ij}}{r^3} - \frac{4\pi}{3}\,\delta_{ij}\,\delta^3(\vect x),$$

where the first part is to be integrated only outside a small ball about the origin, which is then shrunk. Multiplying
by $-G\matter\rho$ and integrating over the matter gives [](#eq:contact) again. The trace is a check. The first part
has none, and the second has $-4\pi\delta^3(\vect x)$, the
[$\nabla^2(1/r)$](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point) of section 1.3.
The diagonal entries share that trace equally, because a ball has no preferred axis;[^shape] in [](#eq:contact) it is
$4\pi G\matter\rho_0$, the trace of the tide inside matter (section 1.4).

The tidal column has no such cancellation, because it has no weight that changes sign across the sky: each line
contributes $\matter\rho_0\,\dd r/r$, so $S$ grows by $\matter\rho_0\ln 10$ each time $r_{\min}$ shrinks tenfold,
without limit.

**A number.** Fill a ball of radius 3 m round the pixel with air of $1.2\unit{kg\,m^{-3}}$. With $r_{\min} =
0.25\unit{m}$, $S = 1.2\ln(3/0.25) = 3.0\unit{kg\,m^{-3}}$ in every direction. With $r_{\min} = 1$ mm it is
$9.6\unit{kg\,m^{-3}}$, and with $1\,\mu$m it is $17.9\unit{kg\,m^{-3}}$. The tide does not change at all. The column is
the same in every direction, so the sky integral gives zero, and the contact term gives $3.4 \times
10^{-10}\unit{s^{-2}}$ on each diagonal entry, with the trace $1.0 \times 10^{-9}\unit{s^{-2}}$ that section 2.1 found
for air.

**What it means.** The camera reads $\curv{\tE}_{ij}$, which is finite wherever the density is smooth.[^edge] The tidal
column is a rendering of a known scene, not a quantity the camera could reconstruct uniquely: one pixel reads its
degree-two part, an array the other columns of the last section, and section 2.5 shows that many interiors share every
one of these readings.

![The sphere round the pixel coloured by the sky weight $1 - 3\cos^2\vartheta$ of $\curv{\tE}_{zz}$: orange where it is
negative, within 54.7° of the $z$ axis, blue where positive. The grey ball of radius $r_{\min}$ is drawn again at the
right with its contact term.](tut-mul-contact){#fig:contact}

::: try {#multipoles}
Predict first: bring the ring of readout from $3R$ to $1.5R$. How many more degrees rise above the noise? The figure
opens with three masses in an L, a ring at $r = 3R$ and $\SNR = 10^6$; each bar is one degree of the potential round the
ring, the dashed line its ceiling $(R/r)^\ell$. Move the ring and count the degrees above the noise. Then predict which
bar changes least when you move one mass to the centre, and check. Drag the masses, or tab to them and use the arrow
keys.
:::

**The idea to keep: outside a body, its field is a list of weighted totals of its mass, $2\ell + 1$ of each degree.
The potential of degree $\ell$ is at least $(r/R)^\ell$ times weaker than the mass's, with $R$ the body's size and $r$
its distance. Anything that is not a moment against a harmonic function, such as $\int\matter\rho\,r'^2\,\dd V$, never
appears.**

::: problems
### Practice

**[2.3]** Four equal masses $\matter m$ sit at $(\pm a, \pm a, 0)$. Find their mass, dipole and quadrupole about the
centre. Then use [](#eq:cartesian) to find the potential on the $z$ axis to the first correction, and check it against
the exact potential $-4G\matter m/\sqrt{z^2 + 2a^2}$.

::: solution
The mass is $4\matter m$ and the dipole is zero, by opposite pairs. Each mass has $x^2 = y^2 = a^2$ and $r^2 = 2a^2$,
so $\matter Q_{xx} = \matter Q_{yy} = 4\matter ma^2$ and $\matter Q_{zz} = -8\matter ma^2$, and $\matter Q_{xy}$ cancels
between masses with $xy = \pm a^2$. On the axis $\matter Q_{ij}x_ix_j = -8\matter ma^2z^2$, so

$$\field\Phi \approx -\frac{4G\matter m}{z} + \frac{4G\matter ma^2}{z^3} = -\frac{4G\matter m}{z}\Bigl(1 - \frac{a^2}{z^2}\Bigr).$$

The exact potential is $-(4G\matter m/z)(1 + 2a^2/z^2)^{-1/2} = -(4G\matter m/z)(1 - a^2/z^2 + \dots)$, the same.
:::

**[2.3]** A camera four radii from a stone reads the monopole with $\SNR = 10^6$. Up to which degree can it read the
moments?

::: solution
While $4^\ell < 10^6$, that is $\ell < 13.8/1.39 = 9.97$: up to degree 9 at most. The ceiling of degree 10 falls below
the noise, by 5 per cent.
:::

**[2.3]** A pixel inside water reads a trace of $4\pi G\matter\rho = 8.4 \times 10^{-7}\unit{s^{-2}}$. Where does it
come from, since the tidal weight of section 1.5 has no trace?

::: solution
From the contact term, the water at the pixel's own place. It adds $\tfrac{4\pi}{3}G\matter\rho$ to each diagonal
entry.
:::

### Stretch

**[2.3]** The Earth's flattening gives its potential the degree-two term $+G\matter MR^2J_2\,P_2(\cos\vartheta)/r^3$,
with $J_2 = 1.08 \times 10^{-3}$ and $\vartheta$ measured from the axis. By what fraction does it change the vertical
tide at the pole, compared with the monopole's stretch $2G\matter M/R^3$ (section 1.4)? Take $r = R$ there.

::: solution
On the axis $P_2 = 1$, and $\partial_z^2 z^{-3} = 12z^{-5}$ gives $+12J_2\,G\matter M/R^3$, a squeeze that opposes the
stretch $-2G\matter M/R^3$. The fraction is $6J_2 = 0.65\%$. With $2G\matter M/R^3 = 3.08 \times 10^{-6}\unit{s^{-2}}$ it
is $2.0 \times 10^{-8}\unit{s^{-2}}$, about twice the person's tide at a metre.
:::

### The camera

**[2.3]** A camera ten centimetres across looks at a lorry fifteen metres away with $\SNR = 10^6$. How fine is the
detail it sees, by the rule for $\ell_{\max}$ above? Then show from [](#eq:exterior) that a uniform shell and a uniform
ball about the origin have $\matter Q_{\ell m} = 0$ for every $\ell \ge 1$, which is the shell theorem in the language
of moments.

::: solution
Here $2r/D = 300$, so $\ell_{\max} = 2 + 13.8/5.70 = 4.4$ and the blur is $\pi/4.4 = 0.71$ radians, or 41°. For a round
body $\matter Q_{\ell m} = \int\matter\rho\,r'^{\,\ell+2}\,\dd r'\oint Y_{\ell m}^*\,\dd\Omega$, and
$\oint Y_{\ell m}^*\,\dd\Omega = \sqrt{4\pi}\oint Y_{\ell m}^*Y_{00}\,\dd\Omega = 0$ for $\ell \ge 1$ by
orthonormality. Only the mass is left, and the field outside is $-G\matter M/r$.
:::
:::

::: paper
- [Section XII](/paper/#sec:hair): the field outside from the moments $\matter Q_h$, and the ceiling $(R/R_c)^\ell$ of
  [](#eq:fade) in equation [](/paper/#eq:hair-bits) and Figure [](/paper/#fig:hair).
- [Section IV](/paper/#sec:near-field): equation [](/paper/#eq:tidal-column) with its $r_{\min}$, which
  [](#eq:contact) completes; equation [](/paper/#eq:handheld), resting on [](#eq:interior); the pair's quadrupole.
- Equation [](/paper/#eq:split) says which densities have none of these moments (section 2.5); Section XI's equation
  [](/paper/#eq:multipole) writes the static field to the quadrupole; [Section II](/paper/#sec:pixel) treats the person
  as a ball.
:::

::: deeper
- Jackson, *Classical Electrodynamics* (3rd edition, Wiley, 1999), sections 4.1 and 4.2, gives the electric twin of
  this section.
:::

[^conjugate]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XII, with $h = r^\ell Y_{\ell m}$ and no
    complex conjugate; for a real density its moment is $(-1)^m\matter Q_{\ell,-m}$.

[^hamilton]: Section 1.7 shows that $\matter Q_h$ also
    [generates the motion of an impulsive tide](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass).

[^letters]: A black hole's quadrupole (section 11.4) is a sixth of this one.

[^quantum]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV.

[^snr]: Here it is the ratio of the monopole; the small camera [below](#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics)
    uses that of the uniform tide.

[^person]: The ball model of the person is that of *The gravitational camera* (Mohsenvand 2026), Sec. II.

[^handheld]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:handheld).

[^shape]: This assumes that the region cut out round the pixel is a ball, or as symmetric as a cube.

[^edge]: At the sharp edge of a solid block some off-diagonal entries of the tide grow without limit, like the
    logarithm of one over the distance to the edge.
