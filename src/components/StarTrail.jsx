import { useEffect, useMemo, useRef, useState } from 'react';
import './StarTrail.css';

/*
 * Green doodle stars scattered across the home hero, everywhere except the main text,
 * nav, button and avatar. Sizes, spots, shapes and tilts are all random (mostly small
 * stars, a few big ones; loose clusters and empty patches rather than an even grid),
 * and the arrangement is new on every page load. The interactive bits from the original
 * trail (STAR_TRAIL.md) are kept: pop-in entrance, twinkle ripple and cursor repel.
 */

// Random sizes, skewed small: MIN + (MAX - MIN) * rand^SIZE_SKEW.
const MIN_SIZE = 14;
const MAX_SIZE = 46;
const SIZE_SKEW = 1.8;
// Roughly one star per this many square px of hero, clamped below.
const AREA_PER_STAR = 26000;
const MIN_STARS = 22;
const MAX_STARS = 64;
const CANDIDATES = 3;         // per star: the most spread-out of a few random spots (1 = pure random)
const CLUSTER_CHANCE = 0.2;   // chance a star lands near an earlier one, forming little constellations
const CLUSTER_GAP = [18, 70]; // how far from that star (px, beyond both radii)
const STAR_GAP = 4;           // stars never overlap: minimum space between their edges (px)
const EDGE_MARGIN = 14;       // keep stars from being clipped by the hero edge
const MAX_TILT = 28;          // degrees either way
const ATTEMPTS = 60;          // per star, before giving up on a crowded spot
// A new arrangement per page load (stable while the page is open).
const SEED = (Math.random() * 2 ** 32) >>> 0;
// Entrance: stars pop in rippling outward from the text, then settle into the twinkle.
const ENTRANCE = 1100;
const SETTLE = 500;

const INK = '#e7edc6';
const TINT = 0.38;            // faint wash under the strokes so small stars still read as stars
// Sketched fill: diagonal pencil strokes, no outline. Sizes are in screen px.
const HATCH_GAP = [1.2, 2.2, 0.075]; // stroke spacing in px: [min, max, fraction of star size]
const HATCH_W = [0.45, 0.6];  // stroke weight as a fraction of the spacing
const HATCH_ANGLE = -45;      // degrees on screen: strokes run bottom-left to top-right
const HATCH_ANGLE_JITTER = 8; // each star's strokes lean a little differently
const OVERSHOOT = [-0.5, 0.9];// each stroke end stops short of / runs past the edge (24-unit star space)

const REPEL_RADIUS = 150;
const REPEL_STRENGTH = 0.55;

const PATHS = [
  'M12 2.8 C12.6 5 13.4 7.4 14.5 8.8 C16.8 9 19 9.1 21.2 9.6 C19.6 11.1 17.8 12.4 16.2 13.8 C16.8 16 17.4 18.2 17.7 20.5 C15.9 19.3 14 18 12.1 16.9 C10.2 18 8.3 19.3 6.4 20.6 C6.9 18.3 7.5 16 8 13.8 C6.3 12.4 4.6 11 2.9 9.7 C5.1 9.3 7.3 9.1 9.5 8.8 C10.4 6.7 11.2 4.7 12.4 2.3',
  'M11.6 3.2 L14.3 9.1 L20.8 9.9 L15.9 14.1 L17.4 20.2 L12 17.2 L6.7 20.4 L8.2 14.2 L3.3 9.6 L9.8 9 L12.3 2.7',
  'M12 3 C12.6 8.6 13.4 10.9 21 12 C13.4 13.1 12.6 15.4 12 21 C11.4 15.4 10.6 13.1 3 12 C10.6 10.9 11.4 8.6 12.3 2.5',
];

// The entrance plays once per page load, even if the stars are hidden and shown again.
let entrancePlayed = false;

// Hero content the stars must stay off (rects relative to the hero).
const AVOID = '.letter-greeting h1, .letter-intro p, .letter-contact, .letter-mascot-stamp, .letter-nav';
const AVOID_PAD = 10;

// Small seeded PRNG so the scatter is stable across renders.
const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Each star shape as a polygon (in its 24-unit viewBox), sampled once from the real path.
const shapePolygons = new Map();
function shapePolygon(d) {
  if (shapePolygons.has(d)) return shapePolygons.get(d);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const len = path.getTotalLength();
  const pts = [];
  for (let i = 0; i < 120; i++) {
    const p = path.getPointAtLength((len * i) / 120);
    pts.push([p.x, p.y]);
  }
  svg.remove();
  shapePolygons.set(d, pts);
  return pts;
}

