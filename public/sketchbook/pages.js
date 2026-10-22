// Original sketches in PDF order. Part 1 skips its first page; part 2 includes
// every page and follows part 1, starting with PDF pages 1 (left) and 2 (right).
export const bookGeometry = {
  width: 1760,
  height: 800,
  pageWidth: 800,
  pageHeight: 500, // Each landscape page is 8 x 5 inches.
  left: 80,
  right: 880,
  top: 150,
};

const descriptions = [
  'Green leafy branches against a pale textured background',
  'Sharks and small fish swimming through deep blue water',
  'A purple night sky with a crescent moon, trees, and a swing',
  'A sunlit path through a lush green forest',
  'A little wooden cart beneath a large moon and stars',
  'A pastel sunset reflected over calm water',
  'Foamy blue waves, starfish, and a sandy shoreline',
  'Blue clouds and stars in a night sky',
  'Pink tulips with green leaves',
  'A pair of eyes framed by blue and golden stars',
  'Little frogs, bees, snails, and flowers',
  'A glowing yellow star in a purple woodland scene',
  'A dark dragon flying through a pink and orange sky',
  'Wildflowers in a mountain valley',
  'Rolling green hills, trees, and blue water',
  'Glowing pink shapes among dark clouds and stars',
  'Yellow stars scattered across a blue and pink sky',
  'Blue waves beside a dark shoreline under the stars',
  'Avocado, toast, tomatoes, blueberries, and a croissant',
  'Colorful fruit including grapes, bananas, and sliced kiwi',
  'Pale pink flowers against a soft blue background',
  'A flowering garden framed by dark tree branches',
];

const partOne = Array.from({ length: 11 }, (_, index) => {
  const leftPage = index * 2 + 2;
  const rightPage = leftPage + 1;
  const artwork = (number) => ({
    src: `artwork/page-${String(number).padStart(2, '0')}.jpg`,
    pdfPage: number,
    pdfPart: 1,
    alt: descriptions[number - 2],
    rotation: -90,
    zoom: 1.015,
  });
  return {
    title: `Sketchbook spread ${index + 1}`,
    left: artwork(leftPage),
    right: artwork(rightPage),
    spread: `artwork/spread-${String(index + 1).padStart(2, '0')}.webp`,
  };
});

const partTwoDescriptions = [
  'A bright red Maine lobster on a yellow tray',
  'Two red and white koi swimming among green lily pads',
  'A red tomato on a blue checkerboard with yellow stars',
  'A pizza slice and the word YUM on pink checks',
  'A colorful fish with slices of lemon and lime',
  'A sunny path through a lush green woodland',
  'Pink water lilies and green lily pads on a blue pond',
  'An open sardine tin on a blue checkered background',
  'Three tacos with green toppings and lime wedges',
  'A bowl of ramen with an egg and leafy greens',
  'A red and black Spider-Man mask against a comic collage',
  'A figure with a red spider emblem beside a little fire character',
  'A glowing orange and pink sunset reflected on a lake',
  'A roaring tiger on a red background with a chain',
  'Pink and golden clouds against a clear blue sky',
  'Two blue butterflies among pink blossoms and green leaves',
  'Red doodles including a bow, playing cards, and an ice pop',
  'Red and gold doodles including a numbered ball, dice, and a goldfish',
  'A waterfall and rocky stream in a sunlit forest',
  'Two fried eggs in a colorful blue pan',
];

const partTwo = Array.from({ length: 10 }, (_, index) => {
  const artwork = (number) => ({
    src: `artwork/part-2/page-${String(number).padStart(2, '0')}.jpg`,
    pdfPage: number,
    pdfPart: 2,
    alt: partTwoDescriptions[number - 1],
    rotation: -90,
    zoom: 1.015,
  });
  return {
    title: `Sketchbook spread ${partOne.length + index + 1}`,
    left: artwork(index * 2 + 1),
    right: artwork(index * 2 + 2),
    spread: `artwork/part-2/spread-${String(index + 1).padStart(2, '0')}.webp`,
  };
});

export const pages = [...partOne, ...partTwo];

// The book animates prepared bitmaps, avoiding 42 full-resolution decodes and
// SVG rasterizations when the visitor scrolls down to the artwork.
export async function createSpread(page) {
  return new URL(page.spread, import.meta.url).href;
}
