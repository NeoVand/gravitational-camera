# What a Spin-2 Pixel Can Do That Light Cannot: Exact Algebra, Estimation Bounds, Arrays, and Beyond-GR Physics

**Response to:** *A brief for a second mind: what a spin-2 pixel can do that light cannot*  
**Authors addressed:** Mostafa ‘Neo’ Mohsenvand and co-author  

---

## 0. Conventions and Established Baseline

Throughout this document we adhere strictly to the brief’s conventions:
- **Metric signature and coordinates:** $(-+++)$, $x^0 = ct$, $x^i$, Levi-Civita symbol $\epsilon_{123} = +1$.
- **Electric and magnetic tidal tensors** (in $\mathrm{s}^{-2}$, linearized Riemann tensor $R_{\alpha\beta\gamma\delta} = \frac{1}{2}(\partial_\beta\partial_\gamma h_{\alpha\delta} + \partial_\alpha\partial_\delta h_{\beta\gamma} - \partial_\alpha\partial_\gamma h_{\beta\delta} - \partial_\beta\partial_\delta h_{\alpha\gamma})$):

$$
\mathcal{E}_{ij} = c^2 R_{0i0j}, \qquad \mathcal{B}_{ij} = \frac{1}{2} c^2 \epsilon_{ipq} R_{pqj0}.
$$

- **Vacuum complex Weyl matrix:** $W = \mathcal{E} + i\mathcal{B} \in \mathbb{C}^{3\times 3}$, symmetric ($W^T = W$) and trace-free ($\operatorname{tr} W = 0$) in General Relativity (GR) vacuum ($10$ real numbers).
- **Plane wave travelling along unit propagation vector $\hat{k}$** ($\hat{k} = -\hat{n}_{\mathrm{source}}$):

$$
W = c_0\,\mathbf{m}\mathbf{m}^T, \qquad \mathbf{m}\cdot\mathbf{m} = 0, \qquad \hat{k} = \frac{i\,\mathbf{m}\times\mathbf{m}^*}{|\mathbf{m}|^2},
$$

  where for any right-handed orthonormal triad $(\mathbf{e}_1, \mathbf{e}_2, \hat{k})$ with $\mathbf{e}_1 \times \mathbf{e}_2 = \hat{k}$, the unit-norm null vector is $\mathbf{m} = \frac{1}{\sqrt{2}}(\mathbf{e}_1 + i\mathbf{e}_2)$ ($|\mathbf{m}|^2 = \mathbf{m}^\dagger\mathbf{m} = 1$, $\|\mathbf{m}\mathbf{m}^T\|_F = 1$) and $c_0 = 2(\mathcal{E}_+ - i\mathcal{E}_\times)$.
- **Inside matter of density $\rho$, isotropic pressure $p$, and slow velocity $\mathbf{v}$:**

$$
\operatorname{tr}\mathcal{E} = 4\pi G\!\left(\rho + \frac{3p}{c^2}\right), \qquad \mathcal{B}_{[ij]} \equiv \frac{1}{2}(\mathcal{B}_{ij} - \mathcal{B}_{ji}) = -\frac{4\pi G}{c}\,\epsilon_{ijk}\,\rho v_k.
$$

We take Established Facts 1–8 of the brief as given without re-derivation (noting the corrected spin-1 electromagnetic spectral decomposition $2(3)^2 + 2(5) = 28$ sky numbers $+ 8$ null channels $= 36$, alongside spin-2 gravity’s $2(5)^2 + 2(9) = 68$ sky numbers $+ 32$ null channels $= 100$). Every result below carries its epistemic status (**Exact**, **Asymptotic to stated order**, or **Conjecture**), literature attribution, and a concrete numerical test verified to machine precision.

---

## 1. Question 1: Single-Pixel Wave Ranging, $C(\iota, \theta)$, and SNR Range Limits

### 1.1 Exact Sachs Peeling Matrix of a General Linearized Mass Quadrupole
**[Status: Exact within linearized multipole-truncated GR, Eq. (41) of draft; Sachs peeling structure known since Sachs 1961–1962 and Teukolsky 1982; singular-value ranging identity new]**

Place a compact source with symmetric trace-free (STF) mass quadrupole moment $Q_{ij}(u) = I_{ij}(u) - \frac{1}{3}\delta_{ij}I_{kk}(u)$ at the origin ($u = t - r/c$), and place the pixel at $\mathbf{x} = r\,\hat{k}$. Notice first that the oscillating part of the harmonic-gauge trace-reversed metric perturbation (Eq. 41 of the paper) admits a compact gauge-superpotential form in terms of $F_{ab}(\mathbf{x}, t) \equiv \frac{2G}{c^4 r}Q_{ab}(t - r/c)$:

$$
\bar{h}^{00}_{\mathrm{osc}} = c^2 \partial_a\partial_b F_{ab}, \qquad \bar{h}^{0i}_{\mathrm{osc}} = -c\,\partial_b\partial_0 F_{ib}, \qquad \bar{h}^{ij}_{\mathrm{osc}} = \partial_0^2 F_{ij},
$$

which satisfies $\partial_\mu \bar{h}^{\mu\nu}_{\mathrm{osc}} = 0$ and $\Box F_{ab} = 0$ identically for $r > 0$.

Now form the $3\times 3$ matrix $U \equiv [\mathbf{m}, \, \mathbf{m}^*, \, \hat{k}] \in \mathbb{C}^{3\times 3}$. Because $\mathbf{m}^\dagger\mathbf{m} = 1$, $\mathbf{m}^\dagger\mathbf{m}^* = \mathbf{m}^*\cdot\mathbf{m}^* = 0$, and $\mathbf{m}^\dagger\hat{k} = 0$, **$U$ is an exact $3\times 3$ unitary matrix** ($U^\dagger U = \mathbf{I}_3$). By unitary invariance of singular values, $W(r, u) = \mathcal{E}(r, u) + i\mathcal{B}(r, u)$ has the exact same singular values $s_1 \ge s_2 \ge s_3 \ge 0$ as the complex symmetric matrix $\widehat{W} \equiv U^\dagger W U^*$. Computing all derivatives of Eq. (41) through $r^{-5}$ yields the **exact five-zone peeling form**:

$$
\widehat{W}(r, u) = U^\dagger W(r, u)\,U^* = \begin{pmatrix}
\alpha & -\gamma & \beta \\
-\gamma & \delta_5 & \epsilon_4 \\
\beta & \epsilon_4 & 2\gamma
\end{pmatrix},
$$

where $Q^{(n)} \equiv \mathrm{d}^n Q / \mathrm{d}u^n$, $Q_{\mathbf{u}\mathbf{v}} \equiv u_i Q_{ij} v_j$, and the five complex entries are **exact** polynomials in $1/r$:

$$
\begin{aligned}
\alpha &= -\frac{G}{c^6 r}\!\left(2 Q^{(4)}_{\mathbf{m}^*\mathbf{m}^*} + \frac{4c}{r}Q^{(3)}_{\mathbf{m}^*\mathbf{m}^*} + \frac{6c^2}{r^2}Q^{(2)}_{\mathbf{m}^*\mathbf{m}^*} + \frac{6c^3}{r^3}Q^{(1)}_{\mathbf{m}^*\mathbf{m}^*} + \frac{3c^4}{r^4}Q_{\mathbf{m}^*\mathbf{m}^*}\right), \\
\beta &= +\frac{G}{c^5 r^2}\!\left(4 Q^{(3)}_{\mathbf{m}^*\hat{k}} + \frac{12c}{r}Q^{(2)}_{\mathbf{m}^*\hat{k}} + \frac{18c^2}{r^2}Q^{(1)}_{\mathbf{m}^*\hat{k}} + \frac{12c^3}{r^3}Q_{\mathbf{m}^*\hat{k}}\right), \\
\gamma &= -\frac{G}{c^4 r^3}\!\left(3 Q^{(2)}_{\hat{k}\hat{k}} + \frac{9c}{r}Q^{(1)}_{\hat{k}\hat{k}} + \frac{9c^2}{r^2}Q_{\hat{k}\hat{k}}\right), \\
\epsilon_4 &= +\frac{G}{c^3 r^4}\!\left(6 Q^{(1)}_{\mathbf{m}\hat{k}} + \frac{12c}{r}Q_{\mathbf{m}\hat{k}}\right), \qquad
\delta_5 = -\frac{3G}{c^2 r^5}\,Q_{\mathbf{m}\mathbf{m}}.
\end{aligned}
$$

*(Notice the chiral selection rule: the anti-holomorphic basis sectors $\mathbf{m}\hat{k}$ and $\mathbf{m}\mathbf{m}$ remain identically zero until $r^{-4}$ and $r^{-5}$, respectively!)*

### 1.2 Universal General-Quadrupole Ranging Law
**[Status: Asymptotic, exact at leading order $\mathcal{O}((kr)^{-2})$]**

Inspect the $2\times 2$ minors of $\widehat{W}$:
- Even though $\beta = \mathcal{O}(r^{-2})$ enters one power of $kr$ earlier than $\gamma = \mathcal{O}(r^{-3})$, the submatrix on rows/columns $(1, 3)$ at order $r^{-2}$, $\begin{pmatrix}\alpha_1/r & \beta_2/r^2 \\ \beta_2/r^2 & 0\end{pmatrix}$, has determinant $-\beta_2^2 / r^4 = \mathcal{O}(r^{-4})$, which competes directly with $2\alpha_1\gamma_3 / r^4 = \mathcal{O}(r^{-4})$!
- Every other $2\times 2$ minor of $\widehat{W}$ is $\mathcal{O}(r^{-5})$ or $\mathcal{O}(r^{-6})$, and $\det\widehat{W} = -2\alpha_1\gamma_3^2 r^{-7} + \dots = \mathcal{O}(r^{-5})$ at most ($s_3/s_1 = \mathcal{O}((kr)^{-4})$).

By Cauchy–Binet ($s_1^2 s_2^2 + s_2^2 s_3^2 + s_3^2 s_1^2 = \|\operatorname{adj}\widehat{W}\|_F^2$) and $s_1 = |\alpha_1|/r + \mathcal{O}(r^{-2})$, **for any time-dependent quadrupole $Q_{ij}(u)$ whatsoever** (monochromatic, eccentric, chirping, or bursting), whenever $Q^{(4)}_{\mathbf{m}^*\mathbf{m}^*}(u) \neq 0$:

$$
\frac{s_2}{s_1} = \frac{|2\alpha_1\gamma_3 - \beta_2^2|}{|\alpha_1|^2} + \mathcal{O}\!\left(\frac{c^3}{\omega^3 r^3}\right) = \frac{c^2}{r^2}\,\frac{\left|3\,Q^{(4)}_{\mathbf{m}^*\mathbf{m}^*}(u)\,Q^{(2)}_{\hat{k}\hat{k}}(u) - 4\,\bigl[Q^{(3)}_{\mathbf{m}^*\hat{k}}(u)\bigr]^2\right|}{\left|Q^{(4)}_{\mathbf{m}^*\mathbf{m}^*}(u)\right|^2} + \mathcal{O}\!\left((kr)^{-3}\right).
$$

*(Note that this ratio is invariant under rotating $(\mathbf{e}_1, \mathbf{e}_2)$ about $\hat{k}$ by $\psi$, since $\mathbf{m}^* \mapsto e^{i\psi}\mathbf{m}^*$ multiplies both terms in the numerator and $Q^{(4)}_{\mathbf{m}^*\mathbf{m}^*}$ by $e^{2i\psi}$.)*

### 1.3 Closed-Form $C(\iota, \theta)$ for a Rotating Mass Quadrupole (and Linear Oscillator)
**[Status: Exact asymptotic coefficient of $(kr)^{-2}$]**

Consider two equal masses $m$ at separation $d$ turning anticlockwise in the $xy$-plane at orbital angular speed $\Omega$ (wave angular frequency $\omega = 2\Omega$, wavenumber $k = \omega/c$, $\Delta I = \frac{1}{2}md^2$), with oscillating quadrupole $I^{\mathrm{osc}}_{xx} = -I^{\mathrm{osc}}_{yy} = \frac{1}{2}\Delta I\cos\theta$, $I^{\mathrm{osc}}_{xy} = \frac{1}{2}\Delta I\sin\theta$, where **$\theta \equiv \omega u = 2\Omega(t - r/c) = 2\varphi$** is the retarded wave phase ($\varphi = \Omega u$ being the rotor’s physical azimuth from the $x$-axis). Place the observer in the $xz$-meridian plane at inclination $\iota \in [0, \pi]$ from the spin axis $+\hat{z}$, so $\hat{k} = (\sin\iota, 0, \cos\iota)$, $\mathbf{e}_1 = (\cos\iota, 0, -\sin\iota)$, $\mathbf{e}_2 = (0, 1, 0)$.

Projecting $Q^{(4)} = \omega^4 Q$, $Q^{(3)} = -\omega^3 \dot{Q}/\omega$, and $Q^{(2)} = -\omega^2 Q$ onto $(\mathbf{m}^*, \hat{k})$ gives (up to common scale $\frac{1}{2}\Delta I$):
- $Q^{(4)}_{\mathbf{m}^*\mathbf{m}^*} = \frac{1}{2}\omega^4\bigl[(1 + \cos^2\iota)\cos\theta - 2i\cos\iota\sin\theta\bigr]$,
- $Q^{(3)}_{\mathbf{m}^*\hat{k}} = \frac{1}{\sqrt{2}}\omega^3\sin\iota\bigl(\cos\iota\sin\theta + i\cos\theta\bigr)$,
- $Q^{(2)}_{\hat{k}\hat{k}} = -\omega^2\sin^2\iota\cos\theta$.

Substituting into the general formula yields the **exact ranging constant $C(\iota, \theta)$** in $\dfrac{s_2}{s_1} = \dfrac{C(\iota, \theta)}{(kr)^2} + \mathcal{O}\!\left((kr)^{-3}\right)$:

