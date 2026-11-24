---
id: '0.4'
title: "One pixel does a camera's work"
question: 'No lens can focus gravitational waves. How, then, does the camera form its pictures, and how much of that work can a single pixel do?'
part: '0'
requires: ['0.1']
paper: [sec:no-lens, eq:index, eq:lens-compactness, fig:black-hole-camera, eq:beam, eq:diffraction, fig:array, sec:one-pixel, fig:tidal, eq:polar, eq:speedometer, fig:speedometer, eq:stars, fig:stars, eq:wave-count, fig:voices, eq:magnetic-ratio, fig:present, tab:one-pixel]
figures: [fig:tidal, fig:stars]
live: [array, speedometer, voices, present]
---

A camera of light forms its picture with a lens. The gravitational camera is a flat array of pixels with nothing in
front of it, because no useful lens can be made for gravitational waves ([Section VII](/paper/#sec:no-lens) of the
paper). [Section VIII](/paper/#sec:one-pixel) then shows how much of a camera's work one pixel can do alone.

Without a lens, how does the camera form its pictures, and how much of that work can a single pixel do? In one
sentence: each pixel records the wave itself, with the timing of its crests, so an array forms its pictures by
computation; and the ten numbers of one pixel let it find its own motion, sort a scene, separate up to four waves and
see a moving body where it is now, as long as it knows what kind of scene it faces. The reasons come mostly in Part 9.

## No lens can be made, so the camera computes its pictures

Curved glass bends light towards a focus because light is slower in glass than in air. Matter barely slows
gravitational waves: steel slows a wave that vibrates a thousand times a second by one part in $10^{13}$, so a steel
lens a metre thick would focus it some $10^{13}\unit{m}$ away, about as far as Pluto.[^optics]

A mass also bends passing waves by its gravity, and a mass used in this way is a **gravitational lens**. How strongly
it bends them is set by its **compactness**: Newton's constant times its mass, divided by its radius and by the square
of the speed of light. This pure number, which says how strongly the body curves space, is $7 \times 10^{-10}$ for the
Earth and comes near one only for a black hole. A pocket lens 10 cm across that focuses one metre behind it needs a
compactness of about 1/80, and so eleven Moon masses inside it.[^hole]

The camera needs no lens, because a pixel records the wave itself, with the moment at which each crest arrives, while
an ordinary camera's pixel records only the energy that arrives. A wave from one direction reaches the pixels at
slightly different times. The camera shifts each pixel's record by its delay and adds the records, so that waves from
that direction add in step and waves from elsewhere cancel. This method, **beamforming**, is how arrays of radio
telescopes form images.[^beam] Its sharpness is that of any lens:

{{paper eq:diffraction}}

Here $\lambda$ is the wavelength and $D$ the width of the array, both in metres. The blur
$\sym{angular-blur}{\Delta\theta}$, in radians, is the smallest angle between two directions that the picture can tell
apart, and the wavy sign means "about". A wider array, or a shorter wave, gives a sharper picture.

::: try {#array}
Predict first: an array five wavelengths wide blurs a point over about 12°. Does a single pixel on its own blur it
over about 50°, or over the whole sky? Drag the slider to its left end, then to its right end.
:::

A lone pixel has no width, yet it blurs over 52°, not the whole sky, because its ten numbers change with the direction
a wave comes from. Its picture is the best estimate of the sky that ten numbers allow, and as an estimate it dips
below zero 60° from the source.[^onepixel]

## Ten numbers are more than one wave needs

A single wave arriving at a point is described by four numbers: two for its direction of travel, and two for the
strengths of its two polarizations. Panels (b) and (c) of the figure show them: the plus pattern stretches a ring of
free masses along one line and squeezes it across, and the cross pattern is the same turned by 45°.[^four]

{{paper fig:tidal}}

A sensor of light's whole field, here called a sensor of light, records six numbers: three electric and three
magnetic. A gravitational pixel records ten: five for the tide and five for its magnetic part, the twist that moving
masses add ([chapter 0.1](/tutorial/evening/a-camera-for-gravity/)). So it has six to spare for checking, separating
and locating.

The pixel holds more numbers because its field behaves differently when it is turned. Light's field at a point is an
arrow, which a half turn reverses. Turned in its own plane, a pattern of stretch and squeeze looks the same after a
half turn, a quarter turn swaps its stretch and its squeeze, and an eighth of a turn changes plus into cross. This is
what **spin two** means here, a property of the pattern under turning with nothing quantum about it (an arrow has spin
one). Followed through turns about every axis, spin two makes each half of a reading a table of five numbers instead
of an arrow of three.[^spin]

## The ten numbers regroup into four invariants, three angles and a velocity

A moving pixel reads a different mix of stretch and twist from a pixel at rest at the same place, as an observer
moving past an electric charge measures a magnetic field as well as an electric one.[^charge] So the ten numbers
regroup (Figure [](#fig:regroup)). Four combinations, the **invariants**, are the same for every observer, however turned and however moving.
Three angles give the field's own axes, the directions along which its tide only stretches or squeezes. Three more
numbers give the velocity of the field's **rest frame**: the point of view, with its own rulers and clocks, of the one
observer for whom the stretch and the twist share those axes.[^regroup]

![Look first at the dividers of the two bars, which do not line up. Above are the ten numbers of one reading as the
pixel records them, and below is the same reading regrouped, with no group below taken from a group
above.](tut-ten-numbers){#fig:regroup}

Each regrouped number is computed from all ten numbers of the reading, so the four invariants are not a selection from
the tide's five numbers. The regrouping needs the tide's three stretches to differ. One round body alone is the
exception: its tide is the same in every direction across the line to it, and a pixel moving along that line reads no
twist, so that part of its speed cannot be read.[^round]

In a room whose masses are all at rest, a pixel at rest reads no twist, so the field's rest frame is the room's. A
moving pixel then finds its own velocity from one reading, at any speed, with no map of the room. A pixel that reads
the tide of a room, about $10^{-8}\unit{s^{-2}}$ near a person, to one part in $10^8$ finds its speed to about
$2\unit{m\,s^{-1}}$, the pace of a brisk walk. Roughly, the error is the speed of light times the relative noise,
$3.00 \times 10^8\unit{m\,s^{-1}} \times 10^{-8} = 3\unit{m\,s^{-1}}$, which the paper's full formula refines to
2.[^speed]

However the pixel moves, a room at rest gives invariants of the form of a still room's. So when they leave that form,
something in the room moves or turns.[^light]

::: try {#speedometer}
Predict first: crossing a still room at 0.6 of the speed of light, will the pixel read its velocity correctly? Drag
the pixel and turn its heading. The orange arrow, read by gravity, hides the dark arrow of the true velocity; the blue
one, read by light, misses the part along the dotted line. Set a mass flying and drag the pixel near it: the dark arrow
appears, and the motion test jumps.
:::

## Four special directions sort every reading

Every reading also picks out four directions on the sky around the pixel, the solutions of an equation of the fourth
degree built from it. These are the field's **principal null directions**, and their pattern sorts fields into kinds, a
sorting called the **Petrov classification**.[^petrov] For a single wave, all four point along its direction of travel.
For a single round body at rest, two point towards the body and two directly away from it. For two bodies, and for most
other scenes, they are four separate directions; only special arrangements, such as two bodies on one line through the
pixel, give fewer. So one reading says whether the field could come from one body, could come from one wave, or needs
more.

{{paper fig:stars}}

The figure calls these kinds types N, D and I. Its $\hat k$ is the wave's direction of travel. A body moving across
the line to the pixel folds its two pairs towards its motion, and $\mathbf v_\perp$, in metres per second, is that
sideways velocity.[^state]

## One pixel separates several waves, and tells a wave from a nearby pull

Waves crossing a pixel together add their tables, yet one pixel can separate them: two waves from a single reading,
three at one frequency, and four from a record over time. In one reading, two waves use eight of the ten numbers, four
each. Over a record the directions stay fixed, so each wave fills only two of the numbers that change, its two
polarization signals. Four waves fill eight, and the two left over at each moment, gathered over the record, fix the
four directions. Five fill all ten, and leave nothing to fix them. A sensor of light separates one, two and two.[^count]

::: try {#voices}
Predict first: the pixel finds four waves from its record. What will it find when a fifth is added? Raise the number of
waves to five, and read what the figure reports under each sky.
:::

Near slowly moving matter the twist is smaller than the stretch by about the ratio of the matter's speed to the speed
of light, while in a wave the two are equal.[^ratio] So the twist tells a wave from the pull of nearby things. A rotor
3 m away, with a hundred times the changing tide of a wave like those LIGO detects, spoils only the stretch. The pixel
reads the wave from its twist, which carries half its signal, and the uncertainty grows only by the square root of
two, 1.41, however strong the rotor, while the rotor's own twist stays below the noise.[^price]

## The field shows a moving body where it is now

The field of a body moving steadily is its still field carried along with it, so the stretch axis of its tide points
at where the body is now. Nothing outruns light: the field carries where the body was heading. If the body stops, the
field farther out points at where it would have been until the news, travelling at the speed of light, arrives. Light
shows the body where it was when the light set out. The angle between the two places, the **aberration** of light, is
in radians about the body's speed relative to the camera, across the line of sight, over the speed of
light.[^aberration] The Earth moves round the Sun at $29.8\unit{km\,s^{-1}}$, so the Sun seen in gravity lies

$$\frac{29.8\unit{km\,s^{-1}}}{3.00 \times 10^5\unit{km\,s^{-1}}} = 9.9 \times 10^{-5}\unit{rad} = 20.5''$$

ahead of the Sun seen in light, along its yearly path across the sky. An arcsecond ($''$) is a 3600th of a degree, and
$20.5''$ is the width of a 2 cm coin seen from 200 m.[^laplace]

::: try {#present}
Predict first: when the moving body stops, will the field everywhere turn at once to point at where it stopped? Press
*Stop it*, and watch where the field turns first. The scene runs in slow motion: light is not slowed, and the body
moves at 0.6 of light's speed.
:::

## No single reading tells the kind of scene

Place two masses near a pixel, at right angles as seen from it, the second with twice the tide of the first. Then
replace them by two equal waves crossing the pixel in opposite directions, along the line to the first mass. The two
scenes give the same ten numbers, because the stretches agree and the twists of the two waves cancel.[^blind] This is
the exception to the last three sections, which assume that the pixel knows what kind of scene it faces; without that,
no single reading can say which scene it comes from. A record over time, a wider array or knowledge of the sources
settles it.

::: check
### Q

In the figure of special directions, how do the four lie for two masses at rest, and what does that tell the pixel?

### A

They are four separate points, so the field is not that of one round body.

### Q

Why can a pixel crossing a still room of four masses find all three parts of its own velocity?

### A

Three of its ten numbers give the velocity of the field's rest frame, and in a still room that frame is the room's.

### Q

An array thirty wavelengths wide blurs a point over about 2°. About how wide is the blur of one a hundred wavelengths
wide?

### A

About 0.6°, because the blur falls in proportion to the width.
:::

**The idea to keep: a pixel records the wave itself, so an array computes its pictures without a lens; and one
pixel's ten numbers let it find its own motion, sort the scene, separate up to four waves and see a moving body where
it is now, if it knows the kind of scene.**

::: problems
### Practice

In the figure of the pixel crossing the room, turn the heading until the blue arrow, read by light, vanishes. How much
of the pixel's velocity does gravity then read?

::: solution
All of it, though the pixel moves along the dotted line, where light sees nothing.
:::

### Stretch

How much more finely must a pixel read a person's tide to find its speed to 1 cm s⁻¹ instead of 2 m s⁻¹?

::: solution
About 200 times more finely: to one part in $2 \times 10^{10}$.
:::

### The paper

In the plain words of [Section VII](/paper/#sec:no-lens), what would a real lens add to the camera?

::: solution
Only a quantum advantage: gathering the faintest waves before detection lets the camera count single gravitons
instead of recording mostly noise.
:::
:::

::: paper
- [Section VII](/paper/#sec:no-lens) and its plain words: why there is no lens, and the computed image.
- [Section VIII](/paper/#sec:one-pixel) and its plain words, and Table [](/paper/#tab:one-pixel).
:::

::: deeper
- Chapters 9.1 to 9.7, R9 and R9b teach one point of the field, and [6.3](/tutorial/relativity/aberration/) aberration, on
  the [route to Section VIII](/tutorial/#route-section-viii).
- The [GR course, section 10.10](https://neovand.github.io/general-relativity/chapter-10.html#10-10-why-twenty-curvature-numbers-survive-local-flattening)
  counts the twenty numbers of curvature at a point, of which a pixel in empty space reads ten.
:::

[^optics]: The paper's [](/paper/#eq:index) gives $8 \times 10^{-14}$. Stated without proof in chapter 5.5, and
    read in R11.

[^hole]: Derived in chapter 11.1.

[^beam]: Chapter [5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array) derives beamforming and its sharpness.

[^onepixel]: The paper's [](/paper/#fig:array) explains it in its caption; chapter 9.6 derives it.

[^four]: Chapter [7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical)
    derives the two polarizations, and
    [1.5](/tutorial/newton/five-numbers/#across-a-wave-two-numbers-are-left-and-a-turn-of-45-swaps-them) the 45°.

[^spin]: Made precise in
    [1.5b](/tutorial/newton/complex-numbers/#a-tide-across-a-direction-is-one-complex-number-and-turning-the-axes-turns-it-back-by-twice-the-angle)
    and chapter 9.1.

[^charge]: Derived in chapter
    [6.6](/tutorial/relativity/maxwell-complex/#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle), and for
    gravity in chapter 9.3.

[^regroup]: The paper's equation [](/paper/#eq:polar), derived in chapters 9.2 and 9.3.

[^round]: Shown in chapter 9.3. Two bodies remove this blind spot.

[^speed]: Derived in chapter 9.3.

[^light]: Derived in chapter 9.3. Where light's electric and magnetic fields are parallel, a motion along them changes
    nothing, so a sensor of light reads at most two parts of its velocity (chapter
    [6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer)).

[^petrov]: Taught in chapter 9.4.

[^state]: Derived in chapter 9.4.

[^count]: Derived in chapter 9.5.

[^ratio]: The paper's equation [](/paper/#eq:magnetic-ratio), derived in chapters
    [7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)
    and [7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45).

[^price]: Derived in chapter 9.7.

[^aberration]: Derived in chapter
    [6.3](/tutorial/relativity/aberration/#at-small-speeds-the-shift-is-the-speed-across-the-line-of-sight-over-c).

[^laplace]: Laplace took this absence to mean that gravity travels far faster than light. Linearized gravity (chapters
    [7.4](/tutorial/geometry/linearized-gravity/#the-field-travels-at-the-speed-of-light) and 7.7) shows that general
    relativity predicts it, with gravity at light's speed.

[^blind]: R9b builds the two scenes.
