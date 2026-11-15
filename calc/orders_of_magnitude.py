"""Order-of-magnitude checks for the gravitational-camera discussion (SI units).

Assumptions worth knowing before quoting any line of the output:
- Section 5 uses a frequency-independent shear viscosity up to thermal
  frequencies. Real materials have eta(omega) falling above their relaxation
  rate, so those thermal graviton rates are upper estimates.
- Section 5's Earth entries use an assumed effective viscosity at thermal
  frequencies (1e-3 to 1 Pa s); this is a placeholder range, not a measurement.
- Section 6 takes the solar graviton luminosity from the literature.
"""
import math

G = 6.67430e-11
c = 2.99792458e8
hbar = 1.054571817e-34
kB = 1.380649e-23
sigma = 5.670374419e-8
AU = 1.495978707e11
yr = 3.15576e7
M_sun = 1.98847e30
R_sun = 6.957e8
M_earth = 5.9722e24
R_earth = 6.371e6
M_moon = 7.342e22
d_moon = 3.844e8
eV = 1.602176634e-19


def sci(x):
    return f"{x:.3g}"


print("== 1. Near-zone radius  r = lambda/2pi = c/(2 pi f) ==")
for f, name in [(1, "1 Hz"), (1e2, "100 Hz"), (1e3, "1 kHz"), (1e6, "1 MHz"),
                (1e9, "1 GHz"), (1e12, "1 THz"), (6.2e12, "300 K thermal (kT/h)")]:
    print(f"  f = {name:>22}: lambda = {sci(c/f)} m, lambda/2pi = {sci(c/(2*math.pi*f))} m")

print("\n== 2. Tidal fields  E ~ 2GM/r^3  (s^-2; 1 Eotvos = 1e-9 s^-2) ==")
for M, r, name in [(70, 1, "70 kg person at 1 m"), (70, 10, "70 kg person at 10 m"),
                   (1500, 10, "1.5 t car at 10 m"), (M_sun, AU, "Sun at 1 AU"),
                   (M_moon, d_moon, "Moon at Earth"), (M_earth, R_earth, "Earth at its surface")]:
    E = 2*G*M/r**3
    print(f"  {name:>24}: {sci(E)} s^-2 = {sci(E/1e-9)} E")
# LIGO-grade pixel expressed as tidal sensitivity at 100 Hz, h ~ 1e-23 over 1 Hz band
h = 1e-23
w = 2*math.pi*100
E_ligo = 0.5*w*w*h
print(f"  LIGO-like h=1e-23 at 100 Hz  <=> tidal amplitude {sci(E_ligo)} s^-2")
print(f"  equivalent strain of a person at 1 m swaying at 1 Hz: h ~ E/w^2*2 = {sci(2*2*G*70/1/(2*math.pi)**2)}")

print("\n== 3. Coherent radiation from everyday motion ==")
print(f"  c^5/G = {sci(c**5/G)} W")
# two masses m separated by d, rotating at Omega: P = (8/5) G m^2 d^4 Omega^6 / c^5
for m, d, Om, name in [(1, 1, 100, "two 1 kg masses, 1 m apart, 100 rad/s"),
                       (1000, 2, 300, "two 1 t masses, 2 m apart, 300 rad/s")]:
    P = (8/5)*G*m*m*d**4*Om**6/c**5
    Eg = hbar*2*Om
    rate = P/Eg
    print(f"  {name}: P = {sci(P)} W, graviton energy {sci(Eg)} J, rate {sci(rate)} /s"
          f" = one per {sci(1/rate/yr)} yr")
# MTW steel beam: M=490 t, L=20 m, omega=28 rad/s: P = (2/45) G M^2 L^4 w^6 / c^5
M, L, w = 4.9e5, 20, 28
P = (2/45)*G*M*M*L**4*w**6/c**5
print(f"  MTW steel beam (490 t, 20 m, 28 rad/s): P = {sci(P)} W, "
      f"gravitons/s = {sci(P/(hbar*2*w))}")
# strain at distance r from the 1 kg dumbbell in the wave zone: h ~ (4G/c^4 r) * (m d^2/2) Om^2 ... order
m, d, Om = 1, 1, 100
I = m*d*d/2
lam = 2*math.pi*c/(2*Om)
print(f"  dumbbell GW wavelength = {sci(lam)} m; h at one wavelength ~ {sci(4*G*I*Om**2/(c**4*lam))}")

