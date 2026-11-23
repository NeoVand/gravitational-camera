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

The paper's Figure [](/paper/#fig:same-outside) shows three steel balls, each holding the same mass $\matter m$ of
gold. In the first the gold is a small nugget halfway from the centre to the wall. In the second it is spread through
the ball as a **flush**, the paper's word, densest at the wall nearest the nugget's place. In the third it lies on the
surface as a thin **skin**, thickest over that place. Chapter 2.4 derived the skin. Outside the ball the three pull
exactly alike, at every point and however close a camera comes.

{{paper fig:same-outside}}

So we ask which part of a body's density the field outside fixes, and which part it can never see. Chapter 2.3 built
the field outside from the moments of the mass and
[promised](/tutorial/outside/multipoles/#at-the-cameras-own-place-the-tide-stays-finite-while-the-tidal-column-grows-without-limit)
that many interiors share every one of them. This chapter builds those interiors, finds the part they share, and shows
why the picture that assumes least can never show a core.

::: plain
Mass can be moved about inside a body without changing its pull anywhere outside. Take any smooth bump of potential
that is zero outside the body, and add the matter that would make that bump. The potential changes by the bump, which
is zero outside, so nothing outside changes. A cored Earth and a uniform Earth of the same mass are one such pair.

Every density splits in one way into two parts. One part is harmonic: like the potential in empty space, its value at
each point is the average of the values round it. The other part is made by bumps of the kind above. The field outside
fixes the harmonic part completely and cannot see the other part at all.

Of all the interiors that pull alike outside, the harmonic part has the least contrast. So the picture that assumes
least is harmonic, and a harmonic function has its largest and smallest values on the surface: that picture can never
show a dense core. Spin, a kick, heat, or a sensor inside the matter can tell the interiors apart.
:::

## A confined Laplacian added to a body changes nothing outside

We want to change a body's interior without changing anything outside it. Let $\sym{null-potential}{\field\psi}$ be a
function of position in joules per kilogram, the unit of a potential. We assume that **$\field\psi$ is zero everywhere
outside the body** and that **$\field\psi$ and its gradient are continuous everywhere**. Then both $\field\psi$ and its
gradient are zero on the body's surface, because they are continuous and zero outside it. We call such a function
**confined** to the body. Its second derivatives may jump at the surface, as a density does where steel meets
air.[^jump]

Let $\field\Phi$ be the potential of the body's density $\matter\rho$, in kilograms per cubic metre. We add to the body
the density

$$\matter{\delta\rho} = \frac{\nabla^2\field\psi}{4\pi G} ,$$

in kilograms per cubic metre, which is zero outside the body because $\field\psi$ is. We claim that the new potential is
$\field\Phi + \field\psi$. It satisfies [Poisson's
equation](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point) for the new density,
because

$$\begin{aligned}\nabla^2(\field\Phi + \field\psi) &= 4\pi G\matter\rho + \nabla^2\field\psi\\ &= 4\pi G(\matter\rho + \matter{\delta\rho}) .\end{aligned}$$

It also falls to zero far away, because $\field\psi$ is zero there. Chapter 2.1 proved that only one potential does
both ([uniqueness](/tutorial/outside/laplace/#the-values-on-a-closed-surface-fix-the-potential-inside), in its last
paragraph). So the new potential is

$$\boxed{\;\field\Phi_{\rm new} = \field\Phi + \field\psi ,\;}$$

which equals $\field\Phi$ everywhere outside the body.

Every reading outside is made from the potential there: the pull is its gradient, a pixel's tide is its table of
second derivatives, and each column of chapter 2.3 is a sum of these. So no reading changes outside, at any sensitivity.

Finding a body's density from its field outside is called the **exterior inverse problem**. An **inverse problem**, in
general, asks for causes from their effects. This one has many answers, because $\matter{\delta\rho}$ can be added
freely. We now build some of them, as chapter 1.3 built its two Earths: an **impossibility result** is a pair of scenes,
built explicitly, that a camera cannot tell apart.

**Steel balls that pull alike.** Take the steel ball of chapter 2.4, of radius $R = 0.1\unit{m}$ and density
$\matter\rho_0 = 7850\unit{kg\,m^{-3}}$, whose mass is $32.9\unit{kg}$. Inside it we take

$$\field\psi = A\Bigl(1 - \frac{r^2}{R^2}\Bigr)^2 ,$$

and $\field\psi = 0$ outside, where $r$ is the distance from the centre and $A$ is a constant in joules per kilogram.
At $r = R$ both $\field\psi$ and its slope $\dd\field\psi/\dd r = -(4Ar/R^2)(1 - r^2/R^2)$ are zero, so $\field\psi$ is
confined. Chapter 2.2 gave the Laplacian of a function of $r$ alone as $(1/r^2)\,\dd(r^2\,\dd\field\psi/\dd r)/\dd r$
([its first section](/tutorial/outside/spherical-harmonics/#the-laplacian-splits-into-a-part-along-the-radius-and-a-part-on-the-sphere)).
Here $r^2\,\dd\field\psi/\dd r = -4Ar^3/R^2 + 4Ar^5/R^4$; we differentiate and divide by $r^2$:

$$\begin{gathered}\nabla^2\field\psi = \frac{A}{R^2}\Bigl(\frac{20r^2}{R^2} - 12\Bigr),\\ \matter{\delta\rho} = \frac{A}{4\pi GR^2}\Bigl(\frac{20r^2}{R^2} - 12\Bigr).\end{gathered}$$

The unit is right: joules per kilogram, which is $\mathrm{m^2\,s^{-2}}$, divided by $G$ in
$\mathrm{m^3\,kg^{-1}\,s^{-2}}$ and by a square metre, gives $\mathrm{kg\,m^{-3}}$. The added mass is zero, as it must
be, since the mass sets the field far away. In shells of volume $4\pi r^2\,\dd r$, with $u = r/R$,

$$\begin{aligned}\int\matter{\delta\rho}\,\dd V &= \frac{AR}{G}\int_0^1\bigl(20u^4 - 12u^2\bigr)\,\dd u\\ &= \frac{AR}{G}\,(4 - 4) = 0 .\end{aligned}$$

We choose $A = \pi GR^2\matter\rho_0/3 = 5.5 \times 10^{-9}\unit{J\,kg^{-1}}$, a sixth of the size of the ball's own
potential at its centre, $-3.3 \times 10^{-8}\unit{J\,kg^{-1}}$ (chapter 2.4). Then
$\matter{\delta\rho} = \matter\rho_0(5r^2/3R^2 - 1)$, and the paper's "ordinary positive densities
$\rho_0 \pm \epsilon\,\delta\rho$", with $\epsilon = 1$, are[^eps]

$$\begin{aligned}\matter\rho_0 + \matter{\delta\rho} &= \frac{5\matter\rho_0}{3}\,\frac{r^2}{R^2},\\ \matter\rho_0 - \matter{\delta\rho} &= \matter\rho_0\Bigl(2 - \frac{5}{3}\,\frac{r^2}{R^2}\Bigr).\end{aligned}$$

The first ball is empty at its centre and reaches $1.67\matter\rho_0 = 13{,}100\unit{kg\,m^{-3}}$ at its surface. The
second has a core twice as dense as steel, $15{,}700\unit{kg\,m^{-3}}$, and thins to $2600\unit{kg\,m^{-3}}$ at the
surface. Both are real, positive bodies of 32.9 kg, and both pull exactly like the uniform ball at every point outside
(Figure [](#fig:null-balls)). Inside, they differ. The integral $\int\matter\rho\,r^2\,\dd V$ of chapter 1.6, which
measures how far the mass lies from the centre, is 1.19 times the uniform ball's for the first and 0.81 times for the
second (the practice problem).

Their moments of inertia, $0.157\unit{kg\,m^2}$ for the first ball, 0.132 for the uniform one and 0.106 for the second,
contain this integral ([chapter 1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)),
so spinning the balls would tell them apart. The steady pull outside cannot tell them apart.

Chapter 1.3's two Earths are another case. There $\field\psi$ is the potential of the two-layer Earth minus that of the
uniform Earth. It is zero outside by the shell theorem, and its slope is zero at the surface because both Earths pull
with $G\matter M/R^2$ there, where $\matter M$ is the Earth's mass. A thick uniform shell and a uniform ball of the same
mass work too, but a thin shell does not, because it is a layer of mass on a surface and the pull jumps across it.

![Three steel balls of radius $R = 0.1\unit{m}$ cut through their centres, shaded by density on one scale. The
first, $\matter\rho_0 + \matter{\delta\rho}$, is empty at its centre and $1.67\matter\rho_0$ at its surface; the
second is uniform; the third, $\matter\rho_0 - \matter{\delta\rho}$, has $2\matter\rho_0$ at its centre and
$\matter\rho_0/3$ at its surface. The grey arrows give the pull at $1.5R$ and $2R$ from each centre, the same for all
three, while the moments of inertia differ; the arrows' common scale is chosen for the
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

**A check.** For the first steel ball and the uniform one, $\field\psi$ is the difference of their potentials, which
is $A(1 - r^2/R^2)^2$, the function we started from.

Chapter 2.3 described the field outside in another way, as the list of
[moments](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments)
$\matter Q_h = \int\matter\rho\,h\,\dd V$, one for each function $h$ harmonic in the body. A confined Laplacian has
none of them. Chapter 2.1's
[Green's second identity](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other)
moves the Laplacian onto $h$, with no terms on the surface because $\field\psi$ and its gradient vanish there:
$\int h\,\nabla^2\field\psi\,\dd V = \int\field\psi\,\nabla^2h\,\dd V = 0$. So we have three statements about two
densities in a body:

1. they give the same field everywhere outside;
2. they have the same moment $\matter Q_h$ against every function $h$ harmonic in the body;
3. they differ by a confined Laplacian, $\nabla^2\field\psi/4\pi G$.

This section proved that 1 gives 3, and the last section that 3 gives 1. Green's identity shows that 3 gives 2. For
the step from 2 back to 1, chapter 2.3 built the field outside any sphere that encloses the body from the moments
against the solid harmonics, so the same moments give the same field outside that sphere. The difference of the two
potentials is then harmonic outside the body and zero outside the sphere. Chapter 2.1 showed that a harmonic function
is [fixed by its values in any small ball](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball),
so the difference is zero over the whole outside, which is in one piece. So the three statements are one.

## Every density splits into a harmonic part and a part the outside cannot see

We now treat the densities in a body as vectors. For two functions $f$ and $g$ in the body we write

$$\sym{inner-product}{\langle f, g\rangle} = \int_{\rm body} f\,g\,\dd V ,$$

the **inner product** of the two functions. It plays the part of the dot product of chapter 1.1, with one entry for
each point of the body, as chapter 2.2's integral over the sky did for
[patterns](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them).
For two densities it is in $\mathrm{kg^2\,m^{-3}}$. Two functions are **orthogonal** when their inner product is zero,
and $\langle f, f\rangle = \int f^2\,\dd V$ is the square of the length of $f$. We consider only densities with a
finite $\int\matter\rho^2\,\dd V$.

Two families of densities matter here. The first, $\sym{harmonic-family}{\mathcal H}$, holds the densities that are
harmonic in the body.[^script] The second, $\sym{null-family}{\mathcal N}$, holds the confined Laplacians
$\nabla^2\field\psi/4\pi G$. In each family, the sum of two members and a member times a number are members again. The
identity of the last section, $\int h\,\nabla^2\field\psi\,\dd V = 0$, says that every member of $\mathcal H$ is
orthogonal to every member of $\mathcal N$. The two families stand at right angles, like a line and a plane
perpendicular to it.

The step we state, at depth B, is that **the two families together make up every density**: every $\matter\rho$ is a
member of $\mathcal H$ plus a member of $\mathcal N$. The sketch has two parts. First, only zero is orthogonal to both
families. Let a smooth density $f$ be orthogonal to every member of $\mathcal N$. Green's second identity moves the
Laplacian from $\field\psi$ to $f$, so $\int\field\psi\,\nabla^2 f\,\dd V = 0$ for every confined $\field\psi$. If
$\nabla^2 f$ were positive at a point $\vect x_0$, it would be positive in a small ball of radius $a$ round $\vect x_0$,
because it is continuous. The bump $\field\psi = A(1 - |\vect x - \vect x_0|^2/a^2)^2$ in that ball, with $A > 0$, and
zero outside it, is confined and nowhere negative, so $\int\field\psi\,\nabla^2 f\,\dd V$ would be positive. The same
bump rules out a negative value, so $\nabla^2 f = 0$ and $f$ is in $\mathcal H$. If $f$ is orthogonal to $\mathcal H$ as
well, then $\int f^2\,\dd V = 0$ and $f = 0$.

Second, in a space of finitely many dimensions that settles it. If the sums of a member of $\mathcal H$ and a member of
$\mathcal N$ did not fill the whole space, some vector other than zero would stand at right angles to all of them, as a
plane through the origin has a normal. That vector would be orthogonal to both families, and so it would be zero.

::: gap
Densities form a space with infinitely many dimensions, and there the second part needs limits: the family
$\mathcal N$ must include every density that members of $\mathcal N$ approach, in the sense that
$\int(\text{difference})^2\,\dd V$ goes to zero. For a density $f$ that is not smooth, the conclusion $\nabla^2 f = 0$
needs Weyl's lemma (Hermann Weyl, 1940): a function orthogonal to every confined Laplacian is harmonic. Isakov's book
[@Isakov1990] proves both. The split holds in every bounded body, whatever the shape of its outside.

The condition that the outside is in one piece enters only in the last section, where $\field\psi$ kept one value over
the whole outside. If the body sealed a hollow, as a thick shell does, the field in the hollow would fix moments that
the field outside does not, such as those against $1/|\vect x - \vect c|$ with $\vect c$ in the hollow. The hollow is an
outside of its own, and a camera that cannot enter it sees less than the harmonic part.
:::

So every density splits as

$$\boxed{\;\matter\rho = \sym{harmonic-part}{\matter\rho_h} + \frac{\nabla^2\field\psi}{4\pi G}, \qquad \nabla^2\matter\rho_h = 0,\;}$$

with $\field\psi$ confined. The split is unique. If $\matter\rho_h + n = \matter\rho_h' + n'$, with $n$ and $n'$ in
$\mathcal N$, then $\matter\rho_h - \matter\rho_h' = n' - n$ lies in both families, so it is orthogonal to itself and
is zero. This is the paper's equation:

{{paper eq:split}}

The density $\matter\rho_h$ is the **harmonic part** of $\matter\rho$, in kilograms per cubic metre. It is also the
harmonic density closest to $\matter\rho$. For any $h$ in $\mathcal H$, the function $\matter\rho_h - h$ is in
$\mathcal H$ and so orthogonal to the remainder $n = \matter\rho - \matter\rho_h$, and Pythagoras gives

$$\int(\matter\rho - h)^2\,\dd V = \int(\matter\rho_h - h)^2\,\dd V + \int n^2\,\dd V \;\ge\; \int n^2\,\dd V ,$$

with equality only for $h = \matter\rho_h$. Finding the closest member of a family is called projecting onto it, as the
shadow of an arrow falls on a plane, so $\matter\rho_h$ is also called the **harmonic projection** of $\matter\rho$. The
family $\mathcal N$ is the **null space** of the field outside: the densities that change no reading there.

By the last section, two bodies with the same outside differ by a member of $\mathcal N$, so they have the same
harmonic part; and two bodies with the same harmonic part differ by a member of $\mathcal N$, so they have the same
outside. The field outside fixes $\matter\rho_h$ completely, and is blind to the rest (Figure [](#fig:null-split)).

![The split drawn as geometry: the family $\mathcal N$ as a plane, and the family $\mathcal H$ as a line at right
angles to it. A density $\matter\rho$ is its shadow $\matter\rho_h$ on the line plus a member of $\mathcal N$ (dashed).
Every density in the lighter plane $\matter\rho_h + \mathcal N$ has the same outside, and $\matter\rho_h$ is the
shortest arrow to that plane; the families have infinitely many dimensions, and the arrows are chosen for the
drawing.](tut-null-split){#fig:null-split}

## The least assuming interior is the harmonic part, and it never shows a core

We want the interior that assumes least about what the camera cannot see. Chapter 2.1 described the **least assuming
picture** as built in proportion to the readings, treating every point inside alike and independently. Both halves
point to $\matter\rho_h$. The readings are the moments $\langle\matter\rho, h\rangle$, so a picture built in
proportion to them is a sum of harmonic functions $h$, and it lies in $\mathcal H$. The only member of $\mathcal H$ with
the right readings is $\matter\rho_h$, because two such members would differ by a member of $\mathcal H$ orthogonal to
all of $\mathcal H$. Treating every point alike and independently means measuring a picture by
$\int\matter\rho^2\,\dd V$, which gives each point's square the same weight and multiplies no point by another.

This measure is the variation of the density. Let $V$ be the body's volume, $\matter M$ its mass and
$\matter{\bar\rho} = \matter M/V$ its mean density. Expanding the square in $\int(\matter\rho -
\matter{\bar\rho})^2\,\dd V$ gives

$$\int\matter\rho^2\,\dd V = V\,\bigl(\matter{\bar\rho}^{\,2} + \text{variance}\bigr) ,$$

where the variance is the mean of $(\matter\rho - \matter{\bar\rho})^2$ over the body. At a fixed mass the mean is
fixed, so the smallest $\int\matter\rho^2\,\dd V$ is the least variance: the density spread as evenly as the outside
allows. Every interior with the given outside is $\matter\rho_h + n$, with $n$ in $\mathcal N$, and because $n$ is
orthogonal to $\matter\rho_h$ the cross term of the square vanishes:

$$\boxed{\;\int(\matter\rho_h + n)^2\,\dd V = \int\matter\rho_h^2\,\dd V + \int n^2\,\dd V \;\ge\; \int\matter\rho_h^2\,\dd V ,\;}$$

with equality only for $n = 0$. So among all interiors with the same outside, the harmonic part has the smallest
$\int\matter\rho^2\,\dd V$. Any other adds a pattern $n$ that the readings neither ask for nor forbid.

A real camera has noise and finitely many pixels. Chapter 3.5 finds its best guess when every point inside is
expected, before any reading, to vary by the same amount and independently of the others. With no noise and with
readings everywhere outside, that guess is this same projection.[^likely] "Least assuming" does not
mean "most likely": a real body is free to hold any $n$.

**Two cases.** Near equality: the steel ball $\matter\rho_0 + \epsilon\,\matter{\delta\rho}$ of the first section has
$\int\matter\rho^2\,\dd V$ larger than the uniform ball's by the factor $1 + 0.19\,\epsilon^2$, only $1.0019$ for
$\epsilon = 0.1$. Far from it: the two-layer Earth of chapter 1.3, with its core of $12{,}500\unit{kg\,m^{-3}}$ inside
a mantle of $4150\unit{kg\,m^{-3}}$, has $\int\matter\rho^2\,\dd V$ larger by the factor 1.31 than a uniform Earth of
the same mass.

**What it means.** The least assuming picture is harmonic, so by chapter 2.1's
[maximum principle](/tutorial/outside/laplace/#in-empty-space-the-potential-has-no-peak-and-no-pit) its densest and its
lightest points lie on the body's surface. In the paper's words, "It can never show a core."

**A round body.** Chapter 2.1 showed by symmetry that the harmonic part of a round body depends on $r$ alone. A function
of $r$ alone is harmonic where $(1/r^2)\,\dd(r^2\,\dd f/\dd r)/\dd r = 0$, that is, where $r^2\,\dd f/\dd r$ is a
constant $-b$. Integrating once more gives $f = a + b/r$. Only $b = 0$ is finite at the centre, so the harmonic part is
a constant, and it has the body's mass, because the moment against $h = 1$ is the mass. **Every round body appears as a
uniform ball of its mean density.** The two-layer Earth appears as $5513\unit{kg\,m^{-3}}$ throughout, and both steel
balls of the first section as plain steel.

## The harmonic part of a nugget is a flush on the near wall

We want the harmonic part of a nugget of mass $\matter m$ at the point $\vect s$, at the distance $s$ from the centre
of a ball of radius $R$.[^s] The nugget is a point, so its density $\matter m\,\delta^3(\vect x - \vect s)$ has no
finite $\int\matter\rho^2\,\dd V$, but its moments are finite: $\matter Q_h = \matter m\,h(\vect s)$. We assume that
**the harmonic part is the harmonic density with these same moments**, $\int\matter\rho_h\,h\,\dd V = \matter
m\,h(\vect s)$ for every $h$ harmonic in the ball. For a density with a finite $\int\matter\rho^2\,\dd V$ this follows
from the split, because the part in $\mathcal N$ has no moments.

**A pattern that gives back its own degree.** For a pattern $Y$ of degree $\ell$ on the sky (chapter 2.2),

$$\oint\frac{2\ell + 1}{4\pi}\,P_\ell(\hat n\cdot\hat n')\,Y(\hat n)\,\dd\Omega = Y(\hat n') ,$$

and it gives zero for a pattern of any other degree, by chapter 2.2's orthogonality. To see the first claim, we write
$Y = \sum_m a_mY_{\ell m}$, with $m$ chapter 2.2's order and $a_m = \oint Y_{\ell m}^*\,Y\,\dd\Omega$. The
[addition theorem](/tutorial/outside/spherical-harmonics/#the-addition-theorem-turns-a-sum-over-m-into-one-legendre-polynomial)
replaces $(2\ell + 1)P_\ell/4\pi$ by $\sum_mY_{\ell m}^*(\hat n)\,Y_{\ell m}(\hat n')$, and the integral becomes
$\sum_m a_mY_{\ell m}(\hat n') = Y(\hat n')$. The nugget's mass enters only after this sum over the orders.

**The kernel.** Every function harmonic in the ball is a sum $h(\vect x) = \sum_\ell r^\ell\,Y_\ell(\hat x)$ of the
[solid harmonics](/tutorial/outside/spherical-harmonics/#each-pattern-of-one-degree-gives-two-harmonic-functions-the-solid-harmonics)
of chapter 2.2, with $Y_\ell$ a pattern of degree $\ell$, as chapter 2.4's
[analyticity box](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage)
sketched. We look for a function $K(\vect x, \vect s)$ whose integral against every such $h$ over the ball gives
$h(\vect s)$. We try a sum of solid harmonics symmetric about the direction of $\vect s$,

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
Each term of $K$ is a solid harmonic in $\vect x$, so $K$ is harmonic in the ball. Chapter 2.4's Poisson kernel
$P(\vect x, \vect s)$ does the same from the values on the sphere alone:
$\oint P(\vect x, \vect s)\,h(\vect x)\,\dd A = h(\vect s)$.

**The flush.** The density $\matter m\,K(\vect x, \vect s)$ is harmonic and has the moment $\matter m\,h(\vect s)$
against every harmonic $h$: the nugget's moments. Only one harmonic density has them, because two such densities
would differ by a harmonic density orthogonal to every harmonic density, which is zero. So

$$\boxed{\;\begin{aligned}\matter\rho_h &= \matter m\,K(\vect x, \vect s)\\ &= \frac{\matter m}{4\pi R^3}\sum_{\ell=0}^{\infty}(2\ell + 1)(2\ell + 3)\Bigl(\frac{sr}{R^2}\Bigr)^\ell P_\ell(\cos\vartheta) .\end{aligned}\;} \label{eq:flush}$$

The unit is that of $\matter m/R^3$, a density. This is the paper's equation:

{{paper eq:harmonic-point}}

The flush is $\matter m\,K(\vect x, \vect s)$ and the skin is $\matter m\,P(\vect x, \vect s)$: the nugget, reproduced
over the volume and over the surface. The terms of the sum shrink as $\ell^2t^\ell$, so it converges. The stretch
problem sums it with chapter 2.4's method:

$$\frac{4\pi R^3}{\matter m}\,\matter\rho_h = \frac{3 - 10t^2 + 8t^3\cos\vartheta - t^4}{(1 - 2t\cos\vartheta + t^2)^{5/2}} .$$

**Numbers.** For the nugget halfway out, $s = R/2$:

- at the near wall, $r = R$ and $\vartheta = 0$. The denominator is $(1 - t)^5$ and the numerator is
  $(1 - t)^2(3 + 6t - t^2)$, so the flush there is $(3 + 6t - t^2)/(1 - t)^3$ in units of $\matter m/4\pi R^3$. With
  $t = \tfrac12$ it is $5.75/0.125 = 46$. Spread evenly, the gold would have $3\matter m/4\pi R^3$, so the flush is 15.3
  times denser there, the paper's "fifteen times";
- at the far wall, $\vartheta = \pi$, it gives $-\tfrac{2}{27} = -0.074$ in the same unit, "just below zero" in the paper's words. <!-- lint-allow: just --> The
  negative region is a small cap round the far wall, which holds $3.0 \times 10^{-4}$ of the gold's mass;
- at the centre, $r = 0$, only $\ell = 0$ survives, and the flush is $3\matter m/4\pi R^3$, the gold's mean density, as
  the [mean value property](/tutorial/outside/laplace/#the-value-at-the-centre-of-a-sphere-is-the-average-over-the-sphere)
  demands of a harmonic function.

For a nugget of 1 kg in the steel ball, the unit $\matter m/4\pi R^3$ is $80\unit{kg\,m^{-3}}$. The flush adds
$3700\unit{kg\,m^{-3}}$ to the steel at the near wall and takes $5.9\unit{kg\,m^{-3}}$ away at the far wall, where the
steel keeps the total positive. Gold alone, spread this way, would be negative there, so a least assuming picture can be
unphysical in a small region; chapter 3.9 adds the fact that mass is positive.

**Two checks.** Integrated over the ball, every term with $\ell \ge 1$ gives zero, because it is the moment against
$h = 1$ of a harmonic function of degree $\ell$, orthogonal to the constant. So the flush has the mass $\matter m$. The
same is true of $\int\matter\rho_h\,r^2\,\dd V$, because $r^2$ depends on $r$ alone, and the term $\ell = 0$ gives

$$\int\matter\rho_h\,r^2\,\dd V = \frac{3\matter m}{4\pi R^3}\int_0^R r^2\,4\pi r^2\,\dd r = \frac35\,\matter mR^2$$

for every $s$. A numerical integral of the flush's potential at $\vect X = (2R, 0, R)$, with the nugget on the $z$ axis,
gives $-0.485071\,G\matter m/R$, the nugget's own value and the skin's of chapter 2.4.

**Limits.** As $s \to 0$, every term with $\ell \ge 1$ vanishes, and a nugget at the centre appears as gold spread
evenly, $3\matter m/4\pi R^3$: the shell theorem again. As the nugget nears the wall, $t$ at the near wall tends to 1
and the peak $(3 + 6t - t^2)/(1 - t)^3$ grows without limit; its leading term is $8/(1 - s/R)^3$. The peak is $10.5$
for $s = 0.25R$, 46 for $0.5R$ and 444 for $0.75R$, in units of $\matter m/4\pi R^3$ (Figure [](#fig:null-flush)).

![The flush along the diameter through the nugget, from the far wall to the near wall, for $s = 0.25R$, $0.5R$ and
$0.75R$, in units of $\matter m/4\pi R^3$. All three pass through 3, the gold spread evenly, at the centre, and peak
at the near wall; at the far wall they reach 0.736, $-0.074$ and $-0.385$, and the dips below zero are shaded. The
vertical axis is logarithmic above 1 and nearly linear about zero, so that the values below zero can be
drawn.](tut-null-flush){#fig:null-flush}

## The nugget, the flush and the skin differ only in what the outside cannot read

The third body is the skin of chapter 2.4. Replacing a mass inside a region by a layer on the region's boundary with
the same field outside is called
[balayage](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage),
French for sweeping. Chapter 2.4 swept the nugget onto the sphere $|\vect x| = R$ as a skin of surface density
$\sym{surface-density}{\matter\sigma} = \matter m\,P(\vect x, \vect s) = \matter m(R^2 - s^2)/4\pi R\,|\vect x -
\vect s|^3$, in kilograms per square metre. For $s = R/2$ it is $6\,\matter m/4\pi R^2$ over the nugget and $0.22$ in
the same unit opposite.

The nugget and the skin hold their mass in no volume, so neither has a finite $\int\matter\rho^2\,\dd V$, and both lie
outside the space in which the split lives. We compare them with the flush through their moments, as we did for the
nugget. All three have the moment $\matter m\,h(\vect s)$ against every $h$ harmonic in the ball, the skin because
$P(\vect x, \vect s)$ reproduces $h(\vect s)$ from the sphere. The potentials of the skin and the nugget agree outside
the ball, but their difference is not confined: it grows as $G\matter m/|\vect x - \vect s|$ near the nugget, and its
slope jumps across the skin.

Thin layers lie between them. Sweeping the nugget onto every sphere of radius between $R - d$ and $R$, with $R - d > s$
and an equal share of the gold on each, gives a layer of thickness $d$ with the nugget's field outside the ball. The
layer is an ordinary density, so it differs from the flush by a confined Laplacian. As $d$ shrinks its
$\int\matter\rho^2\,\dd V$ grows as $1/d$, so the skin is not a limit in the sense of the gap box.

So the three bodies agree in every moment and differ in everything else. Only the flush has a finite
$\int\matter\rho^2\,\dd V$, and that is the sense in which it is the least assuming of the three. They also differ in
$\int\matter\rho\,r^2\,\dd V$, which measures how far the gold lies from the centre. For $s = R/2$ it is

$$\matter ms^2 = 0.25\,\matter mR^2, \qquad \tfrac35\,\matter mR^2 = 0.6\,\matter mR^2, \qquad \matter mR^2$$

for the nugget, the flush and the skin. The function $r^2$ is not harmonic, so the outside cannot read these numbers.

The moment of inertia contains them. We spin the ball about an axis through its centre, perpendicular to the line from
the centre to the nugget, and call that axis the $x$ axis, with the nugget on the $z$ axis. Chapter 1.6 split the moment
of inertia about it as $I_x = \tfrac23\int\matter\rho\,r^2\,\dd V + \int\matter\rho\,(r^2/3 - x^2)\,\dd V$. The second
integrand is harmonic, so the three bodies share the second integral, which for the nugget is
$\matter m(s^2/3 - 0) = 0.083\,\matter mR^2$. The gold's shares of the moment of inertia are therefore, in units of
$\matter mR^2$,

$$\begin{aligned}\text{nugget:}&\quad \tfrac23 \times 0.25 + 0.083 = 0.25,\\ \text{flush:}&\quad \tfrac23 \times 0.6 + 0.083 = 0.483,\\ \text{skin:}&\quad \tfrac23 \times 1 + 0.083 = 0.75,\end{aligned}$$

which the paper rounds to 0.25, 0.48 and 0.75 (Figure [](#fig:null-moments)). The paper problems of
[chapter 1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one) and of
[chapter 2.4](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage)
derive them.

![The gold's share of the moment of inertia $I_x$ for the nugget at $s = R/2$, its flush and its skin, in units of
$\matter mR^2$. The full-coloured lower part of each bar, $0.083\,\matter mR^2$, comes from a harmonic integrand and
is the same for all three; the fainter upper part is two thirds of $\int\matter\rho\,r^2\,\dd V$, which the outside
cannot read. Under the bars the flush and the skin are shaded in steps that double in density, and the nugget's size
and the skin's band are chosen for the drawing.](tut-null-moments){#fig:null-moments}

These numbers say what breaks the tie. The paper's *What breaks the tie* names readings that do, and each needs more
than the steady pull outside:

- **spin**: a turning body adds to its tide a part made by its moving mass, as moving charge makes magnetism, and that
  part measures its angular momentum (chapter 7.5);
- **a kick**: a brief tide from outside leaves an energy that grows with $\int\matter\rho\,r^2\,\dd V$
  ([chapter 1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside));
- **heat**: a warm body's pull trembles, and the size of the tremble holds the same integral (chapter [R4](/tutorial/response/reading-section-iv-3/));
- **a pixel inside the matter**, whose trace $4\pi G\matter\rho$ reads the density where it stands
  ([chapter 1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point)).

The null space belongs to a reading of the field at one time, not to gravity itself, as the paper's
[Section XIII](/paper/#sec:second-order) says.

::: try {#same-outside}
The figure opens on round bodies; choose *Gold off centre*. Ball A holds the nugget, ball B its flush, and the line
under each ball gives the nugget's distance from the centre or the densest value of the flush or skin. Predict first: as
the nugget moves from the centre towards the wall, does the flush's densest value grow or shrink, and does its
$\int\matter\rho\,r^2\,\dd V$ in the table change? Move the slider and check. The prediction at the top of the figure is
now about the skin: answer it before you make B the skin, then compare the blue equipotentials outside A and B.
:::

## A uniform sheet is invisible to a tidal camera

Everything so far holds for any reading of the field outside. A tidal camera reads only second derivatives of the
potential, so a change that alters the potential across its pixels only by a constant and a linear function,
$a + \vect b\cdot\vect x$, changes the pull by a constant vector and the tide not at all, as chapter 1.4 showed for a
[uniform pull](/tutorial/newton/tides/#falling-together-cancels-the-pull-but-not-its-difference).

An infinite uniform sheet makes such a change. It pulls toward itself with $2\pi G\matter\sigma$ at every height
([chapter 1.3](/tutorial/newton/gauss-and-poisson/#a-uniform-sheet-pulls-equally-at-every-height)), where
$\matter\sigma$ is its mass per unit area, so on each side its potential is linear in the height. So the room of the
locked safe, with its floor treated as an infinite sheet of concrete of $720\unit{kg\,m^{-2}}$, has the same tide
everywhere above the floor as the same room with no floor. A gravimeter tells them apart at once: the sheet pulls with
$3.0 \times 10^{-7}\unit{m\,s^{-2}}$, sixty-five times the pull of the person at a metre. This is the paper's "a broad
layer of mass has no tidal field at all".

A real floor is finite, and its edges make a tide, $4.5 \times 10^{-8}\unit{s^{-2}}$ for the camera of the locked safe
(chapter 1.3). Chapter 2.7 shows that a flat camera's reading of each ripple of a layer carries a factor $k$, the
wavenumber: $2\pi$ divided by the distance between the ripple's crests (chapter 2.6 defines it fully). A layer that does
not vary has $k = 0$, so the camera sees only a layer's edges and variations (the paper's equation
[](/paper/#eq:array-data)).

::: check
### Q

Why does the least assuming picture show the two-layer Earth as a uniform ball of 5513 kg m⁻³?

### A

The least assuming picture is the harmonic part. A round body's harmonic part depends on $r$ alone, and the only such
harmonic function that is finite at the centre is a constant. It has the Earth's mass, so it is the mean density.

### Q

Which number tells the nugget from its flush and its skin, and why can the outside not read it?

### A

$\int\matter\rho\,r^2\,\dd V$: 0.25, 0.6 and $1\,\matter mR^2$ for $s = R/2$. The function $r^2$ is not harmonic, so it
is not one of the moments that make up the field outside.

### Q

Can a gravimeter on the camera see a uniform concrete floor that the tidal camera cannot?

### A

Yes. For an infinite floor of $720\unit{kg\,m^{-2}}$ the gravimeter reads the pull, $3.0 \times
10^{-7}\unit{m\,s^{-2}}$, while the tide is zero at every height.
:::

**The idea to keep: the field outside a body fixes exactly the harmonic part of its density and nothing else. Any
confined Laplacian can be added inside unseen, so the least assuming picture is the harmonic part, which puts its
densest and lightest points on the surface and shows every round body as uniform.**

::: problems
### Practice

For $\field\psi = A(1 - r^2/R^2)^2$, show that $\matter{\delta\rho} = \nabla^2\field\psi/4\pi G$ has zero total mass and
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

### Stretch

Chapter 2.4's
[analyticity box](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage)
found $(1 - t^2)/D^{3/2} = \sum_\ell(2\ell + 1)\,t^\ell P_\ell(\mu)$, with $D = 1 - 2t\mu + t^2$, by applying
$1 + 2t\,\partial/\partial t$, which multiplies $t^\ell$ by $2\ell + 1$, to the generating function. Apply
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

### The paper

The paper says that the flush of a nugget at $s = R/2$ is "$46\,m/4\pi R^3$" at the near wall, "fifteen times the
nugget's mass spread evenly", and that at the far wall it "dips just below zero". <!-- lint-allow: just --> Check both from the series
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
- [Section IV](/paper/#sec:near-field), *What the image cannot show*: $\delta\rho = \nabla^2\psi/4\pi G$ and the
  positive pairs $\rho_0 \pm \epsilon\,\delta\rho$.
- *What the image does show*: equations [](/paper/#eq:split) and [](/paper/#eq:harmonic-point), "It can never show a
  core", the round body at $5513\unit{kg\,m^{-3}}$ and the balayage; the paper's equation [](/paper/#eq:wiener) is
  chapter 3.5's.
- Figure [](/paper/#fig:same-outside) and *What breaks the tie*: the three bodies, with 0.25, 0.48 and $0.75\,mR^2$.
- *A worked case*: "a broad layer of mass has no tidal field at all", and equation [](/paper/#eq:array-data).
- [Section XII](/paper/#sec:hair) and [Section XIII](/paper/#sec:second-order): the null space is "a property of a
  reading at one time, not of gravity" (chapter 13.3); *What gravity cannot decohere*, in
  [the holography section](/paper/#sec:holography) (chapter 13.8).
- Table [](/paper/#tab:null) lists what the camera cannot see.
:::

::: deeper
- Victor Isakov, *Inverse Source Problems* (American Mathematical Society, 1990): the exterior inverse problem and the
  orthogonal split, with the proofs this chapter skips.
- Hermann Weyl, "The method of orthogonal projection in potential theory", *Duke Mathematical Journal* 7 (1940): the
  lemma of the gap box and the split into two families at right angles.
- Sheldon Axler, Paul Bourdon and Wade Ramey, *Harmonic Function Theory* (Springer, 2nd edition, 2001), chapter 8:
  the reproducing kernel of the ball.
- Ulvi Yurtsever, Caren Marzban and Marina Meilă, "On the gravitational inverse problem" (2010, arXiv:1004.4939), which
  the paper cites for $\nabla^2\psi/4\pi G$: the null space for the potential and the gravity-gradient tensor.
- The GR course's [section 17.7](https://neovand.github.io/general-relativity/chapter-17.html#17-7-rotation-kerr-frame-dragging-and-carefully-qualified-no-hair-claims)
  shows the opposite extreme: a black hole, whose outside shows almost nothing of what fell in (chapter 11.2).
:::

[^jump]: Chapter 2.4 showed that Poisson's equation holds where a density jumps in an integrated sense, which is all
    the argument needs.

[^eps]: Here $\epsilon$ is a pure number, the paper's small factor, which scales $\matter{\delta\rho}$. The value
    $\epsilon = 1$ is the extreme of the family: the largest for which $\matter\rho_0 + \epsilon\,\matter{\delta\rho}$
    is nowhere negative, since its centre has $(1 - \epsilon)\matter\rho_0$. Chapter 2.4's margin note lists the
    letter's other meanings.

[^layer]: A layer of mass on a surface, such as chapter 2.4's skin, makes the pull jump across it by $4\pi G$ times its
    surface density, as chapter 1.3's pillbox showed for a sheet. The last section treats the skin.

[^script]: We write the families in script letters. The paper's $\mathcal N$ of Section XIII, an energy crossing a
    front, is a different object and appears only in Part 13.

[^likely]: Chapter 3.5 derives the paper's equation [](/paper/#eq:wiener) for this best guess. With finitely many
    pixels the noiseless best guess is still harmonic, but it is not $\matter\rho_h$.

[^s]: In Part 3 the letter $s$ is the ratio of a ripple to its noise, and in chapter 1.6 a distance from an axis. Here,
    as in the paper, it is the nugget's distance from the centre.
