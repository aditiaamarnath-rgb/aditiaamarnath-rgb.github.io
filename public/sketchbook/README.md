# Portfolio sketchbook

Page curling and pointer controls adapted from
[Meng To's sketchbook](https://github.com/MengTo/sketchbook), whose original
concept credits [Matthew Yu](https://github.com/matthewyuart/personalportfolio).

## Imported artwork

The supplied `sketchbook pt1.pdf` has 23 pages. PDF page 1 is excluded.
The remaining 22 original sketches appear in 11 spreads, in this exact order:
2/3, 4/5, 6/7, 8/9, 10/11, 12/13, 14/15, 16/17, 18/19, 20/21, 22/23.
The first number is always the left page. The book stays on the spread reached
by its brief introductory riffle.

`sketchbook pt2.pdf` follows part 1. All 20 of its pages are included in
10 more spreads: 1/2, 3/4, 5/6, 7/8, 9/10, 11/12, 13/14, 15/16, 17/18, 19/20.
Part 2 page 1 is the left side of spread 12; page 2 is the right side.
Together the two PDFs contribute 42 sketches in 21 spreads.

Each page is 8 inches wide by 5 inches tall. Each image is displayed rotated
90 degrees counterclockwise into landscape, with its proportions preserved.
An aspect-preserving cover fit and a small 1.5% zoom remove white gaps; only
the excess at the outer edges is clipped. Corners and page-stack edges are square.

`artwork/page-02.jpg` through `artwork/page-23.jpg` are the original PDF JPEG
streams, copied byte-for-byte. No artwork was generated, redrawn, or recolored.
`artwork/manifest.json` records the PDF and image hashes, dimensions, and pairing.
To repeat the source extraction:

```sh
python3 scripts/import-sketchbook-pdf.py '/path/to/sketchbook pt1.pdf' public/sketchbook/artwork
python3 scripts/import-sketchbook-pdf.py '/path/to/sketchbook pt2.pdf' public/sketchbook/artwork/part-2 --include-first
```

`pages.js` holds the pairing and shared book geometry. `render-spread.js` is the
deterministic canvas compositor for the straight page backing and artwork.
Its prepared `artwork/spread-01.webp` through `spread-11.webp` let the viewer
animate optimized bitmaps without decoding all full-resolution originals.
Part 2 uses its own `artwork/part-2/` folder, including original JPEGs, a source
manifest, and `spread-01.webp` through `spread-10.webp`.
After changing artwork or geometry, call `renderSpread(page)` in a local browser
for each entry in `pages`, then save its canvas as WebP at quality 0.95 to the
entry's `spread` path.

The book supports dragging, page buttons, and arrow keys. It has no visible page
numbers, index, or magnifier. Reduced-motion preferences disable tilt and settle
page turns immediately.

Each time the visitor scrolls down into the book, a short breeze riffles through
six pages over about two seconds and leaves the final spread open. Both faces
of every turning leaf are decoded before the animation begins. A pending entry
is kept while the lazy frame loads, and crossing the initial visibility threshold
does not interrupt a turn. It stops if the visitor scrolls fully away or starts
turning a page. Reduced motion skips it.

The isolated HTML frame preserves the 3D geometry without inheriting the
portfolio's global styles. Its URL respects Vite's deployment base path.
