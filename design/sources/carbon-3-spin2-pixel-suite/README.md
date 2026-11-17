# Spin-2 Pixel Verification Suite

Companion zero-dependency Python 3 verification code and unified mathematical derivations for **"What a Spin-2 Pixel Can Do That Light Cannot"** (in response to *A brief for a second mind*, companion to *Gravitational Camera: A Thought Experiment*).

## Quick Start

No external packages (`numpy`, `scipy`, etc.) are required — every algorithm, polynomial automatic differentiator, Jacobi eigensolver, cancellation-free $3\times 3$ SVD, Householder QR rank decomposition, Gauss–Legendre integrator, and Durand–Kerner root finder is implemented directly in pure standard-library Python 3 (`math`, `cmath`, `random`).

Run the entire verification suite with:

```bash
python3 run_all_tests.py
```

Or run any individual module directly (`python3 test_01_ranging.py`, etc.).

## Conventions

- Metric signature $(-+++)$, coordinates $x^0 = ct, x^i$, Levi-Civita $\epsilon_{123} = +1$.
- Electric and magnetic tidal tensors: $\mathcal{E}_{ij} = c^2 R_{0i0j}$ and $\mathcal{B}_{ij} = \frac{1}{2} c^2 \epsilon_{ipq} R_{pqj0}$ (in $\mathrm{s}^{-2}$).
- Complex Weyl matrix: $W = \mathcal{E} + i\mathcal{B}$.
- Plane wave travelling along unit propagation vector $\hat{k}$ ($\hat{k} = -\hat{n}_{\mathrm{source}}$): $W = c_0\,\mathbf{m}\mathbf{m}^T$ with $\mathbf{m}\cdot\mathbf{m} = 0$ and $\hat{k} = i(\mathbf{m}\times\mathbf{m}^*)/|\mathbf{m}|^2$.

## Contents

- `spin2_pixel_complete_theory.md` — Complete unified mathematical treatise answering Questions 1–6 with literature attributions, exact/asymptotic classifications, and numerical benchmarks.
- `run_all_tests.py` — Master verification script running all 7 test suites with assertions.
- `spin2_linalg.py` — Pure-Python STF tensor basis, sky triads, cancellation-free $3\times 3$ SVD, complex Hermitian Jacobi eigensolver, column-pivoted Householder QR rank, $SO(3,\mathbb{C})$ exponential, degree-4 3D polynomial automatic differentiation, Gauss–Legendre quadrature, and Durand–Kerner polynomial solver.
- `test_00_foundations.py` — Baseline checks: Eq. (31) Poynting direction, $0.6c$ relativistic $SO(3,\mathbb{C})$ polar-decomposition speedometer, $2$-wave instantaneous / $3$-wave frequency-pencil / $4$-wave Bézout unmixing, and $68+32=100$ (gravity) vs. $28+8=36$ (light) spectral sky counts.
- `test_01_ranging.py` — **Question 1:** Exact linearized quadrupole Weyl evaluator (`Eq. 41`), 5-zone Sachs peeling matrix $\widehat{W}$, general-quadrupole $s_2/s_1$, closed-form rotating-quadrupole $C(\iota, \theta)$, face-on $\frac{3}{2}(kr)^{-4}$ law, Fourier $2\tan^{\pm 2}(\iota/2)$ inclination-free range estimator, and $\mathcal{O}((kr)^{-1})$ two-helicity aberration split $\Delta\theta_\pm = 8|\cot\iota|/(kr)$.
- `test_02_spectral_matrix.py` — **Question 2:** Unitary helicity blocks $(\mathbf{S}_{++}, \mathbf{S}_{--}, \mathbf{S}_{+-})$, closed-form $K = 5$ $(\mathbf{S}_I, \mathbf{S}_V)$ Hermitian pencil recovery, and Householder QR Jacobian identifiability sweep ($K_{\max} = 8$ unpolarized GW vs. $K_{\max} = 2$ light circle defect; $K_{\max} = 9$ partially polarized GW with $K=10$ spin-4 bottleneck `rank = 58 < 60`; $K_{\max} = 13$ pure binaries).
- `test_03_arrays.py` — **Question 3:** Full Kruskal rank $5N$ (`5N - 1` MUSIC resolution) for collinear, planar, and 3D $N$-pixel arrays, $\cos^8(\vartheta/2)$ overlap law, and $D = 100\lambda$ two-pixel Capon MVDR grating-lobe suppression.
- `test_04_crlb.py` — **Question 4:** Exact Fisher Information Matrices and Cramér–Rao bounds for single-wave direction ($\sigma_\theta = 1/\rho$ vs. EM $\sqrt{2}/\rho$), $8\times 8$ static-scene speedometer, $7\times 7$ near-field moving-mass ranging (`Eq. 36` light-time crossover $cT = 2\sqrt{3}\,r$), and $7\times 7$ full-cycle binary ranging.
- `test_05_beyond_gr.py` — **Question 5:** Universal metric plane-wave identity $\mathcal{B} = (c/v_p)[\hat{k}]_\times\mathcal{E}$, single-reading inversion of $14$ numbers $(\mathcal{E}, \mathcal{B}) \mapsto (\hat{k}, v_p/c, 6\text{ ELL modes}, 5\text{ null checks})$, and Fierz–Pauli massive graviton ($\mathcal{E}_l/\mathcal{E}_b = -2(1-n^2)$) vs. Brans–Dicke scalar mode ($\mathcal{E}_l/\mathcal{E}_b = +(1-n^2)$).
- `test_06_affordances.py` — **Question 6:** Fourth-order cumulant sky ranks ($81$ GW vs. $25$ EM), icosahedron 5-design contrast $\sqrt{2/75}$ and rank-$12$ FOOBI independence, $0.9c$ Penrose $4$-PND velocity midpoint, depth-independent binary shear zeros $y_* = \pm d/2$, and Gauss–Legendre proof of external $\mathcal{B} \equiv 0$ for steady poloidal internal mass flows.
