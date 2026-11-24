/**
 * Chapter 7.2's arrow carried round a loop: the figure's model against the chapter's numbers. Round the octant the
 * arrow turns by 90°, the area πa²/2 over a²; with the corner at 90° E moved to 45° E, by 45°; round any loop by
 * Girard's excess, in the sense of δv^α = −R^α_βγδ v^β s^γ q^δ; and on the flat sheet by nothing, although the
 * polar components change on the way and Γ^r_θθ = −r.
 */
import { describe, expect, it } from 'vitest';
import {
	CLEAR,
	DEG,
	OCTANT,
	SHEET_OPENING,
	SPHERE_COPIES,
	VIEW_OPENING,
	addSheetCorner,
	addSphereCorner,
	between,
	carrySheet,
	carrySphere,
	copies,
	cross,
	crosses,
	degrees,
	dot,
	enclosed,
	fan,
	girard,
	isHalfOctant,
	isOctant,
	movedSheet,
	movedSphere,
	norm,
	noteFirst,
	noteSecond,
	noteThird,
	placedSphere,
	point,
	polarChristoffel,
	project,
	readSphere,
	removeCorner,
	sampleAt,
	sheetArea,
	sheetValid,
	sphereKey,
	sphereValid,
	toward,
	triangle,
	turned,
	unit,
	unproject,
	viewKey,
	wrap,
	type SheetCorner,
	type SphereCorner,
	type Vec
} from './carry-around';