$$
\boxed{C(\iota, \theta) = \frac{2\sin^2\iota\,\sqrt{\bigl[(1 - 3\cos^2\iota)\cos^2\theta - 4\cos^2\iota\sin^2\theta\bigr]^2 + 4\cos^2\iota\sin^2\theta\cos^2\theta}}{(1 + \cos^2\iota)^2\cos^2\theta + 4\cos^2\iota\sin^2\theta}} \qquad (\theta = \omega u = 2\varphi).
$$

**Notable special regimes of $C(\iota, \theta)$:**
1. **Aligned with meridian ($\theta = 0, \pi$, i.e. $\varphi = 0, \frac{\pi}{2}$):**

   $$
   C(\iota, 0) = \frac{2\sin^2\iota\,|1 - 3\cos^2\iota|}{(1 + \cos^2\iota)^2},
   $$

   giving rational benchmarks $C(30^\circ, 0) = \frac{10}{49}$, $C(45^\circ, 0) = \frac{2}{9}$, $C(60^\circ, 0) = \frac{6}{25}$, $C(90^\circ, 0) = 2$, and vanishing at the magic angle $\cos^2\iota = \frac{1}{3}$ ($\iota \approx 54.7356^\circ$), where $s_2/s_1 = \frac{3\sqrt{3}}{(kr)^3} + \mathcal{O}((kr)^{-4})$.
2. **Quarter-wave phase ($\theta = \pm\frac{\pi}{2}$, i.e. $\varphi = \pm\frac{\pi}{4}$):** $C(\iota, \frac{\pi}{2}) = 2\sin^2\iota$ for all $0 \le \iota < \frac{\pi}{2}$ (at $\iota = \frac{\pi}{2}, \theta = \frac{\pi}{2}$, the linearly polarized $1/r$ wave passes through an instantaneous node $W_1 = 0$).
3. **Edge-on ($\iota = \frac{\pi}{2}$, $\cos\theta \neq 0$):** $C(\frac{\pi}{2}, \theta) = 2$ identically at *every* non-nodal phase!
4. **Face-on along the spin axis ($\iota = 0$ or $\pi$):** $C(0, \theta) \equiv 0$ for all $\theta$, because $Q_{\hat{k}\hat{k}} = Q_{\mathbf{m}^*\hat{k}} = 0$. The matrix $\widehat{W}$ retains only $\alpha$ and $\delta_5$, so $s_3 = 0$ identically and $s_2/s_1$ drops to fourth order:

   $$
   \left.\frac{s_2}{s_1}\right|_{\iota = 0, \pi} = \frac{3}{2\,(kr)^4}\left[1 + \frac{1}{(kr)^2} + \mathcal{O}\!\left((kr)^{-4}\right)\right] \qquad (\text{independent of }\theta).
   $$

5. **Comparison — 1D linearly oscillating quadrupole** $Q(u) = Q_0\cos\theta\,\mathrm{diag}(-1, -1, 2)$ at angle $\iota$ to $\hat{k}$:

   $$
   C_{\mathrm{lin}}(\iota, \theta) = \frac{2}{\sin^2\iota}\,\bigl|(3\cos^2\iota - 1) + 4\cos^2\iota\tan^2\theta\bigr|.
   $$

### 1.4 Two Frequency-Domain Surprises: Inclination-Free SVD Ranging and an $\mathcal{O}((kr)^{-1})$ Shortcut!
**[Status: Exact asymptotic identities, verified numerically]**

Over one or more cycles of a monochromatic circular binary, decompose the complex time series $W(t) = \mathcal{E}(t) + i\mathcal{B}(t) = W_+(\omega)e^{-i\omega t} + W_-(\omega)e^{+i\omega t}$ into its positive- and negative-frequency $3\times 3$ complex matrices:

1. **Fourier SVD invariants (`rank` departure at $\mathcal{O}((kr)^{-2})$):** Evaluating our general formula on the pure exponential modes $e^{\mp i\omega u}$ collapses all phase dependence into Möbius powers of $\tan(\iota/2)$:

   $$
   \frac{s_2\bigl(W_+(\omega)\bigr)}{s_1\bigl(W_+(\omega)\bigr)} = \frac{2\tan^2(\iota/2)}{(kr)^2}, \qquad \frac{s_2\bigl(W_-(\omega)\bigr)}{s_1\bigl(W_-(\omega)\bigr)} = \frac{2\cot^2(\iota/2)}{(kr)^2}.
   $$

   Since $s_1(W_+) \propto (1+\cos\iota)^2/r$ and $s_1(W_-) \propto (1-\cos\iota)^2/r$ (whose ratio already gives $\tan^4(\iota/2) = s_1(W_-)/s_1(W_+)$), **both second singular values are equal**, $s_2(W_+) = s_2(W_-) + \mathcal{O}((kr)^{-4})$, and $\iota$ cancels identically:

   $$
   kr = \sqrt{\frac{2\,\sqrt{s_1(W_+)\,s_1(W_-)}}{s_2(W_+)}} + \mathcal{O}\!\left((kr)^{-1}\right).
   $$

2. **First-order $\mathcal{O}((kr)^{-1})$ two-helicity aberration ranging (beating $(kr)^{-2}$ over a cycle!):** Why did $s_2/s_1$ start at $(kr)^{-2}$ instead of $(kr)^{-1}$ at a single snapshot? Because at one instant $t_0$, the $\mathcal{O}((kr)^{-1})$ longitudinal-transverse term $\beta_2 r^{-2}(\mathbf{m}\hat{k}^T + \hat{k}\mathbf{m}^T)$ merely tilts the apparent null vector $\mathbf{m} \mapsto \mathbf{m} + (\beta_2/\alpha_1 r)\hat{k}$, which is indistinguishable at one instant from tilting the unknown sky direction $\hat{k}$.
   **Across a cycle ($0 < \iota < \pi/2$), however, $\beta_2/\alpha_1$ tilts $W_+(\omega)$ and $W_-(\omega)$ by *different* amounts along the spin-projection axis $\mathbf{e}_1$:**

   $$
   \hat{k}_+ = \hat{k} - \frac{4\tan(\iota/2)}{kr}\,\mathbf{e}_1 + \mathcal{O}\!\left((kr)^{-2}\right), \qquad \hat{k}_- = \hat{k} - \frac{4\cot(\iota/2)}{kr}\,\mathbf{e}_1 + \mathcal{O}\!\left((kr)^{-2}\right),
   $$

   where $\hat{k}_\pm$ are the unit propagation directions extracted from the rank-1 parts of $W_\pm(\omega)$. Subtracting them cancels the unknown true direction $\hat{k}$ and measures $kr$ at **first order in $(kr)^{-1}$**:

   $$
   \boxed{\Delta\theta_\pm \equiv \arccos(\hat{k}_+ \cdot \hat{k}_-) = \frac{4\bigl|\cot(\iota/2) - \tan(\iota/2)\bigr|}{kr} = \frac{8\,|\cot\iota|}{kr} + \mathcal{O}\!\left((kr)^{-3}\right)} \qquad (0 < \iota < \pi,\;\iota \neq \tfrac{\pi}{2}).
   $$

### 1.5 Resulting Range Limits Against Signal-to-Noise Ratio
**[Status: Asymptotic high-SNR limit, verified by Fisher matrix and Monte Carlo]**

Let the pixel have isotropic white Gaussian noise of variance $\sigma^2$ on each of the $10$ orthonormal real STF components of $(\mathcal{E}, \mathcal{B})$, and define the total Weyl signal-to-noise ratio $\rho \equiv \|W\|_F / \sigma = \sqrt{2}\,\mathrm{SNR}_{\mathcal{E}}$ (for one reading, or matched-filtered over duration $T$):
- **Single-reading (or edge-on $\iota = \pi/2$) SVD range limit:** Along the $s_2$ singular mode ($\hat{k}\hat{k}^T$, aligned with STF basis element $\frac{1}{\sqrt{6}}\mathrm{diag}(-1,-1,2)$), only the in-phase real noise projection shifts $s_2$ to first order, giving $\sigma(s_2/s_1) = \sqrt{\frac{2}{3}}\,\rho^{-1}$. Since $\frac{\delta r}{r} = \frac{1}{2}\frac{\delta(s_2/s_1)}{s_2/s_1}$, the fractional error and $1\sigma$ maximum range ($s_2/s_1 = \sigma(s_2/s_1)$) are:

  $$
  \left(\frac{\sigma_r}{r}\right)_{\!\mathrm{SVD}} = \frac{(kr)^2}{\sqrt{6}\,C(\iota, \theta)\,\rho}, \qquad (kr)_{\max}^{\mathrm{SVD}} = \left(\frac{3}{2}\right)^{\!1/4}\sqrt{C(\iota, \theta)\,\rho} \simeq 1.107\,\sqrt{C(\iota, \theta)\,\rho},
  $$

  i.e., $r_{\max}^{\mathrm{SVD}} \simeq 0.176\,\lambda\,\sqrt{C(\iota, \theta)\,\rho}$.
- **Multi-cycle two-helicity range limit ($0 < \iota < \pi/2$):** Jointly estimating all $7$ binary parameters $(\ln r, \theta_1, \theta_2, \ln \mathcal{A}_{\mathrm{rec}}, \iota, \psi, \phi_0)$ over a cycle (with $\mathcal{A}_{\mathrm{rec}} \propto \Delta I/r$ absorbing the unknown $1/r$ amplitude) exploits $\Delta\theta_\pm = 8|\cot\iota|/(kr)$ to reach a **linear-in-$\rho$** maximum range:

  $$
  \left(\frac{\sigma_r}{r}\right)_{\!\mathrm{cycle}} = g(\iota)\,\frac{kr}{\rho}, \qquad (kr)_{\max}^{\mathrm{cycle}} = \frac{\rho}{g(\iota)},
  $$

  where numerically $g(30^\circ) = 14.00$, $g(45^\circ) = 4.25$, $g(60^\circ) = 1.97$ (reverting at $\iota = 90^\circ$, where $\cot\iota = 0$, to $\frac{\sigma_r}{r} = 0.106\,\frac{(kr)^2}{\rho}$).

> [!TIP]
> **Runnable Numerical Test — Question 1**
> - **Inputs:** Set $G = c = \omega = k = 1$. Rotating quadrupole $I^{\mathrm{osc}}_{xx} = -I^{\mathrm{osc}}_{yy} = \cos u$, $I^{\mathrm{osc}}_{xy} = \sin u$ ($\Delta I = 2$). Observer at inclination $\iota = 60^\circ$, distance $r = 200$ ($\mathbf{x} = (100\sqrt{3}, \, 0, \, 100)$).
> - **Outputs at $u = 0$ ($\theta = 0$):** Evaluating Eq. (41) gives singular values of $W = \mathcal{E} + i\mathcal{B}$: $s_1 = 6.24994141\times 10^{-3}$, $s_2 = 3.7686426\times 10^{-8}$, $s_3 = 1.5\times 10^{-13}$, so $(kr)^2 s_2/s_1 = \mathbf{0.24119538}$, converging to $C(60^\circ, 0) = \mathbf{6/25 = 0.24000000}$ as $kr \to \infty$ (at $kr = 1000$: $\mathbf{0.24004794}$).
> - **Outputs across one cycle ($u = 0$ and $u = \pi/2$, $kr = 400$, $\iota = 60^\circ$):** Forming $W_\pm = \frac{1}{2}[W(0) \pm i W(\pi/2)]$ gives $(kr)^2 s_2(W_+)/s_1(W_+) = \mathbf{0.666678}$ (exact $2\tan^2 30^\circ = \mathbf{2/3}$), $(kr)^2 s_2(W_-)/s_1(W_-) = \mathbf{6.00008}$ (exact $2\cot^2 30^\circ = \mathbf{6}$), inclination-free range $\bigl[2\sqrt{s_1(W_+)s_1(W_-)}/s_2(W_+)\bigr]^{1/2} = \mathbf{399.997}$ (true $kr = 400$), and two-helicity direction split $(kr)\arccos(\hat{k}_+\cdot\hat{k}_-) = \mathbf{4.61877}$ (exact $8\cot 60^\circ = 8/\sqrt{3} = \mathbf{4.61880}$).

---

## 2. Question 2: Second-Order Statistics of the $10\times 10$ Spectral Matrix and Helicity Sector Gain

### 2.1 Unitary Chiral Block Decomposition of the $10\times 10$ Spectral Matrix
**[Status: Exact]**

Choose an orthonormal basis $\{\mathbf{T}_A\}_{A=1}^5$ of real $3\times 3$ STF symmetric matrices ($\operatorname{tr}(\mathbf{T}_A\mathbf{T}_B) = \delta_{AB}$), and map the positive-frequency Fourier transforms $(\tilde{\mathcal{E}}(\omega), \tilde{\mathcal{B}}(\omega)) \in \mathbb{C}^5 \oplus \mathbb{C}^5$ to the unitary **helicity basis**:

$$
\tilde{\mathbf{z}}(\omega) \equiv \begin{pmatrix} \tilde{\mathbf{w}}_+(\omega) \\ \tilde{\mathbf{w}}_-(\omega) \end{pmatrix} = \frac{1}{\sqrt{2}}\begin{pmatrix} \tilde{\mathcal{E}}(\omega) + i\,\tilde{\mathcal{B}}(\omega) \\ \tilde{\mathcal{E}}(\omega) - i\,\tilde{\mathcal{B}}(\omega) \end{pmatrix} \in \mathbb{C}^{10}.
$$

For a plane wave propagating along $\hat{k}$ with Stokes spectral densities $(I, Q, U, V)$ at $\omega > 0$, define the unit-norm spin-$2$ steering vector $q_A(\hat{k}) \equiv \operatorname{tr}[\mathbf{T}_A\,\mathbf{m}(\hat{k})\mathbf{m}(\hat{k})^T] \in \mathbb{C}^5$ ($\|\mathbf{q}(\hat{k})\|_2 = 1$). Because $\mathbf{T}_A$ is real, $\mathbf{m}^*(\hat{k})\mathbf{m}^*(\hat{k})^T$ has coordinate vector $\mathbf{q}^*(\hat{k})$. Summing $K$ uncorrelated stationary point sources plus isotropic white sensor noise of spectral power $\sigma^2$ decomposes the $10\times 10$ spectral matrix $\mathbf{S}_{\mathrm{hel}}(\omega) = \langle \tilde{\mathbf{z}}(\omega)\tilde{\mathbf{z}}^\dagger(\omega)\rangle$ into **three exact $5\times 5$ blocks**:

