---
id: '13.7'
title: 'The hole as a thermometer; sums that belong to no body'
question: 'What does a thermometer made of gravity read beside a black hole, and why can no body of ordinary matter, of any shape, answer tides as a hole does?'
part: '13'
requires: ['2.2', '3.9', '4.5', '4.6', '11.1', '11.3', '11.4']
paper: [sec:hole, eq:hole-thermometer, eq:hole-noise, eq:hole-sum-rule, fig:hole-response, tab:hair, sec:near-field, eq:sum-rule, eq:thermal-multipole, eq:thermometer, sec:holography]
figures: [fig:hole-response]
live: [hole-response]
depth: A
---

A camera beside a black hole can read its temperature from the pull of its field, without absorbing any quantum of the
radiation it emits. And when the same hole absorbs a changing tide, it answers as the inertia of no distribution of
positive mass: one tide lets it be drawn as a shell, and three allow no drawing. What does the thermometer read, and
why can no body of ordinary matter, of any shape, answer tides as a hole does?[^first]

::: plain
A thermometer can be made from gravity alone. Push a body gently with a changing tide and measure the energy it
absorbs, then watch how much its shape trembles on its own. The trembling divided by the absorption is the body's
temperature. A black hole has Hawking's temperature, a quantum glow of its horizon, and it is fixed by the mass, so
the camera learns nothing new.

Added up over every rate of change, a round body's absorption says how far out its mass lies. The hole's total is
that of a thin shell a little outside its horizon, and finer tides give shells farther out. Each total alone fits some
body, but the totals of the three broadest tides would need negative mass.
:::

## Beside a hole, a camera can read its temperature without catching a graviton

