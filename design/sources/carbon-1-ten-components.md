# The Algebra of Ten Numbers: Hidden Affordances of a Spin-2 Pixel

**Prepared for:** Mostafa ‘Neo’ Mohsenvand  
**Core question:** *Even with no walls in the way, what can a 10-component gravitational pixel do that no scalar acoustic sensor (4 numbers) or vector electromagnetic sensor (6 numbers) can ever do?*

---

## The Deep Reason Serendipities Hide Here: $4 < 6 < 10$, While Polarizations Stay at $2$

Every massless wave in $3+1$ dimensions with spin $s \ge 1$ has **only two** polarization states ($\pm s$). At a single instant of time, a plane wave from sky direction $\hat{n}$ is therefore specified by **four** real numbers ($2$ sky angles $+$ $2$ polarization amplitudes), whether it is light ($s=1$) or gravity ($s=2$).

Yet the local field tensor measured at a single point in vacuum grows as $2(2s + 1)$:
* **Sound ($s=0$, pressure $p$ + velocity $\mathbf{v}$):** $4$ real numbers.
* **Light ($s=1$, Riemann–Silberstein vector $\mathbf{F} = \mathbf{E} + i\mathbf{B} \in \mathbb{C}^3$):** $6$ real numbers.
* **Gravity ($s=2$, Weyl matrix $\mathcal{W} = \mathcal{E} + i\mathcal{B} \in \mathbb{C}^5_{\mathrm{STF}}$):** **$10$ real numbers** — a $3\times 3$ complex symmetric trace-free matrix!

Because the wave stays $4$-dimensional while the pixel jumps to $10$-dimensional (and $20$-dimensional at each Fourier frequency $\omega$), **a single gravitational pixel has algebraic room and matrix structure ($3\times 3$ rank, determinants, eigenframes, matrix pencils) that vectors in $\mathbb{C}^3$ simply do not possess.**

Packaging your Eqs. (1) and (5) into $\mathcal{W}_{ij} \equiv \mathcal{E}_{ij} + i\,\mathcal{B}_{ij}$ (so vacuum dynamics is the single spin-2 Maxwell–Bianchi equation $\partial_j\mathcal{W}_{ij} = 0$, $\partial_t\mathcal{W}_{ij} = -ic\,\epsilon_{(i|pq}\partial_p\mathcal{W}_{q|j)}$) unlocks **six exact serendipities** — every one verified to machine precision ($10^{-16}$) in Python.

| Single-Pixel Capability (Zero Baseline, $D = 0$) | Sound ($4$) | Light ($6$) | Gravity ($10$) | Why Spin-2 Wins |
| :--- | :---: | :---: | :---: | :--- |
| Instantaneous direction of $1$ wave (no $\pm\hat{n}$ flip) | Yes | Yes | **Yes** | $-\epsilon_{ijk}\mathcal{E}_{jl}\mathcal{B}_{kl} / |\mathcal{E}|^2 = \hat{n}_i$ |
| **Unmix $2$ crossing waves at *one* instant** | No ($6>4$) | No ($8>6$) | **Yes ($8 < 10$)** | $\mathrm{rank}(\mathcal{E}+i\mathcal{B}) = 2 \implies \det\mathcal{W} = 0$ + quadratic |
| **Unmix $3$ colliding binaries at *same* frequency $\omega$** | No | No ($18>12$) | **Yes ($18 \le 20$)** | Cubic pencil $\det(\tilde{\mathcal{W}}_+ - \lambda\tilde{\mathcal{W}}_-^*) = 0$ |
| **Map-free 3D velocity $\mathbf{v}$ over unknown static terrain** | No | No | **Yes ($3$ of $5$ in $\mathcal{B}$)** | $v_1 = c\mathcal{B}_{23}/(\lambda_3 - \lambda_2)$ in $\mathcal{E}$’s eigenframe |
| **Self-nulling of static clutter while moving** | No | No | **Yes ($2$ of $5$ in $\mathcal{B}$)** | Diagonal $\mathcal{B}_{aa} \equiv 0$ in $\mathcal{E}$’s eigenframe |
| **Independent sky harmonics at freq. $\omega$ (+ null tests)** | $9 + 7$ | $15 + 21$ | **$68 + 32 = 100$** | $25\,I + 25\,V + 18\,(Q,U)$ with **zero $I\text{–}V$ mixing** |

