---
id: '6.3'
title: 'Aberration, Doppler, and seeing where things are now'
question: 'The gravitational Sun is $20.5''''$ ahead of the optical Sun. Why does light show a moving body where it was, while its near field shows where it is now?'
part: '6'
requires: ['1.1', '1.4', '6.1', '6.2']
paper: [sec:one-pixel, fig:present, eq:star-velocity, fig:stars, app:proofs, eq:proof-stars, eq:proof-midpoint, sec:vistas]
figures: [fig:present, fig:stars]
live: [present, moving-sky]
depth: A
---

A mass passes a pixel at 0.6 of the speed of light. Its tide, the difference between its pulls at nearby points
([section 1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)),
stretches the pixel, a ring of free masses, along one line, called the stretch axis. That line points at where the mass
is now. The light of the same mass reaches the pixel from where the mass was when the light set out. Applied to the Sun,
this puts the gravitational Sun $20.5''$ ahead of the optical Sun along its yearly path across the sky.[^first]

{{paper fig:present}}

Why does light show a moving body where it was, while its near field shows where it is now? The near field is the field
close to the body, where its tide follows it at once ([section 0.1](/tutorial/evening/a-camera-for-gravity/#near-a-source-a-pixel-feels-its-pull-and-far-away-its-waves)).
Both answers come from the boost of [section 6.1](/tutorial/relativity/lorentz/). Light's frequency and direction make
one four-vector, so a boost changes both at once, giving the Doppler shift and the tilt of starlight called aberration.
A steady field carries no news, and a boost shows that it depends only on where the body is at the pixel's own "now".

::: plain
When you run through rain, the drops seem to come at you from ahead, even if they fall straight down. Light does the
same. An observer who moves sees every star shifted toward the direction of motion, by about the observer's speed across
the line of sight divided by the speed of light, in radians. For the Earth on its orbit this is 20.5 arcseconds. Motion
also changes the frequency of light: at 0.6 of the speed of light it is doubled ahead and halved behind.

Light takes time to arrive, so it shows a moving body where the body was when the light left it. The steady pull of a
body that moves at a constant speed never changes in the body's own frame, so it holds no news that would need time to
travel. It depends only on where the body is now. That is why the Sun seen through its gravity is 20.5 arcseconds ahead
of the Sun seen in light.
:::

## A ray of light is a null four-vector, and a boost changes its frequency and its direction together

We want the frequency and the direction of a ray of light as a moving observer measures them. A plane wave is
$e^{ik_\mu x^\mu}$ ([section 6.2](/tutorial/relativity/spacetime-vectors/#the-gradient-is-a-lower-index-vector-and-the-wave-operator-is-its-square)),
with the wave four-vector

$$\sym{wave-four-vector}{k^\mu} = \Bigl(\frac{\omega}{c}, \vect k\Bigr) = \frac{\omega}{c}\,\bigl(1, \hat k\bigr) .$$

Here $\sym{angular-frequency}{\omega}$ is the angular frequency, in radians per second, and $\vect k$ the wavevector, in
$\mathrm{m^{-1}}$, which points across the crests. The unit vector $\sym{travel-direction}{\hat k} = \vect k/|\vect k|$
is the **direction of travel** of the wave. For light in empty space $|\vect k| = \omega/c$, which gives the second
form, and so $k\cdot k = -\omega^2/c^2 + |\vect k|^2 = 0$: the wave four-vector of light is null. Its phase $k_\mu
x^\mu$ counts crests and is the same for every observer, so $k^\mu$ is a four-vector
([section 6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time)) and obeys the
boost of section 6.1, with $\omega/c$ in the place of $ct$ and $\vect k$ in the place of $\vect x$.

**Who moves.** Here $c\,\obs{\vect\beta}$ is the velocity of the observer through the frame of the source, and primes
mark the observer's frame. With $\hat\beta = \obs{\vect\beta}/\obs\beta$, we split $\vect k$
into its part along the motion, $\vect k_\parallel = (\hat\beta\cdot\vect k)\,\hat\beta$, and its part across,
$\vect k_\perp = \vect k - \vect k_\parallel$. The [boost in any direction](/tutorial/relativity/lorentz/#a-boost-can-point-in-any-direction)
reads

$$\begin{aligned}
\frac{\omega'}{c} &= \obs\gamma\Bigl(\frac{\omega}{c} - \obs{\vect\beta}\cdot\vect k\Bigr),\\
\vect k'_\parallel &= \obs\gamma\Bigl(\vect k_\parallel - \obs{\vect\beta}\,\frac{\omega}{c}\Bigr),\\
\vect k'_\perp &= \vect k_\perp ,
\end{aligned}$$

with $\obs\gamma = (1 - \obs\beta^2)^{-1/2}$. We put $\vect k = (\omega/c)\,\hat k$ into all three lines. The first
gives the frequency, and the sum of the other two gives the new wavevector:

$$\frac{\omega'}{\omega} = \obs\gamma\,\bigl(1 - \obs{\vect\beta}\cdot\hat k\bigr), \qquad \vect k' =
\frac{\omega}{c}\,\bigl[\hat k_\perp + \obs\gamma\,(\hat k_\parallel - \obs{\vect\beta})\bigr] .$$

Every observer agrees that $k\cdot k = 0$, so $|\vect k'| = \omega'/c$, and the new direction of travel is

$$\hat k' = \frac{c\,\vect k'}{\omega'} = \frac{\omega}{\omega'}\,\bigl[\hat k_\perp + \obs\gamma\,(\hat k_\parallel -
\obs{\vect\beta})\bigr] .$$

With the first result for $\omega'/\omega$,

$$\boxed{\begin{aligned}
\frac{\omega'}{\omega} &= \obs\gamma\,\bigl(1 - \obs{\vect\beta}\cdot\hat k\bigr),\\
\hat k' &= \frac{\hat k_\perp + \obs\gamma\bigl(\hat k_\parallel - \obs{\vect\beta}\bigr)}{\obs\gamma\,\bigl(1 -
\obs{\vect\beta}\cdot\hat k\bigr)}
\end{aligned}} \label{eq:ray-boost}$$

The ratio $\omega'/\omega$ is the **Doppler factor**, and the change from $\hat k$ to $\hat k'$ is the **aberration** of
light. 
**Check: $\hat k'$ has length one.** We write $\cos\theta = \hat\beta\cdot\hat k$, so that $|\hat k_\parallel| =
|\cos\theta|$ and $|\hat k_\perp|^2 = 1 - \cos^2\theta$. The two parts of the numerator are at right angles, so its
squared length is $1 - \cos^2\theta + \obs\gamma^2(\cos\theta - \obs\beta)^2$. The squared denominator minus this is

$$\begin{aligned}
&\obs\gamma^2(1 - \obs\beta\cos\theta)^2 - \obs\gamma^2(\cos\theta - \obs\beta)^2\\
&\quad= \obs\gamma^2\bigl(1 + \obs\beta^2\cos^2\theta - \cos^2\theta - \obs\beta^2\bigr)\\
&\quad= \obs\gamma^2(1 - \obs\beta^2)(1 - \cos^2\theta) = 1 - \cos^2\theta ,
\end{aligned}$$

where the terms $\mp 2\obs\beta\cos\theta$ cancelled. So the numerator and the denominator have the same length.

**Two directions.** The vector $\hat k$ points the way the light goes, and an observer who looks at the source looks
along $\hat n = -\hat k$, the unit vector from the pixel toward the source. We measure angles from the direction of
motion: $\theta$ for $\hat k$, and $\sym{source-angle}{\alpha}$ for $\hat n$, so that $\cos\alpha =
-\cos\theta$.[^alpha] The dot product of $\hat k'$ with $\hat\beta$ in [](#eq:ray-boost) gives $\cos\theta' =
(\cos\theta - \obs\beta)/(1 - \obs\beta\cos\theta)$, and changing both signs gives

$$\cos\alpha' = \frac{\cos\alpha + \obs\beta}{1 + \obs\beta\cos\alpha} . \label{eq:source-angle}$$

The difference $\cos\alpha' - \cos\alpha = \obs\beta\sin^2\alpha/(1 + \obs\beta\cos\alpha)$ is never negative, so
$\alpha' \le \alpha$: **every source moves toward the direction of motion**, except those straight ahead and straight
behind. At $0.6c$ a source at $\alpha = 90°$ is seen at $\cos\alpha' = 0.6$, or $53.1°$, which is $36.9°$ further
forward. Its light has $\obs{\vect\beta}\cdot\hat k = 0$, so its Doppler factor is $\obs\gamma = 1.25$ (Figure
[](#fig:aberrated-ray)).

![Look first at the two arrows: they are the same ray of light, in the source's frame (ink) and for an observer
moving to the right through that frame at $0.6c$ (observer colour). For the observer the ray is longer, because its
frequency is 1.25 times higher, and it comes from further forward, so the source is seen at $53.1°$ from the direction
of motion instead of $90°$. Arrow lengths are proportional to the frequency.](tut-aberration-ray){#fig:aberrated-ray}

## At small speeds the shift is the speed across the line of sight over c

We want the aberration for a slow observer, because the Earth moves round the Sun at $29.78\unit{km\,s^{-1}}$, a
ten-thousandth of the speed of light. The Earth is the observer, moving with $c\,\obs{\vect\beta}$ through the frame of
the Sun and the stars. To first order $\obs\gamma = 1$, the numerator of [](#eq:ray-boost) is
$\hat k - \obs{\vect\beta}$, and $1/(1 - \obs{\vect\beta}\cdot\hat k) \approx 1 + \obs{\vect\beta}\cdot\hat k$.
Multiplying the two and dropping the product of two $\obs\beta$s gives

$$\hat k' \approx \hat k - \obs{\vect\beta} + (\obs{\vect\beta}\cdot\hat k)\,\hat k = \hat k - \obs{\vect\beta}_\perp
,$$

where $\obs{\vect\beta}_\perp$ is the part of $\obs{\vect\beta}$ across the ray. So $\hat n' = -\hat k' = \hat n +
\obs{\vect\beta}_\perp$. A unit vector that gains a small vector at right angles to it turns by that vector's length, in
radians, so the source is seen turned toward the motion by

$$\boxed{\;\delta \approx \frac{\obs v_\perp}{c}\;} \label{eq:small-aberration}$$

where $\obs v_\perp = c\,|\obs{\vect\beta}_\perp|$ is the observer's speed across the line of sight, in metres per
second, and $\sym{aberration-angle}{\delta}$ is the **aberration angle**, in radians. The first term left out is of
order $\obs\beta^2$,[^second-order] and the approximation fails only as $\obs\beta$ approaches 1.

**The Earth.** Its orbit is nearly a circle, so its velocity is nearly at right angles to the line to the Sun, and $\obs
v_\perp$ is its whole speed:

$$\delta = \frac{29.78\unit{km\,s^{-1}}}{2.998\times10^5\unit{km\,s^{-1}}} = 9.93\times10^{-5}\unit{rad} = 20.5'' ,$$

with $1\unit{rad} = 206{,}265''$. An arcsecond is a 3600th of a degree, and $20.5''$ is the width of a 2 cm coin seen
from 200 m. As the Earth's velocity turns each year, each star traces a small closed curve on the sky.

::: history
### Bradley and the tilt of starlight

James Bradley was looking for the yearly shift that the Earth's change of place should give a star, in order to measure
its distance. In 1725 to 1727 he found a shift of about $20''$ in the star γ Draconis, in step with the Earth's velocity
rather than its place. He explained it as the aberration of light and found the same greatest shift for every star. From
it he computed that light takes about eight minutes to come from the Sun (*Philosophical Transactions* 35, 637, 1729).
:::

## Light shows a moving body where it was

We want the direction from which a moving body's light reaches the pixel. We work in the pixel's frame, and **the body
moves through it at a steady velocity $\obs{\vect v} = c\,\obs{\vect\beta}$ along a straight line**, in empty space. It
passes the pixel at the closest distance $b$, in metres, at the pixel's time $t = 0$.

The light that reaches the pixel at $t = 0$ left the body at $t = -\Delta t$, from the place where the body was then,
the **retarded position**. It comes straight from there, so the pixel sees the body at its retarded position. The place
where the body is at the pixel's time $t = 0$ is its **present position**, on the pixel's slice of simultaneity
([section 6.1](/tutorial/relativity/lorentz/#moving-observers-disagree-about-what-happens-at-the-same-time)).[^tret]

In the time $\Delta t$ the body moved $\obs v\Delta t$ along its line, and the light crossed the hypotenuse of a right
triangle whose other sides are $b$ and $\obs v\Delta t$. Pythagoras gives
$c^2\Delta t^2 = b^2 + \obs v^2\Delta t^2$, so

$$\Delta t = \frac{b}{c\sqrt{1 - \obs\beta^2}} = \frac{\obs\gamma b}{c} .$$

The retarded position lies $\obs v\Delta t = \obs\gamma\obs\beta\,b$ behind the present one, so from the pixel the two
are apart by the angle $\delta$ with $\tan\delta = \obs\gamma\obs\beta b/b$. With the rapidity of section 6.1,
$\obs\gamma\obs\beta = \sinh\obs\eta$, so

$$\boxed{\;\tan\delta = \obs\gamma\obs\beta = \sinh\obs\eta\;} \label{eq:retarded-angle}$$

at closest approach. **Number:** for a mass at $0.6c$, $\obs\gamma\obs\beta = 0.75$ and $\delta = 36.9°$. Its light set
out $1.25\,b/c$ ago, when the mass was $0.75\,b$ back along its path (Figure [](#fig:retarded-position)).
**Limit:** for a slow body $\delta \approx \obs\beta$, which is [](#eq:small-aberration) with the body's speed across
the line of sight.[^same-ray]

![Look first at the two dots on the body's path: the filled one is where the body is now, at the pixel's own time,
and the open one is where it was when the light now arriving set out. The body moves through the pixel's frame at
$0.6c$, so the light set out $1.25\,b/c$ ago, the body has since moved $0.75\,b$, and the two directions differ by
$36.9°$.](tut-aberration-retarded){#fig:retarded-position}

**The Sun.** In the Earth's frame the Sun moves, and in the $499\unit{s}$ its light takes to arrive it moves
$14{,}900\unit{km}$, which at $1.496\times10^8\unit{km}$ is the angle $9.93\times10^{-5}\unit{rad}$ again. This is good
to first order in $\obs\beta$, since the Earth's frame accelerates.

## The steady field of a moving body depends on where the body is now

We want to know which position of a moving body its near field shows. Light is news that left the body at a definite
moment. A steady field is not, and this is the whole difference. We assume that **in its own rest frame the body's field
is static**: a reading taken there is a function $f(\vect\Delta')$ of the vector $\vect\Delta'$ from the place of the
reading to the body, and not of the time $t'$, as for a mass or a charge at rest.

As in the last section, the body moves through the pixel's frame with $\obs{\vect v} = c\,\obs{\vect\beta}$, and the
body's frame is primed. The [boost](/tutorial/relativity/lorentz/#a-boost-can-point-in-any-direction) carries the
pixel's reading at the event $(t, \vect x)$ into the body's frame:

$$\begin{aligned}
\vect x'_\parallel &= \obs\gamma\,(\vect x_\parallel - \obs{\vect\beta}\,ct),\\
\vect x'_\perp &= \vect x_\perp,\\
ct' &= \obs\gamma\,(ct - \obs{\vect\beta}\cdot\vect x) .
\end{aligned}$$

The body sits at a fixed place $\vect x'_b$ in its own frame and at $\vect x_b(t)$ in the pixel's, so the same boost
gives $\vect x'_{b\parallel} = \obs\gamma\,(\vect x_{b\parallel}(t) - \obs{\vect\beta}\,ct)$ and $\vect x'_{b\perp} =
\vect x_{b\perp}(t)$. We subtract the pixel's event from the body's place, and the terms in $ct$ cancel:

$$\vect\Delta'_\parallel = \obs\gamma\,\vect r_\parallel, \qquad \vect\Delta'_\perp = \vect r_\perp ,$$

where $\vect r = \vect x_b(t) - \vect x$ is the vector from the pixel to where the body is at the pixel's own time $t$.
The time $t'$ of the reading depends on $\vect x$ too, but the field does not depend on $t'$, so it drops out. The pixel
reads

$$\boxed{\;f\bigl(\obs\gamma\,\vect r_\parallel + \vect r_\perp\bigr)\;} \label{eq:present}$$

at any speed, with $\vect r$ the present position. The length of the argument is the distance in the body's frame,
$\sym{rest-frame-distance}{R_*}^2 = \obs\gamma^2 r_\parallel^2 + r_\perp^2$ (section 6.1). The retarded position appears
nowhere. **Limit:** as $\obs v \to 0$ the reading becomes the field of a body at rest where it is.

A field with components, such as the electric field of light or the tide, depends only on the present position too,
but its direction needs the rule for components. We state two results without proof.

- **Light.** The electric field of a charge moving steadily points straight away from where the charge is now
  ([section 6.6](/tutorial/relativity/maxwell-complex/#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle)).
- **Gravity.** The stretch axis of the tide of a mass moving steadily lies along the line to where the mass is now, and
  the invariants of the full reading, tide and magnetic part together, the combinations of its numbers that every
  observer at the pixel finds the same ([section 0.4](/tutorial/evening/one-pixel/#the-ten-numbers-regroup-into-four-invariants-three-angles-and-a-velocity)),
  are those at rest (section 9.3).

A camera that sees mass therefore sees it on its own slice of simultaneity.

**Where it fails.** The argument needs a field that is static in one frame for all time. When the body changes its
motion, the field near it soon settles into the static field of the new motion. Farther out the field goes on pointing
at where the body would have been, until the news of the change arrives, travelling at the speed of light as a wave (the
field equations of [section 7.4](/tutorial/geometry/linearized-gravity/#the-field-travels-at-the-speed-of-light)).[^near-zone]

::: try {#present}
Predict first: when the moving body stops, will its field everywhere turn at once to point at where it stopped? Press
*Stop it*, and watch the ring of change spread outward at the speed of light. Inside the ring the field points at the
body where it stopped. Outside it the field still points at where the body would now be if it had kept moving. Set the
*Speed* low, and the light and the field point at nearly the same place.
:::

::: history
### Laplace, Carlip and the speed of gravity

P.-S. Laplace, in volume IV (Book X) of his *Traité de mécanique céleste* (1805), let gravity pull toward where a body
was when its gravity set out. The Moon's orbit would then speed up faster than observed, so he concluded that gravity
travels at least seven million times faster than light. S. Carlip (*Physics Letters A* 267, 81, 2000) showed that
general relativity, with gravity at the speed of light, predicts the same absence of aberration: for bodies that
accelerate, the delay cancels because mass is conserved, and its next term because momentum is.
:::

## Light from ahead is bluer and light from behind is redder

We want the frequency that a moving observer measures. As in the first section, the observer moves with
$c\,\obs{\vect\beta}$ through the source's frame. A Doppler factor above 1 is a **blueshift**, since blue light has a
higher frequency than red, and a factor below 1 is a **redshift**, for every kind of wave.

**Head-on.** An observer moving toward the source meets light with $\hat k = -\hat\beta$, so $\obs{\vect\beta}\cdot\hat
k = -\obs\beta$. With $\obs\gamma = \cosh\obs\eta$ and $\obs\gamma\obs\beta = \sinh\obs\eta$
([section 6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not)) and the definitions of the two
functions,

$$\begin{aligned}
\obs\gamma(1 + \obs\beta) &= \cosh\obs\eta + \sinh\obs\eta\\
&= \frac{e^{\obs\eta} + e^{-\obs\eta}}{2} + \frac{e^{\obs\eta} - e^{-\obs\eta}}{2} = e^{\obs\eta} ,
\end{aligned}$$

so that, with $\obs\gamma = 1/\sqrt{(1 - \obs\beta)(1 + \obs\beta)}$ for the middle form,

$$\boxed{\;\frac{\omega'}{\omega} = \obs\gamma(1 + \obs\beta) = \sqrt{\frac{1 + \obs\beta}{1 - \obs\beta}} =
e^{\obs\eta}\;} \label{eq:head-on}$$

**The rapidity is the logarithm of the head-on Doppler factor.** Moving away from the source, the factor is
$e^{-\obs\eta}$. **Numbers.** At $0.6c$ the rapidity is $\ln 2$, so the gravitational wave of $1\unit{kHz}$ of section
6.2, met head-on by a pixel at $0.6c$, is measured at $2\unit{kHz}$, and overtaken from behind at $500\unit{Hz}$. The
ratio of the two factors is $e^{2\obs\eta} = 4$.

**Across the line of travel.** If the ray is at right angles to the motion in the source's frame,
$\obs{\vect\beta}\cdot\hat k = 0$ and $\omega'/\omega = \obs\gamma$, a blueshift of $1.25$ at $0.6c$. For the observer's
angles we change frames. In the observer's frame the source moves with the same speed the other way,
$-c\,\obs{\vect\beta}$, so [](#eq:ray-boost), with the source as the thing that moves and the sign of $\obs{\vect\beta}$
flipped, gives $\omega/\omega' = \obs\gamma(1 + \obs{\vect\beta}\cdot\hat k')$. With $\hat k' = -\hat n'$ and
$\hat\beta\cdot\hat n' = \cos\alpha'$,

$$\frac{\omega'}{\omega} = \frac{1}{\obs\gamma\,(1 - \obs\beta\cos\alpha')} , \label{eq:doppler-seen}$$

with $\alpha'$ the angle at which the observer sees the source. At $\alpha' = 90°$ it is $1/\obs\gamma = 0.8$ at $0.6c$,
a redshift. In the observer's frame the source then moves straight across the line of sight, neither approaching nor
receding, so only its slowed clock counts
([section 6.1](/tutorial/relativity/lorentz/#a-moving-clock-runs-slow-and-a-clocks-own-time-is-the-length-of-its-path)).
Both shifts are the **transverse Doppler shift**, and both are the slowing of a moving clock. At $\alpha' = 0$,
[](#eq:doppler-seen) gives the head-on factor again.

**A source that chases its signal.** The same formula describes a moving source. Let $\hat N = \hat k'$ be the direction in which the light travels from the source to the observer, and let
$c\,\obs{\vect\beta}_{\rm s} = -c\,\obs{\vect\beta}$ be the source's velocity through the observer's frame. Then
$\obs\beta\cos\alpha' = \obs{\vect\beta}_{\rm s}\cdot\hat N$, and

$$\frac{\omega'}{\omega} = \frac{1}{\obs\gamma\,\bigl(1 - \obs{\vect\beta}_{\rm s}\cdot\hat N\bigr)} .$$

A source that moves toward the observer sends each later crest from a little nearer, so what it sends over a time
$\Delta t$ of the observer's clock arrives within $(1 - \obs{\vect\beta}_{\rm s}\cdot\hat N)\,\Delta t$; the
$1/\obs\gamma$ is its slowed clock.

**Limit.** For small speeds $\omega'/\omega \approx 1 + \obs\beta\cos\alpha$, the Doppler shift of sound and of radar,
set by the speed along the line of sight. The transverse shift is of second order, $\obs\gamma - 1 \approx \obs\beta^2/2$.

## A moving observer's sky crowds toward the direction of motion

We want the whole sky that a moving observer sees. The observer moves with $c\,\obs{\vect\beta}$ through the frame of
the sources. On the forward half of the sky, $\cos\alpha \ge 0$, the right side of [](#eq:source-angle) grows with
$\cos\alpha$, so its smallest value is $\obs\beta$, at $\alpha = 90°$. So the forward half of the sky fills a cone about
the direction of motion with the half-angle

$$\boxed{\;\alpha'_{\rm cone} = \arccos\obs\beta, \qquad \sin\alpha'_{\rm cone} = \frac{1}{\obs\gamma}\;}
\label{eq:cone}$$

since $\sin^2 = 1 - \obs\beta^2 = 1/\obs\gamma^2$. **Numbers:** $53.1°$ at $0.6c$, $25.8°$ at $0.9c$ (Figure
[](#fig:moving-sky)) and $8.1°$ at $0.99c$. A cone of half-angle $\alpha'$ covers the fraction $(1 - \cos\alpha')/2$
of the sky, so at $0.6c$ the forward half is squeezed into $0.2$ of the sky, a fifth, and at $0.99c$ into half a per
cent. **Limit:** as $\obs\beta \to 0$ the cone opens to $90°$. For a fast observer, [](#eq:source-angle) gives $1 -
\cos\alpha' = (1 - \obs\beta)(1 - \cos\alpha)/(1 + \obs\beta\cos\alpha)$, and with $1 - \obs\beta \approx
1/(2\obs\gamma^2)$ a source at any $\alpha$ short of $180°$ lands at $\alpha' \approx \tan(\alpha/2)/\obs\gamma$, an
angle that shrinks as $1/\obs\gamma$.

**Directions of travel crowd the other way.** Light from a source ahead travels backward, $\hat k' = -\hat n'$. A pixel
flown through a still room at nearly the speed of light sees the four principal null directions of the room's tide, the
directions on the sky along which its field takes its simplest form ([section 0.4](/tutorial/evening/one-pixel/#four-special-directions-sort-every-reading)),
change as directions of travel do (section 9.4), and crowd toward the direction behind it, within angles that shrink as
$1/\obs\gamma$. Flown along the axis of the tide's middle eigenvalue, the four directions start at right angles to the
motion (section 9.4), so $\cos\theta = 0$ becomes $\cos\theta' = -\obs\beta$: one cone of half-angle
$\arccos\obs\beta$ about the direction behind.[^room]

![Look first at the dashed circle: it holds the forward half of the sky in both panels. At rest it is at $90°$ from
the direction of motion; for an observer moving through the stars' frame at $0.9c$ every star that lay inside it is
seen within $25.8°$ of straight ahead, and blueshifted, while the stars behind spread out over the rest of the sky,
and those seen more than $51.2°$ from straight ahead are redshifted. The projection keeps areas, so the crowding is the
true crowding of the sky.](tut-aberration-sky){#fig:moving-sky}

::: try {#moving-sky}
The whole sky around a camera, drawn so that equal areas of sky get equal areas of the disc, with straight ahead at
the centre and straight behind at the rim. The slider sets the camera's speed through the frame of the sources, from
rest to $0.99c$, with $\obs\beta$, $\obs\gamma$, $\obs\eta$ and the half-angle of the cone that holds the forward
half of the sky beside it. Three skies can be chosen: a field of stars, each coloured by its Doppler factor; a uniform
thermal glow, coloured by the temperature seen in each direction; and the Sun seen from the Earth across its motion,
with the shift magnified a thousandfold.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, choose
the thermal glow and find the direction in which the moving camera sees the temperature it would see at rest.
:::

**A freely falling camera.** Compare, at the distance $r$ from a black hole of mass $\matter M$, a camera that hovers on
a rocket with one that falls straight in from rest far away. We take three inputs without proof. The hovering camera
sees the hole's shadow, the disc of directions from which no light comes, centred on the hole with the angular radius
$\alpha_h$, where $\sin\alpha_h = (3\sqrt3\,G\matter M/rc^2)(1 - 2G\matter M/rc^2)^{1/2}$ (section 11.1). The falling
camera passes it inward at $\obs v = (2G\matter M/r)^{1/2}$ (section 11.1). Where they pass, spacetime is flat over a
small region, so their views differ by a boost ([section 7.1](/tutorial/geometry/metric/#falling-removes-the-fields-first-derivatives-at-a-point-but-not-its-second)).
The falling camera moves through the hovering camera's frame toward the hole, so [](#eq:source-angle) with $\alpha =
\alpha_h$ gives its shadow.

At $r = 40\,G\matter M/c^2$, $\alpha_h = 7.27°$ and $\obs\beta = (2/40)^{1/2} = 0.224$, so $\cos\alpha' = 0.99489$ and
the shadow shrinks to $5.80°$.[^falling] At the photon sphere, $r = 3\,G\matter M/c^2$, where light can circle the hole,
the hovering shadow fills half the sky, and [](#eq:cone) gives $\arccos(2/3)^{1/2} = 35.3°$. Near the horizon, $r =
2\,G\matter M/c^2$, the surface from inside which nothing escapes, $\cos\alpha'$ tends to $23/31$ (the box below):
$42.1°$, or $4/31 = 12.9\%$ of the sky. The Doppler factor [](#eq:doppler-seen) is largest ahead, so the rest of the
sky, crowded toward the edge of the shadow, is bluer there and redder behind.

::: derivation
### The falling camera's shadow at the horizon

We write $s = 1 - 2G\matter M/(rc^2)$, which tends to 0 at the horizon. Then $\sin\alpha_h = (3\sqrt3/2)(1 - s)\sqrt s$,
so $\sin^2\alpha_h \approx 27s/4$. Inside the photon sphere $\alpha_h > 90°$, so $\cos\alpha_h$ is close to $-1$, and
the falling speed is $\obs\beta = (1 - s)^{1/2}$:

$$\begin{aligned}
\cos\alpha_h &= -\sqrt{1 - \sin^2\alpha_h} \approx -1 + \frac{27}{8}\,s,\\
\obs\beta &\approx 1 - \frac{4}{8}\,s .
\end{aligned}$$

To first order in $s$ the numerator and the denominator of [](#eq:source-angle) are

$$\begin{aligned}
\cos\alpha_h + \obs\beta &\approx \frac{27}{8}s - \frac{4}{8}s = \frac{23}{8}\,s ,\\ 1 + \obs\beta\cos\alpha_h &\approx
1 + \Bigl(1 - \frac{4}{8}s\Bigr)\Bigl(-1 + \frac{27}{8}s\Bigr) \approx \frac{31}{8}\,s . \end{aligned}$$

Their ratio does not vanish: $\cos\alpha' \to 23/31 = 0.742$, and $\alpha' \to 42.1°$.
:::

## A moving black body is still a black body, hotter ahead

We want the temperature of a thermal glow seen by a moving observer, such as the microwave background.
**Black-body radiation**, or a black body, is radiation in thermal equilibrium at a temperature $\sym{temperature}{T}$,
in kelvin: the glow inside a closed box whose walls are at $T$. The observer moves with $c\,\obs{\vect\beta}$ through
the frame in which the glow is the same in every direction.

We state the result without proof; section 10.1 derives the glow and proves it. In each direction the moving observer
still sees a black body, with the shape of its spectrum (the share of its energy at each frequency) kept, at a
temperature multiplied by that direction's Doppler factor [](#eq:doppler-seen). Looking at the angle $\alpha'$ from its
motion, it sees

$$\boxed{\;T(\alpha') = \frac{T}{\obs\gamma\,(1 - \obs\beta\cos\alpha')}\;} \label{eq:moving-temperature}$$

**Limit.** At $\obs\beta = 0$ this is $T$ in every direction. To first order it is $T(1 + \obs\beta\cos\alpha')$: hotter
ahead, colder behind, by the fraction $\obs\beta$. A pattern on the sky proportional to $\cos\alpha'$ is a **dipole**,
the pattern of degree one of [section 1.5](/tutorial/newton/five-numbers/#patterns-of-higher-degree-hold-7-9-and-more-numbers).

**Numbers.** We move at $370\unit{km\,s^{-1}}$ relative to the frame in which the microwave background is the same in
every direction, so $\obs\beta = 1.23\times10^{-3}$, and the background's $2.7255\unit{K}$ carries a dipole of
$\pm3.36\unit{mK}$. Satellites measure the $3.36\unit{mK}$, and its ratio to $2.7255\unit{K}$ gives our speed. A graviton background at $0.905\unit{K}$ in the same frame would have the dipole
$\pm1.12\unit{mK}$, the same fraction.[^dipole]

## The four directions of a moving body are its directions at rest, aberrated {#one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated}

We want the four principal null directions of a moving body's tide (defined with the moving sky, above), from which a
pixel reads the body's whole state. For a body at rest they fall in two pairs on the line through the body (section
9.4), and the aberration of [](#eq:ray-boost) does the rest.[^proof]

**Who moves.** We work in the body's rest frame, and the pixel moves through it with $c\,\obs{\vect\beta}$, so the primes
belong to the pixel. In the pixel's frame the sign flips: the body moves with $\obs{\vect v} = -c\,\obs{\vect\beta}$
(Figure [](#fig:two-frames)). In the body's frame $\sym{rest-direction}{\hat n_0}$ is the unit vector from the pixel
toward the body, at the distance $R_*$, and the principal null directions are $\pm\hat n_0$, each counted twice. We write
$a = \obs{\vect\beta}\cdot\hat n_0$ and split $\hat n_0 = (a/\obs\beta)\,\hat\beta + \vect n_\perp$ along and across
$\obs{\vect\beta}$.

![Look first at the two velocity arrows: the pixel moves through the body's frame with $c\,\obs{\vect\beta}$ (above),
so in the pixel's frame the body moves with $-c\,\obs{\vect\beta}$, the same speed the other way (below). The two pairs
of directions, $\pm\hat n_0$ at rest, lean toward the body's velocity, and their half sum is the body's velocity across
the line to where it is now.](tut-aberration-frames){#fig:two-frames}

**The directions.** A principal null direction is a direction of travel, so it enters [](#eq:ray-boost) as $\hat k$. The
pair $\pm\hat n_0$ holds both senses of the line: light from the body travels to the pixel along $-\hat n_0$, and light
toward the body along $+\hat n_0$, so we boost both. For $\hat k = +\hat n_0$ the parts are $\hat k_\parallel =
(a/\obs\beta)\,\hat\beta$ and $\hat k_\perp = \vect n_\perp$, with $\obs{\vect\beta}\cdot\hat k = a$, and for $\hat k =
-\hat n_0$ every part changes sign. Writing the two results together, the pixel's directions are

$$\sym{pnd-pairs}{\hat p_\pm} = \frac{\pm\vect n_\perp + \obs\gamma(\pm a/\obs\beta - \obs\beta)\,\hat\beta}{\obs\gamma(1
\mp a)} ,$$

the upper signs for $\hat p_+$ and the lower for $\hat p_-$. Both are unit vectors, by the check of
[the first section](#a-ray-of-light-is-a-null-four-vector-and-a-boost-changes-its-frequency-and-its-direction-together).

**Where the body is now.** In the body's frame the vector from the pixel to the body is $R_*\hat n_0$. By [the section
on the steady field](#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now), its part along the motion is
$\obs\gamma$ times shorter in the pixel's frame, and its part across is the same, so

$$\vect r = R_*\Bigl(\frac{a}{\obs\gamma\obs\beta}\,\hat\beta + \vect n_\perp\Bigr) ,$$

the present position. The half sum $\tfrac12(\hat p_+ + \hat p_-)$ is the body's velocity across the line to $\vect r$,
over $c$, and the half difference lies along $\vect r$ with the length $(1 - \obs v_\perp^2/c^2)^{1/2}$; the last
problem below checks both for a body seen at right angles to the motion.[^midpoint] Like the steady field, the four
directions point at where the body is now, and lean toward where it is going.

{{paper fig:stars}}

**The idea to keep: one four-vector carries light's frequency and direction, so one boost gives both the Doppler factor
$\obs\gamma(1 - \obs{\vect\beta}\cdot\hat k)$ and the aberration of about $\obs v_\perp/c$. Light comes from where a
body was, but a steady field carried along with the body depends only on where it is now, which is why the gravitational
Sun is $20.5''$ ahead of the Sun we see.**

::: problems
### Practice

**[6.3]** A spacecraft moves at $300\unit{km\,s^{-1}}$. By what angle does it see a star shifted that lies at right
angles to its motion?

::: solution
By $\obs v_\perp/c = 300/(3.00\times10^5) = 1.0\times10^{-3}\unit{rad}$, which is $3.4'$ (arcminutes), about a tenth of
the width of the full Moon.
:::

**[6.3]** A body passes a pixel at $0.6c$, at a closest distance of 1 m. At closest approach, how far behind its present
position is the place its light comes from, and at what angle from the present position does the pixel see it?

::: solution
The light set out $\Delta t = \obs\gamma b/c = 1.25\unit{m}/c = 4.2\unit{ns}$ ago, and in that time the body moved
$\obs\gamma\obs\beta\,b = 0.75\unit{m}$. The angle is $\arctan 0.75 = 36.9°$, whose sine is 0.6, the speed over $c$.
:::

**[6.3]** At what speed is the head-on Doppler factor 3, and what is the rapidity?

::: solution
$\sqrt{(1 + \obs\beta)/(1 - \obs\beta)} = 3$ gives $1 + \obs\beta = 9(1 - \obs\beta)$, so $\obs\beta = 0.8$. The
rapidity is $\ln 3 = 1.10$.
:::

### Stretch

**[6.3]** Two boosts along the same line have rapidities $\obs\eta_1$ and $\obs\eta_2$. Use the head-on Doppler factor
to find the combined speed, and compare with the rule for adding velocities of section 6.1.

::: solution
The two head-on factors multiply to $e^{\obs\eta_1 + \obs\eta_2}$, which by [](#eq:head-on) is one boost of rapidity
$\obs\eta_1 + \obs\eta_2$, whose speed is $\tanh(\obs\eta_1 + \obs\eta_2) = (\obs\beta_1 + \obs\beta_2)/(1 +
\obs\beta_1\obs\beta_2)$. Two boosts of $0.6c$ give $2 \times 2 = 4$, so $\obs\beta = 15/17 = 0.882$.
:::

### The camera

**[6.3]** Derive the directions $\hat p_\pm$ of the last section from [](#eq:ray-boost) with $\hat k = \pm\hat n_0$. For
a body seen at right angles to the pixel's motion, at $0.9c$, check that the half sum of the two directions is the
body's velocity over $c$.

::: solution
The derivation is in [the last
section](#one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated). At right angles,
$a = 0$ and $\vect n_\perp = \hat n_0$, so $\hat p_\pm = (\pm\hat n_0 - \obs\gamma\obs{\vect\beta})/\obs\gamma = \pm\hat
n_0/\obs\gamma - \obs{\vect\beta}$. Their half sum is $-\obs{\vect\beta} = \obs{\vect v}/c$, of length 0.9. Here $\vect
r = R_*\hat n_0$, so the whole velocity is across the line of sight. The half difference is $\hat n_0/\obs\gamma$, along
the line to the body, of length $1/\obs\gamma = 0.436 = (1 - 0.81)^{1/2}$.
:::
:::

::: paper
- [Section VIII](/paper/#sec:one-pixel), [*The absence of gravitational aberration*](/paper/#par:the-absence-of-gravitational-aberration),
  with Figure [](/paper/#fig:present): the aberration of about $v_\perp/c$ and the present position, which put the
  gravitational Sun $20.5''$ ahead.
- [*The state of a moving body*](/paper/#par:the-state-of-a-moving-body), [](/paper/#eq:star-velocity) and
  Figure [](/paper/#fig:stars): the four directions displaced by aberration toward the direction of motion.
- Appendix C, [*The principal null directions of a moving body*](/paper/#par:the-principal-null-directions-of-a-moving-body):
  [](#eq:ray-boost), [](/paper/#eq:proof-stars) and [](/paper/#eq:proof-midpoint).
- Section XI, [*A freely falling camera*](/paper/#par:a-freely-falling-camera): the shadow shrunk by aberration;
  [*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light): the
  angles that shrink as $1/\gamma$ and the cone of half-angle $\arccos\beta$; [*A primordial graviton
  background*](/paper/#par:a-primordial-graviton-background): the dipole of our motion.
:::

::: deeper
- The GR course, [section 3.7](https://neovand.github.io/general-relativity/chapter-3.html#3-7-energy-is-a-measurement-made-by-an-observer),
  and its lesson [*Doppler is an observer measurement*](https://neovand.github.io/general-relativity/chapter-3.html#doppler-is-an-observer-measurement),
  derive the Doppler factor as the energy $E = -p_\mu u^\mu$ that an observer measures.
- S. Carlip, "Aberration and the speed of gravity", *Physics Letters A* 267, 81 (2000): why the cancellation of the
  steady-field section holds for bodies that accelerate, and to what order.
- W. Rindler, *Relativity: Special, General, and Cosmological* (2nd edition, Oxford, 2006), chapter 4: aberration, the
  Doppler effect and the appearance of a moving sky.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, [*The absence of gravitational
    aberration*](/paper/#par:the-absence-of-gravitational-aberration) and Fig. [](/paper/#fig:present).

[^alpha]: The letter $\alpha$ is also the absorption coefficient of section 5.5 and the deflection angle of a ray
    passing a mass.

[^second-order]: To second order, [](#eq:source-angle) gives $\delta = \alpha - \alpha' = \obs\beta\sin\alpha -
    (\obs\beta^2/4)\sin2\alpha$, so the first neglected term is at most $\obs\beta^2/4$ radians: $2.5\times10^{-9}$ rad,
    or $0.0005''$, for the Earth.

[^tret]: The time of departure, $t - \Delta t$, is the retarded time of [section 5.2](/tutorial/waves/retarded-waves/#a-source-sends-its-news-outward-at-the-speed-of-the-wave).

[^same-ray]: The two frames agree. In the body's frame the pixel moves the other way, and at closest approach the
    light reaches it at $\alpha = 90°$, so [](#eq:source-angle) gives $\sin\delta = \obs\beta$, or $\tan\delta =
    \obs\gamma\obs\beta$.

[^near-zone]: For two masses in orbit the field is not static in any frame, and the same question needs [section
    5.2](/tutorial/waves/retarded-waves/#inside-the-near-zone-the-field-is-the-static-field-of-the-source-as-it-is-now):
    inside the near zone the field is Newton's field of the present positions to order $(kr)^2$ (Fig. [](/paper/#fig:present)b of the paper).

[^room]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, [*Through a room at nearly the speed of
    light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light).

[^falling]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, [*A freely falling
    camera*](/paper/#par:a-freely-falling-camera), as $5.8^\circ$ instead of $7.3^\circ$, with Fig. [](/paper/#fig:black-hole).

[^dipole]: First shown in *The gravitational camera* (Mohsenvand 2026), [*A primordial graviton
    background*](/paper/#par:a-primordial-graviton-background).

[^proof]: First shown in *The gravitational camera* (Mohsenvand 2026), Appendix C, [*The principal null directions of
    a moving body*](/paper/#par:the-principal-null-directions-of-a-moving-body), as its equation [](/paper/#eq:proof-stars).

[^midpoint]: The paper gives the half sum and half difference in full, equations [](/paper/#eq:star-velocity) and
    [](/paper/#eq:proof-midpoint); [*The state of a moving body*](/paper/#par:the-state-of-a-moving-body) reads the
    body's whole state from them.
