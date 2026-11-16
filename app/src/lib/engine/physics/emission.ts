/**
 * Thermal gravitational emission of ordinary matter, as defined in
 * /scenes/README.md. Double precision; nothing here runs on the GPU.
 */
import { C, G, K_B, MEAN_QUANTUM_KT, SIGMA_SB } from './constants';

/** Absorption coefficient of a viscous medium, 1/m: α = 16πGη/c³. */
export function absorptionCoefficient(friction: number): number {
	return (16 * Math.PI * G * friction) / C ** 3;
}

/** Energy emissivity of an optically thin body, W m⁻³ sr⁻¹: j_E = α σ T⁴ / π. */
export function energyEmissivity(friction: number, temperature: number): number {
	return (absorptionCoefficient(friction) * SIGMA_SB * temperature ** 4) / Math.PI;
}

/** Energy emissivity when a total power is spread over a volume, W m⁻³ sr⁻¹. */
export function energyEmissivityFromLuminosity(luminosity: number, volume: number): number {
	return luminosity / (4 * Math.PI * volume);
}

/** Number emissivity, gravitons s⁻¹ m⁻³ sr⁻¹. */
export function numberEmissivity(jE: number, temperature: number): number {
	return jE / (MEAN_QUANTUM_KT * K_B * temperature);
}
