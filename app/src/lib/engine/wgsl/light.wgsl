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

// Nearest opaque surface along a ray from `ro`; returns (distance, index) or a negative index.
fn nearest_surface(ro: vec3f, rd: vec3f) -> vec2f {
  var t_near = 1e30;
  var hit = -1.0;
  let n = frame.counts.x;
  for (var i = 0u; i < n; i++) {
    let p = prims[i];
    if ((p.flags & FLAG_SURFACE) == 0u) { continue; }
    let s = prim_hit_from(p, ro, rd);
    if (s.z > 0.0 && s.x > 1e-4 && s.x < t_near) {
      t_near = s.x;
      hit = f32(i);
    }
  }
  return vec2f(t_near, hit);
}

// Position on the face of a box that was hit, each coordinate from -1 to 1.
fn face_uv(p: Prim, pos: vec3f, normal: vec3f) -> vec2f {
  let q = (pos - p.center) / max(p.half.xyz, vec3f(1e-6));
  if (abs(normal.z) > 0.5) { return vec2f(q.x * sign(normal.z), q.y); }
  if (abs(normal.x) > 0.5) { return vec2f(-q.z * sign(normal.x), q.y); }
  return vec2f(q.x, q.z);
}

// What a television shows: an evening landscape, drawn from a few curves.
fn screen_picture(uv: vec2f) -> vec3f {
  if (max(abs(uv.x), abs(uv.y)) > 0.955) { return vec3f(0.012); }   // the bezel
  let sky = mix(vec3f(1.0, 0.55, 0.22), vec3f(0.16, 0.30, 0.62), smoothstep(-0.2, 0.9, uv.y));
  let sun = smoothstep(0.17, 0.15, length(uv - vec2f(0.35, 0.05)));
  var col = sky + sun * vec3f(1.2, 0.9, 0.5);
  let far = 0.02 + 0.16 * sin(uv.x * 3.1 + 1.0) + 0.05 * sin(uv.x * 9.0);
  let near = -0.36 + 0.14 * sin(uv.x * 2.2 - 0.7) + 0.04 * sin(uv.x * 13.0 + 2.0);
  col = mix(col, vec3f(0.20, 0.17, 0.30), smoothstep(far + 0.01, far - 0.01, uv.y));
  col = mix(col, vec3f(0.05, 0.07, 0.10), smoothstep(near + 0.01, near - 0.01, uv.y));
  return col * 1.25;
}

// A printed page: a heading and lines of words, as dark marks on paper.
fn print_page(uv: vec2f, paper: vec3f) -> vec3f {
  let x = uv.x * 0.5 + 0.5;
  let y = 0.5 - uv.y * 0.5;
  if (x < 0.1 || x > 0.9 || y < 0.07 || y > 0.94) { return paper; }
  let rows = 26.0;
  let row = floor(y * rows);
  let within = fract(y * rows);
  var ink = 0.0;
  if (row == 2.0) {
    ink = step(0.2, within) * step(within, 0.85) * step(x, 0.62);          // heading
  } else if (row > 3.0) {
    let word = floor(x * 34.0 + hash11(row) * 7.0);
    let gap = step(0.22, hash21(vec2f(word, row)));                         // spaces between words
    let end = step(x, 0.42 + 0.48 * hash11(row * 3.7 + 1.0)) + step(0.5, f32(i32(row) % 6));
    ink = step(0.32, within) * step(within, 0.68) * gap * min(end, 1.0);
  }
  return mix(paper, vec3f(0.07, 0.07, 0.09), ink);
}

fn room_backdrop(rd: vec3f) -> vec3f {
  return mix(vec3f(0.045, 0.05, 0.06), vec3f(0.10, 0.105, 0.115), 0.5 + 0.5 * rd.y);
}

// --- the room's appearance ------------------------------------------------------
// Distances to the drawn surfaces, for soft shadows and ambient occlusion.

fn sdf_prim(p: Prim, x: vec3f) -> f32 {
  let d = x - p.center;
  if (p.shape == SHAPE_BOX) {
    let q = abs(d) - p.half.xyz;
    return length(max(q, vec3f(0.0))) + min(max(q.x, max(q.y, q.z)), 0.0);
  }
  return length(d) - p.radius;
}

fn scene_sdf(x: vec3f) -> f32 {
  var best = 1e9;
  let n = frame.counts.x;
  for (var i = 0u; i < n; i++) {
    let p = prims[i];
    if ((p.flags & FLAG_SURFACE) == 0u) { continue; }
    best = min(best, sdf_prim(p, x));
  }
  return best;
}

