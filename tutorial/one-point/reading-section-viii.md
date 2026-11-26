---
id: R9
title: 'One table, four directions: what one pixel reads, from its ten numbers to a moving body'
question: 'What can a single reading of ten numbers tell a pixel about waves, masses, its own velocity and a moving body?'
part: '9'
requires: ['R1', '6.1', '6.3', '6.6', '7.5', '7.6', '8.4', '9.1', '9.2', '9.3', '9.4']
paper: [sec:one-pixel, eq:W, eq:invariants, eq:square, eq:one-wave, eq:stars, eq:one-spin, eq:magnetic-ratio, eq:polar, eq:speedometer, eq:star-velocity, eq:moving-state, eq:contact, fig:stars, fig:speedometer, app:proofs, eq:proof-stars, eq:proof-midpoint]
figures: [fig:stars, fig:speedometer]
live: [stars, speedometer]
---

A pixel reads ten numbers, six more than a wave needs. What can one reading tell it? We write the ten as one complex table, find four directions on the sky in every reading, and read from them the pixel's own velocity and the state of a moving body.

::: plain
A pixel's ten numbers fit into one table of five complex numbers. An observer who turns, or moves, reads that table turned, by an ordinary angle or by an imaginary one, so its eigenvalues are the same for everyone at that place. Three more numbers give the orientation of the field's own axes, and the last three a velocity.

So a pixel moving through a room of masses at rest can read its own velocity from one reading. Every reading also picks out four directions on the sky, whose pattern tells a single wave from a single body and gives a moving body's position, velocity and mass.
:::

## Ten numbers are six more than a wave needs

