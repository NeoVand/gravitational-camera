---
id: '4.1'
title: 'The oscillator; phasors; damping, driving, resonance, Q'
question: 'How does anything that can ring answer a push that rises and falls, and which part of its answer takes energy from the push?'
part: '4'
requires: ['1.5b', '1.6', '1.7', '2.3', '2.6']
paper: [sec:near-field, eq:sum-rule, eq:thermometer, sec:thermal, fig:materials, fig:tremor, sec:no-lens, eq:optics-bound, eq:dust, sec:hole]
figures: [fig:materials, fig:tremor]
live: [driven-cart]
depth: A
---

Chapters [0.2](/tutorial/evening/through-walls/#the-outside-of-a-body-does-not-settle-its-inside) and
[0.5](/tutorial/evening/what-the-outside-keeps/#the-reply-can-be-read-by-weighing-the-body-or-by-watching-the-passer)
showed that a camera for gravity can read the inside of a body from the way the body moves. A steel ball that rings
changes its quadrupole moment, the measure of how far its mass is drawn out along one axis ([chapter
2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)),
so a pixel a metre away sees a tide that rises and falls at the ball's frequency, near 15 kHz (Figure
[](#fig:ringing-ball)). Heat keeps every way of ringing going at once, and the way this random trembling is shared
among them shows how the mass inside is arranged. The friction at each frequency sets how strongly a warm body
trembles there, and a tide applied from outside is a push, whose reply this chapter describes.

The paper's paragraph [*What heat reveals*](/paper/#par:what-heat-reveals) says that "a steel ball ten centimetres in
radius rings in its lowest quadrupole mode near 15 kHz".[^ball] In Section VI, the paper's figure of real materials
draws the friction of a silicon crystal as a narrow peak at one frequency, "drawn as damped oscillators of the measured
widths". The ball and the crystal are very different bodies, but the paper treats both as things that ring.

So we ask how anything that can ring answers a push that rises and falls, and which part of its answer takes energy
from the push. The answer is one function of the frequency, the response function, and this chapter builds it for the
simplest thing that rings: 1.7's cart on a spring, with friction added. The rest of Part 4 builds on it: heat
(4.2), the ways a solid body rings (4.3), the friction inside materials (4.4), the rules that cause and effect impose
on a response (4.5), and the link between trembling and response (4.6).[^letters]

![The steel ball of radius 10 cm, on the left, at the two ends of one swing of its lowest quadrupole mode: longer
along its axis (top) and, half a swing later, shorter along it (bottom), with the dashed circle showing the ball at
rest. The change of shape is exaggerated $10^{14}$ times, so that the swing that heat gives each pole at room
temperature, $2.2 \times 10^{-16}\unit{m}$ (a root-mean-square value), appears as 2.2 cm; the ball and the metre are
drawn to one scale, and the swing repeats 15 000 times a second. A metre away on the axis, the ring of free balls of
chapter 1.4 is stretched along the axis while the ball is longer along it and squeezed along it while the ball is
shorter; the ring shows only the part of the ball's tide that rises and falls, and its size and its change of shape
are far larger than a real ring's.](tut-osc-hero){#fig:ringing-ball}

::: plain
An **oscillator** is anything that is pulled back toward a resting place with a force that grows with the distance
from it, such as a weight on a spring. Left alone, it swings at its own natural frequency. Friction makes each swing a
little smaller than the last. The quality factor $Q$ says how slowly the swing dies: its energy falls to about a third
in $Q/2\pi$ swings.

If you push an oscillator back and forth at some frequency, it soon swings at the frequency of your push. How far it
swings, and how late it is compared with your push, depend on how close your frequency is to its own. Near its own
frequency it swings $Q$ times farther than a slow push would move it, and a quarter of a swing behind.

Only the part of the motion that is a quarter of a swing behind the push takes energy from it, and that energy becomes
heat. The rest is stored and given back in every swing. A large body rings in many ways at once, and its answer to a
push is a sum of such oscillators.
:::

## A mass on a spring swings at one frequency

Chapter 1.7 described a cart of mass $\matter m$ on a straight track, held by a spring of stiffness
$\sym{stiffness}{k}$, in newtons per metre. Its coordinate $q$ is its distance, in metres, from the place where the
spring is relaxed. The spring pulls back with the force $-kq$, so Newton's second law reads

$$\matter m\,\ddot q = -k\,q .$$

The chapter found the motion from
[Hamilton's equations](/tutorial/newton/hamilton/#hamiltons-equations-are-newtons-law-split-in-two), which are the same
law split in two:

$$q = A\cos(\omega_0t - \alpha), \qquad \boxed{\;\sym{natural-frequency}{\omega_0} = \sqrt{\frac{k}{\matter m}}\;} .$$

The amplitude $A$, in metres, and the phase $\alpha$, in radians, are fixed by where the cart starts and how fast. The
**natural frequency** $\omega_0$, in radians per second, is fixed by the cart and its spring alone. The units agree,
since $\mathrm{N\,m^{-1}\,kg^{-1}} = \mathrm{s^{-2}}$. For 1.7's cart, $\matter m = 2\unit{kg}$ and $k =
50\unit{N\,m^{-1}}$, so $\omega_0 = 5\unit{s^{-1}}$, and one swing there and back takes $2\pi/\omega_0 = 1.26\unit{s}$.

An **oscillator** is anything with this law: a coordinate that is pulled back toward rest with a force in proportion to
its distance from rest. In the language of
[chapter 1.5b](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number) the motion is
$q = \mathrm{Re}[\tilde q\,e^{-i\omega_0t}]$, with the phasor $\tilde q = Ae^{i\alpha}$.

The energy of the swing is the kinetic energy of 1.6 plus the energy stored in the spring, $E = \tfrac12\matter m\dot
q^2 + \tfrac12kq^2$, in joules. We differentiate it with respect to time and use the law of motion:

$$\frac{\dd E}{\dd t} = \dot q\,(\matter m\ddot q + kq) = 0 .$$

So the energy stays fixed while it passes back and forth between the two terms. At the ends of the swing it is all in
the spring, and at the centre it is all in the motion.

A body made of many parts can swing in many ways, each with its own frequency and its own shape. These ways of swinging
are the body's **normal modes**. The steel ball's lowest quadrupole mode is one of them, the shape change that squashes
the ball along one axis and stretches it across. Chapter 4.3 finds the normal modes of springs and of solid bodies. Here
we need only the fact that each mode, on its own, is an oscillator.

## Friction makes the swing die away, and the quality factor counts how slowly

A real swing dies away, because friction turns its energy into heat. We assume that **the friction is proportional to
the velocity**, $-\matter m\Gamma\dot q$. The factor $\matter m$ is written out so that $\sym{damping-rate}{\Gamma}$,
the **damping rate**, is measured in $\mathrm{s^{-1}}$. Books write the damping in several ways (as $\Gamma$, $\Gamma/2$
or $1/\tau$), so we write the law of motion once in full and derive everything from it:

$$\matter m\,\ddot q + \matter m\Gamma\,\dot q + k\,q = 0 . \label{eq:damped}$$

We want the free motion. The equation is linear and its coefficients are real, so the real part of a complex
solution is also a solution, and we may work with the complex function $\tilde q\,e^{-i\omega t}$, where $\omega$ may
now be complex. Each time derivative multiplies it by $-i\omega$ (1.5b), so the equation becomes, after division by
$\matter m\tilde q\,e^{-i\omega t}$,

$$-\omega^2 - i\Gamma\omega + \omega_0^2 = 0 .$$

This is a quadratic equation for $\omega$. Its two roots are

$$\omega = -\frac{i\Gamma}{2} \pm \sym{damped-frequency}{\omega_d}, \qquad \omega_d = \sqrt{\omega_0^2 - \Gamma^2/4} .$$

We put the root $\omega_d - i\Gamma/2$ into the exponential, where it splits into two factors, $e^{-i\omega t} =
e^{-\Gamma t/2}\,e^{-i\omega_dt}$. The real part, with $\tilde q = Ae^{i\alpha}$, is

$$\boxed{\;q = A\,e^{-\Gamma t/2}\cos(\omega_dt - \alpha)\;} .$$

The other root, $-\omega_d - i\Gamma/2$, gives the same set of real motions: it gives
$A\,e^{-\Gamma t/2}\cos(\omega_dt + \alpha)$, and since $\cos(-x) = \cos x$ this is the boxed form with $-\alpha$ in
place of $\alpha$. The cart swings at the frequency $\omega_d$, a little below
$\omega_0$, while its amplitude shrinks. This dying swing is a **ring-down**. The amplitude falls by a factor $e$ in the
time $2/\Gamma$.

The energy falls twice as fast, by $e$ in the time $1/\Gamma$. To see this from the energy itself, we differentiate
$E$ again and use [](#eq:damped):

$$\frac{\dd E}{\dd t} = \dot q\,(\matter m\ddot q + kq) = -\matter m\Gamma\,\dot q^2 .$$

The friction takes energy at every moment the cart moves. Over one swing the displacement goes as a cosine and the
velocity as a sine, and the square of either averages to $\tfrac12$, so the kinetic energy holds on average half the
total. When the swing changes little in one period, $\langle\matter m\dot q^2\rangle = E$, so $\dd E/\dd t = -\Gamma
E$ and $E \propto e^{-\Gamma t}$, the square of the amplitude's $e^{-\Gamma t/2}$.

We measure how slowly an oscillator rings down by its **quality factor**,

$$\boxed{\;\sym{quality-factor}{Q} = \frac{\omega_0}{\Gamma}\;} . \label{eq:quality}$$

It is a pure number, and it counts the swinging that the energy lasts for: in the time
$1/\Gamma$, while the energy falls by $e$, the phase of the swing advances by $\omega_0/\Gamma = Q$ radians, which is
$Q/2\pi$ swings. It is measured in two ways: by counting the swings of a ring-down, or by measuring the width of a
line, which the section after next defines.

**An example.** Give 1.7's cart a friction with $Q = 10$. Then $\Gamma = 0.5\unit{s^{-1}}$, the energy falls by $e$ in
2 s, which is 1.6 swings, and each swing ends with 73% of the amplitude it started with (Figure
[](#fig:ring-down)). The frequency $\omega_d = 4.994\unit{s^{-1}}$ is only 0.1% below $\omega_0$, because
$\Gamma^2/4$ is small beside $\omega_0^2$.

**A non-example.** A door closer is a spring with so much friction that the door does not swing at all: it creeps back
to shut. When $\Gamma > 2\omega_0$, that is $Q < \tfrac12$, the square root in $\omega_d$ is imaginary, both roots are
purely imaginary, and the motion is a sum of two decaying exponentials with no swing. The boundary, $Q = \tfrac12$, is
**critical damping**; for the cart it is $\Gamma = 10\unit{s^{-1}}$. For such an oscillator the count of swings means
nothing.

**A limit.** As $\Gamma \to 0$, the quality factor grows without limit, $\omega_d \to \omega_0$, the factor
$e^{-\Gamma t/2}$ tends to 1, and the first section's swing returns.

In Part 4 a bare $Q$ always means a quality factor. A moment of the mass, such as the moments $\matter Q_h$,
$\matter Q_{\ell m}$ and $\matter Q_{ij}$ of chapter 2.3, always carries its subscript.[^Q]

![The cart with $Q = 10$, let go from rest 0.1 m from the place where its spring is relaxed: look first at the swing
shrinking inside the dashed envelope $\pm A\,e^{-\Gamma t/2}$, which falls by a factor $e$ every 4 s. The tick at 2 s
marks where the energy has fallen by $e$, and the tick at 4 s where the amplitude has. The curve and the envelope are
both exact; the envelope's amplitude is the boxed form's $A = 0.1001\unit{m}$, a little more than 0.1 m because the
cart starts from rest, so the curve touches the envelope shortly after each turning
point.](tut-osc-ringdown){#fig:ring-down}

## A steady push gets a steady answer, the response function times the push

Now a hand pushes the cart back and forth with a force that rises and falls at an angular frequency $\omega$ of the
hand's choosing, not the cart's:

$$F(t) = \mathrm{Re}\bigl[\tilde F\,e^{-i\omega t}\bigr] .$$

The phasor $\tilde F$, in newtons, holds the size of the push and its timing. The law of motion becomes
$\matter m\ddot q + \matter m\Gamma\dot q + kq = F(t)$. Its solution is the sum of two parts. If two motions both obey
this law, their difference obeys the free law [](#eq:damped), because the push cancels when we subtract one equation
from the other. So every pushed motion is one chosen pushed motion plus a ring-down. The ring-down depends on how the
cart started, and it dies away after a few times $1/\Gamma$. The chosen motion is a swing at the frequency of the push,
which lasts as long as the push does. That swing is the **steady state**, and it is the cart's answer to the push.

We want the steady state. We write it as $q = \mathrm{Re}[\tilde q\,e^{-i\omega t}]$ and put it into the law of motion.
Each time derivative becomes a factor $-i\omega$, so

$$\bigl(-\matter m\omega^2 - i\matter m\Gamma\omega + k\bigr)\,\tilde q = \tilde F .$$

The differential equation has become one line of algebra. Dividing by the bracket gives $\tilde q =
\chi(\omega)\,\tilde F$, with

$$\boxed{\;\sym{response-function}{\chi}(\omega) = \frac{1}{\matter m\,(\omega_0^2 - \omega^2 - i\Gamma\omega)}\;} .
\label{eq:chi}$$

The complex number $\chi(\omega)$ is the oscillator's **response function**, also called its susceptibility. It is
measured in metres per newton.[^units] Its modulus $|\chi|$ is the amplitude of the swing per newton of push. Its
argument, the angle $\varphi$, in radians, in $\chi = |\chi|\,e^{i\varphi}$, tells the timing: since $\tilde q =
\chi\tilde F$, the phase of the swing is the phase of the push plus $\varphi$. In 1.5b's form $A\cos(\omega t -
\alpha)$, a larger phase $\alpha$ puts each peak later, so the cart is behind the push by the angle $\varphi$ (Figure
[](#fig:phasors)).

The imaginary part of $\chi$ is positive at every positive frequency:

$$\begin{aligned}
\mathrm{Im}\,\chi(\omega) &= \frac{\Gamma\omega}{\matter m\,[(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2]}\\
&= \matter m\Gamma\omega\,|\chi(\omega)|^2 .
\end{aligned}$$

The first form comes from multiplying the top and bottom of [](#eq:chi) by the complex conjugate of the bottom, and the
second from $|\chi|^2 = 1/\matter m^2[(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2]$. Since $\mathrm{Im}\,\chi =
|\chi|\sin\varphi > 0$, the angle $\varphi$ lies between $0$ and $\pi$: the cart is always behind the push, never ahead
of it. This sign belongs to the paper's convention, $e^{-i\omega t}$. Books that write $e^{+i\omega t}$ have the
opposite sign for every imaginary part, as 1.5b warned, so a positive $\mathrm{Im}\,\chi$ is a useful check that a
formula uses the paper's convention.

Three limits show what $\chi$ holds, and Figure [](#fig:response) draws it between them for three values of $Q$.

**A slow push.** At $\omega \to 0$, $\chi = 1/\matter m\omega_0^2 = 1/k$. The cart follows the push in step, stretching
the spring as a steady force would. This number is the **static compliance**, the stretch per newton: for the cart,
$0.02\unit{m\,N^{-1}}$.

**A push at the natural frequency.** At $\omega = \omega_0$ the first two terms cancel, and

$$\chi(\omega_0) = \frac{i}{\matter m\Gamma\omega_0} = i\,\frac{Q}{k} .$$

The swing is $Q$ times the static stretch, and the factor $i = e^{i\pi/2}$ puts it a quarter of a swing behind the
push. This large answer near $\omega_0$ is **resonance**. For the cart with $Q = 10$, $|\chi| = 0.2\unit{m\,N^{-1}}$:
a push of 0.1 N swings the cart 2 cm each way. The largest $|\chi|$ lies a little below $\omega_0$, where
$1/|\chi|^2$ is smallest. Setting the derivative of $(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2$ with respect to
$\omega^2$ to zero gives $\omega^2 = \omega_0^2 - \Gamma^2/2$, that is $\omega = \omega_0\sqrt{1 - 1/2Q^2}$. For the
cart this is $4.99\unit{s^{-1}}$, and there $|\chi|$ is larger than $Q/k$ by only 0.1%.

**A fast push.** For $\omega \gg \omega_0$ the term $-\omega^2$ wins, and $\chi \to -1/\matter m\omega^2$. This is the
answer of a free mass with no spring, $\matter m\ddot q = F$, whose phasors give $-\matter m\omega^2\tilde q = \tilde
F$. The minus sign means that the cart moves opposite to the push, half a swing behind. It does not feel its spring,
because the spring's force grows with the displacement, which shrinks as $1/\omega^2$, while the force needed to
accelerate the mass stays equal to the push.[^dust]

![The response of an oscillator with $Q = 3$, 10 and 30, against the frequency of the push in units of $\omega_0$.
Look first at the top panel: the swing per newton, $k|\chi|$, is 1 for a slow push, rises to about $Q$ a little below
$\omega_0$, and approaches the free mass's $(\omega_0/\omega)^2$ above it; the middle panel shows the lag $\varphi$,
which passes $90^\circ$ at $\omega_0$ for every $Q$ and steepens as $Q$ grows. The bottom panel shows
$\omega\,\mathrm{Im}\,\chi$ in units of $1/\matter m\Gamma$, which the next section shows to be the power taken from
the push: it peaks at 1 exactly at $\omega_0$, and the bars under it run between its two half-power points (the
dots), so each is $1/Q$ long.](tut-osc-response){#fig:response}

![The push's phasor $\tilde F$, 1 N, and the swing's phasor $\tilde q = \chi\tilde F$ for the cart with $Q = 10$,
pushed below its natural frequency ($3\unit{s^{-1}}$), at it ($5\unit{s^{-1}}$) and above it ($8\unit{s^{-1}}$);
$\tilde q$ is drawn to the scale of the bar, 0.0311 m, 0.200 m and 0.0128 m long. Both phasors turn clockwise
together, as $e^{-i\omega t}$ does, so the angle $\varphi$ measured anticlockwise from $\tilde F$ to $\tilde q$ is
how far the swing lags behind the push: $5.4^\circ$, $90^\circ$ and $174.1^\circ$. The length that stands for 1 N
is chosen for the drawing.](tut-osc-phasors){#fig:phasors}

## Only the imaginary part of the response takes energy from the push

We want the power that the hand delivers, averaged over a swing, because that is the energy the friction turns into
heat. Chapter [1.6](/tutorial/newton/motion/#work-changes-kinetic-energy-and-a-steady-field-keeps-the-energy-fixed)
showed that a force does work at the rate $F\dot q$, force times velocity. Both are oscillations: $F$ has the phasor
$\tilde F$, and $\dot q$ has the phasor $-i\omega\tilde q$, where $\tilde q$ is the swing's phasor, in metres.

We need the average of a product of two oscillations at the same frequency, with phasors $a$ and $b$. We write each as
half the sum of a turning number and its conjugate, $\mathrm{Re}[a\,e^{-i\omega t}] = \tfrac12(a\,e^{-i\omega t} +
a^*e^{i\omega t})$, and multiply out:

$$\begin{aligned}
\mathrm{Re}[a\,e^{-i\omega t}]\,\mathrm{Re}[b\,e^{-i\omega t}] &= \tfrac14\bigl(ab\,e^{-2i\omega t} +
a^*b^*e^{2i\omega t}\bigr)\\
&\quad + \tfrac14\bigl(a^*b + ab^*\bigr) .
\end{aligned}$$

The first bracket swings at $2\omega$ and averages to zero over a swing. The second is constant and equals
$\tfrac12\mathrm{Re}[a^*b]$. With $a = \tilde F$ and $b = -i\omega\chi\tilde F$, the average power is
$\tfrac12\mathrm{Re}[-i\omega\chi]\,|\tilde F|^2$, and since $\mathrm{Re}[-iz] = \mathrm{Im}\,z$ for any complex number
$z$,

$$\boxed{\;\sym{mean-power}{\bar P} = \tfrac12\,\omega\,\mathrm{Im}\,\chi(\omega)\,|\tilde F|^2\;} . \label{eq:power}$$

The power $\bar P$ is in watts: $\mathrm{s^{-1}} \times \mathrm{m\,N^{-1}} \times \mathrm{N^2} = \mathrm{N\,m\,s^{-1}}$.
Only $\mathrm{Im}\,\chi$ appears. The **dissipative part** of the response, $\mathrm{Im}\,\chi$, describes the part
of the swing that is a quarter of a swing behind the push. The velocity of that part is in step with the push, so the
hand does work on it throughout every swing, and the friction turns that work into heat. The **reactive part**,
$\mathrm{Re}\,\chi$, is in step with the push or opposite to it. Its velocity is a quarter of a swing away from the
force, so the hand does work on it in one quarter of a swing and receives the same work back in the next: the energy is
stored in the spring and the motion and returned. Because $\mathrm{Im}\,\chi > 0$, the average power is never
negative: a passive cart cannot give energy back to the hand on average.

Plotted against $\omega$ for a fixed push, $\bar P$ is a **line**, a peak at one frequency. Its shape is
$\omega\,\mathrm{Im}\,\chi = \Gamma/\matter m[(\omega_0^2 - \omega^2)^2/\omega^2 + \Gamma^2]$, which is largest
exactly at $\omega_0$, where the first term in the bracket vanishes, and there it is $1/\matter m\Gamma$. It falls to
half that height where the first term equals the second:

$$|\omega_0^2 - \omega^2| = \Gamma\omega, \qquad\text{so}\qquad \omega = \sqrt{\omega_0^2 + \Gamma^2/4} \mp
\frac{\Gamma}{2} .$$

These are the two positive roots of $\omega^2 \pm \Gamma\omega - \omega_0^2 = 0$. Their difference, the full width at
half maximum or **linewidth**, is exactly $\Gamma$, at every $Q$. So the quality factor is also the line's frequency
over its width:

$$Q = \frac{\omega_0}{\Gamma} = \frac{\text{centre of the line}}{\text{width of the line}} .$$

For the cart with $Q = 10$, the half-power points are at 4.756 and $5.256\unit{s^{-1}}$, which are $0.5\unit{s^{-1}}$
apart. This is the second way to measure $Q$: a slow ring-down in time is a narrow line in frequency, and the two
measure the same $\Gamma$.

**A number: silicon's line.** A crystal of silicon holds two interleaved sets of atoms, and a shear of the crystal
pushes one set against the other. Their swing against each other is an oscillator at $520\unit{cm^{-1}}$, the
paper's "$15.6\,\mathrm{THz}$".[^cm] Its measured width is about $3\unit{cm^{-1}}$. A ratio of centre to width is the
same in any unit of frequency, so

$$Q = \frac{520}{3} = 173 .$$

The width converts to an angular frequency as the centre does, $\Gamma = 2\pi c \times 3\unit{cm^{-1}} = 5.7 \times
10^{11}\unit{s^{-1}}$, with $c = 3.00\times10^{10}\unit{cm\,s^{-1}}$ the speed of light. So the energy of this swing
falls by $e$ in $1/\Gamma = 1.8\unit{ps}$, which is $Q/2\pi$, about 28 swings.

Panel (a) of the paper's Figure [](/paper/#fig:materials), below, plots the friction that each material shows against
a uniform shear, at each frequency. This friction is the real part, $\mathrm{Re}\,\eta$, of the material's
[viscosity](/tutorial/evening/waves-and-heat/#matter-is-transparent-so-warm-matter-glows-throughout) $\eta$, in pascal
seconds, and the dashed line marks $10^{-3}\unit{Pa\,s}$, about the everyday viscosity of water. A uniform shear drives
silicon's oscillator, and the friction measures the power that the oscillator takes from the shear. So silicon's tall,
narrow peak at 15.6 THz has the shape of this section's line, with the measured width.[^eta] At its top the friction
is $0.03\unit{Pa\,s}$, thirty times the dashed line. Diamond's peak, near 40 THz, is the same kind of line, because
diamond's crystal also holds two interleaved sets of atoms, which swing against each other at $1333\unit{cm^{-1}}$.
The broad curves of copper and iron are a different kind of friction, which chapter 4.4 explains. Panel (b), the
shaded band and the small steps belong to the glow of heat, which chapters 10.2 and 10.3 read.

{{paper fig:materials}}

::: try {#driven-cart}
On the left, 1.7's cart on its track, pushed by a hand with a force of 0.1 N that rises and falls at the frequency you
choose; beneath it, a complex plane where the force's phasor and the swing's phasor turn together, with the lag between
them drawn as an arc. On the right, the swing per newton, $k|\chi|$, on a logarithmic scale, and the line of power,
$\omega\,\mathrm{Im}\,\chi$, with a mark at the hand's frequency. The sliders set the quality factor and the frequency of
the push. *Strike* takes the hand away and lets the cart ring down.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, push
far above resonance and watch which way the cart moves when the hand pushes.
:::

## A body with many modes answers as a sum of oscillators

A real body has many normal modes, and a push reaches several of them at once. We work the simplest case exactly. Two
equal carts, each of mass $\matter m$, stand side by side on the track. Each is held to its own wall by a spring $k$,
and a third spring, of stiffness $k_c$, joins them. Each cart has the same friction, $-\matter m\Gamma\dot q$. The hand
pushes the first cart, and we watch the first cart. With $q_1$ and $q_2$ the two carts' distances from rest, the laws of
motion in phasors are

$$\begin{aligned}
(k + k_c - \matter m\omega^2 - i\matter m\Gamma\omega)\,\tilde q_1 - k_c\,\tilde q_2 &= \tilde F ,\\
-k_c\,\tilde q_1 + (k + k_c - \matter m\omega^2 - i\matter m\Gamma\omega)\,\tilde q_2 &= 0 .
\end{aligned}$$

We add the two equations, and then subtract the second from the first. The coupling cancels in each:

$$\begin{aligned}
\matter m\,(\omega_1^2 - \omega^2 - i\Gamma\omega)\,(\tilde q_1 + \tilde q_2) &= \tilde F ,\\
\matter m\,(\omega_2^2 - \omega^2 - i\Gamma\omega)\,(\tilde q_1 - \tilde q_2) &= \tilde F ,
\end{aligned}$$

with $\omega_1^2 = k/\matter m$ and $\omega_2^2 = (k + 2k_c)/\matter m$. The sum $q_1 + q_2$ is the coordinate of the
mode in which the carts swing together, so the middle spring is never stretched, and that mode rings at $\omega_1$. The
difference $q_1 - q_2$ is the coordinate of the mode in which they swing against each other, which rings at the higher
$\omega_2$. Since $\tilde q_1$ is half the sum of $\tilde q_1 + \tilde q_2$ and $\tilde q_1 - \tilde q_2$, the
response of the first cart to a push on the first cart, $\chi_{11}$, is

$$\begin{aligned}
\chi_{11}(\omega) = \frac{1}{2\matter m}\biggl[&\frac{1}{\omega_1^2 - \omega^2 - i\Gamma\omega}\\
&+ \frac{1}{\omega_2^2 - \omega^2 - i\Gamma\omega}\biggr] .
\end{aligned} \label{eq:two-carts}$$

This is a sum of two oscillators of the form [](#eq:chi), each with the weight $1/2\matter m$ in place of
$1/\matter m$. With 1.7's carts and $k_c = k$, the lines stand at $\omega_1 = 5\unit{s^{-1}}$ and
$\omega_2 = \sqrt3 \times 5 = 8.7\unit{s^{-1}}$. A push at 5 or at $8.7\unit{s^{-1}}$ finds a resonance. Between them,
at $7\unit{s^{-1}}$, the two terms have opposite signs. Without friction they nearly cancel, and the first cart moves
only 6% as far as under a slow push, for which $\chi_{11} = 0.0133\unit{m\,N^{-1}}$. With the friction of $Q = 10$
($\Gamma = 0.5\unit{s^{-1}}$), only the real parts cancel, and $|\chi_{11}| = 0.0029\unit{m\,N^{-1}}$, which is 21% of
the slow push's answer.

The two weights add up to $1/\matter m$. Far above both lines, $\chi_{11} \to -(1/2\matter m)(2/\omega^2) =
-1/\matter m\omega^2$, the answer of the first cart alone as a free mass. A push faster than both springs moves only the
mass it touches.

For any body of masses and springs, the same holds, with one oscillator for each normal mode $n$:

$$\chi(\omega) = \sum_n \frac{c_n^2}{\omega_n^2 - \omega^2 - i\Gamma_n\omega} . \label{eq:modal-sum}$$

Each mode has its own frequency $\omega_n$ and damping rate $\Gamma_n$, and a **weight** $c_n^2$, in
$\mathrm{kg^{-1}}$, that says how strongly the push reaches the mode. When all the masses equal $\matter m$, the weight
is $c_n^2 = e_{n,1}^2/\matter m$, where the list of numbers $\mathbf e_n$ is the shape of mode $n$, scaled to length
one, and $e_{n,1}$ is its entry at the pushed mass. For the two carts, $\mathbf e_1 = (1, 1)/\sqrt2$ and
$\mathbf e_2 = (1, -1)/\sqrt2$, so each weight is $1/2\matter m$.

The weights add to $1/\matter m$ for any such body. A row of $N$ carts has $N$ modes, as many modes as masses, and
their shapes are perpendicular lists of length one. We set the shapes side by side as the columns of a square matrix
$U$. Then $U^{\mathsf T}U$ is the identity matrix, so $U^{\mathsf T}$ is the inverse of $U$. A square matrix and its
inverse commute, so $UU^{\mathsf T}$ is the identity too, and the rows of $U$ also have length one. The first row holds
every mode's entry at the pushed mass, so $\sum_n e_{n,1}^2 = 1$.

::: gap
This chapter states the sum [](#eq:modal-sum) and proves it only for the two carts. The general proof needs the
normal modes of a set of masses and springs, which are the eigenvectors of a symmetric matrix, perpendicular to one
another by [chapter 3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes).
Chapter 4.3 gives it. It also assumes friction that damps each mode on its own, as the equal friction on the two carts
does; a general friction can couple the modes, and then the sum holds only approximately, for weak friction.
:::

The meaning is that a body's response is a set of lines, one for each mode. Heat sets every mode swinging at random.
Chapter [0.5](/tutorial/evening/what-the-outside-keeps/#the-reply-can-be-read-by-weighing-the-body-or-by-watching-the-passer)
called this the body's trembling, and the paper calls it the body's **tremor**. A mode's share is the part of the
tremor that it carries. The paper's figure of the trembling lattice, below, compares two bodies whose fields outside
are identical: a ball of 924 masses joined by springs (blue), and a shell of the same mass and radius, a third of the
radius thick (orange). Each curve adds up the shares of the modes in order of frequency, so each step is one mode. The
vertical axis, $\langle\dot q^2\rangle$, is the mean square rate of change of the body's quadrupole moment: the
figure's $q$ is that moment, not the cart's coordinate.

In the ball, "85% of the quadrupole's tremor lies at one frequency": one line holds most of the weight, which is why the
paper can speak of the steel ball's one quadrupole mode. The shell's curve ends 1.22 times higher. Each total is set by
each piece's mass times the square of its distance from the centre, added up over the body, whatever the springs, and
the shell's mass lies farther out. The shell is also softer, so its steps come at lower frequencies. Chapter 4.6 derives
the curves, and reading chapter R4 checks the 85%.

{{paper fig:tremor}}

## The answer to a single blow comes after the blow

A push that rises and falls steadily is one kind of force. Another is a blow, a large force that acts for an
instant, such as a hammer striking the ball. Its impulse $J = \int F\,\dd t$, in newton seconds, is the momentum it
gives (chapter 1.6).

We want the cart's motion after a blow $J$ at the time $t = 0$, starting from rest. The blow is over before the cart has
moved, so it leaves the cart at $q = 0$ with the velocity $J/\matter m$. After that the cart rings down freely, as in
[the section on friction](#friction-makes-the-swing-die-away-and-the-quality-factor-counts-how-slowly). The ring-down
that starts at $q = 0$ is a sine, and its velocity at $t = 0$ is $J/\matter m$ when its amplitude is $J/\matter
m\omega_d$. So the motion is $q(t) = J\,\chi(t)$, with the **impulse response**

$$\boxed{\begin{gathered}
\chi(t) = \frac{e^{-\Gamma t/2}\sin\omega_dt}{\matter m\,\omega_d}\quad (t > 0),\\
\chi(t) = 0 \quad (t < 0)
\end{gathered}} \label{eq:impulse}$$

Its unit is metres per newton second. For the cart with $Q = 10$, a blow of $1\unit{N\,s}$ throws the cart out to
9.3 cm after 0.30 s, a little less than $J/\matter m\omega_d = 10\unit{cm}$, because the friction already acts during
the first quarter swing.

Any force can be cut into a sequence of small blows. The piece between $t'$ and $t' + \dd t'$ has the impulse
$F(t')\,\dd t'$ and makes the motion $\chi(t - t')\,F(t')\,\dd t'$ afterwards. Because the law of motion is linear, the
motions of separate blows add, and

$$q(t) = \int_{-\infty}^{\infty}\chi(t - t')\,F(t')\,\dd t' .$$

This is a convolution, the kind of blur of chapter
[2.6](/tutorial/outside/fourier/#a-blur-multiplies-each-ripple-by-a-number), in time. We check it against the steady
push. We put $F(t') = \mathrm{Re}[\tilde F\,e^{-i\omega t'}]$ into the integral and write $s = t - t'$ for the time since
each blow. Because $\chi(s)$ is real, the real part can be taken outside the integral:

$$q(t) = \mathrm{Re}\Bigl[\tilde F\,e^{-i\omega t}\int_0^\infty\chi(s)\,e^{i\omega s}\,\dd s\Bigr] .$$

The integral stops at $s = 0$ because $\chi(s)$ vanishes for $s < 0$. So the steady state's $\chi(\omega)$ must be the
integral of $\chi(t)\,e^{i\omega t}$, the Fourier transform in time in the paper's convention
([2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time)). We write
the sine as $(e^{i\omega_dt} - e^{-i\omega_dt})/2i$; each term then gives an integral of a decaying exponential,
$\int_0^\infty e^{-bs}\,\dd s = 1/b$ when the real part of $b$ is positive:

$$\begin{aligned}
\int_0^\infty\chi(s)\,e^{i\omega s}\,\dd s &= \frac{1}{2i\matter m\omega_d}\biggl[\frac{1}{\Gamma/2 - i(\omega + \omega_d)}\\
&\qquad - \frac{1}{\Gamma/2 - i(\omega - \omega_d)}\biggr]\\
&= \frac{1}{2i\matter m\omega_d}\,\frac{2i\omega_d}{(\Gamma/2 - i\omega)^2 + \omega_d^2}\\
&= \frac{1}{\matter m\,(\omega_0^2 - \omega^2 - i\Gamma\omega)} .
\end{aligned}$$

The second line puts the two fractions over their common denominator, a product of the form $(x - iy)(x + iy) =
x^2 + y^2$ with $x = \Gamma/2 - i\omega$ and $y = \omega_d$. The third expands $(\Gamma/2 - i\omega)^2 = \Gamma^2/4 -
i\Gamma\omega - \omega^2$ and uses $\omega_d^2 + \Gamma^2/4 = \omega_0^2$. The result is [](#eq:chi). The response to a
blow and the response to a steady push are one function, seen in time and in frequency.

The impulse response is zero before the blow. Nothing moves before it is pushed: the response is **causal**. Chapter
[4.5](/tutorial/response/causality/#causality-ties-the-stiffness-of-a-response-to-its-friction) shows that it ties the
real part of $\chi(\omega)$ to the imaginary part, and that with the free-mass limit it fixes the total area under [the
line of power](#only-the-imaginary-part-of-the-response-takes-energy-from-the-push), whatever the friction.

::: check
### Q

A bell rings at 440 Hz, and the energy of its sound falls by a factor $e$ in 2 s. What is its quality factor?

### A

The damping rate is $\Gamma = 1/(2\unit{s}) = 0.5\unit{s^{-1}}$, and $\omega_0 = 2\pi \times 440\unit{Hz} =
2760\unit{s^{-1}}$, so $Q = \omega_0/\Gamma = 5500$. The bell rings for $Q/2\pi = 880$ swings while its energy falls by
$e$.

### Q

Why does the reactive part, $\mathrm{Re}\,\chi$, take no energy on average?

### A

That part of the swing is in step with the push or opposite to it, so its velocity is a quarter of a swing out of step
with the force. The work done on it in one quarter of a swing is returned in the next.

### Q

How far behind the push is the cart at resonance, and why?

### A

A quarter of a swing. At $\omega_0$ the spring's force and the force needed to accelerate the mass cancel, so the push
only balances the friction. The friction goes with the velocity, which is a quarter of a swing ahead of the
displacement, so the displacement is a quarter of a swing behind the push.

:::

**The idea to keep: anything that can ring answers a rising and falling push through one function, $\chi(\omega)$. Its
real part stores energy and gives it back, its imaginary part turns work into heat, and its sharpness is $Q$, the
frequency of the line over its width. A body is a sum of such lines.**

::: problems
### Practice

Give 1.7's cart ($\matter m = 2\unit{kg}$, $k = 50\unit{N\,m^{-1}}$) a quality factor of 50. Find $\Gamma$, the number
of swings in which its energy falls by $e$, and its swing per newton when it is pushed at $\omega_0$.

::: solution
The damping rate is $\Gamma = \omega_0/Q = 5/50 = 0.1\unit{s^{-1}}$. The energy falls by $e$ in $1/\Gamma = 10\unit{s}$,
which is $Q/2\pi = 8.0$ swings of 1.26 s. At resonance $|\chi| = Q/k = 50/50 = 1.0\unit{m\,N^{-1}}$, fifty times the
static compliance of $0.02\unit{m\,N^{-1}}$.
:::

### Stretch

Combine this chapter with 1.7's energy $H = p^2/2\matter m + \tfrac12kq^2$. Show that at resonance the energy lost in
one swing, $2\pi\bar P/\omega_0$, is $2\pi/Q$ times the energy stored in the swing.

::: solution
At $\omega = \omega_0$ the swing is $q = |\tilde q|\cos(\omega_0t - \alpha)$, and since $\matter m\omega_0^2 = k$ the
stored energy is constant, $E = \tfrac12k|\tilde q|^2$ (the friction's loss is made up by the push). With
$\tilde q = \chi\tilde F$ and $|\chi(\omega_0)| = Q/k$, $E = Q^2|\tilde F|^2/2k$. By [](#eq:power) with
$\mathrm{Im}\,\chi(\omega_0) = Q/k$, $\bar P = \omega_0Q|\tilde F|^2/2k$, so one swing loses
$2\pi\bar P/\omega_0 = \pi Q|\tilde F|^2/k$. The ratio of loss to store is $\pi Q/(Q^2/2) = 2\pi/Q$. A line of
$Q = 173$ loses 3.6% of its energy in each swing.
:::

### The paper

The paper's *What heat reveals* says that the steel ball rings "near 15 kHz", with "$4\times10^8$ quanta in it at room
temperature", and that a metre away "$\omega r/c = 3\times10^{-4}$". Check the last two from the first. Take the energy
of one quantum of a mode as $\hbar\omega$, with $\hbar = 1.055\times10^{-34}\unit{J\,s}$ (stated here; chapter 8.3
explains the quantum $\hbar\omega$), and a mode's thermal energy as $\kB T = 4.14\times10^{-21}\unit{J}$ at 300 K
(chapter 0.6; chapter 4.2 shows why each mode holds this much).

::: solution
"15 kHz" is a frequency $f$ in cycles per second, so $\omega = 2\pi f = 9.42\times10^4\unit{s^{-1}}$. One quantum is
$\hbar\omega = 1.055\times10^{-34} \times 9.42\times10^4 = 9.94\times10^{-30}\unit{J}$, and the number of quanta is
$\kB T/\hbar\omega = 4.14\times10^{-21}/9.94\times10^{-30} = 4.2\times10^8$. A metre away,
$\omega r/c = 9.42\times10^4 \times 1/3.00\times10^8 = 3.1\times10^{-4}$. Both agree with the paper's rounded values.
:::
:::

::: paper
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) says that the steel ball "rings" near 15 kHz, and
  its Figure [](/paper/#fig:tremor) shows a body's trembling shared among normal modes, each an oscillator of this chapter.
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) writes the response of a moment of the mass
  to a tide as $\chi_h$, and its sum rule [](/paper/#eq:sum-rule) adds up $\omega\,\mathrm{Im}\,\chi_h$, the line of
  this chapter's [](#eq:power) (chapters 4.5 and 4.6).
- [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer) uses only the dissipative part,
  $\mathrm{Im}\,\chi_{yy}$, in [](/paper/#eq:thermometer), and notes that a part in phase with the push "adds nothing"
  to it.
- [Section VI](/paper/#sec:thermal), *Friction at the frequencies of heat*, draws silicon's and diamond's lines as damped
  oscillators of their measured widths (Figure [](/paper/#fig:materials)), and *Volume and surface emission* writes the
  friction of sound through its quality factor $Q$ (chapter 4.4).
- [Section VII](/paper/#sec:no-lens) uses the $Q$ of a body's sound in [](/paper/#eq:optics-bound), and the free-mass
  limit of $\chi$ is the paper's [](/paper/#eq:dust) of Section XIII. In [Section XIV](/paper/#sec:hole) a black hole
  answers a tide with $\mathrm{Im}\,\chi = \nu\omega$ and no stored part, a pure friction (chapters 11.4 and 13.7).
:::

::: deeper
- The GR course's lesson
  [*A law needs a starting state*](https://neovand.github.io/general-relativity/chapter-0.html#initial-data-and-oscillations)
  explains why an oscillator needs a starting position and a starting velocity. Its
  [lab on a cart and a spring](https://neovand.github.io/general-relativity/chapter-0.html#spring-energy-exchange) shows
  the energy passing between the spring and the cart, and its
  [phase-space lab](https://neovand.github.io/general-relativity/chapter-13.html#hamiltonian-phase-space) draws the cart
  in phase space, where a damped swing would spiral inward.
- A. P. French, *Vibrations and Waves* (Norton, 1971), chapters 3 and 4, treats free and driven oscillators, $Q$ and
  resonance, with many laboratory examples.
- K. S. Thorne and R. D. Blandford, *Modern Classical Physics* (Princeton, 2017), section 6.8, is their section on
  fluctuation and dissipation, the subject of chapter 4.6.
:::

[^ball]: The 15 kHz is Rayleigh's estimate: the paper's Appendix A guesses the shape of the mode and computes the
    frequency of that shape, which is never too low. Chapter 4.3 states Lamb's exact result, 12.6 kHz, which is 16%
    below 15 kHz, so Rayleigh's estimate is 20% too high. Here 15 kHz serves only as a frequency to compute with.

[^letters]: Part 4 uses some letters that earlier parts used for other things. Here $k$ is a stiffness, not the
    wavenumber of chapter 2.6, and not $\kB$; $q$ is a coordinate in metres, not the $kz$ of Part 3; $\chi$ is a response
    function, not the stream function of chapter 2.8; $\bar P$ is a power, not a projector; and $J$ is an impulse along
    the track (chapter 1.6), not the paper's current column $\vect J$ or its invariant $J$ of the curvature. The
    damping rate is $\Gamma$, because $\gamma$ is kept for the Lorentz factor of Part 6. A subscript $n$ on it counts
    modes: $\Gamma_n$ is the damping rate of mode $n$. The paper's greybody factors $\Gamma_\ell$ of Section XIV carry
    the degree $\ell$ instead and do not appear in this chapter.

[^Q]: Chapter 2.3's note promised this rule. Chapter 5.4 adds the Stokes parameter $Q$ of polarization, used only in
    that chapter.

[^units]: Check: $\matter m\omega^2$ is in $\mathrm{kg\,s^{-2}} = \mathrm{N\,m^{-1}}$, so $\chi$ is in
    $\mathrm{m\,N^{-1}}$, a length per force.

[^dust]: Chapter [4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust) makes this free-mass limit the key to the sum rules. The paper's equation
    [](/paper/#eq:dust) is the same limit for a whole body: driven faster than its bonds can act, it answers as a cloud
    of free mass.

[^eta]: Chapter 4.4 defines the viscosity at a frequency, a complex number like $\chi$. Its real part is the power
    taken from the shear divided by the square of the rate of shear. The shear pushes the atoms with a force in
    proportion to the shear itself, so $\mathrm{Re}\,\eta$ follows $\mathrm{Im}\,\chi/\omega$ rather than
    $\omega\,\mathrm{Im}\,\chi$; across silicon's narrow peak the two shapes differ by less than 1%.

[^cm]: Spectroscopists measure a frequency by its **wavenumber in inverse centimetres**, the number of wavelengths of
    light at that frequency in one centimetre, $1/\lambda$. A line at $520\unit{cm^{-1}}$ has $\lambda = 19.2\unit{\mu
    m}$. Its frequency is $f = c/\lambda$, which is $3.00\times10^{10}\unit{cm\,s^{-1}}$ times
    $520\unit{cm^{-1}}$, or $1.56\times10^{13}\unit{Hz}$, and its angular frequency is
    $\omega_0 = 2\pi f = 9.8\times10^{13}\unit{s^{-1}}$. Unlike the wavenumber $k$ of
    chapter 2.6, this one has no factor $2\pi$.
