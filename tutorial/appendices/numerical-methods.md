---
id: 'A.1'
title: 'Numerical methods and the worked examples'
question: 'When a number in this book comes from a computation too long to do by hand, how is it computed, and how close does an estimate by hand come?'
part: 'A'
requires: []
paper: [app:benchmarks, eq:depth-bound, fig:separation-noise]
figures: []
live: []
---

Some numbers in this book come from computations too long to do by hand: the price a pixel and its six neighbours
pay to read a wave beside a spinning rotor, the precision with which they range a person, the weight of the gold in
the locked safe. How is each computed, and how close does an estimate by hand come? For each we give the setup as
data, the method, the result and a pencil estimate. Two examples are rebuilt where they are used:
the trembling lattice of masses and springs in [section 4.3](/tutorial/response/elastic-bodies/) and
[R4](/tutorial/response/reading-section-iv-3/), with its bounds on the quantum jitter in
[section 8.7](/tutorial/quantum/quantum-fluctuation/), and the array, grid and prior of the worked inversion in
[R3](/tutorial/noise/reading-section-iv-2/).

## Every bound here is the inverse of a Fisher matrix

Each example has a list of unknowns $\theta_1, \dots, \theta_P$ (amplitudes, moments, positions, a mass) and a list of
readings $y_k = f_k(\theta) + n_k$, each with independent Gaussian noise $n_k$ of standard deviation $\sigma_n$. The
readings of a pixel are the coefficients of $\curv\tE$, and of $\curv\tB$ where it is read, in the orthonormal basis of
[section 1.5](/tutorial/newton/five-numbers/), so that $|\curv\tE|^2 = \curv\tE_{ij}\curv\tE_{ij}$; $\sigma_n$ is in
$\mathrm{s^{-2}}$. The **Jacobian** $J$ is the table of derivatives $J_{ka} = \partial f_k/\partial\theta_a$, one row
per reading and one column per unknown. By [section 3.3](/tutorial/noise/measuring-a-number/) the Fisher matrix and
the Cramér–Rao bound are

$$F = \frac{J^{\mathsf T}J}{\sigma_n^2}, \qquad \sigma_{\theta_a} \ge \sqrt{(F^{-1})_{aa}} .$$

An unknown we do not want, a **nuisance**, is fitted along with the rest, and the bound on every other unknown can
only grow (section 3.3). Its **cost** $K$ is the factor on the error of the wanted unknowns, from the same readings:

$$K^2 = \frac{\mathrm{tr}\,(F^{-1}_{\rm joint})_{ww}}{\mathrm{tr}\,(F^{-1}_{\rm alone})} ,$$

where $(F^{-1}_{\rm joint})_{ww}$ is the wanted unknowns' block of the joint inverse and $F_{\rm alone}$ their Fisher
matrix with the nuisance known; $K = 1$ means the nuisance costs nothing.

**How $J$ is computed.** A column for an unknown that enters linearly, such as an amplitude or a moment, is the
readings per unit of it, exactly. One that enters non-linearly, such as a position, $\ln r$ or an angle, is a central
difference,

$$\frac{\partial f_k}{\partial\theta_a} \approx \frac{f_k(\theta + h\,\hat e_a) - f_k(\theta - h\,\hat e_a)}{2h} ,$$

with $h$ a millionth of the unknown's scale ($r$ for a position, 1 for $\ln r$ or an angle). Its truncation error,
of order $h^2$, and its round-off, of order $10^{-16}/10^{-6}$, are far below the three figures quoted.

**How $F$ is inverted.** A strain of $10^{-21}$, a moment of $10^{-2}\unit{kg\,m^2}$ and a position in metres differ
by thirty orders of magnitude, so each column of $J$ is divided by its length first: with $S$ the diagonal matrix of
the lengths and $\hat J = JS^{-1}$,

$$F^{-1} = \sigma_n^2\,S^{-1}\bigl(\hat J^{\mathsf T}\hat J\bigr)^{-1}S^{-1} .$$

The identity is exact, and the round-off is then set by the problem rather than by its units. The bounds are reached:
maximum-likelihood fits to thousands of simulated noisy readings scatter as they say.[^sep]

**A record at one frequency.** A pixel that records $N$ readings $y(t_m)$, each with noise $\sigma$, at equal steps over
whole cycles of the angular frequency $\omega$ summarizes them by the complex amplitude $\hat x = (2/N)\sum_m
y(t_m)\,e^{i\omega t_m}$, with $y(t) = \mathrm{Re}[x\,e^{-i\omega t}]$. Its real part $(2/N)\sum_m y(t_m)\cos\omega t_m$
has the variance

$$\frac{4}{N^2}\,\sigma^2\sum_m\cos^2\omega t_m = \frac{4}{N^2}\,\sigma^2\,\frac N2 = \frac{2\sigma^2}{N} ,$$

since the squared cosines average to one half over whole cycles. The imaginary part has the same variance and is
independent, since $\sum_m\cos\omega t_m\sin\omega t_m = 0$. So each part carries $\sigma_n = \sigma\sqrt{2/N}$, and
the record is a set of real readings of the kind above. Its signal-to-noise ratio $\rho = |x|/\sigma_n$, summed over
the numbers that carry the signal, is that of the matched filter; for one reading of a steady tide it is
$|\curv\tE|/\sigma_n$.

## The first examples are a wave, a rotor and seven pixels

