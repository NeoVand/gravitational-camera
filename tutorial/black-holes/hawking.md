---
id: '11.3'
title: 'Hawking radiation'
question: 'Section XI says that a black hole "gives off a faint glow of its own, at a Hawking temperature that is lower for heavier holes", and that a hole of $1.36\times10^{23}$ kilograms "cannot be seen against the glow at all". What is a black hole''s temperature, why does a hole glow at all, and how dark is its shadow against a warm sky?'
part: '11'
requires: ['4.2', '8.3', '11.1', '11.2']
paper: [sec:vistas, fig:black-hole, sec:no-lens, fig:black-hole-camera, sec:hole, eq:hole-thermometer, sec:holography]
figures: [fig:black-hole]
live: [hole-against-sky]
depth: C
---

**What you need:** chapter [11.1](/tutorial/black-holes/schwarzschild/) (the Schwarzschild metric, the hovering
acceleration, the capture cross-section and the warmer sky), chapter [11.2](/tutorial/black-holes/spin/) (spin, the
surface gravity and the first law), chapter
[4.2](/tutorial/response/temperature/)'s temperature and chapter
[8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)'s modes
and their thermal occupation. Chapters [10.1](/tutorial/glow/black-body/) and [10.2](/tutorial/glow/kirchhoff/) help,
and what we take from them is recalled where it is used.

