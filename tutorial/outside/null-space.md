---
id: '2.5'
title: 'Interiors the outside cannot see: the null space, harmonic projection, balayage; a uniform sheet is invisible'
question: 'A gold nugget inside a steel ball, the same gold spread as a flush that is densest at the near wall, and the same gold spread as a skin on the surface pull exactly alike everywhere outside the ball. Which part of a body''s density does the field outside fix, and which part can it never see?'
part: '2'
requires: ['1.3', '1.4', '1.6', '2.1', '2.2', '2.3', '2.4']
paper: [sec:near-field, eq:split, eq:harmonic-point, fig:same-outside, eq:wiener, eq:array-data, sec:hair, sec:second-order, sec:holography, tab:null]
figures: [fig:same-outside]
live: [same-outside]
depth: A
---

Three steel balls each hold the same mass $\matter m$ of gold. In the first the gold is a small nugget halfway from the
centre to the wall. In the second it is spread through the ball as a **flush**, densest at the wall nearest the
nugget's place. In the third it lies on the surface as a thin **skin**, thickest over that place (section 2.4
derives the skin). Outside the ball the three pull exactly alike, at every point and however close a camera
comes.[^first]

{{paper fig:same-outside}}

Which part of a body's density does the field outside fix, and which part can it never see? Section 2.3 found that many interiors
[share every moment](/tutorial/outside/multipoles/#at-the-cameras-own-place-the-tide-stays-finite-while-the-tidal-column-grows-without-limit)
of the mass and so the same field outside. Here we build such interiors, find the part they share, and show why the
picture that assumes least can never show a core.

::: plain
Mass can be moved about inside a body without changing its pull anywhere outside. Add the matter that would make any smooth bump of potential that is zero outside the body, and the potential changes only inside. A cored Earth and a uniform Earth of the same mass are one such pair.

Every density splits in one way into a harmonic part, whose value at each point is the average of the values round it, and a part made by bumps of that kind. The field outside fixes the harmonic part and cannot see the rest. The harmonic part has the least contrast of all the interiors that pull alike, and a harmonic function has its extremes on the surface, so the picture that assumes least can never show a dense core. Spin, a kick, heat, or a sensor inside the matter can tell the interiors apart.
:::

## A confined Laplacian added to a body changes nothing outside

We want to change a body's interior without changing anything outside it. Let $\sym{null-potential}{\field\psi}$ be a
function of position in joules per kilogram, the unit of a potential. We assume that **$\field\psi$ is zero everywhere
outside the body** and that **$\field\psi$ and its gradient are continuous everywhere**. Then both are zero on the
body's surface, and we call such a function **confined** to the body. Its second derivatives may jump at the surface,
as a density does where steel meets air.[^jump]

Let $\field\Phi$ be the potential of the body's density $\matter\rho$, in kilograms per cubic metre. We add to the body
the density

$$\matter{\delta\rho} = \frac{\nabla^2\field\psi}{4\pi G} ,$$

in kilograms per cubic metre, which is zero outside the body because $\field\psi$ is. The new potential is
$\field\Phi + \field\psi$. It satisfies [Poisson's
equation](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point) for the new density,
because

$$\begin{aligned}\nabla^2(\field\Phi + \field\psi) &= 4\pi G\matter\rho + \nabla^2\field\psi\\ &= 4\pi G(\matter\rho + \matter{\delta\rho}) ,\end{aligned}$$

and it falls to zero far away, because $\field\psi$ is zero there. Only one potential does both
([uniqueness](/tutorial/outside/laplace/#the-values-on-a-closed-surface-fix-the-potential-inside), section 2.1), so

$$\boxed{\;\field\Phi_{\rm new} = \field\Phi + \field\psi ,\;}$$

which equals $\field\Phi$ everywhere outside the body. Every reading outside is made from the potential there, so no reading changes outside, at any sensitivity.

Finding a body's density from its field outside is the **exterior inverse problem**, and it has many answers, because
$\matter{\delta\rho}$ can be added freely. An **impossibility result** is a pair of scenes, built explicitly, that a
camera cannot tell apart.

**Steel balls that pull alike.** Take the steel ball of section 2.4, of radius $R = 0.1\unit{m}$ and density
$\matter\rho_0 = 7850\unit{kg\,m^{-3}}$, whose mass is $32.9\unit{kg}$. Inside it we take

$$\field\psi = A\Bigl(1 - \frac{r^2}{R^2}\Bigr)^2 ,$$

and $\field\psi = 0$ outside, where $r$ is the distance from the centre and $A$ is a constant in joules per kilogram.
At $r = R$ both $\field\psi$ and its slope $\dd\field\psi/\dd r = -(4Ar/R^2)(1 - r^2/R^2)$ are zero, so $\field\psi$ is
confined. The Laplacian of a function of $r$ alone is $(1/r^2)\,\dd(r^2\,\dd\field\psi/\dd r)/\dd r$
([section 2.2](/tutorial/outside/spherical-harmonics/#the-laplacian-splits-into-a-part-along-the-radius-and-a-part-on-the-sphere)).
Here $r^2\,\dd\field\psi/\dd r = -4Ar^3/R^2 + 4Ar^5/R^4$; we differentiate and divide by $r^2$:

$$\begin{gathered}\nabla^2\field\psi = \frac{A}{R^2}\Bigl(\frac{20r^2}{R^2} - 12\Bigr),\\ \matter{\delta\rho} = \frac{A}{4\pi GR^2}\Bigl(\frac{20r^2}{R^2} - 12\Bigr).\end{gathered}$$

The unit is right: $\mathrm{m^2\,s^{-2}}$ divided by $G$ and by a square metre gives $\mathrm{kg\,m^{-3}}$. The added mass is zero, as it must
be, since the mass sets the field far away. In shells of volume $4\pi r^2\,\dd r$, with $u = r/R$,

$$\begin{aligned}\int\matter{\delta\rho}\,\dd V &= \frac{AR}{G}\int_0^1\bigl(20u^4 - 12u^2\bigr)\,\dd u\\ &= \frac{AR}{G}\,(4 - 4) = 0 .\end{aligned}$$

We choose $A = \pi GR^2\matter\rho_0/3 = 5.5 \times 10^{-9}\unit{J\,kg^{-1}}$, a sixth of the size of the ball's own
potential at its centre, $-3.3 \times 10^{-8}\unit{J\,kg^{-1}}$ (section 2.4). Then
$\matter{\delta\rho} = \matter\rho_0(5r^2/3R^2 - 1)$, and the two ordinary positive densities $\matter\rho_0 \pm
\epsilon\,\matter{\delta\rho}$, with $\epsilon = 1$, are[^eps]

$$\begin{aligned}\matter\rho_0 + \matter{\delta\rho} &= \frac{5\matter\rho_0}{3}\,\frac{r^2}{R^2},\\ \matter\rho_0 - \matter{\delta\rho} &= \matter\rho_0\Bigl(2 - \frac{5}{3}\,\frac{r^2}{R^2}\Bigr).\end{aligned}$$

The first ball is empty at its centre and reaches $1.67\matter\rho_0 = 13{,}100\unit{kg\,m^{-3}}$ at its surface. The
second has a core twice as dense as steel, $15{,}700\unit{kg\,m^{-3}}$, and thins to $2600\unit{kg\,m^{-3}}$ at the
surface. Both are real, positive bodies of 32.9 kg, and both pull exactly like the uniform ball at every point outside
(Figure [](#fig:null-balls)). Inside, they differ: the integral $\int\matter\rho\,r^2\,\dd V$ of section 1.6, which
measures how far the mass lies from the centre, is 1.19 times the uniform ball's for the first and 0.81 times for the
second (the practice problem). It enters the moment of inertia
([section 1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)), which is
$0.157\unit{kg\,m^2}$, 0.132 and $0.106\unit{kg\,m^2}$ for the three balls, so spinning them would tell them apart. The
steady pull outside cannot.

The two Earths of section 1.3 are another case: $\field\psi$ is the potential of the two-layer Earth minus that of the
uniform Earth, zero outside by the shell theorem, with zero slope at the surface because both Earths pull with
$G\matter M/R^2$ there. A thin shell does not work, because the pull jumps across a layer of mass.

![Three steel balls of radius $R = 0.1\unit{m}$ cut through their centres, shaded by density on one scale: the first,
$\matter\rho_0 + \matter{\delta\rho}$, the uniform ball, and the third, $\matter\rho_0 - \matter{\delta\rho}$. The grey
arrows give the pull at $1.5R$ and $2R$ from each centre, the same for all three; their common scale is chosen for the
drawing.](tut-null-hero){#fig:null-balls}

## Two bodies with the same outside differ by a confined Laplacian

The last section went one way: a confined Laplacian changes nothing outside. We want the other way: if two densities
in the same body give the same field everywhere outside it, their difference is such a Laplacian. We assume that **the
outside of the body is all in one piece**, as the outside of a ball is, and that **the two densities have no layers of
mass on surfaces**, so that both potentials and their gradients are continuous everywhere.[^layer]

Let $\matter\rho_1$ and $\matter\rho_2$ be the two densities, $\field\Phi_1$ and $\field\Phi_2$ their potentials, and
$\field\psi = \field\Phi_1 - \field\Phi_2$. Outside the body the two fields agree, so $\nabla\field\psi = 0$ there, and
$\field\psi$ keeps one value along any path that stays outside. The outside is in one piece and reaches far away, where
$\field\psi$ falls to zero, so that value is zero. By continuity, $\field\psi$ and its gradient vanish on the surface:
$\field\psi$ is confined. Subtracting the two Poisson equations gives $\nabla^2\field\psi = 4\pi G(\matter\rho_1 -
\matter\rho_2)$, so

$$\boxed{\;\matter\rho_1 - \matter\rho_2 = \frac{\nabla^2\field\psi}{4\pi G}, \qquad \field\psi \text{ confined to the body.}\;}$$

Section 2.3 described the field outside as the list of
[moments](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments)
$\matter Q_h = \int\matter\rho\,h\,\dd V$, one for each function $h$ harmonic in the body. A confined Laplacian has
none of them. [Green's second identity](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other)
(section 2.1) moves the Laplacian onto $h$, with no terms on the surface because $\field\psi$ and its gradient vanish
there: $\int h\,\nabla^2\field\psi\,\dd V = \int\field\psi\,\nabla^2h\,\dd V = 0$. So we have three statements about two
densities in a body:

1. they give the same field everywhere outside;
2. they have the same moment $\matter Q_h$ against every function $h$ harmonic in the body;
3. they differ by a confined Laplacian, $\nabla^2\field\psi/4\pi G$.

This section proved that 1 gives 3, the last section that 3 gives 1, and Green's identity that 3 gives 2. For the step
from 2 back to 1, section 2.3 built the field outside any sphere that encloses the body from the moments, so equal
moments give equal fields there. The difference of the two potentials is then harmonic outside the body and zero outside
the sphere, so by the
[uniqueness from a small ball](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball)
of section 2.1 it is zero over the whole outside. The three statements are one.

## Every density splits into a harmonic part and a part the outside cannot see

Densities in a body behave as vectors. For two functions $f$ and $g$ in the body we write

$$\sym{inner-product}{\langle f, g\rangle} = \int_{\rm body} f\,g\,\dd V ,$$

the **inner product** of the two functions, in $\mathrm{kg^2\,m^{-3}}$ for two densities. It plays the part of the dot
product of section 1.1, with one entry for each point of the body, as the integral over the sky did for
[patterns](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them)
in section 2.2. Two functions are **orthogonal** when their inner product is zero, and $\langle f, f\rangle = \int
f^2\,\dd V$ is the square of the length of $f$. We consider only densities with a finite $\int\matter\rho^2\,\dd V$.

Two families of densities matter. The first, $\sym{harmonic-family}{\mathcal H}$, holds the densities that are harmonic
in the body. The second, $\sym{null-family}{\mathcal N}$, holds the confined Laplacians $\nabla^2\field\psi/4\pi G$.
The identity of the last
section, $\int h\,\nabla^2\field\psi\,\dd V = 0$, says that every member of $\mathcal H$ is orthogonal to every member
of $\mathcal N$: the two families stand at right angles, like a line and a plane perpendicular to it.

We now show that **the two families together make up every density**: every $\matter\rho$ is a member of
$\mathcal H$ plus a member of $\mathcal N$. The sketch has two parts. First, only zero is orthogonal to both families. Let a smooth density $f$ be orthogonal to every member of $\mathcal N$. Green's second identity moves the
Laplacian from $\field\psi$ to $f$, so $\int\field\psi\,\nabla^2 f\,\dd V = 0$ for every confined $\field\psi$. If
$\nabla^2 f$ were positive at a point $\vect x_0$, it would be positive in a small ball of radius $a$ round $\vect x_0$,
because it is continuous. The bump $\field\psi = A(1 - |\vect x - \vect x_0|^2/a^2)^2$ in that ball, with $A > 0$, and
zero outside it, is confined and nowhere negative, so $\int\field\psi\,\nabla^2 f\,\dd V$ would be positive. The same
bump rules out a negative value, so $\nabla^2 f = 0$ and $f$ is in $\mathcal H$. If $f$ is orthogonal to $\mathcal H$ as
well, then $\int f^2\,\dd V = 0$ and $f = 0$.

Second, in a space of finitely many dimensions that settles it. If the sums of a member of $\mathcal H$ and a member of
$\mathcal N$ did not fill the whole space, some vector other than zero would stand at right angles to all of them, as a
plane through the origin has a normal. That vector would be orthogonal to both families, and so it would be zero. The box below completes the argument for
the infinitely many dimensions of the space of densities.

::: derivation
### The split in full: Weyl's lemma and the potential of the remainder

The sketch needs two more things: its first part must hold for a density that is not smooth, and its second part
needs a fact about limits. Here a sequence of densities $f_1, f_2, \dots$ **approaches** $f$ when
$\int(f_n - f)^2\,\dd V$ goes to zero.

**Step 1, Weyl's lemma.** We want to show that a density $f$ orthogonal to every confined Laplacian is harmonic,
whether or not it is smooth (Hermann Weyl, 1940). We smooth $f$ with the bump of the sketch. For a small length
$\varepsilon$, let $w_\varepsilon(\vect x) = c\,(1 - |\vect x|^2/\varepsilon^2)^2$ for $|\vect x| < \varepsilon$ and
zero beyond, in $\mathrm{m^{-3}}$. With $u = |\vect x|/\varepsilon$ its integral is
$4\pi c\,\varepsilon^3\int_0^1 u^2(1 - u^2)^2\,\dd u = 4\pi c\,\varepsilon^3(\tfrac13 - \tfrac25 + \tfrac17) =
32\pi c\,\varepsilon^3/105$, so $c = 105/32\pi\varepsilon^3$ makes it 1. The **smoothed** density
$f_\varepsilon(\vect x) = \int f(\vect y)\,w_\varepsilon(\vect x - \vect y)\,\dd^3y$ is the average of $f$ over the
ball of radius $\varepsilon$ round $\vect x$, weighted by $w_\varepsilon$.

At a point $\vect x$ farther than $\varepsilon$ from the surface, $w_\varepsilon(\vect x - \vect y)$ is, as a function
of $\vect y$, a confined bump inside the body. Its first derivatives are continuous and its second derivatives are
bounded, so we may differentiate twice under the integral. Since $w_\varepsilon$ depends on $\vect x - \vect y$, its
Laplacian in $\vect x$ equals its Laplacian in $\vect y$, and

$$\nabla^2 f_\varepsilon(\vect x) = \int f(\vect y)\,\nabla_y^2\,w_\varepsilon(\vect x - \vect y)\,\dd^3y = 0 ,$$

which is the assumption on $f$ with $\field\psi(\vect y) = w_\varepsilon(\vect x - \vect y)$. So $f_\varepsilon$ is
harmonic there. A harmonic function equals its average over every sphere about a point
([section 2.1](/tutorial/outside/laplace/#the-value-at-the-centre-of-a-sphere-is-the-average-over-the-sphere)), and
$w_\delta$ has one value on each sphere about its centre, so smoothing $f_\varepsilon$ with $w_\delta$ leaves it
unchanged. Smoothing twice gives the same result in either order, because both orders integrate $f$ against the same
combined weight. So at every point farther than $\varepsilon + \delta$ from the surface

$$f_\varepsilon = (f_\varepsilon)_\delta = (f_\delta)_\varepsilon = f_\delta ,$$

and all the smoothed densities are one harmonic function $h$. As $\varepsilon \to 0$ the smoothed densities approach
$f$, a standard fact of integration (Lebesgue's), so $\int(h - f)^2\,\dd V = 0$ over every region away from the
surface. Then $f = h$ except on a set of zero volume, which no integral notices.

**Step 2, the harmonic family holds its limits.** Let members $h_n$ of $\mathcal H$ approach $f$. For a confined
$\field\psi$ the Cauchy–Schwarz inequality, $|\int a\,b\,\dd V| \le (\int a^2\,\dd V)^{1/2}(\int b^2\,\dd V)^{1/2}$,
gives

$$\Bigl|\int(f - h_n)\,\nabla^2\field\psi\,\dd V\Bigr| \le \Bigl(\int(f - h_n)^2\,\dd V\Bigr)^{1/2}\Bigl(\int(\nabla^2\field\psi)^2\,\dd V\Bigr)^{1/2} ,$$

which goes to zero. Each $h_n$ is orthogonal to $\nabla^2\field\psi$, so $f$ is too, and by step 1 it is harmonic. A
family that contains every density its members approach is **closed**.

**Step 3, the closest harmonic density and the potential of what is left.** In the space of densities with finite
$\int\matter\rho^2\,\dd V$, a closed family that contains the sums and multiples of its members holds a member
closest to any given density. This is the **projection theorem**, and it rests on the completeness of that space, proved by Frigyes
Riesz and Ernst Fischer in 1907. Let $\matter\rho_h$ be the member of $\mathcal H$ closest to $\matter\rho$, and
$n = \matter\rho - \matter\rho_h$. For any $h$ in $\mathcal H$ and any number $t$, $\matter\rho_h + t\,h$ is in
$\mathcal H$ too, so

$$\int(n - t\,h)^2\,\dd V = \int n^2\,\dd V - 2t\,\langle n, h\rangle + t^2\int h^2\,\dd V$$

can be no smaller than $\int n^2\,\dd V$. For a small $t$ of the sign of $\langle n, h\rangle$ it would be smaller,
unless $\langle n, h\rangle = 0$. So $n$ is orthogonal to all of $\mathcal H$.

Now let $\field\psi(\vect x) = -G\int n(\vect y)/|\vect x - \vect y|\,\dd^3y$ be the potential of $n$, so that
$\nabla^2\field\psi = 4\pi G\,n$ (section 2.4). For a point $\vect x$ outside the body, $1/|\vect x - \vect y|$ is, as
a function of $\vect y$, harmonic and bounded throughout the body: a member of $\mathcal H$. The density $n$ is
orthogonal to it, so $\field\psi(\vect x) = 0$. The potential is continuous, because by the Cauchy–Schwarz inequality
a small change of $\vect x$ changes it by little, so $\field\psi$ is zero on the surface as well, and its gradient is
zero outside. For a bounded $n$ the gradient is continuous too, and $\field\psi$ is confined in the sense of the first
section.[^weak] The remainder is $n = \nabla^2\field\psi/4\pi G$, a member of $\mathcal N$: **what the harmonic part
leaves over is the Laplacian of its own potential**, and the split $\matter\rho = \matter\rho_h + n$ holds for every
density.

**A check.** For the two-layer Earth of section 1.3, take $n$ to be its density minus the uniform density of the same
mass, $5513\unit{kg\,m^{-3}}$, which a section below shows to be its harmonic part. Step 3's $\field\psi$ is then the
potential of the layered Earth minus that of the uniform Earth: zero outside by the shell theorem, and at the centre,
with the core of radius $qR$, $q = 3480/6371$, of $12{,}505\unit{kg\,m^{-3}}$ in a mantle of $4152\unit{kg\,m^{-3}}$,

$$\field\psi(0) = -2\pi GR^2\bigl[4152 + (12{,}505 - 4152)\,q^2 - 5513\bigr]\unit{kg\,m^{-3}} = -1.9 \times 10^7\unit{J\,kg^{-1}} .$$

Here $-2\pi G\matter\rho a^2$ is the potential at the centre of a uniform ball of radius $a$, and the units are those of
$G\matter\rho R^2$, $\mathrm{m^2\,s^{-2}}$. The uniform Earth's potential at its centre is
$-2\pi G \times 5513\unit{kg\,m^{-3}} \times R^2 = -9.4 \times 10^7\unit{J\,kg^{-1}}$, so the core deepens the well at
the centre by a fifth, and no reading outside sees it.

**The outside in one piece.** Step 3 never used the shape of the outside: in a thick shell the potential of $n$
vanishes in the hollow too, because $1/|\vect x - \vect y|$ with $\vect x$ in the hollow is harmonic throughout the
shell. The shape decides instead what a camera outside can read. Its readings come from the moments of $\matter\rho$
against the functions $1/|\vect x - \vect y|$ with $\vect x$ where the camera stands. When the outside is in one piece,
these moments fix $\langle\matter\rho, h\rangle$ for every $h$ in $\mathcal H$. A harmonic density whose moments
against them all vanish has zero potential round the camera, so, by the
[uniqueness from a small ball](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball),
zero potential over the whole outside. By the last section it is then a confined Laplacian, orthogonal to itself, and
zero. So only zero is orthogonal to every function $1/|\vect x - \vect y|$ with $\vect x$ outside: these functions
come as close as we like to every member of $\mathcal H$, the analogue in space of Carl Runge's theorem of 1885 on
approximating functions in the plane.

The condition that the outside is in one piece enters only in the last section. If the body sealed a hollow, as a thick
shell does, the field in the hollow would fix moments that the field outside does not, such as those against
$1/|\vect x - \vect c|$ with $\vect c$ in the hollow, and a camera that cannot enter the hollow sees less than the
harmonic part.
:::

So every density splits as

$$\boxed{\;\matter\rho = \sym{harmonic-part}{\matter\rho_h} + \frac{\nabla^2\field\psi}{4\pi G}, \qquad \nabla^2\matter\rho_h = 0,\;}$$

with $\field\psi$ confined.[^np] The split is unique. If $\matter\rho_h + n = \matter\rho_h' + n'$, with $n$ and $n'$ in
$\mathcal N$, then $\matter\rho_h - \matter\rho_h' = n' - n$ lies in both families, so it is orthogonal to itself and
is zero.

The density $\matter\rho_h$ is the **harmonic part** of $\matter\rho$, in kilograms per cubic metre. It is also the
harmonic density closest to $\matter\rho$. For any $h$ in $\mathcal H$, the function $\matter\rho_h - h$ is in
$\mathcal H$ and so orthogonal to the remainder $n = \matter\rho - \matter\rho_h$, and Pythagoras gives

$$\int(\matter\rho - h)^2\,\dd V = \int(\matter\rho_h - h)^2\,\dd V + \int n^2\,\dd V \;\ge\; \int n^2\,\dd V ,$$

with equality only for $h = \matter\rho_h$. Finding the closest member of a family is called projecting onto it, as the
shadow of an arrow falls on a plane, so $\matter\rho_h$ is also the **harmonic projection** of $\matter\rho$. The family
$\mathcal N$ is the **null space** of the field outside: the densities that change no reading there.

Two bodies with the same outside differ by a member of $\mathcal N$, so they have the same harmonic part; and two
bodies with the same harmonic part differ by a member of $\mathcal N$, so they have the same outside. The field outside
fixes $\matter\rho_h$ completely, and is blind to the rest (Figure [](#fig:null-split)).

![The split drawn as geometry: the family $\mathcal N$ as a plane, and the family $\mathcal H$ as a line at right
angles to it. A density $\matter\rho$ is its shadow $\matter\rho_h$ on the line plus a member of $\mathcal N$ (dashed).
Every density in the lighter plane $\matter\rho_h + \mathcal N$ has the same outside, and $\matter\rho_h$ is the
shortest arrow to that plane; the families have infinitely many dimensions, and the arrows are chosen for the
drawing.](tut-null-split){#fig:null-split}

## The least assuming interior is the harmonic part, and it never shows a core

We want the interior that assumes least about what the camera cannot see. Section 2.1 described the **least assuming
picture** as built in proportion to the readings, treating every point inside alike and independently. Both halves
point to $\matter\rho_h$. The readings are the moments $\langle\matter\rho, h\rangle$, so a picture built in proportion
to them is a sum of harmonic functions, and it lies in $\mathcal H$; only $\matter\rho_h$ in $\mathcal H$ has the right
readings, since two such members would differ by a member of $\mathcal H$ orthogonal to all of $\mathcal H$. Treating
every point alike and independently means measuring a picture by $\int\matter\rho^2\,\dd V$.

This is the variation of the density. With $V$ the body's volume, $\matter M$ its mass and
$\matter{\bar\rho} = \matter M/V$ its mean density, expanding $\int(\matter\rho - \matter{\bar\rho})^2\,\dd V$ gives

$$\int\matter\rho^2\,\dd V = V\,\bigl(\matter{\bar\rho}^{\,2} + \text{variance}\bigr) ,$$

where the variance is the mean of $(\matter\rho - \matter{\bar\rho})^2$. At a fixed mass the smallest
$\int\matter\rho^2\,\dd V$ is the least variance: the density spread as evenly as the outside allows. Every interior with the given outside is $\matter\rho_h + n$, with $n$ in $\mathcal N$, and because $n$ is
orthogonal to $\matter\rho_h$ the cross term of the square vanishes:

$$\boxed{\;\int(\matter\rho_h + n)^2\,\dd V = \int\matter\rho_h^2\,\dd V + \int n^2\,\dd V \;\ge\; \int\matter\rho_h^2\,\dd V ,\;}$$

with equality only for $n = 0$: any interior other than the harmonic part adds a pattern $n$ that the readings neither
ask for nor forbid.

A real camera has noise and finitely many pixels. Section 3.5 finds its best guess when every point inside is expected
to vary by the same amount, independently of the others; with no noise and readings everywhere outside, that guess is
this projection.[^likely] "Least assuming" does not mean "most likely": a real body is free to hold any $n$.

**Two cases.** The steel ball $\matter\rho_0 + \epsilon\,\matter{\delta\rho}$ has $\int\matter\rho^2\,\dd V$ larger
than the uniform ball's by the factor $1 + 0.19\,\epsilon^2$, only $1.0019$ for $\epsilon = 0.1$. The two-layer Earth of
section 1.3, with a core of $12{,}500\unit{kg\,m^{-3}}$ in a mantle of $4150\unit{kg\,m^{-3}}$, has it larger by
1.31 than a uniform Earth of the same mass.

**What it means.** The least assuming picture is harmonic, so by the
[maximum principle](/tutorial/outside/laplace/#in-empty-space-the-potential-has-no-peak-and-no-pit) of section 2.1 its
densest and its lightest points lie on the body's surface. It can never show a core.

**A round body.** By symmetry (section 2.1) the harmonic part of a round body depends on $r$ alone. A function of $r$
alone is harmonic where $(1/r^2)\,\dd(r^2\,\dd f/\dd r)/\dd r = 0$, that is, where $r^2\,\dd f/\dd r$ is a constant
$-b$. Integrating once more gives $f = a + b/r$. Only $b = 0$ is finite at the centre, so the harmonic part is a
constant, and it has the body's mass, because the moment against $h = 1$ is the mass. **Every round body appears as a
uniform ball of its mean density.** The two-layer Earth appears as $5513\unit{kg\,m^{-3}}$ throughout, and both steel
balls of the first section as plain steel.

## The harmonic part of a nugget is a flush on the near wall

We want the harmonic part of a nugget of mass $\matter m$ at the point $\vect s$, at the distance $s$ from the centre
of a ball of radius $R$. The nugget is a point, so $\matter m\,\delta^3(\vect x - \vect s)$ has no finite $\int\matter\rho^2\,\dd V$, but its
moments are finite: $\matter Q_h = \matter m\,h(\vect s)$. We assume that **the harmonic part is the harmonic density
with these same moments**, as it is for any density with a finite $\int\matter\rho^2\,\dd V$, because the part in
$\mathcal N$ has no moments.

**A pattern that gives back its own degree.** For a pattern $Y$ of degree $\ell$ on the sky (section 2.2),

$$\oint\frac{2\ell + 1}{4\pi}\,P_\ell(\hat n\cdot\hat n')\,Y(\hat n)\,\dd\Omega = Y(\hat n') ,$$

and it gives zero for a pattern of any other degree, by the orthogonality of section 2.2. To see the first claim, we
write $Y = \sum_m a_mY_{\ell m}$, with $m$ the order and $a_m = \oint Y_{\ell m}^*\,Y\,\dd\Omega$. The
[addition theorem](/tutorial/outside/spherical-harmonics/#the-addition-theorem-turns-a-sum-over-m-into-one-legendre-polynomial)
replaces $(2\ell + 1)P_\ell/4\pi$ by $\sum_mY_{\ell m}^*(\hat n)\,Y_{\ell m}(\hat n')$, and the integral becomes
$\sum_m a_mY_{\ell m}(\hat n') = Y(\hat n')$.

**The kernel.** Every function harmonic in the ball is a sum $h(\vect x) = \sum_\ell r^\ell\,Y_\ell(\hat x)$ of the
[solid harmonics](/tutorial/outside/spherical-harmonics/#each-pattern-of-one-degree-gives-two-harmonic-functions-the-solid-harmonics),
with $Y_\ell$ a pattern of degree $\ell$, as the
[analyticity box](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage)
of section 2.4 sketched. We look for a function $K(\vect x, \vect s)$ whose integral against every such $h$ over the
ball gives $h(\vect s)$. We try a sum of solid harmonics symmetric about the direction of $\vect s$,

$$K(\vect x, \vect s) = \sum_{\ell=0}^{\infty}c_\ell\,(rs)^\ell\,\frac{2\ell + 1}{4\pi}\,P_\ell(\cos\vartheta) ,$$

where $\vartheta$ is the angle between $\vect x$ and $\vect s$ and the $c_\ell$ are numbers to be found. In the ball
$\dd V = r^2\,\dd r\,\dd\Omega$. The integral over directions picks out the degree $\ell$ of $h$, and the integral over
the radius is $\int_0^R r^{2\ell+2}\,\dd r = R^{2\ell+3}/(2\ell + 3)$, so

$$\int_{\rm ball}K(\vect x, \vect s)\,h(\vect x)\,\dd V = \sum_\ell c_\ell\,\frac{R^{2\ell+3}}{2\ell + 3}\,s^\ell\,Y_\ell(\hat s) .$$

This equals $h(\vect s) = \sum_\ell s^\ell\,Y_\ell(\hat s)$ for every $h$ when $c_\ell = (2\ell + 3)/R^{2\ell+3}$. With
$t = sr/R^2$, which is less than 1 in the ball,

$$K(\vect x, \vect s) = \frac{1}{4\pi R^3}\sum_{\ell=0}^{\infty}(2\ell + 1)(2\ell + 3)\,t^\ell P_\ell(\cos\vartheta) ,$$

in $\mathrm{m^{-3}}$. A function whose integral against every harmonic function over a region gives back that
function's value at $\vect s$ is the **reproducing kernel** of the region, also called its harmonic **Bergman kernel**.
Each term is a solid harmonic in $\vect x$, so $K$ is harmonic in the ball. The Poisson kernel $P$ of section 2.4 does the
same from the values on the sphere alone: $\oint P(\vect x, \vect s)\,h(\vect x)\,\dd A = h(\vect s)$.

**The flush.** The density $\matter m\,K(\vect x, \vect s)$ is harmonic and has the moment $\matter m\,h(\vect s)$
against every harmonic $h$: the nugget's moments. Only one harmonic density has them, because two such densities
would differ by a harmonic density orthogonal to every harmonic density, which is zero. So

$$\boxed{\;\begin{aligned}\matter\rho_h &= \matter m\,K(\vect x, \vect s)\\ &= \frac{\matter m}{4\pi R^3}\sum_{\ell=0}^{\infty}(2\ell + 1)(2\ell + 3)\Bigl(\frac{sr}{R^2}\Bigr)^\ell P_\ell(\cos\vartheta) .\end{aligned}\;} \label{eq:flush}$$

The unit is that of $\matter m/R^3$, a density. The flush is $\matter m\,K$ and the skin is $\matter m\,P$: the nugget
reproduced over the volume and over the surface. The terms shrink as $\ell^2t^\ell$, so the sum converges, and the
method of section 2.4 gives its closed form:

$$\frac{4\pi R^3}{\matter m}\,\matter\rho_h = \frac{3 - 10t^2 + 8t^3\cos\vartheta - t^4}{(1 - 2t\cos\vartheta + t^2)^{5/2}} .$$

For the nugget halfway out, $s = R/2$:

- at the near wall, $r = R$ and $\vartheta = 0$. The denominator is $(1 - t)^5$ and the numerator is
  $(1 - t)^2(3 + 6t - t^2)$, so the flush there is $(3 + 6t - t^2)/(1 - t)^3$ in units of $\matter m/4\pi R^3$. With
  $t = \tfrac12$ it is $5.75/0.125 = 46$. Spread evenly, the gold would have $3\matter m/4\pi R^3$, so the flush is 15.3
  times denser there;
- at the far wall, $\vartheta = \pi$, it gives $-\tfrac{2}{27} = -0.074$, a little below zero, in a small cap that holds
  $3.0 \times 10^{-4}$ of the gold's mass;
- at the centre only $\ell = 0$ survives, and the flush is $3\matter m/4\pi R^3$, as the
  [mean value property](/tutorial/outside/laplace/#the-value-at-the-centre-of-a-sphere-is-the-average-over-the-sphere)
  demands of a harmonic function.

For a nugget of 1 kg in the steel ball, $\matter m/4\pi R^3$ is $80\unit{kg\,m^{-3}}$: the flush adds
$3700\unit{kg\,m^{-3}}$ to the steel at the near wall and takes $5.9\unit{kg\,m^{-3}}$ away at the far wall, where the
steel keeps the total positive. Gold alone, spread this way, would be negative there, so a least assuming picture can
be unphysical in a small region; section 3.9 adds the fact that mass is positive.

**Two checks.** Integrated over the ball, every term with $\ell \ge 1$ gives zero, being orthogonal to the constant, so
the flush has the mass $\matter m$. The same holds for $\int\matter\rho_h\,r^2\,\dd V$, because $r^2$ depends on $r$
alone, and the term $\ell = 0$ gives

$$\int\matter\rho_h\,r^2\,\dd V = \frac{3\matter m}{4\pi R^3}\int_0^R r^2\,4\pi r^2\,\dd r = \frac35\,\matter mR^2$$

for every $s$. The flush's potential at $\vect X = (2R, 0, R)$, with the nugget on the $z$ axis, integrates numerically to
$-0.485071\,G\matter m/R$, the nugget's own value and the skin's of section 2.4.

**Limits.** As $s \to 0$, every term with $\ell \ge 1$ vanishes, and a nugget at the centre appears as gold spread
evenly: the shell theorem again. As the nugget nears the wall the near-wall peak grows without limit, as
$8/(1 - s/R)^3$. It is $10.5$ for $s = 0.25R$, 46 for $0.5R$ and 444 for $0.75R$, in units of $\matter m/4\pi R^3$
(Figure [](#fig:null-flush)).

![The flush along the diameter through the nugget, from the far wall to the near wall, for $s = 0.25R$, $0.5R$ and
$0.75R$, in units of $\matter m/4\pi R^3$. All three pass through 3 at the centre and peak at the near wall; at the far
wall they reach 0.736, $-0.074$ and $-0.385$, and the dips below zero are shaded. The vertical axis is logarithmic above
1 and nearly linear about zero.](tut-null-flush){#fig:null-flush}

## The nugget, the flush and the skin differ only in what the outside cannot read

The third body is the skin of section 2.4. Replacing a mass inside a region by a layer on the region's boundary with
the same field outside is called
[balayage](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage),
French for sweeping. Section 2.4 swept the nugget onto the sphere $|\vect x| = R$ as a skin of surface density
$\sym{surface-density}{\matter\sigma} = \matter m\,P(\vect x, \vect s) = \matter m(R^2 - s^2)/4\pi R\,|\vect x -
\vect s|^3$, in kilograms per square metre. For $s = R/2$ it is $6\,\matter m/4\pi R^2$ over the nugget and $0.22$ in
the same unit opposite.

The nugget and the skin hold their mass in no volume, so neither has a finite $\int\matter\rho^2\,\dd V$. All three have
the moments $\matter m\,h(\vect s)$ (the skin's because $P$ reproduces $h(\vect s)$ from the sphere). The potentials of the skin and the nugget agree outside the
ball, but their difference is not confined: it grows as $G\matter m/|\vect x - \vect s|$ near the nugget, and its slope
jumps across the skin.

Outside the ball, then, the gold's share of the potential is the nugget's, $-G\matter m/|\vect x - \vect s|$, for all
three bodies. Its equipotentials there are spheres centred on the nugget's place, for the flush and the skin as well,
which hold no mass at that place.

The three bodies agree in every moment, and only the flush has a finite $\int\matter\rho^2\,\dd V$: that is the sense
in which it is the least assuming. They differ in $\int\matter\rho\,r^2\,\dd V$, which for $s = R/2$ is

$$\matter ms^2 = 0.25\,\matter mR^2, \qquad \tfrac35\,\matter mR^2 = 0.6\,\matter mR^2, \qquad \matter mR^2$$

for the nugget, the flush and the skin. The function $r^2$ is not harmonic, so the outside cannot read these numbers.

The moment of inertia contains them. We spin the ball about the $x$ axis, through its centre and perpendicular to the
line to the nugget, which lies on the $z$ axis. Section 1.6 split the moment of inertia about it as
$I_x = \tfrac23\int\matter\rho\,r^2\,\dd V + \int\matter\rho\,(r^2/3 - x^2)\,\dd V$. The second integrand is harmonic,
so the three bodies share the second integral, which for the nugget is $\matter m(s^2/3 - 0) = 0.083\,\matter mR^2$.
The gold's shares of the moment of inertia are therefore, in units of $\matter mR^2$,

$$\begin{aligned}\text{nugget:}&\quad \tfrac23 \times 0.25 + 0.083 = 0.25,\\ \text{flush:}&\quad \tfrac23 \times 0.6 + 0.083 = 0.483,\\ \text{skin:}&\quad \tfrac23 \times 1 + 0.083 = 0.75,\end{aligned}$$

that is 0.25, 0.48 and 0.75 (Figure [](#fig:null-moments)). Their derivations are problems of
[section 1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one) and
[section 2.4](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage).

![The gold's share of the moment of inertia $I_x$ for the nugget at $s = R/2$, its flush and its skin, in units of
$\matter mR^2$. The full-coloured lower part of each bar, $0.083\,\matter mR^2$, comes from a harmonic integrand and
is the same for all three; the fainter upper part is two thirds of $\int\matter\rho\,r^2\,\dd V$, which the outside
cannot read. Under the bars the flush and the skin are shaded in steps that double in density, and the nugget's size
and the skin's band are chosen for the drawing.](tut-null-moments){#fig:null-moments}

Several readings break the tie, and each needs more than the steady pull outside:

- **spin**: a turning body adds to its tide a part made by its moving mass, as moving charge makes magnetism, and that
  part measures its angular momentum ([section 7.5](/tutorial/geometry/gravitomagnetism/#a-spinning-round-body-is-a-spin-dipole));
- **a kick**: a brief tide leaves an energy that grows with $\int\matter\rho\,r^2\,\dd V$
  ([section 1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside));
- **heat**: a warm body's pull trembles, and the size of the tremble holds the same integral
  ([section R4](/tutorial/response/reading-section-iv-3/));
- **a pixel inside the matter**, whose trace $4\pi G\matter\rho$ reads the density where it stands
  ([section 1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point)).

The null space belongs to a reading of the field at one time, not to gravity itself.[^later]

::: try {#same-outside}
The figure opens on round bodies; choose *Gold off centre*. Ball A holds the nugget, ball B its flush, and the line
under each ball gives the nugget's distance from the centre or the densest value of the flush or skin. Predict first: as
the nugget moves from the centre towards the wall, does the flush's densest value grow or shrink, and does its
$\int\matter\rho\,r^2\,\dd V$ in the table change? Move the slider and check. The prediction at the top of the figure is
now about the skin: answer it before you make B the skin, then compare the blue equipotentials outside A and B.
:::

## A uniform sheet is invisible to a tidal camera

Everything so far holds for any reading of the field outside. A tidal camera reads only second derivatives of the
potential, so a change that alters the potential only by $a + \vect b\cdot\vect x$ changes the pull by a constant
vector and the tide not at all, as section 1.4 showed for a
[uniform pull](/tutorial/newton/tides/#falling-together-cancels-the-pull-but-not-its-difference).

An infinite uniform sheet makes such a change. It pulls toward itself with $2\pi G\matter\sigma$ at every height
([section 1.3](/tutorial/newton/gauss-and-poisson/#a-uniform-sheet-pulls-equally-at-every-height)), where
$\matter\sigma$ is its mass per unit area, so on each side its potential is linear in the height. The locked safe's room, with its floor taken as an infinite
sheet of concrete of $720\unit{kg\,m^{-2}}$, has the same tide everywhere above the floor as the same room with no
floor. A gravimeter tells them apart at once: the sheet pulls with $3.0 \times 10^{-7}\unit{m\,s^{-2}}$, sixty-five
times the pull of the person at a metre.

A real floor is finite, and its edges make a tide, $4.5 \times 10^{-8}\unit{s^{-2}}$ for the safe's camera (section 1.3).
Section 2.7 shows that a flat camera's reading of each ripple of a layer carries a factor $k$, the wavenumber, equal to
$2\pi$ over the distance between the ripple's crests (section 2.6). A layer that does not vary has $k = 0$, so the
camera sees only a layer's edges and variations.[^array]

**The idea to keep: the field outside a body fixes exactly the harmonic part of its density and nothing else. Any
confined Laplacian can be added inside unseen, so the least assuming picture is the harmonic part, which puts its
densest and lightest points on the surface and shows every round body as uniform.**

::: problems
### Practice

**[2.5]** For $\field\psi = A(1 - r^2/R^2)^2$, show that $\matter{\delta\rho} = \nabla^2\field\psi/4\pi G$ has zero total mass and
that $\int\matter{\delta\rho}\,r^2\,\dd V = 16AR^3/35G$. For the steel ball of the first section, with
$A = \pi GR^2\matter\rho_0/3$, by what factor does $\int\matter\rho\,r^2\,\dd V$ grow when $\matter{\delta\rho}$ is
added?

::: solution
With $u = r/R$, $\matter{\delta\rho} = (A/4\pi GR^2)(20u^2 - 12)$ and $\dd V = 4\pi R^3u^2\,\dd u$. The mass is
$(AR/G)\int_0^1(20u^4 - 12u^2)\,\dd u = (AR/G)(4 - 4) = 0$. With one more factor $r^2 = R^2u^2$,

$$\int\matter{\delta\rho}\,r^2\,\dd V = \frac{AR^3}{G}\Bigl(\frac{20}{7} - \frac{12}{5}\Bigr) = \frac{16AR^3}{35G} .$$

For the steel this is $16\pi\matter\rho_0R^5/105$. The uniform ball has $\int\matter\rho_0r^2\,\dd V =
\tfrac45\pi\matter\rho_0R^5 = 84\pi\matter\rho_0R^5/105$, so the integral grows by the factor $100/84 = 1.19$, and
$\matter\rho_0 - \matter{\delta\rho}$ gives $68/84 = 0.81$.
:::

**[2.5]** Show that the weight $w_\varepsilon = c\,(1 - |\vect x|^2/\varepsilon^2)^2$ of the box on the split has the
integral 1 for $c = 105/32\pi\varepsilon^3$, and that averaging a harmonic function $h$ with it gives back $h$.

::: solution
In shells of volume $4\pi r^2\,\dd r$, with $u = r/\varepsilon$, the integral is
$4\pi c\,\varepsilon^3\int_0^1(u^2 - 2u^4 + u^6)\,\dd u = 4\pi c\,\varepsilon^3(\tfrac13 - \tfrac25 + \tfrac17) =
\tfrac{32}{105}\pi c\,\varepsilon^3$, which is 1 for the stated $c$. The average of $h$ round $\vect x$ is a sum over
spheres about $\vect x$, each weighted by $4\pi r^2 w_\varepsilon(r)\,\dd r$; on each sphere the average of $h$ is
$h(\vect x)$ by the mean value property, so the whole is $h(\vect x)$ times the integral of the weight, which is 1.
:::

### Stretch

**[2.5]** A uniform shell of density $\matter\rho$ fills the space between the radii $R/2$ and $R$, and a skin of the
same mass lies on the sphere of radius $R$. Both pull alike everywhere outside, and neither makes any pull or tide in
the hollow. Compare their moments against $h = 1/r$, which is harmonic throughout the shell, and say what instrument
could tell the two apart.

::: solution
The thick shell has $\int\matter\rho/r\,\dd V = 4\pi\matter\rho\int_{R/2}^Rr\,\dd r = \tfrac32\pi\matter\rho R^2$. Its
mass is $\tfrac{4\pi}{3}\matter\rho\,\tfrac78R^3 = \tfrac76\pi\matter\rho R^3$, so the skin has $\matter M/R =
\tfrac76\pi\matter\rho R^2$. The moments differ by the factor $9/7 = 1.29$. Each moment is $-1/G$ times the potential at
the centre, which is the same throughout the hollow, so the two hollows sit at potentials that differ by 29 per cent.
A tidal camera, inside or outside, reads neither; a clock in the hollow, compared with one far away, reads the
difference. The difference of the two densities is not a confined Laplacian, because the space outside the matter
is in two pieces and the two potentials agree in only one of them.
:::

**[2.5]** The
[analyticity box](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage)
of section 2.4 found $(1 - t^2)/D^{3/2} = \sum_\ell(2\ell + 1)\,t^\ell P_\ell(\mu)$, with $D = 1 - 2t\mu + t^2$, by
applying $1 + 2t\,\partial/\partial t$, which multiplies $t^\ell$ by $2\ell + 1$, to the generating function. Apply
$3 + 2t\,\partial/\partial t$, which multiplies $t^\ell$ by $2\ell + 3$, to this series, and so derive the closed form
of the flush. Then find the flush at the near wall, $\mu = 1$, as a function of $t$.

::: solution
The derivative of $(1 - t^2)D^{-3/2}$ with respect to $t$ is $-2tD^{-3/2} + 3(1 - t^2)(\mu - t)D^{-5/2}$. So

$$\Bigl(3 + 2t\frac{\partial}{\partial t}\Bigr)\frac{1 - t^2}{D^{3/2}} = \frac{(3 - 7t^2)D + 6t(1 - t^2)(\mu - t)}{D^{5/2}} .$$

Expanding, $(3 - 7t^2)D = 3 - 6t\mu - 4t^2 + 14t^3\mu - 7t^4$ and $6t(1 - t^2)(\mu - t) = 6t\mu - 6t^2 - 6t^3\mu +
6t^4$. The sum is $3 - 10t^2 + 8t^3\mu - t^4$, the numerator of the closed form, and the series is $\sum_\ell(2\ell +
1)(2\ell + 3)\,t^\ell P_\ell(\mu)$, which is $4\pi R^3\matter\rho_h/\matter m$. At $\mu = 1$, $D = (1 - t)^2$ and the
numerator is $(1 - t)^2(3 + 6t - t^2)$, so the near wall has $(3 + 6t - t^2)/(1 - t)^3$, which is 46 at $t = \tfrac12$.
:::

### The camera

**[2.5]** For a nugget at $s = R/2$ the flush is $46\,\matter m/4\pi R^3$ at the near wall, which is fifteen times the
nugget's mass spread evenly, and it dips a little below zero at the far wall. Check both from the series
[](#eq:flush), using $\sum_\ell x^\ell = 1/(1 - x)$, $\sum_\ell\ell x^\ell = x/(1 - x)^2$ and
$\sum_\ell\ell^2x^\ell = x(1 + x)/(1 - x)^3$ for $|x| < 1$.

::: solution
At the near wall $P_\ell(1) = 1$ and $sr/R^2 = \tfrac12$, so we need $\sum_\ell(4\ell^2 + 8\ell + 3)x^\ell$ at
$x = \tfrac12$. The three sums are 6, 2 and 2, so the total is $4 \times 6 + 8 \times 2 + 3 \times 2 = 46$, and
$46/3 = 15.3$. At the far wall $P_\ell(-1) = (-1)^\ell$, so $x = -\tfrac12$, and the sums are $-\tfrac{2}{27}$,
$-\tfrac29$ and $\tfrac23$. The total is $-\tfrac{8}{27} - \tfrac{48}{27} + \tfrac{54}{27} = -\tfrac{2}{27} = -0.074$,
a little below zero.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field): $\delta\rho = \nabla^2\psi/4\pi G$, equations [](/paper/#eq:split) and
  [](/paper/#eq:harmonic-point), the round body at $5513\unit{kg\,m^{-3}}$, Figure [](/paper/#fig:same-outside), and
  equation [](/paper/#eq:array-data) with the invisible uniform sheet. Equation [](/paper/#eq:wiener) is section 3.5's.
- [Section XII](/paper/#sec:hair), [XIII](/paper/#sec:second-order) and the
  [holography section](/paper/#sec:holography): the null space belongs to a reading at one time (sections
  [13.2](/tutorial/what-a-field-keeps/calderon/#the-null-space-belongs-to-one-reading-not-to-gravity),
  [13.3](/tutorial/what-a-field-keeps/ladder/#two-bodies-that-no-quadrupolar-tide-tells-apart) and
  [13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell)); Table
  [](/paper/#tab:null) lists what the camera cannot see.
:::

::: deeper
- Victor Isakov, *Inverse Source Problems* (American Mathematical Society, 1990): the exterior inverse problem and the
  orthogonal split, with the proofs skipped here.
- Hermann Weyl, "The method of orthogonal projection in potential theory", *Duke Mathematical Journal* 7 (1940).
- Sheldon Axler, Paul Bourdon and Wade Ramey, *Harmonic Function Theory* (Springer, 2nd edition, 2001), chapter 8:
  the reproducing kernel of the ball.
- Ulvi Yurtsever, Caren Marzban and Marina Meilă, "On the gravitational inverse problem" (2010, arXiv:1004.4939).
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, with the flush, the skin and the
    nugget in its Fig. [](/paper/#fig:same-outside).

[^jump]: Poisson's equation holds across a jump of the density in an integrated sense (section 2.4), which is all the
    argument needs.

[^eps]: Here $\epsilon$ is a pure number. The value $\epsilon = 1$ is the largest for which
    $\matter\rho_0 + \epsilon\,\matter{\delta\rho}$ is nowhere negative, since its centre has
    $(1 - \epsilon)\matter\rho_0$.

[^weak]: For an unbounded $n$ the gradient of its potential may fail to be continuous at the surface, and
    $\field\psi$ is confined in the integrated sense that Isakov's book makes precise [@Isakov1990].

[^layer]: Such a layer makes the pull jump by $4\pi G$ times its surface density (the pillbox of section 1.3).

[^np]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation [](/paper/#eq:split);
    the nugget's flush is its equation [](/paper/#eq:harmonic-point).

[^likely]: With finitely many pixels the noiseless best guess is harmonic but not $\matter\rho_h$; section 3.5 derives it, first shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, equation [](/paper/#eq:wiener).

[^later]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII; sections 13.2 and 13.3 treat it.

[^array]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:array-data).
