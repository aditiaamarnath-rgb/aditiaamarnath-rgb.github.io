"""Repack reaction frames and their symbols; preserve the generated artwork."""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

folder = Path(__file__).parent
image = Image.open(folder / "reactions-generated.png").convert("RGBA")
labels, _ = ndimage.label(np.array(image)[:, :, 3] > 100)
bodies = []
for index, bounds in enumerate(ndimage.find_objects(labels), start=1):
    if np.count_nonzero(labels == index) > 10000:
        bodies.append(bounds)
bodies.sort(key=lambda bounds: (int((bounds[0].start + bounds[0].stop) / 2 / (image.height / 3)), bounds[1].start))
assert len(bodies) == 9
row_edges = [0]
for row in range(2):
    bottom = max(bounds[0].stop for bounds in bodies[row * 3:row * 3 + 3])
    top = min(bounds[0].start for bounds in bodies[(row + 1) * 3:(row + 2) * 3])
    row_edges.append((bottom + top) // 2)
row_edges.append(image.height)
cell = max(480, image.width // 3 + 80)
atlas = Image.new("RGBA", (cell * 3, cell * 3))
for index, bounds in enumerate(bodies):
    row, col = divmod(index, 3)
    left, right = col * (image.width // 3), (col + 1) * (image.width // 3)
    frame = image.crop((left, row_edges[row], right, row_edges[row + 1]))
    body_center = (bounds[1].start + bounds[1].stop) // 2 - left
    body_bottom = bounds[0].stop - row_edges[row]
    tile = Image.new("RGBA", (cell, cell))
    tile.alpha_composite(frame, (cell // 2 - body_center, int(cell * 0.89) - body_bottom))
    atlas.alpha_composite(tile, (col * cell, row * cell))
atlas.save(folder / "reactions.png")
