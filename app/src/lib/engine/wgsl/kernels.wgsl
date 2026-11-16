// Shared data layout and geometry. No bindings here, so these functions can be
// compiled into the frame shader and into the test probe alike.

struct Prim {
  center: vec3f,    // relative to the observer
  radius: f32,
  c_term: f32,      // |center|^2 - radius^2, computed in double precision
  shape: u32,
  flags: u32,
  pad: f32,
  thermal: vec4f,   // signed weights per metre: rgb colour-weighted, a plain
  light: vec4f,     // surface colour, a = emissive
}

struct Frame {
  right: vec4f,     // xyz; w = tan(fov/2) * aspect
  up: vec4f,        // xyz; w = tan(fov/2)
  forward: vec4f,   // xyz; w = angle of one pixel at the image centre
  viewport: vec4f,  // width, height, divider x in pixels, time in seconds
  tone: vec4f,      // thermal exposure, glare radius in pixels, light exposure, unused
  sun: vec4f,       // unit vector toward the Sun; w unused
  counts: vec4u,    // number of prims, left mode, right mode, unused
}

const FLAG_FAR: u32 = 1u;
const FLAG_SURFACE: u32 = 2u;
const FLAG_EMISSIVE: u32 = 4u;
const FLAG_GLARE: u32 = 8u;

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