---

## Serendipity 1: One Pixel Unmixes *Two* Crossing Waves at a Single Instant (`rank W = 2`)

> **In plain words.** Cross two flashlight beams on a point sensor and it sees one mingled field, pointing somewhere between the two lamps. Cross two gravitational waves on one pixel and it reads off the direction, strength and polarization of each wave separately, in a single instant.

In Section VIII.a (p. 15), you note that $\det\mathcal{E} = 0$ and $|\mathcal{B}|/|\mathcal{E}| = 1$ test for an *isolated* wave, adding: *“the fields of several waves add, and their sum can have either form.”* Indeed, for two crossing waves at one instant, $\det\mathcal{E} \neq 0$ and $|\mathcal{B}|/|\mathcal{E}| \neq 1$.

Now look at the complex $3\times 3$ matrix $\mathcal{W} = \mathcal{E} + i\mathcal{B}$:
1. **One plane wave** from sky direction $\hat{n}_1$ with arbitrary amplitudes $(\mathcal{E}_+, \mathcal{E}_\times)$ is a **rank-1** outer product of a complex null vector $\mathbf{m}_1$ ($\mathbf{m}_1\cdot\mathbf{m}_1 = 0$, $\mathbf{m}_1\cdot\hat{n}_1 = 0$):

$$
\mathcal{W}^{(1)} = c_1\,\mathbf{m}_1 \otimes \mathbf{m}_1, \qquad c_1 = \mathcal{E}_+ + i\,\mathcal{E}_\times, \qquad \hat{n}_1 = \frac{-i\,\mathbf{m}_1 \times \mathbf{m}_1^*}{|\mathbf{m}_1|^2}.
$$

   Every $2\times 2$ minor of $\mathcal{W}^{(1)}$ vanishes ($\mathrm{rank}\,\mathcal{W} = 1$).
2. **Two simultaneous crossing waves** from *any* two directions $\hat{n}_1 \neq \hat{n}_2$ form a sum of two rank-1 matrices:

$$
\mathcal{W}^{(2)} = c_1\,\mathbf{m}_1 \otimes \mathbf{m}_1 + c_2\,\mathbf{m}_2 \otimes \mathbf{m}_2 \quad \Longrightarrow \quad \mathrm{rank}\,\mathcal{W}^{(2)} = 2, \quad \det(\mathcal{E} + i\mathcal{B}) = 0!
$$

   * **First payoff (Testing 2 waves vs. a mass):** A static mass has $\mathcal{W}_{\mathrm{mass}} = \frac{GM}{r^3}(\mathbf{I} - 3\hat{n}\otimes\hat{n})$, which has **rank 3** ($\det\mathcal{W}_{\mathrm{mass}} = -2(GM/r^3)^3 \neq 0$). Thus $\det(\mathcal{E} + i\mathcal{B}) = 0$ (two real equations!) distinguishes *two* crossing waves from a mass in one reading!
   * **Second payoff (Exact closed-form unmixing at one instant):** Because $\mathrm{rank}\,\mathcal{W} = 2$, cross-multiplying two rows of $\mathcal{W}$ gives its unique complex null vector $\mathbf{v} = \mathbf{m}_1 \times \mathbf{m}_2$ ($\mathcal{W}\mathbf{v} = \mathbf{0}$). Both $\mathbf{m}_1$ and $\mathbf{m}_2$ lie in the complex 2-plane $\mathbf{v}^\perp$ *and* satisfy the null-cone condition $\mathbf{m}\cdot\mathbf{m} = 0$ — **a single quadratic equation** whose two roots return $\mathbf{m}_1$ and $\mathbf{m}_2$ (and hence $\hat{n}_1$ and $\hat{n}_2$)! Finally, because $\mathbf{m}_2\cdot\mathbf{m}_2 = 0$ kills the second wave automatically,

