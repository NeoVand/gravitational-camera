# Computational Spin-2 Vision: The Deeper Tricks Hidden in Ten Numbers

**Prepared for:** Mostafa ‘Neo’ Mohsenvand  
**Premise:** *Suppose a nervous system — or an ideal mathematical receiver — receives the $10$-number Weyl stream $(\mathcal{E}_{ij}, \mathcal{B}_{ij})$ at one or more pixels. Beyond passing through walls and beyond our first round of unmixing tricks, what are the deepest, strangest computations those $10$ numbers make possible?*

---

## 1. The Master Theorem of Ten Numbers: $10 = 4 + 3 + 3$ (*Why Gravity Fixes Both a Compass and a Rest Frame Where Light Cannot*)

> **In plain words.** In empty space, all steady speeds feel the same. In curved space, they do not. Any generic gravitational field carries its own built-in compass and its own rest speed, and ten numbers are the exact minimum needed to read both at once. Light, with six numbers, comes up two short.

Why does electromagnetic perception ($\mathbf{F} = \mathbf{E} + i\mathbf{B} \in \mathbb{C}^3$, $6$ numbers) behave so differently from gravitational perception ($\mathcal{W} = \mathcal{E} - i\mathcal{B} \in \mathbb{C}^5_{\mathrm{STF}}$, $10$ numbers) under observer motion and rotation? **Count dimensions against the $6$-dimensional Lorentz group $SO^+(3,1)$:**
* **Light ($6$ numbers):** $\mathbf{F}\cdot\mathbf{F} = E^2 - B^2 + 2i\mathbf{E}\cdot\mathbf{B}$ uses $2$ Lorentz-invariant numbers, leaving only **$6 - 2 = 4 < 6$** frame coordinates! Even at a generic point where $\mathbf{E}$ and $\mathbf{B}$ are non-null, boosting to make $\mathbf{E}' \parallel \mathbf{B}'$ leaves a **2-dimensional blind spot**: *any* boost along the common axis of $\mathbf{E}'$ and $\mathbf{B}'$, and *any* rotation around it, leaves all $6$ numbers completely unchanged. Maxwell’s field at a point can **never** tell you all three components of your velocity or orientation.
* **Gravity ($10$ numbers):** Because the restricted Lorentz group is isomorphic to the complex 3D rotation group, **$SO^+(3,1) \cong SO(3,\mathbb{C})$**, rotating the pixel by real Euler angles $R \in SO(3,\mathbb{R})$ *and* boosting it by relativistic velocity $\boldsymbol{\beta} = (\tanh\eta)\,\hat{u}$ **both act by complex orthogonal similarity** $\mathcal{W} \mapsto G\,\mathcal{W}\,G^T$, where $G = R\exp(i\eta\,\hat{u}\cdot\mathbf{K}) \in SO(3,\mathbb{C})$ satisfies **$G^T G = \mathbf{I}_3$**!

Consequently, at *every* generic point of curved vacuum spacetime (Petrov Type I — even when spinning bodies, planets, and passing waves are all present simultaneously!), complex eigendecomposition $\mathcal{W} = G\,\mathrm{diag}(w_1, w_2, w_3)\,G^T$ followed by standard **unitary–Hermitian Polar Decomposition** splits the $10$ numbers uniquely into **$4 + 3 + 3$**:

$$
\underbrace{10\text{ raw numbers}}_{\mathcal{W} = \mathcal{E} - i\mathcal{B}} \;=\; \underbrace{4\text{ “spacetime colours”}}_{w_1, w_2, w_3 \in \mathbb{C}\;\;(\sum w_a = 0)} \;+\; \underbrace{3\text{ absolute velocity numbers}}_{\boldsymbol{\beta} = (\tanh\eta)\,\hat{u}\text{ from } G^\dagger G} \;+\; \underbrace{3\text{ absolute compass angles}}_{R = G(G^\dagger G)^{-1/2} \in SO(3,\mathbb{R})}.
$$