// Soft shadow toward the light: how open the way is, 0 to 1.
fn soft_shadow(x: vec3f, l: vec3f) -> f32 {
  var open = 1.0;
  var t = 0.03;
  for (var i = 0; i < 24; i++) {
    let h = scene_sdf(x + t * l);
    open = min(open, 6.0 * max(h, 0.0) / t);
    if (open < 0.01 || t > 9.0) { break; }
    t += clamp(h, 0.02, 0.6);
  }
  return smoothstep(0.0, 1.0, clamp(open, 0.0, 1.0));
}

// Ambient occlusion from a few steps along the normal.
fn occlusion(x: vec3f, n: vec3f) -> f32 {
  var occ = 0.0;
  var w = 1.0;
  for (var i = 1; i <= 5; i++) {
    let h = 0.02 + 0.09 * f32(i);
    occ += w * max(h - scene_sdf(x + h * n), 0.0);
    w *= 0.72;
  }
  return clamp(1.0 - 1.5 * occ, 0.25, 1.0);
}

// Edges of boxes softened, as if bevelled: the normal leans toward the
// neighbouring faces within a couple of centimetres of an edge.
fn bevelled_normal(p: Prim, x: vec3f, normal: vec3f) -> vec3f {
  if (p.shape != SHAPE_BOX) { return normal; }
  let d = x - p.center;
  let r = min(0.025, 0.3 * min(p.half.x, min(p.half.y, p.half.z)));
  let edge = smoothstep(p.half.xyz - r, p.half.xyz, abs(d)) * sign(d);
  let lean = edge * (vec3f(1.0) - abs(normal));
  return normalize(normal + 0.9 * lean);
}

// Surface patterns, chosen by the material's texture (packed in prim.pad).
const TEX_WOOD: f32 = 1.0;
const TEX_METAL: f32 = 2.0;
const TEX_PLASTER: f32 = 3.0;
const TEX_CONCRETE: f32 = 4.0;
const TEX_FABRIC: f32 = 5.0;

fn textured(p: Prim, x: vec3f, normal: vec3f, base: vec3f) -> vec3f {
  let kind = p.pad;
  // coordinates across the face that was hit
  var uv = x.xz;
  if (abs(normal.x) > 0.5) { uv = x.zy; } else if (abs(normal.z) > 0.5) { uv = x.xy; }
  if (kind == TEX_WOOD) {
    // planks 18 cm wide with long grain and dark seams
    let plank = floor(uv.x / 0.18);
    let along = uv.y + hash11(plank) * 7.0;
    let grain = fbm(vec2f(uv.x * 40.0, along * 2.2)) * 0.5 + fbm(vec2f(uv.x * 9.0, along * 0.6)) * 0.5;
    let shade = 0.82 + 0.3 * hash11(plank * 3.1) + 0.22 * (grain - 0.5);
    let seam = smoothstep(0.004, 0.0, abs(fract(uv.x / 0.18) - 0.5) - 0.495)
             + smoothstep(0.004, 0.0, abs(fract(along / 1.6) - 0.5) - 0.497);
    return base * shade * (1.0 - 0.35 * clamp(seam, 0.0, 1.0));
  }
  if (kind == TEX_METAL) {
    // brushed: fine streaks in one direction
    let streak = fbm(vec2f(uv.x * 3.0, uv.y * 160.0));
    return base * (0.92 + 0.14 * streak);
  }
  if (kind == TEX_PLASTER) {
    return base * (0.95 + 0.07 * fbm(uv * 1.3) + 0.03 * fbm(uv * 11.0));
  }
  if (kind == TEX_CONCRETE) {
    let speck = step(0.93, hash21(floor(uv * 180.0)));
    return base * (0.9 + 0.14 * fbm(uv * 2.0) + 0.06 * fbm(uv * 20.0) - 0.08 * speck);
  }
  if (kind == TEX_FABRIC) {
    let weave = 0.5 + 0.25 * sin(uv.x * 900.0) * sin(uv.y * 900.0);
    return base * (0.9 + 0.12 * weave + 0.06 * fbm(uv * 8.0));
  }
  return base * (0.94 + 0.12 * fbm(x.xz * 3.0 + x.y * 2.0));
}

const KEY_LIGHT = vec3f(0.45, 0.8, 0.4);

