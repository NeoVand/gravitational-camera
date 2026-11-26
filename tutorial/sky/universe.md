---
id: '12.2'
title: 'The expanding universe, its thermal history, and a graviton background'
question: 'If gravitons stopped interacting near the Planck temperature and kept a black-body spectrum ever since, then every species that later annihilated heated the photons but not them, and their sky today is at 0.905 K. Why does an expanding universe keep a black body black, why does the graviton glow end colder than the microwave sky, and what would its sky look like?'
part: '12'
requires: ['1.3', '1.8', '5.5', '6.3', '7.1', '8.3', '10.1', '10.2']
paper: [sec:vistas, eq:graviton-temperature, fig:graviton-sky, fig:black-hole, sec:affordances, tab:null, sec:no-lens, sec:first-image]
figures: [fig:black-hole, fig:graviton-sky]
live: [thermal-history]
depth: B
---

Panel (b) of Figure [](/paper/#fig:black-hole) shows a sky of gravitons left from the early universe: a uniform glow at
0.905 K, warmed to 0.929 K near the hole, with the dipole of our motion folded round one black disc. The light left from
the early universe, the **cosmic microwave background**, fills the sky in the same way, as a black body at 2.7255 K: the
microwave sky. Why does an expanding universe keep a black body black, why does the graviton glow end colder than the
microwave sky, and what would its sky look like?[^bg]

{{paper fig:black-hole}}

::: plain
The universe is expanding: every distance between galaxies grows by the same factor, and so does every wave that
crosses it. A glow of many waves is stretched as a whole, so it stays the glow of a warm body, only cooler.

Long ago the universe was very hot, and many kinds of particle shared its heat. As it cooled, heavy particles met their
antiparticles and disappeared, and their heat went to the particles still in contact, mainly to light. Gravitons stopped
meeting anything almost at the start, so they missed every later warming: their glow is 0.905 kelvin today, against 2.7
kelvin for the light. It is the same in every direction, a little warmer ahead of our motion, and only black holes
darken it.
:::

## The universe expands uniformly, and a critical density decides its fate

We want the rule of the expansion, because every temperature in this section falls as it grows. On scales of hundreds
of millions of light years the universe looks the same everywhere and in every direction (an observation), so we assume
that **the universe is uniform**. A uniform expansion stretches every distance by the same factor, so the distance
between two galaxies, in metres, is

$$d(t) = a(t)\,d_{\rm c} .$$

Here $\sym{scale-factor}{a(t)}$, a pure number equal to 1 today, is the **scale factor**, and
$\sym{comoving-distance}{d_{\rm c}}$ is the **comoving distance**, the galaxies' distance today, which the expansion
does not change. Differentiating with respect to time gives $\dot d = \dot a\,d_{\rm c} = (\dot a/a)\,d$, so every
galaxy recedes at

$$\boxed{\;v = Hd\;} , \qquad \sym{hubble-rate}{H} = \frac{\dot a}{a} .$$

This is **Hubble's law**, and $H$, in $\mathrm{s^{-1}}$, is the **Hubble rate**, the same for every pair. Its
value today, the **Hubble constant**, is $H_0 = 67.4\unit{km\,s^{-1}\,Mpc^{-1}} = 2.18\times10^{-18}\unit{s^{-1}}$
from the microwave sky [@Planck2018I], with $1\unit{Mpc} = 3.09\times10^{22}$ m. Nearby galaxies give about 73, and
the gap is unresolved. At a constant speed every galaxy would have started from us $1/H_0 = 14.5$ billion years ago,
close to the measured age of 13.8 billion years.

**The Friedmann equation.** To find how $H$ changes with time, take a ball of the uniform matter, of radius
$d = a\,d_{\rm c}$ and mass $\matter M = \tfrac43\pi\matter\rho\,d^3$, with $\sym{density}{\matter\rho}$ the density in
$\mathrm{kg\,m^{-3}}$. By the shell theorem (section
[1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)) the matter outside the ball does
not pull on its surface, so the surface moves like a body thrown up from a planet of mass $\matter M$, with a fixed
energy per kilogram $E$ (section
[1.8](/tutorial/newton/orbits-and-kicks/#energy-and-angular-momentum-fix-the-size-and-shape-of-an-orbit); in
$\mathrm{J\,kg^{-1}}$, local to this section):

$$\frac12\dot d^2 - \frac{G\matter M}{d} = E .$$

The mass $\matter M$ stays the same, because the matter inside moves out with the surface. Putting in $d =
a\,d_{\rm c}$, $\dot d = \dot a\,d_{\rm c}$ and $\matter M$, and dividing by $\tfrac12a^2d_{\rm c}^2$, gives

$$\boxed{\;H^2 = \frac{8\pi G}{3}\,\matter\rho - \frac{kc^2}{a^2}\;} , \qquad k = -\frac{2E}{c^2d_{\rm c}^2} ,$$

the **Friedmann equation**. Since $H$ and $\matter\rho$ are the same for every ball, $k$ is one constant, in
$\mathrm{m^{-2}}$. Both sides are in $\mathrm{s^{-2}}$, because $G\matter\rho$ is.

In Einstein's theory (stated; the GR course's section 19.3) $k$ is the **curvature of space**, zero for a flat one,
$\matter\rho$ counts every energy divided by $c^2$, and the cosmological constant $\sym{cosmological-constant}{\Lambda}$
of section [7.3](/tutorial/geometry/einstein-equation/#pressure-and-stress-gravitate) adds $\Lambda c^2/3$ to the right
side. Flat space has the metric

$$\dd s^2 = -c^2\dd t^2 + a^2(t)\,\dd\vect x^2 ,$$

with $\vect x$ the comoving position in metres: a ruler laid between galaxies grows as $a$.

**The critical density.** A **flat universe**, $k = 0$, has the density

$$\boxed{\;\sym{critical-density}{\matter\rho_{\rm crit}} = \frac{3H^2}{8\pi G}\;} ,$$

the **critical density**: $8.53\times10^{-27}\unit{kg\,m^{-3}}$ today, five protons per cubic metre.[^rhoc] **Check.**
At $k = 0$ the shell's energy is zero, so every shell moves at the escape speed $\sqrt{2G\matter M/d}$ (section 1.8).
Without $\Lambda$, a denser universe would stop and fall back, as a body thrown too slowly does, and a thinner one
would expand for ever. Space is measured to be flat [@Planck2018I], so the universe holds $\matter\rho_{\rm crit}$:
31.5% of it in matter and the rest in $\Lambda$.

## Expansion stretches every wave, so a black body stays black

What does the expansion do to a wave crossing it? By section 7.1, light has $\dd s = 0$, so a ray coming toward us
obeys $c\,\dd t = a\,|\dd\vect x|$, and the comoving distance it covers between the times $t_{\rm e}$ and $t_0$ is

$$d_{\rm c} = \int_{t_{\rm e}}^{t_0}\frac{c\,\dd t}{a} .$$

A source at rest among the galaxies sends one crest at $t_{\rm e}$ and the next a period $\delta t_{\rm e}$ later,
and they arrive at $t_0$ and $t_0 + \delta t_0$ (Figure [](#fig:universe-crests)). The source and the observer keep
their comoving positions, so both crests cover the same $d_{\rm c}$:

$$\int_{t_{\rm e}}^{t_0}\frac{c\,\dd t}{a} = \int_{t_{\rm e} + \delta t_{\rm e}}^{t_0 + \delta t_0}\frac{c\,\dd t}{a} .$$

The two integrals share the stretch from $t_{\rm e} + \delta t_{\rm e}$ to $t_0$. Removing it leaves two short ends,
over which $a$ hardly changes, so each end is its length times $c/a$:

$$\frac{c\,\delta t_0}{a_0} = \frac{c\,\delta t_{\rm e}}{a_{\rm e}} .$$

![Look first at the two brackets: the two crests cross the same comoving distance, so the time between them, and the
wavelength, grows in proportion to the scale factor. The ratio 3 is chosen for the drawing; the microwave sky's is
1091.](tut-universe-crests){#fig:universe-crests}

So the period, and the wavelength $\lambda = c\,\delta t$, grow in proportion to $a$. This is the **cosmological
redshift** (the GR course's section 19.6):

$$\boxed{\;1 + z = \frac{\lambda_0}{\lambda_{\rm e}} = \frac{a_0}{a_{\rm e}}\;} ,$$

with $\sym{cosmological-redshift}{z}$ the **redshift**, a pure number. **Limit.** For a near source, light takes
the time $d/c$, so $a_{\rm e} \approx a_0(1 - Hd/c)$ and $z \approx Hd/c = v/c$, the Doppler shift of section 6.3 at
small speeds.

**A black body.** For a whole thermal glow we assume that **nothing on the way absorbs or emits**, which holds for
gravitons after they stop interacting and for light after its release. Every mode's wavelength grows as $a$, so its
frequency falls as $1/a$, and each mode keeps its quanta. This is the slowly widened box of section
[10.2](/tutorial/glow/kirchhoff/#a-slowly-widened-box-keeps-a-black-body-cooler), with the universe as the box: the
occupation $1/(e^{\hbar\omega/\kB T} - 1)$ is unchanged when $\omega$ and $T$ fall together, so the spectrum stays
Planck's, with

$$\boxed{\;T \propto \frac1a\;} .$$

Planck's law at a lower temperature is the same curve with every frequency divided by one factor, which is what the
expansion does. The widening is slow, as the argument of section 10.2 needs: a 6 mm wave swings in $2\times10^{-11}$ s,
and $1/H_0$ is $4.6\times10^{17}$ s.

**Numbers.** The microwave sky was released at $z = 1090$ [@Planck2018I], at $2.7255\times1091 = 2970$ K, when the hot
**plasma**, a gas of free electrons and nuclei that scatters light, became neutral. By section
[10.1](/tutorial/glow/black-body/#a-black-body-holds-an-energy-and-a-number-of-quanta-in-each-cubic-metre) the quanta
per cubic metre go as $T^3$, so as $a^{-3}$, and the energy density $\sym{radiation-energy-density}{\mathcal U}$ as
$a^{-4}$. Matter thins only as $a^{-3}$: it holds 31.5% of today's critical density and radiation $9.2\times10^{-5}$
[@Planck2018I], so radiation outweighed it before $1 + z = 0.315/9.2\times10^{-5} \approx 3400$.

## When a species disappears, its entropy heats what remains

We want what happens to the temperatures when a kind of particle disappears. The **thermal history** of the universe
is the sequence of its temperatures and of which particles were in contact at each. By section 10.2 a black body of
photons has the entropy per cubic metre $\sym{entropy-density}{s} = 4\,\mathcal U/3T$. With the $\mathcal U$ of section
10.1 and $\sym{internal-states}{g}$ states for each mode (two polarizations for photons and gravitons), it is[^g]

$$s = \frac{2\pi^2}{45}\,g\,\kB\Bigl(\frac{\kB T}{\hbar c}\Bigr)^3 .$$

In a slow expansion each mode keeps its quanta, so the entropy in a comoving volume, $sa^3$, stays fixed, and so does
the total entropy of particles in contact while their reactions keep pace with the expansion (stated).

**Fermions count seven eighths.** A **boson**, such as a photon or a graviton, can put any number of quanta in one
mode, like the oscillator of section 8.3. A **fermion**, such as an electron, a quark or a neutrino, obeys the exclusion
principle of section 10.3: at most one in each mode. With the Boltzmann weights of section 8.3, 1 for an empty mode and
$e^{-x}$ for a full one, where $x = \hbar\omega/\kB T$, the mean occupation is

$$\bar n_{\rm F} = \frac{e^{-x}}{1 + e^{-x}} = \frac{1}{e^x + 1} .$$

Over a common denominator, $1/(e^x + 1) = 1/(e^x - 1) - 2/(e^{2x} - 1)$. In the second term we put $u = 2x$, which
turns it into $\tfrac18$ of the Bose integral of section 10.1:

$$\int_0^\infty\frac{x^3\,\dd x}{e^x + 1} = \Bigl(1 - \frac18\Bigr)\frac{\pi^4}{15} = \frac78\cdot\frac{\pi^4}{15} .$$

So each fermion state carries $\tfrac78$ of a boson state's energy, and of its entropy, because the steps of section 10.2
give $s = 4\,\mathcal U/3T$ again.[^fermi] A mixture at one temperature has

$$s = \frac{2\pi^2}{45}\,g_{*s}\,\kB\Bigl(\frac{\kB T}{\hbar c}\Bigr)^3 , \qquad
\boxed{\;\sym{entropy-species}{g_{*s}} = \sum_{\rm bosons}g + \frac78\sum_{\rm fermions}g\;} ,$$

the **effective number of species**, a pure number. A species at another temperature $T_i$ counts with the extra
factor $(T_i/T)^3$. A particle of mass $m$ counts while $\kB T \gg mc^2$, because it then moves at nearly the speed of
light and behaves as radiation. Every particle has an **antiparticle** of the same mass and opposite charge. When $\kB
T$ falls below $mc^2$, the two **annihilate**: they meet and turn into lighter particles, and collisions are no longer
energetic enough to make them again.

**Electrons and positrons.** A species **decouples** when it meets other particles less often than once in an
expansion time $1/H$; after that it travels freely, and its $Ta$ stays fixed. Neutrinos, which feel only the weak
force, decouple at about $10^{10}$ K (stated). The electrons and positrons, fermions with $g = 4$ (two spins each),
annihilate into photons when the temperature falls below $m_ec^2/\kB = 5.9\times10^9$ K. Before, photons and pairs
count $2 + \tfrac78\cdot4 = \tfrac{11}2$, at the neutrinos' temperature. After, the photons count 2. The entropy of
photons and pairs in a comoving volume is fixed, so

$$\frac{11}2\,(Ta)^3_{\rm before} = 2\,(T_\gamma a)^3_{\rm after} ,$$

while the neutrinos keep their $Ta$. Taking the cube root of the ratio gives the **neutrino temperature**

$$\boxed{\;\sym{neutrino-temperature}{T_\nu} = \Bigl(\frac4{11}\Bigr)^{1/3}\sym{photon-temperature}{T_\gamma} =
1.945\unit K\;}$$

today, with the microwave sky's $T_\gamma = 2.7255$ K [@Fixsen2009]. The pairs' entropy made the photons
$(11/4)^{1/3} = 1.40$ times warmer.

**Today's count.** The photons give 2. Three kinds of neutrino, each with its antineutrino and one spin state, give 6
fermion states at $T_\nu$, so $g_{*s} = 2 + \tfrac78\cdot6\cdot\tfrac4{11} = \tfrac{43}{11} = 3.91$, if the neutrinos
had left completely before the pairs annihilated.[^leak]

**The Standard Model when hot.** The **Standard Model** is the established theory of every known particle except the
graviton. In it gluons hold quarks together, and both carry a charge of three kinds, called colour; the **$W$ and $Z$**
are heavy bosons of the weak force; the **Higgs** gives particles their mass; and the muon and tau are heavier
electrons. Above $2\times10^{15}$ K, $mc^2/\kB$ for the heaviest, the top quark, every particle counts:

| Particle | Kind | States $g$ | Why |
|---|---|---|---|
| photon | boson | 2 | massless spin 1: two polarizations |
| gluons | boson | 8 × 2 = 16 | eight colour combinations, each massless |
| $W^+$, $W^-$, $Z$ | boson | 3 × 3 = 9 | massive spin 1: three states |
| Higgs | boson | 1 | spin 0 |
| quarks | fermion | 6 × 3 × 2 × 2 = 72 | kinds × colours × spins × antiquarks |
| electron, muon, tau | fermion | 3 × 2 × 2 = 12 | kinds × spins × antiparticles |
| neutrinos | fermion | 3 × 1 × 2 = 6 | one spin state, against the motion (with it for antineutrinos) |

The bosons hold 28 states and the fermions 90, so $g_{*s} = 28 + \tfrac78\cdot90 = 106.75$ (Figure
[](#fig:universe-gstar)). The graviton is not counted: it had already stopped interacting, as the next section shows.

![Look first at the hatched ends: each fermion state counts seven eighths of a boson's. The hot Standard Model counts
106.75; today's photons and neutrinos count 3.91. Every length is a count.](tut-universe-gstar){#fig:universe-gstar}

## Gravitons parted first and kept a colder share of the heat

We want the gravitons' temperature today, and first when they decoupled. **An estimate.** Two quanta of energy near
$\kB T$ meet through gravity with a cross-section of order $(G\kB T/c^4)^2$, the square of half the Schwarzschild
radius of the mass $\kB T/c^2$ (stated). Among the $(\kB T/\hbar c)^3$ quanta per cubic metre of section 10.1, each meets
another at the rate

$$\Gamma \approx \Bigl(\frac{\kB T}{\hbar c}\Bigr)^3\Bigl(\frac{G\kB T}{c^4}\Bigr)^2c \propto G^2T^5 ,$$

where in this estimate $\approx$ means equal up to factors of order one. Early on radiation outweighs matter, so the
Friedmann equation with $\matter\rho = \mathcal U/c^2 \propto T^4$ gives $H \approx [G(\kB T)^4/\hbar^3c^5]^{1/2}
\propto \sqrt G\,T^2$. Dividing,

$$\frac{\Gamma}{H} \approx \Bigl(\frac{T}{T_{\rm P}}\Bigr)^3 , \qquad \sym{planck-temperature}{T_{\rm P}} =
\frac1{\kB}\sqrt{\frac{\hbar c^5}{G}} = 1.42\times10^{32}\unit K ,$$

the **Planck temperature**.[^gamma] So gravitons decouple near $T_{\rm P}$: at $10^{31}$ K a graviton meets another once
in about 3000 expansion times.

::: gap
With the 106.75 species and the $\pi$s of Planck's law, $H$ is about 17 times this estimate, which moves the crossing
by $17^{1/3} \approx 2.6$. Since $\Gamma/H$ exceeds 1 only above $T_{\rm P}$, the gravitons were in equilibrium only if
the universe was once that hot. There the quantum theory of gravity is unknown, so "near" is all that can be said.
:::

**The temperature today.** We assume that **the gravitons were in equilibrium with every particle of the Standard Model
when they decoupled**, at the temperature $T_{\rm d}$ and scale factor $a_{\rm d}$, and that **the Standard Model holds
all the particles there are**. Let $\sym{graviton-temperature}{T_g}$ be the gravitons' temperature today. After
decoupling they travel freely, so by the redshift their $Ta$ stays fixed:

$$T_ga_0 = T_{\rm d}a_{\rm d} .$$

The other particles annihilated species by species, but their total entropy in a comoving volume stayed fixed (Figure
[](#fig:universe-temperatures)). Counting the neutrinos today at their own temperature, as in today's 3.91,

$$106.75\,(T_{\rm d}a_{\rm d})^3 = 3.91\,(T_\gamma a_0)^3 .$$

Putting the first equation into the second and taking the cube root gives[^gt]

$$\boxed{\;T_g = \Bigl(\frac{3.91}{106.75}\Bigr)^{1/3}T_\gamma = 0.3321\times2.7255\unit K = 0.905\unit K\;} .$$

**Check.** If nothing had annihilated, the count would be the same at both ends and $T_g = T_\gamma$. More particles
make the glow colder: $T_g$ falls as $g_{*s}^{-1/3}$ of the hot count, because more species at the start leave the
gravitons a smaller share of the entropy. Doubling the count to 213.5 gives 0.718 K.

![Look first at the flat graviton line: it parted near the Planck temperature and missed every step. Each step of the
photon line is an annihilation, its height set by the count before and after. The ends are exact; the steps' places are
schematic, their heights from the counts. Lines that share a value are drawn side by
side.](tut-universe-temperatures){#fig:universe-temperatures}

**Inflation** is a proposed period of very fast early expansion, by a factor of $e^{60}$ or more in length (stated).
Coming after the gravitons decoupled, it would have grown every volume by at least $e^{180}$ and thinned them to
nothing, so whether this background exists is a test of inflation [@VagnozziLoeb2022].

**Its energy.** Radiation other than photons is counted by the **effective number of neutrino species**
$N_{\rm eff}$: its energy density in units of that of one neutrino and its antineutrino ($g = 2$ fermions) at $T_\nu$.
With $\mathcal U \propto gT^4$ and the $\tfrac78$, the gravitons ($g = 2$ bosons at $T_g$) add

$$\boxed{\;\sym{extra-species}{\Delta N_{\rm eff}} = \frac{2T_g^4}{\tfrac78\cdot2\,T_\nu^4} =
\frac87\Bigl(\frac{T_g}{T_\nu}\Bigr)^4 = 0.054\;} ,$$

about 0.05 of an extra species. Planck's measured $N_{\rm eff}$ is $2.99 \pm 0.17$ [@Planck2018I], against 3.044 for
the three neutrinos alone (stated), so 0.054 lies within present bounds.[^act] The **density parameter** of a species is
its energy density over $\matter\rho_{\rm crit}c^2 = 7.67\times10^{-10}\unit{J\,m^{-3}}$. With $\mathcal U_g =
4\sigma_{\rm SB}T_g^4/c = 5.1\times10^{-16}\unit{J\,m^{-3}}$ (section 10.1),

$$\boxed{\;\sym{density-parameter}{\Omega_g} = \frac{\mathcal U_g}{\matter\rho_{\rm crit}c^2} =
6.6\times10^{-7}\;} ,$$

about $7\times10^{-7}$ of the critical density.[^Omega] Since $\matter\rho_{\rm crit}$ grows as $H_0^2$, the temperature
fixes only $\Omega_gh^2 = 3.0\times10^{-7}$, with $h = H_0/(100\unit{km\,s^{-1}\,Mpc^{-1}})$, and the nearby galaxies'
73 gives $\Omega_g = 5.6\times10^{-7}$. The microwave sky's is 82 times larger, and pulsar timing's nanohertz background is about
$10^{-8}$ [@NANOGrav2023].

## The graviton sky is a uniform glow with a dipole, untouched by lenses

We want what a camera would see. **The count.** The number radiance of a black body of two polarizations (section 10.1)
is

$$\sym{black-body-number-radiance}{N_{\rm bb}} = \frac{\zeta(3)}{2\pi^3c^2}\Bigl(\frac{\kB T}{\hbar}\Bigr)^3 =
3.6\times10^{14}$$

gravitons per second, per square metre and per steradian at 0.905 K. It is $3\times10^{19}$ times the most that the
Earth's interior sends, $1.2\times10^{-5}$, and $10^9$ times the Sun's core's $4\times10^5$ (section
[R10b](/tutorial/glow/reading-section-ix/#at-midnight-the-suns-core-outshines-the-ground-ten-billion-times)).

**The size.** The mean energy $\sym{mean-quantum-energy}{\bar E} = 2.70\,\kB T$ of section 10.1 gives the wavelength
$\lambda = 2\pi\hbar c/\bar E = 5.9$ mm, three times the microwave sky's 1.95 mm; at
[the energy spectrum's peak](/tutorial/glow/black-body/#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)
it is 5.6 mm, so the wavelength is about six millimetres. An aperture of width $D = 1$ m resolves about $\lambda/D =
5.9\times10^{-3}$ rad, $0.34°$, a third of a degree.

**The dipole.** If the glow is uniform in the microwave sky's frame, our $370\unit{km\,s^{-1}}$ through it
[@Planck2018I], $\obs\beta = v/c = 1.23\times10^{-3}$, makes it 1.12 mK warmer ahead and colder behind (the moving black
body of section
[10.1](/tutorial/glow/black-body/#a-moving-observer-still-sees-a-black-body-hotter-ahead)), against the microwave sky's
$\pm3.36$ mK.

**Lensing.** Bending leaves a uniform glow uniform, as we now show. A radiance per unit of angular frequency,
$I_\omega$, divided by $\hbar\omega^3/4\pi^3c^2$ is a mode's occupation (section 10.1). Along a ray through a static
field the frequency far from the lens is the same at both ends (section
[11.1](/tutorial/black-holes/schwarzschild/#seen-from-rest-near-a-hole-the-whole-sky-is-warmer)), and the quanta keep the
volume of positions and momenta they fill (stated), so each mode's occupation, and $I_\omega$, arrives unchanged: the
conserved surface brightness of section 5.5, on bent rays. A uniform background therefore stays uniform however its rays
are bent, and only its departures, the dipole and the spots, are moved about.

**Shadows.** Only absorption makes a mark, and only a black hole absorbs appreciably across a broad band.[^noabs] So the
sky holds one black disc (sections
[11.1](/tutorial/black-holes/schwarzschild/#light-can-circle-a-hole-and-the-hole-casts-a-shadow) and
[11.3](/tutorial/black-holes/hawking/#a-shadow-stays-pale-while-the-skys-gravitons-are-long)) with the dipole folded
round it, and the rest of the sky reads $0.905\unit K/\sqrt{0.95} = 0.929$ K, because a camera at rest $40\,G\matter
M/c^2$ from the hole sees
[every frequency raised](/tutorial/black-holes/schwarzschild/#seen-from-rest-near-a-hole-the-whole-sky-is-warmer). A hole
of the [equilibrium mass](/tutorial/black-holes/hawking/#a-black-hole-has-a-temperature-lower-the-heavier-it-is) of
section 11.3, $1.356\times10^{23}$ kg, is as warm as this sky and leaves no mark on the uniform glow, though it still
lenses the dipole and any spots.

## On large scales the graviton sky shares the light's spots

Does the graviton sky share the microwave sky's warmer and cooler spots, of about one part in $10^5$ (stated)? We write the universe's small departures from uniformity in the metric's space part,

$$\field g_{ij} = a^2(1 + 2\field\Phi)\,\delta_{ij} ,$$

with $\delta_{ij}$ equal to 1 when $i = j$ and 0 otherwise, and $\sym{metric-stretch}{\field\Phi}$ a pure number at each
place and time. **This $\field\Phi$ is a fractional stretch of space, not the Newtonian potential.** The metric's
time entry also changes a little, but the rule below does not use it (gap box). A glow's temperature at a place is $T =
\bar T(1 + \Theta)$, with $\bar T \propto 1/a$ the mean and $\sym{temperature-contrast}{\Theta}$, a pure number, its
fractional change.

**The rule.** We take a pattern whose wavelength is longer than the **horizon** at the light's release, the distance
light had travelled since the start: such a pattern is **superhorizon**, and nothing has moved across it. In a region
small compared with the pattern, lengths grow with the local scale factor $a\sqrt{1 + 2\field\Phi} \approx a(1 +
\field\Phi)$. By the [redshift](#expansion-stretches-every-wave-so-a-black-body-stays-black), a quantum's wavelength
grows with it, so every frequency, and the temperature, falls as $1/[a(1 + \field\Phi)]$. With $\bar T \propto 1/a$
this is $(1 + \Theta)(1 + \field\Phi)$ fixed, $\Theta + \field\Phi$ fixed to first order, and

$$\boxed{\;\dot\Theta = -\dot{\field\Phi}\;} .$$

Nothing in this used the kind of quantum, so it holds for gravitons and for photons alike. **Check.** A $\field\Phi$ the same everywhere is only a change of $a$, and $\Theta = -\field\Phi$ is then the
redshift's $T \propto 1/a$. **Meaning.** Where the metric stretches a little more, every glow cools a little more,
whatever it is made of.

::: gap
At first order the Boltzmann equation of a massless species holds $\field\Phi$ only as the $-\dot{\field\Phi}$ used here
(stated; Dodelson and Schmidt, chapter 4). Its other terms are streaming, from the gradient of $\Theta$ itself; a term
from the gradient of the time entry; and, for photons, scattering. Outside the horizon a pattern hardly changes across
the distance light has crossed, so both gradients are small, and scattering does not change a place's mean temperature.
:::

**The same start.** We assume an **adiabatic perturbation**: in each place every species is denser or thinner by the
same fraction of its own number, as if that place had expanded a little less or more (stated; the microwave sky shows
it). A black body's number goes as $T^3$, so $\Theta$ starts the same for photons and gravitons, and with the same
rule the two skies reach the light's release with the same $\Theta$ and cross the same metric to us. The pattern the
metric prints on a background on large scales is the **Sachs–Wolfe effect**.

**The surface.** The light comes from the **last-scattering surface**, the sphere at which free electrons last
scattered it, at $z = 1090$. The gravitons come from the start. Their comoving distances are the redshift section's
$\int c\,\dd t/a$, which with $\dd z/\dd t = -(1 + z)H$ becomes $\int c\,\dd z/H(z)$. In a flat universe matter
thins as $(1 + z)^3$, radiation as $(1 + z)^4$, and $\Lambda$ not at all, so the Friedmann equation with today's
shares [@Planck2018I] gives

$$H(z)^2 = H_0^2\bigl[0.315\,(1 + z)^3 + 9.2\times10^{-5}\,(1 + z)^4 + 0.685\bigr] .$$

A numerical integral gives 13.86 Gpc for the light and 14.14 Gpc for the gravitons, with $1\unit{Gpc} = 1000$ Mpc.
The stretch from $z = 1090$ back to the start adds only 0.28 Gpc, because the early universe expanded fast. So the
graviton surface is

$$\boxed{\;2.0\%\ \text{farther}\;} ,$$

than the light's. Other measured shares change this by under 0.03%.[^dist]

**What we see.** The 0.28 Gpc is also the horizon at the light's release, so larger patterns obeyed the rule until
then, and both skies show the same large spots (Figure [](#fig:universe-surfaces)). Seen from 14 Gpc, 0.28 Gpc spans
0.02 rad, and a pattern of degree $\sym{degree}{\ell}$ has features about $\pi/\ell$ wide (section
[2.2](/tutorial/outside/spherical-harmonics/#a-pattern-of-degree-ell-has-features-about-piell-wide)), so the skies
part above $\ell \approx \pi/0.02 \approx 160$, where waves print different patterns on the two surfaces. The full
calculation puts this near $\ell \approx 100$ [@Bartolo2019; @Ricciardone2021]. On those scales only the light shows
**acoustic peaks**, from sound waves in the plasma, and **Silk damping**, a blur from diffusion, while the gravitons
gain the **integrated Sachs–Wolfe effect**, from decaying early potentials [@Schulze2023].

![Look first at the large spot: it lies across both surfaces, so both skies show it. A wave shorter than the gap prints
different patterns on the two surfaces. The gap, and the short wave with it, are drawn ten times too
wide.](tut-universe-surfaces){#fig:universe-surfaces}

**Why the two skies part on small scales.** Before its release the light is held to the plasma by scattering, and the
two move as one fluid. For radiation alone the pressure is a third of the energy density, $\matter p = \mathcal U/3$.
Let $\delta = \delta\mathcal U/\mathcal U$ be a small fractional excess and $\vect v$ the fluid's velocity. The energy
carried across a surface is $(\mathcal U + \matter p)\vect v = \tfrac43\mathcal U\vect v$ per square metre and second, so
conservation of energy gives $\partial_t\delta = -\tfrac43\nabla\cdot\vect v$; the momentum density is that flux over
$c^2$, and the pressure's push on it gives $(4\mathcal U/3c^2)\,\partial_t\vect v = -\nabla\matter p = -(\mathcal
U/3)\nabla\delta$. Differentiating the first in time and putting in the divergence of the second,

$$\frac{\partial^2\delta}{\partial t^2} = \frac{c^2}{3}\,\nabla^2\delta ,$$

the wave equation of section 5.1 with the speed $c/\sqrt3$ (the expansion and gravity add terms we leave out). The
plasma's nuclei add inertia but no pressure and slow the sound to about $0.45c$ by the release (stated). So each pattern
of wavenumber $k$ oscillates as $\cos kr_s$, where $r_s = \int c_s\,\dd t/a$ is the **sound horizon**, 0.144 Gpc at the
release [@Planck2018I]. Patterns caught at an extreme, $kr_s = n\pi$, are the brightest: the acoustic peaks, spaced on
the sky by $\pi\times13.86/0.144 = 302$ in degree, as measured (gravity's push moves the first, at $\ell \approx 220$,
stated). Photons also diffuse between collisions, which smooths the smallest patterns: Silk damping.

The gravitons collide with nothing, so they have no pressure, no sound and no diffusion; each graviton's $\Theta$
changes only through the metric along its path. On scales that entered the horizon while radiation still outweighed
matter, radiation's pressure keeps the potentials from growing, and they decay; a graviton crossing a decaying
potential keeps the change, the early integrated Sachs–Wolfe effect. So above degrees of about a hundred the graviton
sky records the metric along its whole path from the start, and the light records the plasma's sound at its release,
and the two patterns no longer match [@Ricciardone2021; @Schulze2023].

## A changing expansion makes gravitons in pairs of opposite momentum

Does a sky born in inflation differ from one born hot in more than its brightness? Each polarization of the strain of a
wave obeys, in the expanding metric of this section, the wave equation of a massless field (stated; Grishchuk, 1975):
for a wave $h\,e^{i\vect k\cdot\vect x}$ of comoving wavevector $\vect k$,

$$\ddot h + 3H\dot h + \frac{c^2k^2}{a^2}\,h = 0 .$$

We change to the **conformal time** $\eta$, with $\dd\eta = \dd t/a$, in seconds, and write $h' = \dd h/\dd\eta$.
Then $\dot h = h'/a$, $\ddot h = h''/a^2 - a'h'/a^3$ and $H = a'/a^2$, so $\ddot h + 3H\dot h = (h'' + 2a'h'/a)/a^2$,
and the equation becomes $h'' + 2(a'/a)h' + c^2k^2h = 0$. With $h = \chi/a$, $h' = \chi'/a - \chi a'/a^2$, and the
terms in $\chi'$ cancel:

$$\boxed{\;\chi'' + \Bigl(c^2k^2 - \frac{a''}{a}\Bigr)\chi = 0\;} .$$

Each mode is an oscillator whose frequency squared, $c^2k^2 - a''/a$ in $\mathrm{s^{-2}}$, changes with the expansion.
A sudden change of an oscillator's frequency squeezes its ground state, and for a field, whose modes along $\vect k$
and $-\vect k$ change alike, it makes quanta in pairs of opposite momentum (section
[8.5](/tutorial/quantum/counting-quanta/#pairs-in-two-modes-coincide-more-than-thermal-classical-waves-can)).

**Three eras.** While radiation outweighs matter, $a \propto t^{1/2}$, so $a \propto \eta$ and $a'' = 0$: every mode
keeps its frequency $ck$, and the hot glow of this section passes through unchanged. In inflation $a = -1/H\eta$, with
$\eta < 0$, so $a''/a = 2/\eta^2$, and a mode whose wavelength has grown beyond the horizon, $ck|\eta| < 1$, has a
negative frequency squared: its zero-point spread grows without limit while it stays outside, and when the mode
returns inside the horizon it holds a huge number of quanta in pairs. **Check:** a mode far inside the horizon, $ck \gg
\sqrt{a''/a}$, hardly feels the change, which is why the 6 mm gravitons of the hot glow are untouched.

**How many.** Counting modes as in section 10.1, two polarizations hold $8\pi f^2\,\dd f/c^3$ modes per cubic metre, so a
background whose energy per factor $e$ of frequency is $\Omega$ of the critical density holds $\bar n = \Omega\,
\matter\rho_{\rm crit}c^5/8\pi hf^4$ gravitons per mode. For $10^{-15}$ at 10 mHz, a level inflation might leave
(stated), $\bar n = 1.2\times10^{41}$. The pairs' coincidences $2 + 1/\bar n$ of section 8.5 are then 2 to forty
figures: what marks a sky born in inflation is not the quantum excess but that counts in opposite directions coincide
at all, twice as often as at random, where a hot sky's opposite modes are independent and give 1
[@GrishchukSidorov1990; @KannoSoda2019].

## A cosmic string removes a wedge of space, invisible to every pixel but not to what lies behind

A **cosmic string** is a thin straight line of energy, perhaps left from the early universe, with a mass per length
$\sym{string-mass-per-length}{\matter\mu}$ in $\mathrm{kg\,m^{-1}}$ and a tension $\matter\mu c^2$ along it. By
section 7.3, what pulls is the active density $\matter\rho + \Sigma\matter p/c^2$
([stress gravitates](/tutorial/geometry/einstein-equation/#pressure-and-stress-gravitate)). Per metre of string the
mass is $\matter\mu$ and the stresses add up to the tension's $-\matter\mu c^2$, so the active density per metre is
$\matter\mu - \matter\mu c^2/c^2 = 0$. Outside its core space is flat, with a wedge of angle

$$\boxed{\;\sym{deficit-angle}{\Delta} = \frac{8\pi G\matter\mu}{c^2}\;}$$

removed around it, the **deficit angle** [@Vilenkin1981]. Flat space has no tide, so every pixel reads zero,
however heavy the string.[^null] For $G\matter\mu/c^2 = 10^{-6}$, $\matter\mu = 1.35\times10^{21}\unit{kg\,m^{-1}}$, the
Earth's mass in every 4.4 km, and $\Delta = 2.5\times10^{-5}$ rad, $5.2''$.

**The wedge from the field equation.** We want the field of a straight string along $z$, at the distance $\varpi$ from
it. We assume that **the string is light**, $G\matter\mu/c^2 \ll 1$, so that linearized gravity holds, and that **it is
at rest**. Then $\matter T_{00} = \matter\mu c^2\delta^2$ and $\matter T_{zz} = -\matter\mu c^2\delta^2$, with
$\delta^2$ the delta function on the plane across the string, the second being the tension. The field is static, so
the equation of section
[7.4](/tutorial/geometry/linearized-gravity/#in-harmonic-gauge-einsteins-equation-is-a-wave-equation-for-each-component)
is $\nabla^2\field{\bar h}_{\mu\nu} = -16\pi G\matter T_{\mu\nu}/c^4$ in the plane. On it $\nabla^2\ln\varpi = 0$ away
from the axis, and the flux of $\nabla\ln\varpi = \hat\varpi/\varpi$ through any circle round the axis is $2\pi$, so
$\nabla^2\ln\varpi = 2\pi\delta^2$, the plane's form of section 1.3's rule. Hence

$$\field{\bar h}_{00} = -\frac{8G\matter\mu}{c^2}\ln\frac{\varpi}{\varpi_0} , \qquad \field{\bar h}_{zz} =
+\frac{8G\matter\mu}{c^2}\ln\frac{\varpi}{\varpi_0} ,$$

with $\varpi_0$ an arbitrary length, and the other entries zero; $G\matter\mu/c^2$ is a pure number, as an entry of
the metric must be. The trace is $\field{\bar h} = -\field{\bar h}_{00} + \field{\bar h}_{zz} = (16G\matter\mu/c^2)
\ln(\varpi/\varpi_0)$, and reversing it, $\field h_{\mu\nu} = \field{\bar h}_{\mu\nu} - \tfrac12\field\eta_{\mu\nu}
\field{\bar h}$, gives $\field h_{00} = 0$ and $\field h_{zz} = 0$: no pull, as the active density said, and no change
along the string. Across it, $\field h_{xx} = \field h_{yy} = -(8G\matter\mu/c^2)\ln(\varpi/\varpi_0)$, so with $\delta =
4G\matter\mu/c^2$ the distances on the plane are

$$\dd\ell^2 = \Bigl(1 - 2\delta\ln\frac{\varpi}{\varpi_0}\Bigr)(\dd\varpi^2 + \varpi^2\dd\varphi^2) \approx
\Bigl(\frac{\varpi}{\varpi_0}\Bigr)^{-2\delta}(\dd\varpi^2 + \varpi^2\dd\varphi^2) .$$

A new radius $\rho = \varpi_0(\varpi/\varpi_0)^{1 - \delta}/(1 - \delta)$ has $\dd\rho = (\varpi/\varpi_0)^{-\delta}\dd\varpi$,
and then $(\varpi/\varpi_0)^{-2\delta}\varpi^2 = (1 - \delta)^2\rho^2$, so

$$\dd\ell^2 = \dd\rho^2 + (1 - \delta)^2\rho^2\,\dd\varphi^2 .$$

With the angle $\varphi' = (1 - \delta)\varphi$ this is the flat plane, but $\varphi'$ runs only to $2\pi(1 - \delta)$: a
wedge of $2\pi\delta = 8\pi G\matter\mu/c^2$ is missing, the boxed deficit. **Limit:** as $\matter\mu \to 0$ the plane
is whole. Vilenkin's exact solution gives the same wedge.

**Double images.** With the wedge missing, two straight rays from one source, one on each side of the string, can meet
at the observer: a source behind is seen twice, at most $\Delta$ apart (Figure [](#fig:universe-string)).

![Look first at the glued edges: space is flat, but a ray on each side of the string reaches the observer, so a source
behind is seen twice. Moving, the string leaves a warmer half of the sky behind it. The wedge's angle is
exaggerated.](tut-universe-string){#fig:universe-string}

**The step.** We want the largest temperature step that a moving string makes in a background. We look at the
background past an upright string, which moves to the right at the speed $\obs v$, at right angles to its length and
to our line of sight. It sweeps out a plane between us and the background, which divides space into our side and the
far side; the part of the plane already swept, to its left, is the string's **wake**.

In the string's frame nothing changes, and the matter on both sides of the plane streams past to the left at
$\obs v$. We put the missing wedge on that side, in the wake. Gluing its edges turns the two streams toward each other
by $\Delta$, so in the wake the far side's matter approaches ours at $\obs v\Delta$. In the string's frame the
matter's clocks run slow by $\obs\gamma$ (section
[6.1](/tutorial/relativity/lorentz/#a-moving-clock-runs-slow-and-a-clocks-own-time-is-the-length-of-its-path)), while
distances across the plane are the same in both frames, so the matter itself finds the speed $\obs\gamma\obs v\Delta =
8\pi G\matter\mu\obs\gamma\obs v/c^2$.

Light that reaches us through the wake comes from matter approaching ours at this speed, and light that passes right
of the string comes from matter not yet disturbed. The Doppler shift of section 6.3 at small speeds then makes the left
half of the background warmer than the right by

$$\boxed{\;\frac{\delta T}{T} = \frac{\obs\gamma\obs v\Delta}{c} = \frac{8\pi G\matter\mu\,\obs\gamma\obs v}{c^3}\;} ,$$

the **Kaiser–Stebbins effect** [@KaiserStebbins1984]. <!-- lint-allow: Kaiser -->
A tilted string, or one moving partly along our line of sight, makes a smaller step, so this is the largest. For
$G\matter\mu/c^2 = 10^{-6}$ at $\obs v = c/2$, $\obs\gamma = 1.155$ and the step is $1.45\times10^{-5}$, or 13 μK on the
0.905 K glow. **Limit.** A string at rest makes double images but no step.

::: try {#thermal-history}
The universe's thermal history from the Planck temperature to today: for the photons, the neutrinos and the
gravitons, the temperature times the scale factor, $Ta$, in units of today's photons, against the photons'
temperature, with a step at each annihilation. One slider sets the temperature, and the readouts give $g_{*s}$ and
$1 + z$ there. The other sets the hot count $g_{*s}$ when the gravitons decoupled, with the buttons Standard Model and
Twice; the switch Inflation after decoupling removes the gravitons. The readouts below give $T_g$,
$\Delta N_{\rm eff}$ and $\Omega_g$ today.

Predict first: if the hot universe had twice as many kinds of particle, would today's graviton glow be warmer or
colder? Drag the temperature down to today and watch what each line does at each annihilation. Then press Twice and
compare the graviton readout with your prediction.
:::

**The idea to keep: a uniform expansion stretches every wave by the scale factor, so a black body stays black as it
cools, and an annihilating species gives its entropy to what is still in contact. Gravitons parted near the Planck
temperature, so today they are at $(3.91/106.75)^{1/3}T_\gamma = 0.905$ K: a uniform sky, warmer ahead of our motion,
sharing the light's large spots, and darkened only by black holes.**

::: problems
### Practice

**[12.2]** At what temperature of the microwave sky would the graviton glow be at 1 K, and what would its number
radiance be?

::: solution
The microwave sky would be at $T_\gamma = 1\unit K/0.3321 = 3.01$ K. The number radiance grows as $T^3$, so it is
$3.59\times10^{14}/0.905^3 = 4.8\times10^{14}$ gravitons per second, per square metre and per steradian.
:::

**[12.2]** A string has $G\matter\mu/c^2 = 10^{-7}$. Find its deficit angle and the largest step it makes in the 0.905
K glow at $\obs v = 0.9c$.

::: solution
$\Delta = 8\pi\times10^{-7} = 2.5\times10^{-6}$ rad, $0.52''$. At $0.9c$, $\obs\gamma = 2.29$, so $\delta T/T = 2.5\times
10^{-6}\times2.29\times0.9 = 5.2\times10^{-6}$, or 4.7 μK.
:::

**[12.2]** In the matter era $a \propto t^{2/3}$. Find $a''/a$ in conformal time, and say which modes it changes.

::: solution
$\dd\eta = \dd t/a \propto t^{-2/3}\dd t$ gives $\eta \propto t^{1/3}$, so $a \propto \eta^2$ and $a''/a = 2/\eta^2$. Only
modes with $ck|\eta|$ below about 1, longer than the horizon, feel it.
:::

**[12.2]** Why can no single pixel see a straight cosmic string?

::: solution
Space outside it is flat, so the tide is zero. Only light from behind shows the missing wedge.
:::

### Stretch

**[12.2]** With section 6.3, find the dipole of the 0.905 K glow for our $370\unit{km\,s^{-1}}$, and its temperature
averaged over all directions to second order in $\obs\beta$.

::: solution
To first order the dipole is $\pm\obs\beta T_g = \pm1.12$ mK. Averaged over directions, $T_g\langle1/\obs\gamma(1 -
\obs\beta\cos\alpha')\rangle = (T_g/2\obs\gamma\obs\beta)\ln[(1 + \obs\beta)/(1 - \obs\beta)] \approx T_g(1 -
\obs\beta^2/6)$, a fall of $2.5\times10^{-7}$ of $T_g$.
:::

### The camera

**[12.2]** Reproduce the graviton background's numbers: 0.905 K, 0.05 of an extra species, $7\times10^{-7}$ of the
critical density, $3.6\times10^{14}$ gravitons per second per square metre per steradian, a wavelength of about six
millimetres, a resolution of a third of a degree, a dipole speed $\obs\beta = 1.2\times10^{-3}$, a surface 2% farther
away than the light's, and a string's step of $1.5\times10^{-5}$.

::: solution
[](#gravitons-parted-first-and-kept-a-colder-share-of-the-heat): $0.3321\times2.7255 = 0.905$ K,
$\tfrac87(0.905/1.945)^4 = 0.054$, $5.1\times10^{-16}/7.67\times10^{-10} = 6.6\times10^{-7}$.
[](#the-graviton-sky-is-a-uniform-glow-with-a-dipole-untouched-by-lenses): $3.6\times10^{14}$, 5.9 mm, $0.34°$,
$370/299{,}792 = 1.23\times10^{-3}$. [](#on-large-scales-the-graviton-sky-shares-the-lights-spots): $14.14/13.86 =
1.020$. [](#a-cosmic-string-removes-a-wedge-of-space-invisible-to-every-pixel-but-not-to-what-lies-behind):
$8\pi\times10^{-6}\times1.155\times\tfrac12 = 1.45\times10^{-5}$.
:::
:::

::: paper
- Section XI's [*A primordial graviton background*](/paper/#par:a-primordial-graviton-background): the paper's
  [](/paper/#eq:graviton-temperature), $N_{\rm eff}$, $\Omega_g$, the number radiance and the 6 mm; Figure
  [](/paper/#fig:black-hole). [*Counting coincidences*](/paper/#par:counting-coincidences) (inflation's pairs) and
  [*A cosmic string*](/paper/#par:a-cosmic-string) ($8\pi G\mu/c^2$ and the step).
- [Section X](/paper/#sec:affordances), Table [](/paper/#tab:null): the string's row. [Section
  VII](/paper/#sec:no-lens) (only holes absorb) and [Section IX](/paper/#sec:first-image) (the Earth's and the Sun's
  radiances).
:::

::: deeper
- The GR course's sections
  [19.1](https://neovand.github.io/general-relativity/chapter-19.html#19-1-flrw-geometry-with-the-units-declared-before-the-equations-multiply),
  [19.3](https://neovand.github.io/general-relativity/chapter-19.html#19-3-the-friedmann-equations-what-controls-expansion-and-acceleration),
  [19.6](https://neovand.github.io/general-relativity/chapter-19.html#19-6-cosmological-redshift-derived-from-neighboring-wave-crests)
  and
  [19.8](https://neovand.github.io/general-relativity/chapter-19.html#19-8-three-distances-called-a-horizon-far-too-casually)
  derive the uniform metric, the Friedmann equation, the redshift and the horizons.
- Kolb and Turner, *The Early Universe* (1990) [@KolbTurner1990], chapter 3; Dodelson and Schmidt, *Modern Cosmology*
  (2nd ed., 2020), chapters 2, 4 and 9; Vilenkin and Shellard, *Cosmic Strings and Other Topological Defects* (1994).
:::

[^bg]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XI](/paper/#sec:vistas).

[^gt]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equation
    [](/paper/#eq:graviton-temperature), after Kolb and Turner (1990).

[^noabs]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. VII](/paper/#sec:no-lens).

[^null]: The row "a straight cosmic string and empty space" of Table [](/paper/#tab:null) of *The gravitational camera*
    (Mohsenvand 2026).

[^rhoc]: The $\matter\rho_c$ of section [12.1](/tutorial/sky/stars/#eddingtons-model-ties-the-pressure-to-the-density)
    is a star's central density.

[^g]: A bare $g$ is a count of states; with indices, $\field g_{ij}$ is the metric. Since $16\sigma_{\rm SB}/3c =
    (4\pi^2/45)\kB^4/\hbar^3c^3$, $g = 2$ gives the $s$ of section 10.2.

[^fermi]: By the route of section 10.2, $\dd S = \kB x\,\dd\bar n_{\rm F}$ with $x = \ln[(1 - \bar n_{\rm F})/\bar
    n_{\rm F}]$, so a fermion mode's entropy is $-\kB[\bar n_{\rm F}\ln\bar n_{\rm F} + (1 - \bar n_{\rm F})\ln(1 -
    \bar n_{\rm F})] = \kB[x\bar n_{\rm F} + \ln(1 + e^{-x})]$ (Landau and Lifshitz, *Statistical Physics*, §55).
    Integrating by parts, the second term gives a third of the first.

[^leak]: A little heat leaked into the neutrinos, which makes their $N_{\rm eff}$ 3.044, not 3; the count is then 3.93
    and $T_g = 0.907$ K.

[^gamma]: The rate $\Gamma$ is in $\mathrm{s^{-1}}$: $\mathrm{m^{-3}}\times\mathrm{m^2}\times\mathrm{m\,s^{-1}}$.

[^act]: The Atacama Cosmology Telescope's data give $2.86 \pm 0.13$ (Calabrese and colleagues, 2025), 1.8 standard
    deviations below $3.044 + 0.054 = 3.098$.

[^Omega]: The value $7\times10^{-7}$ is for $H_0 = 67\unit{km\,s^{-1}\,Mpc^{-1}}$, the microwave sky's.

[^dist]: With $H_0 = 70\unit{km\,s^{-1}\,Mpc^{-1}}$ and 30% matter the ratio is 1.0204 or 1.0201.