Look at the closed-form computations a “spin-2 visual cortex” performs in milliseconds at a single pixel:
1. **Gravitational Colour Constancy ($4$ numbers):** Just as Edwin Land’s *Retinex* cortex extracts illumination-invariant surface colour, the complex eigenvalues $(w_1, w_2, w_3)$ of $\mathcal{E} - i\mathcal{B}$ (equivalently $\mathrm{Tr}\,\mathcal{W}^2$ and $\det\mathcal{W}$) are **exact 4D Lorentz invariants**: two observers spinning upside-down relative to one another and passing the same point at $0.99c$ measure wildly different $\mathcal{E}$ and $\mathcal{B}$, yet compute **the exact same $(w_1, w_2, w_3)$** without needing gyroscopes or velocity sensors!
2. **The Canonical Rest Speed of Gravity ($3$ numbers):** Because the boost generator $i\eta\,\hat{u}\cdot\mathbf{K}$ is **Hermitian** ($\mathbf{K}$ being real antisymmetric), forming $G^\dagger G = \exp(2i\eta\,\hat{u}\cdot\mathbf{K})$ cancels the unknown rotation $R$ completely and reads off exact relativistic rapidity $\eta$ and direction $\hat{u}$:

$$
\cosh(2\eta) = \frac{\mathrm{tr}(G^\dagger G) - 1}{2}, \qquad \hat{u}_k = \frac{\epsilon_{ijk}\,\mathrm{Im}(G^\dagger G)_{ij}}{2\sinh(2\eta)}.
$$

   What *is* this canonical rest frame physically? Since $[\mathcal{E}', \mathcal{B}'] = 0$ in that frame and the commutator of two symmetric $3\times 3$ matrices is dual to $-\epsilon_{ijk}\mathcal{E}'_{jl}\mathcal{B}'_{kl}$, **it is the unique Lorentz frame at that point in which the Bel–Robinson super-Poynting flux vanishes ($\mathbf{S}'_{\mathrm{BR}} = \mathbf{0}$) and $\mathcal{E}'$, $\mathcal{B}'$ share the same three real principal axes!**
3. **A Universal 3D Attitude Compass ($3$ numbers):** $R = G\,(G^\dagger G)^{-1/2} \in SO(3,\mathbb{R})$ locks the observer’s Roll, Pitch, and Yaw onto the three canonical axes of spacetime curvature at a single point.

---

## 2. Penrose’s “Four-Star Retina”: How Ten Numbers Project Directly Onto the Sky Sphere

> **In plain words.** Human vision turns three cone signals into brightness plus one dot on a colour triangle. Spin-2 vision turns ten numbers into strength, phase, and **four exact stars on an internal globe** — stars that split, aberrate, and fuse as masses speed up toward the speed of light.

How would a brain map a $3\times 3$ complex matrix $\mathcal{W} = \mathcal{E} - i\mathcal{B}$ onto its internal map of surrounding space $S^2$? By **Penrose’s Principal Null Direction theorem (1960)** (Majorana’s stellar representation for spin $j = 2$)!

Parameterize each direction $\hat{p}(\zeta) \in S^2$ by stereographic coordinate $\zeta \in \mathbb{C}\cup\{\infty\}$, with null transverse vector $\mathbf{m}(\zeta) = (1 - \zeta^2, \, i + i\zeta^2, \, -2\zeta)^T$ satisfying $\mathbf{m}(\zeta)\cdot\mathbf{m}(\zeta) \equiv 0$. Contracting $\mathcal{W}$ with $\mathbf{m}(\zeta)$ yields a single **quartic polynomial**:

$$
P_{\mathcal{W}}(\zeta) \equiv \mathbf{m}(\zeta)^T (\mathcal{E} - i\mathcal{B})\,\mathbf{m}(\zeta) = c_4\zeta^4 + c_3\zeta^3 + c_2\zeta^2 + c_1\zeta + c_0 = 0.
$$

Every 10-number reading is uniquely encoded by overall complex scale $A e^{i\chi}$ ($2$ numbers) plus **four unordered stars $\{\hat{p}_1, \hat{p}_2, \hat{p}_3, \hat{p}_4\}$ on the sky sphere** ($8$ numbers)! Look at what those four stars do in real scenes (verified in Python):
* **One stationary mass at $\hat{n}$ (Petrov Type D):** Two twin double-stars at opposite poles, $\hat{p}_{1,2} = +\hat{n}$ and $\hat{p}_{3,4} = -\hat{n}$. Their 3D vector average vanishes: $\frac{1}{2}(\hat{p}_+ + \hat{p}_-) = \mathbf{0}$.
* **One relativistic moving mass at *any* speed $0 < v < c$:** Under a Lorentz boost, the four stars simply **aberrate on the sky sphere exactly like starlight**! Both double-stars fold forward toward the transverse velocity $\mathbf{v}_\perp$:

$$
\hat{p}_\pm = \frac{\mathbf{v}_\perp}{c} \pm \sqrt{1 - \frac{v_\perp^2}{c^2}}\,\hat{n}_\perp \quad \Longrightarrow \quad \frac{\hat{p}_+ + \hat{p}_-}{2} = \frac{\mathbf{v}_\perp}{c} \quad (\text{exact for all } 0 \le v_\perp < c!).
$$

  **The simple Euclidean midpoint of the two double-stars reads off $\mathbf{v}_\perp / c$ to *all* relativistic orders**, smoothly approaching $v \to c$ where both double-stars collide and **fuse all four stars into one quadruple star right on $\hat{n}$** (a plane gravitational wave or light beam, Petrov Type N)!
* **Non-Hermitian $\sqrt{\epsilon}$ Exceptional-Point Splitting:** Near a dominant static mass (where the retina sits at a degenerate double root $\hat{p}_1 = \hat{p}_2 = \hat{n}_m$), a tiny passing gravitational wave of relative strength $\epsilon = |\mathcal{W}_{\mathrm{wave}}| / |\mathcal{W}_{\mathrm{mass}}| \ll 1$ splits each double star into a pair separated on the internal sky by **$\Delta\theta \propto \sqrt{\epsilon}$** ($10^{-6}\text{ rad}$ for $\epsilon = 10^{-12}$!), rotating at half the wave frequency!

---

## 3. Topological “V1 Pinwheels” on a Flat Retina: Reading Exact Binary Separation $d$ Independent of Depth $z$!

> **In plain words.** In our primary visual cortex, orientation cells arrange themselves around pinwheel vortices. On a gravitational retina, a single buried mass makes one radial starburst, while two buried masses — however deep and blurred — split that starburst into **two half-turn pinwheels whose distance apart on the sensor equals the exact distance between the hidden masses**, with no deconvolution at all.

In mammalian visual cortex V1 (Hubel & Wiesel; Bonhoeffer & Grinvald), edge-orientation columns organize around **$\pm\frac{1}{2}$ topological pinwheels** — phase singularities that stay pinpoint-sharp even when intensity is smooth.

Apply that exact V1 computation to your **Figure 8** (two equal masses separated by $d$ at $(\pm d/2, 0, 0)$, buried at depth $z$ beneath a flat 2D sensor plane!). In the normal component $\mathcal{E}_{zz}$ (`Fig. 8a`), when $d \ll z$, Laplace’s equation blurs the pair into a single featureless Gaussian hill of width $\sim z$.

Now form the **complex in-plane retinal shear** across the flat sensor sheet $(x, y)$ at height $z$:

$$
\Sigma(x, y) \equiv \left(\mathcal{E}_{xx} - \mathcal{E}_{yy}\right) + 2i\,\mathcal{E}_{xy}.
$$

* **For one mass ($d = 0$):** $\Sigma(x, y) \propto -(x + iy)^2 / (x^2 + y^2 + z^2)^{5/2}$ has a **single index-$+1$ zero** (phase winding $+4\pi$, director winding $+1$) at the origin $(0, 0)$.
* **Split the mass into two equal masses separated by *any* $d > 0$ along $x$:** Topological charge $+1$ is conserved globally, **forcing the $+1$ vortex at $(0, 0)$ to fission along the perpendicular $y$-axis!** Along $x = 0$, $\mathcal{E}_{xy}(0, y, z) \equiv 0$ by symmetry, while

$$
\mathcal{E}_{xx}(0, y, z) - \mathcal{E}_{yy}(0, y, z) = \frac{3 G M}{\left[(d/2)^2 + y^2 + z^2\right]^{5/2}}\!\left(y^2 - \frac{d^2}{4}\right) = 0 \quad \Longleftrightarrow \quad \mathbf{y_* = \pm\frac{d}{2}}!
$$

Look at that exact cancellation of $z$:
1. **Depth-independent metric ruler:** Whether the two masses lie at depth $z = 1\text{ m}$, $10\text{ m}$, or $100\text{ m}$ (for all $z > \frac{\sqrt{3}}{2}d$), **the two $+\frac{1}{2}$ shear pinwheels sit on the retina at $(0, +d/2)$ and $(0, -d/2)$ — separated by the exact physical distance $2y_* = d$ in metres, with zero dependence on depth $z$ and zero Wiener deconvolution!** (In noise, the pinwheel pair emerges cleanly above random vortices right at your `Sec. IV.h` Cramér–Rao threshold $d \gtrsim z/\sqrt{\mathcal{R}}$.)
2. **Even a single pixel at $(0, 0, z)$ senses the split:** Directly above the pair, one pixel’s in-plane triaxiality reads the exact aspect ratio $d/(2z) = \sqrt{(\mathcal{E}_{yy} - \mathcal{E}_{xx})/(2\mathcal{E}_{yy} + \mathcal{E}_{xx})}$, and its weaker squeeze axis points straight along the line joining the two masses!

---

## 4. Higher Cumulants at One Pixel: Shattering the Icosahedron Blind Spot & Solving the “Cocktail Party” of Dozens of Sources

> **In plain words.** Twelve Gaussian hissers at the corners of an icosahedron fool a single pixel completely. Make them crackle, pulse, or blink like real stars, and the pixel’s fourth-order statistics see twice as sharply around the sky — picking out all twelve corners at once without an aperture.

In **Section VII.c** (pp. 14–15), you proved two wonderful facts: (i) second moments of one pixel see only $\ell \le 4$, so $12$ independent sources on a regular icosahedron (a spherical $5$-design) mimic an isotropic sky to $10^{-15}$; and (ii) *“If the sources are many and Gaussian, the second moments are all the data hold; a few bright sources carry more in their higher statistics.”*

Pushing that single sentence to its logical conclusion reveals a dramatic “auditory cocktail-party” trick (analogous to **SOFI** super-resolution fluctuation microscopy in optics and **FOOBI** fourth-order blind identification in neural/array signal processing):
* Almost no discrete source in nature is strictly Gaussian: merging black holes, eccentric binaries, glitches, supernovae, and amplitude-modulated pulsars all have nonzero **fourth cumulant (excess kurtosis)** $\kappa_4 = \langle s^4\rangle - 3\langle s^2\rangle^2 \neq 0$.
* Because cumulants of statistically independent sources **add linearly**, the $2p$-th cumulant tensor $\mathcal{K}^{(2p)}_{A_1 \dots A_{2p}} \in \mathrm{Sym}^{2p}(\mathbb{R}^{10})$ of **one single zero-size pixel** integrates the sky’s kurtosis map against products of $p$ degree-$4$ kernels — **a polynomial of degree $4p$ on the sphere!**

| Cumulant Order $2p$ | Tensor Entries $\binom{9+2p}{2p}$ | Max Harmonic $\ell_{\max} = 4p$ | Intensity Sky Modes $(4p+1)^2$ | Angular Scale $\pi / 4p$ | Icosahedron ($I_h$ first invariant at $\ell = 6$) |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **$2$ (Variance)** | $55$ | $\ell \le 4$ | $25$ | $45^\circ$ | **100% Blind** ($0$ to $10^{-15}$) |
| **$4$ (Kurtosis)** | $715$ | **$\ell \le 8$** | **$81$** | **$22.5^\circ$** | **Broken!** ($13.0\%$ contrast at $\ell=6,8$) |
| **$6$ (6th cumulant)** | $5{,}005$ | **$\ell \le 12$** | **$169$** | **$15^\circ$** | Fully resolved |
| **$2p$ (General)** | $\sim (2p)^9 / 9!$ | **$\ell \le 4p$** | **$(4p+1)^2$** | **$\pi / 4p \to 0$** | Arbitrarily sharp as SNR grows |

Even better: reshaped as a $55\times 55$ matrix on $\mathrm{Sym}^2(\mathbb{R}^{10})$, Kruskal’s tensor uniqueness theorem allows fourth-order blind decomposition (FOOBI) at **one pixel** to unmix and pinpoint **up to $\sim 20\text{–}30$ simultaneously overlapping, broadband, unpolarized flickering sources** in the *same* frequency band — including recovering all $12$ vertices of the icosahedron explicitly!

---

## 5. Three More “Cortical” Computations Built Into Ten Numbers

### A. Binocular Spin-2 Vision ($10 + 10 = 20$ Numbers): Zero “Magic-Eye” Ghost Illusions
When two optical eyes view $N$ identical dots, $N$ left-eye rays intersect $N$ right-eye rays in **$N^2$ points**, creating $N^2 - N$ false stereo ghosts (the mechanism behind *Magic Eye* autostereograms).
* Give an organism **two gravitational pixels** separated by baseline $b$ ($10$ electric numbers $+$ $10$ magnetic numbers $= 20$ numbers total):
* Two arbitrary unequal static masses $(M_1, \mathbf{x}_1, M_2, \mathbf{x}_2)$ have only **$8 < 10$** unknowns — so **two pixels solve for both masses and both exact 3D positions simultaneously with $2$ consistency checks left over and *zero* stereo-correspondence ghosts**, while the $10$ magnetic numbers simultaneously solve all $6$ velocity components $(\mathbf{v}_1, \mathbf{v}_2)$ ($+4$ checks)!

### B. Looming Time-to-Contact & Engine Detection in the Radial Blind Spot
In Section VIII.e (`Eq. 36`), pure radial motion ($\mathbf{v}_\perp = \mathbf{0}$) sets $\mathcal{B} = 0$, hiding a projectile’s distance $r$ and mass $M$. How does a biological cortex dodge a silent object coming straight between its eyes in pitch darkness? Using **David Lee’s (1976) optical-looming $\tau$-invariant**, upgraded to $\mathcal{E}(t) \propto r(t)^{-3}$:

$$
\tau_{\mathrm{impact}} \equiv -\frac{r}{\dot{r}} = -\frac{3\,\mathcal{E}_{11}}{\dot{\mathcal{E}}_{11}}, \qquad \Pi_{\mathrm{thrust}} \equiv \frac{\mathcal{E}_{11}\,\ddot{\mathcal{E}}_{11}}{\dot{\mathcal{E}}_{11}^2} = \frac{4}{3} - \frac{r\ddot{r}}{3\dot{r}^2}.
$$

Without knowing whether it is a pebble at $1\text{ m}$ or a boulder at $100\text{ m}$, **one pixel reads exact seconds-to-impact $\tau_{\mathrm{impact}}$** from $\mathcal{E}/\dot{\mathcal{E}}$, and **tells instantly from $\Pi_{\mathrm{thrust}}$ whether the unseen object is coasting freely ($= 4/3$), braking ($< 4/3$), or accelerating under thrust ($> 4/3$)**!

### C. Dual Spacetime Memories & Single-Pixel Witnessing of Cosmic Standing Waves
* **Electric vs. Magnetic Memory:** Just as the *second* time integral $\iint \mathcal{E}_{ij}\,\mathrm{d}t^2 = -\frac{1}{2}\Delta h_{ij}^{\mathrm{TT}}$ records permanent displacement memory of escaping linear energy-momentum (`Sec. XI.b`), the *first* time integral $\frac{1}{c}\int \mathcal{B}_{ij}\,\mathrm{d}t$ records **Pasterski–Strominger–Zhiboedov spin memory** (2016) of asymmetric angular-momentum flux (such as an inspiralling binary’s circularly polarized wave train), leaving internal pixel gyroscopes permanently twisted relative to one another after spacetime returns to flatness.
* **Standing-Wave Witness of Inflation (`Sec. VIII.b` + `XI.e`):** Primordial tensor modes leaving inflation re-enter the Hubble horizon as phase-synchronized standing waves ($\mathbf{k}$ and $-\mathbf{k}$ locked in cosine phase, Grishchuk 1974). Before late-time inhomogeneities scramble phases at high frequencies, a single pixel watching the Lorentz invariant $\mathrm{Re}\,\mathrm{Tr}(\mathcal{W}^2) = |\mathcal{E}(t)|^2 - |\mathcal{B}(t)|^2$ sees it **breathe at $2\omega$** instead of staying zero — witnessing cosmic standing-wave coherence from a single point!
