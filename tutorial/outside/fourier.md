---
id: '2.6'
title: 'Fourier analysis, with the delta function as a sum of waves'
question: 'How can a picture of a scene be broken into ripples, so that we can ask separately how each ripple survives the trip to the camera?'
part: '2'
requires: ['1.3', '1.5b', '2.4']
paper: [sec:near-field, eq:array-data, eq:capacity-integral, eq:wave-zone, eq:scene-transform, eq:calderon]
figures: []
live: [fourier-build]
depth: A
---

The paper's [Section IV](/paper/#sec:near-field) explains in plain words why a gravitational picture is blurred. It
asks us to suppose "a body has ripples of mass with crests ten centimetres apart". Seen from ten centimetres away,
their signal is about 500 times weaker than at the surface of the body, and from twenty centimetres it is about
300,000 times weaker, so that a buried object looks "like a hand under a thick blanket". The argument follows each
ripple on its own. Chapter [0.2](/tutorial/evening/through-walls/) promised that any picture of buried masses can be
built from ripples in this way, as a chord is built from pure notes.

So we ask how a picture of a scene can be broken into ripples, so that we can ask separately how each ripple survives
the trip to the camera. The tool is Fourier analysis, with which the paper reads the camera's data "in Fourier space
across the array". It also gives a count that we reach at the end. The paper images its locked safe with an array of
$11 \times 11$ pixels, a metre across, and the array records each component of the tide as exactly 121 ripples, one
for each pixel. Figure [](#fig:fourier-hero) builds a patchy slab out of three ripples.

![The patchy slab on the left is the sum of the three ripples on the right: at every point, its height above the mean
is the sum of their heights. Orange marks density above the mean, and blue marks density below it. Each arrow points
across its ripple's crests, with a length in proportion to $2\pi$ over their spacing, and each bar is in proportion to
its ripple's size; the heights of the reliefs, the lengths of the arrows and bars, and the sizes of the slabs are
chosen for the drawing.](tut-fourier-hero){#fig:fourier-hero}

::: plain
A ripple is a pattern that rises and falls in parallel waves, like a ploughed field. Any pattern, however irregular,
is a sum of ripples of different spacings and directions, each with its own size and shift. Fourier analysis finds
how much of each ripple a pattern holds, and adds the ripples back together.

Three facts make it useful for the camera. A single point holds every ripple in the same amount, so a narrow feature
needs many fine ripples. A blur, which replaces each value by an average of its neighbours, does not mix the ripples:
it changes each one by its own factor, and the camera's view of a scene works in the same way. And the strength of a
pattern, the sum of its squares, is the same counted point by point or ripple by ripple.

On an area the ripples can be counted: an array records one ripple per pixel for each quantity it reads.
:::

## A ripple in space is a turning number, as an oscillation in time is

We want one way of writing a ripple that holds its size and its position together. Chapter 1.5b did this for an
oscillation in time with the
[phasor](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number), and the same packaging
works along a line. Let $x$ be the position along the line, in metres. A ripple whose crests are a distance $\lambda$
apart, with size $F$ and shifted along the line, is

$$F\cos(kx + \alpha), \qquad k = \frac{2\pi}{\lambda} .$$

Here $\sym{wavenumber}{k}$ is the **wavenumber**: the angle, in radians, by which the ripple advances over one metre, so
its unit is $\mathrm{m^{-1}}$. The **phase** $\alpha$, in radians, shifts the crests: the crest that would stand at $x =
0$ stands at $x = -\alpha/k$ instead. Crests 10 cm apart have $k = 2\pi/0.1\unit{m} = 62.8\unit{m^{-1}}$, and crests a
metre apart have $k = 6.28\unit{m^{-1}}$.

By [Euler's formula](/tutorial/newton/complex-numbers/#eulers-formula-a-turn-is-an-exponential), $\cos\theta =
(e^{i\theta} + e^{-i\theta})/2$, so the ripple is a sum of two turning numbers:

$$F\cos(kx + \alpha) = \tfrac12 F\,e^{i\alpha}\,e^{ikx} + \tfrac12 F\,e^{-i\alpha}\,e^{-ikx} .$$

The complex number $\tfrac12 Fe^{i\alpha}$ in front of $e^{ikx}$ is the ripple's **complex amplitude**: its modulus is
half the size, and its argument is the shift. The ripple with $-k$ carries the complex conjugate, so that the sum is
real. From now on we write every ripple as $e^{ikx}$, with $k$ positive or negative. The exponent in space is $+ikx$,
while the phasor of chapter 1.5b turns as $e^{-i\omega t}$; a
[later section](#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time) explains why.

## A repeating pattern is a sum of ripples

Let $f(x)$ be a pattern along the line, such as the density of a slab with stripes, that repeats after a length $L$, its
**period**, in metres: $f(x + L) = f(x)$. The ripples that repeat with the same period are $e^{ik_nx}$ with

$$k_n = \frac{2\pi n}{L}, \qquad n = 0, \pm1, \pm2, \dots ,$$

because then $k_nL = 2\pi n$, so each goes through $n$ whole turns in one period. The ripple with $n = 0$ is the
constant 1. We want to write the pattern as a sum of these ripples, $f(x) = \sum_n c_n e^{ik_nx}$, and we want the
numbers $c_n$, in the unit of $f$.

The key is that two different ripples of the list are **orthogonal**: the integral over one period of one ripple times
the complex conjugate of the other is zero. The integral plays the part of a dot product with one entry for each point
of the line, as it did for the patterns on the sphere of chapter
[2.2](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them).
For $n \neq m$,

$$\int_0^L e^{-ik_mx}\,e^{ik_nx}\,\dd x = \int_0^L e^{2\pi i(n - m)x/L}\,\dd x = 0 ,$$

because by Euler's formula the integrand is a cosine plus $i$ times a sine, each running through $n - m$ whole turns,
and the positive and negative parts of a whole turn cancel. For $n = m$ the integrand is 1 and the integral is $L$.

Now we multiply the sum $f = \sum_n c_ne^{ik_nx}$ by $e^{-ik_mx}$ and integrate over one period. Orthogonality removes
every term except $n = m$, which gives $Lc_m$. So

$$\boxed{\begin{gathered}
f(x) = \sum_{n=-\infty}^{\infty}\sym{fourier-coefficient}{c_n}\,e^{2\pi inx/L},\\
c_n = \frac1L\int_0^L f(x)\,e^{-2\pi inx/L}\,\dd x .
\end{gathered}} \label{eq:series}$$

The sum is the **Fourier series** of $f$, and $c_n$ is its **Fourier coefficient**: the average of $f$ times the
conjugate ripple, which measures how much $f$ resembles that ripple. The coefficient $c_0$ is the mean of $f$. If $f$ is
real, the complex conjugate of the formula gives $c_{-n} = c_n^*$, as the last section required.

The derivation assumed that $f$ is such a sum. We state without proof when it is. If $f$ is smooth on each side of
finitely many jumps in a period, then as more terms are added the sum approaches $f$ at every point where $f$ is
smooth, and at a jump it approaches the middle of the jump. If we know only that the square of $f$ has a finite
integral over a period, the sum approaches $f$ only **in the mean**: the integral of the squared difference goes to
zero. The next example checks the first statement at two points.

**A number: a slab of bars.** Take a slab whose density lies above its mean by a fixed amount in alternate stripes,
and below it by the same amount in the others. Measured from the mean, in units of that amount, the pattern is
$f = +1$ on the first half of each period and $-1$ on the second. Integrating the exponential over each half gives,
for $n \neq 0$,

$$c_n = \frac{1}{L}\left[\int_0^{L/2} - \int_{L/2}^{L}\right]e^{-2\pi inx/L}\,\dd x = \frac{1 - (-1)^n}{i\pi n},$$

which is $2/(i\pi n)$ for odd $n$ and zero for even $n$. At $n = 0$ the formula reads $0/0$, so we take $c_0$ from its
meaning: it is the mean of $f$, which is zero because the stripes above and below the mean are equally wide. The
coefficients obey $c_{-n} = -c_n$, so the pair $\pm n$ adds to $(2/i\pi n)(e^{ik_nx} - e^{-ik_nx}) = (4/\pi n)\sin
k_nx$, and

$$f(x) = \frac4\pi\left(\sin k_1x + \frac13\sin 3k_1x + \frac15\sin 5k_1x + \dots\right).$$

The sizes of the ripples are $4/\pi = 1.27$, $4/3\pi = 0.42$ and $4/5\pi = 0.25$. The first ripple is taller than the
bars themselves, and the finer ones flatten its tops and steepen its sides. At $x = L/4$, the middle of a bar, the
series is $(4/\pi)(1 - \tfrac13 + \tfrac15 - \dots)$, and the bracket is Leibniz's series for $\pi/4$, so the sum is 1.
At the jump, $x = 0$, every sine is zero, which is the middle of the jump from $-1$ to $+1$.

Near a jump the partial sums overshoot. The peak beside the jump is 1.188 with three odd terms, 1.180 with ten and 1.179
with a thousand. It grows narrower and falls slowly toward 1.179, but never below, so the overshoot stays at 9% of the
jump.[^gibbs] This is the **Gibbs phenomenon**, and it is the ringing that appears whenever the finest ripples of a
pattern with a sharp edge are cut away. Figure [](#fig:fourier-bars) draws the bars with three of their partial sums.

![The bars $f = \pm1$ over two periods, in black, and the sums of the first 1, 3 and 10 odd terms of their series, from
the palest to the full colour. The one-term sum rises to $4/\pi = 1.27$ in the middle of each bar, and the ten-term
sum overshoots to 1.18 beside each jump. At the right, the sizes $4/\pi n$ of the sine terms, on the same vertical
scale.](tut-fourier-bars){#fig:fourier-bars}

## On an endless line the sum becomes an integral

A scene does not repeat. So we take a pattern $f$ that dies away outside some stretch of the line, repeat it with a
period $L$ longer than that stretch, and follow what happens to [](#eq:series) as $L$ grows. We take the period from
$-L/2$ to $L/2$, which gives the same coefficients because the integrand repeats with period $L$, and we define

$$\tilde f(k) = \int_{-L/2}^{L/2} f(x)\,e^{-ikx}\,\dd x ,$$

so that $c_n = \tilde f(k_n)/L$. The wavenumbers $k_n$ are spaced by $\Delta k = 2\pi/L$, so $1/L = \Delta k/2\pi$ and
the series reads

$$f(x) = \sum_n \tilde f(k_n)\,e^{ik_nx}\,\frac{\Delta k}{2\pi} .$$

As $L$ grows, the spacing $\Delta k$ shrinks, the sum becomes an integral over $k$, and $\tilde f$ becomes an integral
over the whole line. For a pattern that dies away far along the line,

$$\boxed{\begin{gathered}
\sym{fourier-transform}{\tilde f}(k) = \int_{-\infty}^{\infty} f(x)\,e^{-ikx}\,\dd x,\\
f(x) = \int_{-\infty}^{\infty}\tilde f(k)\,e^{ikx}\,\frac{\dd k}{2\pi} .
\end{gathered}} \label{eq:transform}$$

The function $\tilde f$ is the **Fourier transform** of $f$, and the second integral is the **inverse transform**. The
amount of ripples with wavenumbers between $k$ and $k + \dd k$ is $\tilde f(k)\,\dd k/2\pi$. The unit of $\tilde f$ is
the unit of $f$ times a metre, so that the second integral, over $k$ in $\mathrm{m^{-1}}$, returns the unit of
$f$.[^conventions] For a real pattern, $\tilde f(-k) = \tilde f^*(k)$.

**A derivative becomes a factor.** The transform of the slope $\dd f/\dd x$ follows from integration by parts, in which
the term at the ends vanishes because $f$ dies away:

$$\int \frac{\dd f}{\dd x}\,e^{-ikx}\,\dd x = -\int f(x)\,\frac{\dd e^{-ikx}}{\dd x}\,\dd x = ik\,\tilde f(k) . \label{eq:derivative}$$

A second derivative brings down $(ik)^2 = -k^2$. On a single ripple this is plain, since $\dd e^{ikx}/\dd x =
ik\,e^{ikx}$. The rule turns a differential equation into algebra, one ripple at a time, and chapter 2.7 uses it on
Poisson's equation.

**A number: the Gaussian.** We want the transform of chapter 1.3's
[Gaussian of width $\varepsilon$](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point),
on the line:

$$\delta_\varepsilon(x) = \frac{1}{\sqrt{2\pi}\,\varepsilon}\,e^{-x^2/2\varepsilon^2} ,$$

with $\varepsilon$ in metres and an area of 1. Its slope is $\dd\delta_\varepsilon/\dd x =
-(x/\varepsilon^2)\,\delta_\varepsilon$, and we transform both sides. The left side gives $ik\tilde\delta_\varepsilon$,
by [](#eq:derivative). For the right side we differentiate $\tilde f(k) = \int f\,e^{-ikx}\,\dd x$ with respect to $k$,
which gives $\dd\tilde f/\dd k = -i\int x\,f\,e^{-ikx}\,\dd x$, so the transform of $x\,f$ is $i\,\dd\tilde f/\dd k$.
Then $ik\,\tilde\delta_\varepsilon = -(i/\varepsilon^2)\,\dd\tilde\delta_\varepsilon/\dd k$, which is

$$\frac{\dd\tilde\delta_\varepsilon}{\dd k} = -\varepsilon^2k\,\tilde\delta_\varepsilon .$$

The function whose slope is $-\varepsilon^2k$ times itself is $e^{-\varepsilon^2k^2/2}$ times a constant, and the
constant is $\tilde\delta_\varepsilon(0) = \int\delta_\varepsilon\,\dd x = 1$:

$$\boxed{\;\tilde\delta_\varepsilon(k) = e^{-\varepsilon^2k^2/2} .\;} \label{eq:gauss-pair}$$

A Gaussian of width $\varepsilon$ along the line is made of ripples whose amounts follow a Gaussian of width
$1/\varepsilon$ in wavenumber. A bump 1 cm wide holds the ripples up to $k = 100\unit{m^{-1}}$, crests 6.3 cm apart, at
61% or more of their full amount, and at $k = 300\unit{m^{-1}}$, crests 2.1 cm apart, it holds only $e^{-4.5} = 1.1\%$.
A bump ten times narrower needs ripples ten times finer. Figure [](#fig:fourier-gauss) draws a wide and a narrow bump
with their transforms.

For the Gaussian the product of the two widths is 1. For any pattern we state without proof the **uncertainty
relation**: if $|f|^2$ and $|\tilde f|^2$ are treated as distributions, the product of their standard deviations is at
least $\tfrac12$, and a Gaussian reaches that bound. No pattern is narrow both along the line and in wavenumber.

![Left, Gaussians of width $\varepsilon = 2$ and $\varepsilon = 0.5$, each of area 1, so that the narrow one stands
four times as tall. Right, their transforms $e^{-\varepsilon^2k^2/2}$, which both rise to 1 at $k = 0$: the wide bump
has the narrow transform, of width $1/\varepsilon = 0.5$, and the narrow bump has the wide one, of width 2. Each width
is marked where its curve has fallen to $e^{-1/2}$ of its top, and the two values of $\varepsilon$ are chosen for the
drawing.](tut-fourier-gauss){#fig:fourier-gauss}

## Across a plane, a ripple's wavevector points across its crests

The camera's scene is a sheet, so we need ripples on a plane. A place on the plane is $\vect a = (a_1, a_2)$, in metres,
the paper's letter for a position across the camera, as in chapter
[2.4](/tutorial/outside/greens-functions/#above-a-flat-camera-a-mirror-image-gives-the-potential-at-every-height). A
ripple on the plane is $e^{i\vect k\cdot\vect a}$, where $\sym{wavevector}{\vect k} = (k_1, k_2)$ is its **wavevector**,
in $\mathrm{m^{-1}}$. The ripple is constant along each line on which $\vect k\cdot\vect a$ is constant, and these lines
are perpendicular to $\vect k$, so the crests run at right angles to the wavevector and $\vect k$ points across them.
Along $\vect k$ the ripple advances by $|\vect k|$ radians per metre, so its wavenumber is $k = |\vect k|$ and its
crests are $2\pi/k$ apart.

Since $e^{-i\vect k\cdot\vect a} = e^{-ik_1a_1}\,e^{-ik_2a_2}$, the transform on the plane is the transform of the
last section done twice, once along each direction:

$$\boxed{\begin{gathered}
\tilde f(\vect k) = \int f(\vect a)\,e^{-i\vect k\cdot\vect a}\,\dd^2a,\\
f(\vect a) = \int\tilde f(\vect k)\,e^{i\vect k\cdot\vect a}\,\frac{\dd^2k}{(2\pi)^2} .
\end{gathered}} \label{eq:transform-plane}$$

Here $\dd^2a = \dd a_1\,\dd a_2$ and $\dd^2k = \dd k_1\,\dd k_2$, and $\tilde f$ has the unit of $f$ times a square
metre. Each fact on the line carries over. A product $u(a_1)\,v(a_2)$ transforms to $\tilde u(k_1)\,\tilde v(k_2)$,
and the two second derivatives along the plane bring down $-k_1^2 - k_2^2 = -k^2$, so the part of the Laplacian that
runs along the plane becomes multiplication by $-k^2$.

## A point holds every ripple equally

We want the transform of a point. The defining rule of the delta function gives it at once:
$\int\delta(x)\,e^{-ikx}\,\dd x = e^0 = 1$ at every $k$. This agrees with chapter 1.3's Gaussian $\delta_\varepsilon$,
whose transform $e^{-\varepsilon^2k^2/2}$ rises to 1 at every $k$ as its width shrinks.

We also want the delta function as a sum of ripples. The Gaussian is already one:

$$\delta_\varepsilon(x) = \int_{-\infty}^{\infty} e^{-\varepsilon^2k^2/2}\,e^{ikx}\,\frac{\dd k}{2\pi} .$$

This can be checked directly, without assuming that the inverse transform undoes the forward one. Here
$e^{-\varepsilon^2k^2/2}$ is a Gaussian in $k$ of width $1/\varepsilon$ and area $\sqrt{2\pi}/\varepsilon$, so
[](#eq:gauss-pair), with the names of $x$ and $k$ exchanged, gives its integral against $e^{ikx}$ as
$(\sqrt{2\pi}/\varepsilon)\,e^{-x^2/2\varepsilon^2}$. The sign in the exponent does not matter, because the Gaussian is
even. Dividing by $2\pi$ gives $\delta_\varepsilon(x)$. Letting $\varepsilon \to 0$ on both sides gives

$$\boxed{\;\int_{-\infty}^{\infty} e^{ikx}\,\frac{\dd k}{2\pi} = \sym{delta-function}{\delta}(x) .\;} \label{eq:delta-sum}$$

A point is an equal mixture of every ripple. All of them have a crest at $x = 0$, where they add up, and everywhere
else their crests and troughs cancel. The integral does not converge in the ordinary sense, because $e^{ikx}$ does not
die away as $k$ grows. It means the limit through the Gaussians, and, like every delta function in this tutorial, it is
used only inside an integral against a smooth function.[^sinc]

Equation [](#eq:delta-sum) proves that the inverse transform undoes the forward one. We put the first integral of
[](#eq:transform) into the second and do the integral over $k$ first:

$$\begin{aligned}
\int\tilde f(k)\,e^{ikx}\,\frac{\dd k}{2\pi} &= \int f(x')\left[\int e^{ik(x - x')}\,\frac{\dd k}{2\pi}\right]\dd x'\\
&= \int f(x')\,\delta(x - x')\,\dd x' = f(x) .
\end{aligned}$$

Exchanging the names of $x$ and $k$ in [](#eq:delta-sum) gives the other way round, $\int e^{ikx}\,\dd x =
2\pi\,\delta(k)$: a ripple that runs on forever is made of a single wavenumber.

**A point mass on a sheet.** Here $\sym{surface-density}{\matter\sigma}$ is the surface density of the sheet, its mass
per unit area in kilograms per square metre. A point of mass $\matter m$, in kilograms, at the place $\vect a_0$ has
$\matter\sigma = \matter m\,\delta^2(\vect a - \vect a_0)$, with $\delta^2(\vect a) = \delta(a_1)\,\delta(a_2)$ in
$\mathrm{m^{-2}}$, so by [](#eq:transform-plane)

$$\tilde{\matter\sigma}(\vect k) = \matter m\,e^{-i\vect k\cdot\vect a_0} .$$

The modulus is 1 at every $\vect k$: the gold of the locked safe, $\matter m = 324\unit{kg}$, holds 324 kg of every
ripple wherever it lies. Moving it changes only the phases, that is, where each ripple's crests lie. By the same
substitution, any pattern moved by $\vect a_0$ has the transform $e^{-i\vect k\cdot\vect a_0}\tilde f(\vect k)$.
Chapter 3.7 uses $\tilde{\matter\sigma} = \matter m$ to find the camera's picture of a point.

A uniform sheet is the opposite case. A surface density $\matter\sigma_0$ that is the same everywhere has, by the
plane's version of $\int e^{ikx}\,\dd x = 2\pi\delta(k)$,

$$\tilde{\matter\sigma}(\vect k) = \matter\sigma_0\,(2\pi)^2\,\delta^2(\vect k) ,$$

all of it in the one ripple $\vect k = 0$, which has no crests at all. Chapter 2.5 showed that such a sheet, like the
floor of the safe's room as far as it is uniform, has no tide at all, so a tidal camera cannot see this one ripple.
Figure [](#fig:fourier-comb) draws a single point and a row of points with their transforms.

![Left, a row of equal point masses $\matter m$ a distance $b$ apart, and its transform, a row of equal spikes $2\pi/b$
apart in wavenumber, each of weight $2\pi\matter m/b$, which the stretch problem at the end of the chapter derives.
Right, a single point mass and its transform, $\matter m$ at every $k$. Each arrow stands for a delta function and is
labelled by its weight; the lengths of the arrows, the height of the level line and the scales of the axes are chosen
for the drawing.](tut-fourier-comb){#fig:fourier-comb}

## A blur multiplies each ripple by a number

A blur replaces each value of a pattern by a weighted average of its neighbours. With a weight $g$, the blurred
pattern is

$$(g * f)(x) = \int g(x - x')\,f(x')\,\dd x' ,$$

the **convolution** of $g$ with $f$. The weight $g$ is the **kernel** of the blur: $g(x - x')$ says how much the value
at $x'$ counts in the average at $x$. A kernel that is an average has an area of 1 and is in $\mathrm{m^{-1}}$.

We want to know what a blur does to one ripple. We put $f = e^{ikx'}$ and substitute $u = x - x'$:

$$\int g(x - x')\,e^{ikx'}\,\dd x' = e^{ikx}\int g(u)\,e^{-iku}\,\dd u = \tilde g(k)\,e^{ikx} .$$

The same ripple comes out, multiplied by the number $\tilde g(k)$, and no other ripple is made. Any pattern is a sum of
ripples, and a blur of a sum is the sum of the blurs, so each ripple of $f$ is multiplied by its own factor:

$$\boxed{\;\widetilde{(g * f)}(k) = \tilde g(k)\,\tilde f(k) .\;} \label{eq:convolution}$$

This is the **convolution theorem**. On the plane it reads the same, with $\vect k$ for $k$ and the plane's
transform. Nothing in the derivation used the area of $g$, so it holds for any kernel, average or not. Figure
[](#fig:fourier-blur) shows a blur acting on two ripples.

**A check.** Blurring a Gaussian bump of width $\varepsilon_1$ with a Gaussian kernel of width $\varepsilon_2$
multiplies $e^{-\varepsilon_1^2k^2/2}$ by $e^{-\varepsilon_2^2k^2/2}$. The product is the transform of a Gaussian of
width $\sqrt{\varepsilon_1^2 + \varepsilon_2^2}$, so widths of 3 cm and 4 cm blur to 5 cm. A kernel that is a delta
function has $\tilde g = 1$ and leaves the pattern unchanged, as an average over a single point must.

**Upward continuation is a blur.** Chapter 2.4 continued the potential from a plane to the height $z$ above it with
the [half-space kernel](/tutorial/outside/greens-functions/#above-a-flat-camera-a-mirror-image-gives-the-potential-at-every-height)
$\sym{half-space-kernel}{P_z}$:

$$\field\Phi(\vect a, z) = \int P_z(\vect a - \vect a')\,\field\Phi(\vect a', 0)\,\dd^2a' .$$

This is a convolution on the plane, so each ripple of the potential arrives at the height $z$ multiplied by the number
$\tilde P_z(\vect k)$. Chapter 2.4 stated that a ripple fades by $e^{-kz}$ over the height $z$, so
$\tilde P_z(\vect k) = e^{-|\vect k|z}$. Chapter 2.7 derives the fade and, in its practice problem, computes this
transform directly. A check: at $\vect k = 0$ the transform is the area of the kernel, $\int P_z\,\dd^2a = 1$, which
chapter 2.4 found, and $e^0 = 1$.

**The camera's data are a convolution whose weights add to zero.** The array records ${\curv d = -\curv{\tE}_{zz}}$, the
vertical component of the tide with its sign changed so that a mass below reads positive, in $\mathrm{s^{-2}}$
(chapter
[2.4](/tutorial/outside/greens-functions/#above-a-flat-camera-a-mirror-image-gives-the-potential-at-every-height)).
By the
[tide of a point mass](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)
of chapter 1.4, a mass $\matter m$ at the depth $z$ below the array, at the distance $a$ along the plane from a pixel,
gives that pixel the reading $\matter m\,g_z(a)$, with

$$g_z(a) = \frac{G\,(2z^2 - a^2)}{(z^2 + a^2)^{5/2}}$$

in $\mathrm{kg^{-1}\,s^{-2}}$. The readings of a sheet at the depth $z$ add up over its small masses, so they are the
convolution $\curv d = g_z * \matter\sigma$. This kernel is not an average. It is positive within $\sqrt2\,z$ of the
point and negative beyond, and its area is zero, as the substitution $u = z^2 + a^2$ shows:

$$\int g_z\,\dd^2a = \pi G\int_{z^2}^{\infty}\frac{3z^2 - u}{u^{5/2}}\,\dd u = \pi G\left(\frac2z - \frac2z\right) = 0 .$$

So $\tilde g_z(0) = 0$, and a uniform sheet gives no data. By the convolution theorem the data hold each ripple of the
scene multiplied by $\tilde g_z(\vect k)$, plus noise, which is the paper's equation for the array:

{{paper eq:array-data}}

Here $\tilde{\curv d}$, $\tilde{\matter\sigma}$ and $\tilde n$ are the transforms of the data, the surface density and
the noise (Part 3), and $k = |\vect k|$. The factor $2\pi G\,k\,e^{-kz}$ is $\tilde g_z$, which chapter 2.7 derives;
it vanishes at $k = 0$, as the area of $g_z$ requires. Its unit, $\mathrm{m^2\,kg^{-1}\,s^{-2}}$, times the kilograms
of $\tilde{\matter\sigma}$ gives the $\mathrm{m^2\,s^{-2}}$ of $\tilde{\curv d}$.

![Top, a pattern $f$ made of a coarse ripple and a fine one of equal size, a Gaussian kernel $g$ drawn at three of the
places where it averages, and the blurred pattern $g * f$, in which the coarse ripple keeps 0.88 of its size and the
fine one 0.14. Bottom, the same in wavenumber: the pattern's two spikes (pale), the kernel's transform $\tilde g =
e^{-\varepsilon^2k^2/2}$, and their products, whose tips lie on the curve. The two ripples have the wavenumbers $k_1$
and $k_2 = 4k_1$, and $\varepsilon k_1 = 0.5$; the kernel's height and the scales of the axes are chosen for the
drawing.](tut-fourier-blur){#fig:fourier-blur}

## The power of a pattern is the same counted point by point or ripple by ripple

The **power** of a pattern is the integral of its square, $\int|f|^2\,\dd x$, in the square of the unit of $f$ times a
metre; the name comes from circuits. We want to know how the power is shared among the ripples. We write
$|f|^2 = f\,f^*$, put the inverse transform in for each factor, using $k$ for one and $k'$ for the other, and do the
integral over $x$ first:

$$\int|f|^2\,\dd x = \iint\tilde f(k)\,\tilde f^*(k')\left[\int e^{i(k - k')x}\,\dd x\right]\frac{\dd k}{2\pi}\,\frac{\dd k'}{2\pi} .$$

The bracket is $2\pi\,\delta(k - k')$, by the [section on a point](#a-point-holds-every-ripple-equally), so the integral
over $k'$ sets $k' = k$:

$$\boxed{\;\int|f(x)|^2\,\dd x = \int|\tilde f(k)|^2\,\frac{\dd k}{2\pi} .\;} \label{eq:parseval}$$

This is **Parseval's theorem**. There are no cross terms: different ripples do not share power. For a repeating
pattern, orthogonality gives the same in one line, $\frac1L\int_0^L|f|^2\,\dd x = \sum_n|c_n|^2$.

**A number and a check.** The bars have $|f|^2 = 1$ everywhere, so their mean power is 1. The pair $n = \pm1$ holds
$2\times(2/\pi)^2 = 8/\pi^2 = 0.81$ of it, and the first three odd pairs hold 0.93. All the odd pairs together hold
$(8/\pi^2)(1 + \tfrac19 + \tfrac1{25} + \dots) = 1$, because the bracket is $\pi^2/8$, as Parseval's theorem requires.
Most of the power of a pattern with sharp edges lies in its coarse ripples, though the edges need all of them. Chapter
[3.2](/tutorial/noise/random-signals/) describes a noise by how its power is shared among the ripples, its spectrum.

## The paper's convention is a plus sign in space and a minus sign in time

Patterns that change in time are taken apart in the same way, with the angular frequency $\omega$, in radians per
second, in place of $k$. But the paper writes an oscillation as $e^{-i\omega t}$, as chapter 1.5b's phasor did, so in
time the signs are the other way round. The reason appears when space and time meet. The moving ripple
$e^{i(kx - \omega t)}$ keeps a fixed phase where $x = \omega t/k$ plus a constant, so for positive $\omega$ its crests
move along $k$. With these signs every ripple $e^{i(\vect k\cdot\vect x - \omega t)}$ travels along its own wavevector,
and the transform that measures it carries the opposite signs, $e^{i\omega t - i\vect k\cdot\vect x}$, as in the
paper's equation [](/paper/#eq:wave-zone).

This tutorial therefore uses one set of conventions throughout:

| Pattern | Its ripples, and the pattern again |
|:--|:--|
| repeating, period $L$ | ${c_n = \frac1L\int_0^L f\,e^{-2\pi inx/L}\,\dd x}$ and ${f = \sum_n c_n\,e^{2\pi inx/L}}$ |
| along a line | ${\tilde f(k) = \int f\,e^{-ikx}\,\dd x}$ and ${f = \int\tilde f\,e^{ikx}\,\dd k/2\pi}$ |
| across a plane | ${\tilde f(\vect k) = \int f\,e^{-i\vect k\cdot\vect a}\,\dd^2a}$ and ${f = \int\tilde f\,e^{i\vect k\cdot\vect a}\,\dd^2k/(2\pi)^2}$ |
| in time | ${\tilde f(\omega) = \int f\,e^{i\omega t}\,\dd t}$ and ${f = \int\tilde f\,e^{-i\omega t}\,\dd\omega/2\pi}$ |

The factor $2\pi$ always goes with the integral over wavenumbers or frequencies. Two equations of the paper's
Section XIII use the opposite sign in space, for reasons that the box *Where the paper uses this* gives. For a real
pattern that sign gives the complex conjugate, $\tilde f(-\vect k) = \tilde f^*(\vect k)$, so the amounts of the
ripples, the moduli, are the same either way.

## An area holds a countable number of ripples

A camera reads a patch of finite size, and the paper counts the patterns a picture holds. So we want the number of
independent ripples that fit on an area. This is an estimate, exact for a pattern that repeats and close for a patch
that holds many ripples.

Take a square patch of side $D$, in metres, and area $\sym{patch-area}{A} = D^2$, and treat the pattern on it as one
period of a pattern that repeats in both directions. By [](#eq:series), done along each direction, the pattern is then a
sum of the ripples with

$$\vect k = \frac{2\pi}{D}\,(n_1, n_2) ,$$

where $n_1$ and $n_2$ are whole numbers. These wavevectors form a square grid with spacing $2\pi/D = 2\pi/\sqrt A$, so
each takes up the area $(2\pi)^2/A$ of the plane of wavevectors, in $\mathrm{m^{-2}}$. A region of area $\dd^2k$
therefore holds

$$\boxed{\;\dd N = \frac{A\,\dd^2k}{(2\pi)^2}\;} \label{eq:count}$$

ripples. Each carries a complex amplitude, two real numbers, but for a real pattern the amplitudes at $\vect k$ and
$-\vect k$ are complex conjugates, so each such pair of points carries two real numbers between them. The point
$\vect k = 0$ is its own partner, and its amplitude, the mean, is one real number. So each point of the grid carries
one real number, as in the paper's count of "$A\,\dd^2k/(2\pi)^2$ real components in each $\dd^2k$".

**Pixels set the finest ripple.** An array samples the pattern at pixels a distance $b$ apart, in metres, at the places
$a_1 = bj$ with whole numbers $j$. Two ripples whose wavenumbers differ by $2\pi/b$ take the same value at every pixel,
because $e^{i(k_1 + 2\pi/b)bj} = e^{ik_1bj}\,e^{2\pi ij}$ and $e^{2\pi ij} = 1$. The array cannot tell them apart, which
is called **aliasing**. A ripple whose wavevector lies outside the square from $-\pi/b$ to $\pi/b$ in each direction
gives the same readings as one inside it, so the array records only the ripples of the square. The two edges,
$\pm\pi/b$, are one ripple at the pixels, so only one edge belongs to the square. That ripple has crests $2b$ apart and
changes sign from each pixel to the next.

**A number: the locked safe's array.** The paper's array has $11 \times 11$ pixels 10 cm apart and reads five
components of the tide; we count the ripples of one of them. Its end pixels are 1.0 m apart, the paper's "a metre
across". For the count, each pixel stands for the square 10 cm on a side around it, so the pattern repeats with the
period 1.1 m and $A = (1.1\unit{m})^2 = 1.21\unit{m^2}$. The square of wavevectors has the side
$2\pi/b = 62.8\unit{m^{-1}}$, so by [](#eq:count) it holds

$$N = \frac{1.21\unit{m^2}\times(62.8\unit{m^{-1}})^2}{(2\pi)^2} = 121$$

ripples, one for each pixel. With $A = 1\unit{m^2}$ the formula would give 100. The border of half a pixel makes the
difference, and it matters less as the array grows. The grid of wavevectors runs over $n = -5$ to 5 in each direction,
which is 121 points, or $1 + 2\times60$: the mean and 60 conjugate pairs. Its finest ripple has
$2\pi\times5/1.1\unit{m} = 28.6\unit{m^{-1}}$, with crests 22 cm apart. That is $10/11$ of $\pi/b = 31.4\unit{m^{-1}}$,
because over an odd number of pixels the ripple that changes sign at every step does not repeat. The 121 readings of
one component and its 121 ripples are the same information in two forms.

**A limit.** The count is $A/b^2$, so an array twice as wide holds four times as many ripples, and so does one with
pixels half as far apart. If only the ripples with $|\vect k| < k_c$ are kept, a disc instead of a square,
[](#eq:count) gives $A\,\pi k_c^2/(2\pi)^2 = A\,k_c^2/4\pi$.

::: try {#fourier-build}
The figure opens on a bump 0.1 m wide and the sum of its first three ripples, close to it but ringing. Answer the two
predictions at its top first. Then raise $N$ until the sum matches the bump, set the width to 0.01 m and do it again,
and finally cut $N$ below what the bump needs.
:::

::: check
### Q

Why does a narrow bump need many ripples?

### A

Only ripples of high wavenumber change sign over a short distance, so only they can rise and fall within the bump and
cancel outside it. By [](#eq:gauss-pair) the range of wavenumbers needed is about one over the width.

### Q

How many ripples with $|\vect k| < 10\pi\unit{m^{-1}}$, which is $31.4\unit{m^{-1}}$, fit on one square metre?

### A

With $k_c = 10\pi\unit{m^{-1}}$ the disc has area $\pi k_c^2$, so by [](#eq:count) $N = A\,k_c^2/4\pi =
(1\unit{m^2})(10\pi\unit{m^{-1}})^2/4\pi = 25\pi = 78.5$, about 79. The square from $-10\pi$ to $10\pi\unit{m^{-1}}$ in
each direction holds 100, one per pixel of an array with pixels 10 cm apart. The disc leaves out its corners and keeps
$\pi/4$ of the square.
:::

**The idea to keep: any pattern is a sum of ripples. A point holds every ripple equally, and a blur only reweights
them, one ripple at a time.**

::: problems
### Practice

Find the transform of $e^{-|x|/\varepsilon}$, with $\varepsilon$ a length. At what wavenumber does it fall to half its
value at $k = 0$? Show that $e^{-|x|/\varepsilon}/2\varepsilon$ has area 1 and tends to a delta function as $\varepsilon
\to 0$.

::: solution
Split the integral at $x = 0$. For $x > 0$, $\int_0^\infty e^{-x/\varepsilon - ikx}\,\dd x = 1/(1/\varepsilon + ik)$,
and for $x < 0$ the integral is $1/(1/\varepsilon - ik)$. Their sum is

$$\frac{2/\varepsilon}{1/\varepsilon^2 + k^2} = \frac{2\varepsilon}{1 + k^2\varepsilon^2} .$$

It falls to half its value $2\varepsilon$ at $k = 1/\varepsilon$. At $k = 0$ the transform is the area, $2\varepsilon$,
so $e^{-|x|/\varepsilon}/2\varepsilon$ has area 1 and the transform $1/(1 + k^2\varepsilon^2)$, which rises to 1 at
every $k$ as $\varepsilon \to 0$, as the transform of a delta function must. Chapter 3.2 meets the same pair in time,
for noise whose correlation dies away exponentially.
:::

### Stretch

A row of equal point masses $\matter m$, a distance $b$ apart along a line, has the density per unit length
$f(x) = \sum_j\matter m\,\delta(x - jb)$, in $\mathrm{kg\,m^{-1}}$. Show that all its Fourier coefficients are equal,
and find its transform.

::: solution
The pattern repeats with period $b$. Over the period from $-b/2$ to $b/2$ it holds one mass, at $x = 0$, so by
[](#eq:series) and the rule of the delta function (chapter 1.3),

$$c_n = \frac1b\int_{-b/2}^{b/2}\matter m\,\delta(x)\,e^{-2\pi inx/b}\,\dd x = \frac{\matter m}{b}$$

for every $n$. So $f = (\matter m/b)\sum_ne^{2\pi inx/b}$. Each term transforms to $2\pi\,\delta(k - 2\pi n/b)$, so
$\tilde f(k) = (2\pi\matter m/b)\sum_n\delta(k - 2\pi n/b)$: a row of points $b$ apart is made of a row of wavenumbers
$2\pi/b$ apart, all equal. This is also why an array of pixels $b$ apart confuses wavenumbers that differ by $2\pi/b$.
:::

### The paper

In [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image) the paper says that
the patterns that survive the noise "are the components with $q < q_c$, and there are $q_c^2/4\pi$ of them per area
$z^2$". Here $q = kz$, and $q_c$ is the cut-off of equation [](/paper/#eq:cutoff), 10.4 at $\SNR = 10^3$ (chapter 3.7).
Derive the count from [](#eq:count) and evaluate it.

::: solution
The surviving ripples are those with $k < q_c/z$, a disc of area $\pi q_c^2/z^2$ in the plane of wavevectors. By
[](#eq:count), on an area $A = z^2$ they number

$$N = \frac{z^2\,\pi q_c^2/z^2}{(2\pi)^2} = \frac{q_c^2}{4\pi} .$$

At $q_c = 10.4$ this is $108/12.6 = 8.6$, the paper's "about nine patterns". The paper's equation
[](/paper/#eq:capacity-integral) adds up the bits of the ripples in the same way, with $\dd^2k = 2\pi k\,\dd k$ (chapter
3.8).
:::
:::

::: paper
- [*How sharp*](/paper/#par:how-sharp) (Section IV) writes the array's data "in Fourier space across the array",
  equation [](/paper/#eq:array-data): each ripple of the scene arrives multiplied by its own factor (chapters 2.7 and
  3.7).
- [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image) counts
  $A\,\dd^2k/(2\pi)^2$ ripples in each $\dd^2k$ to reach equation [](/paper/#eq:capacity-integral) (chapter 3.8).
- Equation [](/paper/#eq:wave-zone) in [*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave)
  transforms the source's stress $T_{kl}$ (the flow of momentum through it, in pascals) over space and time with this
  chapter's signs, $e^{i\omega t - i\vect k\cdot\vect x}$; there $k$ and $l$ are indices for directions. Each direction
  of the sky carries one ripple of the stress.
- Equation [](/paper/#eq:calderon) (Section XIII) weighs the density $\matter\rho$, in kilograms per cubic metre,
  against $e^{i\vect\xi\cdot\vect x}$, with $\vect\xi$ a wavevector in space. That function is not harmonic, since its
  Laplacian is $-|\vect\xi|^2$ times itself, but it is the product of two harmonic functions (chapter
  [2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic) shows that such products are
  not harmonic in general). The sign is that of the function, so a real density gives the complex conjugate of this
  chapter's transform.
- Equation [](/paper/#eq:scene-transform) weighs the density against $e^{i\vect K\cdot\vect a - \kappa z}$, with
  $\vect K$ a wavevector across the plane and $\kappa$ a rate of decay with depth, both in $\mathrm{m^{-1}}$. For
  $\kappa = |\vect K|$ this is the flat camera's harmonic function, a ripple that fades with depth (chapter 2.4). Its
  part across the plane is the plane's transform with the opposite sign, so it gives the complex conjugate. Its real
  factor $e^{-\kappa z}$ is not a ripple and has no row in the table (chapter 13.2).
- [*What the passes of a mass determine*](/paper/#par:what-the-passes-of-a-mass-determine) (Appendix C): a density
  added up along $\hat n$ has the transform of the density on the wavevectors perpendicular to $\hat n$.
:::

::: deeper
- The [GR course, lesson *Waves, modes and Green functions*](https://neovand.github.io/general-relativity/chapter-18.html#waves-modes-and-green-functions)
  writes waves as complex exponentials and takes them apart into modes, as here.
- The [homology course, section 1.5](https://neovand.github.io/homology/foundations/linear-algebra/) treats orthogonal
  bases, of which the ripples of a period are one, with infinitely many members.
- R. N. Bracewell, *The Fourier Transform and Its Applications* (3rd edition, McGraw-Hill, 2000), builds intuition with
  pictures of transform pairs, sampling and convolution.
- E. M. Stein and R. Shakarchi, *Fourier Analysis: An Introduction* (Princeton, 2003), proves what this chapter
  states, including when a Fourier series converges and the uncertainty relation.
:::

::: history
### Fourier's heat, and the series that converge

Joseph Fourier claimed, in a memoir on heat read in Paris on 21 December 1807, that any function on an interval is a
sum of sines and cosines, and his *Théorie analytique de la chaleur* followed in 1822 (MacTutor archive). Peter Gustav
Lejeune Dirichlet proved in 1829 that the series converges for a function with finitely many jumps and turns (*J.
reine angew. Math.* 4, 157). Henry Wilbraham found the overshoot at a jump in 1848 (*Camb. Dublin Math. J.* 3, 198).
J. Willard Gibbs described it again in *Nature* in 1898 and 1899, and Maxime Bôcher named it after Gibbs in 1906
(E. Hewitt and R. E. Hewitt, *Arch. Hist. Exact Sci.* 21, 129, 1979). Paul Dirac brought the delta function into
physics in 1927 (*Proc. R. Soc. A* 113, 621).
:::

[^gibbs]: The limit is $(2/\pi)\int_0^\pi(\sin t/t)\,\dd t = 1.179$.

[^conventions]: Books differ. Many physics texts put $1/\sqrt{2\pi}$ in front of both integrals, and engineers often
    write $e^{-2\pi i\nu x}$ with $\nu = k/2\pi$, in cycles per metre, so that no $2\pi$ appears outside. A formula
    taken from a book must be converted to this chapter's convention before it is combined with the paper's.

[^sinc]: Chapter [3.2](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies)
    reaches the same result in time through a record of finite length, whose sum of ripples is a peak of fixed area
    that narrows as the record grows.
