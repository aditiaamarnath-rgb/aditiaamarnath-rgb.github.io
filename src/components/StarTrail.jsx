import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './StarTrail.css';

/*
 * Green doodle stars scattered across the home hero, everywhere except the main text,
 * nav, button and avatar. They sit evenly spaced (best-candidate sampling) with a gentle
 * pull toward the edges of that content, so they frame it rather than fill the corners.
 * The interactive bits from the original trail (STAR_TRAIL.md) are kept: pop-in entrance,
 * twinkle ripple and cursor repel. Placement is seeded, so a given size always looks the same.
 */

const BASE_SIZE = 28;
// Roughly one star per this many square px of hero, clamped below.
const AREA_PER_STAR = 26000;
const MIN_STARS = 22;
const MAX_STARS = 64;
const CANDIDATES = 40;        // per star: higher = more even spacing
const EDGE_MARGIN = 18;       // keep stars from being clipped by the hero edge
const HUG_RADIUS = 140;       // how far the pull toward the content reaches (px)
const HUG_STRENGTH = 0.55;    // 0 = perfectly even scatter; higher = more stars hug the content
// Entrance: stars pop in rippling outward from the text, then settle into the twinkle.
const ENTRANCE = 1100;
const SETTLE = 500;

const INK = '#e7edc6';
const TINT = 0.5;
const STROKE_W = 1.6;
const HATCH_GAP = 2.2;
const HATCH_W = 1.25;

const REPEL_RADIUS = 150;
const REPEL_STRENGTH = 0.55;

const PATHS = [
  'M12 2.8 C12.6 5 13.4 7.4 14.5 8.8 C16.8 9 19 9.1 21.2 9.6 C19.6 11.1 17.8 12.4 16.2 13.8 C16.8 16 17.4 18.2 17.7 20.5 C15.9 19.3 14 18 12.1 16.9 C10.2 18 8.3 19.3 6.4 20.6 C6.9 18.3 7.5 16 8 13.8 C6.3 12.4 4.6 11 2.9 9.7 C5.1 9.3 7.3 9.1 9.5 8.8 C10.4 6.7 11.2 4.7 12.4 2.3',
  'M11.6 3.2 L14.3 9.1 L20.8 9.9 L15.9 14.1 L17.4 20.2 L12 17.2 L6.7 20.4 L8.2 14.2 L3.3 9.6 L9.8 9 L12.3 2.7',
  'M12 3 C12.6 8.6 13.4 10.9 21 12 C13.4 13.1 12.6 15.4 12 21 C11.4 15.4 10.6 13.1 3 12 C10.6 10.9 11.4 8.6 12.3 2.5',
];
const SHAPE_PATTERN = [0, 1, 2, 0, 1, 0, 2];
const ROTATIONS = [-12, 9, -4, 15, -9, 6, -15, 3, 12, -6];
const VAR = [1, 0.62, 1.28, 0.78, 0.95, 1.4, 0.7, 1.12, 0.58, 1.2, 0.85, 1.33];

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

// Distance from a point to a rect (0 inside).
const rectDist = (x, y, b) => Math.hypot(Math.max(b.left - x, 0, x - b.right), Math.max(b.top - y, 0, y - b.bottom));

function buildStars(W, H, avoid) {
  const rand = mulberry32(20261123);
  const count = Math.max(MIN_STARS, Math.min(MAX_STARS, Math.round((W * H) / AREA_PER_STAR)));
  // Centre of the content, for the outward entrance ripple.
  const content = avoid.length
    ? avoid.reduce((a, b) => ({ left: Math.min(a.left, b.left), right: Math.max(a.right, b.right), top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom) }))
    : { left: W / 2, right: W / 2, top: H / 2, bottom: H / 2 };
  const cx = (content.left + content.right) / 2, cy = (content.top + content.bottom) / 2;
  const maxReach = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) || 1;

  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.round(BASE_SIZE * VAR[i % VAR.length]);
    const half = size / 2;
    let best = null, bestScore = -1;
    for (let c = 0; c < CANDIDATES; c++) {
      const x = EDGE_MARGIN + half + rand() * (W - 2 * (EDGE_MARGIN + half));
      const y = EDGE_MARGIN + half + rand() * (H - 2 * (EDGE_MARGIN + half));
      const pad = half + AVOID_PAD;
      if (avoid.some((b) => x + pad > b.left && x - pad < b.right && y + pad > b.top && y - pad < b.bottom)) continue;
      // Spread: distance to the nearest star (edges count a little, so corners aren't over-filled).
      let near = Math.min(x, W - x, y, H - y) * 2.2;
      for (const s of stars) near = Math.min(near, Math.hypot(s.x - x, s.y - y) - (s.size + size) / 4);
      // Hug: candidates close to the content score higher, so the stars frame it.
      const dContent = avoid.length ? Math.min(...avoid.map((b) => rectDist(x, y, b))) : Infinity;
      const score = near * (1 + HUG_STRENGTH * Math.exp(-dContent / HUG_RADIUS));
      if (score > bestScore) { bestScore = score; best = { x, y }; }
    }
    if (!best) continue;
    const reach = Math.hypot(best.x - cx, best.y - cy) / maxReach;
    stars.push({
      x: Math.round(best.x),
      y: Math.round(best.y),
      size,
      path: PATHS[SHAPE_PATTERN[i % SHAPE_PATTERN.length]],
      r: ROTATIONS[i % ROTATIONS.length],
      d: Math.round(reach * ENTRANCE + rand() * 120), // pop-in, rippling outward
      t: Math.round((best.x / W) * 2200 + rand() * 300), // twinkle sweeps left to right
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
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const hatchId = `sketch-hatch-${uid}`;

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
          <svg className="star-trail-defs" width="0" height="0" aria-hidden="true">
            <defs>
              <pattern id={hatchId} patternUnits="userSpaceOnUse" width={HATCH_GAP} height={HATCH_GAP} patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2={HATCH_GAP} style={{ stroke: INK, strokeWidth: HATCH_W, strokeLinecap: 'round' }} />
              </pattern>
            </defs>
          </svg>

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
                  <path className="star-sketch" d={s.path} style={{ stroke: INK, strokeWidth: STROKE_W, fill: `url(#${hatchId})` }} />
                </svg>
              </span>
            </span>
          ))}

        </>
      )}
    </div>
  );
}
