// The pass that draws a frame: one triangle covering the screen, and for each
// pixel either the light view or a gravitational view, depending on which side
// of the divider it falls.

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> prims: array<Prim>;
// the blurred tidal column, made by the near-field passes
@group(0) @binding(2) var near_map: texture_2d<f32>;
@group(0) @binding(3) var near_sampler: sampler;

const MODE_LIGHT: u32 = 0u;
const MODE_THERMAL: u32 = 1u;
const MODE_NEAR: u32 = 2u;
const MODE_WAVES: u32 = 3u;
const MODE_FIELD: u32 = 4u;

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

fn near_view(uv: vec2f) -> vec3f {
  let s = textureSampleLevel(near_map, near_sampler, uv, 0.0).r;
  return mass_color(1.0 - exp(-frame.tone.w * max(s, 0.0)));
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
