---
id: '13.8'
title: 'Holography and decoherence'
question: 'Section XV says that, in quantum gravity, "everything inside a region of space can, in principle, be learnt at the region''s boundary", and asks "what is left of the idea in ordinary, non-quantum physics". How much of a body''s inside does its field outside hold, once noise, the speed of light and quantum mechanics are counted, and why can gravity not decohere a ball and a shell?'
part: '13'
requires: ['2.3', '2.4', '2.5', '3.8', '6.5', '8.1', '8.6', '11.1', '11.2', '13.1', '13.2', '13.3', '13.6', '13.7']
paper: [sec:holography, eq:dp-energy, eq:split, eq:hair-bits, tab:hair, fig:hair, fig:ladder, eq:ladder, eq:dust, eq:push, sec:hair, sec:second-order, sec:near-field, sec:status]
figures: [fig:hair, fig:ladder]
live: [readable-cells, same-outside]
depth: A
---

**What you need:** chapters
[2.3](/tutorial/outside/multipoles/#each-degree-has-a-ceiling-lower-than-the-last-by-the-size-over-the-distance) (the
fade of each degree),
[2.4](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage)
(balayage),
[2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see) (the
null space), [3.8](/tutorial/noise/bits/#a-bodys-field-at-one-time-holds-about-1200-bits-from-three-radii-away) (bits),
[8.1](/tutorial/quantum/states/#a-record-of-the-place-multiplies-the-interference-by-the-overlap-of-the-records)
(records and decoherence),
[8.6](/tutorial/quantum/quantum-limit/#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera)
(the quantum speed limit),
[11.1](/tutorial/black-holes/schwarzschild/#outside-a-round-body-einsteins-field-is-fixed-by-the-mass-alone) (Birkhoff),
[13.1](/tutorial/what-a-field-keeps/push-and-pass/#a-mass-held-for-an-instant-leaves-energy-through-a-kernel-that-is-not-harmonic)
(the held mass),
[13.2](/tutorial/what-a-field-keeps/calderon/#fine-detail-still-costs-exponentially-the-two-readings-remove-the-ambiguity-and-keep-the-blur)
(logarithmic stability) and
[13.3](/tutorial/what-a-field-keeps/ladder/#a-mass-held-for-an-instant-is-a-tide-of-every-degree-so-it-climbs-the-whole-ladder)
(the ladder); chapters 6.5, 11.2, 13.6 and 13.7 are recalled where used, and 5.2, 11.3 and 12.1 help.

Put a stone of radius $a$, in metres, at the centre of a glass sphere of radius $R_c = 3a$ whose surface is covered
with cameras. Section XV's plain words suppose that a camera reads the field on a sphere of radius $R$ "with detail
down to a size $d$". Then the field "carries about $(R/d)^2$ such numbers", while the inside, "cut into cells of size
$d$, holds about $(R/d)^3$ cells". With $R/d = 100$ that is ten thousand numbers against a million cells, which fill
the reading sphere $R = R_c$. The stone holds about $1.6\times10^5$ of them.

So we ask how much of the stone's inside its field outside holds, once noise, the speed of light and quantum mechanics
are counted, and why gravity cannot decohere a ball and a shell. A camera's **signal-to-noise ratio** $\SNR$ is its
reading over its noise (3.8), and **pushing** is 13.1's protocol: masses held near the stone for an instant, then a
weighing. At the paper's ceiling, $\SNR = 10^{70}$, looking reads $2.2\times10^4$ numbers and pushing about
$2.5\times10^5$ cells, each 0.026 of the radius across, each count at its own reading's $\SNR$. Pushing gains about
twelve, not a hundred.

::: plain
A hologram is a film from which a picture with depth can be rebuilt. The pull outside a stone equals the pull of a
thin layer of mass on a sphere around it, so the layer is a hologram of the pull. It is a poor one, because many
different stones make the same layer. In Einstein's theory, watching for longer does not help.

A tide is the difference in the pull of gravity across a body. Brief tides followed by a weighing reach the inside,
but each finer detail is fainter by a fixed factor. So the details grow only as the cube of the number of digits of
the camera's precision, and quantum mechanics limits that precision by the region's area in Planck units. By this
tutorial's count, ordinary matter shows at most about a million details, and a black hole shows seven numbers.

A body in a superposition is in two states at once. A ball and a shell of one mass and energy pull alike outside, so
gravity keeps no record of which one a body is, and cannot end their superposition that way. Diósi and Penrose proposed
that gravity also ends superpositions by a collapse, set by an energy that does differ for the pair. So the pair would
tell the two ways apart.
:::

## Looking at a body gives a hologram that loses the null space

We want what the field outside a body holds at one moment. A **hologram** is a record on a surface from which a field
in the volume beyond it can be rebuilt. Chapter 2.4 swept a point mass $\matter m$ at $\vect s$, inside a sphere of
radius $R$, onto the sphere as a skin of surface density $\matter m\,P(\vect x, \vect s)$, with $P$ the ball's kernel,
and the skin pulls outside exactly as the mass does: this is balayage. Each piece of a body sweeps the same way, so a
density $\sym{density}{\matter\rho}$ inside the sphere becomes the skin

$$\matter\sigma(\vect x) = \int\matter\rho(\vect s)\,P(\vect x, \vect s)\,\dd V ,$$

in kilograms per square metre. The skin holds the whole field outside, so it is a hologram in the literal sense.

It is a hologram that loses information. Because $P$ reproduces harmonic functions (2.4), the skin's moment
$\oint\matter\sigma\,h\,\dd A$ against any $h$ harmonic in the ball equals the body's $\int\matter\rho\,h\,\dd V$. On
the sphere $r^\ell Y_{\ell m}$ is $R^\ell Y_{\ell m}$, so the skin's components on the patterns $Y_{\ell m}$ are the
body's multipole moments over $R^\ell$. A function on a sphere is fixed by these components (2.2), so the skin and the
moments fix each other. Two densities with the same harmonic part, which differ by 2.5's confined Laplacian
$\nabla^2\field\psi/4\pi G$, sweep to the same skin. The hologram loses exactly 2.5's null space.

**The count.** For a camera sphere of radius $R_c$ let $\Lambda = \ln(R_c/a)$, a pure number, 1.10 from three
radii.[^Lambda] Chapter 2.3 found that the moments of degree $\sym{degree}{\ell}$, $2\ell + 1$ of them, reach the
camera at most $e^{-\ell\Lambda}$ as strongly as the monopole. With the monopole read at $\sym{snr}{\SNR}$ and
$L = \ln\SNR$, degree $\ell$ stands above the noise while $\ell\Lambda < L$. Summing $2\ell + 1$ up to
$\lfloor L/\Lambda\rfloor$ gives a square:

$$\boxed{\;\sym{looking-count}{N_1} = \bigl(\lfloor L/\Lambda\rfloor + 1\bigr)^2\;}$$

numbers, a pure count. From three radii it is $13^2 = 169$ at $10^6$, the beads of the paper's Figure
[](/paper/#fig:hair)(b), and $147^2 = 21{,}609$ at $10^{70}$. For a check, a camera so far away that $\Lambda > L$
reads one number, the mass. The count grows as $L^2$, like the patterns on a surface, and none of the numbers is a
cell of the interior. Wens found the same cut-off in imaging the brain's magnetic field, with the logarithm of
a ratio of variances, the square of an $\SNR$, over $2\Lambda$, and the same count for a full sphere (stated).

{{paper fig:hair}}

**What it means.** The paper's $(R/d)^2$ against $(R/d)^3$ treats the detail $d$ as free. At a given sensitivity it is
not: the [third section](#pushing-reads-the-volume-but-only-to-a-number-of-cells-set-by-the-logarithm) finds it.

## The speed of light does not add the third dimension

A field that travels at the speed $c$ carries news of each moment outward, so perhaps a camera that watches long
enough sees the inside unfold. We test this with two scenes. In the first, the stone turns by a round motion from a
uniform ball into a thin shell and back. In the second it rests, with the same total energy, kinetic
and binding energy included.

An equation like Poisson's, whose field everywhere follows the sources at once, is **elliptic**; the wave equation,
whose news travels at a finite speed, is **hyperbolic**.[^hyperbolic] Einstein's theory is hyperbolic. Yet outside
both stones the field is Schwarzschild's at every moment, by 11.1's Birkhoff theorem, so the two scenes give identical
records forever. **Birkhoff's theorem is the shell theorem of Einstein's equations.**[^birkhoff] It says that any round
region of empty space holds Schwarzschild's static field, fixed by the mass. It says nothing of motions that are not
round, or of a stone that sends out sound or light.

**What would tell them apart.** Take a scalar theory with retardation, whose potential obeys 5.2's wave equation
$c^{-2}\partial_t^2\field\Phi - \nabla^2\field\Phi = -4\pi G\matter\rho$ with $\matter\rho$ conserved. Chapter 5.2's
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
the breathing note of chapter 4.5's steel ball, of radius 10 cm, about 24 kHz, $\ddot I_r$ is at most $\tfrac65\matter
Ma\delta\omega^2$, and the ripple is $\tfrac15(\omega a/c)^2(\delta/a) = 5\times10^{-13}$ of the static pull.

**Why Einstein's theory hides it.** Chapter 6.5's $\sym{stress-energy-tensor}{\matter T}^{\mu\nu}$ holds the energy
density $\matter T^{00}$, $c$ times the momentum density $\matter T^{0i}$, and the stresses $\matter T^{ij}$, in
joules per cubic metre. Blanchet and Damour's monopole of a slow source, in kilograms and to
order $1/c^2$, is (stated)

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
conserved energy over $c^2$, as Birkhoff requires.[^bd] The hiding is done by conservation and the elliptic constraints
of a hyperbolic theory, not by the ellipticity of Newton's equation.

![Look first at the bars: in Einstein's theory the three terms of order $1/c^2$ cancel, so the breathing stone sends
nothing, while a scalar theory sees its $\int\matter\rho\,r^2\,\dd V$. The ripple is magnified $10^{12}$ times, for a
stone of radius 10 cm that swings once a millisecond; the shapes are exact.](tut-breathing-stone){#fig:breathing-stone}

**The general statement** (stated). A source watched from outside for all time is known only through its **light-cone
transform**, its transform in space and time on the light cone $|\vect k| = \omega/c$ of wavevector and frequency
(Devaney and Wolf, 1973). A source $c^{-2}\ddot{\field\psi} - \nabla^2\field\psi$, with $\field\psi$ zero outside the
body at all times, makes the retarded field $\field\psi$, zero outside. Such a **non-radiating source** is, when
static, 2.5's confined Laplacian, and Bleistein and Cohen (1977) showed that these are the whole null space. The
record is an area times a time, the source a volume times a time.

**What it means.** Acting, not time, removes the null space. For a classical body at rest, readings at any number of
times give only the harmonic moments of its mass and its flow.[^twotimes] The body's own motion does climb 13.3's
ladder without a push, but at a cost of $(\omega a/c)^2$ per rung.[^passive]

**The four entries.** Watching or pushing, with an instantaneous field or one that travels at $c$, make four cases
(Figure [](#fig:holo-table)). Watching leaves a null space either way. Pushing removes it with **logarithmic
stability**, an error that falls only as one over the logarithm of the noise (13.2). A wave shorter in wavelength than
the body reads its transform at wavevectors $|\vect q| \le 2\omega/c$ with **Hölder stability**, an error that falls as
a power of the noise, to about half a wavelength (Stefanov and Uhlmann, stated).

![Look first at the left column: watching, with or without the speed of light, leaves a null space. The entries are
stated results, sourced in the text.](tut-holo-table){#fig:holo-table}

## Pushing reads the volume, but only to a number of cells set by the logarithm

We want the number of interior cells that tides and weighings resolve. A **cell** is the smallest volume, of size
$\sym{cell-size}{d}$ in metres, whose mean density the data fix. The count is a sketch at depth B.[^own]

**The protocol** is the paper's, with "the impulses taken in pairs". Chapter 13.1 found that a mass $\matter\mu$ held
at $\vect y$ for a short time $\delta t$ is the impulsive tide $g_{\vect y} = 1/|\vect x - \vect y|$, of strength
$\epsilon = G\matter\mu\,\delta t$, and the energy $\Delta E$ the body gains, the paper's [](/paper/#eq:push), is
linear in the tide at first order and quadratic at second. We hold masses at two points $\vect y$ and $\vect y'$ of the
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
and $\ell$, as 2.2's patterns sort any function on a sphere, and each sorted datum, a **channel**, reads one moment.
For a check, two quadrupolar tides $\tfrac12\vect x\cdot A\vect x$ and $\tfrac12\vect x\cdot A'\vect x$ give
$\vect x\cdot AA'\vect x$, whose round part $\mathrm{tr}(AA')\,r^2/3$ reads $\int\matter\rho\,r^2\,\dd V$, the rung
that tells a ball from a shell.

So the rungs $j$ of one pattern come from different pairs of degrees, and on one sphere they never mix. A single mass
has $\vect y' = \vect y$, and only the distance separates its rungs of one pattern (13.3's last paragraph).[^single]

**The cost of a rung.** The **sector** of degree $\ell$ is the part of the density that varies with direction as the
patterns $Y_\ell$. A tide of degree $\ell_1$ from $R_c$ is weaker inside the body by $(a/R_c)^{\ell_1}$, so a rung of
total degree $n$ arrives weakened by $e^{-n\Lambda}$ against the mass, which the degrees $(1, 1)$ read. Inside, the
power $r^{\ell+2j}$ is close to a sum of the lower powers $r^{\ell+2i}$, with the weight $r^2\,\dd r$, and only its
part at right angles to them, its **residual**, carries a new number.

::: derivation
### What is new in each power

On $0 \le u \le 1$ take the powers $u^{e_0}, u^{e_1}, \dots$ with $\int_0^1u^{e_i}u^{e_k}\,\dd u = 1/(e_i + e_k + 1)$,
a Cauchy matrix. The length of the part of $u^{e_j}$ at right angles to the lower ones is the square root of the
ratio of two determinants of this matrix, with $j + 1$ and $j$ rows, and Cauchy's formula for them (stated) gives

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

for a large $L$. Both are pure numbers, and from three radii $\kappa = 0.073$.[^kappa] For a check, a far camera has
$\Lambda \gg h$ and $\kappa \to \tfrac16$, the count of all polynomials of degree up to $L/\Lambda$. The cell size
follows from $\tfrac43\pi a^3 = N_2d^3$: $d = (4\pi/3\kappa)^{1/3}\,a\Lambda/L$, about $3.9\,a\Lambda/\ln\SNR$.

**The model**, with lengths in units of $a$. Each sector's radial profile is any square-integrable function on
$0 \le r \le 1$. The masses sit on the sphere $R_c$, and every ordered pair of directions is one datum with the same
independent noise. A rung's weight $W_j$ is $e^{-(n+2)\Lambda}$ times the root-sum-square of its channels'
coefficients.[^chan] A sector's squared singular values (3.4) are the eigenvalues of $WGW$, with $W$ the diagonal table
of weights and $G_{jk} = 1/(2\ell + 2j + 2k + 3)$ the overlaps of the powers. Each singular value above the mass's over
$\SNR$ counts $2\ell + 1$ times.

::: gap
**Proved** in this model, from stated theorems: pairs are complete; the sphere $R_c$ is the best radius; the single
mass's outside residual vanishes; no protocol escapes the inside residual, because every datum is a sum of the moments
$\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$; and at $\ell = 0$ the exact rate per rung is the modulus of Grötzsch's
ring, 3.5804 against the residuals' $2\Lambda + \ln4 = 3.5835$ (Widom's theorem). **Numerical**, in multiple precision:
the counts, and a gap $\delta(p) \le 0.0016$ per unit of degree between the exact singular values and the residuals,
which moves $\kappa$ from 0.0733 to 0.0734.
:::

**The numbers.** The model gives the table below, and the rung-by-rung count agrees within 2 per cent. The ratio
$N_2/(L/\Lambda)^3$ drifts from 0.14 at $10^6$ to 0.080 at $10^{70}$, toward 0.073. The finite counts depend on how
the tides are normalized, from $2.3\times10^5$ to $2.8\times10^5$ at $10^{70}$, but $\kappa$ does not.

| $\SNR$ | $N_1$ (looking) | $N_2$ (pushing) | $N_2/N_1$ | $d/a$ |
|---|---|---|---|---|
| $10^6$ | 169 | 271 | 1.6 | 0.25 |
| $10^{12}$ | 676 | 1682 | 2.5 | 0.14 |
| $10^{30}$ | 3969 | $2.17\times10^4$ | 5.5 | 0.058 |
| $10^{70}$ | $2.16\times10^4$ | $2.52\times10^5$ | 11.6 | 0.026 |

Each count is at its own reading's $\SNR$: for $N_1$ the static pull's, for $N_2$ that of the weighing's own leading
term, the energy the mass gains, which is far smaller (the paper's Section XIII). So the columns compare equal values
of two different ratios. The ceiling of the next section bounds both.

At $10^{70}$ the stone is resolved into about forty cells along a radius. The paper's $R/d = 100$, with its $R$ the
reading sphere at $3a$, is $d = 0.03a$, which pairs reach at $\SNR = 10^{59.4}$.[^Rd] The paper's Figure
[](/paper/#fig:ladder)(b) draws the rungs that pushing adds, a bead for each moment.

{{paper fig:ladder}}

**Known results** (stated). For 13.2's linearized Calderón problem, which is the data of all pairs, Alessandrini
proved logarithmic stability, and Mandache that no method beats a logarithm, up to its exponent
[@Alessandrini1988; @Mandache2001]. The singular values fall as
$\sigma_k \approx \exp[-\Lambda(k/\kappa)^{1/3}] = \exp(-2.62\,k^{1/3})$, the form that Koch, Rüland and Salo proved
for operators this smooth; the constant and the rate $n[\Lambda + h(p)]$ are this tutorial's. The cell law is a count
of the same kind, in one model.

**What it means.** Section XV's "precision that grows as the logarithm of the sensitivity" is three laws: the cell size
falls as $1/\ln\SNR$, the cells grow as $(\ln\SNR)^3$ and the bits as $(\ln\SNR)^4$ (13.2). This is what remains
without $\hbar$ of the **holography of information**, quantum gravity's argument that a region's boundary holds
everything inside it: an operation from outside and a reading of the energy, which gives a density and a motion, not a
state (13.6).

::: try {#readable-cells}
Predict first: make the camera a million times more sensitive. Do the cells that pushing resolves inside the stone
grow a million times, a thousand times, or a few times? And is it worth more to gain that factor in sensitivity or to
bring the camera sphere from three radii to two? The figure cuts a disc of the stone into cells of the side the count
allows and reads out what looking and pushing in pairs give. Move *Signal-to-noise ratio* from $10^6$ to $10^{12}$,
then from $10^{70}$ to $10^{76}$. Choose a region and press the tick for its ceiling. Slide *Radius of the camera
sphere* down from 3. Last, switch on *Black hole*.
:::

## Quantum mechanics caps the sensitivity by the area of the region

We want a ceiling on $\SNR$ that no measurement can pass. Chapter 8.6 found that a strength $\theta$ entering through
an interaction $\theta V$ for a time $\tau$ obeys $\theta/\sigma_\theta \le 2\theta\sigma_V\tau/\hbar$, with
$\sigma_V$ the spread of $V$ in the camera's state. **A value confined between $V_{\min}$ and $V_{\max}$ has a spread
of at most half the range**: its mean square distance from its own mean is no more than that from the midpoint, which
is at most $\tfrac14(V_{\max} - V_{\min})^2$. Equality holds for the two ends with equal weights. So

$$\frac{\theta}{\sigma_\theta} \le \frac{\theta\,(V_{\max} - V_{\min})\,\tau}{\hbar} .$$

Boixo, Flammia, Caves and Geremia proved this bound for every strategy, including entangled probes and adapted
measurements (stated).

Take $\theta$ to be the scene's mass $\sym{source-mass}{\matter M_s}$, read through its pull by a camera of mass
$\matter m$ whose centre is at least $z$ from the scene. The coupling per kilogram of scene is $-G\matter m/r$, with a
range of at most $G\matter m/z$. The camera must fit within the distance $z$, so 11.1's bound $\matter m < zc^2/2G$
for a body that is not a black hole makes that range at most $c^2/2$. So $\SNR \le \matter M_sc^2\tau/2\hbar$, 8.6's
result, from Boixo's theorem with Newton's coupling at the edge of its validity: $1.3\times10^{70}$ for the
person watched for the age of the universe.

**Inside a region.** Let the whole experiment fit in a ball of radius $\ell_{\rm r}$, in metres, for as long as a
signal can go from the centre to the edge and back, the time $2\ell_{\rm r}/c$. The events that a signal sent from one
event can reach, and that can send a signal to one later event, form a **causal diamond**. If no horizon forms, the
scene has $\matter M_s \le \ell_{\rm r}c^2/2G$ (11.1). With $\tau \le 2\ell_{\rm r}/c$ and the **Planck length**
$\sym{planck-length}{\ell_P} = \sqrt{\hbar G/c^3} = 1.6\times10^{-35}$ m,

$$\boxed{\;\SNR \le \frac{\ell_{\rm r}^2}{2\ell_P^2} = \frac{S_{\rm BH}}{2\pi}\;}$$

where $\sym{area-entropy}{S_{\rm BH}} = 4\pi\ell_{\rm r}^2/4\ell_P^2$ is the Bekenstein–Hawking entropy of a sphere of
that area, chapter [11.3](/tutorial/black-holes/hawking/#a-hovering-observer-near-the-horizon-finds-empty-space-warm)'s
quarter of an area in Planck units (stated there), a pure number. The ceiling is $1.9\times10^{69}$ for a region of
radius one metre, $1.7\times10^{70}$ for three metres, near the paper's estimate, and
$8.1\times10^{120}$ for the diamond that holds a camera watching for the age of the universe. The bound is never
reached, because equality needs the scene and the camera each on the edge of being a black hole, and together they
would form a horizon. A person, 70 kg against the $2\times10^{27}$ kg that three metres allow, is far from it.

The ceiling bounds pushing too: a weighing reads the gained mass $\Delta E/c^2$, so its $\SNR$ is at most
$\Delta E\,\tau/2\hbar$. Ng and Lloyd reached the same form by counting a region's operations, about $(t/t_P)^2$ in
a universe of age $t$, with $t_P = \ell_P/c$ the Planck time (stated).

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

A stone that is not itself a black hole has $\matter M_s < \ell_{\rm r}c^2/6G$ and the ceiling $S_{\rm BH}/6\pi$, about
2 per cent fewer cells. The area grows by $10^{52}$ and the cells by a factor of five (Figure [](#fig:cells-vs-snr)).
We call this **holographic sparseness**: what a field shows of ordinary matter is a power of the logarithm of the area,
far below the $(A/\ell_P^2)^{3/4}$ that stable matter can hold ('t Hooft, stated) and the $A/4\ell_P^2$ of a black
hole. "Sparse" is about what can be read, not what is there.

![Look first at how close the two curves stay: pushing passes looking between $10^3$ and $10^6$ and beats it by a
factor of about twelve only at the paper's ceiling. Dashed: the law $0.073(L/\Lambda)^3$ that pushing approaches. The
curves are counted; the discs are drawn to scale.](tut-cells-vs-snr){#fig:cells-vs-snr}

**The black hole.** A hole at rest shows seven numbers at one time, its mass, spin and place
([11.2](/tutorial/black-holes/spin/#a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in) and the hole's
column of the paper's Table [](/paper/#tab:hair)), so at most $7\log_2\SNR$ bits: about 1450 for 13.7's 0.905 K hole,
read from a few horizon radii. Its **microstates**, the quantum states that share these numbers, number about $e^S$,
and telling them apart "may require an accuracy that scales exponentially with $S$" (Raju, stated), where the ceiling
allows about $S$. Whatever more the outside holds is, in the paper's words, "of order $\hbar$", and leaves, if at all,
by counting quanta, about a bit each
([8.6](/tutorial/quantum/quantum-limit/#a-measurement-is-a-set-of-positive-tables-that-add-to-one-and-a-gravitons-click-carries-about-a-bit)).

## Gravity cannot decohere a ball and a shell

We want to know when a camera ends a superposition. Chapter 8.1 found that if two branches leave a record in the states
$|e_1\rangle$ and $|e_2\rangle$, their interference is multiplied by the overlap $\langle e_1|e_2\rangle$; the loss of
interference is decoherence. A camera's pointer is the part whose position $y$, in metres, shows the reading. Its state
after a reading, a **pointer state**, is a wave packet $\varphi(y) = (2\pi\sigma_y^2)^{-1/4} e^{-(y -
y_0)^2/4\sigma_y^2}$ about the reading $y_0$, whose $|\varphi|^2$ is a bell curve of standard deviation
$\sym{pointer-spread}{\sigma_y}$. Let the branches leave readings $\Delta y$ apart, with $y_0 = 0$ in one. The
exponents of $\varphi(y)\,\varphi(y - \Delta y)$ add, and completing the square,

$$y^2 + (y - \Delta y)^2 = 2\bigl(y - \tfrac12\Delta y\bigr)^2 + \tfrac12\Delta y^2 ,$$

leaves a bell curve of area one and

$$\boxed{\;\langle e_1|e_2\rangle = e^{-\Delta y^2/8\sigma_y^2}\;}$$

a pure number: 1 when the readings agree, 0.88 at $\Delta y = \sigma_y$ and 0.044 at $5\sigma_y$. With
$\Delta y/\sigma_y$ the camera's $\SNR$ for the difference of the branches, the overlap is $e^{-\SNR^2/8}$, and "a
perfect camera is therefore a perfect source of decoherence" (Section IV).

**The impossibility.** Put a body into a superposition of a ball and a shell of one mass and one energy. The field
outside is the same in both branches at every instant (2.5), and throughout a round motion that makes the superposition
(Birkhoff), so no graviton is emitted. Every reading at one time has $\Delta y = 0$, and the record's overlap is one.
What can still differ outside, the paper says, are readings at two times, the tremor and the response to a tide. Heat
and the zero point shake a ball and a shell unequally, so a reading that resolves the tremor would keep a record. For a
cold body, or readings that do not resolve the tremor, the record-keeping way of decoherence is closed, save for tides
from outside, which the branches answer differently, the paper's [](/paper/#eq:dust).

**What does differ** is the measure by which Diósi and Penrose proposed that gravity itself ends superpositions, the
**Diósi–Penrose energy** $\sym{diosi-penrose-energy}{E_G}$: the gravitational self-energy of the difference of the
two densities [@Diosi1987; @Penrose1996]. Penrose estimates the time of the collapse as $\hbar/E_G$. For a ball and a
shell of mass $\matter M$ and radius $R$ the fields agree outside (Figure [](#fig:dp-fields)), the shell's is zero
inside, and the ball's is $G\matter Mr/R^3$ (chapter 1.3), so with $\int_0^Rr^4\,\dd r = R^5/5$,

$$\boxed{\;\begin{aligned}
E_G &= \frac{1}{8\pi G}\int|\field{\vect g}_1 - \field{\vect g}_2|^2\,\dd V\\
&= \frac{1}{8\pi G}\Bigl(\frac{G\matter M}{R^3}\Bigr)^2\frac{4\pi R^5}{5} = \frac{G\matter M^2}{10R}
\end{aligned}\;}$$

in joules, the paper's

{{paper eq:dp-energy}}

For a glass bead of radius 1 μm and density 2200 kg m⁻³, $\matter M = 9.2\times10^{-15}$ kg, $E_G = 5.7\times10^{-34}$
J and $\hbar/E_G = 0.19$ s, "a fifth of a second".[^density] The factor in front of $E_G$ is a convention, as the paper
says, and conventions that differ by two move the time by two. A bead that only breathes, a ball of radius $R$ against
one of $R + \delta$, has inside the difference $3G\matter M\delta r/R^4$ to first order in $\delta$, so
$E_G = \tfrac{9}{10}(\delta/R)^2G\matter M^2/R$, 0.2 per cent above the exact value at $\delta/R = 10^{-3}$. The time
is longer by $R^2/9\delta^2$, $1.1\times10^5$ there.

![Look first at the shaded triangle: the two fields differ only inside, and the square of that difference, integrated,
is $E_G = G\matter M^2/10R$. Exact curves.](tut-dp-fields){#fig:dp-fields}

**Stated.** The simplest form of the proposal, with no free length, has been excluded by experiment
[@DonadiEtAl2021]. **What it means.** Such a pair "would separate two ways in which gravity
might end a superposition": by a record, which is closed, or by a collapse of Diósi and Penrose's kind, which is not.

::: try {#same-outside}
Under *Round bodies*, keep *Ball* for A. Before you choose *Shell* for B, predict: does the field outside hold a
record of which one the body is, and what is B ÷ A for a quadrupolar kick? Then choose *Shell* and compare the rows.
Last, read *Thermal tremor of the quadrupole*, and name the readings that would keep a record.
:::

::: check
### Q

From three radii at $\SNR = 10^{70}$, with masses held in pairs, how many cells does pushing resolve, and how large is
each?

### A

About $2.5\times10^5$, each 0.026 of the radius.

### Q

Why can the field outside not decohere a cold ball and shell of the same mass and energy?

### A

Every reading at one time is the same in both branches, so $\Delta y = 0$ and the record's overlap is one.
:::

**The idea to keep: looking at a body gives a hologram that loses the null space, and in Einstein's theory watching
adds nothing; pushing reaches the inside, but its cells grow only as the cube of the logarithm of a sensitivity that
quantum mechanics caps by the region's area. So ordinary matter is holographically sparse, a black hole shows seven
numbers, and a ball and a shell leave gravity no record yet differ in their Diósi–Penrose energy, so such a pair would
tell an ending by record from one by collapse.**

::: problems
### Practice

Find the Diósi–Penrose time for a silicon sphere of radius 10 μm and density 2330 kg m⁻³ in a superposition of a
ball and a shell, and for the same sphere breathing by one part in a thousand.

::: solution
$\matter M = 9.8\times10^{-12}$ kg, $E_G = G\matter M^2/10R = 6.4\times10^{-29}$ J and
$\hbar/E_G = 1.7\times10^{-6}$ s. Breathing multiplies the time by $R^2/9\delta^2 = 1.1\times10^5$, to 0.18 s.
:::

### Stretch

With chapters 8.6 and 11.1, find the ceiling on reading the Earth's mass within a region of three Earth radii, over
the time $2\ell_{\rm r}/c$, and the cells that pushing in pairs could then resolve inside the Earth from three radii.

::: solution
$\SNR \le \matter M_Ec^2\tau/2\hbar$ with $\tau = 2\ell_{\rm r}/c$ is $\matter M_Ec\,\ell_{\rm r}/\hbar$, and
$\ell_{\rm r} = 1.9\times10^7$ m gives $3.2\times10^{74}$, so $\ln\SNR = 171.6$ and $L/\Lambda = 156$. With the counted
ratio of about 0.080, $N_2 \approx 0.080\times156^3 = 3.0\times10^5$ cells, so $d = (4\pi/3N_2)^{1/3} = 0.024$ of the
Earth's radius, about 153 km.
:::

### The paper

Derive the paper's [](/paper/#eq:dp-energy) for a ball and a shell, then check Section XV's "a fifth of a second" for
a glass bead a micrometre in radius and its "$R^2/9\delta^2$".

::: solution
The [last section](#gravity-cannot-decohere-a-ball-and-a-shell) derives both. With 2200 kg m⁻³ the time is 0.19 s. For
the breathing, $|\field{\vect g}_1 - \field{\vect g}_2| = 3G\matter M\delta r/R^4$ inside, so $E_G$ is $9(\delta/R)^2$
times the ball and shell's $G\matter M^2/10R$.
:::
:::

::: paper
- [Section XV](/paper/#sec:holography): its plain words, [*Black holes and the classical
  limit*](/paper/#par:black-holes-and-the-classical-limit) and [*What gravity cannot
  decohere*](/paper/#par:what-gravity-cannot-decohere), with the paper's [](/paper/#eq:dp-energy).
- [Section IV](/paper/#sec:near-field), [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity): the ceiling and
  the "perfect source of decoherence". [Section XVII](/paper/#sec:status) asks for "the coupling, the resources and
  the task to be stated exactly": the fourth section states them.
- [Section XIII](/paper/#sec:second-order): the paper's [](/paper/#eq:push) and [*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading). [Section XII](/paper/#sec:hair): the
  paper's [](/paper/#eq:hair-bits) and the seven numbers.
:::

::: deeper
- The GR course's [section
  18.6](https://neovand.github.io/general-relativity/chapter-18.html#18-6-why-a-violently-breathing-sphere-still-does-not-radiate-tensor-waves)
  on a breathing sphere, [section
  17.1](https://neovand.github.io/general-relativity/chapter-17.html#17-1-solving-spherical-vacuum-where-schwarzschild-comes-from)
  on Birkhoff, and [section
  22.10](https://neovand.github.io/general-relativity/chapter-22.html#22-10-the-information-question-without-assuming-quantum-mechanics)
  on what a horizon does to information.
- R. Bousso et al., arXiv:1209.4641: the classical, non-gravitational limit. V. Wens, *NeuroImage* 270, 119953
  (2023). H. Koch, A. Rüland and M. Salo, arXiv:2012.01855: stability and singular values.
- S. Boixo, S. T. Flammia, C. M. Caves and J. M. Geremia, *Physical Review Letters* 98, 090401 (2007): the bound.
  Y. J. Ng, *Physical Review Letters* 86, 2946 (2001) and *Entropy* 21, 1035 (2019), and S. Lloyd, *Physical Review
  Letters* 88, 237901 (2002): operations in a region.
:::

[^Lambda]: Section XII's letter, not the cosmological constant. Here $a$ is the stone's radius, not Kerr's $a$;
    Section XII writes it $R$.

[^hyperbolic]: Not Section IV's hyperbolic geometry of the near field.

[^birkhoff]: This reading of Birkhoff's theorem is the tutorial's own; its ingredients are the theorem and Newton's
    shell theorem.

[^bd]: L. Blanchet and T. Damour, *Annales de l'Institut Henri Poincaré A* 50, 377 (1989), with the matter's
    $\matter T^{\mu\nu}$. For a body held by its own gravity, gravity's force enters the conservation identities and
    adds the potential energy, negligible for a stone. The cancellation is algebra either way.

[^twotimes]: The paper's "the field at two times gives all of it" (Introduction) needs impulses: a tide, heat at a
    known temperature, or the zero point. A body turning at a known rate shows the first rung (13.4).

[^passive]: At order $1/c^{2k}$ Blanchet's expansion adds Almansi's rung
    $\int r^{\ell+2k}Y_\ell\,\partial_t^{2k}\matter T^{00}\,\dd V$ of the changing part (stated). For the 10 cm steel
    ball ringing at 12.6 kHz the first rung of degree two is $5\times10^{-11}$ of its moment, where a tide from three radii
    pays $\tfrac19$; passive rungs separate only across frequencies. This reading is the tutorial's own.

[^own]: This count is the tutorial's own; its ingredients are the paper's [](/paper/#eq:push), 13.3's ladder, Cauchy's
    determinant, Wens's cut-off and Mandache's comparison of the data with the densities.

[^single]: Holding one mass at a time is weaker: each rung pays its residual a second time, outside, so the threshold
    is $n[\Lambda + 2h(p)]$, $\kappa = 0.043$, and $1.6\times10^5$ cells at $10^{70}$.

[^kappa]: Not 13.2's decay rate $\kappa$.

[^chan]: The channel of degrees $\ell_1$, $\ell_2$ has the coefficient
    $(4\pi)^2(j + 1)(2\ell + 2j + 3)\,|\mathcal G|/(2\ell_1 + 1)(2\ell_2 + 1)$, with
    $\mathcal G = \sqrt{(2\ell_1 + 1)(2\ell_2 + 1)/4\pi(2\ell + 1)}\,\langle\ell_10\,\ell_20|\ell0\rangle$ the Gaunt
    coefficient of two patterns, from 2.2's expansion of $1/|\vect x - \vect y|$.

[^Rd]: Taking $R$ to be the stone's radius instead, $d = 0.01a$ would need about $10^{182}$.

[^sparse]: This count is the tutorial's own, from the ceiling of Ng, Lloyd and Boixo et al. and the cell law, for a
    camera at a fixed multiple of the radius.

[^density]: Section XV names no density; soda-lime glass, 2500 kg m⁻³, gives 0.14 s.
