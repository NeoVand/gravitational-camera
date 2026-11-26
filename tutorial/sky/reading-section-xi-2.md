---
id: R12b
title: 'The sky in gravity'
question: 'What would the camera see of a sky of gravitons left from the early universe, and how would a black hole, a falling pixel, a cosmic string and the Sun look against it?'
part: '12'
requires: ['6.3', '8.5', '11.1', '11.2', '11.3', '12.1', '12.2']
paper: [sec:vistas, eq:graviton-temperature, fig:black-hole, fig:sun-lens]
figures: [fig:black-hole, fig:sun-lens]
live: [shadow-and-ring, hole-against-sky]
---

Suppose the hot early universe left a sky of gravitons, as it left the microwave sky of light. What temperature would
it have, and what would a camera see of a black hole against it, of a pixel that falls or flies past at nearly the
speed of light, of a cosmic string, and of the Sun as a lens?

::: plain
If it exists, a sky of gravitons left from the hot early universe is a uniform glow at 0.905 kelvin, a third of the
temperature of the light left from that time, a little warmer in the direction we move. Only black holes would darken
it.

A hole is dark only if it is colder than the sky, so a hole of about two Moon masses, exactly as warm, vanishes. A
heavier hole casts a pale shadow, and a camera falling into it sees a smaller one. Matter reflects almost no
gravitational wave, so every picture is made from what a scene sends out, how it pulls, or how it yields.
:::

## A glow from the start would be at 0.905 K and outshine every other graviton sky

