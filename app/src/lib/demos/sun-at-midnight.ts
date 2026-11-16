/**
 * "The Sun at midnight": an observer at mid latitude on Earth's night side.
 * The scene file fixes the geometry at local midnight; this module moves the
 * Sun and the Moon for any other time of day.
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
 * Unit vector toward a body on the sky, in the observer's frame (+y up, −z
 * north, +x east), given its declination and the local time at which it would
 * stand where the Sun does at that hour (12 = noon, 0 = midnight).
 */
export function skyDirection(hours: number, declination: number): Vec3 {
	const hourAngle = ((hours - 12) / 24) * 2 * Math.PI;
	const pole: Vec3 = [0, Math.sin(LATITUDE), -Math.cos(LATITUDE)];
	const meridian: Vec3 = [0, Math.cos(LATITUDE), Math.sin(LATITUDE)];
	const west: Vec3 = [-1, 0, 0];
	const cd = Math.cos(declination);
	const sd = Math.sin(declination);
	const ch = Math.cos(hourAngle);
	const sh = Math.sin(hourAngle);
	return [0, 1, 2].map((i) => sd * pole[i] + cd * (ch * meridian[i] + sh * west[i])) as Vec3;
}

/** Unit vector toward the Sun at a local solar time in hours. */
export function sunDirection(hours: number): Vec3 {
	return skyDirection(hours, DECLINATION);
}

/**
 * The Moon, a day before full: 165° east of the Sun, so it crossed the
 * meridian at eleven in the evening, and 4° north of the equator. It turns with
 * the sky; its own drift of half a degree an hour is left out.
 */
export const MOON_LAG_HOURS = 13;
export const MOON_DECLINATION = (4 * Math.PI) / 180;
export const MOON_DISTANCE = 384_400_000;

/** Unit vector from the Earth's centre toward the Moon's. */
export function moonDirection(hours: number): Vec3 {
	return skyDirection(hours + MOON_LAG_HOURS, MOON_DECLINATION);
}

const analyzed = analyzeScene(scene);

/** Where the Moon's centre is, in the Earth-centred scene frame. */
export function moonCenter(hours: number): Vec3 {
	const m = moonDirection(hours);
	return [m[0] * MOON_DISTANCE, m[1] * MOON_DISTANCE, m[2] * MOON_DISTANCE];
}

/** The scene's objects with the Sun and the Moon placed for the given local solar time. */
export function objectsAt(hours: number): AnalyzedObject[] {
	const s = sunDirection(hours);
	const sun: Vec3 = [s[0] * AU, s[1] * AU, s[2] * AU];
	const moon = moonCenter(hours);
	return analyzed.map((o) =>
		o.id === 'sun' || o.id === 'sun-core'
			? { ...o, center: sun }
			: o.id === 'moon' || o.id === 'moon-core'
				? { ...o, center: moon }
				: o
	);
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