Section [11.4](/tutorial/black-holes/under-tides/#the-friction-trembles-at-the-holes-temperature) built section 4.6's
**thermometer** for a black hole of mass $\sym{mass}{\matter M}$ and Schwarzschild radius
$\sym{schwarzschild-radius}{r_s} = 2G\matter M/c^2$. The reading is the hole's quadrupole
$\sym{hole-quadrupole}{\matter Q}_{ij}$, in $\mathrm{kg\,m^2}$, whose energy in a tide
$\sym{tidal-tensor}{\curv\tE}_{ij}$ is $\matter Q_{ij}\curv\tE_{ij}$.[^norm] The push is $-\curv\tE_{ij}$. A slow tide
of angular frequency $\omega$ meets the **horizon friction** $\sym{horizon-friction}{\nu} = \matter Mr_s^5/90c^3$, in
$\mathrm{J\,s^5}$, so that 4.5's response $\sym{response-function}{\chi}$ has $\mathrm{Im}\,\chi = \nu\omega$.[^chi] At
the Hawking temperature $\sym{hawking-temperature}{T_H}$, with $\kB T_H = \hbar c^3/8\pi G\matter M$, the quadrupole
trembles with the flat spectrum $\sym{quadrupole-noise}{S_Q} = 2\kB T_H\nu = \hbar r_s^5/360\pi G$. The thermometer's
quotient, in which $\omega$ cancels,

$$T = \frac{\omega S_Q}{2\kB\,\mathrm{Im}\,\chi} = \frac{S_Q}{2\kB\nu} ,$$

is valid where $x = G\matter M\omega/c^3$, a pure number,[^x] is far below $1/8\pi$ (11.4), and gives

$$T = \frac{S_Q}{2\kB\,\nu} = \frac{\hbar c^3}{8\pi G\matter M\kB} ,\label{eq:hole-thermometer}$$

the Hawking temperature.[^ht] The noise was fixed by matching to radiation at that temperature, so this confirms only that the friction, found from
the growth of the horizon, and the absorption, found from the scattering of waves, are the same number.

**How much the shape trembles** (an estimate of order of magnitude). Over the band up to $\omega \approx c/r_s$, where waves become as short as the hole. One entry, $\matter Q_{zz}$, takes the
share $\Pi_{zzzz} = \tfrac23$ of the noise (1.5's projector), and the spectrum is two-sided, so

$$\langle\matter Q_{zz}^2\rangle \approx \frac23\int_{-c/r_s}^{c/r_s}S_Q\,\frac{\dd\omega}{2\pi} = \frac{2S_Qc}{3\pi r_s} .$$

Dividing by $(\matter Mr_s^2)^2$ leaves $(2/1080\pi^2)(m_P/\matter M)^2$, so

$$\boxed{\;\frac{\sqrt{\langle\matter Q_{zz}^2\rangle}}{\matter Mr_s^2} \propto \frac{m_P}{\matter M}\;} ,$$

with $\sym{planck-mass}{m_P} = \sqrt{\hbar c/G} = 2.18\times10^{-8}$ kg the **Planck mass** (section 11.3), since $\hbar
c/G$ is in $\mathrm{J\,s\,m\,s^{-1}}/\mathrm{m^3\,kg^{-1}\,s^{-2}} = \mathrm{kg^2}$. The flat band gives the factor
$\sqrt{2/1080\pi^2} = 0.014$, but at its edge $\hbar\omega/\kB T_H = 8\pi x \approx 13$ and the classical theorem
fails. With 8.7's quantum theorem and the exact greybody factor, the thermal part gives 0.008, and the zero-point part,
which a body keeps even when cold, gives 0.25 and dominates. **Number:** a hole as warm as the graviton sky, 0.905 K, has $\matter M = 1.356\times10^{23}$ kg and $r_s = 0.20$ mm, so its shape trembles by about
$2\times10^{-16}\unit{kg\,m^2}$ in the time light takes to travel $r_s$, 0.67 ps. Section 11.4's one-second average is
ten million times smaller, because averaging over a time $t$ keeps only frequencies below about $1/t$, where the
thermal part shrinks as $1/\sqrt t$ and the zero-point part is nearly absent. **Meaning:** the tremor's square is of order
$\hbar$, and only a hole near the Planck mass would tremble by a fair part of its size.

**What it carries.** The mass fixes $T_H$, so the tremor carries the mass again, where a stone's carries its whole
interior (4.6).[^hair] A spectrum compares readings at two times (13.2), so a hole gives seven numbers at one time
(chapter
[11.2](/tutorial/black-holes/spin/#a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in)) and a temperature
at two.

## A hole's response has the weight of a shell a little outside its horizon

Chapter
[4.5](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums) showed that for any
body $\tfrac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi\,\dd\omega$ is the constant $A$ of its answer $\chi \to
-A/\omega^2$ to a push too fast for its bonds. For the quadrupole and a round body of density
$\sym{density}{\matter\rho}$, with $r$ the distance from its centre, it is $\tfrac13\int\matter\rho\,r^2\,\dd V$
([4.5](/tutorial/response/causality/#a-blow-holds-every-frequency-and-the-energy-it-leaves-is-the-same-total)). This sum is the inertia that the tide moves, the body's **tidal inertia**, because driven that fast
[every body answers as dust](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust).
A hole has no dust, so we compute its sum from what it absorbs, and then ask which body would have it.

We assume that **the hole does not turn** and that **at every frequency its quadrupole's friction
is fixed by the greybody factor**, as section 11.4 defined it: $\mathrm{Im}\,\chi = 5c^5\Gamma_2/16G\omega^5$, with
$\sym{greybody-factor}{\Gamma_2}(\omega)$ the share of a quadrupole wave that the hole absorbs. This defines the
response by absorption [@GoldbergerRothstein2006; @GoldbergerRothstein2020]. Most of the sum comes from waves as
short as the hole, which leave no near zone in which to read a response, so for them this is a convention.
Then

$$\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi\,\dd\omega = \frac{5c^5}{8\pi G}\int_0^\infty\frac{\Gamma_2}{\omega^4}\,\dd\omega .$$

We change the variable to $x$, with $\omega^{-4}\dd\omega = (G\matter M/c^3)^3x^{-4}\dd x$:

$$\frac{5c^5}{8\pi G}\Bigl(\frac{G\matter M}{c^3}\Bigr)^3\int_0^\infty\frac{\Gamma_2}{x^4}\,\dd x = \frac{5}{8\pi}\,\matter M\Bigl(\frac{G\matter M}{c^2}\Bigr)^2\int_0^\infty\frac{\Gamma_2}{x^4}\,\dd x .$$

With $G\matter M/c^2 = r_s/2$ the factor in front is $(5/32\pi)\matter Mr_s^2$:

$$\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi\,\dd\omega = \frac{5}{32\pi}\,\matter Mr_s^2\int_0^\infty\frac{\Gamma_2}{x^4}\,\dd x = 0.345\,\matter Mr_s^2 ,\label{eq:hole-sum-rule}$$

where the number is found below.[^sr] **Units:** $\Gamma_2$ and $x$ are pure numbers, so the sum is in $\mathrm{kg\,m^2}$, as $\tfrac13\int\matter\rho\,r^2\,
\dd V$ is.

For long waves Page's limit $\Gamma_2 \approx \tfrac{256}{225}x^6$ (11.4) makes the integrand
$\tfrac{256}{225}x^2$, which vanishes at $x = 0$. Above $x \approx 0.5$ the hole swallows nearly every quadrupole wave,
$\Gamma_2 \approx 1$, and the integrand falls as $x^{-4}$. Swallowing short waves thus stops the endless growth that
the friction law alone would give. Only 0.3% of the sum lies below $x = 0.2$, and
three quarters between 0.3 and 0.6 (Figure [](#fig:sum-cutoff)).

![Look first at the shaded band: three quarters of the hole's sum comes from frequencies where it begins to swallow
waves. Below, the integrand follows Page's $x^2$, the friction law; above, it falls as $x^{-4}$, because every short
wave is swallowed. Curves exact.](tut-sum-cutoff){#fig:sum-cutoff}

**The number** (numerical). The input is 11.3's Regge–Wheeler equation for degree two, solved for a wave of
unit amplitude purely ingoing at the horizon. Far away it is an outgoing wave and an incoming one of amplitude
$C_{\rm in}$ (11.3's $A_{\rm in}$), and $\Gamma_2 = 1/|C_{\rm in}|^2$. We measure lengths in
$G\matter M/c^2$ and times in $G\matter M/c^3$, so that $r_s = 2$ and the angular frequency is $x$ itself. The
equation is then $\dd^2\psi/\dd r_*^2 + [x^2 - V_2(r)]\psi = 0$, with the barrier $V_2 = (1 - 2/r)(6/r^2 - 6/r^3)$
and $r_* = r + 2\ln(r/2 - 1)$. We start at $r = 2 + 10^{-6}$, where $\psi = e^{-ixr_*}$ and $\dd\psi/\dd r_* =
-ix\psi$, and integrate outward in $r$, with $\dd/\dd r_* = (1 - 2/r)\,\dd/\dd r$, to $r = 600/x$, about a hundred
wavelengths. There $V_2$ is less than $2\times10^{-5}$ of $x^2$, and the value and slope of $\psi$ split it into
the two travelling waves: with $k = \sqrt{x^2 - V_2}$, the incoming one has $|C_{\rm in}|^2 =
(k/4x)\,|\psi + i\,(\dd\psi/\dd r_*)/k|^2$. We repeat this at a few hundred frequencies spaced evenly in $\ln x$,
from 0.01 to about 3, and add up $\Gamma_2x^{-4}$ by Simpson's rule in $\ln x$. Below the grid Page's law
$\Gamma_2 \propto x^6$ stands in; above it $\Gamma_2$ differs from 1 by less than $10^{-9}$, and the tail adds
$\int_3^\infty x^{-4}\,\dd x = 1/81$. Its integral is $\int_0^\infty\Gamma_2x^{-4}\,
\dd x = 6.938$,[^solver] and [](#eq:hole-sum-rule) gives
$0.345\,\matter Mr_s^2$.

**Checks the reader can make.** For long waves the solution meets Page's limit: at $x = 0.01$, $\Gamma_2$ is 1.070
times $\tfrac{256}{225}x^6$, and the excess vanishes as $x \to 0$ (11.4). For short waves the shares of all degrees
fill the hole's shadow: the absorption cross-section of 11.3, $(\pi c^2/\omega^2)\sum_\ell(2\ell + 1)\Gamma_\ell$, is
0.990 times $27\pi G^2\matter M^2/c^4$ at $x = 2$ and 1.003 times at $x = 4$. The integral itself can be estimated by
hand. The barrier $V_2$ is highest at $r = 3.281$, or $1.640\,r_s$, where it is $0.1513$, so waves with $x$ above
$x_{\rm top} = \sqrt{0.1513} = 0.389$ pass over it. Taking $\Gamma_2$ as a step there gives
$\int_{0.389}^\infty x^{-4}\,\dd x = 1/(3\times0.389^3) = 5.66$, 18% below 6.938, because waves somewhat below the
top still tunnel through, and the weight $x^{-4}$ favours them.




The integrand $(5/32\pi)\Gamma_2/x^4$ peaks at $x = 0.40$ (panel (a) of Figure [](/paper/#fig:hole-response)).
The peak lies a little above the top of the barrier, where $\Gamma_2 = 0.71$. There $\dd\ln\Gamma_2/\dd\ln x = 4$:
below it $\Gamma_2$ climbs faster than $x^4$, and above it $\Gamma_2$ levels off at 1 while $x^{-4}$ keeps falling.

A thin shell of mass $\matter M$ and radius $R$ has the sum $\tfrac13\matter MR^2$, so it has the hole's sum when

$$\boxed{\;R = \sqrt{3\times0.345}\;r_s = 1.02\,r_s\;} ,$$

or $1.0175\,r_s$ to four places. To a changing quadrupolar tide a hole that does not turn has the inertia of a shell of
its own mass <!-- lint-allow: just --> just outside its horizon. **Check:** a uniform ball of radius $r_s$ has $\tfrac13\times\tfrac35\matter Mr_s^2 = 0.200\,\matter Mr_s^2$, and a thin shell at $r_s$ has
$0.333\,\matter Mr_s^2$, the two lines of panel (b); the hole's sum is 3.5% above the shell's.

Figure [](/paper/#fig:hole-response) shows this in four panels. Panel (a) is the hole's absorption at each rate of
change, panel (b) its running total, which ends a little above a thin shell's and well above a uniform ball's,
panel (c) the radii that finer tides give, from 1.02 to 1.73 times the horizon's, rising toward 1.91, and panel (d)
the test of positive mass that those radii fail, worked out below. The steel ball of section 4.5 has the sum $0.13\unit{kg\,m^2}$, three fifths of a shell's.

{{paper fig:hole-response}}

## Every degree of tide gives its own shell, and finer tides give shells farther out

**The body** (depth A). We want the sum for a tide of any degree $\ell$, shaped as section 2.2's solid harmonic $h_m =
r^\ell Y_{\ell m}$, with 4.5's sum $\int\matter\rho\,|\nabla h_m|^2\,\dd V$.  Section 2.1's rule $\nabla h\cdot\nabla g = \tfrac12\nabla^2(hg)$ for
harmonic $h$ and $g$, with $g = h_m^*$, gives $|\nabla h_m|^2 = \tfrac12\nabla^2|h_m|^2$. Summed over the $2\ell + 1$
orders $m$, chapter
[2.2](/tutorial/outside/spherical-harmonics/#the-addition-theorem-turns-a-sum-over-m-into-one-legendre-polynomial)'s
addition theorem gives $\sum_m|h_m|^2 = (2\ell + 1)\,r^{2\ell}/4\pi$, and $\nabla^2r^{2\ell} = 2\ell(2\ell + 1)\,
r^{2\ell-2}$. So, for a body of any shape,

$$\sum_m|\nabla h_m|^2 = \frac12\,\frac{2\ell + 1}{4\pi}\,2\ell(2\ell + 1)\,r^{2\ell-2} = \frac{\ell(2\ell + 1)^2}{4\pi}\,r^{2\ell-2} .$$

We now assume that **the body is round**, so that every order gives the same sum.[^shape] Dividing by $2\ell + 1$,
each tide of degree $\ell$ gives

$$\boxed{\;\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi_\ell\,\dd\omega = \frac{\ell(2\ell + 1)}{4\pi}\int\matter\rho\,r^{2\ell-2}\,\dd V\;} .$$

**Checks.** The sum over $m$ is the factor of the multipole form of 4.5's sum rule.[^mult] At $\ell = 1$ each tide
gives $(3/4\pi)\matter M$: a uniform pull moves the whole mass. **Meaning:** each degree reads one even moment of the
radius, and the sequence fixes a round density (3.9).

The **shell radius** $\sym{shell-radius}{R_\ell}$ is the radius of the thin shell of the body's mass with the same sum
of degree $\ell$: $\int\matter\rho\,r^{2\ell-2}\,\dd V = \matter MR_\ell^{2\ell-2}$. Body and shell are weighed with the
same $h_m$, so its normalization cancels, and $R_2$ is the last section's $R$.

**The hole** (depth A). Section 11.4 had $\mathrm{Im}\,\chi$ only for degree two. Near the hole, a changing tide is a
standing wave, equal parts of a wave coming in and one going out. The box below counts energy: the hole takes the
share $\Gamma_\ell$ of the incoming half, whose power Thorne's formula gives. Putting the resulting
$\mathrm{Im}\,\chi_\ell$ into the sum and equating it with a shell's gives

$$\boxed{\;\Bigl(\frac{R_\ell c^2}{G\matter M}\Bigr)^{2\ell-2} = \frac{[(2\ell + 1)!!]^2\,(\ell - 1)}{2\pi(2\ell + 1)(\ell + 1)(\ell + 2)}\int_0^\infty\frac{\Gamma_\ell}{x^{2\ell}}\,\dd x\;} ,$$

where $(2\ell + 1)!! = 1\times3\times5\times\cdots\times(2\ell + 1)$. **Check:** at $\ell = 2$ the factor is
$225/120\pi = 15/8\pi$, and $(2R_2/r_s)^2 = (15/8\pi)\times6.938$ gives $R_2 = 1.0175\,r_s$, the shell found above.

::: derivation
### From the share absorbed to the response, at any degree

We write the shape as $h = r^\ell A_Ln_L$, with $A_L$ a constant symmetric trace-free table with $\ell$ indices,
contracted with $n_{i_1}\cdots n_{i_\ell}$, the components of the direction $\hat n$. A body's moment is then
$A_LI_L$, with $I_L$ its trace-free moment of degree $\ell$.

**An average over directions.** Let $A_Q$ and $B_Q$ be constant symmetric trace-free tables with $q$ indices.
Then $p = A_Qx_Q$ and $p' = B_Qx_Q$ are harmonic polynomials of degree $q$. For a polynomial $F$ whose every term has
degree $n$, Gauss's theorem on the ball of unit radius and Euler's rule $\vect x\cdot\nabla F = nF$ give
$\int\nabla^2F\,\dd V = \oint\hat n\cdot\nabla F\,\dd A = n\oint F\,\dd A$. The same volume integral is also
$\oint\nabla^2F\,\dd A/(n + 1)$, because $\nabla^2F$ has degree $n - 2$ and $\int_0^1r^{n-2}\,r^2\,\dd r = 1/(n + 1)$.
So the averages over directions obey $\langle F\rangle = \langle\nabla^2F\rangle/n(n + 1)$. Applied $q$ times to
$F = pp'$, of degree $2q$, this gives $\langle pp'\rangle = \nabla^{2q}(pp')/(2q + 1)!$, a constant. With $p$ and $p'$
harmonic, $\nabla^2(pp') = 2\nabla p\cdot\nabla p'$, and their derivatives are harmonic again, so
$\nabla^{2q}(pp') = 2^q(\partial_{i_1}\!\cdots\partial_{i_q}p)(\partial_{i_1}\!\cdots\partial_{i_q}p') = 2^q(q!)^2A_QB_Q$.
Since
$(2q + 1)! = 2^q\,q!\,(2q + 1)!!$,

$$\langle(A_Qn_Q)(B_Qn_Q)\rangle = \frac{q!}{(2q + 1)!!}\,A_QB_Q .$$

At $q = 1$ this is $\langle n_in_j\rangle A_iB_j = \tfrac13\vect A\cdot\vect B$. It holds also for $J_{KQ}n_Q$, with
$J_L$ symmetric and trace-free and the other $\ell - q$ indices $K$ held fixed, then summed:
$\langle(J_{KQ}n_Q)(J_{KR}n_R)\rangle = q!\,J_LJ_L/(2q + 1)!!$.

**Thorne's power.** A moment $I_L$ that oscillates radiates, on average,

$$P = \frac{G}{c^{2\ell+1}}\,N_\ell\,\bigl\langle(\partial_t^{\ell+1}I_L)^2\bigr\rangle , \qquad N_\ell = \frac{(\ell + 1)(\ell + 2)}{(\ell - 1)\,\ell\,\ell!\,(2\ell + 1)!!} ,$$

Thorne's formula [@Thorne1980], which we derive from section 7.7's far field,
$\tilde{\field h}^{\rm TT}_{ij} = (4G/c^4r)\,e^{i\omega r/c}\,\Lambda_{ij,kl}\matter{\tilde T}_{kl}(\omega,
\omega\hat n/c)$. Expanding $e^{-i\omega\hat n\cdot\vect x/c}$, the term of power $p = \ell - 2$ is
$(-i\omega/c)^p\,n_P\int\matter T_{kl}x_P\,\dd V/p!$, with $n_P = n_{i_1}\cdots n_{i_p}$. Section 7.7's two
integrations by parts, done on $\int\matter T^{00}x_L\,\dd V$ with $L = klP$, give
$\tfrac{\dd^2}{\dd t^2}\int\matter\rho\,x_L\,\dd V = \int\matter T_{ab}\,\partial_a\partial_bx_L\,\dd V$, and
$\partial_a\partial_bx_{i_1}\cdots x_{i_\ell}$ has $\ell(\ell - 1)$ terms, one for each ordered choice of two of the
indices. So the part of $\int\matter T_{kl}x_P\,\dd V$ symmetric in all $\ell$ indices is $\ddot I_L/\ell(\ell - 1)$,
with $I_L = \int\matter\rho\,x_L\,\dd V$. The rest is built from the moments of the flow's circulation, the current
moments, whose waves have the other parity, and over the sphere their cross term with these waves averages to zero
(Thorne 1980); we leave them out. Of the traces of $I_L$, those that leave $\delta_{kl}$ or $n_k$ are removed by
$\Lambda$, and those that leave $n_in_i = 1$ belong to a lower degree, at a higher order in $\omega L/c$ for a source
of size $L$; so only the trace-free $I_L$ counts. Each $-i\omega$ is a time derivative, and

$$\field h^{\rm TT}_{ij} = \frac{4G}{\ell!\,c^{\ell+2}r}\,\Lambda_{ij,kl}\,n_P\,\partial_t^\ell I_{klP}\Bigl(t -
\frac rc\Bigr) ,$$

which at $\ell = 2$ is section 7.7's $(2G/c^4r)\Lambda_{ij,kl}\ddot I_{kl}$. The power is $r^2$ times section 7.7's
flux $(c^3/32\pi G)\langle\dot{\field h}^{\rm TT}_{ij}\dot{\field h}^{\rm TT}_{ij}\rangle$ integrated over
directions. With $T_{kl} = J_{klP}n_P$ and $J_L = \partial_t^{\ell+1}I_L$,

$$P = \frac{c^3}{32\pi G}\Bigl(\frac{4G}{\ell!\,c^{\ell+2}}\Bigr)^2 4\pi\,\langle T^{\rm TT}_{ij}T^{\rm TT}_{ij}\rangle =
\frac{2G}{(\ell!)^2c^{2\ell+1}}\,\langle T^{\rm TT}_{ij}T^{\rm TT}_{ij}\rangle ,$$

with $\langle\cdot\rangle$ the average over directions and over time. Section 7.7's projector gives
$T^{\rm TT}_{ij}T^{\rm TT}_{ij} = T_{ij}T_{ij} - 2n_iT_{ij}T_{jk}n_k + \tfrac12(n_iT_{ij}n_j)^2$, three averages of
the kind above, with $q = \ell - 2$, $\ell - 1$ and $\ell$ indices on $\hat n$:

$$\langle T^{\rm TT}_{ij}T^{\rm TT}_{ij}\rangle = \Bigl[\frac{(\ell - 2)!}{(2\ell - 3)!!} - \frac{2(\ell - 1)!}{(2\ell -
1)!!} + \frac{\ell!}{2(2\ell + 1)!!}\Bigr]J_LJ_L .$$

Taken out of the bracket, $(\ell - 2)!/(2\ell + 1)!!$ leaves $(2\ell - 1)(2\ell + 1) - 2(\ell - 1)(2\ell + 1) +
\tfrac12\ell(\ell - 1) = \tfrac12(\ell + 1)(\ell + 2)$. So
$P = (G/c^{2\ell+1})\,(\ell + 1)(\ell + 2)(\ell - 2)!\,J_LJ_L/[(\ell!)^2(2\ell + 1)!!]$, and $(\ell - 2)!/(\ell!)^2 = 1/(\ell - 1)\,\ell\,\ell!$ gives $N_\ell$. **Units:**
$G/c^{2\ell+1}$ times $(\mathrm{kg\,m^\ell\,s^{-\ell-1}})^2$ is $\mathrm{kg\,m^2\,s^{-3}}$, a watt. At $\ell = 3$,
$N_3 = 20/3780 = 1/189$.

At $\ell = 2$, $N_2 = \tfrac15$, chapter
[7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole)'s
$G\dddot I_{ij}\dddot I_{ij}/5c^5$.

**Its reaction.** Half the retarded wave minus half the advanced one is a standing wave, regular at the source. Near the
source it is the growing harmonic $\alpha_\ell(G/c^{2\ell+1})\,r^\ell n_L\,\partial_t^{2\ell+1}I_L$, with a number
$\alpha_\ell$, and its work on the source must be $-P$ on average. That work goes at the rate
$-\alpha_\ell(G/c^{2\ell+1})\,\partial_t^{2\ell+1}I_L\,\dot I_L$, and $\ell$ integrations by parts turn its average into
$-(-1)^\ell\alpha_\ell(G/c^{2\ell+1})\langle(\partial_t^{\ell+1}I_L)^2\rangle$. So $\alpha_\ell = (-1)^\ell N_\ell$,
which at $\ell = 2$ is the $\tfrac15$ of Burke and Thorne's radiation-reaction potential.

**The incoming quarter.** The standing wave's incoming half is half the advanced wave, so it brings in $P/4$. A tide of
shape $h$ and strength $F$, of potential $-Fh$, is the standing wave that a source of moment $I_L$ would make when
$\alpha_\ell(G/c^{2\ell+1})\,\partial_t^{2\ell+1}I_L = -FA_L$. This $I_L$ is not the hole's: it only measures the
tide. In phasors it fixes $|\tilde I_L|$, and the incoming power is

$$\frac P4 = \frac{c^{2\ell+1}A_LA_L}{8GN_\ell\,\omega^{2\ell}}\,|\tilde F|^2 .$$

**The response.** The hole absorbs the share $\Gamma_\ell$ of it, the same for every order and either parity (11.3).
A response absorbs $\tfrac12\omega\,\mathrm{Im}\,\chi_h|\tilde F|^2$ (section 4.1). Setting the two equal gives

$$\mathrm{Im}\,\chi_h = \frac{\Gamma_\ell\,c^{2\ell+1}A_LA_L}{4GN_\ell\,\omega^{2\ell+1}} .$$

For $h = xy$, $A_LA_L = \tfrac12$ and $\mathrm{Im}\,\chi_h = 5c^5\Gamma_2/8G\omega^5$. The response used
above is half of it, section 11.4's $5c^5\Gamma_2/16G\omega^5$. Like the last section, this defines the
response by absorption.

**The shell.** The last section's change of variable turns the hole's sum into
$(A_LA_L/2\pi N_\ell)\,\matter M(G\matter M/c^2)^{2\ell-2}\int_0^\infty\Gamma_\ell x^{-2\ell}\,\dd x$. Over directions
$\hat n$, $(A_Ln_L)^2$ averages to $A_LA_L\,\ell!/(2\ell + 1)!!$ (the average above with $q = \ell$), so a
shell gives $A_LA_L\,\ell!\,\ell(2\ell + 1)\,\matter MR^{2\ell-2}/(2\ell + 1)!!$. Equating the two, $A_LA_L$ cancels.
Solving for $R$ and putting in $N_\ell$ gives the boxed formula.
:::

The radii are $R_\ell/r_s = 1.0175$, $1.4555$,
$1.6100$, $1.6868$ and $1.7324$ for $\ell = 2$ to 6, or 1.02, 1.46, 1.61, 1.69 and 1.73 (panel (c) of Figure [](/paper/#fig:hole-response)).
Each $\Gamma_\ell$ comes from the integration of the last section with $V_\ell = (1 - 2/r)[\ell(\ell + 1)/r^2 -
6/r^3]$ in place of $V_2$. At low frequency $\Gamma_\ell \propto x^{2\ell+2}$, so every integrand
$\Gamma_\ell x^{-2\ell}$ rises from zero as $x^2$. The integrals are $\int_0^\infty\Gamma_\ell x^{-2\ell}\,\dd x =
2.865$, $0.7059$, $0.1127$ and $0.01249$ for $\ell = 3$ to 6, and each integrand peaks a little above the top of its
barrier, at $x = 0.63$, $0.84$, $1.04$ and $1.24$, where $\Gamma_\ell$ is again 0.70 to 0.71. A step at the barrier's top,
$x_{\rm top} = 0.610$, $0.817$, $1.019$ and $1.217$, gives the radii $1.39$, $1.56$, $1.65$ and $1.70\,r_s$, from 5
to 2 per cent below the hole's, and $0.92\,r_s$ at $\ell = 2$. At large $\ell$ the top sits at $r = 3$, the photon
sphere, where $V_\ell \approx \ell(\ell + 1)/27$, so $x_{\rm top} \to (\ell + \tfrac12)/3\sqrt3$, the step of the
limit below.

**The limit** (depth A). For large $\ell$ we assume that **the greybody factor is a step**. By 11.3 a wave of degree $\ell$ has the impact parameter $b \approx (\ell + \tfrac12)c/\omega$, and by
section 11.1 the hole captures every ray with $b$ below the **critical impact parameter**
$\sym{critical-impact-parameter}{b_c} = 3\sqrt3\,G\matter M/c^2 = 2.60\,r_s$. Multiplied by $\omega/3\sqrt3\,c$, the
condition $(\ell + \tfrac12)c/\omega < 3\sqrt3\,G\matter M/c^2$ reads $x > (\ell + \tfrac12)/3\sqrt3 = x_\ell$. So
$\Gamma_\ell$ is 0 below $x_\ell$ and 1 above it, and

$$\int_0^\infty\frac{\Gamma_\ell}{x^{2\ell}}\,\dd x \approx \int_{x_\ell}^\infty\frac{\dd x}{x^{2\ell}} = \frac{x_\ell^{1-2\ell}}{2\ell - 1} .$$

We take the root of order $2\ell - 2$ of the boxed formula. Every factor that grows only as a power of $\ell$ tends to 1
under it, and so does $x_\ell^{-1/(2\ell-2)}$, which leaves $1/x_\ell$. The double factorial gives
$[(2\ell + 1)!!]^{1/(\ell-1)}$, which differs from $[(2\ell + 1)!!]^{1/\ell}$ by its power $1/\ell(\ell - 1)$, a
factor that tends to 1. So both grow as $2\ell/e$ (Stirling's rule),[^stirling] $R_\ell c^2/G\matter M \to
(2\ell/e)\,3\sqrt3/(\ell + \tfrac12) \to 6\sqrt3/e$, and

$$\boxed{\;R_\ell \to \frac{3\sqrt3}{e}\,r_s = 1.91\,r_s\;} .$$

**Check.** A **step absorber** takes every wave aimed inside a fixed impact parameter and nothing else. With $b_c$ as
that parameter, its radii are $0.668$, $1.226$, $1.459$, $1.580$ and $1.652\,r_s$ for $\ell = 2$ to 6, climbing slowly
to the same limit and below the hole's, whose $\Gamma_\ell$ also lets in some waves below $x_\ell$. **Meaning:**
for any body $R_\ell$ tends to the radius of its outermost mass, which high powers of $r$ weigh most. So $1.91\,r_s =
(2/e)\,b_c$, between the photon sphere at $1.5\,r_s$ and $b_c$, is where the hole's would-be body ends (Figure
[](#fig:hole-shells)).

![Look first at the rings crowding toward the dashed circle: each degree of tide answers like a shell of the hole's
mass at its own radius, and the radii tend to $(3\sqrt3/e)\,r_s$, between the photon sphere and the critical impact
parameter. Grey ticks: the step absorber's radii, lower and climbing to the same limit. Radii
exact.](tut-hole-shells){#fig:hole-shells}

**What sets the shares.** Whatever the tide, what a hole gains is set by its mass and spin alone. A wave of degree
$\ell$ and order $m$ round a turning hole obeys Teukolsky's equation, the turning hole's counterpart of the
Regge–Wheeler equation, whose coefficients are built from the Kerr metric of
[section 11.2](/tutorial/black-holes/spin/#a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in). That
metric holds only $\matter M$ and the spin $a$, so the share absorbed, $\Gamma_{\ell m}(\omega)$, depends on
$\matter M$, $a$ and $\omega$ and on nothing that fell in.[^teuk] A tide of any shape is a sum of such components, each
absorbed in its own share, and the energy gained is the sum of theirs. For a hole that does not turn, $\Gamma_\ell$
depends on $\omega$ only through $x = G\matter M\omega/c^3$, so every $R_\ell$ is a fixed multiple of $r_s$: the
would-be body is the same for every mass, drawn to the scale $r_s$. For a turning hole $\Gamma_{\ell m}$ is negative
where $\omega < m\Omega_H$, the amplification of section 11.2, with $\Omega_H$ the angular velocity of the horizon.

## No distribution of positive mass has the hole's first three sums

**The bound** (depth A). Assuming only that **the density is nowhere negative**, some combination of the sums of
degrees two, three and four is never negative. These degrees read $m_1$, $m_2$ and $m_3$, with
$\sym{radial-mean}{m_k} = \int\matter\rho\,r^{2k}\,\dd V/\matter M$ the mean of $r^{2k}$ over the mass, in
$\mathrm m^{2k}$.[^mk] For any number $a$, in $\mathrm{m^2}$,[^a] the integrand of $\int\matter\rho\,r^2(r^2 - a)^2\,
\dd V$ is never negative, so neither is the integral. Expanding the square,

$$\boxed{\;m_3 - 2a\,m_2 + a^2m_1 \ge 0\quad\text{for every } a\;} .$$

The left side is least at $a = m_2/m_1$, where it is $m_3 - m_2^2/m_1$, so $m_2^2 \le m_1m_3$. This is the
**positivity test**, section 3.9's statement that the $2\times2$ Hankel matrix of a positive distribution has no
negative determinant. The distribution is the weight $\matter\rho\,r^2$ in the variable $r^2$, whose first three
moments are $\matter M$ times $m_1$, $m_2$ and $m_3$, so the matrix
$\bigl(\begin{smallmatrix}m_1&m_2\\m_2&m_3\end{smallmatrix}\bigr)$ starts at $m_1$ and leaves out the mass.

Equality needs $r^2 = a$ wherever there is mass off the centre: a thin shell of radius $\sqrt a$, perhaps with a
point at the centre, which none of the three integrals sees. A shell a tenth of its radius thick has
$m_2^2/m_1m_3 = 0.996$, and a uniform ball $m_k = 3R^{2k}/(2k + 3)$ and the ratio $45/49 = 0.918$.

**The hole.** Read as a round body's, its sums give $m_k = R_{k+1}^{2k}$. From the unrounded radii,

$$m_1 = 1.0352\,r_s^2 , \qquad m_2 = 4.4881\,r_s^4 , \qquad m_3 = 17.418\,r_s^6 ,$$

and the test's least value (Figure [](#fig:hankel-test)) is

$$\boxed{\;m_3 - \frac{m_2^2}{m_1} = -2.04\,r_s^6\quad\text{at } a = 4.335\,r_s^2\;} .$$

Times $\matter M$, this is $-2.04\,\matter Mr_s^6$ at $a = 4.34\,r_s^2$.[^precision] Equivalently,
$m_2^2/m_1m_3 = 1.117$, above 1. The test built from the mass, which a uniform pull reads, and the tides of degree two
and three passes, with the ratio 0.239: only degrees two, three and four together fail.

**Why no body fits.** A body has one density, which feeds every degree; nothing ties the hole's separate $\Gamma_\ell$ to
one. A body of positive mass with the hole's $R_2 = 1.0175\,r_s$ and
$R_3 = 1.4555\,r_s$ needs $m_3 \ge m_2^2/m_1$, that is $R_4 \ge 1.640\,r_s$. The hole's $R_4$ is $1.610\,r_s$: its
radii climb, as any body's must, but too slowly at the third step.

**A body's shape does not help it.** Summed over the $2\ell + 1$ tides of a degree, any body's sums are fixed
multiples of its own $m_1$, $m_2$ and $m_3$ (the sum over orders above), which pass the test. The hole answers every order alike, so its
sums give the $m_k$ above, which no body of any shape has.

**One tide is a positive measure.** For one degree the hole only absorbs, $\Gamma_\ell \ge 0$, so
$\omega\,\mathrm{Im}\,\chi_\ell \ge 0$ at every frequency: a **positive measure**, a weighting nowhere negative. Its
**moments in frequency**, its integrals against powers of $\omega$, pass every test of this kind. That a passive body's
response is such a measure is a general statement of Kehagias and Riotto [@KehagiasRiotto2026]. The hole fails only the test of the **moments in radius**, the $m_k$, which joins different
degrees: it is the sums across the degrees that belong to no body.

**Any perfect absorber fails.** A step absorber with the impact parameter $\beta G\matter M/c^2$, for any number
$\beta$, has its step at $x = (\ell + \tfrac12)/\beta$. Its sums grow as $\beta^{2\ell-1}$, so $m_k$ grows as
$\beta^{2k+1}$: a stretch of the radii by $\beta$ and a factor $\beta$ that only rescales the mass. The ratio, unchanged
by either, does not depend on $\beta$. It is 1.185, worse than the hole's. Since every
body passes the test, no body absorbs like a step, and matter is indeed nearly transparent: a gravitational wave
crossing the Earth loses about $10^{-30}$ of its energy (chapters
[5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line) and
[10.3](/tutorial/glow/why-matter-barely-glows/#no-material-can-glow-brighter-than-its-weight-allows)). No matter does that
to a gravitational wave. **Meaning:** one tide lets the hole be drawn as a shell, and three allow no drawing.

![Look first at the two dips into the shaded region: the hole's sums and the step absorber's fall below zero, which
no positive mass can do; the ball's curve stays above. Curves exact, from the unrounded radii of panel (c) of Figure [](/paper/#fig:hole-response).](tut-hankel-test){#fig:hankel-test}

## The friction would make the hole yield like a liquid, yet its Love number is zero

Causality gives a second sign that the hole is not a body. For a body it ties the answer to a steady push to the
friction at every frequency, by section 4.5's **slow-end relation**

$$\chi(0) = \frac2\pi\int_0^\infty\frac{\mathrm{Im}\,\chi(\omega)}{\omega}\,\dd\omega ,$$

a dispersion relation that holds for matter. We want the Love number it would give the hole. With
section 11.4's $\mathrm{Im}\,\chi$ and the variable $x$, as in the sum,

$$\chi(0) = \frac{5c^5}{8\pi G}\int_0^\infty\frac{\Gamma_2}{\omega^6}\,\dd\omega = \frac5{8\pi}\,\frac{G^4\matter M^5}{c^{10}}\int_0^\infty\frac{\Gamma_2}{x^6}\,\dd x .$$

Section [4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number)'s
**Love number** $\sym{love-number}{k_2}$ is fixed by $-k_2R^5\curv\tE_{ij}/G$, the quadrupole of section 2.3 that a
steady tide raises on a round body of radius $R$. the hole's quadrupole is a sixth of 2.3's, and $\tilde{\matter
Q}_{ij} = -\chi\tilde{\curv\tE}_{ij}$, so $k_2 = 6G\chi(0)/R^5$. We take $R = r_s$, with $r_s^5 =
32G^5\matter M^5/c^{10}$; since $k_2$ scales as $R^{-5}$, the shell radius $1.0175\,r_s$ would give 1.24. So

$$\boxed{\;k_2 = \frac{15}{128\pi}\int_0^\infty\frac{\Gamma_2}{x^6}\,\dd x = 1.35\;} ,$$

with the integral $36.13$ from the same solution. A step at the barrier's top gives
$x_{\rm top}^{-5}/5 = 22.5$, 38% short: the weight $x^{-6}$ leans still harder on the waves that tunnel below the
top. **Units:** $\chi$ is in $\mathrm{kg\,m^2\,s^2}$, so $G\chi/R^5$ is a pure number. **Check:** a uniform ball of liquid has $k_2 = \tfrac32$ (4.6), so the friction, read as a body's,
would make the hole nearly as yielding. The hole's own Love number is zero (chapter
[11.4](/tutorial/black-holes/under-tides/#a-steady-tide-raises-no-bulge-on-a-hole)).

**What resolves it** (stated). Matter's response falls to zero at high frequency (4.5). The point that stands for a
hole may also answer at the instant of the push, with a term local in time, one real number at every frequency. It adds
nothing to $\mathrm{Im}\,\chi$, so the absorption and the sum stand. The static response then needs a **subtraction**, the local term
added to the integral. If one subtraction suffices, the local term must be $-1.35$ in these units and cancels the
integral [@KehagiasRiotto2026]. Porto shows the relation cannot hold without a subtraction [@Porto2016], and
Goldberger, Li and Rothstein that the part from waves near the hole's size, which the $1.35$ includes, cannot be told
from such local terms [@GoldbergerLiRothstein2021]. The 1.35 uses $\Gamma_2$ near $x \approx 0.4$, where a point's response is defined only by convention. So 1.35 is the
size of the dispersive part, and zero that of the whole.[^rms]

::: try {#hole-response}
The figure, live, in three panels: the horizon with a ring at each degree's shell radius, the
chosen ring bold and the limit dashed; the same radii against the degree; and the test $\int\matter\rho\,r^2(r^2 -
a)^2\,\dd V$ from the hole's sums for degrees two, three and four, against $a$ in units of $r_s^2$, with the region
below zero shaded.

The figure opens at the least value, so first slide *The number a of the test* to $a = 1$, where the test is positive.
Predict: is the range of $a$ over which the test is negative wider or narrower than $2\,r_s^2$? Then slide $a$ and
read where the curve enters and leaves the shaded region.
:::

**The idea to keep: a camera beside a black hole can read its temperature from the trembling of its pull, but the
temperature gives only the mass. The hole answers each tide like a shell a little outside its horizon, finer tides
like shells farther out, yet no positive mass has its first three sums, and matter's dispersion relation would give it
the Love number 1.35 instead of zero.**

::: problems
### Practice

**[13.7]** Why does the thermometer beside a hole tell the camera nothing about what fell in, and why is the hole's sum
finite although its friction law $\nu\omega$ would make it grow without limit?

::: solution
It reads $T_H$, and $\kB T_H = \hbar c^3/8\pi G\matter M$ is fixed by the mass alone. Above
$G\matter M\omega/c^3 \approx 0.5$ the hole swallows every quadrupole wave, $\Gamma_2 \approx 1$, so
$\omega\,\mathrm{Im}\,\chi$ falls as $\omega^{-4}$ and the integral converges.
:::

**[13.7]** The hole's sums give $m_2^2/m_1m_3 = 1.12$. What does that say? And what Love number would the hole have if
the slow-end relation for matter held without a subtraction?

::: solution
No density that is nowhere negative has these moments, so no body of ordinary matter has these sums. The Love number
would be $k_2 = 1.35$, nearly a liquid ball's $\tfrac32$; the true one is zero.
:::

**[13.7]** A body is two thin shells, each of mass $\tfrac12\matter M$, at the radii $r_s$ and $2r_s$. Find its $m_1$, $m_2$ and
$m_3$, and show that it passes the positivity test.

::: solution
$m_1 = \tfrac12(1 + 4) = 2.5\,r_s^2$, $m_2 = \tfrac12(1 + 16) = 8.5\,r_s^4$ and $m_3 = \tfrac12(1 + 64) = 32.5\,r_s^6$.
Then $m_1m_3 = 81.25 \ge m_2^2 = 72.25$, in $r_s^8$; the least value is $+3.6\,r_s^6$.
:::

**[13.7]** The barrier $V_2$ is highest at $x_{\rm top} = 0.389$. Estimate $\int_0^\infty\Gamma_2x^{-4}\,\dd x$ with
$\Gamma_2$ a step there, and the shell radius $R_2$ it gives. Which way is the estimate off, and why?

::: solution
$\int_{0.389}^\infty x^{-4}\,\dd x = 1/(3\times0.389^3) = 5.66$. Then $(2R_2/r_s)^2 = (15/8\pi)\times5.66 = 3.38$, so
$R_2 = 0.92\,r_s$, against $1.0175\,r_s$. The estimate is low: waves somewhat below the top tunnel through the
barrier, and $x^{-4}$ weighs them heavily.
:::

**[13.7]** Why is $R_\ell/r_s$ the same for a hole of any mass, and what could change it?

::: solution
The share $\Gamma_\ell$ of a hole that does not turn depends on $\omega$ only through $x = G\matter M\omega/c^3$, and
the boxed formula holds $\Gamma_\ell$ only through $\int\Gamma_\ell x^{-2\ell}\,\dd x$, a pure number. Only the spin
could change it, since Teukolsky's equation, which fixes $\Gamma_{\ell m}$, contains nothing but $\matter M$, $a$ and
$\omega$.
:::

### Stretch

**[13.7]** With section 11.1 and the boxed formula for $R_\ell$: a step absorber takes every wave of degree $\ell$ above $x =
(\ell + \tfrac12)/\beta$. Show that its sum of degree $\ell$ grows as $\beta^{2\ell-1}$, and that $m_2^2/m_1m_3$
does not depend on $\beta$.

::: solution
Above the edge $\Gamma_\ell = 1$, so $\int\Gamma_\ell x^{-2\ell}\,\dd x = [(\ell + \tfrac12)/\beta]^{1-2\ell}/
(2\ell - 1)$, which is $\beta^{2\ell-1}$ times a number fixed by $\ell$. The boxed formula makes the sum
$\matter MR_\ell^{2\ell-2}$ proportional to it, so $m_k = R_{k+1}^{2k}$ grows as $\beta^{2k+1}$, and $m_2^2/m_1m_3$ as
$\beta^{10}/\beta^3\beta^7 = 1$. At $\beta = 3\sqrt3$, as at every $\beta$, the ratio is 1.185.
:::

**[13.7]** From the three averages over directions, find $\langle T^{\rm TT}_{ij}T^{\rm TT}_{ij}\rangle$ for $\ell = 2$
and $\ell = 3$, and confirm $N_2 = \tfrac15$ and $N_3 = \tfrac1{189}$.

::: solution
At $\ell = 2$ the bracket is $1 - \tfrac23 + \tfrac1{15} = \tfrac25$, so $P = (2G/4c^5)\times\tfrac25J_{ij}J_{ij} =
GJ_{ij}J_{ij}/5c^5$. At $\ell = 3$ it is $\tfrac13 - \tfrac4{15} + \tfrac{3}{105} = \tfrac{2}{21}$, so $P =
(2G/36c^7)\times\tfrac{2}{21}J_LJ_L = GJ_LJ_L/189c^7$.
:::

### The camera

**[13.7]** Derive the first line of [](#eq:hole-sum-rule) from section 11.4's $\mathrm{Im}\,\chi$. Then reproduce
$1.02\,r_s$ from 0.345, and $-2.04\,\matter Mr_s^6$ at $a = 4.34\,r_s^2$ from the radii 1.0175, 1.4555 and 1.6100.

::: solution
The [second section](#a-holes-response-has-the-weight-of-a-shell-a-little-outside-its-horizon) gives the first line.
$\sqrt{3\times0.345} = 1.02$. With $m_1 = 1.0175^2 = 1.0353$, $m_2 = 1.4555^4 = 4.4880$ and $m_3 = 1.6100^6 =
17.416$, the least is $m_3 - m_2^2/m_1 = -2.04$ at $a = m_2/m_1 = 4.335$; the unrounded radii give 4.3353.
:::
:::

::: paper
- [Section XIV](/paper/#sec:hole), [*The fluctuations of a black hole's
  quadrupole*](/paper/#par:the-fluctuations-of-a-black-holes-quadrupole): the thermometer and the tremor.
- [*The weight of a black hole's response*](/paper/#par:the-weight-of-a-black-holes-response): the sum, the radii,
  $(3\sqrt3/e)\,r_s$, the test and $k_2 = 1.35$, with Figure [](/paper/#fig:hole-response) and Table [](/paper/#tab:hair).
- [Section IV](/paper/#sec:near-field) and [Section XV](/paper/#sec:holography): the sum rule for the matter the hole is
  weighed against, and the hole's temperature at two times.
:::

::: deeper
- The GR course's section
  [22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature) derives the
  temperature, and section
  [23.2](https://neovand.github.io/general-relativity/chapter-23.html#23-2-why-unresolved-heavy-physics-becomes-derivatives)
  treats a hole as a point with a response and local terms.
- W. D. Goldberger and I. Z. Rothstein [@GoldbergerRothstein2006; @GoldbergerRothstein2020], A. Kehagias and
  A. Riotto [@KehagiasRiotto2026] and R. A. Porto [@Porto2016] treat a hole's response, its noise and its subtraction.
- K. S. Thorne [@Thorne1980] gives the power of every multipole.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIV
    ([*The fluctuations of a black hole's quadrupole*](/paper/#par:the-fluctuations-of-a-black-holes-quadrupole)).

[^ht]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equation [](/paper/#eq:hole-thermometer).
    At 0.905 K the signal is $4\times10^{-32}\unit{s^{-2}}$ in a second, a metre away.

[^hair]: Table [](/paper/#tab:hair) of *The gravitational camera* (Mohsenvand 2026), row *Its tremor*, compares the two.

[^sr]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equation [](/paper/#eq:hole-sum-rule).

[^mult]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:thermal-multipole).

[^norm]: For a body it is half of Newton's trace-free moment and a sixth of 2.3's.

[^chi]: Here $\chi$ is 4.5's response for this quadrupole, as in 11.4, never a spin.

[^x]: Not 10.1's $\hbar\omega/\kB T$, which is $8\pi x$ at the hole's temperature, and not the coordinate $x$ of 4.5's
    tide $h = xy$.

[^solver]: Page's law stands in below $x = 0.01$, and $\Gamma_2 = 1$ above $x = 2.9$; the two ends move the integral
    by about $2\times10^{-8}$. The 36.13 of the last section comes from the same solution.

[^shape]: The [fourth section](#no-distribution-of-positive-mass-has-the-holes-first-three-sums) shows that a body's
    shape does not help it.

[^stirling]: With $\ln n! \approx n\ln n - n$ and $(2\ell + 1)!! = (2\ell + 1)!/2^\ell\ell!$,
    $\ln(2\ell + 1)!! \approx \ell\ln(2\ell) - \ell$. 

[^a]: Here $a$ is the test's free number, not Kerr's $a$ (11.2) or a body's radius.

[^mk]: Not a mass: $m_1$ is in $\mathrm{m^2}$, $m_2$ in $\mathrm{m^4}$ and $m_3$ in $\mathrm{m^6}$.

[^precision]: The radii are unrounded. To two places, 1.02, 1.46 and 1.61, they give $-2.43$ at $4.37$: the test fails
    either way, but $-2.04$ needs the unrounded radii, because $R_3$ enters $m_2^2$ as its eighth power.



[^teuk]: S. A. Teukolsky, *Astrophys. J.* 185, 635 (1973), derived the equation; Teukolsky and Press
    [@TeukolskyPress1974] computed from it the shares of gravitational waves.

[^rms]: The root-mean-square frequency is $\sqrt{6.938/36.13} = 0.438\,c^3/G\matter M$, above the hole's slowest
    quadrupole ringing at $0.374\,c^3/G\matter M$ (Chandrasekhar and Detweiler, 1975), so one mode does not carry
    the sum.
