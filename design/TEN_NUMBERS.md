# What ten numbers buy: the algebra of a gravitational pixel

A working note, for deciding how much of the paper to build around this. Everything marked **checked** was verified
numerically on 17 November 2026 against the reference implementation (exact linearized fields: boosted point
masses, the binary of `gravcam/binary.py`, plane waves from `gravcam/curvature.py` rotated to any direction). The
scripts live in the session scratchpad and become reference tests when this goes into the paper.

## 1. The frame: a pixel reads a binary quartic

In vacuum a pixel records E and B, two real symmetric trace-free 3x3 tensors: ten numbers. Put them together as
the complex matrix W = E + iB, which lives in C^5 (symmetric, trace-free, complex). Three facts organise everything:

- **The Lorentz group acts on W as complex rotations**, W -> R W R^T with R in SO(3, C). A rotation of the pixel is a
  real R; a boost (the pixel moving) is an imaginary rotation by the rapidity. So tr W^2, tr W^3 and the eigenvalues
  of W are the same for every observer.
- **A plane wave is a perfect square**: W = c m m^T with m a complex null vector (m.m = 0) whose real and imaginary
  parts span the wave's plane; the propagation direction is i m x m* / |m|^2. Both E + iB and E - iB have rank one.
  **checked**
- **C^5 is the space of binary quartics** (spin 2 has 2s + 1 = 5 states). Under that identification a plane wave from
  the sky point z (stereographic) is the fourth power (zeta - z)^4, the 3x3 matrix W is the quartic's catalecticant,
  and the field's own principal directions (Petrov, Penrose) are the quartic's four roots: four "stars" on the
  celestial sphere. One wave: four stars at its source. One body: two double stars at +-n. Light is the same with a
  binary quadratic (spin 1, C^3, two stars); sound is spin 0.

Consequences: what a pixel can learn is classical invariant theory (Sylvester's apolarity, 1851). As far as waves
are concerned, one spin-2 pixel behaves like a five-element antenna array whose "positions" are the spin states,
with the source direction entering through z.

## 2. Gemini's six claims, checked

| Claim | Verdict | Notes |
|---|---|---|
| One pixel unmixes two waves crossing at one instant | **Right, checked** | Two waves make W rank 2 (det W = 0); the null vector v = m1 x m2, then m.v = 0 and m.m = 0 give both directions from one quadratic. 200 random pairs: worst direction error 2e-6 (finite-difference noise). A static mass has rank 3 (det W = -2(GM/r^3)^3), so det W = 0 also tells two waves from a mass. Light cannot (6 numbers, 8 unknowns). This is Sylvester's theorem: a quartic is a sum of two fourth powers iff its catalecticant vanishes. |
| Three binaries in the same frequency bin, from one pixel | **Right, checked** | The positive- and negative-frequency parts of W form a pencil whose determinant factors into the three binaries; the three roots give inclinations, \|lambda\| = tan^4(iota/2) (or its inverse, by convention); null vectors and cross products give the directions. 30 random trials: direction error 5e-12, inclination 7e-11. |
| A map-free speedometer: own velocity from B in E's eigenframe | **Right to first order, checked; exact form found** | Five unknown static masses, pixel moving: velocity recovered to 1.5e-5 at v/c = 1e-3, errors growing as (v/c)^2. The exact statement is better: a boost is an imaginary rotation, so for any static scene seen by any moving pixel **the eigenvalues of W are real** (0.27c: Im/Re = 9e-10). If anything in the scene moves relative to the rest, they turn complex (1.5e-3 in the test). An ego-motion-proof motion alarm. Blind to motion along a symmetry axis (an isolated sphere's radial direction), as the paper already says. |
| 68 + 32 = 100: the sky one pixel sees per frequency, with no I-V mixing | **Right, checked; the paper must be corrected** | One pixel's 10x10 spectral matrix holds 25 harmonics of brightness I, 25 of circular polarization V, 18 of linear polarization, 68 in all, independent; the other 32 are null for any Einstein sky. V lives only in the imaginary (quadrature) part, I and Q, U only in the real part. **Section VII says the odd degrees of I "mix with the circular polarization unless the sky is unpolarized": wrong for a co-located pixel**; the mixing belongs to pairs of separated detectors (the papers cited). An isotropic sky of net handedness V puts exactly V <E.E*> into Im <E.B*>: one pixel measures the chirality of the whole sky, which a planar interferometer cannot (Seto and Taruya). |
| curl E kills all Newtonian noise | **Right but not new** | Bianchi: dB/dt = -c curl E, and a Hessian has no curl. Equivalent to using B, which the paper already proposes; the new point is only that an array of E-only sensors can synthesize B. Suppression of nearby pull is by about v/c. |
| \|B\|/\|E\| = ck/omega: a one-pixel refractometer that weighs the graviton | **Right in principle, impractical** | True for a single plane wave (check rank 1 first). Testing a graviton mass at the current bound needs \|B\|/\|E\| to 1e-21. A cute line, not a section. |

