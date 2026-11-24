---
id: '9.3'
title: 'The matrix 𝒲: four invariants, an orientation, a velocity'
question: 'Section VIII says that "four combinations come out the same for every observer, however the observer is turned and however it moves", that "three angles give the orientation of the field''s own axes" and that "three numbers give a velocity". How do ten numbers split into four, three and three, and how can a pixel read its own speed in a room it has never seen?'
part: '9'
requires: ['1.1', '1.5', '1.5b', '1.7', '3.1', '6.1', '6.2', '6.3', '6.6', '7.2', '7.5', '7.6', '8.4', '9.1', '9.2']
paper: [sec:one-pixel, eq:W, eq:invariants, eq:magnetic-ratio, eq:polar, eq:speedometer, fig:speedometer, fig:present, sec:pixel]
figures: [fig:speedometer, fig:present]
live: [speedometer]
depth: A
---

The paper's Figure [](/paper/#fig:speedometer) sends a pixel across a room of four masses at $0.6c$. The pixel has no
map of the room, yet at every point of its path it reads its own velocity from one reading of the tide and the magnetic
part. Under the path the figure plots the largest imaginary part of the reading's eigenvalues over their largest size, a
ratio which "is zero for the room at rest, however fast the pixel moves", and which is not zero once one of the masses
crosses the room.

{{paper fig:speedometer}}

Section VIII explains this by regrouping a pixel's ten numbers: "Four combinations come out the same for every
observer, however the observer is turned and however it moves. … Three angles give the orientation of the field's own
axes. … Three numbers give a velocity." How do ten numbers split into four, three and three, and how can a pixel read
its own speed in a room it has never seen?

::: plain
A pixel reads ten numbers: five for the stretch and squeeze of the tide, and five for its twist. They fit into one
table of five complex numbers. A pixel that is turned reads this table turned. A pixel that moves reads it turned too,
but by an imaginary angle.

Turning a table does not change its eigenvalues, the amounts by which it stretches along its own special directions, so
every observer at one place finds the same eigenvalues. They hold four of the ten numbers. Three more are the angles of
the field's own axes. The last three are a velocity: the velocity of the one observer for whom the stretch and the twist
share the same axes.

In a room where every mass is at rest, that observer is at rest in the room. A pixel moving through the room can
therefore read its own velocity from one reading, without a map. If the eigenvalues come out complex, something in the
room moves or turns, and no motion of the pixel can produce that.
:::

## The ten numbers are one complex symmetric table

We want one object for a pixel's ten numbers that every observer changes in a simple way. In empty space the tide
$\sym{tidal-tensor}{\curv\tE}$ (chapter [1.4](/tutorial/newton/tides/)) and the magnetic part
$\sym{magnetic-tide}{\curv\tB}$ (chapter 7.5) are each real, symmetric and trace-free, so each holds five numbers
(chapter [1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left)). The paper
joins them into one table:

{{paper eq:W}}

