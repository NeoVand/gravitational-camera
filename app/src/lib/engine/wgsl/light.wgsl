// The ordinary camera: opaque surfaces, a sky, the Sun's disc. This half exists
// for comparison, so it is a plausible picture and not a physical simulation.

fn star_field(rd: vec3f) -> vec3f {
  var acc = vec3f(0.0);
  // two layers of cells at different scales give a spread of star densities
  for (var layer = 0; layer < 2; layer++) {
    let scale = select(90.0, 240.0, layer == 1);
    let g = rd * scale;
    let cell = floor(g);
    let h = hash33(cell + f32(layer) * 31.7);
    let pos = cell + 0.15 + 0.7 * hash33(cell * 1.7 + 5.3);
    let d = length(g - pos);
    let lit = step(select(0.93, 0.80, layer == 1), h.x);
    let mag = pow(h.y, select(6.0, 9.0, layer == 1)) * select(2.5, 0.9, layer == 1) + 0.04;
    let tint = mix(vec3f(1.0, 0.86, 0.72), vec3f(0.75, 0.85, 1.0), h.z);
    acc += lit * mag * tint * smoothstep(0.16, 0.0, d);
  }
  return acc;
}

fn sky_color(rd: vec3f, sun: vec3f) -> vec3f {
  let alt = rd.y;
  let sun_alt = sun.y;
  let day = smoothstep(-0.10, 0.12, sun_alt);
  let dusk = smoothstep(-0.32, -0.02, sun_alt) * (1.0 - smoothstep(0.0, 0.30, sun_alt));
  let horizon = pow(1.0 - clamp(alt, 0.0, 1.0), 5.0);

  let night = mix(vec3f(0.0030, 0.0045, 0.0100), vec3f(0.016, 0.022, 0.036), horizon);
  let noon = mix(vec3f(0.07, 0.19, 0.52), vec3f(0.45, 0.60, 0.80), horizon);
  var col = mix(night, noon, day);

  // warm band near the horizon on the Sun's side at dawn and dusk
  let flat_sun = normalize(vec3f(sun.x, 0.0, sun.z) + vec3f(0.0, 0.0, 1e-6));
  let flat_rd = normalize(vec3f(rd.x, 0.0, rd.z) + vec3f(0.0, 0.0, 1e-6));
  let toward = pow(max(dot(flat_sun, flat_rd), 0.0), 3.0);
  col += dusk * horizon * mix(vec3f(0.10, 0.04, 0.03), vec3f(0.85, 0.32, 0.08), toward);

  // glow around the Sun when it is up
  let mu = max(dot(rd, sun), 0.0);
  col += day * (0.35 * pow(mu, 64.0) + 3.0 * pow(mu, 2000.0)) * vec3f(1.0, 0.93, 0.80);

  col += (1.0 - day) * (1.0 - 0.8 * horizon) * star_field(rd);
  return col;
}

fn light_view(rd: vec3f) -> vec3f {
  let sun = frame.sun.xyz;
  let day = smoothstep(-0.10, 0.12, sun.y);

  var t_near = 1e30;
  var hit = -1;
  let n = frame.counts.x;
  for (var i = 0u; i < n; i++) {
    let p = prims[i];
    if ((p.flags & FLAG_SURFACE) == 0u) { continue; }
    let s = sphere_hit(p, rd);
    if (s.z > 0.0 && s.x > 0.0 && s.x < t_near) {
      t_near = s.x;
      hit = i32(i);
    }
  }

  var col = sky_color(rd, sun);
  if (hit >= 0) {
    let p = prims[hit];
    if ((p.flags & FLAG_EMISSIVE) != 0u) {
      // the Sun's disc, far brighter than anything else in view
      col += 40.0 * p.light.rgb;
    } else {
      let pos = t_near * rd;
      let normal = normalize(pos - p.center);
      let grain = 0.35 + 1.5 * fbm(pos.xz * 0.6) * (0.4 + fbm(pos.xz * 0.013 + 3.0));
      let albedo = p.light.rgb * grain;
      let direct = max(dot(normal, sun), 0.0) * day * vec3f(1.0, 0.95, 0.86) * 2.2;
      // at night the ground is lit by a faint moon-and-starlight blue
      let ambient = mix(vec3f(0.045, 0.060, 0.095), vec3f(0.30, 0.38, 0.50), day);
      var ground = albedo * (direct + ambient);
      // distant ground fades into the sky at the horizon
      let haze = 1.0 - exp(-t_near / 60000.0);
      ground = mix(ground, sky_color(normalize(vec3f(rd.x, 0.02, rd.z)), sun), 0.85 * haze);
      col = ground;
    }
  }
  return vec3f(1.0) - exp(-frame.tone.z * col);
}