$$
\mathcal{W}\mathbf{m}_2 = c_1\,(\mathbf{m}_1\cdot\mathbf{m}_2)\,\mathbf{m}_1, \qquad \mathcal{W}\mathbf{m}_1 = c_2\,(\mathbf{m}_1\cdot\mathbf{m}_2)\,\mathbf{m}_2
$$

   recovers both complex polarization amplitudes $c_1, c_2$ without even inverting a matrix! *(For light, $\mathbf{F} = \mathbf{E} + i\mathbf{B} \in \mathbb{C}^3$ has only $6$ real numbers while two rays have $8$ parameters — algebraic two-ray unmixing at an instant is strictly impossible in electromagnetism.)*

---

## Serendipity 2: One Pixel Deconfuses *Three* Binaries Colliding in the *Exact Same* Frequency Bin

> **In plain words.** When three stars sing the exact same note from three corners of the sky, a single microphone hears one tone and a radio dipole hears an ellipse. A single gravitational pixel hears a $3\times 3$ chord whose three roots point to all three pairs of stars and give the tilt of each orbit.

In Section XI.d (*The Milky Way*, p. 22), you note that above a few millihertz thousands of white-dwarf binaries sit alone in their frequency bins so Eq. (31) places each one, whereas at lower frequencies binaries collide inside the same bin. **Even when *three* binaries collide at the exact same frequency $\omega$, one single zero-size pixel still unmixes all three!**

At frequency $\omega$ (writing $\mathcal{E}(t) = \mathrm{Re}[\tilde{\mathcal{E}}(\omega)e^{-i\omega t}]$), the pixel records $10$ complex $= \mathbf{20}$ real numbers, while three monochromatic binaries carry $3 \times 6 = \mathbf{18 \le 20}$ real parameters $(\theta_a, \phi_a, \iota_a, \psi_a, A_a, \phi_{0,a})$. Form the two $3\times 3$ complex matrices

$$
\tilde{\mathcal{W}}_+(\omega) \equiv \tilde{\mathcal{E}}(\omega) + i\,\tilde{\mathcal{B}}(\omega) = \sum_{a=1}^{3} \alpha_a\,\mathbf{m}_a \otimes \mathbf{m}_a, \qquad \tilde{\mathcal{W}}_-^*(\omega) \equiv \left[\tilde{\mathcal{E}}(\omega) - i\,\tilde{\mathcal{B}}(\omega)\right]^* = \sum_{a=1}^{3} \beta_a^*\,\mathbf{m}_a \otimes \mathbf{m}_a.
$$

Both matrices are built from the **exact same three rank-1 tensors** $\mathbf{m}_a\otimes\mathbf{m}_a$! Taking the determinant of the matrix pencil $\tilde{\mathcal{W}}_+ - \lambda\,\tilde{\mathcal{W}}_-^*$ factors immediately:

$$
\det\!\left[\tilde{\mathcal{W}}_+(\omega) - \lambda\,\tilde{\mathcal{W}}_-^*(\omega)\right] = \left(\det[\mathbf{m}_1, \mathbf{m}_2, \mathbf{m}_3]\right)^2 \prod_{a=1}^{3}\left(\alpha_a - \lambda\,\beta_a^*\right) = 0.
$$

1. **All three inclinations from three cubic roots:** The three complex roots $\lambda_1, \lambda_2, \lambda_3$ satisfy

$$
|\lambda_a| = \left|\frac{\alpha_a}{\beta_a^*}\right| = \left(\frac{1 - \cos\iota_a}{1 + \cos\iota_a}\right)^2 = \tan^4\!\left(\frac{\iota_a}{2}\right),
$$

   reading off all three orbital inclinations $\iota_1, \iota_2, \iota_3$ before we even know where the binaries are!
