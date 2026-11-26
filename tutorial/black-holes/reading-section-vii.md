---
id: R11
title: 'A camera without a lens'
question: 'Can anything do for gravitational waves what glass does for light, and what would a black hole really do as the camera''s lens?'
part: '11'
requires: ['1.8', '2.7', '5.1', '5.3', '5.5', 'R5', '11.1', '11.3']
paper: [sec:no-lens, eq:index, eq:optics-bound, eq:lens-compactness, fig:black-hole-camera, eq:beam, eq:diffraction, fig:array]
figures: [fig:black-hole-camera, fig:array]
live: [black-hole-camera, array, hole-against-sky]
---

Glass focuses light because it slows it. Can anything do the same for gravitational waves? A lens of matter is hopeless, and the one body compact enough, a black hole of about two Moon masses, would tear apart a camera near it.[^lens]

::: plain
Matter slows, reflects and absorbs gravitational waves, but each effect is tiny, because an ordinary body curves space very little. The compactness measures how little, and it nears one only for a black hole.

A small black hole would focus the glow of warm matter, and from 26 kilometres away the camera would gather 130 times more of it, but the hole's pull would drown the picture of everything nearby. The camera needs no lens: a computer delays and adds its pixels' records, as a lens does with glass.
:::

## Matter barely slows a wave, and reflects less still

A wave of angular frequency $\omega$, in $\mathrm{s^{-1}}$, crossing matter of density $\matter\rho$, in $\mathrm{kg\,m^{-3}}$, is slowed by the refractive index $\sym{refractive-index}{n}$, the factor by which matter slows it [@Peters1974]:

$$n - 1 = \frac{2\pi G\matter\rho}{\omega^2}$$

