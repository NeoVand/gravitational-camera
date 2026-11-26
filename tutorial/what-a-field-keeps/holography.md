---
id: '13.8'
title: 'Holography and decoherence'
question: 'How much of a body''s inside does its field outside hold, once noise, the speed of light and quantum mechanics are counted, and why can gravity not decohere a ball and a shell?'
part: '13'
requires: ['2.3', '2.4', '2.5', '3.8', '6.5', '8.1', '8.6', '11.1', '11.2', '13.1', '13.2', '13.3', '13.6', '13.7']
paper: [sec:holography, eq:dp-energy, eq:split, eq:hair-bits, tab:hair, fig:hair, fig:ladder, eq:ladder, eq:dust, eq:push, sec:hair, sec:second-order, sec:near-field, sec:status]
figures: [fig:hair, fig:ladder]
live: [readable-cells, same-outside]
depth: A
---

Put a stone of radius $a$, in metres, at the centre of a glass sphere of radius $R_c = 3a$ whose surface is covered with
cameras. In quantum gravity, everything inside a region of space can in principle be learnt at the region's boundary.
What is left of the idea in ordinary, non-quantum physics? A camera that reads the field on a sphere of radius $R$ with
detail down to a size $d$ gets about $(R/d)^2$ numbers, while the cells of size $d$ in the body number about $(R/d)^3$,
and the $d$ that can be read shrinks only slowly as the instrument improves: three body radii away, at a
signal-to-noise ratio of a million, the camera reads about 170 numbers, and pushing reaches about 270 cells.[^first]

A camera's **signal-to-noise ratio** $\SNR$ is its reading over its noise (3.8), and **pushing** is 13.1's protocol:
masses held near the stone for an instant, then a weighing. At the ceiling that quantum mechanics sets,
$\SNR = 10^{70}$, looking reads $2.2\times10^4$ numbers and pushing about $2.5\times10^5$ cells, each 0.026 of the
radius across, each count at its own reading's $\SNR$. Pushing gains about twelve. This section derives these counts,
and asks why gravity cannot decohere a ball and a shell.

::: plain
A hologram is a film from which a picture with depth can be rebuilt. The pull outside a stone equals the pull of a
thin layer of mass on a sphere around it, so the layer is a hologram of the pull, and a poor one, because many
different stones make the same layer. In Einstein's theory, watching for longer does not help.

A tide is the difference in the pull of gravity across a body. Brief tides followed by a weighing reach the inside,
but each finer detail is fainter by a fixed factor. So the details grow only as the cube of the number of digits of
the camera's precision, and quantum mechanics limits that precision by the region's area in Planck units. By the
count derived here, ordinary matter shows at most about a million details, and a black hole shows seven numbers.

A body in a superposition is in two states at once. A ball and a shell of one mass and energy pull alike outside, so
gravity keeps no record of which one a body is, and cannot end their superposition that way. Diósi and Penrose proposed
that gravity also ends superpositions by a collapse, set by an energy that does differ for the pair, so the pair would tell
the two ways apart.
:::

## Looking at a body gives a hologram that loses the null space

  A **hologram** is a record on a surface from which a field in the volume beyond it can be rebuilt. Section 2.4 swept a point mass $\matter m$ at $\vect s$, inside a sphere of
radius $R$, onto the sphere as a skin of surface density $\matter m\,P(\vect x, \vect s)$, with $P$ the ball's kernel,
which pulls outside exactly as the mass does: balayage. Each piece of a body sweeps the same way, so a
density $\sym{density}{\matter\rho}$ inside the sphere becomes the skin

$$\matter\sigma(\vect x) = \int\matter\rho(\vect s)\,P(\vect x, \vect s)\,\dd V ,$$

in kilograms per square metre. The skin holds the whole field outside, so it is a hologram in the literal sense.

It loses information. Because $P$ reproduces harmonic functions (2.4), the skin's moment
$\oint\matter\sigma\,h\,\dd A$ against any $h$ harmonic in the ball equals the body's $\int\matter\rho\,h\,\dd V$. On
the sphere $r^\ell Y_{\ell m}$ is $R^\ell Y_{\ell m}$, so the skin's components on the patterns $Y_{\ell m}$ are the
body's multipole moments over $R^\ell$. A function on a sphere is fixed by these components (2.2), so the skin and the moments fix each other. Two densities with the same harmonic part, which differ by 2.5's confined Laplacian
$\nabla^2\field\psi/4\pi G$, sweep to the same skin. The hologram loses exactly 2.5's null space.

**The count.** For a camera sphere of radius $R_c$ let $\Lambda = \ln(R_c/a)$, a pure number, 1.10 from three
radii.[^Lambda] Section 2.3 found that the moments of degree $\sym{degree}{\ell}$, $2\ell + 1$ of them, reach the
camera at most $e^{-\ell\Lambda}$ as strongly as the monopole. With the monopole read at $\sym{snr}{\SNR}$ and
$L = \ln\SNR$, degree $\ell$ stands above the noise while $\ell\Lambda < L$. Summing $2\ell + 1$ up to
$\lfloor L/\Lambda\rfloor$ gives a square:

$$\boxed{\;\sym{looking-count}{N_1} = \bigl(\lfloor L/\Lambda\rfloor + 1\bigr)^2\;}$$

