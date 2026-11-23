---
id: '5.5'
title: 'Radiance, emission and absorption; lenses and mirrors in brief'
question: 'In the thermal glow "each pixel receives the glow of everything along its line of sight, added together, near and far, seen and hidden", and "there are no shadows". What does a pixel of a glow camera measure, and why can no body cast a shadow in it?'
part: '5'
requires: ['2.2', '4.4', '5.1', '5.2', '5.3']
paper: [sec:thermal, eq:kirchhoff, eq:alpha, fig:line-integral, fig:closed-furnace, tab:materials, sec:first-image, eq:column, eq:jN-friction, fig:sun-at-midnight, sec:no-lens, eq:index, eq:optics-bound, eq:lens-compactness, fig:black-hole-camera]
figures: [fig:line-integral, fig:sun-at-midnight]
live: [radiative-transfer, scene-closed-furnace]
depth: A
---

The paper's [Section VI](/paper/#sec:thermal) says that in the thermal glow "each pixel receives the glow of
everything along its line of sight, added together, near and far, seen and hidden", and that "there are no shadows".
Its Figure [](/paper/#fig:line-integral) draws one line of sight through a closed door, a closed steel furnace with a
hot iron block inside, and a person. In light the line ends at the door. In gravity it runs on through all three.

{{paper fig:line-integral}}

The paper puts the rule in one sentence: "Against a background of radiance $I_{\mathrm{bg}}$, a body of optical depth
$\tau$ changes what a pixel receives by $(B_\omega - I_{\mathrm{bg}})(1 - e^{-\tau})$", and this chapter defines each
of its terms. Its Section IX then writes the whole image as a sum along each line of sight, [](/paper/#eq:column),
which chapter 0.3 promised here. So we ask what a pixel of a glow camera measures, and why no body can cast a shadow
in it. The answer needs one quantity, the radiance, and one equation, which says how matter changes the radiance along
a ray. A last section shows why matter makes no useful lens or mirror for these waves, and how gravity itself focuses
them.

::: plain
A pixel of a camera that looks at glowing things measures how bright one small patch of the view is. It measures the
power that arrives on each square metre, from each small patch of directions, in each band of frequencies. This
brightness does not fade with distance. A far body looks smaller than a near one, but each part of it looks as bright
as it does from close by.

Along a line of sight, each piece of matter adds its own glow and absorbs a small share of the glow that passes
through it. A warm body glows in proportion to how well it absorbs. A body exactly as warm as whatever lies behind it
cannot be seen at all, however thick it is.

For gravitational waves, matter absorbs almost nothing. A wave that crosses the whole Earth loses about one part in
$10^{30}$ of its energy. So nothing dims what lies behind it, and each pixel adds up the glow of everything on its
line of sight. There are no shadows. For the same reason no lens or mirror made of matter can usefully focus the
waves. Gravity itself can focus them, but only a mass as compact as a black hole does it well.
:::

## A pixel measures radiance: power per area, per solid angle and per frequency

We want the quantity that one pixel of a glow camera reports. Think of the pixel as a small flat detector of area
$\dd A$, in square metres, that accepts only the rays arriving within a small cone of directions about its normal.
The cone has the solid angle $\sym{solid-angle}{\dd\Omega}$, in steradians, measured as in chapter
[2.2](/tutorial/outside/spherical-harmonics/#a-direction-is-two-angles-and-a-small-patch-of-sky-has-the-solid-angle-sinvarthetamathrmdvarthetamathrmdvarphi).
The detector also accepts only waves whose angular frequency lies between $\omega$ and $\omega + \dd\omega$. The power
it receives is proportional to each of the three, so we write it as

$$\dd P = \sym{radiance}{I_\omega}\,\dd A\,\dd\Omega\,\dd\omega . \label{eq:radiance}$$

The factor $I_\omega$ is the **radiance**, also called the **specific intensity**. It is the power per square metre,
per steradian and per unit of angular frequency, in $\mathrm{W\,m^{-2}\,sr^{-1}}$ per $\mathrm{s^{-1}}$, and it depends
on the place, the direction of the rays and the frequency.[^I] Added over all frequencies, the radiance
$I = \int_0^\infty I_\omega\,\dd\omega$ is in $\mathrm{W\,m^{-2}\,sr^{-1}}$.

**Why this quantity.** A pixel of twice the area receives twice the power, and so does a pixel with a cone of twice
the solid angle, so the power describes the detector as much as the radiation. The radiance divides out both. What
remains belongs to the rays that cross that place in that direction, and any detector put there reports the same
value.[^modes]

**Counting gravitons.** A camera may count **gravitons**, the quanta of a gravitational wave (chapter
[0.3](/tutorial/evening/waves-and-heat/)), each of which carries the energy $\hbar\omega$, with $\hbar$ the reduced
Planck constant. It then reports a number instead of joules. The **number radiance** is the number of gravitons per
second, per square metre and per steradian, added over all frequencies:

$$\sym{number-radiance}{N(\hat n)} = \int_0^\infty\frac{I_\omega}{\hbar\omega}\,\dd\omega ,$$

in $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$. Here $\hat n$ is the unit vector from the pixel toward the patch it looks at,
the paper's convention (chapter [1.1](/tutorial/newton/vectors-and-indices/)). This is the brightness of a pixel in
the paper's images.

**An example.** The paper's model of the Sun has the number radiance $4 \times 10^5$ gravitons
$\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$ along the line through the centre of its core. The core, the inner fifth of the
Sun's radius, covers $2.7 \times 10^{-6}$ steradians of the sky seen from the Earth. So a square metre facing it
receives at most $4 \times 10^5 \times 2.7 \times 10^{-6} \approx 1$ graviton a second, which is the paper's
"roughly one graviton per square metre per second".

**A non-example: the flux.** The energy flux of chapter
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed), in $\mathrm{W\,m^{-2}}$, adds
the radiance over every direction from which rays arrive, each weighted by the cosine of its angle to the normal. For
a small source that covers the solid angle $\Delta\Omega$ straight ahead, the flux is about $I\,\Delta\Omega$. It
depends on how large the source looks, so it falls as $1/r^2$ with the distance $r$. The radiance does not fall, as
the next section shows.

## Radiance does not fade along a ray in empty space

We want to show that the radiance stays the same along a ray in empty space, because then a pixel's reading belongs
to its line of sight and not to the distance of what it sees. Take two small flat patches, $\dd A_1$ and $\dd A_2$, a
distance $r$ apart and facing each other. We assume **empty space between them, where nothing emits or absorbs**, and
**patches much smaller than $r$**, so that every ray from one to the other has nearly the same length and direction.
Rays leave $\dd A_1$ toward $\dd A_2$ with the radiance $I_1$ and arrive at $\dd A_2$ with the radiance $I_2$
(Figure [](#fig:rad-patches)).

Seen from $\dd A_1$, the patch $\dd A_2$ covers the solid angle $\dd A_2/r^2$. By [](#eq:radiance), the power that
leaves $\dd A_1$ toward $\dd A_2$ in the band $\dd\omega$ is

$$\dd P = I_1\,\dd A_1\,\frac{\dd A_2}{r^2}\,\dd\omega .$$

Seen from $\dd A_2$, the same rays arrive from within the solid angle $\dd A_1/r^2$, so the power received is

$$\dd P = I_2\,\dd A_2\,\frac{\dd A_1}{r^2}\,\dd\omega .$$

In empty space every joule that leaves one patch toward the other arrives, so the two powers are equal, and

$$\boxed{I_2 = I_1 .}$$

The factor $1/r^2$ appears in both lines and cancels. The spreading of the rays, which dims the flux, is exactly
matched by the shrinking of the cone in which a distant patch is seen.

![Look first at the two cones: each patch sees the other in a solid angle that shrinks as $1/r^2$, and the power
between them, $I\,\dd A\,\dd\Omega$, is the same counted from either end. So the radiance $I_1$ that leaves equals
the radiance $I_2$ that arrives. The cones' angles are exaggerated.](tut-rad-patches){#fig:rad-patches}

**A number.** Mars is 1.52 times as far from the Sun as the Earth is. From Mars the Sun's disc covers $1/1.52^2 =
0.43$ of the solid angle it covers from the Earth, so the flux of sunlight there is 0.43 of the Earth's. A pixel aimed
at the middle of the Sun reports the same radiance on Mars as on the Earth.

**What it means.** A body's **surface brightness**, the radiance of the rays that leave it, is the same at every
distance in empty space: a far body looks smaller, not dimmer.

## Along a ray, matter adds its glow and takes a share of what passes

Now let the ray cross matter. We want the change of the radiance over a short piece of the ray, so that the changes
can be added along a whole line of sight. Let $s$ be the distance along the ray, in metres, measured in the direction
in which the radiation travels.[^s] Two things happen over a short length $\dd s$.

**The matter adds its glow.** Warm matter sends out radiation in every direction. Its **emissivity**
$\sym{emissivity}{j_\omega}$ is the power it sends out per cubic metre, per steradian and per unit of angular
frequency, in $\mathrm{W\,m^{-3}\,sr^{-1}}$ per $\mathrm{s^{-1}}$. A short cylinder along the ray, of cross-section
$\dd A$ and length $\dd s$, sends the power $j_\omega\,\dd A\,\dd s\,\dd\Omega\,\dd\omega$ into the cone $\dd\Omega$
along the ray. Compared with [](#eq:radiance), that adds $j_\omega\,\dd s$ to the radiance.

**The matter takes a share of what passes.** Chapter
[5.1](/tutorial/waves/wave-equation/#a-damping-term-makes-a-wave-fade-at-a-fixed-rate-per-metre) defined the
absorption coefficient $\sym{absorption-coefficient}{\alpha}$, in $\mathrm{m^{-1}}$, as the fraction of a wave's energy
lost per metre. Over $\dd s$ the ray therefore loses $\alpha\,I_\omega\,\dd s$ of its radiance. The gain and the loss
together give the **equation of transfer**,

$$\frac{\dd I_\omega}{\dd s} = j_\omega - \alpha I_\omega . \label{eq:transfer}$$

The units agree: $j_\omega$ is a power per cubic metre, and so is a radiance divided by a length (each per steradian
and per unit of frequency).

**A slab.** We solve [](#eq:transfer) for **a uniform slab of thickness $L$, with the same $j_\omega$ and $\alpha$
throughout**, in front of a background. Radiation of radiance $\sym{background-radiance}{I_{\rm bg}}$ enters the
slab's back face at $s = 0$, and the pixel looks at its front face, $s = L$. We multiply the equation by $e^{\alpha s}$,
which turns its left side into a single derivative:

$$\frac{\dd}{\dd s}\bigl(I_\omega\,e^{\alpha s}\bigr) = e^{\alpha s}\Bigl(\frac{\dd I_\omega}{\dd s} + \alpha
I_\omega\Bigr) = j_\omega\,e^{\alpha s} .$$

We integrate from the back face, where $I_\omega = I_{\rm bg}$, to the front face:

$$I_\omega(L)\,e^{\alpha L} - I_{\rm bg} = \frac{j_\omega}{\alpha}\bigl(e^{\alpha L} - 1\bigr) .$$

We divide by $e^{\alpha L}$ and write $\sym{optical-depth}{\tau} = \alpha L$, a pure number called the **optical
depth** of the slab.[^tau] The radiance that leaves the slab toward the pixel is

$$\boxed{I_\omega = I_{\rm bg}\,e^{-\tau} + \frac{j_\omega}{\alpha}\bigl(1 - e^{-\tau}\bigr) .} \label{eq:slab}$$

The first term is the background, dimmed by the factor $e^{-\tau}$. The second is the slab's own glow, less the part
of it that the slab absorbs on the way out. A slab of optical depth one, for example, passes $e^{-1} = 37\%$ of its
background and shows 63% of the radiance $j_\omega/\alpha$.

**Two limits.** A slab is **optically thick** when $\tau \gg 1$. Then $e^{-\tau}$ is nearly zero and $I_\omega \to
j_\omega/\alpha$: the slab hides what lies behind it and shows only its own glow, which comes from a front layer about
$1/\alpha$ deep. A slab is **optically thin** when $\tau \ll 1$. Then $1 - e^{-\tau} \approx \tau$, and

$$I_\omega \approx I_{\rm bg}\,(1 - \tau) + j_\omega L :$$

the slab adds its whole glow, $j_\omega$ times its length, and dims the background by the small fraction $\tau$
(Figure [](#fig:rad-slab)). Fog is thick for light, and
[below](#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line) we find that all ordinary matter is thin for
gravitational waves.

![Look first at the blue share: through a thick slab the background dies away and the radiance climbs to the slab's
own $j_\omega/\alpha$; through a thin one the background passes almost whole and the slab adds a straight ramp,
$j_\omega L$. Both curves are exact solutions of the equation of transfer with
$I_{\rm bg} = 0.3\,j_\omega/\alpha$.](tut-rad-slab){#fig:rad-slab}

## A warm body's glow over its absorption is the radiance of an enclosure at its temperature

We want to know the ratio $j_\omega/\alpha$ for warm matter, because [](#eq:slab) says that it is the radiance of a
thick body. Close a box whose walls are at the temperature $T$, in kelvin, and
wait. The radiation inside settles to a radiance that is the same at every place, in every direction, and for walls of
any material: it depends only on the temperature and the frequency. This is **enclosure radiation** (or cavity
radiation), and its radiance $\sym{planck-radiance}{B_\omega(T)}$ is the **Planck radiance**.[^B]

The radiance cannot depend on the walls, because of the second law of heat. Suppose two boxes at the same temperature
held different radiances at some frequency. A small window between them that passed only that frequency would then
let energy flow by itself from one box into the other, and one box would warm while the other cooled. For
gravitational waves, summed over the two polarizations, Planck's law reads

$$B_\omega(T) = \frac{\hbar\omega^3}{4\pi^3c^2}\,\frac{1}{e^{\hbar\omega/\kB T} - 1} ,$$

with $\kB$ Boltzmann's constant (chapter [4.2](/tutorial/response/temperature/)). We state it without proof (chapter
10.1 derives it) and use only two of its integrals
([below](#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)).

Now put a piece of matter at the temperature $T$ inside the box. We assume that **the matter is in thermal equilibrium
at a temperature $T$**, and that **the refractive index is one**.[^index] The argument with two boxes holds whatever
the boxes contain, so it holds with the matter inside, and the radiation that crosses the matter must stay at
$B_\omega(T)$. So $I_\omega = B_\omega$ all along a ray through the matter, and $\dd I_\omega/\dd s = 0$. Then
[](#eq:transfer) needs $j_\omega - \alpha B_\omega = 0$, which is the paper's

{{paper eq:kirchhoff}}

This is **Kirchhoff's law**, which chapter
[0.3](/tutorial/evening/waves-and-heat/#matter-is-transparent-so-warm-matter-glows-throughout) stated in words:
matter at the temperature $T$ emits, in each direction and at each frequency, its absorption coefficient times the
Planck radiance. Both $j_\omega$ and $\alpha$ belong to the matter alone, so the law holds outside the box too,
wherever the matter has a temperature.[^net]

::: gap
This is the equilibrium argument only. It does not show why the radiance of an enclosure takes Planck's form (chapter
10.1 counts the waves that fit in a box and the quanta in each). It does not show why the emission of matter does not
depend on the radiation around it, so that the law holds outside a box (chapter 10.2 proves it by detailed balance,
the matching of each process of emission with its reverse). The paper also obtains [](/paper/#eq:kirchhoff) from the random jiggling of the shear stress in warm matter, through the
fluctuation–dissipation theorem of chapter
[4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency).
:::

**The paper's sentence.** With $j_\omega/\alpha = B_\omega$, [](#eq:slab) becomes $I_\omega = I_{\rm bg}e^{-\tau} +
B_\omega(1 - e^{-\tau})$, so the slab changes what a pixel receives by

$$\boxed{I_\omega - I_{\rm bg} = (B_\omega - I_{\rm bg})(1 - e^{-\tau}) ,}$$

which is the paper's expression. A body exactly as warm as its background has $B_\omega = I_{\rm bg}$, and it is
invisible whatever its optical depth. A warmer body shows bright against its background, and a cooler one shows dark.
In a kiln at one even temperature, for example, the pots are hard to make out against its walls. This holds even for
glazed pots that reflect, because a pot's own emission and its reflection of the walls' glow add up to exactly the
walls' radiance. In the thin limit the change is $(B_\omega - I_{\rm bg})\,\tau$, which is the body's own glow, $\tau
B_\omega$, less the dimming $\tau I_{\rm bg}$ of what lies behind, as the paper says.

::: try {#radiative-transfer}
A background on the left, a slab in the middle and a pixel on the right, at one frequency near the peak of the glow
at 300 K. The sliders set the slab's optical depth $\tau$, on a logarithmic scale from $10^{-37}$ to $10^2$, and the
temperatures of the slab and of the background; each grey shows the temperature whose Planck radiance it is. Beside
the pixel, one bar holds what the pixel receives: the background's share $I_{\rm bg}e^{-\tau}$ in blue under the
slab's glow $B_\omega(1 - e^{-\tau})$ in orange, with a line at $I_{\rm bg}$ and a dotted line at $B_\omega$. The
presets set up fog in light and a cold steel wall in front of a hot body, in gravity.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards,
choose the steel preset and read how much the wall changes the pixel's reading.
:::

## When nothing absorbs, a pixel adds the glow along its line

We want the image when matter absorbs almost nothing, and we treat it as an approximation. The small parameter is the
optical depth. For matter with the paper's placeholder friction,
$\matter\eta = 10^{-3}\unit{Pa\,s}$ (chapter
[4.4](/tutorial/response/viscosity/#at-fixed-stiffness-the-more-viscous-liquid-has-less-friction-at-the-frequencies-of-heat)),
chapter 5.1 found $\alpha = 1.2 \times 10^{-37}\unit{m^{-1}}$. A line of sight through the Earth's diameter of such
matter, $1.27 \times 10^7$ m, therefore has $\tau = 1.6 \times 10^{-30}$.

**The first neglected terms.** Keeping the first correction to each term of [](#eq:slab) gives $I_\omega \approx
I_{\rm bg}(1 - \tau) + j_\omega L\,(1 - \tau/2)$, so the body dims the background by the fraction $\tau$ and hides the
fraction $\tau/2$ of its own glow, both about $10^{-30}$ here. We drop them, and [](#eq:transfer) becomes $\dd
I_\omega/\dd s = j_\omega$: the radiance grows by the glow along the line, and nothing is taken away.

**The sum.** Along a whole line of sight, through any number of bodies, the radiance that reaches the pixel is then the
background plus the integral of $j_\omega$ along the line. A camera that counts gravitons uses the **number
emissivity** $\sym{number-emissivity}{j_N} = \int_0^\infty j_\omega/\hbar\omega\;\dd\omega$, the number of gravitons
sent out per second, per cubic metre and per steradian. With nothing glowing beyond the scene, the number radiance of
the pixel that looks along $\hat n$ is the paper's

{{paper eq:column}}

The paper measures $s$ from the pixel outward, against the direction in which the radiation travels. Without
absorption the order in which the glow is added does not matter. A sum of this kind along a line is a **line
integral**.

**Where it fails.** The approximation needs $\tau \ll 1$. Causality fixes a material's friction added up over all
frequencies (chapter [4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction)), and the paper's
[*A bound on the glow*](/paper/#par:a-bound-on-the-glow) turns this into a limit on absorption. For a metre of matter
with 30 GPa of stiffness that relaxes, the optical depth added up over all angular frequencies is only $6 \times
10^{-24}\unit{s^{-1}}$. A band in which the matter is opaque, with $\tau \geq 1$ throughout, can therefore be at most
$6 \times 10^{-24}\unit{s^{-1}}$ wide, against $6.3\unit{s^{-1}}$ for a band of one hertz. Across any band of useful
width, every material is far from opaque (chapter 10.3). The approximation does fail at a black hole, which absorbs
whatever falls into it: in the paper's words, "only black holes cast shadows".

**What it means.** Every body on a line of sight adds its glow, and none hides another. In light a pixel reports the
first surface its line meets. In gravity it reports the sum of everything on the line, near and far
(Figure [](#fig:rad-columns)): in chapter 0.3's words, an X-ray in which every object is its own lamp. Looking
straight down through the whole Earth, the paper's camera on its surface finds a number radiance of at most
$1.2 \times 10^{-5}$ gravitons $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$. Beyond the Earth, the Sun's core shines straight
through it, at $4 \times 10^5$: its surface brightness is $3 \times 10^{10}$ times the Earth's interior's, although
it is $1.5 \times 10^{11}$ m away.

![Look first at the bottom panel: every body on the line adds its glow, and the hot block counts in full although
the furnace's steel surrounds it. In light (top) the pixel reports only the door; in a thick glow (middle) each body
hides most of what lies behind it. The values in (c) are illustrative, as in the paper's
Figure [](/paper/#fig:line-integral).](tut-rad-columns){#fig:rad-columns}

{{paper fig:sun-at-midnight}}

The paper's closed furnace shows the same thing at room scale. Two closed steel furnaces hold the same block of iron,
one at 293 K and one at 1500 K.

::: try {#scene-closed-furnace}
Predict first: will the steel walls hide either block in the gravity view? At first the figure shows the left furnace
in light and the right one, which holds the hot block, in the glow. Drag the divider to the right to see both furnaces
in light, where they look the same, then to the left to see both in the glow. The hot block shines through its steel,
and the cold one shows only faintly. Notice that each steel box adds a faint glow of its own instead of hiding what lies
behind it. The picture has no scale to read, but the paper's figure, computed from the same scene, finds the hot block
sixteen times as bright through its middle. The
[next section](#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature) finds why.
:::

## A material's brightness is its friction times a power of its temperature

We want the paper's [](/paper/#eq:jN-friction), the number emissivity of a material in terms of its friction and its
temperature, because the heights of the paper's images measure it. We assume that **the friction $\matter\eta$ is the
same at every frequency**, so that $\alpha = 16\pi G\matter\eta/c^3$ of [](/paper/#eq:alpha) is too.

**Step 1: the power.** We add Kirchhoff's law over all frequencies. With $\alpha$ constant,

$$\sym{energy-emissivity}{j_E} = \int_0^\infty j_\omega\,\dd\omega = \alpha\int_0^\infty B_\omega(T)\,\dd\omega =
\frac{\alpha\,\sigma_{\rm SB}T^4}{\pi} ,$$

using one integral of Planck's law, which we state (chapter 10.1 derives it):
$\int_0^\infty B_\omega\,\dd\omega = \sigma_{\rm SB}T^4/\pi$. Here $\sym{stefan-boltzmann}{\sigma_{\rm SB}} =
\pi^2\kB^4/60\hbar^3c^2 = 5.67 \times 10^{-8}\unit{W\,m^{-2}\,K^{-4}}$ is the **Stefan–Boltzmann constant**.[^sigma]
The energy emissivity $j_E$ is in $\mathrm{W\,m^{-3}\,sr^{-1}}$.

**Step 2: the count.** The mean energy of a graviton in Planck radiation is $2.70\,\kB T$ (stated; chapter 10.1), so
the number emissivity is $j_N = j_E/2.70\,\kB T$.

**Step 3: the friction.** We put in $\alpha$:

$$j_N = \frac{16\pi G\matter\eta}{c^3}\cdot\frac{\sigma_{\rm SB}T^4}{\pi}\cdot\frac{1}{2.70\,\kB T} .$$

The two factors $\pi$ cancel, and one power of $T$ cancels, so

$$\boxed{j_N = \frac{16\,G\matter\eta\,\sigma_{\rm SB}T^3}{2.70\,\kB c^3}} ,$$

which is the paper's equation, with its $\sigma$ written $\sigma_{\rm SB}$:

{{paper eq:jN-friction}}

The units agree: $G\matter\eta$ is in $\mathrm{m^2\,s^{-3}}$, $\sigma_{\rm SB}T^3/\kB$ in $\mathrm{m^{-2}\,s^{-1}}$, and
dividing by $c^3$ leaves $\mathrm{m^{-3}\,s^{-1}}$, gravitons per cubic metre per second (per steradian).

**Numbers.** The placeholder friction, $10^{-3}\unit{Pa\,s}$, at 293 K gives $j_E = 1.7 \times
10^{-35}\unit{W\,m^{-3}\,sr^{-1}}$. Over all $4\pi$ steradians a cubic metre sends $4\pi j_E = 2.1 \times
10^{-34}\unit{W}$, the 21 of the paper's Table [](/paper/#tab:materials) in its units of $10^{-35}\unit{W\,m^{-3}}$. In
gravitons, $j_N = 1.5 \times 10^{-15}\unit{s^{-1}\,m^{-3}\,sr^{-1}}$, and a cubic metre sends one graviton every
1.7 million years. At zero temperature the glow vanishes, as $T^3$ in the count.

**Real water.** The table's water is not the placeholder. Its friction falls with frequency across the glow's band
(chapter 4.4 gives its effective friction, the constant friction that would glow as brightly, as $5.4 \times
10^{-5}\unit{Pa\,s}$), so it glows about 19 times more faintly,
at $1.1 \times 10^{-35}\unit{W\,m^{-3}}$. More of its glow comes at low frequencies, so its mean graviton energy is
only $1.7\,\kB T$: the $2.70\,\kB T$ of Step 2 holds only for a friction the same at every frequency. A person, taken
as 70 litres of water at 293 K, sends $7.7 \times 10^{-37}$ W, the paper's "about $10^{-36}$ watts", or one graviton
every $2.8 \times 10^8$ years.[^person]

**The closed furnace.** A friction that stayed the same at every temperature would make the 1500 K block send
$(1500/293)^3 = 134$ times as many gravitons as the 293 K one, the paper's "more than a hundredfold". But the friction
that counts is the one at the frequencies of the glow, and a hotter body glows at higher frequencies: the glow's peak,
17 THz at 293 K (chapter 4.4), moves up in proportion to the temperature, to 87 THz at 1500 K. Chapter
[4.4](/tutorial/response/viscosity/#a-metals-electrons-relax-like-a-maxwell-liquid-and-their-friction-has-a-ceiling)
drew iron's friction as the ceiling on a metal's friction, which falls as $1/\omega$. A metal's electrons collide more
often in proportion to the temperature, so the friction at the glow's peak stays the same fraction of that ceiling. The
hot block's friction is therefore $1500/293 = 5.1$ times lower, its count grows as $T^3/T = T^2$, and it sends
$(1500/293)^2 = 26$ times as many gravitons, the paper's "nearer 25".

The pixels' readings differ by less, because each line of sight also crosses the steel walls and ends on the floor,
which are at 293 K in both furnaces and add the same glow to both. Count the cold block's glow as one unit and the
common glow as $g$ units. The readings are then in the ratio

$$\frac{26 + g}{1 + g} = 16 \quad\text{when}\quad g = \tfrac23 .$$

The walls and the floor add about two-thirds of the cold block's glow, and they bring the ratio down from 26 to the
paper's sixteen. Without the floor's glow the paper finds 22.

**What it means.** Counted gravitons measure the product $\matter\eta T^3$, and their energies measure
$\matter\eta T^4$. A hot body with little friction and a cooler body with more can send the same count. If the friction
is the same across the band of the glow, the mean energy of the gravitons, $2.70\,\kB T$, gives the temperature, and
then the count gives the friction. If it is not, the temperature trades off against the shape of $\alpha(\omega)$, as
the paper warns.

## Matter makes no useful lens or mirror, and gravity focuses well only when it is very compact

This section is brief, and chapter R11 reads the rest of the paper's [Section VII](/paper/#sec:no-lens). A glass lens
focuses light because it delays the wave more at its centre, where it is thick, than at its edge, where it is thin.
We want the focal length of such a lens. Take a lens of radius $R$, in metres, whose thickness falls from $h$ on its
axis to zero at its rim along a parabola: at the distance $a$ from the axis it is $h(1 - a^2/R^2)$ thick
(Figure [](#fig:rad-lenses)).[^h] We assume that **the lens is thin**, so that every ray crosses it nearly parallel
to the axis.

By chapter [5.1](/tutorial/waves/wave-equation/#a-medium-can-slow-a-wave-and-its-refractive-index-measures-how-much),
a slab of thickness $L$ holds a wave back by the phase $(n - 1)\,\omega L/c$, with $\sym{refractive-index}{n}$ its
refractive index. At the distance $a$ the lens is such a slab, of thickness $h(1 - a^2/R^2)$. The wave that crosses on
the axis therefore lags the wave that crosses at $a$ by the difference,

$$\begin{aligned}
&(n - 1)\frac{\omega h}{c} - (n - 1)\frac{\omega h}{c}\Bigl(1 - \frac{a^2}{R^2}\Bigr)\\
&\qquad = (n - 1)\,\frac{\omega h\,a^2}{cR^2} .
\end{aligned}$$

Now ask what a wave must do to converge on a point F at the distance $\sym{focal-length}{f}$ behind the lens. Its
crests are then circles centred on F, so close behind the lens the crest on the axis trails the crest at $a$, because
it has the shortest way left to go. From the distance $a$ the path to F is $\sqrt{f^2 + a^2} \approx f + a^2/2f$,
longer than the path from the axis by $a^2/2f$, which takes the phase $\omega a^2/2cf$. The wave on the axis must lag
by exactly this phase. The two lags agree at every $a$ when $(n - 1)\,\omega h/cR^2 = \omega/2cf$, that is, when

$$\boxed{f = \frac{R^2}{2(n - 1)h}} .$$

This $f$ is the **focal length**, the distance behind a lens at which rays that arrive parallel to its axis
cross.[^f] It is a length, as it should be, since $R^2/h$ is in metres. **A check.** A magnifying glass with
$n = 1.5$, 2 cm in radius and 4 mm thick at its centre gives $f = 10$ cm, as it should. As $n \to 1$ the focus moves to
infinity.

**A steel lens.** For a gravitational wave of 1 kHz in steel, Peters's index [](/paper/#eq:index), stated in chapter
5.1, gives $n - 1 = 8.3 \times 10^{-14}$. A lens 1 m in radius (2 m across) and 1 m thick focuses at
$6.0 \times 10^{12}$ m, 40 AU, about Pluto's mean distance from the Sun.[^lens]

**A mirror.** Reflection needs stiffness. W. H. Press [@Press1979] found that a shear modulus $\matter\mu$ changes the
square of the wavenumber by the fraction $16\pi G\matter\mu/c^2\omega^2$. The paper's [*The optical constants of
matter*](/paper/#par:the-optical-constants-of-matter) takes a quarter of it, $4\pi G\matter\mu/c^2\omega^2$, as the
**reflection amplitude** of a sharp face, the reflected amplitude over the arriving one (stated; chapter R11). The
quarter comes from the face: it reflects half the fractional change in the wavenumber, which is half the fractional
change in its square. It is a pure number, since $G\matter\mu$ and $c^2\omega^2$ are both in $\mathrm{m^2\,s^{-4}}$.
This tutorial's steel, with $\matter\mu = 71$ GPa, reflects $1.7 \times 10^{-23}$ of a 1 kHz wave's amplitude and $2.8
\times 10^{-46}$ of its energy.[^steel]

**Gravity as a lens.** A mass $\matter M$ bends a ray that passes it at the distance $b$, its impact parameter
(chapter [1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick)), by
the angle $4G\matter M/bc^2 = 2r_s/b$. Here $\sym{schwarzschild-radius}{r_s} = 2G\matter M/c^2$ is the Schwarzschild
radius of the mass. We state the angle; chapter 11.1 derives it. A ray at $b$ bent toward the axis by this angle
crosses the axis at the distance $b$ divided by the angle:

$$f = \frac{b^2}{2r_s} .$$

Unlike the glass lens's, this focal length grows with $b$, so a point mass has a line of foci, not one focus. The
Earth has $r_s = 8.9$ mm and the radius $R_\oplus = 6.37 \times 10^6$ m. Rays that graze it, at $b = R_\oplus$, cross
at $2.3 \times 10^{15}$ m, or 15,300 AU, the paper's "fifteen thousand times the distance to the Sun". The paper's
**focal ratio** is the focal length over the lens's width, $\sym{focal-ratio}{N} = f/2R$.[^N] For the Earth as the
lens, $R = R_\oplus$ and $N = 1.8 \times 10^8 = 1/8\mathcal C$, with the Earth's compactness $\mathcal C = G\matter
M/R_\oplus c^2 = 7.0 \times 10^{-10}$ (chapter
[0.4](/tutorial/evening/one-pixel/#no-lens-can-be-made-so-the-camera-computes-its-pictures)). This is the last entry
of the paper's [](/paper/#eq:optics-bound).

**How compact a lens must be.** A lens of radius $R$ that focuses at $f$ must bend its edge ray by $R/f$. Gravity bends
it by $2r_s/R$, with $r_s$ for the mass inside that ray. So $R/f = 2r_s/R$, or $r_s/R = R/2f$, and with $N = f/2R$:

{{paper eq:lens-compactness}}

A pocket lens at $f/10$, 5 cm in radius, needs $r_s = R/40 = 1.25$ mm, so $\matter M = r_sc^2/2G = 8.4 \times
10^{23}$ kg, which is 11.5 times the mass of the Moon. Packed into a ball 5 cm in radius, this mass has the density
$1.6 \times 10^{27}\unit{kg\,m^{-3}}$, $7 \times 10^9$ times that of an atomic nucleus, $2.3 \times
10^{17}\unit{kg\,m^{-3}}$. Only a black hole is compact enough, and the paper's Figure
[](/paper/#fig:black-hole-camera) puts one in front of its camera.

![Look first at the curved crests behind the thin lens: they are circles centred on $F$, so the crest on the axis
trails the crest at the height $a$. The glass makes it trail, because the wave on the axis crosses the most glass, and
the path from $a$ to $F$ is longer by $a^2/2f$, so all the parts arrive in step. A mass (right) bends near rays more and
sends them to a nearer focus, so its foci lie along a line, at distances growing as $b^2$. The lens's thickness and all
the angles are greatly exaggerated: the Earth bends a grazing ray by $2.8 \times 10^{-9}$
radians.](tut-rad-lenses){#fig:rad-lenses}

::: check
### Q

Why does the Sun's surface look as bright from Mars as from the Earth, though it looks smaller?

### A

Radiance is conserved along a ray in empty space, so each part of the disc sends a pixel the same radiance from any
distance. Only the solid angle of the disc shrinks, as $1/r^2$, and with it the flux.

### Q

When is a slab invisible against its background, whatever its optical depth?

### A

When it is at the background's temperature, so that $B_\omega = I_{\rm bg}$ and the change
$(B_\omega - I_{\rm bg})(1 - e^{-\tau})$ is zero for every $\tau$.

### Q

A line of sight crosses the Earth's diameter of matter with the placeholder friction. By what fraction does this
matter dim what lies behind it, and why does this mean there are no shadows?

### A

The optical depth is $\alpha L = 1.2 \times 10^{-37} \times 1.27 \times 10^7 = 1.6 \times 10^{-30}$, and the
background is dimmed by that fraction. A body hides what is behind it only when $\tau$ approaches one; here it only adds
its own glow.

### Q

Counting gravitons alone, can the camera tell a hot body with little friction from a cooler body with more?

### A

No: the count measures $\matter\eta T^3$, and the two bodies can have the same product. The energies of the gravitons,
which measure $\matter\eta T^4$, separate them if the friction is the same across the band of the glow.
:::

**The idea to keep: a pixel measures radiance, which no distance dims. Along its line of sight matter adds its glow
and takes the fraction $\alpha$ per metre of what passes, and a body as warm as its background is invisible. For
gravitational waves $\alpha$ is so small that nothing absorbs: a pixel adds the glow of everything on its line, and
there are no shadows, no useful lenses and no mirrors.**

::: problems
### Practice

A steel wall 1 m thick has the placeholder friction, $10^{-3}\unit{Pa\,s}$. Find its optical depth for gravitational
waves, and the fraction of a background that it removes.

::: solution
From [](/paper/#eq:alpha), $\alpha = 16\pi G\matter\eta/c^3 = 16\pi \times 6.67 \times 10^{-11} \times
10^{-3}/(3.00 \times 10^8)^3 = 1.2 \times 10^{-37}\unit{m^{-1}}$, so $\tau = \alpha L = 1.2 \times 10^{-37}$ for
$L = 1$ m. A thin slab removes the fraction $1 - e^{-\tau} \approx \tau$ of its background, so the wall removes
$1.2 \times 10^{-37}$ of it.
:::

### Stretch

Combine this chapter with chapter 4.4. At the glow's peak at 293 K, copper's electrons have the friction
$\mathrm{Re}\,\matter\eta = 1.1 \times 10^{-4}\unit{Pa\,s}$. If copper had that friction at every frequency, how much
power would a cubic metre of it send, compared with the placeholder's $2.1 \times 10^{-34}\unit{W\,m^{-3}}$?

::: solution
At a fixed temperature and with a friction the same at every frequency, $4\pi j_E = 4\alpha\sigma_{\rm SB}T^4$ is
proportional to $\matter\eta$. So copper would send $(1.1 \times 10^{-4}/10^{-3}) \times 2.1 \times 10^{-34} = 2.3
\times 10^{-35}\unit{W\,m^{-3}}$, about a ninth of the placeholder's. The paper's table gives 2.8 in units of
$10^{-35}\unit{W\,m^{-3}}$, a little more, because it uses copper's whole spectrum: below the peak, copper's friction
is larger (chapter 4.4), and its effective friction is $1.3 \times 10^{-4}\unit{Pa\,s}$.
:::

### The paper

Derive [](/paper/#eq:jN-friction) from [](/paper/#eq:kirchhoff) with the two stated results,
$\int_0^\infty B_\omega\,\dd\omega = \sigma_{\rm SB}T^4/\pi$ and the mean energy $2.70\,\kB T$. Then use
[](/paper/#eq:lens-compactness) to check the paper's pocket lens, "eleven times the mass of the Moon".

::: solution
Kirchhoff's law with a constant $\alpha$ gives $j_E = \alpha\,\sigma_{\rm SB}T^4/\pi$, and $j_N = j_E/2.70\,\kB T =
\alpha\,\sigma_{\rm SB}T^3/2.70\pi\kB$. With $\alpha = 16\pi G\matter\eta/c^3$ the factors $\pi$ cancel and $j_N =
16G\matter\eta\,\sigma_{\rm SB}T^3/2.70\,\kB c^3$. For the lens, $N = 10$ and $R = 0.05$ m give $r_s = R/4N =
1.25$ mm, and $\matter M = r_sc^2/2G = 1.25 \times 10^{-3} \times (3.00 \times 10^8)^2/(2 \times 6.67 \times 10^{-11})
= 8.4 \times 10^{23}$ kg. The Moon's mass is $7.35 \times 10^{22}$ kg, so this is 11.5 Moons, the paper's "eleven".
:::
:::

::: paper
- [*How matter glows*](/paper/#sec:thermal), in the plain words of Section VI, and its "no shadows": the
  [line integral](#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line) of this chapter.
- [*Emission*](/paper/#par:emission): [](/paper/#eq:kirchhoff), from the
  [equilibrium argument](#a-warm-bodys-glow-over-its-absorption-is-the-radiance-of-an-enclosure-at-its-temperature),
  and the bullet *Matter is transparent* with $(B_\omega - I_{\mathrm{bg}})(1 - e^{-\tau})$.
- Figures [](/paper/#fig:line-integral) and [](/paper/#fig:closed-furnace): the sum along a line, and the hot block
  through the steel. Table [](/paper/#tab:materials) lists $4\pi\int j_\omega\,\dd\omega$ for real materials.
- [*A bound on the glow*](/paper/#par:a-bound-on-the-glow): the optical depth added up over frequency, which keeps every
  material far from opaque across any band of useful width (chapter 10.3).
- [Section IX](/paper/#sec:first-image): [](/paper/#eq:column), the number radiances of the Earth and the Sun, and
  [](/paper/#eq:jN-friction), derived [here](#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature).
- [*The optical constants of matter*](/paper/#par:the-optical-constants-of-matter) and
  [*A black hole as the lens*](/paper/#par:a-black-hole-as-the-lens): the steel lens and wall, the Earth's focal length,
  [](/paper/#eq:optics-bound)'s $N = 1/8\mathcal C$ and [](/paper/#eq:lens-compactness) (chapter R11).
:::

::: deeper
- The [GR course, section 16.4](https://neovand.github.io/general-relativity/chapter-16.html#16-4-bending-light-finding-the-famous-factor-of-two)
  derives the bending angle $4GM/bc^2$ used in the last section, with its factor of two.
- The [GR course, chapter 11](https://neovand.github.io/general-relativity/chapter-11.html#fields-carry-energy) shows
  how a field carries energy and what its flux is, the ground on which radiance stands.
- G. B. Rybicki and A. P. Lightman, *Radiative Processes in Astrophysics* (Wiley, 1979), chapter 1: radiance, its
  conservation along a ray, the equation of transfer and Kirchhoff's law, in the form used here.
- P. C. Peters, "Index of refraction for scalar, electromagnetic, and gravitational waves in weak gravitational
  fields" [@Peters1974], and W. H. Press, "On gravitational conductors, waveguides, and circuits" [@Press1979]: the
  sources of the stated index and reflection.
:::

[^I]: This $I_\omega$ is the paper's radiance. It is not the Stokes $I$ of chapter 5.4, the moment of inertia of
    chapter 1.6, the invariant $\mathrm{tr}\,\mathcal W^2$, or the image $I$ of chapter 5.3.

[^modes]: A pixel cannot accept an arbitrarily small cone. Chapter
    [5.3](/tutorial/waves/diffraction/#an-array-resolves-as-many-directions-as-its-area-holds-square-wavelengths)
    found that an aperture of area $A$ resolves directions about $\lambda^2/A$ steradians apart, so the product
    $\dd A\,\dd\Omega$ of any detector is at least about $\lambda^2$, one square wavelength.

[^s]: The letter $s$ is not the source $s(\vect x, t)$ of chapter 5.2 nor the ripple ratio $s$ of chapter 3.7. The
    paper uses it for the distance along a line of sight.

[^tau]: This $\tau$ is the paper's letter for the optical depth. It is not the relaxation time $\tau$ of chapter 4.4.

[^B]: The letter $B$ here is the paper's Planck radiance, not the magnetic part of the tide $\curv{\tB}_{ij}$ or the
    magnetic field of light.

[^index]: Inside a medium of refractive index $n$ the radiance in equilibrium is $n^2B_\omega$, not $B_\omega$. For
    gravitational waves in matter $n - 1$ is about $10^{-13}$ (chapter 5.1), so the difference is harmless here.

[^net]: The paper adds that $\alpha$ is the net absorption coefficient, the absorption less the emission that passing
    radiation stimulates, and that $j_\omega$ is the emission that happens on its own. Chapter 10.2 explains the
    difference.

[^sigma]: In Part 3 a bare $\matter\sigma$ is a surface density, so this chapter writes $\sigma_{\rm SB}$; the paper
    writes $\sigma$. The value is the same as for light, because light also has two polarizations.

[^person]: These figures are at 293 K, the temperature of the table, whose last column gives water's $1.7\,\kB T$. A
    person is at 310 K. With the same friction the power grows as $T^4$, to $9.6 \times 10^{-37}$ W, and the count as
    $T^3$, to one graviton every $2.4 \times 10^8$ years, close to the paper's "two hundred million years".

[^f]: In this section $f$ is a focal length, the paper's letter in Section VII. Elsewhere in Part 5 it is a frequency.

[^h]: This $h$ is a thickness, not the strain $h$ of chapter 5.1. In this chapter $L$ is always the thickness of a
    slab, and $R$ always the radius of a lens; the Earth's radius is $R_\oplus$.

[^steel]: This is chapter 5.1's steel: density $\matter\rho = 7850\unit{kg\,m^{-3}}$ and shear sound at $c_T =
    3000$ m/s, so that $\matter\mu = \matter\rho c_T^2 = 71$ GPa. The paper's $2 \times 10^{-23}$ and
    $4 \times 10^{-46}$ use a stiffer steel, $\matter\mu = 80$ GPa, which gives $1.9 \times 10^{-23}$ and
    $3.6 \times 10^{-46}$.

[^lens]: The paper says that a steel lens a metre thick focuses "some $10^{13}$ metres away, beyond the orbit of
    Pluto". It does not give the radius. Since $f$ grows as $R^2$, a lens 1.3 m in radius would focus at $10^{13}$ m.

[^N]: This $N$ is the paper's letter for the focal ratio in Section VII. It is not the number radiance $N(\hat n)$ of
    the first section.
