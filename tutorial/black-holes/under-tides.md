---
id: '11.4'
title: 'Black holes under tides: Love numbers, absorption, the friction of the horizon'
question: 'A black hole''s Love numbers are zero, yet a changing tide loses energy through its horizon at the rate $\nu(\dot{\mathcal E}_{ij}\dot{\mathcal E}_{ij} + \dot{\mathcal B}_{ij}\dot{\mathcal B}_{ij})$. Why does a steady tide raise no bulge on a hole, what is the friction of a horizon, and why are that friction, the absorption of gravitational waves and the trembling of the hole''s shape one number?'
part: '11'
requires: ['2.3', '4.5', '4.6', '7.6', '11.1', '11.3']
paper: [sec:hole, eq:horizon-friction, eq:hole-noise, eq:hole-thermometer, eq:hole-sum-rule, fig:hole-response, fig:hole-tide, tab:hair, sec:vistas, sec:holography, sec:near-field]
figures: [fig:hole-tide]
live: ['tidal-friction']
depth: A
---

The Moon's tide raises a bulge on the Earth, and the bulge adds 30% to the Moon's tidal potential at the Earth's
surface: the Earth's Love number is $0.30$ ([section 4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number)).
A stone answers a steady tide with its Love numbers and a changing tide with its density. A black hole answers a steady
tide with nothing, if it does not turn, and a slowly changing tide with friction.[^table] So we ask why a steady tide
raises no bulge on a hole, what the friction of a horizon is, and why that friction, the absorption of gravitational
waves and the trembling of the hole's shape (its quadrupole, read from outside) are one number.

::: plain
A tide is the difference in gravity's pull from one place to the next. A steady tide stretches the Earth into a slight
bulge; a black hole that does not spin does not bulge at all.

A tide that changes is different: the hole swallows a little of its energy, as if the horizon, the surface from which
nothing escapes, had friction. The strength of that friction is set by the hole's mass alone. The same friction decides
how much of a long gravitational wave the hole absorbs, in agreement with the answer found by following the wave as it
scatters off the hole.

Every warm body that has friction also trembles. A black hole is warm, at its Hawking temperature, so its shape, as the
field outside shows it, trembles too, by an amount fixed by its friction and its temperature.
:::

## A steady tide raises no bulge on a hole

**The definition, recalled.** Section 4.6 defined the **Love number** $\sym{love-number}{k_2}$, a pure number, by the
quadrupole that a steady tide $\sym{tidal-tensor}{\curv\tE}_{ij}$ raises on a round body of radius $R$. With the
trace-free second moment it reads

$$\int\matter\rho\,(x_ix_j - \tfrac13r^2\delta_{ij})\,\dd V = -\frac{k_2R^5}{3G}\,\curv\tE_{ij} ,$$

with the minus sign because a body grows longer along a stretch.[^sign] Far away, the raised moment shows as a part of
the potential that falls as $r^{-3}$, beside the tide's own part, which grows as $r^2$. At the surface the first is
$k_2$ times the second. So a body's Love number is read from the $r^{-3}$ part of its potential.

