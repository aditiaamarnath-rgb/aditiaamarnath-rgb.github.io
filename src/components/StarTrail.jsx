import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './StarTrail.css';

/*
 * Green doodle star trail down the left side of the home hero.
 * Spec: STAR_TRAIL.md. Exact values come from design/home-star-trail.reference.html
 * (curve "swoop", 5 loops, 26 varied stars, comet entrance, twinkle ripple, repel cursor).
 */

// Design canvas the reference coordinates live in.
const CANVAS_W = 1440;
const CANVAS_H = 900;

// "swoop" base curve: start beside the nav at the top-left, end near the bottom.
const P = [[230, 26], [10, 330], [640, 500], [400, 890]];
const LOOPS = 5;
const LOOP_SIZE = 92;
const LOOP_R = [1, 0.72, 1.18, 0.86, 1.08, 0.66, 1.22, 0.9, 1.02];
const SAMPLES = 900;

const COUNT = 26;
const BASE_SIZE = 28;
// Entrance runs 40% faster than the reference (speed x1.4); every entrance timing is divided by this.
const SPEED = 1.4;
const STAGGER = 90 / SPEED;
const SPAN = Math.round((COUNT - 1) * STAGGER); // whole entrance, ~1.6s
const SETTLE = Math.round(700 / SPEED); // gap between the comet finishing and the twinkle starting
// Only number to tune by eye (STAR_TRAIL.md §6): delay the comet if the hero feels busy.
const COMET_DELAY = 0;

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
const JITTER = [[0, 0], [6, -5], [-5, 4], [4, 6], [-6, -3], [3, -6], [-4, 5]];
const VAR = [1, 0.62, 1.28, 0.78, 0.95, 1.4, 0.7, 1.12, 0.58, 1.2, 0.85, 1.33];

const COMET_STAR = 'M12 2.8 L14.6 8.9 L21.2 9.6 L16.2 13.8 L17.7 20.5 L12.1 16.9 L6.4 20.6 L8 13.8 L2.9 9.7 L9.5 8.8 Z';
const COMETS = [
  { delay: 0, size: 30, opacity: 1, glow: 8 },
  { delay: Math.round(70 / SPEED), size: 20, opacity: 0.6, glow: 5 },
  { delay: Math.round(140 / SPEED), size: 14, opacity: 0.38, glow: 3 },
  { delay: Math.round(210 / SPEED), size: 9, opacity: 0.22, glow: 2 },
];

// The entrance plays once per page load, even if the trail is hidden and shown again.
let entrancePlayed = false;

const baseCurve = (t) => {
  const u = 1 - t;
  const x = u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0];
  const y = u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1];
  return [x, y];
};

// Loops laid over the base curve in its own tangent/normal frame (verbatim from the reference).
const bez = (t, R) => {
  const [x, y] = baseCurve(t);
  if (!LOOPS) return [x, y];
  const h = 0.001;
  const [x1, y1] = baseCurve(Math.max(0, t - h));
  const [x2, y2] = baseCurve(Math.min(1, t + h));
  const tl = Math.hypot(x2 - x1, y2 - y1) || 1;
  const tx = (x2 - x1) / tl, ty = (y2 - y1) / tl;
  const nx = -ty, ny = tx;
  const k = Math.min(LOOPS - 1, Math.floor(LOOPS * t));
  const side = k % 2 === 0 ? 1 : -1;
  const env = Math.sin(Math.PI * Math.min(1, t * 1.1)) ** 0.5;
  const r = R * env * LOOP_R[k % LOOP_R.length];
  const a = 2 * Math.PI * LOOPS * t;
  const along = -Math.sin(a) * r;
  const across = (1 - Math.cos(a)) * r * 0.95 * side;
  return [x + tx * along + nx * across, y + ty * along + ny * across];
};