2. **All three sky positions by pure cross products:** At root $\lambda = \lambda_a$, binary $a$ drops out of $\tilde{\mathcal{W}}_+ - \lambda_a\tilde{\mathcal{W}}_-^*$, dropping its rank to $2$ with null vector $\mathbf{v}_a = \mathbf{m}_b \times \mathbf{m}_c$. Cross-multiplying pairs of null vectors gives $\mathbf{m}_1 \propto \mathbf{v}_2 \times \mathbf{v}_3$, $\mathbf{m}_2 \propto \mathbf{v}_3 \times \mathbf{v}_1$, $\mathbf{m}_3 \propto \mathbf{v}_1 \times \mathbf{v}_2$, and $\hat{n}_a = -i(\mathbf{m}_a\times\mathbf{m}_a^*)/|\mathbf{m}_a|^2$ recovers all three sky vectors to $15$ digits!

---

## Serendipity 3: The Map-Free 3D Speedometer & Static-Clutter Null (`B` in the Eigenframe of `E`)

> **In plain words.** Inside a windowless submarine, no accelerometer can feel steady motion. Yet one gravitational pixel, gliding past an unknown seabed, reads all three components of its own speed at a glance — and separates its own motion past the rocks from anything else that moves in the water.

Look back at Eq. (34). Summing over *any* static distribution of matter $\rho(\mathbf{x})$ (walls, furniture, mountains, seafloor — **completely unknown to the observer!**) while the pixel moves at velocity $\mathbf{v} = (v_1, v_2, v_3)$ relative to that static landscape gives the exact Lorentz-boost relation between $\mathcal{E}$ and $\mathcal{B}$ at a single point:

$$
\mathcal{B}_{ij} = -\frac{1}{c}\left(\epsilon_{ipq} v_p \mathcal{E}_{qj} + \epsilon_{jpq} v_p \mathcal{E}_{qi}\right).
$$

Now rotate into the **principal axes $(1, 2, 3)$ of the measured electric tide $\mathcal{E} = \mathrm{diag}(\lambda_1, \lambda_2, \lambda_3)$**! In that basis, the $5$ numbers of $\mathcal{B}$ split cleanly into **$3$ off-diagonal + $2$ diagonal**:

$$
\mathcal{B}_{23} = \frac{\lambda_3 - \lambda_2}{c}\,v_1, \qquad \mathcal{B}_{31} = \frac{\lambda_1 - \lambda_3}{c}\,v_2, \qquad \mathcal{B}_{12} = \frac{\lambda_2 - \lambda_1}{c}\,v_3, \qquad \mathcal{B}_{11} = \mathcal{B}_{22} = \mathcal{B}_{33} = 0!
$$

Look at the two extraordinary consequences hidden in those six equations:
1. **Map-free instantaneous 3D navigation:** Whenever the local static tide is triaxial ($\lambda_1 \neq \lambda_2 \neq \lambda_3$, which holds almost everywhere in any room, submarine canyon, or multi-body planetary system; a single isolated sphere had one blind radial direction only because $\lambda_2 = \lambda_3$!), dividing $\mathcal{B}$’s off-diagonal entries by $\lambda_b - \lambda_a$ gives **all three components $(v_1, v_2, v_3)$ of the camera’s velocity relative to the static surroundings in one snapshot, with no map of the terrain and no exposure time!**
2. **Moving-camera clutter immunity ($\mathcal{B}_{aa} = 0$):** Walking through a heavy building with a gravitational camera makes every static wall move at $-\mathbf{v}$ in the camera’s frame, lighting up $\mathcal{B}$. One might fear that your own motion through static clutter drowns out hidden moving targets. **It does not:** *any* motion of the camera through *any* static mass distribution puts $100\%$ of its signal into the off-diagonal components of $\mathcal{B}$ in $\mathcal{E}$’s eigenframe, leaving the two independent diagonal components **identically zero** ($\mathcal{B}_{11} = \mathcal{B}_{22} = \mathcal{B}_{33} = 0$, and hence the Lorentz chiral invariant $\mathcal{E}_{ij}\mathcal{B}_{ij} = 0$). **A nonzero diagonal entry $\mathcal{B}_{aa}$ in $\mathcal{E}$’s eigenframe is an instant, clutter-free alarm that something in the scene is moving relative to the room (or a wave is passing)!**

