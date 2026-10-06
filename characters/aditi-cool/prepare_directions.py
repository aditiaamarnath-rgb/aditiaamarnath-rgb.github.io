"""Repack the generated, unevenly spaced busts into uniform atlas cells.

Preserves the drawings at their original scale; only translates and pads them.
Run before the page-mascot skill's build and verification scripts.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

folder = Path(__file__).parent
source = folder / "directions-generated.png"
image = Image.open(source).convert("RGBA")
pixels = np.array(image)
labels, _ = ndimage.label(pixels[:, :, 3] > 100)
objects = []
for index, bounds in enumerate(ndimage.find_objects(labels), start=1):
    if np.count_nonzero(labels == index) > 1000:
        objects.append(bounds)
objects.sort(key=lambda bounds: (int((bounds[0].start + bounds[0].stop) / 2 / (image.height / 3)), bounds[1].start))
assert len(objects) == 9, "Expected nine separate busts"
cell = max(480, image.width // 3 + 80)
atlas = Image.new("RGBA", (cell * 3, cell * 3))
for index, bounds in enumerate(objects):
    top, bottom = bounds[0].start, bounds[0].stop
    left, right = bounds[1].start, bounds[1].stop
    bust = image.crop((left - 2, top - 2, right + 2, bottom + 2))
    x = (index % 3) * cell + (cell - bust.width) // 2
    y = (index // 3) * cell + int(cell * 0.895) - bust.height
    atlas.alpha_composite(bust, (x, y))
atlas.save(folder / "directions.png")