$$
\mathbf{S}_{\mathrm{hel}}(\omega) = \begin{pmatrix} \mathbf{S}_{++}(\omega) & \mathbf{S}_{+-}(\omega) \\ \mathbf{S}_{+-}^\dagger(\omega) & \mathbf{S}_{--}(\omega) \end{pmatrix} + \sigma^2 \mathbf{I}_{10},
$$

where

$$
\begin{aligned}
\mathbf{S}_{++}(\omega) &= \frac{1}{2}\sum_{a=1}^K (I_a + V_a)\,\mathbf{q}(\hat{k}_a)\,\mathbf{q}(\hat{k}_a)^\dagger \qquad (\text{Hermitian } 5\times 5:\; 25\text{ real numbers}), \\
\mathbf{S}_{--}(\omega) &= \frac{1}{2}\sum_{a=1}^K (I_a - V_a)\,\mathbf{q}^*(\hat{k}_a)\,\mathbf{q}(\hat{k}_a)^T \qquad (\text{Hermitian } 5\times 5:\; 25\text{ real numbers}), \\
\mathbf{S}_{+-}(\omega) &= \frac{1}{2}\sum_{a=1}^K (Q_a - i U_a)\,\mathbf{q}(\hat{k}_a)\,\mathbf{q}(\hat{k}_a)^T \qquad (\text{Complex symmetric } 5\times 5:\; 18\text{ real sky numbers}).
\end{aligned}
$$

*(This provides a one-line structural proof of Established Fact 4: $\mathbf{S}_I \equiv \mathbf{S}_{++} + \mathbf{S}_{--}^* = \sum_a I_a \mathbf{q}_a\mathbf{q}_a^\dagger$ and $\mathbf{S}_V \equiv \mathbf{S}_{++} - \mathbf{S}_{--}^* = \sum_a V_a \mathbf{q}_a\mathbf{q}_a^\dagger$ decouple $I$ and $V$ completely; the $32$ exact GR null vetoes consist of $20$ real numbers in $\mathbf{S}_{+-} - \mathbf{S}_{+-}^T = \mathbf{0}$ plus $12$ real numbers annihilating the spin-$4$ rank-1 null quadric inside $\mathrm{Sym}^2(\mathbb{C}^5)$.)*

### 2.2 How Many Sources $K$ Can One Pixel Resolve, and What Is the Helicity Gain?
**[Status: Subspace bounds and $K=5$ pencil are Exact; local parameter-identifiability ranks verified via exact Householder QR of the Jacobian across all $K$]**

Yes — separating the two helicity sectors yields **four distinct mathematical gains** over raw $10\times 10$ subspace processing:

1. **Gain 1 — Rank-2 to Rank-1 collapse for unpolarized/partially polarized MUSIC ($K \le 4$):** In the raw $(\tilde{\mathcal{E}}, \tilde{\mathcal{B}}) \in \mathbb{C}^{10}$ basis, an unpolarized source excites two orthogonal random amplitudes, contributing a **rank-2** matrix without a fixed 1D steering vector. Forming the $5\times 5$ matrix $\mathbf{S}_I = \mathbf{S}_{++} + \mathbf{S}_{--}^*$ collapses *every* source (regardless of polarization!) to **rank $1$** with known 1D steering vector $\mathbf{q}(\hat{k}) \in \mathbb{C}^5$. Standard 1D MUSIC on $\mathbf{S}_I$ ($P_{\mathrm{MUSIC}}(\hat{k}) = \|\mathbf{E}_N^\dagger \mathbf{q}(\hat{k})\|_2^{-2}$, where $\mathbf{E}_N \in \mathbb{C}^{5\times (5-K)}$ is the noise eigenspace of $\mathbf{S}_I - \sigma^2\mathbf{I}_5$) resolves **$K \le 4$** sources of arbitrary polarization by a simple 2D scan over $S^2$.
2. **Gain 2 — Doubling MUSIC capacity for opposite-chirality sources ($K = 4 + 4 = 8$):** Sources with $V_a = +I_a$ (face-on binaries, $\iota_a = 0$) populate *only* $\mathbf{S}_{++}$, while sources with $V_b = -I_b$ ($\iota_b = \pi$) populate *only* $\mathbf{S}_{--}$. Running 1D MUSIC independently on $\mathbf{S}_{++}$ and $\mathbf{S}_{--}^*$ resolves up to **$8$ circularly polarized sources** ($4$ right-handed $+ 4$ left-handed; vs. $2 + 2 = 4$ for spin-1 light).
3. **Gain 3 — Closed-Form $K = 5$ Algebraic Pencil via Distinct Circular Fractions $V_a/I_a$:** At $K = 5$, $\mathbf{S}_I \in \mathbb{C}^{5\times 5}$ has **zero** noise subspace, so ordinary MUSIC fails completely. Yet whenever the $5$ sources have distinct circular-polarization fractions $v_a = V_a/I_a$ (generic for $5$ binaries at random inclinations $\iota_a$, where $v_a = \frac{4\cos\iota_a(1+\cos^2\iota_a)}{1+6\cos^2\iota_a+\cos^4\iota_a}$), subtracting sensor noise $\sigma^2\mathbf{I}_5$ (known from the $32$ null channels!) gives two full-rank $5\times 5$ Hermitian matrices sharing the **exact same $5$ rank-1 outer products**:

   $$
   \mathbf{S}_I = \mathbf{Q}\,\mathrm{diag}(I_1,\dots,I_5)\,\mathbf{Q}^\dagger, \qquad \mathbf{S}_V = \mathbf{Q}\,\mathrm{diag}(V_1,\dots,V_5)\,\mathbf{Q}^\dagger, \qquad \mathbf{Q} = [\mathbf{q}(\hat{k}_1),\dots,\mathbf{q}(\hat{k}_5)] \in \mathbb{C}^{5\times 5}.
   $$

   **Closed-form $K=5$ algorithm (zero sky search, zero matrix inversion):**
   - Diagonalize $\mathbf{S}_I = \mathbf{V}_I \mathbf{D}_I \mathbf{V}_I^\dagger$, set $\mathbf{W}_h = \mathbf{V}_I \mathbf{D}_I^{-1/2}$, and diagonalize the Hermitian matrix $\mathbf{W}_h^\dagger \mathbf{S}_V \mathbf{W}_h = \mathbf{V}_A\,\mathrm{diag}(\lambda_1,\dots,\lambda_5)\,\mathbf{V}_A^\dagger$.
   - The eigenvalues $\lambda_a = V_a / I_a$ directly return all $5$ circular-polarization ratios!
   - Form $\mathbf{C} = \mathbf{S}_I \mathbf{W}_h \mathbf{V}_A \in \mathbb{C}^{5\times 5}$. Its $a$-th column equals $e^{i\alpha_a}\sqrt{I_a}\,\mathbf{q}(\hat{k}_a)$: its squared norm gives $I_a = \|\mathbf{c}_a\|_2^2$, and reshaping $\mathbf{c}_a$ to a $3\times 3$ rank-1 matrix $W_a = \sum_A c_{a,A}\mathbf{T}_A \propto \mathbf{m}_a\mathbf{m}_a^T$ reads off $\hat{k}_a = i(\mathbf{m}_a\times\mathbf{m}_a^*)/|\mathbf{m}_a|^2$!
4. **Gain 4 — Polarized 10D MUSIC ($K \le 7$) and Nonlinear Covariance-Matching Limits ($K$ up to $8, 9, 12, 13$):**
   - **100% elliptically polarized uncorrelated sources** (e.g., $K$ binaries with independent phase wander in the same frequency bin, $5$ parameters per source: $\theta_a, \phi_a, I_a, \iota_a, \psi_a$): each source is **rank $1$ in the full $\mathbb{C}^{10}$** with steering vector $\mathbf{w}(\theta,\phi,\iota,\psi) = \bigl(\alpha(\iota)e^{-2i\psi}\mathbf{q}(\theta,\phi), \, \beta(\iota)e^{+2i\psi}\mathbf{q}^*(\theta,\phi)\bigr)^T$. A $(10 - K)$-dimensional noise subspace imposes $2(10 - K)$ real equations on the $4$-dimensional manifold $(\theta,\phi,\iota,\psi)$, so **10D Polarized MUSIC** uniquely isolates up to **$K = 7$** sources ($2(10-7) = 6 > 4$).
   - **Nonlinear Covariance Matching** ($\min_{\Theta} \|\hat{\mathbf{S}}(\omega) - \mathbf{S}(\Theta)\|_F^2$ via Gauss–Newton / Levenberg–Marquardt, initialized by grid-free spherical atomic-norm SDP or alternating projections) reaches the **exact local Jacobian identifiability limits** tabulated below:

| Source Class (Uncorrelated, Stationary) | Params / Source | Available Sky Numbers | Subspace / Algebraic $K_{\max}$ | Local Identifiability $K_{\max}$ (Exact QR Rank) | Spin-1 Light Identifiability $K_{\max}$ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Unpolarized** ($Q=U=V=0$) | $3$ $(\theta,\phi,I)$ | $25$ ($\mathbf{S}_I$) | **$4$** (1D MUSIC on $\mathbf{S}_I$) | **$8$** ($3\times 8 = 24 \le 25$, full rank $24$) | **$2$** *(defective at $K=3$: rank $8 < 9$!)* |
| **Circular / zero linear pol.** ($Q=U=0$) | $4$ $(\theta,\phi,I,V)$ | $50$ ($\mathbf{S}_{++}, \mathbf{S}_{--}$) | **$5$** ($\mathbf{S}_I,\mathbf{S}_V$ pencil); **$8$** if pure $R/L$ | **$12$** ($4\times 12 = 48 \le 50$, full rank $48$) | **$4$** ($4\times 4 = 16 \le 18$) |
| **Arbitrarily (partially) polarized** | $6$ $(\theta,\phi,I,Q,U,V)$ | $68$ (all blocks) | **$4$**–**$5$** | **$9$** full state ($6\times 9 = 54$); **$12$** for $(\hat{k},I,V)$* | **$4$** ($6\times 4 = 24 \le 28$) |
| **100% polarized** (e.g. binaries) | $5$ $(\theta,\phi,I,\iota,\psi)$ | $68$ (all blocks) | **$7$** (10D Polarized MUSIC) | **$13$** ($5\times 13 = 65 \le 68$, full rank $65$) | **$5$** ($5\times 5 = 25 \le 28$) |

*\*Algebraic bottleneck at $K \ge 10$ for general partially polarized sources (Exact):* At $K = 10$ ($6K = 60 \le 68$), the Jacobian rank drops from $60$ to **$58$** ($62$ at $K=11$, $66$ at $K=12$, $68$ at $K=13$), because $\mathbf{S}_{+-}$ lives in the **$18$-real-dimensional** ($\ell = 4$, spin-$\pm 4$) subspace! Once $K > 9$, $2K > 18$, so linear polarizations $(Q_a, U_a)$ acquire an exact $(2K - 18)$-dimensional nullspace even while $(\theta_a, \phi_a, I_a, V_a)$ remain locally identifiable up to $K = 12$. *(Note also the spin-1 light surprise in row 1: although unpolarized light has $9$ real sky numbers in $\mathbf{S}_I^{\mathrm{EM}}$ and $K=3$ sources have $3K = 9$ parameters, any $3$ points on $S^2$ lie on a circle where $\ell \le 2$ has only $5$ Fourier harmonics against $6$ in-circle parameters, dropping light’s Jacobian rank at $K=3$ to $8 < 9$!)*

> [!TIP]
> **Runnable Numerical Test — Question 2 ($K = 5$ Closed-Form Spectral Pencil)**
> - **Inputs:** Five uncorrelated inclined binaries with $(\theta_a, \phi_a, I_a, \iota_a)$ in radians:  
>   1: $(0.45, 0.30, 1.5, 0.25)$, 2: $(1.10, 1.50, 1.2, 0.70)$, 3: $(1.80, 2.80, 0.9, 1.20)$, 4: $(2.30, 4.10, 1.7, 2.00)$, 5: $(0.95, 5.20, 1.1, 2.65)$, with $V_a/I_a = \frac{4\cos\iota_a(1+\cos^2\iota_a)}{1+6\cos^2\iota_a+\cos^4\iota_a}$. Form $\mathbf{S}_{++}$ and $\mathbf{S}_{--}$.
> - **Outputs from $(\mathbf{S}_I, \mathbf{S}_V)$ pencil algorithm:** Eigenvalues $\lambda = \{\mathbf{+0.9999998}, \mathbf{+0.9993702}, \mathbf{+0.9084172}, \mathbf{-0.9438376}, \mathbf{-0.9999687}\}$ match all five true $V_a/I_a$ to **$1.0\times 10^{-15}$**; column norms $\|\mathbf{c}_a\|_2^2 = \{1.5, 1.2, 0.9, 1.7, 1.1\}$ match $I_a$ to **$7.0\times 10^{-13}$**; extracted unit vectors $\hat{k}_a$ match all five true sky positions with maximum angular error **$< 3\times 10^{-8}\text{ rad}$** (machine $\sqrt{\epsilon}$ of $\arccos$).

---

## 3. Question 3: Arrays of $N$ Spin-2 Pixels ($5N - 1$ Sources and Grating-Lobe Removal)

### 3.1 Resolving $5N - 1$ Sources with an $N$-Pixel Array
**[Status: Exact theorem for generic directions at any $N$ distinct pixel positions $\mathbf{x}_1, \dots, \mathbf{x}_N \in \mathbb{R}^3$; builds on vector-sensor array theory of Nehorai & Paldi 1994, Hochwald & Nehorai 1996, and Tan, Nehorai & Paldi 1996]**

