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

The near field of Part 2 shows mass through walls, but its fine detail fades with the distance from the scene
([section 2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade)), so its pictures are never sharp.
Sharp pictures need waves, and Part 5 is about them.

Picture a gravitational wave of one kilohertz, a pattern of tides travelling at the speed of light, passing a steel ball
10 cm in radius. From one crest of the wave to the next is 300 km, so at each instant it stretches the whole ball
alike. Shear sound of the same frequency in the ball's steel is 3 m long. The wave crosses the ball, and any amount of
ordinary matter, losing almost nothing. What fixes how long a wave is, how fast it goes, and how far it gets? The
answer is one equation, the wave equation of section 4.3. We solve it, find which detail a wave can carry away, and add
the two things that a medium can do to a wave: slow it and damp it.

::: plain
When one layer of a solid is pushed sideways, its stiffness pulls the next layer along, and the inertia of each layer
makes it overshoot. So the push travels at a fixed speed without changing its shape. The same law, the wave equation,
governs gravitational waves, which travel at the speed of light. The distance between crests, the wavelength, is the
speed divided by the frequency: 300 km for a gravitational wave of a thousand vibrations a second, 3 m for a shear wave
in steel.

Detail across a surface that is finer than a wavelength cannot travel away from it. It fades, as the near field of
Part 2 does. A material can slow a wave a little, and friction inside it drains the wave's energy; in water the drain
is so slow that a gravitational wave could cross the visible universe billions of times.
:::

## A shear in a solid travels, and its law is the wave equation

Section 4.3 found how a disturbance moves through a solid
([a solid carries two kinds of sound](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound)); we
redo it on one slice. We assume that **the displacements are small**, that **the solid is uniform and the same in
every direction**, that **it extends far across the direction of travel**, so that no free surface is near, and that
**there is no friction** until the last section. Let each bit of the solid at the position $x$ move sideways, along
$y$, by the distance $\sym{wave-field}{u}(x, t)$, in metres.[^u] The stress $\matter T_{xy}$ is the sideways force per
square metre that the material beyond $x$ exerts on the material before it, and Hooke's law of section
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

where $c_T$ is the speed of shear waves, in metres per second. Steel, with
$\matter\rho = 7850\unit{kg\,m^{-3}}$ and $\matter\mu = 7.1 \times 10^{10}\unit{Pa}$, has $c_T = 3000\unit{m\,s^{-1}}$.

