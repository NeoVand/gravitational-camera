---
id: R13b
title: 'A black hole and a moon: what the camera can and cannot see'
question: 'What does a black hole answer to a tide, how does a stone answer differently, and what is left of holography when a camera can only look, push and weigh?'
part: '13'
requires: ['2.5', '3.8', '4.2', '4.5', '4.6', '8.1', '8.6', '11.2', '11.3', '11.4', '13.1', '13.3', '13.7', '13.8']
paper: [sec:hole, eq:horizon-friction, eq:hole-noise, eq:hole-thermometer, eq:hole-sum-rule, fig:hole-response, tab:hair, sec:holography, eq:dp-energy, sec:conclusion, sec:status]
figures: [fig:hole-response]
live: [hole-response]
---

Push a stone and a black hole with tides. The stone's replies reach its interior; the hole's return little more than its
mass and spin. What does a hole answer, how does it differ from a stone, and what is left of holography?[^open]

::: plain
A steady tide raises no bulge on a black hole. A changing tide loses energy into it, as if its horizon had friction, and
its shape trembles at the temperature that Hawking found, which the mass sets. Its replies to the three broadest tides,
added up over every rate of change, would need a body with negative mass.

Looking at the outside of a body gives averages that grow like a surface. A push followed by a weighing reaches the
inside, though the details grow only as the cube of the number of digits of the camera's precision. A ball and a shell
of one mass pull alike, yet differ in the energy by which Diósi and Penrose proposed that gravity ends a superposition.
:::

## A hole raises no bulge, and its quadrupole answers a changing tide with friction alone

The **Love number** $\sym{love-number}{k_2}$, a pure number, measures how far a steady tide makes a body bulge
(section 4.6). A hole that does not turn has $k_2 = 0$ [@BinningtonPoisson2009; @DamourNagar2009] (section 11.4). A turning hole gains a moment by friction only [@CharalambousDubovskyIvanov2021].

A hole of mass $\sym{mass}{\matter M}$ and Schwarzschild radius $\sym{schwarzschild-radius}{r_s} = 2G\matter M/c^2$, in a
tide that changes slowly, absorbs energy at the rate[^friction]

$$\begin{gathered}
\frac{\dd E}{\dd t} = \nu\,\bigl(\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij} + \dot{\curv\tB}_{ij}\dot{\curv\tB}_{ij}\bigr),\\
\nu = \frac{16}{45}\,\frac{G^5\matter M^6}{c^{13}} = \frac{\matter Mr_s^5}{90\,c^3} ,
\end{gathered}$$

