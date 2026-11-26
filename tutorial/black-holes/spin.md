---
id: '11.2'
title: 'Spin, no hair, superradiance'
question: 'A black hole at rest shows only seven numbers, and a spinning hole amplifies the waves that turn with it, by up to $138\%$. What does the outside of a spinning hole show, why is it so little, and how can a hole give energy to a wave?'
part: '11'
requires: ['1.6', '2.3', '3.8', '7.5', '8.3', '11.1']
paper: [sec:hair, eq:hair-bits, fig:hair, tab:hair, sec:no-lens, sec:vistas, sec:one-pixel, sec:hole, sec:holography]
figures: [fig:hair]
live: [spin-and-gain]
depth: A
---

The gravity outside a black hole that has settled down shows only its mass, its spin and its electric charge: in the
physicists' saying, a black hole has no hair. A stone's field at one time shows the harmonic moments of its mass and its
flow, whereas a hole at rest shows seven numbers. A rapidly spinning hole does something stranger still: it reflects
some waves with gain, by up to $138\%$.[^hair] What does the outside of a spinning hole show, why is it so little, and
how can a hole give energy to a wave?

::: plain
A black hole can spin, and its spin has a ceiling: a hole of a given mass cannot turn faster than a certain rate, or it
would have no horizon, the surface from inside which nothing can escape.

Once a hole has settled down, its outside shows its mass, its spin and its electric charge, and nothing else about what
fell into it. For a hole without charge, at rest, this is seven numbers: one for the mass, three for the spin (its rate
and its axis) and three for its place.

The area of a horizon can never shrink, and this rule sets how much energy a hole keeps in its spin: up to 29% of its
mass. A wave that circles the hole in the same direction, but more slowly than the horizon turns, takes some of that
energy and leaves stronger than it came. This is superradiance.
:::

## A spinning hole adds its spin to its mass, and the spin has a ceiling

We want the field outside a spinning black hole, because a hole that forms from a turning star keeps its turning.
The new quantity is the hole's **angular momentum** $\sym{hole-angular-momentum}{\matter J}$, section
[1.6](/tutorial/newton/motion/#angular-momentum-stays-fixed-when-the-force-points-at-a-centre)'s quantity, which 7.5
wrote $\vect L$, in $\mathrm{kg\,m^2\,s^{-1}}$ and along the axis of turning.[^J] Dividing it by the mass and by $c$
gives **Kerr's spin parameter**

$$\sym{kerr-parameter}{a} = \frac{\matter J}{\matter Mc} ,$$

a length, since $\mathrm{kg\,m^2\,s^{-1}}$ over $\mathrm{kg\,m\,s^{-1}}$ is a metre. It is section 9.3's $a$, which
wrote the angular momentum as $\matter Mca\,\hat z$. Its ratio to the hole's natural length $G\matter M/c^2$ is the
**dimensionless spin** $\sym{dimensionless-spin}{\chi} = ac^2/G\matter M = c\matter J/G\matter M^2$, a pure number.[^chi]

**Kerr's metric.** We assume that **the field is stationary** (unchanged in time, though not under time reversal,
because the hole turns), **symmetric about the axis of spin**, **empty outside the hole** and **flat far away**. Roy
Kerr found such a field in 1963 [@Kerr1963]. We state it without proof, in the coordinates of Boyer and Lindquist, with
$\vartheta$ the angle from the spin axis, $\varphi$ the angle round it, 11.1's $r_s = 2G\matter M/c^2$, and two lengths
squared, $\Sigma = r^2 + a^2\cos^2\vartheta$ and $\Delta = r^2 - r_sr + a^2$:[^r]

$$\begin{aligned}
\dd s^2 = {}&-\Bigl(1 - \frac{r_sr}{\Sigma}\Bigr)c^2\dd t^2\\
&- \frac{2r_sar\sin^2\vartheta}{\Sigma}\,c\,\dd t\,\dd\varphi\\
&+ \frac{\Sigma}{\Delta}\,\dd r^2 + \Sigma\,\dd\vartheta^2\\
&+ \frac{(r^2 + a^2)^2 - a^2\Delta\sin^2\vartheta}{\Sigma}\,\sin^2\vartheta\,\dd\varphi^2 .
\end{aligned}$$

With $x^0 = ct$ its entries are $\field g_{00} = -(1 - r_sr/\Sigma)$, $\field g_{0\varphi} =
-r_sar\sin^2\vartheta/\Sigma$ (half the second line's factor, because the cross term appears twice in $\field
g_{\mu\nu}\dd x^\mu\dd x^\nu$), $\field g_{rr} = \Sigma/\Delta$, $\field g_{\vartheta\vartheta} = \Sigma$, and $\field
g_{\varphi\varphi}$, the factor before $\dd\varphi^2$. The second line mixes a step in time with a step round
the axis and changes sign with $a$: the field turns. We take $a > 0$, so that the hole turns toward increasing
$\varphi$. **Check:** for $a = 0$, $\Sigma = r^2$ and $\Delta = r^2(1 - r_s/r)$, and every entry is 11.1's
Schwarzschild metric.

