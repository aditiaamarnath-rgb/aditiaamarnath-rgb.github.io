// Deterministic page composition for the imported artwork. No generative tools,
// artwork filters, stretching, or changes to the original JPEG files. The user
// requested landscape rotation and a small cover crop to fill each page.
import { bookGeometry as g } from './pages.js';

async function loadArtwork(artwork) {
  const image = new Image();
  image.src = new URL(artwork.src, import.meta.url).href;
  await image.decode();
  return image;
}

export async function renderSpread(page) {
  const [left, right] = await Promise.all([loadArtwork(page.left), loadArtwork(page.right)]);
  const canvas = document.createElement('canvas');
  canvas.width = g.width;
  canvas.height = g.height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';

  // Square page corners and straight stacked edges, without rounded paths.
  ctx.fillStyle = '#d4cbbb';
  ctx.fillRect(g.left - 4, g.top + 4, g.pageWidth * 2 + 8, g.pageHeight + 4);
  ctx.fillStyle = '#ece5d8';
  ctx.fillRect(g.left - 2, g.top + 2, g.pageWidth * 2 + 4, g.pageHeight + 2);
  ctx.fillStyle = '#faf7ef';
  ctx.fillRect(g.left, g.top, g.pageWidth * 2, g.pageHeight);

  function drawArtwork(image, artwork, x) {
    const quarterTurn = Math.abs(artwork.rotation) % 180 === 90;
    const rotatedWidth = quarterTurn ? image.naturalHeight : image.naturalWidth;
    const rotatedHeight = quarterTurn ? image.naturalWidth : image.naturalHeight;
    const scale = Math.max(g.pageWidth / rotatedWidth, g.pageHeight / rotatedHeight) * artwork.zoom;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, g.top, g.pageWidth, g.pageHeight);
    ctx.clip();
    ctx.translate(x + g.pageWidth / 2, g.top + g.pageHeight / 2);
    ctx.rotate(artwork.rotation * Math.PI / 180);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  }
  drawArtwork(left, page.left, g.left);
  drawArtwork(right, page.right, g.right);

  // A hairline binding and straight outer edge belong to the book itself.
  ctx.strokeStyle = 'rgba(71, 57, 37, 0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(g.left + 0.5, g.top + 0.5, g.pageWidth * 2 - 1, g.pageHeight - 1);
  ctx.beginPath();
  ctx.moveTo(g.right + 0.5, g.top);
  ctx.lineTo(g.right + 0.5, g.top + g.pageHeight);
  ctx.stroke();
  return canvas;
}
