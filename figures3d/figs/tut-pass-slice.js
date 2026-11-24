// The tutorial, chapter 13.1 (tutorial/what-a-field-keeps/push-and-pass.md), its third diagram: passes along one
// great circle of directions give the density. Both panels in one orthographic view (turned and tilted alike), the
// axis nu up the page in both.
// Left: a lumpy stone body of uniform density (its surface r(u) = 1 plus two low harmonics and a few smooth knobs, lit
// by the studio over the sawn stone's colours, tut-pass-lib.js), the great circle of directions at right angles to nu
// drawn faint round it, nu a short arrow up from its top; three bundles of parallel paths along three directions n_1,
// n_2, n_3 of that circle, 60 degrees apart, each a ribbon of three paths beside the body, named at its start; for n_1,
// the plane across it beyond the body, a translucent sheet carrying the projected mass Sigma (the length of the body
// along each path through it) in matter's colour, the three paths of n_1 ending on it.
// Right: wavevector space, the same axis nu through its origin: for each n_i the slice k.n_i = 0, a translucent
// rectangle through the origin, nu its middle line, in the grey of its bundle and named k.n_i = 0; a fourth, dashed,
// for the slices that turning n round the circle sweeps through every k.
// Departures from the diagram's comment: the bundles and the slices are told apart by their names and by three greys
// of the page's ink, since the colours that are not neutral are kept for matter (Sigma), and orange and blue mean a
// stretch and a squeeze.
// Exact: every n_i at right angles to nu; each path parallel to its n_i and clear of the body (asserted along it); the
// sheet at right angles to n_1; Sigma, the body's chord along n_1 through each point of the sheet (on steps of 0.005 of
// the body's size); each slice the plane through the origin at right angles to its n_i, so containing nu (asserted
// point by point); what the body hides of each path and of the circle, found along each line of sight, and what runs
// in front of the stone drawn in its fixed ink. Schematic, as the caption says: the body's shape, the number and
// spacing of the paths, the sheet's distance and size, the slices' size. Pictorial: the stone's grain.
import { INK, DIM, FAINT, THREE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, LINE, VEC, VEC_HEAD, n2, near } from './tut-pot-lib.js';
import { fitDash } from './tut-stars-lib.js';
import { chapter, View, body, sight, insidePolygon, stonePicture, stoneColours, MATTER } from './tut-pass-lib.js';
import { STONE_FAINT } from './tut-flow-lib.js';

const name = 'tut-pass-slice';
const check = checker(name);

// ---- the scene (world units: the body's mean radius; y along nu) ----------------------------------------------------
const TURN = -40, TILT = 34;                  // the view, degrees
const PHI = [0, 60, 120];                     // the three directions on the great circle, degrees from x toward z
const SWEEP = 150;                            // the fourth slice, dashed
const RIBBON = [250, 115, 345], SPACING = 0.36;   // each bundle's three paths: where, about its direction (degrees), and how far apart
const GREYS = [INK, DIM, FAINT];
const HALF = 2.15;                            // a path starts this far before the body's centre,
const DOWN = [null, 1.45, 1.25];              // and ends this far after it (the first on the sheet)
const RHO = [1.62, 2.12, 1.62];                // each ribbon's middle path: its distance from the axis through the centre along n
const SHEET_AT = 1.95, SHEET = 1.45;          // the sheet: its distance along n_1, its half-side
const CIRCLE = 1.62;                          // the great circle drawn round the body
const AXIS_TOP = 1.7;                         // nu's tip
const KH = 0.95, KW = 1.25, K_AXIS = [-1.3, 1.75];   // a slice's half-height and width, the axis in wavevector space
const SL = 34, SK = 40;                       // points per unit, left and right
const APART = 182;                            // between the panels' origins
const PATH_W = 0.45, SHEET_LINE = 0.4, SLICE_LINE = 0.45, SLICE_FILL = 0.12;
const END_AIR = 12;                           // a path's end, clear of the body's outline (points)
const END_GAP = 5;                            // a path's end, clear of the sheet and the other bundles (points)
const SHORTEST = 7;                           // a visible stretch of a path shorter than this is left out (points)
const DEEP = 0.78;                            // Sigma's greatest opacity
const caption = 'Look first at the three slices on the right: each direction of paths gives the density\'s transform on one plane of wavevectors, and as the direction turns round the great circle, the planes turn about its axis and fill the space. Left, the body, three bundles of paths in directions of one great circle, and the projected mass for one of them. The body\'s shape and the spacing of the paths are chosen for the drawing.';

