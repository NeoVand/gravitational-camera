// Shared numbers for the three diagrams of the tutorial's chapter 11.3 (tutorial/black-holes/hawking.md):
// tut-hawking-ladder, tut-hawking-mode and tut-hawking-greybody. Not a figure itself. The sheet, strokes, labels and
// cropping are chapters 1.2 to 11.2's (figs/tut-pot-lib.js), the plots and axes chapter 3.1's (figs/tut-prob-lib.js),
// hbar, k_B and c chapter 10.1's (figs/tut-planck-lib.js), G chapter 3.6's (figs/tut-measure-lib.js, the app's
// 6.6743 x 10^-11), the Sun's mass chapter 9.2's (figs/tut-quadrupole-lib.js), and the hole's fill, the light role's
// colour and the role check chapter 11.1's (figs/tut-schw-lib.js), all imported, not copied.
//
// The colours: the hole's own emission in the light role's colour, as chapter 11.1's rays; the masses of holes and
// bodies (M_eq, the Moon, the Earth, the Sun, Sgr A*) in matter's, as the chapter writes M; the curve l = 2 and Page's
// limit in ink, the other degrees in the page's grey, since the greybody factor is neutral in the chapter's equations
// and the figures' one accent, orange, means a stretch; everything else in ink and the page's greys. Orange and blue,
// which mean a stretch and a squeeze, are not used.
//
// The greybody factors: GREYBODY below is read out of the chapter's interactive figure's table
// (app/src/lib/tutorial/live/hole-against-sky-data.ts, from reference/gravcam/greybody/, the Regge-Wheeler equation
// solved by numbers, flux conserved to 10^-6), which this file cannot import, being plain JavaScript in the page: the
// rows of l = 2 to 17, on the table's first 250 values of x, 0.01 to 2.00 in hundredths and 2.02 to 3.00 in fiftieths,
// six significant figures, unchanged. As there, Gamma_l is 0 below a row's stretch and 1 above it; the degrees 18 to 33
// stay below 10^-7 for every x <= 3. `share` is hole-against-sky.ts's SHARE, sum (2l + 1) Gamma_l / 27 x^2, the
// absorption cross-section over the capture area, on the same values of x.
//
// `chapter(check)` asserts against the chapter's own text (outside its comments) every statement that a figure draws or
// its caption prints, and computes the numbers behind them:
//  - k_B T_H = hbar c^3 / 8 pi G M: 1.227 x 10^23 kg K over M, so 4.50 x 10^22 kg at 2.7255 K (three times less than
//    M_eq), M_eq = 1.356 x 10^23 kg at 0.905 K (1.85 Moons), 6.2 x 10^-8 K for the Sun (44 million times colder than
//    2.7255 K), 1.2 x 10^11 K for 10^12 kg; the ladder's ends, 1.2 x 10^12 K at 10^11 kg and 6.2 x 10^-18 K at
//    10^10 M_sun = 2 x 10^40 kg;
//  - the bookkeeping n_out = (1 - Gamma) n_bg + Gamma n_H = n_bg + Gamma (n_H - n_bg): 0.6 + 0.12 = 0.72 for Gamma = 0.4,
//    n_bg = 1 and n_H = 0.3, and the absorbed 0.4 and scattered 0.6 adding to the 1 that comes in;
//  - the table: Gamma_2(0.1) = 3.1 x 10^-6, Gamma_2(0.3) = 0.055, Page's 256 x^6 / 225 within 7% of Gamma_2 at x = 0.01
//    and below it everywhere drawn; each Gamma_l between 0 and 1 and never falling; sigma_abs / 27 pi (GM/c^2)^2 above 0.9 from
//    x = 0.86, within 6% of 1 from x = 1, and from x = 1.4 swinging about 1 between 0.957 and 1.006.
import { HBAR, KB, C, palette } from './tut-planck-lib.js';
import { G } from './tut-measure-lib.js';
import { M_SUN } from './tut-quadrupole-lib.js';
import { LIGHT, HOLE } from './tut-schw-lib.js';
import { MATTER } from './tut-null-lib.js';

