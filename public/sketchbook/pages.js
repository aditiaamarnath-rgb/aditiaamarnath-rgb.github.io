// Put artwork in public/sketchbook/artwork/, then set src, alt, and caption.
// Paths are relative to this folder. Add entries to create more spreads.
export const pages = [
  { title: 'A few pencil marks', left: null, right: null },
  { title: 'Little observations', left: null, right: null },
  { title: 'Works in progress', left: null, right: null },
];

const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char]);

async function artworkMarkup(artwork, x) {
  if (!artwork?.src) return '';
  try {
    const response = await fetch(artwork.src);
    if (!response.ok) throw new Error(`Artwork returned ${response.status}`);
    const blob = await response.blob();
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return `<image href="${escape(data)}" x="${x + 55}" y="310" width="665" height="555" preserveAspectRatio="xMidYMid meet"/>
      <text x="${x + 387}" y="910" text-anchor="middle" font-size="25" fill="#6e675b">${escape(artwork.caption || '')}</text>`;
  } catch (error) {
    console.error('Could not load sketchbook artwork:', artwork.src, error);
    return `<text x="${x + 387}" y="620" text-anchor="middle" font-size="28" fill="#6e675b">This sketch is taking a moment.</text>`;
  }
}

export async function createSpread(page, index) {
  const [left, right] = await Promise.all([
    artworkMarkup(page.left, 90), artworkMarkup(page.right, 880),
  ]);
  const blank = (x, label) => `
    <text x="${x + 387}" y="609" text-anchor="middle" font-size="31" font-style="italic" fill="#998e7c">${escape(label)}</text>
    <text x="${x + 387}" y="651" text-anchor="middle" font-size="18" fill="#b0a693" letter-spacing="1">artwork coming soon</text>`;
  // Match the reference's bounds, with gently rounded outer corners and a flat
  // binding. The paper grain is rendered once into the final page bitmap.
  const leftPage = 'M142 276 Q482 267 880 279 L880 965 Q480 974 137 965 Q91 963 91 919 L91 321 Q91 282 142 276Z';
  const rightPage = 'M880 279 Q1280 268 1620 276 Q1669 280 1669 322 L1669 919 Q1669 962 1621 965 Q1280 974 880 965Z';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1760" height="1240" viewBox="0 0 1760 1240">
    <defs>
      <linearGradient id="left"><stop stop-color="#eee8dc"/><stop offset=".025" stop-color="#f8f4ec"/><stop offset=".84" stop-color="#faf7ef"/><stop offset=".98" stop-color="#eee7d9"/><stop offset="1" stop-color="#d8cdbb"/></linearGradient>
      <linearGradient id="right"><stop stop-color="#d9cebc"/><stop offset=".018" stop-color="#f3ede2"/><stop offset=".15" stop-color="#fbf8f1"/><stop offset=".96" stop-color="#faf7f0"/><stop offset="1" stop-color="#efe9de"/></linearGradient>
      <filter id="paper" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".48 .7" numOctaves="3" seed="12" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer><feFuncA type="linear" slope=".11"/></feComponentTransfer>
        <feBlend in="SourceGraphic" mode="multiply"/>
      </filter>
      <clipPath id="pages"><path d="${leftPage}"/><path d="${rightPage}"/></clipPath>
    </defs>
    <g font-family="Georgia,serif">
      <path d="M141 283 Q480 269 880 286 Q1280 269 1620 283 Q1672 286 1672 327 L1672 927 Q1672 974 1620 978 Q1280 985 880 973 Q480 985 135 978 Q86 974 86 927 L86 326 Q86 289 141 283Z" fill="#d2c8b6"/>
      <path d="M98 330 L98 929 Q98 967 139 970 Q480 979 878 968 M1662 330 L1662 929 Q1662 967 1621 970 Q1280 979 882 968" fill="none" stroke="#eee7db" stroke-width="3"/>
      <path d="${leftPage}" fill="url(#left)"/>
      <path d="${rightPage}" fill="url(#right)"/>
      <g clip-path="url(#pages)"><rect x="90" y="270" width="1580" height="710" fill="transparent" filter="url(#paper)"/></g>
      <path d="M880 281 L880 964" stroke="#b5a58b" stroke-width="1" opacity=".4"/>
      <path d="M882 283 L882 962" stroke="#fffdf5" stroke-width="2" opacity=".65"/>
      ${left || blank(90, index === 0 ? 'from my sketchbook' : page.title)}
      ${right || blank(880, 'a little space for something new')}
    </g>
  </svg>`;
  // Rasterize once so the animated strips reuse a bitmap rather than repainting
  // the paper texture and embedded artwork on every animation frame.
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.src = svgUrl;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 1760;
    canvas.height = 1240;
    canvas.getContext('2d').drawImage(image, 0, 0);
    const bitmap = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!bitmap) throw new Error('Could not render sketchbook page');
    return URL.createObjectURL(bitmap);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
