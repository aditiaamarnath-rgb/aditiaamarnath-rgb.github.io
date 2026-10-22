# Portfolio sketchbook

Page curling and pointer controls adapted from
[Meng To's sketchbook](https://github.com/MengTo/sketchbook), whose original
concept credits [Matthew Yu](https://github.com/matthewyuart/personalportfolio).
The portfolio uses its own blank book artwork, not the reference's Singapore art.

## Add your artwork

1. Create `public/sketchbook/artwork/` and put your images there.
2. Edit `pages.js`. Each entry is a two-page spread. Replace `left` and/or `right`
   with an object like this:

   ```js
   { src: 'artwork/my-sketch.jpg', alt: 'Pencil drawing of a window and houseplants', caption: 'A quiet afternoon' }
   ```

3. Change the spread's `title`, or add more spread entries. Use `null` for a blank page.

Images fit within the page without cropping. Use local JPEG, PNG, or WebP files.
The book supports dragging, page buttons, and arrow keys.
The rounded paper pages have no visible numbering. Reduced-motion preferences
disable tilt and settle page turns immediately.

On first scrolling the book into view, a short breeze riffles through its pages.
This plays once per page load, waits for the artwork to be ready, and stops if
the visitor scrolls away or starts turning a page. Reduced motion skips it.

The isolated HTML frame preserves the original 3D geometry without inheriting
the portfolio's global styles. Its URL respects Vite's deployment base path.
