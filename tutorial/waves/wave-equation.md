---
id: '5.1'
title: 'The wave equation'
question: 'A gravitational wave of one kilohertz is 300 km long, and in water it would travel nearly $10^{21}$ light-years before losing much of its energy. What fixes how long a wave is, how fast it goes, and how far it gets?'
part: '5'
requires: ['1.5b', '2.1', '2.6', '3.1', '3.6', '4.1', '4.3', '4.4']
paper: [sec:near-field, sec:thermal, eq:damped, eq:alpha, sec:no-lens, eq:index, eq:optics-bound, sec:regimes, sec:waves]
figures: []
live: [damped-wave]
depth: A
---

The near field of Part 2 shows mass through walls, but chapter
[2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade) showed that its fine detail fades with the
distance from the scene, so its pictures are never sharp. The paper ends the plain words of its
[Section IV](/paper/#sec:near-field) with "Sharp pictures need waves". Part 5 is about waves.

Picture a gravitational wave of one kilohertz, a pattern of tides travelling at the speed of light, passing the paper's
steel ball, 10 cm in radius. From one crest of the wave to the next is 300 km, so at each instant it stretches the whole
ball alike. Shear sound of the same frequency in the ball's steel is 3 m long. The wave crosses the ball, and any amount
of ordinary matter, losing almost nothing. So we ask what fixes how long a wave is, how fast it goes, and how far it
gets. The answer is one equation, the wave equation, which chapter 4.3 found in a solid. This chapter solves it, finds
which detail a wave can carry away, and adds the two things that a medium can do to a wave: slow it and damp it.

::: plain
When one layer of a solid is pushed sideways, the stiffness of the solid pulls the next layer along, and the inertia
of each layer makes it overshoot. So the push travels at a fixed speed without changing its shape. The same law, the
wave equation, governs gravitational waves, which travel at the speed of light.

A wave that repeats has a wavelength, the distance between its crests, equal to its speed divided by its frequency. At
a thousand vibrations a second a gravitational wave is 300 km long, and a shear wave in steel is 3 m long.

Detail across a surface that is finer than a wavelength cannot travel away from it. It fades instead, as the near
field of Part 2 does, so only waves shorter than the detail can carry a sharp picture. A material can slow a wave a
little, and friction inside it drains the wave's energy. In water the drain is so slow that a gravitational wave
could cross the visible universe billions of times.
:::

## A shear in a solid travels, and its law is the wave equation

Chapter 4.3 found how a disturbance moves through a solid
([A solid carries two kinds of sound](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound)), and we
recall it on one slice. We assume that **the displacements are small**, that **the solid is uniform and the same in
every direction**, that **the solid extends far across the direction of travel**, so that no free surface is near, and
that **there is no friction** until the last section. Let each bit of the solid at the position $x$ move sideways, along
$y$, by the distance $\sym{wave-field}{u}(x, t)$, in metres.[^u] The stress $\matter T_{xy}$ is the sideways force per
square metre that the material beyond $x$ exerts on the material before it, and Hooke's law of chapter
[4.3](/tutorial/response/elastic-bodies/#in-a-uniform-solid-the-stress-answers-each-part-of-the-strain-with-its-own-modulus)
gives $\matter T_{xy} = \matter\mu\,\partial_xu$, with $\matter\mu$ the shear modulus in pascals.

![Look first at the shaded slice: the material on each side pulls it sideways, and only the difference of the two
pulls moves it. The slice lies at the foot of the hump, where the slope still grows, so the pull up on its right face
wins; the dashed line is the lower edge at rest. The displacements and the slice's width are
exaggerated.](tut-wave-slab){#fig:wave-slab}

A slice between $x$ and $x + \dd x$, of area $A$ across the block (Figure [](#fig:wave-slab)), is pulled by
$\matter T_{xy}(x + \dd x)\,A$ on one face and by $-\matter T_{xy}(x)\,A$ on the other, so the net force on it is
$\partial_x\matter T_{xy}\,\dd x\,A$. Its mass is $\matter\rho\,A\,\dd x$, where $\sym{density}{\matter\rho}$ is the
density in kilograms per cubic metre. Newton's law, divided by $A\,\dd x$, reads
$\matter\rho\,\partial_t^2u = \partial_x\matter T_{xy} = \matter\mu\,\partial_x^2u$, so

$$\frac{\partial^2u}{\partial t^2} = c_T^2\,\frac{\partial^2u}{\partial x^2}, \qquad
\sym{shear-speed}{c_T} = \sqrt{\matter\mu/\matter\rho} , \label{eq:wave-1d}$$

where $c_T$ is the speed of shear waves, in metres per second. The tutorial's steel, with
$\matter\rho = 7850\unit{kg\,m^{-3}}$ and $\matter\mu = 7.1 \times 10^{10}\unit{Pa}$, has $c_T = 3000\unit{m\,s^{-1}}$.

**A number.** Gold, the metal of the paper's bar in the locked safe, has $\matter\rho = 19{,}300\unit{kg\,m^{-3}}$ and
$\matter\mu = 2.7 \times 10^{10}\unit{Pa}$, so $c_T = 1200\unit{m\,s^{-1}}$: gold is two and a half times as dense as
steel and less than half as stiff, so shear crosses it at 40% of the speed.

When the displacement varies along all three directions and changes the volume nowhere, chapter 4.3's Navier equation
gives each of its components the same law, with $\partial_x^2$ replaced by the Laplacian
$\nabla^2 = \partial_x^2 + \partial_y^2 + \partial_z^2$ of chapter
[2.1](/tutorial/outside/laplace/#laplaces-equation-says-that-each-value-is-the-average-of-its-neighbours). This is the
**wave equation**:

$$\frac{\partial^2u}{\partial t^2} = c^2\,\nabla^2u . \label{eq:wave}$$

Here $c$ is the speed of the wave at hand: $c_T$ for a shear wave, $343\unit{m\,s^{-1}}$ for sound in air. In empty
space each component of a gravitational wave's strain $\field h_{ij}$, the table of pure numbers that measures how much
it stretches distances, obeys [](#eq:wave) with $c$ the speed of light, $2.998 \times 10^8\unit{m\,s^{-1}}$.[^gw] Only
the section on the refractive index gives $c$ another meaning, and it says so.

**What it means.** The acceleration of each bit is $c^2\nabla^2u$, so a bit that lies below the average of its
neighbours (chapter 2.1) is pulled up, and its inertia carries it past. A field that does not change in time obeys
Laplace's equation $\nabla^2u = 0$: the near field of Part 2 is the wave equation at rest, and a later section makes
this exact.

## Any shape travels without changing

We want every solution of [](#eq:wave-1d), with $c$ in place of $c_T$. We change variables to $\xi = x - ct$ and
$\zeta = x + ct$, both in metres. By the chain rule, $\partial_x = \partial_\xi + \partial_\zeta$, because each new
variable grows by one when $x$ does, and $\partial_t = -c\,\partial_\xi + c\,\partial_\zeta$. Applying each twice gives

$$\partial_t^2 = c^2(\partial_\xi - \partial_\zeta)^2, \qquad \partial_x^2 = (\partial_\xi + \partial_\zeta)^2 .$$

We put these into $\partial_t^2u = c^2\partial_x^2u$ and divide by $c^2$. The squares of $\partial_\xi$ and of
$\partial_\zeta$ cancel, and the cross terms leave $-4\,\partial_\xi\partial_\zeta u = 0$. So $\partial_\zeta u$ does
not depend on $\xi$: it is a function of $\zeta$ alone. Integrating over $\zeta$ gives a function of $\zeta$, plus a
constant of integration that may depend on $\xi$:

$$\boxed{u(x, t) = u_{\rm R}(x - ct) + u_{\rm L}(x + ct),}$$

for any two functions $u_{\rm R}$ and $u_{\rm L}$ of one variable. This is **d'Alembert's solution**. The value of
$u_{\rm R}$ at the place $x$ and the time $t$ is its value at $x - ct$ at the time zero, so $u_{\rm R}$ is a shape that
moves to the right at the speed $c$ without changing, and $u_{\rm L}$ one that moves to the left. A shape that moves
through a medium in this way is a **travelling wave**.

**A number.** A sharp twist at one end of a steel rod 1 m long reaches the other end
$1\unit{m}/3000\unit{m\,s^{-1}} = 0.33$ ms later, with the shape it started with.[^rod]

**A special case.** A line released at rest in the shape $s(x)$ moves as
$u = \tfrac12 s(x - ct) + \tfrac12 s(x + ct)$. At $t = 0$ this is $s(x)$, and its time derivative,
$\tfrac12(-c\,s' + c\,s')$, is zero. So the shape splits into two halves that move apart.

The equation is linear, so two waves add without disturbing each other. Let a hump $u_{\rm R}(x - ct)$ moving right
meet the equal dip $-u_{\rm R}(x + ct)$ moving left. At $t = 0$ the line is flat for an instant, but it is not at rest,
because its velocity is $\dot u = -2c\,u_{\rm R}'(x)$. The half of the line ahead of the hump, where $u_{\rm R}$ falls,
moves up, and the half behind it moves down. A moment later both shapes emerge unchanged (Figure [](#fig:wave-pulses)).

![Look first at the middle line: the sum is flat but moving, up ahead of the hump and down behind it. A hump moving
right (orange, dashed) and an equal dip moving left (blue, dashed) add to the bold line. Time runs down the page in
steps of $w/c$, where $w$ is the pulses' width. The dashed pulses are drawn only where they overlap; elsewhere the
bold line is the one pulse alone. Exact sums of two Gaussian pulses; the arrows' scale is chosen for the
drawing.](tut-wave-pulses){#fig:wave-pulses}

## A plane wave is a turning number that travels

We want the waves of one frequency, because every pattern is a sum of ripples (chapter
[2.6](/tutorial/outside/fourier/#on-an-endless-line-the-sum-becomes-an-integral)) and the wave equation is linear, so
each ripple travels on its own. Chapter 1.5b wrote an oscillation as a
[phasor](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number) $e^{-i\omega t}$, where
$\sym{angular-frequency}{\omega}$ is the **angular frequency** in radians per second, and chapter 2.6 wrote a ripple in
space as $e^{i\vect k\cdot\vect x}$. A **plane wave** is the two together,

$$u = \mathrm{Re}\bigl[\tilde u\,e^{i(\vect k\cdot\vect x - \omega t)}\bigr] ,$$

where $\vect x$ is the position in metres, the wavevector $\sym{wavevector}{\vect k}$, in $\mathrm{m^{-1}}$, has three
components and points across the crests, which are flat planes, and the complex amplitude $\tilde u$ holds the size and
the phase.

Each time derivative brings down $-i\omega$ and each derivative along $x_j$ brings down $ik_j$, so the wave equation
becomes $-\omega^2\tilde u = -c^2k^2\tilde u$, where $\sym{wavenumber}{k} = |\vect k|$ is the wavenumber. A plane wave
therefore solves it if and only if

$$\boxed{\omega = c\,k .} \label{eq:dispersion}$$

A rule that ties a wave's frequency to its wavenumber is its **dispersion relation**. With the paper's signs,
$+i\vect k\cdot\vect x$ and $-i\omega t$, the crests move along $\vect k$ at the speed $\omega/k$ (chapter
[2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time)). This speed
of the crests is the **phase speed**, and [](#eq:dispersion) makes it $c$ at every frequency.

The distance between crests, measured at one instant, is the **wavelength** $\sym{wavelength}{\lambda} = 2\pi/k$, in
metres. The number of crests that pass a fixed point each second is the **frequency** $\sym{frequency}{f} =
\omega/2\pi$, in hertz.[^letters] With [](#eq:dispersion) they give $\lambda = c/f$, the relation of the paper's
[Section III](/paper/#sec:regimes).

**Numbers.** A gravitational wave of 1 kHz is $2.998 \times 10^8/1000 = 300$ km long, and a shear wave in steel of the
same frequency is 3 m long. At one frequency the wavenumbers are in the ratio of the speeds,
$c_T/c = 1.0 \times 10^{-5}$, the paper's "about $10^{-5}$" (chapter 4.3).[^quantum] So across a body much smaller than
300 km, such as the steel ball, a gravitational wave shears every point alike at each instant.

**A non-example.** The pattern $\cos(kx)\cos(\omega t)$ with $\omega = ck$ also solves the wave equation, but its crests
stay in place. It is a **standing wave**, the sum of two equal plane waves moving in opposite directions, as on a
plucked string. A struck drum has standing waves too, but they are circular.[^drum]

## A ripple finer than a wavelength across a plane fades instead of travelling

We want to know which ripples across a plane can travel away from it, the question that chapter 2.7 asked of the
static field. We reuse its picture, but write the height as $z$, as the paper's [](/paper/#eq:evanescent) does,
because $h$ is here a wave's strain. A source lies below a flat plane at the height $z = 0$, and we assume that **the
space above the plane is empty**. A position across the plane is $\vect a = (a_1, a_2)$, in metres. In this section
$\vect k$ has two components only: it is the wavevector of a ripple across the plane, with $k = |\vect k|$. We look for
a field of one frequency with the shape of one ripple across the plane, times an unknown function $F$ of the height:

$$u = \mathrm{Re}\bigl[e^{i\vect k\cdot\vect a}\,F(z)\,e^{-i\omega t}\bigr] .$$

The derivatives along the plane bring down $-k^2$, the time derivatives $-\omega^2$, and the derivative along the
height acts on $F$ alone. So the wave equation reads $-\omega^2F = c^2(F'' - k^2F)$, or

$$F''(z) = \Bigl(k^2 - \frac{\omega^2}{c^2}\Bigr)F(z) .$$

This is the equation of chapter [2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade),
$F'' = k^2F$, with $k^2$ lowered by $\omega^2/c^2$. There are two cases, drawn in Figure [](#fig:wave-evanescent).

**Crests on the plane farther apart than a wavelength**, $k < \omega/c$. The bracket is negative, and the solutions are
$e^{\pm ik_zz}$ with $k_z = \sqrt{\omega^2/c^2 - k^2}$. The solution $e^{+ik_zz}$ is a plane wave with the
three-dimensional wavevector $(\vect k, k_z)$, of length $\omega/c$, leaving at the angle $\theta$ from the vertical
with $\sin\theta = kc/\omega$. The other would come down from far above, where there is no source.

**Crests on the plane closer together than a wavelength**, $k > \omega/c$. The bracket is positive, and the bounded
solution fades with the height, as in chapter 2.7:

$$\boxed{F(z) = F(0)\,e^{-\kappa z}, \qquad \sym{decay-rate}{\kappa} = \sqrt{k^2 - \omega^2/c^2} .}$$

Here $\kappa$ is the rate of fading, in $\mathrm{m^{-1}}$. The field is **evanescent**: it oscillates in time and across
the plane, but it does not travel up.

**The limit.** When $\omega = 0$, $\kappa = k$ and the fade is chapter 2.7's $e^{-kz}$ exactly. The paper's
[](/paper/#eq:scene-transform) writes $K$ for a wavenumber across its camera and $\kappa$ for a rate of fading in depth,
so at zero frequency this is the paper's cone $\kappa = K$ ([](/paper/#eq:cone)). For crests 10 cm apart, $k =
62.8\unit{m^{-1}}$, while a gravitational wave of 1 kHz has $\omega/c = 2.1 \times 10^{-5}\unit{m^{-1}}$; then $\kappa$
differs from $k$ by the fraction $\omega^2/2c^2k^2 = 5.6 \times 10^{-14}$.

**What it means.** Since $\sin\theta$ cannot exceed one, detail across a plane can travel away only if it is at least a
wavelength wide. Finer detail stays behind and fades. The near field of Part 2 is the wave equation for scenes far
smaller than the wavelength, where every ripple fades and $\kappa$ equals $k$. This is why sharp pictures need waves
shorter than the detail. A **wave camera**, one that forms its picture from the waves that reach it, resolves angles
down to about the wavelength divided by the camera's width, the distance across its detectors (chapter
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)).

![Look first at the scale bars: detail coarser than a wavelength leaves as a wave, finer detail fades. Both slabs carry
the same ripple, and the upright pane shows the field above it at one instant: on the left, crests $5/3$ of a
wavelength apart send a plane wave up at the angle $\theta$; on the right, crests half a wavelength apart give a field
that fades as $e^{-\kappa z}$. Exact for the drawn ratios; the slab's relief and the depth of the colours are chosen
for the drawing.](tut-wave-evanescent){#fig:wave-evanescent}

## A wave carries its energy along at its own speed

We want the energy of the shear wave and the rate at which it crosses a slice. We multiply
$\matter\rho\,\ddot u = \matter\mu\,\partial_x^2u$ by $\dot u$. The left side becomes
$\partial_t(\tfrac12\matter\rho\dot u^2)$. On the right, the product rule gives

$$\partial_x(\dot u\,\partial_xu) = (\partial_x\dot u)(\partial_xu) + \dot u\,\partial_x^2u .$$

The order of two derivatives does not matter, so the first term on the right is
$(\partial_t\partial_xu)(\partial_xu) = \partial_t\bigl(\tfrac12(\partial_xu)^2\bigr)$. Therefore
$\dot u\,\partial_x^2u = \partial_x(\dot u\,\partial_xu) - \partial_t\bigl(\tfrac12(\partial_xu)^2\bigr)$, and
collecting the time derivatives on the left gives

$$\begin{gathered}
\frac{\partial\varepsilon}{\partial t} + \frac{\partial S}{\partial x} = 0,\\
\varepsilon = \tfrac12\matter\rho\,\dot u^2 + \tfrac12\matter\mu\,(\partial_xu)^2,\\
S = -\matter\mu\,\dot u\,\partial_xu = -\matter T_{xy}\,\dot u .
\end{gathered}$$

Here $\varepsilon$ is the energy per cubic metre: the kinetic energy of the slices plus the elastic energy of chapter
4.3. The **energy flux** $S$, in watts per square metre, is the energy that crosses each square metre of a slice per
second.[^S] It is minus the stress times the velocity, because the material before $x$ pulls the material beyond it
with the force $-\matter T_{xy}$ per square metre, and a force times the velocity of what it moves is the rate at which
it does work. So the energy in a stretch of the block changes only by what flows through its ends.

**A travelling wave.** For $u = u_{\rm R}(x - ct)$, $\dot u = -c\,u_{\rm R}'$ and $\partial_xu = u_{\rm R}'$. With
$\matter\mu = \matter\rho c^2$ the two halves of $\varepsilon$ are equal, and $S = \matter\rho c^3u_{\rm R}'^2 =
c\,\varepsilon$: the energy moves with the shape, at the speed $c$. For a plane wave of amplitude $|\tilde u|$ the
average of $\sin^2$ over a cycle is a half, so

$$\boxed{\langle S\rangle = \tfrac12\matter\rho\,c\,\omega^2|\tilde u|^2 ,}$$

where the angle brackets mean an average over a cycle, as they meant a mean in chapter
[3.1](/tutorial/noise/probability/#a-reading-is-a-signal-plus-a-random-number).

**A number.** A shear wave in steel at 1 kHz with an amplitude of 1 nm carries $4.6 \times 10^{-4}\unit{W\,m^{-2}}$.
A gravitational wave carries $c^3\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\rangle/16\pi G$, summed over its
two polarizations (stated; chapter 7.8 derives it). One polarization of strain amplitude $10^{-21}$ at 100 Hz, the size
LIGO detects, carries $1.6 \times 10^{-3}\unit{W\,m^{-2}}$, three times as much as the shear wave (twice that with
both polarizations), while it moves free masses a metre apart by only $5 \times 10^{-22}$ m. The large factor $c^3/G$ is
the reason.

## A medium can slow a wave, and its refractive index measures how much

In this section only, $c$ is the speed of light in empty space, and the wave is a gravitational wave or light. In a
medium a wave of angular frequency $\omega$ can have a wavenumber $k$ other than $\omega/c$. The **refractive index**,

$$\sym{refractive-index}{n} = \frac{c\,k}{\omega} ,$$

is a pure number: the speed in empty space over the phase speed $\omega/k$. Across a slab of thickness $L$ the wave's
phase grows by $kL = n\omega L/c$, while across the same distance of empty space it grows by $\omega L/c$. So a wave
that crossed the slab lags one that went round it by the phase

$$\boxed{\Delta\phi = (n - 1)\,\frac{\omega L}{c}}$$

in radians. This lag is how $n$ is measured. Light in water has $n = 1.33$. A gravitational wave in empty
space is a non-example: it has $n = 1$ exactly, by [](#eq:dispersion). When $n$ depends on the frequency, waves of
different frequencies travel at different speeds, and a pulse changes its shape as it goes. Such a medium is
**dispersive**.

Matter slows a gravitational wave by its own gravity. The paper's
[*The optical constants of matter*](/paper/#par:the-optical-constants-of-matter) gives Peters's index for matter of
density $\matter\rho$, which we state without proof (chapter R11 reads it):

{{paper eq:index}}

The units agree, since $G\matter\rho$ is in $\mathrm{s^{-2}}$, like $\omega^2$. For steel at 1 kHz,
$n - 1 = 8.3 \times 10^{-14}$, the paper's $8\times10^{-14}$. The index exceeds one, so matter slows the wave,
and it falls as $1/\omega^2$, so matter is dispersive for gravitational waves.

## A damping term makes a wave fade at a fixed rate per metre

We want the rate at which friction drains a travelling wave. From here on $c$ is again the speed of the wave at hand.
We add to the wave equation a **damping term**, a force against
the motion proportional to the velocity, as chapter 4.1 did for the oscillator:

$$\frac{\partial^2u}{\partial t^2} + \Gamma\,\frac{\partial u}{\partial t} - c^2\nabla^2u = 0 . \label{eq:damped-wave}$$

Here $\sym{damping-rate}{\Gamma}$ is chapter 4.1's damping rate, in $\mathrm{s^{-1}}$. We assume that **the damping is
weak**, $\Gamma \ll \omega$.

A wave $e^{i(kx - \omega t)}$ driven at a real frequency $\omega$ turns [](#eq:damped-wave) into
$-\omega^2 - i\Gamma\omega + c^2k^2 = 0$, so $c^2k^2 = \omega^2 + i\Gamma\omega$, and the wavenumber is complex. With
$\sqrt{1 + \epsilon} \approx 1 + \epsilon/2$ for small $\epsilon$,

$$k = \frac{\omega}{c}\sqrt{1 + \frac{i\Gamma}{\omega}} \approx \frac{\omega}{c} + \frac{i\Gamma}{2c} .$$

So $e^{ikx} = e^{i\omega x/c}\,e^{-\Gamma x/2c}$: the wave keeps its wavelength, and its amplitude falls as
$e^{-\Gamma x/2c}$ (Figure [](#fig:wave-damped)). Its energy, which goes as the square of the amplitude, falls as
$e^{-\Gamma x/c}$. The fraction of the energy lost per metre is the **absorption coefficient**,

$$\boxed{\sym{absorption-coefficient}{\alpha} = \frac{\Gamma}{c} ,} \label{eq:alpha-gamma}$$

in $\mathrm{m^{-1}}$.[^alpha] Its inverse, $1/\alpha$, is the **attenuation length**, over which the energy falls by
the factor $e$.[^exact]

**A check.** A pattern of real wavenumber left to ring has, from the same equation, $\omega = -i\Gamma/2 \pm
\sqrt{c^2k^2 - \Gamma^2/4}$, so its energy falls in time as $e^{-\Gamma t}$, chapter 4.1's ring-down. Moving at $c$, the
energy crosses a distance $x$ in the time $x/c$ and falls by $e^{-\Gamma x/c}$ again. So $\alpha$ depends on the
frequency only if $\Gamma$ does.

**The paper's coefficient.** In the paragraph [*Absorption*](/paper/#par:absorption) of its Section VI, the paper says
that a gravitational wave crossing matter shears it at the rate $\tfrac12\dot{\field h}_{ij}$ (chapter 4.3's [note on
the
half](/tutorial/response/elastic-bodies/#a-deformation-is-a-displacement-field-and-its-strain-is-the-part-that-changes-lengths)
explains the factor). Matter of shear viscosity $\matter\eta$, in pascal seconds (chapter 4.4), resists with a stress
that acts back on the wave. The result, found by Hawking, is [](#eq:damped-wave) for each component of the strain:

{{paper eq:damped}}

Here a dot is a derivative with respect to time and $G$ is Newton's constant, so $\Gamma = 16\pi G\matter\eta/c^2$
(stated here; chapter 7.8 derives it). With [](#eq:alpha-gamma) it gives the paper's coefficient:

{{paper eq:alpha}}

The units agree: $G\matter\eta$ is in $\mathrm{m^2\,s^{-3}}$, and dividing by $c^3$ leaves $\mathrm{m^{-1}}$.

**Numbers.** Water's everyday viscosity, $\matter\eta = 10^{-3}\unit{Pa\,s}$, gives
$\Gamma = 3.7 \times 10^{-29}\unit{s^{-1}}$ and $\alpha = 1.2 \times 10^{-37}\unit{m^{-1}}$. The attenuation length is
$8.5 \times 10^{20}$ light-years: in the paper's words, a wave "would cross nearly $10^{21}$ light-years of water before
losing much of its energy". The visible universe is about $10^{11}$ light-years across, so the wave could cross it some
eight or nine billion times. Chapter 4.4 explains why the friction to use is the one at the wave's own frequency, which
can be far below the friction measured by stirring.

![Look first at the dashed envelope: the crests keep their spacing while the amplitude falls by the same factor in
each wavelength. The wave enters the shaded medium at $x = 0$ with $\Gamma/\omega = 0.05$, so that $c/\Gamma$ is 3.2
wavelengths: there the energy has fallen by $e$ and the amplitude by $\sqrt e$. The damping is drawn far stronger than
in any real medium.](tut-wave-damped){#fig:wave-damped}

::: try {#damped-wave}
A line of damped medium, computed from its wave equation, with a source at the left end and a slab of refractive
index $n$ in the middle third. The sliders set the angular frequency $\omega$, the damping rate $\Gamma$ and the index
$n$. A faint line behind the real one shows the same line without the slab, so that the slab's lag appears as a shift
of the crests. The buttons send a steady train, a single hump, or a hump from the left and an equal dip from the
right. The readouts give the wavelength, the attenuation length $c/\Gamma$, the slab's lag in cycles, and the part of
the amplitude that each face of the slab reflects.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, send
the two pulses again with some damping, and see what they leave behind.
:::

::: check
### Q

How long is a gravitational wave of 100 Hz, and how long is a shear wave of 100 Hz in steel?

### A

The wavelength is the speed over the frequency: $3.0 \times 10^8/100$ m, or 3000 km, for the gravitational wave, and
$3000/100 = 30$ m for the shear wave.

### Q

Why does a ripple across a plane whose crests are closer together than a wavelength not travel away from it?

### A

The wave equation then gives $F'' = (k^2 - \omega^2/c^2)F$ with a positive bracket, so along the height the field can
only grow or fade, without oscillating. With no source above, it must fade.

### Q

A wave in a damped medium loses half of its energy in 1 km. How far does it go before it has lost 99%?

### A

The energy falls by the same factor in each kilometre, so after $x$ km it is $2^{-x}$ of the start. It reaches 1% when
$2^x = 100$, at $x = \ln 100/\ln 2 = 6.6$ km.
:::

**The idea to keep: stiffness and inertia make a shape travel at a fixed speed, and a wave of one frequency has one
wavelength, $2\pi c/\omega$: 300 km for a gravitational wave of a kilohertz, a hundred thousand times a shear sound's in
steel. Detail finer than a wavelength across a plane fades instead of travelling, a medium can delay a wave by its
refractive index, and a damping term makes its energy fall by $e$ every $c/\Gamma$.**

::: problems
### Practice

Find the phase lag of a gravitational wave of 1 kHz that crosses a slab of steel 1 m thick, in radians, using the
paper's [](/paper/#eq:index) with $\matter\rho = 7850\unit{kg\,m^{-3}}$. By what distance does the slab hold the wave
back?

::: solution
With $n - 1 = 8.3 \times 10^{-14}$, $\omega = 6283\unit{s^{-1}}$ and $L = 1$ m,
$\Delta\phi = (n - 1)\,\omega L/c = 8.3 \times 10^{-14} \times 6283/(3.0 \times 10^8) = 1.7 \times 10^{-18}$ rad. The
slab holds the wave back by $(n - 1)L = 8.3 \times 10^{-14}$ m, about a thousandth of an atom, while the wave is 300 km
long.
:::

### Stretch

A Maxwell liquid (chapter 4.4) has the dynamic viscosity $\matter\eta(\omega) = \matter\eta_0/(1 - i\omega\tau)$,
so that its stress is $\matter T_{xy} = 2\matter\eta(\omega)\,\dot u_{xy}$, with the relaxation time $\tau$ and the
rigidity $\matter\mu_\infty = \matter\eta_0/\tau$. Show that a shear wave with $\omega\tau \gg 1$ travels at
$\sqrt{\matter\mu_\infty/\matter\rho}$, and that with $\omega\tau \ll 1$ the shear does not travel but spreads.

::: solution
For $u \propto e^{i(kx - \omega t)}$, $\dot u_{xy} = \tfrac12\partial_x\dot u$, so $\matter T_{xy} = -i\omega\matter
\eta(\omega)\,\partial_xu$, and $\matter\rho\,\ddot u = \partial_x\matter T_{xy}$ becomes $-\matter\rho\,\omega^2 =
i\omega\matter\eta(\omega)\,k^2$, or

$$k^2 = \frac{i\matter\rho\,\omega}{\matter\eta(\omega)} = \frac{\matter\rho\,\omega(\omega\tau + i)}{\matter\eta_0} .$$

For $\omega\tau \gg 1$, $k^2 \approx \matter\rho\,\omega^2/\matter\mu_\infty$: this is [](#eq:dispersion) with
$c = \sqrt{\matter\mu_\infty/\matter\rho}$, a solid's shear wave. For $\omega\tau \ll 1$, $k^2 \approx
i\matter\rho\,\omega/\matter\eta_0$, the dispersion relation of $\matter\rho\,\dot u = \matter\eta_0\,\partial_x^2u$.
That equation has one time derivative, not two: it is a diffusion equation, like the spreading of heat, and a sheared
layer spreads over a width that grows as $\sqrt{\matter\eta_0t/\matter\rho}$ instead of travelling.
:::

### The paper

The paper's [](/paper/#eq:optics-bound) gives the optical depth $\tau$, a pure number, of a uniform body of radius $R$
as $24\,\mathcal C\,(c_T/c)^2\,\bar\lambda/QR$, where $\mathcal C = GM/Rc^2$ is its compactness, $Q$ the quality factor
of its sound and $\bar\lambda = c/\omega$. Here $\tau$ is the paper's letter for the optical depth, not the relaxation
time of the stretch problem. The optical depth is $\alpha$ times the length of the path, here the diameter $2R$. Derive
the formula from the paper's [](/paper/#eq:alpha) with the friction $\matter\eta = \matter\rho c_T^2/\omega Q$ that the
paper uses there.

::: solution
From the paper's [](/paper/#eq:alpha), $\tau = 2R\alpha = 32\pi G\matter\rho\,c_T^2R/\omega Qc^3$. A uniform ball has
$M = \tfrac43\pi R^3\matter\rho$, so $G\matter\rho = 3\mathcal Cc^2/4\pi R^2$. Substituting,

$$\tau = \frac{32\pi R\,c_T^2}{\omega Qc^3}\cdot\frac{3\mathcal Cc^2}{4\pi R^2} = \frac{24\,\mathcal C}{Q}
\Bigl(\frac{c_T}{c}\Bigr)^2\frac{c}{\omega R} ,$$

the paper's expression, since $c/\omega = \bar\lambda$.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field) ends its plain words with "Sharp pictures need waves", and the
  [section on fading ripples](#a-ripple-finer-than-a-wavelength-across-a-plane-fades-instead-of-travelling) shows its
  near field to be the wave equation's slow limit.
- [Section III](/paper/#sec:regimes) divides the near field from the wave zone by the wavelength $\lambda = c/f$
  (chapter [5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1)).
- [Section V](/paper/#sec:waves) gives a rotor's wavelength, $\pi c/\Omega$, and compares it with the source in
  [](/paper/#eq:unresolved).
- [*Absorption*](/paper/#par:absorption): [](/paper/#eq:damped) and [](/paper/#eq:alpha), with the step from the
  damping rate to $\alpha = \Gamma/c$ derived [here](#a-damping-term-makes-a-wave-fade-at-a-fixed-rate-per-metre).
  [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat) compares a wave's wavenumber
  with a sound's.
- [*The optical constants of matter*](/paper/#par:the-optical-constants-of-matter): [](/paper/#eq:index), the 300 km
  wave of a kilohertz, and the phase delay of [](/paper/#eq:optics-bound).
:::

::: deeper
- The [GR course, chapter 18](https://neovand.github.io/general-relativity/chapter-18.html#waves-modes-and-green-functions)
  solves the wave equation with d'Alembert's shapes and complex exponentials; its
  [wave lab](https://neovand.github.io/general-relativity/chapter-18.html#scene-wave) shows a gravitational wave's two
  polarizations travelling.
- The [GR course, section 11.6](https://neovand.github.io/general-relativity/chapter-11.html#11-6-two-field-examples-scalar-waves-and-electromagnetism)
  writes the energy and flux of a wave field in general.
- A. P. French, *Vibrations and Waves* (Norton, 1971), chapters 6 to 8: waves on strings and in solids, their energy,
  and dispersion, worked slowly.
- S. W. Hawking, "Perturbations of an expanding universe" [@Hawking1966]: the damping of gravitational waves by
  viscosity, which chapter 7.8 derives.
:::

[^u]: The letter $u$ is a displacement here, and later in Part 5 any field that obeys the wave equation. It is not the
    scaled radius $u$ of chapters 3.6 and 3.7, nor the paper's retarded time $u = t - r/c$ of its Sections V and XI,
    which chapter 5.2 writes out.

[^gw]: Stated here. Chapter
    [7.4](/tutorial/geometry/linearized-gravity/#in-harmonic-gauge-einsteins-equation-is-a-wave-equation-for-each-component)
    derives the wave equation of linearized gravity, and chapter
    [7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical) shows that a
    wave in empty space has only two independent patterns of stretch, its polarizations $\field h_+$ and $\field
    h_\times$.

[^rod]: A twist turns each cross-section of a round rod about its axis, and the angle of twist obeys
    [](#eq:wave-1d) with the speed $c_T$ for a rod of any thickness. A sideways knock would instead bend the rod, and a
    bending wave changes its shape as it goes, because its speed depends on its wavelength.

[^quantum]: The paper also concludes from this ratio that a solid without friction absorbs a gravitational wave only at
    its surface. The reason involves the quanta of sound, which Part 10 introduces.

[^letters]: Elsewhere $\lambda$ is an eigenvalue (3.4) or a mass per length (2.4), and $k$ a spring's stiffness (4.1).
    Here $f$ is always a frequency, which is why d'Alembert's shapes are written $u_{\rm R}$ and $u_{\rm L}$.

[^drum]: A drum's skin, with a tension $\mathcal T$ in newtons per metre and a mass $\matter\sigma$ per square metre,
    obeys the wave equation in its plane with $c^2 = \mathcal T/\matter\sigma$, by the argument of the first section
    with the skin's slope in place of the strain. Chapter
    [3.6](/tutorial/noise/bessel-and-airy/#the-circular-ripple-obeys-bessels-equation) showed that
    $\nabla^2J_0(ka) = -k^2J_0(ka)$, so $J_0(ka)\cos\omega t$, whose crests are circles about the centre, solves it
    when $\omega = ck$. A rim fixed at $a = R$ needs $J_0(kR) = 0$, so the lowest
    note has $kR = 2.405$ and $\omega = 2.405\,c/R$.

[^S]: The unit of $S$ is pascals times metres per second, which is watts per square metre. The letter is also the
    paper's tidal column and its spectra; here it is only the energy flux.

[^alpha]: The letter $\alpha$ was a phase in chapter 1.5b and is a deflection angle in Part 11; here it is the paper's
    absorption coefficient. The index $n$ is not chapter 3.2's noise $n(t)$.

[^exact]: Without the approximation, the imaginary part of $k = (\omega/c)\sqrt{1 + i\Gamma/\omega}$ is
    $(\Gamma/2c)(1 - \Gamma^2/8\omega^2 + \dots)$: at $\Gamma/\omega = 0.01$ it is below $\Gamma/2c$ by the fraction
    $1.25 \times 10^{-5}$.
