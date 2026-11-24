---
id: '9.7'
title: 'Beyond one plane wave: ranging, other theories and what noise costs'
question: 'Section VIII says that "a single plane wave has no distance". Yet one pixel can range a source of waves, test Einstein''s theory in one reading, and read a wave beneath any nearby pull. Which numbers of the reading make this possible, and what does noise cost?'
part: '9'
requires: ['3.3', '7.2', '7.6', '9.1', '9.2', '9.5']
paper: [sec:one-pixel, eq:ranging-instant, eq:ranging-C, eq:helicity-split, fig:ranging, eq:bianchi-wave, eq:wave-vector, fig:beyond, tab:one-pixel, fig:separation-noise, fig:two-pixels, app:benchmarks]
figures: [fig:ranging, fig:beyond, fig:two-pixels]
live: [ranging, beyond]
depth: A
---

**What you need:** chapter [3.3](/tutorial/noise/measuring-a-number/)'s Fisher information, chapter
[7.2](/tutorial/geometry/curvature-and-tides/)'s curvature and Bianchi identity, chapter
[7.6](/tutorial/geometry/gravitational-waves/)'s plane waves, chapter [9.1](/tutorial/one-point/spin-two/)'s spin
weights and rotor, chapter [9.2](/tutorial/one-point/complex-symmetric/)'s singular values and [chapter
9.5](/tutorial/one-point/separating-waves/)'s steering vectors. Chapters [5.1](/tutorial/waves/wave-equation/)
(phase speed) and [5.3](/tutorial/waves/diffraction/) (arrays) are recalled.

Chapters 9.1 to 9.6 treated every wave at a pixel as a plane wave of Einstein's theory, which fills four of the ten
numbers. The paper's [*Ranging a wave source*](/paper/#par:ranging-a-wave-source) begins: "A single plane wave has no
distance." Yet a real source is at some distance, another theory might allow other polarizations, and a real pixel has
noise and perhaps a rotor turning three metres away.

Section VIII says that one pixel can still range a source, test Einstein's theory and read a wave beneath any nearby
pull. Which numbers of the reading make this possible, and what does noise cost?

::: plain
A wave from far away makes the pixel's reading a perfect square: one complex arrow multiplied by itself. A nearby
source spoils the square by a flaw that tells the distance, but the flaw shrinks as one over the distance squared,
because the first correction only tilts the arrow. The wave's two senses of turning tilt by different amounts, and
the angle between them shrinks only as one over the distance, so it ranges the source farther.

Where gravity is the bending of spacetime, a wave's magnetic part is fixed by its tide and its speed, so one reading
gives the speed and all six patterns such theories allow.

One wave's direction is known to one radian divided by the signal-to-noise ratio, the signal's size over the
noise's. A nearby pull of any strength hides the wave's tide, but the wave is still read from its magnetic part, and
its error grows only by the square root of two.
:::

## A nearby source spoils the square only at second order

