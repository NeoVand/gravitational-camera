---
id: R11
title: 'Reading Section VII'
question: 'With Part 11 behind us, can we check every number of Section VII, and what would a black hole really do as the camera''s lens?'
part: '11'
requires: ['1.8', '2.7', '5.1', '5.3', '5.5', 'R5', '11.1', '11.3']
paper: [sec:no-lens, eq:index, eq:optics-bound, eq:lens-compactness, fig:black-hole-camera, eq:beam, eq:diffraction, fig:array]
figures: [fig:black-hole-camera, fig:array]
live: [black-hole-camera, array, hole-against-sky]
---

**What you need:** chapters
[5.5](/tutorial/waves/radiance/#matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact),
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array),
[11.1](/tutorial/black-holes/schwarzschild/#a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring) and
[11.3](/tutorial/black-holes/hawking/).

The paper's [Section VII](/paper/#sec:no-lens) asks whether anything can do for gravitational waves what glass does
for light. It answers that only a black hole can, and puts a hole of about two Moon masses in front of the camera.
With Part 11 behind us, can we check every number of Section VII, and what would a black hole really do as the
camera's lens?

We read the section in order (Figure [](#fig:read-vii-map)). As in [R10](/tutorial/glow/reading-section-vi/), each
claim is *checked here* (a number recomputed from an earlier result), *read now, derived in chapter N*, or *stated in
the paper*; a few short steps are *derived here*. For the hole we use chapter 11.3's equilibrium mass,
$1.356\times10^{23}$ kg, throughout.

![Look first at the solid boxes: every paragraph of Section VII rests on chapters of Parts 1 to 11, with its stated
results in dotted insets. The last box follows one hole through three of them.](tut-read-vii-map){#fig:read-vii-map}

::: plain
Section VII says that no lens or mirror made of matter can focus gravitational waves usefully. Matter slows, reflects
and absorbs the waves, but each effect is tiny for one reason: an ordinary body curves space very little. A number
called the compactness measures how much, and it comes near one only for a black hole.

So the section tries a small black hole as the lens. It would focus only the glow of warm matter, and its tide would
tear apart a camera close to it. From an orbit 26 kilometres away the camera would gather 130 times more glow, but the
hole's pull would drown the picture of everything nearby. The camera needs no lens: a computer delays and adds its
pixels' records, as a lens does with glass.
:::

## Matter barely slows a wave, and reflects less still

[*The optical constants of matter*](/paper/#par:the-optical-constants-of-matter) opens with Peters's index, the
paper's

{{paper eq:index}}

with $\sym{refractive-index}{n}$ the refractive index, the factor by which matter slows the wave, $\matter\rho$ the
density in $\mathrm{kg\,m^{-3}}$ and $\omega$ the angular frequency in $\mathrm{s^{-1}}$ (*stated in the paper*
[@Peters1974], as in chapter
[5.1](/tutorial/waves/wave-equation/#a-medium-can-slow-a-wave-and-its-refractive-index-measures-how-much)). For steel,
$\matter\rho = 7850\unit{kg\,m^{-3}}$, at 1 kHz it is $8.3\times10^{-14}$, the paper's "$8\times10^{-14}$" (*checked
here*). Press's stiffness term $16\pi G\matter\mu/c^2\omega^2$, with $\sym{shear-modulus}{\matter\mu}$ the shear modulus
in pascals, is $6.7\times10^{-23}$ for the 71 GPa of chapter 5.1's steel, with $c_T = 3000\unit{m\,s^{-1}}$ (*checked
here*); the term, and the $(v/c)^2$ of free matter whose velocities spread by $v$, are *stated in the paper*
[@Press1979; @FlaugerWeinberg2018].

By chapter 5.5, a thin lens of radius $R$ and central thickness $h$ focuses at $f = R^2/2(n - 1)h$, so a steel lens
1 m in radius and 1 m thick focuses at $6.0\times10^{12}$ m, or 40 AU, the paper's "some $6\times10^{12}$ metres
away, at the distance of Pluto" (*checked here*). The wave
is $c/(1\unit{kHz}) = 300$ km long, so "a lens able to act on it at all would have to be far larger" (*checked
here*).

A sharp face reflects the amplitude $4\pi G\matter\mu/c^2\omega^2$ (*stated in the paper*; 5.5 explains the quarter),
$1.7\times10^{-23}$ for that steel, and its square, $2.8\times10^{-46}$, of the energy: the paper's
"$1.7\times10^{-23}$" and "$3\times10^{-46}$" (*checked here*). Absorption is weaker still, as the optical depth below
shows. So [R9](/tutorial/one-point/reading-section-viii/)'s stated claim that matter neither reflects nor absorbs is now
checked: walls send the camera no echoes.

## Every optical constant of a body is its compactness times factors below one

A mass bends a passing wave by $4G\matter M/bc^2 = 2r_s/b$ at the distance $b$, with
$\sym{schwarzschild-radius}{r_s} = 2G\matter M/c^2$ its Schwarzschild radius (*read now, derived in chapter
[11.1](/tutorial/black-holes/schwarzschild/#far-from-a-mass-light-bends-by-twice-newtons-angle)*). So rays at $b$ cross
the axis at $b^2/2r_s$ (chapter 5.5). The Earth, with $r_s = 8.87$ mm and radius $R_\oplus$, focuses grazing rays at
$R_\oplus^2/2r_s = 15{,}300$ AU, "fifteen thousand times the distance to the Sun". Its **focal ratio**, the focal
length over the lens's width, $\sym{focal-ratio}{N} = f/2R$ (the paper's letter, not chapter 5.5's number radiance),
is $1.8\times10^8$, "near $2\times10^8$" (*checked here*, by 5.5). Both are set by the **compactness**
$\sym{compactness}{\mathcal C} = G\matter M/Rc^2$, a pure number for a body of mass $\matter M$ and radius $R$:
$6.96\times10^{-10}$ for the Earth (*checked here*, as in
[R5](/tutorial/waves/reading-section-iii/#the-plain-words-hold-number-by-number-from-the-compass-to-the-three-facts)).

For a uniform ball whose shear sound travels at $c_T$ with quality factor $Q$, crossed by a wave of **reduced
wavelength** $\sym{reduced-wavelength}{\bar\lambda} = c/\omega$, the wavelength over $2\pi$, the paper writes

{{paper eq:optics-bound}}

A uniform ball has $\matter M = \tfrac43\pi R^3\matter\rho$, so $G\matter\rho = 3\mathcal Cc^2/4\pi R^2$, and each
entry takes a line:

- the phase delay across a diameter: the wave takes the extra time $(n - 1)2R/c$, so its phase falls behind by $\omega$
  times that, $(n - 1)\,\omega\,2R/c = 4\pi G\matter\rho R/\omega c = 3\mathcal C\bar\lambda/R$ (*checked here*, from
  the stated index);
- with $\matter\mu = \matter\rho c_T^2$, the reflection amplitude $4\pi G\matter\mu/c^2\omega^2 = 3\mathcal C(c_T/c)^2
  (\bar\lambda/R)^2$ (*checked here*, from Press's stated amplitude);
- the **optical depth** $\sym{optical-depth}{\tau}$, the absorption along the diameter (a pure number, not a time):
  the paper's absorption coefficient [](/paper/#eq:alpha), $\alpha = 16\pi G\matter\eta/c^3$ for a friction
  $\matter\eta$ in Pa s, is $1.2\times10^{-37}\unit{m^{-1}}$ for water's $10^{-3}$ Pa s (*read now, derived in chapter
  [7.8](/tutorial/geometry/wave-energy/#viscosity-fades-a-wave-at-hawkings-rate)*); with a ringing solid's
  $\mathrm{Re}\,\matter\eta = \matter\rho c_T^2/\omega Q$ (chapter
  [4.4](/tutorial/response/viscosity/#a-ringing-solids-friction-is-its-quality-factor)), $\tau = 2R\alpha =
  (24\mathcal C/Q)(c_T/c)^2\bar\lambda/R$ (*read now, derived in chapter 5.1's paper problem*);
- $N = 1/8\mathcal C$, from the paper's [](/paper/#eq:lens-compactness) with $r_s = 2\mathcal CR$ (*read now, derived
  in chapter 5.5*).

"After $\mathcal C$, every factor is below one" (*checked here*): $c_T/c = 1.0\times10^{-5}$ for $3000\unit{m\,
s^{-1}}$; $1/Q < 1$ for anything that rings; $\bar\lambda/R < 1$ for a body large enough to bend the wave rather than
diffract it. Press's mirror condition $\matter\mu > \matter\rho c^2$ (*stated in the paper*) is shear sound faster than
light, since $c_T^2 = \matter\mu/\matter\rho$. Smolin's absorption, Loeb's bound, Patla and Nemiroff's solar
focus and McKernan's resonant stars are *stated in the paper* [@Smolin1984; @Smolin1985; @Loeb2020;
@PatlaNemiroff2008; @McKernan2014]. That "only black holes cast shadows" is *read now, derived in chapter 11.3*, and a
spinning hole's reflection "with gain", for $\omega < m\Omega_H$ with $m$ the wave's azimuthal number and $\Omega_H$
the horizon's rate of turning, is *read now, derived in chapter
[11.2](/tutorial/black-holes/spin/#a-hole-amplifies-a-wave-that-turns-with-it-more-slowly-than-its-horizon)*.

## Only a black hole is compact enough, and it focuses only the glow of warm matter

[*A black hole as the lens*](/paper/#par:a-black-hole-as-the-lens) starts from the paper's

{{paper eq:lens-compactness}}

for a lens of radius $R$ and focal length $f$, with $r_s$ for the mass inside its edge ray (*read now, derived in
chapter 5.5*). The pocket lens at $f/10$, 5 cm in radius, needs $r_s = 1.25$ mm, or $8.4\times10^{23}$ kg: 11.5 Moon
masses, at $7.0\times10^9$ times the density of an atomic nucleus, $2.3\times10^{17}\unit{kg\,m^{-3}}$ (*checked
here*).

A hole whose Hawking temperature $T_H = \hbar c^3/8\pi G\matter M\kB$ equals the graviton sky's 0.905 K has
$\sym{equilibrium-mass}{\matter M_{\rm eq}} = 1.356\times10^{23}$ kg, 1.85 Moon masses (*read now, derived in chapter
11.3*), the paper's "$1.356\times10^{23}$ kilograms". Lighter holes are hotter and evaporate, and the balance is
unstable because a hole that loses heat grows hotter (*read now, derived in chapters 11.3 and
[10.2](/tutorial/glow/kirchhoff/#a-balance-is-stable-only-if-the-heat-capacity-is-positive)*). From the 2.7255 K
microwave sky its capture area takes at most $8.8\times10^{-52}$ of $\matter Mc^2$ each second, "less than a part in
$10^{51}$" (*read now, derived in chapter
[11.3](/tutorial/black-holes/hawking/#a-hole-that-loses-heat-grows-hotter-so-its-balance-with-a-sky-cannot-last)*).

Its $r_s$ is 0.201 mm. By 11.1's **wave-optics cut-off**, a mass focuses only waves shorter than $4\pi r_s$: 2.53 mm,
or frequencies above 118 GHz, the paper's "2.5 mm" and "120 GHz". A 1 kHz wave would need $4\pi r_s = 300$ km, or 8.1
solar masses (*checked here*). So the hole focuses the glow of matter at room temperature, at tens of micrometres
(*read now, derived in chapter
[10.1](/tutorial/glow/black-body/#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)*), but
not the sky it balances: the 0.905 K graviton sky peaks near 53 GHz, below the cut-off (chapter 11.3). The **Einstein
radius** $\sym{einstein-radius}{b_E} = \sqrt{2r_sd}$ for a camera at the distance $d$ behind the hole, and the ring's
angle $\theta_E = \sqrt{2r_s/d}$, are *read now, derived in chapter 11.1*.

## The camera must orbit 26 km away, where the hole gathers 130 times its area

"The camera cannot sit close." By chapter
[11.1](/tutorial/black-holes/schwarzschild/#the-tide-outside-a-round-mass-is-exactly-newtons)'s exact tide the stretch
along the line to the hole is $2G\matter M/r^3$: $1.8\times10^{13}\unit{s^{-2}}$ at a metre, where the ring is $1.15°$,
"$1.2^\circ$". It falls to $1\unit{s^{-2}}$ at 26.3 km, where the ring is $25.5''$, the paper's "$26''$", and its rays
pass $b_E = 3.25$ m from the hole. There the pull is 1340 times the Earth's gravity, and a circular orbit runs at
18.6 km s⁻¹, once every 8.9 s (*checked here*, by
[1.8](/tutorial/newton/orbits-and-kicks/#the-period-of-a-free-orbit-is-set-by-the-tide-where-it-runs)). The camera's
axis, from the camera through the hole, turns with the orbit, so a patch of sky is in focus for
$2\theta_E/(2\pi/8.9\unit{s}) = 0.35$ ms a turn, "a third of a millisecond" (*derived here*).

**The gathered area** (*derived here*). A ray passing at $b$ is bent by $2r_s/b$, so at the distance $d$ it lands at
$b - b_E^2/b$ from the axis. It hits a detector of radius $a$ (not Kerr's $a$) when $|b - b_E^2/b| < a$, that is
between $b_\pm = \tfrac12[\sqrt{a^2 + 4b_E^2} \pm a]$. The annulus between them has the area $\pi(b_+^2 - b_-^2) =
\pi a\sqrt{a^2 + 4b_E^2}$, a length squared. For $a = 5$ cm it is 1.02 m², 130 times $\pi a^2$, the area of a dish
1.14 m across: "about one square metre" and "a little over a metre".

**Fringes and gain.** Rays from opposite sides of the ring meet at the angle $2b_E/d$, so they interfere in fringes
$\lambda d/2b_E = 4.0$ cm apart at a wavelength $\lambda$ of 10 µm (*derived here*). On the axis a point lens raises
the intensity by the factor

$$\frac{\pi w}{1 - e^{-\pi w}} ,$$

with the pure number $\sym{lens-parameter}{w} = 4\pi r_s/\lambda$ (*stated in the paper*, in [Section
XI](/paper/#par:the-transparent-sun-as-a-lens)). On the axis every path round the Einstein ring has the same length,
so all of them arrive in step. For $w \gg 1$ the factor is $\pi w = 4\pi^2r_s/\lambda$: 795 at 10 µm, the paper's
"800". 11.1's cut-off is $w = 1$, where the lens's delay spans a radian; there the gain is still 3.3, and it nears 1
only for much longer waves. Off the axis the paths fall out of step, so the peak fills only a spot 2.9 cm across at
half height, inside the first fringe. A detector 10 cm across averages over the fringes, to 129, the geometric 130
(*checked here*): that is the number that counts, "well within" the peak.

::: gap
The gain needs chapter
[5.3](/tutorial/waves/diffraction/#beyond-an-opening-a-wave-is-a-sum-of-wavelets-from-every-point-of-it)'s sum of
wavelets over the plane of the lens, each path delayed by the mass. It gives $|\Gamma(1 - iw/2)|^2e^{\pi w/2}$, with
$\Gamma$ Euler's gamma function, which is $\pi w/(1 - e^{-\pi w})$. Nakamura and Deguchi (1999) and Schneider,
Ehlers and Falco's *Gravitational Lenses*, chapter 7, do it in full.
:::

The paper says that "it blinds the near field". A person of 70 kg a metre away has chapter
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)'s tide
$9.3\times10^{-9}\unit{s^{-2}}$. At 26.3 km the hole's is $1.07\times10^8$ times larger, the caption's "$10^8$", and
the two are equal only where $r^3 = (\matter M/70\unit{kg})\times(1\unit{m})^3$, at 12,470 km, "12,500 km" (*checked
here*).

{{paper fig:black-hole-camera}}

::: try {#black-hole-camera}
The paper's Figure made live: the hole's stretch $2G\matter M/r^3$ against the camera's distance $r$, with the
person's tide dashed and the bearable $1\unit{s^{-2}}$ dotted, and beside it the rays to the camera, not to scale. One
slider sets the camera's distance, the other the hole's mass in equilibrium masses. The readouts give the ring, $b_E$,
the orbit, the time in focus and the area gathered.

Predict first: when the camera halves its distance, by what factor does the tide grow, and by what factor the ring?
Then halve the distance from 26.3 km to check. Last, set the mass to ten equilibrium masses: is the bearable distance
ten times farther, or less?
:::

## A lens adds nothing classical, and no lens sharpens the near field

[*What a lens would add*](/paper/#par:what-a-lens-would-add): classically nothing, because the array of the paper's
[](/paper/#eq:beam) does the lens's sum by computation (*read now, derived in chapter 5.3*). A converter of gravitons
into photons a metre across (chapter [R10b](/tutorial/glow/reading-section-ix/)) "would gather as much as the hole",
whose dish is 1.14 m (*checked here*). The quantum half, an image formed from counted gravitons when each mode holds
"$10^{-30}$ gravitons or fewer", is *stated in the paper*, and chapter
[R8](/tutorial/quantum/reading-the-quantum-limits/#read-ahead-a-counter-adds-no-noise-and-each-graviton-tells-about-one-bit)
reads it.

The near field's blur comes from Laplace's equation, the paper's [](/paper/#eq:evanescent) (*read now, derived in
chapter [2.7](/tutorial/outside/evanescent/#the-same-fade-appears-for-every-field-that-obeys-laplaces-equation)*).
Pendry's slab restores fading detail for light (*stated in the paper* [@Pendry2000]). Matter answers a tide by
deforming, which adds a fraction of order $G\matter\rho/\omega_0^2$, with $\omega_0$ the angular frequency at which it
rings: $5.8\times10^{-17}$ for the steel ball at 15.1 kHz (chapter 4.3), the form of the paper's [](/paper/#eq:index)
(*checked here*). It reaches one only in a material so soft against its own weight that it is "unstable to
collapse". A slab of thickness $L$ rings near $\omega_0 \approx c_s/L$, or $\pi c_s/L$ in its lowest mode, with $c_s$
a sound speed, so the fraction is one at $L \approx c_s/\sqrt{G\matter\rho}$, where $\sqrt{G\matter\rho} =
7.2\times10^{-4}\unit{s^{-1}}$ for steel. Chapter
[4.3](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound)'s steel gives 4,100 km from shear sound
at $3000\unit{m\,s^{-1}}$ without the $\pi$, and 24,000 km from compressional sound at $5520\unit{m\,s^{-1}}$ with
it: "some ten thousand kilometres" (*checked here*, as an order of magnitude).

## Delaying and adding the records is the camera's lens

[*The computed image*](/paper/#par:the-computed-image): a wave from the direction $\hat n$, pointing toward its source,
reaches a pixel at $\vect x_p$ earlier by $\hat n\cdot\vect x_p/c$, and the image undoes the delays and adds, the
paper's

{{paper eq:beam}}

with $\Lambda(\hat n)$ the projector and $\curv\tE_{kl}$ the tide in $\mathrm{s^{-2}}$, so that $I(\hat n)$ is in
$\mathrm{s^{-4}}$. Chapter
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array) derives the delay
and sum for one number per pixel, and chapter
[7.6](/tutorial/geometry/gravitational-waves/#one-projector-keeps-what-a-wave-can-carry) builds $\Lambda$; the tensor
form, which projects each pixel's table before the sum, is *assembled here* from the two.

The magnetic records tell front from back (*derived here*). A wave from $\hat n$ travels along $\hat k = -\hat n$, so
7.6's $\curv\tB_{qj} = \epsilon_{qrs}\hat k_r\curv\tE_{sj}$ and chapter
[1.1](/tutorial/newton/vectors-and-indices/#two-levi-civita-symbols-make-two-kronecker-deltas)'s identity
$\epsilon_{ipq}\epsilon_{qrs} = \delta_{ir}\delta_{ps} - \delta_{is}\delta_{pr}$ give

$$\begin{aligned}
\epsilon_{ipq}\hat n_p\curv\tB_{qj} &= -\epsilon_{ipq}\epsilon_{qrs}\,\hat n_p\hat n_r\,\curv\tE_{sj}\\
&= \curv\tE_{ij} - \hat n_i\hat n_s\curv\tE_{sj} = \curv\tE_{ij} ,
\end{aligned}$$

since the wave's tide is transverse, $\hat n_s\curv\tE_{sj} = 0$. For a wave from $-\hat n$ the sign of $\hat k$ flips,
and the same combination is $-\curv\tE_{ij}$. So the half-sum $\tfrac12(\curv\tE_{ij} + \epsilon_{ipq}\hat
n_p\curv\tB_{qj})$ keeps the wave from $\hat n$ and cancels the one from $-\hat n$. A flat array "confuses $\hat n$ with
its mirror image in the array's plane", and the half-sum keeps $\sin^8\alpha$ of that wave's power, with $\alpha$ the
angle from the normal: 6% at $45°$ and 61% at $70°$ (chapter 5.3). The sharpness is the paper's

{{paper eq:diffraction}}

for an aperture of width $D$, and for a steady source one moving pixel synthesizes the aperture, as a radar does with
one moving antenna (both *read now, derived in chapter 5.3*). The phase of thermal radiation wanders within $\hbar/\kB
T = 2.6\times 10^{-14}$ s at 293 K, "about $3\times10^{-14}$ s" (*checked here*), so an averaged image "needs pixels
recording together, at least in pairs", as in radio astronomy (chapter 5.3).

{{paper fig:array}}

Arrays 2, 5 and 30 wavelengths wide give round-aperture patterns $29.8°$, $11.8°$ and $1.97°$ wide at half height, the
caption's "scalar pattern of a round aperture" (*checked here*, by 5.3).[^airy] The single pixel's curve is $51.6°$
wide, "some fifty degrees", and dips to $-0.15$ at $59.5°$ (*read now, derived in chapter
[9.6](/tutorial/one-point/the-sky-at-one-point/#a-single-pixels-picture-of-the-sky-is-blurred-over-52)*).

::: try {#array}
The image of one distant source against the steering angle; the slider sets the array's width, from one pixel to 100
wavelengths. Predict first: is one pixel's curve wider or narrower than that of an array two wavelengths wide? Then
drag the slider to its left end, and one step right.
:::

## The capstone: a black hole as the camera's lens

![Look first at the arrows: each panel's number feeds the next. The wavelengths of (b) and the tides of (f) are drawn to
scale; the annulus's width is exaggerated eight times, and the other sizes are
schematic.](tut-read-vii-capstone){#fig:read-vii-capstone}

The capstone follows one hole through Part 11 (Figure [](#fig:read-vii-capstone)). Each row can be recomputed from
the table alone, with $G$, $c$, $\hbar$ and $\kB$.

| Step | Formula | Number | Chapter |
|---|---|---|---|
| (a) mass | $\matter M = \hbar c^3/8\pi G\kB T$, $T = 0.905$ K | $1.356\times10^{23}$ kg; unstable | 11.3 |
| (b) lens | $r_s = 2G\matter M/c^2$; focuses $\lambda < 4\pi r_s$ | 0.201 mm; above 118 GHz, the warm glow | 11.1 |
| (c) orbit | $2G\matter M/r^3 = 1\unit{s^{-2}}$; period $T = 2\pi\sqrt{r^3/G\matter M}$ | 26.3 km; 8.9 s | 11.1, 1.8 |
| (d) view | $\theta_E = \sqrt{2r_s/r}$, $b_E = \theta_Er$, $\theta_ET/\pi$ | $25.5''$, 3.25 m, 0.35 ms a turn | here |
| (e) gathers | $\pi a\sqrt{a^2 + 4b_E^2}$, $a = 5$ cm; peak $\pi w$ | 1.02 m², 130 times; 795 | here; Section XI |
| (f) costs | $r^3 = (\matter M/70\unit{kg})\,\mathrm{m^3}$ | the person's tide wins beyond 12,470 km | 1.4, here |
| (g) adds | an image from counted gravitons | classically nothing | R8 |

::: try {#hole-against-sky}
Chapter 11.3's hole: the slider sets its mass, from 0.3 to 300 equilibrium masses, and a switch chooses the sky,
gravitons at 0.905 K or light at 2.7255 K. Predict first: at one equilibrium mass, is the disc dark, bright or
invisible against each sky? Then slide the mass to 1, switch the sky, and show the depths, the share of a black disc's
darkness that the hole achieves.
:::

::: check
### Q

At twice the distance, 52.5 km, what area does a 5 cm detector gather?

### A

$b_E$ grows as $\sqrt d$, to 4.60 m, so the area is 1.44 m², 184 times the detector's.

### Q

Why can no ordinary body do the hole's work?

### A

A lens needs $r_s/R = 1/4N$, a fortieth even at $f/10$; the Earth has $r_s/R = 2\mathcal C = 1.4\times10^{-9}$.
:::

## The ledger: four of Section VII's five equations are derived, and one is stated

| The paper's equation | Where it is derived; its mark here |
|---|---|
| [](/paper/#eq:index), Peters's index | stated in the paper and in 5.1; its value *checked here* |
| [](/paper/#eq:optics-bound), the optical constants | *checked here*, from the stated index and Press's amplitude |
| [](/paper/#eq:lens-compactness), how compact a lens must be | 5.5, with 11.1's bending; *read now* |
| [](/paper/#eq:beam), the computed image | the scalar sum in 5.3, $\Lambda$ in 7.6; *assembled here* |
| [](/paper/#eq:diffraction), the blur | 5.3; *read now* |

The other results of the section are stated in the paper and marked so above. Reading chapter
[R12b](/tutorial/sky/reading-section-xi-2/#the-transparent-sun-focuses-only-waves-above-8-khz) models the transparent
Sun's focus.

**The idea to keep: a body's optical constants are its compactness times factors below one, so only a black hole
makes a useful lens; orbiting one 26 km away gains a metre-wide dish and loses the near field, so the camera computes
its pictures instead.**

::: problems
### Practice

Rerun *The camera cannot sit close* for ten times the mass: where is the tide $1\unit{s^{-2}}$, what is $b_E$ there,
and what area does a 5 cm detector gather?

::: solution
The distance grows as $\matter M^{1/3}$, to 56.6 km, and $b_E$ as $\matter M^{2/3}$, to 15.1 m; the area is 4.74 m²,
close to $2\pi ab_E$ since $b_E \gg a$.
:::

### Stretch

With chapters 5.5 and 11.1: above what frequency can the Earth focus a wave?

::: solution
Above $c^3/8\pi G\matter M_\oplus = 2.7$ GHz, a wavelength of $4\pi r_s = 11$ cm.
:::

### The paper

From the paper's [](/paper/#eq:optics-bound), find the Earth's phase delay for a 1 kHz wave and its focal ratio
($R = 6371$ km), and the delay in time.

::: solution
At 1 kHz, $\bar\lambda = 47.7$ km, so $\Delta\phi = 3\mathcal C\bar\lambda/R = 1.6\times10^{-11}$ rad and $N =
1/8\mathcal C = 1.8\times10^8$. The delay is $\Delta\phi/\omega = 2.5\times10^{-15}$ s.
:::
:::

::: paper
- [Section VII](/paper/#sec:no-lens) in full: its five equations and Figures [](/paper/#fig:black-hole-camera) and
  [](/paper/#fig:array).
- [Section XI](/paper/#sec:vistas): the hole as warm as the sky, the point lens's gain, and the Sun as a lens (chapter
  R12b).
:::

::: deeper
- The [GR course, section 16.4](https://neovand.github.io/general-relativity/chapter-16.html#16-4-bending-light-finding-the-famous-factor-of-two)
  derives the bending $4GM/bc^2$ that every lens here rests on.
:::

[^airy]: With $\Lambda(\hat n)$ in the sum, the power of the paper's [](/paper/#eq:beam) for an unpolarized source is
    that pattern times $(1 + 6\cos^2\theta + \cos^4\theta)/8$, with $\theta$ the steering angle, so its widths are
    $28.5°$, $11.7°$ and $1.97°$, "within five per cent in width".
