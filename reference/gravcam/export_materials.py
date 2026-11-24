"""Export the spectra of the paper's table of materials for the tutorial's figure GlowBound (chapter 10.3).

    python -m gravcam.export_materials [out]      # run from reference/; default out:
                                                  # app/src/lib/tutorial/live/glow-bound-data.ts
    npx prettier --write <out>                    # from app/, to keep the file as checked in

The figure draws Re eta(omega) of each material of tab:materials and integrates its glow at any temperature, so what
it needs is not a sampled curve but each channel's few numbers, as materials.py builds them: the electrons' weight and
collision time (or, for iron, only the weight of the ceiling), each Raman line's weight averaged over directions, its
centre and full width, the glass's flat band, water's two Maxwell and two shear-inertia elements, and each crystal's
atoms per volume and Debye frequency for the pairs of phonons. Beside them, the reference's own results at 293 K for
the app's tests: for every material, with its pairs and with its main channel alone, the weight (2/pi) int Re eta,
eta_eff, P/V, the number emissivity per steradian, the mean energy in k_BT and the shares of the glow bound
(glowbounds.how_close). Iron's ceiling has no finite weight, and the placeholder none at all; for them only the
glow is exported. Numbers are written to ten significant figures; the file holds no dates or paths.
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

from . import glowbounds as B
from . import materials as M

REPO = Path(__file__).resolve().parents[2]
DEFAULT_OUT = REPO / "app" / "src" / "lib" / "tutorial" / "live" / "glow-bound-data.ts"


def num(x: float) -> str:
    """Ten significant figures, as JavaScript reads them."""
    s = f"{x:.10g}"
    return s.replace("e+", "e")


def obj(d: dict) -> str:
    return "{ " + ", ".join(f"{k}: {v if isinstance(v, str) else num(v)}" for k, v in d.items()) + " }"


def diamond_structure(p: dict, element: str) -> tuple[dict, dict]:
    """The Raman line and the pairs of a diamond-structure crystal, as materials._diamond_structure builds them."""
    n = 8.0 / p["a0"] ** 3
    mass = M.MASS[element] * M.AMU
    rho = n * mass
    bulk, shear = M.cubic_hill(p["c11"], p["c12"], p["c44"])
    c_t = math.sqrt(shear / rho)
    c_l = math.sqrt((bulk + 4.0 * shear / 3.0) / rho)
    omega_d = M.debye_frequency(n, c_t, c_l)
    weight = 0.6 * M.internal_strain_softening(mass, p["omega0"], p["zeta"], p["a0"])
    return (
        {"kind": "'line'", "weight": weight, "omega0": p["omega0"], "width": p["width"]},
        {"kind": "'pairs'", "n": n, "omegaD": omega_d},
    )


def channels() -> dict[str, tuple[list[dict], dict | None]]:
    """Each material's channels other than its pairs, and its pairs (or None)."""
    si_line, si_pairs = diamond_structure(M.SI, "Si")
    di_line, di_pairs = diamond_structure(M.DIAMOND, "C")
    water = [{"kind": "'maxwell'", "eta0": eta0, "tau": 1.0 / (f * M.THZ)} for eta0, f in M.WATER_MAXWELL]
    water += [
        {"kind": "'inertia'", "eta0": eta0, "tauM": 1.0 / (fm * M.THZ), "tau0": 1.0 / (f0 * M.THZ)}
        for eta0, fm, f0 in M.WATER_INERTIA
    ]
    return {
        "copper": (
            [{"kind": "'drude'", "weight": M.electron_weight(M.CU_N), "tau": M.CU_TAU, "n": M.CU_N}],
            {"kind": "'pairs'", "n": M.CU_N, "omegaD": M.debye_omega(M.CU_THETA)},
        ),
        "iron": (
            [{"kind": "'ceiling'", "weight": M.electron_weight(2.0 * M.FE_N), "n": 2.0 * M.FE_N}],
            {"kind": "'pairs'", "n": M.FE_N, "omegaD": M.debye_omega(M.FE_THETA)},
        ),
        "silicon": ([si_line], si_pairs),
        "diamond": ([di_line], di_pairs),
        "silica": ([{"kind": "'band'", "weight": M.SILICA["mu"], "omegaMax": M.SILICA["omega_max"]}], None),
        "water": (water, None),
        "placeholder": ([{"kind": "'flat'", "eta": M.PLACEHOLDER}], None),
    }


def results(material: M.Material, finite_weight: bool) -> dict:
    T = M.ROOM
    p = M.power_per_volume(material, T)
    jn = M.number_emissivity(material, T)
    out = {
        "etaEff": M.effective_friction(material, T),
        "power": p,
        "number": jn,
        "meanKT": p / (4 * math.pi * jn * M.kB * T),
    }
    if finite_weight:
        close = B.how_close(material, T)
        out |= {"weight": close["weight"], "powerShare": close["power_fraction"],
                "countShare": close["count_fraction"]}
    return out


