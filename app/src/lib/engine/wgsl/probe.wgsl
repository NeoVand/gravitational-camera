// Test probe: evaluates the line integrals for a list of ray directions so the
// results can be read back and compared with the reference implementation.
// Each result holds (thermal column, tidal column, 0, 0).

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> prims: array<Prim>;
@group(0) @binding(2) var<storage, read> rays: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> results: array<vec4f>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let i = id.x;
  if (i >= arrayLength(&rays)) { return; }
  let rd = normalize(rays[i].xyz);
  results[i] = vec4f(thermal_column(rd).a, tidal_column(rd), 0.0, 0.0);
}
