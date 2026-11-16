// The wave view. Each rotor is a point in its own radiation, so the camera
// sees a spot: the image of a point through an aperture of width D at the
// waves' wavelength, about lambda / D across. Brightness follows the energy
// flux; colour follows the circular polarization, which tells the sense of
// rotation as the camera sees it.

struct WaveSource {
  dir: vec3f,       // unit vector from the observer toward the rotor
  width: f32,       // standard deviation of the spot, radians
  axis: vec3f,      // unit vector along the angular velocity
  weight: f32,      // peak brightness relative to the brightest spot
  circular: f32,    // V / I: +1 turning anticlockwise as seen, -1 clockwise, 0 edge-on
  linear: f32,      // Q / I along the projected axis
  pad0: f32,
  pad1: f32,
}

@group(0) @binding(4) var<storage, read> sources: array<WaveSource>;

// Colours for the sense of turning, kept apart from heat (warm) and mass
// (blue): magenta anticlockwise, green clockwise, pale for edge-on.
const WAVE_ANTICLOCKWISE = vec3f(0.98, 0.34, 0.86);
const WAVE_CLOCKWISE = vec3f(0.40, 0.95, 0.46);
const WAVE_EDGE_ON = vec3f(0.93, 0.93, 0.88);

fn waves_view(rd: vec3f) -> vec3f {
  let n = u32(frame.near.y);
  var intensity = 0.0;
  var circular = 0.0;
  for (var i = 0u; i < n; i++) {
    let s = sources[i];
    // angle between the ray and the source, accurate for small angles
    let theta = 2.0 * asin(min(0.5 * length(rd - s.dir), 1.0));
    let x = theta / s.width;
    let g = s.weight * exp(-0.5 * x * x);
    intensity += g;
    circular += g * s.circular;
  }
  let level = 1.0 - exp(-frame.near.z * intensity);
  let v = circular / max(intensity, 1e-30);
  let hue = mix(WAVE_EDGE_ON, select(WAVE_CLOCKWISE, WAVE_ANTICLOCKWISE, v > 0.0), abs(v));
  // the brightest cores burn toward white, as a bright light does
  return mix(hue * level, vec3f(1.0), 0.5 * smoothstep(0.9, 1.0, level));
}