export { HBAR, KB, C, G, M_SUN, LIGHT, HOLE, MATTER, palette };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the hole's temperature -----------------------------------------------------------------------------------------
/** hbar c^3 / 8 pi G k_B, kg K: a hole of M kilograms is at this over M kelvin. */
export const MASS_KELVIN = (HBAR * C ** 3) / (8 * Math.PI * G * KB);
/** The Hawking temperature of a hole of M kilograms, K. */
export const hawking = (M) => MASS_KELVIN / M;
/** The mass whose Hawking temperature is T kelvin. */
export const massAt = (T) => MASS_KELVIN / T;
export const GRAVITON_SKY = 0.905, MICROWAVE_SKY = 2.7255;     // K
export const M_EQ = massAt(GRAVITON_SKY);                      // 1.356 x 10^23 kg
export const M_CMB = massAt(MICROWAVE_SKY);                    // 4.50 x 10^22 kg
/** The bodies of the ladder, kg: the Moon and the Earth (IAU), the Sun, and Sgr A* at 4 x 10^6 solar masses. */
export const BODIES = [
	{ key: 'moon', name: '\\text{Moon}', M: 7.342e22 },
	{ key: 'earth', name: '\\text{Earth}', M: 5.972e24 },
	{ key: 'sun', name: '\\text{Sun}', M: M_SUN },
	{ key: 'sgr', name: '\\text{Sgr A}^*', M: 4e6 * M_SUN }
];
/** The ladder's ends, kg: 10^11 kg and 10^10 solar masses. */
export const LADDER = [1e11, 1e10 * M_SUN];

// ---- one mode's bookkeeping -----------------------------------------------------------------------------------------
export const MODE = { Gamma: 0.4, nbg: 1, nH: 0.3 };
export const book = ({ Gamma, nbg, nH } = MODE) => ({
	in: nbg, absorbed: Gamma * nbg, scattered: (1 - Gamma) * nbg, emitted: Gamma * nH,
	out: (1 - Gamma) * nbg + Gamma * nH, outFactored: nbg + Gamma * (nH - nbg)
});

