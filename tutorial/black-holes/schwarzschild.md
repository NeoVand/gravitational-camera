---
id: '11.1'
title: 'Schwarzschild and Birkhoff; the horizon, light, the shadow, lensing'
question: 'Sections VII and XI put a camera beside a black hole: at a metre "the tide is $2\times10^{13}\,\mathrm{s^{-2}}$", a camera at rest $40\,GM/c^2$ away sees a shadow of angular radius "$7.3^\circ$", and the hole bends the sky into a ring $20^\circ$ in radius. What is the field outside a round mass in Einstein''s theory, exactly, and what does it do to clocks, to tides and to light?'
part: '11'
requires: ['1.3', '1.4', '1.6', '1.8', '6.3', '7.1', '7.2', '7.3', '7.4']
paper: [sec:no-lens, eq:lens-compactness, fig:black-hole-camera, sec:vistas, fig:black-hole, fig:sun-lens, sec:near-field, sec:regimes, sec:hole]
figures: [fig:black-hole, fig:black-hole-camera]
live: [shadow-and-ring]
depth: A
---

<!-- hero: Part 11's hero (P6b-DECISIONS item 11), made after the part's chapters in the 3D stone pipeline, with
image-model candidates in two runs as style references only. A small dark sphere, the horizon, with its photon ring as
a thin bright circle at 1.5 r_s; beside it a ring of free test masses at rest, squeezed 1 : 1 : −2 (orange stretch
along the radius, blue squeeze across, the distortion from this chapter's exact tide); and a fan of rays from one
side, from the orbit equation of the light section: those with b < b_c ending on the horizon, one winding once round
the photon sphere, the outer ones bent by 2r_s/b. Every mark from code. -->

**What you need:** chapter
[1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)'s shell theorem,
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)'s tide,
[1.8](/tutorial/newton/orbits-and-kicks/#energy-and-angular-momentum-fix-the-size-and-shape-of-an-orbit)'s escape
speed, [6.3](/tutorial/relativity/aberration/)'s aberration, and chapters [7.1](/tutorial/geometry/metric/) to
[7.4](/tutorial/geometry/linearized-gravity/): the metric, geodesic deviation, Einstein's equation and the weak field.
Chapter [5.5](/tutorial/waves/radiance/)'s lenses help in [the lens
section](#a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring).

The paper's [Section VII](/paper/#sec:no-lens) puts the camera beside a black hole and uses the hole as its lens,
because no lens of ordinary matter is compact enough to focus the field. Beside a hole of $1.36\times10^{23}$ kg
the tide is severe: "at a metre … the tide is $2\times10^{13}\,\mathrm{s^{-2}}$, enough to tear the camera apart".

[Section XI](/paper/#sec:vistas)'s [*A primordial graviton
background*](/paper/#par:a-primordial-graviton-background) puts a camera at rest $40\,G\matter M/c^2$ from a hole. In
gravitons the camera sees a black disc, the shadow, $7.3°$ in radius, and in light it sees the Milky Way drawn into a
ring $20°$ in radius. Other results of the paper rest on the same field: Section XI's falling camera and exploding
star, Section IV's bound on the camera's mass and Section III's compactness of one half. So we ask what the field
outside a round mass is in Einstein's theory, exactly, and what it does to clocks, to tides and to light.

This chapter opens Part 11, which goes on with spin and the no-hair theorem (11.2), Hawking radiation (11.3), black
holes under tides (11.4) and a reading of Section VII (R11).

{{paper fig:black-hole}}

By the end of the chapter we can compute the size of this figure's shadow, the size of its ring and the warmth of its
sky.

::: plain
Outside a round body, Einstein's theory allows only one field, and it depends only on the body's mass. This stays
true while the body pulsates, collapses or explodes.

The field has a special radius, the Schwarzschild radius: twice Newton's constant times the mass, divided by the
square of the speed of light. A body squeezed inside it is a black hole. A clock held there would stop, as seen from
far away, and no rocket could hold a camera still.

The tide outside the body is exactly Newton's, if the distance from the centre is measured by the circumference of a
circle round it. Light can circle a hole at one and a half Schwarzschild radii, so a hole blots out a disc of the
sky. Far from a mass, light bends by twice Newton's angle, so a mass acts as a lens and turns the light from behind it
into a ring.
:::

## Outside a round body, Einstein's field is fixed by the mass alone

We want the field outside a round body in Einstein's theory, because every black hole of the paper that does not
spin is such a field. We make two assumptions. **The field is static**: in suitable coordinates the metric does not
change in time, and it is unchanged if time is run backward, which forbids entries mixing $\dd t$ with a step in
space. **The field is round**, or spherically symmetric (chapter 1.3's word): every rotation about the centre leaves
it unchanged. We only sketch the metric itself, stating two components of Einstein's equation (the gap box names
what is skipped); everything the paper takes from it is derived in full.

Roundness gives a radius without a ruler from the centre. Through each point passes one sphere that the rotations
carry into itself, and we define $\sym{circumference-radius}{r}$ by its area, $4\pi r^2$. This is the **circumference
radius**: the circumference of a great circle of that sphere over $2\pi$, in metres. It is not the distance a ruler
would measure from the centre, which curvature makes longer. With $r$ and the angles $\vartheta$, $\varphi$ on the
sphere, the most general static round metric is

$$\dd s^2 = -\field f(r)\,c^2\dd t^2 + \frac{\dd r^2}{\field h(r)} + r^2\bigl(\dd\vartheta^2 +
\sin^2\vartheta\,\dd\varphi^2\bigr), \label{eq:ansatz}$$

with two unknown functions $\sym{metric-function}{\field f}$ and $\field h$, pure numbers.[^f] A term in
$\dd r\,\dd\vartheta$ would pick out a direction on the sphere, so roundness forbids it.

**The mass inside.** Einstein's equation, chapter
[7.3](/tutorial/geometry/einstein-equation/#einsteins-equation-ties-the-curvature-to-the-energy-and-stress-at-each-point)'s
$\curv G_{\mu\nu} = (8\pi G/c^4)\matter T_{\mu\nu}$, has a time–time component, the first of 7.3's constraints. Matter
of density $\matter\rho$ at rest has $\obs u_0 = \field g_{00}\obs u^0 = -c\sqrt{\field f}$, so $\matter T_{00} =
\matter\rho\,\obs u_0\obs u_0 = \matter\rho c^2\field f$ (a pressure adds nothing to this entry). For
[](#eq:ansatz) the component reads (stated; the gap box)

$$\frac{\dd}{\dd r}\Bigl[r\bigl(1 - \field h\bigr)\Bigr] = \frac{8\pi G\matter\rho\,r^2}{c^2} . \label{eq:tt}$$

Both sides are pure numbers, since $G\matter\rho$ is in $\mathrm{s^{-2}}$. We write $r(1 - \field h) = 2G\matter
m(r)/c^2$, which defines $\sym{mass-inside}{\matter m}(r)$ in kilograms. Then [](#eq:tt) becomes $\matter m' = 4\pi
r^2\matter\rho$: $\matter m(r)$ is **the mass inside** the sphere $r$, added shell by shell as in chapter 1.3's shell
theorem.[^binding] Outside the body $\matter\rho = 0$, so $\matter m = \matter M$, the body's mass. We write the
**Schwarzschild radius** of the mass as

$$\sym{schwarzschild-radius}{r_s} = \frac{2G\matter M}{c^2} ,$$

a length, since $G\matter M/c^2$ is in $\mathrm{m^3\,s^{-2}}$ over $\mathrm{m^2\,s^{-2}}$. Outside the body, then,
$\field h = 1 - r_s/r$.

**The time entry.** The radial–radial component in empty space reads (stated)

$$\frac{\field f'}{\field f} = \frac{1 - \field h}{r\,\field h} .$$

With $\field h = 1 - r_s/r$ the right side is $r_s/[r(r - r_s)]$, the derivative of $\ln(1 - r_s/r)$. So $\field f =
C(1 - r_s/r)$, and $C = 1$ because far away the far clock defines $t$. The result is the **Schwarzschild metric**,

$$\boxed{\;\dd s^2 = -\Bigl(1 - \frac{r_s}{r}\Bigr)c^2\dd t^2 + \frac{\dd r^2}{1 - r_s/r} + r^2\dd\Omega^2\;}
\label{eq:schwarzschild}$$

with $\dd\Omega^2 = \dd\vartheta^2 + \sin^2\vartheta\,\dd\varphi^2$.

**Limit.** The time entry is $-(1 + 2\field\Phi/c^2)$ with $\field\Phi = -G\matter M/r$, chapter
[7.1](/tutorial/geometry/metric/#free-fall-is-the-path-along-which-a-clock-ages-most)'s weak-field entry, and for $r
\gg r_s$ every entry tends to flat spacetime's. **Numbers.** The Schwarzschild radius is 2.95 km for the Sun, whose
radius is 696,000 km, 8.87 mm for the Earth, 0.202 mm for Section VII's hole of $1.36\times10^{23}$ kg and
$1.0\times10^{-25}$ m for the 70 kg person. Outside ordinary bodies, far larger than their $r_s$, chapter
[7.4](/tutorial/geometry/linearized-gravity/#a-weak-field-is-a-small-table-laid-on-flat-spacetime)'s linear theory,
which needs $r_s/r \ll 1$, serves. Near a black hole's horizon $\field g_{rr} = 1/(1 - r_s/r)$ is nowhere near flat,
and only the exact metric will do.

::: gap
This sketch states two components of Einstein's equation for [](#eq:ansatz) without computing them. The computation
takes 7.1's Christoffel symbols of the metric, the first being $\Gamma^r{}_{00} = \tfrac12\field h\field f'$, builds
7.2's Riemann tensor and the Einstein tensor from them, and finds

$$\curv G_{00} = \frac{\field f}{r^2}\bigl[r(1 - \field h)\bigr]', \qquad \curv G_{rr} = \frac{\field f'}{r\,\field f}
- \frac{1 - \field h}{r^2\,\field h} .$$

The GR course's section 17.1 does it line by line.
:::

**Birkhoff's theorem.** We now drop "static" and keep "round". The functions $\field f$ and $\field h$ may then depend
on $t$ too, and one more component appears, time–radial. In empty space it says $\partial\field h/\partial t = 0$
(stated), so the mass inside never changes and stays $\matter M$. The radial–radial component then fixes $\field f$
up to a factor that depends on $t$ alone, and relabelling $t$ removes it. So outside any round body, whether it
pulsates, collapses or explodes, the field is [](#eq:schwarzschild): this is **Birkhoff's theorem**, proved in the GR
course's section 17.1. Chapter
[7.7](/tutorial/geometry/quadrupole-formula/#a-swelling-sphere-and-a-smooth-wheel-send-nothing)'s swelling sphere
sends no wave, now in Einstein's full theory. Section XI's [*An exploding star*](/paper/#par:an-exploding-star)
changes the field outside only as its shell of neutrinos passes, because inside the shell the mass is the remnant's
(chapter R12). **What it means:** a camera outside a round body learns its mass and nothing else, however the inside
moves.

## At the Schwarzschild radius clocks stop, nothing can hover and nothing gets out

**Clocks.** A clock at rest at $r$ runs, by 7.1's $\dd\obs\tau = \sqrt{-\field g_{00}}\,\dd t$, at

$$\frac{\dd\obs\tau}{\dd t} = \sqrt{1 - \frac{r_s}{r}}$$

of the far clock's rate, which tends to 1 far away. At the Earth's surface it loses $6.96\times10^{-10}$, 22 ms a
year. The rate falls to zero at $r = r_s$: seen from far away, a clock held there would stop, and its light would
arrive redshifted without limit (Figure [](#fig:schw-clocks)). The sphere $r = r_s$ is the **horizon**, the surface from
inside which nothing escapes (stated below). A body of radius $R$ that fills it has the **compactness**
$\mathcal C = G\matter M/Rc^2$ (chapter
[0.4](/tutorial/evening/one-pixel/#no-lens-can-be-made-so-the-camera-computes-its-pictures)) at $R = r_s$, exactly
$\tfrac12$: Section III's "about one half for a black hole".

**Hovering.** To **hover** is to stay at rest at a fixed $r$, which takes a rocket. A camera at rest has $\obs u^\mu =
(c/\sqrt{\field f}, 0, 0, 0)$. A free body there would start to fall with $\dd^2r/\dd\obs\tau^2 =
-\Gamma^r{}_{00}(\obs u^0)^2$, by 7.1's geodesic equation. The gap box's $\Gamma^r{}_{00} = \tfrac12\field h\field
f'$, with $\field h = \field f$ and $\field f' = r_s/r^2$, gives $-\tfrac12\field f(r_s/r^2)\,c^2/\field f =
-G\matter M/r^2$. The rocket must cancel this. A step $\dd r$ is $\dd r/\sqrt{\field f}$ on the camera's own ruler,
so its accelerometer reads, in $\mathrm{m\,s^{-2}}$,

$$\boxed{\;a = \frac{G\matter M}{r^2\sqrt{1 - r_s/r}}\;} .$$

**Limit:** far away it is Newton's $G\matter M/r^2$. As $r \to r_s$ it grows without limit, Section XI's thrust that
"grows without limit as it nears the horizon". Beside a hole of 30 solar masses ($r_s = 88.6$ km), at $1.01\,r_s$, a
hovering camera needs $5.0\times10^{12}\unit{m\,s^{-2}}$, half a million million times the Earth's gravity.

![Look first at the horizon line: there a clock at rest stops, as seen from far away, and the push needed to hold it
grows without limit. Both curves are exact for the Schwarzschild metric.](tut-schw-clocks){#fig:schw-clocks}

**Inside.** For $r < r_s$ the factor $1 - r_s/r$ is negative, so $\field g_{00} > 0$ and $\field g_{rr} < 0$. A path
at fixed $r$ would then have $c^2\dd\obs\tau^2 < 0$, which no body or flash can have. Inside the horizon $r$ behaves
as a time: every path moves to smaller $r$, as every clock moves to later times (named here; the GR course's sections
17.2 and 17.3). A flash sent outward from inside also moves to smaller $r$, so nothing gets out. The infinite $\field
g_{rr}$ at $r_s$ is a fault of the coordinates, not of spacetime: the tide there is finite
([below](#the-tide-outside-a-round-mass-is-exactly-newtons)), and Eddington–Finkelstein coordinates cross it smoothly.
**What it means:** the horizon is a surface at which nothing can hover and from which nothing can leave, though a
falling body crosses it without noticing.

**The camera's mass bound.** Section IV's [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity) bounds the mass
of a camera at the distance $z$ from its scene, in metres. Its estimate takes the camera's mass $\matter M$ to lie
within a sphere of radius $z$. If $r_s$ were $z$ or more, that whole sphere would lie inside its own Schwarzschild
radius, and the camera would be a black hole. A camera that is not one therefore has $r_s < z$, or

$$\boxed{\;\matter M < \frac{zc^2}{2G}\;} .$$

This is an estimate, not a strict bound, because a camera of another shape need not fit in such a sphere.[^buchdahl]
For $z = 1$ m it is $6.7\times10^{26}$ kg, 113 Earth masses.

## The tide outside a round mass is exactly Newton's

We want the exact tide that chapter
[7.3](/tutorial/geometry/einstein-equation/#a-single-mass-stretches-twice-as-hard-as-it-squeezes-in-einsteins-theory-too)
promised. **The energy of a fall.** Chapter
[7.1](/tutorial/geometry/metric/#free-bodies-follow-geodesics-and-the-christoffel-symbols-hold-newtons-pull)'s box
found $\dd(\field g_{\alpha\nu}\obs u^\nu)/\dd\obs\tau = \tfrac12(\partial_\alpha\field g_{\mu\nu})\obs u^\mu\obs
u^\nu$. The metric [](#eq:schwarzschild) does not depend on $t$, so for $\alpha = 0$ the right side vanishes, and
$\field g_{00}\obs u^0 = -\field f\,c\,\dd t/\dd\obs\tau$ stays constant along every free path. We write

$$E = \field f\,\frac{\dd t}{\dd\obs\tau} ,$$

a pure number, the body's energy per unit of its rest energy (local to this chapter; 1 for a body at rest far away).
For a fall along a radius, 7.1's $\field g_{\mu\nu}\obs u^\mu\obs u^\nu = -c^2$ reads $-\field f c^2(\dd t/\dd\obs
\tau)^2 + (\dd r/\dd\obs\tau)^2/\field f = -c^2$. Multiplying by $\field f$ and using $E$,

$$\Bigl(\frac{\dd r}{\dd\obs\tau}\Bigr)^2 = c^2\bigl(E^2 - 1\bigr) + \frac{2G\matter M}{r} . \label{eq:radial}$$

This is Newton's energy equation, exact in the body's own time and the circumference radius. Differentiating with
respect to $\obs\tau$ and dividing by $2\,\dd r/\dd\obs\tau$,

$$\frac{\dd^2r}{\dd\obs\tau^2} = -\frac{G\matter M}{r^2}\quad\text{exactly.} \label{eq:fall}$$

**Across.** Two such bodies fall along neighbouring radii an angle $\delta\varphi$ apart, released at the same $r$
with the same $E$ (Figure [](#fig:schw-falling-pair)). By symmetry they stay at one $r$ at each $\obs\tau$, and
$\delta\varphi$ stays fixed. On the sphere through them the metric's $r^2\dd\varphi^2$ makes their separation
$\xi = r\,\delta\varphi$. This is also the separation that the falling bodies measure with their own rulers, because
motion shortens a ruler only along the motion (chapter
[6.1](/tutorial/relativity/lorentz/#a-moving-ruler-is-shorter-along-its-motion-and-distances-in-a-bodys-own-frame-are-longer)),
and the separation lies across it. So by [](#eq:fall)

$$\frac{\dd^2\xi}{\dd\obs\tau^2} = \delta\varphi\,\frac{\dd^2r}{\dd\obs\tau^2} = -\frac{G\matter M}{r^3}\,\xi ,$$

which by chapter [7.2](/tutorial/geometry/curvature-and-tides/#for-an-observer-at-rest-the-drift-is-the-papers-tide)'s
$\dd^2\xi^i/\dd\obs\tau^2 = -\curv\tE_{ij}\xi^j$ is a squeeze $\curv\tE_{xx} = \curv\tE_{yy} = G\matter M/r^3$, with
the axes $x$ and $y$ across the line to the hole. **Along.** In empty space the tide has no trace (7.3), so its entry
along the third axis, the line to the hole, is $-2G\matter M/r^3$: a stretch of $2G\matter M/r^3$. So

$$\boxed{\;\curv{\tE} = \frac{G\matter M}{r^3}\,\mathrm{diag}(1, 1, -2)\;} \label{eq:exact-tide}$$

exactly, for every body falling along a radius, whatever its $E$.

![Look first at the pair on two radii: both fall by the exact law of a single body, so their gap $r\,\delta\varphi$
shrinks with $r$, a squeeze $G\matter M/r^3$ across. Empty space has no trace of tide, so the stretch along the radius
is twice as large. Distances are not to scale.](tut-schw-falling-pair){#fig:schw-falling-pair}

**Two cameras.** A camera at rest at $r$ has, at each instant, the four-velocity of a body released from rest there,
and the tide depends only on the place and the four-velocity (chapter 7.2), so the hovering camera reads
[](#eq:exact-tide). A camera falling from far away ($E = 1$) reads it too: Section XI's [*A freely falling
camera*](/paper/#par:a-freely-falling-camera) "reads the same tide as one at rest at the same radius". Chapter
[9.4](/tutorial/one-point/petrov/#moving-the-pixel-moves-the-four-directions-as-rays-of-light) gives the reason in one
line: a boost along the line to the hole leaves a type D field unchanged. **Limit:** this is chapter 1.4's Newtonian
tide, now exact at every $r$ outside the horizon. The exactness rests on $r$ being the circumference radius: with a
ruler's distance from the centre the formula would change near the hole. **What it means:** close to a hole a camera
reads the same pattern as beside a pebble, a stretch twice the squeeze, and only its size tells them apart.

**Numbers.** For Section VII's hole the stretch $2G\matter M/r^3$ is $1.8\times10^{13}\unit{s^{-2}}$ at 1 m, the
paper's "$2\times10^{13}$", and falls to $1\unit{s^{-2}}$ at 26.3 km, chapter 1.8's orbit. At the horizon the stretch
is $2G\matter M/r_s^3$: $1.1\times10^7\unit{s^{-2}}$ for 30 solar masses, enough to pull two balls a metre apart away
from each other at a million times the Earth's gravity, but $1.0\times10^{-8}\unit{s^{-2}}$ for $10^9$ solar masses,
about the $9.3\times10^{-9}$ of a person a metre away. A large hole's horizon is not where it tears.

{{paper fig:black-hole-camera}}

## A body falling from far away crosses each radius at Newton's escape speed

A body dropped from rest far away has $E = 1$. A camera at rest at $r$ measures time by $\dd\obs\tau_{\rm cam} =
\sqrt{\field f}\,\dd t$ and distance along the radius by $\dd r/\sqrt{\field f}$, so it sees the speed $\obs v =
(\dd r/\dd t)/\field f$. From $E = \field f\,\dd t/\dd\obs\tau$ and [](#eq:radial),

$$\obs v = \frac{1}{E}\,\Bigl|\frac{\dd r}{\dd\obs\tau}\Bigr| = \sqrt{\frac{2G\matter M}{r}} ,$$

chapter 1.8's escape speed, now exact. It is $0.224c$ at $40\,G\matter M/c^2$, the speed behind chapter
[6.3](/tutorial/relativity/aberration/#a-moving-observers-sky-crowds-toward-the-direction-of-motion)'s falling camera
and its $5.8°$ shadow. It is $0.816c$ at $3\,G\matter M/c^2$, and it reaches $c$ at the horizon. With $E = 1$,
[](#eq:radial) also gives $\dd r/\dd\obs\tau = -c\sqrt{r_s/r}$, which integrates to a finite proper time,
$(2r_s/3c)[(r/r_s)^{3/2} - 1]$, from $r$ to the horizon: 6.0 ms from $10\,r_s$ for 30 solar masses. The far clock's
$t$ for the same fall grows without limit (stated; the GR course's section 17.4). **What it means:** the fall that
Newton would compute is the fall the body's own clock records; only distant observers see it slow down and freeze.

## Light can circle a hole, and the hole casts a shadow

**The barrier.** We follow a flash in the plane $\vartheta = 90°$, which roundness allows. Light has no proper time,
so we mark the points of the ray by a label $\lambda$, in metres, for which 7.1's geodesic equation keeps its form:
an **affine parameter**, in 7.1's words. It is not a time. Chapter
[7.1](/tutorial/geometry/metric/#free-bodies-follow-geodesics-and-the-christoffel-symbols-hold-newtons-pull)'s box
found $\field g_{\alpha\nu}\,\dd x^\nu/\dd\obs\tau$ fixed along a free path when the metric does not depend on
$x^\alpha$, and this holds for any such label, not only for proper time. The metric depends on neither $t$ nor
$\varphi$, so two numbers stay fixed along the ray: $E = \field f\,c\,\dd t/\dd\lambda$, a pure number, and $L =
r^2\,\dd\varphi/\dd\lambda$, a length (local letters; $L$ is not an arm's length). A null path has $\dd s^2 = 0$ in
[](#eq:schwarzschild), that is $-\field f c^2\dd t^2 + \dd r^2/\field f + r^2\dd\varphi^2 = 0$. We divide by
$\dd\lambda^2$, multiply by $\field f$ and use $E$ and $L$:

$$\Bigl(\frac{\dd r}{\dd\lambda}\Bigr)^2 = E^2\Bigl[1 - b^2\,\frac{\field f(r)}{r^2}\Bigr], \qquad b = \frac{L}{E} .
\label{eq:light}$$

Far away $\field f \to 1$, and the ray is a straight line, travelled at $c$, that would miss the centre by its
**impact parameter** $\sym{ray-impact-parameter}{b}$ (chapter 1.8's $B$). Such a line has $r^2\,\dd\varphi/\dd t =
bc$ (chapter 1.6's angular momentum per unit mass), so $L/E = (r^2\,\dd\varphi/\dd\lambda)/(c\,\dd t/\dd\lambda) =
b$. Rescaling the label changes $E$ and $L$ together, so for light only their ratio means anything. Dividing
$\dd\varphi/\dd\lambda = L/r^2$ by the square root of [](#eq:light) gives the **orbit equation**, the shape of every
ray in the plane:

$$\frac{\dd\varphi}{\dd r} = \pm\frac{1}{r^2\sqrt{1/b^2 - \field f(r)/r^2}} . \label{eq:orbit}$$

The ray can reach $r$ only where $(1 - r_s/r)/r^2 \le 1/b^2$. This **barrier** is zero at the horizon and peaks where
its derivative, $-2/r^3 + 3r_s/r^4$, vanishes: at $r = \tfrac32r_s = 3G\matter M/c^2$, the **photon sphere**, where
light can circle the hole. The peak's height is

$$\frac{1 - \tfrac23}{(\tfrac32r_s)^2} = \frac{4}{27r_s^2} ,$$

and a ray grazes its top when $1/b^2$ equals it. That sets the **critical impact parameter**

$$\sym{critical-impact-parameter}{b_c} = \tfrac32\sqrt3\,r_s = \sqrt{27}\,\frac{G\matter M}{c^2} .$$

Both $r_s$ and $b_c$ are lengths, and $b_c = 2.6\,r_s$. Rays with $b > b_c$ turn at the barrier and leave; rays with
$b < b_c$ pass over it and fall in; a ray with $b = b_c$ circles the photon sphere for ever, though the smallest
nudge sends it in or out (Figure [](#fig:schw-barrier)). A hole therefore removes from any beam the disc of rays inside
$b_c$, the **capture cross-section**

$$\boxed{\;\pi b_c^2 = \frac{27\pi G^2\matter M^2}{c^4}\;} ,$$

Section XI's geometric cross-section: $1.85\times10^8\unit{m^2}$ for the Sun's mass. For Section VII's hole the disc
is 0.52 mm in radius, about a grain of sand, and waves much longer than that pass it almost unabsorbed (chapter 11.3).

![Look first at the peak: a ray whose level $1/b^2$ clears it falls into the hole, and one that meets it turns back. The
rays are exact Schwarzschild rays.](tut-schw-barrier){#fig:schw-barrier}

**The angle at the camera.** A camera at rest at $r$ has its own clock, $\dd\obs\tau = \sqrt{\field f}\,\dd t$, and
across the radius its own ruler measures $r\,\dd\varphi$. Light moves at $c$ in the camera's frame, so a ray arriving
at the angle $\psi$ from the direction of the hole has $\sin\psi$ equal to its speed across, $r\,\dd\varphi/\dd\obs
\tau$, over $c$: $(L/r)/(E/\sqrt{\field f})$, or

$$\sin\psi = \frac{b}{r}\sqrt{1 - \frac{r_s}{r}} .$$

**The shadow.** The **shadow** of a hole is the set of directions from which no light comes (Figure
[](#fig:schw-shadow-angle)). Take a camera outside the photon sphere, where the barrier falls with $r$. A ray seen away
from the hole ($\psi > 90°$), traced back, moves outward and comes from far away. A ray seen toward the hole, traced
back, moves inward: the barrier turns it out to far away if $b > b_c$, and it ends on the horizon if $b < b_c$. At a
fixed $r$, $\sin\psi$ grows with $b$, so the dark directions are those within the angle $\sym{shadow-radius}{\alpha_h}$
of the hole (chapter 6.3's letter), the value of $\psi$ at $b = b_c$:

$$\boxed{\;\sin\alpha_h = \sqrt{27}\,\frac{G\matter M}{c^2r}\sqrt{1 - \frac{2G\matter M}{c^2r}}\;} ,$$

the paper's arcsine. At $40\,G\matter M/c^2$ it is $7.27°$, the paper's "$7.3^\circ$" and the black disc of Figure
[](/paper/#fig:black-hole)(b). It is $27.7°$ at $10\,G\matter M/c^2$, and $90°$, half the sky, at the photon sphere.
Inside the photon sphere the barrier rises outward, so light from far away arrives only from the outward side, along
rays with $b < b_c$. The sky is then bright only within the angle $\arcsin[(b_c/r)\sqrt{\field f}]$ of the outward
direction, and the shadow covers the rest, nearly all of it near the horizon. **Check:** far away $\sin\alpha_h \to
b_c/r$, the angle of a disc of radius $b_c$ seen from $r$. **What it means:** a hole looks 2.6 times larger than its
horizon, because the light it bends toward the camera fills out its edge. **An observation:** for Sagittarius A\*,
$4.3\times10^6$ solar masses at 8.28 kpc, the shadow is $53\,\mu$as across, and the Event Horizon Telescope's ring
measured $52\,\mu$as in 2022.

![Look first at the cone: every direction inside it traces back to the horizon, so no light comes from it. A ray at the
angle $\psi$ has $\sin\psi = (b/r)\sqrt{1 - r_s/r}$, and the cone's edge is the ray with $b = b_c$. The ray is exact;
the camera's size is not to scale.](tut-schw-shadow-angle){#fig:schw-shadow-angle}

## Far from a mass, light bends by twice Newton's angle

We want the bending of a ray that passes far from a mass, which chapters 5.5 and 7.1 stated. Chapter
[7.4](/tutorial/geometry/linearized-gravity/#a-static-source-gives-newtons-potential-in-time-and-in-space)'s
isotropic coordinates have, to first order, $\field g_{00} = -(1 + 2\field\Phi/c^2)$ and $\field g_{ij} = (1 -
2\field\Phi/c^2)\delta_{ij}$.[^iso] **The field is weak**: $|\field\Phi|/c^2 \ll 1$. A null step has $(1 +
2\field\Phi/c^2)c^2\dd t^2 = (1 - 2\field\Phi/c^2)|\dd\vect x|^2$, so light moves at $c(1 + 2\field\Phi/c^2)$ in
these coordinates, as in a medium of chapter
[5.1](/tutorial/waves/wave-equation/#a-medium-can-slow-a-wave-and-its-refractive-index-measures-how-much)'s
**refractive index**

$$n = 1 - \frac{2\field\Phi}{c^2} = 1 + \frac{2G\matter M}{rc^2} .$$

**A ray turns toward larger index.** Two points of a wavefront a small distance $\delta x$ apart across the ray move
at $c/n$ and $c/(n + \delta x\,\partial_\perp n)$. While the front advances a distance $\dd l$ along the ray, the
slower side falls behind by $\dd l\,\delta x\,\partial_\perp n$, so the ray turns by the angle $\partial_\perp n\,\dd
l$ toward larger $n$. **A small bending**: we add these turns along the straight line at the distance $b$ from the
mass, where at the distance $l$ from the line's nearest point $\partial_\perp n = (2G\matter M/c^2)\,b/(b^2 +
l^2)^{3/2}$ toward the mass. We substitute $l = b\tan\theta$, with $\theta$ the angle at the mass between the point of
the ray and its nearest point, so $\dd l = b\,\dd\theta/\cos^2\theta$:

$$\int_{-\infty}^{\infty}\frac{b\,\dd l}{(b^2 + l^2)^{3/2}} = \frac1b\int_{-\pi/2}^{\pi/2}\cos\theta\,\dd\theta =
\frac2b .$$

So the **deflection angle** is

$$\boxed{\;\sym{deflection-angle}{\alpha} = \int\partial_\perp n\,\dd l = \frac{4G\matter M}{bc^2} =
\frac{2r_s}{b}\;} ,$$

in radians, since $G\matter M/c^2$ and $b$ are both lengths. **Limit:** far away, $b \to \infty$, the ray goes
straight. Half the angle comes from $\field g_{00}$, which alone gives Newton's angle for a body moving at $c$, and
half from $\field g_{ij}$. Light crosses a metre of space while $ct$ advances a metre (chapter 7.1), so for light the
space entries weigh as much as the time entry. A slow body crosses far less space in that time, so it feels the time
entry alone, which is Newton's pull.

**Numbers.** A ray grazing the Sun turns by $1.75''$, against Newton's $0.88''$; one grazing the Earth by
$2.8\times10^{-9}$ rad, chapter 5.5's figure. This is the angle that chapter
[5.5](/tutorial/waves/radiance/#matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact)
turned into the paper's [](/paper/#eq:lens-compactness), and with it the pocket lens's eleven Moon masses.

**The size of the error.** The small parameter is $G\matter M/c^2b$, $2.1\times10^{-6}$ at the Sun's limb. The next
term of the deflection, $\tfrac{15\pi}4(G\matter M/c^2b)^2$ (stated), adds 6 parts in a million there. **Where it
fails.** The exact deflection is the angle that [](#eq:orbit) sweeps from far away in to the turning point and out
again, less the $\pi$ of a straight line. At $b = 1000$, 100 and $20\,G\matter M/c^2$ it is 1.003, 1.031 and 1.18
times $4G\matter M/bc^2$. The second-order term accounts for most of the difference: at $b = 20\,G\matter M/c^2$ it
raises 0.200 rad to 0.229, against 0.236 exactly. As $b \to b_c$ the bending grows without limit, and the rays wind
round the photon sphere. **What it means:** a mass bends its near rays more than its far ones, as a lens must, but by
the wrong law for one focus, which is the next section's subject.

::: history
### Schwarzschild, Birkhoff and Eddington

Karl Schwarzschild found the metric in 1916, weeks after Einstein's equation appeared. J. T. Jebsen (1921) and G. D.
Birkhoff (1923) proved that it is the only round vacuum field. In 1919 F. W. Dyson, A. S. Eddington and C. Davidson
measured starlight bent at the Sun's limb during an eclipse and found about Einstein's $1.75''$ ($1.98''$ at Sobral
and $1.61''$ at Príncipe), not Newton's half of it.
:::

## A mass is a lens with a line of foci and an Einstein ring

Chapter 5.5 found the line of foci: a ray at $b$, turned toward the axis by $2r_s/b$, crosses it at the distance
$b^2/2r_s$, so rays farther out cross farther away. A camera on the axis at the distance $d$ behind the mass, looking
at a source far behind it, collects the rays that cross at $d$, at the **Einstein radius**

$$\boxed{\;\sym{einstein-radius}{b_E} = \sqrt{2r_sd}\;} ,$$

and sees them as the **Einstein ring** round the mass, at the angle $b_E/d = \sqrt{2r_s/d}$. A ring, because the
source, the mass and the camera lie on one line, so every ray at $b_E$, whatever its direction round the axis, reaches
the camera (Figure [](#fig:schw-ring)). **Numbers** for Section VII's hole: at 1 m the ring is $1.15°$ in radius, the
paper's "$1.2^\circ$"; at 26.3 km, $b_E = 3.26$ m and the ring is $25.6''$.[^rounding]

**The exact ring.** Figure [](/paper/#fig:black-hole)'s dashed ring, seen from $40\,G\matter M/c^2$, is where the sky
straight behind the hole appears. Its rays come in from far away to their nearest point $r_0$, where $1/b^2 = \field
f(r_0)/r_0^2$, go out to the camera, and swing through $180°$ on the way. By [](#eq:orbit) the condition is

$$\begin{aligned}
&\int_{r_0}^{\infty}\frac{\dd r}{r^2\sqrt{1/b^2 - \field f/r^2}} \\
&\qquad + \int_{r_0}^{40\,G\matter M/c^2}\frac{\dd r}{r^2\sqrt{1/b^2 - \field f/r^2}} = \pi ,
\end{aligned}$$

which a computer evaluates and solves for $b$. It gives $b = 14.2\,G\matter M/c^2$, and $\sin\psi = (b/r)\sqrt{\field
f}$ gives $20.2°$, the figure's "$20^\circ$". The weak formula, with $d = 40\,G\matter M/c^2$, gives $18.1°$, 10%
short: near a hole the exact rays matter. Rays seen between the shadow and the ring swing through more than $180°$ and
bring light from the opposite side of the sky, so the figure shows the Milky Way's band below the hole a second time,
as an arc above it.

![Look first at the two rays meeting at the camera: they pass at the Einstein radius, and by symmetry so does every ray
at that distance, so the source appears as a ring. Near a hole (right) the exact ring is larger than the weak-field one.
The left panel is not to scale.](tut-schw-ring){#fig:schw-ring}

A transparent body, an **extended lens**, bends a ray that crosses it only by the mass inside the cylinder of radius
$b$ along the ray, as chapter 12.1 shows for Section XI's transparent Sun (Figure [](/paper/#fig:sun-lens)).

**When geometric optics holds.** A mass delays the waves that pass near it by about $4G\matter M/c^3$ more than those
far away, $19.7\,\mu$s for the Sun: this is the **Shapiro delay** (stated; the GR course's section 16.5). A lens
focuses only if the delay spans a radian of the wave's phase, $2\pi f\times4G\matter M/c^3 > 1$, that is for
frequencies $f > c^3/8\pi G\matter M$, or wavelengths $c/f$ shorter than $4\pi r_s$.[^freq] This **wave-optics
cut-off** is 8.1 kHz for the Sun, and for Section VII's hole it is $4\pi r_s = 2.54$ mm, or 118 GHz, the paper's
"2.5 mm" and "120 GHz". Below it, diffraction erases the focus. How strongly a point lens still focuses above it, the
paper's gain of 800 at $10\,\mu$m, is chapter R11's subject.

## Seen from rest near a hole, the whole sky is warmer

Light falling from far away to a camera at rest at $r$ keeps its number of crests per unit of $t$, because the field
is static (chapter [7.1](/tutorial/geometry/metric/#clocks-higher-up-run-faster-clocks-read-the-potential)'s flashes).
The camera's clock runs at $\sqrt{1 - r_s/r}$, so it measures every frequency raised by $1/\sqrt{1 - r_s/r}$, the
**gravitational blueshift**. Every ray that reaches the camera started far away, so every direction outside the shadow
gets the same factor. Every mode rises by it and keeps its occupation, so a black-body sky stays a black body, at

$$T_{\rm seen} = \frac{T}{\sqrt{1 - r_s/r}} ,$$

as chapter [10.1](/tutorial/glow/black-body/#a-moving-observer-still-sees-a-black-body-hotter-ahead) found for a
moving observer. At $40\,G\matter M/c^2$ the factor is $1/\sqrt{0.95} = 1.026$: the 0.905 K graviton sky reads 0.929 K,
Figure [](/paper/#fig:black-hole)(b)'s value and the paper's "$2.6\%$ warmer". **Limit:** far away the factor
is 1. The camera's thermometer reads how deep it sits.

::: try {#shadow-and-ring}
Two panels: the plane of the orbit, with the hole, the photon sphere and a fan of exact rays ending on the camera, and
the camera's sky, with the shadow filled, the exact Einstein ring of the point straight behind the hole and the sky's
warming as a shade. A slider sets the camera's distance, from 2.05 to $200\,G\matter M/c^2$, and a switch sets the
camera at rest or falling from far away. Readouts give the shadow's radius, the ring's radius exact and by the weak
formula, the warming factor, the hovering acceleration and the falling speed.

Predict first: a camera at rest moves in from $40\,G\matter M/c^2$ to $3\,G\matter M/c^2$; how much of its sky is dark
at the end? Drag the distance down and find where the shadow covers half the sky. Then predict whether the weak-field
ring catches up with the exact one far away, drag the distance out to 200, and compare the two readouts.
:::

::: check
### Q

Why does the outside of a round star that collapses stay exactly the same?

### A

By Birkhoff's theorem: in empty space the equations leave no room for a round field that changes, and the only number
in it is the mass.

### Q

A camera 1 m from Section VII's hole: what is the stretch along the line to it?

### A

The stretch is $2G\matter M/r^3 = 2\times6.674\times10^{-11}\times1.36\times10^{23} =
1.8\times10^{13}\unit{s^{-2}}$ at $r = 1$ m.

### Q

Why does light bend by twice Newton's angle?

### A

The time entry and the space entries of the metric each change by $2\field\Phi/c^2$, and for light both count equally;
Newton's theory has only the first.
:::

**The idea to keep: outside any round body Einstein's field is fixed by its mass alone, $\dd s^2 = -(1 -
r_s/r)c^2\dd t^2 + \dd r^2/(1 - r_s/r) + r^2\dd\Omega^2$. Its tide is exactly $(G\matter M/r^3)\,\mathrm{diag}(1, 1,
-2)$. At $r_s$ clocks stop and nothing can hover; light circles at $\tfrac32r_s$, so a hole removes a disc of radius
$\sqrt{27}\,G\matter M/c^2$ from the sky; and far away a mass bends light by $2r_s/b$, a lens with a line of foci and
an Einstein ring.**

::: problems
### Practice

For a neutron star of 1.4 solar masses and radius 12 km, find $r_s$, the compactness, the rate of a clock on its
surface, the impact parameter of a ray that grazes it, and that ray's bending by $4G\matter M/bc^2$.

::: solution
The Schwarzschild radius is 4.13 km and the compactness $\mathcal C = 0.172$; the clock runs at $\sqrt{1 - 4.13/12} =
0.810$. A grazing ray has $\psi = 90°$ at $r = R$, so $b = R/\sqrt{1 - r_s/R} = 14.8$ km, or $7.17\,G\matter M/c^2$.
The weak formula gives $4/7.17 = 0.56$ rad; the exact rays give 1.07 rad, so near a neutron star the weak formula is
half the answer.
:::

### Stretch

With chapter 1.6's angular momentum, a body's radial equation in [](#eq:schwarzschild) has the barrier $(1 -
r_s/r)(1 + \ell^2/r^2)$, with $\ell$ the angular momentum per unit mass over $c$, a length. Show that circular orbits
exist only outside $3G\matter M/c^2$ and are stable only outside $6G\matter M/c^2$.

::: solution
In units of $G\matter M/c^2$ the derivative vanishes where $r^2 - \ell^2r + 3\ell^2 = 0$, so $r = \tfrac12[\ell^2 \pm
\sqrt{\ell^4 - 12\ell^2}]$. The outer root is a minimum (stable), the inner a maximum. They exist only for $\ell^2 \ge
12$ and merge at $r = 6$; as $\ell \to \infty$ the inner root falls to 3.
:::

### The paper

Check Section VII's [*A black hole as the lens*](/paper/#par:a-black-hole-as-the-lens) from $1.36\times10^{23}$ kg:
$r_s$, the ring at 1 m, the tide there, the distance where the tide is $1\unit{s^{-2}}$, and the ring and $b_E$ there.

::: solution
The Schwarzschild radius is $2G\matter M/c^2 = 0.202$ mm. At 1 m the ring is $\sqrt{2r_s/d} = 0.0201$ rad, $1.15°$,
and the stretch $1.8\times10^{13}\unit{s^{-2}}$. The stretch is $1\unit{s^{-2}}$ at $(2G\matter M)^{1/3} = 26.3$ km,
where the ring is $25.6''$ and $b_E = 3.26$ m.
:::
:::

::: paper
- [Section VII](/paper/#sec:no-lens), [*A black hole as the lens*](/paper/#par:a-black-hole-as-the-lens): $r_s$, the
  line of foci $b^2/2r_s$, the Einstein radius, $4\pi r_s$, the paper's [](/paper/#eq:lens-compactness), and Figure
  [](/paper/#fig:black-hole-camera).
- [Section XI](/paper/#sec:vistas): the shadow, the $20^\circ$ ring and $27\pi G^2M^2/c^4$ of Figure
  [](/paper/#fig:black-hole); the falling camera's speed and tide; Birkhoff for the exploding star; the delay
  $4GM/c^3$ and the extended lens for the transparent Sun.
- [Section IV](/paper/#sec:near-field), [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity): the mass bound
  $zc^2/2G$.
- [Section III](/paper/#sec:regimes): the compactness of one half; [Section XIV](/paper/#sec:hole): the hole's $r_s$.
:::

::: deeper
- The GR course derives the metric and Birkhoff's theorem in full in section
  [17.1](https://neovand.github.io/general-relativity/chapter-17.html#17-1-solving-spherical-vacuum-where-schwarzschild-comes-from),
  shows that $r_s$ is no true singularity in
  [17.2](https://neovand.github.io/general-relativity/chapter-17.html#17-2-two-alarming-radii-two-very-different-problems)
  and
  [17.3](https://neovand.github.io/general-relativity/chapter-17.html#17-3-repairing-the-horizon-with-eddington-finkelstein-coordinates),
  compares falling with hovering in
  [17.4](https://neovand.github.io/general-relativity/chapter-17.html#17-4-falling-is-easy-hovering-is-the-expensive-activity)
  and the photon sphere with the last stable orbit in
  [17.5](https://neovand.github.io/general-relativity/chapter-17.html#17-5-the-photon-sphere-and-isco-three-radii-you-should-never-merge),
  and derives the factor of two and the delay in
  [16.4](https://neovand.github.io/general-relativity/chapter-16.html#16-4-bending-light-finding-the-famous-factor-of-two)
  and
  [16.5](https://neovand.github.io/general-relativity/chapter-16.html#16-5-shapiro-delay-the-other-consequence-of-the-same-optical-geometry).
- Misner, Thorne and Wheeler's *Gravitation* (1973) treats orbits, the horizon and Birkhoff's theorem in chapters 25,
  31 and 32 [@MisnerThorneWheeler1973]. The paper's sources on the shadow are [@Darwin1959; @Synge1966; @Luminet1979],
  and Schneider, Ehlers and Falco's *Gravitational Lenses* (1992) treats a point lens's waves in chapter 7.
:::

[^f]: In this chapter only, $\field f(r)$ is this entry of the metric. Chapter 5.5's focal length appears here only as
    $b^2/2r_s$, and a frequency $f$ only in the last paragraph of [the lens
    section](#a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring).

[^binding]: A shell's own volume is $4\pi r^2\dd r/\sqrt{\field h}$, a little more than $4\pi r^2\dd r$. So the masses
    of a star's parts, each weighed where it sits with its heat and compression included, add up to more than $\matter
    M$. The difference is the energy that binds them.

[^buchdahl]: Stronger bounds are known (stated). A static round star whose density does not grow outward has $R >
    \tfrac98r_s$, Buchdahl's bound (the GR course's section 17.8). For any shape, Thorne's hoop conjecture says a mass
    becomes a black hole when a hoop of circumference $2\pi r_s$ fits round it in every direction.

[^iso]: Isotropic coordinates label the radius differently from the circumference radius $r$, so that the space part
    is the same in every direction. The field is the same, and so is every angle a camera measures.

[^rounding]: The paper's "$25''$" and "$3.25\,\mathrm m$" at its 26 km should read $26''$ and 3.26 m: at $d = 26.28$ km,
    where the tide is exactly $1\unit{s^{-2}}$, the ring is $\sqrt{2r_s/d} = 25.6''$ and $b_E = \sqrt{2r_sd} = 3.258$ m.

[^freq]: Here $f$ is a frequency in hertz, not the metric's entry, and $c/f$ is the wavelength.
