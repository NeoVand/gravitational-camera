---
id: '5.6'
title: 'Pictures from line integrals: the Abel transform'
question: 'The paper says that "a camera at one place on its surface can still see its inside layer by layer", and that "the angle of each kink depends only on the radius of that boundary, not on the friction or the temperature". How can one viewpoint recover a round planet''s layers?'
part: '5'
requires: ['1.3', '2.5', '2.6', '5.5']
paper: [sec:first-image, eq:column, eq:abel, eq:abel-inverse, fig:sun-at-midnight, fig:earth-glow, fig:earth-inverted, sec:near-field, fig:same-outside, sec:one-pixel, sec:second-order, eq:pass, app:proofs]
figures: [fig:sun-at-midnight, fig:earth-glow, fig:earth-inverted]
live: []
depth: A
---

The paper's camera in [Section IX](/paper/#sec:first-image) stands on the night side of the Earth and looks down. A
medical scanner needs views from all round a patient, yet the paper reads the Earth's layers from this one place, and
it finds each boundary between layers at an angle that no friction or temperature can move. Both facts come from an
integral studied by Abel, the paper's [](/paper/#eq:abel), and from the fact that it can be undone.

{{paper fig:sun-at-midnight}}

::: plain
A camera on the ground that looks down at a slant sends its line of sight through the planet along a straight chord.
A steep line passes close to the centre and crosses every layer. A shallow line stays far from the centre and crosses
only the outer layers. If the planet is round, the brightness of a line depends only on how close it passes to the
centre.

So the brightness against the angle of the line holds the glow of every layer. The shallowest lines cross only the
crust, and they give the crust's glow. The next lines cross the crust and one more layer. The crust is now known, so
these lines give the glow of that layer. Working inward in this way peels the planet like an onion.

Each boundary between two layers leaves a sharp corner in the brightness, at the angle at which the line first touches
that boundary. That angle depends only on the radius of the boundary, so the camera measures the radii by geometry
alone. A planet that is not round would need cameras at many places.
:::

## From the surface of a round planet, each line of sight is a chord

We want the brightness of one pixel of a camera on the surface of a round planet, as a function of the direction in
which it looks, because that curve is the paper's image. Let $R$ be the planet's radius, in metres.[^R] The pixel looks
down at the angle $\sym{nadir-angle}{\theta}$ from straight down, where straight down points at the centre.[^theta] We
assume, with the paper, that **the glow depends only on the distance from the centre**, so that the number emissivity
of chapter 5.5 is a function $\sym{number-emissivity}{j_N}(r)$ of the radius $r$ alone, in gravitons
$\mathrm{s^{-1}\,m^{-3}\,sr^{-1}}$. We also assume that **nothing beyond the planet glows along the lines we use**. The
Sun does shine through the Earth, so the paper masks its path across the ground. Chapter 5.5 showed
that almost nothing absorbs, so the brightness of a line is the sum of the glow along it.

**The impact parameter.** Drop the perpendicular from the centre $O$ onto the line of sight, and call its foot $M$; it
is the point of the line nearest the centre. The camera $C$, the centre and $M$ form a triangle with a right angle at
$M$. Its side $OC$ has the length $R$ and meets the line at the angle $\theta$, so the side $OM$ has the length

$$\sym{line-impact-parameter}{b} = R\sin\theta .$$

This is the line's impact parameter, the distance by which it misses the centre, as in chapter
[1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick) for a passing
mass and in chapter 5.5 for a ray that passes a lens.[^b] Looking straight down, $\theta = 0$ and $b = 0$; a line along
the horizon has $\theta = 90^\circ$ and $b = R$.