// ---- the greybody table ---------------------------------------------------------------------------------------------
/** The table's first 250 values of x = GM omega / c^3: 0.01 to 2.00 in hundredths, 2.02 to 3.00 in fiftieths. */
export const X = Array.from({ length: 250 }, (_, i) => (i < 200 ? (i + 1) / 100 : 2 + (i - 199) / 50));
/** Page's long-wave limit of Gamma_2. */
export const page = (x) => (256 / 225) * x ** 6;
export const GREYBODY = [
	{ l: 2, from: 0, values: [
		1.21721e-12, 8.40217e-11, 1.03999e-9, 6.39459e-9, 2.68744e-8, 8.89757e-8, 2.50294e-7, 6.25789e-7, 0.00000143144, 0.00000305512, 0.00000616958, 0.0000119096,
		0.0000221466, 0.0000399079, 0.0000700135, 0.000120029, 0.000201688, 0.000332986, 0.000541255, 0.000867629, 0.00137349, 0.00214969, 0.00332954, 0.005107,
		0.00776147, 0.0116908, 0.0174533, 0.0258182, 0.037818, 0.0547905, 0.0783808, 0.110459, 0.152889, 0.20711, 0.273536, 0.350954,
		0.436224, 0.524603, 0.610715, 0.689793, 0.758626, 0.815852, 0.861677, 0.897309, 0.924406, 0.944678, 0.95967, 0.970667,
		0.97869, 0.984525, 0.98876, 0.991831, 0.994057, 0.995672, 0.996845, 0.997697, 0.998316, 0.998768, 0.999097, 0.999338,
		0.999514, 0.999643, 0.999738, 0.999807, 0.999858, 0.999896, 0.999923, 0.999943, 0.999958, 0.999969, 0.999977, 0.999983,
		0.999987, 0.999991, 0.999993, 0.999995, 0.999996
	] },
	{ l: 3, from: 0, values: [
		2.7583e-19, 7.60449e-17, 2.1133e-15, 2.304e-14, 1.50838e-13, 7.16707e-13, 2.73416e-12, 8.89383e-12, 2.56418e-11, 6.72747e-11, 1.63655e-10, 3.74245e-10,
		8.1292e-10, 1.69079e-9, 3.38865e-9, 6.57744e-9, 1.24155e-8, 2.2867e-8, 4.12114e-8, 7.28466e-8, 1.26547e-7, 2.16416e-7, 3.64887e-7, 6.07315e-7,
		9.98938e-7, 0.00000162539, 0.00000261845, 0.00000417957, 0.00000661472, 0.000010386, 0.0000161874, 0.0000250559, 0.0000385332, 0.0000589016, 0.0000895241, 0.000135337,
		0.000203557, 0.000304694, 0.000454002, 0.000673537, 0.000995083, 0.00146427, 0.00214637, 0.00313433, 0.00455992, 0.0066089, 0.00954127, 0.0137178,
		0.0196331, 0.0279549, 0.039565, 0.0555922, 0.0774198, 0.106633, 0.144864, 0.193503, 0.253248, 0.323604, 0.402513, 0.486371,
		0.570585, 0.65053, 0.722506, 0.784311, 0.835283, 0.875956, 0.907579, 0.931681, 0.94978, 0.963225, 0.973138, 0.980408,
		0.985721, 0.989596, 0.992418, 0.994473, 0.995969, 0.997059, 0.997853, 0.998432, 0.998854, 0.999162, 0.999388, 0.999552,
		0.999672, 0.99976, 0.999824, 0.999871, 0.999905, 0.99993, 0.999949, 0.999962, 0.999972, 0.999979, 0.999984, 0.999988,
		0.999991, 0.999993, 0.999995, 0.999996, 0.999997, 0.999998, 0.999999, 0.999999, 0.999999, 0.999999, 1, 1,
		1, 1
	] },
	{ l: 4, from: 0, values: [
		6.25273e-26, 6.89027e-23, 4.30373e-21, 8.33026e-20, 8.50785e-19, 5.81078e-18, 3.01128e-17, 1.27663e-16, 4.64762e-16, 1.50172e-15, 4.40895e-15, 1.19667e-14,
		3.04212e-14, 7.31698e-14, 1.67842e-13, 3.69535e-13, 7.84971e-13, 1.61566e-12, 3.23366e-12, 6.31225e-12, 1.20483e-11, 2.25354e-11, 4.13827e-11, 7.47297e-11,
		1.32895e-10, 2.33028e-10, 4.03343e-10, 6.89813e-10, 1.1667e-9, 1.95298e-9, 3.23781e-9, 5.3198e-9, 8.66713e-9, 1.40093e-8, 2.24763e-8, 3.58086e-8,
		5.66726e-8, 8.91336e-8, 1.3936e-7, 2.16668e-7, 3.35075e-7, 5.15578e-7, 7.89514e-7, 0.00000120348, 0.00000182654, 0.00000276069, 0.00000415607, 0.00000623311,
		0.00000931435, 0.0000138705, 0.0000205865, 0.0000304566, 0.0000449203, 0.0000660564, 0.0000968598, 0.000141636, 0.000206558, 0.000300462, 0.000435966, 0.000631043,
		0.000911249, 0.00131283, 0.00188704, 0.00270619, 0.00387194, 0.00552655, 0.00786821, 0.0111711, 0.0158111, 0.022298, 0.0313113, 0.0437374,
		0.060696, 0.0835379, 0.113784, 0.152963, 0.202324, 0.262413, 0.332611, 0.410816, 0.4935, 0.576254, 0.654683, 0.72529,
		0.78599, 0.836158, 0.876298, 0.9076, 0.931531, 0.949558, 0.962989, 0.972918, 0.980219, 0.985567, 0.989475, 0.992328,
		0.994407, 0.995923, 0.997027, 0.997832, 0.998419, 0.998847, 0.999158, 0.999385, 0.999551, 0.999671, 0.999759, 0.999824,
		0.99987, 0.999905, 0.99993, 0.999948, 0.999961, 0.999971, 0.999979, 0.999984, 0.999988, 0.999991, 0.999994, 0.999995,
		0.999997, 0.999998, 0.999998, 0.999999, 0.999999, 0.999999, 1, 1, 1, 1, 1, 1
	] },
	{ l: 5, from: 56, values: [
		1.05917e-7, 1.59057e-7, 2.38129e-7, 3.55459e-7, 5.2909e-7, 7.85374e-7, 0.00000116271, 0.00000171694, 0.0000025291, 0.00000371653, 0.00000544885, 0.00000797075,
		0.0000116345, 0.0000169466, 0.0000246334, 0.0000357353, 0.0000517398, 0.0000747701, 0.000107851, 0.000155288, 0.000223195, 0.000320244, 0.000458715, 0.000655971,
		0.000936516, 0.00133487, 0.00189957, 0.00269869, 0.00382741, 0.00541838, 0.00765557, 0.0107927, 0.0151767, 0.0212773, 0.0297209, 0.041326,
		0.0571322, 0.0784057, 0.106597, 0.143214, 0.189574, 0.246431, 0.313525, 0.389216, 0.470419, 0.552994, 0.632537, 0.70528,
		0.768728, 0.821836, 0.864788, 0.898581, 0.924601, 0.944313, 0.959065, 0.970008, 0.978076, 0.983998, 0.988332, 0.991497,
		0.993806, 0.995489, 0.996715, 0.997607, 0.998257, 0.99873, 0.999074, 0.999324, 0.999506, 0.999639, 0.999736, 0.999806,
		0.999858, 0.999895, 0.999923, 0.999943, 0.999958, 0.999969, 0.999977, 0.999983, 0.999988, 0.999991, 0.999994, 0.999995,
		0.999997, 0.999998, 0.999998, 0.999999, 0.999999, 0.999999, 0.999999, 1, 1, 1, 1, 1,
		1, 1
	] },
	{ l: 6, from: 75, values: [
		1.08115e-7, 1.59135e-7, 2.33756e-7, 3.42688e-7, 5.01414e-7, 7.32287e-7, 0.00000106752, 0.00000155346, 0.00000225672, 0.00000327286, 0.00000473882, 0.00000685049,
		0.00000988779, 0.0000142501, 0.0000205065, 0.0000294666, 0.0000422814, 0.0000605839, 0.0000866895, 0.000123876, 0.000176778, 0.000251941, 0.000358601, 0.000509767,
		0.000723746, 0.00102626, 0.00145339, 0.00205565, 0.00290363, 0.00409568, 0.00576831, 0.00811027, 0.0113809, 0.0159336, 0.0222452, 0.0309492,
		0.0428701, 0.0590505, 0.0807536, 0.109417, 0.146523, 0.193346, 0.250582, 0.317906, 0.393629, 0.474643, 0.55683, 0.635847,
		0.708005, 0.770882, 0.823482, 0.866015, 0.899479, 0.925254, 0.944786, 0.95941, 0.970263, 0.978267, 0.984143, 0.988444,
		0.991584, 0.993875, 0.995543, 0.996757, 0.99764, 0.998282, 0.998749, 0.999088, 0.999334, 0.999514, 0.999644, 0.99974,
		0.999809, 0.99986, 0.999897, 0.999924, 0.999944, 0.999959, 0.99997, 0.999978, 0.999984, 0.999989, 0.999992, 0.999994,
		0.999996, 0.999997, 0.999998, 0.999998, 0.999999, 0.999999, 0.999999, 0.999999, 1, 1, 1, 1,
		1, 1
	] },
	{ l: 7, from: 94, values: [
		1.04395e-7, 1.51832e-7, 2.20493e-7, 3.1973e-7, 4.62965e-7, 6.69426e-7, 9.6663e-7, 0.00000139392, 0.00000200746, 0.00000288736, 0.00000414778, 0.00000595113,
		0.00000852835, 0.0000122073, 0.0000174532, 0.0000249249, 0.0000355554, 0.0000506635, 0.0000721124, 0.000102531, 0.000145625, 0.000206615, 0.000292842, 0.000414629,
		0.000586468, 0.000828681, 0.00116973, 0.00164944, 0.00232336, 0.00326892, 0.00459363, 0.00644631, 0.00903197, 0.0126313, 0.0176251, 0.0245249,
		0.0340056, 0.0469392, 0.0644166, 0.0877408, 0.118364, 0.157729, 0.206996, 0.266646, 0.336049, 0.413178, 0.494656, 0.576263,
		0.653765, 0.723753, 0.784149, 0.83427, 0.874539, 0.906067, 0.930261, 0.948547, 0.962212, 0.972339, 0.9798, 0.985273,
		0.989276, 0.992197, 0.994325, 0.995873, 0.996999, 0.997817, 0.998411, 0.998843, 0.999156, 0.999384, 0.99955, 0.999671,
		0.999759, 0.999824, 0.999871, 0.999905, 0.999931, 0.999949, 0.999963, 0.999973, 0.999981, 0.999986, 0.99999, 0.999993,
		0.999995, 0.999996, 0.999997, 0.999998, 0.999998, 0.999999, 0.999999, 0.999999, 0.999999, 1, 1, 1,
		1, 1
	] },
	{ l: 8, from: 114, values: [
		1.41968e-7, 2.04601e-7, 2.94525e-7, 4.23486e-7, 6.08232e-7, 8.72618e-7, 0.00000125059, 0.00000179039, 0.00000256058, 0.00000365841, 0.00000522179, 0.00000744606,
		0.0000106077, 0.0000150975, 0.0000214678, 0.0000304979, 0.0000432869, 0.0000613832, 0.0000869666, 0.000123103, 0.000174102, 0.000246015, 0.000347332, 0.000489955,
		0.000690554, 0.000972448, 0.00136822, 0.00192333, 0.00270108, 0.00378942, 0.00531018, 0.00743145, 0.010384, 0.0144824, 0.0201516, 0.027958,
		0.0386436, 0.0531556, 0.0726604, 0.0985195, 0.132197, 0.175062, 0.228068, 0.291334, 0.363746, 0.44277, 0.52466, 0.605109,
		0.680113, 0.74672, 0.80337, 0.849819, 0.886781, 0.915505, 0.937423, 0.95392, 0.96621, 0.975297, 0.98198, 0.986875,
		0.99045, 0.993056, 0.994953, 0.996331, 0.997333, 0.99806, 0.998588, 0.998971, 0.99925, 0.999453, 0.9996, 0.999708,
		0.999786, 0.999844, 0.999886, 0.999917, 0.999939, 0.999956, 0.999968, 0.999977, 0.999983, 0.999988, 0.999991, 0.999994,
		0.999995, 0.999997, 0.999998, 0.999999, 0.999999, 1, 1
	] },
	{ l: 9, from: 133, values: [
		1.31497e-7, 1.88483e-7, 2.69905e-7, 3.86136e-7, 5.51908e-7, 7.88131e-7, 0.00000112446, 0.00000160291, 0.00000228299, 0.00000324889, 0.00000461966, 0.00000656347,
		0.00000931776, 0.0000132174, 0.0000187345, 0.0000265337, 0.0000375508, 0.0000531014, 0.0000750342, 0.000105945, 0.000149478, 0.00021074, 0.00029689, 0.000417949,
		0.000587939, 0.000826459, 0.00116087, 0.00162933, 0.00228497, 0.0032016, 0.00448152, 0.00626606, 0.00874959, 0.0121979, 0.0169717, 0.0235551,
		0.0325883, 0.0449004, 0.0615341, 0.0837453, 0.112953, 0.150603, 0.197919, 0.255531, 0.323046, 0.398723, 0.479444, 0.561127,
		0.639505, 0.710982, 0.773215, 0.82526, 0.867347, 0.900473, 0.925999, 0.945352, 0.959848, 0.970609, 0.978544, 0.984366,
		0.988624, 0.991729, 0.993989, 0.995633, 0.996826, 0.997692, 0.998321, 0.999109, 0.999526, 0.999748, 0.999866, 0.999929,
		0.999963, 0.99998, 0.99999, 0.999994, 0.999997, 0.999998, 0.999999, 0.999999, 1, 1
	] },
	{ l: 10, from: 152, values: [
		1.21235e-7, 1.73068e-7, 2.46859e-7, 3.5183e-7, 5.0104e-7, 7.12975e-7, 0.00000101378, 0.00000144043, 0.00000204514, 0.00000290163, 0.00000411393, 0.00000582867,
		0.0000082525, 0.0000116763, 0.0000165095, 0.0000233277, 0.0000329395, 0.0000464805, 0.0000655443, 0.0000923656, 0.000130076, 0.000183063, 0.000257466, 0.000361876,
		0.000508299, 0.000713506, 0.0010009, 0.0014031, 0.00196552, 0.00275125, 0.00384777, 0.00537603, 0.00750264, 0.0104559, 0.0145468, 0.0201946,
		0.0279581, 0.0385686, 0.05296, 0.072283, 0.0978834, 0.131213, 0.173639, 0.226132, 0.288854, 0.360756, 0.439384, 0.52106,
		0.676721, 0.800784, 0.885107, 0.936462, 0.965705, 0.981731, 0.990332, 0.994896, 0.997305, 0.998574, 0.999244, 0.999598,
		0.999787, 0.999887, 0.999941, 0.999969, 0.999984, 0.999991, 0.999995, 0.999997, 0.999998, 0.999999, 1, 1
	] },
	{ l: 11, from: 171, values: [
		1.11517e-7, 1.58691e-7, 2.25661e-7, 3.2067e-7, 4.55365e-7, 6.462e-7, 9.164e-7, 0.00000129874, 0.00000183941, 0.00000260355, 0.00000368287, 0.00000520648,
		0.00000735601, 0.0000103868, 0.0000146577, 0.0000206725, 0.0000291381, 0.0000410463, 0.0000577868, 0.0000813068, 0.000114332, 0.000160678, 0.00022568, 0.000316797,
		0.000444445, 0.000623169, 0.000873254, 0.00122297, 0.00171164, 0.0033457, 0.00651684, 0.0126307, 0.0242927, 0.046132, 0.0857315, 0.153615,
		0.259649, 0.403549, 0.565787, 0.714686, 0.827782, 0.902035, 0.946276, 0.971146, 0.984674, 0.991901, 0.995726, 0.997743,
		0.998805, 0.999367, 0.999665, 0.999823, 0.999907, 0.999951, 0.999974, 0.999986, 0.999992, 0.999996, 0.999998, 0.999999,
		0.999999, 1, 1
	] },
	{ l: 12, from: 190, values: [
		1.02464e-7, 1.4544e-7, 2.06313e-7, 2.92482e-7, 4.14388e-7, 5.86752e-7, 8.30319e-7, 0.00000117432, 0.00000165989, 0.00000234495, 0.00000467235, 0.00000928999,
		0.0000184324, 0.0000364945, 0.0000721026, 0.000142152, 0.00027967, 0.000549086, 0.00107578, 0.00210287, 0.00409931, 0.00796186, 0.01538, 0.0294522,
		0.0555804, 0.102291, 0.180518, 0.298353, 0.450414, 0.61195, 0.751816, 0.853146, 0.91753, 0.955122, 0.976005, 0.987285,
		0.993288, 0.996458, 0.998129, 0.99901, 0.999476, 0.999724, 0.999855, 0.999924, 0.99996, 0.999979, 0.999988, 0.999994,
		0.999996, 0.999998, 0.999999, 1, 1
	] },
	{ l: 13, from: 205, values: [
		1.88705e-7, 3.77581e-7, 7.53874e-7, 0.00000150205, 0.00000298681, 0.0000059278, 0.0000117424, 0.0000232164, 0.000045814, 0.0000902321, 0.000177374, 0.000348015,
		0.000681539, 0.00133208, 0.0025978, 0.0050519, 0.00978545, 0.0188391, 0.0359078, 0.0672815, 0.122426, 0.212243, 0.341941, 0.500166,
		0.658005, 0.786942, 0.876246, 0.931309, 0.962877, 0.980226, 0.989542, 0.994482, 0.997088, 0.998462, 0.999187, 0.999571,
		0.999775, 0.999882, 0.999938, 0.999967, 0.999982, 0.99999, 0.999995, 0.999997, 0.999999
	] },
	{ l: 14, from: 214, values: [
		1.22189e-7, 2.43957e-7, 4.86104e-7, 9.66737e-7, 0.00000191906, 0.00000380275, 0.00000752246, 0.0000148551, 0.0000292841, 0.0000576265, 0.000113199, 0.000221973,
		0.000434524, 0.000849127, 0.00165622, 0.0032232, 0.00625401, 0.0120816, 0.0231772, 0.0439465, 0.0816652, 0.146625, 0.248995, 0.389843,
		0.551467, 0.702594, 0.819263, 0.896773, 0.943292, 0.969534, 0.983823, 0.991454, 0.995492, 0.997622, 0.998745, 0.999338
	] },
	{ l: 15, from: 224, values: [
		1.58139e-7, 3.14567e-7, 6.24609e-7, 0.00000123809, 0.00000245009, 0.00000484085, 0.00000954946, 0.0000188082, 0.0000369841, 0.0000726055, 0.000142303, 0.000278462,
		0.000544041, 0.00106117, 0.00206603, 0.00401306, 0.00776957, 0.014968, 0.0286036, 0.053912, 0.0992131, 0.175347, 0.290779, 0.441194,
		0.602902, 0.744614
	] },
	{ l: 16, from: 233, values: [
		1.02785e-7, 2.0416e-7, 4.04836e-7, 8.0146e-7, 0.0000015842, 0.00000312674, 0.00000616233, 0.0000121274, 0.0000238315, 0.0000467599, 0.0000916083, 0.000179202,
		0.000350036, 0.000682725, 0.00132951, 0.00258417, 0.0050103
	] },
	{ l: 17, from: 243, values: [
		1.32827e-7, 2.63079e-7, 5.20259e-7, 0.00000102733, 0.00000202579, 0.00000398923, 0.00000784521
	] }
];

