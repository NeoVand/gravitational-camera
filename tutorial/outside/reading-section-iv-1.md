---
id: R2
title: 'Reading Section IV, part 1: what the image is and what it cannot show'
question: "With Part 2 behind us, which of Section IV's claims about what a near-field image is, and what it can never show, can we now check for ourselves?"
part: '2'
requires: ['1.3', '1.4', '1.5', '1.6', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8']
paper: [sec:near-field, eq:tidal-brightness, eq:tidal-column, fig:sky-integral, eq:magnetic-point, eq:current-column, eq:split, eq:harmonic-point, fig:same-outside, fig:silent-flows, eq:evanescent, eq:array-data]
figures: [fig:sky-integral, fig:same-outside, fig:silent-flows]
live: [scene-locked-safe, same-outside]
---

[Section IV](/paper/#sec:near-field) of the paper, *The near field*, is one of its longest sections. Its first half
says what a near-field image is and what it can never show. The part read here holds a summary in plain words, six
headed paragraphs and the start of a seventh, eight numbered equations and three figures. Its scenes are the Moon, a
person, a steel ball with gold inside it, convection inside a star and the Earth's core. With Part 2
behind us, which of Section IV's claims about what a near-field image is, and what it can never show, can we now check
for ourselves?

This chapter reads that part in order, one heading for each stretch of text, and derives nothing new. It runs from the
section's first line to the end of *What breaks the tie*, then from the first paragraph of *How sharp* to the first
sentences after equation [](/paper/#eq:array-data). The three paragraphs in between, *What heat reveals*, *What an
applied tide reveals* and *A model-independent thermometer*, are read in reading chapter
[R4](/tutorial/response/reading-section-iv-3/), after Part 4. The rest of *How sharp* is read in R3, after Part 3. As in
[reading chapter R1](/tutorial/newton/reading-section-ii/), each claim gets the chapter that teaches it and a mark:
*checked here* (Parts 1 and 2 derive it, and we recompute its numbers), *read now, derived in Part N* (its proof comes
later), or *stated in the paper* (the paper takes it from outside its own argument, such as a theorem from a book or a
measured property of the Earth).

::: plain
The first half of Section IV says what the gravitational camera's pictures show. Near a scene, the camera reads the
tide of every mass around it. Nothing blocks the tide, so walls hide nothing, and the tide's strength follows the mass,
so the camera in effect weighs what it sees. Parts 1 and 2 derived all of this.

The section then says what the pictures cannot show. Many interiors pull exactly alike outside a body. The field
outside fixes one part of the density, its harmonic part, and is blind to the rest. So the picture that assumes least
puts its densest point on the surface and shows every round body as uniform. Part 2 proved this too.

A few claims need later parts: the twisting magnetic part of the tide (Part 7), the glow of heat (Part 10), and the
trembling of a warm body and its reply to an applied tide (Part 4).
:::

## The first half of Section IV is a map of what Part 2 has proved

Each row is one stretch of the section, in order. A row marked *mixed* holds claims of more than one kind. Figure
[](#fig:read-iv-map) draws the same map.

| Stretch of Section IV | Its main claim | Taught in | Mark |
|---|---|---|---|
| Plain words, to the second limit | No wall hides a mass; the outside does not settle the inside. | 1.3, 1.4, 2.5, 2.7 | mixed: heat R4, blur R3 |
| *How bright*, [](/paper/#eq:tidal-brightness) | A body's tide is $\tfrac{8\pi}{3}G\bar\rho\,\theta^3$. | 1.4 | checked here |
| *What the image is*, [](/paper/#eq:tidal-column) | The tide is the sky integral of the tidal column. | 1.5, 2.2, 2.3 | checked here |
| *The magnetic picture*, [](/paper/#eq:magnetic-point), [](/paper/#eq:current-column) | Moving mass makes an image of the current column. | 1.5, 1.6, 2.8; 7.5 | mixed: formulas Part 7 |
| *What the image cannot show* | The images are renderings of known scenes. | 1.3, 2.3, 2.5; 3.7 | mixed: blur Part 3 |
| *What the image does show*, [](/paper/#eq:split), [](/paper/#eq:harmonic-point) | The outside fixes the harmonic part, which never shows a core. | 2.1, 2.4, 2.5; 3.5 | mixed: completeness stated, white prior Part 3 |
| *What breaks the tie* | Spin and a pixel inside break the tie; rolls stay silent. | 1.6, 2.5, 2.8; 7.5, Part 10 | mixed: general spin Part 7, glow Part 10 |
| The Earth by three channels | Glow, pull and spin give a two-layer Earth. | 1.3, 1.6; Part 10 | mixed: glow Part 10, moment of inertia stated |
| *What heat reveals* to *A model-independent thermometer* | Heat and an applied tide break every tie. | Part 4 | read in R4 |
| *How sharp*, first paragraph, [](/paper/#eq:evanescent), [](/paper/#eq:array-data) | Fine detail fades as $e^{-kz}$; a uniform sheet has no tide. | 2.5, 2.7 | checked here |

![The ten stretches of the table, in order, each with its equation numbers if it has any and the chapters that teach
it beneath. A filled box is checked here, a half-filled box holds claims of more than one kind, and the dotted box is
read in R4. The rest of *How sharp* is read in R3.](tut-read-iv-map){#fig:read-iv-map}

## The plain words hold, number by number, to the second limit

The [summary in plain words](/paper/#sec:near-field) opens with three claims. "No wall can hide a mass", because
Gauss's law counts the mass inside a closed surface and has no term for what lies in between
([1.3](/tutorial/newton/gauss-and-poisson/#the-flux-out-of-a-closed-surface-counts-the-mass-inside), *checked here*).
The camera "weighs what it sees", because the stretch $2G\matter M/r^3$ beside a mass $\matter M$, in kilograms, at the
distance $r$, in metres, is in proportion to the mass
([1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it), *checked
here*). Here $\sym{gravitational-constant}{G} = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is Newton's
constant. Newton's potential depends only on where the masses are, so "a perfectly still scene is visible too"
([1.2](/tutorial/newton/field-and-potential/#gravity-pulls-with-a-force-proportional-to-both-masses), *checked here*).

The next paragraph brings in **density**, mass per unit volume, and the **angular size** of a body, its radius
divided by its distance. "Of two objects with the same density, the one that looks twice as wide raises a tide eight
times as strong", because the tide goes as the cube of the angular size and $2^3 = 8$
([1.4](/tutorial/newton/tides/#tidal-brightness-is-density-times-the-cube-of-angular-size), *checked here*). The Moon,
of mean density $3344\unit{kg\,m^{-3}}$ and angular size $4.52 \times 10^{-3}$, raises a stretch of
$1.73 \times 10^{-13}\unit{s^{-2}}$ at the Earth. The Sun, of $1408\unit{kg\,m^{-3}}$ and $4.65 \times 10^{-3}$,
raises $7.92 \times 10^{-14}\unit{s^{-2}}$. The two "look the same size in our sky", but the Sun looks 3 per cent
wider, which raises its tide by 9 per cent. The Moon is 2.38 times denser, so its tide is
$2.38/1.09 = 2.18$ times the Sun's, and it raises "the larger tide on the Earth because it is denser" (1.4, *checked
here*). The person's "fifty thousand times" is worked under *How bright*, and the mass "along that line of sight, with
nearer mass counting for more" is the tidal column of *What the image is*.

**The first limit.** By the **shell theorem**, a hollow shell and a solid ball of the same mass pull alike everywhere
outside them, because outside a round body only the mass inside counts
([1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts), *checked here*). That mass "can
be moved around inside a body … without changing its pull anywhere outside" is the null space of
[2.5](/tutorial/outside/null-space/#a-confined-laplacian-added-to-a-body-changes-nothing-outside) (*checked here*),
and the rest of the first limit is read under *What the image does show*.

"Other measurements break this tie", and the plain words name three.

- **Spin.** The magnetic part "depends on how far the mass lies from the axis", which the moment of inertia measures
  ([1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one), 2.8, *checked here*;
  the magnetic part is *read now, derived in Part 7*).
- **Heat.** The trembling of a warm body, seen through its pull, shows how its mass is arranged (Figure
  [](/paper/#fig:tremor); *read now, derived in Part 4*, and read in R4).
- **A tide applied from outside.** A brief tide leaves an energy that grows with how far the mass lies from the centre
  (*read now, derived in chapter [1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside)*, off
  this route). The full argument, which "Sections XII to XV develop", is *read now, derived in Part 13*.

**The second limit.** In empty space the potential obeys **Laplace's equation**, $\nabla^2\field\Phi = 0$, and a
ripple of the potential can then only fade with height
([2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade), *checked here*). A ripple whose crests
are 10 cm apart has the wavenumber $k = 2\pi/0.1\unit{m} = 62.8\unit{m^{-1}}$, and over the height $h$ it weakens by
the factor $e^{kh}$. At 10 cm the factor is $e^{2\pi} = 535$, the paper's "about 500 times weaker". At 20 cm it is
$e^{4\pi} = 2.87 \times 10^5$, the paper's "about 300,000 times" (*checked here*). The rest of the plain words, from
the hand under a blanket and Figure [](/paper/#fig:nearfield) to the count of bits, needs the noise of Part 3 and is
read in R3.

## A body's tidal brightness is its density times the cube of its angular size

After a short paragraph that repeats the plain words' three claims, the paragraph
[*How bright*](/paper/#par:how-bright) gives one equation:

{{paper eq:tidal-brightness}}

Here $\sym{mean-density}{\matter{\bar\rho}}$ is the body's mean density, in $\mathrm{kg\,m^{-3}}$, and
$\sym{angular-size}{\theta} = R/r$ is its angular size, a pure number. The units check, because
$G\matter{\bar\rho}$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg\,m^{-3}} = \mathrm{s^{-2}}$. Writing the
mass of a ball as $\tfrac43\pi R^3\matter{\bar\rho}$ turns the left side into the right
([1.4](/tutorial/newton/tides/#tidal-brightness-is-density-times-the-cube-of-angular-size), *checked here*). The
paper's "magnitude" here is the stretch, the eigenvalue of the tide that is largest in size, and not the length of the
whole table that chapter 1.5 gives every tide.

"A person one metre away … outweighs the Moon in the camera's view some fifty thousand times." Chapter 1.4 treats a
person of 70 kg as a ball of water, $1000\unit{kg\,m^{-3}}$, of radius $0.2557\unit{m}$. At 1 m, $\theta = 0.2557$
and $\theta^3 = 0.0167$, and both sides of the equation give

$$\frac{2 \times 6.674 \times 10^{-11} \times 70}{1^3}\unit{s^{-2}} = 9.34 \times 10^{-9}\unit{s^{-2}}.$$

Then $9.34 \times 10^{-9}/1.73 \times 10^{-13} = 54{,}000$, the "some fifty thousand" (1.4, *checked here*).[^rod]

## The image is the tidal column, and a pixel reads only five of its numbers

The paragraph [*What the image is*](/paper/#par:what-the-image-is) adds up the tide of all the matter in view,
direction by direction:

{{paper eq:tidal-column}}

Here $\sym{tidal-tensor}{\curv{\tE}}_{ij}$ is the tidal tensor, in $\mathrm{s^{-2}}$, $\sym{unit-vector}{\hat n}$ is a
unit vector from the pixel toward the matter, $\sym{solid-angle}{\dd\Omega}$ is a small patch of sky, in steradians,
and $\sym{density}{\matter\rho}$ is the density. The **tidal column** $S(\hat n)$ is the mass along the line of sight
in the direction $\hat n$, each part weighted by one over its distance, in $\mathrm{kg\,m^{-3}}$, so $GS$ is in
$\mathrm{s^{-2}}$ ([1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes), *checked
here*).

{{paper fig:sky-integral}}

In panel (a), the matter in a thin cone between $r$ and $r + \dd r$ has the volume $r^2\,\dd r\,\dd\Omega$ and a tide
that falls as $1/r^3$, so "the $r^2$ of the volume cancels two of the three powers of $1/r$" and leaves $\dd r/r$
(1.5, *checked here*). Panel (b) colours the sky by the weight $1 - 3\cos^2\vartheta$ with which matter enters
$\curv{\tE}_{zz}$, where $\vartheta$ is the angle from the $z$ axis. It vanishes at $\cos^2\vartheta = \tfrac13$, or
$\vartheta = 54.74°$, the caption's "$54.7^\circ$", and averages to zero over the sky, so "a uniform shell of matter
around the camera is invisible to it" (1.5, *checked here*).

"The integral starts a short distance $r_{\min}$ from the camera (a quarter of a metre in the scenes of this paper),
since matter at the camera itself would make $S$ diverge logarithmically, although not $\tE_{ij}$." Near the pixel each
line of sight adds the local density times $\dd r/r$, which grows without limit as $r_{\min}$ shrinks, while the
trace-free weight averages the nearby matter away
([2.3](/tutorial/outside/multipoles/#at-the-cameras-own-place-the-tide-stays-finite-while-the-tidal-column-grows-without-limit),
*checked here*). The tide stays finite inside smooth matter such as air and only jumps across a smooth face of a solid,
but at a sharp edge or corner of a solid some entries off the diagonal grow like the logarithm of one over the distance
to the edge (2.3's margin note).

"A single pixel measures only five numbers, the quadrupole of $S$ over the whole sky": each entry of the tidal weight
is a pattern of degree two on the sky, so a pixel reads the five coefficients of degree two of $S$ and nothing else
([2.2](/tutorial/outside/spherical-harmonics/#a-pixel-reads-only-degree-two-of-its-sky), *checked here*). "An array,
by comparing the field from pixel to pixel, measures more", because the tide of degree three and higher changes
across it ([2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics),
*checked here*).

## The magnetic picture images the current column, and its numbers can be checked before its formulas

The paragraph [*The magnetic picture*](/paper/#par:the-magnetic-picture) turns to the **magnetic part** of the tide,
$\sym{magnetic-tide}{\curv{\tB}}_{ij}$, in $\mathrm{s^{-2}}$, which moving masses make and which twists gyroscopes
instead of stretching rings. The paper works "to first order in $v/c$", where $v$ is the speed of the mass and $c$ the
speed of light. That is, it keeps the terms in $v/c$ and drops those in $(v/c)^2$, which are smaller by a
further factor $v/c$, $5 \times 10^{-9}$ for a walker. For one mass moving with velocity $\vect v$, the paper gives

{{paper eq:magnetic-point}}

The equation is *read now, derived in Part 7* (chapter
[7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)).
Its units check, because $G\matter M/cr^3$ is in $\mathrm{s^{-2}}$ divided by a speed. Grouping moving matter by
direction, as for the tidal column, gives

{{paper eq:current-column}}

The **current column** $\sym{current-column}{\vect J(\hat n)}$ is the mass flux $\matter\rho\vect v$ along a line of
sight weighted by $\dd r/r$, in $\mathrm{kg\,m^{-2}\,s^{-1}}$
([2.8](/tutorial/outside/flows/#the-current-column-is-the-flow-along-a-line-of-sight-weighted-by-inverse-distance),
*checked here*; the bracket in front is *read now, derived in Part 7*). "Only motion across the line of sight counts",
because $\hat n\times\vect J$ is zero for a vector along $\hat n$, so "the magnetic channel is the opposite of a
Doppler radar" (2.8, *checked here*). Its blur, at a signal-to-noise ratio "smaller by about $v/c$", is R3's.

"For a single moving mass $|\tB|/|\tE| = \sqrt3\,v_\perp/c$ (Frobenius norms) to first order in $v/c$", where $v_\perp$
is the speed across the line of sight. Given the paper's equation [](/paper/#eq:magnetic-point), 1.5's stretch problem
derives it ([1.5](/tutorial/newton/five-numbers/#across-a-wave-two-numbers-are-left-and-a-turn-of-45-swaps-them)). With
$\vect w = \hat n\times\vect v$, of length $v_\perp$, the bracket is the sum of the table $\hat n_iw_j$ and its
transpose, each of length $v_\perp$. The two stand at right angles, because the sum of the products of their matching
entries is

$$\sum_{ij}\hat n_iw_j\,\hat n_jw_i = (\hat n\cdot\vect w)^2 = 0 .$$

So the bracket has length $\sqrt2\,v_\perp$ and $|\curv{\tB}| = 3\sqrt2\,G\matter Mv_\perp/cr^3$, while the point-mass
tide $\mathrm{diag}(-2, 1, 1)\,G\matter M/r^3$ has $|\curv{\tE}| = \sqrt6\,G\matter M/r^3$. The ratio is
$3\sqrt2/\sqrt6 = \sqrt3$ times $v_\perp/c$. For a person walking past at $1.4\unit{m\,s^{-1}}$ it is

$$\frac{\sqrt3 \times 1.4\unit{m\,s^{-1}}}{2.998 \times 10^8\unit{m\,s^{-1}}} = 8.1 \times 10^{-9}$$

(*checked here*, given the equation). "One reading of one pixel gives the line on which a body lies", along the stretch
$-2G\matter M/r^3$ (1.4, *checked here*), and the ratio gives the sideways speed. The **principal null directions** are
four directions on the sky along which the field takes its simplest form
([0.4](/tutorial/evening/one-pixel/#four-special-directions-sort-every-reading)); that they give the sideways velocity
exactly at any speed, Section VIII's equation [](/paper/#eq:star-velocity), is *read now, derived in Part 9*.

"Outside a spherical body spinning with angular momentum $\mathbf L$ the field is exactly that of a spin dipole." Here
$\sym{angular-momentum}{\vect L}$ is the angular momentum, in $\mathrm{kg\,m^2\,s^{-1}}$. The paper's formula is *read
now, derived in Part 7*. The magnetic part outside a body comes from the **potential of the flow**,
$\int\matter\rho\vect v\,\dd V'/|\vect x - \vect x'|$ in $\mathrm{kg\,s^{-1}}$, built from the mass flux as Newton's
potential is built from the density. Outside a round body whose layers turn rigidly it is $\vect L\times\vect x/2r^3$,
which depends on nothing but $\vect L$
([2.8](/tutorial/outside/flows/#a-swirl-shows-through-its-angular-momentum-and-two-swirls-can-cancel), *checked here*).

- "A hollow shell and a solid ball of equal mass and size spinning at the same rate … differ in $\tB$ by their moments
  of inertia, a factor $5/3$": their moments of inertia are $\tfrac23\matter MR^2$ and $\tfrac25\matter MR^2$
  ([1.6](/tutorial/newton/motion/#a-turning-body-keeps-the-spread-of-its-mass-in-a-table-of-inertia)), and
  $\tfrac23/\tfrac25 = \tfrac53$. "At equal angular momentum they are identical outside, and so motion too can hide",
  since the potential of the flow depends only on $\vect L$ (1.6, 2.8, *checked here*).
- "A uniform ball of radius $2^{-1/5}R$ turning one way inside a shell … turning the other way … has no angular
  momentum, and outside it no magnetic field at all, though all of it moves." The ball of radius $a$ and the shell have the moments
  of inertia $\tfrac{8\pi}{15}\matter\rho a^5$ and $\tfrac{8\pi}{15}\matter\rho(R^5 - a^5)$, which cancel at opposite
  rates when $a^5 = R^5/2$, at $a = 0.871R$. With $\vect L = 0$ and every layer turning rigidly, the field outside
  vanishes (1.6, 2.8, *checked here*).
- The current column of "a ball turning at angular velocity $\boldsymbol\Omega$ about a point $\mathbf s$" is the
  velocity $\vect\Omega\times(r\hat n - \vect s)$ integrated with the weight $\dd r/r$ from the entry distance $a$ to
  the exit $b$ (2.8, *checked here*).
- "A smooth flywheel looks the same spinning or still … its current column is a vortex": its turning moves no mass
  to a new place (2.8, *checked here*).

## The field outside does not fix the tidal column, so the paper's images are renderings

The paragraph [*What the image cannot show*](/paper/#par:what-the-image-cannot-show) begins: "An array outside the
matter it views does not measure $S$ itself." Its first example is the shell and the ball of the shell theorem (1.3,
*checked here*).

Adding the density $\matter{\delta\rho} = \nabla^2\field\psi/4\pi G$, where $\sym{null-potential}{\field\psi}$ is a
smooth function in $\mathrm{J\,kg^{-1}}$ that vanishes outside the body together with its gradient (2.5 calls it
**confined**), "changes the potential by $\psi$ and so changes nothing outside" [@YurtseverMarzbanMeila2011]
([2.5](/tutorial/outside/null-space/#a-confined-laplacian-added-to-a-body-changes-nothing-outside), *checked here*).

"Ordinary positive densities $\rho_0 \pm \epsilon\,\delta\rho$ make such pairs out of real matter", where $\epsilon$ is
a pure number. For chapter 2.5's steel ball of radius 10 cm and density $\matter\rho_0 = 7850\unit{kg\,m^{-3}}$, with
$\field\psi = A(1 - r^2/R^2)^2$ and $A = \pi GR^2\matter\rho_0/3$, $\epsilon = 1$ is the largest value that keeps both
densities positive, and there the balls reach $13{,}100$ and $15{,}700\unit{kg\,m^{-3}}$ (*checked here*). The word
"ordinary" holds for small $\epsilon$: at $\epsilon = 0.1$ both balls stay within 10 per cent of steel's density.

"The tidal column is therefore a rendering of a known scene … and not a quantity the camera could reconstruct uniquely",
because the two balls of a pair have different tidal columns but the same field outside (2.5, *checked here*). "The
near-field images of this paper show $S$ computed from the scene and blurred by" the blur law, the paper's equation
[](/paper/#eq:resolution). In Figure [](/paper/#fig:locked-safe), panel (b) shows $S$ exactly, with the room, and panel
(c) exactly with the known room subtracted; only panel (d) is blurred. The blur is *read now, derived in Part 3*
([3.7](/tutorial/noise/blur-law/#what-the-law-means)), and R3 reads the panels.

::: try {#scene-locked-safe}
Predict first: the concrete floor of the room is mass too. Will it glow in the gravity view? Drag the divider to the
left edge for gravity, then drag the view to look round the safes and at the floor. Then decide a second question
before reading on: would a tidal camera standing on that floor read a uniform floor at all? The last section of this
chapter answers it.
:::

"Other channels break the ambiguity": the glow "shows a shell as a ring" (*read now, derived in Part 10*), spin "shows
its moment of inertia" (1.6, *checked here*), and heat or an applied tide "reveals the rest" (R4). The paragraph ends:
"inside a closed spherical shell it feels no tide from the shell at all". Every sphere about the centre inside the
hollow encloses none of the shell's mass, so the pull is zero throughout the hollow and has no difference from point to
point ([1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts), *checked here*).

## The field outside fixes the harmonic part, and the least assuming picture never shows a core

The paragraph [*What the image does show*](/paper/#par:what-the-image-does-show) gives the ambiguity its exact shape:

{{paper eq:split}}

Here $\sym{harmonic-part}{\matter\rho_h}$ is the **harmonic part** of the density, a density whose Laplacian vanishes
inside the body, and $\field\psi$ is confined. That the two parts are orthogonal, so that the split is unique, is
*checked here*
([2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see)).
That together they make up every density is the step that 2.5 sketched and the paper takes from Isakov's book
[@Isakov1990] (*stated in the paper*). The paper's condition, a body "whose outside is connected", is what lets "the
field outside" fix $\matter\rho_h$ "completely", since a camera outside cannot reach into a sealed hollow; the split
itself holds in any bounded body (2.5's gap box).

"The potential outside is built from the moments $\int\rho\,h\,\dd V$ of the density against functions $h$ harmonic in
the body" ([2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments), *checked here*).
"The second part has none of them, since $\int h\,\nabla^2\psi\,\dd V = \int \psi\,\nabla^2 h\,\dd V = 0$": the first
equality is Green's second identity
([2.1](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other)), with no surface
terms because $\field\psi$ and its gradient vanish there, and the second holds because $\nabla^2h = 0$ (2.5, *checked
here*).

"Any estimate of the interior that is linear in the data and treats every point inside alike and independently … is
itself harmonic: it is built from the data's own kernels, which are." Such an estimate uses a **white prior**: before
any reading, every point inside is assumed to vary by the same amount, independently of the others. Each reading is a
moment $\int\matter\rho\,h\,\dd V$ for some harmonic $h$, its **kernel**, and the estimate adds these kernels with
weights, so it is harmonic too. The harmonic part also has the least $\int\matter\rho^2\,\dd V$ among all interiors with
the same outside (2.5, *checked here*). That the Wiener filter of the paper's
equation [](/paper/#eq:wiener) is of this kind is *read now, derived in Part 3*
([3.5](/tutorial/noise/wiener-filter/#a-linear-guess-cannot-keep-mass-positive-and-with-a-white-prior-it-is-harmonic)).

"By the maximum principle, the least assuming picture … has its densest and its lightest points on the surface. It can
never show a core." A harmonic function that is not constant takes its largest and smallest values only on the boundary
([2.1](/tutorial/outside/laplace/#in-empty-space-the-potential-has-no-peak-and-no-pit), *checked here*), and the
picture takes "the body's outline from light". "Every round body appears as a uniform
ball of its mean density", because a harmonic function of $r$ alone that is finite at the centre is a constant. For the
Earth it is the mass over the volume of a ball of radius 6371 km:

$$\matter{\bar\rho} = \frac{5.972 \times 10^{24}\unit{kg}}{\tfrac43\pi\,(6.371 \times 10^6\unit{m})^3} = 5513\unit{kg\,m^{-3}},$$

the paper's "$5513\,\mathrm{kg\,m^{-3}}$ throughout"
([2.5](/tutorial/outside/null-space/#the-least-assuming-interior-is-the-harmonic-part-and-it-never-shows-a-core),
*checked here*).

{{paper fig:same-outside}}

A steel ball of radius $R$ holds a gold nugget of mass $\matter m$ at the distance $s$ from its centre. The nugget's
harmonic projection, "the density harmonic in the ball that has the same field outside", is

{{paper eq:harmonic-point}}

Here $P_\ell$ are the Legendre polynomials of chapter 2.2 and $\vartheta$ is the angle from the nugget's direction
([2.5](/tutorial/outside/null-space/#the-harmonic-part-of-a-nugget-is-a-flush-on-the-near-wall) and its stretch
problem, *checked here*). For $s = R/2$ it is a **flush**, densest on the wall nearest the nugget, and at the surface
$t = sr/R^2 = \tfrac12$. At the near wall,
$\cos\vartheta = 1$, the denominator is $(1 - t)^5$ and the numerator factors as

$$3 - 10t^2 + 8t^3 - t^4 = (1 - t)^2\,(3 + 6t - t^2) ,$$

so the closed form is $(3 + 6t - t^2)/(1 - t)^3 = 5.75/0.125 = 46$ in units of $\matter m/4\pi R^3$, the paper's
"$46\,m/4\pi R^3$". The nugget's mass spread evenly would be $3\,\matter m/4\pi R^3$, and $46/3 = 15.3$, "fifteen
times". At the far wall, $\cos\vartheta = -1$, the same factoring with $-t$ in place of $t$ gives
$(3 - 6t - t^2)/(1 + t)^3 = -0.25/3.375 = -\tfrac{2}{27}$, "just below zero" (*checked here*). <!-- lint-allow: just -->

"Poincaré's balayage sweeps the same mass onto the surface as a skin of surface density $m(R^2 -
s^2)/4\pi R\,|\mathbf{x} - \mathbf{s}|^3$, thickest over the nugget"
([2.4](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage),
*checked here*). Over the nugget $|\vect x - \vect s| = R/2$, so the skin has
$\tfrac34R^2/(R \times \tfrac18R^3) = 6/R^2$ times $\matter m/4\pi$, the caption's "$6\,m/4\pi R^2$", six times the
nugget's mass spread evenly over the surface. Opposite the nugget the distance is $3R/2$ and the skin has
$0.22\,\matter m/4\pi R^2$.

"At any sensitivity, a camera outside cannot tell the three apart by their steady pull": all three have the moment
$\matter m\,h(\vect s)$ against every harmonic $h$
([2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read),
*checked here*). So the blue equipotentials are a point mass's in all three, and in (b) and (c) they "centre on a nugget
that is not there".

## Spin, heat and a pixel inside break the tie, and rolls stay silent

The paragraph [*What breaks the tie*](/paper/#par:what-breaks-the-tie) names the first number in which the three bodies
differ, $\int\matter\rho\,r^2\,\dd V$, the trace of the second moment of the mass. For the nugget, the flush and the
skin it is

$$\matter ms^2 = 0.25\,\matter mR^2, \qquad \tfrac35\,\matter mR^2 = 0.6\,\matter mR^2, \qquad \matter mR^2 .$$

The flush's value does not depend on $s$, because only its term of degree zero, the gold spread evenly, survives the
integral over directions. "$r^2$ is not harmonic", since $\nabla^2r^2 = 6$, so "the field outside carries no trace of
it" (2.5, *checked here*).

"The moment of inertia contains it, $I_x = \tfrac23\int\rho\,r^2\,\dd V + \int\rho\,(r^2/3 - x^2)\,\dd V$, where the
second integral is harmonic and shared." Chapter
[1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one) wrote the squared
distance from the $x$ axis as $r^2 - x^2$ and split it so; the second integrand is harmonic because
$\nabla^2(r^2/3) = 2 = \nabla^2x^2$ (*checked here*). With the nugget on the $z$ axis the shared part is
$\matter ms^2/3 = 0.083\,\matter mR^2$, and the gold's shares are

$$\begin{aligned}\text{nugget:}&\quad \tfrac23 \times 0.25 + 0.083 = 0.25,\\ \text{flush:}&\quad \tfrac23 \times 0.6 + 0.083 = 0.483,\\ \text{skin:}&\quad \tfrac23 \times 1 + 0.083 = 0.75,\end{aligned}$$

in units of $\matter mR^2$, the paper's "$0.25$, $0.48$ and $0.75\,mR^2$" (1.6's paper problem and 2.5, *checked
here*). Spun at the same rate, the three carry angular momenta, and so spin dipoles, in this ratio. "The ball and the
shell above … are the simplest case": the factor $5/3$ again.

::: try {#same-outside}
Choose *Gold off centre* and set A to the nugget and B to the flush. Predict first: as the nugget moves toward the
wall, does the flush's share of the moment of inertia change, and does it grow faster or slower than the nugget's?
Move the slider outward and read the row *Its share of the moment of inertia*; then make B the skin and move it again.
Compare how much each share has grown, and find where the nugget's share passes the flush's. Then answer the figure's
own two predictions.
:::

"The magnetic field of a body turning at a known rate holds $\int\rho\,r^2 h\,\dd V$ for every harmonic $h$, of which
the moment of inertia is the first, and for a round body the only one." For a round body whose layers turn rigidly the
field shows only $\vect L = \tfrac23\Omega\int\matter\rho\,r^2\,\dd V$ (2.8, *checked here*); for any shape the
statement is *read now, derived in Part 7*. "Heat breaks them all" is R4's.

"The thermal glow, which sums along lines instead of reaching out as a potential, would show the nugget as a spot, the
flush as a gradient and the skin as a ring", because lines that graze the skin run longest through it (*read now,
derived in Part 10*). "But the glow measures friction and temperature, not
mass" (*stated in the paper*, from [Section IX](/paper/#sec:first-image)).

"A pixel inside the matter escapes the ambiguity altogether, because there $\mathrm{tr}\,\tE = 4\pi G\rho$ reads the
density where the pixel is." This is Poisson's equation
([1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point), *checked here*); inside
steel the trace is $6.6 \times 10^{-6}\unit{s^{-2}}$, 700 times the person's stretch at a metre.

The next paragraph finds "a blind spot of the same kind for flows". Outside a body, $\curv{\tB}$ comes from the
potential of the flow. "If the flow is $\rho\mathbf{v} = \nabla\times\nabla\times\mathbf{V}$, with $\mathbf{V}$
vanishing together with its derivatives at the surface, that potential is a pure gradient outside, and $\tB = 0$
there." Here $\vect V$ is a vector field inside the body, in $\mathrm{kg\,s^{-1}}$, with the potential
$\sym{roll-potential}{\vect W} = \int\vect V\,\dd V'/|\vect x - \vect x'|$, in $\mathrm{kg\,m^2\,s^{-1}}$. Two
integrations by parts make the potential of the flow $\nabla(\nabla\cdot\vect W) - \nabla^2\vect W$. The second term
is $4\pi\vect V$, zero outside, and a gradient has no curl
([2.8](/tutorial/outside/flows/#rolls-are-silent-outside-because-their-potential-there-is-a-gradient), *checked
here*).

"Every confined flow that is the same all round an axis and turns in its meridian planes, such as the simplest
convection rolls inside a star or a planet's core, is of this form: it is silent outside, however fast it runs." A
**meridian plane** contains the axis, and such a flow is a set of **rolls** in those planes
([2.8](/tutorial/outside/flows/#every-steady-flow-round-an-axis-is-a-swirl-plus-rolls), *checked here*). "Of this
form" needs a body without a hole through it, although the rolls are silent in a body of any shape (2.8's margin
note), and "however fast" holds to first order in $v/c$.

"Of such a flow only the swirl about the axis shows, and only through its harmonic part." The **swirl** is the part
of the flow that goes round the axis. Rigidly turning layers show only through $\vect L$, and a swirl whose rate
changes with latitude shows through further moments
([2.8](/tutorial/outside/flows/#a-swirl-shows-through-its-angular-momentum-and-two-swirls-can-cancel), *checked
here*).

{{paper fig:silent-flows}}

The rolls stay "below $10^{-4}$ of the swirl's field". That is the accuracy of the paper's integration (*stated in the
paper*); by 2.8's proof the exact value is zero.

## Three channels together weigh the Earth's core

The last paragraph of [*What breaks the tie*](/paper/#par:what-breaks-the-tie) puts the channels together for the
Earth. "The glow gives the radius of the core, $3480\,\mathrm{km}$, from the kinks in its brightness." A line of sight
from the ground that grazes the core makes the angle $\arcsin(3480/6371) = 33.1°$ with the direction straight down,
and the glow's brightness changes its slope at that angle (*read now, derived in Part 10*; 1.6 describes it). "The
electric part gives the mass", by Gauss's law (1.3, *checked here*). "The magnetic part … gives the moment of inertia,
$0.331\,MR^2$", the measured 0.3307 rounded, which R1 used in Section II's formula (the formula *read now, derived in
Part 7*; the value *stated in the paper*, from the Preliminary Reference Earth Model [@DziewonskiAnderson1981]).

"A two-layer Earth with that core, mass and moment of inertia has a core of $12{,}500\,\mathrm{kg\,m^{-3}}$ and a
mantle of $4150\,\mathrm{kg\,m^{-3}}$." Chapter
[1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one) solved the two
conditions, with $q = 3480/6371 = 0.546$, $q^3 = 0.163$ and $q^5 = 0.0486$:

$$\begin{aligned}
\matter\rho_{\rm c}\,q^3 + \matter\rho_{\rm m}\,(1 - q^3) &= 5513\unit{kg\,m^{-3}},\\
\matter\rho_{\rm c}\,q^5 + \matter\rho_{\rm m}\,(1 - q^5) &= \frac{0.3307}{0.4} \times 5513\unit{kg\,m^{-3}} .
\end{aligned}$$

Here $\matter\rho_{\rm c}$ and $\matter\rho_{\rm m}$ are the densities of the core and the mantle. The first line is the
mass, and the second the moment of inertia against a uniform ball's $0.4\,\matter MR^2$. They give $12{,}505$ and
$4152\unit{kg\,m^{-3}}$ (*checked here*). Put back, the rounded densities give $5511\unit{kg\,m^{-3}}$ and
$0.3307$.

"The reference model's core averages $11{,}000$" (*stated in the paper*, from earthquake waves). "The difference is
the compression of the mantle under its own weight, which two numbers cannot resolve." The deep mantle is squeezed
denser, and two measured numbers can fix only two unknown densities, so the two-layer model puts that extra mass in the
core.

## Fine detail fades as the exponential of the depth, and a uniform sheet has no tide

The paragraph [*How sharp*](/paper/#par:how-sharp) begins in the empty space between the scene and the camera. A
pattern that repeats across the line of sight with **wavenumber**
$\sym{wavenumber}{k}$, $2\pi$ divided by the distance between its crests, in $\mathrm{m^{-1}}$
([2.6](/tutorial/outside/fourier/#across-a-plane-a-ripples-wavevector-points-across-its-crests)), fades as

{{paper eq:evanescent}}

Chapter [2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade) derived it, with $h$ for the height
above the pattern: a ripple $\cos(kx)$ must curve along the height as much as along the plane, and the only solution
that does not grow far away is $e^{-kh}$ (*checked here*; the plain words' 535 is this fade). The paper's $z$ is the
depth of the pattern below the sensor, and the equation also uses it as the height at which $\Phi$ is taken; at the
sensor the two are the same distance, so $e^{-kz}$ is the fade the sensor sees.

"To reconstruct the scene the camera must multiply each pattern by $e^{kz}$, and its noise with it", because the noise
is added at the sensors, after the fade ([2.7](/tutorial/outside/evanescent/#undoing-the-fade-multiplies-the-noise),
*checked here*). If the largest features stand $\sym{snr}{\SNR}$ times above their noise, a pattern is lost once
$e^{kz} > \SNR$, that is, once $kz > \ln\SNR$. Half the spacing of the finest crests kept is

$$\frac{\pi}{k_{\max}} = \frac{\pi z}{\ln\SNR} ,$$

the paper's "detail finer than about $\pi z/\ln\SNR$ cannot be recovered". This length divided by the distance $z$ is
an angle, $\pi/\ln\SNR$ radians, the same at every distance. At $\SNR = 10^3$, $\ln\SNR = 6.91$ and the
angle is $0.455$ radians, or 26.1°; at $10^6$ it is 13.0° (2.7, *checked here*). The plain words' 24° and 14° come
from the exact law, which keeps factors this estimate drops (*read now, derived in Part 3*, chapter 3.7).

We read the first sentences of the next paragraph. A flat array at the distance $z$ from a
sheet of **surface density** $\sym{surface-density}{\matter\sigma}$, in $\mathrm{kg\,m^{-2}}$, records the tide along
its normal. "With $\Phi = -GM/r$ the normal component above a mass is negative, a stretch, so we record $d =
-\tE_{zz}$": the entry along the line to one mass is $-2G\matter M/r^3$, and the sign change makes a mass below give a
positive bump (1.4, *checked here*). In Fourier space across the array the data are

{{paper eq:array-data}}

where the tilde marks the Fourier transform across the plane and $\tilde n$ is the noise. Chapter
[2.7](/tutorial/outside/evanescent/#the-camera-records-a-tide-which-weights-each-ripple-by-k) derived it: each ripple
of the sheet has the potential $-2\pi G\tilde{\matter\sigma}e^{-kh}/k$, and two derivatives along the height bring
down $k^2$ (*checked here*).

"The factor $k$ says that a uniform sheet is invisible: its pull is the same at every pixel and at every height, so it
has no tidal field at all." A uniform sheet has all its density in the ripple $k = 0$, where the factor vanishes
([2.7](/tutorial/outside/evanescent/#only-the-uniform-part-of-a-layer-is-lost-and-the-factor-k-is-the-reason)). An
endless sheet pulls with $2\pi G\matter\sigma$ at every height
([1.3](/tutorial/newton/gauss-and-poisson/#a-uniform-sheet-pulls-equally-at-every-height)), and a pull that does not
change from point to point has no tide
([2.5](/tutorial/outside/null-space/#a-uniform-sheet-is-invisible-to-a-tidal-camera), *checked here*). The locked
safe's floor, 0.3 m of concrete at $2400\unit{kg\,m^{-3}}$, or $720\unit{kg\,m^{-2}}$, treated as endless, pulls with

$$2\pi \times 6.674 \times 10^{-11} \times 720\unit{m\,s^{-2}} = 3.0 \times 10^{-7}\unit{m\,s^{-2}},$$

which a gravimeter reads at once and a tidal camera not at all. This answers the try block's second question: the
view draws the floor, but a tidal camera reads only its edges and unevenness.

## The ledger: Part 2 derives six of the eight equations read here

One more of the eight is derived in its integral, with its weight taken from Part 7.

| Equation | What it says | After Part 2 | Where it is derived |
|---|---|---|---|
| [](/paper/#eq:tidal-brightness) | a body's tide is $\tfrac{8\pi}{3}G\bar\rho\,\theta^3$ | derived | 1.4 |
| [](/paper/#eq:tidal-column) | the tide is the sky integral of $S = \int\rho\,\dd r/r$ | derived | 1.5, 2.2, 2.3 |
| [](/paper/#eq:magnetic-point) | the magnetic part of one moving mass | read | 7.5 |
| [](/paper/#eq:current-column) | the magnetic part is the sky integral of $\mathbf J$ | integral derived, weight read | 2.8; 7.5 |
| [](/paper/#eq:split) | every density is $\rho_h + \nabla^2\psi/4\pi G$ | derived; completeness stated | 2.5 |
| [](/paper/#eq:harmonic-point) | the harmonic projection of a nugget | derived | 2.5 |
| [](/paper/#eq:evanescent) | a ripple fades as $e^{-kz}$ | derived | 2.7 |
| [](/paper/#eq:array-data) | the array reads $2\pi Gk\,e^{-kz}\tilde\sigma$ plus noise | derived | 2.7 |

Every number read here is now checked, except four that the paper takes from elsewhere or from a later part: the
Earth's measured moment of inertia, the reference model's 11,000, the radius of the core from the glow, and the
$10^{-4}$ of the paper's integration.

R3 adds Section IV's equations from [](/paper/#eq:wiener) to [](/paper/#eq:hyperbolic) after Part 3, among them the
zeros of the shear [](/paper/#eq:shear-zeros) (3.9), R4 adds the four of heat and an applied tide after Part 4, and
chapter [7.5](/tutorial/geometry/gravitomagnetism/) adds the magnetic formulas.

::: check
### Q

Why can a camera outside the matter never reconstruct the tidal column $S$ that the paper's images show?

### A

A confined Laplacian $\nabla^2\field\psi/4\pi G$ can be added to a body without changing the field outside (2.5).
Such bodies have different tidal columns but give the same readings, so the images are computed from the known
scene.

### Q

Of the nugget, its flush and its skin, which has the largest moment of inertia about an axis across the line to the
nugget, and why does that not show in the pull?

### A

The skin, $0.75\,\matter mR^2$, against 0.483 and $0.25\,\matter mR^2$. The moment of inertia contains
$\int\matter\rho\,r^2\,\dd V$, and $r^2$ is not harmonic, so this integral is not one of the moments that make up the
field outside.

### Q

A person walks past at $1.4\unit{m\,s^{-1}}$ a metre away. How large is the magnetic part of their tide against the
electric part, in Frobenius norms?

### A

$\sqrt3\,v_\perp/c = \sqrt3 \times 1.4/(3.00 \times 10^8) = 8.1 \times 10^{-9}$.

:::

**The idea to keep: the first half of Section IV follows from Parts 1 and 2. The camera weighs what it sees, through any
wall, with a brightness set by density and angular size; but the field outside a body fixes only the harmonic part of
its density and the swirl of its flows, so the least assuming picture puts its extremes on the surface, and spin,
heat, an applied tide and the glow must break the tie.**

::: problems
### Practice

Rerun *What breaks the tie* for a nugget at $s = 0.7R$. Find the three bodies' $\int\matter\rho\,r^2\,\dd V$ and the
gold's shares of the moment of inertia about an axis across the line to the nugget. Do the shares still come in the
order nugget, flush, skin? How far out must the nugget be for its share to pass the flush's?

::: solution
The integrals are $\matter ms^2 = 0.49\,\matter mR^2$ for the nugget, $0.6\,\matter mR^2$ for the flush, which does not
depend on $s$, and $\matter mR^2$ for the skin. The shared harmonic part is $\matter ms^2/3 = 0.163\,\matter mR^2$, so
the shares are $\tfrac23 \times 0.49 + 0.163 = 0.49$, $\tfrac23 \times 0.6 + 0.163 = 0.563$ and
$\tfrac23 \times 1 + 0.163 = 0.830\,\matter mR^2$, in the same order as before. The nugget's share is $\matter ms^2$
and the flush's is $0.4\,\matter mR^2 + \matter ms^2/3$, so the nugget's passes the flush's when
$\tfrac23 s^2 = 0.4R^2$, at $s = \sqrt{0.6}\,R = 0.775R$.
:::

### Stretch

Combine chapters 2.3 and 2.5. A camera on the ground could, in principle, read every moment $\matter Q_{\ell m}$ of the
Earth against the solid harmonics $r^\ell Y_{\ell m}$. Explain why even all of them, read without noise, cannot give
the radius of the core of a round Earth, and name the paper's channel that does.

::: solution
For a round Earth every moment with $\ell \ge 1$ integrates a pattern of degree $\ell$ over directions, which gives
zero by chapter 2.2's orthogonality, and the moment with $\ell = 0$ is the mass. So every round Earth of the same mass
has the same field outside, and the radius of the core lies in the null space (2.5). The glow, which adds up along
lines of sight, gives it from the kinks in its brightness (Part 10).
:::

### The paper

Reproduce the numbers of *What the image does show* and its figure: the $5513\unit{kg\,m^{-3}}$ of the layered Earth,
the flush's $46\,\matter m/4\pi R^3$ at the near wall and "fifteen times", its dip below zero at the far wall, and the
skin's $6\,\matter m/4\pi R^2$ over the nugget, all for $s = R/2$.

::: solution
The round body's harmonic part is its mean density, $5513\unit{kg\,m^{-3}}$ for the Earth. With $t = \tfrac12$ the
closed form of the flush gives $5.75/0.125 = 46$ at the near wall, $46/3 = 15.3$ times the gold spread evenly, and
$-0.25/3.375 = -2/27$ at the far wall, in units of $\matter m/4\pi R^3$. The skin over the nugget has
$(0.75R^2)/(R \times 0.125R^3) = 6/R^2$ times $\matter m/4\pi$.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), its plain words to the second limit.
- [*How bright*](/paper/#par:how-bright) and [*What the image is*](/paper/#par:what-the-image-is): equations
  [](/paper/#eq:tidal-brightness) and [](/paper/#eq:tidal-column), and Figure [](/paper/#fig:sky-integral).
- [*The magnetic picture*](/paper/#par:the-magnetic-picture): equations [](/paper/#eq:magnetic-point) and
  [](/paper/#eq:current-column); equation [](/paper/#eq:star-velocity) of [Section VIII](/paper/#sec:one-pixel) for
  the exact sideways speed.
- [*What the image cannot show*](/paper/#par:what-the-image-cannot-show) and
  [*What the image does show*](/paper/#par:what-the-image-does-show): equations [](/paper/#eq:split) and
  [](/paper/#eq:harmonic-point), Figure [](/paper/#fig:same-outside), and Figure [](/paper/#fig:locked-safe) as a
  rendering.
- [*What breaks the tie*](/paper/#par:what-breaks-the-tie): Figure [](/paper/#fig:silent-flows) and the two-layer
  Earth; the glow is [Section IX](/paper/#sec:first-image)'s, and applied tides are
  [Section XIII](/paper/#sec:second-order)'s.
- [*How sharp*](/paper/#par:how-sharp), its first paragraph and the first sentences after equation
  [](/paper/#eq:array-data).
:::

::: deeper
- The [GR course, section 17.7](https://neovand.github.io/general-relativity/chapter-17.html#17-7-rotation-kerr-frame-dragging-and-carefully-qualified-no-hair-claims)
  treats frame dragging, the relativistic form of the magnetic picture, and how little a black hole's outside shows of
  what fell in.
- Adam Dziewonski and Don Anderson, "Preliminary reference Earth model", *Physics of the Earth and Planetary Interiors*
  25 (1981): the Earth's density by depth, which the two-layer model compresses into two numbers.
:::

[^rod]: The paper's "some fifty thousand" is for a person modelled as a ball of water. Chapter
    [2.3](/tutorial/outside/multipoles/#a-body-that-is-not-round-has-a-tide-that-the-ball-model-misses) models the
    person as an upright rod 1.7 m long and finds a stretch of $5.63 \times 10^{-9}\unit{s^{-2}}$ at a metre, 0.60 of
    the ball's and about 33,000 times the Moon's. A real body lies between the two.
