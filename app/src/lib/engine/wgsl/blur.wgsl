// One direction of a separable Gaussian blur.

struct Blur {
  direction: vec2f,   // (1, 0) or (0, 1)
  sigma: f32,         // in texels
  pad: f32,
}

@group(0) @binding(0) var<uniform> blur: Blur;
@group(0) @binding(1) var source: texture_2d<f32>;
@group(0) @binding(2) var source_sampler: sampler;

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u)) * 2.0 - 1.0;
  return vec4f(xy, 0.0, 1.0);
}

@fragment
fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let size = vec2f(textureDimensions(source));
  let uv = pos.xy / size;
  let sigma = max(blur.sigma, 0.01);
  let reach = i32(clamp(ceil(3.0 * sigma), 1.0, 64.0));
  var total = 0.0;
  var weight = 0.0;
  for (var i = -reach; i <= reach; i++) {
    let w = exp(-0.5 * f32(i * i) / (sigma * sigma));
    total += w * textureSampleLevel(source, source_sampler, uv + f32(i) * blur.direction / size, 0.0).r;
    weight += w;
  }
  return vec4f(total / weight, 0.0, 0.0, 1.0);
}
