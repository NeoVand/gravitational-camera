---
id: '3.7'
title: 'The blur law: the cut-off, the logarithm, the Lambert W function, the width of a blur'
question: 'Why does making the camera $10^{27}$ times more sensitive sharpen its picture only from 24 degrees to 3.4?'
part: '3'
requires: ['1.4', '2.1', '2.6', '2.7', '3.1', '3.2', '3.5', '3.6']
paper: [sec:near-field, eq:evanescent, eq:array-data, eq:wiener, eq:cutoff, eq:resolution, tab:resolution, fig:resolution-law, fig:nearfield, eq:handheld, fig:near-field-geometry, fig:blur]
figures: [fig:resolution-law, fig:blur]
live: [blur-law, near-field-blur]
depth: A
---


A camera with a signal-to-noise ratio of a thousand sees every point of the scene as a blur 24° wide. The blur is an
angle seen from the camera, so for a scene one metre away it is a smudge 42 cm across, about the width of a person's
shoulders. A ratio of a million gives 14°. A ratio of $10^{30}$, which is $10^{27}$ times the first, still gives a blur
3.4° wide, and to be as sharp as the human eye the camera would need a ratio of about $10^{6600}$. This section derives
that law from Laplace's equation and from the noise, one step at a time.[^law]

The answer to the guiding question is short. Fine detail fades with distance exponentially, while the noise does not
fade at all. So each factor of ten in sensitivity buys only a fixed small step in the finest detail that survives, and
the sharpness grows with the logarithm of the sensitivity rather than with the sensitivity itself.

