"""Render a scene through the pinhole camera, and a small CLI.

    python -m gravcam.render SCENE --yaw 0 --pitch -0.87 --fov 0.02 --size 256 256 --out sun.npy

writes the number-radiance image (gravitons s^-1 m^-2 sr^-1) as a float64
``.npy`` array of shape (H, W), row 0 at the top. Angles are radians unless
``--degrees`` is given.
"""
from __future__ import annotations

import argparse
import math
import sys

import numpy as np

from . import camera, columns
from .scene import Scene, load_scene

QUANTITIES = {
    "number_radiance": (columns.number_radiance, "gravitons s^-1 m^-2 sr^-1"),
    "mass_column": (columns.mass_column, "kg m^-2"),
}


def render(scene: Scene, yaw: float, pitch: float, fov: float, width: int, height: int,
           quantity: str = "number_radiance", origin=None) -> np.ndarray:
    """Image of shape (H, W), float64, seen from the scene's observer (or
    ``origin``). ``fov`` is the vertical field of view; angles in radians."""
    if quantity not in QUANTITIES:
        raise ValueError(f"unknown quantity {quantity!r}; choose from {sorted(QUANTITIES)}")
    directions = camera.ray_directions(yaw, pitch, fov, width, height)
    return QUANTITIES[quantity][0](scene, directions, origin)


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python -m gravcam.render",
        description="Render the thermal number-radiance image of a scene from its observer.",
    )
    parser.add_argument("scene", metavar="SCENE", help="path to a *.scene.json file")
    parser.add_argument("--yaw", type=float, default=0.0, help="yaw, positive to the left (default 0)")
    parser.add_argument("--pitch", type=float, default=0.0, help="pitch, positive up (default 0)")
    parser.add_argument("--fov", type=float, default=None,
                        help="vertical field of view (default 60 degrees)")
    parser.add_argument("--size", type=int, nargs=2, metavar=("W", "H"), default=(256, 256),
                        help="image width and height in pixels (default 256 256)")
    parser.add_argument("--out", required=True, help="output .npy file")
    parser.add_argument("--degrees", action="store_true",
                        help="read --yaw, --pitch and --fov in degrees instead of radians")
    parser.add_argument("--quantity", choices=sorted(QUANTITIES), default="number_radiance",
                        help="what to integrate along each ray (default number_radiance)")
    return parser


def main(argv=None) -> int:
    args = _parser().parse_args(argv)
    yaw, pitch, fov = args.yaw, args.pitch, args.fov
    if args.degrees:
        yaw, pitch = math.radians(yaw), math.radians(pitch)
        fov = None if fov is None else math.radians(fov)
    if fov is None:
        fov = math.radians(60.0)
    width, height = args.size
    scene = load_scene(args.scene)
    image = render(scene, yaw, pitch, fov, width, height, quantity=args.quantity)
    with open(args.out, "wb") as handle:      # exactly the name given, no suffix added
        np.save(handle, image)
    print(f"{args.out}: {args.quantity} [{QUANTITIES[args.quantity][1]}], shape {image.shape} (H, W), "
          f"min {image.min():.6g}, max {image.max():.6g}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
