---
id: '0.2'
title: 'Seeing mass through walls, and why the picture blurs'
question: 'A camera that feels the pull of mass sees through any wall. Why, then, can it never draw a sharp picture of what is behind the wall?'
part: '0'
requires: ['0.1']
paper: [sec:near-field, eq:tidal-brightness, eq:tidal-column, eq:split, eq:evanescent, eq:wiener, eq:cutoff, eq:resolution, tab:resolution, fig:locked-safe, fig:same-outside, fig:nearfield, fig:resolution-law, fig:tremor]
figures: [fig:same-outside, fig:resolution-law]
live: [scene-locked-safe, same-outside, near-field-blur]
---

Two identical steel safes stand side by side, 3.5 m in front of a camera, and one of them holds a bar of gold of
324 kg. In ordinary light the two look alike, because light stops at the steel. The gravitational camera shows the
gold through the steel. This kind of seeing is done in the **near field**: close to the scene, where the camera feels
the steady pull of the masses in front of it.[^regimes]

Why, then, can the camera never draw a sharp picture of what is behind the wall? The pull outside a body cannot
settle how the mass inside is arranged, and fine detail in the pull fades with distance so fast that the camera's
noise hides it. Yet a blurred picture can still answer a simple question precisely, when the scene is simple and mass
is known never to be negative.

## The camera weighs what it sees, through anything

Each pixel measures the **tide**, the difference in the pull of gravity between nearby points. Every mass pulls as if
nothing else were there, so a wall between the camera and the gold adds its own pull and takes nothing away from the
gold's. The pull depends only on how much mass there is and where, so the camera in effect weighs what it
sees.[^newton]

The tide of a round body of mass $\matter M$ and radius $R$ at distance $r$ is proportional to its mean density
$\bar\rho$ (mass over volume) times the cube of its **angular size** $\theta$, its radius divided by its
distance:[^bright]

$$\frac{2G\matter M}{r^{3}} = \frac{8\pi G}{3}\,\bar\rho\,\theta^{3}, \qquad \theta = \frac{R}{r}.$$

The Moon, as wide in the sky as the Sun but 2.4 times denser, raises about twice the Sun's tide on the Earth.

The **line of sight** in a direction is the straight line from the camera in that direction. The tide of a small mass
falls as the cube of its distance, but a narrow cone around the line holds more matter farther out, in proportion to
the square of the distance. So each part of the line counts in proportion to its density divided by its distance. A
near-field picture is a map of this sum.[^column]