numbers, a pure count. From three radii it is $13^2 = 169$ at $10^6$, the beads of panel (b) of Figure
[](/paper/#fig:hair), and $147^2 = 21{,}609$ at $10^{70}$. A camera so far away that $\Lambda > L$ reads one number, the mass. The count grows as $L^2$, like the patterns on a
surface, and none of the numbers is a cell of the interior. Wens found the same cut-off in imaging the brain's magnetic field (stated).

{{paper fig:hair}}

**What it means.** Looking resolves $d \approx R_c\Lambda/L$, and the [third
section](#pushing-reads-the-volume-but-only-to-a-number-of-cells-set-by-the-logarithm) finds the $d$ that pushing
resolves.

## The speed of light does not add the third dimension

A field that travels at the speed $c$ carries news of each moment outward, so perhaps a camera that watches long
enough sees the inside unfold. Take two scenes. In the first, the stone turns by a round motion from a uniform ball into a thin shell and back. In the second it rests,
with the same total energy.

An equation like Poisson's, whose field everywhere follows the sources at once, is **elliptic**; the wave equation,
whose news travels at a finite speed, is **hyperbolic**.[^hyperbolic] Einstein's theory is hyperbolic, yet outside
both stones the field is Schwarzschild's at every moment, by 11.1's Birkhoff theorem, so the two scenes give identical
records forever. **Birkhoff's theorem is the shell theorem of Einstein's equations.**[^birkhoff] Any round
region of empty space holds Schwarzschild's static field, fixed by the mass. It says nothing of motions that are not round.

**What would tell them apart.** Take a scalar theory with retardation, whose potential obeys 5.2's wave equation
$c^{-2}\partial_t^2\field\Phi - \nabla^2\field\Phi = -4\pi G\matter\rho$ with $\matter\rho$ conserved. Section 5.2's
retarded solution is $\field\Phi = -G\int\matter\rho(t - D/c, \vect x')\,\dd V'/D$, with $D = |\vect x - \vect x'|$ and
$\vect x$ outside the body. We expand $\matter\rho$ about the retarded time $t_r = t - r/c$ by Taylor's rule, with
dots for time derivatives:

$$\begin{aligned}
\matter\rho(t - D/c) &= \matter\rho(t_r) - \frac{D - r}{c}\,\dot{\matter\rho}(t_r)\\
&\quad + \frac{(D - r)^2}{2c^2}\,\ddot{\matter\rho}(t_r) - \cdots
\end{aligned}$$

The monopole needs only averages over the directions of $\vect x'$ at fixed $r' < r$, written $\langle\cdot\rangle$.
The shell theorem gives $\langle 1/D\rangle = 1/r$, so the first-order term, with $\langle(D - r)/D\rangle = 1 -
r\langle 1/D\rangle$, vanishes. For the second order we need $\langle D\rangle$; with $\mu$ the cosine of the angle
between $\vect x$ and $\vect x'$,

$$\begin{aligned}
\langle D\rangle &= \frac12\int_{-1}^{1}\sqrt{r^2 + r'^2 - 2rr'\mu}\;\dd\mu\\
&= \frac{(r + r')^3 - (r - r')^3}{6rr'} = r + \frac{r'^2}{3r} ,
\end{aligned}$$

so $\langle(D - r)^2/D\rangle = \langle D\rangle - 2r + r^2\langle 1/D\rangle = r'^2/3r$. The second-order term
brings $\tfrac12$ times this $\tfrac13$. With $I_r = \int\matter\rho\,r'^2\,\dd V'$, in $\mathrm{kg\,m^2}$, and
$\matter M = \int\matter\rho\,\dd V'$ conserved, the monopole outside is

$$\boxed{\;\field\Phi_0 = -\frac{G}{r}\Bigl[\matter M + \frac{\ddot I_r(t - r/c)}{6c^2}\Bigr] + O(c^{-4})\;}$$

The bracket is in kilograms, and as $c \to \infty$ it is Newton's $-G\matter M/r$. The ripple's gradient falls only as
$1/r$, so it carries energy to infinity: it is radiation. It reads $\int\matter\rho\,r^2\,\dd V$, which tells a ball
from a shell, 0.6 against 1 in units of $\matter Ma^2$. For a uniform ball whose radius swings by $\delta = 10^{-3}a$ at
the breathing note of section 4.5's steel ball, of radius 10 cm, about 24 kHz, $\ddot I_r$ is at most $\tfrac65\matter
Ma\delta\omega^2$, and the ripple is $\tfrac15(\omega a/c)^2(\delta/a) = 5\times10^{-13}$ of the static pull.

**Why Einstein's theory hides it.** Section 6.5's $\sym{stress-energy-tensor}{\matter T}^{\mu\nu}$ holds the energy
density $\matter T^{00}$, $c$ times the momentum density $\matter T^{0i}$, and the stresses $\matter T^{ij}$, in
joules per cubic metre. Blanchet and Damour's monopole of a slow source, in kilograms, is (stated)

$$\begin{aligned}
&\frac{1}{c^2}\int\bigl(\matter T^{00} + \matter T^{ii}\bigr)\,\dd V\\
&\quad + \frac{1}{6c^4}\frac{\dd^2}{\dd t^2}\int\matter T^{00}r^2\,\dd V\\
&\quad - \frac{4}{3c^3}\frac{\dd}{\dd t}\int x_i\matter T^{0i}\,\dd V ,
\end{aligned}$$

with the scalar theory's $\tfrac16$ in its middle term. Conservation, $\partial_t\matter T^{00} = -c\,\partial_i
\matter T^{0i}$ and $\partial_t\matter T^{0i} = -c\,\partial_j\matter T^{ij}$, with one integration by parts each,
gives

$$\begin{aligned}
\frac{\dd}{\dd t}\int x_i\matter T^{0i}\,\dd V &= c\int\matter T^{ii}\,\dd V,\\
\frac{\dd^2}{\dd t^2}\int\matter T^{00}r^2\,\dd V &= 2c^2\int\matter T^{ii}\,\dd V ,
\end{aligned}$$

the second being 12.1's virial identity before its average over time. The three terms in
$\int\matter T^{ii}\,\dd V/c^2$, from the stress in the first, from $r^2$ and from the current, then come with
$1 + \tfrac13 - \tfrac43 = 0$ (Figure [](#fig:breathing-stone)). The monopole is $\int\matter T^{00}\,\dd V/c^2$, the
conserved energy over $c^2$, as Birkhoff requires.[^bd] The hiding is done by conservation and the elliptic constraints of a hyperbolic theory, not by the ellipticity of
Newton's equation.

![Look first at the bars: in Einstein's theory the three terms of order $1/c^2$ cancel, so the breathing stone sends
nothing, while a scalar theory sees its $\int\matter\rho\,r^2\,\dd V$. The ripple is magnified $10^{12}$ times, for a
stone of radius 10 cm that swings once a millisecond; the shapes are exact.](tut-breathing-stone){#fig:breathing-stone}

**In general** (stated). A source watched from outside for all time is known only through its **light-cone
transform**, its transform in space and time on the light cone $|\vect k| = \omega/c$ of wavevector and frequency
(Devaney and Wolf, 1973). A source $c^{-2}\ddot{\field\psi} - \nabla^2\field\psi$, with $\field\psi$ zero outside the
body at all times, makes the retarded field $\field\psi$, zero outside. Such a **non-radiating source** is, when
static, 2.5's confined Laplacian, and Bleistein and Cohen (1977) showed that these are the whole null space. The record is an area times a time, the source a volume times a time.


**What it means.** Acting, not time, removes the null space. For a classical body at rest, readings at any number of
times give only the harmonic moments of its mass and its flow.[^twotimes] The body's own motion climbs 13.3's ladder
without a push, at a cost of $(\omega a/c)^2$ per rung.[^passive]

**The four entries.** Watching or pushing, with an instantaneous field or one that travels at $c$, make four cases
(Figure [](#fig:holo-table)). Watching leaves a null space either way. Pushing removes it with **logarithmic
stability**, an error that falls only as one over the logarithm of the noise (13.2). A wave shorter than the body reads its transform at wavevectors $|\vect q| \le 2\omega/c$ with **Hölder stability**,
an error that falls as a power of the noise, to about half a wavelength (Stefanov and Uhlmann, stated).

![Look first at the left column: watching, with or without the speed of light, leaves a null space. The entries are
stated results, sourced in the text.](tut-holo-table){#fig:holo-table}

## Pushing reads the volume, but only to a number of cells set by the logarithm

How many interior cells do tides and weighings resolve? A **cell** is the smallest volume, of size
$\sym{cell-size}{d}$ in metres, whose mean density the data fix. The count is derived here, as a sketch at depth B.[^own]

**The protocol** takes the impulses in pairs. Section 13.1 found that a mass $\matter\mu$ held
at $\vect y$ for a short time $\delta t$ is the impulsive tide $g_{\vect y} = 1/|\vect x - \vect y|$, of strength
$\epsilon = G\matter\mu\,\delta t$, and the energy $\Delta E$ the body gains is linear in the tide at first order and quadratic at second
([section 13.6](/tutorial/what-a-field-keeps/algebra-of-moments/#an-impulsive-tide-and-a-weighing-read-a-bracket-taken-twice)). We hold masses at two points $\vect y$ and $\vect y'$ of the
camera sphere, both at once on one copy of the body and one at a time on two others prepared alike, and weigh each. The
first-order terms and the squares cancel in

$$\Delta E(g_{\vect y} + g_{\vect y'}) - \Delta E(g_{\vect y}) - \Delta E(g_{\vect y'})
= \epsilon^2\int\matter\rho\,\nabla g_{\vect y}\cdot\nabla g_{\vect y'}\,\dd V ,$$

in joules. Three or more masses at once add nothing, because $\Delta E$ holds only single tides and pairs.

**What a pair reads.** Inside the body each tide is a sum of harmonic polynomials of degrees $\ell_1 \ge 1$ (13.3). For
harmonic $h_1$ and $h_2$, 2.1's product rule gives $\nabla h_1\cdot\nabla h_2 = \tfrac12\nabla^2(h_1h_2)$. The product
is $r^{\ell_1+\ell_2}$ times patterns $Y_\ell$, and $\nabla^2(r^NY_\ell) = (N - \ell)(N + \ell + 1)\,r^{N-2} Y_\ell$,
so the degrees $\ell_1$, $\ell_2$ read the moments $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$ of total degree
$n = \ell + 2j = \ell_1 + \ell_2 - 2$. The directions of $\vect y$ and $\vect y'$ sort the data by $\ell_1$, $\ell_2$
and $\ell$ (2.2), and each sorted datum, a **channel**, reads one moment.
For two quadrupolar tides $\tfrac12\vect x\cdot A\vect x$ and $\tfrac12\vect x\cdot A'\vect x$ the product is
$\vect x\cdot AA'\vect x$, whose round part $\mathrm{tr}(AA')\,r^2/3$ reads $\int\matter\rho\,r^2\,\dd V$, the rung
that tells a ball from a shell.

So the rungs $j$ of one pattern come from different pairs of degrees, and on one sphere they never mix. A single mass
has $\vect y' = \vect y$, and only the distance separates its rungs (13.3).[^single]

**The cost of a rung.** The **sector** of degree $\ell$ is the part of the density that varies with direction as the
patterns $Y_\ell$. A tide of degree $\ell_1$ from $R_c$ is weaker inside the body by $(a/R_c)^{\ell_1}$, so a rung of
total degree $n$ arrives weakened by $e^{-n\Lambda}$ against the mass, which the degrees $(1, 1)$ read. Inside, the
power $r^{\ell+2j}$ is close to a sum of the lower powers $r^{\ell+2i}$, with the weight $r^2\,\dd r$, and only its
part at right angles to them, its **residual**, carries a new number.

::: derivation
### What is new in each power

On $0 \le u \le 1$ take the powers $u^{e_0}, u^{e_1}, \dots$ with $\int_0^1u^{e_i}u^{e_k}\,\dd u = 1/(e_i + e_k + 1)$,
a Cauchy matrix. The length of the part of $u^{e_j}$ at right angles to the lower ones is the square root of the
ratio of two determinants of this matrix, with $j + 1$ and $j$ rows, and Cauchy's formula for them (derived in the
next box) gives

$$\beta_j = \frac{1}{\sqrt{2e_j + 1}}\prod_{i<j}\frac{e_j - e_i}{e_j + e_i + 1} .$$

Inside, $r^{\ell+2i}$ with the weight $r^2\,\dd r$ is $u^{e_i}$ with $e_i = \ell + 2i + 1$, so $e_j - e_i = 2(j - i)$.
For $\ell = 0$ the ratios $\beta_1/\beta_0$, $\beta_2/\beta_1$, … are 0.262, 0.253, 0.252, 0.251, toward
$\tfrac14$. In general the product is $j!\,\Gamma(\ell + j + \tfrac32)/\Gamma(\ell + 2j + \tfrac32)$, close to one over
the number of ways to choose $j$ things from $n$, and by Stirling's formula its logarithm is close to $-n\,h(j/n)$,
with

$$h(p) = -p\ln p - (1 - p)\ln(1 - p)$$

the entropy, in nats, of a coin that falls heads with the probability $p$ (3.8). At $\ell = 0$, $j = 20$ the
logarithm of $\beta_{20}/\beta_0$, prefactors included, is $-27.65$, against $-n\,h = -27.73$.
:::

::: derivation
### Cauchy's determinant and the length of a residual

**The residual from a ratio of determinants.** Let $v_0, v_1, \dots$ be functions with the overlaps
$G_{ik} = \int_0^1v_iv_k\,\dd u$, and let $D_j$ be the determinant of the table $G_{ik}$ with $i, k < j$. Subtracting
from $v_j$ a combination of the lower $v_i$ subtracts the same combination of rows and of columns from the table, which
leaves every determinant unchanged. Done for each $j$ in turn (the method of Gram and Schmidt), it replaces each $v_j$
by its residual $\tilde v_j$, at right angles to the lower ones, and the table becomes diagonal with the entries
$\int\tilde v_j^2\,\dd u = \beta_j^2$. So $D_{j+1} = \beta_0^2\beta_1^2\cdots\beta_j^2$, and

$$\beta_j^2 = \frac{D_{j+1}}{D_j} .$$

**Cauchy's determinant.** For numbers $x_i$ and $y_k$, $i, k = 1, \dots, n$, with no $x_i + y_k$ zero,

$$\det\Bigl[\frac{1}{x_i + y_k}\Bigr] = \frac{\prod_{i<k}(x_k - x_i)(y_k - y_i)}{\prod_{i,k}(x_i + y_k)} .$$

Call the left side $C_n$. We subtract the last row from each other row; since
$1/(x_i + y_k) - 1/(x_n + y_k) = (x_n - x_i)/[(x_i + y_k)(x_n + y_k)]$, row $i < n$ gives out the factor
$x_n - x_i$ and every column $k$ the factor $1/(x_n + y_k)$, which leaves the rows $i < n$ as they were and the last
row all ones. Then we subtract the last column from each other column; since
$1/(x_i + y_k) - 1/(x_i + y_n) = (y_n - y_k)/[(x_i + y_k)(x_i + y_n)]$, column $k < n$ gives out $y_n - y_k$ and
row $i < n$ gives out $1/(x_i + y_n)$, and the last row becomes zeros with a one at its end. Expanding along that row,

$$C_n = \frac{\prod_{i<n}(x_n - x_i)(y_n - y_i)}{\prod_{k\le n}(x_n + y_k)\prod_{i<n}(x_i + y_n)}\;C_{n-1} ,$$

and the formula follows by repeating the step down to $C_1 = 1/(x_1 + y_1)$. For $n = 2$ it gives
$(x_2 - x_1)(y_2 - y_1)/[(x_1 + y_1)(x_1 + y_2)(x_2 + y_1)(x_2 + y_2)]$, which is the direct
$1/(x_1 + y_1)(x_2 + y_2) - 1/(x_1 + y_2)(x_2 + y_1)$ brought over one denominator. The formula is Cauchy's,
from his *Exercices d'analyse et de physique mathématique* of 1841.

**The box's $\beta_j$.** With $x_i = e_i + \tfrac12$ and $y_k = e_k + \tfrac12$ the table is $1/(e_i + e_k + 1)$.
In $D_{j+1}/D_j$ every factor without the index $j$ cancels. What is left is $(e_j - e_i)^2$ above, for each $i < j$,
and below $(e_j + e_i + 1)^2$ for each $i < j$ and $2e_j + 1$ for $i = k = j$:

$$\beta_j^2 = \frac{1}{2e_j + 1}\prod_{i<j}\frac{(e_j - e_i)^2}{(e_j + e_i + 1)^2} ,$$

the square of the formula above. For $\ell = 0$, $j = 1$, with $e_0 = 1$ and $e_1 = 3$, it gives
$\beta_1 = \tfrac{1}{\sqrt7}\cdot\tfrac25$ against $\beta_0 = \tfrac1{\sqrt3}$, the ratio 0.262 of the box.
:::

So a rung stands above the noise while

$$L > n\,[\Lambda + h(p)] ,$$

with $p = j/n$ between 0 and $\tfrac12$. At $\ell = 0$, $p = \tfrac12$ and $h = \ln2$, so each rung costs
$e^{-2\Lambda}$ and $\tfrac14$, $\tfrac1{36}$ from three radii, and the sector holds about $L/(2\Lambda + \ln4)$ rungs,
45 at $10^{70}$. In sector $\ell$ the next rung costs $2\Lambda + \ln[n^2/j(n - j)]$, more than at $\ell = 0$, because
$j(n - j) \le n^2/4$. We count $2\ell + 1$ for each allowed rung, change to $n$ and $p$, with $\ell = n(1 - 2p)$,
$j = np$ and $\dd\ell\,\dd j = n\,\dd n\,\dd p$, and integrate $n$ up to $n_{\max} = L/[\Lambda + h(p)]$:

$$\begin{aligned}
N_2 &\approx \int_0^{1/2}\!\dd p\int_0^{n_{\max}}2n(1 - 2p)\,n\,\dd n\\
&= \int_0^{1/2}\tfrac23(1 - 2p)\,n_{\max}^3\,\dd p ,
\end{aligned}$$

so that

$$\boxed{\;\begin{gathered}
\sym{cell-count}{N_2} \approx \kappa\Bigl(\frac{L}{\Lambda}\Bigr)^3,\\
\sym{cell-constant}{\kappa} = \Lambda^3\int_0^{1/2}\frac{\tfrac23(1 - 2p)\,\dd p}{[\Lambda + h(p)]^3}
\end{gathered}\;}$$

for a large $L$. Both are pure numbers, and from three radii $\kappa = 0.073$.[^kappa] For a far camera
$\Lambda \gg h$ and $\kappa \to \tfrac16$, the count of all polynomials of degree up to $L/\Lambda$. The cell size
follows from $\tfrac43\pi a^3 = N_2d^3$: $d = (4\pi/3\kappa)^{1/3}\,a\Lambda/L$, about $3.9\,a\Lambda/\ln\SNR$.

**The model**, with lengths in units of $a$: each sector's radial profile is any square-integrable function on
$0 \le r \le 1$, the masses sit on the sphere $R_c$, and every ordered pair of directions is one datum with the same
independent noise. A rung's weight $W_j$ is $e^{-(n+2)\Lambda}$ times the root-sum-square of its channels'
coefficients.[^chan] A sector's squared singular values (3.4) are the eigenvalues of $WGW$, with $W$ the diagonal table
of weights and $G_{jk} = 1/(2\ell + 2j + 2k + 3)$ the overlaps of the powers. Each singular value above the mass's over
$\SNR$ counts $2\ell + 1$ times.

::: gap
**Proved** in this model: pairs are complete; the sphere $R_c$ is the best radius; no protocol escapes the inside
residual, because every datum is a sum of the moments $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$; and the residuals
follow from Cauchy's determinant (derived above). **Stated, with its source:** at $\ell = 0$ the exact rate per rung is
the modulus of Grötzsch's ring, by Widom's theorem (below), 3.5804 against the residuals' $2\Lambda + \ln4 = 3.5835$.
**Numerical:** the counts, and a gap $\delta(p) \le 0.0016$ per unit of degree between the exact singular values and
the residuals, which moves $\kappa$ from 0.0733 to 0.0734.
:::

**Widom's theorem** (stated). At $\ell = 0$ the moments are $\int\matter\rho\,r^{2j}\,\dd V$, read with the weights
$t^{2j}$, where $t = a/R_c$. A row of numbers $c_j$ read back through them is the function
$\sum_jc_j\,t^{2j}r^{2j} = \sum_jc_jw^j$ of $w = t^2r^2$, which runs over the segment $0 \le w \le t^2$, while
$\sum_j|c_j|^2$ measures it on the whole unit disc of complex $w$. So the singular values on this rung are those of
the map that restricts a function analytic in the unit disc to the segment $[0, t^2]$, up to factors that grow only as
powers of $j$. Widom proved that for a closed set $E$ inside the unit disc the $j$-th singular value of such a
restriction falls as $e^{-j\mu}$, where $\mu$ is the modulus of the ring between $E$ and the circle, the $\ln(b/a)$
of the annulus $a < |w| < b$ onto which the ring can be mapped without distortion of angles (H. Widom, *Journal of
Approximation Theory* 5, 343, 1972). For a disc $|w| \le s$ this is plain: $w^j$ is $s^j$ at most on the disc, the
rate is $\ln(1/s)$. For the segment $[0, s]$ the ring is Grötzsch's, of modulus

$$\mu(s) = \frac{\pi}{2}\,\frac{K\bigl(\sqrt{1 - s^2}\bigr)}{K(s)} = \ln\frac4s - \frac{s^2}{4} + \cdots ,$$

with $K(k) = \int_0^{\pi/2}(1 - k^2\sin^2\theta)^{-1/2}\,\dd\theta$ the complete elliptic integral of the first kind
(L. V. Ahlfors, *Conformal Invariants*, McGraw-Hill, 1973, chapter 4). A segment is a smaller set than the disc of the same radius, so
functions differ less on it and the singular values fall faster, by the factor $\tfrac14$ more per rung for a short
segment: this is the binomial price of the residual rule at $p = \tfrac12$. At $s = t^2 = \tfrac19$,
$\mu = 3.5804$, against the residuals' $\ln(4/s) = 2\Lambda + \ln4 = 3.5835$: the rung-by-rung count is right to
0.003 per rung, nine parts in ten thousand, and the small error is the term $s^2/4$.

The model gives the table below, and the rung-by-rung count agrees within 2 per cent. The ratio
$N_2/(L/\Lambda)^3$ drifts from 0.14 at $10^6$ to 0.080 at $10^{70}$, toward 0.073. The finite counts depend on how
the tides are normalized, but $\kappa$ does not.

| $\SNR$ | $N_1$ (looking) | $N_2$ (pushing) | $N_2/N_1$ | $d/a$ |
|---|---|---|---|---|
| $10^6$ | 169 | 271 | 1.6 | 0.25 |
| $10^{12}$ | 676 | 1682 | 2.5 | 0.14 |
| $10^{30}$ | 3969 | $2.17\times10^4$ | 5.5 | 0.058 |
| $10^{70}$ | $2.16\times10^4$ | $2.52\times10^5$ | 11.6 | 0.026 |

Each count is at its own reading's $\SNR$: for $N_1$ the static pull's, for $N_2$ that of the energy the mass gains
(section 13.6), which is far smaller. The next section's ceiling bounds both.

The rung-by-rung count can be made by hand. Each rung $(\ell, j)$ gets the amplitude $W_j\beta_j$, its weight times its
residual (with $\beta_j$ for the exponents $e_i = \ell + 2i + 1$), divided by that of the mass, and it counts $2\ell + 1$
cells if that ratio exceeds $1/\SNR$. At $10^6$ ($L = 13.82$) the mass is the only rung of degree 0. The rung
$\int\matter\rho\,r^2\,\dd V$ has the weight $\tfrac19\times1.55$ of the mass's, the 1.55 coming from the channel
coefficients of the tides $(2, 2)$ against $(1, 1)$, and the residual $0.262$, so it stands at $0.045$ and counts.
Down the sector $\ell = 0$ each further rung loses a factor between $e^{-3.3}$ and $e^{-3.5}$, approaching
$\tfrac1{36}$, so the rungs stand at $e^{-6.4}$, $e^{-9.8}$ and $e^{-13.3}$, and five of them, the mass included,
are above $10^{-6} = e^{-13.8}$. Summed over all
sectors the counts are:

| $\SNR$ | pairs, rung by rung | pairs, singular values | one mass, rung by rung | one mass, singular values |
|---|---|---|---|---|
| $10^6$ | 271 | 271 | 203 | 203 |
| $10^{12}$ | 1649 | 1682 | 1191 | 1233 |
| $10^{30}$ | $2.17\times10^4$ | $2.17\times10^4$ | $1.40\times10^4$ | $1.42\times10^4$ |
| $10^{70}$ | $2.508\times10^5$ | $2.515\times10^5$ | $1.56\times10^5$ | $1.59\times10^5$ |

The singular values are those of the sector matrices $WGW$, computed with enough digits (about $2\log_{10}\SNR$ plus
one and a half per rung) that the smallest counted one is exact, and with ten or more rungs beyond the last counted.
The rung-by-rung count falls short of them by at most three per cent. It cannot be far off, because the determinant
of $WGW$, the product of its eigenvalues, is exactly the product of the squared amplitudes $W_j^2\beta_j^2$; only how
the product is shared among the rungs differs.

At $10^{70}$ the stone is resolved into about forty cells along a radius. A detail $d = 0.03a$ is reached by pairs at
$\SNR = 10^{59.4}$.[^Rd] Panel (b) of Figure
[](/paper/#fig:ladder) draws the rungs that pushing adds, a bead for each moment.

{{paper fig:ladder}}

**Known results** (stated). For 13.2's linearized Calderón problem, which is the data of all pairs, Alessandrini
proved logarithmic stability, and Mandache that no method beats a logarithm, up to its exponent
[@Alessandrini1988; @Mandache2001]. The singular values fall as
$\sigma_k \approx \exp[-\Lambda(k/\kappa)^{1/3}] = \exp(-2.62\,k^{1/3})$, the form that Koch, Rüland and Salo proved
for operators this smooth; the constant and the rate $n[\Lambda + h(p)]$ are derived here.

**What it means.** The resolution sharpens as the logarithm of the sensitivity, and the cells resolved grow as its
cube: two laws of three, since the cell size falls as $1/\ln\SNR$ and the cells grow as
$(\ln\SNR)^3$, while the bits grow as $(\ln\SNR)^4$ (13.2). This is what remains
without $\hbar$ of the **holography of information**, quantum gravity's argument that a region's boundary holds
everything inside it: an operation from outside and a reading of the energy, which gives a density and a motion, not a
state (13.6).

::: try {#readable-cells}
Predict first: make the camera a million times more sensitive. Do the cells that pushing resolves grow a million times,
a thousand times, or a few times? And is it worth more to gain that factor in sensitivity or to bring the camera
sphere from three radii to two? Move *Signal-to-noise ratio* from $10^6$ to $10^{12}$,
then from $10^{70}$ to $10^{76}$. Choose a region and press the tick for its ceiling. Slide *Radius of the camera
sphere* down from 3. Last, switch on *Black hole*.
:::

## The same residual rule counts the bits of a second reading

We want the bits that pushing gives, by section 3.8's rule, now that each rung's cost is known. Section
[13.2](/tutorial/what-a-field-keeps/calderon/#the-bits-of-a-second-reading-grow-as-the-fourth-power-of-the-logarithm)
counted them by giving every moment of degree $n$ the amplitude $e^{-n\Lambda}$, as if each were read alone, and found
$L^4/24\Lambda^3\ln2$. The residual is the part of a moment that is read alone, so we put it in.

**The rule.** We assume, as for the cells, that **the rungs of a sector are read as independent numbers with the
amplitudes of their residuals**. A number read with the ratio $s$ of signal to noise carries $\tfrac12\log_2(1 + s^2)$
bits (section [3.8](/tutorial/noise/bits/)),
and about $\log_2s$ where $s \gg 1$. The rung $(\ell, j)$ is read at $s = \SNR\,e^{-n[\Lambda + h(p)]}$, so it carries
about $(L - n[\Lambda + h(p)])/\ln2$ bits, $2\ell + 1$ times, while that is positive. With the change to $n$ and $p$
of the cell count, the bits are

$$H_2 \approx \frac{1}{\ln2}\int_0^{1/2}\!\dd p\int_0^{n_{\max}}2n^2(1 - 2p)\bigl(L - n[\Lambda + h(p)]\bigr)\,\dd n .$$

The inner integral, with $g = \Lambda + h(p)$ and $n_{\max} = L/g$, is
$2(1 - 2p)\bigl[\tfrac13Ln_{\max}^3 - \tfrac14gn_{\max}^4\bigr] = (1 - 2p)L^4/6g^3$. Comparing with the boxed $\kappa$,

$$\boxed{\;H_2 \approx \frac{\kappa}{4\Lambda^3}\,\frac{L^4}{\ln2} = N_2\,\frac{\ln\SNR}{4\ln2}\;}$$

for a large $L$, in bits. Every factor is a pure number. The second form says that each resolved cell's mean density
is known, on average, to a quarter of the $\log_2\SNR$ bits of the mass: a rung at the edge carries nothing and one
near the mass nearly all. For a far camera $\kappa \to \tfrac16$ and $H_2 \to L^4/24\Lambda^3\ln2$, section 13.2's
count, which is therefore the limit in which the residuals cost nothing beside the distance.

**One rung.** At $10^6$ the moment $\int\matter\rho\,r^2\,\dd V$ read alone would stand at $\tfrac19$ of the mass and
carry $\log_2(10^6/9) = 16.8$ bits. Its residual amplitude is $0.045$ (the hand count above), so it carries
$\tfrac12\log_2[1 + (4.5\times10^4)^2] = 15.5$ bits. The price is small on the first rungs and grows with $n$.

**Two protocols.** With masses held in pairs, the threshold is the cells' $n[\Lambda + h(p)]$ and
$\kappa/4\Lambda^3 = 0.0138$. With **one mass at a time**, held at every distance outside $R_c$, the rungs of one
pattern are told apart only by how the energy falls off with the distance $s$ of the mass, as the powers $s^{-(n+4)}$
(section [13.3](/tutorial/what-a-field-keeps/ladder/#a-mass-held-for-an-instant-is-a-tide-of-every-degree-so-it-climbs-the-whole-ladder)).
For masses spread evenly through the volume outside $R_c$ these are, in $u = R_c/s$, the powers $u^{\ell+2j+2}$ with
the weight $\dd u$, whose exponents again step by two. So the same Cauchy residual is paid a second time, outside,
the threshold is $n[\Lambda + 2h(p)]$, and $\kappa/4\Lambda^3$ becomes $\int_0^{1/2}(1 - 2p)\,\dd p/6[\Lambda +
2h(p)]^3 = 0.0082$. Summed rung by rung, with the exact residuals and the weights of each protocol, and checked against
the singular values of the same model:

| $\SNR$ | read alone (13.2) | one mass, rung by rung | one mass, singular values | pairs, rung by rung | pairs, singular values |
|---|---|---|---|---|---|
| $10^6$ | 2580 | 1296 | 1319 | 1614 | 1616 |
| $10^{12}$ | $3.32\times10^4$ | $1.34\times10^4$ | $1.37\times10^4$ | $1.83\times10^4$ | $1.84\times10^4$ |
| $10^{70}$ | $3.19\times10^7$ | $9.39\times10^6$ | $9.59\times10^6$ | $1.490\times10^7$ | $1.492\times10^7$ |

For the one-mass singular values the sector matrix is $WG_{\rm out}WG$, with $G_{\rm out} = 1/(2\ell + 2j + 2k + 5)$
the overlaps of the powers of $u$, and the bits are $\tfrac12\log_2(1 + \SNR^2\sigma^2/\sigma_0^2)$ summed over every
singular value $\sigma$, with $\sigma_0$ the mass's.

**The counts this book gives.** One mass at a time gives about 1300 bits at $10^6$ and $9.6\times10^6$ at
$10^{70}$; pairs give about 1600 and $1.5\times10^7$. Both stay well below the $2580$ and $3.19\times10^7$ of
section 13.2, which is an upper bound, reached only if the rungs were read alone. The estimate $N_2L/4\ln2$ checks
the counts at $10^{70}$: $2.515\times10^5\times58.1 = 1.46\times10^7$ for pairs and $1.59\times10^5\times58.1 =
9.2\times10^6$ for one mass, within two and four per cent. At $10^6$, where only twelve degrees are read, the estimate
is too low by a sixth for pairs and a quarter for one mass, as section 13.2's leading term was. Against the first reading's 1176 and $1.685\times10^6$ bits (section
3.8), pushing adds a tenth to a third at $10^6$ and a factor of six to nine at $10^{70}$: the inside, read through residuals, is a
volume's worth of numbers, but each holds only a quarter of the bits.[^bits2]

## Quantum mechanics caps the sensitivity by the area of the region

We want a ceiling on $\SNR$ that no measurement can pass. Section 8.6 found that a strength $\theta$ entering through an interaction $\theta V$ for a time $\tau$ obeys $\theta/\sigma_\theta \le 2\theta\sigma_V\tau/\hbar$, with
$\sigma_V$ the spread of $V$ in the camera's state. **A value confined between $V_{\min}$ and $V_{\max}$ has a spread
of at most half the range**: its mean square distance from its own mean is no more than that from the midpoint, which
is at most $\tfrac14(V_{\max} - V_{\min})^2$. So

$$\frac{\theta}{\sigma_\theta} \le \frac{\theta\,(V_{\max} - V_{\min})\,\tau}{\hbar} .$$

Boixo, Flammia, Caves and Geremia proved this bound for every strategy, entangled probes included (stated).

Take $\theta$ to be the scene's mass $\sym{source-mass}{\matter M_s}$, read through its pull by a camera of mass
$\matter m$ whose centre is at least $z$ from the scene. The coupling per kilogram of scene is $-G\matter m/r$, with a
range of at most $G\matter m/z$. The camera must fit within the distance $z$, so 11.1's bound $\matter m < zc^2/2G$
for a body that is not a black hole makes that range at most $c^2/2$. So $\SNR \le \matter M_sc^2\tau/2\hbar$, 8.6's result: $1.3\times10^{70}$ for the person watched for the age of the
universe.

**Inside a region.** Let the whole experiment fit in a ball of radius $\ell_{\rm r}$, in metres, for as long as a
signal can go from the centre to the edge and back, the time $2\ell_{\rm r}/c$. The events that a signal sent from one
event can reach, and that can send a signal to one later event, form a **causal diamond**. If no horizon forms, the
scene has $\matter M_s \le \ell_{\rm r}c^2/2G$ (11.1). With $\tau \le 2\ell_{\rm r}/c$ and the **Planck length**
$\sym{planck-length}{\ell_P} = \sqrt{\hbar G/c^3} = 1.6\times10^{-35}$ m,

$$\boxed{\;\SNR \le \frac{\ell_{\rm r}^2}{2\ell_P^2} = \frac{S_{\rm BH}}{2\pi}\;}$$

where $\sym{area-entropy}{S_{\rm BH}} = 4\pi\ell_{\rm r}^2/4\ell_P^2$ is the Bekenstein–Hawking entropy of a sphere of
that area, section [11.3](/tutorial/black-holes/hawking/#a-hovering-observer-near-the-horizon-finds-empty-space-warm)'s
quarter of an area in Planck units (stated there), a pure number. The ceiling is $1.9\times10^{69}$ for a region of
radius one metre, $1.7\times10^{70}$ for three metres, and $8.1\times10^{120}$ for the diamond that holds a camera
watching for the age of the universe. It is never reached, because equality needs the scene and the camera each on the
edge of being a black hole, and together they would form a horizon. A person, 70 kg against the $2\times10^{27}$ kg
that three metres allow, is far from it.

The ceiling bounds pushing too: a weighing reads the gained mass $\Delta E/c^2$, so its $\SNR$ is at most
$\Delta E\,\tau/2\hbar$. Ng and Lloyd reached the same form by counting a region's operations (stated).

## Ordinary matter is holographically sparse, and a black hole shows seven numbers

With the ceiling in the cell law, a stone of radius $\ell_{\rm r}/3$ read from three radii in the region has

$$\boxed{\;N_2 \lesssim \kappa\Bigl[\frac{\ln(S_{\rm BH}/2\pi)}{\Lambda}\Bigr]^3\;}$$

cells.[^sparse]

| Region of radius $\ell_{\rm r}$ (the stone a third of it) | $S_{\rm BH}$ | $\ln\SNR$ at the ceiling | Cells $N_2$ |
|---|---|---|---|
| one metre | $1.2\times10^{70}$ | 160 | $2.4\times10^5$ |
| the Earth's | $4.9\times10^{83}$ | 191 | $4.1\times10^5$ |
| the Sun's | $5.8\times10^{87}$ | 200 | $4.8\times10^5$ |
| the Milky Way's, $5\times10^{20}$ m | $3.0\times10^{111}$ | 255 | $9.7\times10^5$ |
| the Hubble radius, $1.37\times10^{26}$ m | $2.3\times10^{122}$ | 280 | $1.28\times10^6$ |

A stone that is not itself a black hole has the ceiling $S_{\rm BH}/6\pi$, about 2 per cent fewer cells. The area grows by $10^{52}$ and the cells by a factor of five (Figure [](#fig:cells-vs-snr)).
We call this **holographic sparseness**: what a field shows of ordinary matter is a power of the logarithm of the area,
far below the $(A/\ell_P^2)^{3/4}$ that stable matter can hold ('t Hooft, stated) and the $A/4\ell_P^2$ of a black
hole. "Sparse" is about what can be read, not what is there.

![Look first at how close the two curves stay: pushing passes looking between $10^3$ and $10^6$ and beats it by a
factor of about twelve only at the ceiling. Dashed: the law $0.073(L/\Lambda)^3$ that pushing approaches. The
curves are counted; the discs are drawn to scale.](tut-cells-vs-snr){#fig:cells-vs-snr}

**The black hole.** A hole at rest shows seven numbers at one time, its mass, spin and place
([11.2](/tutorial/black-holes/spin/#a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in)), so at most $7\log_2\SNR$ bits: about 1450 for 13.7's 0.905 K hole,
read from a few horizon radii. Its **microstates**, the quantum states that share these numbers, number about $e^S$,
and telling them apart "may require an accuracy that scales exponentially with $S$" (Raju, stated), where the ceiling
allows about $S$. Whatever more the outside holds is of order $\hbar$ and leaves, if at all, by counting quanta, about a bit each
([8.6](/tutorial/quantum/quantum-limit/#a-measurement-is-a-set-of-positive-tables-that-add-to-one-and-a-gravitons-click-carries-about-a-bit)).

Four arguments from quantum gravity say that the outside holds more (stated). Laddha, Prabhu, Raju and Shrivastava
argued that whatever massless particles will carry out to infinity can be learnt there before they arrive, from
correlations of the energy with the waves [@LaddhaEtAl2021]. Chowdhury, Papadoulaki and Raju gave a protocol by which
observers near the boundary of a space with a negative cosmological constant find the state inside by simple
operations there and a measurement of the energy [@ChowdhuryPapadoulakiRaju2021]. Donnelly and Giddings showed that the
state of one particle can be rebuilt from the metric far away, through its momentum and its centre of energy
[@Donnelly2018]. Calmet and co-authors found that quantum corrections to the field outside an ordinary body depend on
its density profile, where the classical field does not [@CalmetEtAl2022]. The first two have no classical
counterpart for a reading at one time, by the shell theorem; an impulsive tide followed by a weighing is what remains
of them without $\hbar$, an operation from outside and then a reading of the energy. It needs time, where they need
next to none, and it gives a density and a motion, not a state.

## Gravity cannot decohere a ball and a shell

We want to know when a camera ends a superposition. If two branches leave a record in the states $|e_1\rangle$ and $|e_2\rangle$, their interference is multiplied by the
overlap $\langle e_1|e_2\rangle$ (8.1); the loss of interference is decoherence. A camera's pointer is the part whose position $y$, in metres, shows the reading. Its state
after a reading, a **pointer state**, is a wave packet $\varphi(y) = (2\pi\sigma_y^2)^{-1/4} e^{-(y -
y_0)^2/4\sigma_y^2}$ about the reading $y_0$, whose $|\varphi|^2$ is a bell curve of standard deviation
$\sym{pointer-spread}{\sigma_y}$. Let the branches leave readings $\Delta y$ apart, with $y_0 = 0$ in one. The
exponents of $\varphi(y)\,\varphi(y - \Delta y)$ add, and completing the square,

$$y^2 + (y - \Delta y)^2 = 2\bigl(y - \tfrac12\Delta y\bigr)^2 + \tfrac12\Delta y^2 ,$$

leaves a bell curve of area one and

$$\boxed{\;\langle e_1|e_2\rangle = e^{-\Delta y^2/8\sigma_y^2}\;}$$

a pure number: 1 when the readings agree, 0.88 at $\Delta y = \sigma_y$ and 0.044 at $5\sigma_y$. With
$\Delta y/\sigma_y$ the camera's $\SNR$ for the difference of the branches, the overlap is $e^{-\SNR^2/8}$: a perfect camera is a perfect source of decoherence.[^dec]

**The impossibility.** Put a body into a superposition of a ball and a shell of one mass and energy. The field
outside is the same in both branches at every instant (2.5), and throughout a round motion that makes the superposition
(Birkhoff), so no graviton is emitted. Every reading at one time has $\Delta y = 0$, and the record's overlap is one.
What can still differ outside are readings at two times, the tremor and the response to a tide. Heat
and the zero point shake a ball and a shell unequally, so a reading that resolves the tremor would keep a record. For
a cold body, or readings that do not resolve the tremor, the way by record is closed, save for tides
from outside, which the branches answer differently, as dust answers a fast tide (4.5).

**A superposition that is not round** does leave a record by radiation, and an estimate shows how faint it is. Let the
branches differ by a quadrupole $\Delta Q$, in $\mathrm{kg\,m^2}$, made and undone in a time $T$. By the quadrupole
formula ([section 7.7](/tutorial/geometry/quadrupole-formula/)) the power is about $(G/c^5)(\Delta Q/T^3)^2$, so the
energy radiated is about $G\,\Delta Q^2/c^5T^5$, in gravitons of energy about $\hbar/T$. Their number is

$$N \approx \frac{G\,\Delta Q^2}{\hbar c^5T^4} = \Bigl[\frac{\Delta Q}{m_P\,(cT)^2}\Bigr]^2 ,$$

a pure number, with the Planck mass $m_P = \sqrt{\hbar c/G} = 2.2\times10^{-8}$ kg. The record is kept only if $N$
reaches about one. For the glass bead below, of $9.2\times10^{-15}$ kg, moved by a micrometre and back in a second,
$\Delta Q \approx 9\times10^{-27}\unit{kg\,m^2}$ against $m_P(cT)^2 = 2\times10^9\unit{kg\,m^2}$, and
$N \approx 10^{-71}$. Belenchia and co-authors showed that a distant camera cannot read such a branch faster than this
record allows, provided the gravitons are quantized and vacuum fluctuations stop any probe from being localized better
than about a Planck length; Danielson, Satishchandran and Wald described the same decoherence by the soft gravitons
that the branches leave [@Belenchia2018; @DanielsonSatishchandranWald2022] (stated).

**What does differ** is the measure by which Diósi and Penrose proposed that gravity itself ends superpositions, the
**Diósi–Penrose energy** $\sym{diosi-penrose-energy}{E_G}$: the gravitational self-energy of the difference of the
two densities [@Diosi1987; @Penrose1996]. Penrose estimates the time of the collapse as $\hbar/E_G$. For a ball and a
shell of mass $\matter M$ and radius $R$ the fields agree outside (Figure [](#fig:dp-fields)), the shell's is zero
inside, and the ball's is $G\matter Mr/R^3$ (section 1.3), so with $\int_0^Rr^4\,\dd r = R^5/5$,

$$\boxed{\;\begin{aligned}
E_G &= \frac{1}{8\pi G}\int|\field{\vect g}_1 - \field{\vect g}_2|^2\,\dd V\\
&= \frac{1}{8\pi G}\Bigl(\frac{G\matter M}{R^3}\Bigr)^2\frac{4\pi R^5}{5} = \frac{G\matter M^2}{10R}
\end{aligned}\;}$$

in joules.[^dp] For a glass bead of radius 1 μm and density 2200 kg m⁻³, $\matter M = 9.2\times10^{-15}$ kg, $E_G = 5.7\times10^{-34}$
J and $\hbar/E_G = 0.19$ s, a fifth of a second.[^density] The factor in front of $E_G$ is a convention, and conventions that differ by two move the time by two. A bead that only breathes, a ball of radius $R$ against one of $R + \delta$, has inside the difference
$3G\matter M\delta r/R^4$ to first order in $\delta$, so $E_G = \tfrac{9}{10}(\delta/R)^2G\matter M^2/R$, and the
time is longer by $R^2/9\delta^2$, $1.1\times10^5$ at $\delta/R = 10^{-3}$.

![Look first at the shaded triangle: the two fields differ only inside, and the square of that difference, integrated,
is $E_G = G\matter M^2/10R$. Exact curves.](tut-dp-fields){#fig:dp-fields}

The simplest form of the proposal, with no free length, has been excluded by experiment
[@DonadiEtAl2021]. A collapse of this kind would shake the charged particles of a body at random and make them radiate
faintly; a germanium detector shielded deep under the Gran Sasso mountain saw too little of that radiation for the
model in which each nucleus's mass is spread over the nucleus's own size, and the proposal survives only with a free length added (stated).
A round change of the density with no change of mass, the ball against the shell, is also the kind of disturbance
noted, for dark matter, as the most robust against decoherence by gravity [@AllaliHertzberg2020] (stated). **What it means.** Such a pair would separate two ways in which gravity
might end a superposition: by a record, which is closed, or by a collapse of Diósi and Penrose's kind, which is not.

::: try {#same-outside}
Under *Round bodies*, keep *Ball* for A. Before you choose *Shell* for B, predict: does the field outside hold a
record of which one the body is, and what is B ÷ A for a quadrupolar kick? Then choose *Shell* and compare the rows,
and read *Thermal tremor of the quadrupole*.
:::

**The idea to keep: looking at a body gives a hologram that loses the null space, and in Einstein's theory watching
adds nothing; pushing reaches the inside, but its cells grow only as the cube of the logarithm of a sensitivity that
quantum mechanics caps by the region's area. So ordinary matter is holographically sparse, a black hole shows seven
numbers, and a ball and a shell leave gravity no record yet differ in their Diósi–Penrose energy, so such a pair would
tell an ending by record from one by collapse.**

::: problems
### Practice

**[13.8]** From three radii at $\SNR = 10^{70}$, with masses held in pairs, how many cells does pushing resolve, and how
large is each? And why can the field outside not decohere a cold ball and shell of the same mass and energy?

::: solution
About $2.5\times10^5$, each 0.026 of the radius. Every reading at one time is the same in both branches, so
$\Delta y = 0$ and the record's overlap is one.
:::

**[13.8]** Find the Diósi–Penrose time for a silicon sphere of radius 10 μm and density 2330 kg m⁻³ in a superposition of a
ball and a shell, and for the same sphere breathing by one part in a thousand.

::: solution
$\matter M = 9.8\times10^{-12}$ kg, $E_G = G\matter M^2/10R = 6.4\times10^{-29}$ J and
$\hbar/E_G = 1.7\times10^{-6}$ s. Breathing multiplies the time by $R^2/9\delta^2 = 1.1\times10^5$, to 0.18 s.
:::

**[13.8]** Pushing in pairs from three radii resolves $1682$ cells at $\SNR = 10^{12}$. Estimate the bits with
$H_2 \approx N_2\ln\SNR/4\ln2$, and say why the estimate falls below the rung-by-rung $1.83\times10^4$.

::: solution
$\ln10^{12} = 27.6$, so $H_2 \approx 1682\times27.6/2.77 = 1.68\times10^4$, eight per cent low. The estimate keeps
only the leading power of $L$; with 25 degrees read, the rungs near the mass, which carry nearly the full
$\log_2\SNR$ each, are a larger share than the integral allows.
:::

**[13.8]** Estimate the gravitons radiated when a bead of $10^{-14}$ kg is moved by $1\unit{\mu m}$ and back in
$1\unit{ms}$, and say whether they keep a record.

::: solution
$\Delta Q \approx 10^{-26}\unit{kg\,m^2}$ and $m_P(cT)^2 = 2.2\times10^{-8}\times(3\times10^5)^2 = 2\times10^3\unit{kg\,m^2}$,
so $N \approx (5\times10^{-30})^2 \approx 10^{-59}$: no record.
:::

### Stretch

**[13.8]** With Cauchy's determinant, find $\beta_2/\beta_1$ in the sector $\ell = 0$, and compare the factor lost per
rung, with the weight $t^2 = \tfrac19$, against Grötzsch's $e^{-\mu(1/9)} = e^{-3.5804}$.

::: solution
With $e = 1, 3, 5$, $\beta_1 = \tfrac{1}{\sqrt7}\cdot\tfrac25$ and $\beta_2 = \tfrac{1}{\sqrt{11}}\cdot\tfrac47\cdot\tfrac29$,
so $\beta_2/\beta_1 = 0.253$. Times $\tfrac19$ it is $0.0281 = e^{-3.57}$, already within 0.01 of Grötzsch's rate,
toward which the ratios $0.262, 0.253, 0.252, \dots \to \tfrac14$ tend.
:::

**[13.8]** With sections 8.6 and 11.1, find the ceiling on reading the Earth's mass within a region of three Earth radii, over
the time $2\ell_{\rm r}/c$, and the cells that pushing in pairs could then resolve inside the Earth from three radii.

::: solution
$\SNR \le \matter M_Ec\,\ell_{\rm r}/\hbar$, and $\ell_{\rm r} = 1.9\times10^7$ m gives $3.2\times10^{74}$, so
$\ln\SNR = 171.6$ and $L/\Lambda = 156$. With the counted ratio of about 0.080, $N_2 \approx 0.080\times156^3 =
3.0\times10^5$ cells, so $d = (4\pi/3N_2)^{1/3} = 0.024$ of the Earth's radius, about 153 km.
:::

### The camera

**[13.8]** Derive $E_G = G\matter M^2/10R$ for a ball and a shell, then check the time of a fifth of a second for a
glass bead a micrometre in radius, and the lengthening by $R^2/9\delta^2$ for a bead that only breathes.

::: solution
The [last section](#gravity-cannot-decohere-a-ball-and-a-shell) derives both. With 2200 kg m⁻³ the time is 0.19 s. For
the breathing, $|\field{\vect g}_1 - \field{\vect g}_2| = 3G\matter M\delta r/R^4$ inside, so $E_G$ is $9(\delta/R)^2$
times the ball and shell's $G\matter M^2/10R$.
:::
:::

::: paper
- [Section XV](/paper/#sec:holography): [*Black holes and the classical limit*](/paper/#par:black-holes-and-the-classical-limit)
  and [*What gravity cannot decohere*](/paper/#par:what-gravity-cannot-decohere).
- [Section IV](/paper/#sec:near-field), [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity): the ceiling and
  the perfect source of decoherence.
- [Section XIII](/paper/#sec:second-order) and [Section XII](/paper/#sec:hair): the impulses in pairs, the bits of a
  second reading, and the seven numbers.
:::

::: deeper
- The GR course's [section
  18.6](https://neovand.github.io/general-relativity/chapter-18.html#18-6-why-a-violently-breathing-sphere-still-does-not-radiate-tensor-waves)
  on a breathing sphere, [section
  17.1](https://neovand.github.io/general-relativity/chapter-17.html#17-1-solving-spherical-vacuum-where-schwarzschild-comes-from)
  on Birkhoff, and [section
  22.10](https://neovand.github.io/general-relativity/chapter-22.html#22-10-the-information-question-without-assuming-quantum-mechanics)
  on horizons and information.
- R. Bousso et al., arXiv:1209.4641: the classical, non-gravitational limit. V. Wens, *NeuroImage* 270, 119953
  (2023). H. Koch, A. Rüland and M. Salo, arXiv:2012.01855: stability and singular values.
- S. Boixo, S. T. Flammia, C. M. Caves and J. M. Geremia, *Physical Review Letters* 98, 090401 (2007): the bound.
  Y. J. Ng, *Physical Review Letters* 86, 2946 (2001) and *Entropy* 21, 1035 (2019), and S. Lloyd, *Physical Review
  Letters* 88, 237901 (2002): operations in a region.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XV
    ([*Holography*](/paper/#sec:holography)), in plain words; the counts that follow are derived here.

[^Lambda]: Not the cosmological constant; $a$ is not Kerr's $a$.

[^hyperbolic]: Not the hyperbolic geometry of the near field.

[^birkhoff]: This reading of Birkhoff's theorem is derived here; its ingredients are the theorem and Newton's shell
    theorem.

[^dec]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, *Limits on sensitivity*.

[^dp]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equation [](/paper/#eq:dp-energy).

[^bd]: L. Blanchet and T. Damour, *Annales de l'Institut Henri Poincaré A* 50, 377 (1989). For a body held by its own
    gravity, gravity's force adds the potential energy to the conservation identities, negligible for a stone.

[^twotimes]: An impulse here is a tide, heat at a known temperature, or the zero point. A body turning at a known rate
    shows the first rung (13.4).

[^passive]: At order $1/c^{2k}$ Blanchet's expansion adds Almansi's rung
    $\int r^{\ell+2k}Y_\ell\,\partial_t^{2k}\matter T^{00}\,\dd V$ of the changing part (stated). For the 10 cm steel
    ball ringing at 12.6 kHz the first rung of degree two is $5\times10^{-11}$ of its moment, where a tide from three
    radii pays $\tfrac19$. This reading is derived here.

[^own]: This count is derived here; its ingredients are the impulse formula of 13.6, 13.3's ladder, Cauchy's
    determinant, Wens's cut-off and Mandache's comparison of the data with the densities.

[^single]: Each rung then pays its residual a second time, outside: the threshold is $n[\Lambda + 2h(p)]$,
    $\kappa = 0.043$, and $1.6\times10^5$ cells at $10^{70}$.

[^kappa]: Not 13.2's decay rate $\kappa$.

[^chan]: The coefficient of the channel of degrees $\ell_1$, $\ell_2$ is
    $(4\pi)^2(j + 1)(2\ell + 2j + 3)\,|\mathcal G|/(2\ell_1 + 1)(2\ell_2 + 1)$, with $\mathcal G$ the Gaunt
    coefficient of two patterns, from 2.2's expansion of $1/|\vect x - \vect y|$.

[^Rd]: A hundredth of the stone's radius, $d = 0.01a$, would need about $10^{182}$.

[^bits2]: The counts for one mass at a time were first given in *The gravitational camera* (Mohsenvand 2026),
    Sec. XIII, [*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading); the residual rule for
    bits and the counts for pairs are derived here.

[^sparse]: This count is derived here, from the ceiling of Ng, Lloyd and Boixo et al. and the cell law, for a camera at
    a fixed multiple of the radius.

[^density]: Soda-lime glass, 2500 kg m⁻³, gives 0.14 s: the time goes as the inverse square of the density.
