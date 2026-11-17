# The gravitational camera: what is still uncomputed

Notes on the working draft of 16 November 2026. The draft already contains the paper: ten numbers at a pixel, three regimes, images computed rather than focused, and a sky in which the only shadows are horizons. What follows is the set of calculations, distinctions, and demos that would turn that thought experiment into the reference other people argue from.

The opportunity is not a different paper. It is to replace every picture of a density with the object the pixels actually determine, to put the three regimes on one operator, and to do five calculations whose answers are not obvious from the prose.

If only five of these are done:

1. State the observable, and show the null space. The camera records multipoles of mass and of current. Density is a rendering. Figure 8c should become three different interiors with one exterior.
2. Write the three forward operators side by side, with their singular values. Laplace continuation, the wave beamformer, and the Radon transform of the glow are one theorem.
3. Invert Figure 15. The kink angles are the radii of the shells, and the unknown friction cancels.
4. Stop comparing the Earth, the Sun, and the 0.905 K sky with one bolometric number. They live in different decades of frequency. Draw the datacube.
5. One retarded integral in the engine, and a frequency slider. The teaching mode that slows the speed of light is a picture of the wave zone. The slider is a picture of the whole paper.

The derivations are collected at the end, numbered (A1) onward, so they can be lifted.

---

## 1. The sentence the abstract is one rewrite away from

A pixel does not measure density, temperature, or shape. It measures the electric and magnetic tidal tensors \(E_{ij}\) and \(B_{ij}\). Outside matter those tensors determine, and are determined by, the mass multipoles and the current multipoles. Inside matter the trace of \(E_{ij}\) is the density itself, so the inverse problem is hard only for a camera that refuses to touch what it looks at.

That split is the paper:

- **Contact** is algebraic. A pixel in the rock reads \(\rho\).
- **The near field** is analytic continuation. Whole families of density share one exterior, and sensitivity buys multipoles only logarithmically.
- **Bulk waves** are a point with a polarization. Under the assumption that makes the quadrupole formula, the source is always smaller than its own wavelength.
- **The thermal glow** is emission tomography with zero optical depth. The native inverse is mild. The rate is the whole difficulty.
- **The sky** is the same three operators with different sources: a binary’s multipoles, a galaxy’s line integral, a blackbody with holes punched where horizons are.

The draft says each of these in prose, then draws a density anyway. The classic version draws the observable, and draws the density only as one pseudoinverse among many, labelled as such.

The native products, by regime:

| Regime | What is actually measured | Natural picture | What a density plot adds |
| --- | --- | --- | --- |
| Near field | Mass multipoles \(A_{\ell m}\) and, from \(B_{ij}\), current multipoles | A spectrum of moments, with errors | A choice of null-space representative |
| Bulk waves | The transverse-traceless quadrupole, its angle, and \(V/I\) | A point, coloured by polarization | Nothing spatial. There is no size to draw |
| Thermal glow | Line integrals of \(j_\omega\), or a coherently focused field | A scalar volume, after a Radon inversion | Almost nothing, if the counts exist |
| Primordial sky | A temperature map on the sphere, minus discs | Stokes \(I\) plus shadows | — |

Geodesy already made this choice for the Earth: the picture is the coefficients, and any density painted underneath is an interpretation. The camera paper is that fact extended from the static geoid to \(B_{ij}\), to radiation, and to heat.

---

## 2. The null space is the result, and it is under-drawn

Section IV.c already has the theorem. If \(\chi\) vanishes outside the body, the density change

\[
\delta\rho = \frac{\nabla^2\chi}{4\pi G}
\]

changes nothing outside. A hollow shell and a solid ball of equal mass are the same photograph. So are a gold bar and a diffuse cloud, once their multipoles through the order the signal-to-noise ratio can hear have been matched.

Two consequences follow, and neither is yet the figure it deserves.

**The gold in the safe is a mass and a quadrupole, not a shape.** The excess mass of 320 kg, and the excess quadrupole if the gold sits off centre, are invariants. The outline of the bar is not. The Cramér–Rao paragraph already says this for one point mass: at \(\mathrm{SNR}=10^3\) and one metre, the mass is placed to a millimetre while its image is \(24^\circ\) wide. That paragraph is the real theory of the instrument. The blurred tidal column in Figure 8c is an illustration of the point-spread function, as the caption says, and a referee will treat it as the reconstruction anyway.

The figure that replaces it: three positive densities inside the safe, constructed so that their exterior multipoles agree through the \(\ell\) the array can measure, and disagree wildly inside. Same \(E_{ij}\) on every pixel. Then the same three, spinning: \(B_{ij}\) splits the shell from the ball by the ratio of moments of inertia, \(5/3\), which the draft already computes. Then the same three, hot: the glow of a shell is a ring, the glow of a ball is a filled disc. One scene, three channels, the degeneracy dying in public. That is the demo. It is also the definition of the camera.

**The trace ends the argument the moment a pixel is allowed inside.** In the Newtonian limit \(\operatorname{tr} E = 4\pi G\rho\). Every beautiful ill-posedness in the paper is an exterior ill-posedness. A borehole network is a trivial camera. Say so early. It makes the restraint of the thought experiment — the pixels stay outside — feel like a choice with a theorem behind it, and it tells a geophysicist exactly which part of the paper they have not already done with boreholes.

The practical photograph is a **difference**. The Earth at the surface has \(E\sim 3\times 10^{-6}\,\mathrm{s}^{-2}\); a person at one metre has \(E\sim 9\times 10^{-9}\,\mathrm{s}^{-2}\). Yesterday’s furniture dominates today’s visitor. Subtract the static field and what remains is exactly the mass that moved, the current that flowed, and, after a burst, the memory. The camera has no shutter. A difference has the effect of one, and it is how any real gradiometer array would be used. The engine should have a “subtract the room” button that is not a rendering trick but the estimator.

A closed shell of pixels has a further exact statement. The flux of the gravity through the shell is the enclosed mass. The full tensor on the shell determines every exterior multipole of whatever is inside and every interior multipole of whatever is outside. Front and back, which a single \(E_{zz}\) confuses, are the odd-parity sector of that expansion: \(E_{xz}\) and \(E_{yz}\) change sign under reflection through the array, and the even sector does not. Parity on the array is the front/back measurement, written as a symmetry rather than a special case.

---

## 3. Three operators, one camera

The draft’s three regimes are three asymptotic regions of a single linear map, from the stress \(T^{\mu\nu}(x,t)\) of the scene to the ten functions \((E_{ij},B_{ij})\) on the array. The paper becomes citable on the day that map is written down and diagonalised. The pieces are already in the draft.

**Near field, a flat array, a sheet of surface density.** This is Eq. (10), and it is the model:

\[
\hat d(k) = 2\pi G\, k\, e^{-kz}\,\hat\sigma(k) + \hat n(k).
\]

The forward multiplier is \(k e^{-kz}\). The exponential is the whole of the bad news; the factor of \(k\) is the shell theorem, a uniform sheet having no tide. The Wiener filter (11) is the pseudoinverse. Its half-power at \(kz=q_c\) with

\[
q_c e^{-q_c} = \frac{1}{\pi\,\mathrm{SNR}}, \qquad \Delta\theta = \frac{4.43}{q_c},
\]

is a result to be proud of, including the constant 4.43 checked against the Airy width. Keep it. Then put two siblings next to it.

**Wave zone, a coherent field.** Eq. (25) is a matched filter. For a flat array its transfer function in angle is the diffraction pattern of the aperture, width \(\lambda/D\). Singular values are essentially flat up to that cutoff and then fall. This inverse is mild.

**Thermal glow, counts along lines of sight.** Eq. (31) is the X-ray transform of \(j_N\). In a plane through the volume, inversion is the filtered back-projection, whose Fourier multiplier is the ramp \(|k|\), mildly ill-posed, noise growing like the square root of spatial frequency. No exponential anywhere. Transparency is what buys that ramp. Absorption would have made it the attenuated Radon transform; there is no absorption.

The portrait of the paper is those three multipliers:

| Channel | Forward multiplier | Inverse, regularised | How resolution scales |
| --- | --- | --- | --- |
| Near-field tide of a sheet | \(k\,e^{-kz}\) | Wiener cutoff at \(kz=q_c\) | \(\Delta\theta\sim 1/\ln\mathrm{SNR}\) |
| Coherent wave | aperture Fourier transform | diffraction limit | \(\Delta\theta\sim\lambda/D\) |
| Thermal counts | Radon / Abel | ramp \(\lvert k\rvert\) | set by counts and by \(\lambda\), algebraically |

Everything else in the draft is a corollary. The logarithmic blur, the unresolved rotor, the sharp transparent furnace, the uselessness of glass, the usefulness of a computer: each is the singular spectrum of one of these three.

The missing general formula, which the draft lists as future work and which would retire all three as special cases, is the retarded integral for the linearized metric of a general \(T^{\mu\nu}\), followed by the curvature. One kernel, evaluated at different frequencies, *is* the engine. The binary in Figure 17 is that kernel, truncated at the mass quadrupole and summed in closed form. The room scenes are the same kernel, either in the static limit or in the extreme high-frequency limit where only the local emissivity survives. They should be the same function.

The intermediate powers matter. Between \(1/r^3\) and \(1/r\) the time-varying quadrupole contributes a tower of radial falloffs, and the current multipoles enter with their own. At a single distance the powers mix. At two distances, or across an array deep enough to see \(a/r\) corrections, they separate. The Fisher matrix of \(\{I_{\ell m}(\omega),\, S_{\ell m}(\omega)\}\) as a function of \(r/\lambda\) is the quantitative version of “inside a sixth of a wavelength you see two bodies, outside you see a spiral.” Figure 17c is one row of that matrix. The matrix is the result.

