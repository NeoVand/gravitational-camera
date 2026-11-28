---
id: '5.6'
title: 'Pictures from line integrals: the Abel transform'
question: 'A camera at one place on the surface of a round planet can still see its inside layer by layer, and the angle of each kink depends only on the radius of that boundary, not on the friction or the temperature. How can one viewpoint recover a round planet''s layers?'
part: '5'
requires: ['1.3', '2.5', '2.6', '5.5']
paper: [sec:first-image, eq:column, eq:abel, eq:abel-inverse, fig:sun-at-midnight, fig:earth-glow, fig:earth-inverted, sec:near-field, fig:same-outside, sec:one-pixel, sec:second-order, eq:pass, app:proofs]
figures: [fig:sun-at-midnight, fig:earth-glow, fig:earth-inverted]
live: [onion-peel]
depth: A
---

A medical scanner needs views from all round a patient. A camera on the night side of the Earth, looking down, reads the
Earth's layers from this one place, and finds each boundary at an angle that no friction or temperature can move. Both
facts come from an integral studied by Abel, and from the fact that it can be undone.

{{paper fig:sun-at-midnight}}

::: plain
A camera on the ground that looks down at a slant sends its line of sight through the planet along a straight chord. A
steep line passes close to the centre and crosses every layer. A shallow line stays far from the centre and crosses only
the outer layers. If the planet is round, the brightness of a line depends only on how close it passes to the centre.

So the brightness against the angle of the line holds the glow of every layer. The shallowest lines cross only the crust
and give its glow. The next lines cross the crust and one more layer; the crust is now known, so they give that layer's
glow. Working inward peels the planet like an onion.

Each boundary between two layers leaves a sharp corner in the brightness, at the angle at which the line first touches
that boundary. That angle depends only on the radius of the boundary, so the camera measures the radii by geometry alone.
A planet that is not round would need cameras at many places.
:::

## From the surface of a round planet, each line of sight is a chord

We want the brightness of one pixel of a camera on the surface of a round planet, as a function of the direction in which
it looks. Let $R$ be the planet's radius, in metres. The pixel looks down at the angle $\sym{nadir-angle}{\theta}$
from straight down, where straight down points at the centre. We assume that **the glow depends only on the
distance from the centre**, so that the number emissivity of section 5.5 is a function $\sym{number-emissivity}{j_N}(r)$
of the radius $r$ alone, in gravitons $\mathrm{s^{-1}\,m^{-3}\,sr^{-1}}$. We also assume that **nothing beyond the planet
glows along the lines we use**: the Sun does shine through the Earth, so its path across the ground must be masked. Almost
nothing absorbs (section 5.5), so the brightness of a line is the sum of the glow along it.

**The impact parameter.** Drop the perpendicular from the centre $O$ onto the line of sight, and call its foot $M$, the
point of the line nearest the centre. The camera $C$, the centre and $M$ form a triangle with a right angle at $M$. Its
side $OC$ has the length $R$ and meets the line at the angle $\theta$, so the side $OM$ has the length

$$\sym{line-impact-parameter}{b} = R\sin\theta .$$

This is the line's impact parameter, the distance by which it misses the centre (section
[1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick)). Looking straight down, $\theta = 0$ and $b = 0$; a line along the horizon has
$\theta = 90^\circ$ and $b = R$.

