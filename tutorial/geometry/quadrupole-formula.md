---
id: '7.7'
title: 'The quadrupole formula, from the near zone to the wave zone'
question: 'Why does a compact source radiate through the second time derivative of its quadrupole, and how does its field pass from Newton''s pull near it to a wave far away?'
part: '7'
requires: ['1.5b', '1.6', '2.3', '5.2', '5.4', '6.5', '7.2', '7.4', '7.5', '7.6']
paper: [sec:waves, eq:quadrupole, eq:dumbbell, eq:unresolved, eq:wave-zone, eq:rotor-amplitudes, fig:quadrupole, sec:regimes, sec:near-field, sec:one-pixel, fig:present, sec:vistas, eq:multipole, fig:binary-field]
figures: [fig:quadrupole, fig:present, fig:binary-field]
live: [quadrupole, near-to-far]
depth: A
---

Two masses of one kilogram each, one metre apart, spun sixteen times a second, send out $4.55\times10^{-41}$ watts:
about one graviton, the smallest packet of wave energy, every fifteen years.[^power] Two black holes in orbit have a
field that turns rigidly with them close by and winds into a spiral far away. Why does a compact source radiate
through the second time derivative of its quadrupole, and how does one field pass from Newton's pull near the source
to a wave far from it?

The wave reads the total stress inside the source, which the conservation of energy and momentum turns into half the
second time derivative of the second moment of its mass, and the near pull and the far wave are two ends of one
solution.

::: plain
Far from a source, a gravitational wave is made by the stresses inside the source: the momentum that its moving parts
carry, and the pushes and pulls between its parts. When the source is much smaller than its waves, only their total
matters, and the laws that keep energy and momentum from being made or lost turn it into half the acceleration of the
spread of the mass. So a body sends waves only when the shape of its spread of mass changes, as when a dumbbell spins
end over end.

Close to the source, the changing part of the field is Newton's gravity of the masses where they are now. Its pull
weakens as the fourth power of the distance, and its tide, the difference in the pull across a small region, as the
fifth power. Far away the tide of the wave weakens only as the distance. In the plane of the orbit the two tides are
equal at about a third of a wavelength.
:::

## Far away, each direction reads the stress at one wavevector

We assume that **the field is weak**, so that section 7.4's linear theory holds, and that **the field point is far
away**: many wavelengths off, with the rays from the source's parts parallel.