At angular frequency $\omega = ck$, pixel $n$ at position $\mathbf{x}_n$ records the positive-helicity block $\tilde{\mathbf{w}}_{+,n}(\omega) = e^{i k \hat{k}\cdot\mathbf{x}_n} a_+(\omega)\,\mathbf{q}(\hat{k}) \in \mathbb{C}^5$. Stacking all $N$ pixels forms a $5N \times 5N$ Hermitian positive-helicity spectral matrix:

$$
\mathbf{S}_{++}^{\mathrm{array}}(\omega) = \frac{1}{2}\sum_{a=1}^K (I_a + V_a)\,\mathbf{v}_+(\hat{k}_a)\,\mathbf{v}_+(\hat{k}_a)^\dagger + \sigma^2 \mathbf{I}_{5N}, \qquad \mathbf{v}_+(\hat{k}) \equiv \frac{1}{\sqrt{N}}\,\mathbf{a}(\hat{k}) \otimes \mathbf{q}(\hat{k}) \in \mathbb{C}^{5N},
$$

with spatial steering vector $[\mathbf{a}(\hat{k})]_n = e^{i k \hat{k}\cdot\mathbf{x}_n}$ and $\|\mathbf{v}_+(\hat{k})\|_2 = 1$. *(Note a subtle difference from $N=1$: for a non-centrosymmetric array, $\mathbf{S}_{--}^{\mathrm{array}*}$ has $[\mathbf{a}^*(\hat{k})]_n = e^{-ik\hat{k}\cdot\mathbf{x}_n} = [\mathbf{a}(-\hat{k})]_n$, so one should NOT naively add $\mathbf{S}_{++}^{\mathrm{array}} + \mathbf{S}_{--}^{\mathrm{array}*}$ unless the array is centrosymmetric; instead, $\mathbf{S}_{++}^{\mathrm{array}}$ alone already sees every source with $I_a + V_a > 0$ as **rank $1$**, and in the full $10N \times 10N$ matrix each unpolarized source has rank $2$, giving $(10N - 2)/2 = 5N - 1$ simultaneously via 2D block-MUSIC $\det[\mathbf{V}^\dagger(\hat{k})\mathbf{E}_N\mathbf{E}_N^\dagger \mathbf{V}(\hat{k})] = 0$!)*

**Exact Full-Rank Proof (even for collinear sparse arrays):** Place $N$ distinct pixels along the $z$-axis at $z_1 < \dots < z_N$. Choose $N$ polar cones $\theta_1, \dots, \theta_N \in (0, \pi)$ with distinct $e^{ik z\cos\theta_r}$, and on each cone choose $5$ distinct azimuths $\phi_{r,1}, \dots, \phi_{r,5}$. Because $\mathbf{q}(\theta, \phi)$ decomposes into the $5$ spin-weight azimuthal harmonics $d^2_{2,m}(\theta)e^{im\phi}$ ($m = -2,-1,0,1,2$, all nonzero for $\theta \notin \{0,\pi\}$), the $5N \times 5N$ matrix $[\mathbf{v}_+(\hat{k}_{1,1}), \dots, \mathbf{v}_+(\hat{k}_{N,5})]$ factors as a block-Vandermonde product with nonzero determinant. By real-analyticity on $(S^2)^{5N}$, **any generic $K \le 5N$ steering vectors in $\mathbb{C}^{5N}$ are linearly independent for *any* geometry of $N$ distinct pixels (collinear, planar, or 3D, dense or $100\lambda$-sparse)!**
- **1D MUSIC on $\mathbf{S}_{++}^{\mathrm{array}}$ (or 2-rank MUSIC on $\mathbf{S}_{\mathrm{full}}^{\mathrm{array}}$):** Resolves **$5N - 1$** uncorrelated unpolarized or partially polarized sources (and eliminates the $360^\circ$ baseline-cone ambiguity of collinear scalar arrays even for $N = 2$!).
- **Opposite circular helicities ($\mathbf{S}_{++}^{\mathrm{array}}$ and $\mathbf{S}_{--}^{\mathrm{array}}$ separately):** Resolves up to **$2(5N - 1) = 10N - 2$** circularly polarized sources.
- **10D Polarized MUSIC on $\mathbf{S}_{\mathrm{full}}^{\mathrm{array}} \in \mathbb{C}^{10N \times 10N}$:** Resolves up to **$10N - 3$** $100\%$-polarized sources ($2(10N - K) > 4$).
- **Difference Co-Array on a Non-Redundant / Golomb Array:** $\binom{N}{2} + 1$ distinct vector lags $\mathbf{x}_m - \mathbf{x}_n$ carry $\mathcal{O}(N^2)$ independent equations, resolving **$\mathcal{O}(N^2)$** stationary sources.

### 3.2 Does Tensor Structure Remove Grating Lobes in Sparse Arrays?
**[Status: Exact identity; sharp distinction between linear delay-and-sum vs. Capon/MUSIC/ML]**

Compute the exact Hermitian inner product of $\mathbf{v}_+(\hat{k})$ and $\mathbf{v}_+(\hat{k}_0)$ separated on the sky by angle $\vartheta = \arccos(\hat{k}\cdot\hat{k}_0) \in [0, \pi]$. Because $|\mathbf{m}^*(\hat{k})\cdot\mathbf{m}(\hat{k}_0)| = \frac{1}{2}(1 + \cos\vartheta) = \cos^2(\vartheta/2)$, spin $s = 2$ squares this Wigner $d^1_{11}$ factor to $d^2_{22}(\vartheta) = \cos^4(\vartheta/2)$, giving for **any** $N$-pixel array:

$$
\boxed{\left|\langle \mathbf{v}_\pm(\hat{k}), \, \mathbf{v}_\pm(\hat{k}_0)\rangle\right|^2 = \cos^8\!\left(\frac{\vartheta}{2}\right)\,\left|\frac{1}{N}\sum_{n=1}^N e^{i k(\hat{k} - \hat{k}_0)\cdot\mathbf{x}_n}\right|^2} \qquad (\text{spin } s \ge 1:\; \cos^{4s}(\vartheta/2)).
$$

For **two pixels separated by $\mathbf{d} = D\hat{d}$ with $D \gg \lambda$**, the spatial factor is $\cos^2\!\left[\frac{\pi D}{\lambda}(\hat{k} - \hat{k}_0)\cdot\hat{d}\right]$, which equals $1$ on $\sim 2D/\lambda$ conical grating rings $(\hat{k} - \hat{k}_0)\cdot\hat{d} = m\frac{\lambda}{D}$ ($m \in \mathbb{Z}$) AND around the entire $m = 0$ azimuthal cone $\hat{k}\cdot\hat{d} = \hat{k}_0\cdot\hat{d}$. Two distinct regimes must be stated plainly:

1. **Linear Delay-and-Sum Beamforming (`Eq. 29` of draft) — Modulated, NOT Sidelobe-Free at $D \gg \lambda$:**  
   Linear beamforming multiplies the rapid Young fringes by the broad cardioid-power envelope $\cos^8(\vartheta/2)$ (FWHM $2\arccos(2^{-1/8}) = 65.9^\circ$; exact null at antipode $\vartheta = \pi$). While far-away grating lobes ($\vartheta \gtrsim 1\text{ rad}$) and back-lobes are strongly suppressed, **adjacent grating fringes at $\vartheta_m \approx \frac{|m|\lambda}{D\sin\alpha_0} \ll 1$ still have linear height $\cos^8(\vartheta_m/2) = 1 - \vartheta_m^2 + \mathcal{O}(\vartheta_m^4) \approx 1$**. Linear delay-and-sum of two pixels $100\lambda$ apart still looks like a comb of fringes inside a $66^\circ$ envelope.
2. **Subspace (MUSIC), Minimum-Variance (Capon MVDR), and Maximum-Likelihood Interferometry — Sidelobe-Free Above $\mathrm{SNR} \gtrsim D/\lambda$:**  
   Because $\cos^8(\vartheta/2) < 1$ **strictly for every $\hat{k} \neq \hat{k}_0$ on $S^2$**, **zero** algebraic grating-lobe ambiguities exist at infinite SNR (for any $D/\lambda$, MUSIC has a single spike at $\hat{k}_0$, and resolves up to $5(2) - 1 = 9$ sources without aliasing!). In additive noise with per-pixel-combined amplitude SNR $\rho_2 \equiv \sqrt{P}/\sigma$ ($\mathbf{S}_{++}^{\mathrm{array}} = P\mathbf{v}_0\mathbf{v}_0^\dagger + \sigma^2\mathbf{I}_{10}$), the **exact** Capon MVDR peak-to-grating-lobe ratio ($P_{\mathrm{Capon}}(\hat{k}) = [\mathbf{v}_+^\dagger (\mathbf{S}_{++}^{\mathrm{array}})^{-1}\mathbf{v}_+]^{-1}$) at the worst-case $m = \pm 1$ grating lobe ($\vartheta_1 \simeq \frac{\lambda}{D\sin\alpha_0}$, where $\alpha_0 = \arccos(\hat{k}_0\cdot\hat{d})$) is:

   $$
   \frac{P_{\mathrm{Capon}}(\hat{k}_0)}{P_{\mathrm{Capon}}(\hat{k}_{m=1})} = 1 + \rho_2^2\left[1 - \cos^8\!\left(\frac{\vartheta_1}{2}\right)\right] \simeq 1 + \left(\frac{\rho_2\,\lambda}{D\sin\alpha_0}\right)^{\!2}.
   $$

   *(Physical meaning: As soon as single-pixel directional precision $\sigma_\theta^{(1)} \sim \rho_2^{-1}$ becomes finer than the fringe spacing $\vartheta_1 \sim \lambda/D$ — i.e., **$\rho_2 \gtrsim \frac{D}{\lambda\sin\alpha_0}$** — the local spin-2 tensor selects the unique true fringe $m=0$ and suppresses all grating lobes, jumping straight to interferometric precision $\sigma_\theta^{(2)} \sim \frac{\lambda}{2\pi D\sin\alpha_0\,\rho_2}$ with zero intermediate pixels. A two-element scalar interferometer has $P(\hat{k}_0)/P(\hat{k}_{m=1}) \equiv 1$ at **all** SNRs.)*

> [!TIP]
> **Runnable Numerical Test — Question 3 (Two Pixels at $D = 100\lambda$)**
> - **Inputs:** Two pixels at $(\mp 50\lambda, 0, 0)$ along the $x$-axis ($D/\lambda = 100$). Source at $(\theta_0, \phi_0) = (1.1, 0.4)\text{ rad}$ ($k_{0x} = 0.820559$, baseline angle $\alpha_0 = 0.608387\text{ rad}$). Nearest $m = +1$ grating lobe in the $(\hat{e}_x, \hat{k}_0)$ plane has $k_{1x} = k_{0x} + 0.01 = 0.830559$ ($\alpha_1 = 0.590651\text{ rad}$, $\vartheta_1 = 0.0177361\text{ rad}$).
> - **Outputs:** $\|\mathbf{v}_+(\hat{k}_1)^\dagger \mathbf{v}_+(\hat{k}_0)\|^2 = \mathbf{0.9996854804}$ (matching $\cos^8(\vartheta_1/2) = \mathbf{0.9996854804}$ to $4\times 10^{-14}$). Capon main-to-($m=1$) ratio: at $\rho_2 = 10$, **$1.0315$ ($0.13\text{ dB}$)**; at $\rho_2 = 100$, **$4.1452$ ($6.18\text{ dB}$)**; at $\rho_2 = 500$, **$79.63$ ($19.01\text{ dB}$)**; at $\rho_2 = 1000$, **$315.52$ ($24.99\text{ dB}$)**. Also, $10$ random sources give complex QR rank **$\mathbf{10}$** in $\mathbb{C}^{10}$, confirming $5(2) - 1 = \mathbf{9}$ source resolution.

---

## 4. Question 4: Exact Cramér–Rao Bounds at One Pixel Against SNR

### 4.1 Noise Model and Definitions
**[Status: Exact]**

By Schur’s lemma on the irreducible $5$-dimensional $\ell = 2$ representation of $SO(3)$, any rotationally invariant Gaussian noise on a trace-free symmetric tensor has independent variance $\sigma_{\mathcal{E}}^2$ (resp. $\sigma_{\mathcal{B}}^2$) on each of its $5$ orthonormal STF coordinates ($\langle \delta\mathcal{E}_{ij}\delta\mathcal{E}_{kl}\rangle = \sigma_{\mathcal{E}}^2[\frac{1}{2}(\delta_{ik}\delta_{jl}+\delta_{il}\delta_{jk}) - \frac{1}{3}\delta_{ij}\delta_{kl}]$, $\langle\|\delta\mathcal{E}\|_F^2\rangle = 5\sigma_{\mathcal{E}}^2$). Setting $\sigma_{\mathcal{E}} = \sigma_{\mathcal{B}} = \sigma$ (for continuous white noise of one-sided PSD $S_0$ per STF channel, $\sum_t (\cdot)/\sigma^2 \to \frac{2}{S_0}\int_0^T (\cdot)\,\mathrm{d}t$), define:
- **Electric SNR:** $\mathrm{SNR}_{\mathcal{E}} \equiv \|\mathcal{E}\|_F / \sigma$, **Magnetic SNR:** $\mathrm{SNR}_{\mathcal{B}} \equiv \|\mathcal{B}\|_F / \sigma$,
- **Total Weyl SNR:** $\rho \equiv \sqrt{\mathrm{SNR}_{\mathcal{E}}^2 + \mathrm{SNR}_{\mathcal{B}}^2} = \|W\|_F / \sigma$ (so for any plane wave, $\|\mathcal{E}\|_F = \|\mathcal{B}\|_F \implies \rho = \sqrt{2}\,\mathrm{SNR}_{\mathcal{E}}$).

