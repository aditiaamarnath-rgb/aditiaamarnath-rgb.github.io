# Original drawing cutouts

These six PNGs are direct crops from `source-drawings.png`, the user's original
attachment. No generated artwork is used. The drawings are not redrawn,
recolored, stretched, rotated in the PNG, or resampled. Only the sheet background
is made transparent. The original color profile is retained.

The extraction checks every retained RGBA pixel against its position in the
source image. `source-manifest.json` records the source hash, crop coordinates,
dimensions, and verification results.

Reproduce from the repository root:

```sh
python3 scripts/extract-handdrawn-stickers.py src/assets/handdrawn-stickers/source-drawings.png src/assets/handdrawn-stickers
```

The website displays each image at its natural aspect ratio. A 4px
white edge and shadow are applied separately with an SVG/CSS filter, so they
do not change the drawing files.
