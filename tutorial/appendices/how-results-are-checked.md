---
id: 'A.2'
title: 'How the results are checked'
question: 'What does it mean that a result of this book has been checked, and where is the check to be found?'
part: 'A'
requires: []
paper: [app:checks, tab:checks]
figures: []
live: []
---

The book derives its results by hand, and computes many of its numbers. Every derivation can go wrong in a sign or a
factor, and every computation in a line of code. What does it mean that a result of this book has been checked, and
where is the check to be found?

This appendix says what a check is, describes the program that produces and tests every number in the book, and lists
where each result is checked.[^table]

## A check compares two independent calculations of the same model

A **check** computes the same quantity twice, by routes that share no step, and compares the answers. The tide and
the magnetic part of a moving mass, for instance, have closed forms
([section 7.5](/tutorial/geometry/gravitomagnetism/)); they are checked
against the curvature of the same mass's metric, taken by finite differences of the metric itself
([section 7.2](/tutorial/geometry/curvature-and-tides/)). Agreement shows that the closed forms, and the code that
evaluates them, are right for that model.

It does not show that the model is right. Both routes start from the same metric of a slowly moving mass, so both
would be wrong together if the motion were not slow. The same holds for every scene: a check of the thermal image of
the Earth confirms the line integral of the glow, not the friction assigned to the Earth's rocks. What the model
assumes is stated in the section that derives each result, in bold where it is introduced; a check tests only what
follows from those assumptions.

The second route is made as different as possible from the first. The checks use, among others:

- **hand formulas** with the constants written out as literal numbers and the algebra reduced on paper, so that an
  error in the program's table of constants cannot cancel between the two sides;
- **brute-force integrals**: a line integral through a scene of nested spheres and boxes summed over fine cells, or
  its boundaries found by repeated halving, against the program's exact crossing points;
- **another level of the theory**: the curvature of a metric by finite differences against the tide's closed form;
  a full orbit computed step by step against the impulse approximation of a passing mass
  ([section 13.1](/tutorial/what-a-field-keeps/push-and-pass/));
- **simulation**: the spread of maximum-likelihood fits to thousands of simulated noisy readings against the
  Cramér–Rao bound ([section 3.3](/tutorial/noise/measuring-a-number/)), or the noise on a frequency component
  sampled in time against its formula;
- **another algorithm**: a posterior computed through singular values against the direct inverse, where both work;
- **more digits**: where double precision cannot take a difference, as for the tide two metres above the ground in the
  Earth's potential, the potential is evaluated with sixty decimal digits.

## Exact rests on an argument, and the number beside it is the accuracy of the check

When the book calls a result exact, the reason is an argument, a derivation that holds without approximation. A
near field of any strength costs a wave's amplitude exactly $\sqrt2$, because the Fisher matrix of
[section 9.7](/tutorial/one-point/beyond-one-plane-wave/) does not contain the near field. The check computes the
cost for random directions of the wave and finds $\sqrt2$ to a part in $10^9$; that number measures the check, not the
result. Likewise, the thermal rate of change of a lattice ball's quadrupole equals its exact value for any springs
([R4](/tutorial/response/reading-section-iv-3/)), and the computed sum over all its 2772 modes agrees with it to
better than a part in $10^{10}$, a tolerance set by rounding.

A check has a tolerance, and each tolerance is derived from what limits the computation, never set to make it pass. A
central second difference of step $h$ at the distance $r$ from a mass carries a truncation error of about $2(h/r)^2$ of
the tide and a round-off of about $4\epsilon(r/h)^2$, with $\epsilon \approx 10^{-16}$ the relative error of one value
in double precision; the tests choose $h$ and the tolerance from these two estimates. A number from a simulation
carries its own sampling error, and the book quotes it to the figures that sampling allows: the spread of the positive
image of the locked safe at $\SNR = 10^4$ is $0.7$ kg, and sets of three thousand draws give 0.60 to 0.73 kg
([section A.1](/tutorial/appendices/numerical-methods/)).

## Every number in the book is produced by a reference implementation and tested there

The **reference implementation** is a Python package, `gravcam`, in the folder `reference/gravcam` of the book's
repository, <https://github.com/NeoVand/gravitational-camera>, with its tests in `reference/tests`. It needs Python 3.11
or later and three libraries, NumPy, SciPy and mpmath, and it works in SI units and double precision throughout. The
command `pytest`, run in `reference/`, runs about a thousand tests; one slow test of a spinning hole's modes runs only
on request.

The package has over fifty modules. Most hold one topic each: `tidal` the tides of masses, spheres and boxes,
`separation_noise` the benchmarks of [section A.1](/tutorial/appendices/numerical-methods/), `inversion` the locked
safe, `bhmodes` a black hole's greybody factors. The rest are shared machinery: `constants` (CODATA 2018 values), `scene`
(reading the scene files), `columns` (line integrals along rays through nested spheres and boxes), `camera` and `render`
(a pinhole camera and its images), `curvature` (the curvature of a metric by finite differences, the independent route
above), and the exporters described below. Each module opens with a description of what it computes and of its
conventions. For a computed number that a section quotes, a function returns it and a test asserts it to the figures
quoted: the false wave of 0.005, the threshold $\rho \approx 270$ and the crossing at $b = 0.29\,r$ of
section A.1 are three such assertions.

