// Test probe: evaluates the thermal line integral for a list of ray directions
// so the result can be read back and compared with the reference implementation.

@group(0) @binding(0) var<uniform> frame: Frame;
@group(0) @binding(1) var<storage, read> prims: array<Prim>;
@group(0) @binding(2) var<storage, read> rays: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> results: array<vec4f>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let i = id.x;
  if (i >= arrayLength(&rays)) { return; }
  results[i] = thermal_column(normalize(rays[i].xyz));
}