/** A small generator of numbers, the same on every run. */
function random(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

/** A random point of the unit sphere. */
function somewhere(rnd: () => number): Vec {
	const z = 2 * rnd() - 1;
	const p = 2 * Math.PI * rnd();
	const s = Math.sqrt(1 - z * z);
	return [s * Math.cos(p), s * Math.sin(p), z];
}

describe('the octant', () => {
	it('opens on the pole, 0° on the equator and 90° E on the equator', () => {
		const ps = OCTANT.map(point);
		expect(ps[0][2]).toBeCloseTo(1, 12);
		expect(dot(ps[1], [1, 0, 0])).toBeCloseTo(1, 12);
		expect(dot(ps[2], [0, 1, 0])).toBeCloseTo(1, 12);
	});

	it('turns the arrow by 90°, the area πa²/2 over a²', () => {
		const r = readSphere(OCTANT);
		expect(r.area).toBeCloseTo(90, 9);
		expect(r.turn).toBeCloseTo(90, 6);
		expect(Math.abs(r.difference)).toBeLessThan(1e-6);
		expect(r.fraction).toBeCloseTo(1 / 8, 12);
		expect(degrees(r.turn)).toBe('90.0');
	});

	it('starts pointing south along Greenwich and comes home pointing south along 90° E', () => {
		const c = readSphere(OCTANT).carry;
		expect(c.start[0]).toBeCloseTo(1, 12);
		expect(c.end[0]).toBeCloseTo(0, 6);
		expect(c.end[1]).toBeCloseTo(1, 6);
		// along the equator it points south, at right angles to the path
		const mid = c.samples[c.corners[1] + Math.floor((c.corners[2] - c.corners[1]) / 2)];
		expect(mid.v[2]).toBeCloseTo(-1, 6);
	});

	it('halves to 45° when the corner at 90° E moves to 45° E', () => {
		let cs: SphereCorner[] = OCTANT;
		for (let i = 0; i < 45; i++) cs = movedSphere(cs, 2, 0, -1);
		expect(cs[2]).toEqual({ th: 90, ph: 45 });
		const r = readSphere(cs);
		expect(r.area).toBeCloseTo(45, 9);
		expect(r.turn).toBeCloseTo(45, 6);
		expect(degrees(r.turn)).toBe('45.0');
		// and with Shift, ten degrees at a time
		let fast: SphereCorner[] = OCTANT;
		const [dTh, dPh] = sphereKey('ArrowLeft', true)!;
		for (let i = 0; i < 4; i++) fast = movedSphere(fast, 2, dTh, dPh);
		expect(fast[2]).toEqual({ th: 90, ph: 50 });
	});

	it('keeps the arrow of length 1 without renormalizing it', () => {
		for (const s of readSphere(OCTANT).carry.samples) {
			expect(norm(s.v)).toBeCloseTo(1, 9);
			expect(dot(s.v, s.p)).toBeCloseTo(0, 9);
		}
	});
});

describe('any loop on the sphere turns the arrow by its area over a²', () => {
	it('agrees with Girard for random triangles, to better than 0.1°', () => {
		const rnd = random(7);
		for (let n = 0; n < 200; n++) {
			const ps = [somewhere(rnd), somewhere(rnd), somewhere(rnd)];
			if (ps.some((p, i) => between(p, ps[(i + 1) % 3]) > 177 * DEG)) continue;
			const c = carrySphere(ps);
			const area = enclosed(ps);
			// Girard's excess is the area on the left; the transported angle agrees with it up to whole turns
			expect(Math.abs(wrap(c.measured - girard(ps))) / DEG).toBeLessThan(0.1);
			expect(Math.abs(wrap(c.measured - area)) / DEG).toBeLessThan(1e-4);
			expect(Math.abs(wrap(girard(ps) - triangle(ps[0], ps[1], ps[2])))).toBeLessThan(1e-9);
		}
	});

	it('agrees with Girard for random loops of four corners that do not cross themselves', () => {
		const rnd = random(11);
		let tried = 0;
		for (let n = 0; n < 400 && tried < 150; n++) {
			// four corners round a random centre, at random distances and in order of bearing
			const c = somewhere(rnd);
			const e1 = unit(cross(c, Math.abs(c[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
			const e2 = cross(c, e1);
			const bearings = [0, 1, 2, 3].map((k) => (k + 0.8 * rnd()) * (Math.PI / 2));
			const ps = bearings.map((b): Vec => {
				const d = (5 + 70 * rnd()) * DEG;
				const t = unit([
					Math.cos(b) * e1[0] + Math.sin(b) * e2[0],
					Math.cos(b) * e1[1] + Math.sin(b) * e2[1],
					Math.cos(b) * e1[2] + Math.sin(b) * e2[2]
				]);
				return unit([
					Math.cos(d) * c[0] + Math.sin(d) * t[0],
					Math.cos(d) * c[1] + Math.sin(d) * t[1],
					Math.cos(d) * c[2] + Math.sin(d) * t[2]
				]);
			});
			if (crosses(ps)) continue;
			tried++;
			const carry = carrySphere(ps);
			expect(girard(ps)).toBeGreaterThan(0);
			expect(Math.abs(girard(ps) - fan(ps))).toBeLessThan(1e-9);
			expect(Math.abs(wrap(carry.measured - girard(ps))) / DEG).toBeLessThan(0.1);
			// run the other way round, the same loop turns the arrow the other way
			const back = [ps[0], ps[3], ps[2], ps[1]];
			expect(Math.abs(wrap(carrySphere(back).measured + girard(ps))) / DEG).toBeLessThan(0.1);
			expect(enclosed(back)).toBeCloseTo(-girard(ps), 9);
		}
		expect(tried).toBeGreaterThan(100);
	});

	it('turns anticlockwise, seen from outside, round a loop that runs anticlockwise', () => {
		const ps = OCTANT.map(point);
		// the octant seen from outside, from (1, 1, 1): pole, then 0°, then 90° E runs anticlockwise
		expect(dot(cross(add3(ps[1], ps[0], -1), add3(ps[2], ps[0], -1)), [1, 1, 1])).toBeGreaterThan(
			0
		);
		const c = carrySphere(ps);
		expect(dot(ps[0], cross(c.start, c.end))).toBeGreaterThan(0.999);
		const back = carrySphere([ps[0], ps[2], ps[1]]);
		expect(back.measured / DEG).toBeCloseTo(-90, 6);
		expect(readSphere([OCTANT[0], OCTANT[2], OCTANT[1]]).turn).toBeCloseTo(-90, 6);
	});

	it('matches δv^α = −R^α_βγδ v^β s^γ q^δ for a small loop first south, then east', () => {
		// R^ϑ_φϑφ = sin²ϑ and an arrow pointing east has v^φ = 1/(a sin ϑ), so δv^ϑ = −sin ϑ dϑ dφ / a: a change
		// toward the north of a|δv^ϑ| = sin ϑ dϑ dφ
		for (const th0 of [30, 60, 90, 120]) {
			const d = 0.1;
			const cs: SphereCorner[] = [
				{ th: th0, ph: 20 },
				{ th: th0 + d, ph: 20 },
				{ th: th0 + d, ph: 20 + d },
				{ th: th0, ph: 20 + d }
			];
			const ps = cs.map(point);
			const t = th0 * DEG;
			const p = 20 * DEG;
			const east: Vec = [-Math.sin(p), Math.cos(p), 0];
			const south: Vec = [Math.cos(t) * Math.cos(p), Math.cos(t) * Math.sin(p), -Math.sin(t)];
			const c = carrySphere(ps, east, 0.01 * DEG);
			const dv = add3(c.end, c.start, -1);
			const predicted = -Math.sin(t) * (d * DEG) * (d * DEG);
			expect(dot(dv, south) / predicted).toBeCloseTo(1, 2);
			// the arrow turned toward the north, anticlockwise about the outward normal
			expect(c.measured).toBeGreaterThan(0);
		}
	});
});

describe('the flat sheet', () => {
	it('has Γ^r_θθ = −r and Γ^θ_rθ = 1/r', () => {
		for (const r of [0.3, 1, 2, 3.5]) {
			const g = polarChristoffel(r);
			expect(g.rThTh).toBeCloseTo(-r, 8);
			expect(g.thRTh).toBeCloseTo(1 / r, 8);
		}
	});

	it('returns the arrow unturned, though its polar components change on the way', () => {
		const c = carrySheet(SHEET_OPENING);
		expect(Math.abs(c.measured) / DEG).toBeLessThan(1e-6);
		expect(c.end[0]).toBeCloseTo(1, 7);
		expect(c.end[1]).toBeCloseTo(0, 7);
		// at (0, 3) the arrow along x points along −θ̂: v^r = 0 and v^θ = −1/3 per metre
		const atThird = c.samples[c.corners[2]];
		expect(atThird.vr).toBeCloseTo(0, 8);
		expect(atThird.vth).toBeCloseTo(-1 / 3, 8);
		// everywhere on the way the arrow keeps its fixed direction
		for (const s of c.samples) {
			expect(s.v[0]).toBeCloseTo(1, 7);
			expect(s.v[1]).toBeCloseTo(0, 7);
		}
	});

	it('returns the arrow unturned round random loops', () => {
		const rnd = random(3);
		let tried = 0;
		for (let n = 0; n < 300 && tried < 60; n++) {
			const k = rnd() < 0.5 ? 3 : 4;
			const cs: SheetCorner[] = Array.from({ length: k }, () => ({
				x: Math.round((7 * rnd() - 3.5) * 10) / 10,
				y: Math.round((7 * rnd() - 3.5) * 10) / 10
			}));
			if (!sheetValid(cs)) continue;
			tried++;
			expect(Math.abs(carrySheet(cs).measured) / DEG).toBeLessThan(1e-4);
		}
		expect(tried).toBeGreaterThan(30);
	});

	it('keeps the loop clear of the centre, where the polar labels fail', () => {
		expect(sheetValid(SHEET_OPENING)).toBe(true);
		// moving the last corner to (0, 0.2) would bring it within CLEAR of the centre
		const near = movedSheet(SHEET_OPENING, 3, 0, -0.8);
		expect(near).toBe(SHEET_OPENING);
		expect(CLEAR).toBe(0.3);
		const ok = movedSheet(SHEET_OPENING, 0, 0, 0.1);
		expect(ok[0]).toEqual({ x: 1, y: 0.1 });
	});

	it('measures its area by the shoelace', () => {
		// 4 m² of the quarter annulus' triangle less the inner half-square: (9 − 1)/2
		expect(sheetArea(SHEET_OPENING)).toBeCloseTo(4, 12);
	});
});

describe('the corners', () => {
	it('adds a fourth corner halfway along the last side without changing the turn', () => {
		const four = addSphereCorner(OCTANT);
		expect(four).toHaveLength(4);
		expect(four[3]).toEqual({ th: 45, ph: 90 });
		expect(readSphere(four).turn).toBeCloseTo(90, 6);
		expect(removeCorner(four, sphereValid)).toEqual(OCTANT);
		const sheet3 = removeCorner(SHEET_OPENING, sheetValid);
		expect(sheet3).toHaveLength(3);
		expect(addSheetCorner(sheet3)[3]).toEqual({ x: 0.5, y: 1.5 });
	});

	it('refuses a side that would vanish or join nearly opposite corners', () => {
		// the pole cannot be pulled onto the corner at 0° on the equator
		let cs: SphereCorner[] = OCTANT;
		for (let i = 0; i < 100; i++) cs = movedSphere(cs, 0, 1, 0);
		expect(cs[0].th).toBe(89);
		expect(
			sphereValid([
				{ th: 0, ph: 0 },
				{ th: 180, ph: 0 },
				{ th: 90, ph: 0 }
			])
		).toBe(false);
	});

	it('snaps a dragged corner onto the equator and the pole', () => {
		const p = point({ th: 91.4, ph: 44.6 });
		expect(placedSphere(OCTANT, 2, p)[2]).toEqual({ th: 90, ph: 45 });
		const q = point({ th: 1.5, ph: 70 });
		expect(placedSphere(OCTANT, 0, q)[0]).toEqual({ th: 0, ph: 0 });
	});

	it('detects a loop that crosses itself', () => {
		const bow = [
			{ th: 60, ph: 0 },
			{ th: 60, ph: 40 },
			{ th: 100, ph: 0 },
			{ th: 100, ph: 40 }
		].map(point);
		expect(crosses(bow)).toBe(true);
		expect(crosses(addSphereCorner(OCTANT).map(point))).toBe(false);
	});
});

describe('the view', () => {
	it('shows the octant from outside, anticlockwise on the page, with the pole tilted 35° toward the reader', () => {
		const [pole, zero, east] = OCTANT.map((c) => project(point(c), VIEW_OPENING));
		expect(pole[2]).toBeCloseTo(Math.sin(35 * DEG), 12);
		// the page's y is up: pole, then lower left, then lower right is anticlockwise
		const signed =
			(zero[0] - pole[0]) * (east[1] - pole[1]) - (zero[1] - pole[1]) * (east[0] - pole[0]);
		expect(signed).toBeGreaterThan(0);
		expect(zero[0]).toBeLessThan(0);
		expect(east[0]).toBeGreaterThan(0);
	});

	it('undoes its projection on the near side', () => {
		const rnd = random(5);
		for (let n = 0; n < 50; n++) {
			const v = { lon: 360 * rnd() - 180, el: 170 * rnd() - 85 };
			let p = somewhere(rnd);
			if (project(p, v)[2] < 0) p = [-p[0], -p[1], -p[2]];
			const q = project(p, v);
			const back = unproject(q[0], q[1], v);
			if (Math.hypot(q[0], q[1]) < 0.99) expect(between(back, p)).toBeLessThan(1e-9);
		}
	});

	it('turns with the keys as with a drag, and keeps the elevation in bounds', () => {
		expect(viewKey(VIEW_OPENING, 'ArrowRight', false)).toEqual({ lon: 40, el: 35 });
		expect(viewKey(VIEW_OPENING, 'ArrowDown', true)).toEqual({ lon: 45, el: 50 });
		expect(viewKey(VIEW_OPENING, 'Enter', false)).toBeUndefined();
		expect(turned(VIEW_OPENING, 0, 200).el).toBe(85);
		expect(turned({ lon: -170, el: 0 }, 20, 0).lon).toBe(170);
	});
});

describe('the drawing', () => {
	it('lays the faint copies every 10° and finds the sample at a length', () => {
		const c = readSphere(OCTANT).carry;
		const idx = copies(c.samples, SPHERE_COPIES);
		expect(idx.length).toBe(26);
		expect(c.samples[sampleAt(c.samples, 0)].s).toBe(0);
		expect(sampleAt(c.samples, c.length * 2)).toBe(c.samples.length - 1);
		expect(c.samples[sampleAt(c.samples, Math.PI / 2)].s).toBeCloseTo(Math.PI / 2, 9);
	});

	it('starts the arrow along the first side', () => {
		const ps = [
			{ th: 40, ph: 10 },
			{ th: 70, ph: 50 },
			{ th: 80, ph: -20 }
		].map(point);
		const c = carrySphere(ps);
		expect(between(c.start, toward(ps[0], ps[1]))).toBeLessThan(1e-12);
	});
});

describe('the predictions', () => {
	it('answers the first once the arrow has been carried round an octant', () => {
		expect(noteFirst(false, OCTANT, false)).toBe(false);
		expect(noteFirst(false, OCTANT, true)).toBe(true);
		expect(noteFirst(false, movedSphere(OCTANT, 2, 0, -1), true)).toBe(false);
		// an octant elsewhere counts too
		const turnedOctant = [
			{ th: 0, ph: 0 },
			{ th: 90, ph: 30 },
			{ th: 90, ph: 120 }
		];
		expect(isOctant(turnedOctant)).toBe(true);
		expect(noteFirst(true, [], false)).toBe(true);
	});

	it('answers the second once the corner at 90° E is at 45° E', () => {
		expect(noteSecond(false, OCTANT)).toBe(false);
		expect(
			noteSecond(false, [
				{ th: 0, ph: 0 },
				{ th: 90, ph: 0 },
				{ th: 90, ph: 45 }
			])
		).toBe(true);
		expect(
			isHalfOctant([
				{ th: 0, ph: 0 },
				{ th: 90, ph: 0 },
				{ th: 90, ph: 46 }
			])
		).toBe(false);
		expect(isHalfOctant(addSphereCorner(OCTANT))).toBe(false);
		expect(noteSecond(true, OCTANT)).toBe(true);
	});

	it('answers the third once a loop of the reader’s own is made on the sheet', () => {
		expect(noteThird(false, 'sheet', SHEET_OPENING)).toBe(false);
		const moved = movedSheet(SHEET_OPENING, 1, 0.1, 0);
		expect(noteThird(false, 'sphere', moved)).toBe(false);
		expect(noteThird(false, 'sheet', moved)).toBe(true);
		expect(noteThird(true, 'sphere', SHEET_OPENING)).toBe(true);
	});
});

describe('the words', () => {
	it('writes angles to three figures with a true minus', () => {
		expect(degrees(90)).toBe('90.0');
		expect(degrees(-45.04)).toBe('−45.0');
		expect(degrees(0.61)).toBe('0.610');
		expect(degrees(-1e-9)).toBe('0.000');
		expect(degrees(123.4)).toBe('123');
	});
});

function add3(a: Vec, b: Vec, k: number): Vec {
	return [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]];
}
