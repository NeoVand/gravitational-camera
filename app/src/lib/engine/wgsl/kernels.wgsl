// Shared data layout and geometry. No bindings here, so these functions can be
// compiled into the frame shader and into the test probe alike.

struct Prim {
  center: vec3f,    // relative to the observer
  radius: f32,      // sphere radius, or the radius enclosing a box
  c_term: f32,      // |center|^2 - radius^2, computed in double precision
  shape: u32,       // 0 sphere, 1 axis-aligned box
  flags: u32,
  pad: f32,
  half: vec4f,      // half extents of a box
  thermal: vec4f,   // signed weights per metre: rgb colour-weighted, a plain
  mass: vec4f,      // x: signed density over the reference tidal column
  light: vec4f,     // surface colour, a = emissive
}

struct Frame {
  right: vec4f,     // xyz; w = tan(fov/2) * aspect
  up: vec4f,        // xyz; w = tan(fov/2)
  forward: vec4f,   // xyz; w = angle of one pixel at the image centre
  viewport: vec4f,  // width, height, divider x in pixels, time in seconds
  tone: vec4f,      // thermal exposure, glare radius in pixels, light exposure, near-field exposure
  sun: vec4f,       // unit vector toward the Sun; w unused
  near: vec4f,      // x: exclusion radius around the observer; y: number of wave sources; z: wave exposure
  counts: vec4u,    // number of prims, left mode, right mode, flags (1: room lighting, 2: outline of the light picture in the gravity views)
  field: vec4f,     // field view: depth of the slice (m), typical tensor size there, opacity; w unused
  look: vec4f,      // field view's look: contrast of the wash (1 as first drawn), decades added to the strength scale, colour by (0 direction, 1 strength, 2 stretch against squeeze), darkness of the strokes' edge
  strokes: vec4f,   // field view's strokes: cell in pixels (0 for none), half length in cells, half weight in pixels; w unused
}

const FLAG_FAR: u32 = 1u;
const FLAG_SURFACE: u32 = 2u;
const FLAG_EMISSIVE: u32 = 4u;
const FLAG_GLARE: u32 = 8u;
const FLAG_MIRROR: u32 = 16u;
const FLAG_SCREEN: u32 = 32u;
const FLAG_PRINT: u32 = 64u;
const SHAPE_BOX: u32 = 1u;

// Ray from the observer along unit vector rd, against a sphere.
// Returns (near distance, far distance, path length inside); all zero on a miss.
fn sphere_hit(p: Prim, rd: vec3f) -> vec3f {
  let b = dot(p.center, rd);
  var h2: f32;
  if ((p.flags & FLAG_FAR) != 0u) {
    // Far away: subtract the along-ray part first, then square.
    let l = p.center - b * rd;
    h2 = p.radius * p.radius - dot(l, l);
  } else {
    // Nearby or around the observer: c_term is exact, so use it.
    h2 = b * b - p.c_term;
  }
  if (h2 <= 0.0) { return vec3f(0.0); }
  let h = sqrt(h2);
  if (p.c_term <= 0.0) {
    let t1 = max(b + h, 0.0);
    return vec3f(0.0, t1, t1);
  }
  if (b <= 0.0) { return vec3f(0.0); }
  let t1 = b + h;
  return vec3f(p.c_term / t1, t1, 2.0 * h);
}

// The same for an axis-aligned box, by the slab method.
fn box_hit(p: Prim, rd: vec3f) -> vec3f {
  let d = select(rd, vec3f(1e-12), abs(rd) < vec3f(1e-12));
  let a = (p.center - p.half.xyz) / d;
  let b = (p.center + p.half.xyz) / d;
  let lo = min(a, b);
  let hi = max(a, b);
  let t0 = max(max(lo.x, max(lo.y, lo.z)), 0.0);
  let t1 = min(hi.x, min(hi.y, hi.z));
  if (t1 <= t0) { return vec3f(0.0); }
  return vec3f(t0, t1, t1 - t0);
}

fn prim_hit(p: Prim, rd: vec3f) -> vec3f {
  if (p.shape == SHAPE_BOX) { return box_hit(p, rd); }
  return sphere_hit(p, rd);
}

// The same for a ray that starts at `ro` instead of at the observer.
fn prim_hit_from(p: Prim, ro: vec3f, rd: vec3f) -> vec3f {
  var q = p;
  q.center = p.center - ro;
  q.c_term = dot(q.center, q.center) - p.radius * p.radius;
  q.flags = p.flags & ~FLAG_FAR;
  return prim_hit(q, rd);
}

// Outward normal at a point on an object's surface (relative to the observer).
fn prim_normal(p: Prim, pos: vec3f) -> vec3f {
  let v = pos - p.center;
  if (p.shape == SHAPE_BOX) {
    let q = abs(v) / p.half.xyz;
    if (q.x > q.y && q.x > q.z) { return vec3f(sign(v.x), 0.0, 0.0); }
    if (q.y > q.z) { return vec3f(0.0, sign(v.y), 0.0); }
    return vec3f(0.0, 0.0, sign(v.z));
  }
  return normalize(v);
}

fn hash11(x: f32) -> f32 {
  return fract(sin(x * 127.1) * 43758.5453123);
}

fn hash21(p: vec2f) -> f32 {
  let q = fract(p * vec2f(0.1031, 0.1030));
  let r = q + dot(q, q.yx + 33.33);
  return fract((r.x + r.y) * r.x);
}

fn hash33(p: vec3f) -> vec3f {
  var q = fract(p * vec3f(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yxz + 33.33);
  return fract((q.xxy + q.yxx) * q.zyx);
}

fn value_noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2f(1.0, 0.0)), u.x),
             mix(hash21(i + vec2f(0.0, 1.0)), hash21(i + vec2f(1.0, 1.0)), u.x), u.y);
}

fn fbm(p: vec2f) -> f32 {
  var a = 0.5;
  var s = 0.0;
  var q = p;
  for (var i = 0; i < 4; i++) {
    s += a * value_noise(q);
    q = q * 2.03 + vec2f(17.1, 9.2);
    a *= 0.5;
  }
  return s;
}

fn to_display(c: vec3f) -> vec3f {
  return pow(clamp(c, vec3f(0.0), vec3f(1.0)), vec3f(1.0 / 2.2));
}
