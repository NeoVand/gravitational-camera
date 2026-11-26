---
id: '5.5'
title: 'Radiance, emission and absorption; lenses and mirrors in brief'
question: 'In a thermal glow each pixel receives the glow of everything along its line of sight, added together, near and far, seen and hidden. What does a pixel of a glow camera measure, and why can no body cast a shadow in it?'
part: '5'
requires: ['2.2', '4.4', '5.1', '5.2', '5.3']
paper: [sec:thermal, eq:kirchhoff, eq:alpha, fig:line-integral, fig:closed-furnace, tab:materials, sec:first-image, eq:column, eq:jN-friction, fig:sun-at-midnight, sec:no-lens, eq:index, eq:optics-bound, eq:lens-compactness, fig:black-hole-camera]
figures: [fig:line-integral, fig:sun-at-midnight]
live: [radiative-transfer, scene-closed-furnace]
depth: A
---

Draw one line of sight through a closed door, a closed steel furnace with a hot iron block inside, and a person. In
light the line ends at the door. In gravity it runs on through all three, and the pixel receives the glow of everything
along it.

{{paper fig:line-integral}}

What does a pixel of a glow camera measure, and why can no body cast a shadow in it? The answer needs one quantity, the
radiance, and one equation, which says how matter changes the radiance along a ray. It gives a rule: against a
background of radiance $I_{\mathrm{bg}}$, a body of optical depth $\tau$ changes what a pixel receives by $(B_\omega -
I_{\mathrm{bg}})(1 - e^{-\tau})$, where $B_\omega$ is the radiance of an enclosure at the body's temperature. A last
part shows why matter makes no useful lens or mirror for these waves, and how gravity itself focuses them.

::: plain
A pixel of a camera that looks at glowing things measures how bright one small patch of the view is: the power that
arrives on each square metre, from each small patch of directions, in each band of frequencies. This brightness does not
fade with distance: a far body looks smaller than a near one, but each part of it looks as bright.

Along a line of sight, each piece of matter adds its own glow and absorbs a small share of the glow that passes through
it. A warm body glows in proportion to how well it absorbs. A body exactly as warm as whatever lies behind it cannot be
seen at all.

For gravitational waves, matter absorbs almost nothing: a wave that crosses the whole Earth loses about one part in
$10^{30}$ of its energy. So each pixel adds up the glow of everything on its line of sight, and there are no shadows. No
lens or mirror made of matter can usefully focus the waves; gravity itself can, but only a mass as compact as a black
hole does it well.
:::

## A pixel measures radiance: power per area, per solid angle and per frequency