Panel (b) of the paper's Figure [](/paper/#fig:black-hole) shows the sky of primordial gravitons as a camera at rest
$40\,G\matter M/c^2$ from a black hole sees it: a nearly uniform glow at 0.929 K, with one black disc. (The sky far
away is at 0.905 K, and chapter 11.1 found that
[it looks warmer](/tutorial/black-holes/schwarzschild/#seen-from-rest-near-a-hole-the-whole-sky-is-warmer) from rest
near a hole.) The paper's [Section XI](/paper/#sec:vistas) then says that the disc need not be there. A hole of
$1.36\times10^{23}$ kilograms, nearly twice the Moon's mass, "gives back as much as it receives, and so it cannot be
seen against the glow at all".

{{paper fig:black-hole}}

So we ask what a black hole's temperature is, why a hole glows at all, and how dark its shadow is against a warm sky.
The answers decide which holes the camera can see in gravitons, and how deep their shadows are.

::: plain
A black hole is not perfectly black. Quantum mechanics makes it glow faintly, like a warm body, at a temperature called
the Hawking temperature. A heavier hole is colder. A hole of about twice the Moon's mass is at 0.905 kelvin, the
temperature of the paper's sky of gravitons.

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
on the classical metric** of chapter 11.1, which is not itself treated by quantum mechanics, and that **the hole is far
heavier than the Planck mass** $\sqrt{\hbar c/G} = 2.2\times10^{-8}$ kg, so that its glow changes it slowly. The
paper's [](/paper/#eq:hole-thermometer) has the same right side, and chapter 13.7 reads it.

**Units.** $\hbar c^3/G\matter M$ is $\mathrm{J\,s}\times\mathrm{m^3\,s^{-3}}$ divided by $\mathrm{m^3\,kg^{-1}\,s^{-2}}
\times\mathrm{kg}$, which is a joule, as an energy $\kB T_H$ must be. **Limit:** as $\hbar \to 0$, $T_H \to 0$. Without
quantum mechanics a hole is at absolute zero and perfectly black, as chapter 11.1 found it.

**Numbers.** A hole of the Sun's mass is at $6.2\times10^{-8}$ K, 44 million times colder than the microwave sky.
Solving [](#eq:hawking) for the mass gives $\matter M = \hbar c^3/8\pi G\kB T_H$. At 0.905 K, the graviton sky of
chapter 12.2, it is the **equilibrium mass**

$$\sym{equilibrium-mass}{\matter M_{\rm eq}} = 1.356\times10^{23}\unit{kg} ,$$

1.85 times the Moon's mass: a hole of this mass is exactly as warm as the graviton sky.[^mass] At the 2.7255 K of the
microwave sky the mass is $4.50\times10^{22}$ kg, three times less. The hole of the equilibrium mass has $r_s = 0.201$
mm, and a metre away its steady tide is chapter
[11.1](/tutorial/black-holes/schwarzschild/#the-tide-outside-a-round-mass-is-exactly-newtons)'s
$2G\matter M/r^3 = 1.8\times10^{13}\unit{s^{-2}}$, Section
VII's "$2\times10^{13}$". These are the mass and the tide that chapter
[0.5](/tutorial/evening/what-the-outside-keeps/#a-black-hole-replies-with-friction-and-a-temperature)'s tour promised.
**What it means:** a heavier hole is colder, so it is the heavy holes that cast shadows.

<!-- diagram: tut-hawking-ladder — One panel, about 640 × 260 px at 1440 (full width on a phone). A horizontal
logarithmic axis of the hole's mass from 10¹¹ kg to 10¹⁰ M_⊙ (2 × 10⁴⁰ kg), labelled "hole mass M (kg)", with a second
axis above it of T_H = ħc³/8πGMk_B from 1.2 × 10¹² K down to 6.2 × 10⁻¹⁸ K, labelled "Hawking temperature T_H (K)"
(the two axes are one line read two ways, since T_H ∝ 1/M). Three bands of the mass axis, shaded lightly: left of 4.50
× 10²² kg "hotter than the microwave sky (2.7255 K): glows in light and gravitons"; between 4.50 × 10²² and 1.356 ×
10²³ kg "between the two skies: glows in gravitons, dark in light"; right of 1.356 × 10²³ kg "colder than both: a
shadow". Ticks for the Moon (7.3 × 10²² kg), the Earth, the Sun and Sgr A* (4 × 10⁶ M_⊙). A short vertical mark at
1.356 × 10²³ kg labelled "M_eq, 0.905 K". Neutral greys; the hole's mass marks in the matter colour. Caption: "Look
first at the mark M_eq: a hole of that mass is as warm as the graviton sky. Lighter holes glow against it, heavier
ones are dark. The axes are exact; the bands are bounded by the two skies' temperatures." -->

## A hovering observer near the horizon finds empty space warm

We want to see why the temperature has this form, without Hawking's calculation. The argument is a plausibility
argument that rests on one stated result.

**Unruh's result** (stated). William Unruh found in 1976 that an observer who moves through empty space with a steady
**proper acceleration** $a$, the acceleration its own accelerometer reads, in $\mathrm{m\,s^{-2}}$, finds the vacuum
warm, at

$$\kB T = \frac{\hbar a}{2\pi c} .$$

It assumes that **space is empty and flat** and that **the acceleration never changes**. This is the **Unruh effect**.
An observer at rest finds nothing. To find 1 K, a thermometer would have to be pushed with
$2.5\times10^{20}\unit{m\,s^{-2}}$.

**Near the horizon.** A camera that hovers at $r$ reads chapter
[11.1](/tutorial/black-holes/schwarzschild/#at-the-schwarzschild-radius-clocks-stop-nothing-can-hover-and-nothing-gets-out)'s
acceleration $a = G\matter M/r^2\sqrt{1 - r_s/r}$, which grows without limit near the horizon. A small enough patch
of spacetime always looks flat, so we assume that Unruh's result holds in a patch round the hovering camera: it finds
a glow at $\hbar a/2\pi c\kB$.

**Carried far away.** Chapter 11.1's
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

an acceleration in $\mathrm{m\,s^{-2}}$, which chapter 11.2 met in
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

in $\mathrm{J\,K^{-1}}$, with $A = 16\pi G^2\matter M^2/c^4$ chapter 11.2's area of the horizon.[^S] **Check with the
first law.** Chapter 11.2's first law without spin is $\dd(\matter Mc^2) = (\kappa c^2/8\pi G)\,\dd A$, and chapter
[10.2](/tutorial/glow/kirchhoff/#a-glow-carries-entropy-as-well-as-energy) writes heat taken in slowly as $T\,\dd S$.
Differentiating $S$ gives $\dd S = 8\pi G\kB\matter M\,\dd\matter M/\hbar c$, and multiplying by [](#eq:hawking),

$$\begin{aligned}
T_H\,\dd S &= \frac{\hbar c^3}{8\pi G\matter M\kB}\cdot\frac{8\pi G\kB\matter M}{\hbar c}\,\dd\matter M\\
&= c^2\,\dd\matter M .
\end{aligned}$$

So the first law's area term is the heat $T_H\,\dd S$, as chapter 11.2 said it would be. For the hole of the
equilibrium mass $S = 4.9\times10^{62}\,\kB$, or $6.7\times10^{39}\unit{J\,K^{-1}}$.

## A hole that loses heat grows hotter, so its balance with a sky cannot last

**Heat capacity.** Chapter
[10.2](/tutorial/glow/kirchhoff/#a-balance-is-stable-only-if-the-heat-capacity-is-positive) derived this. A body's
**heat capacity** $\sym{heat-capacity}{C} = \dd E/\dd T$, in $\mathrm{J\,K^{-1}}$, says how much its energy rises per
kelvin. For a hole $E = \matter Mc^2$, and [](#eq:hawking) gives $\dd T_H/\dd\matter M = -T_H/
\matter M$, so

$$\boxed{\;C = \frac{\dd(\matter Mc^2)}{\dd T_H} = -\frac{\matter Mc^2}{T_H}\;} .$$

It is negative: $-1.35\times10^{40}\unit{J\,K^{-1}}$ for the hole of the equilibrium mass, against
$+4.2\times10^3\unit{J\,K^{-1}}$ for a litre of water. A hole has a **negative heat capacity**.

**Why the balance is unstable.** Put a hole of the equilibrium mass in the 0.905 K graviton sky, and leave the
microwave sky aside for now. If the hole gains a little mass, it becomes colder than the sky, takes in more than it
gives, and grows heavier and colder still. If it loses a little, it becomes hotter, gives more than it takes, and grows
lighter and hotter. Either way it runs away from the balance. This is Section VII's "like every such balance, this one
is unstable", chapter 10.2's **unstable balance**.

**How fast a hole evaporates** (an estimate). A hole alone in empty space loses mass to its glow: it **evaporates**.
Chapter
[10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)'s
**Stefan–Boltzmann law** says that a black surface at $T$ sends out $\sym{stefan-boltzmann}{\sigma_{\rm SB}}T^4$ per
square metre, with $\sigma_{\rm SB} = 5.67\times10^{-8}\unit{W\,m^{-2}\,K^{-4}}$, for radiation of two polarizations. We
assume **geometric optics**: the hole takes every ray inside chapter 11.1's capture cross-section $\pi b_c^2 = 27\pi
G^2\matter M^2/c^4$ and no ray outside it. A sky at $T$ sends across each square metre, from all sides, the power
$c\,\mathcal U = 4\sigma_{\rm SB}T^4$, with $\mathcal U$ chapter 10.1's energy of the radiation per cubic metre. So in a
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
area $A = 16\pi G^2\matter M^2/c^4$ shrinks, against chapter 11.2's
[area theorem](/tutorial/black-holes/spin/#the-area-of-a-horizon-never-shrinks-so-spin-holds-energy-that-can-be-taken-out).
The theorem assumes that the energy every observer measures is never negative, and quantum fields break this
condition: near the horizon they carry negative energy into the hole (stated). The lifetime is an estimate, and a
generous one. The greybody factors of [the next section](#mode-by-mode-a-hole-is-a-grey-body) change its number but
not the powers of $\matter M$: for gravitons they give 2.7% of this power, and Page found about a quarter of it for
photons (stated). The glow peaks at waves that the hole mostly reflects.

**Against the microwave sky** (an upper bound). The hole is colder than the 2.7255 K microwave sky, so in light it
gains. Its cross-section for light is at most about $\pi b_c^2 = 8.6\times10^{-7}\unit{m^2}$, and for that sky
$c\,\mathcal U = 4\sigma_{\rm SB}T^4 = 1.25\times10^{-5}\unit{W\,m^{-2}}$. The product is at most $1.1\times10^{-11}$
W. Divided by $\matter Mc^2 = 1.2\times10^{40}$ J, it is $8.8\times10^{-52}$ of the hole's mass each second: Section
VII's "less than a part in $10^{51}$". The hole's own glow in light is smaller, by about $(0.905/2.7255)^4 = 1/82$.

## Mode by mode, a hole is a grey body

**The definition.** A **mode** is chapter 8.3's single pattern of a wave, here one of angular frequency $\omega$ and
of degree $\ell$ round the hole (chapter 2.2's harmonics; $\ell \ge 2$ for gravitons). Its **occupation** is the mean
number of quanta it holds. A wave in one mode that comes in from far away loses the share
$\sym{greybody-factor}{\Gamma_\ell(\omega)}$ of its quanta to the hole, and the rest is scattered back out.[^Gamma]
This share is the **net absorption**, absorption less the emission that the incoming wave stimulates, like chapter
[10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)'s
$\alpha$ for matter. For a hole that does not spin it is a pure number from 0 to 1. $\Gamma_\ell$ is the hole's
**greybody factor**: for $\ell = 2$ it is chapter 4.5's "fraction of a quadrupole wave". A black body would have
$\Gamma = 1$ in every mode; a body that takes only part of each is a **grey body**.

**Detailed balance for one mode** (recalled from chapter 10.2). That section found that matter emits in proportion
to one more than the quanta present. The quanta present stimulate part of the emission, which the net absorption
already counts; the 1 is the **spontaneous emission**, which does not depend on what comes in. In a closed box at the
matter's temperature every absorption is matched by an emission, which is **detailed balance**. We assume that **the
hole glows as matter at $T_H$ does**, and use the box to find how much. The occupation of a mode at the hole's
temperature is chapter 8.3's

$$\sym{hole-occupation}{n_H} = \frac{1}{e^{\hbar\omega/\kB T_H} - 1} .$$

Put the hole in a box at $T_H$. The mode comes in with $n_H$ quanta, the hole's net absorption takes $\Gamma_\ell n_H$,
and the share $(1 - \Gamma_\ell)n_H$ is scattered out. Balance requires $n_H$ to go out, so the hole's spontaneous
emission is $\Gamma_\ell n_H$. That emission does not depend on what comes in, so it is $\Gamma_\ell n_H$ in any sky.

**The bookkeeping.** Now let the sky send in $\sym{background-occupation}{n_{\rm bg}}$ quanta per mode. What a camera
receives from the hole in that mode is the scattered share plus the hole's own emission:

$$\boxed{\begin{aligned}
n_{\rm out} &= (1 - \Gamma_\ell)\,n_{\rm bg} + \Gamma_\ell n_H\\
&= n_{\rm bg} + \Gamma_\ell\,(n_H - n_{\rm bg})
\end{aligned}} \label{eq:bookkeeping}$$

This is the paper's bookkeeping in Section XI. **Limits.** At $T_H = T_{\rm bg}$, $n_H = n_{\rm bg}$ and nothing
changes: the hole "cannot be seen in gravitons at all". At $T_H \to 0$, $n_{\rm out} = (1 - \Gamma_\ell)n_{\rm bg}$, a
pure absorber. At $\Gamma_\ell = 1$, $n_{\rm out} = n_H$, a black body.

**Long waves.** When $\hbar\omega \ll \kB T_H$, $n_H \approx \kB T_H/\hbar\omega \gg 1$. Then the mean number of
quanta the hole emits into the mode, $\Gamma_\ell n_H$, and the mean number it absorbs for each quantum that comes in,
before stimulated emission is taken away, $\Gamma_\ell(n_H + 1)$, are both the net absorption $\Gamma_\ell$ times
$\kB T_H/\hbar\omega$, as Section XIV says. Here $\hbar\omega/\kB T_H = 8\pi G\matter M\omega/c^3$, the answer to
chapter [8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give)'s
paper problem. Section XIV uses this to make the hole's near field a thermometer: a camera beside the hole reads
$T_H$ from it without catching a single graviton, as chapters 11.4 and 13.7 show.

<!-- diagram: tut-hawking-mode — One panel, about 560 × 280 px at 1440. The hole as a dark disc at the right with its
horizon; one thick arrow coming in from the left labelled "sky: n_bg" (neutral); at the hole it splits into a thin
arrow entering the horizon labelled "Γ n_bg absorbed, net" and a returning arrow labelled "(1 − Γ) n_bg scattered"; a
second short arrow leaving the horizon in the light colour labelled "Γ n_H spontaneous"; the two leaving arrows join
into one outgoing arrow labelled "n_out = n_bg + Γ(n_H − n_bg)". Arrow widths in proportion to the numbers for Γ = 0.4,
n_bg = 1, n_H = 0.3. Caption: "Look first at the two arrows that leave: what the hole scatters and what it emits of
its own add up to what the camera receives. The arrow into the horizon is the net absorption, stimulated emission
taken away. The arrows are schematic; their widths follow the bookkeeping for one example." -->

**Where $\Gamma_\ell$ comes from** (stated, and solved by numbers). The shadow's depth in the next section needs
$\Gamma_\ell$ at every frequency, and this is where those numbers come from. We write $x = G\matter M\omega/c^3$,
a pure number local to this chapter, which compares the hole's size with the reduced wavelength $c/\omega$
(chapter 10.1's $\hbar\omega/\kB T$ is here $8\pi x$ at the hole's temperature). A gravitational wave of degree
$\ell$ round a hole obeys the **Regge–Wheeler equation** (Regge and Wheeler, 1957), a wave equation on one line with a
barrier:

$$\frac{\dd^2\psi}{\dd r_*^2} + \Bigl[\frac{\omega^2}{c^2} - V_\ell(r)\Bigr]\psi = 0 ,$$

with

$$V_\ell(r) = \Bigl(1 - \frac{r_s}{r}\Bigr)\Bigl[\frac{\ell(\ell + 1)}{r^2} - \frac{6G\matter M}{c^2r^3}\Bigr] .$$

Here $\psi(r_*)$ is the wave's amplitude, $V_\ell$ the barrier in $\mathrm{m^{-2}}$, and $r_*$ the **tortoise
coordinate**, in metres, defined in the box below. The barrier peaks near 11.1's photon sphere, as the barrier for rays
did. A wave whose $\omega^2/c^2$ lies below the peak is mostly reflected, and one above it mostly passes in.

::: derivation
### The tortoise coordinate and the solution

The tortoise coordinate is $r_* = r + r_s\ln(r/r_s - 1)$, which puts the horizon at $r_* = -\infty$. There, and far
away, $V_\ell \to 0$. At the horizon a wave can only go in, $\psi = e^{-i\omega r_*/c}$, and far away it is
$A_{\rm in}e^{-i\omega r_*/c} + A_{\rm out}e^{i\omega r_*/c}$. The flux is conserved, so $|A_{\rm in}|^2 -
|A_{\rm out}|^2 = 1$ and $\Gamma_\ell = 1/|A_{\rm in}|^2$. Zerilli's equation for the other polarization gives the
same $\Gamma_\ell$ (stated).
:::

**Its two ends.** For long waves the absorption tends to **Page's limit** (Don Page, 1976, stated; chapter 11.4
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
per cent.

<!-- diagram: tut-hawking-greybody — Two panels side by side (stacked on a phone), about 680 × 300 px at 1440. Left:
Γ_ℓ(x) for ℓ = 2, 3, 4, 6, 10 against x = GMω/c³ from 0 to 2.5, from the greybody table of 11.3-write (exact data),
each curve labelled at its rise; Page's (256/225)x⁶ dashed beside the ℓ = 2 curve from 0 to 0.25. Right: σ_abs/27π
(GM/c²)² against x from 0 to 3, rising from 0 and oscillating about a thin horizontal line at 1, labelled "capture
cross-section". Neutral greys; one accent colour for ℓ = 2. Caption: "Look first at the left panel's ℓ = 2 curve and
its dashed partner: long waves are absorbed as Page's x⁶. On the right, the partial-wave sum climbs to the capture
cross-section once the waves are shorter than the hole. Curves from the Regge–Wheeler equation." -->

## A shadow stays pale while the sky's gravitons are long

We want how dark a hole looks against a uniform sky, because Section XI's numbers depend on it. Mode by mode, the
bookkeeping [](#eq:bookkeeping) removes $\Gamma_\ell(n_{\rm bg} - n_H)$ quanta. Each quantum carries the energy
$\hbar\omega$, and the number of modes per unit of frequency grows as $\omega^2$ (chapter 10.1), so the energy
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

$$\boxed{\;D = 0.93,\ 0.54,\ 0.29 \quad\text{for}\quad \matter M = 10,\ 3,\ 2\ \matter M_{\rm eq}\;} ,$$

Section XI's "$93\%$ … $54\%$ … $29\%$".[^depth] The depth reaches 0.99 at 27 times the equilibrium mass, and above
about a hundred times, $10^{25}$ kg, the hole is black. At the equilibrium mass $D = 0$, and a lighter hole has
$D < 0$: it glows.

**Why the shadow is pale.** The sky's energy peaks at $\hbar\omega = 2.82\,\kB T$, 53 GHz, where the gravitons are 5.6
mm long, Section XI's "about six millimetres". A hole of twice the equilibrium mass has a capture disc 2.1 mm across,
and for it the peak lies at $x = 0.22$. There the hole takes only 0.2% of the degree $\ell = 2$, and less of the
others. Only the upper tail of the sky's spectrum, above $x \approx 0.4$, is taken well, so most of the sky's energy
passes the hole. Geometric optics needs $x$ of about 1, a hole near ten times the equilibrium mass. The hole's own
glow takes away a little more depth, since it adds $\Gamma_\ell n_H$ to every mode.

**Counted instead of weighed.** With $x^2$ in the place of $x^3$, the same holes are 82%, 32% and 14% as dark as the
disc. The long waves that the hole lets through are many but carry little energy, so a counting pixel (chapter
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

We want to know what spin changes, because Section XI says a spinning hole can look brighter than the sky. Chapter
[11.2](/tutorial/black-holes/spin/#a-hole-amplifies-a-wave-that-turns-with-it-more-slowly-than-its-horizon) found that
a wave turning round the axis as $e^{im\varphi}$, with $\sym{order}{m}$ its azimuthal number, is amplified when
$0 < \omega < m\Omega_H$, with $\Omega_H$ the angular velocity of the horizon. For such modes the greybody factor
$\Gamma_{\ell m}$ is negative: the hole returns more than comes in.

**The occupation of a spinning hole** (stated). Seen from the turning horizon the wave's frequency is
$\omega - m\Omega_H$, the turning form of chapter
[6.3](/tutorial/relativity/aberration/#light-from-ahead-is-bluer-and-light-from-behind-is-redder)'s Doppler shift, so
$n_H$ is taken there:

$$n_H = \frac{1}{e^{\hbar(\omega - m\Omega_H)/\kB T_H} - 1} ,$$

with the temperature of a spinning hole $\kB T_H = \hbar\kappa/2\pi c$, chapter 11.2's surface gravity $\kappa$ in the
place of $c^4/4G\matter M$ (stated). If $\omega < m\Omega_H$, the exponent is negative, the exponential is less than
1, and $n_H < 0$. Far below the threshold $n_H \approx -1$. Below the threshold, then, $\Gamma_{\ell m}$ is not a
share from 0 to 1 and $n_H$ is not a mean number of quanta: they are formal numbers, and only their product, the
change in what comes out, is physical. Both factors of $\Gamma_{\ell m}(n_H - n_{\rm bg})$ are negative, and their
product is positive:

$$n_{\rm out} - n_{\rm bg} = \Gamma_{\ell m}\,(n_H - n_{\rm bg}) > 0 .$$

Those modes come out brighter than the sky, whatever the temperatures. With $n_H = -1$, $n_{\rm out} = n_{\rm bg} +
|\Gamma_{\ell m}|(n_{\rm bg} + 1)$: the sky's quanta are amplified, and the hole adds $|\Gamma_{\ell m}|$ quanta of its
own, as chapter 10.2's matter with an inverted population, a maser, amplifies a wave.

**Numbers.** With the paper's greatest gain of 91% for the mode $\ell = m = 2$ at chapter 11.2's spin $\chi = 0.998$
(from Teukolsky's equation, stated), a hole of ten times the equilibrium mass returns
$0.116 + 0.91\times1.116 = 1.13$ gravitons at $x = 0.90$, where the sky holds 0.12: ten times the sky.[^bright] At
$\chi = 0.7$ the greatest gain is 0.27%, near $x \approx 0.34$, and there the mode is about 0.7% brighter, the
paper's "under one per cent".

::: check
### Q

What mass of hole has the temperature of the 2.7255 K microwave sky?

### A

$\matter M = \hbar c^3/8\pi G\kB T = 4.5\times10^{22}$ kg, about 0.6 Moon masses.

### Q

Why can a hole and a sky at its temperature not stay in balance?

### A

The hole's heat capacity is negative. If it gains energy it becomes colder than the sky and gains more; if it loses
energy it becomes hotter and loses more.

### Q

Why is a hole of twice the equilibrium mass only 29% as dark as its disc?

### A

Most of the sky's energy is in waves too long for the hole to absorb fully, and the hole adds its own glow.
:::

**The idea to keep: a black hole glows at $\kB T_H = \hbar c^3/8\pi G\matter M$, the warmth that a hovering
observer finds near the horizon, carried out to infinity. Mode by mode it is a grey body that adds
$\Gamma_\ell(n_H - n_{\rm bg})$ to the sky, so a hole at the sky's temperature vanishes, and a heavier one casts a
shadow that stays pale until the hole is far heavier.**

::: problems
### Practice

A hole of $10^{12}$ kg: find $T_H$, the mean energy of one of its quanta, $2.70\,\kB T_H$ (chapter 10.1), and its
lifetime by the [evaporation estimate](#a-hole-that-loses-heat-grows-hotter-so-its-balance-with-a-sky-cannot-last).

::: solution
$T_H = 1.2\times10^{11}$ K; $2.70\,\kB T_H = 4.6\times10^{-12}$ J, or 29 MeV; and $t = 4\times10^{11}$ years. A hole
this hot also sends out electrons, positrons and neutrinos, so it loses mass several times faster (Page, stated).
:::

### Stretch

With chapter 10.2's heat capacity, show that a hole of mass $\matter M$ in a closed box of radiation at its own
temperature, with the total energy fixed, can stay in balance if the radiation's energy $E_r$ is small enough. Find
the condition.

::: solution
If the hole takes $\dd E$ from the radiation, the hole cools by $\dd E/|C|$ and the radiation by $\dd E/C_r$, with the
radiation's $C_r = 4E_r/T$, since $E_r \propto T^4$. The hole is then colder and keeps taking unless the radiation
cools faster, $C_r < |C| = \matter Mc^2/T$. So the balance is stable when $E_r < \matter Mc^2/4$ (Hawking, 1976).
:::

### The paper

Show the paper's bookkeeping, $n_{\rm out} - n_{\rm bg} = \Gamma_\ell(n_H - n_{\rm bg})$, from detailed balance. Then,
with $\Gamma_2(0.3) = 0.055$, find what fraction of the $\ell = 2$ mode at $x = 0.3$ the hole absorbs, and what it
returns when $\matter M = 2\matter M_{\rm eq}$.

::: solution
The [closed box](#mode-by-mode-a-hole-is-a-grey-body) gives the emission $\Gamma_\ell n_H$, and the scattered share
is $(1 - \Gamma_\ell)n_{\rm bg}$. The hole absorbs 5.5% of the mode. At $\matter M = 2\matter M_{\rm eq}$,
$8\pi x = 7.54$, so $n_H = 5.3\times10^{-4}$ and $n_{\rm bg} = 1/(e^{3.77} - 1) = 0.0236$; the mode returns
$0.0236 - 0.055\times0.0231 = 0.0223$, 5.4% less than the sky.
:::
:::

::: paper
- [Section XI](/paper/#sec:vistas), [*A primordial graviton background*](/paper/#par:a-primordial-graviton-background):
  the Hawking temperature and $1.36\times10^{23}$ kg, the bookkeeping, the greybody factors, the depths and the
  spinning hole brighter than the sky.
- [Section VII](/paper/#sec:no-lens), [*A black hole as the lens*](/paper/#par:a-black-hole-as-the-lens): the hole in
  balance with the graviton sky, its gain of "less than a part in $10^{51}$", and "like every such balance, this one is
  unstable".
- [Section XIV](/paper/#sec:hole): "matching to Hawking's radiation", the classical absorption times $k_BT/\hbar\omega$,
  and the temperature of the paper's [](/paper/#eq:hole-thermometer). [Section XV](/paper/#sec:holography): a hole's
  tremor is of order $\hbar$.
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
- R. M. Wald, *Quantum Field Theory in Curved Spacetime and Black Hole Thermodynamics* (Chicago, 1994): the full
  treatment that this chapter states.
:::

[^mass]: The paper's "$1.36\times10^{23}$ kilograms … exactly $0.905$ kelvin" is rounded: $1.36\times10^{23}$ kg gives
    0.902 K, and exactly 0.905 K needs $1.356\times10^{23}$ kg.

[^S]: This $S$ is an entropy, not the tidal column $S(\hat n)$ or a spectrum, which always carries subscripts.

[^Gamma]: Not chapter 4.1's damping rate $\Gamma$ nor chapter 7.1's Christoffel symbols.

[^depth]: The paper's "$93\%$ as dark as that disc" and its companions hold for the energy removed, not for the
    count of gravitons.

[^bright]: The paper's "ten times as bright as the sky" depends on a frequency it does not give: with the 91% gain the
    ratio is 8.7 at $x = 0.85$, 9.7 at 0.90 and 12 at 0.93, close to the threshold $2\Omega_H$.