**The source.** The field equation
$\Box\sym{trace-reversed-perturbation}{\field{\bar h}}_{kl} = -16\pi G\matter T_{kl}/c^4$ of the
[linearized theory](/tutorial/geometry/linearized-gravity/#the-field-travels-at-the-speed-of-light) is the wave
equation $c^{-2}\partial_t^2u - \nabla^2u = s$ of section 5.2 in each component, with $s = 16\pi G\matter T_{kl}/c^4$.
Here $\sym{stress-energy-tensor}{\matter T}_{kl}$, in pascals, is the spatial block of the
[stress–energy tensor](/tutorial/relativity/stress-energy/#in-the-stresses-the-sign-is-that-of-a-flow-of-momentum): the
momentum along $k$ that crosses a unit area facing $l$ each second. A pressure counts as positive, a tension as
negative, and moving matter adds the momentum it carries, $\matter\rho\,\obs v_k\obs v_l$.

**Far away.** Section 5.2 found that
[far from a source](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source) each
angular frequency $\omega$ of the field reads the source's transform in time and space at the wavevector
$\omega\hat n/c$, divided by $4\pi r$, with $\hat n$ the unit vector from the source to the field point. With the
source $s$ above, this gives[^units]

$$\begin{gathered}\tilde{\field{\bar h}}_{kl}(\omega, r\hat n) = \frac{4G}{c^4r}\,e^{i\omega r/c}\,\matter{\tilde
T}_{kl}\Bigl(\omega, \frac{\omega\hat n}{c}\Bigr),\\ \sym{stress-transform}{\matter{\tilde T}_{kl}}(\omega, \vect k) =
\int\matter T_{kl}\,e^{i\omega t - i\vect k\cdot\vect x}\,\dd t\,\dd^3x .\end{gathered}$$

**The projector.** Over a few wavelengths the wave along $\hat n$ is a plane wave, and section 7.6 found that of such a wave in
harmonic gauge only $\sym{tt-projector}{\Lambda_{ij,kl}}(\hat n)\,\field{\bar h}_{kl}$ is
physical, the part across the direction of travel with no trace. So

$$\boxed{\;\begin{aligned}\sym{tt-strain}{\tilde{\field h}^{\rm TT}_{ij}}(\omega, r\hat n) &= \frac{4G}{c^4r}\,e^{i\omega
r/c}\\ &\quad\times\Lambda_{ij,kl}(\hat n)\,\matter{\tilde T}_{kl}\Bigl(\omega, \frac{\omega\hat n}{c}\Bigr) ,\end{aligned}\;}
\label{eq:far-stress}$$

and each direction reads the part of the stress that is transverse to the line of sight and has no trace.[^wavezone]
The trace reversal does not matter, because $\field h_{kl}$ and $\field{\bar h}_{kl}$ differ by a multiple of
$\delta_{kl}$, which $\Lambda$ removes, and the gauge ties the entries with a time index to the spatial ones.

## A compact source is read at zero wavevector, where its stress is half the acceleration of its quadrupole

We assume that **the source is compact**: its size $L$ is much smaller than its reduced wavelength $\lambda/2\pi =
1/k$, with $k = \omega/c$, so that $kL \ll 1$. Then $e^{-i\vect k\cdot\vect x} \approx 1$ across the source for every
$\vect k$ on the sphere, and every direction reads the same number,

$$\matter{\tilde T}_{kl}\Bigl(\omega, \frac{\omega\hat n}{c}\Bigr) \approx \matter{\tilde T}_{kl}(\omega, 0) = \int
e^{i\omega t}\Bigl[\int\matter T_{kl}\,\dd^3x\Bigr]\dd t ,$$

the total stress, transformed in time, with an error of about $kL$.

**The tensor virial identity.** Let $\sym{second-moment}{\matter I_{ij}} = \int\matter\rho\,x_ix_j\,\dd V$ be the
[second moment of the mass](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor),
in $\mathrm{kg\,m^2}$, measured from the centre of mass. The quadrupole tensor of
[section 2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)
is the same moment in another normalization, $\sym{quadrupole-tensor}{\matter Q_{ij}} = 3\matter I_{ij} - \matter
I_{kk}\delta_{ij}$, three times the trace-free part of $\matter I_{ij}$. We assume that **the matter is slow**, so that
$\matter T^{00} = \matter\rho c^2$, and that **no outside force acts**, the condition of the
[conservation law](/tutorial/relativity/stress-energy/#conservation-is-one-equation-with-four-parts) of section 6.5.
With $x^0 = ct$ that law reads, for the energy and for the momentum,

$$\partial_t\matter T^{00} + c\,\partial_i\matter T^{0i} = 0 ,\qquad \partial_t\matter T^{0k} + c\,\partial_i\matter
T^{ik} = 0 .$$

We multiply the first by $x_kx_l$, integrate over a region that holds the source, and integrate by parts; no boundary
term is left, because the source is confined, and $\partial_i(x_kx_l) = \delta_{ik}x_l + x_k\delta_{il}$, so

$$\frac{\dd}{\dd t}\int\matter T^{00}x_kx_l\,\dd V = c\int\bigl(\matter T^{0k}x_l + \matter T^{0l}x_k\bigr)\dd V .$$

We differentiate once more, use the second law, and integrate by parts again with $\partial_ix_l = \delta_{il}$:

$$\begin{aligned}&\frac{\dd^2}{\dd t^2}\int\matter T^{00}x_kx_l\,\dd V\\ &\quad= -c^2\int\bigl(x_l\,\partial_i\matter
T^{ik} + x_k\,\partial_i\matter T^{il}\bigr)\dd V\\ &\quad= 2c^2\int\matter T^{kl}\,\dd V ,\end{aligned}$$

because the table is symmetric. With $\matter T^{00} = \matter\rho c^2$, and $\matter T^{kl} = \matter T_{kl}$ because
lowering a spatial index changes nothing,

$$\boxed{\;\begin{gathered}\int\matter T_{kl}\,\dd V = \tfrac12\,\ddot{\matter I}_{kl} ,\\ \matter{\tilde
T}_{kl}(\omega, 0) = -\tfrac12\,\omega^2\matter{\tilde I}_{kl} ,\end{gathered}\;} \label{eq:virial}$$

the second form because each time derivative becomes $-i\omega$ under the transform. This is the **tensor virial
identity**: the total stress inside an isolated source, the momentum its parts carry together with the pushes and pulls
between them, is half the second time derivative of its second moment. For a static body it gives $\int\matter
T_{kl}\,\dd V = 0$, the von Laue theorem of section 6.5.[^selfgravity]

**A check: the rotor and its rod.** The rotor of section 5.4 is two masses $\matter m$ on a light rod of length $d$,
turning at $\Omega$ about the $z$ axis. The masses sit at $\pm\tfrac d2\hat u$, with $\hat u =
(-\sin\Omega t, \cos\Omega t, 0)$ along the rod, and each moves at the speed $\Omega d/2$ along $\hat w = (-\cos\Omega
t, -\sin\Omega t, 0)$. Their momentum flux is $2\matter m(\Omega d/2)^2\hat w_k\hat w_l$. The rod pulls each mass
inward with the force $F = \matter m\Omega^2d/2$ that keeps it on its circle, so it carries the tension $F$ along its
length $d$: its stress integrated over its volume gives $Fd$, and a tension is a negative momentum flux, so the rod
adds $-Fd\,\hat u_k\hat u_l$. Together,

$$\int\matter T_{kl}\,\dd V = \tfrac12\matter m\Omega^2d^2\bigl(\hat w_k\hat w_l - \hat u_k\hat u_l\bigr) .$$

The second moment is $\matter I_{kl} = \tfrac12\matter md^2\hat u_k\hat u_l$, and since $\dot{\hat u} = \Omega\hat w$ and
$\dot{\hat w} = -\Omega\hat u$, two derivatives turn $\hat u_k\hat u_l$ into $2\Omega^2(\hat w_k\hat w_l - \hat u_k\hat
u_l)$. So $\tfrac12\ddot{\matter I}_{kl}$ is the same table, at every instant (Figure [](#fig:rotor-stress)). Without the
rod the total would have the trace $\tfrac12\matter m\Omega^2d^2$, which $\ddot{\matter I}_{kl}$ lacks: a camera far
away reads stress, not only motion.

![Look first at the bar along the rod: the masses' momentum flux across the rod and the rod's tension along it add up
to half the acceleration of the second moment. Schematic.](tut-rotor-stress){#fig:rotor-stress}

**Back in time.** We put [](#eq:virial) into [](#eq:far-stress):

$$\tilde{\field h}^{\rm TT}_{ij}(\omega, r\hat n) = \frac{2G}{c^4r}\,e^{i\omega r/c}\,\Lambda_{ij,kl}(\hat
n)\bigl(-\omega^2\matter{\tilde I}_{kl}\bigr) .$$

Here $-\omega^2\matter{\tilde I}_{kl}$ is the transform of $\ddot{\matter I}_{kl}$, and $e^{i\omega r/c}$ is a delay by
$r/c$ (section 5.2). So

$$\boxed{\;\field h^{\rm TT}_{ij}(t, r\hat n) = \frac{2G}{c^4r}\,\Lambda_{ij,kl}(\hat n)\,\ddot{\matter
I}_{kl}\Bigl(t - \frac rc\Bigr) ,\;} \label{eq:strain}$$

with $\ddot{\matter I}{}^{\rm TT}_{ij} = \Lambda_{ij,kl}\ddot{\matter I}_{kl}$. This is the **quadrupole formula**: far
from a compact source the strain is $2G/c^4r$ times the part of $\ddot{\matter I}_{ij}$ across the line of sight with
no trace, at the retarded time.[^first] The trace of $\matter I_{ij}$ may be kept or removed, since $\Lambda$ removes
it, and a body whose second moment does not change sends no wave.[^dipole]

## The power is set by the third derivative of the quadrupole

A wave carries the energy flux, a power per unit area in $\mathrm{W\,m^{-2}}$,[^flux]

$$F = \frac{c^3}{32\pi G}\,\bigl\langle\dot{\field h}^{\rm TT}_{ij}\dot{\field h}^{\rm TT}_{ij}\bigr\rangle ,$$

averaged over a cycle. It is the $c^3\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\rangle/16\pi G$ of section 5.4,
because $\field h^{\rm TT}_{ij}\field h^{\rm TT}_{ij} = 2(\field h_+^2 + \field h_\times^2)$.

**The strain's square.** From here on $\matter I_{ij}$ means its trace-free part, so $\dddot{\matter I}_{ii} = 0$. By
[](#eq:strain), $\dot{\field h}^{\rm TT}_{ij}$ is $2G/c^4r$ times $\Lambda_{ij,kl}\dddot{\matter I}_{kl}$, and since
$\Lambda\Lambda = \Lambda$ and $\Lambda$ is unchanged when its two pairs of indices swap places (section 7.6), its
square is $\dddot{\matter I}_{ij}\Lambda_{ij,kl}\dddot{\matter I}_{kl}$. Section 7.6 built $\Lambda$ from $\delta_{ij} - \hat n_i\hat n_j$, which removes the part of a vector along
$\hat n$: $\Lambda$ removes that part from both sides of a table, then subtracts half the remaining table times the
trace that is left. With a subscript $n$ for a product with $\hat n$, as in $\dddot{\matter I}_{in} = \dddot{\matter
I}_{ij}\hat n_j$, that trace is $-\dddot{\matter I}_{nn}$. The first line below is $\Lambda\dddot{\matter I}$, and
multiplying it by $\dddot{\matter I}_{ij}$ term by term gives the rest:

$$\begin{aligned}\Lambda_{ij,kl}\dddot{\matter I}_{kl} &= \dddot{\matter I}_{ij} - \hat n_i\dddot{\matter I}_{nj} -
\dddot{\matter I}_{in}\hat n_j + \hat n_i\hat n_j\dddot{\matter I}_{nn}\\ &\quad + \tfrac12(\delta_{ij} - \hat n_i\hat
n_j)\,\dddot{\matter I}_{nn} ,\\ \dddot{\matter I}_{ij}\Lambda_{ij,kl}\dddot{\matter I}_{kl} &= \dddot{\matter
I}_{ij}\dddot{\matter I}_{ij} - \dddot{\matter I}_{nj}\dddot{\matter I}_{nj} - \dddot{\matter I}_{in}\dddot{\matter
I}_{in}\\ &\quad + (\dddot{\matter I}_{nn})^2 + \tfrac12(0 - \dddot{\matter I}_{nn})\,\dddot{\matter I}_{nn}\\ &=
\dddot{\matter I}_{ij}\dddot{\matter I}_{ij} - 2\,\dddot{\matter I}_{in}\dddot{\matter I}_{in} + \tfrac12(\dddot{\matter
I}_{nn})^2 .\end{aligned}$$

**The sky.** Over all directions, $\oint\hat n_i\hat n_j\,\dd\Omega = \tfrac{4\pi}3\delta_{ij}$ (section 6.5's average).
The integral $\oint\hat n_i\hat n_j\hat n_k\hat n_l\,\dd\Omega$ is unchanged by rotations and by exchanging its
indices, so it is built from the three pairings of $\delta$'s with one factor $a$, $a(\delta_{ij}\delta_{kl} +
\delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk})$. Setting $k = l$ and summing gives $\tfrac{4\pi}3\delta_{ij} =
5a\,\delta_{ij}$, so $a = 4\pi/15$. The middle term then gives $-2\cdot\tfrac{4\pi}3\dddot{\matter I}_{ij}\dddot{\matter
I}_{ij}$, and the last $\tfrac12\cdot\tfrac{4\pi}{15}(0 + 2\dddot{\matter I}_{ij}\dddot{\matter I}_{ij})$, the zero
from the trace:[^sky]

$$\begin{aligned}\oint\dddot{\matter I}_{ij}\Lambda_{ij,kl}\dddot{\matter I}_{kl}\,\dd\Omega &= 4\pi\Bigl(1 -
\frac23 + \frac1{15}\Bigr)\dddot{\matter I}_{ij}\dddot{\matter I}_{ij}\\ &= \frac{8\pi}5\,\dddot{\matter
I}_{ij}\dddot{\matter I}_{ij} .\end{aligned}$$

The bracket, $\tfrac25$, is section 5.4's two fifths of a rotor's power along its axis, where $\Lambda$ removes nothing.

**The power.** The power through a sphere of radius $r$ is $\oint F\,r^2\,\dd\Omega$, in which $r^2$ cancels the
$1/r^2$ of the strain's square. The prefactors are $(c^3/32\pi G)(2G/c^4)^2(8\pi/5) = G/5c^5$, so

$$\boxed{\;\sym{radiated-power}{P} = \frac{G}{5c^5}\,\bigl\langle\dddot{\matter I}_{ij}\dddot{\matter I}_{ij}\bigr\rangle\;}
\label{eq:power}$$

with the trace of $\matter I_{ij}$ removed ($G/c^5$ is in $\mathrm{s^3\,kg^{-1}\,m^{-2}}$, which leaves watts).

**The dumbbell.** The turning table of section 5.4 is

$$\matter I^{\rm turn} = -\tfrac12\matter{\Delta I}\begin{pmatrix}\cos2\Omega t & \sin2\Omega t\\ \sin2\Omega t &
-\cos2\Omega t\end{pmatrix} ,$$

with $\sym{moment-difference}{\matter{\Delta I}} = \tfrac12\matter md^2$ the difference of the principal second moments
in the plane of rotation; the constant rest of $\matter I_{ij}$ has no derivatives. The table holds $2\Omega t$: after
half a turn the pair looks the same, so its waves repeat twice in each turn, at $\omega = 2\Omega$. Each derivative brings
a factor $2\Omega$, and a table $\bigl(\begin{smallmatrix}a & b\\ b & -a\end{smallmatrix}\bigr)$ with $a^2 + b^2 = 1$ has
the square 2, so $\dddot{\matter I}_{ij}\dddot{\matter I}_{ij} = (\tfrac12\matter{\Delta I})^2(2\Omega)^6\times2 =
32\matter{\Delta I}^2\Omega^6$ at every instant. So

$$\boxed{\;P = \frac{32}5\,\frac{G\matter{\Delta I}^2\Omega^6}{c^5} = \frac85\,\frac{G\matter m^2d^4\Omega^6}{c^5} ,\;}$$

as section 5.4's last problem found by adding the rotor's pattern over the sky.

**Numbers.** At sixteen turns a second, $\Omega = 100.5\unit{s^{-1}}$ and $P = 4.55\times10^{-41}\unit W$. A graviton
of energy $2\hbar\Omega = 2.12\times10^{-32}\unit J$ (stated; section 8.3) leaves every $4.66\times10^8$ s, 14.8
years.

## Seen along its spin, a rotor's two polarizations share one amplitude

Seen along the spin, $\hat n = \hat z$, the turning table lies across the line of sight and has no trace, so $\Lambda$
leaves $\ddot{\matter I}{}^{\rm turn}$ whole. In the axes of section 5.4, $\vect e_1 = \hat x$ and $\vect e_2 = \hat y$,
the plus strain is $\field h_{11}$ and the cross strain $\field h_{12}$, and two derivatives of $\matter I^{\rm turn}$
give $2\matter{\Delta I}\Omega^2$ times the table of $\cos2\Omega t$ and $\sin2\Omega t$. So [](#eq:strain) gives
$\field h_+ = \field A\cos2\Omega(t - r/c)$ and $\field h_\times = \field A\sin2\Omega(t - r/c)$, with

$$\boxed{\;\sym{rotor-amplitude}{\field A} = \frac{4G\matter{\Delta I}\,\Omega^2}{c^4r} .\;}$$

With section 5.4's factors $(1 + \cos^2\iota)/2$ and $\cos\iota$ for the inclination $\iota$, this completes the
amplitudes of a rotor's two polarizations, which that section left to this one.[^amp] The tide of the wave, 7.6's
$\curv\tE_{ij} = -\tfrac12\ddot{\field h}^{\rm TT}_{ij}$, is then $\curv\tE_+ = 2\Omega^2\field A\cos2\Omega(t - r/c)$, so
the amplitude $\curv\tE_0$ of [section 1.5b](/tutorial/newton/complex-numbers/) is $2\Omega^2\field A$.

**A number.** For the pair above, $\matter{\Delta I} = 0.5\unit{kg\,m^2}$ and $\Omega = 100.5\unit{s^{-1}}$ give $\field
Ar = 1.67\times10^{-40}$ m. At 10,000 km, about one wavelength away, $\field A = 1.7\times10^{-47}$, some $10^{-26}$ of
the $10^{-21}$ that LIGO detects.

## A compact, slow body is a point in its own waves

The rotor's waves have the angular frequency $2\Omega$, so their wavelength is $\lambda = 2\pi c/2\Omega = \pi
c/\Omega$, while its masses move at $\obs v = \Omega d/2$. Dividing,

$$\boxed{\;\frac{\lambda}{d} = \frac\pi2\,\frac c{\obs v} .\;}$$

A pair a metre across turning once a second has $\obs v = 3.1\unit{m\,s^{-1}}$ and waves $1.50\times10^8$ m long,
150,000 km.[^unresolved]

A body whose parts move at $\obs v$ through distances like its size $L$ changes at about $\omega = \obs v/L$, so $\lambda/2\pi = c/\omega$ is about $L/(\obs v/c)$. So
[compactness](#a-compact-source-is-read-at-zero-wavevector-where-its-stress-is-half-the-acceleration-of-its-quadrupole)
is slowness: for the rotor $kd = 4\obs v/c$, and where the parts move near the speed of light the quadrupole formula
fails. No aperture resolves an object much smaller than its wavelength (section
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)), so a compact,
slow body is a point in its own radiation. A source larger than its waves, such as the power grid of section 5.2, needs
the whole of [](#eq:far-stress).

{{paper fig:quadrupole}}

::: try {#quadrupole}
On the left, the power that a turning pair sends in each direction; on the right, its wavelength against its size, to
scale. Both panels use the quadrupole formula, which assumes slow parts, so near the top of the slider, at two-thirds
of light's speed, the figure carries it past where it holds.

Predict: at 1 m/s, how many times its size is the wavelength? At what speed is it only ten times the size, and is the
source then compact, with $kd \ll 1$? Then drag the slider and check.
:::

## A swelling sphere and a smooth wheel send nothing

**A sphere that swells and shrinks.** A body that keeps its spherical symmetry has $\int\matter\rho\,x_ix_j\,\dd V =
\tfrac13\delta_{ij}\int\matter\rho r^2\,\dd V$ at every instant, because no direction is special. That is pure trace, and
$\Lambda_{ij,kl}\delta_{kl} = 0$ (section 7.6), so no wave leaves, however violently the body pulsates. This is part of
**Birkhoff's theorem**: outside any spherically symmetric body the field is the static field of its mass (stated;
section 11.1).

**An even pressure.** A pressure $\matter p(t)$ that is the same in all directions adds $\delta_{kl}\int\matter
p\,\dd V$ to $\int\matter T_{kl}\,\dd V$, pure trace, which $\Lambda$ removes.

**A smooth wheel.** A wheel turning steadily about its axis of symmetry replaces each piece of itself by an identical
piece, so $\ddot{\matter I}_{ij} = 0$ and nothing leaves. A body in steady motion in a straight line sends nothing
either, as section
[7.6](/tutorial/geometry/gravitational-waves/#a-body-in-steady-motion-sends-no-wave-and-neither-does-an-even-pressure)
showed from the principle of relativity.

## Near a slow source the field points at where the masses are now

Why is the changing field near a slow source Newton's field of the masses where they are now, although gravity travels
at the speed of light? We take the retarded solution of section 7.4 for $\field{\bar h}_{00}$ with $\matter T_{00} =
\matter\rho c^2$:

$$\begin{gathered}\field{\bar h}_{00}(t, \vect x) = \frac{4G}{c^2}\int\frac{\matter\rho(\vect y, t - R/c)}{R}\,\dd^3y
,\\ R = |\vect x - \vect y| .\end{gathered}$$

We assume that **the field point is in the near zone**, $kR \ll 1$ for every piece of the source, and expand the density
in its delay by Taylor's formula, $\matter\rho(t - R/c) = \matter\rho - (R/c)\dot{\matter\rho} +
(R^2/2c^2)\ddot{\matter\rho} - \dots$, all at the time $t$:

$$\begin{aligned}\field{\bar h}_{00} = \frac{4G}{c^2}\Bigl[&\int\frac{\matter\rho}{R}\,\dd^3y - \frac1c\,\frac{\dd}{\dd
t}\int\matter\rho\,\dd^3y\\ &+ \frac1{2c^2}\int\ddot{\matter\rho}\,R\,\dd^3y - \dots\Bigr] .\end{aligned}$$

The first term is $-4\field\Phi/c^2$, with $\field\Phi$ Newton's potential of the source as it is now. In the second
the factor $R$ of the delay cancels the $1/R$, leaving the rate of change of the total mass, zero because mass is
conserved. In the third we put $R = r - \hat n\cdot\vect y + \dots$, with $r$ measured from the centre of mass: its
first piece is $r$ times the second derivative of the mass, zero again, and its second is $-\hat n$ times the rate of
change of the total momentum, zero because momentum is conserved. What is left is smaller than the changing part of
the first term by about $(kr)^2$, because $\ddot{\matter\rho}$ is about $\omega^2\matter\rho$. The other entries of $\field{\bar h}_{\mu\nu}$ are smaller by $\obs v/c$ and $(\obs v/c)^2$, with $\obs v$ the speed of the matter
([section 7.4](/tutorial/geometry/linearized-gravity/#moving-matter-adds-a-potential-of-its-flow)). So, with both mass
and momentum conserved, the changing tide near a slow source is Newton's tide of the masses at their present places,
with an error of order $(kr)^2$, as
[section 5.2](/tutorial/waves/retarded-waves/#inside-the-near-zone-the-field-is-the-static-field-of-the-source-as-it-is-now)
found for a single field.

**Against the retarded positions.** Newton's field of the masses where they were a time $r/c$ ago, with one delay for
the whole source, is $\field\Phi - (r/c)\dot{\field\Phi} + \dots$, wrong at order $kr$. In the true field each piece's
own delay $R/c$ cancels its own $1/R$, so the first-order term is uniform and vanishes. For a turning pair at $kr = 0.1$
the whole tide of the all-zone solution of the next section, measured by its size $|\curv\tE|$, differs from Newton's
tide of the present positions by 0.14 per cent in the plane of the orbit and 0.5 per cent on its axis. The retarded
positions are turned back by $\Omega r/c =
kr/2$ (Figure [](#fig:present-positions)), which changes the two-armed pattern by about $kr$, 10 per cent.[^present]

**A body in steady motion.** For one body moving at the constant velocity $\obs{\vect V}$, $\matter\rho(\vect y, t) =
\matter\rho_0(\vect y - \obs{\vect V}t)$ (section 7.4 left its velocity terms to this one). The second term, linear
in $\obs{\vect V}$, vanishes. In the third, $\ddot{\matter\rho} = (\obs{\vect V}\cdot\nabla)^2\matter\rho$; two
integrations by parts move the derivatives onto $R$, and beside a small body $(\obs{\vect V}\cdot\nabla)^2R = \obs
V^2\sin^2\theta/R$, with $\theta$ the angle between the motion and the line from the body. So the third term is
$\tfrac12(\obs V/c)^2\sin^2\theta$ times the first: the field points at the body's present position to first order in
$\obs V/c$, although its news travels at $c$. This is the absence of gravitational aberration of
[section 0.4](/tutorial/evening/one-pixel/), derived here from linearized gravity ([section
6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now) found it at
every order).

{{paper fig:present}}

![Look first at the pixel's stretch axis: near a slow source it lies along the masses' present line, not the retarded
one, because the first-order delay adds only a uniform term, and that term is zero. Angles
exaggerated.](tut-present-delay){#fig:present-positions}

## One solution runs from Newton's pull near the source to the wave far away

Outside a compact source, linearized gravity in harmonic gauge has an exact solution, kept here to the mass quadrupole,
with $u = t - r/c$ and $\hat n$ from the source. We state it from Thorne [@Thorne1980]:

$$\begin{aligned}\field{\bar h}^{00} &= \frac{4G}{c^2}\Bigl[\frac{\matter M}{r} + \frac12\,\partial_i\partial_j\frac{\matter
I_{ij}(u)}{r}\Bigr],\\ \field{\bar h}^{0i} &= \frac{2G}{c^3}\Bigl[\frac{\dot{\matter I}_{ij}(u)\,\hat n_j}{r^2} +
\frac{\ddot{\matter I}_{ij}(u)\,\hat n_j}{c\,r} + \frac{(\matter{\vect L}\times\vect x)_i}{r^3}\Bigr],\\
\field{\bar h}^{ij} &= \frac{2G}{c^4}\,\frac{\ddot{\matter I}_{ij}(u)}{r} .\end{aligned}$$

Here $\matter M$ is the mass, $\matter{\vect L}$ the angular momentum and $\matter I_{ij}(u)$ the second moment at the
retarded time. We call it the **all-zone solution**. Each term is a function of $u$ over $r$, or a derivative of one, so
each obeys the wave equation outside the source (section 5.2), and together they meet the gauge condition
exactly.[^gauge] Beside the mass term, $\field{\bar h}^{00}$ holds the potential of the quadrupole, $\field{\bar
h}^{0i}$ its flow and the spin of section 7.5, and $\field{\bar h}^{ij}$ the wave of
[the first section](#far-away-each-direction-reads-the-stress-at-one-wavevector) before the projection.[^allzone]

**The tide in the plane.** We take a pixel at $(r, 0, 0)$ in the plane of a circular orbit, and its tide across the
plane, $\curv\tE_{zz} = c^2\curv R_{0z0z}$ (section 7.2). We write the turning table as the real part of
$-\tfrac12\matter{\Delta I}\bigl(\begin{smallmatrix}1 & i\\ i & -1\end{smallmatrix}\bigr)e^{-2i\Omega t}$, lower the
indices of the all-zone solution, undo its trace reversal, and put it into the linearized $\curv R_{0i0j}$ of
[section 7.2](/tutorial/geometry/curvature-and-tides/#near-slow-matter-the-curvature-is-newtons-tide) with $i = j = z$.
The derivatives can be taken by hand there, and with $k = 2\Omega/c$ they give

$$\boxed{\;\begin{aligned}\curv\tE_{zz} = \mathrm{Re}\Bigl[&\frac{G\matter{\Delta I}}{4r^5}\bigl((kr)^4 + 2i(kr)^3\\
&+ 3(kr)^2 + 15i\,kr - 15\bigr)\\ &\times e^{-2i\Omega(t - r/c)}\Bigr] .\end{aligned}\;} \label{eq:plane-tide}$$

**The two ends.** Near the pair, $kr \ll 1$, only the $-15$ is left: $\curv\tE_{zz} = -\tfrac{15}4(G\matter{\Delta
I}/r^5)\cos2\Omega t$, Newton's tide of the quadrupole, since the potential $-\tfrac12G\matter Q_{ij}x_ix_j/r^5$ of
section 2.3, with $\matter Q_{ij} = 3\matter I_{ij}$ for the trace-free turning table, has the second derivative
$\tfrac{15}2G\matter I_{xx}/r^5$ along $z$ at $(r, 0, 0)$, and $\matter I_{xx} = -\tfrac12\matter{\Delta I}\cos2\Omega
t$. Far away only the $(kr)^4$ is left, the edge-on wave, 7.6's $-\tfrac12\ddot{\field h}$ of the strain $\field A/2$.
In between, $15i\,kr$ is the first-order delay at work: with the retarded phase $e^{ikr}$, $-15(1 - ikr)e^{ikr} = -15
+ \dots$ has no first-order term, as in [the last
section](#near-a-slow-source-the-field-points-at-where-the-masses-are-now). The two changing amplitudes are

$$\curv\tE_{zz}^{\rm near} = \frac{15}{4}\,\frac{G\matter{\Delta I}}{r^5} ,\qquad \curv\tE_{zz}^{\rm far} =
\frac{4G\matter{\Delta I}\,\Omega^4}{c^4r} .$$

The near law is Newton's tide, falling as $r^{-5}$ while Newton's changing pull falls as $r^{-4}$, and the far law is
the wave. The squared size of the bracket in [](#eq:plane-tide) is $225 + 135(kr)^2 + 39(kr)^4 +
10(kr)^6 + (kr)^8$, so the changing tide has the amplitude

$$|\curv\tE_{zz}| = \frac{G\matter{\Delta I}}{4r^5}\sqrt{\begin{aligned}&225 + 135(kr)^2 + 39(kr)^4\\ &+ 10(kr)^6 +
(kr)^8\end{aligned}} ,$$

which runs from one law to the other.

**The crossover.** In the plane of the orbit the two laws are equal where $(kr)^4 = 15$, that is $r^4 =
\tfrac{15}{16}(c/\Omega)^4$:

$$\boxed{\;r = \Bigl(\frac{15}{16}\Bigr)^{1/4}\frac{c}{\Omega} = 0.313\,\lambda = 1.97\,\frac{\lambda}{2\pi} ,\;}$$

since $\lambda = \pi c/\Omega$. The **crossover** is the band of distances over which the field passes from one law to
the other. At its centre the exact field is three times either law, and its local law passes through $r^{-3}$, halfway
between $r^{-5}$ and $r^{-1}$, at $0.310\lambda$. The crossing lies beyond $\lambda/2\pi$, where $kr = 1$, because in
this component Newton's tide carries the factor 15 against the wave's 1 (Figure [](#fig:crossover)). Elsewhere the
crossing moves: on the axis of the orbit the two laws cross at $0.21\lambda$, and for the whole tide in the plane,
measured by $|\curv\tE|$, at $0.40\lambda$.[^section-xi]

![Look first at the open circle: in the plane of the orbit, the near law and the wave law of $\curv\tE_{zz}$ cross at
0.313 of a wavelength, about twice the reduced wavelength $\lambda/2\pi$, and the exact field of the all-zone solution runs
from one law to the other. Lines exact.](tut-crossover){#fig:crossover}

**Two black holes.** Two black holes of $30\,M_\odot$ each, 2200 km apart, turn by Kepler's law at $\Omega =
\sqrt{2G\matter m/d^3} = 27.3\unit{s^{-1}}$ (section
[1.8](/tutorial/newton/orbits-and-kicks/#a-circular-orbit-is-a-fall-that-keeps-missing)), so each moves at $\obs v =
\Omega d/2 = 0.100\,c$. Their waves have 8.7 Hz and are $\pi c/\Omega = 34{,}400$ km long, to within corrections of
order $(\obs v/c)^2$. So $\lambda/2\pi = 5500$ km, and in the plane of the
orbit the crossover is at 10,800 km, five times their separation. In the figure below the pattern turns rigidly inside
the dotted circle and winds into the wave's spiral outside it.

{{paper fig:binary-field}}

::: try {#near-to-far}
The changing tide $\curv\tE_{zz}$ of a turning pair in the plane of its orbit, orange for stretch and blue for
squeeze, from a fiftieth of a wavelength to ten wavelengths, with a probe that reads the field at its distance. Below,
[](#eq:plane-tide)'s amplitude against distance shows the two laws. A second slider changes the pair's orbital speed at
a fixed separation.

Answer the predictions at the top of the figure first. Then move the probe out from the pair and say where the
pattern stops turning rigidly and starts to wind into a spiral.
:::

**The idea to keep: far away, each direction reads the transverse, trace-free stress of the source at one wavevector. A
compact source is read at zero wavevector, where its total stress is half the second derivative of its quadrupole, so
its strain is $(2G/c^4r)\ddot{\matter I}{}^{\rm TT}$ and its power $(G/5c^5)\langle\dddot{\matter I}\dddot{\matter
I}\rangle$. Near the source the same solution is Newton's tide of the masses where they are now, falling as $r^{-5}$,
and in the plane of the orbit it meets the wave's tide at about a third of a wavelength.**

::: problems
### Practice

**[7.7]** A steel ball of radius 10 cm rings in its own heat at 300 K at $\omega = 9.49\times10^4\unit{s^{-1}}$
(15.1 kHz). Its trace-free second moment is $\mathrm{diag}(-1, -1, 2)$ times a number that swings at $\omega$ with the
root mean square $1.42\times10^{-16}\unit{kg\,m^2}$ (take it as given; section 4.3 finds it). Find the power and how
often a graviton, of energy $\hbar\omega$, leaves.

::: solution
The square of the table is 6, so [](#eq:power) gives $P = (6G/5c^5)\,\omega^6(1.42\times10^{-16}\unit{kg\,m^2})^2 =
4.9\times10^{-55}$ W. A graviton of $\hbar\omega = 1.0\times10^{-29}$ J then leaves every $6.5\times10^{17}$ years,
fifty million times the age of the universe.
:::

**[7.7]** In the plane of the black-hole pair's orbit, how far out does the wave's tide equal Newton's changing tide,
and why is that beyond $\lambda/2\pi$?

::: solution
At $0.313\lambda$, 10,800 km. Newton's tide across the plane carries the factor 15 and the wave's the factor $(kr)^4$,
so they meet where $(kr)^4 = 15$, at $kr = 1.97$ rather than 1.
:::

### Stretch

**[7.7]** Combine this section with section 1.8. Show that two masses $\matter m_1$ and $\matter m_2$ a distance $a$
apart in a circular orbit radiate $P = \tfrac{32}5G^4(\matter m_1\matter m_2)^2(\matter m_1 + \matter
m_2)/c^5a^5$. For two neutron stars of $1.4\,M_\odot$ 1000 km apart, find the orbital frequency, the wave frequency and
the power, and compare it with the Sun's $3.8\times10^{26}$ W.

::: solution
About the centre of mass the pair is a rotor with $\matter{\Delta I} = \mu a^2$, where $\mu = \matter m_1\matter
m_2/(\matter m_1 + \matter m_2)$ is the reduced mass, so $P = \tfrac{32}5G\mu^2a^4\Omega^6/c^5$, and Kepler's law
$\Omega^2 = G(\matter m_1 + \matter m_2)/a^3$ turns it into the stated form. Here $\Omega = 19.3\unit{s^{-1}}$, so the
orbit has 3.07 Hz and the waves 6.14 Hz, and $P = 1.8\times10^{40}$ W, $4.6\times10^{13}$ Suns.
:::

### The camera

**[7.7]** From the far-zone formula [](#eq:far-stress) and the tensor virial identity, derive the quadrupole formula
[](#eq:strain), then the dumbbell's power, and reproduce the power and the one graviton every fifteen years of the
opening.

::: solution
[](#eq:virial) turns [](#eq:far-stress) into [](#eq:strain), the flux and the sky integral $8\pi/5$ give [](#eq:power),
and the turning table gives $4.55\times10^{-41}$ W at $\Omega = 100.5\unit{s^{-1}}$. A graviton of $2\hbar\Omega =
2.12\times10^{-32}$ J (stated; section 8.3) leaves every $4.66\times10^8$ s, 14.8 years.
:::
:::

::: paper
- [Section V](/paper/#sec:waves): the paper's [](/paper/#eq:quadrupole), its power and its equations
  [](/paper/#eq:dumbbell), [](/paper/#eq:unresolved), [](/paper/#eq:wave-zone) and [](/paper/#eq:rotor-amplitudes);
  *What does not radiate*; Figure [](/paper/#fig:quadrupole).
- [Section III](/paper/#sec:regimes): the near zone, the wave zone and "matter is slow".
- [Section IV](/paper/#sec:near-field): the ringing ball's graviton.
- [Section VIII](/paper/#sec:one-pixel): the present positions to order $(kr)^2$, and Figure [](/paper/#fig:present).
- [Section XI](/paper/#sec:vistas): the paper's [](/paper/#eq:multipole), Figure [](/paper/#fig:binary-field) and the
  crossover at $0.3\lambda$.
:::

::: deeper
- The GR course's [section 18.5](https://neovand.github.io/general-relativity/chapter-18.html#18-5-retarded-solutions-the-field-receives-yesterday-s-news)
  builds the retarded field and the quadrupole formula.
- K. S. Thorne, "Multipole expansions of gravitational radiation", *Reviews of Modern Physics* 52, 299 (1980): the
  all-zone solution and its higher terms.
- M. Maggiore, *Gravitational Waves*, vol. 1 (Oxford, 2008), chapter 3: the formula, the sky integrals and the rotor.
:::

[^power]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equations
    [](/paper/#eq:quadrupole) and [](/paper/#eq:dumbbell); the paper rounds the power to $4.6\times10^{-41}$ W.

[^units]: With $\matter{\tilde T}_{kl}$ in $\mathrm{N\,m\,s}$ and $4G/c^4$ in $\mathrm{N^{-1}}$, the left side is in
    seconds, as the transform of a pure number must be.

[^wavezone]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equation [](/paper/#eq:wave-zone).

[^selfgravity]: Gravity is not part of $\matter T_{\mu\nu}$ (section 7.4's note), so a pair held by its own gravity
    needs more. Newton's field carries the momentum flux $(g_kg_l - \tfrac12\delta_{kl}g^2)/4\pi G$, whose divergence
    is the force $-\matter\rho\vect g$ on the matter, so the identity holds for matter and field together. For the
    rotor's masses in orbit the field's flux is $-(G\matter m^2/d)\hat u_k\hat u_l$, the rod's $-Fd\,\hat u_k\hat u_l$.

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equation
    [](/paper/#eq:quadrupole), for the wave zone, $r \gg \lambda/2\pi$. Near $r = \lambda/2\pi$ the terms in $1/r^2$
    and $1/r^3$ of [the all-zone
    solution](#one-solution-runs-from-newtons-pull-near-the-source-to-the-wave-far-away) are as large as the term in
    $1/r$.

[^dipole]: The two moments below the quadrupole cannot radiate: the mass $\matter M$ does not change, and the second
    derivative of $\matter M\vect x_{\rm cm}$ is the rate of change of the total momentum, which is zero.

[^flux]: Stated in sections [5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed) and
    5.4, and derived in section 7.8.

[^sky]: Maggiore (2008, chapter 3) gives the same integral in the form $\oint\Lambda_{ij,kl}\,\dd\Omega =
    \tfrac{2\pi}{15}(6\delta_{ik}\delta_{jl} + 6\delta_{il}\delta_{jk} - 4\delta_{ij}\delta_{kl})$.

[^amp]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equation [](/paper/#eq:rotor-amplitudes).

[^unresolved]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equation [](/paper/#eq:unresolved); its Sec. III has the
    estimate in [*Spin, speed and compactness*](/paper/#par:spin-speed-and-compactness).

[^present]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, in [*The absence of gravitational
    aberration*](/paper/#par:the-absence-of-gravitational-aberration), with Figure [](/paper/#fig:present).

[^gauge]: With $\partial_ju = -\hat n_j/c$, $\partial_j[f(u)/r] = -\hat n_j[f/r^2 + \dot f/cr]$, so the quadrupole
    terms of $\field{\bar h}^{0i}$ are $-(2G/c^3)\,\partial_j[\dot{\matter I}_{ij}(u)/r]$, and the spin term has no
    divergence. Then $\partial_0\field{\bar h}^{00}$ and $\partial_i\field{\bar h}^{i0}$ are $\pm(2G/c^3)
    \partial_i\partial_j(\dot{\matter I}_{ij}/r)$, and $\partial_0\field{\bar h}^{0i}$ and $\partial_j\field{\bar h}^{ji}$
    are $\mp(2G/c^4)\partial_j(\ddot{\matter I}_{ij}/r)$: each pair cancels.

[^allzone]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, as its equation [](/paper/#eq:multipole) and Figure
    [](/paper/#fig:binary-field). For a source whose trace varies, $\matter I_{ij}$ should be its trace-free part.

[^section-xi]: The crossover at $0.3\lambda$ was first shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, for $\curv\tE_{zz}$ in the plane
    of the orbit.