A pixel is a small flat detector of area $\dd A$, in square metres, that accepts only the rays arriving within
a small cone of directions about its normal. The cone has the solid angle $\sym{solid-angle}{\dd\Omega}$, in steradians
(section
[2.2](/tutorial/outside/spherical-harmonics/#a-direction-is-two-angles-and-a-small-patch-of-sky-has-the-solid-angle-sinvarthetamathrmdvarthetamathrmdvarphi)).
It accepts only waves whose angular frequency lies between $\omega$ and $\omega + \dd\omega$. The power it receives is
proportional to each of the three, so we write it as

$$\dd P = \sym{radiance}{I_\omega}\,\dd A\,\dd\Omega\,\dd\omega . \label{eq:radiance}$$

The factor $I_\omega$ is the **radiance**, or **specific intensity**: the power per square metre, per steradian and per
unit of angular frequency, in $\mathrm{W\,m^{-2}\,sr^{-1}}$ per $\mathrm{s^{-1}}$. It depends on the place, the direction
and the frequency.[^I] Added over all frequencies, $I = \int_0^\infty I_\omega\,\dd\omega$ is in
$\mathrm{W\,m^{-2}\,sr^{-1}}$.

**Why this quantity.** A pixel of twice the area, or with a cone of twice the solid angle, receives twice the power, so
the power describes the detector as much as the radiation. The radiance divides out both: it belongs to the rays that
cross that place in that direction, and any detector put there reports the same value.[^modes]

**Counting gravitons.** A camera may count **gravitons**, the quanta of a gravitational wave (section
[0.3](/tutorial/evening/waves-and-heat/#matter-is-transparent-so-warm-matter-glows-throughout)), each of which carries the energy $\hbar\omega$, with $\hbar$ the reduced
Planck constant. The **number radiance** is the number of gravitons per
second, per square metre and per steradian, added over all frequencies:

$$\sym{number-radiance}{N(\hat n)} = \int_0^\infty\frac{I_\omega}{\hbar\omega}\,\dd\omega ,$$

in $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$. Here $\hat n$ is the unit vector from the pixel toward the patch it looks at
(section [1.1](/tutorial/newton/vectors-and-indices/)). This is the brightness of a pixel in the camera's images.

**An example.** A model of the Sun has the number radiance $4 \times 10^5$ gravitons $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$
along the line through the centre of its core.[^sun] The core, the inner fifth of the Sun's radius, covers $2.7 \times
10^{-6}$ steradians of the Earth's sky, so a square metre facing it receives at most $4 \times 10^5 \times 2.7 \times
10^{-6} \approx 1$ graviton a second.

**A non-example: the flux.** The energy flux (section
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed)), in $\mathrm{W\,m^{-2}}$, adds
the radiance over every direction from which rays arrive, each weighted by the cosine of its angle to the normal. For a
small source that covers the solid angle $\Delta\Omega$ straight ahead, it is about $I\,\Delta\Omega$, so it falls as
$1/r^2$ with the distance $r$. The radiance does not fall.

## Radiance does not fade along a ray in empty space

The radiance stays the same along a ray in empty space, so a pixel's reading belongs to its line of sight and not to the
distance of what it sees. To show it, take two small flat patches, $\dd A_1$ and $\dd A_2$, a
distance $r$ apart and facing each other. We assume **empty space between them, where nothing emits or absorbs**, and
**patches much smaller than $r$**, so that every ray from one to the other has nearly the same length and direction.
Rays leave $\dd A_1$ toward $\dd A_2$ with the radiance $I_1$ and arrive at $\dd A_2$ with the radiance $I_2$ (Figure
[](#fig:rad-patches)).

Seen from $\dd A_1$, the patch $\dd A_2$ covers the solid angle $\dd A_2/r^2$. By [](#eq:radiance), the power that leaves
$\dd A_1$ toward $\dd A_2$ in the band $\dd\omega$ is

$$\dd P = I_1\,\dd A_1\,\frac{\dd A_2}{r^2}\,\dd\omega .$$

Seen from $\dd A_2$, the same rays arrive from within the solid angle $\dd A_1/r^2$, so the power received is

$$\dd P = I_2\,\dd A_2\,\frac{\dd A_1}{r^2}\,\dd\omega .$$

In empty space every joule that leaves one patch toward the other arrives, so the two powers are equal, and

$$\boxed{I_2 = I_1 .}$$

The spreading of the rays, which dims the flux, is exactly matched by the shrinking of the cone in which a distant patch
is seen.

![Look first at the two cones: each patch sees the other in a solid angle that shrinks as $1/r^2$, and the power between
them, $I\,\dd A\,\dd\Omega$, is the same counted from either end. So the radiance $I_1$ that leaves equals the radiance
$I_2$ that arrives. The cones' angles are exaggerated.](tut-rad-patches){#fig:rad-patches}

**A number.** Mars is 1.52 times as far from the Sun as the Earth is, so the Sun's disc covers $1/1.52^2 = 0.43$ of the
solid angle there, and the flux of sunlight is 0.43 of the Earth's. A pixel aimed at the middle of the Sun reports the
same radiance on Mars as on the Earth: a body's **surface brightness**, the radiance of the rays that leave it, is the
same at every distance in empty space. A far body looks smaller, not dimmer.

## Along a ray, matter adds its glow and takes a share of what passes

Now let the ray cross matter. We want the change of the radiance over a short piece of the ray, so that the changes can
be added along a line of sight. Let $s$ be the distance along the ray, in metres, in the direction in which the
radiation travels. Two things happen over a short length $\dd s$.

**The matter adds its glow.** Warm matter sends out radiation in every direction. Its **emissivity**
$\sym{emissivity}{j_\omega}$ is the power it sends out per cubic metre, per steradian and per unit of angular frequency,
in $\mathrm{W\,m^{-3}\,sr^{-1}}$ per $\mathrm{s^{-1}}$. A short cylinder along the ray, of cross-section $\dd A$ and
length $\dd s$, sends the power $j_\omega\,\dd A\,\dd s\,\dd\Omega\,\dd\omega$ into the cone $\dd\Omega$ along the ray.
Compared with [](#eq:radiance), that adds $j_\omega\,\dd s$ to the radiance.

**The matter takes a share of what passes.** The absorption coefficient $\sym{absorption-coefficient}{\alpha}$, in
$\mathrm{m^{-1}}$, is the fraction of a wave's energy lost per metre (section
[5.1](/tutorial/waves/wave-equation/#a-damping-term-makes-a-wave-fade-at-a-fixed-rate-per-metre)). Over $\dd s$ the ray therefore loses $\alpha\,I_\omega\,\dd s$ of its radiance, and gain and loss together give the
**equation of transfer**,

$$\frac{\dd I_\omega}{\dd s} = j_\omega - \alpha I_\omega . \label{eq:transfer}$$

The units agree: $j_\omega$ and a radiance divided by a length are both powers per cubic metre (per steradian and per
unit of frequency).

**A slab.** We solve [](#eq:transfer) for **a uniform slab of thickness $L$, with the same $j_\omega$ and $\alpha$
throughout**, in front of a background. Radiation of radiance $\sym{background-radiance}{I_{\rm bg}}$ enters the slab's
back face at $s = 0$, and the pixel looks at its front face, $s = L$. We multiply the equation by $e^{\alpha s}$, which
turns its left side into a single derivative:

$$\frac{\dd}{\dd s}\bigl(I_\omega\,e^{\alpha s}\bigr) = e^{\alpha s}\Bigl(\frac{\dd I_\omega}{\dd s} + \alpha
I_\omega\Bigr) = j_\omega\,e^{\alpha s} .$$

We integrate from the back face, where $I_\omega = I_{\rm bg}$, to the front face:

$$I_\omega(L)\,e^{\alpha L} - I_{\rm bg} = \frac{j_\omega}{\alpha}\bigl(e^{\alpha L} - 1\bigr) .$$

We divide by $e^{\alpha L}$ and write $\sym{optical-depth}{\tau} = \alpha L$, a pure number called the **optical
depth** of the slab. The radiance that leaves the slab toward the pixel is

$$\boxed{I_\omega = I_{\rm bg}\,e^{-\tau} + \frac{j_\omega}{\alpha}\bigl(1 - e^{-\tau}\bigr) .} \label{eq:slab}$$

The first term is the background, dimmed by $e^{-\tau}$; the second is the slab's own glow, less the part it absorbs on
the way out. A slab of optical depth one passes 37% of its background and shows 63% of $j_\omega/\alpha$.

**Two limits.** A slab is **optically thick** when $\tau \gg 1$. Then $I_\omega \to j_\omega/\alpha$: the slab hides
what lies behind it and shows only its own glow, which comes from a front layer about $1/\alpha$ deep. A slab is **optically thin** when $\tau \ll 1$. Then $1 - e^{-\tau} \approx \tau$, and

$$I_\omega \approx I_{\rm bg}\,(1 - \tau) + j_\omega L :$$

the slab adds its whole glow, $j_\omega$ times its length, and dims the background by the small fraction $\tau$ (Figure
[](#fig:rad-slab)). Fog is thick for light; [below](#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line) all ordinary matter is thin
for gravitational waves.

![Look first at the blue share: through a thick slab the background dies away and the radiance climbs to the slab's own
$j_\omega/\alpha$; through a thin one the background passes almost whole and the slab adds a straight ramp,
$j_\omega L$. Both curves are exact solutions of the equation of transfer with
$I_{\rm bg} = 0.3\,j_\omega/\alpha$.](tut-rad-slab){#fig:rad-slab}

## A warm body's glow over its absorption is the radiance of an enclosure at its temperature

What is the ratio $j_\omega/\alpha$ for warm matter? By [](#eq:slab) it is the radiance of a thick body. Close a box
whose walls are at the temperature $T$, in kelvin, and wait. The radiation inside settles to a radiance that is the same
at every place, in every direction, and for walls of any material: it depends only on the temperature and the frequency.
This is **enclosure radiation** (or cavity radiation), and its radiance $\sym{planck-radiance}{B_\omega(T)}$ is the
**Planck radiance**.

The radiance cannot depend on the walls, because of the second law of heat. If two boxes at the same temperature held
different radiances at some frequency, a small window between them that passed only that frequency would let energy flow
by itself from one box into the other, and one box would warm while the other cooled. For gravitational
waves, summed over the two polarizations, Planck's law reads

$$B_\omega(T) = \frac{\hbar\omega^3}{4\pi^3c^2}\,\frac{1}{e^{\hbar\omega/\kB T} - 1} ,$$

with $\kB$ Boltzmann's constant (section [4.2](/tutorial/response/temperature/)). Section 10.1 derives it; we use two of its integrals ([below](#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)).

Now put a piece of matter at the temperature $T$ inside the box. We assume that **the matter is in thermal equilibrium
at a temperature $T$**, and that **the refractive index is one**.[^index] The argument with two boxes holds whatever the
boxes contain, so the radiation that crosses the matter stays at $B_\omega(T)$: $I_\omega = B_\omega$ all along a ray
through the matter, and $\dd I_\omega/\dd s = 0$. Then [](#eq:transfer) needs $j_\omega - \alpha B_\omega = 0$:

$$j_\omega = \alpha(\omega)\,B_\omega(T) . \label{eq:kirchhoff}$$

This is **Kirchhoff's law** (stated in words in section
[0.3](/tutorial/evening/waves-and-heat/#matter-is-transparent-so-warm-matter-glows-throughout)): matter at the
temperature $T$ emits, in each direction and at each frequency, its absorption coefficient times the Planck radiance.
Both $j_\omega$ and $\alpha$ belong to the matter alone, so the law holds outside the box too, wherever the matter has a
temperature.[^net]

::: gap
This is the equilibrium argument only. Section 10.1 shows why an enclosure takes Planck's form, and section 10.2 why the
emission of matter does not depend on the radiation around it. The law also follows from the random jiggling of the
shear stress in warm matter, through the fluctuation–dissipation theorem of section
[4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency).[^kirch]
:::

**The rule for a body against a background.** With $j_\omega/\alpha = B_\omega$, [](#eq:slab) becomes $I_\omega =
I_{\rm bg}e^{-\tau} + B_\omega(1 - e^{-\tau})$, so the slab changes what a pixel receives by

$$\boxed{I_\omega - I_{\rm bg} = (B_\omega - I_{\rm bg})(1 - e^{-\tau}) .}$$

A body exactly as warm as its background has $B_\omega = I_{\rm bg}$, and it is invisible whatever its optical depth. A
warmer body shows bright against its background, and a cooler one dark. In a kiln at one even temperature the pots are
hard to make out against its walls, even glazed pots that reflect, because a pot's own emission and its reflection of the
walls' glow add up to exactly the walls' radiance. In the thin limit the change is $(B_\omega - I_{\rm bg})\,\tau$: the
body's own glow, $\tau B_\omega$, less the dimming $\tau I_{\rm bg}$ of what lies behind.

::: try {#radiative-transfer}
A background on the left, a slab in the middle and a pixel on the right, at one frequency near the peak of the glow at
300 K. The sliders set the slab's optical depth $\tau$, on a logarithmic scale from $10^{-37}$ to $10^2$, and the
temperatures of the slab and of the background. Beside the pixel, one bar holds what it receives: the background's share
$I_{\rm bg}e^{-\tau}$ in blue under the slab's glow $B_\omega(1 - e^{-\tau})$ in orange, with a line at $I_{\rm bg}$
and a dotted line at $B_\omega$. The presets set up fog in light and a cold steel wall in front of a hot body, in
gravity.

Answer the predictions at the top of the figure, then do what each asks. Afterwards, choose the steel preset and read how
much the wall changes the pixel's reading.
:::

## When nothing absorbs, a pixel adds the glow along its line

When matter absorbs almost nothing, the small parameter is the optical depth. For matter with the placeholder friction $\matter\eta = 10^{-3}\unit{Pa\,s}$ (section
[4.4](/tutorial/response/viscosity/#at-fixed-stiffness-the-more-viscous-liquid-has-less-friction-at-the-frequencies-of-heat)),
section 5.1 found $\alpha = 1.2 \times 10^{-37}\unit{m^{-1}}$. A line of sight through the Earth's diameter of such
matter, $1.27 \times 10^7$ m, therefore has $\tau = 1.6 \times 10^{-30}$.

**The first neglected terms.** Keeping the first correction to each term of [](#eq:slab) gives $I_\omega \approx
I_{\rm bg}(1 - \tau) + j_\omega L\,(1 - \tau/2)$: the body dims the background by $\tau$ and hides $\tau/2$ of its own
glow, both about $10^{-30}$ here. We drop them, and [](#eq:transfer) becomes $\dd I_\omega/\dd s = j_\omega$: the
radiance grows by the glow along the line, and nothing is taken away.

**The sum.** Along a line of sight through any number of bodies, the radiance that reaches the pixel is the background
plus the integral of $j_\omega$ along the line. A camera that counts gravitons uses the **number emissivity**
$\sym{number-emissivity}{j_N} = \int_0^\infty j_\omega/\hbar\omega\;\dd\omega$, the number of gravitons sent out per
second, per cubic metre and per steradian. With nothing glowing beyond the scene, the number radiance of the pixel that
looks along $\hat n$ is

$$N(\hat n) = \int_0^\infty j_N\bigl(s\,\hat n\bigr)\,\dd s , \label{eq:column}$$

with $s$ measured from the pixel outward, against the direction in which the radiation travels. Without absorption the order of adding does not matter. A sum of this kind along a line is a **line
integral**.[^column]

**Where it fails.** The approximation needs $\tau \ll 1$. Causality fixes a material's friction added up over all
frequencies (section [4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction)), and this limits
absorption: for a metre of matter with 30 GPa of stiffness that relaxes, the optical depth added up over all angular
frequencies is only $6 \times 10^{-24}\unit{s^{-1}}$. A band in which the matter is opaque, with $\tau \geq 1$
throughout, is therefore at most that wide, against $6.3\unit{s^{-1}}$ for a band of one hertz. Across any band of
useful width every material is far from opaque (section 10.3). The approximation does fail at a black hole, which
absorbs whatever falls into it: only black holes cast shadows.

**What it means.** Every body on a line of sight adds its glow, and none hides another. In light a pixel reports the first
surface its line meets; in gravity it reports the sum of everything on the line (Figure [](#fig:rad-columns)), an X-ray
in which every object is its own lamp. Looking straight down through the whole Earth, a camera on its surface finds a number radiance of at most $1.2 \times 10^{-5}$ gravitons $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$.
The Sun's core, shining straight through the Earth at $4 \times 10^5$, has $3 \times 10^{10}$ times that surface
brightness, although it is $1.5 \times 10^{11}$ m away.

![Look first at the bottom panel: every body on the line adds its glow, and the hot block counts in full although the
furnace's steel surrounds it. In light (top) the pixel reports only the door; in a thick glow (middle) each body hides
most of what lies behind it. The values in (c) are illustrative.](tut-rad-columns){#fig:rad-columns}

{{paper fig:sun-at-midnight}}

The same holds at room scale. Two closed steel furnaces hold the same block of iron, one at 293 K and one at 1500 K.

::: try {#scene-closed-furnace}
Predict first: will the steel walls hide either block in the gravity view? The figure starts with the left furnace in
light and the right one, which holds the hot block, in the glow. Drag the divider to the right to see both in light,
where they look the same, then to the left to see both in the glow. The hot block shines through its steel, and the cold
one shows only faintly; each steel box adds a faint glow of its own instead of hiding what lies behind it. Computed from
the same scene, the hot block is sixteen times as bright through its middle. The
[next section](#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature) finds why.
:::

## A material's brightness is its friction times a power of its temperature

The heights of the camera's images measure the number emissivity of a material, so we want it in terms of friction and
temperature. We assume that **the friction $\matter\eta$ is the same at every frequency**, so that
$\alpha = 16\pi G\matter\eta/c^3$ (section 5.1) is too.[^alpha]

**Step 1: the power.** We add Kirchhoff's law over all frequencies. With $\alpha$ constant,

$$\sym{energy-emissivity}{j_E} = \int_0^\infty j_\omega\,\dd\omega = \alpha\int_0^\infty B_\omega(T)\,\dd\omega =
\frac{\alpha\,\sigma_{\rm SB}T^4}{\pi} ,$$

using one integral of Planck's law, $\int_0^\infty B_\omega\,\dd\omega = \sigma_{\rm SB}T^4/\pi$ (section 10.1 derives
it). Here $\sym{stefan-boltzmann}{\sigma_{\rm SB}} = \pi^2\kB^4/60\hbar^3c^2 = 5.67 \times 10^{-8}\unit{W\,m^{-2}\,K^{-4}}$
is the **Stefan–Boltzmann constant**.[^sigma] The energy emissivity $j_E$ is in $\mathrm{W\,m^{-3}\,sr^{-1}}$.

**Step 2: the count.** The mean energy of a graviton in Planck radiation is $2.70\,\kB T$ (section 10.1), so the number
emissivity is $j_N = j_E/2.70\,\kB T$.

**Step 3: the friction.** We put in $\alpha$:

$$j_N = \frac{16\pi G\matter\eta}{c^3}\cdot\frac{\sigma_{\rm SB}T^3}{\pi}\cdot\frac{1}{2.70\,\kB} .$$

The two factors $\pi$ cancel, and one power of $T$ cancels, so

$$\boxed{j_N = \frac{16\,G\matter\eta\,\sigma_{\rm SB}T^3}{2.70\,\kB c^3}} .$$

The units agree: $G\matter\eta$ is in $\mathrm{m^2\,s^{-3}}$, $\sigma_{\rm SB}T^3/\kB$ in $\mathrm{m^{-2}\,s^{-1}}$, and
dividing by $c^3$ leaves $\mathrm{m^{-3}\,s^{-1}}$, gravitons per cubic metre per second (per steradian).

**Numbers.** The placeholder friction at 293 K gives $j_E = 1.7 \times
10^{-35}\unit{W\,m^{-3}\,sr^{-1}}$. Over all $4\pi$ steradians a cubic metre sends $4\pi j_E = 2.1 \times
10^{-34}\unit{W}$. In gravitons, $j_N = 1.5 \times 10^{-15}\unit{s^{-1}\,m^{-3}\,sr^{-1}}$, and a cubic metre sends one
graviton every 1.7 million years. At zero temperature the glow vanishes, as $T^3$ in the count.

**Real water.** Water's friction falls with frequency across the glow's band (section 4.4 gives its effective friction,
the constant friction that would glow as brightly, $5.4 \times 10^{-5}\unit{Pa\,s}$), so it glows about 19 times more
faintly than the placeholder, at $1.1 \times 10^{-35}\unit{W\,m^{-3}}$ over all directions.[^table] More of its glow
comes at low frequencies, so its mean graviton energy is only $1.7\,\kB T$: the $2.70\,\kB T$ of Step 2 holds only for a
friction the same at every frequency. A person, taken as 70 litres of water at 293 K, sends $7.7 \times 10^{-37}$ W, or
one graviton every $2.8 \times 10^8$ years; at 310 K, about $9 \times 10^{-37}$ W and one graviton in $2.4 \times
10^{8}$ years.

**The closed furnace.** A friction that stayed the same at every temperature would make the 1500 K block send
$(1500/293)^3 = 134$ times as many gravitons as the 293 K one. But the friction that counts is the one at the frequencies
of the glow, and a hotter body glows at higher frequencies: the peak, 17 THz at 293 K (section 4.4), moves up in
proportion to the temperature, to 87 THz at 1500 K. Iron's friction is limited by a ceiling that falls as $1/\omega$
(section
[4.4](/tutorial/response/viscosity/#a-metals-electrons-relax-like-a-maxwell-liquid-and-their-friction-has-a-ceiling)),
and a metal's electrons collide more often in proportion to the temperature, so the friction at the glow's peak stays the
same fraction of that ceiling. The hot block's friction is therefore $1500/293 = 5.1$ times lower, its count grows as
$T^3/T = T^2$, and it sends $(1500/293)^2 = 26$ times as many gravitons.

The pixels' readings differ by less, because each line of sight also crosses the steel walls and ends on the floor, at
293 K in both furnaces, which add the same glow to both. With the cold block's glow as one unit and the common glow
$g$ units, the readings are in the ratio

$$\frac{26 + g}{1 + g} = 16 \quad\text{when}\quad g = \tfrac23 :$$

the walls and the floor add about two-thirds of the cold block's glow. Without the floor's glow the ratio is 22.

**What it means.** Counted gravitons measure the product $\matter\eta T^3$, and their energies measure
$\matter\eta T^4$, so a hot body with little friction and a cooler body with more can send the same count. If the
friction is the same across the band of the glow, the mean graviton energy, $2.70\,\kB T$, gives the temperature, and
then the count gives the friction. If it is not, the temperature trades off against the shape of $\alpha(\omega)$.

## Matter makes no useful lens or mirror, and gravity focuses well only when it is very compact

Section [R11](/tutorial/black-holes/reading-section-vii/) treats lenses and black holes at length; here we are brief. A
glass lens focuses light because it delays the wave more at its centre, where it is thick, than at its edge, where it is
thin. We want the focal length of such a lens. Take a lens of radius $R$, in metres, whose thickness falls from $h$ on
its axis to zero at its rim along a parabola: at the distance $a$ from the axis it is $h(1 - a^2/R^2)$ thick (Figure
[](#fig:rad-lenses)).[^h] We assume that **the lens is thin**, so that every ray crosses it nearly parallel to the axis.

By section [5.1](/tutorial/waves/wave-equation/#a-medium-can-slow-a-wave-and-its-refractive-index-measures-how-much), a
slab of thickness $L$ holds a wave back by the phase $(n - 1)\,\omega L/c$, with $\sym{refractive-index}{n}$ its
refractive index. At the distance $a$ the lens is such a slab, of thickness $h(1 - a^2/R^2)$. The wave that crosses on the axis therefore lags the wave that crosses at $a$ by

$$\begin{aligned}
&(n - 1)\frac{\omega h}{c} - (n - 1)\frac{\omega h}{c}\Bigl(1 - \frac{a^2}{R^2}\Bigr)\\
&\qquad = (n - 1)\,\frac{\omega h\,a^2}{cR^2} .
\end{aligned}$$

To converge on a point F at the distance $\sym{focal-length}{f}$ behind the lens, the wave's crests must be circles
centred on F, so close behind the lens the crest on the axis trails the crest at $a$, because it has the shortest way
left to go. From the distance $a$ the path to F is $\sqrt{f^2 + a^2} \approx f + a^2/2f$, longer than the
path from the axis by $a^2/2f$, which takes the phase $\omega a^2/2cf$. The wave on the axis must lag by exactly this
phase. The two lags agree at every $a$ when $(n - 1)\,\omega h/cR^2 = \omega/2cf$, that is, when

$$\boxed{f = \frac{R^2}{2(n - 1)h}} .$$

This $f$ is the **focal length**, the distance behind a lens at which rays that arrive parallel to its axis cross. It is a length, since $R^2/h$ is in metres. **A check.** A magnifying glass with $n = 1.5$, 2 cm in radius and
4 mm thick gives $f = 10$ cm, as it should. As $n \to 1$ the focus moves to infinity.

**A steel lens.** For a gravitational wave of 1 kHz in steel, Peters's index (section 5.1) gives $n - 1 = 8.3 \times
10^{-14}$. A lens 1 m in radius (2 m across) and 1 m thick focuses at $6.0 \times 10^{12}$ m, 40 AU, about Pluto's mean
distance from the Sun.[^lens]

**A mirror.** Reflection needs stiffness. W. H. Press [@Press1979] found that a shear modulus $\matter\mu$ changes the
square of the wavenumber by the fraction $16\pi G\matter\mu/c^2\omega^2$. A sharp face reflects half the fractional change
in the wavenumber, which is half that in its square, so its **reflection amplitude**, the reflected amplitude over the
arriving one, is a quarter of it, $4\pi G\matter\mu/c^2\omega^2$ (section R11), a pure number. Steel, with
$\matter\mu = 71$ GPa, reflects $1.7 \times 10^{-23}$ of a 1 kHz wave's amplitude and $2.8 \times 10^{-46}$ of its
energy.[^steel]

**Gravity as a lens.** A mass $\matter M$ bends a ray that passes it at the impact parameter $b$ (section
[1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick)) by the angle
$4G\matter M/bc^2 = 2r_s/b$, with $\sym{schwarzschild-radius}{r_s} = 2G\matter M/c^2$ the Schwarzschild radius (section
11.1 derives the angle). A ray bent toward the axis by this angle crosses the axis at the distance $b$ divided by the
angle:

$$f = \frac{b^2}{2r_s} .$$

This focal length grows with $b$, so a point mass has a line of foci, not one focus. The Earth has $r_s = 8.9$ mm and the radius $R_\oplus = 6.37 \times 10^6$ m. Rays that graze it, at $b = R_\oplus$, cross at $2.3
\times 10^{15}$ m, or 15,300 AU, fifteen thousand times the distance to the Sun. The **focal ratio** is the focal length
over the lens's width, $\sym{focal-ratio}{N} = f/2R$. For the Earth as the lens, $R = R_\oplus$ and $N = 1.8 \times
10^8 = 1/8\mathcal C$, with the Earth's compactness $\mathcal C = G\matter M/R_\oplus c^2 = 7.0 \times 10^{-10}$ (section
[0.4](/tutorial/evening/one-pixel/#no-lens-can-be-made-so-the-camera-computes-its-pictures)).

**How compact a lens must be.** A lens of radius $R$ that focuses at $f$ must bend its edge ray by $R/f$. Gravity bends it
by $2r_s/R$, with $r_s$ for the mass inside that ray. So $R/f = 2r_s/R$, or $r_s/R = R/2f$, and with $N = f/2R$:

$$\frac{r_s}{R} = \frac1{4N} .$$

A pocket lens at $f/10$, 5 cm in radius, needs $r_s = R/40 = 1.25$ mm, so $\matter M = r_sc^2/2G = 8.4 \times 10^{23}$ kg,
11.5 times the mass of the Moon, packed into a ball of that radius: seven billion times the density of a nucleus.
Only a black hole is compact enough.[^bh]

![Look first at the curved crests behind the thin lens: they are circles centred on $F$, so the crest on the axis trails
the crest at the height $a$. The glass makes it trail, because the wave on the axis crosses the most glass, and the path
from $a$ to $F$ is longer by $a^2/2f$, so all the parts arrive in step. A mass (right) bends near rays more and sends
them to a nearer focus, so its foci lie along a line, at distances growing as $b^2$. The lens's thickness and all the
angles are greatly exaggerated: the Earth bends a grazing ray by $2.8 \times 10^{-9}$
radians.](tut-rad-lenses){#fig:rad-lenses}

**The idea to keep: a pixel measures radiance, which no distance dims. Along its line of sight matter adds its glow and
takes the fraction $\alpha$ per metre of what passes, and a body as warm as its background is invisible. For
gravitational waves $\alpha$ is so small that nothing absorbs: a pixel adds the glow of everything on its line, and there
are no shadows, no useful lenses and no mirrors.**

::: problems
### Practice

**[5.5]** A steel wall 1 m thick has the placeholder friction, $10^{-3}\unit{Pa\,s}$. Find its optical depth for
gravitational waves, and the fraction of a background that it removes. Why does this mean there are no shadows?

::: solution
$\alpha = 16\pi G\matter\eta/c^3 = 1.2 \times 10^{-37}\unit{m^{-1}}$, so $\tau = 1.2 \times 10^{-37}$ for $L = 1$ m. A
thin slab removes the fraction $1 - e^{-\tau} \approx \tau$ of its background, so the wall removes $1.2 \times
10^{-37}$ of it. A body hides what is behind it only when $\tau$ approaches one; here it only adds its own glow.
:::

**[5.5]** When is a slab invisible against its background, whatever its optical depth?

::: solution
When it is at the background's temperature, so that $B_\omega = I_{\rm bg}$ and the change $(B_\omega - I_{\rm
bg})(1 - e^{-\tau})$ is zero for every $\tau$.
:::

### Stretch

**[5.5]** Counting gravitons alone, can the camera tell a hot body with little friction from a cooler body with more?

::: solution
No: the count measures $\matter\eta T^3$, and the two bodies can have the same product. The energies of the gravitons,
which measure $\matter\eta T^4$, separate them if the friction is the same across the band of the glow.
:::

**[5.5]** Combine this section with section 4.4. At the glow's peak at 293 K, copper's electrons have the friction
$\mathrm{Re}\,\matter\eta = 1.1 \times 10^{-4}\unit{Pa\,s}$. If copper had that friction at every frequency, how much
power would a cubic metre of it send, compared with the placeholder's $2.1 \times 10^{-34}\unit{W\,m^{-3}}$?

::: solution
At a fixed temperature and with a friction the same at every frequency, $4\pi j_E = 4\alpha\sigma_{\rm SB}T^4$ is
proportional to $\matter\eta$. So copper would send $(1.1 \times 10^{-4}/10^{-3}) \times 2.1 \times 10^{-34} = 2.3
\times 10^{-35}\unit{W\,m^{-3}}$, about a ninth of the placeholder's. Copper's whole spectrum gives a little more,
$2.8 \times 10^{-35}\unit{W\,m^{-3}}$, because below the peak its friction is larger (section 4.4); its effective
friction is $1.3 \times 10^{-4}\unit{Pa\,s}$.
:::

### The camera

**[5.5]** A lens of focal ratio $N = 10$ and radius $R = 0.05$ m must satisfy $r_s/R = 1/4N$. Find its mass in Moon
masses, and compare its density with that of a nucleus.

::: solution
$r_s = R/4N = 1.25$ mm and $\matter M = r_sc^2/2G = 8.4 \times 10^{23}$ kg. The Moon's mass is $7.35 \times 10^{22}$ kg,
so this is 11.5 Moons. In a ball of radius $R$ the density is $1.6 \times 10^{27}\unit{kg\,m^{-3}}$, $7 \times 10^9$
times the nuclear density, $2.3 \times 10^{17}\unit{kg\,m^{-3}}$.
:::
:::

::: paper
- [*How matter glows*](/paper/#sec:thermal) and its "no shadows": the
  [line integral](#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line). [*Emission*](/paper/#par:emission) gives
  [](#eq:kirchhoff) and the rule for a body against a background; [*A bound on the
  glow*](/paper/#par:a-bound-on-the-glow) the optical depth added up over frequency. Figures
  [](/paper/#fig:line-integral) and [](/paper/#fig:closed-furnace), and Table [](/paper/#tab:materials), draw and list
  these.
- [Section IX](/paper/#sec:first-image): [](#eq:column), the number radiances of the Earth and the Sun, and
  [](/paper/#eq:jN-friction), derived [here](#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature).
- [*The optical constants of matter*](/paper/#par:the-optical-constants-of-matter) and
  [*A black hole as the lens*](/paper/#par:a-black-hole-as-the-lens): the steel lens and wall, the Earth's focal length
  and [](/paper/#eq:lens-compactness) (section R11).
:::

::: deeper
- The [GR course, section 16.4](https://neovand.github.io/general-relativity/chapter-16.html#16-4-bending-light-finding-the-famous-factor-of-two)
  derives the bending angle $4GM/bc^2$, with its factor of two.
- G. B. Rybicki and A. P. Lightman, *Radiative Processes in Astrophysics* (Wiley, 1979), chapter 1: radiance, the
  equation of transfer and Kirchhoff's law.
- P. C. Peters [@Peters1974] and W. H. Press [@Press1979]: the sources of the index and reflection.
:::

[^I]: This $I_\omega$ is not the Stokes $I$ of section 5.4 or the image $I$ of section 5.3.

[^modes]: A pixel cannot accept an arbitrarily small cone: an aperture of area $A$ resolves directions about
    $\lambda^2/A$ steradians apart (section
    [5.3](/tutorial/waves/diffraction/#an-array-resolves-as-many-directions-as-its-area-holds-square-wavelengths)), so
    $\dd A\,\dd\Omega$ is at least about one square wavelength.

[^sun]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX.

[^index]: Inside a medium of refractive index $n$ the radiance in equilibrium is $n^2B_\omega$, not $B_\omega$. For
    gravitational waves in matter $n - 1$ is about $10^{-13}$ (section 5.1), so the difference is harmless here.

[^net]: Here $\alpha$ is the net absorption coefficient, the absorption less the emission that passing radiation
    stimulates (section 10.2), and $j_\omega$ is the emission that happens on its own.

[^kirch]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, as its equation
    [](/paper/#eq:kirchhoff), with the rule for a body against a background.

[^column]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX, as its equation
    [](/paper/#eq:column).

[^alpha]: The result below was first shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX, as its equation
    [](/paper/#eq:jN-friction); the friction law for $\alpha$ is its equation [](/paper/#eq:alpha).

[^sigma]: The value is the same as for light, because light also has two polarizations.

[^table]: The placeholder's $4\pi j_E = 2.1 \times 10^{-34}$ W m$^{-3}$ is the 21, and water's $1.1$, of the table of
    materials in *The gravitational camera* (Mohsenvand 2026), [](/paper/#tab:materials), in units of
    $10^{-35}\unit{W\,m^{-3}}$.

[^h]: This $h$ is a thickness, not the strain $h$ of section 5.1.

[^steel]: This is the steel of section 5.1: density $\matter\rho = 7850\unit{kg\,m^{-3}}$ and shear sound at $c_T =
    3000$ m/s, so that $\matter\mu = \matter\rho c_T^2 = 71$ GPa.

[^lens]: A lens 1.3 m in radius would focus at $10^{13}$ m, since $f$ grows as $R^2$.

[^bh]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VII, as its equation
    [](/paper/#eq:lens-compactness), with the steel lens and the Earth's focal ratio as its equations
    [](/paper/#eq:index) and [](/paper/#eq:optics-bound); its [](/paper/#fig:black-hole-camera) puts a black hole in front
    of the camera.