// Diagonal pencil hatching that fills a star: roughly parallel strokes with uneven spacing,
// a slight bow, varied weight and darkness, and ends that over- or undershoot the edge.
function sketchHatch(d, size, tilt, rand) {
  const poly = shapePolygon(d);
  const unit = 24 / size; // viewBox units per screen px
  // Counter the star's own tilt so every star's strokes lean the same way on screen.
  const a = ((HATCH_ANGLE - tilt + (rand() * 2 - 1) * HATCH_ANGLE_JITTER) * Math.PI) / 180;
  const cos = Math.cos(a), sin = Math.sin(a);
  // Rotate the outline so the strokes become horizontal scanlines.
  const rot = poly.map(([x, y]) => [x * cos + y * sin, -x * sin + y * cos]);
  const back = (u, v) => [u * cos - v * sin, u * sin + v * cos];
  const ys = rot.map((p) => p[1]);
  const top = Math.min(...ys), bottom = Math.max(...ys);
  // Smaller stars get tighter, finer strokes so they still read as stars.
  const gapPx = Math.min(HATCH_GAP[1], Math.max(HATCH_GAP[0], size * HATCH_GAP[2]));
  const gap = gapPx * unit;
  const strokes = [];
  for (let v = top + gap * (0.3 + rand() * 0.6); v < bottom; v += gap * (0.75 + rand() * 0.5)) {
    const xs = [];
    for (let i = 0; i < rot.length; i++) {
      const [x1, y1] = rot[i], [x2, y2] = rot[(i + 1) % rot.length];
      if ((y1 <= v && y2 > v) || (y2 <= v && y1 > v)) xs.push(x1 + ((v - y1) / (y2 - y1)) * (x2 - x1));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      if (xs[k + 1] - xs[k] < 0.8) continue;
      const over = () => OVERSHOOT[0] + rand() * (OVERSHOOT[1] - OVERSHOOT[0]);
      const u0 = xs[k] - over(), u1 = xs[k + 1] + over();
      const v0 = v + (rand() - 0.5) * 0.5, v1 = v + (rand() - 0.5) * 0.5;
      const bow = (rand() - 0.5) * 0.7;
      const p0 = back(u0, v0), p1 = back(u1, v1), c = back((u0 + u1) / 2, (v0 + v1) / 2 + bow);
      strokes.push({
        d: `M${p0[0].toFixed(2)} ${p0[1].toFixed(2)} Q${c[0].toFixed(2)} ${c[1].toFixed(2)} ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`,
        w: +((HATCH_W[0] + rand() * (HATCH_W[1] - HATCH_W[0])) * gap).toFixed(2),
        o: +(0.7 + rand() * 0.3).toFixed(2),
      });
    }
  }
  return strokes;
}

function buildStars(W, H, avoid) {
  const rand = mulberry32(SEED);
  const count = Math.max(MIN_STARS, Math.min(MAX_STARS, Math.round((W * H) / AREA_PER_STAR)));
  // Centre of the content, for the outward entrance ripple.
  const content = avoid.length
    ? avoid.reduce((a, b) => ({ left: Math.min(a.left, b.left), right: Math.max(a.right, b.right), top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom) }))
    : { left: W / 2, right: W / 2, top: H / 2, bottom: H / 2 };
  const cx = (content.left + content.right) / 2, cy = (content.top + content.bottom) / 2;
  const maxReach = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) || 1;

  const stars = [];
  // A spot is usable if it's inside the hero, off the content, and not touching another star.
  const fits = (x, y, half) => {
    if (x - half < EDGE_MARGIN || x + half > W - EDGE_MARGIN || y - half < EDGE_MARGIN || y + half > H - EDGE_MARGIN) return false;
    const pad = half + AVOID_PAD;
    if (avoid.some((b) => x + pad > b.left && x - pad < b.right && y + pad > b.top && y - pad < b.bottom)) return false;
    return stars.every((s) => Math.hypot(s.x - x, s.y - y) >= s.size / 2 + half + STAR_GAP);
  };
  for (let i = 0; i < count; i++) {
    const size = Math.round(MIN_SIZE + (MAX_SIZE - MIN_SIZE) * rand() ** SIZE_SKEW);
    const half = size / 2;
    const clustered = stars.length > 0 && rand() < CLUSTER_CHANCE;
    let best = null, bestScore = -1, found = 0;
    for (let a = 0; a < ATTEMPTS && found < (clustered ? 1 : CANDIDATES); a++) {
      let x, y;
      if (clustered) {
        // Next to a random earlier star.
        const s = stars[Math.floor(rand() * stars.length)];
        const angle = rand() * 2 * Math.PI;
        const dist = s.size / 2 + half + CLUSTER_GAP[0] + rand() * (CLUSTER_GAP[1] - CLUSTER_GAP[0]);
        x = s.x + Math.cos(angle) * dist;
        y = s.y + Math.sin(angle) * dist;
      } else {
        x = rand() * W;
        y = rand() * H;
      }
      if (!fits(x, y, half)) continue;
      found++;
      // Of the few usable spots, keep the one furthest from other stars (only loosely even).
      const score = stars.reduce((m, s) => Math.min(m, Math.hypot(s.x - x, s.y - y)), Infinity);
      if (score > bestScore) { bestScore = score; best = { x, y }; }
    }
    if (!best) continue;
    const reach = Math.hypot(best.x - cx, best.y - cy) / maxReach;
    const path = PATHS[Math.floor(rand() * PATHS.length)];
    const r = Math.round((rand() * 2 - 1) * MAX_TILT);
    stars.push({
      x: Math.round(best.x),
      y: Math.round(best.y),
      size,
      path,
      hatch: sketchHatch(path, size, r, rand),
      r,
      d: Math.round(reach * ENTRANCE + rand() * 120), // pop-in, rippling outward
      t: Math.round(rand() * 3400), // twinkles out of step with each other
    });
  }
  return { stars };
}

