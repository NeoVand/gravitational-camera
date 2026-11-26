---
id: '11.3'
title: 'Hawking radiation'
question: 'A black hole gives off a faint glow of its own, at a Hawking temperature that is lower for heavier holes, and a hole of $1.356\times10^{23}$ kilograms cannot be seen against the sky of primordial gravitons at all. What is a black hole''s temperature, why does a hole glow at all, and how dark is its shadow against a warm sky?'
part: '11'
requires: ['4.2', '8.3', '11.1', '11.2']
paper: [sec:vistas, fig:black-hole, sec:no-lens, fig:black-hole-camera, sec:hole, eq:hole-thermometer, sec:holography]
figures: [fig:black-hole]
live: [hole-against-sky]
depth: C
---

Panel (b) of Figure [](/paper/#fig:black-hole) shows the sky of primordial gravitons as a camera at rest
$40\,G\matter M/c^2$ from a black hole sees it: a nearly uniform glow at 0.929 K, with one black disc. (The sky far away
is at 0.905 K, and [section 11.1](/tutorial/black-holes/schwarzschild/#seen-from-rest-near-a-hole-the-whole-sky-is-warmer)
found that it looks warmer from rest near a hole.) The disc need not be there. A hole of $1.356\times10^{23}$ kilograms,
nearly twice the Moon's mass, gives back as much as it receives, and so cannot be seen against the glow at all.[^hawk]

{{paper fig:black-hole}}

What is a black hole's temperature, why does a hole glow at all, and how dark is its shadow against a warm sky? The
answers decide which holes the camera can see in gravitons, and how deep their shadows are.

::: plain
A black hole is not perfectly black. Quantum mechanics makes it glow faintly, like a warm body, at a temperature called
the Hawking temperature. A heavier hole is colder. A hole of about twice the Moon's mass is at 0.905 kelvin, the
temperature of the sky of primordial gravitons.

A hole that loses energy by glowing becomes lighter, and so hotter, and so it glows more. A hole that takes in energy
becomes heavier and colder. So a hole can be in balance with a sky only at one mass, and the balance does not last.

A wave that reaches a hole is partly swallowed and partly sent back. The hole adds its own glow in the same proportion.
A hole exactly as warm as the sky therefore cannot be seen at all. A heavier hole casts a shadow, but the shadow stays
pale until the hole is much larger than the waves of the sky.
:::

## A black hole has a temperature, lower the heavier it is

We want the temperature of a black hole, because a hole is dark against a sky only if it is colder than the sky. Here
$\sym{mass}{\matter M}$ is the hole's mass in kilograms, and $\sym{hawking-temperature}{T_H}$, in kelvin, is its
**Hawking temperature**: the temperature of the faint glow it gives off, its **Hawking radiation**. Stephen Hawking
found in 1974 and 1975 (stated without proof) that

$$\boxed{\;\kB T_H = \frac{\hbar c^3}{8\pi G\matter M}\;} . \label{eq:hawking}$$

**Its conditions.** The result assumes that **the hole formed by the collapse of matter**, that **quantum fields move
on the classical metric** of section 11.1, which is not itself treated by quantum mechanics, and that **the hole is far
heavier than the Planck mass** $\sqrt{\hbar c/G} = 2.2\times10^{-8}$ kg, so that its glow changes it slowly. Section
[13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)
reads $T_H$ with a camera.

**Units.** $\hbar c^3/G\matter M$ is $\mathrm{J\,s}\times\mathrm{m^3\,s^{-3}}$ divided by $\mathrm{m^3\,kg^{-1}\,s^{-2}}
\times\mathrm{kg}$, which is a joule, as an energy $\kB T_H$ must be. **Limit:** as $\hbar \to 0$, $T_H \to 0$. Without
quantum mechanics a hole is at absolute zero and perfectly black, as section 11.1 found it.

**Numbers.** A hole of the Sun's mass is at $6.2\times10^{-8}$ K, 44 million times colder than the microwave sky.
Solving [](#eq:hawking) for the mass gives $\matter M = \hbar c^3/8\pi G\kB T_H$. At 0.905 K, the graviton sky of
section [12.2](/tutorial/sky/universe/#gravitons-parted-first-and-kept-a-colder-share-of-the-heat), it is the
**equilibrium mass**

$$\sym{equilibrium-mass}{\matter M_{\rm eq}} = 1.356\times10^{23}\unit{kg} ,$$

1.85 times the Moon's mass: a hole of this mass is exactly as warm as the graviton sky. At the 2.7255 K of the
microwave sky the mass is $4.50\times10^{22}$ kg, three times less. The hole of the equilibrium mass has $r_s = 0.201$
mm, and a metre away its steady tide is section
[11.1](/tutorial/black-holes/schwarzschild/#the-tide-outside-a-round-mass-is-exactly-newtons)'s
$2G\matter M/r^3 = 1.8\times10^{13}\unit{s^{-2}}$.
**What it means:** a heavier hole is colder, so it is the heavy holes that cast shadows (Figure
[](#fig:hawking-ladder)).

![Look first at the mark $\matter M_{\rm eq}$: a hole of that mass is as warm as the graviton sky. Lighter holes glow
against it, heavier ones are dark. The axes are exact; the bands are bounded by the two skies'
temperatures.](tut-hawking-ladder){#fig:hawking-ladder}

## A hovering observer near the horizon finds empty space warm

We see why the temperature has this form, without Hawking's calculation, by a plausibility argument that rests on
one stated result.

**Unruh's result** (stated). William Unruh found in 1976 that an observer who moves through empty space with a steady
**proper acceleration** $a$, the acceleration its own accelerometer reads, in $\mathrm{m\,s^{-2}}$, finds the vacuum
warm, at

$$\kB T = \frac{\hbar a}{2\pi c} .$$

It assumes that **space is empty and flat** and that **the acceleration never changes**. This is the **Unruh effect**.
An observer at rest finds nothing. To find 1 K, a thermometer would have to be pushed with
$2.5\times10^{20}\unit{m\,s^{-2}}$.

**Near the horizon.** A camera that hovers at $r$ reads section
[11.1](/tutorial/black-holes/schwarzschild/#at-the-schwarzschild-radius-clocks-stop-nothing-can-hover-and-nothing-gets-out)'s
acceleration $a = G\matter M/r^2\sqrt{1 - r_s/r}$, which grows without limit near the horizon. A small enough patch
of spacetime always looks flat, so we assume that Unruh's result holds in a patch round the hovering camera: it finds
a glow at $\hbar a/2\pi c\kB$.

**Carried far away.** Section 11.1's
[last section](/tutorial/black-holes/schwarzschild/#seen-from-rest-near-a-hole-the-whole-sky-is-warmer) found that a
sky at temperature $T$ far away is seen from rest at $r$ at $T/\sqrt{1 - r_s/r}$, because every frequency rises by that
factor. Read backwards, a glow at the temperature
$T_{\rm loc}$ near the hole reaches far away at $T_{\rm loc}\sqrt{1 - r_s/r}$. So far away the glow is at

$$\begin{aligned}
\kB T &= \frac{\hbar}{2\pi c}\,a\sqrt{1 - \frac{r_s}{r}}\\
&= \frac{\hbar}{2\pi c}\,\frac{G\matter M}{r^2} .
\end{aligned}$$

The square roots cancel, but the result still depends on $r$. Unruh's glow fills a region about $c^2/a$ across, and
near a hole space looks flat only over lengths small against $r_s$. So the flat patch holds only where
$c^2/a \ll r_s$, which is near the horizon, where $a$ grows without limit. The limit $r \to r_s$ is therefore a step
of the argument, not a choice, and in it the product tends to the **surface gravity**

$$\sym{horizon-surface-gravity}{\kappa} = \frac{G\matter M}{r_s^2} = \frac{c^4}{4G\matter M} ,$$

an acceleration in $\mathrm{m\,s^{-2}}$, which section 11.2 met in
[the first law](/tutorial/black-holes/spin/#the-area-of-a-horizon-never-shrinks-so-spin-holds-energy-that-can-be-taken-out).
Therefore

$$\boxed{\;\kB T_H = \frac{\hbar\kappa}{2\pi c} = \frac{\hbar c^3}{8\pi G\matter M}\;} ,$$

which is [](#eq:hawking) again. **Check:** $\hbar\kappa/c$ is $\mathrm{J\,s}\times\mathrm{m\,s^{-2}}$ over
$\mathrm{m\,s^{-1}}$, a joule. **Number:** for the hole of the equilibrium mass
$\kappa = 2.23\times10^{20}\unit{m\,s^{-2}}$, and $\hbar\kappa/2\pi c\kB = 0.905$ K. **What it means:** a hole is warm
because holding still near its horizon takes an enormous push, and a heavier hole is colder because its surface
gravity is weaker.

::: gap
This sketch skips Hawking's calculation itself. It follows quantum fields through the collapse of a star, and finds
that waves leaving from near the horizon are stretched so much by the redshift that a state empty before the collapse
is a thermal glow at $T_H$ far away afterwards. The sketch also uses Unruh's flat-space result near a hole, which is
fair only where $c^2/a$ is small against $r_s$: that is why it takes the limit $r \to r_s$. It does not show that the
glow flows outward. The GR course's section 22.7 names what the calculation needs beyond the geometry.
:::

**Entropy** (stated). Jacob Bekenstein argued in 1972 that a hole has an entropy in proportion to its area, and
Hawking's temperature fixed the constant in 1975. The **Bekenstein–Hawking entropy** is

$$\sym{hole-entropy}{S} = \frac{\kB Ac^3}{4G\hbar} = \frac{4\pi G\kB\matter M^2}{\hbar c} ,$$

in $\mathrm{J\,K^{-1}}$, with $A = 16\pi G^2\matter M^2/c^4$ section 11.2's area of the horizon.[^S] **Check with the
first law.** Section 11.2's first law without spin is $\dd(\matter Mc^2) = (\kappa c^2/8\pi G)\,\dd A$, and section
[10.2](/tutorial/glow/kirchhoff/#a-glow-carries-entropy-as-well-as-energy) writes heat taken in slowly as $T\,\dd S$.
Differentiating $S$ gives $\dd S = 8\pi G\kB\matter M\,\dd\matter M/\hbar c$, and multiplying by [](#eq:hawking),

$$\begin{aligned}
T_H\,\dd S &= \frac{\hbar c^3}{8\pi G\matter M\kB}\cdot\frac{8\pi G\kB\matter M}{\hbar c}\,\dd\matter M\\
&= c^2\,\dd\matter M .
\end{aligned}$$

So the first law's area term is the heat $T_H\,\dd S$, as section 11.2 said it would be.

## A hole that loses heat grows hotter, so its balance with a sky cannot last

**Heat capacity.** A body's
**heat capacity** $\sym{heat-capacity}{C} = \dd E/\dd T$, in $\mathrm{J\,K^{-1}}$, says how much its energy rises per
kelvin. For a hole $E = \matter Mc^2$, and [](#eq:hawking) gives $\dd T_H/\dd\matter M = -T_H/
\matter M$, so

$$\boxed{\;C = \frac{\dd(\matter Mc^2)}{\dd T_H} = -\frac{\matter Mc^2}{T_H}\;} .$$

It is negative: $-1.35\times10^{40}\unit{J\,K^{-1}}$ for the hole of the equilibrium mass, against
$+4.2\times10^3\unit{J\,K^{-1}}$ for a litre of water. A hole has a **negative heat capacity**.

**Why the balance is unstable.** Put a hole of the equilibrium mass in the 0.905 K graviton sky, and leave the
microwave sky aside for now. If the hole gains a little mass, it becomes colder than the sky, takes in more than it
gives, and grows heavier and colder still. If it loses a little, it becomes hotter, gives more than it takes, and grows
lighter and hotter. Either way it runs away from the balance. This is section 10.2's **unstable balance**.

**How fast a hole evaporates** (an estimate). A hole alone in empty space loses mass to its glow: it **evaporates**.
Section
[10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)'s
**Stefan–Boltzmann law** says that a black surface at $T$ sends out $\sym{stefan-boltzmann}{\sigma_{\rm SB}}T^4$ per
square metre, with $\sigma_{\rm SB} = 5.67\times10^{-8}\unit{W\,m^{-2}\,K^{-4}}$, for radiation of two polarizations. We
assume **geometric optics**: the hole takes every ray inside section 11.1's capture cross-section $\pi b_c^2 = 27\pi
G^2\matter M^2/c^4$ and no ray outside it. A sky at $T$ sends across each square metre, from all sides, the power
$c\,\mathcal U = 4\sigma_{\rm SB}T^4$, with $\mathcal U$ section 10.1's energy of the radiation per cubic metre. So in a
sky at its own temperature the hole takes in $\pi b_c^2\cdot4\sigma_{\rm SB}T^4$, as much as a black sphere of radius
$b_c$ takes through its surface $4\pi b_c^2$, and in balance it sends out as much. With [](#eq:hawking),

$$\begin{aligned}
P &= \frac{108\pi G^2\matter M^2}{c^4}\,\sigma_{\rm SB}T_H^4\\
&= \frac{9}{20480\pi}\,\frac{\hbar c^6}{G^2\matter M^2}
\end{aligned}$$

for one kind of quantum, such as photons. **Units:** $\hbar c^6/G^2\matter M^2$ is
$\mathrm{J\,s}\times\mathrm{m^6\,s^{-6}}$ over $\mathrm{m^6\,s^{-4}}$, a watt. The power grows as $1/\matter M^2$.
With $c^2\dd\matter M/\dd t = -P$, we separate the variables, $\matter M^2\dd\matter M \propto -\dd t$, and integrate
from $\matter M$ down to zero. The lifetime is

$$t = \frac{20480\pi}{27}\,\frac{G^2\matter M^3}{\hbar c^4} ,$$

which grows as $\matter M^3$. **Number:** in photons alone the hole of the equilibrium mass would glow with
$1.3\times10^{-13}$ W and live $10^{45}$ years, $7\times10^{34}$ times the age of the universe. As it evaporates, its
area $A = 16\pi G^2\matter M^2/c^4$ shrinks, against section 11.2's
[area theorem](/tutorial/black-holes/spin/#the-area-of-a-horizon-never-shrinks-so-spin-holds-energy-that-can-be-taken-out).
The theorem assumes that the energy every observer measures is never negative, and quantum fields break this
condition: near the horizon they carry negative energy into the hole (stated). The lifetime is an estimate, and a
generous one. The greybody factors of [the next section](#mode-by-mode-a-hole-is-a-grey-body) change its number but
not the powers of $\matter M$: for gravitons they give 2.7% of this power, and Page found about a quarter of it for
photons (stated).

**Against the microwave sky** (an upper bound). The hole is colder than the 2.7255 K microwave sky, so in light it
gains. Its cross-section for light is at most about $\pi b_c^2 = 8.6\times10^{-7}\unit{m^2}$, and for that sky
$c\,\mathcal U = 4\sigma_{\rm SB}T^4 = 1.25\times10^{-5}\unit{W\,m^{-2}}$. The product is at most $1.1\times10^{-11}$
W. Divided by $\matter Mc^2 = 1.2\times10^{40}$ J, it is $8.8\times10^{-52}$ of the hole's mass each second, less than a part in $10^{51}$. The hole's own glow in light is smaller, by about $(0.905/2.7255)^4 = 1/82$.

## Mode by mode, a hole is a grey body

**The definition.** A **mode** is section 8.3's single pattern of a wave, here one of angular frequency $\omega$ and
of degree $\ell$ round the hole (section 2.2's harmonics; $\ell \ge 2$ for gravitons). Its **occupation** is the mean
number of quanta it holds. A wave in one mode that comes in from far away loses the share
$\sym{greybody-factor}{\Gamma_\ell(\omega)}$ of its quanta to the hole, and the rest is scattered back out.[^Gamma]
This share is the **net absorption**, absorption less the emission that the incoming wave stimulates, like section
[10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)'s
$\alpha$ for matter. For a hole that does not spin it is a pure number from 0 to 1. $\Gamma_\ell$ is the hole's
**greybody factor**: for $\ell = 2$ it is section 4.5's "fraction of a quadrupole wave". A black body would have
$\Gamma = 1$ in every mode; a body that takes only part of each is a **grey body**.

**Detailed balance for one mode** (recalled from section 10.2). Matter emits in proportion to one more than the quanta
present: the quanta present stimulate part of the emission, which the net absorption already counts, and the 1 is the
**spontaneous emission**, which does not depend on what comes in. In a closed box at the matter's temperature every
absorption is matched by an emission, which is **detailed balance**. We assume that **the hole glows as matter at $T_H$
does**, and use the box to find how much. The occupation of a mode at the hole's
temperature is section 8.3's

$$\sym{hole-occupation}{n_H} = \frac{1}{e^{\hbar\omega/\kB T_H} - 1} .$$

Put the hole in a box at $T_H$. The mode comes in with $n_H$ quanta, the hole's net absorption takes $\Gamma_\ell n_H$,
and the share $(1 - \Gamma_\ell)n_H$ is scattered out. Balance requires $n_H$ to go out, so the hole's spontaneous
emission is $\Gamma_\ell n_H$. That emission does not depend on what comes in, so it is $\Gamma_\ell n_H$ in any sky.

**The bookkeeping.** Now let the sky send in $\sym{background-occupation}{n_{\rm bg}}$ quanta per mode. What a camera
receives from the hole in that mode is the scattered share plus the hole's own emission (Figure
[](#fig:hawking-mode)):

$$\boxed{\begin{aligned}
n_{\rm out} &= (1 - \Gamma_\ell)\,n_{\rm bg} + \Gamma_\ell n_H\\
&= n_{\rm bg} + \Gamma_\ell\,(n_H - n_{\rm bg})
\end{aligned}} \label{eq:bookkeeping}$$

**Limits.** At $T_H = T_{\rm bg}$, $n_H = n_{\rm bg}$ and nothing
changes: the hole cannot be seen in gravitons at all. At $T_H \to 0$, $n_{\rm out} = (1 - \Gamma_\ell)n_{\rm bg}$, a
pure absorber. At $\Gamma_\ell = 1$, $n_{\rm out} = n_H$, a black body.

**Long waves.** When $\hbar\omega \ll \kB T_H$, $n_H \approx \kB T_H/\hbar\omega \gg 1$. Then the quanta the hole emits into the
mode, $\Gamma_\ell n_H$, and the quanta it absorbs for each quantum that comes in, $\Gamma_\ell(n_H + 1)$ before
stimulated emission is taken away, are both $\Gamma_\ell\kB T_H/\hbar\omega$. Here $\hbar\omega/\kB T_H = 8\pi
G\matter M\omega/c^3$ ([section 8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give)).
This makes the hole's near field a thermometer: a camera beside the hole reads $T_H$ from it without catching a single
graviton, as sections
[11.4](/tutorial/black-holes/under-tides/#the-friction-trembles-at-the-holes-temperature) and
[13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)
show.

![Look first at the two arrows that leave: what the hole scatters and what it emits of its own add up to what the
camera receives. The arrow into the horizon is the net absorption, stimulated emission taken away. The arrows are
schematic; their widths follow the bookkeeping for one example.](tut-hawking-mode){#fig:hawking-mode}

**Where $\Gamma_\ell$ comes from** (stated, and solved by numbers). We write $x = G\matter M\omega/c^3$,
a pure number local to this section, which compares the hole's size with the reduced wavelength $c/\omega$
(section 10.1's $\hbar\omega/\kB T$ is here $8\pi x$ at the hole's temperature). A gravitational wave of degree
$\ell$ round a hole obeys the **Regge–Wheeler equation** (Regge and Wheeler, 1957), a wave equation on one line with a
barrier:

$$\frac{\dd^2\psi}{\dd r_*^2} + \Bigl[\frac{\omega^2}{c^2} - V_\ell(r)\Bigr]\psi = 0 ,$$

with

$$V_\ell(r) = \Bigl(1 - \frac{r_s}{r}\Bigr)\Bigl[\frac{\ell(\ell + 1)}{r^2} - \frac{6G\matter M}{c^2r^3}\Bigr] .$$

Here $\psi(r_*)$ is the wave's amplitude, $V_\ell$ the barrier in $\mathrm{m^{-2}}$, and $r_*$ the **tortoise
coordinate**, in metres, defined in the box below. The barrier peaks near 11.1's photon sphere, as the barrier for rays
did. A wave whose $\omega^2/c^2$ lies below the peak is mostly reflected, and one above it mostly passes in.

**Where the equation comes from** (a sketch). Regge and Wheeler wrote a small change of 11.1's metric with a pattern
of degree $\ell$ whose sign under a mirror is opposite to that of section 2.2's harmonic of that degree, the **odd** or
**axial** parity, put it into Einstein's equation for
empty space to first order, as section 7.4 did about flat spacetime, and combined the equations that remain into the
one above (stated). Two limits check it. Without the hole, $r_s \to 0$, the tortoise coordinate is $r$ and the
barrier is $\ell(\ell + 1)/r^2$, so the equation becomes $\psi'' + [\omega^2/c^2 - \ell(\ell + 1)/r^2]\psi = 0$: the
radial equation of a free wave of degree $\ell$, whose solution is $r$ times a spherical Bessel function. For large
$\ell$, the term $\ell(\ell + 1)/r^2$ outweighs $6G\matter M/c^2r^3$, and a quantum's angular momentum $\hbar\ell$ is
its momentum $\hbar\omega/c$ times its impact parameter $b$, so $\ell(\ell + 1) \approx (\omega b/c)^2$ and the bracket
of the equation becomes

$$\frac{\omega^2}{c^2}\Bigl[1 - b^2\,\frac{1 - r_s/r}{r^2}\Bigr] .$$

Its zero is 11.1's
[barrier for rays](/tutorial/black-holes/schwarzschild/#light-can-circle-a-hole-and-the-hole-casts-a-shadow), which
peaks at the photon sphere, $1.5\,r_s$. A short wave therefore meets the barrier that a ray meets. The term in
$6G\matter M/c^2r^3$ belongs to the wave's spin of two; at $\ell = 2$ it moves the peak out to $1.64\,r_s$.

::: derivation
### The tortoise coordinate and the solution

The tortoise coordinate is $r_* = r + r_s\ln(r/r_s - 1)$, which puts the horizon at $r_* = -\infty$. There, and far
away, $V_\ell \to 0$. At the horizon a wave can only go in, $\psi = e^{-i\omega r_*/c}$, and far away it is
$A_{\rm in}e^{-i\omega r_*/c} + A_{\rm out}e^{i\omega r_*/c}$. The flux is conserved, so $|A_{\rm in}|^2 -
|A_{\rm out}|^2 = 1$ and $\Gamma_\ell = 1/|A_{\rm in}|^2$. Zerilli's equation for the other polarization gives the
same $\Gamma_\ell$ (stated).
:::

**Its two ends.** For long waves the absorption tends to **Page's limit** (Don Page, 1976, stated; section
[11.4](/tutorial/black-holes/under-tides/#the-same-friction-absorbs-long-gravitational-waves)
derives it from the horizon's friction):

$$\boxed{\;\Gamma_2 \to \frac{256}{225}\,x^6\;} \qquad (x \to 0) .$$

At $x = 0.1$, $\Gamma_2 = 3.1\times10^{-6}$. For short waves every ray inside $b_c$ is taken. A wave of degree $\ell$
has about $\hbar(\ell + \tfrac12)$ of angular momentum per quantum, which is its momentum $\hbar\omega/c$ times its
impact parameter $b$, so $b \approx (\ell + \tfrac12)c/\omega$. Degree $\ell$ therefore fills the ring from
$\ell c/\omega$ to $(\ell + 1)c/\omega$, of area $\pi(2\ell + 1)c^2/\omega^2$. The **absorption cross-section** adds
the rings, each weighted by its share absorbed:

$$\begin{aligned}
\sym{absorption-cross-section}{\sigma_{\rm abs}} &= \frac{\pi c^2}{\omega^2}\sum_{\ell\ge2}(2\ell + 1)\,\Gamma_\ell\\
&\to \frac{27\pi G^2\matter M^2}{c^4} ,
\end{aligned}$$

in square metres. When $\Gamma_\ell = 1$ up to $\ell + \tfrac12 = \omega b_c/c$ and 0 beyond, the sum is $\pi b_c^2$.
Solved by numbers, $\sigma_{\rm abs}$ reaches the capture cross-section near $x = 1$ and then swings about it by a few
per cent (Figure [](#fig:hawking-greybody)).

![Look first at the left panel's $\ell = 2$ curve and its dashed partner, on logarithmic axes: long waves are absorbed
as Page's $x^6$. On the right, the partial-wave sum climbs to the capture cross-section once the waves are shorter than
the hole. Curves from the Regge–Wheeler equation.](tut-hawking-greybody){#fig:hawking-greybody}

## Integrated step by step, the Regge–Wheeler equation gives every greybody factor {#integrated-step-by-step-the-regge-wheeler-equation-gives-every-greybody-factor}

We want $\Gamma_\ell(x)$ as numbers, because the depth of a shadow and a hole's reply to a tide are integrals over
them, and no formula gives them between the two ends. We find them by a **shooting integration**: we start the wave
where its form is known, at the horizon, carry it outward step by step, and read off far away how much had to come
in.[^shoot]

**The equation in the hole's units.** We measure lengths in units of $G\matter M/c^2$, so that $r_s = 2$, $r_* = r +
2\ln(r/2 - 1)$, and the frequency $\omega/c$ becomes $x$. The equation is then

$$\psi'' + \bigl(x^2 - V_\ell\bigr)\psi = 0, \qquad V_\ell = \Bigl(1 - \frac2r\Bigr)\Bigl[\frac{\ell(\ell + 1)}{r^2}
- \frac{6}{r^3}\Bigr] ,$$

with a prime a derivative with respect to $r_*$, and every quantity a pure number.

**The start.** Close outside the horizon, at $r_0 = 2(1 + 10^{-6})$, the barrier is five millionths of its peak and
the wave only goes in: $\psi = e^{-ixr_*}$, and its derivative $\phi = \psi' = -ix\psi$. A start ten times closer
changes $\Gamma_\ell$ by less than $10^{-4}$ of itself.

**The steps.** We carry $\psi$ and $\phi$ outward in $r$ rather than in $r_*$, which runs to $-\infty$ at the horizon.
Since $\dd r_*/\dd r = 1/(1 - 2/r)$, the equation becomes the pair

$$\frac{\dd\psi}{\dd r} = \frac{\phi}{1 - 2/r}, \qquad \frac{\dd\phi}{\dd r} = \frac{(V_\ell - x^2)\,\psi}{1 - 2/r} ,$$

four real equations for the real and imaginary parts. Any accurate method with an adjustable step will do, such as a
Runge–Kutta method of eighth order held to a relative error of $10^{-10}$ per step.

**The end.** We stop at $r_{\max} = 4000/x$, where the barrier is below a millionth of $x^2$, so that the wave is a
sum of one going in and one going out, $A_{\rm in}e^{-ixr_*} + A_{\rm out}e^{ixr_*}$. Its value and its derivative there
give the two amplitudes,

$$A_{\rm in} = \tfrac12\Bigl(\psi - \frac{\phi}{ix}\Bigr)e^{ixr_*}, \qquad A_{\rm out} = \tfrac12\Bigl(\psi +
\frac{\phi}{ix}\Bigr)e^{-ixr_*} ,$$

as substituting the sum shows. Then $\Gamma_\ell = 1/|A_{\rm in}|^2$, and the flux law of the box, $|A_{\rm in}|^2 -
|A_{\rm out}|^2 = 1$, checks the whole integration: wherever $\Gamma_\ell$ is not tiny it holds to better than
$10^{-8}$.

**The results.**

| $x = G\matter M\omega/c^3$ | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.8 | 1.0 |
|---|---|---|---|---|---|---|---|---|
| $\Gamma_2$ | $3.06\times10^{-6}$ | $8.68\times10^{-4}$ | 0.0548 | 0.690 | 0.985 | 0.9993 | 1.000 | 1.000 |
| $\Gamma_3$ | $6.73\times10^{-11}$ | $7.28\times10^{-8}$ | $1.04\times10^{-5}$ | $6.74\times10^{-4}$ | 0.0280 | 0.486 | 0.998 | 1.000 |
| $\Gamma_4$ | $1.50\times10^{-15}$ | $6.31\times10^{-12}$ | $1.95\times10^{-9}$ | $2.17\times10^{-7}$ | $1.39\times10^{-5}$ | $6.31\times10^{-4}$ | 0.411 | 0.998 |

Each degree rises from 1% to 99% within about a factor of two in frequency, and each higher degree rises
later, because its barrier is higher.

**Long waves, checked by hand.** For $x \ll 1$ every degree approaches Page's form (Starobinsky and Churilov, 1974;
Page, 1976; stated),

$$\Gamma_\ell \to 4\Bigl[\frac{(\ell - 2)!\,(\ell + 2)!}{(2\ell)!\,(2\ell + 1)!!}\Bigr]^2(2x)^{2\ell + 2} ,$$

with $(2\ell + 1)!! = 1\cdot3\cdot5\cdots(2\ell + 1)$. At $\ell = 2$ the bracket is $(1\times24)/(24\times15) = 1/15$,
and $4\times2^6/225 = 256/225$: the boxed limit above. At $\ell = 3$ it is $1\times120/(720\times105) = 1/630$, which
gives $0.00258\,x^8$. The integration exceeds the form by a factor that tends to one as about $1 + 2\pi x$, for both
degrees: 1.013 at $x = 0.002$ and 1.07 at 0.01. At $x = 0.1$ it is still 2.7 times Page's form, so the form serves only
for waves much longer than the hole. The power $2\ell + 2$ has a reason. By the free radial equation above, a long wave
of degree $\ell$ grows from the centre as $(\omega r/c)^{\ell + 1}$, so near the hole its amplitude is of order
$x^{\ell + 1}$ of its value far away, and the share of its flux that reaches the horizon is of order the square,
$x^{2\ell + 2}$.

**The barrier's top, checked by hand.** For $\ell = 2$ the barrier peaks at $r = 3.28\,G\matter M/c^2$, where $V_2 =
0.151$, so a wave passes over it once $x$ exceeds $\sqrt{0.151} = 0.389$. The integration gives $\Gamma_2 = \tfrac12$ at
$x = 0.377$, 3% lower: near its top the barrier is thin, and a wave a little below the top partly passes.

**The moments.** Part 13 weighs a hole's reply to a tide by integrals of $\Gamma_\ell$ against powers of $x$. On the
computed values they are taken by Simpson's rule in $\ln x$, on a hundred or more values of $x$ spaced evenly in
$\ln x$ across each rise, with Page's form below them and $\Gamma_\ell = 1$ above, the two ends moving each integral by less
than $10^{-4}$ of itself. For degree two,

$$\boxed{\;\int_0^\infty\frac{\Gamma_2}{x^4}\,\dd x = 6.938 , \qquad \int_0^\infty\frac{\Gamma_2}{x^6}\,\dd x =
36.13\;} ,$$

and the first integrand, $\Gamma_2/x^4$, is greatest at $x = 0.40$, close above the barrier's top. For
$\ell = 3$, 4, 5 and 6, $\int_0^\infty\Gamma_\ell\,x^{-2\ell}\,\dd x = 2.865$, $0.7059$, $0.1127$ and $0.01249$.
**An estimate by hand:** if $\Gamma_2$ were a step from 0 to 1 at the barrier's top, $x_0 = 0.389$, the first integral
would be $\int_{x_0}^\infty x^{-4}\,\dd x = 1/3x_0^3 = 5.66$, 18% below the computed value. The waves that pass a
little below the top, weighted by the steep $x^{-4}$, outweigh those reflected a little above it. **What they mean:**
section
[13.7](/tutorial/what-a-field-keeps/thermometer/#a-holes-response-has-the-weight-of-a-shell-a-little-outside-its-horizon)
turns these integrals into the weight of the hole's reply to a tide, $(5/32\pi)\times6.938\,\matter Mr_s^2 =
0.345\,\matter Mr_s^2$, into the radii 1.02, 1.46, 1.61, 1.69 and $1.73\,r_s$ of the shells of the hole's mass that
answer tides of degree 2 to 6 as the hole does, and into the Love number $(15/128\pi)\times36.13 = 1.35$ that a body
with the hole's absorption would have.

## A shadow stays pale while the sky's gravitons are long

We want how dark a hole looks against a uniform sky, because the depths of the camera's shadows depend on it. Mode by mode, the
bookkeeping [](#eq:bookkeeping) removes $\Gamma_\ell(n_{\rm bg} - n_H)$ quanta. Each quantum carries the energy
$\hbar\omega$, and the number of modes per unit of frequency grows as $\omega^2$ (section 10.1), so the energy
removed at each frequency is weighted by $\omega^3$, that is by $x^3$. The **shadow depth** $D$ is the energy the
hole removes from the sky, net of its own glow, divided by what a black disc of the area $27\pi G^2\matter M^2/c^4$
would remove:

$$D = \frac{\int_0^\infty\sigma_{\rm abs}\,(n_{\rm bg} - n_H)\,x^3\,\dd x}{27\pi(G\matter M/c^2)^2\int_0^\infty
n_{\rm bg}\,x^3\,\dd x} .$$

$D$ is a pure number, local to this section (not the camera's width). The two occupations depend on $x$ through
$\hbar\omega/\kB T_H = 8\pi x$ and $\hbar\omega/\kB T_{\rm bg} = 8\pi x\,\matter M_{\rm eq}/\matter M$, since
$T_H/T_{\rm bg} = \matter M_{\rm eq}/\matter M$. **Inputs:** the last section's $\Gamma_\ell$ for $\ell = 2$ to 40,
and the sky at 0.905 K. **Method:** the integrals are summed over $x$ from 0 to 6, with the capture cross-section
beyond. **Results:**

$$\boxed{\;D = 0.93,\ 0.54,\ 0.29 \quad\text{for}\quad \matter M = 10,\ 3,\ 2\ \matter M_{\rm eq}\;} .$$

These are depths in energy. The depth reaches 0.99 at 27 times the equilibrium
mass, and above about a hundred times, $10^{25}$ kg, the hole is black. At the equilibrium mass $D = 0$, and a lighter
hole has $D < 0$: it glows.

**Why the shadow is pale.** The sky's energy peaks at $\hbar\omega = 2.82\,\kB T$, 53 GHz, where the gravitons are 5.6
mm long. A hole of twice the equilibrium mass has a capture disc 2.1 mm across,
and for it the peak lies at $x = 0.22$. There the hole takes only 0.2% of the degree $\ell = 2$, and less of the
others. Only the upper tail of the sky's spectrum, above $x \approx 0.4$, is taken well, so most of the sky's energy
passes the hole. Geometric optics needs $x$ of about 1, a hole near ten times the equilibrium mass. The hole's own
glow takes away a little more depth, since it adds $\Gamma_\ell n_H$ to every mode.

**Counted instead of weighed.** With $x^2$ in the place of $x^3$, the same holes are 82%, 32% and 14% as dark as the
disc. The long waves that the hole lets through are many but carry little energy, so a counting pixel (section
[8.5](/tutorial/quantum/counting-quanta/#counting-adds-no-noise-but-needs-quanta)) sees a paler shadow than a pixel
that weighs energy.

::: try {#hole-against-sky}
The upper panel draws, against $x$, the sky's energy $n_{\rm bg}x^3$, the hole's own $n_Hx^3$ dashed, and, shaded,
what the hole takes from the sky or adds to it. The lower panel shows the capture disc on a uniform sky, weighed in
energy and counted in quanta. A slider sets the hole's mass, from 0.3 to 300 equilibrium masses, and a switch sets the
sky, gravitons at 0.905 K or light at 2.7255 K. The depths stay covered until you press Show the depths.

Predict first: against the microwave sky's light, is a hole of twice the equilibrium mass darker or paler than against
the graviton sky? At what mass does it vanish in light? Switch the sky and drag the mass to check, then show the
depths.
:::

## A spinning hole can be brighter than any sky

We want to know what spin changes, because a spinning hole can look brighter than the sky. Section
[11.2](/tutorial/black-holes/spin/#a-hole-amplifies-a-wave-that-turns-with-it-more-slowly-than-its-horizon) found that
a wave turning round the axis as $e^{im\varphi}$, with $\sym{order}{m}$ its azimuthal number, is amplified when
$0 < \omega < m\Omega_H$, with $\Omega_H$ the angular velocity of the horizon. For such modes the greybody factor
$\Gamma_{\ell m}$ is negative: the hole returns more than comes in.

**The occupation of a spinning hole.** Seen from the turning horizon the wave's frequency is
$\omega - m\Omega_H$, the turning form of section
[6.3](/tutorial/relativity/aberration/#light-from-ahead-is-bluer-and-light-from-behind-is-redder)'s Doppler shift, so
$n_H$ is taken there:

$$n_H = \frac{1}{e^{\hbar(\omega - m\Omega_H)/\kB T_H} - 1} ,$$

with the temperature of a spinning hole $\kB T_H = \hbar\kappa/2\pi c$, section 11.2's surface gravity $\kappa$ in the
place of $c^4/4G\matter M$.

**Both from the first law.** We assume that **the Bekenstein–Hawking entropy $S = \kB Ac^3/4G\hbar$ holds for every
hole**, spinning or not (Hawking, 1975; stated). When a spinning hole takes in the energy $\dd E$ and the angular
momentum $\dd\matter J$, section 11.2's first law gives the growth of its area, and with it of its entropy:

$$\frac{\kappa c^2}{8\pi G}\,\dd A = \dd E - \Omega_H\,\dd\matter J , \qquad \dd S = \frac{\kB c^3}{4G\hbar}\,\dd A .$$

Heat taken in slowly is $T\,\dd S$ (section 10.2), and the heat here is the left side, so $T_H\,\kB c^3/4G\hbar =
\kappa c^2/8\pi G$, that is

$$\boxed{\;\kB T_H = \frac{\hbar\kappa}{2\pi c}\;} ,$$

the form found above for a hole without spin. With 11.2's $\kappa = c^2\sqrt{(G\matter M/c^2)^2 - a^2}/(r_+^2 + a^2)$
and $r_+^2 + a^2 = 2(G\matter M/c^2)^2(1 + \sqrt{1 - \chi^2})$,

$$\kappa = \frac{c^4}{4G\matter M}\,\frac{2\sqrt{1 - \chi^2}}{1 + \sqrt{1 - \chi^2}} .$$

**Check:** at $\chi = 0$ the second factor is 1. **Numbers:** the factor is 0.833 at $\chi = 0.7$, 0.119 at 0.998
and 0 at the greatest spin, so a spinning hole is colder than one of the same mass without spin, and a hole at the
greatest spin is at absolute zero. For the occupation, put the hole in the place of section
[4.2](/tutorial/response/temperature/#the-chance-of-a-state-falls-exponentially-with-its-energy)'s heat bath. A state
of the mode with $N$ quanta has taken from the hole the energy $N\hbar\omega$ and the angular momentum $Nm\hbar$
(section 11.2's ratio), and by the first law the hole's entropy is lower by $N\hbar(\omega - m\Omega_H)/T_H$. That
state is therefore less likely by the factor $e^{-N\hbar(\omega - m\Omega_H)/\kB T_H}$, which is section 8.3's
weight with $\hbar(\omega - m\Omega_H)$ in the place of $\hbar\omega$, and summing over $N$ as section 8.3 did gives
the $n_H$ above. This is the detailed balance of the turning horizon. Below the threshold the factor grows with $N$,
and no balance exists.

If $\omega < m\Omega_H$, the exponent is negative, the exponential is less than
1, and $n_H < 0$. Far below the threshold $n_H \approx -1$. Below the threshold, then, $\Gamma_{\ell m}$ is not a
share from 0 to 1 and $n_H$ is not a mean number of quanta: they are formal numbers, and only their product, the
change in what comes out, is physical. Both factors of $\Gamma_{\ell m}(n_H - n_{\rm bg})$ are negative, and their
product is positive:

$$n_{\rm out} - n_{\rm bg} = \Gamma_{\ell m}\,(n_H - n_{\rm bg}) > 0 .$$

Those modes come out brighter than the sky, whatever the temperatures. With $n_H = -1$, $n_{\rm out} = n_{\rm bg} +
|\Gamma_{\ell m}|(n_{\rm bg} + 1)$: the sky's quanta are amplified, and the hole adds $|\Gamma_{\ell m}|$ quanta of its
own, as section 10.2's matter with an inverted population, a maser, amplifies a wave.

**Numbers.** With the greatest gain of 91% for the mode $\ell = m = 2$ at section 11.2's spin $\chi = 0.998$
(from Teukolsky's equation, stated), a hole of ten times the equilibrium mass returns
$0.110 + 0.91\times1.128 = 1.14$ gravitons at $x = 0.92$, where $n_H = -1.018$ and the sky holds 0.11:
ten times the sky.[^bright] At $\chi = 0.7$ the greatest gain is 0.27%, near $x \approx 0.37$, and there the mode is
about 0.9% brighter, under one per cent.

**The idea to keep: a black hole glows at $\kB T_H = \hbar c^3/8\pi G\matter M$, the warmth that a hovering
observer finds near the horizon, carried out to infinity. Mode by mode it is a grey body that adds
$\Gamma_\ell(n_H - n_{\rm bg})$ to the sky, so a hole at the sky's temperature vanishes, and a heavier one casts a
shadow that stays pale until the hole is far heavier.**

::: problems
### Practice

**[11.3]** A hole of $10^{12}$ kg: find $T_H$, the mean energy of one of its quanta, $2.70\,\kB T_H$ (section 10.1), and its
lifetime by the [evaporation estimate](#a-hole-that-loses-heat-grows-hotter-so-its-balance-with-a-sky-cannot-last).

::: solution
$T_H = 1.2\times10^{11}$ K; $2.70\,\kB T_H = 4.6\times10^{-12}$ J, or 29 MeV; and $t = 4\times10^{11}$ years. A hole
this hot also sends out electrons, positrons and neutrinos, so it loses mass several times faster (Page, stated).
:::

**[11.3]** What mass of hole has the temperature of the 2.7255 K microwave sky?

::: solution
$\matter M = \hbar c^3/8\pi G\kB T = 4.5\times10^{22}$ kg, about 0.6 Moon masses.
:::

**[11.3]** Why is a hole of twice the equilibrium mass only 29% as dark as its disc?

::: solution
Most of the sky's energy is in waves too long for the hole to absorb fully, and the hole adds its own glow.
:::

**[11.3]** A hole of ten solar masses spins at $\chi = 0.7$. Find its Hawking temperature, and compare it with that of
a hole of the same mass that does not spin.

::: solution
Without spin, $T_H = 6.2\times10^{-9}$ K. With $\sqrt{1 - 0.49} = 0.714$, the factor $2\times0.714/1.714 = 0.833$
gives $5.1\times10^{-9}$ K: the spin cools the hole by a sixth.
:::

### Stretch

**[11.3]** With section 10.2's heat capacity, show that a hole of mass $\matter M$ in a closed box of radiation at its
own temperature, with the total energy fixed, can stay in balance if the radiation's energy $E_r$ is small enough. Find
the condition.

::: solution
If the hole takes $\dd E$ from the radiation, the hole cools by $\dd E/|C|$ and the radiation by $\dd E/C_r$, with the
radiation's $C_r = 4E_r/T$, since $E_r \propto T^4$. The hole is then colder and keeps taking unless the radiation
cools faster, $C_r < |C| = \matter Mc^2/T$. So the balance is stable when $E_r < \matter Mc^2/4$ (Hawking, 1976).
:::

**[11.3]** Estimate $\int_0^\infty\Gamma_2x^{-6}\,\dd x$ by a step from 0 to 1 at the barrier's top, $x_0 = 0.389$,
compare it with the computed 36.13, and say why this estimate falls further short than the one for $x^{-4}$.

::: solution
The step gives $\int_{x_0}^\infty x^{-6}\,\dd x = 1/5x_0^5 = 22.5$, 38% short, against 18% for $x^{-4}$. The weight
$x^{-6}$ grows faster toward small $x$, so it counts more heavily the waves that pass a little below the top, which
the step leaves out.
:::

### The camera

**[11.3]** Show that $n_{\rm out} - n_{\rm bg} = \Gamma_\ell(n_H - n_{\rm bg})$ follows from detailed balance. Then, with
$\Gamma_2(0.3) = 0.055$, find what fraction of the $\ell = 2$ mode at $x = 0.3$ the hole absorbs, and what it returns
when $\matter M = 2\matter M_{\rm eq}$.

::: solution
The [closed box](#mode-by-mode-a-hole-is-a-grey-body) gives the emission $\Gamma_\ell n_H$, and the scattered share
is $(1 - \Gamma_\ell)n_{\rm bg}$. The hole absorbs 5.5% of the mode. At $\matter M = 2\matter M_{\rm eq}$,
$8\pi x = 7.54$, so $n_H = 5.3\times10^{-4}$ and $n_{\rm bg} = 1/(e^{3.77} - 1) = 0.0236$; the mode returns
$0.0236 - 0.055\times0.0231 = 0.0223$, 5.4% less than the sky.
:::
:::

::: paper
- [Section XI](/paper/#sec:vistas), [*A primordial graviton background*](/paper/#par:a-primordial-graviton-background):
  the Hawking temperature, $1.356\times10^{23}$ kg, the bookkeeping, the greybody factors, the depths and the spinning
  hole brighter than the sky.
- [Section VII](/paper/#sec:no-lens): the hole in balance with the graviton sky, its gain of less than a part in
  $10^{51}$, and the instability of the balance.
- [Section XIV](/paper/#sec:hole): the classical absorption times $k_BT/\hbar\omega$ and the temperature of
  [](/paper/#eq:hole-thermometer). [Section XV](/paper/#sec:holography): a hole's tremor is of order $\hbar$.
:::

::: deeper
- The GR course's section
  [22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature) says what
  Hawking's calculation needs beyond the geometry, section
  [22.8](https://neovand.github.io/general-relativity/chapter-22.html#22-8-entropy-is-written-in-area) derives the
  entropy from the first law, and section
  [23.7](https://neovand.github.io/general-relativity/chapter-23.html#23-7-the-semiclassical-equation-and-its-limits)
  says when quantum fields on a classical metric can be trusted.
- S. W. Hawking, "Particle creation by black holes", *Communications in Mathematical Physics* 43 (1975) 199, the
  result itself; D. N. Page [@Page1976; @Page1976b], the emission rates and greybody factors.
- R. M. Wald, *Quantum Field Theory in Curved Spacetime and Black Hole Thermodynamics* (Chicago, 1994), the full
  treatment.
:::

[^hawk]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XI](/paper/#sec:vistas), which gives the
    hole's temperature, the bookkeeping and the depths, and [Sec. VII](/paper/#sec:no-lens), which discusses
    the balance. Its equation [](/paper/#eq:hole-thermometer) has the same temperature.

[^S]: This $S$ is an entropy, not the tidal column $S(\hat n)$ or a spectrum, which always carries subscripts.

[^shoot]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XIV](/paper/#sec:hole), whose equation
    [](/paper/#eq:hole-sum-rule) and Figure [](/paper/#fig:hole-response) use these integrals.

[^Gamma]: Not section 4.1's damping rate $\Gamma$ nor section 7.1's Christoffel symbols.

[^bright]: The ratio, 10.3 at $x = 0.92$, depends steeply on the frequency, from 8.7 at
    $x = 0.85$ to 12 at 0.93, close to the threshold $2\Omega_H$.