**The wave** has the frequency 100 Hz and strain $\field h_+ = 10^{-21}$, $\field h_\times = 0$, and arrives from the
direction of the unit vector along $(-0.45, -0.35, 0.82)$, so it travels along $\hat k$, minus that vector. At a
pixel at $\vect x$ its tide and magnetic part are ([section 7.6](/tutorial/geometry/gravitational-waves/))

$$\curv\tE = \tfrac12\omega^2(\field h_+e_+ + \field h_\times e_\times)\,e^{i\omega\hat k\cdot\vect x/c}, \qquad
\curv\tB_{ij} = \epsilon_{ipq}\hat k_p\curv\tE_{qj} ,$$

with $e_+$ and $e_\times$ the two polarization tables across $\hat k$, each of length $\sqrt2$. Its four unknowns are the
real and imaginary parts of $\field h_+$ and $\field h_\times$; its direction is known.

**The rotor** is that of [section 9.7](/tutorial/one-point/beyond-one-plane-wave/): two masses of 1 kg, 12 cm apart,
turning fifty times a second about the $z$ axis, with its centre 3 m from the central pixel along $(\cos30°,
\sin30°, 0)$. Its field at twice the rate of turning, $2\Omega = 2\pi\times100\unit{s^{-1}}$, is computed from the exact
Newtonian tides of the two masses ([section 1.4](/tutorial/newton/tides/)) at 64 instants over one turn, $\hat x =
(2/64)\sum_m\curv\tE(t_m)\,e^{2i\Omega t_m}$; its magnetic part comes the same way from the field of a moving mass
([section 7.5](/tutorial/geometry/gravitomagnetism/)). At the central pixel its tide is 99 times the wave's, and its
magnetic part is $2.0\times10^{-6}$ of its tide.

**The pixels** are one at the origin and six at $\pm b$ along the three axes, $b = 0.5$ m: an array a metre across,
reading $\curv\tE$, and in some cases $\curv\tB$, at the wave's frequency.

**The model of the rotor** is a **point quadrupole**, the field of a moment $Q_{kl}$ (complex, symmetric and
trace-free, five complex numbers) at an unknown position $\vect x_s$:
$\field\Phi = -\tfrac12GQ_{kl}\,\partial_k\partial_l(1/R)$, with $\vect R = \vect x - \vect x_s$ and $\hat n = \vect
R/R$. Its tide needs four derivatives of $1/R$. Differentiating $\partial_i(1/R) = -R_i/R^3$ three more times, with
$\partial_iR = n_i$ at each step, gives

$$R^5\,\partial_i\partial_j\partial_k\partial_l\frac1R = 105\,n_in_jn_kn_l - 15\,(n_in_j\delta_{kl} + \text{5 more}) +
3\,(\delta_{ij}\delta_{kl} + \delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk}) , \label{eq:fourth}$$

the middle bracket holding the six ways of giving $n_an_b$ to two of the four indices. Contracting with
$Q_{kl}$, whose trace vanishes, removes $n_in_j\delta_{kl}$ and $\delta_{ij}\delta_{kl}$, and with $q = \hat
n\cdot Q\hat n$,

$$\curv\tE_{ij} = -\frac{G}{2R^5}\Bigl[105\,q\,n_in_j - 15\,q\,\delta_{ij} - 30\bigl((Q\hat n)_in_j + n_i(Q\hat
n)_j\bigr) + 6Q_{ij}\Bigr] .$$

Each term is $G$ times $\mathrm{kg\,m^2}$ over $\mathrm{m^5}$, which is $\mathrm{s^{-2}}$, as a tide must be. The model
has seventeen unknowns: four for the wave, ten for the moment and three for the position. The rotor's own magnetic part
is left out of it, being $10^{-6}$ of its tide. The array gives 70 real readings from $\curv\tE$ alone and 140 with
$\curv\tB$.

## At one pixel the near field pays √2 in the two components it shares with the wave

[Section 9.7](/tutorial/one-point/beyond-one-plane-wave/) shows that a near field whose tide $\mathbf N$ is unknown,
five free numbers, and whose magnetic part is below the noise costs a wave exactly $\sqrt2$. The same Fisher matrix
gives the near field's own price. With both polarizations, let $U$ be the $5\times2$ table whose columns are the tide
patterns $\mathbf u_+$ and $\mathbf u_\times$ of the two unit waves, orthonormal, so $U^{\mathsf T}U = 1_2$. The
real and imaginary parts give two equal copies of the problem, so we take one. Each wave amplitude appears in five
numbers of the tide and in five of the magnetic part, which gives the 2 in

$$F = \frac{1}{\sigma_n^2}\begin{pmatrix} 2\cdot1_2 & U^{\mathsf T}\\ U & 1_5\end{pmatrix} .$$

The block of $F^{-1}$ that belongs to $\mathbf N$ is the inverse of its Schur complement ([section
3.4](/tutorial/noise/symmetric-matrices/)), $1_5 - U(2\cdot1_2)^{-1}U^{\mathsf T} = 1_5 - \tfrac12P$, where $P =
UU^{\mathsf T}$ projects onto the wave's transverse-traceless plane and $P^2 = P$. Multiplying out shows the inverse:

$$\bigl(1 - \tfrac12P\bigr)(1 + P) = 1 + P - \tfrac12P - \tfrac12P^2 = 1 , \qquad\text{so}\qquad
\sigma_n^2\bigl(F^{-1}\bigr)_{NN} = 1 + P .$$