Gravitons stop interacting near the Planck temperature (section 12.2) and keep a black-body spectrum. Every species that later annihilated heated the photons but not the gravitons, so conservation of entropy (section
[12.2](/tutorial/sky/universe/#gravitons-parted-first-and-kept-a-colder-share-of-the-heat)) gives their temperature
today,

$$\sym{graviton-temperature}{T_g} = \Bigl(\frac{3.91}{106.75}\Bigr)^{1/3}\sym{photon-temperature}{T_\gamma} = 0.905\unit K ,$$

with $T_\gamma = 2.7255\unit K$ the microwave sky's, both in kelvin.[^T] The 106.75 counts the Standard Model's states when the gravitons parted, and the 3.91 today's photons and neutrinos;
more particles would make $T_g$ colder. So $T_g = 0.3321\times2.7255 = 0.905$ K. The glow is a test of inflation, a proposed burst of early expansion that would have thinned it to nothing
[@VagnozziLoeb2022].

Radiation other than photons is measured in **extra species of neutrino**, its energy density over a neutrino's with its
antineutrino's. The $\tfrac87$ sets the graviton's two states against their $2\times\tfrac78$, and with
$T_\nu = 1.945$ K (section 12.2), $\Delta N_{\rm eff} = \tfrac87(T_g/T_\nu)^4 = 0.054$. Over the critical density, that of a flat
universe (12.2), the glow's energy density is $\Omega_g = 6.6\times10^{-7}$,[^omega] against about $10^{-8}$ for the background pulsar timing has found
[@NANOGrav2023].

The count $N = \zeta(3)(\kB T/\hbar)^3/2\pi^3c^2$, with $\zeta(3) = 1.202$, is section
[10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)'s number
radiance of a black body of two polarizations: $3.59\times10^{14}$ gravitons per second, per square metre and per
steradian at 0.905 K. That is $9\times10^8$ times the Sun core's $4\times10^5$ (see
[the Sun at midnight](/tutorial/glow/reading-section-ix/#at-midnight-the-suns-core-outshines-the-ground-ten-billion-times)),
and more than any other graviton sky. The mean
energy $2.70\,\kB T$ gives a wavelength of 5.9 mm, which a one-metre aperture resolves to $0.34°$ (section 12.2).

## The glow has a dipole and the light's large spots, lenses leave it uniform, and only holes darken it

*It has a dipole from our motion.* Our speed through the microwave sky's frame, $\obs v = 370\unit{km\,s^{-1}}$
[@Planck2018I], is $\obs v/c = 1.23\times10^{-3}$, so the glow is 1.12 mK warmer ahead (sections
[6.3](/tutorial/relativity/aberration/#a-moving-black-body-is-still-a-black-body-hotter-ahead) and 12.2).

*It shares the large spots.* Write small departures from uniformity as $\field g_{ij} = a^2(1 +
2\field\Phi)\delta_{ij}$, with $a$ the scale factor and $\sym{metric-stretch}{\field\Phi}$ a pure number. **This
$\field\Phi$ is a fractional stretch of lengths, not the Newtonian potential.** With
$\sym{temperature-contrast}{\Theta}$ the fractional change of a glow's temperature, $\dot\Theta = -\dot{\field\Phi}$
holds for any massless quanta on scales larger than the horizon, the distance light had then travelled (section
[12.2](/tutorial/sky/universe/#on-large-scales-the-graviton-sky-shares-the-lights-spots)). The gravitons' surface
lies 14.14 gigaparsecs (Gpc) away against the light's 13.86 Gpc, only 2% farther. The agreement scale by scale [@AlbaMaldacena2016; @Bartolo2019; @Ricciardone2021; @Schulze2023] fails above a
multipole of about a hundred: the surfaces lie 0.28 Gpc apart, 0.02 rad seen from 14 Gpc, and a pattern of degree
$\ell$ has features $\pi/\ell$ wide, so $\ell \approx 160$.

*Lensing leaves its uniform part unchanged*, because bending keeps every mode's occupation (12.2). *Only black holes
cast shadows on it*, since nothing else absorbs across a broad band (section 11.3 and the
[optical constants of a body](/tutorial/black-holes/reading-section-vii/#every-optical-constant-of-a-body-is-its-compactness-times-factors-below-one)).

## Seen from rest near the hole, the shadow is 7.3° in radius and the sky 2.6% warmer

{{paper fig:black-hole}}

The figure draws one hole twice, by the exact orbits of light of section
[11.1](/tutorial/black-holes/schwarzschild/#light-can-circle-a-hole-and-the-hole-casts-a-shadow). The camera is at rest
at $r = 40\,G\matter M/c^2$, with $r$ the circumference radius. The shadow's angular radius
$\sym{shadow-radius}{\alpha_h}$, from the hole's centre to its edge, is

$$\sin\alpha_h = \sqrt{27}\,\frac{G\matter M}{c^2r}\sqrt{1 - \frac{2G\matter M}{c^2r}} ,$$

$7.27°$ at $r = 40\,G\matter M/c^2$. A camera at rest there measures every frequency raised by
$1/\sqrt{1 - 2G\matter M/c^2r} = 1.026$ (section
[11.1](/tutorial/black-holes/schwarzschild/#seen-from-rest-near-a-hole-the-whole-sky-is-warmer)). So the sky is 2.60%
warmer, at 0.9285 K, and a thermometer reads the depth: $1 - 2G\matter M/c^2r = (T_g/T_{\rm seen})^2$.

The dashed Einstein ring shows the sky straight behind the hole. Its ray passes at the impact parameter
$b = 14.17\,G\matter M/c^2$ and arrives $20.2°$ from the hole, found by integrating section 11.1's orbit of light until
it has turned through 180° (the weak-field ring gives $18.1°$). Inside the ring a ray seen above the hole bent past the point straight behind
and comes from the sky below it, so each side of the sky appears on the opposite side of the hole.

The hole's Hawking temperature, $T_H = \hbar c^3/8\pi G\matter M\kB$, is 0.905 K at section 11.3's equilibrium mass,
$1.356\times10^{23}$ kg or 1.85 Moon masses. A heavier hole is colder than the glow
and casts a shadow, and a lighter one glows (section
[11.3](/tutorial/black-holes/hawking/#a-black-hole-has-a-temperature-lower-the-heavier-it-is)). The hole in balance still lenses the sky's spots (12.2).

## Mode by mode a hole returns the sky changed by its share, and spin can make it bright

A wave of degree $\ell$ and angular frequency $\omega$ is absorbed with the probability
$\sym{greybody-factor}{\Gamma_\ell(\omega)}$, the **greybody factor**, and emitted in the same proportion. With
$\sym{background-occupation}{n_{\rm bg}}$ the sky's mean number of quanta per mode and $\sym{hole-occupation}{n_H}$
that at the hole's temperature, detailed balance gives the camera

$$n_{\rm out} = n_{\rm bg} + \Gamma_\ell\,(n_H - n_{\rm bg})$$

(section [11.3](/tutorial/black-holes/hawking/#mode-by-mode-a-hole-is-a-grey-body)). A spinning hole amplifies waves that turn with it, its **superradiance** (section
[11.2](/tutorial/black-holes/spin/#a-hole-amplifies-a-wave-that-turns-with-it-more-slowly-than-its-horizon)). For it
$n_H$ is taken at $\omega - m\Omega_H$, with $m$ the wave's azimuthal number and
$\sym{horizon-angular-velocity}{\Omega_H}$ the horizon's angular velocity in $\mathrm{s^{-1}}$; for $\omega <
m\Omega_H$ both factors are negative, and the mode comes out brighter than the sky (section
[11.3](/tutorial/black-holes/hawking/#a-spinning-hole-can-be-brighter-than-any-sky)).

Section [11.2](/tutorial/black-holes/spin/#a-spinning-hole-adds-its-spin-to-its-mass-and-the-spin-has-a-ceiling) writes
the spin as $\sym{dimensionless-spin}{\chi} = ac^2/G\matter M$, a pure number from 0 to 1, with $a$ the hole's angular
momentum over $\matter Mc$, a length. The gain of the mode $\ell = m = 2$ is at most 91% at $\chi = 0.998$
[@TeukolskyPress1974]. At that spin $\Omega_H$ is $0.469\,c^3/G\matter M$, and the surface gravity
$\sym{horizon-surface-gravity}{\kappa}$, an acceleration, is $0.0297\,c^4/G\matter M$, 0.119 times a hole's without
spin; the temperature $\kB T_H = \hbar\kappa/2\pi c$ is lower by the same factor. With $x = G\matter M\omega/c^3$ and
$m = 2$, the exponent of $n_H$ is

$$\begin{aligned}\frac{\hbar(\omega - 2\Omega_H)}{\kB T_H} &= \frac{2\pi c(\omega - 2\Omega_H)}{\kappa}\\
&= \frac{2\pi(x - 0.939)}{0.0297} ,\end{aligned}$$

for any mass. The gain is largest immediately below the threshold $x = 0.939$, at $x = 0.92$. There the exponent is $-4.0$ and $n_H = 1/(e^{-4.0} - 1) = -1.018$. For ten equilibrium masses $x = 0.92$ is 43.6 GHz, where the 0.905 K sky holds
$n_{\rm bg} = 0.110$, so the mode returns $0.110 + 0.91\times1.128 = 1.14$, 10.3 times the sky. This is the most the mode can return there.

For a hole that does not spin, $\Gamma_\ell$ comes from the Regge–Wheeler equation (section 11.3), and its long-wave limit
$\Gamma_2 \to (256/225)x^6$ from the friction of section
[11.4](/tutorial/black-holes/under-tides/#the-same-friction-absorbs-long-gravitational-waves). The **shadow depth** is
the energy a hole removes from the sky, net of its own glow, over what a black disc of section 11.1's capture area
$27\pi G^2\matter M^2/c^4$ would remove. Against 0.905 K it is 0.93, 0.54 and 0.29 at ten, three and two equilibrium
masses, so in energy 93%, 54% and 29%, and counted in gravitons 82%, 32% and 14%. It reaches 0.99 at 27 equilibrium masses.

## A falling camera sees a smaller shadow, and a fast pixel sees every scene as a wave

A hovering camera needs a thrust that grows without limit toward the horizon (section
[11.1](/tutorial/black-holes/schwarzschild/#at-the-schwarzschild-radius-clocks-stop-nothing-can-hover-and-nothing-gets-out)),
so it falls. One falling straight in reads the same tide as one at rest at its radius, $\curv{\mathcal W} = (G\matter
M/r^3)\,\mathrm{diag}(1, 1, -2)$, with no magnetic part. The field is of **type D**, whose four principal directions
on the sky fall in two pairs, and a boost along the line to the hole leaves it unchanged (sections
[11.1](/tutorial/black-holes/schwarzschild/#the-tide-outside-a-round-mass-is-exactly-newtons) and 9.4).

The falling camera passes the hovering one at Newton's escape speed $\obs v = (2G\matter M/r)^{1/2}$ (11.1), so
aberration shrinks the shadow (section
[6.3](/tutorial/relativity/aberration/#a-moving-observers-sky-crowds-toward-the-direction-of-motion)): $5.80°$ instead
of $7.27°$ at $40\,G\matter M/c^2$, where $\obs v = 0.224c$; $35.3°$ instead of $90°$ at the photon sphere,
$3\,G\matter M/c^2$; and $42.1°$ at the horizon, where $\cos\alpha = 23/31$ for the falling camera's shadow radius
$\alpha$. A cap of that radius covers $(1 - \cos\alpha)/2 = 4/31 = 12.9\%$ of the sky. The rest of the sky crowds toward the shadow's edge, bluer there and redder behind (6.3).

::: try {#shadow-and-ring}
The camera near a hole, with a fan of exact rays in the plane of the orbit beside the camera's sky, with the shadow filled and the Einstein ring dashed. A slider sets the camera's distance, and a
switch puts it at rest or falling from far away.

Predict first: does the shadow of a camera falling toward the photon sphere grow or shrink, compared with a camera at
rest? Then switch to falling and drag the distance down to 3.
:::

Let the pixel move at $\obs\beta c$, with $\obs\gamma = (1 - \obs\beta^2)^{-1/2}$ and rapidity $\obs\eta$,
$\tanh\obs\eta = \obs\beta$. A boost keeps the eigenvalues and the invariants $\sym{invariant-i}{I}$ and $J$ (section
[9.3](/tutorial/one-point/the-matrix-w/#the-eigenvalues-are-the-same-for-every-observer)). The electric and magnetic
parts both grow without limit, and since the real part of $I = |\curv\tE|^2 - |\curv\tB|^2 + 2i\,\curv\tE_{ij}\curv\tB_{ij}$
stays fixed, $|\curv\tB|/|\curv\tE| \to 1$. The four directions move as rays of light and crowd behind (section
[9.4](/tutorial/one-point/petrov/#moving-the-pixel-moves-the-four-directions-as-rays-of-light)).

Where do the four directions of a pixel flown along an axis end? Take **a reading at rest, $\curv{\mathcal W} =
\mathrm{diag}(\curv w_1, \curv w_2, \curv w_3)$**, in $\mathrm{s^{-2}}$ and **trace-free**, $\curv w_1 + \curv w_2 +
\curv w_3 = 0$, with **the motion along the third axis**. Section 9.4's quartic is $\vect m(z)^{\mathsf T}\curv{\mathcal
W}\vect m(z)$, with $\vect m(z) = (1 - z^2, i(1 + z^2), -2z)$ and $z$ the complex number of a direction, $|z| =
\tan(\vartheta/2)$ at the angle $\vartheta$ from the third axis. We multiply it out and use the trace to write
$4\curv w_3 - 2\curv w_1 - 2\curv w_2$ as $6\curv w_3$:

$$\begin{aligned}\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) &= \curv w_1(1 - z^2)^2 - \curv w_2(1 + z^2)^2\\
&\quad + 4\curv w_3z^2\\
&= (\curv w_1 - \curv w_2)(z^4 + 1) + 6\curv w_3z^2 .\end{aligned}$$

As a quadratic in $z^2$ its first and last coefficients are equal, so its two roots multiply to 1. They are complex
conjugates, each of size 1, when the discriminant is negative, $(\curv w_1 - \curv w_2)^2 > 9\curv w_3^2$. Putting
$\curv w_3 = -(\curv w_1 + \curv w_2)$ on the right and collecting terms gives $2\curv w_1^2 + 5\curv w_1\curv w_2 +
2\curv w_2^2 < 0$, which factors as

$$(2\curv w_1 + \curv w_2)(\curv w_1 + 2\curv w_2) = (\curv w_1 - \curv w_3)(\curv w_2 - \curv w_3) < 0 .$$

So $\curv w_3$ lies between the other two: it is the middle eigenvalue. Then $|z| = 1$ for all four roots, which lie
at $\vartheta = 90°$, in 9.4's plane at right angles to the middle axis. A boost along that axis multiplies every root by $e^{\obs\eta}$ (9.4), so $\tan(\vartheta/2) = e^{\obs\eta}$, and $\cos\vartheta = (1 - e^{2\obs\eta})/(1 +
e^{2\obs\eta}) = -\tanh\obs\eta$:

$$\boxed{\;\cos\vartheta = -\obs\beta\;} ,$$

one cone of half-angle $\arccos\obs\beta$ about the direction behind. **Number:** at $\obs\eta = 0.5$, $\obs\beta =
0.462$ and the half-angle is $62.5°$. **Limit:** at $\obs\beta = 0$ the cone is the plane; as $\obs\beta \to 1$ the
sine of its half-angle, $\sqrt{1 - \obs\beta^2} = 1/\obs\gamma$, shrinks as $1/\obs\gamma$. So all furniture looks to
the pixel like a wave from in front, a shock like Aichelburg and Sexl's for a mass at the speed of light
[@AichelburgSexl1971], whose profile section
[13.5](/tutorial/what-a-field-keeps/impulsive-waves/#the-field-of-a-particle-without-mass-is-an-impulsive-wave)
derives.

Whether the sky was born hot or in inflation shows in the coincidences of its gravitons (section
[8.5](/tutorial/quantum/reading-the-quantum-limits/#read-ahead-coincidences-tell-a-sky-born-hot-from-one-born-in-inflation)):
with $\sym{second-order-coherence}{g^{(2)}}$ the rate of coincident counts over that of independent arrivals, a thermal
sky gives 2 per mode, and inflation's pairs $2 + 1/\bar n$ in opposite directions, $\bar n$ the mean count per
mode.[^g2]

## A cosmic string is invisible to every pixel and shows only against what lies behind

Space round a straight string is flat, with a wedge $\sym{deficit-angle}{\Delta} = 8\pi G\matter\mu/c^2$ missing
[@Vilenkin1981], $\sym{string-mass-per-length}{\matter\mu}$ its mass per length in $\mathrm{kg\,m^{-1}}$ (**not a shear modulus**). So every pixel reads zero, however heavy the string (section
[12.2](/tutorial/sky/universe/#a-cosmic-string-removes-a-wedge-of-space-invisible-to-every-pixel-but-not-to-what-lies-behind)).
The step of $8\pi G\matter\mu\obs\gamma\obs v/c^3$ across a moving string follows there. For $G\matter\mu/c^2 = 10^{-6}$ at $\obs v = c/2$, $\obs\gamma = 1.155$, and the step is $1.45\times10^{-5}$,
or 13 μK on the glow.

## The transparent Sun focuses only waves above 8 kHz

A wave crossing the Sun at the impact parameter $b$ is bent by the mass inside that cylinder, $\alpha(b) =
4G\sym{cylinder-mass}{\matter M_{\rm cyl}}(b)/c^2b$ (section
[12.1](/tutorial/sky/stars/#eddingtons-model-ties-the-pressure-to-the-density)). The delay's slope follows from section 11.1's refractive index $n$: the delay is $\Delta t(b) = (1/c)\int(n - 1)\,\dd l$ along the ray, and 11.1's bending is
$\alpha = \int\partial_\perp n\,\dd l$, with $\partial_\perp$ the slope toward the centre, so
$\partial n/\partial b = -\partial_\perp n$. Differentiating under the integral,

$$\frac{\dd\Delta t}{\dd b} = \frac1c\int\frac{\partial n}{\partial b}\,\dd l = -\frac{\alpha(b)}{c} =
-\frac{4G\matter M_{\rm cyl}(b)}{c^3b} ,$$

in seconds per metre. Weighing the interior this way, and eclipses of turning neutron stars, have been proposed
[@CyranskiLubkin1974; @MarchantEtAl2020; @TakahashiMorisakiSuyama2023; @JungKim2023].[^sun]

{{paper fig:sun-lens}}

In Eddington's model (section 12.1) the bending peaks at $4.19''$ for rays $0.274$ of a radius from the centre, against
$1.75''$ at the limb. Central rays meet at the **central focus** $\sym{central-focus}{f_0} = c^2/4\pi
G\matter\Sigma(0)$, a length, with $\sym{projected-density}{\matter\Sigma(0)} = 2.127\times10^{13}\unit{kg\,m^{-2}}$ the
model's column density through the centre: 33.7 AU, against Patla and Nemiroff's 23.5 AU [@PatlaNemiroff2008], which needs a central column 1.43 times
Eddington's; the standard solar model's centre is twice as dense, but only in the core. Rays farther out focus
farther away, out to $R_\odot^2/2r_s = 548$ AU for grazing rays. So from between 33.7 and 548 AU a source straight
behind the Sun appears as a ring inside the disc, at the $b$ whose focus is the camera (section 11.1's line of foci).

The Sun's Shapiro delay, $4G\matter M_\odot/c^3 = 19.7\,\mu$s (section
[11.1](/tutorial/black-holes/schwarzschild/#a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring)), spans a radian
of phase above $c^3/8\pi G\matter M_\odot = 8.08$ kHz. Below it a point of the Sun's mass raises the intensity on its
axis only by $\pi w/(1 - e^{-\pi w})$, with $\sym{lens-parameter}{w} = 8\pi G\matter M_\odot f/c^3$ a pure number (not an
eigenvalue): 1.0196 at 100 Hz.

The gain on the axis, a distance $d$ behind the Sun, at the frequency $f$, with $k = 2\pi f/c$, comes in three steps.

1. Inside the Sun, $\alpha(b)$ gives the lens potential $\sym{lens-potential}{\Phi(b)} = \int_0^b\alpha(b')\,\dd b'$, a
   length. Outside the disc, where $\alpha = 2r_s/b$, it goes on as $\Phi(R_\odot) + 2r_s\ln(b/R_\odot)$. By the slope
   above, $\Phi$ is minus the extra path through the field, up to a constant. **This $\Phi$ is neither the Newtonian
   potential nor 12.2's stretch.**
2. A wavelet that crosses the plane of the Sun at $b$ travels $\sqrt{d^2 + b^2} - d \approx b^2/2d$ farther than the
   straight path, so its phase is $e^{ik[b^2/2d - \Phi(b)]}$.
3. The sum of these wavelets over the plane, the **Fresnel integral** of section
   [5.3](/tutorial/waves/diffraction/#beyond-an-opening-a-wave-is-a-sum-of-wavelets-from-every-point-of-it), is the
   amplitude $A$, and the gain is $|A|^2$, the intensity over that without the Sun:

$$A = -\frac{ik}{d}\int_0^\infty e^{ik[b^2/2d - \Phi(b)]}\,b\,\dd b ,$$

which is 1 when $\Phi = 0$; $k\Phi$ and $kb^2/d$ are pure numbers, as a phase must be.

Inside the Sun the phase runs through hundreds of radians, so the gains below come from a fine numerical sum, exact for
a point lens to $10^{-10}$.

At 1 AU the central rays' geometric gain is $(1 - d/f_0)^{-2} = 1.0621$, a 6% rise reached above about 10 kHz; the wave
gives 88% of that excess at 1 kHz and 26.5% at 100 Hz. At 50 AU, beyond the central focus, the gain is 3.35, 43.8 and
478 at 10 kHz, 100 kHz and 1 MHz, in proportion to $f$: 0.86, 1.13 and 1.23 times a point mass's $\pi w$. It equals
$\pi w$ at 548 AU, where the rays graze the limb. At short waves the ratio settles at 1.39, the ring formula of the next section, so at $10^{13}$ Hz the gain is about
$5.4\times10^9$.

## Behind the Sun the sum splits at the limb, and the central rays and one ring set the gain

**Outside the disc** the bending is a point mass's, $\Phi(b) = \Phi(R_\odot) + (4G\matter M_\odot/c^2)\ln(b/R_\odot)$,
so that part of $A$ is the point mass's integral, which section [5.3](/tutorial/waves/diffraction/#behind-a-point-mass-a-wave-is-brightened-on-the-axis-by-a-factor-set-by-one-number) turns into Euler's gamma
function for the whole plane, giving $\pi w/(1 - e^{-\pi w})$, and into an incomplete gamma function when it starts at
the limb. At 1 kHz and 1 AU the limb lies $kR_\odot^2/2d = 34$ radians into the Fresnel phase.

**Inside the disc** the integrand is smooth, but its phase runs through hundreds of radians: $kR_\odot^2/2d = 679$ at
1 MHz and 50 AU. The inputs are those of Eddington's model (section 12.1): the column $\matter\Sigma(b)$, the density
added up along each chord; the cylinder's mass $\matter M_{\rm cyl}(b) = \int_0^b2\pi b'\matter\Sigma(b')\,\dd b'$;
the bending $\alpha(b)$; and $\Phi(b)$ of step 1. Simpson's rule
on an even grid in $b$, with some forty points to each turn of the phase, gives the inside part, and the gains of the
last section follow from $|A|^2$ to three figures. Two estimates check them.

**Short waves, nearer than the focus.** Near the centre $\matter M_{\rm cyl} \approx \pi b^2\matter\Sigma(0)$, so
$\alpha = b/f_0$. A ray at $b$ reaches the plane a distance $d$ behind the Sun at the radius $b - \alpha d = b(1 -
d/f_0)$. A disc of rays of radius $b$ thus arrives as a disc of radius $b(1 - d/f_0)$, carrying the same power, so on
the axis the intensity is raised by

$$\boxed{\;\Bigl(1 - \frac{d}{f_0}\Bigr)^{-2}\;} ,$$

1.0621 at 1 AU, where $d/f_0 = 1/33.7$. The integral gives the same: near $b = 0$ the phase is $k(1/d -
1/f_0)b^2/2$ plus a constant, since $\Phi \approx \Phi(0) + b^2/2f_0$ there, and the end $b = 0$ of the integral contributes
$-(ik/d)\cdot i/[k(1/d - 1/f_0)] = 1/(1 - d/f_0)$ to $A$, while the rest of the disc adds phases that turn quickly and
cancel when the waves are short. They are short enough when the **Fresnel radius** $\sqrt{\lambda d}$, the width of
the patch of the plane whose wavelets add in step, is smaller than the region where $\alpha \approx b/f_0$, about a
tenth of the radius. At 1 AU it is $0.30R_\odot$ at 1 kHz and $0.96R_\odot$ at 100 Hz, so the wave reaches only 88%
and 26.5% of the geometric rise there. At still lower frequencies the Fresnel radius exceeds the Sun, the wave cannot
tell its mass from a point's, and the gain tends to the point mass's: at 100 Hz the Sun gives 84% of the point mass's
excess, at 10 Hz 98%.

**Short waves, beyond the focus.** Between 33.7 and 548 AU one ring of impact parameter $b_*$ focuses on the camera,
$b_*/\alpha(b_*) = d$. There the phase $\psi(b) = k[b^2/2d - \Phi(b)]$ has $\psi' = k[b/d - \alpha] = 0$, so near the
ring $\psi \approx \psi_* + \tfrac12\psi''(b - b_*)^2$, with $\psi'' = k[1/d - \alpha'(b_*)]$. The Fresnel integral
$\int e^{i\psi''x^2/2}\,\dd x$ has the size $\sqrt{2\pi/|\psi''|}$, so the ring alone gives

$$|A|^2 = \Bigl(\frac kd\Bigr)^2b_*^2\,\frac{2\pi}{|\psi''|} = \frac{2\pi k\,b_*^2}{d\,|1 - d\,\alpha'(b_*)|} .$$

**Check:** for a point mass, $b_*^2 = 2r_sd$ (the Einstein ring of section 11.1) and $d\,\alpha' = -1$, so $|A|^2 =
2\pi kr_s = \pi w$, the large-$w$ limit of the point mass's gain. For the Sun we write $m(b) = \matter
M_{\rm cyl}(b)/\matter M_\odot$, so that $\alpha = r_s\cdot2m/b$; the focusing condition gives $b_*^2 = 2r_sd\,m$, and
$d\,\alpha' = b_*m'/m - 1$, with $m' = \dd m/\dd b$. Dividing by $\pi w = 2\pi kr_s$,

$$\frac{|A|^2}{\pi w} = \frac{2m^2}{2m - b_*m'} .$$

At 50 AU the ring is at $b_* = 0.209R_\odot$, where $m = 0.478$, and the ratio is 1.39; at 548 AU, $b_* = R_\odot$,
$m = 1$ and $m' = 0$, and the ratio is 1, the point mass's, as the full sum finds. The gain grows in proportion to the
frequency because the ring's rays all cross the axis at one point, a **caustic**, where rays give an infinite
intensity and the wave a finite one in proportion to $k$. The central rays still add their $(1 - d/f_0)^{-2} = 4.25$
at 50 AU, with a phase that differs from the ring's, so the sum swings about $1.39\,\pi w + 4.25$ by up to
$\pm2\sqrt{4.25\times1.39\,\pi w}$. That is why the full sum's ratios, 0.86, 1.13 and 1.23 at 10 kHz, 100 kHz and 1 MHz,
climb toward 1.39 and oscillate about it (it is 1.40 at 10 MHz), the swing falling as $f^{-1/2}$ in proportion.

## Matter scatters almost nothing, so every picture is emitted, pulled or yielded

A body of mass $\matter m$ scatters gravitational waves, at large angles, with a cross-section per unit solid angle of
order $(G\matter m/c^2)^2$ [@Peters1976], $2.7\times10^{-51}\unit{m^2\,sr^{-1}}$ for a person of 70 kg (section
[7.8](/tutorial/geometry/wave-energy/#matter-barely-touches-the-waves)).[^scatter] So no scene can be lit, and every picture is the scene's glow (Parts 5 to 10), its
pull (Parts 1 and 2), or its yield to a pull (Part 4).

**The cross-section of a single field.** We take the model of section
[5.2](/tutorial/waves/retarded-waves/#in-the-field-of-a-mass-a-burst-arrives-followed-by-a-tail): a single field in
the index $n = 1 - 2\field\Phi/c^2$, here at one frequency, $u = \psi(\vect x)e^{-i\omega t}$, with $k = \omega/c$. To
first order in $\field\Phi$, $n^2 = 1 - 4\field\Phi/c^2$, and the wave equation becomes

$$\nabla^2\psi + k^2\psi = \frac{4k^2\field\Phi}{c^2}\,\psi .$$

We assume that **the field is weak**, so the right side is a small source made by the incoming wave $e^{ikz}$, and add
its outgoing waves $e^{ik|\vect x - \vect y|}/4\pi|\vect x - \vect y|$ (section 5.2 at one frequency). Far away,
$|\vect x - \vect y| \approx r - \hat n\cdot\vect y$ for the direction $\hat n$ of the camera, and the scattered wave is
$f\,e^{ikr}/r$ with

$$f = -\frac{k^2}{\pi c^2}\int\field\Phi(\vect y)\,e^{-i\vect q\cdot\vect y}\,\dd^3y , \qquad \vect q = k(\hat n - \hat
z) ,\quad |\vect q| = 2k\sin\frac\theta2 ,$$

with $\theta$ the angle of scattering. For $\field\Phi = -G\matter m/r$ the integral is $-G\matter m$ times the
transform of $1/r$, which is $4\pi/q^2$: Poisson's $\nabla^2(1/r) = -4\pi\delta^3$ of section 1.3, with $\nabla^2$
becoming $-q^2$. So $f = 4k^2G\matter m/c^2q^2 = G\matter m/c^2\sin^2(\theta/2)$, a length. The scattered intensity at
the distance $r$ is $|f|^2/r^2$ of the incoming one, so the power per steradian over the incoming flux is

$$\boxed{\;\frac{\dd\sigma}{\dd\Omega} = \frac{(G\matter m/c^2)^2}{\sin^4(\theta/2)}\;} ,$$

in $\mathrm{m^2\,sr^{-1}}$, with no dependence on the frequency. **Check:** at small angles it is
$16(G\matter m/c^2)^2/\theta^4$. Rays at the impact parameter $b$ bend by $\theta = 4G\matter m/c^2b$ (section 11.1),
and those between $b$ and $b + \dd b$ fill the solid angle $2\pi\theta\,\dd\theta$, so they give $\dd\sigma/\dd\Omega
= b\,|\dd b/\dd\theta|/\theta = 16(G\matter m/c^2)^2/\theta^4$ too: the wave and the rays agree, as Rutherford's
formula for charges does with its classical orbits. For this potential the exact solution changes only the phase of
$f$, not its size (stated; Landau and Lifshitz, *Quantum Mechanics*, §135).

**The gravitational wave.** A gravitational wave carries spin two, and its scattering adds a factor
[@Peters1976]:

$$\frac{\dd\sigma}{\dd\Omega} = \Bigl(\frac{G\matter m}{c^2}\Bigr)^2\,\frac{\cos^8(\theta/2) + \sin^8(\theta/2)}{\sin^4(\theta/2)} ,$$

whose second term is the part that reverses the wave's handedness. At small angles the factor is one, and the
bending of rays is recovered; at $90°$ it is $\tfrac18$, and the cross-section is $\tfrac12(G\matter m/c^2)^2 =
1.35\times10^{-51}\unit{m^2\,sr^{-1}}$ for the person; straight back it is $(G\matter m/c^2)^2$ again. An electron
scatters light at $90°$ with $r_e^2/2 = 4.0\times10^{-30}\unit{m^2\,sr^{-1}}$, $r_e$ its classical radius, so the whole
person is $3\times10^{21}$ times fainter in gravitational waves than one electron in light.

An earthquake's compressional waves change the density, and with it $\curv\tE$ (section
[7.3](/tutorial/geometry/einstein-equation/#inside-matter-the-tide-has-a-part-fixed-by-the-matter-at-that-point)); the
prompt signal has been recorded [@Vallee2017]. It travels at $c$ and the first shaking at the P wave's $8\unit{km\,s^{-1}}$, so a
station 1000 km away feels the change two minutes before the ground moves (section
[5.2](/tutorial/waves/retarded-waves/#an-earthquakes-pull-arrives-minutes-before-its-shaking)). Shear waves move mass without changing density, so they show in
$\curv\tB$ (sections
[2.8](/tutorial/outside/flows/#the-current-column-is-the-flow-along-a-line-of-sight-weighted-by-inverse-distance) and
[7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow)). In curved space a burst arrives with a **tail**, an echo from waves scattered by curvature
[@DeWitt1960; @BlanchetDamour1992].

**Huygens's principle fails.** In empty space a blow at one point is heard at a distance $r$ at the one instant $r/c$.
In the field of a mass the source term above scatters the wave at every point, and the scattered wavelets reach the
camera later, from all points of the ellipsoid whose foci are the blow and the camera, so the burst is followed by a tail
inside the light cone (section
[5.2](/tutorial/waves/retarded-waves/#in-the-field-of-a-mass-a-burst-arrives-followed-by-a-tail) derives it). For a
mass $\matter M$ midway between them the tail fades as the cube of the time, and the part that arrives more than one
crossing time late holds $4G\matter M/3c^2r$ of the burst, $6.6\times10^{-9}$ for the Sun midway on a path of 2 AU. The
size of the tail measures the mass in between, not its inside.

**The tail of a pair's own waves.** A pair's waves leave through the field of its own total mass $\matter M$, and that
field focuses them. Two facts give the size. First, the operator $\nabla^2 + n^2k^2$ is symmetric in its two points, so
the wave reaching a far camera from a small source at the centre of the mass equals, at the source, the wave the camera
would send inward (**reciprocity**). Second, the exact wave that a point mass makes of an incoming plane wave has, at the
mass's centre, the same intensity as on the axis behind it (stated; the solution of Landau and Lifshitz, *Quantum Mechanics*, §135), which
section [5.3](/tutorial/waves/diffraction/#behind-a-point-mass-a-wave-is-brightened-on-the-axis-by-a-factor-set-by-one-number) finds to be $\pi w/(1 - e^{-\pi w})$. So a source at the centre of a mass radiates more strongly by that
factor, and for a quadrupole the factor changes only at second order in $w$ (same source). With $w =
4G\matter M\omega/c^3$, the pair's power is raised by

$$\boxed{\;1 + \frac{2\pi G\matter M\omega}{c^3}\;} ,$$

with $\omega$ the waves' angular frequency. This is the term $4\pi(G\matter M\Omega/c^3)$, for the orbit's $\Omega =
\omega/2$, that the post-Newtonian power of a circular pair carries from its tail (Blanchet, *Living Reviews in
Relativity*, 2014). For the two black holes of $30\,M_\odot$ at 8.7 Hz, $G\matter M\omega/c^3 = 0.016$, and the power is
10% above the quadrupole formula's; for the white-dwarf pair at 3.3 mHz, $8\times10^{-7}$. The phase of the same
factor holds $2G\matter M\omega/c^3$ times the logarithm of a distance, the Shapiro delay of the waves climbing out of
the pair's field, which shifts the phase of the wave by an amount set by the total mass [@BlanchetDamour1992].

## Worked example: a black hole against the first light

A hole of ten equilibrium masses, $\matter M = 1.356\times10^{24}$ kg or 18 Moon masses, stands against the 0.905 K
glow, and the camera is at rest at $r = 40\,G\matter M/c^2$, 4.03 cm away in circumference radius (Figure
[](#fig:read-xi-hole)). Each row feeds on earlier ones, and all but three recompute in a line with $G$, $c$, $\hbar$
and $\kB$: (e) needs the orbit integrated above, (f) section 11.3's greybody factors, and (g) the 91% gain.

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
The hole against a uniform sky: above, against $x$, the sky's energy, the hole's own glow and, shaded, what the hole
takes; below, the disc against the sky, weighed in energy and counted in quanta. A slider sets the mass from
0.3 to 300 equilibrium masses, and a switch chooses gravitons at 0.905 K or light at 2.7255 K.

Predict first: at ten equilibrium masses, is the disc darker in energy or in gravitons, and darker against light? Then
set the mass to 10 and switch the sky.
:::

**The idea to keep: against a glow left from the start, a black hole is dark only by being colder, and how dark
depends on its size against the gravitons' wavelength; the angles it shows depend only on the camera's distance in
units of $G\matter M/c^2$.**

::: problems
### Practice

**[R12b]** Rerun the example's steps (c), (d) and (f) for a hole of three equilibrium masses.

::: solution
$T_H = 0.302$ K and a disc 0.314 cm across; the shadow is still $7.27°$ at rest and $5.80°$ falling; the depth is 54%
in energy and 32% in counts.
:::

**[R12b]** Why does a hole of the equilibrium mass leave no mark on the uniform glow, though it absorbs?

::: solution
In each mode it emits $\Gamma_\ell n_H$ and removes $\Gamma_\ell n_{\rm bg}$, and at the sky's temperature
$n_H = n_{\rm bg}$.
:::

**[R12b]** At 1 AU and 10 kHz, how wide is the Fresnel radius against the Sun, and why does the wave then reach the
full geometric gain of the central rays?

::: solution
$\sqrt{\lambda d} = \sqrt{3.0\times10^4\unit m\times1.50\times10^{11}\unit m} = 6.7\times10^7$ m, $0.096R_\odot$: inside
the region, about a tenth of the radius, where $\alpha = b/f_0$, so the wavelets that add in step all come from rays
that focus alike.
:::

**[R12b]** For a person of 70 kg, compare the cross-section per steradian of a single field and of a gravitational
wave at $60°$.

::: solution
At $60°$, $\sin^4 30° = 1/16$, so the single field gives $16(G\matter m/c^2)^2 = 4.3\times10^{-50}\unit{m^2\,sr^{-1}}$;
the factor $\cos^830° + \sin^830° = 0.320$ gives $5.1(G\matter m/c^2)^2 = 1.4\times10^{-50}\unit{m^2\,sr^{-1}}$ for the
wave.
:::

### Stretch

**[R12b]** With sections 11.1 and 12.2: at what distance from a hole does the graviton sky look 10% warmer, and how
large is the shadow there?

::: solution
$1/\sqrt{1 - 2G\matter M/c^2r} = 1.1$ gives $r = 11.52\,G\matter M/c^2$, where the shadow is $24.2°$ in radius and the
sky reads 0.996 K.
:::

**[R12b]** With the tail factor: by how much does the tail raise the power of two neutron stars of $1.4\,M_\odot$ when
their waves have 100 Hz, and why is the estimate poor near 1.7 kHz?

::: solution
$G\matter M\omega/c^3 = 2.8\times4.93\times10^{-6}\unit s\times628\unit{s^{-1}} = 8.7\times10^{-3}$, so the power rises
by $2\pi\times8.7\times10^{-3} = 5.4\%$. Near 1.7 kHz the same number is 0.15 and the rise 93%, far outside first order.
:::

**[R12b]** With the ring formula: at 548 AU the ring grazes the limb. Show that the gain there is a point mass's $\pi w$.

::: solution
At $b_* = R_\odot$ the whole mass is inside, $m = 1$, and outside it $m' = 0$, so $2m^2/(2m - b_*m') = 1$.
:::

### The camera

**[R12b]** Reproduce the glow's numbers: temperature, extra species, density, count, wavelength, dipole, distance ratio.

::: solution
$0.3321\times2.7255 = 0.905$ K; $\tfrac87(0.905/1.945)^4 = 0.054$; $\Omega_g = 6.6\times10^{-7}$; $N =
3.59\times10^{14}$; 5.9 mm and $0.34°$; $370/299{,}792 = 1.23\times10^{-3}$; $14.14/13.86 = 1.020$.
:::

**[R12b]** Reproduce the Sun's lens: the frequency at which $w = 1$, the geometric gain at 1 AU, and the ring's ratio
at 50 AU.

::: solution
$c^3/8\pi G\matter M_\odot = 8.08$ kHz; $(1 - 1/33.7)^{-2} = 1.0621$; $2\times0.478^2/(2\times0.478 - b_*m') = 1.39$,
with $b_*m' = 0.627$ at $b_* = 0.209R_\odot$.
:::
:::

::: paper
- Section XI's *A primordial graviton background* and Figure [](/paper/#fig:black-hole): Eq.
  [](/paper/#eq:graviton-temperature) and the hole against the glow.
- From *A freely falling camera* to *Scattering, earthquakes and tails*, with Figure [](/paper/#fig:sun-lens).
:::

::: deeper
- The [GR course, section
  17.9](https://neovand.github.io/general-relativity/chapter-17.html#17-9-separate-the-photon-from-the-observers): the
  falling camera's aberration in full.
:::

[^T]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, as its equation
    [](/paper/#eq:graviton-temperature), with $T_\gamma$ from Fixsen (2009).

[^omega]: For $H_0 = 67\,\mathrm{km\,s^{-1}\,Mpc^{-1}}$.

[^g2]: Counts within one mode and one coherence time; a pixel gathering $K$ independent modes sees $1 + 1/K$.

[^sun]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, with the Sun's lens in its Fig.
    [](/paper/#fig:sun-lens).

[^scatter]: The total cross-section is infinite, since distant waves are still turned through small angles.