### 4.2 Direction of One Plane Wave
**[Status: Exact, both instantaneously (4 parameters) and over a multi-cycle wave train (6 parameters)]**

Parameterize sky perturbations around $\hat{k}$ by local orthonormal angles $(\theta_1, \theta_2)$ ($\delta\hat{k} = \delta\theta_1\mathbf{e}_1 + \delta\theta_2\mathbf{e}_2$). For $W = c_0\mathbf{m}(\hat{k})\mathbf{m}(\hat{k})^T$, differentiating $\delta\mathbf{m} = -\frac{1}{\sqrt{2}}(\delta\theta_1 + i\delta\theta_2)\hat{k}$ gives $\frac{\partial W}{\partial\theta_1} = -\frac{c_0}{\sqrt{2}}(\mathbf{m}\hat{k}^T + \hat{k}\mathbf{m}^T)$ and $\frac{\partial W}{\partial\theta_2} = i\frac{\partial W}{\partial\theta_1}$, which are **orthogonal** to the polarization-amplitude tangent plane $\mathrm{span}\{\mathbf{m}\mathbf{m}^T, i\mathbf{m}\mathbf{m}^T\}$ and satisfy $\|\mathbf{m}\hat{k}^T + \hat{k}\mathbf{m}^T\|_F^2 = 2$. Inverting the full $4\times 4$ instantaneous Fisher matrix (or the $6\times 6$ multi-cycle Fisher matrix over $(\theta_1, \theta_2, A, \iota, \psi, \phi_0)$) gives an **isotropic, polarization-independent CRLB**:

$$
\boxed{\sigma_{\theta_1} = \sigma_{\theta_2} = \frac{1}{\rho} = \frac{1}{\sqrt{2}\,\mathrm{SNR}_{\mathcal{E}}}, \qquad \mathrm{Cov}(\theta_1, \theta_2) = 0, \qquad \Delta\Omega_{1\sigma} \equiv \pi\sigma_{\theta_1}\sigma_{\theta_2} = \frac{\pi}{\rho^2} = \frac{\pi}{2\,\mathrm{SNR}_{\mathcal{E}}^2}.}
$$

*(Comparison across spin $s \ge 1$: For a spin-$s$ rank-$s$ null tensor $\mathbf{m}^{\otimes s}$, $\|\mathrm{Sym}_s(\mathbf{m}^{\otimes(s-1)}\otimes\hat{k})\|_F^2 = s$, yielding $\sigma_{\theta_1}^{(s)} = \sigma_{\theta_2}^{(s)} = \sqrt{\frac{2}{s}}\,\frac{1}{\rho}$. At equal total field SNR $\rho$, spin-2 gravity localizes a wave $\sqrt{2}\times$ more sharply in angle — $2\times$ smaller solid angle $\Delta\Omega$ — than a 6-component electromagnetic sensor $\sigma_\theta^{\mathrm{EM}} = \sqrt{2}/\rho$!)*

### 4.3 Three-Dimensional Velocity from the Static-Scene Speedometer
**[Status: Exact slow-motion CRLB from joint $8\times 8$ Fisher matrix; relativistic corrections exact numerically]**

A static vacuum scene has real rest-frame Weyl eigenvalues $(\lambda_1, \lambda_2, \lambda_3)$ with $\sum_{a=1}^3 \lambda_a = 0$ ($2$ invariants), rotated by $3$ unknown Euler angles and boosted by $3$ unknown velocity components $\boldsymbol{\beta} = \mathbf{v}/c$ — **$8$ real unknowns** inside the $10$ measured numbers (leaving $2$ static-clutter null checks $\operatorname{Im}\operatorname{Tr}W^2 = \operatorname{Im}\det W = 0$).

At $v \ll c$, variations of $(\lambda_1, \lambda_2)$ and Euler angles affect only $\mathcal{E}$ ($\mathcal{O}(1)$), whereas $\frac{\partial\mathcal{B}_{bc}}{\partial v_a} = \frac{\lambda_c - \lambda_b}{c}$ ($(a,b,c)$ cyclic) lives purely in $\mathcal{B}$, so **the $8\times 8$ Fisher matrix block-diagonalizes with zero penalty from not knowing the static scene’s eigenvalues or orientation!** Because each off-diagonal pair $\mathcal{B}_{bc}^2 + \mathcal{B}_{cb}^2 = 2\mathcal{B}_{bc}^2$ enters twice in $\|\mathcal{B}\|_F^2$, in the principal axes of $\mathcal{E}$:

$$
\boxed{\frac{\sigma_{v_a}}{c} = \frac{\sigma_{\mathcal{B}}}{\sqrt{2}\,|\lambda_b - \lambda_c|} = \frac{\|\mathcal{E}\|_F}{\sqrt{2}\,|\lambda_b - \lambda_c|}\,\frac{1}{\mathrm{SNR}_{\mathcal{E}}}} \qquad \bigl((a,b,c)\text{ cyclic},\; v \ll c\bigr).
$$

- **Single static sphere of mass $M$ at distance $r$:** Eigenvalues $(-2, 1, 1)\frac{GM}{r^3}$ give $\|\mathcal{E}\|_F = \sqrt{6}\frac{GM}{r^3}$, $|\lambda_1 - \lambda_{2,3}| = 3\frac{GM}{r^3}$, $|\lambda_2 - \lambda_3| = 0$: radial velocity is unobservable ($\sigma_{v_r} = \infty$), while both transverse components achieve $\frac{\sigma_{v_{\perp 1}}}{c} = \frac{\sigma_{v_{\perp 2}}}{c} = \frac{1}{\sqrt{3}\,\mathrm{SNR}_{\mathcal{E}}}$ (equivalently $\frac{\sigma_{v_\perp}}{v_\perp} = \frac{1}{\mathrm{SNR}_{\mathcal{B}}}$ since $\|\mathcal{B}\|_F = \sqrt{3}\frac{v_\perp}{c}\|\mathcal{E}\|_F$).
- **Maximally triaxial static tide** $(\lambda_1, \lambda_2, \lambda_3) = \Lambda(1, 0, -1)$ ($\|\mathcal{E}\|_F = \sqrt{2}\Lambda$): all three velocity components are determined simultaneously with $\frac{\sigma_{v_1}}{c} = \frac{\sigma_{v_3}}{c} = \frac{1}{\mathrm{SNR}_{\mathcal{E}}}$ and $\frac{\sigma_{v_2}}{c} = \frac{1}{2\,\mathrm{SNR}_{\mathcal{E}}}$.
- **Relativistic speeds ($\beta \sim 0.1\text{--}0.6$):** For boost $\boldsymbol{\beta} = (\beta_1, 0, 0)$ along principal axis $1$, transverse uncertainties scale exactly as $\sigma_{\beta_{2,3}}(\beta_1) = \sqrt{1 + \beta_1^2}\,\sigma_{\beta_{2,3}}(0)$, while $\sigma_{\beta_1}(\beta_1)$ grows mildly due to $SO(3,\mathbb{C})$ coupling with roll angle around axis $1$ ($1.244\times$ at $\beta_1 = 0.3$).

### 4.4 Single-Pixel Ranging CRLBs (Near-Field Moving Mass vs. Wave-Zone Quadrupole)
**[Status: Near-field $7\times 7$ joint CRLB exact to $\mathcal{O}(v/c, vT/r)$; wave-zone CRLBs exact asymptotically]**

1. **Near-field uniformly moving point mass (`Eq. 36`, $r = c|\mathcal{B}\hat{n}|/|P\dot{\mathcal{E}}\hat{n}|$):**  
   Suppose a point mass $M$ moves uniformly along $\mathbf{x}_s(t) = r\hat{n} + \mathbf{v}t$ over a short window $[-T/2, T/2]$ ($vT \ll r$, $v \ll c$). Jointly estimating all **$7$ unknowns** $(\ln r, \theta_1, \theta_2, \ln(GM/r^3), v_{\perp 1}, v_{\perp 2}, v_r)$ from the $10$-channel time series $(\mathcal{E}(t), \mathcal{B}(t))$ yields the **exact marginalized distance CRLB**:

   $$
   \boxed{\frac{\sigma_r}{r} = \sqrt{\frac{1}{\mathrm{SNR}_{\mathcal{B}}^2} + \frac{1}{\mathrm{SNR}_{\dot{\mathcal{E}}_\perp}^2}} = \frac{1}{\mathrm{SNR}_{\mathcal{E}}}\,\frac{c}{v_\perp}\sqrt{\frac{1}{3} + \left(\frac{2r}{cT}\right)^{\!2}},}
   $$

   where $\mathrm{SNR}_{\mathcal{E}}, \mathrm{SNR}_{\mathcal{B}}$ are integrated over $[-T/2, T/2]$ and $\mathrm{SNR}_{\dot{\mathcal{E}}_\perp}^2 = \frac{2}{S_0}\int_{-T/2}^{T/2} \|t\,\dot{\mathcal{E}}_\perp\|_F^2\,\mathrm{d}t = \frac{v_\perp^2 T^2}{4r^2}\mathrm{SNR}_{\mathcal{E}}^2$.  
   *(Notice the exact light-travel-time crossover at $T_* = 2\sqrt{3}\,r/c$: for exposures shorter than $T_*$, slow angular drift $\dot{\mathcal{E}}_\perp$ limits ranging as $\frac{2r}{v_\perp T\,\mathrm{SNR}_{\mathcal{E}}}$; for $T \gg 2\sqrt{3}\,r/c$ — a few nanoseconds at room scale! — magnetic noise dominates and saturates at $\frac{\sigma_r}{r} = \frac{1}{\mathrm{SNR}_{\mathcal{B}}} = \frac{c}{\sqrt{3}v_\perp \mathrm{SNR}_{\mathcal{E}}}$.)*
2. **Wave-zone quadrupole ranging:** As derived in §1.5, single-snapshot SVD ranging achieves $\frac{\sigma_r}{r} = \frac{(kr)^2}{\sqrt{6}\,C(\iota,\theta)\,\rho}$, while full-cycle $7$-parameter estimation of an inclined binary ($0 < \iota < \pi/2$) achieves $\frac{\sigma_r}{r} = g(\iota)\,\frac{kr}{\rho}$.

> [!TIP]
> **Runnable Numerical Tests — Question 4**
> - **Wave direction (4.2):** Elliptically polarized wave at $(\theta_0,\phi_0) = (1.1, 0.7)\text{ rad}$ with $(\mathcal{E}_+, \mathcal{E}_\times) = (0.8, 0.6)$ and $\sigma = 1$ ($\rho = 2.0$): $4\times 4$ Fisher inverse gives $\sigma_\theta = \mathbf{0.50000000}$, $\sin\theta_0\,\sigma_\phi = \mathbf{0.50000000}$, $\mathrm{Cov}(\theta,\phi) = \mathbf{0}$ ($\rho\sigma_{\theta_{1,2}} = \mathbf{1.00000000}$).
> - **Speedometer (4.3):** Static eigenvalues $(\lambda_1,\lambda_2,\lambda_3) = (2.0, -0.5, -1.5)$, $\sigma = c = 1$. At $\boldsymbol{\beta} = \mathbf{0}$, $8\times 8$ joint Fisher inverse gives $(\sigma_{\beta_1}, \sigma_{\beta_2}, \sigma_{\beta_3}) = \mathbf{(0.70710678, \, 0.20203051, \, 0.28284271)}$, matching $\frac{1}{\sqrt{2}|\lambda_b-\lambda_c|} = (\frac{1}{\sqrt{2}}, \frac{1}{3.5\sqrt{2}}, \frac{1}{2.5\sqrt{2}})$ to $10^{-15}$. At relativistic $\boldsymbol{\beta} = (0.3, 0, 0)$, $(\sigma_{\beta_1}, \sigma_{\beta_2}, \sigma_{\beta_3}) = \mathbf{(0.87980111, \, 0.21092604, \, 0.29529646)}$ (note $0.20203051\sqrt{1.09} = 0.21092604$).
> - **Moving-mass ranging (4.4):** $r_0 = 10$, $GM/r_0^3 = 1$, $c = 1$, $\mathbf{v} = (10^{-3}, 0, 5\times 10^{-4})$, $17$ uniform samples over $T = 0.10$ with $\sigma = 1$ ($\mathrm{SNR}_{\mathcal{E}} = \sqrt{17\times 6} = 10.0995$): $7\times 7$ Fisher inverse gives $\sigma_r / r = \mathbf{18670.48}$, matching $\sqrt{\mathrm{SNR}_{\mathcal{B}}^{-2} + \mathrm{SNR}_{\dot{\mathcal{E}}_\perp}^{-2}} = \mathbf{18670.49}$ to $5\times 10^{-7}$.

---

## 5. Question 5: Beyond General Relativity at One Full-Riemann Pixel in One Reading

### 5.1 Counting Components of a Full-Riemann Pixel
**[Status: Exact for any torsion-free metric spacetime; polarization classification builds on Eardley, Lee & Lightman 1973 and Fierz & Pauli 1939]**

Relax Einstein’s vacuum equations while keeping a torsion-free metric $g_{\mu\nu} = \eta_{\mu\nu} + h_{\mu\nu}$:
- **$\mathcal{E}_{ij} = c^2 R_{0i0j}$:** Symmetric ($R_{0i0j} = R_{0j0i}$) with nonzero trace $\operatorname{tr}\mathcal{E} = c^2 R_{00} \implies$ **$6$ real numbers**.
- **$\mathcal{B}_{ij} = \frac{1}{2}c^2 \epsilon_{ipq}R_{pqj0}$:** By the algebraic first Bianchi identity $R_{[pqi]0} = 0$, **$\operatorname{tr}\mathcal{B} = \frac{1}{2}c^2\epsilon_{ipq}R_{pqi0} \equiv 0$ identically in *every* metric theory of gravity** (a nonzero $\operatorname{tr}\mathcal{B}$ would witness spacetime torsion!). However, its antisymmetric part $\epsilon_{ijk}\mathcal{B}_{ij} = c^2 R_{0k}$ need NOT vanish when $R_{0k} \neq 0$, giving $5$ symmetric STF $+ 3$ antisymmetric $=$ **$8$ real numbers**.
- **Total in $(\mathcal{E}, \mathcal{B})$ at one reading:** **$6 + 8 = 14$ independent real numbers.** *(The remaining $20 - 14 = 6$ components of $R_{\mu\nu\rho\sigma}$ sit in the symmetric spatial curvature tensor $\mathcal{J}_{ij} \equiv \frac{1}{4}c^2\epsilon_{ipq}\epsilon_{jrs}R_{pqrs}$, measurable by spatial Sagnac holonomy loops.)*

