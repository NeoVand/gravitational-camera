/**
 * The paper's margin map, one note per place in the paper, generated from the tutorial's records by
 * app/scripts/paper-links.mjs (the rules are in paper-map.ts). Do not edit by hand: change the sources and run the script; a test
 * fails while this file differs from what the sources give.
 */
import type { PaperLink } from './paper-links';

export const paperLinks: PaperLink[] = [
	{ anchor: 'sec:introduction', chapter: '0.1', label: 'Background' },
	{
		anchor: 'fig:sun-at-midnight',
		chapter: 'R10b',
		label: 'Live',
		section: 'at-midnight-the-suns-core-outshines-the-ground-ten-billion-times'
	},
	{ anchor: 'par:what-is-already-known', chapter: '0.1', label: 'Background' },
	{ anchor: 'sec:pixel', chapter: 'R1', label: 'Reading' },
	{
		anchor: 'eq:tidal',
		chapter: '7.2',
		label: 'Derivation',
		section: 'for-an-observer-at-rest-the-drift-is-the-papers-tide'
	},
	{
		anchor: 'eq:deviation',
		chapter: '1.4',
		label: 'Derivation',
		section: 'the-difference-in-gravity-is-a-table-of-second-derivatives'
	},
	{
		anchor: 'fig:tidal',
		chapter: '1.4',
		label: 'Background',
		section: 'falling-together-cancels-the-pull-but-not-its-difference'
	},
	{
		anchor: 'fig:tidal-field',
		chapter: '1.4',
		label: 'Background',
		section: 'beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it'
	},
	{
		anchor: 'eq:newton',
		chapter: '1.4',
		label: 'Derivation',
		section: 'the-difference-in-gravity-is-a-table-of-second-derivatives'
	},
	{
		anchor: 'eq:wave',
		chapter: '7.6',
		label: 'Derivation',
		section: 'the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain'
	},
	{
		anchor: 'eq:magnetic',
		chapter: '7.5',
		label: 'Derivation',
		section: 'the-magnetic-part-is-the-curvature-with-one-time-index'
	},
	{
		anchor: 'par:what-the-premise-asks',
		chapter: 'R1',
		label: 'Reading',
		section: 'what-the-premise-asks-existing-instruments-nearly-supply'
	},
	{
		anchor: 'par:the-earths-own-tide',
		chapter: 'R1',
		label: 'Reading',
		section: 'the-earths-own-tide-is-subtracted-and-its-magnetic-part-weighs-the-core'
	},
	{ anchor: 'sec:regimes', chapter: 'R5', label: 'Reading' },
	{
		anchor: 'eq:nearzone',
		chapter: '5.2',
		label: 'Derivation',
		section:
			'beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1'
	},
	{ anchor: 'fig:regimes', chapter: '5.2', label: 'Background' },
	{ anchor: 'par:spin-speed-and-compactness', chapter: 'R5', label: 'Reading' },
	{
		anchor: 'tab:regimes',
		chapter: '0.1',
		label: 'Background',
		section: 'near-a-source-a-pixel-feels-its-pull-and-far-away-its-waves'
	},
	{ anchor: 'sec:near-field', chapter: 'R2', label: 'Reading' },
	{
		anchor: 'par:how-bright',
		chapter: 'R2',
		label: 'Reading',
		section: 'a-bodys-tidal-brightness-is-its-density-times-the-cube-of-its-angular-size'
	},
	{
		anchor: 'eq:tidal-brightness',
		chapter: '1.4',
		label: 'Derivation',
		section: 'tidal-brightness-is-density-times-the-cube-of-angular-size'
	},
	{
		anchor: 'par:what-the-image-is',
		chapter: 'R2',
		label: 'Reading',
		section: 'the-image-is-the-tidal-column-and-a-pixel-reads-only-five-of-its-numbers'
	},
	{
		anchor: 'eq:tidal-column',
		chapter: '1.5',
		label: 'Derivation',
		section: 'averaged-over-the-sky-the-tidal-weight-vanishes'
	},
	{
		anchor: 'fig:sky-integral',
		chapter: '1.5',
		label: 'Background',
		section: 'averaged-over-the-sky-the-tidal-weight-vanishes'
	},
	{
		anchor: 'par:the-magnetic-picture',
		chapter: 'R2',
		label: 'Reading',
		section:
			'the-magnetic-picture-images-the-current-column-and-its-numbers-can-be-checked-before-its-formulas'
	},
	{
		anchor: 'eq:magnetic-point',
		chapter: '7.5',
		label: 'Derivation',
		section: 'a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight'
	},
	{
		anchor: 'eq:current-column',
		chapter: '2.8',
		label: 'Derivation',
		section: 'the-current-column-is-the-flow-along-a-line-of-sight-weighted-by-inverse-distance'
	},
	{
		anchor: 'par:what-the-image-cannot-show',
		chapter: 'R2',
		label: 'Reading',
		section: 'the-field-outside-does-not-fix-the-tidal-column-so-the-papers-images-are-renderings'
	},
	{
		anchor: 'par:what-the-image-does-show',
		chapter: 'R2',
		label: 'Reading',
		section:
			'the-field-outside-fixes-the-harmonic-part-and-the-least-assuming-picture-never-shows-a-core'
	},
	{
		anchor: 'eq:split',
		chapter: '2.5',
		label: 'Derivation',
		section: 'every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see'
	},
	{
		anchor: 'eq:harmonic-point',
		chapter: '2.5',
		label: 'Derivation',
		section: 'the-harmonic-part-of-a-nugget-is-a-flush-on-the-near-wall'
	},
	{
		anchor: 'fig:same-outside',
		chapter: '1.3',
		label: 'Background',
		section: 'the-outside-of-the-earth-cannot-tell-a-core-from-a-uniform-ball'
	},
	{
		anchor: 'par:what-breaks-the-tie',
		chapter: 'R2',
		label: 'Reading',
		section: 'spin-heat-and-a-pixel-inside-break-the-tie-and-rolls-stay-silent'
	},
	{ anchor: 'fig:silent-flows', chapter: '2.8', label: 'Background' },
	{
		anchor: 'par:what-heat-reveals',
		chapter: 'R4',
		label: 'Reading',
		section: 'a-warm-bodys-moments-change-at-a-rate-set-by-its-temperature-and-its-density-alone'
	},
	{
		anchor: 'eq:thermal-moment',
		chapter: '4.2',
		label: 'Derivation',
		section:
			'the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density'
	},
	{
		anchor: 'eq:thermal-multipole',
		chapter: '4.6',
		label: 'Derivation',
		section: 'each-degree-of-the-tremor-holds-one-moment-of-the-density'
	},
	{
		anchor: 'fig:tremor',
		chapter: '4.1',
		label: 'Background',
		section: 'a-body-with-many-modes-answers-as-a-sum-of-oscillators'
	},
	{
		anchor: 'par:what-an-applied-tide-reveals',
		chapter: 'R4',
		label: 'Reading',
		section: 'a-push-measures-the-same-total-at-any-temperature'
	},
	{
		anchor: 'eq:sum-rule',
		chapter: '4.5',
		label: 'Derivation',
		section: 'driven-faster-than-its-bonds-every-body-answers-as-dust'
	},
	{
		anchor: 'par:a-model-independent-thermometer',
		chapter: 'R4',
		label: 'Reading',
		section: 'a-push-shaped-like-the-reading-turns-the-pixel-into-a-thermometer'
	},
	{
		anchor: 'eq:thermometer',
		chapter: '4.6',
		label: 'Derivation',
		section: 'a-push-shaped-like-the-reading-makes-a-thermometer-that-needs-no-model-of-the-body'
	},
	{
		anchor: 'par:how-sharp',
		chapter: 'R2',
		label: 'Reading',
		section: 'fine-detail-fades-as-the-exponential-of-the-depth-and-a-uniform-sheet-has-no-tide'
	},
	{
		anchor: 'eq:evanescent',
		chapter: '2.7',
		label: 'Derivation',
		section: 'in-empty-space-a-ripple-can-only-fade'
	},
	{ anchor: 'fig:blur', chapter: '3.7', label: 'Background' },
	{
		anchor: 'eq:array-data',
		chapter: '2.7',
		label: 'Derivation',
		section: 'the-camera-records-a-tide-which-weights-each-ripple-by-k'
	},
	{
		anchor: 'eq:wiener',
		chapter: '3.5',
		label: 'Derivation',
		section: 'independent-ripples-can-be-filtered-one-at-a-time'
	},
	{
		anchor: 'eq:cutoff',
		chapter: '3.7',
		label: 'Derivation',
		section: 'step-3-the-filter-keeps-a-ripple-while-it-stands-above-its-noise'
	},
	{
		anchor: 'eq:resolution',
		chapter: '3.7',
		label: 'Derivation',
		section: 'step-6-the-blur-is-the-width-of-the-picture-at-half-its-height'
	},
	{
		anchor: 'tab:resolution',
		chapter: '2.7',
		label: 'Background',
		section: 'undoing-the-fade-multiplies-the-noise'
	},
	{
		anchor: 'fig:resolution-law',
		chapter: '3.7',
		label: 'Background',
		section: 'step-3-the-filter-keeps-a-ripple-while-it-stands-above-its-noise'
	},
	{
		anchor: 'par:a-flown-gradiometer',
		chapter: 'R3',
		label: 'Reading',
		section: 'the-best-picture-of-a-point-is-the-pattern-of-a-round-pupil'
	},
	{
		anchor: 'fig:nearfield',
		chapter: '2.7',
		label: 'Live',
		section: 'the-same-fade-appears-for-every-field-that-obeys-laplaces-equation'
	},
	{ anchor: 'par:other-gravitational-sensors', chapter: 'R3', label: 'Reading' },
	{ anchor: 'par:a-small-camera', chapter: 'R3', label: 'Reading' },
	{
		anchor: 'eq:handheld',
		chapter: '2.3',
		label: 'Derivation',
		section: 'round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics'
	},
	{ anchor: 'par:the-precision-of-a-simple-scene', chapter: 'R3', label: 'Reading' },
	{ anchor: 'par:a-worked-case', chapter: 'R3', label: 'Reading' },
	{ anchor: 'par:the-positivity-of-mass', chapter: 'R3', label: 'Reading' },
	{
		anchor: 'fig:locked-safe',
		chapter: '0.2',
		label: 'Live',
		section: 'the-camera-weighs-what-it-sees-through-anything'
	},
	{
		anchor: 'par:the-zeros-of-the-shear',
		chapter: 'R3',
		label: 'Reading',
		section: 'the-zeros-of-the-shear-give-a-thin-layers-size-with-no-image-at-all'
	},
	{
		anchor: 'eq:shear-zeros',
		chapter: '1.5b',
		label: 'Derivation',
		section: 'where-the-shear-vanishes-its-axes-make-half-a-turn-round-the-zero'
	},
	{
		anchor: 'fig:buried-ruler',
		chapter: '1.5b',
		label: 'Background',
		section: 'where-the-shear-vanishes-its-axes-make-half-a-turn-round-the-zero'
	},
	{ anchor: 'par:limits-on-sensitivity', chapter: 'R3', label: 'Reading' },
	{ anchor: 'par:the-information-in-a-near-field-image', chapter: 'R3', label: 'Reading' },
	{
		anchor: 'eq:capacity-integral',
		chapter: '3.8',
		label: 'Derivation',
		section: 'a-picture-is-many-ripples-with-independent-noise-and-their-bits-add'
	},
	{
		anchor: 'eq:capacity',
		chapter: '3.8',
		label: 'Derivation',
		section: 'where-a-ripple-stands-well-above-its-noise-it-carries-log_2-s-bits'
	},
	{
		anchor: 'fig:capacity',
		chapter: '3.8',
		label: 'Background',
		section: 'where-a-ripple-stands-well-above-its-noise-it-carries-log_2-s-bits'
	},
	{ anchor: 'par:the-geometry-of-the-near-field', chapter: 'R3', label: 'Reading' },
	{
		anchor: 'eq:hyperbolic',
		chapter: '3.9',
		label: 'Derivation',
		section: 'the-space-below-a-flat-camera-is-hyperbolic'
	},
	{
		anchor: 'fig:near-field-geometry',
		chapter: '3.9',
		label: 'Background',
		section: 'the-space-below-a-flat-camera-is-hyperbolic'
	},
	{ anchor: 'sec:waves', chapter: 'R7b', label: 'Reading' },
	{
		anchor: 'eq:quadrupole',
		chapter: '7.7',
		label: 'Derivation',
		section:
			'a-compact-source-is-read-at-zero-wavevector-where-its-stress-is-half-the-acceleration-of-its-quadrupole'
	},
	{
		anchor: 'eq:dumbbell',
		chapter: '7.7',
		label: 'Derivation',
		section: 'the-power-is-set-by-the-third-derivative-of-the-quadrupole'
	},
	{
		anchor: 'par:a-compact-body-is-a-point',
		chapter: 'R7b',
		label: 'Reading',
		section: 'a-body-far-smaller-than-its-wave-shows-no-shape'
	},
	{
		anchor: 'eq:unresolved',
		chapter: '7.7',
		label: 'Derivation',
		section: 'a-compact-slow-body-is-a-point-in-its-own-waves'
	},
	{
		anchor: 'par:a-source-larger-than-its-wave',
		chapter: 'R7b',
		label: 'Reading',
		section: 'only-a-source-larger-than-its-wave-shows-a-form'
	},
	{
		anchor: 'eq:wave-zone',
		chapter: '5.2',
		label: 'Derivation',
		section: 'far-away-each-direction-carries-one-ripple-of-the-source'
	},
	{ anchor: 'par:the-polarization-of-an-unresolved-source', chapter: 'R7b', label: 'Reading' },
	{
		anchor: 'fig:quadrupole',
		chapter: '7.7',
		label: 'Live',
		section: 'a-compact-slow-body-is-a-point-in-its-own-waves'
	},
	{
		anchor: 'par:the-sense-of-turning',
		chapter: 'R7b',
		label: 'Reading',
		section: 'the-polarization-of-an-unresolved-rotor-gives-its-sense-of-turning-and-its-tilt'
	},
	{
		anchor: 'eq:rotor-amplitudes',
		chapter: '5.4',
		label: 'Derivation',
		section: 'projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor'
	},
	{
		anchor: 'eq:circular',
		chapter: '5.4',
		label: 'Derivation',
		section: 'four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes'
	},
	{
		anchor: 'fig:polarization',
		chapter: '5.4',
		label: 'Background',
		section: 'four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes'
	},
	{
		anchor: 'par:what-does-not-radiate',
		chapter: 'R7b',
		label: 'Reading',
		section: 'shear-and-lopsided-motion-radiate-and-pressure-does-not'
	},
	{
		anchor: 'fig:which-way',
		chapter: '5.3',
		label: 'Background',
		section: 'beyond-an-opening-a-wave-is-a-sum-of-wavelets-from-every-point-of-it'
	},
	{ anchor: 'sec:thermal', chapter: 'R10', label: 'Reading' },
	{
		anchor: 'par:absorption',
		chapter: 'R10',
		label: 'Reading',
		section: 'a-wave-crossing-matter-fades-at-hawkings-rate'
	},
	{
		anchor: 'eq:damped',
		chapter: '7.8',
		label: 'Derivation',
		section: 'viscosity-fades-a-wave-at-hawkings-rate'
	},
	{
		anchor: 'eq:alpha',
		chapter: '7.8',
		label: 'Derivation',
		section: 'viscosity-fades-a-wave-at-hawkings-rate'
	},
	{
		anchor: 'par:emission',
		chapter: 'R10',
		label: 'Reading',
		section: 'a-wave-crossing-matter-fades-at-hawkings-rate'
	},
	{
		anchor: 'eq:kirchhoff',
		chapter: '10.2',
		label: 'Derivation',
		section:
			'matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more'
	},
	{ anchor: 'fig:line-integral', chapter: '5.5', label: 'Background' },
	{
		anchor: 'fig:closed-furnace',
		chapter: '5.5',
		label: 'Live',
		section: 'when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line'
	},
	{
		anchor: 'par:friction-at-the-frequencies-of-heat',
		chapter: 'R10',
		label: 'Reading',
		section: 'the-friction-at-the-waves-frequency-counts-and-causality-fixes-its-total'
	},
	{
		anchor: 'eq:maxwell',
		chapter: '4.4',
		label: 'Derivation',
		section: 'maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast'
	},
	{
		anchor: 'eq:friction-sum',
		chapter: '4.5',
		label: 'Derivation',
		section: 'causality-fixes-a-materials-total-friction'
	},
	{ anchor: 'tab:materials', chapter: '4.4', label: 'Background' },
	{
		anchor: 'fig:materials',
		chapter: '4.1',
		label: 'Background',
		section: 'only-the-imaginary-part-of-the-response-takes-energy-from-the-push'
	},
	{
		anchor: 'par:a-bound-on-the-glow',
		chapter: 'R10',
		label: 'Reading',
		section: 'no-material-can-glow-brighter-than-its-weight-allows'
	},
	{
		anchor: 'eq:glow-bound',
		chapter: '10.3',
		label: 'Derivation',
		section: 'no-material-can-glow-brighter-than-its-weight-allows'
	},
	{
		anchor: 'par:volume-and-surface-emission',
		chapter: 'R10',
		label: 'Reading',
		section: 'ordinary-bodies-glow-through-their-volume-not-their-surface'
	},
	{
		anchor: 'eq:surface-glow',
		chapter: '10.3',
		label: 'Derivation',
		section: 'ordinary-bodies-glow-through-their-volume-not-their-surface'
	},
	{
		anchor: 'eq:volume-surface',
		chapter: '10.3',
		label: 'Derivation',
		section: 'ordinary-bodies-glow-through-their-volume-not-their-surface'
	},
	{ anchor: 'sec:no-lens', chapter: 'R11', label: 'Reading' },
	{ anchor: 'par:the-optical-constants-of-matter', chapter: '5.1', label: 'Background' },
	{
		anchor: 'eq:index',
		chapter: '7.8',
		label: 'Derivation',
		section:
			'the-pull-of-matter-slows-a-wave-very-slightly-and-its-stiffness-reflects-almost-nothing'
	},
	{
		anchor: 'eq:optics-bound',
		chapter: 'R11',
		label: 'Derivation',
		section: 'every-optical-constant-of-a-body-is-its-compactness-times-factors-below-one'
	},
	{ anchor: 'par:a-black-hole-as-the-lens', chapter: '5.5', label: 'Background' },
	{
		anchor: 'eq:lens-compactness',
		chapter: '5.5',
		label: 'Derivation',
		section:
			'matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact'
	},
	{ anchor: 'par:what-a-lens-would-add', chapter: 'R8', label: 'Reading' },
	{
		anchor: 'fig:black-hole-camera',
		chapter: '11.1',
		label: 'Background',
		section: 'the-tide-outside-a-round-mass-is-exactly-newtons'
	},
	{ anchor: 'par:the-computed-image', chapter: '3.6', label: 'Background' },
	{
		anchor: 'eq:beam',
		chapter: 'R11',
		label: 'Derivation',
		section: 'delaying-and-adding-the-records-is-the-cameras-lens'
	},
	{
		anchor: 'eq:diffraction',
		chapter: '5.3',
		label: 'Derivation',
		section: 'delaying-and-adding-the-records-of-many-pixels-points-the-array'
	},
	{ anchor: 'fig:array', chapter: '5.3', label: 'Live' },
	{ anchor: 'sec:one-pixel', chapter: 'R9', label: 'Reading' },
	{ anchor: 'par:one-complex-matrix', chapter: 'R9', label: 'Reading' },
	{
		anchor: 'eq:W',
		chapter: '1.5b',
		label: 'Derivation',
		section: 'complex-vectors-a-direction-whose-square-is-zero'
	},
	{
		anchor: 'eq:invariants',
		chapter: '9.2',
		label: 'Derivation',
		section: 'two-complex-numbers-fix-the-eigenvalues-of-a-trace-free-three-by-three-table'
	},
	{
		anchor: 'eq:square',
		chapter: '7.6',
		label: 'Derivation',
		section: 'the-magnetic-part-of-a-wave-is-its-tide-turned-by-45'
	},
	{
		anchor: 'eq:one-wave',
		chapter: '9.1',
		label: 'Derivation',
		section: 'the-square-holds-four-numbers-a-direction-and-one-complex-amplitude'
	},
	{ anchor: 'par:principal-null-directions', chapter: 'R9', label: 'Reading' },
	{
		anchor: 'eq:stars',
		chapter: '9.4',
		label: 'Derivation',
		section: 'four-directions-solve-one-quartic'
	},
	{
		anchor: 'eq:one-spin',
		chapter: '8.4',
		label: 'Derivation',
		section: 'one-of-the-four-spins-of-a-reading-points-along-its-super-poynting-vector'
	},
	{ anchor: 'fig:stars', chapter: '9.4', label: 'Live' },
	{ anchor: 'fig:petrov-types', chapter: '9.4', label: 'Background' },
	{ anchor: 'par:shape', chapter: 'R9', label: 'Reading' },
	{ anchor: 'par:the-magnetic-part', chapter: 'R9', label: 'Reading' },
	{
		anchor: 'eq:magnetic-ratio',
		chapter: '7.5',
		label: 'Derivation',
		section: 'a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight'
	},
	{
		anchor: 'par:ten-numbers-four-invariants-an-orientation-a-velocity',
		chapter: 'R9',
		label: 'Reading'
	},
	{
		anchor: 'eq:polar',
		chapter: '9.2',
		label: 'Derivation',
		section: 'every-complex-rotation-is-a-boost-followed-by-a-turn'
	},
	{
		anchor: 'eq:speedometer',
		chapter: '9.3',
		label: 'Derivation',
		section: 'in-a-room-at-rest-a-pixel-reads-its-own-velocity'
	},
	{
		anchor: 'fig:speedometer',
		chapter: '9.3',
		label: 'Live',
		section: 'in-a-room-at-rest-a-pixel-reads-its-own-velocity'
	},
	{ anchor: 'par:the-state-of-a-moving-body', chapter: 'R9', label: 'Reading' },
	{
		anchor: 'eq:star-velocity',
		chapter: '9.4',
		label: 'Derivation',
		section: 'one-pixel-reads-the-whole-state-of-a-moving-body'
	},
	{
		anchor: 'eq:moving-state',
		chapter: '9.4',
		label: 'Derivation',
		section: 'one-pixel-reads-the-whole-state-of-a-moving-body'
	},
	{
		anchor: 'eq:contact',
		chapter: '9.4',
		label: 'Derivation',
		section: 'one-pixel-reads-the-whole-state-of-a-moving-body'
	},
	{ anchor: 'par:separating-waves-at-one-point', chapter: 'R9b', label: 'Reading' },
	{
		anchor: 'eq:pencil',
		chapter: '9.2',
		label: 'Derivation',
		section: 'a-pencil-of-two-tables-has-generalized-eigenvalues'
	},
	{
		anchor: 'eq:four-waves',
		chapter: '9.5',
		label: 'Derivation',
		section: 'four-waves-over-time-leave-one-combination-of-the-readings-empty'
	},
	{
		anchor: 'eq:wave-count',
		chapter: '9.5',
		label: 'Derivation',
		section: 'all-three-cases-are-pronys-problem-and-counting-gives-the-limit'
	},
	{
		anchor: 'fig:voices',
		chapter: '9.5',
		label: 'Live',
		section: 'all-three-cases-are-pronys-problem-and-counting-gives-the-limit'
	},
	{ anchor: 'par:lensed-images-at-one-point', chapter: '9.5', label: 'Background' },
	{ anchor: 'par:what-one-pixel-sees-of-the-sky', chapter: '9.1', label: 'Background' },
	{
		anchor: 'eq:pixel-kernel',
		chapter: '9.6',
		label: 'Derivation',
		section: 'the-pixel-sees-the-sky-only-up-to-degree-four-68-numbers'
	},
	{
		anchor: 'eq:sky-count',
		chapter: '9.6',
		label: 'Derivation',
		section: 'the-pixel-sees-the-sky-only-up-to-degree-four-68-numbers'
	},
	{
		anchor: 'eq:sky-witness',
		chapter: '9.6',
		label: 'Derivation',
		section: 'a-sky-obeys-an-inequality-that-a-standing-wave-breaks'
	},
	{
		anchor: 'fig:sky-count',
		chapter: '9.6',
		label: 'Live',
		section: 'twelve-sources-look-to-the-pixel-like-a-uniform-sky'
	},
	{ anchor: 'par:ranging-a-wave-source', chapter: '9.1', label: 'Background' },
	{
		anchor: 'eq:ranging-instant',
		chapter: '9.7',
		label: 'Derivation',
		section: 'a-nearby-source-spoils-the-square-only-at-second-order'
	},
	{
		anchor: 'eq:ranging-C',
		chapter: '9.7',
		label: 'Derivation',
		section: 'a-nearby-source-spoils-the-square-only-at-second-order'
	},
	{
		anchor: 'eq:helicity-split',
		chapter: '9.7',
		label: 'Derivation',
		section: 'the-two-frequency-parts-tilt-apart-and-the-angle-between-them-ranges-the-source'
	},
	{
		anchor: 'fig:ranging',
		chapter: '9.7',
		label: 'Live',
		section: 'the-two-frequency-parts-tilt-apart-and-the-angle-between-them-ranges-the-source'
	},
	{ anchor: 'par:the-absence-of-gravitational-aberration', chapter: '5.2', label: 'Background' },
	{
		anchor: 'fig:present',
		chapter: '6.3',
		label: 'Live',
		section: 'the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now'
	},
	{
		anchor: 'par:tests-of-general-relativity-from-one-reading',
		chapter: '9.7',
		label: 'Background'
	},
	{
		anchor: 'eq:bianchi-wave',
		chapter: '9.7',
		label: 'Derivation',
		section: 'the-second-bianchi-identity-ties-a-metric-waves-magnetic-part-to-its-tide'
	},
	{
		anchor: 'eq:wave-vector',
		chapter: '9.7',
		label: 'Derivation',
		section: 'summing-cross-products-of-the-columns-gives-the-waves-direction-and-speed'
	},
	{
		anchor: 'fig:beyond',
		chapter: '9.7',
		label: 'Live',
		section: 'a-massive-graviton-and-a-massive-scalar-differ-in-the-sign-of-one-ratio'
	},
	{
		anchor: 'par:matter-at-the-pixel',
		chapter: '6.5',
		label: 'Background',
		section: 'what-gravitates-is-the-energy-plus-the-sum-of-the-stresses'
	},
	{ anchor: 'par:what-no-reading-can-tell', chapter: 'R9b', label: 'Reading' },
	{ anchor: 'par:one-pixel-and-many', chapter: 'R9b', label: 'Reading' },
	{ anchor: 'fig:two-pixels', chapter: '9.7', label: 'Background' },
	{ anchor: 'par:variation-across-the-array', chapter: '8.6', label: 'Background' },
	{
		anchor: 'par:depth',
		chapter: '5.3',
		label: 'Background',
		section: 'a-near-source-needs-the-delays-from-a-point'
	},
	{
		anchor: 'eq:one-pixel-range',
		chapter: 'R9b',
		label: 'Derivation',
		section: 'neighbours-give-depth-and-the-magnetic-part-ranges-a-moving-mass'
	},
	{ anchor: 'par:front-and-back', chapter: 'R9', label: 'Reading' },
	{ anchor: 'par:three-dimensions', chapter: '5.6', label: 'Background' },
	{ anchor: 'par:precision', chapter: '9.7', label: 'Background' },
	{ anchor: 'par:separation-with-noise', chapter: '9.7', label: 'Background' },
	{ anchor: 'par:precision-of-depth', chapter: 'R9b', label: 'Reading' },
	{
		anchor: 'eq:depth-bound',
		chapter: 'R9b',
		label: 'Derivation',
		section: 'the-neighbours-range-a-mass-to-a-part-in-a-million-and-masses-on-one-line-read-as-one'
	},
	{
		anchor: 'eq:magnetic-range',
		chapter: 'R9b',
		label: 'Derivation',
		section: 'the-neighbours-range-a-mass-to-a-part-in-a-million-and-masses-on-one-line-read-as-one'
	},
	{
		anchor: 'fig:separation-noise',
		chapter: 'R9b',
		label: 'Background',
		section: 'the-second-derivatives-tell-two-bodies-on-one-line-from-one'
	},
	{ anchor: 'tab:one-pixel', chapter: '9.7', label: 'Background' },
	{ anchor: 'sec:first-image', chapter: 'R10b', label: 'Reading' },
	{
		anchor: 'eq:column',
		chapter: '5.5',
		label: 'Derivation',
		section: 'when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line'
	},
	{
		anchor: 'fig:earth-glow',
		chapter: '5.6',
		label: 'Background',
		section: 'a-boundary-shows-as-a-kink-at-an-angle-that-only-geometry-sets'
	},
	{
		anchor: 'par:the-graviton-budget',
		chapter: 'R10b',
		label: 'Reading',
		section: 'the-budget-runs-from-a-second-to-a-hundred-and-ten-million-years'
	},
	{
		anchor: 'tab:budget',
		chapter: 'R10b',
		label: 'Background',
		section: 'the-budget-runs-from-a-second-to-a-hundred-and-ten-million-years'
	},
	{
		anchor: 'fig:budget',
		chapter: 'R10b',
		label: 'Background',
		section: 'the-budget-runs-from-a-second-to-a-hundred-and-ten-million-years'
	},
	{
		anchor: 'par:recovering-the-layers',
		chapter: 'R10b',
		label: 'Reading',
		section: 'one-camera-peels-the-layers-and-the-heights-measure-friction-times-temperature-cubed'
	},
	{
		anchor: 'eq:abel',
		chapter: '5.6',
		label: 'Derivation',
		section: 'from-the-surface-of-a-round-planet-each-line-of-sight-is-a-chord'
	},
	{
		anchor: 'eq:abel-inverse',
		chapter: '5.6',
		label: 'Derivation',
		section: 'the-transform-can-be-undone'
	},
	{
		anchor: 'eq:jN-friction',
		chapter: '5.5',
		label: 'Derivation',
		section: 'a-materials-brightness-is-its-friction-times-a-power-of-its-temperature'
	},
	{
		anchor: 'par:what-the-earths-materials-allow',
		chapter: 'R10b',
		label: 'Reading',
		section: 'the-moon-is-faint-and-every-brightness-of-the-earth-is-an-upper-bound'
	},
	{
		anchor: 'fig:earth-inverted',
		chapter: '5.6',
		label: 'Background',
		section: 'uniform-shells-are-peeled-from-the-outside-in'
	},
	{
		anchor: 'par:arrival-and-absorption',
		chapter: 'R10b',
		label: 'Reading',
		section: 'no-detector-made-of-matter-could-catch-these-gravitons'
	},
	{
		anchor: 'par:counting-or-recording',
		chapter: 'R10b',
		label: 'Reading',
		section: 'recording-adds-half-a-quantum-so-a-thermal-camera-must-count'
	},
	{ anchor: 'sec:affordances', chapter: 'R12', label: 'Reading' },
	{ anchor: 'tab:affordances', chapter: '6.5', label: 'Background' },
	{ anchor: 'tab:null', chapter: '2.5', label: 'Background' },
	{ anchor: 'sec:vistas', chapter: 'R12', label: 'Reading' },
	{
		anchor: 'par:a-pair-of-black-holes-from-the-near-zone-to-the-wave-zone',
		chapter: '12.1',
		label: 'Background'
	},
	{
		anchor: 'eq:multipole',
		chapter: '7.7',
		label: 'Derivation',
		section: 'one-solution-runs-from-newtons-pull-near-the-source-to-the-wave-far-away'
	},
	{
		anchor: 'fig:binary-field',
		chapter: '7.7',
		label: 'Background',
		section: 'one-solution-runs-from-newtons-pull-near-the-source-to-the-wave-far-away'
	},
	{ anchor: 'par:memory', chapter: '7.8', label: 'Background' },
	{
		anchor: 'eq:memory',
		chapter: '7.8',
		label: 'Derivation',
		section: 'a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good'
	},
	{
		anchor: 'eq:merger-memory',
		chapter: '7.8',
		label: 'Derivation',
		section: 'the-waves-own-energy-leaves-a-memory-too'
	},
	{
		anchor: 'par:an-exploding-star',
		chapter: '6.4',
		label: 'Background',
		section: 'a-bodys-mass-is-its-total-energy-so-heat-has-weight'
	},
	{
		anchor: 'eq:burst-memory',
		chapter: '7.8',
		label: 'Derivation',
		section: 'a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good'
	},
	{
		anchor: 'fig:memory',
		chapter: '7.8',
		label: 'Background',
		section: 'the-waves-own-energy-leaves-a-memory-too'
	},
	{ anchor: 'par:the-milky-way', chapter: '12.1', label: 'Background' },
	{ anchor: 'fig:milky-way', chapter: '12.1', label: 'Background' },
	{
		anchor: 'par:a-primordial-graviton-background',
		chapter: '6.3',
		label: 'Background',
		section: 'a-moving-black-body-is-still-a-black-body-hotter-ahead'
	},
	{
		anchor: 'eq:graviton-temperature',
		chapter: '12.2',
		label: 'Derivation',
		section: 'gravitons-parted-first-and-kept-a-colder-share-of-the-heat'
	},
	{ anchor: 'fig:graviton-sky', chapter: '12.2', label: 'Background' },
	{ anchor: 'fig:black-hole', chapter: '11.1', label: 'Background' },
	{
		anchor: 'par:a-freely-falling-camera',
		chapter: '6.3',
		label: 'Background',
		section: 'a-moving-observers-sky-crowds-toward-the-direction-of-motion'
	},
	{
		anchor: 'par:through-a-room-at-nearly-the-speed-of-light',
		chapter: '6.1',
		label: 'Background'
	},
	{ anchor: 'par:counting-coincidences', chapter: 'R8', label: 'Reading' },
	{ anchor: 'par:a-cosmic-string', chapter: '6.1', label: 'Background' },
	{
		anchor: 'par:the-transparent-sun-as-a-lens',
		chapter: '5.3',
		label: 'Background',
		section: 'behind-a-point-mass-a-wave-is-brightened-on-the-axis-by-a-factor-set-by-one-number'
	},
	{
		anchor: 'fig:sun-lens',
		chapter: 'R12b',
		label: 'Background',
		section: 'the-transparent-sun-focuses-only-waves-above-8-khz'
	},
	{
		anchor: 'par:scattering-earthquakes-and-tails',
		chapter: '5.2',
		label: 'Background',
		section: 'in-the-field-of-a-mass-a-burst-arrives-followed-by-a-tail'
	},
	{ anchor: 'sec:hair', chapter: 'R13', label: 'Reading' },
	{ anchor: 'par:the-field-at-one-time', chapter: 'R13', label: 'Reading' },
	{
		anchor: 'par:the-number-of-bits',
		chapter: 'R13',
		label: 'Reading',
		section: 'one-reading-holds-about-1200-bits-of-a-body-and-seven-numbers-of-a-black-hole'
	},
	{
		anchor: 'eq:hair-bits',
		chapter: '3.8',
		label: 'Derivation',
		section: 'a-bodys-field-at-one-time-holds-about-1200-bits-from-three-radii-away'
	},
	{
		anchor: 'fig:hair',
		chapter: '13.1',
		label: 'Background',
		section: 'two-weighings-of-two-copies-read-the-even-part-and-the-odd-part'
	},
	{ anchor: 'sec:second-order', chapter: 'R13', label: 'Reading' },
	{
		anchor: 'par:the-field-at-two-times',
		chapter: 'R13',
		label: 'Reading',
		section: 'at-two-times-the-readings-hold-a-bracket-and-products-of-tides-build-every-ripple'
	},
	{
		anchor: 'eq:hair-commutator',
		chapter: '8.2',
		label: 'Derivation',
		section: 'two-moments-of-a-body-do-not-commute'
	},
	{
		anchor: 'eq:dust',
		chapter: '4.5',
		label: 'Derivation',
		section: 'driven-faster-than-its-bonds-every-body-answers-as-dust'
	},
	{
		anchor: 'eq:calderon',
		chapter: '13.2',
		label: 'Derivation',
		section: 'two-harmonic-exponentials-multiply-into-any-ripple'
	},
	{
		anchor: 'par:the-two-readings-as-one-transform',
		chapter: 'R13',
		label: 'Reading',
		section: 'at-two-times-the-readings-hold-a-bracket-and-products-of-tides-build-every-ripple'
	},
	{
		anchor: 'eq:scene-transform',
		chapter: '13.2',
		label: 'Derivation',
		section: 'a-flat-camera-reads-the-transform-on-a-cone-at-one-time-and-inside-it-at-two'
	},
	{
		anchor: 'eq:cone',
		chapter: '13.2',
		label: 'Derivation',
		section: 'a-flat-camera-reads-the-transform-on-a-cone-at-one-time-and-inside-it-at-two'
	},
	{
		anchor: 'fig:two-readings',
		chapter: '13.2',
		label: 'Background',
		section: 'a-flat-camera-reads-the-transform-on-a-cone-at-one-time-and-inside-it-at-two'
	},
	{
		anchor: 'par:stability',
		chapter: 'R13',
		label: 'Reading',
		section: 'at-two-times-the-readings-hold-a-bracket-and-products-of-tides-build-every-ripple'
	},
	{
		anchor: 'par:an-impulsive-tide-and-a-weighing',
		chapter: 'R13',
		label: 'Reading',
		section: 'sixteen-weighings-read-one-ripple-and-the-weight-changes-by-five-parts-in-10⁴¹'
	},
	{
		anchor: 'eq:push',
		chapter: '1.7',
		label: 'Derivation',
		section: 'an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass'
	},
	{
		anchor: 'par:a-mass-that-passes',
		chapter: 'R13',
		label: 'Reading',
		section: 'a-passing-mass-reads-the-projected-body-with-nothing-weighed'
	},
	{
		anchor: 'eq:pass',
		chapter: '1.8',
		label: 'Derivation',
		section: 'what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass'
	},
	{
		anchor: 'fig:passing',
		chapter: '1.8',
		label: 'Live',
		section: 'what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass'
	},
	{
		anchor: 'eq:shock',
		chapter: '6.4',
		label: 'Derivation',
		section: 'a-sideways-kick-that-keeps-q-fixes-the-energy-gained'
	},
	{
		anchor: 'eq:shock-even',
		chapter: '13.5',
		label: 'Derivation',
		section: 'a-wave-and-its-reverse-together-always-give-energy'
	},
	{
		anchor: 'eq:massless-pass',
		chapter: '13.5',
		label: 'Derivation',
		section:
			'a-particle-without-mass-reads-the-interior-as-newtons-passing-tonne-does-with-twice-the-kick'
	},
	{
		anchor: 'par:the-bits-of-a-second-reading',
		chapter: 'R13',
		label: 'Reading',
		section: 'a-second-reading-holds-a-volumes-worth-of-moments-but-the-papers-bits-include-a-price'
	},
	{
		anchor: 'par:what-a-tide-of-a-given-degree-reaches',
		chapter: 'R13',
		label: 'Reading',
		section: 'a-tide-of-degree-m-reaches-m-rungs-of-the-ladder'
	},
	{
		anchor: 'eq:ladder',
		chapter: '13.3',
		label: 'Derivation',
		section:
			'polynomials-killed-by-repeated-laplacians-are-harmonic-ones-times-even-powers-of-the-radius'
	},
	{
		anchor: 'eq:ladder-identity',
		chapter: '13.3',
		label: 'Derivation',
		section: 'no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read'
	},
	{ anchor: 'fig:ladder', chapter: '13.3', label: 'Background' },
	{
		anchor: 'par:the-flow',
		chapter: 'R13',
		label: 'Reading',
		section: 'the-moments-and-the-weight-generate-everything-but-watching-alone-cannot-read-it'
	},
	{
		anchor: 'eq:flow-bracket',
		chapter: '13.4',
		label: 'Derivation',
		section: 'the-bracket-of-two-rates-is-an-integral-of-the-flow'
	},
	{
		anchor: 'eq:hidden-spin',
		chapter: '13.4',
		label: 'Derivation',
		section: 'octupolar-tides-read-the-hidden-swirl'
	},
	{
		anchor: 'fig:hidden-flow',
		chapter: '2.8',
		label: 'Live',
		section: 'a-swirl-shows-through-its-angular-momentum-and-two-swirls-can-cancel'
	},
	{
		anchor: 'par:the-algebra-of-the-moments-and-the-energy',
		chapter: 'R13',
		label: 'Reading',
		section: 'the-moments-and-the-weight-generate-everything-but-watching-alone-cannot-read-it'
	},
	{
		anchor: 'eq:moment-bracket',
		chapter: '13.6',
		label: 'Derivation',
		section: 'to-order-1c²-the-moments-of-the-energy-do-not-commute'
	},
	{ anchor: 'sec:hole', chapter: 'R13b', label: 'Reading' },
	{
		anchor: 'par:the-response-of-a-black-hole-to-a-tide',
		chapter: 'R13b',
		label: 'Reading',
		section: 'a-hole-raises-no-bulge-and-its-quadrupole-answers-a-changing-tide-with-friction-alone'
	},
	{
		anchor: 'eq:horizon-friction',
		chapter: '11.4',
		label: 'Derivation',
		section: 'a-changing-tide-loses-energy-through-the-horizon'
	},
	{ anchor: 'fig:hole-tide', chapter: '11.4', label: 'Background' },
	{
		anchor: 'par:the-fluctuations-of-a-black-holes-quadrupole',
		chapter: 'R13b',
		label: 'Reading',
		section: 'the-quadrupole-trembles-at-the-hawking-temperature-and-the-tremor-gives-back-the-mass'
	},
	{
		anchor: 'eq:hole-noise',
		chapter: '11.4',
		label: 'Derivation',
		section: 'the-friction-trembles-at-the-holes-temperature'
	},
	{
		anchor: 'eq:hole-thermometer',
		chapter: '11.4',
		label: 'Derivation',
		section: 'the-friction-trembles-at-the-holes-temperature'
	},
	{
		anchor: 'fig:hole-response',
		chapter: '13.7',
		label: 'Live',
		section: 'the-friction-would-make-the-hole-yield-like-a-liquid-yet-its-love-number-is-zero'
	},
	{
		anchor: 'par:the-weight-of-a-black-holes-response',
		chapter: 'R13b',
		label: 'Reading',
		section:
			'a-hole-weighs-like-a-shell-a-little-outside-its-horizon-yet-its-sums-belong-to-no-body'
	},
	{
		anchor: 'eq:hole-sum-rule',
		chapter: '13.7',
		label: 'Derivation',
		section: 'a-holes-response-has-the-weight-of-a-shell-a-little-outside-its-horizon'
	},
	{ anchor: 'tab:hair', chapter: 'R13b', label: 'Background' },
	{ anchor: 'sec:holography', chapter: 'R13b', label: 'Reading' },
	{
		anchor: 'par:black-holes-and-the-classical-limit',
		chapter: 'R13b',
		label: 'Reading',
		section: 'looking-gives-a-surfaces-worth-and-pushing-gives-the-inside-slowly'
	},
	{
		anchor: 'par:what-gravity-cannot-decohere',
		chapter: 'R13b',
		label: 'Reading',
		section: 'a-ball-and-a-shell-leave-gravity-no-record-yet-differ-in-their-diósipenrose-energy'
	},
	{
		anchor: 'eq:dp-energy',
		chapter: '13.8',
		label: 'Derivation',
		section: 'gravity-cannot-decohere-a-ball-and-a-shell'
	},
	{ anchor: 'sec:conclusion', chapter: 'R13b', label: 'Reading' },
	{ anchor: 'sec:status', chapter: 'R13b', label: 'Reading' },
	{ anchor: 'app:benchmarks', chapter: '3.1', label: 'Background' },
	{ anchor: 'par:separation-with-noise-2', chapter: '9.7', label: 'Background' },
	{
		anchor: 'par:depth-with-noise',
		chapter: 'A.1',
		label: 'Background',
		section: 'field-and-gradient-range-one-mass'
	},
	{ anchor: 'par:the-worked-inversion', chapter: '3.3', label: 'Background' },
	{ anchor: 'par:the-trembling-lattice', chapter: '3.4', label: 'Background' },
	{
		anchor: 'eq:jitter-bounds',
		chapter: '8.7',
		label: 'Derivation',
		section: 'the-static-jitter-lies-between-two-bounds'
	},
	{ anchor: 'app:proofs', chapter: '1.7', label: 'Background' },
	{
		anchor: 'par:the-principal-null-directions-of-a-moving-body',
		chapter: '6.1',
		label: 'Background'
	},
	{
		anchor: 'eq:proof-stars',
		chapter: '6.3',
		label: 'Derivation',
		section:
			'one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated'
	},
	{
		anchor: 'eq:proof-midpoint',
		chapter: '9.4',
		label: 'Derivation',
		section: 'one-pixel-reads-the-whole-state-of-a-moving-body'
	},
	{ anchor: 'par:the-count-of-waves', chapter: '9.5', label: 'Background' },
	{
		anchor: 'eq:proof-prony',
		chapter: '9.5',
		label: 'Derivation',
		section: 'all-three-cases-are-pronys-problem-and-counting-gives-the-limit'
	},
	{
		anchor: 'par:the-moments-and-the-weight',
		chapter: '13.6',
		label: 'Background',
		section: 'the-moments-and-the-energy-generate-everything-that-can-be-known-of-a-body'
	},
	{
		anchor: 'par:the-reach-of-a-tide-of-given-degree',
		chapter: '2.2',
		label: 'Background',
		section: 'there-are-2ell-1-patterns-of-each-degree'
	},
	{
		anchor: 'eq:proof-ladder',
		chapter: '13.3',
		label: 'Derivation',
		section: 'every-polynomial-on-the-ladder-is-reached'
	},
	{ anchor: 'par:what-the-passes-of-a-mass-determine', chapter: '2.6', label: 'Background' },
	{ anchor: 'par:the-energy-given-by-an-impulsive-wave', chapter: '6.2', label: 'Background' },
	{
		anchor: 'eq:proof-shock',
		chapter: '6.4',
		label: 'Derivation',
		section: 'a-sideways-kick-that-keeps-q-fixes-the-energy-gained'
	},
	{
		anchor: 'eq:proof-mass',
		chapter: '6.4',
		label: 'Derivation',
		section: 'a-bodys-rest-mass-in-light-cone-form-is-a-sum-and-a-weighted-variance'
	}
];
