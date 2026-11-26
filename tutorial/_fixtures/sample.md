---
id: X.1
title: 'A sample chapter: the tide of one mass'
question: 'How much does the pull of a mass $M$ change across a ring one metre wide?'
part: X
requires: ['1.2', '1.3']
paper: [eq:tidal, eq:newton, sec:pixel]
figures: [fig:tidal]
live: [tidal-rings]
depth: A
---

This section is a test of the tutorial's renderer and is never published. It uses every kind of block a chapter
can hold, so that a test can check each one. Its physics is the Newtonian tide, as section 1.4 will teach it.

::: plain
A **tide** is the difference between the pull of gravity at two nearby places. A small ring of free balls near a
mass is stretched along the line to the mass and squeezed across it.
:::

## A tide is a difference in gravity

Here $\sym{potential}{\field{\Phi}}$ is the gravitational potential, an energy per unit mass, measured in joules
per kilogram. Near a body of mass $\sym{mass}{\matter{M}}$ at distance $r$ it is

$$\field{\Phi} = -\frac{G\matter{M}}{r}. \label{eq:potential}$$

We differentiate the potential twice. The table of second derivatives is the
**tidal tensor**[^unit]

$$\sym{tidal-tensor}{\curv{\mathcal{E}}}_{ij} = \partial_i \partial_j \field{\Phi}, \label{eq:hessian}$$

which is the paper's own equation for the Newtonian limit:

{{paper eq:newton}}

Equation [](#eq:hessian) follows from \eqref{eq:potential}, and the paper's general definition is its equation
[](/paper/#eq:tidal) in Section [](/paper/#sec:pixel). The next section, [](#the-tide-of-one-mass), puts in
numbers.[^two]

{{paper eq:tidal}}

## The tide of one mass

::: derivation
### The second derivatives of $1/r$

We write $r = \sqrt{x_k x_k}$, so that $\partial_i r = x_i / r$. Differentiating once gives

$$\partial_i \frac{1}{r} = -\frac{x_i}{r^3}.$$

Differentiating again, with the product rule, gives

$$\partial_i \partial_j \frac{1}{r} = \frac{3 x_i x_j - r^2 \delta_{ij}}{r^5}.$$
:::

Along the line to the mass the tide is $\boxed{\curv{\mathcal{E}}_{rr} = -2G\matter{M}/r^3}$, a stretch.

::: gap
This sketch treats the mass as a point. A body of finite size has the same tide outside it only if it is
spherical, which section 1.3 shows with the shell theorem.
:::

::: example
### A person one metre away

A person of mass 70 kg at a distance of 1 m makes a tide of $2GM/r^3 \approx 9 \times 10^{-9}\unit{s^{-2}}$. Two
free balls 1 m apart along the line to the person would drift apart by about 5 nm in one second.
:::

{{paper fig:tidal}}

::: try {#tidal-rings}
Predict which way the ring beside the mass will stretch before you look. Then watch the three rings: the ring near
a single mass stretches along the line to it, and the ring in a wave turns its stretch as the wave passes.
:::

::: check
### Q

How large is the tide of a 70 kg person at a distance of 2 m, compared with 1 m?

### A

The tide falls as $1/r^3$, so it is eight times smaller: about $1.2 \times 10^{-9}\unit{s^{-2}}$.

### Q

Why does a uniform pull, the same at every point, make no tide?

### A

A tide is a difference in the pull between two places. If the pull is the same everywhere, the difference is zero.
:::

::: check
What is the unit of the tidal tensor?
:   The second derivative of an energy per unit mass with respect to position: joules per kilogram per square
    metre, which is the same as $\mathrm{s^{-2}}$.
:::

**The idea to keep: a tide is the second derivative of the potential, and a pixel measures it.**

::: problems
### Practice

Compute the tide of the Earth at its surface, with $M = 6.0 \times 10^{24}\unit{kg}$ and $r = 6.4 \times 10^6\unit{m}$.

::: solution
$2GM/r^3 = 2 \times 6.7 \times 10^{-11} \times 6.0 \times 10^{24} / (6.4 \times 10^6)^3 \approx 3.1 \times 10^{-6}\unit{s^{-2}}$.
:::

### Stretch

Show that the trace of the tidal tensor outside matter is zero.

::: solution
The trace is $\partial_i\partial_i\Phi = \nabla^2\Phi$, which is zero where there is no mass, by Poisson's equation.
:::

### The camera

Derive the paper's equation [](/paper/#eq:newton) from equation [](#eq:hessian).

::: solution
The two are the same statement: the paper writes the tidal field as the Hessian of $\Phi$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) defines the tidal field that one pixel measures.
- [Equation (3)](/paper/#eq:newton) is the Newtonian limit derived here.
:::

::: deeper
- The [GR course, chapter 10](https://neovand.github.io/general-relativity/chapter-10.html) derives the tide from
  curvature, as geodesic deviation.
:::

::: history
### Newton and the tides of the sea

Newton explained the ocean tides in the *Principia* (1687) as the difference between the Moon's pull on the near
and far sides of the Earth.
:::

Gravitational-wave detectors measure the same quantity [@ThorneWinstein1999].

[^unit]: The unit of $\curv{\mathcal{E}}_{ij}$ is $\mathrm{s^{-2}}$, because a potential is measured in
    $\mathrm{m^2\,s^{-2}}$ and each derivative divides by a metre.

[^two]: A margin note may hold two paragraphs.

    This is the second, with a link to [the paper](/paper/#sec:pixel).
