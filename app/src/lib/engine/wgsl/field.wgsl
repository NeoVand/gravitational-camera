// The field view: the tidal tensor E_ij = d_i d_j Phi of the scene's mass,
// sampled on a slice through the scene, drawn in the manner of diffusion
// tensor imaging. Every point of space holds such a tensor; a pixel of the
// camera records it where the pixel sits, and the image is computed from many
// of them.
//
// Spheres are point masses outside (and isotropic, so invisible here, inside);
// boxes use the closed form of reference/gravcam/tidal.py. Units are those of
// the packed density contrast, mass.x = (rho - rho_parent) / sRef; G is left
// out because only ratios are drawn.

// atan(a / b) on [-pi/2, pi/2], safe when b is zero.
fn atan_ratio(a: f32, b: f32) -> f32 {
  let s = select(-1.0, 1.0, b >= 0.0);
  return atan2(a * s, b * s);
}

// ln((z_high + r_high) / (z_low + r_low)) with r = sqrt(u2 + z^2), z_low < z_high,
// without cancellation at negative z.
fn log_ratio_along(u2: f32, z_low: f32, z_high: f32) -> f32 {
  let r_low = sqrt(u2 + z_low * z_low);
  let r_high = sqrt(u2 + z_high * z_high);
  var ratio: f32;
  if (z_low >= 0.0) {
    ratio = (z_high + r_high) / (z_low + r_low);
  } else if (z_high < 0.0) {
    ratio = (r_low - z_low) / (r_high - z_high);
  } else {
    ratio = (z_high + r_high) * (r_low - z_low) / max(u2, 1e-12);
  }
  return log(max(ratio, 1e-30));
}

// Tidal tensor of a uniform box at the point x (observer-relative), per unit density.
fn box_tidal(p: Prim, x: vec3f) -> mat3x3f {
  let lo = p.center - p.half.xyz - x;
  let hi = p.center + p.half.xyz - x;
  let X = array<f32, 2>(lo.x, hi.x);
  let Y = array<f32, 2>(lo.y, hi.y);
  let Z = array<f32, 2>(lo.z, hi.z);
  var xx = 0.0;
  var yy = 0.0;
  var zz = 0.0;
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      for (var k = 0; k < 2; k++) {
        let sgn = select(-1.0, 1.0, ((i + j + k) & 1) == 1);
        let r = sqrt(X[i] * X[i] + Y[j] * Y[j] + Z[k] * Z[k]);
        xx += sgn * atan_ratio(Y[j] * Z[k], X[i] * r);
        yy += sgn * atan_ratio(Z[k] * X[i], Y[j] * r);
        zz += sgn * atan_ratio(X[i] * Y[j], Z[k] * r);
      }
    }
  }
  var xy = 0.0;
  var yz = 0.0;
  var zx = 0.0;
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      let sgn = select(-1.0, 1.0, i == j);
      xy -= sgn * log_ratio_along(X[i] * X[i] + Y[j] * Y[j], Z[0], Z[1]);
      yz -= sgn * log_ratio_along(Y[i] * Y[i] + Z[j] * Z[j], X[0], X[1]);
      zx -= sgn * log_ratio_along(Z[i] * Z[i] + X[j] * X[j], Y[0], Y[1]);
    }
  }
  return mat3x3f(vec3f(xx, xy, zx), vec3f(xy, yy, yz), vec3f(zx, yz, zz));
}

// Tidal tensor of a uniform sphere at x, per unit density: a point mass outside.
fn sphere_tidal(p: Prim, x: vec3f) -> mat3x3f {
  let d = x - p.center;
  let r2 = dot(d, d);
  let r = sqrt(r2);
  if (r <= p.radius) {
    // inside: (4 pi / 3) delta_ij, which has no anisotropy to draw
    return mat3x3f(vec3f(4.18879, 0.0, 0.0), vec3f(0.0, 4.18879, 0.0), vec3f(0.0, 0.0, 4.18879));
  }
  let volume = 4.18879 * p.radius * p.radius * p.radius;
  let n = d / r;
  let k = volume / (r2 * r);
  return k * (mat3x3f(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 1.0, 0.0), vec3f(0.0, 0.0, 1.0))
              - 3.0 * mat3x3f(n * n.x, n * n.y, n * n.z));
}

fn tidal_at(x: vec3f) -> mat3x3f {
  var e = mat3x3f(vec3f(0.0), vec3f(0.0), vec3f(0.0));
  let n = frame.counts.x;
  for (var i = 0u; i < n; i++) {
    let p = prims[i];
    let rho = p.mass.x;
    if (rho == 0.0) { continue; }
    if (p.shape == SHAPE_BOX) {
      e += rho * box_tidal(p, x);
    } else {
      e += rho * sphere_tidal(p, x);
    }
  }
  return e;
}

