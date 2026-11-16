// Shared tools for figures modelled in 3D and drawn as SVG.
//
// A figure is a set of panels. Each panel holds 3D primitives (spheres,
// curves, arrows, shaded meshes) seen by an orthographic camera. The panel is
// drawn by a small renderer here: every primitive is projected, ordered by
// depth (an explicit `layer` comes first, so that what must lie on top does),
// and written as SVG. A sphere is a circle filled with a radial gradient
// computed from the lights, which is what a lit sphere looks like under
// orthographic projection; a curve is one continuous path, so its dashes run
// on; a mesh is triangles, each shaded from the same lights. Labels are TeX,
// set by MathJax as vector paths. One SVG unit is one point; a full-width
// figure is 504 pt wide, as in the paper.

import * as THREE from 'three';

export const INK = '#1c1a16';
export const DIM = '#5d5a52';
export const FAINT = '#8b877d';
export const RULE = '#c9c4b8';
export const ACCENT = '#b0560a';
export const ACCENT2 = '#2a67ad';
export { THREE };

// the studio, in camera space (x right, y up, z toward the viewer)
const KEY = new THREE.Vector3(-0.55, 0.72, 0.62).normalize();
const FILL = new THREE.Vector3(0.85, -0.15, 0.5).normalize();
const VIEW = new THREE.Vector3(0, 0, 1);

const hex = (c) => '#' + c.getHexString();

function shadeNormal(base, n, o = {}) {
	const { ambient = 0.3, key = 0.8, fill = 0.14, wrap = 0.3, spec = 0.3, shininess = 30, rim = 0 } = o;
	const kd = Math.max(0, (n.dot(KEY) + wrap) / (1 + wrap));
	const fd = Math.max(0, n.dot(FILL));
	const h = KEY.clone().add(VIEW).normalize();
	const s = spec * Math.pow(Math.max(0, n.dot(h)), shininess);
	const r = rim * Math.pow(1 - Math.max(0, n.dot(VIEW)), 3);
	const c = base.clone().multiplyScalar(ambient + key * kd + fill * fd);
	const q = (x) => Math.round(Math.min(1, x) * 72) / 72;
	return new THREE.Color(q(c.r + s + r), q(c.g + s + r), q(c.b + s + r));
}

