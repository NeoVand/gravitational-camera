---
id: '5.2'
title: 'Sources and retarded waves: the near zone and the wave zone'
question: 'The paper says that within $\lambda/2\pi$ of a source its field follows the source almost at once, and that beyond it the field is a wave falling as $1/r$. Where does the $2\pi$ come from, and why does the field change its law at that distance?'
part: '5'
requires: ['2.2', '2.4', '2.6', '3.6', '4.3', '4.5', '5.1']
paper: [sec:regimes, eq:nearzone, fig:regimes, sec:near-field, sec:waves, eq:quadrupole, eq:wave-zone, sec:one-pixel, sec:vistas, eq:multipole, sec:hole]
figures: [fig:regimes]
live: [near-to-wave, regime-map]
depth: A
---

The paper's [Section III](/paper/#sec:regimes) divides the space round every moving source into two regions. Inside
the **near zone**,

{{paper eq:nearzone}}

the field is Newton's, "following the source almost instantaneously". Outside it the field is radiation, "falling off
as $1/r$". Here $r$ is the distance from the source, $f$ the frequency of the waves the source would send out, in
hertz, and $\lambda = c/f$ their wavelength (chapter
[5.1](/tutorial/waves/wave-equation/#a-plane-wave-is-a-turning-number-that-travels)). For a spinning rotor or two
bodies in orbit, $f$ is twice the turning rate, because a spinning bar looks the same after half a turn. The region
far outside is the **wave zone**. For waves of 1 Hz the paper puts the edge at 48,000 km, and for 1 kHz at 48 km, and
its Figure
[](/paper/#fig:regimes) shows every mechanical source in daily life on the near side of that edge.

So we ask where the $2\pi$ comes from, and why the field changes its law at that distance. The answer comes from one
formula, the field that a changing source sends out. The same formula then gives the paper's wave-zone equation
[](/paper/#eq:wave-zone), which says what a camera far from a source can learn about its shape.

::: plain
When a source of gravity moves, the change in its pull does not reach the rest of the world at once. The change
travels outward at the speed of light, so the field at any place shows the source as it was a little earlier, one
travel time ago.

Close to a source the travel time is short. If the source moves back and forth, the news arrives within a small fraction
of one swing. The source has hardly moved since it sent the news, so the field there is the ordinary pull of the source
where it is now. That pull weakens quickly with distance. Far away, the news arrives many swings late, and what arrives
is a wave. A wave weakens much more slowly, as one over the distance, and it carries energy away for good.

The change from one law to the other happens where the two parts of the field are equal in size. That distance is
the wavelength divided by $2\pi$, which is about a sixth of a wavelength. For waves of one cycle a second it is
48,000 km.

Far from a source, each direction carries one ripple of the source's pattern. This is how a camera far away can
learn about the source's shape, as long as the source is not much smaller than a wavelength.
:::

## A source sends its news outward at the speed of the wave

We want the field that a source makes when it changes in time, because the near zone and the wave zone are two parts
of that one field. Chapter 5.1 wrote the wave equation for a field $\sym{wave-field}{u}$ in empty space. We now add a
**source**, a given function $\sym{wave-source}{s}(\vect x, t)$ that drives the field at each place and time:

$$\frac{1}{c^2}\frac{\partial^2u}{\partial t^2} - \nabla^2u = s(\vect x, t) . \label{eq:wave-source}$$

Here $u$ stands for any field that obeys the wave equation, in whatever unit it has, $c$ is its speed, and $\vect x$ is
the position in metres. The source $s$ is in the unit of $u$ per square metre, because $\nabla^2$ divides by a square
metre.[^s] When nothing changes in time, the first term drops out and [](#eq:wave-source) becomes $-\nabla^2u = s$.
This is Poisson's equation of chapter
[2.4](/tutorial/outside/greens-functions/#the-potential-of-one-point-builds-every-potential) with its sign moved:
Newton's potential is $u = \field\Phi$ with $s = -4\pi G\matter\rho$. We assume that **the source is confined to a
finite region** and that **no wave comes in from far away**, so that every part of the field is made by the source.

**One point, at all times.** We start with a source at one point, the origin, and try a field that depends only on the
distance $r = |\vect x|$ and the time:

$$u = \frac{F(t - r/c)}{r} .$$

Here $F$ is any function of one variable, in the unit of $u$ times a metre. The numerator is one of chapter 5.1's
[travelling shapes](/tutorial/waves/wave-equation/#any-shape-travels-without-changing), moving outward, and the factor
$1/r$ is the static field of a point. Away from the origin $u$ depends only on $r$ and $t$, so chapter 2.2's
[Laplacian in spherical coordinates](/tutorial/outside/spherical-harmonics/#the-laplacian-splits-into-a-part-along-the-radius-and-a-part-on-the-sphere)
keeps only its radial part:

$$\nabla^2u = \frac{1}{r^2}\frac{\partial}{\partial r}\Bigl(r^2\frac{\partial u}{\partial r}\Bigr)
= \frac{\partial^2u}{\partial r^2} + \frac{2}{r}\frac{\partial u}{\partial r} = \frac{1}{r}\frac{\partial^2(ru)}{\partial
r^2} .$$

The second form comes from the product rule, and differentiating the product $ru$ twice gives the third. Here
$ru = F(t - r/c)$, and by the chain rule each derivative with respect to $r$ brings down a factor $-1/c$, so

$$\nabla^2u = \frac{F''(t - r/c)}{c^2\,r} = \frac{1}{c^2}\frac{\partial^2u}{\partial t^2} .$$

So away from the origin the left side of [](#eq:wave-source) is zero for every choice of $F$. The field is a shape that
travels outward at the speed $c$, keeping its form while its size falls as $1/r$.

**At the point itself.** Close to the origin the delay $r/c$ is tiny, and $u \approx F(t)/r$. Chapter 1.3 found that
[$\nabla^2(1/r) = -4\pi\,\delta^3(\vect x)$](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point),
where $\sym{delta-function}{\delta^3}$ is the delta function, in $\mathrm{m^{-3}}$. So $-\nabla^2u$ contains the term
$4\pi F(t)\,\delta^3(\vect x)$. The terms in which a derivative falls on $F$ add no delta function: the box below
shows that they cancel exactly. Therefore $u = F(t - r/c)/r$ solves [](#eq:wave-source) with the point
source $s = 4\pi F(t)\,\delta^3(\vect x)$.

::: derivation
### The source of $F(t - r/c)/r$, exactly

We write $u = F\cdot(1/r)$, with $F$ evaluated at $t - r/c$, and use the product rule for the Laplacian,
$\nabla^2(Fg) = g\,\nabla^2F + 2\,\nabla F\cdot\nabla g + F\,\nabla^2g$, with $g = 1/r$. The gradients are $\nabla F
= -\dot F\,\hat{\vect x}/c$ and $\nabla(1/r) = -\hat{\vect x}/r^2$, where $\hat{\vect x}$ is the unit vector along
$\vect x$ and a dot is a derivative with respect to the time. So the middle term is $2\dot F/cr^2$. The radial
Laplacian of $F(t - r/c)$ is $\ddot F/c^2 - 2\dot F/cr$, and dividing it by $r$ gives the first term. Adding the three,

$$\nabla^2u = \frac{\ddot F}{c^2r} - \frac{2\dot F}{cr^2} + \frac{2\dot F}{cr^2} + F\,\nabla^2\frac1r .$$

The two middle terms cancel, the first is $c^{-2}\partial_t^2u$, and $\nabla^2(1/r) = -4\pi\delta^3(\vect x)$, so

$$\nabla^2u = \frac{1}{c^2}\frac{\partial^2u}{\partial t^2} - 4\pi F(t)\,\delta^3(\vect x) .$$

In the last step $F(t - r/c)\,\delta^3(\vect x) = F(t)\,\delta^3(\vect x)$, because the delta function is zero
except at $r = 0$. So $c^{-2}\partial_t^2u - \nabla^2u = 4\pi F(t)\,\delta^3(\vect x)$ everywhere, the origin
included.
:::

**The Green's function.** A point source of strength $\sym{point-strength}{b}(t)$, that is $s = b(t)\,\delta^3(\vect
x)$ with $b$ in the unit of $u$ times a metre, therefore makes the field $u = b(t - r/c)/4\pi r$. A single blow at
the time zero, $b = \delta(t)$, makes the **retarded Green's function**

$$\boxed{\;\sym{retarded-greens-function}{\mathcal G_{\rm ret}}(r, t) = \frac{\delta(t - r/c)}{4\pi r} ,\;}
\label{eq:green-ret}$$

in $\mathrm{s^{-1}\,m^{-1}}$. At the distance $r$ it is zero until the time $r/c$, when the news of the blow arrives,
and zero again after it. Chapter 2.4's Green's function $\sym{greens-function}{\mathcal G} = -1/4\pi r$ solved
$\nabla^2\mathcal G = \delta^3$. The sign is opposite here because [](#eq:wave-source) has $-\nabla^2$ on its left
side, so that a positive source makes a positive field.

**Every piece of a source.** The equation is linear, so a source is a sum of blows. The piece at $\vect y$ acting
between the times $t'$ and $t' + \dd t'$ is a blow of strength $s(\vect y, t')\,\dd^3y\,\dd t'$, and its field at
$\vect x$ and $t$ is $\mathcal G_{\rm ret}(|\vect x - \vect y|, t - t')$ times that strength. We add all the pieces. The
delta function picks out the one time $t' = t - |\vect x - \vect y|/c$, so

$$\boxed{\;u(\vect x, t) = \int\frac{s\bigl(\vect y,\,t - |\vect x - \vect y|/c\bigr)}{4\pi\,|\vect x - \vect y|}
\,\dd^3y .\;} \label{eq:retarded}$$

This is the **retarded solution**: each piece of the source counts as it was one travel time
ago (Figure [](#fig:ret-cone)). The time $\sym{retarded-time}{t_{\rm ret}} = t - |\vect x - \vect y|/c$ at which a
piece must act to be felt at $\vect x$ at the time $t$ is its **retarded time**.[^u]

![Look first at the dark patch of the source where the backward cone cuts it: those pieces, each at its own retarded
time, make the field at the dot now. Time and the one space direction across are on one scale, so that light runs at
45°; the depth is suggested in perspective, and the sketch is schematic.](tut-ret-cone){#fig:ret-cone}

**A limit.** If the source does not change in time, the delay does not matter, and [](#eq:retarded) is chapter 2.4's
[superposition of point fields](/tutorial/outside/greens-functions/#the-potential-of-one-point-builds-every-potential).
With $s = -4\pi G\matter\rho$ it gives
$u = -G\int\matter\rho\,\dd^3y/|\vect x - \vect y| = \field\Phi$, Newton's potential.

**The other solution.** The field $F(t + r/c)/r$ solves the wave equation too, by the same algebra. It is the
**advanced solution**: its field would reach $\vect x$ before the source acted, like a wave that came in from far away
and closed on the source. The assumption that no wave comes in excludes it. So does **causality**, the rule of chapter
[4.5](/tutorial/response/causality/#a-linear-response-adds-up-the-answers-to-every-earlier-push) that nothing answers
before it is pushed: [](#eq:retarded) is a linear response to the source, and $\mathcal G_{\rm ret}$ is its kernel,
zero before the blow.

**A number.** The Moon is 384,400 km away, so its pull reaches the Earth $3.844 \times 10^8/2.998 \times 10^8 =
1.28\unit{s}$ late. What matters is how much the Moon's tide changes in that time. Seen from a frame that does not
turn with the Earth, the pattern of the tide repeats every half orbit, 13.7 days, an angular frequency of
$2\pi/(13.7 \times 86{,}400\unit{s}) = 5.3 \times 10^{-6}\unit{s^{-1}}$. So the delay is a phase of
$5.3 \times 10^{-6} \times 1.28 = 6.8 \times 10^{-6}$ radians, about a millionth of a cycle. This is the paper's
"almost instantaneously". The tide at one place rises and falls every 12.4 hours, but that change comes from the
Earth turning under the pattern, and the turning of the observer delays nothing.[^moon]

**What it means.** The field at a place is a record of the source as it was, each piece seen at its own retarded time.
Whether the delay matters depends on how much the source changes during it.

## Beside an oscillating source the slope of the field has a near part and a wave part, equal at $kr = 1$

We want to know how the field of a changing source changes its law with the distance, and where. A pixel does not feel
the field $u$ itself but its change from place to place: for Newton's potential the gradient is the pull of gravity
with its sign reversed (chapter
[1.2](/tutorial/newton/field-and-potential/#a-potential-is-one-number-per-point-whose-downhill-slope-is-the-field)),
and the second derivatives are the tide. So we take the point source of the last section, $u = b(t_{\rm ret})/4\pi r$
with $t_{\rm ret} = t - r/c$, and differentiate it along the radius. The product rule and the chain rule give its
**slope**

$$\frac{\partial u}{\partial r} = -\frac{b(t_{\rm ret})}{4\pi r^2} - \frac{\dot b(t_{\rm ret})}{4\pi c\,r} .
\label{eq:slope}$$

The slope has two parts. The **near part**, the first, falls as $1/r^2$ and follows the value of the source: it is the
slope of the static field of a point whose strength is the one it had a travel time ago. The **wave part**, the second,
falls only as $1/r$, and it follows the rate of change of the source. A source that does not change has no wave part.
Close to the source the delay in the near part is cancelled, to first order, by the wave part, so that their sum
follows the source as it is now; the next section shows this.

**One frequency.** Let the source oscillate, $b = \mathrm{Re}[\tilde b\,e^{-i\omega t}]$, where $\omega$ is the
[angular frequency](/tutorial/waves/wave-equation/#a-plane-wave-is-a-turning-number-that-travels) in radians per second
and the complex amplitude $\tilde b$ holds the size and the phase. Then $\dot b = -i\omega b$, and with the wavenumber
$\sym{wavenumber}{k} = \omega/c$ of chapter 5.1 the field is $u = \mathrm{Re}[\tilde b\,e^{i(kr - \omega t)}/4\pi r]$.
Its slope is $\tilde b\,e^{-i\omega t}/4\pi$ times

$$\frac{\partial}{\partial r}\frac{e^{ikr}}{r} = e^{ikr}\Bigl(-\frac{1}{r^2} + \frac{ik}{r}\Bigr) .$$

The two parts have the sizes $|\tilde b|/4\pi r^2$ and $k|\tilde b|/4\pi r$, so the wave part is $kr$ times the near
part. They are equal in size where $kr = 1$, at the distance

$$\boxed{\;r = \frac{1}{k} = \frac{c}{\omega} = \frac{c}{2\pi f} = \frac{\lambda}{2\pi} .\;} \label{eq:boundary}$$

This is the edge of the paper's near zone, [](/paper/#eq:nearzone). The $2\pi$ is there because the wavelength
$\lambda = 2\pi/k$ is one whole turn of the wave's phase, while the edge is where the phase has turned by one radian.
Inside it, $kr < 1$, the near part is the larger; outside it the wave part is (Figure [](#fig:ret-crossing)). The wave
part follows the rate of change of the source, and a rate of change runs a quarter cycle ahead of what changes. So the
wave part reaches each of its peaks a quarter cycle before the near part does, while both share the delay $r/c$.

**Every derivative behaves alike.** Each derivative of $e^{ikr}/r$ that falls on $1/r$ adds a power of $1/r$, and each
that falls on $e^{ikr}$ adds a factor $ik$. So the $n$-th derivative is $e^{ikr}/r$ times a sum of terms
$k^a/r^{n-a}$, with $a$ from 0 to $n$. The near term, $n!/r^{n+1}$ in all, wins for $kr \ll 1$, and the wave term,
$k^n/r$, wins for $kr \gg 1$. They are equal where $(kr)^n = n!$, at $kr = 1$, 1.41, 1.82 and 2.21 for the first four
derivatives, so the change of law happens near $kr = 1$ to 2. For the second derivative, the tide, the crossing is at
$kr = \sqrt2$.[^tide]

**Numbers.** At 1 Hz, $c/2\pi f = 2.998 \times 10^8/2\pi = 4.77 \times 10^7$ m, or 47,700 km, and at 1 kHz it is
47.7 km, which the paper rounds to 48,000 km and 48 km. Halve the frequency, and the edge moves twice as far out.

![Look first at the crossing of the two solid lines: the near part (blue) falls faster and wins inside $\lambda/2\pi$,
the wave part (orange) wins outside. The tide's two terms that fall faster than $1/r$, taken together and dotted, cross
their wave term, which is the same line as the slope's, a little farther out, at $kr = 2.2$. Lines
exact.](tut-ret-crossing){#fig:ret-crossing}

{{paper fig:regimes}}

Look first at the diagonal line of the paper's figure: it is [](#eq:boundary), drawn on axes of frequency and distance,
each in powers of ten. Every source that moves as a whole lies below it, in its near zone, as seen from the distances at
which the paper places it.

**The gravitational source, stated.** A mass cannot oscillate as a single point. Its total $\matter M$ does not change,
so the strength $b = -4\pi G\matter M$ of its point source is a constant. Its centre of mass, the next term of chapter
2.3's multipoles, moves steadily, because the total momentum does not change. So the first part of a body's mass that
can oscillate is its quadrupole, the measure of how far the mass is drawn out along an axis, and its changing near tide
falls as $r^{-5}$, like the ringing steel ball's of chapter
[4.3](/tutorial/response/elastic-bodies/#a-ringing-quadrupole-makes-a-tide), while its wave falls as $1/r$ (chapter 7.7
shows this). More derivatives make a longer sum of terms, but the change of law is still near $kr = 1$ to 2: for two
black holes in orbit the paper's [*A pair of black holes, from the near zone to the wave
zone*](/paper/#par:a-pair-of-black-holes-from-the-near-zone-to-the-wave-zone) finds that the two laws cross at
$0.3\lambda$, where $kr = 1.9$. Near the edge both parts are present, so the edge is a crossover, not a cliff.

::: try {#near-to-wave}
The field of one oscillating point along a line away from it, at one instant. The upper panel shows the field times
$r$. The lower panel splits the slope [](#eq:slope) into its near part (blue) and its wave part (orange), each
multiplied by $r^2$, with their sum in ink; the dashed envelopes are the two parts' sizes, and the thin line marks
$r = \lambda/2\pi$. The distance runs on a logarithmic scale in wavelengths, with kilometres below. Drag the probe, or
choose it with Tab and use the arrow keys; the slider changes the frequency over the same kilometres. *Play* lets the
phase turn, and *A quarter cycle on* steps it. The readouts give $r/\lambda$, $kr$, the sizes of the two parts and
their ratio, and the shared delay.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, play
it with the probe near $kr = 1$ and watch which part reaches its peak first.
:::

## Inside the near zone the field is the static field of the source as it is now

We want to know how well the static field describes the field inside the near zone, and where it stops doing so. The
small parameter is $kr = \omega r/c$. It is the delay $r/c$ measured in radians of the source's cycle, since $\omega$
radians pass each second. For the Moon's tide it is $6.8 \times 10^{-6}$, as the first section found. The steel ball of
chapter
[4.3](/tutorial/response/elastic-bodies/#a-guessed-shape-overestimates-the-lowest-note-and-a-good-guess-comes-close)
rings in its lowest quadrupole mode at 12.6 kHz, which is also the frequency of its waves, so its near zone reaches
$c/2\pi f = 3.8$ km, and a metre from the ball $kr = 2.6 \times 10^{-4}$.

**The approximation.** When **$kr \ll 1$ for every piece of the source**, the delay of each piece is a small fraction
of a cycle, and $s(\vect y, t - |\vect x - \vect y|/c) \approx s(\vect y, t)$ in [](#eq:retarded). Then

$$u(\vect x, t) \approx \int\frac{s(\vect y, t)}{4\pi\,|\vect x - \vect y|}\,\dd^3y ,$$

the static solution of chapter 2.4 with the source as it is now. For gravity this is Newton's field of the present
masses, the paper's field "following the source almost instantaneously".

**The first neglected terms.** We write $R = |\vect x - \vect y|$ and expand the source in its delay:
$s(\vect y, t - R/c) = s - (R/c)\,\dot s + (R^2/2c^2)\,\ddot s - \dots$, with $s$ and its time derivatives taken at
$(\vect y, t)$. In [](#eq:retarded) the second term gives

$$-\frac{1}{4\pi c}\int\dot s(\vect y, t)\,\dd^3y ,$$

because the factor $R$ cancels the $1/R$. This term is the same at every point $\vect x$, so it has no slope and pulls
nothing. For gravity it is zero as well, because $s = -4\pi G\matter\rho$ and the total mass does not change. The first
term that changes the slope is therefore the third, $(1/8\pi c^2)\int\ddot s\,R\,\dd^3y$. So at order $kr$ the delay
changes the field only by a uniform amount, and it changes the slope, which is what a pixel feels, only at order
$(kr)^2$. The point source shows the cancellation: expanding $e^{ikr} = 1 + ikr - \tfrac12(kr)^2 + \dots$ gives

$$e^{ikr}\Bigl(-\frac1{r^2} + \frac{ik}{r}\Bigr) = -\frac1{r^2}\Bigl(1 + \tfrac12(kr)^2 + \dots\Bigr) ,$$

because the terms of order $kr$ in the near part and in the wave part cancel. So the slope of a point source differs
from the static slope of the present source by $\tfrac12(kr)^2$. A quadrupole, the first part of a mass that can
oscillate, has smaller coefficients: $(kr)^2/6$ for its field and $(kr)^2/18$ for its radial slope.[^quad] The
correction is of order $(kr)^2$ in every case: $5 \times 10^{-11}$ for the Moon's tide, and $7 \times 10^{-8}$ a metre
from the ringing ball. The paper's
[*The absence of gravitational aberration*](/paper/#par:the-absence-of-gravitational-aberration) says the same of two
masses in orbit, whose field is Newton's field "of their present positions to order $(kr)^2$", while their retarded
positions "would be off by $kr$ itself".

**Where it fails.** As $kr$ approaches 1, every term of the expansion is as large as the first, and beyond
$\lambda/2\pi$ the wave part of [](#eq:slope) is larger than the static slope.

**What it means.** Every mechanical source in a room, and every camera in the same town, is deep inside the near zone.
A camera there sees the present arrangement of the mass, not a delayed one.

::: try {#regime-map}
Predict first, with the map's own question: a person sways once a second, 10 km from a camera. Is the camera in the
person's near zone (the map's "near field") or in the waves? Put the probe at 1 Hz and 10 km for the answer. Then press
the Moon's tide, LIGO's calibration rotor and a warm object in the room, and read $r/(\lambda/2\pi)$ below the map. The
Moon reads $1.8 \times 10^{-4}$, because the map, like the paper's figure, places its tide by the 12.4-hour rise and
fall at one place: an upper bound, since the pattern itself gives $6.8 \times 10^{-6}$. The rotor, 1.5 m from a mirror,
sends waves of about 32 Hz and reads $10^{-6}$. Only the warm object's glow is a wave at the camera: its near zone ends
2.7 μm from the object.
:::

## Far away, each direction carries one ripple of the source

We want the field far from a source of any size, because the paper's [](/paper/#eq:wave-zone) is that field, and it
says what a far camera can learn about the source's shape. The source lies within a distance $L$ of the origin, so $L$
is its radius. The field point is at $\vect x = r\hat n$, where $\sym{wave-direction}{\hat n}$ is the unit vector from
the source toward the field point, as in the paper's Sections V and XI.[^n] We assume that **the field point is far
from the source** in three senses: $r \gg L$, $r \gg \lambda/2\pi$ and $r \gg L^2/\lambda$. The second puts it in the
wave zone. For a compact source the three come in the order $L \ll \lambda \ll r$, and the third then follows from the
other two.

**The distance to each piece.** The distance from the piece at $\vect y$ to the field point is

$$\begin{aligned}
|\vect x - \vect y| &= \sqrt{r^2 - 2r\,\hat n\cdot\vect y + y^2}\\
&\approx r - \hat n\cdot\vect y + \frac{y^2 - (\hat n\cdot\vect y)^2}{2r} ,
\end{aligned}$$

by $\sqrt{1 + \epsilon} \approx 1 + \epsilon/2 - \epsilon^2/8$ for small $\epsilon$. Since $r \gg L$, we may put
$|\vect x - \vect y| \approx r$ in the denominator of [](#eq:retarded). This step also needs the wave zone, because the
terms it drops carry the static field of the source's shape. For a quadrupole that field falls as $1/r^3$, while the
wave that is kept falls as $k^2/r$, so inside the near zone the part dropped would be $1/(kr)^2$ times larger than the
part kept. In the delay we need more care, because a change of the path by a wavelength changes the phase by a whole
turn. The last term changes the phase by at most about $kL^2/2r$, which is small when $r \gg L^2/\lambda$. This is the
**far-field condition** of chapter
[3.6](/tutorial/noise/bessel-and-airy/#a-lens-draws-a-star-as-the-square-of-that-pattern), seen from the other
side.[^far] So, in the delay, $|\vect x - \vect y| \approx r - \hat n\cdot\vect y$, and

$$u(r\hat n, t) \approx \frac{1}{4\pi r}\int s\Bigl(\vect y,\;t - \frac{r}{c} + \frac{\hat n\cdot\vect y}{c}\Bigr)
\,\dd^3y .$$

The piece at $\vect y$ is nearer to the field point by $\hat n\cdot\vect y$, so its news arrives earlier by
$\hat n\cdot\vect y/c$.

**One frequency at a time.** We transform in time with the paper's sign of chapter
[2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time),
$\tilde u(\omega) = \int u\,e^{i\omega t}\,\dd t$. For each piece we change the variable to
$t' = t - r/c + \hat n\cdot\vect y/c$, so that $e^{i\omega t} = e^{i\omega t'}\,e^{i\omega r/c}\,e^{-i\omega\hat
n\cdot\vect y/c}$. The integral over $t'$ is the transform of $s$ at $\vect y$, and the factor
$e^{-i\omega\hat n\cdot\vect y/c}$ is a ripple across the source with the wavevector $\omega\hat n/c$. The integral over
$\vect y$ is therefore the transform of the source in space as well:

$$\boxed{\;\begin{gathered}
\tilde u(\omega, r\hat n) = \frac{e^{i\omega r/c}}{4\pi r}\;\tilde s\Bigl(\omega, \frac{\omega\hat n}{c}\Bigr),\\
\sym{source-transform}{\tilde s}(\omega, \vect k) = \int s(\vect y, t)\,e^{i\omega t - i\vect k\cdot\vect y}
\,\dd t\,\dd^3y .
\end{gathered}\;} \label{eq:far}$$

The units agree: $\tilde s$ is in the unit of $u$ per square metre times a second and a cubic metre, and dividing by
$r$ leaves the unit of $u$ times a second, which is that of $\tilde u$. The factor $e^{i\omega r/c}/r$ is a wave going
outward, falling as $1/r$.

**What it reads.** Each direction $\hat n$ reads the source's transform at one wavevector, $\omega\hat n/c$: the ripple
whose crests lie across $\hat n$, a wavelength apart. Along that direction the pieces of the source on one crest of the
ripple send news that arrives in step. All the directions together read the source on the sphere
$|\vect k| = \omega/c$ in the space of wavevectors (Figure [](#fig:ret-far)). Ripples of the source finer than a
wavelength, with $|\vect k| > \omega/c$, are read in no direction: they are the ripples of chapter 5.1 that
[fade instead of travelling](/tutorial/waves/wave-equation/#a-ripple-finer-than-a-wavelength-across-a-plane-fades-instead-of-travelling).

![Look first at the dot on the circle: each direction of view reads the source's ripple at that one wavevector, and
the circle holds every ripple a far camera can read. Schematic; the path difference is exact for parallel
lines.](tut-ret-far){#fig:ret-far}

**Gravity, with its factors stated.** For gravity the field is the **metric perturbation**, a table of small pure
numbers that says how much a weak gravitational field changes the distances and times measured by rulers and clocks
(chapters [7.1](/tutorial/geometry/metric/) and 7.4 build it). The form of it that obeys a wave equation is the
trace-reversed perturbation $\sym{trace-reversed-perturbation}{\field{\bar h}}_{ij}$. Linearized gravity, Einstein's
theory to first order in a weak field, gives each of its components the equation $\Box\field{\bar h}_{ij} = -16\pi
G\matter T_{ij}/c^4$ (stated here; chapter 7.4 derives it), where $\Box = -c^{-2}\partial_t^2 + \nabla^2$. Here $\matter
T_{ij}$, in pascals, is the flow of momentum through matter: the momentum along $i$ that crosses a unit area facing $j$
each second. In a body at rest it is the stress of chapter
[4.3](/tutorial/response/elastic-bodies/#stress-is-force-per-area-and-it-too-is-a-symmetric-table) with its sign
reversed, so that a fluid at the pressure $p$ has $+p\,\delta_{ij}$ here and $-p\,\delta_{ij}$ there, and moving matter
adds the momentum it carries.[^T] This is [](#eq:wave-source) with the source $s = 16\pi G\matter T_{ij}/c^4$, in
$\mathrm{m^{-2}}$ as it should be. Dividing $16\pi G/c^4$ by the $4\pi$ of [](#eq:far) leaves $4G/c^4$. The projector
$\sym{tt-projector}{\Lambda_{ij,kl}}(\hat n)$ then keeps only the part of the field that a wave can carry, the part
across $\hat n$ with no trace (stated; chapter 7.6 builds it).[^lambda] What it leaves, $\field h^{\rm TT}_{ij}$, is the
strain of a gravitational wave of chapter
[5.1](/tutorial/waves/wave-equation/#a-shear-in-a-solid-travels-and-its-law-is-the-wave-equation). The result is the
paper's equation:

{{paper eq:wave-zone}}

The paper's [*What does not radiate*](/paper/#par:what-does-not-radiate) adds that a pressure equal in all directions,
which is pure trace, is removed by the projector.

**Two limits.** A source much smaller than a wavelength, $kL \ll 1$, has $e^{-i\vect k\cdot\vect y} \approx 1$ across it
for every $\vect k$ on the sphere, so every direction reads the same number, $\tilde s(\omega, 0)$, the source added up
over its volume. For gravity it is $\int\matter T_{kl}\,\dd^3y$, and chapter 7.7 turns it into the second time
derivative of the quadrupole, the paper's [](/paper/#eq:quadrupole). This is why a compact source is a point in its own
waves. At the other end, a camera of width $D$ at the distance $r$ spans the directions within about $D/r$ of $\hat n$,
so it reads a cap of the sphere of width $kD/r$. By chapter 2.6's [uncertainty
relation](/tutorial/outside/fourier/#on-an-endless-line-the-sum-becomes-an-integral), ripples known over a range $kD/r$
of wavevectors resolve no detail finer than about $2\pi r/kD = \lambda r/D$, as any aperture does (chapter
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)).

## Many sources in step add their amplitudes

We want the wave of many equal sources, because the paper's example of a source larger than its wave is of this kind.
There are $\sym{source-count}{N}$ equal compact sources, each much smaller than a wavelength, at the positions
$\vect x_s$, numbered by $s$.[^index] Each does what the first does at the origin, but with its cycle shifted: it
oscillates as $e^{-i(\omega t + \phi_s)}$, with a phase $\sym{source-phase}{\phi_s}$ in radians. Moving a source from
the origin to $\vect x_s$ multiplies its transform by $e^{-i\vect k\cdot\vect x_s}$, because
$\vect k\cdot\vect y$ grows by $\vect k\cdot\vect x_s$ for every piece, and the phase multiplies it by $e^{-i\phi_s}$.
By [](#eq:far), with $\vect k = \omega\hat n/c$, the wave of the whole is the wave of one source at the origin times

$$\boxed{\;\sym{array-factor}{\mathcal A}(\hat n) = \sum_s e^{-i\phi_s - i\omega\hat n\cdot\vect x_s/c} ,\;}
\label{eq:array}$$

the **array factor**, a pure number. It is the paper's sum in
[*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave).

**Close together and in step.** If the sources are all much closer to each other than a wavelength and have equal
phases, every term is nearly the same, and $\mathcal A = N$. The power of a wave goes as the square of its amplitude
(the next section shows this), so the whole radiates $N^2$ times the power of one. This is **coherent addition**: the
amplitudes add.

**Far apart, or out of step.** The square of the array factor is a double sum,
$|\mathcal A|^2 = \sum_s\sum_{s'}e^{i(\theta_{s'} - \theta_s)}$ with $\theta_s = \phi_s + \omega\hat n\cdot\vect x_s/c$.
The $N$ terms with $s = s'$ are each 1. The others average to zero when the phases are random, or, for sources many
wavelengths apart, when we average over directions. So the average of $|\mathcal A|^2$ is $N$, and the whole radiates
$N$ times the power of one. This is **incoherent addition**: the powers add.

**A number.** The generators of a continental power grid, such as Europe's, turn in step, 50 times a second. A spinning
rotor looks the same after half a turn, so their waves have twice that frequency, 100 Hz. They are $2.998 \times
10^8/100 = 3000$ km long, the paper's figure, and the grid stretches over more than one wavelength. Its array factor
then changes with the direction $\hat n$, so the grid has a shape that waves can show: it is a source larger than its
wave.

## Only the $1/r$ part carries energy to infinity

We want to know which part of the field carries energy away. For a field that obeys the wave equation, the energy that
crosses each square metre per second along the radius is proportional to $-\dot u\,\partial_ru$, as chapter
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed) found for a shear wave, where
the constant was the shear modulus. For the point source, $\dot u = \dot b/4\pi r$ and [](#eq:slope) give

$$-\dot u\,\frac{\partial u}{\partial r} = \frac{b\,\dot b}{16\pi^2r^3} + \frac{\dot b^2}{16\pi^2c\,r^2} ,$$

all at the retarded time. We multiply by the area $4\pi r^2$ of a sphere. The second term then gives
$\dot b^2/4\pi c$, the same through every sphere, however large: this energy leaves for good. The first term, which
comes from the near part, gives $b\dot b/4\pi r$. It falls with the distance, and since $b\dot b$ is the rate of change
of $\tfrac12b^2$, it averages to zero over a cycle. The near part takes energy out and brings it back in each cycle,
and carries none to infinity.

**What it means.** The near part is the field that the source keeps with it: the paper's "field that does not
radiate" of [Section XIV](/paper/#sec:hole), which a camera beside a black hole reads. The wave part is what the source
sends away, and its energy is the same through every sphere only because it falls as $1/r$. That is the far law of
the paper's plain words in Section III, "as one over the distance". Their near law, "one over the distance cubed", is
the tide of a body of fixed mass seen as a point, which does not change; the changing part of a near tide begins with
the quadrupole and falls as $r^{-5}$.

::: check
### Q

How far does the near zone of a rotor whose waves have 30 Hz reach?

### A

To $c/2\pi f = 2.998 \times 10^8/(2\pi \times 30)$ m, or 1600 km.

### Q

Why does the field near a slow source follow it "almost instantaneously"?

### A

Within $\lambda/2\pi$ the travel time $r/c$ is less than $1/\omega$, a small fraction of a cycle, so the retarded
source is nearly the present one. The slope of the field matches the present static slope even better, to a fraction
of order $(kr)^2$, because the terms of order $kr$ cancel.

### Q

A camera far from a compact source sees it as a point. In the language of the section on the far field, why?

### A

It reads the source's transform only at wavevectors of length $\omega/c$. A source much smaller than a wavelength has
the same transform at all of them, its total, so every direction reads the same number.

### Q

Ten equal rotors, close together and turning in step, radiate how much more than one?

### A

A hundred times: the array factor is 10, and the power goes as its square.
:::

**The idea to keep: a source's field at a distance is its own state one travel time earlier. Near the source, within
$\lambda/2\pi$, that delay is negligible, and the field is the static one, falling fast and following the source. Far
away, the field falls as $1/r$, carries energy off, and in each direction reads one ripple of the source, at the
wavevector $\omega\hat n/c$.**

::: problems
### Practice

LIGO measures waves near 100 Hz. How far does their near zone reach, and is a calibration rotor 1.5 m from a mirror
inside it?

::: solution
The near zone reaches $c/2\pi f = 2.998 \times 10^8/(2\pi \times 100)$ m, or 477 km. At 1.5 m the small parameter is
$kr = 2\pi \times 100 \times 1.5/2.998 \times 10^8 = 3.1 \times 10^{-6}$, so the rotor's mirror is deep inside it: it
feels the rotor's present Newtonian pull.
:::

### Stretch

Combine this chapter with chapter 2.6. A line source of length $L$ along the $z$ axis, uniform and in step, has the
array factor $\int_{-L/2}^{L/2}e^{-ik\cos\vartheta\,z}\,\dd z$, where $\vartheta$ is the angle between $\hat n$ and the
line. It is the sum of [](#eq:array) turned into an integral, with the sources counted per unit length, so it is in
metres, not a pure number. Show that it is $L\,\mathrm{sinc}(\tfrac12kL\cos\vartheta)$, with $\mathrm{sinc}\,x = \sin
x/x$, so that a source many wavelengths long sends its waves into a fan within about $\lambda/L$ of the plane across it.

::: solution
With $a = k\cos\vartheta$, the integral is $[e^{-iaz}/(-ia)]_{-L/2}^{L/2} = (e^{iaL/2} - e^{-iaL/2})/ia =
2\sin(aL/2)/a = L\,\mathrm{sinc}(\tfrac12kL\cos\vartheta)$: the transform of a box, as in chapter 2.6. It is largest,
$L$, at $\cos\vartheta = 0$, in the plane across the line, where every piece is the same distance from a far point. Its
first zero is at $\tfrac12kL\cos\vartheta = \pi$, that is at $\cos\vartheta = 2\pi/kL = \lambda/L$. For $L \gg \lambda$
this is an angle of about $\lambda/L$ from the plane, so the waves leave in a thin fan.
:::

### The paper

Derive the form of the paper's [](/paper/#eq:wave-zone), its $e^{i\omega r/c}/r$, its $4G/c^4$ and its argument
$\omega\hat n/c$, from the retarded solution with the source $16\pi G\matter T_{kl}/c^4$, which is given. Then check the
48,000 km and 48 km of the paper's [](/paper/#eq:nearzone).

::: solution
The retarded solution [](#eq:retarded) with $s = 16\pi G\matter T_{kl}/c^4$ gives $\field{\bar h}_{kl} =
(4G/c^4)\int\matter T_{kl}(\vect y, t - |\vect x - \vect y|/c)\,\dd^3y/|\vect x - \vect y|$, since $16\pi/4\pi = 4$.
Far away, $|\vect x - \vect y| \approx r$ in the denominator and $r - \hat n\cdot\vect y$ in the delay. Transforming in
time with $e^{i\omega t}$ and shifting the time variable gives $e^{i\omega r/c}e^{-i\omega\hat n\cdot\vect y/c}$ for
each piece, and the integral over $\vect y$ is the transform at $\vect k = \omega\hat n/c$:
$\tilde{\field{\bar h}}_{kl} = (4G/c^4r)\,e^{i\omega r/c}\,\tilde{\matter T}_{kl}(\omega, \omega\hat n/c)$. The
projector $\Lambda_{ij,kl}(\hat n)$ turns $\field{\bar h}_{kl}$ into the paper's $\field h^{\rm TT}_{ij}$. For the
numbers, $c/2\pi f$ is $4.77 \times 10^7$ m at 1 Hz and $4.77 \times 10^4$ m at 1 kHz, which round to 48,000 km and
48 km.
:::
:::

::: paper
- [Section III](/paper/#sec:regimes): [](/paper/#eq:nearzone) and Figure [](/paper/#fig:regimes), whose edge
  $\lambda/2\pi$ is [the crossing of the two parts](#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1);
  its plain words give the two laws and "about one sixth of a wavelength".
- [Section V](/paper/#sec:waves): [](/paper/#eq:quadrupole) evaluates the source at the retarded time $t - r/c$;
  [*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave) gives [](/paper/#eq:wave-zone), the
  array factor, $N^2$ against $N$, and the power grid.
- [Section IV](/paper/#sec:near-field), in *What heat reveals*, asks the tremor of a body to be "slow enough to be seen
  as near field, $\omega r \ll c$", which is $kr \ll 1$.
- [Section VIII](/paper/#sec:one-pixel), [*The absence of gravitational aberration*](/paper/#par:the-absence-of-gravitational-aberration):
  the field in the near zone matches the present positions to order $(kr)^2$.
- [Section XI](/paper/#sec:vistas): [](/paper/#eq:multipole) is the field of a quadrupole in every zone at once, with
  $u = t - r/c$ and $\hat n$ from the source (chapter 12.1 and reading chapter R12).
- [Section XIV](/paper/#sec:hole): a camera beside a black hole reads its temperature "from the field that does not
  radiate", the near part.
:::

::: deeper
- The [GR course, section 18.5](https://neovand.github.io/general-relativity/chapter-18.html#18-5-retarded-solutions-the-field-receives-yesterday-s-news)
  solves the linearized field equation with the retarded Green's function, and its lesson
  [*Waves and retarded time*](https://neovand.github.io/general-relativity/chapter-18.html#waves-and-retarded-time) walks
  through the delay with pictures.
- The [GR course, appendix A.21](https://neovand.github.io/general-relativity/appendix-a.html#a-21-why-an-isolated-source-has-no-leading-mass-dipole-gravitational-radiation)
  shows why an isolated body has no changing mass dipole, so that its first radiating part is the quadrupole.
- J. D. Jackson, *Classical Electrodynamics* (3rd edition, Wiley, 1999), sections 6.4 to 6.6 and 9.1 to 9.3: the
  retarded Green's function, and the near, intermediate and radiation zones of an oscillating source, for light.
:::

[^s]: The letter $s$ is not the ripple ratio $s$ of chapter 3.7, nor the nugget's distance $s$ of chapter 2.4. A
    subscript $s$ in the section on many sources numbers the sources, as in the paper. The strength $b$ of a point
    source, met below, is not the impact parameter $b$ of chapter 1.8 nor the pixel spacing $b$ of chapter 2.6.

[^moon]: With the 12.4-hour period the delay would be a phase of $1.8 \times 10^{-4}$ radians. That number is an upper
    bound, and it is the one the paper's figure and the map below use to place the Moon's tide. In the 1.28 s the Moon
    moves 1.3 km along its orbit.

[^tide]: The second derivative is
    $\partial_r^2(e^{ikr}/r) = e^{ikr}\bigl(2/r^3 - 2ik/r^2 - k^2/r\bigr)$. At $kr = \sqrt2$ the near and wave terms
    are each $2/r^3$ in size, but the middle term, $2\sqrt2/r^3$, is larger than both: it is the largest of the three
    for $1 < kr < 2$. So $\sqrt2$ is where the outer two terms cross, and between $kr = 1$ and 2 no single term rules.
    Taken as groups, the two terms that fall faster than $1/r$ and the wave term are equal at $kr = 2.2$. These
    distances are sometimes called the **induction region**.

[^quad]: A quadrupole's outgoing field has the radial factor $e^{ikr}\bigl(1 + 3i/kr - 3/(kr)^2\bigr)/kr$ (Jackson,
    section 9.6, with $\ell = 2$). For small $kr$ it is $-3/(kr)^3$ times $1 + \tfrac16(kr)^2 + \dots$, with no term of
    order $kr$ and an imaginary part only at order $(kr)^5$; differentiating gives $1 + \tfrac1{18}(kr)^2$ for the slope.

[^u]: The paper writes $u = t - r/c$ for it in Sections V and XI. This tutorial writes it out, because here $u$ is the
    field.

[^far]: There a telescope of width $D$ had to be farther than $D^2/\lambda$ from a source. Here a field point must be
    farther than $L^2/\lambda$ from a source of radius $L$, which is the same condition for $D = 2L$, up to a factor of
    order one.

[^T]: For matter of density $\matter\rho$ moving at the velocity $\vect v$ it includes $\matter\rho v_iv_j$, the
    momentum per unit volume $\matter\rho v_j$ carried along $v_i$. The sign follows from Newton's third law: the stress
    is the force that the far side exerts on a face, and the momentum that flows across the face is what the near side
    gives up. Chapter [6.5](/tutorial/relativity/stress-energy/) builds the whole table, the stress–energy tensor, of
    which this is the part in space.

[^n]: Elsewhere the paper's $\hat n$ points the other way, from the pixel toward the source (chapter 1.1), and a wave
    then travels along $-\hat n$. In this chapter, as in the paper's Sections V and XI, $\hat n$ points from the source
    toward the field point, along the travel of the wave.

[^lambda]: This $\Lambda$ is the projector of the paper's equations [](/paper/#eq:wave-zone) and
    [](/paper/#eq:beam), not the logarithm $\Lambda = \ln(R_c/R)$ of chapter 3.8 nor the boost of Section VIII. The bar on $\field{\bar h}$ is
    not an average.

[^index]: The index $s$ numbers the sources and is not the source $s(\vect x, t)$; the paper writes its sum this way.
    The letter $N$ is a count here, not the focal ratio or the number radiance of later chapters.