Alone, $\mathbf N$ is read with the covariance $\sigma_n^2$ times the identity. With the wave fitted, the variance
doubles in the two directions of $P$ and is unchanged in the other three:

$$\boxed{\;\text{the near field's error grows by}\ \sqrt2\ \text{in the two components across}\ \hat k,\ \text{and not at
all in the other three.}\;}$$

The wave and the near field share the tide's two transverse numbers, and each pays for the other. The result is exact,
for any wave direction and any near field.

## An array that reads only the tide pays a cost that grows as r over b

Without $\curv\tB$ one pixel cannot separate the wave at all (section 9.7). An array can, if the near field comes from
one compact source: the wave varies across a metre by $2\pi\times100\unit{Hz}\times1\unit{m}/c = 2\times10^{-6}$,
while the quadrupole's tide, falling as $R^{-5}$, changes by $5b/r$ of itself over $b$. Its share of the central reading
is inferred from that change, with a noise that grows as $r/b$.

**An estimate by Euler's relation.** A quadrupole's tide is **homogeneous** of degree $-5$ in $\vect R$: it is $R^{-5}$
times a function of direction. For any function homogeneous of degree $p$, differentiating $f(\lambda\vect R) =
\lambda^pf(\vect R)$ with respect to $\lambda$ at $\lambda = 1$ gives **Euler's relation**, $\vect R\cdot\nabla f =
pf$. At the central pixel $\vect R = -r\hat n$, with $\hat n$ the unit vector from the pixel to the source, so

$$\curv\tE_q(0) = \frac r5\,\hat n\cdot\nabla\curv\tE_q .$$

Suppose **the source's position is known**. The mean of the seven readings is $\curv\tE_w + \curv\tE_q(0)$, to order
$b^4$, because the second derivatives along the three axes sum to the Laplacian, which vanishes in vacuum; its noise
is $\sigma_n/\sqrt7$ in each component. The differences across each axis, $[\curv\tE(+b\hat e_a) - \curv\tE(-b\hat
e_a)]/2b$, read the gradient, in which the uniform wave does not appear, with the noise $\sqrt2\sigma_n/2b =
\sigma_n/\sqrt2b$; so $\hat n\cdot\nabla\curv\tE$ carries the variance $\sum_an_a^2\,\sigma_n^2/2b^2 = \sigma_n^2/2b^2$.
Sums and differences of a pair are independent. The estimate $\curv\tE_w = \text{mean} - (r/5)\,\hat
n\cdot\nabla\curv\tE$ then has the variance $\sigma_n^2[1/7 + r^2/50b^2]$ in each component, against $\sigma_n^2/7$
alone, and

$$K^2 = 1 + \frac{7}{50}\Bigl(\frac rb\Bigr)^2, \qquad K \approx 0.37\,\frac rb \quad (b \ll r) .$$

This is one estimator, not the best, so it bounds the optimal known-position cost from above. The best fit with the
position known and the wave travelling along the line to the source, which also uses the curvature across the stencil,
has $K^2 = 1 + (7/150)(r/b)^2$, so $K \approx 0.22\,r/b$.

**The full model.** With the position fitted too, the cost depends on the directions of the wave, of the source and of
the rotor's axis. Over sixty random choices of all three at $b = 0.01\,r$, $Kb/r$ lies between 0.22 and 0.55, with the
median 0.29; with the position known it lies between 0.22 and 0.27, below the Euler estimate in every case:

$$\boxed{\;K \approx (0.2\ \text{to}\ 0.6)\,\frac rb \quad (b \ll r,\ \text{tide alone}).\;}$$

**The example.** At $r/b = 6$ the full model gives $K = 2.17$, between the best known-position value, 1.64, and
Euler's, 2.46. With $\curv\tB$ read as well the cost falls to 1.26. An estimate adds informations: in units of one
pixel's full reading, the wave alone has 3.5 from the seven tides and 3.5 from the seven magnetic parts. The
magnetic half is untouched by the rotor, and the tidal half is divided by $K^2 = 4.69$, which leaves $3.5 + 0.75 =
4.25$ of 7, and $K = \sqrt{7/4.25} = 1.28$.

**Where the array overtakes the magnetic part.** A single pixel that reads both parts pays $\sqrt2$ (section 9.7). The
array that reads only the tide pays less than that once $b > 0.29\,r$, found by halving the interval of $b$ forty times
on the full model. Euler's estimate puts the crossing at $b = \sqrt{7/50}\,r = 0.37\,r$, and the best known-position
value at $\sqrt{7/150}\,r = 0.22\,r$; the full model lies between.

## The wave costs the rotor little: 1.5 and 1.3 from the tide, 1.07 and 1.04 with the magnetic part

The same matrix gives the rotor's price for the wave: the cost $K$ on its ten moment unknowns and on its three
position unknowns, with the wave as the nuisance. From the tide alone they are 1.46 and 1.29; with the magnetic part,
1.07 and 1.04. The second pair is near one because the magnetic part fixes the wave by itself. At one pixel the near
field pays $\sqrt2$ in two of its five components and nothing in three, an average $\sqrt{(2\cdot2 + 3)/5} = 1.18$;
across the array the neighbours' variation also fixes the moment, and the factor falls to 1.07.

## A point model leaves a false wave of 0.005, and an ignored rotor reads as seventy waves

