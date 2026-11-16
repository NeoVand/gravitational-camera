// The thermal view. Matter is transparent, so a pixel is the sum over objects
// of (path length inside) x (signed emissivity weight): an exact line integral.

fn thermal_column(rd: vec3f) -> vec4f {
  var acc = vec4f(0.0);
  let n = frame.counts.x;
  for (var i = 0u; i < n; i++) {
    let p = prims[i];
    acc += prim_hit(p, rd).z * p.thermal;
  }
  return acc;
}

// Sources much smaller than a pixel would vanish or flicker, so they are also
// drawn as a small Gaussian disc carrying the same total flux. This glare is a
// property of the display, not of the camera: the real blur of a gravitational
// aperture at these wavelengths is far below a pixel.
fn thermal_glare(rd: vec3f) -> vec3f {
  var acc = vec3f(0.0);
  let n = frame.counts.x;
  let sigma = max(frame.tone.y, 0.5) * frame.forward.w;
  for (var i = 0u; i < n; i++) {
    let p = prims[i];
    if ((p.flags & FLAG_GLARE) == 0u) { continue; }
    let b = dot(p.center, rd);
    if (b <= 0.0) { continue; }
    let dist = length(p.center);
    let l = p.center - b * rd;
    let theta = length(l) / dist;
    let ang = p.radius / dist;
    // mean chord (4r/3) x solid angle (pi ang^2) = flux per unit emissivity weight
    let flux = p.thermal.rgb * (4.0 / 3.0) * p.radius * 3.14159265 * ang * ang;
    let x = theta / sigma;
    // a tight core carrying the flux, plus a very faint wide halo so that a
    // source far brighter than its surroundings reads as a light, not a dot
    acc += flux * (exp(-0.5 * x * x) + 2.0e-10 * exp(-x / 16.0)) / (6.2831853 * sigma * sigma);
  }
  return acc;
}

fn thermal_view(rd: vec3f) -> vec3f {
  let x = frame.tone.x * max(thermal_column(rd).rgb + thermal_glare(rd), vec3f(0.0));
  // Compress brightness but keep the hue; only far beyond saturation does a
  // source burn out to white.
  let m = max(x.r, max(x.g, x.b));
  let c = x / max(m, 1e-20) * (1.0 - exp(-m));
  return mix(c, vec3f(1.0), smoothstep(2.0, 40.0, m));
}
