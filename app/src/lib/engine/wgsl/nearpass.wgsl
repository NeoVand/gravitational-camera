// Passes that prepare the near-field view, drawn at reduced resolution:
// first the tidal column of every line of sight, then a Gaussian blur along
// one axis at a time. The blur stands for the limit that noise puts on
// near-field resolution.

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> prims: array<Prim>;

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u)) * 2.0 - 1.0;
  return vec4f(xy, 0.0, 1.0);
}

@fragment
fn fs_column(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  // viewport.xy holds this target's own size while this pass runs
  let uv = pos.xy / frame.viewport.xy;
  let sx = uv.x * 2.0 - 1.0;
  let sy = 1.0 - uv.y * 2.0;
  let rd = normalize(frame.forward.xyz + sx * frame.right.w * frame.right.xyz
                                       + sy * frame.up.w * frame.up.xyz);
  return vec4f(tidal_column(rd), 0.0, 0.0, 1.0);
}