The tests are named by what they check, in full sentences: `test_any_near_field_costs_the_wave_exactly_sqrt2`,
`test_a_rod_along_the_line_is_seen_nearer_by_L2_over_3r`, `test_a_shell_and_a_ball_agree_on_the_cone_and_differ_inside_it`.
Helper files hold what the tests share without using the package: the hand formulas, the brute-force integrals, and a
model of round-off from which the geometric tolerances follow.

**The scenes.** The book's scenes (the locked safe, the Sun at midnight, the closed furnace, the sealed flywheel and
the others) are files in the folder `scenes/`, each listing an observer, materials with their density, temperature and
friction, and objects that are spheres or boxes, nested. A written specification of the format and of the emission
model is kept beside them, and the reference implementation was written from that specification, independently of the
web edition's code.

## The web edition draws its figures with separate code, tested against the reference

The interactive figures of the web edition run in the reader's browser, so they cannot call the Python package. They
are drawn by separate code: a renderer that computes the line integrals and tides of a scene in shaders on the
graphics processor, in single precision, and ports of the pixel's algebra, the counting of gravitons and the noise of
a near-field image. Both read the same scene files as the reference.

The bridge is a set of **fixtures**, files of reference numbers that the package exports: for each scene, rays with
their line integrals, emissivities and tides; for the pixel, readings with their invariants, Petrov types, principal
null directions and velocities; tables for the vistas of Part V and for the noise of a reconstruction. The fixtures
are built only from operations that the floating-point standard rounds exactly, in a fixed order, so they come out the
same to the last bit on any machine, and a reference test confirms that the stored fixtures are what the exporter
writes now. The web edition's own tests compare its code with the fixtures, and a test page runs the shaders on the
reader's graphics processor and compares them with the reference, with tolerances set by single precision.

The static figures of the printed book are drawn from the same scenes, so the book's pictures, the web edition's
figures and the reference implementation describe one set of scenes.

## Where each result is checked

The table lists each result with the sections that derive it, the modules that compute it and the test files that
check it. Modules are files of `reference/gravcam`, tests are files of `reference/tests`, and the name of each test
inside says what it checks.

