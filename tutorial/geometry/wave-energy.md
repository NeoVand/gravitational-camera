---
id: '7.8'
title: 'Wave energy, damping by viscosity, and memory'
question: 'Section VI says that "in water, a gravitational wave would have to travel nearly $10^{21}$ light-years before losing much of its energy". How much energy does a wave carry, how does friction take it, and what does a burst of waves leave behind when it has passed?'
part: '7'
requires: ['2.2', '4.4', '5.1', '5.4', '6.4', '6.5', '7.4', '7.6', '7.7']
paper: [sec:thermal, eq:damped, eq:alpha, sec:waves, sec:vistas, eq:memory, eq:burst-memory, eq:merger-memory, fig:memory, fig:closed-furnace]
figures: [fig:memory]
live: [memory-pattern]
depth: A
---

The paper's [*Absorption*](/paper/#par:absorption), in its Section VI, says that a gravitational wave crossing matter
"shears it at the rate $\tfrac12\dot h_{ij}$", that the matter's friction resists, and that the wave equation becomes

{{paper eq:damped}}

"so the wave's energy decays at the rate $16\pi G\eta/c^2$, the result found by Hawking". Its Section XI adds, in
[*Memory*](/paper/#par:memory), that radiation which escapes to infinity carries away mass, "and a camera it passes is
left permanently deformed".

So we ask how much energy a wave carries, how friction takes it, and what a burst of waves leaves behind. The heat
that friction makes will answer the first two questions, and the energy that a burst carries away the third.

::: plain
A gravitational wave that passes through water or rock stretches it one way and squeezes it the other, so neighbouring
layers slide past one another. Friction inside the matter, its viscosity, resists the sliding and turns a little of
the wave's energy into heat. The wave fades, but extremely slowly: in water it would travel nearly $10^{21}$
light-years before losing most of its energy, while the visible universe is about $10^{11}$ light-years across.

The heat has to come from the wave, so it tells us how much energy the wave carries: about a milliwatt through each
square metre for a wave of the strength LIGO detects, whatever the matter.

When a burst of radiation carries energy away more strongly in some directions than in others, the strain it leaves
behind does not return to zero. Free objects it passes end up slightly farther apart, or closer together, for good.
This lasting change is the memory, and the waves of a merger, which carry energy too, leave one of their own.
:::

## Viscosity fades a wave at Hawking's rate

We want the paper's [](/paper/#eq:damped) from Einstein's equation, because it says how quickly matter takes energy
from a wave. Here $\sym{viscosity}{\matter\eta}$ is chapter
[4.4](/tutorial/response/viscosity/#viscosity-is-a-stress-that-answers-how-fast-a-shape-changes)'s shear viscosity,
in pascal seconds. We assume that **the medium is carried by the wave**: it has no stiffness against shear that matters
at the wave's frequency, so its pieces move as free balls do.[^press] We also assume that **its friction is $\matter\eta$
at the wave's frequency**, chapter 4.4's $\mathrm{Re}\,\matter\eta(\omega)$. In this chapter $\field h_{ij}$ is the wave's strain in chapter
[7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical)'s TT gauge, and
a dot is a derivative in time.

**The shear.** By chapter
[7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain), the wave moves
free balls by $\tfrac12\field h_{ij}\xi_j$, so a medium carried by it is strained by $\tfrac12\field h_{ij}$ and sheared
at the rate $\tfrac12\dot{\field h}_{ij}$. That rate has no trace, because the strain has none, so it is 4.4's rate of
shear itself, $\dot{\tilde u}_{ij} = \tfrac12\dot{\field h}_{ij}$.

**The stress.** Chapter 4.4's viscous stress, the force per area across a face, is $2\matter\eta\,\dot{\tilde u}_{ij} =
\matter\eta\,\dot{\field h}_{ij}$, which 4.4 called $\matter T_{ij}$, counting a pull as positive. Einstein's
equation reads instead chapter
[6.5](/tutorial/relativity/stress-energy/#in-the-stresses-the-sign-is-that-of-a-flow-of-momentum)'s
$\sym{stress-energy-tensor}{\matter T}_{ij}$, the flow of momentum, which counts a push as positive and so is minus 4.4's
stress for matter at rest. With 6.5's sign, used from here on, the medium adds to the source

$$\matter T_{ij} = -\matter\eta\,\dot{\field h}_{ij} ,$$

the paper's "stress $-\eta\,\dot h_{ij}$", in pascals.

**The field equation.** Chapter
[7.4](/tutorial/geometry/linearized-gravity/#in-harmonic-gauge-einsteins-equation-is-a-wave-equation-for-each-component)'s
field equation holds in TT gauge, where reversing the trace changes nothing, $\field{\bar h}_{ij} = \field
h_{ij}$.[^gauge] With $\Box = -c^{-2}\partial_t^2 + \nabla^2$ it reads

$$\Box\field h_{ij} = -\frac{16\pi G}{c^4}\,\matter T_{ij} .$$

With the medium's stress as the source,

$$-\frac1{c^2}\,\ddot{\field h}_{ij} + \nabla^2\field h_{ij} = \frac{16\pi G\matter\eta}{c^4}\,\dot{\field h}_{ij} .$$

We multiply by $-c^2$ and collect the terms on one side:

$$\boxed{\;\ddot{\field h}_{ij} + \frac{16\pi G\matter\eta}{c^2}\,\dot{\field h}_{ij} - c^2\nabla^2\field h_{ij} = 0
,\;} \label{eq:hawking}$$

the paper's [](/paper/#eq:damped) shown above. The units agree: $G\matter\eta$ is in $\mathrm{m^2\,s^{-3}}$, so
$16\pi G\matter\eta/c^2$ is in $\mathrm{s^{-1}}$, a rate.

**Hawking's rate.** Equation [](#eq:hawking) is chapter
[5.1](/tutorial/waves/wave-equation/#a-damping-term-makes-a-wave-fade-at-a-fixed-rate-per-metre)'s damped wave
equation for each entry, with the damping rate $\sym{damping-rate}{\Gamma} = 16\pi G\matter\eta/c^2$.[^letters] Chapter
5.1 showed that in such a wave the amplitude falls at the rate $\Gamma/2 = 8\pi G\matter\eta/c^2$ and the energy at
$\Gamma$, and that per metre the energy falls at $\alpha = \Gamma/c$. So the absorption coefficient is

$$\boxed{\;\sym{absorption-coefficient}{\alpha} = \frac{16\pi G\matter\eta}{c^3} ,\;}$$

in $\mathrm{m^{-1}}$, the paper's

{{paper eq:alpha}}

**Numbers.** Water's everyday viscosity, $10^{-3}\unit{Pa\,s}$, gives $\Gamma = 3.7\times10^{-29}\unit{s^{-1}}$ and
$\alpha = 1.2\times10^{-37}\unit{m^{-1}}$. The energy falls by the factor $e$ after $1/\alpha = 8.0\times10^{36}$ m, or
$8.5\times10^{20}$ light-years: the paper's "nearly $10^{21}$". The visible universe is about $10^{11}$ light-years
across, so the wave would cross it eight or nine billion times.

**A limit.** With $\matter\eta = 0$, [](#eq:hawking) is chapter 7.6's free wave equation for each entry of the strain.

**What it means.** Matter is transparent to gravitational waves (Figure [](#fig:viscous-slab)), and the third section
shows how nearly.

![Look first at the envelope: inside the slab the wave shears the medium at half the rate of its strain, the friction
turns some of its energy into heat, and the amplitude falls. The fall is exaggerated about $10^{37}$ times for a slab a
metre thick.](tut-viscous-slab){#fig:viscous-slab}

## The heat comes from the wave, so the wave carries energy

We want the energy that a wave carries, which chapters 5.1, 5.4 and
[7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole) stated. The
friction of the last section makes heat, which can come only from the wave. We assume that **energy is
conserved**, so that the heat made in each cubic metre each second equals the energy the wave loses there, and that
**the damping is weak**, $\Gamma \ll \omega$ for the angular frequency $\omega$, so that we may average over a cycle,
written $\langle\;\rangle$ as in chapter 5.1.

**The heat.** Chapter [4.4](/tutorial/response/viscosity/#friction-turns-the-work-of-a-shear-into-heat-more-at-higher-frequency)'s
heat per volume per second, $2\matter\eta\,\dot{\tilde u}_{ij}\dot{\tilde u}_{ij}$, with $\dot{\tilde u}_{ij} =
\tfrac12\dot{\field h}_{ij}$, is

$$2\matter\eta\,\bigl(\tfrac12\dot{\field h}_{ij}\bigr)\bigl(\tfrac12\dot{\field h}_{ij}\bigr) =
\tfrac12\matter\eta\,\dot{\field h}_{ij}\dot{\field h}_{ij} .$$

**The loss.** Let $\sym{wave-energy-density}{\matter{\mathcal U}}$ be the wave's **energy density**, its energy per
cubic metre, in $\mathrm{J\,m^{-3}}$.[^u] By the last section it falls at the rate $\Gamma$, so the wave loses
$\Gamma\matter{\mathcal U}$ in each cubic metre each second.

**The balance.** Setting the loss equal to the heat, averaged over a cycle, gives the **heat balance**

$$\frac{16\pi G\matter\eta}{c^2}\,\matter{\mathcal U} = \tfrac12\matter\eta\,\bigl\langle\dot{\field
h}_{ij}\dot{\field h}_{ij}\bigr\rangle .$$

We divide by $16\pi G\matter\eta/c^2$:

$$\boxed{\;\begin{aligned}\matter{\mathcal U} &= \frac{c^2}{32\pi G}\,\bigl\langle\dot{\field h}_{ij}\dot{\field
h}_{ij}\bigr\rangle\\ &= \frac{c^2}{16\pi G}\,\bigl\langle\dot{\field h}_+^2 + \dot{\field
h}_\times^2\bigr\rangle .\end{aligned}\;} \label{eq:wave-energy}$$

The second form holds because $\field h_{ij}\field h_{ij} = 2(\field h_+^2 + \field h_\times^2)$, since each of chapter
[5.4](/tutorial/waves/polarization/#a-wave-across-the-line-of-sight-has-two-patterns-of-stretch)'s patterns has
$e^A_{ij}e^A_{ij} = 2$ and the two are orthogonal. The units agree: $c^2/G$ is in $\mathrm{kg\,m^{-1}}$, and times
$\mathrm{s^{-2}}$ it is $\mathrm{J\,m^{-3}}$.

**The viscosity cancels.** It appears on both sides of the balance, so the energy found belongs to the wave alone.
Water, honey or any other medium gives the same answer, as it must, because a wave carries its energy before it meets
any medium at all.

**The flux.** The wave moves at $c$ and carries its energy with it, as chapter 5.1's shear wave did, so the energy that
crosses each square metre each second is $F = c\,\matter{\mathcal U}$:

$$\boxed{\;F = \frac{c^3}{16\pi G}\,\bigl\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\bigr\rangle ,\;}
\label{eq:wave-flux}$$

in $\mathrm{W\,m^{-2}}$. This is the **energy flux** that chapters
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed) and
[5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on) stated, now derived, and it is chapter
7.7's $c^3\langle\dot{\field h}^{\rm TT}_{ij}\dot{\field h}^{\rm TT}_{ij}\rangle/32\pi G$, with the same factor.

**A number.** A plus wave of strain amplitude $10^{-21}$ at 100 Hz has $\langle\dot{\field h}_+^2\rangle =
\tfrac12\omega^2\field h_+^2$ with $\omega = 628\unit{s^{-1}}$, so it carries $F = 1.6\times10^{-3}\unit{W\,m^{-2}}$,
chapter 5.1's number. Yet the same wave moves the end of one of LIGO's 4 km arms
by only $2\times10^{-18}$ m. A milliwatt through each square metre buys a stretch of one part in $10^{21}$, because the
factor $c^3/G$, $4.0\times10^{35}\unit{kg\,s^{-1}}$, is so large: space is very stiff.

**The power.** Chapter 7.7 added this flux over a sphere to find the radiated power $\sym{radiated-power}{P}$, in
watts, so its $4.55\times10^{-41}$ W for the paper's [](/paper/#eq:dumbbell) no longer rests on a stated flux.
On the dumbbell's axis at $r = 10^4$ km, 7.7's
[two strains](/tutorial/geometry/quadrupole-formula/#seen-along-its-spin-a-rotors-two-polarizations-share-one-amplitude)
of amplitude $\field A = 1.67\times10^{-47}$ at the angular frequency $2\Omega = 201\unit{s^{-1}}$ give
$c^3(2\Omega)^2\field A^2/16\pi G = 9.1\times10^{-56}\unit{W\,m^{-2}}$, and so does the power: the axis receives $5/2$
times the average flux $P/4\pi r^2$, since by chapter 5.4 the average is two fifths of the flux there.

::: gap
**Where the energy of a wave lives.** Einstein's equation gives the same energy without any matter, at second order
in $\field h$: R. A. Isaacson showed in 1968 that the waves, averaged over a region several wavelengths across, act on
the background as a source with the energy density of [](#eq:wave-energy). The average is needed because the energy
is built from first derivatives of the metric, and chapter
[7.1](/tutorial/geometry/metric/#falling-removes-the-fields-first-derivatives-at-a-point-but-not-its-second) showed that
a falling observer can make all of them vanish at any one point. This sketch skips the second-order expansion and the
averaging; the GR course's section 18.7, in Go deeper, gives both.
:::

## Matter barely touches the waves

We want to know whether a scene could be lit with gravitational waves, as a room is lit by a lamp, and seen by what it
sends back. That would need matter to scatter the waves. A **scattering cross-section** is the scattered power
divided by the flux that falls on the body, an area of wave front. For the $1/r$ field of a mass the total is
infinite, because waves that pass far away are still turned through small angles, as in Rutherford scattering. So we
count the scattering into each direction. A solid angle is the area that a patch of directions covers on a sphere
of radius one (chapter [1.3](/tutorial/newton/gauss-and-poisson/#solid-angle-measures-how-large-a-patch-looks)),
measured in steradians; the whole sky is $4\pi$ sr. The **differential cross-section** is the cross-section per
steradian, in $\mathrm{m^2\,sr^{-1}}$. For a body of mass $\matter m$, at large angles, it is of order
$(G\matter m/c^2)^2$ per steradian, a result of P. C. Peters [@Peters1976] stated here without proof.[^peters] It is
plausible because $G\matter m/c^2$, half the Schwarzschild radius, is the only length that gravity makes from a mass.

**The estimate.** For a person of 70 kg, $G\matter m/c^2 = 5.2\times10^{-26}$ m, so the cross-section is about
$2.7\times10^{-51}\unit{m^2}$ per steradian: the paper's $3\times10^{-51}\unit{m^2\,sr^{-1}}$. The person's outline,
about $0.7\unit{m^2}$, is $10^{50}$ times larger. Absorption does more, but still almost nothing. By the first section
a wave loses the fraction $\alpha$ of its flux in each metre, so a volume $V$ absorbs the power $\alpha FV$, the flux
that falls on the area $\alpha V$. For 70 kg of water, $0.07\unit{m^3}$, that area is
$1.25\times10^{-37}\unit{m^{-1}}\times 0.07\unit{m^3} = 8.7\times10^{-39}\unit{m^2}$.

So, in the words of the paper's [*Scattering, earthquakes and
tails*](/paper/#par:scattering-earthquakes-and-tails), "a scene cannot be illuminated with gravitational waves". Every
picture in the paper is made by what the scene sends out or how it pulls. A warm body does
send out a faint glow, set by the same friction, because by
[Kirchhoff's law](/tutorial/waves/radiance/#a-warm-bodys-glow-over-its-absorption-is-the-radiance-of-an-enclosure-at-its-temperature)
a body that absorbs also emits. This is the glow of the paper's closed furnace, its Figure
[](/paper/#fig:closed-furnace), which chapter 10.3 bounds.

## A burst that carries energy away leaves the strain changed for good

We want the paper's [](/paper/#eq:memory) and what it gives for jets and explosions. A **burst** here is a brief
release of energy carried by particles that move at nearly the speed of light, such as the neutrinos of a collapsing
star. By chapter [6.4](/tutorial/relativity/energy-and-momentum/#light-has-no-rest-mass-but-two-beams-of-light-have-one),
each carries the momentum $\matter E/c$ along its direction of travel.

**The directions and angles** are these (Figure [](#fig:memory-angles)).

- $\sym{camera-direction}{\hat N}$ is the unit vector from the source to the camera, a distance $r$ away. Chapter 5.4's
  axes $\vect e_1$ and $\vect e_2$ lie across it, and in them $\field h_+ = \tfrac12e^+_{ij}\field h_{ij}$ and $\field
  h_\times = \tfrac12e^\times_{ij}\field h_{ij}$.
- $\sym{emission-direction}{\hat n'}$ is a direction of emission, a unit vector, at the angle $\beta$ from $\hat N$ and
  the azimuth $\psi$ round $\hat N$, measured from $\vect e_1$.
- $\dd^2\hat n' = \sin\beta\,\dd\beta\,\dd\psi$ is the solid angle of a small patch of directions about $\hat n'$. With
  $v = \cos\beta$ it is $\dd v\,\dd\psi$, and the whole sky is $v$ from $-1$ to $1$ and $\psi$ from $0$ to $2\pi$.
- For a burst that is the same all round an axis $\hat z$, $\theta$ is the camera's angle from $\hat z$ and $\theta'$
  that of $\hat n'$. We put $\vect e_1$ on the side of $\hat z$, so $\hat z = \cos\theta\,\hat N + \sin\theta\,\vect
  e_1$.

The energy sent into each steradian about $\hat n'$ is $\dd\matter E/\dd^2\hat n'$, in $\mathrm{J\,sr^{-1}}$, and its
integral over the sky is the total energy $\matter E$. The paper writes $\dd\Omega'$ for $\dd^2\hat n'$; we keep
$\Omega$ for a rate of turning. Its Section XI then says

{{paper eq:memory}}

![Look first at the two arrows from the source: $\hat N$ points to the camera and $\hat n'$ along one piece of the
burst. The angle $\beta$ from $\hat N$ and the turn $\psi$ round $\hat N$, measured from $\vect e_1$, place $\hat n'$.
A burst that is the same all round the axis $\hat z$ needs only the camera's angle $\theta$ and the emission's angle
$\theta'$ from that axis. Schematic.](tut-memory-angles){#fig:memory-angles}

**A sketch (depth B).** One particle of energy $\matter E$ that leaves the origin at $t = 0$ along $\hat n'$ is, by
chapter [6.5](/tutorial/relativity/stress-energy/#dust-a-fluid-and-a-beam-of-light-each-fill-the-table), a moving
point of momentum flux $\matter T_{kl} = \matter E\,\hat n'_k\hat n'_l\,\delta^3(\vect x - ct\hat n')$ for $t > 0$.
Chapter 7.7's [far-zone formula](/tutorial/geometry/quadrupole-formula/#far-away-each-direction-reads-the-stress-at-one-wavevector),
the paper's [](/paper/#eq:wave-zone), reads its transform at the wavevector $\omega\hat N/c$:

$$\begin{aligned}\matter{\tilde T}_{kl} &= \matter E\,\hat n'_k\hat n'_l\int_0^\infty e^{i\omega(1 - \hat n'\cdot\hat
N)t}\,\dd t\\ &= \matter E\,\hat n'_k\hat n'_l\,\frac{i}{\omega\,(1 - \hat n'\cdot\hat N)} .\end{aligned}$$

Three steps take this to the strain.

1. **A step in time.** The factor $i/\omega$ is the transform of a step, zero before $t = 0$ and one after,[^step]
   and 7.7's factor $e^{i\omega r/c}$ delays it by $r/c$. So the strain at the camera changes once, at $t = r/c$.
2. **The projector.** 7.7's formula keeps $\Lambda_{ij,kl}(\hat N)$ of the stress, its part across $\hat N$ with no
   trace, written $[\;]^{\rm TT}$.
3. **The trace.** 7.7's formula starts from the trace-reversed $\field{\bar h}_{kl}$, which differs from $\field
   h_{kl}$ by a multiple of $\delta_{kl}$; $\Lambda$ removes it, so it does not matter.

With 7.7's factor $4G/c^4r$, the step is

$$\begin{aligned}\Delta\field h^{\rm TT}_{ij} &= \frac{4G\matter E}{c^4r}\\ &\quad\times\Bigl[\frac{\hat n'_i\hat
n'_j}{1 - \hat n'\cdot\hat N}\Bigr]^{\rm TT} .\end{aligned}$$

Adding the particles, each with its share $(\dd\matter E/\dd^2\hat n')\,\dd^2\hat n'$, gives the paper's equation.

The **memory** is the step $\sym{memory-step}{\Delta\field h^{\rm TT}_{ij}}$, the strain after the burst minus the
strain before: a constant table of pure numbers.

::: gap
The sketch applies a formula made for a source small compared with its distance $r$ to particles that fly out as far
as the camera, where the source is no longer small compared with $r$. It also leaves out the source, whose mass falls
by $\matter E/c^2$; at order $1/r$ that change of pull is a multiple of $\delta_{ij}$, with no transverse trace-free
part. K. S. Thorne's treatment [@Thorne1992] uses the whole retarded field and finds the same step for a camera that
the particles do not hit.
:::

**In the camera's axes.** By the list above, $\hat n'\cdot\vect e_1 = \sin\beta\cos\psi$ and $\hat n'\cdot\vect e_2 =
\sin\beta\sin\psi$, so with 5.4's $e^+_{ij} = e_{1i}e_{1j} - e_{2i}e_{2j}$,

$$e^+_{ij}\hat n'_i\hat n'_j = \sin^2\beta\,(\cos^2\psi - \sin^2\psi) = \sin^2\beta\cos2\psi .$$

The projector changes nothing in this product. Chapter 7.6's $\Lambda$ is unchanged when its two pairs of indices swap,
and it leaves $e^+$ whole, because $e^+$ already lies across $\hat N$ with no trace:

$$e^+_{ij}\Lambda_{ij,kl}\hat n'_k\hat n'_l = (\Lambda_{kl,ij}e^+_{ij})\,\hat n'_k\hat n'_l = e^+_{kl}\hat n'_k\hat
n'_l .$$

Last, $\sin^2\beta = (1 - \cos\beta)(1 + \cos\beta)$, so $\sin^2\beta/(1 - \cos\beta) = 1 + \cos\beta$. The cross
pattern gives $\sin^2\beta\sin2\psi$ in the same way. So

$$\boxed{\;\begin{aligned}\Delta\field h_+ &= \frac{2G}{c^4r}\int\frac{\dd\matter E}{\dd^2\hat n'}\,(1 +
\cos\beta)\\ &\qquad\times\cos2\psi\,\dd^2\hat n' ,\\ \Delta\field h_\times &= \frac{2G}{c^4r}\int\frac{\dd\matter
E}{\dd^2\hat n'}\,(1 + \cos\beta)\\ &\qquad\times\sin2\psi\,\dd^2\hat n' .\end{aligned}\;} \label{eq:memory-axes}$$

The denominator has gone. It is chapter
[6.3](/tutorial/relativity/aberration/#light-from-ahead-is-bluer-and-light-from-behind-is-redder)'s compression: a
particle aimed near the camera chases its own signal, so what it does over a time $\Delta t$ arrives within $(1 -
\cos\beta)\,\Delta t$. Such particles count for more, but they have almost no part across $\hat N$, and the two effects
cancel.

**One narrow jet.** A **jet** sends all its energy along one direction. For a jet at the angle $\theta$ from $\hat N$,
with $\vect e_1$ on its side ($\beta = \theta$, $\psi = 0$),

$$\Delta\field h_+ = \frac{2G\matter E}{c^4r}\,(1 + \cos\theta) .$$

It is largest close to the jet's own line, where it tends to $4G\matter E/c^4r$, and zero from behind, at $\theta =
180°$. Exactly on the line, $\sin^2\beta$ and $1 - \cos\beta$ are both zero, and their ratio tends to 2 only as a limit.
There $\psi$ has no meaning, and the answer comes from symmetry, as the paper says: the jet is unchanged by any turn
about $\hat N$, and a table across $\hat N$ with no trace that every such turn leaves unchanged is zero.[^turn] The
camera is then also inside the jet, where the gap box says the formula does not apply.

**Two opposite jets** that share $\matter E$ send $\matter E/2$ at $\theta$ and $\matter E/2$ at $180° - \theta$, both
in the plane of $\vect e_1$, so $\cos2\psi = 1$ for both. Their memory is $(G\matter E/c^4r)[(1 + \cos\theta) + (1 -
\cos\theta)] = 2G\matter E/c^4r$, the same in every direction off their axis, as the paper says for jets that share
the energy (with $\matter E$ in each, it is $4G\matter E/c^4r$).

**A sphere and a dipole.** A burst that is the same in every direction has $\dd\matter E/\dd^2\hat n' = \matter
E/4\pi$, and $\cos2\psi$ averages to zero over a turn, so it leaves nothing. A burst brighter on one side has
$\dd\matter E/\dd^2\hat n' = (\matter E/4\pi)(1 + a\cos\theta')$, with $a$ a pure number. Since $\hat n' = \cos\beta\,\hat
N + \sin\beta\,(\cos\psi\,\vect e_1 + \sin\psi\,\vect e_2)$,

$$\cos\theta' = \hat n'\cdot\hat z = \cos\theta\cos\beta + \sin\theta\sin\beta\cos\psi ,$$

a constant plus a multiple of $\cos\psi$, and $\cos\psi\cos2\psi$ also averages to zero over a turn. So a dipole leaves
no memory, exactly.

**A burst stronger along its axis.** The pattern is $(\matter E/4\pi)[1 + q\,P_2(\cos\theta')]$, with chapter
[2.2](/tutorial/outside/spherical-harmonics/#the-patterns-symmetric-about-an-axis-are-the-legendre-polynomials-and-the-inverse-distance-generates-them)'s
$P_2(x) = \tfrac12(3x^2 - 1)$ and $\sym{burst-asymmetry}{q}$ the burst's **asymmetry**, a pure number.[^q] The total is
still $\matter E$, because $P_2$ averages to zero over the sphere. The constants give no memory, and the square of
$\cos\theta'$ has three terms:

$$\begin{aligned}\cos^2\theta' &= \cos^2\theta\cos^2\beta\\ &\quad + 2\sin\theta\cos\theta\sin\beta\cos\beta\cos\psi\\
&\quad + \sin^2\theta\sin^2\beta\cos^2\psi .\end{aligned}$$

Against $\cos2\psi$ over a turn, the first averages to zero and so does the second, which holds $\cos\psi\cos2\psi$. Only
the third survives, with the factor $\tfrac32q$ of $P_2$. Its integrals are

$$\begin{gathered}\int_0^{2\pi}\cos^2\psi\cos2\psi\,\dd\psi = \frac\pi2 ,\\ \int_{-1}^1(1 - v^2)(1 + v)\,\dd v =
\frac43 ,\end{gathered}$$

with $v = \cos\beta$ and $\sin^2\beta = 1 - v^2$. So

$$\boxed{\;\begin{aligned}\Delta\field h_+ &= \frac{2G}{c^4r}\,\frac{q\matter
E}{4\pi}\cdot\frac32\sin^2\theta\cdot\frac\pi2\cdot\frac43\\ &= \frac{qG\matter E}{2c^4r}\sin^2\theta
,\end{aligned}\;}$$

with $\Delta\field h_\times = 0$, because the pattern is the same at $\psi$ and $-\psi$. This is the paper's

{{paper eq:burst-memory}}

**A number.** A core collapse sends out about $3\times10^{46}$ J in neutrinos, a sixth of a solar mass (chapter 6.4).
From 10 kpc, $3.1\times10^{20}$ m, with $q = 0.01$, the memory seen from the side is $4.0\times10^{-21}$, the paper's
$4\times10^{-21}$, four times the $10^{-21}$ of LIGO's waves. **A limit.** With $q = 0$ the burst is a sphere.

**What it means.** The factor $\cos2\psi$ keeps only the parts of a pattern that vary at least as fast as
$\cos^2\psi$ around the camera's line. A pattern of degree $\ell$ in $\cos\theta'$ holds powers of $\cos\psi$ up to the
$\ell$th, so only the quadrupole and higher degrees leave memory. A narrow jet holds every degree, so it leaves memory.

## The waves' own energy leaves a memory too

We want the paper's [](/paper/#eq:merger-memory). Gravitational waves carry energy, by the second section, and
momentum along their travel, as light does, so the waves of a merger are themselves a burst. We state, without proof,
that their energy enters the paper's [](/paper/#eq:memory) as any other energy does [@Christodoulou1991; @Thorne1992].
This is the **nonlinear memory**, made by the waves; the **linear memory** of the last section is made by matter or
neutrinos.

**The pattern.** The axis $\hat z$ is now the orbit's axis. By chapter
[5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on), averaged over an orbit, the power toward
the angle $\theta'$ from it is $(1 + 6\cos^2\theta' + \cos^4\theta')/8$ of the power along the axis, and its average over
the sphere is two fifths. So if $\sym{radiated-energy}{\matter{\Delta E}}$ is the energy radiated, in joules,

$$\frac{\dd\matter E}{\dd^2\hat n'} = \frac{5\matter{\Delta E}}{8\pi}\cdot\frac{1 + 6\cos^2\theta' + \cos^4\theta'}8 .$$

**The integral.** The camera's angle $\theta$ from the axis is chapter 5.4's inclination $\sym{inclination}{\iota}$, and
$\vect e_1$ lies along the axis as it is seen on the sky. In [](#eq:memory-axes) the constant gives nothing,
$\cos^2\theta'$ gives $(2\pi/3)\sin^2\iota$ by the last section's integrals, and $\cos^4\theta'$ gives
$(4\pi/15)\sin^2\iota\,(2 + \cos^2\iota)$ (box below). Adding,

$$\begin{aligned}\Delta\field h_+ &= \frac{2G}{c^4r}\,\frac{5\matter{\Delta E}}{64\pi}\Bigl[4\pi +
\frac{4\pi}{15}(2 + \cos^2\iota)\Bigr]\sin^2\iota\\ &= \frac{2G}{c^4r}\,\frac{5\matter{\Delta E}}{64\pi}\,\frac{4\pi}{15}\,
(17 + \cos^2\iota)\sin^2\iota ,\end{aligned}$$

and the factors $2\cdot5\cdot4/(64\cdot15) = 1/24$ leave

$$\boxed{\;\Delta\field h_+ = \frac{G\matter{\Delta E}}{24c^4r}\,\sin^2\iota\,\bigl(17 + \cos^2\iota\bigr) ,\;}$$

the paper's equation, the shape found by A. G. Wiseman and C. M. Will [@WisemanWill1991]:

{{paper eq:merger-memory}}

::: derivation
### The $\cos^4\theta'$ part

With $\hat z = \cos\iota\,\hat N + \sin\iota\,\vect e_1$, $\cos\theta' = \cos\iota\cos\beta + \sin\iota\sin\beta\cos\psi$.
In its fourth power only the terms with $\cos^2\psi$ and $\cos^4\psi$ survive the turn against $\cos2\psi$:

$$\begin{gathered}6\cos^2\iota\sin^2\iota\,\cos^2\beta\sin^2\beta\cos^2\psi\\ {}+ \sin^4\iota\,\sin^4\beta\cos^4\psi
.\end{gathered}$$

Over a turn, $\cos^4\psi\cos2\psi$ averages to the same $\pi/2$ as $\cos^2\psi\cos2\psi$, because $\cos^4\psi =
\tfrac38 + \tfrac12\cos2\psi + \tfrac18\cos4\psi$. With $v = \cos\beta$, the factor $1 + v$ splits each integral in two,
and the part with $v$ adds nothing, because there $v$ multiplies an even function of $v$ and the range is $-1$ to $1$.
So $\int v^2(1 - v^2)(1 + v)\,\dd v = \tfrac23 - \tfrac25 = \tfrac4{15}$ and $\int(1 - v^2)^2(1 + v)\,\dd v = 2 -
\tfrac43 + \tfrac25 = \tfrac{16}{15}$. So the part is

$$\begin{aligned}&\frac\pi2\Bigl(6\cdot\frac4{15}\cos^2\iota\sin^2\iota + \frac{16}{15}\sin^4\iota\Bigr)\\ &\quad=
\frac{4\pi}{15}\sin^2\iota\,(2 + \cos^2\iota) ,\end{aligned}$$

using $3\cos^2\iota + 2\sin^2\iota = 2 + \cos^2\iota$.
:::

**Checks.** Seen face-on, $\iota = 0$, the pattern is the same all round the line of sight and leaves nothing. The
memory is largest edge-on, $\tfrac{17}{24}G\matter{\Delta E}/c^4r$, where the oscillating wave carries eight times less
power (chapter 5.4), as the paper's Figure [](/paper/#fig:memory), panel (a), shows. The paper's [](/paper/#eq:memory),
summed numerically over the sky, agrees to $10^{-14}$.

**A number.** The first merger that LIGO detected radiated about three solar masses, $5.4\times10^{47}$ J, from 410
Mpc. Seen edge-on, which it was not, it would leave $2.5\times10^{-22}$, a quarter of the $10^{-21}$ of chapter 7.6's
waves; at its inclination, near 150°, it leaves about $6.5\times10^{-23}$. Both are estimates, because the last orbits
and the merger do not keep the pattern of a slow pair.

**The spin memory (stated).** The paper's **spin memory** is a lasting change not in the strain but in its time
integral $\int\field h\,\dd t$, the strain added up over time. For a pair whose orbit does not tilt it goes as
$\sin^2\iota\cos\iota$, so it changes sign between the two sides of the orbit and records which way the pair turned,
which the memory above, the same at $\iota$ and $180° - \iota$, cannot.

{{paper fig:memory}}

## A camera that reads the tide sees the memory as a burst that does not add up to nothing

We want the memory as a pixel reads it. By chapter 7.6 the tide of a wave is $\sym{tidal-tensor}{\curv\tE}_{ij} =
-\tfrac12\ddot{\field h}_{ij}$. Before the burst the strain is constant, and after it the strain is constant again,
larger by $\Delta\field h_{ij}$, so $\dot{\field h}_{ij}$ is zero at both ends. We integrate the tide from a time $t_1$
before the burst to a time $t_2$ after it, once, and then a second time, from $t_1$ to each $t$ and then over $t$:

$$\begin{gathered}\int_{t_1}^{t_2}\curv\tE_{ij}\,\dd t = -\tfrac12\bigl[\dot{\field h}_{ij}\bigr]_{t_1}^{t_2} = 0 ,\\
\int_{t_1}^{t_2}\!\!\int_{t_1}^{t}\curv\tE_{ij}\,\dd t'\,\dd t = -\tfrac12\,\Delta\field h_{ij} \neq 0
.\end{gathered}$$

So the memory is a burst of tide whose integral vanishes and whose double integral does not, the paper's "burst of
$\tE$ whose second time integral does not return to zero". Between two free balls at rest before the burst,
chapter 7.6's $\delta\xi_i = \tfrac12\field h_{ij}\xi_j$ leaves a change of separation $\tfrac12\Delta\field
h_{ij}\xi_j$ that stays (Figure [](#fig:memory-step)). **A number.** The supernova's $4.0\times10^{-21}$ moves balls
4 km apart, along $\vect e_1$, by $8\times10^{-18}$ m for good, about a two-hundredth of a proton's width.

![Look first at the right end of the upper line: after the burst the strain stays at a new level. The tide below
starts and ends at zero, and its integral from $t_1$ to $t_2$ is zero too, but integrated twice it leaves
$-\tfrac12\Delta\field h_+$, so two free balls end farther apart. Schematic.](tut-memory-step){#fig:memory-step}

::: try {#memory-pattern}
On the left, the pattern in which a burst sends out its energy, drawn about its axis $\hat z$, with the camera's
direction $\hat N$ as an arrow you can turn. On the right, the memory that the same burst leaves at every camera
direction in that plane, in units of $4G\matter E/c^4r$ as in panel (b) of the paper's Figure [](/paper/#fig:memory).
Buttons choose one narrow jet, two opposite jets sharing the energy, a uniform sphere, a dipole, the pattern $1 +
qP_2$ and a merger's waves; sliders set the dipole's lopsidedness and $q$. The readouts give $\Delta\field h_+$ and
$\Delta\field h_\times$ from [](#eq:memory-axes), summed over the sky, beside the closed form where there is one.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, choose
the merger's pattern and turn the camera from face-on to edge-on: say why the memory grows as the oscillating wave
weakens.
:::

::: check
### Q

How much energy does the second section's wave, of strain amplitude $10^{-21}$ at 100 Hz, hold in each cubic metre?
Compare it with sunlight at the Earth, $1.4\unit{kW\,m^{-2}}$.

### A

$\matter{\mathcal U} = F/c = 5.3\times10^{-12}\unit{J\,m^{-3}}$. Sunlight holds $4.7\times10^{-6}\unit{J\,m^{-3}}$,
nearly a million times more.

### Q

In the heat balance the viscosity cancels. Why is that a good sign?

### A

The energy found then belongs to the wave alone. A wave has its energy before it meets any medium, so every medium,
however viscous, must give the same answer.

### Q

Why does an explosion that sends its energy out evenly in all directions leave no memory?

### A

Seen from any direction, the memory weighs the pattern by $\cos2\psi$ around the camera's line, and a uniform pattern
averages that to zero. Only the quadrupole and higher parts of a pattern survive.
:::

**The idea to keep: a wave crossing a viscous medium shears it at half the rate of its strain, so the medium heats and
the wave fades at $16\pi G\matter\eta/c^2$, Hawking's rate. Since the heat comes from the wave, the wave carries
$c^3\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\rangle/16\pi G$ through each square metre, whatever the medium.
A burst that carries energy unevenly away, waves included, leaves the camera permanently stretched: the memory.**

::: problems
### Practice

For honey, with $\matter\eta \approx 10\unit{Pa\,s}$ at the frequencies where that value holds, find $\alpha$ and the
attenuation length. Then say why honey "need not glow more than water" (the paper's Section VI) although it absorbs ten
thousand times more at low frequency.

::: solution
$\alpha = 16\pi G\times10/c^3 = 1.2\times10^{-33}\unit{m^{-1}}$, and $1/\alpha = 8.0\times10^{32}$ m, or
$8.5\times10^{16}$ light-years. The glow comes from the friction at the frequencies of heat, about $10^{13}$ cycles a
second, and there honey's slow rearrangement is frozen: by chapter
[4.4](/tutorial/response/viscosity/#at-fixed-stiffness-the-more-viscous-liquid-has-less-friction-at-the-frequencies-of-heat)'s
tail $\matter\mu_\infty^2/\matter\eta_0\omega^2$, at a fixed stiffness the more viscous liquid has the less friction
there.
:::

### Stretch

Combine this chapter with chapter 2.2. A burst has the pattern $(\matter E/4\pi)[1 + q_3P_3(\cos\theta')]$, with
$P_3(x) = \tfrac12(5x^3 - 3x)$ and $q_3$ a pure number. Show that its memory is $\Delta\field h_+ = (q_3G\matter
E/2c^4r)\sin^2\theta\cos\theta$, and say why it changes sign between the two halves of the sky while a dipole leaves
nothing.

::: solution
The term $-\tfrac32x$ is a dipole and leaves nothing. In $\tfrac52x^3$, with $x = \cos\theta\cos\beta +
\sin\theta\sin\beta\cos\psi$, only $3\cos\theta\sin^2\theta\,\cos\beta\sin^2\beta\cos^2\psi$ survives the turn, which
gives $\pi/2$, and $\int v(1 - v^2)(1 + v)\,\dd v = \tfrac4{15}$. So [](#eq:memory-axes) gives $\Delta\field h_+ =
(2G/c^4r)(q_3\matter E/4\pi)\cdot\tfrac52\cdot3\cdot\tfrac4{15}\cdot\tfrac\pi2\cos\theta\sin^2\theta$, the result.
$P_3$ is odd, brighter toward one pole, so the memory changes sign with $\cos\theta$; its degree is three, so it has
the $\cos^2\psi$ part that a dipole lacks.
:::

### The paper

Derive the paper's [](/paper/#eq:damped) and [](/paper/#eq:alpha) from the field equation with a viscous stress, and
reproduce Section VI's $10^{-37}\unit{m^{-1}}$ and "nearly $10^{21}$ light-years". Then derive the paper's
[](/paper/#eq:burst-memory) from its [](/paper/#eq:memory), and Section XI's $4\times10^{-21}$ for $q = 0.01$.

::: solution
The first section's four steps give [](#eq:hawking), and $\alpha = \Gamma/c$ gives the numbers for water. The steps to
[](#eq:memory-axes), with the pattern $1 + qP_2$, give the paper's [](/paper/#eq:burst-memory) and $4.0\times10^{-21}$
for $3\times10^{46}$ J at 10 kpc.
:::
:::

::: paper
- [Section VI](/paper/#sec:thermal), [*Absorption*](/paper/#par:absorption): the paper's [](/paper/#eq:damped) and
  [](/paper/#eq:alpha), "the result found by Hawking", $10^{-37}\unit{m^{-1}}$ and $10^{21}$ light-years.
- [Section V](/paper/#sec:waves): the power and the paper's [](/paper/#eq:dumbbell), through chapter 7.7, with the flux
  now derived.
- [Section XI](/paper/#sec:vistas): [*Memory*](/paper/#par:memory), with the paper's [](/paper/#eq:memory) and
  [](/paper/#eq:merger-memory) and the spin memory; [*An exploding star*](/paper/#par:an-exploding-star), with the jets,
  the paper's [](/paper/#eq:burst-memory) and $4\times10^{-21}$; Figure [](/paper/#fig:memory); and [*Scattering,
  earthquakes and tails*](/paper/#par:scattering-earthquakes-and-tails), with $(Gm/c^2)^2$ and
  $3\times10^{-51}\unit{m^2\,sr^{-1}}$.
:::

::: deeper
- The GR course's [section 18.7](https://neovand.github.io/general-relativity/chapter-18.html#18-7-wave-energy-lives-one-order-beyond-the-linear-equation)
  finds a wave's energy at second order in Einstein's equation, and its
  [section 15.5](https://neovand.github.io/general-relativity/chapter-15.html#15-5-where-gravitational-energy-lives)
  explains why the energy of gravity has no place within a wavelength.
- S. W. Hawking, "Perturbations of an expanding universe" [@Hawking1966]: the damping by a viscous medium, in its home.
- K. S. Thorne, "Gravitational-wave bursts with memory: the Christodoulou effect" [@Thorne1992]: the paper's
  [](/paper/#eq:memory), and the nonlinear memory as the linear one with the waves' energy as its source.
- M. Favata, "The gravitational-wave memory effect" [@Favata2009]: a review, with the memory of mergers.
- R. A. Isaacson, "Gravitational radiation in the limit of high frequency. II", *Physical Review* 166, 1272 (1968):
  the averaged energy of the waves.
:::

[^press]: A shear modulus $\matter\mu$ changes the square of the wave's wavenumber by the fraction $16\pi
    G\matter\mu/c^2\omega^2$ (W. H. Press's result, stated in chapter
    [5.5](/tutorial/waves/radiance/#matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact)):
    $6.7\times10^{-21}$ for chapter 5.5's steel, with $\matter\mu = 71$ GPa, at 100 Hz.

[^gauge]: The viscous stress is transverse and trace-free, like the strain, so its divergence $\partial_j\matter
    T_{ij}$ vanishes: the medium's momentum is conserved and harmonic gauge survives.

[^letters]: A bare $\Gamma$ is a damping rate, as in chapters 4.1 and 5.1; Christoffel symbols carry indices. In the
    matter colour $\matter\eta$ is the viscosity; the metric $\field\eta_{\mu\nu}$ carries indices, and chapter 6.1's
    rapidity is in the observer colour.

[^u]: Chapters 6.5 and 7.3 use this letter, in this colour, for the energy density of light; here it is the wave's.
    The matter colour fits because an energy density is a source of gravity, as the waves' is in the fifth section.

[^peters]: The paper states it in the same way: "the cross-section per unit solid angle of a body of mass $m$, at
    large angles, is of order $(Gm/c^2)^2$".

[^step]: The step has the transform $\int_0^\infty e^{i\omega t}\,\dd t = i/\omega$, taken with a small damping
    $e^{-\epsilon t}$ that makes the integral converge.

[^turn]: By chapter [5.4](/tutorial/waves/polarization/#a-wave-across-the-line-of-sight-has-two-patterns-of-stretch),
    turning the axes by an angle $\varphi$ about $\hat N$ turns $\field h_+ + i\field h_\times$ by the angle $2\varphi$
    in the complex plane, so only zero is unchanged by every turn.

[^q]: This $q$ is the paper's letter in [](/paper/#eq:burst-memory). It is not chapter 3.7's $q = kz$.
