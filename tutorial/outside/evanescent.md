---
id: '2.7'
title: 'Fading detail: evanescent fields'
question: 'Why does a ripple of mass with crests ten centimetres apart look 500 times fainter from ten centimetres away, and 300,000 times fainter from twenty?'
part: '2'
requires: ['1.3', '1.4', '2.1', '2.4', '2.5', '2.6']
paper: [sec:near-field, eq:evanescent, eq:array-data, fig:nearfield, tab:resolution, sec:no-lens, eq:scene-transform, eq:cone]
figures: [fig:nearfield]
live: [fading-ripple, near-field-blur]
depth: A
---

Picture a body with ripples of mass whose crests are ten centimetres apart. Seen from ten centimetres away, the signal
of the ripples is about 500 times weaker than at the surface of the body. Seen from twenty centimetres, it is about
300,000 times weaker, and the body looks like a hand under a thick blanket. Two line masses buried side by side, half
their depth apart, merge in the same way: the row of pixels above them records one smooth bump.[^first]

{{paper fig:nearfield}}

Why does a ripple with crests ten centimetres apart look 500 times fainter from ten centimetres away, and 300,000 times
fainter from twenty? Section 2.4 stated a fade by $e^{-kz}$ and section 2.6 wrote the array's data with a factor
$2\pi G\,k\,e^{-kz}$. We derive both one ripple at a time, and then see why the camera cannot undo the fade without
enlarging its noise.

::: plain
In empty space the potential obeys Laplace's equation. That rule allows a ripple of the potential only one way to
change with height: it fades, exponentially, and a ripple whose crests are closer together fades faster. Crests ten
centimetres apart lose a factor of 535 over ten centimetres of height, and 535 times 535, about 290,000, over twenty.
The fade depends only on the ratio of the height to the spacing of the crests, so the sharpness of the camera's
picture is an angle, the same for a scene a metre away and for a scene a kilometre away.

The camera reads the tide, which brings in one more factor, proportional to how fine the ripple is. That factor is zero
for a layer that does not vary at all, which is why a uniform layer is invisible to the camera.

To recover a faded ripple, the camera must enlarge it again, and it enlarges its noise by the same factor. The finest
ripple whose enlarged noise is still smaller than its signal sets the sharpness of the picture.
:::

## In empty space a ripple can only fade

