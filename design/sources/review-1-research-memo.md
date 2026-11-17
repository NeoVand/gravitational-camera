# Strengthening the Gravitational Camera

## Research opportunities, checked derivations, and a revision roadmap

**Prepared for:** Mostafa “Neo” Mohsenvand  
**Date:** 16 November 2026  
**Source:** *Gravitational Camera: A Thought Experiment*, working draft dated 16 November 2026, 28 pages.  
**Purpose:** A standalone scientific development memo, preserving and extending the preceding review.

> **Central recommendation:** Make observability the organizing subject: what a gravitational camera determines uniquely, what it recovers only with sufficient sensitivity or prior information, and what depends on the measurement architecture.

This memo distinguishes established results, calculations developed or checked for this review, and proposed research directions. A calculation presented here is not a claim of priority or publication novelty. Numerical values inherited from the draft remain conditional on the draft’s physical assumptions. The companion renderer and reference implementation were not available for a code audit.

Equations use standard LaTeX mathematics inside Markdown. References use portable citation keys linked to primary papers, publisher records, or author/institution repositories. Section and equation references explicitly described as belonging to “the draft” refer to the submitted paper, not this memo.

---

## Contents

1. [Executive assessment](#1-executive-assessment)
2. [Conventions and levels of idealization](#2-conventions-and-levels-of-idealization)
3. [Exactly indistinguishable interiors](#3-exactly-indistinguishable-interiors)
4. [Image resolution and parameter precision](#4-image-resolution-and-parameter-precision)
5. [Spherical cameras and statistical resolution bounds](#5-spherical-cameras-and-statistical-resolution-bounds)
6. [The information in one ideal pixel](#6-the-information-in-one-ideal-pixel)
7. [A controlled theory of thermal gravitational color](#7-a-controlled-theory-of-thermal-gravitational-color)
8. [The quantum architecture of the receiver](#8-the-quantum-architecture-of-the-receiver)
9. [From graviton rates to image quality](#9-from-graviton-rates-to-image-quality)
10. [Three ambitious extensions](#10-three-ambitious-extensions)
11. [Further calculations with high scientific payoff](#11-further-calculations-with-high-scientific-payoff)
12. [A complete solar imaging example](#12-a-complete-solar-imaging-example)
13. [Recommended revision program](#13-recommended-revision-program)
14. [Appendix A: Point-mass Fisher calculation](#appendix-a-point-mass-fisher-calculation)
15. [Appendix B: Close equal pairs and discrimination](#appendix-b-close-equal-pairs-and-discrimination)
16. [Appendix C: Thermal normalization and asymptotics](#appendix-c-thermal-normalization-and-asymptotics)
17. [Appendix D: Polarization accounting for a local pixel](#appendix-d-polarization-accounting-for-a-local-pixel)
18. [Appendix E: Claim and assumption audit](#appendix-e-claim-and-assumption-audit)
19. [References](#references)

---

## 1. Executive assessment

The three-regime organization is worth retaining:

- Near-field gravitational sensing.
- Radiation from coherent mechanical motion.
- Thermal gravitational radiation.

The curvature-based definition of a pixel, the interpretation of gravitational-wave “noise” as an everyday scene, and the Sun-at-midnight image provide a coherent setting. The largest scientific opportunity is to distinguish a picture calculated from a known scene from a picture that measurements actually determine.

That distinction produces three different kinds of limitation:

1. **Non-identifiability:** Different sources produce exactly the same data.
2. **Instability:** Different sources produce different data, but their distinguishing signatures become extremely small.
3. **Measurement inefficiency:** The field contains information that a particular receiver extracts inefficiently.

These limitations require different remedies. Greater sensitivity helps with instability. Source constraints can remove some ambiguities. Changing the receiver can change attainable information. None of these interventions should be assumed to solve all three problems at once.

### The highest-value additions

| Opportunity | Scientific contribution | Status |
|---|---|---|
| Exactly indistinguishable scenes | Establishes what remains hidden with perfect exterior sensors | Established inverse-problem mathematics; compelling application to the camera |
| Imaging versus localization | Shows how broad reconstructed images can coexist with precise source estimates | Explicit calculations checked here; related gravity-estimation literature exists |
| Spherical transfer spectrum and positive-source tests | Extends the planar model and gives an estimator-independent statistical limitation | Derived here within specified models; no novelty claim |
| Quantum receiver comparison | Connects local field readout to efficient imaging of weak thermal radiation | Established quantum-optics result; gravitational implementation remains a research task |
| Frequency-dependent emission | Gives gravitational color and material contrast a controlled physical basis | Established response framework; concrete camera predictions remain to be developed |
| Active tidal spectroscopy | Distinguishes some interiors with identical passive static fields | Established tidal-response physics; proposed camera extension |

The strongest next version would develop a few of these into complete results. Adding more scenes without specifying the inverse map or receiver would have less scientific value.

## 2. Conventions and levels of idealization

### 2.1 Symbols and units

| Symbol | Meaning |
|---|---|
| $G$, $c$, $\hbar$, $k_B$ | Newton’s constant, speed of light, reduced Planck constant, Boltzmann constant |
| $\Phi$ | Newtonian potential, with $\Phi=-GM/r$ for a point mass |
| $E_{ij}$ | Physical electric tidal tensor, in $\mathrm{s^{-2}}$ |
| $B_{ij}$ | Magnetic tidal tensor normalized in the same units as $E_{ij}$ |
| $\rho$, $\sigma$ | Volume mass density and surface mass density |
| $z$ | Source depth or separation from a planar sensor surface |
| $D$ | Aperture diameter or characteristic baseline |
| $a$, $R$ | Source-sphere radius and enclosing sensor-sphere radius |
| $k=\omega/c$ | Radiation wavenumber; in the static sheet model, $k$ denotes transverse spatial wavenumber |
| $N_0$ | Spatial white-noise strength, defined by an explicit covariance |
| $\mathcal{R}$ | Matched-field amplitude SNR, distinct from the draft’s peak-field SNR |
| $\bar{n}$ | Mean occupation per collected spatial, temporal, and polarization mode |
| $j_\omega$ | Energy emissivity per volume, solid angle, and angular frequency |
| $\Phi_{\mathrm{N}}$ | Standard normal cumulative distribution function; distinct from gravitational potential |

With the usual orthonormal curvature convention and $x^0=ct$, the physical tidal tensor is

$$
E_{ij}=c^2R_{\hat 0 i\hat 0 j}.
$$

In the Newtonian limit,

$$
E_{ij}=\partial_i\partial_j\Phi,
\qquad
\ddot{\xi}^{\,i}=-E_{ij}\xi^j.
$$

The factor of $c^2$ can be absorbed by a different time-coordinate convention, but the convention should be explicit. In vacuum, $E$ and $B$ are symmetric and trace-free, giving five independent components each. Inside matter, Ricci curvature contributes and the vacuum ten-component description is not a complete description of the Riemann tensor.

### 2.2 Specify what “ideal” permits

Three idealizations should be kept separate:

| Idealization | What is granted | What still needs analysis |
|---|---|---|
| Classical noiseless field access | Exact classical field values on a specified measurement domain | Source nonuniqueness, aperture geometry, source class |
| Classical noisy sensing | A specified noise covariance and sampling geometry | Stable recovery, parameter uncertainty, priors |
| Quantum-limited sensing | A specified quantum coupling and measurement with negligible technical noise | Mode occupation, quantum noise, receiver architecture, collection efficiency |

The near-field logarithmic law is a finite-noise statement. With arbitrarily increasing SNR, identifiable sheet structure can become arbitrarily sharp in that model. Exact three-dimensional source ambiguities can persist even at infinite SNR.

Likewise, a classical receiver granted perfectly noiseless field access cannot automatically be assigned the information limits of a quantum counting receiver. The draft’s count budget and phase-readout model should be connected explicitly.

## 3. Exactly indistinguishable interiors

### 3.1 Correct the close-range shell claim

The draft’s page 7 correctly recognizes that a hollow spherical shell and a solid ball with equal total mass have identical exterior gravity. The subsequent suggestion that a sufficiently close exterior array distinguishes them through distance dependence is incorrect within the stated Newtonian model.

Every exterior potential value, gravitational acceleration, tidal component, and spatial derivative agrees. Moving sensors closer while keeping them exterior does not create new distinguishing information.

This is a valuable conceptual result:

> **Transparency does not imply a uniquely identifiable interior.**

It does not invalidate a controlled “gold present versus gold absent” experiment. Additional mass generally changes the measured field. It does invalidate an automatic inference from detecting added mass to reconstructing a unique arbitrary interior.

### 3.2 An explicit nullspace construction

Choose a smooth function $\chi(\mathbf x)$ with compact support strictly inside the source region, and define

$$
\delta\rho(\mathbf x)
=\frac{\nabla^2\chi(\mathbf x)}{4\pi G}.
$$

The potential difference is

$$
\delta\Phi(\mathbf x)=\chi(\mathbf x),
$$

so everywhere exterior to the support,

$$
\delta\Phi=0,
\qquad
\delta E_{ij}=0.
$$

This is an established characterization of invisible density perturbations in inverse gravimetry [YMM11].

The perturbation has positive and negative parts, but the physical objects need not contain negative mass. Choose a positive baseline density $\rho_0$ and sufficiently small $\epsilon$:

$$
\rho_\pm=\rho_0\pm\epsilon\,\delta\rho\ge0.
$$

The resulting positive-density interiors differ while their exterior gravity agrees exactly. The exterior field constrains mass moments without determining an arbitrary radial density profile [Chao04].

**Scope:** These statements refer to the Newtonian source-to-field map used for the near-field analysis. They should not be presented as a complete classification of all relativistic, dynamical, or actively probed inverse problems.

### 3.3 Consequence for the tidal-column image

The draft defines

$$
S(\hat{\mathbf n})
=\int \rho(r\hat{\mathbf n})\frac{dr}{r}.
$$

This is a legitimate source-dependent quantity. The forward identity expressing $E_{ij}$ as an angular integral of $S$ does not establish that an exterior array can recover arbitrary $S$.

A useful distinction is:

- **Source rendering:** Compute $S$ from a known scene.
- **Measurement prediction:** Compute the sensor data from that scene.
- **Reconstruction:** Infer a source quantity from the data under stated assumptions.

Two scenes can have different source renderings and identical sensor data. A reconstruction that returns only one of them is necessarily selecting a representative using assumptions, explicit or implicit.

### 3.4 The decisive figure and experiment

Show two different positive-density interiors, their tidal-column renderings, and their identical exterior measurements. Then show what a chosen reconstruction method returns.

For the room scenes, implement the full sequence:

1. Construct a scene and a finite sensor geometry.
2. Generate only the measurements available to that geometry.
3. Add a specified noise process.
4. Reconstruct using declared source assumptions.
5. Report uncertainty, measurement residuals, and plausible alternatives.

Agreement between two forward renderers verifies numerical consistency. This experiment tests whether the displayed scene follows from the data.

A volume of sensors wholly outside the source remains subject to the exterior nullspace. Sampling through the source region is a different measurement problem; in the Newtonian continuum description, local information such as $\operatorname{tr}E=\nabla^2\Phi=4\pi G\rho$ becomes relevant.

## 4. Image resolution and parameter precision

### 4.1 What the logarithmic law does establish

For a source sheet separated from a planar sensor by vacuum, transverse spatial modes have exponential attenuation. With $\Phi=-GM/r$ and $E_{ij}=\partial_i\partial_j\Phi$, the signed transfer is

$$
\widehat E_{zz}(\mathbf k)
=-2\pi Gk\,e^{-kz}\widehat\sigma(\mathbf k).
$$

The draft’s positive transfer sign corresponds to a detector output defined as $-E_{zz}$; alternatively its sign should be corrected. Transfer magnitudes, SNRs, and the resolution calculations are unchanged.

The factor $e^{-kz}$ is the robust physical feature. Recovering arbitrary fine structure requires amplification of modes whose signal has become exponentially small.

A Wiener filter additionally requires a source covariance or spectral prior. Its point-spread function and half-maximum width are properties of that reconstruction model. The constants $4.43$ and $3.79$ correspond to amplitude-profile conventions; they are not universal limits on all source estimation.

### 4.2 A single point mass has much better localization precision

Assume a point mass at depth $z$, an infinite $E_{zz}$ measurement plane, and Gaussian noise

$$
\langle n(\mathbf x)n(\mathbf x')\rangle
=N_0\delta^{(2)}(\mathbf x-\mathbf x').
$$

The field at lateral distance $s$ from the projection of the mass is

$$
f(s)=GM\frac{s^2-2z^2}{(s^2+z^2)^{5/2}}.
$$

Define the matched-field SNR

$$
\mathcal{R}^2
=\frac{1}{N_0}\int_{\mathbb R^2}f^2\,d^2x
=\frac{3\pi G^2M^2}{4N_0z^4}.
$$

For unknown mass, depth, and lateral position, the local Cramér–Rao bounds are

$$
\sigma_x,\sigma_y
\ge\sqrt{\frac25}\frac z{\mathcal{R}},
\qquad
\sigma_z\ge\frac z{\mathcal{R}},
\qquad
\frac{\sigma_M}{M}\ge\frac{\sqrt5}{\mathcal{R}}.
$$

The draft’s SNR convention obeys

$$
\mathcal{R}
=\frac{\sqrt{3\pi}}4\,\mathrm{SNR}_{\mathrm{paper}}
\approx0.7675\,\mathrm{SNR}_{\mathrm{paper}}.
$$

Thus, at $z=1\,\mathrm m$ and $\mathrm{SNR}_{\mathrm{paper}}=10^3$, the lateral uncertainty bound is approximately

$$
\sigma_x\ge0.824\,\mathrm{mm}.
$$

The draft’s regularized image at this SNR has a width corresponding to approximately $24^\circ$. Both statements can be true: an image can be broad while its known source pattern has a precisely estimated center.

These are bounds for locally unbiased estimation, not a guarantee for every algorithm or prior. Efficient estimation can approach them in the stated high-SNR model. Gravity-specific one- and two-source Cramér–Rao analysis has prior literature [MN94].

### 4.3 Two equal close masses

For two equal masses with total mass $M$, common depth $z$, and separation $d$ along $x$,

$$
f_{\mathrm{pair}}
=f_M+\frac{d^2}{8}\partial_x^2f_M+O(d^4).
$$

The departure from one mass is quadratic in separation. Its distinguishing strength scales as

$$
\mathcal{R}(d/z)^2.
$$

Consequently, fixed-confidence distinguishability has a characteristic separation scaling

$$
d/z\propto\mathcal{R}^{-1/2}
$$

within this constrained model. The constant depends on the hypothesis test, nuisance parameters, and required confidence. At $d=0$, separation estimation is nonregular. Appendix B gives the marginalized Fisher result and explains why setting a local error bar equal to $d$ is not a reliable definition of resolution.

### 4.4 A useful comparison

| Source class | Estimation task | Behavior |
|---|---|---|
| Arbitrary structure on known planar support | Recover fine image structure | Stable spatial bandwidth grows logarithmically with SNR |
| One point mass | Estimate position | Local precision improves as $1/\mathrm{SNR}$ |
| Two equal nearby point masses | Distinguish or estimate separation | Fixed-confidence separation scales as $\mathrm{SNR}^{-1/2}$ under the stated model |
| Arbitrary three-dimensional density, exterior measurements | Recover the unique interior | Exact ambiguities survive at every SNR |

The distinction between image formation and parameter estimation should be part of the paper’s main argument.

### 4.5 Finite aperture must remain explicit

The infinite-plane result is not a general aperture-independent law. For a circular $E_{zz}$-only sensor disk of radius $A\ll z$ centered above a point mass,

$$
f(s)=\frac{GM}{z^3}
\left[-2+6(s/z)^2+O((s/z)^4)\right].
$$

With

$$
\mathcal{R}_A^2
\simeq\frac{4\pi G^2M^2A^2}{N_0z^6},
$$

and unknown mass, the leading local bounds are

$$
\frac{\sigma_z}{z}
\gtrsim\frac{1}{\sqrt3\,\mathcal{R}_A}
\left(\frac zA\right)^2,
\qquad
\sigma_x\gtrsim\frac{z^2}{3\mathcal{R}_A A}.
$$

The nearly constant field across a small patch makes mass and depth difficult to separate. Full tensor measurements provide additional information and change this particular limitation. The example is enough to establish that aperture geometry matters.

A general performance statement should depend on SNR, $D/z$, sensor spacing relative to $z$, the measured tensor components, the noise covariance, and the source class.

## 5. Spherical cameras and statistical resolution bounds

### 5.1 An exact known-surface model

Let sources occupy a sphere of radius $a$, with physical surface density

$$
\sigma(\Omega)=\sum_{\ell m}\sigma_{\ell m}Y_{\ell m}(\Omega),
\qquad
\int |Y_{\ell m}|^2d\Omega=1.
$$

Let sensors cover a sphere of radius $R>a$. The potential and radial tide are

$$
\Phi_{\ell m}(R)
=-\frac{4\pi G a^2}{(2\ell+1)R}
\left(\frac aR\right)^\ell\sigma_{\ell m},
$$

$$
E_{rr,\ell m}(R)
=-\frac{4\pi G a^2}{R^3}
\frac{(\ell+1)(\ell+2)}{2\ell+1}
\left(\frac aR\right)^\ell\sigma_{\ell m}.
$$

The prefactor contains $a^2$ because $\sigma$ is mass per area. Define the transfer coefficient by $E_{rr,\ell m}=t_\ell\sigma_{\ell m}$. Its magnitude behaves as

$$
|t_\ell|\sim \ell(a/R)^\ell
$$

apart from fixed dimensional factors.

For comparable modal signal amplitudes and noise levels, the leading threshold behaves as

$$
\ell_{\max}
\approx\frac{\ln\mathrm{SNR}}{\ln(R/a)},
$$

with logarithmic corrections from polynomial factors. The number of angular modes through degree $L$ is exactly

$$
\sum_{\ell=0}^{L}(2\ell+1)=(L+1)^2.
$$

Under an explicit modal detectability criterion, this suggests a stable mode count growing approximately as $(\ln\mathrm{SNR})^2$.

### 5.2 Recover the planar limit

Set $R=a+z$, with $z\ll a$, and identify $k=\ell/a$:

$$
\left(\frac aR\right)^\ell
=\exp[-\ell\ln(1+z/a)]
\approx e^{-kz}.
$$

This connects the planar result to a complete enclosing geometry without implying uniqueness for arbitrary three-dimensional sources.

For a volume density expanded as $\rho(r,\Omega)=\sum_{\ell m}\rho_{\ell m}(r)Y_{\ell m}(\Omega)$, the exterior potential depends on radial moments

$$
Q_{\ell m}=\int_0^a r^{\ell+2}\rho_{\ell m}(r)\,dr.
$$

A single angular coefficient contains one radial moment, leaving many radial profiles compatible with it. Known-surface inversion and arbitrary-volume inversion are different problems [Chao04].

### 5.3 A finite-mass positive-source discrimination bound

The logarithmic instability can be demonstrated without selecting a Wiener filter.

Consider two known-surface alternatives,

$$
\sigma_\pm(\Omega)
=\sigma_0\pm A_\ell Y_{\ell m}(\Omega),
$$

using a real normalized harmonic and

$$
0<A_\ell\le
\frac{\sigma_0}{\|Y_{\ell m}\|_\infty}.
$$

Both densities are nonnegative. For $\ell\ge1$, their total masses agree.

Suppose the measured $E_{rr}$ harmonic coefficients have independent Gaussian noise of variance $\nu^2$. Only one coefficient distinguishes the two sources. The exact minimum equal-prior classification error is

$$
P_e
=\Phi_{\mathrm{N}}
\left(-\frac{|t_\ell|A_\ell}{\nu}\right).
$$

This is a limitation on every estimator for the specified pair of hypotheses and observation model. Positivity does not remove the exponentially small angular signature.

An explicit bounded perturbation uses Legendre polynomials:

$$
\sigma_\pm(\theta)
=\sigma_0[1\pm\epsilon P_\ell(\cos\theta)],
\qquad 0<\epsilon\le1.
$$

If the baseline monopole SNR is

$$
S_0=
\frac{8\pi G a^2\sigma_0\sqrt{4\pi}}{R^3\nu},
$$

the distinguishing modal SNR is

$$
\epsilon S_0
\frac{(\ell+1)(\ell+2)}
{2(2\ell+1)^{3/2}}
\left(\frac aR\right)^\ell.
$$

Polynomial factors change threshold details. The exponential dependence is unchanged.

### 5.4 A planar bound with an exact error probability

For the explicit infinite-sheet idealization, take

$$
\sigma_\pm(x,y)=\Sigma_0[1\pm\epsilon\cos(kx)].
$$

Observe a patch of area $A_{\mathrm{obs}}$ containing integer periods in spatial Gaussian white noise of strength $N_0$. Up to the tide sign convention, the differing signals have cosine amplitudes $\pm b$, where

$$
b=2\pi G\Sigma_0\epsilon\,k e^{-kz}.
$$

The matched cosine-amplitude estimate has variance $2N_0/A_{\mathrm{obs}}$. Therefore,

$$
P_e
=\Phi_{\mathrm{N}}
\left[-b\sqrt{\frac{A_{\mathrm{obs}}}{2N_0}}\right].
$$

Define

$$
q=kz,
\qquad
S=\frac{2\pi G\Sigma_0\epsilon}{z}
\sqrt{\frac{A_{\mathrm{obs}}}{2N_0}}.
$$

To attain $P_e\le p<1/2$, one requires

$$
Sqe^{-q}\ge u_p,
\qquad
u_p=\Phi_{\mathrm{N}}^{-1}(1-p).
$$

When $S\ge e\,u_p$, the largest admissible spatial frequency is

$$
q_{\max}
=-W_{-1}(-u_p/S)
=\ln(S/u_p)+\ln\ln(S/u_p)+o(1),
$$

where $W_{-1}$ is the lower real branch of the Lambert $W$ function.

This supplies a statistically defined logarithmic bandwidth limit for a stated positive source family. The finite spherical construction avoids the infinite-mass background of the ideal sheet.

## 6. The information in one ideal pixel

### 6.1 Strengthen the local angular theorem

The draft’s $\ell\le4$ result is an important foundation. Both electric and magnetic tidal tensors transform as the $\ell=2$ irreducible representation of rotations. Their local second moments transform in

$$
2\otimes2=0\oplus1\oplus2\oplus3\oplus4.
$$

For a stationary, directionally incoherent sky at fixed frequency, local second-order data therefore have no response to sky harmonics above degree four.

For example, choose a real $Y_{5m}$ and sufficiently small $\epsilon$:

$$
I_\pm(\hat{\mathbf n})
=I_0[1\pm\epsilon Y_{5m}(\hat{\mathbf n})].
$$

These different positive brightness distributions have the same local curvature covariance. If the field is Gaussian and this equality holds across its relevant frequency spectrum, the entire local Gaussian measurement law is also identical.

The scope matters: source-specific waveform models, non-Gaussian higher correlations, detector motion, and measurements at separated positions introduce different information.

Single-detector tensor and direction recovery has a substantial history in spherical gravitational-wave antennas [MJ95], [MJ97]. Hexadecapole information in background correlations was explicitly studied by Seto and Cooray [SC04], and odd angular moments of circular polarization by Seto [Seto06]. The opportunity is a complete observability account, not an unqualified claim that quadrupolar angular bandwidth is new.

### 6.2 Baselines add a continuous angular response spectrum

A baseline $\mathbf b$ supplies the phase

$$
e^{ik\hat{\mathbf n}\cdot\mathbf b}
=4\pi\sum_{\ell m}i^\ell j_\ell(kb)
Y_{\ell m}(\hat{\mathbf n})
Y_{\ell m}^*(\hat{\mathbf b}).
$$

The spherical Bessel factors describe how angular information changes with baseline and wavelength. Calculating the singular values of the complete tensor response would connect:

- The exact local angular nullspace.
- Finite-baseline angular sensitivity.
- Noise amplification in deconvolution.
- The difference between a sky map and a source-position estimate.

The practical transition is a spectrum of well- and poorly-measured modes, not merely a single angular width.

### 6.3 A useful additional polarization count

Under a fully calibrated, fixed-frequency, directionally incoherent ideal model, the full **complex cross-spectral covariance** of all ten $E/B$ channels contains the following independent angular coefficients:

| Sky quantity | Accessible degrees | Real coefficients |
|---|---|---:|
| Intensity $I$ | $\ell=0,\ldots,4$ | 25 |
| Circular polarization $V$ | $\ell=0,\ldots,4$ | 25 |
| Linear polarization $Q\pm iU$ | Spin-weighted $\ell=4$ | 18 |
| **Total** | | **68** |

This extension is derived within the ideal response model in Appendix D; priority has not been assessed. The draft’s “twenty-five numbers” should be explicitly identified as a statement about brightness alone.

Equal-time real covariance is less informative than the full complex cross-spectrum. In particular, the circular-polarization information requires the relevant quadrature or time-lag information.

### 6.4 Separate a reconstruction kernel from a power beam

The signed kernel

$$
K(\theta)=
\frac1{25}\sum_{\ell=0}^4(2\ell+1)P_\ell(\cos\theta)
$$

has

$$
\mathrm{FWHM}=51.5658^\circ,
\qquad
K(60^\circ)=-0.1515625.
$$

These values reproduce the one-pixel behavior described in Figure 13. This is a truncated harmonic reconstruction kernel.

Equation (22) in the draft is a squared field sum, whose expected power cannot be negative. A directional tensor projection is also needed to describe the response of a single full-tensor pixel. The raw beam and the signed reconstructed image should be shown separately.

For comparison, one natural matched plane-wave projection with equally calibrated $E$ and $B$ channels has normalized unpolarized power response

$$
W(\theta)=\left(\frac{1+\cos\theta}{2}\right)^4,
$$

with FWHM $94.0322^\circ$ and no negative values. This is a receiver-specific beam, not a universal single-pixel resolution limit. Harmonic inversion can yield a narrower signed kernel while changing the noise covariance.

## 7. A controlled theory of thermal gravitational color

### 7.1 The central physical gap

The draft’s hydrodynamic relation

$$
\alpha=\frac{16\pi G\eta}{c^3}
$$

does not justify carrying a DC viscosity unchanged across the Planck spectrum of a real solid or liquid. Yet this extrapolation controls the object count rates, Earth brightness, temperature scaling, and honey-versus-water contrast.

Baym, Patil, and Pethick show how gravitational-wave damping changes outside hydrodynamics, including a high-frequency suppression proportional to $1/(\omega\tau)^2$ in a relaxation-time regime [BPP17]. The full solar-spectrum calculation likewise separates hydrodynamic fluctuations from microscopic emission processes [GCR25].

The relevant property is the dissipative transverse stress response at the radiation frequency and wavenumber, not simply ordinary low-frequency viscosity. The long-wavelength thermal-emission relation itself has established antecedents [GL15].

### 7.2 A common response framework

For an isotropic local-response example, use time dependence $e^{-i\omega t}$ and define

$$
\delta T^{\mathrm{TT}}=-K_{\mathrm{TT}}(\omega,k)h^{\mathrm{TT}},
\qquad
K=K'-iK'',
\qquad K''\ge0.
$$

In weak coupling in an otherwise flat background,

$$
k^2=\frac{\omega^2}{c^2}
-\frac{16\pi G}{c^4}K.
$$

To leading order,

$$
\alpha_\omega
=\frac{16\pi G}{c^3\omega}K'',
\qquad
\Delta n_{\mathrm{material}}
=-\frac{8\pi G}{c^2\omega^2}K'.
$$

Define $\eta'_{\mathrm{eff}}=K''/\omega$. Then

$$
j_\omega=
\frac{16\pi G}{c^3}
\eta'_{\mathrm{eff}}(\omega,k=\omega/c)B_\omega(T).
$$

A full treatment includes the tensor response, appropriate contact terms, and finite-body effects. Matter-correlation formulations are available in the literature [CP12]. Causal response relates reactive and dissipative parts through appropriately subtracted Kramers–Kronig relations.

Background-spacetime gravitational lensing is a separate effect and must not be conflated with this material refractive correction.

### 7.3 A Maxwell relaxation calculation

Take the explicitly stated toy model

$$
\eta'(\omega)=\frac{\eta_0}{1+\omega^2\tau^2},
\qquad
a=\frac{k_BT\tau}{\hbar}.
$$

Define

$$
F_p(a)=
\int_0^\infty
\frac{x^p\,dx}{(e^x-1)(1+a^2x^2)}.
$$

For a locally incoherent homogeneous emitting volume,

$$
\frac PV=
\frac{16G\eta_0(k_BT)^4}{\pi c^5\hbar^3}F_3(a),
$$

$$
\frac{\dot N}{V}
=\frac{16G\eta_0(k_BT)^3}{\pi c^5\hbar^3}F_2(a).
$$

At $a=0$,

$$
F_3(0)=\frac{\pi^4}{15},
\qquad
F_2(0)=2\zeta(3).
$$

The constant-viscosity mean quantum energy is therefore

$$
\frac{P}{\dot N}
=\frac{\pi^4}{30\zeta(3)}k_BT
\approx2.70118\,k_BT.
$$

For nonzero $\tau$, the mean energy becomes

$$
\frac{P}{\dot N}
=k_BT\frac{F_3(a)}{F_2(a)},
$$

so dividing the power by $2.70\,k_BT$ is no longer generally justified.

### 7.4 Temperature scaling can change qualitatively

For large $a$,

$$
F_3(a)\sim\frac{\pi^2}{6a^2},
\qquad
F_2(a)\sim\frac{\ln a}{a^2}.
$$

Hence

$$
\frac{P}{P_0}\sim\frac{5}{2\pi^2a^2},
\qquad
\frac{\dot N}{\dot N_0}
\sim\frac{\ln a}{2\zeta(3)a^2}.
$$

With $\eta_0$ and $\tau$ held fixed, energy emission scales asymptotically as $T^2$, while the number rate scales as $T\ln(k_BT\tau/\hbar)$. Real material parameters may also vary with temperature; those dependences would need to be included.

Illustrative numerical values at $300\,\mathrm K$ are:

| Relaxation time | $a$ | $P/P_0$ |
|---|---:|---:|
| $10^{-14}\,\mathrm s$ | 0.3928 | 0.3911 |
| $10^{-13}\,\mathrm s$ | 3.9276 | 0.01330 |
| $10^{-12}\,\mathrm s$ | 39.2761 | $1.604\times10^{-4}$ |

These are toy relaxation times, not asserted measurements of water, honey, iron, or mantle material.

### 7.5 A more interesting material prediction

If the high-frequency modulus is fixed and $\eta_0=\mu_\infty\tau$, then

$$
\eta'(\omega)=
\frac{\mu_\infty\tau}{1+\omega^2\tau^2}.
$$

Increasing $\tau$ raises the DC viscosity but eventually lowers the response at a chosen high frequency. Materials can therefore reverse their relative brightness as the observing band changes.

The useful next calculation is a pair of explicit response models and their frequency-dependent image contrast. That would give “gravitational color” physical content.

A constant-viscosity estimate is an upper estimate within this particular relaxation model. It is not a universal upper bound for materials with resonances.

### 7.6 Resolve finite-body coherence before choosing an image morphology

The thermal phonon literature includes finite elastic bodies [SD81], [DRS84]. The sphere calculation neglects internal damping and treats coherent eigenvibrations; its assumptions differ from a local incoherent volume-emissivity model.

Total power proportional to area does not, by itself, establish a surface-bright or limb-bright image. Coherent cancellations throughout a volume can change the total-power scaling.

The decisive object is a finite-body stress correlation function,

$$
\left\langle
T_{ij}(\mathbf x,t)T_{kl}(\mathbf x',0)
\right\rangle,
$$

propagated to detector mutual coherence. A normal-mode calculation for one elastic sphere could establish when the image is filled, limb-brightened, or shaped by individual modes.

The finite-body and local viscous contributions should be reconciled in one response framework before they are simply added.

### 7.7 Temperature is not identifiable from unknown emissivity alone

Even a perfect emissivity reconstruction measures

$$
j_\omega(\mathbf x)
=\alpha_\omega(\mathbf x)B_\omega[T(\mathbf x)].
$$

If $\alpha_\omega$ is unconstrained, a different trial temperature can be compensated by a different positive loss spectrum. Spectral imaging alone therefore does not give a unique thermometer without constitutive information.

A useful new section would state which assumptions make temperature identifiable: a calibrated material class, a small parameterized family of response functions, independent composition information, or an active measurement of the loss response. This is the thermal counterpart of the near-field inverse ambiguity.

## 8. The quantum architecture of the receiver

### 8.1 The draft describes two measurement models

Section 7 describes local pixels recording the gravitational field and combining classical records. Section 9 assesses the image through arriving thermal gravitons.

These models need to be connected. Amplitude detection and number detection are different quantum measurements, as emphasized in modern discussions of graviton detection [CDR24]. Their image information can differ parametrically when the field is weak and thermal.

This issue does not establish that graviton detection is impossible. It concerns the efficiency with which different measurements recover particular information.

### 8.2 A precisely specified two-mode comparison

Take two collected bosonic modes with zero-mean thermal Gaussian statistics:

$$
\langle a^\dagger a\rangle
=\langle b^\dagger b\rangle=\bar{n},
\qquad
\langle b^\dagger a\rangle=\bar{n} g.
$$

Here $\bar{n}$ is occupation per collected spatial, temporal, and helicity mode. It is not total particles per second.

Independent heterodyne outcomes have complex covariance

$$
C=
\begin{pmatrix}
1+\bar{n}&\bar{n} g\\
\bar{n} g^*&1+\bar{n}
\end{pmatrix}.
$$

At $g=0$, their exact Fisher information for either real coherence component is

$$
F_{\mathrm{het}}
=\frac{2\bar{n}^2}{(1+\bar{n})^2}.
$$

For real $g$, coherent combination followed by counting produces output-mode occupations $\bar{n}(1+g)$ and $\bar{n}(1-g)$. With $\bar{n}$ known, its Fisher information is

$$
F_{\mathrm{dir}}
=
\frac{\bar{n}}{(1+g)[1+\bar{n}(1+g)]}
+
\frac{\bar{n}}{(1-g)[1+\bar{n}(1-g)]}.
$$

At $g=0$,

$$
F_{\mathrm{dir}}=\frac{2\bar{n}}{1+\bar{n}},
\qquad
\frac{F_{\mathrm{dir}}}{F_{\mathrm{het}}}
=\frac{1+\bar{n}}{\bar{n}}.
$$

Thus in the dilute limit, coherent combination gives $O(\bar{n})$ information while independent heterodyne readout gives $O(\bar{n}^2)$ information per mode pair. Tsang establishes the underlying weak-thermal coherence distinction and a broader local-measurement bound [Tsang11].

For $M$ independent mode pairs, information adds. The corresponding exposure penalty is of order $1/\bar{n}$ at small occupation for this task and receiver comparison.

### 8.3 Qualifications that must remain in the paper

- The result concerns spatial coherence and image information in a thermal field. It does not apply unchanged to a known coherent rotor waveform.
- Local counting can estimate total brightness with $O(\bar{n})$ information; it does not recover all coherences needed for aperture synthesis.
- A direct interferometric setting measures one aligned component of $g$. Estimating both components requires phase allocation or a more general measurement.
- Unknown brightness, polarization, background, and transduction efficiency introduce nuisance parameters.
- The local-measurement result should retain the assumptions of the cited work. It should not be extended without proof to unrestricted architectures with shared entanglement or long-lived quantum memories.
- Applying it to gravity requires explicit coupling from the two gravitational helicity modes into receiver modes. The existence of a useful quantum-optical analogy is not a completed gravitational-detector theorem.

### 8.4 Occupation is a missing axis of the regime diagram

The Planck radiance for two helicities is

$$
B_\omega(T)=
\frac{\hbar\omega^3}{4\pi^3c^2}
\frac{1}{e^{\hbar\omega/k_BT}-1}.
$$

Within the draft’s optically thin local-emission model,

$$
\bar{n}_{\mathrm{out}}(\omega,\hat{\mathbf n})
=
\int \alpha_\omega(s)
\frac{ds}{e^{\hbar\omega/k_BT(s)}-1}.
$$

For the placeholder $\eta=10^{-3}\,\mathrm{Pa\,s}$,

$$
\alpha=1.2451\times10^{-37}\,\mathrm{m^{-1}}.
$$

For an isothermal Earth-diameter path of $1.27\times10^7\,\mathrm m$,

$$
\bar{n}_{\mathrm{out}}
=\frac{1.5813\times10^{-30}}{e^x-1},
\qquad
x=\frac{\hbar\omega}{k_BT}.
$$

At $x=1$, $\bar{n}_{\mathrm{out}}\simeq9.2\times10^{-31}$. This is a toy-model occupation, not a prediction validated for the real Earth. Its purpose is to show why a macroscopic flux estimate cannot be substituted for occupation per mode.

The regime map should therefore include at least:

- Source-to-observer near/far parameter $kr$.
- Source-size parameter $kL$ and source coherence scale.
- Aperture parameter $kD$.
- Occupation $\bar{n}$ and receiver class.

### 8.5 A constructive route beyond identifying the receiver gap

For a chosen set of collection modes with total occupancy $\epsilon=\operatorname{tr}\Gamma\ll1$, write the array state schematically as

$$
\rho
=(1-\epsilon)|0\rangle\langle0|
+\epsilon\rho_1+O(\epsilon^2),
\qquad
\rho_1=\frac{\Gamma}{\operatorname{tr}\Gamma},
$$

where $\Gamma$ is the mutual-coherence matrix, including helicity response and propagation phases.

For a chosen image parameter $\theta$ that does not change $\epsilon$,

$$
F_Q[\rho(\theta)]
=\epsilon F_Q[\rho_1(\theta)]+O(\epsilon^2).
$$

This suggests a concrete research program:

1. Derive the gravitational source-to-$\Gamma$ map.
2. Select an image parameter or a finite set of modes.
3. Compute classical Fisher information for local field readout.
4. Compute the quantum Fisher information of the collected state.
5. Identify the coherent receiver-mode transformation needed to approach the bound.

For a single parameter, an appropriate symmetric-logarithmic-derivative measurement provides a locally optimal measurement basis. Several image parameters can require incompatible measurements. A physical implementation would also require coherent transduction or storage, which must remain an explicit idealization.

This is a potentially substantial extension: it asks which gravitational image information survives local measurement and which benefits from joint quantum processing.

## 9. From graviton rates to image quality

### 9.1 Resolution, contrast, and exposure

For a weak thermal field with many independent modes, counting is approximately Poisson. More generally, for $M$ identical thermal modes,

$$
\langle N\rangle=M\bar{n},
\qquad
\operatorname{Var}N=M\bar{n}(1+\bar{n}).
$$

For negligible background and a known baseline intensity, fractional contrast $C$ detected at significance $q$ requires approximately

$$
N_{\mathrm{element}}\gtrsim\frac{q^2}{C^2}.
$$

For $P$ equally illuminated independent image elements and total count $N_{\mathrm{total}}$,

$$
P_{\max}\lesssim N_{\mathrm{total}}\frac{C^2}{q^2}.
$$

Comparing two separately noisy bins changes the variance by an order-one factor. With signal counts $S$ and background counts $B$,

$$
\mathrm{SNR}\simeq\frac{CS}{\sqrt{S+B}}.
$$

These are optimistic image-budgeting relations, not universal bounds on estimating a small number of source parameters.

### 9.2 Numerical consequences of the draft’s rates

A $100\times100$ image with 100 counts per element requires $10^6$ counts. One hundred counts corresponds to about 10% fractional counting uncertainty at one standard deviation.

| Source | Rate quoted in the draft for $1\,\mathrm{m^2}$ | Time for $10^6$ counts |
|---|---:|---:|
| Sun | About one per second | 11.6 days |
| Whole Earth below | About one per five hours | 570 years |

These times assume unit collection efficiency and a receiver capable of assigning the counts to the chosen image degrees of freedom. They inherit the emission assumptions, especially for the Earth.

The draft’s lifetime Earth budget of approximately $10^5$ counts could support about 1,000 equal-brightness elements at 10% fractional $1\sigma$ precision. Requiring 10% contrast at $5\sigma$ instead gives

$$
P_{\max}\sim
10^5\frac{0.1^2}{5^2}
=40.
$$

This is a useful quantitative meaning of a coarse image.

### 9.3 Aperture and radiance

For one helicity at ordinary frequency $\nu$, number radiance and occupation are related by

$$
\mathcal{N}_\nu
=\frac{\nu^2}{c^2}\bar{n}_\nu
=\frac{\bar{n}_\nu}{\lambda^2}.
$$

An accepted étendue $A\Omega$ contains approximately $A\Omega/\lambda^2$ spatial modes per helicity. Time $t$ and bandwidth $\Delta\nu$ provide approximately $\Delta\nu\,t$ temporal modes.

For a filled aperture observing uniform extended brightness at diffraction-sized angular sampling,

$$
A\,\Delta\Omega_{\mathrm{res}}\sim\lambda^2.
$$

Increasing aperture diameter then supplies more, smaller resolved image elements, while counts per diffraction-sized element stay approximately fixed at comparable efficiency.

This statement does not apply unchanged to an unresolved point source, a fixed angular bin, or a sparse array whose baseline grows without a corresponding increase in collecting area.

### 9.4 The figure to add

Show the same scene as:

1. Expected radiance.
2. An ideal counting realization after a day.
3. After a year.
4. After a lifetime.

Specify the band, angular binning, efficiency, background, constitutive model, and receiver assumption. The expected image and the acquired image should be visibly distinct concepts.

## 10. Three ambitious extensions

### 10.1 Active tidal spectroscopy

Two objects with identical passive static gravity can have different responses to an applied time-dependent tide:

$$
Q_{ij}(\omega)
=-\lambda_{ij,kl}(\omega)E^{\mathrm{ext}}_{kl}(\omega).
$$

Tidal response encodes internal structure. Love-number theory supplies the established connection between induced multipoles and applied fields [BP09].

For an isotropic quadrupolar response, a simple model is

$$
\lambda(\omega)
=\frac{\lambda_0\omega_0^2}
{\omega_0^2-\omega^2-i\Gamma\omega}.
$$

Compare a solid ball, a shell, and a fluid-filled body with the same total mass and exterior static field. Calculate their different induced quadrupoles under a known drive.

If using the astrophysical quadrupolar convention of Hinderer,

$$
\lambda(0)=\frac{2}{3}\frac{k_2R_b^5}{G},
$$

where $R_b$ is body radius [H08]. The convention should be named: a commonly used geophysical potential Love number differs by a factor of two.

This extension does not guarantee uniqueness of every interior. It changes the forward map and can distinguish some objects that passive static measurements cannot.

The conceptual connection is especially strong: driven dissipation and spontaneous thermal fluctuations involve the same response through fluctuation–dissipation. A camera with controlled tidal forcing could become a spectrometer of internal mechanical response.

### 10.2 Weigh heat

The furnace example should not assert that the same object at different internal energies has exactly the same gravitational mass unless total mass-energy has deliberately been equalized.

For energy deposited from outside the object,

$$
\Delta M=\frac{\Delta U}{c^2}.
$$

The gravitational weight of heat is established physics [Tolman30]. For $\Delta U=1\,\mathrm{MJ}$,

$$
\Delta M=1.11265\times10^{-11}\,\mathrm{kg}.
$$

At $r=1\,\mathrm m$, treating the object as compact compared with $r$,

$$
\Delta E_{\mathrm{peak}}
=\frac{2G\Delta U}{c^2r^3}
=1.48523\times10^{-21}\,\mathrm{s^{-2}}.
$$

This creates a useful thought experiment: compare detecting deposited heat through the near-field energy change with imaging the object’s emitted thermal gravitons.

The complete energy accounting matters. If a battery within the measured closed system supplies the heat, it loses energy as the heated part gains it; the total system mass need not increase. Container and support stresses must be treated consistently. Inferring temperature also requires a heat-capacity or constitutive model.

The same arbitrary-sensitivity premise makes categorical blindness to ink, displays, or color too strong. Ink has mass, and electromagnetic excitation and emitted light carry stress-energy. The useful statement concerns ordinary optical appearance not being generically recoverable from dominant mass contrast.

### 10.3 Natural optics and narrow resonances

A compactness-only prohibition on all appreciable focusing is too broad. Weak local deflection can yield strong lensing after a long propagation distance.

Patla and Nemiroff modeled the transparent Sun and found a minimum focal distance of $23.5\pm0.1\,\mathrm{AU}$, explicitly discussing gravitational radiation among the signals that could traverse it [PN08]. Wavelength and wave-optics conditions still matter. Solar diffraction in the LIGO band has also been studied as a possible probe of the solar interior [JK23].

Resonant stellar absorption and possible gravitational-wave shadows have been proposed theoretically [MFKH14]. These are not observed stellar gravitational-wave eclipses, but they invalidate an unrestricted claim that only black holes can cast shadows.

Loeb’s dissipation bound is explicitly scoped to gravitationally bound systems with random motions and no resonances [Loeb20]. It does not establish a universal prohibition on resonant absorption or lensing.

The appropriate statement is that ordinary laboratory materials provide essentially no convenient broadband gravitational optics under ordinary conditions. Natural gravitational lenses and narrow resonances are important exceptions.

An ambitious replacement theorem would bound response jointly with bandwidth, observation time, size, and source assumptions. A very high narrowband response does not automatically provide useful broadband imaging.

## 11. Further calculations with high scientific payoff

### 11.1 Inclination from circular polarization is severely ill-conditioned

Using the draft’s rotor model and $u=\cos\iota$,

$$
\frac VI=
\frac{4u(1+u^2)}{1+6u^2+u^4}.
$$

Exactly,

$$
1-\frac VI=
\frac{(1-u)^4}{1+6u^2+u^4}.
$$

Near face-on viewing,

$$
1-\frac VI=
\frac{\iota^8}{128}+O(\iota^{10}),
$$

with $\iota$ in radians.

| Inclination | $1-V/I$ |
|---|---:|
| $5^\circ$ | $2.64\times10^{-11}$ |
| $10^\circ$ | $6.87\times10^{-9}$ |
| $20^\circ$ | $1.87\times10^{-6}$ |
| $30^\circ$ | $5.31\times10^{-5}$ |

Thus the circular fraction is extraordinarily insensitive to small face-on tilts. A complete polarization Fisher calculation would quantify this.

Do not infer an inclination-error law from the eighth power alone. The weak-to-strong helicity amplitude ratio behaves as

$$
\frac{|h_{\mathrm{weak}}|}{|h_{\mathrm{strong}}|}
=\tan^4(\iota/2)
\simeq\frac{\iota^4}{16},
$$

and full waveform inference depends on the measurement noise and other fitted parameters.

### 11.2 Range depends on SNR and aperture geometry

The expansion

$$
|r\hat{\mathbf n}-\mathbf x|
=r-\hat{\mathbf n}\cdot\mathbf x
+
\frac{|\mathbf x|^2-(\hat{\mathbf n}\cdot\mathbf x)^2}{2r}
+\cdots
$$

gives the wavefront curvature phase. The scale $D^2/\lambda$ corresponds to order-one curvature phase, not an absolute range cutoff.

For calibrated coherent phase measurements,

$$
\frac{\sigma_r}{r}
\sim\frac{\lambda r}{\mathcal{R}_{\mathrm{coh}}D^2}.
$$

For the following explicit constants, define the coherent SNR so that the phase-only Fisher matrix after marginalizing a common phase is $\mathcal{R}_{\mathrm{coh}}^2$ times the aperture covariance of the phase derivatives. For a uniformly weighted filled disk of diameter $D$, viewed on-axis, this gives

$$
\frac{\sigma_r}{r}
\ge\frac{8\sqrt3}{\pi}
\frac{\lambda r}{\mathcal{R}_{\mathrm{coh}}D^2}.
$$

The corresponding phase-derived angular bound in one lateral coordinate is

$$
\sigma_\theta\ge
\frac{2}{\pi}\frac{\lambda}{\mathcal{R}_{\mathrm{coh}}D}.
$$

These constants assume a particular weighting and SNR convention. Full tensor direction information is an additional channel.

There is a useful geometry counterexample: an infinitesimally thin ring viewed on-axis has the same propagation phase at every sensor. With unknown source phase, its phase-only range information vanishes despite its nonzero diameter. Radial aperture diversity matters; diameter alone is not a sufficient description.

### 11.3 Use a standing wave to test wave-versus-pull separation

The equality of time-averaged electric and magnetic powers requires suitable ensemble assumptions. It does not hold pointwise for every coherent superposition.

Two counterpropagating coherent waves can form

$$
h_{xx}=-h_{yy}
=2A\cos(kz)\cos(\omega t).
$$

The electric tide is proportional to $\cos(kz)\cos(\omega t)$, while the magnetic tide has a factor $\sin(kz)\sin(\omega t)$. At an electric antinode, $B$ vanishes throughout the time series although the field consists entirely of waves.

Likewise, a sufficiently distant Newtonian source can look common across a compact array. A model-comparison calculation with explicit noise and source assumptions would be stronger than identifying all common signal with radiation.

Useful plane-wave diagnostics include

$$
\mathcal{I}=E:E-B:B,
\qquad
\mathcal{J}=E:B,
\qquad
\mathcal{P}_i=2\epsilon_{ijk}E_{jl}B_{kl}.
$$

A single plane wave has vanishing $\mathcal{I}$ and $\mathcal{J}$, with $\mathcal{P}$ aligned with propagation up to convention. These are diagnostics within stated models, not universal local classifiers of every source mixture.

### 11.4 A general source is not necessarily smaller than its wavelength

The draft’s rotating-pair wavelength-to-size relation is correct for that source. Its generalization assumes the displacement scale is comparable to the total source size.

For small-amplitude motion of amplitude $a_{\mathrm{osc}}$ in a body of size $L$,

$$
v\sim\omega a_{\mathrm{osc}},
\qquad
\frac{\lambda}{L}
\sim2\pi\frac cv\frac{a_{\mathrm{osc}}}L.
$$

The ratio $v/c$ alone does not determine $L/\lambda$.

The leading asymptotic far-field solution for a conserved complete source is

$$
\widetilde h_{ij}^{\mathrm{TT}}(\omega,r\hat{\mathbf n})
=
\frac{4Ge^{ikr}}{c^4r}
\Lambda_{ij,kl}(\hat{\mathbf n})
\int d^3x\,
\widetilde T_{kl}(\omega,\mathbf x)
e^{-ik\hat{\mathbf n}\cdot\mathbf x},
\qquad k=\frac{\omega}{c}.
$$

Here $\Lambda$ is the transverse-traceless projector. The expression assumes the Fraunhofer regime $r\gg L$ and $kL^2/r\ll1$, or the asymptotic limit $r\to\infty$ at fixed source and frequency. The stress tensor must include relevant supports and momentum transport.

The quadrupole formula follows after also imposing $kL\ll1$ and using stress-energy conservation. It cannot establish that compact-source condition universally.

An extended collection of small, phase-controlled nonrelativistic emitters is a counterexample to the unrestricted “every body is a point” claim. Each emitter can be subwavelength while the assembly has a measurable spatial form factor.

### 11.5 Check the slowed-light teaching mode

For $c_{\mathrm{toy}}=0.2\,\mathrm{m\,s^{-1}}$ and a rotor frequency of $1\,\mathrm{Hz}$,

$$
\frac{v}{c_{\mathrm{toy}}}
=\frac{\pi d f_{\mathrm{rot}}}{c_{\mathrm{toy}}}
=15.708\,\frac{d}{1\,\mathrm m},
$$

where $d$ is the pair separation. The nonrelativistic approximation requires

$$
d\ll0.0637\,\mathrm m.
$$

The PDF does not specify the relevant separation, so this is a consistency condition rather than a confirmed numerical failure. If the visualization only rescales wavelength, it should be described as a pedagogical rescaling rather than a dynamically self-consistent altered-speed universe.

### 11.6 Enforce conservation in energy and current examples

The laser example should include a conserved emitter–beam–absorber system when making claims about total mass or distant fields. Local pressure contributions and global mass accounting should not be mixed.

The magnetic current column also needs its explicit forward kernel and nullspace. Exterior data encode current multipoles; a source-dependent current rendering is not automatically a uniquely reconstructable internal velocity map.

## 12. A complete solar imaging example

### 12.1 Replace a uniform core with a frequency-dependent profile

The Sun is a useful flagship because detailed thermal gravitational emission calculations already exist [GCR25]. For a spherically symmetric emissivity,

$$
I_\omega(b)
=2\int_b^{R_\odot}
\frac{j_\omega(r)\,r\,dr}{\sqrt{r^2-b^2}},
$$

where $b$ is impact parameter.

Under the assumptions of this Abel transform,

$$
j_\omega(r)
=-\frac1\pi
\int_r^{R_\odot}
\frac{dI_\omega/db}{\sqrt{b^2-r^2}}\,db.
$$

The derivative makes noise and angular response important. Simulate both the forward image and the reconstruction, with regularization and uncertainty.

### 12.2 Define the contribution carefully

The solar-spectrum paper already proposes spatial and spectral observations as a window into the solar interior [GCR25]. The contribution here would be a worked image and reconstruction with a specified receiver and information budget.

Recovered emissivity should not automatically be labeled recovered temperature. Composition and dissipative response need to be specified or jointly inferred.

### 12.3 Include the rest of the gravitational sky

Transparency admits distant emission into the same line of sight. A foreground/background calculation should therefore be frequency dependent.

The solar-spectrum paper estimates a Galactic stellar background and compares early-Universe backgrounds [GCR25]. Their relevance to an Earth image depends on band, angular response, and source spectrum. An integrated bolometric comparison is not enough.

A useful question is: which frequency bands maximize contrast of the local object after accounting for the complete background and the receiver’s noise?

### 12.4 An additional identifiability calculation

For a Maxwell model observed entirely in the Rayleigh–Jeans regime,

$$
j_\omega\propto
\frac{\eta_0T\,\omega^2}{1+\omega^2\tau^2}.
$$

The spectrum can constrain $\eta_0T$ and $\tau$, but cannot separate $\eta_0$ from $T$ without additional information. If the band also lies far above the relaxation turnover, the remaining dependence is approximately the single combination $\eta_0T/\tau^2$.

Compute the singular values of the Fisher matrix for $(\eta_0,\tau,T)$ as the band moves across $\omega\tau\sim1$ and $\hbar\omega/k_BT\sim1$. This would establish when gravitational color actually acts as a thermometer.

For a uniform resolved element, a separately measured absorption coefficient would give

$$
\frac{j_\omega}{\alpha_\omega}=B_\omega(T),
$$

removing the unknown loss in principle. Measuring such minute attenuation is itself an idealized active experiment; this is an identifiability observation, not an instrument proposal.

## 13. Recommended revision program

### 13.1 Three central results

**Result 1: An observability map.** State the source equivalence classes and measurable modes for exterior static gravity, known support, sparse sources, local stochastic radiation, and finite-baseline measurements.

**Result 2: A complete near-field reconstruction.** Use a finite array, explicit noise, several source classes, and an exactly indistinguishable pair of interiors. Include both image recovery and parameter estimation.

**Result 3: A controlled thermal camera.** Choose an explicit material response and receiver. Complete the quantum-receiver comparison if feasible; otherwise keep its assumptions and conditional count budgets explicit.

### 13.2 Four decisive figures

| Figure | Scientific purpose | Required contents |
|---|---|---|
| Different interiors, identical exterior data | Demonstrates exact non-identifiability | Positive source pair, true interior, sensor equality, inferred alternatives |
| Broad image, precise location | Separates imaging from estimation | Regularized PSF, fitted source position, uncertainty ellipse, stated SNR |
| Material contrast across frequency | Gives gravitational color a physical basis | Two response models, spectra, band images, constitutive assumptions |
| Expectation and finite exposure | Explains what an acquired image contains | Expected radiance, sampled observations, exposure, counts, receiver assumptions |

The safe, furnace, and midnight Sun can remain the motivating scenes. Each should lead to a precise inference question that the analysis actually answers.

### 13.3 A practical order of work

1. Correct the statements whose scope is currently too broad.
2. Fix conventions and define the camera’s allowed measurements.
3. Implement a finite-array source-to-data-to-reconstruction example.
4. Add the point-mass Fisher and spherical transfer calculations.
5. Add a positive-source discrimination bound.
6. Replace constant-viscosity physical claims with a controlled response model.
7. Derive the receiver’s mutual-coherence map and compare measurement strategies.
8. Build one complete solar example.
9. Add active tidal spectroscopy if it supports the paper’s central narrative.

### 13.4 Positioning and title

A possible title is **What Can Be Seen with Gravity?**

A more technical alternative is **The Gravitational Camera: Observability, Resolution, and Quantum Measurement**.

The central scientific statement would be:

> A gravitational camera reveals mass, energy, motion, and stress while leaving precisely characterizable families of sources indistinguishable. Its image depends on source geometry, prior information, constitutive response, and the measurement architecture.

The review does not establish that these statements or all their mathematical ingredients are new. A strong paper can contribute a rigorous synthesis, a clear operational definition, and carefully chosen new calculations. The quantum receiver extension is the most ambitious candidate for a separate theoretical contribution.

---

## Appendix A: Point-mass Fisher calculation

For parameters $\theta_\alpha$ and Gaussian spatial white noise, the Fisher matrix is

$$
F_{\alpha\beta}
=\frac1{N_0}
\int_{\mathbb R^2}
\frac{\partial f}{\partial\theta_\alpha}
\frac{\partial f}{\partial\theta_\beta}\,d^2x.
$$

With the point-mass field used in Section 4,

$$
\int f^2d^2x
=2\pi G^2M^2
\int_0^\infty
\frac{s(s^2-2z^2)^2}{(s^2+z^2)^5}\,ds
=\frac{3\pi G^2M^2}{4z^4}.
$$

Symmetry removes the cross-terms between lateral displacement and mass/depth. The remaining blocks are

$$
F_{M,z}
=\mathcal{R}^2
\begin{pmatrix}
M^{-2}&-2/(Mz)\\
-2/(Mz)&5/z^2
\end{pmatrix},
\qquad
F_{xx}=F_{yy}=\frac{5\mathcal{R}^2}{2z^2}.
$$

The inverse mass/depth block is

$$
F_{M,z}^{-1}
=\frac1{\mathcal{R}^2}
\begin{pmatrix}
5M^2&2Mz\\
2Mz&z^2
\end{pmatrix}.
$$

These yield the bounds stated in Section 4. Unknown mass has been marginalized rather than assumed fixed.

For a small circular disk, expand

$$
f(s)=\frac{GM}{z^3}
\left[-2+6\frac{s^2}{z^2}
+O\!\left(\frac{s^4}{z^4}\right)\right].
$$

The leading marginal depth information and lateral information become

$$
F_{\ln z,\mathrm{marginal}}
\simeq3\mathcal{R}_A^2(A/z)^4,
\qquad
F_{xx}\simeq9\mathcal{R}_A^2A^2/z^4.
$$

Symbolic integrations and independent finite-disk quadratures reproduce these constants. They apply to the stated $E_{zz}$-only measurement model.

## Appendix B: Close equal pairs and discrimination

Let the pair have equal masses, total mass $M$, common depth $z$, known separation axis, and separation $d$. Expanding the two shifted fields gives

$$
f_{\mathrm{pair}}
=f_M+\frac{d^2}{8}f_{M,xx}+O(d^4).
$$

After projecting out nuisance directions corresponding to unknown $M$ and $z$, the leading separation Fisher information is

$$
F_{dd,\mathrm{marginal}}
=\frac{\mathcal{R}^2}{z^2}
\left[
\frac{115}{256}\left(\frac dz\right)^2
+O\!\left(\frac{d^4}{z^4}\right)
\right].
$$

For $d>0$ in the local regular regime,

$$
\sigma_d\gtrsim
\frac{16z^2}{\sqrt{115}\,\mathcal{R}\,d}.
$$

Numerical integration of the exact separated-pair signal gives:

| $d/z$ | $F_{dd}z^4/(\mathcal{R}^2d^2)$ |
|---|---:|
| 0.1 | 0.4511559 |
| 0.03 | 0.4493944 |
| 0.01 | 0.4492383 |
| 0.003 | 0.4492205 |
| Asymptotic limit | $115/256=0.44921875$ |

### Why the local error bar is not a resolution criterion

The closest single-source alternative changes its parameters by

$$
\frac{M'}M
=1+\frac{5d^2}{16z^2}
+O\!\left(\frac{d^4}{z^4}\right),
\qquad
\frac{z'}z
=1+\frac{5d^2}{16z^2}
+O\!\left(\frac{d^4}{z^4}\right).
$$

Its noise-weighted distance from the pair is

$$
\Delta
=\frac{\sqrt{115}}{32}\mathcal{R}(d/z)^2
+O\!\left[\mathcal{R}(d/z)^4\right].
$$

For these two fixed alternatives with equal priors,

$$
P_e=\Phi_{\mathrm{N}}(-\Delta/2).
$$

Setting the local CRB equal to $d$ would give $d/z\simeq1.22/\sqrt{\mathcal{R}}$, but at that point $\Delta\simeq0.5$ and the binary classification error is about 40%. It should not be called reliable resolution.

A 5% error for this pair of fixed alternatives requires approximately

$$
d/z\gtrsim3.13/\sqrt{\mathcal{R}}
$$

in the asymptotic regime. This is a necessary distinguishability condition against one nearby alternative, not a sufficient guarantee for every composite inference problem.

The robust conclusion is the model-dependent $\mathcal{R}^{-1/2}$ scaling, together with an explicit confidence criterion.

## Appendix C: Thermal normalization and asymptotics

With both helicities included,

$$
B_\omega(T)=
\frac{\hbar\omega^3}{4\pi^3c^2}
\frac1{e^{\hbar\omega/k_BT}-1}.
$$

Using $j_\omega=\alpha_\omega B_\omega$ and integrating over all solid angles,

$$
\frac PV=4\pi\int_0^\infty j_\omega\,d\omega,
\qquad
\frac{\dot N}{V}
=4\pi\int_0^\infty
\frac{j_\omega}{\hbar\omega}\,d\omega.
$$

For constant viscosity,

$$
\left(\frac PV\right)_0
=\frac{16\pi^3}{15}
\frac{G\eta_0(k_BT)^4}{c^5\hbar^3}
=4\alpha_0\sigma_{\mathrm{SB}}T^4,
$$

$$
\left(\frac{\dot N}{V}\right)_0
=\frac{32\zeta(3)}{\pi}
\frac{G\eta_0(k_BT)^3}{c^5\hbar^3}.
$$

The Stefan–Boltzmann expression is a normalization check, not a claim that the actual object emits a blackbody spectrum with unit opacity.

For the Maxwell model, define normalized suppression functions

$$
R_E(a)=\frac{15}{\pi^4}F_3(a),
\qquad
R_N(a)=\frac{F_2(a)}{2\zeta(3)}.
$$

| $a$ | $R_E$ | $R_N$ | Mean energy divided by $k_BT$ |
|---|---:|---:|---:|
| 0 | 1 | 1 | 2.70118 |
| 0.1 | 0.86073 | 0.91707 | 2.53521 |
| 1 | 0.12659 | 0.24210 | 1.41234 |
| 4 | 0.012867 | 0.040630 | 0.85544 |
| 40 | $1.5468\times10^{-4}$ | $9.6402\times10^{-4}$ | 0.43342 |

The number integral requires care at low frequency. Its large-$a$ expansion is

$$
F_2(a)
=\frac1{a^2}
\left[
\ln a+\frac{\pi}{4a}
+O\!\left(\frac{\ln a}{a^2}\right)
\right].
$$

One way to see that the leading logarithm has no added constant is to subtract $1/x$ from the Bose factor on $0<x<1$:

$$
\int_0^1
\left(\frac1{e^x-1}-\frac1x\right)dx
+
\int_1^\infty\frac{dx}{e^x-1}=0.
$$

Consequently,

$$
\frac PV
\sim\frac{8\pi}{3}
\frac{G\eta_0(k_BT)^2}{c^5\hbar\tau^2},
$$

$$
\frac{\dot N}{V}
\sim\frac{16}{\pi}
\frac{G\eta_0k_BT}{c^5\hbar\tau^2}
\ln\!\left(\frac{k_BT\tau}{\hbar}\right).
$$

These are toy-model asymptotics with fixed constitutive parameters. They should not be presented as general thermal laws for real solids or liquids.

## Appendix D: Polarization accounting for a local pixel

### D.1 Measurement object

Use the complex cross-spectrum at one positive frequency,

$$
C_{ab}(\omega)
=\langle X_a(\omega)X_b^*(\omega)\rangle,
$$

where the ten channels $X_a$ span all five electric and five magnetic STF components. Assume vacuum propagation at the pixel, independent sky directions, and full relative calibration.

A $10\times10$ Hermitian covariance matrix could contain 100 real parameters algebraically. The plane-wave angular response restricts which combinations are realizable by this sky model.

### D.2 Helicity decomposition

The combinations $E+iB$ and $E-iB$ separate the two helicity responses up to orientation and sign conventions. Each transforms as a five-component $\ell=2$ object.

The two auto-covariance blocks are $5\times5$ Hermitian matrices associated with the two helicity intensities, equivalently $I+V$ and $I-V$. Their angular response contains every degree from zero through four, with nonzero coupling in each degree. Each therefore carries

$$
1+3+5+7+9=25
$$

independent real coefficients.

The cross-helicity covariance transforms with spin weight four. Its angular expansion begins at $\ell=4$, while the product of the two rank-two responses ends at $\ell=4$. It therefore contains exactly the nine complex coefficients at that degree:

$$
2(2\cdot4+1)=18
$$

real coefficients.

The total is

$$
25+25+18=68.
$$

The complementary 32 real directions of a general ten-channel Hermitian covariance are not independent sky parameters in this model. The count was also checked using numerical ranks of the ideal plane-wave kernels. It is a derived accounting result here; its publication novelty has not been established.

### D.3 Temporal information matters

Equal-time real covariance removes the imaginary spectral structure that carries circular polarization in this description. Its observable rank is 43: 25 intensity coefficients plus 18 linear-polarization coefficients.

This is why a claim about “one pixel” must specify whether it includes time-lag or quadrature correlations. An instantaneous set of ten real numbers, an equal-time covariance, and a complex cross-spectrum are different data objects.

### D.4 Connection to source localization

A finite angular-mode count does not imply that a single isolated source can only be localized to the width of a truncated-harmonic kernel. A low-dimensional source model can encode its direction in the measured tensor structure. This is the radiation analogue of the distinction between a broad mass reconstruction and precise point-mass localization.

## Appendix E: Claim and assumption audit

| Draft claim or presentation | Required qualification or correction | Stronger replacement |
|---|---|---|
| Close exterior arrays distinguish equal-mass spherical shell and ball | Exterior fields agree at every exterior point | Present a nullspace and source-equivalence example |
| Tidal column is the uniquely observed image | Forward angular identity does not establish invertibility | Separate source rendering, data prediction, and reconstruction |
| Near-field blur depends only on sensitivity | The quoted result uses a particular support, noise model, and effectively infinite plane | Include aperture, priors, source class, and parameter-estimation bounds |
| Near field can never be sharp | Identifiable modes improve without a hard floor as SNR increases | State exponential resource cost and exact ambiguities separately |
| Ten numbers describe gravity everywhere | The ten-component description is vacuum Weyl data | State vacuum assumptions and retain Ricci information where needed |
| Sheet transfer has a positive sign with $E_{ij}=\partial_i\partial_j\Phi$ | Physical $E_{zz}$ transfer has a minus sign for $\Phi=-GM/r$ | Define detector output sign explicitly |
| Every nonrelativistic body is a point in its radiation | Small speed alone does not imply small total size relative to wavelength | Retain the source form factor and distinguish emitter, body, and coherence scales |
| Figure 13 is a physical power response | Its negative curve is a signed harmonic reconstruction kernel | Show raw beam, inverse kernel, and their different noise covariances |
| Any mixture of waves has equal local electric/magnetic power | Coherent standing waves are counterexamples | State ensemble assumptions and test classifier ambiguity |
| Common array signal is necessarily radiation | Distant near fields can be common across a small array | Use explicit source models and statistical discrimination |
| $D^2/\lambda$ is a maximum measurable range | It is an order-one curvature-phase scale | Include SNR, aperture weighting, and nuisance phase |
| DC viscosity fixes thermal brightness | High-frequency stress response is required | Use a specified causal constitutive model |
| Constant viscosity always gives an upper bound | Resonances can exceed the DC response | Name the response family within which an upper estimate holds |
| Area scaling proves a glowing surface | Coherent volume cancellations can also give area scaling | Calculate finite-body spatial coherence and the resolved image |
| Thermal emissivity directly determines temperature | Loss and temperature can be degenerate | Supply constitutive calibration or joint emission/absorption information |
| Graviton counts directly characterize any ideal phase receiver | Receiver classes have different coherence information | Define the quantum measurement and compare information rates |
| Low compactness prohibits all useful optics | Long-distance focusing and resonances are exceptions | Scope the laboratory claim and investigate bandwidth-dependent bounds |
| Only black holes cast shadows | Resonant stellar absorption has theoretical counterexamples | State the frequency and material assumptions |
| Hot and cold versions of the same block weigh exactly the same | Added energy changes total mass unless compensated | Use a complete energy-accounting thought experiment |
| Page/display information is fundamentally absent | Ink and electromagnetic energy have gravitational effects | Limit the claim to dominant mass contrast and generic optical appearance |
| Slowed-light rotor preserves the quadrupole regime automatically | $v/c_{\mathrm{toy}}$ must remain small | State the toy rescaling and check its dimensionless parameters |

---

## References

The bibliography below includes every external source cited in the preceding review and additional sources used to sharpen the memo. Citation keys link directly to a primary record or paper. Some historical sources were checked through publisher records or publisher-provided previews rather than their complete text; the notes identify the relevant limits.

### Reviewed manuscript

**Mostafa “Neo” Mohsenvand.** *Gravitational Camera: A Thought Experiment.* Working draft, 16 November 2026. 28 pages. Supplied manuscript; references to its sections, figures, and equation numbers throughout this memo refer to this version.

[Open the supplied manuscript](https://chatgpt.com/library?file_id=libfile_fde3_f-a29ed9c1e3d48191826c72c7d6614643_662707bfeb6881919f55c8ed71c23d16&account_id=personal).

### Inverse problems and gravitational estimation

**[YMM11] Ulvi Yurtsever, Caren Marzban, and Marina Meilă.** “On the Gravitational Inverse Problem.” *Applied Mathematical Sciences* **5**(57), 2839–2854 (2011). Preprint posted in 2010.  
[Author-hosted full text](https://faculty.washington.edu/marzban/gravity.pdf) · [arXiv:1004.4939](https://arxiv.org/abs/1004.4939).  
**Relevance:** Explicit gravitational forward-map nullspaces and constrained uniqueness. The full paper was inspected.

**[Chao04] Benjamin F. Chao.** “On the Inversion for Mass (Re)Distribution from Global (Time-Variable) Gravity Field.” American Geophysical Union meeting abstract (2004); NASA Technical Reports Server record 20050139755.  
[NASA record](https://ntrs.nasa.gov/citations/20050139755).  
**Relevance:** Exterior density nonuniqueness and uniqueness on known spherical support. This reference is the institutional abstract record, not a claim to have reviewed an unavailable full conference paper.

**[MN94] C. H. Muravchik and A. Nehorai.** “Localizing and identifying underground objects using gravitational measurements.” *Conference Record of the Twenty-Eighth Asilomar Conference on Signals, Systems and Computers* (1994).  
[DOI:10.1109/ACSSC.1994.471564](https://doi.org/10.1109/ACSSC.1994.471564) · [Author-institution record](https://profiles.wustl.edu/en/publications/localizing-and-identifying-underground-objects-using-gravitationa/).  
**Relevance:** Prior gravitational-source localization and parameter-accuracy analysis. The Fisher constants in this memo were derived independently for the explicitly stated continuous-plane model.

### Local tensor measurements and polarized sky information

**[MJ95] Stephen M. Merkowitz and Warren W. Johnson.** “Spherical gravitational wave antennas and the truncated icosahedral arrangement.” *Physical Review D* **51**, 2546–2558 (1995).  
[DOI:10.1103/PhysRevD.51.2546](https://doi.org/10.1103/PhysRevD.51.2546).  
**Relevance:** Antecedent for tensor-component reconstruction, direction, and polarization with a spherical antenna.

**[MJ97] Stephen M. Merkowitz and Warren W. Johnson.** “Techniques for detecting gravitational waves with a spherical antenna.” *Physical Review D* **56**, 7513–7528 (1997).  
[DOI:10.1103/PhysRevD.56.7513](https://doi.org/10.1103/PhysRevD.56.7513).  
**Relevance:** Five tensor components and source-direction inference from quadrupole modes.

**[SC04] Naoki Seto and Asantha Cooray.** “LISA measurement of gravitational wave background anisotropy: Hexadecapole moment via a correlation analysis.” *Physical Review D* **70**, 123005 (2004).  
[DOI:10.1103/PhysRevD.70.123005](https://doi.org/10.1103/PhysRevD.70.123005) · [arXiv:astro-ph/0403259](https://arxiv.org/abs/astro-ph/0403259).  
**Relevance:** Prior explicit treatment of degree-four angular information in detector correlations.

**[Seto06] Naoki Seto.** “Prospects for Direct Detection of the Circular Polarization of the Gravitational-Wave Background.” *Physical Review Letters* **97**, 151101 (2006).  
[DOI:10.1103/PhysRevLett.97.151101](https://doi.org/10.1103/PhysRevLett.97.151101).  
**Relevance:** Odd angular moments of circular polarization. This is an antecedent, not a citation claiming the paper contains the memo’s full 68-coefficient accounting.

### Material response and thermal gravitational emission

**[CP12] A. Cetoli and C. J. Pethick.** “Interaction of gravitational waves with matter.” *Physical Review D* **85**, 064036 (2012).  
[DOI:10.1103/PhysRevD.85.064036](https://doi.org/10.1103/PhysRevD.85.064036) · [arXiv:1110.0408](https://arxiv.org/abs/1110.0408).  
**Relevance:** Matter-correlation formulation of gravitational-wave response and dispersion.

**[BPP17] Gordon Baym, Subodh P. Patil, and C. J. Pethick.** “Damping of gravitational waves by matter.” *Physical Review D* **96**, 084033 (2017).  
[DOI:10.1103/PhysRevD.96.084033](https://doi.org/10.1103/PhysRevD.96.084033) · [arXiv:1707.05192](https://arxiv.org/abs/1707.05192).  
**Relevance:** Hydrodynamic validity, collisional response, and high-frequency suppression. The full preprint was inspected.

**[GL15] J. Ghiglieri and M. Laine.** “Gravitational wave background from Standard Model physics: Qualitative features.” *Journal of Cosmology and Astroparticle Physics* **2015**(07), 022 (2015).  
[DOI:10.1088/1475-7516/2015/07/022](https://doi.org/10.1088/1475-7516/2015/07/022) · [arXiv:1504.02569](https://arxiv.org/abs/1504.02569).  
**Relevance:** Thermal stress fluctuations and the hydrodynamic viscosity relation; also cited in the submitted draft.

**[SD81] G. Schäfer and H. Dehnen.** “Gravitational radiation by the thermal phonons of a solid.” *Physical Review D* **23**, 2129–2136 (1981).  
[DOI:10.1103/PhysRevD.23.2129](https://doi.org/10.1103/PhysRevD.23.2129).  
**Erratum:** *Physical Review D* **24**, 3352 (1981), [DOI:10.1103/PhysRevD.24.3352](https://doi.org/10.1103/PhysRevD.24.3352).  
**Relevance:** Finite-body phonon emission; consult the erratum in any detailed reuse.

**[DRS84] H. Dehnen, F. Romero, and G. Schäfer.** “Gravitational radiation of an isotropic elastic sphere.” *Classical and Quantum Gravity* **1**(3), 305–318 (1984).  
[DOI:10.1088/0264-9381/1/3/010](https://doi.org/10.1088/0264-9381/1/3/010) · [Publisher-provided preview](https://www.researchgate.net/publication/252479544_Gravitational_radiation_of_an_isotropic_elastic_sphere).  
**Relevance:** An undamped coherent finite-body model and its reported luminosity scaling. The publisher-provided first-page preview and metadata were checked; the full derivation was not independently reproduced. The paper prints “F. Romero,” whereas the draft lists “B. F. Romero.”

**[GCR25] Camilo García-Cely and Andreas Ringwald.** “Complete Gravitational-Wave Spectrum of the Sun.” *Physical Review Letters* **135**, 061001 (2025).  
[DOI:10.1103/gtwg-pr41](https://doi.org/10.1103/gtwg-pr41) · [arXiv:2407.18297](https://arxiv.org/abs/2407.18297) · [Full HTML version](https://arxiv.org/html/2407.18297v2).  
**Relevance:** Hydrodynamic and microscopic solar emission, radial source modeling, background estimates, and the already-proposed prospect of spatial/spectral solar observations. The full HTML paper was inspected.

### Quantum receivers

**[Tsang11] Mankei Tsang.** “Quantum Nonlocality in Weak-Thermal-Light Interferometry.” *Physical Review Letters* **107**, 270402 (2011).  
[DOI:10.1103/PhysRevLett.107.270402](https://doi.org/10.1103/PhysRevLett.107.270402) · [arXiv:1108.1829](https://arxiv.org/abs/1108.1829).  
**Relevance:** Local-versus-coherent measurement information for weak thermal mutual coherence. The paper and its relevant derivations were inspected. Transferring the result to a gravitational receiver requires the extra coupling model described in this memo.

**[CDR24] Daniel Carney, Valerie Domcke, and Nicholas L. Rodd.** “Graviton detection and the quantization of gravity.” *Physical Review D* **109**, 044009 (2024).  
[DOI:10.1103/PhysRevD.109.044009](https://doi.org/10.1103/PhysRevD.109.044009) · [arXiv:2308.12988](https://arxiv.org/abs/2308.12988).  
**Relevance:** Distinguishing amplitude measurements, number measurements, and tests of quantization.

### Tidal response and gravitational energy

**[BP09] Taylor Binnington and Eric Poisson.** “Relativistic theory of tidal Love numbers.” *Physical Review D* **80**, 084018 (2009).  
[DOI:10.1103/PhysRevD.80.084018](https://doi.org/10.1103/PhysRevD.80.084018) · [arXiv:0906.1366](https://arxiv.org/abs/0906.1366).  
**Relevance:** Applied tides, induced multipoles, and interior response.

**[H08] Tanja Hinderer.** “Tidal Love Numbers of Neutron Stars.” *The Astrophysical Journal* **677**, 1216–1220 (2008).  
[DOI:10.1086/533487](https://doi.org/10.1086/533487) · [Updated arXiv:0711.2420](https://arxiv.org/abs/0711.2420).  
**Erratum:** *The Astrophysical Journal* **697**, 964 (2009), [DOI:10.1088/0004-637X/697/1/964](https://doi.org/10.1088/0004-637X/697/1/964).  
**Relevance:** The astrophysical quadrupolar Love-number convention used in Section 10.

**[Tolman30] Richard C. Tolman.** “On the Weight of Heat and Thermal Equilibrium in General Relativity.” *Physical Review* **35**, 904 (1930).  
[DOI:10.1103/PhysRev.35.904](https://doi.org/10.1103/PhysRev.35.904) · [Caltech record](https://authors.library.caltech.edu/records/4abde-yn906).  
**Relevance:** Heat and gravitational mass; the one-megajoule tidal example is calculated in this memo.

### Natural optics, diffraction, and absorption

**[PN08] Bijunath Patla and Robert J. Nemiroff.** “Gravitational Lensing Characteristics of the Transparent Sun.” *The Astrophysical Journal* **685**(2), 1297–1303 (2008).  
[DOI:10.1086/588805](https://doi.org/10.1086/588805) · [arXiv:0711.4811](https://arxiv.org/abs/0711.4811).  
**Relevance:** Transparent-Sun focusing and the limits of a compactness-only optics prohibition.

**[JK23] Sunghoon Jung and Sungjung Kim.** “Solar diffraction of LIGO-band gravitational waves.” *Journal of Cosmology and Astroparticle Physics* **2023**(07), 042 (2023).  
[DOI:10.1088/1475-7516/2023/07/042](https://doi.org/10.1088/1475-7516/2023/07/042) · [arXiv:2210.02649](https://arxiv.org/abs/2210.02649).  
**Relevance:** Theoretical solar diffraction and potential inference about the solar interior, not a claimed detection.

**[MFKH14] B. McKernan, K. E. S. Ford, B. Kocsis, and Z. Haiman.** “Stars as resonant absorbers of gravitational waves.” *Monthly Notices of the Royal Astronomical Society: Letters* **445**(1), L74–L78 (2014).  
[DOI:10.1093/mnrasl/slu136](https://doi.org/10.1093/mnrasl/slu136) · [arXiv:1405.1414](https://arxiv.org/abs/1405.1414).  
**Relevance:** Proposed resonant absorption and spectral shadows; this is a theoretical result, not an observed stellar eclipse in gravitational waves.

**[Loeb20] Abraham Loeb.** “Upper Limit on the Dissipation of Gravitational Waves in Gravitationally Bound Systems.” *The Astrophysical Journal Letters* **890**, L16 (2020).  
[DOI:10.3847/2041-8213/ab72ab](https://doi.org/10.3847/2041-8213/ab72ab) · [arXiv:2001.01730](https://arxiv.org/abs/2001.01730).  
**Relevance:** A scoped dissipation bound for random motions without resonances; not a universal no-optics theorem.

---

### Citation links

[YMM11]: https://arxiv.org/abs/1004.4939
[Chao04]: https://ntrs.nasa.gov/citations/20050139755
[MN94]: https://doi.org/10.1109/ACSSC.1994.471564
[MJ95]: https://doi.org/10.1103/PhysRevD.51.2546
[MJ97]: https://doi.org/10.1103/PhysRevD.56.7513
[SC04]: https://doi.org/10.1103/PhysRevD.70.123005
[Seto06]: https://doi.org/10.1103/PhysRevLett.97.151101
[CP12]: https://doi.org/10.1103/PhysRevD.85.064036
[BPP17]: https://doi.org/10.1103/PhysRevD.96.084033
[GL15]: https://arxiv.org/abs/1504.02569
[SD81]: https://doi.org/10.1103/PhysRevD.23.2129
[DRS84]: https://doi.org/10.1088/0264-9381/1/3/010
[GCR25]: https://arxiv.org/html/2407.18297v2
[Tsang11]: https://arxiv.org/abs/1108.1829
[CDR24]: https://doi.org/10.1103/PhysRevD.109.044009
[BP09]: https://doi.org/10.1103/PhysRevD.80.084018
[H08]: https://arxiv.org/abs/0711.2420
[Tolman30]: https://doi.org/10.1103/PhysRev.35.904
[PN08]: https://arxiv.org/abs/0711.4811
[JK23]: https://arxiv.org/abs/2210.02649
[MFKH14]: https://arxiv.org/abs/1405.1414
[Loeb20]: https://arxiv.org/abs/2001.01730