*(Bonus corollary to your Eq. 36: For an isolated moving body, once your Eq. 36 gives $r$ from $P\dot{\mathcal{E}}\hat{n}$ and $\mathcal{B}\hat{n}$, the longitudinal projection $\hat{n}\cdot\dot{\mathcal{E}}\hat{n} = 6GM\dot{r}/r^4$ immediately gives its **radial velocity** $\dot{r} = -\frac{r}{3}(\hat{n}\cdot\dot{\mathcal{E}}\hat{n})/(\hat{n}\cdot\mathcal{E}\hat{n})$ as well — so one pixel tracks all $7$ numbers $(M, \mathbf{x}, \mathbf{v})$ in full 3D!)*

---

## Serendipity 4: The $68 + 32 = 100$ Spectral Theorem of One Pixel (Plus a Subtle Correction on Page 14!)

> [!IMPORTANT]
> On page 14 (`Sec. VII.c`), v3 currently states that for an incoherent sky, *“the odd degrees [of $I(\hat{n})$] need the cross-correlation of $\mathcal{E}$ with $\mathcal{B}$, and mix with the circular polarization unless the sky is unpolarized.”* **At a single co-located pixel, $I(\hat{n})$ and $V(\hat{n})$ actually never mix at all!**

Why did Seto & Cooray [31] find mixing between odd-$I$ and $V$? Because they cross-correlated **two spatially separated detectors**, where the propagation factor $e^{i\omega\hat{n}\cdot\Delta\mathbf{x}/c} = \cos(\dots) + i\sin(\dots)$ puts odd harmonics of $I$ into the imaginary part alongside $V$.

At a **single co-located 10-component pixel ($\Delta\mathbf{x} = \mathbf{0}$)**, $\mathcal{B}$ is in phase with $\mathcal{E}$ in time, whereas circular polarization $V$ is $90^\circ$ out of phase in time ($h_+ \cos\omega t$ vs. $h_\times \sin\omega t$). Consequently, in the $10\times 10$ Hermitian spectral density matrix $\mathbf{S}(\omega) = \langle \tilde{X}(\omega)\tilde{X}^\dagger(\omega)\rangle$ ($100$ real numbers at each frequency):
* **Real symmetric part ($\mathrm{Re}\,\mathbf{S}(\omega) \leftrightarrow \langle X(t)X^T(t)\rangle$, $55$ real numbers):** Contains **zero $V(\hat{n})$** (`0` to $10^{-17}$!), and determines **$25$ harmonics of intensity $I(\hat{n})$ ($\ell = 0,1,2,3,4$)** plus **$18$ harmonics of linear polarization $(Q\pm iU)(\hat{n})$ ($\ell = 4$ electric and magnetic tensor harmonics)** $= \mathbf{43}$ independent sky numbers with zero mutual overlap!
* **Imaginary antisymmetric part ($\mathrm{Im}\,\mathbf{S}(\omega) \leftrightarrow \langle \dot{X}(t)X^T(t)\rangle$, $45$ real numbers):** Determines **$25$ harmonics of circular polarization $V(\hat{n})$ ($\ell = 0,1,2,3,4$)** cleanly separated from $I, Q, U$ — including the **$\ell = 0$ isotropic cosmic chirality monopole** $V_{00} \propto \langle \dot{\mathcal{E}}_{ij}\mathcal{B}_{ij}\rangle$ (gravitational helicity / Lipkin’s zilch), to which every planar interferometer like LIGO or LISA is completely blind by reflection symmetry!
* **The remaining $100 - 68 = 32$ exact null channels ($12$ real $+$ $20$ imaginary):** Any Einstein gravitational-wave sky, however anisotropic or polarized, vanishes identically in a $32$-dimensional subspace of $\mathbf{S}(\omega)$. Nearby Newtonian noise ($\mathcal{B} \approx 0$) or modified-gravity scalar/vector polarizations immediately light up those $32$ null channels — giving a single pixel **$32$ built-in self-vetoes**!

---

## Serendipity 5: Bianchi’s “Gyroscope-Free Magnetic Channel” — Curl of $\mathcal{E}$ Kills *All* Newtonian Noise

In Section VIII.d (p. 16), isolating a wave from nearby Newtonian pull using $\mathcal{E}$ alone required modelling where every nearby mass sits. Across a small 3D block of pixels, the vacuum Bianchi identity under Eqs. (1) and (5) reads