**The chord.** The line enters the ground at the camera and leaves the planet on the far side. The straight piece
between, inside the planet, is a **chord**. By symmetry $M$ is its midpoint, and its length is $2\sqrt{R^2 - b^2} =
2R\cos\theta$. Let $s$ be the distance along the chord from $M$, in metres.[^s] A point of the chord, $M$ and $O$ form
another right triangle, so Pythagoras's theorem gives the point's distance from the centre
(Figure [](#fig:abel-chords)):

$$r^2 = b^2 + s^2 .$$

![Look first at the line whose distance $b$ from the centre is drawn: from the camera at the top it misses the centre
by its impact parameter $b = R\sin\theta$ and crosses the planet along a chord whose midpoint is $M$. A point of the
chord at the distance $s$ from $M$ lies at the radius $r$, with $r^2 = b^2 + s^2$. The three lines are drawn at
$11.1^\circ$, $33.1^\circ$ and $63.5^\circ$ from straight down, where they graze the inner core, the core and the lower
mantle of the paper's Earth, drawn to scale; the outer shell holds the upper mantle and the
crust.](tut-abel-chords){#fig:abel-chords}

**The integral.** The paper's [](/paper/#eq:column) adds $j_N$ along the line, and the sum is the line's number
radiance $\sym{chord-brightness}{N(b)}$ of chapter 5.5, in gravitons $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$. The two halves
of the chord, on either side of $M$, pass through the same radii, so they add the same amount, and

$$N(b) = 2\int_0^{\sqrt{R^2 - b^2}} j_N\bigl(\sqrt{b^2 + s^2}\,\bigr)\,\dd s .$$

We change the variable from $s$ to $r$. Along one half, $r$ grows from $b$ to $R$ as $s$ grows from 0 to $\sqrt{R^2 -
b^2}$. Differentiating $r^2 = b^2 + s^2$ at a fixed $b$ gives $2r\,\dd r = 2s\,\dd s$, and $s = \sqrt{r^2 - b^2}$, so

$$\dd s = \frac{r\,\dd r}{\sqrt{r^2 - b^2}} .$$

With this the brightness becomes

$$\boxed{N(b) = 2\int_b^R \frac{j_N(r)\,r\,\dd r}{\sqrt{r^2 - b^2}} ,} \label{eq:abel-transform}$$

which is the paper's equation:

{{paper eq:abel}}

The brightness as a function of the impact parameter is called the **Abel transform** of the glow as a function of the
radius.[^units] The weight $r/\sqrt{r^2 - b^2}$ says how long the chord stays near each radius. Near $r = b$ the chord
runs along the sphere of that radius, so it lingers there, and the weight grows without bound. Its integral stays
finite, because $\int\dd r/\sqrt{r - b}$ is finite.

**A uniform ball.** Let $j_N$ be the same value $j$ at every radius. Since $\dd\sqrt{r^2 - b^2}/\dd r = r/\sqrt{r^2 -
b^2}$, the integral is $\sqrt{R^2 - b^2}$, and

$$N(b) = 2j\sqrt{R^2 - b^2} ,$$

the length of the chord times $j$, as chapter 5.5 found for a uniform slab. Straight down through the Earth, with $R =
6371\unit{km}$, that length is the diameter, 12,742 km.

## Gold in a steel ball would glow as a spot, a dome or a ring

The same integral holds for a camera far outside a round body. Its lines of sight are parallel, and each crosses the
body along a chord. Each line's $b$ is set by where the line meets the picture, not by an angle of view.

Chapter 2.5's three steel balls hold the same extra mass of gold, as a small nugget, as a flush spread through the ball,
and as a thin skin on the surface, and their fields outside are the same. The paper says that their glow "would show the
nugget as a spot, the flush as a gradient and the skin as a ring" ([*What breaks the tie*](/paper/#par:what-breaks-the-tie)).
For this illustration we assume that **the gold glows and the steel does not**.

**The round case.** The paper's nugget sits halfway out, so its three bodies are not round and their pictures are not
Abel transforms. We put the nugget at the centre instead. Then its flush is the gold spread evenly through the ball, and
its skin is a layer of even thickness
([chapter 2.5](/tutorial/outside/null-space/#the-harmonic-part-of-a-nugget-is-a-flush-on-the-near-wall)). All three are
round, and [](#eq:abel-transform) gives their pictures (Figure [](#fig:abel-three-glows)).

- The nugget, a small ball, glows only on the lines that pass through it, those whose $b$ is smaller than its radius:
  a small bright spot.
- The flush is the uniform ball, $N = 2j\sqrt{R^2 - b^2}$: a dome, brightest through the middle and fading to nothing at
  the edge.
- The skin fills the radii from $R - t$ to $R$, with $t$ its thickness.[^t] By [](#eq:abel-transform), with $j_N = j$ in
  the skin and zero inside it, a line with $b < R - t$ has
  $$N = 2j\Bigl[\sqrt{R^2 - b^2} - \sqrt{(R - t)^2 - b^2}\,\Bigr] .$$

Through the middle, $b = 0$, the skin gives $N = 2jt$: the line crosses the thickness twice. At $b = R - t$ the line
touches the inside of the skin and runs within it along its whole chord, so $N = 2j\sqrt{2Rt - t^2} \approx
2j\sqrt{2Rt}$. This line is the brightest of all, and it is $\sqrt{2R/t - 1}$ times as bright as the middle. For a skin
one hundredth of the radius thick, a millimetre on a steel ball of radius 10 cm, the ratio is $\sqrt{199} = 14$: a thin
bright ring round a faint disc.

**The paper's caution.** The glow measures friction and temperature, not mass. These pictures show where the gold is
only if the gold glows differently from the steel.

![Look first at the right-hand curve: a thin glowing skin is faint through the middle and bright at the rim, where the
line runs along the skin. The three bodies of chapter 2.5 with the nugget at the centre, if only the gold glows; each
curve is scaled to its own maximum, and the skin is drawn $0.05R$ thick (its rim is then 6.2 times as bright as its
middle; for $0.01R$, 14 times).](tut-abel-three-glows){#fig:abel-three-glows}

## The transform can be undone

We want $j_N(r)$ back from the curve $N(b)$, because the camera measures the curve and the layers are what we want to
know. We assume that **$N(b)$ is known for every $b$** and that **$j_N$ is finite**, with at most a few jumps.

The plan is to turn the curve into an integral of $j_N$ alone over the radii outside a chosen radius $r$, because the
derivative of such an integral with respect to its lower limit gives back the integrand, with a minus sign. Abel's
weight $b/\sqrt{b^2 - r^2}$, used in Step 1, does this: after the order of integration is exchanged, the inner integral
is the same number for every pair of radii.

**Step 1: weigh and add.** For a chosen radius $r$, we multiply $N(b)$ by $b/\sqrt{b^2 - r^2}$ and add over the lines
that pass outside that radius, from $b = r$ to $R$. We put in [](#eq:abel-transform), whose radius we rename $r'$ so that
it is not confused with the chosen radius:

$$\begin{aligned}\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} &= 2\int_r^R \frac{b}{\sqrt{b^2 - r^2}}\\
&\qquad\left[\int_b^R \frac{j_N(r')\,r'\,\dd r'}{\sqrt{r'^2 - b^2}}\right]\dd b .\end{aligned}$$

**Step 2: exchange the order.** The double integral covers the pairs $(b, r')$ with $r \le b \le r' \le R$. We can
integrate first over $b$ from $r$ to $r'$ and then over $r'$ from $r$ to $R$. This covers the same pairs:

$$\begin{aligned}\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} &= 2\int_r^R j_N(r')\,r'\\
&\qquad\left[\int_r^{r'}\frac{b\,\dd b}{\sqrt{(b^2 - r^2)(r'^2 - b^2)}}\right]\dd r' .\end{aligned}$$

**Step 3: the inner integral is $\pi/2$**, whatever $r$ and $r'$ are (the box below shows this). So

$$\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} = \pi\int_r^R j_N(r')\,r'\,\dd r' .$$

**Step 4: differentiate with respect to $r$.** The right side depends on $r$ only through its lower limit, so its
derivative is $-\pi\,j_N(r)\,r$, and

$$j_N(r) = -\frac{1}{\pi r}\,\frac{\dd}{\dd r}\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} .$$

This already undoes the transform. One integration by parts, in the box, moves the derivative onto $N$ and gives the
paper's form,

$$\boxed{j_N(r) = -\frac{1}{\pi}\int_r^R \frac{\dd N}{\dd b}\,\frac{\dd b}{\sqrt{b^2 - r^2}} ,} \label{eq:abel-inversion}$$

the **Abel inversion**:

{{paper eq:abel-inverse}}

::: derivation
### The inner integral, and the paper's form

**The inner integral.** We put $u = b^2$, so that $\dd u = 2b\,\dd b$.[^u] The integral becomes

$$\int_r^{r'}\frac{b\,\dd b}{\sqrt{(b^2 - r^2)(r'^2 - b^2)}} = \frac12\int_{r^2}^{r'^2}\frac{\dd u}{\sqrt{(u - r^2)(r'^2 -
u)}} .$$

We put $u = r^2 + (r'^2 - r^2)\sin^2\varphi$, with $\varphi$ from 0 to $\pi/2$. Then $u - r^2 = (r'^2 -
r^2)\sin^2\varphi$, $r'^2 - u = (r'^2 - r^2)\cos^2\varphi$ and $\dd u = 2(r'^2 -
r^2)\sin\varphi\cos\varphi\,\dd\varphi$. The square root is $(r'^2 - r^2)\sin\varphi\cos\varphi$, so the integrand
becomes $2\,\dd\varphi$ and the integral over $u$ is $\pi$. Half of it is $\pi/2$.

**The paper's form.** We integrate by parts in $b$, using $\dd\sqrt{b^2 - r^2}/\dd b = b/\sqrt{b^2 - r^2}$:

$$\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} = \Bigl[N(b)\sqrt{b^2 - r^2}\,\Bigr]_r^R - \int_r^R
\frac{\dd N}{\dd b}\sqrt{b^2 - r^2}\,\dd b .$$

The bracket vanishes at both ends. At $b = r$ the root is zero, and at $b = R$ the chord has shrunk to a point, so
$N(R) = 0$. We differentiate what remains with respect to $r$. The integrand is zero at the lower limit, so only its own
derivative counts, $\partial\sqrt{b^2 - r^2}/\partial r = -r/\sqrt{b^2 - r^2}$, and

$$\frac{\dd}{\dd r}\Bigl(-\int_r^R \frac{\dd N}{\dd b}\sqrt{b^2 - r^2}\,\dd b\Bigr) = r\int_r^R \frac{\dd N}{\dd
b}\,\frac{\dd b}{\sqrt{b^2 - r^2}} .$$

Putting this into Step 4, the factor $r$ cancels, and [](#eq:abel-inversion) follows.
:::

The minus sign is needed because a glowing inside makes the curve fall as $b$ grows, so that $\dd N/\dd b$ is
negative.[^units2]

**A number.** Take a planet whose glow is $j_N = 3$ (in any unit) inside the radius $0.6R$ and 1 outside it. Computing
$N(b)$ from [](#eq:abel-transform) by numerical integration, and putting its slope into [](#eq:abel-inversion), returns
3.000000 at $r = 0.3R$ and 1.000000 at $r = 0.8R$, to six figures.

**What it means.** The glow at the radius $r$ comes only from the slope of the curve on the lines that pass outside $r$.
The inside never affects a line that misses it. One viewpoint is enough because, in the paper's words, "the planet's
symmetry supplies the other viewpoints that tomography would need": every camera on a round planet sees the same curve,
so one camera has the data of all of them.

## A boundary shows as a kink at an angle that only geometry sets

We want to know what a boundary between two layers does to the curve, because the paper's Figure
[](/paper/#fig:earth-glow) shows a step at each boundary. Let $j_N$ jump at the radius $r_0$, so that it is larger on the
inner side of $r_0$ than on the outer side by $\Delta j$, in the same unit. We write the glow as a part with no jump at
$r_0$ plus a uniform ball of glow $\Delta j$ and radius $r_0$. A line with $b < r_0$ crosses that ball along a chord, so
by the uniform ball of the first section the ball adds

$$\Delta N(b) = 2\,\Delta j\sqrt{r_0^2 - b^2}$$

for $b < r_0$, and nothing for $b > r_0$. This part is zero at $b = r_0$, so the curve has no jump there. Its slope is

$$\begin{aligned}\frac{\dd\,\Delta N}{\dd b} &= -\frac{2\,\Delta j\,b}{\sqrt{(r_0 - b)(r_0 + b)}}\\
&\approx -\Delta j\sqrt{\frac{2r_0}{r_0 - b}} ,\end{aligned}$$

where the second form holds for $b$ near $r_0$. The slope grows without bound as $(r_0 - b)^{-1/2}$ as $b$ approaches
$r_0$ from below, as the paper says. The curve has a **kink** there: it stays continuous, but its slope changes
abruptly, here from a finite value outside the boundary to an infinite one inside. The kink lies at the line that grazes
the boundary, where $b = r_0$ (Figure [](#fig:abel-kink)), at the angle

$$\boxed{\sin\theta = \frac{r_0}{R} .}$$

**Numbers.** For the paper's Earth, with $R = 6371\unit{km}$, the top of the inner core, at 1222 km, shows at
$11.1^\circ$ from straight down; the top of the core, at 3480 km, at $33.1^\circ$; the top of the lower mantle, at 5701
km, at $63.5^\circ$. These are the $11^\circ$, $33^\circ$ and $63^\circ$ of the paper's figure. The line toward the
Sun's core, $40^\circ$ from straight down, passes $6371\sin 40^\circ = 4095\unit{km}$ from the centre, outside the core,
so it "crosses only the mantle", as the paper says (and the thin crust at each end).

**The paper's steps.** The square root makes the edge sharp. A line that passes only 1 km inside the core's edge,
$0.011^\circ$ steeper than the grazing line, already runs $2\sqrt{2 \times 3480 \times 1} = 167\unit{km}$ through the
core, and a line 10 km inside runs 527 km. What the paper's figure draws as a step is this steep but continuous rise. In
the paper's model the brightness doubles between $63.5^\circ$ and $63^\circ$, within half a degree inside the edge of
the lower mantle, so at the figure's scale the rise looks like a step.

{{paper fig:earth-glow}}

**A check.** If the inner layer is the fainter one, $\Delta j$ is negative and the curve bends the other way, but the
kink stays at the same angle. If $\Delta j = 0$, the kink disappears.

**What it means.** A kink lies where a line first touches a boundary, which depends on that boundary's radius alone. The
friction and the temperature set $\Delta j$, through the paper's [](/paper/#eq:jN-friction), and the exposure sets how
many gravitons are counted, so they change only how high the curve climbs at the kink. In the paper's words, "their
places are geometry".

![Look first at the inset: close inside the boundary the brightness rises with a vertical tangent, and the corner sits
exactly at the line that grazes the boundary. At the scale of the main plot this continuous rise looks like the step of
the paper's figure. The curve is exact for a planet glowing three times as brightly inside $0.6R$ as outside; only the
height of the rise, not its place, depends on the glow.](tut-abel-kink){#fig:abel-kink}

## Uniform shells are peeled from the outside in

For a planet made of a few uniform shells the inversion becomes arithmetic. Number the shells $1, 2, \dots$ from the
outside in, with shell $k$ between the radii $R_k$ and $R_{k-1}$, where $R_0 = R$, and let $j_k$ be its glow. By the
uniform ball of the first section, the line with impact parameter $b$ runs through shell $i$ for the total length

$$L_i(b) = 2\Bigl[\sqrt{R_{i-1}^2 - b^2} - \sqrt{R_i^2 - b^2}\,\Bigr] ,$$

in two pieces, one on each side of $M$. A square root of a negative number is read as zero, because the line then misses
that sphere. The brightness is the sum $N(b) = \sum_i j_i\,L_i(b)$.

**The peeling.** The line that grazes the bottom of shell 1, at $b = R_1$, crosses only shell 1, so $j_1 =
N(R_1)/L_1(R_1)$. The line that grazes the bottom of shell 2, at $b = R_2$, crosses shells 1 and 2. Now $j_1$ is known,
so

$$j_2 = \frac{N(R_2) - j_1\,L_1(R_2)}{L_2(R_2)} ,$$

and so on inward: each new line adds one shell and one unknown. This is **onion peeling**, the method used to find the
glow inside flames and plasmas [@Dasch1992]. For the planet of the last section, the line at $b = 0.6R$ crosses only the
outer shell, along $2\sqrt{1 - 0.36}\,R = 1.6R$, and its brightness is $1.6R$ (in units of the glow times a length), so
$j_1 = 1$. The line straight down crosses the outer shell along $0.8R$ and the inner one along $1.2R$, with the
brightness $4.4R$. Taking away the outer shell's $0.8R$ leaves $3.6R$, and $j_2 = 3.6/1.2 = 3$.

**Errors grow inward.** Each step subtracts the shells above it, together with their errors. Take five shells of equal
width $R/5$, all glowing equally, and let each grazing line's brightness be measured to 1%, with independent errors.
Carrying the errors through the peeling gives the five glows to 1.0, 1.6, 2.2, 3.1 and 5.8%, from the outside in
(Figure [](#fig:abel-peel)): the centre is known six times less well than any single reading.

::: gap
These errors belong to the peeling model, not to the paper. The paper fits the radii and glows of five shells together
by maximum likelihood to the Poisson counts (chapter 3.1) of about 36,000 gravitons in eighty years, and reads the
errors from the Fisher information of chapter [3.3](/tutorial/noise/measuring-a-number/). Those errors follow how many
gravitons each shell sends, not the order of a peeling. The fit places the boundary of the core to within 29 km, and
chapter R10 reads the rest.
:::

{{paper fig:earth-inverted}}

![Look first at the error bars: each brightness is measured to 1%, yet the glow comes out less certain at every step
inward, because each step subtracts the shells already found. Five equal shells of equal glow; the errors are carried
exactly through the peeling and drawn ten times their size. The paper's own errors come from a joint fit, not from a
peeling.](tut-abel-peel){#fig:abel-peel}

<!-- try: onion-peel — OnionPeel (new). Left panel: a round planet in section with up to five shells, whose radii (drag
the boundaries, or type) and glows (a slider per shell, 0 to 10 in arbitrary units) the reader sets; a camera glyph at
the top of the circle and a line of sight from it that the reader drags, or turns with the arrow keys, from 0° to 90°
from straight down, with its chord drawn and, beside the planet, a stacked bar giving the chord's length in each shell
(L_i(b) of the peeling section). Right panel: the brightness N against the angle from straight down, 0° to 90°,
computed exactly as Σ j_i L_i(R sin θ), with a moving dot at the current line and a thin dotted vertical at each
arcsin(R_k/R), labelled with its angle. A "Peel" button runs the onion peeling on the curve's values at the grazing
angles and draws the recovered glows as bars over the true ones (as in tut-abel-peel); a "Noise" control adds Poisson
noise for a chosen total number of counts (100 to 10⁶, logarithmic; default off), with a "New draw" button, and the
recovered bars then carry error bars. Presets: "The paper's Earth" (radii 1222, 3480, 5701, 6346, 6371 km; glows in the
ratios of the paper's fig:earth-glow, from the figure's data), "Gold in a steel ball" (a skin 0.01 R thick glowing, the
rest dark; a uniform ball; a central nugget of radius 0.2 R), and "Two shells" (3 inside 0.6 R, 1 outside). Opens on the
paper's Earth with the line at 40°. Predict first: "Where on the brightness curve does the edge of the core show?"
(Answer: as a kink at 33.1°, whatever its glow.) Then: "Double the core's glow. Does the kink move?" (Answer: no; only
how high the curve climbs at the kink changes.) Then, with noise on: "Which shell comes back least certain?" (Answer:
the innermost, except for a very thin outer shell, which sends few counts.) Keyboard: arrows turn the line or move the
focused slider; Tab reaches each boundary; both themes; on a phone the two panels stack. -->

## A body that is not round needs views from many directions

Without the round symmetry, the brightness of a line depends on more than $b$, and one camera's curve no longer fixes
the inside. The paper says that departures from round, such as the planet's flattening and the slabs and plumes of its
mantle, "would need cameras at several places, and are tomography proper". **Tomography** is the recovery of a body's
inside from line integrals through it in many directions, as a medical scanner does with X-rays.

Take a camera far away, whose parallel lines of sight run along the unit vector $\hat n$. Let $\vect a$ be the point
where a line crosses the plane through the origin at right angles to $\hat n$. The brightnesses of all these lines form
a **projection**[^P] of the body along $\hat n$,

$$P(\vect a) = \int j_N(\vect a + s\hat n)\,\dd s .$$

We use chapter 2.6's transform in three dimensions, done once along each axis:
$\tilde j(\vect k) = \int j_N(\vect x)\,e^{-i\vect k\cdot\vect x}\,\dd^3x$, with $\vect k$ a wavevector in
$\mathrm{m^{-1}}$. For a wavevector $\vect K$ that lies in the plane, so that $\vect K\cdot\hat n = 0$, the projection's
transform on the plane is

$$\begin{aligned}\tilde P(\vect K) &= \int P(\vect a)\,e^{-i\vect K\cdot\vect a}\,\dd^2a\\
&= \int\!\!\int j_N(\vect a + s\hat n)\,e^{-i\vect K\cdot\vect a}\,\dd s\,\dd^2a .\end{aligned}$$

Every point of space is $\vect x = \vect a + s\hat n$ for one $\vect a$ and one $s$, with $\dd^3x = \dd^2a\,\dd s$, and
$\vect K\cdot\vect x = \vect K\cdot\vect a$ because $\vect K\cdot\hat n = 0$. So the double integral is the body's own
transform:

$$\boxed{\tilde P(\vect K) = \tilde j(\vect K)}$$

for every $\vect K$ with $\vect K\cdot\hat n = 0$.

This is the **projection–slice theorem**: a projection along $\hat n$ gives the body's transform on a slice through
the origin, the plane of wavevectors at right angles to $\hat n$. Adding along $\hat n$ keeps only the ripples that do
not change along $\hat n$.

**A check on a Gaussian blob.** Let $j_N = \delta_\varepsilon(x)\,\delta_\varepsilon(y)\,\delta_\varepsilon(z)$, a blob
made of chapter 2.6's Gaussian of width $\varepsilon$ along each axis.[^eps] Along $\hat n = \hat z$, the integral
$\int\delta_\varepsilon(z)\,\dd z = 1$ leaves the projection $P = \delta_\varepsilon(x)\,\delta_\varepsilon(y)$. The
factor $e^{-i\vect k\cdot\vect x}$ splits into one factor for each axis, so chapter 2.6's pair
$\tilde\delta_\varepsilon(k) = e^{-\varepsilon^2k^2/2}$ gives $\tilde P = e^{-\varepsilon^2(K_x^2 + K_y^2)/2}$ and
$\tilde j = e^{-\varepsilon^2(k_x^2 + k_y^2 + k_z^2)/2}$, which agree at $k_z = 0$.

**Many directions.** Every wavevector $\vect k$ lies on the slice of each direction at right angles to it. The
directions of one plane, as from a camera carried once round the body, hold such a direction for every $\vect k$,
because that plane and the plane at right angles to $\vect k$ both pass through the origin and so share a line. These
projections give $\tilde j$ everywhere, and chapter 2.6's inverse transform gives the body. For a round body $\tilde j$
depends only on the length of $\vect k$, so a single projection is enough: the symmetry supplies the other directions.

::: check
### Q

At what angle from straight down does the top of the lower mantle, at 5701 km, show in the brightness, for $R =
6371\unit{km}$?

### A

At $\arcsin(5701/6371) = 63.5^\circ$, where the line of sight grazes that boundary.

### Q

Why do the places of the kinks not depend on the friction or the temperature?

### A

A kink lies where a line of sight first touches a boundary, and that depends only on the boundary's radius. The friction
and the temperature set the size of the jump in the glow, and so only how high the curve climbs at the kink.

### Q

Why does a camera at one place suffice for a round planet but not for a lumpy one?

### A

On a round planet every line with the same impact parameter crosses the same radii, so every camera sees the same curve,
and the symmetry supplies the other viewpoints. Without the symmetry, lines in other directions carry different
information, and they must be measured.

### Q

Why is a thin glowing skin brightest near its edge, and by how much for a skin $t$ thick on a ball of radius $R$?

### A

The line that touches the inside of the skin runs along it for a length of about $2\sqrt{2Rt}$, while the line through
the middle crosses only $2t$. The ratio is about $\sqrt{2R/t}$, 14 for $t = R/100$.
:::

**The idea to keep: from the surface of a round planet each line of sight is a chord, and the brightness against the
angle is the Abel transform of the glow against the radius. It can be undone, so one viewpoint sees the layers, and each
boundary shows as a kink at $\sin\theta = r_0/R$, an angle that geometry alone sets.**

::: problems
### Practice

For a uniform ball of glow $j$ and radius $R$, find $N(b)$ and its slope, and check that [](#eq:abel-inversion) returns
$j$ at every radius $r < R$.

::: solution
From the first section, $N = 2j\sqrt{R^2 - b^2}$, so $\dd N/\dd b = -2jb/\sqrt{R^2 - b^2}$. Then

$$j_N(r) = \frac{2j}{\pi}\int_r^R\frac{b\,\dd b}{\sqrt{(R^2 - b^2)(b^2 - r^2)}} = \frac{2j}{\pi}\cdot\frac{\pi}{2} = j ,$$

by the inner integral of the box, with $R$ in place of $r'$.
:::

### Stretch

Combine this chapter with chapter 2.6. Move the Gaussian blob of the last section to the point $(0, 0, d)$ on the
$z$ axis. Show that its projection along $z$ does not change, find what in its three-dimensional transform carries $d$,
and explain why a projection along $x$ reveals $d$.

::: solution
Along $z$ the shift only moves the interval of integration, so $P$ is the same, and the projection cannot tell where on
the line the blob sits. Shifting a pattern by $d$ along $z$ multiplies its transform by $e^{-ik_zd}$, so $\tilde j =
e^{-\varepsilon^2k^2/2}e^{-ik_zd}$. On the slice $k_z = 0$ of the projection along $z$ that factor is 1, and $d$ is
lost. The projection along $x$ gives the slice $k_x = 0$, which contains every $k_z$, so the factor $e^{-ik_zd}$ appears
in it: that projection is a Gaussian centred at $z = d$.
:::

### The paper

Derive [](/paper/#eq:abel) from [](/paper/#eq:column) and [](/paper/#eq:abel-inverse) from [](/paper/#eq:abel). Then
reproduce the grazing angles of Figure [](/paper/#fig:earth-glow), $11^\circ$, $33^\circ$ and $63^\circ$, from the radii
1222, 3480 and 5701 km.

::: solution
The first two follow the first and third sections: $b = R\sin\theta$, $r^2 = b^2 + s^2$ and $\dd s = r\,\dd
r/\sqrt{r^2 - b^2}$ give the transform; weighing by $b/\sqrt{b^2 - r^2}$, exchanging the order, the inner integral
$\pi/2$, a derivative and one integration by parts give the inversion. The angles are $\arcsin(1222/6371) = 11.1^\circ$,
$\arcsin(3480/6371) = 33.1^\circ$ and $\arcsin(5701/6371) = 63.5^\circ$.
:::
:::

::: paper
- [Section IX](/paper/#sec:first-image), in its plain words *Seeing the layers from one place*, and
  [*Recovering the layers*](/paper/#par:recovering-the-layers): [](/paper/#eq:abel) and [](/paper/#eq:abel-inverse), the
  kinks, onion peeling, and the friction behind the heights, [](/paper/#eq:jN-friction).
- Figures [](/paper/#fig:earth-glow), [](/paper/#fig:earth-inverted) and [](/paper/#fig:sun-at-midnight): the curve with
  its steep rises, which the paper calls steps, at the grazing angles, and the layers recovered from a lifetime of counts.
- [*What breaks the tie*](/paper/#par:what-breaks-the-tie) in Section IV: the glow would show the nugget, the flush and the
  skin of Figure [](/paper/#fig:same-outside) as a spot, a gradient and a ring.
- [*Three dimensions*](/paper/#par:three-dimensions) in Section VIII: images from several places combine into a map of the
  glow, as the projection–slice theorem says.
- [*A mass that passes*](/paper/#par:a-mass-that-passes) in Section XIII, [](/paper/#eq:pass), and the appendix's
  [*What the passes of a mass determine*](/paper/#par:what-the-passes-of-a-mass-determine): the mass per area projected
  along a path, whose transform is the density's on a slice, so that paths whose directions all lie in one plane fix the
  density (chapter 13.2).
:::

::: deeper
- C. J. Dasch, "One-dimensional tomography: a comparison of Abel, onion-peeling, and filtered backprojection methods"
  [@Dasch1992]: the inversion and the peeling of this chapter compared on noisy data.
- R. N. Bracewell, *The Fourier Transform and Its Applications* (3rd edition, McGraw-Hill, 2000), the chapter on the
  Abel and Hankel transforms: how the Abel transform sits beside the Hankel transform of chapter 3.6.
- F. Natterer, *The Mathematics of Computerized Tomography* (SIAM, 2001), chapter 2: the projection–slice theorem and
  the ways of inverting projections, including what a real scanner with finitely many noisy views must add, for the
  reader who wants the last section in full.
:::

::: history
### From Abel to the scanner

Niels Henrik Abel published the solution of the integral of this chapter in Norwegian in 1823, in the *Magazin for
Naturvidenskaberne*, and in German in 1826, as "Auflösung einer mechanischen Aufgabe" (*Journal für die reine und
angewandte Mathematik* 1). He found the shape of a slope from the time a bead takes to slide down it. Johann Radon
showed in 1917 that a function on the plane is fixed by its integrals along all lines. Allan Cormack worked out the
mathematics of the X-ray scanner and Godfrey Hounsfield built one, both without knowing Radon's paper, and they shared
the Nobel Prize in Physiology or Medicine in 1979.
:::

[^R]: Chapter 5.5 wrote the Earth's radius $R_\oplus$, because its $R$ was the radius of a lens. In this chapter $R$ is
    always the radius of the planet or the ball.

[^theta]: This $\theta$ is not the angular size of chapter 1.4, the unknown of a scene of chapter 3.3, or the angle from
    the axis of chapter 5.3.

[^b]: The letter $b$ is the paper's, and chapter 5.5's for a lens. Chapter 1.8 writes the impact parameter of a passing
    mass as $B$. This $b$ is not the spacing of pixels of chapter 5.3 and the paper's Appendix A, nor the distance $b$ at
    which a line of sight leaves the ball in chapter 2.8.

[^s]: The paper's [](/paper/#eq:column) measures $s$ from the pixel. Moving the origin along a line changes only the
    limits of the integral, not its value. This $s$ is not the nugget's distance $s$ of chapter 2.5.

[^units]: The units agree: $j_N$ is per cubic metre, $r\,\dd r/\sqrt{r^2 - b^2}$ is a length, and $N$ is per square
    metre.

[^units2]: The units agree: $\dd N/\dd b$ is per cubic metre, like $j_N$, and $\dd b/\sqrt{b^2 - r^2}$ is a pure number.

[^t]: This $t$ is a thickness, not a time, and not chapter 2.5's ratio $t = sr/R^2$.

[^u]: Here $u$ is $b^2$, not the field $u$ of chapter 5.1.

[^P]: This $P$ is a projection, not the Poisson kernel $P$ of chapter 2.5.

[^eps]: As in chapter 2.6, $\varepsilon$ is a width here, not the Levi-Civita symbol.