**The horizon.** In section
[11.1](/tutorial/black-holes/schwarzschild/#at-the-schwarzschild-radius-clocks-stop-nothing-can-hover-and-nothing-gets-out)
the horizon was where $\field g_{rr}$ grew without limit. Here $\field g_{rr} = \Sigma/\Delta$ does so where $\Delta =
0$, a quadratic in $r$ with the roots $G\matter M/c^2 \pm \sqrt{(G\matter M/c^2)^2 - a^2}$. The larger is the **outer
horizon**, the surface from inside which nothing escapes (stated, the GR course's section 17.7):

$$\boxed{\;\sym{outer-horizon}{r_+} = \frac{G\matter M}{c^2} + \sqrt{\Bigl(\frac{G\matter M}{c^2}\Bigr)^2 - a^2}\;} .$$

The root is real only if $a \le G\matter M/c^2$, that is $\chi \le 1$, so a body with more spin than that cannot
become a black hole until it sheds some. **Checks:** $a = 0$ gives $r_+ = r_s$, 11.1's horizon; the greatest spin,
$a = G\matter M/c^2$, gives $r_+ = G\matter M/c^2$, half of it.

**Numbers.** The Sun's angular momentum, $1.92\times10^{41}\unit{kg\,m^2\,s^{-1}}$, gives $a = 322$ m against
$G\matter M/c^2 = 1.48$ km, so $\chi = 0.22$: the Sun could collapse to a hole without shedding spin. The Earth's $a =
3.27$ m (section 9.3) against its $G\matter M/c^2 = 4.43$ mm gives $\chi = 738$.

**The horizon turns.** The metric does not depend on $\varphi$, so by 11.1's
[argument](/tutorial/black-holes/schwarzschild/#the-tide-outside-a-round-mass-is-exactly-newtons) for $t$ a free body
keeps $\field g_{\varphi\nu}\obs u^\nu$ fixed, with $\obs u^\nu$ its four-velocity: its angular momentum about the axis
per unit mass, in $\mathrm{m^2\,s^{-1}}$. A body with none, lowered toward the hole, has $\field g_{0\varphi}c\,\dd t +
\field g_{\varphi\varphi}\dd\varphi = 0$, so it turns at $\dd\varphi/\dd t = -c\field g_{0\varphi}/\field
g_{\varphi\varphi}$. On the horizon $\Delta = 0$, so $\field g_{\varphi\varphi} = (r_+^2 +
a^2)^2\sin^2\vartheta/\Sigma$ and $r_sr_+ = r_+^2 + a^2$. The factors $\sin^2\vartheta/\Sigma$ cancel, and the body
turns at the **horizon angular velocity**

$$\boxed{\;\sym{horizon-angular-velocity}{\Omega_H} = \frac{c\,r_sar_+}{(r_+^2 + a^2)^2} = \frac{ac}{r_+^2 + a^2}\;} ,$$

in radians per second ($\mathrm{m\times m\,s^{-1}}$ over $\mathrm{m^2}$). It does not depend on $\vartheta$: the whole
horizon turns at this one rate, as seen from far away. **Limits:** $a = 0$ gives $\Omega_H = 0$, and the greatest spin,
$r_+ = a = G\matter M/c^2$, gives $c^3/2G\matter M$. A hole of ten solar masses with $\chi = 0.7$ turns 660 times a
second.

| $\chi$ | 0 | 0.5 | 0.7 | 0.9 | 0.99 | 0.998 | 1 |
|---|---|---|---|---|---|---|---|
| $r_+$, in $G\matter M/c^2$ | 2 | 1.866 | 1.714 | 1.436 | 1.141 | 1.063 | 1 |
| $\Omega_H$, in $c^3/G\matter M$ | 0 | 0.134 | 0.204 | 0.313 | 0.434 | 0.469 | 0.5 |

**The ergosphere.** A body at rest relative to the distant stars keeps $r$, $\vartheta$ and $\varphi$ fixed, and its
path has $\dd s^2 = \field g_{00}\,c^2\dd t^2$. Where $\field g_{00} = -(1 - r_sr/\Sigma)$ is positive, such a path
would have $c^2\dd\obs\tau^2 < 0$, which no body can have (11.1's argument inside the horizon). This region, between
the horizon and the surface $r = G\matter M/c^2 + \sqrt{(G\matter M/c^2)^2 - a^2\cos^2\vartheta}$, is the
**ergosphere**. It touches the horizon at the poles and reaches out to $r_s$ on the equator (Figure
[](#fig:kerr-horizons)). Inside it every term of $\dd s^2$ except the cross term is positive, so a path with
$\dd s^2 < 0$ needs $2\field g_{0\varphi}c\,\dd t\,\dd\varphi < 0$, and with $\field g_{0\varphi} < 0$ that means
$\dd\varphi/\dd t > 0$. Every body there is carried round in the sense of the spin, though it can still escape. This is
**frame dragging**, section
[7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)'s
turning of gyroscopes by a spinning mass, grown large.

![Look first at the gap between the two curves on the left: it is the ergosphere on the equator, empty for a hole that
does not spin and widest at the greatest spin, where the horizon has shrunk to half its size. On the right, the rate at
which the horizon turns. Every curve is exact for Kerr's metric.](tut-kerr-horizons){#fig:kerr-horizons}

## Far away, a spinning hole is a mass and a spin dipole

We want what a pixel far from a spinning hole reads, to check that Kerr's $a$ is the angular momentum that Part 7
measures, divided by $\matter Mc$. Section 9.3 stated that outside Kerr's hole the eigenvalues of the complex table
$\curv{\mathcal W} = \curv\tE + i\curv\tB$, in $\mathrm{s^{-2}}$, are proportional to $(r - ia\cos\vartheta)^{-3}$. We
state here the factor and the pattern as well: with that section's signs the eigenvalues are exactly

$$\frac{G\matter M}{(r - ia\cos\vartheta)^3}\times(1, 1, -2)$$

(stated; Kerr's field is section
[9.4](/tutorial/one-point/petrov/#the-pattern-of-the-four-directions-is-the-fields-petrov-type)'s type D). We assume
that **the pixel is far away**: $a \ll r$ for the expansion, and $r \gg G\matter M/c^2$ for the comparison, because
Part 7's weak field is linear in $G$. The binomial rule $(1 - x)^{-3} \approx 1 + 3x$ for small $x$, with $x =
ia\cos\vartheta/r$, gives

$$\frac{G\matter M}{(r - ia\cos\vartheta)^3} \approx \frac{G\matter M}{r^3}\Bigl(1 + \frac{3ia\cos\vartheta}{r}\Bigr).$$

The real part is 11.1's [tide](/tutorial/black-holes/schwarzschild/#the-tide-outside-a-round-mass-is-exactly-newtons)
$(G\matter M/r^3)\,\mathrm{diag}(1, 1, -2)$. The imaginary part belongs to $\curv\tB$, and with $\matter Ma = \matter
J/c$ the magnetic part has, in the tide's axes, the diagonal

$$\boxed{\;\curv\tB \to \frac{3G\matter J\cos\vartheta}{c\,r^4}\times(1, 1, -2)\;} .$$

**The check against Part 7.** Section 7.5's boxed spin dipole has $\curv\tB_{ij} = -(3G/cr^4)[L_i\hat n_j + \hat
n_iL_j + (\vect L\cdot\hat n)(\delta_{ij} - 5\hat n_i\hat n_j)]$, with $\hat n$ the unit vector from the pixel toward
the body. We put $\vect L = \matter J\hat z$, so $\vect L\cdot\hat n = -\matter J\cos\vartheta$. Along $\hat n$ the
bracket is $2\vect L\cdot\hat n - 4\vect L\cdot\hat n = 2\matter J\cos\vartheta$, so $\curv\tB_{nn} = -2 \times
3G\matter J\cos\vartheta/cr^4$. Across $\hat n$ the bracket is $\vect L\cdot\hat n$, so each entry is $+3G\matter
J\cos\vartheta/cr^4$. This is the boxed diagonal, number for number (Figure [](#fig:kerr-far-field)).[^off] So
Kerr's $a$ is the hole's angular momentum over $\matter Mc$, and a pixel far away reads it from the phase
$3a\cos\vartheta/r$ of its eigenvalues, as section 9.3's pixel read the Earth's.[^kerr]

**Number.** In units of $G\matter M/c^2$, for $\chi = 0.9$ on the axis at $r = 30$, the exact imaginary part of
$(r - ia)^{-3}$ is $3.323\times10^{-6}$, against the first-order $3a/r^4 = 3.333\times10^{-6}$: they differ by 0.3%, the size
$\tfrac{10}{3}(a/r)^2$ of the first neglected term. **Limit:** for $a \to 0$ the reading is 11.1's exact tide.

![Look first at the equator of each sphere: the magnetic part vanishes there and changes sign across it, for the hole as
for the ball. Far away a spinning hole and a spinning ball of the same mass and angular momentum give the same pattern;
the colour scale is schematic in strength.](tut-kerr-far-field){#fig:kerr-far-field}

**Every moment is fixed.** Any stationary field in empty space has a tower of **mass moments** $\matter M_\ell$ and
**current moments** $S_\ell$ (the moments of section
[2.8](/tutorial/outside/flows/#a-swirl-shows-through-its-angular-momentum-and-two-swirls-can-cancel)'s flow), in
$\mathrm{kg\,m^\ell}$ and $\mathrm{kg\,m^{\ell+1}\,s^{-1}}$, which far away become 2.3's moments. For Kerr's field they
are (stated; Hansen, 1974) [@Hansen1974]

$$\matter M_\ell + \frac{i}{c}S_\ell = \matter M\,(ia)^\ell .$$

Degree 0 is the mass. Degree 1 gives $S_1 = \matter Mca = \matter J$, the spin dipole. Degree 2 gives $\matter M_2 =
-\matter Ma^2$, a flattened quadrupole, like the Earth's $-J_2\matter MR^2$ in section 2.3. So the hole's whole tower
is fixed by $\matter M$ and $a$. A neutron star of the same mass and spin has a larger quadrupole, set by its matter
(section [12.1](/tutorial/sky/stars/#when-the-fuel-is-gone-crowded-particles-hold-the-star-up)).

**A check at degree two.** Far away, the time entry of the metric gives the Newtonian potential, $\field g_{00} =
-(1 + 2\field\Phi/c^2)$ (section 7.1). Expanding Kerr's $r_sr/\Sigma$ for $a \ll r$,

$$\frac{r_sr}{r^2 + a^2\cos^2\vartheta} = \frac{r_s}{r}\Bigl(1 - \frac{a^2\cos^2\vartheta}{r^2} + \dots\Bigr) ,$$

so $\field\Phi = -G\matter M/r + G\matter Ma^2\cos^2\vartheta/r^3$. Kerr's $r$ is not the distance of flat space,
however. With $\matter M = 0$ the metric is flat space in **oblate spheroidal coordinates**, $x + iy = \sqrt{r^2 +
a^2}\,\sin\vartheta\,e^{i\varphi}$ and $z = r\cos\vartheta$, as substituting them into $\dd x^2 + \dd y^2 + \dd z^2$
shows. The flat distance $R$ from the centre therefore has $R^2 = r^2 + a^2\sin^2\vartheta$, and $1/r = (1/R)(1 +
a^2\sin^2\vartheta/2R^2 + \dots)$. To this order $\vartheta$ is the flat angle, and

$$\begin{aligned}
\field\Phi &= -\frac{G\matter M}{R} - \frac{G\matter Ma^2}{R^3}\Bigl(\tfrac12\sin^2\vartheta - \cos^2\vartheta\Bigr)\\
&= -\frac{G\matter M}{R} + \frac{G\matter Ma^2}{R^3}\,P_2(\cos\vartheta) ,
\end{aligned}$$

since $\cos^2\vartheta - \tfrac12\sin^2\vartheta = \tfrac32\cos^2\vartheta - \tfrac12$ is section 2.2's $P_2$. A body
whose potential has the term $-G\matter M_2P_2/R^3$ has the quadrupole $\matter M_2$, which for the Earth is
$-J_2\matter MR_\oplus^2$ (section 2.3). So $\matter M_2 = -\matter Ma^2$, Hansen's value. **Units:**
$G\matter Ma^2/R^3$ is $\mathrm{m^3\,s^{-2}}$ times $\mathrm{m^2}$ over $\mathrm{m^3}$, a potential.

## A hole at rest shows seven numbers, and nothing of what fell in

**The no-hair theorem** (stated). In Einstein's theory, a black hole that is **stationary**, whose outside is **empty
or holds only an electric and magnetic field**, whose horizon is **regular and in one piece**, and whose spacetime is
**flat far away**, has Kerr's field, or with charge the Kerr–Newman field. It is fixed by its mass, its angular
momentum and its charge.[^proofs] **Hair**, section
[0.5](/tutorial/evening/what-the-outside-keeps/#the-list-is-short-and-a-black-holes-is-the-shortest)'s word, is any
further detail the outside could show, and a settled hole has none. A hole still ringing, a disc of gas round it, or a
theory with other fields can carry more.

**Why it is plausible.** Birkhoff's theorem
([11.1](/tutorial/black-holes/schwarzschild/#outside-a-round-body-einsteins-field-is-fixed-by-the-mass-alone)) is the
round case, where the only number is the mass. When a lopsided star collapses, the new hole rings like a struck bell,
at frequencies set by its mass and spin alone, and this **ringdown** carries the lumps away as gravitational waves or
into the hole.

**The count.** A hole without charge is fixed by its mass (one number), its angular momentum (three: its size and the
two angles of its axis) and its place (three). These are seven numbers in the frame in which the hole is at
rest. A velocity adds three more, as for any body, and a charge one. A far pixel reads them as the one above does.
The tide's directions and its fall with distance give the place, and its size there gives the mass. The phase
$3a\cos\vartheta/r$ of the eigenvalues vanishes on the equator, which fixes the axis, and its size gives $a$.

**What one moment of the field fixes.** The seven numbers are what a settled hole shows. At a single moment,
Einstein's theory leaves even less of a body certain. Corvino and Schoen [@CorvinoSchoen2006] proved that the field of
empty space round a body, given at one moment inside a large enough sphere, can be joined across a shell, still
obeying Einstein's equations for empty space, to the field of a Kerr hole, spinning and in general moving, outside it
(stated). The shell then holds gravitational waves, which spread at once. So at one moment the field outside a sphere
can be exactly a hole's, whatever lies within, and every count in this book of what a camera reads from a body,
beyond these numbers, assumes that no waves arriving from elsewhere hide the body's higher moments.

**The bits.** By section 3.8, a number read at the signal-to-noise ratio $\SNR$ carries at most $\log_2\SNR$ bits, so
the hole gives at most

$$7\log_2\SNR\ \text{bits},$$

140 at $\SNR = 10^6$ and 1630 at $10^{70}$, whatever the hole's size. Here $10^{70}$ is the ceiling estimated for a
camera watching a person for the age of the universe.[^bits] A stone read from three of its radii holds 1176 bits at
$10^6$ ([section 3.8](/tutorial/noise/bits/#a-bodys-field-at-one-time-holds-about-1200-bits-from-three-radii-away)),
8.4 times as much.

{{paper fig:hair}}

**What fell in.** Section
[2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see) found
that the outside of an ordinary body cannot see one part of its density, but that every harmonic moment shows. A star
of ten solar masses with an iron core, and a cloud of gas of the same mass and angular momentum, in general have
different moments of degree two and higher, so a camera can tell them apart. Each collapses to a hole whose moments are
$\matter M(ia)^\ell$, the same for both, and then a camera cannot. The difference is not hidden in 2.5's sense: it was
radiated in the ringdown or fell behind the horizon. Whatever more the outside of a hole holds must
therefore be a quantum effect.

## The area of a horizon never shrinks, so spin holds energy that can be taken out

**The area theorem** (stated, with a sketch). Hawking proved in 1971 that in Einstein's theory the area of a horizon
never decreases, if **the energy that every observer measures is never negative** and **no singularity can be seen from
outside**. The horizon is made of rays of light that stay on it for ever. Positive energy focuses rays, so rays on the
horizon that began to converge would meet in a finite time and leave it. They never converge, and the area they span
never shrinks.

::: gap
This sketch skips the focusing law itself, Raychaudhuri's equation for a bundle of rays, and the global argument that
the horizon's rays cannot meet. The GR course's sections
[22.2](https://neovand.github.io/general-relativity/chapter-22.html#22-2-deriving-the-raychaudhuri-equation-one-logical-move-at-a-time)
and 22.9 give both.
:::

**The area.** On the horizon at one time, $\dd t = \dd r = 0$, and the $\Delta$ above vanishes, so the metric leaves
$\Sigma\,\dd\vartheta^2 + (r_+^2 + a^2)^2\sin^2\vartheta\,\dd\varphi^2/\Sigma$. Steps $\dd\vartheta$ and $\dd\varphi$
are at right angles, so a small patch has the area $\sqrt{\field g_{\vartheta\vartheta}\field
g_{\varphi\varphi}}\,\dd\vartheta\,\dd\varphi = (r_+^2 + a^2)\sin\vartheta\,\dd\vartheta\,\dd\varphi$. Integrating
$\vartheta$ from 0 to $\pi$ and $\varphi$ from 0 to $2\pi$,

$$\sym{horizon-area}{A} = 4\pi(r_+^2 + a^2) = 8\pi\,\frac{G\matter M}{c^2}\,r_+ ,$$

in square metres, where the second form uses $r_+^2 + a^2 = r_sr_+$. For $a = 0$ it is $4\pi r_s^2$, the sphere of
11.1.[^A]

**The irreducible mass** $\sym{irreducible-mass}{\matter M_{\rm irr}}$ is defined by writing the area as that of a hole
that does not spin, $A = 16\pi(G\matter M_{\rm irr}/c^2)^2$. Then $(G\matter M_{\rm irr}/c^2)^2 = \tfrac12(G\matter
M/c^2)\,r_+$, and with $r_+ = (G\matter M/c^2)(1 + \sqrt{1 - \chi^2})$,

$$\boxed{\;\matter M_{\rm irr} = \matter M\sqrt{\frac{1 + \sqrt{1 - \chi^2}}{2}}\;} .$$

The area never decreases, so neither does $\matter M_{\rm irr}$. To see what this means for the mass, we solve for
$\matter M$. Writing $r_+$ out, the definition reads

$$\begin{aligned}
&2\Bigl(\frac{G\matter M_{\rm irr}}{c^2}\Bigr)^2 - \Bigl(\frac{G\matter M}{c^2}\Bigr)^2\\
&\quad = \frac{G\matter M}{c^2}\sqrt{\Bigl(\frac{G\matter M}{c^2}\Bigr)^2 - a^2} .
\end{aligned}$$

We square both sides, so that the terms in $(G\matter M/c^2)^4$ cancel, divide by $4(G\matter M_{\rm irr}/c^2)^2$, put
$\matter Ma = \matter J/c$ and multiply by $c^4/G^2$. This leaves **Christodoulou's formula** (1970)

$$\boxed{\;\matter M^2 = \matter M_{\rm irr}^2 + \Bigl(\frac{c\matter J}{2G\matter M_{\rm irr}}\Bigr)^2\;} ,$$

in $\mathrm{kg^2}$, since $c\matter J/G\matter M_{\rm irr}$ is a mass. Whatever happens to the hole, $\matter
M_{\rm irr}$ cannot fall and the spin's term cannot be negative, so the mass never falls below the irreducible mass it
started with. The most energy that can be taken out is therefore $(\matter M - \matter M_{\rm irr})c^2$, reached by
removing all the spin without changing the area. It is 3.4% of the mass at $\chi = 0.5$, 7.4% at 0.7, 15% at 0.9, 24%
at 0.99, and at the greatest spin, where $\matter M_{\rm irr} = \matter M/\sqrt2$, it is $1 - 1/\sqrt2 = 29.3\%$.
**Limit:** for $\chi = 0$, $\matter M_{\rm irr} = \matter M$, and a hole that does not spin gives nothing back.
**Number:** a hole of ten solar masses with $\chi = 0.7$ holds $0.74$ solar masses in its spin, $1.3\times10^{47}$ J,
as much as the Sun radiates in 800 times the age of the universe.

**The first law.** We need to know how much a hole's area grows when it absorbs a little energy and angular
momentum. Christodoulou's formula fixes the mass by the area and $\matter J$, so a small change of the hole obeys

$$\dd(\matter Mc^2) = \frac{\kappa c^2}{8\pi G}\,\dd A + \Omega_H\,\dd\matter J ,$$

the **first law of black-hole mechanics** (Bardeen, Carter and Hawking, 1973). Differentiating at fixed area gives the
coefficient of $\dd\matter J$, and it is the horizon's $\Omega_H$.[^first] The coefficient of $\dd A$ defines
$\sym{horizon-surface-gravity}{\kappa}$, the **surface gravity** of the horizon, an acceleration in
$\mathrm{m\,s^{-2}}$, positive for $\chi < 1$. **Check:** for $a = 0$, $\kappa = c^4/4G\matter M$, which is 11.1's
hovering acceleration $G\matter M/r^2\sqrt{1 - r_s/r}$ times the clock rate $\sqrt{1 - r_s/r}$, taken at $r_s$. Section
11.3 reads this term as heat.

**Penrose's process** (sketched). The metric does not depend on $t$, so by 11.1's argument a free body keeps fixed its
energy as counted far away. In units of its rest energy this is

$$\begin{aligned}
-\frac{\field g_{0\nu}\obs u^\nu}{c}
&= -\field g_{00}\,\frac{\dd t}{\dd\obs\tau}\\
&\quad - \frac{\field g_{0\varphi}}{c}\,\frac{\dd\varphi}{\dd\obs\tau} ,
\end{aligned}$$

which for $a = 0$ is 11.1's energy of a fall. Outside the ergosphere $\field g_{00} < 0$, and the energy is positive.
Inside, $\field g_{00} > 0$ makes the first term negative, and a body that turns forward slowly enough has a negative
energy (stated). Roger Penrose noticed in 1969 that a body can split in the ergosphere so that one piece, of negative
energy, falls in, and the other leaves with more energy than the whole brought. The area theorem caps what can be taken
at the 29% above.

## A hole amplifies a wave that turns with it more slowly than its horizon

We want to know when a hole gives energy to a wave instead of absorbing it. We assume that **the wave is weak**, so
that the hole changes by small amounts and settles to Kerr's field again, and that **the wave varies as $e^{-i\omega
t + im\varphi}$**, with one angular frequency $\omega > 0$ . Here
$\sym{order}{m}$ is a whole number, section 2.2's order of a pattern. A crest, where $-\omega t + m\varphi$ is fixed,
moves at $\dd\varphi/\dd t = \omega/m$, so for $m > 0$ the pattern turns toward increasing $\varphi$, in the sense of
the hole, at the rate $\omega/m$. The hole does not change in time and is the same at every angle round its axis, so
the wave that leaves has the same $\omega$ and $m$.

**The ratio.** Turning the pattern by an angle $\theta$ about the axis replaces $\varphi$ by $\varphi - \theta$, and so
multiplies it by $e^{-im\theta}$. By section 8.3's argument for a graviton's helicity, with the hole's axis in place of
the direction of travel, each quantum of the wave then carries the angular momentum $m\hbar$ about the axis, beside its
energy $\hbar\omega$. So whatever the hole takes from the wave comes in the ratio

$$\delta\matter J = \frac{m}{\omega}\,\delta E ,$$

with $\delta E$ the energy the hole absorbs, in joules.

**The first law and the area.** The hole's energy changes by $\delta(\matter Mc^2) = \delta E$. The first law gives

$$\delta E = \frac{\kappa c^2}{8\pi G}\,\delta A + \Omega_H\,\frac{m}{\omega}\,\delta E ,$$

and moving the last term to the left,

$$\frac{\kappa c^2}{8\pi G}\,\delta A = \delta E\,\Bigl(1 - \frac{m\Omega_H}{\omega}\Bigr) .$$

The area cannot shrink and $\kappa > 0$ for $\chi < 1$, so the right side is never negative. If $\omega < m\Omega_H$
the bracket is negative, and $\delta E$ must be negative or zero:

$$\boxed{\;0 < \omega < m\Omega_H \quad\Longrightarrow\quad \delta E \le 0\;} .$$

The hole gives energy to the wave, which leaves stronger than it came. This is **superradiance** (Figure
[](#fig:kerr-superradiance)). In words: the wave's pattern turns at $\omega/m$, and if that is slower than the
horizon, the horizon drags it forward.[^doppler] For a wave with $\omega = m\Omega_H$ exactly, the first law says only
that the area does not change; that such a wave is neither absorbed nor amplified is stated, from Teukolsky's equation.

**Limits.** A hole that does not spin has $\Omega_H = 0$, so the bracket is $1$ and every wave is absorbed or passes,
$\delta E \ge 0$. A wave with $m \le 0$, turning against the hole or not at all, is never amplified. Section
[4.1](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push) found that a
passive body never gives energy back on average. A spinning hole is not passive: its spin is a store of energy, and
superradiance draws on it.

**Numbers.** For $m = 2$ the condition is $G\matter M\omega/c^3 < 2G\matter M\Omega_H/c^3$, twice the table's last row:
$0.41$ at $\chi = 0.7$, $0.63$ at 0.9, $0.87$ at 0.99, $0.94$ at 0.998, and 1 at the greatest spin. For ten solar masses
and $\chi = 0.7$ this is gravitational waves below 1320 Hz. The derivation gives the condition but not the size of the
gain, which needs Teukolsky's equation. For the mode of degree and order two, $\ell = m = 2$, Teukolsky and Press [@TeukolskyPress1974] found the greatest
gains: $0.27\%$ at $\chi = 0.7$, $6.4\%$ at 0.9, $56\%$ at 0.99,
$91\%$ at 0.998 and $138\%$ at the greatest spin. A spinning hole can therefore look brighter than the sky
([section 11.3](/tutorial/black-holes/hawking/#a-spinning-hole-can-be-brighter-than-any-sky)).

**How the gains are found** (the method, stated). Teukolsky (1973) showed that a weak wave on Kerr's field separates,
as the Regge–Wheeler wave of section 11.3 does on Schwarzschild's, into an equation for its pattern on the sphere and
one along the radius, whose coefficients hold only $\matter M$, $a$, $\omega$, $\ell$ and $m$. The radial equation is
solved as section
[11.3](/tutorial/black-holes/hawking/#integrated-step-by-step-the-regge-wheeler-equation-gives-every-greybody-factor) solves Regge and Wheeler's: a wave that
only goes in at the horizon is carried outward and split far away into a wave coming in and one going out, and the
gain is the energy going out over the energy coming in, less one. The first law fixes the gain's sign, and only the
integration gives its size. For the mode $\ell = m = 2$:

| $\chi$ | 0.7 | 0.9 | 0.99 | 0.998 |
|---|---|---|---|---|
| greatest gain | $0.27\%$ | $6.4\%$ | $56\%$ | $91\%$ |
| at $G\matter M\omega/c^3$ | 0.37 | 0.58 | 0.83 | 0.92 |
| threshold $2G\matter M\Omega_H/c^3$ | 0.41 | 0.63 | 0.87 | 0.94 |

The greatest gain lies a little below the threshold, and nearer to it as the spin grows: at $\chi = 0.998$ it is at
$G\matter M\omega/c^3 = 0.92$, 98% of the way to the threshold.

**A check at long waves.** For $G\matter M\omega/c^3 \ll 1$ Teukolsky's equation can be solved by joining a solution
near the hole to one far away, and the share of the mode $(\ell, m)$ that the hole takes is (Starobinsky, 1973; Page,
1976 [@Page1976b]; stated)

$$\begin{aligned}
\Gamma_{\ell m} \to{} &\Bigl[\frac{(\ell - 2)!\,(\ell + 2)!}{(2\ell)!\,(2\ell + 1)!!}\Bigr]^2
\prod_{n=1}^{\ell}\Bigl[1 + \frac{c^2(\omega - m\Omega_H)^2}{n^2\kappa^2}\Bigr]\\
&\times\frac{2c\,(\omega - m\Omega_H)}{\kappa}\Bigl[\frac{\omega\,(r_+ - r_-)}{c}\Bigr]^{2\ell + 1} ,
\end{aligned}$$

with $r_- = G\matter M/c^2 - \sqrt{(G\matter M/c^2)^2 - a^2}$ the smaller root of $\Delta$,
$(2\ell + 1)!! = 1\cdot3\cdots(2\ell + 1)$, and $\kappa$ the surface gravity of the first law. Every factor is a pure number. All are
positive except $\omega - m\Omega_H$, so the share changes sign exactly at the threshold that the first law and the
area theorem give. **Limit:** without spin, $\kappa = c^4/4G\matter M$ and $r_+ - r_- = r_s$, so with $x = G\matter
M\omega/c^3$ the factors at $\ell = 2$ are $1/225$, $(1 + 16x^2)(1 + 4x^2)$, $8x$ and $(2x)^5$, whose product tends to
section 11.3's limit $(256/225)\,x^6$.

If a particle of spin zero or one exists with a rest energy near $10^{-12}$ eV, its field can be trapped round a hole of
ten solar masses in states like an atom's, a **boson cloud**, that meet the condition. The cloud grows and draws out the
hole's spin (the **superradiant instability**, stated; Detweiler, 1980), and its gravitational waves are in one mode and
in step, so its gravitons arrive independently, $g^{(2)} = 1$ ([section 8.5](/tutorial/quantum/counting-quanta/#a-steady-source-gives-poisson-counts)).

![Look first at the line $\omega = m\Omega_H$: to its left the hole loses energy to the wave, to its right it absorbs.
Only the sign comes from the first law and the area theorem; the bar lengths are schematic (the two nearest the line are
cut short), and the true gains need Teukolsky's equation.](tut-kerr-superradiance){#fig:kerr-superradiance}

::: try {#spin-and-gain}
A spinning hole cut through its axis, drawn to scale: the horizon, the ergosphere and a few marks turning with the
horizon, with an arrow for a wave coming in and one for the wave going out. Sliders set the hole's spin $\chi$ and the
wave's frequency $G\matter M\omega/c^3$, and a choice sets its azimuthal number $m$. Readouts give $r_+$, $\Omega_H$,
the threshold $m\Omega_H$ and whether the wave is absorbed or amplified, and a bar shows the share of the mass held in
spin. The five gains above are marked on the spin slider; the figure computes only the sign of the gain.

Predict first: a wave with $m = 2$ and $G\matter M\omega/c^3 = 0.5$ meets the hole. Is it amplified at $\chi = 0.7$?
At $\chi = 0.9$? Then drag the spin and find where it starts to gain.
:::

**The idea to keep: a black hole in equilibrium is fixed by its mass, its spin and its charge, seven numbers for one at
rest, and its spin $a = \matter J/\matter Mc$ is at most $G\matter M/c^2$. Because the horizon's area never shrinks, a
hole holds up to 29% of its mass in spin, which it gives to any wave that turns with it more slowly than the horizon.**

::: problems
### Practice

**[11.2]** For $\chi = 0.9$, compute $r_+$, $\Omega_H$, $\matter M_{\rm irr}/\matter M$, and the condition on $\omega$ for
superradiance at $m = 2$.

::: solution
$\sqrt{1 - 0.81} = 0.436$, so $r_+ = 1.436\,G\matter M/c^2$; $\Omega_H = 0.9/(1.436^2 + 0.81)\,c^3/G\matter M =
0.313\,c^3/G\matter M$; $\matter M_{\rm irr}/\matter M = \sqrt{1.436/2} = 0.847$; and $G\matter M\omega/c^3 < 0.627$.
:::

**[11.2]** Why can the Earth not collapse to a black hole without first losing angular momentum?

::: solution
Its $a = \matter J/\matter Mc = 3.27$ m is 740 times its $G\matter M/c^2 = 4.43$ mm, and a horizon needs $a \le
G\matter M/c^2$.
:::

**[11.2]** At $\chi = 0.9$, how far below the threshold $m\Omega_H$ is the frequency of the greatest gain of the mode
$\ell = m = 2$, and why can the greatest gain not lie above the threshold?

::: solution
The greatest gain is at $G\matter M\omega/c^3 = 0.58$, against the threshold $0.63$: 7% below it. Above the threshold
the bracket $1 - m\Omega_H/\omega$ is positive, so the area theorem allows only $\delta E \ge 0$: the hole absorbs.
:::

### Stretch

**[11.2]** With section 7.5, show that on the axis the whole of the far magnetic part, not only its diagonal, is the
spin dipole's. Then, with section 3.8, count the bits of an uncharged hole moving at a steady velocity, at $\SNR = 10^6$.

::: solution
On the axis $\hat n = -\hat z$ and the bracket of 7.5's formula is $-\matter J(1 - 3\hat z\hat z^{\mathsf T})$, so
$\curv\tB = (3G\matter J/cr^4)(1 - 3\hat z\hat z^{\mathsf T})$, with no entries off the diagonal. A velocity adds three
numbers, so $10\log_2\SNR = 199$ bits.
:::

**[11.2]** Show that Kerr's metric with $\matter M = 0$ is flat space in oblate spheroidal coordinates, $x + iy =
\sqrt{r^2 + a^2}\,\sin\vartheta\,e^{i\varphi}$ and $z = r\cos\vartheta$.

::: solution
With $\matter M = 0$, $r_s = 0$ and $\Delta = r^2 + a^2$, so the metric's space part is $(\Sigma/\Delta)\,\dd r^2 +
\Sigma\,\dd\vartheta^2 + (r^2 + a^2)\sin^2\vartheta\,\dd\varphi^2$, since $(r^2 + a^2)^2 - a^2(r^2 + a^2)\sin^2\vartheta
= (r^2 + a^2)\Sigma$. From the coordinates, $\dd x^2 + \dd y^2 = (\dd s_\perp)^2 + s_\perp^2\dd\varphi^2$ with $s_\perp =
\sqrt{r^2 + a^2}\sin\vartheta$, and $\dd s_\perp = (r\sin\vartheta/\sqrt{r^2 + a^2})\,\dd r + \sqrt{r^2 +
a^2}\cos\vartheta\,\dd\vartheta$, $\dd z = \cos\vartheta\,\dd r - r\sin\vartheta\,\dd\vartheta$. Squaring and adding,
the cross terms cancel and the rest is $(\Sigma/(r^2 + a^2))\,\dd r^2 + \Sigma\,\dd\vartheta^2 + (r^2 +
a^2)\sin^2\vartheta\,\dd\varphi^2$, the same.
:::

### The camera

**[11.2]** How many numbers does the field of an uncharged hole at rest show, and what are they? How many bits do they
carry at $\SNR = 10^6$, and how does that compare with a stone read from three of its radii?

::: solution
One mass, three components of spin and three of place make seven. Each is worth $\log_2 10^6 = 19.93$ bits, so the hole
gives 140; the stone gives 1176, 8.4 times as many.
:::
:::

::: paper
- [Section XII](/paper/#sec:hair) and [*The number of bits*](/paper/#par:the-number-of-bits): no hair, Hansen's moments,
  seven numbers and $7\log_2\SNR$; Table [](/paper/#tab:hair) and Figure [](/paper/#fig:hair).
- [Section VII](/paper/#sec:no-lens) and [Section XI](/paper/#sec:vistas): the gains and the boson cloud.
  [Section VIII](/paper/#sec:one-pixel): Kerr's $(r - ia\cos\vartheta)^{-3}$. [Section XIV](/paper/#sec:hole) and
  [Section XV](/paper/#sec:holography): a hole's reply set by its mass and spin alone.
:::

::: deeper
- The GR course's section
  [17.7](https://neovand.github.io/general-relativity/chapter-17.html#17-7-rotation-kerr-frame-dragging-and-carefully-qualified-no-hair-claims)
  gives Kerr's metric, frame dragging and the no-hair theorem's conditions, and section
  [22.9](https://neovand.github.io/general-relativity/chapter-22.html#22-9-classical-area-increase-with-the-assumptions-visible)
  the area theorem and the first law.
- S. A. Teukolsky and W. H. Press (1974) [@TeukolskyPress1974] compute the gains; R. Brito, V. Cardoso and P. Pani,
  *Superradiance* (Springer, 2nd edition, 2020), treat the condition, Penrose's process and boson clouds.
:::

[^proofs]: Israel (1967) proved it for holes that do not spin; Carter (1971), Hawking (1972) and Robinson (1975) for
    spinning ones, each with further technical conditions (the GR course's section 17.7).

[^hair]: First shown in *The gravitational camera* (Mohsenvand 2026): the saying and its Table [](/paper/#tab:hair), which
    sets a stone against a hole, in [Sec. XII](/paper/#sec:hair); the gain in [Sec. VII](/paper/#sec:no-lens) and
    [Sec. XI](/paper/#sec:vistas).

[^bits]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XII](/paper/#sec:hair), as its equation
    [](/paper/#eq:hair-bits); the ceiling $10^{70}$ is from [Sec. IV](/paper/#sec:near-field).

[^J]: Not the invariant $J = \mathrm{tr}\,\curv{\mathcal W}^3$ of Part 9, nor the current column $\vect J$.

[^chi]: In this section and 11.3 only, $\chi$ is the dimensionless spin, never 4.5's response $\chi(\omega)$. *The
    gravitational camera* (Mohsenvand 2026) writes the same spin as $a = 0.7\,GM/c^2$.

[^r]: Kerr's $r$ is not quite 11.1's circumference radius, though the two agree far away and for $a = 0$.

[^off]: Off the axis, 7.5's table also has entries that mix the radius with the directions across it. They change the
    eigenvalues only at second order in $a/r$, because they couple eigenvalues that differ.

[^kerr]: The form $(r - ia\cos\vartheta)^{-3}$ is exact only for Kerr's hole. For the Earth first order is enough for its $1.5\times10^{-6}$; at second order the Earth's
    flattening, $J_2R^2 = 4.4\times10^{10}\unit{m^2}$ against $a^2 = 10.7\unit{m^2}$, takes over.

[^A]: Not 4.5's sum $A$ nor 5.4's amplitude.

[^first]: At fixed $\matter M_{\rm irr}$, Christodoulou's formula gives $2\matter M\,\dd\matter M = c^2\matter
    J\,\dd\matter J/2G^2\matter M_{\rm irr}^2$. With $(G\matter M_{\rm irr}/c^2)^2 = \tfrac12(G\matter M/c^2)\,r_+$ and
    $\matter J = \matter Mca$ this is $c^2\,\dd\matter M = (ac/r_sr_+)\,\dd\matter J$, and $r_sr_+ = r_+^2 + a^2$ makes
    the factor $\Omega_H$. The derivative at fixed $\matter J$ gives $\kappa = c^2\sqrt{(G\matter M/c^2)^2 -
    a^2}/(r_+^2 + a^2)$, zero at the greatest spin.

[^doppler]: Seen from the turning horizon, the wave's frequency is $\omega - m\Omega_H$, negative here: the turning
    form of section [6.3](/tutorial/relativity/aberration/#light-from-ahead-is-bluer-and-light-from-behind-is-redder)'s
    Doppler shift.
