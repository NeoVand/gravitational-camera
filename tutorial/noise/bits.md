---
id: '3.8'
title: 'Bits: entropy, capacity, and how much an image holds'
question: 'How many yes-or-no questions about a scene can a near-field picture answer, and why does the number grow so slowly with the sensitivity?'
part: '3'
requires: ['2.3', '2.6', '3.1', '3.2', '3.5', '3.7']
paper: [sec:near-field, eq:capacity-integral, eq:capacity, fig:capacity, eq:wiener, eq:cutoff, sec:hair, eq:hair-bits, fig:hair, sec:second-order, sec:one-pixel, sec:first-image]
figures: [fig:capacity, fig:hair]
live: [bits-per-patch]
depth: A
---

The plain words of the paper's [Section IV](/paper/#sec:near-field) end with a count. At a signal-to-noise ratio of
a thousand, a near-field picture "holds about 38 bits" for each square patch of the scene whose side equals its
distance from the camera. At $10^{70}$, the rough quantum ceiling of chapter
[0.2](/tutorial/evening/through-walls/#the-blur-shrinks-only-with-the-number-of-digits-of-the-sensitivity) for a camera
watching a person for the age of the universe, it holds about 22 kilobytes, the size of a small thumbnail
photograph. A **bit** is the answer to one yes-or-no question. So sixty-seven more powers of ten of sensitivity let
the picture answer only about 4700 times as many questions. This chapter asks how many yes-or-no questions about a
scene a near-field picture can answer, and why the number grows so slowly.

In short, a more sensitive camera reads more ripples of the scene, and more bits in each, but both gains grow only
with the number of digits of the sensitivity. So the total grows, at very high sensitivity, as the cube of that
number, and more slowly before.

::: plain
A bit is the answer to one yes-or-no question. Finding which of two safes holds the gold takes one bit, and finding
one of sixteen boxes takes four. A number read through noise answers more questions the further its signal stands
above the noise, but slowly: each doubling of the signal against the noise adds one bit. A number read to one part in
a thousand is worth about ten bits.

A near-field picture is a sum of ripples of different fineness, and each ripple is read through its own noise,
independently of the others. So the bits of the picture are at most the bits of its ripples added up. Fine ripples
fade before they reach the camera and carry nothing. A more sensitive camera reads a few more fine ripples, and reads
each a little more precisely, but both gains grow only with the number of digits of its sensitivity. At a
signal-to-noise ratio of a thousand, a patch of the scene as wide as its distance holds about nine ripples of four bits
each, 38 bits. At $10^{70}$ it holds 2200 ripples of 80 bits each, about 22 kilobytes.
:::

## A bit is the answer to one yes-or-no question

The gold of the paper's locked safe lies in one of two safes. One question, "is it in the left one?", settles where it
is, and its answer is one bit. With 16 equally likely places, four questions are enough, each halving the list of the
places that remain (Figure [](#fig:questions)). With $N$ equally likely cases the number of questions is $\log_2N$,
the power to which 2 must be raised to give $N$. Here $\log_2$ is the logarithm to base 2, $\log_2N = \ln N/\ln2$,
and $\ln$ is the natural logarithm.

![Four questions find one place among sixteen. Each asks whether the place lies in the left half of the list that
remains; the answer keeps one half, in orange, and discards the other, drawn faint, so the list shrinks from 16 to 8,
4, 2 and 1. Every one of the sixteen places is found by the same four questions.](tut-bits-questions){#fig:questions}

When the cases are not equally likely, fewer questions are needed on average, because a good questioner asks first
about the likely cases. Let an unknown $x$ take the value $x_i$ with the probability $p_i$. Claude Shannon measured
its uncertainty by its **entropy** [@Shannon1948],

$$\sym{entropy}{H}(x) = -\sum_i p_i\log_2p_i ,$$

in bits.[^H] It is the average number of yes-or-no questions needed to find $x$, when the questions are chosen well
and many unknowns of the same kind are found together.[^coding] For $N$ equal cases, $p_i = 1/N$, each of the $N$
terms is $(1/N)\log_2N$, and $H(x) = \log_2N$.

**An example.** If the gold is in the left safe with the probability 0.9, then $H(x) = -0.9\log_20.9 -
0.1\log_20.1 = 0.137 + 0.332 = 0.47$ bits. That is less than one bit, because the answer is mostly known before the
question is asked. An entropy is measured by what an answer removes: a reading that leaves the place certain removes
these 0.47 bits. A number read to one part in a thousand is one of a thousand cases, worth $\log_21000 = 9.97$ bits,
about ten. This is the rule of chapter
[0.5](/tutorial/evening/what-the-outside-keeps/#the-list-is-short-and-a-black-holes-is-the-shortest).

**A non-example.** A bit here is not a binary digit stored in a memory. A memory of a million binary digits whose
contents are known in advance tells nothing. The entropy counts the uncertainty that an answer removes, not the room
the answer takes up.

## A number with a spread has a differential entropy, and only its changes count

A reading is a continuous number $x$ with a probability density $p(x)$ (chapter
[3.1](/tutorial/noise/probability/#a-reading-is-a-signal-plus-a-random-number)). To count questions we cut its range
into bins of width $\Delta$, in the unit of $x$. The bin at $x_i$ has the probability $p(x_i)\,\Delta$. The logarithm
of a product is a sum, and the probabilities add to one, so the entropy of the bins is

$$-\sum_ip(x_i)\,\Delta\,\log_2\bigl[p(x_i)\,\Delta\bigr] \approx h(x) - \log_2\Delta,$$

where

$$\sym{differential-entropy}{h}(x) = -\int p(x)\log_2p(x)\,\dd x .$$

The integral $h(x)$ is the **differential entropy** of $x$.[^h] Naming $x$ to within a bin of width $\Delta$ takes
about $h(x) - \log_2\Delta$ bits, so halving the bins adds one bit, as it should. The value of $h$ depends on the unit:
measuring $x$ in millimetres instead of metres adds $\log_21000$ to it. Only differences of $h$, in which the unit
cancels, are measured.

**The Gaussian.** For the Gaussian of chapter [3.1](/tutorial/noise/probability/#most-noise-follows-the-gaussian-bell),
with mean $\langle x\rangle$ and standard deviation $\sigma_x$,

$$-\log_2p(x) = \log_2\bigl(\sqrt{2\pi}\,\sigma_x\bigr) + \frac{(x - \langle x\rangle)^2}{2\sigma_x^2\ln2} .$$

The mean of $(x - \langle x\rangle)^2$ is $\sigma_x^2$, so the mean of the last term is $\sigma_x^2/(2\sigma_x^2\ln2) =
\tfrac12\log_2e$, since $1/\ln2 = \log_2e$. Adding the two terms gives

$$\boxed{h(x) = \tfrac12\log_2\bigl(2\pi e\,\sigma_x^2\bigr)}. \label{eq:gauss-entropy}$$

For unit variance it is $\tfrac12\log_2(2\pi e) = 2.05$ bits, and naming such a number to within 0.01 takes $2.05 +
\log_2100 = 8.7$ bits. Each doubling of $\sigma_x$ adds one bit. A uniform density of variance 1 has the width
$\sqrt{12}$ (chapter 3.1 found the variance $\tfrac1{12}$ for the width 1), the height $1/\sqrt{12}$, and the entropy
$\log_2\sqrt{12} = 1.79$ bits, less than the Gaussian's 2.05. No density does better than the Gaussian.

::: derivation
### The Gaussian has the most entropy of all densities with a given variance

Let $p$ be any density with mean $\langle x\rangle$ and variance $\sigma_x^2$, and $g$ the Gaussian with the same two.
For every $u > 0$, $\ln u \le u - 1$, with equality only at $u = 1$. With $u = g/p$, and the integrals taken over the
places where $p > 0$,

$$\int p\,\ln\frac gp\,\dd x \le \int p\Bigl(\frac gp - 1\Bigr)\dd x = \int g\,\dd x - 1 \le 0 .$$

The last step holds because $g$ integrates to one over the whole line, so to at most one where $p > 0$; it is strict
where $p$ vanishes somewhere, as for a uniform density. So $-\int p\log_2p\,\dd x \le -\int p\log_2g\,\dd x$. Here
$\log_2g$ is a quadratic in $x$, so the right side depends only on the mean and the variance of $p$, which are those of
$g$. It is therefore $-\int g\log_2g\,\dd x = \tfrac12\log_2(2\pi e\,\sigma_x^2)$, and $h \le \tfrac12\log_2(2\pi
e\,\sigma_x^2)$, with equality only when $p = g$.
:::

**What a reading removes.** A reading $y$ of $x$ leaves a smaller uncertainty about $x$. The **conditional entropy**
$h(x|y) = -\langle\log_2p(x|y)\rangle$, with the mean taken over both $x$ and $y$, is the uncertainty that remains on
average, where $p(x|y)$ is chapter 3.5's posterior; $h(y|x)$ is defined in the same way. The **mutual information**
is what the reading removes:

$$\sym{mutual-information}{I}(x;y) = h(x) - h(x|y) .$$

It is a difference of entropies, so the bins and the unit cancel.[^I] Bayes' rule of chapter
[3.5](/tutorial/noise/wiener-filter/#with-gaussian-scene-and-noise-the-best-linear-guess-is-also-the-most-probable)
writes the joint density both ways, $p(x)\,p(y|x) = p(y)\,p(x|y)$. Minus the mean of the base-2 logarithm of each side
gives $h(x) + h(y|x) = h(y) + h(x|y)$, so also

$$I(x;y) = h(y) - h(y|x) . \label{eq:mutual}$$

The reading tells as much about $x$ as $x$ tells about the reading.

## One number read through Gaussian noise carries at most $\tfrac12\log_2(1 + s^2)$ bits

We want the bits that one reading carries about the number it measures, because the camera's data split into many
such readings. Chapter
[3.5](/tutorial/noise/wiener-filter/#the-best-guess-of-one-number-weighs-the-reading-against-what-was-expected) wrote
the reading as

$$y = T\,x + n ,$$

where $x$ is the unknown, $T$ the gain, $n$ the noise, and $\sym{ripple-ratio}{s} = T\sigma_x/\sigma_n$ the number of
noise standard deviations by which a scene of the expected size moves the reading. We assume that **$x$ and $n$ are
independent**, that **the noise is Gaussian** with the standard deviation $\sigma_n$, and that $x$ has the variance
$\sigma_x^2$, with any distribution.

For a fixed $x$, the reading is the noise shifted by $Tx$, and a shift does not change an entropy, so by
\eqref{eq:gauss-entropy}

$$h(y|x) = h(n) = \tfrac12\log_2\bigl(2\pi e\,\sigma_n^2\bigr).$$

The variances of independent parts add, so $y$ has the variance $T^2\sigma_x^2 + \sigma_n^2$. The derivation box
above showed that no density of a given variance has more entropy than the Gaussian, so

$$h(y) \le \tfrac12\log_2\bigl[2\pi e\,(T^2\sigma_x^2 + \sigma_n^2)\bigr].$$

We subtract the two, as in \eqref{eq:mutual}, and divide inside the logarithm by $\sigma_n^2$:

$$\boxed{I(x;y) \le \tfrac12\log_2\Bigl(1 + \frac{T^2\sigma_x^2}{\sigma_n^2}\Bigr) = \tfrac12\log_2\bigl(1 + s^2\bigr)}. \label{eq:one-channel}$$

**When equality holds.** The bound is reached when $y$ is Gaussian, which happens when $x$ is. Chapter 3.5 found, for
Gaussian $x$, a Gaussian posterior with the variance $\sigma_x^2/(1 + s^2)$. Then $h(x) - h(x|y) =
\tfrac12\log_2\bigl[\sigma_x^2(1 + s^2)/\sigma_x^2\bigr] = \tfrac12\log_2(1 + s^2)$: the information is the narrowing of
the bell, counted in bits.

**Names.** In Shannon's language a path that carries a number to a reading and adds noise is a **channel**, and the
largest information it can carry in one use, over all inputs of a given variance, is its **capacity**. So
\eqref{eq:one-channel} is the capacity of the **Gaussian channel**, whose noise is Gaussian and added to the
signal.[^shannon]

**Numbers.** A reading with $s = 1$ carries half a bit; $s = 3$ gives 1.66 bits, $s = 10$ gives 3.33, and $s = 1000$
gives 9.97. Far from equality, suppose that $x$ only says which safe holds the gold, $+\sigma_x$ or $-\sigma_x$ with
equal probability. Such an $x$ has the entropy $H(x)$ of the first section, one bit, and the same definition reads
$I(x;y) = H(x) - H(x|y)$. The uncertainty $H(x|y)$ cannot be negative, so the reading carries at most one bit, however
large $s$ is, against the bound's 3.33 at $s = 10$. A scene allowed only a few values carries less than the bound.

**Limits.** For $s \gg 1$, $\tfrac12\log_2(1 + s^2) \to \log_2s$, so each doubling of the signal against the noise adds
one bit: a number read to one part in $s$ is worth $\log_2s$ bits, the rule of the first section. For $s \ll 1$,
$\ln(1 + u) \approx u$ gives $s^2/(2\ln2)$, so a ripple buried at $s = 0.1$ carries 0.0072 bits.

**What it means.** Noise caps the information a number carries, and the cap grows only as the logarithm of how far
the signal stands above the noise.

## A picture is many ripples with independent noise, and their bits add

We want the bits that a near-field picture holds for each patch of the scene of area $z^2$, where $z$ is the depth of
the scene below the camera, in metres.

**Independent channels add.** If two pairs $(x_1, y_1)$ and $(x_2, y_2)$ are independent, their joint densities are
products, the logarithm of a product is a sum, and so their entropies and their informations add.

The camera's data split into ripples. A ripple is a pattern across the scene with one spacing between its crests and
a wavevector $\vect k$ across them, of length $k$ in $\mathrm{m^{-1}}$. Chapter
[3.2](/tutorial/noise/random-signals/#the-variance-of-noise-spread-over-a-plane-falls-as-one-over-the-area) showed that
different ripples of white Gaussian noise are independent. Chapter
[3.5](/tutorial/noise/wiener-filter/#independent-ripples-can-be-filtered-one-at-a-time) showed that the camera does
not mix ripples, so each ripple of the data is a reading of the same ripple of the scene. Chapter
[3.7](/tutorial/noise/blur-law/#step-2-each-ripple-stands-above-its-noise-by-a-factor-that-depends-on-two-numbers)
found that each stands above its noise by

$$s = \pi\,\sym{snr}{\SNR}\;q\,e^{-q},\qquad \sym{kz}{q} = kz ,$$

where $\SNR$ is the camera's signal-to-noise ratio, the peak tide of one point mass over the noise averaged on a patch
$z\times z$. That chapter's assumptions hold here too: a flat scene, sensors filling a plane, white noise, and a prior
of point masses, one per patch $z^2$.

**A scene whose ripples are only uncorrelated.** Under the prior of point masses the scene's ripples are only
uncorrelated, as chapters 3.2 and 3.5 said, not independent. Because the noise is independent from ripple to ripple,
the information about the whole scene is still at most the sum over its ripples, each read on its own, with equality
when the scene's ripples are independent.[^subadd]

**The count.** Chapter [2.6](/tutorial/outside/fourier/#an-area-holds-a-countable-number-of-ripples) found that an area
$A$ holds $A\,\dd^2k/(2\pi)^2$ ripples in a region $\dd^2k$ of wavevectors, each one real number. A ripple $\vect k$ and
its mirror $-\vect k$ have complex-conjugate amplitudes in a real scene, so the pair carries one complex amplitude, two
real numbers, one for each of its two points. The ring of wavevectors between $k$ and $k + \dd k$ has the area $\dd^2k =
2\pi k\,\dd k$. On a patch $A = z^2$, with $k = q/z$, the ring holds

$$\dd N = \frac{z^2\cdot2\pi\,(q/z)\,(\dd q/z)}{(2\pi)^2} = \frac{q\,\dd q}{2\pi}$$

real numbers, each carrying at most $\tfrac12\log_2(1 + s^2)$ bits by \eqref{eq:one-channel}. We add them. The factor
$\tfrac12\cdot\frac1{2\pi} = \frac1{4\pi}$ goes in front, and $s^2 = \pi^2\SNR^2q^2e^{-2q}$ goes inside the
logarithm. The result is the paper's equation:

{{paper eq:capacity-integral}}

Here $\sym{capacity}{C}$ is a pure number, the bits per area $z^2$.[^C] It is the bound, and it is reached by a scene
whose ripples are Gaussian, and so independent, with the prior's spectrum. A scene made of point masses carries
somewhat less, as the two safes carried less than their bound.

**Numbers.** The integral gives 37.9 bits at $\SNR = 10^3$ (the paper's 38), 201 bits at $10^6$, $1.55\times10^4$ at
$10^{30}$ and $1.78\times10^5$ at $10^{70}$.[^code] A **kilobyte** is 1000 bytes of eight bits, 8000 bits, so the last
is 22 kilobytes, a small thumbnail photograph. Figure [](#fig:integrand) draws the integrand at the first two.

![The integrand $q\log_2(1 + s^2)$ of the paper's equation at $\SNR = 10^3$ and $10^6$, with the approximation
$2q\log_2s$ dashed beneath it. The two agree except near the cut-off, where the approximation falls to zero and the
integrand, which equals $q_c$ there, fades over a few units of $q$. The shaded areas are $4\pi$ times the bits, 37.9
and 201.](tut-bits-integrand){#fig:integrand}

## Where a ripple stands well above its noise, it carries $\log_2 s$ bits

We want a closed form, to see how $C$ grows. The small parameter is $1/s^2$: where $s \gg 1$,
$\log_2(1 + s^2) = 2\log_2s + \log_2(1 + 1/s^2) \approx 2\log_2s$. By chapter 3.7, $s > 1$ for $q$ between about
$1/\pi\SNR$ and the cut-off $\sym{cutoff}{q_c}$, the larger root of $q_ce^{-q_c} = 1/\pi\SNR$. Elsewhere the logarithm
is below one bit. We keep $2\log_2s$ up to $q_c$ and drop the rest. With $\ln s = L_\pi + \ln q - q$ and $L_\pi =
\ln(\pi\SNR)$, as in chapter 3.7,[^low]

$$C \approx \frac{1}{4\pi}\,\frac{2}{\ln2}\int_0^{q_c}q\,\bigl(L_\pi + \ln q - q\bigr)\,\dd q .$$

We integrate term by term, with $\int_0^{q_c}q\ln q\,\dd q = \tfrac12q_c^2\ln q_c - \tfrac14q_c^2$ by parts:

$$\int_0^{q_c}q\,(L_\pi + \ln q - q)\,\dd q = \tfrac12L_\pi q_c^2 + \tfrac12q_c^2\ln q_c - \tfrac14q_c^2 - \tfrac13q_c^3 .$$

Chapter 3.7's fixed point, $L_\pi = q_c - \ln q_c$, turns the first term into $\tfrac12q_c^3 - \tfrac12q_c^2\ln q_c$,
which cancels the logarithm of the second. What remains is $\tfrac16q_c^3 - \tfrac14q_c^2$, and multiplying by
$2/(4\pi\ln2)$ gives

$$\boxed{C \approx \frac{q_c^3/3 - q_c^2/2}{4\pi\ln2}},$$

which is the paper's equation [](/paper/#eq:capacity).

**Numbers.** At $\SNR = 10^3$, $q_c = 10.39$ gives 36.8 bits, 2.9% below the integral's 37.9. At $10^6$ it gives 199.1
against 200.9 (0.9%), and at $10^{10}$, 751 against 754 (0.36%), as the paper claims. The neglected part is the soft
edge near $q_c$, where $\log_2(1 + s^2)$ exceeds $2\log_2s$ (by one bit at $s = 1$), with the ripples beyond $q_c$. The
integral exceeds the closed form by 1.1 bits at $10^3$, 1.8 at $10^6$ and 16 at $10^{70}$, and integrating the edge
gives about $q_c/10.6$ for large $q_c$.[^edge] That grows as $q_c$ while $C$ grows as $q_c^3$, so the closed form
improves with sensitivity. It fails for weak cameras: 5.4% low at $10^2$ and 15% at 10.

**The plain reading.** The paper calls a ripple that the camera keeps, one with $q < q_c$, a **pattern**. The
patterns fill a disc of radius $q_c/z$ in the plane of wavevectors, so by chapter 2.6's count there are $q_c^2/4\pi$
of them per area $z^2$: 8.6 at $10^3$, the paper's "about nine". The closed form factors as

$$C \approx \frac{q_c^2}{4\pi}\times\frac{q_c/3 - 1/2}{\ln2} .$$

The second factor is the mean of $\log_2s$ over the patterns, the bits that each carries on average: the sum
$\int_0^{q_c}(q/2\pi)\log_2s\,\dd q$ divided by the number $q_c^2/4\pi$ is, by the integral above,
$(2/q_c^2\ln2)(\tfrac16q_c^3 - \tfrac14q_c^2) = (q_c/3 - \tfrac12)/\ln2$. At $10^3$ it is 4.3, "about nine patterns
of four bits each". At $10^{70}$, with $q_c = 167$, there are 2230 patterns of 80 bits each.

The paper's Figure [](/paper/#fig:capacity) draws the bits $C$ in orange, the closed form dashed on top of them, and
the patterns in blue. Both axes are logarithmic, so equal steps to the right add equal numbers of digits to $\SNR$.
On such axes a power of the number of digits is not a straight line: the curves climb fast and then bend over, and
that bending is the slow growth.

{{paper fig:capacity}}

## Sensitivity buys more patterns and more bits in each, so the bits grow as the cube of its logarithm

As the sensitivity grows, $q_c/\ln\SNR \to 1$ (chapter 3.7), the cube dominates, and

$$C \to \frac{(\ln\SNR)^3}{12\pi\ln2} .$$

The number of patterns grows as $q_c^2$ and the bits in each as $q_c$, so $C$ is close to a cube of $q_c$. But $q_c$
grows more slowly than the number of digits, because of the $\ln q_c$ in the fixed point $L_\pi = q_c - \ln q_c$.
Doubling the digits from $10^3$ to $10^6$ multiplies $q_c$ by only 1.72 and the bits by 5.3; from $10^{35}$ to
$10^{70}$ it multiplies $q_c$ by 1.94 and the bits by 7.4. The factor of eight, $2^3$, is a limit approached slowly.
The limiting form is slow for the same reason: it gives 12.6 bits at $10^3$, against 37.9, and $1.60\times10^5$ at
$10^{70}$, against $1.78\times10^5$, since $q_c = 167$ still exceeds $\ln10^{70} = 161$. That answers the guiding
question: the information grows as a power of the number of digits of the sensitivity, a power that approaches three,
and never with the sensitivity itself.

**A wave camera grows as the first power.** A camera of width $D$ that images waves of wavelength $\lambda$ resolves
about $(D/\lambda)^2$ directions in each steradian, whatever its sensitivity.[^diffraction] Each direction is a number
worth about $\log_2\SNR$ bits, so the information grows as the first power of the logarithm. In the near field no
aperture fixes the number of patterns: the fade $e^{-kz}$ lets the sensitivity set it, and that is why the power is
three. Figure [](#fig:growth) compares the two.

**A law of analysis (stated).** Kolmogorov and Tikhomirov counted the bits needed to fix any function of a class to
an accuracy $\varepsilon$ everywhere on a region, the **$\varepsilon$-entropy** of the class
[@KolmogorovTikhomirov1959]. Their functions are wanted on a smaller region and extend analytically, staying bounded,
to a larger region of complex values of their variables. For functions of $n$ variables (here $n$ counts variables),
the $\varepsilon$-entropy grows as $(\log_21/\varepsilon)^{n+1}$, the **Kolmogorov–Tikhomirov law**. For the camera,
the smaller region is the patch of the camera's plane where the image is read. The image is the field of masses a
depth $z$ below, harmonic and so analytic above them (chapter
[2.1](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball)), and its two
coordinates can be given imaginary parts of up to about $z$ before its formula meets a mass. That complex band is the
larger region. Noise fixes the image to $\varepsilon \approx 1/\SNR$, and with $n = 2$ the power is three, as this
chapter's $(\ln\SNR)^2$ patterns of $\ln\SNR$ bits show. A check: a row of sensors above line masses reads a function
of one variable, with about $q_c/\pi$ patterns per length $z$ of about $0.72\,q_c$ bits each, so its information grows
as the square. We state the law without proof.

**A single pixel is the other extreme.** Take one pixel under a sky full of independent sources that overlap in
frequency, so that their timing cannot separate them. Its response to a wave from the direction $\hat n$ is a
polynomial of degree four in the components of $\hat n$, so it sees only the $1 + 3 + 5 + 7 + 9 = 25$ spherical
harmonics of the sky's brightness of degree four and below (chapter [2.2](/tutorial/outside/spherical-harmonics/)).
With polarization it learns 68 numbers, however sensitive it is ([Section VIII](/paper/#sec:one-pixel); Part 9
derives the counts). There the geometry, not the noise, fixes how many numbers can be read.

![The bits per area $z^2$ against the number of digits of $\SNR$, both on logarithmic scales, on which a power of
the number of digits is a straight line. The near field's bits, in orange, climb with a slope that rises from 1.7 at
$\SNR = 10$ to 2.9 at $10^{70}$, toward the 3 of the upper triangle. A wave camera's bits, in grey, scaled to meet
them at $10^3$, keep the slope 1 of the lower triangle.](tut-bits-growth){#fig:growth}

::: try {#bits-per-patch}
Panel (a) is one patch of the scene, $z$ on a side, drawn as its patterns: a grid of cells, the coarsest pattern at
the top left and finer ones to the right and down, each cell shaded by the bits it carries at most,
$\tfrac12\log_2(1 + s^2)$, with the arc $q = q_c$ beyond which the patterns fall below their noise. Panel (b) is what
the patch holds: the number of patterns $q_c^2/4\pi$ times the bits of each, $(q_c/3 - \tfrac12)/\ln2$, which is the
closed form $C$, with the integral of the paper's equation beside it up to $10^{10}$, and the total on a scale of powers
of ten with a byte and a kilobyte marked. The slider sets $\SNR$ from 10 to $10^{70}$.

Before you touch anything, answer the two predictions at the top of the figure, then do what each asks. Afterwards,
watch how the grid subdivides between $10^{3}$ and $10^{70}$ while the bits of its coarsest cell grow, and compare
the two factors with the patterns and the bits per pattern of this chapter.
:::

## A body's field at one time holds about 1200 bits from three radii away

We want the bits that the field outside a body holds at one time, the paper's equation [](/paper/#eq:hair-bits). The
camera reads the field on a sphere of radius $R_c$ about a body of radius $R$, both in metres.

Chapter [2.3](/tutorial/outside/multipoles/#each-degree-has-a-ceiling-lower-than-the-last-by-the-size-over-the-distance)
found that the moments of degree $\ell$, $2\ell + 1$ real numbers, are weaker there than the monopole by at most
$(R/R_c)^\ell$. We assume, as the paper does, that **the monopole is read at the signal-to-noise ratio $\SNR$** and
**each moment of degree $\ell$ at its ceiling**, $s_\ell = \SNR\,(R/R_c)^\ell$. Here $\SNR$ is the monopole's ratio,
not the ratio of one point mass on a patch of the near-field sections. Each moment is a number read through Gaussian
noise, worth $\tfrac12\log_2(1 + s_\ell^2) \approx \log_2s_\ell$ bits while $s_\ell \gg 1$, and $2\ell + 1$ counts
real numbers, as $\dd N$ did: no factor of a half is missing. We use the paper's
pure numbers $L = \ln\SNR$ (without the $\pi$ of $L_\pi$) and $\Lambda = \ln(R_c/R)$.[^L] Then

$$\log_2s_\ell = \frac{L - \ell\Lambda}{\ln2} ,$$

which is positive while $\ell < L/\Lambda$. We add $2\ell + 1$ times this over the degrees, and replace the sum by an
integral, which needs many degrees, $L/\Lambda \gg 1$. The bits of the body's field, which we call
$\sym{hair-bits}{C_{\rm body}}$, are then[^Cbody]

$$C_{\rm body} \approx \frac1{\ln2}\int_0^{L/\Lambda}(2\ell + 1)(L - \ell\Lambda)\,\dd\ell .$$

The integrand is $2L\ell - 2\Lambda\ell^2 + L - \Lambda\ell$. At the upper end, $\ell = L/\Lambda$, its integral is
$L^3/\Lambda^2 - 2L^3/3\Lambda^2 + L^2/\Lambda - L^2/2\Lambda$, and the lower end, $\ell = 0$, gives zero. So

$$\boxed{C_{\rm body} \approx \frac1{\ln2}\Bigl[\frac{L^3}{3\Lambda^2} + \frac{L^2}{2\Lambda}\Bigr]},$$

which is the paper's equation [](/paper/#eq:hair-bits).

**Numbers.** From three radii, $\Lambda = \ln3 = 1.099$. At $\SNR = 10^6$, $L = 13.82$ and $L/\Lambda = 12.6$, chapter
2.3's degree 12, and $C_{\rm body} \approx 1051 + 125 = 1176$ bits. The direct sum over the 169 moments of degrees 0 to
12 gives 1184, so the integral is within 0.7%; the paper rounds to 1200. At $10^{70}$ it reads to degree 146, and
$C_{\rm body} = 1.69\times10^6$ bits, 211 kilobytes, the paper's "two hundred kilobytes". When the camera is so far
that $\Lambda > L$, only the monopole stands above the noise, the integral fails, and the body gives $\log_2\SNR$ bits.

**A black hole has seven numbers.** A black hole at rest is fixed by its mass, the three components of its spin and the
three of its position.[^nohair] Each is read at most at $\SNR$, so the hole gives at most $7\log_2\SNR$ bits: 140 at
$10^6$ and 1630 at $10^{70}$, whatever its size. A body read from three radii holds 8.4 times as much at $10^6$, the
paper's "nearly nine", and 1035 times as much at $10^{70}$, "a thousand".

{{paper fig:hair}}

**A limit: the near field again.** For a camera close to the surface, at a height $z = R_c - R$ much smaller than $R$,
the logarithm is $\Lambda = \ln(1 + z/R) \approx z/R$. The sphere's area $4\pi R^2$ holds $4\pi/\Lambda^2$ patches of
area $z^2$, each with the $(\ln\SNR)^3/12\pi\ln2$ bits of the last section, and their product is $L^3/(3\Lambda^2\ln2)$,
the leading term of $C_{\rm body}$. The match holds only for this term, because the monopole's ratio and the patch
ratio differ by a constant factor, and the constant this adds to $L$ changes only the terms of lower order.

## A blurred picture spends its few bits on a few numbers

A picture of 38 bits cannot be sharp. But a scene known to be simple can spend those bits on a few numbers. Chapter
[3.3](/tutorial/noise/measuring-a-number/#one-mass-a-metre-away-is-placed-to-a-millimetre) placed one mass a metre away
to 1.3 mm in depth and 0.8 mm across at $\SNR = 10^3$. If the mass was known beforehand only to within about a metre
in each direction, its depth is one of $1000/1.3 = 770$ cases, worth 9.6 bits, and each coordinate across is worth
10.3 bits. The position is worth about 30 bits, of the same size as the 38 bits of a patch. A blurred image and a
precise measurement are compatible because they spend the same few bits differently.

**A picture made by counting gravitons is limited by their number.** The paper's [Section IX](/paper/#sec:first-image)
considers another camera, which records the thermal glow of the Earth's interior by counting **gravitons**, the quanta
of gravitational waves. Each graviton lands in one of $N_{\rm c}$ cells of the picture, so $N_{\rm g}$ gravitons carry
at most $N_{\rm g}\log_2N_{\rm c}$ bits.[^counting] Such a camera, a metre square and looking down at the Earth for a
year, counts at most about 450 gravitons.[^450] Their $450\log_2N_{\rm c}$ bits stay below a kilobyte, 8000 bits,
while $N_{\rm c} < 2^{17.8} = 2.2\times10^5$, a grid of about 470 by 470 cells. So any coarser picture of the
planet's interior holds less than a kilobyte, whatever the noise of its sensors.

::: check
### Q

How many bits, at most, does a reading carry whose signal stands three times above its noise?

### A

With $s = 3$, $\tfrac12\log_2(1 + 9) = \tfrac12\log_210 = 1.66$ bits, a little more than $\log_23 = 1.58$.

### Q

Doubling the number of digits of $\SNR$, from $10^3$ to $10^6$, multiplies the bits by only 5.3. Why not by eight?

### A

The number of patterns grows as $q_c^2$ and the bits in each as $q_c$, so the bits grow roughly as $q_c^3$. But $q_c$
grows more slowly than the number of digits, because of the $\ln q_c$ in $L_\pi = q_c - \ln q_c$: it goes from 10.4 to
17.8, a factor of 1.72, and $1.72^3 = 5.1$. The factor approaches $2^3 = 8$ only at enormous sensitivities, 7.4 from
$10^{35}$ to $10^{70}$.

### Q

Why does a camera three radii from a stone stop at degree 12 at $\SNR = 10^6$?

### A

Each degree is three times weaker than the last, and $3^{12.6} = 10^6$, so degree 13 lies below the noise.

### Q

How many bits does the field of a black hole at rest give at $\SNR = 10^6$?

### A

Seven numbers of $\log_210^6 = 19.9$ bits each, about 140 bits.
:::

**The idea to keep: one number seen through Gaussian noise carries at most $\tfrac12\log_2(1 + s^2)$ bits; a near-field
picture adds that over its ripples, whose noise is independent, and because sensitivity buys both more patterns and
more bits in each, the total grows as a power of the logarithm of the sensitivity that approaches three: 38 bits per
patch at $10^3$, 22 kilobytes at $10^{70}$.**

::: problems
### Practice

Evaluate the paper's equation [](/paper/#eq:capacity) at $\SNR = 10^6$ from $q_c = 17.84$, split it into patterns and
bits per pattern, and compare it with the 200 bits of Figure [](/paper/#fig:capacity).

::: solution
$q_c^3/3 = 1892.6$ and $q_c^2/2 = 159.1$, so $C \approx 1733.5/(4\pi\times0.6931) = 199$ bits. The patterns number
$q_c^2/4\pi = 25.3$, each with $(17.84/3 - 0.5)/\ln2 = 7.86$ bits. The integral gives 200.9, 0.9% more.
:::

### Stretch

Chapter 3.5 found that pattern 17 of the locked safe's camera stands at $s = 1.14$, and that the reading narrows the
prior's 324 kg to a posterior standard deviation of 213 kg; pattern 25 stands at $s = 0.083$. How many bits does each
carry at most, and how do the two standard deviations give the same number for pattern 17?

::: solution
Pattern 17 carries $\tfrac12\log_2(1 + 1.30) = 0.60$ bits. For a Gaussian prior the information is the narrowing of
the bell, $\log_2(324/213) = \log_21.521 = 0.61$ bits. The small difference is rounding. Chapter 3.5 rounded the
fraction of the variance that remains, $1/(1 + s^2) = 0.435$, to 0.43, and $324\unit{kg}\times\sqrt{0.43} = 213$ kg.
With $s = 1.14$ used exactly, the posterior standard deviation is $324\unit{kg}/\sqrt{1 + 1.14^2} = 213.7$ kg, and
$\log_2(324/213.7) = 0.60$ bits, the bound itself. Pattern 25 carries $s^2/2\ln2 = 0.0050$ bits: a pattern below its
noise adds almost nothing.
:::

### The paper

Reproduce the numbers of the paper's paragraph [*The number of bits*](/paper/#par:the-number-of-bits) from equation
[](/paper/#eq:hair-bits): 1200 bits from three radii at $10^6$, $1.7\times10^6$ at $10^{70}$, a black hole's 140 and
1600, and the ratios "nearly nine" and "a thousand".

::: solution
With $\Lambda = \ln3 = 1.0986$: at $10^6$, $L = 13.816$, $L^3/3\Lambda^2 = 728.27$ and $L^2/2\Lambda = 86.87$, so
$C_{\rm body} = 815.1/0.6931 = 1176$ bits. At $10^{70}$, $L = 161.18$ and $C_{\rm body} = 1.69\times10^6$ bits. The hole
gives $7\times19.93 = 140$ and $7\times232.5 = 1628$ bits. The ratios are $1176/140 = 8.4$ and
$1.685\times10^6/1628 = 1035$.
:::
:::

::: paper
- [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image) (Section IV) derives
  equations [](/paper/#eq:capacity-integral) and [](/paper/#eq:capacity) as here, with Figure
  [](/paper/#fig:capacity), the wave camera, Kolmogorov and Tikhomirov, the single pixel and the counted gravitons; its
  plain words give the 38 bits and the 22 kilobytes.
- [*The number of bits*](/paper/#par:the-number-of-bits) (Section XII) derives [](/paper/#eq:hair-bits), with the
  black hole's $7\log_2\SNR$ and Figure [](/paper/#fig:hair)(b).
- [*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading) (Section XIII) states that a second
  reading's bits grow as the fourth power of $\ln\SNR$ (chapter 13.2).
- [Section IX](/paper/#sec:first-image) gives the graviton counts behind the $N\log_2M$ bound (Part 10).
:::

::: deeper
- The [GR course, section 22.7](https://neovand.github.io/general-relativity/chapter-22.html#probability-temperature-and-entropy)
  builds entropy from probabilities, the physicist's side of the first section, and [section
  22.10](https://neovand.github.io/general-relativity/chapter-22.html#22-10-the-information-question-without-assuming-quantum-mechanics)
  asks what information means when it is said to be lost.
- T. M. Cover and J. A. Thomas, *Elements of Information Theory* (2nd edition, 2006), chapters 2, 8 and 9: entropy,
  differential entropy and the Gaussian channel, with the proofs this chapter states.
- C. E. Shannon, "A mathematical theory of communication" [@Shannon1948], *Bell System Technical Journal* 27 (1948),
  379–423 (July) and 623–656 (October): the source of the bound $\tfrac12\log_2(1 + s^2)$, in Theorem 17 of the
  October part.
- A. N. Kolmogorov and V. M. Tikhomirov, "ε-entropy and ε-capacity of sets in function spaces", *Uspekhi
  Matematicheskikh Nauk* 14, no. 2 (1959), 3–86; English translation in *American Mathematical Society Translations*
  (2) 17 (1961), 277–364: the power $n + 1$ of the logarithm.
:::

[^H]: An entropy is always written here with its argument, as $H(x)$. The bare $H$ of chapter
    [3.5](/tutorial/noise/wiener-filter/) is the Wiener weight, and the paper's Section XII uses $H$ for the bits of a
    body's field, which this chapter calls $C_{\rm body}$.

[^coding]: For a single unknown, the best average number of questions lies between $H(x)$ and $H(x) + 1$; asking
    about many unknowns together brings it to $H(x)$ per unknown. This is Shannon's source coding theorem, stated here
    without proof.

[^h]: This $h$ is neither the strain $h$ of a gravitational wave nor a harmonic function $h$ of Part 2.

[^I]: This $I(x;y)$ is not the invariant $\mathrm{tr}\,\mathcal W^2$ of the paper, which is also called $I$.

[^shannon]: Shannon's paper appeared in two parts in 1948. The Gaussian results are in the October part (volume 27,
    issue 4, pages 623–656), where Theorem 17 gives the capacity of any channel of limited bandwidth with white
    Gaussian noise added to the signal. Per real number carried, it is \eqref{eq:one-channel}. The paper asks his
    question of a gravitational picture.

[^subadd]: The noise is independent of the scene and from ripple to ripple, so $h(y|x)$ for the whole data is the sum
    of the ripples' $h(n_k)$. The entropy of several readings is at most the sum of their entropies, with equality
    when they are independent, which we state without proof. By \eqref{eq:mutual}, the information about the scene is
    $h(\text{data}) - \sum_kh(n_k)$. That is at most $\sum_k[h(y_k) - h(n_k)]$, which is $\sum_kI(x_k;y_k)$.

[^C]: This $C$ is not the flyby constant $C$ of chapter 1.8.

[^code]: We evaluate the integral numerically, split at the cut-off $q_c$ of chapter
    [3.7](/tutorial/noise/blur-law/#step-4-solving-the-cut-off-needs-a-logarithm-of-a-logarithm), to an accuracy far
    below the digits shown. The paper's reference implementation, `reference/gravcam/capacity.py`, gives the same
    values.

[^low]: The range below $q = 1/\pi\SNR$, where $\log_2s < 0$, is included in the integral, but it changes it by less
    than $(\pi\SNR)^{-2}$, nothing at the sensitivities of interest.

[^edge]: Near $q_c$, $\ln s^2$ falls by about 2 for each unit of $q$. Below $q_c$ the closed form misses
    $\ln(1 + s^2) - \ln s^2 = \ln(1 + 1/s^2)$, and above it misses $\ln(1 + s^2)$; with $u = \ln s^2$ both are
    $\ln(1 + e^{-|u|})$, whose integral over all $u$ is $\pi^2/6$. Over $q$ that is $\pi^2/12$ nats. Weighted by
    $q \approx q_c$, divided by $4\pi$ and by $\ln2$, it gives $\pi q_c/(48\ln2) = q_c/10.6$ bits.

[^diffraction]: Chapter [5.3](/tutorial/waves/diffraction/#an-array-resolves-as-many-directions-as-its-area-holds-square-wavelengths) derives the resolution of a wave camera; here only the count of directions is used.

[^L]: These are the paper's letters for two logarithms. This $L$ is not the side of a patch in chapters 3.2 and 3.5,
    and this $\Lambda$ is not the projector of the wave chapters.

[^Cbody]: The paper writes this number as a bare $H$; we keep $H$ for entropies.

[^nohair]: This is the no-hair theorem, stated with its conditions in chapter 11.2.

[^counting]: The paper writes this bound as $N\log_2M$, for $N$ gravitons over $M$ cells.

[^450]: Part 10 derives this number; here it is only an input.
