---
id: '13.5'
title: 'Impulsive waves and fast particles'
question: 'A wave arriving all at once, with any profile $H$ that is harmonic across its front, is an exact solution of Einstein''s equation, and the field of a particle without mass is one. Why is a sudden sheet of gravity an exact solution, what kick does it give, and why does a particle without mass that passes a body read the same interior as Newton''s passing tonne, with twice the kick?'
part: '13'
requires: ['1.8', '2.4', '6.4', '6.5', '7.1', '7.2', '7.3', '13.1', '13.2']
paper: [sec:second-order, eq:shock, eq:shock-even, eq:massless-pass, eq:pass, eq:push, app:proofs, eq:proof-shock, eq:proof-mass, sec:status, sec:vistas, fig:passing]
figures: [fig:passing]
live: [impulsive-front]
depth: A
---

A tonne flies past the steel ball of section 13.1 at $44\unit{km\,s^{-1}}$ and leaves energy inside it that depends on
how its mass is arranged (sections
[1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick) and 13.1).
Replace the tonne by a flash of light. To kick the edge of the ball as hard as the tonne does, the flash must carry
$3.1\times10^{23}$ J, the mass-energy of 3400 tonnes, and it then kicks twice as hard as Newton's law would say for that
energy. Why is a sudden sheet of gravity an exact solution of Einstein's equation, what kick does it give, and why does
a particle without mass that passes a body read the same interior as Newton's passing tonne, with twice the kick? The
answer closes the two results that section
[6.4](/tutorial/relativity/energy-and-momentum/#a-sideways-kick-that-keeps-q-fixes-the-energy-gained) stated without
proof.[^first]

::: plain
Picture a flat sheet of gravity that moves at the speed of light. Everywhere in front of it and behind it, space is
empty and flat. As the sheet sweeps over a particle, it gives the particle a sudden sideways push. The push depends on
where on the sheet the particle is, and on how the particle was moving: a slow particle and light moving against the
sheet are pushed, while light moving with the sheet is not pushed at all.

Einstein's equation allows such a sheet exactly, as long as its strength across the sheet obeys the same equation as
Newton's potential in empty space. The field of a particle without mass, such as a photon, is a sheet of this kind.
When it passes a body, it pushes each part toward its path, as a passing tonne does, but twice as hard for its energy.
:::

## A sudden sheet of gravity is an exact solution of Einstein's equation

We want a wave that arrives all at once as a metric, and the condition under which it obeys Einstein's equation. We use
the **light-cone coordinates** of section 6.4, $\sym{light-cone-u}{u} = ct - z$ and $\sym{light-cone-v}{v} = ct + z$,
both in metres.[^u] With $\sym{transverse-position}{\vect x_\perp} = (x, y)$ the place across $z$, in metres, the
**impulsive plane wave** is the metric

$$\dd s^2 = -\dd u\,\dd v + H(\vect x_\perp)\,\delta(u)\,\dd u^2 + \dd\vect x_\perp^2 . \label{eq:wave-metric}$$

Its **front** is the plane $u = 0$, which moves along $+z$ at $c$. Away from the front $\delta(u) = 0$, and the metric
is the flat interval of section 6.4. The whole wave lies on that one plane, so a body meets all of it at once, at the
instant the plane reaches it. The function $\sym{wave-profile}{H}$, the wave's **profile**, sets the wave's strength at
each place on the front. Since $\delta(u)$ is in $\mathrm{m^{-1}}$, the term $H\delta(u)\,\dd u^2$ is in square
metres only if $H$ is a length, so $H$ is in metres and its gradient $\nabla H$ across the front is a pure number. A
delta function inside a metric is the limit of a front of finite length, and the next section shows that the kick does
not depend on that length.

**The inverse metric.** We write $F = H(\vect x_\perp)\,\delta(u)$, a pure number, for the one entry $\field g_{uu}$
that varies. The other entries are $\field g_{uv} = -\tfrac12$ and $\field g_{ij} = \delta_{ij}$. The block in $u$
and $v$ has the determinant $-\tfrac14$, and inverting it gives

$$\field g^{uu} = 0, \qquad \field g^{uv} = -2, \qquad \field g^{vv} = -4F .$$

**The Christoffel symbols.** The formula of section 7.1 is $\sym{christoffel}{\Gamma^\mu{}_{\alpha\beta}} = \tfrac12\field
g^{\mu\nu}(\partial_\alpha\field g_{\nu\beta} + \partial_\beta\field g_{\nu\alpha} - \partial_\nu\field
g_{\alpha\beta})$. The bracket, a sum of three derivatives of the metric, is non-zero only when a derivative falls on
$\field g_{uu} = F$, and $F$ does not contain $v$. So every bracket with $\nu = v$ is zero, because the entries with an
index $v$ are constants and nothing depends on $v$. Three brackets survive: $\partial_uF$ for $\nu = \alpha = \beta =
u$, $\partial_iF$ for $\nu = u$ with $\alpha = u$ and $\beta = i$, and $-\partial_iF$ for $\nu = i$ with $\alpha =
\beta = u$. For $\mu = u$, the factor $\field g^{uu}$ is zero and $\field g^{uv}$ meets only the zero brackets with
$\nu = v$, so every symbol with an upper $u$ vanishes. For $\mu = v$, the factor $\field g^{vv}$ also meets only those
zero brackets, which leaves $\tfrac12\field g^{vu} = -1$ times the brackets with $\nu = u$. For $\mu = i$, the factor
$\tfrac12\field g^{ij} = \tfrac12\delta_{ij}$ keeps only the bracket with $\nu = i$. So only three kinds of symbol are
non-zero:

$$\Gamma^v{}_{uu} = -\partial_uF, \qquad \Gamma^v{}_{ui} = -\partial_iF, \qquad \Gamma^i{}_{uu} = -\tfrac12\partial_iF .$$

Each has an upper index $v$ or $i$ and a lower $u$; none has an upper $u$ or a lower $v$.

**The products vanish.** The Riemann tensor of section
[7.2](/tutorial/geometry/curvature-and-tides/#the-riemann-tensor-is-built-from-the-christoffel-symbols-yet-it-is-a-tensor)
has two derivative terms and two products of the form $\Gamma^\alpha{}_{\gamma\sigma}\Gamma^\sigma{}_{\beta\delta}$. In
a product the summed $\sigma$ is the upper index of the second factor, so it is $v$ or $i$. If $\sigma = v$, the first
factor has a lower $v$ and is zero. If $\sigma = i$, the second factor needs $\beta = \delta = u$ and the first needs
$\alpha = v$ and $\gamma = u$. That one product, $\Gamma^v{}_{ui}\Gamma^i{}_{uu}$, appears only in
$\curv R^v{}_{uuu}$, where the two product terms are equal and cancel. So the curvature is the derivative terms alone,
and it is linear in $F$ **exactly**, not to first order.

**The Ricci tensor.** With $\curv R_{\beta\delta} = \curv R^\alpha{}_{\beta\alpha\delta}$ (section 7.3) the derivative
terms are $\partial_\alpha\Gamma^\alpha{}_{\beta\delta} - \partial_\delta\Gamma^\alpha{}_{\beta\alpha}$. The second
vanishes, because $\Gamma^\alpha{}_{\beta\alpha}$ would need a lower $v$ or a symbol $\Gamma^i{}_{ui}$, which is zero.
In the first, $\partial_v$ gives zero, and $\partial_i\Gamma^i{}_{\beta\delta}$ survives only for $\beta = \delta =
u$. So the only entry of the Ricci tensor is

$$\boxed{\;\sym{ricci-tensor}{\curv R}_{uu} = -\tfrac12\,\nabla_\perp^2H\,\delta(u)\;} \label{eq:ricci-uu}$$

with $\nabla_\perp^2 = \partial_x^2 + \partial_y^2$. Here $\nabla_\perp^2H$ is in $\mathrm{m^{-1}}$ and so is
$\delta(u)$, so $\curv R_{uu}$ is in $\mathrm{m^{-2}}$, the unit of a curvature. In empty space Einstein's equation is
$\curv R_{\mu\nu} = 0$ (section 7.3), so the wave is an **exact solution**, one that satisfies the equation with no term
neglected, wherever $\nabla_\perp^2H = 0$: a wave that arrives all at once, with any profile $H$ that is harmonic across
its front.

**The tide it carries.** Lowering the first index gives $\curv R_{uiuj} = \field g_{uu}\curv R^u{}_{iuj} + \field
g_{uv}\curv R^v{}_{iuj}$. Every entry with an upper $u$ vanishes, because each term of the formula of section 7.2 for
it holds a $\Gamma^u$, so only the second term is left. In that formula
$\curv R^v{}_{iuj} = \partial_u\Gamma^v{}_{ij} - \partial_j\Gamma^v{}_{iu} = 0 + \partial_i\partial_jF$, so
$\curv R_{uiuj} = -\tfrac12\partial_i\partial_jF$. For an observer at rest, the tide of section 7.2 is
$c^2\curv R_{0i0j}$. A lower index changes with the chain rule, as in section
[6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time), and $u = x^0 -
z$, $v = x^0 + z$ give $\partial_0 = \partial_u + \partial_v$. So $\curv R_{0i0j}$ is $\curv R_{uiuj}$ plus three
entries with an index $v$. Each of those is zero, because the pair symmetries of section 7.2 move the $v$ to the first
place, and $\curv R_{v\beta\gamma\delta} = \field g_{vu}\curv R^u{}_{\beta\gamma\delta} = 0$. With
$\delta(ct - z) = \delta(t - z/c)/c$,

$$\curv\tE_{ij} = -\tfrac12\,c\,\partial_i\partial_jH\,\delta(t - z/c) .$$

This is the impulsive tide $-\epsilon\,\partial_i\partial_jg\,\delta(t)$ of section
[1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass), carried at the
speed of light, with $\epsilon g$ replaced by $\tfrac12cH$. Its trace is $c^2\curv R_{uu}$, zero exactly where $H$ is
harmonic.

**A special case.** For $H = (x^2 - y^2)/2f$, with $f$ a length, the tide stretches a ring of free balls along $x$ and
squeezes it along $y$, a plus-polarized burst (section
[7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)). After the front
the balls drift apart at steady rates, so the rate of the strain jumps: one integral beyond the memory of section
[7.8](/tutorial/geometry/wave-energy/#a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good).

## Whatever crosses the front keeps q and is kicked in proportion to it

We want the two results that section 6.4 stated: the wave keeps $\sym{light-cone-q}{q} = E/c - p_z$, and it gives the
sideways momentum $\tfrac12q\nabla H$, with $E$ the particle's energy, in joules, and $p_z$ its momentum along $z$.
**The particle is free**, so it follows a geodesic of [](#eq:wave-metric). We label its path by an affine parameter
$\lambda$ (the gap box of section 7.1) for which $p^\mu = \dd x^\mu/\dd\lambda$ is its four-momentum, in
$\mathrm{kg\,m\,s^{-1}}$. So $\lambda$ is in seconds per kilogram, and for a body of mass $\matter m$ it is
$\obs\tau/\matter m$.

**The light-cone component is kept.** The box of 7.1 reaches, one step before the geodesic equation, $\dd(\field
g_{\alpha\nu}p^\nu)/\dd\lambda = \tfrac12(\partial_\alpha\field g_{\mu\nu})\,p^\mu p^\nu$. The metric does not contain
$v$, so for $\alpha = v$ the right side is zero, and $\field g_{v\nu}p^\nu = -\tfrac12p^u$ is kept. With $x^0 = ct$,
$p^u = p^0 - p^z = E/c - p_z$:

$$\boxed{\;q = \frac{E}{c} - p_z \text{ is the same after the front as before}\;}$$

So $u$ advances uniformly along the path, with $\dd u = q\,\dd\lambda$.

**The kick.** For $\mu = i$ the geodesic equation keeps only $\Gamma^i{}_{uu}$:

$$\frac{\dd p^i}{\dd\lambda} = -\Gamma^i{}_{uu}\Bigl(\frac{\dd u}{\dd\lambda}\Bigr)^2 = \tfrac12\,q^2\,\partial_iH\,\delta(u) .$$

We integrate across the front with $\dd\lambda = \dd u/q$. The place $\vect x_\perp$ does not change during a crossing
of zero length, so $\partial_iH$ is taken where the particle crosses, and $\int\delta(u)\,\dd u = 1$:

$$\boxed{\;\Delta\sym{transverse-momentum}{\vect p_\perp} = \tfrac12\,q\,\nabla H\;} \label{eq:wave-kick}$$

The unit is a momentum. The rest mass is kept too, because $\field g_{\mu\nu}p^\mu p^\nu = -\matter
m^2c^2$ is constant along a geodesic, and the metric is flat on both sides. So both assumptions of section 6.4 hold.

**The jump in $v$.** The same constant, written out, is $-q\,p^v + Fq^2 + p_\perp^2 = -\matter m^2c^2$, so $\dd v/\dd u
= p^v/q = (\matter m^2c^2 + p_\perp^2)/q^2 + H\delta(u)$. Across the front the coordinate $v$ of the particle therefore
jumps by $H(\vect x_\perp)$. In the plane of $z$ and $ct$ the path is cut at the front and its far part is shifted by
$\tfrac12H$ in both $z$ and $ct$, along the front itself (Figure [](#fig:impulsive-front)). It is continuous only
where $H = 0$. In the equation of motion for $v$, a $\delta(u)$ multiplies the step that it makes in $\vect p_\perp$,
a product that ordinary functions do not define. A front of small but finite length gives it a meaning, derived
[below](#the-crossing-of-a-smooth-front-tends-to-the-impulsive-one-whatever-its-shape).

![Look first at the two kinks on the right: slow matter and light running against the front turn, while light riding
with it does not. Left, the paths against $z$: they cross the front where the profile is zero, and where it is not, the
dashed path shows the far part shifted along the front. Right, the same paths against the place $x$ across the front,
taken along $\nabla H$, each kick $\tfrac12q\nabla H$ drawn at its kink and $\nabla H$ under the axis, to one scale. Kinks drawn for one
value of $\nabla H$, exaggerated.](tut-impulsive-front){#fig:impulsive-front}

**A number.** For slow matter $q \approx \matter mc$, so every part gets the velocity $\Delta\obs{\vect v} = \tfrac12c
\nabla H$ whatever its mass, as in free fall. A front with $|\nabla H| = 10^{-6}$ gives every slow part
$150\unit{m\,s^{-1}}$, nearly half the speed of sound in air, but turns light running against it, with $q = 2E/c$,
by only $10^{-6}$ radians.

**The width of the front.** Replace $\delta(u)$ by a Gaussian bump $\phi(u)$ of unit area and standard deviation $w$,
in metres. The metric still does not contain $v$, so $q$ is still kept, and a uniform $\nabla H$ still gives
$\tfrac12q\nabla H$. For $H = (x^2 - y^2)/2f$, a part that starts at rest at $x_0$ obeys, since $\dd x/\dd u = p^x/q$,

$$\frac{\dd^2x}{\dd u^2} = \frac{\phi(u)}{2f}\,x$$

exactly. To first order $x$ stays $x_0$, and $\dd x/\dd u$ changes by $x_0/2f$, the kick of [](#eq:wave-kick). Because
the part moves while the front passes, putting the first-order path back into the equation adds $x_0/4f^2$ times
$\iint_{u' < u}(u - u')\,\phi(u)\,\phi(u')\,\dd u'\,\dd u$. If we read $\phi$ as a probability density, this is half
the mean distance between two points drawn independently from it, which is $w/\sqrt\pi$ for a Gaussian. So the kick
is too large by the fraction $w/(2\sqrt\pi\,f)$, which shrinks with $w$ and grows as $1/f$: for $w = f/100$ it is 3
parts in $10^3$.

**Where it fails.** A wave of finite length $\ell_{\rm f}$ passes a slow part in the time $\ell_{\rm f}/c$, in which
the part moves $\obs v_\perp\ell_{\rm f}/c$. When that is small beside the distance over which $\nabla H$ changes, and
the body's own forces act little in that time, the kick is [](#eq:wave-kick): the impulse approximation of section 1.8.

More generally the profile may be any $H(u, \vect x_\perp)$ that is harmonic in $\vect x_\perp$ at each $u$: these are
the **plane-fronted waves**, and the impulsive wave is the special case $H(\vect x_\perp)\,\delta(u)$. The derivation of
the first section never used the shape of $\delta(u)$, so a front of finite length is still an exact solution wherever
$H$ is harmonic.

## A wave and its reverse together always give energy

We want the energy that the wave leaves in a body. A particle of energy $E$ and momentum $\vect p$ keeps $q$ and gains
$\Delta\vect p_\perp = \tfrac12q\nabla H$. The relation $E^2/c^2 = p^2 + \matter m^2c^2$ factors as
$(E/c - p_z)(E/c + p_z) = p_\perp^2 + \matter m^2c^2$, so $E/c = \tfrac12[q + (p_\perp^2 + \matter m^2c^2)/q]$, and only
$p_\perp^2$ changes:

$$\Delta E = \frac{c}{2q}\bigl(|\vect p_\perp + \Delta\vect p_\perp|^2 - p_\perp^2\bigr) = \tfrac12\,c\,\vect p_\perp\cdot\nabla H + \tfrac18\,(E - cp_z)\,|\nabla H|^2 , \label{eq:shock}$$

at any speed, light included, since $cq = E - cp_z$.[^e-cpz] The first term has either sign, so one wave can take
energy from what it crosses. What is new here is the sum over a body. Let a body be made of particles
$a$, with light-cone components $q_a$, at the places $\vect x_a$ on the front. Let $E_+$ be its energy after the wave,
$E_-$ after the reverse wave, of profile $-H$, and $E_0$ with no wave. Reversing $H$ reverses the first term and keeps
the second, so in the sum $E_+ + E_- - 2E_0$ each particle leaves $\tfrac14cq_a|\nabla H(\vect x_a)|^2$. With the
$\sym{crossing-energy}{\matter{\mathcal N}} = c\sum_aq_a\,\delta^2(\vect x_\perp - \vect x_a)$ of section
[6.5](/tutorial/relativity/stress-energy/#along-a-ray-of-light-the-table-gives-the-energy-less-c-times-the-momentum),
the energy less $c$ times the momentum along $z$ that crosses each square metre of the front, in $\mathrm{J\,m^{-2}}$,
the sum is an integral over the front:

$$E_+ + E_- - 2E_0 = \tfrac14\int|\nabla H|^2\,\matter{\mathcal N}\,\dd^2x_\perp \ge 0 . \label{eq:shock-even}$$

It cannot be negative, because ordinary matter has $\matter{\mathcal N} \ge 0$ (the null energy condition of section
6.5).

**The slow limit.** For slow matter $q_a \approx \matter m_ac$, so $\matter{\mathcal N} =
\sym{projected-density}{\matter \Sigma}c^2$, with $\matter\Sigma$ the mass per square metre projected along $z$
(section 1.8). The sum becomes $\tfrac14c^2\int\matter\Sigma\,|\nabla H|^2\,\dd^2x_\perp$. Since $\nabla H$ does not
change along $z$, each of the two waves gives the second term of the energy of an impulsive tide, $\tfrac12\epsilon^2$
times $\int\matter\rho\,|\nabla g|^2\,\dd V$ (section 13.1), with $\epsilon\nabla g$ replaced by $\tfrac12c\nabla H$, and
the sum holds that term twice. This is Newton's impulsive tide again.

## The crossing of a smooth front tends to the impulsive one whatever its shape

We want the crossing of a front of small but finite length, with any profile, for two reasons: it gives the products
of a delta function with a step a meaning, and it says when a real front, which always has some length, acts as an
impulsive one. **The front is smooth**: in [](#eq:wave-metric) we replace $\delta(u)$ by $\phi(u) =
\phi_1(u/\ell_{\rm f})/\ell_{\rm f}$, where $\phi_1$ is any smooth bump of unit area and the length $\ell_{\rm f}$, in
metres, sets how long the front is. So $\phi$ is in $\mathrm{m^{-1}}$ with $\int\phi\,\dd u = 1$, and we put $u = 0$
at its centre, so that $\int u\,\phi\,\dd u = 0$. The metric still does not contain $v$, so $q$ is kept and $\dd\lambda
= \dd u/q$, and the Christoffel symbols of the first section hold with $F = H\phi$. A prime marks a derivative along the
path with respect to $u$, so that $\vect x_\perp' = \vect p_\perp/q$ is a pure number. The geodesic equation for $\mu =
i$ holds $\Gamma^i{}_{uu}$, and for $\mu = v$ it holds $\Gamma^v{}_{uu}$ once and $\Gamma^v{}_{ui}$ twice. Dividing both
by $q^2$ gives

$$\vect x_\perp'' = \tfrac12\,\phi(u)\,\nabla H(\vect x_\perp), \qquad v'' = \partial_uF + 2\,x^{i\prime}\,\partial_iF . \label{eq:smooth-geodesic}$$

**The kick.** Integrating the first equation across the front gives the change of slope
$\Delta\vect x_\perp' = \tfrac12\int\phi(u)\,\nabla H(\vect x_\perp(u))\,\dd u$. If the particle stood still while the
front passed, this would be $\tfrac12\nabla H(\vect x_0)$, with $\vect x_0$ its place when the centre of the front
passes. It moves. Before the front its path is $\vect x_0 + \vect x'_-u$, with $\vect x'_-$ its slope there, and to
first order the front bends it by $\tfrac12\nabla H(\vect x_0)\,R(u)$, where $R(u) = \int_{-\infty}^u(u -
u')\,\phi(u')\,\dd u'$ is the solution of $R'' = \phi$ that is zero before the front. We put this path into $\nabla H$
and keep the first term of its Taylor series about $\vect x_0$ (section 1.4):

$$\Delta x_i' = \tfrac12\partial_iH + \tfrac12\,\partial_i\partial_jH\Bigl(x'_{-j}\int u\,\phi\,\dd u + \tfrac12\,\partial_jH\int R\,\phi\,\dd u\Bigr) ,$$

with $H$ and its derivatives taken at $\vect x_0$. The first integral is zero, because $u = 0$ is the centre of the
front. The second is $d_\phi = \iint_{u' < u}(u - u')\,\phi(u)\,\phi(u')\,\dd u'\,\dd u$, half the mean distance
between two points drawn independently from $\phi$, as above: it is $w/\sqrt\pi$ for a Gaussian of standard deviation
$w$, and $\ell_{\rm f}/6$ for a flat front of length $\ell_{\rm f}$. Since $\partial_i\partial_jH\,\partial_jH =
\tfrac12\partial_i|\nabla H|^2$,

$$\boxed{\;\Delta\vect x_\perp' = \tfrac12\,\nabla H + \tfrac18\,d_\phi\,\nabla|\nabla H|^2 + \dots\;} \label{eq:smooth-kick}$$

where the dots hold terms of higher order in $\ell_{\rm f}$. **Units:** $|\nabla H|^2$ is a pure number, its gradient
is in $\mathrm{m^{-1}}$ and $d_\phi$ is in metres, so the correction is a pure number, as a slope is. **A check:** for
$H = (x^2 - y^2)/2f$ at $(x_0, 0)$ the correction is $x_0d_\phi/4f^2$, the term found above for that profile. Times
$q$, the first term is the kick [](#eq:wave-kick).

**The limit.** For a front of one shape and shrinking length, $d_\phi$ shrinks in proportion to $\ell_{\rm f}$, and the
neglected terms faster. So as $\ell_{\rm f} \to 0$ the kick tends to $\tfrac12q\nabla H$ for every bump $\phi_1$: the
shape of the front enters only through $d_\phi$ and higher moments of $\phi$, each multiplied by a power of $\ell_{\rm
f}$. The place $\vect x_\perp$ changes across the front by about $\ell_{\rm f}$ times the slopes, so in the limit the
path is bent at the front but not broken.

**The jump in $v$.** Along the path $F$ changes at the rate $F' = \partial_uF + x^{i\prime}\partial_iF$, and by the
first of [](#eq:smooth-geodesic), $x^{i\prime}\partial_iF = 2\,x^{i\prime}x_i'' = (|\vect x_\perp'|^2)'$. The second
equation is therefore $v'' = (F + |\vect x_\perp'|^2)'$, exactly, and integrating it once gives

$$v' = H(\vect x_\perp)\,\phi(u) + |\vect x_\perp'|^2 + \frac{\matter m^2c^2}{q^2} . \label{eq:smooth-v}$$

The geodesic equation fixes everything here except the constant of integration, and the rest mass fixes the constant:
before the front, where $F = 0$, the condition $\field g_{\mu\nu}p^\mu p^\nu = -\matter m^2c^2$ gives $v' = |\vect
x_\perp'|^2 + \matter m^2c^2/q^2$, and the geodesic keeps it. For light the constant is zero. This is the relation that
gave the jump in $v$ above, now derived for a front of any length. Across the front the last two terms are bounded and
act over a length of order $\ell_{\rm f}$, so what they add to $v$ vanishes with $\ell_{\rm f}$. The first adds
$\int H(\vect x_\perp(u))\,\phi(u)\,\dd u$, which is $H(\vect x_0)$ plus terms of order $\ell_{\rm f}$. In the limit
$v$ jumps by $H(\vect x_0)$, whatever the shape. After the front the slope $v'$ has changed by

$$|\vect x'_+|^2 - |\vect x'_-|^2 = \nabla H\cdot\vect x'_- + \tfrac14|\nabla H|^2 ,$$

whose last term is quadratic in the kick. Since $E/c = p^0 = \tfrac12(p^u + p^v) = \tfrac12q(1 + v')$, the energy
changes by $\tfrac12cq$ times this, which is [](#eq:shock).

**The product.** The term of [](#eq:smooth-geodesic) that holds the product is $2x^{i\prime}\partial_iF =
2\phi(u)\,\nabla H\cdot\vect x_\perp'$. With $\Theta(u) = \int_{-\infty}^u\phi\,\dd u'$, which rises from 0 to 1 across
the front, the slope during the crossing is $\vect x_\perp' = \vect x'_- + \tfrac12\nabla H\,\Theta(u)$ to leading
order, and $\int\Theta\phi\,\dd u = \int\tfrac12(\Theta^2)'\,\dd u = \tfrac12$ for every shape. So the term integrates to
$2\nabla H\cdot\tfrac12(\vect x'_- + \vect x'_+)$: in the limit, $\delta(u)$ times the step in $\vect x_\perp'$ means
$\delta(u)$ times the mean of the values on the two sides. The same mean keeps the rest mass, since the change of
$|\vect x_\perp'|^2$, which [](#eq:smooth-v) ties to the mass, is $(\vect x'_+ - \vect x'_-)\cdot(\vect x'_+ + \vect
x'_-) = \nabla H\cdot\tfrac12(\vect x'_- + \vect x'_+)$.

H. Balasin met this product in the geodesics of impulsive waves, fixed its value by requiring that the four-momentum
keep its length, as here, and showed that the result agrees with Colombeau's algebra of generalized functions, a theory
in which distributions such as $\delta(u)$ and the step can be multiplied [@Balasin1997]. R. Steinbauer smoothed the
front, solved the geodesic equations and proved that their limit exists and does not depend on how the front is
smoothed; he treated in the same way the equation for the separation of nearby geodesics, which holds the square of the
delta function [@Steinbauer1998]. We use their result in the form derived here: an impulsive wave is the limit of
smooth ones, and the kick $\tfrac12q\nabla H$ and the jump of $v$ by $H$ are what a front of small length does.

**When a front of finite length acts as an impulsive one.** The correction in [](#eq:smooth-kick) is
$\tfrac14d_\phi\,\partial_i\partial_jH\,\partial_jH$. We write $\partial_jH = |\nabla H|\,n_j$, with $\vect n$ the
direction of $\nabla H$, and define the length $L$, in metres, by $|\partial_i\partial_jH\,n_j| = |\nabla H|/L$: it is
the distance along $\vect n$ over which $\nabla H$ changes by about itself. The correction then has the size
$\tfrac14d_\phi|\nabla H|^2/L$ and the kick $\tfrac12|\nabla H|$, and their ratio is $\tfrac12d_\phi|\nabla H|/L$. For
slow matter $u$ advances as $ct$, so the front passes in the time $\tau = d_\phi/c$, and the speed it gives is $\obs
v_\perp = \tfrac12c|\nabla H|$:

$$\frac{|\text{correction}|}{|\text{kick}|} = \frac{\obs v_\perp\,\tau}{L} .$$

The ratio is the distance that the part moves across the front, at the speed the front gives it, while the front
passes, divided by $L$. A part that already moves across the front, with the slope $\vect x'_-$, adds nothing at this
order, because we take its place at the centre of the front; its own motion enters at the next order, through products
such as $(|\vect x'_-|d_\phi/L)^2$. Equation [](#eq:shock) needs only $q$, the rest mass and the kick, and the first two
hold for a front of any length. So it holds for a front of finite length with the kick [](#eq:smooth-kick), and its
error is of order $\obs v_\perp\tau/L$, as long as the body's own forces act little in the time $\tau$. For a body at
rest the first correction to each part's energy, $\tfrac1{16}cq\,d_\phi\,\nabla H\cdot\nabla|\nabla H|^2$, is cubic in
$H$, so it changes sign with $H$ and cancels in $E_+ + E_- - 2E_0$: equation [](#eq:shock-even) holds to second order
in $\obs v_\perp\tau/L$. For parts already moving across the front the even sum keeps a correction of order $|\vect
x'_-|d_\phi/L$.

**A number.** Let the front that gives every slow part $150\unit{m\,s^{-1}}$, with $|\nabla H| = 10^{-6}$, be a Gaussian
of standard deviation $w = 1$ m, so that $d_\phi = w/\sqrt\pi = 0.56$ m and $\tau = 1.9$ ns, and let $\nabla H$ change
across the steel ball, $L = 0.1$ m. The edge of the ball moves $0.28\unit{\mu m}$ while the front passes, and its kick
differs from $\tfrac12q\nabla H$ by $\obs v_\perp\tau/L = 2.8\times10^{-6}$. For $H = (x^2 - y^2)/2f$ with $f =
10^5$ m, which has $|\nabla H| = 10^{-6}$ and $L = 0.1$ m at $x_0 = 0.1$ m, this is the fraction $w/(2\sqrt\pi\,f)$
found above. The energy that the wave and its reverse leave together is then exact to about the square of that, a
part in $10^{11}$ in order of magnitude.

## The crossing is the motion generated by the energy that crosses the front

We want the function that generates the crossing, as the moment of the mass $Q_g$ generates Newton's impulsive tide
(section
[1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass)). **We take $u$ as
the time.** A free particle's state at one value of $u$ is its place $(v, \vect x_\perp)$ on the plane of that $u$
together with the lower components $p_v = \field g_{v\nu}p^\nu = -\tfrac12q$ and $p_i = p^i$ of its four-momentum, and
these two pairs play the parts of $\vect x$ and $\vect p$ in section 1.7. With the inverse metric of the first section,
the condition $\field g^{\mu\nu}p_\mu p_\nu = -\matter m^2c^2$ reads $-4p_up_v - 4Fp_v^2 + |\vect p_\perp|^2 = -\matter
m^2c^2$. We solve it for $K = -p_u$, in $\mathrm{kg\,m\,s^{-1}}$:

$$K = -\frac{|\vect p_\perp|^2 + \matter m^2c^2}{4p_v} + \delta(u)\,H(\vect x_\perp)\,p_v .$$

Hamilton's equations with $K$ in the place of the energy and $u$ in the place of the time give $v' = \partial K/\partial
p_v = (|\vect p_\perp|^2 + \matter m^2c^2)/q^2 + H\delta(u)$, $\vect x_\perp' = \partial K/\partial\vect p_\perp =
\vect p_\perp/q$, $\vect p_\perp' = -\partial K/\partial\vect x_\perp = \tfrac12q\nabla H\,\delta(u)$ and $p_v' =
-\partial K/\partial v = 0$, using $4p_v^2 = q^2$. These are the equations of motion found above, so the geodesics are
the motion that $K$ generates in $u$.

**The generator.** The wave adds to $K$ the term $\delta(u)\,G$, with $G = H(\vect x_\perp)\,p_v = -\tfrac12qH(\vect
x_\perp)$, in joule seconds. Across the front this term is far larger than the rest of $K$, so by the argument of
section 1.7, with its assumptions that the kick lasts an instant and that the forces inside do not act during it, the
crossing is the motion that $G$ generates, run for the parameter $s = \int\delta(u)\,\dd u$ from 0 to 1. Hamilton's
equations with $G$ give $\dd v/\dd s = \partial G/\partial p_v = H$, $\dd\vect x_\perp/\dd s = 0$, $\dd\vect p_\perp/\dd s
= -\partial G/\partial\vect x_\perp = \tfrac12q\nabla H$ and $\dd p_v/\dd s = 0$. Since $\vect x_\perp$ and $p_v$ do not
change, the rates stay the same throughout, and at $s = 1$

$$v \to v + H(\vect x_\perp), \qquad \vect p_\perp \to \vect p_\perp + \tfrac12q\nabla H ,$$

exactly. The kick and the jump in $v$ are one motion. In section 1.7 the generator $Q_g$ held no momenta, so no part
moved; $G$ holds $p_v$, the momentum paired with $v$, so every part is moved along the wave's own direction by $H$ in
$v$, which is $\tfrac12H$ in each of $ct$ and $z$. A constant added to $H$ adds to $G$ a multiple of $q$, which moves
every part along $v$ alike and so changes only the labels of the coordinates.

**For a body.** Summed over the particles of a body, with $\matter{\mathcal N} = c\sum_aq_a\,\delta^2(\vect x_\perp -
\vect x_a)$, the generator is

$$\boxed{\;G = -\frac{1}{2c}\int H(\vect x_\perp)\,\matter{\mathcal N}(\vect x_\perp)\,\dd^2x_\perp\;} \label{eq:wave-generator}$$

**Units:** metres times $\mathrm{J\,m^{-2}}$ times $\mathrm{m^2}$, over $\mathrm{m\,s^{-1}}$, is a joule second. The
generator is the energy that crosses the front, the integral of $\matter T_{\mu\nu}k^\mu k^\nu$ along each of the front's
null rays, weighted by the profile: the wave acts on matter through $\matter{\mathcal N}$ and through nothing else.
**The slow limit:** with $\matter{\mathcal N} = \matter\Sigma c^2$ and $\tfrac12cH$ replaced by $\epsilon g$, as in the
first section, $G = -\epsilon\int\matter\Sigma\,g\,\dd^2x_\perp = -\epsilon Q_g$, since $g$ does not change along $z$.
The motion that $-\epsilon Q_g$ generates for one unit is the motion of $Q_g$ run backward by $\epsilon$, which is
Newton's impulsive tide.

**The energy.** Each particle's energy is $E = \tfrac12c[q + (|\vect p_\perp|^2 + \matter m^2c^2)/q]$, which holds no
place, so $\{E, G\} = -(\partial E/\partial\vect p_\perp)\cdot(\partial G/\partial\vect x_\perp) = \tfrac12c\,\vect
p_\perp\cdot\nabla H$, and in the same way $\{\{E, G\}, G\} = \tfrac14cq|\nabla H|^2$. Along the motion $E(s) = E +
s\{E, G\} + \tfrac12s^2\{\{E, G\}, G\}$, and the series stops there, because $E$ holds $\vect p_\perp$ only through
$|\vect p_\perp|^2$ and $\vect p_\perp$ changes in proportion to $s$. At $s = 1$ this is [](#eq:shock). The reverse wave
reverses $G$, which is the same as running to $s = -1$, so $E_+ + E_- - 2E_0 = \{\{E, G\}, G\}$, summed over the body:
equation [](#eq:shock-even) is the bracket of the energy with the wave's generator, taken twice, as the energy of
Newton's impulsive tide is (section 1.7).

**A number.** For $H = (x^2 - y^2)/2f$ with $f = 10^5$ m, the front that gives the edge of the steel ball, 10 cm out
along $x$, the speed $150\unit{m\,s^{-1}}$, the edge has $v$ moved by $H = 5.0\times10^{-8}$ m more than the centre:
its later path is shifted by $2.5\times10^{-8}$ m along $z$ and by $8\times10^{-17}$ s in time. The shift is small beside
the drift that follows, since at $150\unit{m\,s^{-1}}$ the edge covers $2.5\times10^{-8}$ m in 0.17 ns.

The same statement holds for matter of any kind, described by fields. The integral of $\matter T_{\mu\nu}k^\mu k^\nu$
along one null ray of a null plane, smeared over the plane with any weight $f(\vect x_\perp)$, generates the
displacement of every field along the rays of the plane by an amount set by $f(\vect x_\perp)$. H. Casini, E. Testé and
G. Torroba found these operators and their algebra in quantum field theory, studying the modular Hamiltonians of regions
bounded on a null plane [@CasiniTesteTorroba2017]. C. Córdova and S.-H. Shao identified the displacements, which differ
from ray to ray, with the supertranslations of the Bondi–Metzner–Sachs algebra, the symmetries of a spacetime seen from
far away along its rays of light [@CordovaShao2018]. An impulsive wave of profile $H$ carries out such a displacement,
and we use that here in one way: a wave reads a body only through $\matter{\mathcal N}$, the quantity that generates
it, so pairs of waves read $\matter{\mathcal N}$ and nothing more.

## Pairs of waves read the Fourier transform of what crosses the front

One wave gives one number, and pairs of waves give the whole of $\matter{\mathcal N}$. We write
$B(H_1, H_2) = \int\nabla H_1\cdot\nabla H_2\,\matter{\mathcal N}\,\dd^2x_\perp$, in joules, so equation [](#eq:shock-even)
measured $B(H, H) = 4(E_+ + E_- - 2E_0)$. The pairing is linear in each profile, so the polarization identity of section
13.2 gives it from four signed waves, $\pm(H_1 + H_2)$ and $\pm(H_1 - H_2)$. For the profiles we take section 13.2's
Calderón pair in the two dimensions of the front, $h_\pm = e^{\vect\zeta_\pm\cdot\vect x_\perp}$ with
$\vect\zeta_\pm = \tfrac12(i\vect\xi \pm \vect\eta)$. Here $\vect\xi$ is a wavevector in the plane of the front, in
$\mathrm{m^{-1}}$, and $\vect\eta$ is at right angles to it and as long. Both functions are harmonic, because
$\vect\zeta_\pm\cdot\vect\zeta_\pm = 0$, so each, times a small length, is a profile. One grows as
$e^{\vect\eta\cdot\vect x_\perp/2}$ across the body and the other falls, and their product is the ripple
$e^{i\vect\xi\cdot\vect x_\perp}$. Since $\nabla h_+\cdot\nabla h_- = \vect\zeta_+\cdot\vect\zeta_-\,e^{i\vect\xi\cdot
\vect x_\perp} = -\tfrac12|\vect\xi|^2e^{i\vect\xi\cdot\vect x_\perp}$,

$$\boxed{\;B(h_+, h_-) = -\tfrac12|\vect\xi|^2\,\tilde{\matter{\mathcal N}}(\vect\xi)\;} \label{eq:pair}$$

with $\tilde{\matter{\mathcal N}}(\vect\xi) = \int\matter{\mathcal N}\,e^{i\vect\xi\cdot\vect x_\perp}\,\dd^2x_\perp$.
The pair is complex, so it takes four real pairings, sixteen signed waves for each $\vect\xi$, as in Newton's case
(section 13.2). At $\vect\xi = 0$ both profiles are 1, which kicks nothing, and both sides vanish.

By section 6.5, $\matter{\mathcal N}$ at each point of the front is the integral of $\matter T_{\mu\nu}k^\mu k^\nu$ along
the null ray through it, with $\matter T_{\mu\nu}$ the stress–energy tensor, in $\mathrm{J\,m^{-3}}$, and
$k^\mu = (1, 0, 0, 1)$ the wave's direction. It is a projection of the body along the wave's path, as in X-ray
tomography. For slow matter it is $c^2\matter\Sigma$, so projections along the directions of one great circle give the
density everywhere (Figure [](#fig:light-ray-transform)), as in section
[5.6](/tutorial/waves/abel-transform/#a-body-that-is-not-round-needs-views-from-many-directions). Waves from every
direction give the integrals of $\matter T_{\mu\nu}$ along every null ray, its **light-ray transform**. Section
[6.5](/tutorial/relativity/stress-energy/#some-stresses-are-invisible-to-every-ray) showed that the stresses
$\matter T_\phi$ built from a smooth function $\phi$ that is zero outside a region give zero on every ray, and change
the energy density of ordinary matter by only about a part in $10^{12}$.

These stresses are all that the transform misses. V. P. Krishnan, S. Senapati and M. Vashisth proved that a smooth
symmetric table $F_{\mu\nu}$, zero outside a bounded region of spacetime, whose integral vanishes along every null ray
has the form

$$F_{\mu\nu} = \lambda\,\field\eta_{\mu\nu} + \tfrac12\bigl(\partial_\mu w_\nu + \partial_\nu w_\mu\bigr) ,$$

with $\lambda$ a function and $w_\mu$ a field of four components that is zero on the region's boundary; the rays whose
directions lie near one fixed direction already suffice [@KrishnanSenapatiVashisth2020]. That such a table is missed
is the calculation of section 6.5. Along a null ray $\field\eta_{\mu\nu}k^\mu k^\nu = 0$ removes $\lambda$, and
$k^\mu k^\nu\partial_\mu w_\nu$ is $\dd W/\dd\ell$, with $W = w_\nu k^\nu$, whose integral is the difference of $W$ at
the two ends, which is zero.

Conservation then leaves only the family of section 6.5. We take $\lambda$ and $w_\mu$ to be zero outside the region, and
let a stress–energy tensor $\matter T_{\mu\nu}$ have the form above. Its divergence is zero:

$$\partial^\mu\matter T_{\mu\nu} = \partial_\nu\lambda + \tfrac12\Box w_\nu + \tfrac12\partial_\nu\bigl(\partial^\mu w_\mu\bigr) = 0 .$$

We write each function as a sum of plane waves $e^{i\kappa_\mu x^\mu}$, with $\kappa_\mu$ a wavevector in spacetime, in
$\mathrm{m^{-1}}$, and amplitudes $\hat\lambda$, $\hat w_\mu$. Then $\partial_\mu$ becomes $i\kappa_\mu$ and $\Box$
becomes $-\kappa^2$, with $\kappa^2 = \field\eta^{\mu\nu}\kappa_\mu\kappa_\nu$, and each wave gives $\kappa^2\hat w_\nu =
\kappa_\nu(2i\hat\lambda - \kappa^\mu\hat w_\mu)$. Wherever $\kappa^2 \ne 0$, $\hat w_\nu$ is therefore a multiple of
$\kappa_\nu$, so the amplitude $i(\kappa_\mu\hat w_\nu - \kappa_\nu\hat w_\mu)$ of the curl $\partial_\mu w_\nu -
\partial_\nu w_\mu$ vanishes there, and by continuity everywhere. A field without curl is a gradient, $w_\mu =
\partial_\mu\phi$, and $\phi$ is constant outside the region, where we take it to be zero. Putting $\hat w_\nu =
i\kappa_\nu\hat\phi$ back gives $\hat\lambda = \kappa^2\hat\phi$, that is $\lambda = -\Box\phi$, and

$$\matter T_{\mu\nu} = \partial_\mu\partial_\nu\phi - \field\eta_{\mu\nu}\Box\phi ,$$

the $\matter T_\phi$ of section 6.5. **Units:** with $\phi$ in $\mathrm{J\,m^{-1}}$, $w_\mu$ is in $\mathrm{J\,m^{-2}}$
and $\lambda$ in $\mathrm{J\,m^{-3}}$, as a stress is. So waves from every direction, or from the directions near one,
fix the stress–energy tensor of matter up to this family alone, which in ordinary matter changes the energy density by a
part in $10^{12}$ at most.

![Look first at the slices on the right: each direction of waves gives the transform of the energy that crosses its
front on one slice, and the directions of one great circle fill every wavevector. The body and its projection are
computed; the rays are drawn sparse for clarity.](tut-light-ray-transform){#fig:light-ray-transform}

## The field of a particle without mass is an impulsive wave

We want the profile of the wave that a particle without mass carries. **The particle moves at $c$ along $+z$** through
the point $\vect b$ of the front, in metres, with energy $E$ and momentum $\sym{massless-momentum}{p} = E/c$, in
$\mathrm{kg\,m\,s^{-1}}$. It is the null dust of section
[6.5](/tutorial/relativity/stress-energy/#dust-a-fluid-and-a-beam-of-light-each-fill-the-table) gathered at one point,
so

$$\matter T^{00} = \matter T^{0z} = \matter T^{zz} = E\,\delta(z - ct)\,\delta^2(\vect x_\perp - \vect b) ,$$

in $\mathrm{J\,m^{-3}}$. Lowering with $\field\eta_{\mu\nu}$ flips the sign of $\matter T_{0z}$ alone. Since $x^0 =
\tfrac12(u + v)$ and $z = \tfrac12(v - u)$, a step in $u$ moves $x^0$ by $\tfrac12$ and $z$ by $-\tfrac12$, so

$$\begin{aligned}\matter T_{uu} &= \tfrac14\bigl(\matter T_{00} - 2\matter T_{0z} + \matter T_{zz}\bigr)\\
&= E\,\delta(u)\,\delta^2(\vect x_\perp - \vect b) ,\end{aligned}$$

using $\delta(z - ct) = \delta(-u) = \delta(u)$. The same steps give $\matter T_{uv} = \matter T_{vv} = 0$, and the
trace is zero, as for any null dust. So the trace-reversed equation of section 7.3 is
$\curv R_{uu} = (8\pi G/c^4)\matter T_{uu}$ with every other entry zero, which the metric [](#eq:wave-metric) can meet.
With [](#eq:ricci-uu),

$$\nabla_\perp^2H = -\frac{16\pi GE}{c^4}\,\delta^2(\vect x_\perp - \vect b) .$$

The Green's function in the plane of section
[2.4](/tutorial/outside/greens-functions/#along-a-long-rod-the-greens-function-is-a-logarithm), $\nabla^2\ln r =
2\pi\delta^2$, solves it:

$$\boxed{\;H = -\frac{8Gp}{c^3}\,\ln|\vect x_\perp - \vect b|\;} \label{eq:as-profile}$$

The impulsive wave with this profile is the **Aichelburg–Sexl wave**, the field of a particle without mass.[^gauge] Its
curvature is zero everywhere off the plane that moves with the particle, so nothing of the field arrives before the
particle does. **Units:** $Gp/c^3$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\mathrm{kg\,m\,s^{-1}}$ over
$\mathrm{m^3\,s^{-3}}$, a metre. **A check:** on a circle of radius $r$ round $\vect b$, $\nabla H$ points inward with
the size $8Gp/c^3r$, and the circle is $2\pi r$ long, so the flux of $\nabla H$ out of it is $-16\pi Gp/c^3$ whatever
$r$ is. That is the $2\pi$ of section 2.4 times $-8Gp/c^3$, as Gauss's law in the plane requires. Aichelburg and Sexl
found it in 1971 as the limit of Schwarzschild's field boosted toward $c$ with its energy held fixed
[@AichelburgSexl1971].

**A limit.** A photon of energy $E'$ crossing this wave head-on has $q = 2E'/c$ (6.4), so [](#eq:wave-kick)
turns it by $|\Delta\vect p_\perp|/(E'/c) = |\nabla H| = 8GE/c^4b$ at the distance $b$. A mass $E/c^2$ at rest bends
light by $4GE/c^4b$ (section
[11.1](/tutorial/black-holes/schwarzschild/#far-from-a-mass-light-bends-by-twice-newtons-angle)), half as much. A photon
moving with the particle has $q = 0$ and is not turned. So beams of light moving in opposite directions attract, and
parallel beams do not, as R. C. Tolman, P. Ehrenfest and B. Podolsky found [@TolmanEhrenfestPodolsky1931]. Seen from
the body it passes, a particle without mass is a front of this kind, the shock that a fast pixel sees (section
[R12b](/tutorial/sky/reading-section-xi-2/#a-falling-camera-sees-a-smaller-shadow-and-a-fast-pixel-sees-every-scene-as-a-wave)).

## A mass boosted toward the speed of light at fixed energy carries the same wave

We want the limit that Aichelburg and Sexl took: a body of mass $\matter M$ moving along $+z$ at the speed $\obs v =
\obs\beta c$, with $\obs\gamma = (1 - \obs\beta^2)^{-1/2}$, whose energy $E = \obs\gamma\matter Mc^2$ is held fixed as
$\obs\gamma \to \infty$. **The field is weak**, so we start from the linear field of section
[7.4](/tutorial/geometry/linearized-gravity/#a-static-source-gives-newtons-potential-in-time-and-in-space). At rest at
the origin the body has $\field{\bar h}_{00} = 4G\matter M/c^2r$, and every other entry is zero. With $U^\mu$ the
body's four-velocity divided by $c$, which is $(1, 0, 0, 0)$ at rest, so that $U_0 = -1$, this is

$$\field{\bar h}_{\mu\nu} = \frac{4G\matter M}{c^2r}\,U_\mu U_\nu .$$

Both sides are tensors, so the equation holds in the frame in which the body moves, with $U^\mu = (\obs\gamma, 0, 0,
\obs\gamma\obs\beta)$ and $r$ the distance measured in the body's own frame. Distances along the motion are
$\obs\gamma$ times longer there (section 6.1), so

$$r' = \sqrt{\rho^2 + \obs\gamma^2\zeta^2}, \qquad \zeta = z - \obs\beta ct ,$$

with $\rho = |\vect x_\perp|$ the distance from the path, in metres. Since $U_\mu U^\mu = -1$, the trace is
$\field{\bar h}^\alpha{}_\alpha = -4G\matter M/c^2r'$, and reversing it (section 7.4) gives

$$\field h_{\mu\nu} = \frac{4G\matter M}{c^2r'}\bigl(U_\mu U_\nu + \tfrac12\field\eta_{\mu\nu}\bigr) .$$

At rest this is $\field h_{00} = \field h_{xx} = 2G\matter M/c^2r$, the field of section 7.4.

**The boost.** Lowering gives $U_\mu = \obs\gamma(-1, 0, 0, \obs\beta)$, so $U_\mu\,\dd x^\mu = -\obs\gamma[\dd u +
(1 - \obs\beta)\,\dd z]$, with $\dd u = c\,\dd t - \dd z$. With $\matter M = E/\obs\gamma c^2$,

$$\begin{aligned}\field h_{\mu\nu}\,\dd x^\mu\dd x^\nu &= \frac{4GE}{c^4}\,\frac{\obs\gamma}{r'}\bigl[\dd u + (1 - \obs\beta)\,\dd z\bigr]^2\\
&\quad + \frac{2GE}{c^4}\,\frac{1}{\obs\gamma r'}\,\field\eta_{\mu\nu}\,\dd x^\mu\dd x^\nu .\end{aligned}$$

As $\obs\gamma$ grows, $1 - \obs\beta = 1/\obs\gamma^2(1 + \obs\beta)$, so every term other than $(4GE/c^4)(\obs\gamma/r')
\,\dd u^2$ carries at most the factor $1/\obs\gamma r'$. Across the front, over $|\zeta| < Z$, that factor integrates to
$(2/\obs\gamma^2)\operatorname{arsinh}(\obs\gamma Z/\rho)$, which vanishes as $\obs\gamma \to \infty$ for every $Z$. So
those terms disappear, and $\field h_{uu} = (4GE/c^4)\,\obs\gamma/r'$ is left.

**The limit of $\obs\gamma/r'$.** At fixed $\rho$, $\obs\gamma/r'$ is a peak in $\zeta$ of height $\obs\gamma/\rho$
and width about $\rho/\obs\gamma$. Its integral grows as a logarithm at large $|\zeta|$, so we subtract the same
function at a fixed distance $\rho_0$. With $\sigma = \obs\gamma\zeta$, and the antiderivative
$\operatorname{arsinh}(\sigma/\rho) = \ln\bigl(\sigma/\rho + \sqrt{1 + \sigma^2/\rho^2}\bigr)$, which tends to
$\ln(2\sigma/\rho)$ at large $\sigma$,

$$\int\Bigl(\frac{\obs\gamma}{\sqrt{\rho^2 + \obs\gamma^2\zeta^2}} - \frac{\obs\gamma}{\sqrt{\rho_0^2 + \obs\gamma^2\zeta^2}}\Bigr)\dd\zeta = 2\ln\frac{\rho_0}{\rho} .$$

The integral does not depend on $\obs\gamma$, while the difference is gathered within $|\zeta| \lesssim
\rho/\obs\gamma$, beyond which it falls as $(\rho_0^2 - \rho^2)/2\obs\gamma^2|\zeta|^3$. A peak of fixed area whose
width shrinks to zero tends to that area times a delta function (section 1.3), so the difference tends to
$2\ln(\rho_0/\rho)\,\delta(\zeta)$. As $\obs\beta \to 1$, $\zeta$ tends to $-u$, and $\delta(-u) = \delta(u)$. The
subtracted function depends on $u$ alone and not on the place across the front, and a term $g(u)\,\dd u^2$ in the metric
is removed by the new coordinate $v - \int g\,\dd u$, since $-\dd u\,\dd v + g\,\dd u^2 = -\dd u\,(\dd v - g\,\dd u)$. So

$$\field h_{\mu\nu}\,\dd x^\mu\dd x^\nu \to -\frac{8GE}{c^4}\,\ln\frac{\rho}{\rho_0}\;\delta(u)\,\dd u^2 ,$$

which is the impulsive wave [](#eq:wave-metric) with $H = -(8Gp/c^3)\ln(\rho/\rho_0)$ and $p = E/c$: the profile
[](#eq:as-profile), with $\rho_0$ the unit of length inside its logarithm. **Units:** $GE/c^4$ is a length, as $H$ must
be.

**The rest of the field.** The linear field leaves out terms of second and higher order in $G\matter M/c^2r'$. A term of
second order carries $\matter M^2 = E^2/\obs\gamma^2c^4$ and at most two factors $\obs\gamma$ from $U_\mu U_\nu$, so it
is at most of the size $(GE/c^4)^2/r'^2$, whose integral across the front, $\pi(GE/c^4)^2/\obs\gamma\rho$, vanishes as
$\obs\gamma \to \infty$; higher orders vanish faster. So Schwarzschild's whole field, boosted, tends to the same wave,
as Aichelburg and Sexl found [@AichelburgSexl1971], and the limit is the exact solution of the first section.

**The kick at any speed.** The same field gives the kick at a finite speed, which joins Newton's pass to the particle
without mass. A slow part at rest at the distance $b$ from the path, at $z = 0$, accelerates across the path at
$\ddot x^i = -c^2\Gamma^i{}_{00} = \tfrac12c^2\partial_i\field h_{00}$ (section
[7.1](/tutorial/geometry/metric/#free-bodies-follow-geodesics-and-the-christoffel-symbols-hold-newtons-pull)), since
$\field h_{0i} = 0$ for $i = x, y$. Here $\field h_{00} = (4G\matter M/c^2r')(\obs\gamma^2 - \tfrac12)$, and over the
pass, with $\zeta = -\obs vt$,

$$\int\partial_b\frac{1}{r'}\,\dd t = -b\int\frac{\dd t}{(b^2 + \obs\gamma^2\obs v^2t^2)^{3/2}} = -\frac{2}{\obs\gamma\obs vb} .$$

So the part gains, toward the path,

$$\boxed{\;|\Delta\obs{\vect v}| = \frac{2G\matter M(2\obs\gamma^2 - 1)}{\obs\gamma\obs vb} = \frac{2GE\,(1 + \obs\beta^2)}{c^2\obs vb}\;}$$

using $2\obs\gamma^2 - 1 = \obs\gamma^2(1 + \obs\beta^2)$ and $E = \obs\gamma\matter Mc^2$. **Units:** $GE/c^2$ is in
$\mathrm{m^3\,s^{-2}}$, and dividing by $\obs vb$ leaves a speed. **The limits:** for $\obs\beta \to 0$ it is $2G\matter
M/\obs vb$, Newton's kick of section 1.8 with $C = 2G\matter M/V$; for $\obs\beta \to 1$ at fixed $E$ it is
$4GE/c^3b$, the kick $C/b$ with $C = 4Gp/c^2$ of the next section. The factor $1 + \obs\beta^2$ is the energy plus the
stress along the motion, $\matter T^{00} + \matter T^{zz} = (1 + \obs\beta^2)\matter T^{00}$ for moving dust (section
6.5): at low speed the energy alone gravitates, and at the speed of light the stress doubles it.

**A number.** The Sun, moving at $\obs\gamma = 10$ with the energy $10\matter M_\odot c^2$, passes 1 AU from a grain at
rest. The grain gains $118\unit{m\,s^{-1}}$, about a third of the speed of sound in air, and the limit $4GE/c^3b$ gives
the same to a part in $10^5$, because $(1 + \obs\beta^2)/2\obs\beta = 1 + (1 - \obs\beta)^2/2\obs\beta \approx 1 +
1/8\obs\gamma^4$. The front is about $b/\obs\gamma = 0.1$ AU thick and passes the grain in about 50 s. By the rule of
[the smooth front](#the-crossing-of-a-smooth-front-tends-to-the-impulsive-one-whatever-its-shape), with $L \approx b$,
the impulsive treatment errs by about $\obs v_\perp\tau/L \approx (118\unit{m\,s^{-1}})(50\unit{s})/(1\unit{AU}) =
4\times10^{-8}$. That is $4G\matter M_\odot/c^2b$, the angle by which the Sun bends light at 1 AU, and it does not
depend on $\obs\gamma$, because the kick grows as $\obs\gamma$ while the time of the pass falls as $1/\obs\gamma$.

## A particle without mass reads the interior as Newton's passing tonne does, with twice the kick

We want the energy that a passing particle without mass leaves in a body, **whose parts are at rest**. Each part then
has $\vect p_\perp = 0$ and $q \approx \matter mc$, and by [](#eq:wave-kick) and [](#eq:as-profile) it gets the
velocity

$$\Delta\obs{\vect v} = \tfrac12c\nabla H = \frac{4Gp}{c^2}\,\frac{\vect b - \vect s}{|\vect b - \vect s|^2} ,$$

toward the path, with $\vect s$ its place on the front. This is the kick of section 1.8, $C(\vect b - \vect s)/|\vect b
- \vect s|^2$, with

$$\boxed{\;\sym{flyby-constant}{C} = \frac{4Gp}{c^2}\;}$$

Newton's $C = 2G\matter\mu/V$, for a mass $\matter\mu = p/c$ at $V = c$, is $2Gp/c^2$. The kick is twice Newton's
(Figure [](#fig:as-profile)), as for the bending of light. Section
[6.5](/tutorial/relativity/stress-energy/#what-gravitates-is-the-energy-plus-the-sum-of-the-stresses) gives the reason:
what gravitates is the energy plus the sum of the stresses, $\matter T^{00} + \matter T^{11} + \matter T^{22} + \matter
T^{33}$. For the particle the only stress is $\matter T^{zz} = \matter T^{00}$, so its source is $\matter T^{00} +
\matter T^{zz} = 2E\,\delta(z - ct)\,\delta^2(\vect x_\perp - \vect b)$. A slow mass of the same energy has stresses
far below its $\matter T^{00}$, so its source is $E$ times the same deltas, half as much. Light passing a mass at rest
is bent by twice Newton's angle for the same reason (section 11.1).

![Look first at the inset: the kick of a particle without mass is twice Newton's for the same energy. The contours of
the profile are a logarithm round the point where the path crosses the front, and the arrows point toward
it.](tut-as-profile){#fig:as-profile}

**The energy.** With $\vect p_\perp = 0$, equation [](#eq:shock) gives each part $\tfrac18cq|\nabla H|^2$, and summing
as in [](#a-wave-and-its-reverse-together-always-give-energy) gives $\tfrac18\int|\nabla
H|^2\matter{\mathcal N} \,\dd^2x_\perp$. With $|\nabla H|^2 = 64G^2p^2/c^6|\vect b - \vect s|^2$ this is

$$\Delta E(\vect b) = \frac{8G^2p^2}{c^6}\int\frac{\matter{\mathcal N}(\vect s)}{|\vect b - \vect s|^2}\,\dd^2s . \label{eq:massless-pass}$$

For slow matter $\matter{\mathcal N} = \matter\Sigma c^2$, and $(8G^2p^2/c^6)\,c^2 = \tfrac12(4Gp/c^2)^2 =
\tfrac12C^2$, so this is the pass of section 1.8,
$\Delta E(\vect b) = \tfrac12C^2\int\matter\Sigma(\vect s)\,|\vect b - \vect s|^{-2}\,\dd^2s$, with $C = 4Gp/c^2$. We take
without proof that what the body gains the particle loses. A photon's energy is in proportion to its frequency, so it
leaves redder by the fraction $\Delta E/E$; a particle sent in from infinity and received there thus reads the same
transform.

{{paper fig:passing}}

**Numbers.** The tonne at $44\unit{km\,s^{-1}}$ has $C = 3.0\times10^{-12}\unit{m^2\,s^{-1}}$. A flash with the same
$C$ needs $p = Cc^2/4G = 1.0\times10^{15}\unit{kg\,m\,s^{-1}}$ and $E = 3.1\times10^{23}$ J: the mass-energy of 3400
tonnes, or what the Sun radiates in 0.8 ms. It leaves the same $8.8\times10^{-21}$ J in the ball as the tonne, and
arrives redder by 3 parts in $10^{44}$. The most energetic cosmic ray recorded, of $3.2\times10^{20}$ eV (51 J), has
$C = 5.1\times10^{-34}\unit{m^2\,s^{-1}}$, $1.7\times10^{-22}$ of the tonne's.

**The approximation.** The body must stay still while the particle passes. The front sweeps through the ball, 1 m
deep, in 3.3 ns. The ball's slowest ringing, of angular frequency $1.6\times10^4\unit{s^{-1}}$ (Lamb's mode, section
13.1), turns through $5\times10^{-5}$ radians in that time, against 0.54 radians during the tonne's pass of
$b/V = 34\unit{\mu s}$, which section 1.8 estimated changes the energy the tonne leaves by 10 to 15 per cent. The
particle's own path is bent by the ball by $4G\matter M/c^2b = 8\times10^{-24}$ rad, so it is straight. At the speed of
light the second reading is the same reading, and the speed of light enters only as the factor two.

::: try {#impulsive-front}
Predict first: a sheet of gravity sweeps across a cloud of slow dust, a photon flying with it and a photon flying
against it. Which are kicked, and which gains the most energy for its $q$? The left panel is the plane of the front,
with a body of 200 particles and an arrow on each for its kick $\tfrac12 q\nabla H$; below it are three test
particles, a slow grain and the two photons. The right panel has bars for $E_+ - E_0$, $E_- - E_0$ and their sum,
and beside the sum a bar for $\tfrac14\int|\nabla H|^2\matter{\mathcal N}$. Choose *Aichelburg–Sexl* and drag *b*, the
point where the particle without mass crosses, toward the body. *The strength* fixes the largest kick, so watch how
the pattern across the body changes, and whether the last two bars stay equal. Switch from *+H* to *−H*. Then slide
*The body's rapidity* toward −3, the front's own direction, and watch every kick shrink with $q$.
:::

**The idea to keep: a front of gravity moving at the speed of light, with any profile harmonic across it, is an exact
solution of Einstein's equation. Whatever crosses it keeps $q = E/c - p_z$ and is kicked by $\tfrac12q\nabla H$, so
pairs of such waves read the Fourier transform of the energy that crosses the front, and a particle without mass is
such a wave: passing a body, it reads the interior as Newton's passing mass does, with twice the kick.**

::: problems
### Practice

**[13.5]** Why is the impulsive wave an exact solution, and not only a solution of the weak-field equations?

::: solution
Every product of two Christoffel symbols in its curvature vanishes, so the Ricci tensor is exactly linear in $H$:
$\curv R_{uu} = -\tfrac12\nabla_\perp^2H\,\delta(u)$, with no neglected terms.
:::

**[13.5]** A slow grain and a slow boulder cross the same front at the same place. Which gets the larger velocity?

::: solution
Neither. Each gets $\tfrac12c\nabla H$, because the kick $\tfrac12q\nabla H$ grows with $q \approx \matter mc$.
:::

**[13.5]** A flash of $3.1\times10^{23}$ J passes 1 m from a grain at rest. What velocity does it give the grain?

::: solution
It gives $C/b = 4GE/c^3b = 3.1\times10^{-12}\unit{m\,s^{-1}}$, toward the flash's path.
:::

**[13.5]** A pulse of light of $2\times10^6$ J, about the energy of the largest laser pulses, passes 1 m from a small
grain at rest. Find $C$, the grain's velocity, and the angle by which a photon crossing the pulse head-on at that
distance turns.

::: solution
The flyby constant is $C = 4Gp/c^2 = 4GE/c^3 = 2.0\times10^{-29}\unit{m^2\,s^{-1}}$, so the grain gets $C/b =
2.0\times10^{-29}\unit{m\,s^{-1}}$ toward the path. The photon turns by $|\nabla H| = 8GE/c^4b =
1.3\times10^{-37}$ rad.
:::

**[13.5]** A front has the flat shape, $\phi = 1/\ell_{\rm f}$ over a length $\ell_{\rm f} = 30$ cm and zero elsewhere.
Find $d_\phi$, and the fraction by which it changes the kick of $150\unit{m\,s^{-1}}$ at the edge of the steel ball, with
$L = 0.1$ m.

::: solution
Two points drawn independently from the flat shape are on average $\ell_{\rm f}/3$ apart, so $d_\phi = \ell_{\rm f}/6 =
5$ cm. The front passes in $\tau = d_\phi/c = 1.7\times10^{-10}$ s, and the fraction is $\obs v_\perp\tau/L =
150\times1.7\times10^{-10}/0.1 = 2.5\times10^{-7}$.
:::

**[13.5]** A slow part at rest crosses a front with $|\nabla H| = 10^{-6}$ at its place. By how much does the slope $v'$
of its path change, and what energy per kilogram does that give it?

::: solution
By $\tfrac14|\nabla H|^2 = 2.5\times10^{-13}$. The energy changes by $\tfrac12cq$ times this, with $q = \matter mc$, so
per kilogram by $\tfrac18c^2|\nabla H|^2 = 1.1\times10^4\unit{J\,kg^{-1}}$, which is $\tfrac12(150\unit{m\,s^{-1}})^2$,
the kinetic energy of the kick.
:::

**[13.5]** What motion does the generator $G = H\,p_v$ give when the profile is a constant $H_0$?

::: solution
Its gradient is zero, so no particle is kicked, and every particle has $v$ moved by the same $H_0$. That is a
relabelling of the coordinate $v$, so a constant in the profile does nothing physical.
:::

**[13.5]** The Sun moves at $\obs\gamma = 100$ with the energy $100\matter M_\odot c^2$ and passes 1 AU from a grain at
rest. Find the grain's speed, and how far it differs from the limit $4GE/c^3b$.

::: solution
The limit gives $4G\matter M_\odot\obs\gamma/cb = 1.18\unit{km\,s^{-1}}$, and the exact factor $(1 + \obs\beta^2)/2\obs\beta$
differs from 1 by about $1/8\obs\gamma^4 = 1.3\times10^{-9}$. The front is 0.01 AU thick and passes in 5 s.
:::

### Stretch

**[13.5]** With section 6.4: the two lumps of its worked example *The pair that a wave stops* sit at $\pm a\hat x$ on
the front, and the wave that stops their motion apart has $\nabla H = \mp\tfrac65\hat x$ at them. Find a profile
harmonic across the front that gives it.

::: solution
Try $H = k(x^2 - y^2)$, which is harmonic for every $k$. Its gradient is $(2kx, -2ky)$, which at $\pm a\hat x$ is
$\pm2ka\,\hat x$. Setting $2ka = -\tfrac65$ gives $H = -\tfrac35(x^2 - y^2)/a$.
:::

**[13.5]** A body at rest crosses a smooth front. Show from [](#eq:smooth-kick) that the first
correction to the energy of each part is odd in $H$, so that $E_+ + E_- - 2E_0$ is unchanged at first order in
$d_\phi$.

::: solution
With $\vect p_\perp = 0$ each part gains $(c/2q)|\Delta\vect p_\perp|^2 = \tfrac12cq|\Delta\vect x_\perp'|^2$. Squaring
[](#eq:smooth-kick) gives $\tfrac14|\nabla H|^2 + \tfrac18d_\phi\,\nabla H\cdot\nabla|\nabla H|^2$ to first order in
$d_\phi$. The first term is even in $H$ and the second cubic, so the second changes sign with $H$ and drops out of the
sum of the wave and its reverse.
:::

**[13.5]** With section 6.5: show that $\lambda = -\Box\phi$ and $w_\mu = \partial_\mu\phi$ turn $\lambda\field
\eta_{\mu\nu} + \tfrac12(\partial_\mu w_\nu + \partial_\nu w_\mu)$ into $\matter T_\phi$, and that its divergence
vanishes for every $\phi$.

::: solution
The symmetrized derivative is $\tfrac12(\partial_\mu\partial_\nu\phi + \partial_\nu\partial_\mu\phi) =
\partial_\mu\partial_\nu\phi$, so the table is $\partial_\mu\partial_\nu\phi - \field\eta_{\mu\nu}\Box\phi$. Its
divergence is $\Box\partial_\nu\phi - \partial_\nu\Box\phi = 0$, because partial derivatives commute.
:::

### The camera

**[13.5]** Derive the energy equation [](#eq:massless-pass) from Einstein's equation, and show that for slow matter it
is the pass of section 1.8 with $C = 4Gp/c^2$.

::: solution
Build $\matter T_{uu} = E\,\delta(u)\,\delta^2(\vect x_\perp - \vect b)$, set $\curv R_{uu} = (8\pi G/c^4)\matter
T_{uu}$ with [](#eq:ricci-uu) and solve with section 2.4's logarithm for [](#eq:as-profile). Each part at rest gains
$\tfrac18cq|\nabla H|^2$; summing gives $\tfrac18\int|\nabla H|^2\matter{\mathcal N}\,\dd^2x_\perp$, and $|\nabla
H|^2 = 64G^2p^2/c^6|\vect b - \vect s|^2$. With $\matter{\mathcal N} = \matter\Sigma c^2$ the factor is $\tfrac12C^2$.
:::
:::

::: paper
- [Section XIII](/paper/#sec:second-order), after [*A mass that passes*](/paper/#par:a-mass-that-passes): the wave, the
  equations [](/paper/#eq:shock), [](/paper/#eq:shock-even) and [](/paper/#eq:massless-pass), Aichelburg and Sexl, and
  the light-ray transform.
- Appendix C, [*The energy given by an impulsive wave*](/paper/#par:the-energy-given-by-an-impulsive-wave): the metric,
  the kick and [](/paper/#eq:proof-shock) and [](/paper/#eq:proof-mass).
- [*Open problems*](/paper/#sec:status): the particle without mass as the simplest wave sent in from infinity.
- [*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light): the shock
  that a fast pixel sees.
:::

::: deeper
- The [GR course, section 16.4](https://neovand.github.io/general-relativity/chapter-16.html#16-4-bending-light-finding-the-famous-factor-of-two)
  finds the factor two for light passing a mass.
- The [GR course, section 18.1](https://neovand.github.io/general-relativity/chapter-18.html#18-1-linearization-is-a-controlled-approximation-not-a-different-theory)
  explains when the linear theory is an approximation; the impulsive wave is a case where it is exact.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII and its Appendix C, as its equations
    [](/paper/#eq:shock), [](/paper/#eq:shock-even) and [](/paper/#eq:massless-pass).

[^u]: Not the retarded time $u = t - r/c$ of section 5.2, which is not used here.

[^e-cpz]: For slow matter $E - cp_z \approx \matter mc^2$ while $q \approx \matter mc$.

[^gauge]: Changing the unit of length inside the logarithm adds a constant to $H$, which kicks nothing and only shifts
    the jump in $v$: it is a change of coordinates.