const ROWS = new Map(GREYBODY.map((r) => [r.l, r]));
/** Gamma_l at the table's i-th x (i < 250): 0 below the row's stretch, 1 above it, 0 for a degree not in the rows. */
export function gamma(l, i) {
	if (!(i >= 0 && i < X.length)) throw new Error(`no x at ${i}`);
	const row = ROWS.get(l);
	if (!row || i < row.from) return 0;
	const k = i - row.from;
	return k < row.values.length ? row.values[k] : 1;
}
/** The rows that end before x = 3 go on at 1; those that reach it are cut there (their next values lie beyond). */
const ENDS = new Map(GREYBODY.map((r) => [r.l, r.from + r.values.length]));
/** sigma_abs / 27 pi (GM/c^2)^2 at the table's i-th x: sum (2l + 1) Gamma_l / 27 x^2 (hole-against-sky.ts, SHARE). */
export const share = X.map((x, i) => GREYBODY.reduce((s, r) => s + (2 * r.l + 1) * gamma(r.l, i), 0) / (27 * x * x));
/** The index of x in the table. */
export const index = (x) => { const i = X.findIndex((v) => near(v, x, 1e-9)); if (i < 0) throw new Error(`x = ${x} is not in the table`); return i; };

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/black-holes/hawking.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;
	const sci = (v, d) => v.toExponential(d);

	// ---- the temperature
	has(r`$$\boxed{\;\kB T_H = \frac{\hbar c^3}{8\pi G\matter M}\;} . \label{eq:hawking}$$`, 'the Hawking temperature');
	has(r`$$\sym{equilibrium-mass}{\matter M_{\rm eq}} = 1.356\times10^{23}\unit{kg} ,$$`, 'the equilibrium mass');
	has(r`At the 2.7255 K of the microwave sky the mass is $4.50\times10^{22}$ kg, three times less.`, 'the microwave sky\'s mass');
	has('1.85 times the Moon\'s mass: a hole of this mass is exactly as warm as the graviton sky.', 'M_eq in Moons');
	has(r`A hole of the Sun's mass is at $6.2\times10^{-8}$ K, 44 million times colder than the microwave sky.`, 'the Sun\'s hole');
	has(r`$T_H = 1.2\times10^{11}$ K`, 'the practice problem\'s hole');
	check(sci(M_EQ, 3) === '1.356e+23' && sci(M_CMB, 2) === '4.50e+22' && (M_EQ / M_CMB).toFixed(2) === '3.01', `the two masses ${M_EQ} ${M_CMB}`);
	check((M_EQ / BODIES[0].M).toFixed(2) === '1.85', 'M_eq is not 1.85 Moons');
	check(sci(hawking(M_SUN), 1) === '6.2e-8' && (MICROWAVE_SKY / hawking(M_SUN) / 1e6).toFixed(0) === '44', 'the Sun\'s temperature');
	check(sci(hawking(1e12), 1) === '1.2e+11', 'the practice problem');
	check(sci(hawking(LADDER[0]), 1) === '1.2e+12' && sci(hawking(LADDER[1]), 1) === '6.2e-18' && sci(LADDER[1], 1) === '2.0e+40', 'the ladder\'s ends');
	check(near(hawking(M_EQ), GRAVITON_SKY, 1e-12) && near(hawking(M_CMB), MICROWAVE_SKY, 1e-12), 'the skies\' masses');
	check(BODIES.every((b, i) => i === 0 || b.M > BODIES[i - 1].M) && BODIES[0].M > M_CMB && BODIES[0].M < M_EQ && BODIES[1].M > M_EQ, 'the bodies\' order');
	check(sci(BODIES[0].M, 1) === '7.3e+22', 'the Moon is not 7.3 x 10^22 kg');

	// ---- the bookkeeping
	has(r`$$\boxed{\begin{aligned} n_{\rm out} &= (1 - \Gamma_\ell)\,n_{\rm bg} + \Gamma_\ell n_H\\ &= n_{\rm bg} + \Gamma_\ell\,(n_H - n_{\rm bg}) \end{aligned}} \label{eq:bookkeeping}$$`, 'the bookkeeping');
	has(r`Balance requires $n_H$ to go out, so the hole's spontaneous emission is $\Gamma_\ell n_H$.`, 'the spontaneous emission');
	has(r`This share is the **net absorption**, absorption less the emission that the incoming wave stimulates`, 'the net absorption');
	{
		const b = book();
		check(near(b.out, b.outFactored, 1e-15) && b.out.toFixed(2) === '0.72' && near(b.absorbed + b.scattered, b.in, 1e-15), `the mode: ${JSON.stringify(b)}`);
		check(b.scattered.toFixed(2) === '0.60' && b.emitted.toFixed(2) === '0.12' && b.absorbed.toFixed(2) === '0.40', 'the mode\'s parts');
		for (const [G0, n0, n1] of [[0.3, 2, 2], [0, 1, 0.5], [1, 1, 0.5], [0.5, 1, 0]]) {
			const q = book({ Gamma: G0, nbg: n0, nH: n1 });
			check(near(q.out, q.outFactored, 1e-15), 'the two forms of the bookkeeping');
		}
		check(near(book({ Gamma: 0.4, nbg: 1, nH: 1 }).out, 1, 1e-15), 'a hole at the sky\'s temperature changes nothing');
	}

	// ---- the greybody factors
	has(r`We write $x = G\matter M\omega/c^3$`, 'x');
	has(r`$$\boxed{\;\Gamma_2 \to \frac{256}{225}\,x^6\;} \qquad (x \to 0) .$$`, 'Page\'s limit');
	has(r`At $x = 0.1$, $\Gamma_2 = 3.1\times10^{-6}$.`, 'Gamma_2 at 0.1');
	has(r`with $\Gamma_2(0.3) = 0.055$`, 'Gamma_2 at 0.3');
	has(r`Solved by numbers, $\sigma_{\rm abs}$ reaches the capture cross-section near $x = 1$ and then swings about it by a few
per cent`, 'the cross-section');
	has(r`\sum_{\ell\ge2}(2\ell + 1)\,\Gamma_\ell`, 'the partial-wave sum');
	has(r`$\pi b_c^2 = 27\pi G^2\matter M^2/c^4$`, 'the capture area');
	check(sci(gamma(2, index(0.1)), 1) === '3.1e-6' && gamma(2, index(0.3)).toFixed(3) === '0.055', 'Gamma_2 at 0.1 and 0.3');
	check(Math.abs(gamma(2, 0) / page(0.01) - 1) < 0.07, `Gamma_2 is ${gamma(2, 0) / page(0.01)} times Page's at 0.01`);
	for (let i = 0; i < X.length; i++) check(gamma(2, i) >= page(X[i]) || gamma(2, i) === 1, `Page's limit above Gamma_2 at ${X[i]}`);
	check(X.length === 250 && near(X[0], 0.01, 1e-15) && near(X[199], 2, 1e-15) && near(X[200], 2.02, 1e-15) && near(X[249], 3, 1e-15), 'the table\'s x');
	for (const row of GREYBODY) {
		const end = ENDS.get(row.l);
		// rising, to the table's six figures, which near 1 round some neighbours to one value
		check(row.values.every((v, k) => v > 0 && v <= 1 && (k === 0 || v >= row.values[k - 1])), `the row of l = ${row.l} is not rising in (0, 1]`);
		check(end <= X.length || row.l >= 13, `the row of l = ${row.l} is cut`);
	}
	check([...ROWS.keys()].join() === '2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17', 'the rows');
	check(ENDS.get(2) === index(0.78) && ENDS.get(10) === index(2.5), 'the rows of l = 2 and 10 do not reach 1 where the table does');
	{
		const from = (x0) => share.filter((_, i) => X[i] >= x0 - 1e-9);
		check(Math.min(...from(0.86)) > 0.9 && Math.min(...from(1)) > 0.93 && Math.max(...share) < 1.007, 'sigma_abs does not reach the capture area near x = 1');
		check(Math.min(...from(1.4)).toFixed(3) === '0.957' && Math.max(...from(1.4)).toFixed(3) === '1.006', 'the swings about 1');
		check(share.findIndex((s) => s >= 1) === index(1.45), 'sigma_abs first crosses 1 at 1.45');
		check(share[index(1)].toFixed(3) === '0.936' && share[0] < 1e-8, `sigma_abs at 1 and 0.01: ${share[index(1)]}, ${share[0]}`);
	}

	/** Whether the diagram `name` is drawn (its figure line, with the caption `caption`) or still planned (its comment). */
	const state = (name, id, caption) => {
		const drawn = flat.includes(`](${name}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${name} `));
		check(drawn !== planned, `the diagram ${name} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) {
			has(`![${caption}](${name}){#fig:${id}}`, `the caption of ${name}`);
			has(`(Figure [](#fig:${id}))`, `the pointer to ${name}`);
		}
		return drawn;
	};
	return { md, flat, has, state };
}