**The model error.** The rotor is two masses, not a point quadrupole. Its next term at twice the rate of turning is a
**hexadecapole**, of degree four, smaller than the quadrupole by $(d/2r)^2$ times a factor of order one, with $d = 12$
cm: $(0.06/3)^2 = 4\times10^{-4}$. At the central pixel the exact tide differs from the point quadrupole's by $3.7\times
10^{-4}$ of it, and the rotor's tide is 99 times the wave's, so the unmodelled part is $99\times3.7\times10^{-4} =
0.037$ of the wave there, and the fitted moment and position absorb most of it. What is left comes from fitting the
noise-free readings of the exact rotor plus the wave with the model, by least squares: at each trial position the
fourteen linear unknowns are solved exactly, and the position by a non-linear least-squares search from the true one
(**variable projection**). The fitted wave differs from the true one by

$$\boxed{\;0.0054\ \text{of the wave} .\;}$$

This false wave matters only when it exceeds the wave's random error along the same direction. With $\rho$ the wave's
signal-to-noise ratio in one pixel's ten numbers, that error is the full model's bound, which falls as $1/\rho$, so
the two are equal at $\rho = 269$, about 270. By hand: the array's seven tides carry 3.5 units of the wave's
information, so its error from them alone is $1/(\sqrt{3.5}\,\rho)$ of the wave, multiplied by $K = 2.17$; it equals
0.0054 at $\rho = 2.17/(1.87\times0.0054) = 215$. The full number is a quarter larger because the false wave points
in a direction the array reads less well than average.

**An ignored rotor.** A wave fitted alone is the projection of the readings on the wave's pattern. At one pixel with
both parts the fit takes half the transverse-traceless part of the rotor's tide, since the magnetic half of the
readings holds nothing; section 9.7 found 35 waves for this geometry. From the tide alone the half is gone, and the
mean of the seven pixels is the central value to order $b^4$, so the array reads the rotor as $2\times35 = 70$ waves;
the full sum gives 70.4.

## Field and gradient range one mass