Gemini's table also gives harmonic counts for sound (9 + 7) and light (15 + 21): not checked.

## 3. What I add, checked

- **The camera sees the present; light sees the past.** For a mass in uniform motion the stretch axis of E points at
  the mass's present position at any speed (exact at v = 0.3c, where light shows it 10 degrees behind). Near an
  orbiting pair the changing field matches Newton's field of the present positions to order (kr)^2, while the
  retarded positions are off by kr (kr = 0.1: 0.1 per cent against 10 per cent). The gravitational Sun is 20.5
  arcseconds ahead of the optical Sun: Laplace's puzzle about the speed of gravity, resolved by Carlip (Phys. Lett. A
  267, 81, 2000). A uniformly moving body is seen on the observer's own slice of simultaneity: an eye of this kind
  would perceive "now". Waves still come from the retarded position, so a binary's near-field and wave images
  disagree on its phase by kr; when a body swerves, the field goes on extrapolating its old motion until the news
  (a wave, carrying memory) arrives.
- **One pixel counts to two.** Petrov type from the invariants: 1 - 6 (tr W^3)^2 / (tr W^2)^3 = 0 for one body
  moving or not (type D; 3e-10 in the test), 0.02 for two bodies, and tr W^2 = tr W^3 = 0 for a pure wave (type N).
  Type D means "consistent with one body": anything symmetric about the line to the pixel is also type D. E alone
  does not do this (a moving mass splits E's eigenvalues); the complex W does.
- **Four waves, arbitrary waveforms, one pixel.** If the waves come from fixed directions with any waveforms, the
  pixel's readings over time span a 4-dimensional subspace of C^5; the one matrix A orthogonal to it gives a second
  conic m^T A m = 0, which meets the null conic m.m = 0 in exactly four points: the four directions. 40 random
  trials: error 1e-14; with noise at 1e-4 per component, 1.6e-9 rad. The general rule for a spin-s point sensor:
  s waves at one instant, s + 1 at one frequency, 2s with time. Light: 1, 2, 2 (matches Hochwald and Nehorai's limit
  of two sources for an electromagnetic vector sensor). Gravity: 2, 3, 4. "One ear that solves the cocktail party
  for four talkers."
- **One pixel ranges a wave source.** The oscillating part of W near a source is not exactly rank one: the second
  singular value over the first falls as C/(kr)^2, not 1/kr (first-order corrections keep the rank). C depends on
  the source's orientation, which its polarization gives. Checked in the wave zone of the binary: kr^2 s2/s1 = 1.09
  and 0.17 at two viewing angles, constant to 1 per cent from kr = 10 to 160. Range reaches out to about sqrt(SNR)
  reduced wavelengths. The analytic C(iota) is still to derive.

## 3b. Second round (17 November 2026)

- **Ten numbers = four invariants + three of orientation + three of velocity.** A generic reading (Petrov type I)
  is W = P D P^T with P in SO(3, C) and D diagonal. The two independent complex eigenvalues are four real numbers no
  observer can change. P = exp(iK) R0 splits into a real rotation R0 (which way the field's axes point) and an
  imaginary one exp(iK), whose generator is the rapidity of the one frame in which the field is "at rest" (E and B
  share axes). For a static scene that frame is the scene's: **the exact speedometer**. Checked: four unknown masses,
  pixel at 0.05c, 0.27c and 0.6c, rapidity recovered to 4e-8 and direction to 1e-15. Light cannot do this: a non-null
  electromagnetic field fixes its rest frame only up to a boost along its own axis (E parallel to B), so a light
  sensor is at best a two-dimensional speedometer; gravity's type I field has no such freedom.
- **The phase of the eigenvalues is spin.** For a spinning body, W = Psi (-2, 1, 1) with complex Psi whose phase is
  3 a cos(theta) / r (a = J / Mc), as for Kerr's Psi_2 = -M / (r - i a cos theta)^3: an observer-independent reading
  of the spin along the line of sight (derived to first order in the spin from the paper's spin-dipole B; 1.5e-6 rad
  for the Earth over its pole). Complex eigenvalues therefore mean "something rotates or moves relative to the rest",
  never "I am moving".
- **The sky content per frequency, for every spin.** Checked: sound (p, v) sees 9 sky numbers with 7 null tests;
  light (E, B) 28 (9 of brightness, 9 of circular, 10 of linear polarization) with 8 nulls; gravity 68 with 32. In
  general 2(2s + 1)^2 + 2(4s + 1) for s >= 1. (Gemini's "15 + 21" for light was wrong.)
- **No echoes.** Matter neither reflects nor absorbs gravitational waves, so the single-pixel separation theorems
  hold inside a room, a mine or a planet. Radio and acoustic vector sensors are plagued by multipath ghosts; a
  gravitational pixel is not. The cocktail party with no reverberation.
- **Helicity sectors.** In the frequency domain W+ (C^5) and W- (C^5) carry the two helicities separately; each plane
  wave is a point of the rational normal quartic in each. With uncorrelated sources, MUSIC on that curve may resolve
  more than four (to check: how many per sector, and with both).

## 4. Ideas not yet checked

- **Dark matter and the vacuum, read directly.** Inside matter tr E = 4 pi G (rho + 3p/c^2), whatever the matter is.
  A pixel in the Galaxy's dark-matter halo (0.4 GeV/cm^3) reads 6e-31 s^-2 from it; the cosmological constant has
  negative active mass and reads -Lambda c^2 = -1e-35 s^-2. The only sense that sees dark matter by construction
  (ordinary gas outweighs it locally, so it needs a vacuum or a model).
- **News at the speed of light.** A great earthquake's gravity signal arrives before its seismic waves: observed for
  Tohoku 2011 (Vallee et al., Science 358, 1164, 2017), minutes of warning at 1000 km. Magma, landslides, tsunamis
  likewise.
- **Navigation.** "Down" is E's stretch axis; the Moon's and Sun's tides, felt through the planet, give the time of
  day and month; B gives speed relative to the surroundings; the thermal sky's dipole, speed relative to the cosmos.
- **Hunting.** A heartbeat (70 g moved 5 cm) changes the tide at a metre by 1e-12 s^-2, 1e-4 of the person's own:
  prey felt through cover, as sharks feel prey through sand.
- **Seeing energy.** A charged battery, a wound spring, a hot gas weigh more by E/c^2.
- A search for gravitomagnetic monopoles (a static B with the pattern of a mass).

## 5. Prior art to cite and read

- Electromagnetic vector sensors: Nehorai and Paldi, IEEE Trans. Signal Process. 42, 376 (1994); Hochwald and
  Nehorai, IEEE Trans. Signal Process. 44, 83 (1996), doi 10.1109/78.482014 (limits on identifiable sources).
- A superconducting tensor detector that measures E only and cannot tell n from -n: arXiv:2311.17639 (SOGRO).
- Petrov classification and principal null directions (Penrose); Majorana's stars; Sylvester's apolarity.
- Carlip 2000 (aberration); Vallee et al. 2017 (prompt elastogravity signals); Seto and Taruya (chirality with
  interferometers).

## 6. How it could reshape the paper (to decide)

1. A central section, "What one pixel knows", after Section II: the frame of section 1; one-pixel theorems (direction;
   counting; separation 2/3/4 against sound and light; ego-motion invariance and the speedometer; ranging a body and
   a wave source; the 68 sky numbers with 32 null tests); and "the camera sees the present". A figure of the
   pixel's four stars for each kind of scene, and a table of sound, light and gravity side by side.
2. The correction to Section VII.
3. A short closing essay, "If eyes were gravitational", organising the affordances by what an organism or a
   civilization would need: where am I, what is out there and how many, where is it now, what is inside, what is
   coming, what cannot be seen any other way.