| Result | Book sections | Modules | Tests |
|---|---|---|---|
| The tide of a scene and its trace inside matter | [1.4](/tutorial/newton/tides/), [R2](/tutorial/outside/reading-section-iv-1/), [7.3](/tutorial/geometry/einstein-equation/) | `tidal` | `test_tidal` |
| The magnetic part of moving and spinning bodies; the current column | [7.5](/tutorial/geometry/gravitomagnetism/), [2.8](/tutorial/outside/flows/), [R2](/tutorial/outside/reading-section-iv-1/) | `gravitomagnetic`, `currents` | `test_gravitomagnetic`, `test_currents` |
| Same outside, different inside; the Earth from outside; silent flows; the zeros of the shear above a buried pair | [2.5](/tutorial/outside/null-space/), [R2](/tutorial/outside/reading-section-iv-1/), [2.8](/tutorial/outside/flows/), [3.9](/tutorial/noise/positivity/) | `nullspace` | `test_nullspace`, `test_silent_flows` |
| The thermal tremor, the sum rule, the thermometer, the bounds on the jitter | [4.3](/tutorial/response/elastic-bodies/), [4.5](/tutorial/response/causality/), [4.6](/tutorial/response/fluctuation-dissipation/), [R4](/tutorial/response/reading-section-iv-3/), [8.7](/tutorial/quantum/quantum-fluctuation/) | `response` | `test_response` |
| The blur law and its table | [3.7](/tutorial/noise/blur-law/), [R3](/tutorial/noise/reading-section-iv-2/) | `resolution` | `test_resolution` |
| The information in a near-field image | [3.8](/tutorial/noise/bits/), [R3](/tutorial/noise/reading-section-iv-2/) | `capacity` | `test_capacity` |
| The worked inversion, with and without positivity | [R3](/tutorial/noise/reading-section-iv-2/), [3.9](/tutorial/noise/positivity/), [A.1](/tutorial/appendices/numerical-methods/) | `inversion` | `test_inversion` |
| A rotor's waves, their power and polarization; a source larger than its wave | [7.7](/tutorial/geometry/quadrupole-formula/), [R7b](/tutorial/geometry/reading-section-v/) | `waves`, `wavezone` | `test_waves`, `test_wavezone` |
| Absorption, emission and the graviton budgets | [7.8](/tutorial/geometry/wave-energy/), [10.2](/tutorial/glow/kirchhoff/), [R10](/tutorial/glow/reading-section-vi/), [R10b](/tutorial/glow/reading-section-ix/) | `emission` | `test_emission` |
| The friction and glow of materials and their table; the bound on every glow | [10.3](/tutorial/glow/why-matter-barely-glows/), [R10](/tutorial/glow/reading-section-vi/) | `materials`, `glowbounds` | `test_materials`, `test_glow_skies` |
| The bound on optics; surface and volume glow; a black hole as a lens | [R11](/tutorial/black-holes/reading-section-vii/), [10.3](/tutorial/glow/why-matter-barely-glows/) | `optics`, `lens` | `test_optics`, `test_lens` |
| One pixel: the square, the types, the principal null directions, the pixel's own velocity, the separation of waves, the sky's numbers, ranging | [9.1](/tutorial/one-point/spin-two/), [9.3](/tutorial/one-point/the-matrix-w/), [9.4](/tutorial/one-point/petrov/), [9.5](/tutorial/one-point/separating-waves/), [9.6](/tutorial/one-point/the-sky-at-one-point/), [9.7](/tutorial/one-point/beyond-one-plane-wave/) | `pixel`, `onepixel`, `identify` | `test_pixel`, `test_one_pixel`, `test_identify`, `test_single_pixel_bandlimit` |
| The absence of aberration; other theories of gravity | [6.3](/tutorial/relativity/aberration/), [7.7](/tutorial/geometry/quadrupole-formula/), [9.7](/tutorial/one-point/beyond-one-plane-wave/) | `present`, `beyond` | `test_present`, `test_beyond` |
| Separation and depth with noise | [9.7](/tutorial/one-point/beyond-one-plane-wave/), [R9b](/tutorial/one-point/reading-section-viii-2/), [A.1](/tutorial/appendices/numerical-methods/) | `separation_noise` | `test_separation_noise` |
| The thermal Earth and its inversion | [5.6](/tutorial/waves/abel-transform/), [R10b](/tutorial/glow/reading-section-ix/) | `abel` | `test_abel` |
| A pair of black holes; memory; the Sun as a lens | [12.1](/tutorial/sky/stars/), [R12](/tutorial/sky/reading-sections-x-and-xi/), [7.8](/tutorial/geometry/wave-energy/), [R12b](/tutorial/sky/reading-section-xi-2/) | `binary`, `memory`, `sunlens`, `sunwave` | `test_binary`, `test_memory_sunlens`, `test_sunwave` |
| The Milky Way, the primordial background, a black hole and its modes | [12.1](/tutorial/sky/stars/), [12.2](/tutorial/sky/universe/), [11.1](/tutorial/black-holes/schwarzschild/), [11.3](/tutorial/black-holes/hawking/), [R12b](/tutorial/sky/reading-section-xi-2/) | `galaxy`, `primordial`, `schwarzschild`, `bhmodes`, `kerrmodes`, `skies` | `test_vistas`, `test_bhmodes`, `test_glow_skies`, `test_kerrmodes` |
| Hair: the field at two times, the count of bits, a black hole's friction and tremor, an impulsive tide and a weighing, what gravity cannot decohere | [13.2](/tutorial/what-a-field-keeps/calderon/), [3.8](/tutorial/noise/bits/), [11.4](/tutorial/black-holes/under-tides/), [13.6](/tutorial/what-a-field-keeps/algebra-of-moments/), [13.8](/tutorial/what-a-field-keeps/holography/) | `hair`, `bhmodes` | `test_hair` |
| The two readings as one transform; the reach of a tide of given degree; the flow; the brackets of the moments; an impulsive wave | [13.2](/tutorial/what-a-field-keeps/calderon/), [13.3](/tutorial/what-a-field-keeps/ladder/), [13.4](/tutorial/what-a-field-keeps/flows-inside/), [13.6](/tutorial/what-a-field-keeps/algebra-of-moments/), [13.5](/tutorial/what-a-field-keeps/impulsive-waves/) | `readings`, `spins` | `test_readings`, `test_spins` |
| The weight of a black hole's response, tide by tide | [13.7](/tutorial/what-a-field-keeps/thermometer/) | `holeresponse`, `bhmodes` | `test_holeresponse` |
| A mass that passes; the bits of a second reading; two bodies that no quadrupolar tide tells apart | [13.1](/tutorial/what-a-field-keeps/push-and-pass/), [13.2](/tutorial/what-a-field-keeps/calderon/), [13.3](/tutorial/what-a-field-keeps/ladder/) | `passing` | `test_passing` |
| The geometry of the near field; the zeros of the shear above a layer; one spin of a reading | [3.9](/tutorial/noise/positivity/), [R9](/tutorial/one-point/reading-section-viii/) | `hyperbolic`, `shearzeros`, `spins` | `test_hyperbolic`, `test_shearzeros`, `test_spins` |
| The web edition's images against the reference | [R10b](/tutorial/glow/reading-section-ix/), this appendix | `export_fixtures` | `test_fixtures`, and the web edition's own tests |

**The idea to keep: a check shows that a formula agrees with an independent calculation of the same model, not that
the model is right; exact results rest on arguments, and every number in the book is computed and tested in one
program that a reader can run.**

[^table]: First set out in *The gravitational camera* (Mohsenvand 2026), [App. B](/paper/#app:checks), whose
    Table [](/paper/#tab:checks) the table below rebuilds with the book's sections.
