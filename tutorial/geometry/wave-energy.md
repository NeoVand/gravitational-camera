---
id: '7.8'
title: 'Wave energy, damping by viscosity, and memory'
question: 'How much energy does a gravitational wave carry, how does friction take it, and what does a burst of waves leave behind when it has passed?'
part: '7'
requires: ['2.2', '4.4', '5.1', '5.4', '6.4', '6.5', '7.4', '7.6', '7.7']
paper: [sec:thermal, eq:damped, eq:alpha, sec:no-lens, eq:index, eq:optics-bound, sec:waves, sec:vistas, eq:memory, eq:burst-memory, eq:merger-memory, fig:memory, fig:closed-furnace]
figures: [fig:memory]
live: [memory-pattern]
depth: A
---

In water, a gravitational wave would have to travel nearly $10^{21}$ light-years before losing much of its energy. The
visible universe is about $10^{11}$ light-years across. How much energy does a wave carry, how does friction take it,
and what does a burst of waves leave behind when it has passed? The heat that friction makes will answer the first two
questions, and the energy that a burst carries away the third.[^first]

::: plain
A gravitational wave that passes through water or rock stretches it one way and squeezes it the other, so neighbouring
layers slide past one another. Friction inside the matter, its viscosity, resists the sliding and turns a little of
the wave's energy into heat. The wave fades, but extremely slowly.

The heat has to come from the wave, so it tells us how much energy the wave carries: about a milliwatt through each
square metre for a wave of the strength LIGO detects, whatever the matter.

When a burst of radiation carries energy away more strongly in some directions than in others, the strain it leaves
behind does not return to zero. Free objects it passes end up slightly farther apart, or closer together, for good.
This lasting change is the memory, and the waves of a merger, which carry energy too, leave one of their own.
:::

## Viscosity fades a wave at Hawking's rate

