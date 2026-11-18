// The pass that draws a frame: one triangle covering the screen, and for each
// pixel either the light view or a gravitational view, depending on which side
// of the divider it falls.

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> prims: array<Prim>;
// the blurred tidal column, made by the near-field passes
@group(0) @binding(2) var near_map: texture_2d<f32>;
@group(0) @binding(3) var near_sampler: sampler;
// a picture made on the CPU: the noise of one near-field exposure, or a thermal exposure's counts
@group(0) @binding(5) var image_map: texture_2d<f32>;

const MODE_LIGHT: u32 = 0u;
const MODE_THERMAL: u32 = 1u;
const MODE_NEAR: u32 = 2u;
const MODE_WAVES: u32 = 3u;
const MODE_FIELD: u32 = 4u;
const MODE_COUNTS: u32 = 5u;

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u)) * 2.0 - 1.0;
  return vec4f(xy, 0.0, 1.0);
}

fn ray_direction(uv: vec2f) -> vec3f {
  let sx = uv.x * 2.0 - 1.0;
  let sy = 1.0 - uv.y * 2.0;
  return normalize(frame.forward.xyz + sx * frame.right.w * frame.right.xyz
                                     + sy * frame.up.w * frame.up.xyz);
}

// The image map at a point of the picture, between its four nearest cells: cell (i, j) lies at uv = (i, j) / (y, z)
// of frame.image, so the picture's corner is the map's.
fn image_between(uv: vec2f) -> f32 {
  let dims = vec2i(textureDimensions(image_map));
  let p = uv * frame.image.yz;
  let base = vec2i(floor(p));
  let f = p - floor(p);
  let a = clamp(base, vec2i(0), dims - 1);
  let b = clamp(base + 1, vec2i(0), dims - 1);
  let top = mix(textureLoad(image_map, a, 0).r, textureLoad(image_map, vec2i(b.x, a.y), 0).r, f.x);
  let bottom = mix(textureLoad(image_map, vec2i(a.x, b.y), 0).r, textureLoad(image_map, b, 0).r, f.x);
  return mix(top, bottom, f.y);
}

fn near_view(uv: vec2f) -> vec3f {
  var s = textureSampleLevel(near_map, near_sampler, uv, 0.0).r;
  // one exposure: the reconstruction of the readings' noise, added to that of the scene
  if (frame.image.x != 0.0) { s += frame.image.x * image_between(uv); }
  return mass_color(1.0 - exp(-frame.tone.w * max(s, 0.0)));
}

// A thermal exposure's counts, an element to a cell of the map, each its colour times its count over the scale; drawn
// with the thermal view's tone curve.
fn counts_view(uv: vec2f) -> vec3f {
  let dims = vec2i(textureDimensions(image_map));
  let cell = clamp(vec2i(floor(uv * vec2f(dims))), vec2i(0), dims - 1);
  let x = frame.tone.x * max(textureLoad(image_map, cell, 0).rgb, vec3f(0.0));
  let m = max(x.r, max(x.g, x.b));
  let c = x / max(m, 1e-20) * (1.0 - exp(-m));
  return mix(c, vec3f(1.0), smoothstep(2.0, 40.0, m));
}

@fragment
fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let uv = pos.xy / frame.viewport.xy;
  let mode = select(frame.counts.z, frame.counts.y, pos.x < frame.viewport.z);
  var col: vec3f;
  let rd = ray_direction(uv);
  if (mode == MODE_THERMAL) {
    col = thermal_view(rd);
  } else if (mode == MODE_NEAR) {
    col = near_view(uv);
  } else if (mode == MODE_WAVES) {
    col = waves_view(rd);
  } else if (mode == MODE_FIELD) {
    col = field_view(uv, rd, pos.xy);
  } else if (mode == MODE_COUNTS) {
    col = counts_view(uv);
  } else {
    col = light_view(rd);
  }
  if (mode != MODE_LIGHT && (frame.counts.w & 2u) != 0u) {
    // a faint copy of the shapes in the ordinary picture, so they can be matched
    // to what gravity shows
    col += 0.16 * outline_view(rd);
  }
  let dither = (hash21(pos.xy + fract(frame.viewport.w) * 61.0) - 0.5) / 255.0;
  return vec4f(to_display(col) + dither, 1.0);
}
