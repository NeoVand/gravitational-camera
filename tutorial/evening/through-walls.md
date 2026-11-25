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
324 kg. In ordinary light the two look alike, because light stops at the steel. The paper's gravitational camera shows
the gold through the steel. [Section IV](/paper/#sec:near-field) of the paper is about this kind of seeing, in the
**near field**: close to the scene, where the camera feels the steady pull of the masses in front of it.[^regimes]

A camera that feels the pull of mass sees through any wall. Why, then, can it never draw a sharp picture of what is
behind the wall? The pull outside a body cannot settle how the mass inside is arranged, and fine detail in the pull
fades with distance so fast that the camera's noise hides it. Yet a blurred picture can still answer a simple question
precisely, when the camera knows that the scene is simple and uses the fact that mass is never negative.

## The camera weighs what it sees, through anything

Each pixel of the camera measures the **tide**, the difference in the pull of gravity between nearby points. Every
mass pulls as if nothing else were there, so a wall between the camera and the gold adds its own pull and takes nothing
away from the gold's. The pull depends only on how much mass there is and where it is, so the camera in effect weighs
what it sees, and it sees a still room as well as a busy one.[^newton]

The paper's equation [](/paper/#eq:tidal-brightness) says that the tide of a round body is proportional to its mean
density (mass over volume) times the cube of its **angular size**, its radius divided by its distance.[^bright] So the Moon, as wide
in the sky as the Sun but 2.4 times denser, raises about twice the Sun's tide on the Earth.

The **line of sight** in a direction is the straight line from the camera in that direction. The tide of a small
mass falls as the cube of its distance, but a narrow cone around the line holds more matter farther out, in proportion
to the square of the distance. So each part of the line counts in proportion to its density divided by its distance.
The paper's near-field pictures are maps of this sum, computed from the known scene. The next section shows why the
camera could not make such a map from its readings alone.[^column]

::: try {#scene-locked-safe}
Predict first: in gravity, will the empty safe vanish? Will the gold brighten its whole safe, or one place in it?
Drag the divider to the right edge for ordinary light, then to the left edge for gravity. Notice what the empty
safe does, and where the gold shows: the camera adds up the mass along each line of sight, and steel is mass too.
:::

## The outside of a body does not settle its inside

Take three steel balls, each holding the same gold. In the first, the gold is a nugget halfway from the centre to the
wall. In the second, the paper's flush, it is spread through the ball, densest on the wall nearest the nugget's place
and thinning toward the far wall. In the third, it is a skin on the surface, thickest over that place. Outside, the
three pull alike at every point, however close the camera comes.

{{paper fig:same-outside}}

The simplest case is Newton's **shell theorem**: a hollow shell and a solid ball of the same mass pull in exactly the
same way on everything outside them.[^shell] More generally, mass can be moved around inside a body in many ways without
changing its pull anywhere outside.[^split] A difference between two scenes that the camera cannot detect at any
sensitivity is called a **blind spot**.

The flush is the picture of the inside that assumes least: of all the arrangements with the same pull outside, it
favours no point over another and has the smallest sum of the squares of its densities. Such a picture always
has its densest and its lightest points on the surface, so it can never show a dense core. The Earth, whose iron core
averages about $11{,}000\unit{kg\,m^{-3}}$, would appear as a uniform ball of $5513\unit{kg\,m^{-3}}$, its mean
density.[^least]

Other measurements tell such bodies apart, because they depend on how far the mass lies from the centre. That spread
sets the **moment of inertia**, which says how hard a body is to set spinning.[^inertia] A spinning body adds to its
tide a magnetic part whose size depends on the moment of inertia.[^spin] A warm body trembles, because its atoms jiggle
at random, and the trembling of its pull depends on the same spread.[^heat] Chapter [0.5](/tutorial/evening/what-the-outside-keeps/) tours these measurements.

::: try {#same-outside}
Predict first: of the five round bodies, which keeps the most energy from a brief tide applied from outside, a kick,
and which the least? Choose each in turn for B and read its row against the uniform ball, A; then answer the figure's
own two questions. Notice that their order is the order of how far their mass lies from the centre.
:::

## Fine detail fades with distance much faster than coarse detail

Any picture of buried masses can be built by adding up ripples, patterns of density that rise and fall in parallel
waves, of every spacing, as a chord is built from pure notes.[^ripples] Picture a slab whose density rises and falls
like a ploughed field, with crests 10 cm apart. Above the slab, the pull of the ripples follows the same pattern but
weakens with height:

{{paper eq:evanescent}}

Here $\sym{potential}{\Phi}$ is the gravitational potential, an energy per unit mass in joules per kilogram, whose
change from point to point is the pull, and $x$ is the position across the ripples, in metres. The **wavenumber** $k$,
in reciprocal metres, sets the spacing of the crests, $2\pi/k$, and $z$ is the height above the slab, in metres. The
factor $\cos(kx)$ is the ripple and $e^{-kz}$ is its fading. A finer ripple has a larger $k$ and fades faster, and
every ripple fades more with height. The fading follows from **Laplace's equation**, the rule that the potential obeys
in empty space.[^evanescent]

For crests 10 cm apart seen from 10 cm, $kz = 2\pi$, so the signal is $e^{2\pi} = 535$ times weaker than at the slab.
From 20 cm it is $e^{4\pi} = 2.9 \times 10^5$ times weaker, because doubling the height squares the factor. It is like a hand
under a thick blanket, which shows only as a broad bump.

![Two ripples, one three times finer than the other, fade as they rise. At the pixels the coarse one stands above
the noise and the fine one is lost. Heights stretched about ten times.](tut-ripples){#fig:ripples}

## The blur shrinks only with the number of digits of the sensitivity

Every instrument has **noise**, small random changes in its reading, present even when there is nothing to
measure. The **signal-to-noise ratio**, $\sym{snr}{\SNR}$, is the signal divided by the typical size of the noise, a
pure number. For the near-field camera, the signal is the strongest tide that one buried mass raises at the array of
pixels. The noise is that of the readings averaged over a square patch of the array whose sides are as long as the mass
is deep.[^snr]

To recover fine detail, the camera must enlarge each faded ripple by its fading factor. That enlarges the
noise by the same factor, so a ripple whose fading factor is larger than the signal-to-noise ratio is lost. The finest
ripple that survives sets the **blur**, the width of the camera's best picture of one point mass. Only the product $kz$
enters the fading, so the blur is an angle. For an array at least as wide as the scene is deep, and at a given ratio,
it is the same fraction of the distance at every distance: at a ratio of a thousand, 42 cm for a scene one metre away,
about the width of a person's shoulders.

The paper's first estimate is that the blur is about $\pi/\ln\SNR$ radians.[^law] At a ratio of a thousand,
$\pi/\ln 1000 = 3.14/6.91 = 0.45$ radians, or 26°. Each factor of ten adds only 2.3 to the natural logarithm of the ratio, so it
buys only a small step in sharpness. The exact values differ a little from the estimate:[^table]

- a signal-to-noise ratio of a thousand gives a blur of 24°;
- a million gives 14° (the estimate, 13°);
- $10^{30}$ still gives 3.4° (the estimate, 2.6°).

To match the human eye, which resolves a sixtieth of a degree, the camera would need a ratio of about
$10^{6600}$. A rough quantum estimate caps any camera watching a person at about $10^{70}$, even over the age of the
universe, and that gives 1.5°: no camera of this kind could draw a face.[^eye]

{{paper fig:resolution-law}}

The satellite GOCE measured the tide for four years, three of them from 254 km up, and the paper reads its map as a
ratio of two to four thousand and a blur of 21° to 23°, near the first entry of the list.[^goce] The limit belongs to
Laplace's equation, not to the instrument, so cameras made of clocks or accelerometers follow the same law.[^sensors]

::: try {#near-field-blur}
Predict first: the two masses, half their depth apart, show as two bumps at a ratio of a million. How far must the
sensitivity fall before they merge? Drag it down half a power of ten at a time and watch the lower curve, the best
picture.
:::

## A blurred picture can still give a precise measurement

If the camera knows that the scene holds one mass, it need not draw a picture: it fits the mass and its three
coordinates to all its data. At a ratio of a thousand and a distance of one metre, it places the mass to 1.3 mm
in depth and 0.8 mm across, although its picture is 24° wide.[^precision]

In the paper's worked case, an array a metre square with 121 pixels looks at the safes, with the known room and the
empty safes subtracted. The case asks three questions.

**Which safe?** At a ratio of 10, the readings expected in the two cases differ by 1.8 times the spread of the noise,
so the camera picks the wrong safe 18% of the time. At 34 it is wrong once in a thousand tries.[^which]

**How much gold, from a cautious picture?** A picture that assumes little, like the flush, weighs a safe only to within
$\pm 730\unit{kg}$ at a ratio of a thousand. It allows plus five hundred kilograms in one place with minus five hundred
spread round it, and the near field cannot see the difference.[^cautious]

**How much gold, if mass is never negative?** Requiring every part of the picture to hold a positive mass, the same
data find $315 \pm 20\unit{kg}$ in the right-hand safe and almost nothing in the left.[^positive]

{{paper fig:locked-safe}}

::: check
### Q

In panel (b) of the paper's resolution-law figure, about how wide is the blur of a flat array at a ratio of $10^{10}$?

### A

About 9°; the paper's table gives 9.2°.

### Q

Why does a camera a thousand times more sensitive draw a picture less than twice as sharp?

### A

Fine ripples fade exponentially, so the finest ripple kept is set by the logarithm of the ratio, which a factor of a
thousand raises by only 6.9. The blur falls from 24° to 14°.

### Q

A ripple with crests 10 cm apart is seen from 20 cm. Is its signal about 500 or about 300,000 times weaker than at
the slab?

### A

About 300,000: $e^{4\pi} = 2.9 \times 10^5$, the square of the 535 at 10 cm.
:::

**The idea to keep: the near field shows mass itself, through any wall, but the pull outside a body cannot settle its
inside, and its fine detail fades so fast that the blur shrinks only with the logarithm of the sensitivity. A simple
scene, and the fact that mass is never negative, still allow precise measurements.**

::: problems
### Practice

In the figure of two buried masses, set the separation to 0.25 times the depth and first lower the sensitivity to
$10^3$. Then raise it half a power of ten at a time until the two masses are told apart. At what ratio does this
happen, and what does the blur bar read?

::: solution
At $10^6$, where the bar reads 0.21 times the depth. The threshold is touchy: 0.24 times the depth needs $10^{6.5}$,
and 0.26 times needs $10^{5.5}$, so 4% in the separation costs a whole power of ten.
:::

### Stretch

At a ratio of a thousand the blur is 0.42 m wide at one metre. How wide is it at the safes, 3.5 m away, for an array
at least as wide as the scene is deep?

::: solution
The blur is an angle, so it grows with the distance: $0.42\unit{m} \times 3.5 = 1.5\unit{m}$.
:::

### The paper

Panel (d) of the paper's [locked-safe figure](/paper/#fig:locked-safe) shows the gold through the steel at a ratio of
$10^{20}$. Find the sentence in its caption that says what this panel is not, and say why.

::: solution
The panel is "not a reconstruction from simulated data". It blurs a map computed from the known scene, which the
camera could not compute from its readings, because many insides give the same pull outside.
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
- Chapters [1.3](/tutorial/newton/gauss-and-poisson/), [1.4](/tutorial/newton/tides/) and
  [3.7](/tutorial/noise/blur-law/) prove the shell theorem, tidal brightness and the blur law; the route "To Section IV,
  the near field" orders the rest.
- The [GR course, section 10.9](https://neovand.github.io/general-relativity/chapter-10.html#10-9-how-much-curvature-is-outside-your-window)
  compares the Earth's tide with other sources.
:::

[^regimes]: Introduced in chapter [0.1](/tutorial/evening/a-camera-for-gravity/).

[^newton]: Chapter [1.2](/tutorial/newton/field-and-potential/#the-field-is-the-pull-per-unit-mass-and-fields-add)
    gives Newton's law and the rule that pulls add.

[^bright]: Derived in chapter [1.4](/tutorial/newton/tides/#tidal-brightness-is-density-times-the-cube-of-angular-size).

[^column]: The paper's tidal column, equation [](/paper/#eq:tidal-column), derived in chapter
    [1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes).

[^shell]: Proved in chapter [1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts).

[^split]: The paper's equation [](/paper/#eq:split), proved in chapter 2.5.

[^least]: Why, in chapter 2.5, from the best guess of chapter 3.5.

[^inertia]: Chapter [1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)
    tells a cored planet from a uniform one by it.

[^spin]: Derived in chapter [7.5](/tutorial/geometry/gravitomagnetism/#a-spinning-round-body-is-a-spin-dipole).

[^heat]: Derived in chapter 4.6.

[^ripples]: Chapter 2.6 shows how.

[^evanescent]: Derived in chapter 2.7.

[^snr]: Chapter [3.7](/tutorial/noise/blur-law/) explains this choice.

[^law]: Made exact in chapter [3.7](/tutorial/noise/blur-law/).

[^table]: Table [](/paper/#tab:resolution), recomputed in chapter [3.7](/tutorial/noise/blur-law/).

[^eye]: Computed in chapter [3.7](/tutorial/noise/blur-law/#what-the-law-means); the ceiling itself is Part 8's.

[^goce]: Read in chapter [3.7](/tutorial/noise/blur-law/#what-the-law-means).

[^sensors]: At a ratio of a thousand, clocks, accelerometers and tidal pixels keep ripples up to $kz$ of 6.2, 8.1 and
    10.4, which differ by about their own logarithm, as much as a change in how the ratio is defined would shift them.

[^precision]: The Cramér–Rao bounds of chapter 3.3.

[^which]: The camera errs when the noise carries its readings past the midpoint between the two answers, 0.9 spreads
    away, which happens 18% of the time (chapter 3.3).

[^cautious]: This array is small beside its distance, so its blur is about 32°, 2 m at the safes, as wide as the gap
    between them, and most of the doubt lies in fine patterns of mass that the data do not reach. Chapter R3 works the
    case.

[^positive]: At $10^4$, $328 \pm 1\unit{kg}$: the small excess is the cost of modelling the bar as a grid of points.
    Chapter 3.9 explains why positivity is so powerful.
