---
id: R3
title: 'Imaging the locked safe'
question: "How sharp, how precise and how full can a near-field picture be, and what do the readings of a camera 3.5 m away say about a bar of gold in one of two locked safes?"
part: '3'
requires: ['1.3', '1.4', '1.5b', '2.2', '2.3', '2.5', '2.7', 'R2', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9']
paper: [sec:near-field, eq:wiener, eq:cutoff, eq:resolution, tab:resolution, fig:resolution-law, fig:nearfield, eq:handheld, fig:locked-safe, eq:shear-zeros, fig:buried-ruler, eq:capacity-integral, eq:capacity, fig:capacity, eq:hyperbolic, fig:near-field-geometry, app:benchmarks]
figures: [fig:locked-safe, fig:resolution-law, fig:capacity, fig:near-field-geometry]
live: [near-field-blur, which-safe]
---

Two identical steel safes stand 3.5 m in front of a camera of 121 pixels, in an array a metre across, and the
right-hand one holds a bar of gold of 324 kg. How sharp a picture can the camera draw, how precisely can it measure what
it sees, and how many bits can the picture hold?[^iv]

{{paper fig:locked-safe}}

::: plain
Fine detail fades on its way to the camera faster than coarse detail, and the camera must enlarge it again, noise and
all. So the blur of the best picture of an unknown scene shrinks only with the number of digits of the sensitivity:
24° at a signal-to-noise ratio of a thousand, 14° at a million.

A blurred picture can still measure a simple scene precisely: one mass a metre away is placed to a millimetre. The
safes' readings show which safe holds the gold, and because mass is never negative they also weigh it.
:::

## The best picture of a point is the pattern of a round pupil

Take a point mass $\matter m$ at depth $z$ below a flat array. Its peak tide is $2G\matter m/z^3$, in $\mathrm{s^{-2}}$.
The noise is white, with **spatial noise density** $\sym{noise-density}{N_0}$, in $\mathrm{s^{-4}\,m^2}$, so the
average of the readings over a patch of side $z$ has the standard deviation $\sqrt{N_0}/z$
([section 3.2](/tutorial/noise/random-signals/#the-variance-of-noise-spread-over-a-plane-falls-as-one-over-the-area)).
The **signal-to-noise ratio**, the size of a signal over the typical size of its noise, is the ratio of the two,
$\sym{snr}{\SNR} = 2G\matter m/(z^2\sqrt{N_0})$, a pure number. Undoing the fade enlarges signal and noise by the same
factor, because the noise is added at the sensors, after the fade (section 2.7).

A **ripple** is a pattern across the scene with one spacing between its crests, of **wavenumber** $k$, $2\pi$ over that
spacing, in $\mathrm{m^{-1}}$ ([section 2.6](/tutorial/outside/fourier/#across-a-plane-a-ripples-wavevector-points-across-its-crests)).
A point's ripple stands above its own noise by the ratio $\sym{ripple-ratio}{s} = \pi\,\SNR\,kz\,e^{-kz}$, for a
prior of one mass $\matter m$ per area $z^2$
([section 3.7](/tutorial/noise/blur-law/#step-2-each-ripple-stands-above-its-noise-by-a-factor-that-depends-on-two-numbers)).
With $\sym{kz}{q} = kz$, the ratio is 1160 at $q = 1$ and $\SNR = 10^3$. The best linear reconstruction keeps each
ripple with the weight $\sym{wiener-filter}{H}$ of the **Wiener filter**, the linear guess with the smallest mean
squared error ([section 3.5](/tutorial/noise/wiener-filter/#independent-ripples-can-be-filtered-one-at-a-time)):

$$H(k) = \frac{s^2}{1 + s^2}.$$

It vanishes for a uniform scene, $k \to 0$, and is close to one from $kz \approx 1/\pi\SNR$, which is $3.2\times10^{-4}$
at $10^3$, to a little below the **cut-off** $\sym{cutoff}{q_c}$, where it falls through one half. The cut-off is the
larger root of $s = 1$ ([section 3.7](/tutorial/noise/blur-law/#step-3-the-filter-keeps-a-ripple-while-it-stands-above-its-noise)):

$$\begin{gathered}q_c\,e^{-q_c} = \frac{1}{\pi\,\SNR},\\ q_c \approx \ln(\pi\,\SNR) + \ln\ln(\pi\,\SNR).\end{gathered}$$

One step of the iteration $q = \ln(\pi\SNR) + \ln q$ gives 10.14 at $10^3$, against the exact 10.394. A filter that
keeps every ripple inside a circle of wavevectors draws a point as the pattern of a round opening, a **pupil** of
radius $q_c/z$, built from the Bessel function $J_1$: $2J_1(x)/x$ with $x = q_cr/z$
(sections [3.6](/tutorial/noise/bessel-and-airy/#a-round-opening-transforms-to-a-wider-pattern-than-a-slit) and
[3.7](/tutorial/noise/blur-law/#step-5-the-picture-of-a-point-is-the-pattern-of-a-round-opening)). The reconstruction
is a density, linear in the data, so the blur is the **full width at half maximum** of this amplitude, not its square
([section 3.7](/tutorial/noise/blur-law/#step-6-the-blur-is-the-width-of-the-picture-at-half-its-height)). The pattern
falls to half its peak at $x = 2.2151$, so the width is $4.4302\,z/q_c$, and as an angle $\sym{angular-blur}{\Delta\theta}$
seen from the array

$$\Delta\theta = \frac{4.43}{q_c},$$

to within four per cent for every $\SNR \ge 100$: the exact width over $4.43/q_c$ is 0.967 at $10^2$, 0.982 at $10^3$
and 1.000 at $10^{30}$. A single row of sensors over line masses draws $\sin x/x$, half its peak at $x = 1.8955$, so it blurs by $3.79/q_c$
([section 3.5](/tutorial/noise/wiener-filter/#seen-in-space-a-filter-is-a-blur)).

The exact blurs are 23.98° at $\SNR = 10^3$, 14.15° at $10^6$, 3.405° at $10^{30}$ and 1.8° at $10^{60}$. Each factor
of ten in sensitivity raises the cut-off by a little more than 2.3, so the blur depends on roughly how many digits the
ratio has: from $10^6$ to $10^{60}$ the cut-off moves only from 18 to 144. The eye's arcminute would need $10^{6610}$.

{{paper fig:resolution-law}}

For an array at least as wide as the scene is deep, the blur is a fixed angle, independent of distance and of the
array's size. Only the product $kz$ enters, and the space below a flat camera has the geometry that makes this exact
([section 3.9](/tutorial/noise/positivity/#the-space-below-a-flat-camera-is-hyperbolic)).

The gravity satellite GOCE tests the law: at $z = 254\unit{km}$ its map runs out of signal between spherical harmonic
degrees $\ell = 280$ and $300$.[^goce] A pattern of **degree** $\ell$ on a sphere of radius $R = 6371\unit{km}$
has crests about $2\pi R/\ell$ apart, so on the ground $k = \ell/R$ (section 2.2), and

$$\begin{gathered}q_c = \frac{\ell z}{R} = \frac{280 \times 254}{6371} = 11.16\\ \text{to}\quad \frac{300 \times 254}{6371} = 11.96 .\end{gathered}$$

Reading the cut-off equation backwards, $\SNR = e^{q_c}/\pi q_c$ is 2010 to 4160, and $4.43/q_c$ is 22.7° to 21.2°. On the
ground the blur is $4.43\,z/q_c$, 101 to 94 km.

The filter keeps the noise out at a price. For a row of line masses at $10^6$ the blur is $3.79/17.84 = 0.212$ of the
depth, and the picture dips to $-0.211$ of its peak beside each mass; between masses half a depth apart the dips add
to $-0.40$ (section 3.5).

::: try {#near-field-blur}
Predict first: at GOCE's ratio of two to four thousand, will two masses half a depth apart still come out as two peaks?
Set the sensitivity to $10^{3.5}$, about 3200, and watch the middle of panel (b); then try $10^3$.
:::

## Clocks and accelerometers meet the same law, and a small camera does worse

Clocks read the potential and accelerometers its gradient, so over a sheet their kernels go as $q^{-1}e^{-q}$ and
$e^{-q}$, where the tidal camera's goes as $q\,e^{-q}$ (section 2.7). The cut-off condition becomes $q^pe^{-q} =
1/\pi\SNR$, which the iteration $q = \ln(\pi\SNR) + p\ln q$ solves:

| $\SNR$ | clocks, $p = -1$ | accelerometers, $p = 0$ | tides, $p = 1$ |
|---|---|---|---|
| $10^3$ | 6.22 | 8.05 | 10.39 |
| $10^{20}$ | 43.43 | 47.20 | 51.13 |

Each differs from the next by about $\ln q_c$, which is 2.3 at $10^3$ and 3.9 at $10^{20}$. The blur belongs to
Laplace's equation, which every static gravitational field obeys in empty space, not to the detector.

A camera much smaller than its distance from the scene does worse. Inside a camera of width $D$, in metres, the part of
the field of degree $\ell$ changes across the camera by about $(D/2r)^{\ell-2}$ of the quadrupole, for a source at the
distance $r$ (section [2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics)).
Detail of degree $\ell$ therefore needs $\SNR \gtrsim (2r/D)^{\ell-2}$, and

$$\ell_{\max} \approx 2 + \frac{\ln\SNR}{\ln(2r/D)}, \qquad \Delta\theta \approx \frac{\pi}{\ell_{\max}} .$$

For a camera ten centimetres across and a lorry fifteen metres away, $2r/D = 300$, and at $\SNR = 10^6$

$$\begin{gathered}\ell_{\max} = 2 + \frac{\ln 10^6}{\ln 300} = 2 + \frac{13.82}{5.70} = 4.42,\\ \Delta\theta = \frac{\pi}{4.42} = 0.71\ \text{radians} = 40.7° ,\end{gathered}$$

not 14°. A single pixel, $D \to 0$, sees the quadrupole alone, since the ratio $\ln\SNR/\ln(2r/D)$ goes to zero: a pixel
reads only degree two of a still scene (section 2.2).

## One mass is placed to a millimetre, though two are hard to tell from one

How precisely can a scene known to hold one point mass be measured? For an endless plane that
reads $\curv{\tE}_{zz}$ with the noise above, the smallest errors that any unbiased method can reach, the **Cramér–Rao
bounds** with position and mass fitted together, are $\sqrt{2/5}\,z/\mathcal R$ across, $z/\mathcal R$ in depth and
$\sqrt5/\mathcal R$ of the mass, where $\sym{pattern-snr}{\mathcal R} = (\sqrt{3\pi}/4)\SNR$ is the signal-to-noise
ratio of the whole field pattern
([section 3.3](/tutorial/noise/measuring-a-number/#one-mass-a-metre-away-is-placed-to-a-millimetre)). At
$\SNR = 10^3$, $\mathcal R = 767$, and at one metre

$$\frac{0.632 \times 1\unit{m}}{767} = 0.82\unit{mm}, \qquad \frac{1\unit{m}}{767} = 1.3\unit{mm}, \qquad
\frac{2.24}{767} = 0.29\% .$$

The mass is placed to within a millimetre while its image is 24° wide: precision depends on how fast the predicted
readings change when the mass moves, in units of the noise, and every one of the many readings moves a little, while
the blur limits the picture of a scene that might hold anything.

Two equal masses, by contrast, can be told from one only when they are farther apart than about
$z/\sqrt{\mathcal R}$, because the difference they make grows as the square of their separation. The pair and a single
mass at its centre first differ in their quadrupole (sections [3.3](/tutorial/noise/measuring-a-number/#two-masses-are-hard-to-tell-from-one)
and 2.3). At 1 m and $10^3$ the scale is $1\unit{m}/\sqrt{767} = 3.6\unit{cm}$, an order of magnitude only: there the
two scenes predict readings 0.34 noise standard deviations apart. A test that errs one time in six needs them 2 apart,
since the best rule errs 16% of the time when the noise carries the readings one standard deviation, halfway across.
That takes 8.8 cm
([section 3.9](/tutorial/noise/positivity/#positivity-resolves-as-a-power-of-the-sensitivity-not-its-logarithm)).

## The safe is found quickly, but a cautious image cannot weigh it

The steel safes, 1560 kg each, weigh ten times the gold. Along the camera's row the safes' largest reading is
$6.4\times10^{-9}\unit{s^{-2}}$ and the gold's own $6.5\times10^{-10}\unit{s^{-2}}$ (section 1.4). With the empty room
and the safes subtracted, the scene is the bar of $0.3 \times 0.14 \times 0.4\unit{m}$ of gold,
$19{,}300\unit{kg\,m^{-3}} \times 0.0168\unit{m^3} = 324\unit{kg}$.[^code] The array is $11\times11$ pixels $b = 10\unit{cm}$ apart, each reading five components of the tide, so it records 605
numbers, each with noise $\sigma_n$. Each pixel stands for an area $b^2$, so the average over a patch of side $z$ has the noise $\sigma_nb/z$;
setting this equal to $\sqrt{N_0}/z$ gives $N_0 = \sigma_n^2b^2$ and $\SNR = 2G\matter m/z^2\sigma_nb$ (section 3.2).

Asked only which safe holds the gold, the data answer quickly. At $\SNR = 10$ the 605 predicted readings of the two
scenes lie $\sym{scene-separation}{D} = 1.81$ noise standard deviations apart. The best rule picks the safe whose
predictions lie closer to the data, and it errs when the noise carries the data more than halfway across: with the
probability $P(Z > 0.906) = 18.3\%$, where $Z$ is a Gaussian number of mean zero and standard deviation one
([section 3.3](/tutorial/noise/measuring-a-number/#choosing-between-two-scenes-comes-down-to-one-gaussian-number)). The
separation grows in proportion to $\SNR$, so one error in a thousand, $D = 6.18$, needs $\SNR = 34.1$. A sphere of gold
and a point of the same mass give identical readings, since outside a round body only its mass counts (section 1.3);
the bar departs from a point by only 0.58 standard deviations at $\SNR = 10^3$.

Asked instead for an image that assumes little beyond mass lying in the plane of the safes, the same data weigh the
contents of a safe only to within $\pm730\unit{kg}$. This is the **Gaussian image**. It divides the upright plane of the
safes into 231 cells 25 cm apart and gives each a **prior**, what is expected of it before any reading: a Gaussian
spread of 324 kg either way. The **posterior**, the spread of scenes still likely after the readings, comes from the
singular values of the **design matrix**, whose columns are the readings that a kilogram in each cell gives (sections
[3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots) and
[3.5](/tutorial/noise/wiener-filter/#many-unknowns-are-guessed-together-with-the-same-formula)). Summed over the twelve
cells that cover the front of a safe, its standard deviation is 729 kg.

There are two reasons. The first is that the array is a small camera: with $D = 1\unit{m}$ and $r = 3.5\unit{m}$,
$2r/D = 7$ and

$$\begin{gathered}\ell_{\max} = 2 + \frac{\ln 10^3}{\ln 7} = 2 + \frac{6.91}{1.95} = 5.55,\\ \Delta\theta = \frac{\pi}{5.55} = 32.4° ,\end{gathered}$$

or 1.98 m at 3.5 m, wider than the 1.4 m of floor between the safes. The second is that most of the uncertainty lies in
fine patterns of mass that the data do not reach: those that move mass between neighbouring cells. Through them 177 kg
of noise is let in and 707 kg of the prior's doubt is left behind, $\sqrt{177^2 + 707^2} = 729\unit{kg}$ (section 3.5).
A uniform layer, by contrast, is among the best-measured patterns there (section 3.4). The posterior's spread depends on the array and the noise, never on the readings: it is $\pm489$ kg at $10^6$, and
$\pm352$ kg for an array six metres across (section 3.5).

::: derivation
### The worked inversion, as data

**Axes.** The camera is at $(0, 1.5, 0)$ m, with $x$ to the right, $y$ up from the floor and $z$ toward the camera, so the
safes stand at $z = -3.5$ m, their centres at $x = \pm1.1$ m.

**The array.** $11\times11$ pixels $b = 10$ cm apart fill a square a metre across, centred on the camera in the upright
plane $z = 0$ and facing the safes: the pixel $(i, j)$, with $i$ and $j$ from $-5$ to 5, is at $(0.1i,\ 1.5 + 0.1j,\ 0)$
m. Each reads $\curv{\tE}_{xx}$, $\curv{\tE}_{yy}$, $\curv{\tE}_{xy}$, $\curv{\tE}_{xz}$ and $\curv{\tE}_{yz}$; the sixth
entry on the diagonal follows from the zero trace. Each reading carries its own Gaussian noise, independent of the
others, with the standard deviation $\sigma_n = 2G\matter m/(z^2\,\SNR\,b)$ for $\matter m = 324$ kg and $z = 3.5$ m:
$3.53\times10^{-11}\unit{s^{-2}}$ at $\SNR = 10^3$.

**The gold.** A uniform box of density $19{,}300\unit{kg\,m^{-3}}$, 0.30 m along $x$, 0.14 m along $y$ and 0.40 m along
$z$, centred at $(1.1, 0.13, -3.5)$ m: 1.37 m below the array's centre and 3.92 m from it.

**The cells and the design matrix.** Point masses sit at the nodes $x = -2.5, -2.25, \dots, 2.5$ m (21 values) and $y =
0, 0.25, \dots, 2.5$ m (11 values) in the plane $z = -3.5$ m: 231 cells. Column $j$ of the design matrix holds the 605
readings that one kilogram at node $j$ gives, from the tide of a point mass,
$(G/r^3)(\delta_{ij} - 3\hat n_i\hat n_j)$ (section 1.4), divided by $\sigma_n$ to whiten them. A safe's mass is the sum
over the twelve nodes of its footprint, $|x \mp 1.1| \le 0.45$ m and $y \le 0.73$ m: four columns and three rows.

**The prior and the posterior.** Each cell's mass is Gaussian, with mean zero and the standard deviation
$\sigma_m = 324$ kg, independent of the others. Written through the singular values $s_k$ and the patterns $\mathbf v_k$
of the whitened design matrix (section 3.4), the posterior of
[section 3.5](/tutorial/noise/wiener-filter/#many-unknowns-are-guessed-together-with-the-same-formula) has the
covariance $\sum_k\mathbf v_k\mathbf v_k^{\mathsf T}/(s_k^2 + \sigma_m^{-2})$. This form needs only the gains, never the
matrix $A^{\mathsf T}A$, whose eigenvalues span the squares of gains that already span more than sixteen powers of ten (section
3.4), so it stays exact however small the noise. With $\mathbf w$ one on a safe's twelve cells and zero elsewhere, the
safe's mass has the standard deviation $\sqrt{\mathbf w^{\mathsf T}\mathrm{Cov}\,\mathbf w}$: 729 kg at $10^3$, 489 kg at
$10^6$, and 352 kg at $10^6$ for an array six metres across, $11\times11$ pixels 60 cm apart with the same noise
density $N_0 = \sigma_n^2b^2$.

**Three more numbers.** Gold 0.2 m farther back, 4.10 m from the array's centre, and heavier by $(4.096/3.916)^3 =
1.144$, so that the size of its tide at the centre is unchanged, predicts readings 6.9 noise standard deviations from the
true bar's at $10^3$: the two are told apart, with one wrong choice in 3800. Turning the array through $70°$ about the
vertical line through its centre changes only where its pixels are, since each reads the whole tensor in fixed axes. It
separates the readings of gold in the left and in the right safe by 196.9 standard deviations at $10^3$, against 181.1
facing the safes, 9% better; the six-metre array, turned the same way, brings its near edge within 0.28 m of the left
safe, and its separation grows from 797 to 23,600, thirty times, because its nearest pixel is then 0.71 m from the left
bar.[^turned] Appendix [A.1](/tutorial/appendices/numerical-methods/) derives these three and checks each by hand.
:::

## Positivity alone weighs the gold to $315 \pm 20$ kg

The Gaussian image lacks one fact: mass is never negative, so it allows plus five hundred kilograms of gold with minus
five hundred spread round it. Neighbouring cells of $+500$ and $-500$ kg would move the readings by $D = 35$, which the
camera sees plainly. What hides is a scene of three parts whose masses add to nearly zero: $+500$ kg in the safe's
twelve cells, $-903$ kg spread thinly over 111 cells round it, and $+394$ kg over 108 others. It moves the readings by
only $D = 0.17$, and no linear image can forbid it
([section 3.9](/tutorial/noise/positivity/#a-linear-image-cannot-use-the-sign-of-mass)).

**Non-negative least squares** finds the scene with the smallest misfit among those with no negative mass, and uses no
prior ([section 3.9](/tutorial/noise/positivity/#non-negative-least-squares-keeps-only-the-masses-the-data-need)). It
puts $315 \pm 20$ kg in the right safe and $0.3 \pm 2.0$ kg in the left (the mean and the spread over three thousand draws of the noise, made as
[section 3.9](/tutorial/noise/positivity/#non-negative-least-squares-keeps-only-the-masses-the-data-need) describes). At $10^4$ the right safe
holds $327.6 \pm 0.7$ kg; the small excess of 3.3 kg comes mostly from the bar's centre falling between grid points.

A scene made of a few compact masses is resolved down to separations that shrink as a power of the sensitivity, not its
logarithm: among positive scenes, a small measured spread of mass forces the mass to lie near one point, so the
separation that decides one mass or two scales as $z/\sqrt{\mathcal R}$
([section 3.9](/tutorial/noise/positivity/#positivity-resolves-as-a-power-of-the-sensitivity-not-its-logarithm)).
Drawing the two apart improves more slowly, about as the cube root of the sensitivity, from $0.14\,z$ at $10^3$ to
$0.016\,z$ at $10^6$. This is the mathematics of super-resolution of positive sources [@MorgenshternCandes2016], who
proved that positive point sources on a fine grid are recovered stably by a positive fit as long as not too many crowd
together, and of sparse ones [@Donoho1992]. The logarithmic law is the limit for a scene crowded with mass; the
electrostatic analogue, whose charges have two signs, lacks this prior.

## The zeros of the shear give a thin layer's size, with no image at all

One exact feature survives the blur. The **shear** $\sym{shear}{\curv s} = (\curv{\tE}_{xx} - \curv{\tE}_{yy}) + 2i\,\curv{\tE}_{xy}$,
in $\mathrm{s^{-2}}$, holds the part of the tide in the camera's plane that changes a ring's shape as one complex number
([section 1.5b](/tutorial/newton/complex-numbers/#a-tide-across-a-direction-is-one-complex-number-and-turning-the-axes-turns-it-back-by-twice-the-angle)).
Above two equal masses $d$ apart it vanishes at exactly two points, on the perpendicular bisector of the pair and
exactly $d$ apart, whatever the depth. On the bisector $\curv{\tE}_{xy} = 0$ by symmetry, and $\curv{\tE}_{xx} -
\curv{\tE}_{yy}$ is proportional to $y^2 - d^2/4$
([section 1.5b](/tutorial/newton/complex-numbers/#where-the-shear-vanishes-its-axes-make-half-a-turn-round-the-zero)).
Deeper than $\tfrac{\sqrt3}{2}d$ these are the only zeros; a shallower pair has four more off the bisector. For any thin
layer seen from far, the zeros stand at

$$\begin{gathered}w = w_{\mathrm{cm}} \pm i\sqrt{\matter Q_c/\matter M},\\ \matter Q_c = \int\sigma\,(w' - w_{\mathrm{cm}})^2\,\dd^2w' ,\end{gathered}$$

where $\sym{complex-place}{w} = x + iy$ is a place on the camera's plane, $\sigma$ the layer's surface density, in
$\mathrm{kg\,m^{-2}}$ (a bare $\sigma$, not the noise $\sigma_n$), $\matter M$ its mass, $w_{\rm cm}$ its centre of mass
and $\sym{complex-quadrupole}{\matter Q_c}$ its **complex quadrupole**, in $\mathrm{kg\,m^2}$, with an error of order
$(R/z)^2$ for a layer of width $R$ ([section 3.9](/tutorial/noise/positivity/#the-zeros-of-the-shear-survive-the-blur)).
For the pair, $\matter Q_c = \matter md^2/2$ and $\matter M = 2\matter m$, so the zeros are $\pm i\,d/2$, exact. Noise
places each to within about $z^2/2\mathcal Rd$, so the zeros separate two masses once $d$ exceeds about
$z/\sqrt{2\mathcal R}$: 2.6 cm at 1 m and $10^3$.[^ruler]

## Physics outside Part 3 caps the sensitivity near $10^{70}$

A camera that fits within the distance $z$ to the scene without becoming a black hole has a mass below $zc^2/2G$, since
a body of mass $M$ becomes a black hole when it fits inside its Schwarzschild radius $2GM/c^2$ (section 11.1). Its
energy of interaction with a source of mass $\matter M_s$ at the distance $z$ is then below
$G(zc^2/2G)\matter M_s/z = \matter M_sc^2/2$, about $\matter M_sc^2$. If quantum mechanics limits how fast the camera
can tell two scenes apart to a rate set by that energy (section 8.6), then over a time $\tau$

$$\SNR \lesssim \frac{\matter M_sc^2\tau}{\hbar} ,$$

where $\hbar = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck constant. The units check: $\mathrm{kg\,m^2\,s^{-2}}
\times \mathrm{s}/\mathrm{J\,s}$ is a pure number. For a person of 70 kg watched for the age of the universe, $4.35\times10^{17}\unit{s}$,

$$\SNR \lesssim \frac{70 \times (3.00\times10^8)^2 \times 4.35\times10^{17}}{1.055\times10^{-34}} = 2.6\times10^{70} ,$$

about $10^{70}$. There $q_c = 168$ and the blur is 1.51°: a face seen from a metre would be drawn with smudges 2.6 cm wide.

The estimate is generous. A camera of mass $zc^2/2G$ three metres away has $3 \times (3.00\times10^8)^2/(2 \times
6.674\times10^{-11}) = 2.0\times10^{27}$ kg, about Jupiter's, and pulls on the person with $1.5\times10^{16}\unit{m\,s^{-2}}$,
$1.5\times10^{15}$ times $9.81\unit{m\,s^{-2}}$. A camera that pulls no harder than the Earth weighs
$9.81 \times 9/G = 1.3\times10^{12}$ kg, and the ceiling falls with it to $1.7\times10^{55}$, where the blur is 1.91°:
fifteen powers of ten widen the blur by only a quarter.

A mass $m$ behind a wall may be in a superposition of two places a distance $d$ apart, a state that holds both places
at once (section 8.1). The two branches differ in their quadrupole by about $md^2$, because the centre of mass cannot
move (section 2.3), so a perfect camera would be a perfect source of decoherence, a puzzle taken up in section
[13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell).

## A near-field picture holds a few dozen bits for each patch of its scene

How many bits do the data carry about the scene? This is the question Shannon asked of a noisy channel. A real signal
in Gaussian noise with power ratio $s^2$ carries at most $\tfrac12\log_2(1+s^2)$ bits, reached when the signal is itself
Gaussian ([section 3.8](/tutorial/noise/bits/#one-number-read-through-gaussian-noise-carries-at-most-tfrac12log_21-s2-bits)).
The independent ripples contribute $q\,\dd q/2\pi$ real numbers per area $z^2$, and their bits add, so the data hold the
**capacity** $\sym{capacity}{C}$, in bits per area $z^2$
([section 3.8](/tutorial/noise/bits/#a-picture-is-many-ripples-with-independent-noise-and-their-bits-add)):[^cap]

$$C = \frac{1}{4\pi}\int_0^\infty q\,\log_2\!\left(1 + \pi^2\SNR^2 q^2 e^{-2q}\right)\dd q .$$

Where $s > 1$ the logarithm is close to $2\log_2s$. Integrating up to $q_c$ and using $\ln(\pi\SNR) = q_c - \ln q_c$
gives the closed form ([section 3.8](/tutorial/noise/bits/#where-a-ripple-stands-well-above-its-noise-it-carries-log_2-s-bits))

$$C \approx \frac{q_c^3/3 - q_c^2/2}{4\pi\ln 2},$$

to within three per cent for $\SNR \ge 10^3$ and half a per cent beyond $10^{10}$: it is 36.8 against the integral's 37.9
at $10^3$, 2.9% low, and 751 against 754 at $10^{10}$, 0.36% low.

The patterns that survive the noise are the ripples with $q < q_c$, and there are $q_c^2/4\pi$ of them per area $z^2$:
8.6 at $10^3$. Each carries on average $(q_c/3 - \tfrac12)/\ln2 = 4.3$ bits: about nine patterns of four bits each.[^mirror] The capacity is 200.9 bits at $10^6$ and $1.55\times10^4$ at $10^{30}$. At the
ceiling of $10^{70}$ it is $1.78\times10^5$ bits, 22.3 kilobytes, spread over 2230 patterns of 79.8 bits. With
$q_c \approx \ln\SNR$ the information grows, eventually, as $(\ln\SNR)^3/12\pi\ln2$, because there are $q_c^2$
patterns of $q_c$ bits; the approach is slow, 1.60 against 1.78 times $10^5$ bits at $10^{70}$.

{{paper fig:capacity}}

A wave camera resolves about $(D/\lambda)^2$ directions, each worth about $\log_2\SNR$ bits, so its bits grow as the
first power of the logarithm (Part 5); the cube is the law of Kolmogorov and Tikhomirov. A single pixel under a sky of
gravitational waves learns $1 + 3 + 5 + 7 + 9 = 25$ patterns (Part 9), and about 450 gravitons counted in a year carry
at most $450\log_2M$ bits for $M$ cells (Part 10).

## The space below a flat camera is hyperbolic

Write the potential $\field\Phi$ as $\sym{lifted-potential}{\field u} = z^{1/2}\field\Phi$. Laplace's equation then becomes

$$\bigl(\nabla_H^2 + \tfrac34\bigr)\,u = 0 ,$$

where $\sym{hyperbolic-laplacian}{\nabla_H^2}$ is the Laplacian of the line element $(\dd x^2 + \dd y^2 + \dd z^2)/z^2$,
the rule that measures each small step in units of its depth
([section 3.9](/tutorial/noise/positivity/#the-space-below-a-flat-camera-is-hyperbolic)). This is **hyperbolic space**,
with the camera on its boundary at infinity, and the substitution is the first step of a known method for Calderón's
problem [@Isozaki2004]. A change of scale across the camera is a displacement in depth, a rigid move of this geometry, so
the blur is a fixed angle and the patterns resolved are counted per area $z^2$.

{{paper fig:near-field-geometry}}

The precision with which a source can be placed is a metric on the scene, and it is of the same kind. Near the sensors
the tidal metric of a sphere of sensors round the scene weighs a step in depth by 4 and a step across by 10, so a step
across counts $5/2$ times as much
([section 3.9](/tutorial/noise/positivity/#inside-a-sphere-of-sensors-the-precision-of-a-place-has-the-geometry-of-poincares-ball)
derives it and its counterpart for sensors of the pull). The
flat array of section 3.9 has the same ratio of weights in its Fisher metric (section 3.3). The near field is where everyday things are visible, and it can never be
sharp. Sharp images need waves.

## The capstone: imaging the locked safe from start to finish

We follow the safe from the first readings to the limit of what any camera could see.

![The locked safe in six panels. (a) The gold's own reading $\curv{\tE}_{xx}$ along a row of pixels, in
$10^{-10}\unit{s^{-2}}$, against the noise of one reading at $\SNR = 10^3$ (thin band) and 10 (wide band); below, the two
safes' scores at $\SNR = 10$, 1.81 noise standard deviations apart, with the 18.3% beyond the midline shaded. (b) The
scene from above: the orange wedge is this array's blur, 32.4°; the grey lines bound the 24.0° blur of a wide array.
(c) The whitened gains, largest first: 17 of the 231 stand above the noise (blue line). (d) The Cramér–Rao ellipse of a
point of gold, 25 kg by 9.1 cm; below, the mass the positive image finds in the right safe over 3000 draws, mean 315 kg
(orange), true 324 kg (dashed). (e) The 38 bits of a patch: one for the safe (dark), four for the mass (orange). (f) The
bar's face, 30 cm by 14 cm, drawn at the quantum ceiling by a wide array (left, blur 9 cm) and by this array (right,
13 cm), with the true outline in a hairline.](tut-read-iv2-capstone){#fig:read-iv2-capstone}

**(a) Find the safe.** With the room and the safes subtracted, the gold's largest recorded reading on the metre-wide
array is $4.1\times10^{-10}\unit{s^{-2}}$, in the component $\curv{\tE}_{yz}$. A pixel does not record $\curv{\tE}_{zz}$, though it would reach $7.8\times10^{-10}\unit{s^{-2}}$ in magnitude at the
pixel nearest the gold, 3.66 m away (sections 1.4 and 1.5). At $\SNR = 10^3$ the noise of
one reading is $\sigma_n = 3.5\times10^{-11}\unit{s^{-2}}$, or 0.035 eötvös, where one **eötvös** (E) is
$10^{-9}\unit{s^{-2}}$ (section 3.2). At $\SNR = 10$ it is 3.5 E, 8.6 times the gold's largest recorded reading, so no
pixel alone sees the gold. The 605 readings together still name the right safe 82% of the time (section 3.3).

::: try {#which-safe}
Predict first: doubling the ratio from 10 to 20 doubles the separation $D$ of the two safes' readings. Will it halve
the share of wrong choices, or cut it by more? Write a percentage down, then set the slider to 20 and run trials until
the count settles. Compare the count with the predicted $P(Z > D/2)$ beside it.
:::

**(b) See the blur.** Finding the gold is not drawing it. At $10^3$ an array as wide as the scene is deep would blur
every point by 24.0°, 1.47 m at 3.5 m, and this small camera by 32.4°, 1.98 m. Either is wider than the 1.4 m between
the safes, and far wider than the bar, which spans 4.4° from the array's centre.

::: derivation
### How the pictures of the safe are drawn

Panels (b) to (d) of Figure [](/paper/#fig:locked-safe) draw the tidal column
$S(\hat n) = \int\matter\rho\,\dd r/r$, in $\mathrm{kg\,m^{-3}}$, along each line of sight from the camera
([section R2](/tutorial/outside/reading-section-iv-1/#the-image-is-the-tidal-column-and-a-pixel-reads-only-five-of-its-numbers)),
and panel (e) draws the tide itself.

**The column of uniform boxes.** The floor and walls, the steel of the safes, the air inside them and the gold are boxes
with their edges along the axes, each of one density; a box inside another replaces the outer density by its own. The
line of sight in the direction $\hat n$ holds the points $\vect o + r\hat n$, with $\vect o$ the camera. Along each axis
$i$ it lies between a box's two faces across that axis for $r$ between $(\ell_i - o_i)/\hat n_i$ and $(h_i - o_i)/\hat
n_i$, with $\ell_i$ and $h_i$ the coordinates of the faces, and it is inside the box where the three intervals overlap.
Sorting every crossing of every box cuts the line into pieces of one density each, and on a piece from $r = a$ to $r =
b$ with the density $\matter\rho$ the integral is exact:

$$\int_a^b\matter\rho\,\frac{\dd r}{r} = \matter\rho\,\ln\frac ba .$$

So $S$ is a sum of logarithms, with $a$ and $b$ raised to $r_{\min} = 0.25$ m wherever they fall below it. The columns of
separate bodies add, so subtracting the known room, panel (c), is exact.

**Numbers.** The floor is 30 cm of concrete of $2400\unit{kg\,m^{-3}}$, its top 1.5 m below the camera. A line of sight
that leaves through its underside meets the top and the bottom at distances in the ratio $1.8/1.5$, so it collects $S =
2400\ln1.2 = 438\unit{kg\,m^{-3}}$, the same in every such direction. With the room subtracted, the line through the
gold's centre collects $2366\unit{kg\,m^{-3}}$ and the matching line through the empty safe 392, the steel of its walls;
the difference, 1974, is close to the estimate $\matter\rho L/r = 19{,}300 \times 0.40/3.92 = 1970\unit{kg\,m^{-3}}$ for
the gold's 40 cm of depth at 3.92 m.

**The blur, as if at a single depth.** By the blur law, the picture of a point at the depth $z$ is a pattern whose shape
depends only on the distance across divided by $z$, which is the angle seen from the array: the two-dimensional inverse
transform of $H(q) = s^2/(1 + s^2)$, with $q = kz$ (section
[3.7](/tutorial/noise/blur-law/#step-5-the-picture-of-a-point-is-the-pattern-of-a-round-opening)). At $\SNR = 10^{20}$
the cut-off is $q_c = 51.13$ and the blur $4.43/q_c = 0.0866$ rad, or $4.96°$. Panel (d) convolves the picture of $S$,
drawn against the two angles across the view, with this pattern as a function of angle, scaled so that the total of $S$
is unchanged. For a scene at one depth this is the image that the Wiener filter of an array as wide as the scene is deep
would give; for the safes and the room, whose parts lie at several depths, it shows what such an array could resolve,
not a reconstruction from simulated readings. The gold, 4.4° wide, still stands out through the steel.

**The tide on a sphere.** Panel (e) draws the tide of the safes and the gold on the sphere about the camera that passes
through the centre of each safe, at $\sqrt{1.1^2 + 1.0^2 + 3.5^2} = 3.80$ m. The tide of a uniform box has a closed
form. Its entry $\curv{\tE}_{zz} = \partial_z^2\field\Phi$ is $-G\matter\rho$ times the integral over the box of
$\partial_z^2(1/|\vect x - \vect x'|) = \partial_{z'}^2(1/|\vect x - \vect x'|)$, and the integral over $z'$ leaves only
the two faces across $z$, at $z_1 < z_2$:

$$\curv{\tE}_{zz} = -G\matter\rho\Bigl[\iint\frac{z - z'}{|\vect x - \vect x'|^3}\,\dd x'\,\dd y'\Bigr]_{z' = z_1}^{z' = z_2}
.$$

Each double integral is, up to its sign, the solid angle that a face subtends at $\vect x$. For a point beyond the box
along $z$ the entry is $-G\matter\rho(\Omega_{\rm near} - \Omega_{\rm far})$, a stretch, and for a small box of area $A$
and thickness $L$ at the distance $r$ the difference of the solid angles is $A/r^2 - A/(r + L)^2 \approx 2AL/r^3$, which
gives the point mass's $-2G\matter M/r^3$. The entries off the diagonal are sums of logarithms over the box's edges, and
the safes' tide is the sum over their boxes, each nested box counted with its density's excess over the box around it.
:::

**(c) Fail to weigh it.** The Gaussian image keeps only 17 of its 231 patterns above the noise and weighs a safe to
$\pm729$ kg. Averaged over the noise it puts 228 kg in the right safe and $-23$ kg in the left, but one draw gives
100 kg in the right and 187 kg in the left: a single image cannot even name the safe.

**(d) Weigh it by positivity.** Told only that mass lies in the plane of the safes and is never negative, the positive
image finds $315 \pm 20$ kg in the right safe and less than a kilogram in the left. The whole image holds about 340 kg,
because noise that would push a cell below zero is cut off while noise that pushes it up is kept.

How good is $\pm20$ kg? If the gold were known to be one point, the Cramér–Rao bounds for this array at $10^3$ would be
2.9 cm and 3.5 cm across, 9.1 cm in depth and $\pm25$ kg (sections 3.3 and 3.4). Depth and mass are almost confused,
because a farther, heavier bar reads nearly the same; with the depth known, the mass bound falls to $\pm2.2$ kg. The
positive image's 20 kg lies between the two. The endless plane's formulas would give 2.9 mm, 4.6 mm and 0.29% at this
depth, ten times better or more: that is the cost of a small camera.

**(e) Count the bits.** The plane of the safes, 5 m by 2.5 m at 3.5 m, is about one patch of area
$z^2 = 12.25\unit{m^2}$, so a wide array's data carry about 38 bits about it; this array's own 231 patterns carry
39.[^bits] The answer "the right safe, $315 \pm 20$ kg" uses about one bit for the safe and $\log_2(324/20) = 4.0$ bits
for the mass: five of the thirty-eight.

**(f) Reach the quantum ceiling.** For the gold itself, 324 kg watched for the age of the universe, the ceiling is
$1.2\times10^{71}$. An array as wide as the scene is deep would then blur by 1.49°, 9 cm at 3.5 m, and this one by
$\pi/86.1 = 2.09°$, 13 cm. Either would draw the bar as a blurred block, with no stamp on its face, though each patch
would hold $1.9\times10^5$ bits.

**The idea to keep: a near-field picture blurs by an angle set by the logarithm of the sensitivity and holds only a few
dozen bits per patch, yet a simple scene, a bar of gold in one of two safes, is found and weighed precisely, because
the camera spends those bits on a few numbers and mass is never negative.**

::: problems
### Practice

**[3.7]** Rerun the sensitivity ceiling for a ball of 1 kg watched for one year. Find the ceiling $\matter M_sc^2\tau/\hbar$,
the cut-off $q_c$ and the blur of an array as wide as the scene is deep.

::: solution
A year is $3.156\times10^7$ s, so the ceiling is $1 \times (3.00\times10^8)^2 \times 3.156\times10^7/1.055\times10^{-34}
= 2.7\times10^{58}$. The cut-off solves $q_ce^{-q_c} = 1/\pi\SNR$: $q_c = 140.6$. The blur is $4.43/140.6 = 0.0315$
radians, or 1.80°, against 1.51° for a person watched for the age of the universe.
:::

**[R3]** Why does every line of sight that passes through the floor of the room, top and bottom, collect the same tidal
column from it, and how large is it?

::: solution
The floor's top lies 1.5 m and its bottom 1.8 m below the camera, so along any line of sight pointing down the two
crossings lie at distances in the ratio $1.8/1.5$, whatever the direction. The column is $\matter\rho\ln(b/a) =
2400\ln1.2 = 438\unit{kg\,m^{-3}}$, a fifth of the gold's 1970 along the line through it.
:::

**[R3]** The farther, heavier gold is told from the true bar by 6.9 noise standard deviations at $\SNR = 10^3$. How
often would the best rule choose wrongly at $\SNR = 10^2$, and at $3\times10^3$?

::: solution
The separation grows in proportion to $\SNR$: 0.69 at $10^2$ and 20.8 at $3\times10^3$. The rule errs with the
probability $P(Z > D/2)$: $P(Z > 0.35) = 36\%$ at $10^2$, hardly better than a guess, and $P(Z > 10.4)$, about
$10^{-25}$, at $3\times10^3$.
:::

### Stretch

**[3.8]** At $\SNR = 10^3$ a near-field picture holds about 38 bits per patch, and a single mass at 1 m is placed to
0.82 mm across and 1.3 mm in depth and weighed to 0.29%. Roughly how many bits do these four numbers use, if beforehand
the place was known only to within the blur, 42 cm, in each direction, and the mass only to within its own size?

::: solution
Each of the two coordinates across is one of $420/0.82 = 512$ cases, 9.0 bits; the depth one of $420/1.3 = 323$, 8.3
bits; the mass one of $1/0.0029 = 345$, 8.4 bits. In all $9.0 + 9.0 + 8.3 + 8.4 = 35$ bits, close to the 38 of a patch:
a simple scene spends nearly the whole budget on four numbers.
:::

### The camera

**[3.3]** Reproduce the numbers of the worked case: the 1.8 standard deviations and 18% at $\SNR = 10$, the ratio 34
for one error in a thousand, and the small camera's blur of about 32° and two metres.

::: solution
The two safes' predictions lie $D = 1.81$ noise standard deviations apart at $\SNR = 10$, so $P(Z > 0.906) = 0.183$.
Since $D = 0.181\,\SNR$, one error in a thousand, $D = 6.18$, needs $\SNR = 34.1$. With $2r/D = 7$, $\ell_{\max} = 5.55$
and $\pi/5.55 = 32.4°$, 1.98 m at 3.5 m.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), its plain words from the blanket to the end.
- [*How sharp*](/paper/#par:how-sharp), from the definition of $\SNR$: equations [](/paper/#eq:wiener),
  [](/paper/#eq:cutoff) and [](/paper/#eq:resolution), Table [](/paper/#tab:resolution) and Figure
  [](/paper/#fig:resolution-law).
- [*A flown gradiometer*](/paper/#par:a-flown-gradiometer) and Figure [](/paper/#fig:nearfield).
- [*Other gravitational sensors*](/paper/#par:other-gravitational-sensors) and [*A small
  camera*](/paper/#par:a-small-camera), with equation [](/paper/#eq:handheld).
- [*The precision of a simple scene*](/paper/#par:the-precision-of-a-simple-scene), [*A worked
  case*](/paper/#par:a-worked-case) and [*The positivity of mass*](/paper/#par:the-positivity-of-mass), with Figure
  [](/paper/#fig:locked-safe) and Appendix A's [*The worked inversion*](/paper/#par:the-worked-inversion).
- [*The zeros of the shear*](/paper/#par:the-zeros-of-the-shear): equation [](/paper/#eq:shear-zeros) and Figure
  [](/paper/#fig:buried-ruler).
- [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity).
- [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image): equations
  [](/paper/#eq:capacity-integral) and [](/paper/#eq:capacity), and Figure [](/paper/#fig:capacity).
- [*The geometry of the near field*](/paper/#par:the-geometry-of-the-near-field): equation [](/paper/#eq:hyperbolic)
  and Figure [](/paper/#fig:near-field-geometry).
:::

::: deeper
- The [GR course, section 17.2](https://neovand.github.io/general-relativity/chapter-17.html#17-2-two-alarming-radii-two-very-different-problems)
  explains the Schwarzschild radius, and [section
  22.8](https://neovand.github.io/general-relativity/chapter-22.html#22-8-entropy-is-written-in-area) meets another
  bound on information set by gravity.
- Robert L. Parker, *Geophysical Inverse Theory* (Princeton, 1994), on non-uniqueness, regularization and positivity.
:::

[^iv]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. IV](/paper/#sec:near-field).

[^goce]: GOCE flew for four years from 2009, three of them at 254 km, and was then lowered to 224 km, where the same degrees
    give a blur of 24° to 26°. First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV,
    [*A flown gradiometer*](/paper/#par:a-flown-gradiometer).

[^code]: The array, the bar and the noise follow Appendix A of *The gravitational camera* (Mohsenvand 2026),
    [*The worked inversion*](/paper/#par:the-worked-inversion).

[^turned]: First shown in *The gravitational camera* (Mohsenvand 2026), App. A,
    [*The worked inversion*](/paper/#par:the-worked-inversion).

[^ruler]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV,
    [*The zeros of the shear*](/paper/#par:the-zeros-of-the-shear), as its equation [](/paper/#eq:shear-zeros), with
    Fig. [](/paper/#fig:buried-ruler) drawing the zeros as a buried ruler.

[^cap]: The integral and its closed form are equations [](/paper/#eq:capacity-integral) and [](/paper/#eq:capacity) of
    *The gravitational camera* (Mohsenvand 2026), Sec. IV.

[^mirror]: Each real number carries $\tfrac12\log_2(1 + s^2) \approx \log_2s$ bits, and $q_c^2/4\pi$ counts real
    numbers. A ripple and its mirror together carry $2\log_2s$, and there are half as many such pairs (section 3.8).

[^bits]: The 39 bits are $\sum\tfrac12\log_2(1 + s_i^2)$ over the whitened gains $s_i$ of section 3.4; a finite patch is
    not an endless sheet, so 39 and 38 agree in size only.
