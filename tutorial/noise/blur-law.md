---
id: '3.7'
title: 'The blur law: the cut-off, the logarithm, the Lambert W function, the width of a blur'
question: 'Why does making the camera $10^{27}$ times more sensitive sharpen its picture only from 24 degrees to 3.4?'
part: '3'
requires: ['1.4', '2.1', '2.6', '2.7', '3.1', '3.2', '3.5', '3.6']
paper: [sec:near-field, eq:evanescent, eq:array-data, eq:wiener, eq:cutoff, eq:resolution, tab:resolution, fig:resolution-law, fig:nearfield, eq:handheld]
figures: [fig:resolution-law]
live: [blur-law, near-field-blur]
depth: A
---

[Section IV](/paper/#sec:near-field) of the paper makes a claim about how sharp a gravitational picture can be. A camera with a
signal-to-noise ratio of a thousand sees every point of the scene as a blur 24° wide. The blur is an angle seen
from the camera, so for a scene one metre away it is a smudge 42 cm across, about the width of a person's
shoulders. A ratio of a million gives 14°. A ratio of $10^{30}$, which is $10^{27}$ times the first, still gives
a blur 3.4° wide, and to be as sharp as the human eye the camera would need a ratio of about $10^{6600}$. This
chapter derives that law from Laplace's equation and from the noise, one step at a time, and checks every entry
of the paper's table.

The answer to the guiding question is short, and the rest of the chapter earns it. Fine detail fades with
distance exponentially, while the noise does not fade at all. So each factor of ten in sensitivity buys only a
fixed small step in the finest detail that survives, and the sharpness grows with the logarithm of the
sensitivity rather than with the sensitivity itself.

![Two iron balls buried side by side, and what a flat sheet of sensors would record of them at four heights:
orange where the tide stretches, blue where it squeezes. A quarter of the balls' separation above them, the two
peaks stand apart; higher up they spread and close in, and above 1.28 separations they merge, so the pixels at two
separations see one broad bump. Each tile of the pixels is coloured by its own reading, and the noise added to each
tile is a tenth of the bump's height, larger than anything that would tell two balls from one. Each sheet is drawn
to its own scale, since the signal weakens eightfold each time the height doubles; the sheets' spacing, the balls'
depth and size and the height of the relief are not to scale.](tut-blur){#fig:sheets}

::: plain
The camera records the tide of every mass below it: how the pull of the mass changes from place to place. Its sensitivity is its signal-to-noise ratio: how many times the strongest signal
of one mass exceeds the noise. Fine detail in the scene, such as two masses close together,
makes a pattern that fades quickly with distance. Over the same distance, a pattern twice as fine keeps
only the square of the fraction that a coarser pattern keeps: if the coarser one keeps a tenth,
the finer one keeps a hundredth. At the camera, the finest detail is weaker than the noise, and nothing can
recover it.

The best picture keeps every pattern that stands above its noise, and the finest pattern kept sets the blur. Because the fading is exponential, each factor of ten in sensitivity adds only a fixed small
amount of detail. A ratio of a thousand gives a blur 24° wide, a million gives 14°, and $10^{30}$ gives 3.4°.
The blur is an angle: at the same signal-to-noise ratio, it is the same fraction of the distance for a scene a
metre away and for a scene a hundred kilometres away.
:::

## The road from Laplace's equation to the blur

We want one formula: the width of the picture of a single point mass, as the camera's best reconstruction draws
it. The derivation is long, so here is the road. Each step ends in one boxed result, and the next step uses it.

1. One number, the signal-to-noise ratio of the array, measures how sensitive the camera is.
2. Each ripple of the scene stands above its own noise by a factor that depends only on that number and on how
   fine the ripple is compared with its depth.
3. The best reconstruction keeps a ripple while that factor is larger than one. This defines a cut-off, the
   finest ripple kept.
4. Solving the equation for the cut-off needs the logarithm of a logarithm.
5. With the soft edge of the filter replaced by a sharp one, the picture of a point is the pattern of a round
   opening, a Bessel function.
6. The full width of that pattern at half its height gives the blur: 4.43 divided by the cut-off, in radians.
7. An exact calculation, with no approximation, gives the paper's table.

A last section reads the law on a real satellite, on the eye, and on other kinds of sensor.

The derivation rests on five assumptions, which the paper makes too. **The sources lie on one thin sheet** at a
depth $z$ below the sensors, so that the scene is flat. **The sensors fill a whole plane**, so that the array is
at least as wide as the scene is deep. **The noise is white**: it is independent from place to place and has the
same strength in every ripple. **The prior is a sheet of independent point masses**, one in each patch of area
$z^2$, which is our guess at the statistics of the scene before any data arrive. **The reconstruction is the best
linear one**, the Wiener filter of chapter 3.5. The patch of area $z^2$ in the prior is the same patch that
step 1 uses to measure the noise. Choosing them alike keeps the formulas simple, and step 4 shows that another
choice would move the answer only by a logarithm.

Here $z$ is the depth of the sheet below the plane of the sensors, in metres. The sheet has a **surface
density** $\sym{surface-density}{\matter{\sigma}}$, its mass per unit area, in kilograms per square metre; in the
colour of matter $\matter{\sigma}$ is always this density, and a standard deviation is written $\sigma$ with a
subscript naming its quantity, as $\sigma_n$ for the noise.

## Step 1: one number measures the camera

We want a single number that says how sensitive an array is, so that every later formula can depend on it alone.

Each sensor records the vertical tide. Chapter 1.4 describes the tide by the tidal tensor
$\curv{\tE}_{ij} = \partial_i\partial_j\sym{potential}{\field{\Phi}}$, the $3\times3$ table of the second
derivatives of the gravitational potential $\field{\Phi}$. The potential is an energy per unit mass, in joules
per kilogram, and the tidal tensor is in $\mathrm{s^{-2}}$. Each sensor records $\curv{d} = -\curv{\tE}_{zz}$,
the entry for the vertical direction (the subscript $z$ names that direction), with its sign chosen so that a
mass below gives a positive reading.

A point mass $\matter{m}$, in kilograms, has the potential $\field{\Phi} = -G\matter{m}/h$ on the vertical line
through it, where $h$ is the height above the mass. We differentiate twice with respect to $h$:

$$\frac{\partial\field{\Phi}}{\partial h} = \frac{G\matter{m}}{h^2}, \qquad \frac{\partial^2\field{\Phi}}{\partial h^2} = -\frac{2G\matter{m}}{h^3}.$$

The sensors sit at $h = z$, so directly above the mass the reading is $\curv{d} = 2G\matter{m}/z^3$. Away from
that point the reading is smaller.

The noise is described by its **spatial noise density** $\sym{noise-density}{N_0}$, in $\mathrm{s^{-4}\,m^2}$.
White noise behaves like a great many independent readings, one for each small piece of the plane, and averaging
independent readings divides their variance by their number. In the same way, averaging white noise of density
$N_0$ over a patch of area $A$ gives the variance $N_0/A$, in $\mathrm{s^{-4}}$, the square of the unit of a tide
(chapter 3.2). Over a square patch of side $z$ the standard deviation is therefore $\sqrt{N_0}/z$. The paper
compares the peak signal with this noise:

$$\boxed{\sym{snr}{\SNR} = \frac{2G\matter{m}/z^3}{\sqrt{N_0}/z} = \frac{2G\matter{m}}{z^2\sqrt{N_0}}}. \label{eq:snr}$$

The units cancel: $\sqrt{N_0}$ is in $\mathrm{s^{-2}\,m}$, so $\sqrt{N_0}/z$ is in $\mathrm{s^{-2}}$, like the
peak signal, and $\SNR$ is a pure number.

The patch of side $z$ is chosen because the bump that a point mass at depth $z$ makes in the readings is about $z$
wide, so the patch averages the noise over the area that the signal itself covers. The ratio could be measured
directly, by placing a known mass at a known depth, recording the peak many times, and comparing it with the
scatter of the patch-averaged reading when the mass is absent. A non-example is the ratio of the peak to the noise
of one sensor. That ratio changes if the same array is built from more, smaller sensors, each of them noisier,
although the array as a whole records the same information. It describes the wiring of the array and not its
power to see. Another yardstick, such as a patch of side $2z$, would multiply $\SNR$ by a constant, and step 4
shows that this moves the cut-off only by the logarithm of that constant.[^yardstick]

**A number.** The person one metre away, of mass 70 kg, makes a peak tide of $2G\matter{m}/z^3 = 9.3\times10^{-9}
\unit{s^{-2}}$ (chapter 1.4). For $\SNR = 10^3$ the noise averaged over a square metre must be a thousand times
smaller, so $\sqrt{N_0} = 9.3\times10^{-12}\unit{s^{-2}\,m}$. The noise of the tide averaged over each square
metre is then $9.3\times10^{-12}\unit{s^{-2}}$, or 0.009 eötvös, where one eötvös (E) is $10^{-9}\unit{s^{-2}}$. The
gravity satellite GOCE read the tide to between 0.01 and 0.02 E in one second, which is a noise of the same
size.[^goce-noise]

**The result.** The sensitivity of the camera is one pure number, $\SNR = 2G\matter{m}/(z^2\sqrt{N_0})$.

## Step 2: each ripple stands above its noise by a factor that depends on two numbers

We want to know how far the signal of each ripple stands above its noise, because that decides which ripples the
camera can recover.

The camera's data are best read ripple by ripple. A **ripple** here is a pattern across the sheet that varies as
$\cos(\mathbf k\cdot\mathbf a)$ along the sheet, where $\mathbf a$ is position on the sheet, in metres, and
$\mathbf k$ is the ripple's **wavevector**, which points across the crests. Its length $k = |\mathbf k|$ is the
**wavenumber**, $2\pi$ divided by the distance between crests, in $\mathrm{m^{-1}}$.

**The fade.** Above the sheet the space is empty, so the potential obeys Laplace's equation,
$\nabla^2\field{\Phi} = 0$: the sum of the second derivatives of $\field{\Phi}$ along the three directions is
zero (chapter 2.1). We look for the potential of one ripple in the form
$\field{\Phi} = \cos(\mathbf k\cdot\mathbf a)\,f(h)$, where $h$ is again the height above the sheet and $f$ is a
function to be found. The two second derivatives along the sheet bring down the factor
$-k_1^2 - k_2^2 = -k^2$, where $k_1$ and $k_2$ are the components of $\mathbf k$. Laplace's equation becomes

$$-k^2\cos(\mathbf k\cdot\mathbf a)\,f(h) + \cos(\mathbf k\cdot\mathbf a)\,f''(h) = 0.$$

We divide by $\cos(\mathbf k\cdot\mathbf a)$, which leaves an equation for $f$ alone:

$$f''(h) = k^2 f(h).$$

Its solutions are $e^{kh}$ and $e^{-kh}$. The first grows without limit far above the sheet. The field of the
sheet cannot do that, because all its sources lie below, so $f = e^{-kh}$ up to a constant. At the sensors, $h = z$, the ripple has
faded by $e^{-kz}$. This is the paper's equation:[^paper-x]

{{paper eq:evanescent}}

![A picture of buried masses is a sum of ripples, and each ripple fades as it rises toward the camera, the finer one
faster. A coarse ripple and one three times finer start equal at the lowest line; by the pixels the coarse one keeps
half its size and the fine one an eighth, the cube of a half. The noise, which does not fade, is a quarter of the
starting size: the coarse ripple stands twice above it, while the fine one is lost in it. The heights are stretched
about ten times so that the lines can be told apart; the sizes of the ripples and of the noise are
exact.](tut-ripples){#fig:ripples}

**What the array records.** The constant in front of the fade comes from Gauss's law at the sheet. Chapter 2.7
finds it, and gives the potential of a ripple of surface density $\tilde{\matter{\sigma}}$ as
$\tilde{\field{\Phi}} = -2\pi G\,\tilde{\matter{\sigma}}\,e^{-kh}/k$. The reading
$\curv{d} = -\partial^2\field{\Phi}/\partial h^2$ brings down a factor $k^2$ from the exponential, so the ripple
of the data is $2\pi G\,k\,e^{-kz}\,\tilde{\matter{\sigma}}$. With the noise added, this is the paper's equation
for what the array records:

{{paper eq:array-data}}

Here $\tilde{\curv{d}}(\mathbf k)$ and $\tilde{\matter{\sigma}}(\mathbf k)$ are the Fourier transforms of the data
and of the surface density across the plane: they give the amount of each ripple $\mathbf k$ in each pattern
(chapter 2.6). The term $\tilde n(\mathbf k)$ is the transform of the noise.

**The ratio of signal to noise in one ripple.** White noise gives every ripple the same noise strength, $N_0$
(chapter 3.2). Chapter 3.5 shows that a ripple recorded as $\tilde d = T\tilde\sigma + \tilde n$ then stands above
its noise by a factor $s$, whose square is the expected squared size of the signal in that ripple over that of
the noise:

$$s^2 = \frac{|T(\mathbf k)|^2\,S_\sigma}{N_0}. \label{eq:s-squared}$$

Here $T(\mathbf k)$ is the **gain** of the ripple, the factor that multiplies $\tilde{\matter{\sigma}}$. From the
paper's equation [](/paper/#eq:array-data) it is $T(\mathbf k) = 2\pi G\,k\,e^{-kz}$. The quantity $S_\sigma$ is
the **spectrum** of the prior: the expected value of $|\tilde{\matter{\sigma}}|^2$ per unit area of the sheet, in
$\mathrm{kg^2\,m^{-2}}$, which says how strong each ripple of the scene is expected to be before any data arrive.
For a sheet of independent point masses $\matter{m}$, one per area $z^2$, the masses add their squared sizes
because they are independent. The spectrum is therefore $\matter{m}^2$ times the number of masses per unit area,
$S_\sigma = \matter{m}^2/z^2$, the same for every ripple (chapter 3.2).[^units-s]

We put the gain and the spectrum into \eqref{eq:s-squared} and take the square root:

$$s = \frac{2\pi G\,k\,e^{-kz}\,\matter{m}}{z\sqrt{N_0}}.$$

We multiply and divide by $z$, so that the combination $2G\matter{m}/(z^2\sqrt{N_0})$ of \eqref{eq:snr} appears:

$$s = \pi\,\frac{2G\matter{m}}{z^2\sqrt{N_0}}\;kz\;e^{-kz}.$$

We write $\sym{kz}{q} = kz$, a pure number that measures the fineness of a ripple against the depth (a ripple
with $q = 1$ has crests $2\pi z$ apart, a ripple with $q = 10$ has crests $0.63\,z$ apart). Then

$$\boxed{\sym{ripple-ratio}{s} = \pi\,\SNR\;q\,e^{-q}, \qquad q = kz}. \label{eq:s}$$

Every other quantity has disappeared. The mass, the noise density and $G$ enter only through $\SNR$, and the
wavenumber and the depth enter only through their product $q$. This is why the blur will come out as an angle:
a ripple whose crests are a metre apart, seen from a metre, behaves exactly as a ripple whose crests are a
kilometre apart, seen from a kilometre.

**Numbers, at $\SNR = 10^3$.** A coarse ripple with $q = 1$ stands $s = 1160$ times above its noise. A ripple
with $q = 5$ stands 106 times above it. A ripple with $q = 10.4$ has $s = 0.99$, about as strong as its noise,
and a ripple with $q = 12$ has $s = 0.23$, four times weaker than its noise. The factor $q\,e^{-q}$ is largest at
$q = 1$, where $s = \pi\SNR/e$, so ripples about $2\pi z$ apart are the ones the camera sees best.

**A limit.** As $q \to 0$, $s \to 0$ as well, because of the factor $q$. A perfectly uniform sheet makes no tide
at all, as chapter 2.7 shows, so the camera cannot see it at any sensitivity.

**The result.** Each ripple stands above its noise by $s = \pi\SNR\,q\,e^{-q}$, which depends only on two
numbers: the sensitivity $\SNR$ and the fineness $q = kz$.

## Step 3: the filter keeps a ripple while it stands above its noise

We want the weight that the best reconstruction gives each ripple, and from it the finest ripple that it keeps.

The reconstruction treats each ripple on its own. It divides the data by the gain $T$, to undo the fade, and
multiplies the result by a weight $\sym{wiener-filter}{H}$, a pure number between zero and one. The
reconstruction of the ripple $\mathbf k$ is therefore

$$\frac{H}{T}\,\tilde{\curv{d}} = H\,\tilde{\matter{\sigma}} + \frac{H}{T}\,\tilde n. \label{eq:estimate}$$

The first term is the true ripple, weighted by $H$. The second is the noise, enlarged by $1/T$ along with the
signal. Chapter 3.5 derives the best weight, the **Wiener filter**. Among all reconstructions that are linear in
the data, it makes the mean squared error as small as possible, where the mean squared error is the average,
over the prior and the noise, of the squared difference between the reconstruction and the truth. A smaller
weight would throw away signal, and a larger one would let in more noise than signal. The paper writes the
weight in terms of $s$:

{{paper eq:wiener}}

Here $H$ is a weight per ripple and not the image itself.[^H-bits] A ripple with $s = 3$ is kept with weight
$0.9$, a ripple with $s = 1$ with weight one half, and a ripple with $s = 1/3$ with weight $0.1$.

We now follow $H$ as $q$ grows, using \eqref{eq:s}. At $q = 0$, $s = 0$ and $H = 0$. The ratio $s$ rises as
$\pi\SNR\,q$, so it passes one near $q \approx 1/\pi\SNR$, which is $3.2\times10^{-4}$ at $\SNR = 10^3$. It peaks
at $q = 1$ and then falls, because the exponential wins over the factor $q$. It passes one again at a larger
value $q_c$, and beyond that $H$ falls to zero. So $H$ is close to one from a few times $1/\pi\SNR$ to a little
below $q_c$, and it falls through one half at $q_c$. The **cut-off** $\sym{cutoff}{q_c}$ is the larger root of
$s = 1$:

$$\boxed{q_c\,e^{-q_c} = \frac{1}{\pi\,\SNR}}. \label{eq:cutoff-here}$$

This is the first line of the paper's equation:

{{paper eq:cutoff}}

The second line, the approximation, is the subject of step 4. Panel (a) of the paper's figure below draws $H$ for
four sensitivities, with a dot at each cut-off; panel (b) is the blur that steps 5 to 7 derive from it.

{{paper fig:resolution-law}}

**The edge of the filter.** Step 5 will replace the soft edge of $H$ by a sharp one, so we need to know how wide
the edge is. The weight $H$ falls from $0.9$ to $0.1$ while $s$ falls from 3 to $1/3$, so while $\ln s$ falls by
$\ln 9 = 2.20$. From \eqref{eq:s}, $\ln s = \ln(\pi\SNR) + \ln q - q$, and its slope is $1/q - 1$. Near the
cut-off the slope is about $-(1 - 1/q_c)$, so the edge has a width

$$\Delta q \approx \frac{\ln 9}{1 - 1/q_c}$$

in $q$. At $\SNR = 10^3$ this is 2.43, and at $10^{30}$ it is 2.23. The width of the edge hardly changes, while
$q_c$ itself grows from 10.4 to 74.5. Measured against the cut-off, the edge therefore becomes sharper and
sharper: it is 23% of $q_c$ at $10^3$ and 3% at $10^{30}$.

**The result.** The best reconstruction keeps the ripples up to the cut-off $q_c$, the larger root of
$q_c e^{-q_c} = 1/\pi\SNR$, and its edge there is about 2.4 wide in $q$ at every sensitivity.

## Step 4: solving the cut-off needs a logarithm of a logarithm

We want $q_c$ as a number, and we want to see how it grows with $\SNR$. The equation
\eqref{eq:cutoff-here} cannot be solved with the functions of school algebra, so we solve it by repeated
substitution and name the answer afterwards.

We take the natural logarithm of both sides of \eqref{eq:cutoff-here}:

$$\ln q_c - q_c = -\ln(\pi\SNR).$$

We move $q_c$ to the left alone and write $L_\pi = \ln(\pi\SNR)$ for short:[^L]

$$q_c = L_\pi + \ln q_c. \label{eq:fixed-point}$$

The unknown appears on both sides, but on the right it sits inside a logarithm, where a change in it matters
little. That suggests a **fixed-point iteration**: we guess $q_c$, put the guess into the right-hand side, and
take the result as a better guess. Since $\ln q_c$ is much smaller than $q_c$, the first guess is $q_0 = L_\pi$,
and each new guess is $q_{j+1} = L_\pi + \ln q_j$, where $j = 0, 1, 2, \ldots$ counts the guesses.

The iteration settles down because the logarithm is flat. If a guess is wrong by a small amount $\epsilon$, the
next one is wrong by about $\epsilon$ times the slope of $\ln q$, which is $1/q$. Near $q = 10$ every step cuts
the error by a factor of ten.

**Numbers, at $\SNR = 10^3$.** Here $L_\pi = \ln(3142) = 8.05$. The guesses are

$$\begin{gathered}
q_1 = 10.138,\qquad q_2 = 10.369,\\
q_3 = 10.391,\qquad q_4 = 10.3935,
\end{gathered}$$

and the exact root is $10.3937$. The errors are 0.26, 0.025, 0.0024 and 0.0002: each a tenth of the one before.

The first guess and one step of the iteration, $q_1 = L_\pi + \ln L_\pi$, give the paper's approximation,

$$\boxed{q_c \approx \ln(\pi\SNR) + \ln\ln(\pi\SNR)},$$

which is 10.1 against the exact 10.4 at $\SNR = 10^3$. One more step gives $q_2 = L_\pi + \ln(L_\pi + \ln
L_\pi)$. We write the logarithm as $\ln L_\pi + \ln(1 + \ln L_\pi/L_\pi)$ and use $\ln(1 + \epsilon) \approx
\epsilon$ for small $\epsilon$, so the next term of the series is $\ln L_\pi/L_\pi$:

$$q_c \approx L_\pi + \ln L_\pi + \frac{\ln L_\pi}{L_\pi},$$

which gives 10.40 at $\SNR = 10^3$. The term $\ln\ln(\pi\SNR)$ is an **iterated logarithm**, the logarithm of a
logarithm. It grows so slowly that it is 2.1 at $\SNR = 10^3$ and only 4.3 at $10^{30}$.

**The name of the answer.** The root has a name. The **Lambert W function** is the inverse of the function
$v\,e^v$: $\mathrm{W}(y)$ is the number $v$ with $v\,e^v = y$. If we put $v = -q_c$, then \eqref{eq:cutoff-here}
reads $v\,e^v = -1/\pi\SNR$. For a value of $y$ between $-1/e$ and $0$ this equation has two real solutions,
and they are called the two **branches** of the function: the upper branch $\mathrm{W}_0$, with $v$ between $-1$
and $0$, and the lower branch $\mathrm{W}_{-1}$, with $v$ below $-1$. Our cut-off is the larger root in $q$, so it
comes from the lower branch:

$$q_c = -\sym{lambert-w}{\mathrm{W}_{-1}}\Bigl(-\frac{1}{\pi\SNR}\Bigr).$$

The upper branch is the non-example. It gives the small root, $q = 3.2\times10^{-4}$ at $\SNR = 10^3$, which is the
low edge of $H$ found in step 3, where the filter starts to see anything at all. Both roots exist only when
$1/\pi\SNR < 1/e$, that is when $\SNR > e/\pi = 0.87$; a weaker camera sees no ripple above its noise.

**A limit.** For very large $\SNR$ the terms after $L_\pi$ become small compared with it, so $q_c/\ln\SNR \to
1$. The cut-off wavenumber is then $k_c = q_c/z \approx \ln\SNR/z$, the first estimate of chapter 2.7, which
asked for the ripple whose fade $e^{kz}$ equals $\SNR$. The approach is slow: the ratio $q_c/\ln\SNR$ is 1.50 at
$10^3$, 1.08 at $10^{30}$, and 1.004 at $10^{1000}$.

**What it means.** Multiplying $\SNR$ by ten adds $\ln 10 = 2.3$ to $L_\pi$. Differentiating
\eqref{eq:fixed-point} gives $\dd q_c = \dd L_\pi/(1 - 1/q_c)$, so $q_c$ grows by a little more than 2.3.
Sensitivity buys sharpness only through its logarithm.

**The result.** The exact cut-offs are 10.4, 17.8, 27.5, 51.1, 74.5 and 144.3 at $\SNR = 10^3$, $10^6$, $10^{10}$,
$10^{20}$, $10^{30}$ and $10^{60}$, and each factor of ten in $\SNR$ adds a little more than 2.3.

## Step 5: the picture of a point is the pattern of a round opening

We want the picture that the reconstruction draws of a single point mass, because its width is the blur. This
step is a sketch: it makes one approximation, and the box at its end names what that leaves out.

**The picture of a point.** By \eqref{eq:estimate}, the reconstruction of each ripple is $H\tilde{\matter{\sigma}}$
plus filtered noise. The noise has zero mean, so the average over many repetitions of the measurement, each with
fresh noise, keeps only $H\tilde{\matter{\sigma}}$. A point mass $\matter{m}$ at the origin of the sheet is the
surface density $\matter{\sigma} = \matter{m}\,\delta^2(\mathbf a)$, where the delta function $\delta^2$ is zero
everywhere except at the origin and has integral one over the plane (chapter 1.3). Its Fourier transform is
therefore $\tilde{\matter{\sigma}} = \matter{m}$ for every $\mathbf k$ (chapter 2.6). We put the ripples back
together with the inverse transform of chapter 2.6, which carries the factor $1/(2\pi)^2$:

$$\hat{\matter{\sigma}}(\mathbf a) = \matter{m}\int H(k)\,e^{i\mathbf k\cdot\mathbf a}\,\frac{\dd^2k}{(2\pi)^2}.$$

This average is the **point-spread function** of the reconstruction: the picture it draws of one point.

**The approximation: the edge of $H$ is a sharp step.** We replace $H$ by one for $k < k_c$ and zero beyond,
where $k_c = q_c/z$ is the cut-off wavenumber. By step 3 the edge of $H$ is about 2.4 wide in $q$, so the small
parameter is the edge width over the cut-off, 0.23 at $\SNR = 10^3$, and the approximation improves as $q_c$
grows. A filter that keeps every wavevector inside a circle and none outside acts like the round opening of a
lens, a **pupil**, so the picture we are about to find is called the pattern of a round pupil.

**The integral.** With the step, the integral runs over a disc of radius $k_c$. We use polar coordinates in the
plane of $\mathbf k$, with $\varphi$ the angle between $\mathbf k$ and $\mathbf a$, and $a = |\mathbf a|$ the
distance from the point mass in metres, so that $\mathbf k\cdot\mathbf a = ka\cos\varphi$ and
$\dd^2k = k\,\dd k\,\dd\varphi$:

$$\hat{\matter{\sigma}} = \frac{\matter{m}}{(2\pi)^2}\int_0^{k_c}\!k\,\dd k\int_0^{2\pi}\!e^{ika\cos\varphi}\,\dd\varphi.$$

The angular integral is $2\pi$ times the Bessel function $J_0(ka)$, by its definition:[^bessel]

$$\hat{\matter{\sigma}} = \frac{\matter{m}}{2\pi}\int_0^{k_c}J_0(ka)\,k\,\dd k.$$

We substitute $t = ka$, so that $k\,\dd k = t\,\dd t/a^2$, and use $\int_0^u J_0(t)\,t\,\dd t = u\,J_1(u)$ with
$u = k_ca$:

$$\hat{\matter{\sigma}} = \frac{\matter{m}}{2\pi a^2}\,k_ca\,J_1(k_ca) = \frac{\matter{m}\,k_c^2}{2\pi}\,\frac{J_1(k_ca)}{k_ca}.$$

For small $u$, $J_1(u) \approx u/2$, so the peak at $a = 0$ is $\matter{m}k_c^2/4\pi$. That is $\matter{m}$ times
the area $\pi k_c^2$ of the disc, divided by $(2\pi)^2$, as the first integral says it must be. Dividing by the
peak gives the normalized picture of a point,

$$\boxed{\frac{\hat{\matter{\sigma}}(a)}{\hat{\matter{\sigma}}(0)} = \frac{2J_1(u)}{u}, \qquad u = k_ca = \frac{q_c\,a}{z}}. \label{eq:jinc}$$

Here $u$ is a pure number, the distance from the point in units of $z/q_c$.[^u]

**The row.** Suppose instead that a single row of sensors lies above a scene of long, straight line masses laid
at right angles to the row, so that the scene changes only along the row. The integral then runs over the
interval $-k_c < k < k_c$ instead of a disc, and needs no Bessel functions:

$$\int_{-k_c}^{k_c}e^{ika}\,\dd k = \frac{2\sin(k_ca)}{a}.$$

Divided by its value $2k_c$ at $a = 0$, this is $\sin u/u$, with the same $u = q_ca/z$ and with $a$ now the
distance along the row.

**The result.** With a sharp edge, the reconstruction draws a point as $2J_1(u)/u$ under a plane of sensors and
as $\sin u/u$ under a row, with $u = q_ca/z$.

::: gap
This sketch skips three things.

- **The soft edge of $H$.** The real filter falls over a width of about 2.4 in $q$, not at once. Rounding the
  edge makes the picture slightly narrower. The exact calculation of step 7 finds the width smaller than
  $4.43/q_c$ by close to $2/q_c^2$ of itself: 1.8% at $\SNR = 10^3$ and 3.3% at $\SNR = 100$.
- **The low edge of $H$.** The filter also drops the coarsest ripples, below $q \approx 1/\pi\SNR$. Removing them
  takes a very broad and very shallow sheet out of the picture. Its height is about the ratio of the areas of the
  two discs in the plane of $\mathbf k$, $\bigl(1/(\pi\SNR\,q_c)\bigr)^2$, times a logarithm: about
  $2\times10^{-8}$ of the peak at $\SNR = 10^3$. It does not change the width.
- **The Bessel functions themselves.** Their definitions and the two properties used here are derived in chapter
  3.6 and only quoted in this one.
:::

## Step 6: the blur is the width of the picture at half its height

We want one number for the width of \eqref{eq:jinc}. The paper uses the **full width at half maximum**: the
distance between the two points, one on each side of the peak, where the picture has fallen to half its peak
value.

The width must be measured on the picture itself and not on its square. The reconstruction
$\hat{\matter{\sigma}}$ is a surface density, in kilograms per square metre, and it is linear in the data: the
picture of two masses is the sum of their two pictures. Such a picture is an **amplitude image**. A telescope
that photographs a star records something else, the energy of light arriving at each point, which is the square
of the light's amplitude and is called an **intensity image**. The Airy pattern of optics, which chapter 3.6
derives, is $(2J_1(u)/u)^2$, the intensity image of a round pupil. Our picture is its amplitude, $2J_1(u)/u$.

**The half maximum.** The equation $2J_1(u)/u = \tfrac12$ has no closed-form solution. Bisection, which halves an
interval known to hold the root until the interval is small enough, finds it on the interval from 1 to 3 at
$u = 2.2151$, to the four figures shown.[^numerics] The picture therefore falls to half its peak at a distance
$a = 2.2151\,z/q_c$ on each side, and its full width is $2\times2.2151\,z/q_c = 4.4302\,z/q_c$.

**As an angle.** A width $w$ at depth $z$ directly below the array spans an angle of $w/z$ radians as seen from
the array.[^angle] Dividing the full width by $z$ gives the blur:

$$\boxed{\sym{angular-blur}{\Delta\theta} = \frac{4.43}{q_c}} \quad\text{(radians)},$$

which is the paper's law:[^theta]

{{paper eq:resolution}}

**A number.** At $\SNR = 10^3$, $q_c = 10.39$, so $\Delta\theta = 4.43/10.39 = 0.426$ radians, or 24.4°. The exact
calculation of step 7 gives 24.0°. At one metre the exact blur is 42 cm wide, about the width of a person's
shoulders.

**The row.** The equation $\sin u/u = \tfrac12$ has its root at $u = 1.8955$, so a row of sensors has the blur
$3.79/q_c$, which is 20.9° at $\SNR = 10^3$ (exact: 20.7°).

**A contrast.** If we had measured the width on the intensity $(2J_1(u)/u)^2$, the half maximum would fall at
$u = 1.6163$ and the width would be $3.23/q_c$. That would understate the blur by 27%, because the square of a
curve that is smaller than one falls faster than the curve.

**A check, the limit of high sensitivity.** As $\SNR$ grows, $q_c$ grows and $\Delta\theta$ shrinks to zero, but
only as $1/\ln\SNR$. The picture also rings: $2J_1(u)/u$ dips below zero beyond its first zero at $u = 3.83$ and
reaches $-0.13$ of the peak at $u = 5.14$. A reconstructed mass is surrounded by faint rings of negative density,
which are the price of cutting off the fine ripples (in a row, $\sin u/u$ dips to $-0.22$, the ripples of the
paper's figure [](/paper/#fig:nearfield)).

**The result, and the road so far.** Laplace's equation fades a ripple of fineness $q$ by $e^{-q}$. Against white
noise and a prior of point masses, the ripple stands above its noise by $s = \pi\SNR\,q\,e^{-q}$. The best
reconstruction keeps the ripples with $s > 1$, which ends at the cut-off $q_ce^{-q_c} = 1/\pi\SNR$, a little
above $\ln(\pi\SNR) + \ln\ln(\pi\SNR)$. A filter that keeps every ripple inside a circle draws a point as
$2J_1(u)/u$, whose full width at half maximum is $4.43\,z/q_c$, an angle of $4.43/q_c$.

## Step 7: an exact calculation reproduces the paper's table

We want to know how good the sharp edge of step 5 is, because the paper's table is computed without it.

**The inputs** are the exact filter $H(q)$ of the paper's equation [](/paper/#eq:wiener), with $s$ from
\eqref{eq:s}, at each $\SNR$. **The method** is to compute the picture of a point by numerical integration of
$\int_0^\infty H(q)\,J_0(qa/z)\,q\,\dd q$ on the plane and $\int_0^\infty H(q)\cos(qa/z)\,\dd q$ on a row, and to
find its half maximum by bisection. **The tolerance** is 0.05° in every entry, the precision the table prints.
Three sources agree on every entry: the paper's table, the exact calculation of the paper's reference
implementation, and a recomputation written for this chapter.[^code]

The table also asks when two equal point masses show a dip between them. Let $P(u)$ be the picture of one point,
and let the two masses sit at $u = -b$ and $u = +b$, so that $u$ is measured from their midpoint and $2b$ is
their separation, both in units of $z/q_c$. The picture of the pair is $P(u - b) + P(u + b)$. Its slope at the
midpoint is zero by symmetry, and its second derivative there is $P''(-b) + P''(b) = 2P''(b)$, because $P$ is
the same on both sides. The midpoint therefore becomes a dip as soon as $P''(b) > 0$. An **inflection point** of
a curve is where it stops curving downward and starts curving upward, so the dip appears once the midpoint, a
distance $b$ from each mass, lies beyond the inflection point of each mass's picture. That separation is
**Sparrow's criterion** for telling two points apart.[^sparrow]

| $\SNR$ | $q_c$ | Plane | Row | Two points | $4.43/q_c$ | $\pi/\ln\SNR$ |
|---:|---:|---:|---:|---:|---:|---:|
| $10^{3}$ | 10.4 | 24.0° | 20.7° | 24.5° | 24.4° | 26.1° |
| $10^{6}$ | 17.8 | 14.1° | 12.1° | 14.6° | 14.2° | 13.0° |
| $10^{10}$ | 27.5 | 9.2° | 7.9° | 9.5° | 9.2° | 7.8° |
| $10^{20}$ | 51.1 | 5.0° | 4.2° | 5.1° | 5.0° | 3.9° |
| $10^{30}$ | 74.5 | 3.4° | 2.9° | 3.5° | 3.4° | 2.6° |
| $10^{60}$ | 144.3 | 1.8° | 1.5° | 1.8° | 1.8° | 1.3° |

: The blur of the near-field picture, recomputed for this chapter. "Plane" and "Row" are the exact full widths
at half maximum for a plane of sensors and for a single row; "Two points" is the smallest separation at which two
equal masses show a dip in the plane's picture; $4.43/q_c$ is the law of step 6; the last column is the first
estimate of chapter 2.7.

Every entry agrees with Table [](/paper/#tab:resolution) of the paper, apart from the column $4.43/q_c$, which is
added here to set the law beside the exact width. Panel (b) of the figure in step 3 draws the same values. The
ratio of the exact width to $4.43/q_c$ is 0.967 at $\SNR = 100$, 0.982 at $10^3$ and 1.000 at $10^{30}$, so the
paper's "within four per cent for every $\SNR \ge 100$" holds.

The two-point separation is a few per cent larger than the full width: 2% at $10^3$ and 4% at $10^{60}$. That is
a property of the amplitude picture of a round pupil, and not a rule for every picture. For the intensity
$(2J_1(u)/u)^2$, the two-point separation is 2.98 in $u$ and the full width is 3.23, so the order is reversed.

The last column shows why the first estimate is only a first estimate. It is of the right size everywhere, but
it is too wide at low sensitivity and too sharp at high sensitivity. At low sensitivity it is too wide because it
uses $\ln\SNR$ for the cut-off, and the true $q_c$ is larger, 1.5 times larger at $10^3$. At high sensitivity
$q_c$ comes close to $\ln\SNR$, and the estimate is too sharp because the picture of a point is $4.43/q_c$ wide,
which is wider than the $\pi/q_c$ that the estimate assumes.

**The result.** The exact blur agrees with $4.43/q_c$ to within four per cent for every $\SNR \ge 100$, and every
entry of the paper's table is reproduced.

## What the law means

The law has two plain consequences. **The blur depends on the sensitivity only through its logarithm**: from
$10^3$ to $10^{30}$, a factor of $10^{27}$, the cut-off grows from 10.4 to 74.5, seven times, and the blur
shrinks seven times, from 24.0° to 3.4°. That answers the guiding question. **The blur is an angle**: only $kz$
enters, so at the same signal-to-noise ratio the blur is 42 cm for a scene one metre away and 42 m for a scene a
hundred metres away. A real camera would not see the same person at a hundred metres with the same ratio. By
\eqref{eq:snr} the ratio falls as $1/z^2$, so a camera that has $\SNR = 10^3$ for a person one metre away has
$\SNR = 0.1$ for the same person a hundred metres away, below the 0.87 of step 4, and sees nothing at all.

A precise measurement is still possible through a wide blur. The law limits the picture of an unknown scene,
not the precision with which a scene known to be simple can be measured. A single mass at one metre is placed to
within about a millimetre at $\SNR = 10^3$ (chapter 3.3), although its picture is 42 cm wide. The reason is that
the centre of a bump of known shape can be found to about its width divided by the signal-to-noise ratio, and
the bump in the data is about $z$ wide (step 1): $1\unit{m}/1000 = 1\unit{mm}$. The fact that mass is never
negative also separates a few compact masses far more finely than the blur.[^later]

The rest of this section is a set of estimates. Each gives its inputs, the arithmetic in one line, and a
comparison.

**A satellite that flew.** GOCE carried a gradiometer, an instrument that measures the tide, around the Earth at
a height $z = 254\unit{km}$ for four years. On a sphere the field is sorted into patterns labelled by a whole
number $\ell$, the **spherical-harmonic degree** (chapter 2.2). A pattern of degree $\ell$ has crests about
$2\pi R/\ell$ apart on a sphere of radius $R$, so on the ground its wavenumber is $k = \ell/R$. GOCE's final map
runs out of signal between degrees $\ell = 280$ and $300$ (the paper's paragraph "A flown gradiometer"
[@BrockmannSchubertSchuh2021; @Kvas2021]). With the Earth's radius $R = 6371\unit{km}$, the cut-off is
$q_c = \ell z/R = 11.2$ to $12.0$. Reading \eqref{eq:cutoff-here} backwards, $\SNR = e^{q_c}/\pi q_c$, which is
2000 to 4200. The blur $4.43/q_c$ is 21° to 23°, and on the ground the blur $4.43\,z/q_c$ is 94 to 101 km,
about a hundred kilometres. Four years of GOCE's measurements correspond to the first row of the
table.[^goce-flat]

**The eye.** The human eye resolves about one arcminute, $2.9\times10^{-4}$ radians. Setting $4.43/q_c$ equal to
it gives $q_c = 15{,}230$, and then $\SNR = e^{q_c}/\pi q_c$, a number with 6610 digits. The paper rounds it to
"near $10^{6600}$". For comparison, the number of atoms in the observable universe is about $10^{80}$, a number
with 81 digits.

**The quantum ceiling.** The paper estimates that no camera could watch a person with a ratio better than about
$10^{70}$, even for the age of the universe.[^quantum] At $10^{70}$, $q_c = 167$ and the blur is
$4.43/167 = 0.026$ radians, or 1.5°. Every point of a face seen from a metre would still be drawn as a smudge
about 2.6 cm wide, so on this estimate no camera of this kind could draw a face.

**Other gravitational sensors.** Nothing in the derivation used the fact that the sensors read a tide, except
the factor $q$ in $q\,e^{-q}$. Sensors that compare clocks read the potential itself, whose kernel over a sheet
goes as $q^{-1}e^{-q}$, and accelerometers read its gradient, whose kernel goes as $e^{-q}$ (chapter 2.7). The
cut-off condition becomes $q^pe^{-q} = 1/\pi\SNR$ with $p = -1$, $0$ and $1$ for clocks, accelerometers and
tides. At $\SNR = 10^3$ the cut-offs are 6.2, 8.1 and 10.4. They differ by about the logarithm of $q_c$, and a
change in the definition of $\SNR$ for each kind of sensor shifts each of them by a similar amount. The blur
belongs to Laplace's equation, which every static gravitational field obeys in empty space, and not to the
detector.

**A small camera.** Everything so far assumed an array at least as wide as the scene is deep. A camera much
smaller than its distance to the scene does worse, and here we state the paper's result with a sketch. Seen from
the camera, the field of a source at a distance $r$ can be split into patterns over the sky of increasing degree
$\ell$, as on the Earth above, and a pattern of degree $\ell$ has features about $\pi/\ell$ radians wide. Inside
the camera, the tide of the pattern of degree $\ell$ grows from the camera's centre as the power $\ell - 2$ of
the distance from it, while the tide of the coarsest pattern, the quadrupole with $\ell = 2$, is the same
everywhere. At the camera's edge, a distance $D/2$ from its centre for a camera of width $D$, the pattern of
degree $\ell$ is therefore weaker than the quadrupole by a factor of about $(D/2r)^{\ell-2}$. The camera sees
degree $\ell$ only if its signal-to-noise ratio makes up for that factor, $\SNR \gtrsim (2r/D)^{\ell-2}$, which
gives

{{paper eq:handheld}}

A camera ten centimetres across, looking at a lorry fifteen metres away with $\SNR = 10^6$, has
$\ell_{\max} = 2 + \ln(10^6)/\ln 300 = 4.4$ and a blur of $\pi/4.4 = 0.71$ radians, about 40°, against 14° for an
array as wide as the lorry is far. The logarithm appears again, now of the ratio $2r/D$ as well as of $\SNR$.

::: try {#blur-law}
This draws the road of steps 2 to 7 at the sensitivity you choose. Panel (a) is the curve $q\,e^{-q}$ and the
level $1/(\pi\SNR)$: the ripples between the two crossings stand above their noise, and the upper crossing is
the cut-off $q_c$. Panel (b) is the weight $H$ that follows, and beside it the exact picture of a point, with its
full width at half maximum and the sharp-edge approximation of step 5. Drag the sensitivity slider or the dashed
line, or use the arrow keys.

The figure asks two questions at its top, and shows each answer once you have done what the question asks.
Before you touch anything, decide how much sharper you expect the picture to get when the camera becomes a
thousand times more sensitive, and write the number down. Then raise the sensitivity by three powers of ten.
While you do, watch how far the dashed level moves on its axis, and how far the crossing moves along $q$. For the
second question, guess how sensitive a camera must be to see as sharply as the eye, and then take the slider to
its top.
:::

::: try {#near-field-blur}
This is the paper's Figure [](/paper/#fig:nearfield): a row of sensors above two line masses at depth $z$, what
the sensors record, and the best reconstruction at the sensitivity you choose. Because it is a row, its blur is
the row's law of step 6, $3.79/q_c$, drawn as a bar and printed in units of the depth. Drag the sensitivity and
separation sliders, or use the arrow keys.

The figure opens at $\SNR = 10^6$. Before you move anything, predict by what factor the blur bar will shrink when
the sensitivity rises a million-fold, to $10^{12}$. Then try it, and compare the factor with the growth of $q_c$
in step 4. Next, set the sensitivity to $10^3$ and bring the masses together until the verdict below the figure
changes. The figure calls the masses told apart when the reconstruction dips by at least three per cent between
them. Compare the separation at which the verdict changes with the length of the blur bar, and then do the same
at $10^6$. The last question of the check below gives the numbers.
:::

::: check
### Q

What are the cut-off and the blur of a plane of sensors at $\SNR = 10^6$?

### A

The cut-off solves $q_ce^{-q_c} = 1/(\pi\times10^6)$, which gives $q_c = 17.8$. The law gives
$4.43/17.8 = 0.248$ radians, or 14.2°, and the exact calculation gives 14.1°.

### Q

Why does doubling the distance to the scene, at the same signal-to-noise ratio, leave the angular blur unchanged?

### A

Only the product $q = kz$ enters $s$, $H$ and $q_c$. Doubling $z$ halves the finest wavenumber kept,
$k_c = q_c/z$, so the blur in metres doubles while the blur as an angle, width over depth, stays the same. (For
the same mass seen by the same camera, $\SNR$ falls as $1/z^2$, so doubling the distance divides it by four. At
$10^3$ that lowers $q_c$ from 10.4 to 8.8 and widens the blur by about a sixth: the change is only logarithmic.)

### Q

Why is the half maximum measured on $2J_1(u)/u$ and not on its square?

### A

The reconstruction is a surface density, linear in the data, so the picture of two masses is the sum of their
pictures. It is an amplitude image. The square would describe an intensity, which is what a photograph of
light records, and it would understate the blur by 27%.

### Q

About what signal-to-noise ratio gives a blur of 10°?

### A

A blur of 10° is 0.175 radians, so $q_c = 4.43/0.175 = 25.4$, and $\SNR = e^{q_c}/\pi q_c \approx
1.3\times10^9$: about $10^9$.

### Q

In the figure of two buried masses, by what factor does the blur bar shrink from $\SNR = 10^6$ to $10^{12}$, and
where do the masses come apart?

### A

The bar shrinks from $0.21\,z$ to $0.12\,z$, a factor of 1.8. The bar is $3.79/q_c$, and $q_c$ grows from 17.8 to
32.2, also a factor of 1.8: doubling the number of powers of ten in $\SNR$ nearly doubles $\ln(\pi\SNR)$, and
$q_c$ with it. The verdict changes near $0.41\,z$ at $10^3$, where the bar is $0.36\,z$, and near $0.24\,z$ at
$10^6$, where the bar is $0.21\,z$. Two pictures must sit a little farther apart than the width of one before a
dip opens between them, as the two-point column of the table shows for the plane.
:::

**The idea to keep: fine detail fades as $e^{-kz}$ while noise does not, so the finest ripple kept satisfies
$q_ce^{-q_c} = 1/\pi\SNR$. Sharpness grows only with the logarithm of sensitivity, and the blur, $4.43/q_c$, is an
angle.**

::: problems
### Practice

Find the cut-off at $\SNR = 10^9$ by three steps of the iteration $q_{j+1} = L_\pi + \ln q_j$, starting from
$q_0 = L_\pi$, and give the blur of a plane of sensors in degrees.

::: solution
Here $L_\pi = \ln(\pi\times10^9) = 21.868$. The steps give $q_1 = 21.868 + \ln 21.868 = 24.953$,
$q_2 = 21.868 + \ln 24.953 = 25.085$ and $q_3 = 21.868 + \ln 25.085 = 25.090$, against the exact 25.0905. The blur is
$4.43/25.09 = 0.177$ radians, or 10.1°; the exact calculation gives 10.09°.
:::

### Stretch

Chapter 2.7 found that over a sheet, sensors that compare clocks have the kernel $q^{-1}e^{-q}$ and accelerometers
the kernel $e^{-q}$. With the cut-off condition $q^pe^{-q} = 1/\pi\SNR$, find the cut-offs of both at
$\SNR = 10^3$ and at $10^{20}$, and compare them with the tidal camera's.

::: solution
Taking logarithms gives $q - p\ln q = L_\pi$. For accelerometers, $p = 0$, so $q_c = L_\pi$: 8.05 at $10^3$ and
47.20 at $10^{20}$. For clocks, $p = -1$, so $q_c + \ln q_c = L_\pi$, which the iteration $q_{j+1} = L_\pi - \ln
q_j$ solves: 6.22 at $10^3$ and 43.43 at $10^{20}$. The tidal camera, $p = 1$, has 10.39 and 51.13. Each kind of
sensor differs from the next by about $\ln q_c$, which grows only slowly, so all three meet the same logarithmic
law.
:::

### The paper

Derive the paper's equations [](/paper/#eq:cutoff) and [](/paper/#eq:resolution) from
[](/paper/#eq:array-data), check the first row of Table [](/paper/#tab:resolution), and read GOCE's cut-off,
$kz$ between 11 and 12, as a signal-to-noise ratio.

::: solution
The gain of a ripple in [](/paper/#eq:array-data) is $T(\mathbf k) = 2\pi Gk\,e^{-kz}$. With the prior
$S_\sigma = \matter{m}^2/z^2$ and the noise $N_0$, the ratio is $s = |T|\sqrt{S_\sigma/N_0} = \pi\SNR\,q\,e^{-q}$,
and the Wiener weight $s^2/(1+s^2)$ falls through one half where $s = 1$: that is $q_ce^{-q_c} = 1/\pi\SNR$, the
first line of [](/paper/#eq:cutoff). The first guess and one step of the iteration $q = \ln(\pi\SNR) + \ln q$ give
its second line. Replacing $H$ by a step at $q_c$ makes the picture of a point $2J_1(u)/u$ with $u = q_ca/z$,
which is half its peak at $u = 2.2151$, so the full width over the depth is $4.43/q_c$:
[](/paper/#eq:resolution). At $\SNR = 10^3$, $q_c = 10.39$ and $4.43/q_c = 24.4°$ against the exact 24.0°; the
row gives $3.79/10.39 = 20.9°$ against 20.7°, and the first estimate $\pi/\ln 10^3 = 26.1°$. For GOCE, degrees
$\ell = 280$ to 300 give $q_c = 11.2$ to $12.0$, and $\SNR = e^{q_c}/\pi q_c$ is 2000 to 4200, the paper's "two to
four thousand". (Rounding $q_c$ to 11 and 12 would give 1700 and 4300, so the rounding matters.)
:::
:::

::: paper
- Equations [](/paper/#eq:evanescent) and [](/paper/#eq:array-data) are the starting point: the fade
  $e^{-kz}$, ripple by ripple.
- Equations [](/paper/#eq:wiener), [](/paper/#eq:cutoff) and [](/paper/#eq:resolution) are steps 3, 4 and 6 of
  this chapter.
- Table [](/paper/#tab:resolution) and Figure [](/paper/#fig:resolution-law) are what step 7 recomputes.
- Figure [](/paper/#fig:nearfield) shows the blur, and its ringing, for two masses under a row of sensors.
- Section [](/paper/#sec:near-field) reads the law on GOCE ("A flown gradiometer"), on clocks and accelerometers
  ("Other gravitational sensors"), and on a camera smaller than its scene ("A small camera", equation
  [](/paper/#eq:handheld)).
- Equation [](/paper/#eq:capacity-integral) counts the $q_c^2/4\pi$ patterns per area $z^2$ that survive the
  cut-off, and turns them into bits (chapter 3.8).
:::

::: deeper
- Joseph W. Goodman, *Introduction to Fourier Optics*: the chapter on the frequency analysis of imaging systems
  treats the round pupil, and the difference between amplitude (coherent) and intensity (incoherent) imaging.
- R. M. Corless, G. H. Gonnet, D. E. G. Hare, D. J. Jeffrey and D. E. Knuth, "On the Lambert W function",
  *Advances in Computational Mathematics* 5 (1996): the two branches, the series behind the iterated logarithm, and
  how to compute them.
- Robert L. Parker's paper on the rapid calculation of potential anomalies [@Parker1973], and Richard J. Blakely,
  *Potential Theory in Gravity and Magnetic Applications*, on upward and downward continuation: the same fade and
  the same limit, as geophysicists meet them.
:::

[^later]: Chapter 3.9 develops this; nothing in this chapter depends on it.

[^quantum]: The estimate uses the quantum limit on measurement, which chapter 8.6 derives; here it supplies only
    the number $10^{70}$.

[^code]: The paper's reference implementation is `reference/gravcam/resolution.py`. The recomputation for this
    chapter uses standard library Bessel functions and Simpson's rule. The site's interactive figures use
    `app/src/lib/engine/resolution.ts`, which does not repeat the calculation: it reproduces the two width columns
    from a formula fitted to the reference values.

[^yardstick]: Doubling $\SNR$ moves $q_c$ at $\SNR = 10^3$ from 10.39 to 11.16, and the blur from 24.4° to 22.7°.

[^goce-noise]: The two numbers are not of the same kind. GOCE's is the noise of one instrument, averaged over a
    second of time; ours is the noise of a square metre of sensors, averaged over that area.

[^paper-x]: The paper writes $x$ for a direction along the sheet and uses $z$ for the height. This chapter keeps
    $\mathbf a$ for position on the sheet and $h$ for a height that varies, so that $z$ is always the depth of the
    sheet below the sensors.

[^units-s]: Units: $T(\mathbf k)$ is in $\mathrm{m^2\,kg^{-1}\,s^{-2}}$ (that of $G$ times a wavenumber) and
    $S_\sigma$ in $\mathrm{kg^2\,m^{-2}}$, so $|T|^2S_\sigma$ is in $\mathrm{s^{-4}\,m^2}$, the unit of $N_0$, and
    $s$ is a pure number.

[^H-bits]: In Section XII of the paper the letter $H$ stands for a number of bits; it is not this weight.

[^L]: The paper writes $L = \ln\SNR$, without the $\pi$, in its Section XII. The two differ by $\ln\pi = 1.14$,
    so this chapter gives the one with $\pi$ its own name, $L_\pi$.

[^bessel]: Chapter 3.6 defines the Bessel function of order zero by
    $J_0(u) = \frac{1}{2\pi}\int_0^{2\pi}e^{iu\cos\varphi}\,\dd\varphi$, and the function of order one, $J_1$, by
    $\frac{\dd}{\dd u}\big(uJ_1(u)\big) = uJ_0(u)$ with $J_1(0) = 0$. Integrating the second from $0$ to $u$ gives
    the property $\int_0^uJ_0(t)\,t\,\dd t = uJ_1(u)$, and near zero $J_1(u) \approx u/2$.

[^u]: The paper writes this number as $x$.

[^numerics]: The roots quoted in this step, and the inflection point of the next, were found by bisection to
    twelve figures and checked against the paper's reference code.

[^angle]: The exact angle is $2\arctan(w/2z)$. For the 24° blur it is 1.4% smaller than $w/z$; the paper, like
    this chapter, uses $w/z$.

[^theta]: The paper also uses $\Delta\theta$ for the blur of a wave image, $\lambda/D$ in its equation
    [](/paper/#eq:diffraction), which is a different law for a different regime.

[^goce-flat]: The flat-sheet law is a fair estimate here because the height is 4% of the Earth's radius. On the
    sphere the fade is $\bigl(R/(R + z)\bigr)^{\ell+1}$ instead of $e^{-kz}$, which lowers the cut-off to 11.0 to
    11.8 and the ratio to about 1700 to 3500.

[^sparrow]: C. M. Sparrow proposed it for spectral lines in 1916. In the step approximation the picture
    $2J_1(u)/u$ stops curving downward at $u = 2.30$, so two points show a dip once they are $4.60\,z/q_c$ apart,
    4% more than the full width.