### 5.2 Universal Metric Plane-Wave Identity: Speed of Gravity and All Six Polarizations in One Reading
**[Status: Exact for any single plane wave $h_{\mu\nu}(t - \frac{\hat{k}\cdot\mathbf{x}}{v_p})$ in any metric theory, without assuming field equations]**

Consider *any* plane metric wave travelling along unit vector $\hat{k}$ at phase speed $v_p = \omega / k$ (define dimensionless slowness $n \equiv c/v_p = ck/\omega > 0$), so $\partial_i = -n\hat{k}_i\partial_0$ on oscillatory wave fields.
1. **Gauge invariance:** Of the $10$ components of $h_{\mu\nu}$, the $4$ plane-wave diffeomorphisms $\xi_\mu(t - n\hat{k}\cdot\mathbf{x}/c)$ generate pure gauge with zero curvature, leaving **exactly $6$ gauge-invariant curvature polarizations** in $\mathcal{E}_{ij}$, given in the orthonormal wave frame $(\mathbf{e}_1, \mathbf{e}_2, \hat{k})$ by the Eardley–Lee–Lightman (1973) matrix:

   $$
   \mathcal{E} = \begin{pmatrix}
   \mathcal{E}_b + \mathcal{E}_+ & \mathcal{E}_\times & \mathcal{E}_x \\
   \mathcal{E}_\times & \mathcal{E}_b - \mathcal{E}_+ & \mathcal{E}_y \\
   \mathcal{E}_x & \mathcal{E}_y & \mathcal{E}_l
   \end{pmatrix} \qquad \bigl(\text{tensor } (+,\times),\text{ vector } (x,y),\text{ breathing } b,\text{ longitudinal } l\bigr).
   $$

2. **Exact differential-Bianchi relation for $\mathcal{B}$ (and $\mathcal{J}$):** Applying the second Bianchi identity $\partial_0 R_{pqj0} = -\partial_p R_{q0j0} + \partial_q R_{p0j0} = \frac{n}{c^2}(\hat{k}_p\partial_0\mathcal{E}_{qj} - \hat{k}_q\partial_0\mathcal{E}_{pj})$ and contracting with $\frac{1}{2}\epsilon_{ipq}$ yields a **universal identity valid for every metric theory**:

   $$
   \boxed{\mathcal{B} = \frac{c}{v_p}\,[\hat{k}]_\times\,\mathcal{E} \quad \left(\mathcal{B}_{ij} = \frac{c}{v_p}\,\epsilon_{ipq}\hat{k}_p \mathcal{E}_{qj}\right), \qquad \mathcal{J} = \left(\frac{c}{v_p}\right)^{\!2}[\hat{k}]_\times\,\mathcal{E}\,[\hat{k}]_\times^T.}
   $$

   Written out explicitly in the wave frame $(\mathbf{e}_1, \mathbf{e}_2, \hat{k})$:

   $$
   \mathcal{B} = \frac{c}{v_p}\begin{pmatrix}
   -\mathcal{E}_\times & \mathcal{E}_+ - \mathcal{E}_b & -\mathcal{E}_y \\
   \mathcal{E}_+ + \mathcal{E}_b & \mathcal{E}_\times & \mathcal{E}_x \\
   0 & 0 & 0
   \end{pmatrix}.
   $$

**What ONE reading of $(\mathcal{E}, \mathcal{B})$ ($14$ numbers) extracts at a single instant (Closed-Form Algorithm):**
- **Wave direction $\hat{k}$ ($2$ numbers):** $\hat{k}^T \mathcal{B} = \mathbf{0}^T$ identically even when all $6$ polarizations are active! Whenever $\operatorname{rank}(\mathcal{B}) = 2$ (which holds generically unless $\mathcal{E}$ is purely longitudinal $\mathcal{E}_l\hat{k}\hat{k}^T$, for which $\mathcal{B} \equiv \mathbf{0}$, or a single rank-1 transverse row), cross-multiplying two columns of $\mathcal{B}$ fixes $\pm\hat{k}$ with **zero assumption of GR or $v_p = c$**.
- **Sign of $\hat{k}$ and exact phase speed of gravity $v_p / c$ ($1$ number):** Comparing $\mathcal{B}$ to $[\hat{k}]_\times\mathcal{E}$,

  $$
  \frac{c}{v_p} = \frac{\operatorname{tr}\!\left(\mathcal{B}^T [\hat{k}]_\times \mathcal{E}\right)}{\left\|[\hat{k}]_\times \mathcal{E}\right\|_F^2} > 0
  $$

  uniquely selects $+\hat{k}$ (making $v_p > 0$) and measures **$v_p / c$ locally at one point in one snapshot**, without needing an electromagnetic counterpart or time-of-flight baseline!
- **All $6$ polarization amplitudes ($6$ numbers):** Rotating $\mathcal{E}$ into $(\mathbf{e}_1, \mathbf{e}_2, \hat{k})$ reads off $\mathcal{E}_+, \mathcal{E}_\times, \mathcal{E}_x, \mathcal{E}_y, \mathcal{E}_b, \mathcal{E}_l$ directly. Notice that **breathing ($\mathcal{E}_b$) and vector ($\mathcal{E}_x, \mathcal{E}_y$) modes immediately generate an antisymmetric magnetic tensor $\mathcal{B}_{[ij]} \neq 0$** ($\mathcal{B}_{12} - \mathcal{B}_{21} = -\frac{2c}{v_p}\mathcal{E}_b$, $\mathcal{B}_{23} - \mathcal{B}_{32} = \frac{c}{v_p}\mathcal{E}_x$, $\mathcal{B}_{13} - \mathcal{B}_{31} = -\frac{c}{v_p}\mathcal{E}_y$) even in vacuum!
- **Five exact metric consistency checks ($14 - 9 = 5$ numbers):** The matrix residual $\mathcal{B} - \frac{c}{v_p}[\hat{k}]_\times\mathcal{E} = \mathbf{0}$ provides **$5$ independent null tests** verifying that all active polarizations share a single propagation vector $\hat{k}$ and a single phase speed $v_p$. *(If tensor modes travel at $c$ while scalar/vector modes travel at $v_S \neq c$, $\mathcal{B} - n[\hat{k}]_\times\mathcal{E} \neq \mathbf{0}$ flags multi-speed dispersion in a single reading!)*

*(Important subtlety on dispersion inside matter vs. Eq. 28 of draft: Peters’ refractive index $n - 1 = 2\pi G\rho/\omega^2$ in GR arises from wave propagation across a background Newtonian potential/curvature gradient; in a single local freely falling Fermi frame inside homogeneous dust, background static matter contributes DC $\operatorname{tr}\mathcal{E}_{\mathrm{bg}} = 4\pi G\rho$, while high-frequency GR waves still obey $v_p \to c$ locally on the light cone up to $\mathcal{O}(G\rho/\omega^2)$ curvature-mass terms.)*

### 5.3 Weighing a Massive Graviton vs. a Scalar-Tensor Wave in One Reading
**[Status: Exact for linearized Fierz–Pauli massive gravity and linearized Brans–Dicke / $f(R)$ scalar modes]**

Suppose one reading finds $n = c/v_p < 1$. For a Lorentz-invariant massive wave with dispersion $\omega^2 = c^2 k^2 + \omega_m^2$ ($\omega_m = m_g c^2/\hbar$), **the phase speed is superluminal, $v_p = \omega/k > c$, while the group speed is subluminal, $v_g = \mathrm{d}\omega/\mathrm{d}k = c^2/v_p < c$**, so the measured magnetic-to-electric slowness equals the group-velocity factor:

$$
n \equiv \frac{c}{v_p} = \frac{ck}{\omega} = \frac{v_g}{c} = \sqrt{1 - \left(\frac{m_g c^2}{\hbar\omega}\right)^{\!2}} < 1 \quad \Longrightarrow \quad \frac{m_g c^2}{\hbar\omega} = \sqrt{1 - n^2}.
$$

*(Knowing $\omega$ from a short time derivative $\ddot{\mathcal{E}}/\mathcal{E} = -\omega^2$ then weighs $m_g$ in kilograms at one point!)*

Even more remarkably, **one single reading without $\omega$ distinguishes a ghost-free Fierz–Pauli spin-2 massive graviton from a massive scalar-tensor (Brans–Dicke / $f(R)$) wave**:
- **Fierz–Pauli massive graviton ($5$ polarizations: $\partial^\mu h_{\mu\nu} = 0$, $\eta^{\mu\nu}h_{\mu\nu} = 0$):** Its $5$ orthonormal spacetime polarization tensors produce $(\mathcal{E}_+, \mathcal{E}_\times) \propto 1$, $(\mathcal{E}_x, \mathcal{E}_y) \propto \sqrt{1 - n^2}$, and a single helicity-$0$ scalar mode for which $\mathcal{E}_b \propto -\frac{1}{2\sqrt{6}}$ stays $\mathcal{O}(1)$ as $m_g \to 0$ (the classic **van Dam–Veltman–Zakharov discontinuity**, 1970!) while $\mathcal{E}_l$ is locked to $\mathcal{E}_b$ and $n$ by the **exact opposite-sign law**:

  $$
  \boxed{\frac{\mathcal{E}_l}{\mathcal{E}_b} = -2\,(1 - n^2) = -2\left(\frac{m_g c^2}{\hbar\omega}\right)^{\!2} < 0, \qquad \operatorname{tr}\mathcal{E} = 2\,n^2\,\mathcal{E}_b.}
  $$

- **Massive scalar-tensor mode ($h_{\mu\nu} = \phi\,\eta_{\mu\nu}$):** Gives $\mathcal{E}_b = -\frac{1}{2}\ddot{\phi}$ and $\mathcal{E}_l = -\frac{1}{2}(1 - n^2)\ddot{\phi}$, obeying the **same-sign law**:

  $$
  \boxed{\frac{\mathcal{E}_l}{\mathcal{E}_b} = +(1 - n^2) > 0, \qquad \operatorname{tr}\mathcal{E} = (3 - n^2)\,\mathcal{E}_b.}
  $$

Thus comparing $\mathcal{E}_l / \mathcal{E}_b$ against $1 - n^2$ (measured independently from $\mathcal{B}$!) separates spin-2 graviton mass from scalar-tensor gravity by **both sign and a factor of $2$ in a single snapshot**.

> [!TIP]
> **Runnable Numerical Test — Question 5 (Single-Reading Modified-Gravity Inversion)**
> - **Inputs (14 numbers at $t = 0$):** Feed the pixel the exact symmetric $\mathcal{E}$ and trace-free $\mathcal{B}$ (in $\mathrm{s}^{-2}$):
>
>   $$
>   \mathcal{E} = \begin{pmatrix} 1.414 & -0.64 & -0.948 \\ -0.64 & -0.5 & -0.02 \\ -0.948 & -0.02 & 0.236 \end{pmatrix}, \qquad
>   \mathcal{B} = \begin{pmatrix} 0.4096 & 0.32 & 0.0128 \\ 1.36 & -0.4 & -0.72 \\ -0.3072 & -0.24 & -0.0096 \end{pmatrix}.
>   $$
>
> - **Outputs (one-shot algebraic recovery):**  
>   1. Normalized cross product of columns $1$ and $2$ of $\mathcal{B}$ + positivity of $n = \operatorname{tr}(\mathcal{B}^T[\hat{k}]_\times\mathcal{E})/\|[\hat{k}]_\times\mathcal{E}\|_F^2$ gives **$\hat{k} = (0.6, \, 0.0, \, 0.8)$** and **$n = c/v_p = 0.800000000000$** (**$v_p = 1.25\,c$**, $v_g = 0.80\,c$, $m_g c^2/\hbar\omega = 0.60$).  
>   2. Metric-wave consistency residual $\|\mathcal{B} - 0.8[\hat{k}]_\times\mathcal{E}\|_F = \mathbf{0}$ (to $10^{-16}$).  
>   3. Rotating $\mathcal{E}$ into $\mathbf{e}_1 = (0.8, 0, -0.6)$, $\mathbf{e}_2 = (0, 1, 0)$, $\hat{k} = (0.6, 0, 0.8)$ recovers all $6$ polarizations: **$(\mathcal{E}_+, \mathcal{E}_\times, \mathcal{E}_x, \mathcal{E}_y, \mathcal{E}_b, \mathcal{E}_l) = (1.2, \, -0.5, \, 0.3, \, -0.4, \, 0.7, \, -0.25)$**. *(Notice $\mathcal{E}_l / \mathcal{E}_b = -0.3571 \neq -2(0.36) = -0.72$ and $\neq +0.36$, flagging an independent longitudinal mode beyond pure Fierz–Pauli or pure Brans–Dicke!)*

---

## 6. Question 6: Structural Information Gravity Carries at One or a Few Points That Light Cannot

We organize the remaining physics separating gravity from electromagnetism along the six structural pillars specified in Question 6.

### 6.1 From Spin 2 (Tensor Valence 2 vs. Vector Valence 1)

