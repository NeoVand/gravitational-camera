---
id: '0.6'
title: 'How to read the rest: units, scales, notation, routes, how to read an equation'
question: 'The paper''s tides run from $10^{-32}$ to $10^{13}$ per second squared, and its equations use letters from three alphabets. How do we read a number, a symbol and an equation of the paper without getting lost?'
part: '0'
requires: ['0.1']
paper: [sec:affordances, tab:affordances, tab:null, sec:pixel, sec:near-field, eq:tidal-brightness, eq:nearzone, eq:cutoff, eq:resolution, tab:resolution, tab:regimes, sec:no-lens, sec:vistas, sec:first-image, sec:hole, eq:dumbbell]
figures: []
live: [scale-ladder, tidal-ring]
---

[Section X](/paper/#sec:affordances) of the paper gathers the evening: Table [](/paper/#tab:affordances) lists what
the camera can do that light cannot, and Table [](/paper/#tab:null) what it cannot tell apart. The rest of the tutorial
derives these claims.

The paper's tides run from $10^{-32}$ to $10^{13}$ per second squared, and its equations use letters from three
alphabets. How do we read a number, a symbol and an equation of the paper without getting lost? In one sentence: each
number is read as what it measures, its unit and what it is compared with, each symbol has one meaning apart from a
few known collisions, and each equation is read by a routine of five steps before it is derived.

## The evening has shown what the camera can and cannot do

The camera sees through any material and weighs what it looks at, because nothing screens gravity. If the material is
known, it also reads the temperature inside a hot body.[^can] Each way of seeing has blind spots, pairs of scenes that
it cannot tell apart at any sensitivity. In the near field a hollow shell looks like a solid ball of the same mass. In
the waves a body moving steadily in a straight line looks like a body at rest, while a turning body radiates. In
every channel a cosmic string, a thin, straight line of energy, looks like empty space.[^blind]

## Every number says what it measures, in what unit, and against what

The paper uses **SI units**, the international system built on the metre, the kilogram and the second, and it writes
every constant of nature out. Four appear throughout:

- the gravitational constant $\sym{gravitational-constant}{G} = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$;
- the speed of light $\sym{speed-of-light}{c} = 2.998 \times 10^{8}\unit{m\,s^{-1}}$;
- the reduced Planck constant $\sym{hbar}{\hbar} = 1.055 \times 10^{-34}\unit{J\,s}$ (read "h-bar"), which is the
  Planck constant $h = 6.6 \times 10^{-34}\unit{J\,s}$ of [0.3](/tutorial/evening/waves-and-heat/) divided by $2\pi$;
- Boltzmann's constant $\sym{boltzmann}{k_B} = 1.381 \times 10^{-23}\unit{J\,K^{-1}}$, which turns a temperature into
  an energy.

Tides are also measured in the eötvös of [chapter 1.4](/tutorial/newton/tides/), $1\unit{E} = 10^{-9}\unit{s^{-2}}$.
Each number of the paper has three parts to read. In
[Section II](/paper/#sec:pixel) the Earth's tide is $3.1 \times 10^{-6}\unit{s^{-2}}$. It measures the planet's stretch
along the vertical, its unit is per second squared, and it is 330 times the 9.3 E of the person a metre away (the
paper's "three hundred").

Temperatures enter as energies: the product $k_BT$ is the typical energy of one jiggle of heat at the temperature
$T$, in kelvin, and it is $4.1 \times 10^{-21}\unit{J}$ at 300 K. Such energies are measured in **electronvolts**, the
energy an electron gains in crossing one volt: $1\unit{eV} = 1.602 \times 10^{-19}\unit{J}$, the $k_BT$ of 11,600 K. The
gravitons of the Earth's liquid outer core, at 4500 K, carry on average $2.70\,k_BT = 1.0\unit{eV}$, "about 1 eV" in
[Section IX](/paper/#sec:first-image).[^mean]

Divided by $\hbar$, the $k_BT$ of 300 K becomes $3.9 \times 10^{13}$ per second (the paper's $4 \times 10^{13}$). This
is an **angular frequency**, in radians per second, $2\pi$ times the number of cycles per second. It is
$6 \times 10^{12}$ cycles a second, the "about $10^{13}$ times a second" that atoms jiggle in 0.3.

## Powers of ten turn the widest ranges into steps

The tutorial writes a very large or very small number in **scientific notation**, as a number between 1 and 10 times a
power of ten: $9.3 \times 10^{-9}$ is 0.0000000093. Each factor of ten is one step, called an **order of magnitude**.
Multiplying two numbers adds their steps.

::: try {#scale-ladder}
The figure opens with a prediction: how many powers of ten separate the person's tide from the Moon's? Make a guess,
then put the pointer on the Moon and on the person, and read the steps between them.
:::

The person's tide is 54,000 times the Moon's (the paper's "some fifty thousand"), which is $10^{4.7}$, so it stands
between four and five steps higher. The tides span 45 steps, and the lengths 38, from LIGO's arm, stretched by
$4 \times 10^{-18}\unit{m}$, to a supernova in our Galaxy, $3.1 \times 10^{20}\unit{m}$ away.[^ladder]

Both ends of the tide ladder belong to one black hole of $1.36 \times 10^{23}\unit{kg}$, about two Moon masses. Its
steady tide at a metre, $2 \times 10^{13}\unit{s^{-2}}$, would tear the camera apart. The tide falls to a bearable
$1\unit{s^{-2}}$ only 26 km away ([0.4](/tutorial/evening/one-pixel/)), where it pulls the ends of a camera a metre
long apart with a tenth of the Earth's gravity. The hole is warm, so it trembles, and seen from a metre for one second
the trembling of its tide is only $4 \times 10^{-32}\unit{s^{-2}}$ ([0.5](/tutorial/evening/what-the-outside-keeps/)).

## The sky has its own units

A few later sections use the astronomer's units, gathered here to look back at. The **astronomical unit**,
AU, is the mean distance from the Earth to the Sun, $1.496 \times 10^{11}\unit{m}$. The **light-year** is
$9.46 \times 10^{15}\unit{m}$, and the **parsec**, pc, is 3.26 light-years. The **solar mass**,
$\sym{solar-mass}{M_\odot} = 1.989 \times 10^{30}\unit{kg}$, is the Sun's (the paper writes it in words). Five
**magnitudes** are a factor of 100 in brightness, and a larger magnitude is fainter.[^sky]

## Each symbol has one meaning, with a few known collisions

Small Latin letters used as labels, such as $i$ and $j$, are the indices of
[chapter 1.1](/tutorial/newton/vectors-and-indices/), each standing for any of the three directions. The curly capitals $\mathcal E$, $\mathcal B$ and $\mathcal W$ are tides:
$\mathcal E$ stretches and squeezes, its magnetic part $\mathcal B$ twists, and $\mathcal W = \mathcal E + i\mathcal B$
holds both.[^curly] Other curly letters, such as the compactness $\mathcal C$ of 0.4, are not tides.

A **symbol collision** is one letter used for two quantities, and the first one is here: in
$\mathcal E + i\mathcal B$ the letter $i$ is not an index but the imaginary unit, whose square is $-1$
([1.5b](/tutorial/newton/complex-numbers/)). Four more come early:

- the letter $\rho$ is a density, in $\mathrm{kg\,m^{-3}}$, but in Section VIII the signal-to-noise ratio of one
  reading, a pure number;
- the letter $q$ is the fineness of a ripple in Section IV, but in Section XI the lopsidedness of a burst of waves;
- the letter $S$ is the tidal column of Section IV, the density along a line of sight added up with each piece
  divided by its distance, but elsewhere a spectrum, the strength of a noise at each frequency;
- the roman E of the eötvös is a unit, and the curly $\mathcal E$ is the tide itself.

The unit and the section tell the meanings apart. Three signs compare numbers: $\approx$ means "approximately equal",
$\ll$ means "so much smaller than that it can be neglected", and $\sim$ means "of the same order of magnitude".[^more] <!-- lint-allow: \sim -->

From Part 1 on, the tutorial colours its symbols by the kind of object: matter, such as $\matter{\rho}$ and
$\matter{M}$; the field, $\field{\Phi}$; curvature, the tides, $\curv{\mathcal E}_{ij}$; the observer, $\obs{v}$;
and light, $\light{E}$. A key, *The colours of the equations*, heads each chapter that uses colour. The key on this
page also shows symbols from later parts, and for now only its colours matter. A symbol with a faint highlight opens a
card when pressed; the [symbols page](/tutorial/symbols/) gathers the cards, and the [glossary](/tutorial/glossary/)
the bold terms.

## An equation can be read before it is derived

Every later chapter reads an equation in five steps before deriving it:

1. Name every symbol, and give its unit.
2. Check that the units of the two sides agree.
3. Say which way each input pushes the result.
4. Take a **limit** or a special case: let one input grow very large or very small, or choose a case whose answer is
   known.
5. Put in the numbers of one scene.

![Each symbol of the paper's tidal brightness is tagged with its unit, and the units of the right side,
$\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg\,m^{-3}}$, multiply to the $\mathrm{s^{-2}}$ of the left. The two
arrows below show which way the inputs push the tide: in proportion to the density, and as the cube of the angular
size.](tut-read-equation){#fig:read}

The first example is the paper's tidal brightness, the tide that a round body raises at the camera
(Figure [](#fig:read)):

{{paper eq:tidal-brightness}}

1. The left side is the stretch made by a body of mass $M$, in kilograms, at the distance $r$, in metres. Its mean
density $\bar\rho$ is in $\mathrm{kg\,m^{-3}}$, and its angular size $\theta$, radius over distance, has no unit. 2. The
product $G\bar\rho$ is in $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg\,m^{-3}} = \mathrm{s^{-2}}$, as a tide must
be. 3. A denser body raises a larger tide in proportion, and a body that looks twice as wide raises eight times the
tide, because $\theta$ enters cubed. 4. The Sun and the Moon look almost the same size. The Moon is 2.4 times denser,
but the Sun looks 3% wider, so the Moon's tide is 2.2 times the Sun's. 5. The Moon, of $3344\unit{kg\,m^{-3}}$ and
$\theta = 4.52 \times 10^{-3}$, gives $1.7 \times 10^{-13}\unit{s^{-2}}$.[^bright]

::: try {#tidal-ring}
Predict first: by step 3 the stretch falls as the cube of the distance. At what distance is the stretch of the
person, 70 kg, half its value at 1 m? Move the mass until the stretch has halved.
:::

The second example is the edge of the near zone:

{{paper eq:nearzone}}

1. The distance to the source is $r$, in metres. The frequency of the waves it would emit is $f$, in hertz (for a
   turning pair of masses, twice the rate of turning), and their wavelength is $\lambda = c/f$.
2. The ratio $c/f$ is metres per second divided by cycles per second, a length.
3. A higher frequency gives a smaller near zone.
4. As the frequency falls to zero the near zone grows without limit: a body at rest is felt by its pull everywhere.
5. At 1 Hz the near zone reaches 47,700 km (the paper's 48,000).[^zones]

The third example is the blur law of [Section IV](/paper/#sec:near-field). The blur is the width of the camera's
best picture of one point, and the signal-to-noise ratio $\sym{snr}{\SNR}$ is the signal divided by the typical size
of the noise ([0.2](/tutorial/evening/through-walls/)).

{{paper eq:resolution}}

1. The blur $\sym{angular-blur}{\Delta\theta}$ is an angle, in radians. The cut-off $\sym{cutoff}{q_c}$ is the largest
   $kz$ of 0.2 that survives the noise: $2\pi$ times the depth over the crest spacing of the finest ripple kept. The
   number 4.43 is the width of the picture of a point at half its height, in units of depth over $q_c$.
2. The cut-off is a length over a length, so it has no unit, and neither has the angle.
3. A larger cut-off gives a smaller blur.
4. The paper's equation [](/paper/#eq:cutoff) sets $q_c$ by the ratio, and $q_c$ grows only about as $\ln\SNR$, so
   the blur shrinks without limit, but slowly: a thousand times the sensitivity adds only 6.9 to $\ln\SNR$.
5. At $\SNR = 10^3$ the paper's equation [](/paper/#eq:cutoff) gives $q_c = 10.4$, and $\Delta\theta = 4.43/10.4 =
   0.426$ radians, or 24.4°, against the 24.0° of the exact Table [](/paper/#tab:resolution).[^blur]

The estimate $\pi/\ln\SNR$ of 0.2 is this law with $\pi$ in place of 4.43 and $\ln\SNR = 6.9$ in place of
$q_c = 10.4$, and it gives 26°.

## Routes lead through the tutorial to each part of the paper

The tutorial's [home page](/tutorial/) lists its chapters and five [**routes**](/tutorial/#routes). Each route is the
shortest path through the tutorial to one part of the paper: to Section II, Section IV, Section VIII, Sections VI and
IX, or Sections XII to XV.

A chapter takes each result at one of three **depths**. At depth A it is derived in full. At depth B it is sketched, and
a box headed *What this sketch skips* names the gap. At depth C it is stated and explained without proof, as in the
tours.

::: check
### Q

A gradiometer is an instrument that measures tides. On the ladder of tides, how many powers of ten separate its
noise from the person's tide?

### A

About 2.7, a factor of 470 (the paper's "five hundred"): the person's signal-to-noise ratio in one second.

### Q

In Section VIII $\rho$ is a signal-to-noise ratio. What else does $\rho$ mean, and how can a reader tell the two
apart?

### A

A density, in kilograms per cubic metre. A ratio has no unit, so the units tell them apart.

### Q

A pair of masses turns once a second, so its waves are at 2 Hz. How far does its near zone reach?

### A

Half as far as at 1 Hz: 23,900 km.
:::

**The idea to keep: every number of the paper says what it measures, in what unit, and against what; and every
equation can be read before it is derived, by naming its symbols, checking its units, seeing which way each input
pushes, taking a limit and putting in one scene.**

::: problems
### Practice

On the ladder of tides, how many powers of ten separate the camera's limit from the hole at one metre? The tide falls
as the cube of the distance, and 26 km is 4.4 powers of ten farther than 1 m. Do the two answers agree?

::: solution
The marks are 13.3 powers of ten apart, and three times 4.4 is 13.2, so they agree to the rounding.
:::

### Stretch

The power that two turning masses radiate grows as the sixth power of their rate of turning (the paper's equation
[](/paper/#eq:dumbbell)). By what factor, and by how many powers of ten, does it grow if the pair turns twice as fast?

::: solution
$2^6 = 64$ times, which is $10^{1.8}$, almost two powers of ten.
:::

### The paper

In Table [](/paper/#tab:resolution), find the signal-to-noise ratio at which a flat array's blur is 5°, and say what it
means.

::: solution
A ratio of $10^{20}$: the strongest tide of one buried mass is $10^{20}$ times the noise of the readings averaged over
a patch as wide as the mass is deep.
:::
:::

::: paper
- [Section X](/paper/#sec:affordances) and its plain words: Tables [](/paper/#tab:affordances) and
  [](/paper/#tab:null).
- [Section II](/paper/#sec:pixel): the eötvös, the person and the gradiometers.
- Equations [](/paper/#eq:tidal-brightness), [](/paper/#eq:cutoff) and [](/paper/#eq:resolution) of
  [Section IV](/paper/#sec:near-field), and [](/paper/#eq:nearzone) of [Section III](/paper/#sec:regimes).
- [Sections VII](/paper/#sec:no-lens) and [XIV](/paper/#sec:hole): the small black hole.
:::

::: deeper
- In this tutorial: the [symbols](/tutorial/symbols/), the [glossary](/tutorial/glossary/), and the
  [routes](/tutorial/#routes) in order.
- The GR course reads [one distance in two units](https://neovand.github.io/general-relativity/chapter-0.html#measurements-and-units),
  sets [a five-minute check](https://neovand.github.io/general-relativity/chapter-0.html#0-9-your-first-five-minute-check)
  of units, and gives
  [a checklist for reading indices](https://neovand.github.io/general-relativity/appendix-e.html#e-1-an-index-reading-checklist).
:::

[^can]: Toured in [0.2](/tutorial/evening/through-walls/), [0.3](/tutorial/evening/waves-and-heat/),
    [0.4](/tutorial/evening/one-pixel/) and [0.5](/tutorial/evening/what-the-outside-keeps/), which name the chapters
    that prove each claim.

[^blind]: The shell: [1.3](/tutorial/newton/gauss-and-poisson/). Steady motion: chapter
    [7.6](/tutorial/geometry/gravitational-waves/#a-body-in-steady-motion-sends-no-wave-and-neither-does-an-even-pressure).
    The string: R12.

[^mean]: Derived in chapter 10.1.

[^ladder]: The hole: Sections [XIV](/paper/#sec:hole) and [VII](/paper/#sec:no-lens) (chapters 13.7 and R11). The
    quantum limit of two masses of a gram each: [Section II](/paper/#sec:pixel) and chapter 8.6.

[^sky]: The light-year is in [Section VI](/paper/#sec:thermal), the AU in [VII](/paper/#sec:no-lens) and
    [XI](/paper/#sec:vistas), the kiloparsec and the magnitude in XI. Thirty magnitudes are $100^6 = 10^{12}$.

[^curly]: Derived in [1.4](/tutorial/newton/tides/), chapter
    [7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index) and chapter 9.3.

[^more]: Other conventions come where they are needed: the hat of a unit vector in
    [1.1](/tutorial/newton/vectors-and-indices/), $\Phi = -GM/r$ in [1.2](/tutorial/newton/field-and-potential/),
    $e^{-i\omega t}$ in [1.5b](/tutorial/newton/complex-numbers/), and in chapter 6.2 Greek labels and the signature,
    the signs $-{+}{+}{+}$ that spacetime distances give to time and space.

[^bright]: Derived in [1.4](/tutorial/newton/tides/#tidal-brightness-is-density-times-the-cube-of-angular-size).

[^zones]: Derived in chapter [5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1).

[^blur]: Derived in [3.7](/tutorial/noise/blur-law/), which recomputes the table. The first line of the paper's
    equation [](/paper/#eq:cutoff) gives $q_c = 10.4$; its approximate second line gives 10.1.