::: try {#scene-locked-safe}
Predict first: in gravity, will the empty safe vanish? Will the gold brighten its whole safe, or one place in it?
Drag the divider to the right edge for ordinary light, then to the left edge for gravity. Steel is mass too.
:::

## The outside of a body does not settle its inside

Take three steel balls, each holding the same gold: in the first a nugget halfway from the centre to the wall, in the
second spread through the ball, densest on the wall nearest the nugget's place, and in the third a skin on the
surface, thickest over that place. Outside, the three pull alike at every point, however close the camera comes.

{{paper fig:same-outside}}

The simplest case is Newton's **shell theorem**: a hollow shell and a solid ball of the same mass pull in exactly the
same way on everything outside them.[^shell] More generally, mass can be moved around inside a body in many ways
without changing its pull anywhere outside.[^split] A difference between two scenes that the camera cannot detect at
any sensitivity is a **blind spot**.

The second ball is the **flush** of the inside, the picture that assumes least: of all the arrangements with the same
pull outside, it has the smallest sum of the squares of its densities. Its densest and lightest points always lie on
the surface, so it can never show a dense core. The Earth, whose iron core averages about
$11{,}000\unit{kg\,m^{-3}}$, would appear as a uniform ball of $5513\unit{kg\,m^{-3}}$, its mean density.[^least]

Other measurements tell such bodies apart, because they depend on how far the mass lies from the centre. That spread
sets the **moment of inertia**, which says how hard a body is to set spinning.[^inertia] A spinning body adds to its
tide a magnetic part that depends on it,[^spin] and so does the trembling of a warm body's pull, caused by its jiggling
atoms.[^heat] Section [0.5](/tutorial/evening/what-the-outside-keeps/) tours these measurements.

::: try {#same-outside}
Predict first: of the five round bodies, which keeps the most energy from a brief tide applied from outside, a kick,
and which the least? Choose each in turn for B and read its row against the uniform ball, A. The order is the order of
how far the mass lies from the centre.
:::

## Fine detail fades with distance much faster than coarse detail

Any picture of buried masses can be built by adding up ripples, patterns of density that rise and fall in parallel
waves of every spacing, as a chord is built from pure notes.[^ripples] Take a slab whose density rises and falls like
a ploughed field, with crests 10 cm apart. Above the slab, the pull follows the same pattern but weakens with
height:

$$\Phi \propto \cos(kx)\,e^{-kz}.$$

Here $\sym{potential}{\Phi}$ is the gravitational potential, an energy per unit mass in joules per kilogram, whose
change from point to point is the pull, and $x$ is the position across the ripples, in metres. The **wavenumber** $k$,
in reciprocal metres, sets the spacing of the crests, $2\pi/k$, and $z$ is the height above the slab, in metres. The
factor $\cos(kx)$ is the ripple and $e^{-kz}$ is its fading. A finer ripple has a larger $k$ and fades faster, and
every ripple fades more with height. The fading follows from **Laplace's equation**, the rule that the potential obeys
in empty space.[^evanescent]

For crests 10 cm apart seen from 10 cm, $kz = 2\pi$, so the signal is $e^{2\pi} = 535$ times weaker than at the slab.
From 20 cm it is $e^{4\pi} = 2.9 \times 10^5$ times weaker, because doubling the height squares the factor.

![Two of the ripples that build the picture of a sandstone block with two iron balls in it, one three times finer than
the other, fade as they rise. The top row is what the pixels read, the ripple plus a noise as wide as the grey band:
the coarse ripple stands out of the noise and the fine one is lost. Heights stretched about ten times.](tut-ripples){#fig:ripples}

## The blur shrinks only with the number of digits of the sensitivity

Every instrument has **noise**, small random changes in its reading, present even when there is nothing to
measure. The **signal-to-noise ratio**, $\sym{snr}{\SNR}$, is the signal divided by the typical size of the noise, a
pure number. Here the signal is the strongest tide that one buried mass raises at the array of pixels, and the noise is
that of the readings averaged over a square patch whose sides are as long as the mass is deep.[^snr]

To recover a ripple, the camera must enlarge it by its fading factor, which enlarges the noise by the same factor, so
a ripple whose fading factor exceeds the signal-to-noise ratio is lost. The finest
ripple that survives sets the **blur**, the width of the camera's best picture of one point mass. Only the product $kz$
enters the fading, so the blur is an angle: for an array at least as wide as the scene is deep, it is the same fraction
of the distance at every distance. At a ratio of a thousand it is 42 cm for a scene one metre away, about the width of
a person's shoulders.

A first estimate is that the blur is about $\pi/\ln\SNR$ radians.[^law] At a ratio of a thousand,
$\pi/\ln 1000 = 3.14/6.91 = 0.45$ radians, or 26°. Each factor of ten adds only 2.3 to the natural logarithm of the ratio. The exact values differ a little:[^table]

- a signal-to-noise ratio of a thousand gives a blur of 24°;
- a million gives 14° (the estimate, 13°);
- $10^{30}$ still gives 3.4° (the estimate, 2.6°).

To match the human eye, which resolves a sixtieth of a degree, the camera would need a ratio of about $10^{6600}$. A
rough quantum estimate caps any camera watching a person at about $10^{70}$, which gives 1.5°: no camera of this kind
could draw a face.[^eye]

{{paper fig:resolution-law}}

The satellite GOCE measured the tide for four years, three of them from 254 km up. Its map corresponds to a ratio of
two to four thousand and a blur of 21° to 23°, near the first entry of the list.[^goce] The limit belongs to
Laplace's equation, not to the instrument, so cameras made of clocks or accelerometers follow the same law.[^sensors]

::: try {#near-field-blur}
Predict first: two masses, half their depth apart, show as two bumps at a ratio of a million. How far must the
sensitivity fall before they merge? Drag it down half a power of ten at a time.
:::

## A blurred picture can still give a precise measurement

If the scene holds one mass, the camera need not draw a picture: it fits the mass and its three coordinates to all
its data. At a ratio of a thousand and a distance of one metre, it places the mass to 1.3 mm
in depth and 0.8 mm across, although its picture is 24° wide.[^precision]

Now an array a metre square with 121 pixels looks at the safes, with the known room and the empty safes subtracted.
We ask three questions.

**Which safe?** At a ratio of 10, the readings expected in the two cases differ by 1.8 times the spread of the noise,
so the camera picks the wrong safe 18% of the time. At 34 it is wrong once in a thousand tries.[^which]

**How much gold, from a cautious picture?** A picture that assumes little, like the flush, weighs a safe
only to within $\pm 730\unit{kg}$ at a ratio of a thousand. It allows plus five hundred kilograms in one place with
minus five hundred spread round it, and the near field cannot see the difference.[^cautious]

**How much gold, if mass is never negative?** Requiring every part of the picture to hold a positive mass, the same
data find $315 \pm 20\unit{kg}$ in the right-hand safe and almost nothing in the left.[^positive]

{{paper fig:locked-safe}}

**The idea to keep: the near field shows mass itself, through any wall, but the pull outside a body cannot settle its
inside, and its fine detail fades so fast that the blur shrinks only with the logarithm of the sensitivity. A simple
scene, and the fact that mass is never negative, still allow precise measurements.**

::: problems
### Practice

**[0.2]** In the figure of two buried masses, set the separation to 0.25 times the depth and first lower the
sensitivity to $10^3$. Then raise it half a power of ten at a time until the two masses are told apart. At what ratio
does this happen, and what does the blur bar read?

::: solution
At $10^6$, where the bar reads 0.21 times the depth. The threshold is touchy: 4% in the separation costs a whole
power of ten.
:::

**[0.2]** Why does a camera a thousand times more sensitive draw a picture less than twice as sharp?

::: solution
The finest ripple kept is set by the logarithm of the ratio, which a factor of a thousand raises by only 6.9. The
blur falls from 24° to 14°.
:::

### Stretch

**[0.2]** At a ratio of a thousand the blur is 0.42 m wide at one metre. How wide is it at the safes, 3.5 m away, for
an array at least as wide as the scene is deep?

::: solution
The blur is an angle, so it grows with the distance: $0.42\unit{m} \times 3.5 = 1.5\unit{m}$.
:::

### The camera

**[0.2]** Panel (d) of the locked-safe figure shows the gold through the steel at a ratio of $10^{20}$. Why is it not a
reconstruction from simulated data?

::: solution
It blurs a map computed from the known scene, which the camera could not compute from its readings, because many
insides give the same pull outside.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), its opening plain words to *What heat reveals*: equations
  [](/paper/#eq:tidal-brightness) and [](/paper/#eq:tidal-column), Figure [](/paper/#fig:same-outside).
- *How sharp* to *Other gravitational sensors*: equations [](/paper/#eq:evanescent) to [](/paper/#eq:resolution),
  Table [](/paper/#tab:resolution), Figure [](/paper/#fig:resolution-law).
- *The precision of a simple scene* to *The positivity of mass*: Figure [](/paper/#fig:locked-safe).
:::

::: deeper
- Sections [1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts),
  [1.4](/tutorial/newton/tides/#tidal-brightness-is-density-times-the-cube-of-angular-size) and
  [3.7](/tutorial/noise/blur-law/#what-the-law-means) prove the shell theorem, tidal brightness and the blur law.
- The [GR course, section 10.9](https://neovand.github.io/general-relativity/chapter-10.html#10-9-how-much-curvature-is-outside-your-window)
  compares the Earth's tide with other sources.
:::

[^regimes]: Section [0.1](/tutorial/evening/a-camera-for-gravity/). First shown in *The gravitational
    camera* (Mohsenvand 2026), [Sec. IV](/paper/#sec:near-field).

[^newton]: Section [1.2](/tutorial/newton/field-and-potential/#the-field-is-the-pull-per-unit-mass-and-fields-add)
    gives Newton's law and the rule that pulls add.

[^bright]: Derived in section [1.4](/tutorial/newton/tides/#tidal-brightness-is-density-times-the-cube-of-angular-size).
    First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:tidal-brightness).

[^column]: The sum is the tidal column of *The gravitational camera* (Mohsenvand 2026), its equation
    [](/paper/#eq:tidal-column); section
    [1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes) derives it.

[^shell]: Proved in section [1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts).

[^split]: Proved in section 2.5. First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its
    equation [](/paper/#eq:split).

[^least]: Why, in section 2.5, from the best guess of section 3.5.

[^inertia]: Section [1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)
    tells a cored planet from a uniform one by it.

[^spin]: Derived in section [7.5](/tutorial/geometry/gravitomagnetism/#a-spinning-round-body-is-a-spin-dipole).

[^heat]: Derived in section 4.6.

[^ripples]: Section 2.6 shows how.

[^evanescent]: Derived in section 2.7. First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its
    equation [](/paper/#eq:evanescent).

[^snr]: Section [3.7](/tutorial/noise/blur-law/#what-the-law-means) explains this choice.

[^law]: Made exact in section [3.7](/tutorial/noise/blur-law/#what-the-law-means).

[^table]: Recomputed in section [3.7](/tutorial/noise/blur-law/#what-the-law-means). First tabulated in *The gravitational camera*
    (Mohsenvand 2026), Table [](/paper/#tab:resolution).

[^eye]: Computed in section [3.7](/tutorial/noise/blur-law/#what-the-law-means); the ceiling itself is Part 8's.

[^goce]: Read in section [3.7](/tutorial/noise/blur-law/#what-the-law-means). First shown in *The gravitational
    camera* (Mohsenvand 2026), Sec. IV.

[^sensors]: At a ratio of a thousand, clocks, accelerometers and tidal pixels keep ripples up to $kz$ of 6.2, 8.1 and
    10.4.

[^precision]: The Cramér–Rao bounds of section 3.3.

[^which]: The camera errs when the noise carries its readings past the midpoint, 0.9 spreads away (section 3.3).

[^cautious]: This array is small beside its distance, so its blur is about 32°, 2 m at the safes, as wide as the gap
    between them. Section R3 works the case.

[^positive]: Section 3.9 explains why positivity is so powerful.
