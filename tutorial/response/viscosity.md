---
id: '4.4'
title: 'Viscosity and relaxation; the Maxwell model'
question: 'Honey is far more viscous than water. How can the more viscous liquid have less friction at the frequencies of heat?'
part: '4'
requires: ['1.5b', '4.1', '4.3']
paper: [sec:thermal, eq:maxwell, eq:friction-sum, eq:damped, eq:alpha, fig:materials, tab:materials]
figures: [fig:materials]
live: []
depth: A
---

A gravitational wave that crosses matter shears it, and the matter's internal friction turns a little of the wave's
energy into heat. By Kirchhoff's law, the same friction makes warm matter glow
([chapter 0.3](/tutorial/evening/waves-and-heat/#matter-is-transparent-so-warm-matter-glows-throughout)). The paper's
plain words name the friction **viscosity** and add: "Honey, for example, has a high viscosity and water a low one."
Its paragraph [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat) then writes the
friction of a liquid at the angular frequency $\omega$ of the wave,

{{paper eq:maxwell}}

in which $\matter\eta_0$ is the viscosity we feel when we stir and $\tau$ is a time that belongs to the liquid (both are
defined below). The paper concludes that "at a given stiffness, the more viscous liquid glows the less".

So we ask how, at the same stiffness, the more viscous liquid can have less friction. The answer decides which number
sets the glow of a body: the viscosity we feel when we stir, or another one. This chapter defines viscosity, builds
the model behind the paper's equation, and applies it to the paper's other frictions, a metal's electrons and a
solid's sound.[^letters]

::: plain
A liquid resists being stirred. The faster one layer slides over the next, the harder the liquid pushes back. This
resistance is its **viscosity**, and the work spent against it becomes heat.

A liquid also has a little stiffness, like a solid. Its molecules need some time to rearrange themselves, and during
that time a sudden shear is resisted as a solid would resist it. This time is the **relaxation time**. A slow stir
gives the molecules plenty of time, and the liquid flows. A shake much faster than the relaxation time gives them no
time, and the liquid answers as a solid, which stores the work instead of turning it into heat.

Honey is viscous because its molecules rearrange slowly. So honey stops flowing, and starts acting as a solid, at a
much lower frequency than water does. Heat shakes matter about $10^{13}$ times a second. Suppose that honey and water
were equally stiff against a sudden shear, and that slow rearrangement were their only source of friction. Then honey
would turn far less of that shaking into heat than water would, although it is ten thousand times more viscous to
stir.
:::

## Viscosity is a stress that answers how fast a shape changes

Chapter 4.3's solid answers a shear with a stress in proportion to the shear itself. A liquid at rest holds no shear
stress at all: whatever the shape of its glass, its surface levels itself. That is what makes it a liquid. A stirred
liquid does push back, but against the rate at which its shape changes, not against the change.

We describe a flowing liquid by its velocity $\vect v(\vect x)$, in metres per second, at each point. In a short time
$\dd t$ each bit moves by $\vect v\,\dd t$, and chapter 4.3's
[strain](/tutorial/response/elastic-bodies/#a-deformation-is-a-displacement-field-and-its-strain-is-the-part-that-changes-lengths)
of that small displacement, divided by $\dd t$, is the **rate of strain**,

$$\dot u_{ij} = \tfrac12\bigl(\partial_iv_j + \partial_jv_i\bigr) ,$$

in $\mathrm{s^{-1}}$. Its trace-free part, $\dot{\tilde u}_{ij} = \dot u_{ij} - \tfrac13\delta_{ij}\dot u_{kk}$, is the
**rate of shear**: how fast each small piece changes its shape.

A **Newtonian fluid** is one whose stress has a part in proportion to the rate of shear:

$$\boxed{\;\matter T_{ij} = -p\,\delta_{ij} + 2\sym{viscosity}{\matter\eta}\,\dot{\tilde u}_{ij}\;} . \label{eq:viscous}$$

The number $\matter\eta$ is the **shear viscosity**, or the viscosity for short, in pascal seconds; the units agree, since
$\mathrm{Pa\,s} \times \mathrm{s^{-1}} = \mathrm{Pa}$. The first term is 4.3's pressure $p$, the push of a fluid at
rest. The second, the **viscous stress**, answers only the rate of shear, so a uniform compression is left to the
pressure. (A fluid can also resist a change of volume with a bulk viscosity, but a gravitational wave's shear is
trace-free, so the bulk viscosity never enters.) The factor 2 matches the $2\matter\mu\,\tilde u_{ij}$ of 4.3's Hooke's
law: $\matter\eta$ does for a rate of shear what the shear modulus $\matter\mu$ does for a shear.

**Why this quantity: it is what is measured between two plates.** A layer of liquid of thickness $d$ lies between two
flat plates. The lower plate is held still and the upper one slides along $x$ at the speed $v$. The liquid sticks to
each plate, so its velocity rises evenly across the gap, $v_x = v\,y/d$. The only entries of the rate of strain are
$\dot u_{xy} = \dot u_{yx} = v/2d$, and their trace is zero, so [](#eq:viscous) gives the stress on the upper plate,

$$\matter T_{xy} = \frac{\matter\eta\,v}{d} .$$

This is the force per area needed to keep the plate moving, and an instrument that measures it measures $\matter\eta$.

**An example.** Water has $\matter\eta \approx 10^{-3}\unit{Pa\,s}$. Between plates 1 mm apart, moving at
$1\unit{cm\,s^{-1}}$, its stress is $10^{-3} \times 0.01/10^{-3} = 0.01\unit{Pa}$: each square metre of plate is held
back by the weight of a gram. Honey, of about $10\unit{Pa\,s}$, needs $100\unit{Pa}$, ten thousand times more.
**A non-example.** An elastic solid between the same plates answers the shear itself: after a time $t$ its strain is
$u_{xy} = v\,t/2d$, and its stress is $2\matter\mu u_{xy} = \matter\mu v\,t/d$. When the plate stops, the solid's
stress stays, while the liquid's vanishes at once.

<!-- diagram: tut-visc-plates — Side view of two horizontal plates a gap d apart, the lower one hatched as fixed, the
upper one with an arrow "v" to the right. Between them, five or six horizontal velocity arrows whose lengths rise
linearly from zero at the lower plate to v at the upper one, their tips joined by a thin straight line. On the upper
plate, a short arrow pointing left, labelled "stress ηv/d", the force per area the liquid exerts on it. The gap
labelled d at the side. Caption: "Look first at the arrows in the liquid: they grow evenly from the still plate to the
moving one, so every layer slides over the next at the same rate, v/d. The liquid pulls back on the moving plate with
the stress ηv/d. Lengths schematic." -->

## Friction turns the work of a shear into heat, more at higher frequency

We want the heat that viscosity makes. Chapter 4.3 found that when the strain of a piece of material changes by
$\delta u_{ij}$, its neighbours do the work $\matter T_{ij}\,\delta u_{ij}$ on each cubic metre of it, besides the work
that speeds it up. Per second this is $\matter T_{ij}\dot u_{ij}$. With [](#eq:viscous), the pressure gives
$-p\,\dot u_{kk}$, the work of compression, which a fluid stores and returns as a spring does. The viscous stress gives
$2\matter\eta\,\dot{\tilde u}_{ij}\dot u_{ij}$, and since $\dot{\tilde u}_{ij}$ is trace-free, $\dot{\tilde
u}_{ij}\dot u_{ij} = \dot{\tilde u}_{ij}\dot{\tilde u}_{ij}$. So the heat made in each cubic metre per second is

$$\boxed{\;\text{heat per volume per second} = 2\matter\eta\,\dot{\tilde u}_{ij}\dot{\tilde u}_{ij} \ge 0\;} .
\label{eq:heat}$$

The right side is a sum of squares times $\matter\eta$, so a positive viscosity always heats and never cools.
**A number.** Between the plates, the two equal entries give $2\matter\eta \times 2(v/2d)^2 = \matter\eta v^2/d^2$,
which for water is $0.1\unit{W\,m^{-3}}$. The plate gives the same: its stress times its speed is
$10^{-4}\unit{W}$ for each square metre, spread through a millimetre of liquid. At this rate the water warms by one
kelvin in 1.3 years, since a cubic metre of it needs $4.2 \times 10^6\unit{J}$ per kelvin.

Now let the shear rise and fall, $\tilde u_{ij} = \mathrm{Re}[U_{ij}\,e^{-i\omega t}]$, with the phasor $U_{ij}$ a
trace-free table of complex numbers without a unit (chapter 1.5b). Since the tilde over $u$ marks the trace-free part,
the shear's phasor gets its own capital letter; anywhere else a tilde marks a phasor, as in chapter 4.1. The rate of
shear has the phasor $-i\omega U_{ij}$, and chapter 4.1's rule for [the average of a
product](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push),
$\tfrac12\mathrm{Re}[a^*b]$, gives $\langle\dot{\tilde u}_{ij}\dot{\tilde u}_{ij}\rangle =
\tfrac12\omega^2U_{ij}^*U_{ij}$, so the heat averaged over a swing is

$$\matter\eta\,\omega^2\,U_{ij}^*U_{ij} .$$

At a fixed viscosity and a fixed size of shear, friction takes work in proportion to the square of the frequency. A
gravitational wave of strain $\field h_{ij}$ shears matter "at the rate $\tfrac12\dot h_{ij}$", as the paper says (4.3's
[note on the
half](/tutorial/response/elastic-bodies/#a-deformation-is-a-displacement-field-and-its-strain-is-the-part-that-changes-lengths)),
so the energy it loses is in proportion to $\matter\eta$. That is why $\matter\eta$ appears in the paper's absorption
coefficient [](/paper/#eq:alpha).

## Maxwell's model is a liquid when slow and a solid when fast

A **dashpot** is a piston in a cylinder of oil. It does not resist being held at any position, but it resists motion
with a force in proportion to its speed: it is pure viscosity, as a spring is pure elasticity. Maxwell's law of a
material whose stresses relax, the **Maxwell model**, is now drawn as a spring and a dashpot joined end to end. We
want the stress that this model gives for a shear that rises and falls.

We assume that **the material shears through two parts in series**: an elastic part of rigidity
$\sym{unrelaxed-modulus}{\matter\mu_\infty}$, whose stress is $2\matter\mu_\infty$ times its shear, and a viscous part
of viscosity $\sym{static-viscosity}{\matter\eta_0}$, whose stress is $2\matter\eta_0$ times its rate of shear. (The
subscript $\infty$ stands for an infinitely fast shear, and 0 for zero frequency.) We follow one entry of the tables,
say $xy$, and drop the indices. The same stress $\matter T$ acts through both parts, and their shears add. So the rates
add too:

$$\dot{\tilde u} = \frac{\dot{\matter T}}{2\matter\mu_\infty} + \frac{\matter T}{2\matter\eta_0} .$$

We multiply by $2\matter\mu_\infty$ and name the ratio of the two constants:

$$\dot{\matter T} + \frac{\matter T}{\tau} = 2\matter\mu_\infty\,\dot{\tilde u}, \qquad
\sym{relaxation-time}{\tau} = \frac{\matter\eta_0}{\matter\mu_\infty} . \label{eq:relax}$$

The **relaxation time** $\tau$ is in seconds, since pascal seconds over pascals leave seconds.

**A held shear.** Shear the material suddenly to $\tilde u_0$ at $t = 0$ and hold it there. During the sudden step the
dashpot has no time to move, so the spring takes the whole shear and $\matter T = 2\matter\mu_\infty\tilde u_0$. After
it, $\dot{\tilde u} = 0$, and [](#eq:relax) becomes $\dot{\matter T} = -\matter T/\tau$, so

$$\matter T = 2\matter\mu_\infty\,\tilde u_0\,e^{-t/\tau} .$$

The dashpot slowly gives way until the spring is slack. This dying away of a held stress is **relaxation**. Over times
much longer than $\tau$ the material flows like a liquid, and over much shorter times it holds like a solid.

**A steady swing.** We write $\tilde u = \mathrm{Re}[U\,e^{-i\omega t}]$ and $\matter T = \mathrm{Re}[\tilde{\matter
T}\,e^{-i\omega t}]$, and each time derivative becomes a factor $-i\omega$ (chapter 1.5b). Then [](#eq:relax) reads
$(-i\omega + 1/\tau)\,\tilde{\matter T} = 2\matter\mu_\infty(-i\omega U)$. We multiply by $\tau$ and divide by
$1 - i\omega\tau$:

$$\tilde{\matter T} = 2\,\frac{\matter\eta_0}{1 - i\omega\tau}\,(-i\omega U) .$$

This is the law [](#eq:viscous) in phasors, with the rate of shear $-i\omega U$, and with a viscosity that depends on
the frequency. We call it the **dynamic viscosity**, a complex number like 4.1's response function:

$$\sym{dynamic-viscosity}{\matter\eta(\omega)} = \frac{\matter\eta_0}{1 - i\omega\tau} .$$

Multiplying its top and bottom by $1 + i\omega\tau$ splits it into its real and imaginary parts,

$$\begin{gathered}
\boxed{\;\mathrm{Re}\,\matter\eta(\omega) = \frac{\matter\eta_0}{1 + \omega^2\tau^2}\;} ,\\
\mathrm{Im}\,\matter\eta(\omega) = \frac{\matter\eta_0\,\omega\tau}{1 + \omega^2\tau^2} ,
\end{gathered} \label{eq:dynamic}$$

and the first is the paper's [](/paper/#eq:maxwell). Every entry of the tables obeys the same law, so we may restore
the indices. The average of the last section, $\tfrac12\mathrm{Re}[a^*b]$ with $a = \tilde{\matter T}_{ij}$ and $b =
-i\omega U_{ij}$, then gives the heat $\mathrm{Re}\,\matter\eta\;\omega^2U_{ij}^*U_{ij}$. So $\mathrm{Re}\,\matter\eta$
is the dissipative part, the friction, and $\mathrm{Im}\,\matter\eta$ is stored and returned. In chapter 4.1 the
friction was the imaginary part of $\chi$, because $\chi$ links the swing to the push. Here $\matter\eta$ links the
stress to the rate of shear, which runs a quarter swing ahead of the shear, so the part of the stress in step with the
rate, $\mathrm{Re}\,\matter\eta$, is the part that does work.[^modulus]

**Two limits.** When $\omega\tau \ll 1$, $\matter\eta(\omega) \to \matter\eta_0$: slowly stirred, the material is a
Newtonian liquid of viscosity $\matter\eta_0$, its everyday viscosity. When $\omega\tau \gg 1$, $\matter\eta \approx
\matter\eta_0/(-i\omega\tau) = i\matter\mu_\infty/\omega$, so $\tilde{\matter T} = 2\matter\mu_\infty U$: the stress
is in step with the shear, and the material answers as 4.3's solid of rigidity $\matter\mu_\infty$. Its friction then
falls as

$$\mathrm{Re}\,\matter\eta \to \frac{\matter\eta_0}{(\omega\tau)^2} = \frac{\matter\mu_\infty^2}{\matter\eta_0\,\omega^2} ,$$

the tail of the paper's sentence. The rigidity against a sudden shear, $\matter\mu_\infty$, is the **unrelaxed
rigidity**. The rigidity against a slow one, $\sym{relaxed-modulus}{\matter\mu_0}$, is the **relaxed rigidity**, and
for a Maxwell liquid it is zero, because a held shear loses all its stress. The paper calls their difference,
$\Delta\matter\mu = \matter\mu_\infty - \matter\mu_0$, the stiffness that relaxes. It also calls the same quantity the
**weight** of a source of friction, because it fixes the friction added up over all frequencies (chapter 4.5 shows
why, and the Stretch problem below checks it for Maxwell's model).

**A number.** Honey's everyday viscosity is about $10\unit{Pa\,s}$. We assume, for illustration, an unrelaxed
rigidity of $1\unit{GPa}$, a plausible size: about half of water's stiffness against compression, 2.2 GPa
([chapter 4.3](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound)). Honey's relaxation time is
then $\tau = 10/10^9 = 10\unit{ns}$. Stirred once a second, $\omega\tau = 6 \times 10^{-8}$, and its friction is
$\matter\eta_0$ to within a few parts in $10^{15}$.

<!-- diagram: tut-visc-maxwell — Left: the Maxwell element drawn horizontally, a zigzag spring labelled "μ∞" joined
end to end with a dashpot (an open cylinder with a piston and rod) labelled "η₀", the left end fixed to a hatched wall
and the right end carrying a small arrow "shear". Right: a plot of the stress T/T(0) against t/τ from −0.5 to 4, with
the shear (thin, grey) stepping from 0 to ũ₀ at t = 0 and staying there, and the stress (solid) jumping to 1 at t = 0
and falling as e^{−t/τ}; a tick at t/τ = 1 where the stress is 1/e = 0.37, labelled "τ = η₀/μ∞". Caption: "Look first
at the stress: it jumps when the shear is applied, because the spring takes all of it, and dies away as the dashpot
gives way, while the shear stays. The curve is exact." -->

## At fixed stiffness, the more viscous liquid has less friction at the frequencies of heat

Heat shakes matter at many frequencies. A body whose friction is the same at every frequency glows brightest where
$\hbar\omega = 2.82\,\kB T$, and we compare frictions there.[^peak] At 293 K this is $\omega = 1.08 \times
10^{14}\unit{s^{-1}}$. An angular frequency $\omega$ is $\omega/2\pi$ cycles a second, so this is $1.72 \times
10^{13}$ cycles a second, or 17 THz. We estimate the Maxwell friction there for two liquids of the same
stiffness.

**The inputs.** Honey, with $\matter\eta_0 = 10\unit{Pa\,s}$ and the assumed $\matter\mu_\infty = 1\unit{GPa}$, has
$\omega\tau = 1.1 \times 10^6$. A Maxwell liquid with water's viscosity, $10^{-3}\unit{Pa\,s}$, and the same assumed
rigidity has $\tau = 1\unit{ps}$ and $\omega\tau = 108$. Both are deep in the tail, $\omega\tau \gg 1$.

**The arithmetic.** From the tail, $\matter\mu_\infty^2/\matter\eta_0\omega^2 = 10^{18}/(\matter\eta_0 \times 1.17 \times
10^{28})$:

$$\mathrm{Re}\,\matter\eta \approx 8.5 \times 10^{-12}\unit{Pa\,s}\ \text{(honey)}, \qquad 8.5 \times
10^{-8}\unit{Pa\,s}\ \text{(Maxwell water)} .$$

**The comparison.** At the same stiffness, the liquid that is ten thousand times more viscous to stir has ten thousand
times less friction at the peak of the glow. The two curves cross where the two frictions are equal,
$\matter\eta_{\rm h}(1 + \omega^2\tau_{\rm w}^2) = \matter\eta_{\rm w}(1 + \omega^2\tau_{\rm h}^2)$, with h for honey
and w for water. With $\tau = \matter\eta_0/\matter\mu_\infty$ this gives
$\omega = \matter\mu_\infty/\sqrt{\matter\eta_{\rm h}\matter\eta_{\rm w}} = 10^{10}\unit{s^{-1}}$, four powers of ten
below the glow. Both frictions lie far below the paper's **placeholder**, the constant friction of
$10^{-3}\unit{Pa\,s}$ that it uses as a reference for every glow: honey's by a factor of $10^8$, the Maxwell water's by
$10^4$. The everyday viscosity says almost nothing about the friction at 17 THz.

This answers the chapter's question. Far above $1/\tau$ the spring takes nearly all of the shear, the stress is
$2\matter\mu_\infty U$, and the dashpot moves with the rate $\matter T/2\matter\eta_0 \approx \matter\mu_\infty
U/\matter\eta_0$. Its heat goes as $\matter\eta_0$ times the square of that rate, so as
$\matter\mu_\infty^2|U|^2/\matter\eta_0$. A more viscous dashpot moves less under the same stress, and so it makes less
heat. The condition matters: this holds at a fixed stiffness $\matter\mu_\infty$.

<!-- diagram: tut-visc-tails — Log–log axes: ω from 10⁴ to 10¹⁵ s⁻¹ (horizontal), Re η from 10⁻¹⁶ to 10² Pa s
(vertical). Two exact curves η₀/(1 + ω²τ²) with μ∞ = 1 GPa: honey (η₀ = 10 Pa s, τ = 10 ns), plateau at 10 bending
near ω = 10⁸ s⁻¹ and falling as ω⁻²; Maxwell water (η₀ = 10⁻³ Pa s, τ = 1 ps), plateau at 10⁻³ bending near 10¹² s⁻¹
and falling as ω⁻². Each tail continued by a thin dashed line μ∞²/η₀ω². A small dot where the curves cross, at
ω = μ∞/√(η_h η_w) = 10¹⁰ s⁻¹ exactly, Re η = 1.0 × 10⁻³ Pa s, on the placeholder line. The band of the thermal
glow at 293 K shaded, where the Planck radiance x³/(eˣ − 1), x = ħω/k_BT, exceeds a tenth of its peak: x from 0.420 to 8.30, ω from 1.61 × 10¹³ to
3.18 × 10¹⁴ s⁻¹ (2.6 to 51 THz), as in the paper's fig:materials; a thin vertical tick at the peak, x = 2.821,
ω = 1.08 × 10¹⁴ s⁻¹. A horizontal dotted line at 10⁻³ Pa s labelled "placeholder" at its right end (it coincides with
the Maxwell water's plateau on the left). At the peak, honey's curve lies four powers of ten below water's
(8.5 × 10⁻¹² against 8.5 × 10⁻⁸ Pa s). Labels at the curves' plateaus, never on the band. Caption: "Look first at
where the two curves cross: below it honey has the more friction, above it the less, and the band of heat lies far
above it. Curves exact; the stiffness of 1 GPa is an illustration." -->

The paper's real water is different again. Its friction at terahertz frequencies comes from motions much faster than
Maxwell's rearrangement: the stretching of the hydrogen bonds between neighbouring molecules, near 8 THz, and the
rocking of the molecules. The paper takes it from a computer simulation of water. Near 8 THz the simulated friction is
$2 \times 10^{-4}\unit{Pa\,s}$, a third of the same simulated water's everyday viscosity, $7 \times
10^{-4}\unit{Pa\,s}$ ([*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat)). At
the glow's peak, 17 THz, it has fallen to $4.2 \times 10^{-5}\unit{Pa\,s}$.

A friction that changes with frequency is not one number, so the paper's Table [](/paper/#tab:materials) compares
materials through the **effective friction** $\sym{effective-friction}{\matter\eta_{\rm eff}}$: the constant friction,
the same at every frequency, that would make the body glow with the same total power. It is an average of
$\mathrm{Re}\,\matter\eta$ over the glow's band (where the glow is brighter than a tenth of its peak, 2.6 to 51 THz
at 293 K), in which each frequency counts in proportion to the Planck spectrum, the brightness that a constant
friction would give there. Water's is $5.4 \times 10^{-5}\unit{Pa\,s}$, near its
friction at the glow's peak and four times below the friction near 8 THz, because most of the glow comes from well
above 8 THz.

Maxwell's model explains the direction of the effect: the slow rearrangement that makes a liquid viscous is frozen at
the frequencies of heat. It does not give water's number, which belongs to motions the model leaves out. So it shows
that honey can glow less than water, at the same stiffness, not that it does.

<!-- try: maxwell-liquid — MaxwellLiquid. The curve Re η(ω) = η₀/(1 + ω²τ²) of one Maxwell liquid on log–log axes
(ω from 10⁴ to 10¹⁶ s⁻¹, Re η from 10⁻¹⁸ to 10⁴ Pa s), with its plateau η₀ and its tail μ∞²/η₀ω² drawn as thin dashed
lines, the dotted placeholder at 10⁻³ Pa s, and the band of the thermal glow shaded where the Planck radiance
x³/(eˣ − 1), x = ħω/k_BT, exceeds a tenth of its peak (x from 0.420 to 8.30), with a tick at its peak x = 2.821. Three
log sliders: η₀ from 10⁻⁴ to 10³ Pa s, μ∞ from 0.1 to 100 GPa, and the temperature from 200 to 2000 K (which moves the
band). Readouts: τ = η₀/μ∞; Re η at the glow's peak; and the area (2/π)∫₀^∞ Re η dω = μ∞, labelled "the weight;
chapter 4.5 explains why it is fixed". Presets: "water's placeholder" (η₀ = 10⁻³ Pa s, μ∞ = 1 GPa), "honey" (10 Pa s,
1 GPa), "copper's electrons" (μ∞ = 38 GPa, τ = 2.5 × 10⁻¹⁴ s, so η₀ = 9.5 × 10⁻⁴ Pa s). Opens on honey at 293 K (Re η
at the peak 8.5 × 10⁻¹² Pa s). Predictions above it, unanswered in the text just before: "Make the honey a thousand
times more viscous, keeping its stiffness. Does its friction at the frequencies of heat rise or fall?" (It falls a
thousandfold, to 8.5 × 10⁻¹⁵ Pa s.) Then: "Choose copper's electrons and change η₀ at fixed μ∞. Which τ gives the most
friction at the glow's peak?" (τ = 1/ω = 9.2 × 10⁻¹⁵ s, giving μ∞/2ω = 1.8 × 10⁻⁴ Pa s, the ceiling of the next
section.) Keyboard on every slider, both themes, phone width. -->

## A metal's electrons relax like a Maxwell liquid, and their friction has a ceiling

In a metal, some electrons belong to no single atom and move through the whole crystal. These are the **free
electrons**, one per atom in copper. Quantum mechanics allows at most two electrons in each state of motion, so the
electrons cannot all be slow: they fill the states one by one, from the slowest upward, up to an energy
$\sym{fermi-energy}{E_F}$, the **Fermi energy**. The fastest of them move at the **Fermi speed**
$\sym{fermi-speed}{v_F}$, with $E_F = \tfrac12mv_F^2$ and $m = 9.11 \times 10^{-31}\unit{kg}$ the electron's mass. At
rest the electrons' velocities point equally in every direction. A shear makes this spread of velocities lopsided, and
collisions with the vibrating atoms even it out again in the **collision time** $\tau$, which plays the part of the
relaxation time.

The paper states the electrons' friction, which this chapter takes without proof (chapter 10.3 derives it):

$$\mathrm{Re}\,\matter\eta = \frac{\tfrac15\sym{electron-density}{\matter n}\,m v_F^2\,\tau}{1 + \omega^2\tau^2} ,$$

with $\matter n$ the number of free electrons per cubic metre. The $\tfrac15$, taken here as stated, comes from
averaging over the directions in which the electrons move. The friction has Maxwell's form because the lopsided spread
of velocities carries a stress, which the collisions relax. It assumes a collision time that does not depend on the
frequency, which the paper trusts to about a factor of two. **A check.** This is [](#eq:dynamic) with $\matter\eta_0 =
\tfrac15\matter n m v_F^2\tau$, so $\matter\mu_\infty = \matter\eta_0/\tau = \tfrac15\matter n m v_F^2 = \tfrac25\matter
nE_F$. This is the paper's weight of the electrons' friction, the stiffness that relaxes, since here too $\matter\mu_0 =
0$. The units agree: $\matter n m v_F^2$ is in $\mathrm{kg\,m^{-1}\,s^{-2}}$, which is a pascal.

**Numbers.** Copper has four atoms in a cube of side 0.3615 nm, so $\matter n = 8.47 \times 10^{28}\unit{m^{-3}}$, and
its Fermi energy is $7.0\unit{eV}$ ($1\unit{eV} = 1.60 \times 10^{-19}\unit{J}$).[^fermi] Then $\matter\mu_\infty =
0.4 \times 8.47 \times 10^{28}\unit{m^{-3}} \times 1.12 \times 10^{-18}\unit{J} = 3.8 \times 10^{10}\unit{Pa}$, the
paper's 38 GPa. With the collision time $\tau = 2.5 \times 10^{-14}\unit{s}$ that the paper takes from copper's
electrical conductivity, $\matter\eta_0 = 9.5 \times 10^{-4}\unit{Pa\,s}$: stirred slowly, copper's electrons would be
about as viscous as water. At the glow's peak $\omega\tau = 2.7$, the paper's "about one", and $\mathrm{Re}\,\matter\eta
= 9.5 \times 10^{-4}/8.3 = 1.1 \times 10^{-4}\unit{Pa\,s}$.

The paper's table gives copper the effective friction $1.3 \times 10^{-4}\unit{Pa\,s}$. Copper's friction is far from
constant across the glow's band: it falls 55-fold, from $8.2 \times 10^{-4}\unit{Pa\,s}$ at the band's lower edge, 2.6
THz, to $1.5 \times 10^{-5}\unit{Pa\,s}$ at its upper edge, 51 THz. The table's number is the average weighted by the
Planck spectrum, and it lands near the value at the peak because the excess below the peak offsets the deficit above
it.

**The ceiling.** We want the largest friction that any collision time can give at a fixed $\omega$ and
$\matter\mu_\infty$. Since $\matter\eta_0 = \matter\mu_\infty\tau$, the friction is $\matter\mu_\infty\,\tau/(1 +
\omega^2\tau^2)$. Its derivative with respect to $\tau$ is $\matter\mu_\infty(1 - \omega^2\tau^2)/(1 +
\omega^2\tau^2)^2$, which is zero at $\omega\tau = 1$, positive below and negative above. So the largest value is at
$\omega\tau = 1$, and

$$\boxed{\;\mathrm{Re}\,\matter\eta \le \frac{\matter\mu_\infty}{2\omega} = \frac{\matter n m v_F^2}{10\,\omega}\;} ,
\label{eq:ceiling}$$

the paper's "the friction cannot exceed $\tfrac1{10}\,nmv_F^2/\omega$". Equality holds when $\omega\tau = 1$. Copper
is near it: the ceiling is $1.8 \times 10^{-4}\unit{Pa\,s}$, and copper reaches 65% of it. Honey is far from it: its
ceiling at the same frequency is $\matter\mu_\infty/2\omega = 4.6 \times 10^{-6}\unit{Pa\,s}$, and it reaches two
millionths of that. A collision time longer than $1/\omega$ lowers the friction, because the electrons then answer as
a solid.

<!-- diagram: tut-visc-ceiling — One panel: Re η = μ∞τ/(1 + ω²τ²) against τ on a logarithmic axis from 10⁻¹⁶ to
10⁻¹² s, at ω = 1.082 × 10¹⁴ s⁻¹ and μ∞ = 38.1 GPa (copper: n = 8.47 × 10²⁸ m⁻³, E_F = 7.03 eV, μ∞ = ⅖nE_F), on a
linear vertical axis from 0 to 2 × 10⁻⁴ Pa s. The peak 1.76 × 10⁻⁴ Pa s at τ = 1/ω = 9.24 × 10⁻¹⁵ s marked by a thin
horizontal dotted line labelled "μ∞/2ω" and a vertical tick "ωτ = 1". Copper's τ = 2.5 × 10⁻¹⁴ s marked by a dot on
the curve at 1.15 × 10⁻⁴ Pa s (ωτ = 2.71), labelled "copper". The curve is symmetric about the peak on the log axis (it
depends on ωτ + 1/ωτ). Caption: "Look first at the peak: no collision time gives more friction at this frequency than
μ∞/2ω. Copper's electrons sit just past it, at 65% of the ceiling. Curve exact." -->

The paper's Figure [](/paper/#fig:materials) draws each material's friction against $\omega/2\pi$ in THz, so the
glow's peak sits at 17 THz. Look first at copper's curve in panel (a): it is flat at low frequencies and bends down
near $\omega = 1/\tau$, at 6.4 THz. Then compare it with the dashed placeholder and with iron's dotted line. Iron's
outer electrons are partly held by its atoms, so the free-electron formula does not fit them, and for iron the paper
draws the ceiling, falling as $1/\omega$: "an envelope over every collision time, not the spectrum of any one metal".

{{paper fig:materials}}

## A ringing solid's friction is its quality factor

The paper writes the friction inside a solid through the quality factor of its sound. We want that link. We assume that
**a solid's internal friction is a viscous stress**: on top of 4.3's Hooke stress $2\matter\mu\,\tilde u_{ij}$, the
solid carries a stress $2\,\mathrm{Re}\,\matter\eta\;\dot{\tilde u}_{ij}$, of the same form as a liquid's. Take a shear
vibration of the solid at the frequency $\omega$, with phasor $U_{ij}$. Its energy passes back and forth between the
strain and the motion, as 4.1's cart's did, so on average each holds half. The strain holds $\matter\mu\,\tilde
u_{ij}\tilde u_{ij}$ per cubic metre ([chapter
4.3](/tutorial/response/elastic-bodies/#a-strain-stores-energy-half-the-stress-times-the-strain)), whose average is
$\tfrac12\matter\mu\,U_{ij}^*U_{ij}$, so the energy per cubic metre is $E = \matter\mu\,U_{ij}^*U_{ij}$. The friction
takes $\mathrm{Re}\,\matter\eta\,\omega^2U_{ij}^*U_{ij}$ per second. Chapter 4.1 wrote the [loss of a
ring-down](/tutorial/response/oscillator/#friction-makes-the-swing-die-away-and-the-quality-factor-counts-how-slowly) as
$\dd E/\dd t = -\Gamma E$ and defined $Q = \omega_0/\Gamma$, the mode's own frequency over its damping rate. Here the
mode's frequency is $\omega$, so $\Gamma = \mathrm{Re}\,\matter\eta\,\omega^2/\matter\mu$ and $Q = \omega/\Gamma$ give

$$\boxed{\;\mathrm{Re}\,\matter\eta = \frac{\matter\mu}{\omega Q} = \frac{\matter\rho c_T^2}{\omega Q}\;} ,
\label{eq:q-friction}$$

with 4.3's [$\matter\mu = \matter\rho c_T^2$](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound).
This is the paper's formula in [*Volume and surface emission*](/paper/#par:volume-and-surface-emission). The units
agree: pascals over $\mathrm{s^{-1}}$ are pascal seconds.

**Which $Q$.** A bell's note rings for thousands of swings, because a vibration that spans the whole bell loses little
in each. The vibrations of heat are a few atoms long, and they scatter off one another and off every flaw of the
crystal within a few swings. The paper takes $Q \approx 10$ for them in steel, so that they travel about a nanometre before
they die away, as it says they do.[^mfp]

**A number.** The tutorial's steel has $\matter\rho = 7850\unit{kg\,m^{-3}}$ and $c_T = 3000\unit{m\,s^{-1}}$, so
$\matter\mu = 7.07 \times 10^{10}\unit{Pa}$, chapter 4.3's 71 GPa. At the glow's peak,
$\mathrm{Re}\,\matter\eta = 7.07 \times 10^{10}/(1.08 \times 10^{14} \times 10) = 6.5 \times 10^{-5}\unit{Pa\,s}$,
fifteen times below the placeholder and about half of copper's electrons' $1.1 \times 10^{-4}$. **A limit.** As
$Q \to \infty$ the friction vanishes: a solid that rings for ever turns no work into heat inside. A high $Q$ means
little friction. At a fixed $Q$ the friction falls as $1/\omega$, which the paper uses to find how a solid's glow grows
with temperature.

## A wave in a viscous medium fades, at the friction of its own frequency

A friction in a wave equation makes the wave's energy fall by the same factor in each metre (chapter 5.1 derives
this). For a gravitational wave the paper's [](/paper/#eq:damped) gives the damping rate in time, $\Gamma = 16\pi
G\matter\eta/c^2$ in $\mathrm{s^{-1}}$, Hawking's result, which chapter 7.8 derives. The wave moves at $c$, so its
energy falls per metre at the rate

$$\alpha = \frac{\Gamma}{c} = \frac{16\pi G\matter\eta}{c^3} ,$$

the paper's [](/paper/#eq:alpha), in $\mathrm{m^{-1}}$: $G\matter\eta$ is in $\mathrm{m^2\,s^{-3}}$, and dividing by
$c^3$ leaves $\mathrm{m^{-1}}$. This chapter shows which $\matter\eta$ to put there: not the viscosity measured by
stirring, but $\mathrm{Re}\,\matter\eta$ at the frequency of the wave. That is why the paper insists that "$\eta$ is the
friction at the frequency of the wave".

**A number.** A gravitational wave at 100 Hz has $\omega\tau \ll 1$ in water, so it meets water's everyday viscosity,
$10^{-3}\unit{Pa\,s}$. Then $\alpha = 16\pi \times 6.67 \times 10^{-11} \times 10^{-3}/(3.00 \times 10^8)^3 =
1.2 \times 10^{-37}\unit{m^{-1}}$. The wave's energy falls by the factor $e$ only after $1/\alpha = 8.0 \times
10^{36}\unit{m}$, or $8.5 \times 10^{20}$ light-years, the paper's "nearly $10^{21}$". A wave at the glow's peak meets
water's friction at 17 THz, $4.2 \times 10^{-5}\unit{Pa\,s}$, and so travels 24 times farther.

::: check
### Q

What is the stress on a plate sliding at $2\unit{cm\,s^{-1}}$ over water $0.5\unit{mm}$ deep?

### A

$\matter\eta v/d = 10^{-3} \times 0.02/(5 \times 10^{-4}) = 0.04\unit{Pa}$.

### Q

Why does a Maxwell liquid act as a solid at high frequency?

### A

Within one swing the dashpot has no time to flow, so only the spring yields: the stress follows the shear with the
rigidity $\matter\mu_\infty$, in step with it.

### Q

Why does a longer time between the electrons' collisions not always raise a metal's friction at a given frequency?

### A

The friction $\matter\mu_\infty\tau/(1 + \omega^2\tau^2)$ is largest at $\omega\tau = 1$. Beyond that, a longer
collision time lowers it, because the electrons then answer as a solid within each swing.

### Q

A solid rings at $Q = 100$ instead of 10. How does its friction at that frequency change?

### A

It is ten times smaller, since $\mathrm{Re}\,\matter\eta = \matter\mu/\omega Q$. For the tutorial's steel at the
glow's peak it is $6.5 \times 10^{-6}\unit{Pa\,s}$.
:::

**The idea to keep: viscosity is a stress that answers the rate of shear. A material whose stresses relax in a time
$\tau$ is a liquid when slow and a solid when fast, and its friction at the frequency $\omega$ is
$\matter\eta_0/(1 + \omega^2\tau^2)$. At the frequencies of heat, and at a fixed stiffness, that friction is smaller
the more viscous the liquid, so the everyday viscosity says little about the thermal glow.**

::: problems
### Practice

A Maxwell liquid has $\matter\eta_0 = 1\unit{Pa\,s}$ and $\matter\mu_\infty = 1\unit{GPa}$. Find $\tau$, and
$\mathrm{Re}\,\matter\eta$ at 1 MHz and at 1 THz.

::: solution
$\tau = 1/10^9 = 1\unit{ns}$. At 1 MHz, $\omega = 2\pi \times 10^6 = 6.3 \times 10^6\unit{s^{-1}}$ and $\omega\tau =
6.3 \times 10^{-3}$, so $\mathrm{Re}\,\matter\eta = 1/(1 + 3.9 \times 10^{-5}) = 1.0\unit{Pa\,s}$. At 1 THz, $\omega\tau
= 6300$, so $\mathrm{Re}\,\matter\eta = 1/(3.9 \times 10^7) = 2.5 \times 10^{-8}\unit{Pa\,s}$.
:::

### Stretch

A spring of stiffness $k$ and a dashpot whose force is $b$ times its speed are joined end to end, and the far end of
the spring is moved by $x(t)$. Show that the junction $q$ obeys 4.1's law with no mass, $b\dot q + kq = kx$, so that
$b$ plays the part of $\matter m\Gamma$. Show that the force on the moving end, $k(x - q)$, has the phasor
$k\,\tilde x\,(-i\omega\tau)/(1 - i\omega\tau)$ with $\tau = b/k$, Maxwell's form. Then check that the weight,
$\tfrac2\pi\int_0^\infty\mathrm{Re}\,\matter\eta\,\dd\omega$, is $\matter\mu_\infty$ for [](#eq:dynamic), whatever
$\matter\eta_0$ (chapter 4.5 shows why).

::: solution
The dashpot and the spring carry the same force, so $b\dot q = k(x - q)$. In phasors, $(k - i\omega b)\tilde q =
k\tilde x$, so $\tilde q = \tilde x/(1 - i\omega\tau)$, and the force is $k(\tilde x - \tilde q) = k\tilde x\,
(-i\omega\tau)/(1 - i\omega\tau)$. Slow, it vanishes; fast, it is $k\tilde x$, a bare spring. For the integral, put
$x = \omega\tau$: $\int_0^\infty \matter\eta_0\,\dd\omega/(1 + \omega^2\tau^2) = (\matter\eta_0/\tau)\int_0^\infty
\dd x/(1 + x^2) = \matter\mu_\infty\,\pi/2$, so $\tfrac2\pi$ times it is $\matter\mu_\infty$. A larger
$\matter\eta_0$ at fixed $\matter\mu_\infty$ makes the curve taller and narrower with the same area.
:::

### The paper

Silicon has two atoms in each cell of its crystal, and a uniform shear pushes one set of atoms against the other. The
two sets then vibrate against each other at 15.6 THz, a vibration that is seen in the light a crystal scatters (Raman
scattering), and so the paper calls the friction it makes a Raman line. The paper gives the line a weight of 18 GPa,
"averaged over directions", and says that "its friction, $0.03\,\mathrm{Pa\,s}$, is thirty times the placeholder".
Model the line as 4.1's damped oscillator, $\mathrm{Re}\,\matter\eta = \Delta\matter\mu\,\omega_0^2\Gamma/[(\omega_0^2 -
\omega^2)^2 + \Gamma^2\omega^2]$, show that at its centre it is $\Delta\matter\mu/\Gamma$, and check the paper's number
with the line's full width of $3\unit{cm^{-1}}$ (chapter 4.1's
[line](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push)).

::: solution
At $\omega = \omega_0$ the first term of the bottom vanishes, leaving $\Delta\matter\mu\,\omega_0^2\Gamma/\Gamma^2
\omega_0^2 = \Delta\matter\mu/\Gamma$. The width is $\Gamma = 2\pi c \times 300\unit{m^{-1}} = 5.65 \times
10^{11}\unit{s^{-1}}$, so $\mathrm{Re}\,\matter\eta = 1.8 \times 10^{10}/5.65 \times 10^{11} = 0.032\unit{Pa\,s}$, 32
times the placeholder. The true maximum lies a little below $\omega_0$ and is higher by only $1/4Q^2$, about $10^{-5}$
for $Q = 173$.
:::
:::

::: paper
- [Section VI](/paper/#sec:thermal), in the plain words of *The friction that matters*, says that honey "need not
  glow more than water".
- [*Absorption*](/paper/#par:absorption) writes [](/paper/#eq:damped) and [](/paper/#eq:alpha) with $\eta$ "the
  friction at the frequency of the wave" (chapters 5.1 and 7.8).
- [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat) writes
  [](/paper/#eq:maxwell), $\matter\mu_\infty = \matter\eta_0/\tau$, the free electrons with $\tfrac25\matter nE_F$ and
  the ceiling $\matter nmv_F^2/10\omega$, silicon's 0.03 Pa s and water's $2 \times 10^{-4}\unit{Pa\,s}$ near 8 THz;
  its sum rule [](/paper/#eq:friction-sum) is chapter 4.5's. Table [](/paper/#tab:materials) gives each material's
  effective friction, and Figure [](/paper/#fig:materials) its friction at each frequency.
- [*Volume and surface emission*](/paper/#par:volume-and-surface-emission) uses
  $\mathrm{Re}\,\matter\eta = \matter\rho c_T^2/\omega Q$.
- [Section VII](/paper/#sec:no-lens) and [Section IX](/paper/#sec:first-image) use the same internal friction for a
  body's optical depth and for the glow of the Earth's shells.
:::

::: deeper
- The GR course's lab [*How one layer pulls another*](https://neovand.github.io/general-relativity/chapter-11.html#fluid-shear-lab)
  shows the viscous stress between sliding layers as an experiment, and its section
  [11.4](https://neovand.github.io/general-relativity/chapter-11.html#11-4-perfect-fluids-derived-from-isotropy) builds
  the perfect fluid, which has no viscosity.
- L. D. Landau and E. M. Lifshitz, *Fluid Mechanics* (2nd ed., Pergamon, 1987), section 15, derives the viscous stress.
  Their *Theory of Elasticity* (3rd ed., 1986) treats internal friction in solids in section 34 and Maxwell's law, for
  highly viscous fluids, in section 36.
- J. C. Maxwell, "On the dynamical theory of gases", *Philosophical Transactions* 157 (1867), 49–88, introduces the
  relaxation law on pages 52–53, for bodies in general and then for a gas.
:::

::: history
### Maxwell and the time of relaxation

James Clerk Maxwell wrote the law of relaxation in "On the dynamical theory of gases" (*Philosophical Transactions*
157, 1867, pages 52–53). He defined a "time of relaxation" for bodies in general, from fluids that flow easily to
solids that slowly give way, and then applied it to a gas, whose stiffness against a sudden shear is its pressure. The
picture of a spring and a dashpot in series came later, as a way of drawing his law. Landau and Lifshitz give the same
law for highly viscous fluids in their *Theory of Elasticity*.
:::

[^letters]: Several letters return with new meanings. The viscosity $\matter\eta$ is not the rapidity or the
    $\eta_{\mu\nu}$ of Parts 6 and 7, nor the paper's vector $\boldsymbol\eta$ of chapter 13.2. The relaxation time
    $\tau$ is not chapter 3.2's averaging time, the optical depth of chapter 5.5 or the proper time of Part 6; it is a
    time of the material, so it stays uncoloured. The pressure $p$ is not a momentum, and the electron density $\matter
    n$ is not chapter 3.2's noise or chapter 5.1's refractive index. The shear's phasor $U_{ij}$ is not 4.3's
    parameter $s$ or the ratio $s$ of the paper's Section IV.

[^modulus]: The stress per shear, $\tilde{\matter T} = 2\sym{complex-modulus}{\matter\mu(\omega)}\,U$, is the
    **complex modulus** $\matter\mu(\omega) = -i\omega\matter\eta(\omega) = \matter\mu_\infty(-i\omega\tau)/(1 -
    i\omega\tau)$, which runs from $\matter\mu_0 = 0$ at $\omega = 0$ to $\matter\mu_\infty$ at high frequency. Its
    friction shows as $\mathrm{Im}\,\matter\mu = -\omega\,\mathrm{Re}\,\matter\eta < 0$, the opposite sign to 4.1's
    $\mathrm{Im}\,\chi$, because a modulus is a force per displacement, the inverse of 4.1's displacement per force.
    Books on the flow of materials write oscillations as $e^{+i\omega t}$, and there the same loss appears as a positive
    "loss modulus". The paper works with $\mathrm{Re}\,\matter\eta > 0$, and chapter 4.5 treats $\matter\eta(\omega)$
    as a response function.

[^peak]: Chapter 10.1 derives the number 2.82 from Planck's law. Here it only fixes the frequency at which to compare.

[^fermi]: Chapter 10.3 derives $E_F = \hbar^2(3\pi^2\matter n)^{2/3}/2m$, which gives 7.03 eV for copper's
    $\matter n$, and $v_F = \sqrt{2E_F/m} = 1.57 \times 10^6\unit{m\,s^{-1}}$.

[^mfp]: A vibration of quality factor $Q$ keeps its energy for about $Q/\omega$, and in that time it travels
    $c_TQ/\omega$. At $\omega = \kB T/\hbar$ this is the paper's $\ell_s = Q\hbar c_T/\kB T$, which for $Q = 10$,
    $c_T = 3000\unit{m\,s^{-1}}$ and 293 K is 0.8 nm, a few atoms.
