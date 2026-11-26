/**
 * Side notes for Section XI, Astrophysical and cosmological scenes (sec:vistas). Drafted from reading chapters
 * R12 and R12b and the chapters they cite. The rules, the voice and the format are in
 * design/book/SIDE-NOTES-GUIDE.md.
 */
import type { SideNote } from './types';

export const section = 'sec:vistas';

export const notes: SideNote[] = [
	{
		anchor: 'par:a-pair-of-black-holes-from-the-near-zone-to-the-wave-zone',
		text:
			'The pair’s waves turn at twice its orbital rate $\\Omega = 27.3\\,\\mathrm{s^{-1}}$, so their ' +
			'wavelength is $\\pi c/\\Omega = 34{,}400$ km. Divided by $2\\pi$ this is the reduced wavelength, ' +
			'5480 km, which is 2.5 times the 2200 km between the holes; inside it the changing tide turns ' +
			'rigidly with the pair.',
		chapter: '7.7',
		section: 'one-solution-runs-from-newtons-pull-near-the-source-to-the-wave-far-away'
	},
	{
		anchor: 'p:this-marks-a-crossover',
		text:
			'The near law falls as the fifth power of the distance and the wave as the first, so they are equal ' +
			'in the orbit’s plane at 0.313 wavelengths: 10,800 km, 4.9 times the separation. Seeing two holes ' +
			'there also takes an array wide and sensitive enough to meet the blur law.',
		chapter: '7.7',
		section: 'one-solution-runs-from-newtons-pull-near-the-source-to-the-wave-far-away'
	},
	{
		anchor: 'p:one-pixel-on-the',
		text:
			'On the orbit’s axis the whole mass $M$ stretches the pixel along the axis by $2GM/r^3$. The wave’s ' +
			'tide reaches $3GM/r^3$, one and a half times that, at 66,900 km, 12 reduced wavelengths out: ' +
			'farther than the wave’s own scale, because the whole mass pulls harder than the changing ' +
			'quadrupole there.',
		chapter: '9.4',
		section: 'four-directions-solve-one-quartic'
	},
	{
		anchor: 'par:memory',
		text:
			'The spin memory goes as $\\sin^2\\iota\\cos\\iota$, with $\\iota$ the angle between the line of ' +
			'sight and the orbit’s axis. With $x = \\cos\\iota$ it is $(1 - x^2)x$, whose slope $1 - 3x^2$ ' +
			'vanishes at $x = \\pm1/\\sqrt3$, that is $\\iota = 54.7°$ and $125.3°$: the peaks, one of each sign.',
		chapter: '7.8',
		section: 'a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good'
	},
	{
		anchor: 'par:an-exploding-star',
		text:
			'The $3\\times10^{46}$ J of neutrinos weighs $E/c^2 = 0.168$ solar masses, about a sixth. Their ' +
			'squeeze lasts the burst’s duration $\\Delta t$ and is $r/c\\Delta t$ times the change of tide they ' +
			'leave behind: for 10 s at 10 kiloparsecs, $3.09\\times10^{20}$ m, that is $1.0\\times10^{11}$.',
		chapter: '12.1',
		section: 'a-core-collapse-frees-a-sixth-of-a-solar-mass-and-neutrinos-carry-it'
	},
	{
		anchor: 'par:the-milky-way',
		text:
			'Five magnitudes of dimming are a factor of 100, so the model’s 31.4 magnitudes is more than $10^{12}$ ' +
			'in light, while dust leaves waves alone and the centre is 102 times the opposite sky. A wave of ' +
			'3 mHz is $c/f = 0.668$ AU long, so a camera 50 AU wide resolves $0.668/50$ of a radian, $0.77°$.',
		chapter: '12.1',
		section: 'in-waves-the-galaxy-shows-where-its-stars-are'
	},
	{
		anchor: 'par:a-primordial-graviton-background',
		text:
			'Gravitons parted from the hot plasma early and missed the heat of every species that later ' +
			'vanished. The ratio of particle states today (3.91) to those when they parted (106.75) gives ' +
			'$T_g = (3.91/106.75)^{1/3}\\times2.7255\\,\\mathrm{K} = 0.3321\\times2.7255 = 0.905\\,\\mathrm{K}$.',
		chapter: '12.2',
		section: 'gravitons-parted-first-and-kept-a-colder-share-of-the-heat'
	},
	{
		anchor: 'p:if-it-exists-it',
		text:
			'A black body of two polarizations at 0.905 K sends $3.6\\times10^{14}$ quanta every second through ' +
			'each square metre and each steradian, the unit of solid angle on the sky. That is $3\\times10^{19}$ ' +
			'times the Earth’s interior rate of $1.2\\times10^{-5}$ and $9\\times10^{8}$ times the Sun’s core.',
		chapter: '10.1',
		section: 'three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy'
	},
	{
		anchor: 'p:it-has-a-dipole',
		text:
			'Our speed of 370 km/s is $1.23\\times10^{-3}$ of the speed of light, so the glow is warmer ahead by ' +
			'that fraction of 0.905 K, about 1.1 mK. The gravitons’ last surface lies 14.14 gigaparsecs away, ' +
			'against 13.86 for light, 2% farther, so the two skies share their large spots.',
		chapter: '12.2',
		section: 'the-graviton-sky-is-a-uniform-glow-with-a-dipole-untouched-by-lenses'
	},
	{
		anchor: 'p:figure-shows-one-such',
		text:
			'Here $GM/c^2$ is a length, half the radius of the hole’s horizon, and the camera sits 40 of them ' +
			'from the centre. The shadow’s radius $\\alpha$ obeys $\\sin\\alpha = \\sqrt{27}\\,(GM/c^2r)' +
			'\\sqrt{1 - 2GM/c^2r}$, which gives $7.3°$, and every frequency is raised by 1.026: 0.905 K reads ' +
			'0.929 K.',
		chapter: '11.1',
		section: 'light-can-circle-a-hole-and-the-hole-casts-a-shadow',
		figure: {
			name: 'tut-schw-shadow-angle',
			alt: 'A black disc seen from a point on the right, with the shadow’s angular radius marked between the axis and the edge of the dark cone.'
		}
	},
	{
		anchor: 'p:a-black-hole-is',
		text:
			'A hole’s temperature is $\\hbar c^3/8\\pi GMk_B$, lower the heavier it is. At $1.356\\times10^{23}$ ' +
			'kg, 1.85 Moon masses, it is 0.905 K, the glow’s own, so the hole returns what it receives. Ten ' +
			'times that mass gives 0.09 K, colder than the glow, and the hole casts a shadow.',
		chapter: '11.3',
		section: 'a-black-hole-has-a-temperature-lower-the-heavier-it-is'
	},
	{
		anchor: 'p:mode-by-mode-the',
		text:
			'A mode is one pattern of wave, and its occupation is the mean number of quanta in it. A hole at ' +
			'spin 0.998 amplifies the mode $\\ell = m = 2$ by 91%, so at $GM\\omega/c^3 = 0.92$ it returns ' +
			'$0.110 + 0.91\\times1.128 = 1.14$ quanta where the sky holds 0.110: 10.3 times as bright.',
		chapter: '11.3',
		section: 'a-spinning-hole-can-be-brighter-than-any-sky'
	},
	{
		anchor: 'par:a-freely-falling-camera',
		text:
			'Aberration is the shift of apparent directions caused by the camera’s own motion. Falling at ' +
			'Newton’s escape speed, the camera sees the shadow shrink from $7.3°$ to $5.8°$ at 40 $GM/c^2$, ' +
			'and at the horizon to $\\arccos(23/31) = 42.1°$ in radius, under 13% of the sky.',
		chapter: '11.1',
		section: 'a-body-falling-from-far-away-crosses-each-radius-at-newtons-escape-speed'
	},
	{
		anchor: 'par:through-a-room-at-nearly-the-speed-of-light',
		text:
			'At speed $\\beta c$ the Lorentz factor is $\\gamma = 1/\\sqrt{1 - \\beta^2}$, 7.1 when $\\beta = 0.99$. ' +
			'The four directions that mark the pixel’s reading crowd behind it within angles of order ' +
			'$1/\\gamma$, here 0.14 radian or $8.1°$, so each piece of furniture looks like a wave from ahead.',
		chapter: '9.4',
		section: 'moving-the-pixel-moves-the-four-directions-as-rays-of-light'
	},
	{
		anchor: 'par:counting-coincidences',
		text:
			'The ratio $g^{(2)}$ of coincident counts to the rate if arrivals were independent is 1 for a ' +
			'coherent source and 2 for thermal gravitons, which bunch. Inflation’s pairs give ' +
			'$2 + 1/\\bar n$ between opposite directions: 3 when each mode holds one graviton, more than any ' +
			'thermal classical wave allows.',
		chapter: '8.5',
		section: 'pairs-in-two-modes-coincide-more-than-thermal-classical-waves-can'
	},
	{
		anchor: 'par:a-cosmic-string',
		text:
			'With $G\\mu/c^2 = 10^{-6}$ the missing wedge is $8\\pi\\times10^{-6} = 2.5\\times10^{-5}$ radian, ' +
			'5.2 arcseconds. A string crossing the line of sight at half the speed of light, where ' +
			'$\\gamma = 1.155$, steps the background’s temperature by $2.5\\times10^{-5}\\times1.155\\times0.5 = ' +
			'1.45\\times10^{-5}$ of itself.',
		chapter: '12.2',
		section:
			'a-cosmic-string-removes-a-wedge-of-space-invisible-to-every-pixel-but-not-to-what-lies-behind',
		figure: {
			name: 'tut-universe-string',
			alt: 'Two sources behind a string seen twice, and a background split into two halves by a string moving across it.'
		}
	},
	{
		anchor: 'par:the-transparent-sun-as-a-lens',
		text:
			'A ray passing at distance $b$ from the centre is bent by $4GM(b)/c^2b$, with $M(b)$ the mass inside ' +
			'the cylinder of radius $b$. For the whole Sun at its edge this is 1.75 arcseconds. The Sun’s mass ' +
			'is packed toward its centre, so rays at 0.27 of a radius are bent more, by 4.2 arcseconds.',
		chapter: '11.1',
		section: 'far-from-a-mass-light-bends-by-twice-newtons-angle'
	},
	{
		anchor: 'p:geometric-optics-needs-more',
		text:
			'The Sun delays a wave by $4GM/c^3 = 19.7$ microseconds. Focusing needs that delay to span a radian ' +
			'of phase, which happens at $f = 1/(2\\pi\\times19.7\\,\\mu\\mathrm{s}) = 8.08$ kHz. At 100 Hz the ' +
			'phase is a thirtieth of a radian, and the point-mass gain is only 1.02.',
		chapter: '11.1',
		section: 'a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring'
	},
	{
		anchor: 'p:wave-optics-joins-the',
		text:
			'The gain is the factor by which the Sun raises the intensity on the axis. Beyond the central focus ' +
			'it grows in proportion to the frequency: 3.4 at 10 kHz, 44 at 100 kHz and 480 at 1 MHz. Carried ' +
			'to the thermal gravitons’ $10^{13}$ Hz, the same proportion gives $4.8\\times10^{9}$.',
		chapter: '5.3',
		section: 'beyond-an-opening-a-wave-is-a-sum-of-wavelets-from-every-point-of-it'
	},
	{
		anchor: 'par:scattering-earthquakes-and-tails',
		text:
			'A body of mass $m$ scatters gravitational waves with a cross-section per steradian of about ' +
			'$(Gm/c^2)^2$, an area. For 70 kg, $Gm/c^2 = 5.2\\times10^{-26}$ m, so the cross-section is ' +
			'$2.7\\times10^{-51}\\,\\mathrm{m^2}$: far too little to light a scene.',
		chapter: '7.8',
		section: 'matter-barely-touches-the-waves'
	}
];