print("\n== 4. Absorption / emission coefficient  alpha = 16 pi G eta / c^3 (per m) ==")
for eta, name in [(1e-3, "water (1e-3 Pa s)"), (10, "honey (10 Pa s)"), (1e12, "glass near Tg (1e12 Pa s)"),
                  (1e21, "upper mantle, zero-frequency (1e21 Pa s)"), (1e17, "neutron-star core (~1e17 Pa s)")]:
    a = 16*math.pi*G*eta/c**3
    print(f"  {name:>44}: alpha = {sci(a)} /m")
a_w = 16*math.pi*G*1e-3/c**3
print(f"  optical depth of Earth diameter at eta_eff=1e-3 Pa s: {sci(a_w*2*R_earth)};"
      f" at eta_eff=1 Pa s: {sci(a_w*1e3*2*R_earth)}")

print("\n== 5. Thermal graviton glow (optically thin, Kirchhoff): P/V = 4 alpha sigma T^4 ==")


def thermal(V, T, eta):
    a = 16*math.pi*G*eta/c**3
    P = 4*a*sigma*T**4*V
    Emean = 2.701*kB*T
    return P, P/Emean


for V, T, eta, name in [(0.07, 310, 1e-3, "human (70 L water, 310 K, eta=1e-3)"),
                        (1e-3, 373, 1e-3, "1 L boiling water"),
                        (1.083e21, 4000, 1e-3, "Earth (4000 K, eta_eff=1e-3)"),
                        (1.083e21, 4000, 1.0, "Earth (4000 K, eta_eff=1)")]:
    P, n = thermal(V, T, eta)
    print(f"  {name:>38}: P = {sci(P)} W, {sci(n)} gravitons/s = one per {sci(1/n/yr)} yr")
P, n = thermal(1.083e21, 4000, 1e-3)
print(f"  Earth glow flux at surface (eta_eff=1e-3): {sci(P/(4*math.pi*R_earth**2))} W/m^2,"
      f" {sci(n/(4*math.pi*R_earth**2))} gravitons/m^2/s")

print("\n== 6. Sun in gravitons (literature luminosity ~ 7.9e7 W, Gould 1985 -- to be verified) ==")
Lg = 7.9e7
F = Lg/(4*math.pi*AU**2)
print(f"  energy flux at 1 AU: {sci(F)} W/m^2")
for EkeV in (1, 3, 5):
    print(f"   if mean graviton energy {EkeV} keV: {sci(F/(EkeV*1e3*eV))} gravitons/m^2/s")
print(f"  fraction of solar luminosity: {sci(Lg/3.828e26)}")

print("\n== 7. Lenses: focal ratio N = f/D = b c^2/(8 G M) for a ray at impact parameter b ==")
for M, b, name in [(M_earth, R_earth, "Earth (limb)"), (M_sun, R_sun, "Sun (limb)"),
                   (1e3, 0.5, "1 t ball, 0.5 m")]:
    f = b*b*c*c/(4*G*M)
    print(f"  {name:>16}: focal length {sci(f)} m = {sci(f/AU)} AU, f-number {sci(f/(2*b))},"
          f" compactness GM/(b c^2) = {sci(G*M/(b*c*c))}")
# refractive index of dust: n - 1 ~ 2 pi G rho / w^2
for rho, f_, name in [(1e3, 1e12, "water at 1 THz"), (1e3, 1e3, "water at 1 kHz")]:
    w = 2*math.pi*f_
    print(f"  n-1 ~ 2 pi G rho/w^2 for {name}: {sci(2*math.pi*G*rho/w**2)}")

print("\n== 8. Near-field (potential-field) camera: angular resolution ~ pi/ln(SNR) ==")
for S in (1e3, 1e6, 1e12, 1e30, 1e100):
    th = math.pi/math.log(S)
    print(f"  amplitude SNR {S:.0e}: theta ~ {sci(th)} rad = {sci(math.degrees(th))} deg")
print(f"  for 1 arcmin need ln(SNR) = {sci(math.pi/math.radians(1/60))}, i.e. SNR ~ 10^{sci(math.pi/math.radians(1/60)/math.log(10))}")

