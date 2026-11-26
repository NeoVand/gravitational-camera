---
id: '0.6'
title: 'How to read this book'
question: 'The tides in this book run from $10^{-32}$ to $10^{13}$ per second squared, and its equations use letters from three alphabets. How do we read a number, a symbol and an equation without getting lost?'
part: '0'
requires: ['0.1']
paper: [sec:affordances, tab:affordances, tab:null, sec:pixel, sec:near-field, eq:tidal-brightness, eq:nearzone, eq:cutoff, eq:resolution, tab:resolution, tab:regimes, sec:no-lens, sec:vistas, sec:first-image, sec:hole, eq:dumbbell]
figures: []
live: [scale-ladder, tidal-ring]
---

This book is for a reader who knows single and multivariable calculus, vectors and matrices, and some probability, and
who is willing to read with a pencil. It builds the physics it needs from there and derives each result it uses.

The parts build in order. Part I builds the field of a body and its tide from Newton's gravity. Part II treats noise and
what a measurement can recover, and Part III waves, relativity and the geometry of gravity. Part IV adds quanta and the
single point of the field, Part V heat, black holes and the sky, and Part VI what a field keeps of its source.

## Every number says what it measures, in what unit, and against what

The book uses **SI units**, the international system built on the metre, the kilogram and the second, and writes out
every constant of nature. Four appear throughout:

- the gravitational constant $\sym{gravitational-constant}{G} = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$;
- the speed of light $\sym{speed-of-light}{c} = 2.998 \times 10^{8}\unit{m\,s^{-1}}$;
- the reduced Planck constant $\sym{hbar}{\hbar} = 1.055 \times 10^{-34}\unit{J\,s}$ (read "h-bar"), the Planck constant
  $h = 6.6 \times 10^{-34}\unit{J\,s}$ of [0.3](/tutorial/evening/waves-and-heat/) divided by $2\pi$;
- Boltzmann's constant $\sym{boltzmann}{k_B} = 1.381 \times 10^{-23}\unit{J\,K^{-1}}$, which turns a temperature into an
  energy.

Each number has three parts to read. The Earth's tide at its surface, $3.1 \times 10^{-6}\unit{s^{-2}}$, measures
the planet's stretch along the vertical, has the unit per second squared, and is 330 times the 9.3 eötvös of a person
a metre away, where $1\unit{E} = 10^{-9}\unit{s^{-2}}$ ([section 1.4](/tutorial/newton/tides/)).

Temperatures enter as energies: $k_BT$ is the typical energy of one jiggle of heat at the temperature $T$, in kelvin,
$4.1 \times 10^{-21}\unit{J}$ at 300 K. Such energies are measured in **electronvolts**, the
energy an electron gains in crossing one volt: $1\unit{eV} = 1.602 \times 10^{-19}\unit{J}$, the $k_BT$ of 11,600 K.
Divided by $\hbar$, the $k_BT$ of 300 K becomes $3.9 \times 10^{13}$ per second. This is an **angular frequency**, in
radians per second, $2\pi$ times the number of cycles per second: $6 \times 10^{12}$ cycles a second, the "about
$10^{13}$ times a second" that atoms jiggle in 0.3.[^mean]

## Powers of ten turn the widest ranges into steps

A very large or small number is written in **scientific notation**, as a number between 1 and 10 times a power of ten:
$9.3 \times 10^{-9}$ is 0.0000000093. Each factor of ten is one step, an **order of magnitude**, and multiplying two
numbers adds their steps.