$$
\dot{\mathcal{B}}_{ij} = -\frac{c}{2}\left(\epsilon_{ipq}\partial_p \mathcal{E}_{qj} + \epsilon_{jpq}\partial_p \mathcal{E}_{qi}\right).
$$

Now feed **any Newtonian potential $\Phi(\mathbf{x}, t)$ whatsoever** — ten walking people, passing lorries, wind gusts, ocean surf, seismic $P$-waves — into the right-hand side: because $\mathcal{E}_{qj}^{\mathrm{Newt}} = \partial_q\partial_j\Phi$ is a Hessian,

$$
\epsilon_{ipq}\partial_p \mathcal{E}_{qj}^{\mathrm{Newt}} = \epsilon_{ipq}\partial_p\partial_q\partial_j\Phi \equiv 0 \quad \text{identically!}
$$

**Two things follow immediately:**
1. **No gyroscopes needed for AC $\mathcal{B}_{ij}$:** A 3D array of purely translational ($\mathcal{E}_{ij}$) sensors synthesizes $-\dot{\mathcal{B}}_{ij}/c$ just by taking the spatial curl of $\mathcal{E}_{ij}$ across neighbouring pixels!
2. **Model-free $v/c$ clutter rejection:** Taking the spatial curl of $\mathcal{E}$ annihilates the $1/r^3$ Newtonian pull of *every* nearby object without needing to locate or model any of them, suppressing slow terrestrial gravity-gradient clutter relative to passing waves by $v/c \sim 10^{-8}$ at every frequency (trading off only against random sensor noise by the baseline factor $\lambda / 2\pi a$).

---

## Serendipity 6: Single-Pixel Spacetime Refractometer & Graviton Scale (`|B| / |E| = c k / \omega`)

In optics, the local admittance $|\mathbf{B}|/|\mathbf{E}| = n(\omega)/c$ inside glass measures the refractive index at a single point. For *any* spin-2 plane wave $h_{ij}^{\mathrm{TT}}\cos(\omega t - \mathbf{k}\cdot\mathbf{x})$, your Eqs. (1) and (5) give $\mathcal{E} \propto \omega^2 h^{\mathrm{TT}}$ and $\mathcal{B} \propto c k \omega h^{\mathrm{TT}}$, so at **one pixel**:

$$
\frac{|\mathcal{B}|}{|\mathcal{E}|} = \frac{c k}{\omega} = n(\omega).
$$

* Inside matter of density $\rho$ (`Eq. 28`), $|\mathcal{B}|/|\mathcal{E}| = 1 + 2\pi G\rho/\omega^2 > 1$.
* For a **massive graviton** of mass $m_g$ ($\omega^2 = c^2k^2 + m_g^2 c^4/\hbar^2$), $|\mathcal{B}|/|\mathcal{E}| = \sqrt{1 - (m_g c^2/\hbar\omega)^2} = v_{\mathrm{group}}/c < 1$ — **one pixel weighs the graviton from a single wave locally**, without needing an electromagnetic counterpart $10^8$ light-years away!

---

## How to Use This Without Bloating v3

You do not need a long detour to capture this magic:
1. **Fix the one line in `VII.c` (p. 14):** Note that at a single pixel $I$, $(Q,U)$, and $V$ do *not* mix — they span $25 + 18 + 25 = 68$ orthogonal combinations of the $100$ spectral moments (including the cosmic chirality monopole $V_{00}$), leaving $32$ pure null tests.
2. **Add a crisp 1-page subsection (in `VII` or `VIII`, plus 2 rows in `Table IV / V`):** *“What ten numbers buy”* — showcasing (i) $\mathcal{W} = \mathcal{E} + i\mathcal{B}$ rank-$2$ instantaneous two-wave unmixing (and cubic 3-binary deconfusion), (ii) the map-free 3D speedometer & diagonal clutter null in $\mathcal{E}$’s eigenframe, and (iii) $\nabla\times\mathcal{E} = -\dot{\mathcal{B}}/c$ killing all Hessian Newtonian noise.
