---
id: R13b
title: 'Reading Sections XIV and XV, with the capstone: a black hole and a moon of one mass'
question: 'With chapters 13.7 and 13.8 behind us, which claims of Sections XIV and XV can we derive or check, where does the paper say more than it shows, and what would a camera read of a black hole and of a rocky moon of the same mass?'
part: '13'
requires: ['2.5', '3.8', '4.2', '4.5', '4.6', '8.1', '8.6', '11.2', '11.3', '11.4', '13.1', '13.3', '13.7', '13.8']
paper: [sec:hole, eq:horizon-friction, eq:hole-noise, eq:hole-thermometer, eq:hole-sum-rule, fig:hole-response, tab:hair, sec:holography, eq:dp-energy, sec:conclusion, sec:status]
figures: [fig:hole-response]
live: [hole-response]
---

**What you need:** chapters
[2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see),
[3.8](/tutorial/noise/bits/#a-bodys-field-at-one-time-holds-about-1200-bits-from-three-radii-away),
[4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density),
[4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust),
[4.6](/tutorial/response/fluctuation-dissipation/#a-push-shaped-like-the-reading-makes-a-thermometer-that-needs-no-model-of-the-body),
[8.1](/tutorial/quantum/states/#a-record-of-the-place-multiplies-the-interference-by-the-overlap-of-the-records),
[8.6](/tutorial/quantum/quantum-limit/#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera),
[11.2](/tutorial/black-holes/spin/#a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in),
[11.3](/tutorial/black-holes/hawking/#mode-by-mode-a-hole-is-a-grey-body),
[11.4](/tutorial/black-holes/under-tides/#the-friction-trembles-at-the-holes-temperature),
[13.1](/tutorial/what-a-field-keeps/push-and-pass/),
[13.3](/tutorial/what-a-field-keeps/ladder/),
[13.7](/tutorial/what-a-field-keeps/thermometer/#no-distribution-of-positive-mass-has-the-holes-first-three-sums) and
[13.8](/tutorial/what-a-field-keeps/holography/#pushing-reads-the-volume-but-only-to-a-number-of-cells-set-by-the-logarithm),
with [1.5](/tutorial/newton/five-numbers/), [1.7](/tutorial/newton/hamilton/), [1.8](/tutorial/newton/orbits-and-kicks/),
[2.8](/tutorial/outside/flows/), [3.2](/tutorial/noise/random-signals/), [4.1](/tutorial/response/oscillator/),
[6.4](/tutorial/relativity/energy-and-momentum/), [7.5](/tutorial/geometry/gravitomagnetism/),
[11.1](/tutorial/black-holes/schwarzschild/), [12.2](/tutorial/sky/universe/),
[13.2](/tutorial/what-a-field-keeps/calderon/), [13.4](/tutorial/what-a-field-keeps/flows-inside/),
[13.5](/tutorial/what-a-field-keeps/impulsive-waves/) and [13.6](/tutorial/what-a-field-keeps/algebra-of-moments/) for
smaller steps, and [R13](/tutorial/what-a-field-keeps/reading-sections-xii-and-xiii/), whose key this chapter follows.
The Conclusion's reading points across the tutorial.

The paper's Table [](/paper/#tab:hair) sets a stone beside a black hole, row by row. In the stone's column almost every
row reads the interior; the hole's column returns little more than its mass and spin. The paper's
[Section XIV](/paper/#sec:hole) fills the hole's column, and its [Section XV](/paper/#sec:holography) asks what is left
of holography once the stone's column is known. With chapters 13.7 and 13.8 behind us, which claims of these two
sections can we derive or check, where does the paper say more than it shows, and what would a camera read of a black
hole and of a rocky moon of the same mass?

We read the two sections paragraph by paragraph. Each claim is *checked here* (a number recomputed from an earlier
result), *read now, derived in chapter N*, or *stated in the paper* (cited there without proof). A bare chapter number
in parentheses, as "(13.7)", marks a smaller step derived in that chapter. This is the last reading chapter.

![Look first at the solid boxes: every paragraph of Sections XIV and XV rests on chapters of Parts 1 to 13, with its
stated results in dotted insets. The hatched corners mark a step sketched at depth B, and the flags mark where the paper
says more than it shows. The last box follows one hole and one moon down the table's
rows.](tut-read-xiv-xv-map){#fig:read-xiv-xv-map}

::: plain
Section XIV pushes a black hole with tides. A steady tide raises no bulge on it. A changing tide loses energy into it,
as if its horizon had friction, and its shape trembles at the temperature that Hawking found, which the mass sets. Its
replies to the three broadest tides, added up over every rate of change, would need a body with negative mass.

Section XV counts what the outside of a body holds. Looking gives a list of averages that grows like a surface. A push
followed by a weighing reaches the inside, though the details grow only as the cube of the number of digits of the
camera's precision. A ball and a shell of one mass and energy pull alike, so gravity keeps no record of which one a
body is; yet they differ in the energy by which Diósi and Penrose proposed that gravity ends a superposition.
:::

## Section XIV's plain words: a hole has no bulge, has friction, and trembles at its own temperature

In the box, a hole that does not turn has "Love numbers of exactly zero", its
horizon behaves as if it had friction (11.4), and its trembling divided by that friction is "exactly the temperature
that Stephen Hawking found" (13.7). This is chapter
[4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency)'s
**fluctuation–dissipation theorem**, that a warm body's trembling divided by its friction gives its temperature, with
Brownian motion as its first case
([4.2](/tutorial/response/temperature/#the-first-case-is-brownian-motion-and-the-next-ones-see-inside)). The box's
hole of 0.905 K is as warm as the graviton glow of the paper's Section XI (chapter 12.2).

## A hole raises no bulge, and its quadrupole answers a changing tide with friction alone

[*The response of a black hole to a tide*](/paper/#par:the-response-of-a-black-hole-to-a-tide): the **Love number**
$\sym{love-number}{k_2}$, a pure number, measures how far a steady tide makes a body bulge (4.6). A hole that does not
turn has $k_2 = 0$ [@BinningtonPoisson2009; @DamourNagar2009] (*read now, derived in chapter
[11.4](/tutorial/black-holes/under-tides/#a-steady-tide-raises-no-bulge-on-a-hole)*, as a sketch at depth B). A
turning hole gains a moment "by friction only", "since a tide that is not symmetric about the axis of spin is not
steady to the turning horizon" [@CharalambousDubovskyIvanov2021] (*stated in the paper*).

A hole of mass $\sym{mass}{\matter M}$ and Schwarzschild radius $\sym{schwarzschild-radius}{r_s} = 2G\matter M/c^2$,
in a tide that changes slowly, absorbs energy at the rate of the paper's

{{paper eq:horizon-friction}}

with $\sym{tidal-tensor}{\curv\tE}_{ij}$ and $\curv\tB_{ij}$ the electric and magnetic parts of the tide, in
$\mathrm{s^{-2}}$, the magnetic part being the one that moving masses make (7.5), and $\sym{horizon-friction}{\nu}$
the **horizon friction**, in $\mathrm{J\,s^5}$ (*read now, its form derived in chapter
[11.4](/tutorial/black-holes/under-tides/#a-changing-tide-loses-energy-through-the-horizon)*; the $\tfrac{16}{45}$ is
*stated in the paper* [@Poisson2004]). The two forms agree, since $r_s^5 = 32G^5\matter M^5/c^{10}$ and
$\tfrac{32}{90} = \tfrac{16}{45}$ (*checked here*).

The hole's quadrupole $\sym{hole-quadrupole}{\matter Q}_{ij}$, in $\mathrm{kg\,m^2}$, is defined by its energy
$\matter Q_{ij}\curv\tE_{ij}$ in a tide, "half of Newton's" trace-free moment (11.4). With
$\sym{response-function}{\chi}$ chapter 4.5's response, it answers with $\mathrm{Im}\,\chi = \nu\omega$ "and no
elastic part" (*read now, derived in chapter
[11.4](/tutorial/black-holes/under-tides/#the-holes-quadrupole-answers-a-tide-with-friction-alone)*)
[@GoldbergerRothstein2006]. In one line (*checked here*), a tide $\curv\tE_0\cos\omega t$ gives the reply the power
$\tfrac12\omega\,\mathrm{Im}\,\chi\,\curv\tE_0^2$ on average (4.1), and the friction takes
$\tfrac12\nu\omega^2\curv\tE_0^2$, so $\mathrm{Im}\,\chi = \nu\omega$. The horizon answers the magnetic part "with the
same friction" (stated in 11.4), so it absorbs the share $(16/5)G\nu\omega^6/c^5$ of a long quadrupole wave, the limit
of the paper's Section XI [@GoldbergerRothstein2020]. Since $\tfrac{16}{5}\cdot\tfrac{16}{45} = \tfrac{256}{225}$
(*checked here*), this is Don Page's $\tfrac{256}{225}(G\matter M\omega/c^3)^6$ (*read now, derived in chapter
[11.4](/tutorial/black-holes/under-tides/#the-same-friction-absorbs-long-gravitational-waves)*, as a sketch at depth
B).

## The quadrupole trembles at the Hawking temperature, and the tremor gives back the mass

[*The fluctuations of a black hole's quadrupole*](/paper/#par:the-fluctuations-of-a-black-holes-quadrupole): a hole
formed by collapse and left alone trembles "at frequencies far below $c/r_s$" with the flat spectrum of the paper's

{{paper eq:hole-noise}}

with $\sym{quadrupole-noise}{S_Q}$ in $\mathrm{kg^2\,m^4\,s}$ and $\sym{stf-projector}{\Pi_{ijkl}}$ chapter 1.5's
projector, which makes the five independent trace-free combinations of $\matter Q_{ij}$ tremble alike and independently
(*read now, derived in chapter
[11.4](/tutorial/black-holes/under-tides/#the-friction-trembles-at-the-holes-temperature)*, from 4.6's theorem at the
Hawking temperature [@GoldbergerRothstein2020]). At that temperature $\kB T/\hbar = c/4\pi r_s$, so $\hbar\omega \ll \kB
T$ needs frequencies far below $c/4\pi r_s$, a little stricter than the paper's $c/r_s$. There the chances of emitting
and of absorbing a quantum are both "the classical absorption times $\kB T/\hbar\omega$", because Planck's $n =
1/(e^{\hbar\omega/\kB T} - 1)$ and $n + 1$ are both close to $\kB T/\hbar\omega$ (11.3).

Inserting both into 4.6's thermometer gives the paper's

{{paper eq:hole-thermometer}}

(*read now, derived in chapter 11.4*, and read as a thermometer in
[13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)).
In one line (*checked here*),
$S_Q/2\kB\nu = (\hbar r_s^5/360\pi G)(90c^3/2\kB\matter Mr_s^5) = \hbar c^3/8\pi G\matter M\kB$. The result "is not
independent", since the noise was matched to Hawking's radiation, but it confirms that "the friction, found from the
growth of the horizon, and the absorption, found from the scattering of waves, are the same number". Chapter 11.3's
$\sym{greybody-factor}{\Gamma_2}$, the share of a quadrupole wave that the hole absorbs, is 1.013 times Page's form at
$x = G\matter M\omega/c^3 = 0.002$, a pure number, and 1.070 times at 0.01, an excess of about $2\pi x$ that vanishes
for long waves (11.4).

For the 0.905 K hole (*checked here*), $\matter M = 1.356\times10^{23}$ kg, $r_s = 0.201$ mm,
$\nu = 1.85\times10^{-23}\unit{J\,s^5}$ and $S_Q = 4.62\times10^{-46}\unit{kg^2\,m^4\,s}$. One entry,
$\matter Q_{zz}$, takes the share $\Pi_{zzzz} = \tfrac12(1 + 1) - \tfrac13 = \tfrac23$ of the noise, and white noise
of spectrum $S$ averaged over a time $\tau$ has the variance $S/\tau$
([3.2](/tutorial/noise/random-signals/#the-variance-of-white-noise-falls-as-one-over-the-observing-time)). So in one
second $\matter Q_{zz}$ trembles by $\sqrt{2/3}\sqrt{S_Q/1\unit s} = 1.76\times10^{-23}\unit{kg\,m^2}$. On the line $z$
through the hole its potential $-3G\matter Q_{zz}/z^3$ gives a tide of size $36G\matter Q_{zz}/z^5$ (11.4). A metre
away that tide trembles by $4.2\times10^{-32}\unit{s^{-2}}$, the paper's "$4\times10^{-32}$", while the steady tide
$2G\matter M/z^3$ is $1.81\times10^{13}\unit{s^{-2}}$, its "$2\times10^{13}$". A stone's tremor carries
$\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ for every pair of harmonic functions (4.2), and a hole's "carries $M$
again" (13.7).

## A hole weighs like a shell a little outside its horizon, yet its sums belong to no body

[*The weight of a black hole's response*](/paper/#par:the-weight-of-a-black-holes-response): for a round body under a
quadrupolar tide, the sum of the paper's [](/paper/#eq:sum-rule) is $\tfrac13\int\matter\rho\,r^2\,\dd V$, the
**tidal inertia** that a tide too fast for the body's bonds has to move
([4.5](/tutorial/response/causality/#a-blow-holds-every-frequency-and-the-energy-it-leaves-is-the-same-total)). For
the hole, $\mathrm{Im}\,\chi = 5c^5\Gamma_2/16G\omega^5$ at every frequency (*read now, derived in chapter
[11.4](/tutorial/black-holes/under-tides/#at-every-frequency-the-friction-is-the-greybody-factor)*, where it defines
the response by absorption). With Page's $\Gamma_2$ this is $(5c^5/16G\omega^5)\cdot\tfrac{256}{225}x^6 = \nu\omega$,
the friction again (*checked here*). The sum is the paper's

{{paper eq:hole-sum-rule}}

(*read now, derived in chapter
[13.7](/tutorial/what-a-field-keeps/thermometer/#a-holes-response-has-the-weight-of-a-shell-a-little-outside-its-horizon)*),
whose integral is a numerical result from 11.3's **Regge–Wheeler equation**, which carries a wave of one degree
across a barrier round the hole. With $\int\Gamma_2x^{-4}\,\dd x = 6.938$, $(5/32\pi)\times6.938 = 0.3451$, and a
shell of the hole's mass with this sum has the radius $\sqrt{3\times0.3451}\,r_s = 1.0175\,r_s$, the paper's
"$1.02\,r_s$" (*checked here*).

For a round body each tide of degree $\ell$ reads one moment $\int\matter\rho\,r^{2\ell-2}\,\dd V$.[^factor] Written as
radii of shells of the hole's mass with the same sums, they are 1.0175, 1.4555, 1.6100, 1.6868 and $1.7324\,r_s$ for
$\ell = 2$ to 6, the paper's "1.02, 1.46, 1.61, 1.69 and 1.73" (*read now, derived in chapter
[13.7](/tutorial/what-a-field-keeps/thermometer/#every-degree-of-tide-gives-its-own-shell-and-finer-tides-give-shells-farther-out)*,
the radii numerical, the formula a sketch at depth B). Their limit is $(3\sqrt3/e)\,r_s = 1.9116\,r_s$ (13.7, at
depth A), because at a high degree the hole absorbs like a step, taking every ray within the critical impact
parameter $\tfrac{3\sqrt3}{2}\,r_s = 2.60\,r_s$ (11.1). The $1/e$ comes from Stirling's rule for a root of a double
factorial.

For positive mass $\int\matter\rho\,r^2(r^2 - a)^2\,\dd V \ge 0$, with $a$ any number in $\mathrm{m^2}$.[^a] With
$m_1$, $m_2$ and $m_3$ the means of $r^2$, $r^4$ and $r^6$ over the mass, this is $m_3 - 2am_2 + a^2m_1 \ge 0$, which
holds for every $a$ exactly when $m_2^2 \le m_1m_3$, the **positivity test** (13.7). The hole's radii give
$m_1 = 1.0352\,r_s^2$, $m_2 = 4.4881\,r_s^4$ and $m_3 = 17.418\,r_s^6$, so $m_2^2/m_1m_3 = 1.117$. The least value,
$-2.039\,r_s^6$ at $a = 4.335\,r_s^2$, is times $\matter M$ the paper's "$-2.04\,Mr_s^6$ at $a = 4.34\,r_s^2$"
(*checked here*, by
[13.7](/tutorial/what-a-field-keeps/thermometer/#no-distribution-of-positive-mass-has-the-holes-first-three-sums)).[^rounded]
"One tide lets it be drawn as a shell, and three allow no drawing."

For one degree the hole only absorbs, $\Gamma_\ell \ge 0$, so $\omega\,\mathrm{Im}\,\chi_\ell$ is a **positive measure**
in frequency, a weighting that is nowhere negative, "as for every passive response" [@KehagiasRiotto2026], and its
moments pass every such test (13.7). "It is the sums across the degrees that belong to no body." A **step absorber**,
which takes every wave aimed inside a fixed impact parameter, fails worse, with the ratio 1.185 whatever the parameter
(*checked here*, by 13.7). "No matter does that to a gravitational wave": one crossing the Earth loses about $10^{-30}$
of its energy (13.7).

Matter's dispersion relation, $\chi(0) = (2/\pi)\int\mathrm{Im}\,\chi\,\dd\omega/\omega$, would give a body of radius
$r_s$ the Love number $k_2 = (15/128\pi)\int\Gamma_2x^{-6}\,\dd x = (15/128\pi)\times36.13 = 1.35$, in Section IV's
convention, where a ball of liquid has $\tfrac32$ (*checked here*, by
[13.7](/tutorial/what-a-field-keeps/thermometer/#the-friction-would-make-the-hole-yield-like-a-liquid-yet-its-love-number-is-zero)).
The hole's own is zero, so the relation needs a **subtraction**: a **local term**, a reply at the instant of the
push that is one real number at every frequency, added to the integral. That it cannot hold for a hole without one
"is known" [@Porto2016; @KehagiasRiotto2026]. If one subtraction suffices, the local term is $-1.35$ (13.7), and the
part "from waves near the hole's size, which the $1.35$ includes, cannot be told from such local terms"
[@GoldbergerLiRothstein2021].

{{paper fig:hole-response}}

In the caption the integrand peaks at $x = 0.40$, and the hole's $0.345\,\matter Mr_s^2$ ends 3.5 per cent above the
line of a thin shell at $r_s$, $\tfrac13\,\matter Mr_s^2$, and well above that of a uniform ball of that radius,
$\tfrac13\cdot\tfrac35\,\matter Mr_s^2$ (*checked here*).

::: try {#hole-response}
The paper's Figure, live, as in chapter 13.7: rings at each degree's shell radius, the radii against the degree,
and the test from degrees two, three and four against $a$, in units of $r_s^2$. It opens at degree two, with $a$ near
$4.34\,r_s^2$, where the test is least. Slide *Degree of the tide* (2 to 8) or tap a ring, and slide *The number a of
the test* (0 to 9).

Predict first. Which is the first degree whose ring lies beyond $1.75\,r_s$, and has
the ring of degree eight gone more or less than nine tenths of the way from the horizon to the dashed limit? Is the
test still below zero at $a = 6\,r_s^2$? Then slide and read.
:::

## The table, row by row: the stone's column reads the interior, and the hole's returns its mass

In Table [](/paper/#tab:hair), $\sym{snr}{\SNR}$ is a camera's signal-to-noise ratio, its reading over its noise
(3.8), and $m$ is the highest degree of the tides applied. Each entry is derived in the chapters named in its cell,
except three of the hole's, which are *stated in the paper*: "nothing more" for tides of degree up to $m$ and for two
tides in either order, and "set by its mass and spin" for a mass that passes.

| Row | A stone, a planet, a star | A black hole |
|---|---|---|
| The field at one time | 2.5, 2.8: the harmonic moments of its mass and flow | 11.2: seven numbers |
| Bits, at $\SNR$ | 3.8: about 1200 at $10^6$ from three radii | 3.8, 11.2: $7\log_2\SNR$ |
| A steady tide | 4.6: its Love numbers, its stiffness | 11.4: nothing |
| A changing tide | 4.5: when fast, the density | 11.4: when slow, $\nu$ |
| Tides of degree up to $m$ | 13.3: the rungs $j < m$ | stated: nothing more |
| The sums, tide by tide | 4.6, 13.7: a round body's density | 13.7: no positive mass |
| A mass that passes | 1.8, 13.1: the density | stated: its mass and spin |
| Two tides, in either order | 13.4: the flow | stated: nothing more |
| Its tremor | 4.2: the density, at a known temperature | 11.4, 13.7: the temperature |
| Its weight, after a tide | 1.7, 13.1: the density | 11.4: its mass |

The hole's last entry is the energy of the paper's [](/paper/#eq:horizon-friction), for the caption's tide "that
changes little in the time $r_s/c$", 11.4's slow tide with $x \ll 1$.

## Section XV's plain words: looking gives a surface's worth, and pushing gives the inside, slowly

A **hologram** is a record on a surface from which a field in the volume beyond can be rebuilt. **Balayage** sweeps a
body's mass onto a surface around it without changing its pull outside, and the **null space** holds the densities
that pull nothing outside (2.5). The swept skin is thus a hologram of the pull that loses the null space
([13.8](/tutorial/what-a-field-keeps/holography/#looking-at-a-body-gives-a-hologram-that-loses-the-null-space)). The
**holographic principle**, quantum gravity's claim that a region's boundary can hold all that lies inside it, is
*stated in the paper*, and classical physics keeps "a weaker statement that holds exactly".

The box's sphere of radius $R$ read "with detail down to a size $d$" carries "$(R/d)^2$" numbers, while the cells of the
body grow as "$(R/d)^3$". "But the size $d$ that can be read shrinks only slowly as the instrument improves": from three
body radii, at an $\SNR$ of $10^6$, "about 170 numbers" against about 270 cells, and at $10^{70}$ "about twenty thousand
and a quarter of a million" (*read now*, by 13.8's count). Pushing gains a factor 1.6 over looking at $10^6$ and about
twelve at $10^{70}$.[^Rd] "Doing something gives the inside" is 13.1's protocol, and the density "everywhere" is 13.2's.
The box's three differences from the quantum version, and its black hole, are read under *Black holes and the classical
limit*.

A **superposition** is a state in which a body is in two arrangements at once, and **decoherence** is the loss of
their interference when the surroundings record which one it is in (8.1). The box's ball and shell "with the same
mass and the same energy" pull alike outside at any one moment, so gravity keeps no record "unless a tide from
outside acts on the body". Outside they differ "only in the slight trembling of their pull over time", which heat and
the zero point make unequal, "and in their reply to such a tide" (13.8).

## A hole gives seven numbers, a temperature and its mass again, and without quantum physics no temperature

[*Black holes and the classical limit*](/paper/#par:black-holes-and-the-classical-limit): "the exterior field determines
the interior, with a resolution that sharpens as the logarithm of the sensitivity, so that the cells resolved grow as
its cube". Chapter
[13.8](/tutorial/what-a-field-keeps/holography/#pushing-reads-the-volume-but-only-to-a-number-of-cells-set-by-the-logarithm)
derives both laws, by a count that is the tutorial's own: cells shrink as $1/\ln\SNR$ and grow in number as
$(\ln\SNR)^3$; the bits grow as $(\ln\SNR)^4$ (13.2). The statement "is one about operations": for given tides, moments
and times, two interiors are either told apart or not, and the paper's [](/paper/#eq:split) says which for one reading
(2.5) and its [](/paper/#eq:ladder) for tides of a given degree (13.3).

For a hole, "seven numbers at one time" are its mass, place and spin
([11.2](/tutorial/black-holes/spin/#a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in)), and "a
temperature at two" is the thermometer, since a spectrum compares readings at two times (13.7). A weighing after a
slow tide "gives its mass again" (11.4), and what the hole gains under any tide "is set by its mass and spin alone"
(*stated in the paper*). "Whether the exterior field holds more is the question of the fate of what falls in."

Four quantum arguments, *stated in the paper*, say that the outside holds more [@LaddhaEtAl2021;
@ChowdhuryPapadoulakiRaju2021; @Donnelly2018; @CalmetEtAl2022], and chapter 13.8 reads them as the **holography of
information**, the argument that a region's boundary holds everything inside it. "The first two are said by their
authors to have no classical counterpart, and for a reading at one time they have none", by Newton's shell theorem
(2.5). From three radii the paragraph's moments, "about $170$ at $\SNR = 10^6$ and $2.2\times10^4$ at $10^{70}$",
against the cells that pairs resolve, "a gain of $1.6$ and of $12$", repeat the plain words' count (13.8).

"An impulsive tide followed by a weighing is what remains" of the first two without $\hbar$ (13.1, 13.8). It "needs
time" and gives "a density and a motion, not a state" (13.6). It is not peculiar to gravity: for charges, "the
analogue" of the paper's [](/paper/#eq:push) has "the square of the charge over the mass" (*checked here*), because a
charge $q$ of mass $m$ in the impulsive potential $-\epsilon g\,\delta(t)$ per unit charge receives the impulse
$q\epsilon\nabla g$ and so the energy $\tfrac12\epsilon^2(q^2/m)|\nabla g|^2$. What is peculiar to gravity is that no
part of a body "can be shielded from the tide", that "the quantity read is the mass itself", and that the result stays
"in the field outside", as weight (6.4).

On a black hole the method fails. "The square of a hole's tremor is of order $\hbar$": the spectrum $S_Q$ is
proportional to $\hbar$, so the tremor's size goes as $\sqrt\hbar$, and the paper's Table labels the tremor's row with
$S_Q$ (13.7). Without $\hbar$ the hole "is at zero temperature and has no tremor, and under a tide it gives only its
mass".

## A ball and a shell leave gravity no record, yet differ in their Diósi–Penrose energy

[*What gravity cannot decohere*](/paper/#par:what-gravity-cannot-decohere): "the null space has a meaning in quantum
mechanics". For a ball and a shell, "the nugget and its skin", or two stages of a round motion, the field outside at
one time is the same in both branches "if they have the same energy" (2.5, 6.4). A
superposition made by a round motion emits no graviton, by Birkhoff's theorem
([13.8](/tutorial/what-a-field-keeps/holography/#the-speed-of-light-does-not-add-the-third-dimension)). "To the
outside the branches differ only in readings at two times, in their tremor and in their response to a tide", the
paper's [](/paper/#eq:dust) (4.5, 13.8).[^impulses]

The **Diósi–Penrose energy** $\sym{diosi-penrose-energy}{E_G}$, in joules, is the gravitational self-energy of the
difference of the two densities [@Diosi1987; @Penrose1996]. For a ball and a shell of mass $\matter M$ and radius $R$
the fields $\field{\vect g}_{1,2}$ differ only inside, and it is the paper's

{{paper eq:dp-energy}}

(*read now, derived in chapter
[13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell)*). Its numerical factor
is "a matter of convention", so the time is fixed only up to such a factor. For a glass bead of radius 1 μm and
density 2200 kg m⁻³, $\matter M = 9.2\times10^{-15}$ kg, $E_G = 5.7\times10^{-34}$ J and $\hbar/E_G = 0.19$ s, "a
fifth of a second" (*checked here*).[^density] A bead that breathes by $\delta/R$ has
$E_G = \tfrac{9}{10}(\delta/R)^2G\matter M^2/R$ and a time longer by $R^2/9\delta^2$, $1.1\times10^5$ at
$\delta/R = 10^{-3}$ (13.8).

Decoherence by a record [@Belenchia2018; @DanielsonSatishchandranWald2022] is closed for such a pair, "save for tides
from outside", which act "at second order in the coupling" (13.1); a collapse of Diósi and Penrose's kind is not.
The sources, the experiment that ruled out the proposal's "simplest form" [@DonadiEtAl2021] and the dark-matter
remark [@AllaliHertzberg2020] are *stated in the paper*.

## The capstone: a black hole and a moon of one mass

![Look first at row (d): the moon's shell radii climb toward its surface and pass the test of positive mass, while the
hole's climb toward $1.91\,r_s$ and fail it. The numbers are exact and the ticks are to scale along each line; the
discs are not to scale.](tut-read-hole-moon){#fig:read-hole-moon}

The capstone sets the 0.905 K hole beside a rocky moon of the same mass, $\matter M = 1.356\times10^{23}$ kg, uniform at
3000 kg m⁻³, of radius $R_{\rm m} = (3\matter M/4\pi\matter\rho)^{1/3} = 2210$ km. Both meet one tide of profile $g =
\tfrac12(x^2 - y^2)$, in $\mathrm{m^2}$, whose strength rises and falls as a bell curve with a standard deviation of one
second. It peaks at $4.0\times10^{-11}\unit{s^{-2}}$, and its time integral, R13's impulse strength $\epsilon$, is
$10^{-10}\unit{s^{-1}}$. The tide is slow for the hole, with $x = 3.4\times10^{-13}$ at $\omega = 1\unit{s^{-1}}$, and
fast for the moon, which sound takes minutes to cross. Every row uses $G$, $c$, $\hbar$ and $\kB$; row (b) also needs a
rigidity, row (d) 13.7's integral of $\Gamma_2$, row (e) a temperature and row (g) 13.8's count of cells.

| Step | The hole | The moon | Chapter |
|---|---|---|---|
| (a) one time, $\SNR = 10^6$ | seven numbers, $7\log_2\SNR = 139.5$ bits | 1176 bits from $3R_{\rm m}$ | 3.8, 11.2 |
| (b) a steady tide | $k_2 = 0$ | $k_2 = 0.031$ | 4.6, 11.4 |
| (c) the tide, at $\omega = 1\unit{s^{-1}}$ | slow: $\mathrm{Im}\,\chi = \nu\omega = 1.85\times10^{-23}\unit{kg\,m^2\,s^2}$ | fast: $\chi = -A/\omega^2 = -1.32\times10^{35}\unit{kg\,m^2\,s^2}$, $A = \tfrac15\matter MR_{\rm m}^2$ | 4.5, 11.4 |
| (d) the sums | $0.345\,\matter Mr_s^2 = 1.90\times10^{15}\unit{kg\,m^2}$; shell at 0.205 mm; fails | $A$; shell at $0.775R_{\rm m}$; passes, $\tfrac{45}{49}$ | 4.5, 13.7 |
| (e) the tremor | $S_Q = 4.62\times10^{-46}\unit{kg^2\,m^4\,s}$: 0.905 K | at 1000 K, $\kB T\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V = 3.7\times10^{15}\unit{kg^2\,m^4\,s^{-2}}$ | 4.2, 11.4, 13.7 |
| (f) a weighing after the tide | $\nu\int\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}\,\dd t = 5.2\times10^{-44}$ J | $\tfrac12\epsilon^2\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V = 1.32\times10^{15}$ J | 1.7, 6.4, 11.4 |
| (g) the most any camera could read | 1450 bits at $2.3\times10^{62}$ | at most $2.8\times10^5$ cells at $2.6\times10^{72}$ | 8.6, 13.8 |

(b) Kelvin's rule, stated without proof in chapter
[4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number),
$k_2 = \tfrac32/(1 + 19\matter\mu/2\matter\rho g_{\rm s}R_{\rm m})$, with $g_{\rm s} = 1.85\unit{m\,s^{-2}}$ the moon's
surface gravity and $\sym{shear-modulus}{\matter\mu}$ its rigidity, gives 0.031 for 61 GPa, the rigidity for which
it gives our Moon its measured $k_2 = 0.024$ (stated).

(c) The hole answers with friction, a quarter of a cycle behind. The moon, driven faster than its bonds, answers as
dust, in step, with 4.5's $A = \tfrac13\int\matter\rho\,r^2\,\dd V$. (d) By the sum rule the moon's weight is the same
$A$, $7\times10^{19}$ times the hole's. Its shells of degree two, three and four lie at
$R_{\rm m}[3/(2\ell + 1)]^{1/(2\ell - 2)}$, or $0.775$, $0.809$ and $0.833\,R_{\rm m}$, climbing toward its surface;
its test is the last question below.

(e) The hole's thermometer returns 0.905 K, and so its mass. At a chosen 1000 K, the moon's tremor, the mean square
rate of change of its moment $\int\matter\rho\,g\,\dd V$ (4.2), is $\kB T$ times
$\int\matter\rho\,|\nabla g|^2\,\dd V = 2A = 2.65\times10^{35}\unit{kg\,m^2}$, and with every pair of profiles it
holds the whole interior.

(f) Weighed after the tide, the moon has gained $\epsilon^2A$, or 15 g, a reading of its density (1.7, 6.4). For
the hole, a tide from slow masses has almost no magnetic part (7.5), and this one gives
$\int\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}\,\dd t = 2.8\times10^{-21}\unit{s^{-5}}$; the gain returns its mass
again.

(g) Chapter 13.8's ceiling with the scene's own mass, $\SNR \le \matter Mc\,\ell_{\rm r}/\hbar$ for a camera in a
region of radius $\ell_{\rm r}$ watching for the time $2\ell_{\rm r}/c$, is $2.6\times10^{72}$ for the moon within
$3R_{\rm m}$. There pairs of held masses could resolve at most $2.8\times10^5$ cells, each 55 km across, against
$2.3\times10^4$ numbers by looking. For the hole within $3r_s$ the ceiling, $2.3\times10^{62}$, is
about half its entropy of $4.9\times10^{62}$ nats, a quarter of its horizon's area in Planck units (11.3). The ceiling
is of the order of the entropy, while the seven numbers carry at most 1450 bits, only its logarithm.

Row by row, the moon's column reads its interior: its stiffness, its density and, through heat, all of it. The hole's
column returns its mass again, by its tremor and by a weighing, and its summed replies fit no body of positive mass.

::: check
### Q

The camera beside the 0.905 K hole moves from one metre to two. By what factor do the tremor's tide and the steady
tide change?

### A

The tremor's tide falls as $z^{-5}$, by 32, to $1.3\times10^{-33}\unit{s^{-2}}$, and the steady tide as $z^{-3}$, by
8, to $2.3\times10^{12}\unit{s^{-2}}$. The tremor's tide falls four times faster.

### Q

Why does a warm ball differ from a shell in its tremor, while a classical pair at zero temperature shows the same
harmonic moments at every reading?

### A

Heat supplies impulses, and so does a quantum state's zero point; the tremor then holds
$\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$, which differs for the two. A classical pair at zero temperature has
no impulses, so every reading holds only the harmonic moments, which are equal.

### Q

The moon is uniform, so its means are $m_k = 3R_{\rm m}^{2k}/(2k + 3)$. Does it pass the test of positive mass, and
with what ratio $m_2^2/m_1m_3$?

### A

$m_1 = \tfrac35R_{\rm m}^2$, $m_2 = \tfrac37R_{\rm m}^4$ and $m_3 = \tfrac13R_{\rm m}^6$, so
$m_2^2/m_1m_3 = (9/49)/(1/5) = \tfrac{45}{49} = 0.918$, below 1, so the moon passes.
:::

## The ledger: five equations derived, with 16/45 stated and the greybody factor numerical

| The paper's equation | Its mark here: *read now, derived in chapter* |
|---|---|
| [](/paper/#eq:horizon-friction), the horizon's friction | 11.4 (its form; $\tfrac{16}{45}$ stated) |
| [](/paper/#eq:hole-noise), the hole's tremor | 11.4 |
| [](/paper/#eq:hole-thermometer), the thermometer | 11.4, 13.7 |
| [](/paper/#eq:hole-sum-rule), the weight of the response | 13.7 ($\Gamma_2$ numerical) |
| [](/paper/#eq:dp-energy), the Diósi–Penrose energy | 13.8 |

## The Conclusion follows from the chapters, though a few of its phrases say more

[Section XVI](/paper/#sec:conclusion), the *Conclusion*, gathers the paper in four paragraphs.

*Spin and two small numbers.* That "nearly all" the results follow from gravity's spin and from matter being slow and
tenuous is
[R5](/tutorial/waves/reading-section-iii/#one-property-of-gravity-and-two-small-numbers-of-matter-decide-what-the-camera-can-do)'s
reading. The "ten numbers" that spin two puts in one reading hold four principal null directions (9.4) and a rest
frame's velocity, unique when the four directions differ (9.3). The near field is seen where its source is now (6.3),
through any wall (0.2), and never sharply (3.7). Matter barely bends, reflects or stops a wave (R11), though a black
hole does all three (11.1, 11.3), and matter's glow is too faint for any detector made of matter (R10b).

*What each channel cannot tell apart.* The harmonic part of the density (2.5), the shell theorem's first order (13.1),
the mass that heat reveals (4.2, 13.2), the rung that each degree of tide adds (13.3) and the motion that tides read
(13.4) are derived as stated, and so are the rolls of "a flow round an axis" (2.8), friction tied to temperature
"in a count of gravitons" (R12) and the sky's limit of degree four "in the second moments of a reading" (9.6).
Two phrases leave out a condition: the rolls are silent only to first order in $v/c$ (2.8), and pressure is silent
for waves (7.6). "A black hole does not" means that its tremor and its weighing give nothing new (11.4, 13.7), and
"no more than the mass and the spin" is derived for a hole that does not turn and stated for one that turns.

*The vector and its square.* A pixel reads its own velocity only in a room at rest, and its test for motion misses a
single body in steady motion (9.3). It separates four waves where light separates two over a long record
([R9b](/tutorial/one-point/reading-section-viii-2/#one-pixel-separates-up-to-four-waves-and-light-two)). The precise
measurement from a blurred picture is 0.2's, and the 38 and 201 bits of a patch and the millimetre are R3's.

*Parts that exist.* The gradiometers, the satellite and the observatories' models that it names are R1's and 8.6's
(*stated in the paper*).

## Section XVII leaves six problems open, and the tutorial touched each

[Section XVII](/paper/#sec:status), *Open problems*, names six.

1. How much of a real body a finite record recovers "has not been worked out". Chapter 13.8 counts cells in one
   model, the tutorial's own.
2. The pair of the paper's [](/paper/#eq:dp-energy) is a test "described here and not designed". Chapter 13.8 gives
   its energy and its time.
3. The impulsive tide and weighing are exact in Newton's theory (1.7, 6.4) and for an impulsive plane wave (13.5).
   The general wave is unsolved, and 13.5 sketches only its closing condition.
4. Whether the full theory's moments "close on a known algebra is open". Chapter 13.6 gives their brackets to order
   $1/c^2$ and shows that their motions do not close at degree two and above.
5. A bound on sensitivity "needs the coupling, the resources and the task to be stated exactly". Chapter 13.8 states
   them for one model; a bound in general remains open.
6. The friction of real materials at the frequencies of heat "deserves a microscopic calculation". Chapter 10.3
   estimates it channel by channel.

**The idea to keep: a black hole answers every tide with its mass and spin, so its column holds seven numbers, a
temperature and its mass again, and its summed replies fit no body of positive mass. A stone's column reads its whole
interior, only as fast as the logarithm of the sensitivity allows, and a push and a weighing are what remains of
holography without $\hbar$.**

::: problems
### Practice

Rerun the capstone's hole for ten times the mass: its temperature, $\nu$, $S_Q$, the tremor's tide a metre away in a
second, the steady tide there, and the shell radii.

::: solution
$T = 0.0905$ K. $\nu$ grows as $\matter M^6$, $10^6$ times, to $1.85\times10^{-17}\unit{J\,s^5}$, and $S_Q$ as
$r_s^5$, $10^5$ times. The tremor's tide grows as $\sqrt{S_Q}$, to $1.3\times10^{-29}\unit{s^{-2}}$, and the steady
tide ten times, to $1.8\times10^{14}\unit{s^{-2}}$. The radii in units of $r_s$ do not change.
:::

### Stretch

With chapters 8.6 and 13.8: watch the 0.905 K hole within a region of radius $10\,r_s$. How many bits can its seven
numbers carry at the ceiling set by its mass, and at the region's own ceiling, $\ell_{\rm r}^2/2\ell_P^2$? Compare
both with its entropy.

::: solution
With $\ell_P$ the Planck length, $\matter Mc\,\ell_{\rm r}/\hbar = 5r_s^2/\ell_P^2 = 7.8\times10^{62}$, so
$7\log_2\SNR = 1462$ bits. The region's own ceiling, $7.8\times10^{63}$ and 1486 bits, assumes the largest mass the
region allows, ten times this hole's; for this hole the bound is 1462 bits. The ceiling is $5/\pi = 1.6$ times the
entropy, $\pi r_s^2/\ell_P^2 = 4.9\times10^{62}$ nats or $7.0\times10^{62}$ bits, of which the bits are about
$2\times10^{-60}$.
:::

### The paper

Reproduce the numbers of [*The fluctuations of a black hole's
quadrupole*](/paper/#par:the-fluctuations-of-a-black-holes-quadrupole) and the first radius of Section XIV's plain
words: the mass of the 0.905 K hole, $r_s$, $\nu$, $S_Q$, "$4\times10^{-32}$", "$2\times10^{13}$" and 1.02, given
$\int\Gamma_2x^{-4}\,\dd x = 6.938$.

::: solution
$\matter M = \hbar c^3/8\pi G\kB T = 1.356\times10^{23}$ kg, $r_s = 2G\matter M/c^2 = 0.201$ mm,
$\nu = \matter Mr_s^5/90c^3 = 1.85\times10^{-23}\unit{J\,s^5}$ and
$S_Q = 2\kB T\nu = 4.62\times10^{-46}\unit{kg^2\,m^4\,s}$. A metre away the tremor's tide is
$36G\sqrt{2/3}\sqrt{S_Q/1\unit s} = 4.2\times10^{-32}\unit{s^{-2}}$ in a second, and the steady tide
$2G\matter M/(1\unit m)^3 = 1.81\times10^{13}\unit{s^{-2}}$. The radius is
$\sqrt{3\times(5/32\pi)\times6.938}\,r_s = 1.0175\,r_s$.
:::
:::

::: paper
- [Section XIV](/paper/#sec:hole) in full: its four equations, Figure [](/paper/#fig:hole-response) and Table
  [](/paper/#tab:hair).
- [Section XV](/paper/#sec:holography) in full, with the paper's [](/paper/#eq:dp-energy).
- [Section XVI](/paper/#sec:conclusion), the Conclusion, in full.
- [Section XVII](/paper/#sec:status): the six open problems.
:::

::: deeper
- The GR course's sections
  [22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature) on the
  temperature the thermometer reads and
  [22.10](https://neovand.github.io/general-relativity/chapter-22.html#22-10-the-information-question-without-assuming-quantum-mechanics)
  on what a horizon does to information.
- R. Penrose, "On gravity's role in quantum state reduction" (1996) [@Penrose1996]: the energy of Section XV and its
  time.
:::

[^factor]: The paper's "fixed multiple": each tide $r^\ell Y_{\ell m}$ of the paper's
    [](/paper/#eq:thermal-multipole), which sums over the orders $m$, gives $\ell(2\ell + 1)/4\pi$ times the moment;
    Section XIV's quadrupole gives $\tfrac13$ (13.7). The radii do not depend on the factor, because body and shell are
    weighed by the same tide.

[^a]: Here $a$ is the test's free number, not Kerr's $a$.

[^rounded]: The paper takes them "from the unrounded radii". To two places, 1.02, 1.46 and 1.61, the radii give
    $-2.43$ at $4.37$, because $R_3$ enters $m_2^2$ as its eighth power (13.7).

[^Rd]: From three radii, looking holds $(\lfloor\ln\SNR/\Lambda\rfloor + 1)^2$ numbers, with $\Lambda = \ln3$, and
    the cells that pairs of held masses resolve grow as $\kappa(\ln\SNR/\Lambda)^3$, with $\kappa \to 0.073$ at large
    $\SNR$ (13.8's count). Counted, they are 169 against 271 at $10^6$ and $2.2\times10^4$ against $2.5\times10^5$ at
    $10^{70}$. Cells a hundredth of the camera sphere's radius across are reached by pairs only at about $10^{59}$.

[^impulses]: "Readings at two times" differ only where heat, the zero point or a tide supplies impulses, as R13's
    note says (13.8).

[^density]: The time goes as the inverse square of the density: soda-lime glass, 2500 kg m⁻³, gives 0.14 s.
