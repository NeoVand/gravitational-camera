# Where the paper goes next

Distilled from the four reviews (two rounds of structured review, the "vistas" round, and "what is still
uncomputed") and from our own reading. Ranked by how much each would change what a reader learns. Done items are
struck through in later revisions of this file.

## The three we are working on

All three are in the paper: Section IV, "How much a picture holds" (Fig. 8; `reference/gravcam/capacity.py`);
Section IX, "Reading the layers back" (Fig. 17; `reference/gravcam/abel.py`); Section IV, "What the image does show"
and "What breaks the tie" (Fig. 6), with Table V in Section X (`reference/gravcam/nullspace.py`). Still open from
them: a demo of the nugget, the flush and the skin, and the magnetic part's null space stated as exactly as the
electric part's.

1. **How much a gravitational picture can hold.** The three regimes are three limits of one linear map from the
   scene to the pixels, with transfer functions $k e^{-kz}$ (near field), the aperture (waves) and the ramp $|k|$
   (thermal tomography). Their information capacities differ in kind: in the near field the bits per area $z^2$ grow
   only as $(\ln\mathrm{SNR})^3/12\pi\ln 2$; a wave aperture holds $(D/\lambda)^2$ cells of $\log\mathrm{SNR}$ bits;
   one pixel holds 25 numbers whatever its sensitivity; the thermal channel is limited by the gravitons counted. A
   derivation, checked numerically, a figure, and a subsection.
2. **The thermal Earth, inverted.** The steps in Fig. 15 fall where lines of sight graze the shells,
   $\sin\theta = r/R$, whatever the friction; an Abel inversion of the brightness gives each shell's emissivity, which
   scales with the friction. The camera measures radii and friction, not temperature. A reference implementation of
   the inversion with tests, and text in Section IX.
3. **Same outside, different inside.** The camera's null spaces made concrete: positive interiors, built from
   $\delta\rho = \nabla^2\chi/4\pi G$, with identical exterior fields; the shell and the ball; the counter-rotating
   flywheel; the scale symmetry of $\mathcal{E}$ alone. Then what breaks each: spin ($\mathcal{B}$), the glow, a pixel
   in contact ($\mathrm{tr}\,\mathcal{E} = 4\pi G\rho$). A figure and a demo.

## What the ten numbers afford, beyond seeing through walls

Checked numerically against the reference implementation (not yet in the paper):

- **The camera sees the present; light sees the past.** For a mass in uniform motion the stretch axis of the exact
  linearized tidal tensor points at the mass's *present* position at any speed (to numerical precision at
  v = 0.3c, where light shows it 10 degrees behind, at the retarded position). Near an orbiting pair the changing
  field matches Newton's field from the present positions with an error of order (kr)^2, while the retarded
  positions are off by kr itself (kr = 0.1: 0.1 per cent against 10 per cent). So the gravitational Sun is 20.5
  arcseconds ahead of the optical Sun, Laplace's puzzle about the speed of gravity, resolved by Carlip (Phys. Lett. A
  267, 81, 2000). Waves, by contrast, do come from the retarded position: the near-field and wave images of one
  binary disagree on its phase by kr.
- **One pixel can count to two.** The complex invariants I = tr Q^2, J = tr Q^3 of Q = E + iB, independent of how
  the pixel is turned, classify the field (Petrov type): one body, at rest or moving, gives 1 - 6 J^2 / I^3 = 0
  (type D); two bodies give a nonzero value (0.02 in the test case); a pure wave gives I = J = 0 (type N). Type D
  means "consistent with one body", since anything symmetric about the line to the pixel is also type D. E alone is
  not enough: a moving mass splits E's transverse eigenvalues, and only the complex Q stays degenerate.

Candidates, not yet checked:

- One-pixel ranging of a wave source from the mixture of 1/r^2 (spin-1) and 1/r (spin-2) parts of its field near the
  source, r of order lambda (|Psi_3 / Psi_4| ~ 1/kr); a pixel would then also weigh the source from its Coulomb part.
- Bookkeeping of the stress-energy: the near field's E sees mass, its B momentum, the waves the transverse stress;
  a pixel inside matter reads rho + 3p/c^2 from tr E and the momentum density from B's antisymmetric part.
- Hearing inside sealed bodies: a heartbeat (70 g moved 5 cm) changes the tide at a metre by about 1e-12 s^-2,
  1e-4 of the person's own.
- A search for gravitomagnetic monopoles (NUT charge): a static B with the pattern of a mass.

## Next in line

- Spectra instead of bolometric numbers: the Earth goes dark above the Debye frequency, the Sun's spectrum
  (García-Cely and Ringwald), the 0.905 K sky peaking at 74 GHz; gravitational colour plotted.
- The strain spectrum of the 0.905 K sky, $h_c(\nu)$ over thirty decades, rising as $\nu^{1/2}$ to its peak.
- Where a binary stops looking like two: $r_\star/d = \tfrac12\sqrt{c^2 d/GM}$ from early inspiral to contact.
- One-pixel lab demo: direction of one wave, twelve sources against a uniform sky, ranging a flyby.
- A person as a worldline: the tracker succeeds while the portrait fails.
- The weight of heat: the furnace's heat weighs $6\times10^{-11}\,\mathrm{kg}$, felt at SNR $10^{12}$ with an
  $8^\circ$ blur.
- A physical estimate of the friction (Akhiezer, with relaxation): the placeholder is probably $10^3$ too high.
- The baseline that resolves Sagittarius A*: about one Earth diameter at 4 mm.
- GOCE as the logarithmic law in the wild (needs its published error spectrum).
- Kerr: a spinning hole brighter than the sky at its edge; the hole as warm as the sky, invisible.
- The engine as one kernel with a frequency slider; publishing the operator as a library with benchmarks.

## Considered and set aside for now

- The early-ISW "plateau" of the graviton sky (an unverified closed form; needs a Boltzmann code).
- Antipodal entangled gravitons from inflation (speculative for this paper).
- Polarized thermal emission from anisotropic loss (phenomenological until a material model exists).