1. **Higher-Order Cumulants at One Pixel: Breaking the Icosahedron Blind Spot and FOOBI Blind Separation** **[Exact]**  
   In `Sec. VII.c`, $12$ equal, unpolarized, Gaussian sources at the vertices of a regular icosahedron (a spherical $5$-design) give a single pixel the *exact* $10\times 10$ second-moment tensor of an isotropic sky. For non-Gaussian sources (inspirals, bursts, eccentric binaries, glitches) with excess kurtosis $\kappa_{4,a} = \langle s_a^4\rangle - 3\langle s_a^2\rangle^2 \neq 0$, cumulants add linearly across independent sources, so the $2p$-th cumulant tensor $\mathcal{K}^{(2p)} \in \mathrm{Sym}^{2p}(\mathbb{R}^{10})$ ($\binom{9+2p}{2p}$ entries; $715$ at $2p = 4$) integrates the sky against degree-$4p$ polynomials, reaching spherical harmonic degree **$\ell_{\max} = 4p$**!
   - At fourth order ($2p = 4$), unpolarized sources span **all $(8+1)^2 = 81$ spherical harmonics up to $\ell = 8$** inside $\mathrm{Sym}^4(\mathbb{R}^{10})$ (verified via exact QR rank $= 81$; vs. spin-1 light’s $\ell_{\max} = 4$, $(4+1)^2 = 25$ modes inside $126$ entries).
   - Because icosahedral symmetry $I_h$ first admits nontrivial invariants at $\ell = 6$, the $5$-component electric kurtosis tensor $\mathcal{K}^{(4)}_{\mathcal{E}}$ alone breaks the icosahedron degeneracy with **exact** relative Frobenius contrast:

     $$
     \frac{\bigl\|\mathcal{K}^{(4)}_{\mathcal{E},\mathrm{ico}} - \mathcal{K}^{(4)}_{\mathcal{E},\mathrm{iso}}\bigr\|_F}{\bigl\|\mathcal{K}^{(4)}_{\mathcal{E},\mathrm{iso}}\bigr\|_F} = \sqrt{\frac{2}{75}} = \frac{\sqrt{6}}{15} \approx 0.1632993162 \qquad \left(\bigl\|\mathcal{K}^{(4)}_{\mathcal{E},\mathrm{iso}}\bigr\|_F = \sqrt{\frac{3}{35}}\right).
     $$

   - Including $\mathcal{B}$ in $10$-component $\mathcal{K}^{(4)}$ breaks antipodal $\pm\hat{k}$ parity via odd $\ell = 1,3,5,7$ harmonics: all $12$ icosahedral vertex rank-1 kurtosis tensors are nearly orthogonal (QR condition ratio $R_{12,12}/R_{1,1} = 0.9874$), allowing Fourth-Order Blind Identification (FOOBI; De Lathauwer, Castaing & Cardoso 2007) at **one pixel** to separate all $12$ icosahedral sources (and generically dozens of non-Gaussian broadband sources) in the same band.

2. **Penrose’s Four Principal Null Directions, Exact Relativistic Velocity Midpoint, and $\sqrt{\epsilon}$ Splitting** **[Exact; Penrose 1960]**  
   Contracting $W = \mathcal{E} + i\mathcal{B}$ with the stereographic null vector $\mathbf{m}(\zeta) = (1 - \zeta^2, \, i(1 + \zeta^2), \, -2\zeta)^T$ ($\hat{p}(\zeta) = \frac{i\mathbf{m}(\zeta)\times\mathbf{m}^*(\zeta)}{|\mathbf{m}(\zeta)|^2}$) yields a complex quartic $\mathbf{m}(\zeta)^T W\,\mathbf{m}(\zeta) = 0$ with **four roots $\{\hat{p}_1, \hat{p}_2, \hat{p}_3, \hat{p}_4\}$ on $S^2$** (vs. $2$ roots for spin-1 light).
   - For a single uniformly moving mass $M$ at **any** relativistic velocity $\mathbf{v}$ ($0 \le v < c$), $W$ is Petrov Type D with two double roots $\hat{p}_{1,2} = \hat{p}_+$ and $\hat{p}_{3,4} = \hat{p}_-$ that fold forward from $\pm\hat{n}$ toward the transverse velocity $\mathbf{v}_\perp = \mathbf{v} - (\mathbf{v}\cdot\hat{n})\hat{n}$ so that their **Euclidean vector average is exact to all orders in $v/c$**:

     $$
     \frac{1}{4}\sum_{a=1}^4 \hat{p}_a = \frac{\hat{p}_+ + \hat{p}_-}{2} = \frac{\mathbf{v}_\perp}{c} \qquad (\text{exact for all } 0 \le v < c;\text{ as } v_\perp \to c,\; \hat{p}_1=\hat{p}_2=\hat{p}_3=\hat{p}_4 = \hat{k}\text{ fuses to Type N}).
     $$

   - Near a stationary mass ($\epsilon = 0$ degenerate double root $\hat{p}_{1,2} = +\hat{n}$), a weak passing gravitational wave of relative amplitude $\epsilon = \|W_{\mathrm{wave}}\|/\|W_{\mathrm{mass}}\| \ll 1$ splits the double root via Puiseux series by **$\Delta\theta \propto \sqrt{\epsilon}$** (e.g., $\epsilon = 10^{-12}$ produces a $10^{-6}\text{ rad}$ PND splitting).

3. **Newtonian Clutter Annihilation via Spatial Curl across a 3D Pixel Cell** **[Exact in linearized vacuum]**  
   Across neighbouring translational gradiometers measuring $\mathcal{E}_{ij}$ only, the vacuum Bianchi identity $\dot{\mathcal{B}}_{ij} = -\frac{c}{2}(\epsilon_{ipq}\partial_p\mathcal{E}_{qj} + \epsilon_{jpq}\partial_p\mathcal{E}_{qi})$ synthesizes AC $\dot{\mathcal{B}}_{ij}$ **without gyroscopes**, while annihilating *every* Newtonian gravity-gradient potential $\mathcal{E}_{qj}^{\mathrm{Newt}} = \partial_q\partial_j\Phi(\mathbf{x}, t)$ identically ($\epsilon_{ipq}\partial_p\partial_q\partial_j\Phi \equiv 0$), suppressing nearby slow-moving terrestrial clutter by $v/c \sim 10^{-8}$ model-independently.

### 6.2 From One Sign of Mass ($M > 0$)

4. **Depth-Independent Planar Shear Zeros Above a Binary Mass** **[Exact]**  
   In `Fig. 8` of the draft, two equal masses $M > 0$ at $(\pm d/2, 0, 0)$ buried at depth $z$ beneath a sensor plane $z = \text{const}$ blur in $\mathcal{E}_{zz}$ into a single bump whenever $d \lesssim z$, requiring exponentially noisy Wiener deconvolution (`Eq. 13`). Form instead the complex in-plane shear across the flat array:

   $$
   \Sigma(x, y) \equiv (\mathcal{E}_{xx} - \mathcal{E}_{yy}) + 2i\,\mathcal{E}_{xy}.
   $$

   Global index-$+1$ topological charge forces the single zero of one mass to split along the perpendicular bisector $x = 0$, where $\mathcal{E}_{xy}(0, y) = 0$ and

   $$
   \Sigma(0, y) = \frac{3GM}{\bigl[(d/2)^2 + y^2 + z^2\bigr]^{5/2}}\!\left(y^2 - \frac{d^2}{4}\right) = 0 \quad \Longleftrightarrow \quad y_* = \pm\frac{d}{2} \qquad \left(\text{exact for all } z > \frac{\sqrt{3}}{2}d\right).
   $$

   The separation between those two shear zeros on the sensor equals **$2|y_*| = d$ independent of depth $z$**, with zero deconvolution! *(An opposite-sign electric dipole $(+q, -q)$ has net monopole $0$, spoiling index-$+1$ fission.)*

5. **Ghost-Free Two-Pixel Near-Field Inversion & Single-Pixel Radial Looming Invariants** **[Exact]**  
   - **Two pixels, zero correspondence ghosts:** Two optical pinholes viewing $N$ identical point lights suffer $N^2 - N$ ray-intersection stereo ghosts. Two gravitational pixels separated by known baseline $b$ measure $10$ electric $+ 10$ magnetic $= 20$ numbers. For two arbitrary unequal moving point masses ($14$ unknowns: $M_1,\mathbf{x}_1,\mathbf{v}_1; M_2,\mathbf{x}_2,\mathbf{v}_2$), positivity $M_1, M_2 > 0$ forbids charge-neutralization cloaking, and the $10\times 8$ static Jacobian and $20\times 14$ moving Jacobian both have **full column rank ($8$ and $14$)** with $2$ static and $6$ magnetic consistency checks left over.
   - **Single-pixel radial blind-spot invariants:** When a single mass approaches purely radially ($\mathbf{v}_\perp = \mathbf{0} \implies \mathcal{B} = \mathbf{0}$, `Sec. VIII.e`), $M$ and $r$ cannot be separated, yet $\mathcal{E}_\parallel(t) = -2GM/r(t)^3$ and its first two time derivatives yield two **exact mass- and range-free invariants**:

     $$
     \tau_{\mathrm{impact}} \equiv -\frac{r}{\dot{r}} = -\frac{3\,\mathcal{E}_\parallel}{\dot{\mathcal{E}}_\parallel}, \qquad \Pi_{\mathrm{accel}} \equiv \frac{\mathcal{E}_\parallel\,\ddot{\mathcal{E}}_\parallel}{\dot{\mathcal{E}}_\parallel^2} = \frac{4}{3} - \frac{r\ddot{r}}{3\dot{r}^2},
     $$

     giving exact time-to-contact $\tau_{\mathrm{impact}}$ and distinguishing free coasting ($\Pi = 4/3$) from braking ($\Pi < 4/3$) or rocket/gravitational acceleration ($\Pi > 4/3$).

### 6.3 From Universal Coupling and the Equivalence Principle

6. **Separating Non-Inertial Frame Rotation from Matter Density via the Sign of $\operatorname{tr}\mathcal{E}$** **[Exact]**  
   By the Equivalence Principle, uniform linear acceleration $\mathbf{a}$ disappears completely from $(\mathcal{E}, \mathcal{B})$ (unlike charged plasma fields). If a pixel’s attitude gyroscopes drift so the frame rotates at angular velocity $\boldsymbol{\Omega}$, relative test-mass acceleration acquires the symmetric centrifugal pseudo-tide $\mathcal{E}^{\mathrm{rot}}_{ij} = \Omega_i\Omega_j - \Omega^2\delta_{ij}$, so inside matter:

   $$
   \operatorname{tr}\mathcal{E}^{\mathrm{eff}} = 4\pi G\!\left(\rho + \frac{3p}{c^2}\right) - 2\,\Omega^2.
   $$

   In vacuum ($\rho = p = 0$), **any frame rotation produces a strictly negative trace $\operatorname{tr}\mathcal{E}^{\mathrm{eff}} = -2\Omega^2 < 0$** (measuring $|\boldsymbol{\Omega}|$ directly from tidal stretch!), whereas ordinary matter produces a strictly **positive** trace $+4\pi G(\rho + 3p/c^2) > 0$.

7. **Petrov Type N Near Field of Invisible Radiation Beams (`Sec. X`, Tolman–Ehrenfest–Podolsky 1931; Bonnor 1969)** **[Exact in linearized GR]**  
   At transverse distance $b$ along $\hat{b}$ beside a collimated massless beam of power $P$ travelling along $\hat{l}$ ($\hat{b}\cdot\hat{l} = 0$, $\hat{\phi} = \hat{l}\times\hat{b}$), $\mathcal{E} = \frac{4GP}{c^3 b^2}(-\hat{b}\hat{b}^T + \hat{\phi}\hat{\phi}^T)$ and $\mathcal{B} = -\frac{4GP}{c^3 b^2}(\hat{b}\hat{\phi}^T + \hat{\phi}\hat{b}^T)$, so

   $$
   W_{\mathrm{beam}} = \mathcal{E} + i\mathcal{B} = -\frac{8GP}{c^3 b^2}\,\mathbf{m}(\hat{l})\,\mathbf{m}(\hat{l})^T \qquad (\operatorname{rank} W_{\mathrm{beam}} = 1,\;\text{exact Petrov Type N!}).
   $$

   Even though it is a **stationary $1/b^2$ cylindrical near field**, its Weyl matrix has rank $1$! One pixel outside an opaque beam tube reads the beam’s propagation direction $\hat{l}$ via Eq. (31) and points straight at the beam along the negative-eigenvalue stretch axis $\hat{b}$ of $\mathcal{E}$. For counter-propagating powers $P_+, P_-$ in a cavity, $\|\mathcal{E}\|_F \propto P_+ + P_-$ and $\|\mathcal{B}\|_F \propto |P_+ - P_-|$ measure both circulating and net power from outside the mirror pipe.

### 6.4 From the Absence of Screening, Reflection, and Absorption

8. **Multipath-Free Single-Pixel Wave Localization Indoors and Underground** **[Asymptotic: amplitude reflectivity $\lesssim \pi G\rho/\omega^2 \sim 10^{-13}$]**  
   In free space, an electromagnetic 6-vector sensor also reads a *single* plane wave’s direction from $\mathbf{E}\times\mathbf{B}$. Inside any building, hull, canyon, or planetary crust, however, walls reflect $\mathcal{O}(1)$ of electromagnetic waves, superposing $M \ge 2$ coherent rays that a 6-number EM point sensor **cannot unmix** ($8 > 6$), scrambling $\mathbf{E}\times\mathbf{B}$ completely. Because matter reflects gravitational waves in power by $\lesssim (\pi G\rho/\omega^2)^2 \sim 10^{-26}$ (`Sec. VII.a`), single-pixel gravitational rank-1 and rank-2 unmixing remains exact to $13+$ digits inside sealed steel rooms or kilometres underground.