export class Panel {
	/** A panel `w` by `h` points at (x, y) in the figure, looking down -z at (cx, cy), `scale` points per unit. */
	constructor({ x = 0, y = 0, w, h, cx = 0, cy = 0, scale = 40, tilt = 0, turn = 0 }) {
		Object.assign(this, { x, y, w, h, scale });
		this.items = [];
		this.labels = [];
		// orientation: turn about the vertical, then tilt about the horizontal (degrees)
		this.rot = new THREE.Matrix4()
			.makeRotationX(THREE.MathUtils.degToRad(tilt))
			.multiply(new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(turn)));
		this.centre = new THREE.Vector3(cx, cy, 0);
	}

	/** Camera-space coordinates of a world point (x right, y up, z toward the viewer). */
	cam(p) {
		return p.clone().sub(this.centre).applyMatrix4(this.rot);
	}

	/** Figure coordinates (points, y down) of a world point. */
	at(p) {
		const q = this.cam(p);
		return [this.x + this.w / 2 + q.x * this.scale, this.y + this.h / 2 - q.y * this.scale];
	}

	sphere(c, r, color, o = {}) {
		this.items.push({ kind: 'sphere', c, r, color: new THREE.Color(color), o, layer: o.layer ?? 0, depth: this.cam(c).z });
		return this;
	}

	curve(points, { color = INK, width = 0.6, dash = null, opacity = 1, layer = 0, cap = 'round' } = {}) {
		const depth = points.reduce((s, p) => s + this.cam(p).z, 0) / points.length;
		this.items.push({ kind: 'curve', points, color, width, dash, opacity, layer, depth, cap });
		return this;
	}

	polygon(points, { fill = INK, stroke = 'none', width = 0, opacity = 1, layer = 0 } = {}) {
		const depth = points.reduce((s, p) => s + this.cam(p).z, 0) / points.length;
		this.items.push({ kind: 'polygon', points, fill, stroke, width, opacity, layer, depth });
		return this;
	}

	/** An arrow from `a` to `b` drawn in the screen plane: a shaft and a filled head `head` points long. */
	arrow(a, b, { color = INK, width = 0.6, head = 4.2, layer = 1, both = false } = {}) {
		this.items.push({ kind: 'arrow', a, b, color, width, head, layer, both, depth: (this.cam(a).z + this.cam(b).z) / 2 });
		return this;
	}

	/** A shaded mesh from three.js geometry, placed by `matrix`; each face lit by the studio. */
	mesh(geometry, color, { matrix = new THREE.Matrix4(), layer = 0, o = {}, cull = true, opacity = 1 } = {}) {
		const g = geometry.index ? geometry.toNonIndexed() : geometry;
		const pos = g.attributes.position;
		const nor = g.attributes.normal;
		const nm = new THREE.Matrix3().getNormalMatrix(matrix);
		const base = new THREE.Color(color);
		const tris = [];
		for (let i = 0; i < pos.count; i += 3) {
			const P = [0, 1, 2].map((k) => new THREE.Vector3().fromBufferAttribute(pos, i + k).applyMatrix4(matrix));
			const C = P.map((p) => this.cam(p));
			let n;
			if (nor && o.smooth !== false) {
				n = new THREE.Vector3();
				for (let k = 0; k < 3; k++) n.add(new THREE.Vector3().fromBufferAttribute(nor, i + k));
				n.applyMatrix3(nm).transformDirection(this.rot).normalize();
			} else {
				n = new THREE.Vector3().subVectors(C[1], C[0]).cross(new THREE.Vector3().subVectors(C[2], C[0])).normalize();
			}
			const facing = new THREE.Vector3().subVectors(C[1], C[0]).cross(new THREE.Vector3().subVectors(C[2], C[0])).z;
			if (cull && facing <= 0) continue;
			// a face we see must have its normal toward us (generated normals sometimes point inward)
			if (n.z < 0) n.negate();
			const faceBase = o.colorAt ? new THREE.Color(o.colorAt(P[0].clone().add(P[1]).add(P[2]).divideScalar(3))) : base;
			const col = shadeNormal(faceBase, n, o);
			tris.push({ kind: 'tri', P, fill: hex(col), layer, opacity: 1, depth: (C[0].z + C[1].z + C[2].z) / 3 });
		}
		if (opacity < 1 || o.group) {
			const depth = tris.reduce((s, t) => s + t.depth, 0) / Math.max(1, tris.length);
			this.items.push({ kind: 'group', tris, opacity, layer, depth });
		} else {
			this.items.push(...tris);
		}
		return this;
	}

	label(src, p, { size = 8.5, anchor = 'cc', color = INK, dx = 0, dy = 0, text = false } = {}) {
		const [x, y] = Array.isArray(p) ? [this.x + p[0], this.y + p[1]] : this.at(p);
		this.labels.push(tex(text ? `\\text{${src}}` : src, [x + dx, y + dy], size, anchor, color));
		return this;
	}

	/** The panel as SVG: defs (gradients) and drawing. */
	render(id) {
		const defs = [];
		const out = [];
		const items = [...this.items].sort((a, b) => a.layer - b.layer || a.depth - b.depth);
		let g = 0;
		const pt = (p) => this.at(p).map((v) => +v.toFixed(2)).join(',');
		for (const it of items) {
			if (it.kind === 'sphere') {
				const [x, y] = this.at(it.c);
				const r = it.r * this.scale;
				const o = it.o;
				// the gradient: sample the studio shading along the line through the highlight
				const gid = `${id}-g${g++}`;
				const hl = KEY.clone().add(VIEW).normalize();
				const fx = 0.5 + 0.5 * hl.x * 0.9, fy = 0.5 - 0.5 * hl.y * 0.9;
				const stops = [];
				for (const t of [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1]) {
					// a point on the sphere a fraction t of the way from the highlight to the far rim
					const dir = new THREE.Vector3(-hl.x, -hl.y, 0).normalize();
					const s = hl.clone().multiplyScalar(1 - t);
					const q = new THREE.Vector3(hl.x * (1 - t) + dir.x * t, hl.y * (1 - t) + dir.y * t, 0);
					const z2 = Math.max(0, 1 - q.x * q.x - q.y * q.y);
					const n = new THREE.Vector3(q.x, q.y, Math.sqrt(z2)).normalize();
					void s;
					stops.push(`<stop offset="${t}" stop-color="${hex(shadeNormal(it.color, n, o))}"/>`);
				}
				defs.push(`<radialGradient id="${gid}" cx="0.5" cy="0.5" r="0.5" fx="${fx.toFixed(3)}" fy="${fy.toFixed(3)}">${stops.join('')}</radialGradient>`);
				const stroke = o.outline ? ` stroke="${o.outline}" stroke-width="${o.outlineWidth ?? 0.35}"` : '';
				out.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}" fill="url(#${gid})"${stroke}${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}/>`);
			} else if (it.kind === 'curve') {
				const d = 'M' + it.points.map(pt).join('L');
				const dash = it.dash ? ` stroke-dasharray="${it.dash.join(' ')}"` : '';
				out.push(`<path d="${d}" fill="none" stroke="${it.color}" stroke-width="${it.width}" stroke-linecap="${it.cap}" stroke-linejoin="round"${dash}${it.opacity < 1 ? ` stroke-opacity="${it.opacity}"` : ''}/>`);
			} else if (it.kind === 'polygon') {
				out.push(`<path d="M${it.points.map(pt).join('L')}Z" fill="${it.fill}" stroke="${it.stroke}" stroke-width="${it.width}"${it.opacity < 1 ? ` opacity="${it.opacity}"` : ''}/>`);
			} else if (it.kind === 'tri') {
				const d = `M${it.P.map(pt).join('L')}Z`;
				const last = out.length ? out[out.length - 1] : '';
				const key = `fill="${it.fill}" stroke="${it.fill}" stroke-width="0.18" stroke-linejoin="round"${it.opacity < 1 ? ` opacity="${it.opacity}"` : ''}/>`;
				if (last.endsWith(key) && last.startsWith('<path d="')) {
					out[out.length - 1] = last.replace('" ' + key, d + '" ' + key);
				} else {
					out.push(`<path d="${d}" ${key}`);
				}
			} else if (it.kind === 'group') {
				const sub = new Panel({ x: this.x, y: this.y, w: this.w, h: this.h, scale: this.scale });
				sub.rot = this.rot; sub.centre = this.centre;
				sub.items = it.tris;
				out.push(`<g opacity="${it.opacity}">${sub.render(id + 'g' + g++).body}</g>`);
			} else if (it.kind === 'raw') {
				out.push(it.svg);
			} else if (it.kind === 'arrow') {
				const A = this.at(it.a), B = this.at(it.b);
				const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
				const u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], w = [-u[1], u[0]];
				const hd = Math.min(it.head, 0.6 * L), hw = 0.36 * hd;
				const head = (P, s) => {
					const base = [P[0] - s * u[0] * hd, P[1] - s * u[1] * hd];
					return `<path d="M${P[0].toFixed(2)},${P[1].toFixed(2)}L${(base[0] + w[0] * hw).toFixed(2)},${(base[1] + w[1] * hw).toFixed(2)}L${(base[0] - w[0] * hw).toFixed(2)},${(base[1] - w[1] * hw).toFixed(2)}Z" fill="${it.color}"/>`;
				};
				const s0 = it.both ? [A[0] + u[0] * hd * 0.8, A[1] + u[1] * hd * 0.8] : A;
				const s1 = [B[0] - u[0] * hd * 0.8, B[1] - u[1] * hd * 0.8];
				out.push(`<path d="M${s0[0].toFixed(2)},${s0[1].toFixed(2)}L${s1[0].toFixed(2)},${s1[1].toFixed(2)}" stroke="${it.color}" stroke-width="${it.width}" fill="none"/>`);
				out.push(head(B, 1));
				if (it.both) out.push(head(A, -1));
			}
		}
		return { defs: defs.join(''), body: out.join('') };
	}
}