const nu = new THREE.Vector3(0, 1, 0);
const dir = (deg) => { const a = (deg * Math.PI) / 180; return new THREE.Vector3(Math.cos(a), 0, Math.sin(a)); };
/** The lumpy surface: 1 plus two low harmonics about fixed axes and a few smooth knobs and dents, each
 * amp exp(-(1 - u.d) / w) about its direction d. */
const unit = (x, y, z) => new THREE.Vector3(x, y, z).normalize();
const A = unit(0.5, 0.75, 0.42), Bx = unit(-0.7, 0.2, 0.68);
const KNOBS = [[unit(0.75, 0.35, 0.55), 0.13, 0.16], [unit(-0.55, 0.55, 0.62), 0.1, 0.12], [unit(-0.3, -0.75, 0.6), 0.09, 0.14],
	[unit(0.2, 0.1, -1), 0.08, 0.2], [unit(0.95, -0.25, -0.2), -0.07, 0.1], [unit(-0.85, -0.2, -0.45), 0.07, 0.15]];
const rad = (x, y, z) => {
	const a = x * A.x + y * A.y + z * A.z, b = x * Bx.x + y * Bx.y + z * Bx.z;
	let r = 1 + 0.12 * (1.5 * a * a - 0.5) + 0.06 * (2.5 * b * b * b - 1.5 * b);
	for (const [d, amp, w] of KNOBS) r += amp * Math.exp(-(1 - (x * d.x + y * d.y + z * d.z)) / w);
	return r;
};

