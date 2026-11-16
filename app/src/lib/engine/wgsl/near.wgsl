// The near-field view. What a tidal camera reconstructs is the "tidal column":
// mass along each line of sight, weighted by the inverse of its distance. For a
// ray inside a uniform body from distance a to b that is density x ln(b / a).

fn tidal_column(rd: vec3f) -> f32 {
  let r_min = frame.near.x;
  var s = 0.0;
  let n = frame.counts.x;
  for (var i = 0u; i < n; i++) {
    let p = prims[i];
    let h = prim_hit(p, rd);
    if (h.z > 0.0 && h.y > r_min) {
      s += p.mass.x * log(h.y / max(h.x, r_min));
    }
  }
  return s;
}

// A colour scale for mass, kept apart from the warm scale used for heat:
// black through deep blue and teal to white.
fn mass_color(v: f32) -> vec3f {
  let x = clamp(v, 0.0, 1.0);
  let c0 = vec3f(0.0, 0.0, 0.0);
  let c1 = vec3f(0.03, 0.10, 0.32);
  let c2 = vec3f(0.05, 0.42, 0.62);
  let c3 = vec3f(0.55, 0.86, 0.84);
  let c4 = vec3f(1.0, 1.0, 1.0);
  if (x < 0.25) { return mix(c0, c1, x / 0.25); }
  if (x < 0.55) { return mix(c1, c2, (x - 0.25) / 0.30); }
  if (x < 0.85) { return mix(c2, c3, (x - 0.55) / 0.30); }
  return mix(c3, c4, (x - 0.85) / 0.15);
}
