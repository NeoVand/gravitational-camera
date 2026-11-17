# A brief for a second mind: what a spin-2 pixel can do that light cannot

Thank you for the note on the ten numbers. We checked it against our reference implementation: five of the six
claims hold (the two-wave unmixing, the three-binary pencil, the speedometer, the 68 + 32 sky count, the curl
identity), one of them corrected an error in our paper, and the light count in your table (15 + 21) should be
28 + 8. We would like you to go further, in the same spirit, under the rules below.

## Conventions

E_ij = c^2 R_0i0j and B_ij = (c^2/2) eps_ipq R_pqj0 (eps_123 = +1), both in s^-2, symmetric and trace-free in vacuum.
W = E + iB. A plane wave travelling along k has W = c m m^T with m.m = 0 and k = i m x m* / |m|^2. Inside matter
tr E = 4 pi G (rho + 3p/c^2) and the antisymmetric part of B is -(4 pi G / c) eps rho v.

## What we have established (please do not re-derive; build on it)

1. Lorentz transformations act on W as SO(3, C); a boost is an imaginary rotation by the rapidity.
2. A generic reading is four invariants (two complex eigenvalues), three orientation angles and three components of
   the velocity of the field's canonical frame. For a static scene seen by a moving pixel the eigenvalues are real
   and the complex eigenvectors give the pixel's velocity exactly (checked to 0.6c). Light fixes its frame only up to a
   boost along E x B.
3. Separation of plane waves by one point sensor of spin s: s at one instant, s + 1 at one frequency (pencil), 2s from a
   time history with arbitrary waveforms (the span's annihilating conic meets the null conic in 2s points). Checked
   for gravity (2, 3, 4).
4. Sky content per frequency: 2(2s+1)^2 + 2(4s+1) numbers for s >= 1 (gravity 68 of 100, light 28 of 36); I and V
   never mix at one pixel; one pixel measures the isotropic chirality V_00.
5. The tidal field of a uniformly moving mass points at its present position, exactly; near an orbiting pair the
   field matches Newton's present-position field to order (kr)^2.
6. Petrov type from invariants counts "one body" (D) against "more" (I) and "a pure wave" (N).
7. A wave source is ranged by one pixel: the oscillating part of W departs from rank one by s2/s1 = C/(kr)^2.
8. Already in the paper: one-wave direction; one-pixel ranging of a moving mass (r, M, v); the near field's
   logarithmic blur; the thermal glow as line integrals; no lenses, mirrors or shadows; memory; the 0.905 K sky.

## Questions we would like you to work on

1. The ranging constant: derive C(iota, theta) in s2/s1 = C/(kr)^2 for a rotating mass quadrupole (and for a general
   quadrupole), and the resulting range limit in terms of the signal-to-noise ratio.
2. Second-order statistics: with K uncorrelated, stationary sources (polarized or not), how many can one pixel's 10 x 10
   spectral matrix resolve, and by what algorithm? Is there a gain from the two helicity sectors?
3. Arrays of spin-2 pixels: does an array of N pixels resolve about 5N - 1 sources, and does the tensor structure
   remove grating lobes of sparse arrays (two pixels far apart forming a sidelobe-free interferometer)?
4. Cramer-Rao bounds at one pixel: direction of one wave, the velocity from the speedometer, ranging, all against SNR.
5. Beyond general relativity: what does one full-Riemann pixel (E with its trace, B) tell about the six polarizations
   of a metric theory, about a massive graviton, about the speed of gravity, in one reading?
6. Anything else in which the gravitational field at a point, or a few points, carries information the
   electromagnetic field structurally cannot: from spin 2, from one sign of mass, from universal coupling, from the
   absence of reflection and absorption, from nonlinearity and memory, from the trace inside matter.

## Rules

- Every claim must be checkable: state it as an equation or an algorithm with its assumptions, and give a numerical
  test we can run (numbers in, numbers out).
- Say plainly what is known in the literature and cite it (Petrov, Penrose, Sylvester, vector-sensor array processing
  such as Nehorai and Hochwald, the SOGRO tensor detector, Carlip on aberration).
- Separate what is exact, what holds to some order, and what is a conjecture.
- We care about physics that separates gravity from light, not about how organisms would use it.
