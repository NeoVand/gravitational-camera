---
id: '5.3'
title: 'Diffraction, resolution and arrays of sensors'
question: 'A camera can make its image by undoing the delays between its pixels and adding, with the sharpness $\Delta\theta \approx \lambda/D$ of any aperture. How does adding delayed records make a picture, and why can no array do better than its width in wavelengths?'
part: '5'
requires: ['2.6', '3.2', '3.6', '3.8', '5.1', '5.2']
paper: [sec:no-lens, eq:beam, eq:diffraction, fig:array, sec:waves, fig:which-way, sec:near-field, sec:one-pixel, sec:introduction, sec:vistas]
figures: [fig:array, fig:which-way]
live: [array, delay-and-sum]
depth: A
---

Can anything focus gravitational waves as glass focuses light? Nothing practical can, and a camera does not need it. A
light sensor registers only the energy that arrives, but a gravitational pixel registers the field itself, with its
phase. A wave from one direction reaches the pixels at slightly different times, and the camera makes its image by
undoing those delays and adding.[^beam] Its sharpness is that of any aperture of width $D$, about the wavelength divided
by $D$ (Figure [](/paper/#fig:array), for arrays 2, 5 and 30 wavelengths wide). How does adding delayed records make a
picture, and why can no array do better than its width in wavelengths? The answer also derives what section
[3.6](/tutorial/noise/bessel-and-airy/#a-lens-draws-a-star-as-the-square-of-that-pattern) assumed, Fraunhofer
diffraction with the factor that sets the brightness, and the count of resolved directions that section
[3.8](/tutorial/noise/bits/#sensitivity-buys-more-patterns-and-more-bits-in-each-so-the-bits-grow-as-the-cube-of-its-logarithm)
used.

::: plain
A gravitational pixel records the wave itself, crest by crest, not only how much energy arrives. A wave that comes from
one direction reaches the pixels of an array one after another, a little earlier at the pixels nearer to its source.
To make the picture for that direction, the camera shifts each pixel's record back by the delay that belongs to the
direction, and then adds the records. A wave from that direction adds up in step at every pixel; a wave from another
direction arrives with other delays, and its shifted records largely cancel.

The result has the same shape as the picture a lens makes. Two directions can be told apart when they differ by more
than about the wavelength divided by the width of the array, whatever the sensitivity of the pixels. Gaps between
pixels wider than half a wavelength make false copies, and a source close to the array needs delays measured from each
of its points.
:::

## Beyond an opening, a wave is a sum of wavelets from every point of it

The opening of a lens and the width of an array shape a picture in the same way, and section 3.6 assumed the answer. A
wave of one angular frequency $\omega$ arrives at a flat screen from one side, and the screen has an opening of area
$A$, in square metres. As in section
[5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1),
we write the field as $\sym{wave-field}{u} = \mathrm{Re}[\tilde u(\vect x)\,e^{-i\omega t}]$, where the complex
amplitude $\tilde u$ has the unit of $u$ and holds the size and the phase of the oscillation at the place $\vect x$.

**A wavelet.** A blow at one point sends out the field $\delta(t - R/c)/4\pi R$ at the distance $R$ (section 5.2). A
point source that oscillates at the frequency $\omega$ sends out the transform of this in time, $\int\delta(t - R/c)\,e^{i\omega t}\,\dd t/4\pi R = e^{ikR}/4\pi R$, where
$\sym{wavenumber}{k} = \omega/c$ is the wavenumber in $\mathrm{m^{-1}}$. A spherical wave of this form, sent out from
one point, is a **wavelet**.

**The principle.** Every point of the opening sends out a wavelet, with a strength in proportion to the wave that
arrives there, and the wave beyond the opening is the sum of these wavelets. This is **Huygens's principle**. We write it
with a constant $C$ to be found:

$$\tilde u(P) = C\int_{\rm opening}\tilde u(\vect a)\,\frac{e^{ikR}}{R}\,\dd^2a .$$

Here $\vect a$ is the place on the opening, in metres, $\dd^2a$ a small piece of its area, and $R$ the distance from
$\vect a$ to the field point $P$. We make two assumptions. **The field on the opening is the wave that arrives, and the
field on the screen is zero.** This is Kirchhoff's assumption; the box below says where it fails. **The field point lies
many wavelengths beyond the opening, at a small angle from the line through its centre**, so that every wavelet reaches
$P$ travelling in nearly the same direction.

**Finding the constant.** A plane wave with no screen in its way, which is an opening that fills the whole plane,
must pass unchanged. Let it arrive straight on, with the amplitude $\tilde u_0$ everywhere on the plane, and
put $P$ on the axis at the distance $z$. A ring of the plane of radius $a$ and width $\dd a$ is at the distance $R =
\sqrt{z^2 + a^2}$ from $P$. Since $R\,\dd R = a\,\dd a$, the ring's area $2\pi a\,\dd a$ is $2\pi R\,\dd R$, and the sum
of wavelets is

$$C\,\tilde u_0\int_z^\infty\frac{e^{ikR}}{R}\,2\pi R\,\dd R = 2\pi C\,\tilde u_0\Bigl[\frac{e^{ikR}}{ik}\Bigr]_z^\infty .$$

The far end of the bracket oscillates without settling, because the rings far out add pieces whose phases turn round and
round. A real wave fades, however gently, toward the edge of a very large opening. Let it fade as $e^{-\gamma R}$, with
a small rate $\gamma$ in $\mathrm{m^{-1}}$. The bracket becomes $[e^{(ik - \gamma)R}/(ik - \gamma)]_z^\infty$, whose far
end is zero, and as $\gamma \to 0$ only the near end, $-e^{ikz}/ik$, is left. The sum is then $-2\pi C\tilde
u_0\,e^{ikz}/ik = i\lambda\,C\,\tilde u_0\,e^{ikz}$, because $2\pi/k = \lambda$, the wavelength. It must equal the plane
wave $\tilde u_0\,e^{ikz}$, so $C = 1/i\lambda$:

$$\boxed{\;\tilde u(P) = \frac{1}{i\lambda}\int_{\rm opening}\tilde u(\vect a)\,\frac{e^{ikR}}{R}\,\dd^2a .\;}
\label{eq:huygens}$$

The units agree: $1/\lambda$ and $1/R$ each divide by a metre, and $\dd^2a$ multiplies by a square metre, so $\tilde
u(P)$ has the unit of $\tilde u$. The factor $1/i = e^{-i\pi/2}$ shifts every wavelet by a quarter cycle, because the
sum of the wavelets alone comes out a quarter cycle out of step with the plane wave, as the factor $i$ above shows.

::: gap
This sketch assumes Huygens's principle and fixes its constant by one test. Kirchhoff derived it from the wave equation,
with Green's second identity of section
[2.1](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other) applied to the
field and the wavelet beyond the screen. His result has an extra factor $\tfrac12(1 + \cos\chi)$, with $\chi$ the angle
between the wavelet's direction and the axis, which is 1 at small angles. His assumption fails within about a wavelength
of the rim, so the formula is poor for openings near a wavelength across.
:::

**Far away, the transform of the opening.** Put $P$ at the distance $r$ from the centre of the opening, in the direction
of the unit vector $\hat m$ at a small angle $\theta$ from the axis. As in section
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source), $R \approx r - \hat
m\cdot\vect a$ in the phase, as long as $r \gg D^2/\lambda$ for an opening of width $D$, the far field of section 3.6;
in the denominator $R \approx r$. A plane wave arriving straight on has $\tilde u = \tilde u_0$ on the opening, so

$$\tilde u(P) \approx \frac{\tilde u_0\,e^{ikr}}{i\lambda r}\int_{\rm opening}e^{-ik\hat m\cdot\vect a}\,\dd^2a .$$

The integral is the transform of the opening of section 3.6, at the wavenumber $k\sin\theta = 2\pi\sin\theta/\lambda$ along
the tilt. This is Fraunhofer diffraction, now derived from the wave equation, with its factor in front.

**The brightness on the axis.** The energy that a wave carries across each square metre per second, its **intensity**,
is proportional to $|\tilde u|^2$ (section
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed)). On the axis every point of the
opening is at the same phase, the integral is the area $A$, and the intensity there is a fixed fraction of the
intensity that arrives:

$$\boxed{\;\frac{|\tilde u(P)|^2}{|\tilde u_0|^2} = \frac{A^2}{\lambda^2r^2} .\;} \label{eq:axis}$$

This is the factor that section 3.6 left out. The fraction $A^2/\lambda^2r^2$ is a pure number, as it must be.

**A number.** Take a round opening 1.5 m across, with $A = 1.77\unit{m^2}$, and waves 10 cm long, the sizes of
Figure [](/paper/#fig:which-way). Its far field begins near $D^2/\lambda = 22.5$ m. At 225 m on the axis,
[](#eq:axis) gives $1.77^2/(0.1^2 \times 225^2) = 0.0062$ of the arriving intensity. The central spot there has a first
dark ring of radius $1.22\lambda r/D = 18.3$ m (section 3.6), so the power that passed an opening 0.75 m in radius is
spread over a spot 24 times wider. The formula would exceed 1 closer than $r = A/\lambda = 17.7$ m, but that lies inside
the far-field distance, where only the full sum [](#eq:huygens) holds.

**A check: the energy is kept.** The power through the opening is the arriving intensity times $A$. Far beyond it, the
central spot has an area of about $\lambda^2r^2/A$, and by [](#eq:axis) its intensity is $A^2/\lambda^2r^2$ times the
arriving one, so the power that crosses it is about the arriving intensity times $A$. Every watt that passed the
opening arrives.[^parseval]

## Behind a point mass a wave is brightened on the axis by a factor set by one number

A mass in the path of a wave delays the part that passes close to it more than the part that passes far away, and so
acts as a lens. We want the brightening on the axis behind it, from the sum of wavelets [](#eq:huygens). We use one
fact from Part 11, the gravitational delay: a wave that passes a point mass $\matter M$ at the distance $b$, its
**impact parameter**, arrives later by

$$\Delta t(b) = -\frac{4G\matter M}{c^3}\,\ln b + \text{a constant} ,$$

the more the closer it passes ([section 11.1](/tutorial/black-holes/schwarzschild/#a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring) derives it). We assume that **the
wave arrives as a plane wave along the axis**, that **the delay acts as a thin screen in the plane of the mass**, and
that **the field point lies on the axis at the distance $d$ behind it**, far beyond the mass's own size.

**The screen.** A wave $e^{-i\omega t}$ delayed by $\Delta t$ is multiplied by $e^{i\omega\Delta t}$, so the screen
multiplies the arriving amplitude by $b^{-iw}$, up to a constant phase, with

$$\sym{lens-parameter}{w} = \frac{4G\matter M\omega}{c^3} = \frac{8\pi G\matter Mf}{c^3} ,$$

a pure number: the delay $4G\matter M/c^3$ measured in radians of the wave's phase. From the ring at radius $b$ to the
field point the distance is $\sqrt{d^2 + b^2} \approx d + b^2/2d$, and in the denominator it is $d$. So
[](#eq:huygens) gives

$$\tilde u = \frac{\tilde u_0\,e^{ikd}}{i\lambda d}\int_0^\infty b^{-iw}\,e^{ikb^2/2d}\,2\pi b\,\dd b .$$

**The integral is a gamma function.** We put $v = b^2$, so that $2b\,\dd b = \dd v$ and $b^{-iw} = v^{-iw/2}$:

$$\int_0^\infty b^{-iw}e^{ikb^2/2d}\,2\pi b\,\dd b = \pi\int_0^\infty v^{s-1}e^{-pv}\,\dd v, \qquad s = 1 - \frac{iw}{2},
\quad p = -\frac{ik}{2d} .$$

The **gamma function** is $\Gamma(s) = \int_0^\infty v^{s-1}e^{-v}\,\dd v$; for whole numbers it is a factorial,
$\Gamma(n + 1) = n!$. Putting $v = v'/p$ turns the integral into $\Gamma(s)\,p^{-s}$. For a real positive $p$ this is a
change of scale. For our imaginary $p$ it turns the path of integration onto the imaginary axis, which is allowed when
the wave fades gently far out, as in the first section, and we take that limit:

$$\tilde u = \frac{\pi\,\tilde u_0\,e^{ikd}}{i\lambda d}\,\Gamma(s)\Bigl(\frac{k}{2d}\Bigr)^{-s}e^{i\pi s/2} ,$$

since $-i = e^{-i\pi/2}$. Only the size matters for the brightness. With $|(k/2d)^{-s}| = 2d/k$ and
$|e^{i\pi s/2}| = e^{\pi w/4}$, and $\pi\cdot2d/k = \lambda d$,

$$\frac{|\tilde u|^2}{|\tilde u_0|^2} = \bigl|\Gamma(1 - \tfrac{i}{2}w)\bigr|^2\,e^{\pi w/2} .$$

The distance $d$ has gone: on the axis the brightening is the same at every distance behind a point mass. **Euler's
reflection formula** $\Gamma(z)\Gamma(1 - z) = \pi/\sin\pi z$ (stated) gives, with $\Gamma(1 + z) = z\Gamma(z)$ and
$y = w/2$, $|\Gamma(1 + iy)|^2 = \Gamma(1 + iy)\Gamma(1 - iy) = iy\,\pi/\sin(i\pi y) = \pi y/\sinh\pi y$. So

$$\boxed{\;\frac{|\tilde u|^2}{|\tilde u_0|^2} = \frac{\pi w}{1 - e^{-\pi w}}\;} . \label{eq:point-lens}$$

**Two limits.** For $w \ll 1$ the gain is $1 + \pi w/2$, nearly 1: a delay of much less than a radian across the wave
cannot focus it, and diffraction spreads the little it bends. For $w \gg 1$ the gain is $\pi w = 4\pi^2r_s/\lambda$, with
$r_s = 2G\matter M/c^2$: it grows with the frequency, as the focus of geometric optics sharpens. The two regimes meet
near $w = 1$, a frequency of $c^3/8\pi G\matter M$.

**Numbers.** For the Sun, $c^3/8\pi G\matter M = 8.1\unit{kHz}$. At 100 Hz, $w = 0.0124$ and the gain is 1.02: waves
from orbiting or merging bodies pass the Sun brightened by only two per cent. At 8 kHz the gain is 3.3. We assumed a
point mass; behind a real star the delay differs for waves that cross it. Outside the star's disc, $b > R$, the
integral is the same with the lower limit $v = R^2$, which the same change of variable turns into the **incomplete
gamma function** $\Gamma(s, pR^2) = \int_{pR^2}^\infty v^{s-1}e^{-v}\,\dd v$; inside the disc the delay changes smoothly
and its part of the integral is a smooth one.[^point-lens]

## Delaying and adding the records of many pixels points the array

An **array** is a set of
pixels spread over a region, the pixel numbered $p$ at the place $\sym{pixel-position}{\vect x_p}$, in metres, and the
region they cover is its **aperture**. We assume that **each pixel records one number, the field $u$ at its place**
(real pixels record a table, which we come to at the end of this section) and that **the source is far away**,
so that its wave reaches the array as a plane wave. A later section drops the second assumption.

**The delays.** Let $\sym{look-direction}{\hat n}$ be the unit vector from the array toward the source. This reverses
section 5.2's convention, where $\hat n$ pointed from a source toward the field point: a camera forms its picture as a
function of the direction in which it looks, so its $\hat n$ points that way. The wave travels along $-\hat n$, so by
section
[5.1](/tutorial/waves/wave-equation/#any-shape-travels-without-changing) it has the form

$$u(\vect x, t) = F\Bigl(t + \frac{\hat n\cdot\vect x}{c}\Bigr) ,$$

where $F$ is the record at the origin, in the unit of $u$. A crest keeps a fixed value of $t + \hat n\cdot\vect x/c$,
so as $t$ grows, $\hat n\cdot\vect x$ falls, and the crest moves along $-\hat n$, away from the source. The pixel at
$\vect x_p$ records $u_p(t) = F(t + \hat n\cdot\vect x_p/c)$: it sees each crest earlier than the origin by
$\hat n\cdot\vect x_p/c$, being nearer to the source by $\hat n\cdot\vect x_p$ (Figure [](#fig:das-delays)).

![Look first at the slanted line through the crests of the records on the right: each pixel hears the wave
earlier by its extra closeness to the source, $\hat n\cdot\vect x_p/c$. Shifting each record by that delay lines the
crests up, and the records add in step. Geometry exact; the records are schematic.](tut-das-delays){#fig:das-delays}

**Delay and sum.** To make the picture for a chosen direction $\sym{steered-direction}{\hat n'}$, the camera shifts
each record later by the delay that belongs to $\hat n'$ and adds:

$$\begin{aligned}
S(t) &= \sum_pu_p\Bigl(t - \frac{\hat n'\cdot\vect x_p}{c}\Bigr)\\
&= \sum_pF\Bigl(t + \frac{(\hat n - \hat n')\cdot\vect x_p}{c}\Bigr) .
\end{aligned}$$

This is **delay and sum**, or **beamforming**, and choosing $\hat n'$ is **steering** the array. When $\hat n' = \hat n$,
every term is $F(t)$ and the sum is $N$ times the record of one pixel, where $N$ is the number of pixels. For any other
direction the records are shifted by different amounts and partly cancel.

**One frequency.** Let the wave have one frequency, $F(t) = \mathrm{Re}[\tilde u\,e^{-i\omega t}]$. A shift of the
time by $\tau$ multiplies $e^{-i\omega t}$ by $e^{-i\omega\tau}$, and $\omega/c = k$, so

$$\begin{gathered}
S(t) = \mathrm{Re}\Bigl[\tilde u\,e^{-i\omega t}\,\mathcal A_{\hat n'}(\hat n)\Bigr],\\
\sym{steered-array-factor}{\mathcal A_{\hat n'}}(\hat n) = \sum_pe^{-ik(\hat n - \hat n')\cdot\vect x_p} .
\end{gathered}$$

The picture is the mean square of the sum over a cycle. For any complex $Z$, the mean of
$(\mathrm{Re}[Z\,e^{-i\omega t}])^2$ over a cycle is $\tfrac12|Z|^2$, because $\cos^2$ averages to one half. So the
image in the direction $\hat n'$ is

$$\boxed{\;\sym{beam-image}{I}(\hat n') = \tfrac12|\tilde u|^2\,\Bigl|\sum_pe^{-ik(\hat n - \hat n')\cdot\vect
x_p}\Bigr|^2 ,\;} \label{eq:das}$$

in the square of the unit of $u$.[^I] It is largest, $\tfrac12|\tilde u|^2N^2$, when $\hat n' = \hat n$, where every
record adds in step.

**The array factor again.** Turn the pixels into sources, as in the
[array factor](/tutorial/waves/retarded-waves/#many-sources-in-step-add-their-amplitudes) of section 5.2, and give them the
phases $\phi_p = -k\hat n'\cdot\vect x_p$, which aim their combined wave at $\hat n'$. Their array factor $\mathcal A$
for the wave they send out along $\hat n$, from the array toward our source, is exactly the sum in [](#eq:das). So an
array receives from each direction as strongly as it would send toward it, a rule called **reciprocity**. The function
$|\mathcal A_{\hat n'}(\hat n)|^2/N^2$, drawn against the direction $\hat n$ of a source for a fixed steering, is the
array's **beam pattern**. Its peak at $\hat n = \hat n'$ is the **main lobe**, and the smaller peaks around it are
**side lobes**.

**A filled aperture.** Let $N$ pixels cover a flat aperture of area $A$ evenly, $N/A$ of them per square metre, and call
the line through its centre at right angles to it the aperture's axis. The sum becomes $N/A$ times an
integral over the aperture, and only the parts of $\hat n$ and $\hat n'$ along the aperture's plane enter
$(\hat n - \hat n')\cdot\vect a$. With the array steered along its axis, so that $\hat n'$ has no part along the plane,
a source at the angle $\theta$ from the axis gives

$$\mathcal A = \frac{N}{A}\int_{\rm aperture}e^{-ik\hat n\cdot\vect a}\,\dd^2a ,$$

the same transform of the opening as in the last section, at the wavenumber $k\sin\theta$. For a round aperture of
diameter $\sym{aperture-width}{D}$, in metres, the
[disc](/tutorial/noise/bessel-and-airy/#a-round-opening-transforms-to-a-wider-pattern-than-a-slit) of section 3.6 gives $\mathcal A =
N\,2J_1(x)/x$ with $x = \pi D\sin\theta/\lambda$, which is $N$ on the axis, as it must be. The image is its square, the
Airy pattern, which falls to half its height at $x = 1.616$. The full width at half height is therefore $2 \times
1.616/\pi = 1.03$ times $\lambda/D$ in radians, which is the sharpness:

$$\Delta\theta \approx \frac{\lambda}{D} ,$$

where $\sym{angular-blur}{\Delta\theta}$ is the width of the image of a point, an angle in radians, as in section 3.7.


**Numbers.** With the exact $\sin\theta$, the half height lies at $\sin\theta = 1.616\,\lambda/\pi D$. For arrays 2, 5
and 30 wavelengths wide this gives full widths of 29.8°, 11.8° and 1.97°; the rule $1.03\lambda/D$ gives
29.5°, 11.8° and 1.97°. These are the widths that Figure
[](/paper/#fig:array) marks.

{{paper fig:array}}

Each of the three narrowing curves is the Airy pattern of [](#eq:das) for one width. The broad curve of the single
pixel comes from something else: a pixel that records one number has $|\mathcal A|^2 = 1$ for every steering and cannot
tell directions apart at all. A real pixel records the ten numbers of the tide's two
tables (the ideal pixel of section [R1](/tutorial/newton/reading-section-ii/#an-ideal-pixel-reads-ten-numbers-and-must-not-turn)),
which a wave from each direction fills in its own proportions, and those proportions alone locate a source to within
some fifty degrees (Part 9 derives the curve).

**The form for the tide.** The camera's pixels record the tide $\sym{tidal-tensor}{\curv{\tE}}_{kl}$ of section
[1.4](/tutorial/newton/tides/), a table, and delay and add it exactly as [](#eq:das) does, with the looked-at direction
$\hat n$ in the place of our steered $\hat n'$. Before the sum, the projector $\sym{tt-projector}{\Lambda_{ij,kl}}(\hat n)$
of section [5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source) keeps only
the part of the table that a wave from that direction can carry (section
[7.6](/tutorial/geometry/gravitational-waves/#one-projector-keeps-what-a-wave-can-carry) builds it). The squares of all
the components are added and averaged in time:

$$I(\hat n) = \Bigl\langle\, \sum_{ij}\Bigl|\, \sum_{p} \Lambda_{ij,kl}(\hat n)\,
\curv{\tE}_{kl}\bigl(\vect{x}_p,\, t -\hat n\cdot\vect{x}_p/c\bigr) \Bigr|^{2}\Bigr\rangle .$$

The magnetic part of the tide tells the front of a flat array from its back, which works well only near the array's
axis.[^mirror]

::: try {#array}
The slider sets the width of the array in wavelengths, $D/\lambda$, and the curve is the image of one distant source.
Predict the blur of an array 30 wavelengths wide from the small-angle rule, $1.03 \times 57.3°/30$, then set the widths
2, 5 and 30: the readouts show 30°, 12° and 2.0°, the figures above rounded.
:::

## Gaps between pixels make copies of the image

A real array has pixels only at some places. Take a row of
$N$ pixels a distance $\sym{pixel-spacing}{b}$ apart, in metres, at $\vect x_p = pb\,\hat x$ for $p = 0, 1, \dots,
N - 1$, the letter of section 2.6 for the spacing.[^b] Let the source and the steered
direction lie in the plane that holds the row and the normal to it, at the angles $\theta$ and $\theta'$ from the
normal, so that $\hat n\cdot\vect x_p = pb\sin\theta$.

**The sum.** The array factor of [](#eq:das) is then a sum of powers of one number,

$$\begin{gathered}
\mathcal A = \sum_{p=0}^{N-1}e^{-ip\psi},\\
\psi = kb(\sin\theta - \sin\theta') .
\end{gathered}$$

A geometric series sums to $(1 - e^{-iN\psi})/(1 - e^{-i\psi})$, and $|1 - e^{-i\alpha}| = 2|\sin(\alpha/2)|$ for any
real $\alpha$, so

$$|\mathcal A|^2 = \frac{\sin^2(N\psi/2)}{\sin^2(\psi/2)} .$$

Near $\psi = 0$ both sines are small and the ratio is $N^2$, the main lobe. It first falls to zero at $\psi = 2\pi/N$,
which is $\sin\theta - \sin\theta' = \lambda/Nb$: the angle $\lambda/D$ for the width $D = Nb$, as for a filled slit.
The side lobes lie between the later zeros; for eight pixels the largest reaches 5.3% of the main lobe (Figure
[](#fig:das-lobes)).

**The copies.** The denominator $\sin^2(\psi/2)$ also vanishes at $\psi = 2\pi$, $4\pi$, and so on, and there the
ratio is $N^2$ again. These directions are the **grating lobes**, at

$$\boxed{\begin{gathered}
\sin\theta - \sin\theta' = \frac{m\lambda}{b},\\
m = \pm1, \pm2, \dots
\end{gathered}} \label{eq:lobes}$$

where the whole number $\sym{lobe-order}{m}$ is the order of the lobe. This is the
[aliasing](/tutorial/outside/fourier/#an-area-holds-a-countable-number-of-ripples) of section 2.6. Along the row a wave from the angle
$\theta$ is a ripple of wavenumber $k\sin\theta$, and two ripples whose wavenumbers differ by $2\pi/b$ take the same
value at every pixel. So at one frequency two directions whose values of $\sin\theta$ differ by $\lambda/b$ give
exactly the same records, and no sum of the records can tell them apart.

**The rule.** The value of $\sin\theta$ runs from $-1$ to 1, so two directions can differ in it by as much as 2. For the
array to be steered anywhere without a copy appearing, the first copy must lie at or beyond that range,
$\lambda/b \ge 2$. So the spacing must satisfy

$$\boxed{\;b \le \frac{\lambda}{2} .\;}$$

At $b = \lambda/2$ exactly, a copy reaches the horizon only when the array is steered to the opposite horizon.

**A number.** Take 16 pixels half a wavelength apart and a source at 20°: only $m = 0$ fits, and the main lobe is 6.8°
wide. Spread the same pixels to two wavelengths apart. Copies then lie wherever $\sin\theta$ differs
from $\sin20° = 0.342$ by a multiple of $\lambda/b = 0.5$: at $\sin\theta = 0.842$, $-0.158$ and $-0.658$, the angles
57.4°, $-9.1°$ and $-41.1°$. The main lobe is four times narrower, 1.7°, but the image holds four equal sources where
there is one.

**How many pixels.** A square array $D$ wide with pixels $\lambda/2$ apart needs $(2D/\lambda)^2$ of them: for 1.5 m
across at a wavelength of 10 cm, $30^2 = 900$, and a round array needs $\pi/4$ of that, 707.

![Look first at the dashed curve's extra peaks of full height: with pixels two wavelengths apart, the directions
whose $\sin\theta$ differ by $\lambda/b = 0.5$ give the same records, and the array cannot tell them apart. With pixels
half a wavelength apart (solid) there is only one peak. Curves exact.](tut-das-lobes){#fig:das-lobes}

## An array resolves as many directions as its area holds square wavelengths

Section 3.8 compared a wave camera's information with the near field's using the number of directions an array can tell
apart, which we estimate here. Two directions are resolved when they are farther apart than about the width of the main
lobe, so the sky divides into **resolved directions**, spots about $\lambda/D$
wide in each of two directions across the line of sight.

Each spot covers about $(\lambda/D)^2$ steradians, so one steradian holds about

$$\Bigl(\frac{D}{\lambda}\Bigr)^2$$

of them. The count of ripples of section 2.6 gives the closer count $A/\lambda^2$ per steradian near the axis, for an
aperture of area $A$.[^count] For the array 1.5 m across at 10 cm, $(D/\lambda)^2 = 225$, and the round array's
$A/\lambda^2$ is 177.

**The bits.** Each direction carries one number, the amplitude of the wave from it, read through the noise. Section
[3.8](/tutorial/noise/bits/#where-a-ripple-stands-well-above-its-noise-it-carries-log_2-s-bits) found that a number
that stands $s$ times above its noise carries about $\log_2 s$ bits when $s$ is large. With $s$ about the camera's
signal-to-noise ratio $\SNR$, a wave camera holds about

$$\Bigl(\frac{D}{\lambda}\Bigr)^2\log_2\SNR$$

bits in each steradian. At $\SNR = 10^3$, $\log_2\SNR = 10.0$, and the array 1.5 m across holds about $225 \times 10 = 2200$ bits per
steradian. The width in wavelengths fixes the number of directions, and sensitivity only adds bits to each; the near
field's bits grow faster, as $(\ln\SNR)^3$ (section 3.8), because there sensitivity sets the number of patterns too.

## An array of M sensors separates up to M − 1 sources that are out of step

Delay and sum blurs every source over $\lambda/D$. When the sources are few and out of step, the correlations between
the records hold more. We take one frequency and collect the complex amplitudes of the $M$ pixels' records in a list
$\tilde{\mathbf u}$ of $M$ numbers. A source in the direction $\hat n_a$ contributes $s_a\,\mathbf a(\hat n_a)$, where
$s_a$ is its complex amplitude and $\mathbf a(\hat n)$, with the entries $e^{-ik\hat n\cdot\vect x_p}$, is the
**steering vector** of that direction. We assume $K$ sources **out of step**, so that $\langle s_as_b^*\rangle = 0$ for
$a \ne b$, with powers $P_a = \langle|s_a|^2\rangle$, and noise in each pixel that is **independent of the other pixels'**,
of variance $\sigma^2$.

**The correlation table.** The averages of the products of the records form the $M\times M$ table

$$\mathbf R = \langle\tilde{\mathbf u}\,\tilde{\mathbf u}^\dagger\rangle = \sum_{a=1}^KP_a\,\mathbf a(\hat
n_a)\,\mathbf a(\hat n_a)^\dagger + \sigma^2\,\mathbf 1 ,$$

where $\dagger$ is the conjugate transpose. It is **Hermitian**, equal to its own conjugate transpose, the complex form
of the symmetric tables of section 3.4, and like them it has perpendicular eigenvectors with real eigenvalues. Each
term of the sum has rank one, so every column of the sum lies among the combinations of the $K$ steering vectors. If
$K < M$, there are $M - K$ perpendicular vectors $\mathbf e$ with $\mathbf e^\dagger\mathbf a(\hat n_a) = 0$ for every
source, and for each of them $\mathbf R\mathbf e = \sigma^2\mathbf e$. These eigenvectors, with the smallest
eigenvalue $\sigma^2$, span the **noise subspace**; the other $K$ eigenvalues are larger.

**The method.** Estimate $\mathbf R$ from long records, find its noise subspace, and look for the directions whose
steering vector is perpendicular to all of it:

$$\boxed{\;\hat n \text{ is a source} \iff \sum_{\mathbf e\ \text{in the noise subspace}}\bigl|\mathbf
e^\dagger\mathbf a(\hat n)\bigr|^2 = 0\;} .$$

This is the method called MUSIC (Schmidt 1986). It needs one more condition: that no other direction has a steering
vector made of the sources' ones. For a row of pixels less than half a wavelength apart and directions in one plane
through the row, it holds for any $M$ directions, because their steering vectors are powers of $M$ different numbers. It
fails at the grating lobes of the section on gaps, and for a row it fails for directions on one cone about the row:
in both cases two directions have the same steering vector. Its picture is not limited to the width $\lambda/D$, because a zero is sharp; only the noise in the estimate of
$\mathbf R$ widens it.

**The count.** The noise subspace must hold at least one vector, so $K \le M - 1$: an array of $M$ sensors that each
record one number separates at most $M - 1$ sources out of step. Two pixels separate one source, and the sixteen pixels
of the section on gaps separate fifteen. A pixel of the tide records several numbers for each wave, so its steering
vectors are longer, and section 9.7 counts how many sources $N$ such pixels separate.[^music]

## A near source needs the delays from a point

The plane-wave delays of the second section assume that the fronts of the wave are flat across the array.

**The approximation.** A source on the axis at the distance $r$ sends fronts that are spheres. The path from it to a
pixel at the distance $a$ from the centre of the array is longer than the path to the centre by
$\sqrt{r^2 + a^2} - r \approx a^2/2r$. Plane-wave delays leave this out, and at the rim of an array of width $D$, where
$a = D/2$, they miss $D^2/8r$ of path, which is the phase $kD^2/8r = \pi D^2/4\lambda r$. The small parameter is that
phase. The delays are right when it is much less than one radian, that is, when $r \gg D^2/\lambda$ up to a factor near one,
the [far field](/tutorial/noise/bessel-and-airy/#a-lens-draws-a-star-as-the-square-of-that-pattern) of section 3.6.
The distances closer than about $D^2/\lambda$ make up the array's **Fresnel zone**, where the fronts of a source's wave
are curved across the array by a sizeable part of a wavelength and plane-wave delays fail (Figure [](#fig:das-fresnel)).

![Look first at the short segment at the right-hand rim of the upper array: a source 4.5 m away curves its fronts
across a 1.5 m array by 0.62 of a wavelength, so plane-wave delays are wrong there and the array must be focused. A
source 225 m away, ten times beyond $D^2/\lambda = 22.5$ m, leaves its fronts flat to a hundredth of a wavelength.
Geometry exact, to scale.](tut-das-fresnel){#fig:das-fresnel}

**Focusing.** In the Fresnel zone the array uses the delays from a point. A wave sent from the point $\vect y$ at the
time $t$ reaches the pixel at $\vect x_p$ at $t + |\vect x_p - \vect y|/c$. Reading each record at that time and adding,

$$S_{\vect y}(t) = \sum_pu_p\Bigl(t + \frac{|\vect x_p - \vect y|}{c}\Bigr) ,$$

lines up every crest that left $\vect y$ together. The image is now a function of a point $\vect y$, not of a
direction, and the array is **focused** on it, as a lens is focused on a near object. Far away, with $\vect y = r\hat
n$, $|\vect x_p - \vect y| \approx r - \hat n\cdot\vect x_p$, and the sum returns to the plane-wave sum.

**A number.** In Figure [](/paper/#fig:which-way) the speed of light is slowed to 20 cm s⁻¹, so the waves are 10 cm long, and
the array is 1.5 m wide. The shelf of boxes is about 4.5 m away, inside the far field that begins near 22.5 m. At the rim,
plane-wave delays would miss $0.75^2/(2 \times 4.5) = 0.0625$ m of path, 0.63 of a wavelength, or 3.9 radians of
phase. So the figure's Airy spots need an array focused at the shelf's distance, as section 3.6 found.

{{paper fig:which-way}}

In panel (b), each turning pair of balls is a spot of the width that the second section computes, 3.9°, and the still
pair is dark.

**A source larger than its wave.** An aperture wide enough to resolve a source of radius $L$ larger than its wave lies
in the source's Fresnel zone, $D^2 \gg \lambda r$, which is the zone defined above.[^larger] The argument takes two
lines. The far-field formula of section
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source) holds at
$r \gg L^2/\lambda$. To show detail on the source, the detail $\lambda r/D$ must be smaller than $L$, so $D > \lambda r/L$. Then

$$\frac{D^2}{\lambda r} > \frac{\lambda r}{L^2} \gg 1 .$$

So any array that shows detail on a source larger than its wave must be focused on it.

**Range beyond the Fresnel zone.** Far beyond $D^2/\lambda$ the fronts are nearly flat, but not quite, and their
curvature still gives the distance. At the rim the curvature adds the phase $\phi_c = \pi D^2/4\lambda r$, which changes
with the distance as $\dd\phi_c/\dd r = -\phi_c/r$. A phase read from a signal $\rho$ times above its noise is uncertain
by about $1/\rho$ radians ([section 3.3](/tutorial/noise/measuring-a-number/)), where $\rho$ here is the
signal-to-noise ratio, not a density. So the distance is uncertain by $\sigma_r = (1/\rho)\,r/\phi_c$, and

$$\boxed{\;\frac{\sigma_r}{r} \approx \frac{4}{\pi}\,\frac{\lambda r}{\rho D^2}\;} .$$

The order of magnitude, $\lambda r/\rho D^2$, does not depend on the details of the fit; the factor $4/\pi$ does. The
fractional error grows in proportion to the distance, and at $r = D^2/\lambda$ it is about $1/\rho$. **A number.** For
the array 1.5 m across at 10 cm and $\rho = 100$, a source at 225 m, ten times beyond the Fresnel distance, is ranged
to 13%, and the shelf at 4.5 m to 0.25%.[^range]

## Sources in step blur more than sources out of step

**The two cases.** Two equal sources lie a distance $\sym{source-separation}{\Delta y}$ apart, in metres, at the
distance $r$, so that they are $\Delta y/r$ apart in angle. Each alone, with its phase taken as zero, makes an
amplitude pattern across the image, $a_1$ or $a_2$, a real number at each steered direction. If the second source runs
ahead of the first by the phase $\phi$, in radians, its pattern is $e^{i\phi}a_2$, and the image of the pair is in
proportion to

$$|a_1 + e^{i\phi}a_2|^2 = a_1^2 + a_2^2 + 2a_1a_2\cos\phi .$$

If the phases of the two sources wander independently, they are **incoherent**: $\phi$ takes every value equally
often, $\cos\phi$ averages to zero, and the two images add as intensities, $a_1^2 + a_2^2$, as in the
[incoherent addition](/tutorial/waves/retarded-waves/#many-sources-in-step-add-their-amplitudes) of section 5.2. If they
oscillate in step, with $\phi = 0$, they are **coherent**: the amplitudes add first, and the image is
$(a_1 + a_2)^2$. Between the two peaks both amplitudes are positive, so the cross term $2a_1a_2$ fills the dip (Figure [](#fig:das-pair)).

**The method.** We take a row aperture of width $D$, whose amplitude pattern is $\sin x/x$ with $x =
\pi D\theta/\lambda$ (the slit of section 3.6). The pair counts as separated when the image midway between the peaks falls
to 0.8 of the peaks, close to the 0.81 of Rayleigh's rule for a slit (section 3.6).

**The results.** On the exact patterns, the incoherent pair separates at $\Delta y = 1.01\,\lambda r/D$ and the coherent pair
at $\Delta y = 1.43\,\lambda r/D$, 1.42 times farther apart.[^coherent] Sources in step therefore need a width
$D \gtrsim 1.4\,\lambda r/\Delta y$, against about $\lambda r/\Delta y$ for sources that are not: the familiar penalty of
imaging in coherent light. With Sparrow's criterion of section
[3.7](/tutorial/noise/blur-law/#step-7-an-exact-calculation-reproduces-the-papers-table), which asks only that a dip
appear, or with a round aperture, the factor lies between 1.4 and 1.6. Sources in opposite phase cancel midway between them and always show a dip, so equal phases are the worst case.

![Look first at the middle: the pair out of step (solid) dips to half its peaks there, and the pair in step
(dashed) has its peak there, because their amplitudes add before they are squared. The sources are
$1.2\,\lambda r/D$ apart. Curves exact.](tut-das-pair){#fig:das-pair}

## One moving pixel can image a steady source, but thermal light needs pixels that record together in pairs

**Synthesis.** For a wave of one frequency, [](#eq:das) uses only the complex amplitude of each record,
$\tilde u\,e^{-ik\hat n\cdot\vect x_p}$ at the pixel $p$. A steady wave keeps these amplitudes for all time. So one
pixel, carried from place to place across the aperture and recording for a while at each, can measure every amplitude
in turn. It reads each phase against a clock that ticks at the wave's frequency, and the clock lets amplitudes read at
different times be compared as if they had been read at once. The sum of [](#eq:das) formed afterwards is the image of
a filled array. This is **aperture synthesis**: a radar flown along a track synthesizes an aperture as long as the
track with one antenna, because its own steady signal lights the scene. The same holds for the near field and for pairs
of stars that orbit for millions of years.

**The condition.** Synthesis with one pixel needs the source to keep its phase, against the clock, while the pixel
moves. The time over which a wave keeps its phase is its **coherence time** $\sym{coherence-time}{\tau_c}$, in seconds:
the [correlation time](/tutorial/noise/random-signals/#a-noisy-record-is-a-random-function-of-time) of section 3.2,
applied to the field. By the
[Wiener–Khinchin relation](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies)
of section 3.2, the field's autocorrelation is the Fourier transform of its spectrum, and by the
[uncertainty relation](/tutorial/outside/fourier/#on-an-endless-line-the-sum-becomes-an-integral) of section 2.6 the
widths of a pattern and its transform multiply to about one for a smooth spectrum with one hump. So a spectrum spread
over a range $\Delta\omega$ of angular frequencies gives

$$\tau_c \approx \frac{1}{\Delta\omega} .$$

**Thermal radiation.** The glow of a warm body spreads over angular frequencies from near zero to several times
$\kB T/\hbar$, with $T$ the temperature in kelvin, $\kB$ Boltzmann's constant and $\hbar$ the reduced Planck constant;
its spectrum peaks at $2.82\,\kB T/\hbar$ (Part 10 derives it). So its coherence time is of order $\hbar/\kB T$. At 293 K
this is

$$\frac{1.055 \times 10^{-34}\unit{J\,s}}{1.381 \times 10^{-23}\unit{J\,K^{-1}} \times 293\unit{K}} = 2.6 \times
10^{-14}\unit{s} ,$$

about $3 \times 10^{-14}$ s at room temperature. A pixel carried one millimetre at a metre per second
takes $10^{-3}$ s, about $4 \times 10^{10}$ coherence times. At each new place it meets a wave whose phase is unrelated
to the last, so one moving pixel cannot image thermal light.

**Pairs are enough.** The image is a mean square, and the square of a sum is a sum over pairs. For a record of any
kind, with $\tau_p = \hat n'\cdot\vect x_p/c$ the delay of the pixel $p$ and the angle brackets the average over time,

$$\begin{aligned}
I(\hat n') &= \Bigl\langle\Bigl(\sum_pu_p(t - \tau_p)\Bigr)^2\Bigr\rangle\\
&= \sum_p\sum_q\bigl\langle u_p(t - \tau_p)\,u_q(t - \tau_q)\bigr\rangle .
\end{aligned}$$

Each term needs the records of only two pixels, $p$ and $q$, taken at the same time once the delays are undone. A
source that glows steadily is **stationary** (section 3.2), so each term has the same value whenever it is measured,
and two pixels that record together can be moved from one pair of places to the next, measuring the terms one pair at a
time. The terms with $p = q$ are each pixel's own mean power, all that one pixel alone can measure. Radio astronomers image thermal sources in this way: the Earth's turning carries pairs of dishes,
recording together, through the separations of a far wider dish over many hours. So
thermal radiation needs pixels recording together, at least in pairs, and different pairs may record at different times.

In the near field there are no delays to undo: its image comes from the inversion of the near field, which Part 3 builds.

::: try {#delay-and-sum}
A row of pixels on the floor of a half-circle, with the crests of a plane wave arriving from the direction $\theta$
that you drag. Beneath, the pixels' records, the same records delayed for the steered direction $\theta'$, and their
sum; below that, the image $I(\theta')$, with a copy marked by its order $m$. The sliders set the number of pixels and
their spacing $b$, and a switch adds a second equal source, in step or out of step. Press on the image to steer there,
or choose a handle with Tab and use the arrow keys.

Answer the predictions at the top of the figure, then do what each asks. Afterwards, move the second source until the
pair out of step first shows a dip of a fifth, and compare its separation with the one the pair in step needs.
:::

## Pulsars across the Galaxy make an array a thousand parsecs wide

A **pulsar** is a turning neutron star whose beam sweeps the Earth once a turn, so that its pulses arrive as regularly
as the ticks of a clock (section 12.1). A **pulsar timing array** times dozens of them. We want what a gravitational
wave does to the arrival of the pulses, and how sharply such an array can place a source. We use one fact from Part 7:
in the coordinates in which free bodies stay at fixed places, a wave of strain $\field h_{ij}(t - \hat k\cdot\vect x/c)$,
travelling along the unit vector $\hat k$, lengthens each small step $\dd s$ of a path along the unit vector $\hat p$ by
$\tfrac12\field h_{ij}\hat p_i\hat p_j\,\dd s$ ([section 7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)). We assume
that **the wave is weak**, so that we keep first order in $\field h$, and **plane**.

**The delay.** A pulsar lies at the distance $L$ along $\hat p$. A pulse that reaches the Earth at the time $t$ passed
the point at the distance $s$ from the Earth at $t - s/c$, where the wave's argument is $t - s(1 + \mu)/c$, with $\mu =
\hat k\cdot\hat p$. So the wave delays it by

$$\Delta T(t) = \frac{\hat p_i\hat p_j}{2c}\int_0^L\field h_{ij}\Bigl(t - \frac{s(1 + \mu)}{c}\Bigr)\dd s .$$

We differentiate with respect to $t$. Under the integral $\partial_t\field h = -[c/(1 + \mu)]\,\partial_s\field h$, so
the integral of a derivative leaves its two ends:

$$\boxed{\;\frac{\dd\Delta T}{\dd t} = \frac{\hat p_i\hat p_j}{2(1 + \hat k\cdot\hat p)}\Bigl[\field h_{ij}(t) - \field
h_{ij}\Bigl(t - \frac{L(1 + \hat k\cdot\hat p)}{c}\Bigr)\Bigr]\;} ,$$

a pure number, the fraction by which the pulses come late. The first term is the wave at the Earth now, the **Earth
term**, the same for every pulsar but for the geometric factor. The second is the wave at the pulsar when the pulse
left it, the **pulsar term**.

**The spin-two response.** Let the source lie in the direction $\hat n = -\hat k$, and the pulsar at the angle $\alpha$
from it and the angle $\varphi$ around it. For the polarization $\field h_{ij} = h\,(\vect e_1\vect e_1 - \vect e_2\vect
e_2)_{ij}$ with $\vect e_1$ and $\vect e_2$ across $\hat n$, $\hat p_i\hat p_j\field h_{ij} = h\sin^2\alpha\cos2\varphi$,
and $1 + \hat k\cdot\hat p = 1 - \cos\alpha$. Since $\sin^2\alpha = (1 - \cos\alpha)(1 + \cos\alpha)$, the Earth term
responds with the weight

$$\frac{\sin^2\alpha}{2(1 - \cos\alpha)}\cos2\varphi = \cos^2\tfrac{\alpha}{2}\,\cos2\varphi .$$

The response changes sign twice as $\varphi$ goes once round the source, the pattern of a stretch along one axis and a
squeeze across it: this is the wave's spin two seen on the sky. It is largest for pulsars near the source and zero for
a pulsar opposite it. The pattern alone places a source only to within the spacing of the pulsars on the sky, tens of
degrees.

**The resolution.** The pulsar term runs behind the Earth term by the phase $kL(1 - \cos\alpha)$, with $k$ the
wavenumber. A small change $\delta\alpha$ of the source's direction changes it by $kL\sin\alpha\,\delta\alpha$. If the
pulsar's distance is known to better than a wavelength, the phase is read to about $1/\rho$, and the direction to

$$\delta\alpha \approx \frac{1}{\rho}\,\frac{\lambda}{2\pi L\sin\alpha} ,$$

the sharpness $\lambda/D$ of an aperture as wide as the pulsar's distance across the line of sight, $D = L\sin\alpha$,
improved by the signal-to-noise ratio as a centroid is. Boyle and Pen (2012) [@BoylePen2012] showed that a pulsar timing
array is an imaging telescope in this sense, with a resolution of about $(1/\rho)(\lambda/L)$ when the distances are
known; with poorly known distances it is about $(1/\rho)\sqrt{\lambda/L}$, and $N$ pulsars characterize up to $2N/7$
sources in each band of frequencies one over the length of the record wide. **A number.** At 10 nHz the wavelength is
$c/f = 3.0 \times 10^{16}\unit{m}$, about a parsec, and for pulsars a thousand parsecs away $\lambda/2\pi L = 1.5
\times 10^{-4}$ radians, half a minute of arc at $\rho = 1$. Most pulsar distances are known only to about a tenth,
far worse than a parsec, so this sharpness waits for better distances.

::: history
### Huygens, Fresnel and Kirchhoff

Christiaan Huygens described light in his *Traité de la lumière* (1690) as a disturbance in which each point of a front
sends out a small wave of its own. Augustin Fresnel added that the wavelets interfere, in the memoir that won the French
Academy's prize of 1818–19, and so explained the bands at the edge of a shadow. Gustav Kirchhoff derived the principle
from the wave equation in 1882. Martin Ryle and his colleagues at Cambridge developed aperture synthesis in the 1950s
and 1960s; Ryle shared the Nobel Prize in Physics of 1974 for it.
:::

**The idea to keep: an array forms a picture by shifting each pixel's record by the delay for a chosen direction and
adding, so that waves from that direction add in step and others cancel. The result is the transform of the array's
layout, so its sharpness is its width in wavelengths, $\lambda/D$, whatever its sensitivity. Gaps wider than half a
wavelength make copies, near sources need focusing, and sources in step blur more.**

::: problems
### Practice

**[5.3]** Why must the pixels be no more than half a wavelength apart for the array to be steered anywhere?

::: solution
Two directions whose values of $\sin\theta$ differ by $\lambda/b$ give the same records, so a wider spacing shows
copies. Since $\sin\theta$ can differ by as much as 2, only $\lambda/b \ge 2$ keeps every copy out of view.
:::

**[5.3]** A round array 30 m across records waves 1 m long. How wide is its image of a point at half height? About how many
pixels does it need on a square grid half a wavelength apart, and how many directions does it resolve per steradian?

::: solution
The width is 30 wavelengths, so the half height lies at $\sin\theta = 1.616/30\pi$ and the full width is 1.97°, which
$1.03\lambda/D$ also gives. A square grid $0.5$ m apart over a square 30 m wide needs $(2D/\lambda)^2 = 3600$ pixels; the disc needs $\pi/4$ of
them, about 2800. The resolved directions number about $(D/\lambda)^2 = 900$ per steradian; the disc's area gives the
closer count $A/\lambda^2 = 707$.
:::

**[5.3]** By how much does the Sun brighten, on its axis, waves of 1 kHz and of 8 kHz arriving from directly behind
it, if it acts as a point mass?

::: solution
$w = 8\pi G\matter Mf/c^3$ is $0.124$ at 1 kHz and $0.99$ at 8 kHz, so [](#eq:point-lens) gives $\pi w/(1 - e^{-\pi
w}) = 1.21$ and $3.3$. Only near $c^3/8\pi G\matter M = 8.1\unit{kHz}$ and above does the brightening become large.
:::

**[5.3]** The array 1.5 m across at 10 cm reads a source at 225 m with a signal-to-noise ratio of 1000. How well does
it measure the distance? A pulsar lies $90°$ from a wave's source: with what weight does its Earth term respond, and
what of a pulsar directly behind the Earth as seen from the source?

::: solution
$\sigma_r/r \approx (4/\pi)\,\lambda r/\rho D^2 = 1.27 \times 0.1 \times 225/(1000 \times 2.25) = 1.3\%$. At $\alpha =
90°$ the weight is $\cos^245° = \tfrac12$ times $\cos2\varphi$. A pulsar opposite the source has $\alpha = 180°$ and
weight zero: the wave runs along the line to it, and a wave moves nothing along its own direction.
:::

### Stretch

**[5.3]** Two pixels half a wavelength apart along $x$ record one source at the angle $\theta$, with $\psi =
\pi\sin\theta$. Find the noise subspace and show that MUSIC finds the source and no other direction.

::: solution
The steering vector is $\mathbf a(\theta) = (1, e^{-i\psi})$. With $K = 1$ and $M = 2$ the noise subspace holds one
vector, perpendicular to it: $\mathbf e = (1, -e^{-i\psi})/\sqrt2$, since $\mathbf e^\dagger\mathbf a = (1 -
e^{i\psi}e^{-i\psi})/\sqrt2 = 0$. For a trial angle $\theta'$, $\mathbf e^\dagger\mathbf a(\theta') = (1 -
e^{i(\psi - \psi')})/\sqrt2$, which vanishes only when $\psi'$ differs from $\psi$ by a multiple of $2\pi$. Both lie
between $-\pi$ and $\pi$, so only $\theta' = \theta$ qualifies (apart from the two horizons, which share one steering
vector at this spacing).
:::

**[5.3]** Combine this section with section 3.8. At $\SNR = 10^3$, compare the bits per steradian of the array 1.5 m across at
10 cm with the near field's bits per patch of side $z$. Then say how each number grows when $\SNR$ rises to $10^6$.

::: solution
The array resolves about 225 directions per steradian, each with about $\log_2 10^3 = 10$ bits: about 2200 bits per
steradian. Section 3.8 gives 38 bits per patch of side $z$, which seen from the height $z$ covers about 0.8 steradians.
The wave camera holds more because its wavelength sets the size of its patches, while in the near field the depth $z$
does. At $10^6$ the wave camera's bits double, to about 4500, because only the logarithm grows; the near field's grow
from 38 to 201 (section 3.8), by a factor of 5.3, because the number of its patterns grows too.
:::

### The camera

**[5.3]** Reproduce the three widths of Figure [](/paper/#fig:array) from the Airy pattern of section 3.6 and the rule
$\Delta\theta \approx \lambda/D$, and check the thermal coherence time of about $3 \times 10^{-14}$ s at room temperature.

::: solution
The intensity of a round aperture's image is $(2J_1(x)/x)^2$ with $x = \pi D\sin\theta/\lambda$, and it falls to half
at $x = 1.616$. So the half width is $\arcsin(1.616\,\lambda/\pi D)$. For $D/\lambda = 2$, 5 and 30 this is 14.9°,
5.91° and 0.983°, and the full widths are 29.8°, 11.8° and 1.97°. The rule gives 28.6°, 11.5° and 1.91°, about 3% less,
the factor 1.03. For the coherence time,
$\hbar/\kB T = 1.055 \times 10^{-34}/(1.381 \times 10^{-23} \times 293) = 2.6 \times 10^{-14}$ s.
:::
:::

::: paper
- [*The computed image*](/paper/#par:the-computed-image) (Section VII): [](/paper/#eq:beam), [](/paper/#eq:diffraction)
  and Figure [](/paper/#fig:array); aperture synthesis with one moving pixel; the thermal coherence time.
- [*What a lens would add*](/paper/#par:what-a-lens-would-add) (Section VII): classically, nothing an ideal array lacks.
- [*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave) (Section V): the detail $\lambda r/D$,
  the Fresnel zone, and the coherent pair's $1.4\,\lambda r/s$; Figure [](/paper/#fig:which-way).
- [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image) (Section IV): the wave
  camera's $(D/\lambda)^2$ directions of $\log_2\SNR$ bits each.
:::

::: deeper
- The [GR course, section 18.8](https://neovand.github.io/general-relativity/chapter-18.html#18-8-a-real-event-that-turned-these-symbols-into-data)
  follows a real gravitational wave timed at two detectors: an array of two pixels and its one delay.
- A. R. Thompson, J. M. Moran and G. W. Swenson, *Interferometry and Synthesis in Radio Astronomy* (3rd edition,
  Springer, 2017), chapters 1, 2 and 5; M. Born and E. Wolf, *Principles of Optics* (7th edition, Cambridge, 1999),
  sections 8.3 to 8.5 and 10.1: delay and sum, aperture synthesis and coherence, and the Huygens–Kirchhoff integral.
:::

[^point-lens]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, in
    [*The transparent Sun as a lens*](/paper/#par:the-transparent-sun-as-a-lens).

[^music]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, in
    [*One pixel and many*](/paper/#par:one-pixel-and-many), which counts $5N - 1$ sources for $N$ pixels of the tide.

[^range]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, in [*Depth*](/paper/#par:depth).

[^parseval]: [Parseval's theorem](/tutorial/outside/fourier/#the-power-of-a-pattern-is-the-same-counted-point-by-point-or-ripple-by-ripple)
    of section 2.6, applied to the transform of the opening, makes this exact for an opening of any shape.

[^beam]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VII, as its equation
    [](/paper/#eq:beam) and the sharpness [](/paper/#eq:diffraction), with its Fig. [](/paper/#fig:array).

[^larger]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, in its paragraph on a source larger
    than its wave.

[^coherent]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, in the same paragraph.

[^I]: This $I$ is not the Stokes $I$ of section
    [5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes).

[^mirror]: A flat array of pixels that record one number each cannot tell a source from its mirror image in the array's
    plane, which gives the same delay at every pixel. The pixels also record the magnetic part of the tide, $\sym{magnetic-tide}{\curv{\tB}}_{ij}$ (section
    [R1](/tutorial/newton/reading-section-ii/#an-ideal-pixel-reads-ten-numbers-and-must-not-turn); $\epsilon_{ipq}$ is
    the Levi-Civita symbol of section 1.1), and summing $\tfrac12(\curv{\tE}_{ij} + \epsilon_{ipq}\hat
    n_p\curv{\tB}_{qj})$ in place of $\curv{\tE}_{ij}$ keeps a wave from $\hat n$ and cancels one from $-\hat n$
    exactly (section
    [7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)). But the mirror
    image of $\hat n$ is $-\hat n$ only on the axis. For a source at the angle $\alpha$ from the axis, the mirror wave
    keeps $\sin^8\alpha$ of its power: $2 \times 10^{-4}$ at 20°, 6% at 45° and 61% at 70°.

[^b]: Not the strength of a point source of section 5.2. We do not write $d$ for the spacing, because Part 3 writes $d$
    for the array's datum $-\curv{\tE}_{zz}$.

[^count]: The count follows from the
    [count of ripples](/tutorial/outside/fourier/#an-area-holds-a-countable-number-of-ripples) of section 2.6. The sum
    $\mathcal A_{\hat n'}$, as a function of the two components of $\hat n'$ across the axis, is a sum of ripples whose
    wavevectors are $k\vect x_p$, and these fill a region of area $k^2A$. That rule gives
    $k^2A/(2\pi)^2 = A/\lambda^2$ independent values per unit of area in that plane, which near the axis is a steradian.