/** A curve through the ellipse with semi-axes a, b turned by `angle`, in the plane z. */
export function ellipsePoints(cx, cy, z, a, b, angle = 0, n = 240) {
	const pts = [];
	const ca = Math.cos(angle), sa = Math.sin(angle);
	for (let k = 0; k <= n; k++) {
		const t = (2 * Math.PI * k) / n;
		const x = a * Math.cos(t), y = b * Math.sin(t);
		pts.push(new THREE.Vector3(cx + ca * x - sa * y, cy + sa * x + ca * y, z));
	}
	return pts;
}

export const v3 = (x, y, z = 0) => new THREE.Vector3(x, y, z);

/** A TeX label as vector paths at `at` (figure points); anchor: horizontal l/c/r, vertical t/c/b. */
export async function tex(src, at, size = 8.5, anchor = 'cc', color = INK) {
	const node = await window.MathJax.tex2svgPromise(src, { display: false });
	const svg = node.querySelector('svg');
	const vb = svg.getAttribute('viewBox').split(/\s+/).map(Number);
	const s = size / 1000;
	const W = vb[2] * s, H = vb[3] * s;
	const ax = { l: 0, c: 0.5, r: 1 }[anchor[0]];
	const ay = { t: 0, c: 0.5, b: 1 }[anchor[1]];
	const x = at[0] - ax * W, y = at[1] - ay * H;
	const inner = svg.innerHTML.replace(/currentColor/g, color);
	return `<g transform="translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${s}) translate(${-vb[0]},${-vb[1]})" fill="${color}" stroke="${color}" stroke-width="0">${inner}</g>`;
}