**The chord.** The straight piece of the line inside the planet is a **chord**. By symmetry $M$ is its midpoint, and its
length is $2\sqrt{R^2 - b^2} = 2R\cos\theta$. Let $s$ be the distance along the chord from $M$, in metres. A point of
the chord, $M$ and $O$ form another right triangle, so Pythagoras's theorem gives the point's distance from the centre
(Figure [](#fig:abel-chords)):

$$r^2 = b^2 + s^2 .$$

![Look first at the line whose distance $b$ from the centre is drawn: from the camera at the top it misses the centre by
its impact parameter $b = R\sin\theta$ and crosses the planet along a chord whose midpoint is $M$. A point of the chord at
the distance $s$ from $M$ lies at the radius $r$, with $r^2 = b^2 + s^2$. The three lines are drawn at $11.1^\circ$,
$33.1^\circ$ and $63.5^\circ$ from straight down, where they graze the inner core, the core and the lower mantle of a
model Earth, drawn to scale; the outer shell holds the upper mantle and the crust.](tut-abel-chords){#fig:abel-chords}

**The integral.** The line's number radiance $\sym{chord-brightness}{N(b)}$ of section 5.5, in gravitons
$\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$, is the sum of $j_N$ along it. The two halves of the chord pass through the same
radii, so they add the same amount, and

$$N(b) = 2\int_0^{\sqrt{R^2 - b^2}} j_N\bigl(\sqrt{b^2 + s^2}\,\bigr)\,\dd s .$$

We change the variable from $s$ to $r$. Along one half, $r$ grows from $b$ to $R$ as $s$ grows from 0 to $\sqrt{R^2 -
b^2}$. Differentiating $r^2 = b^2 + s^2$ at a fixed $b$ gives $2r\,\dd r = 2s\,\dd s$, and $s = \sqrt{r^2 - b^2}$, so

$$\dd s = \frac{r\,\dd r}{\sqrt{r^2 - b^2}} .$$

With this the brightness becomes

$$\boxed{N(b) = 2\int_b^R \frac{j_N(r)\,r\,\dd r}{\sqrt{r^2 - b^2}} .} \label{eq:abel-transform}$$

The brightness as a function of the impact parameter is called the **Abel transform** of the glow as a function of the
radius.[^units] The weight $r/\sqrt{r^2 - b^2}$ says how long the chord stays near each radius. Near $r = b$ the chord
runs along the sphere of that radius, so it lingers there, and the weight grows without bound; its integral stays
finite, because $\int\dd r/\sqrt{r - b}$ is finite.[^abel]

**A uniform ball.** Let $j_N$ be the same value $j$ at every radius. Since $\dd\sqrt{r^2 - b^2}/\dd r = r/\sqrt{r^2 -
b^2}$, the integral is $\sqrt{R^2 - b^2}$, and

$$N(b) = 2j\sqrt{R^2 - b^2} ,$$

the length of the chord times $j$, as for a uniform slab in section 5.5. Straight down through the Earth, with $R =
6371\unit{km}$, it is the diameter, 12,742 km.

## Gold in a steel ball would glow as a spot, a dome or a ring

The same integral holds for a camera far outside a round body: its lines of sight are parallel, and each crosses the body
along a chord, with $b$ set by where the line meets the picture.

The three steel balls of section 2.5 hold the same extra mass of gold, as a small nugget, as a flush spread through the
ball, and as a thin skin on the surface, and their fields outside are the same. Their glow can tell them apart, as a
spot, a gradient and a ring, if we assume that **the gold glows and the steel does not**. The nugget of section 2.5 sits
halfway out, so its bodies are not round; we put it at the centre instead. Then the flush is the gold spread evenly
through the ball, and the skin a layer of even thickness
([section 2.5](/tutorial/outside/null-space/#the-harmonic-part-of-a-nugget-is-a-flush-on-the-near-wall)). All three are
round, and [](#eq:abel-transform) gives their pictures (Figure [](#fig:abel-three-glows)).

- The nugget, a small ball, glows only on the lines that pass through it, those whose $b$ is smaller than its radius: a
  small bright spot.
- The flush is the uniform ball, $N = 2j\sqrt{R^2 - b^2}$: a dome, brightest through the middle and fading to nothing at
  the edge.
- The skin fills the radii from $R - t$ to $R$, with $t$ its thickness. By [](#eq:abel-transform), with $j_N = j$ in
  the skin and zero inside it, a line with $b < R - t$ has
  $$N = 2j\Bigl[\sqrt{R^2 - b^2} - \sqrt{(R - t)^2 - b^2}\,\Bigr] .$$

Through the middle, $b = 0$, the skin gives $N = 2jt$: the line crosses the thickness twice. At $b = R - t$ the line
touches the inside of the skin and runs within it along its whole chord, so $N = 2j\sqrt{2Rt - t^2} \approx 2j\sqrt{2Rt}$.
This line is the brightest of all, $\sqrt{2R/t - 1}$ times as bright as the middle: for a skin a millimetre thick on a
steel ball of radius 10 cm, $\sqrt{199} = 14$ times, a thin bright ring round a faint disc.

The glow measures friction and temperature, not mass, so these pictures show the gold only if it glows differently from
the steel.

![Look first at the right-hand curve: a thin glowing skin is faint through the middle and bright at the rim, where the
line runs along the skin. The three bodies of section 2.5 with the nugget at the centre, if only the gold glows. Under
each, $N$ is the brightness of the line of sight at the impact parameter $b$; each curve is scaled to its own maximum,
and the skin is drawn $0.05R$ thick (its rim is then 6.2 times as bright as its
middle; for $0.01R$, 14 times).](tut-abel-three-glows){#fig:abel-three-glows}

## The transform can be undone

We want $j_N(r)$ back from the curve $N(b)$, because the camera measures the curve and the layers are what we want to
know. We assume that **$N(b)$ is known for every $b$** and that **$j_N$ is finite**, with at most a few jumps.

The plan is to turn the curve into an integral of $j_N$ alone over the radii outside a chosen radius $r$, because the
derivative of such an integral with respect to its lower limit gives back the integrand, with a minus sign. Abel's weight
$b/\sqrt{b^2 - r^2}$ does this: once the order of integration is exchanged, the inner integral is the same number for
every pair of radii.

**Step 1: weigh and add.** For a chosen radius $r$, we multiply $N(b)$ by $b/\sqrt{b^2 - r^2}$ and add over the lines that
pass outside that radius, from $b = r$ to $R$. We put in [](#eq:abel-transform), whose radius we rename $r'$:

$$\begin{aligned}\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} &= 2\int_r^R \frac{b}{\sqrt{b^2 - r^2}}\\
&\qquad\left[\int_b^R \frac{j_N(r')\,r'\,\dd r'}{\sqrt{r'^2 - b^2}}\right]\dd b .\end{aligned}$$

**Step 2: exchange the order.** The double integral covers the pairs $(b, r')$ with $r \le b \le r' \le R$. We can
integrate first over $b$ from $r$ to $r'$ and then over $r'$ from $r$ to $R$, which covers the same pairs:

$$\begin{aligned}\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} &= 2\int_r^R j_N(r')\,r'\\
&\qquad\left[\int_r^{r'}\frac{b\,\dd b}{\sqrt{(b^2 - r^2)(r'^2 - b^2)}}\right]\dd r' .\end{aligned}$$

**Step 3: the inner integral is $\pi/2$**, whatever $r$ and $r'$ are (the box below shows this). So

$$\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} = \pi\int_r^R j_N(r')\,r'\,\dd r' .$$

**Step 4: differentiate with respect to $r$.** The right side depends on $r$ only through its lower limit, so its
derivative is $-\pi\,j_N(r)\,r$, and

$$j_N(r) = -\frac{1}{\pi r}\,\frac{\dd}{\dd r}\int_r^R \frac{N(b)\,b\,\dd b}{\sqrt{b^2 - r^2}} .$$

This already undoes the transform. One integration by parts, in the box, moves the derivative onto $N$:

$$\boxed{j_N(r) = -\frac{1}{\pi}\int_r^R \frac{\dd N}{\dd b}\,\frac{\dd b}{\sqrt{b^2 - r^2}} ,} \label{eq:abel-inversion}$$

the **Abel inversion**.

::: derivation
### The inner integral, and the form with the slope

**The inner integral.** We put $u = b^2$, so that $\dd u = 2b\,\dd b$. The integral becomes

$$\int_r^{r'}\frac{b\,\dd b}{\sqrt{(b^2 - r^2)(r'^2 - b^2)}} = \frac12\int_{r^2}^{r'^2}\frac{\dd u}{\sqrt{(u - r^2)(r'^2 -
u)}} .$$

We put $u = r^2 + (r'^2 - r^2)\sin^2\varphi$, with $\varphi$ from 0 to $\pi/2$. Then $u - r^2 = (r'^2 -
r^2)\sin^2\varphi$, $r'^2 - u = (r'^2 - r^2)\cos^2\varphi$ and $\dd u = 2(r'^2 -
r^2)\sin\varphi\cos\varphi\,\dd\varphi$. The square root is $(r'^2 - r^2)\sin\varphi\cos\varphi$, so the integrand
becomes $2\,\dd\varphi$ and the integral over $u$ is $\pi$. Half of it is $\pi/2$.

**The form with the slope.** We integrate by parts in $b$, using $\dd\sqrt{b^2 - r^2}/\dd b = b/\sqrt{b^2 - r^2}$:

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
$N(b)$ from [](#eq:abel-transform) numerically and putting its slope into [](#eq:abel-inversion) returns 3.000000 at
$r = 0.3R$ and 1.000000 at $r = 0.8R$, to six figures.

**What it means.** The glow at the radius $r$ comes only from the slope of the curve on the lines that pass outside $r$:
the inside never affects a line that misses it. One viewpoint is enough because the planet's symmetry supplies the other
viewpoints that tomography would need: every camera on a round planet sees the same curve.

## A boundary shows as a kink at an angle that only geometry sets

What does a boundary between two layers do to the curve? Let $j_N$ jump at the radius $r_0$, so that it is larger on the
inner side of $r_0$ than on the outer side by $\Delta j$, in the same unit. We write the glow as a part with no jump at
$r_0$ plus a uniform ball of glow $\Delta j$ and radius $r_0$. A line with $b < r_0$ crosses that ball along a chord, so
by the uniform ball of the first section the ball adds

$$\Delta N(b) = 2\,\Delta j\sqrt{r_0^2 - b^2}$$

for $b < r_0$, and nothing for $b > r_0$. This part is zero at $b = r_0$, so the curve has no jump there. Its slope is

$$\begin{aligned}\frac{\dd\,\Delta N}{\dd b} &= -\frac{2\,\Delta j\,b}{\sqrt{(r_0 - b)(r_0 + b)}}\\
&\approx -\Delta j\sqrt{\frac{2r_0}{r_0 - b}} ,\end{aligned}$$

where the second form holds for $b$ near $r_0$. The slope grows without bound as $(r_0 - b)^{-1/2}$ as $b$ approaches
$r_0$ from below. The curve has a **kink** there: it stays continuous, but its slope changes abruptly, here from a finite
value outside the boundary to an infinite one inside. The kink lies at the line that grazes the boundary, where $b = r_0$
(Figure [](#fig:abel-kink)), at the angle

$$\boxed{\sin\theta = \frac{r_0}{R} .}$$

**Numbers.** For a model Earth with $R = 6371\unit{km}$, the top of the inner core, at 1222 km, shows at $11.1^\circ$ from
straight down; the top of the core, at 3480 km, at $33.1^\circ$; the top of the lower mantle, at 5701 km, at $63.5^\circ$.
At an equinox the line toward the Sun's core is $40^\circ$ from straight down, so it passes $6371\sin 40^\circ = 4095\unit{km}$ from the centre, outside the core.

**Steep, but continuous.** The square root makes the edge sharp. A line that passes only 1 km inside the core's edge,
$0.011^\circ$ steeper than the grazing line, already runs $2\sqrt{2 \times 3480 \times 1} = 167\unit{km}$ through the
core, and a line 10 km inside runs 527 km. In the model the brightness doubles between $63.5^\circ$ and $63^\circ$, so at the scale of the figure below the
continuous rise after each kink looks almost like a step.

{{paper fig:earth-glow}}

If the inner layer is the fainter one, $\Delta j$ is negative and the curve bends the other way, but the kink stays at
the same angle; if $\Delta j = 0$, it disappears.

**What it means.** A kink lies where a line first touches a boundary, which depends on that boundary's radius alone. The
friction and the temperature set $\Delta j$ (section 5.5), and the exposure sets how many gravitons are counted, so they
change only how high the curve climbs at the kink. Their places are geometry.

![Look first at the inset: close inside the boundary the brightness rises with a vertical tangent, and the corner sits
exactly at the line that grazes the boundary. At the scale of the main plot this continuous rise looks almost like a step.
The curve is exact for a planet glowing three times as brightly inside $0.6R$ as outside; only the height of the rise,
not its place, depends on the glow.](tut-abel-kink){#fig:abel-kink}

## Uniform shells are peeled from the outside in

For a planet made of a few uniform shells the inversion becomes arithmetic. Number the shells $1, 2, \dots$ from the
outside in, with shell $k$ between the radii $R_k$ and $R_{k-1}$, where $R_0 = R$, and let $j_k$ be its glow. By the
uniform ball, the line with impact parameter $b$ runs through shell $i$ for the total length

$$L_i(b) = 2\Bigl[\sqrt{R_{i-1}^2 - b^2} - \sqrt{R_i^2 - b^2}\,\Bigr] ,$$

in two pieces, one on each side of $M$. A square root of a negative number is read as zero, because the line then misses
that sphere. The brightness is the sum $N(b) = \sum_i j_i\,L_i(b)$.

**The peeling.** The line that grazes the bottom of shell 1, at $b = R_1$, crosses only shell 1, so $j_1 =
N(R_1)/L_1(R_1)$. The line that grazes the bottom of shell 2, at $b = R_2$, crosses shells 1 and 2. Now $j_1$ is known, so

$$j_2 = \frac{N(R_2) - j_1\,L_1(R_2)}{L_2(R_2)} ,$$

and so on inward: each new line adds one shell and one unknown. This is **onion peeling**, the method used to find the
glow inside flames and plasmas [@Dasch1992]. For the planet of the last section, the line at $b = 0.6R$ crosses only the
outer shell, along $2\sqrt{1 - 0.36}\,R = 1.6R$, and its brightness is $1.6R$ (in units of the glow times a length), so
$j_1 = 1$. The line straight down crosses the outer shell along $0.8R$ and the inner one along $1.2R$, with the
brightness $4.4R$. Taking away the outer shell's $0.8R$ leaves $3.6R$, and $j_2 = 3.6/1.2 = 3$.

**Errors grow inward.** Each step subtracts the shells above it, with their errors. Take five shells of equal
width $R/5$, all glowing equally, and let each grazing line's brightness be measured to 1%, with independent errors.
Carrying the errors through the peeling gives the five glows to 1.0, 1.6, 2.2, 3.1 and 5.8%, from the outside in (Figure
[](#fig:abel-peel)): the centre is known six times less well than any single reading.

These errors belong to the peeling. A real record is a set of counted gravitons, and the better method fits every shell
at once. We sort the gravitons that a detector of one square metre, collecting from every direction, counts in eighty
years into ninety rings of one degree about straight down. The expected count $\mu_i$ in ring $i$ is the exposure, in
square metre seconds, times the integral of $N(\theta)$ over the ring's solid angle, and for given radii and glows the
uniform shells give it in closed form. The counts are Poisson numbers (section
[3.1](/tutorial/noise/probability/)), so the probability of the record is $\prod_i\mu_i^{n_i}e^{-\mu_i}/n_i!$ for the
counts $n_i$. We choose the nine unknowns, the five glows and the four inner radii (the planet's own radius is known),
that make this probability largest: the **maximum-likelihood fit**. The maximum is found by Newton's method, with the
Fisher matrix of section [3.3](/tutorial/noise/measuring-a-number/) as the curvature, and the square roots of the
diagonal of its inverse are the errors. For one simulated record of a model Earth whose glows are set at the most its
materials allow (section [R10b](/tutorial/glow/reading-section-ix/#a-lifetime-places-the-edge-of-the-core-to-29-km)),
35,619 gravitons in all, the fit returns the radii $1281 \pm 41$, $3499 \pm 28$, $5709 \pm 5$ and $6350 \pm 3$ km,
against the model's 1222, 3480, 5701 and 6346 km.[^fit] Each lies within two standard deviations of the truth, as a
fair draw should, and the core's error of 28 km is close to the 29 km that the Fisher information forecasts before any
draw. The errors follow how many gravitons each shell sends, not the order of a peeling: of the radii, the inner core's,
seen only within $11^\circ$ of straight down, is the least certain, and the thin crust, which sends about a dozen of
the gravitons, has its glow known only to about 50%.

{{paper fig:earth-inverted}}

![Look first at the error bars: each brightness is measured to 1%, yet the glow comes out less certain at every step
inward, because each step subtracts the shells already found. Five equal shells of equal glow; the errors are carried
exactly through the peeling and drawn ten times their size. A joint fit, not a peeling, gives the errors of the
recovered Earth.](tut-abel-peel){#fig:abel-peel}

::: try {#onion-peel}
On the left, a round planet in section with up to five shells, the camera at the top and one line of sight, which you drag
or turn with the arrow keys; beside it, a bar shows how long the line runs in each shell. On the right, the brightness
against the angle from straight down, with a dotted line at every boundary's grazing angle. The sliders set each shell's
glow, and the boundaries can be dragged. *Peel* draws the recovered glows over the true ones; the noise control adds
Poisson noise for a chosen number of counted gravitons. The presets are a model Earth, the gold in a steel ball, and the
two shells of the inversion's example.

Answer the predictions at the top of the figure, then do what each asks. Afterwards, turn the noise on for the model
Earth and see which shell comes back least certain, and why.
:::

## A body that is not round needs views from many directions

Without the round symmetry, the brightness of a line depends on more than $b$, and one camera's curve no longer fixes the
inside. Departures from round, such as the planet's flattening and the slabs and plumes of its mantle, need cameras at
several places: this is **tomography**, the recovery of a body's inside from line integrals through it in many
directions, as a medical scanner does.

Take a camera far away, whose parallel lines of sight run along the unit vector $\hat n$. Let $\vect a$ be the point where
a line crosses the plane through the origin at right angles to $\hat n$. The brightnesses of all these lines form a
**projection** of the body along $\hat n$,

$$P(\vect a) = \int j_N(\vect a + s\hat n)\,\dd s .$$

We use the transform of section 2.6 in three dimensions: $\tilde j(\vect k) = \int j_N(\vect x)\,e^{-i\vect k\cdot\vect
x}\,\dd^3x$, with $\vect k$ a wavevector in $\mathrm{m^{-1}}$. For a wavevector $\vect K$ that lies in the plane, so that
$\vect K\cdot\hat n = 0$, the projection's transform on the plane is

$$\begin{aligned}\tilde P(\vect K) &= \int P(\vect a)\,e^{-i\vect K\cdot\vect a}\,\dd^2a\\
&= \int\!\!\int j_N(\vect a + s\hat n)\,e^{-i\vect K\cdot\vect a}\,\dd s\,\dd^2a .\end{aligned}$$

Every point of space is $\vect x = \vect a + s\hat n$ for one $\vect a$ and one $s$, with $\dd^3x = \dd^2a\,\dd s$, and
$\vect K\cdot\vect x = \vect K\cdot\vect a$ because $\vect K\cdot\hat n = 0$. So the double integral is the body's own
transform:

$$\boxed{\tilde P(\vect K) = \tilde j(\vect K)}$$

for every $\vect K$ with $\vect K\cdot\hat n = 0$.

This is the **projection–slice theorem**: a projection along $\hat n$ gives the body's transform on a slice through the
origin, the plane of wavevectors at right angles to $\hat n$.

**A check.** Let $j_N = \delta_\varepsilon(x)\,\delta_\varepsilon(y)\,\delta_\varepsilon(z)$, a blob
made of the Gaussian of width $\varepsilon$ of section 2.6 along each axis. Along $\hat n = \hat z$, the integral
$\int\delta_\varepsilon(z)\,\dd z = 1$ leaves the projection $P = \delta_\varepsilon(x)\,\delta_\varepsilon(y)$. The factor
$e^{-i\vect k\cdot\vect x}$ splits into one factor for each axis, so the pair $\tilde\delta_\varepsilon(k) =
e^{-\varepsilon^2k^2/2}$ gives $\tilde P = e^{-\varepsilon^2(K_x^2 + K_y^2)/2}$ and $\tilde j = e^{-\varepsilon^2(k_x^2 +
k_y^2 + k_z^2)/2}$, which agree at $k_z = 0$.

**Many directions.** Every wavevector $\vect k$ lies on the slice of each direction at right angles to it. The directions
of one plane, as from a camera carried once round the body, include such a direction for every $\vect k$, because that
plane and the plane at right angles to $\vect k$ both pass through the origin and so share a line. These projections give
$\tilde j$ everywhere, and the inverse transform of section 2.6 gives the body. For a round body $\tilde j$ depends only
on the length of $\vect k$, so one projection is enough.

**The idea to keep: from the surface of a round planet each line of sight is a chord, and the brightness against the
angle is the Abel transform of the glow against the radius. It can be undone, so one viewpoint sees the layers, and each
boundary shows as a kink at $\sin\theta = r_0/R$, an angle that geometry alone sets.**

::: problems
### Practice

**[5.6]** For a uniform ball of glow $j$ and radius $R$, find $N(b)$ and its slope, and check that [](#eq:abel-inversion)
returns $j$ at every radius $r < R$.

::: solution
From the first section, $N = 2j\sqrt{R^2 - b^2}$, so $\dd N/\dd b = -2jb/\sqrt{R^2 - b^2}$. Then

$$j_N(r) = \frac{2j}{\pi}\int_r^R\frac{b\,\dd b}{\sqrt{(R^2 - b^2)(b^2 - r^2)}} = \frac{2j}{\pi}\cdot\frac{\pi}{2} = j ,$$

by the inner integral of the box, with $R$ in place of $r'$.
:::

**[5.6]** Why do the places of the kinks not depend on the friction or the temperature?

::: solution
A kink lies where a line first touches a boundary, which depends only on the boundary's radius. The friction and the
temperature set the jump in the glow, and so only how high the curve climbs.
:::

**[5.6]** Why is a thin glowing skin brightest near its edge, and by how much for a skin $t$ thick on a ball of radius $R$?

::: solution
The line that touches the inside of the skin runs along it for a length of about $2\sqrt{2Rt}$, while the line through
the middle crosses only $2t$. The ratio is about $\sqrt{2R/t}$, 14 for $t = R/100$.
:::

### Stretch

**[5.6]** Combine this section with section 2.6. Move the Gaussian blob of the last part to the point $(0, 0, d)$ on the
$z$ axis. Show that its projection along $z$ does not change, find what in its three-dimensional transform carries $d$,
and explain why a projection along $x$ reveals $d$.

::: solution
Along $z$ the shift only moves the interval of integration, so $P$ is the same, and the projection cannot tell where on
the line the blob sits. Shifting a pattern by $d$ along $z$ multiplies its transform by $e^{-ik_zd}$, so $\tilde j =
e^{-\varepsilon^2k^2/2}e^{-ik_zd}$. On the slice $k_z = 0$ of the projection along $z$ that factor is 1, and $d$ is lost.
The projection along $x$ gives the slice $k_x = 0$, which contains every $k_z$, so the factor $e^{-ik_zd}$ appears in it:
that projection is a Gaussian centred at $z = d$.
:::

**[5.6]** Put the nugget back halfway out, $s = R/2$, on the $z$ axis, and look at the three steel balls from far away
along $x$, across the line from the centre to the nugget, with only the gold glowing in proportion to its density.
Using the closed form of the flush in section
[2.5](/tutorial/outside/null-space/#the-harmonic-part-of-a-nugget-is-a-flush-on-the-near-wall), integrate it numerically along
the lines of sight that cross the picture's $z$ axis at $z = -R/2$, $0$, $R/2$ and $0.9R$, and compare with the
centred nugget's dome. What do the nugget and the skin look like?

::: solution
In units of $\matter m/4\pi R^2$ the flush's brightness is $0.80$, $3.80$, $12.0$ and $24.1$ at the four points; it
peaks at $24.1$ near $z = 0.89R$, falls to zero at the rim on the nugget's side, and is very slightly negative,
$-0.002$, near the opposite rim, where the flush dips below zero. The dome of the centred nugget is $5.20$, $6.00$,
$5.20$ and $2.62$ there, the same on both sides. So the off-centre flush is a gradient, fifteen times brighter at
$z = R/2$ than at $z = -R/2$, and not a dome. As a check, its brightness integrated over the disc is $4\pi$ in these
units, so that it holds the mass $\matter m$. The nugget is a small spot at $z = R/2$, off the middle of the disc. The
skin, of surface density $\matter m(R^2 - s^2)/4\pi R|\vect x - \vect s|^3$, is a ring, brightest at the rim and far
brighter on the nugget's side: its brightness is $16.6$ at $z = 0.9R$ against $1.09$ at $z = -0.9R$, in the same unit.
:::

### The camera

**[5.6]** Find the grazing angles of the boundaries at 1222, 3480 and 5701 km in a planet of radius 6371 km.

::: solution
The angles are $\arcsin(1222/6371) = 11.1^\circ$, $\arcsin(3480/6371) = 33.1^\circ$ and
$\arcsin(5701/6371) = 63.5^\circ$.
:::
:::

::: paper
- [Section IX](/paper/#sec:first-image), *Seeing the layers from one place*, and
  [*Recovering the layers*](/paper/#par:recovering-the-layers): [](/paper/#eq:abel) and [](/paper/#eq:abel-inverse), the
  kinks, onion peeling, and the friction behind the heights, [](/paper/#eq:jN-friction). Figures
  [](/paper/#fig:earth-glow), [](/paper/#fig:earth-inverted) and [](/paper/#fig:sun-at-midnight) draw the curve with its
  kinks and the layers recovered from a lifetime of counts.
- [*What breaks the tie*](/paper/#par:what-breaks-the-tie) in Section IV: the nugget, the flush and the skin of Figure
  [](/paper/#fig:same-outside) as a spot, a gradient and a ring.
- [*Three dimensions*](/paper/#par:three-dimensions) in Section VIII: images from several places combine into a map of
  the glow.
- [*A mass that passes*](/paper/#par:a-mass-that-passes), [](/paper/#eq:pass), and the appendix's
  [*What the passes of a mass determine*](/paper/#par:what-the-passes-of-a-mass-determine): section
  [13.1](/tutorial/what-a-field-keeps/push-and-pass/#passes-along-one-great-circle-of-directions-give-the-density).
:::

::: deeper
- C. J. Dasch [@Dasch1992] compares the inversion and the peeling of this section on noisy data.
- R. N. Bracewell, *The Fourier Transform and Its Applications* (3rd edition, McGraw-Hill, 2000): the Abel transform
  beside the Hankel transform of section 3.6.
- F. Natterer, *The Mathematics of Computerized Tomography* (SIAM, 2001), chapter 2: the projection–slice theorem.
:::

::: history
### From Abel to the scanner

Niels Henrik Abel published the solution of the integral of this section in Norwegian in 1823, and in German in 1826
(*Journal für die reine und angewandte Mathematik* 1). He found the shape of a slope from the time a bead takes to slide
down it. Johann Radon showed in 1917 that a function on the plane is fixed by
its integrals along all lines. Allan Cormack worked out the mathematics of the X-ray scanner and Godfrey Hounsfield built
one, both without knowing Radon's paper, and they shared the Nobel Prize in Physiology or Medicine in 1979.
:::





[^units]: The units agree: $j_N$ is per cubic metre, $r\,\dd r/\sqrt{r^2 - b^2}$ is a length, and $N$ is per square
    metre.

[^abel]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX, as its equations [](/paper/#eq:abel) and
    [](/paper/#eq:abel-inverse).

[^units2]: The units agree: $\dd N/\dd b$ is per cubic metre, like $j_N$.



[^fit]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX, in its Fig.
    [](/paper/#fig:earth-inverted).