// Sampled trail in hero pixels. Shrinks the loop radius until nothing crosses the hero's midline.
function buildTrail(W, H) {
  const sx = W / CANVAS_W, sy = H / CANVAS_H;
  let R = LOOP_SIZE;
  let pts;
  for (;;) {
    pts = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const [x, y] = bez(i / SAMPLES, R);
      pts.push([x * sx, y * sy]);
    }
    const maxX = Math.max(...pts.map((p) => p[0]));
    if (maxX <= 0.5 * W || R <= 4) break;
    R *= 0.92;
  }
  const len = [0];
  for (let i = 1; i <= SAMPLES; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = len[SAMPLES];
  // Point at an even arc-length fraction f, so stars bunch naturally around the loops.
  const at = (f) => {
    const target = f * total;
    let i = 1;
    while (i < SAMPLES && len[i] < target) i++;
    const a = len[i - 1], b = len[i], k = b > a ? (target - a) / (b - a) : 0;
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
  };

  const stars = [];
  for (let i = 0; i < COUNT; i++) {
    const f = i / (COUNT - 1);
    const [x, y] = at(f);
    const j = JITTER[i % JITTER.length];
    stars.push({
      x: Math.round(x + j[0]),
      y: Math.round(y + j[1]),
      size: Math.round(BASE_SIZE * VAR[i % VAR.length]),
      path: PATHS[SHAPE_PATTERN[i % SHAPE_PATTERN.length]],
      r: ROTATIONS[i % ROTATIONS.length],
      d: Math.round(f * SPAN + 30 / SPEED), // pops as the comet reaches it
    });
  }
  const line = pts.filter((_, k) => k % 3 === 0);
  return {
    stars,
    linePoints: line.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' '),
    pathD: `M${line.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' L')}`,
  };
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
  const maskId = `trail-mask-${uid}`;

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
    const observer = new ResizeObserver(([entry]) => {
      const W = Math.round(entry.contentRect.width);
      const H = Math.round(entry.contentRect.height);
      setSize((prev) => (prev && prev.W === W && prev.H === H ? prev : { W, H }));
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [narrow]);

  // Mark the entrance as played once it would have finished.
  useEffect(() => {
    if (narrow || !size || entrancePlayed) return undefined;
    const id = window.setTimeout(() => { entrancePlayed = true; }, COMET_DELAY + SPAN + SETTLE);
    return () => window.clearTimeout(id);
  }, [narrow, size]);

  const trail = useMemo(() => (size && !narrow ? buildTrail(size.W, size.H) : null), [size, narrow]);

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
  const idleStart = settled ? 0 : COMET_DELAY + SPAN + SETTLE;

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

          <svg className="star-trail-line" width={size.W} height={size.H} viewBox={`0 0 ${size.W} ${size.H}`}>
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={size.W} height={size.H}>
                <polyline
                  className="star-trail-reveal"
                  points={trail.linePoints}
                  pathLength="1"
                  style={{ '--ld': `${SPAN}ms`, '--ldelay': `${COMET_DELAY}ms` }}
                />
              </mask>
            </defs>
            <polyline className="star-trail-dots" points={trail.linePoints} mask={`url(#${maskId})`} />
          </svg>

          {trail.stars.map((s, i) => (
            <span
              key={i}
              ref={(el) => { starRefs.current[i] = el; }}
              className="star"
              style={{ left: s.x, top: s.y, '--d': `${COMET_DELAY + s.d}ms`, '--t': `${idleStart + i * 80}ms`, '--r': `${s.r}deg` }}
            >
              <span className="star-in">
                <svg width={s.size} height={s.size} viewBox="0 0 24 24">
                  <path className="star-tint" d={s.path} style={{ fill: INK, fillOpacity: TINT, stroke: 'none' }} />
                  <path className="star-sketch" d={s.path} style={{ stroke: INK, strokeWidth: STROKE_W, fill: `url(#${hatchId})` }} />
                </svg>
              </span>
            </span>
          ))}

          {animate && COMETS.map((c, i) => (
            <span
              key={`comet-${i}`}
              className="star-trail-comet"
              style={{
                offsetPath: `path('${trail.pathD}')`,
                '--cd': `${SPAN}ms`,
                '--cdelay': `${COMET_DELAY + c.delay}ms`,
                '--co': c.opacity,
                filter: `drop-shadow(0 0 ${c.glow}px rgba(251,253,233,.95))`,
              }}
            >
              <svg width={c.size} height={c.size} viewBox="0 0 24 24"><path d={COMET_STAR} /></svg>
            </span>
          ))}
        </>
      )}
    </div>
  );
}
