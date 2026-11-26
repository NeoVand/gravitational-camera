---
id: '9.7'
title: 'Beyond one plane wave: ranging, other theories and what noise costs'
question: 'A single plane wave has no distance. Yet one pixel can range a source of waves, test Einstein''s theory in one reading, and read a wave beneath any nearby pull. Which numbers of the reading make this possible, and what does noise cost?'
part: '9'
requires: ['3.3', '7.2', '7.6', '9.1', '9.2', '9.5']
paper: [sec:one-pixel, eq:ranging-instant, eq:ranging-C, eq:helicity-split, fig:ranging, eq:bianchi-wave, eq:wave-vector, fig:beyond, tab:one-pixel, fig:separation-noise, fig:two-pixels, app:benchmarks]
figures: [fig:ranging, fig:beyond, fig:two-pixels]
live: [ranging, beyond]
depth: A
---

A plane wave has no distance: the same wave comes from a source at any range. Yet a real source is at some distance,
another theory might allow other polarizations, and a real pixel has noise and perhaps a rotor turning three metres
away. Which numbers of the reading let one pixel range a source, test Einstein's theory and read a wave beneath any
nearby pull, and what does noise cost?[^first]

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

A plane wave's reading is a square, $\curv c_2\,\vect m\vect m^{\mathsf T}$, with the singular values $|\curv{\mathcal
W}|$, 0 and 0
([section 9.2](/tutorial/one-point/complex-symmetric/#singular-values-are-not-the-sizes-of-the-eigenvalues)). Here
$\curv c_m$ are the components of spin weight $m$ about the direction of travel $\hat k$
([section 9.1](/tutorial/one-point/spin-two/#on-the-sky-a-quantity-of-spin-weight-s-begins-at-degree-s)), in
$\mathrm{s^{-2}}$, and $\vect m$ is the unit null vector across $\hat k$. Rainer Sachs showed that the field of a
source **peels**: about the line of sight, its parts of spin weight 2, 1 and 0 fall as $1/r$, $1/r^2$ and $1/r^3$
[@Sachs1962]. So at the angular frequency $\omega$, with $k = \omega/c$, the ratio $\curv c_1/\curv c_2$ is of order
$1/kr$ and $\curv c_0/\curv c_2$ of order $1/(kr)^2$. The pure number $\sym{reduced-distance}{kr}$ is the distance in
reduced wavelengths $c/\omega$, which are 477 km at 100 Hz. We assume that **the source is far, $kr \gg 1$**, and keep
terms to order $(kr)^{-2}$.

**The first order is a tilt.** With the pure number $\zeta = \curv c_1/\curv c_2$ (local) and $T_1 = \vect m\hat
k^{\mathsf T} + \hat k\vect m^{\mathsf T}$ of section 9.1, multiplying out the square on the right gives

$$\begin{aligned}\curv c_2\,\vect m\vect m^{\mathsf T} + \curv c_1T_1 &= \curv c_2\,(\vect m + \zeta\hat k)(\vect m +
\zeta\hat k)^{\mathsf T}\\ &\quad - \curv c_2\zeta^2\,\hat k\hat k^{\mathsf T} .\end{aligned}$$

The first term is again a square, of a null vector tilted toward $\hat k$: at first order the nearness only tilts the
apparent direction.

**The second order is the departure.** What is left, $\curv c_0T_0 - \curv c_2\zeta^2\,\hat k\hat k^{\mathsf T}$ with
$T_0 = 3\hat k\hat k^{\mathsf T} - 1$, is of order $(kr)^{-2}$. In the tilted wave's axes it multiplies $\hat k$ by
$2\curv c_0 - \curv c_2\zeta^2$. On the square's plane it adds only a small multiple of the identity, which changes the
square's singular values at fourth order (the box). So the first two singular values are $|\curv c_2|$ and $|2\curv c_0
- \curv c_2\zeta^2|$, and

$$\boxed{\;\frac{s_2}{s_1} = \Bigl|\frac{2\curv c_0}{\curv c_2} - \Bigl(\frac{\curv c_1}{\curv c_2}\Bigr)^2\Bigr| +
O\bigl((kr)^{-3}\bigr) .\;} \label{eq:departure}$$

::: derivation
### The singular values of a square and a small remainder

The vector $\vect m + \zeta\hat k$ has the square $\zeta^2$, so it is not quite null, but $\tilde{\vect m} = \vect m +
\zeta\hat k - \tfrac12\zeta^2\vect m^*$ is null to second order, because $\vect m\cdot\vect m^* = 1$. Since $\vect m
= (\vect e_1 + i\vect e_2)/\sqrt2$ in the axes of
[section 1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero), $\vect m\vect
m^{*\mathsf T} + \vect m^*\vect m^{\mathsf T} = 1 - \hat k\hat k^{\mathsf T}$, and the reading becomes

$$\begin{aligned}\curv{\mathcal W} &= \curv c_2\,\tilde{\vect m}\tilde{\vect m}^{\mathsf T} + \mu\,(1 - \hat k\hat
k^{\mathsf T})\\ &\quad + (2\curv c_0 - \curv c_2\zeta^2)\,\hat k\hat k^{\mathsf T},\end{aligned}$$

with $\mu = \tfrac12\curv c_2\zeta^2 - \curv c_0$; both small terms are of order $(kr)^{-2}$. In axes with $\tilde{\vect
m} = (1, i, 0)/\sqrt2$ and $\hat k$ along $z$ (which change the small terms only at third order), the table splits into
an $xy$ block, $\tfrac12\curv c_2$ times the rows $(1, i)$ and $(i, -1)$ plus $\mu$ times the identity, and the entry
$2\curv c_0 - \curv c_2\zeta^2$. The block's determinant is $\mu^2$ and its squared length close to $|\curv c_2|^2$, so
its singular values are close to $|\curv c_2|$ and $|\mu|^2/|\curv c_2|$, which is of order $(kr)^{-4}$.
:::

**A turning pair.** Take two equal masses turning in a circle (the rotor of section 9.1), seen at the inclination
$\iota$; far away its two frequency parts are $\curv{\mathcal W}_\pm = \curv\alpha^\pm\vect m\vect m^{\mathsf T}$, with
the helicity amplitudes $\curv\alpha^+ \propto \cos^4(\iota/2)\,e^{2i\varphi}$ and $\curv\alpha^- \propto
\sin^4(\iota/2)\,e^{-2i\varphi}$ of [section 9.1](/tutorial/one-point/spin-two/), $\varphi$ being the azimuth about the
pair's axis. The coefficients that peeling leaves open follow from one field equation: in empty space the reading has
no divergence, $\partial_i\curv{\mathcal W}_{ij} = 0$. Written as a series in $1/r$, its term at order $1/r^2$ gives the
part of spin weight 1 from the angular derivatives of the far field, and its term at order $1/r^3$ gives the part of
spin weight 0 from those of the spin-1 part (the box). With the pure number $\chi = \tan(\iota/2)$ (local), the part
$\curv{\mathcal W}_+$ has

$$\frac{\curv c_1}{\curv c_2} = -\frac{2\sqrt2\,i\,\chi}{kr},\qquad \frac{\curv c_0}{\curv c_2} = -\frac{3\chi^2}{(kr)^2},$$

and the part $\curv{\mathcal W}_-$ the same with $1/\chi$ in place of $\chi$.[^exact] Each order of the series lowers the
spin weight by one: this is the peeling, shown for this source. The parts of spin weight $-1$ and $-2$ enter later
still, at $1/r^4$ and $1/r^5$ [@Sachs1962], and do not reach the order we keep.

::: derivation
### The coefficients from the divergence of the field

**No divergence.** Contracting the derivative's index $\sigma$ in the second Bianchi identity (below, and section 7.2)
with the curvature's first index $\alpha$ gives $\partial^\alpha\curv R_{\alpha\beta\gamma\delta} = \partial_\gamma\curv R_{\beta\delta} -
\partial_\delta\curv R_{\beta\gamma}$, which vanishes in empty space, where the Ricci tensor is zero (section 7.3). With
$\beta = 0$, $\gamma = j$ and $\delta = 0$, and $\curv R_{00j0} = 0$, it reads $\partial_i\curv R_{i0j0} = 0$, so
$\partial_i\curv\tE_{ij} = 0$. Contracting the identity for the pair $j0$ and the three indices $i$, $p$, $q$ with
$\epsilon_{ipq}$ gives $3\epsilon_{ipq}\partial_i\curv R_{j0pq} = 0$, so $\partial_i\curv\tB_{ij} = 0$ too.

**The series.** Let $\hat n = \vect x/r$ point from the pair to the pixel, at the angle $\vartheta = \iota$ from the
pair's axis, with $\vect e_\vartheta$ and $\vect e_\varphi$ the unit vectors toward growing $\vartheta$ and $\varphi$
(the $\vect e_1$ and $\vect e_2$ of section 9.1), so that $\vect m = (\vect e_\vartheta + i\vect e_\varphi)/\sqrt2$. The
part at $e^{-i\omega t}$ is outgoing, so it carries $e^{ikr}$:

$$\curv{\mathcal W}_+ = e^{ikr}\Bigl(\frac{\mathsf A}{r} + \frac{\mathsf B}{r^2} + \frac{\mathsf C}{r^3} + \dots\Bigr),$$

with $\mathsf A$, $\mathsf B$, $\mathsf C$ symmetric trace-free tables (local letters) that depend only on $\hat n$. A
derivative $\partial_i$ falling on $e^{ikr}$ gives $ik\hat n_i$; on $r^{-s}$ it gives $-s\hat n_i/r$; on the direction it
gives $D_i/r$, with $D = \vect e_\vartheta\partial_\vartheta + \vect e_\varphi(\sin\vartheta)^{-1}\partial_\varphi$ the
gradient on the unit sphere, and $D_i\hat n_j = \delta_{ij} - \hat n_i\hat n_j$. Writing $\hat n\cdot\mathsf A$ for the
vector $\hat n_i\mathsf A_{ij}$ and $D\cdot\mathsf A$ for $D_i\mathsf A_{ij}$, the divergence vanishes order by order:

$$\begin{aligned}
1/r:&\quad ik\,\hat n\cdot\mathsf A = 0,\\
1/r^2:&\quad ik\,\hat n\cdot\mathsf B + D\cdot\mathsf A = 0,\\
1/r^3:&\quad ik\,\hat n\cdot\mathsf C - 2\,\hat n\cdot\mathsf B + D\cdot\mathsf B = 0 .
\end{aligned}$$

The first says that $\mathsf A$ lies across $\hat n$: it is the far field, $\mathsf A = \curv\alpha^+\vect m\vect
m^{\mathsf T}$ with $\curv\alpha^+$ now standing for $\cos^4(\vartheta/2)e^{2i\varphi}$ times a constant. A table
$\sum_s\curv c_sT_s$ in the spin-weight tables of section 9.1 has $\hat n\cdot T = \curv c_1\vect m + 2\curv c_0\hat n +
\curv c_{-1}\vect m^*$, since $\hat n\cdot T_1 = \vect m$ and $\hat n\cdot T_0 = 2\hat n$. So the second line gives
$\mathsf B$'s parts of spin weight 1, 0 and $-1$, and the third gives $\mathsf C$'s part of spin weight 0.

**Two derivatives of $\vect m$.** From $\partial_\vartheta\vect e_\vartheta = -\hat n$, $\partial_\vartheta\vect
e_\varphi = 0$, $\partial_\varphi\vect e_\vartheta = \cos\vartheta\,\vect e_\varphi$ and $\partial_\varphi\vect e_\varphi
= -\sin\vartheta\,\hat n - \cos\vartheta\,\vect e_\vartheta$, with $\vect m\cdot D = (\partial_\vartheta +
i\csc\vartheta\,\partial_\varphi)/\sqrt2$, we find

$$D\cdot\vect m = \frac{\cot\vartheta}{\sqrt2},\qquad (\vect m\cdot D)\,\vect m = \frac{\cot\vartheta}{\sqrt2}\,\vect m .$$

**Spin weight 1 at order $1/r^2$.** By the product rule, $D\cdot\mathsf A = [(\vect m\cdot D)\curv\alpha^+ +
\curv\alpha^+D\cdot\vect m]\,\vect m + \curv\alpha^+(\vect m\cdot D)\vect m$, which is

$$D\cdot\mathsf A = \frac{1}{\sqrt2}\bigl(\partial_\vartheta + i\csc\vartheta\,\partial_\varphi +
2\cot\vartheta\bigr)\curv\alpha^+\;\vect m .$$

It has no part along $\hat n$ or $\vect m^*$, so $\mathsf B$ has no part of spin weight 0 or $-1$. For $\curv\alpha^+
\propto \cos^4(\vartheta/2)e^{2i\varphi}$, $\partial_\vartheta\curv\alpha^+ = -2\chi\curv\alpha^+$ and
$i\csc\vartheta\,\partial_\varphi\curv\alpha^+ = -2\curv\alpha^+/\sin\vartheta$, and $-2/\sin\vartheta + 2\cot\vartheta
= -2\chi$, so the bracket is $-4\chi\curv\alpha^+$. The second line then gives the coefficient of $T_1$ in $\mathsf B$:

$$\curv c_1^{(2)} = \frac{i}{k}\Bigl(-\frac{4\chi}{\sqrt2}\Bigr)\curv\alpha^+ = -\frac{2\sqrt2\,i\chi}{k}\,\curv\alpha^+ .$$

**Spin weight 0 at order $1/r^3$.** The part of $\hat n\cdot\mathsf C$ along $\hat n$ is $2\curv c_0^{(3)} =
(i/k)\,\hat n\cdot(D\cdot\mathsf B - 2\hat n\cdot\mathsf B)$. The second term is zero, since $\mathsf B$ has no part of
spin weight 0. For the first, $\hat n_jD_i\mathsf B_{ij} = D_i(\hat n_j\mathsf B_{ij}) - \mathsf B_{ij}(\delta_{ij} -
\hat n_i\hat n_j) = D\cdot(\curv c_1^{(2)}\vect m)$, because $\mathsf B$ has no trace and no part of spin weight 0. With
$f = \curv c_1^{(2)} \propto \sin(\vartheta/2)\cos^3(\vartheta/2)e^{2i\varphi}$ (local),

$$D\cdot(f\vect m) = \frac{1}{\sqrt2}\bigl(\partial_\vartheta + i\csc\vartheta\,\partial_\varphi + \cot\vartheta\bigr)f
= \frac{1}{\sqrt2}\Bigl(\frac{1}{2\chi} - \frac{3\chi}{2} - \frac{1 + \chi^2}{\chi} + \frac{1 - \chi^2}{2\chi}\Bigr)f ,$$

using $1/\sin\vartheta = (1 + \chi^2)/2\chi$ and $\cot\vartheta = (1 - \chi^2)/2\chi$. The bracket is $-3\chi$, so

$$2\curv c_0^{(3)} = \frac{i}{k}\cdot\frac{-3\chi}{\sqrt2}\cdot\Bigl(-\frac{2\sqrt2\,i\chi}{k}\Bigr)\curv\alpha^+ =
-\frac{6\chi^2}{k^2}\,\curv\alpha^+ .$$

**The ratios.** At the pixel $\curv c_2 = \curv\alpha^+/r$ to leading order, $\curv c_1 = \curv c_1^{(2)}/r^2$ and $\curv
c_0 = \curv c_0^{(3)}/r^3$, which are the two ratios above; $\mathsf B$'s part of spin weight 2 changes them only at the
next order. The part $\curv{\mathcal W}_-$ carries $e^{-ikr}$, so $k$ becomes $-k$, and $\curv\alpha^- \propto
\sin^4(\vartheta/2)e^{-2i\varphi}$: the same steps give the brackets $4/\chi$ and $3/\chi$, and $1/\chi$ in place of
$\chi$.
:::

By [](#eq:departure) each part
departs from rank one by $|{-6} + 8|\,\chi^{\pm2}/(kr)^2$:

$$\boxed{\;\frac{s_2}{s_1}(\curv{\mathcal W}_\pm) = \frac{2\tan^{\pm2}(\iota/2)}{(kr)^2} .\;}$$

At one instant the reading is $\curv{\mathcal W}_+e^{-i\omega t} + \curv{\mathcal W}_-e^{i\omega t}$, and the same rule
applied to the sum gives

$$\frac{s_2}{s_1} = \frac{C(\iota, \theta)}{(kr)^2} + O\bigl((kr)^{-3}\bigr) ,$$

with the pure number $\sym{rank-constant}{C(\iota, \theta)}$ and the wave's phase $\sym{wave-phase}{\theta}$, zero when
its plus tide is largest:

$$\begin{gathered}
C = \frac{2\sin^2\!\iota\,\sqrt{A^2 + B^2}}{Z}, \qquad
B = 2\cos\iota\,\sin\theta\cos\theta,\\
A = (1 - 3\cos^2\!\iota)\cos^2\!\theta - 4\cos^2\!\iota\,\sin^2\!\theta,\\
Z = (1 + \cos^2\!\iota)^2\cos^2\!\theta + 4\cos^2\!\iota\,\sin^2\!\theta .
\end{gathered}$$

It follows from [](#eq:departure), with the two parts entering in proportion to $\cos^4(\iota/2)e^{-i\theta}$ and
$\sin^4(\iota/2)e^{i\theta}$ (the box).

::: derivation
### The rank constant of the turning pair

At one instant the two parts add. With $p$ and $q$ (local) their far-field amplitudes at that instant, in proportion to
$\cos^4(\iota/2)e^{-i\theta}$ and $\sin^4(\iota/2)e^{i\theta}$, the coefficients of the last box give

$$\curv c_2 = \frac{p + q}{r},\qquad \curv c_1 = -\frac{2\sqrt2\,i}{kr^2}\Bigl(\chi p + \frac{q}{\chi}\Bigr),\qquad
\curv c_0 = -\frac{3}{k^2r^3}\Bigl(\chi^2p + \frac{q}{\chi^2}\Bigr).$$

Then $(kr)^2[2\curv c_0/\curv c_2 - (\curv c_1/\curv c_2)^2] = N/(p + q)^2$, with

$$N = -6\Bigl(\chi^2p + \frac{q}{\chi^2}\Bigr)(p + q) + 8\Bigl(\chi p + \frac{q}{\chi}\Bigr)^2 = 2\chi^2p^2 +
\frac{2q^2}{\chi^2} + \Bigl(16 - 6\chi^2 - \frac{6}{\chi^2}\Bigr)pq .$$

Write $u = \cos^2(\iota/2)$ and $v = \sin^2(\iota/2)$ (local), so that $\chi^2 = v/u$, $p \propto u^2e^{-i\theta}$ and $q
\propto v^2e^{i\theta}$ with one common factor, which cancels. Then

$$N \propto uv\bigl[2u^2e^{-2i\theta} + 2v^2e^{2i\theta} + 16\,uv - 6(u^2 + v^2)\bigr].$$

With $u + v = 1$ and $u - v = \cos\iota$, we have $uv = \tfrac14\sin^2\iota$, $u^2 + v^2 = \tfrac12(1 + \cos^2\iota)$ and
$u^2 - v^2 = \cos\iota$, and the bracket is $(1 + \cos^2\iota)\cos2\theta + 1 - 7\cos^2\iota -
2i\cos\iota\sin2\theta$. Writing $\cos2\theta = \cos^2\theta - \sin^2\theta$ and $1 = \cos^2\theta + \sin^2\theta$, its
real part is $2A$ and its imaginary part $-2B$, so the bracket is $2(A - iB)$. In the same way $p + q \propto
\tfrac12(1 + \cos^2\iota)\cos\theta - i\cos\iota\sin\theta$, whose squared size is $Z/4$. So

$$\frac{s_2}{s_1}(kr)^2 = \frac{|N|}{|p + q|^2} = \frac{\tfrac14\sin^2\iota\cdot2\sqrt{A^2 + B^2}}{Z/4} = C .$$
:::

**Limits.** Seen edge-on, $\iota = 90°$, $A$ and $Z$ are both $\cos^2\theta$ and $B = 0$, so $C = 2$ at every phase
where the wave itself is not zero. At $\theta = 0$, $C$ is proportional to $|1 - 3\cos^2\iota|$ and vanishes at
$\cos^2\iota = \tfrac13$, $\iota = 54.7°$.

**A check.** At $\theta = 0$ the exact field gives $(kr)^2s_2/s_1 = 0.205$, 0.244 and 1.996 at $kr = 80$ for $\iota =
30°$, 60° and 90°, against $C = 0.204$, 0.240 and 2; at $kr = 200$ they agree to 0.3%.[^phases][^static]

## The two frequency parts tilt apart, and the angle between them ranges the source

A Fourier transform of the record over one cycle gives the two parts $\curv{\mathcal W}_\pm$ separately, the parts
that turn as $e^{\mp i\omega t}$.

**The distance without the inclination.** By the rotor formula, $s_1(\curv{\mathcal W}_-) =
\tan^4(\iota/2)\,s_1(\curv{\mathcal W}_+)$. Multiplying each departure by its own $s_1$ gives the same $s_2 =
2\tan^2(\iota/2)\,s_1(\curv{\mathcal W}_+)/(kr)^2$ for both parts, because $\cot^2(\iota/2)\tan^4(\iota/2) =
\tan^2(\iota/2)$. So $s_1(\curv{\mathcal W}_+)\,s_1(\curv{\mathcal W}_-) = (kr)^4s_2^2/4$, and

$$\boxed{\;kr = \Bigl[\frac{2\sqrt{s_1(\curv{\mathcal W}_+)\,s_1(\curv{\mathcal W}_-)}}{s_2}\Bigr]^{1/2} ,\;}$$

with no knowledge of $\iota$. The exact field gives 80.3 at $kr = 80$ and 200.1 at $kr = 200$, for $\iota = 30°$.

**The tilt.** By the rule $\hat k = \mathrm{Re}(i\,\vect m\times\vect m^*)/|\vect m|^2$ of section 9.1, the tilted
vector $\vect m + \zeta\hat k$ travels along

$$\hat k - \zeta\vect m^* - \zeta^*\vect m = \hat k - 2\,\mathrm{Re}(\zeta^*\vect m)$$

to first order, using $\hat k\times\vect m^* = i\vect m^*$ and $\vect m\times\hat k = i\vect m$. For the pair $\zeta$
is $-i$ times a positive number, so $\zeta^*\vect m$ has the real part $-|\zeta|\vect e_2/\sqrt2$. The direction
therefore turns by the angle $\sqrt2\,|\zeta|$ toward $\vect e_2$, the direction of growing azimuth about the pair's
axis. The two parts turn the same way, by $4\tan(\iota/2)/kr$ and $4\cot(\iota/2)/kr$. With $\cot x - \tan x =
2\cot2x$ their difference is

$$\boxed{\;\sym{helicity-split}{\Delta\theta_\pm} = \frac{4}{kr}\Bigl[\cot\frac\iota2 - \tan\frac\iota2\Bigr] =
\frac{8\,|\cot\iota|}{kr} ,\;}$$

an angle in radians between two directions (not a change of the phase $\theta$). At $\iota = 30°$, $kr\,\Delta\theta_\pm
= 13.86$; the exact field gives 13.7 at $kr = 80$ and 13.8 at $kr = 200$. Edge-on the two parts tilt alike, so
$\Delta\theta_\pm = 0$. Near face-on the weaker part fades as $\tan^4(\iota/2)$, and its noisy direction limits the
range.[^face]

**The reach.** Let $\rho$ be the signal-to-noise ratio of the whole reading over one cycle (defined
[below](#one-waves-direction-is-known-to-1ρ-a-factor-2-better-than-lights)). The two parts share it as $\rho_\pm$, with
$\rho_+^2 + \rho_-^2 = \rho^2$ and $\rho_-/\rho_+ = \tan^4(\iota/2)$. Each part's direction is known to about
$1/\rho_\pm$ radian, and the two independent errors add in quadrature, so the split is read to $(\rho_+^{-2} +
\rho_-^{-2})^{1/2}$. A way of ranging **ranges the source out to** the distance where its signal equals its own error.
The split, falling as $1/kr$, ranges out to $kr$ of order $\rho$. The departure $C/(kr)^2$ is read to about
$1/\rho$, since noise of size $\sigma_n$ on each number adds about $\sigma_n$ to $s_2$ while $s_1$ stays close to
$|\curv{\mathcal W}|$; it ranges out only to $kr \approx (C\rho)^{1/2}$.

**A number:** at $\rho = 10^3$, $\iota = 60°$ and 100 Hz, $\tan^4 30° = 1/9$ gives $\rho_+ = 0.994\rho$ and $\rho_- =
0.110\rho$. The split $8\cot60°/kr = 4.62/kr$ is read to $(1/0.994^2 + 1/0.110^2)^{1/2}/\rho = 9.1/\rho$, and it
ranges out to $kr = 4.62\rho/9.1 = 507$, or $2.4\times10^5\unit{km}$, about two-thirds of the way to the Moon. The departure,
with $C$ averaged over the cycle (0.80 at 60°), reaches only $kr \approx 28$.

{{paper fig:ranging}}

::: try {#ranging}
For a turning pair, the plot shows each way of ranging, the split and the rank (the departure from rank one), as its
signal over its own noise against $kr$; a dot marks where each line falls to the noise. Sliders set the distance,
$\rho$ and the inclination.

Predict first: if $\rho$ grows a hundredfold, how much farther does each way reach? Move the Signal-to-noise slider up
two decades and read the dots. Then lower the Inclination slider and watch the split's reach.
:::

## Across an array the curvature of the wavefront ranges a source to λr/ρD²

An array has a second way to range a source of waves: the wavefront is a sphere, not a plane. Take pixels spread evenly
along a line of width $D$, across the line of sight and centred on it, and a source at the distance $r \gg D$. The pixel
at the position $x$ along the line is farther from the source by $\sqrt{r^2 + x^2} - r \approx x^2/2r$, so the wave
reaches it late by the phase

$$\phi(x) = \frac{kx^2}{2r} ,$$

which at the edges, $x = \pm D/2$, is $\pi D^2/4\lambda r$, with $\lambda = 2\pi/k$ the wavelength. It is of order one at
the distance $D^2/\lambda$, the Fresnel distance of
[section 5.3](/tutorial/waves/diffraction/). Nearer than that the array sees the curvature at once.

Beyond it the range is still measured, more and more poorly. Let each pixel record the wave's complex amplitude with the
same signal and the same noise, so that $\rho$ is now the signal-to-noise ratio summed over the array, and let the
pixels be many. A change $\delta r$ changes each pixel's phase by $-(kx^2/2r^2)\,\delta r$, and the Fisher information
of a phase change is the signal-to-noise ratio squared times the phase change squared (section 3.3), so averaging over
the pixels, $F_r = \rho^2(k/2r^2)^2\langle x^4\rangle$. But the overall phase and the direction are unknown too, and
they change the phases by a constant and by a multiple of $x$. The second costs nothing, since $x$ is odd and $x^2$
even; the first removes from $x^2$ its mean, which is the part of the rates of change the two unknowns share (section
3.3). So

$$F_r = \rho^2\Bigl(\frac{k}{2r^2}\Bigr)^2\bigl(\langle x^4\rangle - \langle x^2\rangle^2\bigr) .$$

For pixels spread evenly, $\langle x^2\rangle = D^2/12$ and $\langle x^4\rangle = D^4/80$, so the bracket is $D^4/180$,
and $\sigma_r = F_r^{-1/2} = 2\sqrt{180}\,r^2/(k\rho D^2)$:

$$\boxed{\;\frac{\sigma_r}{r} = \frac{\sqrt{180}}{\pi}\,\frac{\lambda r}{\rho D^2} = 4.3\,\frac{\lambda r}{\rho D^2} .\;}$$

**Checks.** The units cancel, as a fraction must. As $D \to 0$ the error grows without bound: a point has no wavefront
to curve. Far away the fractional error grows in proportion to $r$, as the phase it rests on falls as $1/r$.

**A number.** A source at 100 Hz, with $\lambda = 3.0\times10^3$ km, seen at $\rho = 10^3$ by a line of pixels $D =
10^4$ km across, at the $2.4\times10^5$ km where one pixel's helicity split falls to its own error, is ranged to
$4.3\times3.0\times10^3\times2.4\times10^5/(10^3\times10^8) = 0.031$: three per cent.[^curve]

## The second Bianchi identity ties a metric wave's magnetic part to its tide

What does one reading say about a wave in other theories? In a **metric theory** of gravity, gravity is the curvature
of a spacetime metric and free bodies fall along its geodesics, as in Einstein's theory, but the field equation may
differ. Such theories allow up to six polarizations and other speeds [@EardleyLeeLightman1973].

We assume that **the wave is a weak plane wave of the metric**, every entry of the $\field h_{\mu\nu}$ of
[section 7.2](/tutorial/geometry/curvature-and-tides/) a constant times $e^{i(\vect k\cdot\vect x - \omega t)}$,
travelling along $\hat k = \vect k/|\vect k|$ at the phase speed $\sym{phase-speed}{v_p} = \omega/|\vect k|$ (the speed
of the crests, section 5.1), in $\mathrm{m\,s^{-1}}$, and we assume **no field equation**. The linearized curvature
carries the same factor, so on it $\partial_p$ becomes $ik_p$ and $\partial_0 = c^{-1}\partial_t$ becomes
$-i\omega/c$.

Section
[7.2](/tutorial/geometry/curvature-and-tides/#the-pixel-reads-six-of-the-twenty-numbers-and-the-magnetic-part-eight-more)
stated the **second Bianchi identity**, $\partial_\sigma\curv R_{\alpha\beta\gamma\delta} + \partial_\gamma\curv
R_{\alpha\beta\delta\sigma} + \partial_\delta\curv R_{\alpha\beta\sigma\gamma} = 0$. We take the first pair $j0$ and
the other three indices $0$, $p$, $q$:

$$\partial_0\curv R_{j0pq} + \partial_p\curv R_{j0q0} + \partial_q\curv R_{j00p} = 0 .$$

By the symmetries of section 7.2, $\curv R_{j0q0} = \curv R_{0j0q} = \curv\tE_{jq}/c^2$ and $\curv R_{j00p} =
-\curv\tE_{jp}/c^2$. Replacing the derivatives gives

$$\curv R_{j0pq} = \frac{k_p\curv\tE_{jq} - k_q\curv\tE_{jp}}{c\,\omega} .$$

The magnetic part is $\curv\tB_{ij} = \tfrac12c^2\epsilon_{ipq}\curv R_{pqj0}$ (section 7.2), and $\curv R_{pqj0} =
\curv R_{j0pq}$. The two terms give the same sum after $p$ and $q$ are exchanged in the second, so $\curv\tB_{ij} = (c/\omega)\,\epsilon_{ipq}k_p\curv\tE_{qj}$. With $\vect k = (\omega/v_p)\hat k$,

$$\boxed{\;\curv\tB_{ij} = \frac{c}{v_p}\,\epsilon_{ipq}\hat k_p\,\curv\tE_{qj} .\;}$$

**A limit.** At $v_p = c$ it is the
[cross product with $\hat k$ of section 7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45).

**The count.** In empty space Einstein's equation sets the trace of $\curv\tE$ and the antisymmetric part of $\curv\tB$
to zero, which leaves ten numbers. Another theory's field equation need not, so the curvature can show four more.
Then $\curv\tE$ may have a trace: six numbers. Its magnetic part has no trace, since $\epsilon_{ipq}\curv\tE_{qi} = 0$,
but may have an antisymmetric part: eight. With $\hat k$ along $z$, the six entries of $\curv\tE$ are the six
polarizations of a metric wave: Einstein's plus and cross, two **vector** polarizations $\curv\tE_{xz}$ and
$\curv\tE_{yz}$, the **breathing** polarization $\curv\tE_{xx} = \curv\tE_{yy}$, equal across the wave, and the
**longitudinal** polarization $\curv\tE_{zz}$, along it. These six, two angles and the speed are nine unknowns against
fourteen numbers, which leaves five checks that the reading is one wave.

## Summing cross products of the columns gives the wave's direction and speed

We write $\vect t_j$ and $\vect b_j$ for the $j$th columns of $\curv\tE$ and $\curv\tB$ at one instant, and
$\sym{wave-vector-p}{\mathbf p} = (c/v_p)\hat k$, a vector with no unit. Then the identity above says $\vect b_j =
\mathbf p\times\vect t_j$. The vector triple product gives $\vect t_j\times(\mathbf p\times\vect t_j) = \mathbf
p\,|\vect t_j|^2 - \vect t_j(\vect t_j\cdot\mathbf p)$. Summed over $j$, $\sum_j|\vect t_j|^2 = |\curv\tE|^2$ and
$\sum_j\vect t_j(\vect t_j\cdot\mathbf p) = \curv\tE^2\mathbf p$, since $\curv\tE$ is symmetric, so

$$\boxed{\;\bigl(|\curv\tE|^2 - \curv\tE^2\bigr)\,\mathbf p = \sum_j\vect t_j\times\vect b_j .\;}$$

**When it can be solved.** If $\curv\tE$ has the eigenvalues $\lambda_a$ (in $\mathrm{s^{-2}}$), the matrix on the left
has the eigenvalues $|\curv\tE|^2 - \lambda_a^2$, each the sum of the other two squares. It is invertible unless two
$\lambda_a$ vanish, so whenever $\curv\tE$ has rank two or more. A purely longitudinal wave, $\curv\tE \propto \hat
k\hat k^{\mathsf T}$, has rank one and $\curv\tB = \mathbf p\times\hat k\,\hat k^{\mathsf T} = 0$, so its speed cannot
be read at one point. With $\mathbf p$ found, the residual $\curv\tB - [\mathbf p]_\times\curv\tE$, with $[\mathbf
p]_\times$ the table of the cross product with $\mathbf p$, tests the five checks.

**A number.** A wave of Einstein's theory along $z$ with $\curv\tE_+ = 1$ (in any unit of tide) has $\curv\tE =
\mathrm{diag}(1, -1, 0)$ and $\curv\tB$ with 1 in the places 12 and 21. Then $\vect t_1\times\vect b_1 = \hat
x\times\hat y = \hat z$ and $\vect t_2\times\vect b_2 = (-\hat y)\times\hat x = \hat z$. The matrix is $2 -
\mathrm{diag}(1, 1, 0) = \mathrm{diag}(1, 1, 2)$, so $\mathbf p = \hat z$: the wave travels along $z$ at $v_p = c$.

## A massive graviton and a massive scalar differ in the sign of one ratio

Two waves that Einstein forbids have crests faster than light. The refractive index $\sym{refractive-index}{n} = c/v_p
= c|\vect k|/\omega$ of section 5.1 is here a property of the wave in empty space. A field with mass has $n < 1$: its
crests move faster than light, but its signals travel at the group speed $c^2/v_p$, below $c$.

**A massive scalar.** A scalar that acts on matter through the metric scales the metric equally in every direction,
so its wave is $\field h_{\mu\nu} = \phi\,\field\eta_{\mu\nu}$, with $\phi \propto \cos(|\vect k|z - \omega t)$ a small
pure number. The
[linearized curvature](/tutorial/geometry/curvature-and-tides/#to-first-order-the-curvature-is-made-of-second-derivatives-of-the-metric)
of section 7.2 with $\field h_{0j} = 0$, $\field h_{ij} = \phi\,\delta_{ij}$ and $\field h_{00} = -\phi$ gives

$$\curv\tE_{ij} = c^2\curv R_{0i0j} = \tfrac12c^2\bigl(\partial_i\partial_j\phi - \partial_0^2\phi\,\delta_{ij}\bigr) .$$

With $\partial_0^2\phi = -(\omega^2/c^2)\phi$ and $\partial_z^2\phi = -|\vect k|^2\phi$, the breathing entries are
$\curv\tE_{xx} = \curv\tE_{yy} = \tfrac12\omega^2\phi$ and the longitudinal one is $\curv\tE_{zz} = \tfrac12\omega^2(1 -
n^2)\phi$. Their ratio is $+(1 - n^2)$.

**A massive graviton.** Fierz and Pauli's massive graviton [@FierzPauli1939] has five polarizations. Its
**helicity-zero** wave, the one that does not turn about $\hat k$, must be trace-free and transverse to the wave vector,
which fixes its table (the box), and the same computation gives the ratio $-2(1 - n^2)$. At $n = 0.6$ the ratios are
$-1.28$ for the graviton and $0.64$ for the scalar: opposite signs, as at every speed, and both vanish as $v_p \to c$.
Einstein's wave has neither entry. At present bounds such a test needs signal-to-noise ratios far beyond any detector's.

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
Choose Einstein, then Massive, then Scalar. Then choose A second wave and read what the checks report.
:::

## One wave's direction is known to 1/ρ, a factor √2 better than light's

In Einstein's theory, with its ten numbers, we assume **independent Gaussian noise of standard deviation
$\sigma_n$ on each of the ten numbers**, the coefficients of $\curv\tE$ and $\curv\tB$ in the orthonormal basis of
section 1.5, in $\mathrm{s^{-2}}$. The signal-to-noise ratio of the whole reading is

$$\sym{reading-snr}{\rho} = \frac{|\curv{\mathcal W}|}{\sigma_n} ,$$

a pure number, with $|\curv{\mathcal W}|^2 = |\curv\tE|^2 + |\curv\tB|^2$. Its parts carry subscripts: $\rho_\pm$ for
the two frequency parts, and $\rho_E = |\curv\tE|/\sigma_n$ for the tide alone, which is $\rho/\sqrt2$ for a wave
because $|\curv\tB| = |\curv\tE|$.

The ten numbers are the real and imaginary parts of $\curv{\mathcal W}$'s five components, so the
[Fisher information](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)
of an unknown is the squared change of $\curv{\mathcal W}$ per unit change of the unknown, over $\sigma_n^2$. For
$\curv{\mathcal W} = \curv\alpha\,\vect m\vect m^{\mathsf T}$ with $\vect m$ of length one, turning $\hat k$ by a small
angle $\delta$ toward $\vect e_1$ sends $\vect e_1$ to $\vect e_1 - \delta\hat k$ and leaves $\vect e_2$ alone, so
$\vect m$ becomes $\vect m - \delta\hat k/\sqrt2$ and

$$\delta\curv{\mathcal W} = -\frac{\curv\alpha\,\delta}{\sqrt2}\,T_1 ,\qquad |\delta\curv{\mathcal W}|^2 =
|\curv\alpha|^2\delta^2 = |\curv{\mathcal W}|^2\delta^2 ,$$

because $\langle T_1|T_1\rangle = 2$. So $F = \rho^2$ per square radian. A turn toward $\vect e_2$ gives $i$ times the
same change, and a change of $\curv\alpha$ a multiple of $T_2$. These are orthogonal in the real inner product that
the Fisher information uses, $\mathrm{Re}\langle T_1|iT_1\rangle = 0$ and $\langle T_1|T_2\rangle = 0$, so the Fisher
matrix is diagonal, and the Cramér–Rao bound (section 3.3) gives

$$\boxed{\;\text{error of each angle of the direction} = \frac{1}{\rho}\ \text{rad} .\;}$$

At $\rho = 100$ the direction is known to 0.01 rad, or 0.57°.

**Light.** Light's wave is a multiple of $\vect m$ itself (section 9.1), not of its square, so the same turn changes it
by $\delta/\sqrt2$ of its size: half the pixel's squared change, since the square moves with both factors. A sensor
of light places a wave to $\sqrt2/\rho$.

## The shape of the tide tells a wave from a mass at half its size

How surely does one reading of $\curv\tE$ tell an isolated wave from an isolated mass? A wave's tide lies across
$\hat k$ with no trace (section 7.6), so its eigenvalues are $(-\lambda, 0, \lambda)$, in $\mathrm{s^{-2}}$; a mass's
are $w(-2, 1, 1)$ with $w = G\matter M/r^3 > 0$. We state that the nearest symmetric table with given eigenvalues
shares the reading's axes, with the eigenvalues in the same order (Hoffman and Wielandt, 1953). Distances are the lengths of section 1.5, so the squared distance between the two shapes is $(\lambda - 2w)^2 + w^2 + (w - \lambda)^2$.
**From a mass to the nearest wave**, it is smallest at $\lambda = \tfrac32w$, where it is $\tfrac32w^2$, a quarter of
$|\curv\tE|^2 = 6w^2$. **From a wave to the nearest mass**, it is smallest at $w = \lambda/2$, where it is
$\lambda^2/2$, a quarter of $2\lambda^2$. Both lie at half the reading's size.

So with the tide's own ratio $\rho_E$, the
[separation](/tutorial/noise/measuring-a-number/#choosing-between-two-scenes-comes-down-to-one-gaussian-number) of the
two scenes is $\rho_E/2$ noise standard deviations. Each shape's size and axes are fitted to the noisy reading, which lets noise reach the wrong shape more easily. A simulation of millions of
noisy readings at $\rho_E = 12$ takes a mass for a wave once in about 140 readings and a wave for a mass once in about
1350, each to within 2%: fewer than one reading in a hundred.

## A near field costs the wave's amplitude exactly √2, however strong it is

To read a wave beneath a nearby pull, take a wave at 100 Hz of strain $10^{-21}$, whose tide $\curv\tE_+ =
\tfrac12\omega^2\field h$ (section 7.6) is $2.0\times10^{-16}\unit{s^{-2}}$, and a rotor 3 m away: two 1 kg masses 12 cm
apart turning fifty times a second, like the rotors that calibrate LIGO by their pull [@Ross2021]. In the rotor's plane
the part of its tide that changes at 100 Hz, found from the two masses' Newtonian pulls, is $2.8\times10^{-14}\unit{s^{-2}}$
in size, 99 times the wave's $\sqrt2\,\curv\tE_+$.

We assume that **the near field's tide at the wave's frequency is unknown and may be anything**, five free numbers
$\mathbf N$, and that **its magnetic part is below the noise**. The wave has an unknown amplitude $a$, in
$\mathrm{s^{-2}}$, along a known pattern whose tide and magnetic part are the five-number columns $\mathbf u_E$ and
$\mathbf u_B$ (local letters), each of length one, since $|\curv\tB| = |\curv\tE|$ in a wave. The data are $a\,\mathbf
u_E + \mathbf N$ and $a\,\mathbf u_B$, plus noise, so the
[Fisher matrix](/tutorial/noise/measuring-a-number/#an-unknown-we-do-not-want-can-only-enlarge-the-error-of-one-we-do)
of $(a, \mathbf N)$ is

$$F = \frac{1}{\sigma_n^2}\begin{pmatrix}2 & \mathbf u_E^{\mathsf T}\\ \mathbf u_E & 1\end{pmatrix} ,$$

with 1 the $5\times5$ identity. The 2 counts the wave's signal in both halves of the reading. The inverse has
$(F^{-1})_{aa} = \sigma_n^2/(2 - |\mathbf u_E|^2) = \sigma_n^2$, against $\sigma_n^2/2$ with no near field, so

$$\boxed{\;\sigma_a\ \text{grows by exactly}\ \sqrt2 = 1.41 .\;}$$

Nothing in $F$ depends on $\mathbf N$, so the price is the same however strong the near field is: it takes the wave's
tide, and the wave is read from its magnetic part, which carries half its signal (Figure [](#fig:near-field-price)).
Every change of a wave changes $\curv\tE$ and $\curv\tB$ by equal amounts, so its direction pays the same $\sqrt2$.
**Without the magnetic part** the corner 2 becomes 1, $F$ is singular and the error infinite: the electric part alone
cannot find a wave beneath an unknown pull. With the near field free at every frequency, the Fisher matrix of a record
splits into such blocks, one per frequency, so the argument holds over time too.

**The near field pays too.** The same Fisher matrix gives the errors of $\mathbf N$. Let the wave have both
polarizations, with amplitudes $a_+$ and $a_\times$ along orthonormal five-number columns $\mathbf u_+$ and $\mathbf
u_\times$ of the tide, and let $U$ (local) be the $5\times2$ table with these columns, so that $U^{\mathsf T}U$ is the
$2\times2$ identity and $P = UU^{\mathsf T}$ is the projector onto the wave's plane of tides, with $P^2 = P$. As
before, the Fisher matrix of $(a_+, a_\times, \mathbf N)$ is

$$F = \frac{1}{\sigma_n^2}\begin{pmatrix}2 & U^{\mathsf T}\\ U & 1\end{pmatrix} ,$$

now in blocks of two and five rows. Multiplying out, using $U^{\mathsf T}U = 1$ and $PU = U$, shows that its inverse is

$$F^{-1} = \sigma_n^2\begin{pmatrix}1 & -U^{\mathsf T}\\ -U & 1 + P\end{pmatrix} .$$

The upper block is the wave's: $\sigma_n^2$ for each polarization, the $\sqrt2$ found above. The lower block is the near
field's, $\sigma_n^2(1 + P)$: a variance $2\sigma_n^2$ in the two components it shares with the wave and $\sigma_n^2$, as
with no wave, in the other three. So the near field pays the same $\sqrt2$ in the two components it shares with the
wave, and nothing in the other three. The off-diagonal block $-U$ says that the two errors are opposite: what the fit gives
the wave in those two components, it takes from the near field.[^app]

**The rotor.** Ignored, the rotor adds to the wave's estimate half the wave-shaped part of its tide, at most $99/2
\approx 50$ times the wave; it is 35 for a wave arriving $35^\circ$ from the rotor's axis on the side away from
it.[^geometry] In its plane the exact field of a turning quadrupole gives it a magnetic part $0.31\,kr =
2.0\times10^{-6}$ times its tide, with $kr = \omega r/c = 6.3\times10^{-6}$: at most $2\times10^{-4}$ of the wave. An array that reads only $\curv\tE$ must model the
rotor from how its tide varies across it, and the factor on the wave's error is then 2.2 for an array a metre across,
or 1.26 if it reads $\curv\tB$ as well (the next section).

![Look first at the bracket: an unknown near field uses up the five numbers of the tide, and the wave is read from the
other five, which hold half its signal, so its error grows by exactly $\sqrt2$. The lower row, without a near field,
reads the wave from all ten numbers. Schematic.](tut-near-field-price){#fig:near-field-price}

## An array that reads only the tide pays more, in proportion to r/b

Without the magnetic part, a camera must learn the near field's tide at the pixel from how that tide varies across the
array. We take the smallest array that can: a pixel with six neighbours at the distance $b$ along $\pm\hat x$, $\pm\hat
y$ and $\pm\hat z$, seven pixels reading $\curv\tE$ alone. We assume that **the near field comes from one compact source
at the distance $r$, a point quadrupole** of unknown moment and position, whose potential falls as $1/R^3$
([section 2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole))
and whose tide therefore falls as $1/R^5$, with $R$ the distance from it. At the wave's frequency the moment is a
complex symmetric trace-free table, ten real numbers; with the position and the wave's two complex amplitudes there are
seventeen unknowns, against the seventy real numbers of the seven readings. The wave's direction is known, as before.

**Why the price grows as $r/b$.** An estimate we can make by hand shows where the price comes from. The wave changes
across the array by only $2\pi b/\lambda$, about $10^{-6}$, so it is the same at all seven pixels, and the differences
between them hold the near field alone. The quadrupole's tide is homogeneous about the source at $\vect x_s$:
$\curv\tE(\vect x_s + \lambda\vect y) = \lambda^{-5}\curv\tE(\vect x_s + \vect y)$ for every $\lambda > 0$.
Differentiating with respect to $\lambda$ at $\lambda = 1$ gives **Euler's relation**,

$$(\vect x - \vect x_s)\cdot\nabla\curv\tE = -5\,\curv\tE .$$

At the pixel $\vect x - \vect x_s = r\hat n$, with $\hat n$ the unit vector from the source, so the near field's tide
there is $-(r/5)\,\hat n\cdot\nabla\curv\tE$. The differences across $2b$, $[\curv\tE(b\hat e_a) - \curv\tE(-b\hat
e_a)]/2b$, read each derivative $\partial_a\curv\tE$ with noise $\sigma_n/\sqrt2\,b$ on each of its five numbers, and
$\hat n\cdot\nabla\curv\tE = \sum_an_a\partial_a\curv\tE$ has the same noise, since $\sum_an_a^2 = 1$. With the position
known, the near field at the pixel is therefore known to $(r/5)\,\sigma_n/\sqrt2\,b$ on each number. The wave is the
mean of the seven readings, with noise $\sigma_n/\sqrt7$, less this estimate. The mean and the differences share no
noise, since each difference subtracts the two readings that the mean adds, and the near field's own mean over the
seven equals its value at the pixel to order $b^4$, because its second derivatives along the three axes add to zero in
empty space. So the wave's variance is $\sigma_n^2/7 + r^2\sigma_n^2/50b^2$, against $\sigma_n^2/7$ with no near field,
and the factor on its error, a pure number $\kappa$ (local), is

$$\boxed{\;\kappa = \Bigl(1 + \frac{7}{50}\,\frac{r^2}{b^2}\Bigr)^{1/2} \approx 0.37\,\frac{r}{b}\quad (b \ll r) .\;}$$

The near field's tide changes across the array by only about $5b/r$ of itself, and that small change is all the array
has to go on. The magnetic part instead reads the wave directly, at the fixed price $\sqrt2$. When $b$ is comparable
with $r$ the estimate fails, since the field then curves across the array.

**The full model.** The best estimate, the Cramér–Rao bound of all seventeen unknowns from the seventy numbers (section
3.3), uses every derivative and the curvature of the field across the array, and does better. With the position known
and the wave travelling along the line to the source, it gives $\kappa^2 = 1 + (7/150)(r/b)^2$, so that for $b \ll r$
the factor is $\sqrt3$ smaller than the estimate's. With the position fitted, $\kappa$ lies between about $0.2\,r/b$ and
$0.6\,r/b$ once $b \ll r$, depending on the directions of the wave and of the rotor's axis. For the rotor of the last
section, with $b = 0.5$ m (an array a metre across) and $r = 3$ m, $\kappa = 2.17$ from the tide alone, against the
estimate's 2.46, and $\kappa = 1.26$ when the seven pixels read $\curv\tB$ as well. From the tide alone the array
matches the magnetic part's $\sqrt2$ at $b = 0.29\,r$ and does better beyond. The computation is set out in
[Appendix A.1](/tutorial/appendices/numerical-methods/).

**What the wave costs the rotor.** In return the rotor's own errors grow, as the near field's did at one pixel. From the
tide alone, the error of its moment (the root mean square over its ten numbers) grows by 1.46 and that of its position
by 1.29; with $\curv\tB$ as well, which pins the wave, by only 1.07 and 1.04.

**The point model's own error.** The rotor is two masses, not a point. Two equal masses at $\pm d/2$ have no moments of
odd degree, so the next term after the quadrupole is of degree four. A term of degree $\ell$ in the potential falls as
$R^{-(\ell + 1)}$, so its tide carries $(\ell + 1)(\ell + 2)(d/2)^\ell/R^{\ell + 3}$ up to the angular factors, and the
degree-four tide is about $\tfrac{30}{12}(d/2R)^2 = 2.5\times(0.06/3)^2 = 1.0\times10^{-3}$ of the quadrupole's. With
the rotor 99 times the wave, that is at most about a tenth of the wave left unmodelled. Fitting the exact field of the
two masses with the point model and no noise, the fitted moment and position take up most of it, and a false wave of
0.005 of the true one remains. That equals the array's own error in the same direction only at $\rho \approx 270$, with
$\rho$ the signal-to-noise ratio of one pixel's whole reading of the wave, so below that the point model is enough.

**Ignored.** Fitting a wave alone to the seven readings, the array takes the rotor for a wave 70 times the true one,
twice the single pixel's 35. At one pixel the fit shares its misfit between $\curv\tE$, which the rotor fills, and
$\curv\tB$, which it leaves empty, and so takes half the rotor's wave-shaped tide; with no magnetic part it takes all of
it.

## Many pixels separate more sources and remove false fringes

An array of $N$ pixels ([section 5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array))
has a steering vector of $5N$ numbers at one frequency and helicity. A **subspace method** such as MUSIC (Schmidt
1986), which splits the averaged records into a part the sources fill and a part only the noise fills, separates up to
$5N - 1$ uncorrelated sources, against $N - 1$ for scalar sensors and $3N - 1$ for sensors of light.

**Why $5N - 1$.** Let $K$ uncorrelated sources arrive with the powers $P_a$, in $\mathrm{s^{-4}}$, and the steering
vectors $\vect s_a$, the $5N$ complex numbers that a unit wave from source $a$ puts into the array, and let the noise be
white, of variance $\sigma_n^2$ on each number. The averaged products of the records form the $5N\times5N$ matrix

$$R = \sum_{a=1}^{K}P_a\,\vect s_a\vect s_a^\dagger + \sigma_n^2\,1 ,$$

with $\dagger$ the conjugate transpose. Every vector orthogonal to all $K$ steering vectors is an eigenvector of $R$ with
the eigenvalue $\sigma_n^2$, the least an eigenvalue of $R$ can be. These vectors form the **noise subspace**, of
dimension $5N - K$ when the $K$ steering vectors are independent. A direction is a source exactly when its steering
vector is orthogonal to the whole noise subspace, so the method finds the sources as the zeros of the steering vector's
projection on it. That needs a noise subspace, $5N - K \ge 1$, and steering vectors of distinct directions that are
independent, which holds for generic directions, as for one pixel's five in section 9.5. So $K \le 5N - 1$. A scalar
sensor gives one number per steering vector and a sensor of light three per helicity, hence $N - 1$ and $3N - 1$. When
the sources' circular fractions differ, the two helicities' matrices together separate $5N$, by the diagonalization of
section 9.5.

**False fringes.** Two sensors a distance $D$ apart respond equally in a set of directions, their **fringes**,
$\vartheta_1 = c/(fD)$ apart at broadside (across their baseline), with $f$ the frequency and $c/f$ the wavelength. Two
pixels compare whole tables, so by section 9.1 a direction $\vartheta$ away is weighted by $\cos^8(\vartheta/2)$. A
**minimum-variance (Capon) estimator** (Capon 1969), which passes one direction whole and lets through the least power
from all others, then lifts the true fringe above the next false one by $1 + \rho^2[1 - \cos^8(\vartheta_1/2)]$.

**Capon's factor.** The estimator weights the records by a vector $\vect w$ with $\vect w^\dagger\vect s = 1$ for the
steering vector $\vect s$ of the direction it looks in, and makes the output power $\vect w^\dagger R\,\vect w$ least.
By the Cauchy–Schwarz inequality, $1 = |\vect w^\dagger\vect s|^2 = |(R^{1/2}\vect w)^\dagger(R^{-1/2}\vect s)|^2 \le
(\vect w^\dagger R\,\vect w)(\vect s^\dagger R^{-1}\vect s)$, with equality for $\vect w \propto R^{-1}\vect s$, so the
power it reports is $P(\vect s) = 1/(\vect s^\dagger R^{-1}\vect s)$. For one source of steering vector $\vect s_0$ and
power $P_0$, $R = \sigma_n^2\,1 + P_0\vect s_0\vect s_0^\dagger$, and multiplying by $R$ confirms that

$$R^{-1} = \frac{1}{\sigma_n^2}\Bigl(1 - \frac{P_0\,\vect s_0\vect s_0^\dagger}{\sigma_n^2 + P_0|\vect s_0|^2}\Bigr) .$$

Let every steering vector have the length of $\vect s_0$, let $\gamma = |\vect s^\dagger\vect s_0|^2/|\vect s_0|^4$
(local) be the overlap of the two directions, and let $\rho^2 = P_0|\vect s_0|^2/\sigma_n^2$ be the source's
signal-to-noise ratio over the array. Then $\vect s^\dagger R^{-1}\vect s = (|\vect s_0|^2/\sigma_n^2)[1 -
\rho^2\gamma/(1 + \rho^2)]$, and

$$P(\vect s) = \frac{\sigma_n^2}{|\vect s_0|^2}\,\frac{1 + \rho^2}{1 + \rho^2(1 - \gamma)} .$$

At the source $\gamma = 1$. At a false fringe the delays between the two pixels match the source's, so only the tables
differ, and $\gamma = \cos^8(\vartheta_1/2)$. The ratio of the two powers is $1 + \rho^2(1 - \gamma)$, the factor
stated. With
$D$ a hundred wavelengths, $1 - \cos^8(0.005) = 1.0\times10^{-4}$, so the factor is 2 at $\rho = 100$: false fringes
fade once $\rho$ exceeds about a hundred. At 55° from broadside the nearer false fringe, $1.72\,c/(fD)$ away, stands
higher than the far one at $1.77\,c/(fD)$. For scalar sensors the overlap is 1 and the factor stays 1.

{{paper fig:two-pixels}}

**The idea to keep: a nearby source spoils a wave's square only at second order, but its two helicities tilt apart by
$8|\cot\iota|/kr$, which ranges it out to $kr$ of order $\rho$. The second Bianchi identity fixes a metric wave's
magnetic part by its tide and speed, so one reading tests Einstein's theory. Noise places one wave to $1/\rho$, and a
near field of any strength costs only $\sqrt2$, because the magnetic part repeats the wave.**

::: problems
### Practice

**[9.7]** At $kr = 200$ and $\iota = 30°$, how far apart are the directions read from the two frequency parts?

::: solution
$8\cot30°/200 = 0.069$ rad, about 4.0°.
:::

**[9.7]** A wave of Einstein's theory travels along $z$ with $\curv\tE_+ = 0$ and $\curv\tE_\times = 1$. Write
$\curv\tE$ and $\curv\tB$, and find $\mathbf p$.

::: solution
$\curv\tE$ has 1 in the places 12 and 21. By $\curv\tB_{ij} = \epsilon_{i3q}\curv\tE_{qj}$, $\curv\tB =
\mathrm{diag}(-1, 1, 0)$. The columns give $\vect t_1\times\vect b_1 = \hat y\times(-\hat x) = \hat z$ and $\vect
t_2\times\vect b_2 = \hat x\times\hat y = \hat z$. With $|\curv\tE|^2 = 2$ and $\curv\tE^2 = \mathrm{diag}(1, 1, 0)$ the
matrix is $\mathrm{diag}(1, 1, 2)$, so $\mathbf p = \hat z$ and $v_p = c$.
:::

**[9.7]** By the estimate from Euler's relation, at what $b/r$ does the factor on the wave's error fall to the
magnetic part's $\sqrt2$? Why does the full model reach it at a smaller $b/r$?

::: solution
$1 + (7/50)(r/b)^2 = 2$ gives $b/r = (7/50)^{1/2} = 0.37$. The full model reads the near field better than the estimate
at every $b$, so its factor is smaller and falls to $\sqrt2$ sooner, at $b = 0.29\,r$.
:::

**[9.7]** How many uncorrelated sources can two pixels separate by a subspace method at one frequency and helicity, and
how many can two microphones?

::: solution
Two pixels have steering vectors of $5\times2 = 10$ numbers, so $10 - 1 = 9$, or 10 if the circular fractions differ.
Two microphones have $2$ numbers and separate $2 - 1 = 1$.
:::

### Stretch

**[9.7]** For pixels spread evenly over a square of side $D$, the phase is $k(x^2 + y^2)/2r$. Show that the fractional
range error is $(\sqrt{90}/\pi)\,\lambda r/(\rho D^2) = 3.0\,\lambda r/(\rho D^2)$.

::: solution
With $x$ and $y$ independent and each spread evenly, $\langle x^2 + y^2\rangle = D^2/6$ and $\langle(x^2 + y^2)^2\rangle =
2D^4/80 + 2(D^2/12)^2$, so the variance of $x^2 + y^2$ is $2(D^4/80 - D^4/144) = D^4/90$, twice the line's. Then
$\sigma_r = 2\sqrt{90}\,r^2/(k\rho D^2)$ and $\sigma_r/r = (\sqrt{90}/\pi)\lambda r/(\rho D^2)$.
:::

**[9.7]** Repeat the steps of the box on the coefficients for $\curv{\mathcal W}_-$, with $e^{-ikr}$ and
$\curv\alpha^-\propto\sin^4(\vartheta/2)e^{-2i\varphi}$, and show that the two brackets are $4/\chi$ and $3/\chi$.

::: solution
Now $\partial_\vartheta\curv\alpha^- = (2/\chi)\curv\alpha^-$ and $i\csc\vartheta\,\partial_\varphi\curv\alpha^- =
+2\curv\alpha^-/\sin\vartheta$, and $2/\sin\vartheta + 2\cot\vartheta = 2/\chi$, so the first bracket is $4/\chi$. With
$k \to -k$, $\curv c_1^{(2)} = -2\sqrt2\,i\,\curv\alpha^-/(\chi k)$, proportional to $\cos(\vartheta/2)
\sin^3(\vartheta/2)e^{-2i\varphi}$. For that $f$, $\partial_\vartheta f/f = 3/2\chi - \chi/2$, $i\csc\vartheta\,
\partial_\varphi$ gives $(1 + \chi^2)/\chi$ and $\cot\vartheta = (1 - \chi^2)/2\chi$, which add to $3/\chi$. Then $2\curv
c_0^{(3)} = -(i/k)(3/\sqrt2\chi)\curv c_1^{(2)} = -6\curv\alpha^-/(\chi^2k^2)$, so $\curv c_0/\curv c_2 =
-3/(\chi^2(kr)^2)$.
:::

**[9.7]** At $\iota = 60°$ and $kr = 200$, find the departures of the two parts, check that their $s_2$ agree, and
recover $kr$ from the inclination-free formula.

::: solution
The departures are $2\tan^2(30°)/200^2 = 1.67\times10^{-5}$ and $2\cot^2(30°)/200^2 = 1.50\times10^{-4}$. Since
$s_1(\curv{\mathcal W}_-) = s_1(\curv{\mathcal W}_+)/9$, both give $s_2 = 1.67\times10^{-5}\,s_1(\curv{\mathcal W}_+)$,
and the formula gives $[(2/3)/(1.67\times10^{-5})]^{1/2} = 200$.
:::

### The camera

**[9.7]** A massive scalar wave along $z$ has $\curv\tE = \curv\tE_{xx}\,\mathrm{diag}(1, 1, 1 - n^2)$, with
$\curv\tE_{xx} = \tfrac12\omega^2\phi$. Find $\curv\tB$, show that it is antisymmetric, and check that the sum of cross
products returns $\mathbf p = n\hat z$.

::: solution
$\curv\tB_{ij} = n\,\epsilon_{i3q}\curv\tE_{qj}$ gives only $\curv\tB_{12} = -n\curv\tE_{xx}$ and $\curv\tB_{21} =
n\curv\tE_{xx}$: antisymmetric, which no wave of Einstein's theory can be. Then $\vect t_1\times\vect b_1 = \vect
t_2\times\vect b_2 = n\curv\tE_{xx}^2\hat z$ and $\vect b_3 = 0$. The matrix has the $zz$ entry $2\curv\tE_{xx}^2$, so
$p_z = 2n\curv\tE_{xx}^2/(2\curv\tE_{xx}^2) = n$, and $p_x = p_y = 0$.
:::
:::

::: paper
- Section VIII's [*Ranging a wave source*](/paper/#par:ranging-a-wave-source): the rank constant, the helicity split
  and Figure [](/paper/#fig:ranging).
- [*Tests of general relativity from one reading*](/paper/#par:tests-of-general-relativity-from-one-reading): the
  Bianchi identity, the wave vector and Figure [](/paper/#fig:beyond).
- [*Precision*](/paper/#par:precision), [*Separation with noise*](/paper/#par:separation-with-noise) and Table
  [](/paper/#tab:one-pixel): $1/\rho$ and $\sqrt2$.
- [*One pixel and many*](/paper/#par:one-pixel-and-many) and Figure [](/paper/#fig:two-pixels): arrays and fringes.
:::

::: deeper
- The GR course derives the [Bianchi identities](https://neovand.github.io/general-relativity/chapter-9.html#9-4-bianchi-identities-why-the-curvature-components-cannot-vary-independently)
  and shows [why Einstein's theory keeps two of the six polarizations](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten).
- C. M. Will, *Theory and Experiment in Gravitational Physics* (2nd ed., Cambridge, 2018), chapter 11: the polarizations
  and speeds of waves in other theories.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII: ranging, with the rank constant
    [](/paper/#eq:ranging-C), the split [](/paper/#eq:helicity-split) and Figure [](/paper/#fig:ranging); the tests of
    other theories, with [](/paper/#eq:bianchi-wave), [](/paper/#eq:wave-vector) and Figure [](/paper/#fig:beyond); the
    precision and the near-field price; and the arrays, with Figure [](/paper/#fig:two-pixels).

[^app]: First shown in *The gravitational camera* (Mohsenvand 2026), [App. A](/paper/#app:benchmarks): the near
    field's price in its two shared components, the array's factor and what the wave costs the rotor.

[^curve]: For a square array of side $D$ the coefficient is $\sqrt{90}/\pi = 3.0$ (the exercises).

[^exact]: The exact linearized field of a turning point quadrupole matches these within 1.3% at $kr = 80$ and 0.5% at
    $kr = 200$.

[^phases]: This is for the phase $\theta = 0$. Over the whole cycle the next order reaches 10% at $kr = 80$ and 4% at
    $kr = 200$ ($\iota$ from 15° to 60°).

[^static]: The pair's mass also makes a steady tide, of order $(c/v)^2$ times the departure, with $v$ the masses'
    speed. The oscillating part is read from the rate of change of $\curv{\mathcal W}$, which holds none of it.

[^face]: Both $\tan^2(\iota/2)$ and $\cot^2(\iota/2)$ must exceed $1/kr$.

[^geometry]: A pixel in the rotor's plane at 30° from $x$, with the wave from $(-0.45, -0.35, 0.82)$, 34.8° from the
    rotor's axis, gives 35.5.
