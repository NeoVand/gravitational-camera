---
id: R13
title: 'What one reading keeps and what a push reads: a ball and a shell'
question: 'How much of a body can a camera read from its field at one moment, and what more can it read if it also pushes the body with a tide and watches the reply?'
part: '13'
requires: ['1.4', '1.7', '1.8', '2.3', '2.5', '2.6', '2.8', '3.8', '4.2', '4.5', '6.4', '6.5', '8.2', '8.7', '11.2', '13.1', '13.2', '13.3', '13.4', '13.5', '13.6']
paper: [sec:hair, eq:hair-bits, fig:hair, sec:second-order, eq:hair-commutator, eq:dust, eq:calderon, eq:scene-transform, eq:cone, fig:two-readings, eq:push, eq:pass, fig:passing, eq:shock, eq:shock-even, eq:massless-pass, eq:ladder, eq:ladder-identity, fig:ladder, eq:flow-bracket, eq:hidden-spin, fig:hidden-flow, eq:moment-bracket]
figures: [fig:hair, fig:two-readings, fig:passing, fig:ladder, fig:hidden-flow]
live: [passing]
---

At any one moment the gravity outside a body shows only certain weighted totals of its mass, so a hollow shell and a
solid ball of the same mass pull alike. How much of the inside can one such reading hold, and what more can a camera
read if it also gives the body a push and watches the reply?[^open]

::: plain
At one moment the gravity outside a body shows only certain averages of its mass. From three body radii away that is
about 1200 yes-or-no facts, against about 140 for a black hole.

A push changes this. A brief tide leaves energy in the body, and energy has weight. The energy depends on how the mass
is arranged, so a ball and a shell gain different amounts, in the ratio three to five. A mass that flies past does the
same and comes out a little slower. Pushes of the right shapes read every ripple of the density, though fine detail
still costs a great deal, and two pushes in either order read how the mass flows inside.
:::

## At one time the field holds the harmonic moments, and Einstein's theory fixes still less

**Hair** is whatever the field outside could show of what lies inside; a black hole in equilibrium shows only its
mass, spin and charge (section 11.2). Outside a body, with no waves from elsewhere, the field is built from the
moments $\sym{mass-moment}{\matter{Q_h}} = \int\sym{density}{\matter\rho}\,h\,\dd V$, with $\matter\rho$ the density in
$\mathrm{kg\,m^{-3}}$ and $h$ a function harmonic in the body, and from the like moments of the flow (section 2.8). A
density $\nabla^2\sym{null-potential}{\field\psi}/4\pi G$, with $\field\psi$ in $\mathrm{J\,kg^{-1}}$ and zero with its
gradient outside the body, has none of these moments and no effect outside
(section 2.5). This generalizes Newton's shell theorem: a ball and a shell differ by such a density.

In general relativity still less is fixed at one time. To first order, a free field added on one slice, a
gravitational wave of the kind of [section 7.6](/tutorial/geometry/gravitational-waves/), can cancel the
fields of every moment beyond the energy, momentum, angular momentum and centre of mass [@DonnellyGiddings2017].
Donnelly and Giddings (2017) showed that the constraints of the linear theory, the parts of Einstein's equation that
hold on one slice, fix outside a region only these ten numbers, the charges of the Poincaré group. In
the full theory, vacuum data inside a large ball can be joined, across a shell, to a black hole's field, spinning and
in general moving [@CorvinoSchoen2006].

## One reading holds about 1200 bits of a body and seven numbers of a black hole

On a sphere of radius $R_c$ about a body of radius $R$, the $2\ell + 1$ moments of degree $\ell$ are weaker than the
monopole by $(R/R_c)^\ell$. With the monopole read at the signal-to-noise ratio $\sym{snr}{\SNR}$, the bits of the
whole body at one time are $\sym{hair-bits}{H}$ (section 3.8, there called $C_{\rm body}$):[^bits]

$$\begin{gathered}
H \approx \frac{1}{\ln 2}\left[\frac{L^3}{3\Lambda^2} + \frac{L^2}{2\Lambda}\right],\\
L = \ln\SNR, \qquad \Lambda = \ln\frac{R_c}{R},
\end{gathered}$$

with $L$ and $\Lambda$ pure numbers.[^H] For a camera at the height $z$, in metres, above the surface,
$\Lambda = \ln(1 + z/R) \approx z/R$. The count is an **$\varepsilon$-entropy**, the bits that fix a harmonic function
between the spheres to the accuracy $\varepsilon = 1/\SNR$ [@KolmogorovTikhomirov1959; @SkibaZahariuta2000].

