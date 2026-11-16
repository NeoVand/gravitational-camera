// The pass that draws a frame: one triangle covering the screen, and for each
// pixel either the light view or a gravitational view, depending on which side
// of the divider it falls.

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> prims: array<Prim>;

const MODE_LIGHT: u32 = 0u;
const MODE_THERMAL: u32 = 1u;

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u)) * 2.0 - 1.0;
  return vec4f(xy, 0.0, 1.0);
}

fn ray_direction(pixel: vec2f) -> vec3f {
  let sx = (pixel.x / frame.viewport.x) * 2.0 - 1.0;
  let sy = 1.0 - (pixel.y / frame.viewport.y) * 2.0;
  return normalize(frame.forward.xyz + sx * frame.right.w * frame.right.xyz
                                     + sy * frame.up.w * frame.up.xyz);
}

@fragment
fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let rd = ray_direction(pos.xy);
  let mode = select(frame.counts.z, frame.counts.y, pos.x < frame.viewport.z);
  var col: vec3f;
  if (mode == MODE_THERMAL) {
    col = thermal_view(rd);
  } else {
    col = light_view(rd);
  }
  let dither = (hash21(pos.xy + fract(frame.viewport.w) * 61.0) - 0.5) / 255.0;
  return vec4f(to_display(col) + dither, 1.0);
}