The table $\sym{weyl-complex}{\curv{\mathcal W}}$ has complex entries in $\mathrm{s^{-2}}$, is symmetric,
$\curv{\mathcal W}^{\mathsf T} = \curv{\mathcal W}$, and has no trace: five complex numbers, the **complex
matrix of a reading** that chapter [1.5b](/tutorial/newton/complex-numbers/) first wrote down. A pixel measures its real
part from the drift of its free balls and its imaginary part from the turning of its gyroscopes (chapter
[7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)),
each in its own axes and along its own time (chapter
[7.2](/tutorial/geometry/curvature-and-tides/#for-an-observer-at-rest-the-drift-is-the-papers-tide)). We join them
because a change of velocity then acts on the table as a turn does, as the next section shows.

**An example and a non-example.** One mass $\matter M$ at the distance $r$ along the unit vector $\hat n$ gives the real
table $\curv{\mathcal W} = (G\matter M/r^3)(1 - 3\hat n\hat n^{\mathsf T})$, with no magnetic part. One plane wave gives
chapter 9.1's square $2(\curv\tE_+ - i\curv\tE_\times)\,\vect m\vect m^{\mathsf T}$, whose imaginary part is as large as
its real part. Inside matter the tide's trace is $4\pi G\matter\rho$, so a reading there is not trace-free. This chapter
stays in empty space, where $\curv{\mathcal W}$ is built from chapter
[7.3](/tutorial/geometry/einstein-equation/#in-empty-space-only-the-weyl-curvature-is-left-and-it-holds-ten-numbers)'s
Weyl tensor, the part of the curvature that matter elsewhere makes.

**A turned pixel.** Chapter
[1.1](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow)'s rule for a table
read in turned axes applies to $\curv\tE$ and $\curv\tB$ alike, and because the turn is real it applies to
$\curv{\mathcal W}$ as a whole. With the paper's $R = \exp(\theta\,\hat u\cdot\mathbf L)$, the turn by the angle
$\theta$ about $\hat u$ that carries the old axes onto the new (chapter
[1.7](/tutorial/newton/hamilton/#every-quantity-generates-a-motion-and-a-symmetry-gives-a-constant)), a turned pixel
reads $R^{\mathsf T}\curv{\mathcal W}R$.

## A moving pixel reads the table turned by an imaginary angle

We want the reading of a pixel that passes, with the velocity $\obs{\vect v} = c\tanh\obs\eta\,\hat u$, the place
where a pixel at rest reads $\curv{\mathcal W}$. Here $\sym{rapidity}{\obs\eta}$ is chapter
[6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not)'s rapidity, a pure number, and $\hat u$ the
direction of motion. For light, chapter
[6.6](/tutorial/relativity/maxwell-complex/#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle) found that
the moving sensor reads $\light{\vect F}' = \Lambda\light{\vect F}$, with the paper's table
$\sym{complex-boost}{\Lambda} = \exp(-i\obs\eta\,\hat u\cdot\mathbf L)$ built from the generators
$\sym{generators}{(L_k)_{ij}} = -\epsilon_{kij}$ of chapter 1.7. At $0.6c$ along $x$, where $\obs\eta = \ln2$, its
rows are $(1, 0, 0)$, $(0, 1.25, 0.75i)$ and $(0, -0.75i, 1.25)$. We build gravity's rule in two steps, as a sketch
at depth B, and then check it exactly.

**Step 1: one plane wave.** By chapter 9.1 a plane wave's reading is a square, $\curv{\mathcal W} = \curv c_2\,\vect
m\vect m^{\mathsf T}$, with $\vect m$ the null vector of its direction of travel, of unit size ($\vect m^*\cdot\vect m =
1$), and $\curv c_2$ a complex amplitude in $\mathrm{s^{-2}}$. Light's wave along that direction is $\light{\vect F} =
a\,\vect m$. The moving pixel sees a plane wave along a new direction, and for light that wave is $\Lambda(a\vect m)$.
So $\Lambda\vect m$ is a multiple of the new unit null vector $\vect m'$, $\Lambda\vect m = f\,\vect m'$ with $f$ a
complex number, and light's amplitude becomes $fa$. The claim is that gravity's becomes $\curv c_2' = f^2\curv c_2$, so
that

$$\curv{\mathcal W}' = \curv c_2'\,\vect m'\vect m'^{\mathsf T} = \curv c_2\,(\Lambda\vect m)(\Lambda\vect m)^{\mathsf T}
= \Lambda\,\curv{\mathcal W}\,\Lambda^{\mathsf T} .$$

We check the claim in one case. A pixel running along the wave has $\Lambda\vect m = e^{-\obs\eta}\vect m$ (chapter
[6.6](/tutorial/relativity/maxwell-complex/#a-sensor-that-runs-with-a-wave-reads-it-weaker-by-the-doppler-factor)), so
$f = e^{-\obs\eta}$ and the claim gives $\curv{\mathcal W}' = e^{-2\obs\eta}\curv{\mathcal W}$. The running pixel meets
the crests less often, so the angular frequency falls by the Doppler factor $e^{-\obs\eta}$, while the strain, a stretch
across the motion, is the same for both observers. The tide is $-\tfrac12$ times the second time derivative of the
strain (chapter
[7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)), so it
falls by $e^{-2\obs\eta}$, as claimed.

**Step 2: every reading is a sum of squares.** The rule acts only on the curvature at the point, and linearly: a
moving observer's $\curv\tE'$ and $\curv\tB'$ are sums of the curvature's components at that event, with coefficients
made from its four-velocity and its axes (chapter
[6.2](/tutorial/relativity/spacetime-vectors/#what-an-observer-measures-is-a-contraction-with-its-own-four-velocity)).
So a moving pixel reads a sum of curvatures as the sum of its readings of each. We
state that the squares of the null vectors of five different directions are independent tables, so every reading is a
sum $\curv{\mathcal W} = \sum_k\curv c_k\,\vect m_k\vect m_k^{\mathsf T}$ of five of them,[^five] each a curvature that
one plane wave could make. Step 1 applied to each term gives

$$\boxed{\;\curv{\mathcal W}' = \Lambda\,\curv{\mathcal W}\,\Lambda^{\mathsf T}, \qquad \Lambda =
\exp(-i\obs\eta\,\hat u\cdot\mathbf L),\;} \label{eq:rule}$$

the paper's rule, for a pixel moving with the velocity $c\tanh\obs\eta\,\hat u$. A scene moving with that velocity past
a pixel at rest is seen through $\Lambda^{-1}$, the boost along $-\hat u$.

::: gap
This sketch does not prove that $\curv c_2' = f^2\curv c_2$ for every direction of the wave and of the motion, nor
that five squares make every reading. Both follow from writing the curvature with two-component spinors, in which
light's field carries two indices and gravity's four (Penrose and Rindler, below). The exact check that follows tests
the whole rule at once.
:::

**An exact check.** Masses at rest give a real $\curv{\mathcal W}$, and $\Lambda^{-1} = \exp(i\obs\eta\,\hat
u\cdot\mathbf L)$ is the complex conjugate of $\Lambda$. For a real reading the rule with $\Lambda^{-1}$ therefore gets
$\curv\tE'$ right and only flips the sign of $\curv\tB'$, so the check needs a complex reading. We take the linearized
Riemann tensor of chapter
[7.2](/tutorial/geometry/curvature-and-tides/#to-first-order-the-curvature-is-made-of-second-derivatives-of-the-metric)
for the two masses of the paper's Figure [](/paper/#fig:stars) at rest, at a pixel between them, and add that of a third
mass passing them at $0.5c$, which is the tensor of a mass at rest written in the room's axes (chapter 6.2). Contracting
the sum with the four-velocity and the axes of an observer moving at $0.7c$ in a random direction gives its $\curv\tE'$,
and its $\curv\tB'$ with chapter
[7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index)'s sign,
$\curv\tB_{ij} = \tfrac12c^2\epsilon_{ipq}\curv R_{pqj0}$. Both agree with [](#eq:rule) to fifteen figures. With
$\Lambda^{-1}$ they disagree in the first figure, $\curv\tE'$ as well as $\curv\tB'$.

**First order.** For a slow pixel $\Lambda \approx 1 - i\obs\eta\,\hat u\cdot\mathbf L$, with $\obs\eta \approx \obs
v/c$. The table $\hat u\cdot\mathbf L$ sends a vector $\vect x$ to $\hat u\times\vect x$ (chapter 1.7), and it is
antisymmetric, so $\Lambda^{\mathsf T} \approx 1 + i\obs\eta\,\hat u\cdot\mathbf L$. Multiplying out and keeping the
terms of first order gives $\curv{\mathcal W}' \approx \curv{\mathcal W} - i\obs\eta\,[\hat u\cdot\mathbf L,
\curv{\mathcal W}]$, with the commutator $[X, Y] = XY - YX$. Masses at rest have a real $\curv{\mathcal W} = \curv\tE$,
so the moving pixel reads the magnetic part

$$\boxed{\;\curv\tB' = -\frac{\obs v}{c}\,[\hat u\cdot\mathbf L, \curv\tE] .\;} \label{eq:first-order}$$

**Check: chapter 7.5's moving pixel.** For one mass along $\hat n$, $\curv\tE = (G\matter M/r^3)(1 - 3\hat n\hat
n^{\mathsf T})$. The 1 commutes with every table, and $[\hat u\cdot\mathbf L, \hat n\hat n^{\mathsf T}] = (\hat
u\times\hat n)\hat n^{\mathsf T} + \hat n(\hat u\times\hat n)^{\mathsf T}$, because $\hat n^{\mathsf T}(\hat
u\cdot\mathbf L) = -(\hat u\times\hat n)^{\mathsf T}$. So

$$\curv\tB' = -\frac{3G\matter M}{c\,r^3}\bigl[\hat n(\hat n\times\obs{\vect v})^{\mathsf T} + (\hat n\times\obs{\vect
v})\hat n^{\mathsf T}\bigr],$$

chapter [7.5](/tutorial/geometry/gravitomagnetism/#the-earths-magnetic-part-weighs-its-core)'s reading of a pixel moving
past a mass at rest, which there needed the principle of relativity. The exact rule contains it as its first term; the
next terms are smaller by $\obs v/c$.

## The eigenvalues are the same for every observer

We want what the two rules leave alone. The boost is complex orthogonal, $\Lambda^{\mathsf T}\Lambda = 1$ (chapter
[6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer)), so $\Lambda^{\mathsf
T} = \Lambda^{-1}$, and a real turn has $R^{\mathsf T} = R^{-1}$. Both rules therefore have the form $P\curv{\mathcal
W}P^{-1}$, with $P = \Lambda$ or $P = R^{\mathsf T}$. Two tables related in this way are **similar**: the second is the
first written in other axes. If $\curv{\mathcal W}\mathbf v = \curv w\,\mathbf v$, then

$$\bigl(P\curv{\mathcal W}P^{-1}\bigr)(P\mathbf v) = P\curv{\mathcal W}\mathbf v = \curv w\,(P\mathbf v),$$

so every eigenvalue of $\curv{\mathcal W}$ is an eigenvalue of the new table, with the eigenvector $P\mathbf v$, and
the same argument with $P^{-1}$ runs back. The three eigenvalues $\sym{weyl-eigenvalue}{\curv w_a}$, and with them
chapter 9.2's invariants $\sym{invariant-i}{I}$ and $\sym{invariant-j}{J}$, are the same for every observer at the
point:

$$\boxed{\;\curv w_a' = \curv w_a, \qquad I' = I, \qquad J' = J .\;}$$

This is the paper's equation:

{{paper eq:invariants}}

**The count.** The eigenvalues are three complex numbers adding to zero (the table has no trace), so two are free:
four real numbers that no observer can change. **A number.** For the person of 70 kg a metre away, $I = 1.31 \times
10^{-16}\unit{s^{-4}}$ and $J = -6.12 \times 10^{-25}\unit{s^{-6}}$ (chapter 9.2), for a pixel at rest there and for one
passing at $0.6c$ alike. What does change is the size of the reading, $|\curv\tE|^2 +
|\curv\tB|^2$, as the next section's numbers show (Figure [](#fig:same-eigenvalues)). **A limit.** At $\obs\eta = 0$, $\Lambda = 1$ and nothing changes.

![Look first at the numbers under the two panels: the moving pixel feels a stronger stretch and a twist that the
pixel at rest does not, yet both find the same three eigenvalues. Readings computed from the rule; movements
exaggerated.](tut-same-eigenvalues){#fig:same-eigenvalues}

## Ten numbers are four invariants, three angles and a velocity

We want the meaning of the other six numbers. We assume that **the eigenvalues are all different**. Chapter 9.2 then
wrote the reading as the paper's

{{paper eq:polar}}

with $\sym{complex-rotation}{P}$ a complex rotation, $\sym{polar-turn}{R_0}$ a real turn and $\sym{polar-boost}{K_0} =
-\obs\eta\,\hat u\cdot\mathbf L$ real and antisymmetric, so that $e^{iK_0}$ is the boost $\Lambda$ of rapidity
$\obs\eta$ along a unit vector $\hat u$. With $D = \mathrm{diag}(\curv w_1, \curv w_2, \curv w_3)$ and
$(e^{iK_0})^{\mathsf T} = e^{-iK_0}$,

$$\curv{\mathcal W} = R_0\,e^{iK_0}\,D\,e^{-iK_0}\,R_0^{\mathsf T} .$$

**The observer for whom stretch and twist share axes.** A turn carries the generators as it carries vectors, $R_0(\hat
u\cdot\mathbf L)R_0^{\mathsf T} = (R_0\hat u)\cdot\mathbf L$, because both send $\vect x$ to $(R_0\hat u)\times\vect x$.
So a second pixel at the same place, moving relative to the first with rapidity $\obs\eta$ along $-R_0\hat u$, has the
boost $R_0e^{-iK_0}R_0^{\mathsf T}$, and by [](#eq:rule) it reads

$$R_0e^{-iK_0}R_0^{\mathsf T}\,\curv{\mathcal W}\,R_0e^{iK_0}R_0^{\mathsf T} = R_0\,D\,R_0^{\mathsf T} .$$

Its tide $R_0\,\mathrm{Re}(D)\,R_0^{\mathsf T}$ and its magnetic part $R_0\,\mathrm{Im}(D)\,R_0^{\mathsf T}$ are both
diagonal along the columns of $R_0$. This observer is the field's **principal observer**, and its frame the field's
**rest frame** of chapter
[0.4](/tutorial/evening/one-pixel/#the-ten-numbers-regroup-into-four-invariants-three-angles-and-a-velocity). The
columns of $R_0$ are the **field's own axes**, and their orientation is three angles. The first pixel moves relative to
the principal observer with the velocity

$$\boxed{\;\obs{\vect v} = c\tanh\obs\eta\;R_0\hat u ,\;} \label{eq:velocity}$$

three numbers. So the ten numbers are four in the eigenvalues, three in $R_0$ and three in $\obs\eta\hat u$: $10 = 4 +
3 + 3$ (Figure [](#fig:ten-regroup)). The columns of $R_0$ must be taken right-handed, $\det R_0 = +1$, as for any turn. Eigenvectors from a
computer may come left-handed, and then the velocity comes out reversed.

**Only one such observer.** Suppose a boost $\Lambda$ left the principal reading unchanged, $\Lambda D\Lambda^{\mathsf
T} = D$. Since $\Lambda^{\mathsf T} = \Lambda^{-1}$, this says $\Lambda D = D\Lambda$, whose entry $bc$ is
$\Lambda_{bc}(\curv w_c - \curv w_b) = 0$. With different eigenvalues every entry off the diagonal vanishes. A diagonal
table with $\Lambda^{\mathsf T}\Lambda = 1$ and determinant one, as a boost has, has entries $\pm1$ with an even number
of minus signs: no change or a half turn, never a boost. So for three different eigenvalues the principal observer is
unique (up to the order of its axes), as Costa, Wylleman and Natário state [@CostaWyllemanNatario2021]. It is the rest
frame of the matter only when the source is **stationary**, its field unchanging in time in some frame.

**The frame of the least reading.** The sum $|\curv\tE|^2 + |\curv\tB|^2 = \sum_{ij}|\curv{\mathcal W}_{ij}|^2$ is twice
chapter [8.4](/tutorial/quantum/spin/)'s super-energy $\sym{super-energy}{u}$, in $\mathrm{s^{-4}}$. We state Schur's
theorem: every square table is $U T U^\dagger$ with $U$ unitary and $T$ triangular, the eigenvalues on its diagonal. A
unitary table keeps the sum of the squared sizes of the entries (a boost, complex orthogonal but not unitary,
changes it), so

$$\sum_{ij}|\curv{\mathcal W}_{ij}|^2 = \sum_a|\curv w_a|^2 + \sum_{i<j}|T_{ij}|^2 \ge \sum_a|\curv w_a|^2 .$$

Equality needs a diagonal $T$. The principal reading $R_0DR_0^{\mathsf T}$ has it, because a real turn is unitary, so the
principal observer reads the least $|\curv\tE|^2 + |\curv\tB|^2$ of all observers at the place, $\sum_a|\curv w_a|^2$,
the statement of Ferrando and Sáez [@FerrandoSaez2012].

**Numbers.** The two masses of Figure [](/paper/#fig:stars) have the eigenvalues $-0.537$, $0.135$ and $0.402$ in the
figure's units. A pixel moving through them at $0.6c$ along the unit vector of $(0.30, 0.80, -0.52)$ reads a table with
complex entries and the same three real eigenvalues. Its polar decomposition, with $\det R_0 = +1$, gives $\obs\eta =
0.693147 = \ln 2 = \mathrm{artanh}\,0.6$, and [](#eq:velocity) returns the pixel's own velocity, $(0.180, 0.480,
-0.312)\,c$. Its $|\curv\tE|^2 + |\curv\tB|^2$ is $2.27$, and the principal observer's is $0.468 = \sum_a\curv w_a^2$,
the least value.

![Look first at the three groups at the bottom: the same ten numbers, regrouped by what an observer can change. The
eigenvalues no observer changes; the axes change with a turn; the velocity changes with a
boost.](tut-ten-regroup){#fig:ten-regroup}

## In a room at rest a pixel reads its own velocity

We want a pixel's velocity through a room it does not know. We assume that **every mass in the room is at rest in the
room's frame**. Then that frame reads no magnetic part (chapter 7.5), and its real symmetric reading has real
eigenvalues along three axes at right angles. If the eigenvalues are different, the room's frame is the
principal observer, and a pixel moving through the room finds, by [](#eq:velocity), its velocity relative to the room,
at any speed and from one reading. This is the pixel of the paper's Figure [](/paper/#fig:speedometer).

**At first order: the paper's equation.** We want the formula a slow pixel uses. In the room's principal axes, taken
right-handed, the tide is $\curv\tE = \mathrm{diag}(\curv\lambda_1, \curv\lambda_2, \curv\lambda_3)$, with
$\sym{tide-eigenvalue}{\curv\lambda_a}$ its eigenvalues in $\mathrm{s^{-2}}$. The entry $bc$ of $[\hat u\cdot\mathbf
L, \curv\tE]$ is $(\hat u\cdot\mathbf L)_{bc}(\curv\lambda_c - \curv\lambda_b)$, with $(\hat u\cdot\mathbf L)_{bc} =
-\epsilon_{kbc}\hat u_k$, so [](#eq:first-order) gives $\curv\tB'_{bc} = \epsilon_{kbc}(\obs v_k/c)(\curv\lambda_c -
\curv\lambda_b)$. For $(a, b, c)$ in the order $(1, 2, 3)$, $(2, 3, 1)$ or $(3, 1, 2)$ only $k = a$ survives, with
$\epsilon_{abc} = 1$:

{{paper eq:speedometer}}

and the diagonal entries vanish, because $\epsilon_{kbb} = 0$. Here $\obs v_a$ is the pixel's velocity through the room
along the axis $a$. In left-handed axes every sign flips. For a speed of $10^{-6}c$ the formula agrees with the exact
rule to $8 \times 10^{-13}$ of the largest entry. Read backwards, $\obs v_a = c\,\curv\tB_{bc}/(\curv\lambda_c -
\curv\lambda_b)$.

**Its precision.** We assume **independent Gaussian noise of standard deviation $\sigma_n$ on each of the five
coefficients of $\curv\tB$ in chapter 1.5's orthonormal basis** (chapter
[3.1](/tutorial/noise/probability/#most-noise-follows-the-gaussian-bell); the paper writes a bare $\sigma$ for
$\sigma_n$). An entry off the diagonal is its coefficient divided by $\sqrt2$, because chapter
[1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length)'s basis table
for it has $1/\sqrt2$ in two places, so the entry carries $\sigma_n/\sqrt2$. Dividing by the gap between the two
eigenvalues gives the standard deviation $\sym{standard-deviation}{\sigma_v}$ of each component of the velocity read:

$$\boxed{\;\sigma_v = \frac{c\,\sigma_n}{\sqrt2\,|\curv\lambda_b - \curv\lambda_c|} .\;} \label{eq:precision}$$

The unit is that of $c$, since $\sigma_n$ and the gap are both in $\mathrm{s^{-2}}$. **A check.** For the two masses
of Figure [](/paper/#fig:stars), 40,000 noisy readings give spreads of 1.002, 1.001 and 0.999 times the formula for the
three components.

**Numbers.** A tide whose eigenvalues are $10^{-8}\unit{s^{-2}}$ apart, read to one part in $10^8$, so $\sigma_n =
10^{-16}\unit{s^{-2}}$, gives $\sigma_v = 3.00 \times 10^8 \times 10^{-16}/(1.414 \times 10^{-8}) = 2.1\unit{m\,s^{-1}}$,
the paper's "about two metres per second", a walking pace. Beside the person a metre away the eigenvalues are $-2\curv
w$, $\curv w$ and $\curv w$, with $\curv w = G\matter M/r^3 = 4.67 \times 10^{-9}\unit{s^{-2}}$. The two components
across the line to the person face the gap $3\curv w = 1.40 \times 10^{-8}\unit{s^{-2}}$ and are read to
$1.5\unit{m\,s^{-1}}$. The component along the line faces the gap between the two equal squeezes, zero.

**The blind spot of a round body.** For one round body along $\hat n$, a boost along $\hat n$ changes nothing at any
speed. The table $\hat n\cdot\mathbf L$ commutes with $\hat n\hat n^{\mathsf T}$, because $[\hat n\cdot\mathbf L, \hat
n\hat n^{\mathsf T}] = (\hat n\times\hat n)\hat n^{\mathsf T} + \hat n(\hat n\times\hat n)^{\mathsf T} = 0$, so its
exponential $\Lambda$ commutes with $\curv{\mathcal W} = \curv w(1 - 3\hat n\hat n^{\mathsf T})$, and $\Lambda\curv{\mathcal
W}\Lambda^{\mathsf T} = \Lambda\curv{\mathcal W}\Lambda^{-1} = \curv{\mathcal W}$. A pixel flying straight at the body
at $0.3c$ reads exactly the same table as a pixel at rest, with no magnetic part. This is the paper's "its radial speed
is unreadable", the **radial blind spot** (Figure [](#fig:speedometer-gap)). A second body gives three different eigenvalues and removes it everywhere
off the line through the two bodies, as chapter 0.4's margin promised;[^line] so does a body that is not round, off any
axis of symmetry.

![Look first at the dashed bracket: equal squeezes leave the speed along the line to a round body unreadable, while
every gap between different eigenvalues reads a component of the velocity, more sharply the wider it is. Line
exact.](tut-speedometer-gap){#fig:speedometer-gap}

::: try {#speedometer}
The paper's speedometer: a pixel crossing a room of four masses, with the velocity it reads from gravity, the velocity
light would give it, and under the path the motion test, the largest imaginary part of the eigenvalues over their
largest size. Predict first: if you raise the pixel's speed to $0.6c$ and turn its heading, will the motion test move
off its floor? Then do it. Next set *One of the masses* to *Flies*, $0.05c$, and say why no speed or heading of the
pixel brings the test back down; then try *Walks*, $1.5\unit{m\,s^{-1}}$. Afterwards, watch light's arrow and say
which part of the velocity it misses, and why.
:::

## Complex eigenvalues mean that something in the room moves or turns

We want what a reading with complex eigenvalues says. If any observer at the place reads no magnetic part, its table is
real and symmetric, with real eigenvalues, and by the third section every observer finds those. So complex eigenvalues
mean that no observer reads $\curv\tB = 0$: the masses are not all at rest in one frame, something turns, or a wave
crosses the room. The pixel's own motion cannot make them complex, and the test catches only motion that does. One body
moving steadily has the real eigenvalues of its own rest frame, and a mass moving straight at the pixel adds no magnetic
part at first order (chapter
[7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)).

**Turning puts a phase on the eigenvalues.** We want the eigenvalues above a pole of a round body of mass $\matter M$
spinning with the angular momentum $\matter Mca\,\hat z$, which defines $\sym{kerr-parameter}{a}$, Kerr's spin
parameter, a length (not a shell's radius or a light amplitude). The pixel is on the axis at the distance $r$, so the
unit vector toward the body is $\hat n = -\hat z$. Chapter 7.5 found the magnetic part of such a [spin
dipole](/tutorial/geometry/gravitomagnetism/#a-spinning-round-body-is-a-spin-dipole); with this angular momentum it is

$$\begin{aligned}\curv\tB_{ij} = -\frac{3G\matter Ma}{r^4}\Bigl[&\hat z_i\hat n_j + \hat n_i\hat z_j\\ &+ (\hat
z\cdot\hat n)(\delta_{ij} - 5\hat n_i\hat n_j)\Bigr] .\end{aligned}$$

With $\hat z\cdot\hat n = -1$ the bracket is $-2\hat z\hat z^{\mathsf T} - (1 - 5\hat z\hat z^{\mathsf T}) = -(1 -
3\hat z\hat z^{\mathsf T})$, so $\curv\tB = (3G\matter Ma/r^4)(1 - 3\hat z\hat z^{\mathsf T})$, in $\mathrm{s^{-2}}$.
The tide is $(G\matter M/r^3)(1 - 3\hat z\hat z^{\mathsf T})$, and

$$\curv{\mathcal W} = \frac{G\matter M}{r^3}\Bigl(1 + \frac{3ia}{r}\Bigr)(1 - 3\hat z\hat z^{\mathsf T}) .$$

Every eigenvalue carries the phase $3a/r$. We state Kerr's result [@Kerr1963]: for a spinning black hole the
eigenvalues are proportional to $(r - ia\cos\vartheta)^{-3}$, with $\vartheta$ the angle from the spin axis. Outside any
round spinning body this holds to first order in $a$, as $r^{-3}(1 + 3ia\cos\vartheta/r)$, the phase
$3a\cos\vartheta/r$, which on the axis is ours.

**The Earth at a pole.** The Earth's angular momentum, $5.86 \times 10^{33}\unit{kg\,m^2\,s^{-1}}$ (chapter 7.5),
divided by $\matter Mc$ gives $a = 3.27\unit{m}$. A pixel resting on the ground at a pole does not move, and at the
surface there, $r = 6.357 \times 10^6\unit{m}$, its eigenvalues carry the phase $3a/r = 1.54 \times 10^{-6}$, the paper's
$1.5 \times 10^{-6}$.

**The Earth on the equator.** A pixel at rest on the ground moves east at $\Omega R = 465\unit{m\,s^{-1}}$ through
the field of a turning planet. Chapter 7.5 found that both effects give only the entry $\curv\tB_{xz}$, with $x$ up
and $z$ along the axis, so $\curv\tB$ has no diagonal entry in the tide's principal axes, and to first order the
eigenvalues stay real.[^shift] The pixel reads a velocity from the paper's [](/paper/#eq:speedometer) with $(a, b, c) =
(y, z, x)$ and the eigenvalues $\curv\lambda_x = -2\curv w$, $\curv\lambda_z = \curv w$, $\curv w = G\matter M/R^3$: $\curv\tB_{zx}
= -3\curv w\,\obs v_y/c$. Setting this equal to chapter 7.5's $-(3G\matter M\Omega/cR^2)(1 - C/\matter MR^2)$ gives

$$\begin{aligned}\obs v_y &= \Bigl(1 - \frac{C}{\matter MR^2}\Bigr)\Omega R\\ &= 0.669 \times 465\unit{m\,s^{-1}} =
311\unit{m\,s^{-1}},\end{aligned}$$

the paper's number, with $C$ the moment of inertia (the paper's letter, since $I$ is the invariant; chapter 7.5's
$I/\matter MR^2$ is the same 0.3307). The planet's spin takes back the share $C/\matter MR^2$ of the ground's speed.

## Light reads only two components of its own velocity; gravity reads three

Chapter [6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer) found that
light's $\light{\vect F}$ has one complex invariant, $\light{\vect F}\cdot\light{\vect F}$, and that in the frame where
$\light{\vect E}$ and $\light{\vect B}$ are parallel, $\light{\vect F} = w\hat n$, a turn about $\hat n$ or a boost
along it changes nothing. Sensors that differ by such a boost read the same, so light's six numbers are two in the
complex invariant, two angles for the direction $\hat n$, and two components of the sensor's velocity across $\hat n$:
$6 = 2 + 2 + 2$. For gravity with three different eigenvalues the fourth section showed that no boost keeps the
principal reading, so a pixel reads all three components: $10 = 4 + 3 + 3$. Only a reading with two equal eigenvalues, a
round body's, has light's blind spot, along the line to the body.

## How large the magnetic part is, and where the field points

The paper compares the two parts in

{{paper eq:magnetic-ratio}}

In a wave $\curv\tB$ is $\curv\tE$ turned by 45° about the direction of travel, so the two have the same size (chapter
[7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)). Near slow matter
chapter 7.5 found $\sqrt3\,\obs v_\perp/c$, $8.1 \times 10^{-9}$ for a person walking past a metre away, and for the
part of the tide that changes at the angular frequency $\omega$ a magnetic part about $\omega r/c$ times as large.

**Many waves.** For waves from independent sources the cross terms between different waves in $|\curv\tB|^2$ and
$|\curv\tE|^2$ average to zero over time, while each wave has $|\curv\tB_k| = |\curv\tE_k|$. So
$\langle|\curv\tB|^2\rangle = \langle|\curv\tE|^2\rangle$: the paper's first ratio holds in mean square,[^mean] and the
magnetic part detects radiation that nearby slow masses barely touch. Two equal waves running in opposite directions
with one polarization make a **standing wave**, whose crests stay in place (chapter
[5.1](/tutorial/waves/wave-equation/)). At its antinodes the tides add, while the magnetic parts, which change sign with
the direction of travel, cancel.

**The present position.** We want where the stretch axis of a mass moving steadily points, as chapter
[6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now) promised. Let
$\vect r$ point from the pixel to where the mass is now, at the pixel's time, and let $\sym{rest-frame-distance}{R_*}$ be
6.3's distance in the mass's own frame. There the reading is real, $\curv{\mathcal W}_0 = \curv w_0(1 - 3\hat n_0\hat
n_0^{\mathsf T})$, with $\curv w_0 = G\matter M/R_*^3$ and, by 6.3's result, $\hat n_0 = (\obs\gamma\vect r_\parallel +
\vect r_\perp)/R_*$, the parts along and across the motion. The pixel moves relative to the mass with rapidity
$\obs\eta$ along $\hat u$, and $\obs\gamma = \cosh\obs\eta$. Its boost leaves the part of $\hat n_0$ along $\hat u$ alone
and turns the part across it by the imaginary angle:

$$\begin{aligned}\Lambda\hat n_0 &= \mathbf t - i\,\mathbf s,\\ \mathbf t &= \hat n_{0\parallel} +
\cosh\obs\eta\,\hat n_{0\perp},\\ \mathbf s &= \sinh\obs\eta\,\hat u\times\hat n_0 .\end{aligned}$$

Since $\Lambda\Lambda^{\mathsf T} = 1$, the rule gives $\curv w_0\bigl[1 - 3(\Lambda\hat n_0)(\Lambda\hat n_0)^{\mathsf
T}\bigr]$, whose real part is the moving pixel's tide,

$$\curv\tE = \curv w_0\bigl(1 - 3\,\mathbf t\mathbf t^{\mathsf T} + 3\,\mathbf s\mathbf s^{\mathsf T}\bigr) .$$

The vectors $\mathbf t$ and $\mathbf s$ are at right angles, so $\mathbf t$ is an axis of this tide, with the negative
eigenvalue $\curv w_0(1 - 3|\mathbf t|^2)$, the stretch. With 6.3's $\hat n_0$ it is

$$\boxed{\;\mathbf t = \frac{\obs\gamma\,\vect r}{R_*} .\;}$$

The stretch axis points at where the mass is now, at every speed. **A number.** At closest approach at $0.6c$,
$|\mathbf t|^2 = 1.5625$, so the stretch is $-3.69\,\curv w_0$, against $-2\curv w_0$ at rest, while the mass's light
arrives from $36.9°$ behind it, chapter 6.3's $\tan\delta = \sinh\obs\eta = 0.75$.

{{paper fig:present}}

::: check
### Q

Why are the eigenvalues of $\curv{\mathcal W}$ the same for a moving pixel?

### A

Because $\Lambda^{\mathsf T} = \Lambda^{-1}$, so $\Lambda\curv{\mathcal W}\Lambda^{\mathsf T} = \Lambda\curv{\mathcal W}\Lambda^{-1}$
is the same table written in other axes.

### Q

A pixel reads a tide whose eigenvalues differ by $10^{-8}\unit{s^{-2}}$, with noise $10^{-16}\unit{s^{-2}}$. How well
does it know its speed?

### A

To about $2\unit{m\,s^{-1}}$ for each component, by [](#eq:precision).

### Q

Why can a pixel beside one round body not read its speed toward the body?

### A

Two eigenvalues are equal, and a boost along the line to the body commutes with the reading, so it changes nothing.

### Q

What do complex eigenvalues tell, and what can never produce them?

### A

That something in the room moves relative to the rest or turns, or that a wave crosses it; the pixel's own motion
never can.
:::

**The idea to keep: every observer reads a pixel's one complex table turned, by a real angle for a turn and by an
imaginary one for a boost, so its four invariants are the same for all, and the other six are the field's axes and the
velocity of its principal observer. So a pixel among masses at rest reads its own velocity, and complex eigenvalues
mean that something in the scene moves.**

::: problems
### Practice

A pixel moves at $0.6c$ along $x$ past one mass on its $y$ axis, where at rest $\curv{\mathcal W} = \curv w\,
\mathrm{diag}(1, -2, 1)$. Using 6.6's $\Lambda$, compute the reading, its eigenvalues and the largest entry of
$\curv\tB$.

::: solution
With the rows of $\Lambda$ given in the second section, the reading has $1$ in the place $xx$ and, in the $yz$ block,
$\curv{\mathcal W}_{yy} = 1.25^2(-2) + (0.75i)^2 = -3.6875$, $\curv{\mathcal W}_{zz} = (-0.75i)^2(-2) + 1.25^2 = 2.6875$
and $\curv{\mathcal W}_{yz} = 1.25(-2)(-0.75i) + 0.75i \times 1.25 = 2.8125i$, all times $\curv w$. The block has trace
$-1$ and determinant $-9.91 + 7.91 = -2$, so its eigenvalues are 1 and $-2$: the eigenvalues stay $\curv w(1, 1, -2)$.
The largest entry of $\curv\tB$ is $2.81\,\curv w = 3\cosh\obs\eta\sinh\obs\eta\,\curv w$.
:::

### Stretch

Combine with chapter 7.5. Check that [](#eq:first-order) gives a ground pixel on the equator, moving at $465\unit{m\,
s^{-1}}$ through a planet that does not spin, a magnetic part of size $3G\matter M\Omega/cR^2$, and with the
spin the paper's $4.8 \times 10^{-12}\unit{s^{-2}}$.

::: solution
By the check of the second section, with $\hat n$ toward the centre and the velocity across it, the one entry has
the size $3(G\matter M/R^3)(\Omega R/c) = 3G\matter M\Omega/cR^2 = 7.15 \times 10^{-12}\unit{s^{-2}}$ for $G\matter M = 3.986
\times 10^{14}\unit{m^3\,s^{-2}}$, $\Omega = 7.29 \times 10^{-5}\unit{s^{-1}}$ and $R = 6.378 \times 10^6\unit{m}$.
Chapter 7.5's spin takes back the share 0.3307, leaving $7.15 \times 0.669 = 4.79 \times 10^{-12}\unit{s^{-2}}$, the
paper's 4.8.
:::

### The paper

The paper says that the principal observer reads the least $|\tE|^2 + |\tB|^2$, equal to $\sum_a|w_a|^2$. Check it for
the practice problem's pixel. Which observer reads that least value, how fast does the pixel move relative to it,
and is that observer the only one?

::: solution
The moving pixel reads $|\curv\tE|^2 + |\curv\tB|^2 = (1 + 3.6875^2 + 2.6875^2 + 2 \times 2.8125^2)\,\curv w^2 =
37.6\,\curv w^2$, while $\sum_a\curv w_a^2 = (1 + 1 + 4)\,\curv w^2 = 6\,\curv w^2$, which the mass's own frame reads,
because there $\curv\tB = 0$. The pixel moves relative to that frame at $c\tanh(\ln2) = 0.6c$. The frame is not the
only one: one mass has two equal eigenvalues, and any further boost along the $y$ axis commutes with the reading. This
is the blind spot, and the reason [](#eq:velocity), derived for different eigenvalues, does not apply.
:::
:::

::: paper
- Section VIII's plain words, *What every observer agrees on*: the regrouping, the speedometer and the test for motion.
- Section VIII's [*One complex matrix*](/paper/#par:one-complex-matrix): the paper's [](/paper/#eq:W), $\Lambda$ and the
  paper's [](/paper/#eq:invariants).
- Section VIII's [*The magnetic part*](/paper/#par:the-magnetic-part): the paper's [](/paper/#eq:magnetic-ratio), many
  waves and the standing wave.
- Section VIII's [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity): the paper's
  [](/paper/#eq:polar) and [](/paper/#eq:speedometer), Figure [](/paper/#fig:speedometer), Kerr's phase, the
  $311\unit{m\,s^{-1}}$, light's two components and the blind spot of a round body.
- Section VIII's [*The absence of gravitational
  aberration*](/paper/#par:the-absence-of-gravitational-aberration): the stretch axis at the present position, Figure
  [](/paper/#fig:present).
- Section II's [*The Earth's own tide*](/paper/#par:the-earths-own-tide): the equator's magnetic part, which here becomes
  a velocity.
:::

::: deeper
- The GR course's [section 9.3](https://neovand.github.io/general-relativity/chapter-9.html#9-3-extracting-the-trace-free-remainder-the-weyl-tensor)
  extracts the Weyl tensor, whose ten numbers in empty space are those of $\mathcal W$, and its
  [section 10.7](https://neovand.github.io/general-relativity/chapter-10.html#10-7-scalar-invariants-are-powerful-but-spacetime-has-a-loophole)
  builds invariants like $I$ and $J$.
- L. F. O. Costa, L. Wylleman and J. Natário, on the principal observer and its uniqueness
  [@CostaWyllemanNatario2021; @WyllemanCostaNatario2021], and J. J. Ferrando and J. A. Sáez on the frame of the least
  reading [@FerrandoSaez2012].
- H. Stephani and others, *Exact Solutions of Einstein's Field Equations*
  (2nd edition, Cambridge, 2003), chapter 4: the complex matrix of the curvature and its invariants.
- R. Penrose and W. Rindler, *Spinors and Space-Time*, vol. 1 (Cambridge, 1984): the spinors that prove the boost rule
  in general.
:::

[^five]: Chapter 9.5 finds the five squares for a given reading.

[^line]: On that line the field is symmetric about it, two eigenvalues stay equal, and a boost along it still leaves
    $\curv\tB' = 0$. The paper's "Two bodies … remove the blind spot" holds off that line.

[^mean]: The paper says "averaged over time". The mean squares are equal, but the time average of $|\curv\tB|/|\curv\tE|$
    itself can diverge, as for two opposite waves of one polarization, where $\curv\tE$ passes through zero.

[^shift]: To first order an eigenvalue $\curv\lambda_a$ with the unit axis $\mathbf u_a$ moves by $i\,\mathbf
    u_a\cdot\curv\tB\mathbf u_a$, as putting $\curv\lambda_a + \delta$ and $\mathbf u_a + \delta\mathbf u$ into the
    eigenvalue equation and taking the product with $\mathbf u_a$ shows. Here that entry is zero, and so are the entries
    of $\curv\tB$ in the plane of the two equal squeezes.