From three radii, $\Lambda = \ln3 = 1.099$. At $\SNR = 10^6$, $L = 13.82$ and $H = 1176$ bits. At the ceiling of
$10^{70}$ that section 8.6 sets for any camera, $L = 161.2$ and $H = 1.685 \times 10^6$ bits, or 211 kB. A black hole's
moments are fixed by its mass and spin [@Hansen1974], so with its place it holds seven numbers and at most
$7\log_2\SNR$ bits: 139.5 at $10^6$ and 1628 at $10^{70}$. The ratios are 8.4 and 1035.

{{paper fig:hair}}

Panel (a) shows the totals $\int\matter\rho\,r^2\,\dd V$ in units of $\sym{mass}{\matter M}R^2$. A uniform ball gives
$\tfrac35 = 0.60$. A shell between $0.92R$ and $R$ gives $\tfrac35(1 - 0.92^5)/(1 - 0.92^3) = 0.924$. A rock whose core
of $0.4R$ holds half the mass, both parts uniform, gives $\tfrac12\cdot\tfrac35\cdot0.4^2 +
\tfrac12\cdot\tfrac35(1 - 0.4^5)/(1 - 0.4^3) = 0.365$. The impulses along $(x, -y)$ are the gradient of the profile
$\tfrac12(x^2 - y^2)$ (section 1.7). Panel (b)'s 169 beads are the moments of degrees 0 to 12,
$\sum_{\ell\le12}(2\ell + 1) = 13^2$.

## At two times the readings hold a bracket, and products of tides build every ripple

Give the body two readings at two times. For matter whose forces do not depend on velocity, a moment and the rate of
change of another do not commute (section 8.2, with the Poisson bracket of section 1.7):[^two]

$$[\matter{Q_h}, \matter{\dot Q_g}] = i\hbar\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V .$$

The same integral appears three more times. Times $\kB T$, it is the classical tremor
$\langle\matter{\dot Q_h}\matter{\dot Q_g}\rangle$ (section 4.2). It is the whole weight of the response to a tide. And
it fixes the answer to a tide driven faster than the body can respond (section 4.5), with $\chi_{hg}$ the response of
the moment of $h$ to a tide of profile $g$ at the angular frequency $\omega$:

$$\chi_{hg}(\omega) \to -\frac{1}{\omega^2}\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V .$$

It is not a harmonic moment, and it has no null space: a variance of the field, a response to a second mass and an
energy exchanged with one all hold it (sections 13.1 and 13.2).

Calderón's pair turns the integral into a ripple. With $\vect\xi$ a real wavevector, $\vect\eta$ at right angles to it
and as long, both in $\mathrm{m^{-1}}$, and $\sym{calderon-vectors}{\vect\zeta_\pm} = \tfrac12(i\vect\xi \pm
\vect\eta)$, the exponentials $h_\pm = e^{\vect\zeta_\pm\cdot\vect x}$ are harmonic, because

$$\begin{aligned}
\vect\zeta_\pm\cdot\vect\zeta_\pm &= \tfrac14\bigl(|\vect\eta|^2 - |\vect\xi|^2\bigr) = 0 ,\\
\vect\zeta_+\cdot\vect\zeta_- &= -\tfrac14\bigl(|\vect\xi|^2 + |\vect\eta|^2\bigr) = -\tfrac12|\vect\xi|^2 .
\end{aligned}$$

Since $\nabla h_\pm = \vect\zeta_\pm h_\pm$ and $h_+h_- = e^{i\vect\xi\cdot\vect x}$, the integral becomes the Fourier
transform of the density (section 13.2):

$$\int\matter\rho\,\nabla h_+\cdot\nabla h_-\,\dd V = -\tfrac12\,|\vect\xi|^2\int\matter\rho\,e^{i\vect\xi\cdot\vect x}\,\dd V .$$

Calderón made the argument for a conductivity read from currents and voltages at a surface [@Calderon1980]. With density in place of conductivity, its linearized form is exact in Newton's theory, because a tide's kick to a part does not depend on where the others are. So the null space belongs to a reading at one time, not to gravity (section 13.2). Steel balls that hide a gold nugget, a flush of density on the wall or a skin of mass pull
alike (section 2.5), and a warm body or a tide applied to it tells them apart.[^twotimes]

A flat camera in the plane $z = 0$ reads the harmonic functions $h_{\vect k} = e^{i\vect k\cdot\vect a - |\vect k|z}$,
with $\vect a$ the place across the camera and $\vect k$ a wavevector in its plane. The scene's transform, a Fourier
transform across and a Laplace transform in depth, is

$$\matter{\tilde\rho}(\vect K, \kappa) = \int\matter\rho(\vect a, z)\,e^{i\vect K\cdot\vect a - \kappa z}\,\dd^2a\,\dd z ,$$

