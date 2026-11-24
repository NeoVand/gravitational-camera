---
id: '13.5'
title: 'Impulsive waves and fast particles'
question: 'The paper says that a wave "arriving all at once with any profile $H$ that is harmonic across its front" is an exact solution of Einstein''s equation, that the field of a particle without mass is one, and that a body it crosses gains energy "at any speed, light included". Why is a sudden sheet of gravity an exact solution, what kick does it give, and why does a particle without mass that passes a body read the same interior as Newton''s passing tonne, with twice the kick?'
part: '13'
requires: ['1.8', '2.4', '6.4', '6.5', '7.1', '7.2', '7.3', '13.1', '13.2']
paper: [sec:second-order, eq:shock, eq:shock-even, eq:massless-pass, eq:pass, eq:push, app:proofs, eq:proof-shock, eq:proof-mass, sec:status, sec:vistas, fig:passing]
figures: [fig:passing]
live: []
depth: A
---
**What you need:** chapters
[6.4](/tutorial/relativity/energy-and-momentum/#a-sideways-kick-that-keeps-q-fixes-the-energy-gained) (light-cone
coordinates, $q$ and the kick formula),
[6.5](/tutorial/relativity/stress-energy/#along-a-ray-of-light-the-table-gives-the-energy-less-c-times-the-momentum)
(the energy that crosses a front),
[7.1](/tutorial/geometry/metric/#free-bodies-follow-geodesics-and-the-christoffel-symbols-hold-newtons-pull)
(geodesics and Christoffel symbols),
[7.2](/tutorial/geometry/curvature-and-tides/#the-riemann-tensor-is-built-from-the-christoffel-symbols-yet-it-is-a-tensor)
(the Riemann tensor and the tide),
[7.3](/tutorial/geometry/einstein-equation/#einsteins-equation-ties-the-curvature-to-the-energy-and-stress-at-each-point)
(Einstein's equation),
[1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick) (the flyby),
[2.4](/tutorial/outside/greens-functions/#along-a-long-rod-the-greens-function-is-a-logarithm) (the logarithm in the
plane), chapter
[13.1](/tutorial/what-a-field-keeps/push-and-pass/#the-passers-loss-of-energy-holds-every-moment-of-the-projected-body)
(the pass as a reading of the interior) and chapter 13.2 (Calderón's pair of harmonic functions).

A tonne flies past the paper's steel ball at $44\unit{km\,s^{-1}}$ and leaves energy inside it that depends on how its
mass is arranged (chapters 1.8 and 13.1). Replace the tonne by a flash of light. To kick the edge of the ball as hard
as the tonne does, the flash must carry $3.1\times10^{23}$ J, the mass-energy of 3400 tonnes, and it then kicks twice
as hard as Newton's law would say for that energy.

The paper's [Section XIII](/paper/#sec:second-order) explains this with a wave that arrives "all at once". So we ask:
why is a sudden sheet of gravity an exact solution of Einstein's equation, what kick does it give, and why does a
particle without mass that passes a body read the same interior as Newton's passing tonne, with twice the kick? The
answer closes the two results that chapter 6.4 stated without proof.

::: plain
Picture a flat sheet of gravity that moves at the speed of light. Everywhere in front of it and behind it, space is
empty and flat. As the sheet sweeps over a particle, it gives the particle a sudden sideways push. The push depends on
where on the sheet the particle is, and on how the particle was moving: a slow particle and light moving against the
sheet are pushed, while light moving with the sheet is not pushed at all.

Einstein's equation allows such a sheet exactly, with no approximation, as long as its strength across the sheet obeys
the same equation as Newton's potential in empty space. The field of a particle without mass, such as a photon, is a
sheet of this kind. When it passes a body, it pushes each part toward its path, as a passing tonne does, but twice as
hard for its energy.
:::

## A sudden sheet of gravity is an exact solution of Einstein's equation

We want the paper's wave as a metric, and the condition under which it obeys Einstein's equation. We use chapter 6.4's
**light-cone coordinates** $\sym{light-cone-u}{u} = ct - z$ and $\sym{light-cone-v}{v} = ct + z$, both in metres.[^u]
With $\sym{transverse-position}{\vect x_\perp} = (x, y)$ the place across $z$, in metres, the **impulsive plane wave**
of the paper's Appendix C is the metric

$$\dd s^2 = -\dd u\,\dd v + H(\vect x_\perp)\,\delta(u)\,\dd u^2 + \dd\vect x_\perp^2 . \label{eq:wave-metric}$$

Its **front** is the plane $u = 0$, which moves along $+z$ at $c$. Away from the front $\delta(u) = 0$, and the metric
is 6.4's flat interval. The whole wave lies on that one plane, so a body meets all of it at once, at the instant the
plane reaches it. The function $\sym{wave-profile}{H}$, the wave's **profile**, sets the wave's strength at each place
on the front.[^H] Since $\delta(u)$ is in $\mathrm{m^{-1}}$, the term $H\delta(u)\,\dd u^2$ is in square metres only
if $H$ is a length, so $H$ is in metres and its gradient $\nabla H$ across the front is a pure number. A delta
function inside a metric is the limit of a front of finite length, and the next section shows that the kick does not
depend on that length.

**The inverse metric.** We write $F = H(\vect x_\perp)\,\delta(u)$, a pure number, for the one entry $\field g_{uu}$
that varies.[^F] The other entries are $\field g_{uv} = -\tfrac12$ and $\field g_{ij} = \delta_{ij}$. The block in $u$
and $v$ has the determinant $-\tfrac14$, and inverting it gives

$$\field g^{uu} = 0, \qquad \field g^{uv} = -2, \qquad \field g^{vv} = -4F .$$

**The Christoffel symbols.** Chapter 7.1's formula is $\sym{christoffel}{\Gamma^\mu{}_{\alpha\beta}} = \tfrac12\field
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

Each has an upper index $v$ or $i$ and a lower $u$. None has an upper $u$, and none has a lower $v$.

**The products vanish.** Chapter
[7.2](/tutorial/geometry/curvature-and-tides/#the-riemann-tensor-is-built-from-the-christoffel-symbols-yet-it-is-a-tensor)'s
Riemann tensor has two derivative terms and two products of the form $\Gamma^\alpha{}_{\gamma\sigma}
\Gamma^\sigma{}_{\beta\delta}$. In a product the summed $\sigma$ is the upper index of the second factor, so it is $v$
or $i$. If $\sigma = v$, the first factor has a lower $v$ and is zero. If $\sigma = i$, the second factor needs $\beta
= \delta = u$ and the first needs $\alpha = v$ and $\gamma = u$. That one product, $\Gamma^v{}_{ui}\Gamma^i{}_{uu}$,
appears only in $\curv R^v{}_{uuu}$, where the two product terms are equal and cancel. So the curvature is the
derivative terms alone, and it is linear in $F$ **exactly**, not to first order.

**The Ricci tensor.** With 7.3's $\curv R_{\beta\delta} = \curv R^\alpha{}_{\beta\alpha\delta}$ the derivative terms
are $\partial_\alpha\Gamma^\alpha{}_{\beta\delta} - \partial_\delta\Gamma^\alpha{}_{\beta\alpha}$. The second
vanishes, because $\Gamma^\alpha{}_{\beta\alpha}$ would need a lower $v$ or a symbol $\Gamma^i{}_{ui}$, which is zero.
In the first, $\partial_v$ gives zero, and $\partial_i\Gamma^i{}_{\beta\delta}$ survives only for $\beta = \delta =
u$. So the only entry of the Ricci tensor is

$$\boxed{\;\sym{ricci-tensor}{\curv R}_{uu} = -\tfrac12\,\nabla_\perp^2H\,\delta(u)\;} \label{eq:ricci-uu}$$

with $\nabla_\perp^2 = \partial_x^2 + \partial_y^2$. Here $\nabla_\perp^2H$ is in $\mathrm{m^{-1}}$ and so is
$\delta(u)$, so $\curv R_{uu}$ is in $\mathrm{m^{-2}}$, the unit of a curvature. In empty space Einstein's equation is
$\curv R_{\mu\nu} = 0$ (7.3), so the wave is an **exact solution**, one that satisfies the equation with no term
neglected, wherever $\nabla_\perp^2H = 0$. That is the paper's "arriving all at once with any profile $H$ that is
harmonic across its front".

**The tide it carries.** Lowering the first index gives $\curv R_{uiuj} = \field g_{uu}\curv R^u{}_{iuj} + \field
g_{uv}\curv R^v{}_{iuj}$. Every entry with an upper $u$ vanishes, because each term of 7.2's formula for it holds a
$\Gamma^u$, so only the second term is left. In 7.2's formula $\curv R^v{}_{iuj} = \partial_u\Gamma^v{}_{ij} -
\partial_j\Gamma^v{}_{iu} = 0 + \partial_i\partial_jF$, so $\curv R_{uiuj} = -\tfrac12\partial_i\partial_jF$. For an
observer at rest, 7.2's tide is $c^2\curv R_{0i0j}$. A lower index changes with the chain rule, as chapter
[6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time) showed, and $u = x^0 -
z$, $v = x^0 + z$ give $\partial_0 = \partial_u + \partial_v$. So $\curv R_{0i0j}$ is $\curv R_{uiuj}$ plus three
entries with an index $v$. Each of those is zero, because the pair symmetries of 7.2 move the $v$ to the first place,
and $\curv R_{v\beta\gamma\delta} = \field g_{vu}\curv R^u{}_{\beta\gamma\delta} = 0$. With $\delta(ct - z) =
\delta(t - z/c)/c$,

$$\curv\tE_{ij} = -\tfrac12\,c\,\partial_i\partial_jH\,\delta(t - z/c) .$$

This is chapter [1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass)'s
impulsive tide, $-\epsilon\,\partial_i\partial_jg\,\delta(t)$, carried at the speed of light, with $\epsilon g$
replaced by $\tfrac12cH$. Its trace is $c^2\curv R_{uu}$, zero exactly where $H$ is harmonic.

**A special case.** For $H = (x^2 - y^2)/2f$, with $f$ a length, the tide stretches a ring of free balls along $x$ and
squeezes it along $y$, a plus-polarized burst (chapter
[7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)). After the front
the balls drift apart at steady rates, so the rate of the strain jumps. That is one integral beyond the memory of
chapter [7.8](/tutorial/geometry/wave-energy/#a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good), in
which the strain itself jumps.

## Whatever crosses the front keeps q and is kicked in proportion to it

We want 6.4's two stated results: the wave keeps $\sym{light-cone-q}{q} = E/c - p_z$, and it gives the sideways
momentum $\tfrac12q\nabla H$, with $E$ the particle's energy, in joules, and $p_z$ its momentum along $z$. **The
particle is free**, so it follows a geodesic of [](#eq:wave-metric). We label its path by an affine parameter
$\lambda$ (7.1's gap box) for which $p^\mu = \dd x^\mu/\dd\lambda$ is its four-momentum, in $\mathrm{kg\,m\,s^{-1}}$.
So $\lambda$ is in seconds per kilogram, and for a body of mass $\matter m$ it is $\obs\tau/\matter m$.

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

The unit is a momentum, as it should be. The rest mass is kept too, because $\field g_{\mu\nu}p^\mu p^\nu = -\matter
m^2c^2$ is constant along a geodesic, and the metric is flat on both sides. So both of 6.4's assumptions hold.

**The jump in $v$.** The same constant, written out, is $-q\,p^v + Fq^2 + p_\perp^2 = -\matter m^2c^2$, so $\dd v/\dd u
= p^v/q = (\matter m^2c^2 + p_\perp^2)/q^2 + H\delta(u)$. Across the front the coordinate $v$ of the particle therefore
jumps by $H(\vect x_\perp)$. In the plane of $z$ and $ct$ the path is cut at the front and its far part is shifted by
$\tfrac12H$ in both $z$ and $ct$, along the front itself. It is continuous only where $H = 0$. In the equation of
motion for $v$, a $\delta(u)$ multiplies the step that it makes in $\vect p_\perp$, a product that ordinary functions
do not define.[^distributions]

<!-- diagram: tut-impulsive-front — spec: left, a spacetime diagram in (z, ct), z to the right, ct up, equal scales;
the front u = 0 as a 45° line (field colour, thick); three worldlines, each a straight segment before and after the
front, in the paper's ink, each crossing the front at a place where H = 0, so that it is continuous in these
coordinates: (1) slow matter, nearly vertical, with a kink at the front tilting it out of the (z, ct) plane, shown by
a short arrow across the page labelled Δp⊥; (2) light moving with the front, drawn along a parallel 45° line just
behind it, never crossing (no kink); (3) light moving along −z, a −45° line crossing the front, with the largest kink.
A small dashed copy of worldline (1), crossing where H > 0, shows its far part shifted by H/2 in both z and ct along
the front, the jump in v. Right, a side panel: the plane of the front with one arrow ∇H (uniform, 0.3 in drawing
units) and, beside it, the three kicks ½q∇H to one scale with q = mc, 0 and 2E/c (E = mc² for the photon), lengths
0.15, 0, 0.3. Kinks computed from q kept and Δp⊥ = ½q∇H; the tilt is exaggerated by a stated factor. Caption: "Look
first at the three kinks on the front: slow matter and light running against the front turn, while light riding with
it does not. The three paths cross where the profile is zero; where it is not, the dashed path shows the far part
shifted along the front. Kinks drawn for one value of ∇H, exaggerated." -->

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
parts in $10^3$. This tests only the sideways kick.

**Where it fails.** A wave of finite length $\ell_{\rm f}$ passes a slow part in the time $\ell_{\rm f}/c$, in which
the part moves $\obs v_\perp\ell_{\rm f}/c$. When that is small beside the distance over which $\nabla H$ changes, and
the body's own forces act little in that time, the kick is [](#eq:wave-kick). This is 1.8's impulse approximation, and
the paper's condition "when the matter moves little across the front while the wave passes".

::: gap
This sketch solves the geodesic through a front of finite length only for the quadratic profile. Such a wave, with
$\delta(u)$ replaced by any bump, is still an exact solution wherever $H$ is harmonic, because the first section never
used the shape of $\delta(u)$. More generally the profile may be any $H(u, \vect x_\perp)$ that is harmonic in $\vect
x_\perp$ at each $u$: these are the **plane-fronted waves**, and the impulsive wave is the special case $H(\vect
x_\perp)\,\delta(u)$.
:::

## A wave and its reverse together always give energy

We want the energy that the wave leaves in a body. Chapter 6.4 put the kick $\tfrac12q\nabla H$ into its kick formula
and found the paper's equation; the last section derived the kick:[^e-cpz]

{{paper eq:shock}}

The first term has either sign, so, in the paper's words, "one wave can take energy from what it crosses". What is new
here is the sum over a body. Let a body be made of particles $a$, with light-cone components $q_a$, at the places
$\vect x_a$ on the front. Let $E_+$ be its energy after the wave, $E_-$ after the reverse wave, of profile $-H$, and
$E_0$ with no wave. Reversing $H$ reverses the first term and keeps the second, so in the sum $E_+ + E_- - 2E_0$ each
particle leaves $\tfrac14cq_a|\nabla H(\vect x_a)|^2$. With chapter 6.5's $\sym{crossing-energy}{\matter{\mathcal N}}
= c\sum_aq_a\,\delta^2(\vect x_\perp - \vect x_a)$, the energy less $c$ times the momentum along $z$ that crosses each
square metre of the front, in $\mathrm{J\,m^{-2}}$, the sum is an integral over the front:[^script]

{{paper eq:shock-even}}

It cannot be negative, because ordinary matter has $\matter{\mathcal N} \ge 0$ (6.5's null energy condition).

**The slow limit.** For slow matter $q_a \approx \matter m_ac$, so $\matter{\mathcal N} =
\sym{projected-density}{\matter \Sigma}c^2$, with $\matter\Sigma$ chapter 1.8's mass per square metre projected along
$z$. The sum becomes $\tfrac14c^2\int\matter\Sigma\,|\nabla H|^2\,\dd^2x_\perp$. Since $\nabla H$ does not change
along $z$, each of the two waves gives the second term of the paper's [](/paper/#eq:push), with $\epsilon\nabla g$
replaced by $\tfrac12c\nabla H$, and the sum holds that term twice, once for each wave. This is Newton's impulsive
tide again. Chapter 13.1 calls that term the even part, so the sum is twice the even part.

## Pairs of waves read the Fourier transform of what crosses the front

The chapter asks what a passing particle reads of a body. One wave gives one number, and pairs of waves give the
whole of $\matter{\mathcal N}$. We write $B(H_1, H_2) = \int\nabla H_1\cdot\nabla H_2\,\matter{\mathcal
N}\,\dd^2x_\perp$, in joules,[^B] so the last section measured $B(H, H) = 4(E_+ + E_- - 2E_0)$. The pairing is linear
in each profile, so chapter 13.2's polarization identity gives it from four signed waves, $\pm(H_1 + H_2)$ and
$\pm(H_1 - H_2)$. For the profiles we take chapter 13.2's Calderón pair in the two dimensions of the front, $h_\pm =
e^{\vect\zeta_\pm\cdot\vect x_\perp}$ with $\vect\zeta_\pm = \tfrac12(i\vect\xi \pm \vect\eta)$. Here $\vect\xi$ is a
wavevector in the plane of the front, in $\mathrm{m^{-1}}$, and $\vect\eta$ is at right angles to it and as
long.[^letters] Both functions are harmonic, because $\vect\zeta_\pm\cdot\vect\zeta_\pm = 0$, so each, times a small
length, is a profile. One grows as
$e^{\vect\eta\cdot\vect x_\perp/2}$ across the body and the other falls, and their product is the ripple
$e^{i\vect\xi\cdot\vect x_\perp}$. Since $\nabla h_+\cdot\nabla h_- = \vect\zeta_+\cdot\vect\zeta_-\,e^{i\vect\xi\cdot
\vect x_\perp} = -\tfrac12|\vect\xi|^2e^{i\vect\xi\cdot\vect x_\perp}$,

$$\boxed{\;B(h_+, h_-) = -\tfrac12|\vect\xi|^2\,\tilde{\matter{\mathcal N}}(\vect\xi)\;} \label{eq:pair}$$

with $\tilde{\matter{\mathcal N}}(\vect\xi) = \int\matter{\mathcal N}\,e^{i\vect\xi\cdot\vect x_\perp}\,\dd^2x_\perp$.
The pair is complex, so it takes four real pairings, sixteen signed waves for each $\vect\xi$, as 13.2 counts sixteen
weighings in Newton's case. At $\vect\xi = 0$ both profiles are 1, which kicks nothing, and both sides vanish.

By 6.5, $\matter{\mathcal N}$ at each point of the front is the integral of $\matter T_{\mu\nu}k^\mu k^\nu$ along the
null ray through it, with $\matter T_{\mu\nu}$ the stress–energy tensor, in $\mathrm{J\,m^{-3}}$, and $k^\mu = (1, 0,
0, 1)$ the wave's direction. It is a projection of the body along the wave's path, "as in X-ray tomography". For slow
matter it is $c^2\matter\Sigma$, so projections along the directions of one great circle give the density everywhere,
as in chapter [5.6](/tutorial/waves/abel-transform/#a-body-that-is-not-round-needs-views-from-many-directions). Waves
from every direction give the integrals of $\matter T_{\mu\nu}$ along every null ray, its **light-ray transform**. The
paper states that what these integrals miss is known [@KrishnanSenapatiVashisth2020]. Chapter
[6.5](/tutorial/relativity/stress-energy/#some-stresses-are-invisible-to-every-ray) showed that the stresses $\matter
T_\phi$, built from any smooth function $\phi$ that is zero outside a region, give zero on every ray, and that in
ordinary matter they can change the energy density by only about a part in $10^{12}$.

<!-- diagram: tut-light-ray-transform — spec: left, a lumpy body at rest (the paper's stone palette), crossed by a
bundle of parallel null rays drawn as thin lines in one direction n̂ (light colour), and below it, on the plane of the
front, the projected Σ as a height map (matter colour); right, the Fourier plane with three slices k·n̂ = 0 for three
directions n̂ of one great circle (each slice thin, translucent, in the colour of its bundle), all containing the
circle's axis ν̂, and a fourth dashed slice to suggest that turning n̂ round the circle fills the plane; the
projection computed exactly for a sum of three Gaussian lumps. Caption: "Look first at the slices on the right: each
direction of waves gives the transform of the energy that crosses its front on one slice, and the directions of one
great circle fill every wavevector. The body and its projection are computed; the rays are drawn sparse for clarity."
-->

::: gap
This sketch states without proof that the null space of the light-ray transform is known, and it does not show how
waves could be sent through a body from every direction.
:::

## The field of a particle without mass is an impulsive wave

We want the profile of the wave that a particle without mass carries. **The particle moves at $c$ along $+z$** through
the point $\vect b$ of the front, in metres, with energy $E$ and momentum $\sym{massless-momentum}{p} = E/c$, in
$\mathrm{kg\,m\,s^{-1}}$. It is chapter
[6.5](/tutorial/relativity/stress-energy/#dust-a-fluid-and-a-beam-of-light-each-fill-the-table)'s null dust gathered
at one point, so

$$\matter T^{00} = \matter T^{0z} = \matter T^{zz} = E\,\delta(z - ct)\,\delta^2(\vect x_\perp - \vect b) ,$$

in $\mathrm{J\,m^{-3}}$. Lowering with $\field\eta_{\mu\nu}$ flips the sign of $\matter T_{0z}$ alone. Since $x^0 =
\tfrac12(u + v)$ and $z = \tfrac12(v - u)$, a step in $u$ moves $x^0$ by $\tfrac12$ and $z$ by $-\tfrac12$, so

$$\begin{aligned}\matter T_{uu} &= \tfrac14\bigl(\matter T_{00} - 2\matter T_{0z} + \matter T_{zz}\bigr)\\
&= E\,\delta(u)\,\delta^2(\vect x_\perp - \vect b) ,\end{aligned}$$

using $\delta(z - ct) = \delta(-u) = \delta(u)$. The same steps give $\matter T_{uv} = \matter T_{vv} = 0$, and the
trace is zero, as for any null dust. So 7.3's trace-reversed equation is $\curv R_{uu} = (8\pi G/c^4)\matter T_{uu}$
with every other entry zero, which the metric [](#eq:wave-metric) can meet. With [](#eq:ricci-uu),

$$\nabla_\perp^2H = -\frac{16\pi GE}{c^4}\,\delta^2(\vect x_\perp - \vect b) .$$

Chapter 2.4's Green's function in the plane, $\nabla^2\ln r = 2\pi\delta^2$, solves it:

$$\boxed{\;H = -\frac{8Gp}{c^3}\,\ln|\vect x_\perp - \vect b|\;} \label{eq:as-profile}$$

This is the paper's profile. The impulsive wave with this profile is the **Aichelburg–Sexl wave**, the field of a
particle without mass.[^gauge] Its curvature is zero everywhere off the plane that moves with the particle, so nothing
of the field arrives before the particle does. **Units:** $Gp/c^3$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times
$\mathrm{kg\,m\,s^{-1}}$ over $\mathrm{m^3\,s^{-3}}$, a metre. **A check:** on a circle of radius $r$ round $\vect b$,
$\nabla H$ points inward with the size $8Gp/c^3r$, and the circle is $2\pi r$ long, so the flux of $\nabla H$ out of
it is $-16\pi Gp/c^3$ whatever $r$ is. That is 2.4's $2\pi$ times $-8Gp/c^3$, as Gauss's law in the plane requires.
Aichelburg and Sexl found it in 1971 as the limit of Schwarzschild's field boosted toward $c$ with its energy
held fixed [@AichelburgSexl1971]; we state that without proof.

**A limit.** A photon of energy $E'$ crossing this wave head-on has $q = 2E'/c$ (6.4), so [](#eq:wave-kick) turns it
by $|\Delta\vect p_\perp|/(E'/c) = |\nabla H| = 8GE/c^4b$ at the distance $b$. A mass $E/c^2$ at rest bends light by
$4GE/c^4b$ (chapter [11.1](/tutorial/black-holes/schwarzschild/#far-from-a-mass-light-bends-by-twice-newtons-angle)),
half as much. A photon moving with the particle has $q = 0$ and is not turned. So beams of light moving in opposite
directions attract, and parallel beams do not, as R. C. Tolman, P. Ehrenfest and B. Podolsky found
[@TolmanEhrenfestPodolsky1931]. **Meaning:** seen from the body it passes, a particle without mass is a front of the
paper's kind, the shock that chapter
[R12b](/tutorial/sky/reading-section-xi-2/#a-falling-camera-sees-a-smaller-shadow-and-a-fast-pixel-sees-every-scene-as-a-wave)
named.

## A particle without mass reads the interior as Newton's passing tonne does, with twice the kick

We want the energy that a passing particle without mass leaves in a body, **whose parts are at rest**. Each part then
has $\vect p_\perp = 0$ and $q \approx \matter mc$, and by [](#eq:wave-kick) and [](#eq:as-profile) it gets the
velocity

$$\Delta\obs{\vect v} = \tfrac12c\nabla H = \frac{4Gp}{c^2}\,\frac{\vect b - \vect s}{|\vect b - \vect s|^2} ,$$

toward the path, with $\vect s$ its place on the front. This is 1.8's kick, $C(\vect b - \vect s)/|\vect b - \vect
s|^2$, with

$$\boxed{\;\sym{flyby-constant}{C} = \frac{4Gp}{c^2}\;}$$

Newton's $C = 2G\matter\mu/V$, for a mass $\matter\mu = p/c$ at $V = c$, is $2Gp/c^2$. The kick is twice Newton's, "as
for the bending of light". Chapter
[6.5](/tutorial/relativity/stress-energy/#what-gravitates-is-the-energy-plus-the-sum-of-the-stresses) gives the reason:
what gravitates is the energy plus the sum of the stresses, $\matter T^{00} + \matter T^{11} + \matter T^{22} + \matter
T^{33}$. For the particle the only stress is $\matter T^{zz} = \matter T^{00}$, so its source is $\matter T^{00} +
\matter T^{zz} = 2E\,\delta(z - ct)\,\delta^2(\vect x_\perp - \vect b)$. A slow mass of the same energy has stresses
far below its $\matter T^{00}$, so its source is $E$ times the same deltas, half as much. Light passing a mass at rest
is bent by twice Newton's angle for the same reason (chapter 11.1).

<!-- diagram: tut-as-profile — spec: the plane of the front, from −3R to 3R in units of a disc of radius R (the body,
the paper's stone palette, centred at the origin), with H = −ln|x⊥ − b| for b = (1.5R, 0) drawn as contours at equal
steps (thin, field colour) and ∇H as arrows on a grid outside a small disc round b (ink); the arrows on the body
computed exactly, ½∇H to one scale. Inset, lower right: one part of the body at s = (0.5R, 0), with two arrows from it
toward b to one scale: the kick from this profile, (4Gp/c²)/|b − s|, and Newton's for a mass p/c at c, (2Gp/c²)/|b −
s|, half as long and dashed. Caption: "Look first at the inset: the kick of a particle without mass is twice Newton's
for the same energy. The contours of the profile are a logarithm round the point where the path crosses the front, and
the arrows point toward it." -->

**The energy.** With $\vect p_\perp = 0$, the paper's [](/paper/#eq:shock) gives each part $\tfrac18cq|\nabla H|^2$,
and summing as in [](#a-wave-and-its-reverse-together-always-give-energy) gives $\tfrac18\int|\nabla
H|^2\matter{\mathcal N} \,\dd^2x_\perp$. With $|\nabla H|^2 = 64G^2p^2/c^6|\vect b - \vect s|^2$ this is the paper's
equation:

{{paper eq:massless-pass}}

For slow matter $\matter{\mathcal N} = \matter\Sigma c^2$, and $(8G^2p^2/c^6)\,c^2 = \tfrac12(4Gp/c^2)^2 =
\tfrac12C^2$, so this is 1.8's pass, the paper's [](/paper/#eq:pass), with $C = 4Gp/c^2$. The paper states, and we
take without proof, that what the body gains the particle loses. A photon's energy is in proportion to its frequency,
so it leaves with a lower frequency, redder, by the fraction $\Delta E/E$: "a particle sent in from infinity and
received there thus reads the same transform".

{{paper fig:passing}}

**Numbers.** The tonne at $44\unit{km\,s^{-1}}$ has $C = 3.0\times10^{-12}\unit{m^2\,s^{-1}}$. A flash with the same
$C$ needs $p = Cc^2/4G = 1.0\times10^{15}\unit{kg\,m\,s^{-1}}$ and $E = 3.1\times10^{23}$ J: the mass-energy of 3400
tonnes, or what the Sun radiates in 0.8 ms. It leaves the same $8.8\times10^{-21}$ J in the ball as the tonne, and
arrives redder by 3 parts in $10^{44}$. The most energetic cosmic ray recorded, of $3.2\times10^{20}$ eV (51 J), has
$C = 5.1\times10^{-34}\unit{m^2\,s^{-1}}$, $1.7\times10^{-22}$ of the tonne's.

**The approximation.** The body must stay still while the particle passes. The front sweeps through the ball, 1 m
deep, in 3.3 ns. The ball's slowest ringing, of angular frequency $1.6\times10^4\unit{s^{-1}}$ (chapter 13.1's,
from Lamb's mode), turns through $5\times10^{-5}$ radians in that time, against 0.54 radians during the tonne's pass of
$b/V = 34\unit{\mu s}$, which chapter 1.8 estimated changes the energy the tonne leaves by 10 to 15 per cent. The
particle's own path is bent by the ball by $4G\matter M/c^2b = 8\times10^{-24}$ rad, so it is straight. **Meaning:** at
the speed of light the second reading is the same reading, and the speed of light enters only as the factor two.

<!-- try: impulsive-front — new (P7b-DECISIONS item 5; stand-in: mass-shell of 6.4). Prediction first, in the figure:
"A sheet of gravity sweeps across a cloud of slow dust, a photon flying with it and a photon flying against it. Which
are kicked, and which gains most energy?" (Answer shown after a choice: the dust gets ½c∇H; the photon against it the
largest turn, |∇H|, and the largest energy for its q; the photon with it nothing.) Left panel: the plane of the front,
x⊥ from −3R to 3R; a body of 200 particles in a disc of radius R (seeded, fixed). Controls: (1) profile, a three-way
choice: Aichelburg–Sexl H = −k ln|x⊥ − b| with the crossing point b draggable (mouse, touch, arrow keys; kept outside
the disc), default b = (1.5R, 0); quadrupolar H = (x² − y²)/2f; the real part of 13.2's pair, Re e^{ζ₊·x⊥}, with a
slider for |ξ| from 0.5/R to 6/R and one for its direction; (2) strength, a slider that sets the largest |∇H| on the
body from 10⁻⁴ to 10⁻² (shown as a number); (3) sign, ±H; (4) the body's motion along z, a slider for its rapidity
from −3 (moving with the front, q = mc e^{−3}) through 0 (at rest, q = mc) to +3 (against it), the label reading q/mc.
Arrows on each particle: the kick ½q∇H, to one stated scale; in AS mode a dashed arrow on the particle nearest b shows
Newton's kick for the same energy, half as long. Right panel: bars for E₊ − E₀, E₋ − E₀ and E₊ + E₋ − 2E₀, computed
from the paper's eq:proof-shock per particle, and beside the last a bar for ¼∫|∇H|²𝒩 = ¼Σ c q_a |∇H(x_a)|². Checks the
component must pass: the last two bars agree to 10⁻¹² relative for every setting; flipping the sign swaps the first
two bars and leaves the third; at rapidity 0 in AS mode every arrow is the velocity (4Gp/c²)(b − s)/|b − s|², twice
the dashed one; the third bar is never negative; at rapidity −3 the kicks shrink by e^{−3} ≈ 0.050; a fourth readout,
the rest-mass change M₊² + M₋² − 2M₀² against Q²Var(∇H)/2c², agrees with it and is zero for a uniform ∇H (test hook).
Below the panels, three test particles in a strip: a slow grain, a photon along +z (q = 0, no arrow), a photon along
−z (q = 2E/c, turn |∇H| in radians shown). Both themes, keyboard throughout, panels stacked at 390 px. Text for the
try block when built: "Predict first, then choose Aichelburg and Sexl's profile and drag the crossing point toward the
body: the kicks grow as 1/|b − s|, and the sum E₊ + E₋ − 2E₀ stays equal to ¼∫|∇H|²𝒩. Then slide the body's rapidity
toward the front's direction and watch every kick shrink with q." -->

::: check
### Q

Why is the impulsive wave an exact solution, and not only a solution of the weak-field equations?

### A

Every product of two Christoffel symbols in its curvature vanishes, so the Ricci tensor is exactly linear in $H$:
$\curv R_{uu} = -\tfrac12\nabla_\perp^2H\,\delta(u)$, with no neglected terms.

### Q

A slow grain and a slow boulder cross the same front at the same place. Which gets the larger velocity?

### A

Neither. Each gets $\tfrac12c\nabla H$, because the kick $\tfrac12q\nabla H$ grows with $q \approx \matter mc$.

### Q

A flash of $3.1\times10^{23}$ J passes 1 m from a grain at rest. What velocity does it give the grain?

### A

It gives $C/b = 4GE/c^3b = 3.1\times10^{-12}\unit{m\,s^{-1}}$, toward the flash's path.
:::

**The idea to keep: a front of gravity moving at the speed of light, with any profile harmonic across it, is an exact
solution of Einstein's equation. Whatever crosses it keeps $q = E/c - p_z$ and is kicked by $\tfrac12q\nabla H$, so
pairs of such waves read the Fourier transform of the energy that crosses the front, and a particle without mass is
such a wave: passing a body, it reads the interior as Newton's passing mass does, with twice the kick.**

::: problems
### Practice

A pulse of light of $2\times10^6$ J, about the energy of the largest laser pulses, passes 1 m from a small grain at
rest. Find $C$, the grain's velocity, and the angle by which a photon crossing the pulse head-on at that distance
turns.

::: solution
The flyby constant is $C = 4Gp/c^2 = 4GE/c^3 = 2.0\times10^{-29}\unit{m^2\,s^{-1}}$, so the grain gets $C/b =
2.0\times10^{-29}\unit{m\,s^{-1}}$ toward the path. The photon turns by $|\nabla H| = 8GE/c^4b =
1.3\times10^{-37}$ rad.
:::

### Stretch

With chapter 6.4: the two lumps of 6.4's worked example *The pair that a wave stops* sit at $\pm a\hat x$ on the
front, and the wave that stops their motion apart has $\nabla H = \mp\tfrac65\hat x$ at them. Find a profile
harmonic across the front that gives it.

::: solution
Try $H = k(x^2 - y^2)$, which is harmonic for every $k$. Its gradient is $(2kx, -2ky)$, which at $\pm a\hat x$ is
$\pm2ka\,\hat x$. Setting $2ka = -\tfrac65$ gives $H = -\tfrac35(x^2 - y^2)/a$.
:::

### The paper

Derive the paper's [](/paper/#eq:massless-pass) from Einstein's equation, and show that for slow matter it is the
paper's [](/paper/#eq:pass) with $C = 4Gp/c^2$.

::: solution
Build $\matter T_{uu} = E\,\delta(u)\,\delta^2(\vect x_\perp - \vect b)$, set $\curv R_{uu} = (8\pi G/c^4)\matter
T_{uu}$ with [](#eq:ricci-uu) and solve with 2.4's logarithm for [](#eq:as-profile). Each part at rest gains
$\tfrac18cq|\nabla H|^2$; summing gives $\tfrac18\int|\nabla H|^2\matter{\mathcal N}\,\dd^2x_\perp$, and $|\nabla
H|^2 = 64G^2p^2/c^6|\vect b - \vect s|^2$. With $\matter{\mathcal N} = \matter\Sigma c^2$ the factor is $\tfrac12C^2$.
:::
:::

::: paper
- [Section XIII](/paper/#sec:second-order), after [*A mass that passes*](/paper/#par:a-mass-that-passes): the wave, the
  paper's [](/paper/#eq:shock), [](/paper/#eq:shock-even) and [](/paper/#eq:massless-pass), Aichelburg and Sexl, and
  the light-ray transform.
- Appendix C, [*The energy given by an impulsive wave*](/paper/#par:the-energy-given-by-an-impulsive-wave): the metric,
  the kick and the paper's [](/paper/#eq:proof-shock) and [](/paper/#eq:proof-mass).
- [*Open problems*](/paper/#sec:status): the particle without mass as "the simplest wave sent in from infinity".
- [*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light): the shock
  that a fast pixel sees.
:::

::: deeper
- The [GR course, section 16.4](https://neovand.github.io/general-relativity/chapter-16.html#16-4-bending-light-finding-the-famous-factor-of-two)
  finds the factor two for light passing a mass, the factor of the last section.
- The [GR course, section 18.1](https://neovand.github.io/general-relativity/chapter-18.html#18-1-linearization-is-a-controlled-approximation-not-a-different-theory)
  explains when the linear theory is an approximation; the impulsive wave is a case where it is exact.
- H. Balasin (1997) and R. Steinbauer (1998) make the geodesics through a delta-function front rigorous
  [@Balasin1997; @Steinbauer1998].
:::

[^u]:  Not chapter 5.2's retarded time $u = t - r/c$, which this chapter does not use.

[^H]:  Not chapter 1.7's energy $H$, Section XII's bits $H$, or chapter 3.5's Wiener filter $H$.

[^F]:  Here $F$ is local to this section: not 6.5's energy flux or 4.5's push.

[^distributions]:  Balasin and Steinbauer give this product a meaning [@Balasin1997; @Steinbauer1998], and with it
    the jump in $v$ by $H$; we state their treatment without proof.

[^e-cpz]:  The paper's Section XIII writes $E - cp_z$ and its Appendix C $q = E/c - p_z$ without saying that they are
    the same component: $E - cp_z = cq$, so for slow matter $E - cp_z \approx \matter mc^2$ while $q \approx \matter
    mc$.

[^script]:  This $\matter{\mathcal N}$ is not chapter 2.5's script families of interiors.

[^B]:  Here $B$ is local to this section: not the magnetic curvature $\curv\tB_{ij}$.

[^letters]:  Here $\vect\eta$ is not 6.1's rapidity nor the metric $\field\eta_{\mu\nu}$, and $\vect\xi$ is not 7.2's
    separation $\xi^i$.

[^gauge]:  Changing the unit of length inside the logarithm adds a constant to $H$, which kicks nothing and only
    shifts the jump in $v$: it is a change of coordinates.
