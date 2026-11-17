# Gravitational Camera: A Second Research Review

## New calculations, deeper connections, and a roadmap for the engine

**For Mostafa “Neo” Mohsenvand**  
**Reviewed:** the revised 20-page *Gravitational Camera: A Thought Experiment*, working draft dated 16 November 2026.  
**Review date:** 16 November 2026.

> **Central recommendation.** Make the paper a study of what gravitational observations make identifiable. Its most memorable examples can be pairs of radically different worlds that give identical measurements, followed by the additional measurement that finally distinguishes them. A common propagation model and a reproducible inference engine would turn those examples into a resource other researchers can use.

This review builds on the [first research memo][FirstReview] and refers to the [new manuscript][Draft] by its printed page, section, and equation numbers. I read the revised paper in full, inspected its figures, and checked several additional derivations numerically. The engine's source code was not supplied; proposals about it are based on the manuscript's description, rather than an audit of its implementation.

Three labels distinguish the status of the material:

- **Established:** a result or framework in the cited literature.
- **Derived here:** a consequence worked out for this review, with its assumptions stated. This label does not claim publication priority.
- **Proposed:** a calculation, experiment, or implementation that remains to be completed.

The bibliography gives primary sources, links, and notes where only an abstract or bibliographic record was accessible. It includes the sources used in this second review; the earlier memo retains its own full bibliography.

---

## Contents