with $\vect K$ a wavevector across, $\sym{decay-rate}{\kappa}$ a rate of decay in depth, both in $\mathrm{m^{-1}}$, and
$\sym{scene-transform}{\matter{\tilde\rho}}$ in kilograms. The two readings are

$$\begin{gathered}
\matter{Q}(\vect k) = \matter{\tilde\rho}(\vect k, |\vect k|),\\
\int\matter\rho\,\nabla h_{\vect k}\cdot\nabla h_{\vect k'}\,\dd V
= \tfrac12\,(\kappa^2 - K^2)\,\matter{\tilde\rho}(\vect K, \kappa),
\end{gathered}$$

with $\vect K = \vect k + \vect k'$ and $\kappa = |\vect k| + |\vect k'| \ge K$ (section 13.2). One reading holds the
transform on the cone $\kappa = K$, and readings at two times hold it inside. A null density has the transform
$(\kappa^2 - K^2)\tilde\psi/4\pi G$, since differentiating $e^{i\vect K\cdot\vect a - \kappa z}$ twice gives
$\kappa^2 - K^2$ times itself: zero on the cone, and inside it what the second reading holds, which carries half of it.

{{paper fig:two-readings}}

Every pair with $|\vect k| + |\vect K - \vect k| = \kappa$ reaches the same point, an ellipse with foci $0$ and
$\vect K$ and semi-axes $\kappa/2$ and $\tfrac12\sqrt{\kappa^2 - K^2}$ (section 13.2).

Fine detail still costs exponentially. Each of $h_\pm$ grows to $e^{|\vect\xi|R/2}$ across a body of radius $R$, because
the real part of $\vect\zeta_\pm$ is $\pm\vect\eta/2$, so detail of size $2\pi/|\vect\xi|$ needs a relative precision of
about $e^{-|\vect\xi|R}$. For the steel ball of radius 0.5 m, 10 cm of detail needs one part in
$e^{31.4} = 4.4 \times 10^{13}$. This is the logarithmic stability of Calderón's problem, which cannot be better for
conductivities bounded beforehand [@Alessandrini1988; @Mandache2001]. Readings at two times remove the ambiguity and
keep the blur.

## Sixteen weighings read one ripple, and the weight changes by five parts in 10⁴¹

Masses outside make, for an instant, the potential $-\epsilon g\,\delta(t)$, with $g$ harmonic in the body and in
square metres, and $\sym{impulse-strength}{\epsilon}$ its strength in $\mathrm{s^{-1}}$. The body gains the energy
(section 1.7; for operators, section 8.2)[^push]

$$\Delta E = \epsilon\,\matter{\dot Q_g} + \frac{\epsilon^2}{2}\int\matter\rho\,|\nabla g|^2\,\dd V ,$$

and its weight rises by $\Delta E/c^2$ (section 6.4). Two copies kicked by $\pm\epsilon$ and two weighings give the even
part, $\tfrac12\epsilon^2\int\matter\rho\,|\nabla g|^2\,\dd V$, and the odd part, $\epsilon\matter{\dot Q_g}$ (section
13.1). Reading one Fourier component takes $4 \times 2 \times 2 = 16$ weighings: four real integrals in $\nabla
h_+\cdot\nabla h_-$, each from two squares by the polarization identity, each square from two copies kicked both ways
(section 13.2). That enough impulses give every moment is shown in section 13.6.

The measurement is far beyond reach. An impulse of $\Delta v = 3 \times 10^{-12}\unit{m\,s^{-1}}$ raises the weight by
$\tfrac12(\Delta v/c)^2 = 5.0 \times 10^{-41}$ of itself. A tonne held a metre from the edge for 50 µs gives the edge
$G \times 1000\unit{kg}/(1\unit m)^2 \times 50\unit{\mu s} = 3.3 \times 10^{-12}\unit{m\,s^{-1}}$.[^dv] The impulse must
be over before the body responds, the body's motions slow beside light, and the result is the first order in $1/c^2$
(section 13.1). Section 13.5 removes the restriction to slow matter and to order $1/c^2$.

## A passing mass reads the projected body with nothing weighed

A mass $\sym{passing-mass}{\matter\mu}$ held for an instant at $\vect y$ is the impulsive tide of profile
$1/|\vect x - \vect y|$, so a body at rest gains in proportion to $\int\matter\rho\,|\vect x - \vect y|^{-4}\,\dd V$,
whose kernel is not harmonic (section 13.1). Its values outside the body fix the density (section 13.3).

Let the mass fly past on a straight line at the speed $V$, in $\mathrm{m\,s^{-1}}$, crossing the plane through the body
at right angles to its path at the point $\vect b$. A part that lies over the point $\vect s$ of that plane, both
points in metres, receives the velocity $C(\vect b - \vect s)/|\vect b - \vect s|^2$, with
$\sym{flyby-constant}{C} = 2G\matter\mu/V$ in $\mathrm{m^2\,s^{-1}}$. The body gains (section 1.8)[^pass]

$$\Delta E(\vect b) = \frac{C^2}{2}\int\frac{\matter\Sigma(\vect s)}{|\vect b - \vect s|^2}\,\dd^2s ,$$

with $\sym{projected-density}{\matter\Sigma}$ the mass per area projected along the path, and the passer leaves slower
by $\Delta E/\matter\mu V$. The losses give every moment of $\matter\Sigma$, and paths along one great circle of
directions give the density (section 13.1). The bending holds only the moments of $\matter\Sigma$ against the powers of
$x + iy$, the shell theorem in the plane.

Write $F(b) = \int\matter\Sigma\,|\vect b - \vect s|^{-2}\,\dd^2s$, in $\mathrm{kg\,m^{-2}}$, so that
$\Delta E = \tfrac12C^2F$. For a round body the series is $F = \matter M/b^2 + \tfrac23\int\matter\rho\,r^2\,\dd
V/b^4 + \tfrac{8}{15}\int\matter\rho\,r^4\,\dd V/b^6 + \cdots$, whose first term is the recoil. A thin shell of radius
$r$ has $F = (\matter M/rq)\arctan(r/q)$ with $q = \sqrt{b^2 - r^2}$; at $r = 0.3b$ the three terms match it to 3 parts
in $10^4$. Take two bodies of one mass $\matter M$ and radius $R$: **body A**, a thin shell of radius $R/\sqrt2$, and
**body B**, half the mass at the centre of a shell of radius $R$ that holds the other half. Both have
$\int\matter\rho\,r^2\,\dd V = \tfrac12\matter MR^2$, so every quadrupolar tide treats them alike (section 13.3). They
agree in the first two terms, and the third gives B more than A by $\tfrac{C^2}{2}\cdot\tfrac{8}{15}\cdot\tfrac{\matter
MR^4}{4b^6} = \matter MC^2R^4/15b^6$. At $b = 1.5R$ the full sums leave 0.0803 inside A and 0.1041 inside B, in units
of $\matter MC^2/2R^2$, a ratio of 1.296: B keeps 30 per cent more.[^thirty] For a tonne passing at 44 km/s the slowing
is $4.5 \times 10^{-33}$ of its speed, of which the part that depends on the interior, $(1914 - 1827)/1914$, is
$2.1 \times 10^{-34}$.[^frozen]

{{paper fig:passing}}

::: try {#passing}
The figure, live, as in section 1.8. Drag the bead, the chart or the slider *Distance of the pass*, from $1.04R$ to
$4R$; it opens at $1.5R$.

Predict first: in the closest pass, at $1.04R$, does B hold more or less than twice A's internal energy? At $4R$, is B
still ahead by more than 5 per cent? Then drag the bead in and out and read the bars.
:::

## An impulsive wave does the same at any speed, and a particle of light kicks twice as hard

A wave with flat fronts and a profile $\sym{wave-profile}{H}$, in metres, harmonic across its front, is an exact
solution of Einstein's equation, and the field of a particle without mass is one [@AichelburgSexl1971] (section 13.5).
A particle that crosses it keeps $E - cp_z$ and gains the sideways momentum $(E - cp_z)\nabla H/2c$
[@Balasin1997; @Steinbauer1998], so it gains (section 6.4)

$$\Delta E = \tfrac12\,c\,\vect p_\perp\cdot\nabla H + \tfrac18\,(E - cp_z)\,|\nabla H|^2 .$$

With $E_\pm$ the body's energies after the wave and after its reverse, and $E_0$ with none,

$$E_+ + E_- - 2E_0 = \tfrac14\int|\nabla H|^2\,\matter{\mathcal N}\,\dd^2x_\perp \ge 0 ,$$

with $\sym{crossing-energy}{\matter{\mathcal N}}$ the energy less $c$ times the momentum along the wave that crosses each
square metre of the front, in $\mathrm{J\,m^{-2}}$ (section 13.5). The
stresses $(\partial_\mu\partial_\nu - \eta_{\mu\nu}\Box)\phi$ give zero along every ray, and in ordinary matter they
would change the energy density by about a part in $10^{12}$ (section 6.5).

The particle without mass has $H = -(8Gp/c^3)\ln|\vect x_\perp - \vect b|$, with $p$ its momentum, and a body at rest
gains

$$\Delta E(\vect b) = \frac{8G^2p^2}{c^6}\int\frac{\matter{\mathcal N}(\vect s)}{|\vect b - \vect s|^2}\,\dd^2s .$$

For slow matter $\matter{\mathcal N} = \matter\Sigma c^2$, so the prefactor becomes $8G^2p^2/c^4$ in front of
$\int\matter\Sigma/|\vect b - \vect s|^2\,\dd^2s$. That is the pass's $C^2/2$ for $C = 4Gp/c^2$, twice Newton's
$2Gp/c^2$ at $\matter\mu = p/c$ and $V = c$, because what gravitates is the energy plus the stresses.

## A second reading holds a volume's worth of moments, but at a price {#a-second-reading-holds-a-volumes-worth-of-moments-but-the-papers-bits-include-a-price}

A held mass outside a sphere of radius $R_c$ reads every moment $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$, with
$Y_\ell$ a surface pattern of degree $\ell$ (section 13.3). Of total degree $n = \ell + 2j$ there are
$(n + 1)(n + 2)/2$, against the first reading's $2n + 1$: 1, 3, 6, 10, 15 and 21 for $n = 0$ to 5, against 1, 3, 5,
7, 9 and 11. The count grows as the fourth power of $\ln\SNR$, as $L^4/24\Lambda^3\ln2$ (section 13.2). With one mass at
a time on one sphere the radial powers cannot be told apart, and masses held in pairs give every moment (section
13.8). Counting also the cost of telling apart radial powers that fall off from nearly the same radius gives about 1300
bits at $\SNR = 10^6$ and $9.6\times10^6$ at $10^{70}$, against 2580 and $3.19 \times 10^7$ without that cost.[^price]
For a pass, the second reading's ratio is smaller by $2G\matter\mu/bV^2$, $4.6 \times 10^{-17}$ for the tonne at 1.5 m
and 44 km/s (section 13.1).

## A tide of degree m reaches m rungs of the ladder

Inside a body a tide is a sum of harmonic polynomials, of degree two from far away and higher as its masses come near.
For an applied profile $g$ of degree at most $\sym{tide-degree}{m}$, the functions $\nabla h\cdot\nabla g$ and the
harmonic polynomials span exactly the polynomials $P$ with[^ladder]

$$\nabla^{2m}P = 0 ,$$

the radial moments $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$ with $j < m$, because

$$\nabla^{2m}(\nabla h\cdot\nabla g) = 2^m\,(\partial_{i_1}\!\cdots\partial_{i_{m+1}}h)\,(\partial_{i_1}\!\cdots\partial_{i_{m+1}}g) .$$

No tide reaches beyond these rungs, and every rung below $m$ is reached (section 13.3). Two densities that differ by
$\nabla^{2m}\field\psi$, with $\field\psi$ and its derivatives to order $2m - 1$ vanishing on the body's surface, have
the same exterior field and the same response to every tide of degree up to $m$, and in general differ under a tide of
degree $m + 1$.[^strong] Their transforms differ by $(\kappa^2 - K^2)^m\tilde\psi$, and their second readings by half
of $(\kappa^2 - K^2)^{m+1}\tilde\psi$.

The pair A and B shows it. The profile $\tfrac12(x^2 - y^2)$ has $|\nabla g|^2 = x^2 + y^2$, averaging $\tfrac23r^2$,
so A and B both gain $\tfrac12\epsilon^2\cdot\tfrac23\cdot\tfrac12\matter MR^2 = \tfrac12\epsilon^2\matter MR^2/3$. The
profile $\tfrac13(x^3 - 3xy^2)$ has $|\nabla g|^2 = (x^2 + y^2)^2$, averaging $\tfrac{8}{15}r^4$, and
$\int\matter\rho\,r^4\,\dd V$ is $\tfrac14\matter MR^4$ for A and $\tfrac12\matter MR^4$ for B. They gain
$\tfrac12\epsilon^2$ times $\tfrac{2}{15}\matter MR^4$ and $\tfrac{4}{15}\matter MR^4$: the second gains twice as
much.

{{paper fig:ladder}}

## Two tides in either order read the flow, even a flow that shows nothing outside

The rates of two moments have the bracket

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = \int\sym{mass-flux}{\matter{\vect J}}\cdot\bigl[(\nabla\nabla h)\,\nabla g
- (\nabla\nabla g)\,\nabla h\bigr]\,\dd V ,$$

with $\matter{\vect J}$ the density of momentum, in $\mathrm{kg\,m^{-2}\,s^{-1}}$, and $\nabla\nabla h$ the table of
second derivatives (section 13.4). For a short wait $\tau$, in seconds, between impulse and reading, $\tau^2$ times
this bracket is the part of the response that changes sign when the profile applied and the moment read are
exchanged. For Calderón's pair the bracket is $-\tfrac12|\vect\xi|^2\vect\eta\cdot\tilde{\matter{\vect J}}(\vect\xi)$,
so every flow with no magnetic field outside is read as the density is. For quadrupolar profiles the bracket is
proportional to the angular momentum.

For the octupolar pair $h + ig = (x + iy)^3/3$ and the sphere of section 2.8, whose inner ball out to $2^{-1/5}R$ turns
one way and the rest the other, with $\Omega$ the rate of the inner ball, anticlockwise about $z$ (section 13.4),

$$\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = \tfrac{32}{35}\bigl(1 - 2^{-2/5}\bigr)\,\matter M\Omega R^4
= 0.221\,\matter M\Omega R^4 .$$

The rigid ball gives $-\tfrac{32}{35}\matter M\Omega R^4$, and the split multiplies it by $2^{-2/5} - 1$. A gas trapped in a harmonic well splits likewise [@ZambelliStringari1998].

{{paper fig:hidden-flow}}

## The moments and the weight generate everything, but watching alone cannot read it

A quantity whose bracket with every harmonic moment vanishes does not depend on the momenta, and one whose bracket
with the energy also vanishes is a constant (section 13.6). In general relativity the mass moments are the charges of
the motions $(f/c)\,\partial_t + ct\,\nabla f\cdot\nabla$, with $f$ harmonic [@CompereOliveriSeraj2018], and these
motions do not close at degree two and above. For matter the bracket follows from those of the energy density
[@Dirac1962; @Schwinger1963], and the moments of the energy obey, to order $1/c^2$ and exactly for free
particles,[^moments]

$$\{\matter{Q_h}, \matter{Q_g}\} = \frac{1}{c^2}\int\matter{\vect J}\cdot(g\,\nabla h - h\,\nabla g)\,\dd V .$$

Two dipoles give $-L_z/c^2$ [@Pryce1948], and the quadrupoles $x^2 - y^2$ and $2xy$ give $-(2/c^2)\int(x^2 + y^2)\,
\sym{angular-momentum-density}{\ell_z}\,\dd V$, with $\ell_z$ the density of angular momentum about $z$. For the hidden
swirl this is $\tfrac{16}{35}(1 - 2^{-2/5})\,\matter M\Omega R^4/c^2 = 0.111\,\matter M\Omega R^4/c^2$, half the
swirl's bracket of rates over $c^2$: a moment of the flow that does not vanish for the sphere.

The moments that the field reports at this order also weigh the stresses (section 13.6). Marolf's boundary algebra
[@Marolf2009; @Marolf2014] holds the interior, but watching cannot read it; Jacobson and Nguyen found a lack of analyticity [@JacobsonNguyen2019]. The bracket of two quantities is the response of the first to an impulse generated
by the second. Heat supplies the impulses, and in the tremor the temperature stands where $\hbar$ stands (section 4.2); so does a
quantum state's zero point, while a cold classical body's correlations hold none of the brackets (section 8.7).

## The capstone: a ball and a shell read every way

![Look first at panel (a), where the two bodies cannot be told apart, and then at (b) and (c), where heat and one
push separate them by three to five. Each tag gives the ball's number before the shell's. The numbers are exact; the
bands, bars and paths are to scale, and the arrows are schematic.](tut-read-ball-shell){#fig:read-ball-shell}

The capstone follows section 13.1's steel ball, 1 m across and 4110 kg, and a thin shell of the same mass and radius,
$R = 0.5$ m, through Part 13's readings (Figure [](#fig:read-ball-shell)). Each row can be recomputed from the table
with $G$ and $c$, and row (e) with the pass's series.

| Step | Formula | Ball | Shell | Section |
|---|---|---|---|---|
| (a) one time | the bits of one reading from $3R$ at $10^6$ | 1176 bits | the same | 2.5, 3.8 |
| (b) heat | $\langle\matter{\dot Q_g}^2\rangle = \kB T\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V$, $g = \tfrac12(x^2 - y^2)$ | $411\unit{kg\,m^2}$ | $685\unit{kg\,m^2}$ | 4.2 |
| (c) a push | $\tfrac12\epsilon^2\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V$, $\epsilon = 10^{-10}\unit{s^{-1}}$; over $c^2$ | $2.06 \times 10^{-18}$ J, $2.29 \times 10^{-35}$ kg | $3.43 \times 10^{-18}$ J, $3.81 \times 10^{-35}$ kg | 1.7, 6.4 |
| (d) one ripple | $\matter{\tilde\rho}(\vect\xi) = \int\matter\rho\,e^{i\vect\xi\cdot\vect x}\,\dd V$ at $x = \lvert\vect\xi\rvert R = \pi$: $3\matter M(\sin x - x\cos x)/x^3$ and $\matter M\sin x/x$ | $3\matter M/\pi^2$, 1250 kg | 0 | 13.2 |
| (e) the tonne's pass | $b = 1.5$ m, $V = 44\unit{km\,s^{-1}}$; slowing $\Delta E/\matter\mu V^2$ | $4.55 \times 10^{-33}$, $2.1 \times 10^{-34}$ inside | $4.70 \times 10^{-33}$, $3.5 \times 10^{-34}$ inside | 1.8, 13.1 |
| (f) light | $C = 4Gp/c^2 = 2G\matter\mu/V$, so $E = pc = \matter\mu c^3/2V$ | $3.1 \times 10^{23}$ J | the same | 13.5 |
| (g) the $1/c^2$ bracket | $\{\matter{Q_{x^2-y^2}}, \matter{Q_{2xy}}\}$, swirl at $\Omega = 100\unit{s^{-1}}$ against rest | $3.2 \times 10^{-14}\unit{kg\,m^2\,s}$ | 0 | 13.4, 13.6 |

(a) At one time the two bodies are one scene, to every bit. (b) Heat breaks the tie: the tremors are 3 : 5. (c) The
strength $\epsilon$ only sets the scale. An impulse that size, delivered within the tens of microseconds that the
impulsive condition needs, say 34 µs, takes a tide of about $3 \times 10^{-6}\unit{s^{-2}}$, some 300 times the person's
$9.3 \times 10^{-9}\unit{s^{-2}}$ a metre away (section 1.4). This profile stretches along $x$ as much as it squeezes
along $y$, so it is not one point mass's tide, which stretches twice as much as it squeezes. The gains in weight are 5.6
and $9.3 \times 10^{-39}$ of the mass. (d) With crests 1 m apart, the ripple averages to zero over a sphere of radius
$R$, so the shell's transform vanishes and the ball's does not. One Fourier component tells them apart, at the mildest
of section 13.2's costs: the exponentials span only $e^{\pi} = 23$. (e) The tonne's recoil, $4.34 \times 10^{-33}$ of
its speed, is the same for both; the interiors take nearly 3 : 5 again. (f) Light kicks alike if it carries about 0.8
ms of the Sun's output. (g) The ball's two parts turn against each other and show no flow outside, yet its bracket is
$0.111\,\matter M\Omega R^4/c^2$.

**The idea to keep: one reading of the field holds only the harmonic moments, about 1200 bits of a body; the body's
reply to a push is of second order, weighs the density against products of tides, and so reads every ripple of the
density and of its flow, as long as something supplies the push, and with the blur of the first reading left in place.**

::: problems
### Practice

**[13.1]** Rerun the pass for A and B at $b = 2R$: their internal energies, their ratio, and the far-field estimate
$\matter MC^2R^4/15b^6$ against the exact difference.

::: solution
From each shell's $F(b)$, less the recoil, the internal energies are 0.0232 and 0.0261 in units of
$\matter MC^2/2R^2$, a ratio of 1.13. Their difference, 0.0030, exceeds the far estimate $2/(15 \times 2^6) = 0.0021$
by about 40 per cent.
:::

**[13.1]** The capstone's ball and shell are kicked by a tide three times stronger, $\epsilon = 3 \times 10^{-10}\unit{s^{-1}}$.
What does each gain, and does the ratio change?

::: solution
The even part goes as $\epsilon^2$, so each gain is nine times as large, $1.85 \times 10^{-17}$ and
$3.08 \times 10^{-17}$ J. The ratio stays 3 : 5.
:::

**[13.1]** Why does the pass's bending not tell A from B, while its slowing does?

::: solution
The bending is first order and holds only the moments against powers of $x + iy$, which the field at one time also
holds. The slowing is second order and weighs $\int\matter\rho\,r^4\,\dd V$ through the series' third term, where A and
B differ.
:::

### Stretch

**[13.6]** Let the boundary of the counter-turning ball be at a radius $a$, with the inner ball at $+\Omega$ and the rest
at $-\Omega$. Find the bracket of the energy's quadrupole moments for $x^2 - y^2$ and $2xy$ as a function of $a$, and
the radius at which it vanishes. Does the ball then have angular momentum?

::: solution
The rigid ball's $-\tfrac{16}{35}\matter M\Omega R^4/c^2$ is multiplied by $2a^7/R^7 - 1$. The bracket vanishes at
$a = 2^{-1/7}R = 0.906R$, outside section 2.8's $0.871R$ where the angular momentum vanishes, so the ball then has
angular momentum.
:::

### The camera

**[13.1]** Reproduce every number of the pass: the series' $\tfrac23$ and $\tfrac{8}{15}$, the 30 per cent,
$\matter MC^2R^4/15b^6$, 0.080 and 0.104, and the five parts in $10^{33}$.

::: solution
The series and the pair's numbers are worked in the section on the pass. For the tonne,
$C = 2G \times 1000/44{,}000 = 3.03 \times 10^{-12}\unit{m^2\,s^{-1}}$. The uniform ball's $F$ at $b = 1.5$ m, summed
shell by shell, is $1914\unit{kg\,m^{-2}}$, of which the recoil's $\matter M/b^2$ is 1827. So
$\tfrac12C^2F/\matter\mu V^2 = 4.5 \times 10^{-33}$ of the speed.
:::
:::

::: paper
- [Section XII](/paper/#sec:hair) in full: the plain words, the field at one time, the paper's [](/paper/#eq:hair-bits)
  and Figure [](/paper/#fig:hair).
- [Section XIII](/paper/#sec:second-order) in full: its fifteen equations and Figures [](/paper/#fig:two-readings),
  [](/paper/#fig:passing), [](/paper/#fig:ladder) and [](/paper/#fig:hidden-flow).
- The Introduction's last bullet, whose "under a known push" the margin note on the impulses spells out.
:::

::: deeper
- A. P. Calderón, "On an inverse boundary value problem" (1980) [@Calderon1980]: a few pages, with the exponentials
  used above.
:::

[^open]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XII](/paper/#sec:hair) for one reading and
    [Sec. XIII](/paper/#sec:second-order) for a push. The paper's Introduction calls the push "known": it is whatever
    supplies the impulses, a tide, heat at a known temperature or a quantum state's zero point.

[^bits]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XII](/paper/#par:the-number-of-bits), as its
    equation [](/paper/#eq:hair-bits).

[^H]: This $H$ is the bits, not section 1.7's energy, section 3.5's Wiener filter, or the wave's profile below. Here
    $\Lambda$ is not Part 7's projector.

[^two]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XIII](/paper/#par:the-field-at-two-times), as its equations [](/paper/#eq:hair-commutator) and
    [](/paper/#eq:dust); the Calderón pair is its [](/paper/#eq:calderon), and the transform of the scene its
    [](/paper/#eq:scene-transform) and [](/paper/#eq:cone) ([the two readings as one
    transform](/paper/#par:the-two-readings-as-one-transform), [stability](/paper/#par:stability)).

[^twotimes]: A classical body at rest, read at any number of times, shows only the harmonic moments of $\matter\rho$; a
    known rate of turning (section 13.4) and the passive ladder of a moving body (section 13.8) add a little.

[^push]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XIII](/paper/#par:an-impulsive-tide-and-a-weighing), as its equation [](/paper/#eq:push).

[^pass]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XIII](/paper/#par:a-mass-that-passes), as
    its equation [](/paper/#eq:pass). Spitzer's impulse approximation [@Spitzer1958; @BanikVanDenBosch2021] is the same
    calculation.

[^thirty]: The 30 per cent is the energy left inside. With the recoil, which both share, the totals differ by 4.5 per
    cent.

[^frozen]: The pass lasts $b/V = 34\unit{\mu s}$, half a radian of the ball's slowest ringing, so the parts of the body do not quite stay still meanwhile; the internal energy changes by 10 to 15 per cent
    (section 1.8).

[^price]: The 1300 and $9.6\times10^6$ were first counted in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XIII](/paper/#par:the-bits-of-a-second-reading).

[^ladder]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XIII](/paper/#par:what-a-tide-of-a-given-degree-reaches), as its equations [](/paper/#eq:ladder) and
    [](/paper/#eq:ladder-identity). Linearized impedance tomography has the same triangular structure [@GardeHirvensalo2025; @GardeHyvonen2024].

[^strong]: The surface condition matters for $m \ge 2$: $\psi = (R^2 - r^2)^2$ inside and zero outside vanishes outside
    with its gradient, yet as a smooth function inside its $\nabla^4\psi$ is 120 and has a mass, because $\nabla^2\psi$
    jumps at $R$. The words "in general" except a $\psi$ that is itself the Laplacian of such a function, as for A and B,
    whom every tide of degree two treats alike (section 13.3).

[^moments]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XIII](/paper/#par:the-algebra-of-the-moments-and-the-energy), as its equation [](/paper/#eq:moment-bracket);
    its flow brackets are its [](/paper/#eq:flow-bracket) and [](/paper/#eq:hidden-spin)
    ([the flow](/paper/#par:the-flow)).

[^dv]: This is the held tonne's whole pull at the edge, nearly half of it a kick to the ball as a whole. Its tidal part,
    the edge's impulse less the centre's, is $1.9 \times 10^{-12}\unit{m\,s^{-1}}$.
