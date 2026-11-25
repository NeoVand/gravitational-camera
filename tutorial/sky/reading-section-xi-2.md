---
id: R12b
title: 'Reading Section XI, part 2, with the capstone: a black hole against the first light'
question: 'With Parts 11 and 12 behind us, can we derive or check every claim of the second half of Section XI, and what would the camera see beside a black hole against the first light?'
part: '12'
requires: ['6.3', '8.5', '11.1', '11.2', '11.3', '12.1', '12.2']
paper: [sec:vistas, eq:graviton-temperature, fig:black-hole, fig:sun-lens]
figures: [fig:black-hole, fig:sun-lens]
live: [shadow-and-ring, hole-against-sky]
---

**What you need:** chapters
[11.1](/tutorial/black-holes/schwarzschild/#light-can-circle-a-hole-and-the-hole-casts-a-shadow),
[11.3](/tutorial/black-holes/hawking/#mode-by-mode-a-hole-is-a-grey-body),
[12.1](/tutorial/sky/stars/#eddingtons-model-ties-the-pressure-to-the-density) and
[12.2](/tutorial/sky/universe/#the-graviton-sky-is-a-uniform-glow-with-a-dipole-untouched-by-lenses); helpful,
[9.4](/tutorial/one-point/petrov/#moving-the-pixel-moves-the-four-directions-as-rays-of-light) and
[R8](/tutorial/quantum/reading-the-quantum-limits/#read-ahead-coincidences-tell-a-sky-born-hot-from-one-born-in-inflation).

The paper's Figure [](/paper/#fig:black-hole) shows one black hole twice: in light, with the Milky Way drawn round it
into a ring, and in gravitons left from the early universe, the first light of this chapter's title, as a black disc
in a uniform glow. With Parts 11 and 12 behind us, can we derive or check every claim of the second half of Section
XI, and what would the camera see beside a black hole against the first light?

Reading chapter R12 read Section XI up to [the Milky
Way](/tutorial/sky/reading-sections-x-and-xi/#in-waves-the-galaxys-centre-is-a-hundred-times-brighter-than-the-opposite-sky);
this chapter reads the rest in order, with the [plain words](/paper/#sec:vistas)' claims where they return (Figure
[](#fig:read-xi-2-map)). As in [R11](/tutorial/black-holes/reading-section-vii/), each claim is *checked here* (a
number recomputed from an earlier result), *read now, derived in chapter N*, or *stated in the paper*; *derived here*
marks two steps no chapter takes.

![Look first at the solid boxes: every stretch of the second half of Section XI rests on chapters of Parts 2 to 13,
with its stated results in dotted insets. The last box follows one hole through four of
them.](tut-read-xi-2-map){#fig:read-xi-2-map}

::: plain
The second half of Section XI imagines a sky of gravitons left from the hot early universe. If it exists, it is a
uniform glow at 0.905 kelvin, a third of the temperature of the light left from that time, a little warmer in the
direction we move. Only black holes would darken it.

A hole is dark only if it is colder than the sky, so a hole of about two Moon masses, exactly as warm, vanishes. A
heavier hole casts a pale shadow, because the sky's gravitons are long compared with it. A camera falling into a hole
sees a smaller shadow than a camera at rest. The Sun focuses only the shortest gravitational waves, and matter
reflects almost none, so every picture is made from what a scene sends out, how it pulls, or how it yields.
:::

## A glow from the start would be at 0.905 K and outshine every other graviton sky

Gravitons "stop interacting near the Planck temperature" (*read now*, an estimate in chapter 12.2). Then comes the
paper's

{{paper eq:graviton-temperature}}

with $\sym{graviton-temperature}{T_g}$ the gravitons' temperature today and $\sym{photon-temperature}{T_\gamma} =
2.7255\unit K$ the microwave sky's, both in kelvin (*read now, derived in chapter
[12.2](/tutorial/sky/universe/#gravitons-parted-first-and-kept-a-colder-share-of-the-heat)* from conserved entropy).
The 106.75 counts the Standard Model's states when the gravitons parted, and the 3.91 today's photons and neutrinos;
more particles would make $T_g$ colder.[^leak] So $T_g = 0.3321\times2.7255 = 0.905$ K, "about a third" (*checked
here*). That the glow "is a test of inflation", a proposed burst of early expansion that would have thinned it to
nothing, is *stated in the paper* [@VagnozziLoeb2022].

Radiation other than photons is measured in **extra species of neutrino**: its energy density over that of one
neutrino and its antineutrino. The $\tfrac87$ sets the graviton's two states against their $2\times\tfrac78$, and with
12.2's $T_\nu = 1.945$ K, $\Delta N_{\rm eff} = \tfrac87(T_g/T_\nu)^4 = 0.054$, "0.05 of an extra species" (*checked
here*). Over the critical density, that of a flat universe (12.2), the glow's energy density is $\Omega_g =
6.6\times10^{-7}$, "$7\times10^{-7}$" (*checked here*).[^omega] Pulsar timing's "about $10^{-8}$" is *stated*
[@NANOGrav2023].

The count $N = \zeta(3)(\kB T/\hbar)^3/2\pi^3c^2$, with $\zeta(3) = 1.202$, is chapter
[10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)'s number
radiance of a black body of two polarizations: $3.59\times10^{14}$ gravitons per second, per square metre and per
steradian at 0.905 K (*checked here*). That is $3\times10^{19}$ times the Earth interior's "$1.2\times10^{-5}$" and
$9\times10^8$ times the Sun core's "$4\times10^5$" (chapter
[R10b](/tutorial/glow/reading-section-ix/#at-midnight-the-suns-core-outshines-the-ground-ten-billion-times)). The mean
energy $2.70\,\kB T$ gives a wavelength of 5.9 mm, "about six millimetres", which a one-metre aperture resolves to
$0.34°$, "a third of a degree" (*checked here*, by 12.2).

## The glow has a dipole and the light's large spots, lenses leave it uniform, and only holes darken it

*It has a dipole from our motion.* Our speed through the microwave sky's frame, $\obs v = 370\unit{km\,s^{-1}}$
(*stated* [@Planck2018I]), is $\obs v/c = 1.23\times10^{-3}$, "$1.2\times10^{-3}$", so the glow is 1.12 mK warmer
ahead (*read now, derived in chapters
[6.3](/tutorial/relativity/aberration/#a-moving-black-body-is-still-a-black-body-hotter-ahead) and 12.2*).

*It shares the large spots.* The paper writes small departures from uniformity as $\field g_{ij} = a^2(1 +
2\field\Phi)\delta_{ij}$, with $a$ the scale factor and $\sym{metric-stretch}{\field\Phi}$ a pure number. **This
$\field\Phi$ is a fractional stretch of lengths, not the Newtonian potential.** With
$\sym{temperature-contrast}{\Theta}$ the fractional change of a glow's temperature, $\dot\Theta = -\dot{\field\Phi}$
holds for any massless quanta on scales larger than the horizon, the distance light had then travelled (*read now,
derived in chapter [12.2](/tutorial/sky/universe/#on-large-scales-the-graviton-sky-shares-the-lights-spots)*). The
gravitons' surface lies 14.14 gigaparsecs (Gpc) away against the light's 13.86 Gpc, "only $2\%$ farther" (*checked
here*, by 12.2's integral). The agreement scale by scale is *stated in the paper* [@AlbaMaldacena2016; @Bartolo2019;
@Ricciardone2021; @Schulze2023]. Its fall "above a multipole of about a hundred" is plausible: the surfaces lie 0.28
Gpc apart, 0.02 rad seen from 14 Gpc, and a pattern of degree $\ell$ has features $\pi/\ell$ wide, so $\ell \approx
\pi/0.02 \approx 160$ (12.2).

*Lensing leaves its uniform part unchanged*, because bending keeps every mode's occupation (*read now, derived in
chapter 12.2*). *Only black holes cast shadows on it*, since nothing else absorbs across a broad band (*read now,
derived in chapters 11.3 and
[R11](/tutorial/black-holes/reading-section-vii/#every-optical-constant-of-a-body-is-its-compactness-times-factors-below-one)*).

## Seen from rest near the hole, the shadow is 7.3° in radius and the sky 2.6% warmer

{{paper fig:black-hole}}

The figure's "exact rays of the Schwarzschild metric" are the orbits of light of chapter
[11.1](/tutorial/black-holes/schwarzschild/#light-can-circle-a-hole-and-the-hole-casts-a-shadow) (*read now*). The
camera is at rest at $r = 40\,G\matter M/c^2$, with $r$ 11.1's circumference radius. The shadow's angular radius
$\sym{shadow-radius}{\alpha_h}$, from the hole's centre to its edge, is 11.1's

$$\sin\alpha_h = \sqrt{27}\,\frac{G\matter M}{c^2r}\sqrt{1 - \frac{2G\matter M}{c^2r}} ,$$

$7.27°$ at $r = 40\,G\matter M/c^2$, the paper's "$7.3^\circ$" (*checked here*). A camera at rest there measures every
frequency raised by $1/\sqrt{1 - 2G\matter M/c^2r} = 1.026$ (*read now, derived in chapter
[11.1](/tutorial/black-holes/schwarzschild/#seen-from-rest-near-a-hole-the-whole-sky-is-warmer)*). So the sky is 2.60%
warmer, at 0.9285 K, the caption's "$0.929\,\mathrm K$" (*checked here*), and the camera's thermometer reads how deep
it sits: $1 - 2G\matter M/c^2r = (T_g/T_{\rm seen})^2$.

The dashed Einstein ring is where the sky straight behind the hole is seen. Its ray passes at the impact parameter
$b = 14.17\,G\matter M/c^2$ and arrives $20.2°$ from the hole, "$20^\circ$" (*checked here*, by integrating 11.1's
orbit of light until it has turned through 180°; the weak-field ring gives $18.1°$). Inside the ring a ray seen above
the hole passed above it, but it bent past the point straight behind and comes from the sky below that point. So "each
side of the sky appears on the opposite side of the hole" (*read now* from 11.1's fan of rays).

The hole's Hawking temperature, $T_H = \hbar c^3/8\pi G\matter M\kB$, is 0.905 K at chapter 11.3's equilibrium mass,
$1.356\times10^{23}$ kg or 1.85 Moon masses, the paper's "$1.356\times10^{23}\,\mathrm{kg}$, nearly twice the mass of
the Moon" (*checked here*). A heavier hole is colder than the glow and casts a shadow, and a lighter one glows (*read
now, derived in chapter [11.3](/tutorial/black-holes/hawking/#a-black-hole-has-a-temperature-lower-the-heavier-it-is)*).
The hole in balance is dark against the warmer microwave sky, and it "still lenses the sky's spots" (11.3, 12.2).

## Mode by mode a hole returns the sky changed by its share, and spin can make it bright

*The bookkeeping.* A wave of degree $\ell$ and angular frequency $\omega$ is absorbed with the probability
$\sym{greybody-factor}{\Gamma_\ell(\omega)}$, the **greybody factor**, and the hole emits in the same proportion. With
$\sym{background-occupation}{n_{\rm bg}}$ the sky's mean number of quanta per mode and $\sym{hole-occupation}{n_H}$
that at the hole's temperature, the camera receives

$$n_{\rm out} = n_{\rm bg} + \Gamma_\ell\,(n_H - n_{\rm bg})$$

(*read now, derived in chapter [11.3](/tutorial/black-holes/hawking/#mode-by-mode-a-hole-is-a-grey-body)* from
detailed balance). A spinning hole amplifies the waves that turn with it, its **superradiance** (*read now, derived in
chapter [11.2](/tutorial/black-holes/spin/#a-hole-amplifies-a-wave-that-turns-with-it-more-slowly-than-its-horizon)*).
For it $n_H$ is taken at $\omega - m\Omega_H$, with $m$ the wave's azimuthal number and
$\sym{horizon-angular-velocity}{\Omega_H}$ the horizon's angular velocity in $\mathrm{s^{-1}}$; for $\omega <
m\Omega_H$ both factors are negative, and the mode comes out brighter than the sky (*read now, derived in chapters
11.2 and [11.3](/tutorial/black-holes/hawking/#a-spinning-hole-can-be-brighter-than-any-sky)*).

Chapter [11.2](/tutorial/black-holes/spin/#a-spinning-hole-adds-its-spin-to-its-mass-and-the-spin-has-a-ceiling)
writes the spin as $\sym{dimensionless-spin}{\chi} = ac^2/G\matter M$, a pure number from 0 to 1, with $a$ the hole's
angular momentum over $\matter Mc$, a length (not the scale factor above); the paper's "$a = 0.998\,GM/c^2$" is $\chi
= 0.998$. The gains of the mode $\ell = m = 2$ are *stated in the paper* [@TeukolskyPress1974]: at most 91% at $\chi =
0.998$, and "$138\%$" at the greatest spin.

"Ten times as bright as the sky" is *checked here* with the stated 91%. At $\chi = 0.998$ chapter 11.2's
[$\Omega_H$](/tutorial/black-holes/spin/#a-spinning-hole-adds-its-spin-to-its-mass-and-the-spin-has-a-ceiling) is
$0.469\,c^3/G\matter M$, and its [surface
gravity](/tutorial/black-holes/spin/#the-area-of-a-horizon-never-shrinks-so-spin-holds-energy-that-can-be-taken-out)
$\sym{horizon-surface-gravity}{\kappa}$, an acceleration, is $0.0297\,c^4/G\matter M$, 0.119 times a hole's without
spin. The temperature $\kB T_H = \hbar\kappa/2\pi c$ is lower by the same factor (*stated*, as in
[11.3](/tutorial/black-holes/hawking/#a-spinning-hole-can-be-brighter-than-any-sky)). With $x = G\matter M\omega/c^3$
and $m = 2$, the exponent of $n_H$ is

$$\begin{aligned}\frac{\hbar(\omega - 2\Omega_H)}{\kB T_H} &= \frac{2\pi c(\omega - 2\Omega_H)}{\kappa}\\
&= \frac{2\pi(x - 0.939)}{0.0297} ,\end{aligned}$$

for any mass. The gain is largest close below the threshold $x = 0.939$, at the paper's "$GM\omega/c^3 = 0.92$".
There the exponent is $-4.0$ and $n_H = 1/(e^{-4.0} - 1) = -1.018$. For ten equilibrium masses $x = 0.92$ is
43.6 GHz, where the 0.905 K sky holds $n_{\rm bg} = 0.110$, so the mode returns $0.110 + 0.91\times1.128 = 1.14$,
10.3 times the sky. Since 91% is the peak gain, 10.3 is the most the mode can return there.[^bright]

*A hole that does not spin.* Its $\Gamma_\ell$ come from the Regge–Wheeler equation (*read now, derived in chapter
11.3*), and Page's limit $\Gamma_2 \to (256/225)x^6$ for long waves is *read now, derived in chapter
[11.4](/tutorial/black-holes/under-tides/#the-same-friction-absorbs-long-gravitational-waves)*. The **shadow depth**
is the energy a hole removes from the sky, net of its own glow, over what a black disc of 11.1's capture area
$27\pi G^2\matter M^2/c^4$ would remove. Against 0.905 K it is 0.93, 0.54 and 0.29 at ten, three and two
equilibrium masses, "in energy, $93\%$", "$54\%$" and "$29\%$", and counted in gravitons 82%, 32% and 14% (*checked
here*).[^depth] It reaches 0.99 at 27.[^black]

## A falling camera sees a smaller shadow, and a fast pixel sees every scene as a wave

[*A freely falling camera*](/paper/#par:a-freely-falling-camera): a camera that hovers needs a thrust that grows
without limit toward the horizon (*read now, derived in chapter
[11.1](/tutorial/black-holes/schwarzschild/#at-the-schwarzschild-radius-clocks-stop-nothing-can-hover-and-nothing-gets-out)*).
One falling straight in reads the same tide as a camera at rest at its radius, $\curv{\mathcal W} = (G\matter
M/r^3)\,\mathrm{diag}(1, 1, -2)$, with no magnetic part. The field is of **type D**, whose four principal directions
on the sky fall in two pairs, and a boost along the line to the hole leaves it unchanged (*read now, derived in
chapters [11.1](/tutorial/black-holes/schwarzschild/#the-tide-outside-a-round-mass-is-exactly-newtons) and 9.4*).

It passes the hovering camera at Newton's escape speed $\obs v = (2G\matter M/r)^{1/2}$ (11.1), so aberration shrinks
the shadow (*read now, derived in chapter
[6.3](/tutorial/relativity/aberration/#a-moving-observers-sky-crowds-toward-the-direction-of-motion)*): $5.80°$ instead
of $7.27°$ at $40\,G\matter M/c^2$, where $\obs v = 0.224c$; $35.3°$ instead of $90°$ at the photon sphere,
$3\,G\matter M/c^2$; and, at the horizon, where the paper's $\alpha$ is the falling camera's shadow radius,
"$\cos\alpha = 23/31$", $42.1°$. A cap of that radius covers $(1 - \cos\alpha)/2 = 4/31 = 12.9\%$ of the sky, "less
than $13\%$" (*checked here*). The rest of the sky crowds toward the shadow's edge, bluer there and redder behind
(6.3).

::: try {#shadow-and-ring}
Chapter 11.1's camera near a hole: on the left the plane of the orbit with a fan of exact rays, on the right the
camera's sky with the shadow filled and the Einstein ring dashed. One slider sets the camera's distance from 2.05 to
200 $G\matter M/c^2$, opening at 40, and a switch puts the camera at rest or falling from far away.

Predict first: a camera falls from $40\,G\matter M/c^2$ toward the photon sphere. Does the shadow it sees grow or
shrink, compared with a camera at rest at each radius? Then switch to falling, drag the distance down to 3, and switch
back and forth at each stop.
:::

[*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light): the pixel
moves at $\obs\beta c$, with $\obs\gamma = (1 - \obs\beta^2)^{-1/2}$ and rapidity $\obs\eta$, $\tanh\obs\eta =
\obs\beta$. A boost keeps the eigenvalues and the invariants $\sym{invariant-i}{I}$ and $J$ (*read now, derived in
chapter [9.3](/tutorial/one-point/the-matrix-w/#the-eigenvalues-are-the-same-for-every-observer)*). That its electric
and magnetic parts both grow without limit is *stated in the paper*; since the real part of $I = |\curv\tE|^2 -
|\curv\tB|^2 + 2i\,\curv\tE_{ij}\curv\tB_{ij}$ stays fixed meanwhile, $|\curv\tB|/|\curv\tE| \to 1$. The four
directions move as rays of light and crowd behind, and type D flown along its axis does not change (*read now, derived
in chapter [9.4](/tutorial/one-point/petrov/#moving-the-pixel-moves-the-four-directions-as-rays-of-light)*).

The cone is *derived here*. We want the four directions that a pixel flown along an axis of a still reading finds. We
take **a reading at rest, $\curv{\mathcal W} = \mathrm{diag}(\curv w_1, \curv w_2, \curv w_3)$**, in
$\mathrm{s^{-2}}$ and **trace-free**, $\curv w_1 + \curv w_2 + \curv w_3 = 0$, with **the motion along the third
axis**. Chapter 9.4's quartic is $\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z)$, with $\vect m(z) = (1 - z^2, i(1
+ z^2), -2z)$ and $z$ the complex number of a direction, $|z| = \tan(\vartheta/2)$ at the angle $\vartheta$ from the
third axis. We multiply it out and use the trace to write $4\curv w_3 - 2\curv w_1 - 2\curv w_2$ as $6\curv w_3$:

$$\begin{aligned}\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) &= \curv w_1(1 - z^2)^2 - \curv w_2(1 + z^2)^2\\
&\quad + 4\curv w_3z^2\\
&= (\curv w_1 - \curv w_2)(z^4 + 1) + 6\curv w_3z^2 .\end{aligned}$$

As a quadratic in $z^2$ its first and last coefficients are equal, so its two roots multiply to 1. They are complex
conjugates, each of size 1, when the discriminant is negative, $(\curv w_1 - \curv w_2)^2 > 9\curv w_3^2$. Putting
$\curv w_3 = -(\curv w_1 + \curv w_2)$ on the right and collecting terms gives $2\curv w_1^2 + 5\curv w_1\curv w_2 +
2\curv w_2^2 < 0$, which factors as

$$(2\curv w_1 + \curv w_2)(\curv w_1 + 2\curv w_2) = (\curv w_1 - \curv w_3)(\curv w_2 - \curv w_3) < 0 .$$

So $\curv w_3$ lies between the other two: it is the middle eigenvalue. Then $|z| = 1$ for all four roots, which lie
at $\vartheta = 90°$, in 9.4's plane at right angles to the middle axis. A boost along that axis multiplies every root
by $e^{\obs\eta}$ (9.4), so $\tan(\vartheta/2) = e^{\obs\eta}$, and $\cos\vartheta = (1 - e^{2\obs\eta})/(1 +
e^{2\obs\eta}) = -\tanh\obs\eta$:

$$\boxed{\;\cos\vartheta = -\obs\beta\;} ,$$

one cone of half-angle $\arccos\obs\beta$ about the direction behind. **Number:** at $\obs\eta = 0.5$, $\obs\beta =
0.462$ and the half-angle is $62.5°$. **Limit:** at $\obs\beta = 0$ the cone is the plane; as $\obs\beta \to 1$ the
sine of its half-angle, $\sqrt{1 - \obs\beta^2} = 1/\obs\gamma$, shrinks as the paper's $1/\gamma$. So all furniture
looks to the pixel like a wave from in front, a shock like Aichelburg and Sexl's for a mass at the speed of light
(the boosted limit *stated in the paper* [@AichelburgSexl1971]; the shock's profile *derived in chapter
[13.5](/tutorial/what-a-field-keeps/impulsive-waves/#the-field-of-a-particle-without-mass-is-an-impulsive-wave)*).

[*Counting coincidences*](/paper/#par:counting-coincidences) was read ahead in chapter
[R8](/tutorial/quantum/reading-the-quantum-limits/#read-ahead-coincidences-tell-a-sky-born-hot-from-one-born-in-inflation):
with $\sym{second-order-coherence}{g^{(2)}}$ the rate of coincident counts over that of independent arrivals, a
thermal sky gives 2 per mode, and inflation's pairs $2 + 1/\bar n$ in opposite directions, $\bar n$ the mean count per
mode (*derived in chapter 8.5*).[^g2]

## A cosmic string is invisible to every pixel and shows only against what lies behind

[*A cosmic string*](/paper/#par:a-cosmic-string): space round a straight string is flat, with a wedge
$\sym{deficit-angle}{\Delta} = 8\pi G\matter\mu/c^2$ missing, $\sym{string-mass-per-length}{\matter\mu}$ its mass per
length in $\mathrm{kg\,m^{-1}}$ (**not a shear modulus**). So "every pixel reads zero", however heavy the string (*read
now, derived in chapter
[12.2](/tutorial/sky/universe/#a-cosmic-string-removes-a-wedge-of-space-invisible-to-every-pixel-but-not-to-what-lies-behind)*,
the wedge *stated* [@Vilenkin1981]). The double
images and the step of $8\pi G\matter\mu\obs\gamma\obs v/c^3$ across a moving string are *read now, derived in chapter
12.2*. For $G\matter\mu/c^2 = 10^{-6}$ at $\obs v = c/2$, $\obs\gamma = 1.155$, and the step is $1.45\times10^{-5}$,
"$1.5\times10^{-5}$", or 13 μK on the glow (*checked here*).

## The transparent Sun focuses only waves above 8 kHz

[*The transparent Sun as a lens*](/paper/#par:the-transparent-sun-as-a-lens): a wave crossing the Sun is bent by the
mass inside the cylinder of its impact parameter $b$, the paper's $\alpha(b) = 4G\sym{cylinder-mass}{\matter M_{\rm
cyl}}(b)/c^2b$ (*read now, derived in chapter
[12.1](/tutorial/sky/stars/#eddingtons-model-ties-the-pressure-to-the-density)*). The delay's slope is *derived here*
from 11.1's refractive index $n$: the delay is $\Delta t(b) = (1/c)\int(n - 1)\,\dd l$ along the ray, and 11.1's
bending is $\alpha = \int\partial_\perp n\,\dd l$, with $\partial_\perp$ the slope toward the centre, where $b$
shrinks, so $\partial n/\partial b = -\partial_\perp n$. Differentiating under the integral,

$$\frac{\dd\Delta t}{\dd b} = \frac1c\int\frac{\partial n}{\partial b}\,\dd l = -\frac{\alpha(b)}{c} =
-\frac{4G\matter M_{\rm cyl}(b)}{c^3b} ,$$

the paper's rate, in seconds per metre. Weighing the interior this way, and eclipses of turning neutron stars, are
*stated in the paper* [@CyranskiLubkin1974; @MarchantEtAl2020; @TakahashiMorisakiSuyama2023; @JungKim2023].

{{paper fig:sun-lens}}

In Eddington's model the bending peaks at $4.19''$ for rays $0.274$ of a radius from the centre, against $1.75''$ at
the limb: "$4.2''$", "$0.27$" (*checked here*, by 12.1). Central rays meet at the paper's **central focus**
$\sym{central-focus}{f_0} = c^2/4\pi G\matter\Sigma(0)$, a length, with $\sym{projected-density}{\matter\Sigma(0)} =
2.127\times10^{13}\unit{kg\,m^{-2}}$ the model's column density through the centre (12.1 rounds it to
$2.1\times10^{13}$): 33.7 AU (*checked here*). Patla and Nemiroff's 23.5 AU is *stated in the paper*
[@PatlaNemiroff2008]. Since $f_0$ falls as $1/\matter\Sigma(0)$, it needs a central column 1.43 times Eddington's
(*checked here*): the standard solar model's centre is twice as dense, some $150\unit{g\,cm^{-3}}$ against 76
(stated), but only in the core. Rays farther out focus farther away, out to $R_\odot^2/2r_s = 548$ AU for
grazing rays. So from between 33.7 and 548 AU a source straight behind the Sun appears as a ring inside the disc, at
the $b$ whose focus is the camera (*read now*, 11.1's line of foci).[^ring] A uniform background is not changed
(12.2).

The Sun's delay $4G\matter M_\odot/c^3 = 19.7\,\mu$s (*stated in chapter
[11.1](/tutorial/black-holes/schwarzschild/#a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring)*, the Shapiro
delay) spans a radian of phase above $c^3/8\pi G\matter M_\odot = 8.08$ kHz, "8 kHz" (the criterion *read now, derived
in chapter 11.1*). Below it a point of the Sun's mass raises the intensity on its axis only by $\pi w/(1 - e^{-\pi
w})$, with $\sym{lens-parameter}{w} = 8\pi G\matter M_\odot f/c^3$ a pure number (not an eigenvalue): 1.0196 at 100
Hz, "1.02" (*checked here*; the factor stated, as in R11).

*Wave optics.* We want the gain on the axis, a distance $d$ behind the Sun, at the frequency $f$, with $k = 2\pi f/c$.

1. Inside the Sun, 12.1's $\alpha(b)$ gives the paper's lens potential $\sym{lens-potential}{\Phi(b)} =
   \int_0^b\alpha(b')\,\dd b'$, a length. Outside the disc, where $\alpha = 2r_s/b$, it goes on as
   $\Phi(R_\odot) + 2r_s\ln(b/R_\odot)$. By the slope above, $\Phi$ is minus the extra path through the field, up to
   a constant.[^Phisign] **This $\Phi$ is
   neither the Newtonian potential nor 12.2's stretch.**
2. A wavelet that crosses the plane of the Sun at $b$ travels $\sqrt{d^2 + b^2} - d \approx b^2/2d$ farther than the
   straight path, so its phase is $e^{ik[b^2/2d - \Phi(b)]}$.
3. Chapter [5.3](/tutorial/waves/diffraction/#beyond-an-opening-a-wave-is-a-sum-of-wavelets-from-every-point-of-it)'s
   sum of these wavelets over the plane, the **Fresnel integral**, gives the amplitude $A$ below.
4. The gain is $|A|^2$, the intensity over that without the Sun.

The amplitude is

$$A = -\frac{ik}{d}\int_0^\infty e^{ik[b^2/2d - \Phi(b)]}\,b\,\dd b ,$$

which is 1 when $\Phi = 0$; $k\Phi$ and $kb^2/d$ are pure numbers, as a phase must be.

::: gap
Outside the disc the substitution $u = b^2$ turns the point mass's part into an incomplete gamma function, $\int
e^{iku/2d}u^{-ikr_s}\,\dd u$ from $R_\odot^2$ to infinity, which converges only along a path turned into the complex
plane. Inside, the phase runs through hundreds of radians and needs a fine numerical sum. The gains below come from
such a sum, which gives the exact point lens to $10^{-10}$ and, at 30 kHz, the geometric 1.0621 to $10^{-4}$.
:::

At 1 AU the central rays' geometric gain is $(1 - d/f_0)^{-2} = 1.0621$, the "$6\%$", reached above about 10 kHz.
At 1 kHz the wave gives 88% of that excess, and at 100 Hz 26.5%, "$27\%$". At 50 AU, beyond the central focus, the
gain is 3.35, 43.8 and 478 at 10 kHz, 100 kHz and 1 MHz, "$3.4$", "$44$" and "$480$", in proportion to $f$: 0.86,
1.13 and 1.23 times a point mass's $\pi w$, the paper's "from $0.86$ to $1.23$". It equals $\pi w$ at 548 AU, where the
rays graze the limb (*checked here*).[^point] At $10^{13}$ Hz the same proportion gives $4.8\times10^9$, "some
$5\times10^9$".

## Matter scatters almost nothing, so every picture is emitted, pulled or yielded

[*Scattering, earthquakes and tails*](/paper/#par:scattering-earthquakes-and-tails): a body of mass $\matter m$
scatters gravitational waves with a cross-section per unit solid angle, at large angles, of order $(G\matter m/c^2)^2$,
$2.7\times10^{-51}\unit{m^2\,sr^{-1}}$ for a person of 70 kg, "$3\times10^{-51}$" (*read now*, an estimate in chapter
[7.8](/tutorial/geometry/wave-energy/#matter-barely-touches-the-waves); Peters's result *stated*
[@Peters1976]).[^scatter] So no scene can be lit, and every picture is the scene's glow (Parts 5 to 10), its pull
(Parts 1 and 2), or its yield to a pull (Part 4).

An earthquake's compressional waves change the rock's density, "and with it $\curv\tE$" (*read now, derived in chapter
[7.3](/tutorial/geometry/einstein-equation/#inside-matter-the-tide-has-a-part-fixed-by-the-matter-at-that-point)*);
the prompt signal already recorded is *stated in the paper* [@Vallee2017]. Shear waves change no density but move
mass, so they show in $\curv\tB$ through the paper's [](/paper/#eq:current-column) (*read now, derived in chapters
[2.8](/tutorial/outside/flows/#the-current-column-is-the-flow-along-a-line-of-sight-weighted-by-inverse-distance) and
[7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow)*).
In curved space a burst arrives with a **tail**, an echo from waves scattered by the curvature they cross; what it
records is *stated in the paper* [@DeWitt1960; @BlanchetDamour1992].

## The capstone: a black hole against the first light

A hole of ten equilibrium masses, $\matter M = 1.356\times10^{24}$ kg or 18 Moon masses, stands against the 0.905 K
glow, and the camera is at rest at $r = 40\,G\matter M/c^2$, 4.03 cm away in circumference radius (Figure
[](#fig:read-xi-hole)). Each row feeds on earlier ones, and all but three recompute in a line with $G$, $c$, $\hbar$
and $\kB$: (e) needs the orbit integrated above, (f) chapter 11.3's Regge–Wheeler greybody factors, and (g) the stated
91%.

![Look first at the arrows: each panel's number feeds the next. The angles depend only on the distance in units of
$G\matter M/c^2$; the mass sets how dark the disc is. Angles and the two lengths of (b) and (c) are to scale; the rest
is schematic.](tut-read-xi-hole){#fig:read-xi-hole}

| Step | Formula | Number | Chapter |
|---|---|---|---|
| (a) the sky | $T_g = (3.91/106.75)^{1/3}T_\gamma$; seen, $T_g/\sqrt{1 - 2G\matter M/c^2r}$ | 0.905 K; 0.929 K | 12.2, 11.1 |
| (b) its gravitons | (a)'s 0.929 K in $N \propto T^3$ and $\lambda = 2\pi\hbar c/2.70\,\kB T$ | $3.87\times10^{14}$ per s, m², sr; 5.74 mm | 10.1, 12.2 |
| (c) the hole | $T_H = \hbar c^3/8\pi G\matter M\kB$; disc $2\sqrt{27}\,G\matter M/c^2$ | 0.0905 K; 1.05 cm across | 11.3, 11.1 |
| (d) the shadow | at (a)'s $r$, 11.1's arcsine; falling, 6.3's aberration | $7.27°$; $5.80°$ falling | 11.1, 6.3 |
| (e) the ring | the ray that turns through 180° | $20.2°$ | 11.1, here |
| (f) how dark | (c)'s 0.0905 K against (a), (b)'s wavelength against (c)'s disc: depth by energy; by count | 93%; 82% | 11.3, here |
| (g) with spin | (a)'s sky at $\chi = 0.998$, $\ell = m = 2$, $x = 0.92$: 43.6 GHz | 10.3 times the sky | 11.2, 11.3 |
| (h) how deep | (a) read backwards: $1 - 2G\matter M/c^2r = (T_g/T_{\rm seen})^2$ | $r = 40\,G\matter M/c^2$ from 2.6% | 11.1 |
| (i) counting | (a)'s thermal sky: $g^{(2)}$ per mode; opposite directions | 2; $2 + 1/\bar n$ only if born in inflation | 8.5, R8 |

In (b) the sky is seen 2.6% warmer, so the count rises as $T^3$, 8.0% above the far $3.59\times10^{14}$, and the
wavelength falls as $1/T$, 2.5% below the far 5.89 mm.

::: try {#hole-against-sky}
Chapter 11.3's hole against a uniform sky: in the upper panel, against $x$, the sky's energy, the hole's own glow and,
shaded, what the hole takes; in the lower panel the disc against the sky, weighed in energy and counted in quanta. The
slider sets the mass from 0.3 to 300 equilibrium masses, with ticks at Section XI's 2, 3 and 10, and a switch chooses
gravitons at 0.905 K or light at 2.7255 K. The depths stay covered until you show them.

Predict first: at ten equilibrium masses, is the disc darker weighed in energy or counted in gravitons, and is the
same hole darker against light? Then set the mass to 10, show the depths, and switch the sky.
:::

## The ledger: with R12, three of Section XI's five equations are derived

| The paper's equation | Where it is derived; its mark here |
|---|---|
| the paper's [](/paper/#eq:graviton-temperature), the glow's temperature | 12.2; *read now*, its numbers *checked here* |

With [R12's
ledger](/tutorial/sky/reading-sections-x-and-xi/#the-ledger-section-x-has-two-tables-and-no-equations-and-four-of-section-xis-are-read-here),
three of Section XI's five equations are derived: this one and the paper's [](/paper/#eq:merger-memory) and
[](/paper/#eq:burst-memory) (chapter 7.8). The paper's [](/paper/#eq:multipole) is stated (Thorne's) and checked in
chapter 7.7, which derives its tide; the paper's [](/paper/#eq:memory) is stated and sketched in 7.8. Part 13 reads
Sections XII to XV.

::: check
### Q

A hole of three equilibrium masses is seen from rest at $40\,G\matter M/c^2$. What is the shadow's radius, and how
far is the camera in centimetres?

### A

The same $7.27°$, since the angle depends only on $r$ in units of $G\matter M/c^2$; the distance is three tenths of
4.03 cm, 1.21 cm.

### Q

Why does a hole of the equilibrium mass leave no mark on the uniform glow, though it absorbs?

### A

In each mode it emits $\Gamma_\ell n_H$ and removes $\Gamma_\ell n_{\rm bg}$, and at the sky's temperature $n_H =
n_{\rm bg}$.
:::

**The idea to keep: against a glow left from the start, a black hole is dark only by being colder, and how dark
depends on its size against the gravitons' wavelength; the angles it shows depend only on the camera's distance in
units of $G\matter M/c^2$.**

::: problems
### Practice

Rerun the capstone's steps (c), (d) and (f) for a hole of three equilibrium masses.

::: solution
$T_H = 0.302$ K and a disc 0.314 cm across; the shadow is still $7.27°$ at rest and $5.80°$ falling; the depth is 54%
in energy and 32% in counts.
:::

### Stretch

With chapters 11.1 and 12.2: at what distance from a hole does the graviton sky look 10% warmer, and how large is the
shadow there?

::: solution
$1/\sqrt{1 - 2G\matter M/c^2r} = 1.1$ gives $r = 11.52\,G\matter M/c^2$, where the shadow is $24.2°$ in radius and the
sky reads 0.996 K.
:::

### The paper

Reproduce every number of *A primordial graviton background*'s first two paragraphs and its four bullets.

::: solution
$0.3321\times2.7255 = 0.905$ K; $\tfrac87(0.905/1.945)^4 = 0.054$; $\Omega_g = 6.6\times10^{-7}$; $N =
3.59\times10^{14}$; 5.9 mm and $0.34°$; $370/299{,}792 = 1.23\times10^{-3}$; $14.14/13.86 = 1.020$. The other two
bullets have no numbers.
:::
:::

::: paper
- Section XI's [*A primordial graviton background*](/paper/#par:a-primordial-graviton-background) and Figure
  [](/paper/#fig:black-hole): the paper's [](/paper/#eq:graviton-temperature), the four bullets, the hole against the
  glow and the bookkeeping.
- From [*A freely falling camera*](/paper/#par:a-freely-falling-camera) to [*Scattering, earthquakes and
  tails*](/paper/#par:scattering-earthquakes-and-tails), with Figure [](/paper/#fig:sun-lens).
:::

::: deeper
- The [GR course, section
  17.9](https://neovand.github.io/general-relativity/chapter-17.html#17-9-separate-the-photon-from-the-observers): how
  one ray of light looks to different observers, the falling camera's aberration in full.
- J.-P. Luminet, "Image of a spherical black hole with thin accretion disk" (1979), the paper's source for Figure
  [](/paper/#fig:black-hole)'s rays.
:::

[^leak]: The paper's 3.91 counts "neutrinos that decoupled at once". A little of the electrons' heat leaked into them,
    which gives 3.93 and $T_g = 0.907$ K (chapter 12.2).

[^omega]: The paper's "$7\times10^{-7}$" is "for $H_0 = 67\,\mathrm{km\,s^{-1}\,Mpc^{-1}}$", the microwave sky's Hubble
    constant. The temperature fixes only $\Omega_gh^2 = 3.0\times10^{-7}$, with $h$ that constant over 100; the nearby
    galaxies' 73 gives $5.6\times10^{-7}$.

[^bright]: The ratio depends steeply on the frequency. With the 91% gain it is 8.7 at $x = 0.85$, 9.7 at 0.90 and 12.0
    at 0.93, where $n_H = -1.19$; each is the most that frequency allows. At $\chi = 0.7$ the greatest gain, 0.27% near
    $x = 0.34$, makes the mode 0.7% brighter, "under one per cent".

[^depth]: The greybody factors are those of chapter 11.3, from the Regge–Wheeler equation for $\ell = 2$ to 40, with the
    capture area above $x = 6$.

[^black]: The paper's "above about a hundred times, $10^{25}\,\mathrm{kg}$, is it black": a hundred equilibrium masses
    is $1.4\times10^{25}$ kg, where the depth is 0.9995, and it is already 0.99 at 27 times.

[^g2]: The paper's "any two classical fields of thermal statistics": for them the Cauchy–Schwarz inequality caps
    the coincidences in two directions at 2 (chapter 8.5), and fields that fluctuate more can pass it. Its
    "$g^{(2)} = 2$" is "for counts within one mode and one coherence time": a pixel that gathers $K$ independent modes
    sees $1 + 1/K$ (chapter 8.5 writes $M$ for $K$).

[^ring]: The paper's "out to $548\,\mathrm{AU}$": beyond, the ring lies outside the limb.

[^Phisign]: The extra path falls with $b$, with slope $-\alpha$, so in the phase $e^{ik[b^2/2d - \Phi]}$ the $\Phi$
    with $\Phi' = \alpha$ is "minus the extra path through its field", as the paper says.

[^point]: The paper's $\pi w$ is the short-wave form of a point mass's $\pi w/(1 - e^{-\pi w})$. They differ only at
    10 kHz, where the full factor is 3.97 and the Sun's gain is 0.84 of it.

[^scatter]: The total cross-section is infinite, since waves passing far away are still turned through small angles
    (chapter 7.8).
