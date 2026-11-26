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

A steel ball that rings changes its quadrupole moment, the measure of how far its mass is drawn out along one axis
([section 2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)).
A pixel a metre away therefore sees a tide that rises and falls at the ball's frequency, near 15 kHz (Figure
[](#fig:ringing-ball)).[^ball] Heat keeps every way of ringing going at once, and the way this random trembling is
shared among them shows how the mass inside is arranged. A crystal of silicon rings in the same manner, at 15.6 THz. A tide applied from outside is a push on such a body, and
this section builds the reply to a push.

So how does anything that can ring answer a push that rises and falls, and which part of its answer takes energy from
the push? The answer is one function of the frequency, the response function. We build it for the simplest thing that
rings, the cart on a spring of section 1.7 with friction added, and the rest of Part 4 builds on it.[^letters]

![The steel ball of radius 10 cm at the two ends of one swing of its lowest quadrupole mode: longer along its axis
(top) and, half a swing later, shorter along it (bottom); the dashed circle shows the ball at rest. The change of shape
is exaggerated $10^{14}$ times, so that the swing that heat gives each pole at room temperature,
$2.2 \times 10^{-16}\unit{m}$ (root mean square), appears as 2.2 cm; the swing repeats 15 000 times a second. A metre
away on the axis, the ring of free balls of section 1.4 is stretched along the axis while the ball is longer along it
and squeezed while it is shorter; the ring shows only the part of the tide that rises and falls, and is far larger
than a real ring.](tut-osc-hero){#fig:ringing-ball}

::: plain
An **oscillator** is anything pulled back toward a resting place with a force that grows with the distance from it,
such as a weight on a spring. Left alone, it swings at its own natural frequency, and friction makes each swing a
little smaller than the last. The quality factor $Q$ says how slowly the swing dies: its energy falls to about a third
in $Q/2\pi$ swings.

If you push it back and forth, it soon swings at the frequency of your push. Near its own frequency it swings $Q$
times farther than a slow push would move it, and a quarter of a swing behind. Only the part of the motion that is a
quarter of a swing behind the push takes energy from it, and that energy becomes heat; the rest is stored and given
back in every swing. A large body rings in many ways at once, and its answer to a push is a sum of such oscillators.
:::

## A mass on a spring swings at one frequency

Section 1.7 described a cart of mass $\matter m$ on a straight track, held by a spring of stiffness
$\sym{stiffness}{k}$, in newtons per metre. Its coordinate $q$ is its distance, in metres, from the place where the
spring is relaxed. The spring pulls back with the force $-kq$, so Newton's second law reads

$$\matter m\,\ddot q = -k\,q .$$

Hamilton's equations ([section 1.7](/tutorial/newton/hamilton/#hamiltons-equations-are-newtons-law-split-in-two))
give the motion:

$$q = A\cos(\omega_0t - \alpha), \qquad \boxed{\;\sym{natural-frequency}{\omega_0} = \sqrt{\frac{k}{\matter m}}\;} .$$

The amplitude $A$, in metres, and the phase $\alpha$, in radians, are fixed by where the cart starts and how fast. The
**natural frequency** $\omega_0$, in radians per second, is fixed by the cart and its spring alone. The units agree,
since $\mathrm{N\,m^{-1}\,kg^{-1}} = \mathrm{s^{-2}}$. For the cart of section 1.7, $\matter m = 2\unit{kg}$ and $k =
50\unit{N\,m^{-1}}$, so $\omega_0 = 5\unit{s^{-1}}$, and one swing there and back takes $2\pi/\omega_0 = 1.26\unit{s}$.

An **oscillator** is anything with this law: a coordinate pulled back toward rest with a force in proportion to its
distance from rest. In the language of
[section 1.5b](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number) the motion is
$q = \mathrm{Re}[\tilde q\,e^{-i\omega_0t}]$, with the phasor $\tilde q = Ae^{i\alpha}$.

The energy of the swing is $E = \tfrac12\matter m\dot q^2 + \tfrac12kq^2$, in joules. We differentiate it and use the
law of motion:

$$\frac{\dd E}{\dd t} = \dot q\,(\matter m\ddot q + kq) = 0 .$$

So the energy stays fixed while it passes between the two terms: all in the spring at the ends of the swing, all in
the motion at the centre.

A body made of many parts can swing in many ways, each with its own frequency and shape: its **normal modes**. The
steel ball's lowest quadrupole mode, which squashes it along one axis and stretches it across, is one. Section 4.3
finds the modes of springs and solid bodies; here we need only that each mode, on its own, is an oscillator.

## Friction makes the swing die away, and the quality factor counts how slowly

A real swing dies away, because friction turns its energy into heat. We assume that **the friction is proportional to
the velocity**, $-\matter m\Gamma\dot q$. The factor $\matter m$ is written out so that $\sym{damping-rate}{\Gamma}$,
the **damping rate**, is measured in $\mathrm{s^{-1}}$. Books write the damping in several ways ($\Gamma$, $\Gamma/2$, $1/\tau$), so we derive everything from the law in full:

$$\matter m\,\ddot q + \matter m\Gamma\,\dot q + k\,q = 0 . \label{eq:damped}$$

The equation is linear and its coefficients are real, so the real part of a complex solution is also a solution, and
we may work with $\tilde q\,e^{-i\omega t}$, where $\omega$ may now be complex. Each time derivative multiplies it by
$-i\omega$ (section 1.5b), so after division by $\matter m\tilde q\,e^{-i\omega t}$ the equation becomes

$$-\omega^2 - i\Gamma\omega + \omega_0^2 = 0 .$$

This quadratic equation has the two roots

$$\omega = -\frac{i\Gamma}{2} \pm \sym{damped-frequency}{\omega_d}, \qquad \omega_d = \sqrt{\omega_0^2 - \Gamma^2/4} .$$

We put the root $\omega_d - i\Gamma/2$ into the exponential, where it splits into two factors, $e^{-i\omega t} =
e^{-\Gamma t/2}\,e^{-i\omega_dt}$. The real part, with $\tilde q = Ae^{i\alpha}$, is

$$\boxed{\;q = A\,e^{-\Gamma t/2}\cos(\omega_dt - \alpha)\;} .$$

The other root gives the boxed form with $-\alpha$ for $\alpha$, so no new motion. The cart swings at the frequency $\omega_d$, a little below $\omega_0$, while its
amplitude shrinks. This dying swing is a **ring-down**. The amplitude falls by a factor $e$ in the time $2/\Gamma$.

The energy falls twice as fast. To see this from the energy itself, we differentiate $E$ and use [](#eq:damped):

$$\frac{\dd E}{\dd t} = \dot q\,(\matter m\ddot q + kq) = -\matter m\Gamma\,\dot q^2 .$$

The friction takes energy at every moment the cart moves. Over one swing the displacement goes as a cosine and the
velocity as a sine, and the square of either averages to $\tfrac12$, so the kinetic energy holds on average half the
total. When the swing changes little in one period, $\langle\matter m\dot q^2\rangle = E$, so $\dd E/\dd t = -\Gamma
E$ and $E \propto e^{-\Gamma t}$: the energy falls by $e$ in the time $1/\Gamma$.

We measure how slowly an oscillator rings down by its **quality factor**,

$$\boxed{\;\sym{quality-factor}{Q} = \frac{\omega_0}{\Gamma}\;} . \label{eq:quality}$$

It is a pure number that counts the swinging the energy lasts for: in the time $1/\Gamma$, while the energy falls by
$e$, the phase advances by $\omega_0/\Gamma = Q$ radians, which is $Q/2\pi$ swings. It can be measured by counting
the swings of a ring-down or by the width of a line, defined below.

**An example.** Give the cart a friction with $Q = 10$. Then $\Gamma = 0.5\unit{s^{-1}}$, the energy falls by $e$ in
2 s, which is 1.6 swings, and each swing ends with 73% of the amplitude it started with (Figure
[](#fig:ring-down)). The frequency $\omega_d = 4.994\unit{s^{-1}}$ is only 0.1% below $\omega_0$, because
$\Gamma^2/4$ is small beside $\omega_0^2$.

**A non-example.** A door closer is a spring with so much friction that the door creeps back without swinging. When
$\Gamma > 2\omega_0$, that is $Q < \tfrac12$, the square root in $\omega_d$ is imaginary and the motion is a sum of two
decaying exponentials. The boundary, $Q = \tfrac12$, is **critical damping**; for the cart it is
$\Gamma = 10\unit{s^{-1}}$.

**A limit.** As $\Gamma \to 0$, $Q$ grows without limit and the undamped swing returns.

In Part 4 a bare $Q$ is a quality factor; a moment of the mass, such as $\matter Q_{ij}$, carries its subscript.

![The cart with $Q = 10$, let go from rest 0.1 m from its relaxed place: look first at the swing shrinking inside the
dashed envelope $\pm A\,e^{-\Gamma t/2}$, which falls by $e$ every 4 s. The tick at 2 s marks where the energy has
fallen by $e$, the tick at 4 s where the amplitude has. The envelope's $A = 0.1001\unit{m}$ is a little more than
0.1 m because the cart starts from rest.](tut-osc-ringdown){#fig:ring-down}

## A steady push gets a steady answer, the response function times the push

Now a hand pushes the cart back and forth with a force that rises and falls at an angular frequency $\omega$ of the
hand's choosing:

$$F(t) = \mathrm{Re}\bigl[\tilde F\,e^{-i\omega t}\bigr] .$$

The phasor $\tilde F$, in newtons, holds the size of the push and its timing. The law of motion becomes
$\matter m\ddot q + \matter m\Gamma\dot q + kq = F(t)$. If two motions both obey this law, their difference obeys the
free law [](#eq:damped), because the push cancels. So every pushed motion is one chosen pushed motion plus a
ring-down, which depends on how the cart started and dies away after a few times $1/\Gamma$. The chosen motion is a
swing at the frequency of the push, which lasts as long as the push does. This **steady state** is the cart's answer.

We write it as $q = \mathrm{Re}[\tilde q\,e^{-i\omega t}]$ and put it into the law of motion. Each time derivative
becomes a factor $-i\omega$, so

$$\bigl(-\matter m\omega^2 - i\matter m\Gamma\omega + k\bigr)\,\tilde q = \tilde F .$$

The differential equation has become algebra. Dividing by the bracket gives $\tilde q =
\chi(\omega)\,\tilde F$, with

$$\boxed{\;\sym{response-function}{\chi}(\omega) = \frac{1}{\matter m\,(\omega_0^2 - \omega^2 - i\Gamma\omega)}\;} .
\label{eq:chi}$$

The complex number $\chi(\omega)$ is the oscillator's **response function**, also called its susceptibility. It is
measured in metres per newton.[^units] Its modulus $|\chi|$ is the amplitude of the swing per newton of push. Its
argument, the angle $\varphi$, in radians, in $\chi = |\chi|\,e^{i\varphi}$, tells the timing: since $\tilde q =
\chi\tilde F$, the phase of the swing is the phase of the push plus $\varphi$. In the form $A\cos(\omega t -
\alpha)$ of section 1.5b a larger phase puts each peak later, so the cart is behind the push by the angle $\varphi$
(Figure [](#fig:phasors)).

The imaginary part of $\chi$ is positive at every positive frequency:

$$\begin{aligned}
\mathrm{Im}\,\chi(\omega) &= \frac{\Gamma\omega}{\matter m\,[(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2]}\\
&= \matter m\Gamma\omega\,|\chi(\omega)|^2 .
\end{aligned}$$

The first form multiplies the top and bottom of [](#eq:chi) by the complex conjugate of the bottom; the
second uses $|\chi|^2 = 1/\matter m^2[(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2]$. Since $\mathrm{Im}\,\chi =
|\chi|\sin\varphi > 0$, the angle $\varphi$ lies between $0$ and $\pi$: the cart is always behind the push, never ahead
of it. This sign belongs to the convention $e^{-i\omega t}$; books that write $e^{+i\omega t}$ have the opposite sign for
every imaginary part (section 1.5b).

Three limits show what $\chi$ holds, and Figure [](#fig:response) draws it between them for three values of $Q$.

**A slow push.** At $\omega \to 0$, $\chi = 1/\matter m\omega_0^2 = 1/k$. The cart follows the push in step, stretching the
spring as a steady force would. This number is the **static compliance**, the stretch per newton: $0.02\unit{m\,N^{-1}}$
for the cart.

**A push at the natural frequency.** At $\omega = \omega_0$ the first two terms cancel, and

$$\chi(\omega_0) = \frac{i}{\matter m\Gamma\omega_0} = i\,\frac{Q}{k} .$$

The swing is $Q$ times the static stretch, and the factor $i = e^{i\pi/2}$ puts it a quarter of a swing behind the
push. This large answer near $\omega_0$ is **resonance**. For the cart with $Q = 10$, $|\chi| = 0.2\unit{m\,N^{-1}}$:
a push of 0.1 N swings the cart 2 cm each way. The largest $|\chi|$ lies a little below $\omega_0$, where
$1/|\chi|^2$ is smallest. Setting the derivative of $(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2$ with respect to
$\omega^2$ to zero gives $\omega^2 = \omega_0^2 - \Gamma^2/2$, that is $\omega = \omega_0\sqrt{1 - 1/2Q^2}$. For the
cart this is $4.99\unit{s^{-1}}$, and there $|\chi|$ exceeds $Q/k$ by only 0.1%.

**A fast push.** For $\omega \gg \omega_0$ the term $-\omega^2$ wins, and $\chi \to -1/\matter m\omega^2$. This is the
answer of a free mass with no spring, $\matter m\ddot q = F$, whose phasors give $-\matter m\omega^2\tilde q = \tilde
F$. The minus sign means that the cart moves opposite to the push, half a swing behind. It does not feel its spring,
because the spring's force grows with the displacement, which shrinks as $1/\omega^2$.[^dust]

![The response of an oscillator with $Q = 3$, 10 and 30, against the frequency of the push in units of $\omega_0$.
Look first at the top panel: the swing per newton, $k|\chi|$, is 1 for a slow push, rises to about $Q$ a little below
$\omega_0$, and approaches the free mass's $(\omega_0/\omega)^2$ above it. The middle panel shows the lag $\varphi$,
which passes $90^\circ$ at $\omega_0$ for every $Q$. The bottom panel shows $\omega\,\mathrm{Im}\,\chi$ in units of
$1/\matter m\Gamma$, the power taken from the push (next section); the bars under it run between its half-power
points (the dots), so each is $1/Q$ long.](tut-osc-response){#fig:response}

![The push's phasor $\tilde F$, 1 N, and the swing's phasor $\tilde q = \chi\tilde F$ for the cart with $Q = 10$,
pushed below its natural frequency ($3\unit{s^{-1}}$), at it ($5\unit{s^{-1}}$) and above it ($8\unit{s^{-1}}$);
$\tilde q$ is drawn to the scale of the bar, 0.0311 m, 0.200 m and 0.0128 m long. Both phasors turn clockwise
together, so the angle $\varphi$ anticlockwise from $\tilde F$ to $\tilde q$ is how far the swing lags behind the
push: $5.4^\circ$, $90^\circ$ and $174.1^\circ$.](tut-osc-phasors){#fig:phasors}

## Only the imaginary part of the response takes energy from the push

We want the power that the hand delivers, averaged over a swing, which is what the friction turns into heat. A force does work at the rate $F\dot q$, force times velocity
([section 1.6](/tutorial/newton/motion/#work-changes-kinetic-energy-and-a-steady-field-keeps-the-energy-fixed)). $F$ has
the phasor $\tilde F$, and $\dot q$ has the phasor $-i\omega\tilde q$.

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

For the cart with $Q = 10$, the half-power points are at 4.756 and $5.256\unit{s^{-1}}$, $0.5\unit{s^{-1}}$ apart. A
slow ring-down in time is a narrow line in frequency, and the two measure the same $\Gamma$.

**A number: silicon's line.** A crystal of silicon holds two interleaved sets of atoms, and a shear of the crystal
pushes one set against the other. Their swing against each other is an oscillator at $520\unit{cm^{-1}}$, which is
15.6 THz.[^cm] Its measured width is about $3\unit{cm^{-1}}$. A ratio of centre to width is the same in any unit of
frequency, so

$$Q = \frac{520}{3} = 173 .$$

The width converts to an angular frequency as the centre does, $\Gamma = 2\pi c \times 3\unit{cm^{-1}} = 5.7 \times
10^{11}\unit{s^{-1}}$, with $c = 3.00\times10^{10}\unit{cm\,s^{-1}}$ the speed of light. So the energy of this swing
falls by $e$ in $1/\Gamma = 1.8\unit{ps}$, which is $Q/2\pi$, about 28 swings.

The figure below plots the friction that each material shows against a uniform shear, at each frequency.[^materials]
This friction is the real part, $\mathrm{Re}\,\eta$, of the material's
[viscosity](/tutorial/evening/waves-and-heat/#matter-is-transparent-so-warm-matter-glows-throughout) $\eta$, in pascal
seconds, and the dashed line marks $10^{-3}\unit{Pa\,s}$, about that of water. A uniform shear drives silicon's
oscillator, and the friction measures the power the oscillator takes from it, so silicon's tall, narrow peak at 15.6 THz
has the shape of this section's line, with the measured width.[^eta] At its top the friction is $0.03\unit{Pa\,s}$,
thirty times the dashed line. Diamond's peak, near 40 THz ($1333\unit{cm^{-1}}$), is the same kind of line. The broad
curves of copper and iron are a different kind of friction (section 4.4); panel (b) belongs to the glow of heat
(sections 10.2 and 10.3).

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

A push reaches several normal modes at once. We work the simplest case exactly. Two equal carts, each of mass $\matter m$, stand side by side on the track. Each is held to its own wall by a spring $k$,
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
$\omega_2$. Since $\tilde q_1$ is half the sum of the two, the response of the first cart to a push on it, $\chi_{11}$,
is

$$\begin{aligned}
\chi_{11}(\omega) = \frac{1}{2\matter m}\biggl[&\frac{1}{\omega_1^2 - \omega^2 - i\Gamma\omega}\\
&+ \frac{1}{\omega_2^2 - \omega^2 - i\Gamma\omega}\biggr] .
\end{aligned} \label{eq:two-carts}$$

This is a sum of two oscillators of the form [](#eq:chi), each with the weight $1/2\matter m$ in place of
$1/\matter m$. With $k_c = k$, the lines stand at $\omega_1 = 5\unit{s^{-1}}$ and
$\omega_2 = \sqrt3 \times 5 = 8.7\unit{s^{-1}}$. A push at 5 or at $8.7\unit{s^{-1}}$ finds a resonance. Between them,
at $7\unit{s^{-1}}$, the two terms have opposite signs. Without friction they nearly cancel, and the first cart moves
only 6% as far as under a slow push ($\chi_{11} = 0.0133\unit{m\,N^{-1}}$). With $Q = 10$ only the real parts cancel,
and $|\chi_{11}| = 0.0029\unit{m\,N^{-1}}$, 21% of the slow push's answer.

The two weights add up to $1/\matter m$. Far above both lines, $\chi_{11} \to -(1/2\matter m)(2/\omega^2) =
-1/\matter m\omega^2$, a push faster than both springs moves only the mass it touches, as a free mass.

For any body of masses and springs, the same holds, with one oscillator for each normal mode $n$:

$$\chi(\omega) = \sum_n \frac{c_n^2}{\omega_n^2 - \omega^2 - i\Gamma_n\omega} . \label{eq:modal-sum}$$

Each mode has its own frequency $\omega_n$ and damping rate $\Gamma_n$, and a **weight** $c_n^2$, in
$\mathrm{kg^{-1}}$, that says how strongly the push reaches the mode. When all the masses equal $\matter m$, the weight
is $c_n^2 = e_{n,1}^2/\matter m$, where the list of numbers $\mathbf e_n$ is the shape of mode $n$, scaled to length
one, and $e_{n,1}$ is its entry at the pushed mass. For the two carts, $\mathbf e_1 = (1, 1)/\sqrt2$ and
$\mathbf e_2 = (1, -1)/\sqrt2$, so each weight is $1/2\matter m$.

The weights add to $1/\matter m$ for any such body. A row of $N$ carts has $N$ modes, whose shapes are perpendicular
lists of length one. Set them side by side as the columns of a square matrix $U$. Then $U^{\mathsf T}U$ is the identity,
so $U^{\mathsf T}$ is the inverse of $U$ and $UU^{\mathsf T}$ is the identity too: the rows of $U$ also have length one.
The first row holds every mode's entry at the pushed mass, so $\sum_n e_{n,1}^2 = 1$.

::: gap
This section states the sum [](#eq:modal-sum) and proves it only for the two carts. The general proof needs the
normal modes of a set of masses and springs, which are the eigenvectors of a symmetric matrix, perpendicular to one
another by [section 3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes).
Section 4.3 gives it. It also assumes friction that damps each mode on its own, as the equal friction on the two carts
does; a general friction can couple the modes, and then the sum holds only approximately, for weak friction.
:::

A body's response is therefore a set of lines, one for each mode. Heat sets every mode swinging at random, the body's
trembling or **tremor** (section 0.5), and a mode's share is the part of the tremor it carries. The figure below
compares two bodies whose fields outside are identical: a ball of 924 masses joined by springs (blue), and a shell of
the same mass and radius, a third of the radius thick (orange). Each curve adds up the shares of the modes in order of
frequency, so each step is one mode. The vertical axis, $\langle\dot q^2\rangle$, is the mean square rate of change
of the body's quadrupole moment: this $q$ is that moment, not the cart's coordinate.

In the ball, 85% of the tremor of the quadrupole along a lattice axis lies at one frequency, so the steel ball's
quadrupole can be treated as one mode. The shell's curve ends 1.22 times higher, because each total is set by each
piece's mass times the square of its distance from the centre, whatever the springs, and the shell's mass lies farther
out. The shell is also softer, so its steps come at lower frequencies. Section 4.6 derives the curves.[^tremor]

{{paper fig:tremor}}

## The answer to a single blow comes after the blow

Another kind of force is a blow, a large force that acts for an instant, such as a hammer striking the ball. Its impulse $J = \int F\,\dd t$, in newton seconds, is the momentum it
gives (section 1.6).

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

This is a convolution, the kind of blur of
[section 2.6](/tutorial/outside/fourier/#a-blur-multiplies-each-ripple-by-a-number), in time. We check it against the
steady push. We put $F(t') = \mathrm{Re}[\tilde F\,e^{-i\omega t'}]$ into the integral and write $s = t - t'$ for the
time since each blow. Because $\chi(s)$ is real, the real part can be taken outside the integral:

$$q(t) = \mathrm{Re}\Bigl[\tilde F\,e^{-i\omega t}\int_0^\infty\chi(s)\,e^{i\omega s}\,\dd s\Bigr] .$$

The integral stops at $s = 0$ because $\chi(s)$ vanishes for $s < 0$. So the steady state's $\chi(\omega)$ must be the
integral of $\chi(t)\,e^{i\omega t}$, the Fourier transform in time in this book's convention
([section 2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time)). We
write the sine as $(e^{i\omega_dt} - e^{-i\omega_dt})/2i$; each term then gives an integral of a decaying exponential,
$\int_0^\infty e^{-bs}\,\dd s = 1/b$ when the real part of $b$ is positive:

$$\begin{aligned}
\int_0^\infty\chi(s)\,e^{i\omega s}\,\dd s &= \frac{1}{2i\matter m\omega_d}\biggl[\frac{1}{\Gamma/2 - i(\omega + \omega_d)}\\
&\qquad - \frac{1}{\Gamma/2 - i(\omega - \omega_d)}\biggr]\\
&= \frac{1}{2i\matter m\omega_d}\,\frac{2i\omega_d}{(\Gamma/2 - i\omega)^2 + \omega_d^2}\\
&= \frac{1}{\matter m\,(\omega_0^2 - \omega^2 - i\Gamma\omega)} .
\end{aligned}$$

The second line puts the two fractions over their common denominator, a product of the form $(x - iy)(x + iy) =
x^2 + y^2$ with $x = \Gamma/2 - i\omega$ and $y = \omega_d$. The third expands $(\Gamma/2 - i\omega)^2 = \Gamma^2/4 -
i\Gamma\omega - \omega^2$ and uses $\omega_d^2 + \Gamma^2/4 = \omega_0^2$. The result is [](#eq:chi): the response to a
blow and the response to a steady push are one function, seen in time and in frequency.

The impulse response is zero before the blow. Nothing moves before it is pushed: the response is **causal**. Section
[4.5](/tutorial/response/causality/#causality-ties-the-stiffness-of-a-response-to-its-friction) shows that causality
ties $\mathrm{Re}\,\chi$ to $\mathrm{Im}\,\chi$ and, with the free-mass limit, fixes the area under the line of
power, whatever the friction.

**The idea to keep: anything that can ring answers a rising and falling push through one function, $\chi(\omega)$. Its
real part stores energy and gives it back, its imaginary part turns work into heat, and its sharpness is $Q$, the
frequency of the line over its width. A body is a sum of such lines.**

::: problems
### Practice

**[4.1]** A bell rings at 440 Hz, and the energy of its sound falls by a factor $e$ in 2 s. What is its quality factor?

::: solution
Here $\Gamma = 1/(2\unit{s}) = 0.5\unit{s^{-1}}$ and $\omega_0 = 2\pi \times 440\unit{Hz} = 2760\unit{s^{-1}}$, so
$Q = 5500$, and the energy falls by $e$ in $Q/2\pi = 880$ swings.
:::

**[4.1]** Why does the reactive part, $\mathrm{Re}\,\chi$, take no energy on average?

::: solution
Its velocity is a quarter of a swing out of step with the force, so the work done in one quarter of a swing is returned
in the next.
:::

**[4.1]** How far behind the push is the cart at resonance, and why?

::: solution
A quarter of a swing. At $\omega_0$ the spring's force and the mass's inertia cancel, so the push only balances the
friction, which goes with the velocity, a quarter of a swing ahead of the displacement.
:::

**[4.1]** Give the cart of section 1.7 ($\matter m = 2\unit{kg}$, $k = 50\unit{N\,m^{-1}}$) a quality factor of 50.
Find $\Gamma$, the number of swings in which its energy falls by $e$, and its swing per newton when it is pushed at
$\omega_0$.

::: solution
The damping rate is $\Gamma = \omega_0/Q = 5/50 = 0.1\unit{s^{-1}}$. The energy falls by $e$ in $1/\Gamma = 10\unit{s}$,
which is $Q/2\pi = 8.0$ swings of 1.26 s. At resonance $|\chi| = Q/k = 50/50 = 1.0\unit{m\,N^{-1}}$, fifty times the
static compliance of $0.02\unit{m\,N^{-1}}$.
:::

### Stretch

**[4.1]** Combine this section with the energy $H = p^2/2\matter m + \tfrac12kq^2$ of section 1.7. Show that at
resonance the energy lost in one swing, $2\pi\bar P/\omega_0$, is $2\pi/Q$ times the energy stored in the swing.

::: solution
At $\omega = \omega_0$ the swing is $q = |\tilde q|\cos(\omega_0t - \alpha)$, and since $\matter m\omega_0^2 = k$ the
stored energy is constant, $E = \tfrac12k|\tilde q|^2$ (the friction's loss is made up by the push). With
$\tilde q = \chi\tilde F$ and $|\chi(\omega_0)| = Q/k$, $E = Q^2|\tilde F|^2/2k$. By [](#eq:power) with
$\mathrm{Im}\,\chi(\omega_0) = Q/k$, $\bar P = \omega_0Q|\tilde F|^2/2k$, so one swing loses
$2\pi\bar P/\omega_0 = \pi Q|\tilde F|^2/k$. The ratio of loss to store is $\pi Q/(Q^2/2) = 2\pi/Q$: a line of $Q = 173$ loses 3.6% per swing.
:::

### The camera

**[4.1]** A steel ball rings at an estimated $15\unit{kHz}$. Estimate the number of quanta in this mode at room
temperature, and the number $\omega r/c$ at a distance $r = 1\unit{m}$. Take the energy of one quantum of a mode as
$\hbar\omega$, with $\hbar = 1.055\times10^{-34}\unit{J\,s}$ (section 8.3 explains the quantum), and a mode's thermal
energy as $\kB T = 4.14\times10^{-21}\unit{J}$ at 300 K (section 0.6; section 4.2 shows why each mode holds this much).

::: solution
A frequency of 15 kHz is $f$ in cycles per second, so $\omega = 2\pi f = 9.42\times10^4\unit{s^{-1}}$. One quantum is
$\hbar\omega = 9.94\times10^{-30}\unit{J}$, and the number of quanta is
$\kB T/\hbar\omega = 4.14\times10^{-21}/9.94\times10^{-30} = 4.2\times10^8$. A metre away,
$\omega r/c = 9.42\times10^4 \times 1/3.00\times10^8 = 3.1\times10^{-4}$.
:::
:::

::: paper
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV): the steel ball's 15 kHz, and Figure
  [](/paper/#fig:tremor), a body's trembling shared among normal modes.
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals): the response $\chi_h$ and its sum rule
  [](/paper/#eq:sum-rule), which adds up $\omega\,\mathrm{Im}\,\chi_h$ (sections 4.5 and 4.6).
- [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer) uses only $\mathrm{Im}\,\chi_{yy}$,
  in [](/paper/#eq:thermometer).
- [Section VI](/paper/#sec:thermal): silicon's and diamond's lines as damped oscillators (Figure
  [](/paper/#fig:materials)).
- [Section VII](/paper/#sec:no-lens) uses the $Q$ of a body's sound in [](/paper/#eq:optics-bound); the free-mass limit
  is [](/paper/#eq:dust); in [Section XIV](/paper/#sec:hole) a black hole answers a tide with $\mathrm{Im}\,\chi =
  \nu\omega$, a pure friction (sections
  [11.4](/tutorial/black-holes/under-tides/#the-holes-quadrupole-answers-a-tide-with-friction-alone) and
  [13.7](/tutorial/what-a-field-keeps/thermometer/)).
:::

::: deeper
- The GR course's lesson
  [*A law needs a starting state*](https://neovand.github.io/general-relativity/chapter-0.html#initial-data-and-oscillations)
  explains why an oscillator needs a starting position and velocity.
- A. P. French, *Vibrations and Waves* (Norton, 1971), chapters 3 and 4.
- K. S. Thorne and R. D. Blandford, *Modern Classical Physics* (Princeton, 2017), section 6.8, treats fluctuation and
  dissipation (section 4.6).
:::

[^ball]: The 15 kHz is Rayleigh's estimate. Section 4.3 derives it and states Lamb's exact result, 12.6 kHz; here 15 kHz
    only serves as a frequency to compute with. First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV.

[^letters]: Part 4 gives some letters new meanings: $k$ is a stiffness, not a wavenumber; $q$ a coordinate in metres;
    $\chi$ a response function; $\bar P$ a power; $J$ an impulse. The damping rate is $\Gamma$ because $\gamma$ is kept
    for the Lorentz factor of Part 6.

[^units]: Check: $\matter m\omega^2$ is in $\mathrm{kg\,s^{-2}} = \mathrm{N\,m^{-1}}$, so $\chi$ is in
    $\mathrm{m\,N^{-1}}$, a length per force.

[^dust]: Section [4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust) makes this
    free-mass limit the key to the sum rules. First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII,
    as its equation [](/paper/#eq:dust): driven faster than its bonds can act, a whole body answers as a cloud of free
    mass.

[^materials]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, as its Fig. [](/paper/#fig:materials).

[^tremor]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV and Appendix A, Fig.
    [](/paper/#fig:tremor). The 85% is computed on the lattice of section 4.3.

[^eta]: Section 4.4 defines the viscosity at a frequency, a complex number like $\chi$. The shear pushes the atoms with
    a force in proportion to the shear itself, so $\mathrm{Re}\,\eta$ follows $\mathrm{Im}\,\chi/\omega$ rather than
    $\omega\,\mathrm{Im}\,\chi$; across silicon's narrow peak the two shapes differ by less than 1%.

[^cm]: Spectroscopists give a frequency as a **wavenumber in inverse centimetres**, $1/\lambda$. A line at $520\unit{cm^{-1}}$ has $\lambda = 19.2\unit{\mu
    m}$, so its frequency is $f = c/\lambda = 1.56\times10^{13}\unit{Hz}$ and its angular frequency is
    $\omega_0 = 2\pi f = 9.8\times10^{13}\unit{s^{-1}}$. Unlike the wavenumber $k$ of section 2.6, this one has no
    factor $2\pi$.
