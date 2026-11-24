import type { Component } from 'svelte';
import TidalFigure from '../paper/figures/TidalFigure.svelte';
import NearFieldFigure from '../paper/figures/NearFieldFigure.svelte';
import LockedSafeFigure from '../paper/figures/LockedSafeFigure.svelte';
import WhichWayFigure from '../paper/figures/WhichWayFigure.svelte';
import ClosedFurnaceFigure from '../paper/figures/ClosedFurnaceFigure.svelte';
import ArrayFigure from '../paper/figures/ArrayFigure.svelte';
import QuadrupoleFigure from '../paper/figures/QuadrupoleFigure.svelte';
import Speedometer from '../paper/figures/interactive/Speedometer.svelte';
import Stars from '../paper/figures/interactive/Stars.svelte';
import Voices from '../paper/figures/interactive/Voices.svelte';
import Present from '../paper/figures/interactive/Present.svelte';
import Passing from '../paper/figures/hair/Passing.svelte';
import HoleResponse from '../paper/figures/hair/HoleResponse.svelte';
import TidalRing from './live/TidalRing.svelte';
import BlurLaw from './live/BlurLaw.svelte';
import RingMatrix from './live/RingMatrix.svelte';
import PotentialMap from './live/PotentialMap.svelte';
import ShellTheorem from './live/ShellTheorem.svelte';
import SameOutside from './live/SameOutside.svelte';
import SpinTwoDial from './live/SpinTwoDial.svelte';
import FiveNumbers from './live/FiveNumbers.svelte';
import TurningPixel from './live/TurningPixel.svelte';
import RegimeMap from './live/RegimeMap.svelte';
import GravitonCount from './live/GravitonCount.svelte';
import FlybyKick from './live/FlybyKick.svelte';
import PhaseSpace from './live/PhaseSpace.svelte';
import ScaleLadder from './live/ScaleLadder.svelte';
import AveragingNoise from './live/AveragingNoise.svelte';
import SkyPatterns from './live/SkyPatterns.svelte';
import MeanValue from './live/MeanValue.svelte';
import NoiseSpectrum from './live/NoiseSpectrum.svelte';
import ImageCharge from './live/ImageCharge.svelte';
import Multipoles from './live/Multipoles.svelte';
import FourierBuild from './live/FourierBuild.svelte';
import WhichSafe from './live/WhichSafe.svelte';
import FadingRipple from './live/FadingRipple.svelte';
import HiddenFlow from '../paper/figures/hair/HiddenFlow.svelte';
import OneModeWiener from './live/OneModeWiener.svelte';
import ToyCamera from './live/ToyCamera.svelte';
import RoundPupil from './live/RoundPupil.svelte';
import BitsPerPatch from './live/BitsPerPatch.svelte';
import PositiveImage from './live/PositiveImage.svelte';
import DrivenCart from './live/DrivenCart.svelte';
import Equipartition from './live/Equipartition.svelte';
import NormalModes from './live/NormalModes.svelte';
import MaxwellLiquid from './live/MaxwellLiquid.svelte';
import SumRule from './live/SumRule.svelte';
import DampedWave from './live/DampedWave.svelte';
import NearToWave from './live/NearToWave.svelte';
import Tremor from './live/Tremor.svelte';
import DelayAndSum from './live/DelayAndSum.svelte';
import RotorPolarization from './live/RotorPolarization.svelte';
import RadiativeTransfer from './live/RadiativeTransfer.svelte';
import OnionPeel from './live/OnionPeel.svelte';
import LorentzDiagram from './live/LorentzDiagram.svelte';
import MovingSky from './live/MovingSky.svelte';
import MassShell from './live/MassShell.svelte';
import ComplexField from './live/ComplexField.svelte';
import LongestPath from './live/LongestPath.svelte';
import StressEnergyTable from './live/StressEnergyTable.svelte';
import CarryAround from './live/CarryAround.svelte';
import RicciWeyl from './live/RicciWeyl.svelte';
import GaugeOrWave from './live/GaugeOrWave.svelte';
import MagneticTide from './live/MagneticTide.svelte';
import WaveRings from './live/WaveRings.svelte';
import NearToFar from './live/NearToFar.svelte';
import MemoryPattern from './live/MemoryPattern.svelte';
import TwoPaths from './live/TwoPaths.svelte';
import UncertaintyPacket from './live/UncertaintyPacket.svelte';
import LadderOscillator from './live/LadderOscillator.svelte';
import MajoranaStars from './live/MajoranaStars.svelte';
import ClickTrains from './live/ClickTrains.svelte';