(section [5.1](/tutorial/waves/wave-equation/#a-medium-can-slow-a-wave-and-its-refractive-index-measures-how-much)). For steel, $\matter\rho = 7850\unit{kg\,m^{-3}}$, at 1 kHz this is $8.3\times10^{-14}$. Stiffness adds the smaller term $16\pi G\matter\mu/c^2\omega^2$, with $\sym{shear-modulus}{\matter\mu}$ the shear modulus in pascals [@Press1979; @FlaugerWeinberg2018]: $6.7\times10^{-23}$ for the 71 GPa of steel, with shear sound at $c_T = 3000\unit{m\,s^{-1}}$.

By section [5.5](/tutorial/waves/radiance/#matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact), a thin lens of radius $R$ and central thickness $h$ focuses at $f = R^2/2(n - 1)h$. A steel lens 1 m in radius and 1 m thick focuses at $6.0\times10^{12}$ m, or 40 AU, the distance of Pluto, and the 300 km wavelength at 1 kHz is far larger than the lens.

A sharp face reflects the amplitude $4\pi G\matter\mu/c^2\omega^2$, $1.7\times10^{-23}$ for that steel, and so the fraction $2.8\times10^{-46}$ of the energy. Absorption is weaker still (below), so walls give no echoes.

## Every optical constant of a body is its compactness times factors below one

A mass $\matter M$ bends a passing wave by $4G\matter M/bc^2 = 2r_s/b$ at the distance $b$, with $\sym{schwarzschild-radius}{r_s} = 2G\matter M/c^2$ its Schwarzschild radius (section [11.1](/tutorial/black-holes/schwarzschild/#far-from-a-mass-light-bends-by-twice-newtons-angle)). Rays at $b$ cross the axis at $b^2/2r_s$. The Earth, with $r_s = 8.87$ mm, focuses grazing rays at $R_\oplus^2/2r_s = 15{,}300$ AU, fifteen thousand times the distance to the Sun, and its **focal ratio**, the focal length over the lens's width, $\sym{focal-ratio}{N} = f/2R$, is $1.8\times10^8$. Both follow from the **compactness** $\sym{compactness}{\mathcal C} = G\matter M/Rc^2$ of a body of mass $\matter M$ and radius $R$, a pure number: $6.96\times10^{-10}$ for the Earth.

For a uniform ball whose shear sound travels at $c_T$ with quality factor $Q$, crossed by a wave of **reduced wavelength** $\sym{reduced-wavelength}{\bar\lambda} = c/\omega$, the wavelength over $2\pi$, the optical constants are

$$\begin{gathered}
\Delta\phi = 3\,\mathcal{C}\,\frac{\bar\lambda}{R} , \qquad
|r| = 3\,\mathcal{C}\Bigl(\frac{c_T}{c}\Bigr)^{2}
\Bigl(\frac{\bar\lambda}{R}\Bigr)^{2} , \\
\tau = \frac{24\,\mathcal{C}}{Q}\Bigl(\frac{c_T}{c}\Bigr)^{2}
\frac{\bar\lambda}{R} , \qquad
N = \frac{1}{8\,\mathcal{C}} .
\end{gathered}$$

Since $\matter M = \tfrac43\pi R^3\matter\rho$, $G\matter\rho = 3\mathcal Cc^2/4\pi R^2$, and each entry takes a line.[^bound]

- The wave takes the extra time $(n - 1)2R/c$ to cross a diameter, so its phase falls behind by $\Delta\phi = (n - 1)\,\omega\,2R/c = 4\pi G\matter\rho R/\omega c = 3\mathcal C\bar\lambda/R$.
- With $\matter\mu = \matter\rho c_T^2$, the reflection amplitude is $|r| = 4\pi G\matter\mu/c^2\omega^2 = 3\mathcal C(c_T/c)^2(\bar\lambda/R)^2$.
- The **optical depth** $\sym{optical-depth}{\tau}$ is the absorption along the diameter, a pure number. A friction $\matter\eta$, in Pa s, absorbs at the rate $\alpha = 16\pi G\matter\eta/c^3$ per metre (section [7.8](/tutorial/geometry/wave-energy/#viscosity-fades-a-wave-at-hawkings-rate)), which is $1.2\times10^{-37}\unit{m^{-1}}$ for water's $10^{-3}$ Pa s. A ringing solid has $\mathrm{Re}\,\matter\eta = \matter\rho c_T^2/\omega Q$ (section [4.4](/tutorial/response/viscosity/#a-ringing-solids-friction-is-its-quality-factor)), so $\tau = 2R\alpha = (24\mathcal C/Q)(c_T/c)^2\bar\lambda/R$.
- The focal ratio follows from $r_s/R = 1/4N$ (derived below) with $r_s = 2\mathcal CR$: $N = 1/8\mathcal C$.

After $\mathcal C$, every factor is below one: $c_T/c = 1.0\times10^{-5}$ for $3000\unit{m\,s^{-1}}$; $1/Q < 1$ for anything that rings; and $\bar\lambda/R < 1$ for a body large enough to bend the wave rather than diffract it. A mirror, by Press's condition $\matter\mu > \matter\rho c^2$, would need shear sound faster than light. Proposed absorbers, solar foci and resonant stars are no better [@Smolin1984; @Smolin1985; @Loeb2020; @PatlaNemiroff2008; @McKernan2014]. Loeb (2020) set an upper limit on the dissipation of gravitational waves in any gravitationally bound system, stated here without proof [@Loeb2020]. Only black holes cast shadows (section [11.3](/tutorial/black-holes/hawking/#a-hole-that-loses-heat-grows-hotter-so-its-balance-with-a-sky-cannot-last)), and a spinning one reflects a wave with gain when $\omega < m\Omega_H$, with $m$ the azimuthal number and $\Omega_H$ the horizon's rate of turning (section [11.2](/tutorial/black-holes/spin/#a-hole-amplifies-a-wave-that-turns-with-it-more-slowly-than-its-horizon)).

## Only a black hole is compact enough, and it focuses only the glow of warm matter

A lens of radius $R$ that brings rays to a focus at the distance $f$ must bend its edge ray by $R/f$. Gravity bends it by $2r_s/R$, with $r_s$ for the mass inside the edge ray, so $r_s/R = 1/4N$ for the focal ratio $N = f/2R$ (section 5.5). A pocket lens at $f/10$, 5 cm in radius, needs $r_s = 1.25$ mm, or $8.4\times10^{23}$ kg: 11.5 Moon masses, at $7.0\times10^9$ times the density of an atomic nucleus, $2.3\times10^{17}\unit{kg\,m^{-3}}$.

A hole whose Hawking temperature $T_H = \hbar c^3/8\pi G\matter M\kB$ equals the graviton sky's 0.905 K has $\sym{equilibrium-mass}{\matter M_{\rm eq}} = 1.356\times10^{23}$ kg, 1.85 Moon masses (section 11.3). Lighter holes evaporate, and the balance is unstable, since a hole that loses heat grows hotter (section [10.2](/tutorial/glow/kirchhoff/#a-balance-is-stable-only-if-the-heat-capacity-is-positive)). From the 2.7255 K microwave sky its capture area takes at most $8.8\times10^{-52}$ of $\matter Mc^2$ each second (section [11.3](/tutorial/black-holes/hawking/#a-hole-that-loses-heat-grows-hotter-so-its-balance-with-a-sky-cannot-last)).

Its $r_s$ is 0.201 mm. By the **wave-optics cut-off** of section 11.1, a mass focuses only waves shorter than $4\pi r_s$: 2.53 mm, or frequencies above 118 GHz. A 1 kHz wave would need $4\pi r_s = 300$ km, or 8.1 solar masses. So the hole focuses the glow of room-temperature matter, which peaks at tens of micrometres (section [10.1](/tutorial/glow/black-body/#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)), but not the sky it balances: the 0.905 K graviton sky peaks near 53 GHz, below the cut-off. For a camera at the distance $d$, the **Einstein radius** is $\sym{einstein-radius}{b_E} = \sqrt{2r_sd}$ and the ring's angle is $\theta_E = \sqrt{2r_s/d}$ (section 11.1).

## The camera must orbit 26 km away, where the hole gathers 130 times its area

The camera cannot sit close. By the exact tide of section [11.1](/tutorial/black-holes/schwarzschild/#the-tide-outside-a-round-mass-is-exactly-newtons), the stretch along the line to the hole is $2G\matter M/r^3$: $1.8\times10^{13}\unit{s^{-2}}$ at a metre, where the ring is $1.15°$. It falls to $1\unit{s^{-2}}$ at 26.3 km, where the ring is $25.5''$ and its rays pass $b_E = 3.25$ m from the hole. There the pull is 1340 times the Earth's gravity, and a circular orbit runs at 18.6 km s⁻¹, once every 8.9 s (section [1.8](/tutorial/newton/orbits-and-kicks/#the-period-of-a-free-orbit-is-set-by-the-tide-where-it-runs)). The axis from the camera through the hole turns with the orbit, so a patch of sky is in focus for $2\theta_E/(2\pi/8.9\unit{s}) = 0.35$ ms a turn.

**The gathered area.** A ray passing at $b$ is bent by $2r_s/b$, so at $d$ it lands at $b - b_E^2/b$ from the axis. It hits a detector of radius $a$ (not Kerr's $a$) when $|b - b_E^2/b| < a$, that is between $b_\pm = \tfrac12[\sqrt{a^2 + 4b_E^2} \pm a]$. The annulus between them has the area $\pi(b_+^2 - b_-^2) = \pi a\sqrt{a^2 + 4b_E^2}$, a length squared. For $a = 5$ cm it is 1.02 m², 130 times $\pi a^2$, the area of a dish 1.14 m across.

**Fringes and gain.** Rays from opposite sides of the ring meet at the angle $2b_E/d$ and interfere in fringes $\lambda d/2b_E = 4.0$ cm apart at a wavelength $\lambda$ of 10 µm. On the axis a point lens raises the intensity by the factor

$$\frac{\pi w}{1 - e^{-\pi w}} ,$$

with the pure number $\sym{lens-parameter}{w} = 4\pi r_s/\lambda$.[^gain] On the axis every path round the ring has the same length, so all arrive in step. For $w \gg 1$ the factor is $\pi w = 4\pi^2r_s/\lambda$: 795 at 10 µm. At the cut-off of section 11.1, $w = 1$, the gain is still 3.3. Off the axis the paths fall out of step, so the peak is a spot 2.9 cm across at half height. A detector 10 cm across averages over the fringes to 129, the geometric 130, and that is the number that counts.

**Where the factor comes from.** Section [5.3](/tutorial/waves/diffraction/#behind-a-point-mass-a-wave-is-brightened-on-the-axis-by-a-factor-set-by-one-number) sums the wavelets from every point of the lens's plane, each delayed by the mass as section [11.1](/tutorial/black-holes/schwarzschild/#a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring) finds, and the sum is a gamma function: the gain is $|\Gamma(1 - iw/2)|^2e^{\pi w/2}$, with $\Gamma$ Euler's gamma function (not 11.3's greybody factor), which is exactly $\pi w/(1 - e^{-\pi w})$. The wavelet from the distance $b$ off the axis has, relative to the others, the phase $kb^2/2d - w\ln b$, with $k = 2\pi/\lambda$: its extra path to the camera and its delay by the mass. That phase is stationary where $kb/d = w/b$, at $b^2 = wd/k = 2r_sd = b_E^2$. So the wavelets that add in step come from the Einstein ring, which is why geometric optics finds the ring. Near the ring the phase grows as $(k/d)(b - b_E)^2$, since its second derivative there is $k/d + w/b_E^2 = 2k/d$, so the wavelets within a band about $\sqrt{d/k}$ wide round the ring add in step. Section 5.3's sum over that band has the size $(k/d)\,b_E\int e^{ik(b - b_E)^2/d}\,\dd b = (k/d)\,b_E\sqrt{\pi d/k}$, and its square is the gain $\pi kb_E^2/d = 2\pi kr_s = \pi w$: the limit for $w \gg 1$, found without the gamma function.

The hole also blinds the near field. A person of 70 kg a metre away raises the tide $9.3\times10^{-9}\unit{s^{-2}}$ (section [1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)); at 26.3 km the hole's is $1.07\times10^8$ times larger, and the two are equal only where $r^3 = (\matter M/70\unit{kg})\times(1\unit{m})^3$, at 12,470 km.

Figure [](/paper/#fig:black-hole-camera) plots the hole's tide against the camera's distance, with the person's tide dashed.

{{paper fig:black-hole-camera}}

::: try {#black-hole-camera}
One slider sets the camera's distance, the other the hole's mass in equilibrium masses.

Predict first: when the camera halves its distance, by what factor do the tide and the ring grow? Check from 26.3 km. Then set the mass to ten equilibrium masses: is the bearable distance ten times farther, or less?
:::

## A lens adds nothing classical, and no lens sharpens the near field

Classically a lens adds nothing, because an array does its sum by computation (below). A converter of gravitons into photons a metre across ([R10b](/tutorial/glow/reading-section-ix/)) would gather as much as the hole's 1.14 m dish. The quantum half, an image from counted gravitons, is read in [R8](/tutorial/quantum/reading-the-quantum-limits/#read-ahead-a-counter-adds-no-noise-and-each-graviton-tells-about-one-bit).

The near field's blur comes from Laplace's equation (section [2.7](/tutorial/outside/evanescent/#the-same-fade-appears-for-every-field-that-obeys-laplaces-equation)), which no lens can undo. Matter answers a tide by deforming, which adds a fraction of order $G\matter\rho/\omega_0^2$, with $\omega_0$ the angular frequency at which it rings: $5.8\times10^{-17}$ for the steel ball at 15.1 kHz (section 4.3). It reaches one only in a material so soft that it collapses under its own weight. A slab of thickness $L$ rings near $\omega_0 \approx c_s/L$, with $c_s$ a sound speed, so the fraction is one at $L \approx c_s/\sqrt{G\matter\rho}$, with $\sqrt{G\matter\rho} = 7.2\times10^{-4}\unit{s^{-1}}$ for steel. Shear sound at $3000\unit{m\,s^{-1}}$ gives 4,100 km, and compressional sound at $5520\unit{m\,s^{-1}}$ with the lowest mode's $\pi$ gives 24,000 km (section [4.3](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound)): of order ten thousand kilometres.

## Delaying and adding the records is the camera's lens

A wave from the direction $\hat n$, pointing toward its source, reaches a pixel at $\vect x_p$ earlier by $\hat n\cdot\vect x_p/c$. The image undoes the delays and adds:

$$I(\hat n) = \Bigl\langle\, \sum_{ij}\Bigl|\, \sum_{p} \Lambda_{ij,kl}(\hat n)\,
\curv\tE_{kl}\bigl(\vect x_p,\, t -\hat n\cdot\vect x_p/c\bigr) \Bigr|^{2}
\Bigr\rangle ,$$

with $\Lambda(\hat n)$ the projector of section [7.6](/tutorial/geometry/gravitational-waves/#one-projector-keeps-what-a-wave-can-carry) and $\curv\tE_{kl}$ the tide in $\mathrm{s^{-2}}$, so $I(\hat n)$ is in $\mathrm{s^{-4}}$. Section [5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array) derives the delay and sum for one number per pixel; here each table is projected first.[^beam]

The magnetic records tell front from back. A wave from $\hat n$ travels along $\hat k = -\hat n$, so $\curv\tB_{qj} = \epsilon_{qrs}\hat k_r\curv\tE_{sj}$ (section 7.6) and the identity $\epsilon_{ipq}\epsilon_{qrs} = \delta_{ir}\delta_{ps} - \delta_{is}\delta_{pr}$ (section [1.1](/tutorial/newton/vectors-and-indices/#two-levi-civita-symbols-make-two-kronecker-deltas)) give

$$\begin{aligned}
\epsilon_{ipq}\hat n_p\curv\tB_{qj} &= -\epsilon_{ipq}\epsilon_{qrs}\,\hat n_p\hat n_r\,\curv\tE_{sj}\\
&= \curv\tE_{ij} - \hat n_i\hat n_s\curv\tE_{sj} = \curv\tE_{ij} ,
\end{aligned}$$

since the wave's tide is transverse, $\hat n_s\curv\tE_{sj} = 0$. For a wave from $-\hat n$ the sign of $\hat k$ flips, and the same combination is $-\curv\tE_{ij}$. So the half-sum $\tfrac12(\curv\tE_{ij} + \epsilon_{ipq}\hat n_p\curv\tB_{qj})$ keeps the wave from $\hat n$ and cancels the one from $-\hat n$. A flat array confuses $\hat n$ with its mirror image in its plane, and the half-sum keeps $\sin^8\alpha$ of that wave's power, with $\alpha$ the angle from the normal: 6% at $45°$ and 61% at $70°$ (section 5.3).

**Why the eighth power.** Put the array in the plane $z = 0$ and point it at $\hat n = (\sin\alpha, 0, \cos\alpha)$. The mirror direction $\hat n' = (\sin\alpha, 0, -\cos\alpha)$ gives every pixel the same delay, so its wave adds in step as well. That wave travels along $-\hat n'$, so the steps above, with $\hat n'$ in the place of the second $\hat n$, give

$$\epsilon_{ipq}\hat n_p\curv\tB'_{qj} = (\hat n\cdot\hat n')\,\curv\tE'_{ij} - \hat n'_i\,\hat n_s\curv\tE'_{sj} ,$$

with $\curv\tE'$ and $\curv\tB'$ the mirror wave's tide and magnetic part. Here $\hat n\cdot\hat n' = \sin^2\alpha - \cos^2\alpha$, so $1 + \hat n\cdot\hat n' = 2\sin^2\alpha$, and the half-sum is $M_{ij} = \sin^2\alpha\,\curv\tE'_{ij} - \tfrac12\hat n'_i\,\hat n_s\curv\tE'_{sj}$. Take the plus wave, $\curv\tE' = q\,(e'_1e'_1 - e_2e_2)$, of amplitude $q$ in $\mathrm{s^{-2}}$, where $e'_1 = (\cos\alpha, 0, \sin\alpha)$ and $e_2 = (0, 1, 0)$ lie across $\hat n'$. The image keeps what $\Lambda(\hat n)$ keeps, the trace-free part across $\hat n$, in the axes $e_1 = (\cos\alpha, 0, -\sin\alpha)$ and $e_2$. With $e_1\cdot e'_1 = \cos2\alpha$, $e_1\cdot\hat n' = \hat n\cdot e'_1 = \sin2\alpha$ and $\sin^22\alpha = 4\sin^2\alpha\cos^2\alpha$,

$$M_{11} = q\bigl(\sin^2\alpha\cos^22\alpha - \tfrac12\sin^22\alpha\cos2\alpha\bigr) = -q\sin^2\alpha\cos2\alpha , \qquad M_{22} = -q\sin^2\alpha ,$$

and $M_{12} = M_{21} = 0$. The trace-free part has the amplitude $\tfrac12(M_{11} - M_{22}) = \tfrac12q\sin^2\alpha\,(1 - \cos2\alpha) = q\sin^4\alpha$, and the cross wave keeps the same, so the power kept is $\sin^8\alpha$. **Checks:** at $\alpha = 0$ the mirror wave comes from straight behind and nothing of it is kept; at $\alpha = 90°$ the two directions coincide and all of it is.

The sharpness is that of any aperture of width $D$, $\Delta\theta \approx \lambda/D$, and for a steady source one moving pixel synthesizes the aperture, as a radar does with one moving antenna (section 5.3). Thermal radiation's phase wanders within $\hbar/\kB T = 2.6\times 10^{-14}$ s at 293 K, so an averaged image needs pixels recording together, at least in pairs, as in radio astronomy.

Figure [](/paper/#fig:array) shows the image of one distant source. Arrays 2, 5 and 30 wavelengths wide give round-aperture patterns $29.8°$, $11.8°$ and $1.97°$ wide at half height (section 5.3).[^airy] The single pixel's curve is $51.6°$ wide and dips to $-0.15$ at $59.5°$ (section [9.6](/tutorial/one-point/the-sky-at-one-point/#a-single-pixels-picture-of-the-sky-is-blurred-over-52)).

::: try {#array}
The slider sets the array's width, from one pixel to 100 wavelengths. Predict first: is one pixel's curve wider or narrower than that of an array two wavelengths wide? Then drag the slider to its left end, and one step right.
:::

## The capstone: a black hole as the camera's lens

![Look first at the arrows: each panel's number feeds the next. The wavelengths of (b) and the tides of (f) are drawn to
scale; the annulus's width is exaggerated eight times, and the other sizes are
schematic.](tut-read-vii-capstone){#fig:read-vii-capstone}

The capstone follows one hole, of the equilibrium mass $1.356\times10^{23}$ kg, through Part 11 (Figure [](#fig:read-vii-capstone)).

| Step | Formula | Number | Section |
|---|---|---|---|
| (a) mass | $\matter M = \hbar c^3/8\pi G\kB T$, $T = 0.905$ K | $1.356\times10^{23}$ kg; unstable | 11.3 |
| (b) lens | $r_s = 2G\matter M/c^2$; focuses $\lambda < 4\pi r_s$ | 0.201 mm; above 118 GHz, the warm glow | 11.1 |
| (c) orbit | $2G\matter M/r^3 = 1\unit{s^{-2}}$; period $T = 2\pi\sqrt{r^3/G\matter M}$ | 26.3 km; 8.9 s | 11.1, 1.8 |
| (d) view | $\theta_E = \sqrt{2r_s/r}$, $b_E = \theta_Er$, $\theta_ET/\pi$ | $25.5''$, 3.25 m, 0.35 ms a turn | here |
| (e) gathers | $\pi a\sqrt{a^2 + 4b_E^2}$, $a = 5$ cm; peak $\pi w$ | 1.02 m², 130 times; 795 | here |
| (f) costs | $r^3 = (\matter M/70\unit{kg})\,\mathrm{m^3}$ | the person's tide wins beyond 12,470 km | 1.4, here |
| (g) adds | an image from counted gravitons | classically nothing | R8 |

::: try {#hole-against-sky}
The slider sets the hole's mass, from 0.3 to 300 equilibrium masses, and a switch chooses the sky, gravitons at 0.905 K or light at 2.7255 K. Predict first: at one equilibrium mass, is the disc dark, bright or invisible against each sky? Then slide the mass to 1, switch the sky, and show the depths, the share of a black disc's darkness that the hole achieves.
:::

**The idea to keep: a body's optical constants are its compactness times factors below one, so only a black hole makes a useful lens; orbiting one 26 km away gains a metre-wide dish and loses the near field, so the camera computes its pictures instead.**

::: problems
### Practice

**[R11]** For ten times the hole's mass, where is the tide $1\unit{s^{-2}}$, what is $b_E$ there, and what area does a 5 cm detector gather?

::: solution
At $\matter M^{1/3}$ times as far, 56.6 km; $b_E$ grows as $\matter M^{2/3}$, to 15.1 m; the area is 4.74 m², close to $2\pi ab_E$ since $b_E \gg a$.
:::

**[R11]** Find the hole's gain on the axis at the wavelengths 1 mm and 0.1 mm, and the wavelength at which the gain is 2.

::: solution
With $w = 4\pi r_s/\lambda$ and $r_s = 0.201$ mm, $w = 2.53$ at 1 mm and 25.3 at 0.1 mm, so $\pi w/(1 - e^{-\pi w}) = 7.95$ and 79.5. The gain is 2 where $\pi w = 1.59$, $w = 0.51$, at $\lambda = 5.0$ mm, beyond the cut-off of 2.53 mm: a point lens still doubles a wave somewhat longer than $4\pi r_s$.
:::

**[R11]** What share of a mirror wave's power does the half-sum keep at $30°$ and at $60°$ from the array's normal?

::: solution
$\sin^830° = 1/256 = 0.4\%$ and $\sin^860° = (3/4)^4 = 32\%$.
:::

### Stretch

**[R11]** Above what frequency can the Earth focus a wave?

::: solution
Above $c^3/8\pi G\matter M_\oplus = 2.7$ GHz, a wavelength of $4\pi r_s = 11$ cm.
:::

### The camera

**[R11]** From the optical constants of a uniform ball, find the Earth's phase delay for a 1 kHz wave and its focal ratio ($R = 6371$ km), and the delay in time.

::: solution
At 1 kHz, $\bar\lambda = 47.7$ km, so $\Delta\phi = 3\mathcal C\bar\lambda/R = 1.6\times10^{-11}$ rad and $N = 1/8\mathcal C = 1.8\times10^8$. The delay is $\Delta\phi/\omega = 2.5\times10^{-15}$ s.
:::
:::

::: paper
- [Section VII](/paper/#sec:no-lens) in full: its five equations and Figures [](/paper/#fig:black-hole-camera) and
  [](/paper/#fig:array).
- [Section XI](/paper/#sec:vistas): the point lens's gain and the Sun as a lens (R12b).
:::

::: deeper
- The [GR course, section 16.4](https://neovand.github.io/general-relativity/chapter-16.html#16-4-bending-light-finding-the-famous-factor-of-two)
  derives the bending $4GM/bc^2$.
:::

[^lens]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. VII](/paper/#sec:no-lens).

[^bound]: Equations [](/paper/#eq:index), [](/paper/#eq:optics-bound) and [](/paper/#eq:lens-compactness) of *The gravitational camera* (Mohsenvand 2026), Sec. VII.

[^gain]: First given in *The gravitational camera* (Mohsenvand 2026), [Sec. XI](/paper/#par:the-transparent-sun-as-a-lens).

[^beam]: Equations [](/paper/#eq:beam) and [](/paper/#eq:diffraction) of *The gravitational camera* (Mohsenvand 2026), Sec. VII.

[^airy]: With $\Lambda(\hat n)$ in the sum, an unpolarized source's power is that pattern times $(1 + 6\cos^2\theta + \cos^4\theta)/8$, with $\theta$ the steering angle, giving widths $28.5°$, $11.7°$ and $1.97°$.