1. [What the revision has achieved, and where to go next](#1-what-the-revision-has-achieved-and-where-to-go-next)
2. [Twelve sources that look exactly like an entire diffuse sky](#2-twelve-sources-that-look-exactly-like-an-entire-diffuse-sky)
3. [A hierarchy of local information, and the importance of source statistics](#3-a-hierarchy-of-local-information-and-the-importance-of-source-statistics)
4. [One pixel can learn distance by watching a mass move](#4-one-pixel-can-learn-distance-by-watching-a-mass-move)
5. [An invisible flywheel and the limits of the magnetic image](#5-an-invisible-flywheel-and-the-limits-of-the-magnetic-image)
6. [One propagation operator from static gravity to radiation](#6-one-propagation-operator-from-static-gravity-to-radiation)
7. [A defensible quantum limit on a specified imaging task](#7-a-defensible-quantum-limit-on-a-specified-imaging-task)
8. [How many features, and how much information, does the image contain?](#8-how-many-features-and-how-much-information-does-the-image-contain)
9. [Thermal balance changes the meaning of a gravitational image](#9-thermal-balance-changes-the-meaning-of-a-gravitational-image)
10. [When a black hole disappears into the gravitational sky](#10-when-a-black-hole-disappears-into-the-gravitational-sky)
11. [The primordial background and the spectral window that saves the toy Earth image](#11-the-primordial-background-and-the-spectral-window-that-saves-the-toy-earth-image)
12. [Memory as an angular record of escaped energy](#12-memory-as-an-angular-record-of-escaped-energy)
13. [Three further directions worth developing](#13-three-further-directions-worth-developing)
14. [The engine as a community instrument](#14-the-engine-as-a-community-instrument)
15. [Claims to tighten before the next public version](#15-claims-to-tighten-before-the-next-public-version)
16. [What I would build and write first](#16-what-i-would-build-and-write-first)
17. [Verification and reproducibility notes](#17-verification-and-reproducibility-notes)
18. [References](#18-references)

---

## 1. What the revision has achieved, and where to go next

The revised paper has become substantially stronger in the places that matter. Section IV now separates a rendering of a known mass distribution from a uniquely recoverable image. It gives the exterior density nullspace explicitly, distinguishes point-source localization from the width of a reconstructed point, and introduces a finite-aperture estimate. Sections VI and IX acknowledge the dependence of thermal emission on the dynamic shear response and the difference between counting quanta and recording local field quadratures. The new magnetic-current channel, memory examples, and cosmological scenes expand the scientific scope. These are substantial improvements, not merely changes in presentation. [Draft, §§IV, VI, VIII–XI][Draft]

The opportunity now is to connect these developments with a small number of particularly clear results. The paper already contains enough interesting vistas. A stronger next revision would give the reader several deductions they can reuse:

| Opportunity | Main insight | Immediate scientific payoff |
|---|---|---|
| Twelve sources versus a diffuse sky | Complete local Gaussian data can be exactly identical for radically different positive skies | A concrete observability theorem and a memorable demonstration |
| One-pixel ranging | A small relativistic magnetic term can remove an exact scale ambiguity in the electric time series | A compact, surprising inversion formula |
| Invisible counterrotation | Adding the magnetic channel does not uniquely reveal internal flow | A constructive current nullspace and a demanding benchmark |
| Unified angular-spectrum propagation | Static exponential attenuation and wave propagation are limits of one operator | A principled engine across the near and radiation zones |
| A conditional quantum discrimination bound | Quantum resources encounter the same exponentially weak source differences | A rigorous replacement for the current universal sensitivity assertion |
| Thermal balance and black-hole contrast | An image measures departures from the radiation environment as well as spontaneous emission | A physically complete radiative renderer and a striking new black-hole demo |
| Information modes | Resolution alone does not describe how much a camera learns | A reusable inference and sensor-design tool |

My strongest editorial recommendation is to organize the core around three questions:

1. **Which different sources produce exactly the same data?**
2. **Which differences survive, but become expensive to measure?**
3. **Which additional resource changes the answer: a baseline, time dependence, polarization, a spectral band, or a prior?**

These questions connect the room scenes, the quantum receiver, and the sky. They also make the engine's purpose precise: it can show not only a predicted field, but what an observer could infer from that field.

## 2. Twelve sources that look exactly like an entire diffuse sky

**Status:** derived application of the draft's local angular theorem and the established mathematics of spherical designs. The covariance equality and baseline expansions were checked numerically.

This is the first demonstration I would add.

### 2.1 Two completely different skies

At a fixed positive angular frequency $\omega$, consider stationary, unpolarized, directionally independent, zero-mean Gaussian radiation. Let $W(\omega)$ be the total directional spectral weight.

Compare a uniform sky,

$$
I_{\mathrm{iso}}(\mathbf n,\omega)=\frac{W(\omega)}{4\pi},
$$

with twelve equally bright directions,

$$
I_{\mathrm{ico}}(\mathbf n,\omega)
=\frac{W(\omega)}{12}
\sum_{a=1}^{12}\delta_{S^2}(\mathbf n-\mathbf n_a).
$$

Place the directions at the vertices of a regular icosahedron. Writing

$$
\varphi=\frac{1+\sqrt5}{2},
$$

the vertices are

$$
\frac{(0,\pm1,\pm\varphi)}{\sqrt{1+\varphi^2}},
\qquad
\frac{(\pm1,\pm\varphi,0)}{\sqrt{1+\varphi^2}},
\qquad
\frac{(\pm\varphi,0,\pm1)}{\sqrt{1+\varphi^2}}.
$$

There are four independent sign choices in each family, giving twelve points.

The icosahedron is a spherical 5-design: averaging a polynomial of degree at most five over these vertices gives exactly its uniform spherical average. This is established mathematics, and should be credited to the spherical-design literature. [DGS77][DGS77] [R95][R95]

### 2.2 Why every local covariance agrees

Let $F_A$, $A=1,\ldots,10$, denote the five independent electric and five independent magnetic curvature components. The unpolarized covariance has the form

$$
C_{AB}(\omega)
=\int_{S^2}
I(\mathbf n,\omega)K_{AB}(\mathbf n)\,d\Omega.
$$

The draft establishes that these local kernels contain angular degrees no higher than four. Equivalently, they can be represented by polynomials of degree at most four on the unit sphere. The icosahedral quadrature is therefore exact for every one of them:

$$
\boxed{
C_{AB}^{\mathrm{ico}}(\omega)
=C_{AB}^{\mathrm{iso}}(\omega)
\quad\text{for every }A,B.
}
$$

This equality includes electric–magnetic cross-correlations. It is not merely equality of total power.

If the equality holds at every frequency, with the same spectral shape for the twelve sources, the two skies produce the same complete local stationary Gaussian process. A Gaussian process is fixed by its mean and covariance. Consequently, no amount of observation at this one point distinguishes these two statistical models.

Rotating a receiver at that fixed point does not help: it applies known transformations to identically distributed data. Translating it introduces spatial baselines and can help.

This example makes the local-information limitation tangible. Every source has positive intensity. There are no negative masses, no subtraction of an unphysical sky, and no numerical regularization hiding the difference.

### 2.3 A baseline breaks the equality—and tensor data reveal it early

Choose a baseline $b$ along the $z$ axis and define

$$
x=kb,\qquad k=\frac{\omega}{c}.
$$

For the $E_{zz}$ correlation, use normalized directional averages and the polarization-summed kernel

$$
K_{zz,zz}(\mathbf n)=(1-n_z^2)^2.
$$

An overall spectral normalization multiplies all the following covariances. The relative results are independent of that choice.

The two skies have identical second and fourth directional moments, but

$$
\langle n_z^6\rangle_{\mathrm{ico}}=\frac{2}{15},
\qquad
\langle n_z^6\rangle_{\mathrm{iso}}=\frac17.
$$

Expanding the baseline phase $e^{ixn_z}$ gives

$$
C_{zz,zz}^{\mathrm{ico}}(b)
-C_{zz,zz}^{\mathrm{iso}}(b)
=\frac{x^2}{210}+O(x^4),
$$

while

$$
C_{zz,zz}(0)=\frac8{15}.
$$

Thus

$$
\boxed{
\frac{C_{zz,zz}^{\mathrm{ico}}(b)
-C_{zz,zz}^{\mathrm{iso}}(b)}
{C_{zz,zz}(0)}
=\frac{(kb)^2}{112}+O((kb)^4).
}
$$

Now discard the tensor weighting and form the normalized trace visibility, whose directional kernel is constant. Then

$$
V_{\mathrm{iso}}(x)=\frac{\sin x}{x},
$$

$$
V_{\mathrm{ico}}(x)=
\frac{
1+\cos\!\left(\frac{x}{\sqrt{1+\varphi^2}}\right)
+\cos\!\left(\frac{\varphi x}{\sqrt{1+\varphi^2}}\right)}
3,
$$

and

$$
\boxed{
V_{\mathrm{ico}}(x)-V_{\mathrm{iso}}(x)
=\frac{x^6}{75600}+O(x^8).
}
$$

At $kb=0.1$, the leading relative $E_{zz}$ difference is $8.93\times10^{-5}$, while the normalized scalar-visibility difference is $1.32\times10^{-11}$.

These are differently normalized observables; their ratio is not an exposure-time or Fisher-information gain. The useful conclusion is structural: retaining tensor correlations can expose a higher angular moment at a much lower power of baseline.

### 2.4 Exact curves for an engine benchmark

Define

$$
a=\frac1{\sqrt{1+\varphi^2}},
\qquad
d=\frac{\varphi}{\sqrt{1+\varphi^2}}.
$$

With the normalization above,

$$
C_{zz,zz}^{\mathrm{ico}}(x)
=\frac{1+d^4\cos(ax)+a^4\cos(dx)}3,
$$

$$
C_{zz,zz}^{\mathrm{iso}}(x)
=\frac{8j_2(x)}{x^2}
=8\frac{(3-x^2)\sin x-3x\cos x}{x^5}.
$$

The continuous value at zero is $8/15$. Use a Taylor expansion near zero to avoid catastrophic cancellation.

**Demo specification.** Show the uniform sky and twelve-point sky side by side. Below them show the same local tensor covariance. Add a baseline control and a selector for the complete tensor correlations versus the scalar trace visibility. The first detectable difference should follow the analytic curves above.

This is a demonstration readers can remember and other groups can reproduce exactly.

## 3. A hierarchy of local information, and the importance of source statistics

The revised local angular theorem can become a broader statement about the information in a finite neighborhood.

### 3.1 From a pixel to its spatial derivatives

**Status:** the upper bound below is derived by a polynomial argument; attainability was numerically checked for derivative orders zero, one, and two.

Suppose the receiver knows all spatial derivatives through order $p$:

$$
y_{A,\alpha}(\omega)
=\partial^\alpha F_A(\mathbf x_0,\omega),
\qquad |\alpha|\le p.
$$

Here $\alpha$ is a spatial multi-index. For a plane wave, each derivative contributes a factor

$$
(ik)^{|\alpha|}\mathbf n^\alpha.
$$

The covariance of two such derivatives is therefore

$$
C_{A\alpha,B\beta}
=i^{|\alpha|}(-i)^{|\beta|}
k^{|\alpha|+|\beta|}
\int d\Omega\,
\mathbf n^\alpha\mathbf n^\beta
K_{AB}(\mathbf n)I(\mathbf n).
$$

The angular degree of the integrand's response kernel cannot exceed

$$
\boxed{\ell_{\max}\le4+2p.}
$$

The same degree counting extends to the scalar intensity and circular-polarization moments of a polarized sky, with the appropriate spin-weighted description for linear polarization.

For the complete ideal electric/magnetic data, numerical response ranks give:

| Highest spatial derivative order | Highest possible intensity degree | Verified number of independent intensity coefficients |
|---:|---:|---:|
| $p=0$ | $4$ | $25$ |
| $p=1$ | $6$ | $49$ |
| $p=2$ | $8$ | $81$ |

The polynomial argument proves the upper bound for arbitrary $p$. These three numerical rank checks should not be presented as a proof of full attainability for every $p$ without an additional spanning argument.

For any $\ell>4+2p$, two positive skies

$$
I_\pm(\mathbf n)
=I_0\left[1\pm\epsilon Y_{\ell m}(\mathbf n)\right],
$$

with a real harmonic normalized so that $|\epsilon Y_{\ell m}|\le1$, give exactly the same derivative covariances. This extends the paper's local nullspace into a hierarchy.

Temporal derivatives alone multiply a fixed-frequency response by powers of $\omega$; they do not raise this angular cutoff. Distinct source spectra or a dynamical source model can supply additional information, but that information belongs to the source assumptions.

### 3.2 Why this does not create an infinitely sharp tiny camera

Spatial derivatives have to be measured. Estimating a derivative of order $p$ over a physical width $D$ amplifies measurement noise roughly as $D^{-p}$. Normalizing the derivative by $k^p$ also transforms its noise.

The finite-derivative theorem states which angular moments are present in ideal data. It does not say those moments are equally measurable. A finite array samples the full baseline exponential and can carry arbitrarily high angular orders in principle, while the corresponding singular values become very small.

The engine can display both the exact angular support of a truncated derivative model and the noise-weighted singular values of a real array. This would connect the single-pixel theorem directly to aperture design.

### 3.3 Independence is not the same as Gaussianity

There is an important qualification to the revised wording on pp. 11–12. Its proof establishes a statement about second moments. It becomes a limit on *all* local statistical information when second moments are sufficient, as for the stationary Gaussian field used above.

Independent sources need not produce a Gaussian field. A sequence of rare, separated bursts is a counterexample. The distinction between continuous Gaussian and intermittent non-Gaussian gravitational backgrounds is established in the literature. [DF03][DF03]

For one plane wave with nonzero electric field at an instant, the draft's magnetic convention gives its propagation direction as

$$
\boxed{
n_i=
\frac{\epsilon_{ijk}E_{j\ell}B_{k\ell}}
{E_{ab}E_{ab}}.
}
$$

A sequence of sufficiently strong, nonoverlapping plane-wave bursts can therefore be localized event by event with an ideal full-tensor pixel. The resulting direction histogram can be much sharper than the degree-four covariance reconstruction. It uses temporal sparsity and event identification.

One can write a compound-Poisson model,

$$
y_a(t)=\sum_k A_k\,r_a(\mathbf n_k,\psi_k)\,s(t-t_k),
$$

where event directions have rate density $\lambda(\mathbf n)$. If amplitude and waveform distributions are independent of direction, its connected $m$th cumulant has the form

$$
\kappa_{a_1\cdots a_m}
=\langle A^m\rangle
\int s(u)^m\,du
\int d\Omega\,
\lambda(\mathbf n)
\left\langle
r_{a_1}\cdots r_{a_m}
\right\rangle_{\psi}.
$$

Higher cumulants contain information absent from the covariance. In particular, fourth-order angular responses can reach beyond degree four. Exactly Gaussian signals have no connected cumulants above second order.

**Demo specification.** Keep the second-order sky statistics fixed while changing the event duty cycle and signal distribution. Contrast Gaussian overlapping radiation with resolvable bursts. Show what covariance imaging returns and what event localization returns. The lesson is that an angular response kernel, statistical source assumptions, and a localization error are different objects.

## 4. One pixel can learn distance by watching a mass move

**Status:** derived here from the paper's leading-order point-mass fields; verified on a generic three-dimensional trajectory.

This is probably the best compact calculation to add to Section VIII. The revised paper uses spatial gradients to recover distance. Its magnetic channel permits another route.

### 4.1 The point-source model

Take an isolated point mass $M$ at position $r\mathbf n$ relative to a fixed, calibrated, nonrotating observer. Work in the slow-motion near zone, to the order retained in the draft's Eq. (29). Define

$$
A=\frac{GM}{r^3},
\qquad
P=\mathbb I-\mathbf n\mathbf n^{\mathsf T}.
$$

Then

$$
E=A\left(\mathbb I-3\mathbf n\mathbf n^{\mathsf T}\right),
$$

$$
B=\frac{3A}{c}
\left[
\mathbf n(\mathbf n\times\mathbf v)^{\mathsf T}
+(\mathbf n\times\mathbf v)\mathbf n^{\mathsf T}
\right].
$$

The negative eigenvalue of $E$ is $-2A$, and its eigenvector gives the source axis $\pm\mathbf n$.

Because

$$
\dot{\mathbf n}=\frac{\mathbf v_\perp}{r},
$$

differentiating the electric tensor gives

$$
P\dot E\,\mathbf n=-3A\dot{\mathbf n},
$$

whereas

$$
B\mathbf n
=\frac{3A}{c}\,\mathbf n\times\mathbf v
=-\frac rc\,\mathbf n\times\dot E\,\mathbf n.
$$

Therefore, when the transverse motion is nonzero,

$$
\boxed{
r=c\,
\frac{\|B\mathbf n\|}
{\|P\dot E\,\mathbf n\|}.
}
$$

No spatial derivative appears.

### 4.2 The sign and the remaining parameters

Let

$$
\mathbf w=\mathbf n\times\dot E\,\mathbf n.
$$

The signed expression is

$$
r=-c\,\frac{(B\mathbf n)\cdot\mathbf w}{\|\mathbf w\|^2}.
$$

Under $\mathbf n\mapsto-\mathbf n$, $\mathbf w$ stays fixed but $B\mathbf n$ changes sign. Choosing the branch that gives positive $r$ resolves the instantaneous antipodal ambiguity.

Then

$$
M=\frac{Ar^3}{G},
\qquad
\mathbf v_\perp=-\frac{c}{3A}\,\mathbf n\times B\mathbf n,
$$

and, for constant $M$,

$$
\dot A=-\frac12\mathbf n^{\mathsf T}\dot E\,\mathbf n,
\qquad
v_r=-\frac r3\frac{\dot A}{A},
\qquad
\mathbf v=\mathbf v_\perp+v_r\mathbf n.
$$

Thus the time record determines position, mass, and velocity within this specified source model.

### 4.3 Why the relativistic correction changes the inverse problem

The entire electric time series is invariant under

$$
\mathbf x(t)\mapsto\lambda\mathbf x(t),
\qquad
\mathbf v(t)\mapsto\lambda\mathbf v(t),
\qquad
M\mapsto\lambda^3M.
$$

The electric field alone therefore has an exact scale ambiguity, even with perfect time resolution. Under the same transformation,

$$
B(t)\mapsto\lambda B(t).
$$

The magnetic field supplies an absolute velocity scale through $c$ and breaks the ambiguity. Its scientific value is not merely a smaller error bar: it changes what is identifiable.

Gravity-gradient localization already has a substantial literature. That literature should be acknowledged before making a priority claim for this particular electric/magnetic/time-derivative construction. [WT10][WT10]

### 4.4 Numerical check and demo

For

$$
\mathbf x=(1.7,-0.9,0.6)\ \mathrm m,\qquad
\mathbf v=(0.3,0.8,-0.1)\ \mathrm{m\,s^{-1}},\qquad
M=70\ \mathrm{kg},
$$

the true distance is $2.014944167961$ m. A centered numerical derivative of the synthetic $E(t)$ gives a recovered distance of $2.014944167999$ m and a recovered mass of $70.000000004$ kg. The position and velocity reconstruction agree at the numerical differentiation accuracy.

**Demo specification.** Show two hidden flybys: the second is ten times farther away, moves ten times faster, and has a thousand times the mass. Their electric time series coincide. Enabling the magnetic channel separates them and recovers their absolute scales.

The necessary limitations belong beside the formula:

- Pure radial motion gives zero numerator and denominator; this construction does not range it.
- The source must be isolated and adequately modeled as a point mass with constant mass.
- Intrinsic source spin, other foregrounds, and higher-order velocity corrections need to be included when relevant.
- Estimate $\dot E$ through a finite-window dynamical fit; differentiating white noise directly is not a valid measurement procedure.
- The magnetic signal is smaller by order $v/c$, so its signal-to-noise ratio is the bottleneck.
- Observer motion and rotation must be calibrated, as discussed next.

### 4.5 A moving camera creates a magnetic foreground

Electric and magnetic curvature are observer-dependent parts of one curvature tensor. Their invariant and observer-dependent descriptions are treated systematically in [WCN21][WCN21].

For a new orthonormal observer moving with velocity $\mathbf u$ relative to the old frame, the draft's conventions give, to first order,

$$
E'_{ij}
=E_{ij}
+\frac1c
\left(
\epsilon_{ik\ell}u_kB_{\ell j}
+\epsilon_{jk\ell}u_kB_{\ell i}
\right)
+O(u^2/c^2),
$$

$$
B'_{ij}
=B_{ij}
-\frac1c
\left(
\epsilon_{ik\ell}u_kE_{\ell j}
+\epsilon_{jk\ell}u_kE_{\ell i}
\right)
+O(u^2/c^2).
$$

These expansions were checked by directly transforming the Riemann tensor. A static mass acquires exactly the magnetic tide associated with relative velocity $-\mathbf u$.

For scale, Earth's monopole has

$$
A_\oplus=\frac{GM_\oplus}{R_\oplus^3}
\simeq1.54\times10^{-6}\ \mathrm{s^{-2}}.
$$

A horizontal platform velocity produces a magnetic component of order

$$
\frac{3A_\oplus u}{c}
\simeq1.54\times10^{-14}
\left(\frac{u}{1\ \mathrm{m\,s^{-1}}}\right)
\mathrm{s^{-2}}.
$$

A 100 Hz wave with strain amplitude $10^{-21}$ has electric amplitude about $1.97\times10^{-16}\ \mathrm{s^{-2}}$. A velocity fluctuation of order $0.013\ \mathrm{m\,s^{-1}}$ in that frequency band would mix a comparable component of the Earth tide into $B$ in this illustrative geometry. A constant velocity creates a constant or slowly varying foreground; it is the velocity content in the signal band that matters.

**Useful engine feature:** allow a change of observer while keeping the physical spacetime fixed. Check that $E:E-B:B$ and $E:B$ remain unchanged in vacuum, even though the displayed electric and magnetic images change. This would make the observer's role explicit and strengthen the interpretation of a “velocity image.”

## 5. An invisible flywheel and the limits of the magnetic image

**Status:** derived here at Newtonian order for $E$ and first order in velocity for $B$; checked by an independent volume integral.

The new current-column picture is one of the revision's strongest additions. It also creates an opportunity to ask the same inverse question already asked of mass density: does the exterior field determine the internal current?

It does not.

### 5.1 A whole family of indistinguishable internal flows

Take a spherical density distribution $\rho(r)$ of radius $R_s$, with differential rotation

$$
\mathbf v(\mathbf x)
=\Omega(r)\,\widehat{\mathbf z}\times\mathbf x.
$$

Each thin spherical layer is a rotating shell. To first order in velocity, its exterior field is a spin dipole. Summing the layers shows that all exterior magnetic curvature depends on

$$
\boxed{
L_z=\frac{8\pi}{3}
\int_0^{R_s}\rho(r)r^4\Omega(r)\,dr.
}
$$

This uses the usual current-multipole organization of weak gravitational fields. [Th80][Th80] The following explicit nullspace is a direct consequence:

$$
\int_0^{R_s}\rho(r)r^4\,\delta\Omega(r)\,dr=0
\quad\Longrightarrow\quad
\delta B_{ij}=0
\quad\text{everywhere outside the body, at this order}.
$$

There are infinitely many such profiles. More exterior sensors do not determine which profile is present.

### 5.2 A particularly simple invisible counterrotation

For constant density, choose

$$
\Omega(r)=
\begin{cases}
+\Omega_0,&0<r<a,\\
-\Omega_0,&a<r<R_s.
\end{cases}
$$

The total angular momentum is proportional to

$$
\int_0^a r^4\,dr-\int_a^{R_s}r^4\,dr
=\frac{2a^5-R_s^5}{5}.
$$

It vanishes at

$$
\boxed{
a=2^{-1/5}R_s
\simeq0.87055056\,R_s.
}
$$

The interior contains strong counterrotation, while its exterior magnetic field is zero to the retained order. Its Newtonian electric field is the same as that of the same spherical density at rest. As a stationary axisymmetric continuum, it has no time-dependent quadrupole radiation.

The model can be interpreted as independently supported concentric layers. Kinetic energy and supporting stresses enter the electric field at higher order. This construction is not an assertion of exact invisibility in full general relativity. Reversing every angular velocity gives another useful comparison: it reverses the internal flow while preserving the local squared speed and the zero leading-order exterior magnetic field.

An independent quadrature of

$$
\boldsymbol{\mathcal A}(\mathbf x)
=\int
\frac{\rho(r')\Omega(r')\,\widehat{\mathbf z}\times\mathbf x'}
{|\mathbf x-\mathbf x'|}
\,d^3x'
$$

agreed with the exterior expression

$$
\boldsymbol{\mathcal A}(\mathbf x)
=\frac{\mathbf L\times\mathbf x}{2r^3}
$$

to absolute errors of order $10^{-16}$ in dimensionless test cases. The two-zone counterrotation cancels to the same accuracy.

### 5.3 What to change in the paper

The shell-versus-ball comparison on p. 13 needs **equal angular velocity** to obtain the stated $5/3$ ratio. Equal angular momentum gives equal exterior spin-dipole fields. The word “spin” is ambiguous here.

Table IV's “see flow inside a sealed body” can be made precise: the magnetic channel constrains exterior current multipoles and can distinguish some flows that electric data cannot. It does not generally recover the full flow field.

There is a parallel caveat to “mass has one sign, so nothing hides that it is there.” A complete finite curvature array inside a spherical shell sees zero shell-induced Newtonian tidal field throughout the cavity. This is not just cancellation at one point. The unbounded exterior of a source and a vacuum cavity enclosed by the source are different measurement domains. A remote clock comparison can add information about a constant potential difference, but it introduces a nonlocal reference resource.

### 5.4 The demo

Let a user reshape $\Omega(r)$ while holding $L$ fixed. Show:

1. The actual internal flow.
2. Its current-column rendering.
3. The exterior measured tensors.
4. A family of other flows fitting those same tensors.

The first two views change dramatically; the third does not. A sensor placed inside the body or an active response experiment can then be added to test which ambiguity it removes.

This is an important general lesson: a new channel can remove one ambiguity and still leave an infinite-dimensional nullspace.

## 6. One propagation operator from static gravity to radiation

**Status:** established propagation framework, with a proposed unified camera implementation and checked static normalization.

The most important missing physical connection I found is the literature on **evanescent gravitational waves**. Golat, Lim, and Rodríguez-Fortuño explicitly develop tensor angular spectra and near fields around subwavelength quadrupolar sources. They also show transverse spin and correlated apparent vector/scalar test-mass motions within ordinary linearized gravity. This is directly relevant to the revised Figure 17. [GLR20][GLR20]

The opportunity is to incorporate that framework into a common measurement and reconstruction engine.

### 6.1 Static attenuation and radiative propagation in one expression

Take transverse spatial Fourier coordinates $\mathbf q=(q_x,q_y)$ and temporal dependence $e^{-i\omega t}$. Let

$$
k_0=\frac{\omega}{c},
\qquad
k_z=\sqrt{k_0^2-q^2},
\qquad
\operatorname{Im}k_z\ge0.
$$

For $\omega>0$, choose the outgoing branch. In a source-free planar layer, the linearized curvature components obey the homogeneous wave equation, and upward propagation is

$$
\boxed{
P(q,\omega;z)=e^{ik_z z}.
}
$$

Explicitly,

$$
P(q,\omega;z)=
\begin{cases}
\exp\!\left(iz\sqrt{k_0^2-q^2}\right),&q<k_0,\\[2mm]
\exp\!\left(-z\sqrt{q^2-k_0^2}\right),&q>k_0.
\end{cases}
$$

The first case propagates. The second decays exponentially and is evanescent. The static limit gives

$$
P(q,0;z)=e^{-qz},
$$

exactly the source of the paper's logarithmic near-field resolution law.

This is a much stronger organizing picture than treating the three regimes as separate rendering recipes. It tells the reader what changes continuously as frequency, distance, and source scale change.

### 6.2 A common recoverability estimate

Suppose a specified mode has amplitude signal-to-noise ratio $\mathcal R_{\mathrm{mode}}$ before attenuation, with a fixed detection threshold. Ignoring algebraic prefactors for the moment, an evanescent mode remains measurable only if

$$
z\sqrt{q^2-k_0^2}
\lesssim\ln\mathcal R_{\mathrm{mode}}.
$$

Thus the approximate exponential cutoff is

$$
\boxed{
q_{\max}
\sim
\sqrt{
k_0^2+
\left(\frac{\ln\mathcal R_{\mathrm{mode}}}{z}\right)^2
}.
}
$$

This is a useful scaling relation, not a new universal resolution formula. The tensor response, source spectrum, finite aperture, sampling, nuisance parameters, and noise covariance determine the actual singular values. Grazing modes also require care. Its value is that it displays the static and wave limits together.

### 6.3 Why a sixth of a wavelength is a crossover, not a prohibition

The comparison used in Section XI(a) gives, schematically,

$$
\frac{|E_{\mathrm{near}}|}{|E_{\mathrm{rad}}|}
\sim
\left(\frac{c}{\omega r}\right)^4.
$$

The terms become comparable around $r=c/\omega=\lambda/(2\pi)$. Beyond that distance the near-field contribution becomes small, but it does not vanish. The evanescent propagator likewise remains nonzero at every finite distance.

Therefore, the abstract's absolute statement that two bodies can be seen as two only within a sixth of a wavelength is stronger than the calculation establishes. A more defensible statement is:

> Near-field structure dominates within roughly a reduced wavelength. Beyond it, recovery of subwavelength structure becomes increasingly ill-conditioned and depends on aperture, noise, and the source model.

A known binary can also have its separation inferred from a waveform without producing a directly resolved image. The paper already makes the analogous distinction for static point masses; it should preserve it here.

There is a second issue. Equation (32) is exact as a specified *truncated linearized multipole solution*. All sources sharing its retained $M$, $\mathbf J$, and $I_{ij}(t)$ produce the same model field. The model cannot establish unique body morphology that it never encoded. Near the individual bodies, omitted multipoles and nonlinear gravity also matter.

### 6.4 A source-conserving implementation

In harmonic gauge, with $x^0=ct$,

$$
\Box\bar h_{\mu\nu}
=-\frac{16\pi G}{c^4}T_{\mu\nu},
\qquad
\partial^\mu\bar h_{\mu\nu}=0,
\qquad
\partial^\mu T_{\mu\nu}=0.
$$

For a conserved sheet source

$$
T_{\mu\nu}(\mathbf q,z,\omega)
=S_{\mu\nu}(\mathbf q,\omega)\delta(z),
$$

the outgoing solution, away from the grazing singularity, is

$$
\bar h_{\mu\nu}(\mathbf q,z,\omega)
=
\frac{8\pi iG}{c^4k_z}
e^{ik_z|z|}
S_{\mu\nu}(\mathbf q,\omega).
$$

The derivative jump across $z=0$ verifies the normalization. A general three-dimensional source follows by integrating the Green function over its depth.

The sheet must satisfy conservation distributionally. A time-dependent surface density with no accompanying currents or stresses is not an admissible source. Likewise, arbitrary accelerated point particles do not form a conserved stress-energy tensor unless the agents carrying their forces are included.

Restore

$$
h_{\mu\nu}
=\bar h_{\mu\nu}
-\frac12\eta_{\mu\nu}\bar h.
$$

For a Fourier mode with $\mathbf k=(q_x,q_y,k_z)$, the draft's curvature convention then gives

$$
E_{ij}
=\frac{c^2}{2}
\left[
k_i k_j h_{00}
+k_0(k_i h_{0j}+k_jh_{0i})
+k_0^2h_{ij}
\right],
$$

$$
B_{ij}
=\frac{c^2}{2}\epsilon_{ipq}k_p
\left[k_jh_{q0}+k_0h_{qj}\right].
$$

These are curvature outputs, so a gauge change of the linearized metric cannot alter them.

For a static nonrelativistic sheet, $S_{00}=c^2\sigma$ and the other stresses are negligible:

$$
\bar h_{00}
=\frac{8\pi G\sigma}{c^2q}e^{-qz},
\qquad
h_{00}
=\frac{4\pi G\sigma}{c^2q}e^{-qz},
$$

$$
\Phi=-\frac{2\pi G\sigma}{q}e^{-qz},
\qquad
\boxed{-E_{zz}=2\pi Gq\sigma e^{-qz}.}
$$

The last expression recovers the revised paper's Eq. (10), including its sign and coefficient. The strictly uniform $q=0$ sheet needs separate treatment; its constant gravitational acceleration has no exterior tidal gradient.

### 6.5 The demo and the less obvious physical connection

**Main demo.** Use a conserved source and show its real-space tensor field, its angular spectrum, simulated receiver data, and reconstruction. Vary distance, frequency, aperture, and noise without changing the physical solver. Highlight the propagating disk $q<k_0$ and the evanescent region outside it.

**More adventurous demo.** Reproduce the transverse motion of test particles in an evanescent tensor field. Some of that motion looks longitudinal or vector-like when described relative to the real propagation direction, even though the theory still has the ordinary two gravitational degrees of freedom. This is an excellent way to teach why a local polarization pattern alone can be misleading near a source. Credit [GLR20][GLR20] explicitly; the contribution would be the camera interpretation and controlled comparison.

## 7. A defensible quantum limit on a specified imaging task

**Status:** a conditional discrimination bound derived here. It repairs a significant overstatement in Section IV(g), rather than establishing a universal quantum-gravitational limit.

The current argument moves from an apparatus mass estimate to an interaction energy, then to a field SNR and a prohibition on drawing a face. The transition between these quantities needs a defined task and detector model.

Quantum speed limits, local Fisher information, and prior-averaged estimation errors answer different questions. The distinction is well established in quantum metrology. [H12][H12] [T12][T12] A bound on mean energy alone is also different from a hard bound on the generator in every allowed state.

There is a constructive route to the result the paper is trying to express.

### 7.1 Two hypotheses and a fixed detector resource

Let two static source hypotheses produce Newtonian potentials $\Phi_0$ and $\Phi_1$. Restrict a nonrelativistic detector to a region $V$, with coupling

$$
H_s(t)
=H_{\mathrm{common}}(t)
+\int_V
\widehat\mu(\mathbf x,t)\Phi_s(\mathbf x)\,d^3x,
\qquad s\in\{0,1\}.
$$

Assume a positive mass-density operator and fixed total coupled mass:

$$
\widehat\mu\ge0,
\qquad
\int_V\widehat\mu\,d^3x=M_d\mathbb I.
$$

The initial state, controls, ancillas, and final measurement are identical resources under both hypotheses. The controls may be elaborate; the mass must remain within the specified region and coupling class.

Define

$$
\delta\Phi=\Phi_1-\Phi_0,
\qquad
\operatorname{osc}_V\delta\Phi
=\sup_V\delta\Phi-\inf_V\delta\Phi.
$$

The spectrum of

$$
\delta H=\int_V\widehat\mu\,\delta\Phi\,d^3x
$$

lies in an interval of width at most $M_d\operatorname{osc}_V\delta\Phi$. Removing a common phase gives

$$
\min_a\|\delta H-a\mathbb I\|
\le
\frac{M_d}{2}\operatorname{osc}_V\delta\Phi.
$$

Duhamel's formula bounds the difference of the two unitary evolutions by the time integral of this Hamiltonian difference. It consequently bounds the trace distance of their output states:

$$
\boxed{
D_{\mathrm{tr}}(\rho_0,\rho_1)
\le
\min\left\{
1,\,
\frac{\tau M_d}{2\hbar}
\operatorname{osc}_V\delta\Phi
\right\}.
}
$$

Ancillas do not change the operator-norm bound. The equal-prior optimum discrimination error obeys

$$
p_{\mathrm{err}}
=\frac{1-D_{\mathrm{tr}}}{2},
$$

so the previous expression provides a lower bound on error for every receiver within this model.

This is a necessary resource condition. It does not claim an attainable measurement protocol.

### 7.2 A finite, positive source family

Put matter on a known sphere of radius $a$:

$$
\sigma_\pm(\mathbf n)
=\sigma_0\pm\epsilon Y_{\ell m}(\mathbf n),
\qquad
\ell\ge1,
\qquad
0<\epsilon\le\sigma_0.
$$

Here $Y_{\ell m}$ is a real harmonic rescaled to have supremum norm at most one. Both densities are nonnegative, and both have total mass

$$
M_s=4\pi a^2\sigma_0.
$$

Keep the entire detector at radii $r\ge R>a$. The potential difference at the closest allowed radius is

$$
\delta\Phi(R,\mathbf n)
=-
\frac{8\pi G a^2\epsilon}{R(2\ell+1)}
\left(\frac aR\right)^\ell
Y_{\ell m}(\mathbf n).
$$

Its maximum amplitude decreases exponentially with angular degree. The trace-distance bound becomes

$$
\boxed{
D_{\mathrm{tr}}
\le
\min\left\{
1,\,
\frac{K(a/R)^\ell}{2\ell+1}
\right\},
\qquad
K=\frac{8\pi G M_d\tau a^2\epsilon}{\hbar R}.
}
$$

An error at most $p<1/2$ therefore requires

$$
(2\ell+1)e^{\alpha\ell}
\le\frac{K}{1-2p},
\qquad
\alpha=\ln(R/a)>0.
$$

Equivalently,

$$
\boxed{
\ell\le
\frac1\alpha
W_0\!\left(
\frac{\alpha K e^{\alpha/2}}{2(1-2p)}
\right)-\frac12,
}
$$

where $W_0$ is the principal Lambert function.

This is a precise logarithmic ceiling on the angular degree distinguishable in a specified binary test.

### 7.3 Where the paper's cancellation of gravity can appear

Add an explicit apparatus compactness assumption,

$$
M_d\le\frac{D_{\mathrm{app}}c^2}{2G},
\qquad
D_{\mathrm{app}}\le R,
$$

where $D_{\mathrm{app}}$ is a specified containing-radius scale. Then

$$
K
\le
\frac{\epsilon}{\sigma_0}
\frac{D_{\mathrm{app}}}{R}
\frac{M_s c^2\tau}{\hbar}.
$$

The cancellation of $G$ is now a consequence of stated assumptions. The compactness inequality is an added resource assumption, not a general theorem about every apparatus geometry or quantum state. The nonrelativistic encoding also presupposes a regime in which detector backreaction and stress couplings do not invalidate the model; inserting the collapse scale only makes a loose upper envelope.

This does not prove that every possible camera fails to recognize a face. A restricted catalogue of candidate faces is a different task from recovering arbitrary fine density structure. Nor does it fix a universal image FWHM.

**Recommended replacement for IV(g):** state the informal resource argument briefly, then offer a rigorous conditional theorem of this kind in an appendix. It would make the paper more credible and more useful than its present absolute conclusion.

## 8. How many features, and how much information, does the image contain?

**Status:** standard Gaussian inverse-problem formulas, with gravitational asymptotics derived and checked here.

The logarithmic blur law can be extended into a quantitative account of what the camera learns.

### 8.1 A spherical model with exact transfer coefficients

For a surface density on a sphere of radius $a$, measured through $E_{rr}$ on a sphere of radius $R>a$, the harmonic response is

$$
t_\ell
=-
\frac{4\pi G a^2}{R^3}
\frac{(\ell+1)(\ell+2)}{2\ell+1}
\left(\frac aR\right)^\ell.
$$

This follows by differentiating the exterior potential twice in radius. Let each independent real source harmonic have prior variance $P_\ell$, and let the corresponding measured harmonic have independent noise variance $\nu^2$. Define

$$
s_\ell^2=\frac{t_\ell^2P_\ell}{\nu^2}.
$$

The posterior variance is

$$
P_{\ell,\mathrm{post}}
=\frac{P_\ell}{1+s_\ell^2}.
$$

For this Gaussian model, expected information gain is

$$
\mathcal I
=\frac12
\sum_{\ell=0}^{\infty}
(2\ell+1)\ln(1+s_\ell^2).
$$

This is the usual log-determinant information criterion. [A23][A23] A complementary effective parameter count is

$$
N_{\mathrm{eff}}
=
\sum_{\ell=0}^{\infty}
(2\ell+1)
\frac{s_\ell^2}{1+s_\ell^2}.
$$

Modes with large SNR contribute approximately one measured degree of freedom each. Exact null modes contribute zero.

### 8.2 Two useful asymptotic laws

Suppose

$$
s_\ell=S\,p(\ell)e^{-\alpha\ell},
\qquad
\alpha=\ln(R/a),
$$

where $p(\ell)$ is a polynomial or has only algebraic variation. The transition degree is

$$
\ell_*\sim\frac{\ln S}{\alpha}.
$$

Counting the harmonic multiplicities gives

$$
\boxed{
N_{\mathrm{eff}}
\sim\frac{(\ln S)^2}{\alpha^2}.
}
$$

Inside the high-SNR region,

$$
\frac12\ln(1+s_\ell^2)
\sim\ln S-\alpha\ell
$$

to leading order. Therefore

$$
\mathcal I
\sim
\int_0^{(\ln S)/\alpha}
2\ell(\ln S-\alpha\ell)\,d\ell,
$$

which yields

$$
\boxed{
\mathcal I
\sim\frac{(\ln S)^3}{3\alpha^2}
\quad\text{nats}.
}
$$

Divide by $\ln2$ for bits.

This distinction is informative: the number of effectively measured spatial features grows as a squared logarithm, while their total expected information grows as a cubed logarithm because already detectable features are also measured more precisely.

These are prior-dependent Gaussian information measures. They are not channel capacity optimized over every possible source prior, and they are not a universal physical information bound. A Gaussian density-contrast prior also does not enforce strict positivity automatically. The known-surface model removes the general volume-source nullspace by assumption.

Numerical sums using the exact transfer and a source standard deviation proportional to $(\ell+1)^{-2}$ approach the stated coefficients. Convergence is slow because algebraic prefactors generate logarithmic corrections; the leading laws should not replace exact sums at ordinary SNR.

### 8.3 An engine that chooses where to look next

For arbitrary geometry, let $A$ be the forward operator, $N$ the noise covariance, and $C_{\mathrm{prior}}$ the source covariance. Form

$$
\widetilde A=N^{-1/2}A C_{\mathrm{prior}}^{1/2}.
$$

Its singular values $s_j$ give

$$
\mathcal I=\frac12\sum_j\ln(1+s_j^2),
\qquad
N_{\mathrm{eff}}=\sum_j\frac{s_j^2}{1+s_j^2}.
$$

The corresponding source singular vectors show *which* patterns are being learned.

A new scalar reading with response row $\mathbf a$ and independent noise variance $\nu^2$ adds

$$
\boxed{
\Delta\mathcal I
=\frac12\ln\left(
1+\frac{\mathbf a C_{\mathrm{post}}\mathbf a^{\mathsf T}}{\nu^2}
\right).
}
$$

The engine could evaluate this across candidate positions or channels and recommend the next observation. It would choose a viewpoint that reduces uncertainty rather than merely a viewpoint with a brighter signal.

**Demo specification.** Start with two mass distributions that fit the available data. Let the engine select the next sensor location, spectral band, or tensor component. Show the posterior contraction and the measurement that caused it. Retain exact null modes visibly when no allowed observation can remove them.

## 9. Thermal balance changes the meaning of a gravitational image

**Status:** established radiative transfer, applied to connect two parts of the manuscript that are currently treated separately; a proposed engine consistency test.

The thermal scenes and the primordial graviton sky belong in one radiative-transfer calculation. Once an incoming radiation environment exists, a camera observes both the radiation a body adds and the radiation it removes.

### 9.1 The relevant quantity is contrast against the incident field

For an isothermal material in local thermal equilibrium, without scattering, write

$$
\frac{dI_\omega}{ds}
=-\alpha_\omega I_\omega+j_\omega
=\alpha_\omega\big[B_\omega(T)-I_\omega\big].
$$

Here $\alpha_\omega$ is the **net absorption coefficient**, including stimulated emission. Only the material needs to be in local thermal equilibrium; the incident radiation need not be. Flauger and Weinberg derive the gravitational relation between spontaneous emission and net absorption explicitly. [FW19][FW19]

For optical depth $\tau_\omega=\int\alpha_\omega\,ds$,

$$
I_{\omega,\mathrm{out}}
=I_{\omega,\mathrm{bg}}e^{-\tau_\omega}
+B_\omega(T)(1-e^{-\tau_\omega}).
$$

Subtracting the unobstructed background gives

$$
\boxed{
\Delta I_\omega
=\big[B_\omega(T)-I_{\omega,\mathrm{bg}}\big]
(1-e^{-\tau_\omega}).
}
$$

For a blackbody background at $T_b$, an ordinary body is an excess when $T>T_b$, has zero thermal contrast when $T=T_b$, and produces a deficit when $T<T_b$. The ordinary-matter deficit is extraordinarily small in the manuscript's regime, but it is not identically zero.

This also exposes a useful approximation rule. At small optical depth,

$$
\Delta I_\omega\simeq
\tau_\omega\big[B_\omega(T)-I_{\omega,\mathrm{bg}}\big].
$$

Emission and absorption are both first order in $\tau_\omega$. Keeping emission while dropping attenuation is justified when $I_{\omega,\mathrm{bg}}\ll B_\omega(T)$; optical thinness alone does not justify it.

The manuscript can retain its striking black-hole silhouettes while replacing “nothing else absorbs” with a quantitative statement about negligible ordinary-matter optical depth.

### 9.2 An equilibrium identity for the entire engine

There is a stronger formulation in collected field modes. For a stationary, frequency-preserving, passive linear channel,

$$
\mathbf a_{\mathrm{out}}
=S\mathbf a_{\mathrm{in}}+L\mathbf b,
\qquad
SS^\dagger+LL^\dagger=\mathbb I.
$$

The second equation preserves bosonic commutators. Define the normally ordered covariance

$$
\Gamma_{ij}=\langle a_j^\dagger a_i\rangle.
$$

If the incoming modes and material bath are independent,

$$
\Gamma_{\mathrm{out}}
=S\Gamma_{\mathrm{in}}S^\dagger
+L\Gamma_{\mathrm{bath}}L^\dagger.
$$

For independent thermal modes at the same occupation, $\Gamma_{\mathrm{in}}=n_T\mathbb I$ and $\Gamma_{\mathrm{bath}}=n_T\mathbb I$. It follows that

$$
\boxed{\Gamma_{\mathrm{out}}=n_T\mathbb I.}
$$

This follows directly by substitution. Loss and emission must restore the same thermal covariance. A passive lens also leaves the uniform thermal occupation invariant.

In a static gravitational field, equilibrium refers to a common conserved frequency and obeys the Tolman condition

$$
T(\mathbf x)\sqrt{-g_{00}(\mathbf x)}
=\text{constant}.
$$

Equal local temperatures at different gravitational potentials are not the correct equilibrium prescription. [Tol30][Tol30]

This identity concerns propagating radiative modes. It does not erase a body's static tidal field, its near-field fluctuations, or its action on an anisotropic incident sky. It also does not apply unchanged to a rotating amplifier or another active channel.

**Demo specification.** Put a sphere in a thermal graviton bath and vary its temperature from colder than the bath to equal to it to hotter than it. Show incident, transmitted, emitted, and net intensity on consistent scales. Include a magnified contrast panel and the physical optical depth. The equilibrium state should be an exact regression test for the renderer.

## 10. When a black hole disappears into the gravitational sky

**Status:** established Hawking and scattering physics; a new numerical connection to the manuscript's proposed $0.905\ \mathrm K$ background.

The most memorable extension of the new black-hole figure may be that a black hole need not be dark against that background.

### 10.1 Dark, invisible, or bright

For a Schwarzschild hole,

$$
T_H=\frac{\hbar c^3}{8\pi GMk_B}.
$$

Let $\Gamma_a(\omega)$ be the absorption probability of a spin-2 scattering channel $a=(\ell,m,p)$, and let

$$
n_g=\frac{1}{e^{\hbar\omega/(k_BT_g)}-1},
\qquad
n_H=\frac{1}{e^{\hbar\omega/(k_BT_H)}-1}.
$$

In an isotropic thermal graviton environment, the outgoing mean occupation is

$$
n_{a,\mathrm{out}}=(1-\Gamma_a)n_g+\Gamma_a n_H,
$$

so

$$
\boxed{\Delta n_a=\Gamma_a(n_H-n_g).}
$$

This relation is given explicitly for nonsuperradiant black-hole modes by Agullo, Brady, Delhom, and Kranas; their treatment includes gravitational waves. [ABDK24, Eq. (10)][ABDK24]

At the manuscript's assumed $T_g=0.905\ \mathrm K$, the crossing mass is

$$
\boxed{
M_*=\frac{\hbar c^3}{8\pi Gk_BT_g}
=1.3557\times10^{23}\ \mathrm{kg},
}
$$

about $1.85$ lunar masses. Its Schwarzschild radius is

$$
\boxed{
r_{s,*}=\frac{2GM_*}{c^2}
=2.0135\times10^{-4}\ \mathrm m
\simeq0.201\ \mathrm{mm}.
}
$$

| Mass | Contrast in a uniform thermal graviton bath |
|---|---|
| $M\gg M_*$ | A cold absorber; a dark silhouette when the observing wavelength also permits geometric optics |
| $M=M_*$ | Zero thermal intensity contrast at every frequency |
| $M\ll M_*$ | A Hawking excess |

“Invisible” here has a narrow and exact meaning: no graviton radiometric contrast against a uniform bath. The hole still curves spacetime, affects anisotropies, and may be detected in other channels. Equality with this graviton temperature also does not establish equilibrium with the warmer electromagnetic cosmic microwave background.

### 10.2 The disappearance occurs where geometric optics is inadequate

Define

$$
x=\frac{\hbar\omega}{k_BT_g},
\qquad
q=\frac{\omega r_s}{c}.
$$

Since $T_Hr_s=\hbar c/(4\pi k_B)$,

$$
\boxed{
q=\frac{x}{4\pi}\frac{T_g}{T_H}.
}
$$

At the crossing, $q=x/(4\pi)$. The unfiltered Planck number-radiance peak is at $x=1.593624$, giving $q=0.126817$; the energy-radiance peak is at $x=2.821439$, giving $q=0.224523$.

Thus the thermal crossing cannot be illustrated faithfully by simply making the existing geometric black disc fade. The dominant unfiltered thermal wavelengths are longer than the hole. Greybody weighting shifts the relevant peaks and must be included; sufficiently high-frequency rays can still obey geometric optics, but those frequencies lie in the sparse thermal tail.

For a Schwarzschild hole, the low-frequency spin-2 absorption cross section per incident polarization is

$$
\sigma_{\mathrm{abs}}(\omega)
\simeq
\frac{4\pi}{45}r_s^6\left(\frac{\omega}{c}\right)^4,
\qquad q\ll1.
$$

Goldberger and Rothstein give this result in units with $c=1$. [GR06, Eq. (24)][GR06]

Compared with the geometric capture cross section

$$
\sigma_{\mathrm{geo}}=\frac{27\pi}{4}r_s^2,
$$

the low-frequency ratio is

$$
\boxed{
\frac{\sigma_{\mathrm{abs}}}{\sigma_{\mathrm{geo}}}
\simeq\frac{16}{1215}q^4.
}
$$

The same black hole can be an effective geometric absorber in one band and a very weak absorber in another.

### 10.3 Build the spectrum before building the image

A manageable first calculation is the net spectral power exchanged with the bath:

$$
\frac{d\Delta P}{d\omega}
=\frac{\hbar\omega}{2\pi}
\sum_{\ell\ge2,m,p}
\Gamma_{\ell mp}(\omega)
\big[n_H(\omega)-n_g(\omega)\big].
$$

Plot this as $M$ passes through $M_*$. Check the low-frequency asymptote, the high-frequency capture limit, and the exact zero at thermal equality.

Existing public Hawking-spectrum calculations, including BlackHawk, provide a starting point for greybody factors. [AA19][AA19] They do not by themselves provide a resolved camera image: **a spatial wave image additionally needs scattering phases, propagation to the observer, and the finite-aperture measurement operator.**

**Demo specification.** A mass slider changes a hole from dark to radiometrically invisible to bright. A second control changes the observing band and reveals the transition from wave scattering to a geometric silhouette. The spectral version is a credible first deliverable; the spatial version is a larger project.

## 11. The primordial background and the spectral window that saves the toy Earth image

**Status:** derived consistency calculation using the draft's assumed thermal background and constant-loss source model. This is conditional on that background existing and on the stated material spectrum.

The paper's Earth signal and its primordial background cannot both enter a broadband camera without a noise calculation. Their number radiances differ by roughly nineteen orders of magnitude:

$$
N_g\simeq3.6\times10^{14}\ 
\mathrm{s^{-1}\,m^{-2}\,sr^{-1}},
\qquad
N_{\mathrm{Earth,nadir}}\simeq6\times10^{-5}\ 
\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}.
$$

The ratio is approximately $6\times10^{18}$. These are both quantities in the revised manuscript, rather than an external estimate. [Draft, Fig. 15 and §XI(e)][Draft]

Subtracting the known mean of the background does not subtract its fluctuations. The Earth exposure estimates therefore describe a background-free or sufficiently filtered observing channel.

### 11.1 A cold background can be removed spectrally in this model

Using ordinary frequency $\nu$, the two-helicity blackbody number radiance is

$$
N_\nu(T)
=\frac{2\nu^2}{c^2}
\frac{1}{e^{h\nu/(k_BT)}-1}.
$$

Its integral is

$$
N_{\mathrm{tot}}(T)
=\frac{4\zeta(3)}{c^2}
\left(\frac{k_BT}{h}\right)^3.
$$

For $T_g=0.905\ \mathrm K$,

$$
\frac{k_BT_g}{h}=18.8571\ \mathrm{GHz},
\qquad
N_{\mathrm{tot}}(T_g)=3.5873\times10^{14}\ 
\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}.
$$

An ideal high-pass filter at $\nu_c$ leaves the fraction

$$
F_N(x_c)
=\frac{1}{2\zeta(3)}
\int_{x_c}^{\infty}\frac{x^2}{e^x-1}\,dx,
\qquad
x_c=\frac{h\nu_c}{k_BT_g}.
$$

For large $x_c$,

$$
F_N(x_c)\simeq
\frac{e^{-x_c}(x_c^2+2x_c+2)}{2\zeta(3)}.
$$

Solving the exact integral gives:

| Remaining background number radiance | $x_c$ | Cutoff $\nu_c$ | Fraction retained from a $300\ \mathrm K$ source | Fraction retained from a $5500\ \mathrm K$ source |
|---|---:|---:|---:|---:|
| $6\times10^{-5}\ \mathrm{s^{-1}m^{-2}sr^{-1}}$ | 50.2306 | $0.9472\ \mathrm{THz}$ | 99.546% | 99.9986% |
| $6\times10^{-7}\ \mathrm{s^{-1}m^{-2}sr^{-1}}$ | 55.0143 | $1.0374\ \mathrm{THz}$ | 99.458% | 99.9983% |

For a source at $T_s$, the retained fraction in this calculation is $F_N(x_cT_g/T_s)$.

This is a useful rescue of the toy thermal images: the cold bath occupies a very different spectral range from a hot terrestrial source. The calculation also tells the engine which band to show instead of adding a uniform background and then removing its mean.

The retained fractions assume the source's absorption coefficient is constant over the relevant band, as in the draft's placeholder model. A real source has frequency-dependent stress fluctuations and loss; a real receiver has a band-dependent efficiency and finite upper cutoff. Those functions must enter the integral before interpreting this as a material or instrument prediction. Other backgrounds are also not removed by this particular calculation.

### 11.2 Counts, fluctuations, and image contrast

For a selected spatial and spectral measurement, let $s$ and $b$ be source and background count rates. In a Poisson approximation with a known background mean, detecting fractional source contrast $\epsilon$ gives

$$
Z\simeq\frac{\epsilon s\,t}{\sqrt{(s+b)t}},
$$

and therefore

$$
\boxed{
t\simeq\frac{Z^2(s+b)}{\epsilon^2s^2}.
}
$$

A separately estimated noisy reference adds its own variance. For a single thermal mode, the occupation variance is $n(1+n)$; the Poisson approximation must be justified by the occupations and collection statistics.

This is where expected pictures, single-exposure pictures, and reconstructed pictures should become distinct engine outputs.

### 11.3 Background rejection is also a quantum-information requirement

Consider two orthogonal collected modes in a zero-mean, phase-insensitive Gaussian state, with vanishing anomalous moments $\langle a_i a_j\rangle=0$ and normally ordered covariance

$$
\Gamma=
\begin{pmatrix}
b+s & sg\\
sg & b+s
\end{pmatrix},
$$

where $s$ is the known source occupation per mode, $b$ is a known uncorrelated background occupation, and $g$ is a real coherence parameter whose phase is known. Evaluate sensitivity near $g=0$.

A coherent combiner diagonalizes the two modes:

$$
n_\pm=b+s\pm sg.
$$

Photon or graviton counting of a thermal mode gives Fisher information $1/[n(1+n)]$ about its occupation. Thus the information per two-mode sample about $g$ is

$$
\boxed{
F_g^{\mathrm{joint}}
=\frac{2s^2}{(b+s)(1+b+s)}.
}
$$

Separate heterodyne measurements instead give

$$
\boxed{
F_g^{\mathrm{het}}
=\frac{2s^2}{(1+b+s)^2}.
}
$$

The background-free weak-source limits are $F_g^{\mathrm{joint}}\simeq2s$ and $F_g^{\mathrm{het}}\simeq2s^2$, consistent with the established advantage of coherent joint detection for weak thermal light. [Ts11][Ts11]

But if $s\ll b\ll1$, then even the joint receiver has

$$
F_g^{\mathrm{joint}}\simeq\frac{2s^2}{b}.
$$

The coherent receiver is still advantageous, but a strong uncorrelated background destroys the favorable dependence on source occupation. Spectral selection and receiver architecture therefore belong in the same information calculation.

These expressions assume two orthogonal modes, an uncorrelated background in that mode basis, known $s$ and $b$, and estimation of one known-phase coherence parameter. A spatially coherent foreground or unknown nuisance parameters require a larger covariance model.

**Demo specification.** Show the source expectation, the total incident field, one finite exposure, and the reconstruction. Let the user change the band and choose a count-based joint receiver or separate quadrature recording. The image should improve for reasons visible in the likelihood and count budget.

## 12. Memory as an angular record of escaped energy

**Status:** established memory formalism; checked application to the draft's examples; a further conservation and frame-dependence demonstration.

The memory section can do more than provide another sky scene. It exposes an angular information filter with a qualitatively different spectrum from static gravitational imaging.

### 12.1 The angular transfer function

Let

$$
F(\mathbf n)=\frac{dE}{d\Omega}
=\sum_{\ell,m}F_{\ell m}Y_{\ell m}(\mathbf n)
$$

be the total escaping null-energy fluence in a specified asymptotic inertial frame. Expand the memory field over observer directions using the complex strain convention $\Delta h=\Delta h_+-i\Delta h_\times$ and spin-weight $-2$ harmonics.

With the standard harmonic conventions,

$$
\boxed{
\Delta h_{\ell m}
=\frac{16\pi G}{c^4r}
\sqrt{\frac{(\ell-2)!}{(\ell+2)!}}\,
F_{\ell m},
\qquad \ell\ge2.
}
$$

The monopole and dipole have no spin-2 null-memory image. This relation follows from the established multipolar memory formula and the strain normalization used by Favata. [F09, §II][F09]

At high angular order,

$$
\sqrt{\frac{(\ell-2)!}{(\ell+2)!}}
\sim\ell^{-2}.
$$

The comparison is instructive:

| Channel | Representative high-order attenuation | Main loss of information |
|---|---|---|
| Exterior static field of a known spherical source surface | $(a/R)^\ell$ times an algebraic factor | Exponential attenuation of fine angular structure |
| Null-memory field over observer directions | $\ell^{-2}$ | Exact loss of $\ell=0,1$; algebraic attenuation above them |
| Complete local Gaussian radiation covariance | Exact cutoff at $\ell=4$ for the unpolarized brightness sky | All higher brightness multipoles absent from the local covariance |

These are different measurement geometries, not a claim that memory is a superior camera for the same source. In particular, **one observer measures two memory components, not the full angular memory field**. Recovering $F_{\ell m}$ would require observations over many directions or a strong source model. The forward harmonic transform is nevertheless useful for the engine and makes the information loss explicit.

### 12.2 The manuscript's two memory normalizations check out

For

$$
F(\mu)=\frac{E}{4\pi}\big[1+qP_2(\mu)\big],
$$

the harmonic expression gives

$$
\Delta h_+(\theta)
=\frac{qGE}{2c^4r}\sin^2\theta,
$$

agreeing with the manuscript's Eq. (35).

An additional term $q_4P_4(\mu)$ contributes

$$
\Delta h_+^{(4)}(\theta)
=\frac{q_4GE}{12c^4r}
\sin^2\theta\big(7\cos^2\theta-1\big).
$$

For the quadrupolar circular-binary energy pattern,

$$
F(\mu)
=\frac{5E}{64\pi}\big(1+6\mu^2+\mu^4\big)
=\frac{E}{4\pi}
\left[1+\frac{10}{7}P_2(\mu)+\frac1{14}P_4(\mu)\right],
$$

the two contributions combine to

$$
\boxed{
\Delta h_+(i)
=\frac{GE}{24c^4r}
\sin^2i\big(17+\cos^2i\big).
}
$$

This agrees with the manuscript's Eq. (34). I checked the quadrupole and hexadecapole responses independently by angular quadrature. There is no reason to alter these coefficients.

### 12.3 A dipolar flash: the emitting body matters

The statement that a pure dipole leaves no memory is exact for the **null-memory operator applied to that angular fluence**. The total memory of a momentum-conserving event also includes the change in the massive remnant's motion.

For a concrete example, stipulate that the **integrated fluence in the initial inertial frame** is exactly

$$
F(\mathbf n)=\frac{E}{4\pi}
\big(1+d\,\hat{\mathbf z}\cdot\mathbf n\big),
\qquad |d|\le1.
$$

The escaping momentum is

$$
\mathbf P_{\mathrm{out}}
=\frac1c\int F(\mathbf n)\mathbf n\,d\Omega
=\frac{dE}{3c}\hat{\mathbf z}.
$$

An initially resting remnant therefore acquires, in the nonrelativistic recoil limit,

$$
\mathbf v_f\simeq-\frac{dE}{3M_fc}\hat{\mathbf z}.
$$

The ordinary memory of that endpoint velocity is

$$
\Delta h_{ij}^{\mathrm{TT}}
=\frac{4G\gamma_fM_f}{c^4r}
\left[
\frac{v_{f,i}v_{f,j}}
{1-\mathbf N\cdot\mathbf v_f/c}
\right]^{\mathrm{TT}},
$$

where the initially resting contribution vanishes. This is the massive-particle memory formula. [F09, Eq. (1.4)][F09]

Consequently, to leading recoil order,

$$
\boxed{
\Delta h_+^{\mathrm{recoil}}
\simeq
\frac{2Gd^2E^2}{9M_fc^6r}\sin^2\theta.
}
$$

The null-memory term vanishes for the specified fluence, while this ordinary term survives. The result assumes the fixed-frame fluence is specified accurately through the order being calculated. If its angular pattern is known only to first order in $d$, unspecified second-order terms can change this second-order result.

### 12.4 The surprising countercase: a recoiling rocket with no gravitational radiation

There is a remarkable established example that makes the frame qualification essential. In the Kinnersley photon-rocket solution, an instantaneous emission pattern whose anisotropy is purely dipolar—a monopole plus dipole—in the accelerating rocket's own rest frame can produce a recoil whose gravitational radiation is exactly canceled by the radiation field's contribution. Damour gives an explicit account of this cancellation. [D95][D95]

That rest-frame prescription is different from prescribing an exactly monopole-plus-dipole *integrated* fluence in the initial inertial frame. Transforming emissions from successive rest frames generates the additional angular structure needed for cancellation.

This is an unusually good demonstration of why the engine should accept a conserved complete source:

| Source prescription | Null-memory contribution | Remnant contribution | Result |
|---|---|---|---|
| Exactly monopole-plus-dipole integrated fluence in the initial inertial frame | Zero | Nonzero recoil memory | Quadratic recoil signal in the slow-kick limit |
| Kinnersley-type instantaneous rest-frame monopole-plus-dipole emission | Cancels the remnant's radiative contribution | Nonzero when treated alone | No total gravitational radiation in the special solution |

**Demo specification.** Show the outgoing energy pattern, its net momentum, the remnant trajectory, and the two separately computed memory contributions. Keep the frame label visible. The two cases would teach a deeper lesson than an unbalanced one-jet picture: a plausible-looking radiative source is not complete until its emitter and momentum budget are included.

## 13. Three further directions worth developing

These are valuable extensions, but I would not delay the core observability results to complete all three.

### 13.1 Polarization can make thermal gravity more than a temperature map

The scalar loss coefficient in the present model suppresses potentially informative tensor structure. A material's stress response is a tensor; after projection into the two transverse-traceless polarization states, its dissipative response can be represented by a positive semidefinite $2\times2$ matrix $K_\omega$.

As a proposed passive transport model, let $W_\omega$ be the polarization coherency matrix with $\operatorname{tr}W_\omega=I_\omega$, and let $H_\omega$ be a Hermitian phase-response matrix. Then

$$
\boxed{
\frac{dW_\omega}{ds}
=-\frac12\{K_\omega,W_\omega\}
-i[H_\omega,W_\omega]
+\frac{B_\omega(T)}{2}K_\omega.
}
$$

Here $K_\omega$ and $H_\omega$ have units of inverse length. The source term is chosen by detailed balance: $W_\omega=B_\omega(T)\mathbb I/2$ is an equilibrium solution.

For a deliberately simple anisotropic toy response,

$$
K_\omega
=\alpha_0
\begin{pmatrix}
1+a&0\\
0&1-a
\end{pmatrix},
\qquad |a|\le1,
$$

an optically thin body viewed against negligible incident radiation has

$$
\frac{Q}{I}=a,\qquad U=V=0
$$

in its principal polarization basis. Rotating the polarization basis by $\psi$ gives the characteristic spin-4 transformation of $Q+iU$, with the sign set by the basis convention.

Two objects could therefore share the same scalar brightness and temperature yet differ in polarization because their dissipative responses have different preferred axes.

This equation is a phenomenological model to be matched to a microscopic stress correlation function. It is not a prediction that a named real material has order-unity gravitational polarization. The material calculation would determine $K_\omega$, its frequency dependence, its orientation dependence, and whether the effect survives averaging.

**Useful next calculation.** Choose one explicitly anisotropic elastic or dissipative model, compute its stress-noise tensor, project onto TT modes, and verify both positivity and the thermal equilibrium identity. That would turn the paper's gravitational “colour” into a more discriminating material signature.

### 13.2 Predict the part of the graviton sky that the microwave sky does not determine

The statement that the large-scale graviton sky repeats the microwave sky should become a cross-spectrum calculation. Shared primordial perturbations can produce strong correlations, but different transfer functions and source surfaces need not produce identical maps.

For linear Gaussian perturbations sourced by a common primordial curvature field,

$$
C_\ell^{ab}
=4\pi\int d\ln k\,
\mathcal P_\zeta(k)
\Delta_\ell^a(k)\Delta_\ell^{b*}(k),
\qquad a,b\in\{g,\gamma\}.
$$

Define

$$
r_\ell=
\frac{C_\ell^{g\gamma}}
{\sqrt{C_\ell^{gg}C_\ell^{\gamma\gamma}}}.
$$

For a noiseless photon-temperature map and real cross-spectrum, a conditional Gaussian realization is

$$
\boxed{
a_{\ell m}^{g}
=\frac{C_\ell^{g\gamma}}{C_\ell^{\gamma\gamma}}
a_{\ell m}^{\gamma}
+\sqrt{
C_\ell^{gg}
-\frac{(C_\ell^{g\gamma})^2}{C_\ell^{\gamma\gamma}}
}\,\xi_{\ell m},
}
$$

where $\xi_{\ell m}$ are unit-variance Gaussian coefficients satisfying the reality condition for a real sky. Noise, masks, and additional cosmological fields require the corresponding conditional covariance.

Cross-correlating stochastic gravitational-wave backgrounds with the CMB and making constrained sky realizations is established work, including Ricciardone and collaborators. [R21][R21] GW_CLASS provides a primary numerical framework for cosmological gravitational-background anisotropies. [S23][S23]

The useful new application would be the **thermal** background assumed here, with its actual spectral response and thermal-history initial conditions. Results for a different primordial gravitational-wave spectrum cannot simply be imported as its transfer function.

**Demo specification.** Show a common primordial realization, the photon sky, the predicted graviton sky, and the graviton residual not determined by the photon sky. Plot $r_\ell$. This makes “same large spots, different small structure” a falsifiable quantitative statement.

The existence and temperature of a thermal graviton bath should remain explicitly conditional on the cosmological history. Also, lensing preserves the uniform monopole but can remap its anisotropies; the manuscript's folded kinematic dipole is already an example.

### 13.3 Let the smooth Galactic image break into individual binaries

Figure 19 assumes that the relevant binary population traces stellar mass, making the unobscured optical and gravitational maps identical by construction. The interesting next step is to allow the map to depend on frequency, observation time, and population statistics.

For detached circular binaries whose evolution is driven by gravitational radiation,

$$
\dot f
=\frac{96}{5}\pi^{8/3}
\left(\frac{G\mathcal M}{c^3}\right)^{5/3}
f^{11/3},
$$

where $f$ is the gravitational-wave frequency and $\mathcal M$ is the chirp mass. A steady flow through frequency at fixed chirp mass gives

$$
\frac{dN}{df}\propto\frac1{\dot f}\propto f^{-11/3}.
$$

In a simple slowly chirping Fourier-bin model, the expected number of sources in one angular and frequency cell is

$$
\boxed{
N_{\mathrm{cell}}
\simeq
\frac{dN}{d\Omega\,df}
\frac{\Delta\Omega}{T_{\mathrm{obs}}}.
}
$$

For a fixed angular beam, this scales as $T_{\mathrm{obs}}^{-1}f^{-11/3}$. If an aperture of diameter $D$ sets $\Delta\Omega\propto[c/(fD)]^2$, the toy scaling becomes

$$
N_{\mathrm{cell}}\propto
T_{\mathrm{obs}}^{-1}D^{-2}f^{-17/3}.
$$

This is an occupancy estimate, not a detection threshold or a complete Galactic population model. It assumes the relevant population is approximately steady and detached, and the simple frequency-bin argument requires negligible drift across a bin or an explicit treatment of chirping tracks. Real populations have distributions of chirp mass, age, position, interaction history, and orientation.

The resolution of a Galactic foreground into individual sources with longer observations has substantial prior literature; Seto and Nissanke and collaborators are directly relevant. [Set02][Set02] [N12][N12]

**Demo specification.** Start with the smooth expected Galaxy, then increase observation time or observing frequency. The same sky becomes a granular source population with source confusion, individual spectra, and polarization. Display both the ensemble expectation and one realization. This connects naturally to the Gaussian-versus-burst distinction in Section 3: the source statistics themselves carry information.

## 14. The engine as a community instrument

The manuscript already describes independent checks of its thermal rendering. The larger opportunity is to make the engine a reproducible link from a specified source to measured data and then to an inference.

That would serve researchers interested in gravity gradients, wave arrays, inverse problems, thermal stress noise, or quantum measurement, even when they have no interest in the visual thought experiment itself.

### 14.1 Separate the physical objects in the calculation

| Layer | What it specifies | What another researcher should be able to replace |
|---|---|---|
| Source | A conserved stress-energy distribution, or a stochastic stress correlation model | Density, currents, supporting stresses, thermal response, source statistics |
| Propagation | The field connecting source and receiver | Static, retarded linearized, angular-spectrum, or a specified curved-spacetime solver |
| Observer | Worldline, local tetrad, and aperture geometry | Position, motion, orientation, baselines, sampling |
| Measurement | The coupling from fields into recorded observables | Tensor components, mechanical response, coherent mode collection, counting, quadratures |
| Noise | A distribution for actual data | Instrumental noise, foregrounds, occupation noise, nuisance parameters |
| Inference | A likelihood and explicit source assumptions | Parametric fitting, regularized inversion, Bayesian reconstruction |
| Presentation | Truth, data, uncertainty, and selected summaries | Images, spectra, covariance maps, information modes |

The important boundary is between knowing the scene to calculate its field and knowing the scene during reconstruction. The reconstruction should receive simulated measurements and declared priors; it should not silently reuse the source's true depth, segmentation, or material labels.

### 14.2 Use compatible data products

The engine could expose four principal products:

1. Deterministic $E_{ij}(t,\mathbf x)$ and $B_{ij}(t,\mathbf x)$ in a stated observer frame.
2. Complex cross-spectra $C_{AB}(\mathbf x_p,\mathbf x_q,\omega)$ for stochastic fields.
3. Collected quantum-mode states or an explicitly justified count/quadrature likelihood.
4. Reconstructed source parameters, uncertainties, and unresolved directions in source space.

The products should retain units and frequency definitions. Squared curvature is not itself radiative energy flux. For a far-zone monochromatic wave, $E\sim\omega^2h/2$, whereas energy flux scales as $\omega^2|h|^2$, so the conversion from curvature power includes a factor proportional to $\omega^{-2}$. A broadband display must perform this conversion frequency by frequency.

Nor is a measured local $E=B$ norm identity sufficient to prove a field is freely propagating radiation: the manuscript's own light-beam example and the observer-dependence discussion are useful reminders.

### 14.3 Replace a single regime label with the relevant parameters

A scene can carry a short physical description involving

$$
kL,\quad kr,\quad kD,\quad
\frac{GM}{Lc^2},\quad
n_\omega,\quad
\omega\tau_{\mathrm{mat}},
$$

together with source duty cycle and the measurement SNR. Here $L$ is source size, $r$ the source distance, $D$ the aperture, $n_\omega$ the collected mode occupation, and $\tau_{\mathrm{mat}}$ a material relaxation time.

These distinguish source coherence, near-field propagation, aperture resolution, strong gravity, quantum measurement regime, and dynamic material response. A single label such as “wave zone” cannot answer all six questions.

### 14.4 Release a small set of exact benchmarks

The engine would become substantially more useful if every release included a few scenes whose answers are known independently:

| Benchmark | Required result |
|---|---|
| A compact density perturbation proportional to $\nabla^2\chi$ | Identical exterior fields when the potential perturbation vanishes outside its support |
| Positive spherical shells surrounding an empty cavity | Zero local Newtonian tidal field throughout the cavity despite different shell masses |
| The counterrotating spherical flow in Section 5 | Zero exterior leading current field at zero total angular momentum |
| Twelve icosahedral Gaussian sources versus a uniform sky | Identical complete local covariance, with the predicted baseline-dependent differences |
| A moving point mass | Recovery of distance and mass from $E$, $B$, and $\dot E$ in the valid regime |
| A conserved harmonic source sheet | Static exponential limit and propagating-wave limit of the same solver |
| Gaussian radiation versus separated bursts | Equal second moments need not imply equal higher statistics |
| A passive scene in thermal equilibrium | Unchanged thermal radiative covariance |
| A Schwarzschild scattering channel | Zero thermal contrast at $T_H=T_g$ and the correct low-frequency absorption law |
| The memory energy patterns | The verified quadrupole and binary coefficients; complete momentum accounting for asymmetric emission |
| A change of observer | Correct mixing of $E$ and $B$ and invariant curvature contractions |

These test physics and identifiability, rather than whether two plotting routines happen to draw similar images.

### 14.5 Let users ask for an indistinguishable alternative scene

An especially useful feature would be:

> Given these data and allowed source assumptions, find the most different scene that still fits.

For a linear forward map, exact null vectors supply some answers analytically. With positivity or geometric constraints, the engine can search for two admissible sources whose predicted data differ by less than the noise. It should distinguish a mathematically certified null pair from a numerical search that has merely failed to find a difference.

The user could then add a baseline, change band, record $B$, or wait for motion and ask which ambiguity disappears.

This turns the visual engine into an experimental-design tool. It also makes priors visible: if selecting “one point mass” makes an ambiguity disappear, the display can show that the information came partly from the source model.

### 14.6 Evaluate inference on predictions and uncertainty

For a reconstruction, report its predictive error at withheld receivers, its residual against the assumed noise, and whether its credible intervals cover the known synthetic truth across independent realizations. Also show the forward operator's weak and null modes.

A visually plausible density picture can be wrong in precisely the directions gravity does not constrain. A less detailed reconstruction that correctly exposes those directions may be the more scientifically useful output.

## 15. Claims to tighten before the next public version

These edits would make the strongest claims more defensible without weakening the central thought experiment.

| Location in the revised draft | Point to tighten | Suggested replacement or qualification |
|---|---|---|
| Abstract and introduction | Every body is an unresolved point in its bulk-motion waves | State the compact, slowly moving, coherent-source regime; the manuscript's own extended-source discussion supplies exceptions |
| §IV(g), pp. 5–6 | A universal apparatus SNR ceiling and impossibility of any detailed face image | Replace with an operational discrimination task, explicit coupling and resource assumptions, and the conditional bound in Section 7 |
| §VII(c), pp. 11–12 | Independence used to support a universal local information limit | The 25-coefficient result concerns unpolarized brightness encoded in second-order local data; extend to all data only under a Gaussian assumption |
| §VIII(c), p. 13 | One instantaneous electric tensor gives a unique source direction | It gives an axis with a sign ambiguity for an isolated point mass; spatial gradients or joint temporal and magnetic measurements can select the branch under a specified source model |
| §VIII(c), p. 13 | A shell has $5/3$ the magnetic signal of a solid sphere at the same “spin” | Specify equal mass, radius, and **angular velocity**; at equal angular momentum the leading exterior current dipole is the same |
| §VIII and Table IV | The magnetic image reveals internal motion without an important ambiguity | Give an exterior current nullspace, with the counterrotating sphere as a concrete example |
| Table IV, p. 15 | No mass can remain hidden from the camera | Qualify by measurement geometry and source assumptions; a spherical shell surrounding a cavity has no local Newtonian tidal signal inside |
| §XI(a) and Fig. 17 | A hard resolution boundary at $\lambda/(2\pi)$ | This is a near/radiation crossover scale; resolvability also depends on SNR, aperture, source prior, and which terms survive |
| §XI(a) and Eq. (32) | “Exact” field interpreted as an exact arbitrary-source image | Specify exactness within the displayed linearized, multipole-truncated source model |
| §§VI and IX; Table III | A low-frequency viscosity estimate treated as a general upper bound on thermal-frequency emission | A Maxwell model has that monotonic suppression; an arbitrary material response can have resonances and needs its own stress spectrum |
| §§VII and XI(e) | Only black holes can produce a shadow | State the negligible ordinary-matter optical depth in the intended band; even a black hole requires the appropriate thermal and wave-optical treatment |
| §IX and §XI(e) together | Thermal count budgets read as applying with the primordial background included | State the background and receiver assumptions; give a filtered-band example and the associated noise |
| §XI(c) | A dipole leaves no memory of any kind | The null-memory operator annihilates a dipolar fluence; total memory also requires the emitter's recoil and a specified frame |
| §XI(e), p. 18 | The large-scale graviton and microwave skies are identical | Present a controlled approximation or calculate the cross-correlation and residual |
| §XI(e), p. 18 | Lensing cannot be seen in the primordial sky | The uniform monopole is unchanged; the dipole and higher anisotropies can be remapped |
| Novelty statement | Broad priority claims for gravitational images | Compare explicitly with existing gravity-gradient imaging and inversion, and state the distinctive contribution of this unified thought experiment |

The last point deserves a targeted literature comparison. For example, Kirkendall, Li, and Oldenburg published *Imaging Cargo Containers Using Gravity Gradiometry* in 2007, and Wu and Tian studied automated gravity-gradient tensor inversion for object detection in 2010. [KLO07][KLO07] [WT10][WT10] These titles alone do not settle the priority of the paper's specific contribution, but they make an unrestricted “first images” formulation risky. I verified the cargo-imaging paper's bibliographic record; its full text was not accessible in this review, so a detailed methodological comparison remains to be done.

The distinctive contribution can be stated positively: a unified account of what an ideal observer would measure across gravitational regimes, with explicit limitations and reproducible demonstrations.

## 16. What I would build and write first

There are enough ideas here for several papers. Adding every one to the main manuscript would make its argument harder to follow. I would pursue the following order.

### First: three small demonstrations with exact answers

1. **Twelve sources or a diffuse sky?** This gives a striking, positive-source counterexample with exact covariance equality and a calculable baseline that breaks it.
2. **One pixel measures distance.** The $E$, $B$, $\dot E$ relation turns a small relativistic effect into a missing length scale. Show both the exact recovery and the noise amplification.
3. **The invisible flywheel.** Counterrotation makes the limits of a magnetic “motion image” concrete and physically intuitive.

Together these examples establish the theme: gravity can reveal surprising things, while apparently richer data can still leave exact ambiguities.

### Second: make one reconstruction scientifically complete

Choose a single room or object scene. Generate actual sensor readings, add stated noise, reconstruct with explicit priors, and display multiple compatible sources. Use the singular modes and expected information gain to choose the next measurement.

This would advance the paper more than several additional expectation-value renderings. It completes a task the revised manuscript already identifies as unfinished.

### Third: connect the thermal and cosmological sections

Implement the thermal equilibrium identity, the selected observing band, and the associated count or quantum-mode likelihood. Show the Earth or another existing scene with and without the assumed primordial background.

The near-$1\ \mathrm{THz}$ filtering calculation provides a clean initial example under the paper's current source model.

### Fourth: add one larger, unforgettable demonstration

Choose between:

- **The hole that changes from dark to invisible to bright:** start with the greybody spectrum and later build the finite-aperture wave image.
- **The recoiling source that emits no gravitational radiation:** use the photon-rocket cancellation to test conservation and the complete source model.

The first connects thermodynamics, quantum fields, and wave optics. The second connects source conservation, reference frames, and radiation in a very compact example.

### Fifth: put the rigorous bounds and general operators in technical material

The conditional quantum bound, the derivative-order information hierarchy, and the shared static-to-wave propagator deserve careful derivations. They can support the main narrative without forcing every reader through all the machinery.

If the paper is to become a durable reference, the best route is a small set of reusable results, clearly bounded claims, and an engine other people can test their own ideas against. A memorable visual example helps people discover that resource; an exact counterexample or a reliable forward operator gives them a reason to cite and use it.

## 17. Verification and reproducibility notes

### What was checked for this review

The new manuscript was read in full and compared against the earlier research memo. Several derivations were checked independently, with numerical calculations used where a sign, coefficient, or hidden degeneracy was easy to miss.

| Check | Outcome |
|---|---|
| Full local $10\times10$ electric/magnetic covariance of the icosahedral and isotropic Gaussian skies | Agreement at approximately $2\times10^{-15}$ relative to the chosen normalization |
| Short-baseline tensor and scalar-visibility expansions | The $x^2/112$ relative tensor difference and $x^6/75600$ scalar difference were recovered |
| Local covariance with spatial derivatives | Numerical angular ranks 25, 49, and 81 for derivative orders 0, 1, and 2; consistent with the stated general upper bound |
| Moving-point ranging | A synthetic three-dimensional example recovered the true distance to about $10^{-10}$ relative precision using a numerical time derivative |
| Spherically stratified counterrotation | Independent angular/radial integration recovered the exterior angular-momentum dependence and its cancellation |
| Quantum discrimination inequality | The operator-norm argument, trace-distance step, source-potential coefficient, and Lambert-$W$ inversion were checked algebraically |
| Information-growth estimates | Exact harmonic sums approached the stated leading coefficients with the expected slow logarithmic corrections |
| Thermal and black-hole calculations | Temperatures, crossing mass and radius, absorption coefficient, Planck-tail integrals, and receiver-information formulas were checked |
| Memory | Independent angular quadrature verified the draft's Eqs. (34) and (35), the $P_4$ response, and the recoil coefficient |
| Observer dependence | The first-order electric/magnetic mixing was checked against the paper's sign convention |

Roundoff-level agreement in these synthetic calculations verifies the implementations of the displayed mathematical examples. It does not validate an experimental apparatus or establish that the manuscript's engine implements them.

### What remains to be done

The proposed demonstrations have not been implemented in the supplied engine, whose source was not available. No realistic material stress spectrum, full Schwarzschild wave image, or thermal-graviton cosmological transfer calculation was produced here. Those are research tasks, and the text labels them accordingly.

“Derived here” means worked out for this review, not certified novel. The literature search found several directly relevant connections—especially spherical designs, evanescent gravitational waves, black holes in thermal baths, and photon rockets—that should receive explicit credit. A claim of publication priority for any new theorem or protocol would need a dedicated search.

The strongest quantitative results in this document are reproducible from the equations and specified source models. Numerical digits beyond the precision of the underlying assumptions are provided for checking calculations, rather than as claims of physical accuracy.

## 18. References

### Manuscript and previous review

**Draft.** Mostafa “Neo” Mohsenvand, *Gravitational Camera: A Thought Experiment*, revised 20-page working draft dated 16 November 2026. [Reviewed manuscript][Draft]. All page, section, and equation references in this review refer to this version.

**FirstReview.** *Gravitational Camera: Research Memo*, the preceding review prepared in this conversation. [Full earlier memo][FirstReview]. It contains the previous round's derivations and bibliography; the present document concentrates on further opportunities.

### Local information, inverse problems, and propagation

**DGS77.** P. Delsarte, J. M. Goethals, and J. J. Seidel, “Spherical codes and designs,” *Geometriae Dedicata* **6**, 363–388 (1977). [DOI: 10.1007/BF03187604](https://doi.org/10.1007/BF03187604). [Author-institution record](https://research.tue.nl/en/publications/spherical-codes-and-designs/). Foundational source for spherical designs.

**R95.** B. Reznick, “Some constructions of spherical 5-designs,” *Linear Algebra and its Applications* **226–228**, 163–196 (1995). [DOI: 10.1016/0024-3795(95)00101-V](https://doi.org/10.1016/0024-3795(95)00101-V). [Author-institution record and abstract](https://experts.illinois.edu/en/publications/some-constructions-of-spherical-5-designs/). The accessible abstract explicitly states the twelve-vertex icosahedral design result; no claim about additional details of its full text is needed here.

**DF03.** S. Drasco and É. É. Flanagan, “Detection methods for non-Gaussian gravitational wave stochastic backgrounds,” *Physical Review D* **67**, 082003 (2003). [DOI: 10.1103/PhysRevD.67.082003](https://doi.org/10.1103/PhysRevD.67.082003). [arXiv:gr-qc/0210032](https://arxiv.org/abs/gr-qc/0210032). Primary treatment of intermittent backgrounds and statistics beyond Gaussian cross-correlation.

**WT10.** L. Wu and J. Tian, “Automated gravity gradient tensor inversion for underwater object detection,” *Journal of Geophysics and Engineering* **7**, 410–416 (2010). [DOI: 10.1088/1742-2132/7/4/008](https://doi.org/10.1088/1742-2132/7/4/008). [Publisher page](https://academic.oup.com/jge/article/7/4/410/5127738). Relevant prior work on parametric gravity-gradient inversion.

**KLO07.** B. Kirkendall, Y. Li, and D. W. Oldenburg, “Imaging Cargo Containers Using Gravity Gradiometry,” *IEEE Transactions on Geoscience and Remote Sensing* **45**(6), 1786–1797 (2007). [DOI: 10.1109/TGRS.2007.895427](https://doi.org/10.1109/TGRS.2007.895427). [Authors' research-group bibliography](https://gif.eos.ubc.ca/publications/journal). **Access note:** bibliographic record verified; the full paper was not accessible for a detailed methodological comparison.

**WCN21.** L. Wylleman, L. F. O. Costa, and J. Natário, “Poynting vector, super-Poynting vector, and principal observers in electromagnetism and general relativity,” *Classical and Quantum Gravity* **38**, 165009 (2021). [DOI: 10.1088/1361-6382/abfd93](https://doi.org/10.1088/1361-6382/abfd93). [arXiv:2007.15384](https://arxiv.org/abs/2007.15384). Observer-dependent electric and magnetic curvature and their invariant structure.

**Th80.** K. S. Thorne, “Multipole expansions of gravitational radiation,” *Reviews of Modern Physics* **52**, 299–339 (1980). [DOI: 10.1103/RevModPhys.52.299](https://doi.org/10.1103/RevModPhys.52.299). [Author-institution record](https://authors.library.caltech.edu/records/hkx82-ej061). Foundational mass and current multipole framework; the particular counterrotation example in this review is worked out separately.

**GLR20.** S. Golat, E. A. Lim, and F. J. Rodríguez-Fortuño, “Evanescent gravitational waves,” *Physical Review D* **101**, 084046 (2020). [DOI: 10.1103/PhysRevD.101.084046](https://doi.org/10.1103/PhysRevD.101.084046). [arXiv:1903.09690](https://arxiv.org/abs/1903.09690). Directly relevant primary work on the angular spectrum, evanescent gravitational fields, and their polarization structure.

### Quantum limits and information

**H12.** M. J. W. Hall, D. W. Berry, M. Zwierz, and H. M. Wiseman, “Universality of the Heisenberg limit for estimates of random phase shifts,” *Physical Review A* **85**, 041802(R) (2012). [DOI: 10.1103/PhysRevA.85.041802](https://doi.org/10.1103/PhysRevA.85.041802). [arXiv:1111.0788](https://arxiv.org/abs/1111.0788). Relevant distinction between operational global estimation limits and resource arguments based on local precision alone.

**T12.** M. Tsang, “Ziv–Zakai Error Bounds for Quantum Parameter Estimation,” *Physical Review Letters* **108**, 230401 (2012). [DOI: 10.1103/PhysRevLett.108.230401](https://doi.org/10.1103/PhysRevLett.108.230401). [arXiv:1111.3568](https://arxiv.org/abs/1111.3568). Cited for the connection between hypothesis discrimination and estimation bounds. **Access note:** abstract and bibliographic details were checked; the review's explicit discrimination argument is derived in Section 7.

**A23.** A. Alexanderian, “A brief note on the Bayesian D-optimality criterion,” arXiv:2212.11466, version 3 (2023). [Full paper](https://arxiv.org/pdf/2212.11466). Primary derivation of expected information gain for linear Gaussian inverse problems.

**Ts11.** M. Tsang, “Quantum Nonlocality in Weak-Thermal-Light Interferometry,” *Physical Review Letters* **107**, 270402 (2011). [DOI: 10.1103/PhysRevLett.107.270402](https://doi.org/10.1103/PhysRevLett.107.270402). [arXiv:1108.1829](https://arxiv.org/abs/1108.1829). Coherent joint detection versus local measurement in weak thermal interferometry; Section 11 gives an explicit background-dependent two-mode calculation.

### Thermal radiation and black holes

**FW19.** R. Flauger and S. Weinberg, “Absorption of Gravitational Waves from Distant Sources,” *Physical Review D* **99**, 123030 (2019). [DOI: 10.1103/PhysRevD.99.123030](https://doi.org/10.1103/PhysRevD.99.123030). [arXiv:1906.04853](https://arxiv.org/abs/1906.04853). Gravitational absorption, stimulated emission, and the relation to spontaneous emission; see especially Section II and the Appendix.

**Tol30.** R. C. Tolman, “On the Weight of Heat and Thermal Equilibrium in General Relativity,” *Physical Review* **35**, 904–924 (1930). [DOI: 10.1103/PhysRev.35.904](https://doi.org/10.1103/PhysRev.35.904). The redshifted-temperature equilibrium condition.

**ABDK24.** I. Agullo, A. J. Brady, A. Delhom, and D. Kranas, “Entanglement from rotating black holes in thermal baths,” *Physical Review D* **110**, 025021 (2024). [DOI: 10.1103/PhysRevD.110.025021](https://doi.org/10.1103/PhysRevD.110.025021). [arXiv:2307.06215](https://arxiv.org/abs/2307.06215). Equation (10) provides the nonsuperradiant thermal input/output relation used here; rotating superradiant channels require its amplifier extension.

**GR06.** W. D. Goldberger and I. Z. Rothstein, “Dissipative Effects in the Worldline Approach to Black Hole Dynamics,” *Physical Review D* **73**, 104030 (2006). [DOI: 10.1103/PhysRevD.73.104030](https://doi.org/10.1103/PhysRevD.73.104030). [arXiv:hep-th/0511133](https://arxiv.org/abs/hep-th/0511133). Equation (24) gives the low-frequency graviton absorption cross section.

**AA19.** A. Arbey and J. Auffinger, “BlackHawk: A public code for calculating the Hawking evaporation spectra of any black hole distribution,” *European Physical Journal C* **79**, 693 (2019). [DOI: 10.1140/epjc/s10052-019-7161-1](https://doi.org/10.1140/epjc/s10052-019-7161-1). [arXiv:1905.04268](https://arxiv.org/abs/1905.04268). A public numerical route to Hawking spectra; later arXiv versions describe version 2.0. Cited as a starting point for spectral calculations, not as an existing resolved-imaging solution.

### Memory, cosmological skies, and Galactic structure

**F09.** M. Favata, “Post-Newtonian corrections to the gravitational-wave memory for quasi-circular, inspiralling compact binaries,” *Physical Review D* **80**, 024002 (2009). [DOI: 10.1103/PhysRevD.80.024002](https://doi.org/10.1103/PhysRevD.80.024002). [arXiv:0812.0069](https://arxiv.org/abs/0812.0069). Ordinary massive-particle memory and multipolar null-memory normalization.

**D95.** T. Damour, “Photon rockets and gravitational radiation,” *Classical and Quantum Gravity* **12**, 725–738 (1995). [DOI: 10.1088/0264-9381/12/3/011](https://doi.org/10.1088/0264-9381/12/3/011). [arXiv:gr-qc/9412063](https://arxiv.org/abs/gr-qc/9412063). Explicit cancellation between the remnant and outgoing null-fluid gravitational radiation for the special photon-rocket emission law.

**R21.** A. Ricciardone, L. Valbusa Dall'Armi, N. Bartolo, D. Bertacca, M. Liguori, and S. Matarrese, “Cross-Correlating Astrophysical and Cosmological Gravitational Wave Backgrounds with the Cosmic Microwave Background,” *Physical Review Letters* **127**, 271301 (2021). [DOI: 10.1103/PhysRevLett.127.271301](https://doi.org/10.1103/PhysRevLett.127.271301). [arXiv:2106.02591](https://arxiv.org/abs/2106.02591). Cross-spectra and constrained gravitational-background realizations; its particular source spectra should not be equated automatically with a thermal graviton bath.

**S23.** F. Schulze, L. Valbusa Dall'Armi, J. Lesgourgues, A. Ricciardone, N. Bartolo, D. Bertacca, C. Fidler, and S. Matarrese, “GW_CLASS: Cosmological Gravitational Wave Background in the Cosmic Linear Anisotropy Solving System,” *Journal of Cosmology and Astroparticle Physics* **2023**(10), 025 (2023). [DOI: 10.1088/1475-7516/2023/10/025](https://doi.org/10.1088/1475-7516/2023/10/025). [arXiv:2305.01602](https://arxiv.org/abs/2305.01602). A numerical framework for cosmological gravitational-wave-background anisotropies.

**Set02.** N. Seto, “Long-term operation of the Laser Interferometer Space Antenna and Galactic close white dwarf binaries,” *Monthly Notices of the Royal Astronomical Society* **333**, 469–474 (2002). [DOI: 10.1046/j.1365-8711.2002.05432.x](https://doi.org/10.1046/j.1365-8711.2002.05432.x). [Publisher record](https://academic.oup.com/mnras/article/333/2/469/1019610). Relevant prior work on observation time and source confusion. **Access note:** publisher-indexed metadata and excerpts were available; the live full-text endpoint was blocked.

**N12.** S. Nissanke, M. Vallisneri, G. Nelemans, and T. A. Prince, “Gravitational-wave emission from compact Galactic binaries,” *The Astrophysical Journal* **758**, 131 (2012). [DOI: 10.1088/0004-637X/758/2/131](https://doi.org/10.1088/0004-637X/758/2/131). [arXiv:1201.4613](https://arxiv.org/abs/1201.4613). Galactic population modeling, individual sources, and confusion foregrounds; cited for that scope rather than as a source of the toy aperture scaling derived here.

[Draft]: https://chatgpt.com/library?file_id=libfile_fde3_f-7f7d99c443608191b9d5da9b92ed5604_662707bfeb6881919f55c8ed71c23d16&account_id=personal
[FirstReview]: https://chatgpt.com/library?file_id=libfile_fde3_f-bf3220b0209081918b5d6a59e3d4fda8_662707bfeb6881919f55c8ed71c23d16&account_id=personal
[DGS77]: https://doi.org/10.1007/BF03187604
[R95]: https://doi.org/10.1016/0024-3795(95)00101-V
[DF03]: https://arxiv.org/abs/gr-qc/0210032
[WT10]: https://doi.org/10.1088/1742-2132/7/4/008
[KLO07]: https://doi.org/10.1109/TGRS.2007.895427
[WCN21]: https://arxiv.org/abs/2007.15384
[Th80]: https://doi.org/10.1103/RevModPhys.52.299
[GLR20]: https://arxiv.org/abs/1903.09690
[H12]: https://arxiv.org/abs/1111.0788
[T12]: https://arxiv.org/abs/1111.3568
[A23]: https://arxiv.org/abs/2212.11466
[Ts11]: https://arxiv.org/abs/1108.1829
[FW19]: https://arxiv.org/abs/1906.04853
[Tol30]: https://doi.org/10.1103/PhysRev.35.904
[ABDK24]: https://arxiv.org/abs/2307.06215
[GR06]: https://arxiv.org/abs/hep-th/0511133
[AA19]: https://arxiv.org/abs/1905.04268
[F09]: https://arxiv.org/abs/0812.0069
[D95]: https://arxiv.org/abs/gr-qc/9412063
[R21]: https://arxiv.org/abs/2106.02591
[S23]: https://arxiv.org/abs/2305.01602
[Set02]: https://doi.org/10.1046/j.1365-8711.2002.05432.x
[N12]: https://arxiv.org/abs/1201.4613