---

## 4. Calculations that change sentences

### 4.1 The wavelength never gets smaller than the body

Equation (17) says, for parts moving at speed \(v\) through distances of order the size \(d\) of the source,

\[
\frac{\lambda}{d} = \frac{\pi}{2}\,\frac{c}{v}.
\]

The right-hand side is at least \(\pi/2\), with equality only at \(v=c\). A source of this class is always smaller than the waves it emits, by a factor of at least \(1.57\), at every speed the quadrupole picture might be stretched to cover. No aperture, of any size, forms an image of it in its own radiation. The draft says this for everyday speeds, where the factor is \(10^6\) and the conclusion is obvious. The strong form is better: **the inequality does not reverse.** Relativity does not rescue the photograph. Only a different kind of source does — a body vibrating with an amplitude small compared with its size, or many radiators driven in phase across a region larger than \(\lambda\), or heat, whose wavelength is set by \(k_BT/\hbar\) and has forgotten the size of the object.

That is why the galaxy can be an extended millihertz source while every binary in it is a point, and why a flywheel is a point while a furnace has an outline. It deserves to be a numbered statement, with the \(\pi/2\) in it. The exceptions in Section V.a are then the cases that evade the hypothesis, not loopholes in the conclusion.

### 4.2 The two-body region shrinks into the strong field

The near-zone boundary used in Section XI.a sits at

\[
r_\star = \frac{\lambda}{2\pi} = \frac{c}{2\Omega} = \frac{c\, d}{4v}
\]

from the centre of an equal-mass circular binary, with \(v\) the speed of each mass. For the thirty-solar-mass pair in the draft, \(d=2200\,\mathrm{km}\), \(v=0.10\,c\), \(\lambda=3.44\times 10^4\,\mathrm{km}\), and \(r_\star=2.49\,d\). Comfortably outside the orbit. The camera can stand in the Newtonian region and see two masses.

Now let them fall. Kepler plus the definition of \(r_\star\) gives

\[
\frac{r_\star}{d} = \frac{1}{2}\sqrt{\frac{c^2 d}{G M_\mathrm{tot}}}.
\]

| Separation \(d\) | \(d/R_{s,\mathrm{each}}\) | \(v/c\) | \(\lambda/d\) | \(r_\star/d\) |
| --- | --- | --- | --- | --- |
| 2200 km | 24.8 | 0.100 | 15.7 | 2.49 |
| 1000 km | 11.3 | 0.149 | 10.6 | 1.68 |
| 500 km | 5.64 | 0.210 | 7.46 | 1.19 |
| 360 km | 4.06 | 0.248 | 6.33 | 1.01 |
| 177 km (horizons touch) | 2.00 | 0.354 | 4.44 | 0.71 |

At contact, the formal surface \(r=r_\star\) has fallen to \(0.71\,d\), comparable with the horizons themselves, which is where Eq. (32) has already stopped being the field. The sentence to earn with a plot, and then with a numerical-relativity tendex frame from a public simulation: **a safe exterior viewpoint sees two black holes as two only while they are still well apart; by the time the horizons matter, every safe viewpoint is in the spiral.** The sixth-of-a-wavelength rule of the abstract is the early-inspiral case of this table. The table is the career of the rule.

The tendex movies that already exist are frames from this camera. Saying that, and showing one frame next to Figure 17, attaches the thought experiment to a literature that has been drawing the answer without the question.

### 4.3 The kink angles do not know the friction

Figure 15 is drawn as a brightness, and the brightness scales with the placeholder \(\eta\). The angles of the steps do not.

For an observer on a sphere of radius \(R\), a line of sight at angle \(\theta\) from the downward vertical has impact parameter \(b=R\sin\theta\). A spherical shell of radius \(r_s\) is tangent to that line of sight when

\[
\sin\theta = \frac{r_s}{R}.
\]

The Preliminary Reference Earth Model then predicts the angles with no freedom:

| Boundary | Radius | \(\arcsin(r/R)\) | Angle quoted in the draft |
| --- | --- | --- | --- |
| Inner core | 1221 km | \(11.05^\circ\) | \(11^\circ\) |
| Core–mantle | 3480 km | \(33.11^\circ\) | \(33^\circ\) |
| 660 km depth | 5711 km | \(63.7^\circ\) | \(64^\circ\) |

They match. So the angles are a geometric measurement. An unknown \(\eta(r)\), even a terrible one, moves the heights of the steps and not their places, as long as the boundaries are sharp on the scale the camera resolves. The amplitude of a step mixes temperature, friction, and the jump in each. The position of a step is a radius.

This is the observation that makes the thermal Earth useful to someone who does not believe the placeholder. Seismology has the radii already; the new datum, once the radii are taken from the kinks, is \(\eta\) at thermal frequencies in each shell, which is a quantity the draft correctly says is unknown. The camera is then a viscometer, not a thermometer. Temperature is available from elsewhere, and Section VI already warns that \(j_\omega\) alone cannot separate \(T\) from the loss function. Hold that warning, and let the kinks carry the part of the measurement that is clean.

The inversion that makes the viscometer explicit is the Abel transform. With \(b=R\sin\theta\),

\[
N(b) = \int_b^{R} \frac{2 j(r)\, r\, dr}{\sqrt{r^2-b^2}},
\]

and

