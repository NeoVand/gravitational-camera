---
id: R3
title: 'Reading Section IV, part 2, with the capstone: imaging the locked safe'
question: "With Part 3 behind us, which of Section IV's claims about how sharp, how precise and how full a near-field picture can be can we now check for ourselves, and what does the whole part say about the locked safe?"
part: '3'
requires: ['1.3', '1.4', '1.5b', '2.2', '2.3', '2.5', '2.7', 'R2', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9']
paper: [sec:near-field, eq:wiener, eq:cutoff, eq:resolution, tab:resolution, fig:resolution-law, fig:nearfield, eq:handheld, fig:locked-safe, eq:shear-zeros, fig:buried-ruler, eq:capacity-integral, eq:capacity, fig:capacity, eq:hyperbolic, fig:near-field-geometry, app:benchmarks]
figures: [fig:locked-safe, fig:resolution-law, fig:capacity, fig:near-field-geometry]
live: [near-field-blur, which-safe]
---

Two identical steel safes stand 3.5 m in front of a camera, and the right-hand one holds a bar of gold of 324 kg. The
second half of the paper's [Section IV](/paper/#sec:near-field) returns to this scene again and again. In its plain
words, "a camera of 121 pixels a metre across must find it", and at a signal-to-noise ratio of 34 it "picks the wrong
safe only once in a thousand tries". With Part 3 behind us, which of Section IV's claims about how sharp, how precise
and how full a near-field picture can be can we now check for ourselves, and what does the whole part say about the
locked safe?

This chapter reads that half in order, one heading for each stretch of text, and derives nothing new. It starts where
[reading chapter
R2](/tutorial/outside/reading-section-iv-1/#fine-detail-fades-as-the-exponential-of-the-depth-and-a-uniform-sheet-has-no-tide)
stopped, in the paragraph [*How sharp*](/paper/#par:how-sharp), and ends by imaging the locked safe from start to
finish. As in [R1](/tutorial/newton/reading-section-ii/) and R2, each claim gets the chapter that teaches it and a mark:
*checked here*, *read now, derived in Part N*, or *stated in the paper* (taken from outside the paper's own argument).
Figure [](#fig:read-iv2-map) draws the eleven stretches in order.

{{paper fig:locked-safe}}

::: plain
The second half of Section IV says how good a near-field picture can be. Fine detail fades on its way to the camera
faster than coarse detail, and the camera must enlarge it again, noise and all. So the blur of the best picture of an
unknown scene shrinks only with the number of digits of the sensitivity: 24° at a signal-to-noise ratio of a thousand,
14° at a million. Part 3 derived all of this, and every number of the paper's table comes out again.

A blurred picture can still measure a simple scene precisely. One mass a metre away is placed to a millimetre. The
locked safe's readings show which safe holds the gold, and because mass is never negative they also weigh it. A
picture holds only a few dozen bits for each patch of the scene, and a simple scene spends them on a few numbers.

The limits set by black holes and by quantum mechanics need later parts, and so do the comparisons with wave cameras
and with a single pixel.
:::

![The eleven stretches of the second half of Section IV, in order, each with its equation numbers if it has any and
the chapters that teach it beneath. A filled box is checked here, a half-filled box holds claims of more than one kind,
and the dotted box is read now and derived in Parts 8, 11 and 13. The first half was read in R2, and all eleven meet in
the capstone.](tut-read-iv2-map){#fig:read-iv2-map}

## The plain words hold, number by number, from the blanket to the end

The [summary in plain words](/paper/#sec:near-field) compares fine detail under the fade to "a hand under a thick
blanket". It brings in **noise**, the random part of a reading that is there even when nothing is measured, and the
**signal-to-noise ratio**, the size of a signal over the typical size of its noise
([3.1](/tutorial/noise/probability/#a-reading-is-a-signal-plus-a-random-number), *checked here*). "When the camera
enlarges a faint signal, it enlarges the noise by the same factor", because the noise is added at the sensors, after
the fade ([2.7](/tutorial/outside/evanescent/#undoing-the-fade-multiplies-the-noise), *checked here*).

"The width of the blur then depends only on roughly how many digits the signal-to-noise ratio has", because the cut-off
grows by a little more than 2.3 for each factor of ten
([3.7](/tutorial/noise/blur-law/#step-4-solving-the-cut-off-needs-a-logarithm-of-a-logarithm), *checked here*). The
exact blurs are 23.98° at $10^3$, 14.15° at $10^6$ and 3.405° at $10^{30}$, the paper's "$24^\circ$", "$14^\circ$" and
"$3.4^\circ$". "The blur is an angle", because only the product of the wavenumber and the depth enters (3.7,
[3.9](/tutorial/noise/positivity/#the-space-below-a-flat-camera-is-hyperbolic), *checked here*). The eye's one arcminute
would need a ratio of about $10^{6610}$, the paper's "about $10^{6600}$" (3.7, *checked here*). "A signal-to-noise ratio
of a thousand places that mass to within a millimetre at a distance of one metre", while its picture is 24° wide (3.3,
3.7, *checked here*). The last paragraph counts **bits**; one bit answers one yes-or-no question.

## The best linear picture of a point is the pattern of a round pupil

The paragraph [*How sharp*](/paper/#par:how-sharp) continues after the sheet that has no tide. "Define the
signal-to-noise ratio as the peak field of a point mass $m$, $2Gm/z^3$, over the noise of the field averaged across a
patch of side $z$, $\sqrt{N_0}/z$, so that $\SNR = 2Gm/(z^2\sqrt{N_0})$." Here $z$ is the depth of the scene below a
flat array, in metres, $\matter m$ a mass in kilograms, and $\sym{noise-density}{N_0}$ the **spatial noise density**,
in $\mathrm{s^{-4}\,m^2}$, whose average over an area $A$ has the variance $N_0/A$
([3.2](/tutorial/noise/random-signals/#the-variance-of-noise-spread-over-a-plane-falls-as-one-over-the-area)). The
ratio $\sym{snr}{\SNR}$ is a pure number
([3.7](/tutorial/noise/blur-law/#step-1-one-number-measures-the-camera), *checked here*).

"Each Fourier component of a point mass then stands above its own noise by $s = \pi\,\SNR\,kz\,e^{-kz}$." A
**Fourier component**, or **ripple**, is a pattern across the scene with one spacing between its crests, of
**wavenumber** $k$, $2\pi$ over that spacing, in $\mathrm{m^{-1}}$
([2.6](/tutorial/outside/fourier/#across-a-plane-a-ripples-wavevector-points-across-its-crests)). The ratio
$\sym{ripple-ratio}{s}$ follows from the prior's spectrum $S_\sigma = \matter m^2/z^2$, one mass $\matter m$ per area
$z^2$ ([3.7](/tutorial/noise/blur-law/#step-2-each-ripple-stands-above-its-noise-by-a-factor-that-depends-on-two-numbers),
*checked here*). With $\sym{kz}{q} = kz$, a ripple with $q = 1$ stands $1160$ times above its noise at $\SNR = 10^3$.
The best linear reconstruction keeps each ripple with the weight $\sym{wiener-filter}{H}$:

{{paper eq:wiener}}

Chapter [3.5](/tutorial/noise/wiener-filter/#independent-ripples-can-be-filtered-one-at-a-time) derived it as the
**Wiener filter**, the linear guess with the smallest mean squared error (*checked here*). "$H$ vanishes for a uniform
scene, $k \to 0$, and is close to one from $kz \approx 1/\pi\SNR$ to a little below $kz = q_c$, where it falls through
one half." The low edge is $1/\pi\SNR = 3.2\times10^{-4}$ at $10^3$, and the high one is the **cut-off**
$\sym{cutoff}{q_c}$, the larger root of $s = 1$
([3.7](/tutorial/noise/blur-law/#step-3-the-filter-keeps-a-ripple-while-it-stands-above-its-noise), *checked here*):

{{paper eq:cutoff}}

"(10.1 against the exact 10.4 at $\SNR = 10^3$)": one step of the iteration $q = \ln(\pi\SNR) + \ln q$ gives 10.14,
and the root is 10.394 (3.7, *checked here*).

"The image of a point is therefore close to the diffraction pattern of a round pupil of radius $q_c/z$, $2J_1(x)/x$
with $x = q_cr/z$." A **pupil** is a round opening, and a filter that keeps every ripple inside a circle of
wavevectors draws a point as the opening's pattern, built from the Bessel function $J_1$
([3.6](/tutorial/noise/bessel-and-airy/#a-round-opening-transforms-to-a-wider-pattern-than-a-slit),
[3.7](/tutorial/noise/blur-law/#step-5-the-picture-of-a-point-is-the-pattern-of-a-round-opening), *checked here*).
Its **full width at half maximum**, the distance between the two points where it has fallen to half its peak, is taken
on "an amplitude and not its square", because the reconstruction is a density, linear in the data
([3.7](/tutorial/noise/blur-law/#step-6-the-blur-is-the-width-of-the-picture-at-half-its-height), *checked here*).
The pattern falls to half its peak at $x = 2.2151$, so the width is $4.4302\,z/q_c$, and as an angle
$\sym{angular-blur}{\Delta\theta}$:

{{paper eq:resolution}}

"To within four per cent for every $\SNR \ge 100$": the exact width over $4.43/q_c$ is 0.967 at $10^2$, 0.982 at
$10^3$ and 1.000 at $10^{30}$. For a single row of sensors over line masses the pattern is $\sin x/x$, half its peak at
$x = 1.8955$, so the row's blur is $3.79/q_c$ ([3.5](/tutorial/noise/wiener-filter/#seen-in-space-a-filter-is-a-blur),
3.7, *checked here*).

Table [](/paper/#tab:resolution) gives the exact widths, and Figure [](/paper/#fig:resolution-law) draws them. Chapter
[3.7](/tutorial/noise/blur-law/#step-7-an-exact-calculation-reproduces-the-papers-table) reproduces every entry of its
four columns to the precision printed, from the array's 24.0° at $10^3$ to its 1.8° at $10^{60}$ (*checked here*). The
two-point column is **Sparrow's criterion**, the smallest separation at which two equal points show a dip between them,
and it is slightly wider than the full width, as the caption says.[^sparrow] In panel (a) of the figure, "raising the
sensitivity from $10^6$ to $10^{60}$ moves the cut-off only from 18 to 144": 17.8 and 144.3.

{{paper fig:resolution-law}}

## The blur is a fixed angle, and a satellite that flew sits on the table's first row

"For an array at least as wide as the scene is deep, the angular blur does not depend on distance or on the size of
the array, only, through $q_c$, on the logarithm of its sensitivity"
([3.7](/tutorial/noise/blur-law/#what-the-law-means), *checked here*). "The first estimate $\pi/\ln\SNR$ … runs sharp
at high sensitivity, because the image of a point is wider than $\pi/q_c$": the estimate is 26.1° against 24.0° at
$10^3$, but 2.6° against 3.4° at $10^{30}$, since $4.43 > \pi$ (3.7, *checked here*). That geophysicists and
acousticians meet the same limit is *stated in the paper*.

The paragraph [*A flown gradiometer*](/paper/#par:a-flown-gradiometer) reads the law on GOCE. The satellite flew at
$z = 254\unit{km}$ for most of its four years, from 2009 to 2012, and was then lowered in steps to 224 km by 2013;
the paper puts all four years at 254 km.[^goce] Its map "runs out of signal between spherical harmonic degrees
$\ell = 280$ and $300$" (*stated in the paper*). A pattern of **degree** $\ell$ on a sphere of radius $R$ has crests about
$2\pi R/\ell$ apart, so on the ground $k = \ell/R$
([2.2](/tutorial/outside/spherical-harmonics/#a-pattern-of-degree-ell-has-features-about-piell-wide)). With
$R = 6371\unit{km}$,

$$\begin{gathered}q_c = \frac{\ell z}{R} = \frac{280 \times 254}{6371} = 11.16\\ \text{to}\quad \frac{300 \times 254}{6371} = 11.96 ,\end{gathered}$$

the paper's "between 11 and 12". Reading the cut-off equation backwards, $\SNR = e^{q_c}/\pi q_c$ is 2010 to 4160, "two
to four thousand", and $4.43/q_c$ is 22.7° to 21.2°, "$21^\circ$ to $23^\circ$" (3.7, *checked here*). On the ground
the blur is $4.43\,z/q_c$, 101 to 94 km, "a hundred kilometres … seen from two and a half times as high". At 224 km
the same degrees give a blur of 24° to 26°, still the table's first row.

In the paper's figure of two buried masses, the caption's "best reconstruction of the masses that the noise allows" is
the best *linear* one, the Wiener filter
([3.5](/tutorial/noise/wiener-filter/#a-linear-guess-cannot-keep-mass-positive-and-with-a-white-prior-it-is-harmonic)).
"The bar is the blur, $0.21\,z$": for a row at $10^6$, $3.79/17.84 = 0.212$, and the exact width is 0.2118 (3.5, 3.7,
*checked here*). "Its ripples are the price of discarding the detail that noise has swamped": the picture dips to
$-0.211$ of its peak beside each mass, and midway between masses half a depth apart the two inner dips add to $-0.40$
(3.5, *checked here*).

::: try {#near-field-blur}
Predict first: at GOCE's ratio of two to four thousand, will the figure's two masses, half a depth apart, still come
out as two peaks? Set the sensitivity to $10^{3.5}$, about 3200, and watch the middle of panel (b); then try $10^3$.
:::

## Clocks and accelerometers meet the same law, and a small camera does worse

The paragraph [*Other gravitational sensors*](/paper/#par:other-gravitational-sensors) changes the kind of sensor.
Clocks read the potential and accelerometers its gradient, so over a sheet their kernels go as $q^{-1}e^{-q}$ and
$e^{-q}$, where the tidal camera's goes as $q\,e^{-q}$
([2.7](/tutorial/outside/evanescent/#the-same-fade-appears-for-every-field-that-obeys-laplaces-equation), *checked
here*). The cut-off condition becomes $q^pe^{-q} = 1/\pi\SNR$, which the iteration $q = \ln(\pi\SNR) + p\ln q$ solves:

| $\SNR$ | clocks, $p = -1$ | accelerometers, $p = 0$ | tides, $p = 1$ |
|---|---|---|---|
| $10^3$ | 6.22 | 8.05 | 10.39 |
| $10^{20}$ | 43.43 | 47.20 | 51.13 |

These are the paper's 6.2, 8.1 and 10.4, and 43.4, 47.2 and 51.1 (3.7's stretch problem, *checked here*). Each
differs from the next by about $\ln q_c$, which is 2.3 at $10^3$ and 3.9 at $10^{20}$, as the paper says. "The blur
belongs to Laplace's equation … not to the detector."

The paragraph [*A small camera*](/paper/#par:a-small-camera) drops the assumption of a wide array. Inside a camera of
width $D$, in metres, the part of the field of degree $\ell$ changes across the camera by about $(D/2r)^{\ell-2}$ of
the quadrupole, for a source at the distance $r$. Chapter
[2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics) derived the
factor from the growing harmonics round the camera, and chapter 3.7 used it (*checked here*):

{{paper eq:handheld}}

Here $D$ is the camera's width, not chapter 3.3's separation of two scenes. For the camera ten centimetres across
and the lorry fifteen metres away, $2r/D = 300$ and

$$\begin{gathered}\ell_{\max} = 2 + \frac{\ln 10^6}{\ln 300} = 2 + \frac{13.82}{5.70} = 4.42,\\ \Delta\theta = \frac{\pi}{4.42} = 0.71\ \text{radians} = 40.7° ,\end{gathered}$$

the paper's "about $40^\circ$, not $14^\circ$" (2.3's problem, *checked here*). "A single pixel, $D \to 0$, sees the
quadrupole alone", because the ratio $\ln\SNR/\ln(2r/D)$ then goes to zero, and a pixel reads only degree two of a
still scene ([2.2](/tutorial/outside/spherical-harmonics/#a-pixel-reads-only-degree-two-of-its-sky), *checked here*).

## One mass is placed to a millimetre, though two are hard to tell from one

The paragraph [*The precision of a simple scene*](/paper/#par:the-precision-of-a-simple-scene) asks a different
question: not what can be drawn of any scene, but how precisely a scene known to hold one point mass can be measured.
For an endless plane that reads $\curv{\tE}_{zz}$ with the noise above, the paper gives $\sqrt{2/5}\,z/\mathcal R$
across, $z/\mathcal R$ in depth and $\sqrt5/\mathcal R$ of the mass, with $\sym{pattern-snr}{\mathcal R} =
(\sqrt{3\pi}/4)\SNR$ "the signal-to-noise ratio of the whole field pattern". These are the **Cramér–Rao bounds**, the
smallest errors that any unbiased method can reach, with the position and the mass fitted together
([3.3](/tutorial/noise/measuring-a-number/#one-mass-a-metre-away-is-placed-to-a-millimetre), *checked here*). At
$\SNR = 10^3$, $\mathcal R = 767$, and at one metre

$$\frac{0.632 \times 1\unit{m}}{767} = 0.82\unit{mm}, \qquad \frac{1\unit{m}}{767} = 1.3\unit{mm}, \qquad
\frac{2.24}{767} = 0.29\% ,$$

so the mass "is placed to within a millimetre, while its image is $24^\circ$ wide" (3.3, *checked here*).

"Two equal masses, by contrast, can be told from one only when they are farther apart than about $z/\sqrt{\mathcal
R}$, because the difference they make grows as the square of their separation." The pair and a single mass at its
centre first differ in their quadrupole, which grows as the square of the separation
([3.3](/tutorial/noise/measuring-a-number/#two-masses-are-hard-to-tell-from-one), 2.3, *checked here*). At 1 m and
$10^3$ the scale is $1\unit{m}/\sqrt{767} = 3.6\unit{cm}$, an order of magnitude only: there the two scenes predict
readings 0.34 noise standard deviations apart. A test that errs one time in six needs them 2 apart, because the best
rule errs when the noise carries the readings more than halfway across, one standard deviation, which happens 16% of
the time. That takes 8.8 cm
([3.9](/tutorial/noise/positivity/#positivity-resolves-as-a-power-of-the-sensitivity-not-its-logarithm)).

## The worked case finds the safe quickly, but a cautious image cannot weigh it

The paragraph [*A worked case*](/paper/#par:a-worked-case) applies all this to the locked safe, with the details in
Appendix A's [*The worked inversion*](/paper/#par:the-worked-inversion).[^code] The two steel safes, 1560 kg each, weigh
ten times the gold. Panel (f) of the figure shows "readings of a few times $10^{-9}\,\mathrm{s^{-2}}$, of which the gold
is a tenth": along its row the safes' largest reading is $6.4\times10^{-9}\unit{s^{-2}}$ and the gold's own
$6.5\times10^{-10}\unit{s^{-2}}$, the caption's "at most $6.5\times10^{-10}$" (1.4, *checked here*).

"The empty room and the two safes are known and subtracted", leaving the bar of $0.3 \times 0.14 \times 0.4\unit{m}$ of
gold, $19{,}300\unit{kg\,m^{-3}} \times 0.0168\unit{m^3} = 324\unit{kg}$. The array is $11\times11$ pixels $b =
10\unit{cm}$ apart. Each pixel reads five components of the tide, so the array records 605 numbers, each with the noise
$\sigma_n$, which the appendix writes as a bare $\sigma$. Each pixel stands for an area $b^2$, so the average of the
readings over a patch of side $z$ has the noise $\sigma_nb/z$. Setting this equal to $\sqrt{N_0}/z$ gives $N_0 =
\sigma_n^2b^2$, and so $\SNR = 2G\matter m/z^2\sigma_nb$
([3.2](/tutorial/noise/random-signals/#the-variance-of-noise-spread-over-a-plane-falls-as-one-over-the-area), *checked
here*).

"Asked only which safe holds the gold, the data answer quickly." At $\SNR = 10$ the 605 predicted readings of the two
scenes lie $\sym{scene-separation}{D} = 1.81$ noise standard deviations apart, "1.8 standard deviations". The best rule
picks the safe whose predictions lie closer to the data, and it errs when the noise carries the data more than halfway
across: with the probability $P(Z > 0.906) = 18.3\%$, "18%", where $Z$ is a Gaussian number of mean zero and standard
deviation one ([3.3](/tutorial/noise/measuring-a-number/#choosing-between-two-scenes-comes-down-to-one-gaussian-number),
*checked here*). The separation grows in proportion to $\SNR$, so one error in a thousand, $D = 6.18$, needs
$\SNR = 34.1$.

"A sphere of gold and a point of the same mass give identical readings, as Newton showed", because outside a round body
only its mass counts ([1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts), *checked
here*). "The bar's shape departs from a point's by only 0.6 standard deviations at $\SNR = 10^3$": 0.58 (3.3, *checked
here*).

"Asked instead for an image that assumes little beyond mass lying in the plane of the safes, the same data weigh the
contents of a safe only to within $\pm730\,\mathrm{kg}$." This is the **Gaussian image**. It divides the upright plane
of the safes into 231 cells 25 cm apart and gives each a **prior**, what is expected of it before any reading: a
Gaussian spread of 324 kg either way. The **posterior**, the spread of scenes still likely after the readings, comes
from the singular values of the **design matrix**, whose columns are the readings that a kilogram in each cell gives
([3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots),
[3.5](/tutorial/noise/wiener-filter/#many-unknowns-are-guessed-together-with-the-same-formula), *checked here*). Summed
over the twelve cells that cover the front of a safe, its standard deviation is 729 kg.

The paper gives two reasons. The first holds: "the array is a small camera in the sense of Eq.
[](/paper/#eq:handheld)". With the camera's width $D = 1\unit{m}$ and $r = 3.5\unit{m}$, $2r/D = 7$ and

$$\begin{gathered}\ell_{\max} = 2 + \frac{\ln 10^3}{\ln 7} = 2 + \frac{6.91}{1.95} = 5.55,\\ \Delta\theta = \frac{\pi}{5.55} = 32.4° ,\end{gathered}$$

or 1.98 m at 3.5 m, against the paper's "about $33^\circ$, two metres"
([2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics), *checked here*);
"about $32^\circ$" would match. That is wider than the 1.4 m of floor between the safes. The second reason, "a broad
layer of mass has no tidal field at all", is true of an endless layer under a flat camera, but the $\pm730$ kg does not
come from there.[^layer] It comes from the fine patterns that move mass between neighbouring cells, which the data
cannot reach: 177 kg of noise let in and 707 kg of the prior's doubt left behind, $\sqrt{177^2 + 707^2} = 729\unit{kg}$
([3.5](/tutorial/noise/wiener-filter/#many-unknowns-are-guessed-together-with-the-same-formula), *checked here*).

::: derivation
### Appendix A's four other numbers

The posterior's spread is $\pm489$ kg at $10^6$ for the metre-wide array, "$\pm490$", and $\pm352$ kg for an array six
metres across, "$\pm350$". They "belong to the array and the noise, not to the data", because 3.5's posterior
covariance never contains the readings.

Gold 0.2 m farther back and heavier by $(4.096/3.916)^3 = 1.144$, "14% heavier", raises as strong a tide at the
array's centre; an equal pull, the paper's words, would need the square, 1.094. At $10^3$ its readings lie 6.9 noise
standard deviations from the true gold's, so it is "told apart".

Turning the arrays through 70° raises the separation of the two safes by a factor of 1.087 for the metre-wide one,
"9% better", and 29.6 for the six-metre one, "thirty times better" (3.3, 3.4, *checked here*).
:::

## Positivity alone weighs the gold to $315 \pm 20$ kg

The paragraph [*The positivity of mass*](/paper/#par:the-positivity-of-mass) adds the fact the Gaussian image lacks:
mass is never negative. It says that a Gaussian image allows "minus five hundred kilograms of gold beside one holding
plus five hundred". Two such neighbouring cells would move the readings by $D = 35$, which the camera sees plainly.
What hides is a scene of three parts whose masses add to nearly zero: $+500$ kg in the safe's twelve cells, $-903$ kg
spread thinly over 111 cells round it, and $+394$ kg over 108 others. It moves the readings by only $D = 0.17$, and no
linear image can forbid it ([3.9](/tutorial/noise/positivity/#a-linear-image-cannot-use-the-sign-of-mass), *checked
here*).

**Non-negative least squares** finds the scene with the smallest misfit among those with no negative mass, and uses no
prior ([3.9](/tutorial/noise/positivity/#non-negative-least-squares-keeps-only-the-masses-the-data-need), *checked
here*). It puts $315 \pm 20$ kg in the right safe and $0.3 \pm 2.0$ kg in the left (the mean and the spread over the
noise), the paper's "$316 \pm 20\,\mathrm{kg}$ … and almost nothing in the left".[^draws] At $10^4$ the right safe
holds $327.6 \pm 0.7$ kg, the paper's "$328 \pm 1$". "The small excess" of 3.3 kg comes mostly from the bar's centre
falling between the points of the grid (3.9, *checked here*).

"A scene made of a few compact masses is resolved down to separations that shrink as a power of the sensitivity … not
as its logarithm." Chapter
[3.9](/tutorial/noise/positivity/#positivity-resolves-as-a-power-of-the-sensitivity-not-its-logarithm) showed why:
among positive scenes, a small measured spread of mass forces the mass to lie near one point, so the separation that
decides one mass or two scales as $z/\sqrt{\mathcal R}$ (*checked here*, as a sketch). Drawing the two apart improves
more slowly, about as the cube root of the sensitivity, from $0.14\,z$ at $10^3$ to $0.016\,z$ at $10^6$. The paper
calls this "the mathematics of super-resolution of positive sources" (*stated in the paper*). What is proved is that
positive point sources on a fine grid are recovered stably by a positive fit, with no minimum separation as long as
not too many crowd together.[^superres] "The logarithmic law … is the limit for a scene crowded with mass", and "the
electrostatic analogue, whose charges have two signs, does not have" this prior (3.9, *checked here*).

## The zeros of the shear give a thin layer's size, with no image at all

The paragraph [*The zeros of the shear*](/paper/#par:the-zeros-of-the-shear) finds "one exact feature" that survives the
blur. The **shear** $\sym{shear}{\curv s} = (\curv{\tE}_{xx} - \curv{\tE}_{yy}) + 2i\,\curv{\tE}_{xy}$, in
$\mathrm{s^{-2}}$, holds the part of the tide in the camera's plane that changes a ring's shape as one complex number
([1.5b](/tutorial/newton/complex-numbers/#a-tide-across-a-direction-is-one-complex-number-and-turning-the-axes-turns-it-back-by-twice-the-angle)).
Above two equal masses $d$ apart it "vanishes at exactly two points, on the perpendicular bisector of the pair and
exactly $d$ apart, whatever the depth". On the bisector $\curv{\tE}_{xy} = 0$ by symmetry, and $\curv{\tE}_{xx} -
\curv{\tE}_{yy}$ is proportional to $y^2 - d^2/4$
([1.5b](/tutorial/newton/complex-numbers/#where-the-shear-vanishes-its-axes-make-half-a-turn-round-the-zero), *checked
here*). A depth "greater than $\tfrac{\sqrt3}{2}d$" makes these the only zeros; a shallower pair has four more off the
bisector (1.5b). For any thin layer seen from far, the zeros stand at

{{paper eq:shear-zeros}}

where $\sym{complex-place}{w} = x + iy$ is a place on the camera's plane, $\sigma$ the layer's surface density, its
mass per unit area in $\mathrm{kg\,m^{-2}}$ (a bare $\sigma$, not the noise $\sigma_n$), $\matter M$ its mass in
kilograms, $w_{\rm cm}$ its centre of mass and $\sym{complex-quadrupole}{\matter Q_c}$ its **complex quadrupole**, in
$\mathrm{kg\,m^2}$ ([3.9](/tutorial/noise/positivity/#the-zeros-of-the-shear-survive-the-blur), *checked here*, with
an error of order $(R/z)^2$). For the pair, $\matter Q_c = \matter md^2/2$ and $\matter M = 2\matter m$, so the zeros
are $\pm i\,d/2$, exact.

"Noise places each to within about $z^2/2\mathcal Rd$, so they separate two masses once $d$ exceeds about
$z/\sqrt{2\mathcal R}$": 2.6 cm at 1 m and $10^3$ (3.9's sketch, *checked here* as an order of magnitude). The link to
double lenses and to defects in maps of gravitational lensing is *stated in the paper*. Figure
[](/paper/#fig:buried-ruler) draws the zeros as a buried ruler.

## Physics outside Part 3 caps the sensitivity near $10^{70}$

The paragraph [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity) is an estimate, and its steps belong to
later parts. "A camera that fits within the distance $z$ to the scene, without becoming a black hole, has a mass below
$zc^2/2G$": a body of mass $M$ becomes a black hole when it fits inside $2GM/c^2$, its Schwarzschild radius (*read now,
derived in Part 11*, chapter 11.1). Its energy of interaction with a source of mass $\matter M_s$ at the distance $z$
is then below $G(zc^2/2G)\matter M_s/z = \matter M_sc^2/2$, "below about $M_sc^2$" (*checked here*, given the
radius). If quantum mechanics limits how fast the camera can tell two scenes apart to a rate set by that energy
(*read now, derived in Part 8*, chapter 8.6), then over a time $\tau$

$$\SNR \lesssim \frac{\matter M_sc^2\tau}{\hbar} ,$$

where $\hbar = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck constant. The units check: $\mathrm{kg\,m^2\,s^{-2}}
\times \mathrm{s}/\mathrm{J\,s}$ is a pure number. For a person of 70 kg watched for the age of the universe,
$13.8\times10^9$ years or $4.35\times10^{17}\unit{s}$,

$$\SNR \lesssim \frac{70 \times (3.00\times10^8)^2 \times 4.35\times10^{17}}{1.055\times10^{-34}} = 2.6\times10^{70} ,$$

"about $10^{70}$". There $q_c = 168$ and the blur is 1.51°, "a blur of $1.5^\circ$": a face seen from a metre would be
drawn with smudges 2.6 cm wide (3.7, *checked here*, given the ceiling).

"The estimate is generous: a camera of mass $zc^2/2G$ three metres away would pull on the person with $10^{15}$ times
the Earth's gravity." The mass is $3 \times (3.00\times10^8)^2/(2 \times 6.674\times10^{-11}) = 2.0\times10^{27}$ kg,
about Jupiter's, and its pull at 3 m is $G \times 2.0\times10^{27}/9 = 1.5\times10^{16}\unit{m\,s^{-2}}$,
$1.5\times10^{15}$ times $9.81\unit{m\,s^{-2}}$ (*checked here*). A camera that pulls no harder than the Earth weighs
$9.81 \times 9/G = 1.3\times10^{12}$ kg, and the ceiling falls with it to $1.7\times10^{55}$, "about $10^{55}$", where
the blur is 1.91° (3.7, *checked here*). Fifteen powers of ten widen the blur by only a quarter, "from $1.5^\circ$ to
$1.9^\circ$".

The second paragraph holds a mass $m$ behind a wall "in a superposition of two places a distance $d$ apart", a quantum
state that holds both places at once (*read now, derived in Part 8*, chapter 8.1). "The two branches differ in their
quadrupole, about $md^2$", because the centre of mass cannot move (2.3, *checked here*). How the puzzle resolves is
*stated in the paper*, and that a perfect camera is "a perfect source of decoherence" is *read now, derived in Part
13* (chapter [13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell)).

## A near-field picture holds a few dozen bits for each patch of its scene

The paragraph [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image) asks how
many bits the data carry about the scene, "the one Shannon asked of a telegraph line".[^shannon] "A real signal in
Gaussian noise with power ratio $s^2$ carries at most $\tfrac12\log_2(1+s^2)$ bits", reached when the signal is itself
Gaussian ([3.8](/tutorial/noise/bits/#one-number-read-through-gaussian-noise-carries-at-most-tfrac12log_21-s2-bits),
*checked here*). Adding this over the independent ripples, $q\,\dd q/2\pi$ real numbers per area $z^2$, gives the
**capacity** $\sym{capacity}{C}$, in bits per area $z^2$
([3.8](/tutorial/noise/bits/#a-picture-is-many-ripples-with-independent-noise-and-their-bits-add), *checked here*):

{{paper eq:capacity-integral}}

Where $s > 1$ the logarithm is close to $2\log_2s$; integrating up to $q_c$ and using $\ln(\pi\SNR) = q_c - \ln q_c$
gives the closed form ([3.8](/tutorial/noise/bits/#where-a-ripple-stands-well-above-its-noise-it-carries-log_2-s-bits),
*checked here*):

{{paper eq:capacity}}

"To within three per cent for $\SNR \ge 10^3$ and half a per cent beyond $10^{10}$": the closed form is 36.8 against the
integral's 37.9 at $10^3$, 2.9% low, and 751 against 754 at $10^{10}$, 0.36% low (3.8, *checked here*).

"The patterns that survive the noise are the components with $q < q_c$, and there are $q_c^2/4\pi$ of them per area
$z^2$": 8.6 at $10^3$. A **pattern** is a ripple the camera keeps. Each carries on average $(q_c/3 - \tfrac12)/\ln2 =
4.3$ bits, "about nine patterns of four bits each" (3.8, *checked here*). This average is the mean of $\log_2s$ over
the patterns, which the paper writes as the mean of $2\log_2s$; the numbers it prints are right.[^mirror]

The rest of the paragraph is numbers, all from the integral: 200.9 bits at $10^6$, "200 bits"; $1.55\times10^4$ at
$10^{30}$, "$1.6\times10^4$"; and $1.78\times10^5$ bits at $10^{70}$, which is 22.3 kilobytes of 8000 bits, spread over
2230 patterns of 79.8 bits, "2200 patterns of 80 bits each" (3.8, *checked here*). "With $q_c \approx \ln\SNR$ the
information grows, eventually, as $(\ln\SNR)^3/12\pi\ln2$", because there are $q_c^2$ patterns of $q_c$ bits; the
approach is slow, 1.60 against 1.78 times $10^5$ bits at $10^{70}$ (3.8, *checked here*).

{{paper fig:capacity}}

The last paragraph compares other channels (3.8). A wave camera resolves "about $(D/\lambda)^2$ directions", each
worth about $\log_2\SNR$ bits, so its bits grow as the first power of the logarithm (*read now, derived in Part 5*).
The cube is "the law of Kolmogorov and Tikhomirov" (*stated in the paper*). The single pixel that learns "twenty-five
numbers" is not the still pixel of *A small camera*: it sits under a sky of gravitational waves, and its response is
of degree four in each wave's direction, so it reads $1 + 3 + 5 + 7 + 9 = 25$ patterns (*read now, derived in Part
9*). And "about 450" gravitons counted in a year carry at most $450\log_2M$ bits for $M$ cells, "less than a kilobyte"
while $M < 2^{17.8}$ (the 450 *read now, derived in Part 10*).

## The space below a flat camera is hyperbolic

The paragraph [*The geometry of the near field*](/paper/#par:the-geometry-of-the-near-field) writes the potential as
$\sym{lifted-potential}{\field u} = z^{1/2}\field\Phi$ and finds

{{paper eq:hyperbolic}}

where $\sym{hyperbolic-laplacian}{\nabla_H^2}$ is the Laplacian of the line element $(\dd x^2 + \dd y^2 + \dd
z^2)/z^2$, the rule that measures each small step in units of its depth
([3.9](/tutorial/noise/positivity/#the-space-below-a-flat-camera-is-hyperbolic), *checked here*). That this is
**hyperbolic space**, with the camera on its boundary at infinity, and that "a change of scale across the camera is a
displacement in depth" are both shown in 3.9 (*checked here*). The substitution's use in Calderón's problem is *stated
in the paper* [@Isozaki2004]. Because a change of scale is a rigid move of this geometry, "the blur is a fixed angle"
and "the number of patterns resolved is counted per area $z^2$" (3.9, *checked here*).

{{paper fig:near-field-geometry}}

"The precision with which a source can be placed is a metric on the scene, and it is of the same kind." The paper's
metrics for a mass inside a sphere of sensors are *stated in the paper*, but one part can be checked. Near the sensors
the tidal metric weighs a step in depth by 4 and a step across by 10, so a step across counts $5/2$ times as much.
Chapter 3.9's flat array has the Fisher metric $\mathcal R^2(\tfrac52\,\dd x_0^2 + \tfrac52\,\dd y_0^2 + \dd
z^2)/z^2$, with the same ratio (3.3, 3.9, *checked here*). The last sentence, that the harmonic measure of the sphere
"has the hyperbolic metric exactly", is *stated in the paper*; it holds exactly in two dimensions, but in three the weights
along and across the radius differ, by 10% at 0.6 of the radius.[^itoh]

The section ends: "The near field is where everyday things are visible, and it can never be sharp. Sharp images need
waves." The first sentence is the blur law of 3.7 (*checked here*); the second is Part 5's, read in R5.

## The capstone: imaging the locked safe from start to finish

We now follow the safe once more, from the first readings to the limit of what any camera could see, with the whole of
Part 3. Each step names the chapters that supply it, and Figure [](#fig:read-iv2-capstone) draws the six steps.

![The capstone in six panels. (a) Above, the gold's own reading $\curv{\tE}_{xx}$ along a row of pixels 3.5 m long
at the camera (orange, in $10^{-10}\unit{s^{-2}}$, against the place along the row in metres), small against the noise
of one reading at $\SNR = 10^3$ (the thin blue band) and at $\SNR = 10$ (the wide band); below, the two safes' scores
at $\SNR = 10$, in noise standard deviations, 1.81 apart, with the 18.3% of each beyond the midline shaded. (b) The
scene from above, to scale: the metre-wide array at the left and the two safes 3.5 m away. The orange wedge is this
array's blur, 32.4° wide and 1.98 m along its arc at 3.5 m; the grey lines bound the 24.0° blur of an array as wide as
the scene is deep. Both are wider than the gap between the safes. (c) The whitened gains on a logarithmic scale,
largest first: only 17 of the 231 stand above the noise (the blue line at one), and the 113 not drawn are below
$10^{-10}$. (d) Above, the Cramér–Rao ellipse of a point of gold: its error in mass across, in kg, and in depth
upward, in cm (farther is up), 25 kg by 9.1 cm and almost a line, because a farther bar that is heavier reads nearly the
same. Below, the mass the positive image finds in the right safe over 3000 draws of the noise, in kg, counted on a
logarithmic scale so that the single draws of the long tail show, with their mean of 315 kg (orange) and the true
324 kg (dashed). (e) The 38 bits of a patch at $\SNR = 10^3$, one cell each: the
answer uses one for the safe (dark) and four for the mass (orange). (f) The bar's face, 30 cm by 14 cm, as an array as
wide as the scene is deep (left, a blur of 9 cm) and this array (right, 13 cm) would draw it at the quantum ceiling;
its true outline in a hairline. The right image uses the left one's pattern widened to 13 cm, and the faint rings of
both patterns, below 15% of the brightest value, are left out.](tut-read-iv2-capstone){#fig:read-iv2-capstone}

**(a) Find the safe.** With the room and the safes subtracted, the gold's largest recorded reading on the metre-wide
array is $4.1\times10^{-10}\unit{s^{-2}}$, in the component $\curv{\tE}_{yz}$. The stretch along the camera's axis,
$-\curv{\tE}_{zz}$, reaches $7.8\times10^{-10}\unit{s^{-2}}$ at the pixel nearest the gold, 3.66 m from it, but
$\curv{\tE}_{zz}$ is not among the five components a pixel records (1.4, 1.5). At $\SNR = 10^3$ the noise of one
reading is $\sigma_n = 3.5\times10^{-11}\unit{s^{-2}}$, or 0.035 eötvös, where one **eötvös** (E) is
$10^{-9}\unit{s^{-2}}$ (3.2). At $\SNR = 10$ it is 3.5 E, 8.6 times the gold's largest recorded reading, so no single
pixel sees the gold. The 605 readings together still name the right safe 82% of the time (3.3).

::: try {#which-safe}
Predict first: doubling the ratio from 10 to 20 doubles the separation $D$ of the two safes' readings. Will it halve
the share of wrong choices, or cut it by more? Write a percentage down, then set the slider to 20 and run trials until
the count settles. Compare the count with the predicted $P(Z > D/2)$ beside it.
:::

**(b) See the blur.** Finding the gold is not drawing it. At $10^3$ an array as wide as the scene is deep would blur
every point by 24.0°, 1.47 m at 3.5 m (3.7), and this small camera blurs by 32.4°, 1.98 m (2.3). Either blur is wider
than the 1.4 m between the safes, and far wider than the bar, which spans 4.4° from the array's centre.

**(c) Fail to weigh it.** The Gaussian image keeps only 17 of its 231 patterns above the noise and weighs a safe to
$\pm729$ kg (3.4, 3.5). Averaged over the noise it puts 228 kg in the right safe and $-23$ kg in the left, but one draw
of the noise gives 100 kg in the right and 187 kg in the left: a single image cannot even name the safe.

**(d) Weigh it by positivity.** Told only that mass lies in the plane of the safes and is never negative, the positive
image finds $315 \pm 20$ kg in the right safe and less than a kilogram in the left (3.9). The whole image holds about 340 kg,
26 kg of it in a few cells elsewhere, because noise that would push a cell below zero is cut off while noise that
pushes a cell up is kept.

How good is $\pm20$ kg? If the gold were known to be one point, the Cramér–Rao bounds for this array at $10^3$ would
be 2.9 cm and 3.5 cm across, 9.1 cm in depth and $\pm25$ kg (3.3, 3.4). Depth and mass are almost confused, because a
farther, heavier bar reads nearly the same; with the depth known, the mass bound falls to $\pm2.2$ kg. The positive
image knows the depth but not that the gold is one point, and its 20 kg lies between the two. This is the cost of a
small camera: the endless plane's formulas would give 2.9 mm, 4.6 mm and 0.29% at this depth, ten times better or
more.

**(e) Count the bits.** The plane of the safes, 5 m by 2.5 m at 3.5 m, is about one patch of area
$z^2 = 12.25\unit{m^2}$, so a wide array's data carry about 38 bits about it (3.8); this array's own 231 patterns
carry 39.[^bits] The answer "the right safe, $315 \pm 20$ kg" uses about one bit for the safe and
$\log_2(324/20) = 4.0$ bits for the mass: five of the thirty-eight.

**(f) Reach the quantum ceiling.** For the gold itself, 324 kg watched for the age of the universe, the ceiling of
*Limits on sensitivity* is $1.2\times10^{71}$ (*read now, derived in Part 8*). An array as wide as the scene is deep
would then blur by 1.49°, 9 cm at 3.5 m, and this one by $\pi/86.1 = 2.09°$, 13 cm. Either would draw the bar as a
blurred block, and neither would show a stamp on its face, though each patch would hold $1.9\times10^5$ bits.

So the safe's story runs through the whole of Part 3. At a signal-to-noise ratio of 10 the camera names the wrong safe
18% of the time, and at $10^3$ its most cautious picture still blurs the two safes together and weighs them only to
$\pm730$ kg. Told one more fact, that mass is never negative, the same readings put $315 \pm 20$ kg in the right safe,
an answer that uses five of the data's 38 bits.

## The ledger: after Part 3, every equation of Section IV but five can be derived

Section IV has twenty numbered equations. R2 read the first six, then [](/paper/#eq:evanescent) and
[](/paper/#eq:array-data), the eleventh and twelfth; this chapter reads the last eight.

| Equation | What it says | After Part 3 | Where it is derived |
|---|---|---|---|
| [](/paper/#eq:wiener) | each ripple is kept with weight $s^2/(1 + s^2)$ | derived | 3.5, 3.7 |
| [](/paper/#eq:cutoff) | the cut-off $q_ce^{-q_c} = 1/\pi\SNR$ | derived | 3.7 |
| [](/paper/#eq:resolution) | the blur is $4.43/q_c$ | derived | 3.6, 3.7 |
| [](/paper/#eq:handheld) | a small camera reaches degree $\ell_{\max}$ | derived (sketch) | 2.3, 3.7 |
| [](/paper/#eq:shear-zeros) | the zeros of the shear give the centre and quadrupole | derived | 1.5b, 3.9 |
| [](/paper/#eq:capacity-integral) | the bits per area $z^2$ | derived | 3.8 |
| [](/paper/#eq:capacity) | their closed form | derived | 3.8 |
| [](/paper/#eq:hyperbolic) | Laplace's equation in hyperbolic space | derived | 3.9 |

With R2's ledger, fourteen of the twenty are now derived in full and [](/paper/#eq:current-column) in its integral. Five
wait: [](/paper/#eq:magnetic-point) for chapter
[7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight),
and the four of heat and an applied tide, the seventh to the tenth, for Part 4 and R4. Part 3 has also given Section
XII's [](/paper/#eq:hair-bits) (3.8).

::: check
### Q

Why can the same data place a single mass to a millimetre and yet draw it 24° wide?

### A

Precision depends on how fast the predicted readings change when the mass moves, in units of the noise, and every one
of the many readings moves a little (3.3). The blur limits the picture of a scene that might hold anything, where the
fine ripples are lost in the noise (3.7).

### Q

What single assumption turns $\pm730$ kg into $315 \pm 20$ kg?

### A

That mass is never negative. It forbids the thin halos of negative mass round the safe in which the Gaussian image's
doubt hides.

### Q

Which of Section IV's claims rest on physics that Part 3 does not derive?

### A

The black-hole bound on the camera's mass (11.1), the quantum speed limit and the ceiling of $10^{70}$ (8.6), the
quantum scene and its decoherence
([8.1](/tutorial/quantum/states/#a-record-of-the-place-multiplies-the-interference-by-the-overlap-of-the-records),
[13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell)), the wave camera's count
of directions (5.3), the single pixel's 25 numbers (Part 9) and the 450 gravitons (Part 10).
:::

**The idea to keep: Section IV's second half follows from Part 3. A near-field picture blurs by an angle set by the
logarithm of the sensitivity and holds only a few dozen bits per patch, yet a simple scene, a bar of gold in one of two
safes, is found and weighed precisely, because the camera spends those bits on a few numbers and mass is never
negative.**

::: problems
### Practice

Rerun *Limits on sensitivity* for a ball of 1 kg watched for one year. Find the ceiling $\matter M_sc^2\tau/\hbar$, the
cut-off $q_c$ and the blur of an array as wide as the scene is deep.

::: solution
A year is $3.156\times10^7$ s, so the ceiling is $1 \times (3.00\times10^8)^2 \times 3.156\times10^7/1.055\times10^{-34}
= 2.7\times10^{58}$. The cut-off solves $q_ce^{-q_c} = 1/\pi\SNR$: $q_c = 140.6$. The blur is $4.43/140.6 = 0.0315$
radians, or 1.80°, against 1.51° for a person watched for the age of the universe: twelve more powers of ten of
sensitivity narrow the blur by only a sixth.
:::

### Stretch

Combine chapters 3.3 and 3.8. At $\SNR = 10^3$ a near-field picture holds about 38 bits per patch, and a single mass at
1 m is placed to 0.82 mm across and 1.3 mm in depth and weighed to 0.29%. Roughly how many bits do these four numbers
use, if beforehand the place was known only to within the blur, 42 cm, in each direction, and the mass only to within
its own size?

::: solution
Each coordinate across is one of $420/0.82 = 512$ cases, $\log_2512 = 9.0$ bits, and there are two. The depth is one
of $420/1.3 = 323$, 8.3 bits. The mass is one of $1/0.0029 = 345$, 8.4 bits. In all $9.0 + 9.0 + 8.3 + 8.4 = 35$ bits,
close to the 38 of a patch: a simple scene spends nearly the whole budget on four numbers.
:::

### The paper

Reproduce the numbers of *A worked case*: the 1.8 standard deviations and 18% at $\SNR = 10$, the ratio 34 for one
error in a thousand, and the small camera's blur from the paper's equation [](/paper/#eq:handheld), against the
paper's "about $33^\circ$, two metres".

::: solution
The two safes' predictions lie $D = 1.81$ noise standard deviations apart at $\SNR = 10$, so $P(Z > 0.906) = 0.183$.
Since $D = 0.181\,\SNR$, one error in a thousand, $D = 6.18$, needs $\SNR = 34.1$. With $2r/D = 7$, $\ell_{\max} = 2 +
\ln10^3/\ln7 = 5.55$, and $\pi/5.55 = 0.566$ radians $= 32.4°$, 1.98 m at 3.5 m. The paper rounds this to "about
$33^\circ$"; its two metres stand.
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
  explains the Schwarzschild radius behind "without becoming a black hole", and [section
  22.8](https://neovand.github.io/general-relativity/chapter-22.html#22-8-entropy-is-written-in-area) meets another
  bound on information set by gravity.
- Reading chapter [R4](/tutorial/response/reading-section-iv-3/) reads Section IV's heat, applied tide and thermometer after Part 4; R5 reads Section III and the
  waves that make sharp pictures.
- Robert L. Parker, *Geophysical Inverse Theory* (Princeton, 1994): the geophysicist's view of non-uniqueness,
  regularization and positivity, the three ideas of this part.
:::

[^sparrow]: It is 2% wider at $10^3$ and 4% at $10^{60}$. The caption says so "as for any image formed in
    amplitude"; that holds for the round pupil's $2J_1(x)/x$, but a Gaussian picture's Sparrow separation is below its
    full width (3.7).

[^goce]: The paper's "between 0.01 and 0.02 E in a second" reads a noise density of 10 to
    $20\unit{mE\,Hz^{-1/2}}$ as a one-second noise, which is $\sqrt2$ quieter (3.2's practice problem).

[^code]: The numbers of the worked case and the capstone come from the paper's reference code,
    `reference/gravcam/inversion.py`, which follows Appendix A, as in 3.9.

[^layer]: On the safes' own patch, 5 m by 2.5 m and a few metres from the array, the uniform layer is one of the
    best-measured patterns, with 0.94 of the largest whitened gain
    ([3.4](/tutorial/noise/symmetric-matrices/#for-a-flat-array-the-patterns-are-ripples)).

[^draws]: Appendix A says "over forty draws of the noise". Forty cannot pin a spread of 20 kg: with the reference
    code's seed, the first ten sets of forty give means of 312 to 318 kg and spreads of 14.5 to 45 kg. The printed
    $316 \pm 20$ needs thousands of draws.

[^superres]: Section IV cites Donoho and Candès with Fernandez-Granda, whose theorems allow sources of either
    sign. The theorem for positive sources on a grid is Morgenshtern and Candès's [@MorgenshternCandes2016], which
    Section IV does not cite; 3.9's *Go deeper* gives its conditions.

[^shannon]: The bound used here is Shannon's for a continuous signal in white Gaussian noise; the telegraph was his
    example of a discrete channel (3.8).

[^mirror]: Each real number carries $\tfrac12\log_2(1 + s^2) \approx \log_2s$ bits, and $q_c^2/4\pi$ counts real
    numbers. The paper's $2\log_2s$ is the content of a ripple and its mirror together, and there are half as many
    such pairs (3.8).

[^itoh]: The harmonic measure seen from a point inside a ball, the skin of balayage of
    [2.4](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage),
    has a Fisher metric with one weight in every direction only at the centre; at 0.6 of the radius the weight along
    the radius is 10% larger. Itoh and Shishido [@ItohShishido2008] treat the Poisson kernel of hyperbolic space, which
    is exactly hyperbolic and in two dimensions is the same family.

[^bits]: The paper's prior, one mass $\matter m$ per area $z^2$, gives each cell of $0.0625\unit{m^2}$ the spread
    $324\unit{kg} \times \sqrt{0.0625/12.25} = 23\unit{kg}$. The 39 bits are $\sum\tfrac12\log_2(1 + s_i^2)$ over
    3.4's whitened gains $s_i$; a finite patch is not the paper's endless sheet, so 39 and 38 agree in size only.