export default async function () {
	const { state } = await chapter(check);
	state(name, 'pass-slice', caption);
	const S = new Sheet(name);
	const L = [];
	const VL = new View({ turn: TURN, tilt: TILT, scale: SL, o: [ORIGIN - APART / 2, ORIGIN] });
	const VK = new View({ turn: TURN, tilt: TILT, scale: SK, o: [ORIGIN + APART / 2, ORIGIN] });
	const ns = PHI.map(dir);
	for (const n of ns) check(near(n.dot(nu), 0, 1e-15) && near(n.length(), 1, 1e-15), 'a direction is not on the great circle');

	// ---- the body
	const B = body([0, 0, 0], rad);
	let most = 0;
	{
		// the body's greatest radius, so that every path misses it
		for (let i = 0; i <= 180; i++) for (let j = 0; j < 360; j++) {
			const t = (i * Math.PI) / 180, f = (j * Math.PI) / 180;
			most = Math.max(most, rad(Math.sin(t) * Math.cos(f), Math.cos(t), Math.sin(t) * Math.sin(f)));
		}
		check(most < Math.min(...RHO) - 0.12, `the body reaches ${most}, near the paths`);
		window[name + '-body'] = { most };
	}
	const reach = 1.4;
	const colours = await stoneColours();
	const pic = await stonePicture(`${name}-body`, B, VL, { reach, size: 1.15, colours, px: 8 });
	S.raw(pic.svg, 2);
	S.mark(pic.outline, 0.2, 'the body');

	/** Whether the body hides the world point p: it lies inside, or the body is nearer the viewer on its line of sight
	 * (tested also a little to either side, so that a line stops just short of the body's edge). */
	const AIR = 0.8 / SL;
	const hiddenByBody = (p) => {
		if (B.f(p.x, p.y, p.z) < 0) return true;
		const q = VL.at(p), d = VL.depth(p);
		for (const [dx, dy] of [[0, 0], [AIR * SL, 0], [-AIR * SL, 0], [0, AIR * SL], [0, -AIR * SL]]) {
			const s = sight(B, VL, [q[0] + dx, q[1] + dy], reach);
			if (s && s[0] > d) return true;
		}
		return false;
	};

	// ---- the sheet across n_1
	let quadMids, grownQuad;
	const n1 = ns[0], e1 = nu.clone(), e2 = n1.clone().cross(nu).normalize();
	check(near(e2.dot(n1), 0, 1e-15) && near(e2.dot(nu), 0, 1e-15), 'the sheet\'s axes');
	const C0 = n1.clone().multiplyScalar(SHEET_AT);
	const corner = (a, b) => C0.clone().add(e1.clone().multiplyScalar(a)).add(e2.clone().multiplyScalar(b));
	const quad = [corner(SHEET, -SHEET), corner(SHEET, SHEET), corner(-SHEET, SHEET), corner(-SHEET, -SHEET)].map((p) => VL.at(p));
	/** Whether the sheet lies nearer the viewer than p, on p's line of sight. */
	const behindSheet = (p) => {
		// the line of sight p + t ez meets the sheet's plane at t = (C0 - p).n1 / (ez.n1)
		const den = VL.ez.dot(n1);
		if (Math.abs(den) < 1e-9) return false;
		const t = C0.clone().sub(p).dot(n1) / den;
		if (t <= 0) return false;
		const w = p.clone().add(VL.ez.clone().multiplyScalar(t)).sub(C0);
		return Math.abs(w.dot(e1)) <= SHEET && Math.abs(w.dot(e2)) <= SHEET;
	};
	{
		// Sigma: the body's chord along n_1 through each point of the sheet, as the alpha of a mask filled with matter's colour
		const N = 150, img = document.createElement('canvas');
		img.width = N; img.height = N;
		const ctx = img.getContext('2d'), data = ctx.createImageData(N, N);
		const grid = [];
		let most = 0;
		for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
			const a = SHEET - ((j + 0.5) / N) * 2 * SHEET, b = -SHEET + ((i + 0.5) / N) * 2 * SHEET;
			let len = 0;
			const step = 0.005;
			for (let t = -1.4 + step / 2; t < 1.4; t += step) {
				const x = a * e1.x + b * e2.x + t * n1.x, y = a * e1.y + b * e2.y + t * n1.y, z = a * e1.z + b * e2.z + t * n1.z;
				if (B.f(x, y, z) < 0) len += step;
			}
			grid.push(len);
			most = Math.max(most, len);
		}
		grid.forEach((len, k) => { data.data[4 * k + 3] = Math.round(255 * DEEP * (len / most)); });
		ctx.putImageData(data, 0, 0);
		const [P00, P10, P01] = [quad[0], quad[1], quad[3]];
		const m = [P10[0] - P00[0], P10[1] - P00[1], P01[0] - P00[0], P01[1] - P00[1], P00[0], P00[1]].map((v) => v.toFixed(3)).join(' ');
		const d = 'M' + quad.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
		S.raw(`<path d="${d}" fill="#eeebe5" fill-opacity="0.8" stroke="none"/>`, 1);
		S.raw(`<mask id="${name}-sigma" maskUnits="userSpaceOnUse" x="0" y="0" width="700" height="700" style="mask-type:alpha"><image href="${img.toDataURL('image/png')}" width="1" height="1" preserveAspectRatio="none" transform="matrix(${m})"/></mask>` +
			`<path d="${d}" fill="${MATTER}" mask="url(#${name}-sigma)"/>`, 1.1);
		S.raw(`<path d="${d}" fill="none" stroke="${DIM}" stroke-width="${SHEET_LINE}" stroke-linejoin="round"/>`, 1.2);
		S.mark([...quad, quad[0]], SHEET_LINE / 2, 'the sheet');
		const qc = quad.reduce((m, q) => [m[0] + q[0] / 4, m[1] + q[1] / 4], [0, 0]);
		grownQuad = quad.map(([x, y]) => { const L0 = Math.hypot(x - qc[0], y - qc[1]); return [x + ((x - qc[0]) / L0) * END_GAP * 1.5, y + ((y - qc[1]) / L0) * END_GAP * 1.5]; });
		quadMids = () => quad.map((q, k) => { const r = quad[(k + 1) % 4]; return [(q[0] + r[0]) / 2, (q[1] + r[1]) / 2]; });
		check(most > 1.5 && most < 2.6, `the body's longest chord ${most}`);
		window[name + '-sigma'] = { most };
	}

	/** Whether the figure point q lies outside the body's outline by at least `gap`. */
	const clearOfBody = (q, gap) => {
		if (insidePolygon(pic.outline, q)) return false;
		for (let k = 1; k < pic.outline.length; k++) {
			const [a, b] = [pic.outline[k - 1], pic.outline[k]];
			const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
			const u = L2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2)) : 0;
			if (Math.hypot(q[0] - a[0] - u * dx, q[1] - a[1] - u * dy) < gap) return false;
		}
		return true;
	};

	/** A line along world points (a polyline, sampled every `step`), cut where the body hides it; each visible run
	 * drawn behind or in front of the sheet, and where it runs in front of the stone, in the stone's fixed ink (faint). */
	const line = (path, { color, width, what, step = 0.5 / SL }) => {
		const samples = [];
		for (let i = 1; i < path.length; i++) {
			const n = Math.max(1, Math.ceil(path[i].clone().sub(path[i - 1]).length() / step));
			for (let k = i === 1 ? 0 : 1; k <= n; k++) samples.push(path[i - 1].clone().lerp(path[i], k / n));
		}
		let run = [], where = null;
		const flush = () => {
			const pts = run.map((p) => VL.at(p));
			let len = 0;
			for (let k = 1; k < pts.length; k++) len += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
			if (run.length > 1 && len >= SHORTEST) {
				const onStone = where === 'stone';
				S.path(pts, { color: onStone ? STONE_FAINT : color, width, layer: where === 'behind' ? 0.5 : 5, cap: 'butt', what: onStone ? `${what} on the stone` : what });
			}
			run = [];
		};
		for (const p of samples) {
			if (hiddenByBody(p)) { flush(); where = null; continue; }
			const q = VL.at(p);
			const w = insidePolygon(pic.outline, q) ? 'stone' : behindSheet(p) ? 'behind' : 'front';
			if (where !== null && w !== where) { const last = run[run.length - 1]; flush(); run.push(last); }
			where = w;
			run.push(p);
		}
		flush();
	};

	// ---- the great circle, faint, as one line
	{
		const n = 360;
		const pts = Array.from({ length: n + 1 }, (_, k) => dir((360 * k) / n).multiplyScalar(CIRCLE));
		line(pts, { color: FAINT, width: HAIR, what: 'the great circle', step: 0.4 / SL });
	}

	// ---- the bundles
	const ends = [];
	for (const [i, n] of ns.entries()) {
		const t = n.clone().cross(nu).normalize();
		// a ribbon of three paths beside the body: the middle one at RHO from the axis through the centre along n, at
		// RIBBON[i] degrees about it (0 along n x nu, 90 along nu); the other two SPACING either side of it, along the
		// direction of the plane across n whose image on the page is at right angles to the image of n, so that the three
		// stand evenly apart on the page
		const g = (RIBBON[i] * Math.PI) / 180;
		const mid = nu.clone().multiplyScalar(Math.sin(g) * RHO[i]).add(t.clone().multiplyScalar(Math.cos(g) * RHO[i]));
		const img = (v) => [v.dot(VL.ex), v.dot(VL.ey)];
		const [nx, ny] = img(n), nl = Math.hypot(nx, ny);
		let w = null, best = -1;
		for (let k = 0; k < 3600; k++) {
			const th = (k * Math.PI) / 3600, cand = t.clone().multiplyScalar(Math.cos(th)).add(nu.clone().multiplyScalar(Math.sin(th)));
			const [wx, wy] = img(cand), across = Math.abs(wx * ny - wy * nx) / nl;
			if (across > best) { best = across; w = cand; }
		}
		const offs = [-1, 0, 1].map((k) => mid.clone().add(w.clone().multiplyScalar(k * SPACING)));
		/** Each end of a path lies clear of the body's outline on the page, so that no path seems to stop on the body. */
		const end = (off, t0, sgn) => {
			let t = t0;
			while (!clearOfBody(VL.at(off.clone().add(n.clone().multiplyScalar(t))), END_AIR)) t += sgn * 0.05;
			check(Math.abs(t) < 3.4, 'a path cannot end clear of the body');
			return t;
		};
		/** A path of the second or third bundle stops short of the sheet and of the other bundles, by END_GAP on the page:
		 * where it first comes that near them, after its start a. */
		const short = (off, a, t1) => {
			const clear = (q) => !insidePolygon(grownQuad, q) && S.clearance({ l: q[0], r: q[0], t: q[1], b: q[1] }, (wh) => !/^bundle /.test(wh) || wh === `bundle ${i + 1}`).d >= END_GAP;
			let t = a;
			while (t < t1 && clear(VL.at(off.clone().add(n.clone().multiplyScalar(t + 0.02))))) t += 0.02;
			return t;
		};
		// the three paths start alike, each clear of the body, and end alike, the first of them to meet something
		const a = Math.min(...offs.map((off) => end(off, -HALF, -1)));
		const b = i === 0 ? SHEET_AT : Math.min(...offs.map((off) => short(off, a, end(off, DOWN[i], 1))));
		check(i === 0 || b > -0.6, 'a path ends too soon');
		for (const [k, off] of offs.entries()) {
			// the path is parallel to n and misses the body
			check(near(off.dot(n), 0, 1e-12), 'a path\'s offset');
			for (let u = -3.4; u <= 3.4; u += 0.01) { const p = off.clone().add(n.clone().multiplyScalar(u)); check(B.f(p.x, p.y, p.z) > 0.05, 'a path meets the body'); }
			const deg = k;
			const p0 = off.clone().add(n.clone().multiplyScalar(a)), p1 = off.clone().add(n.clone().multiplyScalar(b));
			line([p0, p1], { color: GREYS[i], width: PATH_W, what: `bundle ${i + 1}` });
			ends.push({ i, deg, p0, p1, n });
			if (i === 0) {
				// where the path meets the sheet, unless the body hides it
				const q = VL.at(p1);
				if (!hiddenByBody(p1)) {
					S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="0.85" fill="${INK}"/>`, 1.3);
					S.mark([q], 0.85, 'a path\'s end on the sheet');
				}
			}
		}
	}

	// ---- each bundle's name at the start of its path that starts farthest out
	const [cx, cy] = VL.at(new THREE.Vector3(0, 0, 0));
	for (let i = 0; i < 3; i++) {
		const mine = ends.filter((e) => e.i === i);
		const e = mine.reduce((best, x) => { const q = VL.at(x.p0), b = VL.at(best.p0); return Math.hypot(q[0] - cx, q[1] - cy) > Math.hypot(b[0] - cx, b[1] - cy) ? x : best; });
		const q0 = VL.at(e.p0), q1 = VL.at(e.p1), L0 = Math.hypot(q0[0] - q1[0], q0[1] - q1[1]);
		const u = [(q0[0] - q1[0]) / L0, (q0[1] - q1[1]) / L0];
		L.push(await S.clear(`\\hat n_${i + 1}`, q0[0] + u[0] * (LABEL_GAP + 1), q0[1] + u[1] * (LABEL_GAP + 1), u[0] < 0 ? 1 : 0, u[1] < 0 ? 1 : 0, u, { color: GREYS[i] }));
	}
	// Sigma, right of the sheet
	{
		const mids = quadMids();
		const m = mids.reduce((a, b) => (b[0] > a[0] ? b : a));
		L.push(await S.clear('\\Sigma_{\\hat n_1}', m[0] + LABEL_GAP + 0.5, m[1], 0, 0.5, [1, 0], { color: MATTER }));
	}

	// ---- nu, a short arrow up from the body's top
	{
		// it starts where the axis leaves the body's outline on the page, a little clear of it, so that nothing of it lies
		// on the stone
		let h = rad(0, 1, 0);
		while (!clearOfBody(VL.at(new THREE.Vector3(0, h, 0)), 0.9)) h += 0.002;
		const a = VL.at(new THREE.Vector3(0, h, 0)), b = VL.at(new THREE.Vector3(0, AXIS_TOP, 0));
		check(b[1] < a[1] - 9, 'nu is too short');
		S.arrow(a, b, { color: INK, width: VEC, head: VEC_HEAD, layer: 6, what: 'nu' });
		L.push(await S.clear('\\hat\\nu', b[0] + LABEL_GAP, b[1] + 1.5, 0, 0.5, [1, 0]));
	}

	// ---- wavevector space
	{
		const halves = [];
		const all = [...PHI, SWEEP];
		for (const [i, deg] of all.entries()) {
			const n = dir(deg), t = n.clone().cross(nu).normalize();
			check(near(t.dot(n), 0, 1e-15) && near(nu.dot(n), 0, 1e-15), 'a slice does not hold nu');
			for (const s of [1, -1]) {
				// half of the slice: the rectangle from the axis out to KW, of height 2 KH
				const pts = [nu.clone().multiplyScalar(-KH), nu.clone().multiplyScalar(KH), nu.clone().multiplyScalar(KH).add(t.clone().multiplyScalar(s * KW)), nu.clone().multiplyScalar(-KH).add(t.clone().multiplyScalar(s * KW))];
				// every point of the slice is at right angles to its n, and the axis nu lies in it
				check(pts.every((p) => near(p.dot(n), 0, 1e-12)) && near(nu.dot(n), 0, 1e-15), 'a slice is not at right angles to its direction');
				const depth = pts.reduce((sum, p) => sum + VK.depth(p), 0) / pts.length;
				halves.push({ i, s, pts, depth, dashed: i === 3 });
			}
		}
		halves.sort((a, b) => a.depth - b.depth);
		halves.forEach((h, k) => {
			const pts = h.pts.map((p) => VK.at(p));
			const layer = 2 + k * 0.1;
			// the three outer edges, from the axis's top round to its foot; the fourth is the axis
			const edge = [pts[1], pts[2], pts[3], pts[0]];
			const e = 'M' + edge.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L');
			if (h.dashed) {
				const style = fitDash(edge, [2.0, 1.6]).dash;
				S.raw(`<path d="${e}" fill="none" stroke="${DIM}" stroke-width="${SLICE_LINE}" stroke-dasharray="${style.join(' ')}" stroke-linejoin="round"/>`, layer);
			} else {
				const d = 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
				S.raw(`<path d="${d}" fill="${GREYS[h.i]}" fill-opacity="${SLICE_FILL}" stroke="none"/>`, layer);
				S.raw(`<path d="${e}" fill="none" stroke="${GREYS[h.i]}" stroke-width="${SLICE_LINE}" stroke-linejoin="round"/>`, layer + 0.05);
			}
			S.mark(edge, SLICE_LINE / 2, `slice ${h.i + 1}`);
		});
		// each slice's name under the lower of its two outer bottom corners
		for (let i = 0; i < 3; i++) {
			const c = halves.filter((h) => h.i === i).map((h) => VK.at(h.pts[3])).reduce((a, b) => (b[1] > a[1] ? b : a));
			L.push(await S.clear(`\\boldsymbol k\\cdot\\hat n_${i + 1} = 0`, c[0], c[1] + LABEL_GAP + 0.5, 0.5, 0, [0, 1], { color: GREYS[i], size: 7.5 }));
		}
		// the axis through the origin
		const a = VK.at(nu.clone().multiplyScalar(K_AXIS[0])), b = VK.at(nu.clone().multiplyScalar(K_AXIS[1]));
		S.arrow(a, b, { color: INK, width: VEC, head: VEC_HEAD, layer: 4, what: 'nu in k' });
		L.push(await S.clear('\\hat\\nu', b[0] + LABEL_GAP, b[1] + 1.5, 0, 0.5, [1, 0]));
		const o = VK.at(new THREE.Vector3(0, 0, 0));
		S.raw(`<circle cx="${n2(o[0])}" cy="${n2(o[1])}" r="1" fill="${INK}"/>`, 4.1);
		S.mark([o], 1, 'the origin');
	}

	S.checkAll(L);
	return finish(S, L, [300, 400]);
}
