"""Physical constants, SI units, float64.

Names follow the scripts in ``calc/`` (``G``, ``c``, ``kB``, ``sigma``, ...).
G and sigma are the CODATA 2018 values; c and kB are exact by definition.
"""

G = 6.67430e-11          # m^3 kg^-1 s^-2, Newton's constant
c = 299792458.0          # m s^-1, speed of light (exact)
kB = 1.380649e-23        # J K^-1, Boltzmann's constant (exact)
sigma = 5.670374419e-8   # W m^-2 K^-4, Stefan-Boltzmann constant
hbar = 1.054571817e-34   # J s, reduced Planck constant (exact, from h)

# Mean energy of a thermal quantum in units of kT. The scene contract fixes the
# rounded value 2.701 (the exact Planck value is pi^4 / (30 zeta(3)) = 2.70118).
mean_energy_kT = 2.701

AU = 1.495978707e11      # m, astronomical unit (exact)
M_sun = 1.98847e30       # kg, solar mass


def as_dict():
    """The constants as a plain dict, for the exported fixtures."""
    return {
        "G": G,
        "c": c,
        "kB": kB,
        "sigma": sigma,
        "hbar": hbar,
        "mean_energy_kT": mean_energy_kT,
        "AU": AU,
        "M_sun": M_sun,
    }