We want to know how a ripple of the potential changes with height above a scene (Figure [](#fig:evan-hero) shows three).

We use one geometry for the whole section. The scene lies in a flat horizontal plane, and the sensors lie in a
parallel plane above it. A position across the planes is $\vect a = (a_1, a_2)$, in metres, as in section
[2.6](/tutorial/outside/fourier/#across-a-plane-a-ripples-wavevector-points-across-its-crests). The letter $h$ is a
height that varies, measured in metres up from the plane of the scene. The letter $z$ is one fixed height, that of the
sensors, so $z$ is also the depth of the scene below the sensors. Section 2.4 gives these two letters other jobs, as the
table shows:

| Letter | In this section | In section 2.4 |
|:--|:--|:--|
| $h$ | a height above the scene, which varies | a harmonic function |
| $z$ | the fixed height of the sensors above the scene | a height above the camera's plane, which varies |

![A slab whose density has three corrugations, with crests spaced 4 : 2 : 1, orange where its density is above the mean
and blue below. On planes at the heights $z$ and $2z$, where $z$ is half the finest spacing, each ripple of the potential
keeps the fraction $e^{-kh}$ of its size at the slab, so the finest ripple has faded by $e^{2\pi} = 535$ at $2z$. The
heights of the planes and of the ripples are chosen for the drawing.](tut-evan-hero){#fig:evan-hero}

We assume that **the space above the scene is empty**, so that the potential
$\sym{potential}{\field\Phi}$, in joules per kilogram, obeys Laplace's equation $\nabla^2\field\Phi = 0$ there
(section [1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point)). We look for a
potential that has the shape of one ripple across the plane, multiplied by some function of the height:

$$\field\Phi = \cos(\vect k\cdot\vect a)\,f(h) .$$

Here $\sym{wavevector}{\vect k}$ is the ripple's wavevector, in $\mathrm{m^{-1}}$, which points across its crests, and
$\sym{wavenumber}{k} = |\vect k|$ is its wavenumber, so the crests are $2\pi/k$ apart. The function $f$, in joules per
kilogram, is unknown. Writing a solution as a product of functions of one variable each, so that an equation in
several variables falls apart into equations in one, is called **separation of variables**.

The two second derivatives along the plane bring down $-k_1^2 - k_2^2 = -k^2$, as in section 2.6, and the second
derivative along the height acts on $f$ alone. So Laplace's equation reads

$$-k^2\cos(\vect k\cdot\vect a)\,f(h) + \cos(\vect k\cdot\vect a)\,f''(h) = 0 .$$

We divide by the cosine, at the places where it is not zero, and an equation for $f$ alone is left:

$$f''(h) = k^2 f(h) .$$

Each of $e^{kh}$ and $e^{-kh}$ solves it, because each derivative brings down $+k$ or $-k$, and two of them bring
down $k^2$. The equation is linear, since $f$ appears once in each term and is never squared. So any combination of
the two solutions also solves it, with two constants $A$ and $B$ in joules per kilogram:

$$f(h) = A\,e^{-kh} + B\,e^{kh} .$$

There are no other solutions. An equation that gives the second derivative of $f$ fixes $f$ at every height once its
value and its slope at one height are chosen, as the path of a falling stone is fixed by where it starts and how fast.
At $h = 0$ the combination has the value $A + B$ and the slope $k(B - A)$, and a choice of $A$ and $B$ matches any
value and any slope. So every solution has this form.

The second term grows without limit far above the scene. All the sources lie below, so the potential above must stay
bounded, the condition that section
[2.4](/tutorial/outside/greens-functions/#above-a-flat-camera-a-mirror-image-gives-the-potential-at-every-height)
used for a ripple. A condition that a solution must meet far away is called a **boundary condition at infinity**. A
potential that grew without limit away from all its sources would need sources far away to make it, and there are
none. So $B = 0$, and $A$ is the size of the ripple at the top of the scene, $h = 0$:

$$\boxed{\;\field\Phi = A\cos(\vect k\cdot\vect a)\,e^{-kh} .\;} \label{eq:fade}$$

A field that dies away exponentially with the distance from its sources, without oscillating as it goes, is called
**evanescent**, from the Latin for "vanishing".[^evan] The ripple keeps its shape along the plane and fades straight up.
Every pattern across the plane is a sum of ripples (section 2.6), and Laplace's equation is linear, so each ripple of
any pattern fades on its own, by its own factor. The same steps with the complex ripple $e^{i\vect k\cdot\vect a}$ of
section 2.6 in place of the cosine give $e^{i\vect k\cdot\vect a - kh}$.

**A number.** Crests 10 cm apart have $k = 2\pi/0.1\unit{m} = 62.8\unit{m^{-1}}$. At the height $h = 10\unit{cm}$ the
exponent is $kh = 2\pi$, so the ripple is weaker than at the scene by $e^{2\pi} = 535$. At $h = 20\unit{cm}$ the
exponent is $4\pi$, and the factor is $e^{4\pi} = 2.9 \times 10^5$. These are the 500 and 300,000 of the opening. Doubling
the height squares the factor, because $e^{2kh} = (e^{kh})^2$, and that answers the question of this section.
Figure [](#fig:evan-fade) draws the fade for three spacings of the crests.

![On a logarithmic scale the fade $e^{-kh}$ is a straight line against the height $h$, here for crests 1 m, 30 cm and
10 cm apart. The dots on the 10 cm line mark $1/535$ at 10 cm and $1/(2.9 \times 10^5)$ at 20 cm; the 30 cm line reaches
$1/535$ at 30 cm, because only $kh$ enters.](tut-evan-fade){#fig:evan-fade}

**A limit.** As $k \to 0$ the factor $e^{-kh}$ tends to 1, so a ripple with crests very far apart hardly fades, and
neither does its vertical pull, $-\partial_h\field\Phi = kA\cos(\vect k\cdot\vect a)\,e^{-kh}$,
over any height small compared with $1/k$. The pull of a uniform sheet does not weaken with height at all (chapter
[1.3](/tutorial/newton/gauss-and-poisson/#a-uniform-sheet-pulls-equally-at-every-height)), and the
[third section](#a-thin-sheet-makes-each-ripple-of-the-potential-on-its-own) shows that a very broad ripple gives
exactly that pull.

## Only the product of the wavenumber and the height matters

The wavenumber and the height enter the fade only through their product $kh$, a pure number. The reason is that
Laplace's equation holds no length of its own, since every one of its terms is a second derivative. Stretch a solution
ten times in every direction: each second derivative becomes a hundredth of the old one, their sum is still zero, and
the stretched pattern is a solution too. **A number.** Crests 1 m apart have $k = 6.28\unit{m^{-1}}$; seen from 1 m away, $kh = 2\pi$ again, and the fade is
535 again, as it is for crests a kilometre apart seen from a kilometre.

**What it means.** Whether a ripple survives depends on how fine it is compared with its depth, so the blur of the
camera will be an angle. Section [3.7](/tutorial/noise/blur-law/#what-the-law-means) finds that angle exactly.

## A thin sheet makes each ripple of the potential on its own

We want the size $A$ of each ripple, from the matter that makes it. We assume that **the scene is a thin sheet** in
the plane $h = 0$, with **empty space above and below it**. The sheet has a surface density
$\sym{surface-density}{\matter\sigma}(\vect a)$, its mass per unit area, in kilograms per square metre. Its density is
then $\matter\rho = \matter\sigma(\vect a)\,\delta(h)$, where $\sym{delta-function}{\delta}(h)$ is the delta
function of section [1.3](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point), in
$\mathrm{m^{-1}}$, so that the density added up across the sheet's thickness gives $\matter\sigma$. Poisson's equation
reads

$$\nabla^2\field\Phi = 4\pi G\,\matter\sigma(\vect a)\,\delta(h) .$$

We take the Fourier transform across the plane, $\tilde{\field\Phi}(\vect k, h) = \int\field\Phi(\vect a,
h)\,e^{-i\vect k\cdot\vect a}\,\dd^2a$, at each height, with the conventions of chapter
[2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time). By its
derivative rule the two derivatives along the plane become a factor $-k^2$, while the derivative along the height is
untouched:

$$\partial_h^2\tilde{\field\Phi} - k^2\tilde{\field\Phi} = 4\pi G\,\tilde{\matter\sigma}(\vect k)\,\delta(h) .
\label{eq:transformed}$$

Only the one wavevector $\vect k$ appears in [](#eq:transformed): the potential's ripple at $\vect k$ is tied to the
sheet's ripple at the same $\vect k$ and to nothing else. So each ripple of the sheet makes its own ripple of the
potential and no other. Away from the sheet the right side is zero, and the equation is the one of the
[first section](#in-empty-space-a-ripple-can-only-fade). Above the sheet the bounded solution is $C\,e^{-kh}$. Below
it, the same argument facing downward gives $C'\,e^{kh}$, which fades as $h$ becomes more negative. The potential is
continuous across the sheet, so $C' = C$, and

$$\tilde{\field\Phi} = C\,e^{-k|h|} .$$

The constant $C$ comes from the sheet itself. We integrate [](#eq:transformed) over the height from $-\varepsilon$ to
$\varepsilon$, a thin slab around the sheet, with $\varepsilon$ a small length. The term $k^2\tilde{\field\Phi}$ gives
at most $2\varepsilon k^2|C|$, which vanishes as $\varepsilon \to 0$. The delta function gives
$4\pi G\,\tilde{\matter\sigma}$. The second derivative integrates to the change in the slope:

$$\partial_h\tilde{\field\Phi}\big|_{h = 0^+} - \partial_h\tilde{\field\Phi}\big|_{h = 0^-} = 4\pi G\,\tilde{\matter\sigma} .$$

This is the pillbox of section 1.3, ripple by ripple: the slope of the potential jumps by $4\pi G$ times the surface
density across the sheet, which makes the corner of Figure [](#fig:evan-jump). The slope is $-kC$ on the upper side and $+kC$ on the lower side, so
$-2kC = 4\pi G\,\tilde{\matter\sigma}$, and

$$\boxed{\;\tilde{\field\Phi}(\vect k, h) = -\frac{2\pi G}{k}\,\tilde{\matter\sigma}(\vect k)\,e^{-k|h|} .\;} \label{eq:sheet}$$

The units agree: $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg} \times \mathrm{m} = \mathrm{m^4\,s^{-2}}$, the unit of a
potential times a square metre. A real sheet $\matter\sigma_1\cos(\vect k\cdot\vect a)$, with $\matter\sigma_1$ in
$\mathrm{kg\,m^{-2}}$, has by the same steps the potential
$-(2\pi G\matter\sigma_1/k)\cos(\vect k\cdot\vect a)\,e^{-k|h|}$, the size $A$ of [](#eq:fade).

![The transformed potential of one ripple, $\tilde{\field\Phi} = C\,e^{-k|h|}$, against the height $h$ drawn upward,
has a sharp corner at the sheet, which is marked in orange. Its slope is $-kC$ on the upper side of the sheet and
$kC$ on the lower side, so the slope jumps by $-2kC = 4\pi G\tilde{\matter\sigma}$ across the sheet. The horizontal
scale is chosen for the drawing.](tut-evan-jump){#fig:evan-jump}

**A number.** Section 1.3 treats the floor of the locked safe's room as a sheet of $720\unit{kg\,m^{-2}}$. Across it the
slope jumps by $4\pi G\matter\sigma = 6.0 \times 10^{-7}\unit{m\,s^{-2}}$, twice the pull of an endless sheet of the
same density, $2\pi G\matter\sigma = 3.0 \times 10^{-7}\unit{m\,s^{-2}}$, because the pull points down above the sheet
and up below it.

**A limit.** The factor $1/k$ seems to blow up for broad ripples. Near a crest, where $\cos(\vect k\cdot\vect a) \approx 1$,
we expand $e^{-k|h|} = 1 - k|h| + \dots$ for heights small compared with $1/k$:

$$\field\Phi \approx -\frac{2\pi G\matter\sigma_1}{k} + 2\pi G\matter\sigma_1|h| .$$

The first term is a constant, which pulls on nothing, since a pull is a slope. The second is the potential of section
1.3's uniform sheet, with the pull $2\pi G\matter\sigma_1$ toward the sheet on both sides: a very broad ripple looks
uniform from nearby.

## The camera records a tide, which weights each ripple by $k$

We want to know what the array records. Each pixel reads the vertical entry of the tidal tensor with its sign changed,
$\sym{array-reading}{\curv d} = -\curv{\tE}_{zz}$, in $\mathrm{s^{-2}}$, chosen so that a mass below gives a positive
bump (section [2.4](/tutorial/outside/greens-functions/#above-a-flat-camera-a-mirror-image-gives-the-potential-at-every-height)).
By section [1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives),
$\curv{\tE}_{zz}$ is the second derivative of $\field\Phi$ along the vertical, which here is $h$. Above the sheet two
derivatives of $e^{-kh}$ bring down $k^2$, so by [](#eq:sheet)

$$\tilde{\curv{\tE}}_{zz} = \partial_h^2\tilde{\field\Phi} = k^2\tilde{\field\Phi} = -2\pi G\,k\,\tilde{\matter\sigma}\,e^{-kh} .$$

At the sensors, $h = z$, and with the sign changed,

$$\boxed{\;\tilde{\curv d}(\vect k) = 2\pi G\,k\,e^{-kz}\,\tilde{\matter\sigma}(\vect k) .\;} \label{eq:data}$$

With
the noise of the readings added, the array's data are

$$\tilde{\curv d}(\vect k) = 2\pi G\,k\,e^{-kz}\,\tilde{\matter\sigma}(\vect k) + \tilde n(\vect k),$$

where $\tilde n$ is the transform of the noise, a random pattern that section
[3.2](/tutorial/noise/random-signals/#the-variance-of-noise-spread-over-a-plane-falls-as-one-over-the-area)
describes.[^units][^array] Section 2.6 wrote the same readings as a convolution with the
[kernel](/tutorial/outside/fourier/#a-blur-multiplies-each-ripple-by-a-number) $g_z$, the tide of a point mass of one
kilogram, so the factor in [](#eq:data) is the transform $\tilde g_z$ of that kernel. It vanishes at $k = 0$, as the zero
area of $g_z$ requires.

**A check, with a number.** A point mass $\matter m$ has $\tilde{\matter\sigma} = \matter m$ at every $\vect k$
(section [2.6](/tutorial/outside/fourier/#a-point-holds-every-ripple-equally)). The reading straight above it is the
inverse transform at $\vect a = 0$, where $e^{i\vect k\cdot\vect a} = 1$. The integrand then depends only on the length
$k$ of $\vect k$, not on its direction. So we add up the wavevectors in rings: those whose length lies between $k$ and
$k + \dd k$ fill a ring of radius $k$ and width $\dd k$, whose area is $\dd^2k = 2\pi k\,\dd k$. Then

$$\begin{aligned}\curv d(0) &= \int_0^\infty 2\pi G\matter m\,k\,e^{-kz}\,\frac{2\pi k\,\dd k}{(2\pi)^2}\\ &= G\matter m\int_0^\infty k^2e^{-kz}\,\dd k = \frac{2G\matter m}{z^3} ,\end{aligned}$$

because two integrations by parts give $\int_0^\infty k^2e^{-kz}\,\dd k = 2/z^3$. This is chapter
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)'s stretch
$2G\matter M/r^3$ with the mass straight below, and for the person of 70 kg at a metre it is
$9.3 \times 10^{-9}\unit{s^{-2}}$.

**A second number.** Suppose the concrete floor of section 1.3, 1.5 m below the camera, is uneven: its top surface rises
and falls by 1 cm, with crests a metre apart. At $2400\unit{kg\,m^{-3}}$ that is a ripple of
$\matter\sigma_1 = 24\unit{kg\,m^{-2}}$ with $k = 6.28\unit{m^{-1}}$. Here $kz = 9.4$, the fade is
$e^{-9.4} = 8.1 \times 10^{-5}$, and by [](#eq:data) the ripple of the readings has the size
$2\pi Gk\matter\sigma_1e^{-kz} = 5.1 \times 10^{-12}\unit{s^{-2}}$, about 1800 times smaller than the person's tide at a
metre.

**The best-seen ripples.** At a fixed depth the factor $k\,e^{-kz}$ rises from zero, then falls with the fade. Its slope, $(1 - kz)\,e^{-kz}$, is zero at $kz = 1$, so the ripples the camera sees most
strongly have crests $2\pi z$ apart: 6.3 m apart for a scene a metre below. Figure [](#fig:evan-kernel) marks this peak
beside the factors of the two sensors described next.

![The factors with which three sensors record a ripple, against $q = kz$ and up to constant factors: the tide's
$q\,e^{-q}$ (multiplied by $e$ so that its peak at $q = 1$ is 1), the pull's $e^{-q}$ and the potential's $q^{-1}e^{-q}$.
Only the tide's factor has a peak and vanishes for the broadest ripples; all three share the fade at large $q$.](tut-evan-kernel){#fig:evan-kernel}

**Other sensors.** The same steps give the factors for sensors that read other parts of the field, which section 3.7 compares. A sensor that compares clocks
reads the potential itself (chapter
[1.2](/tutorial/newton/field-and-potential/#a-potential-is-one-number-per-point-whose-downhill-slope-is-the-field)),
and by [](#eq:sheet) at $h = z$ its factor goes as $k^{-1}e^{-kz}$. An **accelerometer** is an instrument that
measures the pull of gravity on a small test mass held inside it, in $\mathrm{m\,s^{-2}}$. A very precise accelerometer that reads the vertical pull is a **gravimeter**, and here the two words name the same
instrument. It reads the upward component of the pull, $-\partial_h\field\Phi$. One derivative of $e^{-kh}$ brings
down $-k$, so the transform of its reading is

$$-\partial_h\tilde{\field\Phi}\big|_{h = z} = -2\pi G\,\tilde{\matter\sigma}\,e^{-kz} ,$$

whose minus sign says that the pull points down, toward the sheet. Its factor goes as $e^{-kz}$, and the tidal
pixel's goes as $k\,e^{-kz}$.

Each of these factors is the transform of a kernel (section 2.6): the reading that a point mass of one kilogram gives
across the plane. For clocks that kernel is the potential $-G/\sqrt{a^2 + z^2}$, for accelerometers
the upward pull $-Gz/(a^2 + z^2)^{3/2}$, and for tidal pixels $g_z$. With $q = kz$ the factors go as $q^{-1}e^{-q}$,
$e^{-q}$ and $q\,e^{-q}$, up to constant factors. Every reading shares the fade, and each derivative adds one factor
of $k$; a derivative along the plane brings down $ik_1$ or $ik_2$, of size at most $k$, so the other components of the
tide carry the same fade.

## Only the uniform part of a layer is lost, and the factor $k$ is the reason

Section 1.3 found that an endless uniform sheet pulls with $2\pi G\matter\sigma$ at every height,
$3.0 \times 10^{-7}\unit{m\,s^{-2}}$ for a density of $720\unit{kg\,m^{-2}}$, and chapter
[2.5](/tutorial/outside/null-space/#a-uniform-sheet-is-invisible-to-a-tidal-camera) put such a sheet in the tidal
camera's blind spot. Ripple by ripple, the reason is the factor $k$ in [](#eq:data). An endless uniform sheet has all
its density in the one ripple $\vect k = 0$, which has no crests (section 2.6), and there the factor is zero. At every
other $\vect k$ it is not zero. So in a record without noise the camera loses exactly one ripple of a layer, its mean,
and sees every ripple that varies, however broad; in a noisy record the factor $k$ also makes the very broadest
ripples fainter than their noise, a small loss that section 3.7 measures.

The real floor is finite, and its edges are made of ripples with $k \neq 0$, which is why it makes a tide of
$4.5 \times 10^{-8}\unit{s^{-2}}$ at the camera (section 1.3). The accelerometer's factor has no $k$: at
$\vect k = 0$ it gives a pull of $2\pi G\matter\sigma$ toward the sheet, the pull of section 1.3. So a gravimeter
sees the mean that a tidal camera cannot. A uniform sheet is invisible to the tidal camera and plain to a gravimeter.

## Undoing the fade multiplies the noise

We want an order-of-magnitude estimate of the finest detail the camera can recover. To recover the scene, the camera
divides each ripple of its data by its factor:

$$\frac{\tilde{\curv d}}{2\pi G\,k\,e^{-kz}} = \tilde{\matter\sigma} + \frac{\tilde n}{2\pi G\,k\,e^{-kz}} .$$

The first term is the scene. The second is the noise, multiplied by $e^{kz}/(2\pi Gk)$. This is [downward continuation](/tutorial/outside/greens-functions/#above-a-flat-camera-a-mirror-image-gives-the-potential-at-every-height)
(section 2.4), carried all the way down to the sheet. The noise is added at the sensors, after the fade, so it has not
faded.

We take the noise to be white: the noise of each pixel is independent of every other.
Section [3.2](/tutorial/noise/random-signals/#the-variance-of-noise-spread-over-a-plane-falls-as-one-over-the-area)
shows that such noise is equally strong in every ripple, as white light holds every colour equally. Dividing by the
fade therefore enlarges the noise of a ripple by $e^{kz}$; this growth is called **noise amplification**. For ripples with crests 10 cm apart, seen from 20 cm, the factor is $2.9 \times 10^5$.

**The inputs.** Suppose that a ripple of the scene that did not fade at all would stand $\sym{snr}{\SNR}$ times above
its noise. Here $\SNR$ is the camera's signal-to-noise ratio, defined loosely for this estimate; chapter
[3.7](/tutorial/noise/blur-law/#step-1-one-number-measures-the-camera) defines it exactly. We take the scene's ripples
to be of similar size before the fade, and we ignore the factor $k$, which changes slowly compared with the
exponential. No ripple escapes the fade entirely: even the best-seen ones, at $kz = 1$, keep only $e^{-1} = 0.37$ of
their size. Measuring $\SNR$ on them instead would change the answer only by a factor of order one, so we leave it out.[^e]

**The arithmetic.** After the fade, a ripple of wavenumber $k$ stands above its noise by $\SNR\,e^{-kz}$. It is lost
once this ratio falls below one, that is, once $e^{kz} > \SNR$. Taking the logarithm of both sides, it is lost once
$kz > \ln\SNR$. The finest ripple kept therefore has

$$k_{\max} = \frac{\ln\SNR}{z} ,$$

in $\mathrm{m^{-1}}$. Its crests are $2\pi/k_{\max}$ apart, and the narrowest feature it can draw is half of that, from
a crest to a trough. So detail finer than

$$\boxed{\;\frac{\pi z}{\ln\SNR}\;}$$

cannot be recovered, which is an angle of $\pi/\ln\SNR$ radians seen from the camera. [^estimate]

**The answer.** At $\SNR = 10^3$ and $z = 1\unit{m}$, $\ln\SNR = 6.9$, so $k_{\max} = 6.9\unit{m^{-1}}$, with crests
0.91 m apart, and the finest detail is 0.45 m, an angle of 0.45 radians, or 26.1°. At $10^6$ the estimate gives 13.0°: a thousand times the sensitivity adds
only $\ln 1000 = 6.9$ to $k_{\max}z$. To see ripples with crests 10 cm apart from a metre away, with
$kz = 20\pi$, the camera would need $\SNR \approx e^{20\pi} = 1.9 \times 10^{27}$.

**The comparison.** Section [3.7](/tutorial/noise/blur-law/#step-4-solving-the-cut-off-needs-a-logarithm-of-a-logarithm)
keeps the factor $k$ and uses the best reconstruction of section 3.5. It finds an exact blur of 24.0° at $\SNR = 10^3$,
and shows that the exact cut-off approaches $\ln\SNR/z$ as the sensitivity grows. The estimate already holds the law's
main point: sensitivity buys sharpness only through its logarithm.

## The same fade appears for every field that obeys Laplace's equation

The [first two sections](#in-empty-space-a-ripple-can-only-fade) used only Laplace's equation in empty space, not
gravity, so the same fade, and the same logarithmic limit on undoing it, appear for the electric potential above a
plate with patches of charge and in surveys of the magnetic field of rocks. Sound and light obey the wave equation, and
their ripples across a plane fade in the same way when they are finer than a wavelength.

No lens can sharpen the gravitational near field, because its blur comes from Laplace's equation itself.[^nolens] For
light the answer is different. A material's permittivity says how strongly its charges shift in an electric field, and
a slab whose permittivity is negative, as a metal's is for some colours of light, makes the fading ripples grow again
inside it and restores the fine detail [@Pendry2000]. Matter can do this for light because it holds charges of both
signs. It answers a tide only by deforming, and the change this makes in the field is far too small to undo the fade.

::: history
### Continuing a field toward its sources

Geophysicists continue gravity and magnetic surveys downward to sharpen buried features. Garry Clarke designed
filters for it in 1969 that weigh each ripple against its noise [@Clarke1969], in the spirit of the best
reconstruction of section 3.5. Robert Parker showed in 1973 how to compute the field of a buried layer ripple by
ripple with the fast Fourier transform [@Parker1973]. In 1980 E. G. Williams and J. D. Maynard introduced near-field
acoustic holography (*Physical Review Letters* 45, 554): microphones held close to a vibrating body record its
evanescent sound before it fades, and undoing the fade draws detail finer than the wavelength. With Y. Lee they set
out its full theory in 1985 [@MaynardWilliamsLee1985].

In each of these fields the noise of a ripple grows as $e^{kz}$ on the way down, so sharper detail costs sensitivity
exponentially, and the limit is this section's. The acousticians state it with the dynamic range $D$ of the
recording in decibels, so that $\SNR = 10^{D/20}$: two sources a distance $d$ from the microphones can be told apart
when they are about $20\pi d/(D\ln 10) = 27.3\,d/D$ apart. This is $\pi d/\ln\SNR$, the estimate of the section on
noise: a recording with 40 dB of range resolves about $0.68\,d$.
:::

::: try {#fading-ripple}
The figure opens on a ripple with crests 10 cm apart and sensors 10 cm above it. Answer the prediction at its top, then
move the two sliders together: halving both leaves the fade unchanged, because only $kz$ enters. Last, switch the reading
between the potential, the pull and the tide, and watch the factor of $k$ change which ripples are seen best.
:::

::: try {#near-field-blur}
The figure shows two buried line masses at the sensitivity you choose, the record of the row of pixels above them and
the best reconstruction (section 3.5), which keeps each ripple in proportion to how far it stands above its noise. The
sensitivity is the $\SNR$ of the [section on noise](#undoing-the-fade-multiplies-the-noise). Drag the sliders, or use
the arrow keys.

First lower the sensitivity to 10. Predict how far apart the masses must be before the record shows two bumps, and widen
the separation until it does; the record holds no noise, so its merging is the fade alone. Then set the separation to
0.5 depths and raise the sensitivity slowly. The record does not change, but the reconstruction separates the masses
once the camera can afford to enlarge the faded ripples that tell them apart.

At the sensitivity $10^3$ the figure reports a blur of 0.36 depths, not the 0.45 of the estimate: a row of pixels over
line masses has its own exact blur, $3.79/q_c$ radians, where $q_c$ is section 3.7's counterpart of $k_{\max}z$, and it
is 20.7° at $10^3$, against 24.0° for a flat array over point masses.
:::

**The idea to keep: above the scene, a ripple of wavenumber $k$ fades as $e^{-kz}$. The camera can enlarge it again
only by enlarging its noise as much.**

::: problems
### Practice

**[2.7]** Show directly that the Fourier transform across the plane of section 2.4's half-space kernel,
$\sym{half-space-kernel}{P_z}(\vect a) = \dfrac{z}{2\pi(a^2 + z^2)^{3/2}}$, is $e^{-kz}$, so that upward
continuation by the height $z$ multiplies each ripple by its fade. Use [](#eq:sheet) for a point mass, and the fact
that $P_z$ is a derivative with respect to $z$.

::: solution
A point mass $\matter m$ at the origin has $\tilde{\matter\sigma} = \matter m$, and its potential at the height $h$ is
$-G\matter m/\sqrt{a^2 + h^2}$. By [](#eq:sheet) its transform across the plane is $-2\pi G\matter m\,e^{-kh}/k$.
Dividing by $-G\matter m$ gives

$$\int\frac{e^{-i\vect k\cdot\vect a}}{\sqrt{a^2 + h^2}}\,\dd^2a = \frac{2\pi}{k}\,e^{-kh} .$$

The kernel is a derivative, $P_z = -(1/2\pi)\,\partial_z(a^2 + z^2)^{-1/2}$. The integration is over $\vect a$, not
over $z$, so the derivative with respect to $z$ can be taken outside it:

$$\tilde P_z(\vect k) = -\frac{1}{2\pi}\,\partial_z\Bigl(\frac{2\pi}{k}\,e^{-kz}\Bigr) = e^{-kz} .$$

By the convolution theorem of section 2.6, continuing a potential up by $z$ multiplies each of its ripples by
$e^{-kz}$, as [](#eq:fade) requires. At $k = 0$ the transform is 1, the area of $P_z$ that section 2.4 found.
:::

### Stretch

**[2.7]** A sheet whose density varies only along $a_1$ is a set of parallel line masses along $a_2$. Show that a row of pixels
along $a_1$ records each ripple of it with the factor $2\pi G\,|k|\,e^{-|k|z}$, where $k$ is the wavenumber along the
row. Check the result against the tide of section 1.3's rail of $\matter\lambda = 60\unit{kg\,m^{-1}}$, 1 m below
the row.

::: solution
The ripples of such a sheet have $\vect k = (k, 0)$, so $|\vect k| = |k|$, and every step of [](#eq:sheet) and
[](#eq:data) holds with the transform along the line, in which $\tilde{\matter\sigma}(k)$ is in kilograms per metre.
For one rail at $a_1 = 0$, $\tilde{\matter\sigma} = \matter\lambda$ at every $k$. Straight above it the line's inverse
transform gives

$$\begin{aligned}\curv d(0) &= \int_{-\infty}^{\infty}2\pi G\matter\lambda\,|k|\,e^{-|k|z}\,\frac{\dd k}{2\pi}\\ &= 2G\matter\lambda\int_0^\infty k\,e^{-kz}\,\dd k = \frac{2G\matter\lambda}{z^2} .\end{aligned}$$

Section 1.3 found the same stretch, $2G\matter\lambda/r^2$, from Gauss's law. For the rail at 1 m it is
$8.0 \times 10^{-9}\unit{s^{-2}}$. This is the geometry of the buried line masses of the opening.
:::

### The camera

**[2.7]** Compute the first estimate $\pi/\ln\SNR$ of the finest detail, in degrees, for $\SNR = 10^3$, $10^6$, $10^{10}$, $10^{20}$, $10^{30}$ and $10^{60}$, and say at which sensitivities it
is wider than the exact blur of a flat array (24.0°, 14.1°, 9.2°, 5.0°, 3.4°, 1.8°). Section 3.7 finds that
exact blur to be $4.43/q_c$ radians, to within a few per cent. Here $q_c$ is the exact counterpart of this section's
$k_{\max}z = \ln\SNR$: the value of $kz$ at which the best reconstruction keeps half of a ripple, which is
10.4, 17.8, 27.5, 51.1, 74.5 and 144.3. Use these values to explain your answer.

::: solution
With $\ln 10 = 2.303$, $\ln\SNR$ is 6.91, 13.8, 23.0, 46.1, 69.1 and 138, and $180/\ln\SNR$ gives 26.1°, 13.0°,
7.8°, 3.9°, 2.6° and 1.3°. The estimate is wider than the exact blur only at $10^3$, and sharper
at every higher sensitivity.

The estimate divided by the exact blur is $(q_c/\ln\SNR)/1.41$. The ratio $q_c/\ln\SNR$ is 1.51 at $10^3$, above 1.41, so
there the estimate is the wider; it falls to 1.29 at $10^6$ and 1.04 at $10^{60}$, so there the estimate is the sharper.
The true cut-off lies above $\ln\SNR$, most at low sensitivity, and the picture of a point is $4.43/q_c$ wide rather
than $\pi/q_c$ (section [3.7](/tutorial/noise/blur-law/#step-7-an-exact-calculation-reproduces-the-papers-table)).
:::
:::

::: paper
- [*How sharp*](/paper/#par:how-sharp) (Section IV): equations [](/paper/#eq:evanescent) and [](/paper/#eq:array-data),
  the first estimate $\pi z/\ln\SNR$, and the last column of Table [](/paper/#tab:resolution);
  [*Other gravitational sensors*](/paper/#par:other-gravitational-sensors) uses the kernels $q^{-1}e^{-q}$, $e^{-q}$ and
  $q\,e^{-q}$; Figure [](/paper/#fig:nearfield) shows the fade merging two line masses.
- [Section VII](/paper/#sec:no-lens): no lens could sharpen the gravitational near field. Section XIII's equations
  [](/paper/#eq:scene-transform) and [](/paper/#eq:cone) use $e^{i\vect k\cdot\vect a - |\vect k|z}$, which fades into
  the scene, the mirror image of this section's fade.
:::

::: deeper
- Richard J. Blakely, *Potential Theory in Gravity and Magnetic Applications* (Cambridge, 1995), chapter 12:
  continuation of survey data up and down, ripple by ripple.
- Earl G. Williams, *Fourier Acoustics: Sound Radiation and Nearfield Acoustical Holography* (Academic Press, 1999).
- John David Jackson, *Classical Electrodynamics* (Wiley, 3rd edition, 1999), section 2.9: separation of variables.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, Fig. [](/paper/#fig:nearfield).

[^evan]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:evanescent), where $z$ is the height that is called $h$ here.

[^array]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:array-data).

[^estimate]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV; the last column of its Table
    [](/paper/#tab:resolution) is this estimate as an angle.

[^nolens]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VII.

[^units]: On the right, $G\,k\,\tilde{\matter\sigma}$ is in $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{m^{-1}} \times \mathrm{kg} = \mathrm{m^2\,s^{-2}}$, the unit of $\tilde{\curv d}$.

[^e]: Keeping the factor, a ripple stands above its noise by $\SNR\,e^{1 - kz}$, so $k_{\max} = (\ln\SNR + 1)/z$,
    and the angle at $\SNR = 10^3$ becomes 22.8° instead of 26.1°.