// Colour of a point on a surface: a warm key light with a soft shadow, a cool
// light from the open sky above, light bounced from the floor, and ambient
// occlusion. With `plain` set, pictures, print and reflections are left out
// and the shading is kept simple: that is all the outline in the gravity views
// needs.
fn room_surface(p: Prim, pos: vec3f, flat_normal: vec3f, rd: vec3f, plain: bool) -> vec3f {
  if (!plain && (p.flags & FLAG_SCREEN) != 0u && abs(flat_normal.z) > 0.5) {
    return screen_picture(face_uv(p, pos, flat_normal));
  }
  var albedo = p.light.rgb;
  if (!plain && (p.flags & FLAG_PRINT) != 0u && abs(flat_normal.z) > 0.5) {
    albedo = print_page(face_uv(p, pos, flat_normal), albedo);
  }
  let key = normalize(KEY_LIGHT);
  if (plain) {
    let lambert = max(dot(flat_normal, key), 0.0);
    return albedo * (0.35 + 0.9 * lambert);
  }
  let normal = bevelled_normal(p, pos, flat_normal);
  albedo = textured(p, pos, flat_normal, albedo);
  let shadow = soft_shadow(pos + flat_normal * 3e-3, key);
  let ao = occlusion(pos, flat_normal);
  let direct = max(dot(normal, key), 0.0) * shadow * vec3f(1.0, 0.95, 0.86) * 1.55;
  let sky = vec3f(0.30, 0.34, 0.42) * (0.55 + 0.45 * normal.y);
  let bounce = vec3f(0.16, 0.13, 0.10) * (0.5 - 0.5 * normal.y);
  var col = albedo * (direct + (sky + bounce) * ao);
  // metal: a highlight from the key light and a sheen from the room
  if (p.pad == TEX_METAL) {
    let h = normalize(key - rd);
    let spec = pow(max(dot(normal, h), 0.0), 60.0) * shadow;
    let fresnel = pow(1.0 - max(dot(normal, -rd), 0.0), 4.0);
    col += vec3f(1.0, 0.97, 0.92) * spec * 0.9 + vec3f(0.22, 0.24, 0.27) * fresnel * ao;
  } else {
    // a little light glancing off surfaces seen edge-on
    col += 0.035 * pow(1.0 - max(dot(normal, -rd), 0.0), 3.0) * ao;
  }
  return col;
}

// An indoor scene, with one reflection in any mirror.
fn room_view(rd: vec3f, plain: bool) -> vec3f {
  var ro = vec3f(0.0);
  var dir = rd;
  var tint = vec3f(1.0);
  var col = room_backdrop(rd);
  for (var bounce = 0; bounce < 2; bounce++) {
    let found = nearest_surface(ro, dir);
    if (found.y < 0.0) {
      col = tint * room_backdrop(dir);
      break;
    }
    let p = prims[u32(found.y)];
    let pos = ro + found.x * dir;
    let normal = prim_normal(p, pos);
    if (!plain && (p.flags & FLAG_MIRROR) != 0u && bounce == 0 && abs(normal.z) > 0.5) {
      tint = vec3f(0.84, 0.87, 0.88);
      ro = pos + normal * 2e-3;
      dir = reflect(dir, normal);
      continue;
    }
    col = tint * room_surface(p, pos, normal, dir, plain);
    break;
  }
  // a filmic curve (Narkowicz's fit to ACES): deeper shadows, softer highlights
  let x = frame.tone.z * 0.8 * col;
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), vec3f(0.0), vec3f(1.0));
}

fn light_view(rd: vec3f) -> vec3f {
  if ((frame.counts.w & 1u) != 0u) { return room_view(rd, false); }
  let sun = frame.sun.xyz;
  let day = smoothstep(-0.10, 0.12, sun.y);

  var t_near = 1e30;
  var hit = -1;
  let n = frame.counts.x;
  for (var i = 0u; i < n; i++) {
    let p = prims[i];
    if ((p.flags & FLAG_SURFACE) == 0u) { continue; }
    let s = prim_hit(p, rd);
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
      let normal = prim_normal(p, pos);
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

// The outline drawn under the gravity views: shapes and shading only. A picture
// on a screen, a printed text or a reflection carries no mass, so it must not
// leak into a gravitational image through its outline either.
fn outline_view(rd: vec3f) -> vec3f {
  if ((frame.counts.w & 1u) != 0u) { return room_view(rd, true); }
  return light_view(rd);
}