A wave needs four numbers, a direction and a complex amplitude (section 9.1), and a detector of one component cannot tell it from the pull of a passing lorry ([R1](/tutorial/newton/reading-section-ii/#the-summary-in-plain-words-holds-number-by-number)). Even the whole electric part cannot find a wave beneath an unknown pull, as one instant shows. A plus wave along $\hat z$ reads $\curv\tE = \curv\tE_+\,\mathrm{diag}(1, -1, 0)$, with $\curv\tE_+$ its amplitude in $\mathrm{s^{-2}}$. Two masses, one on the $y$ axis with the tidal weight $G\matter M/r^3 = \tfrac23\curv\tE_+$ and one on the $z$ axis with $\tfrac13\curv\tE_+$, give by section [1.4](/tutorial/newton/tides/)

$$\begin{aligned}&\tfrac23\curv\tE_+\,\mathrm{diag}(1, -2, 1) + \tfrac13\curv\tE_+\,\mathrm{diag}(1, 1, -2)\\
&\quad= \curv\tE_+\,\mathrm{diag}(1, -1, 0),\end{aligned}$$

the same tide. The magnetic part tells them apart: a wave's is as large as its tide, and masses at rest have none.

## The ten numbers are one complex table, and a wave's is a square

In vacuum the two real tables, each symmetric and trace-free, join into one:

$$\curv{\mathcal W} = \curv\tE + i\,\curv\tB,$$

a symmetric, trace-free table $\sym{weyl-complex}{\curv{\mathcal W}}$ of five independent complex entries in $\mathrm{s^{-2}}$ (section [9.3](/tutorial/one-point/the-matrix-w/#the-ten-numbers-are-one-complex-symmetric-table)).[^W] A turned pixel reads $R^{\mathsf T}\curv{\mathcal W}R$, section 1.1's rule for a table in turned axes.

A pixel moving along the unit vector $\hat u$ with the **rapidity** $\sym{rapidity}{\obs\eta}$, the pure number for which its speed is $c\tanh\obs\eta$ (section [6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not)), reads $\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$. Here $\sym{complex-boost}{\Lambda} = \exp(-i\obs\eta\,\hat u\cdot\mathbf L)$, with generators $\sym{generators}{(L_k)_{ij}} = -\epsilon_{kij}$: a change of velocity is a turn by an imaginary angle (section [9.3](/tutorial/one-point/the-matrix-w/#a-moving-pixel-reads-the-table-turned-by-an-imaginary-angle)). At $0.6c$ along $x$, $\obs\eta = \ln2$ and the rows of $\Lambda$ are $(1, 0, 0)$, $(0, 1.25, 0.75i)$ and $(0, -0.75i, 1.25)$. The group of boosts and turns is $SO(3,\mathbb C)$, the complex rotations [@Petrov2000; @Penrose1960].

A turn has $R^{\mathsf T} = R^{-1}$, and a boost has $\Lambda^{\mathsf T} = \Lambda^{-1}$, because its transpose is the boost with $-\obs\eta$. So both rules give $P\curv{\mathcal W}P^{-1}$, the same table in other axes, and the invariants

$$I = \mathrm{tr}\,\curv{\mathcal W}^2, \qquad J = \mathrm{tr}\,\curv{\mathcal W}^3,$$

which fix the eigenvalues of a trace-free table (section [9.2](/tutorial/one-point/complex-symmetric/#two-complex-numbers-fix-the-eigenvalues-of-a-trace-free-three-by-three-table)), are the same for every observer at that point (section [9.3](/tutorial/one-point/the-matrix-w/#the-eigenvalues-are-the-same-for-every-observer)). For the person of 70 kg a metre away, $I = 1.31\times10^{-16}\unit{s^{-4}}$ and $J = -6.12\times10^{-25}\unit{s^{-6}}$.

A plane wave's table is the square of a vector. With unit vectors $\vect e_1$, $\vect e_2$ across the direction of travel $\hat k$, $\vect e_1\times\vect e_2 = \hat k$, the null vector $\sym{null-vector}{\vect m} = (\vect e_1 + i\vect e_2)/\sqrt2$ has $\hat k\times\vect m = -i\vect m$, since a right-angle turn sends $\vect e_1$ to $\vect e_2$ and $\vect e_2$ to $-\vect e_1$. With section 7.6's magnetic part of a wave,

$$\curv{\mathcal W} = 2(\curv\tE_+ - i\curv\tE_\times)\,\vect m\vect m^{\mathsf T},$$

with the polarization amplitudes $\sym{wave-polarizations}{\curv\tE_+}$ and $\curv\tE_\times$ in $\mathrm{s^{-2}}$: a table of rank one (section [9.1](/tutorial/one-point/spin-two/#a-plane-wave-fills-only-the-extreme-weight-so-its-reading-is-a-square)). Its direction comes back through the **super-Poynting vector**, $\epsilon_{ijk}\curv\tE_{jl}\curv\tB_{kl}$ in $\mathrm{s^{-4}}$ (section 8.4) [@MaartensBassett1998]:

$$\hat n_i = -\frac{\epsilon_{ijk}\,\curv\tE_{jl}\,\curv\tB_{kl}}{\curv\tE_{ab}\,\curv\tE_{ab}}.$$

A plus wave along $\hat z$ with $\curv\tE_+ = 1\unit{s^{-2}}$ gives the vector $(0, 0, 2)\unit{s^{-4}}$ and $|\curv\tE|^2 = 2\unit{s^{-4}}$, so $\hat n = -\hat z$, toward the source. Light's wave field $\light{\vect F} = \light{\vect E} + ic\light{\vect B}$ (section 6.6) is a multiple of $\vect m$ itself, so a square against a single power is spin two against spin one (section [9.1](/tutorial/one-point/spin-two/#lights-wave-is-the-vector-itself-spin-one-against-spin-two)).[^echo]

## Four directions on the sky sort every reading

Label each direction on the sky by its **stereographic coordinate** $z$, a complex number, through the null vector $\vect m(z) = (1 - z^2, i(1 + z^2), -2z)$. Every reading has four directions of its own, the roots of the quartic

$$\vect m(z)^{\mathsf T}\,\curv{\mathcal W}\,\vect m(z) = 0.$$

Here $z$ stands for the direction along which the wave of $\vect m(z)$ travels: $z = 0$ is $+\hat z$, $z = \infty$ is $-\hat z$, and $|z| = \tan(\vartheta/2)$, with $\vartheta$ the angle from $+\hat z$ (section [9.4](/tutorial/one-point/petrov/#a-direction-on-the-sky-is-a-complex-number)). The four roots are the **principal null directions**, and their pattern of coinciding is the field's **Petrov type**: for one plane wave all four coincide, and one body gives two pairs (types and tests in [section 9.4](/tutorial/one-point/petrov/#the-pattern-of-the-four-directions-is-the-fields-petrov-type)). The roots are also the reading's Majorana points (sections [8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky) and [9.4](/tutorial/one-point/petrov/#the-four-directions-are-the-readings-majorana-stars)). The type describes the field, not the objects: with the masses 1 and 0.45 of the figure, at $(-1.5, 0.3, 0)$ and $(0.9, 1.1, 0.6)$, the eigenvalues are $-0.537$, $0.135$ and $0.402$, $I = 0.468$ and $J = -0.0874$, and $1 - 6J^2/I^3$ is $0.553$, not the $0$ of one body. Light's condition $\vect m(z)\cdot\light{\vect F} = 0$ is a quadratic, with two roots (section [6.6](/tutorial/relativity/maxwell-complex/#light-has-two-special-directions-where-gravity-has-four)).[^light]

{{paper fig:stars}}

In the figure the body at $1.5$ along $-\hat x$, moving along $+\hat y$ at $0.9c$, has its directions at $(\pm0.436, 0.9, 0)$, each twice, whose midpoint $(0, 0.9, 0)$ is the caption's $\obs{\vect v}_\perp/c$. The two masses give four directions on two lines, $\pm(-0.797, 0.224, -0.561)$ and $\pm(0.887, 0.227, -0.401)$: type I.

::: try {#stars}
Predict first: with *One body*, as the speed goes from 0 to $0.95c$, do the two pairs stay pairs, and where does their midpoint go? Then try it. Next set the speed to zero, choose *Two*, predict where the second body must go for its four dots to close into two pairs, and drag it there.
:::

## One of the four spins points along the super-Poynting vector

A reading is also a state of four spins one half, unchanged when they are exchanged (section [8.4](/tutorial/quantum/spin/#one-of-the-four-spins-of-a-reading-points-along-its-super-poynting-vector)). What one of them holds, the other three ignored, is

$$\varrho_1 = \tfrac12\Bigl(1 + \frac{\mathbf P\cdot\boldsymbol\sigma}{u}\Bigr),\qquad u = \tfrac12\bigl(|\curv\tE|^2 + |\curv\tB|^2\bigr),\qquad P_k = \epsilon_{kij}(\curv\tE\curv\tB)_{ij}.$$

Here $\varrho_1$ is its density matrix, $\boldsymbol\sigma$ the Pauli matrices, $\sym{super-energy}{u}$ the **super-energy** in $\mathrm{s^{-4}}$ and $\sym{super-poynting}{\mathbf P}$ the super-Poynting vector, so the spin's arrow is $\mathbf P/u$.[^convention] The Petrov types are then classes of entanglement [@BengtssonZyczkowski2017; @Kam2026]. Two checks hold:

- For one plane wave the state is pure: $\mathbf P = |\curv\tE|^2\hat k$ and $|\curv\tB| = |\curv\tE|$, so $u = |\curv\tE|^2$ and the arrow has length one.
- In the field's own rest frame it is unpolarized: $\curv\tE$ and $\curv\tB$ are diagonal along the same axes, so their product is diagonal, hence symmetric, and $P_k = \epsilon_{kij}(\curv\tE\curv\tB)_{ij} = 0$.

## The shape of the tide tells an isolated wave from an isolated mass

A wave's tide has nothing along $\hat k$, so $\det\curv\tE = 0$ (section 7.6). A mass has the eigenvalues $-2:1:1$ times $G\matter M/r^3$, so $\det\curv\tE = -2(G\matter M/r^3)^3$, which is $-2.04\times10^{-25}\unit{s^{-6}}$ for the person, equal to $J/3$. The test holds for an isolated source only: the two masses that imitated a wave [above](#ten-numbers-are-six-more-than-a-wave-needs) have determinant zero, as the wave does.

## The magnetic part equals the tide in a wave and is small near slow matter

The two magnetic ratios are

$$\frac{|\curv\tB|}{|\curv\tE|} = 1\ \ \text{(wave)},\qquad \frac{|\curv\tB|}{|\curv\tE|}\approx\frac vc\ \ \text{(near field)},$$

with $|\curv\tE|$ the **Frobenius norm**, the square root of the sum of the squares of the nine entries, and $v$ the speed of the matter. In a wave $\curv\tB$ is $\curv\tE$ turned by 45° about $\hat k$ (section [7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)). Near a mass crossing the line of sight at the speed $\obs v_\perp$ the ratio is $\sqrt3\,\obs v_\perp/c$ ([section 7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)), $8.09\times10^{-9}$ for a person walking past at $1.4\unit{m\,s^{-1}}$. The changing part of the field, at the angular frequency $\omega$, has a magnetic part smaller than its tide by about $kr$, with $k = \omega/c$ and $r$ the distance: more than $v/c$, but far below one in the near zone (section 7.5).[^kr]

Averaged over time, in mean square, independent waves have equal magnetic and electric parts (section [9.3](/tutorial/one-point/the-matrix-w/#how-large-the-magnetic-part-is-and-where-the-field-points)). A standing wave is the exception: its magnetic part vanishes where the electric part is largest. Two plus waves of amplitude $\curv\tE_+$ along $\pm\hat x$, with $x$ the distance along their line, give $\curv\tE = 2\curv\tE_+\cos kx\cos\omega t\,\mathrm{diag}(0, 1, -1)$. Their magnetic parts, which change sign with the direction of travel, add to $2\curv\tE_+\sin kx\sin\omega t$ times the table with 1 at $yz$ and $zy$, zero where $\cos kx = \pm1$.

## Ten numbers are four invariants, an orientation and a velocity

A reading with different eigenvalues is

$$\curv{\mathcal W} = P\,\mathrm{diag}(\curv w_1, \curv w_2, \curv w_3)\,P^{\mathsf T},\qquad P = R_0\,e^{iK_0},$$

where $\sym{complex-rotation}{P}$ is a **complex rotation**, $P^{\mathsf T}P = 1$, split into a real turn $\sym{polar-turn}{R_0}$ and $e^{iK_0}$, with $\sym{polar-boost}{K_0}$ real and antisymmetric (section [9.2](/tutorial/one-point/complex-symmetric/#every-complex-rotation-is-a-boost-followed-by-a-turn)).[^K0] Since $(iK_0)^\dagger = iK_0$ and $R_0^{\mathsf T}R_0 = 1$, $P^\dagger P = e^{iK_0}R_0^{\mathsf T}R_0e^{iK_0} = e^{2iK_0}$.

The eigenvalues $\sym{weyl-eigenvalue}{\curv w_a}$ give four numbers, $R_0$ three angles and $K_0$ the velocity of the field's **principal observer**, the one observer who reads $\curv\tE$ and $\curv\tB$ along shared axes, unique for type I [@CostaWyllemanNatario2021]. It reads the least $|\curv\tE|^2 + |\curv\tB|^2$ of all observers, $\sum_a|\curv w_a|^2$, by Schur's theorem: every square table is $UTU^\dagger$ with $U$ unitary and $T$ triangular, the eigenvalues on its diagonal (section [9.3](/tutorial/one-point/the-matrix-w/#ten-numbers-are-four-invariants-three-angles-and-a-velocity)). Among the figure's two masses, a pixel at $0.6c$ along $(0.30, 0.80, -0.52)$ reads $|\curv\tE|^2 + |\curv\tB|^2 = 2.27$ in the figure's units, and the room, the principal observer, reads $0.468 = I$, because with real eigenvalues $\sum_a|\curv w_a|^2 = \mathrm{tr}\,\curv{\mathcal W}^2$. The polar split returns $\obs\eta = 0.693147 = \ln2$ and the pixel's velocity $(0.180, 0.480, -0.312)\,c$.

For a scene of masses at rest, $\curv\tB = 0$ in the scene's frame, so every observer finds real eigenvalues, and $P$ holds the pixel's velocity through the room at any speed. To first order in the speed, in right-handed principal axes of $\curv\tE$ with its eigenvalues $\sym{tide-eigenvalue}{\curv\lambda_a}$ in $\mathrm{s^{-2}}$,

$$\curv\tB_{bc} = \frac{\obs v_a}{c}\,(\curv\lambda_c - \curv\lambda_b)\quad((a,b,c)\ \text{cyclic}),$$

with $\obs v_a$ the components of the pixel's own velocity, and the diagonal of $\curv\tB$ vanishes.[^v] With noise of standard deviation $\sigma_n$ on each of the five coefficients of $\curv\tB$, each component is read to $c\,\sigma_n/(\sqrt2\,|\curv\lambda_b - \curv\lambda_c|)$ (section [9.3](/tutorial/one-point/the-matrix-w/#in-a-room-at-rest-a-pixel-reads-its-own-velocity)). With $\sigma_n = 10^{-16}\unit{s^{-2}}$, one part in $10^8$ of $10^{-8}\unit{s^{-2}}$, eigenvalues $10^{-8}\unit{s^{-2}}$ apart give

$$\frac{3.00\times10^8\unit{m\,s^{-1}}\times10^{-16}}{\sqrt2\times10^{-8}} = 2.1\unit{m\,s^{-1}}.$$

Beside the person a metre away the gap across the line is $3G\matter M/r^3 = 1.40\times10^{-8}\unit{s^{-2}}$, giving $1.5\unit{m\,s^{-1}}$, and along the line the two equal squeezes leave no gap, so that component is not read, and a boost along the line changes nothing (9.3).

## Complex eigenvalues show motion in the scene, and light reads less

If the eigenvalues are complex, something in the scene moves relative to the rest of it, or turns (section [9.3](/tutorial/one-point/the-matrix-w/#complex-eigenvalues-mean-that-something-in-the-room-moves-or-turns)). Outside a spinning body they go, to first order in $a$, as $(r - ia\cos\vartheta)^{-3}$, Kerr's result [@Kerr1963]; section 9.3 derived the phase $3a/r$ on the axis. Here $\sym{kerr-parameter}{a}$ is the angular momentum over $\matter Mc$, a length, and $\vartheta$ the angle from the spin axis. For the Earth $a = 5.86\times10^{33}/(5.97\times10^{24}\times2.998\times10^8) = 3.27\unit{m}$, and at the polar surface, $r = 6.357\times10^6\unit{m}$, the phase is $1.54\times10^{-6}$.[^kerr]

On the equator the eigenvalues stay real at first order, and the velocity read is

$$\begin{aligned}\Bigl(1 - \frac{C}{\matter MR^2}\Bigr)\Omega R &= 0.6693\times465.1\unit{m\,s^{-1}}\\ &= 311\unit{m\,s^{-1}},\end{aligned}$$

with $\Omega = 7.292\times10^{-5}\unit{s^{-1}}$ the Earth's rate of turning, $R = 6.378\times10^6\unit{m}$ its radius and $C$ its moment of inertia, $0.3307\,\matter MR^2$.

{{paper fig:speedometer}}

::: try {#speedometer}
Predict first: at $0.6c$, whatever the heading, does the motion test under the path leave its floor? Then try it. Next set *One of the masses* to *Walks* and then to *Flies*, and compare. Last, say which part of the velocity light's arrow leaves out.
:::

Light cannot do this. Its two invariants come from $\light{\vect F}\cdot\light{\vect F} = \light{\vect E}^2 - c^2\light{\vect B}^2 + 2ic\,\light{\vect E}\cdot\light{\vect B}$. In the frame where $\light{\vect E}$ is parallel to $\light{\vect B}$, a boost along their axis changes nothing, so a sensor reads at most two components of its velocity (sections [6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer) and [9.3](/tutorial/one-point/the-matrix-w/#light-reads-only-two-components-of-its-own-velocity-gravity-reads-three)). One body has the same blind spot along the line to it: coming straight at the pixel, even at $0.3c$, it shows no $\curv\tB$, and its exact field gives a magnetic part below $10^{-16}$ of the tide, the rounding error. Two bodies seen off the line through them, or one that is not round seen off its axis, generally remove the blind spot (9.3).

## One pixel reads the position, velocity and mass of a moving body

The four principal null directions of a round body moving steadily are two pairs, displaced by aberration toward its direction of motion, because the four directions move as rays of light do (section [9.4](/tutorial/one-point/petrov/#moving-the-pixel-moves-the-four-directions-as-rays-of-light)). With $\sym{pnd-pairs}{\hat p_\pm}$ the unit vectors of the two pairs and $\obs{\vect v}_\perp$ the body's velocity across the line from the body to the pixel, in $\mathrm{m\,s^{-1}}$,

$$\tfrac12(\hat p_+ + \hat p_-) = \frac{\obs{\vect v}_\perp}{c},$$

and the half difference is $\pm(1 - v_\perp^2/c^2)^{1/2}\,\hat n$, where $\hat n$ is the unit vector toward where the body is now. Section [9.4](/tutorial/one-point/petrov/#one-pixel-reads-the-whole-state-of-a-moving-body) derives both from section [6.3](/tutorial/relativity/aberration/#one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated)'s aberration algebra.[^first] As a check, a body at $(-1, 2, 1.5)$ moving with $(0.5, -0.2, 0.3)\,c$, in units with $G\matter M = c = 1$, has the half sum $(0.4379, -0.0759, 0.3931)$, equal to $\obs{\vect v}_\perp/c$ to eight figures, and a half difference of length $0.80494 = (1 - \obs v_\perp^2/c^2)^{1/2}$ along $\hat n$.

The line turns toward the sideways velocity at the rate $v_\perp/r$, which gives the distance. The repeated eigenvalue is $\curv w = G\matter M/R_*^3$, with $\sym{rest-frame-distance}{R_*}$ the distance in the body's own frame,

$$R_*^2 = \obs\gamma^2\Bigl(r^2 - \frac{|\obs{\vect v}\times\vect r|^2}{c^2}\Bigr),$$

where $\obs\gamma = (1 - \obs v^2/c^2)^{-1/2}$ is section [6.1](/tutorial/relativity/lorentz/#a-moving-ruler-is-shorter-along-its-motion-and-distances-in-a-bodys-own-frame-are-longer)'s factor for the body's speed $\obs v$ relative to the pixel. The vector $\obs{\vect v}\times\vect r$ is constant along the path because $\dot{\vect r} = \obs{\vect v}$. So

$$\begin{gathered}r = \frac{\obs v_\perp}{|\dot{\hat n}|},\qquad \dot r = -\frac r3\Bigl(1 - \frac{\obs v_\perp^2}{c^2}\Bigr)\frac{\dot{\curv w}}{\curv w},\\
\matter M = \frac{\curv w\,\obs\gamma^3r^3}{G}\Bigl(1 - \frac{\obs v_\perp^2}{c^2}\Bigr)^{3/2}.\end{gathered}$$

For the body above, three readings $10^{-4}$ apart give $r = 2.692582$ (the true $\sqrt{7.25}$), $\dot r = -0.167126\,c$ and $\matter M = 1.000000$, true to seven figures. These are seven numbers: two angles of $\hat n$ and the distance $r$ give the position, the two components of $\obs{\vect v}_\perp$ and the rate $\dot r$ give the velocity, and $\matter M$ is the seventh.

A body coming straight on cannot be ranged, but its tide along the line, $\sym{line-tide}{\curv\tE_\parallel}$, gives its time to arrival and whether it coasts:

$$-\frac r{\dot r} = \frac{3\curv\tE_\parallel}{\dot{\curv\tE}_\parallel},\qquad \frac{\curv\tE_\parallel\ddot{\curv\tE}_\parallel}{\dot{\curv\tE}_\parallel^2} = \frac43 - \frac{r\ddot r}{3\dot r^2}.$$

For a body coasting straight in at $0.5c$ from 3 units, finite differences of $\curv\tE_\parallel = -2G\matter M/\obs\gamma^3r^3$ give $3\curv\tE_\parallel/\dot{\curv\tE}_\parallel = 6.000 = -r/\dot r$, the time to arrival, and the second ratio $1.3333 = \tfrac43$.[^contact]

**The idea to keep: a pixel's ten numbers are one complex table that every observer reads turned, so its eigenvalues are four numbers all agree on, and the rest is the field's axes and a velocity. Its four principal null directions sort fields into types and give a moving body's position, velocity and mass.**

::: problems
### Practice

**[R9]** Rerun the speedometer's chain for R1's lorry, 20 tonnes at 10 m, read with noise $10^{-16}\unit{s^{-2}}$: its repeated eigenvalue $\curv w$, the invariants $I$ and $J$, and the precision of each velocity component that the lorry alone lets a pixel read.

::: solution
$\curv w = G\matter M/r^3 = 1.33\times10^{-9}\unit{s^{-2}}$, so $I = 6\curv w^2 = 1.07\times10^{-17}\unit{s^{-4}}$ and $J = -6\curv w^3 = -1.43\times10^{-26}\unit{s^{-6}}$. The gap across the line is $3\curv w = 4.00\times10^{-9}\unit{s^{-2}}$, so the two components across it are read to $5.3\unit{m\,s^{-1}}$, and the one along it not at all.
:::

**[R9]** A pixel moves through a still room whose tide has two eigenvalues $3\times10^{-9}\unit{s^{-2}}$ apart, read with noise $10^{-17}\unit{s^{-2}}$ on each coefficient. How well does it know the velocity component that this gap controls?

::: solution
To $2.998\times10^8\times10^{-17}/(1.414\times3\times10^{-9}) = 0.71\unit{m\,s^{-1}}$.
:::

**[R9]** Two equal masses sit one unit from the pixel, along $\hat x$ and along $\hat y$, with the tide $\mathrm{diag}(-1, -1, 2)$ in units of $G\matter M/r^3$. Why could one body not make it, although it has a repeated eigenvalue?

::: solution
Here $I = J = 6$, so the repeated eigenvalue $-J/I = -1$ is negative, while one body's is positive.
:::

### Stretch

**[R9]** A pixel moves at $1\unit{m\,s^{-1}}$ along $\hat x$ through the tide $\curv\tE_+\,\mathrm{diag}(1, -1, 0)$ of this section's two masses. Find its $|\curv\tB|/|\curv\tE|$ from the first-order formula for $\curv\tB$ above, and say whether any motion of the pixel could make the masses read like the plus wave.

::: solution
In the right-handed axes $\hat x$, $\hat y$, $\hat z$, $\curv\lambda_a = \curv\tE_+$, $-\curv\tE_+$, $0$, and only $\obs v_1 \neq 0$, so $\curv\tB_{23} = \curv\tB_{32} = (\obs v_1/c)(\curv\lambda_3 - \curv\lambda_2) = \curv\tE_+\obs v_1/c$, and the other entries vanish. Then $|\curv\tB|/|\curv\tE| = \obs v_1/c = 3.3\times10^{-9}$, against 1 for the wave. No motion can do it: the masses' $I = 2\curv\tE_+^2$ is the same for every observer, and the wave's square $\curv{\mathcal W} = 2\curv\tE_+\vect m\vect m^{\mathsf T}$ has $I = 0$.
:::

### The camera

Two plus waves, along $\hat z$ and along $\hat x$, have tides that at one instant add to the tide of one mass. Build them for a mass on the $z$ axis, and say what still tells the pair of waves from the mass.

::: solution
Waves along $\hat z$ and $\hat x$ of amplitudes $s$ and $s'$, in $\mathrm{s^{-2}}$, give $s\,\mathrm{diag}(1, -1, 0) + s'\,\mathrm{diag}(0, 1, -1)$, which is a mass's $s\,\mathrm{diag}(1, 1, -2)$, with determinant $-2s^3$, when $s' = 2s$. Their magnetic parts sit at $xy$ and $yz$ and cannot cancel: $|\curv\tB|^2 = 2s^2 + 8s^2 = 10s^2$ against $|\curv\tE|^2 = 6s^2$, a ratio of $1.29$, where one mass at rest has none.
:::
:::

::: paper
- Section VIII's plain words, opening and [*One complex matrix*](/paper/#par:one-complex-matrix): the paper's [](/paper/#eq:W), [](/paper/#eq:invariants), [](/paper/#eq:square) and [](/paper/#eq:one-wave).
- Section VIII's [*Principal null directions*](/paper/#par:principal-null-directions), [*Shape*](/paper/#par:shape) and [*The magnetic part*](/paper/#par:the-magnetic-part): the paper's [](/paper/#eq:stars), [](/paper/#eq:one-spin) and [](/paper/#eq:magnetic-ratio), and Figure [](/paper/#fig:stars).
- Section VIII's [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity): the paper's [](/paper/#eq:polar) and [](/paper/#eq:speedometer), and Figure [](/paper/#fig:speedometer).
- Section VIII's [*The state of a moving body*](/paper/#par:the-state-of-a-moving-body), with Appendix C's [*The principal null directions of a moving body*](/paper/#par:the-principal-null-directions-of-a-moving-body): the paper's [](/paper/#eq:star-velocity), [](/paper/#eq:moving-state) and [](/paper/#eq:contact).
:::

::: deeper
- The GR course's [section 10.7](https://neovand.github.io/general-relativity/chapter-10.html#10-7-scalar-invariants-are-powerful-but-spacetime-has-a-loophole) builds curvature invariants like $I$ and $J$ and shows what they miss.
:::

[^W]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equations [](/paper/#eq:W), [](/paper/#eq:invariants), [](/paper/#eq:square), [](/paper/#eq:one-wave), [](/paper/#eq:stars) and [](/paper/#eq:one-spin).

[^echo]: Matter neither reflects nor absorbs gravitational waves, so echoes do not spoil a direction (section [5.5](/tutorial/waves/radiance/); argued in *The gravitational camera* (Mohsenvand 2026), Sec. VII).

[^light]: A static field with $c\light{\vect B}$ as large as $\light{\vect E}$ and at right angles to it has $\light{\vect F}\cdot\light{\vect F} = 0$ and one double direction, although it is not a wave (6.6). For gravity, masses 1 and 0.45 on one line through the pixel, 1.5 and 0.9 away on opposite sides, make one body's reading, with the eigenvalue $0.914$ twice (9.4).

[^convention]: With $\curv{\mathcal W}$ itself the state, a plus wave along $\hat z$ has $\mathbf P/u = (0, 0, 1)$ (8.4).

[^kr]: For a body swaying with the amplitude $d$, the changing tide goes as $G\matter Md/r^4$ and its magnetic part as $G\matter M\omega d/cr^3$, so the ratio is $\omega r/c = kr = (v/c)(r/d)$, with $v = \omega d$ (7.5). First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation [](/paper/#eq:magnetic-ratio).

[^K0]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation [](/paper/#eq:polar).

[^v]: The velocity here is the pixel's through the room, opposite to the scene's velocity that $P$ holds. First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation [](/paper/#eq:speedometer).

[^kerr]: For the Earth the first order in $a$ is enough, because $a/r = 5.2\times10^{-7}$.

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equations [](/paper/#eq:star-velocity), [](/paper/#eq:moving-state) and [](/paper/#eq:contact), with Appendix C's proofs [](/paper/#eq:proof-stars) and [](/paper/#eq:proof-midpoint).

[^contact]: The $r^{-3}$ law needs $\obs\gamma$ to stay fixed, which holds while $\obs\gamma^2r|\ddot r| \ll c^2$.