A single mass $\matter M$ at the distance $r$, with $\hat n$ the unit vector from the mass to the pixel, has there the tide
$\curv\tE_{ij} = (G\matter M/r^3)(\delta_{ij} - 3n_in_j)$ ([section 1.4](/tutorial/newton/tides/)). Its square is $(G\matter
M/r^3)^2(3 - 6 + 9) = 6(G\matter M/r^3)^2$. Its gradient is $\partial_k\curv\tE_{ij} = -G\matter
M\,\partial_i\partial_j\partial_k(1/R)$, and one derivative fewer than [](#eq:fourth) gives

$$\partial_k\curv\tE_{ij} = \frac{G\matter M}{r^4}\bigl[15\,n_in_jn_k - 3\,(n_i\delta_{jk} + n_j\delta_{ik} +
n_k\delta_{ij})\bigr] .$$

Squaring, $15^2 = 225$; the cross term is $-2\times15\times3\times3 = -270$; and the bracket of three terms squares to
$3\times3 + 6\times1 = 15$, times $9$, which is 135. So $|\nabla\curv\tE|^2 = 90(G\matter M)^2/r^8$, and

$$r = \sqrt{15}\,\frac{|\curv\tE|}{|\nabla\curv\tE|} ,$$

with the norms taken over all components. Check of units: the tide is in $\mathrm{s^{-2}}$ and its gradient in
$\mathrm{s^{-2}\,m^{-1}}$, so the ratio is a length.

**The bound.** Write $\ln|\curv\tE| = \ln\matter M - 3\ln r + \text{const}$ and $\ln|\nabla\curv\tE| = \ln\matter M -
4\ln r + \text{const}$. A change of the direction $\hat n$ turns both tables without changing their lengths, so in the
Fisher matrix it is perpendicular to changes of $\matter M$ and $r$, which change only the lengths; the unknown
direction does not enlarge the bounds. The two lengths are read to the fractions $1/\rho_E$ and $1/\rho_G$, the
signal-to-noise ratios of the field and of the gradient over all the readings. Solving, $\ln r = \ln|\curv\tE| -
\ln|\nabla\curv\tE|$ and $\ln\matter M = 4\ln|\curv\tE| - 3\ln|\nabla\curv\tE|$ up to constants, so

$$\Bigl(\frac{\sigma_r}{r}\Bigr)^2 = \frac{1}{\rho_E^2} + \frac{1}{\rho_G^2}, \qquad
\Bigl(\frac{\sigma_M}{\matter M}\Bigr)^2 = \frac{16}{\rho_E^2} + \frac{9}{\rho_G^2} . \label{eq:depth}$$

**Six neighbours.** For $b \ll r$ the seven pixels read one tide, so $\rho_E = \sqrt7\,\rho$, with $\rho =
|\curv\tE|/\sigma_n$ for one pixel's reading. The difference across $2b$ reads each of the gradient's fifteen numbers
with the noise $\sigma_n/\sqrt2b$, so $\rho_G = |\nabla\curv\tE|\sqrt2b/\sigma_n = (\sqrt{15}|\curv\tE|/r)(\sqrt2
b/\sigma_n) = \sqrt{30}\,\rho b/r$.

**The person.** A person of 70 kg stands 3 m away, and the neighbours are 0.5 m out. The tide is $|\curv\tE| =
\sqrt6\,G\matter M/r^3 = 4.24\times10^{-10}\unit{s^{-2}}$. With $b/r = 1/6$,

$$\frac{\sigma_r}{r} = \frac1\rho\sqrt{\frac17 + \frac{36}{30}} = \frac{1.16}{\rho}, \qquad \frac{\sigma_M}{\matter M} =
\frac1\rho\sqrt{\frac{16}{7} + \frac{9\times36}{30}} = \frac{3.62}{\rho} .$$

At $\rho = 10^6$ the person is ranged to 3.5 µm.

**The full model.** The closed form uses only the first two terms of the field's Taylor series across
the stencil. The full model fits the four unknowns $(\ln\matter M, \ln r, \vartheta, \varphi)$, with
$\vartheta$ and $\varphi$ the angles of $\hat n$, to the 35 readings of the exact tides at the seven pixels. Its bound
on $\sigma_r/r$, over two hundred random directions, lies between $0.90/\rho$ and $1.08/\rho$, against the closed
form's $1.16/\rho$; at one typical direction it is $1.07/\rho$ for the range and $3.33/\rho$ for the mass. A wider stencil
gains from the curvature of the field across it, by an amount that depends on how the stencil's axes lie against the
direction of the mass. As $b/r \to 0$ the full model's bounds tend to the
closed form.[^depth]

## A moving mass is ranged by its magnetic part alone

Without neighbours a pixel can range a mass that moves, through $\curv\tB$. Scale the scene by a factor $\lambda$:
positions $\vect x \to \lambda\vect x$, velocity $\vect v \to \lambda\vect v$ and mass $\matter M \to \lambda^3\matter
M$. The tide $\curv\tE \propto \matter M/r^3$ is unchanged at every moment, while $\curv\tB \propto \matter Mv/cr^3$
grows by $\lambda$. So a change of $\ln\lambda$ moves the readings by $\curv\tB\,\delta\ln\lambda$ and nothing else,
and its Fisher information is $|\curv\tB|^2/\sigma_n^2$ summed over the record, $\rho_B^2$:

$$\frac{\sigma_r}{r} = \frac{1}{\rho_B} ,$$

to relative order $(v/c)^2$, where the scaling stops being exact. A mass moving with $\vect v$ has $\curv\tB =
(3G\matter M/cr^3)(\hat n\vect a^{\mathsf T} + \vect a\hat n^{\mathsf T})$, with $\vect a = \hat n\times\vect v$ (section
7.5). Since $\vect a$ is perpendicular to $\hat n$, the table has the square $2|\vect a|^2$, so $|\curv\tB| =
3\sqrt2\,G\matter Mv_\perp/cr^3$, with $v_\perp$ the speed across the line of sight. Against $|\curv\tE| = \sqrt6\,G\matter
M/r^3$,

$$\rho_B = \sqrt3\,\frac{v_\perp}{c}\,\rho .$$

For the person walking across the line of sight at $1.4\unit{m\,s^{-1}}$, $\sqrt3\,v_\perp/c = 8.09\times10^{-9}$, so
$\sigma_r/r = 1.24\times10^8/\rho$: a hundred million times worse than the six neighbours' $1.16/\rho$.

## Masses on one line look like one mass nearer than their centre

Let masses $\matter M_i$ lie on one line through the pixel, all on the same side, at distances $r_i$ along $\hat n$.
The potential of each, $-G\matter M_i/|\vect x - r_i\hat n|$, is homogeneous of degree $-1$ in $\vect x$ and $r_i$
together, so its $m$-th derivatives at the pixel are $r_i^{-(m+1)}$ times a pattern that depends only on $\hat n$. Every
Taylor coefficient of the summed tide therefore has a single mass's pattern: the tide carries the weight $S_3 = \sum_i
\matter M_ir_i^{-3}$, the gradient $S_4 = \sum_i\matter M_ir_i^{-4}$, the second derivatives $S_5$, and so on. One
mass $\matter M_{\rm eff}$ at $r_{\rm eff}$ matches the field and the gradient when $\matter M_{\rm eff}r_{\rm eff}^{-3}
= S_3$ and $\matter M_{\rm eff}r_{\rm eff}^{-4} = S_4$:

$$r_{\rm eff} = \frac{S_3}{S_4} = \frac{\sum_i\matter M_ir_i^{-3}}{\sum_i\matter M_ir_i^{-4}}, \qquad \matter M_{\rm
eff} = r_{\rm eff}^3S_3 .$$

The nearer masses weigh more. Put the masses at $r + s_i$ about their centre of mass, $\sum_i\matter M_is_i = 0$, and
write $v = \langle s^2\rangle/r^2$ for their mass-weighted spread. Expanding $(r + s)^{-k} = r^{-k}[1 - ks/r +
\tfrac12k(k+1)s^2/r^2 + \dots]$ gives $S_k \propto 1 + \tfrac12k(k+1)v$, so

$$r_{\rm eff} = r\,\frac{1 + 6v}{1 + 10v} \approx r(1 - 4v) = r - \frac{4\langle s^2\rangle}{r} .$$

**Two equal masses** at $r \pm \Delta/2$ have $\langle s^2\rangle = \Delta^2/4$ and appear at $r - \Delta^2/r$. **A
uniform rod** of length $L$ pointing at the camera has $\langle s^2\rangle = L^2/12$, the variance of a uniform
spread, and appears as a point

$$\boxed{\;\frac{L^2}{3r}\ \text{nearer than its centre} .\;}$$

A rod 1 m long centred 3 m away is seen at 2.889 m, 11 cm nearer; the exact integrals give 2.890 m. A round body of any
size is a point ([section 1.3](/tutorial/newton/gauss-and-poisson/)), and its size is not measured at all.

## The spread of depths shows in the curvature, read to 1/ρ_H

The single body that matches field and gradient predicts the second derivatives with the weight $\matter M_{\rm
eff}r_{\rm eff}^{-5} = S_4^2/S_3$. The true weight is $S_5$, so the second derivatives exceed the prediction by the
share

$$\frac{S_5S_3}{S_4^2} - 1 \approx \frac{(1 + 15v)(1 + 6v)}{(1 + 10v)^2} - 1 \approx 21v - 20v = v =
\frac{\langle s^2\rangle}{r^2} .$$

The spread of the depths shows first in the curvature of the field, and its share there is the spread itself.

**How well the stencil reads it.** The pair of neighbours on the axis $a$ has the sum $\curv\tE(+b\hat e_a) +
\curv\tE(-b\hat e_a) = 2\curv\tE(0) + b^2H_a + O(b^4)$, with $H_a = \partial_a^2\curv\tE$ (no sum), and its noise is
$\sqrt2\,\sigma_n$ in each component. The spread changes the sums by $v\,b^2H_a$. The change of $\curv\tE(0)$ moves all
three sums alike, and $\sum_aH_a$ is the Laplacian of the tide, zero in vacuum, so the two changes are perpendicular
and the spread is read as if $\curv\tE(0)$ were known. Its Fisher information is $b^4\sum_a|H_a|^2/2\sigma_n^2$, and we
define $\rho_H$ by $\sigma_v = 1/\rho_H$:

$$\rho_H^2 = \frac{b^4}{2\sigma_n^2}\sum_a|H_a|^2 .$$

With $H_a = -G\matter M\,\partial_i\partial_j\partial_a\partial_a(1/R)$, the box below finds from [](#eq:fourth)

$$\sum_a|H_a|^2 = \Bigl(\frac{G\matter M}{r^5}\Bigr)^2\Bigl(522 + 810\sum_an_a^4\Bigr) .$$

::: derivation
### The sum of the squared second derivatives

Set $k = l = a$ in [](#eq:fourth) and write $c = n_a = \hat n\cdot\hat e_a$. The six-term bracket becomes $n_in_j +
2c(n_i\delta_{ja} + n_j\delta_{ia}) + c^2\delta_{ij}$ and the three-term one $\delta_{ij} + 2\delta_{ia}\delta_{ja}$, so

$$R^5\,\partial_i\partial_j\partial_a^2\frac1R = (105c^2 - 15)\,\hat n\hat n^{\mathsf T} - 30c\,(\hat n\hat
e_a^{\mathsf T} + \hat e_a\hat n^{\mathsf T}) + (3 - 15c^2)\,1 + 6\,\hat e_a\hat e_a^{\mathsf T} .$$

The products of the four tables are $\langle\hat n\hat n^{\mathsf T}, \hat n\hat n^{\mathsf T}\rangle = 1$, $\langle\hat
n\hat n^{\mathsf T}, \hat n\hat e_a^{\mathsf T} + \hat e_a\hat n^{\mathsf T}\rangle = 2c$, $\langle\hat n\hat
n^{\mathsf T}, 1\rangle = 1$, $\langle\hat n\hat n^{\mathsf T}, \hat e_a\hat e_a^{\mathsf T}\rangle = c^2$, $|\hat n\hat
e_a^{\mathsf T} + \hat e_a\hat n^{\mathsf T}|^2 = 2 + 2c^2$, $\langle\hat n\hat e_a^{\mathsf T} + \hat e_a\hat
n^{\mathsf T}, 1\rangle = \langle\hat n\hat e_a^{\mathsf T} + \hat e_a\hat n^{\mathsf T}, \hat e_a\hat e_a^{\mathsf
T}\rangle = 2c$, $|1|^2 = 3$, $\langle 1, \hat e_a\hat e_a^{\mathsf T}\rangle = |\hat e_a\hat e_a^{\mathsf T}|^2 = 1$.
Squaring the sum and collecting powers of $u = c^2$, the ten terms give $810u^2$ for the squares, $-180u$ for the
first powers and $234$ for the constants:

$$|R^5\,\partial_i\partial_j\partial_a^2(1/R)|^2 = 234 - 180\,n_a^2 + 810\,n_a^4 .$$

Summing over $a$ with $\sum_an_a^2 = 1$ gives $702 - 180 + 810\sum_an_a^4 = 522 + 810\sum_an_a^4$.
:::

With $\sigma_n^2 = |\curv\tE|^2/\rho^2 = 6(G\matter M)^2/r^6\rho^2$,

$$\boxed{\;\rho_H = \rho\Bigl(\frac br\Bigr)^2\sqrt{43.5 + 67.5\sum_an_a^4}\;}$$

since $522/12 = 43.5$ and $810/12 = 67.5$. The sum $\sum_an_a^4$ runs from $1/3$, for a mass along a diagonal of the
stencil, to 1, along an axis, so $\rho_H$ lies between $8.1$ and $10.5$ times $\rho\,(b/r)^2$. The full model of two masses
agrees with this to 2%.

**Two from one.** Two equal masses at $r \pm \Delta/2$ have $v = \Delta^2/4r^2$, read to $1/\rho_H$. They are told
from one mass at one standard deviation when $\Delta^2/4r^2 > 1/\rho_H$, that is when $\Delta > 2r/\rho_H^{1/2}$.
Writing $\rho_H = \kappa\,\rho(b/r)^2$ with $\kappa$ from 8.1 to 10.5,

$$\Delta > \frac{2}{\sqrt\kappa}\,\frac{r^2/b}{\rho^{1/2}} = (0.62\ \text{to}\ 0.70)\,\frac{r^2/b}{\rho^{1/2}} .$$

For masses 3 m away, neighbours 0.5 m out and $\rho = 10^3$, the masses must lie about 0.38 m apart in depth. The
square root of the sensitivity is the law that
[section 3.9](/tutorial/noise/positivity/) found for positive masses side by side.

## The Gaussian image is computed through the singular values of the design matrix

The worked inversion is set out in [R3](/tutorial/noise/reading-section-iv-2/): $11\times11$ pixels $b = 10$ cm
apart, each reading five components of the tide; 324 kg of gold, a box of $0.3\times0.14\times0.4$ m, 1.1 m right of
the array's centre, 1.37 m below it and 3.5 m in front, 3.92 m away; noise set by $\SNR = 2G\matter
m/z^2\sigma_nb$ with $\matter m = 324$ kg and $z = 3.5$ m; and 231 point masses on a grid 25 cm apart, 5 m wide and
2.5 m tall from the floor, in the upright plane of the safes, each with a Gaussian prior of mean zero and standard
deviation $s = 324$ kg.[^inv]

The **design matrix** $A$ has one column per cell, the 605 readings per kilogram in that cell. With the whitened
matrix written through its singular values ([section 3.4](/tutorial/noise/symmetric-matrices/)), $A/\sigma_n =
U\,\mathrm{diag}(S_k)\,V^{\mathsf T}$, the posterior of [section 3.5](/tutorial/noise/wiener-filter/) is

$$C = V\,\mathrm{diag}\Bigl(\frac{1}{S_k^2 + 1/s^2}\Bigr)V^{\mathsf T}, \qquad \hat{\vect m} =
V\,\mathrm{diag}\Bigl(\frac{S_k}{S_k^2 + 1/s^2}\Bigr)U^{\mathsf T}\,\frac{\vect y}{\sigma_n} ,$$

with $C$ the covariance of the cell masses and $\hat{\vect m}$ their mean: each pattern $\vect V_k$ is kept with the
weight $S_k^2/(S_k^2 + 1/s^2)$, and one the data do not reach keeps its prior. The singular values of $A$ span a ratio of
$9\times10^{16}$. Inverting $A^{\mathsf T}A/\sigma_n^2 + 1/s^2$ directly would square that ratio, far beyond the sixteen
digits of the arithmetic; the decomposition meets it once, and the weakest patterns, lost in round-off, are those far
below the noise, which keep their prior whatever their computed values. So the posterior is exact at any noise.

**A safe's mass** is the sum over the cells of its footprint, 0.9 m wide and up to 0.6 m above the bar's centre:
twelve cells, four across and three up. Its standard deviation is $\sqrt{\vect w^{\mathsf T}C\vect w}$, with $\vect
w$ one on those cells and zero elsewhere. It is

$$\pm729\unit{kg}\ \text{at}\ \SNR = 10^3, \qquad \pm489\unit{kg}\ \text{at}\ 10^6 ,$$

and $\pm352$ kg at $10^6$ for an array six metres across, $11\times11$ pixels 60 cm apart with the same noise per area.
The prior alone allows $324\unit{kg}\times\sqrt{12} = 1120$ kg; section 3.5 splits the 729 kg into the noise let in and
the prior's doubt left behind. The patterns above the noise, $S_k > 1/s$, number 17 at $10^3$, 39 at $10^6$ and 92 for
the wide array, which is why a thousandfold gain in sensitivity narrows the spread by only a third. These spreads
belong to the array and the noise: $C$ does not contain the readings.

## Gold farther back and heavier is told apart mostly by the turn of the line to it

Move the bar 0.2 m farther back, from 3.92 m to 4.10 m from the array's centre, and raise its mass by $(4.096/3.916)^3 =
1.144$, so that the size of the tide at the centre is unchanged. At $\SNR = 10^3$ the 605 predicted readings of the two
scenes lie 6.9 noise standard deviations apart; the best-fitting mass factor for the farther bar, 1.152, still leaves
6.8. The two are told apart at about $\SNR = 10^3$.

Most of the difference is common to all 121 pixels: 6.3 of the 6.9, in quadrature, against 2.9 from the variation
across the array. When the bar moves straight back, the line from the array to it turns by $1.26°$, 0.0219 rad. A turn by $\delta$ changes a single mass's tide $A(1 - 3\hat
n\hat n^{\mathsf T})$ by $-3A(\delta\hat n\,\hat n^{\mathsf T} + \hat n\,\delta\hat n^{\mathsf T})$, of length
$3\sqrt2A\delta$, which is $\sqrt3\,\delta$ of the tide's length $\sqrt6A$. The gold alone stands 177 noise standard
deviations above the empty room at $10^3$, so the turn alone should give about $\sqrt3\times0.0219\times177 = 6.7$,
close to the 6.3. A bar moved 0.2 m along the line of sight instead, with its mass raised by 1.161, raises the same
tide at the centre in every component, and the variation across the array then separates it by only 1.9 standard
deviations at $10^3$.

## Turning the array moves its pixels and nothing else

Each pixel reads the whole tensor in fixed axes wherever it points, so turning the array changes only where its
pixels are. Turned through $70°$ about the vertical line through its centre, the metre-wide array puts the readings of
the gold in the right safe and of the gold in the left 196.9 noise standard deviations apart at $\SNR = 10^3$, against
181.1 facing the safes: 9% better. The six-metre array, turned the same way, brings its near edge within 0.28 m of the
left safe's steel wall; the separation grows from 797 to 23,600 standard deviations, 29.6 times. Its pixel nearest the
left bar is 0.71 m from it, against 3.92 m from the array's centre, so it reads $(3.92/0.71)^3 \approx 170$ times the
tide that a central pixel reads; it and its neighbours make most of the gain.

## Positivity is imposed by non-negative least squares over three thousand draws

The positive image of [section 3.9](/tutorial/noise/positivity/) minimizes $|A\vect m - \vect y|^2/\sigma_n^2$ over the
231 cells with every $\matter m_j \ge 0$ and no prior, by the active-set method of C. L. Lawson and R. J. Hanson
(*Solving Least Squares Problems*, 1974). One **draw** adds independent Gaussian noise $\sigma_n$ to each of the 605
exact readings of the bar, a uniform box, and solves the problem once. Over three thousand draws, the mass in the right safe's twelve cells has

$$315.4 \pm 19.9\unit{kg}\ \text{at}\ \SNR = 10^3, \qquad 327.6 \pm 0.7\unit{kg}\ \text{at}\ 10^4 ,$$

the mean and the standard deviation over the draws; the left safe holds $0.3 \pm 2.0$ kg at $10^3$. The spread at
$10^4$ differs by about a tenth between sets of three thousand draws, from 0.60 to 0.73 kg, because it is set by a few
rare draws far below the truth. By hand: for a gold known to be one point, the Cramér–Rao bounds at $10^3$ are
$\pm25$ kg with its depth unknown and $\pm2.2$ kg with it known (R3), and the positive image lies between, at $\pm20$
kg. At $10^4$ both bounds fall tenfold, to 2.5 and 0.22 kg, and 0.7 kg again lies
between. The excess of 3.3 kg over the bar's 324.2 kg at $10^4$ comes mostly from the bar's centre falling between the
points of the grid (section 3.9).

**The idea to keep: every number of the worked examples is a Fisher matrix inverted, a least-squares fit or a
singular-value decomposition, set up from data that a reader can write down; and each has a hand estimate (Euler's
relation for the array, added informations for the magnetic part, the turn of a line, the cube of a distance) that
comes within a factor of two, and usually much closer.**

::: problems
### Practice

**[A.1]** For neighbours at $b = r/3$, find the cost $K$ of Euler's estimate and of the best known-position fit along
the line to the source. Which is below $\sqrt2$?

::: solution
Euler: $K^2 = 1 + (7/50)\times9 = 2.26$, $K = 1.50$. Best known-position: $K^2 = 1 + (7/150)\times9 = 1.42$, $K =
1.19$. Only the second is below $\sqrt2 = 1.41$; the full model, with the position fitted, crosses $\sqrt2$ at $b =
0.29\,r$, a little closer than $r/3$.
:::

### Stretch

**[A.1]** At one pixel reading $\curv\tE$ and $\curv\tB$, suppose the wave is known to have only the $+$ polarization.
Repeat the Schur-complement argument for the near field's covariance. In how many components does the near field pay
$\sqrt2$, and what does the wave's amplitude pay?

::: solution
Now $U$ is the single column $\mathbf u_+$ and $P = \mathbf u_+\mathbf u_+^{\mathsf T}$ projects on one direction.
The near field's block is again $(1 - P/2)^{-1} = 1 + P$, so it pays $\sqrt2$ in one component and nothing in four. The
wave's block is $(2 - \mathbf u_+^{\mathsf T}\mathbf u_+)^{-1} = 1$ in units of $\sigma_n^2$, against $1/2$ alone: the
wave still pays exactly $\sqrt2$.
:::

### The camera

**[A.1]** A pixel with six neighbours 0.5 m out reads two equal masses on one line, 3 m away along one of the
stencil's axes, with $\rho = 10^4$. Find $\rho_H$ and the smallest separation in depth told from one mass at one
standard deviation. How does it compare with the field and gradient's error on the range?

::: solution
Along an axis $\sum_an_a^4 = 1$, so $\kappa = \sqrt{111} = 10.5$ and $\rho_H = 10.5\times10^4/36 = 2930$. Then
$\Delta > 2r/\rho_H^{1/2} = 6\unit{m}/54.1 = 0.11$ m, the same as $0.62\,(r^2/b)/\rho^{1/2} = 0.62\times18\unit{m}/100$.
The range itself is known to $1.16\,r/\rho = 0.35$ mm, three hundred times finer: the spread of depths is read through
the curvature, which the stencil sees only at second order in $b/r$.
:::
:::

[^sep]: First shown in *The gravitational camera* (Mohsenvand 2026), [App. A](/paper/#app:benchmarks), whose
    Fig. [](/paper/#fig:separation-noise) draws these bounds against $b/r$ with the spread of simulated fits.

[^depth]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [*Depth with noise*](/paper/#par:depth-with-noise), with the closed form as its equation [](/paper/#eq:depth-bound).

[^inv]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [*The worked inversion*](/paper/#par:the-worked-inversion).