Here $\sym{viscosity}{\matter\eta}$ is the shear
viscosity of section
[4.4](/tutorial/response/viscosity/#viscosity-is-a-stress-that-answers-how-fast-a-shape-changes), in pascal seconds. We
assume that **the medium is carried by the wave**: it has no stiffness against shear that matters at the wave's
frequency, so its pieces move as free balls do.[^press] We also assume that **its friction is $\matter\eta$ at the
wave's frequency**, $\mathrm{Re}\,\matter\eta(\omega)$ of section 4.4. In this section $\field h_{ij}$ is the wave's
strain in the TT gauge of
[section 7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical), and a dot
is a derivative in time.

**The shear.** By section
[7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain), the wave moves
free balls by $\tfrac12\field h_{ij}\xi_j$, so a medium carried by it is strained by $\tfrac12\field h_{ij}$ and sheared
at the rate $\tfrac12\dot{\field h}_{ij}$. That rate has no trace, because the strain has none, so it is section 4.4's
rate of shear itself, $\dot{\tilde u}_{ij} = \tfrac12\dot{\field h}_{ij}$.

**The stress.** The viscous stress of section 4.4, the force per area across a face, is $2\matter\eta\,\dot{\tilde
u}_{ij} = \matter\eta\,\dot{\field h}_{ij}$, which 4.4 called $\matter T_{ij}$, counting a pull as positive. Einstein's
equation reads instead the $\sym{stress-energy-tensor}{\matter T}_{ij}$ of
[section 6.5](/tutorial/relativity/stress-energy/#in-the-stresses-the-sign-is-that-of-a-flow-of-momentum), the flow of
momentum, which counts a push as positive and so is minus 4.4's stress for matter at rest. With 6.5's sign, used from
here on, the medium adds to the source

$$\matter T_{ij} = -\matter\eta\,\dot{\field h}_{ij} ,$$

in pascals.

**The field equation.** The field equation of
[section 7.4](/tutorial/geometry/linearized-gravity/#in-harmonic-gauge-einsteins-equation-is-a-wave-equation-for-each-component)
holds in TT gauge, where reversing the trace changes nothing, $\field{\bar h}_{ij} = \field h_{ij}$.[^gauge] With
$\Box = -c^{-2}\partial_t^2 + \nabla^2$ it reads

$$\Box\field h_{ij} = -\frac{16\pi G}{c^4}\,\matter T_{ij} .$$

With the medium's stress as the source,

$$-\frac1{c^2}\,\ddot{\field h}_{ij} + \nabla^2\field h_{ij} = \frac{16\pi G\matter\eta}{c^4}\,\dot{\field h}_{ij} .$$

We multiply by $-c^2$ and collect the terms on one side:

$$\boxed{\;\ddot{\field h}_{ij} + \frac{16\pi G\matter\eta}{c^2}\,\dot{\field h}_{ij} - c^2\nabla^2\field h_{ij} = 0
,\;} \label{eq:hawking}$$

a damped wave equation. The units agree: $G\matter\eta$ is in $\mathrm{m^2\,s^{-3}}$, so $16\pi G\matter\eta/c^2$ is in
$\mathrm{s^{-1}}$, a rate.

**Hawking's rate.** Equation [](#eq:hawking) is the damped wave equation of section
[5.1](/tutorial/waves/wave-equation/#a-damping-term-makes-a-wave-fade-at-a-fixed-rate-per-metre) for each entry, with
the damping rate $\sym{damping-rate}{\Gamma} = 16\pi G\matter\eta/c^2$.[^letters] By section 5.1 the amplitude of such a
wave falls at the rate $\Gamma/2 = 8\pi G\matter\eta/c^2$, the energy at $\Gamma$, and per metre the energy falls at
$\alpha = \Gamma/c$. So the absorption coefficient is

$$\boxed{\;\sym{absorption-coefficient}{\alpha} = \frac{16\pi G\matter\eta}{c^3} ,\;}$$

in $\mathrm{m^{-1}}$, a result of Hawking [@Hawking1966].

**Numbers.** Water's everyday viscosity, $10^{-3}\unit{Pa\,s}$, gives $\Gamma = 3.7\times10^{-29}\unit{s^{-1}}$ and
$\alpha = 1.2\times10^{-37}\unit{m^{-1}}$. The energy falls by the factor $e$ after $1/\alpha = 8.0\times10^{36}$ m, or
$8.5\times10^{20}$ light-years, so the wave would cross the visible universe eight or nine billion times. With
$\matter\eta = 0$, [](#eq:hawking) is the free wave equation of section 7.6. Matter is transparent to gravitational
waves (Figure [](#fig:viscous-slab)), and the third section shows how nearly.

![Look first at the envelope: inside the slab the wave shears the medium at half the rate of its strain, the friction
turns some of its energy into heat, and the amplitude falls. The fall is exaggerated about $10^{37}$ times for a slab a
metre thick.](tut-viscous-slab){#fig:viscous-slab}

## The heat comes from the wave, so the wave carries energy

The friction of the last section makes heat, which can come only from the wave. We assume that **energy is
conserved**, so that the heat made in each cubic metre each second equals the energy the wave loses there, and that
**the damping is weak**, $\Gamma \ll \omega$ for the angular frequency $\omega$, so that we may average over a cycle,
written $\langle\;\rangle$ as in section 5.1.

**The heat.** The heat per volume per second of
[section 4.4](/tutorial/response/viscosity/#friction-turns-the-work-of-a-shear-into-heat-more-at-higher-frequency),
$2\matter\eta\,\dot{\tilde u}_{ij}\dot{\tilde u}_{ij}$, with $\dot{\tilde u}_{ij} = \tfrac12\dot{\field h}_{ij}$, is

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

The second form holds because $\field h_{ij}\field h_{ij} = 2(\field h_+^2 + \field h_\times^2)$, since each of the
[patterns](/tutorial/waves/polarization/#a-wave-across-the-line-of-sight-has-two-patterns-of-stretch) of section 5.4
has $e^A_{ij}e^A_{ij} = 2$ and the two are orthogonal. The units agree: $c^2/G$ is in $\mathrm{kg\,m^{-1}}$, and times
$\mathrm{s^{-2}}$ it is $\mathrm{J\,m^{-3}}$. The viscosity cancels, as it must: a wave carries its energy before it
meets any medium, so water, honey or any other gives the same answer.

**The flux.** The wave moves at $c$ and carries its energy with it, as the shear wave of section 5.1 did, so the energy
that crosses each square metre each second is $F = c\,\matter{\mathcal U}$:

$$\boxed{\;F = \frac{c^3}{16\pi G}\,\bigl\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\bigr\rangle ,\;}
\label{eq:wave-flux}$$

in $\mathrm{W\,m^{-2}}$. This is the **energy flux** that sections
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed) and
[5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on) stated, now derived, and it is the
$c^3\langle\dot{\field h}^{\rm TT}_{ij}\dot{\field h}^{\rm TT}_{ij}\rangle/32\pi G$ that
[section 7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole) added
over a sphere to find the radiated power $\sym{radiated-power}{P}$.

**A number.** A plus wave of strain amplitude $10^{-21}$ at 100 Hz has $\langle\dot{\field h}_+^2\rangle =
\tfrac12\omega^2\field h_+^2$ with $\omega = 628\unit{s^{-1}}$, so it carries $F = 1.6\times10^{-3}\unit{W\,m^{-2}}$.
Yet the same wave moves the end of one of LIGO's 4 km arms by only $2\times10^{-18}$ m. A milliwatt through each square
metre buys a stretch of one part in $10^{21}$, because the factor $c^3/G$, $4.0\times10^{35}\unit{kg\,s^{-1}}$, is so
large: space is very stiff.

**The power.** On the axis of section 7.7's dumbbell at $r = 10^4$ km, the
[two strains](/tutorial/geometry/quadrupole-formula/#seen-along-its-spin-a-rotors-two-polarizations-share-one-amplitude)
of amplitude $\field A = 1.67\times10^{-47}$ at the angular frequency $2\Omega = 201\unit{s^{-1}}$ give
$c^3(2\Omega)^2\field A^2/16\pi G = 9.1\times10^{-56}\unit{W\,m^{-2}}$, and so does the power: the axis receives $5/2$
times the average flux $P/4\pi r^2$, since by section 5.4 the average is two fifths of the flux there.

::: gap
**Where the energy of a wave lives.** Einstein's equation gives the same energy without any matter, at second order
in $\field h$: R. A. Isaacson showed in 1968 that the waves, averaged over a region several wavelengths across, act on
the background as a source with the energy density of [](#eq:wave-energy). The average is needed because the energy
is built from first derivatives of the metric, and a falling observer can make all of them vanish at any one point
([section 7.1](/tutorial/geometry/metric/#falling-removes-the-fields-first-derivatives-at-a-point-but-not-its-second)).
This sketch skips the second-order expansion and the averaging; the GR course's section 18.7, in Go deeper, gives both.
:::

## Matter barely touches the waves

Could a scene be lit with gravitational waves, as a room is lit by a lamp, and seen by what it sends back? That would
need matter to scatter the waves. A **scattering cross-section** is the scattered power divided by the flux that falls
on the body, an area of wave front. For the $1/r$ field of a mass the total is infinite, because waves that pass far
away are still turned through small angles, as in Rutherford scattering. So we count the scattering into each
direction. A solid angle is the area that a patch of directions covers on a sphere of radius one (section
[1.3](/tutorial/newton/gauss-and-poisson/#solid-angle-measures-how-large-a-patch-looks)), measured in steradians; the
whole sky is $4\pi$ sr. The **differential cross-section** is the cross-section per steradian, in
$\mathrm{m^2\,sr^{-1}}$. For a body of mass $\matter m$, at large angles, it is of order $(G\matter m/c^2)^2$ per
steradian, a result of P. C. Peters [@Peters1976] stated here without proof.[^peters] It is plausible because
$G\matter m/c^2$, half the Schwarzschild radius, is the only length that gravity makes from a mass.

**The estimate.** For a person of 70 kg, $G\matter m/c^2 = 5.2\times10^{-26}$ m, so the cross-section is about
$2.7\times10^{-51}\unit{m^2}$ per steradian. The person's outline, about $0.7\unit{m^2}$, is $10^{50}$ times larger.
Absorption does more, but still almost nothing. By the first section a wave loses the fraction $\alpha$ of its flux in
each metre, so a volume $V$ absorbs the power $\alpha FV$, the flux that falls on the area $\alpha V$. For 70 kg of
water, $0.07\unit{m^3}$, that area is $1.25\times10^{-37}\unit{m^{-1}}\times 0.07\unit{m^3} = 8.7\times10^{-39}\unit{m^2}$.

So a scene cannot be illuminated with gravitational waves, and every picture the camera makes is made by what the scene
sends out or how it pulls. A warm body does send out a faint glow, set by the same friction, because by
[Kirchhoff's law](/tutorial/waves/radiance/#a-warm-bodys-glow-over-its-absorption-is-the-radiance-of-an-enclosure-at-its-temperature)
a body that absorbs also emits; section 10.3 bounds this glow of a closed furnace.[^scatter]

## The pull of matter slows a wave very slightly, and its stiffness reflects almost nothing

A glass lens bends light because light is slower in glass, and a mirror returns it because the speed changes sharply at
its face. Both are set by the [refractive
index](/tutorial/waves/wave-equation/#a-medium-can-slow-a-wave-and-its-refractive-index-measures-how-much)
$\sym{refractive-index}{n} = ck/\omega$ of section 5.1, a pure number, with $k$ the wavenumber in $\mathrm{m^{-1}}$.
Matter changes a gravitational wave's wavenumber in two ways: it pushes back on the shear the wave makes, and it pulls
on the wave by its own gravity. The first follows from the first section in two lines.[^optics]

**Stiffness.** We assume, as in the first section, that **the medium is carried by the wave**. For a solid this holds
because its elastic force on each piece, against that piece's inertia, is smaller by $(c_T/c)^2$, with $c_T$ the speed
of shear sound of [section 4.3](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound): $10^{-10}$ for
steel. So the medium is strained by $\tfrac12\field h_{ij}$, and Hooke's law of section 4.3 gives the stress
$2\matter\mu\cdot\tfrac12\field h_{ij} = \matter\mu\field h_{ij}$, with $\sym{shear-modulus}{\matter\mu}$ the shear
modulus in pascals. With 6.5's sign the medium adds $\matter T_{ij} = -\matter\mu\field h_{ij}$ to the source, and the
steps of the first section give

$$\ddot{\field h}_{ij} + \frac{16\pi G\matter\mu}{c^2}\,\field h_{ij} - c^2\nabla^2\field h_{ij} = 0 .$$

A stress in step with the strain adds a term in $\field h$, where friction, in step with the strain's rate, added one in
$\dot{\field h}$. For a plane wave $e^{i(kz - \omega t)}$ this reads $-\omega^2 + 16\pi G\matter\mu/c^2 + c^2k^2 = 0$, so

$$\boxed{\;k^2 = \frac{\omega^2}{c^2}\Bigl(1 - \frac{16\pi G\matter\mu}{c^2\omega^2}\Bigr) ,\;} \label{eq:press}$$

the result of W. H. Press [@Press1979]. The units agree: $G\matter\mu/c^2$ is in $\mathrm{s^{-2}}$, like $\omega^2$.
Stiffness lowers the index, $n - 1 = -8\pi G\matter\mu/c^2\omega^2$, which for steel ($\matter\mu = 7.1\times10^{10}$
Pa) at 1 kHz is $-3.4\times10^{-23}$. Below the angular frequency $(16\pi G\matter\mu/c^2)^{1/2}$, $k^2$ is negative and
the wave fades with depth instead of travelling, like the fine ripple of section
[5.1](/tutorial/waves/wave-equation/#a-ripple-finer-than-a-wavelength-across-a-plane-fades-instead-of-travelling); for
steel that frequency is $5.1\times10^{-8}\unit{s^{-1}}$, one cycle in 3.9 years.

**A free gas.** Matter with no stiffness still carries a stress if its particles move: the momentum flux
$\matter\rho\langle v_kv_l\rangle$ of [section 6.5](/tutorial/relativity/stress-energy/#dust-a-fluid-and-a-beam-of-light-each-fill-the-table),
with $\matter\rho$ the density and $\langle\;\rangle$ an average over the particles. A wave turns each moving particle's
velocity by an amount of order $\field h$ times its speed, so the gas answers like a solid of modulus about
$\matter\rho\langle v^2\rangle$. Its term is smaller than the one from gravity, below, by a factor of order $(v/c)^2$,
as R. Flauger and S. Weinberg found for the cold dark matter of a galaxy [@FlaugerWeinberg2018].

**Gravity.** Matter also slows a wave by its own pull. We find the index this gives where the geometry is simplest: a
slab of matter, unbounded across, which the wave crosses at right angles. We assume that **the field is weak**, that
**the matter has no stiffness and stays at rest**, with the pressure that holds it up negligible against $\matter\rho
c^2$, and that **the wave is short compared with the slab**.

- **The slab.** By [section 7.4](/tutorial/geometry/linearized-gravity/#a-static-source-gives-newtons-potential-in-time-and-in-space)
  its metric is $\field g_{00} = -(1 + 2\field\Phi/c^2)$ and $\field g_{xx} = \field g_{yy} = \field g_{zz} = 1 -
  2\field\Phi/c^2$, with the potential $\field\Phi(z)$ in $\mathrm{J\,kg^{-1}}$ and, inside, $\field\Phi'' = 4\pi
  G\matter\rho$ by Poisson's equation (section 1.3). A prime is a derivative with respect to $z$.
- **The wave.** A plus wave along $z$ adds $\field A(t, z)$ to $\field g_{xx}$ and $-\field A$ to $\field g_{yy}$, a
  pure number.
- **The order.** The wave feels the slab only through the products of $\field\Phi$ and $\field A$, which section 7.4's
  linear theory drops. We keep, in the curvature, every term of first order in each.

The box below computes the curvature to that order:

$$\begin{aligned}\tfrac12\bigl(\curv R_{xx} - \curv R_{yy}\bigr) &= \tfrac12\Bigl(\frac{\ddot{\field A}}{c^2} -
\field A''\Bigr)\\ &\quad - \frac{\field\Phi}{c^2}\Bigl(\frac{\ddot{\field A}}{c^2} + \field A''\Bigr) -
\frac{2\field\Phi'\field A'}{c^2} .\end{aligned}$$

Each term is in $\mathrm{m^{-2}}$. On the right of [section
7.3](/tutorial/geometry/einstein-equation/#einsteins-equation-ties-the-curvature-to-the-energy-and-stress-at-each-point)'s
trace-reversed equation, $\curv R_{\mu\nu} = (8\pi G/c^4)(\matter T_{\mu\nu} - \tfrac12\field g_{\mu\nu}\matter T)$,
matter at rest has $\matter T = -\matter\rho c^2$ and no momentum flux, so the $xx$ entry is $(4\pi G\matter\rho/c^2)\field
g_{xx}$, whose part in $\field A$ is $(4\pi G\matter\rho/c^2)\field A = \field\Phi''\field A/c^2$. We set the two equal and
multiply by 2. The terms in $\field A''$, $\field A'$ and $\field A$ combine into one second derivative:

$$\Bigl(1 - \frac{2\field\Phi}{c^2}\Bigr)\frac{\ddot{\field A}}{c^2} = \Bigl[\Bigl(1 + \frac{2\field\Phi}{c^2}\Bigr)\field
A\Bigr]'' .$$

We write $\psi = (1 + 2\field\Phi/c^2)\field A$, so that $\field A = (1 - 2\field\Phi/c^2)\psi$ to first order, and
take the time dependence $e^{-i\omega t}$:

$$\psi'' + K^2\psi = 0 ,\qquad K = \frac\omega c\Bigl(1 - \frac{2\field\Phi}{c^2}\Bigr) .$$

If $K$ were constant, $\psi$ would be $e^{iKz}$. It changes slowly, so we try $\psi = e^{iS(z)}$ with the local
wavenumber $q = S'$. Then $\psi'' = (iq' - q^2)\psi$, and

$$q^2 - iq' = K^2 .$$

We solve it in steps, $q = K + q_1 + q_2$, each smaller than the last by the change of $K$ over a wavelength. The first
step gives $2Kq_1 = iK'$, so $q_1 = iK'/2K$: an imaginary part, which makes the amplitude vary as $K^{-1/2}$ and adds
no phase. The second gives $2Kq_2 = iq_1' - q_1^2$. Here $q_1^2$ holds $\field\Phi'^2$, of second order, and drops, and
$iq_1' = -K''/2K$ to first order, so

$$q_2 = -\frac{K''}{4K^2} = \frac{\field\Phi''}{2c\,\omega} = \frac{2\pi G\matter\rho}{c\,\omega} ,$$

using $K'' = -2\omega\field\Phi''/c^3$ and $K^2 \approx \omega^2/c^2$. So the phase grows by $(\omega/c)(1 -
2\field\Phi/c^2)$ per metre plus $q_2$. The first part is the delay of the potential, the same time at every frequency,
which bends rays and makes a mass a lens (section
[5.5](/tutorial/waves/radiance/#matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact)).
The second, divided by $\omega/c$, is the refractive index of the matter itself:

$$\boxed{\;n - 1 = \frac{2\pi G\matter\rho}{\omega^2} ,\;} \label{eq:peters}$$

found by P. C. Peters [@Peters1974], who added the waves scattered by the masses of a thin sheet; he found no such term
for light. The units agree, since $G\matter\rho$ is in $\mathrm{s^{-2}}$. The index is half the trace of the tide inside
matter, $4\pi G\matter\rho$ (section [7.3](/tutorial/geometry/einstein-equation/#inside-matter-the-tide-has-a-part-fixed-by-the-matter-at-that-point)),
over $\omega^2$, and it tends to one as $\matter\rho \to 0$ or $\omega \to \infty$. For steel ($7850\unit{kg\,m^{-3}}$)
at 1 kHz it is $8.3\times10^{-14}$, where glass slows light by 0.5. The stiffness term is smaller still, by $4\matter\mu
/\matter\rho c^2 = 4(c_T/c)^2 = 4\times10^{-10}$. For a body of finite width the potential also varies across the ray,
which adds terms of the same order, so applied to a ball the index gives the phase to within a factor of order one.

**Reflection.** At a sharp face from empty space, where $k_1 = \omega/c$, into a solid with $k_2$ from [](#eq:press),
the wave is $e^{ik_1z} + r\,e^{-ik_1z}$ for $z < 0$, with $r$ the **reflection amplitude**, a pure number. The field
equation has no source concentrated on the face, so the strain and its slope are continuous there. The first makes the
wave $(1 + r)\,e^{ik_2z}$ for $z > 0$, and the second gives $k_1(1 - r) = k_2(1 + r)$, so $r = (k_1 - k_2)/(k_1 +
k_2)$, and
with $k_2 \approx k_1(1 - 8\pi G\matter\mu/c^2\omega^2)$,

$$\boxed{\;r = \frac{4\pi G\matter\mu}{c^2\omega^2} .\;}$$

It vanishes with the stiffness. Steel reflects $1.7\times10^{-23}$ of a 1 kHz wave's amplitude, and $r^2 =
2.8\times10^{-46}$ of its energy. The far face of a wall reflects $-r$, so a wall of any thickness returns at most twice
this.

**Press's mirror.** A mirror must reflect strongly, which needs $16\pi G\matter\mu/c^2\omega^2 \gtrsim 1$. It must also
be wider than the reduced wavelength $\bar\lambda = c/\omega$, or the wave goes round it, and larger than its own
Schwarzschild radius $r_s = 2G\matter M/c^2$ (section 5.5), or it is a black hole. For a ball of radius $R$, $R > r_s$
means $R^2 < 3c^2/8\pi G\matter\rho$, and with $R > c/\omega$ this needs $\omega^2 > 8\pi G\matter\rho/3$. With the first
condition, $\matter\mu > \matter\rho c^2/6$. A friction acts in the same way with $\omega\matter\eta$ in the place of
$\matter\mu$, since the stress $-\matter\eta\dot{\field h}$ is $i\omega\matter\eta\field h$. Up to a number of order
one, a gravitational mirror needs $\matter\mu > \matter\rho c^2$ or $\omega\matter\eta > \matter\rho c^2$, as Press
found [@Press1979]. Since $\matter\mu = \matter\rho c_T^2$, stiffness would need shear sound about as fast as light; steel
has $\matter\mu/\matter\rho c^2 = 1.0\times10^{-10}$. A steel ball as wide as the slowest wave it could reflect,
$5.8\times10^{15}$ m in radius, would have a Schwarzschild radius $1.7\times10^9$ times its own.

**The four optical constants of a ball.** For a uniform ball of radius $R$, compactness $\mathcal C = G\matter M/Rc^2$
and density $\matter\rho = 3\matter M/4\pi R^3$, crossed by a wave of reduced wavelength $\bar\lambda$:

- the index delays the wave across a diameter by $(n - 1)(\omega/c)\,2R = 4\pi G\matter\rho R/c\omega$, which is
  $3\mathcal C\bar\lambda/R$;
- with $\matter\mu = \matter\rho c_T^2$, the face reflects $r = 3\mathcal C(c_T/c)^2(\bar\lambda/R)^2$;
- with the friction $\mathrm{Re}\,\matter\eta = \matter\rho c_T^2/\omega Q$ of a solid of quality factor $Q$ (section
  [4.4](/tutorial/response/viscosity/#a-ringing-solids-friction-is-its-quality-factor)), the first section's $\alpha$
  gives the optical depth $2R\alpha = (24\mathcal C/Q)(c_T/c)^2(\bar\lambda/R)$;
- as a gravitational lens it has the focal ratio $N = 1/8\mathcal C$ (section 5.5).

After $\mathcal C$, every factor is below one for a body that can act on the wave at all: shear sound is slower than
light, and a body smaller than $\bar\lambda$ diffracts the wave instead of bending, reflecting or shadowing it.

**Absorption by an elastic body.** In a uniform solid the push of the wave on the matter, the divergence of the stress
$\matter\mu\field h_{ij}$, is zero, because the strain has no divergence; it survives only where $\matter\mu$ changes,
at the surface. F. J. Dyson used this to find the energy an elastic body takes from a wave [@Dyson1969], and L. Smolin
wrote the absorption of a body of length $L$ and mass $\matter M$ as $(G\matter M/Lc^2)(\lambda/L)^2(c_T/c)^3$, every
factor again below one [@Smolin1984; @Smolin1985]. He concluded that no stable matter absorbs or confines gravitational
waves over a broad band.

::: derivation
### The curvature to first order in the slab and in the wave

Write $\varphi = \field\Phi/c^2$, a pure number, $x^0 = ct$ and $\partial_0 = c^{-1}\partial_t$, and keep terms of first
order in $\varphi$, in $\field A$ and in their product. Section 7.1's formula gives the Christoffel symbols that enter:

$$\begin{aligned}\Gamma^0{}_{xx} &= \tfrac12(1 - 2\varphi)\,\partial_0\field A ,\\ \Gamma^z{}_{xx} &= \varphi' -
\tfrac12(1 + 2\varphi)\field A' ,\\ \Gamma^x{}_{xz} &= -\varphi' + \tfrac12(1 + 2\varphi)\field A' + \field A\varphi'
,\end{aligned}$$

and the sum $\Gamma^\alpha{}_{\alpha z} = \partial_z\ln\sqrt{-\field g} = -2\varphi'$, in which $\field A$ cancels because
the $xy$ block's determinant, $(1 - 2\varphi)^2 - \field A^2$, holds it only squared. The $yy$ symbols are these with
$\field A \to -\field A$. Section 7.3's contraction of [section 7.2's Riemann tensor](/tutorial/geometry/curvature-and-tides/#the-riemann-tensor-is-built-from-the-christoffel-symbols-yet-it-is-a-tensor) is $\curv
R_{\beta\delta} = \partial_\alpha\Gamma^\alpha{}_{\beta\delta} - \partial_\delta\Gamma^\alpha{}_{\beta\alpha} +
\Gamma^\alpha{}_{\alpha\sigma}\Gamma^\sigma{}_{\beta\delta} - \Gamma^\alpha{}_{\delta\sigma}\Gamma^\sigma{}_{\beta\alpha}$.
Nothing depends on $x$, so for $\beta = \delta = x$

$$\curv R_{xx} = \partial_0\Gamma^0{}_{xx} + \partial_z\Gamma^z{}_{xx} - 2\varphi'\,\Gamma^z{}_{xx} -
2\Gamma^x{}_{xz}\Gamma^z{}_{xx} ,$$

with a product $\Gamma^x{}_{x0}\Gamma^0{}_{xx}$ dropped, being of order $\field A^2$. The half-difference with $\curv
R_{yy}$ keeps the parts odd in $\field A$. The first two terms give $\tfrac12(1 - 2\varphi)\partial_0^2\field A -
\tfrac12(1 + 2\varphi)\field A'' - \varphi'\field A'$; the third gives $+\varphi'\field A'$; in the fourth, the odd part
of the product is $(-\varphi')(-\tfrac12\field A') + (\tfrac12\field A')\varphi' = \varphi'\field A'$, which gives
$-2\varphi'\field A'$. Adding,

$$\tfrac12\bigl(\curv R_{xx} - \curv R_{yy}\bigr) = \tfrac12(\partial_0^2\field A - \field A'') - \varphi(\partial_0^2\field
A + \field A'') - 2\varphi'\field A' ,$$

which is the display in the text. The wave adds nothing to $\Gamma^z{}_{00} = \varphi'$, so matter at rest stays at
rest, and its density is unchanged, since the determinant holds $\field A$ only squared. Exchanging $x$ and $y$
reverses $\field A$ and leaves the slab unchanged, so no other entry of the equation holds $\field A$ at this order.
:::

## A burst that carries energy away leaves the strain changed for good

A **burst** here is a brief release of energy carried by particles that move at nearly the speed of light, such as the
neutrinos of a collapsing star. By section
[6.4](/tutorial/relativity/energy-and-momentum/#light-has-no-rest-mass-but-two-beams-of-light-have-one), each carries
the momentum $\matter E/c$ along its direction of travel.

**The directions and angles** are these (Figure [](#fig:memory-angles)).

- $\sym{camera-direction}{\hat N}$ is the unit vector from the source to the camera, a distance $r$ away. The axes
  $\vect e_1$ and $\vect e_2$ of section 5.4 lie across it, and in them $\field h_+ = \tfrac12e^+_{ij}\field h_{ij}$ and
  $\field h_\times = \tfrac12e^\times_{ij}\field h_{ij}$.
- $\sym{emission-direction}{\hat n'}$ is a direction of emission, a unit vector, at the angle $\beta$ from $\hat N$ and
  the azimuth $\psi$ round $\hat N$, measured from $\vect e_1$.
- $\dd^2\hat n' = \sin\beta\,\dd\beta\,\dd\psi$ is the solid angle of a small patch of directions about $\hat n'$. With
  $v = \cos\beta$ it is $\dd v\,\dd\psi$, and the whole sky is $v$ from $-1$ to $1$ and $\psi$ from $0$ to $2\pi$.
- For a burst that is the same all round an axis $\hat z$, $\theta$ is the camera's angle from $\hat z$ and $\theta'$
  that of $\hat n'$. We put $\vect e_1$ on the side of $\hat z$, so $\hat z = \cos\theta\,\hat N + \sin\theta\,\vect
  e_1$.

The energy sent into each steradian about $\hat n'$ is $\dd\matter E/\dd^2\hat n'$, in $\mathrm{J\,sr^{-1}}$, and its
integral over the sky is the total energy $\matter E$. We write $\dd^2\hat n'$ rather than $\dd\Omega'$, because
$\Omega$ is a rate of turning in this book. The change in the strain seen from $\hat N$ is[^memory]

$$\Delta\field h^{\rm TT}_{ij} = \frac{4G}{c^4r}\int\frac{\dd\matter E}{\dd^2\hat n'}\Bigl[\frac{\hat n'_i\hat
n'_j}{1 - \hat n'\cdot\hat N}\Bigr]^{\rm TT}\dd^2\hat n' ,\label{eq:memory-sum}$$

which we derive next from one particle.

![Look first at the two arrows from the source: $\hat N$ points to the camera and $\hat n'$ along one piece of the
burst. The angle $\beta$ from $\hat N$ and the turn $\psi$ round $\hat N$, measured from $\vect e_1$, place $\hat n'$.
A burst that is the same all round the axis $\hat z$ needs only the camera's angle $\theta$ and the emission's angle
$\theta'$ from that axis. Schematic.](tut-memory-angles){#fig:memory-angles}

**One particle, exactly.** A particle of energy $\matter E$ leaves the origin at $t = 0$ with the velocity $\vect v =
v\hat n'$, where for now $v < c$. By
[section 6.5](/tutorial/relativity/stress-energy/#dust-a-fluid-and-a-beam-of-light-each-fill-the-table) it is a moving
point of momentum flux

$$\matter T_{kl}(t, \vect y) = \frac{\matter E}{c^2}\,v_kv_l\,\delta^3(\vect y - \vect vt)\quad (t > 0) ,$$

with nothing before. The source's own stresses add up to zero before the burst and after it (section
[6.5](/tutorial/relativity/stress-energy/#the-stresses-of-a-body-at-rest-add-up-to-zero)), so they add nothing at order
$1/r$. We use the retarded solution of
[section 7.4](/tutorial/geometry/linearized-gravity/#the-field-travels-at-the-speed-of-light), which holds at every
distance, with no assumption that the source is small. Its retarded time differs from one point of the source to
another, so we write the source as an integral over its own time $t'$, $\matter T_{kl}(t_{\rm r}, \vect y) = \int\matter
T_{kl}(t', \vect y)\,\delta(t' - t_{\rm r})\,\dd t'$, and do the integral over $\vect y$ first:

$$\field{\bar h}_{kl}(t, \vect x) = \frac{4G\matter E\,v_kv_l}{c^6}\int_0^\infty\frac{\delta\bigl(t' - t +
R(t')/c\bigr)}{R(t')}\,\dd t' ,$$

with $R(t') = |\vect x - \vect vt'|$ the distance from the particle at $t'$ to the field point. The argument of the
delta function, $s = t' - t + R/c$, is zero at one time $t_{\rm p}$, when the particle sent the news that arrives at
$t$. The particle closes on the field point at the speed $\hat n_R\cdot\vect v$, with $\hat n_R$ the unit vector from
the particle to the field point, so $\dd R/\dd t' = -\hat n_R\cdot\vect v$ and $\dd s = (1 - \hat n_R\cdot\vect
v/c)\,\dd t'$. Changing the variable from $t'$ to $s$,

$$\boxed{\;\field{\bar h}_{kl}(t, \vect x) = \frac{4G\matter E}{c^6}\,\frac{v_kv_l}{R\,(1 - \hat n_R\cdot\vect v/c)}
,\;}$$

taken at $t_{\rm p}$, for $t > |\vect x|/c$, and zero before. This is gravity's form of the Liénard–Wiechert field of a
moving charge. Its units: $G\matter E/c^4$ is a length and $v^2/c^2$ a pure number, so $\field{\bar h}_{kl}$ is a pure
number, as it should be.

**At the camera.** The camera is at $\vect x = r\hat N$, outside every particle's path. At $t_{\rm p}$ the particle is
$vt_{\rm p}$ from the source, and its news arrives at $t \approx t_{\rm p} + r/c - (vt_{\rm p}/c)\,\hat N\cdot\hat n'$,
so $t - r/c \approx t_{\rm p}(1 - \hat N\cdot\vect v/c)$. As long as $t - r/c$ is much shorter than $r/c$, the
particle is still far nearer the source than the camera, so $R = r$ and $\hat n_R = \hat N$ to that accuracy, and

$$\field{\bar h}_{kl} = \frac{4G\matter E}{c^6r}\,\frac{v_kv_l}{1 - \hat N\cdot\vect v/c} ,$$

a constant switched on at $t = r/c$. For a star 10 kpc away, $r/c$ is 33,000 years. **A limit.** For slow particles,
$v \ll c$, the denominator is one, and with $\matter E = mc^2$ the step is $(4G/c^4r)\,mv_kv_l$, the step that
[section 7.7](/tutorial/geometry/quadrupole-formula/#a-compact-source-is-read-at-zero-wavevector-where-its-stress-is-half-the-acceleration-of-its-quadrupole)'s
quadrupole formula gives for a mass sent off at the speed $v$, whose quadrupole $mx_kx_l$ then has the second
derivative $2mv_kv_l$.

**The strain.** At order $1/r$ this field depends on $t$ and $\vect x$ only through $t - r/c$, so near the camera it is
a wave travelling along $\hat N$, and section
[7.7](/tutorial/geometry/quadrupole-formula/#far-away-each-direction-reads-the-stress-at-one-wavevector)'s projector
applies: the strain is $\Lambda_{ij,kl}(\hat N)\,\field{\bar h}_{kl}$, written $[\;]^{\rm TT}$, its part across $\hat N$
with no trace. The trace reversal does not matter, because $\Lambda$ removes multiples of $\delta_{kl}$, and the entries
with a time index, among them the fall of the source's pull as its mass drops by $\matter E/c^2$, are tied to the
spatial ones by the gauge. We let $v \to c$, which the denominator allows while $\hat n' \neq \hat N$:

$$\begin{aligned}\Delta\field h^{\rm TT}_{ij} &= \frac{4G\matter E}{c^4r}\\ &\quad\times\Bigl[\frac{\hat n'_i\hat
n'_j}{1 - \hat n'\cdot\hat N}\Bigr]^{\rm TT} .\end{aligned}$$

Adding the particles, each with its share $(\dd\matter E/\dd^2\hat n')\,\dd^2\hat n'$, gives [](#eq:memory-sum). The
**memory** is the step $\sym{memory-step}{\Delta\field h^{\rm TT}_{ij}}$, the strain after the burst minus the strain
before: a constant table of pure numbers. The derivation needs no source small compared with $r$, only particles that
have not yet gone far from it and a camera that none of them hits. A lopsided burst also makes the remnant recoil, and
the recoil adds a memory of second order in its small speed [@Favata2009recoil].

**In the camera's axes.** By the list above, $\hat n'\cdot\vect e_1 = \sin\beta\cos\psi$ and $\hat n'\cdot\vect e_2 =
\sin\beta\sin\psi$, so with $e^+_{ij} = e_{1i}e_{1j} - e_{2i}e_{2j}$ of section 5.4,

$$e^+_{ij}\hat n'_i\hat n'_j = \sin^2\beta\,(\cos^2\psi - \sin^2\psi) = \sin^2\beta\cos2\psi .$$

The projector changes nothing in this product. Section 7.6's $\Lambda$ is unchanged when its two pairs of indices swap,
and it leaves $e^+$ whole, because $e^+$ already lies across $\hat N$ with no trace:

$$e^+_{ij}\Lambda_{ij,kl}\hat n'_k\hat n'_l = (\Lambda_{kl,ij}e^+_{ij})\,\hat n'_k\hat n'_l = e^+_{kl}\hat n'_k\hat
n'_l .$$

Last, $\sin^2\beta = (1 - \cos\beta)(1 + \cos\beta)$, so $\sin^2\beta/(1 - \cos\beta) = 1 + \cos\beta$. The cross
pattern gives $\sin^2\beta\sin2\psi$ in the same way. So

$$\boxed{\;\begin{aligned}\Delta\field h_+ &= \frac{2G}{c^4r}\int\frac{\dd\matter E}{\dd^2\hat n'}\,(1 +
\cos\beta)\\ &\qquad\times\cos2\psi\,\dd^2\hat n' ,\\ \Delta\field h_\times &= \frac{2G}{c^4r}\int\frac{\dd\matter
E}{\dd^2\hat n'}\,(1 + \cos\beta)\\ &\qquad\times\sin2\psi\,\dd^2\hat n' .\end{aligned}\;} \label{eq:memory-axes}$$

The denominator has gone. It is the compression of
[section 6.3](/tutorial/relativity/aberration/#light-from-ahead-is-bluer-and-light-from-behind-is-redder): a particle
aimed near the camera chases its own signal, so what it does over a time $\Delta t$ arrives within $(1 -
\cos\beta)\,\Delta t$. Such particles count for more, but they have almost no part across $\hat N$, and the two effects
cancel.

**One narrow jet.** A **jet** sends all its energy along one direction. For a jet at the angle $\theta$ from $\hat N$,
with $\vect e_1$ on its side ($\beta = \theta$, $\psi = 0$),

$$\Delta\field h_+ = \frac{2G\matter E}{c^4r}\,(1 + \cos\theta) .$$

It is largest close to the jet's own line, where it tends to $4G\matter E/c^4r$, and zero from behind, at $\theta =
180°$. Exactly on the line, $\sin^2\beta$ and $1 - \cos\beta$ are both zero, and their ratio tends to 2 only as a limit.
There $\psi$ has no meaning, and the answer comes from symmetry: the jet is unchanged by any turn about $\hat N$, and a
table across $\hat N$ with no trace that every such turn leaves unchanged is zero.[^turn] The camera is then also
inside the jet, where the step above does not apply.

**Two opposite jets** that share $\matter E$ send $\matter E/2$ at $\theta$ and $\matter E/2$ at $180° - \theta$, both
in the plane of $\vect e_1$, so $\cos2\psi = 1$ for both. Their memory is $(G\matter E/c^4r)[(1 + \cos\theta) + (1 -
\cos\theta)] = 2G\matter E/c^4r$, the same in every direction off their axis (with $\matter E$ in each, it is
$4G\matter E/c^4r$).

**A sphere and a dipole.** A burst that is the same in every direction has $\dd\matter E/\dd^2\hat n' = \matter
E/4\pi$, and $\cos2\psi$ averages to zero over a turn, so it leaves nothing. A burst brighter on one side has
$\dd\matter E/\dd^2\hat n' = (\matter E/4\pi)(1 + a\cos\theta')$, with $a$ a pure number. Since $\hat n' = \cos\beta\,\hat
N + \sin\beta\,(\cos\psi\,\vect e_1 + \sin\psi\,\vect e_2)$,

$$\cos\theta' = \hat n'\cdot\hat z = \cos\theta\cos\beta + \sin\theta\sin\beta\cos\psi ,$$

a constant plus a multiple of $\cos\psi$, and $\cos\psi\cos2\psi$ also averages to zero over a turn. So a dipole leaves
no memory, exactly.

**A burst stronger along its axis.** The pattern is $(\matter E/4\pi)[1 + q\,P_2(\cos\theta')]$, with
$P_2(x) = \tfrac12(3x^2 - 1)$ from section
[2.2](/tutorial/outside/spherical-harmonics/#the-patterns-symmetric-about-an-axis-are-the-legendre-polynomials-and-the-inverse-distance-generates-them)
and $\sym{burst-asymmetry}{q}$ the burst's **asymmetry**, a pure number.[^q] The total is still $\matter E$, because
$P_2$ averages to zero over the sphere. The constants give no memory, and the square of $\cos\theta'$ has three terms:

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

with $\Delta\field h_\times = 0$, because the pattern is the same at $\psi$ and $-\psi$.

**A number.** A core collapse sends out about $3\times10^{46}$ J in neutrinos, a sixth of a solar mass (section 6.4).
From 10 kpc, $3.1\times10^{20}$ m, with $q = 0.01$, the memory seen from the side is $4.0\times10^{-21}$, four times the
$10^{-21}$ of LIGO's waves. With $q = 0$ the burst is a sphere and leaves nothing.

**What it means.** The factor $\cos2\psi$ keeps only the parts of a pattern that vary at least as fast as
$\cos^2\psi$ around the camera's line. A pattern of degree $\ell$ in $\cos\theta'$ holds powers of $\cos\psi$ up to the
$\ell$th, so only the quadrupole and higher degrees leave memory, and a narrow jet, which holds every degree, does.

## The waves' own energy leaves a memory too

The waves of a merger are themselves a burst. Far from the pair, the waves that leave along $\hat n'$ are, over a few
wavelengths, a plane wave moving at $c$ with the energy density $\matter{\mathcal U}$ of the second section. Anything
that carries energy at the speed $c$ has no rest mass and so carries momentum equal to its energy over $c$ (section
[6.4](/tutorial/relativity/energy-and-momentum/#light-has-no-rest-mass-but-two-beams-of-light-have-one)). The waves
therefore hold the momentum $\matter{\mathcal U}/c$ per cubic metre along $\hat n'$ and carry the momentum flux
$\matter{\mathcal U}\,\hat n'_k\hat n'_l$, the table of a beam of light in section 6.5 and of the particles of the last
section.

That table is not yet a source. The waves' energy is of second order in $\field h$, and linear theory has no place for
it. R. A. Isaacson showed in 1968 that at second order, averaged over a few wavelengths, the waves' energy and momentum
enter Einstein's equation for the slowly changing part of the field exactly as matter's do (the box of the second
section). We take that result as given. For the slowly changing field, a stream of waves leaving with $\dd\matter
E/\dd^2\hat n'$ is then a stream of particles that move at $c$, and the last section's derivation, with its exact
retarded field, applies to it unchanged. So the waves' energy enters [](#eq:memory-sum) as any other energy does. This
is the **nonlinear memory**, found by D. Christodoulou [@Christodoulou1991] and read in this way by K. S. Thorne
[@Thorne1992]; the **linear memory** of the last section is made by matter or neutrinos.

**The pattern.** The axis $\hat z$ is now the orbit's axis. By section
[5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on), averaged over an orbit, the power toward
the angle $\theta'$ from it is $(1 + 6\cos^2\theta' + \cos^4\theta')/8$ of the power along the axis, and its average
over the sphere is two fifths. So if $\sym{radiated-energy}{\matter{\Delta E}}$ is the energy radiated, in joules,

$$\frac{\dd\matter E}{\dd^2\hat n'} = \frac{5\matter{\Delta E}}{8\pi}\cdot\frac{1 + 6\cos^2\theta' + \cos^4\theta'}8 .$$

**The integral.** The camera's angle $\theta$ from the axis is the inclination $\sym{inclination}{\iota}$ of section 5.4,
and $\vect e_1$ lies along the axis as it is seen on the sky. In [](#eq:memory-axes) the constant gives nothing,
$\cos^2\theta'$ gives $(2\pi/3)\sin^2\iota$ by the last section's integrals, and $\cos^4\theta'$ gives
$(4\pi/15)\sin^2\iota\,(2 + \cos^2\iota)$ (box below). Adding,

$$\begin{aligned}\Delta\field h_+ &= \frac{2G}{c^4r}\,\frac{5\matter{\Delta E}}{64\pi}\Bigl[4\pi +
\frac{4\pi}{15}(2 + \cos^2\iota)\Bigr]\sin^2\iota\\ &= \frac{2G}{c^4r}\,\frac{5\matter{\Delta E}}{64\pi}\,\frac{4\pi}{15}\,
(17 + \cos^2\iota)\sin^2\iota ,\end{aligned}$$

and the factors $2\cdot5\cdot4/(64\cdot15) = 1/24$ leave

$$\boxed{\;\Delta\field h_+ = \frac{G\matter{\Delta E}}{24c^4r}\,\sin^2\iota\,\bigl(17 + \cos^2\iota\bigr) ,\;}$$

the shape found by A. G. Wiseman and C. M. Will [@WisemanWill1991].[^merger]

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
power (section 5.4), as panel (a) of the figure below shows.

**A number.** The first merger that LIGO detected radiated about three solar masses, $5.4\times10^{47}$ J, from 410
Mpc. Seen edge-on, which it was not, it would leave $2.5\times10^{-22}$, a quarter of the $10^{-21}$ of the waves of
section 7.6; at its inclination, near 150°, it leaves about $6.5\times10^{-23}$. Both are estimates, because the last
orbits and the merger do not keep the pattern of a slow pair.

**What the two results rest on.** The burst's memory, $(qG\matter E/2c^4r)\sin^2\theta$, rests on linear theory
outside the source, with $\matter E$ the energy that reaches far away; on particles that leave one small region on
straight lines at nearly $c$, with the pattern $1 + qP_2$; on a camera that none of them hits, read for a time much
shorter than $r/c$ after the step; and on a remnant whose recoil is neglected. The merger's memory rests on all of
these and on two more premises: Isaacson's result, which makes the waves a source, and the pattern of a slow circular
pair for the whole of $\matter{\Delta E}$, which the last orbits and the merger do not keep.

**The spin memory.** The **spin memory** is a lasting change not in the strain but in its time integral $\int\field
h\,\dd t$, the strain added up over time, and so in the third time integral of the tide. It is made by the flux of
angular momentum, as the memory above is made by the flux of energy, and its pattern on the sky has the other parity
[@PasterskiStromingerZhiboedov2016]. Symmetry fixes much of its shape for a pair whose orbit does not tilt. Seen from
the other side of the orbit, at $180° - \iota$, the pair turns the other way, so the pattern is odd in $\cos\iota$ and
vanishes edge-on. Face-on, every turn about the line of sight leaves the scene unchanged, so it vanishes there too, as
the memory above does. D. A. Nichols computed it for such pairs and found the pattern
$\sin^2\iota\cos\iota$ [@Nichols2017]. With $x = \cos\iota$, its slope $1 - 3x^2$ is zero at $\cos\iota =
\pm1/\sqrt3$, so it peaks at $\iota = 54.7°$ and $125.3°$, with opposite signs. It records which way the pair turned,
which the memory above, the same at $\iota$ and $180° - \iota$, cannot.

{{paper fig:memory}}

## A camera that reads the tide sees the memory as a burst that does not add up to nothing

By section 7.6 the tide of a wave is $\sym{tidal-tensor}{\curv\tE}_{ij} = -\tfrac12\ddot{\field h}_{ij}$. Before the burst
the strain is constant, and after it the strain is constant again, larger by $\Delta\field h_{ij}$, so $\dot{\field
h}_{ij}$ is zero at both ends. We integrate the tide from a time $t_1$ before the burst to a time $t_2$ after it, once,
and then a second time, from $t_1$ to each $t$ and then over $t$:

$$\begin{gathered}\int_{t_1}^{t_2}\curv\tE_{ij}\,\dd t = -\tfrac12\bigl[\dot{\field h}_{ij}\bigr]_{t_1}^{t_2} = 0 ,\\
\int_{t_1}^{t_2}\!\!\int_{t_1}^{t}\curv\tE_{ij}\,\dd t'\,\dd t = -\tfrac12\,\Delta\field h_{ij} \neq 0
.\end{gathered}$$

So the memory is a burst of tide whose integral vanishes and whose double integral does not. Between two free balls at
rest before the burst, the displacement $\delta\xi_i = \tfrac12\field h_{ij}\xi_j$ of section 7.6 leaves a change of
separation $\tfrac12\Delta\field h_{ij}\xi_j$ that stays (Figure [](#fig:memory-step)). **A number.** The supernova's
$4.0\times10^{-21}$ moves balls 4 km apart, along $\vect e_1$, by $8\times10^{-18}$ m for good, about a two-hundredth of
a proton's width.

![Look first at the right end of the upper line: after the burst the strain stays at a new level. The tide below
starts and ends at zero, and its integral from $t_1$ to $t_2$ is zero too, but integrated twice it leaves
$-\tfrac12\Delta\field h_+$, so two free balls end farther apart. Schematic.](tut-memory-step){#fig:memory-step}

::: try {#memory-pattern}
On the left, the pattern in which a burst sends out its energy, drawn about its axis $\hat z$, with the camera's
direction $\hat N$ as an arrow you can turn. On the right, the memory that the same burst leaves at every camera
direction in that plane, in units of $4G\matter E/c^4r$. Buttons choose one narrow jet, two opposite jets sharing the
energy, a uniform sphere, a dipole, the pattern $1 + qP_2$ and a merger's waves; sliders set the dipole's lopsidedness
and $q$. The readouts give $\Delta\field h_+$ and $\Delta\field h_\times$ from [](#eq:memory-axes), summed over the sky,
beside the closed form where there is one.

Answer the predictions at the top of the figure first. Then choose the merger's pattern and turn the camera from
face-on to edge-on: say why the memory grows as the oscillating wave weakens.
:::

**The idea to keep: a wave crossing a viscous medium shears it at half the rate of its strain, so the medium heats and
the wave fades at $16\pi G\matter\eta/c^2$, Hawking's rate. Since the heat comes from the wave, the wave carries
$c^3\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\rangle/16\pi G$ through each square metre, whatever the medium.
A burst that carries energy unevenly away, waves included, leaves the camera permanently stretched: the memory.**

::: problems
### Practice

**[7.8]** For honey, with $\matter\eta \approx 10\unit{Pa\,s}$ at the frequencies where that value holds, find $\alpha$
and the attenuation length. Then say why honey need not glow more than water although it absorbs ten thousand times
more at low frequency.

::: solution
$\alpha = 16\pi G\times10/c^3 = 1.2\times10^{-33}\unit{m^{-1}}$, and $1/\alpha = 8.0\times10^{32}$ m, or
$8.5\times10^{16}$ light-years. The glow comes from the friction at the frequencies of heat, about $10^{13}$ cycles a
second, and there honey's slow rearrangement is frozen: by the
[tail](/tutorial/response/viscosity/#at-fixed-stiffness-the-more-viscous-liquid-has-less-friction-at-the-frequencies-of-heat)
$\matter\mu_\infty^2/\matter\eta_0\omega^2$ of section 4.4, at a fixed stiffness the more viscous liquid has the less
friction there.
:::

**[7.8]** How much energy does the wave of strain amplitude $10^{-21}$ at 100 Hz hold in each cubic metre? Compare it
with sunlight at the Earth, $1.4\unit{kW\,m^{-2}}$.

::: solution
$\matter{\mathcal U} = F/c = 5.3\times10^{-12}\unit{J\,m^{-3}}$. Sunlight holds $4.7\times10^{-6}\unit{J\,m^{-3}}$,
nearly a million times more.
:::

**[7.8]** In the heat balance the viscosity cancels. Why is that a good sign?

::: solution
The energy found then belongs to the wave alone. A wave has its energy before it meets any medium, so every medium,
however viscous, must give the same answer.
:::

**[7.8]** Why does an explosion that sends its energy out evenly in all directions leave no memory?

::: solution
The memory weighs the pattern by $\cos2\psi$ around the camera's line, and a uniform pattern averages that to zero.
Only the quadrupole and higher parts of a pattern survive.
:::

**[7.8]** Find Peters's index for water at 100 Hz, and the phase by which the Earth's matter, of mean density
$5510\unit{kg\,m^{-3}}$ and radius 6371 km, delays a 100 Hz wave that crosses it along a diameter. Check the second
answer against $3\mathcal C\bar\lambda/R$ with the Earth's $\mathcal C = 7.0\times10^{-10}$.

::: solution
With $\omega = 628\unit{s^{-1}}$, $n - 1 = 2\pi G\times1000/\omega^2 = 1.1\times10^{-12}$. Across the Earth,
$4\pi G\matter\rho R/c\omega = 1.6\times10^{-10}$ radians. With $\bar\lambda = c/\omega = 4.77\times10^5$ m,
$3\mathcal C\bar\lambda/R = 3\times7.0\times10^{-10}\times0.075 = 1.6\times10^{-10}$, the same.
:::

**[7.8]** Why does the stiffness of a solid change the wavenumber of a wave crossing it, while its viscosity fades the
wave?

::: solution
The elastic stress $\matter\mu\field h_{ij}$ is in step with the strain, so it adds a term in $\field h$ to the field
equation and shifts $k^2$. The viscous stress $\matter\eta\dot{\field h}_{ij}$ is in step with the strain's rate, so
it adds a term in $\dot{\field h}$, a damping, which turns the wave's energy into heat.
:::

**[7.8]** The memory of a supernova 10 kpc away arrives at the camera. For roughly how long afterwards does the step
keep the value of [](#eq:memory-sum), and why does the formula fail for a camera that a jet of the burst passes
through?

::: solution
The step was derived for times after its arrival much shorter than $r/c$, while the particles are still far nearer the
source than the camera: here $r/c = 33{,}000$ years. A camera in a jet's path has $\hat n' = \hat N$ for some
particles, where the denominator $1 - \hat n'\cdot\hat N$ vanishes; those particles reach the camera, and the field
there is not a wave arriving from the source.
:::

### Stretch

**[7.8]** Combine this section with section 2.2. A burst has the pattern $(\matter E/4\pi)[1 + q_3P_3(\cos\theta')]$,
with $P_3(x) = \tfrac12(5x^3 - 3x)$ and $q_3$ a pure number. Show that its memory is $\Delta\field h_+ = (q_3G\matter
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

**[7.8]** A steel wall of thickness $d$ stands in a 1 kHz wave. Show that it reflects the amplitude $r(1 -
e^{2ik_2d})$, to first order in $r$, and find its largest value. How many walls, spaced so that their reflections add
in step, would reflect half the amplitude, and how thick would the stack be if each wall and each gap were a quarter of
a wavelength?

::: solution
The front face reflects $r$; the back face reflects $-r$, delayed by the round trip $2k_2d$ through the wall, so the
sum is $r(1 - e^{2ik_2d})$, of size $2r|\sin k_2d|$, at most $2r = 3.4\times10^{-23}$. Each wall then adds $2r$ in
step, so half the amplitude needs about $1/4r = 1.5\times10^{22}$ walls. Each wall and gap together are half a
wavelength, 150 km, so the stack is $2.2\times10^{27}$ m long, about $2\times10^{11}$ light-years.
:::

**[7.8]** A wave arrives at a ball of radius $R$ and density $\matter\rho$. Using only that a mirror must be wider than
$c/\omega$, larger than its Schwarzschild radius, and reflect strongly, show that a gravitational mirror needs
$\matter\mu > \matter\rho c^2/6$, and say what this asks of the speed of shear sound.

::: solution
Strong reflection needs $16\pi G\matter\mu/c^2 \gtrsim \omega^2$. A ball larger than its Schwarzschild radius has
$R^2 < 3c^2/8\pi G\matter\rho$, and $R > c/\omega$ then gives $\omega^2 > 8\pi G\matter\rho/3$. Together,
$16\pi G\matter\mu/c^2 > 8\pi G\matter\rho/3$, so $\matter\mu > \matter\rho c^2/6$, or $c_T > c/\sqrt6 =
0.41c$: shear sound nearly as fast as light.
:::

### The camera

**[7.8]** Derive the damped wave equation [](#eq:hawking) and the absorption coefficient $\alpha$ from the field
equation with a viscous stress, and reproduce the $10^{-37}\unit{m^{-1}}$ and the nearly $10^{21}$ light-years for
water. Then derive the memory of a burst $(\matter E/4\pi)[1 + qP_2]$ from [](#eq:memory-sum) and find its value for
$q = 0.01$.

::: solution
The first section's steps give [](#eq:hawking), and $\alpha = \Gamma/c$ gives the numbers for water. The steps to
[](#eq:memory-axes), with the pattern $1 + qP_2$, give $\Delta\field h_+ = (qG\matter E/2c^4r)\sin^2\theta$ and
$4.0\times10^{-21}$ for $3\times10^{46}$ J at 10 kpc.
:::
:::

::: paper
- [Section VI](/paper/#sec:thermal), [*Absorption*](/paper/#par:absorption): the paper's [](/paper/#eq:damped) and
  [](/paper/#eq:alpha), "the result found by Hawking", $10^{-37}\unit{m^{-1}}$ and $10^{21}$ light-years.
- [Section V](/paper/#sec:waves): the power and the paper's [](/paper/#eq:dumbbell), through section 7.7.
- [Section VII](/paper/#sec:no-lens): [*The optical constants of matter*](/paper/#par:the-optical-constants-of-matter),
  with the paper's [](/paper/#eq:index), Press's stiffness, mirror and reflection, and [](/paper/#eq:optics-bound).
- [Section XI](/paper/#sec:vistas): [*Memory*](/paper/#par:memory), with the paper's [](/paper/#eq:memory) and
  [](/paper/#eq:merger-memory) and the spin memory; [*An exploding star*](/paper/#par:an-exploding-star), with the jets,
  the paper's [](/paper/#eq:burst-memory) and $4\times10^{-21}$; Figure [](/paper/#fig:memory); and [*Scattering,
  earthquakes and tails*](/paper/#par:scattering-earthquakes-and-tails), with $(Gm/c^2)^2$ and
  $3\times10^{-51}\unit{m^2\,sr^{-1}}$.
:::

::: deeper
- The GR course's [section 18.7](https://neovand.github.io/general-relativity/chapter-18.html#18-7-wave-energy-lives-one-order-beyond-the-linear-equation)
  finds a wave's energy at second order in Einstein's equation.
- S. W. Hawking, "Perturbations of an expanding universe" [@Hawking1966]: the damping by a viscous medium, in its home.
- K. S. Thorne, "Gravitational-wave bursts with memory: the Christodoulou effect" [@Thorne1992]: the memory formula, and
  the nonlinear memory as the linear one with the waves' energy as its source.
- M. Favata, "The gravitational-wave memory effect" [@Favata2009]: a review, with the memory of mergers.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, in
    [*Absorption*](/paper/#par:absorption), as its equations [](/paper/#eq:damped) and [](/paper/#eq:alpha), and in
    Sec. XI, in [*Memory*](/paper/#par:memory).

[^press]: A shear modulus $\matter\mu$ changes the square of the wave's wavenumber by the fraction $16\pi
    G\matter\mu/c^2\omega^2$ (W. H. Press's result, stated in section
    [5.5](/tutorial/waves/radiance/#matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact)):
    $6.7\times10^{-21}$ for the steel of section 5.5, with $\matter\mu = 71$ GPa, at 100 Hz.

[^gauge]: The viscous stress is transverse and trace-free, like the strain, so its divergence $\partial_j\matter
    T_{ij}$ vanishes: the medium's momentum is conserved and harmonic gauge survives.

[^letters]: A bare $\Gamma$ is a damping rate, as in sections 4.1 and 5.1; Christoffel symbols carry indices. In the
    matter colour $\matter\eta$ is the viscosity; the metric $\field\eta_{\mu\nu}$ carries indices.

[^u]: Sections 6.5 and 7.3 use this letter, in this colour, for the energy density of light; here it is the wave's. The
    matter colour fits because an energy density is a source of gravity.

[^peters]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, in [*Scattering, earthquakes and
    tails*](/paper/#par:scattering-earthquakes-and-tails), as $3\times10^{-51}\unit{m^2\,sr^{-1}}$ for a person.

[^scatter]: Figure [](/paper/#fig:closed-furnace) of the paper shows the closed furnace.

[^optics]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VII, in [*The optical constants of
    matter*](/paper/#par:the-optical-constants-of-matter), with the index as its equation [](/paper/#eq:index) and the
    four constants of a ball as its equation [](/paper/#eq:optics-bound).

[^memory]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, as its equation [](/paper/#eq:memory) [@Thorne1992], with the jets and the
    burst of an exploding star, its equation [](/paper/#eq:burst-memory).

[^turn]: By section [5.4](/tutorial/waves/polarization/#a-wave-across-the-line-of-sight-has-two-patterns-of-stretch),
    turning the axes by an angle $\varphi$ about $\hat N$ turns $\field h_+ + i\field h_\times$ by the angle $2\varphi$
    in the complex plane, so only zero is unchanged by every turn.

[^q]: Not the $q = kz$ of section 3.7.

[^merger]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, as its equation [](/paper/#eq:merger-memory), with the memory against
    direction in its Figure [](/paper/#fig:memory).