/**
 * The interactive figures a chapter can mount with `::: try {#id}`, by id. A chapter that names an id not listed
 * here fails the build. The paper's own live figures are reused where they fit; the GR course's labs will be
 * ported here as Svelte components (PLAN.md section 7).
 */
export const tutorialLive: Record<string, { label: string; component: Component }> = {
	// the paper's own live figures, for the tour of Part 0 and the reading chapters
	'scene-locked-safe': {
		label: 'The two safes, in light and in gravity',
		component: LockedSafeFigure as Component
	},
	'scene-which-way': {
		label: 'The three boxes, in light and in gravity',
		component: WhichWayFigure as Component
	},
	'scene-closed-furnace': {
		label: 'The two furnaces, in light and in gravity',
		component: ClosedFurnaceFigure as Component
	},
	array: { label: 'An array of pixels, and how wide it must be', component: ArrayFigure },
	quadrupole: { label: 'A source of waves, at the speed you choose', component: QuadrupoleFigure },
	speedometer: { label: 'One pixel reads its own velocity', component: Speedometer },
	stars: { label: 'The four special directions of the tide', component: Stars },
	voices: { label: 'How many waves one pixel can tell apart', component: Voices },
	present: { label: 'Where a moving body is now', component: Present },
	passing: { label: 'A mass passing a body, and what it weighs', component: Passing },
	'hole-response': { label: "A black hole's reply to a tide", component: HoleResponse },
	'tidal-rings': { label: 'Three rings of free particles, in motion', component: TidalFigure },
	'tidal-ring': {
		label: 'A ring of free particles beside a mass you can move',
		component: TidalRing
	},
	'potential-map': {
		label: 'Two masses, the lines of their potential and a probe of their field',
		component: PotentialMap
	},
	'shell-theorem': {
		label: 'A round body of fixed mass, its pull inside and out',
		component: ShellTheorem
	},
	'same-outside': {
		label: 'Bodies of one mass that pull alike outside, cut open, and what tells them apart',
		component: SameOutside
	},
	'ring-matrix': {
		label: 'A ring of free particles under a table you set',
		component: RingMatrix
	},
	'five-numbers': {
		label: 'Five numbers, one table and three rings of free particles',
		component: FiveNumbers
	},
	'spin-two-dial': {
		label: 'A ring, an arrow and axes you turn, with their numbers in the complex plane',
		component: SpinTwoDial
	},
	'turning-pixel': {
		label: 'A ring of free balls seen from outside and from a turning frame',
		component: TurningPixel
	},
	'blur-law': {
		label: 'The cut-off, the weight of each ripple and the picture of a point',
		component: BlurLaw
	},
	'near-field-blur': {
		label: 'Two buried masses and the blur of the near field',
		component: NearFieldFigure
	},
	'regime-map': {
		label: 'Frequency against distance: the near field, the wave zone and the paper’s sources',
		component: RegimeMap
	},
	'graviton-count': {
		label: 'Gravitons counted one at a time, and the picture they allow',
		component: GravitonCount
	},
	multipoles: {
		label:
			'Masses in a plane, a ring of readout, and the strength of each degree against the noise',
		component: Multipoles
	},
	'image-charge': {
		label:
			'A source in a ball or above a plane, its image, and the skin that copies its pull outside',
		component: ImageCharge
	},
	'fourier-build': {
		label: 'A narrow bump rebuilt from its ripples',
		component: FourierBuild
	},
	'which-safe': {
		label:
			'The locked safe as a test: trials of choosing the safe whose predicted readings lie closer, against P(Z > D/2)',
		component: WhichSafe
	},
	'fading-ripple': {
		label: 'A ripple of density on a slab, and how fast its field fades with height',
		component: FadingRipple
	},
	'hidden-flow': {
		label:
			'An inner ball and an outer shell turning opposite ways, with no angular momentum in all',
		component: HiddenFlow
	},
	'one-mode-wiener': {
		label:
			"One pattern seen through noise: the naive guess y/T against the Wiener guess H y/T, and their errors beside the prior's variance",
		component: OneModeWiener
	},
	'toy-camera': {
		label: 'A camera of three pixels and its three patterns',
		component: ToyCamera
	},
	'round-pupil': {
		label: 'A round opening or a slit, and its pattern: amplitude against intensity',
		component: RoundPupil
	},
	'bits-per-patch': {
		label:
			'The bits of a near-field picture: the patterns of one patch, their bits, and the total against the sensitivity',
		component: BitsPerPatch
	},
	'positive-image': {
		label:
			'Masses in a row of cells under a row of sensors: the truth, the Gaussian image and the positive image',
		component: PositiveImage
	},
	'driven-cart': {
		label:
			'A cart on a spring with friction, pushed back and forth by a hand: its swing, its lag and the line of power it takes',
		component: DrivenCart
	},
	equipartition: {
		label:
			'Six masses on springs in a heat bath: their velocities, and the running averages of ½m⟨v²⟩, ⟨Q̇_x²⟩ and ⟨Q̇_xy²⟩ against what the chapter predicts',
		component: Equipartition
	},
	'normal-modes': {
		label:
			'A disc of nineteen masses on springs, its normal modes and the quotient of a shape you drag',
		component: NormalModes
	},
	'maxwell-liquid': {
		label:
			'The friction of one Maxwell liquid against frequency, with its plateau, its tail and the band of the thermal glow: water’s placeholder, honey and copper’s electrons',
		component: MaxwellLiquid
	},
	'sum-rule': {
		label:
			'A body’s line of power with up to three lines: move them, broaden them and shift weight between them; the area stays ∫ρ|∇h|², and the static compliance changes only when the lines move',
		component: SumRule
	},
	'damped-wave': {
		label:
			'A damped line with a slower slab: a wave train, one pulse or two opposite pulses, its decay length and the slab’s lag',
		component: DampedWave
	},
	'near-to-wave': {
		label:
			'One oscillating source along a line: the field, and its slope’s near part and wave part, each times r², crossing at r = λ/2π; move the probe, the distances and the frequency',
		component: NearToWave
	},
	tremor: {
		label:
			'The tremor of a ball and a shell: Appendix A’s two lattices, their tremor added up in order of frequency and its spectrum, as the springs and the friction change',
		component: Tremor
	},
	'delay-and-sum': {
		label:
			'Delay and sum: a row of pixels steered by delaying and adding its records, with grating lobes when the pixels spread and one or two sources in or out of step',
		component: DelayAndSum
	},
	'rotor-polarization': {
		label:
			'A rotor tilted toward a camera, and the ring its wave moves: the ellipse of (h₊, h×), the Stokes parameters that change when the camera’s axes turn and those that do not, and the which-way spot coloured by V/I',
		component: RotorPolarization
	},
	'radiative-transfer': {
		label: 'A slab in front of a background, and what one pixel receives',
		component: RadiativeTransfer
	},
	'onion-peel': {
		label:
			'Onion peeling a round planet: the chord through each shell, the brightness against the angle with a kink at every boundary, and the layers peeled back, with Poisson noise',
		component: OnionPeel
	},
	'lorentz-diagram': {
		label:
			'Two flashes, two observers: the Lorentz transformation on a spacetime diagram, with rapidities that add',
		component: LorentzDiagram
	},
	'moving-sky': {
		label:
			'The sky seen from a camera moving at a chosen speed: stars crowding forward and changing colour, a thermal glow hotter ahead, and the Sun shifted by aberration',
		component: MovingSky
	},
	'mass-shell': {
		label:
			"The mass shell in light-cone coordinates: a boost slides a body along it, a wave kicks it while keeping q, and a wave and its reverse change a pair's rest mass",
		component: MassShell
	},
	'complex-field': {
		label:
			"Light at one point as one complex vector: boost or turn the sensor and watch E and cB mix while the invariant F·F stays, find the frame where the fields are parallel, and follow light's two special directions",
		component: ComplexField
	},
	'longest-path': {
		label:
			"The tossed clock: shape a path between a throw and a catch and compare the proper time it gains with free fall's",
		component: LongestPath
	},
	'stress-energy-table': {
		label:
			'The stress–energy tensor as a 4 × 4 table for dust, gas, a beam, light in a box and the Casimir gap, boosted, with its trace, what gravitates and what a ray sees',
		component: StressEnergyTable
	},
	'carry-around': {
		label:
			'Carry an arrow round a loop on a sphere without turning it, and compare its turn with the area enclosed; on a flat sheet with polar labels it comes home unturned',
		component: CarryAround
	},
	'ricci-weyl': {
		label:
			'A ball of free dust inside matter, beside a mass or in a beam: the tide split into a Ricci part that changes its volume and a Weyl part that changes its shape',
		component: RicciWeyl
	},
	'gauge-or-wave': {
		label:
			'A grid of rings of free balls under a ripple of coordinate labels and under a real wave: the labels move in one, the measured separations in the other',
		component: GaugeOrWave
	},
	'magnetic-tide': {
		label:
			"A pixel beside a passing mass, a spinning ball or shell, and on the Earth's equator: the magnetic part of the tide and two gyroscopes that turn relative to one another",
		component: MagneticTide
	},
	'wave-rings': {
		label:
			'A ring of free balls in a gravitational wave coming toward you, with the two arms of a detector you can turn and the magnetic part drawn beside it, turned by 45 degrees',
		component: WaveRings
	},
	'near-to-far': {
		label:
			"The changing tide of a turning pair in the plane of its orbit, from Newton's pull of the masses close by to the wave far away, with a probe and a log–log plot of the two laws",
		component: NearToFar
	},
	'memory-pattern': {
		label:
			'A burst of energy drawn as its pattern of emission, and the lasting strain it leaves at every camera direction: jets, a sphere, a dipole, a quadrupole and the waves of a merger',
		component: MemoryPattern
	},
	'two-paths': {
		label:
			'A Mach–Zehnder interferometer with a delay on one path and a record of the path: the two amplitudes at an exit, their sum, and the fringes',
		component: TwoPaths
	},
	'uncertainty-packet': {
		label:
			'A wave packet on a line and its distribution of momenta: its width, a chirp and a split into two places, with the product of the two spreads',
		component: UncertaintyPacket
	},
	'ladder-oscillator': {
		label:
			'An oscillator in a heat bath: the thermal probability of each level, the mean energy, and on the phase plane the thermal spread against a coherent state circling',
		component: LadderOscillator
	},
	'majorana-stars': {
		label:
			"A spin as stars on a sphere: drag four stars of a spin two, or two of light, and read the five components, one spin's Bloch vector and the overlap with a coherent state",
		component: MajoranaStars
	},
	'click-trains': {
		label:
			'Clicks from a steady source, a hot one and a source of pairs: the counts per window, their second-order coherence and the classical bounds',
		component: ClickTrains
	},
	'noise-spectrum': {
		label:
			'White, red or narrow-band noise as a trace, its autocorrelation and its spectrum, averaged over a time you choose',
		component: NoiseSpectrum
	},
	'mean-value': {
		label:
			'A square of empty space that averages itself, and the gold averaged over a sphere round the camera',
		component: MeanValue
	},
	'sky-patterns': {
		label: 'A sphere of patterns, one degree at a time, and a cap rebuilt from its degrees',
		component: SkyPatterns
	},
	'averaging-noise': {
		label:
			'Readings averaged N at a time, and their noise falling as one over the square root of N',
		component: AveragingNoise
	},
	'scale-ladder': {
		label: 'The paper’s tides and lengths on one ladder of powers of ten',
		component: ScaleLadder
	},
	'phase-space': {
		label: 'A cart on a spring in phase space, kicked by a sudden tide',
		component: PhaseSpace
	},
	'flyby-kick': {
		label:
			'A tonne passing a steel ball: the pull on one part, its area and the kick to every part',
		component: FlybyKick
	}
};
