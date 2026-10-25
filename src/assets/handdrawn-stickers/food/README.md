# Food and Smiski drawing cutouts

`boba.png`, `ramen.png`, and `smiski.png` are direct crops from
`source-drawings.png`. The extraction does not redraw, recolor, rotate, stretch,
or resample the artwork. It only makes the surrounding sheet background
transparent and retains the source color profile.

`source-manifest.json` records the source hash, crop positions, dimensions, and
the byte-for-byte pixel verification results.

Reproduce from the repository root:

```sh
python3 scripts/extract-handdrawn-stickers.py \
  src/assets/handdrawn-stickers/food/source-drawings.png \
  src/assets/handdrawn-stickers/food
```
