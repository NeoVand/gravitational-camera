---
id: '5.3'
title: 'Diffraction, resolution and arrays of sensors'
question: 'The paper''s camera makes its image "by undoing those delays and adding", with the sharpness $\Delta\theta \approx \lambda/D$ of any aperture. How does adding delayed records make a picture, and why can no array do better than its width in wavelengths?'
part: '5'
requires: ['2.6', '3.2', '3.6', '3.8', '5.1', '5.2']
paper: [sec:no-lens, eq:beam, eq:diffraction, fig:array, sec:waves, fig:which-way, sec:near-field, sec:one-pixel]
figures: [fig:array, fig:which-way]
live: [array, delay-and-sum]
depth: A
---

The paper's [Section VII](/paper/#sec:no-lens) asks whether anything can focus gravitational waves as glass focuses
light, and finds that nothing practical can. Its answer, in [*The computed image*](/paper/#par:the-computed-image), is
that "the camera does not need optics". A light sensor registers only the energy that arrives, but a gravitational
pixel registers the field itself, with its phase. A wave from one direction reaches the pixels at slightly different
times, and the paper makes its image "by undoing those delays and adding":

{{paper eq:beam}}

The paper then says that the sharpness is that of any aperture of width $D$, about the wavelength divided by $D$, and
its Figure [](/paper/#fig:array) draws the image of one distant source for arrays 2, 5 and 30 wavelengths wide. So we
ask how adding delayed records makes a picture, and why no array can do better than its width in wavelengths. The answer
also keeps promises made by two earlier chapters. Chapter
[3.6](/tutorial/noise/bessel-and-airy/#a-lens-draws-a-star-as-the-square-of-that-pattern) used Fraunhofer diffraction
without deriving it from the wave equation, and left out the factor that sets the brightness. Chapter
[3.8](/tutorial/noise/bits/#sensitivity-buys-more-patterns-and-more-bits-in-each-so-the-bits-grow-as-the-cube-of-its-logarithm)
counted the directions a wave camera resolves without deriving the count.

::: plain
A gravitational pixel records the wave itself, crest by crest, not only how much energy arrives. A wave that comes from
one direction reaches the pixels of an array one after another, a little earlier at the pixels nearer to its source.
To make the picture for that direction, the camera shifts each pixel's record back by the delay that belongs to the
direction, and then adds the records. A wave from that direction then adds up in step at every pixel. A wave from
another direction arrives with other delays, so its shifted records are out of step and largely cancel.

The result has the same shape as the picture a lens makes, and its sharpness is set in the same way. Two directions can
be told apart when they differ by more than about the wavelength divided by the width of the array. The sensitivity of
the pixels does not change this. Gaps between pixels wider than half a wavelength make false copies of the picture. A
source close to the array needs delays measured from each of its points. Two sources that oscillate in step are harder
to separate than two that do not.
:::

## Beyond an opening, a wave is a sum of wavelets from every point of it

We want the wave beyond an opening in a screen, because the opening of a lens and the width of an array shape a
picture in the same way, and because chapter 3.6 assumed the answer. A wave of one angular frequency $\omega$ arrives
at a flat screen from one side, and the screen has an opening of area $A$, in square metres. As in chapter
[5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1),
we write the field as $\sym{wave-field}{u} = \mathrm{Re}[\tilde u(\vect x)\,e^{-i\omega t}]$, where the complex
amplitude $\tilde u$ has the unit of $u$ and holds the size and the phase of the oscillation at the place $\vect x$.

**A wavelet.** Chapter 5.2 found that a blow at one point sends out the field
$\delta(t - R/c)/4\pi R$ at the distance $R$. A point source that oscillates at the frequency $\omega$ sends out the
transform of this in time, $\int\delta(t - R/c)\,e^{i\omega t}\,\dd t/4\pi R = e^{ikR}/4\pi R$, where
$\sym{wavenumber}{k} = \omega/c$ is the wavenumber in $\mathrm{m^{-1}}$. A spherical wave of this form, sent out from
one point, is a **wavelet**.

**The principle.** Every point of the opening sends out a wavelet, with a strength in proportion to the wave that
arrives there, and the wave beyond the opening is the sum of these wavelets. This is **Huygens's principle**. We write
it with a constant $C$ to be found:

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
u(P)$ has the unit of $\tilde u$. The factor $1/i = e^{-i\pi/2}$ shifts every wavelet by a quarter cycle. It is needed
because the sum of the wavelets alone comes out a quarter cycle out of step with the plane wave, as the factor $i$ in
the sum above shows.

::: gap
This sketch assumes Huygens's principle and fixes its constant by one test. Kirchhoff (1882) derived it from the wave
equation, with Green's second identity of chapter
[2.1](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other) applied to the
field and the wavelet over the region beyond the screen. His result has an extra factor $\tfrac12(1 + \cos\chi)$, where
$\chi$ is the angle between the wavelet's direction and the axis, and this factor is 1 at small angles. Kirchhoff's
assumption fails within about a wavelength of the rim, so the formula is good for openings many wavelengths wide and
poor for openings near a wavelength across.
:::

**Far away, the transform of the opening.** Put $P$ at the distance $r$ from the centre of the opening, in the direction
of the unit vector $\hat m$ at a small angle $\theta$ from the axis. As in chapter
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source), $R \approx r - \hat
m\cdot\vect a$ in the phase, as long as $r \gg D^2/\lambda$ for an opening of width $D$, the far field of chapter 3.6;
in the denominator $R \approx r$. A plane wave arriving straight on has $\tilde u = \tilde u_0$ on the opening, so

$$\tilde u(P) \approx \frac{\tilde u_0\,e^{ikr}}{i\lambda r}\int_{\rm opening}e^{-ik\hat m\cdot\vect a}\,\dd^2a .$$

The integral is chapter 3.6's transform of the opening, at the wavenumber $k\sin\theta = 2\pi\sin\theta/\lambda$ along
the tilt. This is Fraunhofer diffraction, now derived from the wave equation, with its factor in front.

**The brightness on the axis.** The energy that a wave carries across each square metre per second, its **intensity**,
is proportional to $|\tilde u|^2$ (chapter
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed)). On the axis every point of the
opening is at the same phase, the integral is the area $A$, and the intensity there is a fixed fraction of the
intensity that arrives:

$$\boxed{\;\frac{|\tilde u(P)|^2}{|\tilde u_0|^2} = \frac{A^2}{\lambda^2r^2} .\;} \label{eq:axis}$$

This is the factor that chapter 3.6 left out. The fraction $A^2/\lambda^2r^2$ is a pure number, as it must be.

**A number.** Take a round opening 1.5 m across, with $A = 1.77\unit{m^2}$, and waves 10 cm long, the sizes of the
paper's Figure [](/paper/#fig:which-way). Its far field begins near $D^2/\lambda = 22.5$ m. At 225 m on the axis,
[](#eq:axis) gives $1.77^2/(0.1^2 \times 225^2) = 0.0062$ of the arriving intensity. The central spot there has a first
dark ring of radius $1.22\lambda r/D = 18.3$ m (chapter 3.6), so the power that passed an opening 0.75 m in radius is
spread over a spot 24 times wider. Formula [](#eq:axis) would exceed 1 closer than $r = A/\lambda = 17.7$ m, but that
lies inside the far-field distance, where only the full sum [](#eq:huygens) holds.

**A check: the energy is kept.** The power through the opening is the arriving intensity times $A$. Far beyond it, the
central spot is about $\lambda r/D$ wide in each of two directions, so its area is about $\lambda^2r^2/D^2$, which is
about $\lambda^2r^2/A$. By [](#eq:axis) the intensity there is $A^2/\lambda^2r^2$ times the arriving one, so the power
that crosses the spot is about the arriving intensity times $(A^2/\lambda^2r^2)(\lambda^2r^2/A) = A$. Every watt that
passed the opening arrives.[^parseval]

**What it means.** Beyond an opening the wave is the sum of wavelets from its points, and far away that sum is the
transform of the opening, its brightness set by the area of the opening in square wavelengths.

## Delaying and adding the records of many pixels points the array

We want the picture that an array of pixels makes when the records are delayed and added. An **array** is a set of
pixels spread over a region, the pixel numbered $p$ at the place $\sym{pixel-position}{\vect x_p}$, in metres, and the
region they cover is its **aperture**. We assume that **each pixel records one number, the field $u$ at its place**
(the paper's pixels record a table, which we come to at the end of this section) and that **the source is far away**,
so that its wave reaches the array as a plane wave. A later section drops the second assumption.

**The delays.** Let $\sym{look-direction}{\hat n}$ be the unit vector from the array toward the source. This is the
convention of the paper's Section VII, and it reverses chapter 5.2's, where $\hat n$ pointed from a source toward the
field point. A camera forms its picture as a function of the direction in which it looks, so its $\hat n$ points that
way. The wave travels along $-\hat n$, so by chapter
[5.1](/tutorial/waves/wave-equation/#any-shape-travels-without-changing) it has the form

$$u(\vect x, t) = F\Bigl(t + \frac{\hat n\cdot\vect x}{c}\Bigr) ,$$

where $F$ is the record at the origin, in the unit of $u$. A crest keeps a fixed value of $t + \hat n\cdot\vect x/c$,
so as $t$ grows, $\hat n\cdot\vect x$ falls, and the crest moves along $-\hat n$, away from the source. The pixel at
$\vect x_p$ records $u_p(t) = F(t + \hat n\cdot\vect x_p/c)$: it sees each crest earlier than the origin by
$\hat n\cdot\vect x_p/c$, because it is nearer to the source by $\hat n\cdot\vect x_p$ (Figure [](#fig:das-delays)).

![Look first at the slanted line through the crests of the records on the right: each pixel hears the wave
earlier by its extra closeness to the source, $\hat n\cdot\vect x_p/c$. Shifting each record by that delay lines the
crests up, and the records add in step. Geometry exact; the records are schematic.](tut-das-delays){#fig:das-delays}

**Delay and sum.** To make the picture for a chosen direction $\sym{steered-direction}{\hat n'}$, the camera shifts
each record later by the delay that belongs to $\hat n'$ and adds:

$$\begin{aligned}
S(t) &= \sum_pu_p\Bigl(t - \frac{\hat n'\cdot\vect x_p}{c}\Bigr)\\
&= \sum_pF\Bigl(t + \frac{(\hat n - \hat n')\cdot\vect x_p}{c}\Bigr) .
\end{aligned}$$

This is **delay and sum**, or **beamforming**. Choosing $\hat n'$ is called **steering** the array. When
$\hat n' = \hat n$, every term is $F(t)$ and the sum is $N$ times the record of one pixel, where $N$ is the number of
pixels. For any other direction the records are shifted by different amounts and partly cancel.

**One frequency.** Let the wave have one frequency, $F(t) = \mathrm{Re}[\tilde u\,e^{-i\omega t}]$. A shift of the
time by $\tau$ multiplies $e^{-i\omega t}$ by $e^{-i\omega\tau}$, and $\omega/c = k$, so

$$\begin{gathered}
S(t) = \mathrm{Re}\Bigl[\tilde u\,e^{-i\omega t}\,\mathcal A_{\hat n'}(\hat n)\Bigr],\\
\sym{steered-array-factor}{\mathcal A_{\hat n'}}(\hat n) = \sum_pe^{-ik(\hat n - \hat n')\cdot\vect x_p} .
\end{gathered}$$

The picture is the mean square of the sum over a cycle. For any complex number $Z$, the mean of
$(\mathrm{Re}[Z\,e^{-i\omega t}])^2$ over a cycle is $\tfrac12|Z|^2$, because $\cos^2$ averages to one half. So the
image in the direction $\hat n'$ is

$$\boxed{\;\sym{beam-image}{I}(\hat n') = \tfrac12|\tilde u|^2\,\Bigl|\sum_pe^{-ik(\hat n - \hat n')\cdot\vect
x_p}\Bigr|^2 ,\;} \label{eq:das}$$

in the square of the unit of $u$.[^I] It is largest, $\tfrac12|\tilde u|^2N^2$, when $\hat n' = \hat n$, where every
record adds in step.

**The array factor again.** Turn the pixels into sources, as in chapter
[5.2's array factor](/tutorial/waves/retarded-waves/#many-sources-in-step-add-their-amplitudes), and give them the
phases $\phi_p = -k\hat n'\cdot\vect x_p$, which aim their combined wave at $\hat n'$. Their array factor $\mathcal A$
for the wave they send out along $\hat n$, from the array toward our source, is exactly the sum in [](#eq:das). So an
array receives from each direction as strongly as it would send toward it, a rule called **reciprocity**. The function
$|\mathcal A_{\hat n'}(\hat n)|^2/N^2$, drawn against the direction $\hat n$ of a source for a fixed steering, is the
array's **beam pattern**. Its peak at $\hat n = \hat n'$ is the **main lobe**, and the smaller peaks around it are
**side lobes**.

**A filled aperture.** Let $N$ pixels cover a flat aperture of area $A$ densely and evenly, $N/A$ of them per square
metre, and call the line through its centre at right angles to it the aperture's axis. The sum becomes $N/A$ times an
integral over the aperture, and only the parts of $\hat n$ and $\hat n'$ along the aperture's plane enter
$(\hat n - \hat n')\cdot\vect a$. With the array steered along its axis, so that $\hat n'$ has no part along the plane,
a source at the angle $\theta$ from the axis gives

$$\mathcal A = \frac{N}{A}\int_{\rm aperture}e^{-ik\hat n\cdot\vect a}\,\dd^2a ,$$

the same transform of the opening as in the last section, at the wavenumber $k\sin\theta$. For a round aperture of
diameter $\sym{aperture-width}{D}$, in metres, chapter 3.6's
[disc](/tutorial/noise/bessel-and-airy/#a-round-opening-transforms-to-a-wider-pattern-than-a-slit) gives $\mathcal A =
N\,2J_1(x)/x$ with $x = \pi D\sin\theta/\lambda$, which is $N$ on the axis, as it must be. The image is its square, the
Airy pattern, which falls to half its height at $x = 1.616$. The full width at half height is therefore $2 \times
1.616/\pi = 1.03$ times $\lambda/D$ in radians, which is the paper's estimate of the sharpness:

{{paper eq:diffraction}}

The pattern of an array is the pattern of a lens of the same width, because both add the wave from every point of the
aperture, each with its own delay. Here $\sym{angular-blur}{\Delta\theta}$ is the width of the image of a point, an
angle in radians, as in chapter 3.7 and in the paper's [](/paper/#eq:diffraction).

**Numbers.** With the exact $\sin\theta$, the half height lies at $\sin\theta = 1.616\,\lambda/\pi D$. For arrays 2, 5
and 30 wavelengths wide this gives full widths of 29.8°, 11.8° and 1.97°. The small-angle rule $1.03\lambda/D$ gives
29.5°, 11.8° and 1.97°: the two agree once the array is a few wavelengths wide. These are the widths that the paper's
Figure [](/paper/#fig:array) marks.

{{paper fig:array}}

Look first at the three narrowing curves of the figure: each is the Airy pattern of [](#eq:das) for one width. The
broad curve of the single pixel comes from something else. A pixel that records one number has $|\mathcal A|^2 = 1$
for every steering and cannot tell directions apart at all. The paper's pixel records the ten numbers of the tide's
two tables (chapter [R1](/tutorial/newton/reading-section-ii/#an-ideal-pixel-reads-ten-numbers-and-must-not-turn)),
which a wave from each direction fills in its own proportions, and those proportions alone locate a source to within
some fifty degrees (Part 9 derives the curve).

**The paper's form, stated.** The paper's pixels record the tide $\sym{tidal-tensor}{\curv{\tE}}_{kl}$ of chapter
[1.4](/tutorial/newton/tides/), a table, and Section VII's [](/paper/#eq:beam) delays and adds it exactly as [](#eq:das)
does, with the paper's $\hat n$ in the place of our steered $\hat n'$. Before the sum, the projector
$\sym{tt-projector}{\Lambda_{ij,kl}}(\hat n)$ of chapter
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source) keeps only the part of
the table that a wave from that direction can carry. The squares of all the components are then added and averaged in
time. We state this form; chapter
[7.6](/tutorial/geometry/gravitational-waves/#one-projector-keeps-what-a-wave-can-carry) builds the projector. The paper
also uses the magnetic part of the tide to tell the front of a flat array from its back, which works well only near the
array's axis.[^mirror]

**What it means.** An array forms its picture by computation: the delays turn its records into the sum that a lens
would form with glass, and the width of that sum's peak is set by the width of the array in wavelengths.

::: try {#array}
This is the live version of the paper's Figure [](/paper/#fig:array). The slider sets the width of the array in
wavelengths, $D/\lambda$, and the curve is the image of one distant source against the angle by which the image is
steered away from it. The readout "blur" is the curve's full width at half its height.

Before you move the slider, predict the blur of an array 30 wavelengths wide from the small-angle rule, $1.03 \times
57.3°/30$. Then set the widths 2, 5 and 30. The readouts show 30°, 12° and 2.0°, which are this chapter's 29.8°, 11.8°
and 1.97° rounded to the figure's precision.
:::

## Gaps between pixels make copies of the image

We want to know what the spacing of the pixels does, because a real array has pixels only at some places. Take a row of
$N$ pixels a distance $\sym{pixel-spacing}{b}$ apart, in metres, at $\vect x_p = pb\,\hat x$ for $p = 0, 1, \dots,
N - 1$, the letter of chapter 2.6 and of the paper's Appendix A for the spacing.[^b] Let the source and the steered
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
The side lobes lie between the later zeros; for eight pixels the largest of them reaches 5.3% of the main lobe
(Figure [](#fig:das-lobes)).

**The copies.** The denominator $\sin^2(\psi/2)$ also vanishes at $\psi = 2\pi$, $4\pi$, and so on, and there the
ratio is $N^2$ again: the array responds to these directions as strongly as to the steered one. They are the
**grating lobes**, at

$$\boxed{\begin{gathered}
\sin\theta - \sin\theta' = \frac{m\lambda}{b},\\
m = \pm1, \pm2, \dots
\end{gathered}} \label{eq:lobes}$$

where the whole number $\sym{lobe-order}{m}$ is the order of the lobe.[^m] This is chapter 2.6's
[aliasing](/tutorial/outside/fourier/#an-area-holds-a-countable-number-of-ripples). Along the row a wave from the angle
$\theta$ is a ripple of wavenumber $k\sin\theta$, and two ripples whose wavenumbers differ by $2\pi/b$ take the same
value at every pixel. So at one frequency two directions whose values of $\sin\theta$ differ by $\lambda/b$ give
exactly the same records, and no sum of the records can tell them apart. A wave spread over many frequencies puts the
copies of each frequency in a different place, so its grating lobes are smeared.

**The rule.** The value of $\sin\theta$ runs from $-1$ to 1, so two directions can differ in it by as much as 2. If the
array is to be steered anywhere without a copy of the source appearing in some other direction, the first copy must lie
at or beyond that range, $\lambda/b \ge 2$. So the spacing must satisfy

$$\boxed{\;b \le \frac{\lambda}{2} .\;}$$

At $b = \lambda/2$ exactly, a copy reaches the horizon only when the array is steered to the opposite horizon.

**A number.** Take 16 pixels half a wavelength apart and a source at 20°. Only $m = 0$ fits, and the main lobe is 6.8°
wide at half height. Spread the same pixels to two wavelengths apart. Then copies lie wherever $\sin\theta$ differs from
$\sin20° = 0.342$ by a multiple of $\lambda/b = 0.5$: at $\sin\theta = 0.842$, $-0.158$ and $-0.658$, which are the
angles 57.4°, $-9.1°$ and $-41.1°$. The main lobe is four times narrower, 1.7°, because the row is four times as wide,
but the image now holds four equal sources where there is one.

**How many pixels.** A square array $D$ wide with pixels $\lambda/2$ apart in both directions needs $(2D/\lambda)^2$ of
them. For the array of the paper's Figure [](/paper/#fig:which-way), 1.5 m across at a wavelength of 10 cm, that is
$30^2 = 900$; a round array of the same width needs about $\pi/4$ of that, 707.

![Look first at the dashed curve's extra peaks of full height: with pixels two wavelengths apart, the directions
whose $\sin\theta$ differ by $\lambda/b = 0.5$ give the same records, and the array cannot tell them apart. With pixels
half a wavelength apart (solid) there is only one peak. Curves exact.](tut-das-lobes){#fig:das-lobes}

## An array resolves as many directions as its area holds square wavelengths

We want the number of directions an array can tell apart, because chapter 3.8 compared a wave camera's information
with the near field's using that number. This is an estimate. Two directions are resolved when they are farther
apart than about the width of the main lobe, so the sky divides into **resolved directions**, spots about $\lambda/D$
wide in each of two directions across the line of sight.

**The estimate.** Each spot covers about $(\lambda/D)^2$ steradians, so one steradian holds about

$$\Bigl(\frac{D}{\lambda}\Bigr)^2$$

of them. Chapter 2.6's count of ripples gives the closer count $A/\lambda^2$ per steradian near the axis, for an
aperture of area $A$.[^count] For the array 1.5 m across at 10 cm, $(D/\lambda)^2 = 225$, and the round array's
$A/\lambda^2$ is 177.

**The bits.** Each direction carries one number, the amplitude of the wave from it, read through the noise. Chapter
[3.8](/tutorial/noise/bits/#where-a-ripple-stands-well-above-its-noise-it-carries-log_2-s-bits) found that a number
that stands $s$ times above its noise carries about $\log_2 s$ bits when $s$ is large. With $s$ about the camera's
signal-to-noise ratio $\SNR$, a wave camera holds about

$$\Bigl(\frac{D}{\lambda}\Bigr)^2\log_2\SNR$$

bits in each steradian. At $\SNR = 10^3$, $\log_2\SNR = 10.0$, and the array 1.5 m across holds about
$225 \times 10 = 2200$ bits per steradian. This is the count that chapter 3.8 used without deriving it. The width in
wavelengths fixes the number of directions, and sensitivity only adds bits to each. The near field's bits grow faster,
as $(\ln\SNR)^3$ (chapter 3.8), because there the sensitivity sets the number of patterns too.

## A near source needs the delays from a point

We want to know when the plane-wave delays of the second section are right, and what replaces them when they are not.
They assume that the fronts of the wave are flat across the array.

**The approximation.** A source on the axis at the distance $r$ sends fronts that are spheres. The path from it to a
pixel at the distance $a$ from the centre of the array is longer than the path to the centre by
$\sqrt{r^2 + a^2} - r \approx a^2/2r$. Plane-wave delays leave this out, and at the rim of an array of width $D$, where
$a = D/2$, they miss $D^2/8r$ of path, which is the phase $kD^2/8r = \pi D^2/4\lambda r$. The small parameter is that
phase. The delays are right when it is much less than one radian, that is, when $r \gg D^2/\lambda$ up to a factor near
one: chapter 3.6's [far field](/tutorial/noise/bessel-and-airy/#a-lens-draws-a-star-as-the-square-of-that-pattern).
The distances closer than about $D^2/\lambda$ make up the array's **Fresnel zone**. There the fronts of a source's wave
are curved across the array by a sizeable part of a wavelength, and plane-wave delays fail
(Figure [](#fig:das-fresnel)).

![Look first at the short segment at the right-hand rim of the upper array: a source 4.5 m away curves its fronts
across a 1.5 m array by 0.62 of a wavelength, so plane-wave delays are wrong there and the array must be focused. A
source 225 m away, ten times beyond $D^2/\lambda = 22.5$ m, leaves its fronts flat to a hundredth of a wavelength.
Geometry exact, to scale.](tut-das-fresnel){#fig:das-fresnel}

**Focusing.** In the Fresnel zone the array uses the delays from a point. A wave sent from the point $\vect y$ at the
time $t$ reaches the pixel at $\vect x_p$ at the time $t + |\vect x_p - \vect y|/c$. Reading each record at that time
and adding,

$$S_{\vect y}(t) = \sum_pu_p\Bigl(t + \frac{|\vect x_p - \vect y|}{c}\Bigr) ,$$

lines up every crest that left $\vect y$ together. The image is now a function of a point $\vect y$ in space, not of a
direction, and the array is **focused** on it, as a lens is focused on a near object. Far away, with $\vect y = r\hat
n$, $|\vect x_p - \vect y| \approx r - \hat n\cdot\vect x_p$, and the sum returns to the plane-wave sum.

**A number.** In the paper's Figure [](/paper/#fig:which-way) the speed of light is slowed to 20 cm s⁻¹, so the
waves are 10 cm long, and the array is 1.5 m wide. Its far field begins near $D^2/\lambda = 22.5$ m, while the shelf of
boxes is about 4.5 m away. At the rim, plane-wave delays would miss $0.75^2/(2 \times 4.5) = 0.0625$ m of path, 0.63
of a wavelength, or 3.9 radians of phase. So the figure's Airy spots need an array focused at the shelf's distance, as
chapter 3.6 found.

{{paper fig:which-way}}

Look first at panel (b), where each turning pair of balls is a spot of the width that the second section computes,
3.9° at half height, and the still pair is dark.

**A source larger than its wave.** The paper's
[*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave) says that an aperture wide enough to
resolve such a source "lies in its Fresnel zone, $D^2 \gg \lambda r$". This is the Fresnel zone defined above: the
source is closer to the array than $D^2/\lambda$. The argument takes two lines. The paper's wave-zone formula
[](/paper/#eq:wave-zone) holds far from a source of radius $L$ (chapter
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source)'s letter), at
$r \gg L^2/\lambda$. To show detail on the source, the detail of order $\lambda r/D$ must be smaller than $L$, so
$D > \lambda r/L$. Then

$$\frac{D^2}{\lambda r} > \frac{\lambda r}{L^2} \gg 1 .$$

So any array that shows detail on a source larger than its wave must be focused on it.

## Sources in step blur more than sources out of step

We want to know how close two sources can be and still be told apart, because the paper states that sources in step
need a wider array. This is a numerical result.

**The two cases.** Two equal sources lie a distance $\sym{source-separation}{\Delta y}$ apart, in metres, at the
distance $r$, so that they are $\Delta y/r$ apart in angle. Each alone, with its phase taken as zero, makes an
amplitude pattern across the image, $a_1$ or $a_2$, a real number at each steered direction. If the second source runs
ahead of the first by the phase $\phi$, in radians, its pattern is $e^{i\phi}a_2$, and the image of the pair is in
proportion to

$$|a_1 + e^{i\phi}a_2|^2 = a_1^2 + a_2^2 + 2a_1a_2\cos\phi .$$

If the phases of the two sources wander independently, they are **incoherent**: $\phi$ takes every value equally
often, $\cos\phi$ averages to zero, and the two images add as intensities, $a_1^2 + a_2^2$, as in chapter
[5.2's incoherent addition](/tutorial/waves/retarded-waves/#many-sources-in-step-add-their-amplitudes). If they
oscillate in step, with $\phi = 0$, they are **coherent**: the amplitudes add first, and the image is
$(a_1 + a_2)^2$. Between the two peaks both amplitudes are positive, so the cross term $2a_1a_2$ fills the dip
(Figure [](#fig:das-pair)).

**The inputs and the method.** We take a row aperture of width $D$, whose amplitude pattern is $\sin x/x$ with $x =
\pi D\theta/\lambda$ (chapter 3.6's slit). The pair counts as separated when the image midway between the peaks falls
to 0.8 of the peaks, a dip of a fifth, close to the 0.81 of Rayleigh's rule for a slit (chapter 3.6's history). We
find that separation on the exact patterns.

**The results.** The incoherent pair separates at $\Delta y = 1.01\,\lambda r/D$, and the coherent pair at
$\Delta y = 1.43\,\lambda r/D$, 1.42 times farther apart. This is the paper's "$D \gtrsim 1.4\,\lambda r/s$ for a
separation $s$, against about $\lambda r/s$ for sources that are not", with $s$ for our $\Delta y$: "the familiar
penalty of imaging in coherent light". With Sparrow's criterion of chapter
[3.7](/tutorial/noise/blur-law/#step-7-an-exact-calculation-reproduces-the-papers-table), which asks only that a dip
appear, or with a round aperture, the factor lies between 1.4 and 1.6, so its size depends on the criterion and on the
shape of the aperture. Sources in opposite phase, $\phi = \pi$, cancel midway between them and always show a dip, so
equal phases are the worst case.

![Look first at the middle: the pair out of step (solid) dips to half its peaks there, and the pair in step
(dashed) has its peak there, because their amplitudes add before they are squared. The sources are
$1.2\,\lambda r/D$ apart. Curves exact.](tut-das-pair){#fig:das-pair}

**What it means.** Waves that keep their phases interfere, and between two sources in step the interference is
constructive, so it fills the gap that tells them apart.

## One moving pixel can image a steady source, but thermal light needs pixels that record together in pairs

We want to know whether the pixels of an array must all exist at once, because the paper says that "one pixel carried
across the aperture synthesizes it".

**Synthesis.** For a wave of one frequency, [](#eq:das) uses only the complex amplitude of each record,
$\tilde u\,e^{-ik\hat n\cdot\vect x_p}$ at the pixel $p$. A steady wave keeps these amplitudes for all time. So one
pixel, carried from place to place across the aperture and recording for a while at each, can measure every amplitude
in turn. It reads each phase against a clock that ticks at the wave's frequency, and the clock lets amplitudes read at
different times be compared as if they had been read at once. The sum of [](#eq:das) formed afterwards is the image of
a filled array. This is **aperture synthesis**. A radar flown along a track synthesizes an aperture as long as the
track with one antenna, because its own steady signal lights the scene. The paper adds that the same holds for the
near field and "for pairs of stars that orbit for millions of years".

**The condition.** Synthesis with one pixel needs the source to keep its phase, against the clock, while the pixel
moves. The time over which a wave keeps its phase is its **coherence time** $\sym{coherence-time}{\tau_c}$, in seconds:
chapter [3.2's](/tutorial/noise/random-signals/#a-noisy-record-is-a-random-function-of-time) correlation time, applied
to the field of the wave. By chapter 3.2's
[Wiener–Khinchin relation](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies),
the field's autocorrelation is the Fourier transform of its spectrum. By chapter 2.6's
[uncertainty relation](/tutorial/outside/fourier/#on-an-endless-line-the-sum-becomes-an-integral), the widths of a
pattern and its transform multiply to at least one half, and to about one for a smooth spectrum with one hump. So a
spectrum spread over a range $\Delta\omega$ of angular frequencies gives

$$\tau_c \approx \frac{1}{\Delta\omega} .$$

**Thermal radiation.** The glow of a warm body spreads over angular frequencies from near zero to several times
$\kB T/\hbar$, where $T$ is the temperature in kelvin, $\kB$ Boltzmann's constant and $\hbar$ the reduced Planck
constant. Its spectrum peaks at $2.82\,\kB T/\hbar$ (stated here; Part 10 derives Planck's spectrum). So its width
$\Delta\omega$ is of order $\kB T/\hbar$, and its coherence time of order $\hbar/\kB T$. At 293 K this is

$$\frac{1.055 \times 10^{-34}\unit{J\,s}}{1.381 \times 10^{-23}\unit{J\,K^{-1}} \times 293\unit{K}} = 2.6 \times
10^{-14}\unit{s} ,$$

the paper's "about $3 \times 10^{-14}$ s at room temperature". A pixel carried one millimetre at a metre per second
takes $10^{-3}$ s, about $4 \times 10^{10}$ coherence times. At each new place it meets a wave whose phase has no
relation to the one it met at the last, so one moving pixel cannot image thermal light.

**Pairs are enough.** The image is a mean square, and the square of a sum is a sum over pairs. For a record of any
kind, with $\tau_p = \hat n'\cdot\vect x_p/c$ the delay of the pixel $p$ and the angle brackets the average over time,

$$\begin{aligned}
I(\hat n') &= \Bigl\langle\Bigl(\sum_pu_p(t - \tau_p)\Bigr)^2\Bigr\rangle\\
&= \sum_p\sum_q\bigl\langle u_p(t - \tau_p)\,u_q(t - \tau_q)\bigr\rangle .
\end{aligned}$$

Each term needs the records of only two pixels, $p$ and $q$, taken at the same time once the delays are undone. A
source that glows steadily is **stationary** in chapter 3.2's sense, so each term has the same value whenever it is
measured. So two pixels that record together can be moved from one pair of places to the next, measuring the terms
one pair at a time. The terms with $p = q$ are each pixel's own mean power, which is the same for every steering
$\hat n'$, and they are all that one pixel alone can measure. Radio astronomers image thermal sources in this way: the
Earth's turning carries pairs of dishes, recording together, through the separations of a far wider dish over many
hours. So the paper's sentence that thermal radiation "needs every pixel at the same moment" asks for more than the
sum needs: the pixels must record together in pairs, and different pairs may record at different times.

**What it means.** A steady source can be imaged with time in place of pixels, and thermal light with pairs of pixels
that record together. In the near field, in the paper's words,
"there are no delays to undo": its image comes from the inversion of the paper's Section IV, which Part 3 builds.

::: try {#delay-and-sum}
A row of pixels on the floor of a half-circle, with the crests of a plane wave arriving from the direction $\theta$
that you drag. Beneath, the pixels' records as they arrive, the same records delayed for the steered direction
$\theta'$, and their sum; below that, the image $I(\theta')$ against $\theta'$ from $-90°$ to $90°$, with a copy
marked by its order $m$. The sliders set the number of pixels and their spacing $b$. A switch adds a second equal
source, in step or out of step, and draws each source's own image and the dashed level 0.8 of the peaks. Press on
the image to steer there, or choose a handle with Tab and use the arrow keys (Shift for tenths of a degree). The
readouts give the width of the main lobe, the angles of the copies, the width $D = Nb$ in wavelengths and, with two
sources, their separation in units of $\lambda/D$ and the depth of the dip.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, move
the second source until the pair out of step first shows a dip of a fifth, and compare its separation with the one the
pair in step needs.
:::

::: history
### Huygens, Fresnel and Kirchhoff

Christiaan Huygens described light in his *Traité de la lumière* (1690) as a disturbance in which each point of a front
sends out a small wave of its own, the next front being the envelope of these waves. Augustin Fresnel added that the
wavelets interfere, with their phases, in the memoir on diffraction that won the French Academy of Sciences' prize
competition of 1818–19, and so explained the bands at the edge of a shadow. Gustav Kirchhoff derived the principle from
the wave equation in 1882, in a paper read to the Berlin Academy, with the assumption about the field on the opening
that the gap box of this chapter names. Aperture synthesis was developed by Martin Ryle and his colleagues at Cambridge
in the 1950s and 1960s; Ryle shared the Nobel Prize in Physics of 1974 for it.
:::

::: check
### Q

How wide is the image of a point for a round array 1.5 m across at a wavelength of 10 cm, measured at half height?

### A

The full width at half height is $1.03\lambda/D = 1.03 \times 0.1/1.5 = 0.069$ radians, or 3.9°. This is chapter 3.6's
number for the spots of Figure [](/paper/#fig:which-way).

### Q

Why must the pixels be no more than half a wavelength apart for the array to be steered anywhere?

### A

With a wider spacing, two directions whose values of $\sin\theta$ differ by $\lambda/b$ give exactly the same records
at every pixel, at one frequency, so the array cannot tell them apart and shows a copy of each source: a grating lobe.
Since $\sin\theta$ can differ by as much as 2 between two directions, only $\lambda/b \ge 2$ keeps every copy out of
view.

### Q

Why does a wave camera's information grow only as the logarithm of its sensitivity, at a fixed size?

### A

The number of directions it resolves, about $(D/\lambda)^2$ per steradian, is fixed by its width in wavelengths.
Sensitivity only adds bits to the number read in each direction, about $\log_2\SNR$.

### Q

Why can one moving pixel synthesize an array for a steady source but not for thermal radiation, and what is enough for
thermal radiation?

### A

One pixel compares amplitudes measured at different times, so it needs the source to keep its phase while the pixel
moves. Thermal radiation at room temperature keeps its phase for only about $\hbar/\kB T = 2.6 \times 10^{-14}$ s. The
image is a sum over pairs of pixels of the mean product of their records, so two pixels that record together, moved
from one pair of places to the next, are enough.
:::

**The idea to keep: an array forms a picture by shifting each pixel's record by the delay for a chosen direction and
adding, so that waves from that direction add in step and others cancel. The result is the transform of the array's
layout, so its sharpness is its width in wavelengths, $\lambda/D$, whatever its sensitivity. Gaps wider than half a
wavelength make copies, near sources need focusing, and sources in step blur more.**

::: problems
### Practice

A round array 30 m across records waves 1 m long. How wide is its image of a point at half height? About how many
pixels does it need on a square grid half a wavelength apart, and about how many directions does it resolve in each
steradian?

::: solution
The width is 30 wavelengths, so the half height lies at $\sin\theta = 1.616/30\pi$ and the full width is 1.97°, which
$1.03\lambda/D$ also gives. A square grid $\lambda/2 = 0.5$ m apart over a square 30 m wide would need
$(2D/\lambda)^2 = 3600$ pixels; the disc needs $\pi/4$ of them, about 2800. The resolved directions number about
$(D/\lambda)^2 = 900$ per steradian; the disc's area gives the closer count $A/\lambda^2 = \pi \times 15^2 = 707$.
:::

### Stretch

Combine this chapter with chapter 3.8. At $\SNR = 10^3$, compare the bits per steradian of the array 1.5 m across at
10 cm with the near field's bits per patch of side $z$. Then say how each number grows when $\SNR$ rises to $10^6$.

::: solution
The array resolves about 225 directions per steradian, each with about $\log_2 10^3 = 10$ bits: about 2200 bits per
steradian. Chapter 3.8 gives 38 bits per patch of side $z$. Seen from the height $z$, such a patch spans about one
radian each way, so it covers about 0.8 steradians, and the two counts are over comparable parts of the view. The wave
camera holds more because its wavelength, 10 cm, sets the size of its patches, while in the near field the depth $z$
does. At $10^6$ the wave camera's bits double, to about 4500, because only the logarithm grows; the near field's grow
from 38 to 201 (chapter 3.8), by a factor of 5.3, because the number of its patterns grows too.
:::

### The paper

Reproduce the three widths of the paper's Figure [](/paper/#fig:array) from chapter 3.6's Airy pattern and Section VII's
[](/paper/#eq:diffraction), and check the paper's thermal coherence time, "about $3 \times 10^{-14}$ s at room
temperature".

::: solution
The intensity of a round aperture's image is $(2J_1(x)/x)^2$ with $x = \pi D\sin\theta/\lambda$, and it falls to half
at $x = 1.616$. So the half width is $\arcsin(1.616\,\lambda/\pi D)$. For $D/\lambda = 2$, 5 and 30 this is 14.9°,
5.91° and 0.983°, and the full widths are 29.8°, 11.8° and 1.97°. The rule $\Delta\theta \approx \lambda/D$ gives
28.6°, 11.5° and 1.91°, about 3% less, the factor 1.03. For the coherence time,
$\hbar/\kB T = 1.055 \times 10^{-34}/(1.381 \times 10^{-23} \times 293) = 2.6 \times 10^{-14}$ s, which rounds to the
paper's $3 \times 10^{-14}$ s.
:::
:::

::: paper
- [*The camera does not need a lens*](/paper/#sec:no-lens), the plain words of Section VII, describe delay and sum;
  this chapter's [second section](#delaying-and-adding-the-records-of-many-pixels-points-the-array) derives it.
- [*The computed image*](/paper/#par:the-computed-image) (Section VII): [](/paper/#eq:beam), [](/paper/#eq:diffraction)
  and Figure [](/paper/#fig:array); the front and the back told apart by $\curv{\tB}$, well near the array's axis;
  aperture synthesis with one moving pixel; the thermal coherence time $\hbar/\kB T$, after which pairs of pixels
  recording together are still enough.
- [*What a lens would add*](/paper/#par:what-a-lens-would-add) (Section VII): classically, nothing an ideal array lacks.
- [*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave) (Section V): the detail $\lambda r/D$,
  the Fresnel zone $D^2 \gg \lambda r$, and the coherent pair's $1.4\,\lambda r/s$. Figure [](/paper/#fig:which-way)
  draws the focused array's Airy spots.
- [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image) (Section IV): the wave
  camera's $(D/\lambda)^2$ directions of $\log_2\SNR$ bits each.
- [Section VIII](/paper/#sec:one-pixel) derives the single pixel's view of some fifty degrees in Figure
  [](/paper/#fig:array) (Part 9).
:::

::: deeper
- The [GR course, section 18.8](https://neovand.github.io/general-relativity/chapter-18.html#18-8-a-real-event-that-turned-these-symbols-into-data)
  follows a real gravitational wave timed at two detectors: an array of two pixels and its one delay.
- A. R. Thompson, J. M. Moran and G. W. Swenson, *Interferometry and Synthesis in Radio Astronomy* (3rd edition,
  Springer, 2017), chapters 1, 2 and 5: delay and sum, aperture synthesis with pairs of dishes, and coherence, as radio
  astronomers do them.
- M. Born and E. Wolf, *Principles of Optics* (7th edition, Cambridge, 1999), sections 8.3 to 8.5 and 10.1:
  the Huygens–Kirchhoff integral with Kirchhoff's assumption, and the coherence of light.
:::

[^parseval]: Chapter 2.6's
    [Parseval's theorem](/tutorial/outside/fourier/#the-power-of-a-pattern-is-the-same-counted-point-by-point-or-ripple-by-ripple),
    applied to the transform of the opening, makes this exact for an opening of any shape.

[^I]: This $I$ is the paper's image of [](/paper/#eq:beam). It is not the invariant $\mathrm{tr}\,\mathcal W^2$, the
    Stokes $I$ of chapter [5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes), the moment of inertia of chapter 1.6, or the mutual information $I(x;y)$ of chapter 3.8.

[^mirror]: A flat array of pixels that record one number each cannot tell a source in front of it from the source's
    mirror image in the array's plane, because the two give the same delay at every pixel. The paper's pixels also
    record the magnetic part of the tide, $\sym{magnetic-tide}{\curv{\tB}}_{ij}$ (chapter
    [R1](/tutorial/newton/reading-section-ii/#an-ideal-pixel-reads-ten-numbers-and-must-not-turn); $\epsilon_{ipq}$ is
    the Levi-Civita symbol of chapter 1.1), and the paper sums $\tfrac12(\curv{\tE}_{ij} + \epsilon_{ipq}\hat
    n_p\curv{\tB}_{qj})$ in place of $\curv{\tE}_{ij}$. This keeps a wave from $\hat n$ and cancels a wave from $-\hat
    n$ exactly (chapter
    [7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45) derives the
    relation in a wave that it uses). But the mirror image of $\hat n$ is $-\hat n$ only on the axis. For a source at
    the angle $\alpha$ from the axis, the mirror wave keeps $\sin^8\alpha$ of its power: $2 \times 10^{-4}$ at 20°, 6%
    at 45° and 61% at 70°.

[^b]: The letter $b$ is not the strength of a point source of chapter 5.2 nor the impact parameter of chapter 1.8.
    We do not write $d$ for the spacing, because Part 3 writes $d$ for the array's datum $-\curv{\tE}_{zz}$.

[^m]: The order $m$ is a whole number, not a mass, and not the order of a spherical harmonic of chapter 2.2.

[^count]: The count follows from chapter 2.6's
    [count of ripples](/tutorial/outside/fourier/#an-area-holds-a-countable-number-of-ripples). The sum
    $\mathcal A_{\hat n'}$, as a function of the two components of $\hat n'$ across the axis, is a sum of ripples whose
    wavevectors are $k\vect x_p$, and these fill a region of area $k^2A$. Chapter 2.6's rule gives
    $k^2A/(2\pi)^2 = A/\lambda^2$ independent values per unit of area in that plane, which near the axis is a steradian.