// Eigenvector of a symmetric traceless matrix for its most negative eigenvalue:
// the direction along which free particles are pulled apart. Also returns the
// size of the matrix, sqrt(sum of squares / 2), in w.
fn stretch_axis(m: mat3x3f) -> vec4f {
  let p1 = m[0][1] * m[0][1] + m[0][2] * m[0][2] + m[1][2] * m[1][2];
  let p2 = m[0][0] * m[0][0] + m[1][1] * m[1][1] + m[2][2] * m[2][2] + 2.0 * p1;
  let size = sqrt(0.5 * p2);
  if (size < 1e-30) { return vec4f(0.0, 0.0, 1.0, 0.0); }
  let p = sqrt(p2 / 6.0);
  let b = m * (1.0 / p);
  let r = clamp(0.5 * determinant(b), -1.0, 1.0);
  let phi = acos(r) / 3.0;
  let lowest = 2.0 * p * cos(phi + 2.0943951);
  let a = m - lowest * mat3x3f(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 1.0, 0.0), vec3f(0.0, 0.0, 1.0));
  // the eigenvector is orthogonal to the rows of a: take the best-conditioned cross product
  let c0 = cross(a[0], a[1]);
  let c1 = cross(a[1], a[2]);
  let c2 = cross(a[2], a[0]);
  var v = c0;
  if (dot(c1, c1) > dot(v, v)) { v = c1; }
  if (dot(c2, c2) > dot(v, v)) { v = c2; }
  return vec4f(normalize(v), size);
}

// The traceless tidal tensor at the point where the ray along rd crosses the slice.
fn slice_tensor(rd: vec3f) -> mat3x3f {
  let f = frame.forward.xyz;
  let x = rd * (frame.field.x / max(dot(rd, f), 1e-3));
  var e = tidal_at(x);
  let tr = (e[0][0] + e[1][1] + e[2][2]) / 3.0;
  return e - tr * mat3x3f(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 1.0, 0.0), vec3f(0.0, 0.0, 1.0));
}

// Strength on a logarithmic scale, 0 to 1, relative to the slice's typical value.
fn field_level(size: f32) -> f32 {
  return smoothstep(-2.0, 0.6, log(max(size, 1e-30) / frame.field.y) / 2.302585);
}

// Direction of view through a pixel, as in frame.wgsl's ray_direction.
fn pixel_ray(pixel: vec2f) -> vec3f {
  let sx = pixel.x / frame.viewport.x * 2.0 - 1.0;
  let sy = 1.0 - pixel.y / frame.viewport.y * 2.0;
  return normalize(frame.forward.xyz + sx * frame.right.w * frame.right.xyz
                                     + sy * frame.up.w * frame.up.xyz);
}

const FIELD_CELL: f32 = 26.0;

fn field_view(uv: vec2f, rd: vec3f, pixel: vec2f) -> vec3f {
  let base = near_view(uv);
  if (dot(rd, frame.forward.xyz) <= 1e-3) { return base; }
  let s = stretch_axis(slice_tensor(rd));
  let level = field_level(s.w);
  let screen = vec3f(dot(s.xyz, frame.right.xyz), dot(s.xyz, frame.up.xyz),
                     dot(s.xyz, frame.forward.xyz));
  // diffusion-tensor colours: red across, green up and down, blue along the
  // line of sight, scaled so the strongest component is full
  let hue = abs(screen) / max(max(abs(screen.x), abs(screen.y)), max(abs(screen.z), 1e-6));
  // muted, so the image underneath still reads
  let tone = mix(vec3f(0.62), hue, 0.72) * (0.4 + 0.6 * level);
  var col = mix(base * 0.85, tone, frame.field.z * level);

  // one stroke per cell, along the stretching as it lies across the view,
  // taken at the cell's centre so that it does not shimmer
  let cell = floor(pixel / FIELD_CELL);
  let centre = (cell + 0.5) * FIELD_CELL;
  let c = stretch_axis(slice_tensor(pixel_ray(centre)));
  let across = vec2f(dot(c.xyz, frame.right.xyz), -dot(c.xyz, frame.up.xyz)); // pixel y runs down
  let inplane = length(across);
  let half = 0.42 * FIELD_CELL * field_level(c.w) * inplane;
  if (half > 1.0) {
    let dir = across / inplane;
    let d = pixel - centre;
    let along = clamp(dot(d, dir), -half, half);
    let gap = length(d - along * dir);
    let stroke = 1.0 - smoothstep(0.45, 1.15, gap);
    col = mix(col, vec3f(1.0), 0.38 * stroke);
  }
  return col;
}