print("\n== 9. Diffraction: aperture needed for resolution theta at wavelength lambda ==")
for f_, name in [(1e3, "1 kHz"), (1e9, "1 GHz"), (1e12, "1 THz"), (6e14, "600 THz (optical)")]:
    lam = c/f_
    print(f"  {name:>18}: lambda = {sci(lam)} m; D for 1 mrad = {sci(lam/1e-3)} m; for 1 arcmin = {sci(lam/2.9e-4)} m")

print("\n== 10. Cosmic graviton background if thermal at 0.9 K (hypothetical) ==")
T = 0.9
print(f"  sigma T^4 = {sci(sigma*T**4)} W/m^2; peak nu ~ 2.82 kT/h = {sci(2.82*kB*T/(2*math.pi*hbar))} Hz")

print("\n== 11. Does matter reflect or refract gravitational waves? ==")
# Refractive index of matter (Peters 1974): n - 1 = 2 pi G rho / w^2.
# Elastic response adds a 'plasma-like' term: w^2 = c^2 k^2 + 16 pi G mu / c^2.
# Normal-incidence power reflectivity of a slab much thicker than the
# wavelength: R = ((n-1)/2)^2. Real walls are far thinner than the wavelength,
# which lowers R further, so these are generous upper values.
rho_steel, mu_steel = 7850.0, 8.0e10
wg2 = 16*math.pi*G*mu_steel/c**2
print(f"  steel: elastic 'cutoff' w_g = {sci(math.sqrt(wg2))} rad/s (period {sci(2*math.pi/math.sqrt(wg2)/yr)} yr)")
for f_, name in [(1e3, "1 kHz"), (1e9, "1 GHz"), (1e13, "10 THz")]:
    w = 2*math.pi*f_
    n1 = 2*math.pi*G*rho_steel/w**2
    el = wg2/(2*w*w)
    print(f"  steel at {name:>6}: n-1 = {sci(n1)} (density term), {sci(el)} (elastic term);"
          f" thick-slab reflectivity <= {sci((n1/2)**2)}")
print("  for comparison a silvered mirror reflects ~0.95 of visible light")
# deflection of a ray grazing a mass: 4GM/(b c^2)
for M, b, name in [(M_earth, R_earth, "Earth limb"), (M_sun, R_sun, "Sun limb"), (1e3, 0.5, "1 t ball")]:
    a = 4*G*M/(b*c*c)
    print(f"  bending at {name}: {sci(a)} rad = {sci(math.degrees(a)*3600)} arcsec")

print("\n== 12. Affordance numbers ==")
R_core, R_inner = 3.480e6, 1.2215e6
for R_, name in [(R_core, "outer core"), (R_inner, "inner core")]:
    print(f"  Earth's {name} seen from the surface: {sci(2*math.degrees(math.asin(R_/R_earth)))} deg wide")
print(f"  Sun's disc from Earth: {sci(2*math.degrees(math.asin(R_sun/AU)))} deg wide;"
      f" inner 20% of its radius: {sci(2*math.degrees(math.asin(0.2*R_sun/AU)))} deg")
print(f"  light-crossing time of the solar radius: {sci(R_sun/c)} s; Sun to Earth: {sci(AU/c/60)} min")
print(f"  mass of 1 kWh of stored energy: {sci(3.6e6/c**2)} kg;"
      f" Li-ion cell at 250 Wh/kg gains {sci(250*3600/c**2)} of its mass when charged")
print(f"  1 kW laser beam: {sci(1e3/c/c**2)} kg per metre of beam")
print(f"  3 T magnetic field: energy density {sci(9/(2*4e-7*math.pi))} J/m^3"
      f" = {sci(9/(2*4e-7*math.pi)/c**2)} kg/m^3")
print(f"  pressure as a source: 3p/c^2 for 200 bar = {sci(3*2e7/c**2)} kg/m^3")
print(f"  mass current vs mass: v/c for 1 m/s flow = {sci(1/c)}")
print(f"  person at 1 m vs Moon, tidal field ratio: {sci((2*G*70/1)/(2*G*M_moon/d_moon**3))}")
print(f"  light in water travels at c/1.33: over 100 m it lags a gravitational signal by {sci(100*0.33/c*1e9)} ns")