/** The figure: panels and their labels, w by h points, no background. */
export async function figure(w, h, panels, extra = []) {
	const defs = [], body = [];
	panels.forEach((p, i) => {
		const r = p.render(`p${i}`);
		defs.push(r.defs);
		body.push(r.body);
	});
	const labels = await Promise.all([...panels.flatMap((p) => p.labels), ...extra]);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}pt" height="${h}pt" viewBox="0 0 ${w} ${h}"><defs>${defs.join('')}</defs>${body.join('')}${labels.join('')}</svg>`;
}

/** Another drawing (an SVG made elsewhere, e.g. a matplotlib chart), placed at (x, y) and w points wide. */
export async function inset(url, x, y, w) {
	const text = await (await fetch(url)).text();
	const vb = text.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
	const h = (w * vb[3]) / vb[2];
	const inner = text.replace(/<\?xml[^>]*\?>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
	return { svg: `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb.join(' ')}" overflow="visible">${inner}</svg>`, h };
}

/** A closed region bounded by an outer and an inner loop (an annulus), filled evenodd. */
Panel.prototype.annulus = function (outer, inner, { fill, stroke = 'none', width = 0, layer = 0, depthBias = 0 } = {}) {
	const depth = outer.reduce((s, p) => s + this.cam(p).z, 0) / outer.length + depthBias;
	this.items.push({ kind: 'annulus', outer, inner, fill, stroke, width, layer, depth });
	return this;
};

const _render = Panel.prototype.render;
Panel.prototype.render = function (id) {
	// annuli are drawn by a small wrapper: turn them into polygons with holes
	const pt = (p) => this.at(p).map((v) => +v.toFixed(2)).join(',');
	this.items = this.items.map((it) => it.kind === 'annulus'
		? { ...it, kind: 'raw', svg: `<path fill-rule="evenodd" d="M${it.outer.map(pt).join('L')}Z${it.inner ? 'M' + it.inner.map(pt).join('L') + 'Z' : ''}" fill="${it.fill}" stroke="${it.stroke}" stroke-width="${it.width}"/>` }
		: it);
	return _render.call(this, id);
};

/** An engraved object (black ink on transparency, figures3d/sprites/), with what the figure needs to know of it. */
export async function sprite(url) {
	const blob = await (await fetch(url)).blob();
	const href = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
	const img = new Image();
	img.src = href;
	await img.decode();
	const c = document.createElement('canvas');
	c.width = img.width; c.height = img.height;
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const alpha = ctx.getImageData(0, 0, img.width, img.height).data;
	const a = (x, y) => alpha[(y * img.width + x) * 4 + 3];
	return {
		href, w: img.width, h: img.height,
		/** Leftmost and rightmost inked pixel in a row (fractions of the width), or null. */
		span(fy) {
			const y = Math.min(img.height - 1, Math.max(0, Math.round(fy * (img.height - 1))));
			let l = -1, r = -1;
			for (let x = 0; x < img.width; x++) if (a(x, y) > 40) { if (l < 0) l = x; r = x; }
			return l < 0 ? null : [l / img.width, (r + 1) / img.width];
		},
		/** The row (fraction of the height) where the drawing reaches farthest right: a lens, a nose. */
		rightmostRow() {
			let best = 0, row = 0;
			for (let y = 0; y < img.height; y++) for (let x = img.width - 1; x >= 0; x--) if (a(x, y) > 40) { if (x > best) { best = x; row = y; } break; }
			return row / img.height;
		},
		/** The <image>, placed with its lower left at (x, y) points and `height` points tall. */
		place(x, y, height, opacity = 1) {
			const width = (height * img.width) / img.height;
			return `<image class="ink" href="${href}" x="${x.toFixed(2)}" y="${(y - height).toFixed(2)}" width="${width.toFixed(2)}" height="${height.toFixed(2)}"${opacity < 1 ? ` opacity="${opacity}"` : ''} preserveAspectRatio="none"/>`;
		}
	};
}