9. **Complete Toroidal–Poloidal Theorem for Magnetically Silent Internal Flows** **[Exact to $\mathcal{O}(v/c)$ for steady flows]**  
   Generalizing the counter-rotating ball-and-shell example of `Sec. VIII.c`: by the Mie–Chandrasekhar decomposition, *every* divergence-free momentum density $\mathbf{J} = \rho\mathbf{v}$ ($\nabla\cdot\mathbf{J} = 0$, so $\dot{\rho} = 0$) inside a bounded body $\Omega$ splits uniquely into toroidal and poloidal fields:

   $$
   \rho\mathbf{v} = \nabla\times(\mathbf{x}\,\Psi_{\mathrm{tor}}) + \nabla\times\nabla\times(\mathbf{x}\,\Psi_{\mathrm{pol}}).
   $$

   When $\mathbf{V} = \mathbf{x}\Psi_{\mathrm{pol}}$ vanishes with its first derivatives on $\partial\Omega$, integrating $\nabla'\times\nabla'\times\mathbf{V} = \nabla'(\nabla'\cdot\mathbf{V}) - \nabla'^2\mathbf{V}$ against harmonic $|\mathbf{x} - \mathbf{x}'|^{-1}$ for $\mathbf{x} \notin \Omega$ kills $\nabla'^2\mathbf{V}$ and turns the remainder into a **pure spatial gradient** $h_{0i}^{\mathrm{pol}}(\mathbf{x}) = -\frac{4G}{c^3}\partial_i\Lambda(\mathbf{x})$, whose Riemann curvature $R_{pqj0} = \frac{1}{2}(\partial_q\partial_j h_{p0} - \partial_p\partial_j h_{q0}) \equiv 0$! **Every confined steady poloidal flow (such as axisymmetric convection cells) produces $\mathcal{B}_{ij} \equiv 0$ everywhere outside the body**; external $\mathcal{B}_{ij}$ fixes *only* the harmonic projection of the toroidal scalar $\Psi_{\mathrm{tor}}$.

### 6.5 From Nonlinearity and Memory

10. **Nonlinear Christodoulou Memory Paired with Gravitomagnetic Spin Memory and Cosmic Standing-Wave Witness** **[Exact in asymptotic BMS / linearized stochastic limit]**  
    - **Self-sourcing memory vs. linear electrodynamics:** Neutral electromagnetic radiation bursts carry zero electric charge and produce **zero** nonlinear vector-potential memory in vacuum Maxwell theory (Bieri & Garfinkle 2013). Gravity’s nonlinear stress-energy coupling gives escaping gravitons and neutrinos permanent **electric displacement memory** in the *second* time integral $\Delta h_{ij}^{\mathrm{TT}} = -2\int_{-\infty}^\infty\!\mathrm{d}t\int_{-\infty}^t\mathcal{E}_{ij}(t')\,\mathrm{d}t' \neq 0$ (Christodoulou 1991; Thorne 1992), paired with **magnetic spin memory** in the *first* time integral $\Delta\mathcal{S}_{ij} \equiv \frac{1}{c}\int_{-\infty}^\infty \mathcal{B}_{ij}(t)\,\mathrm{d}t \neq 0$ (Pasterski, Strominger & Zhiboedov 2016; Nichols 2017), recording net angular-momentum flux skew as a permanent relative twist of neighbouring test gyroscopes.
    - **Single-pixel primordial standing-wave witness:** Squeezed cosmological tensor perturbations re-entering the horizon arrive as phase-locked counter-propagating standing waves ($\mathbf{k}$ and $-\mathbf{k}$ coherent; Grishchuk 1974). Whereas any stationary incoherent background satisfies $\langle|\mathcal{E}(t)|^2 - |\mathcal{B}(t)|^2\rangle = 0$, a coherent standing mode makes the Lorentz invariant $\operatorname{Re}\operatorname{Tr}(W^2) = |\mathcal{E}(t)|^2 - |\mathcal{B}(t)|^2$ oscillate at $2\omega$ at a **single** pixel.

### 6.6 From the Ricci Trace and Antisymmetric $\mathcal{B}_{[ij]}$ Inside Matter and Null Radiation

11. **Relativistic Pressure / Vacuum-Energy Thermometer and Spherical Supernova Pointer** **[Exact]**  
    - **Weighing equation of state $w = p/(\rho c^2)$:** Inside a homogeneous fluid, $\operatorname{tr}\mathcal{E} = 4\pi G\rho(1 + 3w)$ doubles for relativistic radiation ($w = 1/3 \implies \operatorname{tr}\mathcal{E} = 8\pi G\rho$) and flips sign for vacuum dark energy ($w = -1 \implies \operatorname{tr}\mathcal{E} = -8\pi G\rho_\Lambda = -c^2\Lambda < 0$).
    - **Pointing to a $100\%$ spherical core-collapse supernova (`Sec. XI.c`, Vaidya 1951):** A strictly spherical collapse emits zero gravitational waves ($W_{\mathrm{Weyl}}^{\mathrm{rad}} = 0$), yet as its thin relativistic neutrino shell of energy flux $\mathbf{F} = F\hat{k}$ ($F = L/4\pi r^2$, $T_{\mu\nu} = (F/c)l_\mu l_\nu$) crosses the pixel, Ricci curvature produces both $\mathcal{E}^{\mathrm{Ricci}}_{ij} = \frac{4\pi G F}{c^3}(\delta_{ij} - \hat{k}_i\hat{k}_j)$ ($\operatorname{tr}\mathcal{E} = \frac{8\pi G F}{c^3}$) and purely antisymmetric $\mathcal{B}^{\mathrm{Ricci}}_{ij} = -\frac{4\pi G F}{c^3}\epsilon_{ijk}\hat{k}_k$. Combining the two in **one single reading** points straight back to the unseen collapsing star:

      $$
      \hat{n}_{\mathrm{star}} = -\hat{k} \quad \text{with} \quad (\hat{n}_{\mathrm{star}})_k = +\frac{\epsilon_{ijk}\,\mathcal{B}_{ij}}{\operatorname{tr}\mathcal{E}}, \qquad F = \frac{c^3}{8\pi G}\,\operatorname{tr}\mathcal{E}.
      $$

> [!TIP]
> **Runnable Numerical Tests — Question 6**
> - **Penrose 4-PND relativistic velocity midpoint (6.1.2):** Boost static mass tide $\mathcal{E}_0 = \mathrm{diag}(-2, 1, 1)$ by mass velocity $\mathbf{v} = (0, \, 0.9c, \, 0)$ via $W = G\mathcal{E}_0 G^T$ with $G = \exp(+i\,\operatorname{artanh}(0.9)\,K_2)$, $(K_2)_{ij} = -\epsilon_{2ij}$, and solve $\mathbf{m}(\zeta)^T W\mathbf{m}(\zeta) = 0$. The four PND unit vectors on $S^2$ average to $\frac{1}{4}\sum_{a=1}^4 \hat{p}_a = \mathbf{(0.0000000, \, 0.9000000, \, 0.0000000)} = \mathbf{v}_\perp/c$!
> - **Depth-independent binary shear zeros (6.2.4):** Two unit masses $GM = 1$ at $(\pm 1, 0, 0)$ ($d = 2$) at any depth $z > \sqrt{3}$ (test $z = 5$ and $z = 50$): on $x = 0$, $\mathcal{E}_{xy}(0,y,z) = 0$ and $\mathcal{E}_{xx}(0,y,z) - \mathcal{E}_{yy}(0,y,z) = 0$ at **$y_* = \pm 1.000000000000 = \pm d/2$** for both depths!
> - **Poloidal flow invisibility (6.4.9):** Integrate steady internal momentum densities $\mathbf{J}_{\mathrm{tor}} = \nabla\times[\hat{z}(1-r^2)^3]$ and $\mathbf{J}_{\mathrm{pol}} = \nabla\times\nabla\times[\hat{z}(1-r^2)^3]$ over the unit ball $r < 1$ to external observer $\mathbf{x} = (1.8, -0.9, 1.3)$: $\|\mathcal{B}_{\mathrm{tor}}\|_F = \mathbf{0.2072064}$, while $\|\mathcal{B}_{\mathrm{pol}}\|_F = \mathbf{0}$ ($< 5\times 10^{-9}$ at $12$-point radial Gauss–Legendre, $< 10^{-15}$ at $24$-point).

---

## 7. Plain-Spoken Literature Attribution and Epistemic Audit

To ensure complete transparency as the draft’s bibliography is finalized, the table below separates what is established in existing literature from what appears to be new in this synthesis, alongside exactness status.

| Topic / Result | Epistemic Status | Prior Literature | What Is New Here / In Your Paper |
| :--- | :---: | :--- | :--- |
| **Algebraic classification, $SO(3,\mathbb{C})$, & $4$ PNDs of $W = \mathcal{E}+i\mathcal{B}$** | **Exact** | Petrov (1954); Penrose (1960); Newman & Penrose (1962); Nichols et al. (2011) tendex/vortex | Polar decomposition $10 = 4+3+3$ as single-pixel canonical rest-frame speedometer; exact Euclidean midpoint $\frac{1}{2}(\hat{p}_+ + \hat{p}_-) = \mathbf{v}_\perp/c$ at arbitrary $v < c$; $8\times 8$ speedometer CRLB. |
| **Multi-component point tensor detectors & single-wave direction** | **Exact** | Forward (1971); Braginsky & Thorne (1985); Merkowitz & Johnson (1995) TIGA; **Paik, Griggs, Moody & Venkateswara (2016)** *Class. Quantum Grav.* 33, 075003 (**SOGRO** 6-channel tensor detector); Maggiore (2008) | Full 10-component $(\mathcal{E},\mathcal{B})$ camera formulation; exact rank-2 two-wave instantaneous unmixing, rank-3 cubic frequency pencil, and $4$-wave null-conic Bézout limit (Sylvester 1851; Penrose 1960); isotropic $\sigma_\theta = 1/\rho$ CRLB ($2\times$ solid-angle gain over EM). |
| **Present-position tide & aberration cancellation** | **Exact** (uniform $\mathbf{v}$); **$\mathcal{O}(kr)^2$** (orbit) | Laplace (1805); Eddington (1920); **Carlip (2000)** *Phys. Lett. A* 267, 81 | Exact moving-mass single-pixel range $r = c|\mathcal{B}\hat{n}|/|P\dot{\mathcal{E}}\hat{n}|$ (`Eq. 36`) + exact $7\times 7$ CRLB showing light-time crossover $cT = 2\sqrt{3}\,r$. |
| **Wave-zone quadrupole ranging $s_2/s_1 = C/(kr)^2$ & $\Delta\theta_\pm = 8|\cot\iota|/(kr)$** | **Asymptotic** ($\mathcal{O}(kr)^{-2}$ & $\mathcal{O}(kr)^{-1}$) | Linearized quadrupole metric: Thorne (1980), Teukolsky (1982); peeling: Sachs (1961, 1962) | **New:** General quadrupole SVD formula, closed-form $C(\iota,\theta)$, Fourier $2\tan^{\pm 2}(\iota/2)$ inclination-free identity, and $\mathcal{O}((kr)^{-1})$ two-helicity aberration shortcut upgrading $kr_{\max}$ from $\sqrt{\rho}$ to $\rho$. |
| **$10\times 10$ spectral matrix ($68+32$) & $K$-source resolution** | **Exact** | Anisotropic SGWB overlap functions: Allen & Ottewill (1997); Seto & Cooray (2004) | Single-pixel non-mixing of $I, (Q,U), V$ ($25+18+25=68 + 32$ nulls); closed-form $K=5$ $(\mathbf{S}_I,\mathbf{S}_V)$ Hermitian pencil; exact QR identifiability limits ($K = 8, 9, 12, 13$) & $K=10$ spin-4 linear-pol bottleneck; 4th-cumulant $\ell \le 8$ ($81$ modes) FOOBI. |
| **Vector/tensor-sensor arrays ($5N-1$, sparse grating lobes)** | **Exact** | EM 6-component vector-sensor arrays: **Nehorai & Paldi (1994)** *IEEE TSP* 42, 376; **Hochwald & Nehorai (1996)** *IEEE TSP* 44, 83; **Tan, Nehorai & Paldi (1996)** *IEEE TSP* 44, 3087 | Extension to spin-2 chiral $\mathbb{C}^{5N}$ arrays: Vandermonde proof of $5N-1$ ($10N-2$ chiral) MUSIC resolution, $\cos^8(\vartheta/2)$ overlap law, and exact Capon SNR threshold $\rho_2 \gtrsim D/(\lambda\sin\alpha_0)$ for sparse grating-lobe suppression. |
| **Beyond GR ($6$ polarizations, $v_p$, massive graviton) in one reading** | **Exact** (linearized) | **Eardley, Lee & Lightman (1973)** *PRD* 8, 3308; **Fierz & Pauli (1939)**; **van Dam & Veltman / Zakharov (1970)**; Will (2018) | Universal single-reading identity $\mathcal{B} = (c/v_p)[\hat{k}]_\times\mathcal{E}$ giving $(\hat{k}, v_p/c)$ + all $6$ ELL modes + $5$ checks from $14$ numbers, and single-snapshot $\mathcal{E}_l/\mathcal{E}_b = -2(1-n^2)$ vs. $+(1-n^2)$ discriminator of Fierz–Pauli vs. scalar-tensor mass. |
| **Memories, radiation beams, shear zeros, poloidal silence, Vaidya pointer** | **Exact** (within stated models) | Tolman–Ehrenfest–Podolsky (1931); Bonnor (1969); Vaidya (1951); Christodoulou (1991); Pasterski–Strominger–Zhiboedov (2016); Bieri & Garfinkle (2013) | Depth-independent planar shear zeros $y_* = \pm d/2$; poloidal mass-flow external $\mathcal{B}\equiv 0$ proof; radial looming $(\tau,\Pi)$; single-pixel Vaidya supernova pointer $\hat{n}_{\mathrm{star}} = \epsilon\mathcal{B}/\operatorname{tr}\mathcal{E}$. |

*(No unverified conjectures remain in Sections 1–6; the only open global algebraic question — as distinct from the proven local Jacobian ranks in §2.2 — is whether global uniqueness without discrete multi-solution branches holds all the way up to $K = 8$ unpolarized and $K = 9$ partially polarized sources on generic $S^2$ configurations, which behaves cleanly under random multi-start Gauss–Newton in numerical tests but merits an algebraic-geometry Bézout degree check if stated as a global theorem.)*