with $\sym{tidal-tensor}{\curv\tE}_{ij}$ and $\curv\tB_{ij}$ the electric and magnetic parts of the tide, in
$\mathrm{s^{-2}}$, the magnetic part being the one that moving masses make (section 7.5), and
$\sym{horizon-friction}{\nu}$ the **horizon friction**, in $\mathrm{J\,s^5}$ (section 11.4 derives its form; the
$\tfrac{16}{45}$ is Poisson's [@Poisson2004]). The forms agree, since $r_s^5 = 32G^5\matter M^5/c^{10}$ and $\tfrac{32}{90} = \tfrac{16}{45}$.

The hole's quadrupole $\sym{hole-quadrupole}{\matter Q}_{ij}$, in $\mathrm{kg\,m^2}$, is defined by its energy
$\matter Q_{ij}\curv\tE_{ij}$ in a tide. With $\sym{response-function}{\chi}$ the
response of section 4.5, it answers with $\mathrm{Im}\,\chi = \nu\omega$ and no elastic part [@GoldbergerRothstein2006].
A tide $\curv\tE_0\cos\omega t$ gives the reply the power $\tfrac12\omega\,\mathrm{Im}\,\chi\,\curv\tE_0^2$ on
average (section 4.1), and the friction takes $\tfrac12\nu\omega^2\curv\tE_0^2$. The horizon answers the magnetic part
with the same friction, so it absorbs the share $(16/5)G\nu\omega^6/c^5$ of a long quadrupole wave
[@GoldbergerRothstein2020]. Since $\tfrac{16}{5}\cdot\tfrac{16}{45} = \tfrac{256}{225}$, this is Don Page's
$\tfrac{256}{225}(G\matter M\omega/c^3)^6$ (section 11.4).

## The quadrupole trembles at the Hawking temperature, and the tremor gives back the mass

A hole formed by collapse and left alone trembles at frequencies far below $c/4\pi r_s$ with the flat spectrum[^noise]

$$\begin{gathered}
\langle\matter Q_{ij}(t)\,\matter Q_{kl}(0)\rangle
= \Pi_{ijkl}\int S_Q\,e^{-i\omega t}\,\frac{\dd\omega}{2\pi},\\
S_Q = \frac{\hbar\,r_s^5}{360\pi G} ,
\end{gathered}$$

with $\sym{quadrupole-noise}{S_Q}$ in $\mathrm{kg^2\,m^4\,s}$ and $\sym{stf-projector}{\Pi_{ijkl}}$ the projector of
section 1.5, which makes the five independent trace-free combinations of $\matter Q_{ij}$ tremble alike and
independently. At the Hawking temperature $\kB T/\hbar = c/4\pi r_s$, so $\hbar\omega \ll \kB T$ needs those
frequencies. There the chances of emitting and of absorbing a quantum are both the classical absorption times
$\kB T/\hbar\omega$, since Planck's $n = 1/(e^{\hbar\omega/\kB T} - 1)$ and $n + 1$ are both close to it (section 11.3). Inserting both into the thermometer of section 4.6 gives

$$T = \frac{S_Q}{2\kB\,\nu} = \frac{\hbar c^3}{8\pi G\matter M\kB} ,$$

as section 11.4 derives and section 13.7 reads. Indeed $S_Q/2\kB\nu = (\hbar r_s^5/360\pi G)(90c^3/2\kB\matter Mr_s^5) =
\hbar c^3/8\pi G\matter M\kB$. The noise was matched to Hawking's radiation, so this is a consistency check: the friction, found from the growth of
the horizon, and the absorption, found from the scattering of waves, are one number. The share $\sym{greybody-factor}{\Gamma_2}$ of a quadrupole wave that the hole absorbs is
1.013 times Page's form at $x = G\matter M\omega/c^3 = 0.002$ and 1.070 times at 0.01, an excess of about $2\pi x$ that
vanishes for long waves (section 11.4).

For a hole at 0.905 K, $\matter M = 1.356\times10^{23}$ kg, $r_s = 0.201$ mm, $\nu = 1.85\times10^{-23}\unit{J\,s^5}$ and
$S_Q = 4.62\times10^{-46}\unit{kg^2\,m^4\,s}$. One entry, $\matter Q_{zz}$, takes the share
$\Pi_{zzzz} = \tfrac12(1 + 1) - \tfrac13 = \tfrac23$ of the noise, and white noise of spectrum $S$ averaged over a time
$\tau$ has the variance $S/\tau$ (section 3.2). So in one second $\matter Q_{zz}$ trembles by
$\sqrt{2/3}\sqrt{S_Q/1\unit s} = 1.76\times10^{-23}\unit{kg\,m^2}$. On the line $z$ through the hole its potential
$-3G\matter Q_{zz}/z^3$ gives a tide of size $36G\matter Q_{zz}/z^5$ (section 11.4). A metre away that tide trembles by
$4.2\times10^{-32}\unit{s^{-2}}$, while the steady tide $2G\matter M/z^3$ is $1.81\times10^{13}\unit{s^{-2}}$. A stone's
tremor carries $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ for every pair of harmonic functions (section 4.2), and
a hole's carries $\matter M$ again (section 13.7).

## A hole weighs like a shell a little outside its horizon, yet its sums belong to no body

For a round body under a quadrupolar tide, the sum rule of section 4.5 gives $\tfrac13\int\matter\rho\,r^2\,\dd V$, the
**tidal inertia** that a tide too fast for the body's bonds has to move. For the hole,
$\mathrm{Im}\,\chi = 5c^5\Gamma_2/16G\omega^5$ at every frequency (section 11.4, where absorption defines the response).
With Page's $\Gamma_2$ this is $(5c^5/16G\omega^5)\cdot\tfrac{256}{225}x^6 = \nu\omega$, the friction again. The sum is[^sum]

$$\begin{aligned}
\frac{2}{\pi}\int_0^\infty\omega\,\mathrm{Im}\,\chi\,\dd\omega
&= \frac{5}{32\pi}\,\matter Mr_s^2\int_0^\infty\frac{\Gamma_2}{x^4}\,\dd x\\
&= 0.345\,\matter Mr_s^2 ,
\end{aligned}$$

whose integral is a numerical result from the **Regge–Wheeler equation** of section 11.3. With $\int\Gamma_2x^{-4}\,\dd x = 6.938$, $(5/32\pi)\times6.938 = 0.3451$, and a
shell of the hole's mass with this sum has the radius $\sqrt{3\times0.3451}\,r_s = 1.0175\,r_s$.

For a round body each tide of degree $\ell$ reads one moment $\int\matter\rho\,r^{2\ell-2}\,\dd V$.[^factor] As radii of
shells of the hole's mass with the same sums, they are 1.0175, 1.4555, 1.6100, 1.6868 and $1.7324\,r_s$ for
$\ell = 2$ to 6 (section 13.7, numerically). Their limit is $(3\sqrt3/e)\,r_s = 1.9116\,r_s$, because at a high degree
the hole absorbs like a step, taking every ray within the critical impact parameter $\tfrac{3\sqrt3}{2}\,r_s = 2.60\,r_s$
(section 11.1).

For positive mass $\int\matter\rho\,r^2(r^2 - a)^2\,\dd V \ge 0$, with $a$ any number in $\mathrm{m^2}$.[^a] With $m_1$,
$m_2$ and $m_3$ the means of $r^2$, $r^4$ and $r^6$ over the mass, this is $m_3 - 2am_2 + a^2m_1 \ge 0$, which holds for
every $a$ exactly when $m_2^2 \le m_1m_3$, the **positivity test** (section 13.7). The hole's radii give
$m_1 = 1.0352\,r_s^2$, $m_2 = 4.4881\,r_s^4$ and $m_3 = 17.418\,r_s^6$, so $m_2^2/m_1m_3 = 1.117$. The least value,
$-2.039\,\matter Mr_s^6$ at $a = 4.335\,r_s^2$, shows that one tide lets the hole be drawn as a shell and three allow no
drawing.

For one degree the hole only absorbs, $\Gamma_\ell \ge 0$, so $\omega\,\mathrm{Im}\,\chi_\ell$ is a **positive measure**
in frequency, as for every passive response [@KehagiasRiotto2026], and its moments pass every such test. It is the
sums across the degrees that belong to no body. A **step absorber**, which takes every wave aimed inside a fixed impact
parameter, fails worse, with the ratio 1.185 whatever the parameter; no matter does that to a gravitational wave, which
loses about $10^{-30}$ of its energy crossing the Earth.

Matter's dispersion relation, $\chi(0) = (2/\pi)\int\mathrm{Im}\,\chi\,\dd\omega/\omega$, would give a body of radius
$r_s$ the Love number $k_2 = (15/128\pi)\int\Gamma_2x^{-6}\,\dd x = (15/128\pi)\times36.13 = 1.35$, in the convention
of section 4.6, where a ball of liquid has $\tfrac32$. The hole's own is zero, so the relation needs a
**subtraction**, a **local term**: a reply at the instant of the push, one real number at every frequency
[@Porto2016; @KehagiasRiotto2026]. If one subtraction suffices, it is $-1.35$, and it cannot be told from the part due
to waves near the hole's size [@GoldbergerLiRothstein2021].

{{paper fig:hole-response}}

The integrand peaks at $x = 0.40$, and the hole's $0.345\,\matter Mr_s^2$ ends 3.5 per cent above a thin shell at $r_s$,
$\tfrac13\,\matter Mr_s^2$, and well above a uniform ball of that radius, $\tfrac13\cdot\tfrac35\,\matter Mr_s^2$.

::: try {#hole-response}
The figure, live, as in section 13.7: rings at each degree's shell radius, the radii against the degree, and the test
from degrees two, three and four against $a$, in units of $r_s^2$. It opens at degree two, with $a$ near $4.34\,r_s^2$,
where the test is least. Slide *Degree of the tide* (2 to 8) or *The number a of the test* (0 to 9).

Predict first. Which is the first degree whose ring lies beyond $1.75\,r_s$, and has the ring of degree eight gone more
or less than nine tenths of the way from the horizon to the dashed limit? Is the test still below zero at
$a = 6\,r_s^2$? Then slide and read.
:::

## The table, row by row: the stone's column reads the interior, and the hole's returns its mass

Every way of reading a body met so far can be put to a stone and to a black hole of the same mass. The
table sets the answers side by side. In the stone's column nearly every row returns the density or the flow; in the
hole's every row returns the mass, the spin or the temperature, which the mass sets.

| What is read | A stone, a planet, a star | A black hole | Sections |
|---|---|---|---|
| The field at one time | the harmonic moments of its mass and its flow | at rest, its mass, place and spin: seven numbers | 2.5, 2.8, 11.2 |
| Bits, at the signal-to-noise ratio $\SNR$ | $[L^3/3\Lambda^2 + L^2/2\Lambda]/\ln2$ | $7\log_2\SNR$ | 3.8, 11.2 |
| A steady tide | its Love numbers | nothing, if it does not turn | 4.6, 11.4 |
| A changing tide | when fast, the response $\chi \to -\omega^{-2}\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$: the density | when slow, the friction $\nu$ | 4.5, 11.4 |
| Tides of degree up to $m$ | the moments $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$ with $j < m$ | nothing more | 13.3, 11.4 |
| The sums, tide by tide | multiples of $\int\matter\rho\,r^{2\ell-2}\,\dd V$: a round body's density | the moments of no distribution of positive mass | 4.5, 13.7 |
| A mass that passes | its own loss of energy, $\tfrac12C^2\int\matter\Sigma\,\lvert\vect b - \vect s\rvert^{-2}\,\dd^2s$: the density | what the hole absorbs, set by its mass and spin | 1.8, 13.1, 11.4 |
| Two tides, in either order | $\{\matter{\dot Q_h}, \matter{\dot Q_g}\}$: the flow | nothing more | 13.4, 11.4 |
| Its tremor | $\langle\matter{\dot Q_h}\matter{\dot Q_g}\rangle = \kB T\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$: the density, at a known temperature | $S_Q = 2\kB T\nu$ at low frequencies: the temperature | 4.2, 11.4, 13.7 |
| Its weight, after a tide | after an impulsive one, $\tfrac12\epsilon^2\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V$ more: the density | after a slow one, $\nu\int(\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij} + \dot{\curv\tB}_{ij}\dot{\curv\tB}_{ij})\,\dd t$ more: its mass | 1.7, 6.4, 11.4 |

: What the field outside a body determines of its interior, for ordinary matter and for a black hole. Here
$L = \ln\SNR$ and $\Lambda = \ln(R_c/R)$ are those of the bits of one reading, $h$ and $g$ are harmonic functions,
$\nu$ is the horizon's friction and $C = 2G\matter\mu/V$ is the constant of a pass. In the last row the stone's entry
holds for an impulsive tide, and the hole's for a tide that changes little in the time $r_s/c$.

Three of the hole's cells say that it gives nothing beyond its mass and spin: under tides of higher degree, to a mass
that passes, and to two tides in either order. They follow from section
[11.4](/tutorial/black-holes/under-tides/): a tide of any degree on a hole meets only the share $\Gamma_\ell$ it
absorbs, which the mass and spin fix (section 13.7), and a hole has no flow inside for a bracket to weigh.

## Looking gives a surface's worth, and pushing gives the inside, slowly

A **hologram** is a record on a surface from which a field in the volume beyond can be rebuilt. **Balayage** sweeps a
body's mass onto a surface around it without changing its pull outside (section 2.5), so the swept skin is a hologram
of the pull that loses the null space (section 13.8). A sphere of radius $R$ read with detail down to a size $d$ carries about $(R/d)^2$ numbers, while the
cells of the body grow as $(R/d)^3$. The size $d$ that can be read shrinks only slowly as the instrument improves:
cells shrink as $1/\ln\SNR$ and grow in number as $(\ln\SNR)^3$, and the bits grow as $(\ln\SNR)^4$ (section 13.2).
From three body radii, looking holds $(\lfloor\ln\SNR/\Lambda\rfloor + 1)^2$ numbers, with $\Lambda = \ln3$, and the
cells that pairs of held masses resolve grow as $\kappa(\ln\SNR/\Lambda)^3$, with $\kappa \to 0.073$ at large $\SNR$
(section 13.8). Counted, they are 169 against 271 at $10^6$ and $2.2\times10^4$ against $2.5\times10^5$ at $10^{70}$, so pushing gains a factor 1.6 over looking at $10^6$ and about twelve at $10^{70}$.[^Rd]

For a hole, seven numbers at one time are its mass, place and spin (section 11.2), and a temperature at two is the
thermometer, since a spectrum compares readings at two times. A weighing after a slow tide gives its mass again
(section 11.4), and what the hole gains under any tide is set by its mass and spin alone (section 13.7). Whether its exterior field holds more is the question of the fate of what falls in; four quantum arguments say it does
[@LaddhaEtAl2021; @ChowdhuryPapadoulakiRaju2021; @Donnelly2018; @CalmetEtAl2022], and section 13.8 reads them as the
**holography of information**, the argument that a region's boundary holds everything inside it. What remains of them
without $\hbar$ is an impulsive tide followed by a weighing (sections 13.1 and 13.8). It needs time and gives a density
and a motion, not a state (section 13.6). For charges the analogue has the square of the charge over the mass: a charge $q$ of mass $m$ receives the impulse
$q\epsilon\nabla g$ and so the energy $\tfrac12\epsilon^2(q^2/m)|\nabla g|^2$. What is peculiar to gravity is that nothing can shield a part of a body from
the tide, that the quantity read is the mass itself, and that the result stays in the field outside, as weight
(section 6.4). On a black hole the method fails: $S_Q$ is proportional to $\hbar$, so
without $\hbar$ the hole is at zero temperature, has no tremor and under a tide gives only its mass.

## A ball and a shell leave gravity no record, yet differ in their Diósi–Penrose energy

A **superposition** is a state in which a body is in two arrangements at once, and **decoherence** is the loss of their
interference when the surroundings record which one it is in (section 8.1). A ball and a shell of the same mass and
energy, or two stages of a round motion, have the same field outside at one time (sections 2.5 and 6.4), and a
superposition made by a round motion emits no graviton, by Birkhoff's theorem (section 13.8). To the outside the
branches differ only in readings at two times, in their tremor and in their response to a tide (section 4.5).

The **Diósi–Penrose energy** $\sym{diosi-penrose-energy}{E_G}$, in joules, is the gravitational self-energy of the
difference of the two densities [@Diosi1987; @Penrose1996]. For a ball and a shell of mass $\matter M$ and radius $R$ the
fields $\field{\vect g}_{1,2}$ differ only inside, and (section 13.8)[^dp]

$$E_G = \frac{1}{8\pi G}\int|\field{\vect g}_1 - \field{\vect g}_2|^2\,\dd V = \frac{G\matter M^2}{10R} .$$

Its numerical factor is a matter of convention. For a glass bead of
radius 1 μm and density 2200 kg m⁻³, $\matter M = 9.2\times10^{-15}$ kg, $E_G = 5.7\times10^{-34}$ J and
$\hbar/E_G = 0.19$ s, about a fifth of a second.[^density] A bead that breathes by $\delta/R$ has
$E_G = \tfrac{9}{10}(\delta/R)^2G\matter M^2/R$ and a time longer by $R^2/9\delta^2$, $1.1\times10^5$ at
$\delta/R = 10^{-3}$. Decoherence by a record [@Belenchia2018; @DanielsonSatishchandranWald2022] is closed for such a
pair, save for tides from outside, which act at second order in the coupling (section 13.1); a collapse of Diósi and
Penrose's kind is not, though an experiment has ruled out the proposal's simplest form [@DonadiEtAl2021].

## The capstone: a black hole and a moon of one mass

![Look first at row (d): the moon's shell radii climb toward its surface and pass the test of positive mass, while the
hole's climb toward $1.91\,r_s$ and fail it. The numbers are exact and the ticks are to scale along each line; the
discs are not to scale.](tut-read-hole-moon){#fig:read-hole-moon}

The capstone sets the 0.905 K hole beside a rocky moon of the same mass, $\matter M = 1.356\times10^{23}$ kg, uniform at
3000 kg m⁻³, of radius $R_{\rm m} = (3\matter M/4\pi\matter\rho)^{1/3} = 2210$ km. Both meet one tide of profile $g =
\tfrac12(x^2 - y^2)$, in $\mathrm{m^2}$, whose strength rises and falls as a bell curve with a standard deviation of one
second. It peaks at $4.0\times10^{-11}\unit{s^{-2}}$, and its time integral, the impulse strength $\epsilon$ of the ball and shell above, is
$10^{-10}\unit{s^{-1}}$. The tide is slow for the hole, with $x = 3.4\times10^{-13}$ at $\omega = 1\unit{s^{-1}}$, and
fast for the moon, which sound takes minutes to cross.

| Step | The hole | The moon | Section |
|---|---|---|---|
| (a) one time, $\SNR = 10^6$ | seven numbers, $7\log_2\SNR = 139.5$ bits | 1176 bits from $3R_{\rm m}$ | 3.8, 11.2 |
| (b) a steady tide | $k_2 = 0$ | $k_2 = 0.031$ | 4.6, 11.4 |
| (c) the tide, at $\omega = 1\unit{s^{-1}}$ | slow: $\mathrm{Im}\,\chi = \nu\omega = 1.85\times10^{-23}\unit{kg\,m^2\,s^2}$ | fast: $\chi = -A/\omega^2 = -1.32\times10^{35}\unit{kg\,m^2\,s^2}$, $A = \tfrac15\matter MR_{\rm m}^2$ | 4.5, 11.4 |
| (d) the sums | $0.345\,\matter Mr_s^2 = 1.90\times10^{15}\unit{kg\,m^2}$; shell at 0.205 mm; fails | $A$; shell at $0.775R_{\rm m}$; passes, $\tfrac{45}{49}$ | 4.5, 13.7 |
| (e) the tremor | $S_Q = 4.62\times10^{-46}\unit{kg^2\,m^4\,s}$: 0.905 K | at 1000 K, $\kB T\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V = 3.7\times10^{15}\unit{kg^2\,m^4\,s^{-2}}$ | 4.2, 11.4, 13.7 |
| (f) a weighing after the tide | $\nu\int\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}\,\dd t = 5.2\times10^{-44}$ J | $\tfrac12\epsilon^2\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V = 1.32\times10^{15}$ J | 1.7, 6.4, 11.4 |
| (g) the most any camera could read | 1450 bits at $2.3\times10^{62}$ | at most $2.8\times10^5$ cells at $2.6\times10^{72}$ | 8.6, 13.8 |

(b) Kelvin's rule (section 4.6), $k_2 = \tfrac32/(1 + 19\matter\mu/2\matter\rho g_{\rm s}R_{\rm m})$, with
$g_{\rm s} = 1.85\unit{m\,s^{-2}}$ the moon's surface gravity and $\sym{shear-modulus}{\matter\mu}$ its rigidity, gives 0.031
for 61 GPa, the rigidity for which it gives our Moon its measured $k_2 = 0.024$.

(c) The hole answers with friction, a quarter of a cycle behind. The moon, driven faster than its bonds, answers as
dust, in step, with $A = \tfrac13\int\matter\rho\,r^2\,\dd V$ (section 4.5). (d) By the sum rule the moon's weight is
the same $A$, $7\times10^{19}$ times the hole's. Its shells of degree two, three and four lie at
$R_{\rm m}[3/(2\ell + 1)]^{1/(2\ell - 2)}$, or $0.775$, $0.809$ and $0.833\,R_{\rm m}$, climbing toward its surface.

(e) The hole's thermometer returns 0.905 K, and so its mass. At a chosen 1000 K, the moon's tremor (section 4.2) is
$\kB T$ times
$\int\matter\rho\,|\nabla g|^2\,\dd V = 2A = 2.65\times10^{35}\unit{kg\,m^2}$, and with every pair of profiles it holds
the whole interior.

(f) Weighed after the tide, the moon has gained $\epsilon^2A$, or 15 g, a reading of its density (sections 1.7 and 6.4).
A tide from slow masses has almost no magnetic part (section 7.5), so for the hole
$\int\dot{\curv\tE}_{ij}\dot{\curv\tE}_{ij}\,\dd t = 2.8\times10^{-21}\unit{s^{-5}}$; the gain returns its mass again.

(g) Section 13.8's ceiling with the scene's own mass, $\SNR \le \matter Mc\,\ell_{\rm r}/\hbar$ for a camera in a region of
radius $\ell_{\rm r}$ watching for the time $2\ell_{\rm r}/c$, is $2.6\times10^{72}$ for the moon within $3R_{\rm m}$.
There pairs of held masses could resolve at most $2.8\times10^5$ cells, each 55 km across, against $2.3\times10^4$ numbers
by looking. For the hole within $3r_s$ the ceiling, $2.3\times10^{62}$, is about half its entropy of $4.9\times10^{62}$
nats, a quarter of its horizon's area in Planck units (section 11.3), while the seven numbers carry at most 1450 bits,
only its logarithm.

The moon's column reads its interior: its stiffness, its density and, through heat, all of it. The hole's returns its mass
again, by its tremor and by a weighing, and its summed replies fit no body of positive mass.

## What the camera can and cannot see

The camera cannot be built, but parts of it exist: gradiometers already map what is buried [@Stray2022], a satellite has
flown one around the Earth [@RummelYiStummer2011], and every gravitational-wave observatory models the pull of its
surroundings in order to remove it [@Harms2019]. That pull is the near-field signal.[^closing]

Nearly all that the camera sees follows from the spin of gravity and from two small numbers of matter. Gravity has spin
two, so a reading at a point holds ten numbers, among them four principal null directions (section 9.4) and the
velocity of a rest frame (section 9.3). Matter is slow, so everything near us is near field: seen at once, where it is now (section 6.3), through any wall
(section 0.2), and never sharply (section 3.7). Matter is tenuous, so it scarcely bends, reflects or stops a wave,
though a black hole does all three (sections 11.1 and 11.3), and warm matter glows too faintly for anything made of
matter to detect. Every image is a computation.

Each channel has scenes it cannot tell apart, and these are stated as exactly as what it sees: the harmonic part of the
density and nothing more (section 2.5); the swirl of a flow round an axis and not its rolls (section 2.8); the shear of
a stress and not its pressure (section 7.6); friction times a power of the temperature and not either alone (section
10.3); the sky's harmonics of degree four and below and none above (section 9.6). Ambiguities are removed across channels, by spin, by heat, by an applied tide, by a second pixel. The most important, Newton's shell theorem, which hides the interior of a body from its exterior field, holds only to
first order in whatever feels the field (section 13.1). A warm body reveals in time where all its mass is; one to which tides can be applied reveals how it
moves as well, one radial moment more for each degree of tide (sections 13.3 and 13.4). A black hole does not. All that
remains in classical physics of holography is an operation from outside followed by a reading of the energy, at its
simplest a mass that passes and the speed it leaves with.

The field of light at a point is a vector, and that of a gravitational wave the square of one. From that difference a
pixel reads its own velocity through an unknown room and separates four waves where a sensor of light separates two
(section 9.3 and [one pixel's four waves](/tutorial/one-point/reading-section-viii-2/)). The blur of a near-field image does not limit the precision of a
measurement: a patch of the scene as wide as it is far holds only tens to hundreds of bits at signal-to-noise ratios between a
thousand and a million, and a scene that is simple spends them all on a few numbers. Readings that could never draw a
face place a mass to within a millimetre.

## Open problems

Six problems stand open.[^status]

1. How much of a real body, the Earth for one, a finite record of finite sensitivity recovers is open: it has not
   been worked out, and section 13.8 counts cells only in one model.
2. The pair of arrangements that gravity cannot tell apart at one time is a test of gravitational collapse described
   here and not designed (section 13.8 gives its energy and time).
3. The reading of a general wave sent in from infinity, with the mass read there for the weight, is a problem of
   scattering that has not been solved; the particle without mass is the simplest case (section 13.5).
4. Whether the moments of the full theory close on a known algebra is open [@CompereOliveriSeraj2018]; section 13.6
   gives their brackets to first order in $1/c^2$.
5. A bound on sensitivity needs the coupling, the resources and the task to be stated exactly, as section 13.8 does for
   one model; the ceiling used here is a heuristic estimate.
6. The friction of real materials at the frequencies of heat, on which every thermal count here rests, deserves a
   microscopic calculation, phonon by phonon, for at least one crystal [@KahnSchutteEngelTrickle2024] and for the deep
   Earth (section 10.3 estimates it channel by channel).

**The idea to keep: a black hole answers every tide with its mass and spin, so its column holds seven numbers, a
temperature and its mass again, and its summed replies fit no body of positive mass. A stone's column reads its whole
interior, only as fast as the logarithm of the sensitivity allows, and a push and a weighing are what remains of
holography without $\hbar$.**

::: problems
### Practice

**[13.7]** Rerun the capstone's hole for ten times the mass: its temperature, $\nu$, $S_Q$, the tremor's tide a metre
away in a second, the steady tide there, and the shell radii.

::: solution
$T = 0.0905$ K. $\nu$ grows as $\matter M^6$ to $1.85\times10^{-17}\unit{J\,s^5}$, and $S_Q$ as $r_s^5$, $10^5$ times.
The tremor's tide grows as $\sqrt{S_Q}$, to $1.3\times10^{-29}\unit{s^{-2}}$, and the steady tide ten times, to
$1.8\times10^{14}\unit{s^{-2}}$. The radii in units of $r_s$ do not change.
:::

**[13.7]** Which cells of the hole's column in the table change if the hole turns, and what never enters them?

::: solution
A steady tide now raises a moment, by friction only, though the Love number is still zero. The shares become
$\Gamma_{\ell m}(\omega; \matter M, a)$, so the friction, the tremor, the sums and the gain after a tide depend on the
spin too, and where $\omega < m\Omega_H$ the hole amplifies instead of absorbing. Nothing of what fell in enters,
because Teukolsky's equation holds only $\matter M$, $a$ and $\omega$.
:::

**[13.7]** The moon is uniform, so its means are $m_k = 3R_{\rm m}^{2k}/(2k + 3)$. Does it pass the test of positive
mass, and with what ratio $m_2^2/m_1m_3$?

::: solution
$m_1 = \tfrac35R_{\rm m}^2$, $m_2 = \tfrac37R_{\rm m}^4$ and $m_3 = \tfrac13R_{\rm m}^6$, so
$m_2^2/m_1m_3 = (9/49)/(1/5) = \tfrac{45}{49} = 0.918$, below 1, so the moon passes.
:::

### Stretch

**[13.8]** With section 8.6: watch the 0.905 K hole within a region of radius $10\,r_s$. How many bits can its seven
numbers carry at the ceiling set by its mass, and at the region's own ceiling, $\ell_{\rm r}^2/2\ell_P^2$? Compare both
with its entropy.

::: solution
With $\ell_P$ the Planck length, $\matter Mc\,\ell_{\rm r}/\hbar = 5r_s^2/\ell_P^2 = 7.8\times10^{62}$, so
$7\log_2\SNR = 1462$ bits. The region's own ceiling, $7.8\times10^{63}$, assumes the largest mass the region allows, ten times this hole's. The
ceiling is $5/\pi = 1.6$ times the
entropy, $\pi r_s^2/\ell_P^2 = 4.9\times10^{62}$ nats or $7.0\times10^{62}$ bits, of which the bits are about
$2\times10^{-60}$.
:::

### The camera

**[11.4]** Reproduce the numbers of the hole's tremor and its first shell radius: the mass of the 0.905 K hole, $r_s$,
$\nu$, $S_Q$, the tremor's tide and the steady tide a metre away, and 1.02, given $\int\Gamma_2x^{-4}\,\dd x = 6.938$.

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
  [22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature) on the horizon's
  temperature and
  [22.10](https://neovand.github.io/general-relativity/chapter-22.html#22-10-the-information-question-without-assuming-quantum-mechanics)
  on information.
- R. Penrose, "On gravity's role in quantum state reduction" (1996) [@Penrose1996]: the energy of the Diósi–Penrose pair
  and its time.
:::

[^open]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XIV](/paper/#sec:hole) for the hole, whose
    Table [](/paper/#tab:hair) sets the two columns side by side, and [Sec. XV](/paper/#sec:holography) for holography.

[^friction]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XIV](/paper/#par:the-response-of-a-black-hole-to-a-tide), as its equation [](/paper/#eq:horizon-friction).

[^noise]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XIV](/paper/#par:the-fluctuations-of-a-black-holes-quadrupole), as its equations [](/paper/#eq:hole-noise) and
    [](/paper/#eq:hole-thermometer).

[^sum]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XIV](/paper/#par:the-weight-of-a-black-holes-response), as its equation [](/paper/#eq:hole-sum-rule).

[^factor]: Each tide $r^\ell Y_{\ell m}$, summed over the orders $m$, gives $\ell(2\ell + 1)/4\pi$ times the moment; the
    quadrupole gives $\tfrac13$ (section 13.7). The radii do not depend on the factor.

[^a]: Here $a$ is the test's free number, not Kerr's $a$.

[^Rd]: The count was first made in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XV](/paper/#par:black-holes-and-the-classical-limit).

[^dp]: First shown in *The gravitational camera* (Mohsenvand 2026),
    [Sec. XV](/paper/#par:what-gravity-cannot-decohere), as its equation [](/paper/#eq:dp-energy).

[^density]: The time goes as the inverse square of the density: soda-lime glass, 2500 kg m⁻³, gives 0.14 s.

[^closing]: The closing paragraphs follow the Conclusion of *The gravitational camera* (Mohsenvand 2026),
    [Sec. XVI](/paper/#sec:conclusion).

[^status]: Listed in *The gravitational camera* (Mohsenvand 2026), [Sec. XVII](/paper/#sec:status).