def main(out: Path) -> None:
    table = {**M.table(), "placeholder": M.placeholder()}
    lines = [
        "/**",
        " * The spectra of the paper's tab:materials, for chapter 10.3's interactive GlowBound (GlowBound.svelte): each",
        " * material's channels of friction against a uniform shear, as reference/gravcam/materials.py builds them, in SI",
        " * units (weights in Pa, frictions in Pa s, angular frequencies in s⁻¹, times in s, numbers per m³). A 'drude' is",
        " * the free electrons' weight·τ/(1 + ω²τ²), with the collision time τ of 293 K; a 'ceiling' the most free electrons",
        " * can give at each ω, weight/2ω (iron); a 'line' weight·ω₀²Γ/[(ω₀² − ω²)² + Γ²ω²], its weight already 3/5 of",
        " * Kleinman's (three of five shears, averaged over directions) and Γ its full width; a 'band' (π/2)·weight/ω_max",
        " * below ω_max (silica); 'maxwell' η₀/(1 + ω²τ²) and 'inertia' η₀/[(1 − ω²τ₀²)² + (ωτ₀²/τ_m)²] (water, Schulz",
        " * et al. 2020); a 'flat' friction (the placeholder); and 'pairs' of phonons in a Debye solid of n atoms per m³,",
        " * (9π/64)(2/3)nħω³/ω_D³ coth(ħω/4k_BT) below 2ω_D. `REFERENCE` holds the reference's own results at 293 K,",
        " * with each crystal's pairs (`withPairs`) and with its main channel alone (`alone`): the weight (2/π)∫Re η dω",
        " * (where finite), η_eff, P/V, the number emissivity per steradian, Ē/k_BT and the shares of eq:glow-bound.",
        " *",
        " * Generated by reference/gravcam/export_materials.py (cd reference && python -m gravcam.export_materials, then",
        " * prettier); do not edit by hand.",
        " */",
        "",
        "export type Channel =",
        "\t| { readonly kind: 'drude'; readonly weight: number; readonly tau: number; readonly n: number }",
        "\t| { readonly kind: 'ceiling'; readonly weight: number; readonly n: number }",
        "\t| { readonly kind: 'line'; readonly weight: number; readonly omega0: number; readonly width: number }",
        "\t| { readonly kind: 'band'; readonly weight: number; readonly omegaMax: number }",
        "\t| { readonly kind: 'maxwell'; readonly eta0: number; readonly tau: number }",
        "\t| { readonly kind: 'inertia'; readonly eta0: number; readonly tauM: number; readonly tau0: number }",
        "\t| { readonly kind: 'flat'; readonly eta: number }",
        "\t| { readonly kind: 'pairs'; readonly n: number; readonly omegaD: number };",
        "",
        "export type MaterialId = 'copper' | 'iron' | 'silicon' | 'diamond' | 'silica' | 'water' | 'placeholder';",
        "",
        "export interface MaterialData {",
        "\t/** The channels other than the pairs of phonons. */",
        "\treadonly channels: readonly Channel[];",
        "\t/** The pairs of phonons, in a crystal. */",
        "\treadonly pairs?: Channel;",
        "}",
        "",
        "export interface Result {",
        "\treadonly etaEff: number;",
        "\treadonly power: number;",
        "\treadonly number: number;",
        "\treadonly meanKT: number;",
        "\treadonly weight?: number;",
        "\treadonly powerShare?: number;",
        "\treadonly countShare?: number;",
        "}",
        "",
        "/** The temperature of the table, K, and the placeholder friction, Pa s. */",
        f"export const ROOM = {num(M.ROOM)};",
        f"export const PLACEHOLDER = {num(M.PLACEHOLDER)};",
        "",
        "export const MATERIALS: Record<MaterialId, MaterialData> = {",
    ]
    chans = channels()
    for key, (main, pairs) in chans.items():
        lines.append(f"\t{key}: {{")
        lines.append("\t\tchannels: [")
        for c in main:
            lines.append(f"\t\t\t{obj(c)},")
        lines.append("\t\t]" + ("," if pairs else ""))
        if pairs:
            lines.append(f"\t\tpairs: {obj(pairs)}")
        lines.append("\t},")
    lines[-1] = "\t}"
    lines.append("};")
    lines.append("")
    lines.append("export const REFERENCE: Record<MaterialId, { readonly withPairs: Result; readonly alone: Result }> = {")
    for key, m in table.items():
        finite = key not in ("iron", "placeholder")
        whole = results(m, finite)
        alone = results(M.Material(m.name, (m.terms[0],)), finite)
        lines.append(f"\t{key}: {{")
        lines.append(f"\t\twithPairs: {obj(whole)},")
        lines.append(f"\t\talone: {obj(alone)}")
        lines.append("\t},")
    lines[-1] = "\t}"
    lines.append("};")
    lines.append("")
    out.write_text("\n".join(lines))
    print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUT)
