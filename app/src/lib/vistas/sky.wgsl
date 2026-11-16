// The sky, seen through a pinhole camera, optionally past a black hole.
// Left of the divider: light (the model Milky Way with stars). Right: either
// the millihertz waves of the Galaxy's white-dwarf pairs or the primordial
// graviton background. Directions are in the galactic frame: x toward the
// Galaxy's centre, y toward longitude 90 degrees, z toward the north pole.

const PI: f32 = 3.14159265358979;

struct Frame {
  forward: vec4f,   // xyz; w: divider, 0 to 1 across the canvas
  right: vec4f,     // xyz; w: tan of half the horizontal field of view
  up: vec4f,        // xyz; w: tan of half the vertical field of view
  hole: vec4f,      // xyz: direction from the camera to the hole; w: 1 with a hole, 0 without
  dipole: vec4f,    // xyz: direction of our motion through the background; w: speed / c
  params: vec4f,    // x: shadow radius (rad); y: mean temperature (K); z: colour range (K); w: 0 waves, 1 primordial
  size: vec4f,      // x, y: canvas pixels; z: entries in the lens table; w: unused
};

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var skyLight: texture_2d<f32>;
@group(0) @binding(2) var skyWaves: texture_2d<f32>;
@group(0) @binding(3) var skySampler: sampler;
@group(0) @binding(4) var<storage, read> lens: array<f32>;

@vertex
fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let p = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  return vec4f(p * 2.0 - 1.0, 0.0, 1.0);
}

// galactic longitude decreases from +180 degrees at the texture's left edge
fn equirect(d: vec3f) -> vec2f {
  let l = atan2(d.y, d.x);
  let b = asin(clamp(d.z, -1.0, 1.0));
  return vec2f((PI - l) / (2.0 * PI), (0.5 * PI - b) / PI);
}

// Where on the sky at infinity the ray seen along d came from (xyz), and
// whether it fell into the hole instead (w = 1).
fn bend(d: vec3f) -> vec4f {
  if (frame.hole.w < 0.5) { return vec4f(d, 0.0); }
  let h = frame.hole.xyz;
  let psi = acos(clamp(dot(d, h), -1.0, 1.0));
  if (psi < frame.params.x) { return vec4f(d, 1.0); }
  let n = frame.size.z;
  let pos = psi / PI * (n - 1.0);
  let i = u32(floor(pos));
  let j = min(i + 1u, u32(n) - 1u);
  var a = lens[i];
  var c = lens[j];
  if (a < 0.0) { a = c; }
  if (c < 0.0) { c = a; }
  let sweep = mix(a, c, fract(pos));
  // in the plane of the hole, the camera and the ray, the ray's position at
  // infinity has turned by `sweep` from the camera's, away from the hole
  let e = -h;
  let across = d - dot(d, e) * e;
  let len = length(across);
  if (len < 1e-6) { return vec4f(d, 0.0); }
  let t = across / len;
  return vec4f(cos(sweep) * e + sin(sweep) * t, 0.0);
}

fn ramp(stops: array<vec3f, 4>, x: f32) -> vec3f {
  let s = clamp(x, 0.0, 1.0) * 3.0;
  let k = min(u32(floor(s)), 2u);
  return mix(stops[k], stops[k + 1u], s - f32(k));
}

// the paper's colours: dark, the accent, a pale cream, white
fn thermal(x: f32) -> vec3f {
  return ramp(array<vec3f, 4>(
    vec3f(0.043, 0.047, 0.063), vec3f(0.690, 0.337, 0.039),
    vec3f(0.965, 0.863, 0.710), vec3f(1.0, 1.0, 1.0)), x);
}

// blue for cooler, cream for the mean, orange for warmer: x from -1 to 1
fn diverging(x: f32) -> vec3f {
  let t = clamp(x, -1.0, 1.0);
  let cool = vec3f(0.165, 0.404, 0.678);
  let mid = vec3f(0.969, 0.953, 0.925);
  let warm = vec3f(0.690, 0.337, 0.039);
  if (t < 0.0) { return mix(mid, cool, -t); }
  return mix(mid, warm, t);
}

@fragment
fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let ndc = vec2f(pos.x / frame.size.x * 2.0 - 1.0, 1.0 - pos.y / frame.size.y * 2.0);
  let d = normalize(frame.forward.xyz
    + ndc.x * frame.right.w * frame.right.xyz
    + ndc.y * frame.up.w * frame.up.xyz);
  let s = bend(d);
  if (s.w > 0.5) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  let uv = equirect(s.xyz);
  if (pos.x < frame.forward.w * frame.size.x) {
    return vec4f(textureSampleLevel(skyLight, skySampler, uv, 0.0).rgb, 1.0);
  }
  if (frame.params.w < 0.5) {
    let v = textureSampleLevel(skyWaves, skySampler, uv, 0.0).r;
    return vec4f(thermal(v), 1.0);
  }
  // the background as seen moving through it, with the mean already warmed by the potential
  let beta = frame.dipole.w;
  let gamma = 1.0 / sqrt(1.0 - beta * beta);
  let T = frame.params.y / (gamma * (1.0 - beta * dot(s.xyz, frame.dipole.xyz)));
  return vec4f(diverging((T - frame.params.y) / frame.params.z), 1.0);
}