When the displacement varies along all three directions and changes the volume nowhere, the Navier equation of section 4.3
gives each of its components the same law, with $\partial_x^2$ replaced by the Laplacian
$\nabla^2 = \partial_x^2 + \partial_y^2 + \partial_z^2$ of section
[2.1](/tutorial/outside/laplace/#laplaces-equation-says-that-each-value-is-the-average-of-its-neighbours). This is the
**wave equation**:

$$\frac{\partial^2u}{\partial t^2} = c^2\,\nabla^2u . \label{eq:wave}$$

Here $c$ is the speed of the wave at hand: $c_T$ for a shear wave, $343\unit{m\,s^{-1}}$ for sound in air. In empty
space each component of a gravitational wave's strain $\field h_{ij}$, the table of pure numbers that measures how much
it stretches distances, obeys [](#eq:wave) with $c$ the speed of light, $2.998 \times 10^8\unit{m\,s^{-1}}$.[^gw] Only
the section on the refractive index gives $c$ another meaning.

**What it means.** The acceleration of each bit is $c^2\nabla^2u$, so a bit that lies below the average of its
neighbours (section 2.1) is pulled up, and its inertia carries it past. A field that does not change in time obeys
Laplace's equation $\nabla^2u = 0$: the near field of Part 2 is the wave equation at rest.

## Any shape travels without changing

To find every solution of [](#eq:wave-1d), with $c$ in place of $c_T$, we change variables to $\xi = x - ct$ and
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
in this way is a **travelling wave**.

**A number.** A sharp twist at one end of a steel rod 1 m long reaches the other end
$1/3000 = 0.33$ ms later, with its shape unchanged.[^rod]

The equation is linear, so two waves add without disturbing each other. A hump $u_{\rm R}(x - ct)$ moving right
meet the equal dip $-u_{\rm R}(x + ct)$ moving left. At $t = 0$ the line is flat for an instant, but it is not at rest,
because its velocity is $\dot u = -2c\,u_{\rm R}'(x)$. The half of the line ahead of the hump, where $u_{\rm R}$ falls,
moves up, and the half behind it moves down. A moment later both shapes emerge unchanged (Figure [](#fig:wave-pulses)).

![Look first at the middle line: the sum is flat but moving, up ahead of the hump and down behind it. A hump moving
right (orange, dashed) and an equal dip moving left (blue, dashed) add to the bold line. Time runs down the page in
steps of $w/c$, where $w$ is the pulses' width. The dashed pulses are drawn only where they overlap; elsewhere the
bold line is the one pulse alone. Exact sums of two Gaussian pulses; the arrows' scale is chosen for the
drawing.](tut-wave-pulses){#fig:wave-pulses}

## A plane wave is a turning number that travels

We take waves of one frequency, because every pattern is a sum of ripples (section
[2.6](/tutorial/outside/fourier/#on-an-endless-line-the-sum-becomes-an-integral)) and the wave equation is linear, so
each ripple travels on its own. Section 1.5b wrote an oscillation as a
[phasor](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number) $e^{-i\omega t}$, where
$\sym{angular-frequency}{\omega}$ is the **angular frequency** in radians per second, and section 2.6 wrote a ripple in
space as $e^{i\vect k\cdot\vect x}$. A **plane wave** is the two together,

$$u = \mathrm{Re}\bigl[\tilde u\,e^{i(\vect k\cdot\vect x - \omega t)}\bigr] ,$$

where $\vect x$ is the position in metres, the wavevector $\sym{wavevector}{\vect k}$, in $\mathrm{m^{-1}}$, has three
components and points across the crests, which are flat planes, and the complex amplitude $\tilde u$ holds the size and
the phase.

Each time derivative brings down $-i\omega$ and each derivative along $x_j$ brings down $ik_j$, so the wave equation
becomes $-\omega^2\tilde u = -c^2k^2\tilde u$, where $\sym{wavenumber}{k} = |\vect k|$ is the wavenumber. A plane wave
therefore solves it if and only if

$$\boxed{\omega = c\,k .} \label{eq:dispersion}$$

A rule that ties a wave's frequency to its wavenumber is its **dispersion relation**. With the signs
$+i\vect k\cdot\vect x$ and $-i\omega t$, the crests move along $\vect k$ at the speed $\omega/k$ (section
[2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time)). This speed
of the crests is the **phase speed**, and [](#eq:dispersion) makes it $c$ at every frequency.

The distance between crests, measured at one instant, is the **wavelength** $\sym{wavelength}{\lambda} = 2\pi/k$, in
metres. The number of crests that pass a fixed point each second is the **frequency** $\sym{frequency}{f} =
\omega/2\pi$, in hertz. With [](#eq:dispersion) they give $\lambda = c/f$.

**Numbers.** A gravitational wave of 1 kHz is $2.998 \times 10^8/1000 = 300$ km long; a shear wave in steel of the same
frequency is 3 m long. At one frequency the wavenumbers are in the ratio of the speeds,
$c_T/c = 1.0 \times 10^{-5}$.[^quantum] So across a body much smaller than
300 km, such as the steel ball, a gravitational wave shears every point alike.

**A non-example.** The pattern $\cos(kx)\cos(\omega t)$ with $\omega = ck$ also solves the wave equation, but its crests
stay in place. It is a **standing wave**, the sum of two equal plane waves moving in opposite directions, as on a
plucked string.

## A ripple finer than a wavelength across a plane fades instead of travelling

Which ripples across a plane can travel away from it? Section 2.7 asked this of the static field, and we reuse its
picture, writing the height as $z$ because $h$ is here a wave's strain. A source lies below a flat plane at the height $z = 0$, and we assume that **the
space above the plane is empty**. A position across the plane is $\vect a = (a_1, a_2)$, in metres. In this section
$\vect k$ has two components only: it is the wavevector of a ripple across the plane, with $k = |\vect k|$. We look for
a field of one frequency with the shape of one ripple across the plane, times an unknown function $F$ of the height:

$$u = \mathrm{Re}\bigl[e^{i\vect k\cdot\vect a}\,F(z)\,e^{-i\omega t}\bigr] .$$

The derivatives along the plane bring down $-k^2$, the time derivatives $-\omega^2$, and the derivative along the
height acts on $F$ alone. So the wave equation reads $-\omega^2F = c^2(F'' - k^2F)$, or

$$F''(z) = \Bigl(k^2 - \frac{\omega^2}{c^2}\Bigr)F(z) .$$

This is the equation of section [2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade),
$F'' = k^2F$, with $k^2$ lowered by $\omega^2/c^2$. There are two cases (Figure [](#fig:wave-evanescent)).

**Crests on the plane farther apart than a wavelength**, $k < \omega/c$. The bracket is negative, and the solutions are
$e^{\pm ik_zz}$ with $k_z = \sqrt{\omega^2/c^2 - k^2}$. The solution $e^{+ik_zz}$ is a plane wave with the
three-dimensional wavevector $(\vect k, k_z)$, of length $\omega/c$, leaving at the angle $\theta$ from the vertical
with $\sin\theta = kc/\omega$. The other would come down from far above, where there is no source.

**Crests on the plane closer together than a wavelength**, $k > \omega/c$. The bracket is positive, and the bounded
solution fades with the height, as in section 2.7:

$$\boxed{F(z) = F(0)\,e^{-\kappa z}, \qquad \sym{decay-rate}{\kappa} = \sqrt{k^2 - \omega^2/c^2} .}$$

Here $\kappa$ is the rate of fading, in $\mathrm{m^{-1}}$. The field is **evanescent**: it oscillates in time and across
the plane, but it does not travel up.

**The limit.** When $\omega = 0$, $\kappa = k$ and the fade is section 2.7's $e^{-kz}$ exactly.[^cone] For crests 10 cm apart,
$k = 62.8\unit{m^{-1}}$, while a gravitational wave of 1 kHz has $\omega/c = 2.1 \times 10^{-5}\unit{m^{-1}}$; then
$\kappa$ differs from $k$ by the fraction $\omega^2/2c^2k^2 = 5.6 \times 10^{-14}$.

**What it means.** Since $\sin\theta$ cannot exceed one, detail across a plane can travel away only if it is at least a
wavelength wide. Finer detail stays behind and fades. The near field of Part 2 is the case of scenes far smaller than
the wavelength, where every ripple fades and $\kappa$ equals $k$. This is why sharp pictures need waves shorter than
the detail. A **wave camera**, one that forms its picture from the waves that reach it, resolves angles
down to about the wavelength divided by the camera's width, the distance across its detectors (section
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)).

![Look first at the scale bars: detail coarser than a wavelength leaves as a wave, finer detail fades. Both slabs carry
the same ripple, and the upright pane shows the field above it at one instant: on the left, crests $5/3$ of a
wavelength apart send a plane wave up at the angle $\theta$; on the right, crests half a wavelength apart give a field
that fades as $e^{-\kappa z}$. Exact for the drawn ratios; the slab's relief and the depth of the colours are chosen
for the drawing.](tut-wave-evanescent){#fig:wave-evanescent}

## A wave carries its energy along at its own speed

We find the energy of the shear wave and the rate at which it crosses a slice by multiplying
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

Here $\varepsilon$ is the energy per cubic metre: the kinetic energy of the slices plus the elastic energy of section
4.3. The **energy flux** $S$, in watts per square metre, is the energy that crosses each square metre of a slice per
second.[^S] It is minus the stress times the velocity, because the material before $x$ pulls the material beyond it
with the force $-\matter T_{xy}$ per square metre, and a force times the velocity of what it moves is the rate at which
it does work. So the energy in a stretch of the block changes only by what flows through its ends.

**A travelling wave.** For $u = u_{\rm R}(x - ct)$, $\dot u = -c\,u_{\rm R}'$ and $\partial_xu = u_{\rm R}'$. With
$\matter\mu = \matter\rho c^2$ the two halves of $\varepsilon$ are equal, and $S = \matter\rho c^3u_{\rm R}'^2 =
c\,\varepsilon$: the energy moves with the shape, at the speed $c$. For a plane wave of amplitude $|\tilde u|$ the
average of $\sin^2$ over a cycle is a half, so

$$\boxed{\langle S\rangle = \tfrac12\matter\rho\,c\,\omega^2|\tilde u|^2 ,}$$

where the angle brackets mean an average over a cycle, as they meant a mean in section
[3.1](/tutorial/noise/probability/#a-reading-is-a-signal-plus-a-random-number).

**A number.** A shear wave in steel at 1 kHz with an amplitude of 1 nm carries $4.6 \times 10^{-4}\unit{W\,m^{-2}}$.
A gravitational wave carries $c^3\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\rangle/16\pi G$, summed over its
two polarizations (section 7.8 derives it). One polarization of strain amplitude $10^{-21}$ at 100 Hz, the size
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

Matter slows a gravitational wave by its own gravity. Peters's index for matter of density $\matter\rho$, derived
from the wave's motion in the matter's own Newtonian field in
[section 7.8](/tutorial/geometry/wave-energy/), is[^peters]

$$n - 1 = \frac{2\pi G\matter\rho}{\omega^{2}} .$$

The units agree, since $G\matter\rho$ is in $\mathrm{s^{-2}}$, like $\omega^2$. For steel at 1 kHz,
$n - 1 = 8.3 \times 10^{-14}$. The index exceeds one, so matter slows the wave, and it falls as $1/\omega^2$: matter is
dispersive for gravitational waves.

## A sharp change of index sends part of a wave back

A mirror is a face at which the index changes, and we want the part of a wave that such a face sends back. We assume
that **the wave meets the face head-on**, at the plane $x = 0$, that **the wavenumber is $k_1$ for $x < 0$ and $k_2$ for
$x > 0$**, constant on each side, and that **the medium changes only the speed of the wave**. In the shear wave of the
first section this is a change of density at the same shear modulus: then $c_T = \sqrt{\matter\mu/\matter\rho}$ changes
from one side to the other, while the law $\matter T_{xy} = \matter\mu\,\partial_xu$ has the same $\matter\mu$ on both
sides. For light or a gravitational wave, $k = n\omega/c$ with the index of each side.

**What the face must keep.** We write the wave of one frequency as $u = \mathrm{Re}[\tilde u(x)\,e^{-i\omega t}]$,
where the complex amplitude $\tilde u(x)$ now depends on the place. The material does not tear, so $\tilde u$ is the
same on both sides of the face. The face is a plane of no thickness and so of no mass, and a force on no mass would give
it an infinite acceleration; so the stress that the material before it exerts must be balanced by the stress of the
material beyond it, and $\matter\mu\,\partial_x\tilde u$ is the same on both sides. With one $\matter\mu$ on both
sides, the slope $\partial_x\tilde u$ is continuous too.

**Matching.** On the near side are the incoming wave, with amplitude 1, and a reflected wave of amplitude $A_{\rm r}$,
moving back; beyond the face is only the transmitted wave, of amplitude $A_{\rm t}$:

$$\tilde u = e^{ik_1x} + A_{\rm r}\,e^{-ik_1x} \quad (x < 0), \qquad \tilde u = A_{\rm t}\,e^{ik_2x} \quad (x > 0) .$$

At $x = 0$ the two values agree, $1 + A_{\rm r} = A_{\rm t}$, and so do the two slopes,
$ik_1(1 - A_{\rm r}) = ik_2A_{\rm t}$. We put the first into the second and divide by $i$:
$k_1 - k_1A_{\rm r} = k_2 + k_2A_{\rm r}$. So

$$\boxed{\;A_{\rm r} = \frac{k_1 - k_2}{k_1 + k_2} = \frac{n_1 - n_2}{n_1 + n_2}, \qquad A_{\rm t} = \frac{2k_1}{k_1 +
k_2} .\;} \label{eq:reflection}$$

Both amplitudes are pure numbers, since each is a ratio of wavenumbers.

**The energy balances.** The flux of a
[plane wave](#a-wave-carries-its-energy-along-at-its-own-speed), $\langle S\rangle = \tfrac12\matter\rho\,c\,\omega^2
|\tilde u|^2$, is $\tfrac12\matter\mu\,\omega k|\tilde u|^2$, because $\matter\rho\,c = \matter\mu k/\omega$. With one
$\matter\mu$ on both sides, the fluxes are in the ratio of $k$ times the square of the amplitude. What enters the face
is the incoming flux less the reflected one,
$k_1(1 - A_{\rm r}^2) = k_1\,\bigl[(k_1 + k_2)^2 - (k_1 - k_2)^2\bigr]/(k_1 + k_2)^2 = 4k_1^2k_2/(k_1 + k_2)^2$, and
what leaves it is $k_2A_{\rm t}^2 = 4k_1^2k_2/(k_1 + k_2)^2$, the same.

**Limits.** With equal media, $k_1 = k_2$, there is no face: $A_{\rm r} = 0$ and $A_{\rm t} = 1$. For a small step,
$n_2 = n_1 + \delta n$, the reflected amplitude is $A_{\rm r} \approx -\delta n/2n_1$, half the fractional change of
the index, and the reflected energy, its square, is of second order in the step. The minus sign means that a wave
entering a slower medium comes back upside down.

**A number.** Light falling straight from air onto water has $A_{\rm r} = (1 - 1.33)/(1 + 1.33) = -0.14$, so a still
pond sends back $0.14^2 = 2.0\%$ of the light's energy. A face reflects in this way only if it is sharp, thinner
than a wavelength; a change of index spread over many wavelengths sends back far less, because the waves returned by
its parts arrive with all phases and cancel.

**What it means.** A face reflects, in amplitude, the difference of the two indices over their sum, about half the
fractional change of the index for a small step, and in energy the square of that. Section 7.8 applies this rule to a
gravitational wave meeting the face of a solid.

## A damping term makes a wave fade at a fixed rate per metre

From here on $c$ is again the speed of the wave at hand. To find the rate at which friction drains a travelling wave, we
add to the wave equation a **damping term**, a force against the motion proportional to the velocity, as section 4.1
did for the oscillator:

$$\frac{\partial^2u}{\partial t^2} + \Gamma\,\frac{\partial u}{\partial t} - c^2\nabla^2u = 0 . \label{eq:damped-wave}$$

Here $\sym{damping-rate}{\Gamma}$ is the damping rate of section 4.1, in $\mathrm{s^{-1}}$. We assume that **the damping is
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
the factor $e$.

**A check.** A pattern of real wavenumber left to ring has, from the same equation, $\omega = -i\Gamma/2 \pm
\sqrt{c^2k^2 - \Gamma^2/4}$, so its energy falls in time as $e^{-\Gamma t}$, the ring-down of section 4.1. Moving at $c$,
the energy crosses $x$ in the time $x/c$ and falls by $e^{-\Gamma x/c}$ again.

**Damping by viscosity.** A gravitational wave crossing matter shears it at the rate $\tfrac12\dot{\field h}_{ij}$ (the
half is explained in section
[4.3](/tutorial/response/elastic-bodies/#a-deformation-is-a-displacement-field-and-its-strain-is-the-part-that-changes-lengths)).
Matter of shear viscosity $\matter\eta$, in pascal seconds (section 4.4), resists with a stress that acts back on the
wave. Hawking found the result [@Hawking1966], [](#eq:damped-wave) for each component of the strain, where a dot
is a derivative with respect to time and $G$ is Newton's constant:

$$\ddot{\field h}_{ij} + \frac{16\pi G\,\matter\eta}{c^{2}}\,\dot{\field h}_{ij} - c^{2}\nabla^{2}\field h_{ij} = 0 .$$

So $\Gamma = 16\pi G\matter\eta/c^2$ (section 7.8 derives it), and [](#eq:alpha-gamma) gives[^hawking]

$$\alpha = \frac{16\pi G\,\matter\eta}{c^{3}} .$$

The units agree: $G\matter\eta$ is in $\mathrm{m^2\,s^{-3}}$, and dividing by $c^3$ leaves $\mathrm{m^{-1}}$.

**Numbers.** Water's everyday viscosity, $\matter\eta = 10^{-3}\unit{Pa\,s}$, gives
$\Gamma = 3.7 \times 10^{-29}\unit{s^{-1}}$ and $\alpha = 1.2 \times 10^{-37}\unit{m^{-1}}$. The attenuation length is
$8.5 \times 10^{20}$ light-years: a wave would cross nearly $10^{21}$ light-years of water before losing much of its
energy. The visible universe is about $10^{11}$ light-years across, so the wave could cross it some eight or nine
billion times. The friction to use is the one at the wave's own frequency, which can be far below the friction
measured by stirring (section 4.4).

![Look first at the dashed envelope: the crests keep their spacing while the amplitude falls by the same factor in
each wavelength. The wave enters the shaded medium at $x = 0$ with $\Gamma/\omega = 0.05$, so that $c/\Gamma$ is 3.2
wavelengths: there the energy has fallen by $e$ and the amplitude by $\sqrt e$. The damping is drawn far stronger than
in any real medium.](tut-wave-damped){#fig:wave-damped}

::: try {#damped-wave}
A line of damped medium, computed from its wave equation, with a source at the left end and a slab of refractive
index $n$ in the middle third. The sliders set $\omega$, $\Gamma$ and $n$; a faint line shows the same line without the
slab, so that the slab's lag appears as a shift of the crests. The buttons send a steady train, a single hump, or a
hump and an equal dip from opposite ends. Answer the predictions at the top of the figure, then do what each asks.
:::

**The idea to keep: stiffness and inertia make a shape travel at a fixed speed, and a wave of one frequency has one
wavelength, $2\pi c/\omega$: 300 km for a gravitational wave of a kilohertz. Detail finer than a wavelength across a
plane fades instead of travelling, a medium can delay a wave by its refractive index, and a damping term makes its
energy fall by $e$ every $c/\Gamma$.**

::: problems
### Practice

**[5.1]** Find the phase lag of a gravitational wave of 1 kHz that crosses a slab of steel 1 m thick, in radians, using
Peters's index with $\matter\rho = 7850\unit{kg\,m^{-3}}$. By what distance does the slab hold the wave
back?

::: solution
With $n - 1 = 8.3 \times 10^{-14}$, $\omega = 6283\unit{s^{-1}}$ and $L = 1$ m,
$\Delta\phi = (n - 1)\,\omega L/c = 8.3 \times 10^{-14} \times 6283/(3.0 \times 10^8) = 1.7 \times 10^{-18}$ rad. The
slab holds the wave back by $(n - 1)L = 8.3 \times 10^{-14}$ m, about a thousandth of an atom, while the wave is 300 km
long.
:::

**[5.1]** How long is a gravitational wave of 100 Hz, and how long is a shear wave of 100 Hz in steel?

::: solution
$\lambda = c/f$: 3000 km, and $3000/100 = 30$ m.
:::

**[5.1]** Why does a ripple across a plane, with crests closer together than a wavelength, not travel away from it?

::: solution
Then $F'' = (k^2 - \omega^2/c^2)F$ has a positive bracket, so along the height the field can only grow or fade. With no
source above, it must fade.
:::

**[5.1]** A wave in a damped medium loses half of its energy in 1 km. How far does it go before it has lost 99%?

::: solution
The energy is $2^{-x}$ of the start after $x$ km. It reaches 1% when $2^x = 100$, at $x = \ln 100/\ln 2 = 6.6$ km.
:::

**[5.1]** What fraction of the energy of light falling straight onto glass, of index 1.5, is sent back, and what
fraction enters?

::: solution
By [](#eq:reflection), $A_{\rm r} = (1 - 1.5)/(1 + 1.5) = -0.2$, so $0.2^2 = 4\%$ is sent back and 96% enters. In the
flux, $k_2A_{\rm t}^2/k_1 = 1.5 \times 0.8^2 = 0.96$, which agrees.
:::

### Stretch

**[5.1]** A Maxwell liquid (section 4.4) has the dynamic viscosity $\matter\eta(\omega) = \matter\eta_0/(1 - i\omega\tau)$,
so that its stress is $\matter T_{xy} = 2\matter\eta(\omega)\,\dot u_{xy}$, with the relaxation time $\tau$ and the
rigidity $\matter\mu_\infty = \matter\eta_0/\tau$. Show that a shear wave with $\omega\tau \gg 1$ travels at
$\sqrt{\matter\mu_\infty/\matter\rho}$, and that with $\omega\tau \ll 1$ the shear does not travel but spreads.

::: solution
For $u \propto e^{i(kx - \omega t)}$, $\dot u_{xy} = \tfrac12\partial_x\dot u$, so $\matter T_{xy} = -i\omega\matter
\eta(\omega)\,\partial_xu$, and $\matter\rho\,\ddot u = \partial_x\matter T_{xy}$ gives
$-\matter\rho\,\omega^2 = i\omega\matter\eta(\omega)\,k^2$, or

$$k^2 = \frac{i\matter\rho\,\omega}{\matter\eta(\omega)} = \frac{\matter\rho\,\omega(\omega\tau + i)}{\matter\eta_0} .$$

For $\omega\tau \gg 1$, $k^2 \approx \matter\rho\,\omega^2/\matter\mu_\infty$: this is [](#eq:dispersion) with
$c = \sqrt{\matter\mu_\infty/\matter\rho}$. For $\omega\tau \ll 1$, $k^2 \approx i\matter\rho\,\omega/\matter\eta_0$, the
dispersion relation of $\matter\rho\,\dot u = \matter\eta_0\,\partial_x^2u$. That equation has one time derivative: it
is a diffusion equation, like the spreading of heat, and a sheared layer spreads over a width that grows as
$\sqrt{\matter\eta_0t/\matter\rho}$ instead of travelling.
:::

**[5.1]** A shear wave crosses head-on from one solid, of density $\matter\rho_1$ and shear modulus $\matter\mu_1$,
into another, of $\matter\rho_2$ and $\matter\mu_2$. Show that the reflected amplitude is
$(Z_1 - Z_2)/(Z_1 + Z_2)$, with the **impedance** $Z = \matter\rho\,c_T = \sqrt{\matter\rho\matter\mu}$ of each side,
and find it for steel ($Z = 2.4 \times 10^7\unit{kg\,m^{-2}\,s^{-1}}$) against aluminium
($\matter\rho = 2700\unit{kg\,m^{-3}}$, $\matter\mu = 2.6 \times 10^{10}\unit{Pa}$).

::: solution
The displacement and the stress $\matter\mu\,\partial_x\tilde u$ are continuous, so the matching reads
$1 + A_{\rm r} = A_{\rm t}$ and $\matter\mu_1k_1(1 - A_{\rm r}) = \matter\mu_2k_2A_{\rm t}$. Since $\matter\mu k =
\omega\matter\rho\,c_T = \omega Z$, the second is $Z_1(1 - A_{\rm r}) = Z_2A_{\rm t}$, and the algebra of
[](#eq:reflection) gives $A_{\rm r} = (Z_1 - Z_2)/(Z_1 + Z_2)$. With one $\matter\mu$ on both sides, $Z$ is
proportional to $k$ and this is [](#eq:reflection) again. Aluminium has $Z = \sqrt{2700 \times 2.6 \times 10^{10}} =
8.4 \times 10^6$ in the same unit, so from steel $A_{\rm r} = (24 - 8.4)/(24 + 8.4) = 0.48$, and 23% of the energy
comes back.
:::

### The camera

**[5.1]** The optical depth $\tau$, a pure number, of a uniform body of radius $R$ and compactness
$\mathcal C = GM/Rc^2$ is the absorption coefficient $\alpha$ times the path, here the diameter $2R$. Show that
$\tau = 24\,\mathcal C\,(c_T/c)^2\,\bar\lambda/QR$, with $\bar\lambda = c/\omega$, when the friction is
$\matter\eta = \matter\rho c_T^2/\omega Q$, where $Q$ is the quality factor of the body's sound. Here $\tau$ is
not the relaxation time of the stretch problem.

::: solution
$\tau = 2R\alpha = 32\pi G\matter\rho\,c_T^2R/\omega Qc^3$. A uniform ball has $M = \tfrac43\pi R^3\matter\rho$, so
$G\matter\rho = 3\mathcal Cc^2/4\pi R^2$. Substituting,

$$\tau = \frac{32\pi R\,c_T^2}{\omega Qc^3}\cdot\frac{3\mathcal Cc^2}{4\pi R^2} = \frac{24\,\mathcal C}{Q}
\Bigl(\frac{c_T}{c}\Bigr)^2\frac{c}{\omega R} .$$
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field) ends its plain words with "Sharp pictures need waves"; the
  [fading ripples](#a-ripple-finer-than-a-wavelength-across-a-plane-fades-instead-of-travelling) show its near field to
  be the wave equation's slow limit.
- [Section III](/paper/#sec:regimes) divides the near field from the wave zone by the wavelength $\lambda = c/f$.
- [Section V](/paper/#sec:waves) gives a rotor's wavelength, $\pi c/\Omega$.
- [*Absorption*](/paper/#par:absorption): [](/paper/#eq:damped) and [](/paper/#eq:alpha).
- [*The optical constants of matter*](/paper/#par:the-optical-constants-of-matter): [](/paper/#eq:index) and the phase
  delay of [](/paper/#eq:optics-bound).
:::

::: deeper
- The [GR course, chapter 18](https://neovand.github.io/general-relativity/chapter-18.html#waves-modes-and-green-functions)
  solves the wave equation with d'Alembert's shapes and complex exponentials, and its
  [wave lab](https://neovand.github.io/general-relativity/chapter-18.html#scene-wave) shows a gravitational wave's two
  polarizations travelling.
- A. P. French, *Vibrations and Waves* (Norton, 1971), chapters 6 to 8: waves on strings and in solids, their energy,
  and dispersion.
:::

[^u]: Later in Part 5, $u$ is any field that obeys the wave equation. It is not the scaled radius $u$ of sections 3.6 and
    3.7, nor the retarded time $u = t - r/c$ of section 5.2.

[^gw]: Section
    [7.4](/tutorial/geometry/linearized-gravity/#in-harmonic-gauge-einsteins-equation-is-a-wave-equation-for-each-component)
    derives this equation, and section
    [7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical) shows that a
    wave in empty space has two independent patterns of stretch, its polarizations $\field h_+$ and $\field h_\times$.

[^rod]: The angle of twist of a round rod obeys [](#eq:wave-1d) with the speed $c_T$ for any thickness. A bending wave
    would change its shape as it goes, because its speed depends on its wavelength.

[^quantum]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. III: a solid without friction absorbs a
    gravitational wave only at its surface. The reason involves the quanta of sound, which Part 10 introduces.

[^S]: The unit of $S$ is pascals times metres per second, which is watts per square metre.

[^alpha]: The letter $\alpha$ was a phase in section 1.5b and is a deflection angle in Part 11. The index $n$ is not
    the noise $n(t)$ of section 3.2.

[^cone]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:cone): at zero frequency the paper's $\kappa = K$, with $K$ a wavenumber across its camera.

[^peters]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VII, as its equation
    [](/paper/#eq:index), which also shows that the matter's own stiffness adds less still.

[^hawking]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, as its equation
    [](/paper/#eq:alpha).