const query = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null);

export default function StarTrail() {
  const layerRef = useRef(null);
  const starRefs = useRef([]);
  const [size, setSize] = useState(null);
  const [narrow, setNarrow] = useState(() => query('(max-width: 700px)')?.matches ?? false);
  const [reduced, setReduced] = useState(() => query('(prefers-reduced-motion: reduce)')?.matches ?? false);
  // Settled = the entrance already ran this page load; show the trail without replaying it.
  const [settled] = useState(() => entrancePlayed);

  // Track the small-screen breakpoint and reduced-motion preference.
  useEffect(() => {
    const mqNarrow = query('(max-width: 700px)');
    const mqReduce = query('(prefers-reduced-motion: reduce)');
    if (!mqNarrow || !mqReduce) return undefined;
    const onNarrow = (e) => setNarrow(e.matches);
    const onReduce = (e) => setReduced(e.matches);
    mqNarrow.addEventListener('change', onNarrow);
    mqReduce.addEventListener('change', onReduce);
    return () => {
      mqNarrow.removeEventListener('change', onNarrow);
      mqReduce.removeEventListener('change', onReduce);
    };
  }, []);

  // Measure the hero; only re-render when its size actually changes.
  useEffect(() => {
    if (narrow) return undefined;
    const hero = layerRef.current?.parentElement;
    if (!hero) return undefined;
    const measure = () => {
      const hr = hero.getBoundingClientRect();
      const W = Math.round(hr.width);
      const H = Math.round(hr.height);
      const avoid = [...hero.querySelectorAll(AVOID)].map((el) => {
        const r = el.getBoundingClientRect();
        return { left: Math.round(r.left - hr.left), right: Math.round(r.right - hr.left), top: Math.round(r.top - hr.top), bottom: Math.round(r.bottom - hr.top) };
      });
      const key = `${W}x${H}|${avoid.map((b) => `${b.left},${b.top},${b.right},${b.bottom}`).join(';')}`;
      setSize((prev) => (prev && prev.key === key ? prev : { W, H, avoid, key }));
    };
    // Re-measure when the hero or its text block changes size (e.g. once web fonts load).
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    hero.querySelectorAll('.letter-intro, .letter-greeting').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [narrow]);

  // Mark the entrance as played once it would have finished.
  useEffect(() => {
    if (narrow || !size || entrancePlayed) return undefined;
    const id = window.setTimeout(() => { entrancePlayed = true; }, ENTRANCE + SETTLE);
    return () => window.clearTimeout(id);
  }, [narrow, size]);

  const trail = useMemo(() => (size && !narrow ? buildStars(size.W, size.H, size.avoid) : null), [size, narrow]);

  // Repel: listeners on the hero section, star offsets written straight to the DOM in a frame.
  useEffect(() => {
    if (!trail || reduced || !query('(hover: hover)')?.matches) return undefined;
    const hero = layerRef.current?.parentElement;
    if (!hero) return undefined;
    let frame = 0;
    let pointer = null;
    const apply = () => {
      frame = 0;
      trail.stars.forEach((s, i) => {
        const el = starRefs.current[i];
        if (!el) return;
        let px = 0, py = 0;
        if (pointer) {
          const dx = s.x - pointer.x, dy = s.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const push = (REPEL_RADIUS - dist) * REPEL_STRENGTH;
            px = Math.round((dx / dist) * push);
            py = Math.round((dy / dist) * push);
          }
        }
        const next = px || py ? `${px}px ${py}px` : '';
        if (el.style.translate !== next) el.style.translate = next;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(apply); };
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      schedule();
    };
    const onLeave = () => { pointer = null; schedule(); };
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    return () => {
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [trail, reduced]);

  const animate = !reduced && !settled;
  const layerClass = ['star-trail', animate ? 'star-trail-enter' : '', !reduced ? 'star-trail-idle' : ''].filter(Boolean).join(' ');
  const idleStart = settled ? 0 : ENTRANCE + SETTLE;

  return (
    <div ref={layerRef} className={layerClass} aria-hidden="true">
      {trail && (
        <>
          {trail.stars.map((s, i) => (
            <span
              key={i}
              ref={(el) => { starRefs.current[i] = el; }}
              className="star"
              style={{ left: s.x, top: s.y, '--d': `${s.d}ms`, '--t': `${idleStart + s.t}ms`, '--r': `${s.r}deg` }}
            >
              <span className="star-in">
                <svg width={s.size} height={s.size} viewBox="0 0 24 24">
                  <path className="star-tint" d={s.path} style={{ fill: INK, fillOpacity: TINT, stroke: 'none' }} />
                  {s.hatch.map((h, k) => (
                    <path key={k} className="star-sketch" d={h.d} style={{ stroke: INK, strokeWidth: h.w, strokeOpacity: h.o, fill: 'none' }} />
                  ))}
                </svg>
              </span>
            </span>
          ))}

        </>
      )}
    </div>
  );
}