::: try {#scale-ladder}
How many powers of ten separate the person's tide from the Moon's? Guess, then put the pointer on the Moon and on the
person, and read the steps between them.
:::

The person's tide is 54,000 times the Moon's, which is $10^{4.7}$. The tides in the book span 45 steps, and the
lengths 38, from LIGO's arm, stretched by $4 \times 10^{-18}\unit{m}$, to a supernova in our Galaxy,
$3.1 \times 10^{20}\unit{m}$ away.[^ladder]

Both ends of the tide ladder belong to one black hole of $1.356 \times 10^{23}\unit{kg}$, about two Moon masses. Its
steady tide at a metre, $2 \times 10^{13}\unit{s^{-2}}$, would tear the camera apart, but the hole is warm, so it
trembles, and seen from a metre for one second the trembling of its tide is only
$4 \times 10^{-32}\unit{s^{-2}}$ ([0.5](/tutorial/evening/what-the-outside-keeps/)).

## The sky has its own units

A few later sections use the astronomer's units. The **astronomical unit**, AU, is the mean distance from the Earth to
the Sun, $1.496 \times 10^{11}\unit{m}$. The **light-year** is $9.46 \times 10^{15}\unit{m}$, and the **parsec**, pc,
is 3.26 light-years. The **solar mass**, $\sym{solar-mass}{M_\odot} = 1.989 \times 10^{30}\unit{kg}$, is the Sun's. Five
**magnitudes** are a factor of 100 in brightness, and a larger magnitude is fainter.

## Each symbol has one meaning, with a few known collisions

Small Latin letters used as labels, such as $i$ and $j$, are the indices of
[section 1.1](/tutorial/newton/vectors-and-indices/), each standing for any of the three directions. The curly
capitals $\mathcal E$, $\mathcal B$ and $\mathcal W$ are tides: $\mathcal E$ stretches and squeezes, its magnetic part
$\mathcal B$ twists, and $\mathcal W = \mathcal E + i\mathcal B$ holds both.[^curly] Other curly letters, such as the compactness $\mathcal C$ of 0.4, are not.

A **symbol collision** is one letter used for two quantities. The first is here: in $\mathcal E + i\mathcal B$ the
letter $i$ is not an index but the imaginary unit, whose square is $-1$
([section 1.5b](/tutorial/newton/complex-numbers/)). Four more come early:

- $\rho$ is a density, in $\mathrm{kg\,m^{-3}}$, but in the chapters on one point of the field the signal-to-noise
  ratio of one reading, a pure number;
- $q$ is the fineness of a ripple in the near-field chapters, but in the chapters on the sky the lopsidedness of a
  burst of waves;
- $S$ is the tidal column, the density along a line of sight added up with each piece divided by its distance, but
  elsewhere a spectrum, the strength of a noise at each frequency;
- the roman E of the eötvös is a unit, and the curly $\mathcal E$ is the tide itself.

The unit and the section tell the meanings apart. Three signs compare numbers: $\approx$ means "approximately equal",
$\ll$ "so much smaller than that it can be neglected", and $\sim$ "of the same order of magnitude".[^more] <!-- lint-allow: \sim -->

From Part I on, symbols are coloured by the kind of object: matter, such as $\matter{\rho}$ and $\matter{M}$; the
field, $\field{\Phi}$; curvature, the tides, $\curv{\mathcal E}_{ij}$; the observer, $\obs{v}$; and light, $\light{E}$.
A symbol with a faint highlight opens a card when pressed; the [symbols page](/tutorial/symbols/) gathers the cards
and the [glossary](/tutorial/glossary/) the bold terms.

## An equation can be read before it is derived

Every later section reads an equation in five steps before deriving it:

1. Name every symbol, and give its unit.
2. Check that the units of the two sides agree.
3. Say which way each input pushes the result.
4. Take a **limit** or a special case: let one input grow very large or very small, or choose a case whose answer is
   known.
5. Put in the numbers of one scene.

![Each symbol of the tidal brightness is tagged with its unit, and the units of the right side,
$\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg\,m^{-3}}$, multiply to the $\mathrm{s^{-2}}$ of the left. The two
arrows below show which way the inputs push the tide: in proportion to the density, and as the cube of the angular
size.](tut-read-equation){#fig:read}

The first example is the tide that a round body raises at the camera (Figure [](#fig:read)):

$$\frac{2G\matter M}{r^{3}} = \frac{8\pi G}{3}\,\bar\rho\,\theta^{3}, \qquad \theta = \frac{R}{r}.$$

1. The left side is the stretch made by a body of mass $M$, in kilograms, at the distance $r$, in metres. Its mean
density $\bar\rho$ is in $\mathrm{kg\,m^{-3}}$, and its angular size $\theta$ has no unit. 2. The
product $G\bar\rho$ is in $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg\,m^{-3}} = \mathrm{s^{-2}}$, as a tide must
be. 3. A denser body raises a larger tide in proportion, and a body that looks twice as wide raises eight times the
tide, because $\theta$ enters cubed. 4. The Moon is 2.4 times denser than the Sun, but the Sun looks 3% wider, so the Moon's tide is 2.2 times the Sun's. 5. The Moon, of $3344\unit{kg\,m^{-3}}$ and
$\theta = 4.52 \times 10^{-3}$, gives $1.7 \times 10^{-13}\unit{s^{-2}}$.[^bright]

::: try {#tidal-ring}
Predict first: by step 3 the stretch falls as the cube of the distance. At what distance is the stretch of the
person, 70 kg, half its value at 1 m? Move the mass until the stretch has halved.
:::

The second example is the edge of the near zone:

$$r \ll \frac{\lambda}{2\pi} = \frac{c}{2\pi f}.$$

1. The distance to the source is $r$, in metres. The frequency of the waves it would emit is $f$, in hertz, and their
   wavelength is $\lambda = c/f$.
2. The ratio $c/f$ is metres per second divided by cycles per second, a length.
3. A higher frequency gives a smaller near zone.
4. As the frequency falls to zero the near zone grows without limit: a body at rest is felt by its pull everywhere.
5. At 1 Hz the near zone reaches 47,700 km.[^zones]

## Exercises, margin notes and the web edition

Each book chapter ends with exercises in three tiers, **Practice**, **Stretch** and a last tier that reaches toward
research, each tagged with its section and followed by a worked solution. Margin notes beside the text say where a
result is derived. The camera's results first appeared in the paper *The gravitational camera* (Mohsenvand 2026);
margin notes link to it.

In the web edition, interactive figures, headed *Predict first*, ask for a guess before they answer. In the printed
book each is replaced by a static figure and a margin note pointing to the web edition.

## Paths through the book

A reader in a hurry can read the prologue, then Parts I and II for the near-field picture, Part III for waves and
relativity, and Parts V and VI last. Each section opens with a question and ends with an idea to keep, so a chapter
can be skimmed by those.

**The idea to keep: every number says what it measures, in what unit, and against what; and every equation can be read
before it is derived, by naming its symbols, checking its units, seeing which way each input pushes, taking a limit and
putting in one scene.**

::: problems
### Practice

**[0.6]** On the ladder of tides, how many powers of ten separate the camera's limit from the hole at one metre? The
tide falls as the cube of the distance, and 26 km is 4.4 powers of ten farther than 1 m. Do the two answers agree?

::: solution
The marks are 13.3 powers of ten apart, and three times 4.4 is 13.2, so they agree to the rounding.
:::

### Stretch

**[0.6]** The power that two turning masses radiate grows as the sixth power of their rate of turning. By what factor, and
how many powers of ten, does it grow if the pair turns twice as fast?

::: solution
$2^6 = 64$ times, which is $10^{1.8}$, almost two powers of ten.
:::

### The camera

**[0.6]** In the table of blurs against signal-to-noise ratio of section 3.7, find the ratio at which a flat array's
blur is 5°, and say what it means.

::: solution
A ratio of $10^{20}$: the strongest tide of one buried mass is $10^{20}$ times the noise of the readings averaged over
a patch as wide as the mass is deep.
:::
:::

::: paper
- [Section X](/paper/#sec:affordances) and its plain words: Tables [](/paper/#tab:affordances) and
  [](/paper/#tab:null).
- [Section II](/paper/#sec:pixel): the eötvös and the person.
- Equations [](/paper/#eq:tidal-brightness) and [](/paper/#eq:resolution) of [Section IV](/paper/#sec:near-field), and
  [](/paper/#eq:nearzone) of [Section III](/paper/#sec:regimes).
:::

[^mean]: Derived in section 10.1: the gravitons of the Earth's liquid outer core, at 4500 K, carry on average
    $2.70\,k_BT = 1.0\unit{eV}$.

[^ladder]: The hole: section [13.7](/tutorial/what-a-field-keeps/thermometer/). The quantum limit of two masses of a
    gram each: section 8.6.

[^curly]: Derived in [1.4](/tutorial/newton/tides/#tidal-brightness-is-density-times-the-cube-of-angular-size),
    [7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index) and 9.3.

[^more]: Other conventions come where they are needed: the hat of a unit vector in
    [1.1](/tutorial/newton/vectors-and-indices/), $e^{-i\omega t}$ in [1.5b](/tutorial/newton/complex-numbers/), and in
    6.2 Greek labels and the signature, the signs $-{+}{+}{+}$ that spacetime distances give to time and space.

[^bright]: Derived in [1.4](/tutorial/newton/tides/#tidal-brightness-is-density-times-the-cube-of-angular-size). First
    shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation [](/paper/#eq:tidal-brightness).

[^zones]: Derived in [5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1).
    First shown in *The gravitational camera* (Mohsenvand 2026), Sec. III, as its equation [](/paper/#eq:nearzone).

[^blur]: Derived in [3.7](/tutorial/noise/blur-law/), which recomputes the exact value, 24.0°. First shown in *The
    gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation [](/paper/#eq:resolution).