**The hole** (a sketch, depth B). We want the same two parts outside a black hole that does not spin, of mass
$\sym{mass}{\matter M}$ and Schwarzschild radius $\sym{schwarzschild-radius}{r_s} = 2G\matter M/c^2$, the radius of
its horizon in metres (section 11.1). We assume that **the tide is static** and that **it is weak**, so that it
changes 11.1's metric only a little. A tide of degree two changes the metric by a pattern of degree two on each sphere
round the hole (section 2.2's harmonics), times factors that depend on the radius. In a convenient choice of
coordinates one such factor, a pure number $H(r)$ local to this section, sets all the others. Far away the tide's
potential is $\tfrac12c^2H(r)$ times the pattern, so $H$ is that potential measured in units of $\tfrac12c^2$.
Einstein's equation then gives, with $r$ 11.1's circumference radius and a prime for a derivative with respect to $r$
(T. Hinderer's form, 2008),

$$H'' + \frac{2r - r_s}{r(r - r_s)}\,H' - \frac{6r(r - r_s) + r_s^2}{r^2(r - r_s)^2}\,H = 0 .$$

**A limit.** Far from the hole, $r \gg r_s$, it becomes $H'' + 2H'/r - 6H/r^2 = 0$. This is the radial part of
Laplace's equation for degree two (section 2.2), with the two solutions $r^2$ and $r^{-3}$, as in Newton's theory.

**One solution, checked.** Try $H$ in proportion to $r(r - r_s)$. That product is in square metres, so the constant
in front, in $\mathrm{m^{-2}}$, makes $H$ a pure number and measures the tide's strength. The equation is linear, so
the constant drops out, and we write $H = r(r - r_s)$. Then $H' = 2r - r_s$ and $H'' = 2$. Multiplying the equation
by $r(r - r_s)$ leaves

$$2r(r - r_s) + (2r - r_s)^2 - 6r(r - r_s) - r_s^2 = 0 ,$$

which holds, as expanding the square shows. This solution is finite at the horizon. Far away it is $r^2 - r_sr$: the
tide, with a correction of relative size $r_s/r$ from the hole's own field. It is a polynomial, so it stops there. It
has no part falling as $r^{-3}$.

**The second solution, found.** We write the equation as $H'' + PH' + qH = 0$, with $P = (2r - r_s)/r(r - r_s)$ and
$q$ the last coefficient, and look for a second solution $H = H_1w$, with $H_1 = r(r - r_s)$ the first. Putting it in,
the terms without a derivative of $w$ are $w$ times the equation for $H_1$, which vanishes, and what is left is

$$H_1w'' + \bigl(2H_1' + PH_1\bigr)w' = 0 , \qquad\text{so}\qquad \frac{w''}{w'} = -\frac{2H_1'}{H_1} - P .$$

The coefficient $P$ is the derivative of $\ln[r(r - r_s)] = \ln H_1$, so integrating gives $\ln w' = -3\ln H_1$ plus a
constant, $w' \propto 1/H_1^3$, and

$$H_2 = r(r - r_s)\int_r^\infty\frac{\dd r'}{r'^3(r' - r_s)^3} ,$$

the lower end chosen so that $H_2$ dies away far away. In $u = r'/r_s$, partial fractions split the integrand into
$1/(u - 1)^3 - 3/(u - 1)^2 + 6/(u - 1) - 6/u - 3/u^2 - 1/u^3$, all over $r_s^5$, and every term integrates in closed
form. **Far away**, the integrand is $r'^{-6}$ to leading order, so $H_2 \approx r^2\cdot r^{-5}/5 = r^{-3}/5$: this is
the decaying piece. **Near the horizon**, the term $1/(u - 1)^3$ dominates and integrates to $1/2(u - 1)^2$, so
$H_2 \approx 1/[2r_s^2(r - r_s)]$, which grows without limit as $r \to r_s$. **Check:** with $z = 2r/r_s - 1$, which
runs from 1 at the horizon to infinity, the equation becomes Legendre's associated equation with $\ell = m = 2$,
$(1 - z^2)H'' - 2zH' + [6 - 4/(1 - z^2)]H = 0$ (a prime now a derivative in $z$), whose two solutions are $P_2^2
\propto z^2 - 1$, which is $4r(r - r_s)/r_s^2$, and $Q_2^2$, which grows as $1/(z - 1)$ at $z = 1$. Every static tide of
degree two is $AH_1 + BH_2$ with constants $A$ and $B$, and the coefficient of $r^{-3}$ far away is $B/5$, since $H_1$
has none and $H_2$ no $r^2$.

**The other solution** falls as $r^{-3}$ far away. Near the horizon it grows without limit, as $1/(r - r_s)$,
and with it the tide that a body falling through the horizon would feel. A hole formed from matter has a horizon that
a falling body crosses without harm, so its static tide keeps only the first solution.

**Why this differs from a stone.** Outside a stone both solutions are allowed, and the stone's interior decides how
much of the second it takes: its rock yields, and the yielding is $k_2$. A hole has no interior that the outside can
feel. The only condition left is that the field be finite at the horizon, and that condition removes the second
solution. So

$$\boxed{\;k_2 = 0\;} .$$

::: gap
This sketch states two things without proof: that in a suitable choice of coordinates one factor $H(r)$ sets the
whole static tide of degree two, and Hinderer's equation for $H$. Binnington and Poisson [@BinningtonPoisson2009] and
Damour and Nagar [@DamourNagar2009] derive both and reach the same zero.
:::

**With spin** (stated). The static Love numbers of a turning hole are zero too, and a turning hole raises a moment
only by friction (Charalambous, Dubovsky and Ivanov, 2021 [@CharalambousDubovskyIvanov2021]); the
[friction's section](#the-holes-quadrupole-answers-a-tide-with-friction-alone) shows why.

**Numbers.** A uniform fluid ball has $k_2 = \tfrac32$, the Earth $0.30$, the steel ball $4\times10^{-16}$, and a
black hole that does not turn exactly 0. **Meaning:** a steady tide passes a hole as if nothing were there to yield
(Figure [](#fig:tide-no-bulge)).

![Look first at the two strips: the stone's potential has a part that falls as $r^{-3}$, its reply, and the hole's has
none. The bulge is exaggerated; the curves are exact.](tut-tide-no-bulge){#fig:tide-no-bulge}

## A changing tide loses energy through the horizon

A hole of mass $\matter M$, not turning, absorbs energy from a slowly changing tide at the rate (E. Poisson, 2004
[@Poisson2004]; stated)[^fric]

$$\begin{gathered}
\frac{\dd E}{\dd t} = \nu\,\bigl(\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij} + \dot{\curv\tB}_{ij}\dot{\curv\tB}_{ij}\bigr),\\
\nu = \frac{16}{45}\,\frac{G^5\matter M^6}{c^{13}} = \frac{\matter Mr_s^5}{90\,c^3} ,
\end{gathered} \label{eq:friction}$$


Here $\sym{magnetic-tide}{\curv\tB}_{ij}$ is 7.5's magnetic part of the tide, the dots are rates of change in time,
and $\sym{horizon-friction}{\nu}$ is the **horizon friction**, in $\mathrm{J\,s^5}$.[^nu] The absorbed energy goes
into the hole, whose mass grows. Astronomers still call it **tidal heating**, after the heat that a changing tide
makes inside a moon.

**Its form** (depth A). We assume that **the tide changes slowly**, slowly against the time $r_s/c$, so that the rate
can be built from the tide's rates of change, each much smaller than the one before. A steady tide does no work, so
every term holds a rate of change. A term with a single $\dot{\curv\tE}_{ij}$ needs a fixed table to turn it into a
number, and a round hole has none, since $\delta_{ij}$ gives $\dot{\curv\tE}_{ii} = 0$ (a tide has no trace). So the
rate starts with products of two tides. Of these, $\curv\tE_{ij}\dot{\curv\tE}_{ij}$ is the rate of change of
$\tfrac12\curv\tE_{ij}\curv\tE_{ij}$, and $\curv\tE_{ij}\ddot{\curv\tE}_{ij}$ is
$-\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}$ plus the rate of change of $\curv\tE_{ij}\dot{\curv\tE}_{ij}$. A rate
of change of a bounded quantity averages to zero: it is energy lent and returned, not absorbed. So on average only the
squares $\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}$ and $\dot{\curv\tB}_{ij}\dot{\curv\tB}_{ij}$ remain. A mixed term
$\dot{\curv\tE}_{ij}\dot{\curv\tB}_{ij}$ would change sign in a mirror, since $\curv\tB$ does, and a hole without
spin looks the same in a mirror. The two squares share one coefficient (stated). A hole that does not
spin only absorbs, so the coefficient is positive. **Units:** a rate of change of a tide is in $\mathrm{s^{-3}}$, so
$\nu$ is a power over $\mathrm{s^{-6}}$, or $\mathrm{J\,s^5}$.

**Why $G^5\matter M^6/c^{13}$.** A hole without spin has only its mass, so $\nu$ can be built from $G$, $\matter M$
and $c$ alone. We look for $G^a\matter M^bc^d$ in $\mathrm{J\,s^5} = \mathrm{kg\,m^2\,s^3}$. Matching the powers of
the metre, the kilogram and the second gives three equations,

$$3a + d = 2 , \qquad -a + b = 1 , \qquad -2a - d = 3 .$$

Adding the first and the third gives $a = 5$, and then $d = -13$ and $b = 6$. So $\nu$ is a pure number times
$G^5\matter M^6/c^{13}$, and only the number $\tfrac{16}{45}$ needs Poisson's calculation. With
$r_s = 2G\matter M/c^2$, the second form agrees:
$\matter Mr_s^5/90c^3 = 32\,G^5\matter M^6/90c^{13} = \tfrac{16}{45}G^5\matter M^6/c^{13}$.

**Numbers.** For the hole of $1.356\times10^{23}$ kg, $\nu = 1.9\times10^{-23}\unit{J\,s^5}$. Since $\nu$
grows as $\matter M^6$, a hole of thirty solar masses has $\nu = 1.3\times10^{29}\unit{J\,s^5}$. Take a pair of
such holes $d = 2200$ km apart. With $\hat n$ the unit vector from a hole to its companion, each feels
the tide $(G\matter M/d^3)(\delta_{ij} - 3\hat n_i\hat n_j)$, which turns with the orbit at
$\Omega = \sqrt{2G\matter M/d^3} = 27.3\unit{s^{-1}}$. Only $\hat n$ changes, and its rate of change $\dot{\hat n}$
has the length $\Omega$ at right angles to $\hat n$. Differentiating the tide and squaring gives

$$\begin{aligned}
\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij} &= 9\Bigl(\frac{G\matter M}{d^3}\Bigr)^2
(\hat n_i\dot{\hat n}_j + \dot{\hat n}_i\hat n_j)^2\\
&= 18\,\Omega^2\Bigl(\frac{G\matter M}{d^3}\Bigr)^2 ,
\end{aligned}$$

because the bracket's square is
$2(\hat n\cdot\hat n)(\dot{\hat n}\cdot\dot{\hat n}) + 2(\hat n\cdot\dot{\hat n})^2 = 2\Omega^2$. The two horizons
then absorb $5.1\times10^{38}$ W. The magnetic part adds $(v/c)^2 = 4\%$ (stated), where $v = \Omega d = 0.2c$ is the
speed of one hole seen from the other. The pair radiates $1.5\times10^{45}$ W in waves: section 7.7's
$\tfrac85G\matter M^2d^4\Omega^6/c^5$ for two equal masses becomes $\tfrac{64}{5}G^4\matter M^5/c^5d^5$ with
$\Omega^2 = 2G\matter M/d^3$. The ratio of the electric part, $3.3\times10^{-7}$, is exactly $2(G\matter M/c^2d)^4$,
so tidal heating matters only when the holes are close.

**Where it comes from** (a sketch, depth B). The absorbed energy grows the horizon's area $A$. Section
[11.2](/tutorial/black-holes/spin/#the-area-of-a-horizon-never-shrinks-so-spin-holds-energy-that-can-be-taken-out)'s
first law, for a hole that does not spin, reads $\dd(\matter Mc^2) = (c^6/32\pi G^2\matter M)\,\dd A$. A changing tide
shears the bundle of light rays that make up the horizon, and by the focusing law behind 11.2's area theorem a shear
makes the area grow at a rate set by its square. Hawking and Hartle (1972) found the horizon friction this way.

**The idea, carried to the form.** Write $\sigma$ for the rate, in $\mathrm{s^{-1}}$, at which the tide shears the
horizon's rays, and $\theta = \dot A/A$ for the rate at which their bundle spreads. For the horizon of a hole that
does not spin, Raychaudhuri's equation for these rays reads $\dot\theta = (c/2r_s)\,\theta - \sigma^2$ (stated), the
rate $c/2r_s$ being set by the horizon's surface gravity. Its solution that stays bounded in the future, for a shear
that changes slowly against the time $2r_s/c$, is $\theta = 2r_s\sigma^2/c$. A steady tide shears nothing, so $\sigma$ is
of order $r_s^2|\dot{\curv\tE}|/c^2$, the only rate that $r_s$, $c$ and the tide's rate of change make. The first law
above then gives the power

$$\frac{c^6}{32\pi G^2\matter M}\,\dot A = \frac{c^6}{32\pi G^2\matter M}\cdot\frac{2r_s\sigma^2}{c}\cdot4\pi r_s^2 =
\frac{c^3r_s^2\sigma^2}{2G} ,$$

using $\matter M = r_sc^2/2G$, and with the estimate of $\sigma$ it is of order $r_s^6\dot{\curv\tE}^2/Gc$. That is
$\nu$'s form, since $\matter Mr_s^5/c^3 = r_s^6/2Gc$, and the sketch leaves only the number: $\nu = r_s^6/180\,Gc$, so
for an electric tide the shear's root mean square over the horizon is $r_s^2|\dot{\curv\tE}|/\sqrt{90}\,c^2$, with
$|\dot{\curv\tE}|^2 = \dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}$.

::: gap
This sketch states Raychaudhuri's equation and skips the equation for the shear of the horizon's rays, which turns the
estimate of $\sigma$ into the number $\tfrac{16}{45}$. Poisson (2004) gives both. The number is also fixed, without
the horizon, by the scattered wave ([below](#the-same-friction-absorbs-long-gravitational-waves)).
:::

## The hole's quadrupole answers a tide with friction alone

A changing tide, unlike a steady one, raises an $r^{-3}$ reply on a hole: a quadrupole that lags a quarter of a cycle
behind the tide's stretch.

**The definition.** We define **the hole's quadrupole** $\sym{hole-quadrupole}{\matter Q}_{ij}$, in
$\mathrm{kg\,m^2}$, by its energy in a tide, $\matter Q_{ij}\curv\tE_{ij}$. We want what this means for a body.
Near the body the tide's potential is $\tfrac12\curv\tE_{ij}x_ix_j$ (section 2.3), so the body's energy in it is

$$\int\matter\rho\,\tfrac12\curv\tE_{ij}x_ix_j\,\dd V = \curv\tE_{ij}\cdot\tfrac12\int\matter\rho\,x_ix_j\,\dd V .$$

A tide in empty space has no trace, so we may subtract $\tfrac13r^2\delta_{ij}$ inside the integral. So

$$\boxed{\;\matter Q_{ij} = \tfrac12\int\matter\rho\,\bigl(x_ix_j - \tfrac13r^2\delta_{ij}\bigr)\,\dd V\;} .$$

| Name | Integral | Times the hole's $\matter Q_{ij}$ |
|---|---|---|
| section 2.3's quadrupole | $\int\matter\rho\,(3x_ix_j - r^2\delta_{ij})\,\dd V$ | 6 |
| Newton's trace-free moment | $\int\matter\rho\,(x_ix_j - \tfrac13r^2\delta_{ij})\,\dd V$ | 2 |
| The hole's quadrupole | $\tfrac12\int\matter\rho\,(x_ix_j - \tfrac13r^2\delta_{ij})\,\dd V$ | 1 |

So the hole's quadrupole is half of Newton's and a sixth of 2.3's, and from here on we use only it. **Why
this one:** a moment defined by its energy comes with its push, so Part 4's formulas for power and noise apply to it
with no extra factor. **How it would be measured:** by the extra potential far away, $-3G\matter Q_{ij}x_ix_j/r^5$.
**An example:** two masses $m$ at $z = \pm a$ have $\matter Q_{zz} = \tfrac23ma^2$. **A non-example:** a round body
has $\matter Q_{ij} = 0$, though its $\int\matter\rho\,x_ix_j\,\dd V$ is not zero.

**The friction as a response** (depth A). We want $\matter Q_{ij}$'s reply to a tide at the angular frequency
$\omega$. The energy $\matter Q_{ij}\curv\tE_{ij}$ has section 4.6's form $-fy$ for each entry, with the push
$f = -\curv\tE_{ij}$. We assume that **the hole is round**, so one response $\sym{response-function}{\chi}(\omega)$,
4.5's, serves all five entries: in phasors, $\tilde{\matter Q}_{ij} = -\chi\,\tilde{\curv\tE}_{ij}$. Section
[4.1](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push)'s average
power, summed over the entries, is

$$\bar P = \tfrac12\,\omega\,\mathrm{Im}\,\chi\,\tilde{\curv\tE}_{ij}\tilde{\curv\tE}^*_{ij} .$$

The electric half of [](#eq:friction) is
$\nu\langle\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}\rangle$, where $\langle\;\rangle$ is an average over a cycle, as in
section 7.8. By 4.1's average of a product, $\tfrac12\mathrm{Re}[a^*b]$ with $a = b = -i\omega\tilde{\curv\tE}_{ij}$,
it is $\tfrac12\nu\omega^2\tilde{\curv\tE}_{ij}\tilde{\curv\tE}^*_{ij}$. Setting the two equal gives

$$\boxed{\;\mathrm{Im}\,\chi = \nu\omega\;} .$$

**Units:** $\chi$ is $\matter Q$ per tide, $\mathrm{kg\,m^2\,s^2}$, and $\nu\omega$ is $\mathrm{J\,s^5}$ times
$\mathrm{s^{-1}}$, the same.

**No real part.** Section
[4.5](/tutorial/response/causality/#a-linear-response-adds-up-the-answers-to-every-earlier-push) showed that
$\mathrm{Re}\,\chi$ is even in $\omega$, so near zero it is $\mathrm{Re}\,\chi(0)$ plus a term in $\omega^2$, with no
term in $\omega$. The [steady tide](#a-steady-tide-raises-no-bulge-on-a-hole) gave $\mathrm{Re}\,\chi(0) = 0$. So at
first order in $\omega$, the order of the friction law, the response has no real part, no elastic
part. The Love number and the friction are thus the real and imaginary parts of one response. The real part, the reply
in step with the tide that stores its work and gives it back, is zero. The imaginary part, the reply a quarter cycle
behind that keeps the work, is $\nu\omega$. A horizon can drag on a tide but cannot spring back, because nothing comes
back out through it, so the hole can only absorb. The magnetic part meets the same friction through the hole's current
quadrupole, 7.5's moment of a flow (stated; Goldberger and Rothstein [@GoldbergerRothstein2006]).

**In time.** A response $\chi = i\nu\omega$ multiplies each frequency of the push by $i\omega\nu$, which is $-\nu$
times a rate of change, since a rate of change multiplies a phasor by $-i\omega$. With the push $-\curv\tE_{ij}$ the
reply is

$$\matter Q_{ij}(t) = \nu\,\dot{\curv\tE}_{ij}(t) .$$

The power the tide gives the hole is then, on average,
$\matter Q_{ij}\dot{\curv\tE}_{ij} = \nu\dot{\curv\tE}_{ij}\dot{\curv \tE}_{ij}$, as it should be. Section 4.6's push
$f = -\curv\tE_{ij}$ works at 4.1's rate $f\dot y = -\curv\tE_{ij}\dot{\matter Q}_{ij}$, which differs from it by the
rate of change of $\curv\tE_{ij}\matter Q_{ij}$, so the two agree on average. **A number:** in
the pair, each tide's turning entry $\curv\tE_{xx}$ swings by $\tfrac32G \matter M/d^3 = 561\unit{s^{-2}}$ at
$2\Omega$, so each hole's quadrupole swings by $\nu\cdot2\Omega\cdot561\unit{s^{-2}} = 4\times10^{33}\unit{kg\,m^2}$,
nine billionths of $\matter Mr_s^2$. **Meaning:** the hole's shape follows the tide's rate of change, so it stores
none of the tide's work and keeps all of it.

**A turning hole** (a sketch). A tide that is steady far away but not symmetric about the spin axis, with the pattern
$e^{im\varphi}$ and $m \ne 0$, turns backward at $\Omega_H$ as seen from the turning horizon, which therefore meets it
at the frequency $-m\Omega_H$ ([section 11.2](/tutorial/black-holes/spin/#a-hole-amplifies-a-wave-that-turns-with-it-more-slowly-than-its-horizon)).
The horizon answers the frequency it meets: 11.2's long-wave share $\Gamma_{\ell m}$ holds the factor $\omega -
m\Omega_H$, so for a slowly turning hole the friction law becomes

$$\mathrm{Im}\,\chi \approx \nu\,(\omega - m\Omega_H) ,$$

which at $\omega = 0$ is $-m\nu\Omega_H$. A steady tide then raises a moment a quarter of the pattern's period out of
step with it, carried ahead in the sense of the spin, as the Earth's turning carries its tidal bulge ahead of the Moon,
and the real part, the moment in step, is still zero. The torque between that moment and the tide slows the hole's
spin. For $0 < \omega < m\Omega_H$ the same $\mathrm{Im}\,\chi$ is negative: the hole gives energy to the tide, which is
11.2's superradiance seen in the near field.

## The same friction absorbs long gravitational waves

We want the limit that the friction sets for the absorption of a quadrupole wave, $(16/5)G\nu \omega^6/c^5$. We assume that **the wave is long**, $G\matter M\omega/c^3 \ll 1$, so that the hole sits in
a tide that is the same across it and changes slowly.

**The power.** A plus wave along $z$ with strain $\field h_{xx} = -\field h_{yy} = \field h\cos\omega t$, of amplitude
$\field h$, has section 7.6's tide $\curv\tE_{ij} = -\tfrac12\ddot{\field h}_{ij}$, so
$\curv\tE_{xx} = -\curv\tE_{yy} = \tfrac12\omega^2\field h\cos\omega t$. Then
$\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij} = 2(\tfrac12\omega^3\field h\sin \omega t)^2$, whose average is
$\tfrac14\omega^6\field h^2$. In a wave the magnetic part is the tide turned by $45°$ (section
[7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)), so it adds the
same. The hole absorbs

$$\bar P = \tfrac12\,\nu\,\omega^6\field h^2 .$$

**The flux** (recalled from section
[7.8](/tutorial/geometry/wave-energy/#the-heat-comes-from-the-wave-so-the-wave-carries-energy)). There the energy that
crosses each square metre each second came out as
$F = (c^3/16\pi G)\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\rangle$. Our wave has
$\langle\dot{\field h}_+^2\rangle = \tfrac12\omega^2\field h^2$, so $F = c^3\omega^2\field h^2/32\pi G$.

**The cross-section.** The **absorption cross-section** is the area through which the wave brings the power the hole
absorbs, $\sym{absorption-cross-section}{\sigma_{\rm abs}} = \bar P/F$, in square metres (11.3's letter):[^sigma]

$$\boxed{\;\sigma_{\rm abs} = \frac{16\pi G\nu\,\omega^4}{c^3}\;} .$$

**Units:** $\mathrm{m^3\,kg^{-1}\,s^{-2}}\times\mathrm{kg\,m^2\,s^3}\times\mathrm{s^{-4}}$ over $\mathrm{m^3\,s^{-3}}$
is $\mathrm{m^2}$.

**Partial waves** (a sketch, depth B). A plane wave holds waves of every degree $\ell$ round the hole, its **partial
waves**. Section 11.3 used them to write

$$\sigma_{\rm abs} = \frac{\pi c^2}{\omega^2}\sum_{\ell\ge2}(2\ell + 1)\,\sym{greybody-factor}{\Gamma_\ell} ,$$

where the **greybody factor** $\Gamma_\ell(\omega)$ is the share of the partial wave of degree $\ell$ that the hole
absorbs.[^Gamma] For long waves $\Gamma_\ell$ falls as $(G\matter M\omega/c^3)^{2\ell + 2}$ (section 11.3's long-wave
form), so only $\ell = 2$ counts. With $\sigma_{\rm abs} = (5\pi c^2/\omega^2)\Gamma_2$,

$$\boxed{\begin{aligned}
\Gamma_2 &= \frac{16}{5}\,\frac{G\nu\,\omega^6}{c^5}\\
&= \frac{256}{225}\Bigl(\frac{G\matter M\omega}{c^3}\Bigr)^6
\end{aligned}} ,$$

where the second form puts in $\nu = \tfrac{16}{45}G^5\matter M^6/c^{13}$:
$\tfrac{16}{5}\times\tfrac{16}{45} = \tfrac{256}{225}$. This is **Page's limit** (Don Page, 1976 [@Page1976]).

::: derivation
### Why the weights are $2\ell + 1$

For a wave without spin, a plane wave of wavenumber $k = \omega/c$ far from the origin is a sum over degrees, each an
incoming and an outgoing spherical wave (stated; Rayleigh's expansion):

$$e^{ikz} \approx \sum_\ell\frac{2\ell + 1}{2ikr}\bigl[e^{ikr} - (-1)^\ell e^{-ikr}\bigr]P_\ell(\cos\vartheta) .$$

The incoming part of degree $\ell$ carries power in proportion to its squared amplitude over the sphere. Section
[2.2](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them)
gives $\int_{-1}^1P_\ell^2\,\dd\mu = 2/(2\ell + 1)$ with $\mu = \cos\vartheta$, and the turn round the axis adds a
factor $2\pi$, so the integral over the sphere is $4\pi/(2\ell + 1)$. The power is

$$\frac{(2\ell + 1)^2}{4k^2r^2}\,r^2\,\frac{4\pi}{2\ell + 1} = \frac{\pi(2\ell + 1)}{k^2}$$

times the plane wave's flux. So degree $\ell$ brings in what crosses an area $\pi(2\ell + 1)/k^2$, and the hole takes
the share $\Gamma_\ell$ of it.
:::

::: gap
This sketch derives the weights for a wave without spin. It states that a gravitational wave of one helicity (one
whose pattern of stretch turns one way as it passes, section 5.4's circular polarization) has the same weights,
starting at $\ell = 2$. A plus wave is the sum of two helicities, and a hole that does not spin takes the same share
of each.
:::

**The same number.** Section [11.3](/tutorial/black-holes/hawking/#mode-by-mode-a-hole-is-a-grey-body) found $\Gamma_2$
another way, by solving the Regge–Wheeler equation for a wave scattered off the hole. With $x = G\matter M\omega/c^3$
(local, as in 11.3)[^x], its $\Gamma_2$ is 1.013 times Page's form at $x = 0.002$ and 1.070 times at $x = 0.01$, and the
excess shrinks in proportion to $x$, as about $2\pi x$. So the friction found from the growth of the horizon and the
absorption found from scattering are one number (Figure [](#fig:friction-to-gamma)). **Number:** at
$x = 0.01$ the hole absorbs about $1.2\times10^{-12}$ of the quadrupole part of a wave. Long waves pass a hole almost
untouched.

![Look first at the bottom panel's two lines: the friction's Page line and the scattered wave's $\Gamma_2$ meet as the
waves grow long. The chain above is the derivation; the curves are
exact.](tut-friction-to-gamma){#fig:friction-to-gamma}

**The number, read backward.** The chain also runs the other way. Section 11.3's
[step-by-step integration](/tutorial/black-holes/hawking/#integrated-step-by-step-the-regge-wheeler-equation-gives-every-greybody-factor) of the Regge–Wheeler equation, which knows nothing of friction, gives $\Gamma_2/x^6 \to 256/225 = 1.138$ as $x \to 0$, and the
boxed relation then fixes the friction:

$$\nu = \frac{5c^5}{16G\omega^6}\,\Gamma_2 \to \frac{5c^5}{16G\omega^6}\cdot\frac{256}{225}\Bigl(\frac{G\matter
M\omega}{c^3}\Bigr)^6 = \frac{16}{45}\,\frac{G^5\matter M^6}{c^{13}} .$$

So Poisson's $\tfrac{16}{45}$ is also the number that the scattered wave requires. **The magnetic half.** The
Regge–Wheeler wave has the axial parity, which a hole meets through its current quadrupole and so through the magnetic
part of the tide; Zerilli's wave, of the other parity, meets it through the mass quadrupole and the electric part. A
plane wave's part of degree two is half of each, so each half of [](#eq:friction) answers one parity, and since
Chandrasekhar (1975) showed that the two equations give the same $\Gamma_\ell$ (stated), the same $\nu$ multiplies
$\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}$ and $\dot{\curv\tB}_{ij}\dot{\curv\tB}_{ij}$.

## At every frequency the friction is the greybody factor

Beyond the slow end Page's limit fails. There the hole's dissipative part is fixed by
$\Gamma_2$, the share of a quadrupole wave that the hole absorbs.[^weight] Goldberger and Rothstein
[@GoldbergerRothstein2020] make this a definition: the hole is a point whose quadrupole carries all that it absorbs
of degree two. The quadrupole's power in the plus wave, electric and magnetic parts together, is then
$\tfrac12\omega\,\mathrm{Im}\,\chi$ times
$\tilde{\curv\tE}_{ij}\tilde{\curv\tE}^*_{ij} + \tilde{\curv\tB}_{ij}\tilde {\curv\tB}^*_{ij} = \omega^4\field h^2$,
or $\tfrac12\omega^5\field h^2\,\mathrm{Im}\,\chi$. The degree two absorbs
$(5\pi c^2/\omega^2)\Gamma_2F = 5c^5\Gamma_2\field h^2/32G$. Setting the two equal gives

$$\boxed{\;\mathrm{Im}\,\chi(\omega) = \frac{5c^5\,\Gamma_2(\omega)}{16\,G\omega^5}\;} ,$$

**Limit:** with Page's $\Gamma_2$ it is
$(5c^5/16G\omega^5)(16G\nu\omega^6/5c^5) = \nu\omega$, the
[friction found above](#the-holes-quadrupole-answers-a-tide-with-friction-alone) (Figure [](#fig:hole-imchi)). Section
[13.7](/tutorial/what-a-field-keeps/thermometer/#a-holes-response-has-the-weight-of-a-shell-a-little-outside-its-horizon)
follows this response to every frequency and weighs it.[^split]

![Look first at the left, where the solid curve, $5c^5\Gamma_2/16G\omega^5$, meets the dashed friction law $\nu\omega$:
that is the box's limit. To the right the law fails, because the waves are no longer long against the hole. Curves
exact.](tut-hole-imchi){#fig:hole-imchi}

## Whatever the tide, what a hole gives back is set by its mass and spin

A stone's replies to tides read its interior: its Love numbers of every degree, its density through the fast end of
its response, its density again through the energy a passing mass loses to it
([section 13.1](/tutorial/what-a-field-keeps/push-and-pass/#the-passers-loss-of-energy-holds-every-moment-of-the-projected-body)),
and its flow through two short tides applied in either order
([section 13.4](/tutorial/what-a-field-keeps/flows-inside/#the-bracket-of-two-rates-is-an-integral-of-the-flow)). A
hole's replies all come from one kind of calculation. Its field is Kerr's, fixed by its mass
$\matter M$ and its angular momentum $\sym{hole-angular-momentum}{\matter J}$ (section 11.2), and a tide on it is a
small change of that field, which obeys Einstein's equation for empty space expanded about Kerr's field: the
Regge–Wheeler and Zerilli equations without spin, Teukolsky's with it, and at higher order equations of the same kind.
The only other condition is that nothing come out of the horizon, and it is the same for every hole. None of these
holds anything but $G$, $c$, $\matter M$, $\matter J$ and the tide itself, since the horizon hides whatever made the hole.

So a tide of degree $\ell$ and order $m$ at the frequency $\omega$ is answered through $\Gamma_{\ell m}(\omega)$, with
no static part when the hole does not turn, and tides of every degree up to any $\ell$ return $\Gamma_2$ to
$\Gamma_\ell$, each fixed by $\matter M$ and $\matter J$: nothing more. A mass that passes loses to the hole the share
$\Gamma_{\ell m}$ of each part of its tide's spectrum, an amount set by its path and by $\matter M$ and $\matter J$; for a
slow pass by a hole that does not turn it is the friction's $\nu\int(\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij} + \dot{\curv\tB}_{ij}\dot{\curv\tB}_{ij})\,
\dd t$, fixed by $\matter M$ alone. Two tides in either order come from the same equations taken to second order, and
they too return nothing more. **Meaning:** a camera that pushes on a hole with tides of any shape and timing learns
its mass and spin again, and nothing of what fell in.

## The friction trembles at the hole's temperature

We want the trembling of the hole's quadrupole . Section
[4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency)'s
theorem says that a reading $y$ of a body at temperature $T$, with its conjugate push, trembles with the spectrum
$S_{yy} = (2\kB T/\omega)\,\mathrm{Im}\,\chi_{yy}$. We assume that **the hole is at its Hawking temperature**
$\sym{hawking-temperature}{T_H}$, with $\kB T_H = \hbar c^3/8\pi G\matter M$ (section 11.3), as a hole formed by
collapse and left alone is, and that **the classical theorem holds**, which we check below.

Each of the five entries of $\matter Q_{ij}$, in section 1.5's orthonormal basis, has the push $-\curv\tE$ and the
response $\chi$ [found above](#the-holes-quadrupole-answers-a-tide-with-friction-alone). With
$\mathrm{Im}\,\chi = \nu\omega$ its spectrum, the hole's **quadrupole noise**, is the same at every frequency, a
**flat spectrum** (section 3.2's white noise):

$$\boxed{\;\sym{quadrupole-noise}{S_Q} = 2\kB T_H\,\nu = \frac{\hbar r_s^5}{360\pi G}\;} ,$$

since $2(\hbar c^3/8\pi G\matter M)(\matter Mr_s^5/90c^3) = \hbar r_s^5/360\pi G$. The entries are correlated through $\sym{stf-projector}{\Pi_{ijkl}}$, section 1.5's projector, which says that the
five independent trace-free combinations of $\matter Q_{ij}$ tremble alike and independently:[^noise]

$$\begin{gathered}
\langle\matter Q_{ij}(t)\,\matter Q_{kl}(0)\rangle = \Pi_{ijkl}\int S_Q\,e^{-i\omega t}\,\frac{\dd\omega}{2\pi},\\
S_Q = \frac{\hbar\,r_s^5}{360\pi G} ,
\end{gathered}$$

**Units:** $\hbar r_s^5/G$ is $\mathrm{J\,s\,m^5}$ over $\mathrm{m^3\,kg^{-1}\,s^{-2}}$, or $\mathrm{kg^2\,m^4\,s}$, a
squared quadrupole per hertz. **Limit:** as $\hbar \to 0$ the noise vanishes, as it must for 11.1's classical hole,
which is at absolute zero. **Number:** for the hole of $1.356\times10^{23}$ kg, $S_Q = 4.6\times10^{-46} \unit{kg^2\,m^4\,s}$.
Averaged over one second, each entry trembles by $\sqrt{S_Q/1\unit s} = 2.2\times10^{-23} \unit{kg\,m^2}$, about
$4\times10^{-39}$ of $\matter Mr_s^2$.

**At the pixel.** On a line $z$ through the hole, the quadrupole's potential is $-3G\matter Q_{zz}/z^3$, and
differentiating twice gives the tide $\curv\tE_{zz} = -36G\matter Q_{zz}/z^5$. The entry $\matter Q_{zz}$ trembles by
$\sqrt{\Pi_{zzzz}} = \sqrt{2/3}$ of the amount above, $1.8\times10^{-23}\unit{kg\,m^2}$ in a second. So, averaged over
a second, the tide a metre away trembles by $4\times10^{-32}\unit{s^{-2}}$, where the hole's steady tide
$2G\matter M/r^3$ is $1.8\times10^{13}\unit{s^{-2}}$.

**Why the classical form.** Section
[8.7](/tutorial/quantum/quantum-fluctuation/#the-tremor-at-each-frequency-is-hbarcothhbaromega2k_bt-times-the-friction-there)'s
quantum theorem has $\hbar\coth(\hbar\omega/2\kB T)$ in place of $2\kB T/\omega$. The two agree when
$\hbar\omega \ll \kB T_H$, which is $x \ll 1/8\pi = 0.04$, since $\hbar\omega/\kB T_H = 8\pi x$. Below that the
friction law holds too, within 7% at $x = 0.01$.

**Not independent.** The spectrum was found by matching to Hawking's radiation (section 11.3), so
the trembling holds no new fact about the hole. Read the other way, section
[4.6](/tutorial/response/fluctuation-dissipation/#a-push-shaped-like-the-reading-makes-a-thermometer-that-needs-no-model-of-the-body)'s
thermometer divides the noise by the friction and returns $T_H$:

$$T_H = \frac{S_Q}{2\kB\,\nu} = \frac{\hbar c^3}{8\pi G\matter M\kB} ,$$

What it confirms is the [long-wave result](#the-same-friction-absorbs-long-gravitational-waves): the friction and the
absorption are one number. A camera beside the hole reads that temperature without absorbing
any quantum of the radiation. The tremor also carries nothing new: a stone's tremor carries its whole interior, and a
hole's carries only $\matter M$ again. Section
[13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)
reads this thermometer.

::: history
### From the Earth's rock to the horizon

A. E. H. Love introduced his numbers in 1909 for the yielding of the solid Earth. S. W. Hawking and J. B. Hartle found
the tidal growth of a horizon in 1972, D. N. Page the absorption of long waves in 1976, and E. Poisson the friction's
present form in 2004. The zero Love numbers were shown in 2009.
:::

::: try {#tidal-friction}
On the left, a body in the tide of a moon that circles it: the Earth, not spinning, or a hole, chosen with the switch
under the panels. On the right, against the tide's frequency $x = G\matter M\omega/c^3$, the hole's response: the
friction law $\nu\omega$ dashed, and the response computed from section 11.3's greybody factor solid, with a dot at
the moon's tide. The readouts give the hole's $\nu$, the moon's $x$, the power the hole takes and its share of what
the pair radiates in waves.

Predict first: under the same moon, which body bulges, and which takes energy from the tide? Then choose the hole and
drag the moon's distance in from $10^4\,r_s$. At about what distance does the dot leave the dashed line, so that the
friction law fails? Will the answer change when you drag the hole's mass?
:::

**The idea to keep: a hole that does not turn keeps no static moment, so its Love numbers are zero, but a changing
tide loses energy through its horizon at the rate
$\nu(\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij} + \dot{\curv\tB}_{ij} \dot{\curv\tB}_{ij})$, with
$\nu = \matter Mr_s^5/90c^3$. That one friction is the hole's whole reply, a response with no real part; it is also
the absorption of long waves, Page's $(256/225)(G\matter M\omega/c^3)^6$, and, at the Hawking temperature, the flat
tremor $S_Q = 2\kB T_H\nu$.**

::: problems
### Practice

**[11.4]** Find $\nu$, $T_H$ and $S_Q$ for a hole of ten solar masses ($1.99\times10^{31}$ kg), and check $S_Q = 2\kB T_H\nu$.

::: solution
$\nu = \tfrac{16}{45}G^5\matter M^6/c^{13} = 1.8\times10^{26}\unit{J\,s^5}$, $T_H = 6.2\times10^{-9}$ K and
$S_Q = \hbar r_s^5/360\pi G = 3.1\times10^{-5}\unit{kg^2\,m^4\,s}$ with $r_s = 29.5$ km. Then
$2\kB T_H\nu = 2 \times 1.38 \times10^{-23}\times6.2\times10^{-9}\times1.8\times10^{26} = 3.1\times10^{-5}$, the same.
:::

**[11.4]** Why does a black hole that does not turn have $k_2 = 0$?

::: solution
The only static tide that stays finite at its horizon is $H = r(r - r_s)$, which has no part falling as $r^{-3}$. So
the tide raises no moment.
:::

**[11.4]** A slowly turning hole sits in the steady tide of a distant moon that does not orbit it. Which patterns of
that tide raise a moment on the hole, and does the moment store the tide's work or keep it?

::: solution
Only the parts with $m \ne 0$, which the horizon meets at the frequency $-m\Omega_H$; the part symmetric about the axis
($m = 0$) is steady to the horizon too and raises nothing. The moment comes from $\mathrm{Im}\,\chi = -m\nu\Omega_H$
alone, so it is a quarter of the pattern's period out of step and stores nothing; its torque takes angular momentum
from the hole's spin.
:::

### Stretch

**[11.4]** With section [4.5](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums)'s
fast-end sum, show that a response with $\mathrm{Im}\,\chi = \nu\omega$ at every frequency could not belong to any
body, and say what saves the hole.

::: solution
Section 4.5's fast-end sum $(2/\pi)\int_0^\infty\omega\,\mathrm{Im}\,\chi\,\dd\omega$ is finite for every body: it
is the inertia that the push must move. With $\mathrm{Im}\,\chi = \nu\omega$ the integrand is $\nu\omega^2$, and
the integral grows without limit. The hole's response follows the greybody factor instead, and above
$G\matter M\omega/c^3 \approx 0.5$ it falls as $\omega^{-5}$, so the sum is finite. Section
[13.7](/tutorial/what-a-field-keeps/thermometer/#a-holes-response-has-the-weight-of-a-shell-a-little-outside-its-horizon)
computes it.
:::

**[11.4]** Show that with $z = 2r/r_s - 1$ Hinderer's equation becomes $(1 - z^2)H'' - 2zH' + [6 - 4/(1 - z^2)]H =
0$, with a prime a derivative in $z$, and check that $H = z^2 - 1$ solves it.

::: solution
With $r = r_s(z + 1)/2$, $r(r - r_s) = r_s^2(z^2 - 1)/4$, $2r - r_s = r_sz$ and $\dd/\dd r = (2/r_s)\,\dd/\dd z$. The
three terms become $(4/r_s^2)H''$, $(8z/r_s^2)H'/(z^2 - 1)$ and $-[24(z^2 - 1) + 16]H/r_s^2(z^2 - 1)^2$. Multiplying
by $-r_s^2(z^2 - 1)/4$ gives the form shown. For $H = z^2 - 1$: $(1 - z^2)\cdot2 - 2z\cdot2z + 6(z^2 - 1) + 4 = 0$.
:::

### The camera

**[11.4]** After a slow tide a hole weighs $\nu\int(\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij} +
\dot{\curv\tB}_{ij}\dot{\curv\tB}_{ij})\,\dd t$ more. How much mass do the two holes of the pair gain in one second at
2200 km? Then show that $\mathrm{Im}\,\chi = 5c^5\Gamma_2/16G\omega^5$ and $\mathrm{Im}\,\chi = \nu\omega$ together give
Page's $\Gamma_2 = 16G\nu\omega^6/5c^5$.

::: solution
The two absorb $5.1\times10^{38}$ W, so in one second they gain $5.1\times10^{38}\unit J/c^2 = 5.6\times10^{21}$ kg,
about $3\times10^{-9}$ solar masses. Setting $5c^5\Gamma_2/16G\omega^5 = \nu\omega$ gives
$\Gamma_2 = 16G\nu\omega^6/5c^5$.
:::
:::

::: paper
- [Section XIV](/paper/#sec:hole): the zero Love numbers, the friction [](/paper/#eq:horizon-friction), the quadrupole,
  $\mathrm{Im}\,\chi = \nu\omega$ and the limit $(16/5)G\nu\omega^6/c^5$; the noise [](/paper/#eq:hole-noise) and
  thermometer [](/paper/#eq:hole-thermometer); $\mathrm{Im}\,\chi = 5c^5\Gamma_2/16G\omega^5$. Section
  [13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)
  reads the thermometer and
  [](/paper/#eq:hole-sum-rule) and Figure [](/paper/#fig:hole-response).
- Table [](/paper/#tab:hair)'s hole column, [Section XI](/paper/#sec:vistas)'s Page limit and [Section
  XV](/paper/#sec:holography)'s weight after a slow tide.
:::

::: deeper
- E. Poisson [@Poisson2004] derives $\nu$ and its $\tfrac{16}{45}$; T. Binnington and E. Poisson
  [@BinningtonPoisson2009] and T. Damour and A. Nagar [@DamourNagar2009] the zero Love numbers.
- W. D. Goldberger and I. Z. Rothstein [@GoldbergerRothstein2006; @GoldbergerRothstein2020] treat the hole as a point
  with a quadrupole that answers and trembles.
- D. N. Page [@Page1976] computes the greybody factors of long waves. The GR course's section
  [22.9](https://neovand.github.io/general-relativity/chapter-22.html#22-9-classical-area-increase-with-the-assumptions-visible)
  proves that the area the friction grows never shrinks.
:::

[^sign]: A negative $\curv\tE_{zz}$ stretches along $z$, and the body grows longer along $z$. In the Moon's tide, $\curv\tE_{zz} =
    -1.7\times10^{-13}\unit{s^{-2}}$ along the line to the Moon, and the Earth's moment gains
    $+2.7\times10^{30}\unit{kg\,m^2}$ in its $zz$ entry.

[^nu]: Here $\nu$ is not a frequency, which stays $\omega$; the letter $f$ is the push.

[^table]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XII](/paper/#sec:hair), whose Table
    [](/paper/#tab:hair) sets a stone against a hole, and [Sec. XIV](/paper/#sec:hole).

[^fric]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XIV](/paper/#sec:hole), as its equation
    [](/paper/#eq:horizon-friction); the pair of holes is from [Sec. XI](/paper/#sec:vistas).

[^weight]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XIV](/paper/#sec:hole), under *The weight
    of a black hole's response*.

[^noise]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XIV](/paper/#sec:hole), as its equations
    [](/paper/#eq:hole-noise) and [](/paper/#eq:hole-thermometer).

[^sigma]: Never a bare $\sigma$, which in Part 3 is a surface density.

[^Gamma]: Not 4.1's damping rate $\Gamma$ or 7.1's Christoffel symbols.

[^x]: Not 10.1's $\hbar\omega/\kB T$, which is $8\pi x$ at the hole's temperature.

[^split]: Section 13.7 derives the sum
    $0.345\,\matter Mr_s^2$, the shells, the failed positivity test and the Love number 1.35.