![Two iron balls buried side by side, and what a flat sheet of sensors would record of them at four heights:
orange where the tide stretches, blue where it squeezes. A quarter of the balls' separation above them, the two
peaks stand apart; higher up they spread and close in, and above 1.28 separations they merge, so the pixels at two
separations see one broad bump. Each tile of the pixels is coloured by its own reading, and the noise added to each
tile is a tenth of the bump's height, larger than anything that would tell two balls from one. Each sheet is drawn
to its own scale, since the signal weakens eightfold each time the height doubles; the sheets' spacing, the balls'
depth and size and the height of the relief are not to scale.](tut-blur){#fig:sheets}

::: plain
The camera records the tide of every mass below it: how the pull of the mass changes from place to place. Its
sensitivity is its signal-to-noise ratio: how many times the strongest signal of one mass exceeds the noise. Fine
detail in the scene, such as two masses close together, makes a pattern that fades quickly with distance. Over the same
distance, a pattern twice as fine keeps only the square of the fraction that a coarser pattern keeps: if the coarser one
keeps a tenth, the finer one keeps a hundredth. At the camera, the finest detail is weaker than the noise, and nothing
can recover it.

The best picture keeps every pattern that stands above its noise, and the finest pattern kept sets the blur. Because
the fading is exponential, each factor of ten in sensitivity adds only a fixed small amount of detail. A ratio of a
thousand gives a blur 24° wide, a million gives 14°, and $10^{30}$ gives 3.4°. The blur is an angle: at the same
signal-to-noise ratio, it is the same fraction of the distance for a scene a metre away and for one a hundred
kilometres away.
:::

## The road from Laplace's equation to the blur

We want one formula: the width of the picture of a single point mass, as the camera's best reconstruction draws it.
Each step ends in one boxed result, and the next step uses it.

1. One number, the signal-to-noise ratio of the array, measures how sensitive the camera is.
2. Each ripple of the scene stands above its own noise by a factor that depends only on that number and on how fine the
   ripple is compared with its depth.
3. The best reconstruction keeps a ripple while that factor is larger than one, which defines a cut-off.
4. Solving the equation for the cut-off needs the logarithm of a logarithm.
5. With the soft edge of the filter made sharp, the picture of a point is the pattern of a round opening.
6. The full width of that pattern at half its height is the blur: 4.43 divided by the cut-off, in radians.
7. An exact calculation, with no approximation, gives a table of blurs.

A last section reads the law on a satellite, on the eye, and on other kinds of sensor.

The derivation rests on five assumptions. **The sources lie on one thin sheet** at a depth $z$ below the sensors. **The sensors fill a whole plane**, so that the array is at least as wide as the scene is deep.
**The noise is white**: it is independent from place to place and has the same strength in every ripple. **The prior is
a sheet of independent point masses**, one in each patch of area $z^2$, which is our guess at the statistics of the
scene before any data arrive. **The reconstruction is the best linear one**, the Wiener filter of section 3.5. The
patch of area $z^2$ in the prior is the same patch that step 1 uses to measure the noise; step 4 shows that another
choice would move the answer only by a logarithm.

Here $z$ is the depth of the sheet below the plane of the sensors, in metres. The sheet has a **surface density**
$\sym{surface-density}{\matter{\sigma}}$, its mass per unit area, in kilograms per square metre; a standard deviation
is written $\sigma$ with a subscript naming its quantity, as $\sigma_n$ for the noise.

## Step 1: one number measures the camera

We want a single number that says how sensitive an array is, so that every later formula can depend on it alone.

Each sensor records the vertical tide. Section 1.4 describes the tide by the tidal tensor $\curv{\tE}_{ij} =
\partial_i\partial_j\sym{potential}{\field{\Phi}}$, the table of the second derivatives of the gravitational potential
$\field{\Phi}$, in joules per kilogram; it is in $\mathrm{s^{-2}}$. Each sensor records $\curv{d} =
-\curv{\tE}_{zz}$, the entry for the vertical direction, with its sign chosen so that a mass below gives a positive
reading.

A point mass $\matter{m}$, in kilograms, has the potential $\field{\Phi} = -G\matter{m}/h$ on the vertical line through
it, where $h$ is the height above the mass. We differentiate twice with respect to $h$:

$$\frac{\partial\field{\Phi}}{\partial h} = \frac{G\matter{m}}{h^2}, \qquad \frac{\partial^2\field{\Phi}}{\partial h^2} = -\frac{2G\matter{m}}{h^3}.$$

The sensors sit at $h = z$, so directly above the mass the reading is $\curv{d} = 2G\matter{m}/z^3$. Away from that
point the reading is smaller.

The noise is described by its **spatial noise density** $\sym{noise-density}{N_0}$, in $\mathrm{s^{-4}\,m^2}$.
Averaging independent readings divides their variance by their number, so averaging white noise of density $N_0$ over a
patch of area $A$ gives the variance $N_0/A$, in $\mathrm{s^{-4}}$ (section 3.2). Over a square patch of side $z$ the
standard deviation is therefore $\sqrt{N_0}/z$. We compare the peak signal with this noise:

$$\boxed{\sym{snr}{\SNR} = \frac{2G\matter{m}/z^3}{\sqrt{N_0}/z} = \frac{2G\matter{m}}{z^2\sqrt{N_0}}}. \label{eq:snr}$$

The units cancel: $\sqrt{N_0}$ is in $\mathrm{s^{-2}\,m}$, so $\sqrt{N_0}/z$ is in $\mathrm{s^{-2}}$, like the peak
signal, and $\SNR$ is a pure number.

The patch of side $z$ is chosen because the bump that a point mass at depth $z$ makes in the readings is about $z$ wide,
so the patch averages the noise over the area that the signal itself covers. A non-example is the peak over the noise of one sensor, which changes if the same array is built from more, smaller,
noisier sensors: it describes the wiring and not the power to see. Another yardstick, such as a patch of side $2z$,
would multiply $\SNR$ by a constant, which step 4 shows moves the cut-off only by its logarithm.[^yardstick]

**The width of the bump.** At a horizontal distance $a$ from the point above the mass, a point at the height $h$ is a
distance $\varrho = \sqrt{a^2 + h^2}$ from the mass, and the potential there is $\field{\Phi} = -G\matter{m}/\varrho$.
Since $\partial\varrho/\partial h = h/\varrho$, two derivatives with respect to $h$ give

$$\frac{\partial\field{\Phi}}{\partial h} = \frac{G\matter{m}\,h}{\varrho^3}, \qquad
\frac{\partial^2\field{\Phi}}{\partial h^2} = G\matter{m}\Bigl(\frac{1}{\varrho^3} - \frac{3h^2}{\varrho^5}\Bigr).$$

At the sensors, $h = z$, the reading $\curv{d} = -\partial^2\field{\Phi}/\partial h^2$ is $G\matter{m}(3z^2 -
\varrho^2)/\varrho^5$. With $\varrho^2 = z^2 + a^2$ and the pure number $u = a/z$,

$$\curv{d}(a) = \frac{G\matter{m}}{z^3}\,\frac{2 - u^2}{(1 + u^2)^{5/2}} ,$$

in $\mathrm{s^{-2}}$, which is the peak $2G\matter{m}/z^3$ at $u = 0$. The reading falls to half its peak where $(2 -
u^2)/(1 + u^2)^{5/2} = 1$. We square both sides and write $x = u^2$:

$$(1 + x)^5 = (2 - x)^2 .$$

At $x = \tfrac14$ the left side is $(5/4)^5 = 3.052$ and the right side $(7/4)^2 = 3.063$, so the root lies a little
above. The difference of the two sides grows with $x$ at the rate $5(1 + x)^4 + 2(2 - x) = 15.7$, so one step of
Newton's method moves the root up by $0.011/15.7$, to $x = 0.2507$ and $u = 0.5007$. The full width at half the peak
is $2uz$:

$$\boxed{\;\text{the bump of a point mass at depth } z \text{ is } 1.001\,z \text{ wide at half its height.}\;}$$

A point mass is as wide in the data, at half height, as it is deep, to a seventh of a per cent, so the patch of side
$z$ is the bump's own width.[^bump] The reading changes sign at $u = \sqrt2$, and far out, for $u \gg 1$, it tends to
$-G\matter{m}/a^3$, the squeeze across the line to a distant mass (section 1.4).

**A number.** The person one metre away, of mass 70 kg, makes a peak tide of $2G\matter{m}/z^3 = 9.3\times10^{-9}
\unit{s^{-2}}$ (section 1.4). For $\SNR = 10^3$ the noise averaged over a square metre must be a thousand times smaller,
$9.3\times10^{-12}\unit{s^{-2}}$, or 0.009 eötvös, where one eötvös (E) is $10^{-9}\unit{s^{-2}}$. The gravity
satellite GOCE read the tide with a noise of between 0.01 and 0.02 E per root hertz [@RummelYiStummer2011], roughly its
noise after one second (section 3.2), which is of the same size.[^goce-noise]

**The result.** The sensitivity of the camera is one pure number, $\SNR = 2G\matter{m}/(z^2\sqrt{N_0})$.

## Step 2: each ripple stands above its noise by a factor that depends on two numbers

We want to know how far the signal of each ripple stands above its noise, because that decides which ripples the camera
can recover.

A **ripple** here is a pattern across the sheet that varies as $\cos(\vect k\cdot\vect a)$, where $\vect a$ is position
on the sheet, in metres, and $\vect k$ is the ripple's **wavevector**, which points across the crests. Its length $k =
|\vect k|$ is the **wavenumber**, $2\pi$ divided by the distance between crests, in $\mathrm{m^{-1}}$.

**The fade.** Above the sheet the space is empty, so the potential obeys Laplace's equation, $\nabla^2\field{\Phi} =
0$ (section 2.1). We look for the potential of one ripple in the form $\field{\Phi} = \cos(\vect k\cdot\vect a)\,f(h)$,
where $h$ is the height above the sheet. The two second derivatives along the sheet bring down the factor $-k_1^2 -
k_2^2 = -k^2$, and Laplace's equation becomes

$$-k^2\cos(\vect k\cdot\vect a)\,f(h) + \cos(\vect k\cdot\vect a)\,f''(h) = 0.$$

We divide by $\cos(\vect k\cdot\vect a)$, which leaves an equation for $f$ alone:

$$f''(h) = k^2 f(h).$$

Its solutions are $e^{kh}$ and $e^{-kh}$. The first grows without limit far above the sheet, which the field of the sheet
cannot do because all its sources lie below, so $f = e^{-kh}$ up to a constant. At the sensors, $h = z$, the ripple has
faded by $e^{-kz}$:[^evanescent]

$$\field{\Phi} \propto \cos(\vect k\cdot\vect a)\,e^{-kz} .$$

![A picture of buried masses is a sum of ripples, and each ripple fades as it rises toward the camera, the finer one
faster. A coarse ripple and one three times finer start equal at the lowest line; by the pixels the coarse one keeps
half its size and the fine one an eighth, the cube of a half. The noise, which does not fade, is a quarter of the
starting size: the coarse ripple stands twice above it, while the fine one is lost in it. The heights are stretched
about ten times so that the lines can be told apart; the sizes of the ripples and of the noise are
exact.](tut-ripples){#fig:ripples}

**What the array records.** The constant in front of the fade comes from Gauss's law at the sheet. Section 2.7 gives the
potential of a ripple of surface density $\tilde{\matter{\sigma}}$ as $\tilde{\field{\Phi}} = -2\pi
G\,\tilde{\matter{\sigma}}\,e^{-kh}/k$. The reading $\curv{d} = -\partial^2\field{\Phi}/\partial h^2$ brings down a
factor $k^2$ from the exponential, so the ripple of the data is $2\pi G\,k\,e^{-kz}\,\tilde{\matter{\sigma}}$. With the
noise added, the array records

$$\tilde{\curv{d}}(\vect k) = 2\pi G\,k\,e^{-kz}\,\tilde{\matter{\sigma}}(\vect k) + \tilde n(\vect k),$$

where $\tilde{\curv{d}}$, $\tilde{\matter{\sigma}}$ and $\tilde n$ are the Fourier transforms of the data, the surface
density and the noise across the plane, which give the amount of each ripple $\vect k$ (section 2.6).

**The ratio of signal to noise in one ripple.** White noise gives every ripple the same noise strength, $N_0$ (section
3.2). Section 3.5 shows that a ripple recorded as $\tilde d = T\tilde\sigma + \tilde n$ stands above its noise by a
factor $s$, whose square is the expected squared size of the signal in that ripple over that of the noise:

$$s^2 = \frac{|T(\vect k)|^2\,S_\sigma}{N_0}. \label{eq:s-squared}$$

Here $T(\vect k) = 2\pi G\,k\,e^{-kz}$ is the **gain** of the ripple, the factor that multiplies $\tilde{\matter{\sigma}}$,
and $S_\sigma$ is the **spectrum** of the prior: the expected value of $|\tilde{\matter{\sigma}}|^2$ per unit area of the
sheet, in $\mathrm{kg^2\,m^{-2}}$. For independent point masses $\matter{m}$, one per area $z^2$, the masses add their
squared sizes, so $S_\sigma = \matter{m}^2/z^2$, the same for every ripple (section 3.2).[^units-s]

We put the gain and the spectrum into \eqref{eq:s-squared} and take the square root:

$$s = \frac{2\pi G\,k\,e^{-kz}\,\matter{m}}{z\sqrt{N_0}}.$$

We multiply and divide by $z$, so that the combination $2G\matter{m}/(z^2\sqrt{N_0})$ of \eqref{eq:snr} appears:

$$s = \pi\,\frac{2G\matter{m}}{z^2\sqrt{N_0}}\;kz\;e^{-kz}.$$

We write $\sym{kz}{q} = kz$, a pure number that measures the fineness of a ripple against the depth (a ripple with $q =
1$ has crests $2\pi z$ apart, one with $q = 10$ has crests $0.63\,z$ apart). Then

$$\boxed{\sym{ripple-ratio}{s} = \pi\,\SNR\;q\,e^{-q}, \qquad q = kz}. \label{eq:s}$$

Every other quantity has disappeared: the mass, the noise density and $G$ enter only through $\SNR$, and the wavenumber
and the depth only through $q$. This is why the blur will come out as an angle: a ripple whose crests are a metre apart,
seen from a metre, behaves exactly as one whose crests are a kilometre apart, seen from a kilometre.

**Numbers, at $\SNR = 10^3$.** A coarse ripple with $q = 1$ stands $s = 1160$ times above its noise, and one with $q =
5$ stands 106 times above it. A ripple with $q = 10.4$ has $s = 0.99$, about as strong as its noise, and one with $q =
12$ has $s = 0.23$, four times weaker. The factor $q\,e^{-q}$ is largest at $q = 1$, where $s = \pi\SNR/e$, so ripples
about $2\pi z$ apart are the ones the camera sees best.

**A limit.** As $q \to 0$, $s \to 0$ as well, because of the factor $q$: a perfectly uniform sheet makes no tide at all
(section 2.7), so the camera cannot see it at any sensitivity.

**The result.** Each ripple stands above its noise by $s = \pi\SNR\,q\,e^{-q}$, which depends only on the sensitivity
$\SNR$ and the fineness $q = kz$.

## Step 3: the filter keeps a ripple while it stands above its noise

We want the weight that the best reconstruction gives each ripple, and from it the finest ripple that it keeps.

The reconstruction treats each ripple on its own. It divides the data by the gain $T$, to undo the fade, and multiplies
the result by a weight $\sym{wiener-filter}{H}$ between zero and one. The reconstruction of the ripple $\vect k$ is

$$\frac{H}{T}\,\tilde{\curv{d}} = H\,\tilde{\matter{\sigma}} + \frac{H}{T}\,\tilde n. \label{eq:estimate}$$

The first term is the true ripple, weighted by $H$. The second is the noise, enlarged by $1/T$ along with the signal.
Among all reconstructions that are linear in the data, the **Wiener filter** of section 3.5 makes the mean squared error
as small as possible. Its weight is

$$H = \frac{s^2}{1 + s^2}.$$

Here $H$ is a weight per ripple and not the image itself. A ripple with $s = 3$ is kept with weight 0.9, one with $s =
1$ with weight one half, and one with $s = 1/3$ with weight 0.1.

We follow $H$ as $q$ grows, using \eqref{eq:s}. At $q = 0$, $s = 0$ and $H = 0$. The ratio $s$ rises as $\pi\SNR\,q$, so
it passes one near $q \approx 1/\pi\SNR$, which is $3.2\times10^{-4}$ at $\SNR = 10^3$. It peaks at $q = 1$ and then
falls, because the exponential wins over the factor $q$. It passes one again at a larger value $q_c$, and beyond that
$H$ falls to zero. So $H$ is close to one from a few times $1/\pi\SNR$ to a little below $q_c$, and falls through one
half at $q_c$. The **cut-off** $\sym{cutoff}{q_c}$ is the larger root of $s = 1$:

$$\boxed{q_c\,e^{-q_c} = \frac{1}{\pi\,\SNR}}. \label{eq:cutoff-here}$$

Figure [](/paper/#fig:resolution-law) draws $H$ in its panel (a) for four sensitivities, with a dot at each cut-off; panel (b) is the blur that
steps 5 to 7 derive from it.[^cutoff]

{{paper fig:resolution-law}}

**The edge of the filter.** Step 5 will replace the soft edge of $H$ by a sharp one, so we need to know how wide the
edge is. The weight $H$ falls from 0.9 to 0.1 while $s$ falls from 3 to $1/3$, so while $\ln s$ falls by $\ln 9 =
2.20$. From \eqref{eq:s}, $\ln s = \ln(\pi\SNR) + \ln q - q$, and its slope is $1/q - 1$. Near the cut-off the slope is
about $-(1 - 1/q_c)$, so the edge has a width

$$\Delta q \approx \frac{\ln 9}{1 - 1/q_c}$$

in $q$. At $\SNR = 10^3$ this is 2.43, and at $10^{30}$ it is 2.23, while $q_c$ itself grows from 10.4 to 74.5. Measured
against the cut-off, the edge becomes sharper and sharper: 23% of $q_c$ at $10^3$ and 3% at $10^{30}$.

**The result.** The best reconstruction keeps the ripples up to the cut-off $q_c$, the larger root of $q_c e^{-q_c} =
1/\pi\SNR$, and its edge there is about 2.4 wide in $q$ at every sensitivity.

## Step 4: solving the cut-off needs a logarithm of a logarithm

We want $q_c$ as a number, and we want to see how it grows with $\SNR$. The equation \eqref{eq:cutoff-here} cannot be
solved with the functions of school algebra, so we solve it by repeated substitution and name the answer afterwards.

We take the natural logarithm of both sides of \eqref{eq:cutoff-here}:

$$\ln q_c - q_c = -\ln(\pi\SNR).$$

We move $q_c$ to the left alone and write $L_\pi = \ln(\pi\SNR)$ for short:

$$q_c = L_\pi + \ln q_c. \label{eq:fixed-point}$$

The unknown appears on both sides, but on the right it sits inside a logarithm, where a change in it matters little.
That suggests a **fixed-point iteration**: we guess $q_c$, put the guess into the right-hand side, and take the result
as a better guess. Since $\ln q_c$ is much smaller than $q_c$, the first guess is $q_0 = L_\pi$, and each new guess is
$q_{j+1} = L_\pi + \ln q_j$, with $j = 0, 1, 2, \ldots$. The iteration settles down because the logarithm is flat: if a
guess is wrong by a small amount $\epsilon$, the next is wrong by about $\epsilon/q$, so near $q = 10$ every step cuts the
error by a factor of ten.

**Numbers, at $\SNR = 10^3$.** Here $L_\pi = \ln(3142) = 8.05$. The guesses are

$$\begin{gathered}
q_1 = 10.138,\qquad q_2 = 10.369,\\
q_3 = 10.391,\qquad q_4 = 10.3935,
\end{gathered}$$

and the exact root is $10.3937$. The errors are 0.26, 0.025, 0.0024 and 0.0002: each a tenth of the one before.

The first guess and one step of the iteration, $q_1 = L_\pi + \ln L_\pi$, give the approximation

$$\boxed{q_c \approx \ln(\pi\SNR) + \ln\ln(\pi\SNR)},$$

which is 10.1 against the exact 10.4 at $\SNR = 10^3$. One more step gives $q_2 = L_\pi + \ln(L_\pi + \ln L_\pi)$. We
write the logarithm as $\ln L_\pi + \ln(1 + \ln L_\pi/L_\pi)$ and use $\ln(1 + \epsilon) \approx \epsilon$ for small
$\epsilon$, so the next term of the series is $\ln L_\pi/L_\pi$:

$$q_c \approx L_\pi + \ln L_\pi + \frac{\ln L_\pi}{L_\pi},$$

which gives 10.40 at $\SNR = 10^3$. The term $\ln\ln(\pi\SNR)$ is an **iterated logarithm**. It grows so slowly that it
is 2.1 at $\SNR = 10^3$ and only 4.3 at $10^{30}$.

**The name of the answer.** The **Lambert W function** is the inverse of the function $v\,e^v$: $\mathrm{W}(y)$ is the
number $v$ with $v\,e^v = y$. If we put $v = -q_c$, then \eqref{eq:cutoff-here} reads $v\,e^v = -1/\pi\SNR$. For $y$
between $-1/e$ and $0$ this equation has two real solutions, the two **branches**: the upper branch $\mathrm{W}_0$, with
$v$ between $-1$ and $0$, and the lower branch $\mathrm{W}_{-1}$, with $v$ below $-1$. Our cut-off is the larger root in
$q$, so it comes from the lower branch:

$$q_c = -\sym{lambert-w}{\mathrm{W}_{-1}}\Bigl(-\frac{1}{\pi\SNR}\Bigr).$$

The upper branch gives the small root, $q = 3.2\times10^{-4}$ at $\SNR = 10^3$, the low edge of $H$ found in step 3.
Both roots exist only when $1/\pi\SNR < 1/e$, that is when $\SNR > e/\pi = 0.87$; a weaker camera sees no ripple above
its noise.

**A limit.** For very large $\SNR$ the terms after $L_\pi$ become small, so $q_c/\ln\SNR \to 1$, and the cut-off
wavenumber is $k_c = q_c/z \approx \ln\SNR/z$, the first estimate of section 2.7, which asked for the
ripple whose fade $e^{kz}$ equals $\SNR$. The approach is slow: the ratio $q_c/\ln\SNR$ is 1.50 at $10^3$, 1.08 at
$10^{30}$, and 1.004 at $10^{1000}$.

**What it means.** Multiplying $\SNR$ by ten adds $\ln 10 = 2.3$ to $L_\pi$. Differentiating \eqref{eq:fixed-point}
gives $\dd q_c = \dd L_\pi/(1 - 1/q_c)$, so $q_c$ grows by a little more than 2.3. Sensitivity buys sharpness only
through its logarithm.

**The result.** The exact cut-offs are 10.4, 17.8, 27.5, 51.1, 74.5 and 144.3 at $\SNR = 10^3$, $10^6$, $10^{10}$,
$10^{20}$, $10^{30}$ and $10^{60}$, and each factor of ten in $\SNR$ adds a little more than 2.3.

## Step 5: the picture of a point is the pattern of a round opening

We want the picture that the reconstruction draws of a single point mass, because its width is the blur. This step is a
sketch: it makes one approximation, and the box at its end names what that leaves out.

**The picture of a point.** By \eqref{eq:estimate}, the reconstruction of each ripple is $H\tilde{\matter{\sigma}}$ plus
filtered noise. The noise has zero mean, so the average over many repetitions keeps only $H\tilde{\matter{\sigma}}$. A
point mass $\matter{m}$ at the origin of the sheet is the surface density $\matter{\sigma} = \matter{m}\,\delta^2(\vect
a)$, where the delta function is zero except at the origin and has integral one over the plane (section 1.3). Its
transform is $\tilde{\matter{\sigma}} = \matter{m}$ for every $\vect k$ (section 2.6). We put the ripples back together
with the inverse transform, which carries the factor $1/(2\pi)^2$:

$$\hat{\matter{\sigma}}(\vect a) = \matter{m}\int H(k)\,e^{i\vect k\cdot\vect a}\,\frac{\dd^2k}{(2\pi)^2}.$$

This average is the **point-spread function** of the reconstruction: the picture it draws of one point.

**The approximation: the edge of $H$ is a sharp step.** We replace $H$ by one for $k < k_c$ and zero beyond, where $k_c =
q_c/z$. By step 3 the edge of $H$ is about 2.4 wide in $q$, so the small parameter is the edge width over the cut-off,
0.23 at $\SNR = 10^3$, and the approximation improves as $q_c$ grows. A filter that keeps every wavevector inside a
circle acts like the round opening of a lens, a **pupil**, so the picture we find is the pattern of a round pupil.

**The integral.** With the step, the integral runs over a disc of radius $k_c$. We use polar coordinates in the plane of
$\vect k$, with $\varphi$ the angle between $\vect k$ and $\vect a$, and $a = |\vect a|$ the distance from the point
mass in metres, so that $\vect k\cdot\vect a = ka\cos\varphi$ and $\dd^2k = k\,\dd k\,\dd\varphi$:

$$\hat{\matter{\sigma}} = \frac{\matter{m}}{(2\pi)^2}\int_0^{k_c}\!k\,\dd k\int_0^{2\pi}\!e^{ika\cos\varphi}\,\dd\varphi.$$

The angular integral is $2\pi$ times the Bessel function $J_0(ka)$, by its definition:[^bessel]

$$\hat{\matter{\sigma}} = \frac{\matter{m}}{2\pi}\int_0^{k_c}J_0(ka)\,k\,\dd k.$$

We substitute $t = ka$, so that $k\,\dd k = t\,\dd t/a^2$, and use $\int_0^u J_0(t)\,t\,\dd t = u\,J_1(u)$ with $u =
k_ca$:

$$\hat{\matter{\sigma}} = \frac{\matter{m}}{2\pi a^2}\,k_ca\,J_1(k_ca) = \frac{\matter{m}\,k_c^2}{2\pi}\,\frac{J_1(k_ca)}{k_ca}.$$

For small $u$, $J_1(u) \approx u/2$, so the peak at $a = 0$ is $\matter{m}k_c^2/4\pi$: $\matter{m}$ times the area $\pi
k_c^2$ of the disc, divided by $(2\pi)^2$, as the first integral says it must be. Dividing by the peak gives the
normalized picture of a point,

$$\boxed{\frac{\hat{\matter{\sigma}}(a)}{\hat{\matter{\sigma}}(0)} = \frac{2J_1(u)}{u}, \qquad u = k_ca = \frac{q_c\,a}{z}}. \label{eq:jinc}$$

Here $u$ is a pure number, the distance from the point in units of $z/q_c$.

**The row.** Suppose instead that a single row of sensors lies above long, straight line masses laid at right angles to
the row, so that the scene changes only along the row. The integral then runs over $-k_c < k < k_c$ and needs no Bessel
functions:

$$\int_{-k_c}^{k_c}e^{ika}\,\dd k = \frac{2\sin(k_ca)}{a}.$$

Divided by its value $2k_c$ at $a = 0$, this is $\sin u/u$, with the same $u = q_ca/z$ and $a$ now the distance along
the row.

**The result.** With a sharp edge, the reconstruction draws a point as $2J_1(u)/u$ under a plane of sensors and as $\sin
u/u$ under a row, with $u = q_ca/z$.

::: gap
This sketch skips three things.

- **The soft edge of $H$.** The real filter falls over a width of about 2.4 in $q$. Rounding the edge makes the picture
  slightly narrower: the exact width of step 7 is smaller than $4.43/q_c$ by close to $2/q_c^2$ of itself, 1.8% at
  $\SNR = 10^3$ and 3.3% at $\SNR = 100$.
- **The low edge of $H$.** The filter also drops the coarsest ripples, below $q \approx 1/\pi\SNR$, which takes a very
  broad and shallow sheet out of the picture, about $2\times10^{-8}$ of the peak at $\SNR = 10^3$. It does not change
  the width.
- **The Bessel functions themselves.** Section 3.6 derives their definitions and the two properties used here.
:::

## Step 6: the blur is the width of the picture at half its height

We want one number for the width of \eqref{eq:jinc}: the **full width at half maximum**, the distance between the two
points, one on each side of the peak, where the picture has fallen to half its peak value.

The width must be measured on the picture itself and not on its square. The reconstruction $\hat{\matter{\sigma}}$ is a
surface density, in kilograms per square metre, and it is linear in the data: the picture of two masses is the sum of
their two pictures. Such a picture is an **amplitude image**. A telescope's photograph of a star records the square of the light's amplitude, an **intensity image**. The Airy pattern of
section 3.6 is $(2J_1(u)/u)^2$, the intensity image of a round pupil; our picture is its amplitude, $2J_1(u)/u$.

**The half maximum.** The equation $2J_1(u)/u = \tfrac12$ has no closed-form solution. Numerically its root is $u =
2.2151$, so the picture falls to half its peak at a distance $a = 2.2151\,z/q_c$ on each side, and its full width is
$2\times2.2151\,z/q_c = 4.4302\,z/q_c$.

**As an angle.** A width $w$ at depth $z$ directly below the array spans an angle of $w/z$ radians as seen from the
array.[^angle] Dividing the full width by $z$ gives the blur:

$$\boxed{\sym{angular-blur}{\Delta\theta} = \frac{4.43}{q_c}} \quad\text{(radians)}.$$

**A number.** At $\SNR = 10^3$, $q_c = 10.39$, so $\Delta\theta = 4.43/10.39 = 0.426$ radians, or 24.4°. The exact
calculation of step 7 gives 24.0°. At one metre the exact blur is 42 cm wide, about the width of a person's shoulders.

**The row.** The equation $\sin u/u = \tfrac12$ has its root at $u = 1.8955$, so a row of sensors has the blur
$3.79/q_c$, which is 20.9° at $\SNR = 10^3$ (exact: 20.7°).

**A contrast.** Measured on the intensity $(2J_1(u)/u)^2$, the half maximum would fall at $u = 1.6163$ and the width
would be $3.23/q_c$, understating the blur by 27%, because the square of a curve that is smaller than one falls faster
than the curve.

**A check, the limit of high sensitivity.** As $\SNR$ grows, $q_c$ grows and $\Delta\theta$ shrinks to zero, but only as
$1/\ln\SNR$. The picture also rings: $2J_1(u)/u$ dips below zero beyond its first zero at $u = 3.83$ and reaches $-0.13$
of the peak at $u = 5.14$. A reconstructed mass is surrounded by faint rings of negative density, the price of cutting
off the fine ripples (in a row, $\sin u/u$ dips to $-0.22$, as in section 3.5).

**The result.** Laplace's equation fades a ripple of fineness $q$ by $e^{-q}$. Against white noise and a prior of point
masses, the ripple stands above its noise by $s = \pi\SNR\,q\,e^{-q}$. The best reconstruction keeps the ripples with $s
> 1$, up to the cut-off $q_ce^{-q_c} = 1/\pi\SNR$, a little above $\ln(\pi\SNR) + \ln\ln(\pi\SNR)$. A filter that keeps
every ripple inside a circle draws a point as $2J_1(u)/u$, whose full width at half maximum is $4.43\,z/q_c$, an angle
of $4.43/q_c$.

## Step 7: an exact calculation of the blur table {#step-7-an-exact-calculation-reproduces-the-papers-table}

We want to know how good the sharp edge of step 5 is, so we compute without it. We take the exact filter $H(q)$, with
$s$ from \eqref{eq:s}, at each $\SNR$; integrate the picture of a point numerically, $\int_0^\infty H(q)\,J_0(qa/z)\,q\,\dd q$ on the plane and
$\int_0^\infty H(q)\cos(qa/z)\,\dd q$ on a row; and find its half maximum by root-finding, to the 0.05° that the table
prints.[^table]

The table also asks when two equal point masses show a dip between them. Let $P(u)$ be the picture of one point, and let
the two masses sit at $u = -b$ and $u = +b$, in units of $z/q_c$, so that $2b$ is their separation. The picture of the
pair is $P(u - b) + P(u + b)$. Its slope at the midpoint is zero by symmetry, and its second derivative there is
$P''(-b) + P''(b) = 2P''(b)$. The midpoint therefore becomes a dip as soon as $P''(b) > 0$. An **inflection point** of a
curve is where it stops curving downward and starts curving upward, so the dip appears once the midpoint lies beyond the
inflection point of each mass's picture. That separation is **Sparrow's criterion** for telling two points
apart.[^sparrow]

| $\SNR$ | $q_c$ | Plane | Row | Two points | $4.43/q_c$ | $\pi/\ln\SNR$ |
|---:|---:|---:|---:|---:|---:|---:|
| $10^{3}$ | 10.4 | 24.0° | 20.7° | 24.5° | 24.4° | 26.1° |
| $10^{6}$ | 17.8 | 14.1° | 12.1° | 14.6° | 14.2° | 13.0° |
| $10^{10}$ | 27.5 | 9.2° | 7.9° | 9.5° | 9.2° | 7.8° |
| $10^{20}$ | 51.1 | 5.0° | 4.2° | 5.1° | 5.0° | 3.9° |
| $10^{30}$ | 74.5 | 3.4° | 2.9° | 3.5° | 3.4° | 2.6° |
| $10^{60}$ | 144.3 | 1.8° | 1.5° | 1.8° | 1.8° | 1.3° |

: The blur of the near-field picture. "Plane" and "Row" are the exact full widths at half maximum for a plane of sensors
and for a single row; "Two points" is the smallest separation at which two equal masses show a dip in the plane's
picture; $4.43/q_c$ is the law of step 6; the last column is the first estimate of section 2.7.

The ratio of the exact width to $4.43/q_c$ is 0.967 at $\SNR = 100$, 0.982 at $10^3$ and 1.000 at $10^{30}$, so the law
holds within four per cent for every $\SNR \ge 100$.

The two-point separation is a few per cent larger than the full width: 2% at $10^3$ and 4% at $10^{60}$. This is a
property of the amplitude picture of a round pupil; for the intensity the order is reversed (2.98 against 3.23 in $u$).

The last column is only a first estimate: too wide at low sensitivity, because it uses $\ln\SNR$ for a cut-off that is
1.5 times larger at $10^3$, and too sharp at high sensitivity, because the picture of a point is $4.43/q_c$ wide, wider
than the $\pi/q_c$ that it assumes.

**The result.** The exact blur agrees with $4.43/q_c$ to within four per cent for every $\SNR \ge 100$.

## What the law means

The law has two plain consequences. **The blur depends on the sensitivity only through its logarithm**: from $10^3$ to
$10^{30}$, a factor of $10^{27}$, the cut-off grows from 10.4 to 74.5, seven times, and the blur shrinks seven times,
from 24.0° to 3.4°. That answers the guiding question. **The blur is an angle**: only $kz$ enters, so at the same
signal-to-noise ratio the blur is 42 cm for a scene one metre away and 42 m for a scene a hundred metres away. A real
camera would not keep the same ratio: by \eqref{eq:snr} it falls as $1/z^2$, so a camera that has $\SNR = 10^3$ for a person one metre away has $\SNR = 0.1$ a hundred metres away, below
the 0.87 of step 4, and sees nothing at all.

A precise measurement is still possible through a wide blur. The law limits the picture of an unknown scene, not the
precision with which a scene known to be simple can be measured. A single mass at one metre is placed to within about a
millimetre at $\SNR = 10^3$ (section 3.3), although its picture is 42 cm wide: the centre of a bump of known shape can
be found to about its width divided by the signal-to-noise ratio, and the bump in the data is about $z$ wide (step 1),
so $1\unit{m}/1000 = 1\unit{mm}$. The fact that mass is never negative also separates a few compact masses far more
finely than the blur (section 3.9).

The rest of this section is a set of estimates, each with its inputs, its arithmetic and a comparison.

**A satellite that flew.** GOCE carried a gradiometer, an instrument that measures the tide, around the Earth for four
years, three of them at a height $z = 254\unit{km}$ [@RummelYiStummer2011]. On a sphere the field is sorted into
patterns labelled by a whole number $\ell$, the **spherical-harmonic degree** (section 2.2). A pattern of degree $\ell$
has crests about $2\pi R/\ell$ apart on a sphere of radius $R$, so on the ground its wavenumber is $k = \ell/R$. GOCE's
final map runs out of signal between degrees $\ell = 280$ and $300$ [@BrockmannSchubertSchuh2021; @Kvas2021]. With the
Earth's radius $R = 6371\unit{km}$, the cut-off is $q_c = \ell z/R = 11.2$ to $12.0$. Reading \eqref{eq:cutoff-here}
backwards, $\SNR = e^{q_c}/\pi q_c$, which is 2000 to 4200. The blur $4.43/q_c$ is 21° to 23°, and on the ground the
blur $4.43\,z/q_c$ is 94 to 101 km, about a hundred kilometres. GOCE's measurements correspond to the first row of the
table.[^goce-flat]

**What the instrument predicts.** The same cut-off follows, roughly, from the mission's own numbers. The inputs are the
height of 254 km, three years of readings, $T = 9.5\times10^7\unit{s}$, and the noise, a one-sided $\sqrt{S_1}$ of 10 to
$20\unit{mE\,Hz^{-1/2}}$ [@RummelYiStummer2011], or a two-sided $\sqrt S$ of 7.1 to $14\unit{mE\,s^{1/2}}$ (section
3.2). For the Earth we need the strength of its field in each degree, which a rule of thumb summarizes. We write the
potential outside the Earth as $-(G\matter M/r)$ times one plus a sum of patterns of degree $\ell$, each scaled so that
its mean square over the sphere is one. **Kaula's rule** says that the coefficients of degree $\ell$ have a typical size
of $10^{-5}/\ell^2$ (W. M. Kaula, *Theory of Satellite Geodesy*, 1966).

Outside the Earth a pattern of degree $\ell$ falls as $r^{-(\ell+1)}$ (section 2.2), so its potential carries
$G\matter M R^\ell/r^{\ell+1}$. Two derivatives with respect to $r$ bring down $(\ell + 1)(\ell + 2)/r^2$, and at the
orbit, $r = R + z$, the vertical tide of the pattern is $(G\matter M/R^3)(\ell + 1)(\ell + 2)(R/r)^{\ell+3}$ times its
coefficient. The orbit carries the satellite evenly over the sphere, so the amount of one pattern is found by averaging
the readings, each multiplied by the pattern, over the whole mission, and its noise is that of an average over the
time $T$, with the variance $S/T$ (section 3.2). The pattern stands above its noise by

$$s_\ell = \frac{G\matter M}{R^3}\,\frac{(\ell + 1)(\ell + 2)}{\ell^2}\,10^{-5}\Bigl(\frac{R}{r}\Bigr)^{\ell+3}\sqrt{\frac TS} .$$

The units cancel: $G\matter M/R^3$ is in $\mathrm{s^{-2}}$ and $\sqrt{T/S}$ in $\mathrm{s^{1/2}}/(\mathrm{s^{-2}\,s^{1/2}})
= \mathrm{s^2}$. The fraction is 1.01 near $\ell = 250$, and the rest is a constant times $(R/r)^{\ell+3}$: the two
derivatives of the tide have cancelled Kaula's $1/\ell^2$, so the Earth reaches the orbit as a sheet of point masses
reaches an accelerometer, with the kernel $e^{-q}$ of the paragraph on other sensors below. The cut-off, $s_\ell = 1$,
is at

$$\ell_c \approx \frac{\ln\bigl[10^{-5}(G\matter M/R^3)\sqrt{T/S}\,\bigr]}{\ln(1 + z/R)} - 3 .$$

With $G\matter M/R^3 = 1.54\times10^{-6}\unit{s^{-2}}$, $\sqrt T = 9730\unit{s^{1/2}}$ and $\sqrt S =
7.1\times10^{-12}\unit{s^{-2}\,s^{1/2}}$, the bracket is $2.1\times10^4$ and its logarithm 9.96; with the noisier
$1.4\times10^{-11}$ it is 9.27. The denominator is $\ln 1.0399 = 0.0391$, so $\ell_c = 252$ and $234$. A pattern of
degree 250 passes under the satellite 250 times in each orbit of 89 minutes, at 47 mHz, inside the band where the noise
is white. GOCE also read the other components of the tide; averaged over the directions of a ripple, the squared entries
$xx$, $yy$, $zz$ and $xz$ hold $\tfrac38 + \tfrac38 + 1 + \tfrac12 = \tfrac94$ times the $zz$ entry alone, which, with
the same noise in each, raises $s_\ell$ by 1.5 and the cut-off by $\ln1.5/0.0391 = 10$ degrees, to 245 to 262. The final
map runs out at 280 to 300: the instrument alone predicts the place where the map ends to about a tenth, the accuracy of
a rule of thumb for the Earth's field, and the final maps also use a fourth year flown lower. **A limit:** the cut-off
grows only as the logarithm of the time, so a mission twice as long would add $\ln\sqrt2/0.0391 = 9$ degrees.

**The eye.** The human eye resolves about one arcminute, $2.9\times10^{-4}$ radians. Setting $4.43/q_c$ equal to it gives
$q_c = 15{,}230$, and then $\SNR = e^{q_c}/\pi q_c$, a number with 6610 digits. For comparison, the number of atoms in
the observable universe is about $10^{80}$, a number with 81 digits.

**The quantum ceiling.** No camera could watch a person with a ratio better than about $10^{70}$, even for the age of
the universe.[^quantum] There $q_c = 167$ and the blur is $4.43/167 = 0.026$ radians, or 1.5°: every point of a face
seen from a metre would still be a smudge about 2.6 cm wide, so no camera of this kind could draw a face.

**Other gravitational sensors.** Nothing in the derivation used the fact that the sensors read a tide, except the factor
$q$ in $q\,e^{-q}$. Sensors that compare clocks read the potential itself, whose kernel over a sheet goes as
$q^{-1}e^{-q}$, and accelerometers read its gradient, whose kernel goes as $e^{-q}$ (section 2.7). The cut-off
condition becomes $q^pe^{-q} = 1/\pi\SNR$ with $p = -1$, $0$ and $1$ for clocks, accelerometers and tides. At $\SNR =
10^3$ the cut-offs are 6.2, 8.1 and 10.4. They differ by about the logarithm of $q_c$. The blur belongs to Laplace's
equation, which every static gravitational field obeys in empty space, and not to the detector.

**The magnetic picture.** A pixel that also reads the magnetic part $\curv{\tB}$ of the field (section 1.5) records
moving matter, and the same law sets its blur. Outside matter, and to first order in $v/c$, the magnetic part is
$\curv{\tB}_{ij} = (G/c)(\partial_ib_j + \partial_jb_i)$, with $\vect b = \nabla\times\field{\vect A}$, where the
potential of the flow $\field{\vect A}$ obeys $\nabla^2\field{\vect A} = -4\pi\matter{\vect J}$ and
$\matter{\vect J}$ is the mass flux (section 2.8, derived in section 7.5).[^magnetic] We assume that **the moving
matter lies on the same thin sheet and flows along it**, with a surface mass flux $\matter{\vect K}$, the mass flux
added up through the sheet's thickness, in $\mathrm{kg\,m^{-1}\,s^{-1}}$. Each component of $\field{\vect A}$ obeys
Poisson's equation with $-4\pi$ in place of $4\pi G$, so it is $-1/G$ times the potential that a density
$\matter{\vect J}$ would make. A ripple of the flux therefore gives, by the potential of a ripple used in step 2,

$$\tilde{\field{\vect A}} = \frac{2\pi\,\tilde{\matter{\vect K}}}{k}\,e^{-kh} ,$$

fading with height as every solution of Laplace's equation above the sheet does. We take the ripple's wavevector along
$x$, so that its crests run along $y$, and write $\partial_z = \partial/\partial h$ for the vertical. The vertical
component of $\vect b$ is $b_z = \partial_x\field A_y - \partial_y\field A_x = ik\,\field A_y$, and its derivative
with respect to $h$ brings down $-k$, so

$$\tilde{\curv{\tB}}_{zz} = \frac{2G}{c}\,\partial_hb_z = -\frac{4\pi iG}{c}\,k\,e^{-kz}\,\tilde{\matter K}_y .$$

The units agree: $G/c$, in $\mathrm{m^2\,kg^{-1}\,s^{-1}}$, times a wavenumber and $\mathrm{kg\,m^{-1}\,s^{-1}}$, is
$\mathrm{s^{-2}}$. This is the kernel $k\,e^{-kz}$ of the electric data, $2\pi G\,k\,e^{-kz}\,\tilde{\matter\sigma}$,
with $2\tilde{\matter K}_y/c$ in place of $\tilde{\matter\sigma}$: the vertical entry sees the flux along the crests
and none across them. A point mass $\matter m$ moving with the velocity $\vect v$ along the sheet has
$\tilde{\matter{\vect K}} = \matter m\vect v$ in every ripple, so its magnetic ripple is $2v_y/c$ times its electric
one. For a prior of point masses moving at the speed $v$ in random directions along the sheet, the mean square of $v_y$
is $v^2/2$ in every ripple, so with the same noise steps 2 to 6 hold unchanged, with $\SNR$ replaced by

$$\boxed{\;\SNR_{\curv{\tB}} = \sqrt2\,\frac vc\,\SNR .\;}$$

The magnetic picture obeys the same cut-off equation and the same blur, $4.43/q_c$, at a signal-to-noise ratio smaller
by about $v/c$. In the limit $v \to 0$ it vanishes, as it must. For the person walking at $1.4\unit{m\,s^{-1}}$,
$\sqrt2\,v/c = 6.6\times10^{-9}$. A camera with $\SNR = 10^3$ on the person's tide has $\SNR_{\curv{\tB}} =
6.6\times10^{-6}$, far below the 0.87 of step 4, and sees no magnetic picture; one begins only above $\SNR =
1.3\times10^8$. At the quantum ceiling of $10^{70}$, $\SNR_{\curv{\tB}} = 6.6\times10^{61}$, $q_c = 148$ and the
magnetic blur is 1.7°, against 1.5° for the tide: the logarithm forgives a factor of nearly $10^{-8}$ almost entirely.

**A small camera.** Everything so far assumed an array at least as wide as the scene is deep. A camera much smaller than
its distance to the scene does worse; we state the result with a sketch. Seen from the camera, the field of a source at a
distance $r$ splits into patterns over the sky of increasing degree $\ell$, as on the Earth above, and a pattern of
degree $\ell$ has features about $\pi/\ell$ radians wide. Inside the camera, the tide of that pattern grows from the
camera's centre as the power $\ell - 2$ of the distance from it, while the tide of the coarsest pattern, the quadrupole
with $\ell = 2$, is the same everywhere. At the camera's edge, a distance $D/2$ from its centre for a camera of width
$D$, the pattern of degree $\ell$ is therefore weaker than the quadrupole by a factor of about $(D/2r)^{\ell-2}$. The
camera sees degree $\ell$ only if $\SNR \gtrsim (2r/D)^{\ell-2}$, which gives[^handheld]

$$\ell_{\max} \approx 2 + \frac{\ln\SNR}{\ln(2r/D)}, \qquad \Delta\theta \approx \frac{\pi}{\ell_{\max}} .$$

A camera ten centimetres across, looking at a lorry fifteen metres away with $\SNR = 10^6$, has $\ell_{\max} =
2 + \ln(10^6)/\ln 300 = 4.4$ and a blur of $\pi/4.4 = 0.71$ radians, about 40°, against 14° for an array as wide as the
lorry is far. The logarithm appears again, now of the ratio $2r/D$ as well as of $\SNR$.

**Where the small camera meets the law.** Widening the camera lowers $\ln(2r/D)$, and so sharpens the picture, but
only slowly. For the lorry at 15 m with $\SNR = 10^6$, a camera 1 m wide has $\ell_{\max} = 6.1$ and a blur of 30°;
one 3 m wide has 8.0 and 22.5°; one 7.5 m wide, half as wide as the lorry is far, has 12.0 and 15°, close to the 14.2°
of $4.43/q_c$. In the other direction, as $D \to 0$, $\ell_{\max} \to 2$: a single pixel sees only the quadrupole,
however sensitive it is. The two laws meet where $\pi/\ell_{\max} = 4.43/q_c$. At high sensitivity the 2 in
$\ell_{\max}$ and the $\ln\ln$ in $q_c$ are small beside $\ln\SNR$, so the condition reads $\pi\ln(2r/D)/\ln\SNR =
4.43/\ln\SNR$. The sensitivity cancels, and

$$\boxed{\;\ln\frac{2r}{D} = \frac{4.43}{\pi} = 1.41, \qquad D = 2e^{-1.41}\,r = 0.49\,r .\;}$$

With the 2 kept and the exact $q_c$ of step 4, the crossing is at $D = 0.55\,r$ at $\SNR = 10^3$ and at $10^6$, and at
$0.51\,r$ at $10^{30}$. Beyond the crossing the small-camera formula would promise more than a whole plane of sensors
gives, which no camera can do, so there the law $4.43/q_c$ takes over and widening buys nothing more. The crossing is at
about half the scene's depth at every sensitivity, a camera about as wide as the scene is deep to within the factor of
two that the logarithms hardly feel.[^two-snrs]

::: try {#blur-law}
The road of steps 2 to 7 at the sensitivity you choose. Panel (a) is the curve $q\,e^{-q}$ and the level $1/(\pi\SNR)$:
the ripples between the two crossings stand above their noise, and the upper crossing is the cut-off $q_c$. Panel (b) is
the weight $H$ that follows, and beside it the exact picture of a point, with its full width at half maximum and the
sharp-edge approximation of step 5. Drag the sensitivity slider or the dashed line, or use the arrow keys.

Before you touch anything, decide how much sharper the picture will get when the camera becomes a thousand times more
sensitive; then raise the sensitivity by three powers of ten and watch the crossing move along $q$. Guess how sensitive a
camera must be to see as sharply as the eye, and take the slider to its top.
:::

::: try {#near-field-blur}
A row of sensors above two line masses at depth $z$, what the sensors record, and the best reconstruction at the
sensitivity you choose. Because it is a row, its blur is the row's law of step 6, $3.79/q_c$, drawn as a bar in units of
the depth. Drag the sensitivity and separation sliders, or use the arrow keys.

The figure opens at $\SNR = 10^6$. Before you move anything, predict by what factor the bar will shrink when the
sensitivity rises a million-fold, to $10^{12}$, and compare it with the growth of $q_c$ in step 4. Then set the
sensitivity to $10^3$ and bring the masses together until the verdict below the figure changes: the masses are told
apart when the reconstruction dips by at least three per cent between them. Compare that separation with the length of
the bar, and repeat at $10^6$.
:::

**The idea to keep: fine detail fades as $e^{-kz}$ while noise does not, so the finest ripple kept satisfies
$q_ce^{-q_c} = 1/\pi\SNR$. Sharpness grows only with the logarithm of sensitivity, and the blur, $4.43/q_c$, is an
angle.**

::: problems
### Practice

**[3.7]** What are the cut-off and the blur of a plane of sensors at $\SNR = 10^6$?

::: solution
The cut-off solves $q_ce^{-q_c} = 1/(\pi\times10^6)$, which gives $q_c = 17.8$. The law gives $4.43/17.8 = 0.248$
radians, or 14.2°, and the exact calculation gives 14.1°.
:::

**[3.7]** Why does doubling the distance to the scene, at the same signal-to-noise ratio, leave the angular blur
unchanged?

::: solution
Only $q = kz$ enters $s$, $H$ and $q_c$. Doubling $z$ halves the finest wavenumber kept, so the blur in metres doubles
while the angle, width over depth, stays the same. (For the same mass seen by the same camera, $\SNR$ falls as $1/z^2$,
so doubling the distance divides it by four; at $10^3$ that lowers $q_c$ from 10.4 to 8.8 and widens the blur by about a
sixth.)
:::

**[3.7]** Why is the half maximum measured on $2J_1(u)/u$ and not on its square?

::: solution
The reconstruction is a surface density, linear in the data, so the picture of two masses is the sum of their pictures:
an amplitude image. The square would describe an intensity, as a photograph of light records, and would understate the
blur by 27%.
:::

**[3.7]** About what signal-to-noise ratio gives a blur of 10°?

::: solution
A blur of 10° is 0.175 radians, so $q_c = 4.43/0.175 = 25.4$, and $\SNR = e^{q_c}/\pi q_c \approx 1.3\times10^9$: about
$10^9$.
:::

**[3.7]** In the figure of two buried masses, by what factor does the blur bar shrink from $\SNR = 10^6$ to $10^{12}$,
and where do the masses come apart?

::: solution
The bar, $3.79/q_c$, shrinks from $0.21\,z$ to $0.12\,z$, a factor of 1.8, as $q_c$ grows from 17.8 to 32.2. The verdict
changes near $0.41\,z$ at $10^3$, where the bar is $0.36\,z$, and near $0.24\,z$ at $10^6$, where the bar is $0.21\,z$:
two pictures must sit a little farther apart than the width of one before a dip opens between them.
:::

**[3.7]** Find the cut-off at $\SNR = 10^9$ by three steps of the iteration $q_{j+1} = L_\pi + \ln q_j$, starting from
$q_0 = L_\pi$, and give the blur of a plane of sensors in degrees.

::: solution
Here $L_\pi = \ln(\pi\times10^9) = 21.868$. The steps give $q_1 = 24.953$, $q_2 = 25.085$ and $q_3 = 25.090$, against the
exact 25.0905. The blur is $4.43/25.09 = 0.177$ radians, or 10.1°; the exact calculation gives 10.09°.
:::

**[3.7]** A row of sensors lies across a long line mass of $\matter\lambda$ kilograms per metre at depth $z$, whose
potential is $\field\Phi = 2G\matter\lambda\ln\varrho$ at the distance $\varrho$ from the line. How wide is the bump in
the readings $-\curv{\tE}_{zz}$ at half its height?

::: solution
Two derivatives with respect to the height give $\curv d = 2G\matter\lambda(2h^2 - \varrho^2)/\varrho^4$, which at $h = z$
is $(2G\matter\lambda/z^2)(1 - u^2)/(1 + u^2)^2$ with $u = a/z$. Half the peak needs $2(1 - x) = (1 + x)^2$ with $x =
u^2$, so $x^2 + 4x - 1 = 0$ and $x = \sqrt5 - 2 = 0.236$. Then $u = 0.486$, and the bump is $0.97\,z$ wide: a line mass,
too, is about as wide in the data as it is deep.
:::

**[3.7]** A camera 30 cm wide looks at a scene 1 m away with $\SNR = 10^3$. Which law sets its blur, and how large is
it?

::: solution
It is narrower than the crossing at $0.55\,r$, so the small-camera law applies: $\ell_{\max} = 2 + \ln(10^3)/\ln(6.67)
= 2 + 6.91/1.90 = 5.64$, and the blur is $\pi/5.64 = 0.56$ radians, or 32°, against 24° for a whole plane of sensors.
A camera about 55 cm wide would reach the plane's law.
:::

### Stretch

**[3.7]** Section 2.7 found that over a sheet, sensors that compare clocks have the kernel $q^{-1}e^{-q}$ and
accelerometers the kernel $e^{-q}$. With the cut-off condition $q^pe^{-q} = 1/\pi\SNR$, find the cut-offs of both at
$\SNR = 10^3$ and at $10^{20}$, and compare them with the tidal camera's.

::: solution
Taking logarithms gives $q - p\ln q = L_\pi$. For accelerometers, $p = 0$, so $q_c = L_\pi$: 8.05 at $10^3$ and 47.20 at
$10^{20}$. For clocks, $p = -1$, so $q_c + \ln q_c = L_\pi$, which the iteration $q_{j+1} = L_\pi - \ln q_j$ solves:
6.22 at $10^3$ and 43.43 at $10^{20}$. The tidal camera, $p = 1$, has 10.39 and 51.13. Each kind of sensor differs from
the next by about $\ln q_c$, which grows only slowly, so all three meet the same logarithmic law.
:::

**[3.7]** A sheet flows steadily, so that its surface density does not change and $\nabla\cdot\matter{\vect K} = 0$
(section 2.8). Show that in each ripple the flux then runs along the crests, so that $\curv{\tB}_{zz}$ sees all of it.
At what $\SNR$ on the tide would the magnetic picture of the walking person be as sharp as the tide's picture at $10^3$?

::: solution
For a ripple $e^{i\vect k\cdot\vect a}$, $\nabla\cdot\matter{\vect K}$ becomes $i\vect k\cdot\tilde{\matter{\vect K}}$,
so $\tilde{\matter{\vect K}}$ is at right angles to $\vect k$, along the crests: with $\vect k$ along $x$ it is
$\tilde{\matter K}_y$ alone, and $|\tilde{\curv{\tB}}_{zz}| = (4\pi G/c)\,k\,e^{-kz}|\tilde{\matter{\vect K}}|$. The
magnetic picture has the tide's blur at $10^3$ when $\SNR_{\curv{\tB}} = 10^3$, so $\SNR = 10^3/(6.6\times10^{-9}) =
1.5\times10^{11}$, where the tide's own picture is 8.4° wide.
:::

**[3.7]** By how many degrees would GOCE's cut-off rise with noise half as large, and by how many with a mission four
times as long?

::: solution
The cut-off is $\ell_c \approx \ln[10^{-5}(G\matter M/R^3)\sqrt{T/S}]/\ln(1 + z/R) - 3$. Halving $\sqrt S$ adds $\ln2$ to
the numerator, and four times $T$ adds $\ln\sqrt4 = \ln2$ as well, so each raises the cut-off by $\ln2/0.0391 = 18$
degrees, about 7%.
:::

### The camera

**[3.7]** Derive the cut-off condition and the blur law from the data equation of step 2, check the first row of the
table, and read GOCE's cut-off, $kz$ between 11 and 12, as a signal-to-noise ratio.

::: solution
With $T(\vect k) = 2\pi Gk\,e^{-kz}$, $S_\sigma = \matter{m}^2/z^2$ and $N_0$, $s = |T|\sqrt{S_\sigma/N_0} =
\pi\SNR\,q\,e^{-q}$, and $H$ falls through one half where $s = 1$: $q_ce^{-q_c} = 1/\pi\SNR$. One step of the
iteration gives $q_c \approx \ln(\pi\SNR) + \ln\ln(\pi\SNR)$. A step at $q_c$ makes the picture of a point
$2J_1(u)/u$, half its peak at $u = 2.2151$, so the blur is $4.43/q_c$. At $\SNR = 10^3$, $q_c = 10.39$ and $4.43/q_c =
24.4°$ against the exact 24.0°; the row gives $3.79/10.39 = 20.9°$ against 20.7°, and the first estimate $\pi/\ln 10^3
= 26.1°$. For GOCE, $\ell = 280$ to 300 gives $q_c = 11.2$ to $12.0$, and $\SNR = e^{q_c}/\pi q_c$ is 2000 to 4200.
(Rounding $q_c$ to 11 and 12 would give 1700 and 4300.)
:::
:::

::: paper
- Equations [](/paper/#eq:evanescent) and [](/paper/#eq:array-data) are the starting point: the fade $e^{-kz}$, ripple
  by ripple.
- Equations [](/paper/#eq:wiener), [](/paper/#eq:cutoff) and [](/paper/#eq:resolution) are steps 3, 4 and 6 of this
  section.
- Table [](/paper/#tab:resolution) and Figure [](/paper/#fig:resolution-law) are what step 7 recomputes.
- Figure [](/paper/#fig:nearfield) shows the blur, and its ringing, for two masses under a row of sensors.
- Section [](/paper/#sec:near-field) reads the law on GOCE ("A flown gradiometer"), on clocks and accelerometers
  ("Other gravitational sensors"), and on a camera smaller than its scene ("A small camera", equation
  [](/paper/#eq:handheld)).
- Equation [](/paper/#eq:capacity-integral) counts the $q_c^2/4\pi$ patterns per area $z^2$ that survive the cut-off,
  and turns them into bits (section 3.8).
:::

::: deeper
- Joseph W. Goodman, *Introduction to Fourier Optics*: the round pupil, and amplitude (coherent) against intensity
  (incoherent) imaging.
- R. M. Corless and others, "On the Lambert W function", *Advances in Computational Mathematics* 5 (1996): the two
  branches and the series behind the iterated logarithm.
:::

[^law]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, with the table of step 7 as its Table
    [](/paper/#tab:resolution).

[^quantum]: The number $10^{70}$ comes from the quantum limit on measurement, which section 8.6 derives.

[^magnetic]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in its paragraph on
    [the magnetic picture](/paper/#par:the-magnetic-picture).

[^bump]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in the caption of its
    [figure of the near field's geometry](/paper/#fig:near-field-geometry).

[^yardstick]: Doubling $\SNR$ moves $q_c$ at $\SNR = 10^3$ from 10.39 to 11.16, and the blur from 24.4° to 22.7°.

[^goce-noise]: The two numbers are not of the same kind. GOCE's is the noise of one instrument, averaged over a second
    of time; ours is the noise of a square metre of sensors, averaged over that area.

[^evanescent]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:evanescent), with the data equation as [](/paper/#eq:array-data).

[^cutoff]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equations
    [](/paper/#eq:wiener) and [](/paper/#eq:cutoff), the second with the approximation of step 4.

[^units-s]: Units: $T(\vect k)$ is in $\mathrm{m^2\,kg^{-1}\,s^{-2}}$ (that of $G$ times a wavenumber) and $S_\sigma$ in
    $\mathrm{kg^2\,m^{-2}}$, so $|T|^2S_\sigma$ is in $\mathrm{s^{-4}\,m^2}$, the unit of $N_0$, and $s$ is a pure
    number.

[^bessel]: Section 3.6 defines the Bessel function of order zero by $J_0(u) = \frac{1}{2\pi}\int_0^{2\pi}e^{iu\cos\varphi}\,\dd\varphi$,
    and the function of order one by $\frac{\dd}{\dd u}\big(uJ_1(u)\big) = uJ_0(u)$ with $J_1(0) = 0$. Integrating from
    $0$ to $u$ gives $\int_0^uJ_0(t)\,t\,\dd t = uJ_1(u)$, and near zero $J_1(u) \approx u/2$.

[^angle]: The exact angle is $2\arctan(w/2z)$. For the 24° blur it is 1.4% smaller than $w/z$.

[^table]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its Table [](/paper/#tab:resolution); the column $4.43/q_c$ is added here.

[^goce-flat]: The flat-sheet law is a fair estimate here because the height is 4% of the Earth's radius. On the sphere
    the fade is $\bigl(R/(R + z)\bigr)^{\ell+1}$ instead of $e^{-kz}$, which lowers the cut-off to 11.0 to 11.8 and the
    ratio to about 1700 to 3500.

[^sparrow]: C. M. Sparrow proposed it for spectral lines in 1916. In the step approximation the picture $2J_1(u)/u$
    stops curving downward at $u = 2.30$, so two points show a dip once they are $4.60\,z/q_c$ apart, 4% more than the
    full width.

[^two-snrs]: The two laws count the sensitivity differently: the small camera by the quadrupole's signal over its
    noise, the plane by the peak of a point mass over the noise on a patch $z^2$. A constant factor $f$ between them moves
    $\ln(2r/D)$ at the crossing by $\ln f/(\ell_{\max} - 2)$; a factor of four either way moves the crossing at $10^6$
    from $0.55\,r$ to between $0.48\,r$ and $0.62\,r$.

[^handheld]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:handheld).
