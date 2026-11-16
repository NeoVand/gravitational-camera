/**
 * "The Sun at midnight": an observer at mid latitude on Earth's night side.
 * The scene file fixes the geometry at local midnight; this module moves the
 * Sun for any other time of day.
 */
import sceneJson from '../../../../scenes/sun-at-midnight.scene.json';
import { AU } from '../engine/physics/constants';
import { analyzeScene } from '../engine/scene';
import type { AnalyzedObject, Scene, Vec3 } from '../engine/types';

export const scene = sceneJson as unknown as Scene;

/** Observer's latitude and the Sun's declination (equinox), radians. */
export const LATITUDE = (40 * Math.PI) / 180;
export const DECLINATION = 0;

/**
 * Unit vector toward the Sun in the observer's frame (+y up, −z north, +x east)
 * at a local solar time given in hours (12 = noon, 0 = midnight).
 */
export function sunDirection(hours: number): Vec3 {
	const hourAngle = ((hours - 12) / 24) * 2 * Math.PI;
	const pole: Vec3 = [0, Math.sin(LATITUDE), -Math.cos(LATITUDE)];
	const meridian: Vec3 = [0, Math.cos(LATITUDE), Math.sin(LATITUDE)];
	const west: Vec3 = [-1, 0, 0];
	const cd = Math.cos(DECLINATION);
	const sd = Math.sin(DECLINATION);
	const ch = Math.cos(hourAngle);
	const sh = Math.sin(hourAngle);
	return [0, 1, 2].map((i) => sd * pole[i] + cd * (ch * meridian[i] + sh * west[i])) as Vec3;
}

const analyzed = analyzeScene(scene);

/** The scene's objects with the Sun placed for the given local solar time. */
export function objectsAt(hours: number): AnalyzedObject[] {
	const s = sunDirection(hours);
	const center: Vec3 = [s[0] * AU, s[1] * AU, s[2] * AU];
	return analyzed.map((o) => (o.id === 'sun' || o.id === 'sun-core' ? { ...o, center } : o));
}

/** Yaw and pitch that point the camera along a direction. */
export function aim(direction: Vec3): { yaw: number; pitch: number } {
	const n = Math.hypot(...direction);
	return {
		yaw: Math.atan2(-direction[0], -direction[2]),
		pitch: Math.asin(direction[1] / n)
	};
}

export function formatClock(hours: number): string {
	const h = Math.floor(hours) % 24;
	const m = Math.round((hours - Math.floor(hours)) * 60) % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
