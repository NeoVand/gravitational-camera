"""A small scene that mixes the shapes in every way the contract allows:
a sphere inside a box, a box inside that sphere, a second box beside the
sphere in the same parent, and a sphere beside the box with a box inside it.
Sizes are of order one metre, the observer is outside everything."""
import copy

MIXED = {
    "name": "mixed",
    "observer": {"position": [0.3, 0.2, 6.0], "exclusion": 0.5},
    "materials": {
        "rock": {"density": 3000, "temperature": 300, "friction": 1e-3},
        "foam": {"density": 50, "temperature": 310, "friction": 2e-3},
        "lead": {"density": 11000, "temperature": 320, "friction": 3e-3},
        "water": {"density": 1000, "temperature": 330, "friction": 4e-3},
        "iron": {"density": 8000, "temperature": 340, "friction": 5e-3},
    },
    "objects": [
        {"id": "crate", "material": "rock",
         "shape": {"type": "box", "center": [0, 0, 0], "size": [4, 3, 2]}},
        {"id": "bubble", "parent": "crate", "material": "foam",
         "shape": {"type": "sphere", "center": [-0.8, 0.2, 0.1], "radius": 0.8}},
        {"id": "ingot", "parent": "bubble", "material": "lead",
         "shape": {"type": "box", "center": [-0.9, 0.1, 0.2], "size": [0.6, 0.4, 0.5]}},
        {"id": "slot", "parent": "crate", "material": "water",
         "shape": {"type": "box", "center": [1.2, -0.5, 0.3], "size": [0.8, 1.2, 0.9]}},
        {"id": "ball", "material": "iron",
         "shape": {"type": "sphere", "center": [3.5, 1.0, -0.5], "radius": 1.2}},
        {"id": "core", "parent": "ball", "material": "foam",
         "shape": {"type": "box", "center": [3.4, 1.1, -0.4], "size": [0.9, 0.8, 0.7]}},
    ],
}


def mixed():
    return copy.deepcopy(MIXED)