We want the distance to a source from one pixel. A plane wave's reading is a square, $\curv c_2\,\vect m\vect m^{\mathsf
T}$, with the singular values $|\curv{\mathcal W}|$, 0 and 0 (chapter
[9.2](/tutorial/one-point/complex-symmetric/#singular-values-are-not-the-sizes-of-the-eigenvalues)). Here $\curv c_m$
are 9.1's components of spin weight $m$ about the direction of travel $\hat k$, in $\mathrm{s^{-2}}$, and $\vect m$ is
the unit null vector across $\hat k$. Chapter
[9.1](/tutorial/one-point/spin-two/#on-the-sky-a-quantity-of-spin-weight-s-begins-at-degree-s) stated Rainer Sachs's
result that its field **peels**: about the line of sight, its parts of spin weight 2, 1 and 0 fall as $1/r$, $1/r^2$ and
$1/r^3$ [@Sachs1962]. So at the angular frequency $\omega$, with $k = \omega/c$, the ratio $\curv c_1/\curv c_2$ is of
order $1/kr$ and $\curv c_0/\curv c_2$ of order $1/(kr)^2$. The pure number $\sym{reduced-distance}{kr}$ is the distance
in reduced wavelengths $c/\omega$, which are 477 km at 100 Hz. We assume that **the source is far, $kr \gg 1$**, and
keep terms to order $(kr)^{-2}$.

**The first order is a tilt.** With the pure number $\zeta = \curv c_1/\curv c_2$ (local) and 9.1's $T_1 = \vect m\hat
k^{\mathsf T} + \hat k\vect m^{\mathsf T}$, multiplying out the square on the right gives

$$\begin{aligned}\curv c_2\,\vect m\vect m^{\mathsf T} + \curv c_1T_1 &= \curv c_2\,(\vect m + \zeta\hat k)(\vect m +
\zeta\hat k)^{\mathsf T}\\ &\quad - \curv c_2\zeta^2\,\hat k\hat k^{\mathsf T} .\end{aligned}$$

The first term is again a square, of a null vector tilted toward $\hat k$: at first order the nearness only tilts the
apparent direction, which at one instant looks like a tilt of the source.

**The second order is the departure.** What is left, $\curv c_0T_0 - \curv c_2\zeta^2\,\hat k\hat k^{\mathsf T}$ with
9.1's $T_0 = 3\hat k\hat k^{\mathsf T} - 1$, is of order $(kr)^{-2}$. In the tilted wave's axes it multiplies $\hat k$
by $2\curv c_0 - \curv c_2\zeta^2$. On the square's plane it adds only a small multiple of the identity, which changes
the square's singular values at fourth order (the box). So the first two singular values are $|\curv c_2|$ and
$|2\curv c_0 - \curv c_2\zeta^2|$, and

$$\boxed{\;\frac{s_2}{s_1} = \Bigl|\frac{2\curv c_0}{\curv c_2} - \Bigl(\frac{\curv c_1}{\curv c_2}\Bigr)^2\Bigr| +
O\bigl((kr)^{-3}\bigr) .\;} \label{eq:departure}$$

::: derivation
### The singular values of a square and a small remainder

The vector $\vect m + \zeta\hat k$ has the square $\zeta^2$, so it is not quite null, but $\tilde{\vect m} = \vect m +
\zeta\hat k - \tfrac12\zeta^2\vect m^*$ is null to second order, because $\vect m\cdot\vect m^* = 1$. Since $\vect m
= (\vect e_1 + i\vect e_2)/\sqrt2$ in chapter
[1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero)'s axes, $\vect m\vect
m^{*\mathsf T} + \vect m^*\vect m^{\mathsf T} = 1 - \hat k\hat k^{\mathsf T}$, and the reading becomes

$$\begin{aligned}\curv{\mathcal W} &= \curv c_2\,\tilde{\vect m}\tilde{\vect m}^{\mathsf T} + \mu\,(1 - \hat k\hat
k^{\mathsf T})\\ &\quad + (2\curv c_0 - \curv c_2\zeta^2)\,\hat k\hat k^{\mathsf T},\end{aligned}$$

with $\mu = \tfrac12\curv c_2\zeta^2 - \curv c_0$; both small terms are of order $(kr)^{-2}$. In axes with $\tilde{\vect
m} = (1, i, 0)/\sqrt2$ and $\hat k$ along $z$ (which change the small terms only at third order), the table splits into
an $xy$ block, $\tfrac12\curv c_2$ times the rows $(1, i)$ and $(i, -1)$ plus $\mu$ times the identity, and the entry
$2\curv c_0 - \curv c_2\zeta^2$. The block's determinant is $\mu^2$ and its squared length close to $|\curv c_2|^2$, so
its singular values are close to $|\curv c_2|$ and $|\mu|^2/|\curv c_2|$, which is of order $(kr)^{-4}$.
:::

**A turning pair.** We take chapter 9.1's rotor, two equal masses turning in a circle, seen at the inclination $\iota$;
far away its two frequency parts are $\curv{\mathcal W}_\pm = \curv\alpha^\pm\vect m\vect m^{\mathsf T}$. We state, from
the exact linearized field of the pair, the coefficients that peeling leaves open. With the pure number $\chi =
\tan(\iota/2)$ (local), the part $\curv{\mathcal W}_+$ has

$$\frac{\curv c_1}{\curv c_2} = -\frac{2\sqrt2\,i\,\chi}{kr},\qquad \frac{\curv c_0}{\curv c_2} = -\frac{3\chi^2}{(kr)^2},$$

and the part $\curv{\mathcal W}_-$ the same with $1/\chi$ in place of $\chi$.[^exact] By [](#eq:departure) each part
departs from rank one by $|{-6} + 8|\,\chi^{\pm2}/(kr)^2$:

$$\boxed{\;\frac{s_2}{s_1}(\curv{\mathcal W}_\pm) = \frac{2\tan^{\pm2}(\iota/2)}{(kr)^2} ,\;}$$

as the paper states. At one instant the reading is $\curv{\mathcal W}_+e^{-i\omega t} +
\curv{\mathcal W}_-e^{i\omega t}$, and the same rule applied to the sum gives the paper's

{{paper eq:ranging-instant}}

with the pure number $\sym{rank-constant}{C(\iota, \theta)}$ (not 9.3's moment of inertia or 9.6's spectral matrix) and
the wave's phase $\sym{wave-phase}{\theta}$, zero when its plus tide is largest:

{{paper eq:ranging-C}}

It follows from [](#eq:departure), with the two parts entering in proportion to $\cos^4(\iota/2)e^{-i\theta}$ and
$\sin^4(\iota/2)e^{i\theta}$.

**Limits.** Seen edge-on, $\iota = 90°$, the paper's $A$ and $D$ are both $\cos^2\theta$ and $B = 0$, so $C = 2$ at
every phase where the wave itself is not zero. At $\theta = 0$, $C$ is proportional to $|1 - 3\cos^2\iota|$ and
vanishes at $\cos^2\iota = \tfrac13$, $\iota = 54.7°$.

**A check.** At $\theta = 0$ the exact field gives $(kr)^2s_2/s_1 = 0.205$, 0.244 and 1.996 at $kr = 80$ for $\iota =
30°$, 60° and 90°, against $C = 0.204$, 0.240 and 2; at $kr = 200$ they agree to 0.3%.[^phases][^static]

## The two frequency parts tilt apart, and the angle between them ranges the source

A Fourier transform of the record over one cycle gives the pixel the two parts $\curv{\mathcal W}_\pm$ separately,
the parts that turn as $e^{\mp i\omega t}$.

**The distance without the inclination.** By 9.1's rotor, $s_1(\curv{\mathcal W}_-) =
\tan^4(\iota/2)\,s_1(\curv{\mathcal W}_+)$. Multiplying each departure by its own $s_1$ gives the same $s_2 =
2\tan^2(\iota/2)\,s_1(\curv{\mathcal W}_+)/(kr)^2$ for both parts, because $\cot^2(\iota/2)\tan^4(\iota/2) =
\tan^2(\iota/2)$. So $s_1(\curv{\mathcal W}_+)\,s_1(\curv{\mathcal W}_-) = (kr)^4s_2^2/4$, and

$$\boxed{\;kr = \Bigl[\frac{2\sqrt{s_1(\curv{\mathcal W}_+)\,s_1(\curv{\mathcal W}_-)}}{s_2}\Bigr]^{1/2} ,\;}$$

with no knowledge of $\iota$. The exact field gives 80.3 at $kr = 80$ and 200.1 at $kr = 200$, for $\iota = 30°$.

**The tilt.** By 9.1's rule $\hat k = \mathrm{Re}(i\,\vect m\times\vect m^*)/|\vect m|^2$, the tilted vector $\vect m
+ \zeta\hat k$ travels along

$$\hat k - \zeta\vect m^* - \zeta^*\vect m = \hat k - 2\,\mathrm{Re}(\zeta^*\vect m)$$

to first order, using $\hat k\times\vect m^* = i\vect m^*$ and $\vect m\times\hat k = i\vect m$. For the pair $\zeta$
is $-i$ times a positive number, so $\zeta^*\vect m$ has the real part $-|\zeta|\vect e_2/\sqrt2$. The direction
therefore turns by the angle $\sqrt2\,|\zeta|$ toward 9.1's axis $\vect e_2$, the direction of growing azimuth about
the pair's axis. The two parts turn the same way, by $4\tan(\iota/2)/kr$ and $4\cot(\iota/2)/kr$. With $\cot x -
\tan x = 2\cot2x$ their difference is

$$\boxed{\;\sym{helicity-split}{\Delta\theta_\pm} = \frac{4}{kr}\Bigl[\cot\frac\iota2 - \tan\frac\iota2\Bigr] =
\frac{8\,|\cot\iota|}{kr} ,\;}$$

an angle in radians between two directions (not a change of the phase $\theta$), the paper's

{{paper eq:helicity-split}}

At $\iota = 30°$, $kr\,\Delta\theta_\pm = 13.86$; the exact field gives 13.7 at $kr = 80$ and 13.8 at $kr = 200$.
Edge-on the two parts tilt alike, so $\Delta\theta_\pm = 0$. Near face-on the weaker part fades as $\tan^4(\iota/2)$,
and its noisy direction limits the range.[^face]

**The reach.** Let $\rho$ be the signal-to-noise ratio of the whole reading over one cycle (defined
[below](#one-waves-direction-is-known-to-1ρ-a-factor-2-better-than-lights)). The two parts share it as $\rho_\pm$, with
$\rho_+^2 + \rho_-^2 = \rho^2$ and $\rho_-/\rho_+ = \tan^4(\iota/2)$. Each part's direction is known to about
$1/\rho_\pm$ radian, and the two independent errors add in quadrature, so the split is read to $(\rho_+^{-2} +
\rho_-^{-2})^{1/2}$. A way of ranging **ranges the source out to** the distance where its signal equals its own error.
So the split, falling as $1/kr$, ranges out to $kr$ of order $\rho$. The departure $C/(kr)^2$ is read to about
$1/\rho$, since noise of size $\sigma_n$ on each number adds about $\sigma_n$ to $s_2$ while $s_1$ stays close to
$|\curv{\mathcal W}|$; it ranges out only to $kr \approx (C\rho)^{1/2}$.

**A number:** at $\rho = 10^3$, $\iota = 60°$ and 100 Hz, $\tan^4 30° = 1/9$ gives $\rho_+ = 0.994\rho$ and $\rho_- =
0.110\rho$. The split $8\cot60°/kr = 4.62/kr$ is read to $(1/0.994^2 + 1/0.110^2)^{1/2}/\rho = 9.1/\rho$, and it
ranges out to $kr = 4.62\rho/9.1 = 507$, or $2.4\times10^5\unit{km}$. That is about two-thirds of the way to the Moon:
the paper's "a few hundred thousand kilometres". With $C$ averaged over the cycle, 0.80 at 60°, the departure reaches
only $kr = (0.80\times10^3)^{1/2} \approx 28$.

{{paper fig:ranging}}

::: try {#ranging}
For a turning pair, the plot shows each way of ranging, the split and the rank (the departure from rank one), as its
signal over its own noise against $kr$; a dot marks where each line falls to the noise. Sliders set the distance,
$\rho$ and the inclination.

Predict first: if $\rho$ grows a hundredfold, how much farther does each way reach? Move the Signal-to-noise slider up
two decades and read the dots. Then predict what happens to the split's reach toward face-on, and lower the
Inclination slider.
:::

## The second Bianchi identity ties a metric wave's magnetic part to its tide

We want what one reading says about a wave in other theories. In a **metric theory** of gravity, gravity is the
curvature of a spacetime metric and free bodies fall along its geodesics, as in Einstein's theory, but the field
equation may differ. Such theories allow up to six polarizations and other speeds [@EardleyLeeLightman1973].

We assume that **the wave is a weak plane wave of the metric**, every entry of 7.2's $\field h_{\mu\nu}$ a constant
times $e^{i(\vect k\cdot\vect x - \omega t)}$, travelling along $\hat k = \vect k/|\vect k|$ at the phase speed
$\sym{phase-speed}{v_p} = \omega/|\vect k|$ (chapter 5.1's speed of the crests), in $\mathrm{m\,s^{-1}}$, and we assume
**no field equation**. The linearized curvature of 7.2 carries the same factor, so on it $\partial_p$ becomes $ik_p$ and
$\partial_0 = c^{-1}\partial_t$ becomes $-i\omega/c$.

Chapter [7.2](/tutorial/geometry/curvature-and-tides/#the-pixel-reads-six-of-the-twenty-numbers-and-the-magnetic-part-eight-more)
stated the **second Bianchi identity**, $\partial_\sigma\curv R_{\alpha\beta\gamma\delta} + \partial_\gamma\curv
R_{\alpha\beta\delta\sigma} + \partial_\delta\curv R_{\alpha\beta\sigma\gamma} = 0$. We take the first pair $j0$ and
the other three indices $0$, $p$, $q$:

$$\partial_0\curv R_{j0pq} + \partial_p\curv R_{j0q0} + \partial_q\curv R_{j00p} = 0 .$$

By 7.2's symmetries $\curv R_{j0q0} = \curv R_{0j0q} = \curv\tE_{jq}/c^2$ and $\curv R_{j00p} = -\curv\tE_{jp}/c^2$.
Replacing the derivatives gives

$$\curv R_{j0pq} = \frac{k_p\curv\tE_{jq} - k_q\curv\tE_{jp}}{c\,\omega} .$$

The magnetic part is $\curv\tB_{ij} = \tfrac12c^2\epsilon_{ipq}\curv R_{pqj0}$ (chapter 7.2), and $\curv R_{pqj0} =
\curv R_{j0pq}$ by the pair symmetry. The two terms give the same sum after $p$ and $q$ are exchanged in the second, so
$\curv\tB_{ij} = (c/\omega)\,\epsilon_{ipq}k_p\curv\tE_{qj}$. With $\vect k = (\omega/v_p)\hat k$,

$$\boxed{\;\curv\tB_{ij} = \frac{c}{v_p}\,\epsilon_{ipq}\hat k_p\,\curv\tE_{qj} ,\;}$$

the paper's equation:

{{paper eq:bianchi-wave}}

**A limit.** At $v_p = c$ it is chapter
[7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)'s cross product
with $\hat k$.

**The count.** In empty space Einstein's equation sets the trace of 7.2's $\curv\tE$ and the antisymmetric part of its
$\curv\tB$ to zero, which leaves ten numbers. Another theory's field equation need not, so the full curvature can show
four more. Then $\curv\tE$ may have a trace: six numbers. Its magnetic part has no trace, since
$\epsilon_{ipq}\curv\tE_{qi} = 0$, but may have an antisymmetric part: eight. With $\hat k$ along $z$, the six entries
of $\curv\tE$ are the six polarizations of a metric wave: Einstein's plus and cross, two **vector** polarizations
$\curv\tE_{xz}$ and $\curv\tE_{yz}$, the **breathing** polarization $\curv\tE_{xx} = \curv\tE_{yy}$, equal across the
wave, and the **longitudinal** polarization $\curv\tE_{zz}$, along it. These six, two angles and the speed are nine
unknowns against fourteen numbers, which leaves five checks that the reading is one wave.

## Summing cross products of the columns gives the wave's direction and speed

We want $\hat k$ and $v_p$ from the reading. We write $\vect t_j$ and $\vect b_j$ for the $j$th columns of
$\curv\tE$ and $\curv\tB$ at one instant,[^columns] and $\sym{wave-vector-p}{\mathbf p} = (c/v_p)\hat k$, a vector
with no unit. Then [the boxed identity](#the-second-bianchi-identity-ties-a-metric-waves-magnetic-part-to-its-tide)
says $\vect b_j = \mathbf p\times\vect t_j$. The vector triple product gives $\vect t_j\times(\mathbf p\times\vect t_j)
= \mathbf p\,|\vect t_j|^2 - \vect t_j(\vect t_j\cdot\mathbf p)$. Summed over $j$, $\sum_j|\vect t_j|^2 = |\curv\tE|^2$
and $\sum_j\vect t_j(\vect t_j\cdot\mathbf p) = \curv\tE^2\mathbf p$, since $\curv\tE$ is symmetric, so

$$\boxed{\;\bigl(|\curv\tE|^2 - \curv\tE^2\bigr)\,\mathbf p = \sum_j\vect t_j\times\vect b_j ,\;}$$

the paper's

{{paper eq:wave-vector}}

**When it can be solved.** If $\curv\tE$ has the eigenvalues $\lambda_a$ (9.3's letters, in $\mathrm{s^{-2}}$), the
matrix on the left has the eigenvalues $|\curv\tE|^2 - \lambda_a^2$, each the sum of the other two squares. It is
invertible unless two $\lambda_a$ vanish, so whenever $\curv\tE$ has rank two or more. A purely longitudinal wave,
$\curv\tE \propto \hat k\hat k^{\mathsf T}$, has rank one and $\curv\tB = \mathbf p\times\hat k\,\hat k^{\mathsf T} =
0$, so its speed cannot be read at one point. With $\mathbf p$ found, the residual $\curv\tB - [\mathbf
p]_\times\curv\tE$, with $[\mathbf p]_\times$ the table of the cross product with $\mathbf p$, tests the five checks.

**A number.** A wave of Einstein's theory along $z$ with $\curv\tE_+ = 1$ (in any unit of tide) has $\curv\tE =
\mathrm{diag}(1, -1, 0)$ and $\curv\tB$ with 1 in the places 12 and 21. Then $\vect t_1\times\vect b_1 = \hat
x\times\hat y = \hat z$ and $\vect t_2\times\vect b_2 = (-\hat y)\times\hat x = \hat z$. The matrix is $2 -
\mathrm{diag}(1, 1, 0) = \mathrm{diag}(1, 1, 2)$, so $\mathbf p = \hat z$: the wave travels along $z$ at $v_p = c$.

## A massive graviton and a massive scalar differ in the sign of one ratio

We want two waves that Einstein forbids. Chapter 5.1's $\sym{refractive-index}{n} = c/v_p =
c|\vect k|/\omega$, the paper's $n$, is here a property of the wave in empty space. A field with mass has $n < 1$: its
crests move faster than light, but its signals travel at the group speed $c^2/v_p$, below $c$.

**A massive scalar.** A scalar that acts on matter through the metric scales the metric equally in every direction,
so its wave is $\field h_{\mu\nu} = \phi\,\field\eta_{\mu\nu}$, with $\phi \propto \cos(|\vect k|z - \omega t)$ a small
pure number. Chapter 7.2's
[linearized curvature](/tutorial/geometry/curvature-and-tides/#to-first-order-the-curvature-is-made-of-second-derivatives-of-the-metric)
with $\field h_{0j} = 0$, $\field h_{ij} = \phi\,\delta_{ij}$ and $\field h_{00} = -\phi$ gives

$$\curv\tE_{ij} = c^2\curv R_{0i0j} = \tfrac12c^2\bigl(\partial_i\partial_j\phi - \partial_0^2\phi\,\delta_{ij}\bigr) .$$

With $\partial_0^2\phi = -(\omega^2/c^2)\phi$ and $\partial_z^2\phi = -|\vect k|^2\phi$, the breathing entries are
$\curv\tE_{xx} = \curv\tE_{yy} = \tfrac12\omega^2\phi$ and the longitudinal one is $\curv\tE_{zz} = \tfrac12\omega^2(1 -
n^2)\phi$. Their ratio is $+(1 - n^2)$.

**A massive graviton.** Fierz and Pauli's massive graviton [@FierzPauli1939] has five polarizations. Its
**helicity-zero** wave, the one that does not turn about $\hat k$, must be trace-free and transverse to the wave vector,
which fixes its table (the box), and the same computation gives the ratio $-2(1 - n^2)$. At $n = 0.6$ the ratios are
$-1.28$ for the graviton and $0.64$ for the scalar: opposite signs, as at every speed, and both vanish as $v_p \to c$.
Einstein's wave has neither entry. At present bounds such a test needs signal-to-noise ratios far beyond any detector's,
but only one point.

::: derivation
### The graviton's ratio

The table is built from the unit four-vector along the travel that is transverse to the wave vector, $\varepsilon_\mu
= (-n, 0, 0, 1)/\sqrt{1 - n^2}$ (local letters, $k^\mu\varepsilon_\mu = 0$): $e_{\mu\nu} =
2\varepsilon_\mu\varepsilon_\nu - (\delta_{\mu x}\delta_{\nu x} + \delta_{\mu y}\delta_{\nu y})$, transverse, and
trace-free because $\varepsilon^\mu\varepsilon_\mu = 1$. So $e_{00} = 2n^2/(1 - n^2)$, $e_{0z} =
-2n/(1 - n^2)$, $e_{zz} = 2/(1 - n^2)$ and $e_{xx} = -1$. With $\field h_{\mu\nu} = \phi\,e_{\mu\nu}$ and the plane wave's
$\partial_0\partial_z \to \omega|\vect k|/c$, $\partial_0^2 \to -\omega^2/c^2$, $\partial_z^2 \to -|\vect k|^2$,

$$\begin{aligned}c^2\curv R_{0z0z} &= \tfrac12c^2\bigl(2\partial_0\partial_z\field h_{0z} - \partial_0^2\field h_{zz}\\
&\qquad - \partial_z^2\field h_{00}\bigr)\\ &= \frac{\omega^2\phi}{2}\,\frac{-4n^2 + 2 + 2n^4}{1 - n^2}\\ &= \omega^2(1 -
n^2)\,\phi ,\end{aligned}$$

while $c^2\curv R_{0x0x} = -\tfrac12c^2\partial_0^2\field h_{xx} = -\tfrac12\omega^2\phi$. The ratio is $-2(1 - n^2)$.
:::

{{paper fig:beyond}}

::: try {#beyond}
One reading of a metric wave: $\curv\tE$ and $\curv\tB$ as grids, then the six polarizations as set (outline) and as
read back (filled), the phase speed read and whether the five checks pass. Choose the theory, and
one wave or two.

Predict first: will the breathing and longitudinal bars of the massive graviton and of the scalar point the same way?
Choose Einstein, then Massive, then Scalar. Then predict what the checks report when a second wave from another
direction crosses the pixel, and choose A second wave.
:::

## One wave's direction is known to 1/ρ, a factor √2 better than light's

We want the error of a wave's direction, and we are back in Einstein's theory and its ten numbers. We
assume, as the paper's [*Precision*](/paper/#par:precision) does, **independent Gaussian noise of standard deviation
$\sigma_n$ on each of the ten numbers**, the coefficients of $\curv\tE$ and $\curv\tB$ in chapter 1.5's orthonormal
basis (the paper's bare $\sigma$), in $\mathrm{s^{-2}}$. The signal-to-noise ratio of the whole reading is

$$\sym{reading-snr}{\rho} = \frac{|\curv{\mathcal W}|}{\sigma_n} ,$$

a pure number, with $|\curv{\mathcal W}|^2 = |\curv\tE|^2 + |\curv\tB|^2$ (Section VIII's $\rho$, not a density).
Its parts carry subscripts: $\rho_\pm$ for the two frequency parts, and $\rho_E = |\curv\tE|/\sigma_n$ for the tide
alone, which is $\rho/\sqrt2$ for a wave because $|\curv\tB| = |\curv\tE|$.

The ten numbers are the real and imaginary parts of $\curv{\mathcal W}$'s five components, so 3.3's [Fisher
information](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks) of an
unknown is the squared change of $\curv{\mathcal W}$ per unit change of the unknown, over $\sigma_n^2$. For
$\curv{\mathcal W} = \curv\alpha\,\vect m\vect m^{\mathsf T}$ with $\vect m$ of length one, turning $\hat k$ by a small
angle $\delta$ toward $\vect e_1$ sends $\vect e_1$ to $\vect e_1 - \delta\hat k$ and leaves $\vect e_2$ alone, so
$\vect m$ becomes $\vect m
- \delta\hat k/\sqrt2$ and

$$\delta\curv{\mathcal W} = -\frac{\curv\alpha\,\delta}{\sqrt2}\,T_1 ,\qquad |\delta\curv{\mathcal W}|^2 =
|\curv\alpha|^2\delta^2 = |\curv{\mathcal W}|^2\delta^2 ,$$

because $\langle T_1|T_1\rangle = 2$. So $F = \rho^2$ per square radian. A turn toward $\vect e_2$ gives $i$ times the
same change, and a change of $\curv\alpha$ a multiple of $T_2$. These are orthogonal in the real inner product that
the Fisher information uses, $\mathrm{Re}\langle T_1|iT_1\rangle = 0$ and $\langle T_1|T_2\rangle = 0$, so the Fisher
matrix is diagonal, and 3.3's Cramér–Rao bound gives

$$\boxed{\;\text{error of each angle of the direction} = \frac{1}{\rho}\ \text{rad} .\;}$$

At $\rho = 100$ the direction is known to 0.01 rad, or 0.57°.

**Light.** Light's wave is a multiple of $\vect m$ itself (9.1), not of its square, so the same turn changes it by
$\delta/\sqrt2$ of its size: half the pixel's squared change, because the square moves with both of its factors. A
sensor of light therefore places a wave to $\sqrt2/\rho$.

## The shape of the tide tells a wave from a mass at half its size

We want how surely one reading of $\curv\tE$ tells an isolated wave from an isolated mass. A wave's tide lies across
$\hat k$ with no trace (7.6), so its eigenvalues are $(-\lambda, 0, \lambda)$, in $\mathrm{s^{-2}}$; a mass's are $w(-2,
1, 1)$ with $w = G\matter M/r^3 > 0$. We state that the nearest symmetric table with given eigenvalues shares the
reading's axes, with the eigenvalues in the same order (Hoffman and Wielandt, 1953). Distances are chapter 1.5's
lengths, so the squared distance between the two shapes is $(\lambda - 2w)^2 + w^2 + (w - \lambda)^2$. **From a mass to
the nearest wave**, it is smallest at $\lambda = \tfrac32w$, where it is $\tfrac32w^2$, a quarter of $|\curv\tE|^2 =
6w^2$. **From a wave to the nearest mass**, it is smallest at $w = \lambda/2$, where it is $\lambda^2/2$, a quarter of
$2\lambda^2$. Both lie at half the reading's size.

So with the tide's own ratio $\rho_E$ (the paper's $\rho$ in this test), chapter 3.3's
[separation](/tutorial/noise/measuring-a-number/#choosing-between-two-scenes-comes-down-to-one-gaussian-number) of the
two scenes is $\rho_E/2$ noise standard deviations. The test is not between two fixed tables: each shape's size and
axes are fitted to the noisy reading, which lets noise reach the wrong shape more easily. A simulation of millions of
noisy readings at $\rho_E = 12$ takes a mass for a wave once in about 140 readings and a wave for a mass once in about
1350, each to within 2%: the paper's "fewer than one reading in a hundred".

## A near field costs the wave's amplitude exactly √2, however strong it is

We want to read a wave beneath a nearby pull. The paper's
[*Separation with noise*](/paper/#par:separation-with-noise) takes a wave at 100 Hz of strain $10^{-21}$, whose tide
$\curv\tE_+ = \tfrac12\omega^2\field h$ (7.6) is $2.0\times10^{-16}\unit{s^{-2}}$, and a rotor 3 m away: two 1 kg
masses 12 cm apart turning fifty times a second, like the rotors that calibrate LIGO by their pull [@Ross2021]. In the
rotor's plane the part of its tide that changes at 100 Hz, found from the two masses' Newtonian pulls, is
$2.8\times10^{-14}\unit{s^{-2}}$ in size, 99 times the wave's $\sqrt2\,\curv\tE_+$.

We assume that **the near field's tide at the wave's frequency is unknown and may be anything**, five free numbers
$\mathbf N$, and that **its magnetic part is below the noise**. The wave has an unknown amplitude $a$, in
$\mathrm{s^{-2}}$, along a known pattern whose tide and magnetic part are the five-number columns $\mathbf u_E$ and
$\mathbf u_B$ (local letters), each of length one, since $|\curv\tB| = |\curv\tE|$ in a wave. The data are $a\,\mathbf
u_E + \mathbf N$ and $a\,\mathbf u_B$, plus noise, so chapter
[3.3](/tutorial/noise/measuring-a-number/#an-unknown-we-do-not-want-can-only-enlarge-the-error-of-one-we-do)'s Fisher
matrix of $(a, \mathbf N)$ is

$$F = \frac{1}{\sigma_n^2}\begin{pmatrix}2 & \mathbf u_E^{\mathsf T}\\ \mathbf u_E & 1\end{pmatrix} ,$$

with 1 the $5\times5$ identity. The 2 counts the wave's signal in both halves of the reading. The inverse has
$(F^{-1})_{aa} = \sigma_n^2/(2 - |\mathbf u_E|^2) = \sigma_n^2$, against $\sigma_n^2/2$ with no near field, so

$$\boxed{\;\sigma_a\ \text{grows by exactly}\ \sqrt2 = 1.41 .\;}$$

Nothing in $F$ depends on $\mathbf N$, so the price is the same however strong the near field is: it takes the wave's
tide, and the wave is read from its magnetic part, which carries half its signal. Every change of a wave
changes $\curv\tE$ and $\curv\tB$ by equal amounts, so its direction pays the same $\sqrt2$. **Without the magnetic
part** the corner 2 becomes 1, $F$ is singular and the error infinite: the whole electric part cannot find a wave
beneath an unknown pull, as [R9](/tutorial/one-point/reading-section-viii/#ten-numbers-are-six-more-than-a-wave-needs)
saw at one instant. With the near field free at every frequency, the Fisher matrix of a record splits into such
blocks, one per frequency, so the argument holds over time too.

**The rotor.** Ignored, the rotor adds to the wave's estimate half the wave-shaped part of its tide, at most $99/2
\approx 50$ times the wave; the paper states 35 for its example.[^geometry] In its plane the exact field of a turning
quadrupole gives it a magnetic part $0.31\,kr = 2.0\times10^{-6}$ times its tide, with $kr = \omega r/c =
6.3\times10^{-6}$: at most $2\times10^{-4}$ of the wave, and a shift of the estimate by $9\times10^{-5}$ in the same
geometry, the paper's "less than $10^{-4}$". An array that reads only $\curv\tE$ must model the rotor from how its tide
varies across it. Section VIII states that the factor on the wave's error is then 2.2 for an array a metre
across, or 1.26 if it reads $\curv\tB$ as well.

<!-- diagram: tut-near-field-price — About 520 × 200 px at 1440 (full width on a phone). One horizontal bar of ten equal
cells, the wave's ten numbers, split by a thin gap into two halves of five: left half labelled "ℰ (tide)", right half
"ℬ (magnetic part)". Above the left half, a bracket in the matter colour labelled "taken by the near field, any
size"; the right half filled in the curvature colour and labelled "left for the wave: half its signal". Under the bar,
the result "error × √2". No orange or blue. Caption: "Look first at the bracket: an unknown near field uses up the five
numbers of the tide, and the wave is read from the other five, which hold half its signal, so its error grows by
exactly √2. Schematic." -->

## Many pixels separate more sources and remove false fringes

An array of $N$ pixels (chapter
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)) has a steering
vector of $5N$ numbers at one frequency and helicity. We state that a **subspace method** such as MUSIC, which splits
the averaged records into a part the sources fill and a part only the noise fills, separates up to $5N - 1$ uncorrelated
sources, against $N - 1$ for scalar sensors and $3N - 1$ for sensors of light.

**False fringes.** Two sensors a distance $D$ apart (not the $D$ of the paper's $C$) respond equally in a set of
directions, their **fringes**, $\vartheta_1 = c/(fD)$ apart at broadside (across their baseline), with $f$ the
frequency and $c/f$ the wavelength. Two pixels compare whole tables, so by chapter 9.1 a direction $\vartheta$ away is
weighted by $\cos^8(\vartheta/2)$. We state that a **minimum-variance (Capon) estimator**, which passes one direction
whole and lets through the least power from all others, then lifts the true fringe above the next false one by $1 +
\rho^2[1 - \cos^8(\vartheta_1/2)]$. With $D$ a hundred wavelengths, $1 - \cos^8(0.005) = 1.0\times10^{-4}$, so the
factor is 2 at $\rho = 100$, the paper's "once $\rho$ exceeds about a hundred". At 55° from broadside the nearer false
fringe, $1.72\,c/(fD)$ away, stands higher than the far one at $1.77\,c/(fD)$ (the paper's 1.8). For scalar sensors
the overlap is 1 and the factor stays 1.

{{paper fig:two-pixels}}

::: check
### Q

At $kr = 200$ and $\iota = 30°$, how far apart are the directions read from the two frequency parts?

### A

$8\cot30°/200 = 0.069$ rad, about 4.0°.

### Q

A near field of unknown size covers a wave's tide. By how much does the error of the wave's amplitude grow, and why
not more?

### A

By $\sqrt2$. The near field uses up the tide's five numbers, and the magnetic part, which it leaves alone, carries half
the wave's signal.

:::

**The idea to keep: a nearby source spoils a wave's square only at second order, but its two helicities tilt apart by
$8|\cot\iota|/kr$, which ranges it out to $kr$ of order $\rho$. The second Bianchi identity fixes a metric wave's
magnetic part by its tide and speed, so one reading tests Einstein's theory. Noise places one wave to $1/\rho$, and a
near field of any strength costs only $\sqrt2$, because the magnetic part repeats the wave.**

::: problems
### Practice

A wave of Einstein's theory travels along $z$ with $\curv\tE_+ = 0$ and $\curv\tE_\times = 1$. Write $\curv\tE$ and
$\curv\tB$, and find $\mathbf p$ from the paper's [](/paper/#eq:wave-vector).

::: solution
$\curv\tE$ has 1 in the places 12 and 21. By $\curv\tB_{ij} = \epsilon_{i3q}\curv\tE_{qj}$, $\curv\tB =
\mathrm{diag}(-1, 1, 0)$. The columns give $\vect t_1\times\vect b_1 = \hat y\times(-\hat x) = \hat z$ and $\vect
t_2\times\vect b_2 = \hat x\times\hat y = \hat z$. With $|\curv\tE|^2 = 2$ and $\curv\tE^2 = \mathrm{diag}(1, 1, 0)$ the
matrix is $\mathrm{diag}(1, 1, 2)$, so $\mathbf p = \hat z$ and $v_p = c$.
:::

### Stretch

Combine with chapter 9.1's rotor. At $\iota = 60°$ and $kr = 200$, find the departures of the two parts, check that
their $s_2$ agree, and recover $kr$ from the inclination-free formula.

::: solution
The departures are $2\tan^2(30°)/200^2 = 1.67\times10^{-5}$ and $2\cot^2(30°)/200^2 = 1.50\times10^{-4}$. Since
$s_1(\curv{\mathcal W}_-) = s_1(\curv{\mathcal W}_+)/9$, both give $s_2 = 1.67\times10^{-5}\,s_1(\curv{\mathcal W}_+)$,
and the formula gives $[(2/3)/(1.67\times10^{-5})]^{1/2} = 200$.
:::

### The paper

A massive scalar wave along $z$ has $\curv\tE = \curv\tE_{xx}\,\mathrm{diag}(1, 1, 1 - n^2)$, with $\curv\tE_{xx} =
\tfrac12\omega^2\phi$.
Find $\curv\tB$ from the paper's [](/paper/#eq:bianchi-wave), show that it is antisymmetric, and check that the paper's
[](/paper/#eq:wave-vector) returns $\mathbf p = n\hat z$.

::: solution
$\curv\tB_{ij} = n\,\epsilon_{i3q}\curv\tE_{qj}$ gives only $\curv\tB_{12} = -n\curv\tE_{xx}$ and $\curv\tB_{21} =
n\curv\tE_{xx}$: antisymmetric, which no wave of Einstein's theory can be. Then $\vect t_1\times\vect b_1 = \vect
t_2\times\vect b_2 = n\curv\tE_{xx}^2\hat z$ and $\vect b_3 = 0$. The matrix has the $zz$ entry $2\curv\tE_{xx}^2$, so
$p_z = 2n\curv\tE_{xx}^2/(2\curv\tE_{xx}^2) = n$, and $p_x = p_y = 0$.
:::
:::

::: paper
- Section VIII's [*Ranging a wave source*](/paper/#par:ranging-a-wave-source): the paper's
  [](/paper/#eq:ranging-instant), [](/paper/#eq:ranging-C), [](/paper/#eq:helicity-split) and Figure
  [](/paper/#fig:ranging).
- [*Tests of general relativity from one reading*](/paper/#par:tests-of-general-relativity-from-one-reading): the
  paper's [](/paper/#eq:bianchi-wave), [](/paper/#eq:wave-vector) and Figure [](/paper/#fig:beyond).
- [*Precision*](/paper/#par:precision), [*Separation with noise*](/paper/#par:separation-with-noise) and Table
  [](/paper/#tab:one-pixel): $1/\rho$ and $\sqrt2$.
- [*One pixel and many*](/paper/#par:one-pixel-and-many) and Figure [](/paper/#fig:two-pixels): arrays and fringes.
:::

::: deeper
- The GR course derives the identity behind the paper's [](/paper/#eq:bianchi-wave) in
  [section 9.4](https://neovand.github.io/general-relativity/chapter-9.html#9-4-bianchi-identities-why-the-curvature-components-cannot-vary-independently),
  and shows why Einstein's theory keeps two of the six polarizations in
  [section 18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten).
- C. M. Will, *Theory and Experiment in Gravitational Physics* (2nd ed., Cambridge, 2018), chapter 11: the polarizations
  and speeds of waves in other theories.
:::

[^exact]: The exact linearized field of a turning point quadrupole matches these within 1.3% at $kr = 80$ and 0.5% at
    $kr = 200$.

[^phases]: The paper's "within a few per cent at $kr = 80$" holds at the phase $\theta = 0$. Over the whole cycle
    the next order reaches 10% at $kr = 80$ and 4% at $kr = 200$ ($\iota$ from 15° to 60°).

[^static]: The pair's mass also makes a steady tide, of order $(c/v)^2$ times the departure, with $v$ the masses'
    speed. The paper reads the oscillating part from the rate of change of $\mathcal W$, which holds none of it.

[^face]: The paper asks that $\tan^2(\iota/2)$ and $\cot^2(\iota/2)$ both exceed $1/kr$.

[^columns]: The paper writes $\vect e_j$ for $\vect t_j$. Here $\vect e_1$ and $\vect e_2$ stay the axes across a
    wave.

[^geometry]: The paper does not state its geometry. A pixel in the rotor's plane at 30° from $x$, with the wave from
    $(-0.45, -0.35, 0.82)$, gives 35.5.