\[
j(r) = -\frac{1}{\pi}\int_r^{R}\frac{N'(b)}{\sqrt{b^2-r^2}}\,db.
\]

Figure 15 is one quadrature away from \(j(r)\). For uniform shells the integral is elementary and the derivative \(N'(b)\) carries the boundary. Doing it in the reference implementation, and showing that the recovered radii are stable when \(\eta\) is varied by orders of magnitude while the recovered \(j\) scales linearly, is a small piece of work with a large effect on how Section IX is read.

### 4.4 The midnight Sun and the Earth are not in the same photograph

The bolometric number radiance puts the Sun, the Earth, and the primordial sky on one axis. A camera with any spectral resolution would refuse to.

- Rock and iron glow through the shear response of condensed matter. A crystal has no phonons above its Debye frequency. For a Debye temperature of \(1000\,\mathrm{K}\) that frequency is \(k_B\theta_D/h \approx 21\,\mathrm{THz}\), a wavelength of about \(14\,\mu\mathrm{m}\). Above that, multi-phonon tails aside, a line of sight through the Earth goes dark.
- The solar core shines by particle bremsstrahlung up to energies of order a keV, frequencies of order \(10^{17}\,\mathrm{Hz}\), nanometre wavelengths, and by hydrodynamic fluctuations at lower frequencies. García-Cely & Ringwald compute this spectrum and a total power \(1.3\times 10^8\,\mathrm{W}\). The draft cites the power and then spreads it as a blob over the inner fifth of the radius.
- The primordial background, if it exists, is a blackbody at \(0.905\,\mathrm{K}\). Its energy per logarithmic frequency peaks at \(h\nu/k_BT=3.92\), so \(\nu\approx 74\,\mathrm{GHz}\), \(\lambda\approx 4.1\,\mathrm{mm}\). The peak of the *count* spectrum lies near \(h\nu/k_BT\approx 1.6\), about \(30\,\mathrm{GHz}\), a wavelength of a centimetre. That is the centimetre in Section XI.e. In the Wien tail at a keV the primordial sky is identically black.

Along the midnight line of sight the three emissions should be drawn as \(N(\hat n,\omega)\), not \(N(\hat n)\). A high-pass above the Debye frequency of mantle minerals is a candidate for a picture that contains the solar core and none of the Earth; whether the solar hydrodynamic piece leaks into that band is a question the García-Cely spectrum answers and a constant \(\eta\) cannot. The datacube is also the right response to the caveat already in the draft: a single \(j_N\) confuses temperature with friction. A spectrum is the gravitational colour Section VI defines and never plots.

The same cut protects the primordial claim. “Outshines the Sun” is true for a bolometric count rate and misleading in every band where a picture would actually be formed. At \(74\,\mathrm{GHz}\) the Sun is a hydrodynamic tail to be looked up, not \(4\times 10^5\) in the units of Figure 1. At a keV the primordial sky contributes nothing, and the Sun is the source. Both sentences can be true. They should not share a number.

### 4.5 Heat is weighed long before it is seen

The furnace section points out that the mass of the heat is tiny, about \(10^{-11}\,\mathrm{kg}\) per megajoule, so at ordinary sensitivity neither light nor the near field tells the furnaces apart. Take the next step and ask at what sensitivity the near field *does* feel it, and whether any graviton has arrived by then.

Iron, \(10\,\mathrm{kg}\), \(450\,\mathrm{J\,kg^{-1}K^{-1}}\), raised by \(1200\,\mathrm{K}\):

\[
\Delta U = 5.4\times 10^6\,\mathrm{J}, \qquad \Delta m = \frac{\Delta U}{c^2} = 6.0\times 10^{-11}\,\mathrm{kg},
\]

a fractional mass \(6\times 10^{-12}\). Detecting that fraction wants a signal-to-noise ratio of order \(10^{12}\) on the block. At that ratio the near-field blur, Eq. (13), is still about \(8^\circ\). The shape of the hot zone is not resolved. Its extra weight is.

The thermal channel at the same moment, from Table III, is one graviton per square metre every \(2\times 10^7\) years, and that number itself is an upper estimate if everyday viscosity is used at thermal frequencies. So within the thought experiment there are two thermometers, and they do not compete:

- the near field weighs the total heat, as a single number, with no spatial resolution of the temperature;
- the glow would resolve the hot volume, and it does not arrive.

For any exposure a civilisation might take, temperature enters this camera as mass-energy. The glow is the unique spatial thermometer, and it is also the one that stays empty. That sharpens Section VI rather than weakening it: the glow is not how the camera notices heat. It is the only way the camera would ever *locate* heat inside a body whose total mass it already knew. The furnace figure should show the fractional mass on the near-field panel. The eye then understands why the two panels are different instruments.

The same arithmetic fixes the scale of “see what emits no light.” A \(100\,\mathrm{kW}\) beam over a baseline of a metre weighs \(2P/c^3 \approx 7\times 10^{-21}\,\mathrm{kg\,m^{-1}}\). The draft’s tidal eigenvalues, \((-1,1,0)\times 4GP/(c^3 b^2)\), are \({\sim}10^{-30}\,\mathrm{s}^{-2}\) at one metre for that beam. The pattern — a null eigenvalue, a magnetic part that reverses with the Poynting vector — is the result worth keeping, and it is robust. The amplitude says the beam is a curiosity beside a person, and a real signal only as a difference against a beam-off exposure. The engine demo writes itself: flip the beam, watch \(B_{ij}\) flip, watch \(E_{ij}\) stay.

### 4.6 A placeholder viscosity, with the suppression written in

The number \(10^{-3}\,\mathrm{Pa\,s}\) is doing a great deal of work. It can be derived, up to a factor of order unity, as the low-frequency Akhiezer viscosity of a solid,

\[
\eta \sim \gamma^2 C_V T\,\tau,
\]

and the draft’s Maxwell model then says it does not survive to thermal frequencies:

\[
\operatorname{Re}\eta(\omega) = \frac{\eta_0}{1+\omega^2\tau^2}.
\]

Sketch, not a material property: Grüneisen parameter \(\gamma\sim 2\), volumetric heat capacity \(C_V\sim 2\times 10^6\,\mathrm{J\,m^{-3}K^{-1}}\), phonon time \(\tau\sim 10^{-12}\,\mathrm{s}\), at room temperature. Then \(\eta_0\sim 2\times 10^{-3}\,\mathrm{Pa\,s}\), which is where the placeholder lives, and \(\omega=k_BT/\hbar\sim 4\times 10^{13}\,\mathrm{s}^{-1}\), so \(\omega\tau\sim 40\) and

\[
\operatorname{Re}\eta(\omega)\sim 2\times 10^{-6}\,\mathrm{Pa\,s}.
\]

Three orders of magnitude, from a one-line relaxation model, in the direction the draft already suspects. Honey versus water, labelled as an everyday-viscosity exaggeration, is the same fact seen from the other side: large \(\eta_0\) means large \(\tau\) means *less* glow at \(\omega\tau\gg 1\).

The calculation to do properly, for one crystal whose ultrasonic attenuation is measured and one liquid whose THz shear response is measured, replaces the asterisk on Table III by a spectrum. Until then, every thermal rate in the paper should be read as proportional to a loss function that has not been evaluated, and the kink angles of Section 4.3 are the thermal observable that does not care.

Liquid iron in the outer core and perovskite in the lower mantle will not share a \(\tau\). That difference is a gravitational colour between shells, and it is a better target than a single \(\eta\) for the whole planet.

---

## 5. What “sharp” can mean, by channel

### 5.1 The near field saturates at a few hundred pixels

Equation (13) at a signal-to-noise ratio of \(10^6\) gives a blur of \(14^\circ\). The sky then holds a few hundred independent patches. At \(10^{30}\), still a few degrees, a few thousand patches. The quantum bound already in the draft, \(\mathrm{SNR}\lesssim M_s c^2\tau/\hbar\), gives about \(10^{70}\) for a person watched for the age of the universe and a blur of \(1.5^\circ\), a few times \(10^4\) patches on the sky.

So the near-field camera is a low-resolution instrument at every sensitivity the rest of physics allows. Pixel counts beyond a few hundred, at laboratory signal-to-noise, measure the same multipoles again. The engineering moral is the opposite of a photographic sensor: sensitivity per pixel is the whole problem, and the fill factor of the focal plane is not. A \(16\times 16\) array can saturate the information in the near field of a room. The thermal channel, if it could be recorded coherently at micrometre wavelengths, is the other way round and wants an aperture many wavelengths wide.

This belongs next to the handheld formula (14). A ten-centimetre camera at fifteen metres and \(\mathrm{SNR}=10^6\) sees \(\ell_\mathrm{max}\approx 4\), about \(40^\circ\), which the draft computes. The multipole cost of a *body* is the same wall from the other side. A mass multipole of order \(\ell\) for a body of size \(R\) at distance \(r\) is smaller than the monopole tide by about \((R/r)^\ell\). A person at a few metres has \(r/R\sim 10\). Then \(\ell=2\) costs a factor \(10^2\) in signal-to-noise, \(\ell=4\) a factor \(10^4\), and a face, at \(\ell\sim 30\), a factor \(10^{30}\) before the logarithmic blur is even asked. The two arguments agree: the camera weighs, it sees the quadrupole of a posture, and it does not draw a face. Tracking the mass through the building is the capability that survives. The millimetre Cramér–Rao bound is a tracker’s bound, and the \(24^\circ\) image is what you show an audience so they stop asking for a portrait.

### 5.2 The glow can be focused in depth, and the aperture has a number

A coherent aperture of width \(D\) at wavelength \(\lambda\) focuses in depth out to about \(D^2/\lambda\), with axial resolution of order \(\lambda(r/D)^2\). The draft gives the ranging formula and never plugs in thermal numbers.

At \(\lambda=10\,\mu\mathrm{m}\) and \(D=1\,\mathrm{m}\) the Fresnel distance is \(100\,\mathrm{km}\). At a range of \(10\,\mathrm{m}\) the depth of field is about a millimetre; at \(1\,\mathrm{km}\) it is about \(10\,\mathrm{m}\). A metre-class coherent camera, in the thought experiment where the field is recorded, is a light-field camera. It refocuses after the fact through a city, and walls do not enter the kernel. People still fail the rate test: \(10^{-35}\,\mathrm{W}\) at \(10\,\mu\mathrm{m}\) is a few times \(10^{-16}\) gravitons per second from the whole person, of order one graviton per hundred million years, before the aperture fraction. The city-scale focal stack is geological or it is empty.

The Earth is the source that changes the arithmetic, because the path length is the planet. Take the draft’s downward rate, one graviton per square metre every five hours, which is the placeholder and scales with \(\eta\). Ask for \(100\,\mathrm{km}\) depth resolution at \(r=R_\oplus\) and \(\lambda=10\,\mu\mathrm{m}\):

\[
D \approx R_\oplus\sqrt{\frac{\lambda}{\delta z}} \approx 64\,\mathrm{m}.
\]

The whole Earth then lies inside the Fresnel distance of that aperture (\(D^2/\lambda\sim 4\times 10^5\,\mathrm{km}\)). The collecting area is about \(3\times 10^3\,\mathrm{m}^2\), the rate about \(0.2\) gravitons per second, and a year of exposure about \(6\times 10^6\) gravitons. A hundred-kilometre voxelisation of the Earth has of order \(10^6\) cells. A few counts per cell, in a year, at the placeholder viscosity — and a few thousand years if the relaxation suppression of Section 4.6 applies.

This is the right way to talk about faintness. “One graviton in five hours” describes a square metre and a bolometric integral. The question a reader has is: *what aperture makes a picture, in what time, at what resolution, in which band.* The \(64\,\mathrm{m}\) aperture is a thought-experiment answer with the viscosity still factored out in front. It belongs in Section IX next to Table III. It also forces the quantum point, which the draft already understands: those counts form an image only if the aperture combines the field before the detection, or converts the graviton to something focusable. The \(64\,\mathrm{m}\) dish is that combiner. It is spacetime’s version of the lens the first paragraph of Section VII says you cannot build out of steel.

### 5.3 Hanbury Brown–Twiss does not sneak past the occupation number

Someone will suggest intensity interferometry, which recovers angular information from thermal light without measuring phase. It is the channel the draft already bounds. Coherent combination extracts information in proportion to the occupation \(\bar n\); pixel-wise recording, and the intensity correlations that can be built from it, extract it in proportion to \(\bar n^2\). With

\[
\bar n(\omega,\hat n) \approx \frac{\tau_\omega}{e^{\hbar\omega/k_BT}-1}, \qquad \tau_\omega=\int\alpha(\omega)\,ds \ll 1,
\]

and \(\tau_\omega\sim 10^{-30}\) or smaller, the square is not a strategy. The formula for \(\bar n\) should appear explicitly. The phrase “each mode holds of order \(10^{-30}\) gravitons” is this expression, evaluated, and readers will want to see the evaluation.

The primordial background is the exception that makes the formula worth having. At \(0.905\,\mathrm{K}\), near \(h\nu\sim k_BT\), the occupation of the *received* field is of order unity or larger in the Rayleigh–Jeans tail, because the optical depth is the optical depth of the early universe, not of a room. That sky is a classical stochastic tensor field. The room is a particle-counting problem. Using one noise model for both is the other bolometric mistake.

### 5.4 Weak lensing is the same tensor with a different operator

A referee who works on large-scale structure will say that gravity already takes sharp pictures of unseen mass, and will point at weak lensing. The answer is the operator. Lensing measures a projection of the tidal field along a cosmological line of sight, a Radon-like transform, mildly ill-posed, able to be sharp. The handheld camera measures the tidal field on a surface *outside* the sources, and Laplace’s equation then forces the exponential. Same \(E_{ij}\), two different integral kernels, two different inverse problems. Local mass imaging is logarithmically ill-posed. Cosmological mass imaging is a projection. The paper should say this in one paragraph, or the most predictable objection will be aimed at a claim it does not make.

---

## 6. The sky, done at the same standard as the room

### 6.1 The strain of the 0.905 K sky

The temperature and the count rate are in the draft. The strain is what every gravitational-wave experimentalist will ask for, and it is determined.

Two polarization states, \(T_g=0.905\,\mathrm{K}\):

\[
u(\nu)\,d\nu = \frac{8\pi h\nu^3}{c^3}\frac{1}{e^{h\nu/k_BT_g}-1}\,d\nu.
\]

The density parameter per logarithmic frequency is \(\Omega_g(\nu)=\nu u(\nu)/\rho_c\). Integrated, \(\int\Omega_g\,d\ln\nu = aT_g^4/\rho_c \approx 6.6\times 10^{-7}\), which is the draft’s \(7\times 10^{-7}\) of critical. The characteristic strain follows the standard conversion

\[
h_c^2(\nu) = \frac{3H_0^2}{2\pi^2}\,\frac{\Omega_g(\nu)}{\nu^2}.
\]

| Frequency | \(\Omega_g\) | \(h_c\) |
| --- | --- | --- |
| \(1\,\mathrm{mHz}\) | \(1.5\times 10^{-47}\) | \(3\times 10^{-39}\) |
| \(1\,\mathrm{Hz}\) | \(1.5\times 10^{-38}\) | \(1\times 10^{-37}\) |
| \(100\,\mathrm{Hz}\) | \(1.5\times 10^{-32}\) | \(1\times 10^{-36}\) |
| \(74\,\mathrm{GHz}\) (energy peak) | \(4.9\times 10^{-7}\) | \(8\times 10^{-33}\) |

In the Rayleigh–Jeans tail \(\Omega_g\propto\nu^3\) and \(h_c\propto\nu^{1/2}\). The strain *grows* toward the peak and then dies in the Wien cutoff. That is the opposite shape from an inflationary nearly scale-invariant background, and it is the observational signature. LIGO’s band sits \(24\) orders of \(\Omega\) below the peak because \((100\,\mathrm{Hz}/74\,\mathrm{GHz})^3\) is that factor. A sentence in Section XI.e can prevent a reader from looking for this sky in pulsar-timing or interferometer data and concluding it is absent.

The plot that should exist: \(h_c(\nu)\) across thirty decades, with the peak at \(74\,\mathrm{GHz}\), the Rayleigh–Jeans rise, and the published upper limits. Vagnozzi & Loeb discuss the detection problem; the camera paper’s contribution is to read the same spectrum as an image, once the strain plot has made clear in which band an image could exist.

### 6.2 Lensing of the monopole, lensing of the spots

Bending conserves surface brightness, so a uniform background stays uniform. That sentence is right, and it is the reason Figure 20b has no bright ring.

It does not exhaust lensing. The draft also says the graviton sky repeats the large spots of the microwave sky. Those spots are anisotropies of order \(10^{-5}\), and lensing remaps them. The cosmic microwave background is lensed in exactly this sense: the monopole is untouched, the hot and cold spots are scrambled by a deflection field we now measure. If the large-scale Sachs–Wolfe pattern is common to photons and gravitons, the deflection field is common too, because both follow the same null geodesics. A difference, after the shared modes are aligned, cancels the primordial large-scale signal and the common lensing, and leaves the acoustic peaks, which the gravitons never had, together with the shadows, which only horizons cast.

The bullet “lensing cannot be seen in it” should be split. The monopole carries no lensing. The spots carry the same lensing map the microwave sky carries. That split is a more interesting claim than either half, and it tells a cosmologist that the camera has understood their observable.

Black-hole shadows on this sky are still special for a different reason: at \(74\,\mathrm{GHz}\) in *gravitons* there is no dust lane. The microwave sky in photons is full of foregrounds. The gravitational photograph of the same blackbody, in its own band, has the Galactic disc as a mild large-scale anisotropy at other frequencies and as nothing much at \(74\,\mathrm{GHz}\), pending the solar and stellar hydrodynamic tails. Spectral cleanliness is the real advantage. “Only black holes cast shadows” then means: the only dark discs are horizons, because nothing else absorbs, and there is no bright dusty foreground to imitate one.

### 6.3 The baseline that resolves Sagittarius A*

The shadow’s angular diameter is about \(54\,\mu\mathrm{as}\) for \(4.3\times 10^6\) solar masses at \(8.18\,\mathrm{kpc}\) (critical impact parameter \(\sqrt{27}\,GM/c^2\), the Schwarzschild value; spin corrects it at the ten-percent level). Matching that angle with a baseline \(D=\lambda/\theta\):

| Wavelength | What peaks there | Baseline | In Earth diameters |
| --- | --- | --- | --- |
| \(4.1\,\mathrm{mm}\) | energy per log frequency, \(74\,\mathrm{GHz}\) | \(1.6\times 10^4\,\mathrm{km}\) | \(1.2\) |
| \(1.0\,\mathrm{cm}\) | number counts, \(\sim 30\,\mathrm{GHz}\) | \(3.8\times 10^4\,\mathrm{km}\) | \(3.0\) |

A camera the size of the Earth, at the wavelength where this sky actually shines, resolves the shadow of the Galaxy’s black hole. The metre aperture of Section XI.e resolves a degree, which is the right aperture for the dipole and the large Sachs–Wolfe spots, and the wrong one for any black hole a reader has heard of. Both numbers should appear. The degree-scale camera is a cosmic-variance instrument: the large spots are sample-variance limited once they are detected at all, exactly as in the microwave background. The Earth-baseline camera is an aperture-synthesis instrument pointed at one shadow. They are different programmes, and the draft currently describes only the first.

The exposure-time calculation for the shadow edge is then ordinary radiometry of a \(10^{-3}\) (dipole) or \(10^{-5}\) (spots) or order-unity (shadow) anisotropy on a background whose strain is known. Cosmic variance, not graviton shot noise, limits the large spots if the field can be recorded at all. Shot noise limits a small shadow. Writing those two noises separately is the Section IX treatment, applied to the sky.

### 6.4 The Sun as a lens, with wave optics

Figure 21 is geometric optics, and the draft flags the wave-optical gap. The Fresnel number of a ray bundle of width the solar radius, focused at distance \(F\), is \(N_F=R_\odot^2/(\lambda F)\). With \(R_\odot^2/F \approx 6\times 10^3\,\mathrm{m}\) for the surface focus near \(550\,\mathrm{AU}\):

| Band | \(\lambda\) | \(N_F\) at \(548\,\mathrm{AU}\) | Geometric optics |
| --- | --- | --- | --- |
| LISA, \(3\,\mathrm{mHz}\) | \(1.0\times 10^8\,\mathrm{km}\) | \(6\times 10^{-8}\) | no |
| LIGO, \(100\,\mathrm{Hz}\) | \(3000\,\mathrm{km}\) | \(2\times 10^{-3}\) | no |
| \(50\,\mathrm{kHz}\) | \(6\,\mathrm{km}\) | \(\sim 1\) | marginal |
| Primordial peak, \(4\,\mathrm{mm}\) | \(4\,\mathrm{mm}\) | \(\sim 10^6\) | yes |
| Thermal, \(10\,\mu\mathrm{m}\) | \(10\,\mu\mathrm{m}\) | \(\sim 6\times 10^8\) | yes |

The transparent Sun does not lens any source LIGO or LISA will see. Diffraction erases the focal line. It is a geometric lens for the primordial band and for thermal gravitons, where the waves are short. In that regime the coherent gain on the focal line of a *point* source is of order \(4\pi^2 r_g/\lambda\), with \(r_g=GM_\odot/c^2\approx 1.5\,\mathrm{km}\): about \(10^{11}\) at optical wavelengths, about \(10^7\) at a centimetre, and less than one at \(100\,\mathrm{Hz}\), where the formula has in any case left its domain of validity. The uniform primordial background gains nothing, because surface brightness is conserved; the gain applies to a compact source sitting behind the disc. That source, amplified by \({\sim}10^7\) and focused onto a line a few astronomical units wide at centimetre gravitational wavelengths, is the “image of a compact source through the transparent Sun” the draft lists as unfinished, and the Fresnel number says which frequencies are worth the wave-optical integral.

There is a pleasant unity with Section 5.2. The coherent combiner that the occupation-number argument demands, and that no steel lens can be, is supplied geometrically by any mass with a large Fresnel number. The Sun is one. A Kerr black hole is the other, and it is the only object in the theory that also reflects, with a superradiant gain the draft cites and does not plot. A single figure, gain against frequency and spin, would finish the sentence “only a black hole provides useful broadband optics” by showing the optic.

### 6.5 Memory as an invertible photograph

Equation (33) maps the angular distribution of radiated energy to a permanent strain. The draft evaluates it for a merger, a jet, a counter-jet, and a sphere. The sphere gives zero. A pure dipole gives zero. The quadrupole does not. The pattern of those zeros is the selection rule: monopole and dipole are not radiative, and the memory, which is built from the waves, cannot see them.

What is missing is the multiplier for every higher multipole. The kernel depends only on the angle between the emission direction and the line of sight, so on the sphere it is diagonal in the spin-weighted harmonics. If the multiplier \(m_\ell\) is nonzero for every \(\ell\ge 2\), the memory is an invertible photograph of the energy flux, modulo the three components of momentum and the total energy. A camera that catches only the permanent step — a before and an after, with the burst itself unresolved — recovers the shape of the explosion. The jet curves in Figure 18 are then recognized as the \(\ell=2\) and \(\ell=3\) pieces of a unique inversion, not as four examples.

The near-field cousin should be named in the same breath. A book moved from a shelf to a table changes \(E_{ij}\) permanently and does not radiate any memory that matters. Call the first a radiative memory and the second a rearrangement. The rearrangement is the larger signal in every room, and it is the difference image of Section 2. The radiative memory is the rearrangement of the waves’ energy, visible from far away, smaller by the compactness of the source. Using one word for both will confuse a careful reader; computing both for one supernova — the mass defect in the near field as the neutrino shell passes, and the permanent \(\Delta h_{ij}\) from the anisotropy — is the picture that keeps them apart. The draft has both calculations. It needs one figure with both panels and the ratio of the two strains.

### 6.6 A polarized galaxy, and a clean foreground

Figure 19 is an intensity. Each white-dwarf binary also has a \(V/I\) fixed by its inclination, Eq. (19). A population with random inclinations averages \(V\) down and leaves a residual set by the distribution of orientations and by the quadrupole of the Galaxy’s mass. A bar, or any coherent rotating distortion, does not average to the same place as a disc of circular binaries. The polarized millihertz sky is a different map from the intensity sky, and it is an integral the existing code is close to being able to do: the same column of stellar mass, weighted by \(\langle V/I\rangle\) instead of by \(1\).

If that residual is small, the smallness is the result. It says the millihertz galaxy carries no net sense of rotation, which is a real statement about the foreground LISA has to live with.

---

## 7. The camera that already flew, and the one that already shook

### 7.1 GOCE is the logarithmic camera

The Gravity field and steady-state Ocean Circulation Explorer flew a gradiometer at about \(255\,\mathrm{km}\) and produced global models that are taken seriously up to spherical-harmonic degree \(\ell\sim 250\), a half-wavelength of about \(80\,\mathrm{km}\), beyond which downward continuation of the noise wins. That is the near-field camera of this paper, with the Earth as the scene and one pixel flown along an orbit until the orbit synthesizes the aperture.

The spherical form of the cutoff, algebraic factors aside, is

\[
\ell_\mathrm{max} \approx \frac{R}{h}\ln\mathrm{SNR}.
\]

With \(R/h\approx 25\) and \(\ell=250\), the formula reads back \(\mathrm{SNR}\sim e^{10}\sim 2\times 10^4\). That is a statement about the signal-to-noise ratio per mode at the degree where GOCE stops, and it should be checked against the published degree-wise error spectrum rather than admired. If it lands, the logarithmic law ceases to be a thought experiment and becomes the reason a map everyone has seen looks the way it does. If the algebraic prefactors — \(\ell^2\) from the derivatives, the difference between continuing the potential and continuing the gradient — move the number, that correction is itself a short, publishable paragraph and belongs in Section IV.

Either outcome is good for the paper. The law is then something a geodesist can falsify with a dataset, which is a stronger position than a law demonstrated on a sheet of point masses.

### 7.2 An earthquake is the first real frame

The prompt elasto-gravity signal is a near-field image that has already been recorded, at a handful of stations, as a scalar. The draft notes the split: compressional waves change density and so \(E_{ij}\); shear waves move mass sideways and so appear in \(B_{ij}\). The calculation that makes this undeniable is a forward model, not a metaphor. Take a public finite-fault rupture, compute \((E_{ij},B_{ij})\) at the stations that recorded the prompt signal, and show the two tensors. The reference implementation’s moving-mass kernel is almost the right kernel; the missing piece is the elastic Green’s function telling the masses how to move, which seismology will provide as a displacement field.

A regional array of ideal pixels around that rupture, coloured by the invariant of Section 8, is the demo that connects the paper to data without pretending the paper is an instrument proposal. It is also the natural test of “telling waves from pull in the presence of noise,” listed as unfinished: the earthquake is a pull, the passing seismic waves are a moving mass, and a real noise spectrum exists.

### 7.3 The Earth’s spin, as a number

Outside a spinning body the magnetic tide is the spin dipole the draft writes down. For the Earth, \(I\sim 0.33\,MR^2\) and \(\omega\sim 7.3\times 10^{-5}\,\mathrm{s}^{-1}\),

\[
B \sim \frac{3GI\omega}{cR^4} \sim 2\times 10^{-12}\,\mathrm{s}^{-2}, \qquad \frac{B}{E}\sim 1.5\times 10^{-6} \sim \frac{\omega R}{c}.
\]

The ratio matches the draft’s \(|B|/|E|\sim v/c\). The absolute scale says the Earth’s rotation is a \(10^{-12}\,\mathrm{s}^{-2}\) signal of a pure symmetry: a spin dipole, orthogonal in angular pattern to every mass multipole. Differential rotation of the core moves the current multipoles and leaves the mass multipoles nearly alone. A camera that can see \(B_{ij}\) at that level is doing frame-dragging geodesy in angular detail, which Gravity Probe B and the satellite laser-ranging analyses did for the dipole only. Worth one paragraph and one map, even if the map is schematic, because it shows the magnetic half of the camera seeing something the electric half is blind to, on a body everyone can point at.

---

## 8. A raw format for the engine

Inversion is ambiguous. The field is not. Every pixel can publish, at each instant, a set of scalars that do not require a scene model.

Let \(\mathcal{C}\) be the normalized cubic invariant of the electric tide,

\[
\mathcal{C}[E] = \frac{\operatorname{tr}(E^3)}{(\operatorname{tr} E^2)^{3/2}}.
\]

For a point mass the eigenvalues are \((-2,1,1)\) times \(GM/r^3\), and \(\mathcal{C}=-1/\sqrt{6}\). For a wave or a light beam the eigenvalues are \((\lambda,-\lambda,0)\) up to a rotation, the cubes cancel, and \(\mathcal{C}=0\). The determinant vanishes in the second case and equals \(-2(GM/r^3)^3\) in the first. The ratio \(|B|/|E|\) is \(1\) for a wave and for a beam of radiation, and \(v/c\) for slow matter. The time derivative separates the wave from the steady beam, and the reversal of \(B_{ij}\) when the beam is turned around separates direction.

Together with \(\operatorname{tr} E\), which is the density when you are inside matter and zero when you are not, these are a raw format. A false-colour view of \(\mathcal{C}\), of \(|B|/|E|\), and of the super-Poynting direction computed from \(E_{ij}\) and \(B_{ij}\), is a picture of the field rather than of a reconstructed scene. It has no null-space freedom. It is also the debug view the engine wants: the spiral in Figure 17 should carry arrows of flux, outward, and the near zone of the pair should carry arrows that circulate and store, with a magnitude smaller by the appropriate power of \(v/c\).

Normalise the super-Poynting vector so that a unit plane wave reproduces the Isaacson flux. That single test fixes the factor, which depends on the convention already chosen for \(B_{ij}\) in Eq. (5).

The frequency slider then has something honest to show. One scene: a person, a safe, a rotor, a furnace, a beam of light. One integrator. Four octaves displayed as four layers, or as a sweep:

- below a hertz, the difference-image of mass, coloured by \(\mathcal{C}\approx -1/\sqrt{6}\);
- the rotor’s band, a point, \(\mathcal{C}=0\), colour \(V/I\);
- the beam, steady, \(\mathcal{C}=0\), \(B_{ij}\) pointing along it;
- the thermal band, a transparent volume, no arrows to speak of, a spectrum instead of a colour.

The slowed-light teaching mode can stay, clearly labelled, for the day someone needs to see a wavelength with their eyes. It should not be the main path through the engine. It rescales one regime and leaves the others unrepresented. The slider is the argument.

A second mode, “ensemble,” draws the null space. Slider from “minimum-variation density” through “shelliest” to “balliest,” at fixed pixel data. A third, “exposure,” Poisson-samples the thermal datacube from one second to \(10^9\) years, so Table III is felt rather than read. A fourth, “subtract the Earth,” is the difference image, and it should be the default for every near-field scene.

The reference implementation is already the right place for this. The contribution to the community is to expose the linear operator, not only the pictures: a small library that, given \(T^{\mu\nu}\) on a grid, returns \((E_{ij},B_{ij})\) and the three regularised inverses, with the tests the draft already runs (power integrated over the sphere, \(V/I\) against the analytic rotor, curvature of vacuum, agreement of the two thermal integrators to parts in a million). A paper that offers that library will be used by people who never open the thought experiment.

---

## 9. Further directions that are worth a page and not a chapter

**Gravitational Stokes imaging of a single wave.** The draft proves that one pixel sees only \(\ell\le 4\), twenty-five numbers, and that linear polarization enters only at exactly degree 4. The array upgrade is the full Stokes maps \(I,Q,U,V\) on the sky. For an unresolved rotor this collapses to the two amplitudes and the angle \(\iota\) already plotted. For the galactic foreground it is Section 6.6. For a stochastic background it is the anisotropy measurement Allen & Ottewill formulated, now with all ten components rather than one antenna pattern. The proof in Section VII is the \(\ell_\mathrm{max}=4\) case of that formalism; citing the match makes the proof a bridge rather than a rediscovery.

**A gravimeter is a different camera.** Pixels fixed to the ground measure proper acceleration as well as the tide. The uniform sheet, invisible to \(E_{ij}\), is visible to \(g_i\). The forward multiplier loses the factor of \(k\) and keeps \(e^{-kz}\). Resolution changes, and the monopole returns. The draft defines the free-fall camera, which is the relativistically clean object. One paragraph on the Earth-fixed camera prevents a long argument with instrumentalists who quite reasonably bolt their sensors down. The equivalence principle is the reason the two cameras differ, and it can be said in four lines with the two multipliers.

**Dark matter in the room.** A clump that gravitates and has no shear response at any frequency — cold, dissipationless — appears in the multipoles and not in the glow. Ordinary hot matter appears in both. A beam of light appears in neither the mass pattern nor the glow, and instead in the null-eigenvalue channel. The three-way split is an existence proof that the channels are independent, and it is the cleanest way to explain why gravitational colour is not a picture of mass. No one needs to pretend the camera is a dark-matter detector. The point is the independence of the kernels.

**The weight of a sound wave.** A compressional wave changes \(\rho\) and therefore \(E_{ij}\) by a fractional density equal to the strain of the sound. For a megapascal-scale stress in steel the density perturbation is of order \(10^{-5}\) relative, and the tidal signal is that fraction of the tide of the object. This is the laboratory-scale version of the earthquake calculation, and it can be done on a bell. A ringing sphere is also the example that evades Section 4.1: the body is large, the motion is small, the wavelength of the gravitational wave at acoustic frequencies is long, and the *near-field* camera still sees the whole mode shape, because the near field is not diffraction-limited by \(\lambda\). The mode shape of a bell, seen through its gravitational tide, is a lovely exact solution (the elastic sphere is in the literature the draft cites) and a good engine test.

**Superradiance as the mirror.** Teukolsky & Press, already cited: a spinning hole amplifies some waves. Plot the gain against spin and against the azimuthal number, and the “only a black hole is a mirror” line acquires a frequency response. A mirror with gain is a strange optic. It is also the one optic the theory contains, so the camera paper is allowed to be the place where its modulation transfer function is drawn for a non-specialist.

**The small-scale anisotropy, computed rather than described.** Section XI.e says the graviton sky matches the microwave sky on large scales and differs below about a degree, having no acoustic peaks. A schematic \(C_\ell\) with a shared Sachs–Wolfe plateau and a free-streaming cutoff, even if the full Boltzmann code is someone else’s, would make that sentence a figure. The camera-specific addition is the shadow of a single nearby horizon punched into that \(C_\ell\) as a non-Gaussian hole, and the dipole of our motion, \(v/c=1.2\times 10^{-3}\), which is a calibration source the sky provides for free.

**A person is a worldline.** The demo that tells the truth about the near field: the face never appears, the mass estimate converges, the trajectory through the house is millimetres at high signal-to-noise and a metre at modest signal-to-noise, and the sense in which they turned around is the sign of \(V\) only if they are rotating faster than the near zone allows — otherwise it is the current column of Section VIII, a vortex in \(B_{ij}\). Showing the tracker succeed and the portrait fail, in one animation, is the abstract of Section IV.

---

## 10. What I would change in the draft, in order

1. **The abstract’s list of results.** Add the observable/null-space sentence. Add that \(\lambda/d\ge\pi/2\). Keep the sixth of a wavelength, the memory, the galactic centre, and \(0.905\,\mathrm{K}\), and attach the baseline that resolves Sagittarius A* to the last of these.
2. **Figure 8.** Three interiors, one exterior. The blurred \(S\) moves to a supplement as the point-spread illustration it already is.
3. **A new Figure of the three multipliers**, the table of Section 3, as the organising result of the theory sections.
4. **Figure 15 inverted**, with the kink condition \(\sin\theta=r/R\) written on the figure, and a note that the horizontal axis is a measurement of radius.
5. **Replace the bolometric ladder** (Figure 16 and the comparisons in Section XI) with spectra. One panel, thirty decades, Earth / Sun / primordial / rotor, each with its own band.
6. **The strain table for \(0.905\,\mathrm{K}\)** and the split lensing statement.
7. **The inspiral table for \(r_\star/d\)**, and one numerical-relativity frame.
8. **GOCE**, one paragraph, as the empirical face of Eq. (13).
9. **The furnace**, with the fractional mass of the heat written on the near-field panel.
10. **The engine**, one kernel and a frequency slider, plus the ensemble mode for the null space. Publish the operator.

The unfinished list in Section XII is the right list. The order above is the order in which those items change a reader’s mind.

Literature still to be read, beyond what the draft names: Parker’s ideal-body theory, which is the null space made into a drawing convention; the tendex-and-vortex analyses of numerical binary mergers; the wave optics of the solar gravitational lens; the degree-wise error spectrum of GOCE; a measured \(\operatorname{Im}\mu(\omega)\) for one real solid at terahertz frequencies; and the angular-momentum decomposition of gravitational-wave memory. None of these, if they already contain a piece, replaces the synthesis. Several of them contain a piece, and the draft’s caution about novelty claims is the right caution until they have been opened.

---

## 11. Worked calculations

Constants used throughout: \(G=6.67430\times 10^{-11}\,\mathrm{m^3\,kg^{-1}s^{-2}}\), \(c=2.99792458\times 10^8\,\mathrm{m\,s^{-1}}\), \(h=6.62607015\times 10^{-34}\,\mathrm{J\,s}\), \(\hbar=h/2\pi\), \(k_B=1.380649\times 10^{-23}\,\mathrm{J\,K^{-1}}\), \(M_\odot=1.98847\times 10^{30}\,\mathrm{kg}\), \(R_\odot=6.957\times 10^8\,\mathrm{m}\), \(1\,\mathrm{AU}=1.495978707\times 10^{11}\,\mathrm{m}\), \(M_\oplus=5.9722\times 10^{24}\,\mathrm{kg}\), \(R_\oplus=6.371\times 10^6\,\mathrm{m}\), \(H_0=67.4\,\mathrm{km\,s^{-1}Mpc^{-1}}\).

### A1. Bulk motion cannot resolve itself

Equal masses \(m\), separation \(d\), orbital frequency \(\Omega\), each moving at

\[
v = \Omega\frac{d}{2}, \qquad \Omega^2 = \frac{G(2m)}{d^3}.
\tag{A1}
\]

The gravitational wave has frequency \(\Omega/\pi\) and wavelength

\[
\lambda = \frac{\pi c}{\Omega}.
\tag{A2}
\]

Divide:

\[
\frac{\lambda}{d} = \frac{\pi c}{\Omega d} = \frac{\pi}{2}\,\frac{c}{v}.
\tag{A3}
\]

Since \(v<c\),

\[
\frac{\lambda}{d} > \frac{\pi}{2} \approx 1.571.
\tag{A4}
\]

The source fits inside one wavelength at every speed. An aperture imaging at wavelength \(\lambda\) cannot separate features much smaller than \(\lambda\), so the body is a point in its own quadrupole radiation. Equality in (A4) is not available inside the model.

The exceptions are outside the hypothesis of (A1): a displacement field of amplitude \(\xi\ll d\) on a body of size \(d\) radiates at a wavelength \(c/f\) that can be smaller than \(d\) if the frequency is high enough, and a collection of independent binaries across a galaxy is an extended source because the source is the galaxy.

### A2. Where a binary stops looking like two masses

The near/wave boundary used in the draft is \(r_\star=\lambda/2\pi\). From (A2),

\[
r_\star = \frac{c}{2\Omega} = \frac{c\,d}{4v}.
\tag{A5}
\]

Eliminating \(v\) with (A1),

\[
\frac{r_\star}{d} = \frac{1}{2}\sqrt{\frac{c^2 d}{GM_\mathrm{tot}}}, \qquad M_\mathrm{tot}=2m.
\tag{A6}
\]

Horizons of two nonspinning holes touch when \(d=4Gm/c^2=2GM_\mathrm{tot}/c^2\). Then (A6) gives \(r_\star/d=1/\sqrt{2}\approx 0.707\), and (A1) gives \(v=c/\sqrt{8}\approx 0.354\,c\).

For the draft’s pair, \(m=30M_\odot\), \(d=2.2\times 10^6\,\mathrm{m}\):

\[
\begin{aligned}
\Omega &= 27.34\,\mathrm{s}^{-1},\\
v/c &= 0.1003,\\
\lambda &= 3.444\times 10^{7}\,\mathrm{m},\\
r_\star &= 5.481\times 10^{6}\,\mathrm{m} = 2.492\,d.
\end{aligned}
\tag{A7}
\]

The table in Section 4.2 is (A6) at several separations. Linearized gravity is a guide, as the draft says, once \(d\) is a few horizon radii; the table shows the guide losing its near zone at the same place.

### A3. Geometric radii from the thermal steps

Observer at radius \(R\), line of sight at angle \(\theta\) from the inward normal. The perpendicular distance from the Earth’s centre to the ray is

\[
b = R\sin\theta.
\tag{A8}
\]

A sphere of radius \(r_s\) is tangent to the ray at \(b=r_s\), hence \(\sin\theta=r_s/R\). With \(R=6371\,\mathrm{km}\):

\[
\begin{aligned}
r=1221\,\mathrm{km} &\Rightarrow \theta=11.05^\circ,\\
r=3480\,\mathrm{km} &\Rightarrow \theta=33.11^\circ,\\
r=5711\,\mathrm{km} &\Rightarrow \theta=63.69^\circ.
\end{aligned}
\tag{A9}
\]

The chord integral of a spherical emissivity is the Abel transform

\[
N(b)=\int_b^{R}\frac{2j(r)\,r\,dr}{\sqrt{r^2-b^2}},
\tag{A10}
\]

with inverse

\[
j(r)=-\frac{1}{\pi}\int_r^{R}\frac{dN/db}{\sqrt{b^2-r^2}}\,db,
\tag{A11}
\]

valid when \(j\) depends only on radius and the ray is the full chord. A jump in \(j\) at \(r_s\) produces a singularity in \(dN/db\) at \(b=r_s\) and nowhere else. Scaling \(j\) by a constant, or by a different constant in each shell, does not move \(b\). Therefore the angles survive an arbitrary piecewise rescaling of \(\eta\), and the inverted amplitudes return \(\eta\) once \(T(r)\) is taken from elsewhere, through \(\alpha=16\pi G\eta/c^3\) and \(j_\omega=\alpha B_\omega(T)\).

### A4. Spectral landmarks

Debye frequency at \(\theta_D=1000\,\mathrm{K}\):

\[
\nu_D=\frac{k_B\theta_D}{h}=2.08\times 10^{13}\,\mathrm{Hz}, \qquad \lambda_D=\frac{c}{\nu_D}=14\,\mu\mathrm{m}.
\tag{A12}
\]

Thermal angular frequency at \(300\,\mathrm{K}\):

\[
\omega_T=\frac{k_BT}{\hbar}=3.93\times 10^{13}\,\mathrm{s}^{-1}.
\tag{A13}
\]

A keV, as a frequency:

\[
\nu(\mathrm{keV})=\frac{10^3\,e}{h}=2.42\times 10^{17}\,\mathrm{Hz}, \qquad \lambda=1.24\,\mathrm{nm}.
\tag{A14}
\]

Primordial blackbody, \(T_g=0.905\,\mathrm{K}\). The density \(u(\nu)\) of (the energy spectral density in Section 6.1) weighted by \(\nu\), that is \(\nu u(\nu)\propto x^4/(e^x-1)\) with \(x=h\nu/k_BT\), peaks at

\[
x_E=3.921, \qquad \nu_E=73.9\,\mathrm{GHz}, \qquad \lambda_E=4.05\,\mathrm{mm}.
\tag{A15}
\]

The number spectrum \(\propto x^2/(e^x-1)\) peaks at

\[
x_N=1.594, \qquad \nu_N=30.1\,\mathrm{GHz}, \qquad \lambda_N=9.97\,\mathrm{mm}.
\tag{A16}
\]

Number radiance of an isotropic blackbody of two helicities, checked against the photon count at \(T=2.7255\,\mathrm{K}\):

\[
N=\frac{4\zeta(3)}{c^2}\left(\frac{k_BT}{h}\right)^3,
\tag{A17}
\]

which equals \(n c/4\pi\) with \(n\) the number density. At \(2.7255\,\mathrm{K}\), \(N=9.80\times 10^{15}\,\mathrm{s^{-1}m^{-2}sr^{-1}}\). At \(0.905\,\mathrm{K}\),

\[
N_g=N_\gamma\left(\frac{0.905}{2.7255}\right)^3=3.59\times 10^{14}\,\mathrm{s^{-1}m^{-2}sr^{-1}},
\tag{A18}
\]

against the draft’s \(3.6\times 10^{14}\).

### A5. Strain of that blackbody

Critical energy density \(\rho_c c^2\) is written here as an energy per volume,

\[
\rho_c=\frac{3H_0^2 c^2}{8\pi G}=7.67\times 10^{-10}\,\mathrm{J\,m^{-3}}.
\tag{A19}
\]

Radiation constant \(a=4\sigma/c\). The integrated gravitational density parameter, two helicities, is

\[
\Omega_{g,\mathrm{tot}}=\frac{aT_g^4}{\rho_c}=6.62\times 10^{-7}.
\tag{A20}
\]

Spectral density, same convention as a photon gas,

\[
u(\nu)=\frac{8\pi h \nu^3}{c^3}\frac{1}{e^{h\nu/k_BT_g}-1}, \qquad
\Omega_g(\nu)=\frac{\nu\,u(\nu)}{\rho_c}.
\tag{A21}
\]

Characteristic strain,

\[
h_c(\nu)=\frac{H_0}{\nu}\sqrt{\frac{3\,\Omega_g(\nu)}{2\pi^2}}.
\tag{A22}
\]

Rayleigh–Jeans, \(h\nu\ll k_BT\): \(u(\nu)\approx 8\pi\nu^2 k_BT/c^3\), so \(\Omega_g\propto\nu^3\) and \(h_c\propto\nu^{1/2}\). The numerical values in the table of Section 6.1 are (A21) and (A22) evaluated directly. At \(74\,\mathrm{GHz}\), \(\Omega_g=4.87\times 10^{-7}\) and \(h_c=8.0\times 10^{-33}\).

### A6. Shadow baseline

Schwarzschild critical impact parameter \(b_c=\sqrt{27}\,GM/c^2\). For \(M=4.3\times 10^6 M_\odot\) at \(D=8.178\,\mathrm{kpc}\),

\[
\theta_\mathrm{rad}=\frac{b_c}{D}=1.307\times 10^{-10}, \qquad \theta=27.0\,\mu\mathrm{as}
\tag{A23}
\]

as a radius, so the diameter is \(54\,\mu\mathrm{as}\). The baseline that matches the diameter, \(D_B=\lambda/(2\theta_\mathrm{rad})\):

\[
\begin{aligned}
\lambda=4.05\,\mathrm{mm} &\Rightarrow D_B=1.55\times 10^7\,\mathrm{m}=1.22\,D_\oplus,\\
\lambda=9.97\,\mathrm{mm} &\Rightarrow D_B=3.81\times 10^7\,\mathrm{m}=2.99\,D_\oplus,
\end{aligned}
\tag{A24}
\]

with \(D_\oplus=1.2742\times 10^7\,\mathrm{m}\). Spin, a Kerr shadow, and a resolution criterion stricter than “one fringe across the diameter” move these by a factor of order unity. The Earth-scale conclusion does not move.

### A7. Fresnel number of the solar lens

\[
N_F=\frac{R_\odot^2}{\lambda F}.
\tag{A25}
\]

At the surface focus of the draft’s Eddington model, \(F=548\,\mathrm{AU}\), \(R_\odot^2/F=5.90\times 10^3\,\mathrm{m}\). Geometric optics wants \(N_F\gg 1\), so \(\lambda\ll 6\,\mathrm{km}\), a frequency of tens of kilohertz and above. The values in the table of Section 6.4 are (A25).

The coherent intensity gain of the solar gravitational lens on its focal line, in the geometric-optics regime, scales as

\[
\mu\sim\frac{4\pi^2 r_g}{\lambda}, \qquad r_g=\frac{GM_\odot}{c^2}=1.477\,\mathrm{km}.
\tag{A26}
\]

This gives \(\mu\sim 1.2\times 10^{11}\) at \(0.5\,\mu\mathrm{m}\), \(\mu\sim 1.5\times 10^{7}\) at \(4\,\mathrm{mm}\), and \(\mu\sim 0.02\) at \(100\,\mathrm{Hz}\). The last of these is outside the regime and is quoted only to show that the estimate and the Fresnel number fail together. The coefficient in (A26) is the standard order of magnitude; a wave-optical calculation replaces it with a function of impact parameter and of \(N_F\).

### A8. Weight of the heat, and the blur at that sensitivity

\[
\Delta U = c_p M\Delta T = 450\times 10\times 1200 = 5.4\times 10^6\,\mathrm{J},
\tag{A27}
\]

\[
\Delta m=\Delta U/c^2=6.01\times 10^{-11}\,\mathrm{kg}, \qquad \frac{\Delta m}{M}=6.0\times 10^{-12}.
\tag{A28}
\]

A detection at five standard deviations wants \(\mathrm{SNR}\sim 10^{12}\) on the block. Solve \(q e^{-q}=1/(\pi\,\mathrm{SNR})\) for the draft’s cutoff:

\[
q_c(10^{12})=32.25, \qquad \Delta\theta=\frac{4.43}{q_c}\times\frac{180}{\pi}=7.9^\circ.
\tag{A29}
\]

The same root gives the pixel-budget orientation of Section 5.1: \(\Delta\theta(10^6)=14.2^\circ\), \(\Delta\theta(10^{30})=3.4^\circ\), and \(\Delta\theta(2.6\times 10^{70})=1.51^\circ\), the last from \(M_s c^2\tau/\hbar\) with \(M_s=70\,\mathrm{kg}\) and \(\tau\) the age of the universe, reproducing the draft’s bound.

### A9. Aperture for a depth-sliced Earth

Axial scale \(\delta z\sim \lambda (r/D)^2\). Set \(r=R_\oplus\), \(\lambda=10\,\mu\mathrm{m}\), \(\delta z=100\,\mathrm{km}\):

\[
D=R_\oplus\sqrt{\frac{\lambda}{\delta z}}=63.7\,\mathrm{m}.
\tag{A30}
\]

Area \(A=\pi D^2/4=3.19\times 10^3\,\mathrm{m}^2\). The draft’s downward rate at the placeholder viscosity is one graviton per square metre per five hours,

\[
\dot n = 5.56\times 10^{-5}\,\mathrm{s^{-1}m^{-2}}.
\tag{A31}
\]

A year collects \(\dot n\, A\, t \approx 5.6\times 10^6\) gravitons. The number of \(100\,\mathrm{km}\) cells in the Earth’s volume is about \(1.1\times 10^6\). Counts per cell per year: about five, scaling linearly with \(\eta/\eta_\mathrm{placeholder}\).

The Fresnel distance of this aperture is \(D^2/\lambda=4.1\times 10^5\,\mathrm{km}\), so the focusing assumption is consistent. For a one-metre aperture the same formula gives a Fresnel distance of \(100\,\mathrm{km}\) and a depth of field \(\lambda(r/D)^2\) equal to \(1\,\mathrm{mm}\) at \(10\,\mathrm{m}\), \(10\,\mathrm{m}\) at \(1\,\mathrm{km}\), and \(1\,\mathrm{km}\) at \(10\,\mathrm{km}\).

### A10. Relaxation suppression of the glow

\[
\eta_0\sim\gamma^2 C_V T\tau.
\tag{A32}
\]

Insert \(\gamma=2\), \(C_V=2\times 10^6\,\mathrm{J\,m^{-3}K^{-1}}\), \(T=300\,\mathrm{K}\), \(\tau=10^{-12}\,\mathrm{s}\):

\[
\eta_0\sim 2.4\times 10^{-3}\,\mathrm{Pa\,s}.
\tag{A33}
\]

At \(\omega=\omega_T\) from (A13), \(\omega\tau\approx 39\) and

\[
\operatorname{Re}\eta(\omega)=\frac{\eta_0}{1+\omega^2\tau^2}\sim 1.6\times 10^{-6}\,\mathrm{Pa\,s}.
\tag{A34}
\]

This is an estimate with placeholder microphysics, useful as a factor to carry in front of Table III and not as a value to quote for the Earth. The absorption coefficient at the unsuppressed placeholder \(\eta=10^{-3}\,\mathrm{Pa\,s}\) is

\[
\alpha=\frac{16\pi G\eta}{c^3}=1.25\times 10^{-37}\,\mathrm{m^{-1}},
\tag{A35}
\]

a mean free path of order \(10^{21}\) light-years, as in the draft.

### A11. The Earth’s magnetic tide

\[
I\approx 0.33\,M_\oplus R_\oplus^2=8.0\times 10^{37}\,\mathrm{kg\,m^2}, \qquad \omega=7.292\times 10^{-5}\,\mathrm{s}^{-1}.
\tag{A36}
\]

Order of magnitude of the spin-dipole magnetic tide at the surface,

\[
B\sim\frac{3GI\omega}{c R_\oplus^4}=2.4\times 10^{-12}\,\mathrm{s}^{-2}.
\tag{A37}
\]

The electric tide of the mass is \(GM_\oplus/R_\oplus^3=1.54\times 10^{-6}\,\mathrm{s}^{-2}\), so \(B/E=1.5\times 10^{-6}\). The surface rotation speed over \(c\) is \(\omega R_\oplus/c=1.55\times 10^{-6}\).

### A12. Electric invariant

On the tidal tensor of a point mass, eigenvalues \((-2,1,1)\lambda\) with \(\lambda=GM/r^3\):

\[
\operatorname{tr}(E^2)=6\lambda^2, \qquad \operatorname{tr}(E^3)=-6\lambda^3,
\tag{A38}
\]

\[
\mathcal{C}=\frac{\operatorname{tr}(E^3)}{(\operatorname{tr} E^2)^{3/2}}=\frac{-6}{6^{3/2}}=-\frac{1}{\sqrt{6}}.
\tag{A39}
\]

On a tensor with eigenvalues \((\lambda,-\lambda,0)\), \(\operatorname{tr}(E^3)=0\), so \(\mathcal{C}=0\). The determinant is \(-2\lambda^3\) in the first case and \(0\) in the second. Both scalars are local, need no array, and are unchanged by rotating the pixel’s axes.

### A13. Multipole cost for an extended body

The Newtonian potential of a mass multipole of order \(\ell\) falls as \(r^{-(\ell+1)}\). Two derivatives make a tide falling as \(r^{-(\ell+3)}\), with an algebraic factor of order \(\ell^2\). Relative to the monopole tide \(GM/r^3\), a moment \(I_\ell\sim MR^\ell\) contributes

\[
\frac{E_\ell}{E_0}\sim \left(\frac{R}{r}\right)^\ell
\tag{A40}
\]

up to that algebraic factor. For \(r/R=10\), each additional order costs a factor ten in signal-to-noise ratio. Measuring \(\ell=4\) wants \(\mathrm{SNR}\gtrsim 10^4\) on the monopole; measuring \(\ell=30\) wants \(\gtrsim 10^{30}\). Combined with (A29), the shape information runs out while the mass and the low multipoles are still comfortable. This is the body-by-body version of the handheld count, Eq. (14) of the draft.

### A14. Light beam

The draft’s eigenvalues at perpendicular distance \(b\) from a steady beam of power \(P\) have magnitude \(4GP/(c^3 b^2)\). For \(P=100\,\mathrm{kW}\) and \(b=1\,\mathrm{m}\),

\[
\frac{4GP}{c^3 b^2}=9.9\times 10^{-31}\,\mathrm{s}^{-2}, \qquad \frac{2P}{c^3}=7.4\times 10^{-21}\,\mathrm{kg\,m^{-1}}.
\tag{A41}
\]

The pattern, not the amplitude, is the observable: eigenvalues in the ratio \((-1,1,0)\), magnetic part equal in size and reversing with the Poynting vector.

### A15. What a closed shell determines

Let the array be a closed surface \(\partial V\) in vacuum. The exterior multipole expansion of the potential in \(V\), if the masses lie inside, is

\[
\Phi(\mathbf{x})=-\sum_{\ell=0}^{\infty}\sum_{m=-\ell}^{\ell}\frac{A_{\ell m}}{r^{\ell+1}}Y_{\ell m}(\hat{\mathbf{x}}),
\tag{A42}
\]

and \(E_{ij}=\partial_i\partial_j\Phi\) determines every \(A_{\ell m}\). The reconstruction of \(\rho\) is unique only modulo (the density change written in Section 2). The current multipoles are the analogous coefficients of \(B_{ij}\). A practical estimator fits \(A_{\ell m}\) up to the \(\ell\) where the noise, propagated by \((r/R)^{\ell}\), exceeds the signal, and stops. That truncated spectrum is the photograph.

Odd \(\ell\) on a planar array is the front/back channel; even \(\ell\) is blind to the exchange of the two half-spaces when only \(E_{zz}\) is kept, and only partially blind when the full tensor is kept. The sign flip of \(E_{xz}\) and \(E_{yz}\) quoted in the draft is the \(\ell\)-odd sector.

### A16. Downward continuation on the sphere

A surface harmonic of degree \(\ell\), continued from radius \(R\) to radius \(R+h\), is multiplied by

\[
\left(\frac{R}{R+h}\right)^{\ell+1}\approx \exp\!\left(-\ell\frac{h}{R}\right)
\tag{A43}
\]

in the potential, up to the normalisation of the radial function. Gradients bring further factors polynomial in \(\ell\). The exponential dominates. Setting the attenuated signal equal to the noise gives

\[
\ell_\mathrm{max}\approx \frac{R}{h}\ln\mathrm{SNR},
\tag{A44}
\]

which is the spherical parent of \(kz_c=\ln\mathrm{SNR}\) in the flat Wiener filter. For GOCE, \(h\approx 255\,\mathrm{km}\), \(R/h\approx 25\). Degree \(250\) corresponds through (A44) to \(\mathrm{SNR}\approx e^{10}\approx 2.2\times 10^4\). Comparing that with the mission’s degree variances is the empirical test of the paper’s resolution law. Half-wavelength at degree \(250\): \(\pi R/\ell\approx 80\,\mathrm{km}\).

### A17. Occupation number

Optically thin thermal emission fills a mode to

\[
\bar n(\omega,\hat n)=\frac{1-e^{-\tau}}{e^{\hbar\omega/k_BT}-1}\approx\frac{\tau}{e^{\hbar\omega/k_BT}-1},
\tag{A45}
\]

with \(\tau=\int\alpha\,ds\) and \(\alpha=16\pi G\operatorname{Re}\eta(\omega)/c^3\). For \(\tau\sim 10^{-30}\) and \(\hbar\omega\sim k_BT\), \(\bar n\sim 10^{-30}\). Information that uses the field amplitude scales as \(\bar n\); information that uses intensity correlations scales as \(\bar n^2\). The primordial sky is the case \(\tau\not\ll 1\) in the past and \(\bar n = 1/(e^{x}-1)\) today, of order one near the peak and equal to \(1/x\) in the Rayleigh–Jeans tail.

### A18. Person, Moon, beam, memory: scales already in the draft, recomputed

Tide of a \(70\,\mathrm{kg}\) person at \(1\,\mathrm{m}\), and of the Moon:

\[
E_\mathrm{person}=\frac{2G\times 70}{1^3}=9.3\times 10^{-9}\,\mathrm{s}^{-2},
\tag{A46}
\]

\[
E_\mathrm{Moon}=\frac{2GM_\mathrm{Moon}}{d^3}=1.7\times 10^{-13}\,\mathrm{s}^{-2},
\qquad
\frac{E_\mathrm{person}}{E_\mathrm{Moon}}\approx 5\times 10^{4},
\tag{A47}
\]

the “fifty thousand times” of Section IV.

Memory of a supernova at \(10\,\mathrm{kpc}\) with \(E=3\times 10^{46}\,\mathrm{J}\) and asymmetry \(q=0.01\), from the draft’s expression \(\Delta h = qGE\sin^2\theta/(2c^4 r)\), seen from the side:

\[
\Delta h = 4.0\times 10^{-21},
\tag{A48}
\]

matching the draft’s \(4\times 10^{-21}\).

Solar gravitons, if the \(1.3\times 10^8\,\mathrm{W}\) were carried entirely by \(0.3\,\mathrm{keV}\) quanta (it is not; this is only a count-rate orientation):

\[
\dot N_\odot\sim\frac{1.3\times 10^8}{0.3\,\mathrm{keV}}\approx 3\times 10^{24}\,\mathrm{s}^{-1},
\qquad
\frac{\dot N_\odot}{4\pi\,\mathrm{AU}^2}\approx 10\,\mathrm{s^{-1}m^{-2}}.
\tag{A49}
\]

The draft’s “one graviton per square metre per second” at the Earth is the same estimate with a slightly softer typical quantum and the slightly smaller power \({\sim}10^8\,\mathrm{W}\). The spectrum, not (A49), should be used in the figure.

---

## 12. A last remark

The draft’s caution — a thought experiment, not an instrument proposal; novelty claims provisional until the literature is finished — is an asset. The calculations above do not need the camera to be buildable. They need the map from matter to the Riemann tensor to be written so that its null directions, its three singular spectra, and its one frequency axis are obvious. The surprises are already in the equations. The kink angles ignore \(\eta\). The wavelength never drops below the body. The heat is a mass long before it is a graviton. The Sun and the Earth and the primordial sky do not share a band. The only optic is a horizon, and the only sharp inverse is the one that does not try to continue a harmonic function backward.

Those are the things a reader will repeat. The demos that make them visible are the three safes, the frequency slider, the inverted Earth, and the spiral swallowing the two-body region as the holes fall.
